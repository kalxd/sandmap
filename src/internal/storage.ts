import { Codec, string as cstring, GetType, maybe, Maybe } from "purify-ts";

const SETTING_KEY = "setting";

// 用户的设置。
const settingInfo = Codec.interface({
	token: cstring
});

export type SettingInfo = GetType<typeof settingInfo>;

export const readSetting = (): Promise<Maybe<SettingInfo>> =>
	browser.storage.local.get(SETTING_KEY)
		.then(s => s[SETTING_KEY])
		.then(maybe(settingInfo).decode)
		.then(a => a.toMaybe().join())

export const saveSetting = (setting: SettingInfo): Promise<void> =>
	browser.storage.local.set({
		[SETTING_KEY]: setting
	});
