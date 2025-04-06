import { transform } from "datex-core-legacy/datex_short.ts";
import { AuthIconBody } from "./AuthIconBody.tsx";
import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";

@template()
export class AuthIcon extends Component {
	
	@content authIcon = <img src='https://cdn.unyt.org/unyt-resources/logos/unyt/round-dark-background.png'></img>
	@content chevron!: HTMLElement;
	@property isExpanded = false;
	@content body!: AuthIconBody;

	@property endpointIdentifier = "jonasstrehle";

	override onCreate() {
		this.content_container.append(this.body);
		const icon = transform([this.$$.isExpanded], (e) => e ? 'fa fa-chevron-up' : 'fa fa-chevron-down');
		this.chevron = <span class={icon}></span> as HTMLElement;
		this.body = new AuthIconBody({
			endpointIdentifier: this.endpointIdentifier
		});

		this.setupListeners();
	}

	onExpand() {
		console.log("expand")
		this.onBodyResize();
	}


	onCollapse() {
		// console.log("collapse")
	}


	private onBodyResize() {
		// await new Promise((r) => setTimeout(r, 100))
		const { x, y, width, height } = this.authIcon.getBoundingClientRect();
		const bodyRect = this.body.getBoundingClientRect();
		this.body.style.left = `${14 + 20 + x - bodyRect.width + width/2}px`;
		this.body.style.top = `${y + height}px`;
	}
	private onClickListener(event: Event) {
		this.collapse();
	}
	private setupListeners() {
		this.body.onclick = (e: Event) => {
			e.stopPropagation();
			console.log(e.target, "stopping... ")
		}
		this.body.addEventListener("mousewheel", (e: Event) => e.stopPropagation());
		this.body.addEventListener("touchmove", (e: Event) => e.stopPropagation());

		globalThis.removeEventListener("click", this.clickListener);
		globalThis.addEventListener("click", this.clickListener);

		globalThis.removeEventListener("resize", this.resizeListener);
		globalThis.addEventListener("resize", this.resizeListener);
		globalThis.addEventListener('mousewheel', this.clickListener);
		globalThis.addEventListener('touchmove', this.clickListener);

		this.content.onclick = (e: Event) => {
			this.$.isExpanded.setVal(!this.isExpanded);
			this.body.classList.toggle("active", this.isExpanded);

			if (this.isExpanded)
				this.onExpand();
			else this.onCollapse();
			e.stopPropagation();
		}
	}

	private expand() {
		this.$.isExpanded.setVal(true);
		this.body.classList.toggle("active", this.isExpanded);
		this.onExpand();
	}
	private collapse() {
		this.$.isExpanded.setVal(false);
		this.body.classList.toggle("active", this.isExpanded);
		this.onCollapse();
	}

	private clickListener = (event: Event) => this.onClickListener(event);
	private resizeListener = () => this.onBodyResize();

}