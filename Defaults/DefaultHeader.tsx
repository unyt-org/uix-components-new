import { HamburgerMenu } from './HamburgerMenu.tsx';
import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";
import { use } from "uix/base/decorators.ts";
import { Icon } from "./Icon.tsx";

type Link = {
	name: string,
	link?: URL | string,
	children?: (Link & {
		description?: string,
		icon?: string
	})[]
}

@template(function(this: DefaultHeader) {
	return <>
		{this.createHamburgerMenu() ?? undefined}
		{this.createLogo() ?? undefined}
		{this.createNavigation() ?? undefined}
		{this.createActions() ?? undefined}
	</>
})
export class DefaultHeader extends Component {
	@use declare links: Link[]
	@frontend @id declare hamburgerMenu: HamburgerMenu;
	@frontend @id declare navigationContainer: HTMLDivElement;
	@frontend @id declare actionContainer: HTMLDivElement;

	protected createHamburgerMenu(): Element | void {
		const hamburgerMenu = <HamburgerMenu id="hamburgerMenu"/> as HamburgerMenu;
		hamburgerMenu.addItem(
			...this.links
				.map(link => {
					if (link.children)
						return <details>
							<summary><a>{link.name}</a></summary>
							{link.children.map(child => 
								<a href={child.link} title={child.name}>{child.name}</a>)}
						</details>
					return <a href={link.link} title={link.name}>{link.name}</a>;
				}) as HTMLElement[]
		);
		return hamburgerMenu;
	}

	protected createLogo(): Element | void {
		return <a id="logo" href="/" onclick:frontend={()=>this.reload()}>
			<img src="https://cdn.unyt.org/unyt-resources/logos/unyt/text-light-transparent-3.svg"/>
		</a>;
	}
	protected createNavigation(): Element | void {
		return <div id="navigationContainer">
			{...this.links.map(link => this.createLink(link))}
		</div>;
	}
	protected createActions(): Element | void {
		return <div id="actionContainer">
		</div>;
	}

	@frontend
	protected reload() {
		globalThis.location.reload();
	}

	protected createLink(link: Link) {
		if (link.children) 
			return <div class="header-dropdown">
				<a class="header-link expandable"><span>{link.name}</span> <Icon name="fa-chevron-down"/></a>
				<div>
					{...link.children.map(child => <a class="header-link" href={child.link} title={child.name}>
						<div>
							{child.icon ? <Icon name={child.icon}/> : undefined}
							<span>{child.name}</span>
						</div>
						{child.description ? <p>{child.description}</p> : undefined}
					</a>)}
				</div>
			</div>;
		return <a class="header-link" href={link.link} title={link.name}>
			{link.name}
		</a>;
	}

	@frontend
	public collapseMenu() {
		this.hamburgerMenu.collapse();
	}

	public override onCreate() {
		this.hamburgerMenu.collapse();
	}
}