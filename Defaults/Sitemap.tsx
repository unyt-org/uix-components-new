
import { Component } from "uix/components/Component.ts";
import { Datex, map } from "unyt_core";
import { template } from "uix/html/template.ts";
import { use } from "uix/base/decorators.ts";

// @template
// export class DropdownMenu2 extends UIX.Elements.DropdownMenu {
// 	override createLayout(){
// 		super.createLayout();
// 		// @ts-ignore $
// 		this.options_container.style["max-height"] = "80px"
// 		this.onclick = () => document.body.append(this.options_container);
// 	}
// }

@template(function(this: Sitemap) { return <div>
	<div id="sitemapTitle">
		<img src={map(UIX.Theme.mode, {dark: 'https://cdn.unyt.org/unyt-resources/logos/unyt/text-light-transparent-3.svg', light: 'https://cdn.unyt.org/unyt-resources/logos/unyt/text-dark-transparent-3.svg'})}></img>
	</div>
	<a title='unyt.org' id="sitemapLink"><Icon name="fa-chevron-up"/></a>
	<div id="sitemapSections"></div>
	<div id="settingsRow">
		{
			this.languageSelector
		}
		<div>
			<span>{this.$$.appearance}</span>
			{this.apperanceToggle}
		</div>
	</div>
</div>})
export class Sitemap extends Component<Component.Options> {
	@id("sitemapTitle") declare sitemapTitle: HTMLDivElement;
	@frontend @id("sitemapLink") declare sitemapLink: HTMLAnchorElement;
	private locale = ["de", "en", "fr", "it"];
	@use declare strings: Record<string, Datex.Value<string>>
	@use declare map: Array<{topic: string, items: {name: string, link: string}[]}>;

	@id("sitemapSections") declare sitemapSections: HTMLDivElement;

	@frontend @id languageSelector = <div></div>
	// new DropdownMenu2(["Deutsch", "English", "Français", "Italiano"], {
	// 	selected_index: this.locale.indexOf(Datex.Runtime.ENV.LANG) ?? 1, 
	// 	onChange: (index: number, _value: string)=>{
	// 		Datex.Runtime.ENV.LANG = this.locale[index] ?? "en";
	// 	}
	// });
	@frontend @property appearance = "";
	@id @frontend apperanceToggle = new UIX.Elements.ToggleSwitch({
		// label: this.$.appearance,
		checked: UIX.Theme.mode.val === "dark",
		onChange: async (checked: boolean) => {
			// await import("uix");

			// console.log("LE")
			// // console.log(globalThis.UIX, "<--")
			// // 
			// // UIX.Theme.setMode(UIX.Theme.mode.val === "light" ? "dark" : "light")
			// UIX.Theme.setMode(checked ? "dark" : "light")
		}
	});
	@id("settingsRow") declare settingsRow: HTMLElement;

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

	@frontend
	declare options: any;
	
	declare onScrollTop: () => void;

	@frontend 
	protected override async onDisplay() {
		this.sitemapLink && ((this.sitemapLink as HTMLElement).onclick = () => this?.onScrollTop?.());

		await import("uix");
		try {
			this.apperanceToggle.removeEventListener("click", this.toggleTheme);
			this.apperanceToggle.addEventListener("click", this.toggleTheme);
			this.apperanceToggle!.parentElement!.querySelector("span")!.innerText = `Mode: ${UIX.Theme.mode.val === "dark" ? "Dark": "Light"}`;
			(this.apperanceToggle!.querySelector(".switch") as HTMLInputElement)!.checked = UIX.Theme.mode.val === "dark";
		} catch (e) {}
	}

	@frontend themeThreshold = false;
	@frontend toggleTheme() {
		if (this.themeThreshold)
			return;
		this.themeThreshold = true;
		setTimeout(()=>(this.themeThreshold = false), 300);
		UIX.Theme.setMode(UIX.Theme.mode.val === "light" ? "dark" : "light");
		this.apperanceToggle!.parentElement!.querySelector("span")!.innerText = `Mode: ${UIX.Theme.mode.val === "dark" ? "Dark": "Light"}`;
	}

	override onCreate() {
		//this.languageSelector.querySelector(".dropdown")!.prepend(<Icon name="fa-globe"/>);
	
		this.$.appearance = UIX.Theme.mode.val === "dark" ? this.strings.theme_dark : this.strings.theme_light;
		// this.settingsRow = <div>{this.languageSelector}</div>;
		// this.settingsRow = <div>{this.languageSelector}<div><span>{this.$$.appearance}</span>{this.apperanceToggle}</div></div>;
		this.createSections();
	}
}