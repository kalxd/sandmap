import { IORef } from "drifloon/data/ref";
import { Nothing, MaybeAsync, Just, Maybe } from "purify-ts";

const openTab = new IORef<Maybe<browser.tabs.Tab>>(Nothing);

const openNewPage = (): MaybeAsync<browser.tabs.Tab> =>
	MaybeAsync.fromPromise(async () => {
		const tab = openTab.ask();
		if (tab.isJust()) {
			return tab;
		}

		const newtab = await browser.tabs.create({ url: "/map.html" })
			.then(Just);
		openTab.put(newtab);
		return newtab;
	});

browser.browserAction.onClicked.addListener(_ => {
	openNewPage()
		.chain(async tab => Maybe.fromNullable(tab.id))
		.ifJust(tabId => browser.tabs.update(tabId, { active: true }))
		.run();
});
