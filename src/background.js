let website;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.name === "createAlarm") {
    const date = message.date;
    const alarmTime = new Date(date);
    const timeStamp = alarmTime.getTime();

    chrome.tabs.query({ active: true }, function (tabs) {
      const { url, title, favIconUrl } = tabs[0] || {};

      chrome.storage.sync.get(["alarmedURL"], function (result) {
        const data = result.alarmedURL || {};
        data[encodeURI(url)] = {
          title,
          favIconUrl,
          url,
          date,
        };
        chrome.storage.sync.set({ alarmedURL: data }, function () {});
      });

      chrome.alarms.create(encodeURI(url), {
        when: timeStamp,
      });
    });
    sendResponse();
  }
  return true;
});

chrome.alarms.onAlarm.addListener(function (res) {
  chrome.storage.sync.get(["alarmedURL"], function (result) {
    const data = result.alarmedURL;
    if (data[res.name]) {
      const meta = data[res.name];
      website = meta.url;
      chrome.notifications.create(
        {
          title: "Reminder",
          contextMessage: `Click to read the article`,
          message: meta.title,
          type: "basic",
          iconUrl: "icons/icon.png",
          priority: 1,
          requireInteraction: true,
        },
        function (evt) {}
      );
    }
  });
});

chrome.notifications.onClicked.addListener(function (id) {
  chrome.notifications.clear(id);

  chrome.storage.sync.get(["alarmedURL"], function (result) {
    const data = result.alarmedURL;
    delete data[encodeURI(website)];
    chrome.storage.sync.set({ alarmedURL: data }, function () {});
  });

  chrome.tabs.create({
    url: website,
  });
});

chrome.notifications.onClosed.addListener(function (id) {
  chrome.storage.sync.get(["alarmedURL"], function (result) {
    const data = result.alarmedURL;
    delete data[encodeURI(website)];
    chrome.storage.sync.set({ alarmedURL: data }, function () {});
  });
});
