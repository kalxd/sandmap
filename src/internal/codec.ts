import {
	Codec,
	number as cnumber,
	string as cstring,
	boolean as cboolean,
	array as carray,
	nonEmptyList,
	GetType,
    Right,
    Left,
    NonEmptyList,
	oneOf,
} from "purify-ts";

const lnglatI = Codec.interface({
	lng: cnumber,
	lat: cnumber
});

export const lnglatCodec = Codec.custom<T.LngLat>({
	decode: input => lnglatI.decode(input)
		.map(o => new T.LngLat(o.lng, o.lat)),

	encode: (input: T.LngLat): GetType<typeof lnglatI> => {
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

const polylineI = Codec.interface({
	type: cstring,
	color: cstring,
	lineList: nonEmptyList(lnglatCodec)
});

export interface Polyline {
	type: "polyline",
	color: string;
	lineList: NonEmptyList<T.LngLat>;
}

export const polylineCodec = Codec.custom<Polyline>({
	decode: input => polylineI.decode(input)
		.chain(p => {
			if (p.type === "polyline") {
				return Right({
					type: "polyline",
					color: p.color,
					lineList: p.lineList
				});
			}
			else {
				return Left(`未知地图标注类型${p.type}`);
			}
		}),
	encode: polylineI.encode
});

const polygonI = Codec.interface({
	type: cstring,
	color: cstring,
	pointList: nonEmptyList(lnglatCodec)
});

export interface Polygon {
	type: "polygon",
	color: string,
	pointList: NonEmptyList<T.LngLat>
}

export const polygonCodec = Codec.custom<Polygon>({
	decode: input => polygonI.decode(input)
		.chain(p => {
			if (p.type === "polygon") {
				return Right({
					...p,
					type: "polygon"
				});
			}
			else {
				return Left(`未知地图类型${p.type}`)
			}
		}),
	encode: polygonI.encode
});

const itemType = oneOf([
	polylineCodec,
	polygonCodec
])

export type ItemType = GetType<typeof itemType>;

export const layerDataCodec = Codec.interface({
	name: cstring,
	isVisible: cboolean,
	itemList: carray(itemType)
});

export type LayerData = GetType<typeof layerDataCodec>;

export const layerListData = nonEmptyList(layerDataCodec);

export type LayerListData = GetType<typeof layerListData>;

export const userDataCodec = Codec.interface({
	layerList: layerListData,
	active: cnumber
});

export type UserData = GetType<typeof userDataCodec>;
