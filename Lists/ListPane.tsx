import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";
type ListPaneOptions = {
	title: string,
	description?: string,
	appearance?: "light" | "dark"
} & ({
	type: "icon",
	items: IconPaneItem[]
} | {
	type: "link",
	items: LinkPaneItem[]
})

export type IconPaneItem = {
	icon: string,
	title: string,
	description: string
}
export type LinkPaneItem = {
	link: URL | string,
	title: string,
	description: string,
	linkText?: string,
	totalLink?: boolean,
}
@template<ListPaneOptions>((options) => {
	const {description, items, title, appearance } = options;
	return <div class="list-pane" data-type={options.type} data-appearance={appearance ?? "dark"}>
		<div class="content">
			<h1>{title}</h1>
			{description && new UIX.Elements.Text(description, { markdown: true })}
			<div class="list-container">
				{
					(items as (IconPaneItem | LinkPaneItem)[]).map((item, index) => {
						if (options.type === "icon")
							return <div class={"list-item"} data-index={index}>
								{IEL((item as IconPaneItem).icon)}
								<h2>{item.title}</h2>
								{ new UIX.Elements.Text(item.description, {markdown: true})}
							</div>
						else if (options.type === "link")
							return <div class={"list-item"} data-href={(item as LinkPaneItem).link} onclick={((event: Event)=>{
								console.log("this", this)
							})}>
								<h2>{item.title}</h2>
								<span>{new UIX.Elements.Text(item.description, {markdown: true})}</span>
								<a href={(item as LinkPaneItem).link}>{(item as LinkPaneItem).linkText ?? "Click to see more"} <Icon name="fa-chevron-right"/></a>
							</div>
					})
				}
			</div>
		</div>
	</div>
})
export class ListPane extends Component<Component.Options & ListPaneOptions> {
	@frontend
	declare options: any;

	@frontend
	protected override onDisplay(): void | Promise<void> {
		[...this.querySelectorAll(".list-item") as unknown as HTMLElement[]].forEach((item, index) => {
			if ((this.options.items[index] as LinkPaneItem).totalLink)
				item.onclick = () =>
					window.location.href = (item as HTMLElement)!.getAttribute("data-href")!;
		})
	}
}