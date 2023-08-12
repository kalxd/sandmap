import * as m from "mithril";
import { modal } from "drifloon/module/modal";
import { AddLayerModal } from "../modal/addlayermodal";
import * as State from "../../internal/state";
import { pickKlass, selectKlass } from "drifloon/internal/attr";
import { LayerData } from "../../internal/codec";

interface MenuItemAttr {
	isActive: boolean;
	layer: LayerData;
	connectLayerClick: () => void;
	connectToggleVisible: (isVisible: boolean) => void;
}

const MenuItem: m.Component<MenuItemAttr> = {
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

		return m("div.blue.item", { class: klass, onclick: attrs.connectLayerClick }, [
			attrs.layer.name,
			icon
		]);
	}
};

export const LayerSidebar = (): m.Component => {
	const openAddLayerModal = async () => {
		const r = await modal(AddLayerModal);
		r.ifJust(State.addLayer);
	};

	return {
		view: () => {
			const layerList = State.appState.ask()
				.map(({ active, layerList }) => layerList.map((layer, i) => {
					const isActive = active === i;
					return m<MenuItemAttr, {}>(MenuItem, {
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
							m("button.ui.icon.labeled.small.primary.button", { onclick: openAddLayerModal }, [
								m("i.icon.plus"),
								"添加新图层"
							])
						])
					])
				]
			)
		}
	};
};
