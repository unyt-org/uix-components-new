import { Component } from "uix/components/Component.ts";
import { Icon } from "components/Defaults/Icon.tsx";

@template(function(this: LanguageSelect) {
	return <>
		<label for="language-picker-select">
			<Icon name="fa-globe"/>
		</label>
		<select id="picker">
			<option value="de">German</option>
			<option value="en" selected>English</option>
		</select>
	</>
})
export class LanguageSelect extends Component {
	@frontend @id declare picker: HTMLSelectElement;

	@frontend
	override async onDisplay() {
		const {UIX} = await import("uix");
		// this.picker.options.namedItem()
		this.addEventListener("click", () => {
			this.classList.add("active");
			this.picker.focus();
			this.picker.click();
		})
	}
}