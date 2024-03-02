import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";

export type ToggleEvent = CustomEventInit<{checked: boolean, originalEvent: Event}>;

@template(function(this: ToggleSwitch) {
	return <>
		{this.options?.label ? <label class="label" for="toggle-switch">
			{this.options?.label}
		</label> : undefined}
		<label class="toggle-switch" for="toggle-switch" style={`--size: ${this.options?.size ?? 50}px`}>
			<input
				id="toggle-switch"
				type="checkbox"
				checked={this.options?.checked ?? false}/>
			<span class="slider"/>
		</label>
	</>
})
@frontend({inheritedFields: ["options"]})
export class ToggleSwitch extends Component<{
	checked?: boolean,
	size?: number,
	label?: string | HTMLElement,
	ontoggle?: (value: boolean) => void
}> {
	@frontend @id("toggle-switch") switch!: HTMLInputElement;
	
	public setChecked(val: boolean) {
		if (this.switch)
			this.switch.checked = val;
	}

	public getChecked(): boolean {
		return this.switch?.checked;
	}

	public onToggle(callback: (value: boolean)=>void) {
		this.addEventListener("toggle", (e: ToggleEvent) => callback(this.getChecked()));
	}

	protected override onDisplay(): void|Promise<void> {
		if (this.options.ontoggle)
			this.onToggle((e) => this.options.ontoggle!(e));
		this.switch.addEventListener("input", (e) => {
			e.stopImmediatePropagation();
			this.dispatchEvent(new CustomEvent("toggle", {
				detail: {
					checked: this.getChecked(),
					originalEvent: e
				}
			}));
		});
	}

	
}

export default ToggleSwitch;