import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";
import * as marked from '../lib/marked-js.ts';
import { Datex } from "unyt_core/datex.ts";
import { unsafeHTML } from "uix/html/unsafe-html.ts";
import { baseUrl, toBaseURL } from "../lib/marked-base-url.ts";

@blankTemplate<{value?: Datex.RefOrValue<string>, imageBase?: URL, base?: URL}, Datex.RefOrValue<string>>(({value, children, imageBase, base}) => {
	marked.use(baseUrl(base?.toString() ?? ""))
	const updatePath = (element: Node) => {
		if (element instanceof HTMLImageElement || element?.nodeName?.toLowerCase() === 'img')
			element.setAttribute?.("src", toBaseURL(element.getAttribute("src"), imageBase as URL));
	}
	const resolvePaths = (elements: HTMLElement[]) => {
		if (!base || !imageBase)
			return elements;
		for (const element of elements) {
			updatePath(element);
			element.querySelectorAll("img").forEach(e => updatePath(e));
		}
		return elements;
	}
	return <>
		{always(()=>
			value ?
				resolvePaths([...unsafeHTML(`<div>${marked.parse(val(value), undefined)}</div>`).children])
				: [
					...(children || []).map(child => 
						child instanceof HTMLElement ? 
							child : 
							resolvePaths([...unsafeHTML(`<div>${marked.parse(val(child)?.replaceAll("\\n", "\n"), undefined)}</div>`).children])
					)
				].flat()
		)}
	</>
})
export default class Markdown extends Component<{value?: Datex.RefOrValue<string>, base?: URL | string, imageBase?: URL | string}, Datex.RefOrValue<string>> {
	
}
