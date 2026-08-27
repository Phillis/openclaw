import { r as getRuntimeConfig } from "../../io-BTBpQ7uO.js";
import "../../runtime-config-snapshot-D2wEj--P.js";
import { n as parseBrowserNativeHostOrigins, r as runBrowserNativeHost } from "../../extension-native-host-CFjloRah.js";
import { t as buildBrowserExtensionPairing } from "../../extension-pairing-CfSFqNLw.js";
//#region extensions/browser/native-host-entry.ts
function requiredArgument(name) {
	const index = process.argv.indexOf(name);
	const value = index >= 0 ? process.argv[index + 1] : void 0;
	if (!value) throw new Error(`Missing ${name}`);
	return value;
}
async function main() {
	const { callerOrigin, expectedOrigins } = parseBrowserNativeHostOrigins(process.argv.slice(2));
	let responseFrame;
	await runBrowserNativeHost({
		manifestPath: requiredArgument("--manifest"),
		launcherPath: requiredArgument("--launcher"),
		callerOrigin,
		expectedOrigins,
		input: process.stdin,
		write: (frame) => {
			responseFrame = frame;
		},
		buildPairing: async () => await buildBrowserExtensionPairing({
			cfg: getRuntimeConfig(),
			localTransport: "gateway"
		})
	});
	const response = responseFrame;
	if (!response) throw new Error("Native host produced no response frame");
	await new Promise((resolve) => {
		process.stdout.write(response, () => resolve());
	});
}
main().catch(() => {
	process.exitCode = 1;
});
//#endregion
export {};
