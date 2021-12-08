chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.text === "report_back") {
    sendResponse({
      url: document.URL,
      time: document.getElementsByClassName("video-stream")[0]["currentTime"],
    });
    return true;
  }
});
