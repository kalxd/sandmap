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
import { SearchInput } from "./widget/searchinput";

const MapXX = (): m.Component => {
	const showAppLayerRef = new IORef<boolean>(false);
	return {
		view: () => {
			const appLayer = showAppLayerRef.asks(Maybe.fromFalsy)
				.map(_ => m(LayerSidebar));

			const appLayerToggleE = () => showAppLayerRef.update(b => !b);

			const search = State.appState.ask()
				.map(state => m("div.item", m(SearchInput, { tmap: state.tmap } )));

			return m.fragment({}, [
				appLayer.extract(),
				m("div", m("div.ui.top.attached.menu", [
					m("div.icon.link.item", { onclick: appLayerToggleE }, [
						m("i.icon.map.signs"),
						"图层"
					]),
					search.extract(),
					m("ui.right.menu", m(AppMenu))
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
