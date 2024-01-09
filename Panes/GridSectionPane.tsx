import type { Path } from 'uix/utils/path.ts';
import { template } from "uix/html/template.ts";

import { Component } from "uix/components/Component.ts";

export type GridSectionPaneItemOptions = {
	title: string,
	description: string,
	buttonText?: string,
	link: string | URL
}

type GridSectionPaneOptions = {
	header?: string,
	description?: string,
	items: GridSectionPaneItemOptions[]
}
@template<GridSectionPaneOptions>(({header, description, items}) =>
	<div class="grid-section">
		{header && <h1>{header}</h1>}
		{description && <span>{description}</span>}
		<div class="grid-container">
			{...(items as GridSectionPaneItemOptions[]).map(item => <div>
				<div class="content">
					<h2>{item.title}</h2>
					<span>{item.description}</span>
					<a href={item.link}>{item.buttonText ?? "View product"} <Icon name="fa-chevron-right"/></a>
				</div>
			</div>)}
		</div>
	</div>
)
export class GridSectionPane extends Component<Component.Options & GridSectionPaneOptions> {
}
