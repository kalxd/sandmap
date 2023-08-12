import * as m from "mithril";
import * as TMap from "../../internal/tmap";
import { LineModal } from "../modal/linemodal";
import { modal } from "drifloon/module/modal";
import * as State from "../../internal/state";
import { NonEmptyList } from "purify-ts";
import { Polyline } from "../../internal/codec";

export interface MapNodeAttr {
	connectFinish: (tmap: T.Map) => void;
}

const openModal = async (tmap: T.Map) => {
	await modal(LineModal);
	const tool = new T.PolylineTool(tmap);
	tool.addEventListener("draw", target => {
		NonEmptyList.fromArray(target.currentLnglats)
			.map(lnglatList => {
				const item: Polyline = {
					type: "polyline",
					color: "",
					lineList: lnglatList,
				};
				return item;
			})
			.ifJust(State.addPolyline);
	});
	tool.open();
};

export const MapNode: m.Component<MapNodeAttr> = {
	oncreate: vnode => {
		const tmap = TMap.init(vnode.dom);

		const menu = new T.ContextMenu({});
		const menuItem = new T.MenuItem("添加线段", () => openModal(tmap));
		menu.addItem(menuItem);
		tmap.addContextMenu(menu);

		vnode.attrs.connectFinish(tmap);
	},
	view: () => m("div", { style: "width: 100%; height: calc(100% - 49px); " }),
};
