import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";
import Markdown from "../Defaults/Markdown.tsx";

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
				<h1>
					<Markdown value={header}/>
				</h1>
				<a href={link}>{buttonText}</a>
			</div>
			<div>
				<Markdown value={description}/>
				<img src=""/>
			</div>
		</div>
	</div>
)
export class WhitepaperPane extends Component<WhitepaperPaneOptions> {
	
}
