const IDENTIFIER = "UIX-FA";
export const Icon = template<{name: string}>(({name}) => {
	if (document.head && document.head.querySelector) {
		if (!document.head.querySelector(`link#${IDENTIFIER}`))
			document.head.append(<link
				id={IDENTIFIER}
				href={"https://dev.cdn.unyt.org/uix/style/fontawesome.css"}
				rel={"stylesheet"}/>);
	} else {
		// FIXME add to document head on deno!
		// console.warn("Could not add font awesome!")
	}
	return <span class={`fa ${name}`}/>
});