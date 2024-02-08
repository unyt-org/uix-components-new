import { Path } from "uix/utils/path.ts";
import { Component } from "uix/components/Component.ts";
import { include } from "uix/base/decorators.ts";
import { Datex } from "unyt_core/datex.ts";
import { UIX } from "uix";
import { communicationHub } from "unyt_core/network/communication-hub.ts";

declare global {
	var _jsx: unknown;
	var _jsxs: unknown;
	var _Fragment: unknown;
}

@template(function(this: AuthComponent) {
	return <light-root data-appearance={this.options.appearance ?? "auto"}>
		<link rel={"stylesheet"} href={new Path("./Auth.css")}/>
		<div id="backdrop"/>

		<slot tabindex="1" name="content"/>
	</light-root>
})
export class AuthComponent<T = {}> extends Component<{appearance?: "dark" | "light" | "neutral" | "auto", __create?: boolean, __host?: string} & T> {
	@id @frontend protected declare iframe: HTMLIFrameElement;
	@id @frontend protected declare backdrop: HTMLDivElement;
	@frontend declare options;
	@frontend eventListenersSet = false;
	@frontend protected declare blockerElem: HTMLDivElement;
	@include("./AuthComponent.dx") @frontend declare strings: { [ key: string ]: string};

	// @ts-ignore $
	@frontend declare iFrameInterface: typeof import("./interfaces/IFrameInterface.ts").IFrameInterface;

	@frontend declare _logger: Datex.Logger;

	@frontend
	protected override async onDisplay() {
		if (this.options.__create)
			return;
		await this.loadDependencies();
		this._logger = new Datex.Logger("Auth");

		this._logger.success("Loaded dependencies (UIX / DATEX COMInterface)");
		this.createBlockerElement();
		this.iframe.setAttribute("allow", "clipboard-write");
		this.iframe.setAttribute("sandbox", "allow-modals allow-forms allow-popups allow-scripts allow-same-origin");
		
		
		this.iframe.onload = () => this.onLoad();
		this.iframe.onerror = this.iframe.onabort = () => this.onError();
		this.load();
	}

	@frontend
	load() {
		const src = this.options.__host ?? "https://auth-content.unyt.org";
		this._logger.info("Loading Auth Comp (iframe) from", src);
		this.classList.toggle("expanded", false);
		setTimeout(()=>{
			this.iframe.src = src;
		}, 10);
	}

	@frontend
	private onError() {
		this.classList.add("error");
	}

	@frontend
	setScrolling(enabled = true) {
		document.body.classList.toggle("disable-scroll", !enabled);
	}

	@frontend
	setBlocker(active: boolean) {
		if (active)
			document.body.append(this.blockerElem);
		else if (this.isBlockerActive())
			document.body.removeChild(this.blockerElem);
		this.setScrolling(!this.isBlockerActive());
	}

	@frontend
	isBlockerActive() {
		return this.blockerElem?.isConnected;
	}

	@frontend
	private reopenAuthWindow() {
		this.iFrameInterface.reopenAuthWindow();
	}

	@frontend
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

	@frontend
	public async toggle(event: Event) {
		if (!this.iFrameInterface || !event.target || !(event.target as HTMLElement).classList.contains("toggle"))
			return;
		const isExpanded = await this.iFrameInterface.isExpanded();
		if (isExpanded)
			this.collapse();
		else this.expand();
	}

	@frontend
	async collapse() {
		await this.iFrameInterface.collapse();
		this.classList.toggle("expanded", false);
		this.setScrolling(true);
	}
	@frontend
	async expand() {
		await this.iFrameInterface.expand();
		this.classList.toggle("expanded", true);
		const isCentered = this.iframe.classList.contains("center");
		this.setScrolling(!isCentered);
	}

	@frontend
	private onIframeResize(height: number) {
		if (height !== 0)
			this.iframe.style.height = height + "px";
	}

	@frontend
	isExpanded() {
		return this.classList.contains("expanded");
	}

	@frontend
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

	@frontend
	private async onLoad() {
		if (!Datex.Supranet.connected) {
			this._logger.warn("Main page is not connected to Supranet. Waiting for connection...");
			await new Promise((r) => Datex.Supranet.onConnected(() => r(null)));
		}
		const { WindowInterface } = await import("unyt_core/network/communication-interfaces/window-interface.ts");

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

	@frontend
	private createBlockerElement() {
		this.blockerElem = <div id="auth-blocker">
			<img src="https://cdn.unyt.org/unyt-resources/logos/unyt/AUTH/text-light-transparent.svg"/>
			<p>
				{this.strings.blockerText}<br/>
				<a onclick:frontend={() => use("no-datex", this) && this.reopenAuthWindow()}>
					{this.strings.continue}
				</a>
			</p>
		</div> as unknown as HTMLDivElement;
	}


	@frontend
	async loadDependencies() {
		await import("uix");
		await import("datex-core-legacy/iframes/iframe-com-interface.ts");
		await import("./interfaces/WindowAppInterface.ts");
		await import("./interfaces/AppInterface.ts");

		this.strings = (await datex.get<{strings: any}>("./AuthComponent.dx")).strings;
		const {jsx:_jsx, jsxs:_jsxs, Fragment:_Fragment} = await import("uix/jsx-runtime");
		// globalThis._jsx = _jsx;
		// globalThis._jsxs = _jsxs;
		// globalThis._Fragment = _Fragment;
		await Datex.Supranet.connectAnonymous();
	}

	@frontend lastAppearance?: {
		device: "mobile" | "desktop",
		alignment: "left" | "right" | "center",
		mode: "dark" | "light"
	};

	@frontend forceDevice = false;

	@frontend
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

	@frontend
	protected positionIframe(): "center" | "left" | "right" {
		return this.autoPositionIframe();
	}

	@frontend
	protected autoPositionIframe() {
		const parent = (this as unknown as HTMLElement).getBoundingClientRect();
		const parentX = parent.x;
		const animationPercentage = 0.2;
		const animation = 
			parentX < globalThis.innerWidth * animationPercentage ?
			"left" :
			parentX + parent.width > globalThis.innerWidth * (1 - animationPercentage) ?
			"right" : null;
		const alignment = parentX < globalThis.innerWidth / 2;
		this.iframe.classList.toggle("center", false);
		this.iframe.classList.toggle("left", alignment);
		this.iframe.classList.toggle("right", !alignment);
		
		const iframeRect = this.iframe.getBoundingClientRect();
		const iframeX = iframeRect.x;
		const centered = globalThis.innerWidth < 500 ||  iframeX < -38 || (iframeX + iframeRect.width > globalThis.innerWidth + 12);
		
		this.iframe.classList.toggle("center", centered);
		if (centered) {
			this.iframe.classList.toggle("left", false);
			this.iframe.classList.toggle("right", false);
		}

		if (!centered && animation)
			this.classList.add("animation", animation);
		else this.classList.remove("animation", "left", "right");

		this.setScrolling(!(
			this.isExpanded() && centered
		));
		return centered ? "center" : alignment ? "left" : "right";
	}
}