import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as isTruthyEnvValue } from "./env-y-_yRnBE.js";
import { u as normalizeStringEntries, v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { v as resolveSecretInputRef } from "./types.secrets-BrIfhxSG.js";
import { i as resolveManifestContractOwnerPluginId } from "./plugin-registry-contributions-Be4pI-82.js";
import "./plugin-registry-BdWRHcWf.js";
import { v as registerAgentRunDelegatedAuthorityClosedHandler } from "./agent-run-registry-cxavoLf6.js";
import "./config-Dl8DJbzM.js";
import { n as resolveSecretRefValue } from "./resolve-DLWDJoF2.js";
import { f as assertExpectedResolvedSecretValue, i as createResolverContext } from "./runtime-shared-D-v-cKxA.js";
import { i as setPathExistingStrict } from "./path-utils-B8kD15O2.js";
import { r as discoverConfigSecretTargetsByIds } from "./target-registry-query-Cu36BxFQ.js";
import "./target-registry-UxdnmGQF.js";
import { i as loadOrCreateProcessDeviceIdentity } from "./device-identity-D1g4SzdB.js";
import { r as roleScopesAllow } from "./operator-scope-compat-C7_b0yme.js";
import { n as channelRouteDedupeKey } from "./channel-route-BRTlwR_x.js";
import { n as normalizeMessageChannel } from "./message-channel-core-BDhVfGhd.js";
import { n as getLoadedChannelPlugin } from "./registry-B3yYjPW1.js";
import { t as resolveChannelApprovalAdapter } from "./plugins-cwOWOggC.js";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-rAbqRXlG.js";
import "./message-channel-T4W5YOto.js";
import { t as formatFencedCodeBlock } from "./markdown-code-Buzx6wvi.js";
import { f as pruneTerminalOperatorApprovals, n as closeOrphanedOperatorApprovals } from "./operator-approval-store-CJ8sgaq3.js";
import { c as buildPluginApprovalExpiredMessage, l as buildPluginApprovalRequestMessage, s as approvalDecisionLabel } from "./plugin-approvals-CmZhR5of.js";
import { t as resolveCanonicalPluginApprovalRequestAllowedDecisions } from "./plugin-approval-canonical-decisions-BXJ-El59.js";
import { j as resolveExecApprovalRequestAllowedDecisions } from "./exec-approvals-DkNiV-ux.js";
import { c as getActiveSecretsRuntimeSnapshotRevisionState, l as getActiveSecretsRuntimeSnapshotState, o as getActiveSecretsRuntimeEnvState } from "./runtime-state-BVazrsUD.js";
import { t as analyzeCommandSecretAssignmentsFromSnapshot } from "./command-config-DMaBQvu8.js";
import { t as resolveRuntimeWebTools } from "./runtime-web-tools-e6EYLp4q.js";
import { t as matchesApprovalRequestFilters } from "./approval-request-filters-_pjvVPDW.js";
import { f as formatExecApprovalExpiresIn } from "./exec-approval-reply-Ch12cMwZ.js";
import { t as createPendingApprovalRegistry } from "./pending-approval-registry-BP7u96lB.js";
import { i as sanitizeExecApprovalWarningText, t as resolveExecApprovalCommandDisplay } from "./exec-approval-command-display-B8xcL7SB.js";
import { a as buildTypedApprovalPendingReplyPayload, i as buildPluginApprovalResolvedReplyPayload, n as buildApprovalResolvedReplyPayload, o as buildTypedPluginApprovalPendingReplyPayload } from "./approval-renderers-BVHpPb5f.js";
import { d as listDevicePairing, l as hasEffectivePairedDeviceRole } from "./device-pairing-CkbDK__R.js";
import { t as diffConfigPaths } from "./config-diff-i67fSCq8.js";
import { t as buildGatewayReloadPlan } from "./config-reload-plan-C2Rvv4LM.js";
import { g as resolveApnsRelayConfigFromEnv, i as clearApnsRegistrationIfCurrent, l as loadApnsRegistrations } from "./push-apns-store-D50lavae.js";
import { t as resolveApprovalSessionAudienceWithFallback } from "./approval-session-audience-CuScZkEh.js";
import { t as SYSTEM_AGENT_APPROVAL_DECISIONS } from "./system-agent-approvals-BczGX_94.js";
import { a as sendApnsPluginApprovalAlert, c as resolveApnsAuthConfigFromEnv, i as sendApnsExecApprovalResolvedWake, o as sendApnsPluginApprovalResolvedWake, r as sendApnsExecApprovalAlert, s as shouldClearStoredApnsRegistration } from "./push-apns-CfGQ7VJu.js";
import { n as ExecApprovalManager } from "./exec-approval-manager-X8B529ao.js";
import { t as QuestionManager } from "./question-manager-DqQa8y-S.js";
import { t as publishAppliedApprovalResolution } from "./approval-publication-C-lLToBi.js";
import { c as isSharedGatewaySessionGenerationOwnershipCurrent, i as disconnectStaleSharedGatewayAuthClients, l as replaceOwnedSharedGatewaySessionGenerationState, n as claimSharedGatewaySessionGenerationIfOwned, o as finalizeOwnedSharedGatewaySessionGeneration, t as captureSharedGatewaySessionGenerationOwnership } from "./server-shared-auth-generation-BKVola-Y.js";
import { randomUUID } from "node:crypto";
//#region src/infra/exec-approval-forwarder.ts
const log = createSubsystemLogger("gateway/exec-approvals");
const DEFAULT_MODE = "session";
const SYNTHETIC_APPROVAL_REQUEST_ID = "__approval-routing__";
const loadExecApprovalForwarderRuntime = createLazyRuntimeModule(() => import("./exec-approval-forwarder.runtime.js"));
function normalizeMode(mode) {
	return mode ?? DEFAULT_MODE;
}
function shouldForwardRoute(params) {
	const config = params.config;
	if (!config?.enabled) return false;
	return matchesApprovalRequestFilters({
		request: params.routeRequest,
		agentFilter: config.agentFilter,
		sessionFilter: config.sessionFilter,
		fallbackAgentIdFromSessionKey: true
	});
}
function buildTargetKey(target) {
	return channelRouteDedupeKey({
		channel: normalizeMessageChannel(target.channel) ?? target.channel,
		to: target.to,
		accountId: target.accountId,
		threadId: target.threadId
	});
}
function buildSyntheticApprovalRequest(routeRequest) {
	return {
		id: SYNTHETIC_APPROVAL_REQUEST_ID,
		request: {
			command: "",
			agentId: routeRequest.agentId ?? null,
			sessionKey: routeRequest.sessionKey ?? null,
			turnSourceChannel: routeRequest.turnSourceChannel ?? null,
			turnSourceTo: routeRequest.turnSourceTo ?? null,
			turnSourceAccountId: routeRequest.turnSourceAccountId ?? null,
			turnSourceThreadId: routeRequest.turnSourceThreadId ?? null
		},
		createdAtMs: 0,
		expiresAtMs: 0
	};
}
function shouldSkipForwardingFallback(params) {
	const channel = normalizeMessageChannel(params.target.channel) ?? params.target.channel;
	if (!channel) return false;
	return resolveChannelApprovalAdapter(getLoadedChannelPlugin(channel))?.delivery?.shouldSuppressForwardingFallback?.({
		cfg: params.cfg,
		approvalKind: params.approvalKind,
		target: params.target,
		request: buildSyntheticApprovalRequest(params.routeRequest)
	}) ?? false;
}
function formatApprovalCommand(command) {
	if (!command.includes("\n") && !command.includes("`")) return {
		inline: true,
		text: `\`${command}\``
	};
	return {
		inline: false,
		text: formatFencedCodeBlock(command)
	};
}
function buildExecApprovalRequestMessage(request, nowMs) {
	const allowedDecisions = resolveExecApprovalRequestAllowedDecisions(request.request);
	const decisionText = allowedDecisions.join("|");
	const lines = ["🔒 Exec approval required", `ID: ${request.id}`];
	const warningText = request.request.warningText?.trim();
	if (warningText) lines.push("", warningText);
	const analysisWarningLines = normalizeStringEntries(request.request.commandAnalysis?.warningLines.map(sanitizeExecApprovalWarningText)).slice(0, 5);
	if (analysisWarningLines && analysisWarningLines.length > 0) {
		lines.push("", "Command analysis:");
		for (const line of analysisWarningLines) lines.push(`- ${line}`);
	}
	const command = formatApprovalCommand(resolveExecApprovalCommandDisplay(request.request).commandText);
	if (command.inline) lines.push(`Command: ${command.text}`);
	else {
		lines.push("Command:");
		lines.push(command.text);
	}
	if (request.request.cwd) lines.push(`CWD: ${request.request.cwd}`);
	if (request.request.nodeId) lines.push(`Node: ${request.request.nodeId}`);
	if (Array.isArray(request.request.envKeys) && request.request.envKeys.length > 0) lines.push(`Env overrides: ${request.request.envKeys.join(", ")}`);
	if (request.request.host) lines.push(`Host: ${request.request.host}`);
	if (request.request.agentId) lines.push(`Agent: ${request.request.agentId}`);
	if (request.request.security) lines.push(`Security: ${request.request.security}`);
	if (request.request.ask) lines.push(`Ask: ${request.request.ask}`);
	lines.push(`Expires in: ${formatExecApprovalExpiresIn(request.expiresAtMs, nowMs)}`);
	lines.push("Mode: foreground (interactive approvals available in this chat).");
	lines.push(allowedDecisions.includes("allow-always") ? "Background mode note: non-interactive runs cannot wait for chat approvals; use pre-approved policy (allow-always or ask=off)." : "Background mode note: non-interactive runs cannot wait for chat approvals; the effective policy still requires per-run approval unless ask=off.");
	lines.push(`Reply with: /approve ${request.id} ${decisionText}`);
	if (!allowedDecisions.includes("allow-always")) lines.push("Allow Always is unavailable for this command.");
	return lines.join("\n");
}
const decisionLabel = approvalDecisionLabel;
function buildResolvedMessage(resolved) {
	return `${`✅ Exec approval ${decisionLabel(resolved.decision)}.`}${resolved.resolvedBy ? ` Resolved by ${resolved.resolvedBy}.` : ""} ID: ${resolved.id}`;
}
function buildExpiredMessage(request) {
	return `⏱️ Exec approval expired. ID: ${request.id}`;
}
function normalizeTurnSourceChannel(value) {
	const normalized = value ? normalizeMessageChannel(value) : void 0;
	if (!normalized || !isDeliverableMessageChannel(normalized) && normalized !== "webchat" && normalized !== "tui") return;
	return normalized;
}
function normalizeForwardingTurnSourceChannel(value, approvalKind) {
	const normalized = normalizeTurnSourceChannel(value);
	if (approvalKind === "exec" && normalized && !isDeliverableMessageChannel(normalized)) return;
	return normalized;
}
function extractApprovalRouteRequest(request) {
	if (!request) return null;
	return {
		agentId: request.agentId ?? null,
		sessionKey: request.sessionKey ?? null,
		turnSourceChannel: request.turnSourceChannel ?? null,
		turnSourceTo: request.turnSourceTo ?? null,
		turnSourceAccountId: request.turnSourceAccountId ?? null,
		turnSourceThreadId: request.turnSourceThreadId ?? null
	};
}
function defaultResolveSessionTarget(params) {
	return loadExecApprovalForwarderRuntime().then(({ resolveExecApprovalSessionTarget }) => {
		const resolvedTarget = resolveExecApprovalSessionTarget({
			cfg: params.cfg,
			request: params.request,
			turnSourceChannel: normalizeTurnSourceChannel(params.request.request.turnSourceChannel),
			turnSourceTo: normalizeOptionalString(params.request.request.turnSourceTo),
			turnSourceAccountId: normalizeOptionalString(params.request.request.turnSourceAccountId),
			turnSourceThreadId: params.request.request.turnSourceThreadId ?? void 0
		});
		if (!resolvedTarget?.channel || !resolvedTarget.to) return null;
		const channel = resolvedTarget.channel;
		if (!isDeliverableMessageChannel(channel)) return null;
		return {
			channel,
			to: resolvedTarget.to,
			accountId: resolvedTarget.accountId,
			threadId: resolvedTarget.threadId
		};
	});
}
async function deliverToTargets(params) {
	const deliveries = params.targets.map(async (target) => {
		if (params.shouldSend && !params.shouldSend()) return;
		const channel = normalizeMessageChannel(target.channel) ?? target.channel;
		if (!isDeliverableMessageChannel(channel)) return;
		try {
			const payload = params.buildPayload(target);
			await params.beforeDeliver?.(target, payload);
			const send = await params.deliver({
				cfg: params.cfg,
				channel,
				to: target.to,
				accountId: target.accountId,
				threadId: target.threadId,
				payloads: [payload]
			});
			if (send.status === "failed" || send.status === "partial_failed") throw send.error;
		} catch (err) {
			log.error(`exec approvals: failed to deliver to ${channel}:${target.to}: ${String(err)}`);
		}
	});
	await Promise.allSettled(deliveries);
}
function buildApprovalRenderPayload(params) {
	const channel = normalizeMessageChannel(params.target.channel) ?? params.target.channel;
	return (channel ? params.resolveRenderer(resolveChannelApprovalAdapter(getLoadedChannelPlugin(channel)))?.(params.renderParams) : null) ?? params.buildFallback();
}
function buildExecPendingPayload(params) {
	return buildApprovalRenderPayload({
		target: params.target,
		renderParams: params,
		resolveRenderer: (adapter) => adapter?.render?.exec?.buildPendingPayload,
		buildFallback: () => buildTypedApprovalPendingReplyPayload({
			approvalKind: "exec",
			approvalId: params.request.id,
			approvalSlug: params.request.id.slice(0, 8),
			text: buildExecApprovalRequestMessage(params.request, params.nowMs),
			agentId: params.request.request.agentId ?? null,
			allowedDecisions: resolveExecApprovalRequestAllowedDecisions(params.request.request),
			sessionKey: params.request.request.sessionKey ?? null
		})
	});
}
function buildExecResolvedPayload(params) {
	return buildApprovalRenderPayload({
		target: params.target,
		renderParams: params,
		resolveRenderer: (adapter) => adapter?.render?.exec?.buildResolvedPayload,
		buildFallback: () => buildApprovalResolvedReplyPayload({
			approvalId: params.resolved.id,
			approvalSlug: params.resolved.id.slice(0, 8),
			text: buildResolvedMessage(params.resolved)
		})
	});
}
function buildPluginPendingPayload(params) {
	return buildApprovalRenderPayload({
		target: params.target,
		renderParams: params,
		resolveRenderer: (adapter) => adapter?.render?.plugin?.buildPendingPayload,
		buildFallback: () => buildTypedPluginApprovalPendingReplyPayload({
			request: params.request,
			nowMs: params.nowMs,
			text: buildPluginApprovalRequestMessage(params.request, params.nowMs),
			allowedDecisions: resolveCanonicalPluginApprovalRequestAllowedDecisions(params.request.request)
		})
	});
}
function buildPluginResolvedPayload(params) {
	return buildApprovalRenderPayload({
		target: params.target,
		renderParams: params,
		resolveRenderer: (adapter) => adapter?.render?.plugin?.buildResolvedPayload,
		buildFallback: () => buildPluginApprovalResolvedReplyPayload({ resolved: params.resolved })
	});
}
async function resolveForwardTargets(params) {
	const mode = normalizeMode(params.config?.mode);
	const targets = [];
	const seen = /* @__PURE__ */ new Set();
	if (mode === "session" || mode === "both") {
		const sessionRouteRequest = {
			...params.routeRequest,
			turnSourceChannel: normalizeForwardingTurnSourceChannel(params.routeRequest.turnSourceChannel, params.approvalKind)
		};
		const sessionTarget = await params.resolveSessionTarget({
			cfg: params.cfg,
			request: buildSyntheticApprovalRequest(sessionRouteRequest)
		});
		if (sessionTarget) {
			const key = buildTargetKey(sessionTarget);
			if (!seen.has(key)) {
				seen.add(key);
				targets.push({
					...sessionTarget,
					source: "session"
				});
			}
		}
	}
	if (mode === "targets" || mode === "both") {
		const explicitTargets = params.config?.targets ?? [];
		for (const target of explicitTargets) {
			const key = buildTargetKey(target);
			if (seen.has(key)) continue;
			seen.add(key);
			targets.push({
				...target,
				source: "target"
			});
		}
	}
	return targets;
}
function createApprovalHandlers(params) {
	const pending = createPendingApprovalRegistry();
	const resolveTargets = async (paramsForRoute) => [...shouldForwardRoute(paramsForRoute) ? await resolveForwardTargets({
		...paramsForRoute,
		approvalKind: params.strategy.kind,
		resolveSessionTarget: params.resolveSessionTarget
	}) : []].filter((target) => !shouldSkipForwardingFallback({
		approvalKind: params.strategy.kind,
		target,
		cfg: paramsForRoute.cfg,
		routeRequest: paramsForRoute.routeRequest
	}));
	const deliverResolved = async (resolved, entry) => {
		const cfg = params.getConfig();
		const routeRequest = entry?.routeRequest ?? params.strategy.getRouteRequestFromResolved(resolved);
		const targets = entry?.targets ?? (routeRequest ? await resolveTargets({
			cfg,
			config: params.strategy.config(cfg),
			routeRequest
		}) : []);
		if (!targets.length) return;
		await deliverToTargets({
			cfg,
			targets,
			buildPayload: (target) => params.strategy.buildResolvedPayload({
				cfg,
				resolved,
				target,
				routeRequest: routeRequest ?? {}
			}),
			deliver: params.deliver
		});
	};
	const handleRequested = async (request) => {
		const cfg = params.getConfig();
		const config = params.strategy.config(cfg);
		const requestId = params.strategy.getRequestId(request);
		const routeRequest = params.strategy.getRouteRequestFromRequest(request);
		const pendingEntry = pending.begin(requestId, {
			routeRequest,
			targets: []
		});
		let filteredTargets;
		try {
			filteredTargets = await resolveTargets({
				cfg,
				config,
				routeRequest
			});
		} catch (error) {
			pending.remove(requestId, pendingEntry);
			throw error;
		}
		if (filteredTargets.length === 0) {
			pending.remove(requestId, pendingEntry);
			return false;
		}
		pendingEntry.value = {
			routeRequest,
			targets: filteredTargets
		};
		const expiresInMs = Math.max(0, params.strategy.getExpiresAtMs(request) - params.nowMs());
		pending.scheduleExpiry(pendingEntry, expiresInMs, (expired) => {
			deliverToTargets({
				cfg,
				targets: expired.value.targets,
				buildPayload: () => ({ text: params.strategy.buildExpiredText(request) }),
				deliver: params.deliver
			}).catch((err) => {
				log.error(`${params.strategy.kind} approvals: failed to deliver expiry notification for ${requestId}: ${String(err)}`);
			});
		});
		deliverToTargets({
			cfg,
			targets: filteredTargets,
			buildPayload: (target) => params.strategy.buildPendingPayload({
				cfg,
				request,
				target,
				routeRequest,
				nowMs: params.nowMs()
			}),
			beforeDeliver: async (target, payload) => {
				const channel = normalizeMessageChannel(target.channel) ?? target.channel;
				if (!channel) return;
				await getLoadedChannelPlugin(channel)?.outbound?.beforeDeliverPayload?.({
					cfg,
					target,
					payload,
					hint: {
						kind: "approval-pending",
						approvalKind: params.strategy.kind
					}
				});
			},
			deliver: params.deliver,
			shouldSend: () => pending.isCurrent(pendingEntry)
		}).then(() => pending.completeDelivery(pendingEntry, pendingEntry.value)).catch((err) => {
			log.error(`${params.strategy.kind} approvals: failed to deliver request ${requestId}: ${String(err)}`);
		});
		return true;
	};
	const handleResolved = async (resolved) => {
		const settled = pending.settle(params.strategy.getResolvedId(resolved), (entry) => deliverResolved(resolved, entry.value));
		if (settled.status === "queued") return;
		if (settled.status === "taken") {
			await settled.terminal(settled.entry);
			return;
		}
		await deliverResolved(resolved);
	};
	return {
		handleRequested,
		handleResolved,
		stop: () => pending.clear()
	};
}
function createApprovalStrategy(params) {
	return {
		kind: params.kind,
		config: params.config,
		getRequestId: (request) => request.id,
		getResolvedId: (resolved) => resolved.id,
		getExpiresAtMs: (request) => request.expiresAtMs,
		getRouteRequestFromRequest: (request) => extractApprovalRouteRequest(request.request) ?? {},
		getRouteRequestFromResolved: (resolved) => extractApprovalRouteRequest(resolved.request),
		buildExpiredText: params.buildExpiredText,
		buildPendingPayload: params.buildPendingPayload,
		buildResolvedPayload: params.buildResolvedPayload
	};
}
const execApprovalStrategy = createApprovalStrategy({
	kind: "exec",
	config: (cfg) => cfg.approvals?.exec,
	buildExpiredText: buildExpiredMessage,
	buildPendingPayload: ({ cfg, request, target, nowMs }) => buildExecPendingPayload({
		cfg,
		request,
		target,
		nowMs
	}),
	buildResolvedPayload: ({ cfg, resolved, target }) => buildExecResolvedPayload({
		cfg,
		resolved,
		target
	})
});
const pluginApprovalStrategy = createApprovalStrategy({
	kind: "plugin",
	config: (cfg) => cfg.approvals?.plugin,
	buildExpiredText: buildPluginApprovalExpiredMessage,
	buildPendingPayload: ({ cfg, request, target, nowMs }) => buildPluginPendingPayload({
		cfg,
		request,
		target,
		nowMs
	}),
	buildResolvedPayload: ({ cfg, resolved, target }) => buildPluginResolvedPayload({
		cfg,
		resolved,
		target
	})
});
function createExecApprovalForwarder(deps = {}) {
	const getConfig = deps.getConfig ?? getRuntimeConfig;
	const deliver = deps.deliver ?? (async (params) => {
		const { sendDurableMessageBatchCore } = await loadExecApprovalForwarderRuntime();
		return sendDurableMessageBatchCore(params);
	});
	const nowMs = deps.nowMs ?? Date.now;
	const resolveSessionTarget = deps.resolveSessionTarget ?? defaultResolveSessionTarget;
	const execHandlers = createApprovalHandlers({
		strategy: execApprovalStrategy,
		getConfig,
		deliver,
		nowMs,
		resolveSessionTarget
	});
	const pluginHandlers = createApprovalHandlers({
		strategy: pluginApprovalStrategy,
		getConfig,
		deliver,
		nowMs,
		resolveSessionTarget
	});
	return {
		handleRequested: execHandlers.handleRequested,
		handleResolved: execHandlers.handleResolved,
		handlePluginApprovalRequested: pluginHandlers.handleRequested,
		handlePluginApprovalResolved: pluginHandlers.handleResolved,
		stop: () => {
			execHandlers.stop();
			pluginHandlers.stop();
		}
	};
}
//#endregion
//#region src/secrets/runtime-command-secrets.ts
/** Resolves command-scoped secrets, including web provider override credentials. */
function hasProviderOverrides(overrides) {
	return normalizeOptionalString(overrides?.webSearch) !== void 0 || normalizeOptionalString(overrides?.webFetch) !== void 0;
}
function applyProviderOverridesToConfig(config, overrides) {
	if (!hasProviderOverrides(overrides)) return config;
	const next = structuredClone(config);
	const tools = next.tools ??= {};
	const web = tools.web ??= {};
	const webSearch = normalizeOptionalString(overrides?.webSearch);
	if (webSearch) {
		const search = web.search ??= {};
		search.provider = webSearch;
	}
	const webFetch = normalizeOptionalString(overrides?.webFetch);
	if (webFetch) {
		const fetch = web.fetch ??= {};
		fetch.provider = webFetch;
	}
	return next;
}
function pluginIdFromRuntimeWebPath(path) {
	return /^plugins\.entries\.([^.]+)\.config\.(webSearch|webFetch)\.apiKey$/.exec(path)?.[1];
}
function isWebCommandSecretPath(path) {
	return /^plugins\.entries\.[^.]+\.config\.(webSearch|webFetch)\.apiKey$/.test(path);
}
function isProviderOverridePath(params) {
	const webSearch = normalizeOptionalString(params.providerOverrides?.webSearch);
	if (webSearch) {
		if (params.config.tools?.web?.search?.enabled === false) return false;
		const pluginId = pluginIdFromRuntimeWebPath(params.path);
		if (pluginId && params.path.endsWith(".config.webSearch.apiKey")) return resolveManifestContractOwnerPluginId({
			contract: "webSearchProviders",
			value: webSearch,
			origin: "bundled",
			config: params.config
		}) === pluginId;
	}
	const webFetch = normalizeOptionalString(params.providerOverrides?.webFetch);
	if (webFetch) {
		if (params.config.tools?.web?.fetch?.enabled === false) return false;
		const pluginId = pluginIdFromRuntimeWebPath(params.path);
		if (pluginId && params.path.endsWith(".config.webFetch.apiKey")) return resolveManifestContractOwnerPluginId({
			contract: "webFetchProviders",
			value: webFetch,
			origin: "bundled",
			config: params.config
		}) === pluginId;
	}
	return false;
}
function restoreInactiveWebCommandSecretTargets(params) {
	if (!hasProviderOverrides(params.providerOverrides)) return params.inactiveRefPaths;
	const inactive = new Set(params.inactiveRefPaths);
	const defaults = params.sourceConfig.secrets?.defaults;
	for (const target of discoverConfigSecretTargetsByIds(params.sourceConfig, params.targetIds)) {
		if (params.allowedPaths && !params.allowedPaths.has(target.path)) continue;
		if (!isWebCommandSecretPath(target.path)) continue;
		const { ref } = resolveSecretInputRef({
			value: target.value,
			refValue: target.refValue,
			defaults
		});
		if (!ref) continue;
		if (params.forcedActivePaths?.has(target.path) || params.optionalActivePaths?.has(target.path)) continue;
		if (isProviderOverridePath({
			config: params.sourceConfig,
			path: target.path,
			providerOverrides: params.providerOverrides
		})) continue;
		inactive.add(target.path);
		setPathExistingStrict(params.resolvedConfig, target.pathSegments, target.value);
	}
	return [...inactive];
}
function filterInactiveRefPaths(params) {
	return params.inactiveRefPaths.filter((path) => {
		if (params.allowedPaths && !params.allowedPaths.has(path)) return false;
		if (params.forcedActivePaths?.has(path) || params.optionalActivePaths?.has(path)) return false;
		if (!hasProviderOverrides(params.providerOverrides)) return true;
		return !isProviderOverridePath({
			config: params.config,
			path,
			providerOverrides: params.providerOverrides
		});
	});
}
async function resolveForcedActiveCommandSecretTargets(params) {
	const activePaths = /* @__PURE__ */ new Set([...params.forcedActivePaths ?? [], ...params.optionalActivePaths ?? []]);
	if (activePaths.size === 0) return;
	const context = createResolverContext({
		sourceConfig: params.sourceConfig,
		env: getActiveSecretsRuntimeEnvState()
	});
	const defaults = params.sourceConfig.secrets?.defaults;
	for (const target of discoverConfigSecretTargetsByIds(params.sourceConfig, params.targetIds)) {
		if (params.allowedPaths && !params.allowedPaths.has(target.path)) continue;
		if (!activePaths.has(target.path)) continue;
		const { ref } = resolveSecretInputRef({
			value: target.value,
			refValue: target.refValue,
			defaults
		});
		if (!ref) continue;
		try {
			const resolved = await resolveSecretRefValue(ref, {
				config: params.sourceConfig,
				env: context.env,
				cache: context.cache
			});
			assertExpectedResolvedSecretValue({
				value: resolved,
				expected: target.entry.expectedResolvedValue,
				errorMessage: target.entry.expectedResolvedValue === "string" ? `${target.path} resolved to a non-string or empty value.` : `${target.path} resolved to an unsupported value type.`
			});
			setPathExistingStrict(params.resolvedConfig, target.pathSegments, resolved);
		} catch {}
	}
}
/**
* Resolves command-scoped SecretRef assignments from the active runtime snapshot.
* Provider overrides are evaluated against cloned snapshot config.
*/
/** Resolves command secret assignments from the active prepared runtime snapshot. */
function resolveCommandSecretsFromActiveRuntimeSnapshot(params) {
	const activeSnapshot = getActiveSecretsRuntimeSnapshotState();
	if (!activeSnapshot) throw new Error("Secrets runtime snapshot is not active.");
	if (params.targetIds.size === 0) return Promise.resolve({
		assignments: [],
		diagnostics: [],
		inactiveRefPaths: []
	});
	return resolveCommandSecretsFromSnapshot({
		activeSnapshot,
		commandName: params.commandName,
		targetIds: params.targetIds,
		allowedPaths: params.allowedPaths,
		forcedActivePaths: params.forcedActivePaths,
		optionalActivePaths: params.optionalActivePaths,
		providerOverrides: params.providerOverrides
	});
}
async function resolveCommandSecretsFromSnapshot(params) {
	const hasOverrides = hasProviderOverrides(params.providerOverrides);
	const sourceConfig = applyProviderOverridesToConfig(params.activeSnapshot.sourceConfig, params.providerOverrides);
	const resolvedConfig = applyProviderOverridesToConfig(params.activeSnapshot.config, params.providerOverrides);
	const context = hasOverrides ? createResolverContext({
		sourceConfig,
		env: getActiveSecretsRuntimeEnvState()
	}) : void 0;
	if (context) await resolveRuntimeWebTools({
		sourceConfig,
		resolvedConfig,
		context
	});
	await resolveForcedActiveCommandSecretTargets({
		sourceConfig,
		resolvedConfig,
		targetIds: params.targetIds,
		allowedPaths: params.allowedPaths,
		forcedActivePaths: params.forcedActivePaths,
		optionalActivePaths: params.optionalActivePaths
	});
	const warningSource = context?.warnings ?? params.activeSnapshot.warnings;
	let inactiveRefPaths = filterInactiveRefPaths({
		config: sourceConfig,
		providerOverrides: params.providerOverrides,
		allowedPaths: params.allowedPaths,
		forcedActivePaths: params.forcedActivePaths,
		optionalActivePaths: params.optionalActivePaths,
		inactiveRefPaths: [...new Set(warningSource.filter((warning) => warning.code === "SECRETS_REF_IGNORED_INACTIVE_SURFACE").map((warning) => warning.path))]
	});
	inactiveRefPaths = restoreInactiveWebCommandSecretTargets({
		sourceConfig,
		resolvedConfig,
		targetIds: params.targetIds,
		inactiveRefPaths,
		providerOverrides: params.providerOverrides,
		allowedPaths: params.allowedPaths,
		forcedActivePaths: params.forcedActivePaths,
		optionalActivePaths: params.optionalActivePaths
	});
	let analyzed = analyzeCommandSecretAssignmentsFromSnapshot({
		sourceConfig,
		resolvedConfig,
		targetIds: params.targetIds,
		inactiveRefPaths: new Set(inactiveRefPaths),
		...params.allowedPaths ? { allowedPaths: params.allowedPaths } : {}
	});
	if (hasOverrides) {
		const impliedInactivePaths = analyzed.unresolved.filter((entry) => isWebCommandSecretPath(entry.path)).filter((entry) => !isProviderOverridePath({
			config: sourceConfig,
			path: entry.path,
			providerOverrides: params.providerOverrides
		})).map((entry) => entry.path);
		if (impliedInactivePaths.length > 0) {
			inactiveRefPaths = uniqueStrings([...inactiveRefPaths, ...impliedInactivePaths]);
			analyzed = analyzeCommandSecretAssignmentsFromSnapshot({
				sourceConfig,
				resolvedConfig,
				targetIds: params.targetIds,
				inactiveRefPaths: new Set(inactiveRefPaths),
				...params.allowedPaths ? { allowedPaths: params.allowedPaths } : {}
			});
		}
	}
	const optionalActiveUnresolvedPaths = analyzed.unresolved.filter((entry) => params.optionalActivePaths?.has(entry.path)).map((entry) => entry.path);
	if (optionalActiveUnresolvedPaths.length > 0) {
		inactiveRefPaths = uniqueStrings([...inactiveRefPaths, ...optionalActiveUnresolvedPaths]);
		analyzed = analyzeCommandSecretAssignmentsFromSnapshot({
			sourceConfig,
			resolvedConfig,
			targetIds: params.targetIds,
			inactiveRefPaths: new Set(inactiveRefPaths),
			...params.allowedPaths ? { allowedPaths: params.allowedPaths } : {}
		});
	}
	return {
		assignments: analyzed.assignments,
		diagnostics: analyzed.diagnostics,
		inactiveRefPaths
	};
}
//#endregion
//#region src/gateway/exec-approval-ios-push.ts
const APPROVALS_SCOPE = "operator.approvals";
const READ_SCOPE = "operator.read";
const OPERATOR_ROLE = "operator";
function isIosPlatform(platform) {
	const normalized = normalizeOptionalLowercaseString(platform) ?? "";
	return normalized.startsWith("ios") || normalized.startsWith("ipados");
}
function resolveActiveOperatorToken(device) {
	const operatorToken = device.tokens?.[OPERATOR_ROLE];
	if (!operatorToken || operatorToken.revokedAtMs) return null;
	return operatorToken;
}
function canReceiveApprovalRequests(device) {
	const operatorToken = resolveActiveOperatorToken(device);
	if (!operatorToken) return false;
	return roleScopesAllow({
		role: OPERATOR_ROLE,
		requestedScopes: [APPROVALS_SCOPE, READ_SCOPE],
		allowedScopes: operatorToken.scopes
	});
}
function shouldTargetDevice(params) {
	if (!isIosPlatform(params.device.platform)) return false;
	if (!hasEffectivePairedDeviceRole(params.device, OPERATOR_ROLE)) return false;
	if (!params.requireApprovalScope) return true;
	return canReceiveApprovalRequests(params.device);
}
async function loadRegisteredTargets(params) {
	if (params.deviceIds.length === 0) return [];
	return await loadApnsRegistrations(params.deviceIds);
}
async function resolvePairedTargets(params) {
	return await loadRegisteredTargets({ deviceIds: (await listDevicePairing()).paired.filter((device) => {
		if (!shouldTargetDevice({
			device,
			requireApprovalScope: params.requireApprovalScope
		})) return false;
		const operatorToken = resolveActiveOperatorToken(device);
		if (params.isTargetVisible && !params.isTargetVisible({
			deviceId: device.deviceId,
			scopes: operatorToken?.scopes ?? []
		})) return false;
		return true;
	}).map((device) => device.deviceId) });
}
async function resolveDeliveryPlan(params) {
	const targets = params.explicitNodeIds?.length ? await loadRegisteredTargets({ deviceIds: params.explicitNodeIds }) : await resolvePairedTargets({
		requireApprovalScope: params.requireApprovalScope,
		isTargetVisible: params.isTargetVisible
	});
	if (targets.length === 0) return { targets: [] };
	const needsDirect = targets.some((target) => target.registration.transport === "direct");
	const needsRelay = targets.some((target) => target.registration.transport === "relay");
	let directAuth;
	if (needsDirect) {
		const auth = await resolveApnsAuthConfigFromEnv(process.env);
		if (auth.ok) directAuth = auth.value;
		else params.log.warn?.(`${params.approvalKind} approvals: iOS direct APNs auth unavailable: ${auth.error}`);
	}
	const relayConfigByNodeId = /* @__PURE__ */ new Map();
	if (needsRelay) for (const target of targets) {
		if (target.registration.transport !== "relay") continue;
		const relay = resolveApnsRelayConfigFromEnv(process.env, getRuntimeConfig().gateway, { registrationRelayOrigin: target.registration.relayOrigin });
		if (relay.ok) relayConfigByNodeId.set(target.nodeId, relay.value);
		else params.log.warn?.(`${params.approvalKind} approvals: iOS relay APNs config unavailable: ${relay.error}`);
	}
	const relayConfig = relayConfigByNodeId.values().next().value;
	return {
		targets: targets.filter((target) => target.registration.transport === "direct" ? Boolean(directAuth) : relayConfigByNodeId.has(target.nodeId) && relayConfigByNodeId.get(target.nodeId)?.baseUrl === relayConfig?.baseUrl),
		directAuth,
		relayConfig
	};
}
async function clearStaleApnsRegistrationIfNeeded(params) {
	if (shouldClearStoredApnsRegistration({
		registration: params.registration,
		result: params.result
	})) await clearApnsRegistrationIfCurrent({
		nodeId: params.nodeId,
		registration: params.registration
	});
}
async function sendRequestedPushes(params) {
	const gatewayDeviceId = loadOrCreateProcessDeviceIdentity().deviceId;
	return await sendApprovalPushes({
		approvalId: params.request.id,
		plan: params.plan,
		log: params.log,
		approvalKind: params.driver.approvalKind,
		label: "request",
		logThrown: true,
		send: async ({ target, plan }) => await params.driver.sendRequested({
			request: params.request,
			target,
			plan,
			gatewayDeviceId
		})
	});
}
async function sendApprovalPushes(params) {
	const results = await Promise.allSettled(params.plan.targets.map(async (target) => {
		const result = await params.send({
			target,
			approvalId: params.approvalId,
			plan: params.plan
		});
		await clearStaleApnsRegistrationIfNeeded({
			nodeId: target.nodeId,
			registration: target.registration,
			result
		});
		if (!result.ok) params.log.warn?.(`${params.approvalKind} approvals: iOS ${params.label} push failed node=${target.nodeId} status=${result.status} reason=${result.reason ?? "unknown"}`);
		return {
			nodeId: target.nodeId,
			ok: result.ok
		};
	}));
	for (const result of results) if (params.logThrown && result.status === "rejected") {
		const message = formatErrorMessage(result.reason);
		params.log.warn?.(`${params.approvalKind} approvals: iOS ${params.label} push threw error: ${message}`);
	}
	return {
		attempted: params.plan.targets.length,
		delivered: results.filter((result) => result.status === "fulfilled" && result.value.ok).length
	};
}
async function sendResolvedPushes(params) {
	const gatewayDeviceId = loadOrCreateProcessDeviceIdentity().deviceId;
	await sendApprovalPushes({
		approvalId: params.approvalId,
		plan: params.plan,
		log: params.log,
		approvalKind: params.driver.approvalKind,
		label: "cleanup",
		logThrown: false,
		send: async ({ target, approvalId, plan }) => await params.driver.sendResolved({
			approvalId,
			target,
			plan,
			gatewayDeviceId
		})
	});
}
function createApprovalIosPushDelivery(params) {
	const approvalDeliveriesById = /* @__PURE__ */ new Map();
	const pendingDeliveryStateById = /* @__PURE__ */ new Map();
	const sendCleanupPushForApproval = async (approvalId) => {
		const deliveryState = approvalDeliveriesById.get(approvalId) ?? await pendingDeliveryStateById.get(approvalId);
		approvalDeliveriesById.delete(approvalId);
		pendingDeliveryStateById.delete(approvalId);
		if (!deliveryState?.nodeIds.length) {
			params.log.debug?.(`${params.driver.approvalKind} approvals: iOS cleanup push skipped approvalId=${approvalId} reason=missing-targets`);
			return;
		}
		await deliveryState.requestPushPromise;
		const plan = await resolveDeliveryPlan({
			approvalKind: params.driver.approvalKind,
			requireApprovalScope: false,
			explicitNodeIds: deliveryState.nodeIds,
			log: params.log
		});
		if (plan.targets.length === 0) return;
		await sendResolvedPushes({
			approvalId,
			plan,
			log: params.log,
			driver: params.driver
		});
	};
	return {
		/** Sends the initial approval notification to visible iOS operator devices. */
		async handleRequested(request, opts) {
			const deliveryStatePromise = (async () => {
				const plan = await resolveDeliveryPlan({
					approvalKind: params.driver.approvalKind,
					requireApprovalScope: true,
					isTargetVisible: opts?.isTargetVisible,
					log: params.log
				});
				if (plan.targets.length === 0) {
					approvalDeliveriesById.delete(request.id);
					return null;
				}
				const deliveryState = {
					nodeIds: plan.targets.map((target) => target.nodeId),
					requestPushPromise: sendRequestedPushes({
						request,
						plan,
						log: params.log,
						driver: params.driver
					}).catch((err) => {
						const message = formatErrorMessage(err);
						params.log.error?.(`${params.driver.approvalKind} approvals: iOS request push failed: ${message}`);
						return {
							attempted: plan.targets.length,
							delivered: 0
						};
					})
				};
				approvalDeliveriesById.set(request.id, deliveryState);
				return deliveryState;
			})();
			pendingDeliveryStateById.set(request.id, deliveryStatePromise);
			const deliveryState = await deliveryStatePromise;
			if (pendingDeliveryStateById.get(request.id) === deliveryStatePromise) pendingDeliveryStateById.delete(request.id);
			if (!deliveryState) return false;
			const { attempted, delivered } = await deliveryState.requestPushPromise;
			if (attempted > 0 && delivered === 0) {
				params.log.warn?.(`${params.driver.approvalKind} approvals: iOS request push reached no devices approvalId=${request.id} attempted=${attempted}`);
				if (approvalDeliveriesById.get(request.id)?.requestPushPromise === deliveryState.requestPushPromise) approvalDeliveriesById.delete(request.id);
				return false;
			}
			return true;
		},
		/** Sends cleanup wakes for resolved approval requests. */
		async handleResolved(resolved) {
			await sendCleanupPushForApproval(resolved.id);
		},
		/** Sends cleanup wakes for expired approval requests. */
		async handleExpired(request) {
			await sendCleanupPushForApproval(request.id);
		}
	};
}
/** Creates iOS push delivery for exec approval requests. */
function createExecApprovalIosPushDelivery(params) {
	return createApprovalIosPushDelivery({
		log: params.log,
		driver: {
			approvalKind: "exec",
			sendRequested: async ({ request, target, plan, gatewayDeviceId }) => target.registration.transport === "direct" ? await sendApnsExecApprovalAlert({
				registration: target.registration,
				nodeId: target.nodeId,
				approvalId: request.id,
				gatewayDeviceId,
				auth: plan.directAuth
			}) : await sendApnsExecApprovalAlert({
				registration: target.registration,
				nodeId: target.nodeId,
				approvalId: request.id,
				gatewayDeviceId,
				relayConfig: plan.relayConfig
			}),
			sendResolved: async ({ approvalId, target, plan, gatewayDeviceId }) => target.registration.transport === "direct" ? await sendApnsExecApprovalResolvedWake({
				registration: target.registration,
				nodeId: target.nodeId,
				approvalId,
				gatewayDeviceId,
				auth: plan.directAuth
			}) : await sendApnsExecApprovalResolvedWake({
				registration: target.registration,
				nodeId: target.nodeId,
				approvalId,
				gatewayDeviceId,
				relayConfig: plan.relayConfig
			})
		}
	});
}
/** Creates iOS push delivery for plugin approval requests. */
function createPluginApprovalIosPushDelivery(params) {
	return createApprovalIosPushDelivery({
		log: params.log,
		driver: {
			approvalKind: "plugin",
			sendRequested: async ({ request, target, plan, gatewayDeviceId }) => target.registration.transport === "direct" ? await sendApnsPluginApprovalAlert({
				registration: target.registration,
				nodeId: target.nodeId,
				approvalId: request.id,
				gatewayDeviceId,
				title: request.request.title,
				description: request.request.description,
				auth: plan.directAuth
			}) : await sendApnsPluginApprovalAlert({
				registration: target.registration,
				nodeId: target.nodeId,
				approvalId: request.id,
				gatewayDeviceId,
				title: request.request.title,
				description: request.request.description,
				relayConfig: plan.relayConfig
			}),
			sendResolved: async ({ approvalId, target, plan, gatewayDeviceId }) => target.registration.transport === "direct" ? await sendApnsPluginApprovalResolvedWake({
				registration: target.registration,
				nodeId: target.nodeId,
				approvalId,
				gatewayDeviceId,
				auth: plan.directAuth
			}) : await sendApnsPluginApprovalResolvedWake({
				registration: target.registration,
				nodeId: target.nodeId,
				approvalId,
				gatewayDeviceId,
				relayConfig: plan.relayConfig
			})
		}
	});
}
//#endregion
//#region src/gateway/lazy-handler.ts
function createLazyHandler(method, loadHandlers) {
	return async (opts) => {
		const handler = (await loadHandlers())[method];
		if (!handler) throw new Error(`lazy gateway handler not found: ${method}`);
		await handler(opts);
	};
}
//#endregion
//#region src/gateway/server-methods/approval-run-cancellation.ts
function cancelMatchingApprovals(params) {
	let cancelled = 0;
	for (const pending of params.manager.listPendingRecords()) {
		if (!params.matches(pending)) continue;
		const result = params.manager.forceDenyDetailed(pending.id, "run-aborted", {
			kind: "system",
			id: null
		}, "cancelled");
		if (result.outcome === "denied" && result.liveRecord) {
			cancelled += 1;
			params.publish(result.record, result.liveRecord);
		}
	}
	return cancelled;
}
function cancelAgentRuntimeBoundApprovals(params) {
	return cancelMatchingApprovals({
		manager: params.manager,
		publish: params.publish,
		matches: (pending) => {
			const bound = pending.agentRuntimeDelegatedAuthority;
			return bound?.claimId === params.authority.claimId && bound.lifecycleGeneration === params.authority.lifecycleGeneration && bound.operationalRunInstance.instanceId === params.authority.operationalRunInstance.instanceId && bound.operationalRunInstance.runId === params.authority.operationalRunInstance.runId;
		}
	});
}
function sameWorkerTurnClaim(left, right) {
	return left.sessionId === right.sessionId && left.claimId === right.claimId && left.runId === right.runId && left.placementGeneration === right.placementGeneration && left.owner.kind === "worker" && right.owner.kind === "worker" && left.owner.environmentId === right.owner.environmentId && left.owner.ownerEpoch === right.owner.ownerEpoch;
}
/** Settles approvals whose authoritative worker turn claim has been fenced. */
function cancelWorkerTurnClaimBoundApprovals(params) {
	return cancelMatchingApprovals({
		manager: params.manager,
		publish: params.publish,
		matches: (pending) => {
			const authority = pending.agentRuntimeDelegatedAuthority;
			return authority?.kind === "worker" && sameWorkerTurnClaim(authority.turnClaim, params.claim);
		}
	});
}
/** Preserves legacy run-id abort cleanup only for records without delegated authority. */
function cancelUnboundRunApprovals(params) {
	return cancelMatchingApprovals({
		manager: params.manager,
		publish: params.publish,
		matches: (pending) => !pending.agentRuntimeDelegatedAuthority && pending.request.runId === params.runId
	});
}
//#endregion
//#region src/gateway/server-aux-handlers.ts
async function activateSecretsRuntimeSnapshotIfCurrent(snapshot, expectedRevision, options) {
	const runtime = await import("./runtime-Cf16aD5W.js");
	if (options?.canActivate && !options.canActivate()) return null;
	if (!runtime.activateSecretsRuntimeSnapshotIfCurrent(snapshot, expectedRevision)) return null;
	options?.onActivated?.();
	return runtime.getActiveSecretsRuntimeSnapshotRevision();
}
async function restoreSecretsRuntimeSnapshotIfCurrent(snapshot, expectedRevision, ownedSnapshot, options) {
	const runtime = await import("./runtime-Cf16aD5W.js");
	if (!runtime.restoreSecretsRuntimeSnapshotIfCurrent(snapshot, expectedRevision, ownedSnapshot)) return null;
	options?.onActivated?.();
	return runtime.getActiveSecretsRuntimeSnapshotRevision();
}
/** Create auxiliary gateway handlers that are not part of the core descriptor set. */
function createGatewayAuxHandlers(params) {
	const approvalPersistence = { runtimeEpoch: randomUUID() };
	const approvalStartupNowMs = Date.now();
	closeOrphanedOperatorApprovals({
		runtimeEpoch: approvalPersistence.runtimeEpoch,
		nowMs: approvalStartupNowMs
	});
	pruneTerminalOperatorApprovals({ nowMs: approvalStartupNowMs });
	const createApprovalManager = (approvalKind, resolveAllowedDecisions) => new ExecApprovalManager({
		approvalKind,
		persistence: approvalPersistence,
		resolveAudienceSessionKeys: resolveApprovalSessionAudienceWithFallback,
		resolveAllowedDecisions,
		onLifecycle: params.onApprovalLifecycle,
		...params.validateAgentRuntimeDelegatedAuthority ? { validateAgentRuntimeDelegatedAuthority: params.validateAgentRuntimeDelegatedAuthority } : {},
		onError: (error, context) => params.log.error?.(`${context.approvalKind} approval ${context.operation} failed for ${context.approvalId}: ${String(error)}`)
	});
	const execApprovalManager = createApprovalManager("exec", resolveExecApprovalRequestAllowedDecisions);
	const execApprovalForwarder = createExecApprovalForwarder();
	const execApprovalIosPushDelivery = createExecApprovalIosPushDelivery({ log: params.log });
	const loadExecApprovalHandlers = createLazyPromise(() => import("./exec-approval-BAgaIAq0.js").then(({ createExecApprovalHandlers }) => createExecApprovalHandlers(execApprovalManager, {
		forwarder: execApprovalForwarder,
		iosPushDelivery: execApprovalIosPushDelivery
	})), { cacheRejections: true });
	const questionManager = new QuestionManager();
	const loadQuestionHandlers = createLazyPromise(() => import("./question-BUrs7Qa2.js").then(({ createQuestionHandlers }) => createQuestionHandlers(questionManager)), { cacheRejections: true });
	const buildReloadPlan = params.buildReloadPlan ?? buildGatewayReloadPlan;
	const pluginApprovalManager = createApprovalManager("plugin", resolveCanonicalPluginApprovalRequestAllowedDecisions);
	const pluginApprovalIosPushDelivery = createPluginApprovalIosPushDelivery({ log: params.log });
	let approvalPublicationContext;
	const pendingAuthorityPublications = [];
	const publishAuthorityClosure = (publication) => {
		const context = approvalPublicationContext;
		if (!context) {
			pendingAuthorityPublications.push(publication);
			return;
		}
		publishAppliedApprovalResolution({
			record: publication.record,
			liveRecord: publication.liveRecord,
			context,
			forwarder: execApprovalForwarder,
			...publication.kind === "exec" ? { iosPushDelivery: execApprovalIosPushDelivery } : { pluginIosPushDelivery: pluginApprovalIosPushDelivery }
		}).catch((error) => {
			context.logGateway?.error?.(`${publication.kind} approvals: authority-close publication failed: ${String(error)}`);
		});
	};
	const bindApprovalPublicationContext = (context) => {
		approvalPublicationContext = context;
		for (const publication of pendingAuthorityPublications.splice(0)) publishAuthorityClosure(publication);
	};
	const unregisterApprovalAuthorityClosedObserver = registerAgentRunDelegatedAuthorityClosedHandler((authority) => {
		try {
			cancelAgentRuntimeBoundApprovals({
				authority,
				manager: execApprovalManager,
				publish: (record, liveRecord) => publishAuthorityClosure({
					kind: "exec",
					record,
					liveRecord
				})
			});
		} catch (error) {
			params.log.error?.(`exec approvals: authority-close settlement failed: ${String(error)}`);
		}
		try {
			cancelAgentRuntimeBoundApprovals({
				authority,
				manager: pluginApprovalManager,
				publish: (record, liveRecord) => publishAuthorityClosure({
					kind: "plugin",
					record,
					liveRecord
				})
			});
		} catch (error) {
			params.log.error?.(`plugin approvals: authority-close settlement failed: ${String(error)}`);
		}
		params.onAgentRunAuthorityClosed?.(authority);
	});
	const unregisterWorkerTurnClaimClosedObserver = params.registerWorkerTurnClaimClosedHandler?.((claim) => {
		try {
			cancelWorkerTurnClaimBoundApprovals({
				claim,
				manager: execApprovalManager,
				publish: (record, liveRecord) => publishAuthorityClosure({
					kind: "exec",
					record,
					liveRecord
				})
			});
		} catch (error) {
			params.log.error?.(`exec approvals: worker-claim settlement failed: ${String(error)}`);
		}
		try {
			cancelWorkerTurnClaimBoundApprovals({
				claim,
				manager: pluginApprovalManager,
				publish: (record, liveRecord) => publishAuthorityClosure({
					kind: "plugin",
					record,
					liveRecord
				})
			});
		} catch (error) {
			params.log.error?.(`plugin approvals: worker-claim settlement failed: ${String(error)}`);
		}
	});
	const unregisterApprovalAuthorityObserver = () => {
		unregisterWorkerTurnClaimClosedObserver?.();
		unregisterApprovalAuthorityClosedObserver();
	};
	const cancelRunBoundApprovals = (runId, context) => {
		const publish = (kind, record, liveRecord) => {
			publishAppliedApprovalResolution({
				record,
				liveRecord,
				context,
				forwarder: execApprovalForwarder,
				...kind === "exec" ? { iosPushDelivery: execApprovalIosPushDelivery } : { pluginIosPushDelivery: pluginApprovalIosPushDelivery }
			}).catch((error) => {
				context.logGateway?.error?.(`${kind} approvals: run-abort publication failed: ${String(error)}`);
			});
		};
		return cancelUnboundRunApprovals({
			runId,
			manager: execApprovalManager,
			publish: (record, liveRecord) => publish("exec", record, liveRecord)
		});
	};
	const systemAgentApprovalManager = createApprovalManager("system-agent", () => SYSTEM_AGENT_APPROVAL_DECISIONS);
	const loadPluginApprovalHandlers = createLazyPromise(() => import("./plugin-approval-2Q5IEVEn.js").then(({ createPluginApprovalHandlers }) => createPluginApprovalHandlers(pluginApprovalManager, {
		forwarder: execApprovalForwarder,
		iosPushDelivery: pluginApprovalIosPushDelivery
	})), { cacheRejections: true });
	const loadApprovalHandlers = createLazyPromise(() => import("./approval-Byi3rfgq.js").then(({ createApprovalHandlers }) => createApprovalHandlers({
		execApprovalManager,
		pluginApprovalManager,
		systemAgentApprovalManager,
		forwarder: execApprovalForwarder,
		iosPushDelivery: execApprovalIosPushDelivery,
		pluginIosPushDelivery: pluginApprovalIosPushDelivery
	})), { cacheRejections: true });
	let reloadInFlight = null;
	const runExclusiveReload = (fn, options = {}) => {
		if (reloadInFlight) {
			if (options.joinInFlight !== false) return reloadInFlight;
			return reloadInFlight.catch(() => void 0).then(() => runExclusiveReload(fn, options));
		}
		const run = (async () => {
			try {
				return await fn();
			} finally {
				reloadInFlight = null;
			}
		})();
		reloadInFlight = run;
		return run;
	};
	const loadSecretsHandlers = createLazyPromise(() => import("./secrets-Cr8XUkud.js").then(({ createSecretsHandlers }) => createSecretsHandlers({
		reloadSecrets: (reloadOptions) => runExclusiveReload(async () => {
			let transaction;
			const stoppedChannels = [];
			const restartedChannels = /* @__PURE__ */ new Set();
			try {
				for (;;) {
					const previousSnapshot = getActiveSecretsRuntimeSnapshotState();
					if (!previousSnapshot) throw new Error("Secrets runtime snapshot is not active.");
					const previousSnapshotRevision = getActiveSecretsRuntimeSnapshotRevisionState();
					const previousGenerationOwnership = captureSharedGatewaySessionGenerationOwnership(params.sharedGatewaySessionGenerationState);
					const previousSharedGatewaySessionGeneration = previousGenerationOwnership.generation;
					const previousSharedGatewaySessionGenerationRequired = params.sharedGatewaySessionGenerationState.required;
					const prepared = await params.activateRuntimeSecrets(previousSnapshot.sourceConfig, {
						reason: "reload",
						activate: false,
						publishFailureAsDegraded: true,
						forceColdRefKeys: reloadOptions?.forceColdRefKeys,
						canPublishFailureAsDegraded: () => getActiveSecretsRuntimeSnapshotRevisionState() === previousSnapshotRevision
					});
					const plan = buildReloadPlan(diffConfigPaths(previousSnapshot.config, prepared.config));
					const nextSharedGatewaySessionGeneration = params.resolveSharedGatewaySessionGenerationForConfig(prepared.config);
					let publishedSnapshotRevision = null;
					let generationOwnership = null;
					const activateIfCurrent = params.activateRuntimeSecrets.activatePreparedSnapshotIfCurrent;
					if (activateIfCurrent) {
						if (!await activateIfCurrent(prepared, previousSnapshotRevision, {
							reason: "reload",
							activate: true
						}, async () => {
							publishedSnapshotRevision = getActiveSecretsRuntimeSnapshotRevisionState();
							generationOwnership = claimSharedGatewaySessionGenerationIfOwned(params.sharedGatewaySessionGenerationState, previousGenerationOwnership, nextSharedGatewaySessionGeneration);
						}, () => isSharedGatewaySessionGenerationOwnershipCurrent(params.sharedGatewaySessionGenerationState, previousGenerationOwnership))) continue;
					} else {
						publishedSnapshotRevision = await activateSecretsRuntimeSnapshotIfCurrent(prepared, previousSnapshotRevision, {
							canActivate: () => isSharedGatewaySessionGenerationOwnershipCurrent(params.sharedGatewaySessionGenerationState, previousGenerationOwnership),
							onActivated: () => {
								generationOwnership = claimSharedGatewaySessionGenerationIfOwned(params.sharedGatewaySessionGenerationState, previousGenerationOwnership, nextSharedGatewaySessionGeneration);
							}
						});
						if (publishedSnapshotRevision === null) continue;
					}
					if (publishedSnapshotRevision === null || generationOwnership === null) throw new Error("Secrets runtime activation did not publish ownership.");
					transaction = {
						previousSnapshot,
						previousSharedGatewaySessionGeneration,
						previousSharedGatewaySessionGenerationRequired,
						prepared,
						plan,
						nextSharedGatewaySessionGeneration,
						sharedGatewaySessionGenerationChanged: previousSharedGatewaySessionGeneration !== nextSharedGatewaySessionGeneration,
						generationOwnership,
						publishedSnapshotRevision
					};
					if (!isSharedGatewaySessionGenerationOwnershipCurrent(params.sharedGatewaySessionGenerationState, generationOwnership)) throw new Error("secrets.reload was superseded by a newer config write");
					break;
				}
				const { prepared, plan, generationOwnership, nextSharedGatewaySessionGeneration, sharedGatewaySessionGenerationChanged } = transaction;
				if (sharedGatewaySessionGenerationChanged) disconnectStaleSharedGatewayAuthClients({
					clients: params.clients,
					expectedGeneration: nextSharedGatewaySessionGeneration
				});
				const channelsToRestart = /* @__PURE__ */ new Set([...plan.restartChannels, ...plan.restartChannelAccounts?.keys() ?? []]);
				if (channelsToRestart.size > 0) {
					const restartChannels = [...channelsToRestart];
					if (isTruthyEnvValue(process.env.OPENCLAW_SKIP_CHANNELS) || isTruthyEnvValue(process.env.OPENCLAW_SKIP_PROVIDERS)) throw new Error(`secrets.reload requires restarting channels: ${restartChannels.join(", ")}`);
					if (params.getChannelAutostartSuppression?.()) throw new Error(`secrets.reload requires restarting channels but channel autostart is suppressed by crash-loop breaker: ${restartChannels.join(", ")}`);
					const restartFailures = [];
					for (const channel of restartChannels) {
						if (!isSharedGatewaySessionGenerationOwnershipCurrent(params.sharedGatewaySessionGenerationState, generationOwnership)) throw new Error("secrets.reload was superseded by a newer config write");
						params.logChannels.info(`restarting ${channel} channel after secrets reload`);
						stoppedChannels.push(channel);
						try {
							await params.stopChannel(channel);
							if (!isSharedGatewaySessionGenerationOwnershipCurrent(params.sharedGatewaySessionGenerationState, generationOwnership)) throw new Error("secrets.reload was superseded by a newer config write");
							await params.startChannel(channel);
							restartedChannels.add(channel);
							if (!isSharedGatewaySessionGenerationOwnershipCurrent(params.sharedGatewaySessionGenerationState, generationOwnership)) throw new Error("secrets.reload was superseded by a newer config write");
						} catch {
							params.logChannels.info(`failed to restart ${channel} channel after secrets reload`);
							restartFailures.push(channel);
						}
					}
					if (restartFailures.length > 0) throw new Error(`failed to restart channels after secrets reload: ${restartFailures.join(", ")}`);
				}
				if (!finalizeOwnedSharedGatewaySessionGeneration(params.sharedGatewaySessionGenerationState, generationOwnership)) throw new Error("secrets.reload was superseded by a newer config write");
				return { warningCount: prepared.warnings.length };
			} catch (err) {
				let generationRestored = false;
				if (transaction) {
					const failedTransaction = transaction;
					await restoreSecretsRuntimeSnapshotIfCurrent(failedTransaction.previousSnapshot, failedTransaction.publishedSnapshotRevision, failedTransaction.prepared, { onActivated: () => {
						generationRestored = replaceOwnedSharedGatewaySessionGenerationState(params.sharedGatewaySessionGenerationState, failedTransaction.generationOwnership, {
							current: failedTransaction.previousSharedGatewaySessionGeneration,
							required: failedTransaction.previousSharedGatewaySessionGenerationRequired
						});
					} });
				}
				if (generationRestored && transaction) {
					if (transaction.sharedGatewaySessionGenerationChanged) disconnectStaleSharedGatewayAuthClients({
						clients: params.clients,
						expectedGeneration: transaction.previousSharedGatewaySessionGeneration
					});
				}
				for (const channel of stoppedChannels) {
					params.logChannels.info(`rolling back ${channel} channel after secrets reload failure`);
					try {
						if (restartedChannels.has(channel)) await params.stopChannel(channel);
						await params.startChannel(channel);
					} catch {
						params.logChannels.info(`failed to roll back ${channel} channel after secrets reload`);
					}
				}
				throw err;
			}
		}, reloadOptions),
		log: params.log,
		resolveSecrets: async ({ allowedPaths, commandName, forcedActivePaths, optionalActivePaths, providerOverrides, targetIds }) => {
			const { assignments, diagnostics, inactiveRefPaths } = await resolveCommandSecretsFromActiveRuntimeSnapshot({
				commandName,
				targetIds: new Set(targetIds),
				...allowedPaths ? { allowedPaths: new Set(allowedPaths) } : {},
				...forcedActivePaths ? { forcedActivePaths: new Set(forcedActivePaths) } : {},
				...optionalActivePaths ? { optionalActivePaths: new Set(optionalActivePaths) } : {},
				...providerOverrides ? { providerOverrides } : {}
			});
			if (assignments.length === 0) return {
				assignments: [],
				diagnostics,
				inactiveRefPaths
			};
			return {
				assignments,
				diagnostics,
				inactiveRefPaths
			};
		}
	})), { cacheRejections: true });
	return {
		execApprovalManager,
		cancelRunBoundApprovals,
		forwardPluginApprovalRequest: execApprovalForwarder.handlePluginApprovalRequested,
		pluginApprovalIosPushDelivery,
		pluginApprovalManager,
		systemAgentApprovalManager,
		bindApprovalPublicationContext,
		unregisterApprovalAuthorityObserver,
		questionManager,
		extraHandlers: {
			"exec.approval.get": createLazyHandler("exec.approval.get", loadExecApprovalHandlers),
			"exec.approval.list": createLazyHandler("exec.approval.list", loadExecApprovalHandlers),
			"exec.approval.request": createLazyHandler("exec.approval.request", loadExecApprovalHandlers),
			"exec.approval.waitDecision": createLazyHandler("exec.approval.waitDecision", loadExecApprovalHandlers),
			"exec.approval.resolve": createLazyHandler("exec.approval.resolve", loadExecApprovalHandlers),
			"plugin.approval.list": createLazyHandler("plugin.approval.list", loadPluginApprovalHandlers),
			"plugin.approval.request": createLazyHandler("plugin.approval.request", loadPluginApprovalHandlers),
			"plugin.approval.waitDecision": createLazyHandler("plugin.approval.waitDecision", loadPluginApprovalHandlers),
			"plugin.approval.resolve": createLazyHandler("plugin.approval.resolve", loadPluginApprovalHandlers),
			"approval.get": createLazyHandler("approval.get", loadApprovalHandlers),
			"approval.history": createLazyHandler("approval.history", loadApprovalHandlers),
			"approval.resolve": createLazyHandler("approval.resolve", loadApprovalHandlers),
			"question.request": createLazyHandler("question.request", loadQuestionHandlers),
			"question.waitAnswer": createLazyHandler("question.waitAnswer", loadQuestionHandlers),
			"question.resolve": createLazyHandler("question.resolve", loadQuestionHandlers),
			"question.get": createLazyHandler("question.get", loadQuestionHandlers),
			"question.list": createLazyHandler("question.list", loadQuestionHandlers),
			"secrets.reload": createLazyHandler("secrets.reload", loadSecretsHandlers),
			"secrets.resolve": createLazyHandler("secrets.resolve", loadSecretsHandlers),
			"secrets.store.list": createLazyHandler("secrets.store.list", loadSecretsHandlers),
			"secrets.store.set": createLazyHandler("secrets.store.set", loadSecretsHandlers),
			"secrets.store.delete": createLazyHandler("secrets.store.delete", loadSecretsHandlers)
		}
	};
}
//#endregion
export { createGatewayAuxHandlers };
