browser.browserAction.onClicked.addListener((tab) => {
  browser.tabs.sendMessage(tab.id, { action: "toggleBold" }).then(response => {
    browser.browserAction.setIcon({
      path: response.isBoldEnabled ? "on.png" : "off.png",
      tabId: tab.id
    });
  });
});
