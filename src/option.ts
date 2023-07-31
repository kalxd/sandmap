import * as m from "mithril";
import { MainLayout } from "drifloon";
import { waitting } from "drifloon/module/loading";
import { readAll } from "./internal/storage";
import Main, { OptionFormAttr } from "./option/form";
import { EitherAsync, Right } from "purify-ts";

const App = (): m.Component => {
	const [update, Wait] = waitting<OptionFormAttr>();

	update(() => EitherAsync.fromPromise(async () => {
		const cache = await readAll();
		return Right({
			view: () => m(Main, { cache })
		});
	}));

	return {
		view: () => m(
			MainLayout,
			m("div.ui.basic.segment", m(Wait))
		)
	}
};

m.mount(document.body, App);
