
import { Component } from "uix/components/Component.ts";
import { template } from "uix/html/template.ts";
import { include } from "uix/base/decorators.ts";
import { Icon } from "../Defaults/Icon.tsx";


@template(function() {
	return <>
		<div class="copyright">&copy; <span>{new Date().getFullYear() ?? 2024} unyt.org</span></div>
		<div class="tos">
			<a href="https://unyt.org/terms-of-service" target="_blank">{this.strings.terms}</a>
			<a href="https://unyt.org/privacy" target="_blank">{this.strings.privacy}</a>
			<a href="https://unyt.org/legal-notice" target="_blank">{this.strings.about}</a>
		</div>
		<div id="references" class="references"></div>
	</>
})
export class UnytFooter extends Component {
	@include refs!: Array<{name: string, link:URL, icon:URL | string}>;
	@include strings!: Record<string, string>;

	@id references!: HTMLDivElement;

	public expand() {
		this.classList.add("expanded");
	}
	public collapse() {
		this.classList.remove("expanded");
	}

	override onCreate() {
		this.refs.forEach((ref) => {
			this.references.append(<a title={ref.name} href={ref.link}>
				<Icon name={ref.icon.toString()}/>
			</a>
		)});
	}
}
