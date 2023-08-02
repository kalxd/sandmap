import { MainLayout } from "drifloon";
import { waitting } from "drifloon/module/loading";
import * as m from "mithril";
import { EitherAsync } from "purify-ts";
import { readSetting } from "./internal/storage";
import MapMain from "./map/main";

const BASE_URL = "https://api.tianditu.gov.cn/api?v=4.0&tk=";

declare  global {
	interface Window {
		TMAP_AUTHKEY: string;
	}
}

const loadMapResouce = async (token: string): Promise<void> => {
	const url = `${BASE_URL}${token}`;

	window.TMAP_AUTHKEY = token;
	const script = document.createElement("script");
	script.src = "/static/map.js";

	await fetch(url)
		.then(r => r.text())
		.then(console.log);

	await new Promise(resolve => {
		document.body.appendChild(script);
		script.addEventListener("load", x => {
			console.log(x);
			resolve(x);
		});
	});
};

const App = (): m.Component => {
	const [update, Wait] = waitting();

	update(() => EitherAsync.fromPromise(async () => {
		const msetting = await readSetting();

		await loadMapResouce("e18ac8e8701747fc4067cff85534f951").catch(e => {
			console.log(e);
			return Promise.reject(e);
		});

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
