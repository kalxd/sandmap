import * as m from "mithril";
import { modal } from "drifloon/module/modal";
import { AddLayerModal } from "../modal/addlayermodal";
import * as State from "../../internal/state";
import { pickKlass, selectKlass } from "drifloon/internal/attr";
import { Maybe } from "purify-ts";

interface LayerItemAttr {
	isActive: boolean;
	layer: State.AppLayer;
	connectLayerClick: () => void;
	connectToggleVisible: (isVisible: boolean) => void;
}

const LayerItem: m.Component<LayerItemAttr> = {
	view: ({ attrs }) => {
		const klass = pickKlass([
			selectKlass("active", attrs.isActive)
		]);

		const icon = ((isVisible) => {
			if (isVisible) {
				return m("i.icon.eye", {
					onclick: (e: MouseEvent) => {
						e.stopPropagation();
						attrs.connectToggleVisible(false);
					}
				});
			}
			else {
				return m("i.icon.eye.slash", {
					onclick: (e: MouseEvent) => {
						e.stopPropagation();
						attrs.connectToggleVisible(true);
					}
				});
			}
		})(attrs.layer.isVisible);

		const toolList = Maybe.fromFalsy(attrs.isActive)
			.map(_ => attrs.layer.itemList)
			.map(itemList => itemList.map(item => m(
				"div.menu", m("div.item", [
					item.color,
					m("i.icon.delete")
				]))
			));

		return m.fragment({}, [
			m("div.blue.item", { class: klass, onclick: attrs.connectLayerClick }, [
				attrs.layer.name,
				icon
			]),
			toolList.extract()
		]);
	}
};

const openAddLayerModal = async () => {
	const r = await modal(AddLayerModal);
	r.ifJust(State.addLayer);
};

export const LayerSidebar: m.Component = {
	view: () => {
		const layerList = State.appState.ask()
			.map(({ active, layerList }) => layerList.map((layer, i) => {
				const isActive = active === i;
				return m<LayerItemAttr, {}>(LayerItem, {
					layer,
					isActive,
					connectToggleVisible: b => State.setLayerVisible(i, b),
					connectLayerClick: () => State.activeLayer(i)
				});
			}))
			.extract();

		return m(
			"div.ui.left.fixed.vertical.menu",
			{ style: "z-index: 10000; top: 49px;" },
			[
				...(layerList ?? []),
				m("div.divider"),
				m("div.item", [
					m("div.ui.basic.fitted.center.aligned.segment", [
						m("div.ui.tiny.buttons", [
							m("button.ui.secondary.button", { onclick: openAddLayerModal }, "删除图层"),
							m("button.ui.primary.button", "添加图层"),
						]),
					])
				])
			]
		)
	}
};
