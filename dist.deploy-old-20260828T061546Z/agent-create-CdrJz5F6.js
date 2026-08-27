import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as FsSafeError } from "./errors-CQDiIdj7.js";
import { r as root } from "./fs-safe-CmrQUApq.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import "./utils-Bw16L5tB.js";
import "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId, r as normalizeAgentIdStrict } from "./agent-id-CeT3w4ap.js";
import { f as resolveAgentWorkspaceDir, l as resolveAgentDir, r as listAgentEntries, y as toAgentEntriesRecord } from "./agent-scope-config-CUBiGmG3.js";
import { l as resolveSessionTranscriptsDirForAgent } from "./paths-DVAvlIOc.js";
import { rt as ConfigMutationConflictError } from "./io-ClLVsBMp.js";
import { f as hasResolvedRosterBeforeMigrations } from "./provider-model-route-n5WsvCIn.js";
import { i as resolveSharedAuthStoreOwnership } from "./path-resolve-Bjd7UUgA.js";
import { a as transformConfigFileWithRetry, o as withConfigMutationExclusive } from "./mutate-BjBakg7Z.js";
import "./config-B_0xOnKq.js";
import { p as recordAgentProvenance, s as readAgentDeletionJournal } from "./agent-deletion-journal-C1nSMR13.js";
import { p as ensureAgentWorkspace, r as DEFAULT_IDENTITY_FILENAME } from "./workspace-DJ__UUS2.js";
import { r as isReservedSystemAgentId } from "./agent-id-DC26pYcR.js";
import { a as claimCompletedAgentDeletion } from "./agent-lifecycle-registry-DPEbAZj2.js";
import { a as mergeIdentityMarkdownContent, s as sanitizeAgentIdentityLine, t as createAgentIdentityConfig } from "./identity-file-B-yOqb54.js";
import { r as parseBindingSpecs, t as applyAgentBindings } from "./agents.bindings-ffZ0V3Mz.js";
import { r as findAgentEntryIndex, t as applyAgentConfig } from "./agents.config-BCOHbC0P.js";
import { t as migrateLegacyMainSessionKeys } from "./legacy-main-session-migration-CedEaTdA.js";
import fs from "node:fs/promises";
//#region src/agents/agent-create.ts
const BOOTSTRAP_AGENT_ID = "main";
var DuplicateAgentError = class extends Error {};
var InvalidAgentBindingsError = class extends Error {};
function createError(reason, message, agentId) {
	return {
		status: "error",
		reason,
		message,
		...agentId ? { agentId } : {}
	};
}
function validateAgentIdInput(rawId, options = {}) {
	const displayName = options.displayName ?? rawId;
	const normalized = normalizeAgentIdStrict(rawId);
	if (!normalized.ok) return {
		ok: false,
		reason: "invalid-name",
		message: `Agent name "${displayName}" has no valid id characters. Use at least one letter a-z or digit.`
	};
	const agentId = normalized.value;
	if (isReservedSystemAgentId(agentId)) return {
		ok: false,
		reason: "reserved-id",
		message: `"${agentId}" is reserved`,
		agentId
	};
	return {
		ok: true,
		agentId
	};
}
function isInjectedBootstrapMainEntry(entry) {
	return entry?.id === BOOTSTRAP_AGENT_ID && Object.keys(entry).every((key) => key === "id");
}
function describeLegacySessionOutcome(outcome) {
	const claims = (outcome.sourceKeys ?? []).map((key, index) => `${outcome.paths?.[index] ?? outcome.paths?.[0] ?? "session store"}#${key}`);
	switch (outcome.kind) {
		case "divergent-aliases":
		case "divergent-canonical": return `${outcome.kind} for ${outcome.canonicalKey ?? "the canonical session"}; preserved claims ${claims.join(", ") || "could not be reconciled"} must be quarantined`;
		case "legacy-json-store": return `legacy JSON session store ${outcome.paths?.join(", ") ?? "requires import"}`;
		case "store-unreadable": return `unreadable session store ${outcome.paths?.join(", ") ?? "unknown"}${outcome.detail ? ` (${outcome.detail})` : ""}`;
		case "migrated-in-place":
		case "migrated-cross-store":
		case "canonical-exists-identical": return `legacy claim ${claims.join(", ") || outcome.canonicalKey || "requires migration"}`;
		case "not-armed": return outcome.detail === "owner-unresolved" ? "legacy main sessions have no unambiguous configured owner; set agents.defaults.sessionStore.agentId to the intended live owner" : `legacy main session migration is not armed (${outcome.detail ?? "unknown reason"})`;
		case "no-legacy-rows": return "the current session-store layout has no matching completed migration ledger";
	}
	return outcome.kind;
}
async function evaluateMainCreationGate(config, agentId) {
	const roster = listAgentEntries(config).map((entry) => normalizeAgentId(entry.id));
	if (agentId !== BOOTSTRAP_AGENT_ID || roster.includes(BOOTSTRAP_AGENT_ID) || !roster.some((id) => id !== BOOTSTRAP_AGENT_ID)) return;
	const migration = await migrateLegacyMainSessionKeys({
		cfg: config,
		forceScan: true,
		legacyAgentId: BOOTSTRAP_AGENT_ID,
		mode: "detect"
	});
	const provenClean = migration.outcomes.every((outcome) => outcome.kind === "no-legacy-rows");
	if (migration.armed ? !migration.ledgerComplete : !provenClean) return createError("legacy-session-migration-required", `Cannot create agent "main": ${migration.outcomes.map(describeLegacySessionOutcome).join("; ")}. Run openclaw doctor --fix, then retry.`, agentId);
	if (resolveSharedAuthStoreOwnership().location !== "state-db") return createError("shared-auth-store-owned-by-main", "Cannot create agent \"main\" while agents/main/agent owns the shared auth store. Run openclaw doctor --fix to relocate shared auth, then retry.", agentId);
}
/** Read-only early check for guided flows that stage side effects before their final create. */
async function checkAgentCreationGate(agentId) {
	return await withConfigMutationExclusive(async (lockedConfig) => await evaluateMainCreationGate(lockedConfig, normalizeAgentId(agentId)));
}
async function writeIdentityFile(params) {
	const workspaceRoot = await root(params.workspaceDir);
	let existing;
	try {
		existing = (await workspaceRoot.read(DEFAULT_IDENTITY_FILENAME, {
			hardlinks: "reject",
			nonBlockingRead: true
		})).buffer.toString("utf-8");
	} catch (error) {
		if (!(error instanceof FsSafeError && error.code === "not-found")) throw error;
	}
	const content = mergeIdentityMarkdownContent(existing, params.identity);
	await workspaceRoot.write(DEFAULT_IDENTITY_FILENAME, content, { encoding: "utf8" });
}
async function createAgent(params) {
	if (params.stagedConfig && !Object.hasOwn(params, "expectedConfigHash")) throw new Error("staged agent creation requires an expected config hash");
	const rawName = (params.entry?.name?.trim() || params.entry?.id || params.name || "").trim();
	if (!rawName) return createError("invalid-name", "agent name is required");
	const validation = validateAgentIdInput(params.entry?.id ?? rawName, { displayName: rawName });
	if (!validation.ok) return createError(validation.reason, validation.message, validation.agentId);
	const agentId = validation.agentId;
	const isBootstrapMain = agentId === BOOTSTRAP_AGENT_ID && params.bootstrapMain === true;
	const safeName = sanitizeAgentIdentityLine(rawName);
	const model = normalizeOptionalString(params.model);
	const identity = params.entry?.identity ?? createAgentIdentityConfig({
		name: safeName,
		emoji: params.emoji,
		avatar: params.avatar
	}) ?? { name: safeName };
	const requestedWorkspace = params.entry?.workspace ?? params.workspace;
	const explicitWorkspace = requestedWorkspace?.trim() ? resolveUserPath(requestedWorkspace.trim()) : void 0;
	const requestedAgentDir = params.entry?.agentDir ?? params.agentDir;
	const explicitAgentDir = requestedAgentDir?.trim() ? resolveUserPath(requestedAgentDir.trim()) : void 0;
	const transformConfig = params.transformConfig ?? transformConfigFileWithRetry;
	let configCommitRollback;
	try {
		return await withConfigMutationExclusive(async (lockedConfig) => {
			const gateError = await evaluateMainCreationGate(lockedConfig, agentId);
			if (gateError) return gateError;
			const deletion = readAgentDeletionJournal(agentId);
			if (deletion && !deletion.cleanupCompleted) return createError("deletion-pending", `agent "${agentId}" deletion cleanup is still pending`, agentId);
			let tombstoneClaimed = false;
			if (deletion?.cleanupCompleted && findAgentEntryIndex(listAgentEntries(lockedConfig), agentId) >= 0) {
				if (!claimCompletedAgentDeletion(agentId, deletion.operationId)) throw new Error(`agent "${agentId}" deletion tombstone changed during creation`);
				tombstoneClaimed = true;
			}
			const committed = await transformConfig({
				afterWrite: { mode: "auto" },
				maxAttempts: 1,
				...params.bootstrapFirstAgent ? { writeOptions: { allowedAgentRosterRemovals: [BOOTSTRAP_AGENT_ID] } } : {},
				transform: async (currentConfig, context) => {
					if (Object.hasOwn(params, "expectedConfigHash") && context.previousHash !== params.expectedConfigHash) throw new ConfigMutationConflictError("config changed before first-agent creation", { retryable: false });
					const hasAuthoredRoster = params.bootstrapFirstAgent === true && hasResolvedRosterBeforeMigrations(context.snapshot);
					if (params.bootstrapFirstAgent && hasAuthoredRoster) throw new DuplicateAgentError();
					const bootstrappingFirstAgent = params.bootstrapFirstAgent === true;
					const currentEntries = bootstrappingFirstAgent ? [] : listAgentEntries(currentConfig);
					const existingIndex = findAgentEntryIndex(currentEntries, agentId);
					const existingEntry = currentEntries[existingIndex];
					if (isBootstrapMain && currentEntries.length > 0 && !currentEntries.some((entry) => normalizeAgentId(entry.id) === BOOTSTRAP_AGENT_ID)) throw new DuplicateAgentError();
					if (existingIndex >= 0 && !isBootstrapMain) throw new DuplicateAgentError();
					if (existingIndex >= 0 && isBootstrapMain && (currentEntries.length !== 1 || !isInjectedBootstrapMainEntry(existingEntry) || context.snapshot.exists)) return {
						nextConfig: currentConfig,
						result: {
							status: "existing",
							agentId,
							name: existingEntry?.name ?? safeName,
							workspace: resolveAgentWorkspaceDir(currentConfig, agentId),
							agentDir: resolveAgentDir(currentConfig, agentId),
							bootstrapPending: false
						}
					};
					const workspaceDir = explicitWorkspace ?? resolveAgentWorkspaceDir(currentConfig, agentId);
					const agentDir = explicitAgentDir ?? resolveAgentDir(currentConfig, agentId);
					const materializeInjectedMain = existingIndex >= 0 && isBootstrapMain && isInjectedBootstrapMainEntry(existingEntry) && !context.snapshot.exists;
					const creationBase = bootstrappingFirstAgent ? {
						...currentConfig,
						agents: {
							...currentConfig.agents,
							entries: {},
							list: void 0
						}
					} : params.stagedConfig ?? currentConfig;
					let nextConfig = existingIndex < 0 || materializeInjectedMain ? applyAgentConfig(creationBase, {
						agentId,
						name: safeName,
						workspace: workspaceDir,
						agentDir,
						model,
						identity
					}) : creationBase;
					if (params.entry) {
						const { default: _retiredDefault, ...stagedEntry } = params.entry;
						const list = listAgentEntries(nextConfig);
						const index = findAgentEntryIndex(list, agentId);
						list[index] = {
							...list[index],
							...stagedEntry,
							id: agentId,
							name: safeName,
							workspace: workspaceDir,
							agentDir,
							identity
						};
						const { list: _legacyList, ...agentsConfig } = nextConfig.agents ?? {};
						nextConfig = {
							...nextConfig,
							agents: {
								...agentsConfig,
								entries: toAgentEntriesRecord(list)
							}
						};
					}
					const bindingParse = parseBindingSpecs({
						agentId,
						specs: params.bindingSpecs,
						config: nextConfig
					});
					if (bindingParse.errors.length > 0) throw new InvalidAgentBindingsError(bindingParse.errors.join("\n"));
					const bindingResult = bindingParse.bindings.length ? applyAgentBindings(nextConfig, bindingParse.bindings) : void 0;
					nextConfig = bindingResult?.config ?? nextConfig;
					const skipBootstrap = params.skipBootstrap ?? nextConfig.agents?.defaults?.skipBootstrap;
					const workspace = await ensureAgentWorkspace({
						dir: workspaceDir,
						ensureBootstrapFiles: !skipBootstrap,
						skipOptionalBootstrapFiles: params.skipOptionalBootstrapFiles ?? nextConfig.agents?.defaults?.skipOptionalBootstrapFiles
					});
					if (workspace.dir !== workspaceDir) {
						const entries = listAgentEntries(nextConfig);
						const entryIndex = findAgentEntryIndex(entries, agentId);
						const currentEntry = entries[entryIndex];
						if (entryIndex >= 0 && currentEntry) {
							entries[entryIndex] = {
								...currentEntry,
								id: agentId,
								workspace: workspace.dir
							};
							const { list: _legacyList, ...agentsConfig } = nextConfig.agents ?? {};
							nextConfig = {
								...nextConfig,
								agents: {
									...agentsConfig,
									entries: toAgentEntriesRecord(entries)
								}
							};
						}
					}
					await fs.mkdir(resolveSessionTranscriptsDirForAgent(agentId), { recursive: true });
					if (!workspace.bootstrapPending && !skipBootstrap) await writeIdentityFile({
						workspaceDir: workspace.dir,
						identity
					});
					const preparedRollback = await params.prepareConfigCommit?.();
					configCommitRollback = typeof preparedRollback === "function" ? preparedRollback : void 0;
					return {
						nextConfig,
						result: {
							status: existingIndex >= 0 ? "existing" : "created",
							agentId,
							name: safeName,
							workspace: workspace.dir,
							agentDir,
							...model ? { model } : {},
							bootstrapPending: workspace.bootstrapPending === true,
							...bindingResult ? { bindingResult } : {}
						}
					};
				}
			});
			configCommitRollback = void 0;
			if (deletion?.cleanupCompleted && !tombstoneClaimed && committed.result?.status === "created" && !claimCompletedAgentDeletion(agentId, deletion.operationId)) throw new Error(`agent "${agentId}" deletion tombstone changed during creation`);
			const result = committed.result;
			if (result.status === "created") recordAgentProvenance(agentId, params.provenance ?? { createdVia: "operator" });
			return {
				...result,
				config: committed.nextConfig,
				...typeof committed.persistedHash === "string" ? { configHash: committed.persistedHash } : {}
			};
		});
	} catch (error) {
		if (configCommitRollback) try {
			await configCommitRollback();
		} catch (rollbackError) {
			throw new Error(`${String(error)}\nstaged config rollback failed: ${String(rollbackError)}`, { cause: rollbackError });
		}
		if (error instanceof DuplicateAgentError) return createError("already-exists", `agent "${agentId}" already exists`, agentId);
		if (error instanceof InvalidAgentBindingsError) return createError("invalid-bindings", error.message, agentId);
		if (error instanceof FsSafeError) return createError("unsafe-identity-file", `unsafe workspace file "${DEFAULT_IDENTITY_FILENAME}"`, agentId);
		throw error;
	}
}
//#endregion
export { createAgent as n, validateAgentIdInput as r, checkAgentCreationGate as t };
