import * as m from "mithril";
import { Button } from "drifloon/element/button";

const App: m.Component = {
	view: () => {
		return m(Button, "hello world")
	}
};

m.mount(document.body, App);
