import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";

type VerticalListOptions = {
	items: Element[]
}
@template<VerticalListOptions>(({items}) =>
	<ul class="vertical-list">
		{(items as Element[]).map(item => <li>
			<div>
				<svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
					<path d="M4 8a4 4 0 1 1 8 0 4 4 0 0 1-8 0Zm4-2.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"></path>
				</svg>
			</div>
			<p>{item}</p>
		</li>)}
	</ul>
)
export class VerticalList extends Component<VerticalListOptions> {
	
}