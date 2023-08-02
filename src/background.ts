browser.browserAction.onClicked.addListener(_ =>
	browser.tabs.create({ url: "/map.html" }));
