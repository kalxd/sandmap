import { Maybe } from "purify-ts";
import { SettingOption } from "./storage";

export interface State {
	setting: Maybe<SettingOption>;
}

const BASE_URL = "http://api.tianditu.gov.cn/api?v=4.0&tk=";

export const loadMapScript = (token: string): Promise<void> => {
	const script = document.createElement("script");
	script.src = `${BASE_URL}${token}`;

	document.body.appendChild(script);

	return new Promise(resolve => {
		script.addEventListener("load", () => resolve());
	});
};
