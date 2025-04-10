import { Datex } from "datex-core-legacy/datex.ts";
import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";
import Markdown from "./Markdown.tsx";
import { include } from "uix/base/decorators.ts";

@template(function() {
	const href = this.links && this.links[0] ?
		[this.links[0].toString(), this.links[1].toString()]
		: ["https://github.com/unyt-org", "https://unyt.org/patreon"];
	
	this.options?.reverseOrder && href.reverse();
	return <>
		<div id="main" class="tour-footer-main" style="--delay: 7s">
			<div>
				<h1>
					<span style={`--content:'${this.strings.keyword1}.';--start-color:#0075e2;--end-color:#00cdc6`}>
						<span>{this.strings.keyword1.toString()}.</span>
					</span>
					&nbsp;
					<span style={`--content:'${this.strings.keyword2}.';--start-color:#7025bc;--end-color:#f10079`}>
						<span>{this.strings.keyword2.toString()}.</span>
					</span>
					&nbsp;
					<span style={`--content:'${this.strings.keyword3}.';--start-color:#f84848;--end-color:#edc228`}>
						<span>{this.strings.keyword3.toString()}.</span>
					</span>
				</h1>
				<Markdown value={this.strings.description}/>
			</div>
			<div>
				<a href={href[0]} class="button-elem">
					{this.options?.reverseOrder ? this.strings.button2 : this.strings.button1}
				</a>
				<div class="button-container">
					<span style="--start-color:#0075e2;--end-color:#00cdc6"></span>
					<span style="--start-color:#7025bc;--end-color:#f10079"></span>
					<span style="--start-color:#FF4D4D;--end-color:#edc228"></span>
					<a href={href[1]} class="button-elem">
						{this.options?.reverseOrder ? this.strings.button1 : this.strings.button2}
					</a>
				</div>
			</div>
		</div>
	</>;
})
@standalone({inheritedFields: ["options"]})
export class TourFooter extends Component<{ reverseOrder?: boolean }> {
	@include strings!: Record<string, Datex.Pointer<string>>
	@include links!: [URL, URL];
	@id main!: HTMLDivElement;
}
