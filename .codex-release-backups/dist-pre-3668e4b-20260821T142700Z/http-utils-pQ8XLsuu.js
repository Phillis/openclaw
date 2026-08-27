import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { t as modelKey } from "./model-key-CMdQNkZf.js";
import "./agent-scope-D9GLFAyB.js";
import { n as normalizeAgentId, t as isValidAgentId } from "./agent-id-Db0rqw_J.js";
import { a as listAgentIds, p as resolveDefaultAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-CsnnOL14.js";
import { a as isSubagentSessionKey, i as isCronSessionKey, n as isAcpSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { a as buildAgentMainSessionKey } from "./session-key-D8GLfPr_.js";
import { r as getRuntimeConfig } from "./io-BTBpQ7uO.js";
import { t as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-CmmO-xmS.js";
import { t as getActivePluginRegistryWorkspaceDirFromState } from "./runtime-state-B4nZOuAi.js";
import { n as parseModelRef } from "./model-selection-normalize-Cvi2hnhD.js";
import { w as resolveDefaultModelForAgent } from "./codex-route-model-ref-WCq2iqcj.js";
import { n as normalizeMessageChannel } from "./message-channel-core-3kHPdlzP.js";
import { t as canonicalizeSessionKeyForAgent } from "./session-store-key-Cc0gbvo8.js";
import { Lt as resolveSessionEntryAccessTarget } from "./session-accessor-CIiPoGwM.js";
import "./message-channel-C3nRvjrX.js";
import { a as isAgentHarnessSessionKey, s as isAgentHarnessSessionStoreEntryProtected } from "./agent-harness-session-key-BpWapmwX.js";
import "./model-selection-BEGvRdL1.js";
import { n as createModelVisibilityPolicy } from "./model-visibility-policy-tlnamKen.js";
import { t as loadGatewayModelCatalog } from "./server-model-catalog-DeT8qSq6.js";
import { l as getHeader } from "./http-auth-utils-DYzr92Xa.js";
import { randomUUID } from "node:crypto";
//#region src/gateway/http-utils.ts
const OPENCLAW_MODEL_ID = "openclaw";
/** Default OpenAI-compatible model alias that targets the default OpenClaw agent. */
const OPENCLAW_DEFAULT_MODEL_ID = "openclaw/default";
var UnknownGatewayAgentError = class extends Error {
	constructor(agentId) {
		super(`Unknown agent '${agentId}'.`);
		this.agentId = agentId;
		this.name = "UnknownGatewayAgentError";
	}
};
var GatewaySessionKeyOverrideError = class extends Error {
	constructor() {
		super("`x-openclaw-session-key` cannot use reserved internal session namespaces.");
		this.name = "GatewaySessionKeyOverrideError";
	}
};
var InvalidGatewayModelError = class extends Error {
	constructor() {
		super("Invalid `model`. Use `openclaw` or `openclaw/<agentId>`.");
		this.name = "InvalidGatewayModelError";
	}
};
function isUnknownGatewayAgentError(err) {
	return err instanceof UnknownGatewayAgentError;
}
function isAgentSelectionRequiredError(err) {
	return err instanceof AgentSelectionRequiredError;
}
function isInvalidGatewayModelError(err) {
	return err instanceof InvalidGatewayModelError;
}
function isGatewaySessionKeyOverrideError(err) {
	return err instanceof GatewaySessionKeyOverrideError;
}
function assertKnownAgentId(agentId, cfg = getRuntimeConfig()) {
	if (!listAgentIds(cfg).includes(agentId)) throw new UnknownGatewayAgentError(agentId);
}
function resolveAgentIdFromHeader(req) {
	const raw = normalizeOptionalString(getHeader(req, "x-openclaw-agent-id")) || normalizeOptionalString(getHeader(req, "x-openclaw-agent")) || "";
	if (!raw) return;
	if (!isValidAgentId(raw)) throw new UnknownGatewayAgentError(raw);
	return normalizeAgentId(raw);
}
/** Resolves the target agent encoded by an OpenAI-compatible model id. */
function resolveAgentIdFromModel(model, cfg = getRuntimeConfig()) {
	const raw = model?.trim();
	if (!raw) return;
	const lowered = normalizeLowercaseStringOrEmpty(raw);
	if (lowered === "openclaw" || lowered === "openclaw/default") return resolveDefaultAgentId(cfg);
	const agentId = (raw.match(/^openclaw[:/](?<agentId>[a-z0-9][a-z0-9_-]{0,63})$/i) ?? raw.match(/^agent:(?<agentId>[a-z0-9][a-z0-9_-]{0,63})$/i))?.groups?.agentId;
	if (!agentId) return;
	return normalizeAgentId(agentId);
}
/** Checks OpenClaw routing-model syntax without resolving fleet ownership. */
function isOpenClawAgentModelId(model) {
	const raw = model?.trim();
	if (!raw) return false;
	const lowered = normalizeLowercaseStringOrEmpty(raw);
	if (lowered === "openclaw" || lowered === "openclaw/default") return true;
	return /^openclaw[:/][a-z0-9][a-z0-9_-]{0,63}$/i.test(raw) || /^agent:[a-z0-9][a-z0-9_-]{0,63}$/i.test(raw);
}
/** Validates and resolves the `x-openclaw-model` override for OpenAI-compatible requests. */
async function resolveOpenAiCompatModelOverride(params) {
	const requestModel = params.model?.trim();
	if (requestModel && !isOpenClawAgentModelId(requestModel)) return { errorMessage: "Invalid `model`. Use `openclaw` or `openclaw/<agentId>`." };
	const raw = getHeader(params.req, "x-openclaw-model")?.trim();
	if (!raw) return {};
	const cfg = getRuntimeConfig();
	const defaultProvider = resolveDefaultModelForAgent({
		cfg,
		agentId: params.agentId
	}).provider;
	const workspaceDir = getActivePluginRegistryWorkspaceDirFromState();
	const modelManifestContext = { manifestPlugins: getCurrentPluginMetadataSnapshot({
		config: cfg,
		env: process.env,
		...workspaceDir ? { workspaceDir } : {}
	})?.plugins };
	const parsed = parseModelRef(raw, defaultProvider, {
		allowManifestNormalization: true,
		allowPluginNormalization: true,
		...modelManifestContext
	});
	if (!parsed) return { errorMessage: "Invalid `x-openclaw-model`." };
	const policy = createModelVisibilityPolicy({
		cfg,
		catalog: await loadGatewayModelCatalog(),
		defaultProvider,
		agentId: params.agentId,
		allowManifestNormalization: true,
		allowPluginNormalization: true,
		...modelManifestContext
	});
	const normalized = modelKey(parsed.provider, parsed.model);
	if (!policy.allowsKey(normalized)) return { errorMessage: `Model '${normalized}' is not allowed for agent '${params.agentId}'.` };
	return { modelOverride: raw };
}
/** Resolves the request agent from headers, model alias, or the configured default. */
function resolveAgentIdForRequest(params) {
	const cfg = getRuntimeConfig();
	if (params.model?.trim() && !isOpenClawAgentModelId(params.model)) throw new InvalidGatewayModelError();
	const fromHeader = resolveAgentIdFromHeader(params.req);
	if (fromHeader) {
		assertKnownAgentId(fromHeader, cfg);
		return fromHeader;
	}
	const fromModel = resolveAgentIdFromModel(params.model, cfg);
	if (fromModel) {
		assertKnownAgentId(fromModel, cfg);
		return fromModel;
	}
	return resolveDefaultAgentId(cfg);
}
function resolveSessionKey(params) {
	const explicit = getHeader(params.req, "x-openclaw-session-key")?.trim();
	if (explicit) {
		if (isReservedSessionKeyOverride(explicit, params.agentId)) throw new GatewaySessionKeyOverrideError();
		return explicit;
	}
	const user = params.user?.trim();
	const mainKey = user ? `${params.prefix}-user:${user}` : `${params.prefix}:${randomUUID()}`;
	return buildAgentMainSessionKey({
		agentId: params.agentId,
		mainKey
	});
}
function isReservedSessionKeyOverride(sessionKey, agentId) {
	const lowered = normalizeLowercaseStringOrEmpty(sessionKey);
	const harnessLookupKey = sessionKey.startsWith("agent:") ? sessionKey : canonicalizeSessionKeyForAgent(agentId, sessionKey);
	const harnessEntry = isAgentHarnessSessionKey(sessionKey) ? resolveSessionEntryAccessTarget({
		cfg: getRuntimeConfig(),
		sessionKey: harnessLookupKey
	}).entry : void 0;
	const harnessKeyReserved = isAgentHarnessSessionKey(sessionKey) && (!harnessEntry || isAgentHarnessSessionStoreEntryProtected(sessionKey, harnessEntry));
	return lowered.startsWith("subagent:") || lowered.startsWith("cron:") || lowered.startsWith("acp:") || harnessKeyReserved || isSubagentSessionKey(sessionKey) || isCronSessionKey(sessionKey) || isAcpSessionKey(sessionKey);
}
/** Resolves gateway agent/session/channel context for OpenAI-compatible handlers. */
function resolveGatewayRequestContext(params) {
	const agentId = resolveAgentIdForRequest({
		req: params.req,
		model: params.model
	});
	return {
		agentId,
		sessionKey: resolveSessionKey({
			req: params.req,
			agentId,
			user: params.user,
			prefix: params.sessionPrefix
		}),
		messageChannel: params.useMessageChannelHeader ? normalizeMessageChannel(getHeader(params.req, "x-openclaw-message-channel")) ?? params.defaultMessageChannel : params.defaultMessageChannel
	};
}
//#endregion
export { isInvalidGatewayModelError as a, resolveAgentIdForRequest as c, resolveOpenAiCompatModelOverride as d, isGatewaySessionKeyOverrideError as i, resolveAgentIdFromModel as l, OPENCLAW_MODEL_ID as n, isOpenClawAgentModelId as o, isAgentSelectionRequiredError as r, isUnknownGatewayAgentError as s, OPENCLAW_DEFAULT_MODEL_ID as t, resolveGatewayRequestContext as u };
