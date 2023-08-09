import * as m from "mithril";
import * as TMap from "../../internal/tmap";

export interface MapNodeAttr {
	connectFinish: (tmap: T.Map) => void;
}

export const MapNode: m.Component<MapNodeAttr> = {
	oncreate: vnode => {
		const tmap = TMap.init(vnode.dom);
		vnode.attrs.connectFinish(tmap);
	},
	view: () => m("div", { style: "width: 100%; height: calc(100% - 49px); " }),
};
