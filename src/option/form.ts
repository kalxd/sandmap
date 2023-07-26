import * as m from "mithril";
import { FormData } from "drifloon/data/ref";
import { Form } from "drifloon/module/form";
import { Header2 } from "drifloon/element/header";
import { Grid, Column, GridAttr, GridMiddleAlignType, ColumnAttr } from "drifloon/element/grid";
import { Button } from "drifloon/element/button";
import { Segment, SegmentShape } from "drifloon/element/segment";
import { UserCache } from "../internal/storage";
import { Maybe } from "purify-ts";
import { Wide } from "drifloon/data/var";

export interface OptionFormAttr {
	cache: Maybe<UserCache>;
}

const Main = (vnode: m.Vnode<OptionFormAttr>): m.Component<OptionFormAttr> => {
	const formdata = new FormData<Maybe<UserCache>>(vnode.attrs.cache);

	return {
		view: ({ attrs }) => {
			const gridAttr: GridAttr = {
				isCenter: true,
				middleAlign: GridMiddleAlignType.Middle
			};

			const colAttr: ColumnAttr = {
				wide: Wide.Ten
			};

			return m(Grid, gridAttr, m(Column, colAttr, [
				Header2("天地沙盒设置中心"),
				m(Segment, { shape: SegmentShape.Stack }, [
					m(Form, [
						m("div.field.required", [
							m("label", "您的token"),
							m("input")
						]),
						m("div.field", [
							m(Button, "确定")
						])
					]),
				])
			]));
		}
	};
};

export default Main;
