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
@frontend({
	inheritedFields: ["options", "backdrop", "button", "iframe", "blockerElem"]
})
export class AuthButton extends AuthComponent<{ shape?: "rect" | "square" | "circle" }> {

	@include("./AuthButton.dx") customStrings!: { [ key: string ]: string};
	@frontend forceDevice = true;
	protected override async onDisplay() {
		await super.onDisplay();
	}

	protected onButtonClick() {
		this.expand();
	}
}