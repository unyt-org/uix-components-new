import { Datex } from "unyt_core/datex.ts";
import { endpoint_default, expose, namespace } from "unyt_core/datex_all.ts";

@endpoint_default @namespace
export class AppInterface {
	@expose static async onKeysReceived(endpoint: Datex.Endpoint, signKeys: [ArrayBuffer, ArrayBuffer], decKeys: [ArrayBuffer, ArrayBuffer]) {
		console.warn("On logged in: ", endpoint, signKeys, decKeys);
		try {
			await Datex.Supranet.connect(endpoint, true, signKeys, decKeys);
			globalThis.location.reload();
		} catch (error) {
			console.error(error)
		}
	}

	@expose static async onLoginWithEndpoint(endpoint: Datex.Endpoint) {
		// TODO activate auth proxy
		// const AuthInterface = (await import("http://localhost:9999/@uix/src/common/proxy/auth-interface.ts")).AuthInterface;
		// const auth = await AuthInterface.get();
		// await auth.useEndpoint(endpoint);
	}
	@expose static async onLogout(endpoint?: Datex.Endpoint) {
		console.info("Logging out...", endpoint);
		if (Datex.Runtime.endpoint !== endpoint) {
			const newEndpoint = Datex.Endpoint.get(Datex.Endpoint.createNewID()) as Datex.IdEndpoint;
			await Datex.Supranet.connect(newEndpoint, true);
			globalThis.location.reload();
		}
	}
}