import * as m from "mithril";
import { Either, Just } from "purify-ts";
import { FormData } from "drifloon/data/ref";
import { RequireField, Field } from "drifloon/element/form";
import { PlainInput } from "drifloon/element/input";
import { Segment, SegmentAttr, SegmentShape } from "drifloon/element/segment";
import { Container } from "drifloon/element/container";
import { Header } from "drifloon/element/header";
import { Form } from "drifloon/module/form";
import { Button } from "drifloon/element/button";
import { EmLevel } from "drifloon/data/var";
import { must, isNotEmpty } from "drifloon/data/validate";
import { SettingOption, writeSetting } from "../internal/storage";
import { settingState } from "../internal/state";

interface SettingFormData {
	token: string;
}

const validateForm = (data: SettingFormData): Either<Array<string>, SettingOption> =>
	must("token", isNotEmpty(data.token)).collect(token => ({ token }));

export const SettingForm = (): m.Component => {
	const formdata = new FormData<SettingFormData>({
		token: ""
	});

	const clickE = () => {
		formdata.validate(validateForm)
			.ifRight(data => {
				writeSetting(data);
				settingState.putAt("setting", Just(data))
			});
	};

	return {
		view: () => {
			const segAttr: SegmentAttr = {
				shape: SegmentShape.Basic
			};

			return m(Container, m(Segment, segAttr, [
				m(Header, "设置"),
				m(Segment, { shape: SegmentShape.Stack }, m(Form, { formdata }, [
					m(RequireField, [
						m("label", "token"),
						m(PlainInput, {
							value: formdata.askAt("token"),
							connectChange: s => formdata.putAt("token", s)
						})
					]),

					m(Field, [
						m(Button, { em: EmLevel.Primary, connectClick: clickE }, "保存")
					])
				]))
			]));
		}
	};
};

