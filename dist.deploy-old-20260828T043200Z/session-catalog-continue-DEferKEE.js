import { s as createSessionCatalogAdoptionCoordinator } from "./session-catalog-DtAkh1F2.js";
import { a as CLAUDE_CLI_DEFAULT_MODEL_REF, t as CLAUDE_CLI_BACKEND_ID } from "./cli-constants-Djv4WtLq.js";
import { a as ClaudeCatalogParamsError, o as isResumableClaudeSource } from "./session-catalog-shared-B8NbCO28.js";
import { n as adoptedSessionKey, r as adoptedSourceKey } from "./session-catalog-adoption-C3d_naEs.js";
import { i as currentHomeDir, s as gatewayClaudeScanOptions } from "./session-catalog-scan-Br4cebMu.js";
import { n as listClaudeSessions } from "./session-catalog-discovery-gyPWzwsY.js";
import { t as importClaudeHistory } from "./session-catalog-history-CyJN5VNC.js";
import { a as readClaudeSessionTranscript, i as readBoundedClaudeHistory, s as resolveNodeClaudeRecord } from "./session-catalog-listing-Ct75brta.js";
import { n as listBoundClaudeSessions, r as resolveClaudeCliRoutedModelId, t as currentClaudeSessionCatalogConfig } from "./session-catalog-runtime-Un7YJwJq.js";
import { n as linkContinued } from "./session-upstream-activity-DGL9sC0g.js";
import fs from "node:fs/promises";
//#region extensions/anthropic/session-catalog-continue.ts
const continueClaudeAdoption = createSessionCatalogAdoptionCoordinator();
async function continueClaudeSession(api, agentId, hostId, threadId, allowProcessHomeFallback) {
	const scanOptions = gatewayClaudeScanOptions(allowProcessHomeFallback);
	const sourceKey = adoptedSourceKey(hostId, threadId);
	const operationKey = `${agentId}\0${sourceKey}`;
	const linkSession = async (sessionKey, history) => await linkContinued({
		sessionKey,
		hostId,
		threadId,
		...history ? { history } : {},
		listLocalSessions: () => listClaudeSessions(currentHomeDir(), scanOptions),
		readRemote: async () => (await readClaudeSessionTranscript({
			runtime: api.runtime,
			hostId,
			threadId,
			limit: 1,
			allowProcessHomeFallback
		})).items
	});
	const existing = listBoundClaudeSessions(api, agentId).get(sourceKey);
	if (existing) return await linkSession(existing);
	let history;
	return await continueClaudeAdoption({
		sourceKey: operationKey,
		findExisting: () => listBoundClaudeSessions(api, agentId).get(sourceKey),
		create: async () => {
			let nodeId;
			let record;
			if (hostId === "gateway:local") {
				record = (await listClaudeSessions(currentHomeDir(), scanOptions)).find((candidate) => candidate.threadId === threadId);
				if (!record || !isResumableClaudeSource(record.source)) throw new ClaudeCatalogParamsError("only local Claude Code sessions can be continued");
			} else if (hostId.startsWith("node:")) {
				nodeId = hostId.slice(5);
				if (!(await api.runtime.nodes.list()).nodes.find((candidate) => candidate.nodeId === nodeId && candidate.connected === true && candidate.commands?.includes("anthropic.claude.sessions.list.v1") && candidate.commands.includes("anthropic.claude.sessions.read.v1") && candidate.commands.includes("agent.cli.claude.run.v1") && candidate.invocableCommands?.includes("anthropic.claude.sessions.list.v1") === true && candidate.invocableCommands.includes("anthropic.claude.sessions.read.v1") && candidate.invocableCommands.includes("agent.cli.claude.run.v1"))) throw new ClaudeCatalogParamsError("paired node does not permit Claude CLI session continuation");
				record = await resolveNodeClaudeRecord({
					runtime: api.runtime,
					nodeId,
					threadId
				});
				if (!record || record.source !== "claude-cli") throw new ClaudeCatalogParamsError("only Claude CLI sessions can be continued");
			} else throw new ClaudeCatalogParamsError("hostId is invalid");
			if (hostId === "gateway:local") {
				if (!(await fs.stat(record.filePath).catch(() => void 0))?.isFile()) throw new ClaudeCatalogParamsError("Claude session transcript is unavailable");
			}
			const loadedHistory = await readBoundedClaudeHistory({
				runtime: api.runtime,
				hostId,
				threadId,
				allowProcessHomeFallback
			});
			history = loadedHistory;
			const config = currentClaudeSessionCatalogConfig(api);
			const adoptingAgentId = agentId;
			const model = resolveClaudeCliRoutedModelId(config, adoptingAgentId) ?? CLAUDE_CLI_DEFAULT_MODEL_REF.slice(`claude-cli/`.length);
			const marker = {
				sourceThreadId: threadId,
				...hostId !== "gateway:local" ? { sourceHostId: hostId } : {}
			};
			return { sessionKey: (await api.runtime.agent.session.createSessionEntry({
				cfg: config,
				key: adoptedSessionKey(hostId, threadId),
				agentId: adoptingAgentId,
				recoverMatchingInitialEntry: true,
				...record.name ? { label: record.name } : {},
				...record.cwd ? { spawnedCwd: record.cwd } : {},
				...nodeId ? {
					execNode: nodeId,
					...record.cwd ? { execCwd: record.cwd } : {}
				} : {},
				initialEntry: {
					cliBackendId: CLAUDE_CLI_BACKEND_ID,
					model,
					modelSelectionLocked: true,
					pluginOwnerId: api.id,
					cliSessionBinding: {
						sessionId: threadId,
						forceReuse: true,
						forkNextResume: true
					},
					pluginExtensions: { anthropic: { sessionCatalog: marker } }
				},
				afterCreate: async (entry) => {
					await importClaudeHistory({
						items: loadedHistory,
						threadId,
						sessionId: entry.sessionId,
						sessionKey: entry.key,
						agentId: entry.agentId,
						storePath: api.runtime.agent.session.resolveStorePath(config.session?.store, { agentId: entry.agentId }),
						...record.cwd ? { cwd: record.cwd } : {},
						config
					});
					return { pluginExtensions: { anthropic: { sessionCatalog: marker } } };
				}
			})).key };
		},
		complete: async (continued) => await linkSession(continued.sessionKey, history)
	});
}
//#endregion
export { continueClaudeSession as t };
