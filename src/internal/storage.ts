import { string as cstring, Codec, GetType, Maybe } from "purify-ts";

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
	const o = JSON.stringify(setting);
	localStorage.setItem(SETTING_KEY, o);
};
