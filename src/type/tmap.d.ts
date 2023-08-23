declare const T_ANCHOR_BOTTOM_LEFT = "bottomleft";
declare const T_ANCHOR_BOTTOM_RIGHT = "bottomright";
declare const T_ANCHOR_TOP_LEFT = "topleft";
declare const T_ANCHOR_TOP_RIGHT = "topright";

declare module T {
	type ANCHOR_POSITION = typeof T_ANCHOR_BOTTOM_LEFT
		| typeof T_ANCHOR_BOTTOM_RIGHT
		| typeof T_ANCHOR_TOP_LEFT
		| typeof T_ANCHOR_TOP_RIGHT


	class LngLat {
		constructor(lng: number, lat: number);

		getLng(): number;
		getLat(): number;
	}

	class Control {}
	class OverLay {}

	module Control {
		interface ZoomOption {
			position: ANCHOR_POSITION
		}

		class Zoom extends Control {
			constructor(option?: ZoomOption);
		}

		interface ScaleOption {
			color: string;
		}

		class Scale extends Control {
			constructor(option?: ScaleOption);
		}

		class MapType extends Control {}
	}

	interface PolylineOption {
		color?: string;
		weight?: number;
		opacity?: number;
	}

	class Polyline extends OverLay {
		constructor(points: Array<LngLat>, option?: PolylineOption);
	}

	interface PolygonOption {
		color?: string;
		fillColor?: string;
		fillOpacity?: number;
	}

	class Polygon extends OverLay {
		constructor(points: Array<LngLat>, option?: PolygonOption);
	}

	type MapBlankEventName = "zoomend" | "moveend";
	type MapBlankEvent<T extends string> = {
		type: T;
		target: Map;
	};

	class Map {
		constructor(dom: Element);

		centerAndZoom(lnglat: LngLat, zoom: number): void;
		panTo(lnglat: LngLat): void;
		getZoom(): number;
		getCenter(): LngLat;
		addControl<T extends Control>(control: T): void;
		addOverLay<T extends OverLay>(overlayer: T): void;
		removeOverLay<T extends OverLay>(overlayer: T): void;
		addContextMenu(menu: ContextMenu): void;

		addEventListener<Name extends MapBlankEventName>(
			eventName: Name,
			cb: (event: MapBlankEvent<Name>) => void
		): void;
		removeEventListener<Name extends MapBlankEventName>(
			eventName: Name,
			cb: (event: MapBlankEvent<Name>) => void
		): void;
	}

	class MenuItem {
		constructor(text: string, callback: () => void);
	}

	interface ContextMapOption {
		width?: number;
	}

	class ContextMenu {
		constructor(option: ContextMapOption);

		addItem(item: MenuItem): void;
	}

	interface PolylineToolOption {
		color?: string;
		weight?: number;
		opacity?: number;
		showLabel?: boolean;
	}

	type PolylineEventName = "draw";
	interface PolylineDraw {
		target: Map;
		currentLnglats: Array<LngLat>;
	}

	class PolylineTool {
		constructor(map: Map, option?: PolylineToolOption);

		open(): void;
		clear(): void;

		addEventListener<Name extends PolylineEventName>(
			eventName: Name,
			callback: (target: PolylineDraw) => void
		): void;
	}

	type PolygonEventName = "draw";

	interface PolygonToolOption {
		color?: string;
		fillColor?: string;
		fillOpacity?: number;
	}

	class PolygonTool {
		constructor(map: Map, option?: PolygonToolOption);

		open(): void;
		clear(): void;

		addEventListener<Name extends PolygonEventName>(
			eventName: Name,
			callback: (target: PolylineDraw) => void
		): void;
	}

	interface LocalSearchOption {
		pageCapacity: number;
		onSearchComplete: (result: LocalSearchResult) => void;
	}

	interface LocalSearchCity {
		name: string;
		lat: number;
		lon: number;
		count: string;
	}

	interface LocalSearchResultPos {
		address: string;
		name: string;
		lonlat: string;
	}

	interface LocalSearchResultStatistic {
		priorityCitys: Array<LocalSearchCity>;
	}

	interface LocalSearchResultArea {
		level: number;
		lonlat: string;
		name: string;
	}

	interface LocalSearchResultSuggestion {
		address: string;
		name: string;
	}

	interface LocalSearchResult {
		getResultType: () => 1 | 2 | 3 | 4 | 5 | 7;
		getCount: () => number;
		getPois: () => Array<LocalSearchResultPos>;
		getStatistics: () => LocalSearchResultStatistic;
		getArea: () => LocalSearchResultArea;
		getSuggest: () => Array<LocalSearchResultSuggestion>;
	}

	class LocalSearch {
		constructor(map: Map, option: LocalSearchOption);

		search(keyword: string): void;
	}
}
