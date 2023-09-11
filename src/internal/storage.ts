import {
	string as cstring,
	Codec,
	GetType,
	Maybe,
    NonEmptyList
} from "purify-ts";
import { LayerData, TMapLastData, UserData, tmapLastStateCodec, userDataCodec } from "./codec";

const SETTING_KEY = "setting";

const settiongOption = Codec.interface({
	token: cstring
});

export type SettingOption = GetType<typeof settiongOption>;

export const readSetting = (): Maybe<SettingOption> => {
	const s = localStorage.getItem(SETTING_KEY);
	return Maybe.fromNullable(s)
		.map(JSON.parse)
		.chain(o => settiongOption.decode(o).toMaybe());
};

export const writeSetting = (setting: SettingOption): void => {
	const c = settiongOption.encode(setting);
	const o = JSON.stringify(c);
	localStorage.setItem(SETTING_KEY, o);
};

export const clearSetting = (): void => localStorage.removeItem(SETTING_KEY);

// 最近地图显示的坐标
const LAST_LNGLAT_KEY = "last_lnglat";

export const readLastLngLat = (): TMapLastData => {
	const o = localStorage.getItem(LAST_LNGLAT_KEY);
	return Maybe.fromNullable(o)
		.map(JSON.parse)
		.chain(s => tmapLastStateCodec.decode(s).toMaybe())
		.orDefaultLazy(() => {
			const zoom = 12;
			const lnglat = new T.LngLat(116.40769, 39.89945);
			return { zoom, lnglat };
		});
};

export const writeLastLngLat = (state: TMapLastData): void => {
	const r = tmapLastStateCodec.encode(state);
	localStorage.setItem(LAST_LNGLAT_KEY, JSON.stringify(r));
}

// 用户数据
const USER_DATA_KEY = "user_data";

const layerDef: LayerData = Object.freeze({
	name: "默认",
	isVisible: true,
	itemList: []
});

export const readUserData = (): UserData => {
	const o = localStorage.getItem(USER_DATA_KEY);
	return Maybe.fromNullable(o)
		.map(JSON.parse)
		.chain(s => userDataCodec.decode(s).toMaybe())
		.orDefaultLazy(() => ({
			layerList: NonEmptyList([layerDef]),
			active: 0
		}));
};

export const writeUserData = (data: UserData): void => {
	const r = userDataCodec.encode(data);
	localStorage.setItem(USER_DATA_KEY, JSON.stringify(r));
};
