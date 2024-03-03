import { Component } from "uix/components/Component.ts";
import { template } from "uix/html/template.ts";
import Markdown from "../Defaults/Markdown.tsx";
import { include } from "uix/base/decorators.ts";
import { type Datex } from "unyt_core/datex.ts";
import { Icon } from "../Defaults/Icon.tsx";


@template(function(this: NewsletterNew) {
	return <div>
		<div>
			<div class="success">
				<Icon name="fa-thumbs-up"/>
				{this.strings.thankYou}
			</div>
			<div class="information">
				<div id="error" class="error hidden">{this.strings.error} <a target="_blank" href="https://newsletter.unyt.org"><br/>{this.strings.tryAgain}</a></div>
				<h1>{this.strings.title}</h1>
				<span>{this.strings.description}</span>
			</div>
			<form onsubmit={()=>{}} class="input" id="form" onsubmit:frontend={((e: Event)=>{
					try {
						e.preventDefault();
					return false;
					} catch (e) {}
				})}>
				<div>
					<input name="email" type={"email"} placeholder={this.strings.mailPlaceholder} required/>
					<button onclick:frontend={() => use(this) && this.send()} type={"submit"}>{this.strings.subscribe}</button>
				</div>
				<label class="check">
					<Markdown value={this.strings.tos}/>
					<input required type="checkbox"/>
					<span class="checkmark"></span>
				</label>
			</form>
		</div>
	</div>
})
export class NewsletterNew extends Component {
	@include strings!: Record<string,Datex.RefOrValue<string>>;
	@standalone @id form!: HTMLFormElement;
	@standalone @id error!: HTMLDivElement;

	@standalone
	override onDisplay() {
		this.form.onsubmit = () => {}
	}

	@standalone
	async send() {
		this.form.reportValidity();
		if (!this.form.checkValidity())
			return;
		this.form.classList.add("disabled");
		const country = (navigator.language || navigator.userLanguage) === "de-DE" ? "DE" : "EN";
		const data = Object.fromEntries(new FormData(this.form)) as Record<string, string>;
		data.country = country;
		const url = new URL("https://newsletter.unyt.org/subscribe");
		url.search = new URLSearchParams(data).toString();
		this.error.classList.add("hidden");
		try {
			const isOnline = await fetch("https://newsletter.unyt.org", {cache: "no-cache"});
			if (!isOnline.ok)
				throw new Error("Invalid status or not reachable");
			try { await fetch(url, {cache: "no-cache"}); } catch (e) {}
			await new Promise((r) => setTimeout(r, 500));
			this.classList.add("active");
		} catch (e) {
			console.error(e);
			this.form.reset();
			this.form.classList.remove("disabled");
			this.error.classList.remove("hidden");
		}
	}
}