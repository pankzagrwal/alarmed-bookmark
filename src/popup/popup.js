(function () {
  const alarmDate = flatpickr("#date", {
    enableTime: true,
    dateFormat: "Y-m-d h:i K",
    time_24hr: true,
    minDate: new Date(),
  });

  const alarmForm = document.getElementById("alarm-form");

  const formButton = document.getElementById("form-submit");

  const iconButton = document.getElementById("ok-icon");

  chrome.tabs.query({ active: true }, function (tabs) {
    const { url } = tabs[0];
    chrome.storage.sync.get(["alarmedURL"], function (result) {
      const data = result.alarmedURL || {};
      const { date } = data[encodeURI(url)] || {};
      const alarmedDate = new Date(date);
      const current = new Date();
      if (date) {
        if (alarmDate > current) {
          alarmDate.setDate(new Date(date));
          iconButton.classList.remove("hide");
        } else {
          alarmDate.clear();
          iconButton.classList.add("hide");
        }
      } else {
        alarmDate.clear();
        iconButton.classList.add("hide");
      }
    });
  });

  alarmForm.addEventListener("submit", function (evt) {
    evt.preventDefault();
    const date = alarmDate.latestSelectedDateObj.toString();
    chrome.runtime.sendMessage(
      {
        name: "createAlarm",
        date,
      },
      function () {
        iconButton.classList.remove("hide");
      }
    );
  });
})();
