// deno-lint-ignore-file no-async-promise-executor
import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";
import { Datex } from "datex-core-legacy/mod.ts";
import { include } from "uix/base/decorators.ts";

/**
 * Note -> why is server responding with text/scss instead of css?
 * for <link rel={"stylesheet"} href="./Auth.scss"/>
 * FIXME TODO
 */
@template(function(this: AuthIcon) {
	return <>
		<link rel={"stylesheet"} href="./Auth.css"/>
		
		<a class="toggle">
			<div class="spinner"></div>
			<img class="toggle" src="https://cdn.unyt.org/unyt-resources/logos/unyt/round-dark-background.png"/>
		</a>
		<svg xmlns="http://www.w3.org/2000/svg" class="toggle chevron-down" width="18" height="18" viewBox="0 0 512 512">
			<path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/>
		</svg>
		<div id="backdrop"/>
		<iframe id="iframe" allow="clipboard-write" allowtransparency="true"/>
	</>
})
export class AuthIcon extends Component {
	@id @frontend private declare iframe: HTMLIFrameElement;

	@frontend private declare blockerElem: HTMLDivElement;

	@include("./AuthIcon.dx") declare strings: { [ key: string ]: string};


	@frontend
	setBlocker(active: boolean) {
		if (active)
			document.body.append(this.blockerElem);
		else if (this.isBlockerActive())
			document.body.removeChild(this.blockerElem);
		document.body.classList.toggle("disable-scroll", this.isBlockerActive());
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
	declare options;

	@frontend
	async createBlockerElement() {
		if (!this.strings)
			this.strings = (await datex.get<{strings: any}>("./AuthIcon.dx")).strings;

		this.blockerElem = <div id="blocker">
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
	protected override async onDisplay() {
		await import("uix");
		await import("datex-core-legacy/iframes/iframe-com-interface.ts");
		await import("./interfaces/WindowInterface.ts");
		await import("./interfaces/AppInterface.ts");
		const {jsx:_jsx, jsxs:_jsxs, Fragment:_Fragment} = await import("uix/jsx-runtime");
		// @ts-ignore $
		globalThis._jsx = _jsx;
		// @ts-ignore $
		globalThis._jsxs = _jsxs;
		// @ts-ignore $
		globalThis._Fragment = _Fragment;
		
		this.createBlockerElement();

		this.iframe.setAttribute("allow", "clipboard-write");
		this.iframe.onload = () => this.onLoad();
		this.iframe.onerror = this.iframe.onabort = () => this.onError();


		this.load();
	}

	@frontend
	load() {
		console.debug("Loading unyt Auth frame...");
		this.classList.toggle("expanded", false);
		setTimeout(()=>{
			this.iframe.src = "https://auth-content.unyt.org"//"http://localhost:9999";
		}, 300);
	}

	@frontend
	private setupEvents() {
		this.addEventListener("click", (e) => this.toggle(e));

		globalThis.addEventListener("onRefresh", e => {
			this.load();
		})
		globalThis.addEventListener("onRequestCollapse", e => {
			this.collapse();
		});
		globalThis.addEventListener("iframeResize", (e: CustomEventInit) => {
			this.onIframeResize(e.detail.height);
		});
		globalThis.addEventListener("setBlocker", (e: CustomEventInit) => {
			this.setBlocker(e.detail);
		});


		globalThis.addEventListener("resize", () => this.onResize());
		const isVisible = (elem: HTMLElement) => !!elem && !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
		globalThis.addEventListener("click", async (event: Event) => {
			const isExpanded = await this.iFrameInterface.isExpanded();
			if (!this.isBlockerActive() && this.iFrameInterface && isExpanded && event.target && !this.contains(event.target) && isVisible(this)) {
				event.stopImmediatePropagation();
				event.preventDefault();
				this.collapse();
			}
		})
	}

	@frontend
	private onResize() {
		if (this.iFrameInterface)
			this.iFrameInterface.setAppearance(globalThis.innerWidth > globalThis.innerHeight ? "desktop" : "mobile")
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
	}
	@frontend
	async expand() {
		await this.iFrameInterface.expand();
		this.classList.toggle("expanded", true);
	}

	@frontend declare iFrameInterface: typeof import("./interfaces/IFrameInterface.ts").IFrameInterface;

	@frontend
	private onError() {
		this.classList.add("error");
	}
	
	@frontend
	comInterface?: Datex.ComInterface;

	@frontend
	private onLoad() {
		if (this.comInterface)
			Datex.InterfaceManager.removeInterface(this.comInterface);

		console.debug("Auth frame was loaded. Initializing interfaces...");
		Datex.InterfaceManager.connect("iframe", undefined, [this.iframe], undefined, (interf) => {
			console.debug("Interface is initialized. Waiting for response...");
			this.comInterface = interf;
			interf.onEndpointSet = async (endpoint: Datex.Endpoint) => {
				console.debug(`Got the other origins endpoint reponse (${endpoint?.main}). Getting interface...`);
				try {
					this.iFrameInterface = await datex`${endpoint}.IFrameInterface`;
				} catch {}
				if (!this.iFrameInterface) {
					await new Promise(async (resolve, reject) => {
						endpoint.online.observe((isOnline)=>{
							if (isOnline)
								resolve(true);
						});
						if (await endpoint.isOnline())
							return resolve(true);
						setTimeout(()=>reject(false), 15_000);
					});
					try {
						for (let i=0; i<3; i++) {
							this.iFrameInterface = await datex`${endpoint}.IFrameInterface`;
							if (this.iFrameInterface)
								break;
						}
					} catch (error) {
						console.error(error);
					}
				}
				if (!this.iFrameInterface) {
					console.error(`Could not get interface from endpoint ${endpoint}`);
					throw new Error("Could not get interface!");
				}
				this.onConnect();
			}
		});
	}

	@frontend
	eventListenersSet = false;

	@frontend
	private async onConnect() {
		console.debug(`Successfully connected with other origin. Saying hello...`);
		await this.iFrameInterface.hello();
		if (!this.eventListenersSet) {
			this.eventListenersSet = true;
			this.setupEvents();
		}
		this.onResize();
		this.classList.add("connected");
	}

	@frontend
	private onIframeResize(height: number) {
		if (height !== 0)
			this.iframe.style.height = height + "px";
	}
}
