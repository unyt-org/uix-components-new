import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";

export type ToggleEvent = CustomEventInit<{checked: boolean, originalEvent: Event}>;

@template(function(this: ToggleSwitch) {
	return <>
		{this.options.label ? <label class="label" for="toggle-switch">
			{this.options.label}
		</label> : undefined}
		<label class="toggle-switch" for="toggle-switch" style={`--size: ${this.options.size ?? 50}px`}>
			<input
				id="toggle-switch"
				type="checkbox"
				checked={this.options.checked ?? false}/>
			<span class="slider"/>
		</label>
	</>
})
export default class ToggleSwitch extends Component<Component.Options & {
	checked?: boolean,
	size?: number,
	label?: string | HTMLElement
}> {
	@frontend @id("toggle-switch") declare switch: HTMLInputElement;

	public set checked(val: boolean) {
		this.switch.checked = val;
	}
	public get checked(): boolean {
		return this.switch.checked;
	}

	@frontend
	public onToggle(callback: (e: ToggleEvent)=>void) {
		this.addEventListener("toggle", e => callback(e));
	}

	@frontend
	protected override onDisplay(): void|Promise<void> {
		this.onToggle((e)=>{
			e.detail?.checked
		})
		this.switch.addEventListener("input", (e) => {
			this.dispatchEvent(new CustomEvent("toggle", {
				detail: {
					checked: this.checked,
					originalEvent: e
				}
			}));
		});
	}

	
}