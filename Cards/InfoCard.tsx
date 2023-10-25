import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";

export type InfoCardOptions = {
	title: string,
	description: string,
}
@template<InfoCardOptions>(({title, description}) =>
	<div class="info-card">
		<h1>{title}</h1>
		<div>{description}</div>
	</div>
)
export class InfoCard extends Component<Component.Options & InfoCardOptions> {
}