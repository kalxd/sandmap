import * as m from "mithril";
import { UserCache } from "../internal/storage";
import { Maybe } from "purify-ts";

export interface FormAttr {
	cache: Maybe<UserCache>;
}

const Form: m.Component<FormAttr> = {
	view: ({ attrs }) => {
		console.log(attrs.cache);
		return m("div", "helle world");
	}
};

export default Form;
