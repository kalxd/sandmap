import * as m from "mithril";

export const AppLayer = (): m.Component => {
	return {
		view: () => {
			return m("div.ui.left.fixed.vertical.menu", { style: "z-index: 10000; top: 49px;" }, [
				m("div.item", "hello world"),
				m("div.item", "hello world")
			])
		}
	};
};
