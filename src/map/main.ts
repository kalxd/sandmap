import * as m from "mithril";
import { SettingInfo } from "../internal/storage";

declare global {
	class T {
		static Map: any
	}
}

export interface MapAttr {
	setting: SettingInfo
}

const Main: m.Component<MapAttr> = {
	oncreate: vnode => {
		new T.Map(vnode.dom);
	},
	view: () => {
		return m("h1", "hello world");
	}
};

export default Main;
