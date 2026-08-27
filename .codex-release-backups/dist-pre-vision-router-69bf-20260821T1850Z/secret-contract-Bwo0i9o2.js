import { a as createSimpleChannelSecretContract } from "./channel-secret-basic-runtime--kHasITf.js";
import "./channel-secret-basic-runtime-BUtqhYr9.js";
//#region extensions/buzz/src/secret-contract.ts
const channelSecrets = createSimpleChannelSecretContract({
	channelKey: "buzz",
	label: "Buzz",
	accountFields: [],
	channelFields: ["privateKey", "authTag"],
	mode: "channel-surface"
});
const { secretTargetRegistryEntries, collectRuntimeConfigAssignments } = channelSecrets;
//#endregion
export { collectRuntimeConfigAssignments as n, secretTargetRegistryEntries as r, channelSecrets as t };
