import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";
import 'https://cdn.jsdelivr.net/npm/marked@9.1.2/+esm';
import { Datex } from "unyt_core/datex.ts";
declare const marked: any;

@blankTemplate<{}, Datex.RefOrValue<string>>(({children}) => {
	return <>
		{always(()=>{
			marked(val(children)?.replaceAll("\n", "\\n") || '')
		})}
	</>
})
export default class Markdown extends Component<{value?: Datex.Ref<string>}> {
	
}
