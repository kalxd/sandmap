import * as m from "mithril";
import { PlainInput } from "drifloon/element/input";
import { IORef } from "drifloon/data/ref";
import { Just, Maybe, Nothing } from "purify-ts";

interface CaseSearchResult<T> {
	normal: (result: Array<T.LocalSearchResultPos>) => T;
	statistic: (result: T.LocalSearchResultStatistic) => T;
	area: (result: T.LocalSearchResultArea) => T;
	suggest: (result: Array<T.LocalSearchResultSuggestion>) => T;
}

const caseSearchResult = <R>(
	result: T.LocalSearchResult,
	handler: CaseSearchResult<R>
): R => {
	const ty = result.getResultType();

	if (ty === 1) {
		return handler.normal(result.getPois());
	}
	else if (ty === 2) {
		return handler.statistic(result.getStatistics());
	}
	else if (ty === 3) {
		return handler.area(result.getArea());
	}
	else {
		return handler.suggest(result.getSuggest());
	}
};

export interface SearchInputAttr {
	tmap: T.Map;
}

interface InputState {
	keyword: string;
	localsearch: T.LocalSearch;
	result: Maybe<Array<m.Vnode>>;
}

export const SearchInput = (
	vnode: m.Vnode<SearchInputAttr>
): m.Component<SearchInputAttr> => {
	const { tmap } = vnode.attrs;

	const searchE = (r: T.LocalSearchResult) => {
		const menu = caseSearchResult(r, {
			normal: result => result.map(item => {
				return m("div.item", item.name);
			}),
			statistic: result => result.priorityCitys.map(item => {
				return m("div.item", item.name)
			}),
			area: result => {
				return [m("div.item", result.name)];
			},
			suggest: result => result.map(item => {
				return m("div.item", item.name);
			})
		});

		state.putAt("result", Just(menu));
		m.redraw();
	};

	const state = new IORef<InputState>({
		keyword: "",
		localsearch: new T.LocalSearch(vnode.attrs.tmap, {
			pageCapacity: 10,
			onSearchComplete: searchE
		}),
		result: Nothing
	});

	const startSearchE = () => {
		const keyword = state.askAt("keyword");
		state.askAt("localsearch").search(keyword);
	};

	return {
		view: () => {
			return m("div.ui.selection.visible.dropdown", { style: "z-index: 10000" }, [
				m("div.ui.action.input", [
					m(PlainInput, {
						value: state.askAt("keyword"),
						connectChange: s => state.putAt("keyword", s),
						placeholder: "搜索"
					}),
					m("button.ui.icon.button", { onclick: startSearchE }, [
						m("i.icon.search")
					])
				]),
				m("div.ui.menu.selection.transition.visible", state.askAt("result").extract())
			]);
		}
	};
};
