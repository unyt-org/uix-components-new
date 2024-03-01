import type { Path } from 'uix/utils/path.ts';
import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";

type QuotePaneOptions = {
	items: QuotePaneItem[]
}
export type QuotePaneItem = {
	description: string,
	reference: string | Element,
}
@template(({items}) =>
	<div class="quote-pane">
		{
			(items as QuotePaneItem[]).map(item => {
				return <div>
					<span>”</span>
					<p>{item.description}</p>
					{item.reference instanceof Element ?
						item.reference :
						<div>{item.reference}</div>
					}
				</div>
			})
		}
	</div>
)
export class QuotePane extends Component<QuotePaneOptions> {
}