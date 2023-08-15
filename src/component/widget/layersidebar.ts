import * as m from "mithril";
import { modal, alertText, confirmTextAsync } from "drifloon/module/modal";
import { AddLayerModal } from "../modal/addlayermodal";
import * as State from "../../internal/state";
import { pickKlass, selectKlass } from "drifloon/internal/attr";
import { Maybe } from "purify-ts";

interface LayerItemAttr {
	isActive: boolean;
	index: number;
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
			.map(itemList => itemList.map((item, i) => m(
				"div.menu", m("div.item", [
					State.caseToolItem(item, {
						polyline: item => m("span", { style: `color: ${item.color}` }, "直线"),
						polygon: item => m("span", { style: `color: ${item.color}` }, "多边形")
					}),
					m("i.icon.delete", { onclick: () => State.removeToolAt(attrs.index, i) })
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

const removeLayer = async () => {
	confirmTextAsync("确认删除当前图层？")
		.chain(async () =>
			State.removeCurrentLayer()
				.ifLeft(alertText)
				.toMaybe())
		.run();
};

export const LayerSidebar: m.Component = {
	view: () => {
		const layerList = State.appState.ask()
			.map(({ active, layerList }) => layerList.map((layer, i) => {
				const isActive = active === i;
				return m<LayerItemAttr, {}>(LayerItem, {
					layer,
					isActive,
					index: i,
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
							m("button.ui.secondary.button", { onclick: removeLayer } , "删除图层"),
							m("button.ui.primary.button", { onclick: openAddLayerModal }, "添加图层"),
						]),
					])
				])
			]
		)
	}
};
