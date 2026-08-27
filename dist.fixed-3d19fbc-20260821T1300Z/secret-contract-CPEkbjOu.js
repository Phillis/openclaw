import { a as createSimpleChannelSecretContract } from "./channel-secret-basic-runtime--kHasITf.js";
import "./channel-secret-basic-runtime-BUtqhYr9.js";
//#region extensions/nextcloud-talk/src/secret-contract.ts
const channelSecrets = createSimpleChannelSecretContract({
	channelKey: "nextcloud-talk",
	label: "Nextcloud Talk",
	accountFields: ["apiPassword", "botSecret"],
	channelFields: ["apiPassword", "botSecret"],
	mode: {
		kind: "surface-inheritance",
		collectionFields: ["botSecret", "apiPassword"]
	}
});
const { secretTargetRegistryEntries, collectRuntimeConfigAssignments } = channelSecrets;
//#endregion
export { collectRuntimeConfigAssignments as n, secretTargetRegistryEntries as r, channelSecrets as t };
