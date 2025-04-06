
import { Component } from "uix/components/Component.ts";
import { Datex } from "datex-core-legacy";
import { template } from "uix/html/template.ts";
import { include } from "uix/base/decorators.ts";
import { Icon } from "../Defaults/Icon.tsx";
import { UIX } from "uix";
import ToggleSwitch from "../Defaults/ToggleSwitch.tsx";
import { LanguageSelect } from "./LanguageSelect.tsx";

@template(function() {
	return <div>
		<div id="sitemapTitle">
			<img src={{dark: 'https://cdn.unyt.org/unyt-resources/logos/unyt/text-light-transparent-3.svg', light: 'https://cdn.unyt.org/unyt-resources/logos/unyt/text-dark-transparent-3.svg'}[UIX.Theme.mode]}></img>
		</div>
		<a title='unyt.org' id="sitemapLink">
			<Icon name="fa-chevron-up"/>
		</a>
		<div id="sitemapSections"></div>
		<div id="settingsRow">
			<LanguageSelect/>

			<div>
				<ToggleSwitch
					size={38}
					checked={UIX?.Theme?.mode === "dark"}
					label={UIX?.Theme?.mode === "dark" ? this.strings.theme_dark : this.strings.theme_light}
					id="appearanceToggle"/>
			</div>
		</div>
	</div>
})
@standalone({inheritedFields: ["options"]})
export class Sitemap extends Component<{disableAnchor?: boolean}> {
	@id("sitemapTitle") sitemapTitle!: HTMLDivElement;
	@standalone @id("sitemapLink") sitemapLink!: HTMLAnchorElement;
	@include strings!: Record<string, Datex.Value<string>>
	@include map!: Array<{topic: string, items: {name: string, link: string}[]}>;

	@id("sitemapSections") sitemapSections!: HTMLDivElement;

	@standalone @property appearance = "";
	@standalone @id appearanceToggle!: ToggleSwitch
	
	@id("settingsRow") settingsRow!: HTMLElement;

	private createSections() {
		this.map.forEach((entry) => {
			const topic = <div></div>;
			topic.append(
				<div class="title">{entry.topic}</div>
			);
			entry.items.forEach((item)=>{
				topic.append(<a href={item.link} target="_blank">{item.name}</a>);
			});
			this.sitemapSections.append(topic);
		})
	}

	declare onScrollTop: () => void;

	protected override async onDisplay() {
		this.sitemapLink && ((this.sitemapLink as HTMLElement).onclick = () => {
			if (this.options?.disableAnchor && this.onScrollTop)
				this.onScrollTop();
			else globalThis.scrollTo({top: 0, behavior: "smooth"});
		});
		if (!globalThis.UIX) await import("uix");
		
		this.appearanceToggle.setChecked(UIX.Theme.mode === "dark");
		this.appearanceToggle.onToggle(e => {
			UIX.Theme.setMode(e ? "dark" : "light");
		})
	}

	@standalone themeThreshold = false;
	@standalone toggleTheme() {
		if (this.themeThreshold)
			return;
		this.themeThreshold = true;
		setTimeout(()=>(this.themeThreshold = false), 300);
		UIX.Theme.setMode(UIX.Theme.mode === "light" ? "dark" : "light");
		
		//this.apperanceToggle!.parentElement!.querySelector("span")!.innerText = `Mode: ${UIX.Theme.mode.val === "dark" ? "Dark": "Light"}`;
	}

	override onCreate() {
		this.$.appearance = UIX.Theme.mode === "dark" ? this.strings.theme_dark : this.strings.theme_light;
		this.createSections();
	}
}
