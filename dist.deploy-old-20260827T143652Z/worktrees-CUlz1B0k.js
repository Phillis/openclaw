import { t as ADMIN_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { ao as validateWorktreesCreateParams, co as validateWorktreesRemoveParams, io as validateWorktreesBranchesParams, lo as validateWorktreesRestoreParams, oo as validateWorktreesGcParams, so as validateWorktreesListParams } from "./src-Bo4ezI_n.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { c as resolveWorktreeCleanupLimits, o as WorktreeSnapshotError, s as managedWorktrees } from "./service-C_Ue82wC.js";
import { t as createManagedWorktreeOwnerProtection } from "./owner-protection-CuXOPvtk.js";
import { t as resolveWorkspacePathContainment } from "./workspace-path-containment-BHfA0XkW.js";
import { c as resolveRecordedProjectRoot } from "./project-registry-CwiP87lK.js";
//#region src/gateway/server-methods/worktrees.ts
function invalidParams(respond) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid worktrees parameters"));
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
		"worktrees.create": async ({ params, respond }) => {
			if (!validateWorktreesCreateParams(params)) {
				invalidParams(respond);
				return;
			}
			respond(true, await service.create({
				repoRoot: params.repoRoot,
				name: params.name,
				baseRef: params.baseRef,
				ownerKind: "manual"
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
					force: params.force
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
		"worktrees.branches": async ({ params, respond, context, client }) => {
			if (!validateWorktreesBranchesParams(params)) {
				invalidParams(respond);
				return;
			}
			let repoRoot = params.repoRoot;
			if (!(Array.isArray(client?.connect.scopes) ? client.connect.scopes : []).includes("operator.admin")) {
				const containment = await resolveWorkspacePathContainment(params.repoRoot, context.getRuntimeConfig());
				if (!containment) {
					const projectRoot = await resolveRecordedProjectRoot(params.repoRoot);
					if (!projectRoot) {
						respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `worktrees.branches outside configured agent workspaces requires gateway scope: ${ADMIN_SCOPE}`));
						return;
					}
					repoRoot = projectRoot;
				} else repoRoot = containment.path;
			}
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
