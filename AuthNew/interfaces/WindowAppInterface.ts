// deno-lint-ignore-file require-await
@entrypoint
export class WindowAppInterface {
	@property static async hello() { }

	@property static async requestCollapse() {
		globalThis.dispatchEvent(new CustomEvent("onRequestCollapse", {
			detail: { }
		}));
	}

	@property static async onResize(height: number) {
		globalThis.dispatchEvent(new CustomEvent("iframeResize", {
			detail: {
				height
			}
		}));
	}
	@property static async setBlocker(active: boolean) {
		globalThis.dispatchEvent(new CustomEvent("setBlocker", {
			detail: active
		}));
	}
	@property static async refresh() {
		globalThis.dispatchEvent(new CustomEvent("onRefresh"));
	}
}