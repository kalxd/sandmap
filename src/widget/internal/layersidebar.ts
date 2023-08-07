import * as m from "mithril";
import { modal } from "drifloon/module/modal";
import { AddLayerModal } from "./addlayermodal";
import { Maybe, NonEmptyList } from "purify-ts";
import { State, setLayerVisibleAt } from "../../internal/state";
import { IORef } from "drifloon/data/ref";
import { pickKlass, selectKlass } from "drifloon/internal/attr";
import { LayerData } from "../../internal/codec";

const openAddLayerModal = async () => {
	const r = await modal<Maybe<string>>(AddLayerModal);
	console.log(r);
};

export interface LayerSidebarAttr {
	state: IORef<State>;
}

interface MenuItemAttr {
	isActive: boolean;
	layer: LayerData;
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
					onclick: () => attrs.connectToggleVisible(false)
				});
			}
			else {
				return m("i.icon.eye.slash", {
					onclick: () => attrs.connectToggleVisible(true)
				});
			}
		})(attrs.layer.isVisible);

		return m("div.blue.item", { class: klass }, [
			attrs.layer.name,
			icon
		]);
	}
};

export const LayerSidebar = (): m.Component<LayerSidebarAttr> => {
	return {
		view: ({ attrs }) => {
			const active = attrs.state.asks(s => s.userData.active);
			const layerList = attrs.state.asks(s => NonEmptyList.unsafeCoerce(s.userData.layerList))
				.map((layer, i) => {
					const isActive = active === i;
					return m<MenuItemAttr, {}>(MenuItem, {
						layer,
						isActive,
						connectToggleVisible: b => setLayerVisibleAt(i, b, attrs.state)
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
