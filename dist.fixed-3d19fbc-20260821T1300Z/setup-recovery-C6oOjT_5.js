import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./utils-D9gvQMP6.js";
import { l as readConfigFileSnapshot } from "./io-BTBpQ7uO.js";
import { o as withConfigMutationExclusive } from "./mutate-B2SI65Vd.js";
import "./config-CfeGo4K4.js";
import { i as resolveSystemAgentOnboardingTarget } from "./onboard-agent-target-1tYZV0mF.js";
import { i as readLocalOnboardingStateForConfig, n as completeLocalOnboarding } from "./local-onboarding-state-UlB2L4DT.js";
//#region src/system-agent/setup-recovery.ts
/** Keep canonical config mutations excluded until the SQLite ownership CAS commits. */
async function completeLocalSetupRecovery(params) {
	return await withConfigMutationExclusive(async (lockedSourceConfig) => {
		const snapshot = await readConfigFileSnapshot();
		const sourceConfig = snapshot.sourceConfig ?? snapshot.config;
		if (!snapshot.exists || !snapshot.valid || !snapshot.path || resolveUserPath(snapshot.path) !== params.owner.configPath || params.appliedConfigPath && resolveUserPath(params.appliedConfigPath) !== params.owner.configPath || lockedSourceConfig.wizard?.securityAcknowledgedAt !== params.owner.securityAcknowledgedAt || sourceConfig.wizard?.securityAcknowledgedAt !== params.owner.securityAcknowledgedAt || resolveUserPath(resolveSystemAgentOnboardingTarget(snapshot.runtimeConfig ?? snapshot.config).workspaceDir) !== params.owner.workspace) throw new Error("The onboarding configuration changed before setup could complete.");
		if (readLocalOnboardingStateForConfig(snapshot.path, sourceConfig)?.runId !== params.owner.runId || !completeLocalOnboarding({
			configPath: snapshot.path,
			runId: params.owner.runId
		})) throw new Error("Another onboarding run replaced this setup operation. Retry onboarding.");
		return snapshot;
	});
}
/** Adopt only a valid, local, same-workspace onboarding receipt. */
async function loadLocalSetupRecovery(requestedWorkspace) {
	const snapshot = await readConfigFileSnapshot();
	const recorded = snapshot.exists && snapshot.valid && (snapshot.sourceConfig ?? snapshot.config)?.gateway?.mode !== "remote" ? readLocalOnboardingStateForConfig(snapshot.path, snapshot.sourceConfig ?? snapshot.config) : void 0;
	const pending = recorded?.status === "pending" ? recorded : void 0;
	const workspace = resolveUserPath(requestedWorkspace ?? pending?.workspace ?? process.cwd());
	if (pending && workspace !== resolveUserPath(pending.workspace)) throw new Error("Another onboarding run owns a different workspace. Retry onboarding with its approved workspace.");
	const assertOwner = (sourceConfig) => {
		if (pending && readLocalOnboardingStateForConfig(snapshot.path, sourceConfig)?.runId !== pending.runId) throw new Error("Another onboarding run replaced this setup operation. Retry onboarding.");
	};
	return {
		workspace,
		...pending ? { applyOptions: {
			resume: true,
			assertCommitPreconditions: assertOwner
		} } : {},
		async complete(appliedConfigPath, authorize) {
			if (!pending) return;
			return await authorize(() => completeLocalSetupRecovery({
				owner: pending,
				appliedConfigPath
			}));
		}
	};
}
//#endregion
export { completeLocalSetupRecovery, loadLocalSetupRecovery };
