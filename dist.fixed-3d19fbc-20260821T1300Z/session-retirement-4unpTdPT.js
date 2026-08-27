import { t as isIncognitoSessionKey } from "./incognito-session-key-BwpD1Lwd.js";
import { J as releaseCodexAppServerLiveThread, m as retainSharedCodexAppServerClientByInstanceId } from "./shared-client-fWU6PNZb.js";
import { a as closeCodexStartupClientBestEffort, d as unsubscribeCodexThreadBestEffort, r as CodexAppServerUnsafeSubscriptionError } from "./attempt-client-cleanup-Bh556tF7.js";
import { t as codexNativeSubagentMonitorRuntime } from "./native-subagent-monitor-BQ5Ge15m.js";
import "./incognito-session-ciRDvbn4.js";
//#region extensions/codex/src/app-server/session-retirement.ts
/** Retire binding and native subscription under the same generation/physical-client ownership fence. */
async function retireCodexAppServerSessionGeneration(params) {
	const retireGeneration = () => params.mode === "reset" ? params.bindingStore.resetSessionGeneration(params.identity) : params.bindingStore.retireSessionGeneration(params.identity);
	const expectedBinding = await params.bindingStore.read(params.identity);
	if (!expectedBinding) return await retireGeneration();
	return await params.bindingStore.withLease(params.identity, async () => {
		const binding = await params.bindingStore.read(params.identity);
		if (binding?.threadId !== expectedBinding.threadId) return "conflict";
		const result = await retireGeneration();
		if (result !== "applied" || !binding?.clientId) return result;
		const clientLease = retainSharedCodexAppServerClientByInstanceId(binding.clientId);
		if (!clientLease) return result;
		try {
			codexNativeSubagentMonitorRuntime.retireParent(clientLease.client, binding.threadId);
			if (!await releaseCodexAppServerLiveThread(clientLease.client, binding.threadId) && isIncognitoSessionKey(params.identity.sessionKey)) {
				if (!await unsubscribeCodexThreadBestEffort(clientLease.client, {
					threadId: binding.threadId,
					timeoutMs: 5e3
				})) {
					await closeCodexStartupClientBestEffort(clientLease.client);
					throw new CodexAppServerUnsafeSubscriptionError(`Codex retired session subscription could not be released: ${binding.threadId}`);
				}
			}
		} finally {
			clientLease.release();
		}
		return result;
	});
}
//#endregion
export { retireCodexAppServerSessionGeneration };
