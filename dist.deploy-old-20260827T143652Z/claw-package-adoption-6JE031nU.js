import { r as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DmtKty-F.js";
import { h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-DlCMR4eQ.js";
import { existsSync } from "node:fs";
//#region src/state/claw-package-adoption.ts
/** Records an explicit non-Claw claim through the canonical package owner. */
function markClawPackageIndependentlyOwned(artifact, options = {}) {
	if (!existsSync(options.path ?? resolveOpenClawStateSqlitePath(options.env ?? process.env))) return 0;
	const nowMs = options.nowMs ?? Date.now();
	try {
		return runOpenClawStateWriteTransaction(({ db }) => {
			const workspaceScope = artifact.kind === "skill" ? `AND agent_id IN (
             SELECT agent_id FROM claw_installs WHERE workspace = @workspace
           )` : "";
			const versionScope = artifact.version ? "AND package_version = @package_version" : "";
			const statement = db.prepare(`UPDATE claw_package_refs
            SET independent_owner = 1, updated_at_ms = @updated_at_ms
          WHERE package_kind = @package_kind
            AND package_source = @package_source
            AND package_ref = @package_ref
            ${versionScope}
            AND independent_owner <> 1
            ${workspaceScope}`);
			const bindings = {
				package_kind: artifact.kind,
				package_source: artifact.source,
				package_ref: artifact.ref,
				updated_at_ms: nowMs
			};
			if (artifact.version) bindings.package_version = artifact.version;
			if (artifact.kind === "skill") bindings.workspace = artifact.workspace ?? "";
			const result = statement.run(bindings);
			return Number(result.changes);
		}, options);
	} catch {
		return 0;
	}
}
//#endregion
export { markClawPackageIndependentlyOwned as t };
