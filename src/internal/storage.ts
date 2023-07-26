import { Codec, Maybe } from "purify-ts";
import * as V from "purify-ts";

export type Token = string;

const userCache = Codec.interface({
	token: V.string
});

export type UserCache = V.GetType<typeof userCache>;

export const readAll = (): Promise<Maybe<UserCache>> =>
	browser.storage.local.get()
		.then(V.maybe(userCache).decode)
		.then(s => s.toMaybe().join())

export const writeAll = (data: UserCache): Promise<void> =>
	browser.storage.local.set(data);
