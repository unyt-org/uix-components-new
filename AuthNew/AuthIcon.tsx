import { template } from "uix/html/template.ts";
import { include } from "uix/base/decorators.ts";
import { AuthComponent } from "./AuthComponent.tsx";

@style("./AuthIcon.scss")
@style("./AuthComponent-standalone.scss")
@template(function() {
	return <AuthComponent {...this.options} __create={true}>
		<div slot={"content"}>
			<a class="toggle">
				<div class="spinner"></div>
				<img class="toggle" src="https://cdn.unyt.org/unyt-resources/logos/unyt/round-dark-background.png"/>
			</a>
			<svg xmlns="http://www.w3.org/2000/svg" class="toggle chevron-down" width="16" height="16" viewBox="0 0 512 512">
				<path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/>
			</svg>
		</div>
		<iframe id="iframe" allow="clipboard-write" allowtransparency="true"/>
	</AuthComponent>
})
@frontend({inheritedFields: ["options", "backdrop", "button", "iframe", "blockerElem"]})
export class AuthIcon extends AuthComponent {
	@include("./AuthIcon.dx") customStrings!: { [ key: string ]: string};

	protected override async onDisplay() {
		await super.onDisplay();
	}

	override setupEvents() {
		super.setupEvents();
		this.addEventListener("click", (e) => this.toggle(e));
	}
}