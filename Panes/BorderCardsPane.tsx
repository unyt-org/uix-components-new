import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";

export type BorderCardsPaneItem = {
	title: string,
	items: string[] | Element[]
}
type BorderCardsPaneOptions = {
	header?: string,
	description?: string,
	items: BorderCardsPaneItem[]
}
@template((_, {items, header, description}) =>
	<div class="border-cards-pane">
		{header && <h1>{header}</h1>}
		{description && <span>{description}</span>}
		{
			<div>
			{
				...(items as unknown as BorderCardsPaneItem[]).map((item) => <fieldset>
						<legend>{item.title}</legend>
						<ul>
							{item.items.map(i => <li>{i}</li>)}
						</ul>
					</fieldset>)
			}
			</div>
		}

	</div>
)
export class BorderCardsPane extends Component<BorderCardsPaneOptions> {
	
}