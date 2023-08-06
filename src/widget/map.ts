import * as m from "mithril";
import { IORef } from "drifloon/data/ref";
import { waitting } from "drifloon/module/loading";
import { State, loadMapScript } from "../internal/state";
import { SettingOption } from "../internal/storage";
import { EitherAsync, Right } from "purify-ts";
import * as TMap from "../internal/tmap";
import { AppMenu } from "./internal/appmenu";

const MapWidget: m.Component = {
	oncreate: vnode => {
		console.log(vnode.dom);
		TMap.init(vnode.dom);
	},
	view: () => m("div", { style: "width: 100%; height: calc(100% - 42px); "}),
};

const MapContainer: m.Component = {
	view: () => {
		return m.fragment({}, [
			m("div", m("div.ui.top.attached.menu", [
				m("div.item", "工具栏"),
				m("div.item", m("div.ui.icon.input", [
					m("input", { placeholder: "搜索" }),
					m("i.icon.search")
				])),
				m("ui.right.menu", [
					m(AppMenu)
				])
			])),
			m(MapWidget)
		]);
	}
};

export interface MapAttr {
	state: IORef<State>;
	setting: SettingOption;
}

export const MainMap = (vnode: m.Vnode<MapAttr>): m.Component<MapAttr> => {
	const [update, Wait] = waitting();

	update(() => EitherAsync.fromPromise(async () => {
		await loadMapScript(vnode.attrs.setting.token);
		return Right(MapContainer);
	}));

	return {
		view: () => {
			return m(Wait);
		}
	};
};
