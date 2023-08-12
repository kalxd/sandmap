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
	class OverLayer {}

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

	class Polyline {
		constructor(points: Array<LngLat>, option?: PolylineOption)
	}

	type MapBlankEventName = "zoomend" | "moveend";
	type MapBlankEvent<T extends string> = {
		type: T;
		target: Map;
	};

	class Map {
		constructor(dom: Element);

		centerAndZoom(lgnlat: LngLat, zoom: number): void
		getZoom(): number
		getCenter(): LngLat
		addControl<T extends Control>(control: T): void
		addOverLay<T extends OverLayer>(overlayer: T): void
		removeOverLay<T extends OverLayer>(overlayer: T): void
		addContextMenu(menu: ContextMenu): void

		addEventListener<Name extends MapBlankEventName>(
			eventName: Name,
			cb: (event: MapBlankEvent<Name>) => void
		): void
		removeEventListener<Name extends MapBlankEventName>(
			eventName: Name,
			cb: (event: MapBlankEvent<Name>) => void
		): void
	}

	class MenuItem {
		constructor(text: string, callback: () => void)
	}

	interface ContextMapOption {
		width?: number;
	}

	class ContextMenu {
		constructor(option: ContextMapOption)

		addItem(item: MenuItem): void
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
		constructor(map: Map, option?: PolylineToolOption)

		open(): void
		clear(): void

		addEventListener<Name extends PolylineEventName>(
			eventName: Name,
			callback: (target: PolylineDraw) => void
		): void
	}
}
