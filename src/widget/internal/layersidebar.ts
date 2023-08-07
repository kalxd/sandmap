import * as m from "mithril";
import { modal } from "drifloon/module/modal";
import { AddLayerModal } from "./addlayermodal";
import { Maybe } from "purify-ts";
import * as State from "../../internal/state";
import { IORef } from "drifloon/data/ref";
import { pickKlass, selectKlass } from "drifloon/internal/attr";
import { LayerData } from "../../internal/codec";

export interface LayerSidebarAttr {
	state: IORef<State.State>;
}

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

export const LayerSidebar = (vnode: m.Vnode<LayerSidebarAttr>): m.Component<LayerSidebarAttr> => {
	const openAddLayerModal = async () => {
		const r = await modal<Maybe<string>>(AddLayerModal);
		r.ifJust(name => State.addLayer(name, vnode.attrs.state));
	};

	return {
		view: ({ attrs }) => {
			const active = attrs.state.asks(s => s.userData.active);
			const layerList = attrs.state.asks(s => s.userData.layerList)
				.map((layer, i) => {
					const isActive = active === i;
					return m<MenuItemAttr, {}>(MenuItem, {
						layer,
						isActive,
						connectToggleVisible: b => State.setLayerVisibleAt(i, b, attrs.state),
						connectLayerClick: () => State.activeLayer(i, attrs.state)
					});
				});

			return m(
				"div.ui.left.fixed.vertical.menu",
				{ style: "z-index: 10000; top: 49px;" },
				[
					...layerList,
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
