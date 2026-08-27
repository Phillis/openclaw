import { m as withSkillProposalCommitLock, s as readSkillProposalRecord, u as updateSkillProposalRecord } from "./store-B2Qbdth0.js";
import { a as isWorkshopOwnedSkillDir } from "./workspace-skill-read-eFGJaOyq.js";
import { t as applySkillProposal } from "./service-D0J-IAQ1.js";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/skill-workshop-workspace-context.ts
const canonicalSkillWorkspace = new AsyncLocalStorage();
function runWithCanonicalSkillWorkspace(canonicalWorkspaceDir, run) {
	return canonicalWorkspaceDir ? canonicalSkillWorkspace.run(canonicalWorkspaceDir, run) : run();
}
function getCanonicalSkillWorkspace() {
	return canonicalSkillWorkspace.getStore();
}
//#endregion
//#region src/skills/workshop/autonomous-apply.ts
const USER_AUTHORED_PENDING_REASON = "user-authored skill; awaiting operator review";
async function applyAutonomousSkillProposal(params) {
	const store = params.env ? { env: params.env } : {};
	if (params.proposal.record.kind !== "create" && !isWorkshopOwnedSkillDir(params.workspaceDir, params.proposal.record.target.skillDir, store)) return {
		status: "pending",
		record: await withSkillProposalCommitLock(params.workspaceDir, params.proposal.record, async () => {
			const current = await readSkillProposalRecord(params.proposal.record.id, store);
			if (!current) throw new Error(`Skill proposal not found: ${params.proposal.record.id}`);
			if (current.status !== "pending") return current;
			const pending = {
				...current,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
				statusReason: USER_AUTHORED_PENDING_REASON
			};
			await updateSkillProposalRecord({
				record: pending,
				store
			});
			return pending;
		}, store)
	};
	return {
		status: "applied",
		...await applySkillProposal({
			workspaceDir: params.workspaceDir,
			...params.agentId ? { agentId: params.agentId } : {},
			...params.config ? { config: params.config } : {},
			...params.env ? { env: params.env } : {},
			...params.eventActor ? { eventActor: params.eventActor } : {},
			proposalId: params.proposal.record.id,
			expectedRevisionHash: params.proposal.revisionHash,
			reason: params.reason
		})
	};
}
//#endregion
export { getCanonicalSkillWorkspace as n, runWithCanonicalSkillWorkspace as r, applyAutonomousSkillProposal as t };
