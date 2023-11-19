// deno-lint-ignore-file no-unused-vars
export class IFrameInterface {
	static async hello() { }

	// @ts-ignore $
	static async isExpanded(): Promise<boolean> {}
	static setAppearance(mode: "desktop" | "mobile") {}
	static async collapse() { }
	static async expand() { }
	static async reopenAuthWindow() {};
}