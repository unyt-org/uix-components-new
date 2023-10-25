import { Component } from "uix/components/Component.ts";
import { template } from "uix/html/template.ts";
import { Datex, f, not, or, and, transform } from "unyt_core";
import { use } from "uix/base/decorators.ts";

// import { NewsletterServer } from "backend/NewsletterServer.ts";

@template()
export class Newsletter extends Component<Component.Options> {
	@content declare newsletterTitle: HTMLElement;
	@content declare newsletterDescription: HTMLElement;
	@content information = <div></div>
	@content subscriptionContainer = <div></div>
	@content emailContainer = <div></div>

	@property formData = {
		tos: false,
		mail: "",
		mailDisabled: false
	}

	@content declare emailInput: UIX.Elements.EMailInput;
	@content declare sendButton: UIX.Elements.Button;
	@use declare strings: Record<string,Datex.Value<string>>

	override onCreate() {
		const tos = this.$.formData.$.tos;
		const mail = this.$.formData.$.mail;
		const mailValid  = transform([mail], (mail) => !!mail!.match( /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/));
		const mailDisplayValid = transform([mailValid, mail], (mailValid, mail) => mailValid || !mail.length);
		const mailDisabled = this.$.formData.$.mailDisabled;

		// @ts-ignore $
		const user = transform([mail], v => ((v?.length>1||(v?.length&&!v.startsWith('@'))) ? f((v.startsWith('@') ? v : '@'+v) as Datex.endpoint_name) : Datex.BROADCAST)) as Datex.Value<Datex.Endpoint>;
		const userValid = transform([user], (user) => (!user.name.includes(' ') && mail.val.startsWith("@") &&user.name?.length >= 4 && user!=Datex.BROADCAST));


		this.emailInput = new UIX.Elements.EMailInput(mail, {
			placeholder: this.strings.mailPlaceholder,
			valid: or(userValid, mailDisplayValid)
		}).css({
			width: "70%"
		});
		transform([userValid], valid => {
			(this.emailInput.firstChild as HTMLInputElement).style.color = valid ? "var(--unyt_sky_blue)": "unset"
			return valid;
		});

		

		this.newsletterTitle = <span>{this.strings.title}</span>;
		this.newsletterDescription = <span>{this.strings.description}</span>;

		this.sendButton = new UIX.Elements.Button({
			text: this.strings.subscribe,
			color: "var(--bg_dark)",
			disabled: or(not(tos), and(not(mailValid), not(userValid)), mailDisabled),
			onClick: async () => {
				mailDisabled.setVal(true);
				const input = (this.emailInput.firstChild as HTMLInputElement);
				input.disabled = true;
				const response = await NewsletterServer.subscribe(mail.val);
				input.disabled = false;
				mailDisabled.setVal(false);
				mail.setVal('')
				if (response) {
					// replaceChildren() is working but not supported
					this.content.innerHTML = '';
					this.content.append(
						<div>{IEL `fa-thumbs-up`} {this.strings.thankYou}!</div>
					);
				}
			}
		}).css({
			height: "100%"
		})

		this.information.append(
			this.newsletterTitle,
			this.newsletterDescription
		)

		this.emailContainer.append(
			this.emailInput,
			this.sendButton
		)

		this.subscriptionContainer.append(
			this.emailContainer,
			
			new UIX.Elements.Checkbox({
				label: this.strings.tos, 
				checked: tos,
				markdown: true
			}).css({
				"margin-top": "10px",
				"font-size": "small"
			}),

		)

	}
}