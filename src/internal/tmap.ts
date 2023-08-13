import { Polygon, Polyline } from "./codec";
import { readLastLngLat, writeLastLngLat } from "./storage";

export const init = (el: Element): T.Map => {
	const lastState = readLastLngLat();

	const v = new T.Map(el);
	v.centerAndZoom(lastState.lnglat, lastState.zoom);

	{
		const control = new T.Control.Zoom({
			position: T_ANCHOR_BOTTOM_RIGHT
		});
		v.addControl(control);
	}

	{
		const control = new T.Control.Scale();
		v.addControl(control);
	}

	{
		const control = new T.Control.MapType();
		v.addControl(control);
	}

	v.addEventListener("moveend", e => {
		const center = e.target.getCenter();
		const zoom = e.target.getZoom();
		writeLastLngLat({ zoom, lnglat: center });
	});

	return v;
};

export const initPolyline = (item: Polyline): T.Polyline =>
	new T.Polyline(item.lineList, { color: item.color });

export const initPolygon = (item: Polygon): T.Polygon =>
	new T.Polygon(item.pointList, {
		color: item.color,
		fillColor: item.color,
		fillOpacity: 0.2,
	})
