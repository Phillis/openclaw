import { t as ADMIN_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { Ao as validateWorktreesGcParams, Mo as validateWorktreesRemoveParams, No as validateWorktreesRestoreParams, Oo as validateWorktreesBranchesParams, jo as validateWorktreesListParams, ko as validateWorktreesCreateParams } from "./src-4dv5TpeQ.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { n as resolveWorkspacePathContainment } from "./workspace-path-containment-CPewJH89.js";
import { l as managedWorktrees, s as WorktreeSnapshotError, u as resolveWorktreeCleanupLimits } from "./service-P2Ot4H_g.js";
import { u as resolveRecordedProjectRoot } from "./project-registry-CPtTZbcF.js";
import { t as createManagedWorktreeOwnerProtection } from "./owner-protection-CLwFv5gk.js";
//#region src/gateway/server-methods/worktrees.ts
function invalidParams(respond) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid worktrees parameters"));
}
async function resolveAuthorizedRepoRoot(method, repoRoot, opts) {
	if ((Array.isArray(opts.client?.connect.scopes) ? opts.client.connect.scopes : []).includes("operator.admin")) return repoRoot;
	const authorizedRoot = (await resolveWorkspacePathContainment(repoRoot, opts.context.getRuntimeConfig()))?.path ?? await resolveRecordedProjectRoot(repoRoot);
	if (authorizedRoot) return authorizedRoot;
	opts.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `${method} outside configured agent workspaces requires gateway scope: ${ADMIN_SCOPE}`));
}
function createWorktreesHandlers(service) {
	return {
		"worktrees.list": async ({ params, respond }) => {
			if (!validateWorktreesListParams(params)) {
				invalidParams(respond);
				return;
			}
			respond(true, { worktrees: await service.list() }, void 0);
		},
		"worktrees.create": async (opts) => {
			const { params, respond } = opts;
			if (!validateWorktreesCreateParams(params)) {
				invalidParams(respond);
				return;
			}
			const repoRoot = await resolveAuthorizedRepoRoot("worktrees.create", params.repoRoot, opts);
			if (!repoRoot) return;
			const scopes = Array.isArray(opts.client?.connect.scopes) ? opts.client.connect.scopes : [];
			respond(true, await service.create({
				repoRoot,
				name: params.name,
				baseRef: params.baseRef,
				ownerKind: "manual",
				runSetupScript: scopes.includes(ADMIN_SCOPE)
			}), void 0);
		},
		"worktrees.remove": async ({ params, respond }) => {
			if (!validateWorktreesRemoveParams(params)) {
				invalidParams(respond);
				return;
			}
			try {
				const result = await service.remove({
					id: params.id,
					reason: "manual-delete",
					allowSnapshotLoss: params.force
				});
				respond(true, {
					removed: result.removed,
					...result.snapshotRef ? { snapshotRef: result.snapshotRef } : {},
					...result.snapshotError ? { snapshotError: result.snapshotError } : {}
				}, void 0);
			} catch (error) {
				if (error instanceof WorktreeSnapshotError) {
					respond(true, {
						removed: false,
						snapshotError: error.snapshotError
					}, void 0);
					return;
				}
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error)));
			}
		},
		"worktrees.restore": async ({ params, respond }) => {
			if (!validateWorktreesRestoreParams(params)) {
				invalidParams(respond);
				return;
			}
			respond(true, await service.restore({ id: params.id }), void 0);
		},
		"worktrees.branches": async (opts) => {
			const { params, respond } = opts;
			if (!validateWorktreesBranchesParams(params)) {
				invalidParams(respond);
				return;
			}
			const repoRoot = await resolveAuthorizedRepoRoot("worktrees.branches", params.repoRoot, opts);
			if (!repoRoot) return;
			respond(true, params.includeRepositoryStatus ? await service.listRepositoryBranches(repoRoot, { includeRepositoryStatus: true }) : await service.listRepositoryBranches(repoRoot), void 0);
		},
		"worktrees.gc": async ({ params, respond, context }) => {
			if (!validateWorktreesGcParams(params)) {
				invalidParams(respond);
				return;
			}
			const cfg = context.getRuntimeConfig();
			const limits = resolveWorktreeCleanupLimits();
			respond(true, await service.gc({
				limits,
				shouldProtectOwner: createManagedWorktreeOwnerProtection(cfg)
			}), void 0);
		}
	};
}
const worktreesHandlers = createWorktreesHandlers(managedWorktrees);
//#endregion
export { worktreesHandlers };
