import { Datex } from "unyt_core/datex.ts";
import { Component } from "uix/components/Component.ts";
import { template } from "uix/html/template.ts";
import { Icon } from "./Icon.tsx";
import { use } from "uix/base/decorators.ts";

@template()
export class Navigator extends Component<Component.Options> {
	@content navigatorTitle = <a href='/' class="navigation active"></a>
	@content expandButton = <Icon name="fa-chevron-down"/>;
	private isCollapsed = true;
	@use declare links: {name: string, link: string}[]
	@use declare strings: Record<string, Datex.CompatValue<string>>

	@content body = <div></div>;
	@property declare navigation: string;

	public onRefresh() {}


	private createLinks() {
		this.links.forEach(item => {
			this.body.append(
				<a data-ref={item.link} class="navigation" href={`#${item.link}`} onclick={()=>{this.onCollapse();this.onSection?.(item.link)}}>{item.name}</a>
			)
		});

		this.body.append(
			<div class="buttons">
				<a href="https://unyt.org/beta">
					{this.strings.buttonBeta} <Icon name="fa-chevron-right"/>
				</a>
				<a href="mailto:hello@unyt.org">
					{this.strings.buttonContact} <Icon name="fa-chevron-right"/>
				</a>
			</div>
		)
	}

	public stop(): void {
		this.classList.add("hidden");
	}
	
	public start(identifier: string): void {
		const name = this.links.find(e => e.link === `${identifier.replace("#", '')}`)?.name;
		this.navigatorTitle.setAttribute("href", `${identifier}`);
		//@ts-ignore $
		this.$.navigation = name;
		this.classList.remove("hidden");

		this.body.querySelectorAll(`a[data-ref]`).forEach(e => e.classList.remove("hidden"));
		this.body.querySelector(`a[data-ref='${identifier.replace("#", '')}']`)?.classList.add("hidden");
	}

	private onExpand() {
		this.expandButton.classList.remove("fa-chevron-down");
		this.expandButton.classList.add("fa-times");
		this.body.classList.add("active");
	}
	private onCollapse() {
		this.expandButton.classList.remove("fa-times");
		this.expandButton.classList.add("fa-chevron-down");
		this.body.classList.remove("active");
	}


	// only workaround for routing - must be fixed at some point
	public onSection?:(section:string)=>void

	protected override onCreateLayout(){
		this.stop()
	}

	override onCreate() {
		this.navigatorTitle = <a class="navigation active">{this.$.navigation}</a>;
		this.navigatorTitle.onclick = () => {
			this.onCollapse();
			this.onRefresh();
		}
		this.expandButton.onclick = () => {
			this.isCollapsed = !this.isCollapsed;
			if (this.isCollapsed)	
				this.onCollapse();
			else this.onExpand();
		}
		this.createLinks();
	}
}
