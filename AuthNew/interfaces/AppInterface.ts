import { Datex } from "unyt_core/datex.ts";

@endpoint
export class AppInterface {
	@property static async onKeysReceived(endpoint: Datex.Endpoint, signKeys: [ArrayBuffer, ArrayBuffer], decKeys: [ArrayBuffer, ArrayBuffer]) {
		console.warn("On logged in: ", endpoint, signKeys, decKeys);
		try {
			debugger;
			await Datex.Supranet.init(endpoint, true, signKeys, decKeys);
			globalThis.location.reload();
		} catch (error) {
			console.error(error)
		}
	}

	@property static async onLoginWithEndpoint(endpoint: Datex.Endpoint) {
		// TODO activate auth proxy
		// const auth = await AuthInterface.get();
		// await auth.useEndpoint(endpoint);
	}
	@property static async onLogout(endpoint?: Datex.Endpoint) {
		console.info("Logging out...", endpoint);
		if (Datex.Runtime.endpoint !== endpoint) {
			const newEndpoint = Datex.Endpoint.get(Datex.Endpoint.createNewID()) as Datex.IdEndpoint;
			try {
				await Datex.Supranet.init(newEndpoint, true);
			} catch {
				// @ts-ignore $
				globalThis.reset?.();
			}
		}
		globalThis.location.reload();
	}
}