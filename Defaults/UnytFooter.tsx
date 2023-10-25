
import { Component } from "uix/components/Component.ts";
import { Anchor } from './StandardElements.tsx';
import { AnchorIcon } from './StandardElements.tsx';
import { template } from "uix/html/template.ts";


@Component({
	temporary: true,
	border_radius: 0,
	border: false
})
export class UnytFooter extends Component<Component.Options> {
	@content copyright = HTML `<div>&copy; <span>2023 unyt.org</span></div>`
	@content tos = HTML `<div/>`;
	@content references = HTML `<div/>`;
	@use declare refs: Array<{name: string, link:URL, icon:URL | string}>;
	@use declare strings: Record<string, string>;

	// @content declare listView: UIX.Components.ListGroup;

	public expand() {
		this.content_container.classList.add("expanded");
	}
	public collapse() {
		this.content_container.classList.remove("expanded");
	}

	override onCreate() {
		this.refs.forEach((ref) => {
			this.references.append(
				new AnchorIcon({
					size: 30,
					title: ref.name,
					href: ref.link,
					icon: ref.icon
				})
		)});
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