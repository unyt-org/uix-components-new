import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";

type WhitepaperPaneOptions = {
	header: string,
	description: string,
	buttonText: string,
	link: string | URL
}
@template<WhitepaperPaneOptions>(({ header, description, buttonText, link}) =>
	<div class="whitepaper-pane">
		<div class="content">
			<div>
				<h1>{new UIX.Elements.Text(header, { markdown: true })}</h1>
				<a href={link}>{buttonText}</a>
			</div>
			<div>
				{new UIX.Elements.Text(description, { markdown: true })}
				<img src=""/>
			</div>
		</div>
	</div>
)
export class WhitepaperPane extends Component<Component.Options & WhitepaperPaneOptions> {
	
}