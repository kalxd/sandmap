import * as m from "mithril";
import { MainLayout } from "drifloon";
import { readSetting } from "./internal/storage";
import { IORef } from "drifloon/data/ref";
import { State } from "./internal/state";
import { SettingForm } from "./widget/settingform";

interface RouterAttr {
	state: IORef<State>
}

const Router: m.Component<RouterAttr> = {
	view: ({ attrs }) => {
		return attrs.state.askAt("setting")
			.caseOf({
				Just: _ => m("h1", "hello world"),
				Nothing: () => m(SettingForm, attrs)
			})
	}
};


const App = (): m.Component => {
	const setting = readSetting();

	const state = new IORef<State>({
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
