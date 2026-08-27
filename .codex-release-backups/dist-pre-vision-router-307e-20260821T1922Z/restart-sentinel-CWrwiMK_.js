import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { t as resolveOpenClawPackageRoot } from "./openclaw-root-DSkQ6e_8.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { l as resolveRuntimeServiceVersion } from "./version-o4XN9fka.js";
import { t as resolveCommitHash } from "./git-commit-Dfaqxo9-.js";
import { d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-DlCMR4eQ.js";
import { a as writeRestartSentinelRowIfRevisionSync, i as readUpdateInstallReceiptRowSync, o as writeRestartSentinelRowSync, r as readRestartSentinelRowSync, s as writeUpdateInstallReceiptRowSync, t as deleteRestartSentinelRowSync } from "./restart-sentinel-store-BRdpiy-K.js";
import fs from "node:fs";
import path from "node:path";
//#region src/infra/update-install-root.ts
/** Resolve the canonical identity of an update checkout/install root. */
function resolveUpdateInstallRoot(root) {
	try {
		return fs.realpathSync.native(root);
	} catch {
		return path.resolve(root);
	}
}
function updateInstallRootsMatch(left, right) {
	return resolveUpdateInstallRoot(left) === resolveUpdateInstallRoot(right);
}
//#endregion
//#region src/infra/restart-sentinel.ts
const sentinelLog = createSubsystemLogger("restart-sentinel");
function formatDoctorNonInteractiveHint(env = process.env) {
	return `Recommended follow-up: run ${formatCliCommand("openclaw doctor --non-interactive", env)} in a terminal or approvals-capable OpenClaw surface.`;
}
async function writeRestartSentinel(payload, env = process.env) {
	return runOpenClawStateWriteTransaction(({ db }) => writeRestartSentinelRowSync(db, payload), { env }, { operationLabel: "restart-sentinel.write" });
}
function cloneRestartSentinelPayload(payload) {
	return structuredClone(payload);
}
async function rewriteRestartSentinel(rewrite, env = process.env) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const current = readRestartSentinelRowSync(db);
		if (current.kind !== "valid") return null;
		const nextPayload = rewrite(cloneRestartSentinelPayload(current.sentinel.payload));
		return nextPayload ? writeRestartSentinelRowIfRevisionSync(db, nextPayload, current.sentinel.revision) : null;
	}, { env }, { operationLabel: "restart-sentinel.rewrite-current" });
}
function commitsMatch(expected, actual) {
	const normalizedExpected = expected.trim().toLowerCase();
	const normalizedActual = actual.trim().toLowerCase();
	return normalizedExpected.length >= 7 && normalizedActual.length >= 7 && (normalizedExpected.startsWith(normalizedActual) || normalizedActual.startsWith(normalizedExpected));
}
async function finalizeUpdateRestartSentinelRunningVersion(version = resolveRuntimeServiceVersion(process.env), env = process.env, commit = resolveCommitHash({
	env,
	moduleUrl: import.meta.url
}), runningRoot) {
	const snapshot = await readRestartSentinel(env);
	if (!snapshot || snapshot.payload.kind !== "update") return null;
	const snapshotRoot = snapshot.payload.stats?.root;
	const expectedRoot = typeof snapshotRoot === "string" ? resolveUpdateInstallRoot(snapshotRoot) : null;
	const discoveredRoot = expectedRoot ? runningRoot ?? await resolveOpenClawPackageRoot({
		moduleUrl: import.meta.url,
		argv1: process.argv[1]
	}) : null;
	const actualRoot = discoveredRoot ? resolveUpdateInstallRoot(discoveredRoot) : null;
	return runOpenClawStateWriteTransaction(({ db }) => {
		const current = readRestartSentinelRowSync(db);
		if (current.kind !== "valid" || current.sentinel.revision !== snapshot.revision || current.sentinel.payload.kind !== "update") return null;
		const payload = cloneRestartSentinelPayload(current.sentinel.payload);
		const stats = payload.stats ? { ...payload.stats } : {};
		const after = isRecord(stats.after) ? { ...stats.after } : {};
		let changed = false;
		if (after.version !== version) {
			after.version = version;
			changed = true;
		}
		if (expectedRoot && stats.root !== expectedRoot) {
			stats.root = expectedRoot;
			changed = true;
		}
		const before = isRecord(stats.before) ? stats.before : {};
		const beforeSha = typeof before.sha === "string" ? before.sha.trim() : "";
		const expectedSha = typeof after.sha === "string" ? after.sha.trim() : "";
		const actualSha = commit?.trim() ?? "";
		const verifiesGitRevision = stats.mode !== "git" || expectedSha.length > 0 && commitsMatch(expectedSha, actualSha);
		const verifiesInstallRoot = expectedRoot !== null && actualRoot !== null && expectedRoot === actualRoot;
		const changedInstall = stats.mode !== "git" || beforeSha.length > 0 && expectedSha.length > 0 && !commitsMatch(beforeSha, expectedSha);
		if (payload.status === "ok" && expectedRoot && !verifiesInstallRoot) {
			payload.status = "error";
			stats.reason = actualRoot ? "restart-root-mismatch" : "restart-root-unavailable";
			delete payload.continuation;
			changed = true;
		} else if (payload.status === "ok" && stats.mode === "git" && expectedSha && !verifiesGitRevision) {
			payload.status = "error";
			stats.reason = actualSha ? "restart-revision-mismatch" : "restart-revision-unavailable";
			delete payload.continuation;
			changed = true;
		}
		stats.after = after;
		payload.stats = stats;
		const finalized = changed ? writeRestartSentinelRowIfRevisionSync(db, payload, current.sentinel.revision) : current.sentinel;
		if (!finalized) return null;
		if (stats.mode === "git" && verifiesInstallRoot && verifiesGitRevision && changedInstall) writeUpdateInstallReceiptRowSync(db, payload);
		return changed ? finalized : null;
	}, { env }, { operationLabel: "restart-sentinel.finalize-running-install" });
}
async function markUpdateRestartSentinelFailure(reason, env = process.env) {
	return await rewriteRestartSentinel((payload) => {
		if (payload.kind !== "update") return null;
		const payloadWithoutContinuation = { ...payload };
		delete payloadWithoutContinuation.continuation;
		const stats = payload.stats ? { ...payload.stats } : {};
		stats.reason = reason;
		return {
			...payloadWithoutContinuation,
			status: "error",
			stats
		};
	}, env);
}
async function clearRestartSentinel(env = process.env) {
	return runOpenClawStateWriteTransaction(({ db }) => deleteRestartSentinelRowSync(db), { env }, { operationLabel: "restart-sentinel.clear" });
}
async function clearRestartSentinelIfRevision(expectedRevision, env = process.env) {
	return runOpenClawStateWriteTransaction(({ db }) => deleteRestartSentinelRowSync(db, expectedRevision), { env }, { operationLabel: "restart-sentinel.clear-if-revision" });
}
function buildRestartSuccessContinuation(params) {
	const message = params.continuationMessage?.trim();
	if (message) return {
		kind: "agentTurn",
		message
	};
	return null;
}
async function readRestartSentinel(env = process.env) {
	try {
		const current = readRestartSentinelRowSync(openOpenClawStateDatabase({ env }).db);
		if (current.kind === "invalid") {
			sentinelLog.warn("Ignoring invalid typed restart sentinel row");
			return null;
		}
		return current.kind === "valid" ? current.sentinel : null;
	} catch (err) {
		sentinelLog.warn(`Failed to read restart sentinel: ${formatErrorMessage(err)}`);
		return null;
	}
}
async function readUpdateInstallReceiptPayload(env = process.env) {
	try {
		return readUpdateInstallReceiptRowSync(openOpenClawStateDatabase({ env }).db)?.payload ?? null;
	} catch (err) {
		sentinelLog.warn(`Failed to read update install receipt: ${formatErrorMessage(err)}`);
		return null;
	}
}
function normalizeVerifiedGitUpdateReceipt(payload) {
	if (payload?.kind !== "update" || payload.stats?.mode !== "git" || !isRecord(payload.stats.after)) return null;
	const root = typeof payload.stats.root === "string" ? payload.stats.root.trim() : "";
	const sha = typeof payload.stats.after.sha === "string" ? payload.stats.after.sha.trim() : "";
	if (!root || !sha) return null;
	const upstreamRef = typeof payload.stats.after.upstreamRef === "string" ? payload.stats.after.upstreamRef.trim() : "";
	return {
		root,
		sha,
		...upstreamRef ? { upstreamRef } : {},
		installedAtMs: payload.ts
	};
}
async function readVerifiedGitUpdateReceipt(env = process.env) {
	return normalizeVerifiedGitUpdateReceipt(await readUpdateInstallReceiptPayload(env));
}
async function hasRestartSentinel(env = process.env) {
	try {
		const current = readRestartSentinelRowSync(openOpenClawStateDatabase({ env }).db);
		if (current.kind === "invalid") {
			sentinelLog.warn("Ignoring invalid typed restart sentinel row");
			return false;
		}
		return current.kind === "valid";
	} catch (err) {
		sentinelLog.warn(`Failed to check restart sentinel: ${formatErrorMessage(err)}`);
		return false;
	}
}
function formatRestartSentinelMessage(payload) {
	const message = payload.message?.trim();
	if (message && (!payload.stats || payload.kind === "config-auto-recovery")) return message;
	const lines = [summarizeRestartSentinel(payload)];
	if (message) lines.push(message);
	const reason = payload.stats?.reason?.trim();
	if (reason && reason !== message) lines.push(`Reason: ${reason}`);
	if (payload.doctorHint?.trim()) lines.push(payload.doctorHint.trim());
	return lines.join("\n");
}
function isRestartRequiredConfigWriteSentinel(payload) {
	return (payload.kind === "config-apply" || payload.kind === "config-patch") && payload.status === "ok" && payload.stats?.requiresRestart === true;
}
function summarizeRestartSentinel(payload) {
	if (payload.kind === "config-auto-recovery") return "Gateway auto-recovery";
	if (isRestartRequiredConfigWriteSentinel(payload)) return `Gateway restart required${payload.stats?.mode ? ` (${payload.stats.mode})` : ""}`.trim();
	const kind = payload.kind;
	const status = payload.status;
	const mode = payload.stats?.mode ? ` (${payload.stats.mode})` : "";
	return `Gateway restart${kind === "restart" ? "" : ` ${kind}`} ${status}${mode}`.trim();
}
function trimLogTail(input, maxChars = 8e3) {
	if (!input) return null;
	const text = input.trimEnd();
	if (text.length <= maxChars) return text;
	return `…${sliceUtf16Safe(text, text.length - maxChars)}`;
}
//#endregion
export { formatDoctorNonInteractiveHint as a, markUpdateRestartSentinelFailure as c, summarizeRestartSentinel as d, trimLogTail as f, updateInstallRootsMatch as h, finalizeUpdateRestartSentinelRunningVersion as i, readRestartSentinel as l, resolveUpdateInstallRoot as m, clearRestartSentinel as n, formatRestartSentinelMessage as o, writeRestartSentinel as p, clearRestartSentinelIfRevision as r, hasRestartSentinel as s, buildRestartSuccessContinuation as t, readVerifiedGitUpdateReceipt as u };
