import { Maybe } from "purify-ts";
import { SettingOption } from "./storage";

export interface State {
	setting: Maybe<SettingOption>;
}
