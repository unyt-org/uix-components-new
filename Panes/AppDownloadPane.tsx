import { Path } from 'uix/utils/path.ts';
import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";

type AppDownloadPaneOptions = {
	header: string,
	image: string | URL,
	linkAppstore?: string | URL,
	linkPlaystore?: string | URL
}
@template<AppDownloadPaneOptions>(({ header, image, linkAppstore, linkPlaystore}) =>
	<div class="app-download-pane">
		<div class="content">
			<img src={image}/>
			<div>
				<h1>{new UIX.Elements.Text(header, { markdown: true })}</h1>
				<div>
					<a target="_blank" href={linkAppstore}>
						<img src={"https://cdn.unyt.org/unyt-resources/logos/third-party/app-store/apple-badge.svg"}/>
					</a>
					<a target="_blank" href={linkPlaystore}>
						<img src={"https://cdn.unyt.org/unyt-resources/logos/third-party/app-store/play-store-badge.svg"}/>
					</a>
				</div>
			</div>
		</div>
	</div>
)
export class AppDownloadPane extends Component<Component.Options & AppDownloadPaneOptions> {
	
}