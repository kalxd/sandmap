import { Either, Just, List, Maybe, NonEmptyList, Nothing } from "purify-ts";
import * as Storage from "./storage";
import { IORef } from "drifloon/data/ref";
import { ItemType, Polygon, Polyline, UserData } from "./codec";
import * as TMap from "./tmap";

const takeAt = <T>(xs: Array<T>, index: number): Maybe<[T, Array<T>]> => {
	const item = List.find((_, i) => i === index, xs);
	return item.map(item => {
		const ys = xs.filter((_, i) => i !== index);
		return [item, ys];
	});
};

export interface SettingState {
	setting: Maybe<Storage.SettingOption>;
}

export const initSetting = (): IORef<SettingState> => {
	const state = Storage.readSetting();
	return new IORef({ setting: state });
};

export const settingState = initSetting();

export const clearSetting = (): void => {
	settingState.putAt("setting", Nothing);
	Storage.clearSetting();
};

const BASE_URL = "//api.tianditu.gov.cn/api?v=4.0&tk=";

const mapLoadState = new IORef<boolean>(false);

export const loadMapScript = (token: string): Promise<void> => {
	if (mapLoadState.ask()) {
		return Promise.resolve();
	}

	const mapUrl = (() => {
		const { protocol } = window.location;

		if (protocol === "https:") {
			return `https:${BASE_URL}`;
		}
		else {
			return `http:${BASE_URL}`;
		}
	})();

	const script = document.createElement("script");
	script.src = `${mapUrl}${token}`;

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

export interface PolygonToolItem extends Polygon {
	instance: T.Polygon;
}

type ToolItem = PolylineToolItem | PolygonToolItem;

interface ToolItemCaseFunction<R> {
	polyline: (item: PolylineToolItem) => R;
	polygon: (item: PolygonToolItem) => R;
}

export const caseToolItem = <R>(item: ToolItem, f: ToolItemCaseFunction<R>): R => {
	if (item.type === "polyline") {
		return f.polyline(item);
	}
	else {
		return f.polygon(item);
	}
};

interface ItemTypeCaseFunction<R> {
	polyline: (item: Polyline) => R;
	polygon: (item: Polygon) => R;
}

const caseItemType = <R>(item: ItemType, f: ItemTypeCaseFunction<R>): R => {
	if (item.type === "polyline") {
		return f.polyline(item);
	}
	else {
		return f.polygon(item);
	}
};

export interface AppLayer {
	name: string;
	isVisible: boolean;
	itemList: Array<ToolItem>;
}

export interface AppState {
	active: number;
	layerList: NonEmptyList<AppLayer>;
	tmap: T.Map;
}

export const appState = new IORef<Maybe<AppState>>(Nothing);

const appStateIntoUserData = (state: AppState): UserData => {
	const layerList = state.layerList.map(layer => {
		const itemList = layer.itemList.map(item => caseToolItem<ItemType>(item, {
			polyline: item => ({
				type: item.type,
				color: item.color,
				lineList: item.lineList
			}),
			polygon: item => ({
				type: item.type,
				color: item.color,
				pointList: item.pointList
			})
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
			const toolitem = caseItemType<ToolItem>(item, {
				polyline: item => {
					const tool = TMap.initPolyline(item);
					return {
						...item,
						instance: tool
					};
				},
				polygon: item => {
					const tool = TMap.initPolygon(item);
					return {
						...item,
						instance: tool
					};
				}
			});

			if (layer.isVisible) {
				tmap.addOverLay(toolitem.instance);
			}

			return toolitem;
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
		.ifJust(Storage.writeUserData);
};

export const initAppState = (tmap: T.Map): void => {
	const userData = Storage.readUserData();
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
	appState.ask()
		.chain(state => List.at(state.active, state.layerList))
		.ifJust(layer => {
			const instance = TMap.initPolyline(item);
			layer.itemList = layer.itemList.concat({
				...item,
				instance
			});
			return layer;
		});
	syncAppState();
};

export const addPolygon = (item: Polygon): void => {
	appState.ask()
		.chain(state => List.at(state.active, state.layerList))
		.ifJust(layer => {
			const instance = TMap.initPolygon(item);
			layer.itemList = layer.itemList.concat({
				...item,
				instance
			});
			return layer;
		});
	syncAppState();
};

export const removeToolAt = (layerIndex: number, itemIndex: number): void => {
	appState.ask()
		.ifJust(state => {
			const { tmap } = state;
			List.at(layerIndex, state.layerList)
				.ifJust(layer => {
					takeAt(layer.itemList, itemIndex)
						.ifJust(([item, itemList]) => {
							tmap.removeOverLay(item.instance);
							layer.itemList = itemList;
						});
				});
		});
	syncAppState();
};

export const removeCurrentLayer = (): Either<string, void> => {
	return appState.ask()
		.filter(state => state.layerList.length > 1)
		.map(state => {
			const { tmap, active } = state;
			takeAt(state.layerList, active)
				.ifJust(([layer, layerList]) => {
					if (layer.isVisible) {
						layer.itemList.forEach(item => {
							tmap.removeOverLay(item.instance);
						});
					}

					state.layerList = NonEmptyList.unsafeCoerce(layerList);
					state.active = Math.max(0, state.active - 1);

					syncAppState();
				});
		})
		.toEither("无法删除（最后）图层");
};
