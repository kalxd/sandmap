import * as m from "mithril";
import { MainLayout } from "drifloon";

const App = (): m.Component => {
	return {
		view: () => m(
			MainLayout,
			m("h1", "hello world")
		)
	}
};

m.mount(document.body, App);
