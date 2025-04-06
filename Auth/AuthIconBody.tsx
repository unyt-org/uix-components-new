// deno-lint-ignore-file no-namespace
import { Datex } from "datex-core-legacy/datex.ts";
import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";
import { include } from "uix/base/decorators.ts";

export namespace AuthIconBody {
	export interface Options extends Component.Options {
		endpointIdentifier: string
	}
}

@template()
export class AuthIconBody<O extends AuthIconBody.Options = AuthIconBody.Options> extends Component<O> {
	@content endpointInfo!: HTMLElement;
	@include("./AuthIcon.dx") body!: Record<string, Datex.CompatValue<string>>;
	
	@content buttonContainer = <div>
		{/* <a>Your profile</a> */}
		{/* <a>Application</a>
		<a>Preferences</a>
		<a>Help</a>
		<a>Sign out</a> */}
	</div>

	createButton(title: string | Datex.CompatValue<string>, action: URL | string | ((event: Event) => void)) {
		const isFun = typeof action === "function";
		const link = <a href={isFun ? '/' : action} title={title}>{title}</a>;
		isFun && (link.onclick = (event: Event) => {
			event.preventDefault();
			event.stopPropagation();
			action(event)
		});
		this.buttonContainer.append(link);
	}

	private signOut() {
		console.log("SIGNING OUT ...");
		globalThis.location.reload();
	}

	override onCreate() {
		this.createButton(this.body.profile, `https://unyt.org/profile/${this.options.endpointIdentifier}`);
		this.createButton(this.body.applications, `https://unyt.org/profile/${this.options.endpointIdentifier}/apps`);
		this.createButton(this.body.preferences, `https://unyt.org/settings`);
		this.createButton(this.body.support, `https://docs.unyt.org/`);
		this.createButton(this.body.sign_out, ()=>this.signOut());
		this.endpointInfo = <div>
			<a title={this.body.profile} href={`https://unyt.org/profile/${this.options.endpointIdentifier}`}>
				@<span>{this.options.endpointIdentifier}</span>
			</a>
		</div>;
	}
}