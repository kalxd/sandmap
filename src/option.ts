import * as m from "mithril";
import { MainLayout } from "drifloon";
import { waitting } from "drifloon/module/loading";
import { readAll } from "./internal/storage";
import Form, { FormAttr } from "./option/form";
import { EitherAsync, Right } from "purify-ts";

const App = (): m.Component => {
	const [update, Wait] = waitting<FormAttr>();

	update(() => EitherAsync.fromPromise(async () => {
		const cache = await readAll();
		return Right(m(Form, { cache }));
	}));

	return {
		view: () => m(MainLayout, m(Wait))
	}
};

m.mount(document.body, App);
