import * as m from "mithril";
import { RequireField } from "drifloon/element/form";
import { PlainInput } from "drifloon/element/input";
import { Modal, ModalAction, ModalActionAttr } from "drifloon/widget/modal";
import { Form } from "drifloon/module/form";
import { FormData } from "drifloon/data/ref";
import { ResolveModalAttr } from "drifloon/module/modal";
import { must, isNotEmpty } from "drifloon/data/validate";
import { Either, Just, Maybe, Nothing, identity } from "purify-ts";

interface FormInput {
	name: string;
}

const validateForm = (input: FormInput): Either<Array<string>, string> =>
	must("图层名称", isNotEmpty(input.name)).collect(identity)

export const AddLayerModal = (): m.Component<ResolveModalAttr<Maybe<string>>> => {
	const fd = new FormData<FormInput>({ name: "" });

	return {
		view: ({ attrs }) => {
			const actionAttr: ModalActionAttr = {
				connectPositive: () => fd.validate(validateForm)
					.ifRight(v => attrs.connectResolve(Just(v))),
				connectNegative: () => attrs.connectResolve(Nothing),
			};

			return m(Modal, attrs, [
				m("div.header", "添加新图层"),
				m("div.ui.content.basic.segment", [
					m(Form, { formdata: fd }, [
						m(RequireField, [
							m("label", "图层名称"),
							m(PlainInput, {
								value: fd.askAt("name"),
								connectChange: s => fd.putAt("name", s)
							})
						])
					])
				]),
				m(ModalAction, actionAttr)
			]);
		}
	};
};

