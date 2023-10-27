const IDENTIFIER = "UIX-FA";
export function Icon({name}: {name: string}) {
	if (!document.head.querySelector(`link#${IDENTIFIER}`))
		document.head.append(<link
			id={IDENTIFIER}
			href={"https://dev.cdn.unyt.org/uix/style/fontawesome.css"}
			rel={"stylesheet"}/>);
	return <span class={`fa ${name}`}/>
}