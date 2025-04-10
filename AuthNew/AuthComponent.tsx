import { Path } from "uix/utils/path.ts";
import { Component } from "uix/components/Component.ts";
import { include } from "uix/base/decorators.ts";
import { Datex, f } from "datex-core-legacy/datex.ts";
import { UIX } from "uix";
import { template } from "uix/html/template.ts";

@template(function() {
	return <light-root data-appearance={this.options.appearance ?? "auto"}>
		<link rel={"stylesheet"} href={new Path("./Auth.css")}/>
		<div id="backdrop"/>

		<slot tabindex="1" name="content"/>
	</light-root>
})
@standalone({inheritedFields: ["options"]})
export class AuthComponent<T = {}> extends Component<{appearance?: "dark" | "light" | "neutral" | "auto", __create?: boolean, __host?: string} & T> {
	@id protected iframe!: HTMLIFrameElement;
	@id protected backdrop!: HTMLDivElement;
	@standalone eventListenersSet = false;
	@standalone protected blockerElem!: HTMLDivElement;
	@include("./AuthComponent.dx")  strings!: { [ key: string ]: string};

	// @ts-ignore $
	@standalone iFrameInterface!: typeof import("./interfaces/IFrameInterface.ts").IFrameInterface;
	@standalone _logger!: Datex.Logger;
	
	protected override async onDisplay() {
		if (this.options.__create)
			return;
		await this.loadDependencies();
		this._logger = new Datex.Logger("Auth");
		if (!this.iframe) {
			this._logger.warn("Iframe was not found!");
			// @ts-ignore $
			this.iframe = this.querySelector("iframe");
		}

		this._logger.success("Loaded dependencies (UIX / DATEX COMInterface)");
		this.createBlockerElement();
		
		this.iframe.setAttribute("sandbox", "allow-popups-to-escape-sandbox allow-modals allow-forms allow-popups allow-scripts allow-same-origin allow-top-navigation");
		
		
		this.iframe.onload = () => this.onLoad();
		this.iframe.onerror = this.iframe.onabort = () => this.onError();
		this.load();
	}
	
	async load() {
		if (!Datex.Supranet.connected) {
			this._logger.warn("Main page is not connected to Supranet.");
		}
		if (Datex.Runtime.endpoint.equals(f("@@local"))) {
			this._logger.error("Can not connect without an endpoint! Waiting for Supranet connection...");
			const isConnected = await new Promise((r) => {
				Datex.Supranet.onConnected(() => r(true));
				setTimeout(() => r(false), 3000);
			});
			if (!isConnected) {
				this._logger.warn("Please add a Supranet.connect in your application.");
				await Datex.Supranet.connect();
			}
			this._logger.success("Got a connection to the Supranet");
		}
		
		const src = this.options.__host ?? "https://auth-content.unyt.org";
		this._logger.info("Loading Auth Comp (iframe) from", src);
		this.classList.toggle("expanded", false);
		setTimeout(()=>{
			this.iframe.src = src;
		}, 0);
	}
	
	private onError() {
		this.classList.add("error");
	}
	
	setScrolling(enabled = true) {
		document.body.classList.toggle("disable-scroll", !enabled);
	}
	
	setBlocker(active: boolean) {
		if (active)
			document.body.append(this.blockerElem);
		else if (this.isBlockerActive())
			document.body.removeChild(this.blockerElem);
		this.setScrolling(!this.isBlockerActive());
	}
	
	isBlockerActive() {
		return this.blockerElem?.isConnected;
	}

	
	private reopenAuthWindow() {
		this.iFrameInterface.reopenAuthWindow();
	}
	
	protected setupEvents() {
		this._logger.info("Setting up event listeners...");
		this.backdrop.onclick = () => {
			if (!this.isBlockerActive())
				this.collapse();
		}

		globalThis.addEventListener("onRefresh", e => {
			this._logger.info("[Event] <- Got a refresh event");
			this.load();
		})
		globalThis.addEventListener("onRequestCollapse", e => {
			this._logger.info("[Event] <- Got a request collapse event");
			this.collapse();
		});
		globalThis.addEventListener("iframeResize", (e: CustomEventInit) => {
			this.onIframeResize(e.detail.height);
		});
		globalThis.addEventListener("setBlocker", (e: CustomEventInit) => {
			this._logger.info("[Event] <- Got a set blocker event", e.detail ? "active" : "inactive");
			this.setBlocker(e.detail);
		});


		globalThis.addEventListener("resize", () => this.onResize());
		const isVisible = (elem: HTMLElement) => !!elem && !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
		globalThis.addEventListener("click", async (event: Event) => {
			const isExpanded = await this.iFrameInterface.isExpanded();
			if (!this.isBlockerActive() && this.iFrameInterface && isExpanded && event.target && !this.contains(event.target as never) && isVisible(this as unknown as HTMLElement)) {
				event.stopImmediatePropagation();
				event.preventDefault();
				this.collapse();
			}
		})
	}

	
	public async toggle(event: Event) {
		if (!this.iFrameInterface || !event.target || !(event.target as HTMLElement).classList.contains("toggle"))
			return;
		const isExpanded = await this.iFrameInterface.isExpanded();
		if (isExpanded)
			this.collapse();
		else this.expand();
	}

	
	async collapse() {
		await this.iFrameInterface.collapse();
		this.classList.toggle("expanded", false);
		this.setScrolling(true);
	}
	
	async expand() {
		await this.iFrameInterface.expand();
		this.classList.toggle("expanded", true);
		const isCentered = this.iframe.getAttribute("data-alignment") === "center";
		this.setScrolling(!isCentered);
	}

	
	private onIframeResize(height: number) {
		if (height !== 0)
			this.iframe.style.height = height + "px";
	}

	
	isExpanded() {
		return this.classList.contains("expanded");
	}

	
	protected async onConnect() {
		this._logger.success("Successfully connected with iframe");
		await this.iFrameInterface.hello();
		if (!this.eventListenersSet) {
			this.eventListenersSet = true;
			this.setupEvents();
		}
		this.onResize();
		this.classList.add("connected");
	}

	
	private async onLoad() {
		const { WindowInterface } = await import("datex-core-legacy/network/communication-interfaces/window-interface.ts");

		this._logger.success("Auth Comp (iframe) was loaded");
		this._logger.info("Initializing iframe communication interface...");
		const endpoint = await WindowInterface.bindIFrame(this.iframe);
		if (!endpoint)
			return this._logger.warn(`Could not connect to interface. Aborting...`);
		this._logger.success("Interface was connected. Got endpoint", endpoint);
		this._logger.info(`Getting interface from iframe...`);

		try {
			this.iFrameInterface = await datex`${endpoint}.IFrameInterface`;
		} catch(e) {
			this._logger.warn(`Could not get interface of iframe. Retrying...`, e);
		}
		if (!this.iFrameInterface) {
			this._logger.error(`Could not get interface from endpoint ${endpoint}`);
			throw new Error("Could not get interface!");
		}
		this.onConnect();
	}

	
	private createBlockerElement() {
		this.blockerElem = <div id="auth-blocker">
			<img src="https://cdn.unyt.org/unyt-resources/logos/unyt/AUTH/text-light-transparent.svg"/>
			<p>
				{this.strings.blockerText}<br/>
				<a onclick:frontend={() => use("standalone", this) && this.reopenAuthWindow()}>
					{this.strings.continue}
				</a>
			</p>
		</div> as unknown as HTMLDivElement;
	}


	
	async loadDependencies() {
		await import("uix");
		await import("./interfaces/WindowAppInterface.ts");
		await import("./interfaces/AppInterface.ts");

		this.strings = (await datex.get<{strings: any}>("./AuthComponent.dx")).strings;
		const {jsx:_jsx, jsxs:_jsxs, Fragment:_Fragment} = await import("uix/jsx-runtime");
		//await Datex.Supranet.connectAnonymous();
	}

	@standalone lastAppearance?: {
		device: "mobile" | "desktop",
		alignment: "left" | "right" | "center",
		mode: "dark" | "light"
	};

	@standalone forceDevice = false;

	
	private onResize() {
		const alignment = this.positionIframe();
		if (!this.iFrameInterface)
			return;
		const appearance = {
			device: this.forceDevice ? "mobile" :
				 (globalThis.innerWidth > globalThis.innerHeight ? "desktop" : "mobile") as "desktop" | "mobile",
			alignment,
			mode: UIX.Theme.mode
		};
		if (JSON.stringify(this.lastAppearance) !== JSON.stringify(appearance)) {
			this._logger.info("[Event] -> Setting appearance", appearance);
			this.iFrameInterface.setAppearance(appearance);
			this.lastAppearance = appearance;
		}
	}
	
	protected positionIframe() {
		return this.autoPositionIframe();
	}
	
	protected autoPositionIframe(): "center" | "left" | "right" {
		if (globalThis.innerWidth < 500) {
			this.iframe.setAttribute("data-alignment", "center")
			return "center";
		}

		let alignment: "right" | "left" | "center" = "left";
		this.iframe.setAttribute("data-alignment", alignment);
		let iframePosition = this.iframe.getBoundingClientRect();
		let iframeRight = iframePosition.x + iframePosition.width;
		let alreadyAligned = false;

		if (iframeRight >= globalThis.innerWidth) {
			alignment = "right";
			alreadyAligned = true;
		}
		this.iframe.setAttribute("data-alignment", alignment);

		iframePosition = this.iframe.getBoundingClientRect();
		const iframeLeft = iframePosition.x;
		iframeRight = iframePosition.x + iframePosition.width;
		if (iframeLeft < 0) {
			this.iframe.setAttribute("data-alignment", alreadyAligned ? "center" : "left-fixed");
		}
		return alignment;
	}
}
