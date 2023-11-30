import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";
import 'https://cdn.jsdelivr.net/npm/marked@9.1.2/+esm';
import { Datex } from "unyt_core/datex.ts";
import { unsafeHTML } from "uix/html/unsafe-html.ts";
declare const marked: any;

@blankTemplate<{value?: Datex.RefOrValue<string>}, Datex.RefOrValue<string>>(({value, children}) => {
	return <>
		{always(()=>
			value ?
				[...unsafeHTML(`<div>${marked(val(value))}</div>`).children]
				: [
					...(children || []).map(child => 
						child instanceof HTMLElement ? 
							child : 
							[...unsafeHTML(`<div>${marked(val(child)?.replaceAll("\\n", "\n"))}</div>`).children]
					)
				].flat()
		)}
	</>
})
export default class Markdown extends Component<{value?: Datex.RefOrValue<string>}, Datex.RefOrValue<string>> {}
