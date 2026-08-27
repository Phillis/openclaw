import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./src-BkwWvwB2.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import { m as shortenHomePath } from "./utils-DEqefz4f.js";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import "./agent-scope-BizOtGGz.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { a as listAgentIds, d as resolveAgentWorkspaceDir, p as resolveDefaultAgentId, r as listAgentEntries } from "./agent-scope-config-BdXMWufB.js";
import { n as sanitizeTerminalText } from "./safe-text-DbwznzfG.js";
import { t as migratePersistedImplicitMainRoster } from "./legacy.roster-C_J5B3wB.js";
import { r as replaceConfigFile } from "./mutate-xf8UM8H3.js";
import "./config-CW-q_d35.js";
import "./workspace-BV2vwVv3.js";
import { r as loadAgentIdentityFromFile } from "./identity-file-CcXHlpsq.js";
import { r as logConfigUpdated } from "./logging-okmNZCKW.js";
import { i as loadAgentIdentity, r as findAgentEntryIndex } from "./agents.config-Cey2m2IC.js";
import { n as requireValidConfigFileSnapshot } from "./config-validation-Dz7Ic7mK.js";
import path from "node:path";
//#region src/commands/agents.commands.identity.ts
const normalizeWorkspacePath = (input) => path.resolve(resolveUserPath(input));
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
	const agentRaw = normalizeOptionalString(opts.agent);
	const nameRaw = normalizeOptionalString(opts.name);
	const emojiRaw = normalizeOptionalString(opts.emoji);
	const themeRaw = normalizeOptionalString(opts.theme);
	const avatarRaw = normalizeOptionalString(opts.avatar);
	const hasExplicitIdentity = Boolean(nameRaw || emojiRaw || themeRaw || avatarRaw);
	const identityFileRaw = normalizeOptionalString(opts.identityFile);
	const workspaceRaw = normalizeOptionalString(opts.workspace);
	const wantsIdentityFile = Boolean(opts.fromIdentity || identityFileRaw || !hasExplicitIdentity);
	let agentId = agentRaw ? normalizeAgentId(agentRaw) : void 0;
	let identityFilePath;
	let workspaceDir;
	if (identityFileRaw) {
		identityFilePath = normalizeWorkspacePath(identityFileRaw);
		workspaceDir = path.dirname(identityFilePath);
	} else if (workspaceRaw) workspaceDir = normalizeWorkspacePath(workspaceRaw);
	else if (agentId && wantsIdentityFile) workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
	else if (wantsIdentityFile || !agentId) workspaceDir = path.resolve(process.cwd());
	if (!agentId) {
		if (!workspaceDir) {
			runtime.error("Select an agent with --agent or provide a workspace via --workspace.");
			runtime.exit(1);
			return;
		}
		const matches = resolveAgentIdByWorkspace(cfg, workspaceDir);
		if (matches.length === 0) {
			runtime.error(`No agent workspace matches ${shortenHomePath(workspaceDir)}. Pass --agent to target a specific agent.`);
			runtime.exit(1);
			return;
		}
		if (matches.length > 1) {
			runtime.error(`Multiple agents match ${shortenHomePath(workspaceDir)}: ${matches.join(", ")}. Pass --agent to choose one.`);
			runtime.exit(1);
			return;
		}
		agentId = matches[0];
	}
	const resolvedAgentId = expectDefined(agentId, "agent id");
	if (!listAgentIds(cfg).map((id) => normalizeAgentId(id)).includes(resolvedAgentId)) {
		runtime.error(`Agent "${resolvedAgentId}" not found. Create it with \`openclaw agents add\`.`);
		runtime.exit(1);
		return;
	}
	const list = listAgentEntries(cfg);
	const index = findAgentEntryIndex(list, resolvedAgentId);
	let identityFromFile = null;
	if (wantsIdentityFile) {
		if (identityFilePath) try {
			identityFromFile = await loadAgentIdentityFromFile(identityFilePath);
		} catch (error) {
			runtime.error(String(error instanceof Error ? error.message : error));
			runtime.exit(1);
			return;
		}
		else if (workspaceDir) identityFromFile = loadAgentIdentity(workspaceDir);
		if (!identityFromFile) {
			const targetPath = identityFilePath ?? (workspaceDir ? path.join(workspaceDir, "IDENTITY.md") : "IDENTITY.md");
			runtime.error(`No identity data found in ${shortenHomePath(targetPath)}.`);
			runtime.exit(1);
			return;
		}
	}
	const fileTheme = identityFromFile?.theme ?? identityFromFile?.creature ?? identityFromFile?.vibe ?? void 0;
	const incomingIdentity = {
		...nameRaw || identityFromFile?.name ? { name: nameRaw ?? identityFromFile?.name } : {},
		...emojiRaw || identityFromFile?.emoji ? { emoji: emojiRaw ?? identityFromFile?.emoji } : {},
		...themeRaw || fileTheme ? { theme: themeRaw ?? fileTheme } : {},
		...avatarRaw || identityFromFile?.avatar ? { avatar: avatarRaw ?? identityFromFile?.avatar } : {}
	};
	if (!incomingIdentity.name && !incomingIdentity.emoji && !incomingIdentity.theme && !incomingIdentity.avatar) {
		runtime.error("No identity fields provided. Use --name/--emoji/--theme/--avatar or --from-identity.");
		runtime.exit(1);
		return;
	}
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
