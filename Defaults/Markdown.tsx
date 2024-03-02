import { Component } from "uix/components/Component.ts";
import * as marked from '../lib/marked-js.ts';
import { Datex } from "unyt_core/datex.ts";
import { unsafeHTML } from "uix/html/unsafe-html.ts";
import { baseUrl, toBaseURL } from "../lib/marked-base-url.ts";

@blankTemplate(({value, children, imageBase, base}) => {
	const options = baseUrl(base?.toString() ?? "");
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
		{
			value ?
				resolvePaths([...unsafeHTML(`<div>${marked.parse(val(value), options)}</div>`).children])
				: [
					...(children || []).map(child => 
						child instanceof HTMLElement ? 
							child : 
							resolvePaths([...unsafeHTML(`<div>${marked.parse(val(child)?.replaceAll("\\n", "\n"), options)}</div>`).children])
					)
				].flat()
		}
	</>
})
export class Markdown extends Component<{value?: Datex.RefOrValue<string>, base?: URL | string, imageBase?: URL | string}, Datex.RefOrValue<string>> {
	
}

export default Markdown;