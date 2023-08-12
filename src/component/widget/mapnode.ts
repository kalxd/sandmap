import * as m from "mithril";
import * as TMap from "../../internal/tmap";
import { LineModal } from "../modal/linemodal";
import { modal } from "drifloon/module/modal";

export interface MapNodeAttr {
	connectFinish: (tmap: T.Map) => void;
}

const openModal = async (tmap: T.Map) => {
	await modal(LineModal);
	const tool = new T.PolylineTool(tmap);
	tool.addEventListener("draw", console.log);
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
