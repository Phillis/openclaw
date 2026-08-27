import { Lt as resolveSessionEntryAccessTarget } from "./session-accessor-Bi6bzKQE.js";
import "./service-C_Ue82wC.js";
//#region src/agents/worktrees/owner-protection.ts
function createManagedWorktreeOwnerProtection(cfg, now = Date.now) {
	return (ownerKind, ownerId) => {
		if (ownerKind !== "session") return false;
		try {
			const entry = resolveSessionEntryAccessTarget({
				cfg,
				sessionKey: ownerId
			}).entry;
			const activityAt = Math.max(entry?.lastInteractionAt ?? 0, entry?.updatedAt ?? 0);
			return activityAt > 0 && now() - activityAt <= 6048e5;
		} catch {
			return true;
		}
	};
}
//#endregion
export { createManagedWorktreeOwnerProtection as t };
