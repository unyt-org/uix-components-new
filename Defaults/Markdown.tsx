import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";
import 'https://cdn.jsdelivr.net/npm/marked@9.1.2/+esm';
declare const marked: any;

@template(function(this: Markdown) {
	return <>
		{this.options.value?.replaceAll("\n", "\\n") || ''}
	</>
})
export default class Markdown extends Component<{value?: string}> {
	protected override onCreate(): void|Promise<void> {
		this.innerHTML = marked(this.innerText.replaceAll("\\n", "\n"));
	}
}
