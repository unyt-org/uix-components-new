import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";

type ArticlePaneOptions = {
	title: string,
	description?: string,
	appearance?: "light" | "dark",
	items: ArticlePaneItem[]
}

export type ArticlePaneItem = {
	link: URL | string,
	title: string,
	description: string,
	image?: URL | string,
	subtitle?: string,
	linkText?: string,
	totalLink?: boolean,
}
@template<ArticlePaneOptions>((options) => {
	const {description, items, title, appearance } = options;
	return <div class="article-list-pane" data-appearance={appearance ?? "dark"}>
		<div class="content">
			<h1>{title}</h1>
			{description && <span>{description}</span>}
			<div class="list-container">
				{
					(items as ArticlePaneItem[]).map((item, index) => {
						return <div class={"article-list-item"} data-index={index} data-href={item.link}>
							{item.image && <img src={item.image}/>}
							{item.subtitle && <span class="subtitle">{item.subtitle}</span>}
							<h2>{item.title}</h2>
							<span>{new UIX.Elements.Text(item.description, {markdown: true})}</span>
							<a href={item.link}>{item.linkText ?? "Click to see more"} <Icon name="fa-chevron-right"/></a>
						</div>
					})
				}
			</div>
		</div>
	</div>
})
export class ArticlePane extends Component<Component.Options & ArticlePaneOptions> {
	@frontend
	declare options: any;

	@frontend
	protected override onDisplay(): void | Promise<void> {
		[...this.querySelectorAll(".article-list-item") as unknown as HTMLElement[]].forEach((item, index) => {
			if (this.options.items[index].totalLink)
				item.onclick = () =>
					window.location.href = (item as HTMLElement)!.getAttribute("data-href")!;
		})
	}
}