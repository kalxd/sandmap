import { Codec, Maybe, MaybeAsync, string as cstring, GetType, maybe } from "purify-ts";

const SETTING_KEY = "setting";

// 用户的设置。
const settingInfo = Codec.interface({
	token: cstring
});

export type SettingInfo = GetType<typeof settingInfo>;

export const readSetting = (): MaybeAsync<SettingInfo> =>
	MaybeAsync.fromPromise(() =>
		browser.storage.local.get(SETTING_KEY)
			.then(s => s[SETTING_KEY])
			.then(maybe(settingInfo).decode)
			.then(s => s.toMaybe().join()));

export const saveSetting = (setting: SettingInfo): Promise<void> =>
	browser.storage.local.set({
		[SETTING_KEY]: setting
	});

export const readAll = (): Promise<Maybe<SettingInfo>> =>
	browser.storage.local.get()
		.then(maybe(settingInfo).decode)
		.then(s => s.toMaybe().join())

export const writeAll = (data: SettingInfo): Promise<void> =>
	browser.storage.local.set(data);
