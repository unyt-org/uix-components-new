
import { Component } from "uix/components/Component.ts";
import { template } from "uix/html/template.ts";
import { use } from "uix/base/decorators.ts";
import { Icon } from "unyt/uix-components-new/Defaults/Icon.tsx";


@template()
export class UnytFooter extends Component<Component.Options> {
	@content copyright = HTML `<div>&copy; <span>2023 unyt.org</span></div>`
	@content tos = HTML `<div/>`;
	@content references = HTML `<div/>`;
	@use declare refs: Array<{name: string, link:URL, icon:URL | string}>;
	@use declare strings: Record<string, string>;

	// @content declare listView: UIX.Components.ListGroup;

	public expand() {
		this.classList.add("expanded");
	}
	public collapse() {
		this.classList.remove("expanded");
	}

	override onCreate() {
		this.refs.forEach((ref) => {
			this.references.append(<a href={ref.link}>
				<Icon name={ref.icon.toString()}/>
				{ref.name}
			</a>
		)});
		return;
		this.tos.append(
			new Anchor({
				title: this.strings.terms,
				href: "https://unyt.org/terms-of-service",
				sameWindow: true
			}),
			new Anchor({
				title: this.strings.privacy,
				href: "https://unyt.org/privacy",
				sameWindow: true
			}),
			new Anchor({
				title: this.strings.about,
				href: "https://unyt.org/legal-notice",
				sameWindow: true
			})
		)
	}
}