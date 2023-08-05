import { readLastLngLat } from "./storage";

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

	return v;
};
