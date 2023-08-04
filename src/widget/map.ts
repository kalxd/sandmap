import * as m from "mithril";
import { IORef } from "drifloon/data/ref";
import { waitting } from "drifloon/module/loading";
import { State, loadMapScript } from "../internal/state";
import { SettingOption } from "../internal/storage";
import { EitherAsync, Right } from "purify-ts";

declare global {

	class T {
		static Map: any;
		static LngLat: any;
	}
}

const MapContainer: m.Component = {
	oncreate: vnode => {
		const v = new T.Map(vnode.dom);
		v.centerAndZoom(new T.LngLat(116.40769, 39.89945), 12);
	},
	view: () => {
		return m("div", { style: "width: 100%; height: 100%" });
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
