import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";

export type FAQSectionPaneItem = {
	title: string,
	description: string | Element | Element[]
}
type FAQSectionPaneOptions = {
	items: FAQSectionPaneItem[]
}
@template<FAQSectionPaneOptions>(({items}) =>
	<div class="faq-section-pane">
		{(items as FAQSectionPaneItem[]).map(item => <details>
			<summary><h3>{item.title}</h3></summary>
			{Array.isArray(item.description) ? 
				item.description.map(e => e) : 
				new UIX.Elements.Text(item.description, { markdown: true})
			}
		</details>)}
	</div>
)
export class FAQSectionPane extends Component<Component.Options & FAQSectionPaneOptions> {
	
}