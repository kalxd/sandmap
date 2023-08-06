import * as m from "mithril";
import { modal } from "drifloon/module/modal";
import { AddLayerModal } from "./addlayermodal";
import { Maybe } from "purify-ts";

const openAddLayerModal = async () => {
	const r = await modal<Maybe<string>>(AddLayerModal as any, {});
	console.log(r);
};

export const LayerSidebar = (): m.Component => {
	return {
		view: () => {
			return m("div.ui.left.fixed.vertical.menu", { style: "z-index: 10000; top: 49px;" }, [
				m("div.divider"),
				m("div.item", [
					m("div.ui.basic.fitted.center.aligned.segment", [
						m("button.ui.icon.labeled.small.primary.button", { onclick: openAddLayerModal }, [
							m("i.icon.plus"),
							"添加新图层"
						])
					])
				])
			])
		}
	};
};
