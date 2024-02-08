// deno-lint-ignore-file require-await
import { endpoint_default, expose, namespace } from "unyt_core/datex_all.ts";
@endpoint_default @namespace
export class WindowAppInterface {
	@expose static async hello() { }

	@expose static async requestCollapse() {
		globalThis.dispatchEvent(new CustomEvent("onRequestCollapse", {
			detail: { }
		}));
	}

	@expose static async onResize(height: number) {
		globalThis.dispatchEvent(new CustomEvent("iframeResize", {
			detail: {
				height
			}
		}));
	}
	@expose static async setBlocker(active: boolean) {
		globalThis.dispatchEvent(new CustomEvent("setBlocker", {
			detail: active
		}));
	}
	@expose static async refresh() {
		globalThis.dispatchEvent(new CustomEvent("onRefresh"));
	}
}