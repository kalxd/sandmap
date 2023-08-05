import {
	string as cstring,
	Codec,
	GetType,
	Maybe
} from "purify-ts";
import { TMapLastState, tmapLastStateCodec } from "./codec";

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


// 最近地图显示的坐标
const LAST_LNGLAT_KEY = "last_lnglat";

export const readLastLngLat = (): TMapLastState => {
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

export const writeLastLngLat = (state: TMapLastState): void => {
	const r = tmapLastStateCodec.encode(state);
	localStorage.setItem(LAST_LNGLAT_KEY, JSON.stringify(r));
}
