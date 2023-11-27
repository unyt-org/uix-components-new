import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";
import 'https://cdn.jsdelivr.net/npm/marked@9.1.2/+esm';
import { Datex } from "unyt_core/datex.ts";
import { unsafeHTML } from "uix/html/unsafe-html.ts";
declare const marked: any;

@blankTemplate<{value?: Datex.RefOrValue<string>}, Datex.RefOrValue<string>>(({value, children}) => {
	return <>
		{always(()=>
			unsafeHTML(marked((value ?? val(children[0]))?.replaceAll("\n", "\\n") || ''))
		)}
	</>
})
export default class Markdown extends Component<{value?: Datex.RefOrValue<string>}, Datex.RefOrValue<string>> {}
