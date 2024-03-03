import { UIX } from "uix";
import { Component } from "uix/components/Component.ts";
import { Icon } from "./Icon.tsx";

@template(function(this: LanguageSelect) {
	return <>
		<label for="language-picker-select">
			<Icon name="fa-globe"/>
		</label>
		<select id="picker">
			<option value="de">Deutsch</option>
			<option value="en">English</option>
		</select>
	</>
})
export class LanguageSelect extends Component {
	@standalone @id picker!: HTMLSelectElement;

	override onCreate() {
		if (UIX) {
			const lang = UIX.language == "de" ? "de" : "en";
			(this.picker.querySelector(`option[value='${lang}']`) as HTMLOptionElement).selected = true;
		}
	}

	@standalone
	selectLanguage() {

	}

	@standalone
	override async onDisplay() {
		const defaultLanguage = navigator.language?.startsWith("de") ? "de" : "en";
		this.picker.value = defaultLanguage;
		this.addEventListener("click", () => {
			this.classList.add("active");
			this.picker.focus();
			this.picker.click();
		})
		const {UIX} = await import("uix");
		this.picker.value = UIX.language == "de" ? "de" : "en";
		this.picker.addEventListener("input", () => {
			UIX.language = this.picker.value;
			globalThis.location.reload();
		})
	}
}