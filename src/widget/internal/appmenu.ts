import * as m from "mithril";
import { IORef } from "drifloon/data/ref";
import { Outter, OutterAttr } from "drifloon/abstract/outter";
import { Maybe } from "purify-ts";

interface MenuAttr {
	connectLogout: () => void;
}

const SubMenu: m.Component<MenuAttr> = {
	view: ({ attrs }) => m("div.ui.menu.transition.visible", { style: "z-index: 10000;" }, [
		m("div.item", { onclick: attrs.connectLogout }, "退出")
	])
};

export interface AppMenuAttr extends MenuAttr {
}

export const AppMenu = (): m.Component<AppMenuAttr> => {
	const showRef = new IORef<boolean>(false);

	return {
		view: ({ attrs }) => {
			const outterAttr: OutterAttr = {
				connectOutterClick: () => showRef.put(false)
			};

			const menuClickE = () => showRef.update(b => !b);

			const submenu = showRef.asks(Maybe.fromFalsy)
				.map(_ => m(SubMenu, attrs));

			return m(Outter, outterAttr, [
				m("div.ui.icon.dropdown.item", { onclick: menuClickE }, [
					m("i.icon.wrench"),
					"菜单",
					submenu.extract()
				])
			]);
		}
	};
};
