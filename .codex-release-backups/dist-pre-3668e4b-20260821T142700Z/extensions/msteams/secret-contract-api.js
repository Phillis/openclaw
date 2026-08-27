import { a as createSimpleChannelSecretContract } from "../../channel-secret-basic-runtime--kHasITf.js";
import "../../channel-secret-basic-runtime-BUtqhYr9.js";
//#region extensions/msteams/src/secret-contract.ts
const channelSecrets = createSimpleChannelSecretContract({
	channelKey: "msteams",
	label: "Microsoft Teams",
	accountFields: [],
	channelFields: ["appPassword"],
	mode: "channel-only"
});
const { secretTargetRegistryEntries, collectRuntimeConfigAssignments } = channelSecrets;
//#endregion
export { channelSecrets, collectRuntimeConfigAssignments, secretTargetRegistryEntries };
