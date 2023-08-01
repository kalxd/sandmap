import * as m from "mithril";
import { FormData } from "drifloon/data/ref";
import { RequireField } from "drifloon/element/form";
import { PlainInput } from "drifloon/element/input";
import { Form } from "drifloon/module/form";
import { Header2 } from "drifloon/element/header";
import { Grid, Column, GridAttr, GridMiddleAlignType, ColumnAttr } from "drifloon/element/grid";
import { Button } from "drifloon/element/button";
import { Segment, SegmentShape } from "drifloon/element/segment";
import { SettingInfo, saveSetting } from "../internal/storage";
import { Either, Maybe } from "purify-ts";
import { EmLevel, Wide } from "drifloon/data/var";
import { isNotEmpty, must } from "drifloon/data/validate";

export interface OptionFormAttr {
	cache: Maybe<SettingInfo>;
}

const checkForm = (cache: SettingInfo): Either<Array<string>, SettingInfo> =>
	must("token", isNotEmpty(cache.token))
		.collect(token => ({ token }));

const Main = (vnode: m.Vnode<OptionFormAttr>): m.Component<OptionFormAttr> => {
	const formdata = new FormData<SettingInfo>(vnode.attrs.cache.orDefault({ token: "" }));

	return {
		view: () => {
			const gridAttr: GridAttr = {
				isCenter: true,
				middleAlign: GridMiddleAlignType.Middle
			};

			const colAttr: ColumnAttr = {
				wide: Wide.Fourteen
			};

			const validateE = () => formdata.validate(checkForm)
				.ifRight(saveSetting);

			return m(Grid, gridAttr, m(Column, colAttr, [
				Header2("天地沙盒设置中心"),
				m(Segment, { shape: SegmentShape.Stack }, [
					m(Form, { formdata }, [
						m(RequireField, [
							m("label", "您的token"),
							m(PlainInput, {
								value: formdata.askAt("token"),
								connectChange: s => formdata.putAt("token", s)
							})
						]),
						m("div.field", [
							m(Button, { connectClick: validateE, em: EmLevel.Primary }, "保存")
						])
					]),
				])
			]));
		}
	};
};

export default Main;
