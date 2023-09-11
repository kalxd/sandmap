import * as m from "mithril";
import { PlainInput } from "drifloon/element/input";
import { IORef } from "drifloon/data/ref";
import { Just, Maybe, Nothing } from "purify-ts";
import { lnglatCodec } from "../../internal/codec";
import { Outter } from "drifloon/abstract/outter";
import { pickKlass, selectKlass } from "drifloon/internal/attr";

const mapMoveTo = (
	tmap: T.Map,
	lng: string,
	lat: string
): void => {
	lnglatCodec.decode({ lng: Number(lng), lat: Number(lat) })
		.ifRight(lnglat => {
			console.log(lnglat);
			tmap.panTo(lnglat);
		})
		.ifLeft(console.log);
};

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
	result: Maybe<T.LocalSearchResult>;
}

const renderSearchResult = (tmap: T.Map, result: T.LocalSearchResult): m.Children =>
	caseSearchResult(result, {
		normal: result => result.map(item => {
			const f = () => {
				const [lng, lat] = item.lonlat.split(" ");
				mapMoveTo(tmap, lng, lat);
			};
			return m("div.item", { onclick: f }, item.name)
		}),
		statistic: result => result.priorityCitys.map(item => {
			const f = () => {
				const lnglat = new T.LngLat(item.lon, item.lat);
				tmap.panTo(lnglat);
			};
			return m("div.item", { onclick: f }, item.name);
		}),
		area: result => {
			const f = () => {
				const [lng, lat] = result.lonlat.split(",");
				mapMoveTo(tmap, lng, lat);
			};
			return [
				m("div.item", { onclick: f }, result.name)
			];
		},
		suggest: result => result.map(item => m("div.item", item.name))
	});

export const SearchInput = (
	vnode: m.Vnode<SearchInputAttr>
): m.Component<SearchInputAttr> => {
	const { tmap } = vnode.attrs;

	const searchE = (r: T.LocalSearchResult) => {
		state.putAt("result", Just(r));
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
	const isVisibleState = new IORef<boolean>(false);

	const visibeE = () => isVisibleState.put(true);

	const startSearchE = () => {
		const keyword = state.askAt("keyword");
		state.askAt("localsearch").search(keyword);
		visibeE();
	};

	return {
		view: () => {
			const outterClickE = () => isVisibleState.put(false);
			const klass = pickKlass([
				selectKlass("active", isVisibleState.ask())
			]);

			const searchMenu = state.askAt("result")
				.filter(_ => isVisibleState.ask())
				.map(r => renderSearchResult(tmap, r))
				.map(menu => m("div.ui.menu.selection.transition.visible", { class: klass }, menu));

			return m(
				Outter,
				{connectOutterClick: outterClickE },
				m("div.ui.selection.visible.dropdown", { style: "z-index: 10000; padding: 0;", class: klass }, [
					m("div.ui.action.input", { onclick: visibeE } , [
						m(PlainInput, {
							value: state.askAt("keyword"),
							connectChange: s => state.putAt("keyword", s),
							placeholder: "搜索"
						}),
						m("button.ui.icon.button", { onclick: startSearchE }, [
							m("i.icon.search")
						])
					]),
					searchMenu.extract()
				]));
		}
	};
};
