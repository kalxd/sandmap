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

	class Control {
	}

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

	type MapBlankEventName = "zoomend" | "moveend";
	type MapBlankEvent<T extends string> = {
		type: T;
		target: Map;
	};

	class Map {
		constructor(dom: Element);

		centerAndZoom(lgnlat: LngLat, zoom: number): void;
		getZoom(): number;
		getCenter(): LngLat;
		addControl<T extends Control>(control: T): void;

		addEventListener<Name extends MapBlankEventName>(
			eventName: Name,
			cb: (event: MapBlankEvent<Name>) => void
		): void;
		removeEventListener<Name extends MapBlankEventName>(
			eventName: Name,
			cb: (event: MapBlankEvent<Name>) => void
		): void;
	}
}
