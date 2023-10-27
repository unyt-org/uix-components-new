import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";

@template()
export class DefaultFooter extends Component {
	@content logo = <a href="/">
		<img src='https://cdn.unyt.org/unyt-resources/logos/unyt/text-light-transparent-3.svg'/>
	</a>
	@content navigationContainer = <div></div>
	@content actionContainer = <div>
		<img src='https://cdn.unyt.org/unyt-resources/logos/unyt/round-dark-background.png'/>
	</div>;
}