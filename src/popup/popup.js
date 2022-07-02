(function () {
  const alarmDate = document.getElementById("alarm-date");

  const alarmTime = document.getElementById("alarm-time");

  const alarmForm = document.getElementById("alarm-form");

  const formButton = document.getElementById("form-submit");

  const iconButton = document.getElementById("ok-icon");

  chrome.tabs.query({ active: true }, function (tabs) {
    const { url } = tabs[0];
    chrome.storage.sync.get(["alarmedURL"], function (result) {
      const data = result.alarmedURL || {};
      const { date, time } = data[encodeURI(url)] || {};
      const alarmedDate = new Date(date);
      const today = new Date();
      if (date) {
        alarmDate.setAttribute("value", date);
        alarmTime.setAttribute("value", time);
        iconButton.classList.remove("hide");
        formButton.innerHTML = "Update";
        alarmTime.removeAttribute("disabled");
        if (alarmedDate.getDate() === today.getDate()) {
          alarmTime.setAttribute(
            "min",
            `${today.getHours()}:${today.getMinutes()}`
          );
        }
      } else {
        alarmDate.setAttribute("value", "");
        alarmTime.setAttribute("value", "");
        iconButton.classList.add("hide");
        formButton.innerHTML = "Save";
      }
    });
  });

  alarmDate.setAttribute("min", new Date().toISOString().split("T")[0]);

  alarmDate.addEventListener("change", function (evt) {
    const inputDate = evt.target.value;
    const date = new Date(inputDate);
    const today = new Date();
    alarmTime.removeAttribute("disabled");
    if (date.getDate() === today.getDate()) {
      alarmTime.setAttribute(
        "min",
        `${today.getHours()}:${today.getMinutes()}`
      );
    } else {
      alarmTime.removeAttribute("min");
    }
  });

  alarmForm.addEventListener("submit", function (evt) {
    evt.preventDefault();
    iconButton.classList.remove("animation");
    const date = alarmDate.value;
    const time = alarmTime.value;

    chrome.runtime.sendMessage(
      {
        name: "createAlarm",
        date,
        time,
      },
      function () {
        iconButton.classList.remove("hide");
        iconButton.classList.add("animation");
      }
    );
  });
})();
