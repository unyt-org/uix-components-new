import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";

@template(function() {
	return <>
		<a id="logo" href="/">
			<img src='https://cdn.unyt.org/unyt-resources/logos/unyt/text-light-transparent-3.svg'/>
		</a>
		<div id="navigationContainer"></div>
		<div id="actionContainer">
			<img src='https://cdn.unyt.org/unyt-resources/logos/unyt/round-dark-background.png'/>
		</div>
	</>
})
export class DefaultFooter extends Component {
}