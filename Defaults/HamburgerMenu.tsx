// deno-lint-ignore-file no-namespace
import { Component } from "uix/components/Component.ts";
import { template } from "uix/html/template.ts";
import { Icon } from "./Icon.tsx";

export namespace HamburgerMenu {
	export interface Options extends Component.Options {
		action: "default" | "none"
	}
}

@template()
export class HamburgerMenu extends Component<HamburgerMenu.Options> {
	public isCollapsed = true;

	@frontend @content menuIcon = <Icon name="fa-bars"/>;
	@frontend @content menuContainer = <div></div>;

	public addItem(...items: HTMLElement[]) {
		this.menuContainer.append(...items);
	}

	@frontend public onExpand() {
		this.menuContainer.classList.add("active");
	}
	@frontend public onCollapse() {
		this.menuContainer.classList.remove("active");
	}

	@frontend public collapse() {
		if (this.isCollapsed)
			return;
		this.isCollapsed = true;
		this.onCollapse();
	}

	@frontend public expand() {
		if (!this.isCollapsed)
			return;
		this.isCollapsed = false;
		this.onExpand();
	}

	@frontend override onDisplay() {
		this.menuIcon.onclick = () => {
			this.isCollapsed ? this.expand() : this.collapse();
		}
	}
}