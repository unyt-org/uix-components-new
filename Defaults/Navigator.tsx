import { Datex } from "unyt_core/datex.ts";
import { Component } from "uix/components/Component.ts";
import { template } from "uix/html/template.ts";
import { Icon } from "./Icon.tsx";
import { content, include } from "uix/base/decorators.ts";

@template(<>
	<a id="navigatorTitle" href='/' class="navigation active"></a>
	<Icon id="expandButton" name="fa-chevron-down"/>
	<div id="body"/>
</>)
export class Navigator extends Component {
	@id navigatorTitle!: HTMLAnchorElement;
	@id expandButton!: HTMLDivElement;
	@id body!: HTMLDivElement;
	
	private isCollapsed = true;
	@include links!: {name: string, link: string}[]
	@include strings!: Record<string, Datex.RefOrValue<string>>

	@property navigation: string = '';

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
