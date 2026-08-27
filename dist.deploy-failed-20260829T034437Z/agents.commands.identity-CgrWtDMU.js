import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./src-BntaCZM-.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import { m as shortenHomePath } from "./utils-Bw16L5tB.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as ExpectedCliError } from "./failure-output-CdUzE2dC.js";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-LRpY2Icg.js";
import "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId, r as normalizeAgentIdStrict } from "./agent-id-CeT3w4ap.js";
import { a as listAgentIds, f as resolveAgentWorkspaceDir, g as resolveDefaultAgentId, r as listAgentEntries } from "./agent-scope-config-CUBiGmG3.js";
import { n as sanitizeTerminalText } from "./safe-text-DbwznzfG.js";
import { t as migratePersistedImplicitMainRoster } from "./legacy.roster-DTfT89zD.js";
import { r as replaceConfigFile } from "./mutate-C_fsUarr.js";
import "./config-B2bSneS2.js";
import "./workspace-CYdcs93J.js";
import { r as logConfigUpdated } from "./logging-CzP_6-o-.js";
import { r as loadAgentIdentityFromFile } from "./identity-file-BsEEOy-6.js";
import { i as loadAgentIdentity, r as findAgentEntryIndex } from "./agents.config-b213TBEZ.js";
import { n as requireValidConfigFileSnapshot } from "./config-validation-BZK80QZW.js";
import path from "node:path";
//#region src/commands/agents.commands.identity.ts
const normalizeWorkspacePath = (input) => path.resolve(resolveUserPath(input));
function failAgentIdentity(message) {
	throw new ExpectedCliError({
		message,
		humanOutput: message,
		machineOutput: message
	});
}
function resolveAgentIdByWorkspace(cfg, workspaceDir) {
	const list = listAgentEntries(cfg);
	const ids = list.length > 0 ? list.map((entry) => normalizeAgentId(entry.id)) : [resolveDefaultAgentId(cfg)];
	const normalizedTarget = normalizeWorkspacePath(workspaceDir);
	return ids.filter((id) => normalizeWorkspacePath(resolveAgentWorkspaceDir(cfg, id)) === normalizedTarget);
}
/** Update an agent identity from flags or workspace identity markdown. */
async function agentsSetIdentityCommand(opts, runtime = defaultRuntime) {
	const configSnapshot = await requireValidConfigFileSnapshot(runtime);
	if (!configSnapshot) return;
	const cfg = migratePersistedImplicitMainRoster(configSnapshot.sourceConfig ?? configSnapshot.config).config;
	const baseHash = configSnapshot.hash;
	const nameRaw = normalizeOptionalString(opts.name);
	const emojiRaw = normalizeOptionalString(opts.emoji);
	const themeRaw = normalizeOptionalString(opts.theme);
	const avatarRaw = normalizeOptionalString(opts.avatar);
	const hasExplicitIdentity = Boolean(nameRaw || emojiRaw || themeRaw || avatarRaw);
	const identityFileRaw = normalizeOptionalString(opts.identityFile);
	const workspaceRaw = normalizeOptionalString(opts.workspace);
	const wantsIdentityFile = Boolean(opts.fromIdentity || identityFileRaw || !hasExplicitIdentity);
	const normalizedAgent = opts.agent === void 0 ? null : normalizeAgentIdStrict(opts.agent);
	if (normalizedAgent && !normalizedAgent.ok) failAgentIdentity(`Agent "${opts.agent}" not found. Create it with \`openclaw agents add\`.`);
	let agentId = normalizedAgent?.value;
	let identityFilePath;
	let workspaceDir;
	if (identityFileRaw) {
		identityFilePath = normalizeWorkspacePath(identityFileRaw);
		workspaceDir = path.dirname(identityFilePath);
	} else if (workspaceRaw) workspaceDir = normalizeWorkspacePath(workspaceRaw);
	else if (agentId && wantsIdentityFile) workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
	else if (wantsIdentityFile || !agentId) workspaceDir = path.resolve(process.cwd());
	if (!agentId) {
		const resolvedWorkspace = expectDefined(workspaceDir, "agent workspace");
		const matches = resolveAgentIdByWorkspace(cfg, resolvedWorkspace);
		if (matches.length === 0) failAgentIdentity(`No agent workspace matches ${shortenHomePath(resolvedWorkspace)}. Pass --agent to target a specific agent.`);
		if (matches.length > 1) failAgentIdentity(`Multiple agents match ${shortenHomePath(resolvedWorkspace)}: ${matches.join(", ")}. Pass --agent to choose one.`);
		agentId = matches[0];
	}
	const resolvedAgentId = expectDefined(agentId, "agent id");
	if (!listAgentIds(cfg).map((id) => normalizeAgentId(id)).includes(resolvedAgentId)) failAgentIdentity(`Agent "${resolvedAgentId}" not found. Create it with \`openclaw agents add\`.`);
	const list = listAgentEntries(cfg);
	const index = findAgentEntryIndex(list, resolvedAgentId);
	let identityFromFile = null;
	if (wantsIdentityFile) {
		if (identityFilePath) try {
			identityFromFile = await loadAgentIdentityFromFile(identityFilePath);
		} catch (error) {
			failAgentIdentity(formatErrorMessage(error));
		}
		else if (workspaceDir) identityFromFile = loadAgentIdentity(workspaceDir);
		if (!identityFromFile) failAgentIdentity(`No identity data found in ${shortenHomePath(identityFilePath ?? (workspaceDir ? path.join(workspaceDir, "IDENTITY.md") : "IDENTITY.md"))}.`);
	}
	const fileTheme = identityFromFile?.theme ?? identityFromFile?.creature ?? identityFromFile?.vibe ?? void 0;
	const incomingIdentity = {
		...nameRaw || identityFromFile?.name ? { name: nameRaw ?? identityFromFile?.name } : {},
		...emojiRaw || identityFromFile?.emoji ? { emoji: emojiRaw ?? identityFromFile?.emoji } : {},
		...themeRaw || fileTheme ? { theme: themeRaw ?? fileTheme } : {},
		...avatarRaw || identityFromFile?.avatar ? { avatar: avatarRaw ?? identityFromFile?.avatar } : {}
	};
	const base = index >= 0 ? expectDefined(list[index], "agent config") : { id: resolvedAgentId };
	const nextIdentity = {
		...base.identity,
		...incomingIdentity
	};
	const nextEntry = {
		...base,
		identity: nextIdentity
	};
	const nextList = [...list];
	if (index >= 0) nextList[index] = nextEntry;
	else nextList.push(nextEntry);
	await replaceConfigFile({
		nextConfig: {
			...cfg,
			agents: {
				...cfg.agents,
				entries: Object.fromEntries(nextList.map((entry) => {
					const { id, ...config } = entry;
					return [id, config];
				}))
			}
		},
		...baseHash !== void 0 ? { baseHash } : {}
	});
	if (opts.json) {
		writeRuntimeJson(runtime, {
			agentId,
			identity: nextIdentity,
			workspace: workspaceDir ?? null,
			identityFile: identityFilePath ?? null
		});
		return;
	}
	logConfigUpdated(runtime);
	runtime.log(`Agent: ${sanitizeTerminalText(resolvedAgentId)}`);
	if (nextIdentity.name) runtime.log(`Name: ${sanitizeTerminalText(nextIdentity.name)}`);
	if (nextIdentity.theme) runtime.log(`Theme: ${sanitizeTerminalText(nextIdentity.theme)}`);
	if (nextIdentity.emoji) runtime.log(`Emoji: ${sanitizeTerminalText(nextIdentity.emoji)}`);
	if (nextIdentity.avatar) runtime.log(`Avatar: ${sanitizeTerminalText(nextIdentity.avatar)}`);
	if (workspaceDir) runtime.log(`Workspace: ${sanitizeTerminalText(shortenHomePath(workspaceDir))}`);
}
//#endregion
export { agentsSetIdentityCommand };
