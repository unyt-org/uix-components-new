import { Path } from 'uix/utils/path.ts';
import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";

type RoundImagePaneEntry = {
	image: string | Path,
	header: string,
	description: string,
	link: URL | string | Element,
	linkText?: string
}
type RoundImagePaneOptions = {
	header?: string,
	description?: string,
	appearance?: "light" | "dark" | "transparent"
	items: RoundImagePaneEntry[]
}
@template<RoundImagePaneOptions>(({ header, appearance, description, items}) =>
	<div class="round-image-pane" data-appearance={appearance ?? "light"}>
		<div class="content">
			{header && <h1>{header}</h1>}
			{description && <span>{description}</span>}
			<div>
				{
					...(items as RoundImagePaneEntry[]).map(item => <div>
						<img src={item.image}/>
						<h2>{item.header}</h2>
						<span>{item.description}</span>
						{item.link instanceof Element ? item.link : <a target={"_blank"} href={link}>{item.linkText}</a>}
					</div>)
				}
			</div>
		</div>
	</div>
)
export class RoundImagePane extends Component<Component.Options & RoundImagePaneOptions> {
	
}