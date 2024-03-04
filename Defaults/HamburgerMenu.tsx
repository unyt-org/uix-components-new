import { Component } from "uix/components/Component.ts";
import { template } from "uix/html/template.ts";
import { Icon } from "./Icon.tsx";

@template(function() {
	return <>
		<Icon id="menuIcon" name="fa-bars"/>
		<div id="menuContainer">
			{...this.options.items}
		</div>
	</>
})
export class HamburgerMenu extends Component<{ items: HTMLElement[], action?: "default" | "none"}> {
	public isCollapsed = true;

	@id menuIcon!: HTMLElement;
	@id menuContainer!: HTMLDivElement;

	@standalone public onExpand() {
		this.menuContainer.classList.add("active");
	}
	@standalone public onCollapse() {
		this.menuContainer.classList.remove("active");
	}

	@standalone public collapse() {
		if (this.isCollapsed)
			return;
		this.isCollapsed = true;
		this.onCollapse();
	}

	@standalone public expand() {
		if (!this.isCollapsed)
			return;
		this.isCollapsed = false;
		this.onExpand();
	}

	@standalone override onDisplay() {
		this.menuIcon.onclick = () => {
			this.isCollapsed ? this.expand() : this.collapse();
		}
	}
}