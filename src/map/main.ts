import * as m from "mithril";
import { SettingInfo } from "../internal/storage";

export interface MapAttr {
	setting: SettingInfo
}

const Main: m.Component<MapAttr> = {
	view: () => {
		return m("h1", "hello world");
	}
};

export default Main;
