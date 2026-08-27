import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { p as resolveAmbientOwnerAgentId, r as listAgentEntries, y as toAgentEntriesRecord } from "./agent-scope-config-CUBiGmG3.js";
import { s as readConfigFileSnapshot } from "./io-ClLVsBMp.js";
import { f as hasResolvedRosterBeforeMigrations } from "./provider-model-route-n5WsvCIn.js";
import { h as resolveConfigSnapshotHash } from "./io.read-helpers-BfhrMUhR.js";
import { n as createMergePatch, t as applyMergePatch } from "./merge-patch-BukSB2Pq.js";
import "./config-B_0xOnKq.js";
import { t as migrateLegacyMainSessionKeys } from "./legacy-main-session-migration-CedEaTdA.js";
import { n as createAgent, r as validateAgentIdInput } from "./agent-create-CdrJz5F6.js";
//#region src/commands/onboard-agent.ts
function validateFirstOnboardingAgentName(value) {
	const name = value?.trim();
	if (!name) return "Agent name is required.";
	const validation = validateAgentIdInput(name);
	return validation.ok ? void 0 : `${validation.message}. Choose another name.`;
}
function isInjectedMainRoster(config) {
	const roster = listAgentEntries(config);
	const entry = roster[0];
	return roster.length === 1 && entry?.id === "main" && entry?.default === true && Object.keys(entry).every((key) => key === "id" || key === "default");
}
function mergeOnboardingCandidate(params) {
	const proposalPatch = createMergePatch(params.base, params.candidate);
	const merged = applyMergePatch(params.currentRuntime, proposalPatch);
	const { list: _legacyList, ...agents } = merged.agents ?? {};
	return {
		...merged,
		agents: {
			...agents,
			entries: toAgentEntriesRecord(listAgentEntries(params.currentRuntime))
		}
	};
}
async function ensureOnboardingAgent(params) {
	if (params.firstAgent) {
		const validationError = validateFirstOnboardingAgentName(params.firstAgent.name);
		if (validationError) throw new Error(validationError);
	}
	const hasExpectedConfigHash = Object.hasOwn(params, "expectedConfigHash");
	let before = hasExpectedConfigHash ? await readConfigFileSnapshot() : void 0;
	if (before?.exists && !before.valid) throw new Error("Cannot create the first agent from an invalid OpenClaw config.");
	if (before && (resolveConfigSnapshotHash(before) ?? null) !== params.expectedConfigHash) throw new Error("OpenClaw config changed before first-agent creation. Retry setup.");
	if (listAgentEntries(params.config).length > 0 && (params.preserveCandidateRoster || !isInjectedMainRoster(params.config))) return {
		config: params.config,
		agentId: resolveAmbientOwnerAgentId(params.config),
		bootstrapPending: false,
		createdAgent: false
	};
	before ??= await readConfigFileSnapshot();
	if (before.exists && !before.valid) throw new Error("Cannot create the first agent from an invalid OpenClaw config.");
	const effective = before.config;
	const candidateBase = params.baseConfig ?? effective;
	if (before.exists && hasResolvedRosterBeforeMigrations(before)) return {
		config: mergeOnboardingCandidate({
			base: candidateBase,
			candidate: params.config,
			currentRuntime: effective
		}),
		agentId: resolveAmbientOwnerAgentId(effective),
		bootstrapPending: false,
		createdAgent: false
	};
	const firstAgentName = params.firstAgent ? params.firstAgent.name.trim() : "main";
	const created = await createAgent({
		entry: {
			id: normalizeAgentId(firstAgentName),
			name: firstAgentName,
			workspace: params.workspace
		},
		bootstrapMain: normalizeAgentId(firstAgentName) === "main",
		bootstrapFirstAgent: true,
		...hasExpectedConfigHash ? { expectedConfigHash: params.expectedConfigHash } : {},
		skipBootstrap: params.config.agents?.defaults?.skipBootstrap,
		skipOptionalBootstrapFiles: params.config.agents?.defaults?.skipOptionalBootstrapFiles
	});
	if (created.status === "error") throw new Error(created.message);
	const after = await readConfigFileSnapshot();
	if (!after.valid) throw new Error("Agent creation wrote an invalid OpenClaw config.");
	if (created.configHash && after.hash !== created.configHash) throw new Error("OpenClaw config changed after first-agent creation. Retry setup.");
	const config = mergeOnboardingCandidate({
		base: candidateBase,
		candidate: params.config,
		currentRuntime: after.config
	});
	const sessionMigration = await migrateLegacyMainSessionKeys({
		cfg: after.config,
		mode: "automatic"
	});
	const sessionMigrationWarnings = sessionMigration.armed && !sessionMigration.complete ? [`Legacy main-agent session history migration is incomplete${sessionMigration.warnings.length > 0 ? `: ${sessionMigration.warnings.join("; ")}` : ""}. Run \`openclaw doctor --fix\`; OpenClaw will also retry at next startup.`] : [];
	return {
		config,
		agentId: created.agentId,
		bootstrapPending: created.bootstrapPending,
		createdAgent: created.status === "created",
		...created.configHash ? { configHash: created.configHash } : {},
		...sessionMigrationWarnings.length > 0 ? { sessionMigrationWarnings } : {}
	};
}
//#endregion
export { validateFirstOnboardingAgentName as n, ensureOnboardingAgent as t };
