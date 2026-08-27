import { a as createSimpleChannelSecretContract } from "../../channel-secret-basic-runtime-DyoTL1FR.js";
import "../../channel-secret-basic-runtime-uhDHsA4U.js";
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
