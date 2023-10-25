import { Datex } from "unyt_core/datex.ts";
import { Path } from "uix/utils/path.ts";
import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";

type MediaFlowPaneOptions = {
	title?: string,
	description: string,
	mediaSrc: URL | string,
	pretitle?: string,
	alignment?: "left" | "right",
	appearance?: "light" | "dark" | "transparent",
	padding?: number
}
@template<MediaFlowPaneOptions, never, MediaFlowPane>(function ({padding, mediaSrc, description, pretitle, title, appearance, alignment}) {
	return <div class="image-flow-pane" data-padding-top={!!(title && pretitle)} style={`--padding: ${padding ?? 50}px`} data-appearance={appearance ?? "dark"} data-alignment={alignment ?? "left"}>
		<div class="content">
			{
				(title && pretitle) && <>
					<span>{pretitle}</span>
					<h1>{title}</h1>
				</>
			}
			<div>
				{this.getMediaElement(mediaSrc)}
				{new UIX.Elements.Text(description, { markdown: true})}
			</div>
		</div>
	</div>
	})
export class MediaFlowPane extends Component<Component.Options & MediaFlowPaneOptions> {

	getMediaElement(url: Datex.RefOrValue<string | URL>) {
		const urlVal = new Path(val(url));
		const isVideo = (
			urlVal.pathname.endsWith(".webm") ||
			urlVal.pathname.endsWith(".mp4")
		);
		
		if (isVideo) {
			const path = urlVal.toString().replace(/\.[^.]*$/g, '');
			return <video autoplay muted loop playsinline>
				<source src={path.concat(".webm")} type="video/webm"/>
				<source src={path.concat(".mp4")} type="video/mp4"/>
			</video>;
		} 
		else return <img src={url}/>
	}

}