import * as m from "mithril";
import { IORef } from "drifloon/data/ref";
import { waitting } from "drifloon/module/loading";
import { State, loadMapScript } from "../internal/state";
import { SettingOption } from "../internal/storage";
import { EitherAsync, Maybe, Right } from "purify-ts";
import * as TMap from "../internal/tmap";
import { AppMenu } from "./internal/appmenu";
import { AppLayer } from "./internal/applayer";

const MapWidget: m.Component = {
	oncreate: vnode => {
		console.log(vnode.dom);
		TMap.init(vnode.dom);
	},
	view: () => m("div", { style: "width: 100%; height: calc(100% - 49px); "}),
};

const MapContainer = (): m.Component => {
	const showAppLayerRef = new IORef<boolean>(false);

	return {
		view: () => {
			const appLayer = showAppLayerRef.asks(Maybe.fromFalsy)
				.map(_ => m(AppLayer));

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
				m(MapWidget),
			]);
		}
	};
};

export interface MapAttr {
	state: IORef<State>;
	setting: SettingOption;
}

export const MainMap = (vnode: m.Vnode<MapAttr>): m.Component<MapAttr> => {
	const [update, Wait] = waitting();

	update(() => EitherAsync.fromPromise(async () => {
		await loadMapScript(vnode.attrs.setting.token);
		return Right({ view: () => m(MapContainer) });
	}));

	return {
		view: () => {
			return m(Wait);
		}
	};
};
