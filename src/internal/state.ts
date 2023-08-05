import { Maybe } from "purify-ts";
import { SettingOption } from "./storage";
import { IORef } from "drifloon/data/ref";

export interface State {
	setting: Maybe<SettingOption>;
}

const BASE_URL = "http://api.tianditu.gov.cn/api?v=4.0&tk=";

const mapLoadState = new IORef<boolean>(false);

export const loadMapScript = (token: string): Promise<void> => {
	if (mapLoadState.ask()) {
		return Promise.resolve();
	}


	const script = document.createElement("script");
	script.src = `${BASE_URL}${token}`;

	document.body.appendChild(script);

	return new Promise(resolve => {
		script.addEventListener("load", () => {
			mapLoadState.put(true);
			resolve();
		});
	});
};
