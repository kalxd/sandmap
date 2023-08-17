import * as m from "mithril";
import { PlainInput } from "drifloon/element/input";
import { IORef } from "drifloon/data/ref";

export interface SearchInputAttr {
	tmap: T.Map;
}

interface InputState {
	keyword: string;
	localsearch: T.LocalSearch;
}

export const SearchInput = (
	vnode: m.Vnode<SearchInputAttr>
): m.Component<SearchInputAttr> => {
	const searchE = console.log;

	const state = new IORef<InputState>({
		keyword: "",
		localsearch: new T.LocalSearch(vnode.attrs.tmap, {
			pageCapacity: 10,
			onSearchComplete: searchE
		})
	});

	const startSearchE = () => {
		const keyword = state.askAt("keyword");
		state.askAt("localsearch").search(keyword, 1);
	};

	return {
		view: () => {
			return m("div.ui.action.input", [
				m(PlainInput, {
					value: state.askAt("keyword"),
					connectChange: s => state.putAt("keyword", s),
					placeholder: "搜索"
				}),
				m("button.ui.icon.button", { onclick: startSearchE }, [
					m("i.icon.search")
				])
			]);
		}
	};
};
