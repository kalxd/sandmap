import { MaybeAsync, Codec, Maybe } from "purify-ts";
import * as V from "purify-ts";

export type Token = string;

const localData = Codec.interface({
	token: V.string
});

export type LocalData = V.GetType<typeof localData>;

export const readAll = (): MaybeAsync<LocalData> =>
	MaybeAsync.fromPromise(() =>
		browser.storage.local.get()
			.then(V.nullable(localData).decode)
			.then(s => s.toMaybe().chain(Maybe.fromNullable)));

export const writeAll = (data: LocalData): Promise<void> =>
	browser.storage.local.set(data);
