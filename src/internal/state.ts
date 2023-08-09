import { Just, List, Maybe, Nothing } from "purify-ts";
import { SettingOption, readUserData, writeUserData } from "./storage";
import { IORef } from "drifloon/data/ref";
import { LayerData, UserData } from "./codec";

export interface SettingState {
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

export interface AppState {
	userData: UserData;
	tmap: T.Map;
}

export const appState = new IORef<Maybe<AppState>>(Nothing);

const syncAppState = (): void => {
	appState.ask().ifJust(state => {
		writeUserData(state.userData);
	});
};

export const initAppState = (tmap: T.Map): void => {
	const userData = readUserData();
	appState.put(Just({ userData, tmap }));
};

export const addLayer = (name: string): void => {
	const newLayer: LayerData = {
		name,
		isVisible: true
	};

	appState.ask().ifJust(state => {
		const layerList = state.userData.layerList.concat(newLayer);
		state.userData.layerList = layerList;
		return state;
	});

	syncAppState();
};

export const activeLayer = (index: number): void => {
	appState.ask().ifJust(state => {
		state.userData.active = index;
		return state;
	});
	syncAppState();
};

export const setLayerVisible = (
	index: number,
	isVisible: boolean
): void => {
	appState.ask().ifJust(state => {
		List.at(index, state.userData.layerList)
			.ifJust(layer => layer.isVisible = isVisible);
		return state;
	});
	syncAppState();
};
