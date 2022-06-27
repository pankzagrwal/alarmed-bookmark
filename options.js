(function () {
  function onCancelHandler(evt) {
    const id = evt.target.dataset.id;
    chrome.alarms.clear(id, function () {});
    chrome.storage.sync.get(["alarmedURL"], function (result) {
      const data = result.alarmedURL;
      delete data[encodeURI(id)];
      chrome.storage.sync.set({ alarmedURL: data }, function () {
        location.reload();
      });
    });
  }
  chrome.storage.sync.get(["alarmedURL"], function (result) {
    const data = result.alarmedURL || {};

    var table = document.getElementById("alarm-table");
    if (Object.keys(data).length === 0) {
      const tr = document.createElement("tr");
      table.appendChild(tr);
      const tdTitle = document.createElement("td");
      const title = document.createTextNode("No Alarmed articles..");
      tdTitle.appendChild(title);
      tr.appendChild(tdTitle);
    }

    for (let key in data) {
      const tr = document.createElement("tr");
      table.appendChild(tr);

      const item = data[key];

      const tdTitle = document.createElement("td");
      const tdTime = document.createElement("td");
      const tdCancel = document.createElement("td");

      //create Title
      const title = document.createTextNode(item.title);
      const link = document.createElement("a");
      link.href = key;
      link.target = "_blank";
      link.appendChild(title);
      tdTitle.appendChild(link);
      tr.appendChild(tdTitle);

      //create alarmed time

      const time = `${item.date} ${item.time}`;
      tdTime.innerHTML = time;
      tr.appendChild(tdTime);

      //create cancel button

      const button = document.createElement("button");
      button.innerHTML = "Cancel";
      button.dataset.id = key;
      button.onclick = onCancelHandler;
      tdCancel.appendChild(button);
      tr.appendChild(tdCancel);
    }
  });
})();
