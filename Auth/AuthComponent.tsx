import { AuthIcon } from './AuthIcon.tsx';
import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";

@template()
export class AuthComponent extends Component {
	@content authIcon = new AuthIcon();
	@standalone @content signupContainer = 
		<div>
			<a onclick={()=>this.signIn()}>Sign in</a>
			<a>Sign up</a>
		</div>;

	@standalone private signIn() {
		console.log("sign in")
		const width = 400;
		const height = 600;
		const left = (screen.width/2)-(width/2);
		const top = (screen.height/2)-(height/2);
		const authWindow = window.open('http://localhost/', 'unyt Auth', `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=${width},height=${height},left=${left},top=${top}`)
		console.log(authWindow)
	}

	private handleSignedIn() {
		this.signupContainer.classList.toggle("active", false);
		this.authIcon.classList.toggle("active", true);
	}

	private handleSignedOut() {
		this.signupContainer.classList.toggle("active", true);
		this.authIcon.classList.toggle("active", false);
	}

	override onCreate() {
		this.handleSignedOut();
		// Math.random() < .5 ? this.handleSignedOut() : this.handleSignedIn();
	}
}