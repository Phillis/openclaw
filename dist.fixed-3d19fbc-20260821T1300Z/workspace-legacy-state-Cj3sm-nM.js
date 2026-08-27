import { r as root } from "./fs-safe-X_oyl7Rx.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./utils-D9gvQMP6.js";
import { b as resolveLegacyStateDirs, w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { d as resolveWorkspaceStateIdentity } from "./workspace-state-store-CdlAG1ee.js";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
//#region src/agents/workspace-legacy-state.ts
const LEGACY_WORKSPACE_STATE_DIRNAME = ".openclaw";
const LEGACY_WORKSPACE_STATE_FILENAME = "workspace-state.json";
const LEGACY_WORKSPACE_STATE_CURRENT_FILENAME = "openclaw-workspace-state.json";
const LEGACY_WORKSPACE_ATTESTATION_DIRNAME = "workspace-attestations";
const LEGACY_WORKSPACE_ATTESTATION_SUFFIX = ".attested";
const LEGACY_WORKSPACE_ATTESTATION_HEADER = "openclaw-workspace-attestation:v1";
const LEGACY_WORKSPACE_ATTESTATION_MAX_BYTES = 2048;
const WORKSPACE_DOCTOR_CLAIM_SUFFIX = ".doctor-importing";
const checkedWorkspaceSourceSets = /* @__PURE__ */ new Set();
function uniqueSiblingPaths(paths) {
	const seen = /* @__PURE__ */ new Set();
	return paths.filter((candidate) => {
		let key = path.resolve(candidate);
		try {
			key = path.join(fs.realpathSync.native(path.dirname(candidate)), path.basename(candidate));
		} catch {}
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}
function resolveLegacyWorkspaceSourcePaths(workspaceDir, options) {
	const workspacePath = path.resolve(resolveUserPath(workspaceDir));
	const canonicalIdentity = resolveWorkspaceStateIdentity(workspaceDir);
	const workspaceKeys = [createHash("sha256").update(workspacePath).digest("hex"), canonicalIdentity.workspaceKey];
	const workspacePaths = [workspacePath, canonicalIdentity.workspacePath];
	const stateDirs = [resolveStateDir(options?.env ?? process.env, options?.homedir), ...resolveLegacyStateDirs(options?.homedir)];
	return {
		workspacePath,
		setupStatePaths: [path.join(canonicalIdentity.workspacePath, LEGACY_WORKSPACE_STATE_CURRENT_FILENAME), path.join(canonicalIdentity.workspacePath, LEGACY_WORKSPACE_STATE_DIRNAME, LEGACY_WORKSPACE_STATE_FILENAME)],
		stateDirAttestationPaths: [...new Set(stateDirs)].flatMap((stateDir) => [...new Set(workspaceKeys)].map((workspaceKey) => path.join(stateDir, LEGACY_WORKSPACE_ATTESTATION_DIRNAME, `${workspaceKey}${LEGACY_WORKSPACE_ATTESTATION_SUFFIX}`))),
		siblingAttestationPaths: uniqueSiblingPaths([...new Set(workspacePaths)].map((candidate) => `${candidate}${LEGACY_WORKSPACE_ATTESTATION_SUFFIX}`))
	};
}
function pathOrClaimExists(filePath) {
	for (const candidate of [filePath, `${filePath}${WORKSPACE_DOCTOR_CLAIM_SUFFIX}`]) try {
		fs.lstatSync(candidate);
		return true;
	} catch (error) {
		if (error.code !== "ENOENT") return true;
	}
	return false;
}
function siblingPathIsOwnedMarker(filePath) {
	let stat;
	try {
		stat = fs.lstatSync(filePath);
	} catch {
		return false;
	}
	if (!stat.isFile()) return false;
	try {
		const noFollow = typeof fs.constants.O_NOFOLLOW === "number" ? fs.constants.O_NOFOLLOW : 0;
		const fd = fs.openSync(filePath, fs.constants.O_RDONLY | noFollow);
		try {
			const buffer = Buffer.alloc(Math.min(stat.size, 34));
			const bytesRead = fs.readSync(fd, buffer, 0, buffer.length, 0);
			return buffer.subarray(0, bytesRead).toString("utf8") === `${LEGACY_WORKSPACE_ATTESTATION_HEADER}\n`;
		} finally {
			fs.closeSync(fd);
		}
	} catch {
		return true;
	}
}
/** Fail closed on unmigrated owned state without reading it as runtime data. */
function assertNoUnmigratedWorkspaceState(params) {
	const identity = resolveWorkspaceStateIdentity(params.workspaceDir);
	const sources = resolveLegacyWorkspaceSourcePaths(params.workspaceDir);
	const sourceSetKey = JSON.stringify([
		identity.workspaceKey,
		...sources.setupStatePaths,
		...sources.stateDirAttestationPaths,
		...sources.siblingAttestationPaths
	]);
	if (checkedWorkspaceSourceSets.has(sourceSetKey)) return;
	if (sources.setupStatePaths.some(pathOrClaimExists) || sources.stateDirAttestationPaths.some(pathOrClaimExists) || sources.siblingAttestationPaths.some((sourcePath) => siblingPathIsOwnedMarker(`${sourcePath}.doctor-importing`) || siblingPathIsOwnedMarker(sourcePath))) throw new Error(`Legacy workspace setup state requires migration for ${identity.workspacePath}; run openclaw doctor --fix.`);
	checkedWorkspaceSourceSets.add(sourceSetKey);
}
function resetLegacyWorkspaceStateCheckForTest() {
	checkedWorkspaceSourceSets.clear();
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.workspaceLegacyStateTestApi")] = { resetLegacyWorkspaceStateCheckForTest };
function isOwnedAttestationBuffer(buffer) {
	return buffer.subarray(0, 34).toString("utf8") === `${LEGACY_WORKSPACE_ATTESTATION_HEADER}\n`;
}
/** Capture canonical legacy paths before a destructive workspace removal. */
function prepareLegacyWorkspaceStateReset(workspaceDir, options) {
	const sources = resolveLegacyWorkspaceSourcePaths(workspaceDir, options);
	return { candidates: [
		...sources.setupStatePaths.map((sourcePath) => ({
			rootDir: sourcePath.endsWith("openclaw-workspace-state.json") ? path.dirname(sourcePath) : path.dirname(path.dirname(sourcePath)),
			sourcePath,
			requireAttestationHeader: false
		})),
		...sources.stateDirAttestationPaths.map((sourcePath) => ({
			rootDir: path.dirname(path.dirname(sourcePath)),
			sourcePath,
			requireAttestationHeader: false
		})),
		...sources.siblingAttestationPaths.map((sourcePath) => ({
			rootDir: path.dirname(sourcePath),
			sourcePath,
			requireAttestationHeader: true
		}))
	].flatMap((candidate) => [candidate, {
		...candidate,
		sourcePath: `${candidate.sourcePath}${WORKSPACE_DOCTOR_CLAIM_SUFFIX}`,
		requireAttestationHeader: candidate.requireAttestationHeader
	}]) };
}
/** Discard retired workspace files from a pre-removal reset plan. */
async function removeLegacyWorkspaceStateForReset(plan, options) {
	const removedPaths = [];
	const warnings = [];
	for (const candidate of plan.candidates) {
		const rootDir = path.resolve(candidate.rootDir);
		const sourcePath = path.resolve(candidate.sourcePath);
		const relativePath = path.relative(rootDir, sourcePath);
		try {
			fs.lstatSync(rootDir);
		} catch (error) {
			if (error.code === "ENOENT") continue;
			warnings.push(`Could not inspect retired workspace state at ${sourcePath}: ${String(error)}`);
			continue;
		}
		try {
			const sourceRoot = await root(rootDir, {
				hardlinks: "reject",
				maxBytes: LEGACY_WORKSPACE_ATTESTATION_MAX_BYTES,
				symlinks: "reject"
			});
			if (!await sourceRoot.exists(relativePath)) continue;
			if (candidate.requireAttestationHeader) {
				if (!isOwnedAttestationBuffer((await sourceRoot.read(relativePath)).buffer)) continue;
			}
			if (!options?.dryRun) await sourceRoot.remove(relativePath);
			removedPaths.push(sourcePath);
		} catch (error) {
			warnings.push(`Could not remove retired workspace state at ${sourcePath}: ${String(error)}`);
		}
	}
	return {
		removedPaths,
		warnings
	};
}
//#endregion
export { LEGACY_WORKSPACE_STATE_DIRNAME as a, prepareLegacyWorkspaceStateReset as c, LEGACY_WORKSPACE_STATE_CURRENT_FILENAME as i, removeLegacyWorkspaceStateForReset as l, LEGACY_WORKSPACE_ATTESTATION_HEADER as n, WORKSPACE_DOCTOR_CLAIM_SUFFIX as o, LEGACY_WORKSPACE_ATTESTATION_MAX_BYTES as r, assertNoUnmigratedWorkspaceState as s, LEGACY_WORKSPACE_ATTESTATION_DIRNAME as t, resolveLegacyWorkspaceSourcePaths as u };
