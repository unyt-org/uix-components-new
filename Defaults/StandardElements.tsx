// deno-lint-ignore-file no-namespace

import { Component } from "uix/components/Component.ts";
import { template } from "uix/html/template.ts";

export namespace Anchor {
	export interface Options extends UIX.Elements.Base.Options {
		title?: string;
		href: string | URL;
		content?: HTMLElement;
		sameWindow?: boolean;
		onClick?: (event: Event) => void;
	}
}

@UIX.Element
export class Anchor<O extends Anchor.Options = Anchor.Options> extends UIX.Elements.Base<O> {
	protected declare content: HTMLAnchorElement;

	constructor(options?: O) {
		super(options);
		if (this.wasLoadedStatic) return;

		this.content = <a href="/" >{this.options.content ?? this.options.title}</a> as HTMLAnchorElement;
		this.options.title && (this.content.title = this.options.title); // FIXME make Datex compatible

		if (this.options.sameWindow === false || !this.options.href.toString().startsWith('#'))
			this.content.target = '_blank';
		if (this.options.sameWindow)
			this.content.target = '';
		this.content.href = this.options.href?.toString() ?? '';
		this.append(this.content);

		this.onclick = (e) => this.options.onClick?.(e);
		this.style.textDecoration = "none"
	}

	public clearContent() {
		this.firstChild?.childNodes.forEach(e => e.remove());
	}
}


export namespace AnchorIcon {
	export interface Options extends Anchor.Options {
		icon?: HTMLElement | string | URL,
		src?: string,
		size?: number;
	}
}
@UIX.Element<AnchorIcon.Options>({
	// @ts-ignore $
	size: 16
})
export class AnchorIcon<O extends AnchorIcon.Options = AnchorIcon.Options> extends Anchor<O> {
	constructor(options: O) {
		super(options);
		if (this.wasLoadedStatic) return;
		
		if (this.options.icon instanceof URL)
			this.options.src = this.options.icon.toString(), this.options.icon = undefined;
		const size = `${this.options.size ?? 16}px`;

		let icon;
		if (this.options.icon && typeof this.options.icon === "string")
			icon = UIX.HTMLUtils.setCSS(IEL(this.options.icon), { fontSize: size });
		else if (this.options.icon instanceof HTMLElement)
			icon = this.options.icon;
		else icon = new UIX.Elements.Image({
			src: this.options.src
		}).css({ 
			width: size,
			display: "flex"
		})

		this.clearContent();
		this.content.appendChild(icon);
	}
}