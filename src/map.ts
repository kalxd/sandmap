import { MainLayout } from "drifloon";
import { waitting } from "drifloon/module/loading";
import * as m from "mithril";
import { EitherAsync } from "purify-ts";
import { readSetting } from "./internal/storage";
import MapMain from "./map/main";

const App = (): m.Component => {
	const [update, Wait] = waitting();

	update(() => EitherAsync.fromPromise(async () => {
		const msetting = await readSetting();

		return msetting.toEither("尚未填写token，请到选项中设置！")
			.map(setting => ({
				view: () => m(MapMain, { setting })
			}));
	}));

	return {
		view: () => m(
			MainLayout,
			m(Wait)
		)
	};
};

m.mount(document.body, App);
