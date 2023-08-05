import { Codec, number as cnumber, GetType } from "purify-ts";

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

export type TMapLastState = GetType<typeof tmapLastStateCodec>;
