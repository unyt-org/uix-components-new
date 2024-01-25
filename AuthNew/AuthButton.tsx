import { include } from "uix/base/decorators.ts";
import { AuthComponent } from "./AuthComponent.tsx";

@style("./AuthButton.scss")
@style("./AuthComponent-standalone.scss")
@template(function(this: AuthButton) {
	const shape = this.options.shape ?? "rect";
	return <AuthComponent {...this.options} __create={true}>
		<div slot={"content"}>
			<div class="auth-button" data-shape={shape} id="button" onclick:frontend={() => use(this) && this.onButtonClick()}>
				<div>
					<img src="https://cdn.unyt.org/unyt-resources/logos/unyt/round-dark-background.png"/>
				</div>
				{shape === "rect" ? <span>{this.customStrings.continue}</span> : undefined}
			</div>
			<iframe id="iframe" allow="clipboard-write" allowtransparency="true"/>
		</div>
	</AuthComponent> 
})
export class AuthButton extends AuthComponent<{ shape?: "rect" | "square" | "circle" }> {
	@frontend declare options;
	@frontend protected declare backdrop: HTMLDivElement;
	@frontend protected declare button: HTMLDivElement;
	@frontend protected declare iframe: HTMLIFrameElement;
	@frontend protected declare blockerElem: HTMLDivElement;
	@include("./AuthButton.dx") declare customStrings: { [ key: string ]: string};
	@frontend forceDevice = true;
	@frontend
	protected override async onDisplay() {
		await super.onDisplay();
	}

	@frontend
	protected onButtonClick() {
		this.expand();
	}

	// @frontend
	// override async onConnect() {
	// 	await super.onConnect();
	// }
}