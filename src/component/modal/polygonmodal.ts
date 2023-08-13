import * as m from "mithril";
import { Modal, ModalAction, ModalActionAttr } from "drifloon/widget/modal";
import { ResolveModalAttr } from "drifloon/module/modal";
import { Form } from "drifloon/module/form";
import { Field } from "drifloon/element/form";
import { PlainInput } from "drifloon/element/input";
import { Just, Maybe, Nothing } from "purify-ts";
import { IORef } from "drifloon/data/ref";

export const PolygonModal = (): m.Component<ResolveModalAttr<Maybe<string>>> => {
	const color = new IORef<string>("#0000ff");

	return {
		view: ({ attrs }) => {
			const actionAttr: ModalActionAttr = {
				connectPositive: () => attrs.connectResolve(color.asks(Just)),
				connectNegative: () => attrs.connectResolve(Nothing)
			};

			return m(Modal, attrs, [
				m("div.header", "添加多边形"),
				m("div.content", [
					m(Form, [
						m("div.fields", [
							m(Field, [
								m("labael", "多边形颜色"),
								m(PlainInput, {
									type: "color",
									value: color.ask(),
									connectChange: s => color.put(s)
								})
							])
						])
					])
				]),
				m(ModalAction, actionAttr)
			]);
		}
	};
};
