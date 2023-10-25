import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";

type DropdownOptions = {
	description?: string,
	icon?: Element | string,
	items: string[]
}
@template<DropdownOptions>(({items, description}) =>
	<div>
		
	</div>	
)
export class Dropdown extends Component<Component.Options & DropdownOptions> {
	
}