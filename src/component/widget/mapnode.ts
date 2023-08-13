import * as m from "mithril";
import * as TMap from "../../internal/tmap";
import { LineModal } from "../modal/linemodal";
import { PolygonModal } from "../modal/polygonmodal";
import { modal } from "drifloon/module/modal";
import * as State from "../../internal/state";
import { NonEmptyList } from "purify-ts";
import { Polygon, Polyline } from "../../internal/codec";

export interface MapNodeAttr {
	connectFinish: (tmap: T.Map) => void;
}

const openLineModal = async (tmap: T.Map) => {
	const r = await modal(LineModal);
	r.ifJust(color => {
		const tool = new T.PolylineTool(tmap, { color });
		tool.addEventListener("draw", target => {
			NonEmptyList.fromArray(target.currentLnglats)
				.map(lnglatList => {
					const item: Polyline = {
						type: "polyline",
						color,
						lineList: lnglatList,
					};
					return item;
				})
				.ifJust(State.addPolyline);
			tool.clear();
		});
		tool.open();
	});
};

const openPolygonModal = async (tmap: T.Map) => {
	const r = await modal(PolygonModal);
	r.ifJust(color => {
		const tool = new T.PolygonTool(tmap, { color, fillColor: color });
		tool.addEventListener("draw", target => {
			NonEmptyList.fromArray(target.currentLnglats)
				.map<Polygon>(pointList => ({
					type: "polygon",
					color,
					pointList
				}))
				.ifJust(State.addPolygon)
			tool.clear();
		});
		tool.open();
	});
}

export const MapNode: m.Component<MapNodeAttr> = {
	oncreate: vnode => {
		const tmap = TMap.init(vnode.dom);

		const menu = new T.ContextMenu({});
		{
			const menuItem = new T.MenuItem("添加线段", () => openLineModal(tmap));
			menu.addItem(menuItem);
		}

		{
			const menuItem = new T.MenuItem("添加多边形", () => openPolygonModal(tmap));
			menu.addItem(menuItem);
		}

		tmap.addContextMenu(menu);
		vnode.attrs.connectFinish(tmap);
	},
	view: () => m("div", { style: "width: 100%; height: calc(100% - 49px); " }),
};
