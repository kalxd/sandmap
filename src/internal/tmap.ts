export const init = (el: Element): T.Map => {
	const v = new T.Map(el);
	v.centerAndZoom(new T.LngLat(116.40769, 39.89945), 12);

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
