import * as m from "mithril";
import { MainLayout } from "drifloon";
import { readSetting } from "./internal/storage";
import { IORef } from "drifloon/data/ref";
import { SettingState } from "./internal/state";
import { SettingForm } from "./component/settingform";
import { MapContainer, MapContainerAttr } from "./component/mapcontainer";

interface RouterAttr {
	state: IORef<SettingState>
}

const Router: m.Component<RouterAttr> = {
	view: ({ attrs }) => {
		return attrs.state.askAt("setting")
			.caseOf({
				Just: setting => m.fragment({}, [
					m<MapContainerAttr, {}>(MapContainer, { setting, state: attrs.state })
				]),
				Nothing: () => m.fragment({}, [
					m(SettingForm, attrs)
				])
			});
	}
};


const App = (): m.Component => {
	const setting = readSetting();

	const state = new IORef<SettingState>({
		setting
	});

	return {
		view: () => m(
			MainLayout,
			m(Router, { state })
		)
	}
};

m.mount(document.body, App);
