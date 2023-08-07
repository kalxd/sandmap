import { List, Maybe, NonEmptyList } from "purify-ts";
import { SettingOption, readUserData, writeUserData } from "./storage";
import { IORef } from "drifloon/data/ref";
import { UserData } from "./codec";

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

export interface State {
	userData: UserData;
}

export const getState = (): IORef<State> => {
	const data = readUserData();
	return new IORef({ userData: data });
};

const saveState = (state: IORef<State>): void => {
	writeUserData(state.askAt("userData"));
};

export const setLayerVisibleAt = (index: number, isVisible: boolean , state: IORef<State>): void => {
	state.updateAt("userData", s => List.at(index, s.layerList)
		.map(layer => {
			const layern = { ...layer, isVisible };
			s.layerList[index] = layern;
			return s;
		})
		.orDefaultLazy(() => s));

	saveState(state);
};

export const activeLayer = (index: number, state: IORef<State>): void => {
	state.updateAt("userData", s => ({ ...s, active: index }));
	saveState(state);
};

export const addLayer = (name: string, state: IORef<State>): void => {
	state.updateAt("userData", s => {
		const n = s.layerList.length
		const layer = {
			name,
			isVisible: true
		};
		const layerList = s.layerList.concat([layer]);
		return {
			layerList,
			active: n
		};
	});

	saveState(state);
};
