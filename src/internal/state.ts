import { Just, List, Maybe, NonEmptyList, Nothing } from "purify-ts";
import { SettingOption, readUserData, writeUserData } from "./storage";
import { IORef } from "drifloon/data/ref";
import { Polyline, UserData } from "./codec";

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

export interface PolylineToolItem extends Polyline {
	instance: T.Polyline;
}

interface AppLayer {
	name: string;
	isVisible: boolean;
	itemList: Array<PolylineToolItem>;
}

export interface AppState {
	active: number;
	layerList: NonEmptyList<AppLayer>;
	tmap: T.Map;
}

export const appState = new IORef<Maybe<AppState>>(Nothing);

const appStateIntoUserData = (state: AppState): UserData => {
	const layerList = state.layerList.map(layer => {
		const itemList = layer.itemList.map(item => ({
			type: item.type,
			color: item.color,
			lineList: item.lineList
		}));
		return {
			name: layer.name,
			isVisible: layer.isVisible,
			itemList
		};
	});

	return {
		active: state.active,
		layerList
	};
};

const userDataIntoAppState = (tmap: T.Map, data: UserData): AppState => {
	const layerList = data.layerList.map(layer => {
		const itemList = layer.itemList.map(item => {
			const tool = new T.Polyline(item.lineList);

			if (layer.isVisible) {
				tmap.addOverLay(tool);
			}

			return {
				...item,
				instance: tool
			};
		});

		return {
			...layer,
			itemList
		};
	});

	return {
		active: data.active,
		layerList,
		tmap
	};
};

const syncLayerItemVisible = (state: AppState): void => {
	const { tmap } = state;
	state.layerList.forEach(layer => {
		if (layer.isVisible) {
			layer.itemList.forEach(item => {
				tmap.addOverLay(item.instance);
			});
		}
		else {
			layer.itemList.forEach(item => {
				tmap.removeOverLay(item.instance);
			});
		}
	});
}

const syncAppState = (): void => {
	appState.ask()
		.ifJust(syncLayerItemVisible)
		.map(appStateIntoUserData)
		.ifJust(writeUserData);
};

export const initAppState = (tmap: T.Map): void => {
	const userData = readUserData();
	const state = userDataIntoAppState(tmap, userData);
	appState.put(Just(state));
};

export const addLayer = (name: string): void => {
	const newLayer: AppLayer = {
		name,
		isVisible: true,
		itemList: []
	};

	appState.ask().ifJust(state => {
		const layerList = state.layerList.concat(newLayer);
		state.layerList = layerList;
		return state;
	});

	syncAppState();
};

export const activeLayer = (index: number): void => {
	appState.ask().ifJust(state => {
		state.active = index;
		return state;
	});
	syncAppState();
};

export const setLayerVisible = (
	index: number,
	isVisible: boolean
): void => {
	appState.ask().ifJust(state => {
		List.at(index, state.layerList)
			.ifJust(layer => layer.isVisible = isVisible);
		return state;
	});
	syncAppState();
};

export const addPolyline = (item: Polyline): void => {
	appState.ask().ifJust(state => {
		List.at(state.active, state.layerList)
			.ifJust(layer => {
				const instance = new T.Polyline(item.lineList);
				layer.itemList = layer.itemList.concat({
					...item,
					instance
				});
				return layer;
			});
	});
	syncAppState();
};
