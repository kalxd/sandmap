import * as m from "mithril";
import { IORef } from "drifloon/data/ref";
import { waitting } from "drifloon/module/loading";
import { loadMapScript } from "../internal/state";
import { SettingOption } from "../internal/storage";
import { EitherAsync, Maybe, Right } from "purify-ts";
import { AppMenu } from "./widget/appmenu";
import { LayerSidebar } from "./widget/layersidebar";
import { MapNode } from "./widget/mapnode";
import * as State from "../internal/state";

const MapXX = (): m.Component => {
	const showAppLayerRef = new IORef<boolean>(false);
	return {
		view: () => {
			const appLayer = showAppLayerRef.asks(Maybe.fromFalsy)
				.map(_ => m(LayerSidebar));

			const appLayerToggleE = () => showAppLayerRef.update(b => !b);

			return m.fragment({}, [
				appLayer.extract(),
				m("div", m("div.ui.top.attached.menu", [
					m("div.icon.link.item", { onclick: appLayerToggleE }, [
						m("i.icon.map.signs"),
						"图层"
					]),
					m("div.item", m("div.ui.icon.input", [
						m("input", { placeholder: "搜索" }),
						m("i.icon.search")
					])),
					m("ui.right.menu", [
						m(AppMenu)
					])
				])),
				m(MapNode, { connectFinish: State.initAppState }),
			]);
		}
	};
};

export interface MapContainerAttr {
	setting: SettingOption;
}

export const MapContainer = (vnode: m.Vnode<MapContainerAttr>): m.Component<MapContainerAttr> => {
	const [update, Wait] = waitting();

	update(() => EitherAsync.fromPromise(async () => {
		await loadMapScript(vnode.attrs.setting.token);
		return Right({ view: () => m(MapXX) });
	}));

	return {
		view: () => {
			return m(Wait);
		}
	};
};
