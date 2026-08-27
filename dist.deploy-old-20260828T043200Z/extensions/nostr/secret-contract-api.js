import { n as normalizeAccountId } from "../../account-id-BH0zJUew.js";
import { r as collectSecretInputAssignment } from "../../runtime-shared-BoNGt4zS.js";
import { i as createChannelSecretTargetRegistryEntries, o as getChannelRecord } from "../../channel-secret-basic-runtime-iUG8mZr_.js";
import "../../channel-secret-basic-runtime-D79B15GP.js";
//#region extensions/nostr/src/secret-contract.ts
const secretTargetRegistryEntries = createChannelSecretTargetRegistryEntries({
	channelKey: "nostr",
	channel: ["privateKey"]
});
function collectRuntimeConfigAssignments(params) {
	const nostr = getChannelRecord(params.config, "nostr");
	if (!nostr) return;
	const accountId = normalizeAccountId(typeof nostr.defaultAccount === "string" ? nostr.defaultAccount : void 0);
	collectSecretInputAssignment({
		value: nostr.privateKey,
		path: "channels.nostr.privateKey",
		expected: "string",
		defaults: params.defaults,
		context: params.context,
		active: nostr.enabled !== false,
		inactiveReason: "Nostr channel is disabled.",
		owner: {
			ownerKind: "account",
			ownerId: `nostr:${accountId}`,
			requiredForGateway: false,
			disposition: "isolate",
			contract: nostr
		},
		apply: (value) => {
			nostr.privateKey = value;
		}
	});
}
const channelSecrets = {
	secretTargetRegistryEntries,
	collectRuntimeConfigAssignments
};
//#endregion
export { channelSecrets, collectRuntimeConfigAssignments, secretTargetRegistryEntries };
