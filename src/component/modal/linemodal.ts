import * as m from "mithril";
import { Form } from "drifloon/module/form";
import { Field } from "drifloon/element/form";
import { PlainInput } from "drifloon/element/input";
import { Modal, ModalAction, ModalActionAttr } from "drifloon/widget/modal";
import { ResolveModalAttr } from "drifloon/module/modal";
import { IORef } from "drifloon/data/ref";

export const LineModal = (): m.Component<ResolveModalAttr<string>> => {
	const color = new IORef<string>("#ff0000");

	return {
		view: ({ attrs }) => {
			const actionAttr: ModalActionAttr = {
				connectPositive: () => color.asks(attrs.connectResolve),
				connectNegative: () => color.asks(attrs.connectResolve)
			};

			return m(Modal, attrs, [
				m("div.header", "添加线段"),
				m("div.content", [
					m(Form, [
						m("div.fields", [
							m(Field, [
								m("label", "线条颜色"),
								m(PlainInput, {
									type: "color",
									value: color.ask(),
									connectChange: c => color.put(c)
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
