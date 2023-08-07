import {
	Codec,
	number as cnumber,
	string as cstring,
	boolean as cboolean,
	nonEmptyList,
	GetType
} from "purify-ts";

const lnglatInterfaceCodec = Codec.interface({
	lng: cnumber,
	lat: cnumber
});

const lnglatCodec = Codec.custom<T.LngLat>({
	decode: input => lnglatInterfaceCodec.decode(input)
		.map(o => new T.LngLat(o.lng, o.lat)),

	encode: (input: T.LngLat): GetType<typeof lnglatInterfaceCodec> => {
		const lng = input.getLng();
		const lat = input.getLat();
		return { lng, lat };
	}
});

export const tmapLastStateCodec = Codec.interface({
	zoom: cnumber,
	lnglat: lnglatCodec
});

export type TMapLastData = GetType<typeof tmapLastStateCodec>;

export const layerDataCodec = Codec.interface({
	name: cstring,
	isVisible: cboolean
});

export type LayerData = GetType<typeof layerDataCodec>;

export const layerListData = nonEmptyList(layerDataCodec);

export type LayerListData = GetType<typeof layerListData>;

export const userDataCodec = Codec.interface({
	layerList: layerListData,
	active: cnumber
});

export type UserData = GetType<typeof userDataCodec>;
