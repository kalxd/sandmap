import * as m from "mithril";
import { MainLayout } from "drifloon";
import { settingState } from "./internal/state";
import { SettingForm } from "./component/settingform";
import { MapContainer, MapContainerAttr } from "./component/mapcontainer";

const Router: m.Component = {
	view: () => {
		return settingState.askAt("setting")
			.caseOf({
				Just: setting => m.fragment({}, [
					m<MapContainerAttr, {}>(MapContainer, { setting })
				]),
				Nothing: () => m.fragment({}, [
					m(SettingForm)
				])
			});
	}
};

const App = (): m.Component => {
	return {
		view: () => m(
			MainLayout,
			m(Router)
		)
	}
};

m.mount(document.body, App);
