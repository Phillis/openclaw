import { t as coerceErrorMessage } from "./error-coercion-CKFmnpjH.js";
import "./src-BntaCZM-.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { t as stableStringify } from "./stable-stringify-DoZ6Yalc.js";
import { t as FsSafeError } from "./errors-CQDiIdj7.js";
import { r as root } from "./fs-safe-CmrQUApq.js";
import { c as assertNoSymlinkParents } from "./regular-file-Dwz6p59y.js";
import { At as boolean, Et as array, Nn as record, Rn as string, Tn as object, Xn as union, dn as literal, wn as number, yt as _enum } from "./schemas-CZ9Toj_c.js";
import { t as parseDurationMs } from "./parse-duration-CuuCHKpt.js";
import { d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-CeAO_dqo.js";
import { a as expandToolGroups, c as normalizeToolPolicyName, u as resolveToolProfilePolicy } from "./tool-policy-shared-DmpG3HvD.js";
import { r as isToolAllowedByPolicyName } from "./tool-policy-match-DfCekeWz.js";
import { t as canonicalizeConfiguredMcpServer } from "./mcp-config-normalize-dw5fHLEW.js";
import { r as isDangerousHostEnvVarName } from "./host-env-security-B_a4cpNH.js";
import { d as AVATAR_MAX_DATA_URL_CHARS, f as isRenderableAvatarImageDataUrl, o as isSupportedLocalAvatarExtension } from "./agent-workspace-roster-transition-DoqG2wNw.js";
import { t as MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES } from "./workspace-bootstrap-read-BswQlo2M.js";
import { t as computeNextRunAtMs } from "./schedule-CzFJAP7U.js";
import { t as listConfiguredMcpServers } from "./mcp-config-BmE1Up1i.js";
import { a as withClawMcpLifecycleLease, t as setConfiguredMcpServer } from "./mcp-config-mutation-Drmw10uS.js";
import { basename, dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { realpath, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { isScalar, parseDocument, visit } from "yaml";
//#region src/claws/mcp.ts
const CLAW_MCP_REF_SCHEMA_VERSION = "openclaw.clawMcpServerRef.v1";
var ClawMcpInstallError = class extends Error {
	constructor(code, message, mcpServers) {
		super(message);
		this.code = code;
		this.mcpServers = mcpServers;
		this.name = "ClawMcpInstallError";
	}
};
function mcpServerFromActionDetails(details) {
	const { expectedState: _expectedState, prerequisites: _prerequisites, ...server } = details;
	return "command" in server || "url" in server ? server : void 0;
}
function rowToRef(row) {
	return {
		schemaVersion: CLAW_MCP_REF_SCHEMA_VERSION,
		agentId: row.agent_id,
		name: row.name,
		configDigest: row.config_digest,
		relationship: row.relationship,
		origin: row.origin,
		independentOwner: Number(row.independent_owner) === 1,
		status: row.status,
		...row.error ? { error: row.error } : {},
		createdAtMs: Number(row.created_at_ms),
		updatedAtMs: Number(row.updated_at_ms)
	};
}
function digestClawMcpServer(server) {
	const canonical = canonicalizeConfiguredMcpServer(server);
	return `sha256:${createHash("sha256").update(stableStringify(canonical)).digest("hex")}`;
}
function persistPendingRef(plan, name, server, ownership, options) {
	const nowMs = options.nowMs ?? Date.now();
	const configDigest = digestClawMcpServer(server);
	const existing = openOpenClawStateDatabase(options).db.prepare(`SELECT schema_version, agent_id, name, config_digest, relationship, origin,
              independent_owner, status, error,
              created_at_ms, updated_at_ms
         FROM claw_mcp_server_refs
        WHERE agent_id = ? AND name = ?`).get(plan.agent.finalId, name);
	if (existing) {
		const ref = rowToRef(existing);
		if (ref.configDigest !== configDigest || ref.status === "failed") throw new ClawMcpInstallError("mcp_provenance_conflict", `MCP server ${JSON.stringify(name)} differs from its ownership record.`, [ref]);
		return {
			ref,
			existing: true
		};
	}
	const ref = {
		schemaVersion: CLAW_MCP_REF_SCHEMA_VERSION,
		agentId: plan.agent.finalId,
		name,
		configDigest,
		...ownership,
		status: "pending",
		createdAtMs: nowMs,
		updatedAtMs: nowMs
	};
	runOpenClawStateWriteTransaction(({ db }) => {
		db.prepare(`INSERT INTO claw_mcp_server_refs (
         agent_id, name, schema_version, config_digest, relationship, origin,
         independent_owner, status, error,
         created_at_ms, updated_at_ms
       ) VALUES (
         @agent_id, @name, @schema_version, @config_digest, @relationship, @origin,
         @independent_owner, @status, NULL,
         @created_at_ms, @updated_at_ms
       )`).run({
			agent_id: ref.agentId,
			name: ref.name,
			schema_version: ref.schemaVersion,
			config_digest: ref.configDigest,
			relationship: ref.relationship,
			origin: ref.origin,
			independent_owner: ref.independentOwner ? 1 : 0,
			status: ref.status,
			created_at_ms: nowMs,
			updated_at_ms: nowMs
		});
	}, options);
	return {
		ref,
		existing: false
	};
}
function updateRef(ref, update, options) {
	const updated = {
		...ref,
		...update,
		updatedAtMs: options.nowMs ?? Date.now()
	};
	runOpenClawStateWriteTransaction(({ db }) => {
		db.prepare(`UPDATE claw_mcp_server_refs
          SET status = @status, error = @error, updated_at_ms = @updated_at_ms
        WHERE agent_id = @agent_id AND name = @name`).run({
			agent_id: ref.agentId,
			name: ref.name,
			status: update.status,
			error: update.error ?? null,
			updated_at_ms: updated.updatedAtMs
		});
	}, options);
	return updated;
}
async function installClawMcpServers(plan, options = {}) {
	const setMcpServer = options.setMcpServer ?? setConfiguredMcpServer;
	const listMcpServers = options.listMcpServers ?? listConfiguredMcpServers;
	const refs = [];
	for (const action of plan.actions.filter((candidate) => candidate.kind === "mcpServer")) await withClawMcpLifecycleLease(action.id, options, async () => {
		const server = action.details ? mcpServerFromActionDetails(action.details) : void 0;
		if (!server) throw new ClawMcpInstallError("mcp_plan_invalid", `MCP server action ${JSON.stringify(action.id)} is invalid.`, refs);
		const listed = await listMcpServers();
		if (!listed.ok) throw new ClawMcpInstallError("mcp_preflight_failed", listed.error, refs);
		const configured = listed.mcpServers[action.id];
		const configDigest = digestClawMcpServer(server);
		if (configured && digestClawMcpServer(configured) !== configDigest) throw new ClawMcpInstallError("mcp_config_conflict", `MCP server ${JSON.stringify(action.id)} already exists with different configuration.`, refs);
		const existingRefs = readClawMcpServerRefsByName(action.id, options);
		const inheritsClawOrigin = existingRefs.length > 0 && existingRefs.every((candidate) => candidate.origin === "claw-introduced" && !candidate.independentOwner);
		const ownership = configured ? {
			relationship: "referenced",
			origin: inheritsClawOrigin ? "claw-introduced" : "pre-existing",
			independentOwner: !inheritsClawOrigin
		} : {
			relationship: "managed",
			origin: "claw-introduced",
			independentOwner: false
		};
		const pendingResult = persistPendingRef(plan, action.id, server, ownership, options);
		let pending = pendingResult.ref;
		refs.push(pending);
		if (pending.status === "complete") {
			if (configured) return;
			const hasSiblingOwner = readClawMcpServerRefsByName(action.id, options).some((candidate) => candidate.agentId !== plan.agent.finalId);
			if (pending.relationship !== "managed" || pending.origin !== "claw-introduced" || pending.independentOwner || hasSiblingOwner) throw new ClawMcpInstallError("mcp_reconcile_conflict", `MCP server ${JSON.stringify(action.id)} was removed while shared or independently owned and will not be recreated.`, refs);
			pending = updateRef(pending, { status: "pending" }, options);
			refs[refs.length - 1] = pending;
		}
		if (pendingResult.existing && configured) {
			if (digestClawMcpServer(configured) !== pending.configDigest) throw new ClawMcpInstallError("mcp_reconcile_conflict", `MCP server ${JSON.stringify(action.id)} changed after an ambiguous write.`, refs);
			refs[refs.length - 1] = updateRef(pending, { status: "complete" }, options);
			return;
		}
		if (configured) {
			refs[refs.length - 1] = updateRef(pending, { status: "complete" }, options);
			return;
		}
		let result;
		try {
			result = await setMcpServer({
				name: action.id,
				server,
				createOnly: true,
				recordIndependentOwner: false
			});
		} catch (error) {
			throw new ClawMcpInstallError("mcp_install_uncertain", coerceErrorMessage(error), refs);
		}
		if (!result.ok) {
			refs[refs.length - 1] = updateRef(pending, {
				status: "failed",
				error: result.error
			}, options);
			throw new ClawMcpInstallError("mcp_install_failed", result.error, refs);
		}
		try {
			refs[refs.length - 1] = updateRef(pending, { status: "complete" }, options);
		} catch (error) {
			throw new ClawMcpInstallError("mcp_provenance_failed", `MCP server was configured, but ownership could not be persisted: ${coerceErrorMessage(error)}`, refs);
		}
	});
	return refs;
}
function readClawMcpServerRefs(agentId, options = {}) {
	const database = openOpenClawStateDatabase(options);
	if (options.readOnly && !database.db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'claw_mcp_server_refs'").get()) return [];
	return database.db.prepare(`SELECT schema_version, agent_id, name, config_digest, relationship, origin,
              independent_owner, status, error,
              created_at_ms, updated_at_ms
         FROM claw_mcp_server_refs
        WHERE agent_id = ?
        ORDER BY name`).all(agentId).map(rowToRef);
}
function readClawMcpServerRefsByName(name, options = {}) {
	const database = openOpenClawStateDatabase(options);
	if (options.readOnly && !database.db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'claw_mcp_server_refs'").get()) return [];
	return database.db.prepare(`SELECT schema_version, agent_id, name, config_digest, relationship, origin,
              independent_owner, status, error,
              created_at_ms, updated_at_ms
         FROM claw_mcp_server_refs
        WHERE name = ?
        ORDER BY agent_id`).all(name).map(rowToRef);
}
function clawMcpRemovalSelector(ref) {
	return `mcp:${ref.name}`;
}
function planClawMcpServerRemoval(ref, options = {}) {
	const affectedClawAgentIds = readClawMcpServerRefsByName(ref.name, options).filter((candidate) => candidate.agentId !== ref.agentId).map((candidate) => candidate.agentId).toSorted();
	const cleanup = options.referencedCleanup ?? { mode: "retain" };
	const explicitlySelected = cleanup.mode === "remove-selected" && (cleanup.selected ?? []).includes(clawMcpRemovalSelector(ref));
	const conflicts = affectedClawAgentIds.length > 0 || ref.independentOwner || ref.origin === "pre-existing";
	const release = (reason, blocked = false) => ({
		ref,
		action: "release",
		blocked,
		affectedClawAgentIds,
		reason
	});
	if (ref.relationship === "managed") {
		if (explicitlySelected) return release("--remove-referenced only accepts resources with a referenced relationship.", true);
		if (affectedClawAgentIds.length > 0) return release("Another Claw still references this MCP server.");
		if (ref.independentOwner) return release("MCP server has a current non-Claw owner.");
		return {
			ref,
			action: "remove",
			blocked: false,
			affectedClawAgentIds
		};
	}
	if (!explicitlySelected && cleanup.mode !== "remove-if-unused") return release("Referenced resources are retained unless a cleanup mode selects them.");
	if (!explicitlySelected && conflicts) return release(affectedClawAgentIds.length > 0 ? "Another Claw still references this MCP server." : "MCP server has a current non-Claw owner or pre-existing origin.");
	if (explicitlySelected && conflicts && !cleanup.allowConflicts) return release("Selected MCP server has other Claw dependents, a non-Claw owner, or pre-existing origin; explicit conflict override is required.", true);
	return {
		ref,
		action: "remove",
		blocked: false,
		affectedClawAgentIds
	};
}
function reconcileClawMcpServerRefs(agentId, configuredServers, options = {}) {
	return readClawMcpServerRefs(agentId, options).map((ref) => {
		if (ref.status !== "pending") return ref;
		const configured = configuredServers[ref.name];
		return configured && digestClawMcpServer(configured) === ref.configDigest ? updateRef(ref, { status: "complete" }, options) : ref;
	});
}
function deleteClawMcpServerRef(agentId, name, options = {}) {
	runOpenClawStateWriteTransaction(({ db }) => {
		db.prepare("DELETE FROM claw_mcp_server_refs WHERE agent_id = ? AND name = ?").run(agentId, name);
	}, options);
}
function upsertClawMcpServerRef(ref, options = {}) {
	runOpenClawStateWriteTransaction(({ db }) => {
		db.prepare(`INSERT INTO claw_mcp_server_refs (
         agent_id, name, schema_version, config_digest, relationship, origin,
         independent_owner, status, error,
         created_at_ms, updated_at_ms
       ) VALUES (
         @agent_id, @name, @schema_version, @config_digest, @relationship, @origin,
         @independent_owner, @status, @error,
         @created_at_ms, @updated_at_ms
       )
       ON CONFLICT(agent_id, name) DO UPDATE SET
         schema_version = excluded.schema_version,
         config_digest = excluded.config_digest,
         relationship = excluded.relationship,
         origin = excluded.origin,
         independent_owner = excluded.independent_owner,
         status = excluded.status,
         error = excluded.error,
         updated_at_ms = excluded.updated_at_ms`).run({
			agent_id: ref.agentId,
			name: ref.name,
			schema_version: ref.schemaVersion,
			config_digest: ref.configDigest,
			relationship: ref.relationship,
			origin: ref.origin,
			independent_owner: ref.independentOwner ? 1 : 0,
			status: ref.status,
			error: ref.error ?? null,
			created_at_ms: ref.createdAtMs,
			updated_at_ms: ref.updatedAtMs
		});
	}, options);
}
//#endregion
//#region src/claws/types.ts
const CLAW_ADD_PLAN_SCHEMA_VERSION = "openclaw.clawAddPlan.v1";
const CLAW_INSPECT_RESULT_SCHEMA_VERSION = "openclaw.clawInspect.v1";
const CLAW_OUTPUT_STABILITY = "experimental";
const CLAW_BOOTSTRAP_FILE_NAMES = [
	"AGENTS.md",
	"SOUL.md",
	"IDENTITY.md",
	"TOOLS.md",
	"HEARTBEAT.md"
];
//#endregion
//#region src/claws/schema-portability.ts
const EXACT_VERSION_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;
const PACKAGE_NAME_PATTERN = /^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/;
const WINDOWS_INVALID_PATH_CHARS = /[<>:"|?*]/;
const WINDOWS_RESERVED_PATH_SEGMENT = /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\..*)?$/i;
const BASE64_PAYLOAD_PATTERN = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
function isExactSemVer(value) {
	return EXACT_VERSION_PATTERN.test(value);
}
function isCanonicalClawHubPackageName(value) {
	return PACKAGE_NAME_PATTERN.test(value);
}
function isSafeClawRelativePath(value) {
	const normalized = value.replaceAll("\\", "/");
	if (normalized.startsWith("/") || /^[A-Za-z]:\//.test(normalized)) return false;
	return normalized.split("/").every((segment) => segment !== "" && segment !== "." && segment !== ".." && !WINDOWS_INVALID_PATH_CHARS.test(segment) && !Array.from(segment).some((character) => character.charCodeAt(0) <= 31) && !segment.endsWith(".") && !segment.endsWith(" ") && !WINDOWS_RESERVED_PATH_SEGMENT.test(segment));
}
function portableClawPathKey(value) {
	return value.replaceAll("\\", "/").normalize("NFC").toLowerCase();
}
function conflictsWithClawPath(targets, candidate) {
	for (const target of targets) if (target === candidate || target.startsWith(`${candidate}/`) || candidate.startsWith(`${target}/`)) return true;
	return false;
}
function isPortableClawAvatar(value) {
	if (isRenderableAvatarImageDataUrl(value)) {
		if (value.length > AVATAR_MAX_DATA_URL_CHARS) return false;
		const comma = value.indexOf(",");
		if (comma < 0) return false;
		const metadata = value.slice(0, comma);
		const payload = value.slice(comma + 1);
		try {
			const base64 = /;base64(?:;|$)/i.test(metadata);
			if (payload.length === 0 || base64 && !BASE64_PAYLOAD_PATTERN.test(payload)) return false;
			const bytes = base64 ? Buffer.from(payload, "base64") : Buffer.from(decodeURIComponent(payload), "utf8");
			return bytes.byteLength > 0 && bytes.byteLength <= 2097152;
		} catch {
			return false;
		}
	}
	return isSafeClawRelativePath(value) && isSupportedLocalAvatarExtension(value);
}
function isValidClawTimezone(value) {
	try {
		new Intl.DateTimeFormat("en-US", { timeZone: value }).format();
		return true;
	} catch {
		return false;
	}
}
function packageManagerArtifacts(command, args) {
	const executable = command.split(/[\\/]/).at(-1)?.replace(/\.(?:cmd|exe)$/i, "").toLowerCase();
	let start = 0;
	if (executable === "pnpm" || executable === "yarn") {
		if (args[0] !== "dlx") return;
		start = 1;
	} else if (executable !== "npx" && executable !== "pnpx" && executable !== "bunx") return;
	const selected = [];
	let positional;
	for (let index = start; index < args.length; index += 1) {
		const value = args[index];
		if (!value) continue;
		if (value === "--") {
			positional = args[index + 1] ?? "";
			break;
		}
		if (value === "-p" || value === "--package") {
			selected.push(args[index + 1] ?? "");
			index += 1;
			continue;
		}
		if (value.startsWith("--package=")) {
			selected.push(value.slice(10));
			continue;
		}
		if (positional === void 0 && !value.startsWith("-")) {
			positional = value;
			break;
		}
	}
	return selected.length > 0 ? selected : [positional ?? ""];
}
function isClawPackageManagerArtifactPinned(command, args) {
	const artifacts = packageManagerArtifacts(command, args);
	if (artifacts === void 0) return;
	return artifacts.every((artifact) => {
		const separator = artifact.lastIndexOf("@");
		const scopedSlash = artifact.startsWith("@") ? artifact.indexOf("/") : -1;
		return separator > 0 && separator > scopedSlash && isExactSemVer(artifact.slice(separator + 1));
	});
}
//#endregion
//#region src/claws/tool-profile-consent.ts
function isConcreteBundleMcpToolName(name) {
	return name.length <= 64 && /^[A-Za-z][A-Za-z0-9_-]*__[A-Za-z][A-Za-z0-9_-]*$/u.test(name);
}
function resolveClawToolProfileSnapshot(tools) {
	if (!tools.profile) return;
	const profile = resolveToolProfilePolicy(tools.profile);
	if (!profile) return;
	const profileAllow = expandToolGroups(profile.allow);
	return {
		allow: (tools.allow ? profileAllow.includes("*") ? expandToolGroups(tools.allow) : Array.from(/* @__PURE__ */ new Set([...profileAllow.filter((tool) => isToolAllowedByPolicyName(tool, { allow: tools.allow })), ...profileAllow.includes("bundle-mcp") ? tools.allow.filter(isConcreteBundleMcpToolName) : []])) : void 0) ?? expandToolGroups([...profile.allow ?? [], ...tools.alsoAllow ?? []]),
		deny: expandToolGroups([...profile.deny ?? [], ...tools.deny ?? []])
	};
}
function materializeClawToolProfile(settings, options = {}) {
	const tools = settings.tools;
	if (!tools) return settings;
	if (!tools.profile) {
		const allow = expandToolGroups(tools.allow);
		const deny = expandToolGroups(tools.deny);
		return {
			...settings,
			tools: {
				...allow.length > 0 ? {
					profile: "full",
					allow
				} : {},
				...tools.alsoAllow ? { alsoAllow: expandToolGroups(tools.alsoAllow) } : {},
				...deny.length > 0 ? { deny } : {},
				...tools.fs ? { fs: tools.fs } : {}
			}
		};
	}
	const snapshot = resolveClawToolProfileSnapshot(tools);
	if (!snapshot) return settings;
	if (tools.profile === "full" && !tools.allow) throw new Error("Claw full tool profile requires a bounded explicit allowlist.");
	if (tools.allow && snapshot.allow.length === 0) throw new Error("Claw tool allowlist does not overlap the selected profile.");
	const allow = options.allowLegacyDynamicProfile ? snapshot.allow.filter((grant) => grant !== "bundle-mcp") : snapshot.allow;
	if (allow.includes("bundle-mcp")) throw new Error("Claw tool profiles containing bundle-mcp require an explicit bounded allowlist of concrete tool names.");
	if (allow.length === 0) throw new Error("Legacy Claw tool profile has no bounded authority to preserve.");
	return {
		...settings,
		tools: {
			profile: "full",
			allow,
			...snapshot.deny.length > 0 ? { deny: snapshot.deny } : {},
			...tools.fs ? { fs: tools.fs } : {}
		}
	};
}
//#endregion
//#region src/claws/schema.ts
const nonEmptyString = string().min(1).refine((value) => value.length === value.trim().length && value.length > 0, "Value must not have leading or trailing whitespace.");
const optionalString = nonEmptyString.optional();
function isBoundedClawToolGrant(value) {
	const normalized = normalizeToolPolicyName(value);
	if (/[*?[\]{}]/u.test(normalized) || normalized === "group:plugins" || normalized === "bundle-mcp") return false;
	return !normalized.startsWith("group:") || expandToolGroups([normalized])[0] !== normalized;
}
function clawManifestWorkspaceConflictsWithPath(manifest, path) {
	const targets = /* @__PURE__ */ new Set();
	for (const name of CLAW_BOOTSTRAP_FILE_NAMES) if (manifest.workspace.bootstrapFiles[name]) targets.add(portableClawPathKey(name));
	for (const file of manifest.workspace.files) targets.add(portableClawPathKey(file.path));
	return conflictsWithClawPath(targets, portableClawPathKey(path));
}
const agentId = nonEmptyString.regex(/^[a-z][a-z0-9_-]{0,63}$/, "Agent id must start with a lowercase letter and contain only lowercase letters, digits, underscores, or hyphens.");
const exactVersion = nonEmptyString.refine(isExactSemVer, "Package version must be an exact semantic version.");
const clawHubPackageName = nonEmptyString.refine(isCanonicalClawHubPackageName, "ClawHub package references must use their canonical lowercase name.");
const portableEnvKey = /^[A-Za-z_][A-Za-z0-9_]*$/;
const packageRelativePath = nonEmptyString.refine(isSafeClawRelativePath, { message: "Path must be package-relative and must not contain traversal segments." }).transform((value) => value.replaceAll("\\", "/"));
const agentSchema = object({
	id: agentId,
	name: optionalString,
	description: optionalString,
	identity: object({
		name: optionalString,
		theme: optionalString,
		emoji: optionalString,
		avatar: nonEmptyString.refine(isPortableClawAvatar, { message: "Avatar must be a bounded image data URL or managed workspace-relative image path." }).optional()
	}).strict().optional()
}).strict();
const openClawExtensionSchema = object({
	id: agentId,
	kind: literal("plugin"),
	format: _enum([
		"openclaw",
		"claude",
		"codex",
		"cursor"
	]),
	source: literal("clawhub"),
	ref: clawHubPackageName,
	version: exactVersion
}).strict();
const openClawProfileSchema = object({
	schemaVersion: literal(1),
	agent: object({
		groupChat: object({ mentionPatterns: array(nonEmptyString).min(1).optional() }).strict().optional(),
		sandbox: object({
			mode: _enum([
				"off",
				"non-main",
				"all"
			]).optional(),
			scope: _enum([
				"session",
				"agent",
				"shared"
			]).optional(),
			workspaceAccess: _enum([
				"none",
				"ro",
				"rw"
			]).optional()
		}).strict().optional(),
		tools: object({
			profile: nonEmptyString.refine((value) => resolveToolProfilePolicy(value) !== void 0, "Tool profile must name a registered OpenClaw built-in profile.").optional(),
			allow: array(nonEmptyString.refine(isBoundedClawToolGrant, "Tool grants must be bounded.")).min(1).optional(),
			alsoAllow: array(nonEmptyString.refine(isBoundedClawToolGrant, "Tool grants must be bounded.")).min(1).optional(),
			deny: array(nonEmptyString).min(1).optional(),
			fs: object({ workspaceOnly: literal(true).optional() }).strict().optional()
		}).strict().superRefine((tools, ctx) => {
			if (tools.profile === "full" && !tools.allow) ctx.addIssue({
				code: "custom",
				path: ["profile"],
				message: "The full tool profile requires a bounded explicit allowlist."
			});
			if (tools.profile && tools.profile !== "full" && tools.allow) {
				const profileAllow = expandToolGroups(resolveToolProfilePolicy(tools.profile)?.allow);
				if (tools.allow.some((grant) => !profileAllow.some((tool) => isToolAllowedByPolicyName(tool, { allow: [grant] })) && !(profileAllow.includes("bundle-mcp") && isConcreteBundleMcpToolName(grant)))) ctx.addIssue({
					code: "custom",
					path: ["allow"],
					message: "Every agent tools allow grant must overlap the selected profile."
				});
			}
			if (tools.profile && resolveClawToolProfileSnapshot(tools)?.allow.includes("bundle-mcp")) ctx.addIssue({
				code: "custom",
				path: ["allow"],
				message: "Profiles containing bundle-mcp require a bounded allowlist of concrete tool names."
			});
			if (tools.alsoAllow && !tools.profile) ctx.addIssue({
				code: "custom",
				path: ["alsoAllow"],
				message: "Agent tools can set alsoAllow only when a bounded profile is selected."
			});
			if (tools.allow && tools.alsoAllow) ctx.addIssue({
				code: "custom",
				path: ["alsoAllow"],
				message: "Agent tools cannot set both allow and alsoAllow; use allow alone or profile with alsoAllow."
			});
		}).optional(),
		memory: object({ search: object({
			enabled: boolean().optional(),
			rememberAcrossConversations: boolean().optional(),
			sources: array(_enum(["memory", "sessions"])).min(1).optional()
		}).strict().superRefine((search, ctx) => {
			if (search.sources?.includes("sessions") && search.rememberAcrossConversations !== true) ctx.addIssue({
				code: "custom",
				path: ["rememberAcrossConversations"],
				message: "The sessions source requires rememberAcrossConversations: true in the OpenClaw profile."
			});
		}).optional() }).strict().optional(),
		heartbeat: object({
			every: nonEmptyString.refine((value) => {
				try {
					parseDurationMs(value, { defaultUnit: "m" });
					return true;
				} catch {
					return false;
				}
			}, "Invalid heartbeat duration.").optional(),
			activeHours: object({
				start: nonEmptyString.regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/).optional(),
				end: nonEmptyString.regex(/^(?:(?:[01]\d|2[0-3]):[0-5]\d|24:00)$/).optional(),
				timezone: nonEmptyString.refine(isValidClawTimezone, "Invalid IANA timezone.").optional()
			}).strict().optional(),
			lightContext: boolean().optional(),
			isolatedSession: boolean().optional(),
			timeoutSeconds: number().int().positive().optional()
		}).strict().optional(),
		humanDelay: object({
			mode: _enum([
				"off",
				"natural",
				"custom"
			]).optional(),
			minMs: number().int().nonnegative().optional(),
			maxMs: number().int().nonnegative().optional()
		}).strict().optional()
	}).strict(),
	extensions: array(openClawExtensionSchema).optional().default([])
}).strict().superRefine((profile, ctx) => {
	const ids = /* @__PURE__ */ new Set();
	const refs = /* @__PURE__ */ new Set();
	profile.extensions.forEach((extension, index) => {
		if (ids.has(extension.id)) ctx.addIssue({
			code: "custom",
			path: [
				"extensions",
				index,
				"id"
			],
			message: `Extension id ${JSON.stringify(extension.id)} is declared more than once.`
		});
		ids.add(extension.id);
		const ref = extension.ref.toLowerCase();
		if (refs.has(ref)) ctx.addIssue({
			code: "custom",
			path: [
				"extensions",
				index,
				"ref"
			],
			message: `Extension ${JSON.stringify(extension.ref)} is declared more than once.`
		});
		refs.add(ref);
	});
});
const workspaceSourceSchema = object({ source: packageRelativePath }).strict();
const bootstrapFilesSchema = object(Object.fromEntries(CLAW_BOOTSTRAP_FILE_NAMES.map((name) => [name, workspaceSourceSchema.optional()]))).partial().strict();
const workspaceFileSchema = object({
	source: packageRelativePath,
	path: packageRelativePath
}).strict();
const workspaceSchema = object({
	bootstrapFiles: bootstrapFilesSchema.optional().default({}),
	files: array(workspaceFileSchema).optional().default([])
}).strict().default({
	bootstrapFiles: {},
	files: []
});
const packageSchema = object({
	kind: _enum(["skill", "plugin"]),
	source: literal("clawhub"),
	ref: clawHubPackageName,
	version: exactVersion
}).strict();
const environmentReference = nonEmptyString.regex(/^\$\{[A-Z_][A-Z0-9_]*\}$/, "MCP environment values must be unresolved ${ENV_VAR} references.");
const mcpServerCommonShape = {
	toolFilter: object({
		include: array(nonEmptyString).min(1).optional(),
		exclude: array(nonEmptyString).min(1).optional()
	}).strict().superRefine((filter, ctx) => {
		for (const field of ["include", "exclude"]) {
			const seen = /* @__PURE__ */ new Set();
			for (const [index, value] of (filter[field] ?? []).entries()) {
				if (value.includes("?") || value.includes("[") || value.includes("]")) ctx.addIssue({
					code: "custom",
					path: [field, index],
					message: "Tool filters support only exact names and * wildcards."
				});
				if (seen.has(value)) ctx.addIssue({
					code: "custom",
					path: [field, index],
					message: "Tool filter entries must be unique."
				});
				seen.add(value);
			}
		}
	}).optional(),
	timeout: number().finite().positive().optional(),
	connectTimeout: number().finite().positive().optional()
};
const mcpServerSchema = union([object({
	command: nonEmptyString,
	transport: literal("stdio").optional(),
	args: array(nonEmptyString).optional(),
	env: record(nonEmptyString.regex(portableEnvKey, "Invalid portable environment key."), environmentReference).optional(),
	...mcpServerCommonShape
}).strict().superRefine((server, ctx) => {
	if (isClawPackageManagerArtifactPinned(server.command, server.args ?? []) === false) ctx.addIssue({
		code: "custom",
		path: ["args"],
		message: "Package-manager MCP commands must select one exact immutable package version."
	});
	for (const key of Object.keys(server.env ?? {})) if (isDangerousHostEnvVarName(key)) ctx.addIssue({
		code: "custom",
		path: ["env", key],
		message: "Environment key is blocked by the spawned-process safety policy."
	});
}), object({
	url: nonEmptyString.url(),
	transport: _enum(["sse", "streamable-http"]),
	auth: literal("oauth").optional(),
	...mcpServerCommonShape
}).strict().superRefine((server, ctx) => {
	const url = new URL(server.url);
	const loopback = [
		"localhost",
		"127.0.0.1",
		"[::1]"
	].includes(url.hostname);
	if (url.protocol !== "https:" && !(url.protocol === "http:" && loopback)) ctx.addIssue({
		code: "custom",
		path: ["url"],
		message: "Remote MCP URLs must use HTTPS, except HTTP on an exact loopback host."
	});
	if (url.username || url.password || url.hash) ctx.addIssue({
		code: "custom",
		path: ["url"],
		message: "Remote MCP URLs must not contain user information or fragments."
	});
})]);
const cronJobSchema = object({
	id: agentId,
	name: optionalString,
	schedule: object({
		cron: nonEmptyString,
		timezone: nonEmptyString
	}).strict(),
	session: _enum(["main", "isolated"]),
	message: nonEmptyString,
	delivery: object({
		mode: _enum(["none", "announce"]),
		channel: literal("last").optional()
	}).strict().optional()
}).strict().superRefine((job, ctx) => {
	if (job.schedule.cron.trim().split(/\s+/).length !== 5) ctx.addIssue({
		code: "custom",
		path: ["schedule", "cron"],
		message: "Cron schedule must use exactly five fields."
	});
	if (job.delivery?.mode === "none" && job.delivery.channel !== void 0 || job.delivery?.mode === "announce" && job.delivery.channel !== "last") ctx.addIssue({
		code: "custom",
		path: ["delivery"],
		message: "Delivery must be { mode: \"none\" } or { mode: \"announce\", channel: \"last\" }."
	});
	try {
		computeNextRunAtMs({
			kind: "cron",
			expr: job.schedule.cron,
			tz: job.schedule.timezone
		}, Date.now());
	} catch {
		ctx.addIssue({
			code: "custom",
			path: ["schedule", "cron"],
			message: "Invalid cron expression or timezone."
		});
	}
});
const manifestSchema = object({
	schemaVersion: literal(1),
	agent: agentSchema,
	metadata: record(nonEmptyString, string()).optional().default({}),
	workspace: workspaceSchema.optional().default({
		bootstrapFiles: {},
		files: []
	}),
	packages: array(packageSchema).optional().default([]),
	mcpServers: record(nonEmptyString.regex(/^[a-z][a-z0-9_-]{0,63}$/, "Invalid MCP server name."), mcpServerSchema).optional().default({}),
	cronJobs: array(cronJobSchema).optional().default([])
}).strict().superRefine((manifest, ctx) => {
	const workspaceTargets = /* @__PURE__ */ new Set();
	const nativeBootstrapTarget = /* @__PURE__ */ new Set([portableClawPathKey("BOOTSTRAP.md")]);
	for (const name of CLAW_BOOTSTRAP_FILE_NAMES) if (manifest.workspace.bootstrapFiles[name]) workspaceTargets.add(portableClawPathKey(name));
	manifest.workspace.files.forEach((file, index) => {
		const destinationKey = portableClawPathKey(file.path);
		if (conflictsWithClawPath(nativeBootstrapTarget, destinationKey)) ctx.addIssue({
			code: "custom",
			path: [
				"workspace",
				"files",
				index,
				"path"
			],
			message: "Package-root BOOTSTRAP.md uses the native seed-once lifecycle and cannot be a managed workspace destination."
		});
		if (conflictsWithClawPath(workspaceTargets, destinationKey)) ctx.addIssue({
			code: "custom",
			path: [
				"workspace",
				"files",
				index,
				"path"
			],
			message: `Workspace destination ${JSON.stringify(file.path)} is declared more than once.`
		});
		workspaceTargets.add(destinationKey);
	});
	const packageKeys = /* @__PURE__ */ new Set();
	manifest.packages.forEach((pkg, index) => {
		const key = `${pkg.kind}:${pkg.source}:${pkg.ref.toLowerCase()}`;
		if (packageKeys.has(key)) ctx.addIssue({
			code: "custom",
			path: ["packages", index],
			message: `Package ${JSON.stringify(pkg.ref)} is declared more than once for ${pkg.kind}.`
		});
		packageKeys.add(key);
	});
	const managedPaths = new Set(manifest.workspace.files.map((file) => portableClawPathKey(file.path)));
	const avatar = manifest.agent.identity?.avatar;
	if (avatar && !isRenderableAvatarImageDataUrl(avatar) && !managedPaths.has(portableClawPathKey(avatar))) ctx.addIssue({
		code: "custom",
		path: [
			"agent",
			"identity",
			"avatar"
		],
		message: "Workspace-relative avatar must match a workspace.files destination."
	});
	const cronIds = /* @__PURE__ */ new Set();
	manifest.cronJobs.forEach((job, index) => {
		if (cronIds.has(job.id)) ctx.addIssue({
			code: "custom",
			path: [
				"cronJobs",
				index,
				"id"
			],
			message: `Cron job id ${JSON.stringify(job.id)} is declared more than once.`
		});
		cronIds.add(job.id);
	});
});
function formatIssuePath(path) {
	if (path.length === 0) return "$";
	return `$${path.map((part) => typeof part === "number" ? `[${part}]` : `.${String(part)}`).join("")}`;
}
function diagnosticsFromZodError(error) {
	return error.issues.map((issue) => ({
		level: "error",
		code: "invalid_manifest",
		phase: "schema",
		path: formatIssuePath(issue.path),
		message: issue.message
	}));
}
function parseClawManifest(value) {
	const parsed = manifestSchema.safeParse(value);
	if (!parsed.success) return {
		ok: false,
		diagnostics: diagnosticsFromZodError(parsed.error)
	};
	return {
		ok: true,
		manifest: parsed.data,
		diagnostics: []
	};
}
function parseClawOpenClawProfile(value) {
	const parsed = openClawProfileSchema.safeParse(value);
	if (!parsed.success) return {
		ok: false,
		diagnostics: diagnosticsFromZodError(parsed.error)
	};
	return {
		ok: true,
		profile: parsed.data,
		diagnostics: []
	};
}
//#endregion
//#region src/claws/openclaw-profile.ts
const MAX_PROFILE_BYTES = 256 * 1024;
const CLAW_PROFILE_PATH = "profiles/openclaw.yml";
const LEGACY_PROFILE_POINTER_KEY = "openclaw.config";
const LEGACY_PROFILE_POINTER_PATH = "$.metadata.openclaw.config";
const CONVENTIONAL_PROFILE_PATH = "$.profiles.openclaw";
function diagnostic(code, message, path = "$") {
	return {
		level: "error",
		code,
		phase: "parse",
		path,
		message
	};
}
function warning(code, message, path) {
	return {
		level: "warning",
		code,
		phase: "parse",
		path,
		message
	};
}
function parseProfileYaml(raw, path) {
	const document = parseDocument(raw.startsWith("﻿") ? raw.slice(1) : raw, {
		prettyErrors: false,
		uniqueKeys: true
	});
	if (document.errors.length > 0) return {
		ok: false,
		diagnostics: document.errors.map((error) => diagnostic("invalid_openclaw_profile", `Could not parse ${path}: ${error.message}`))
	};
	let unsupportedFeature;
	visit(document, {
		Alias() {
			unsupportedFeature ??= "aliases";
		},
		Node(_key, node) {
			if (node.anchor) unsupportedFeature ??= "anchors";
			else if (node.tag) unsupportedFeature ??= "explicit tags";
		},
		Pair(_key, pair) {
			if (isScalar(pair.key) && pair.key.value === "<<") unsupportedFeature ??= "merge keys";
		}
	});
	if (unsupportedFeature) return {
		ok: false,
		diagnostics: [diagnostic("unsupported_openclaw_profile_yaml_feature", `${path} uses ${unsupportedFeature}; OpenClaw profile YAML must map directly to JSON data.`)]
	};
	try {
		return {
			ok: true,
			value: document.toJSON()
		};
	} catch (error) {
		return {
			ok: false,
			diagnostics: [diagnostic("invalid_openclaw_profile", `Could not parse ${path}: ${error.message}`)]
		};
	}
}
function isToolProfileId(value) {
	return resolveClawToolProfileSnapshot({ profile: value }) !== void 0;
}
function migrateLegacyDynamicToolProfile(value) {
	const profile = asOptionalRecord(value);
	const agent = asOptionalRecord(profile?.agent);
	const tools = asOptionalRecord(agent?.tools);
	const toolProfile = tools?.profile;
	if (!profile || !agent || !tools || typeof toolProfile !== "string" || !isToolProfileId(toolProfile) || tools.allow !== void 0) return { value };
	if (toolProfile === "full") return { value };
	const validationProbe = parseClawOpenClawProfile({
		...profile,
		agent: {
			...agent,
			tools: {
				...tools,
				profile: "minimal"
			}
		}
	});
	if (!validationProbe.ok) return { value };
	const validatedTools = validationProbe.profile.agent.tools;
	if (!validatedTools) return { value };
	const selection = {
		...validatedTools,
		profile: toolProfile
	};
	const legacyProfile = {
		...validationProbe.profile,
		agent: {
			...validationProbe.profile.agent,
			tools: selection
		}
	};
	const migrated = materializeClawToolProfile({ tools: selection }, { allowLegacyDynamicProfile: true });
	return {
		value: {
			...profile,
			agent: {
				...agent,
				tools: migrated.tools
			}
		},
		legacyProfile
	};
}
async function readProfileFile(packageRoot, path) {
	return (await (await root(packageRoot)).read(path, {
		hardlinks: "reject",
		maxBytes: MAX_PROFILE_BYTES,
		nonBlockingRead: true,
		symlinks: "reject"
	})).buffer;
}
/**
* Resolves the OpenClaw profile for a package.
*
* `profiles/openclaw.yml` is the conventional location. The retired
* `metadata.openclaw.config` pointer is still read for compatibility with
* packages published against the released contract; it reports a deprecation
* warning instead of failing, and only errors when it is malformed or conflicts
* with a conventional profile.
*/
async function readClawOpenClawProfile(params) {
	const conventionalExists = await (await root(params.packageRoot)).exists(CLAW_PROFILE_PATH);
	const legacyPointer = params.metadata?.[LEGACY_PROFILE_POINTER_KEY];
	const diagnostics = [];
	let declaredPath = CLAW_PROFILE_PATH;
	let diagnosticPath = CONVENTIONAL_PROFILE_PATH;
	if (legacyPointer !== void 0) {
		if (legacyPointer.includes("\\") || !isSafeClawRelativePath(legacyPointer) || !/\.ya?ml$/i.test(legacyPointer)) return {
			ok: false,
			diagnostics: [diagnostic("invalid_openclaw_profile_path", `metadata.${LEGACY_PROFILE_POINTER_KEY} must reference a forward-slash package-relative .yml or .yaml file.`, LEGACY_PROFILE_POINTER_PATH)]
		};
		if (conventionalExists && legacyPointer !== CLAW_PROFILE_PATH) return {
			ok: false,
			diagnostics: [diagnostic("conflicting_openclaw_profile_pointer", `metadata.${LEGACY_PROFILE_POINTER_KEY} references ${legacyPointer} while ${CLAW_PROFILE_PATH} also exists; keep only ${CLAW_PROFILE_PATH}.`, LEGACY_PROFILE_POINTER_PATH)]
		};
		declaredPath = legacyPointer;
		diagnosticPath = LEGACY_PROFILE_POINTER_PATH;
		diagnostics.push(warning("deprecated_openclaw_profile_pointer", `metadata.${LEGACY_PROFILE_POINTER_KEY} is deprecated; move the profile to ${CLAW_PROFILE_PATH} and remove the metadata entry.`, LEGACY_PROFILE_POINTER_PATH));
	} else if (!conventionalExists) return { ok: true };
	let raw;
	try {
		raw = await readProfileFile(params.packageRoot, declaredPath);
	} catch (error) {
		const unsafe = error instanceof FsSafeError && (error.code === "hardlink" || error.code === "symlink" || error.code === "path-mismatch");
		const tooLarge = error instanceof FsSafeError && error.code === "too-large";
		return {
			ok: false,
			diagnostics: [diagnostic(unsafe ? "openclaw_profile_unsafe" : tooLarge ? "openclaw_profile_too_large" : "openclaw_profile_read_failed", unsafe ? "The OpenClaw profile must be a regular, non-symlinked, non-hardlinked file." : tooLarge ? `The OpenClaw profile exceeds ${MAX_PROFILE_BYTES} bytes.` : `Could not read ${declaredPath}: ${error.message}`, diagnosticPath)]
		};
	}
	const yaml = parseProfileYaml(raw.toString("utf8"), declaredPath);
	if (!yaml.ok) return yaml;
	const migration = params.allowLegacyDynamicToolProfile ? migrateLegacyDynamicToolProfile(yaml.value) : { value: yaml.value };
	const parsed = parseClawOpenClawProfile(migration.value);
	if (!parsed.ok) return {
		ok: false,
		diagnostics: parsed.diagnostics.map((entry) => ({
			...entry,
			path: `${diagnosticPath}${entry.path.slice(1)}`
		}))
	};
	return {
		ok: true,
		profile: parsed.profile,
		...migration.legacyProfile ? { legacyProfile: migration.legacyProfile } : {},
		raw,
		path: declaredPath,
		...diagnostics.length > 0 ? { diagnostics } : {}
	};
}
//#endregion
//#region src/claws/source-limits.ts
const MAX_CLAW_MANIFEST_BYTES = 1024 * 1024;
const MAX_MANAGED_FILE_BYTES = 1024 * 1024;
const MAX_MANAGED_WORKSPACE_BYTES = 4 * MAX_MANAGED_FILE_BYTES;
//#endregion
//#region src/claws/reader.ts
const CLAW_MARKDOWN_FILENAME = "CLAW.md";
const MAX_CLAW_PACKAGE_JSON_BYTES = 256 * 1024;
async function readBoundedFile(path, maxBytes) {
	return (await (await root(dirname(path))).read(basename(path), {
		hardlinks: "reject",
		maxBytes,
		nonBlockingRead: true,
		symlinks: "reject"
	})).buffer;
}
function fileDiagnostic(code, message, path = "$") {
	return {
		level: "error",
		code,
		phase: "parse",
		path,
		message
	};
}
function isContained(root, candidate) {
	const child = relative(root, candidate);
	return child !== ".." && !child.startsWith(`..${sep}`) && !isAbsolute(child);
}
function updateSnapshotHash(hash, label, bytes) {
	hash.update(`${Buffer.byteLength(label, "utf8")}:${label}:${bytes.byteLength}:`, "utf8");
	hash.update(bytes);
}
function workspaceSourceDiagnostic(error, sourcePath) {
	if (error instanceof FsSafeError && error.code === "too-large") return fileDiagnostic("workspace_source_too_large", `Workspace source ${JSON.stringify(sourcePath)} exceeds ${MAX_MANAGED_FILE_BYTES} bytes.`, "$.workspace");
	if (error instanceof FsSafeError && (error.code === "symlink" || error.code === "hardlink" || error.code === "path-mismatch") || error instanceof Error && error.message.includes("symlinked directory")) return fileDiagnostic("workspace_source_unsafe", `Workspace source ${JSON.stringify(sourcePath)} must be a regular, non-symlinked, non-hardlinked file.`, "$.workspace");
	return fileDiagnostic("workspace_source_invalid", `Workspace source ${JSON.stringify(sourcePath)} must resolve inside the Claw source.`, "$.workspace");
}
async function buildDevelopmentSnapshot(params) {
	const hash = createHash("sha256");
	let byteLength = 0;
	const add = (label, bytes) => {
		updateSnapshotHash(hash, label, bytes);
		byteLength += bytes.byteLength;
	};
	const snapshotFile = (bytes) => ({
		byteLength: bytes.byteLength,
		digest: `sha256:${createHash("sha256").update(bytes).digest("hex")}`
	});
	const manifest = snapshotFile(params.manifestRaw);
	const openClawProfile = params.openClawProfile ? {
		sourcePath: params.openClawProfile.path.replaceAll("\\", "/"),
		...snapshotFile(params.openClawProfile.raw)
	} : void 0;
	add("canonical-source", Buffer.from(params.source.manifestPath, "utf8"));
	add("manifest", params.manifestRaw);
	if (params.openClawProfile) add(`profile:${params.openClawProfile.path.replaceAll("\\", "/")}`, params.openClawProfile.raw);
	if (params.source.kind === "package") {
		const packageJson = params.source.packageJsonRaw;
		if (!packageJson) return {
			ok: false,
			diagnostics: [fileDiagnostic("package_read_failed", "Could not snapshot package.json.")]
		};
		add("package.json", packageJson);
	}
	const sourceRoot = await root(params.source.packageRoot);
	let packageBootstrap;
	if (await sourceRoot.exists("BOOTSTRAP.md")) try {
		const read = await sourceRoot.read("BOOTSTRAP.md", {
			hardlinks: "reject",
			maxBytes: MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES,
			nonBlockingRead: true,
			symlinks: "reject"
		});
		if (new TextDecoder("utf-8", { fatal: true }).decode(read.buffer).trim().length === 0) return {
			ok: false,
			diagnostics: [fileDiagnostic("package_bootstrap_empty", "Package-root BOOTSTRAP.md must contain first-run instructions.", "$.bootstrap")]
		};
		const digest = `sha256:${createHash("sha256").update(read.buffer).digest("hex")}`;
		add("bootstrap:BOOTSTRAP.md", read.buffer);
		packageBootstrap = {
			sourcePath: "BOOTSTRAP.md",
			realPath: read.realPath,
			byteLength: read.buffer.byteLength,
			digest
		};
	} catch (error) {
		const tooLarge = error instanceof FsSafeError && error.code === "too-large";
		return {
			ok: false,
			diagnostics: [fileDiagnostic(tooLarge ? "package_bootstrap_too_large" : "package_bootstrap_invalid", tooLarge ? `Package-root BOOTSTRAP.md exceeds ${MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES} bytes.` : `Package-root BOOTSTRAP.md must be a safe UTF-8 regular file: ${error.message}`, "$.bootstrap")]
		};
	}
	const declaredSources = [...Object.values(params.manifest.workspace.bootstrapFiles).filter((entry) => entry !== void 0).map((entry) => entry.source), ...params.manifest.workspace.files.map((entry) => entry.source)].toSorted((left, right) => Buffer.compare(Buffer.from(left), Buffer.from(right)));
	const openedSources = [];
	const workspaceSources = [];
	try {
		let workspaceByteLength = 0;
		for (const sourcePath of declaredSources) try {
			await assertNoSymlinkParents({
				rootDir: params.source.packageRoot,
				targetPath: resolve(params.source.packageRoot, sourcePath),
				allowMissing: false,
				messagePrefix: "Workspace source"
			});
			const opened = await sourceRoot.open(sourcePath, {
				hardlinks: "reject",
				symlinks: "reject"
			});
			if (opened.stat.size > 1048576) {
				await opened[Symbol.asyncDispose]();
				throw new FsSafeError("too-large", `file exceeds limit of ${MAX_MANAGED_FILE_BYTES} bytes (got ${opened.stat.size})`);
			}
			workspaceByteLength += opened.stat.size;
			openedSources.push({
				sourcePath,
				opened
			});
		} catch (error) {
			return {
				ok: false,
				diagnostics: [workspaceSourceDiagnostic(error, sourcePath)]
			};
		}
		if (workspaceByteLength > 4194304) return {
			ok: false,
			diagnostics: [fileDiagnostic("workspace_sources_too_large", `Workspace sources exceed ${MAX_MANAGED_WORKSPACE_BYTES} aggregate bytes.`, "$.workspace")]
		};
		let readWorkspaceByteLength = 0;
		for (const { sourcePath, opened } of openedSources) {
			const bytes = await opened.handle.readFile();
			if (bytes.byteLength > 1048576) return {
				ok: false,
				diagnostics: [workspaceSourceDiagnostic(new FsSafeError("too-large", "workspace source grew while reading"), sourcePath)]
			};
			readWorkspaceByteLength += bytes.byteLength;
			if (readWorkspaceByteLength > 4194304) return {
				ok: false,
				diagnostics: [fileDiagnostic("workspace_sources_too_large", `Workspace sources exceed ${MAX_MANAGED_WORKSPACE_BYTES} aggregate bytes.`, "$.workspace")]
			};
			const normalizedSourcePath = sourcePath.replaceAll("\\", "/");
			const digest = `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
			add(`workspace:${sourcePath.replaceAll("\\", "/")}`, bytes);
			workspaceSources.push({
				sourcePath: normalizedSourcePath,
				realPath: opened.realPath,
				byteLength: bytes.byteLength,
				digest
			});
		}
	} finally {
		await Promise.all(openedSources.map(({ opened }) => opened[Symbol.asyncDispose]()));
	}
	return {
		ok: true,
		integrity: `sha256:${hash.digest("hex")}`,
		byteLength,
		manifest,
		...openClawProfile ? { openClawProfile } : {},
		workspaceSources,
		...packageBootstrap ? { packageBootstrap } : {}
	};
}
function parsePackageJson(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const record = value;
	const openclaw = record.openclaw;
	if (!openclaw || typeof openclaw !== "object" || Array.isArray(openclaw)) return;
	const claw = openclaw.claw;
	if (typeof record.name !== "string" || !isCanonicalClawHubPackageName(record.name) || typeof record.version !== "string" || !isExactSemVer(record.version) || typeof claw !== "string" || claw.trim() === "") return;
	return {
		name: record.name,
		version: record.version,
		openclaw: { claw }
	};
}
async function readJson(path, code, maxBytes) {
	let raw;
	try {
		raw = await readBoundedFile(path, maxBytes);
	} catch (error) {
		const tooLarge = error instanceof RangeError || error instanceof FsSafeError && error.code === "too-large";
		return {
			ok: false,
			diagnostics: [fileDiagnostic(tooLarge ? `${code}_too_large` : code, tooLarge ? `${path} exceeds ${maxBytes} bytes.` : `Could not read ${path}: ${error.message}`)]
		};
	}
	try {
		return {
			ok: true,
			raw,
			value: JSON.parse(raw.toString("utf8"))
		};
	} catch (error) {
		return {
			ok: false,
			diagnostics: [fileDiagnostic("invalid_json", `Could not parse ${path}: ${error.message}`)]
		};
	}
}
function parseClawMarkdown(raw, path) {
	const markdown = raw.length >= 3 && raw[0] === 239 && raw[1] === 187 && raw[2] === 191 ? raw.subarray(3) : raw;
	const match = markdown.toString("latin1").match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
	if (!match) return {
		ok: false,
		diagnostics: [fileDiagnostic("missing_claw_frontmatter", `${path} must start with a YAML frontmatter block delimited by --- lines.`)]
	};
	const frontmatterBytes = Buffer.from(match[1] ?? "", "latin1");
	const body = markdown.subarray(match[0].length);
	let frontmatter;
	try {
		frontmatter = new TextDecoder("utf-8", { fatal: true }).decode(frontmatterBytes);
		new TextDecoder("utf-8", { fatal: true }).decode(body);
	} catch {
		return {
			ok: false,
			diagnostics: [fileDiagnostic("invalid_claw_markdown_utf8", `${path} must contain valid UTF-8.`)]
		};
	}
	const document = parseDocument(frontmatter, {
		prettyErrors: false,
		uniqueKeys: true
	});
	if (document.errors.length > 0) return {
		ok: false,
		diagnostics: document.errors.map((error) => fileDiagnostic("invalid_claw_frontmatter", `Could not parse ${path}: ${error.message}`))
	};
	let unsupportedFeature;
	visit(document, {
		Alias() {
			unsupportedFeature ??= "aliases";
		},
		Node(_key, node) {
			if (node.anchor) unsupportedFeature ??= "anchors";
			else if (node.tag) unsupportedFeature ??= "explicit tags";
		},
		Pair(_key, pair) {
			if (isScalar(pair.key) && pair.key.value === "<<") unsupportedFeature ??= "merge keys";
		}
	});
	if (unsupportedFeature) return {
		ok: false,
		diagnostics: [fileDiagnostic("unsupported_claw_yaml_feature", `${path} uses ${unsupportedFeature}; CLAW.md frontmatter must map directly to JSON data.`)]
	};
	try {
		return {
			ok: true,
			value: document.toJSON(),
			body
		};
	} catch (error) {
		return {
			ok: false,
			diagnostics: [fileDiagnostic("invalid_claw_frontmatter", `Could not parse ${path}: ${error.message}`)]
		};
	}
}
function parseClawManifestDocument(raw, path) {
	if (basename(path).toLowerCase() === CLAW_MARKDOWN_FILENAME.toLowerCase()) return parseClawMarkdown(raw, path);
	try {
		return {
			ok: true,
			value: JSON.parse(raw.toString("utf8"))
		};
	} catch (error) {
		return {
			ok: false,
			diagnostics: [fileDiagnostic("invalid_json", `Could not parse ${path}: ${error.message}`)]
		};
	}
}
async function readClawDocument(path, code, manifestFormatPath = path) {
	let raw;
	try {
		raw = await readBoundedFile(path, MAX_CLAW_MANIFEST_BYTES);
	} catch (error) {
		const tooLarge = error instanceof RangeError || error instanceof FsSafeError && error.code === "too-large";
		return {
			ok: false,
			diagnostics: [fileDiagnostic(tooLarge ? `${code}_too_large` : code, tooLarge ? `${path} exceeds ${MAX_CLAW_MANIFEST_BYTES} bytes.` : `Could not read ${path}: ${error.message}`)]
		};
	}
	const parsed = parseClawManifestDocument(raw, manifestFormatPath);
	return parsed.ok ? {
		...parsed,
		raw
	} : parsed;
}
async function resolvePackageSource(packageRoot) {
	const packageRootReal = await realpath(packageRoot).catch(() => void 0);
	if (!packageRootReal) return {
		ok: false,
		diagnostics: [fileDiagnostic("package_read_failed", `Could not resolve ${packageRoot}.`)]
	};
	const packageJsonResult = await readJson(resolve(packageRootReal, "package.json"), "package_read_failed", MAX_CLAW_PACKAGE_JSON_BYTES);
	if (!packageJsonResult.ok) return packageJsonResult;
	const packageJson = parsePackageJson(packageJsonResult.value);
	if (!packageJson) return {
		ok: false,
		diagnostics: [fileDiagnostic("invalid_package_metadata", "package.json must declare non-empty name, version, and openclaw.claw fields.")]
	};
	if (isAbsolute(packageJson.openclaw.claw)) return {
		ok: false,
		diagnostics: [fileDiagnostic("manifest_escapes_package", "openclaw.claw must be package-relative.")]
	};
	const declaredManifestPath = resolve(packageRootReal, packageJson.openclaw.claw);
	const manifestPath = await realpath(declaredManifestPath).catch(() => void 0);
	if (!manifestPath || !isContained(packageRootReal, manifestPath)) return {
		ok: false,
		diagnostics: [fileDiagnostic("manifest_escapes_package", "The declared Claw manifest must resolve inside its package root.")]
	};
	return {
		ok: true,
		source: {
			kind: "package",
			name: packageJson.name,
			version: packageJson.version,
			packageRoot: packageRootReal,
			manifestPath,
			packageJsonRaw: packageJsonResult.raw,
			manifestFormatPath: declaredManifestPath
		}
	};
}
async function resolveSource(path) {
	const inputPath = resolve(path);
	const inputStat = await stat(inputPath).catch(() => void 0);
	if (!inputStat) return {
		ok: false,
		diagnostics: [fileDiagnostic("read_failed", `Could not resolve Claw source ${inputPath}.`)]
	};
	if (inputStat.isDirectory()) return resolvePackageSource(inputPath);
	if (!inputStat.isFile()) return {
		ok: false,
		diagnostics: [fileDiagnostic("unsupported_source", "Claw source must be a file or directory.")]
	};
	const manifestPath = await realpath(inputPath);
	const packageRoot = await realpath(dirname(manifestPath));
	return {
		ok: true,
		source: {
			kind: "development",
			name: `local:${basename(manifestPath).replace(/\.json$/i, "")}`,
			version: "0.0.0-development",
			packageRoot,
			manifestPath,
			manifestFormatPath: inputPath
		}
	};
}
async function readClawManifestFile(path, options = {}) {
	const sourceResult = await resolveSource(path);
	if (!sourceResult.ok) return sourceResult;
	const manifestResult = await readClawDocument(sourceResult.source.manifestPath, "read_failed", sourceResult.source.manifestFormatPath);
	if (!manifestResult.ok) return manifestResult;
	const parsed = parseClawManifest(manifestResult.value);
	if (!parsed.ok) return parsed;
	const hasMarkdownBody = manifestResult.body !== void 0 && manifestResult.body.toString("utf8").trim().length > 0;
	if (hasMarkdownBody && clawManifestWorkspaceConflictsWithPath(parsed.manifest, "SOUL.md")) return {
		ok: false,
		diagnostics: [fileDiagnostic("claw_body_soul_conflict", "CLAW.md body content and an explicit SOUL.md workspace declaration cannot both be present.", "$.workspace")]
	};
	const allowLegacyDynamicToolProfile = options.allowLegacyDynamicToolProfile === true || (options.authorizeLegacyDynamicToolProfile ? await options.authorizeLegacyDynamicToolProfile({
		manifest: parsed.manifest,
		source: {
			kind: sourceResult.source.kind,
			name: sourceResult.source.name,
			version: sourceResult.source.version,
			packageRoot: sourceResult.source.packageRoot,
			manifestPath: sourceResult.source.manifestPath
		}
	}) : false);
	const profile = await readClawOpenClawProfile({
		packageRoot: sourceResult.source.packageRoot,
		metadata: parsed.manifest.metadata,
		...allowLegacyDynamicToolProfile ? { allowLegacyDynamicToolProfile: true } : {}
	});
	if (!profile.ok) return profile;
	const snapshot = await buildDevelopmentSnapshot({
		source: sourceResult.source,
		manifest: parsed.manifest,
		manifestRaw: manifestResult.raw,
		...profile.raw && profile.path ? { openClawProfile: {
			path: profile.path,
			raw: profile.raw
		} } : {}
	});
	if (!snapshot.ok) return snapshot;
	const resolvedSource = sourceResult.source;
	const source = {
		kind: resolvedSource.kind,
		name: resolvedSource.name,
		version: resolvedSource.version,
		packageRoot: resolvedSource.packageRoot,
		manifestPath: resolvedSource.manifestPath,
		integrityKind: "development-snapshot",
		integrity: snapshot.integrity,
		byteLength: snapshot.byteLength
	};
	return {
		ok: true,
		manifest: parsed.manifest,
		...hasMarkdownBody ? { clawMarkdownBody: manifestResult.body } : {},
		...snapshot.packageBootstrap ? { packageBootstrap: snapshot.packageBootstrap } : {},
		...profile.profile ? { openClawProfile: profile.profile } : {},
		...profile.legacyProfile ? { legacyOpenClawProfile: profile.legacyProfile } : {},
		source,
		snapshot: {
			manifest: snapshot.manifest,
			...snapshot.openClawProfile ? { openClawProfile: snapshot.openClawProfile } : {},
			workspaceSources: snapshot.workspaceSources,
			...snapshot.packageBootstrap ? { packageBootstrap: snapshot.packageBootstrap } : {}
		},
		diagnostics: [...parsed.diagnostics, ...profile.diagnostics ?? []]
	};
}
//#endregion
export { digestClawMcpServer as C, readClawMcpServerRefsByName as D, readClawMcpServerRefs as E, reconcileClawMcpServerRefs as O, deleteClawMcpServerRef as S, planClawMcpServerRemoval as T, CLAW_INSPECT_RESULT_SCHEMA_VERSION as _, MAX_MANAGED_WORKSPACE_BYTES as a, ClawMcpInstallError as b, parseClawOpenClawProfile as c, isCanonicalClawHubPackageName as d, isPortableClawAvatar as f, CLAW_BOOTSTRAP_FILE_NAMES as g, CLAW_ADD_PLAN_SCHEMA_VERSION as h, MAX_MANAGED_FILE_BYTES as i, upsertClawMcpServerRef as k, materializeClawToolProfile as l, portableClawPathKey as m, readClawManifestFile as n, clawManifestWorkspaceConflictsWithPath as o, isSafeClawRelativePath as p, MAX_CLAW_MANIFEST_BYTES as r, parseClawManifest as s, parseClawMarkdown as t, resolveClawToolProfileSnapshot as u, CLAW_OUTPUT_STABILITY as v, installClawMcpServers as w, clawMcpRemovalSelector as x, CLAW_MCP_REF_SCHEMA_VERSION as y };
