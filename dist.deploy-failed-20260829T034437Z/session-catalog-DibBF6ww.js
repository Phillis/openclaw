import { g as resolveSessionAgentIds } from "./agent-scope-DigoIwHb.js";
import "./agent-runtime-BOXRUj3V.js";
import { r as adoptedSourceKey, t as CLAUDE_LOCAL_SESSION_HOST_ID } from "./session-catalog-adoption-C3d_naEs.js";
import { i as currentHomeDir, r as configuredClaudeConfigDir, s as gatewayClaudeScanOptions } from "./session-catalog-scan-Br4cebMu.js";
import { n as listClaudeSessions } from "./session-catalog-discovery-gyPWzwsY.js";
import "./session-catalog-parsing-B9VGazrM.js";
import { a as terminalEligibility, i as startClaudeCatalogTerminal, n as isClaudeCliAvailable, r as openClaudeCatalogTerminal } from "./session-catalog-terminal-DUM7wJWd.js";
import { a as readClaudeSessionTranscript, n as listClaudeSessionCatalog, s as resolveNodeClaudeRecord, t as assertClaudeLocalAccess } from "./session-catalog-listing-Ct75brta.js";
import { n as listBoundClaudeSessions } from "./session-catalog-runtime-8cXOLMSN.js";
import { t as checkClaudeUpstreamActivity } from "./session-upstream-activity-DGL9sC0g.js";
import { t as continueClaudeSession } from "./session-catalog-continue-C0mVWQk0.js";
//#region extensions/anthropic/session-catalog.ts
function toGenericClaudeItem(item) {
	const type = (/* @__PURE__ */ new Set([
		"userMessage",
		"agentMessage",
		"reasoning",
		"toolCall",
		"toolResult",
		"other"
	])).has(item.type) ? item.type : "other";
	return {
		...item.uuid ? { id: item.uuid } : {},
		type,
		...item.text ? { text: item.text } : {},
		...item.timestamp ? { timestamp: item.timestamp } : {},
		...item.model ? { model: item.model } : {},
		...item.truncated ? { truncated: true } : {},
		...item.content !== void 0 ? { raw: item.content } : {}
	};
}
function toGenericClaudeHost(host, adopted, cliAvailable) {
	return {
		hostId: host.hostId,
		label: host.label,
		kind: host.kind,
		connected: host.connected,
		...host.nodeId ? { nodeId: host.nodeId } : {},
		sessions: host.sessions.map((session) => {
			const terminal = terminalEligibility(host, session.source, cliAvailable);
			const nodeCli = host.kind === "node" && host.canContinueClaude === true && session.source === "claude-cli";
			const existingSessionKey = adopted.get(adoptedSourceKey(host.hostId, session.threadId));
			const continuable = terminal.localResumable || nodeCli || Boolean(existingSessionKey);
			return {
				threadId: session.threadId,
				...session.name ? { name: session.name } : {},
				...session.cwd ? { cwd: session.cwd } : {},
				status: session.status,
				...session.createdAt !== void 0 ? { createdAt: session.createdAt } : {},
				...session.updatedAt !== void 0 ? { updatedAt: session.updatedAt } : {},
				...session.recencyAt != null ? { recencyAt: session.recencyAt } : {},
				source: session.source,
				modelProvider: session.modelProvider,
				...session.cliVersion ? { cliVersion: session.cliVersion } : {},
				...session.gitBranch ? { gitBranch: session.gitBranch } : {},
				...session.customGroup ? { customGroup: session.customGroup } : {},
				...session.pullRequest ? { pullRequest: session.pullRequest } : {},
				archived: session.archived,
				...continuable && existingSessionKey ? { sessionKey: existingSessionKey } : {},
				canContinue: continuable,
				canArchive: false,
				canOpenTerminal: terminal.canOpenTerminal
			};
		}),
		...host.nextCursor ? { nextCursor: host.nextCursor } : {},
		...host.error ? { error: host.error } : {}
	};
}
function createClaudeSessionCatalogRuntime(api) {
	return {
		list: async (query) => {
			const adopted = listBoundClaudeSessions(api, query.agentId, query.sessionEntries);
			const localCliAvailable = isClaudeCliAvailable();
			const { allowProcessHomeFallback, agentId: _agentId, listNodes, onHost, sessionEntries: _sessionEntries, ...gatewayQuery } = query;
			const mapHost = (host) => toGenericClaudeHost(host, adopted, localCliAvailable);
			return (await listClaudeSessionCatalog({
				runtime: api.runtime,
				query: gatewayQuery,
				allowProcessHomeFallback,
				listNodes,
				...onHost ? { onHost: (host) => onHost(mapHost(host)) } : {}
			})).hosts.map(mapHost);
		},
		read: async (request) => {
			const { agentId: _agentId, allowProcessHomeFallback, ...catalogRequest } = request;
			const page = await readClaudeSessionTranscript({
				runtime: api.runtime,
				hostId: catalogRequest.hostId,
				threadId: catalogRequest.threadId,
				cursor: catalogRequest.cursor,
				limit: catalogRequest.limit ?? 20,
				allowProcessHomeFallback
			});
			return {
				...page,
				items: page.items.map(toGenericClaudeItem)
			};
		},
		continueSession: async (request) => {
			assertClaudeLocalAccess(request.hostId, request.allowProcessHomeFallback);
			const agentId = resolveSessionAgentIds({
				config: api.config,
				agentId: request.agentId
			}).sessionAgentId;
			return await continueClaudeSession(api, agentId, request.hostId, request.threadId, request.allowProcessHomeFallback);
		},
		startTerminalSession: async (request) => {
			if (!request.nodeId) assertClaudeLocalAccess(CLAUDE_LOCAL_SESSION_HOST_ID, request.allowProcessHomeFallback);
			return await startClaudeCatalogTerminal(request);
		},
		openTerminal: async (request) => {
			assertClaudeLocalAccess(request.hostId, request.allowProcessHomeFallback);
			return await openClaudeCatalogTerminal({
				api,
				...request,
				listClaudeSessions: () => listClaudeSessions(currentHomeDir(), gatewayClaudeScanOptions(request.allowProcessHomeFallback)),
				resolveNodeClaudeRecord
			});
		},
		checkUpstreamActivity: async (probes, policy) => {
			const localAllowed = policy?.allowProcessHomeFallback !== false || configuredClaudeConfigDir() !== void 0;
			return await checkClaudeUpstreamActivity(probes.filter((probe) => probe.hostId !== "gateway:local" || localAllowed), async (probe) => {
				return (await readClaudeSessionTranscript({
					runtime: api.runtime,
					hostId: probe.hostId,
					threadId: probe.threadId,
					limit: 50,
					allowProcessHomeFallback: policy?.allowProcessHomeFallback
				})).items;
			});
		}
	};
}
//#endregion
export { createClaudeSessionCatalogRuntime as t };
