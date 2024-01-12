export class IFrameInterface {
	static async hello() { }

	// @ts-ignore $
	static async isExpanded(): Promise<boolean> {}
	static setAppearance(_appearance: {
		device: "desktop" | "mobile",
		mode: "dark" | "light"
	}) {}
	static async collapse() { }
	static async expand() { }
	static async reopenAuthWindow() {};
}
