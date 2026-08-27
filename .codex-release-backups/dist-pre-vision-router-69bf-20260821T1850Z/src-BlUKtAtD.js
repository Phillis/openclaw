import { t as closedObject } from "./closed-object-DY9fiMP-.js";
import { a as NonEmptyString, i as InputProvenanceSchema, n as GatewayClientIdSchema, o as SecretInputSchema, r as GatewayClientModeSchema, s as SessionLabelString, t as ChatSendSessionKeyString } from "./primitives-BSb7UY-n.js";
import { E as WorkerLiveEventParamsSchema, F as WorkerSessionsSpawnParamsSchema, N as WorkerSessionsSendParamsSchema, at as withSince, b as WorkerConnectRequestFrameSchema, it as FailoverReasonSchema, v as WorkerAdmissionHandshakeSchema, x as WorkerHeartbeatParamsSchema, z as WorkerTranscriptCommitParamsSchema } from "./worker-admission-R0mXKdG7.js";
import { n as MAX_TERMINAL_UPLOAD_BYTES, t as MAX_TERMINAL_UPLOAD_BASE64_LENGTH } from "./terminal-constants-0UMJMHnf.js";
import { t as APPROVAL_ID_WELL_FORMED_UNICODE_PATTERN } from "./approval-id-BTRnO3t1.js";
import { t as CHAT_HISTORY_MAX_ENTRIES } from "./chat-history-constants-C2lazUOH.js";
import { a as UsersListParamsSchema, d as UsersSelfParamsSchema, f as UsersSelfResultSchema, g as UsersSetDisplayNameResultSchema, h as UsersSetDisplayNameParamsSchema, i as UsersLinkEmailResultSchema, l as UsersPrefsSetParamsSchema, m as UsersSetAvatarResultSchema, p as UsersSetAvatarParamsSchema, r as UsersLinkEmailParamsSchema, s as UsersPrefsGetParamsSchema } from "./users-Bz4Tf7LO.js";
import { Compile } from "typebox/compile";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/clawhub-trust-error-details.ts
/** Structured ClawHub trust details carried in gateway error payloads. */
const ClawHubTrustErrorCodes = {
	SECURITY_UNAVAILABLE: "clawhub_security_unavailable",
	RISK_ACKNOWLEDGEMENT_REQUIRED: "clawhub_risk_acknowledgement_required",
	DOWNLOAD_BLOCKED: "clawhub_download_blocked"
};
function normalizeNonEmptyString(value) {
	return typeof value === "string" && value.trim().length > 0 ? value : void 0;
}
function isClawHubTrustErrorCode(value) {
	return value === ClawHubTrustErrorCodes.SECURITY_UNAVAILABLE || value === ClawHubTrustErrorCodes.RISK_ACKNOWLEDGEMENT_REQUIRED || value === ClawHubTrustErrorCodes.DOWNLOAD_BLOCKED;
}
function buildClawHubTrustErrorDetails(params) {
	if (!params.code && !params.version && !params.warning) return;
	return {
		...params.code ? { clawhubTrustCode: params.code } : {},
		...params.version ? { version: params.version } : {},
		...params.warning ? { warning: params.warning } : {}
	};
}
function readClawHubTrustErrorDetails(details) {
	if (!details || typeof details !== "object" || Array.isArray(details)) return;
	const raw = details;
	const code = isClawHubTrustErrorCode(raw.clawhubTrustCode) ? raw.clawhubTrustCode : void 0;
	const version = normalizeNonEmptyString(raw.version);
	const warning = normalizeNonEmptyString(raw.warning);
	if (!code && !version && !warning) return;
	return {
		...code ? { clawhubTrustCode: code } : {},
		...version ? { version } : {},
		...warning ? { warning } : {}
	};
}
//#endregion
//#region packages/gateway-protocol/src/system-agent-error-details.ts
/** Structured system-agent details carried in gateway error payloads. */
const SystemAgentErrorDetailCodes = {
	INFERENCE_UNAVAILABLE: "system_agent_inference_unavailable",
	SESSION_INVALIDATED: "system_agent_session_invalidated"
};
function buildSystemAgentInferenceUnavailableErrorDetails() {
	return { code: SystemAgentErrorDetailCodes.INFERENCE_UNAVAILABLE };
}
function buildSystemAgentSessionInvalidatedErrorDetails() {
	return { code: SystemAgentErrorDetailCodes.SESSION_INVALIDATED };
}
function readSystemAgentInferenceUnavailableErrorDetails(details) {
	if (!details || typeof details !== "object" || Array.isArray(details)) return;
	const code = details.code;
	return code === SystemAgentErrorDetailCodes.INFERENCE_UNAVAILABLE ? { code } : void 0;
}
function readSystemAgentSessionInvalidatedErrorDetails(details) {
	if (!details || typeof details !== "object" || Array.isArray(details)) return;
	const code = details.code;
	return code === SystemAgentErrorDetailCodes.SESSION_INVALIDATED ? { code } : void 0;
}
//#endregion
//#region packages/gateway-protocol/src/session-agent-status.ts
const SESSION_AGENT_ATTENTION_ICON_IDS = [
	"hand",
	"key",
	"alert",
	"flag",
	"lock",
	"hourglass"
];
//#endregion
//#region packages/gateway-protocol/src/protocol-validator.ts
/* @__NO_SIDE_EFFECTS__ */
function lazyCompile(schema, precheck) {
	let compiled;
	let errors = null;
	const getCompiled = () => {
		compiled ??= Compile(schema);
		return compiled;
	};
	const validate = ((data) => {
		const precheckError = precheck?.(data);
		if (precheckError) {
			errors = [precheckError];
			return false;
		}
		const current = getCompiled();
		const valid = current.Check(data);
		errors = valid ? null : [...current.Errors(data)];
		return valid;
	});
	Object.defineProperties(validate, {
		errors: {
			configurable: true,
			enumerable: true,
			get: () => errors,
			set: (nextErrors) => {
				errors = nextErrors ?? null;
			}
		},
		schema: {
			configurable: true,
			enumerable: true,
			get: () => schema
		}
	});
	return validate;
}
//#endregion
//#region packages/gateway-protocol/src/schema/plugins.ts
/**
* Plugin control-surface protocol schemas.
*
* These payloads let the gateway expose plugin-provided UI actions without
* baking plugin-specific payload shapes into the core protocol.
*/
/** Arbitrary plugin-owned JSON payload carried opaquely through the gateway. */
const PluginJsonValueSchema = Type.Unknown();
/** Descriptor for one plugin-provided control UI action or surface. */
const PluginControlUiDescriptorSchema = closedObject({
	id: NonEmptyString,
	pluginId: NonEmptyString,
	pluginName: Type.Optional(NonEmptyString),
	surface: Type.Union([
		Type.Literal("session"),
		Type.Literal("tool"),
		Type.Literal("run"),
		Type.Literal("settings"),
		Type.Literal("tab"),
		Type.Literal("widget")
	]),
	label: NonEmptyString,
	description: Type.Optional(Type.String()),
	placement: Type.Optional(Type.String()),
	schema: Type.Optional(PluginJsonValueSchema),
	requiredScopes: Type.Optional(Type.Array(NonEmptyString))
});
/** Empty request payload for listing plugin UI descriptors. */
const PluginsUiDescriptorsParamsSchema = closedObject({});
/** Response payload containing all plugin UI descriptors visible to the client. */
const PluginsUiDescriptorsResultSchema = closedObject({
	ok: Type.Literal(true),
	descriptors: Type.Array(PluginControlUiDescriptorSchema)
});
/** Request payload for invoking one plugin-owned session action. */
const PluginsSessionActionParamsSchema = closedObject({
	pluginId: NonEmptyString,
	actionId: NonEmptyString,
	sessionKey: Type.Optional(NonEmptyString),
	agentId: Type.Optional(NonEmptyString),
	payload: Type.Optional(PluginJsonValueSchema)
});
/** Successful plugin action result, optionally continuing the agent turn. */
const PluginsSessionActionSuccessResultSchema = closedObject({
	ok: Type.Literal(true),
	result: Type.Optional(PluginJsonValueSchema),
	continueAgent: Type.Optional(Type.Boolean()),
	reply: Type.Optional(PluginJsonValueSchema)
});
/** Failed plugin action result with plugin-owned detail payload. */
const PluginsSessionActionFailureResultSchema = closedObject({
	ok: Type.Literal(false),
	error: Type.String(),
	code: Type.Optional(Type.String()),
	details: Type.Optional(PluginJsonValueSchema)
});
/** Discriminated plugin action result returned to gateway clients. */
const PluginsSessionActionResultSchema = Type.Union([PluginsSessionActionSuccessResultSchema, PluginsSessionActionFailureResultSchema]);
/** ClawHub-backed install action for one catalog entry. */
const PluginCatalogClawHubInstallSchema = closedObject({
	source: Type.Literal("clawhub"),
	packageName: NonEmptyString
});
/** Official-catalog install action for one catalog entry. */
const PluginCatalogOfficialInstallSchema = closedObject({
	source: Type.Literal("official"),
	pluginId: NonEmptyString
});
const PluginCatalogInstallActionSchema = Type.Union([PluginCatalogClawHubInstallSchema, PluginCatalogOfficialInstallSchema]);
/** Cold control-plane representation of an installed or available plugin. */
const PluginCatalogEntrySchema = closedObject({
	id: NonEmptyString,
	name: NonEmptyString,
	packageName: Type.Optional(NonEmptyString),
	description: Type.Optional(Type.String()),
	version: Type.Optional(NonEmptyString),
	kind: Type.Optional(Type.Array(NonEmptyString)),
	origin: Type.Optional(NonEmptyString),
	installed: Type.Boolean(),
	enabled: Type.Boolean(),
	state: Type.Union([
		Type.Literal("enabled"),
		Type.Literal("disabled"),
		Type.Literal("not-installed"),
		Type.Literal("error")
	]),
	featured: Type.Optional(Type.Boolean()),
	featuredAt: Type.Optional(Type.Integer({ minimum: 0 })),
	order: Type.Optional(Type.Number()),
	/** True when the gateway can resolve a manifest or catalog icon for this plugin identity. */
	hasIcon: Type.Optional(Type.Boolean()),
	install: Type.Optional(PluginCatalogInstallActionSchema),
	error: Type.Optional(Type.String()),
	/** Coarse manifest-derived grouping (channel, provider, memory, ...) for catalog UIs. */
	category: Type.Optional(NonEmptyString),
	/** True when the plugin has an install record and can be removed via plugins.uninstall. */
	removable: Type.Optional(Type.Boolean())
});
/** Empty request payload for the cold plugin catalog. */
const PluginsListParamsSchema = closedObject({});
/** Installed and curated plugin catalog visible to the current gateway client. */
const PluginsListResultSchema = closedObject({
	plugins: Type.Array(PluginCatalogEntrySchema),
	diagnostics: Type.Array(Type.Unknown()),
	mutationAllowed: Type.Boolean()
});
/** Request payload for searching installable ClawHub plugin families. */
const PluginsSearchParamsSchema = closedObject({
	query: NonEmptyString,
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 100
	}))
});
/** ClawHub package fields exposed by plugin search. */
const PluginSearchPackageSchema = closedObject({
	name: NonEmptyString,
	displayName: NonEmptyString,
	family: Type.Union([Type.Literal("code-plugin"), Type.Literal("bundle-plugin")]),
	channel: Type.Union([
		Type.Literal("official"),
		Type.Literal("community"),
		Type.Literal("private")
	]),
	isOfficial: Type.Boolean(),
	summary: Type.Optional(Type.String()),
	latestVersion: Type.Optional(NonEmptyString),
	runtimeId: Type.Optional(NonEmptyString),
	downloads: Type.Optional(Type.Number({ minimum: 0 })),
	verificationTier: Type.Optional(NonEmptyString)
});
/** Ranked ClawHub plugin search hit. */
const PluginSearchResultEntrySchema = closedObject({
	score: Type.Number(),
	package: PluginSearchPackageSchema
});
/** Ranked installable plugin packages matching the query. */
const PluginsSearchResultSchema = closedObject({ results: Type.Array(PluginSearchResultEntrySchema) });
/** Trusted official-catalog or acknowledged ClawHub install request. */
const PluginsInstallParamsSchema = Type.Union([closedObject({
	source: Type.Literal("clawhub"),
	packageName: NonEmptyString,
	version: Type.Optional(NonEmptyString),
	acknowledgeClawHubRisk: Type.Optional(Type.Boolean())
}), closedObject({
	source: Type.Literal("official"),
	pluginId: NonEmptyString
})]);
/** Successful plugin installation result. */
const PluginsInstallResultSchema = closedObject({
	ok: Type.Literal(true),
	plugin: PluginCatalogEntrySchema,
	restartRequired: Type.Literal(true),
	warnings: Type.Optional(Type.Array(Type.String()))
});
/** Internal signal that persisted plugin metadata changed outside the Gateway process. */
const PluginsRefreshParamsSchema = closedObject({});
/** Successful plugin metadata refresh admission. */
const PluginsRefreshResultSchema = closedObject({ ok: Type.Literal(true) });
/** Request payload for removing one installed plugin and its managed files. */
const PluginsUninstallParamsSchema = closedObject({ pluginId: NonEmptyString });
/** Successful plugin removal result listing the cleanup actions that ran. */
const PluginsUninstallResultSchema = closedObject({
	ok: Type.Literal(true),
	pluginId: NonEmptyString,
	restartRequired: Type.Literal(true),
	removed: Type.Array(Type.String()),
	warnings: Type.Optional(Type.Array(Type.String()))
});
/** Request payload for changing one installed plugin's policy state. */
const PluginsSetEnabledParamsSchema = closedObject({
	pluginId: NonEmptyString,
	enabled: Type.Boolean()
});
/** Successful plugin enablement policy update. */
const PluginsSetEnabledResultSchema = closedObject({
	ok: Type.Literal(true),
	plugin: PluginCatalogEntrySchema,
	restartRequired: Type.Boolean(),
	warnings: Type.Optional(Type.Array(Type.String()))
});
//#endregion
//#region packages/gateway-protocol/src/schema/session-classification.ts
/**
* Stable, non-sensitive classification for a session row.
*
* The taxonomy remains open so newer Gateways can add classifications without
* making otherwise compatible older clients reject the row.
*/
const SessionClassificationSchema = NonEmptyString;
/** Non-sensitive peer category derived from the session route, when known. */
const SessionPeerKindSchema = NonEmptyString;
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-sharing-values.ts
const SessionVisibilitySchema = Type.Union([
	Type.Literal("shared"),
	Type.Literal("read-only"),
	Type.Literal("suggest"),
	Type.Literal("draft")
]);
const SessionSharingRoleSchema = Type.Union([
	Type.Literal("admin"),
	Type.Literal("owner"),
	Type.Literal("member"),
	Type.Literal("viewer")
]);
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-row.ts
const SessionToolOverridesSchema = closedObject({
	mcpServers: Type.Optional(Type.Record(Type.String({ minLength: 1 }), Type.Boolean())),
	mcpToolsDeny: Type.Optional(Type.Record(Type.String({ minLength: 1 }), Type.Array(NonEmptyString))),
	skills: Type.Optional(Type.Record(Type.String({ minLength: 1 }), Type.Boolean())),
	webSearch: Type.Optional(Type.Boolean())
});
/** Projected actor that caused a session node to be created. */
const SessionCreatedActorSchema = closedObject({
	type: Type.Union([
		Type.Literal("human"),
		Type.Literal("agent"),
		Type.Literal("system")
	]),
	id: Type.Optional(NonEmptyString),
	label: Type.Optional(NonEmptyString),
	/** Durable profile avatar route; absent for actors without a stored profile avatar. */
	avatarUrl: Type.Optional(NonEmptyString)
});
/** Stable Gateway session row fields; mutation envelopes may add null tombstones. */
const SessionRowSchema = Type.Object({
	key: Type.String(),
	sessionId: Type.Optional(Type.String()),
	incognito: Type.Optional(Type.Literal(true)),
	kind: Type.Union([
		Type.Literal("direct"),
		Type.Literal("group"),
		Type.Literal("global"),
		Type.Literal("unknown")
	]),
	label: Type.Optional(Type.String()),
	boardFace: Type.Optional(Type.Union([Type.Literal("chat"), Type.Literal("dashboard")])),
	displayName: Type.Optional(Type.String()),
	derivedTitle: Type.Optional(Type.String()),
	lastMessagePreview: Type.Optional(Type.String()),
	channel: Type.Optional(Type.String()),
	/** Stable non-sensitive facts derived from the canonical session route. */
	classification: Type.Optional(SessionClassificationSchema),
	agentId: Type.Optional(NonEmptyString),
	accountId: Type.Optional(NonEmptyString),
	peerKind: Type.Optional(SessionPeerKindSchema),
	isMain: Type.Optional(Type.Boolean()),
	isBackground: Type.Optional(Type.Boolean()),
	chatType: Type.Optional(Type.Union([
		Type.Literal("direct"),
		Type.Literal("group"),
		Type.Literal("channel")
	])),
	updatedAt: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
	archived: Type.Optional(Type.Boolean()),
	archivedAt: Type.Optional(Type.Number()),
	archivedBy: Type.Optional(SessionCreatedActorSchema),
	pinned: Type.Optional(Type.Boolean()),
	pinnedAt: Type.Optional(Type.Number()),
	unread: Type.Optional(Type.Boolean()),
	lastReadAt: Type.Optional(Type.Number()),
	lastActivityAt: Type.Optional(Type.Number()),
	lastInteractionAt: Type.Optional(Type.Number()),
	status: Type.Optional(Type.Union([
		Type.Literal("running"),
		Type.Literal("done"),
		Type.Literal("failed"),
		Type.Literal("killed"),
		Type.Literal("timeout")
	])),
	lastRunError: Type.Optional(Type.String()),
	restartRecoveryStatus: Type.Optional(Type.Literal("tombstoned")),
	activeLeafEntryId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	spawnedBy: Type.Optional(Type.String()),
	parentSessionKey: Type.Optional(Type.String()),
	controlOwnerSessionKey: Type.Optional(Type.String()),
	childSessions: Type.Optional(Type.Array(Type.String())),
	forkedFromParent: Type.Optional(Type.Boolean()),
	spawnDepth: Type.Optional(Type.Number()),
	subagentRole: Type.Optional(Type.Union([Type.Literal("orchestrator"), Type.Literal("leaf")])),
	subagentControlScope: Type.Optional(Type.Union([Type.Literal("children"), Type.Literal("none")])),
	swarmGroupId: Type.Optional(Type.String()),
	worktree: Type.Optional(Type.Object({
		id: Type.String(),
		branch: Type.String(),
		repoRoot: Type.String()
	})),
	execNode: Type.Optional(Type.String()),
	execCwd: Type.Optional(Type.String()),
	spawnedWorkspaceDir: Type.Optional(Type.String()),
	spawnedCwd: Type.Optional(Type.String()),
	createdVia: Type.Optional(Type.Union([
		Type.Literal("operator"),
		Type.Literal("spawn"),
		Type.Literal("channel"),
		Type.Literal("cron"),
		Type.Literal("talk"),
		Type.Literal("run"),
		Type.Literal("plugin"),
		Type.Literal("internal")
	])),
	createdActor: Type.Optional(SessionCreatedActorSchema),
	visibility: Type.Optional(SessionVisibilitySchema),
	sharingRole: Type.Optional(SessionSharingRoleSchema),
	createdAt: Type.Optional(Type.Number()),
	forkSource: Type.Optional(Type.Object({
		sessionKey: Type.String(),
		sessionId: Type.String(),
		entryId: Type.Optional(Type.String())
	})),
	previousSessionId: Type.Optional(Type.String()),
	inputTokens: Type.Optional(Type.Number()),
	outputTokens: Type.Optional(Type.Number()),
	totalTokens: Type.Optional(Type.Number()),
	totalTokensFresh: Type.Optional(Type.Boolean()),
	contextTokens: Type.Optional(Type.Number()),
	estimatedCostUsd: Type.Optional(Type.Number()),
	model: Type.Optional(Type.String()),
	modelProvider: Type.Optional(Type.String()),
	toolOverrides: Type.Optional(SessionToolOverridesSchema)
}, { additionalProperties: true });
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-catalog.ts
const SessionCatalogErrorSchema = closedObject({
	code: NonEmptyString,
	message: NonEmptyString
});
const SessionCatalogLocatorSchema = closedObject({
	catalogId: NonEmptyString,
	hostId: NonEmptyString,
	threadId: NonEmptyString
});
const SessionCatalogCapabilitiesSchema = closedObject({
	continueSession: Type.Boolean(),
	archive: Type.Boolean(),
	createSession: Type.Optional(closedObject({
		model: NonEmptyString,
		startTerminal: Type.Optional(Type.Boolean())
	})),
	openTerminal: Type.Optional(Type.Boolean())
});
const SessionCatalogDescriptorSchema = closedObject({
	id: NonEmptyString,
	label: NonEmptyString,
	capabilities: SessionCatalogCapabilitiesSchema
});
const SessionCatalogPullRequestSummarySchema = closedObject({
	numbers: Type.Array(Type.Integer({ minimum: 1 }), {
		minItems: 1,
		maxItems: 20,
		uniqueItems: true
	}),
	state: Type.Union([
		Type.Literal("open"),
		Type.Literal("draft"),
		Type.Literal("merged"),
		Type.Literal("closed")
	])
});
const SessionCatalogSessionSchema = closedObject({
	threadId: NonEmptyString,
	name: Type.Optional(Type.String()),
	cwd: Type.Optional(Type.String()),
	status: NonEmptyString,
	createdAt: Type.Optional(Type.Number()),
	updatedAt: Type.Optional(Type.Number()),
	recencyAt: Type.Optional(Type.Number()),
	source: Type.Optional(Type.String()),
	modelProvider: Type.Optional(Type.String()),
	cliVersion: Type.Optional(Type.String()),
	gitBranch: Type.Optional(Type.String()),
	customGroup: Type.Optional(Type.String()),
	pullRequest: Type.Optional(SessionCatalogPullRequestSummarySchema),
	archived: Type.Boolean(),
	sessionKey: Type.Optional(NonEmptyString),
	createdActor: Type.Optional(SessionCreatedActorSchema),
	canContinue: Type.Boolean(),
	canArchive: Type.Boolean(),
	canOpenTerminal: Type.Optional(Type.Boolean())
});
const SessionCatalogHostSchema = closedObject({
	hostId: NonEmptyString,
	label: NonEmptyString,
	kind: Type.Union([Type.Literal("gateway"), Type.Literal("node")]),
	connected: Type.Boolean(),
	nodeId: Type.Optional(NonEmptyString),
	sessions: Type.Array(SessionCatalogSessionSchema),
	nextCursor: Type.Optional(Type.String()),
	error: Type.Optional(SessionCatalogErrorSchema)
});
const SessionCatalogSchema = closedObject({
	id: NonEmptyString,
	label: NonEmptyString,
	capabilities: SessionCatalogCapabilitiesSchema,
	hosts: Type.Array(SessionCatalogHostSchema),
	error: Type.Optional(SessionCatalogErrorSchema)
});
const SessionsCatalogListCommonProperties = {
	agentId: Type.Optional(NonEmptyString),
	progressId: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 128
	})),
	search: Type.Optional(Type.String()),
	limitPerHost: Type.Optional(Type.Integer({ minimum: 1 })),
	hostIds: Type.Optional(Type.Array(NonEmptyString))
};
const SessionsCatalogListParamsSchema = closedObject({
	catalogId: Type.Optional(NonEmptyString),
	cursors: Type.Optional(Type.Record(NonEmptyString, Type.String())),
	...SessionsCatalogListCommonProperties
});
const SessionsCatalogListResultSchema = closedObject({ catalogs: Type.Array(SessionCatalogSchema) });
const SessionsCatalogHostEventCatalogSchema = closedObject({
	...SessionCatalogSchema.properties,
	hosts: Type.Array(SessionCatalogHostSchema, {
		minItems: 1,
		maxItems: 1
	})
});
const SessionsCatalogHostEventSchema = closedObject({
	progressId: Type.String({
		minLength: 1,
		maxLength: 128
	}),
	agentId: NonEmptyString,
	catalog: SessionsCatalogHostEventCatalogSchema
});
const SessionCatalogTranscriptItemSchema = closedObject({
	id: Type.Optional(Type.String()),
	type: Type.Union([
		Type.Literal("userMessage"),
		Type.Literal("agentMessage"),
		Type.Literal("reasoning"),
		Type.Literal("toolCall"),
		Type.Literal("toolResult"),
		Type.Literal("other")
	]),
	text: Type.Optional(Type.String()),
	timestamp: Type.Optional(Type.String()),
	model: Type.Optional(Type.String()),
	truncated: Type.Optional(Type.Boolean()),
	raw: Type.Optional(PluginJsonValueSchema)
});
const SessionsCatalogReadParamsSchema = closedObject({
	...SessionCatalogLocatorSchema.properties,
	limit: Type.Optional(Type.Integer({ minimum: 1 })),
	cursor: Type.Optional(Type.String())
});
const SessionsCatalogReadResultSchema = closedObject({
	hostId: NonEmptyString,
	label: Type.Optional(Type.String()),
	threadId: NonEmptyString,
	items: Type.Array(SessionCatalogTranscriptItemSchema),
	nextCursor: Type.Optional(Type.String())
});
const SessionsCatalogContinueParamsSchema = closedObject({ ...SessionCatalogLocatorSchema.properties });
const SessionsCatalogContinueResultSchema = closedObject({ sessionKey: NonEmptyString });
const SessionsCatalogArchiveParamsSchema = closedObject({
	...SessionCatalogLocatorSchema.properties,
	confirmNoOtherRunner: Type.Literal(true)
});
const SessionsCatalogArchiveResultSchema = closedObject({ ok: Type.Literal(true) });
const SessionsCatalogStartTerminalParamsSchema = closedObject({
	catalogId: NonEmptyString,
	hostId: Type.Optional(NonEmptyString),
	agentId: NonEmptyString,
	cwd: NonEmptyString,
	initialMessage: Type.Optional(Type.String())
});
const SessionsCatalogStartTerminalResultSchema = closedObject({
	sessionId: NonEmptyString,
	agentId: NonEmptyString,
	shell: NonEmptyString,
	cwd: NonEmptyString,
	confined: Type.Boolean(),
	title: Type.Optional(NonEmptyString)
});
//#endregion
//#region packages/gateway-protocol/src/schema/terminal.ts
const TerminalDimension = Type.Integer({
	minimum: 1,
	maximum: 2e3
});
/** Opens a shell session; the server picks the shell, cwd, and confinement. */
const TerminalOpenParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	catalog: Type.Optional(SessionCatalogLocatorSchema),
	cols: TerminalDimension,
	rows: TerminalDimension
});
/** Result of a successful open; carries the facts the UI header renders. */
const TerminalOpenResultSchema = closedObject({
	sessionId: NonEmptyString,
	agentId: NonEmptyString,
	shell: NonEmptyString,
	cwd: NonEmptyString,
	confined: Type.Boolean(),
	title: Type.Optional(NonEmptyString)
});
/** Writes client keystrokes to the session stdin. */
const TerminalInputParamsSchema = closedObject({
	sessionId: NonEmptyString,
	data: Type.String()
});
/** Stages one file on the host bound to an existing terminal session. */
const TerminalUploadParamsSchema = closedObject({
	sessionId: NonEmptyString,
	name: Type.String({
		minLength: 1,
		maxLength: 255
	}),
	contentBase64: Type.String({ maxLength: MAX_TERMINAL_UPLOAD_BASE64_LENGTH })
});
/** Absolute temporary path pasted into the active terminal after upload. */
const TerminalUploadResultSchema = closedObject({
	path: NonEmptyString,
	size: Type.Integer({
		minimum: 0,
		maximum: MAX_TERMINAL_UPLOAD_BYTES
	})
});
/** Resizes the PTY grid after the client viewport changes. */
const TerminalResizeParamsSchema = closedObject({
	sessionId: NonEmptyString,
	cols: TerminalDimension,
	rows: TerminalDimension
});
/** Closes a session and kills its process tree. */
const TerminalCloseParamsSchema = closedObject({ sessionId: NonEmptyString });
/**
* Attaches the calling admin connection. Connection-owned sessions use
* take-over; agent-owned sessions retain ownership and add a shared viewer.
*/
const TerminalAttachParamsSchema = closedObject({ sessionId: NonEmptyString });
/** Result of a successful attach; mirrors open plus the replay buffer. */
const TerminalAttachResultSchema = closedObject({
	sessionId: NonEmptyString,
	agentId: NonEmptyString,
	shell: NonEmptyString,
	cwd: NonEmptyString,
	confined: Type.Boolean(),
	buffer: Type.String(),
	seq: Type.Optional(Type.Integer({ minimum: 0 }))
});
/** One attachable session, as reported by terminal.list. */
const TerminalSessionInfoSchema = closedObject({
	sessionId: NonEmptyString,
	agentId: NonEmptyString,
	shell: NonEmptyString,
	cwd: NonEmptyString,
	confined: Type.Boolean(),
	/** False while the session is detached (no connection owns its stream). */
	attached: Type.Boolean(),
	/** Connection-owned session, or the trusted agent session key that owns it. */
	owner: Type.Optional(Type.Union([Type.Literal("conn"), Type.String({ pattern: "^agent:.+" })])),
	createdAtMs: Type.Integer({ minimum: 0 })
});
/**
* Sessions a reconnecting admin client can attach. All admin connections see
* the same list: the terminal surface is already operator.admin (full host
* access), so cross-connection visibility adds no privilege.
*/
const TerminalListResultSchema = closedObject({ sessions: Type.Array(TerminalSessionInfoSchema) });
/** Shared ok/void result for input, resize, and close. */
const TerminalAckResultSchema = closedObject({ ok: Type.Boolean() });
/** Streamed output chunk; seq is its cumulative UTF-16 end offset within the session. */
const TerminalDataEventSchema = withSince("2026.7", closedObject({
	sessionId: NonEmptyString,
	seq: Type.Integer({ minimum: 0 }),
	data: Type.String()
}));
/** Terminal end-of-life notice; the session id is invalid after this event. */
const TerminalExitEventSchema = withSince("2026.7", closedObject({
	sessionId: NonEmptyString,
	exitCode: Type.Optional(Type.Union([Type.Integer(), Type.Null()])),
	signal: Type.Optional(Type.Union([Type.Integer(), Type.Null()])),
	reason: Type.Optional(Type.Union([
		Type.Literal("process_exit"),
		Type.Literal("closed"),
		Type.Literal("disconnected"),
		Type.Literal("detached"),
		Type.Literal("error")
	])),
	error: Type.Optional(Type.String())
}));
/** Union of every event a terminal session can emit. */
const TerminalEventSchema = withSince("2026.7", Type.Union([TerminalDataEventSchema, TerminalExitEventSchema]));
//#endregion
//#region packages/gateway-protocol/src/terminal-validators.ts
const validateTerminalOpenParams = /* @__PURE__ */ lazyCompile(TerminalOpenParamsSchema);
const validateTerminalInputParams = /* @__PURE__ */ lazyCompile(TerminalInputParamsSchema);
const validateTerminalResizeParams = /* @__PURE__ */ lazyCompile(TerminalResizeParamsSchema);
const validateTerminalCloseParams = /* @__PURE__ */ lazyCompile(TerminalCloseParamsSchema);
const validateTerminalAttachParams = /* @__PURE__ */ lazyCompile(TerminalAttachParamsSchema);
const validateTerminalUploadParams = /* @__PURE__ */ lazyCompile(TerminalUploadParamsSchema);
const validateTerminalUploadResult = /* @__PURE__ */ lazyCompile(TerminalUploadResultSchema);
//#endregion
//#region packages/gateway-protocol/src/schema/approvals.ts
const ApprovalIdSchema = Type.String({
	minLength: 1,
	pattern: APPROVAL_ID_WELL_FORMED_UNICODE_PATTERN,
	description: "Exact full approval id encoded safely in deep-link paths."
});
/** Approval owner used to select the safe presentation payload. */
const ApprovalKindSchema = Type.Union([
	Type.Literal("exec"),
	Type.Literal("plugin"),
	Type.Literal("system-agent")
]);
/** Reviewer decisions accepted by the unified approval resolver. */
const ApprovalDecisionSchema = Type.Union([
	Type.Literal("allow-once"),
	Type.Literal("allow-always"),
	Type.Literal("deny")
]);
/** Reviewer decisions that permit an operation to proceed. */
const ApprovalAllowDecisionSchema = Type.Union([Type.Literal("allow-once"), Type.Literal("allow-always")]);
/** Closed reason recorded for a terminal approval transition. */
const ApprovalTerminalReasonSchema = Type.Union([
	Type.Literal("user"),
	Type.Literal("timeout"),
	Type.Literal("malformed-verdict"),
	Type.Literal("no-route"),
	Type.Literal("run-aborted"),
	Type.Literal("gateway-restart"),
	Type.Literal("storage-corrupt")
]);
/** Terminal reason accepted for an allowed approval. */
const ApprovalAllowedReasonSchema = Type.Union([Type.Literal("user")]);
/** Terminal reasons accepted for a denied approval. */
const ApprovalDeniedReasonSchema = Type.Union([
	Type.Literal("user"),
	Type.Literal("malformed-verdict"),
	Type.Literal("no-route"),
	Type.Literal("storage-corrupt")
]);
/** Terminal reason accepted for an expired approval. */
const ApprovalExpiredReasonSchema = Type.Union([Type.Literal("timeout")]);
/** Terminal reasons accepted for a cancelled approval. */
const ApprovalCancelledReasonSchema = Type.Union([Type.Literal("run-aborted"), Type.Literal("gateway-restart")]);
/** Reviewer-facing severity for plugin-owned approval requests. */
const PluginApprovalSeveritySchema = Type.Union([
	Type.Literal("info"),
	Type.Literal("warning"),
	Type.Literal("critical")
]);
const ApprovalAllowedDecisionsSchema = Type.Array(ApprovalDecisionSchema, {
	minItems: 1,
	maxItems: 3,
	uniqueItems: true,
	contains: Type.Literal("deny"),
	description: "Available reviewer decisions. Deny is always available so malformed or unsafe input can fail closed."
});
const SystemAgentApprovalAllowedDecisionsSchema = Type.Tuple([Type.Literal("allow-once"), Type.Literal("deny")]);
/** Redacted exec details safe to persist and render outside the requesting runtime. */
const ExecApprovalPresentationSchema = Type.Object({
	kind: Type.Literal("exec"),
	commandText: NonEmptyString,
	commandPreview: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	warningText: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	host: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	nodeId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	agentId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	allowedDecisions: ApprovalAllowedDecisionsSchema
}, {
	additionalProperties: false,
	description: "Reviewer-safe exec presentation. Runtime cwd, environment, system-run binding, and execution plan are intentionally excluded."
});
/** Plugin-supplied reviewer text safe to persist and render across surfaces. */
const PluginApprovalPresentationSchema = closedObject({
	kind: Type.Literal("plugin"),
	title: Type.String({
		minLength: 1,
		maxLength: 80
	}),
	description: Type.String({
		minLength: 1,
		maxLength: 512
	}),
	detail: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 16384
	})),
	severity: PluginApprovalSeveritySchema,
	pluginId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	toolName: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	agentId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	allowedDecisions: ApprovalAllowedDecisionsSchema
});
/** Reviewer-safe OpenClaw system change. Exact operation stays host-local. */
const SystemAgentApprovalPresentationSchema = closedObject({
	kind: Type.Literal("system-agent"),
	title: Type.String({
		minLength: 1,
		maxLength: 80
	}),
	description: Type.String({
		minLength: 1,
		maxLength: 512
	}),
	proposalHash: Type.String({ pattern: "^[a-f0-9]{64}$" }),
	agentId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	allowedDecisions: SystemAgentApprovalAllowedDecisionsSchema
});
/** Reviewer-safe presentation discriminated by the approval owner. */
const ApprovalPresentationSchema = Type.Union([
	ExecApprovalPresentationSchema,
	PluginApprovalPresentationSchema,
	SystemAgentApprovalPresentationSchema
]);
const ApprovalRecordCommonFields = {
	id: ApprovalIdSchema,
	urlPath: NonEmptyString,
	createdAtMs: Type.Integer({ minimum: 0 }),
	expiresAtMs: Type.Integer({ minimum: 0 }),
	presentation: ApprovalPresentationSchema
};
/** Reviewer-safe origin attribution for terminal approval history. */
const ApprovalHistorySourceAttributionSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(NonEmptyString)
});
/** Reviewer attribution recorded by the durable approval ledger. */
const ApprovalHistoryResolverAttributionSchema = closedObject({
	kind: Type.Union([
		Type.Literal("device"),
		Type.Literal("channel"),
		Type.Literal("runtime"),
		Type.Literal("system")
	]),
	id: Type.Optional(NonEmptyString)
});
const ApprovalResolutionFields = {
	resolvedAtMs: Type.Integer({ minimum: 0 }),
	source: Type.Optional(ApprovalHistorySourceAttributionSchema),
	resolver: Type.Optional(ApprovalHistoryResolverAttributionSchema)
};
/** Approval that has not yet accepted a reviewer decision. */
const PendingApprovalSnapshotSchema = closedObject({
	...ApprovalRecordCommonFields,
	status: Type.Literal("pending")
});
/** Approval whose first recorded reviewer decision allows the operation. */
const AllowedApprovalSnapshotSchema = closedObject({
	...ApprovalRecordCommonFields,
	...ApprovalResolutionFields,
	status: Type.Literal("allowed"),
	decision: ApprovalAllowDecisionSchema,
	reason: ApprovalAllowedReasonSchema
});
/** Approval whose first recorded reviewer decision denies the operation. */
const DeniedApprovalSnapshotSchema = closedObject({
	...ApprovalRecordCommonFields,
	...ApprovalResolutionFields,
	status: Type.Literal("denied"),
	decision: Type.Literal("deny"),
	reason: ApprovalDeniedReasonSchema
});
/** Approval that reached its deadline and therefore failed closed. */
const ExpiredApprovalSnapshotSchema = closedObject({
	...ApprovalRecordCommonFields,
	...ApprovalResolutionFields,
	status: Type.Literal("expired"),
	reason: ApprovalExpiredReasonSchema
});
/** Approval cancelled by its runtime owner before a reviewer decision. */
const CancelledApprovalSnapshotSchema = closedObject({
	...ApprovalRecordCommonFields,
	...ApprovalResolutionFields,
	status: Type.Literal("cancelled"),
	reason: ApprovalCancelledReasonSchema
});
/** Durable approval projection returned identically to every authorized surface. */
const ApprovalSnapshotSchema = Type.Union([
	PendingApprovalSnapshotSchema,
	AllowedApprovalSnapshotSchema,
	DeniedApprovalSnapshotSchema,
	ExpiredApprovalSnapshotSchema,
	CancelledApprovalSnapshotSchema
]);
/** Durable terminal approval state returned after a resolution attempt. */
const TerminalApprovalSnapshotSchema = Type.Union([
	AllowedApprovalSnapshotSchema,
	DeniedApprovalSnapshotSchema,
	ExpiredApprovalSnapshotSchema,
	CancelledApprovalSnapshotSchema
]);
/** Lookup payload for one approval by its exact full id. */
const ApprovalGetParamsSchema = closedObject({ id: ApprovalRecordCommonFields.id });
/** Current durable state for one authorized approval lookup. */
const ApprovalGetResultSchema = closedObject({ approval: ApprovalSnapshotSchema });
/** Cursor-based query for the retained terminal approval ledger. */
const ApprovalHistoryParamsSchema = closedObject({
	cursor: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 512
	})),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 100
	})),
	kind: Type.Optional(ApprovalKindSchema)
});
/** Newest-first page from the retained terminal approval ledger. */
const ApprovalHistoryResultSchema = closedObject({
	items: Type.Array(TerminalApprovalSnapshotSchema),
	nextCursor: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 512
	}))
});
/** Reviewer decision for one approval identified by its exact full id. */
const ApprovalChannelReviewerSchema = closedObject({
	channel: NonEmptyString,
	accountId: NonEmptyString,
	senderId: NonEmptyString
});
const ApprovalResolveParamsSchema = closedObject({
	id: ApprovalRecordCommonFields.id,
	kind: ApprovalKindSchema,
	decision: ApprovalDecisionSchema,
	reviewer: Type.Optional(ApprovalChannelReviewerSchema)
});
/** First-answer outcome plus the canonical recorded state returned to all contenders. */
const ApprovalResolveResultSchema = closedObject({
	applied: Type.Boolean(),
	approval: TerminalApprovalSnapshotSchema
});
const SessionApprovalEventCommonFields = {
	sessionKey: NonEmptyString,
	sourceSessionKey: Type.Optional(NonEmptyString),
	updatedAtMs: Type.Integer({ minimum: 0 })
};
/** Sanitized pending transition delivered only to an opted-in session audience. */
const PendingSessionApprovalEventSchema = withSince("2026.7", closedObject({
	...SessionApprovalEventCommonFields,
	phase: Type.Literal("pending"),
	approval: PendingApprovalSnapshotSchema
}));
/** Sanitized terminal transition delivered only to an opted-in session audience. */
const TerminalSessionApprovalEventSchema = withSince("2026.7", closedObject({
	...SessionApprovalEventCommonFields,
	phase: Type.Literal("terminal"),
	approval: TerminalApprovalSnapshotSchema
}));
/** Sanitized approval transition delivered only to an opted-in session audience. */
const SessionApprovalEventSchema = withSince("2026.7", Type.Union([PendingSessionApprovalEventSchema, TerminalSessionApprovalEventSchema]));
/** Authoritative pending approval set returned when a session stream subscribes. */
const SessionApprovalReplaySchema = withSince("2026.7", closedObject({
	sessionKey: NonEmptyString,
	updatedAtMs: Type.Integer({ minimum: 0 }),
	approvals: Type.Array(PendingApprovalSnapshotSchema),
	truncated: Type.Boolean()
}));
//#endregion
//#region packages/gateway-protocol/src/approval-result-validators.ts
const validateApprovalGetResult = /* @__PURE__ */ lazyCompile(ApprovalGetResultSchema);
const validateApprovalHistoryResult = /* @__PURE__ */ lazyCompile(ApprovalHistoryResultSchema);
const validateApprovalResolveResult = /* @__PURE__ */ lazyCompile(ApprovalResolveResultSchema);
//#endregion
//#region packages/gateway-protocol/src/schema/skill-history.ts
const SkillsProposalHistoryStatusParamsSchema = Type.Object({ agentId: Type.Optional(NonEmptyString) }, { additionalProperties: false });
const SkillsProposalHistoryScanParamsSchema = Type.Object({
	agentId: Type.Optional(NonEmptyString),
	direction: Type.Optional(Type.Union([Type.Literal("older"), Type.Literal("newer")]))
}, { additionalProperties: false });
const SkillsProposalHistoryScanResultSchema = Type.Object({
	schema: Type.Literal("openclaw.skill-workshop.history-scan.v1"),
	hasScanned: Type.Boolean(),
	reviewedSessions: Type.Integer({ minimum: 0 }),
	ideasFound: Type.Integer({ minimum: 0 }),
	hasMore: Type.Boolean(),
	lastScanReviewed: Type.Integer({ minimum: 0 }),
	lastScanIdeas: Type.Integer({ minimum: 0 }),
	lastScanAt: Type.Optional(NonEmptyString),
	oldestReviewedAt: Type.Optional(NonEmptyString),
	newestReviewedAt: Type.Optional(NonEmptyString)
}, { additionalProperties: false });
const validateSkillsProposalHistoryStatusParams = /* @__PURE__ */ lazyCompile(SkillsProposalHistoryStatusParamsSchema);
const validateSkillsProposalHistoryScanParams = /* @__PURE__ */ lazyCompile(SkillsProposalHistoryScanParamsSchema);
//#endregion
//#region packages/gateway-protocol/src/schema/ui-command.ts
const UiSplitCommandSchema = closedObject({
	kind: Type.Literal("split"),
	direction: Type.Union([Type.Literal("right"), Type.Literal("down")]),
	sessionKey: NonEmptyString
});
const UiClosePaneCommandSchema = closedObject({
	kind: Type.Literal("close-pane"),
	sessionKey: NonEmptyString
});
const UiFocusCommandSchema = closedObject({
	kind: Type.Literal("focus"),
	sessionKey: NonEmptyString
});
const UiSidebarCommandSchema = closedObject({
	kind: Type.Literal("sidebar"),
	visible: Type.Boolean()
});
const UiPanelCommandSchema = closedObject({
	kind: Type.Literal("panel"),
	panel: Type.Union([Type.Literal("terminal"), Type.Literal("browser")]),
	open: Type.Boolean(),
	dock: Type.Optional(Type.Union([Type.Literal("bottom"), Type.Literal("right")])),
	terminalSessionId: Type.Optional(NonEmptyString)
});
const UiNavigateCommandSchema = closedObject({
	kind: Type.Literal("navigate"),
	sessionKey: NonEmptyString
});
const UiCommandSchema = Type.Union([
	UiSplitCommandSchema,
	UiClosePaneCommandSchema,
	UiFocusCommandSchema,
	UiSidebarCommandSchema,
	UiPanelCommandSchema,
	UiNavigateCommandSchema
]);
const UiCommandParamsSchema = closedObject({
	command: UiCommandSchema,
	sessionKey: Type.Optional(NonEmptyString),
	agentId: Type.Optional(NonEmptyString)
});
const UiCommandResultSchema = closedObject({ ok: Type.Boolean() });
//#endregion
//#region packages/gateway-protocol/src/schema/board.ts
const BoardTabIdSchema = Type.String({ pattern: "^[a-z0-9-]{1,40}$" });
const BoardWidgetNameSchema = Type.String({ pattern: "^[a-z0-9][a-z0-9._-]{0,63}$" });
const BoardWidgetGeneratedIdentitySchema = closedObject({
	source: Type.Literal("show_widget"),
	key: Type.String({ pattern: "^[a-f0-9]{64}$" }),
	fallbackName: BoardWidgetNameSchema
});
const BoardWidgetPluginKindSchema = Type.String({ pattern: "^[a-z0-9][a-z0-9-]{0,63}:[a-z0-9][a-z0-9._-]{0,63}$" });
const BoardWidgetPluginPropsSchema = Type.Record(Type.String(), Type.Unknown());
const BoardChatDockSchema = Type.Union([
	Type.Literal("left"),
	Type.Literal("right"),
	Type.Literal("bottom"),
	Type.Literal("hidden")
]);
const BoardSizeSchema = Type.Union([
	Type.Literal("sm"),
	Type.Literal("md"),
	Type.Literal("lg"),
	Type.Literal("xl"),
	Type.Literal("full")
]);
const BoardWidgetPresentationSchema = Type.Union([
	Type.Literal("card"),
	Type.Literal("full-bleed"),
	Type.Literal("frameless")
]);
const BoardWidgetHeightModeSchema = Type.Union([Type.Literal("auto"), Type.Literal("fixed")]);
const BOARD_CRON_JOB_ID_MAX_LENGTH = 256;
const BOARD_CRON_TRIGGER_PREFIX = "cron.trigger:";
const BOARD_WIDGET_TOOL_MAX_LENGTH = 269;
const BOARD_DATA_BINDING_ID_MAX_LENGTH = 64;
const BoardTabSchema = closedObject({
	tabId: BoardTabIdSchema,
	title: Type.String({
		minLength: 1,
		maxLength: 80
	}),
	position: Type.Integer({ minimum: 0 }),
	chatDock: BoardChatDockSchema
});
const BoardWidgetDeclaredSchema = closedObject({
	netOrigins: Type.Optional(Type.Array(Type.String({
		minLength: 1,
		maxLength: 2048
	}), { maxItems: 32 })),
	tools: Type.Optional(Type.Array(Type.String({
		minLength: 1,
		maxLength: 269
	}), { maxItems: 64 }))
});
const BoardWidgetSchema = closedObject({
	name: BoardWidgetNameSchema,
	tabId: BoardTabIdSchema,
	title: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 80
	})),
	contentKind: Type.Union([
		Type.Literal("html"),
		Type.Literal("mcp-app"),
		Type.Literal("plugin")
	]),
	pluginKind: Type.Optional(BoardWidgetPluginKindSchema),
	props: Type.Optional(BoardWidgetPluginPropsSchema),
	presentation: Type.Optional(BoardWidgetPresentationSchema),
	heightMode: Type.Optional(BoardWidgetHeightModeSchema),
	sizeW: Type.Integer({
		minimum: 1,
		maximum: 12
	}),
	sizeH: Type.Integer({
		minimum: 1,
		maximum: 20
	}),
	position: Type.Integer({ minimum: 0 }),
	grantState: Type.Union([
		Type.Literal("none"),
		Type.Literal("pending"),
		Type.Literal("granted"),
		Type.Literal("rejected")
	]),
	revision: Type.Integer({ minimum: 1 }),
	instanceId: Type.Optional(NonEmptyString),
	declaredSummary: Type.Optional(Type.Array(Type.String())),
	declared: Type.Optional(BoardWidgetDeclaredSchema),
	frameUrl: Type.Optional(Type.String()),
	viewTicket: Type.Optional(Type.String()),
	viewTicketTtlMs: Type.Optional(Type.Integer({ minimum: 1 })),
	viewGeneration: Type.Optional(Type.String({ pattern: "^[a-f0-9]{32}$" })),
	sandboxUrl: Type.Optional(Type.String()),
	sandboxPort: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 65535
	})),
	sandboxOrigin: Type.Optional(Type.String())
});
const BoardSnapshotFields = {
	sessionKey: NonEmptyString,
	revision: Type.Integer({ minimum: 0 }),
	tabs: Type.Array(BoardTabSchema),
	widgets: Type.Array(BoardWidgetSchema)
};
const BoardSnapshotSchema = closedObject(BoardSnapshotFields);
const BoardTabCreateOpSchema = closedObject({
	kind: Type.Literal("tab_create"),
	tabId: BoardTabIdSchema,
	title: Type.String({
		minLength: 1,
		maxLength: 80
	}),
	chatDock: Type.Optional(BoardChatDockSchema)
});
const BoardTabUpdateOpSchema = closedObject({
	kind: Type.Literal("tab_update"),
	tabId: BoardTabIdSchema,
	title: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 80
	})),
	chatDock: Type.Optional(BoardChatDockSchema),
	position: Type.Optional(Type.Integer({ minimum: 0 }))
});
const BoardTabDeleteOpSchema = closedObject({
	kind: Type.Literal("tab_delete"),
	tabId: BoardTabIdSchema
});
const BoardTabsReorderOpSchema = closedObject({
	kind: Type.Literal("tabs_reorder"),
	tabIds: Type.Array(BoardTabIdSchema)
});
const BoardWidgetMoveOpSchema = closedObject({
	kind: Type.Literal("widget_move"),
	name: BoardWidgetNameSchema,
	tabId: Type.Optional(BoardTabIdSchema),
	position: Type.Optional(Type.Integer({ minimum: 0 })),
	after: Type.Optional(BoardWidgetNameSchema)
});
const BoardWidgetResizeOpSchema = closedObject({
	kind: Type.Literal("widget_resize"),
	name: BoardWidgetNameSchema,
	sizeW: Type.Integer(),
	sizeH: Type.Integer(),
	heightMode: Type.Optional(BoardWidgetHeightModeSchema)
});
const BoardWidgetRemoveOpSchema = closedObject({
	kind: Type.Literal("widget_remove"),
	name: BoardWidgetNameSchema
});
const BoardOpSchema = Type.Union([
	BoardTabCreateOpSchema,
	BoardTabUpdateOpSchema,
	BoardTabDeleteOpSchema,
	BoardTabsReorderOpSchema,
	BoardWidgetMoveOpSchema,
	BoardWidgetResizeOpSchema,
	BoardWidgetRemoveOpSchema
]);
const BoardGetParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
});
const BoardUpdateParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	ops: Type.Array(BoardOpSchema)
});
const BoardMcpAppDescriptorSchema = closedObject({
	serverName: NonEmptyString,
	toolName: NonEmptyString,
	uiResourceUri: NonEmptyString,
	toolCallId: NonEmptyString
});
const BoardWidgetHtmlContentSchema = closedObject({
	kind: Type.Literal("html"),
	html: Type.String({ maxLength: 262144 })
});
const BoardWidgetMcpAppContentSchema = closedObject({
	kind: Type.Literal("mcp-app"),
	descriptor: BoardMcpAppDescriptorSchema
});
const BoardWidgetMcpAppPutContentSchema = closedObject({
	kind: Type.Literal("mcp-app"),
	viewId: NonEmptyString
});
const BoardWidgetPluginContentSchema = closedObject({
	kind: Type.Literal("plugin"),
	pluginKind: BoardWidgetPluginKindSchema,
	props: Type.Optional(BoardWidgetPluginPropsSchema)
});
const BoardWidgetContentSchema = Type.Union([
	BoardWidgetHtmlContentSchema,
	BoardWidgetMcpAppContentSchema,
	BoardWidgetPluginContentSchema
]);
const BoardCanvasDocumentSourceSchema = closedObject({
	kind: Type.Literal("canvas-doc"),
	docId: NonEmptyString
});
const BoardWidgetPutContentSchema = Type.Union([
	BoardWidgetHtmlContentSchema,
	BoardWidgetMcpAppPutContentSchema,
	BoardWidgetPluginContentSchema,
	BoardCanvasDocumentSourceSchema
]);
const BoardWidgetPutParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	name: BoardWidgetNameSchema,
	title: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 80
	})),
	content: BoardWidgetPutContentSchema,
	presentation: Type.Optional(BoardWidgetPresentationSchema),
	heightMode: Type.Optional(BoardWidgetHeightModeSchema),
	placement: Type.Optional(closedObject({
		tabId: Type.Optional(BoardTabIdSchema),
		size: Type.Optional(BoardSizeSchema),
		after: Type.Optional(BoardWidgetNameSchema)
	})),
	declared: Type.Optional(BoardWidgetDeclaredSchema),
	generatedIdentity: Type.Optional(BoardWidgetGeneratedIdentitySchema)
});
const BoardWidgetPutResultSchema = closedObject({
	...BoardSnapshotFields,
	resolvedWidgetName: BoardWidgetNameSchema
});
const BoardWidgetGrantParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	name: BoardWidgetNameSchema,
	decision: Type.Union([Type.Literal("granted"), Type.Literal("rejected")]),
	revision: Type.Integer({ minimum: 1 }),
	instanceId: NonEmptyString
});
const BoardWidgetAppViewParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	name: BoardWidgetNameSchema,
	revision: Type.Integer({ minimum: 1 }),
	instanceId: NonEmptyString
});
const BoardWidgetAppViewResultSchema = closedObject({
	viewId: NonEmptyString,
	expiresAtMs: Type.Integer({ minimum: 0 })
});
const BoardViewTicketSchema = Type.String({
	minLength: 1,
	maxLength: 2048
});
const BoardLegacyEventParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	widget: BoardWidgetNameSchema,
	payload: Type.Unknown()
});
const BoardTicketEventParamsSchema = closedObject({
	ticket: BoardViewTicketSchema,
	payload: Type.Unknown()
});
const BoardEventParamsSchema = Type.Union([BoardLegacyEventParamsSchema, BoardTicketEventParamsSchema]);
const BoardPromptAuthorizeParamsSchema = closedObject({ ticket: BoardViewTicketSchema });
const BoardDataReadParamsSchema = closedObject({
	ticket: BoardViewTicketSchema,
	bindingId: Type.String({
		minLength: 1,
		maxLength: 64
	}),
	params: Type.Optional(Type.Record(Type.String({
		minLength: 1,
		maxLength: 80
	}), Type.Unknown(), { maxProperties: 64 }))
});
const BoardCronActionParamsSchema = closedObject({
	ticket: BoardViewTicketSchema,
	action: Type.Literal("cron.trigger"),
	jobId: Type.String({
		minLength: 1,
		maxLength: 256
	})
});
const BoardPluginActionParamsSchema = closedObject({
	ticket: BoardViewTicketSchema,
	action: Type.String({
		minLength: 1,
		maxLength: 269
	}),
	params: Type.Optional(Type.Record(Type.String({
		minLength: 1,
		maxLength: 80
	}), Type.Unknown(), { maxProperties: 64 }))
});
const BoardActionParamsSchema = Type.Union([BoardCronActionParamsSchema, BoardPluginActionParamsSchema]);
const BoardChangedEventSchema = closedObject({
	sessionKey: NonEmptyString,
	revision: Type.Integer({ minimum: 0 }),
	widget: Type.Optional(BoardWidgetNameSchema)
});
const BoardFocusTabCommandSchema = closedObject({
	kind: Type.Literal("focus_tab"),
	tabId: BoardTabIdSchema
});
const BoardSetChatDockCommandSchema = closedObject({
	kind: Type.Literal("set_chat_dock"),
	dock: BoardChatDockSchema
});
const BoardCommandSchema = Type.Union([BoardFocusTabCommandSchema, BoardSetChatDockCommandSchema]);
const BoardCommandEventSchema = closedObject({
	sessionKey: NonEmptyString,
	command: BoardCommandSchema
});
//#endregion
//#region packages/gateway-protocol/src/schema/agents-models-skills.ts
/**
* Agent, model, skill, and tool catalog schemas.
*
* These contracts back dashboard selectors, agent management, model catalogs,
* skill upload/install flows, skill workshop proposals, and effective tool
* discovery. Keep public request/result schemas documented because they are
* shared by gateway RPC, CLI, and UI clients.
*/
/** Model option shown in selectors and model catalog results. */
const GatewayAgentRuntimeSchema = closedObject({
	id: NonEmptyString,
	fallback: Type.Optional(Type.Union([Type.Literal("openclaw"), Type.Literal("none")])),
	cloudPlacementSupported: Type.Optional(Type.Boolean()),
	source: Type.Union([
		Type.Literal("env"),
		Type.Literal("agent"),
		Type.Literal("defaults"),
		Type.Literal("model"),
		Type.Literal("provider"),
		Type.Literal("implicit"),
		Type.Literal("session"),
		Type.Literal("session-key")
	])
});
const GatewayThinkingLevelOptionSchema = closedObject({
	id: NonEmptyString,
	label: NonEmptyString
});
const ModelChoiceSchema = closedObject({
	id: NonEmptyString,
	name: NonEmptyString,
	provider: NonEmptyString,
	alias: Type.Optional(NonEmptyString),
	available: Type.Optional(Type.Boolean()),
	contextWindow: Type.Optional(Type.Integer({ minimum: 1 })),
	reasoning: Type.Optional(Type.Boolean()),
	thinkingLevels: Type.Optional(Type.Array(GatewayThinkingLevelOptionSchema)),
	thinkingDefault: Type.Optional(NonEmptyString),
	supportsTools: Type.Optional(Type.Boolean()),
	agentRuntime: Type.Optional(GatewayAgentRuntimeSchema),
	apiKeySupported: Type.Optional(Type.Boolean()),
	input: Type.Optional(Type.Array(Type.Union([
		Type.Literal("text"),
		Type.Literal("image"),
		Type.Literal("audio"),
		Type.Literal("video"),
		Type.Literal("document")
	])))
});
/** Semantic owner of an agent roster entry. */
const AgentKindSchema = Type.Union([Type.Literal("agent"), Type.Literal("system")]);
/** Condensed agent record returned by list APIs. */
const AgentSummarySchema = closedObject({
	id: NonEmptyString,
	kind: Type.Optional(AgentKindSchema),
	name: Type.Optional(NonEmptyString),
	identity: Type.Optional(closedObject({
		name: Type.Optional(NonEmptyString),
		theme: Type.Optional(NonEmptyString),
		emoji: Type.Optional(NonEmptyString),
		avatar: Type.Optional(NonEmptyString),
		avatarUrl: Type.Optional(NonEmptyString)
	})),
	workspace: Type.Optional(NonEmptyString),
	workspaceGit: Type.Optional(Type.Boolean()),
	model: Type.Optional(closedObject({
		primary: Type.Optional(NonEmptyString),
		fallbacks: Type.Optional(Type.Array(NonEmptyString))
	})),
	agentRuntime: Type.Optional(GatewayAgentRuntimeSchema),
	thinkingLevels: Type.Optional(Type.Array(GatewayThinkingLevelOptionSchema)),
	thinkingOptions: Type.Optional(Type.Array(NonEmptyString)),
	thinkingDefault: Type.Optional(NonEmptyString)
});
/** Empty request payload for listing configured agents. */
const AgentsListParamsSchema = closedObject({});
const AgentOwnershipSchema = Type.Union([
	Type.Literal("sole"),
	Type.Literal("legacy"),
	Type.Literal("explicit")
]);
const AgentsListResultSchema = closedObject({
	defaultId: NonEmptyString,
	ownership: Type.Optional(AgentOwnershipSchema),
	selectionRequired: Type.Optional(Type.Boolean()),
	mainKey: NonEmptyString,
	scope: Type.Union([Type.Literal("per-sender"), Type.Literal("global")]),
	agents: Type.Array(AgentSummarySchema)
});
/** Creates a configured agent; the server supplies an omitted workspace. */
const AgentsCreateParamsSchema = closedObject({
	name: NonEmptyString,
	workspace: Type.Optional(NonEmptyString),
	model: Type.Optional(NonEmptyString),
	emoji: Type.Optional(Type.String()),
	avatar: Type.Optional(Type.String())
});
/** Result returned after creating an agent. */
const AgentsCreateResultSchema = closedObject({
	ok: Type.Literal(true),
	agentId: NonEmptyString,
	name: NonEmptyString,
	workspace: NonEmptyString,
	model: Type.Optional(NonEmptyString)
});
/** Updates mutable agent identity, workspace, and model fields; null clears the model override. */
const AgentsUpdateParamsSchema = closedObject({
	agentId: NonEmptyString,
	name: Type.Optional(NonEmptyString),
	workspace: Type.Optional(NonEmptyString),
	model: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	emoji: Type.Optional(Type.String()),
	avatar: Type.Optional(Type.String())
});
/** Result returned after updating an agent. */
const AgentsUpdateResultSchema = closedObject({
	ok: Type.Literal(true),
	agentId: NonEmptyString
});
/** Deletes an agent and optionally its workspace/config files. */
const AgentsDeleteParamsSchema = closedObject({
	agentId: NonEmptyString,
	deleteFiles: Type.Optional(Type.Boolean())
});
/** Result returned after deleting an agent and unbinding sessions. */
const AgentsDeleteResultSchema = closedObject({
	ok: Type.Literal(true),
	agentId: NonEmptyString,
	removedBindings: Type.Integer({ minimum: 0 }),
	removed: Type.Optional(Type.Array(closedObject({
		path: NonEmptyString,
		method: Type.Union([Type.Literal("trash"), Type.Literal("missing")])
	}))),
	failed: Type.Optional(Type.Array(closedObject({
		path: NonEmptyString,
		reason: NonEmptyString
	})))
});
/** File metadata and optional content for agent-local editable files. */
const AgentsFileEntrySchema = closedObject({
	name: NonEmptyString,
	path: NonEmptyString,
	missing: Type.Boolean(),
	expectedAbsent: Type.Optional(Type.Boolean()),
	size: Type.Optional(Type.Integer({ minimum: 0 })),
	updatedAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
	content: Type.Optional(Type.String())
});
/** Lists editable files for one agent. */
const AgentsFilesListParamsSchema = closedObject({ agentId: NonEmptyString });
/** Editable file list for an agent workspace. */
const AgentsFilesListResultSchema = closedObject({
	agentId: NonEmptyString,
	workspace: NonEmptyString,
	files: Type.Array(AgentsFileEntrySchema)
});
/** Reads one editable agent file by name. */
const AgentsFilesGetParamsSchema = closedObject({
	agentId: NonEmptyString,
	name: NonEmptyString
});
/** Result for reading one editable agent file. */
const AgentsFilesGetResultSchema = closedObject({
	agentId: NonEmptyString,
	workspace: NonEmptyString,
	file: AgentsFileEntrySchema
});
/** Writes one editable agent file. */
const AgentsFilesSetParamsSchema = closedObject({
	agentId: NonEmptyString,
	name: NonEmptyString,
	content: Type.String()
});
/** Result returned after writing an editable agent file. */
const AgentsFilesSetResultSchema = closedObject({
	ok: Type.Literal(true),
	agentId: NonEmptyString,
	workspace: NonEmptyString,
	file: AgentsFileEntrySchema
});
/** Model catalog request with optional visibility scope. */
const ModelsListParamsSchema = Type.Object({
	agentId: Type.Optional(NonEmptyString),
	includeProviderCapabilities: Type.Optional(Type.Boolean()),
	/** Reuse prepared/cached facts without starting provider discovery. */
	preparedOnly: Type.Optional(Type.Boolean()),
	/** Force replacement of a completed full-catalog generation. */
	refresh: Type.Optional(Type.Boolean()),
	view: Type.Optional(Type.Union([
		Type.Literal("default"),
		Type.Literal("configured"),
		Type.Literal("provider-config"),
		Type.Literal("all")
	]))
}, {
	additionalProperties: false,
	not: {
		properties: {
			preparedOnly: { const: true },
			refresh: { const: true }
		},
		required: ["preparedOnly", "refresh"]
	}
});
/** Reads model-provider credential health for one configured agent. */
const ModelsAuthStatusParamsSchema = closedObject({
	refresh: Type.Optional(Type.Boolean()),
	agentId: Type.Optional(Type.String())
});
/** Removes saved model-provider credentials from one configured agent. */
const ModelsAuthLogoutParamsSchema = closedObject({
	provider: NonEmptyString,
	profileIds: Type.Optional(Type.Array(NonEmptyString, { minItems: 1 })),
	agentId: Type.Optional(Type.String())
});
/** Model catalog result. */
const ModelCatalogProviderOutcomeSchema = closedObject({
	provider: NonEmptyString,
	profileId: Type.Optional(NonEmptyString),
	status: Type.Union([
		Type.Literal("ready"),
		Type.Literal("auth-rejected"),
		Type.Literal("unavailable")
	])
});
closedObject({
	models: Type.Array(ModelChoiceSchema),
	providerOutcomes: Type.Optional(Type.Array(ModelCatalogProviderOutcomeSchema))
});
/** Runs a bounded live credential probe for one model provider. */
const ModelsProbeParamsSchema = closedObject({
	provider: NonEmptyString,
	profileId: Type.Optional(NonEmptyString),
	timeoutMs: Type.Optional(Type.Integer({ minimum: 1 })),
	agentId: Type.Optional(Type.String())
});
const AuthProbeStatusSchema = Type.Union([
	Type.Literal("ok"),
	Type.Literal("auth"),
	Type.Literal("rate_limit"),
	Type.Literal("billing"),
	Type.Literal("timeout"),
	Type.Literal("format"),
	Type.Literal("unknown"),
	Type.Literal("no_model")
]);
/** Secret-free result for one provider credential target. */
const ModelsProbeTargetResultSchema = closedObject({
	profileId: Type.Optional(NonEmptyString),
	label: NonEmptyString,
	status: AuthProbeStatusSchema,
	latencyMs: Type.Optional(Type.Integer({ minimum: 0 })),
	error: Type.Optional(Type.String())
});
/** Provider-level live probe rollup plus per-credential results. */
const ModelsProbeResultSchema = closedObject({
	provider: NonEmptyString,
	status: AuthProbeStatusSchema,
	latencyMs: Type.Optional(Type.Integer({ minimum: 0 })),
	error: Type.Optional(Type.String()),
	results: Type.Array(ModelsProbeTargetResultSchema)
});
/** Reads installed skill status, optionally for a selected agent. */
const SkillsStatusParamsSchema = closedObject({ agentId: Type.Optional(NonEmptyString) });
/** Empty request payload for listing available skill bins. */
const SkillsBinsParamsSchema = closedObject({});
closedObject({ bins: Type.Array(NonEmptyString) });
const Sha256String = Type.String({
	minLength: 64,
	maxLength: 64,
	pattern: "^[a-fA-F0-9]{64}$"
});
const SkillUploadIdempotencyKeyString = Type.String({
	minLength: 1,
	maxLength: 2048
});
const SkillUploadDataBase64String = Type.String({
	minLength: 1,
	maxLength: 5592408
});
/** Starts a chunked skill archive upload. */
const SkillsUploadBeginParamsSchema = closedObject({
	kind: Type.Literal("skill-archive"),
	slug: NonEmptyString,
	sizeBytes: Type.Integer({ minimum: 1 }),
	sha256: Type.Optional(Sha256String),
	force: Type.Optional(Type.Boolean()),
	idempotencyKey: Type.Optional(SkillUploadIdempotencyKeyString)
});
/** Uploads one base64-encoded chunk for a skill archive. */
const SkillsUploadChunkParamsSchema = closedObject({
	uploadId: NonEmptyString,
	offset: Type.Integer({ minimum: 0 }),
	dataBase64: SkillUploadDataBase64String
});
/** Commits a completed skill archive upload. */
const SkillsUploadCommitParamsSchema = closedObject({
	uploadId: NonEmptyString,
	sha256: Type.Optional(Sha256String)
});
/**
* ClawHub resolves a bare slug against every publisher, so requests that carry only the slug
* fail with 409 AMBIGUOUS_SKILL_SLUG once two publishers share it. Clients send the reference
* `skills.search` returned for the entry the operator picked.
*/
const CLAWHUB_SKILL_REF_DESCRIPTION = "ClawHub skill reference: `@owner/slug`, `skills-sh:owner/repo/slug`, or a bare `slug` when no publisher is known.";
/** Installs a skill from legacy install id, ClawHub, or uploaded archive. */
const SkillsInstallParamsSchema = Type.Union([
	closedObject({
		agentId: Type.Optional(NonEmptyString),
		name: NonEmptyString,
		installId: NonEmptyString,
		dangerouslyForceUnsafeInstall: Type.Optional(Type.Boolean({
			deprecated: true,
			description: "Deprecated compatibility field. Current servers ignore it; install policy is controlled by security.installPolicy."
		})),
		timeoutMs: Type.Optional(Type.Integer({ minimum: 1e3 }))
	}),
	closedObject({
		agentId: Type.Optional(NonEmptyString),
		source: Type.Literal("clawhub"),
		slug: Type.String({
			minLength: 1,
			description: CLAWHUB_SKILL_REF_DESCRIPTION
		}),
		version: Type.Optional(NonEmptyString),
		force: Type.Optional(Type.Boolean()),
		acknowledgeClawHubRisk: Type.Optional(Type.Boolean()),
		timeoutMs: Type.Optional(Type.Integer({ minimum: 1e3 }))
	}),
	closedObject({
		agentId: Type.Optional(NonEmptyString),
		source: Type.Literal("upload"),
		uploadId: NonEmptyString,
		slug: NonEmptyString,
		force: Type.Optional(Type.Boolean()),
		sha256: Type.Optional(Sha256String),
		timeoutMs: Type.Optional(Type.Integer({ minimum: 1e3 }))
	})
]);
/** Updates installed skill settings or refreshes ClawHub-installed skills. */
const SkillsUpdateParamsSchema = Type.Union([closedObject({
	skillKey: NonEmptyString,
	enabled: Type.Optional(Type.Boolean()),
	apiKey: Type.Optional(Type.String()),
	env: Type.Optional(Type.Record(NonEmptyString, Type.String()))
}), closedObject({
	agentId: Type.Optional(NonEmptyString),
	source: Type.Literal("clawhub"),
	slug: Type.Optional(NonEmptyString),
	all: Type.Optional(Type.Boolean()),
	acknowledgeClawHubRisk: Type.Optional(Type.Boolean())
})]);
/** Searches the skill registry. */
const SkillsSearchParamsSchema = closedObject({
	query: Type.Optional(NonEmptyString),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 100
	}))
});
/** Ranked skill registry search results. */
const SkillsSearchResultSchema = closedObject({ results: Type.Array(closedObject({
	score: Type.Number(),
	slug: NonEmptyString,
	installRef: Type.Optional(Type.String({
		minLength: 1,
		description: "Publisher-qualified reference for this result. Send it as `slug` to skills.detail and skills.install; several publishers can share one slug."
	})),
	displayName: NonEmptyString,
	summary: Type.Optional(Type.String()),
	icon: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	version: Type.Optional(NonEmptyString),
	updatedAt: Type.Optional(Type.Integer())
})) });
/** Reads registry detail for one skill. */
const SkillsDetailParamsSchema = closedObject({ slug: Type.String({
	minLength: 1,
	description: CLAWHUB_SKILL_REF_DESCRIPTION
}) });
/** Reads current security verdicts for configured skills. */
const SkillsSecurityVerdictsParamsSchema = closedObject({ agentId: Type.Optional(NonEmptyString) });
/** Skill registry detail, latest version, metadata, and owner info. */
const SkillsDetailResultSchema = closedObject({
	skill: Type.Union([closedObject({
		slug: NonEmptyString,
		displayName: NonEmptyString,
		summary: Type.Optional(Type.String()),
		tags: Type.Optional(Type.Record(NonEmptyString, Type.String())),
		channel: Type.Optional(Type.Union([Type.String(), Type.Null()])),
		isOfficial: Type.Optional(Type.Union([Type.Boolean(), Type.Null()])),
		createdAt: Type.Integer(),
		updatedAt: Type.Integer()
	}), Type.Null()]),
	latestVersion: Type.Optional(Type.Union([closedObject({
		version: NonEmptyString,
		createdAt: Type.Integer(),
		changelog: Type.Optional(Type.String())
	}), Type.Null()])),
	metadata: Type.Optional(Type.Union([closedObject({
		os: Type.Optional(Type.Union([Type.Array(Type.String()), Type.Null()])),
		systems: Type.Optional(Type.Union([Type.Array(Type.String()), Type.Null()]))
	}), Type.Null()])),
	owner: Type.Optional(Type.Union([closedObject({
		handle: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
		displayName: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
		image: Type.Optional(Type.Union([Type.String(), Type.Null()])),
		official: Type.Optional(Type.Union([Type.Boolean(), Type.Null()])),
		channel: Type.Optional(Type.Union([Type.String(), Type.Null()])),
		isOfficial: Type.Optional(Type.Union([Type.Boolean(), Type.Null()]))
	}), Type.Null()]))
});
/** Security verdict report for installed/requested skills. */
const SkillsSecurityVerdictsResultSchema = closedObject({
	schema: Type.Literal("openclaw.skills.security-verdicts.v1"),
	items: Type.Array(closedObject({
		registry: NonEmptyString,
		ok: Type.Boolean(),
		decision: NonEmptyString,
		reasons: Type.Array(Type.String()),
		requestedSlug: NonEmptyString,
		requestedOwnerHandle: Type.Optional(NonEmptyString),
		requestedVersion: NonEmptyString,
		slug: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
		version: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
		displayName: Type.Optional(Type.Union([Type.String(), Type.Null()])),
		publisherHandle: Type.Optional(Type.Union([Type.String(), Type.Null()])),
		publisherDisplayName: Type.Optional(Type.Union([Type.String(), Type.Null()])),
		createdAt: Type.Optional(Type.Union([Type.Integer(), Type.Null()])),
		checkedAt: Type.Optional(Type.Union([Type.Integer(), Type.Null()])),
		skillUrl: Type.Optional(Type.Union([Type.String(), Type.Null()])),
		securityAuditUrl: Type.Optional(Type.Union([Type.String(), Type.Null()])),
		securityStatus: Type.Optional(Type.Union([Type.String(), Type.Null()])),
		securityPassed: Type.Optional(Type.Union([Type.Boolean(), Type.Null()])),
		error: Type.Optional(closedObject({
			code: Type.Optional(Type.String()),
			message: Type.Optional(Type.String())
		}))
	}))
});
/** Reads the rendered skill card for one installed skill. */
const SkillsSkillCardParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	skillKey: NonEmptyString
});
/** Rendered skill card content and file metadata. */
const SkillsSkillCardResultSchema = closedObject({
	schema: Type.Literal("openclaw.skills.skill-card.v1"),
	skillKey: NonEmptyString,
	path: NonEmptyString,
	sizeBytes: Type.Integer({ minimum: 0 }),
	content: Type.String()
});
const SkillProposalStatusSchema = Type.Union([
	Type.Literal("pending"),
	Type.Literal("applied"),
	Type.Literal("rejected"),
	Type.Literal("quarantined"),
	Type.Literal("stale")
]);
/** Skill proposal operation type: new skill or update to an existing skill. */
const SkillProposalKindSchema = Type.Union([Type.Literal("create"), Type.Literal("update")]);
/** Scan state for proposed skill content before it can be applied. */
const SkillProposalScanStateSchema = Type.Union([
	Type.Literal("pending"),
	Type.Literal("clean"),
	Type.Literal("failed"),
	Type.Literal("quarantined")
]);
/** Source that created the skill proposal record. */
const SkillProposalSourceSchema = Type.Union([
	Type.Literal("skill-workshop"),
	Type.Literal("cli"),
	Type.Literal("gateway")
]);
const SkillProposalContentString = Type.String({
	minLength: 1,
	maxLength: 1048576
});
/** Support file payload accepted from proposal create/revise requests. */
const SkillProposalSupportFileInputSchema = closedObject({
	path: NonEmptyString,
	content: Type.String({ maxLength: 262144 })
});
/** Stored support file metadata, including target conflict hashes for updates. */
const SkillProposalSupportFileSchema = closedObject({
	path: NonEmptyString,
	sizeBytes: Type.Integer({
		minimum: 0,
		maximum: 262144
	}),
	hash: Sha256String,
	targetExisted: Type.Optional(Type.Boolean()),
	targetContentHash: Type.Optional(Sha256String)
});
/** One static-scan finding against proposed skill content. */
const SkillProposalFindingSchema = closedObject({
	ruleId: NonEmptyString,
	severity: Type.Union([
		Type.Literal("info"),
		Type.Literal("warn"),
		Type.Literal("critical")
	]),
	file: NonEmptyString,
	line: Type.Integer({ minimum: 1 }),
	message: NonEmptyString,
	evidence: Type.String()
});
/** Aggregated scan report attached to a proposal record. */
const SkillProposalScanSchema = closedObject({
	state: SkillProposalScanStateSchema,
	scannedAt: NonEmptyString,
	critical: Type.Integer({ minimum: 0 }),
	warn: Type.Integer({ minimum: 0 }),
	info: Type.Integer({ minimum: 0 }),
	findings: Type.Array(SkillProposalFindingSchema)
});
/** Skill file target that a proposal creates or updates. */
const SkillProposalTargetSchema = closedObject({
	skillName: NonEmptyString,
	skillKey: NonEmptyString,
	skillDir: NonEmptyString,
	skillFile: NonEmptyString,
	source: Type.Optional(NonEmptyString),
	currentContentHash: Type.Optional(NonEmptyString)
});
/** Optional runtime origin tying a proposal back to an agent turn. */
const SkillProposalOriginSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	messageId: Type.Optional(NonEmptyString)
});
const SkillProposalEvaluationFindingSchema = closedObject({
	ruleId: Type.String({
		minLength: 1,
		maxLength: 256
	}),
	severity: Type.Union([
		Type.Literal("info"),
		Type.Literal("warn"),
		Type.Literal("critical")
	]),
	message: Type.String({
		minLength: 1,
		maxLength: 4e3
	}),
	file: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 1024
	})),
	line: Type.Optional(Type.Integer({ minimum: 1 }))
});
const SkillProposalEvaluationResultSchema = closedObject({
	summary: Type.Optional(Type.String({ maxLength: 8e3 })),
	findings: Type.Optional(Type.Array(SkillProposalEvaluationFindingSchema, { maxItems: 200 })),
	metrics: Type.Optional(Type.Record(Type.String(), Type.Union([
		Type.String({ maxLength: 4e3 }),
		Type.Number(),
		Type.Boolean()
	]), {
		maxProperties: 64,
		propertyNames: Type.String({
			minLength: 1,
			maxLength: 128
		})
	})),
	evaluatorVersion: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 128
	})),
	mode: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 128
	})),
	decision: Type.Optional(Type.Union([
		Type.Literal("pass"),
		Type.Literal("revise"),
		Type.Literal("block")
	])),
	decisionReason: Type.Optional(Type.String({ maxLength: 2e3 }))
});
const SkillProposalEvaluationOutcomeAttribution = {
	pluginId: Type.String({
		minLength: 1,
		maxLength: 128
	}),
	pluginVersion: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 128
	})),
	evaluatorId: Type.String({
		minLength: 1,
		maxLength: 128
	})
};
const SkillProposalEvaluationOutcomeSchema = Type.Union([
	closedObject({
		...SkillProposalEvaluationOutcomeAttribution,
		status: Type.Literal("completed"),
		result: SkillProposalEvaluationResultSchema
	}),
	closedObject({
		...SkillProposalEvaluationOutcomeAttribution,
		status: Type.Literal("skipped")
	}),
	closedObject({
		...SkillProposalEvaluationOutcomeAttribution,
		status: Type.Literal("error"),
		error: Type.String({
			minLength: 1,
			maxLength: 2e3
		})
	})
]);
/** Latest completed evaluator run attached to a proposal record. */
const SkillProposalEvaluationSchema = closedObject({
	id: NonEmptyString,
	proposedVersion: NonEmptyString,
	revisionHash: Sha256String,
	trigger: Type.Union([Type.Literal("manual"), Type.Literal("apply")]),
	startedAt: NonEmptyString,
	completedAt: NonEmptyString,
	correlationId: Type.Optional(NonEmptyString),
	targetTreeSha256: Type.Optional(Sha256String),
	outcomes: Type.Array(SkillProposalEvaluationOutcomeSchema, { maxItems: 64 })
});
/** Full persisted skill proposal record. */
const SkillProposalRecordSchema = closedObject({
	schema: Type.Literal("openclaw.skill-workshop.proposal.v1"),
	id: NonEmptyString,
	kind: SkillProposalKindSchema,
	status: SkillProposalStatusSchema,
	title: NonEmptyString,
	description: NonEmptyString,
	createdAt: NonEmptyString,
	updatedAt: NonEmptyString,
	createdBy: SkillProposalSourceSchema,
	origin: Type.Optional(SkillProposalOriginSchema),
	proposedVersion: NonEmptyString,
	draftFile: Type.Literal("PROPOSAL.md"),
	draftHash: NonEmptyString,
	supportFiles: Type.Optional(Type.Array(SkillProposalSupportFileSchema, { maxItems: 64 })),
	target: SkillProposalTargetSchema,
	scan: SkillProposalScanSchema,
	goal: Type.Optional(Type.String()),
	evidence: Type.Optional(Type.String()),
	appliedAt: Type.Optional(NonEmptyString),
	rejectedAt: Type.Optional(NonEmptyString),
	quarantinedAt: Type.Optional(NonEmptyString),
	staleAt: Type.Optional(NonEmptyString),
	statusReason: Type.Optional(Type.String()),
	evaluation: Type.Optional(SkillProposalEvaluationSchema)
});
/** Condensed proposal manifest entry for list views. */
const SkillProposalManifestEntrySchema = closedObject({
	id: NonEmptyString,
	kind: SkillProposalKindSchema,
	status: SkillProposalStatusSchema,
	title: NonEmptyString,
	description: NonEmptyString,
	skillName: NonEmptyString,
	skillKey: NonEmptyString,
	createdAt: NonEmptyString,
	updatedAt: NonEmptyString,
	scanState: SkillProposalScanStateSchema
});
/** Lists skill-workshop proposals for the selected agent scope. */
const SkillsProposalsListParamsSchema = closedObject({ agentId: Type.Optional(NonEmptyString) });
/** Proposal manifest response for dashboard/workshop list views. */
const SkillsProposalsListResultSchema = closedObject({
	schema: Type.Literal("openclaw.skill-workshop.proposals-manifest.v1"),
	updatedAt: NonEmptyString,
	proposals: Type.Array(SkillProposalManifestEntrySchema)
});
/** Reads a proposal record plus editable draft/support content. */
const SkillsProposalInspectParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	proposalId: NonEmptyString
});
/** Full proposal inspection result used before apply/revise decisions. */
const SkillsProposalInspectResultSchema = closedObject({
	record: SkillProposalRecordSchema,
	revisionHash: Type.Optional(Sha256String),
	content: Type.String(),
	supportFiles: Type.Optional(Type.Array(SkillProposalSupportFileInputSchema, { maxItems: 64 }))
});
/** Creates a proposal for a new skill. */
const SkillsProposalCreateParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	name: NonEmptyString,
	description: NonEmptyString,
	content: SkillProposalContentString,
	supportFiles: Type.Optional(Type.Array(SkillProposalSupportFileInputSchema, { maxItems: 64 })),
	goal: Type.Optional(Type.String()),
	evidence: Type.Optional(Type.String())
});
/** Creates a proposal to update an existing skill. */
const SkillsProposalUpdateParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	skillName: NonEmptyString,
	description: Type.Optional(NonEmptyString),
	content: SkillProposalContentString,
	supportFiles: Type.Optional(Type.Array(SkillProposalSupportFileInputSchema, { maxItems: 64 })),
	goal: Type.Optional(Type.String()),
	evidence: Type.Optional(Type.String())
});
/** Replaces draft content/support files for an existing proposal. */
const SkillsProposalReviseParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	proposalId: NonEmptyString,
	expectedRevisionHash: Type.Optional(Sha256String),
	correlationId: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 256
	})),
	content: Type.Optional(SkillProposalContentString),
	supportFiles: Type.Optional(Type.Array(SkillProposalSupportFileInputSchema, { maxItems: 64 })),
	description: Type.Optional(NonEmptyString),
	goal: Type.Optional(Type.String()),
	evidence: Type.Optional(Type.String())
});
/** Starts an agent turn that revises a pending proposal from natural-language instructions. */
const SkillsProposalRequestRevisionParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	targetAgentId: Type.Optional(NonEmptyString),
	proposalId: NonEmptyString,
	expectedRevisionHash: Type.Optional(Sha256String),
	instructions: Type.String({
		minLength: 1,
		maxLength: 32768
	}),
	sessionKey: NonEmptyString,
	sessionId: Type.Optional(NonEmptyString),
	idempotencyKey: NonEmptyString
});
/** Chat-run acknowledgement returned after queueing a Skill Workshop revision request. */
const SkillsProposalRequestRevisionResultSchema = Type.Object({
	runId: NonEmptyString,
	status: Type.Union([
		Type.Literal("started"),
		Type.Literal("in_flight"),
		Type.Literal("ok"),
		Type.Literal("timeout"),
		Type.Literal("error")
	])
}, { additionalProperties: true });
/** Shared approve/reject/quarantine action payload for one proposal. */
const SkillsProposalActionParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	proposalId: NonEmptyString,
	expectedRevisionHash: Type.Optional(Sha256String),
	correlationId: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 256
	})),
	reason: Type.Optional(Type.String())
});
/** Runs configured proposal evaluators against the current draft. */
const SkillsProposalEvaluateParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	proposalId: NonEmptyString,
	expectedRevisionHash: Type.Optional(Sha256String),
	correlationId: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 256
	}))
});
/** Updated proposal record and completed evaluator run returned by manual evaluation. */
const SkillsProposalEvaluateResultSchema = closedObject({
	record: SkillProposalRecordSchema,
	evaluation: SkillProposalEvaluationSchema
});
const SkillProposalLifecycleEventTypeSchema = Type.Union([
	Type.Literal("created"),
	Type.Literal("revised"),
	Type.Literal("evaluation_completed"),
	Type.Literal("applied"),
	Type.Literal("rejected"),
	Type.Literal("quarantined"),
	Type.Literal("stale")
]);
const SkillProposalLifecycleEventActorSchema = closedObject({
	type: Type.Union([
		Type.Literal("agent"),
		Type.Literal("gateway"),
		Type.Literal("plugin"),
		Type.Literal("system")
	]),
	id: Type.Optional(NonEmptyString)
});
const SkillProposalLifecycleEventPayloadSchema = Type.Record(Type.String(), Type.Union([
	Type.String({ maxLength: 4e3 }),
	Type.Number(),
	Type.Boolean(),
	Type.Null()
]), {
	maxProperties: 32,
	propertyNames: Type.String({
		minLength: 1,
		maxLength: 80
	})
});
/** Durable Skill Workshop lifecycle event returned for replay. */
const SkillProposalLifecycleEventSchema = closedObject({
	sequence: Type.Integer({ minimum: 1 }),
	eventId: NonEmptyString,
	proposalId: NonEmptyString,
	proposedVersion: NonEmptyString,
	revisionHash: Sha256String,
	type: SkillProposalLifecycleEventTypeSchema,
	occurredAt: NonEmptyString,
	actor: SkillProposalLifecycleEventActorSchema,
	correlationId: Type.Optional(NonEmptyString),
	payload: Type.Optional(SkillProposalLifecycleEventPayloadSchema),
	evaluation: Type.Optional(SkillProposalEvaluationSchema)
});
/** Lists durable proposal lifecycle events after an optional sequence cursor. */
const SkillsProposalEventsListParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	proposalId: Type.Optional(NonEmptyString),
	afterSequence: Type.Optional(Type.Integer({ minimum: 0 })),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 200
	}))
});
/** Sequence-ordered proposal lifecycle replay page. */
const SkillsProposalEventsListResultSchema = closedObject({
	events: Type.Array(SkillProposalLifecycleEventSchema, { maxItems: 200 }),
	nextSequence: Type.Optional(Type.Integer({ minimum: 1 }))
});
/** Result returned after applying a skill proposal to disk. */
const SkillsProposalApplyResultSchema = closedObject({
	record: SkillProposalRecordSchema,
	targetSkillFile: NonEmptyString
});
/** Proposal record result returned after non-apply proposal actions. */
const SkillsProposalRecordResultSchema = SkillProposalRecordSchema;
const SkillCuratorEntrySchema = closedObject({
	skillFile: NonEmptyString,
	skillKey: NonEmptyString,
	skillName: NonEmptyString,
	state: Type.Union([
		Type.Literal("active"),
		Type.Literal("stale"),
		Type.Literal("archived")
	]),
	pinned: Type.Boolean(),
	createdAtMs: Type.Number(),
	stateChangedAtMs: Type.Number(),
	lastUsedAtMs: Type.Union([Type.Number(), Type.Null()]),
	useCount: Type.Number(),
	archivedReason: Type.Union([Type.String(), Type.Null()])
});
const SkillOverlapCandidateSchema = closedObject({
	left: NonEmptyString,
	right: NonEmptyString,
	score: Type.Number()
});
/** Reads persisted skill lifecycle curation state. */
const SkillsCuratorStatusParamsSchema = closedObject({});
const SkillsCuratorStatusResultSchema = closedObject({
	lastAttemptAtMs: Type.Union([Type.Number(), Type.Null()]),
	lastSuccessAtMs: Type.Union([Type.Number(), Type.Null()]),
	lastError: Type.Union([Type.String(), Type.Null()]),
	counts: closedObject({
		active: Type.Number(),
		stale: Type.Number(),
		archived: Type.Number()
	}),
	skills: Type.Array(SkillCuratorEntrySchema),
	overlaps: Type.Array(SkillOverlapCandidateSchema)
});
/** Pins, unpins, or explicitly restores one curated skill. */
const SkillsCuratorActionParamsSchema = closedObject({ skill: NonEmptyString });
const SkillsCuratorActionResultSchema = SkillCuratorEntrySchema;
/** Reads the configured tool catalog for an agent. */
const ToolsCatalogParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	includePlugins: Type.Optional(Type.Boolean())
});
/** Reads the effective tool set for one session. */
const ToolsEffectiveParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	sessionKey: NonEmptyString
});
/** Invokes one tool through the gateway tool dispatcher. */
const ToolsInvokeParamsSchema = closedObject({
	name: NonEmptyString,
	args: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
	sessionKey: Type.Optional(NonEmptyString),
	agentId: Type.Optional(NonEmptyString),
	confirm: Type.Optional(Type.Boolean()),
	idempotencyKey: Type.Optional(NonEmptyString),
	/**
	* Explicit operation-local marker for an authenticated direct operator.
	* Missing values remain delegated, and agent runtime identity wins server-side.
	*/
	conversationReadOrigin: Type.Optional(Type.Literal("direct-operator"))
});
/** Tool profile shown in catalog views. */
const ToolCatalogProfileSchema = closedObject({
	id: Type.Union([
		Type.Literal("minimal"),
		Type.Literal("coding"),
		Type.Literal("messaging"),
		Type.Literal("full")
	]),
	label: NonEmptyString
});
/** Tool catalog entry before session-specific filtering is applied. */
const ToolCatalogEntrySchema = closedObject({
	id: NonEmptyString,
	label: NonEmptyString,
	description: Type.String(),
	source: Type.Union([Type.Literal("core"), Type.Literal("plugin")]),
	pluginId: Type.Optional(NonEmptyString),
	optional: Type.Optional(Type.Boolean()),
	risk: Type.Optional(Type.Union([
		Type.Literal("low"),
		Type.Literal("medium"),
		Type.Literal("high")
	])),
	tags: Type.Optional(Type.Array(NonEmptyString)),
	defaultProfiles: Type.Array(Type.Union([
		Type.Literal("minimal"),
		Type.Literal("coding"),
		Type.Literal("messaging"),
		Type.Literal("full")
	]))
});
/** Group of related catalog tools from core or a plugin. */
const ToolCatalogGroupSchema = closedObject({
	id: NonEmptyString,
	label: NonEmptyString,
	source: Type.Union([Type.Literal("core"), Type.Literal("plugin")]),
	pluginId: Type.Optional(NonEmptyString),
	tools: Type.Array(ToolCatalogEntrySchema)
});
closedObject({
	agentId: NonEmptyString,
	profiles: Type.Array(ToolCatalogProfileSchema),
	groups: Type.Array(ToolCatalogGroupSchema)
});
/** Effective tool entry after session/profile/channel/plugin filtering. */
const ToolsEffectiveEntrySchema = closedObject({
	id: NonEmptyString,
	label: NonEmptyString,
	description: Type.String(),
	rawDescription: Type.String(),
	source: Type.Union([
		Type.Literal("core"),
		Type.Literal("plugin"),
		Type.Literal("channel"),
		Type.Literal("mcp")
	]),
	pluginId: Type.Optional(NonEmptyString),
	channelId: Type.Optional(NonEmptyString),
	mcpServer: Type.Optional(NonEmptyString),
	mcpToolName: Type.Optional(NonEmptyString),
	deniedBySession: Type.Optional(Type.Literal(true)),
	risk: Type.Optional(Type.Union([
		Type.Literal("low"),
		Type.Literal("medium"),
		Type.Literal("high")
	])),
	tags: Type.Optional(Type.Array(NonEmptyString))
});
/** Effective tool group shown to runtime/session callers. */
const ToolsEffectiveGroupSchema = closedObject({
	id: Type.Union([
		Type.Literal("core"),
		Type.Literal("plugin"),
		Type.Literal("channel"),
		Type.Literal("mcp")
	]),
	label: NonEmptyString,
	source: Type.Union([
		Type.Literal("core"),
		Type.Literal("plugin"),
		Type.Literal("channel"),
		Type.Literal("mcp")
	]),
	tools: Type.Array(ToolsEffectiveEntrySchema)
});
/** Notice explaining runtime filtering such as quarantined tool schemas. */
const ToolsEffectiveNoticeSchema = closedObject({
	id: NonEmptyString,
	severity: Type.Union([Type.Literal("info"), Type.Literal("warning")]),
	message: Type.String(),
	servers: Type.Optional(Type.Array(NonEmptyString))
});
closedObject({
	agentId: NonEmptyString,
	profile: NonEmptyString,
	groups: Type.Array(ToolsEffectiveGroupSchema),
	notices: Type.Optional(Type.Array(ToolsEffectiveNoticeSchema))
});
/** Normalized error shape for tool invocation failures. */
const ToolsInvokeErrorSchema = closedObject({
	code: NonEmptyString,
	message: NonEmptyString,
	details: Type.Optional(Type.Unknown())
});
closedObject({
	ok: Type.Boolean(),
	toolName: NonEmptyString,
	output: Type.Optional(Type.Unknown()),
	requiresApproval: Type.Optional(Type.Boolean()),
	approvalId: Type.Optional(NonEmptyString),
	source: Type.Optional(Type.Union([
		Type.Literal("core"),
		Type.Literal("plugin"),
		Type.Literal("mcp"),
		Type.Literal("channel"),
		Type.String()
	])),
	error: Type.Optional(ToolsInvokeErrorSchema)
});
//#endregion
//#region packages/gateway-protocol/src/schema/config.ts
/**
* Gateway config and update protocol schemas.
*
* These payloads carry raw config text plus optional delivery context so the
* gateway can report edits/restarts back to the originating channel.
*/
const ConfigSchemaLookupPathString = Type.String({
	minLength: 1,
	maxLength: 1024,
	pattern: "^[A-Za-z0-9_./\\[\\]\\-*]+$"
});
const ConfigDeliveryContextSchema = closedObject({
	channel: Type.Optional(Type.String()),
	to: Type.Optional(Type.String()),
	accountId: Type.Optional(Type.String()),
	threadId: Type.Optional(Type.Union([Type.String(), Type.Number()]))
});
/** Empty request payload for reading the current raw config. */
const ConfigGetParamsSchema = closedObject({});
/** Full raw config replacement request with optional base hash guard. */
const ConfigSetParamsSchema = closedObject({
	raw: NonEmptyString,
	baseHash: Type.Optional(NonEmptyString)
});
/** Shared config apply/patch payload with optional restart notification context. */
const ConfigApplyLikeParamProperties = {
	raw: NonEmptyString,
	baseHash: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(Type.String()),
	deliveryContext: Type.Optional(ConfigDeliveryContextSchema),
	note: Type.Optional(Type.String()),
	restartDelayMs: Type.Optional(Type.Integer({ minimum: 0 }))
};
/** Raw config apply request that may schedule a restart. */
const ConfigApplyParamsSchema = closedObject(ConfigApplyLikeParamProperties);
/** Raw config patch request that may schedule a restart. */
const ConfigPatchParamsSchema = closedObject({
	...ConfigApplyLikeParamProperties,
	replacePaths: Type.Optional(Type.Array(NonEmptyString, { maxItems: 256 }))
});
/** Empty request payload for fetching the generated config schema. */
const ConfigSchemaParamsSchema = closedObject({});
/** Schema lookup request for one config path. */
const ConfigSchemaLookupParamsSchema = closedObject({ path: ConfigSchemaLookupPathString });
/** Empty request payload for checking update/restart status. */
const UpdateStatusParamsSchema = closedObject({});
const UpdateCommitSchema = closedObject({
	sha: NonEmptyString,
	subject: Type.String({ maxLength: 120 })
});
/** Backward-compatible update availability metadata. */
const UpdateAvailableSchema = closedObject({
	currentVersion: NonEmptyString,
	latestVersion: NonEmptyString,
	channel: NonEmptyString,
	currentSha: Type.Optional(NonEmptyString),
	upstreamRef: Type.Optional(NonEmptyString),
	upstreamSha: Type.Optional(NonEmptyString),
	commitsBehind: Type.Optional(Type.Integer({ minimum: 0 })),
	commits: Type.Optional(Type.Array(UpdateCommitSchema, { maxItems: 5 }))
});
const GitInstallMetadataProperties = {
	currentSha: Type.Optional(NonEmptyString),
	commitAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
	installedAtMs: Type.Optional(Type.Integer({ minimum: 0 }))
};
const GitUpdateStatusSchema = Type.Union([
	closedObject({
		...GitInstallMetadataProperties,
		status: Type.Literal("current")
	}),
	closedObject({
		...GitInstallMetadataProperties,
		status: Type.Literal("behind"),
		commitsBehind: Type.Integer({ minimum: 1 })
	}),
	closedObject({
		...GitInstallMetadataProperties,
		status: Type.Literal("ahead"),
		commitsAhead: Type.Integer({ minimum: 1 })
	}),
	closedObject({
		...GitInstallMetadataProperties,
		status: Type.Literal("diverged"),
		commitsAhead: Type.Integer({ minimum: 1 }),
		commitsBehind: Type.Integer({ minimum: 1 })
	}),
	closedObject({
		...GitInstallMetadataProperties,
		status: Type.Literal("unavailable"),
		reason: Type.Union([
			Type.Literal("fetch-failed"),
			Type.Literal("no-upstream"),
			Type.Literal("no-upstream-sha"),
			Type.Literal("comparison-failed"),
			Type.Literal("git-unavailable")
		])
	})
]);
/** Authoritative automatic-update schedule and in-memory campaign state. */
const UpdateScheduleStateSchema = closedObject({
	channel: NonEmptyString,
	autoEnabled: Type.Boolean(),
	install: Type.Optional(closedObject({
		kind: Type.Union([
			Type.Literal("package"),
			Type.Literal("git"),
			Type.Literal("unknown")
		]),
		git: Type.Optional(GitUpdateStatusSchema)
	})),
	target: Type.Optional(Type.Union([closedObject({
		kind: Type.Literal("package"),
		version: NonEmptyString
	}), closedObject({
		kind: Type.Literal("git"),
		upstreamRef: NonEmptyString,
		upstreamSha: NonEmptyString,
		commitsBehind: Type.Integer({ minimum: 0 })
	})])),
	campaign: Type.Optional(closedObject({
		id: NonEmptyString,
		state: Type.Union([
			Type.Literal("waiting-for-idle"),
			Type.Literal("countdown"),
			Type.Literal("applying")
		]),
		announcedAtMs: Type.Integer({ minimum: 0 }),
		applyAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
		holdUntilMs: Type.Optional(Type.Integer({ minimum: 0 })),
		forceAtMs: Type.Integer({ minimum: 0 }),
		updatedAtMs: Type.Integer({ minimum: 0 })
	}))
});
/** Validated response payload for update.status. */
const UpdateStatusResultSchema = closedObject({
	sentinel: Type.Unknown(),
	updateAvailable: Type.Union([UpdateAvailableSchema, Type.Null()]),
	effectiveChannel: Type.Optional(Type.Union([
		Type.Literal("stable"),
		Type.Literal("extended-stable"),
		Type.Literal("beta"),
		Type.Literal("dev")
	])),
	schedule: Type.Optional(UpdateScheduleStateSchema)
});
/** Empty request payload for deferring the active update campaign. */
const UpdateHoldParamsSchema = closedObject({});
/** Result of attempting to defer the active update campaign. */
const UpdateHoldResultSchema = closedObject({
	ok: Type.Boolean(),
	schedule: Type.Optional(UpdateScheduleStateSchema)
});
/** Request payload for running an update/restart flow with optional channel delivery context. */
const UpdateRunParamsSchema = closedObject({
	sessionKey: Type.Optional(Type.String()),
	deliveryContext: Type.Optional(ConfigDeliveryContextSchema),
	note: Type.Optional(Type.String()),
	continuationMessage: Type.Optional(Type.String()),
	restartDelayMs: Type.Optional(Type.Integer({ minimum: 0 })),
	timeoutMs: Type.Optional(Type.Integer({ minimum: 1 }))
});
/** UI metadata attached to config schema paths. */
const ConfigUiHintSchema = closedObject({
	label: Type.Optional(Type.String()),
	help: Type.Optional(Type.String()),
	docsUrl: Type.Optional(Type.String()),
	tags: Type.Optional(Type.Array(Type.String())),
	group: Type.Optional(Type.String()),
	order: Type.Optional(Type.Integer()),
	advanced: Type.Optional(Type.Boolean()),
	sensitive: Type.Optional(Type.Boolean()),
	placeholder: Type.Optional(Type.String()),
	presentation: Type.Optional(Type.Literal("phone-number")),
	itemTemplate: Type.Optional(Type.Unknown())
});
/** Full generated config schema response. */
const ConfigSchemaResponseSchema = closedObject({
	schema: Type.Unknown(),
	uiHints: Type.Record(Type.String(), ConfigUiHintSchema),
	version: NonEmptyString,
	generatedAt: NonEmptyString
});
/** Child entry returned when looking up a config schema path. */
const ConfigSchemaLookupChildSchema = closedObject({
	key: NonEmptyString,
	path: NonEmptyString,
	type: Type.Optional(Type.Union([Type.String(), Type.Array(Type.String())])),
	required: Type.Boolean(),
	hasChildren: Type.Boolean(),
	reloadKind: Type.Optional(Type.Union([
		Type.Literal("restart"),
		Type.Literal("hot"),
		Type.Literal("none")
	])),
	hint: Type.Optional(ConfigUiHintSchema),
	hintPath: Type.Optional(Type.String())
});
/** Schema lookup response for one config path and its immediate children. */
const ConfigSchemaLookupResultSchema = closedObject({
	path: NonEmptyString,
	schema: Type.Unknown(),
	reloadKind: Type.Optional(Type.Union([
		Type.Literal("restart"),
		Type.Literal("hot"),
		Type.Literal("none")
	])),
	hint: Type.Optional(ConfigUiHintSchema),
	hintPath: Type.Optional(Type.String()),
	children: Type.Array(ConfigSchemaLookupChildSchema)
});
//#endregion
//#region packages/gateway-protocol/src/schema/snapshot.ts
/**
* Gateway state snapshot schemas.
*
* Snapshots are sent during hello and later event streams; they summarize node
* presence, health, session defaults, and version counters for clients.
*/
/** One gateway-visible presence record for a node/client/runtime. */
const PresenceEntrySchema = closedObject({
	host: Type.Optional(NonEmptyString),
	ip: Type.Optional(NonEmptyString),
	version: Type.Optional(NonEmptyString),
	platform: Type.Optional(NonEmptyString),
	deviceFamily: Type.Optional(NonEmptyString),
	modelIdentifier: Type.Optional(NonEmptyString),
	mode: Type.Optional(NonEmptyString),
	lastInputSeconds: Type.Optional(Type.Integer({ minimum: 0 })),
	reason: Type.Optional(NonEmptyString),
	tags: Type.Optional(Type.Array(NonEmptyString)),
	text: Type.Optional(Type.String()),
	ts: Type.Integer({ minimum: 0 }),
	deviceId: Type.Optional(NonEmptyString),
	roles: Type.Optional(Type.Array(NonEmptyString)),
	scopes: Type.Optional(Type.Array(NonEmptyString)),
	instanceId: Type.Optional(NonEmptyString),
	user: Type.Optional(closedObject({
		/** Opaque identity key: authenticated email today, durable profile id later. Clients group presence by this. */
		id: NonEmptyString,
		email: Type.Optional(NonEmptyString),
		name: Type.Optional(NonEmptyString),
		avatarUrl: Type.Optional(NonEmptyString)
	})),
	/** Session keys this connection is actively subscribed to (watching). Sorted lexicographically for deterministic snapshots. */
	watchedSessions: Type.Optional(Type.Array(NonEmptyString))
});
const HealthSessionSummarySchema = closedObject({
	path: Type.String(),
	count: Type.Integer({ minimum: 0 }),
	recent: Type.Array(closedObject({
		key: Type.String(),
		updatedAt: Type.Union([Type.Integer({ minimum: 0 }), Type.Null()]),
		age: Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])
	}))
});
const HealthSnapshotSchema = closedObject({
	ok: Type.Optional(Type.Literal(true)),
	ts: Type.Optional(Type.Integer({ minimum: 0 })),
	durationMs: Type.Optional(Type.Integer({ minimum: 0 })),
	eventLoop: Type.Optional(closedObject({
		degraded: Type.Boolean(),
		degradedSinceMs: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
		reasons: Type.Array(Type.Union([
			Type.Literal("event_loop_delay"),
			Type.Literal("event_loop_utilization"),
			Type.Literal("cpu")
		])),
		intervalMs: Type.Number({ minimum: 0 }),
		delayP99Ms: Type.Number({ minimum: 0 }),
		delayMaxMs: Type.Number({ minimum: 0 }),
		utilization: Type.Number({ minimum: 0 }),
		cpuCoreRatio: Type.Number({ minimum: 0 })
	})),
	plugins: Type.Optional(closedObject({
		loaded: Type.Array(Type.String()),
		errors: Type.Array(closedObject({
			id: Type.String(),
			origin: Type.String(),
			activated: Type.Boolean(),
			activationSource: Type.Optional(Type.String()),
			activationReason: Type.Optional(Type.String()),
			failurePhase: Type.Optional(Type.String()),
			error: Type.String()
		})),
		unavailable: Type.Optional(Type.Array(closedObject({
			id: Type.String(),
			state: Type.Literal("configured-unavailable"),
			diagnostic: closedObject({
				kind: Type.Literal("plugin-verification"),
				reason: Type.String(),
				detail: Type.String()
			})
		})))
	})),
	contextEngines: Type.Optional(closedObject({ quarantined: Type.Array(closedObject({
		engineId: Type.String(),
		owner: Type.Optional(Type.String()),
		operation: Type.String(),
		reason: Type.String(),
		failedAt: Type.Integer({ minimum: 0 })
	})) })),
	deliveryQueues: Type.Optional(closedObject({
		failed: Type.Array(closedObject({
			queueName: Type.String(),
			count: Type.Integer({ minimum: 0 }),
			oldestFailedAt: Type.Optional(Type.Integer({ minimum: 0 }))
		})),
		ingressFailed: Type.Optional(Type.Array(closedObject({
			channelId: Type.String(),
			accountId: Type.String(),
			count: Type.Integer({ minimum: 0 }),
			oldestFailedAt: Type.Optional(Type.Integer({ minimum: 0 }))
		}))),
		ingressPressure: Type.Optional(Type.Array(closedObject({
			channelId: Type.String(),
			accountId: Type.String(),
			laneCount: Type.Integer({ minimum: 0 }),
			pendingCount: Type.Integer({ minimum: 0 }),
			claimedCount: Type.Integer({ minimum: 0 }),
			blockedCount: Type.Integer({ minimum: 0 }),
			oldestReceivedAt: Type.Integer({ minimum: 0 })
		})))
	})),
	modelPricing: Type.Optional(closedObject({
		state: Type.Union([
			Type.Literal("ok"),
			Type.Literal("degraded"),
			Type.Literal("disabled")
		]),
		sources: Type.Array(closedObject({
			source: Type.Union([
				Type.Literal("openrouter"),
				Type.Literal("litellm"),
				Type.Literal("bootstrap"),
				Type.Literal("refresh")
			]),
			state: Type.Union([Type.Literal("ok"), Type.Literal("degraded")]),
			lastFailureAt: Type.Optional(Type.Integer({ minimum: 0 })),
			detail: Type.Optional(Type.String())
		})),
		lastFailureAt: Type.Optional(Type.Integer({ minimum: 0 })),
		detail: Type.Optional(Type.String())
	})),
	configReload: Type.Optional(closedObject({ hotReloadStatus: Type.Union([Type.Literal("active"), Type.Literal("disabled")]) })),
	channels: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
	channelOrder: Type.Optional(Type.Array(Type.String())),
	channelLabels: Type.Optional(Type.Record(Type.String(), Type.String())),
	heartbeatSeconds: Type.Optional(Type.Integer({ minimum: 0 })),
	defaultAgentId: Type.Optional(Type.String()),
	agents: Type.Optional(Type.Array(closedObject({
		agentId: Type.String(),
		name: Type.Optional(Type.String()),
		isDefault: Type.Boolean(),
		heartbeat: closedObject({
			enabled: Type.Boolean(),
			every: Type.String(),
			everyMs: Type.Union([Type.Integer({ minimum: 0 }), Type.Null()]),
			prompt: Type.String(),
			target: Type.String(),
			model: Type.Optional(Type.String()),
			session: Type.Optional(Type.String()),
			ackMaxChars: Type.Integer({ minimum: 0 })
		}),
		sessions: HealthSessionSummarySchema
	}))),
	sessions: Type.Optional(HealthSessionSummarySchema)
});
/** Default session routing keys included in initial gateway snapshots. */
const SessionDefaultsSchema = closedObject({
	defaultAgentId: NonEmptyString,
	ownership: Type.Optional(AgentOwnershipSchema),
	selectionRequired: Type.Optional(Type.Boolean()),
	mainKey: NonEmptyString,
	mainSessionKey: NonEmptyString,
	scope: Type.Optional(NonEmptyString)
});
/** Monotonic version counters for snapshot subtrees. */
const StateVersionSchema = closedObject({
	presence: Type.Integer({ minimum: 0 }),
	health: Type.Integer({ minimum: 0 })
});
/** Initial and incremental gateway state snapshot payload. */
const SnapshotSchema = closedObject({
	presence: Type.Array(PresenceEntrySchema),
	health: HealthSnapshotSchema,
	stateVersion: StateVersionSchema,
	uptimeMs: Type.Integer({ minimum: 0 }),
	/** Resolved source-config revision accepted by the active Gateway runtime. */
	appliedConfigHash: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	configPath: Type.Optional(NonEmptyString),
	stateDir: Type.Optional(NonEmptyString),
	sessionDefaults: Type.Optional(SessionDefaultsSchema),
	authMode: Type.Optional(Type.Union([
		Type.Literal("none"),
		Type.Literal("token"),
		Type.Literal("password"),
		Type.Literal("trusted-proxy")
	])),
	updateAvailable: Type.Optional(UpdateAvailableSchema),
	updateSchedule: Type.Optional(UpdateScheduleStateSchema)
});
//#endregion
//#region packages/gateway-protocol/src/schema/frames.ts
const GATEWAY_SERVER_CAPS = {
	BOARD_WIDGET_PUT_CANVAS_DOC: "board-widget-put-canvas-doc",
	CHAT_SEND_ROUTING_CONTRACT: "chat-send-routing-contract",
	SYSTEM_AGENT_WIZARD_CANCEL: "openclaw-chat-wizard-cancel",
	SYSTEM_AGENT_SETUP_MODEL_REF: "openclaw-setup-model-ref",
	TASK_SUGGESTIONS_ACCEPT_MODES: "taskSuggestions.acceptModes"
};
/**
* Top-level gateway frame schemas.
*
* These are the WebSocket envelope contracts; method/event payload schemas live
* in feature-specific modules and are referenced by runtime validators.
*/
/** Periodic server heartbeat event payload. */
const TickEventSchema = closedObject({ ts: Type.Integer({ minimum: 0 }) });
/** Server shutdown notice event payload. */
const ShutdownEventSchema = closedObject({
	reason: NonEmptyString,
	restartExpectedMs: Type.Optional(Type.Integer({ minimum: 0 }))
});
/** Initial client hello/connect payload sent before the gateway accepts frames. */
const ConnectParamsSchema = closedObject({
	minProtocol: Type.Integer({ minimum: 1 }),
	maxProtocol: Type.Integer({ minimum: 1 }),
	client: closedObject({
		id: GatewayClientIdSchema,
		displayName: Type.Optional(NonEmptyString),
		version: NonEmptyString,
		buildId: Type.Optional(Type.String({
			minLength: 1,
			maxLength: 96
		})),
		platform: NonEmptyString,
		deviceFamily: Type.Optional(NonEmptyString),
		modelIdentifier: Type.Optional(NonEmptyString),
		mode: GatewayClientModeSchema,
		instanceId: Type.Optional(NonEmptyString)
	}),
	caps: Type.Optional(Type.Array(NonEmptyString, { default: [] })),
	commands: Type.Optional(Type.Array(NonEmptyString)),
	/** Additive Computer Use declaration; the owning core contract validates its bounded shape. */
	computerUse: Type.Optional(Type.Unknown()),
	/** Additive node-local worker build identity; presence advertises session hosting. */
	workerRuns: Type.Optional(WorkerAdmissionHandshakeSchema),
	permissions: Type.Optional(Type.Record(NonEmptyString, Type.Boolean())),
	pathEnv: Type.Optional(Type.String()),
	role: Type.Optional(NonEmptyString),
	scopes: Type.Optional(Type.Array(NonEmptyString)),
	device: Type.Optional(closedObject({
		id: NonEmptyString,
		publicKey: NonEmptyString,
		signature: NonEmptyString,
		signedAt: Type.Integer({ minimum: 0 }),
		nonce: NonEmptyString
	})),
	auth: Type.Optional(closedObject({
		token: Type.Optional(Type.String()),
		bootstrapToken: Type.Optional(Type.String()),
		deviceToken: Type.Optional(Type.String()),
		password: Type.Optional(Type.String()),
		approvalRuntimeToken: Type.Optional(Type.String()),
		agentRuntimeIdentityToken: Type.Optional(Type.String())
	})),
	locale: Type.Optional(Type.String()),
	userAgent: Type.Optional(Type.String())
});
/** Successful gateway hello response with the server protocol and initial state. */
const HelloOkSchema = closedObject({
	type: Type.Literal("hello-ok"),
	protocol: Type.Integer({ minimum: 1 }),
	server: closedObject({
		version: NonEmptyString,
		buildId: Type.Optional(Type.String({
			minLength: 1,
			maxLength: 96
		})),
		controlUiBuildSource: Type.Optional(Type.Union([Type.Literal("bundled"), Type.Literal("configured")])),
		connId: NonEmptyString
	}),
	features: closedObject({
		methods: Type.Array(NonEmptyString),
		events: Type.Array(NonEmptyString),
		capabilities: Type.Optional(Type.Array(NonEmptyString))
	}),
	snapshot: SnapshotSchema,
	controlUiTabs: Type.Optional(Type.Array(closedObject({
		pluginId: NonEmptyString,
		id: NonEmptyString,
		label: NonEmptyString,
		description: Type.Optional(Type.String()),
		icon: Type.Optional(Type.String()),
		path: Type.Optional(Type.String()),
		requiresGatewayAuth: Type.Optional(Type.Boolean()),
		group: Type.Optional(Type.Union([Type.Literal("control"), Type.Literal("agent")])),
		order: Type.Optional(Type.Number())
	}))),
	controlUiWidgetKinds: Type.Optional(Type.Array(closedObject({
		pluginId: NonEmptyString,
		kind: NonEmptyString,
		label: NonEmptyString
	}))),
	pluginSurfaceUrls: Type.Optional(Type.Record(NonEmptyString, NonEmptyString)),
	deviceAuthMigration: Type.Optional(closedObject({ pending: Type.Literal(true) })),
	auth: closedObject({
		deviceToken: Type.Optional(NonEmptyString),
		recoveryMigrationAllowed: Type.Optional(Type.Literal(true)),
		recoveryScope: Type.Optional(NonEmptyString),
		role: NonEmptyString,
		scopes: Type.Array(NonEmptyString),
		issuedAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
		deviceTokens: Type.Optional(Type.Array(closedObject({
			deviceToken: NonEmptyString,
			role: NonEmptyString,
			scopes: Type.Array(NonEmptyString),
			issuedAtMs: Type.Integer({ minimum: 0 })
		})))
	}),
	policy: closedObject({
		maxPayload: Type.Integer({ minimum: 1 }),
		maxBufferedBytes: Type.Integer({ minimum: 1 }),
		tickIntervalMs: Type.Integer({ minimum: 1 }),
		attachments: Type.Optional(closedObject({
			maxBytes: Type.Integer({ minimum: 1 }),
			maxImageBytes: Type.Integer({ minimum: 1 })
		})),
		allowedSessionVisibilities: Type.Optional(Type.Array(SessionVisibilitySchema)),
		hasMultipleSessionSharingIdentities: Type.Optional(Type.Boolean())
	})
});
/** Standard structured error shape used in response frames and connect failures. */
const ErrorShapeSchema = closedObject({
	code: NonEmptyString,
	message: NonEmptyString,
	details: Type.Optional(Type.Unknown()),
	retryable: Type.Optional(Type.Boolean()),
	retryAfterMs: Type.Optional(Type.Integer({ minimum: 0 }))
});
/** Client request frame envelope; `method` selects the payload validator. */
const RequestFrameSchema = closedObject({
	type: Type.Literal("req"),
	id: NonEmptyString,
	method: NonEmptyString,
	params: Type.Optional(Type.Unknown()),
	traceparent: Type.Optional(Type.String({ maxLength: 128 }))
});
/** Server response frame envelope paired with a prior request id. */
const ResponseFrameSchema = closedObject({
	type: Type.Literal("res"),
	id: NonEmptyString,
	ok: Type.Boolean(),
	payload: Type.Optional(Type.Unknown()),
	error: Type.Optional(ErrorShapeSchema)
});
/** Server event frame envelope; `event` selects the payload validator. */
const EventFrameSchema = closedObject({
	type: Type.Literal("event"),
	event: NonEmptyString,
	payload: Type.Optional(Type.Unknown()),
	seq: Type.Optional(Type.Integer({ minimum: 0 })),
	stateVersion: Type.Optional(StateVersionSchema)
});
const GatewayFrameSchema = Type.Union([
	RequestFrameSchema,
	ResponseFrameSchema,
	EventFrameSchema
], { discriminator: "type" });
//#endregion
//#region packages/gateway-protocol/src/schema/logs-chat.ts
/** Cursor-based request for the gateway log tail endpoint. */
const LogsTailParamsSchema = closedObject({
	cursor: Type.Optional(Type.Integer({ minimum: 0 })),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 5e3
	})),
	maxBytes: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 1e6
	}))
});
/** Gateway log tail payload returned to dashboard clients. */
const LogsTailResultSchema = closedObject({
	file: NonEmptyString,
	cursor: Type.Integer({ minimum: 0 }),
	size: Type.Integer({ minimum: 0 }),
	lines: Type.Array(Type.String()),
	truncated: Type.Optional(Type.Boolean()),
	reset: Type.Optional(Type.Boolean())
});
/** Session-scoped history request used by WebChat and native WebSocket clients. */
const ChatHistoryParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: CHAT_HISTORY_MAX_ENTRIES
	})),
	offset: Type.Optional(Type.Integer({ minimum: 0 })),
	messageId: Type.Optional(NonEmptyString),
	sessionId: Type.Optional(NonEmptyString),
	maxChars: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 5e5
	}))
});
/** Lightweight chat metadata request; optional agent scope keeps selector state explicit. */
const ChatMetadataParamsSchema = closedObject({ agentId: Type.Optional(NonEmptyString) });
/** Batched purpose-title request for tool calls rendered in the Control UI. */
const ChatToolTitlesParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	items: Type.Array(closedObject({
		id: Type.String({
			minLength: 1,
			maxLength: 64
		}),
		name: Type.String({
			minLength: 1,
			maxLength: 200
		}),
		input: Type.String({
			minLength: 1,
			maxLength: 4e3
		})
	}), {
		minItems: 1,
		maxItems: 24
	})
});
/**
* Titles keyed by the caller-provided item id; missing ids mean no title.
* `disabled: true` tells clients the gateway has tool titles switched off so
* they stop requesting for the rest of the session.
*/
const ChatToolTitlesResultSchema = closedObject({
	titles: Type.Record(Type.String(), Type.String()),
	disabled: Type.Optional(Type.Boolean())
});
/** Fetches one stored chat message without forcing history callers to request huge payloads. */
const ChatMessageGetParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	messageId: NonEmptyString,
	maxChars: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 2e6
	}))
});
closedObject({
	ok: Type.Boolean(),
	message: Type.Optional(Type.Unknown()),
	unavailableReason: Type.Optional(Type.Union([
		Type.Literal("not_found"),
		Type.Literal("oversized"),
		Type.Literal("not_visible")
	]))
});
/** Permissive attachment envelope shared by chat and session entrypoints. */
const ChatAttachmentSchema = Type.Object({
	type: Type.Optional(Type.String()),
	mimeType: Type.Optional(Type.String()),
	fileName: Type.Optional(Type.String()),
	content: Type.Optional(Type.Unknown()),
	sizeBytes: Type.Optional(Type.Number()),
	durationMs: Type.Optional(Type.Number()),
	width: Type.Optional(Type.Number()),
	height: Type.Optional(Type.Number())
}, { additionalProperties: true });
/** Attachment list shared by chat.send and session creation's initial turn. */
const ChatAttachmentsSchema = Type.Array(ChatAttachmentSchema);
/** Opaque, out-of-band plugin bindings carried separately from model input. */
const RunToolBindingsSchema = Type.Record(Type.String({
	minLength: 1,
	maxLength: 128
}), Type.Unknown(), { maxProperties: 16 });
/** User-to-agent send request; idempotency key lets clients safely retry transport failures. */
const ChatSendParamsSchema = closedObject({
	sessionKey: ChatSendSessionKeyString,
	agentId: Type.Optional(NonEmptyString),
	sessionId: Type.Optional(NonEmptyString),
	message: Type.String(),
	thinking: Type.Optional(Type.String()),
	fastMode: Type.Optional(Type.Union([Type.Boolean(), Type.Literal("auto")])),
	fastAutoOnSeconds: Type.Optional(Type.Integer({ minimum: 1 })),
	queueMode: Type.Optional(Type.String({ enum: [...[
		"steer",
		"followup",
		"collect",
		"interrupt"
	]] })),
	deliver: Type.Optional(Type.Boolean()),
	originatingChannel: Type.Optional(Type.String()),
	originatingTo: Type.Optional(Type.String()),
	originatingAccountId: Type.Optional(Type.String()),
	originatingThreadId: Type.Optional(Type.String()),
	replyToId: Type.Optional(NonEmptyString),
	attachments: Type.Optional(ChatAttachmentsSchema),
	toolBindings: Type.Optional(RunToolBindingsSchema),
	timeoutMs: Type.Optional(Type.Integer({ minimum: 0 })),
	systemInputProvenance: Type.Optional(InputProvenanceSchema),
	systemProvenanceReceipt: Type.Optional(Type.String()),
	suppressCommandInterpretation: Type.Optional(Type.Boolean()),
	expectedLeafEntryId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	expectedRunId: Type.Optional(NonEmptyString),
	expectedSessionRoutingContract: Type.Optional(NonEmptyString),
	idempotencyKey: NonEmptyString
});
/** Cancels the active or named run for a chat session. */
const ChatAbortParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	preserveSideRuns: Type.Optional(Type.Boolean())
});
/** Inserts an operator-visible synthetic message into an existing chat transcript. */
const ChatInjectParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	message: NonEmptyString,
	label: Type.Optional(Type.String({ maxLength: 100 }))
});
/** Shared event fields preserve stream ordering and route events to the right session. */
const ChatEventBaseSchema = {
	runId: NonEmptyString,
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	spawnedBy: Type.Optional(NonEmptyString),
	seq: Type.Integer({ minimum: 0 })
};
/** Stable error categories exposed over the chat stream. */
const ChatEventErrorKindSchema = Type.Union([
	Type.Literal("refusal"),
	Type.Literal("timeout"),
	Type.Literal("rate_limit"),
	Type.Literal("context_length"),
	Type.Literal("unknown")
]);
/** Coarse startup stages shown while a run has not produced visible activity yet. */
const ChatRunStartupPhaseSchema = Type.Union([
	Type.Literal("preparing_workspace"),
	Type.Literal("provisioning_environment"),
	Type.Literal("preparing_context"),
	Type.Literal("starting_model")
]);
/** Non-terminal run status emitted before assistant or tool activity becomes visible. */
const ChatStatusEventSchema = closedObject({
	...ChatEventBaseSchema,
	state: Type.Literal("status"),
	phase: ChatRunStartupPhaseSchema
});
/** Incremental assistant output event; `replace` marks full-content refresh deltas. */
const ChatDeltaEventSchema = closedObject({
	...ChatEventBaseSchema,
	state: Type.Literal("delta"),
	message: Type.Optional(Type.Unknown()),
	deltaText: Type.String(),
	replace: Type.Optional(Type.Boolean()),
	usage: Type.Optional(Type.Unknown())
});
/** Successful terminal event for a completed chat run. */
const ChatFinalEventSchema = closedObject({
	...ChatEventBaseSchema,
	state: Type.Literal("final"),
	message: Type.Optional(Type.Unknown()),
	usage: Type.Optional(Type.Unknown()),
	stopReason: Type.Optional(Type.String()),
	yielded: Type.Optional(Type.Literal(true))
});
/** Terminal event for user-initiated or coordinator-initiated cancellation. */
const ChatAbortedEventSchema = closedObject({
	...ChatEventBaseSchema,
	state: Type.Literal("aborted"),
	message: Type.Optional(Type.Unknown()),
	errorMessage: Type.Optional(Type.String()),
	stopReason: Type.Optional(Type.String())
});
/** Terminal event for failed chat runs with an optional normalized failure kind. */
const ChatErrorEventSchema = closedObject({
	...ChatEventBaseSchema,
	state: Type.Literal("error"),
	message: Type.Optional(Type.Unknown()),
	errorMessage: Type.Optional(Type.String()),
	errorKind: Type.Optional(ChatEventErrorKindSchema),
	usage: Type.Optional(Type.Unknown()),
	stopReason: Type.Optional(Type.String())
});
/** Public chat stream event union consumed by gateway protocol validators. */
const ChatEventSchema = Type.Union([
	ChatStatusEventSchema,
	ChatDeltaEventSchema,
	ChatFinalEventSchema,
	ChatAbortedEventSchema,
	ChatErrorEventSchema
]);
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-create.ts
/** Creates or adopts a session with optional model, thinking, label, and parent linkage. */
const SessionsCreateParamsSchema = closedObject({
	key: Type.Optional(NonEmptyString),
	agentId: Type.Optional(NonEmptyString),
	label: Type.Optional(SessionLabelString),
	model: Type.Optional(NonEmptyString),
	thinkingLevel: Type.Optional(NonEmptyString),
	incognito: Type.Optional(Type.Boolean()),
	visibility: Type.Optional(SessionVisibilitySchema),
	catalogId: Type.Optional(NonEmptyString),
	parentSessionKey: Type.Optional(NonEmptyString),
	spawnDepth: Type.Optional(Type.Integer({
		minimum: 1,
		description: "Spawn-lineage depth for spawn-owned creations (visible subagent sessions); requires parentSessionKey. Omitted creations persist as root sessions (depth 0)."
	})),
	fork: Type.Optional(Type.Boolean({ description: "Fork the parent transcript; requires parentSessionKey." })),
	forkFrom: Type.Optional(Type.Literal("last-completed", { description: "Fork through the parent's last completed assistant message; requires fork=true." })),
	emitCommandHooks: Type.Optional(Type.Boolean()),
	succeedsParent: Type.Optional(Type.Boolean({ description: "When sessions.create creates a distinct child, whether that child succeeds its parent and emits the parent's terminal session_end. Requires parentSessionKey and emitCommandHooks. False keeps the parent active; omission preserves legacy behavior." })),
	task: Type.Optional(Type.String()),
	message: Type.Optional(Type.String()),
	attachments: Type.Optional(ChatAttachmentsSchema),
	projectId: Type.Optional(Type.String({
		minLength: 1,
		description: "Start in a registered project; operator.write."
	})),
	worktree: Type.Optional(Type.Boolean()),
	worktreeBaseRef: Type.Optional(Type.String({
		minLength: 1,
		description: "Base ref for the new managed worktree branch. Requires worktree=true."
	})),
	worktreeName: Type.Optional(Type.String({
		pattern: "^[a-z0-9][a-z0-9-]{0,63}$",
		description: "Managed worktree name; becomes branch openclaw/<name>. Requires worktree=true."
	})),
	execNode: Type.Optional(Type.String({
		minLength: 1,
		description: "Bind session exec to host=node with this node id/name. Requires operator.admin."
	})),
	cwd: Type.Optional(Type.String({
		minLength: 1,
		description: "Absolute Gateway working directory, managed-worktree source directory, or working directory on execNode. Gateway paths outside configured agent workspaces and all execNode paths require operator.admin."
	}))
});
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-recover.ts
/** Recovers one restart-tombstoned session into a fresh same-agent session. */
const SessionsRecoverParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
});
const SessionRecoveryContinuationOutcomeSchema = Type.Union([closedObject({
	status: Type.Literal("started"),
	runId: NonEmptyString
}), closedObject({
	status: Type.Literal("rejected"),
	error: ErrorShapeSchema
})]);
const SessionsRecoverResultSchema = closedObject({
	ok: Type.Literal(true),
	key: NonEmptyString,
	sessionId: NonEmptyString,
	continuation: SessionRecoveryContinuationOutcomeSchema
});
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-resolve.ts
/** Resolves a session by key, raw session id, label, short URL id, or parent/agent scope. */
const SessionsResolveParamsSchema = closedObject({
	key: Type.Optional(NonEmptyString),
	sessionId: Type.Optional(NonEmptyString),
	label: Type.Optional(SessionLabelString),
	/** Bare 8-32 character hexadecimal prefix of a session key's trailing UUID. */
	shortId: Type.Optional(NonEmptyString),
	/** Optional display-name slug used only to narrow ambiguous shortId matches. */
	slugHint: Type.Optional(NonEmptyString),
	agentId: Type.Optional(NonEmptyString),
	spawnedBy: Type.Optional(NonEmptyString),
	includeGlobal: Type.Optional(Type.Boolean()),
	includeUnknown: Type.Optional(Type.Boolean()),
	/** Return a successful `{ ok: false }` response when the selector does not match a session. */
	allowMissing: Type.Optional(Type.Boolean())
});
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-patch.ts
const SESSIONS_PATCH_MANY_MAX_TARGETS = 100;
const SessionsPatchMutationProperties = {
	label: Type.Optional(Type.Union([SessionLabelString, Type.Null()])),
	/** User-defined organization bucket ("category", not chat-group); null clears it. */
	category: Type.Optional(Type.Union([SessionLabelString, Type.Null()])),
	boardFace: Type.Optional(Type.Union([Type.Literal("chat"), Type.Literal("dashboard")])),
	statusNote: Type.Optional(Type.Union([Type.String({ maxLength: 120 }), Type.Null()], { description: "Short expiring sidebar status note; null clears it and any declared attention." })),
	attention: Type.Optional(Type.Union([Type.String({ enum: [...SESSION_AGENT_ATTENTION_ICON_IDS] }), Type.Null()])),
	ttlMinutes: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 120
	})),
	archived: Type.Optional(Type.Boolean()),
	pinned: Type.Optional(Type.Boolean()),
	unread: Type.Optional(Type.Boolean({ description: "Set true to mark unread; false records the session as read." })),
	thinkingLevel: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	fastMode: Type.Optional(Type.Union([
		Type.Boolean(),
		Type.Literal("auto"),
		Type.Null()
	])),
	toolOverrides: Type.Optional(Type.Union([SessionToolOverridesSchema, Type.Null()])),
	verboseLevel: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	traceLevel: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	reasoningLevel: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	responseUsage: Type.Optional(Type.Union([
		Type.Literal("off"),
		Type.Literal("tokens"),
		Type.Literal("full"),
		Type.Literal("on"),
		Type.Null()
	])),
	elevatedLevel: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	execHost: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	execSecurity: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	execAsk: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	execNode: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	model: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	completionOwnerSessionKey: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	inheritedToolPolicyVersion: Type.Optional(Type.Union([Type.Literal(1), Type.Null()])),
	inheritedToolAllow: Type.Optional(Type.Union([Type.Array(NonEmptyString), Type.Null()])),
	inheritedToolDeny: Type.Optional(Type.Union([Type.Array(NonEmptyString), Type.Null()])),
	sendPolicy: Type.Optional(Type.Union([
		Type.Literal("allow"),
		Type.Literal("deny"),
		Type.Null()
	])),
	groupActivation: Type.Optional(Type.Union([
		Type.Literal("mention"),
		Type.Literal("always"),
		Type.Null()
	]))
};
/** Mutable per-session preferences and routing metadata. */
const SessionsPatchParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	/** Reject the mutation if the session was reset or replaced before it commits. */
	expectedSessionId: Type.Optional(NonEmptyString),
	expectedLifecycleRevision: Type.Optional(NonEmptyString),
	...SessionsPatchMutationProperties
});
const SessionsPatchMutationSchema = Type.Object(SessionsPatchMutationProperties, {
	additionalProperties: false,
	minProperties: 1
});
const SessionsPatchManyTargetSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	expectedSessionId: Type.Optional(NonEmptyString),
	expectedLifecycleRevision: Type.Optional(NonEmptyString)
});
const SessionsPatchManyParamsSchema = closedObject({
	targets: Type.Array(SessionsPatchManyTargetSchema, {
		minItems: 1,
		maxItems: 100
	}),
	patch: SessionsPatchMutationSchema
});
const SessionsPatchManyOutcomeIdentitySchema = {
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
};
const SessionsPatchManyResultSchema = closedObject({ outcomes: Type.Array(Type.Union([closedObject({
	ok: Type.Literal(true),
	...SessionsPatchManyOutcomeIdentitySchema
}), closedObject({
	ok: Type.Literal(false),
	...SessionsPatchManyOutcomeIdentitySchema,
	error: ErrorShapeSchema
})])) });
//#endregion
//#region packages/gateway-protocol/src/schema/sessions.ts
const SESSION_OBSERVER_HEALTH_VALUES = [
	"on-track",
	"grinding",
	"stuck",
	"waiting-on-user",
	"wrapping-up",
	"done",
	"failed"
];
/** Trajectory judgment produced for one observed agent session. */
const SessionObserverHealthSchema = Type.Union([
	Type.Literal("on-track"),
	Type.Literal("grinding"),
	Type.Literal("stuck"),
	Type.Literal("waiting-on-user"),
	Type.Literal("wrapping-up"),
	Type.Literal("done"),
	Type.Literal("failed")
]);
/** Completed and total step counts from the session's current plan. */
const SessionObserverPlanProgressSchema = closedObject({
	completed: Type.Integer({ minimum: 0 }),
	total: Type.Integer({ minimum: 0 })
});
/** Live session status judgment broadcast to subscribed operator clients. */
const SessionObserverDigestSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	revision: Type.Integer({ minimum: 1 }),
	updatedAt: Type.Integer({ minimum: 0 }),
	headline: Type.String({
		minLength: 1,
		maxLength: 120
	}),
	assessment: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 320
	})),
	health: SessionObserverHealthSchema,
	planProgress: Type.Optional(SessionObserverPlanProgressSchema)
});
/** Declares whether this connection currently renders session observer output. */
const SessionsObserverVisibilityParamsSchema = closedObject({ visible: Type.Boolean() });
/** Acknowledges a connection's observer visibility declaration. */
const SessionsObserverVisibilityResultSchema = closedObject({ ok: Type.Literal(true) });
/** One bounded question/answer exchange in the ephemeral session companion. */
const SessionCompanionExchangeSchema = closedObject({
	question: Type.String({
		minLength: 1,
		maxLength: 400
	}),
	answer: Type.String({
		minLength: 1,
		maxLength: 1200
	}),
	ts: Type.Integer({ minimum: 0 })
});
/** Asks the read-only companion about one session and its workspace. */
const SessionsCompanionAskParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	question: Type.String({
		minLength: 1,
		maxLength: 400
	})
});
/** Companion answer returned only to the requesting operator. */
const SessionsCompanionAskResultSchema = closedObject({
	answer: Type.String({
		minLength: 1,
		maxLength: 1200
	}),
	ts: Type.Integer({ minimum: 0 })
});
/** Selects the in-memory companion thread for one session. */
const SessionsCompanionStateParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
});
/** Current bounded exchanges for one session companion thread. */
const SessionsCompanionStateResultSchema = closedObject({ exchanges: Type.Array(SessionCompanionExchangeSchema, { maxItems: 24 }) });
/** Selects the in-memory companion thread to clear. */
const SessionsCompanionResetParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
});
/** Acknowledges clearing one companion thread. */
const SessionsCompanionResetResultSchema = closedObject({ ok: Type.Literal(true) });
/**
* Session protocol schemas.
*
* These requests and results cover transcript discovery, lifecycle control,
* compaction checkpoints, per-session plugin state, and usage reporting. The
* schemas are shared by dashboard, CLI, ACP, and gateway RPC callers.
*/
/** Reason a compaction checkpoint was created. */
const SessionCompactionCheckpointReasonSchema = Type.Union([
	Type.Literal("manual"),
	Type.Literal("auto-threshold"),
	Type.Literal("overflow-retry"),
	Type.Literal("timeout-retry")
]);
closedObject({
	operationId: NonEmptyString,
	operation: Type.Literal("compact"),
	phase: Type.Union([Type.Literal("start"), Type.Literal("end")]),
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	ts: Type.Integer({ minimum: 0 }),
	completed: Type.Optional(Type.Boolean()),
	reason: Type.Optional(Type.String())
});
/** Reference to the transcript location before or after compaction. */
const SessionCompactionTranscriptReferenceSchema = closedObject({
	sessionId: NonEmptyString,
	sessionFile: Type.Optional(NonEmptyString),
	leafId: Type.Optional(NonEmptyString),
	entryId: Type.Optional(NonEmptyString)
});
/** Stored compaction checkpoint metadata for branching or restoring a session. */
const SessionCompactionCheckpointSchema = closedObject({
	checkpointId: NonEmptyString,
	sessionKey: NonEmptyString,
	sessionId: NonEmptyString,
	createdAt: Type.Integer({ minimum: 0 }),
	reason: SessionCompactionCheckpointReasonSchema,
	tokensBefore: Type.Optional(Type.Integer({ minimum: 0 })),
	tokensAfter: Type.Optional(Type.Integer({ minimum: 0 })),
	tokensVersion: Type.Optional(Type.Literal(1)),
	summary: Type.Optional(Type.String()),
	firstKeptEntryId: Type.Optional(NonEmptyString),
	preCompaction: SessionCompactionTranscriptReferenceSchema,
	postCompaction: SessionCompactionTranscriptReferenceSchema
});
/** Session file grouping used by the Control UI session workspace rail. */
const SessionFileKindSchema = Type.Union([Type.Literal("modified"), Type.Literal("read")]);
/** Session relevance marker for browser entries. */
const SessionFileRelevanceSchema = Type.Union([
	Type.Literal("modified"),
	Type.Literal("read"),
	Type.Literal("mixed")
]);
/** Encoding used when a session file preview includes inline content. */
const SessionFileContentEncodingSchema = Type.Union([Type.Literal("utf8"), Type.Literal("base64")]);
/** Renderer class selected for one session workspace file preview. */
const SessionFilePreviewKindSchema = Type.Union([
	Type.Literal("text"),
	Type.Literal("image"),
	Type.Literal("unsupported")
]);
const SessionFileHashSchema = Type.String({
	minLength: 64,
	maxLength: 64,
	pattern: "^[a-f0-9]{64}$"
});
/** One file path referenced by a session transcript. */
const SessionFileEntrySchema = closedObject({
	path: NonEmptyString,
	workspacePath: Type.Optional(NonEmptyString),
	name: NonEmptyString,
	kind: SessionFileKindSchema,
	missing: Type.Boolean(),
	size: Type.Optional(Type.Integer({ minimum: 0 })),
	updatedAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
	content: Type.Optional(Type.String()),
	hash: Type.Optional(SessionFileHashSchema),
	mimeType: Type.Optional(NonEmptyString),
	contentEncoding: Type.Optional(SessionFileContentEncodingSchema),
	previewKind: Type.Optional(SessionFilePreviewKindSchema)
});
/** One file or folder in the session-rooted browser. */
const SessionFileBrowserEntrySchema = closedObject({
	path: Type.String(),
	name: NonEmptyString,
	kind: Type.Union([Type.Literal("file"), Type.Literal("directory")]),
	sessionKind: Type.Optional(SessionFileRelevanceSchema),
	size: Type.Optional(Type.Integer({ minimum: 0 })),
	updatedAtMs: Type.Optional(Type.Integer({ minimum: 0 }))
});
/** Folder listing or search result rooted at the session workspace. */
const SessionFileBrowserResultSchema = closedObject({
	path: Type.String(),
	parentPath: Type.Optional(Type.String()),
	search: Type.Optional(Type.String()),
	entries: Type.Array(SessionFileBrowserEntrySchema),
	truncated: Type.Optional(Type.Boolean())
});
/** Lists files touched by a session transcript. */
const SessionsFilesListParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	path: Type.Optional(Type.String()),
	search: Type.Optional(Type.String())
});
/** File references visible in one session workspace. */
const SessionsFilesListResultSchema = closedObject({
	sessionKey: NonEmptyString,
	root: Type.Optional(NonEmptyString),
	/** Whether the session workspace directory is inside a git checkout; absent when the workspace root is unknown or the gateway predates the field. */
	gitCheckout: Type.Optional(Type.Boolean()),
	files: Type.Array(SessionFileEntrySchema),
	browser: Type.Optional(SessionFileBrowserResultSchema)
});
/** Reads one session-referenced file by path. */
const SessionsFilesGetParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	path: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
});
/** Result for reading one session-referenced file. */
const SessionsFilesGetResultSchema = closedObject({
	sessionKey: NonEmptyString,
	root: Type.Optional(NonEmptyString),
	file: SessionFileEntrySchema
});
/** Overwrites one existing session workspace file with hash-based CAS. */
const SessionsFilesSetParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	path: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	content: Type.String(),
	expectedHash: SessionFileHashSchema
});
/** Result for overwriting one session workspace file. */
const SessionsFilesSetResultSchema = closedObject({
	sessionKey: NonEmptyString,
	root: Type.Optional(NonEmptyString),
	file: SessionFileEntrySchema
});
/** Opens a session workspace on the Gateway host without accepting a client path. */
const SessionsFilesRevealParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
});
/** Result for revealing a session workspace on the Gateway host. */
const SessionsFilesRevealResultSchema = closedObject({
	ok: Type.Boolean(),
	path: Type.Optional(NonEmptyString),
	error: Type.Optional(NonEmptyString)
});
/** Change status for one file in a session checkout diff. */
const SessionDiffFileStatusSchema = Type.Union([
	Type.Literal("added"),
	Type.Literal("modified"),
	Type.Literal("deleted"),
	Type.Literal("renamed")
]);
/** One changed file in a session checkout diff. */
const SessionDiffFileSchema = closedObject({
	path: NonEmptyString,
	oldPath: Type.Optional(NonEmptyString),
	status: SessionDiffFileStatusSchema,
	additions: Type.Integer({ minimum: 0 }),
	deletions: Type.Integer({ minimum: 0 }),
	binary: Type.Optional(Type.Boolean()),
	untracked: Type.Optional(Type.Boolean()),
	/** Per-file unified patch text; absent for binary or oversized files. */
	patch: Type.Optional(Type.String()),
	truncated: Type.Optional(Type.Boolean())
});
/** One commit shown in session diff branch metadata. */
const SessionDiffCommitSchema = closedObject({
	sha: NonEmptyString,
	subject: Type.String()
});
/** Selects the session checkout state represented by the diff. */
const SessionDiffScopeSchema = Type.Union([
	Type.Literal("all"),
	Type.Literal("uncommitted"),
	Type.Literal("commit")
]);
/** Reads the git diff of a session checkout against its base branch. */
const SessionsDiffParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	scope: Type.Optional(SessionDiffScopeSchema),
	commit: Type.Optional(NonEmptyString)
});
/** Branch + working-tree diff for one session checkout. */
const SessionsDiffResultSchema = closedObject({
	sessionKey: NonEmptyString,
	root: Type.Optional(NonEmptyString),
	branch: Type.Optional(NonEmptyString),
	/** Display label of the diff base: the default branch name or "HEAD". */
	baseRef: Type.Optional(NonEmptyString),
	/** Number of commits between the resolved branch merge base and HEAD. */
	aheadCount: Type.Optional(Type.Integer({ minimum: 0 })),
	/** Newest-first commits between the resolved branch merge base and HEAD. */
	commits: Type.Optional(Type.Array(SessionDiffCommitSchema, { maxItems: 50 })),
	/** The resolved branch merge-base commit. */
	mergeBase: Type.Optional(SessionDiffCommitSchema),
	files: Type.Array(SessionDiffFileSchema),
	additions: Type.Integer({ minimum: 0 }),
	deletions: Type.Integer({ minimum: 0 }),
	truncated: Type.Optional(Type.Boolean()),
	unavailableReason: Type.Optional(Type.Union([
		Type.Literal("unknown_session"),
		Type.Literal("not_git"),
		Type.Literal("unknown_commit")
	]))
});
/** Lists sessions with optional scope, activity, label, and preview filters. */
const SessionsListParamsSchema = closedObject({
	/** Maximum rows to return; omitted Gateway RPC calls use a bounded default. */
	limit: Type.Optional(Type.Integer({ minimum: 1 })),
	offset: Type.Optional(Type.Integer({ minimum: 0 })),
	activeMinutes: Type.Optional(Type.Integer({ minimum: 1 })),
	/** Require a real user/channel interaction; excludes synthetic isolated heartbeat rows. */
	requireLastInteraction: Type.Optional(Type.Boolean()),
	sortBy: Type.Optional(Type.Union([Type.Literal("updatedAt"), Type.Literal("lastInteractionAt")])),
	includeGlobal: Type.Optional(Type.Boolean()),
	includeUnknown: Type.Optional(Type.Boolean()),
	/** Limit agent-scoped rows to agents currently present in config. */
	configuredAgentsOnly: Type.Optional(Type.Boolean()),
	/**
	* Read first 8KB of each session transcript to derive title from first user message.
	* Performs a file read per session - use `limit` to bound result set on large stores.
	*/
	includeDerivedTitles: Type.Optional(Type.Boolean()),
	/**
	* Read last 16KB of each session transcript to extract most recent message preview.
	* Performs a file read per session - use `limit` to bound result set on large stores.
	*/
	includeLastMessage: Type.Optional(Type.Boolean()),
	label: Type.Optional(SessionLabelString),
	/** Limit rows to sessions with an explicitly stored Control UI face preference. */
	boardFace: Type.Optional(Type.Union([Type.Literal("chat"), Type.Literal("dashboard")])),
	/** Filter rows by their permanent creator identity. */
	creatorId: Type.Optional(NonEmptyString),
	spawnedBy: Type.Optional(NonEmptyString),
	agentId: Type.Optional(NonEmptyString),
	search: Type.Optional(Type.String()),
	/**
	* True lists archived sessions; "all" lists archived and active;
	* false or omitted lists active sessions.
	*/
	archived: Type.Optional(Type.Union([Type.Boolean(), Type.Literal("all")]))
});
/** Searches one agent's indexed session transcripts, optionally within selected sessions. */
const SessionsSearchParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	sessionKeys: Type.Optional(Type.Array(NonEmptyString, {
		minItems: 1,
		maxItems: 200
	})),
	query: Type.String({
		minLength: 1,
		maxLength: 4096
	}),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 25
	}))
});
/** One full-text session transcript match with follow-up provenance. */
const SessionsSearchHitSchema = closedObject({
	sessionKey: NonEmptyString,
	sessionId: NonEmptyString,
	messageId: NonEmptyString,
	role: Type.Union([Type.Literal("user"), Type.Literal("assistant")]),
	timestamp: Type.Integer({ minimum: 0 }),
	snippet: Type.String(),
	score: Type.Number()
});
/** Full-text search response; indexing marks a still-running first-use reconcile. */
const SessionsSearchResultSchema = closedObject({
	results: Type.Array(SessionsSearchHitSchema),
	indexing: Type.Optional(Type.Boolean()),
	truncated: Type.Optional(Type.Boolean())
});
/** Repairs or removes invalid session records from the selected agent scope. */
const SessionsCleanupParamsSchema = closedObject({
	agent: Type.Optional(NonEmptyString),
	allAgents: Type.Optional(Type.Boolean()),
	enforce: Type.Optional(Type.Boolean()),
	activeKey: Type.Optional(NonEmptyString),
	fixMissing: Type.Optional(Type.Boolean()),
	fixDmScope: Type.Optional(Type.Boolean())
});
/** Reads short previews for selected session keys. */
const SessionsPreviewParamsSchema = closedObject({
	keys: Type.Array(NonEmptyString, { minItems: 1 }),
	limit: Type.Optional(Type.Integer({ minimum: 1 })),
	maxChars: Type.Optional(Type.Integer({ minimum: 20 }))
});
/** Describes one session and optional derived title/last-message previews. */
const SessionsDescribeParamsSchema = closedObject({
	key: NonEmptyString,
	includeDerivedTitles: Type.Optional(Type.Boolean()),
	includeLastMessage: Type.Optional(Type.Boolean())
});
const SessionWorktreeInfoSchema = closedObject({
	id: NonEmptyString,
	path: NonEmptyString,
	branch: NonEmptyString
});
/** Result returned after creating or adopting a session. */
const SessionsCreateResultSchema = Type.Object({
	ok: Type.Literal(true),
	key: NonEmptyString,
	sessionId: Type.Optional(NonEmptyString),
	entry: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
	runStarted: Type.Optional(Type.Boolean()),
	runId: Type.Optional(NonEmptyString),
	messageSeq: Type.Optional(Type.Integer({ minimum: 1 })),
	runError: Type.Optional(ErrorShapeSchema),
	worktree: Type.Optional(SessionWorktreeInfoSchema)
}, { additionalProperties: true });
/** Sends one message into an existing session. */
const SessionsSendParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	message: Type.String(),
	thinking: Type.Optional(Type.String()),
	attachments: Type.Optional(ChatAttachmentsSchema),
	timeoutMs: Type.Optional(Type.Integer({ minimum: 0 })),
	idempotencyKey: Type.Optional(NonEmptyString)
});
/**
* Reconciles one client-issued send against the live run registry and the durable
* transcript. Reports whether the run is currently in flight, already durably
* applied to the transcript (so a retry would duplicate), or absent from both
* (so a retry is safe because no agent execution side effect could have happened).
*/
const SessionsSendReconcileParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	runId: NonEmptyString
});
const SessionsSendReconcileResultSchema = closedObject({
	key: NonEmptyString,
	agentId: NonEmptyString,
	runId: NonEmptyString,
	status: Type.Union([
		Type.Literal("active"),
		Type.Literal("applied"),
		Type.Literal("not_found")
	])
});
/** Subscribes a client to live message updates for one session. */
const SessionsMessagesSubscribeParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	/** Opt in to sanitized durable approval events for this session and its descendants. */
	includeApprovals: Type.Optional(Type.Literal(true))
});
/** Removes a live message subscription for one session. */
const SessionsMessagesUnsubscribeParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
});
/** Aborts the active or named run for a session. */
const SessionsAbortParamsSchema = closedObject({
	key: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	agentId: Type.Optional(NonEmptyString),
	/** Also discard followup and lane queues for a key-only non-global session abort. */
	clearQueued: Type.Optional(Type.Boolean())
});
/** Updates or clears one plugin namespace value on a session record. */
const SessionsPluginPatchParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	pluginId: NonEmptyString,
	namespace: NonEmptyString,
	value: Type.Optional(PluginJsonValueSchema),
	unset: Type.Optional(Type.Boolean())
});
closedObject({
	ok: Type.Literal(true),
	key: NonEmptyString,
	value: Type.Optional(PluginJsonValueSchema)
});
/** Resets a session to a new or reset transcript state. */
const SessionsResetParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	reason: Type.Optional(Type.Union([Type.Literal("new"), Type.Literal("reset")]))
});
/** Deletes a session record and optionally its transcript. */
const SessionsDeleteParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	deleteTranscript: Type.Optional(Type.Boolean()),
	expectedSessionId: Type.Optional(NonEmptyString),
	expectedLifecycleRevision: Type.Optional(NonEmptyString),
	expectedSessionUpdatedAt: Type.Optional(Type.Number({ minimum: 0 })),
	emitLifecycleHooks: Type.Optional(Type.Boolean()),
	/**
	* Restricts the delete to already-archived sessions (archive-then-delete).
	* operator.write callers must set this; deletes without it require
	* operator.admin.
	*/
	archivedOnly: Type.Optional(Type.Boolean())
});
/** Lists the gateway-owned custom session group catalog (names + order). */
const SessionsGroupsListParamsSchema = closedObject({});
/** One custom session group catalog entry. */
const SessionGroupSchema = closedObject({
	name: SessionLabelString,
	position: Type.Integer({ minimum: 0 })
});
const SidebarSectionIdString = Type.String({
	minLength: 1,
	maxLength: 512
});
/** Custom session group catalog in display order. */
const SessionsGroupsListResultSchema = closedObject({
	groups: Type.Array(SessionGroupSchema),
	sectionOrder: Type.Optional(Type.Array(SidebarSectionIdString, { maxItems: 232 }))
});
/** Replaces the ordered group catalog; creates listed names, keeps member categories untouched. */
const SessionsGroupsPutParamsSchema = closedObject({
	names: Type.Array(SessionLabelString, { maxItems: 200 }),
	sectionOrder: Type.Optional(Type.Array(SidebarSectionIdString, { maxItems: 232 }))
});
/** Renames a group and repoints every member session's category. */
const SessionsGroupsRenameParamsSchema = closedObject({
	name: SessionLabelString,
	to: SessionLabelString
});
/** Deletes a group and clears every member session's category. */
const SessionsGroupsDeleteParamsSchema = closedObject({ name: SessionLabelString });
/** Result for group catalog mutations, with member sessions updated where applicable. */
const SessionsGroupsMutationResultSchema = closedObject({
	ok: Type.Literal(true),
	groups: Type.Array(SessionGroupSchema),
	sectionOrder: Type.Optional(Type.Array(SidebarSectionIdString, { maxItems: 232 })),
	updatedSessions: Type.Optional(Type.Integer({ minimum: 0 }))
});
/** Requests manual compaction for a session transcript. */
const SessionsCompactParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	maxLines: Type.Optional(Type.Integer({ minimum: 1 }))
});
/** Lists compaction checkpoints for one session. */
const SessionsCompactionListParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
});
/** Creates a new branch from a compaction checkpoint. */
const SessionsCompactionBranchParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	checkpointId: NonEmptyString
});
/** Restores an existing session to a compaction checkpoint. */
const SessionsCompactionRestoreParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	checkpointId: NonEmptyString
});
/** Repoints a session to the active-path state before one persisted user message. */
const SessionsRewindParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	entryId: NonEmptyString
});
/** Creates a new session from the active-path state before one persisted user message. */
const SessionsForkParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	entryId: NonEmptyString
});
const SessionEditorAttachmentSchema = closedObject({
	mimeType: Type.String(),
	data: Type.String()
});
const SessionsRewindResultSchema = closedObject({
	editorText: Type.Optional(Type.String()),
	editorAttachments: Type.Optional(Type.Array(SessionEditorAttachmentSchema))
});
const SessionsForkResultSchema = closedObject({
	sessionKey: NonEmptyString,
	editorText: Type.Optional(Type.String()),
	editorAttachments: Type.Optional(Type.Array(SessionEditorAttachmentSchema))
});
const SessionBranchSchema = closedObject({
	leafEntryId: NonEmptyString,
	headline: Type.String(),
	messageCount: Type.Integer({ minimum: 0 }),
	updatedAt: Type.Optional(NonEmptyString),
	active: Type.Boolean()
});
/** Lists transcript DAG tips available for branch switching. */
const SessionsBranchesListParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
});
const SessionsBranchesListResultSchema = closedObject({ branches: Type.Array(SessionBranchSchema) });
/** Repoints the active transcript path to one existing DAG tip. */
const SessionsBranchesSwitchParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	leafEntryId: NonEmptyString
});
const SessionsBranchesSwitchResultSchema = closedObject({});
closedObject({
	ok: Type.Literal(true),
	key: NonEmptyString,
	checkpoints: Type.Array(SessionCompactionCheckpointSchema)
});
closedObject({
	ok: Type.Literal(true),
	sourceKey: NonEmptyString,
	key: NonEmptyString,
	sessionId: NonEmptyString,
	checkpoint: SessionCompactionCheckpointSchema,
	entry: Type.Object({
		sessionId: NonEmptyString,
		updatedAt: Type.Integer({ minimum: 0 })
	}, { additionalProperties: true })
});
closedObject({
	ok: Type.Literal(true),
	key: NonEmptyString,
	sessionId: NonEmptyString,
	checkpoint: SessionCompactionCheckpointSchema,
	entry: Type.Object({
		sessionId: NonEmptyString,
		updatedAt: Type.Integer({ minimum: 0 })
	}, { additionalProperties: true })
});
/** Usage report query across one session, one agent, or all agent sessions. */
const SessionsUsageParamsSchema = closedObject({
	/** Specific session key to analyze; if omitted returns sessions for the effective agent. */
	key: Type.Optional(NonEmptyString),
	/** Agent scope for list-style usage queries. */
	agentId: Type.Optional(NonEmptyString),
	/** Explicit all-agent scope for list-style usage queries. */
	agentScope: Type.Optional(Type.Literal("all")),
	/** Start date for range filter (YYYY-MM-DD). */
	startDate: Type.Optional(Type.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$" })),
	/** End date for range filter (YYYY-MM-DD). */
	endDate: Type.Optional(Type.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$" })),
	/** How start/end dates should be interpreted. Defaults to UTC when omitted. */
	mode: Type.Optional(Type.Union([
		Type.Literal("utc"),
		Type.Literal("gateway"),
		Type.Literal("specific")
	])),
	/** Preset range for usage queries when explicit start/end dates are omitted. */
	range: Type.Optional(Type.Union([
		Type.Literal("7d"),
		Type.Literal("30d"),
		Type.Literal("90d"),
		Type.Literal("1y"),
		Type.Literal("all")
	])),
	/** Usage row grouping. `family` rolls up known rotated session ids for a logical key. */
	groupBy: Type.Optional(Type.Union([Type.Literal("instance"), Type.Literal("family")])),
	/** Backward-compatible alias for requesting family grouping. */
	includeHistorical: Type.Optional(Type.Boolean({
		deprecated: true,
		description: "Deprecated alias for groupBy: family."
	})),
	/** UTC offset to use when mode is `specific` (for example, UTC-4 or UTC+5:30). */
	utcOffset: Type.Optional(Type.String({
		pattern: "^UTC[+-]\\d{1,2}(?::[0-5]\\d)?$",
		deprecated: true,
		description: "Deprecated compatibility fallback; use timeZone."
	})),
	/** IANA time zone for `specific`; preferred over `utcOffset`, which remains a compatibility fallback. */
	timeZone: Type.Optional(NonEmptyString),
	/** Maximum sessions to return (default 50). */
	limit: Type.Optional(Type.Integer({ minimum: 1 })),
	/** Include context weight breakdown (systemPromptReport). */
	includeContextWeight: Type.Optional(Type.Boolean())
});
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-sharing.ts
/** A selectable sharing identity is a created actor with a durable id. */
const SessionSharingIdentitySchema = closedObject({
	...SessionCreatedActorSchema.properties,
	id: NonEmptyString
});
const SessionSharingActionSchema = Type.Union([
	Type.Literal("visibility"),
	Type.Literal("member-added"),
	Type.Literal("member-removed")
]);
const SessionSharingTargetParamsSchema = {
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
};
const SessionVisibilitySetParamsSchema = closedObject({
	...SessionSharingTargetParamsSchema,
	visibility: SessionVisibilitySchema
});
const SessionVisibilitySetResultSchema = closedObject({
	ok: Type.Literal(true),
	sessionKey: NonEmptyString,
	visibility: SessionVisibilitySchema
});
const SessionMembersListParamsSchema = closedObject(SessionSharingTargetParamsSchema);
const SessionMemberSchema = closedObject({
	identityId: NonEmptyString,
	addedBy: NonEmptyString,
	addedAt: Type.Integer({ minimum: 0 })
});
const SessionMembersListResultSchema = closedObject({
	sessionKey: NonEmptyString,
	owner: Type.Optional(SessionSharingIdentitySchema),
	members: Type.Array(SessionMemberSchema),
	identities: Type.Array(SessionSharingIdentitySchema),
	role: SessionSharingRoleSchema,
	allowedVisibilities: Type.Array(SessionVisibilitySchema)
});
const SessionMemberAddParamsSchema = closedObject({
	...SessionSharingTargetParamsSchema,
	identityId: NonEmptyString
});
const SessionMemberRemoveParamsSchema = SessionMemberAddParamsSchema;
const SessionMemberMutationResultSchema = closedObject({
	ok: Type.Literal(true),
	sessionKey: NonEmptyString,
	identityId: NonEmptyString
});
const SessionSharingEventSchema = closedObject({
	action: SessionSharingActionSchema,
	sessionKey: NonEmptyString,
	agentId: NonEmptyString,
	actor: SessionSharingIdentitySchema,
	visibility: Type.Optional(SessionVisibilitySchema),
	identityId: Type.Optional(NonEmptyString),
	ts: Type.Integer({ minimum: 0 })
});
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-suggestions.ts
const SessionSuggestionTargetParamsSchema = {
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
};
const SessionSuggestionStateSchema = Type.Union([
	Type.Literal("pending"),
	Type.Literal("accepted"),
	Type.Literal("dismissed")
]);
const SessionSuggestionResolutionSchema = Type.Union([
	Type.Literal("send"),
	Type.Literal("queue"),
	Type.Literal("edit"),
	Type.Literal("dismiss")
]);
const SessionSuggestionActionSchema = Type.Union([Type.Literal("added"), Type.Literal("resolved")]);
const SessionSuggestionSchema = closedObject({
	id: NonEmptyString,
	sessionKey: NonEmptyString,
	agentId: NonEmptyString,
	author: SessionSharingIdentitySchema,
	text: Type.String({
		minLength: 1,
		maxLength: 32768
	}),
	createdAt: Type.Integer({ minimum: 0 }),
	state: SessionSuggestionStateSchema
});
const SessionSuggestionsAddParamsSchema = closedObject({
	...SessionSuggestionTargetParamsSchema,
	text: Type.String({
		minLength: 1,
		maxLength: 32768
	})
});
const SessionSuggestionsListParamsSchema = closedObject(SessionSuggestionTargetParamsSchema);
const SessionSuggestionsResolveParamsSchema = closedObject({
	...SessionSuggestionTargetParamsSchema,
	id: NonEmptyString,
	resolution: SessionSuggestionResolutionSchema
});
const SessionSuggestionsAddResultSchema = closedObject({ suggestion: SessionSuggestionSchema });
const SessionSuggestionsListResultSchema = closedObject({
	suggestions: Type.Array(SessionSuggestionSchema),
	role: SessionSharingRoleSchema
});
const SessionSuggestionsResolveResultSchema = closedObject({ suggestion: SessionSuggestionSchema });
const SessionSuggestionEventSchema = closedObject({
	action: SessionSuggestionActionSchema,
	suggestion: SessionSuggestionSchema
});
const SessionTypingParamsSchema = closedObject({
	...SessionSuggestionTargetParamsSchema,
	sessionId: NonEmptyString,
	typing: Type.Boolean()
});
const SessionTypingResultSchema = closedObject({
	ok: Type.Literal(true),
	broadcast: Type.Boolean()
});
const SessionTypingEventSchema = closedObject({
	sessionKey: NonEmptyString,
	sessionId: NonEmptyString,
	agentId: NonEmptyString,
	actor: SessionSharingIdentitySchema,
	typing: Type.Boolean(),
	ts: Type.Integer({ minimum: 0 })
});
//#endregion
//#region packages/gateway-protocol/src/schema/projects.ts
const StoredProjectIdSchema = Type.String({ pattern: "^[a-z0-9][a-z0-9-]{0,63}$" });
const PROJECTS_LIST_DEFAULT_LIMIT = 50;
const PROJECTS_LIST_MAX_CHECKOUTS_PER_PROJECT = 50;
const PROJECTS_LIST_MAX_IDENTITY_PROBES = 32;
const ProjectRecordSchema = closedObject({
	id: NonEmptyString,
	displayName: NonEmptyString,
	repoRoot: Type.Optional(Type.String({
		minLength: 1,
		description: "Repository checkout root; included only for callers holding operator.write."
	})),
	originUrl: Type.Optional(Type.String({
		minLength: 1,
		description: "Repository origin URL; included only for callers holding operator.write."
	})),
	source: Type.String({ enum: [
		"workspace",
		"registered",
		"cloned"
	] }),
	agentId: Type.Optional(NonEmptyString)
});
const ProjectRecentProjectSchema = closedObject({
	kind: Type.Literal("project"),
	projectId: NonEmptyString,
	displayName: NonEmptyString
});
const ProjectRecentFolderSchema = closedObject({
	kind: Type.Literal("folder"),
	folder: NonEmptyString,
	displayName: NonEmptyString,
	execNode: Type.Optional(NonEmptyString)
});
const ProjectRecentSchema = Type.Union([ProjectRecentProjectSchema, ProjectRecentFolderSchema]);
/** One gateway-visible checkout for an observed repository project. */
const ProjectCheckoutSchema = closedObject({
	runnerId: Type.String({
		minLength: 1,
		description: "Runner hosting this operator.write-scoped checkout."
	}),
	path: Type.String({
		minLength: 1,
		description: "Physical checkout path returned only to operator.write-capable callers."
	})
});
/** Repository identity derived from visible checkout and session state. */
const ProjectSummarySchema = closedObject({
	name: NonEmptyString,
	originUrl: Type.Optional(Type.String({
		minLength: 1,
		description: "Sanitized repository origin returned to operator.write-capable callers."
	})),
	checkouts: Type.Array(ProjectCheckoutSchema, {
		minItems: 1,
		maxItems: 50
	}),
	lastUsedAt: Type.Number({ minimum: 0 })
});
const ProjectsListParamsSchema = closedObject({ includeObserved: Type.Optional(Type.Boolean({ description: "Compute write-scoped observed checkout groups in addition to projects." })) });
const ProjectsListResultSchema = closedObject({
	projects: Type.Array(ProjectRecordSchema),
	recents: Type.Optional(Type.Array(ProjectRecentSchema, { maxItems: 8 })),
	observedProjects: Type.Optional(Type.Array(ProjectSummarySchema, {
		maxItems: 50,
		description: "Observed checkout details returned only to operator.write-capable callers."
	}))
});
const ProjectsRegisterParamsSchema = closedObject({
	path: NonEmptyString,
	name: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 128
	}))
});
const ProjectsRegisterResultSchema = ProjectRecordSchema;
const ProjectsAddParamsSchema = closedObject({
	gitUrl: Type.String({
		minLength: 1,
		maxLength: 2048
	}),
	name: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 128
	}))
});
const ProjectsAddResultSchema = ProjectRecordSchema;
const RemoteProjectSchema = closedObject({
	name: Type.String({
		minLength: 1,
		maxLength: 100
	}),
	fullName: Type.String({
		minLength: 1,
		maxLength: 200
	}),
	description: Type.Optional(Type.String({ maxLength: 500 })),
	cloneUrl: Type.String({
		minLength: 1,
		maxLength: 2048
	}),
	webUrl: Type.String({
		minLength: 1,
		maxLength: 2048
	}),
	private: Type.Boolean()
});
const ProjectsSearchRemoteParamsSchema = closedObject({ query: Type.String({
	minLength: 1,
	maxLength: 200
}) });
const ProjectsSearchRemoteResultSchema = closedObject({
	credential: Type.Union([Type.Literal("configured"), Type.Literal("missing")]),
	projects: Type.Array(RemoteProjectSchema, { maxItems: 10 })
});
const ProjectsRemoveParamsSchema = closedObject({
	id: StoredProjectIdSchema,
	deleteCheckout: Type.Optional(Type.Boolean())
});
const ProjectsRemoveResultSchema = closedObject({ removed: Type.Boolean() });
//#endregion
//#region packages/gateway-protocol/src/schema/migrations.ts
const MAX_MEMORY_MIGRATION_ITEMS = 2e3;
const MemoryMigrationPlanFingerprintSchema = Type.String({
	minLength: 64,
	maxLength: 64,
	pattern: "^[a-f0-9]{64}$"
});
const MemoryMigrationItemStatusSchema = Type.Union([
	Type.Literal("planned"),
	Type.Literal("migrated"),
	Type.Literal("skipped"),
	Type.Literal("warning"),
	Type.Literal("conflict"),
	Type.Literal("error")
]);
const MemoryMigrationItemSchema = Type.Object({
	id: NonEmptyString,
	status: MemoryMigrationItemStatusSchema,
	source: Type.Optional(NonEmptyString),
	target: Type.Optional(NonEmptyString),
	message: Type.Optional(Type.String()),
	reason: Type.Optional(Type.String()),
	details: Type.Optional(Type.Record(Type.String(), Type.Unknown()))
}, { additionalProperties: false });
const MemoryMigrationSummarySchema = Type.Object({
	total: Type.Integer({ minimum: 0 }),
	planned: Type.Integer({ minimum: 0 }),
	migrated: Type.Integer({ minimum: 0 }),
	skipped: Type.Integer({ minimum: 0 }),
	conflicts: Type.Integer({ minimum: 0 }),
	errors: Type.Integer({ minimum: 0 }),
	sensitive: Type.Integer({ minimum: 0 })
}, { additionalProperties: false });
const MemoryMigrationProviderPlanSchema = Type.Object({
	providerId: NonEmptyString,
	label: NonEmptyString,
	description: Type.Optional(Type.String()),
	planFingerprint: Type.Optional(MemoryMigrationPlanFingerprintSchema),
	found: Type.Boolean(),
	source: Type.Optional(NonEmptyString),
	target: Type.Optional(NonEmptyString),
	confidence: Type.Optional(Type.Union([
		Type.Literal("low"),
		Type.Literal("medium"),
		Type.Literal("high")
	])),
	message: Type.Optional(Type.String()),
	error: Type.Optional(Type.String()),
	summary: MemoryMigrationSummarySchema,
	items: Type.Array(MemoryMigrationItemSchema, { maxItems: MAX_MEMORY_MIGRATION_ITEMS }),
	warnings: Type.Optional(Type.Array(Type.String()))
}, { additionalProperties: false });
const MigrationsMemoryPlanParamsSchema = Type.Object({
	agentId: NonEmptyString,
	overwrite: Type.Optional(Type.Boolean())
}, { additionalProperties: false });
const MigrationsMemoryPlanResultSchema = Type.Object({
	agentId: NonEmptyString,
	workspace: NonEmptyString,
	providers: Type.Array(MemoryMigrationProviderPlanSchema)
}, { additionalProperties: false });
const MigrationsMemoryApplyParamsSchema = Type.Object({
	idempotencyKey: NonEmptyString,
	agentId: NonEmptyString,
	providerId: NonEmptyString,
	planFingerprint: MemoryMigrationPlanFingerprintSchema,
	itemIds: Type.Array(NonEmptyString, {
		minItems: 1,
		uniqueItems: true,
		maxItems: MAX_MEMORY_MIGRATION_ITEMS
	}),
	overwrite: Type.Optional(Type.Boolean())
}, { additionalProperties: false });
const MigrationProtocolSchemas = {
	MemoryMigrationItemStatus: MemoryMigrationItemStatusSchema,
	MemoryMigrationItem: MemoryMigrationItemSchema,
	MemoryMigrationSummary: MemoryMigrationSummarySchema,
	MemoryMigrationProviderPlan: MemoryMigrationProviderPlanSchema,
	MigrationsMemoryPlanParams: MigrationsMemoryPlanParamsSchema,
	MigrationsMemoryPlanResult: MigrationsMemoryPlanResultSchema,
	MigrationsMemoryApplyParams: MigrationsMemoryApplyParamsSchema,
	MigrationsMemoryApplyResult: Type.Object({
		providerId: NonEmptyString,
		source: NonEmptyString,
		target: Type.Optional(NonEmptyString),
		summary: MemoryMigrationSummarySchema,
		items: Type.Array(MemoryMigrationItemSchema, { maxItems: MAX_MEMORY_MIGRATION_ITEMS }),
		warnings: Type.Optional(Type.Array(Type.String())),
		backupPath: Type.Optional(NonEmptyString),
		reportDir: Type.Optional(NonEmptyString)
	}, { additionalProperties: false })
};
//#endregion
//#region packages/gateway-protocol/src/migration-api.ts
const validateMigrationsMemoryPlanParams = /* @__PURE__ */ lazyCompile(MigrationsMemoryPlanParamsSchema);
const validateMigrationsMemoryApplyParams = /* @__PURE__ */ lazyCompile(MigrationsMemoryApplyParamsSchema);
//#endregion
//#region packages/gateway-protocol/src/schema/agent.ts
/**
* Agent and channel-action gateway schemas.
*
* These payloads sit on the boundary between external channel adapters, gateway
* RPC callers, and the agent runtime. Keep public request fields documented
* because older CLI/channel clients may continue sending them across releases.
*/
const AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION = "task_completion";
const AGENT_INTERNAL_EVENT_SOURCES = [
	"subagent",
	"cron",
	"image_generation",
	"video_generation",
	"music_generation"
];
const AGENT_INTERNAL_EVENT_STATUSES = [
	"ok",
	"timeout",
	"error",
	"unknown"
];
const CONVERSATION_REF_PATTERN = "^conv_[a-f0-9]{32}$";
/** Generated media/file attachment metadata carried by internal agent events. */
const AgentGeneratedAttachmentSchema = closedObject({
	type: Type.Optional(Type.String({ enum: [
		"image",
		"audio",
		"video",
		"file"
	] })),
	path: Type.Optional(Type.String()),
	url: Type.Optional(Type.String()),
	mediaUrl: Type.Optional(Type.String()),
	filePath: Type.Optional(Type.String()),
	mimeType: Type.Optional(Type.String()),
	name: Type.Optional(Type.String()),
	sizeBytes: Type.Optional(Type.Number()),
	durationMs: Type.Optional(Type.Number()),
	width: Type.Optional(Type.Number()),
	height: Type.Optional(Type.Number())
});
/** Internal completion event surfaced when child automation reports back to a parent run. */
const AgentInternalEventSchema = closedObject({
	type: Type.Literal(AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION),
	source: Type.String({ enum: [...AGENT_INTERNAL_EVENT_SOURCES] }),
	childSessionKey: Type.String(),
	childSessionId: Type.Optional(Type.String()),
	announceType: Type.String(),
	taskLabel: Type.String(),
	status: Type.String({ enum: [...AGENT_INTERNAL_EVENT_STATUSES] }),
	statusLabel: Type.String(),
	result: Type.String(),
	attachments: Type.Optional(Type.Array(AgentGeneratedAttachmentSchema)),
	mediaUrls: Type.Optional(Type.Array(Type.String())),
	statsLine: Type.Optional(Type.String()),
	replyInstruction: Type.String()
});
/** Stream event emitted by the agent runtime over the gateway protocol. */
const AgentEventSchema = closedObject({
	runId: NonEmptyString,
	seq: Type.Integer({ minimum: 0 }),
	stream: NonEmptyString,
	ts: Type.Integer({ minimum: 0 }),
	spawnedBy: Type.Optional(NonEmptyString),
	isHeartbeat: Type.Optional(Type.Boolean()),
	data: Type.Record(Type.String(), Type.Unknown())
});
/** Caller-supplied routing hints. Authorization must use trusted runtime context. */
const MessageActionToolContextSchema = closedObject({
	currentChannelId: Type.Optional(Type.String()),
	currentMessagingTarget: Type.Optional(Type.String()),
	currentGraphChannelId: Type.Optional(Type.String()),
	currentChannelProvider: Type.Optional(Type.String()),
	currentThreadTs: Type.Optional(Type.String()),
	currentMessageId: Type.Optional(Type.Union([Type.String(), Type.Number()])),
	replyToMode: Type.Optional(Type.Union([
		Type.Literal("off"),
		Type.Literal("first"),
		Type.Literal("all"),
		Type.Literal("batched")
	])),
	hasRepliedRef: Type.Optional(closedObject({ value: Type.Boolean() })),
	sameChannelThreadRequired: Type.Optional(Type.Boolean()),
	skipCrossContextDecoration: Type.Optional(Type.Boolean())
});
/** Request to execute a channel message action through a configured adapter. */
const MessageActionParamsSchema = closedObject({
	channel: NonEmptyString,
	action: NonEmptyString,
	params: Type.Record(Type.String(), Type.Unknown()),
	accountId: Type.Optional(Type.String()),
	requesterAccountId: Type.Optional(Type.String()),
	requesterSenderId: Type.Optional(Type.String()),
	senderIsOwner: Type.Optional(Type.Boolean()),
	sessionKey: Type.Optional(Type.String()),
	sessionId: Type.Optional(Type.String()),
	inboundTurnKind: Type.Optional(Type.String({ enum: ["user_request", "room_event"] })),
	agentId: Type.Optional(Type.String()),
	toolContext: Type.Optional(MessageActionToolContextSchema),
	/**
	* Explicit operation-local marker for an authenticated direct operator.
	* Missing values remain delegated, and agent runtime identity wins server-side.
	*/
	conversationReadOrigin: Type.Optional(Type.Literal("direct-operator")),
	idempotencyKey: NonEmptyString
});
/** Outbound send request shared by channel adapters. */
const SendParamsSchema = closedObject({
	to: NonEmptyString,
	message: Type.Optional(Type.String()),
	mediaUrl: Type.Optional(Type.String()),
	mediaUrls: Type.Optional(Type.Array(Type.String())),
	/** Base64 attachment payload for gateway-local media materialization. */
	buffer: Type.Optional(Type.String()),
	/** Optional filename for a base64 attachment payload. */
	filename: Type.Optional(Type.String()),
	/** Optional MIME type for a base64 attachment payload. */
	contentType: Type.Optional(Type.String()),
	asVoice: Type.Optional(Type.Boolean()),
	gifPlayback: Type.Optional(Type.Boolean()),
	channel: Type.Optional(Type.String()),
	accountId: Type.Optional(Type.String()),
	/** Optional agent id for per-agent media root resolution on gateway sends. */
	agentId: Type.Optional(Type.String()),
	/** Reply target message id for native quoted/threaded sends where supported. */
	replyToId: Type.Optional(Type.String()),
	/** Thread id (channel-specific meaning, e.g. Telegram forum topic id). */
	threadId: Type.Optional(Type.String()),
	/** Force document-style media sends where supported. */
	forceDocument: Type.Optional(Type.Boolean()),
	/** Send silently (no notification) where supported. */
	silent: Type.Optional(Type.Boolean()),
	/** Channel-specific parse mode for formatted text. */
	parseMode: Type.Optional(Type.Literal("HTML")),
	/** Optional session key for mirroring delivered output back into the transcript. */
	sessionKey: Type.Optional(Type.String()),
	idempotencyKey: NonEmptyString
});
/** Gateway-owned request that lists persisted and channel-directory addresses. */
const ConversationListParamsSchema = closedObject({
	agentId: NonEmptyString,
	channel: Type.Optional(NonEmptyString),
	query: Type.Optional(NonEmptyString),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 100
	}))
});
const ConversationListItemSchema = closedObject({
	conversationRef: Type.String({ pattern: CONVERSATION_REF_PATTERN }),
	channel: NonEmptyString,
	accountId: NonEmptyString,
	kind: Type.Union([
		Type.Literal("direct"),
		Type.Literal("group"),
		Type.Literal("channel")
	]),
	target: NonEmptyString,
	threadId: Type.Optional(NonEmptyString),
	label: Type.Optional(NonEmptyString),
	firstSeenAt: Type.Integer({ minimum: 0 }),
	lastSeenAt: Type.Integer({ minimum: 0 })
});
const ConversationListResultSchema = closedObject({ conversations: Type.Array(ConversationListItemSchema) });
/** Gateway-owned request that sends to one durable external conversation. */
const ConversationSendParamsSchema = closedObject({
	agentId: NonEmptyString,
	sourceSessionKey: Type.Optional(NonEmptyString),
	operationId: NonEmptyString,
	conversationRef: Type.String({ pattern: CONVERSATION_REF_PATTERN }),
	message: NonEmptyString
});
const ConversationSendResultSchema = closedObject({
	status: Type.Union([
		Type.Literal("sent"),
		Type.Literal("queued"),
		Type.Literal("suppressed"),
		Type.Literal("unknown")
	]),
	conversationRef: Type.String({ pattern: CONVERSATION_REF_PATTERN }),
	channel: NonEmptyString,
	messageId: Type.Optional(NonEmptyString),
	queueId: Type.Optional(NonEmptyString)
});
/** Gateway-owned request that sends and consumes one correlated external reply inline. */
const ConversationTurnParamsSchema = closedObject({
	agentId: NonEmptyString,
	sourceSessionKey: Type.Optional(NonEmptyString),
	turnId: NonEmptyString,
	conversationRef: Type.String({ pattern: CONVERSATION_REF_PATTERN }),
	message: NonEmptyString,
	timeoutMs: Type.Integer({
		minimum: 1,
		maximum: 3e5
	})
});
const ConversationTurnCancelParamsSchema = closedObject({
	agentId: NonEmptyString,
	turnId: NonEmptyString
});
const ConversationTurnCancelResultSchema = closedObject({ cancelled: Type.Boolean() });
const ConversationTurnReplySchema = closedObject({
	conversationRef: Type.String({ pattern: CONVERSATION_REF_PATTERN }),
	messageId: NonEmptyString,
	replyToId: Type.Optional(NonEmptyString),
	threadId: Type.Optional(NonEmptyString),
	text: Type.String(),
	timestamp: Type.Integer({ minimum: 0 }),
	transcriptArtifactId: Type.Optional(NonEmptyString),
	transcriptMessageId: Type.Optional(NonEmptyString)
});
const ConversationTurnBaseResultSchema = {
	conversationRef: Type.String({ pattern: CONVERSATION_REF_PATTERN }),
	channel: NonEmptyString,
	messageId: NonEmptyString,
	correlationPersisted: Type.Boolean()
};
const ConversationTurnResultSchema = Type.Union([
	closedObject({
		...ConversationTurnBaseResultSchema,
		status: Type.Literal("replied"),
		reply: ConversationTurnReplySchema
	}),
	closedObject({
		...ConversationTurnBaseResultSchema,
		status: Type.Literal("timeout")
	}),
	closedObject({
		conversationRef: Type.String({ pattern: CONVERSATION_REF_PATTERN }),
		channel: NonEmptyString,
		messageId: Type.Optional(NonEmptyString),
		correlationPersisted: Type.Boolean(),
		status: Type.Union([
			Type.Literal("sent"),
			Type.Literal("queued"),
			Type.Literal("suppressed"),
			Type.Literal("unknown")
		]),
		error: NonEmptyString
	})
]);
/** Poll creation request for adapters that support native polls. */
const PollParamsSchema = closedObject({
	to: NonEmptyString,
	question: NonEmptyString,
	options: Type.Array(NonEmptyString, {
		minItems: 2,
		maxItems: 12
	}),
	maxSelections: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 12
	})),
	/** Poll duration in seconds (channel-specific limits may apply). */
	durationSeconds: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 604800
	})),
	durationHours: Type.Optional(Type.Integer({ minimum: 1 })),
	/** Send silently (no notification) where supported. */
	silent: Type.Optional(Type.Boolean()),
	/** Poll anonymity where supported (e.g. Telegram polls default to anonymous). */
	isAnonymous: Type.Optional(Type.Boolean()),
	/** Thread id (channel-specific meaning, e.g. Telegram forum topic id). */
	threadId: Type.Optional(Type.String()),
	channel: Type.Optional(Type.String()),
	accountId: Type.Optional(Type.String()),
	idempotencyKey: NonEmptyString
});
/** Main agent-run request accepted by the gateway. */
const AgentParamsSchema = closedObject({
	message: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	provider: Type.Optional(Type.String()),
	model: Type.Optional(Type.String()),
	to: Type.Optional(Type.String()),
	replyTo: Type.Optional(Type.String()),
	sessionId: Type.Optional(Type.String()),
	sessionKey: Type.Optional(Type.String()),
	expectedExistingSessionId: Type.Optional(NonEmptyString),
	thinking: Type.Optional(Type.String()),
	deliver: Type.Optional(Type.Boolean()),
	attachments: Type.Optional(Type.Array(Type.Unknown())),
	channel: Type.Optional(Type.String()),
	replyChannel: Type.Optional(Type.String()),
	accountId: Type.Optional(Type.String()),
	replyAccountId: Type.Optional(Type.String()),
	threadId: Type.Optional(Type.String()),
	groupId: Type.Optional(Type.String()),
	groupChannel: Type.Optional(Type.String()),
	groupSpace: Type.Optional(Type.String()),
	timeout: Type.Optional(Type.Integer({ minimum: 0 })),
	bestEffortDeliver: Type.Optional(Type.Boolean()),
	lane: Type.Optional(Type.String()),
	cwd: Type.Optional(NonEmptyString),
	cleanupBundleMcpOnRunEnd: Type.Optional(Type.Boolean()),
	modelRun: Type.Optional(Type.Boolean()),
	promptMode: Type.Optional(Type.Union([
		Type.Literal("full"),
		Type.Literal("minimal"),
		Type.Literal("none")
	])),
	extraSystemPrompt: Type.Optional(Type.String()),
	bootstrapContextMode: Type.Optional(Type.Union([Type.Literal("full"), Type.Literal("lightweight")])),
	bootstrapContextRunKind: Type.Optional(Type.Union([
		Type.Literal("default"),
		Type.Literal("heartbeat"),
		Type.Literal("cron")
	])),
	acpTurnSource: Type.Optional(Type.Literal("manual_spawn")),
	internalRuntimeHandoffId: Type.Optional(NonEmptyString),
	internalExecutionIdentityRetry: Type.Optional(Type.Boolean()),
	/** Exact durable recovery attempt that owns any post-admission identity bind. */
	internalExecutionIdentityRecoveryAttempt: Type.Optional(Type.Integer({ minimum: 1 })),
	execApprovalFollowupExpectedSessionId: Type.Optional(NonEmptyString),
	internalEvents: Type.Optional(Type.Array(AgentInternalEventSchema)),
	inputProvenance: Type.Optional(InputProvenanceSchema),
	suppressPromptPersistence: Type.Optional(Type.Boolean()),
	sessionEffects: Type.Optional(Type.Union([Type.Literal("visible"), Type.Literal("internal")])),
	sourceReplyDeliveryMode: Type.Optional(Type.Union([Type.Literal("automatic"), Type.Literal("message_tool_only")])),
	disableMessageTool: Type.Optional(Type.Boolean()),
	swarmCollector: Type.Optional(Type.Boolean()),
	swarmOutputSchema: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
	forceRestartSafeTools: Type.Optional(Type.Boolean()),
	forceCodeModeTools: Type.Optional(Type.Boolean()),
	voiceWakeTrigger: Type.Optional(Type.String()),
	idempotencyKey: NonEmptyString,
	label: Type.Optional(SessionLabelString)
});
/** Identity lookup request for the current or selected agent/session. */
const AgentIdentityParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(Type.String())
});
/** Public display identity returned for an agent. */
const AgentIdentityResultSchema = closedObject({
	agentId: NonEmptyString,
	name: Type.Optional(NonEmptyString),
	nameSource: Type.Optional(Type.String({ enum: [
		"config",
		"agent",
		"workspace",
		"default"
	] })),
	avatar: Type.Optional(NonEmptyString),
	avatarSource: Type.Optional(NonEmptyString),
	avatarStatus: Type.Optional(Type.String({ enum: [
		"none",
		"local",
		"remote",
		"data"
	] })),
	avatarReason: Type.Optional(NonEmptyString),
	emoji: Type.Optional(NonEmptyString)
});
/** Waits for a submitted agent run to complete or time out. */
const AgentWaitParamsSchema = closedObject({
	runId: NonEmptyString,
	timeoutMs: Type.Optional(Type.Integer({ minimum: 0 }))
});
/** Wake request from external schedulers or devices into an agent session. */
const WakeParamsSchema = Type.Object({
	mode: Type.Union([Type.Literal("now"), Type.Literal("next-heartbeat")]),
	text: NonEmptyString,
	sessionKey: Type.Optional(NonEmptyString),
	/**
	* Optional agent id paired with `sessionKey`. Routes multi-agent setups
	* to the agent that owns the targeted session — closes the related half
	* of #46886 ("always routes to default agent").
	*/
	agentId: Type.Optional(NonEmptyString)
}, { additionalProperties: true });
//#endregion
//#region packages/gateway-protocol/src/schema/agents-workspace.ts
/**
* Read-only agent workspace browsing schemas.
*
* These contracts back the workspace file browser in operator clients
* (mobile apps, Control UI). The surface is intentionally read-only:
* write/delete/upload stay out of this namespace until a separately
* reviewed mutation contract exists.
*/
/** One file or folder in an agent workspace directory listing. */
const AgentsWorkspaceEntrySchema = closedObject({
	path: NonEmptyString,
	name: NonEmptyString,
	kind: Type.Union([Type.Literal("file"), Type.Literal("directory")]),
	size: Type.Optional(Type.Integer({ minimum: 0 })),
	updatedAtMs: Type.Optional(Type.Integer({ minimum: 0 }))
});
/** Lists one directory of an agent workspace. */
const AgentsWorkspaceListParamsSchema = closedObject({
	agentId: NonEmptyString,
	path: Type.Optional(Type.String()),
	offset: Type.Optional(Type.Integer({ minimum: 0 })),
	limit: Type.Optional(Type.Integer({ minimum: 1 }))
});
/** Paginated directory listing rooted at the agent workspace. */
const AgentsWorkspaceListResultSchema = closedObject({
	agentId: NonEmptyString,
	path: Type.String(),
	parentPath: Type.Optional(Type.String()),
	entries: Type.Array(AgentsWorkspaceEntrySchema),
	totalEntries: Type.Integer({ minimum: 0 }),
	offset: Type.Integer({ minimum: 0 })
});
/** One workspace file preview payload (UTF-8 text or base64 image). */
const AgentsWorkspaceFileSchema = closedObject({
	path: NonEmptyString,
	name: NonEmptyString,
	size: Type.Integer({ minimum: 0 }),
	updatedAtMs: Type.Integer({ minimum: 0 }),
	mimeType: NonEmptyString,
	encoding: Type.Union([Type.Literal("utf8"), Type.Literal("base64")]),
	content: Type.String()
});
/** Reads one workspace file by workspace-relative path. */
const AgentsWorkspaceGetParamsSchema = closedObject({
	agentId: NonEmptyString,
	path: NonEmptyString
});
/** Result for reading one workspace file. */
const AgentsWorkspaceGetResultSchema = closedObject({
	agentId: NonEmptyString,
	file: AgentsWorkspaceFileSchema
});
//#endregion
//#region packages/gateway-protocol/src/schema/artifacts.ts
/**
* Artifact lookup and download protocol schemas.
*
* Artifacts are files or payloads produced by sessions, runs, tasks, or agents;
* these schemas keep lookup filters explicit and download results transport-safe.
*/
const ArtifactQueryParamsProperties = {
	sessionKey: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	taskId: Type.Optional(NonEmptyString),
	agentId: Type.Optional(NonEmptyString)
};
/** Shared artifact filter payload used by list-style requests. */
const ArtifactQueryParamsSchema = closedObject(ArtifactQueryParamsProperties);
/** Artifact lookup payload with a required artifact id plus optional scope filters. */
const ArtifactGetParamsSchema = closedObject({
	...ArtifactQueryParamsProperties,
	artifactId: NonEmptyString
});
/** Public artifact metadata returned before or alongside download data. */
const ArtifactSummarySchema = closedObject({
	id: NonEmptyString,
	type: NonEmptyString,
	title: NonEmptyString,
	mimeType: Type.Optional(NonEmptyString),
	sizeBytes: Type.Optional(Type.Integer({ minimum: 0 })),
	sessionKey: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	taskId: Type.Optional(NonEmptyString),
	messageSeq: Type.Optional(Type.Integer({ minimum: 1 })),
	source: Type.Optional(NonEmptyString),
	download: closedObject({ mode: Type.Union([
		Type.Literal("bytes"),
		Type.Literal("url"),
		Type.Literal("unsupported")
	]) })
});
/** List request payload for artifacts visible in the selected scope. */
const ArtifactsListParamsSchema = ArtifactQueryParamsSchema;
closedObject({ artifacts: Type.Array(ArtifactSummarySchema) });
/** Get request payload for one artifact summary. */
const ArtifactsGetParamsSchema = ArtifactGetParamsSchema;
closedObject({ artifact: ArtifactSummarySchema });
/** Download request payload for one artifact. */
const ArtifactsDownloadParamsSchema = ArtifactGetParamsSchema;
closedObject({
	artifact: ArtifactSummarySchema,
	encoding: Type.Optional(Type.Literal("base64")),
	data: Type.Optional(Type.String()),
	url: Type.Optional(NonEmptyString),
	expiresAt: Type.Optional(NonEmptyString)
});
//#endregion
//#region packages/gateway-protocol/src/schema/audit-activity.ts
const AuditActivitySchemaVersionV1Schema = Type.Integer({
	minimum: 1,
	maximum: 1
});
const AuditActivityStatusV1Schema = Type.Union([
	Type.Literal("started"),
	Type.Literal("succeeded"),
	Type.Literal("failed"),
	Type.Literal("cancelled"),
	Type.Literal("timed_out"),
	Type.Literal("blocked"),
	Type.Literal("unknown")
]);
const AuditActivityKindV1Schema = Type.Union([
	Type.Literal("agent_run"),
	Type.Literal("tool_action"),
	Type.Literal("message")
]);
const AuditActivityDirectionV1Schema = Type.Union([Type.Literal("inbound"), Type.Literal("outbound")]);
const AuditActivityConversationKindV1Schema = Type.Union([
	Type.Literal("direct"),
	Type.Literal("group"),
	Type.Literal("channel"),
	Type.Literal("unknown")
]);
const AuditActivityHmacRefV1Schema = Type.String({ pattern: "^hmac-sha256:v1:[a-f0-9]{32}:[a-f0-9]{64}$" });
const AuditActivityAgentActorV1Schema = closedObject({
	type: Type.Union([Type.Literal("agent"), Type.Literal("system")]),
	id: NonEmptyString
});
const AuditActivityInboundActorV1Schema = Type.Union([closedObject({
	type: Type.Literal("channel_sender"),
	id: AuditActivityHmacRefV1Schema
}), closedObject({
	type: Type.Literal("system"),
	id: NonEmptyString
})]);
const AuditActivityOutboundActorV1Schema = closedObject({
	type: Type.Union([Type.Literal("agent"), Type.Literal("system")]),
	id: NonEmptyString
});
const commonProperties = {
	schemaVersion: AuditActivitySchemaVersionV1Schema,
	eventId: NonEmptyString,
	sequence: Type.Integer({ minimum: 1 }),
	sourceSequence: Type.Integer({ minimum: 1 }),
	occurredAt: Type.Integer({ minimum: 0 }),
	redaction: Type.Literal("metadata_only")
};
const agentProperties = {
	actor: AuditActivityAgentActorV1Schema,
	agentId: NonEmptyString,
	sessionKey: Type.Optional(NonEmptyString),
	sessionId: Type.Optional(NonEmptyString),
	runId: NonEmptyString
};
const messageProperties = {
	channel: NonEmptyString,
	conversationKind: AuditActivityConversationKindV1Schema,
	durationMs: Type.Optional(Type.Integer({ minimum: 0 })),
	resultCount: Type.Optional(Type.Integer({ minimum: 0 })),
	agentId: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	accountRef: Type.Optional(AuditActivityHmacRefV1Schema),
	conversationRef: Type.Optional(AuditActivityHmacRefV1Schema),
	messageRef: Type.Optional(AuditActivityHmacRefV1Schema),
	targetRef: Type.Optional(AuditActivityHmacRefV1Schema)
};
function correlatedObject(properties, variants) {
	return Type.Object(properties, {
		additionalProperties: false,
		allOf: [variants]
	});
}
function withoutField(field) {
	return { not: { required: [field] } };
}
const withoutErrorCode = withoutField("errorCode");
const withoutReasonCode = withoutField("reasonCode");
const withoutFailureStage = withoutField("failureStage");
const withoutDeliveryKind = withoutField("deliveryKind");
/** V1 agent-run activity record. */
const AuditActivityAgentRunV1Schema = correlatedObject({
	eventType: Type.Literal("agent_run"),
	...commonProperties,
	...agentProperties,
	kind: Type.Literal("agent_run"),
	action: Type.Union([Type.Literal("agent.run.started"), Type.Literal("agent.run.finished")]),
	status: Type.Union([
		Type.Literal("started"),
		Type.Literal("succeeded"),
		Type.Literal("failed"),
		Type.Literal("cancelled"),
		Type.Literal("timed_out"),
		Type.Literal("blocked")
	]),
	errorCode: Type.Optional(Type.Union([
		Type.Literal("run_failed"),
		Type.Literal("run_cancelled"),
		Type.Literal("run_timed_out"),
		Type.Literal("run_blocked")
	]))
}, Type.Union([
	Type.Intersect([Type.Object({
		action: Type.Literal("agent.run.started"),
		status: Type.Literal("started")
	}), withoutErrorCode]),
	Type.Intersect([Type.Object({
		action: Type.Literal("agent.run.finished"),
		status: Type.Literal("succeeded")
	}), withoutErrorCode]),
	Type.Object({
		action: Type.Literal("agent.run.finished"),
		status: Type.Literal("failed"),
		errorCode: Type.Literal("run_failed")
	}),
	Type.Object({
		action: Type.Literal("agent.run.finished"),
		status: Type.Literal("cancelled"),
		errorCode: Type.Literal("run_cancelled")
	}),
	Type.Object({
		action: Type.Literal("agent.run.finished"),
		status: Type.Literal("timed_out"),
		errorCode: Type.Literal("run_timed_out")
	}),
	Type.Object({
		action: Type.Literal("agent.run.finished"),
		status: Type.Literal("blocked"),
		errorCode: Type.Literal("run_blocked")
	})
]));
/** V1 tool-action activity record. */
const AuditActivityToolActionV1Schema = correlatedObject({
	eventType: Type.Literal("tool_action"),
	...commonProperties,
	...agentProperties,
	kind: Type.Literal("tool_action"),
	toolCallId: Type.Optional(NonEmptyString),
	toolName: Type.Optional(NonEmptyString),
	action: Type.Union([Type.Literal("tool.action.started"), Type.Literal("tool.action.finished")]),
	status: AuditActivityStatusV1Schema,
	errorCode: Type.Optional(Type.Union([
		Type.Literal("tool_failed"),
		Type.Literal("tool_cancelled"),
		Type.Literal("tool_timed_out"),
		Type.Literal("tool_blocked"),
		Type.Literal("tool_outcome_unknown")
	]))
}, Type.Union([
	Type.Intersect([Type.Object({
		action: Type.Literal("tool.action.started"),
		status: Type.Literal("started")
	}), withoutErrorCode]),
	Type.Intersect([Type.Object({
		action: Type.Literal("tool.action.finished"),
		status: Type.Literal("succeeded")
	}), withoutErrorCode]),
	Type.Object({
		action: Type.Literal("tool.action.finished"),
		status: Type.Literal("failed"),
		errorCode: Type.Literal("tool_failed")
	}),
	Type.Object({
		action: Type.Literal("tool.action.finished"),
		status: Type.Literal("cancelled"),
		errorCode: Type.Literal("tool_cancelled")
	}),
	Type.Object({
		action: Type.Literal("tool.action.finished"),
		status: Type.Literal("timed_out"),
		errorCode: Type.Literal("tool_timed_out")
	}),
	Type.Object({
		action: Type.Literal("tool.action.finished"),
		status: Type.Literal("blocked"),
		errorCode: Type.Literal("tool_blocked")
	}),
	Type.Object({
		action: Type.Literal("tool.action.finished"),
		status: Type.Literal("unknown"),
		errorCode: Type.Literal("tool_outcome_unknown")
	})
]));
const inboundMessageProperties = {
	eventType: Type.Literal("inbound_message"),
	...commonProperties,
	...messageProperties,
	kind: Type.Literal("message"),
	action: Type.Literal("message.inbound.processed"),
	direction: Type.Literal("inbound"),
	actor: AuditActivityInboundActorV1Schema
};
const inboundCompletedReasonSchema = Type.Union([
	Type.Literal("fast_abort"),
	Type.Literal("plugin_bound_handled"),
	Type.Literal("plugin_bound_unavailable"),
	Type.Literal("plugin_bound_declined"),
	Type.Literal("before_dispatch_handled"),
	Type.Literal("acp_dispatch_completed"),
	Type.Literal("acp_dispatch_empty"),
	Type.Literal("active_run_injected")
]);
const inboundSkippedReasonSchema = Type.Union([
	Type.Literal("duplicate"),
	Type.Literal("reply_operation_active"),
	Type.Literal("reply_operation_aborted"),
	Type.Literal("acp_dispatch_aborted")
]);
/** V1 inbound-message activity record. */
const inboundFailureReasonSchema = Type.Union([Type.Literal("acp_dispatch_failed"), Type.Literal("plugin_bound_error")]);
const AuditActivityInboundMessageV1Schema = correlatedObject({
	...inboundMessageProperties,
	status: Type.Union([
		Type.Literal("succeeded"),
		Type.Literal("blocked"),
		Type.Literal("failed")
	]),
	outcome: Type.Union([
		Type.Literal("completed"),
		Type.Literal("skipped"),
		Type.Literal("failed")
	]),
	errorCode: Type.Optional(Type.Literal("message_processing_failed")),
	reasonCode: Type.Optional(Type.Union([
		...inboundCompletedReasonSchema.anyOf,
		...inboundSkippedReasonSchema.anyOf,
		...inboundFailureReasonSchema.anyOf
	]))
}, Type.Union([
	Type.Intersect([Type.Object({
		status: Type.Literal("succeeded"),
		outcome: Type.Literal("completed"),
		reasonCode: Type.Optional(inboundCompletedReasonSchema)
	}), withoutErrorCode]),
	Type.Intersect([Type.Object({
		status: Type.Literal("blocked"),
		outcome: Type.Literal("skipped"),
		reasonCode: Type.Optional(inboundSkippedReasonSchema)
	}), withoutErrorCode]),
	Type.Object({
		status: Type.Literal("failed"),
		outcome: Type.Literal("failed"),
		errorCode: Type.Literal("message_processing_failed"),
		reasonCode: Type.Optional(inboundFailureReasonSchema)
	})
]));
const outboundMessageProperties = {
	eventType: Type.Literal("outbound_message"),
	...commonProperties,
	...messageProperties,
	kind: Type.Literal("message"),
	action: Type.Literal("message.outbound.finished"),
	direction: Type.Literal("outbound"),
	actor: AuditActivityOutboundActorV1Schema,
	deliveryKind: Type.Optional(Type.Union([
		Type.Literal("text"),
		Type.Literal("media"),
		Type.Literal("other")
	]))
};
const outboundSuppressedReasonSchema = Type.Union([
	Type.Literal("cancelled_by_message_sending_hook"),
	Type.Literal("cancelled_by_reply_payload_sending_hook"),
	Type.Literal("empty_after_message_sending_hook"),
	Type.Literal("empty_after_reply_payload_sending_hook"),
	Type.Literal("no_visible_payload")
]);
const outboundFailureStageSchema = Type.Union([
	Type.Literal("platform_send"),
	Type.Literal("queue"),
	Type.Literal("unknown")
]);
/** V1 outbound-message activity record. */
const outboundFailureErrorSchema = Type.Union([Type.Literal("message_delivery_failed"), Type.Literal("message_delivery_partial_failure")]);
const AuditActivityOutboundMessageV1Schema = correlatedObject({
	...outboundMessageProperties,
	status: Type.Union([
		Type.Literal("succeeded"),
		Type.Literal("blocked"),
		Type.Literal("failed"),
		Type.Literal("unknown")
	]),
	outcome: Type.Union([
		Type.Literal("sent"),
		Type.Literal("suppressed"),
		Type.Literal("failed"),
		Type.Literal("unknown")
	]),
	errorCode: Type.Optional(outboundFailureErrorSchema),
	reasonCode: Type.Optional(outboundSuppressedReasonSchema),
	failureStage: Type.Optional(outboundFailureStageSchema)
}, Type.Union([
	Type.Intersect([
		Type.Object({
			status: Type.Literal("succeeded"),
			outcome: Type.Literal("sent")
		}),
		withoutErrorCode,
		withoutReasonCode,
		withoutFailureStage
	]),
	Type.Intersect([
		Type.Object({
			status: Type.Literal("blocked"),
			outcome: Type.Literal("suppressed"),
			reasonCode: outboundSuppressedReasonSchema
		}),
		withoutErrorCode,
		withoutFailureStage,
		withoutDeliveryKind
	]),
	Type.Intersect([Type.Object({
		status: Type.Literal("failed"),
		outcome: Type.Literal("failed"),
		errorCode: outboundFailureErrorSchema,
		failureStage: outboundFailureStageSchema
	}), withoutReasonCode]),
	Type.Intersect([
		Type.Object({
			status: Type.Literal("unknown"),
			outcome: Type.Literal("unknown"),
			failureStage: outboundFailureStageSchema
		}),
		withoutErrorCode,
		withoutReasonCode,
		withoutDeliveryKind
	])
]));
/** Discriminated V1 activity record union. */
const AuditActivityEventV1Schema = Type.Union([
	AuditActivityAgentRunV1Schema,
	AuditActivityToolActionV1Schema,
	AuditActivityInboundMessageV1Schema,
	AuditActivityOutboundMessageV1Schema
]);
/** Bounded newest-first V1 activity query filters. */
const AuditActivityListParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	kind: Type.Optional(AuditActivityKindV1Schema),
	status: Type.Optional(AuditActivityStatusV1Schema),
	direction: Type.Optional(AuditActivityDirectionV1Schema),
	channel: Type.Optional(NonEmptyString),
	after: Type.Optional(Type.Integer({ minimum: 0 })),
	before: Type.Optional(Type.Integer({ minimum: 0 })),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 500
	})),
	cursor: Type.Optional(NonEmptyString)
});
/** Stable sequence-cursor V1 activity page. */
const AuditActivityListResultSchema = closedObject({
	events: Type.Array(AuditActivityEventV1Schema),
	nextCursor: Type.Optional(NonEmptyString)
});
//#endregion
//#region packages/gateway-protocol/src/schema/audit-run.ts
const ExecutionIdentityRefSchema = Type.String({
	minLength: 1,
	maxLength: 256
});
const ExecutionIdentityDisplayLabelSchema = Type.String({ maxLength: 128 });
const ExecutionIdentityEvidenceStateSchema = Type.Union([
	Type.Literal("present"),
	Type.Literal("absent"),
	Type.Literal("unknown"),
	Type.Literal("unsupported")
]);
const ExecutionIdentityContextCoverageStateSchema = Type.Union([
	Type.Literal("attribution-only"),
	Type.Literal("unattributed"),
	Type.Literal("unknown"),
	Type.Literal("unsupported")
]);
const ExecutionIdentityDecisionCoverageStateSchema = Type.Union([
	Type.Literal("enforced"),
	Type.Literal("attribution-only"),
	Type.Literal("unattributed"),
	Type.Literal("unknown"),
	Type.Literal("unsupported")
]);
const ExecutionIdentityRefArraySchema = Type.Array(ExecutionIdentityRefSchema, { maxItems: 16 });
const PrincipalRefV1Schema = closedObject({
	kind: Type.Union([
		Type.Literal("person"),
		Type.Literal("agent"),
		Type.Literal("service"),
		Type.Literal("schedule"),
		Type.Literal("webhook"),
		Type.Literal("system"),
		Type.Literal("local-account"),
		Type.Literal("runtime")
	]),
	domainRef: ExecutionIdentityRefSchema,
	principalRef: ExecutionIdentityRefSchema,
	displayLabel: Type.Optional(ExecutionIdentityDisplayLabelSchema)
});
const PrincipalFactV1Schema = closedObject({
	principal: PrincipalRefV1Schema,
	state: ExecutionIdentityEvidenceStateSchema
});
const SponsorFactV1Schema = closedObject({
	principal: PrincipalRefV1Schema,
	relationshipRef: Type.Optional(ExecutionIdentityRefSchema),
	state: ExecutionIdentityEvidenceStateSchema
});
const AssuranceEvidenceV1Schema = closedObject({
	kind: Type.Union([
		Type.Literal("durable-profile"),
		Type.Literal("trusted-proxy"),
		Type.Literal("tailscale-whois"),
		Type.Literal("device-proof"),
		Type.Literal("channel-admission"),
		Type.Literal("local-process"),
		Type.Literal("spawn-lineage"),
		Type.Literal("worker-admission"),
		Type.Literal("runtime-binding"),
		Type.Literal("other")
	]),
	evidenceRef: ExecutionIdentityRefSchema,
	strength: Type.Union([
		Type.Literal("self-asserted"),
		Type.Literal("boundary-verified"),
		Type.Literal("cryptographic")
	])
});
const ExecutionIdentityIngressKindSchema = Type.Union([
	Type.Literal("local-cli"),
	Type.Literal("gateway-client"),
	Type.Literal("channel"),
	Type.Literal("api"),
	Type.Literal("schedule"),
	Type.Literal("webhook"),
	Type.Literal("task"),
	Type.Literal("subagent"),
	Type.Literal("acp"),
	Type.Literal("worker"),
	Type.Literal("plugin"),
	Type.Literal("recovery"),
	Type.Literal("system")
]);
const ExecutionIdentityRuntimeKindSchema = Type.Union([
	Type.Literal("gateway"),
	Type.Literal("embedded"),
	Type.Literal("worker"),
	Type.Literal("plugin-harness"),
	Type.Literal("acp")
]);
const ExecutionIdentityContextV1Schema = closedObject({
	schemaVersion: Type.Literal(1),
	contextId: ExecutionIdentityRefSchema,
	executionId: ExecutionIdentityRefSchema,
	runId: ExecutionIdentityRefSchema,
	createdAt: Type.Integer({ minimum: 0 }),
	trustDomain: closedObject({
		kind: Type.Literal("gateway-cell"),
		domainRef: ExecutionIdentityRefSchema,
		state: ExecutionIdentityEvidenceStateSchema
	}),
	invoker: closedObject({
		principal: Type.Optional(PrincipalRefV1Schema),
		state: ExecutionIdentityEvidenceStateSchema
	}),
	ingress: closedObject({
		kind: ExecutionIdentityIngressKindSchema,
		sourceRef: Type.Optional(ExecutionIdentityRefSchema),
		boundary: ExecutionIdentityRefSchema,
		state: ExecutionIdentityEvidenceStateSchema
	}),
	agentPrincipal: PrincipalRefV1Schema,
	agentDefinition: closedObject({
		definitionRef: ExecutionIdentityRefSchema,
		revisionRef: Type.Optional(ExecutionIdentityRefSchema),
		state: ExecutionIdentityEvidenceStateSchema
	}),
	runtimeInstance: closedObject({
		runtimeRef: ExecutionIdentityRefSchema,
		kind: ExecutionIdentityRuntimeKindSchema,
		state: ExecutionIdentityEvidenceStateSchema
	}),
	representedSubject: Type.Optional(PrincipalFactV1Schema),
	sponsor: Type.Optional(SponsorFactV1Schema),
	applicableGrants: Type.Array(closedObject({
		grantRef: ExecutionIdentityRefSchema,
		state: ExecutionIdentityEvidenceStateSchema
	}), { maxItems: 16 }),
	assurance: Type.Array(AssuranceEvidenceV1Schema, { maxItems: 16 }),
	lineage: Type.Optional(closedObject({
		parentContextId: Type.Optional(ExecutionIdentityRefSchema),
		parentExecutionId: Type.Optional(ExecutionIdentityRefSchema),
		parentRunId: Type.Optional(ExecutionIdentityRefSchema),
		parentAgentPrincipal: Type.Optional(PrincipalRefV1Schema),
		delegationRef: Type.Optional(ExecutionIdentityRefSchema),
		depth: Type.Integer({
			minimum: 0,
			maximum: 64
		})
	})),
	coverageState: ExecutionIdentityContextCoverageStateSchema,
	missingEvidence: ExecutionIdentityRefArraySchema
});
const ExecutionIdentityRemediationV1Schema = closedObject({
	code: ExecutionIdentityRefSchema,
	text: Type.String({
		minLength: 1,
		maxLength: 512
	})
});
const DecisionReceiptV1Schema = closedObject({
	schemaVersion: Type.Literal(1),
	receiptId: ExecutionIdentityRefSchema,
	contextId: ExecutionIdentityRefSchema,
	executionId: ExecutionIdentityRefSchema,
	runId: ExecutionIdentityRefSchema,
	actionId: Type.Optional(ExecutionIdentityRefSchema),
	occurredAt: Type.Integer({ minimum: 0 }),
	action: closedObject({
		family: ExecutionIdentityRefSchema,
		operation: ExecutionIdentityRefSchema,
		resourceRef: Type.Optional(ExecutionIdentityRefSchema),
		targetRef: Type.Optional(ExecutionIdentityRefSchema),
		summary: Type.Optional(Type.String({ maxLength: 512 }))
	}),
	decision: closedObject({
		outcome: Type.Union([
			Type.Literal("allowed"),
			Type.Literal("denied"),
			Type.Literal("not-applicable"),
			Type.Literal("unknown")
		]),
		reasonCode: ExecutionIdentityRefSchema
	}),
	enforcement: closedObject({
		coverageState: ExecutionIdentityDecisionCoverageStateSchema,
		evaluatorRef: Type.Optional(ExecutionIdentityRefSchema),
		policyRefs: ExecutionIdentityRefArraySchema,
		grantRefs: ExecutionIdentityRefArraySchema,
		contextFieldsUsed: ExecutionIdentityRefArraySchema
	}),
	source: closedObject({
		owner: ExecutionIdentityRefSchema,
		recordRef: ExecutionIdentityRefSchema,
		decisionBoundary: ExecutionIdentityRefSchema
	}),
	missingEvidence: ExecutionIdentityRefArraySchema,
	remediation: Type.Array(ExecutionIdentityRemediationV1Schema, { maxItems: 8 })
});
const AuditRunIdentityPresentV1Schema = closedObject({
	state: Type.Literal("present"),
	context: ExecutionIdentityContextV1Schema
});
const AuditRunIdentityUnknownV1Schema = closedObject({
	state: Type.Literal("unknown"),
	reasonCode: ExecutionIdentityRefSchema,
	missingEvidence: ExecutionIdentityRefArraySchema,
	remediation: Type.Array(ExecutionIdentityRemediationV1Schema, { maxItems: 8 })
});
const AuditRunIdentityUnsupportedV1Schema = closedObject({
	state: Type.Literal("unsupported"),
	reasonCode: ExecutionIdentityRefSchema,
	missingEvidence: ExecutionIdentityRefArraySchema,
	remediation: Type.Array(ExecutionIdentityRemediationV1Schema, { maxItems: 8 })
});
const AuditRunIdentityAmbiguousV1Schema = closedObject({
	state: Type.Literal("ambiguous"),
	reasonCode: ExecutionIdentityRefSchema,
	candidates: Type.Array(closedObject({
		executionId: ExecutionIdentityRefSchema,
		contextId: ExecutionIdentityRefSchema,
		createdAt: Type.Integer({ minimum: 0 })
	}), { maxItems: 50 }),
	missingEvidence: ExecutionIdentityRefArraySchema,
	remediation: Type.Array(ExecutionIdentityRemediationV1Schema, { maxItems: 8 })
});
const AuditRunIdentityV1Schema = Type.Union([
	AuditRunIdentityPresentV1Schema,
	AuditRunIdentityUnknownV1Schema,
	AuditRunIdentityUnsupportedV1Schema,
	AuditRunIdentityAmbiguousV1Schema
]);
const AuditRunDecisionPageParams = {
	decisionCursor: Type.Optional(ExecutionIdentityRefSchema),
	decisionLimit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 100
	}))
};
const AuditRunInspectParamsSchema = Type.Object({
	runId: Type.Optional(ExecutionIdentityRefSchema),
	executionId: Type.Optional(ExecutionIdentityRefSchema),
	executionCursor: Type.Optional(ExecutionIdentityRefSchema),
	executionLimit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 50
	})),
	...AuditRunDecisionPageParams
}, {
	additionalProperties: false,
	oneOf: [{
		required: ["runId"],
		not: { required: ["executionId"] }
	}, {
		required: ["executionId"],
		not: { anyOf: [
			{ required: ["runId"] },
			{ required: ["executionCursor"] },
			{ required: ["executionLimit"] }
		] }
	}]
});
const AuditRunInspectResultSchema = closedObject({
	schemaVersion: Type.Literal(1),
	run: closedObject({
		runId: Type.Optional(ExecutionIdentityRefSchema),
		executionId: Type.Optional(ExecutionIdentityRefSchema),
		status: Type.Union([Type.Literal("known"), Type.Literal("unknown")])
	}),
	identity: AuditRunIdentityV1Schema,
	decisions: Type.Array(DecisionReceiptV1Schema, { maxItems: 100 }),
	coverage: closedObject({
		state: ExecutionIdentityDecisionCoverageStateSchema,
		missingEvidence: ExecutionIdentityRefArraySchema
	}),
	nextDecisionCursor: Type.Optional(ExecutionIdentityRefSchema),
	nextExecutionCursor: Type.Optional(ExecutionIdentityRefSchema)
});
//#endregion
//#region packages/gateway-protocol/src/schema/audit.ts
const AuditEventKindSchema = Type.Union([Type.Literal("agent_run"), Type.Literal("tool_action")]);
const AuditEventActionSchema = Type.Union([
	Type.Literal("agent.run.started"),
	Type.Literal("agent.run.finished"),
	Type.Literal("tool.action.started"),
	Type.Literal("tool.action.finished")
]);
const AuditEventStatusSchema = Type.Union([
	Type.Literal("started"),
	Type.Literal("succeeded"),
	Type.Literal("failed"),
	Type.Literal("cancelled"),
	Type.Literal("timed_out"),
	Type.Literal("blocked"),
	Type.Literal("unknown")
]);
const AuditEventErrorCodeSchema = Type.Union([
	Type.Literal("run_failed"),
	Type.Literal("run_cancelled"),
	Type.Literal("run_timed_out"),
	Type.Literal("run_blocked"),
	Type.Literal("tool_failed"),
	Type.Literal("tool_cancelled"),
	Type.Literal("tool_timed_out"),
	Type.Literal("tool_blocked"),
	Type.Literal("tool_outcome_unknown")
]);
/** One content-free run/tool audit record. */
const AuditEventSchema = closedObject({
	eventId: NonEmptyString,
	sequence: Type.Integer({ minimum: 1 }),
	sourceSequence: Type.Integer({ minimum: 1 }),
	occurredAt: Type.Integer({ minimum: 0 }),
	kind: AuditEventKindSchema,
	action: AuditEventActionSchema,
	status: AuditEventStatusSchema,
	errorCode: Type.Optional(AuditEventErrorCodeSchema),
	actor: closedObject({
		type: Type.Union([Type.Literal("agent"), Type.Literal("system")]),
		id: NonEmptyString
	}),
	agentId: NonEmptyString,
	sessionKey: Type.Optional(NonEmptyString),
	sessionId: Type.Optional(NonEmptyString),
	runId: NonEmptyString,
	toolCallId: Type.Optional(NonEmptyString),
	toolName: Type.Optional(NonEmptyString),
	redaction: Type.Literal("metadata_only")
});
/** Bounded newest-first audit query filters. */
const AuditListParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	kind: Type.Optional(AuditEventKindSchema),
	status: Type.Optional(AuditEventStatusSchema),
	after: Type.Optional(Type.Integer({ minimum: 0 })),
	before: Type.Optional(Type.Integer({ minimum: 0 })),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 500
	})),
	cursor: Type.Optional(NonEmptyString)
});
/** Stable sequence-cursor page suitable for bounded JSON export. */
const AuditListResultSchema = closedObject({
	events: Type.Array(AuditEventSchema),
	nextCursor: Type.Optional(NonEmptyString)
});
//#endregion
//#region packages/gateway-protocol/src/schema/channels.ts
/**
* Channel and Talk protocol schemas.
*
* Talk schemas are consumed by browser realtime clients, gateway relay sessions,
* and channel adapters, so the mode/transport/brain unions below are shared
* API vocabulary rather than provider-local implementation details.
*/
/** Toggles Talk mode for the gateway, with an optional rollout phase marker. */
const TalkModeParamsSchema = closedObject({
	enabled: Type.Boolean(),
	phase: Type.Optional(Type.String())
});
/** Reads Talk configuration; secrets are included only for trusted callers. */
const TalkConfigParamsSchema = closedObject({ includeSecrets: Type.Optional(Type.Boolean()) });
/** One-shot text-to-speech request with provider-specific voice tuning knobs. */
const TalkSpeakParamsSchema = closedObject({
	text: NonEmptyString,
	voiceId: Type.Optional(Type.String()),
	modelId: Type.Optional(Type.String()),
	outputFormat: Type.Optional(Type.String()),
	speed: Type.Optional(Type.Number()),
	rateWpm: Type.Optional(Type.Integer({ minimum: 1 })),
	stability: Type.Optional(Type.Number()),
	similarity: Type.Optional(Type.Number()),
	style: Type.Optional(Type.Number()),
	speakerBoost: Type.Optional(Type.Boolean()),
	seed: Type.Optional(Type.Integer({ minimum: 0 })),
	normalize: Type.Optional(Type.String()),
	language: Type.Optional(Type.String()),
	latencyTier: Type.Optional(Type.Integer({ minimum: 0 }))
});
/**
* One-shot text-to-speech request rendered with the configured TTS provider
* chain (unlike `talk.speak`, which pins the Talk-mode provider).
*/
const TtsSpeakParamsSchema = closedObject({ text: NonEmptyString });
/** Supported Talk session shapes exposed to clients and providers. */
const TalkModeSchema = Type.Union([
	Type.Literal("realtime"),
	Type.Literal("stt-tts"),
	Type.Literal("transcription")
]);
/** Transport families; browser clients branch on this value to choose setup flow. */
const TalkTransportSchema = Type.Union([
	Type.Literal("webrtc"),
	Type.Literal("provider-websocket"),
	Type.Literal("gateway-relay"),
	Type.Literal("managed-room")
]);
/** How a Talk session delegates reasoning/tool use to the agent runtime. */
const TalkBrainSchema = Type.Union([
	Type.Literal("agent-consult"),
	Type.Literal("direct-tools"),
	Type.Literal("none")
]);
/** Agent control actions accepted from Talk clients and managed rooms. */
const TalkAgentControlModeSchema = Type.Union([
	Type.Literal("status"),
	Type.Literal("steer"),
	Type.Literal("cancel"),
	Type.Literal("followup")
]);
/** Stable event names emitted by Talk sessions across providers/transports. */
const TalkEventTypeSchema = Type.Union([
	Type.Literal("session.started"),
	Type.Literal("session.ready"),
	Type.Literal("session.closed"),
	Type.Literal("session.error"),
	Type.Literal("session.replaced"),
	Type.Literal("turn.started"),
	Type.Literal("turn.ended"),
	Type.Literal("turn.cancelled"),
	Type.Literal("capture.started"),
	Type.Literal("capture.stopped"),
	Type.Literal("capture.cancelled"),
	Type.Literal("capture.once"),
	Type.Literal("input.audio.delta"),
	Type.Literal("input.audio.committed"),
	Type.Literal("transcript.delta"),
	Type.Literal("transcript.done"),
	Type.Literal("output.text.delta"),
	Type.Literal("output.text.done"),
	Type.Literal("output.audio.started"),
	Type.Literal("output.audio.delta"),
	Type.Literal("output.audio.done"),
	Type.Literal("tool.call"),
	Type.Literal("tool.progress"),
	Type.Literal("tool.result"),
	Type.Literal("tool.error"),
	Type.Literal("usage.metrics"),
	Type.Literal("latency.metrics"),
	Type.Literal("health.changed")
]);
/** Event types that must carry a turn id for client-side stream correlation. */
const TURN_SCOPED_TALK_EVENT_TYPES = [
	"turn.started",
	"turn.ended",
	"turn.cancelled",
	"input.audio.delta",
	"input.audio.committed",
	"transcript.delta",
	"transcript.done",
	"output.text.delta",
	"output.text.done",
	"output.audio.started",
	"output.audio.delta",
	"output.audio.done",
	"tool.call",
	"tool.progress",
	"tool.result",
	"tool.error"
];
/** Capture lifecycle events must include capture id to avoid cross-turn ambiguity. */
const CAPTURE_SCOPED_TALK_EVENT_TYPES = [
	"capture.started",
	"capture.stopped",
	"capture.cancelled",
	"capture.once"
];
/** Builds JSON Schema conditional requirements while avoiding reserved word syntax. */
function requireJsonSchemaProperties(properties) {
	const conditionalRequirementKey = ["th", "en"].join("");
	return Object.fromEntries([[conditionalRequirementKey, { required: properties }]]);
}
/** Canonical Talk event envelope emitted to browser, relay, and channel consumers. */
const TalkEventSchema = Type.Object({
	id: NonEmptyString,
	type: TalkEventTypeSchema,
	sessionId: NonEmptyString,
	turnId: Type.Optional(Type.String()),
	captureId: Type.Optional(Type.String()),
	seq: Type.Integer({ minimum: 1 }),
	timestamp: NonEmptyString,
	mode: TalkModeSchema,
	transport: TalkTransportSchema,
	brain: TalkBrainSchema,
	provider: Type.Optional(Type.String()),
	final: Type.Optional(Type.Boolean()),
	callId: Type.Optional(Type.String()),
	itemId: Type.Optional(Type.String()),
	parentId: Type.Optional(Type.String()),
	payload: Type.Unknown()
}, {
	additionalProperties: false,
	allOf: [{
		if: {
			properties: { type: { enum: TURN_SCOPED_TALK_EVENT_TYPES } },
			required: ["type"]
		},
		...requireJsonSchemaProperties(["turnId"])
	}, {
		if: {
			properties: { type: { enum: CAPTURE_SCOPED_TALK_EVENT_TYPES } },
			required: ["type"]
		},
		...requireJsonSchemaProperties(["captureId"])
	}]
});
const VoiceIdString = Type.String({ pattern: "^[A-Za-z0-9_-]{1,128}$" });
/** Creates a browser-facing Talk client session. */
const TalkClientCreateParamsSchema = closedObject({
	sessionKey: Type.Optional(NonEmptyString),
	voiceSessionId: Type.Optional(VoiceIdString),
	provider: Type.Optional(Type.String()),
	model: Type.Optional(Type.String()),
	voice: Type.Optional(Type.String()),
	vadThreshold: Type.Optional(Type.Number()),
	silenceDurationMs: Type.Optional(Type.Integer({ minimum: 1 })),
	prefixPaddingMs: Type.Optional(Type.Integer({ minimum: 0 })),
	reasoningEffort: Type.Optional(Type.String()),
	mode: Type.Optional(TalkModeSchema),
	transport: Type.Optional(TalkTransportSchema),
	brain: Type.Optional(TalkBrainSchema),
	capabilities: Type.Optional(Type.Array(Type.Union([
		Type.Literal("camera-frame"),
		Type.Literal("voice-transcript"),
		Type.Literal("gateway-control-v1")
	]), { uniqueItems: true }))
});
/** Tool-call request from a browser/client session back into the agent runtime. */
const TalkClientToolCallParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	voiceSessionId: Type.Optional(VoiceIdString),
	callId: NonEmptyString,
	name: NonEmptyString,
	args: Type.Optional(Type.Unknown()),
	relaySessionId: Type.Optional(NonEmptyString)
});
/** One finalized transcript item from a client-owned Talk session. */
const TalkClientTranscriptParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	voiceSessionId: VoiceIdString,
	entryId: VoiceIdString,
	role: Type.Union([Type.Literal("user"), Type.Literal("assistant")]),
	text: NonEmptyString,
	timestamp: Type.Optional(Type.Number())
});
/** Logical close for a client-owned Talk session. */
const TalkClientCloseParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	voiceSessionId: VoiceIdString
});
/** Result for client-owned transcript and close mutations. */
const TalkClientMutationResultSchema = closedObject({ ok: Type.Literal(true) });
/** Agent run identity returned after accepting a Talk client tool call. */
const TalkClientToolCallResultSchema = closedObject({
	runId: NonEmptyString,
	idempotencyKey: NonEmptyString
});
/** Text steering request for a Talk session bound to an agent turn. */
const TalkClientSteerParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	text: NonEmptyString,
	mode: Type.Optional(TalkAgentControlModeSchema)
});
/** Result of applying agent control to an embedded or reply-backed Talk run. */
const TalkAgentControlResultSchema = closedObject({
	ok: Type.Boolean(),
	mode: TalkAgentControlModeSchema,
	sessionKey: NonEmptyString,
	sessionId: Type.Optional(NonEmptyString),
	active: Type.Boolean(),
	queued: Type.Optional(Type.Boolean()),
	aborted: Type.Optional(Type.Boolean()),
	target: Type.Optional(Type.Union([Type.Literal("embedded_run"), Type.Literal("reply_run")])),
	reason: Type.Optional(Type.String()),
	message: Type.String(),
	speak: Type.Boolean(),
	show: Type.Boolean(),
	suppress: Type.Boolean(),
	providerResult: Type.Optional(closedObject({
		status: Type.Literal("cancelled"),
		message: Type.String()
	})),
	enqueuedAtMs: Type.Optional(Type.Number()),
	deliveredAtMs: Type.Optional(Type.Number())
});
/** Creates a gateway-managed Talk session for realtime, transcription, or relay use. */
const TalkSessionCreateParamsSchema = closedObject({
	sessionKey: Type.Optional(Type.String()),
	spawnedBy: Type.Optional(NonEmptyString),
	provider: Type.Optional(Type.String()),
	model: Type.Optional(Type.String()),
	voice: Type.Optional(Type.String()),
	language: Type.Optional(Type.String({ pattern: "^[a-z]{2}$" })),
	vadThreshold: Type.Optional(Type.Number()),
	silenceDurationMs: Type.Optional(Type.Integer({ minimum: 1 })),
	prefixPaddingMs: Type.Optional(Type.Integer({ minimum: 0 })),
	reasoningEffort: Type.Optional(Type.String()),
	mode: Type.Optional(TalkModeSchema),
	transport: Type.Optional(TalkTransportSchema),
	brain: Type.Optional(TalkBrainSchema),
	ttlMs: Type.Optional(Type.Integer({
		minimum: 1e3,
		maximum: 36e5
	}))
});
/** Appends base64 audio to an active Talk session. */
const TalkSessionAppendAudioParamsSchema = closedObject({
	sessionId: NonEmptyString,
	audioBase64: NonEmptyString,
	timestamp: Type.Optional(Type.Number())
});
/** Cancels currently streaming Talk output without necessarily ending the turn. */
const TalkSessionCancelOutputParamsSchema = closedObject({
	sessionId: NonEmptyString,
	turnId: Type.Optional(Type.String()),
	reason: Type.Optional(Type.String())
});
/** Submits a tool result back to a Talk provider session. */
const TalkSessionSubmitToolResultParamsSchema = closedObject({
	sessionId: NonEmptyString,
	callId: NonEmptyString,
	result: Type.Unknown(),
	options: Type.Optional(closedObject({
		suppressResponse: Type.Optional(Type.Boolean()),
		willContinue: Type.Optional(Type.Boolean())
	}))
});
/** Steers a managed Talk session by session id rather than transcript key. */
const TalkSessionSteerParamsSchema = closedObject({
	sessionId: NonEmptyString,
	sessionKey: Type.Optional(NonEmptyString),
	text: NonEmptyString,
	mode: Type.Optional(TalkAgentControlModeSchema)
});
/** Closes a gateway-managed Talk session. */
const TalkSessionCloseParamsSchema = closedObject({ sessionId: NonEmptyString });
/** Empty request payload for reading configured Talk provider capabilities. */
const TalkCatalogParamsSchema = closedObject({});
/** One provider entry in the Talk capability catalog. */
const TalkCatalogProviderSchema = closedObject({
	id: NonEmptyString,
	label: NonEmptyString,
	configured: Type.Boolean(),
	aliases: Type.Optional(Type.Array(NonEmptyString)),
	models: Type.Optional(Type.Array(Type.String())),
	voices: Type.Optional(Type.Array(Type.String())),
	defaultModel: Type.Optional(Type.String()),
	modes: Type.Optional(Type.Array(TalkModeSchema)),
	transports: Type.Optional(Type.Array(TalkTransportSchema)),
	brains: Type.Optional(Type.Array(TalkBrainSchema)),
	inputAudioFormats: Type.Optional(Type.Array(closedObject({
		encoding: Type.Union([Type.Literal("pcm16"), Type.Literal("g711_ulaw")]),
		sampleRateHz: Type.Integer({ minimum: 1 }),
		channels: Type.Integer({ minimum: 1 })
	}))),
	outputAudioFormats: Type.Optional(Type.Array(closedObject({
		encoding: Type.Union([Type.Literal("pcm16"), Type.Literal("g711_ulaw")]),
		sampleRateHz: Type.Integer({ minimum: 1 }),
		channels: Type.Integer({ minimum: 1 })
	}))),
	supportsBrowserSession: Type.Optional(Type.Boolean()),
	supportsBargeIn: Type.Optional(Type.Boolean()),
	supportsToolCalls: Type.Optional(Type.Boolean()),
	supportsVideoFrames: Type.Optional(Type.Boolean()),
	supportsSessionResumption: Type.Optional(Type.Boolean())
});
/** Active provider plus all candidates for a Talk capability family. */
const TalkCatalogProviderGroupSchema = closedObject({
	ready: Type.Optional(Type.Boolean()),
	activeProvider: Type.Optional(Type.String()),
	providers: Type.Array(TalkCatalogProviderSchema)
});
/** Provider, mode, transport, and audio-format catalog returned to clients. */
const TalkCatalogResultSchema = closedObject({
	modes: Type.Array(TalkModeSchema),
	transports: Type.Array(TalkTransportSchema),
	brains: Type.Array(TalkBrainSchema),
	speech: TalkCatalogProviderGroupSchema,
	transcription: TalkCatalogProviderGroupSchema,
	realtime: TalkCatalogProviderGroupSchema
});
/** Audio format contract for realtime browser sessions. */
const BrowserRealtimeAudioContractSchema = closedObject({
	inputEncoding: Type.Union([Type.Literal("pcm16"), Type.Literal("g711_ulaw")]),
	inputSampleRateHz: Type.Integer({ minimum: 1 }),
	outputEncoding: Type.Union([Type.Literal("pcm16"), Type.Literal("g711_ulaw")]),
	outputSampleRateHz: Type.Integer({ minimum: 1 })
});
/** Session creation result with transport-specific ids and credentials. */
const TalkSessionCreateResultSchema = closedObject({
	sessionId: NonEmptyString,
	provider: Type.Optional(Type.String()),
	mode: TalkModeSchema,
	transport: TalkTransportSchema,
	brain: TalkBrainSchema,
	relaySessionId: Type.Optional(NonEmptyString),
	transcriptionSessionId: Type.Optional(NonEmptyString),
	handoffId: Type.Optional(NonEmptyString),
	roomId: Type.Optional(NonEmptyString),
	roomUrl: Type.Optional(NonEmptyString),
	token: Type.Optional(NonEmptyString),
	audio: Type.Optional(Type.Unknown()),
	model: Type.Optional(Type.String()),
	voice: Type.Optional(Type.String()),
	expiresAt: Type.Optional(Type.Number())
});
/** Generic success result for Talk session lifecycle calls. */
const TalkSessionOkResultSchema = closedObject({ ok: Type.Boolean() });
/** Browser WebRTC setup payload using provider SDP exchange. */
const BrowserRealtimeWebRtcSdpSessionSchema = closedObject({
	provider: NonEmptyString,
	transport: Type.Literal("webrtc"),
	voiceSessionId: NonEmptyString,
	clientSecret: NonEmptyString,
	offerUrl: Type.Optional(Type.String()),
	offerHeaders: Type.Optional(Type.Record(Type.String(), Type.String())),
	model: Type.Optional(Type.String()),
	voice: Type.Optional(Type.String()),
	expiresAt: Type.Optional(Type.Number()),
	clientControl: Type.Optional(closedObject({ owner: Type.Literal("gateway") }))
});
/** Browser websocket setup payload with JSON/PCM audio contract. */
const BrowserRealtimeJsonPcmWebSocketSessionSchema = closedObject({
	provider: NonEmptyString,
	transport: Type.Literal("provider-websocket"),
	voiceSessionId: NonEmptyString,
	protocol: NonEmptyString,
	clientSecret: NonEmptyString,
	websocketUrl: NonEmptyString,
	audio: BrowserRealtimeAudioContractSchema,
	initialMessage: Type.Optional(Type.Unknown()),
	model: Type.Optional(Type.String()),
	voice: Type.Optional(Type.String()),
	expiresAt: Type.Optional(Type.Number())
});
/** Browser setup payload for gateway-relayed realtime audio. */
const BrowserRealtimeGatewayRelaySessionSchema = closedObject({
	provider: NonEmptyString,
	transport: Type.Literal("gateway-relay"),
	voiceSessionId: Type.Optional(NonEmptyString),
	relaySessionId: NonEmptyString,
	audio: BrowserRealtimeAudioContractSchema,
	model: Type.Optional(Type.String()),
	voice: Type.Optional(Type.String()),
	expiresAt: Type.Optional(Type.Number())
});
/** Browser setup payload for managed-room Talk sessions. */
const BrowserRealtimeManagedRoomSessionSchema = closedObject({
	provider: NonEmptyString,
	transport: Type.Literal("managed-room"),
	voiceSessionId: Type.Optional(NonEmptyString),
	roomUrl: NonEmptyString,
	token: Type.Optional(Type.String()),
	model: Type.Optional(Type.String()),
	voice: Type.Optional(Type.String()),
	expiresAt: Type.Optional(Type.Number())
});
/** Union of all browser Talk session setup payloads. */
const TalkClientCreateResultSchema = Type.Union([
	BrowserRealtimeWebRtcSdpSessionSchema,
	BrowserRealtimeJsonPcmWebSocketSessionSchema,
	BrowserRealtimeGatewayRelaySessionSchema,
	BrowserRealtimeManagedRoomSessionSchema
]);
/** Secret-bearing provider fields; extra provider options remain provider-owned. */
const talkProviderFieldSchemas = { apiKey: Type.Optional(SecretInputSchema) };
/** Per-provider Talk config bag. */
const TalkProviderConfigSchema = Type.Object(talkProviderFieldSchemas, { additionalProperties: true });
/** Realtime Talk defaults and provider selection stored in config. */
const TalkRealtimeConfigSchema = closedObject({
	provider: Type.Optional(Type.String()),
	providers: Type.Optional(Type.Record(Type.String(), TalkProviderConfigSchema)),
	model: Type.Optional(Type.String()),
	speakerVoice: Type.Optional(Type.String()),
	speakerVoiceId: Type.Optional(Type.String()),
	voice: Type.Optional(Type.String()),
	instructions: Type.Optional(Type.String()),
	mode: Type.Optional(TalkModeSchema),
	transport: Type.Optional(TalkTransportSchema),
	vadThreshold: Type.Optional(Type.Number({
		minimum: 0,
		maximum: 1
	})),
	silenceDurationMs: Type.Optional(Type.Integer({ minimum: 1 })),
	prefixPaddingMs: Type.Optional(Type.Integer({ minimum: 0 })),
	reasoningEffort: Type.Optional(Type.String({ minLength: 1 })),
	brain: Type.Optional(TalkBrainSchema),
	consultRouting: Type.Optional(Type.Union([Type.Literal("provider-direct"), Type.Literal("force-agent-consult")]))
});
/** Resolved active Talk provider plus its normalized provider config. */
const ResolvedTalkConfigSchema = closedObject({
	provider: Type.String(),
	config: TalkProviderConfigSchema
});
/** Talk config subtree returned through gateway config APIs. */
const TalkConfigSchema = closedObject({
	provider: Type.Optional(Type.String()),
	providers: Type.Optional(Type.Record(Type.String(), TalkProviderConfigSchema)),
	realtime: Type.Optional(TalkRealtimeConfigSchema),
	resolved: Type.Optional(ResolvedTalkConfigSchema),
	consultThinkingLevel: Type.Optional(Type.String()),
	consultFastMode: Type.Optional(Type.Boolean()),
	speechLocale: Type.Optional(Type.String()),
	interruptOnSpeech: Type.Optional(Type.Boolean()),
	silenceTimeoutMs: Type.Optional(Type.Integer({ minimum: 1 }))
});
/** Full Talk config read result, including related session/UI context. */
const TalkConfigResultSchema = closedObject({ config: closedObject({
	talk: Type.Optional(TalkConfigSchema),
	session: Type.Optional(closedObject({ mainKey: Type.Optional(Type.String()) })),
	ui: Type.Optional(closedObject({ seamColor: Type.Optional(Type.String()) }))
}) });
/** Text-to-speech result with encoded audio and provider output metadata. */
const TalkSpeakResultSchema = closedObject({
	audioBase64: NonEmptyString,
	provider: NonEmptyString,
	outputFormat: Type.Optional(Type.String()),
	voiceCompatible: Type.Optional(Type.Boolean()),
	mimeType: Type.Optional(Type.String()),
	fileExtension: Type.Optional(Type.String())
});
/** Text-to-speech result for `tts.speak` with encoded audio and provider metadata. */
const TtsSpeakResultSchema = closedObject({
	audioBase64: NonEmptyString,
	provider: NonEmptyString,
	outputFormat: Type.Optional(Type.String()),
	mimeType: Type.Optional(Type.String()),
	fileExtension: Type.Optional(Type.String())
});
/** Channel status request, optionally probing one channel before returning. */
const ChannelsStatusParamsSchema = closedObject({
	probe: Type.Optional(Type.Boolean()),
	timeoutMs: Type.Optional(Type.Integer({ minimum: 0 })),
	channel: Type.Optional(NonEmptyString)
});
/**
* Per-account status snapshot for channel docking.
*
* This is intentionally schema-light so new channel-specific metadata can ship
* without a gateway protocol update; known fields stay documented for UI use.
*/
const ChannelAccountSnapshotSchema = Type.Object({
	accountId: NonEmptyString,
	name: Type.Optional(Type.String()),
	enabled: Type.Optional(Type.Boolean()),
	configured: Type.Optional(Type.Boolean()),
	linked: Type.Optional(Type.Boolean()),
	running: Type.Optional(Type.Boolean()),
	connected: Type.Optional(Type.Boolean()),
	reconnectAttempts: Type.Optional(Type.Integer({ minimum: 0 })),
	lastConnectedAt: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
	lastError: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	healthState: Type.Optional(Type.String()),
	lastStartAt: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
	lastStopAt: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
	lastInboundAt: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
	lastOutboundAt: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
	lastTransportActivityAt: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
	busy: Type.Optional(Type.Boolean()),
	activeRuns: Type.Optional(Type.Integer({ minimum: 0 })),
	lastRunActivityAt: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
	activeRunStartedAt: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
	lastProbeAt: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
	mode: Type.Optional(Type.String()),
	dmPolicy: Type.Optional(Type.String()),
	allowFrom: Type.Optional(Type.Array(Type.String())),
	tokenSource: Type.Optional(Type.String()),
	botTokenSource: Type.Optional(Type.String()),
	appTokenSource: Type.Optional(Type.String()),
	credentialSource: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	audienceType: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	audience: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	webhookPath: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	webhookUrl: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	baseUrl: Type.Optional(Type.String()),
	allowUnmentionedGroups: Type.Optional(Type.Boolean()),
	cliPath: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	dbPath: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	port: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
	probe: Type.Optional(Type.Unknown()),
	audit: Type.Optional(Type.Unknown()),
	application: Type.Optional(Type.Unknown())
}, { additionalProperties: true });
/** UI label and icon metadata for one channel. */
const ChannelUiMetaSchema = closedObject({
	id: NonEmptyString,
	label: NonEmptyString,
	detailLabel: NonEmptyString,
	systemImage: Type.Optional(Type.String())
});
/** Event-loop health snapshot included with channel status responses. */
const ChannelEventLoopHealthSchema = closedObject({
	degraded: Type.Boolean(),
	degradedSinceMs: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
	reasons: Type.Array(Type.Union([
		Type.Literal("event_loop_delay"),
		Type.Literal("event_loop_utilization"),
		Type.Literal("cpu")
	])),
	intervalMs: Type.Integer({ minimum: 0 }),
	delayP99Ms: Type.Number({ minimum: 0 }),
	delayMaxMs: Type.Number({ minimum: 0 }),
	utilization: Type.Number({ minimum: 0 }),
	cpuCoreRatio: Type.Number({ minimum: 0 })
});
/** Full channel status result for dashboard and operator diagnostics. */
const ChannelsStatusResultSchema = closedObject({
	ts: Type.Integer({ minimum: 0 }),
	channelOrder: Type.Array(NonEmptyString),
	channelLabels: Type.Record(NonEmptyString, NonEmptyString),
	channelDetailLabels: Type.Optional(Type.Record(NonEmptyString, NonEmptyString)),
	channelSystemImages: Type.Optional(Type.Record(NonEmptyString, NonEmptyString)),
	channelMeta: Type.Optional(Type.Array(ChannelUiMetaSchema)),
	channels: Type.Record(NonEmptyString, Type.Unknown()),
	channelAccounts: Type.Record(NonEmptyString, Type.Array(ChannelAccountSnapshotSchema)),
	channelDefaultAccountId: Type.Record(NonEmptyString, NonEmptyString),
	eventLoop: Type.Optional(ChannelEventLoopHealthSchema),
	partial: Type.Optional(Type.Boolean()),
	warnings: Type.Optional(Type.Array(Type.String()))
});
/** Logs out one channel account. */
const ChannelsLogoutParamsSchema = closedObject({
	channel: NonEmptyString,
	accountId: Type.Optional(Type.String())
});
/** Stops one channel account runtime. */
const ChannelsStopParamsSchema = closedObject({
	channel: NonEmptyString,
	accountId: Type.Optional(Type.String())
});
/** Starts one channel account runtime. */
const ChannelsStartParamsSchema = closedObject({
	channel: NonEmptyString,
	accountId: Type.Optional(Type.String())
});
/** Starts browser/web login for a channel account. */
const WebLoginStartParamsSchema = closedObject({
	force: Type.Optional(Type.Boolean()),
	timeoutMs: Type.Optional(Type.Integer({ minimum: 0 })),
	verbose: Type.Optional(Type.Boolean()),
	accountId: Type.Optional(Type.String())
});
const QrDataUrlSchema = Type.String({
	maxLength: 16384,
	pattern: "^data:image/png;base64,"
});
/** Waits for web login completion or the next QR code. */
const WebLoginWaitParamsSchema = closedObject({
	timeoutMs: Type.Optional(Type.Integer({ minimum: 0 })),
	accountId: Type.Optional(Type.String()),
	currentQrDataUrl: Type.Optional(QrDataUrlSchema)
});
//#endregion
//#region packages/gateway-protocol/src/schema/channel-pairing.ts
const ChannelPairingAccountSchema = closedObject({
	channel: NonEmptyString,
	channelLabel: NonEmptyString,
	accountId: NonEmptyString,
	accountLabel: Type.Optional(NonEmptyString),
	notifySupported: Type.Boolean()
});
const ChannelPairingRequestSchema = closedObject({
	requestId: NonEmptyString,
	channel: NonEmptyString,
	channelLabel: NonEmptyString,
	accountId: NonEmptyString,
	accountLabel: Type.Optional(NonEmptyString),
	senderId: NonEmptyString,
	senderLabel: NonEmptyString,
	metadata: Type.Optional(Type.Record(NonEmptyString, Type.String())),
	createdAt: NonEmptyString,
	lastSeenAt: NonEmptyString,
	expiresAt: NonEmptyString,
	notifySupported: Type.Boolean()
});
/** Lists pending DM sender access requests for pairing-policy channel accounts. */
const ChannelsPairingListParamsSchema = closedObject({
	channel: Type.Optional(NonEmptyString),
	accountId: Type.Optional(NonEmptyString)
});
const ChannelsPairingListResultSchema = closedObject({
	accounts: Type.Array(ChannelPairingAccountSchema),
	requests: Type.Array(ChannelPairingRequestSchema),
	commandOwnerConfigured: Type.Boolean(),
	limits: closedObject({
		pendingPerAccount: Type.Integer({ minimum: 0 }),
		ttlMs: Type.Integer({ minimum: 0 })
	})
});
/** Approves one pending DM sender request. */
const ChannelsPairingApproveParamsSchema = closedObject({
	channel: NonEmptyString,
	accountId: NonEmptyString,
	requestId: NonEmptyString,
	notify: Type.Optional(Type.Boolean()),
	bootstrapCommandOwner: Type.Optional(Type.Boolean())
});
const ChannelsPairingApproveResultSchema = closedObject({
	requestId: NonEmptyString,
	senderId: NonEmptyString,
	notification: Type.String({ enum: [
		"not-requested",
		"sent",
		"unsupported",
		"failed"
	] }),
	commandOwnerBootstrap: Type.String({ enum: [
		"not-requested",
		"configured",
		"already-configured",
		"unavailable"
	] })
});
/** Dismisses one pending request without permanently blocking the sender. */
const ChannelsPairingDismissParamsSchema = closedObject({
	channel: NonEmptyString,
	accountId: NonEmptyString,
	requestId: NonEmptyString
});
const ChannelsPairingDismissResultSchema = closedObject({
	requestId: NonEmptyString,
	senderId: NonEmptyString
});
//#endregion
//#region packages/gateway-protocol/src/schema/talk-marks.ts
/** Acknowledges playback through a named realtime provider mark. */
const TalkSessionAcknowledgeMarkParamsSchema = closedObject({
	sessionId: NonEmptyString,
	markName: NonEmptyString
});
/** Maximum command description length accepted in catalog entries. */
const COMMAND_DESCRIPTION_MAX_LENGTH = 2e3;
const BoundedNonEmptyString = (maxLength) => Type.String({
	minLength: 1,
	maxLength
});
/** Source system that contributed a command. */
const CommandSourceSchema = Type.Union([
	Type.Literal("native"),
	Type.Literal("skill"),
	Type.Literal("plugin")
]);
/** Surfaces where a command may be invoked. */
const CommandScopeSchema = Type.Union([
	Type.Literal("text"),
	Type.Literal("native"),
	Type.Literal("both")
]);
/** Coarse UI grouping for command catalog display. */
const CommandCategorySchema = Type.Union([
	Type.Literal("session"),
	Type.Literal("options"),
	Type.Literal("status"),
	Type.Literal("management"),
	Type.Literal("media"),
	Type.Literal("tools"),
	Type.Literal("docks")
]);
/** Static argument choice shown to clients. */
const CommandArgChoiceSchema = closedObject({
	value: Type.String({ maxLength: 200 }),
	label: Type.String({ maxLength: 200 })
});
/** One typed argument advertised for a command. */
const CommandArgSchema = closedObject({
	name: BoundedNonEmptyString(200),
	description: Type.String({ maxLength: 500 }),
	type: Type.Union([
		Type.Literal("string"),
		Type.Literal("number"),
		Type.Literal("boolean")
	]),
	required: Type.Optional(Type.Boolean()),
	choices: Type.Optional(Type.Array(CommandArgChoiceSchema, { maxItems: 50 })),
	dynamic: Type.Optional(Type.Boolean())
});
const CommandClientPresentationActionSchema = Type.Union([closedObject({ kind: Type.Literal("device-pairing") })]);
const CommandClientPresentationSchema = closedObject({
	when: Type.Literal("no-arguments"),
	action: CommandClientPresentationActionSchema
});
/** One command catalog entry visible to clients. */
const CommandEntrySchema = closedObject({
	name: BoundedNonEmptyString(200),
	nativeName: Type.Optional(BoundedNonEmptyString(200)),
	textAliases: Type.Optional(Type.Array(BoundedNonEmptyString(200), { maxItems: 20 })),
	description: Type.String({ maxLength: COMMAND_DESCRIPTION_MAX_LENGTH }),
	category: Type.Optional(CommandCategorySchema),
	source: CommandSourceSchema,
	/** Whether a skill command is also present in the model-visible skill catalog. */
	skillModelVisible: Type.Optional(Type.Boolean()),
	scope: CommandScopeSchema,
	acceptsArgs: Type.Boolean(),
	args: Type.Optional(Type.Array(CommandArgSchema, { maxItems: 20 })),
	clientPresentation: Type.Optional(CommandClientPresentationSchema)
});
/** Command catalog request filters. */
const CommandsListParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	provider: Type.Optional(NonEmptyString),
	scope: Type.Optional(CommandScopeSchema),
	includeArgs: Type.Optional(Type.Boolean())
});
/** Bounded command catalog response. */
const CommandsListResultSchema = closedObject({ commands: Type.Array(CommandEntrySchema, { maxItems: 500 }) });
//#endregion
//#region packages/gateway-protocol/src/schema/wizard.ts
/** Runtime state reported for gateway-driven setup wizard sessions. */
const WizardRunStatusSchema = Type.Union([
	Type.Literal("running"),
	Type.Literal("done"),
	Type.Literal("cancelled"),
	Type.Literal("error")
]);
/** Starts a setup wizard, optionally scoped to a local or remote workspace. */
const WizardStartParamsSchema = closedObject({
	mode: Type.Optional(Type.Union([Type.Literal("local"), Type.Literal("remote")])),
	workspace: Type.Optional(Type.String()),
	installDaemon: Type.Optional(Type.Boolean()),
	flow: Type.Optional(Type.Union([Type.Literal("setup"), Type.Literal("channels")])),
	channel: Type.Optional(NonEmptyString)
});
/** Client answer payload for the current wizard step. */
const WizardAnswerSchema = closedObject({
	stepId: NonEmptyString,
	value: Type.Optional(Type.Unknown())
});
/** Advances a wizard session, with an answer when the previous step requested input. */
const WizardNextParamsSchema = closedObject({
	sessionId: NonEmptyString,
	answer: Type.Optional(WizardAnswerSchema)
});
/** Shared session-id-only params for cancel and status requests. */
const WizardSessionIdParamsSchema = closedObject({ sessionId: NonEmptyString });
/** Cancels an active wizard session. */
const WizardCancelParamsSchema = WizardSessionIdParamsSchema;
/** Reads status for an active or recently completed wizard session. */
const WizardStatusParamsSchema = WizardSessionIdParamsSchema;
/** Selectable value shown in a choice-based wizard step. */
const WizardStepOptionSchema = closedObject({
	value: Type.Unknown(),
	label: NonEmptyString,
	hint: Type.Optional(Type.String())
});
const WizardDeviceCodeSchema = closedObject({
	code: NonEmptyString,
	expiresInMinutes: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 1440
	})),
	message: Type.Optional(Type.String())
});
/** UI contract for one wizard step rendered by gateway clients. */
const WizardStepSchema = closedObject({
	id: NonEmptyString,
	type: Type.Union([
		Type.Literal("note"),
		Type.Literal("select"),
		Type.Literal("text"),
		Type.Literal("confirm"),
		Type.Literal("multiselect"),
		Type.Literal("progress"),
		Type.Literal("action")
	]),
	title: Type.Optional(Type.String()),
	message: Type.Optional(Type.String()),
	format: Type.Optional(Type.Union([Type.Literal("plain")])),
	options: Type.Optional(Type.Array(WizardStepOptionSchema)),
	initialValue: Type.Optional(Type.Unknown()),
	placeholder: Type.Optional(Type.String()),
	sensitive: Type.Optional(Type.Boolean()),
	executor: Type.Optional(Type.Union([Type.Literal("gateway"), Type.Literal("client")])),
	externalUrl: Type.Optional(Type.String()),
	deviceCode: Type.Optional(WizardDeviceCodeSchema)
});
/** Channel/account pair the channels flow actually configured. */
const WizardConfiguredAccountSchema = closedObject({
	channel: NonEmptyString,
	accountId: NonEmptyString
});
/** Common response fields for start and next calls. */
const WizardResultFields = {
	done: Type.Boolean(),
	step: Type.Optional(WizardStepSchema),
	status: Type.Optional(WizardRunStatusSchema),
	error: Type.Optional(Type.String()),
	channels: Type.Optional(Type.Array(NonEmptyString)),
	accounts: Type.Optional(Type.Array(WizardConfiguredAccountSchema)),
	preparedModelRef: Type.Optional(NonEmptyString)
};
/** Result after advancing a wizard session. */
const WizardNextResultSchema = closedObject(WizardResultFields);
/** Result returned when a wizard session is created. */
const WizardStartResultSchema = closedObject({
	sessionId: NonEmptyString,
	...WizardResultFields
});
/** Minimal status poll result used when the client does not need the next step. */
const WizardStatusResultSchema = closedObject({
	status: WizardRunStatusSchema,
	error: Type.Optional(Type.String())
});
//#endregion
//#region packages/gateway-protocol/src/schema/openclaw.ts
const SystemAgentWizardCancelSchema = closedObject({ 
/** The visible step this action belongs to; stale controls must not affect a newer step. */
stepId: NonEmptyString });
/**
* OpenClaw chat lets clients (macOS app onboarding, future UIs) hold the
* setup/repair conversation over the gateway. The gateway live-tests the
* configured inference route before creating a session. Omitting `message`
* returns the welcome/greeting for a verified fresh session without input.
*/
const SystemAgentChatParamsSchema = closedObject({
	sessionId: NonEmptyString,
	/** Free-text input for conversational and text-only clients. */
	message: Type.Optional(Type.String()),
	/** Typed answer from a client rendering the current `WizardStep`. */
	wizardAnswer: Type.Optional(WizardAnswerSchema),
	/** Direct client control for cancelling the currently rendered hosted wizard. */
	wizardCancel: Type.Optional(SystemAgentWizardCancelSchema),
	/** Seeds a purpose-specific first greeting for a fresh conversation. */
	welcomeVariant: Type.Optional(Type.Union([Type.Literal("onboarding"), Type.Literal("new-agent")])),
	/** Drop any in-flight approval/wizard state and start the session over. */
	reset: Type.Optional(Type.Boolean()),
	/** Ephemeral Control UI location hint for interpreting the current user turn. */
	context: Type.Optional(closedObject({ page: Type.String({
		minLength: 1,
		maxLength: 64,
		pattern: "^[A-Za-z0-9/_-]{1,64}$"
	}) })),
	/** Host-only regular-agent delegation context. Never model-authored. */
	delegation: Type.Optional(closedObject({
		agentId: Type.Optional(NonEmptyString),
		sessionKey: Type.Optional(NonEmptyString),
		turnSourceChannel: Type.Optional(NonEmptyString),
		turnSourceTo: Type.Optional(NonEmptyString),
		turnSourceAccountId: Type.Optional(NonEmptyString),
		turnSourceThreadId: Type.Optional(Type.Union([Type.String(), Type.Number()]))
	}))
});
/**
* Structured choice attached to a chat reply. Card-capable clients render the
* options and send back `reply` (default: `label`) as the next message; text
* clients ignore this and use the reply prose, which always stands alone.
*/
const SystemAgentChatQuestionSchema = closedObject({
	id: NonEmptyString,
	header: NonEmptyString,
	question: NonEmptyString,
	options: Type.Array(closedObject({
		label: NonEmptyString,
		description: Type.Optional(Type.String()),
		recommended: Type.Optional(Type.Boolean()),
		/** Message text a client sends when this option is chosen; defaults to label. */
		reply: Type.Optional(NonEmptyString)
	}), {
		minItems: 2,
		maxItems: 4
	}),
	/** Free-text answers are also accepted for this question. */
	isOther: Type.Optional(Type.Boolean()),
	/** Client-owned action for the visible skip control; omitted means send a reply. */
	skipAction: Type.Optional(Type.Literal("exit"))
});
/** One OpenClaw reply; `action` tells clients about conversation handoffs. */
const SystemAgentChatResultSchema = closedObject({
	sessionId: NonEmptyString,
	reply: NonEmptyString,
	/** The next reply is a hosted-wizard secret and clients must mask its input/echo. */
	sensitive: Type.Optional(Type.Boolean()),
	/** The hosted wizard will consume the next message as its current step answer. */
	wizardInputPending: Type.Optional(Type.Boolean()),
	action: Type.Union([
		Type.Literal("none"),
		Type.Literal("open-agent"),
		Type.Literal("exit")
	]),
	/** Optional localized-draft intent for an `open-agent` handoff. */
	agentDraft: Type.Optional(Type.Literal("hatch")),
	/** Destination agent for a specific `open-agent` handoff. */
	agentId: Type.Optional(NonEmptyString),
	needsApproval: Type.Optional(Type.Boolean()),
	proposalId: Type.Optional(NonEmptyString),
	question: Type.Optional(SystemAgentChatQuestionSchema),
	/**
	* The awaited wizard step in full. `question` above is a lossy card projection
	* of the same step, so control-capable clients render this instead.
	*/
	step: Type.Optional(WizardStepSchema)
});
const SystemAgentChatHistoryParamsSchema = closedObject({ limit: Type.Optional(Type.Integer({
	minimum: 1,
	maximum: 500,
	default: 100
})) });
const SystemAgentChatHistoryTurnSchema = closedObject({
	role: Type.Union([Type.Literal("user"), Type.Literal("assistant")]),
	text: Type.String(),
	at: Type.Number()
});
const SystemAgentChatHistoryResultSchema = closedObject({ turns: Type.Array(SystemAgentChatHistoryTurnSchema) });
const SystemChangeKindSchema = Type.Union([
	Type.Literal("operation"),
	Type.Literal("config-write"),
	Type.Literal("external-edit")
]);
const SystemChangeSourceSchema = Type.Union([
	Type.Literal("system-agent"),
	Type.Literal("doctor"),
	Type.Literal("config-rpc"),
	Type.Literal("cli"),
	Type.Literal("plugin-install"),
	Type.Literal("external"),
	Type.Literal("unknown")
]);
const SystemChangeEntrySchema = closedObject({
	id: NonEmptyString,
	at: Type.Number(),
	kind: SystemChangeKindSchema,
	source: SystemChangeSourceSchema,
	summary: Type.String(),
	changedPaths: Type.Optional(Type.Array(Type.String())),
	invalid: Type.Optional(Type.Boolean()),
	opaqueChange: Type.Optional(Type.Boolean())
});
const SystemChangesListParamsSchema = closedObject({
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 200,
		default: 50
	})),
	beforeCursor: Type.Optional(NonEmptyString)
});
const SystemChangesListResultSchema = closedObject({
	entries: Type.Array(SystemChangeEntrySchema),
	nextCursor: Type.Optional(NonEmptyString)
});
/**
* Structured first-run inference setup for GUI clients: detect reusable AI
* access (CLI logins, env keys, existing config), then activate one choice.
* Activation live-tests the candidate and persists it only on success, so a
* client can walk the ladder candidate-by-candidate without ever leaving a
* broken default model behind.
*/
const SystemAgentSetupDetectParamsSchema = closedObject({ 
/** Agent whose model, credentials, and workspace are being inspected. */
agentId: Type.Optional(NonEmptyString) });
const ProviderAutoSetupInferenceKind = Type.TemplateLiteral("provider-auto:${string}", { pattern: "^provider-auto:.+$" });
const SetupInferenceHttpsUrl = Type.String({
	minLength: 1,
	maxLength: 2048,
	pattern: "^https://"
});
const SetupInferenceKind = Type.Union([
	Type.Literal("existing-model"),
	Type.Literal("openai-api-key"),
	Type.Literal("anthropic-api-key"),
	Type.Literal("claude-cli"),
	Type.Literal("codex-cli"),
	Type.Literal("gemini-cli"),
	ProviderAutoSetupInferenceKind
]);
const SetupInferenceStatus = Type.Union([
	Type.Literal("ok"),
	Type.Literal("auth"),
	Type.Literal("rate_limit"),
	Type.Literal("billing"),
	Type.Literal("timeout"),
	Type.Literal("format"),
	Type.Literal("unavailable"),
	Type.Literal("unknown")
]);
const SetupInferenceFailureStatus = Type.Union([
	Type.Literal("auth"),
	Type.Literal("rate_limit"),
	Type.Literal("billing"),
	Type.Literal("timeout"),
	Type.Literal("format"),
	Type.Literal("unavailable"),
	Type.Literal("unknown")
]);
const SystemAgentSetupDetectResultSchema = closedObject({
	candidates: Type.Array(closedObject({
		kind: SetupInferenceKind,
		/** Canonical provider identity for clients with bundled brand artwork. */
		brandId: Type.Optional(NonEmptyString),
		label: NonEmptyString,
		detail: Type.String(),
		modelRef: NonEmptyString,
		recommended: Type.Boolean(),
		/** true: verified; false: definitively logged out; absent: unknown. */
		credentials: Type.Optional(Type.Boolean()),
		icon: Type.Optional(SetupInferenceHttpsUrl),
		website: Type.Optional(SetupInferenceHttpsUrl)
	})),
	unavailableCandidates: Type.Optional(Type.Array(closedObject({
		id: NonEmptyString,
		/** Canonical provider identity for clients with bundled brand artwork. */
		brandId: Type.Optional(NonEmptyString),
		label: NonEmptyString,
		detail: Type.String(),
		reason: NonEmptyString,
		authOptionId: Type.Optional(NonEmptyString),
		manualProviderId: Type.Optional(NonEmptyString),
		icon: Type.Optional(SetupInferenceHttpsUrl),
		website: Type.Optional(SetupInferenceHttpsUrl)
	}))),
	/** Text-inference key/token methods exposed by the Gateway provider registry. */
	manualProviders: Type.Array(closedObject({
		/** Opaque provider-auth choice sent back during activation. */
		id: NonEmptyString,
		/** Canonical provider identity for clients with bundled brand artwork. */
		brandId: Type.Optional(NonEmptyString),
		/** Provider family shown above the specific credential method. */
		groupLabel: Type.Optional(NonEmptyString),
		label: NonEmptyString,
		hint: Type.Optional(Type.String()),
		icon: Type.Optional(SetupInferenceHttpsUrl),
		website: Type.Optional(SetupInferenceHttpsUrl)
	})),
	/** Provider-owned browser and device-code login methods. */
	authOptions: Type.Optional(Type.Array(closedObject({
		id: NonEmptyString,
		/** Canonical provider identity for clients with bundled brand artwork. */
		brandId: Type.Optional(NonEmptyString),
		label: NonEmptyString,
		hint: Type.Optional(Type.String()),
		groupLabel: Type.Optional(Type.String()),
		icon: Type.Optional(SetupInferenceHttpsUrl),
		website: Type.Optional(SetupInferenceHttpsUrl),
		kind: Type.Union([Type.Literal("oauth"), Type.Literal("device-code")]),
		featured: Type.Boolean()
	}))),
	/** Provider-owned app-guided local model setup methods. */
	prepareOptions: Type.Optional(Type.Array(closedObject({
		id: NonEmptyString,
		/** Canonical provider identity for clients with bundled brand artwork. */
		brandId: Type.Optional(NonEmptyString),
		label: NonEmptyString,
		hint: Type.Optional(Type.String()),
		actionLabel: Type.Optional(NonEmptyString),
		icon: Type.Optional(SetupInferenceHttpsUrl),
		website: Type.Optional(SetupInferenceHttpsUrl)
	}))),
	recommendedInstalls: Type.Optional(Type.Array(closedObject({
		id: NonEmptyString,
		/** Canonical provider or tool identity for bundled client artwork. */
		brandId: Type.Optional(NonEmptyString),
		label: NonEmptyString,
		hint: NonEmptyString,
		website: SetupInferenceHttpsUrl,
		icon: SetupInferenceHttpsUrl
	}))),
	workspace: NonEmptyString,
	codexAppServerDetected: Type.Optional(Type.Boolean()),
	configuredModel: Type.Optional(Type.String()),
	setupComplete: Type.Boolean()
});
/** Live verification of the Gateway's current default-agent inference route. */
const SystemAgentSetupVerifyParamsSchema = closedObject({ 
/** Agent whose configured inference route is being verified. */
agentId: Type.Optional(NonEmptyString) });
const SystemAgentSetupVerifyResultSchema = Type.Union([closedObject({
	ok: Type.Literal(true),
	modelRef: NonEmptyString,
	latencyMs: Type.Number()
}), closedObject({
	ok: Type.Literal(false),
	status: SetupInferenceFailureStatus,
	error: NonEmptyString
})]);
const SystemAgentSetupActivateParamsSchema = closedObject({
	/** Agent that owns the verified and persisted inference route. */
	agentId: Type.Optional(NonEmptyString),
	kind: Type.Union([
		Type.Literal("existing-model"),
		Type.Literal("openai-api-key"),
		Type.Literal("anthropic-api-key"),
		Type.Literal("claude-cli"),
		Type.Literal("codex-cli"),
		Type.Literal("gemini-cli"),
		ProviderAutoSetupInferenceKind,
		Type.Literal("api-key")
	]),
	/** Exact detected model for this route; prevents detect/activate drift. */
	modelRef: Type.Optional(NonEmptyString),
	/** Manual step only: opaque provider-auth choice returned by detection. */
	authChoice: Type.Optional(Type.String()),
	/** Manual step only: the pasted API key or token; masked by clients, never echoed. */
	apiKey: Type.Optional(Type.String()),
	workspace: Type.Optional(Type.String())
});
const SystemAgentSetupActivateResultSchema = closedObject({
	ok: Type.Boolean(),
	/** Present on success: the model ref that answered the live test. */
	modelRef: Type.Optional(Type.String()),
	latencyMs: Type.Optional(Type.Number()),
	/** Human-readable setup summary lines (workspace, model, gateway). */
	lines: Type.Optional(Type.Array(Type.String())),
	/** Present on failure: coarse bucket for client copy + docs links. */
	status: Type.Optional(SetupInferenceStatus),
	error: Type.Optional(Type.String())
});
/** Starts one provider-owned interactive login as a gateway wizard session. */
const SystemAgentSetupAuthStartParamsSchema = closedObject({
	/** Client-generated so cancellation remains possible if the start reply is lost. */
	sessionId: NonEmptyString,
	/** Agent that owns credentials and model selection created by this setup flow. */
	agentId: Type.Optional(NonEmptyString),
	authChoice: NonEmptyString,
	workspace: Type.Optional(Type.String())
});
const SystemAgentSetupAuthStartResultSchema = WizardStartResultSchema;
//#endregion
//#region packages/gateway-protocol/src/schema/cron.ts
const MAX_DATE_TIMESTAMP_MS = 864e13;
const CronDateTimestampMsSchema = Type.Integer({
	minimum: 0,
	maximum: MAX_DATE_TIMESTAMP_MS
});
/**
* Cron scheduler protocol schemas.
*
* These contracts describe scheduled agent turns, system events, delivery
* routing, run history, and mutable job state shared by gateway RPC clients.
*/
/** Builds create/patch payload variants while preserving per-call field optionality. */
function cronAgentTurnPayloadSchema(params) {
	return closedObject({
		kind: Type.Literal("agentTurn"),
		message: params.message,
		model: Type.Optional(params.model),
		fallbacks: Type.Optional(params.fallbacks),
		thinking: Type.Optional(params.thinking),
		timeoutSeconds: Type.Optional(Type.Number({ minimum: 0 })),
		allowUnsafeExternalContent: Type.Optional(Type.Boolean()),
		lightContext: Type.Optional(Type.Boolean()),
		toolsAllow: Type.Optional(params.toolsAllow),
		toolsAllowIsDefault: Type.Optional(Type.Boolean())
	});
}
/** Builds command payload variants while preserving create/patch argv optionality. */
function cronCommandPayloadSchema(params) {
	return closedObject({
		kind: Type.Literal("command"),
		argv: params.argv,
		cwd: Type.Optional(Type.String({ minLength: 1 })),
		env: Type.Optional(Type.Record(Type.String({ minLength: 1 }), Type.String())),
		input: Type.Optional(Type.String()),
		timeoutSeconds: Type.Optional(Type.Number({ minimum: 0 })),
		noOutputTimeoutSeconds: Type.Optional(Type.Number({ minimum: 0 })),
		outputMaxBytes: Type.Optional(Type.Integer({ minimum: 1 })),
		toolsAllow: Type.Optional(params.toolsAllow),
		toolsAllowIsDefault: Type.Optional(Type.Boolean())
	});
}
function cronScriptPayloadSchema(params) {
	return closedObject({
		kind: Type.Literal("script"),
		script: params.script,
		timeoutSeconds: Type.Optional(Type.Number({ minimum: 1 })),
		toolBudget: Type.Optional(Type.Integer({ minimum: 1 })),
		toolsAllow: Type.Optional(params.toolsAllow),
		toolsAllowIsDefault: Type.Optional(Type.Boolean())
	});
}
/** Session target accepted by cron jobs. */
const CronSessionTargetSchema = Type.Union([
	Type.Literal("main"),
	Type.Literal("isolated"),
	Type.Literal("current"),
	Type.String({ pattern: "^session:.+" })
]);
/** Whether a cron job waits for heartbeat processing or wakes immediately. */
const CronWakeModeSchema = Type.Union([Type.Literal("next-heartbeat"), Type.Literal("now")]);
/** Run status factory reused for the active field and deprecated alias metadata. */
function cronRunStatusSchema(options = {}) {
	return Type.Union([
		Type.Literal("ok"),
		Type.Literal("error"),
		Type.Literal("skipped")
	], options);
}
const CronRunStatusSchema = cronRunStatusSchema();
const CronConfigRevisionSchema = Type.String({
	minLength: 1,
	maxLength: 128
});
const DeprecatedCronRunStatusSchema = cronRunStatusSchema({
	deprecated: true,
	description: "Deprecated alias for lastRunStatus."
});
const CronSortDirSchema = Type.Union([Type.Literal("asc"), Type.Literal("desc")]);
const CronJobsEnabledFilterSchema = Type.Union([
	Type.Literal("all"),
	Type.Literal("enabled"),
	Type.Literal("disabled")
]);
const CronJobsScheduleKindFilterSchema = Type.Union([
	Type.Literal("all"),
	Type.Literal("at"),
	Type.Literal("every"),
	Type.Literal("cron"),
	Type.Literal("on-exit"),
	Type.Literal("stream")
]);
const CronJobsLastRunStatusFilterSchema = Type.Union([
	Type.Literal("all"),
	Type.Literal("ok"),
	Type.Literal("error"),
	Type.Literal("skipped"),
	Type.Literal("unknown")
]);
const CronJobsSortBySchema = Type.Union([
	Type.Literal("nextRunAtMs"),
	Type.Literal("updatedAtMs"),
	Type.Literal("name")
]);
const CronRunsStatusFilterSchema = Type.Union([
	Type.Literal("all"),
	Type.Literal("ok"),
	Type.Literal("error"),
	Type.Literal("skipped")
]);
const CronRunsStatusValueSchema = Type.Union([
	Type.Literal("ok"),
	Type.Literal("error"),
	Type.Literal("skipped")
]);
const CronDeliveryStatusSchema = Type.Union([
	Type.Literal("delivered"),
	Type.Literal("not-delivered"),
	Type.Literal("unknown"),
	Type.Literal("not-requested")
]);
const NonBlankString = Type.String({
	minLength: 1,
	pattern: "\\S"
});
const CronDeclarationKeySchema = Type.String({
	minLength: 1,
	maxLength: 200,
	pattern: "\\S"
});
const CronDisplayNameSchema = Type.String({
	minLength: 1,
	maxLength: 200,
	pattern: "\\S"
});
const CronOwnerSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(NonEmptyString),
	accountId: Type.Optional(NonEmptyString)
});
const CronScheduledToolPolicySchema = Type.Union([closedObject({
	version: Type.Literal(1),
	mode: Type.Literal("trusted")
}), closedObject({
	version: Type.Literal(1),
	mode: Type.Literal("account"),
	ownerSessionKey: NonEmptyString,
	ownerAccountId: NonEmptyString
})]);
const CronAnnounceChannelSchema = Type.Union([Type.Literal("last"), NonBlankString]);
const CronRunDiagnosticSeveritySchema = Type.Union([
	Type.Literal("info"),
	Type.Literal("warn"),
	Type.Literal("error")
]);
const CronRunDiagnosticSourceSchema = Type.Union([
	Type.Literal("cron-preflight"),
	Type.Literal("cron-setup"),
	Type.Literal("model-preflight"),
	Type.Literal("agent-run"),
	Type.Literal("tool"),
	Type.Literal("exec"),
	Type.Literal("delivery")
]);
const CronRunDiagnosticSchema = closedObject({
	ts: Type.Integer({ minimum: 0 }),
	source: CronRunDiagnosticSourceSchema,
	severity: CronRunDiagnosticSeveritySchema,
	message: Type.String(),
	toolName: Type.Optional(Type.String()),
	exitCode: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
	truncated: Type.Optional(Type.Boolean())
});
const CronRunDiagnosticsSchema = closedObject({
	summary: Type.Optional(Type.String()),
	entries: Type.Array(CronRunDiagnosticSchema)
});
const CronCommonOptionalFields = {
	agentId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	sessionKey: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	description: Type.Optional(Type.String()),
	enabled: Type.Optional(Type.Boolean()),
	deleteAfterRun: Type.Optional(Type.Boolean())
};
function cronIdOrJobIdParams(extraFields) {
	return Type.Union([closedObject({
		id: NonEmptyString,
		...extraFields
	}), closedObject({
		jobId: NonEmptyString,
		...extraFields
	})]);
}
const CronRunLogJobIdSchema = Type.String({
	minLength: 1,
	pattern: "^[^/\\\\]+$"
});
/** Schedule expression for one-time, interval, or cron-expression jobs. */
const CronScheduleSchema = Type.Union([
	closedObject({
		kind: Type.Literal("at"),
		at: NonEmptyString
	}),
	closedObject({
		kind: Type.Literal("every"),
		everyMs: Type.Integer({
			minimum: 1,
			maximum: MAX_DATE_TIMESTAMP_MS
		}),
		anchorMs: Type.Optional(Type.Integer({
			minimum: 0,
			maximum: MAX_DATE_TIMESTAMP_MS
		}))
	}),
	closedObject({
		kind: Type.Literal("cron"),
		expr: NonEmptyString,
		tz: Type.Optional(Type.String()),
		staggerMs: Type.Optional(Type.Integer({
			minimum: 0,
			maximum: MAX_DATE_TIMESTAMP_MS
		}))
	}),
	closedObject({
		kind: Type.Literal("on-exit"),
		command: NonEmptyString,
		cwd: Type.Optional(NonEmptyString)
	}),
	closedObject({
		kind: Type.Literal("stream"),
		command: Type.Array(NonEmptyString, { minItems: 1 }),
		cwd: Type.Optional(NonEmptyString),
		mode: Type.Optional(Type.Union([Type.Literal("line"), Type.Literal("match")])),
		match: Type.Optional(Type.String()),
		batchMs: Type.Optional(Type.Integer({ description: "Quiet-window milliseconds; clamped to 50-5000" })),
		maxBatchBytes: Type.Optional(Type.Integer({ description: "UTF-8 batch byte cap; clamped to 1024-65536" }))
	})
]);
/** Headless condition script evaluated before a recurring cron payload runs. */
const CronTriggerSchema = closedObject({
	script: Type.String({
		minLength: 1,
		maxLength: 65536
	}),
	once: Type.Optional(Type.Boolean())
});
/** Optional dynamic-cadence bounds stored with a cron job. */
const CronPacingSchema = Type.Object({
	min: Type.Optional(NonBlankString),
	max: Type.Optional(NonBlankString)
}, {
	additionalProperties: false,
	description: "Dynamic-cadence bounds; at least one of min or max is required"
});
/** Full cron payload for new jobs. */
const CronPayloadSchema = Type.Union([
	closedObject({
		kind: Type.Literal("systemEvent"),
		text: NonEmptyString,
		toolsAllow: Type.Optional(Type.Array(Type.String())),
		toolsAllowIsDefault: Type.Optional(Type.Boolean())
	}),
	cronAgentTurnPayloadSchema({
		message: NonEmptyString,
		model: Type.String(),
		fallbacks: Type.Array(Type.String()),
		toolsAllow: Type.Array(Type.String()),
		thinking: Type.String()
	}),
	cronCommandPayloadSchema({
		argv: Type.Array(NonEmptyString, { minItems: 1 }),
		toolsAllow: Type.Array(Type.String())
	}),
	cronScriptPayloadSchema({
		script: Type.String({
			minLength: 1,
			maxLength: 65536
		}),
		toolsAllow: Type.Array(Type.String())
	})
]);
/**
* Reported payloads add the system-owned heartbeat monitor kind; it is
* gateway-converged only, so create/patch schemas intentionally omit it.
*/
const CronReportedPayloadSchema = Type.Union([...CronPayloadSchema.anyOf, closedObject({ kind: Type.Literal("heartbeat") })]);
/** Partial cron payload for job updates. */
const CronPayloadPatchSchema = Type.Union([
	closedObject({
		kind: Type.Literal("systemEvent"),
		text: Type.Optional(NonEmptyString),
		toolsAllow: Type.Optional(Type.Union([Type.Array(Type.String()), Type.Null()])),
		toolsAllowIsDefault: Type.Optional(Type.Boolean())
	}),
	cronAgentTurnPayloadSchema({
		message: Type.Optional(NonEmptyString),
		model: Type.Union([Type.String(), Type.Null()]),
		fallbacks: Type.Union([Type.Array(Type.String()), Type.Null()]),
		toolsAllow: Type.Union([Type.Array(Type.String()), Type.Null()]),
		thinking: Type.Union([Type.String(), Type.Null()])
	}),
	cronCommandPayloadSchema({
		argv: Type.Optional(Type.Array(NonEmptyString, { minItems: 1 })),
		toolsAllow: Type.Union([Type.Array(Type.String()), Type.Null()])
	}),
	cronScriptPayloadSchema({
		script: Type.Optional(Type.String({
			minLength: 1,
			maxLength: 65536
		})),
		toolsAllow: Type.Union([Type.Array(Type.String()), Type.Null()])
	})
]);
/** Failure alert policy for repeated cron run failures. */
const CronFailureAlertSchema = closedObject({
	after: Type.Optional(Type.Integer({ minimum: 1 })),
	channel: Type.Optional(CronAnnounceChannelSchema),
	to: Type.Optional(NonBlankString),
	cooldownMs: Type.Optional(Type.Integer({ minimum: 0 })),
	includeSkipped: Type.Optional(Type.Boolean()),
	mode: Type.Optional(Type.Union([Type.Literal("announce"), Type.Literal("webhook")])),
	accountId: Type.Optional(NonEmptyString)
});
const CronFailureAlertPatchSchema = closedObject({
	after: Type.Optional(Type.Union([Type.Integer({ minimum: 1 }), Type.Null()])),
	channel: Type.Optional(Type.Union([CronAnnounceChannelSchema, Type.Null()])),
	to: Type.Optional(Type.Union([NonBlankString, Type.Null()])),
	cooldownMs: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
	includeSkipped: Type.Optional(Type.Union([Type.Boolean(), Type.Null()])),
	mode: Type.Optional(Type.Union([
		Type.Literal("announce"),
		Type.Literal("webhook"),
		Type.Null()
	])),
	accountId: Type.Optional(Type.Union([NonEmptyString, Type.Null()]))
});
/** Delivery destination used when failure alerts need a separate target. */
const CronFailureDestinationSchema = closedObject({
	channel: Type.Optional(CronAnnounceChannelSchema),
	to: Type.Optional(NonBlankString),
	accountId: Type.Optional(NonEmptyString),
	mode: Type.Optional(Type.Union([Type.Literal("announce"), Type.Literal("webhook")]))
});
const CronFailureDestinationPatchSchema = closedObject({
	channel: Type.Optional(Type.Union([CronAnnounceChannelSchema, Type.Null()])),
	to: Type.Optional(Type.Union([NonBlankString, Type.Null()])),
	accountId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	mode: Type.Optional(Type.Union([
		Type.Literal("announce"),
		Type.Literal("webhook"),
		Type.Null()
	]))
});
const CronCompletionDestinationSchema = closedObject({
	mode: Type.Literal("webhook"),
	to: NonBlankString
});
const CronDeliverySharedProperties = {
	channel: Type.Optional(CronAnnounceChannelSchema),
	threadId: Type.Optional(Type.Union([Type.String(), Type.Number()])),
	accountId: Type.Optional(NonEmptyString),
	bestEffort: Type.Optional(Type.Boolean()),
	failureDestination: Type.Optional(CronFailureDestinationSchema)
};
const CronDeliveryPatchSharedProperties = {
	channel: Type.Optional(Type.Union([CronAnnounceChannelSchema, Type.Null()])),
	threadId: Type.Optional(Type.Union([
		Type.String(),
		Type.Number(),
		Type.Null()
	])),
	accountId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	bestEffort: Type.Optional(Type.Boolean()),
	failureDestination: Type.Optional(Type.Union([CronFailureDestinationPatchSchema, Type.Null()]))
};
const CronDeliveryNoopSchema = closedObject({
	mode: Type.Literal("none"),
	...CronDeliverySharedProperties,
	to: Type.Optional(NonBlankString)
});
const CronDeliveryAnnounceSchema = closedObject({
	mode: Type.Literal("announce"),
	...CronDeliverySharedProperties,
	completionDestination: Type.Optional(CronCompletionDestinationSchema),
	to: Type.Optional(NonBlankString)
});
const CronDeliveryWebhookSchema = closedObject({
	mode: Type.Literal("webhook"),
	...CronDeliverySharedProperties,
	to: NonBlankString
});
/** Delivery policy for cron run output. */
const CronDeliverySchema = Type.Union([
	CronDeliveryNoopSchema,
	CronDeliveryAnnounceSchema,
	CronDeliveryWebhookSchema
]);
/** Patch shape for cron delivery policy updates. */
const CronDeliveryPatchSchema = closedObject({
	mode: Type.Optional(Type.Union([
		Type.Literal("none"),
		Type.Literal("announce"),
		Type.Literal("webhook")
	])),
	...CronDeliveryPatchSharedProperties,
	completionDestination: Type.Optional(Type.Union([CronCompletionDestinationSchema, Type.Null()])),
	to: Type.Optional(Type.Union([NonBlankString, Type.Null()]))
});
const CronFailureNotificationDeliverySchema = closedObject({
	delivered: Type.Optional(Type.Boolean()),
	status: CronDeliveryStatusSchema,
	error: Type.Optional(Type.String())
});
const CronAutoDisabledSchema = closedObject({
	reason: Type.Union([Type.Literal("consecutive-failures"), Type.Literal("schedule-errors")]),
	atMs: CronDateTimestampMsSchema,
	consecutiveErrors: Type.Integer({ minimum: 1 })
});
/** Scheduler-maintained state for the latest run/delivery outcome. */
const CronJobStateSchema = closedObject({
	nextRunAtMs: Type.Optional(CronDateTimestampMsSchema),
	scheduleActivatedAtMs: Type.Optional(CronDateTimestampMsSchema),
	runningAtMs: Type.Optional(CronDateTimestampMsSchema),
	lastRunAtMs: Type.Optional(CronDateTimestampMsSchema),
	lastRunStatus: Type.Optional(CronRunStatusSchema),
	lastStatus: Type.Optional(DeprecatedCronRunStatusSchema),
	lastError: Type.Optional(Type.String()),
	lastDiagnostics: Type.Optional(CronRunDiagnosticsSchema),
	lastDiagnosticSummary: Type.Optional(Type.String()),
	lastErrorReason: Type.Optional(FailoverReasonSchema),
	lastDurationMs: Type.Optional(Type.Integer({ minimum: 0 })),
	consecutiveErrors: Type.Optional(Type.Integer({ minimum: 0 })),
	autoDisabled: Type.Optional(CronAutoDisabledSchema),
	consecutiveSkipped: Type.Optional(Type.Integer({ minimum: 0 })),
	lastDelivered: Type.Optional(Type.Boolean()),
	lastDeliveryStatus: Type.Optional(CronDeliveryStatusSchema),
	lastDeliveryError: Type.Optional(Type.String()),
	lastFailureNotificationDelivered: Type.Optional(Type.Boolean()),
	lastFailureNotificationDeliveryStatus: Type.Optional(CronDeliveryStatusSchema),
	lastFailureNotificationDeliveryError: Type.Optional(Type.String()),
	lastFailureAlertAtMs: Type.Optional(CronDateTimestampMsSchema),
	lastTriggerEvalAtMs: Type.Optional(CronDateTimestampMsSchema),
	triggerEvalCount: Type.Optional(Type.Integer({ minimum: 0 })),
	lastTriggerFireAtMs: Type.Optional(CronDateTimestampMsSchema),
	triggerState: Type.Optional(Type.Unknown()),
	streamStatus: Type.Optional(Type.Union([
		Type.Literal("starting"),
		Type.Literal("running"),
		Type.Literal("restarting"),
		Type.Literal("stopped"),
		Type.Literal("disabled"),
		Type.Literal("error")
	])),
	streamError: Type.Optional(Type.String()),
	streamConsecutiveFailures: Type.Optional(Type.Integer({ minimum: 0 })),
	streamRestartExhausted: Type.Optional(Type.Boolean()),
	streamSourceIdentity: Type.Optional(Type.String()),
	streamDroppedBatches: Type.Optional(Type.Integer({ minimum: 0 })),
	streamCoalescedBatches: Type.Optional(Type.Integer({ minimum: 0 })),
	streamLastStartedAtMs: Type.Optional(CronDateTimestampMsSchema),
	streamLastExitAtMs: Type.Optional(CronDateTimestampMsSchema)
});
const CronJobStatePatchSchema = closedObject({
	nextRunAtMs: Type.Optional(CronDateTimestampMsSchema),
	runningAtMs: Type.Optional(CronDateTimestampMsSchema),
	lastRunAtMs: Type.Optional(CronDateTimestampMsSchema),
	lastRunStatus: Type.Optional(CronRunStatusSchema),
	lastStatus: Type.Optional(DeprecatedCronRunStatusSchema),
	lastError: Type.Optional(Type.String()),
	lastErrorReason: Type.Optional(FailoverReasonSchema),
	lastDurationMs: Type.Optional(Type.Integer({ minimum: 0 })),
	consecutiveErrors: Type.Optional(Type.Integer({ minimum: 0 })),
	consecutiveSkipped: Type.Optional(Type.Integer({ minimum: 0 })),
	lastDelivered: Type.Optional(Type.Boolean()),
	lastDeliveryStatus: Type.Optional(CronDeliveryStatusSchema),
	lastDeliveryError: Type.Optional(Type.String()),
	lastFailureNotificationDelivered: Type.Optional(Type.Boolean()),
	lastFailureNotificationDeliveryStatus: Type.Optional(CronDeliveryStatusSchema),
	lastFailureNotificationDeliveryError: Type.Optional(Type.String()),
	lastFailureAlertAtMs: Type.Optional(CronDateTimestampMsSchema),
	lastTriggerEvalAtMs: Type.Optional(CronDateTimestampMsSchema),
	triggerEvalCount: Type.Optional(Type.Integer({ minimum: 0 })),
	lastTriggerFireAtMs: Type.Optional(CronDateTimestampMsSchema),
	triggerState: Type.Optional(Type.Unknown()),
	streamStatus: Type.Optional(Type.Union([
		Type.Literal("starting"),
		Type.Literal("running"),
		Type.Literal("restarting"),
		Type.Literal("stopped"),
		Type.Literal("disabled"),
		Type.Literal("error")
	])),
	streamError: Type.Optional(Type.String()),
	streamConsecutiveFailures: Type.Optional(Type.Integer({ minimum: 0 })),
	streamRestartExhausted: Type.Optional(Type.Boolean()),
	streamDroppedBatches: Type.Optional(Type.Integer({ minimum: 0 })),
	streamCoalescedBatches: Type.Optional(Type.Integer({ minimum: 0 })),
	streamLastStartedAtMs: Type.Optional(CronDateTimestampMsSchema),
	streamLastExitAtMs: Type.Optional(CronDateTimestampMsSchema)
});
/** Persisted cron job definition returned by scheduler list/get APIs. */
const CronJobSchema = closedObject({
	id: NonEmptyString,
	declarationKey: Type.Optional(CronDeclarationKeySchema),
	displayName: Type.Optional(CronDisplayNameSchema),
	owner: Type.Optional(CronOwnerSchema),
	scheduledToolPolicy: Type.Optional(CronScheduledToolPolicySchema),
	agentId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(NonEmptyString),
	name: NonEmptyString,
	description: Type.Optional(Type.String()),
	enabled: Type.Boolean(),
	deleteAfterRun: Type.Optional(Type.Boolean()),
	createdAtMs: CronDateTimestampMsSchema,
	updatedAtMs: CronDateTimestampMsSchema,
	/** Opaque Gateway-computed token for the job definition, excluding scheduler state. */
	configRevision: Type.Optional(CronConfigRevisionSchema),
	schedule: CronScheduleSchema,
	pacing: Type.Optional(CronPacingSchema),
	trigger: Type.Optional(CronTriggerSchema),
	sessionTarget: CronSessionTargetSchema,
	wakeMode: CronWakeModeSchema,
	payload: CronReportedPayloadSchema,
	delivery: Type.Optional(CronDeliverySchema),
	failureAlert: Type.Optional(Type.Union([Type.Literal(false), CronFailureAlertSchema])),
	state: CronJobStateSchema,
	nextRunAtMs: Type.Optional(CronDateTimestampMsSchema),
	lastRunAtMs: Type.Optional(CronDateTimestampMsSchema),
	lastRunStatus: Type.Optional(CronRunStatusSchema),
	lastRunError: Type.Optional(Type.String()),
	lastDelivered: Type.Optional(Type.Boolean()),
	lastDeliveryStatus: Type.Optional(CronDeliveryStatusSchema),
	lastDeliveryError: Type.Optional(Type.String()),
	lastFailureNotificationDelivered: Type.Optional(Type.Boolean()),
	lastFailureNotificationDeliveryStatus: Type.Optional(CronDeliveryStatusSchema),
	lastFailureNotificationDeliveryError: Type.Optional(Type.String())
});
/** Query params for listing cron jobs with filters and pagination. */
const CronListParamsSchema = closedObject({
	includeDisabled: Type.Optional(Type.Boolean()),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 200
	})),
	offset: Type.Optional(Type.Integer({ minimum: 0 })),
	query: Type.Optional(Type.String()),
	enabled: Type.Optional(CronJobsEnabledFilterSchema),
	scheduleKind: Type.Optional(CronJobsScheduleKindFilterSchema),
	lastRunStatus: Type.Optional(CronJobsLastRunStatusFilterSchema),
	sortBy: Type.Optional(CronJobsSortBySchema),
	sortDir: Type.Optional(CronSortDirSchema),
	agentId: Type.Optional(NonEmptyString),
	compact: Type.Optional(Type.Boolean()),
	includeDeliveryPreviews: Type.Optional(Type.Boolean())
});
/** Empty request payload for scheduler status. */
const CronStatusParamsSchema = closedObject({});
/** Looks up a job by stable id or legacy jobId alias. */
const CronGetParamsSchema = cronIdOrJobIdParams({});
const CronScratchSchema = closedObject({
	content: Type.String({ maxLength: 262144 }),
	revision: Type.Integer({ minimum: 1 }),
	updatedAtMs: Type.Integer({ minimum: 0 })
});
/** Reads private per-job scratch without adding it to the public job schema. */
const CronScratchGetParamsSchema = cronIdOrJobIdParams({});
const CronScratchGetResultSchema = closedObject({
	scratch: Type.Union([CronScratchSchema, Type.Null()]),
	currentRevision: Type.Integer({ minimum: 0 }),
	maxBytes: Type.Integer({ minimum: 1 })
});
/** Compare-and-swaps or clears private per-job scratch. */
const CronScratchSetParamsSchema = cronIdOrJobIdParams({
	content: Type.Union([Type.String({ maxLength: 262144 }), Type.Null()]),
	expectedRevision: Type.Optional(Type.Integer({ minimum: 0 }))
});
const CronScratchSetResultSchema = Type.Union([closedObject({
	ok: Type.Literal(true),
	scratch: Type.Union([CronScratchSchema, Type.Null()]),
	currentRevision: Type.Integer({ minimum: 0 }),
	maxBytes: Type.Integer({ minimum: 1 })
}), closedObject({
	ok: Type.Literal(false),
	reason: Type.Literal("revision-conflict"),
	currentRevision: Type.Integer({ minimum: 0 })
})]);
/** Creates a scheduled job with schedule, target, payload, and delivery policy. */
const CronAddParamsSchema = closedObject({
	name: NonEmptyString,
	declarationKey: Type.Optional(CronDeclarationKeySchema),
	displayName: Type.Optional(CronDisplayNameSchema),
	owner: Type.Optional(CronOwnerSchema),
	...CronCommonOptionalFields,
	schedule: CronScheduleSchema,
	pacing: Type.Optional(CronPacingSchema),
	trigger: Type.Optional(CronTriggerSchema),
	sessionTarget: CronSessionTargetSchema,
	wakeMode: CronWakeModeSchema,
	payload: CronPayloadSchema,
	delivery: Type.Optional(CronDeliverySchema),
	failureAlert: Type.Optional(Type.Union([Type.Literal(false), CronFailureAlertSchema]))
});
/** Successful declaration-key convergence result. */
const CronDeclarativeAddResultSchema = closedObject({
	created: Type.Boolean(),
	updated: Type.Optional(Type.Boolean()),
	job: CronJobSchema
});
/** Successful result from imperative create or declaration-key convergence. */
const CronAddResultSchema = Type.Union([CronJobSchema, CronDeclarativeAddResultSchema]);
/** Updates a cron job by id or legacy jobId alias. */
const CronUpdateParamsSchema = cronIdOrJobIdParams({
	patch: closedObject({
		name: Type.Optional(NonEmptyString),
		displayName: Type.Optional(Type.Union([CronDisplayNameSchema, Type.Null()])),
		...CronCommonOptionalFields,
		schedule: Type.Optional(CronScheduleSchema),
		pacing: Type.Optional(Type.Union([CronPacingSchema, Type.Null()])),
		trigger: Type.Optional(Type.Union([CronTriggerSchema, Type.Null()])),
		sessionTarget: Type.Optional(CronSessionTargetSchema),
		wakeMode: Type.Optional(CronWakeModeSchema),
		payload: Type.Optional(CronPayloadPatchSchema),
		delivery: Type.Optional(CronDeliveryPatchSchema),
		failureAlert: Type.Optional(Type.Union([
			Type.Literal(false),
			CronFailureAlertPatchSchema,
			Type.Null()
		])),
		state: Type.Optional(CronJobStatePatchSchema)
	}),
	/** Rejects the patch when the current definition does not match the caller's token. */
	expectedConfigRevision: Type.Optional(CronConfigRevisionSchema)
});
/** Removes a cron job by id or legacy jobId alias. */
const CronRemoveParamsSchema = cronIdOrJobIdParams({});
/** Runs a cron job immediately or only if due. */
const CronRunParamsSchema = cronIdOrJobIdParams({
	mode: Type.Optional(Type.Union([Type.Literal("due"), Type.Literal("force")])),
	/** Rejects the mutation if the Gateway restarted after the caller's preflight. */
	expectedProcessInstanceId: Type.Optional(NonEmptyString)
});
/** Query params for cron run history. */
const CronRunsParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	scope: Type.Optional(Type.Union([Type.Literal("job"), Type.Literal("all")])),
	id: Type.Optional(CronRunLogJobIdSchema),
	jobId: Type.Optional(CronRunLogJobIdSchema),
	runId: Type.Optional(NonEmptyString),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 200
	})),
	offset: Type.Optional(Type.Integer({ minimum: 0 })),
	statuses: Type.Optional(Type.Array(CronRunsStatusValueSchema, {
		minItems: 1,
		maxItems: 3
	})),
	status: Type.Optional(CronRunsStatusFilterSchema),
	deliveryStatuses: Type.Optional(Type.Array(CronDeliveryStatusSchema, {
		minItems: 1,
		maxItems: 4
	})),
	deliveryStatus: Type.Optional(CronDeliveryStatusSchema),
	query: Type.Optional(Type.String()),
	sortDir: Type.Optional(CronSortDirSchema)
});
closedObject({
	ts: Type.Integer({ minimum: 0 }),
	jobId: NonEmptyString,
	action: Type.Literal("finished"),
	status: Type.Optional(CronRunStatusSchema),
	error: Type.Optional(Type.String()),
	errorReason: Type.Optional(FailoverReasonSchema),
	summary: Type.Optional(Type.String()),
	diagnostics: Type.Optional(CronRunDiagnosticsSchema),
	delivered: Type.Optional(Type.Boolean()),
	deliveryStatus: Type.Optional(CronDeliveryStatusSchema),
	deliveryError: Type.Optional(Type.String()),
	failureNotificationDelivery: Type.Optional(CronFailureNotificationDeliverySchema),
	sessionId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	runAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
	durationMs: Type.Optional(Type.Integer({ minimum: 0 })),
	nextRunAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
	triggerFired: Type.Optional(Type.Boolean()),
	model: Type.Optional(Type.String()),
	provider: Type.Optional(Type.String()),
	usage: Type.Optional(closedObject({
		input_tokens: Type.Optional(Type.Number()),
		output_tokens: Type.Optional(Type.Number()),
		total_tokens: Type.Optional(Type.Number()),
		cache_read_tokens: Type.Optional(Type.Number()),
		cache_write_tokens: Type.Optional(Type.Number())
	})),
	jobName: Type.Optional(Type.String())
});
//#endregion
//#region packages/gateway-protocol/src/schema/environments.ts
/**
* Environment inventory protocol schemas.
*
* Environments are runtime targets such as local hosts, VMs, or remote workers;
* this schema layer only describes their gateway-visible status summary.
*/
/** Runtime availability state for an environment target. */
const EnvironmentStatusSchema = Type.String({ enum: [
	"available",
	"unavailable",
	"starting",
	"stopping",
	"error"
] });
const EnvironmentTrustSchema = Type.String({ enum: ["persistent", "disposable"] });
/** Durable lifecycle states for plugin-provisioned worker environments. */
const WorkerEnvironmentStateSchema = Type.Union([
	Type.Literal("requested"),
	Type.Literal("provisioning"),
	Type.Literal("bootstrapping"),
	Type.Literal("ready"),
	Type.Literal("attached"),
	Type.Literal("idle"),
	Type.Literal("draining"),
	Type.Literal("destroying"),
	Type.Literal("destroyed"),
	Type.Literal("failed"),
	Type.Literal("orphaned")
]);
/** Process-local SSH tunnel connectivity for a worker environment. */
const WorkerTunnelStatusSchema = Type.Union([
	Type.Literal("stopped"),
	Type.Literal("connecting"),
	Type.Literal("connected"),
	Type.Literal("reconnecting")
]);
/** Closed app ids a worker desktop may advertise and launch. */
const WorkerDesktopAppIdSchema = Type.Union([Type.Literal("browser"), Type.Literal("terminal")]);
/** Worker-only lifecycle metadata layered onto the existing environment projection. */
const WorkerEnvironmentMetadataSchema = closedObject({
	providerId: NonEmptyString,
	leaseId: Type.Optional(NonEmptyString),
	state: WorkerEnvironmentStateSchema,
	ageMs: Type.Integer({ minimum: 0 }),
	idleMs: Type.Optional(Type.Integer({ minimum: 0 })),
	attachedSessionIds: Type.Array(NonEmptyString),
	tunnelStatus: WorkerTunnelStatusSchema,
	error: Type.Optional(NonEmptyString),
	desktop: Type.Optional(Type.Boolean()),
	desktopApps: Type.Optional(Type.Array(WorkerDesktopAppIdSchema, {
		maxItems: 8,
		uniqueItems: true
	}))
});
function createEnvironmentSummarySchema() {
	return closedObject({
		id: NonEmptyString,
		type: NonEmptyString,
		label: Type.Optional(NonEmptyString),
		status: EnvironmentStatusSchema,
		platform: Type.Optional(NonEmptyString),
		sessionHost: Type.Optional(Type.Boolean()),
		lastConnectedAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
		lastDisconnectedAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
		lastSeenAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
		lastSeenReason: Type.Optional(NonEmptyString),
		trust: Type.Optional(EnvironmentTrustSchema),
		capabilities: Type.Optional(Type.Array(NonEmptyString)),
		desktop: Type.Optional(Type.Boolean()),
		worker: Type.Optional(WorkerEnvironmentMetadataSchema)
	});
}
/** Public environment summary shown in listings and status responses. */
const EnvironmentSummarySchema = createEnvironmentSummarySchema();
/** Empty request payload for listing known environments. */
const EnvironmentsListParamsSchema = closedObject({});
/** Configured worker target exposed without provider settings or credentials. */
const WorkerEnvironmentProfileSummarySchema = closedObject({
	id: NonEmptyString,
	providerId: NonEmptyString,
	trust: Type.Optional(EnvironmentTrustSchema)
});
/** List response containing all gateway-visible environment summaries. */
const EnvironmentsListResultSchema = closedObject({
	environments: Type.Array(EnvironmentSummarySchema),
	profiles: Type.Optional(Type.Array(WorkerEnvironmentProfileSummarySchema))
});
/** Status lookup request for one environment id. */
const EnvironmentsStatusParamsSchema = closedObject({ environmentId: NonEmptyString });
/** Status lookup result for one environment id. */
const EnvironmentsStatusResultSchema = createEnvironmentSummarySchema();
/** Creates a worker environment from one configured provider profile. */
const EnvironmentsCreateParamsSchema = closedObject({
	profileId: NonEmptyString,
	idempotencyKey: NonEmptyString
});
/** Create result uses the same public summary shape as list and status. */
const EnvironmentsCreateResultSchema = createEnvironmentSummarySchema();
/** Destroys one durable worker environment by its gateway-owned id. */
const EnvironmentsDestroyParamsSchema = closedObject({
	environmentId: NonEmptyString,
	force: Type.Optional(Type.Boolean())
});
/** Destroy result exposes the terminal worker lifecycle state. */
const EnvironmentsDestroyResultSchema = createEnvironmentSummarySchema();
const WorkerDesktopObserveParamsSchema = closedObject({
	environmentId: NonEmptyString,
	control: Type.Optional(Type.Boolean())
});
const WorkerDesktopObserveResultSchema = closedObject({
	transport: Type.String({ enum: ["rfb"] }),
	wsPath: NonEmptyString,
	expiresAtMs: Type.Integer({ minimum: 0 }),
	control: Type.Boolean(),
	vncPassword: Type.Optional(NonEmptyString)
});
const WorkerDesktopLaunchParamsSchema = closedObject({
	environmentId: NonEmptyString,
	app: WorkerDesktopAppIdSchema
});
const WorkerDesktopLaunchResultSchema = closedObject({
	app: WorkerDesktopAppIdSchema,
	status: Type.Literal("ready")
});
//#endregion
//#region packages/gateway-protocol/src/schema/exec-approvals.ts
/**
* Exec approval protocol schemas.
*
* These payloads cross the security-review boundary for command execution, so
* persisted policy, request snapshots, and resolve decisions stay explicit.
*/
/** One persisted allowlist entry for a command pattern or resolved executable. */
const ExecApprovalsAllowlistEntrySchema = closedObject({
	id: Type.Optional(NonEmptyString),
	pattern: Type.String(),
	source: Type.Optional(Type.Literal("allow-always")),
	commandText: Type.Optional(Type.String()),
	argPattern: Type.Optional(Type.String()),
	lastUsedAt: Type.Optional(Type.Number({ minimum: 0 })),
	lastUsedCommand: Type.Optional(Type.String()),
	lastResolvedPath: Type.Optional(Type.String())
});
const ExecApprovalsPolicyFields = {
	security: Type.Optional(Type.String()),
	ask: Type.Optional(Type.String()),
	askFallback: Type.Optional(Type.String()),
	autoAllowSkills: Type.Optional(Type.Boolean())
};
const ExecSecuritySchema = Type.Union([
	Type.Literal("deny"),
	Type.Literal("allowlist"),
	Type.Literal("full")
]);
/** Host-resolved default policy after applying persisted defaults and runtime fallbacks. */
const ExecApprovalsResolvedDefaultsSchema = closedObject({
	security: ExecSecuritySchema,
	ask: Type.Union([
		Type.Literal("off"),
		Type.Literal("on-miss"),
		Type.Literal("always")
	]),
	askFallback: ExecSecuritySchema,
	autoAllowSkills: Type.Boolean()
});
/** Default exec approval policy shared by all agents unless overridden. */
const ExecApprovalsDefaultsSchema = closedObject(ExecApprovalsPolicyFields);
/** Agent-specific exec approval policy and allowlist. */
const ExecApprovalsAgentSchema = closedObject({
	...ExecApprovalsPolicyFields,
	allowlist: Type.Optional(Type.Array(ExecApprovalsAllowlistEntrySchema))
});
/** Versioned exec approvals config file edited through gateway APIs. */
const ExecApprovalsFileSchema = closedObject({
	version: Type.Literal(1),
	socket: Type.Optional(closedObject({
		path: Type.Optional(Type.String()),
		token: Type.Optional(Type.String())
	})),
	defaults: Type.Optional(ExecApprovalsDefaultsSchema),
	agents: Type.Optional(Type.Record(Type.String(), ExecApprovalsAgentSchema))
});
closedObject({
	path: NonEmptyString,
	exists: Type.Boolean(),
	hash: NonEmptyString,
	file: ExecApprovalsFileSchema
});
const NativeExecApprovalActionSchema = Type.Union([
	Type.Literal("allow"),
	Type.Literal("deny"),
	Type.Literal("prompt")
]);
/** One rule owned and enforced by a host-native exec policy implementation. */
const NativeExecApprovalRuleSchema = closedObject({
	pattern: NonEmptyString,
	action: NativeExecApprovalActionSchema,
	shells: Type.Optional(Type.Array(NonEmptyString)),
	description: Type.Optional(Type.String()),
	enabled: Type.Optional(Type.Boolean())
});
const NativeExecApprovalConstraintsSchema = closedObject({
	baseHashRequired: Type.Optional(Type.Boolean()),
	defaultAllowAllowed: Type.Optional(Type.Boolean()),
	broadAllowRulesAllowed: Type.Optional(Type.Boolean()),
	dangerousAllowRulesAllowed: Type.Optional(Type.Boolean())
});
/** Node read snapshot supporting file-backed and host-native approval owners. */
const ExecApprovalsNodeSnapshotSchema = Type.Object({
	path: Type.Optional(Type.String()),
	exists: Type.Optional(Type.Boolean()),
	hash: Type.Optional(Type.String()),
	file: Type.Optional(ExecApprovalsFileSchema),
	resolvedDefaults: Type.Optional(ExecApprovalsResolvedDefaultsSchema),
	enabled: Type.Optional(Type.Boolean()),
	baseHash: Type.Optional(NonEmptyString),
	defaultAction: Type.Optional(NativeExecApprovalActionSchema),
	rules: Type.Optional(Type.Array(NativeExecApprovalRuleSchema)),
	constraints: Type.Optional(NativeExecApprovalConstraintsSchema),
	message: Type.Optional(Type.String())
}, {
	additionalProperties: false,
	oneOf: [
		{
			required: [
				"path",
				"exists",
				"hash",
				"file"
			],
			not: { anyOf: [
				{ required: ["enabled"] },
				{ required: ["baseHash"] },
				{ required: ["defaultAction"] },
				{ required: ["rules"] },
				{ required: ["constraints"] },
				{ required: ["message"] }
			] }
		},
		{
			properties: {
				enabled: { const: true },
				hash: { minLength: 1 }
			},
			required: [
				"enabled",
				"hash",
				"defaultAction",
				"rules"
			],
			not: { anyOf: [
				{ required: ["path"] },
				{ required: ["exists"] },
				{ required: ["file"] },
				{ required: ["resolvedDefaults"] },
				{ required: ["message"] }
			] }
		},
		{
			properties: { enabled: { const: false } },
			required: ["enabled"],
			not: { anyOf: [
				{ required: ["path"] },
				{ required: ["exists"] },
				{ required: ["hash"] },
				{ required: ["file"] },
				{ required: ["resolvedDefaults"] },
				{ required: ["baseHash"] },
				{ required: ["defaultAction"] },
				{ required: ["rules"] },
				{ required: ["constraints"] }
			] }
		}
	]
});
/** Empty request payload for reading local exec approval policy. */
const ExecApprovalsGetParamsSchema = closedObject({});
/** Local exec approval policy write request with optional base hash guard. */
const ExecApprovalsSetParamsSchema = closedObject({
	file: ExecApprovalsFileSchema,
	baseHash: Type.Optional(NonEmptyString)
});
/** Node-scoped request payload for reading exec approval policy. */
const ExecApprovalsNodeGetParamsSchema = closedObject({ nodeId: NonEmptyString });
/** Writable host-native policy fields; the node remains the validation authority. */
const NativeExecApprovalPolicySchema = closedObject({
	defaultAction: Type.Optional(NativeExecApprovalActionSchema),
	rules: Type.Array(NativeExecApprovalRuleSchema)
});
/** Node-scoped write for exactly one file-backed or host-native approval owner. */
const ExecApprovalsNodeSetParamsSchema = Type.Object({
	nodeId: NonEmptyString,
	file: Type.Optional(ExecApprovalsFileSchema),
	native: Type.Optional(NativeExecApprovalPolicySchema),
	baseHash: Type.Optional(NonEmptyString)
}, {
	additionalProperties: false,
	oneOf: [{
		required: ["file"],
		not: { required: ["native"] }
	}, {
		required: ["native", "baseHash"],
		not: { required: ["file"] }
	}]
});
/** Lookup request for one pending exec approval by id. */
const ExecApprovalGetParamsSchema = closedObject({ id: NonEmptyString });
const ExecApprovalPolicySecuritySchema = Type.Union([
	Type.Literal("deny"),
	Type.Literal("allowlist"),
	Type.Literal("full")
]);
const ExecApprovalPolicySnapshotSchema = closedObject({
	security: ExecApprovalPolicySecuritySchema,
	ask: Type.Union([
		Type.Literal("off"),
		Type.Literal("on-miss"),
		Type.Literal("always")
	]),
	askFallback: ExecApprovalPolicySecuritySchema,
	autoAllowSkills: Type.Boolean(),
	allowlistRules: Type.Array(closedObject({
		pattern: Type.String(),
		argPattern: Type.Optional(Type.String()),
		source: Type.Optional(Type.Literal("allow-always"))
	}))
});
/** Pending command execution approval request shown to reviewers. */
const ExecApprovalRequestParamsSchema = closedObject({
	id: Type.Optional(NonEmptyString),
	command: Type.Optional(NonEmptyString),
	commandArgv: Type.Optional(Type.Array(Type.String())),
	systemRunPlan: Type.Optional(closedObject({
		argv: Type.Array(Type.String()),
		cwd: Type.Union([Type.String(), Type.Null()]),
		commandText: Type.String(),
		commandPreview: Type.Optional(Type.Union([Type.String(), Type.Null()])),
		agentId: Type.Union([Type.String(), Type.Null()]),
		sessionKey: Type.Union([Type.String(), Type.Null()]),
		policySnapshot: Type.Optional(ExecApprovalPolicySnapshotSchema),
		mutableFileOperand: Type.Optional(Type.Union([closedObject({
			argvIndex: Type.Integer({ minimum: 0 }),
			path: Type.String(),
			sha256: Type.String()
		}), Type.Null()]))
	})),
	env: Type.Optional(Type.Record(NonEmptyString, Type.String())),
	cwd: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	nodeId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	host: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	security: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	ask: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	warningText: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	unavailableDecisions: Type.Optional(Type.Array(Type.String({ enum: ["allow-always"] }), {
		minItems: 1,
		maxItems: 1
	})),
	commandSpans: Type.Optional(Type.Array(closedObject({
		startIndex: Type.Integer({
			minimum: 0,
			description: "Inclusive UTF-16 code unit offset into command."
		}),
		endIndex: Type.Integer({
			minimum: 1,
			description: "Exclusive UTF-16 code unit offset into command; must be greater than startIndex and no greater than command.length."
		})
	}))),
	agentId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	resolvedPath: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	sessionKey: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	sessionId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	runId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	toolCallId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	turnSourceChannel: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	turnSourceTo: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	turnSourceAccountId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	turnSourceThreadId: Type.Optional(Type.Union([
		Type.String(),
		Type.Number(),
		Type.Null()
	])),
	approvalReviewerDeviceIds: Type.Optional(Type.Array(NonEmptyString, { description: "Trusted approval-runtime metadata naming operator devices that may review this approval; ordinary Gateway clients may send the field, but the Gateway only binds it for internal approval-runtime requests." })),
	requireDeliveryRoute: Type.Optional(Type.Boolean()),
	suppressDelivery: Type.Optional(Type.Boolean()),
	timeoutMs: Type.Optional(Type.Integer({ minimum: 1 })),
	twoPhase: Type.Optional(Type.Boolean())
});
/** Reviewer decision payload for one pending exec approval. */
const ExecApprovalResolveParamsSchema = closedObject({
	id: NonEmptyString,
	decision: NonEmptyString,
	reviewer: Type.Optional(ApprovalChannelReviewerSchema)
});
//#endregion
//#region packages/gateway-protocol/src/schema/devices.ts
/**
* Device pairing and token-management protocol schemas.
*
* These payloads cross the gateway approval boundary, so request ids and device
* ids stay explicit and feature handlers own the authorization checks.
*/
/** Lists pending and approved device pairing records. */
const DevicePairListParamsSchema = closedObject({});
/** Approves a pending pairing request by request id. */
const DevicePairApproveParamsSchema = closedObject({ requestId: NonEmptyString });
/** Rejects a pending pairing request by request id. */
const DevicePairRejectParamsSchema = closedObject({ requestId: NonEmptyString });
/** Removes an approved or remembered device by device id. */
const DevicePairRemoveParamsSchema = closedObject({ deviceId: NonEmptyString });
/** Renames a paired device while preserving its stable device id. */
const DevicePairRenameParamsSchema = closedObject({
	deviceId: NonEmptyString,
	label: Type.String({
		minLength: 1,
		maxLength: 64
	})
});
/** Rotates or issues a device token for a specific role/scope grant. */
const DeviceTokenRotateParamsSchema = closedObject({
	deviceId: NonEmptyString,
	role: NonEmptyString,
	scopes: Type.Optional(Type.Array(NonEmptyString))
});
/**
* Rotation outcome. `tokenDelivery` records how the replacement reached its owner so
* clients report a fact instead of inferring one from the absent `token`: the gateway
* echoes the bearer token only to a device rotating its own token, and never on a
* shared/admin cross-device rotation (see `docs/cli/devices.md`). Optional because
* gateways released before this field omit it entirely.
*/
const withoutDeviceTokenRotateResultField = (field) => ({ not: { required: [field] } });
Type.Object({
	deviceId: NonEmptyString,
	role: NonEmptyString,
	token: Type.Optional(NonEmptyString),
	scopes: Type.Array(NonEmptyString),
	rotatedAtMs: Type.Integer({ minimum: 0 }),
	tokenDelivery: Type.Optional(Type.String({ enum: ["in-band", "withheld-cross-device"] }))
}, {
	additionalProperties: false,
	allOf: [Type.Union([
		Type.Object({
			token: NonEmptyString,
			tokenDelivery: Type.Literal("in-band")
		}),
		Type.Intersect([Type.Object({ tokenDelivery: Type.Literal("withheld-cross-device") }), withoutDeviceTokenRotateResultField("token")]),
		withoutDeviceTokenRotateResultField("tokenDelivery")
	])]
});
/** Revokes one role-bound device token grant. */
const DeviceTokenRevokeParamsSchema = closedObject({
	deviceId: NonEmptyString,
	role: NonEmptyString
});
/** Requests an approval-bound operator scope upgrade for the calling device. */
const ScopeUpgradeRequestSchema = closedObject({ scopes: Type.Array(NonEmptyString, {
	minItems: 1,
	maxItems: 8,
	uniqueItems: true
}) });
/** Identifies the pending scope upgrade observed by the calling device. */
const ScopeUpgradeWaitSchema = closedObject({ requestId: NonEmptyString });
closedObject({ requestId: NonEmptyString });
/** Returns an approved scope upgrade with the freshly rotated credential. */
const ScopeUpgradeApprovedSchema = closedObject({
	status: Type.Literal("approved"),
	requestId: NonEmptyString,
	deviceToken: NonEmptyString,
	scopes: Type.Array(NonEmptyString, {
		minItems: 1,
		maxItems: 8,
		uniqueItems: true
	})
});
/** Reports that an administrator rejected the pending scope upgrade. */
const ScopeUpgradeRejectedSchema = closedObject({
	status: Type.Literal("rejected"),
	requestId: NonEmptyString
});
/** Reports that the pending scope upgrade expired before approval. */
const ScopeUpgradeExpiredSchema = closedObject({
	status: Type.Literal("expired"),
	requestId: NonEmptyString
});
Type.Union([
	ScopeUpgradeApprovedSchema,
	ScopeUpgradeRejectedSchema,
	ScopeUpgradeExpiredSchema
]);
closedObject({
	requestId: NonEmptyString,
	deviceId: NonEmptyString,
	publicKey: NonEmptyString,
	displayName: Type.Optional(NonEmptyString),
	platform: Type.Optional(NonEmptyString),
	deviceFamily: Type.Optional(NonEmptyString),
	clientId: Type.Optional(NonEmptyString),
	clientMode: Type.Optional(NonEmptyString),
	browserOrigin: Type.Optional(NonEmptyString),
	role: Type.Optional(NonEmptyString),
	roles: Type.Optional(Type.Array(NonEmptyString)),
	scopes: Type.Optional(Type.Array(NonEmptyString)),
	remoteIp: Type.Optional(NonEmptyString),
	silent: Type.Optional(Type.Boolean()),
	isRepair: Type.Optional(Type.Boolean()),
	ts: Type.Integer({ minimum: 0 })
});
/** Opaque non-secret setup correlation id; never derived from the bearer setup code. */
const SetupIdSchema = Type.String({
	minLength: 1,
	maxLength: 128
});
closedObject({
	requestId: NonEmptyString,
	deviceId: NonEmptyString,
	decision: NonEmptyString,
	ts: Type.Integer({ minimum: 0 })
});
/**
* Terminal outcome of one setup credential, recorded when its exact bootstrap
* handoff delivered credentials. Carries no bearer material and no
* token-derived identifier.
*/
const DevicePairSetupCompletedEventSchema = closedObject({
	setupId: SetupIdSchema,
	deviceId: NonEmptyString,
	deviceName: Type.Optional(NonEmptyString),
	access: Type.Union([
		Type.Literal("full"),
		Type.Literal("limited"),
		Type.Literal("node")
	]),
	ts: Type.Integer({ minimum: 0 })
});
/** Event emitted when the bearer was retired but response delivery could not be confirmed. */
const DevicePairSetupDeliveryUncertainEventSchema = DevicePairSetupCompletedEventSchema;
/** Reconciles one setup credential the caller already holds a `setupId` for. */
const DevicePairSetupStatusParamsSchema = closedObject({ setupId: SetupIdSchema });
closedObject({
	completion: Type.Optional(DevicePairSetupCompletedEventSchema),
	deliveryUncertain: Type.Optional(DevicePairSetupDeliveryUncertainEventSchema)
});
const SetupCodeQrDataUrlSchema = Type.String({
	maxLength: 16384,
	pattern: "^data:image/png;base64,"
});
/**
* Generates a device-pairing setup code (and optional QR) so a mobile/companion
* client can scan it and connect to this gateway. The embedded setup code mints
* a short-lived bootstrap token that defaults to full native-mobile operator
* access, so this method requires operator.admin
* (enforced by the core method descriptor's method-scope policy, not the handler)
* and is not advertised. `bootstrapProfile: "limited"` omits operator.admin;
* `bootstrapProfile: "node"` narrows the handoff to a node role with no operator
* scopes for companion devices such as watchOS.
*/
const DevicePairSetupCodeParamsSchema = closedObject({
	publicUrl: Type.Optional(NonEmptyString),
	preferRemoteUrl: Type.Optional(Type.Boolean()),
	includeQr: Type.Optional(Type.Boolean()),
	bootstrapProfile: Type.Optional(Type.String({ enum: ["limited", "node"] })),
	joinUrl: Type.Optional(Type.Literal(true))
});
closedObject({
	setupId: Type.Optional(SetupIdSchema),
	setupCode: NonEmptyString,
	joinUrl: Type.Optional(NonEmptyString),
	qrDataUrl: Type.Optional(SetupCodeQrDataUrlSchema),
	gatewayUrl: NonEmptyString,
	gatewayUrls: Type.Optional(Type.Array(NonEmptyString, {
		minItems: 2,
		maxItems: 8,
		uniqueItems: true
	})),
	auth: Type.Union([Type.Literal("token"), Type.Literal("password")]),
	urlSource: NonEmptyString,
	access: Type.Optional(Type.Union([
		Type.Literal("full"),
		Type.Literal("limited"),
		Type.Literal("node")
	])),
	accessDowngraded: Type.Optional(Type.Boolean()),
	expiresAtMs: Type.Optional(Type.Integer({ minimum: 0 }))
});
//#endregion
//#region packages/gateway-protocol/src/schema/desktop.ts
const DesktopSourceSchema = Type.Union([
	closedObject({ kind: Type.Literal("host") }),
	closedObject({
		kind: Type.Literal("environment"),
		environmentId: NonEmptyString
	}),
	closedObject({
		kind: Type.Literal("node"),
		nodeId: NonEmptyString
	})
]);
const DesktopObserveCredentialsSchema = closedObject({
	username: Type.Optional(NonEmptyString),
	password: Type.Optional(NonEmptyString)
});
const DesktopObserveParamsSchema = Type.Union([
	closedObject({
		source: closedObject({ kind: Type.Literal("host") }),
		control: Type.Optional(Type.Boolean()),
		credentials: Type.Optional(DesktopObserveCredentialsSchema)
	}),
	closedObject({
		source: closedObject({
			kind: Type.Literal("environment"),
			environmentId: NonEmptyString
		}),
		control: Type.Optional(Type.Boolean())
	}),
	closedObject({
		source: closedObject({
			kind: Type.Literal("node"),
			nodeId: NonEmptyString
		}),
		control: Type.Optional(Type.Boolean()),
		credentials: Type.Optional(DesktopObserveCredentialsSchema)
	})
]);
const DesktopObserveResultSchema = closedObject({
	transport: Type.String({ enum: ["rfb"] }),
	wsPath: NonEmptyString,
	expiresAtMs: Type.Integer({ minimum: 0 }),
	control: Type.Boolean(),
	vncPassword: Type.Optional(NonEmptyString),
	auth: Type.Optional(Type.String({ enum: [
		"none",
		"vnc-password",
		"ard-account"
	] })),
	preauthenticated: Type.Optional(Type.Boolean())
});
const DesktopLaunchParamsSchema = closedObject({
	source: closedObject({
		kind: Type.Literal("environment"),
		environmentId: NonEmptyString
	}),
	app: WorkerDesktopAppIdSchema
});
//#endregion
//#region packages/gateway-protocol/src/schema/fs.ts
const FsListDirParamsSchema = closedObject({
	/** Absolute directory to list; for non-admin Gateway callers, omission means the first configured agent workspace. */
	path: Type.Optional(NonEmptyString),
	/** Connected node host to browse; omitted means the Gateway host. */
	nodeId: Type.Optional(NonEmptyString)
});
const FsDirEntrySchema = closedObject({
	name: NonEmptyString,
	path: NonEmptyString,
	/** Dot-prefixed directories; clients render them dimmed after visible ones. */
	hidden: Type.Optional(Type.Boolean())
});
const FsListDirResultSchema = closedObject({
	/** Resolved absolute path that was listed. */
	path: NonEmptyString,
	/** Absent at the filesystem root. */
	parent: Type.Optional(NonEmptyString),
	/** Selected host's home directory, for the picker's "home" shortcut. */
	home: NonEmptyString,
	entries: Type.Array(FsDirEntrySchema)
});
//#endregion
//#region packages/gateway-protocol/src/schema/gateway-suspend.ts
const SuspensionTokenSchema = Type.String({
	minLength: 1,
	maxLength: 128,
	pattern: "\\S"
});
const CountSchema = Type.Integer({ minimum: 0 });
const GatewaySuspendTaskBlockerSchema = closedObject({
	taskId: Type.String(),
	status: Type.Literal("running"),
	runtime: Type.Union([
		Type.Literal("subagent"),
		Type.Literal("acp"),
		Type.Literal("cli"),
		Type.Literal("cron")
	]),
	runId: Type.Optional(Type.String()),
	label: Type.Optional(Type.String()),
	title: Type.Optional(Type.String())
});
const GatewaySuspendBlockerSchema = closedObject({
	kind: Type.Union([
		Type.Literal("queue"),
		Type.Literal("reply"),
		Type.Literal("embedded-run"),
		Type.Literal("background-exec"),
		Type.Literal("cron-run"),
		Type.Literal("task"),
		Type.Literal("root-request"),
		Type.Literal("session-admission"),
		Type.Literal("session-mutation"),
		Type.Literal("chat-run"),
		Type.Literal("queued-turn"),
		Type.Literal("terminal-persistence"),
		Type.Literal("terminal-session")
	]),
	count: CountSchema,
	message: Type.String(),
	task: Type.Optional(GatewaySuspendTaskBlockerSchema)
});
const GatewaySuspendPrepareParamsSchema = closedObject({
	requestId: SuspensionTokenSchema,
	terminalPolicy: Type.Optional(Type.Union([Type.Literal("preserve"), Type.Literal("terminate")]))
});
const GatewaySuspendPrepareBusyResultSchema = closedObject({
	status: Type.Literal("busy"),
	reason: Type.Union([Type.Literal("active-work"), Type.Literal("gateway-draining")]),
	retryAfterMs: CountSchema,
	activeCount: CountSchema,
	blockers: Type.Array(GatewaySuspendBlockerSchema)
});
const GatewaySuspendPrepareReadyResultSchema = closedObject({
	status: Type.Literal("ready"),
	suspensionId: SuspensionTokenSchema,
	expiresAtMs: CountSchema,
	activeCount: CountSchema,
	blockers: Type.Array(GatewaySuspendBlockerSchema)
});
const GatewaySuspendPrepareResultSchema = Type.Union([GatewaySuspendPrepareBusyResultSchema, GatewaySuspendPrepareReadyResultSchema]);
const GatewaySuspendStatusParamsSchema = closedObject({ suspensionId: SuspensionTokenSchema });
const GatewaySuspendStatusRunningResultSchema = closedObject({ status: Type.Literal("running") });
const GatewaySuspendStatusReadyResultSchema = closedObject({
	status: Type.Literal("ready"),
	expiresAtMs: CountSchema
});
const GatewaySuspendStatusResultSchema = Type.Union([GatewaySuspendStatusRunningResultSchema, GatewaySuspendStatusReadyResultSchema]);
const GatewaySuspendResumeParamsSchema = GatewaySuspendStatusParamsSchema;
const GatewaySuspendResumeResultSchema = closedObject({
	ok: Type.Literal(true),
	status: Type.Literal("running"),
	resumed: Type.Boolean()
});
//#endregion
//#region packages/gateway-protocol/src/schema/hooks.ts
/** Request payload for one agent's live Gateway hook status report. */
const HooksStatusParamsSchema = closedObject({ agentId: Type.Optional(NonEmptyString) });
//#endregion
//#region packages/gateway-protocol/src/schema/nodes.ts
const NodePluginToolNameSchema = Type.String({
	minLength: 1,
	maxLength: 64,
	pattern: "^[A-Za-z][A-Za-z0-9_-]{0,63}$"
});
const NodeSkillNameSchema = Type.String({
	minLength: 1,
	maxLength: 64,
	pattern: "^(?!.*--)[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$"
});
/** Pending node work classes that the gateway may queue for paired devices. */
const NodePendingWorkTypeSchema = Type.String({ enum: ["status.request", "location.request"] });
/** Queue priority accepted when operators enqueue node work. */
const NodePendingWorkPrioritySchema = Type.String({ enum: ["normal", "high"] });
/** Reasons a node can report itself alive without implying an operator action. */
const NodePresenceAliveReasonSchema = Type.String({ enum: [
	"background",
	"silent_push",
	"bg_app_refresh",
	"significant_location",
	"manual",
	"connect"
] });
/** Presence heartbeat payload sent by remote nodes to refresh gateway state. */
const NodePresenceAlivePayloadSchema = closedObject({
	trigger: NodePresenceAliveReasonSchema,
	sentAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
	displayName: Type.Optional(NonEmptyString),
	version: Type.Optional(NonEmptyString),
	platform: Type.Optional(NonEmptyString),
	deviceFamily: Type.Optional(NonEmptyString),
	modelIdentifier: Type.Optional(NonEmptyString),
	pushTransport: Type.Optional(NonEmptyString)
});
/** Recent operator input activity reported by an interactive node. */
const NodePresenceActivityPayloadSchema = Type.Union([closedObject({
	idleSeconds: Type.Integer({
		minimum: 0,
		maximum: 2592e3
	}),
	saturated: Type.Optional(Type.Boolean())
}), closedObject({ action: Type.Literal("clear") })]);
/** Normalized result for node-originated events after gateway dispatch. */
const NodeEventResultSchema = closedObject({
	ok: Type.Boolean(),
	event: NonEmptyString,
	handled: Type.Boolean(),
	reason: Type.Optional(NonEmptyString)
});
/** Lists pending node-pairing requests. */
const NodePairListParamsSchema = closedObject({});
/** Approves a pending node-pairing request by request id. */
const NodePairApproveParamsSchema = closedObject({ requestId: NonEmptyString });
/** Rejects a pending node-pairing request by request id. */
const NodePairRejectParamsSchema = closedObject({ requestId: NonEmptyString });
/** Removes an already paired node from the gateway trust set. */
const NodePairRemoveParamsSchema = closedObject({ nodeId: NonEmptyString });
/** Renames a paired node while preserving its stable node id. */
const NodeRenameParamsSchema = closedObject({
	nodeId: NonEmptyString,
	displayName: NonEmptyString
});
/** Lists paired nodes known to the gateway. */
const NodeListParamsSchema = closedObject({});
/** Agent-visible tool descriptor advertised by a connected node. */
const NodePluginToolDescriptorSchema = closedObject({
	pluginId: NonEmptyString,
	name: NodePluginToolNameSchema,
	description: NonEmptyString,
	parameters: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
	command: Type.Optional(NonEmptyString),
	mcp: Type.Optional(closedObject({
		server: NonEmptyString,
		tool: NonEmptyString
	}))
});
/** Replaces the connected node's dynamic agent-visible plugin/MCP tool catalog. */
const NodePluginToolsUpdateParamsSchema = closedObject({ tools: Type.Array(NodePluginToolDescriptorSchema) });
/** Agent-visible skill descriptor advertised by a connected node. */
const NodeSkillDescriptorSchema = closedObject({
	name: NodeSkillNameSchema,
	description: Type.String({
		minLength: 1,
		maxLength: 1024
	}),
	content: Type.String({
		minLength: 1,
		maxLength: 64 * 1024
	})
});
/** Replaces the connected node's agent-visible skill catalog. */
const NodeSkillsUpdateParamsSchema = closedObject({ skills: Type.Array(NodeSkillDescriptorSchema, { maxItems: 64 }) });
/** Acknowledges queued node work that the node has consumed. */
const NodePendingAckParamsSchema = closedObject({ ids: Type.Array(NonEmptyString, { minItems: 1 }) });
/** Requests detailed metadata for one paired node. */
const NodeDescribeParamsSchema = closedObject({ nodeId: NonEmptyString });
/** Invokes a command on a paired node; idempotency allows safe retries. */
const NodeInvokeParamsSchema = closedObject({
	nodeId: NonEmptyString,
	command: NonEmptyString,
	params: Type.Optional(Type.Unknown()),
	timeoutMs: Type.Optional(Type.Integer({ minimum: 0 })),
	idempotencyKey: NonEmptyString,
	sessionKey: Type.Optional(NonEmptyString),
	turnSourceChannel: Type.Optional(Type.String()),
	turnSourceTo: Type.Optional(Type.String()),
	turnSourceAccountId: Type.Optional(Type.String()),
	turnSourceThreadId: Type.Optional(Type.Union([Type.String(), Type.Number()]))
});
/** Result callback payload for a node command invocation. */
const NodeInvokeResultParamsSchema = closedObject({
	id: NonEmptyString,
	nodeId: NonEmptyString,
	ok: Type.Boolean(),
	payload: Type.Optional(Type.Unknown()),
	payloadJSON: Type.Optional(Type.String()),
	error: Type.Optional(closedObject({
		code: Type.Optional(NonEmptyString),
		message: Type.Optional(NonEmptyString)
	}))
});
/** Ordered UTF-8 output emitted while a node command invocation is running. */
const NodeInvokeProgressParamsSchema = closedObject({
	invokeId: NonEmptyString,
	nodeId: NonEmptyString,
	seq: Type.Integer({ minimum: 0 }),
	chunk: Type.String({ maxLength: 16 * 1024 })
});
/** Generic node event envelope accepted by the gateway. */
const NodeEventParamsSchema = closedObject({
	event: NonEmptyString,
	payload: Type.Optional(Type.Unknown()),
	payloadJSON: Type.Optional(Type.String())
});
/** Request for a bounded batch of queued work assigned to the calling node. */
const NodePendingDrainParamsSchema = closedObject({ maxItems: Type.Optional(Type.Integer({
	minimum: 1,
	maximum: 10
})) });
/** One queued node-work item returned by pending-work drain calls. */
const NodePendingDrainItemSchema = closedObject({
	id: NonEmptyString,
	type: NodePendingWorkTypeSchema,
	priority: Type.String({ enum: [
		"default",
		"normal",
		"high"
	] }),
	createdAtMs: Type.Integer({ minimum: 0 }),
	expiresAtMs: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
	payload: Type.Optional(Type.Record(Type.String(), Type.Unknown()))
});
/** Drain response with a revision marker for node queue state. */
const NodePendingDrainResultSchema = closedObject({
	nodeId: NonEmptyString,
	revision: Type.Integer({ minimum: 0 }),
	items: Type.Array(NodePendingDrainItemSchema),
	hasMore: Type.Boolean()
});
/** Enqueues gateway-initiated work for a paired node. */
const NodePendingEnqueueParamsSchema = closedObject({
	nodeId: NonEmptyString,
	type: NodePendingWorkTypeSchema,
	priority: Type.Optional(NodePendingWorkPrioritySchema),
	expiresInMs: Type.Optional(Type.Integer({
		minimum: 1e3,
		maximum: 864e5
	})),
	wake: Type.Optional(Type.Boolean())
});
/** Enqueue result echoes queue revision and whether wake delivery was attempted. */
const NodePendingEnqueueResultSchema = closedObject({
	nodeId: NonEmptyString,
	revision: Type.Integer({ minimum: 0 }),
	queued: NodePendingDrainItemSchema,
	wakeTriggered: Type.Boolean()
});
closedObject({
	id: NonEmptyString,
	nodeId: NonEmptyString,
	command: NonEmptyString,
	paramsJSON: Type.Optional(Type.String()),
	timeoutMs: Type.Optional(Type.Integer({ minimum: 0 })),
	idempotencyKey: Type.Optional(NonEmptyString)
});
/** Ordered input frame sent by the gateway to one long-lived node invoke. */
const NodeInvokeInputEventSchema = closedObject({
	id: NonEmptyString,
	nodeId: NonEmptyString,
	seq: Type.Integer({ minimum: 0 }),
	payloadJSON: Type.String({ maxLength: 16 * 1024 })
});
//#endregion
//#region packages/gateway-protocol/src/schema/push.ts
/**
* Push-notification protocol schemas.
*
* APNS test schemas exercise native push routing; Web Push schemas describe the
* browser subscription lifecycle exposed by the gateway.
*/
const ApnsEnvironmentSchema = Type.String({ enum: ["sandbox", "production"] });
/** Request payload for sending a test APNS notification to one node. */
const PushTestParamsSchema = closedObject({
	nodeId: NonEmptyString,
	title: Type.Optional(Type.String()),
	body: Type.Optional(Type.String()),
	environment: Type.Optional(ApnsEnvironmentSchema)
});
/** Result payload from an APNS push test, including provider status and transport. */
const PushTestResultSchema = closedObject({
	ok: Type.Boolean(),
	status: Type.Integer(),
	apnsId: Type.Optional(Type.String()),
	reason: Type.Optional(Type.String()),
	tokenSuffix: Type.String(),
	topic: Type.String(),
	environment: ApnsEnvironmentSchema,
	transport: Type.String({ enum: ["direct", "relay"] })
});
const WebPushKeysSchema = closedObject({
	p256dh: Type.String({
		minLength: 1,
		maxLength: 512
	}),
	auth: Type.String({
		minLength: 1,
		maxLength: 512
	})
});
/** Empty request payload for fetching the Web Push VAPID public key. */
const WebPushVapidPublicKeyParamsSchema = closedObject({});
/** Browser Web Push subscription payload registered with the gateway. */
const WebPushSubscribeParamsSchema = closedObject({
	endpoint: Type.String({
		minLength: 1,
		maxLength: 2048,
		pattern: "^https://"
	}),
	keys: WebPushKeysSchema
});
/** Browser Web Push endpoint removal payload. */
const WebPushUnsubscribeParamsSchema = closedObject({ endpoint: Type.String({
	minLength: 1,
	maxLength: 2048,
	pattern: "^https://"
}) });
/** Request payload for sending a test Web Push notification to current subscriptions. */
const WebPushTestParamsSchema = closedObject({
	title: Type.Optional(Type.String()),
	body: Type.Optional(Type.String())
});
//#endregion
//#region packages/gateway-protocol/src/schema/questions.ts
const QuestionIdSchema = Type.String({ pattern: "^[a-z][a-z0-9_]*$" });
const QuestionHeaderSchema = Type.String({ maxLength: 12 });
const QuestionOptionSchema = closedObject({
	label: NonEmptyString,
	description: Type.Optional(Type.String())
});
const QuestionInputFields = {
	questionId: QuestionIdSchema,
	header: QuestionHeaderSchema,
	question: NonEmptyString,
	options: Type.Array(QuestionOptionSchema, { maxItems: 4 }),
	multiSelect: Type.Optional(Type.Boolean()),
	isOther: Type.Optional(Type.Boolean()),
	isSecret: Type.Optional(Type.Boolean())
};
/** Unnormalized question accepted by question.request. */
const QuestionRequestQuestionSchema = closedObject(QuestionInputFields);
/** Canonical normalized question shown to an operator. */
const QuestionSchema = closedObject({ ...QuestionInputFields });
const QuestionAnswersSchema = closedObject({ answers: Type.Record(QuestionIdSchema, Type.Array(Type.String())) });
const QuestionStatusSchema = Type.Union([
	Type.Literal("pending"),
	Type.Literal("answered"),
	Type.Literal("cancelled"),
	Type.Literal("expired")
]);
/**
* One pending or recently resolved transient question request. Flat object with
* optional terminal fields (exec-approval record precedent): native protocol
* codegen cannot emit per-status object unions, and the manager owns the
* status/answers invariant (answers present only when status is "answered").
*/
const QuestionRecordSchema = closedObject({
	id: NonEmptyString,
	questions: Type.Array(QuestionSchema, {
		minItems: 1,
		maxItems: 3
	}),
	agentId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	createdAtMs: Type.Integer({ minimum: 0 }),
	expiresAtMs: Type.Integer({ minimum: 0 }),
	status: QuestionStatusSchema,
	answers: Type.Optional(QuestionAnswersSchema),
	resolvedBy: Type.Optional(NonEmptyString)
});
const QuestionRequestParamsSchema = closedObject({
	id: Type.Optional(NonEmptyString),
	questions: Type.Array(QuestionRequestQuestionSchema, {
		minItems: 1,
		maxItems: 3
	}),
	agentId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	timeoutMs: Type.Optional(Type.Integer({ minimum: 1 }))
});
const QuestionRequestResultSchema = closedObject({
	id: NonEmptyString,
	expiresAtMs: Type.Integer({ minimum: 0 })
});
const QuestionWaitAnswerParamsSchema = closedObject({
	id: NonEmptyString,
	timeoutMs: Type.Optional(Type.Integer({ minimum: 1 }))
});
const QuestionWaitAnswerResultSchema = Type.Union([
	closedObject({ status: Type.Literal("pending") }),
	closedObject({
		status: Type.Literal("answered"),
		answers: QuestionAnswersSchema
	}),
	closedObject({ status: Type.Literal("cancelled") }),
	closedObject({ status: Type.Literal("expired") })
]);
const QuestionResolveParamsSchema = Type.Union([closedObject({
	id: NonEmptyString,
	answers: QuestionAnswersSchema,
	resolvedBy: Type.Optional(NonEmptyString)
}), closedObject({
	id: NonEmptyString,
	cancel: Type.Literal(true),
	resolvedBy: Type.Optional(NonEmptyString)
})]);
const QuestionResolveResultSchema = Type.Union([closedObject({
	status: Type.Literal("answered"),
	answers: QuestionAnswersSchema
}), closedObject({ status: Type.Literal("cancelled") })]);
const QuestionGetParamsSchema = closedObject({ id: NonEmptyString });
const QuestionGetResultSchema = closedObject({ question: QuestionRecordSchema });
const QuestionListParamsSchema = closedObject({});
const QuestionListResultSchema = closedObject({ questions: Type.Array(QuestionRecordSchema) });
const QuestionRequestedEventSchema = withSince("2026.7", QuestionRecordSchema);
const QuestionResolvedEventSchema = withSince("2026.7", Type.Union([
	closedObject({
		id: NonEmptyString,
		status: Type.Literal("answered"),
		answers: QuestionAnswersSchema
	}),
	closedObject({
		id: NonEmptyString,
		status: Type.Literal("cancelled")
	}),
	closedObject({
		id: NonEmptyString,
		status: Type.Literal("expired")
	})
]));
closedObject({});
const SecretStoreNameSchema = Type.String({
	minLength: 1,
	maxLength: 128,
	pattern: "^[A-Z][A-Z0-9_]{0,127}$"
});
const SecretStoreEntryMetadataProperties = {
	name: SecretStoreNameSchema,
	scopeKind: Type.Literal("team"),
	scopeId: Type.Literal(""),
	createdAtMs: Type.Integer({ minimum: 0 }),
	updatedAtMs: Type.Integer({ minimum: 0 }),
	updatedBy: Type.Optional(Type.String())
};
const SecretStoreAllowedHostsSchema = Type.Array(Type.String({
	minLength: 1,
	maxLength: 253
}), {
	maxItems: 128,
	uniqueItems: true
});
/** Secret metadata never structurally carries the stored value. */
const SecretStoreSecretEntrySchema = closedObject({
	...SecretStoreEntryMetadataProperties,
	kind: Type.Literal("secret"),
	allowedHosts: Type.Optional(withSince("2026.8", SecretStoreAllowedHostsSchema))
});
/** Environment entries include their value because they are intentionally visible. */
const SecretStoreEnvEntrySchema = closedObject({
	...SecretStoreEntryMetadataProperties,
	kind: Type.Literal("env"),
	value: Type.String({ maxLength: 64 * 1024 })
});
/** Team secret-store list entry, discriminated by disclosure behavior. */
const SecretStoreEntrySchema = Type.Union([SecretStoreSecretEntrySchema, SecretStoreEnvEntrySchema]);
/** Empty request payload for listing the team secret store. */
const SecretsStoreListParamsSchema = closedObject({});
/** Team secret-store inventory. */
const SecretsStoreListResultSchema = closedObject({ entries: Type.Array(SecretStoreEntrySchema) });
/** Create or replace one team secret-store entry. */
const SecretsStoreSetParamsSchema = closedObject({
	name: SecretStoreNameSchema,
	value: Type.String({ maxLength: 64 * 1024 }),
	kind: Type.Union([Type.Literal("secret"), Type.Literal("env")]),
	allowedHosts: Type.Optional(withSince("2026.8", SecretStoreAllowedHostsSchema))
});
/** Soft-delete one team secret-store entry. */
const SecretsStoreDeleteParamsSchema = closedObject({ name: SecretStoreNameSchema });
/** Mutation acknowledgement including whether the active runtime was refreshed. */
const SecretsStoreMutationResultSchema = closedObject({
	ok: Type.Literal(true),
	reloaded: Type.Boolean(),
	warningCount: Type.Optional(Type.Integer({ minimum: 0 }))
});
/** Request payload for resolving the secrets needed by one command invocation. */
const SecretsResolveParamsSchema = closedObject({
	commandName: NonEmptyString,
	targetIds: Type.Array(NonEmptyString),
	allowedPaths: Type.Optional(Type.Array(NonEmptyString)),
	forcedActivePaths: Type.Optional(Type.Array(NonEmptyString)),
	optionalActivePaths: Type.Optional(Type.Array(NonEmptyString)),
	providerOverrides: Type.Optional(closedObject({
		webSearch: Type.Optional(NonEmptyString),
		webFetch: Type.Optional(NonEmptyString)
	}))
});
/** One resolved secret assignment path plus its provider-owned value. */
const SecretsResolveAssignmentSchema = closedObject({
	path: Type.Optional(NonEmptyString),
	pathSegments: Type.Array(NonEmptyString),
	value: Type.Unknown()
});
/** Secret resolution response with assignments and safe diagnostics. */
const SecretsResolveResultSchema = closedObject({
	ok: Type.Optional(Type.Boolean()),
	assignments: Type.Optional(Type.Array(SecretsResolveAssignmentSchema)),
	diagnostics: Type.Optional(Type.Array(NonEmptyString)),
	inactiveRefPaths: Type.Optional(Type.Array(NonEmptyString))
});
//#endregion
//#region packages/gateway-protocol/src/schema/session-placement-state.ts
function isCloudWorkerPlacementState(state) {
	return state !== void 0 && state !== "local" && state !== "reclaimed";
}
//#endregion
//#region packages/gateway-protocol/src/schema/session-placement.ts
/** Durable gateway ownership states for one session execution placement.
* The literal list stays explicit because Type.Union needs a tuple for
* Static inference (a mapped array collapses Static to never); the guard
* below keeps it in lockstep with SESSION_PLACEMENT_STATES. */
const SessionPlacementStateSchema = Type.Union([
	Type.Literal("local"),
	Type.Literal("requested"),
	Type.Literal("provisioning"),
	Type.Literal("syncing"),
	Type.Literal("starting"),
	Type.Literal("active"),
	Type.Literal("draining"),
	Type.Literal("reconciling"),
	Type.Literal("reclaimed"),
	Type.Literal("failed")
]);
const SessionPlacementTimingProperties = {
	generation: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	createdAtMs: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	updatedAtMs: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	stateChangedAtMs: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	})
};
const SessionPlacementOwnerEpochSchema = Type.Integer({
	minimum: 1,
	maximum: Number.MAX_SAFE_INTEGER
});
const WorkerBundleHashSchema = Type.String({
	minLength: 64,
	maxLength: 64,
	pattern: "^[a-f0-9]{64}$"
});
const SessionPlacementWorkspaceProperties = {
	workspaceBaseManifestRef: NonEmptyString,
	remoteWorkspaceDir: NonEmptyString
};
const SessionPlacementAckProperties = {
	lastTranscriptAckCursor: Type.Optional(Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	})),
	lastLiveEventAckCursor: Type.Optional(Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}))
};
const SessionPlacementDiskSpaceSchema = closedObject({
	status: Type.Union([
		Type.Literal("ok"),
		Type.Literal("warning"),
		Type.Literal("critical")
	]),
	availableBytes: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	totalBytes: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	observedAtMs: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	})
});
const SessionPlacementDiskSpaceProperties = { diskSpace: Type.Optional(SessionPlacementDiskSpaceSchema) };
const WorkspaceResultConflictSchema = closedObject({
	paths: Type.Array(NonEmptyString, {
		minItems: 1,
		maxItems: 256
	}),
	stagedResultRef: NonEmptyString,
	totalCount: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: Number.MAX_SAFE_INTEGER
	}))
});
const SessionPlacementConflictProperties = { workspaceResultConflict: Type.Optional(WorkspaceResultConflictSchema) };
const TerminalSessionPlacementProperties = {
	environmentId: Type.Optional(NonEmptyString),
	activeOwnerEpoch: Type.Optional(SessionPlacementOwnerEpochSchema),
	workspaceBaseManifestRef: Type.Optional(NonEmptyString),
	remoteWorkspaceDir: Type.Optional(NonEmptyString),
	workerBundleHash: Type.Optional(WorkerBundleHashSchema),
	...SessionPlacementAckProperties,
	...SessionPlacementConflictProperties,
	terminalReason: Type.Optional(NonEmptyString),
	terminalAtMs: Type.Optional(Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}))
};
function createUnownedSessionPlacementSchema(state) {
	return closedObject({
		state: Type.Literal(state),
		...SessionPlacementTimingProperties
	});
}
function createWorkerOwnedSessionPlacementSchema(state) {
	return closedObject({
		state: Type.Literal(state),
		...SessionPlacementTimingProperties,
		environmentId: NonEmptyString,
		activeOwnerEpoch: SessionPlacementOwnerEpochSchema,
		workerBundleHash: WorkerBundleHashSchema,
		...SessionPlacementWorkspaceProperties,
		...SessionPlacementAckProperties,
		...SessionPlacementConflictProperties,
		...SessionPlacementDiskSpaceProperties
	});
}
const LocalSessionPlacementSchema = createUnownedSessionPlacementSchema("local");
const RequestedSessionPlacementSchema = createUnownedSessionPlacementSchema("requested");
const ProvisioningSessionPlacementSchema = closedObject({
	state: Type.Literal("provisioning"),
	...SessionPlacementTimingProperties,
	environmentId: Type.Optional(NonEmptyString)
});
const SyncingSessionPlacementSchema = closedObject({
	state: Type.Literal("syncing"),
	...SessionPlacementTimingProperties,
	environmentId: NonEmptyString,
	workerBundleHash: WorkerBundleHashSchema
});
const StartingSessionPlacementSchema = closedObject({
	state: Type.Literal("starting"),
	...SessionPlacementTimingProperties,
	environmentId: NonEmptyString,
	workerBundleHash: WorkerBundleHashSchema,
	...SessionPlacementWorkspaceProperties
});
const ActiveWorkerSessionPlacementSchema = createWorkerOwnedSessionPlacementSchema("active");
const DrainingSessionPlacementSchema = createWorkerOwnedSessionPlacementSchema("draining");
const ReconcilingSessionPlacementSchema = createWorkerOwnedSessionPlacementSchema("reconciling");
const ReclaimedSessionPlacementSchema = closedObject({
	state: Type.Literal("reclaimed"),
	...SessionPlacementTimingProperties,
	...TerminalSessionPlacementProperties
});
const FailedSessionPlacementSchema = closedObject({
	state: Type.Literal("failed"),
	...SessionPlacementTimingProperties,
	...TerminalSessionPlacementProperties,
	recoveryError: NonEmptyString
});
/** Gateway-visible placement projection; `state` remains the closed discriminator. */
const SessionPlacementSchema = Type.Union([
	LocalSessionPlacementSchema,
	RequestedSessionPlacementSchema,
	ProvisioningSessionPlacementSchema,
	SyncingSessionPlacementSchema,
	StartingSessionPlacementSchema,
	ActiveWorkerSessionPlacementSchema,
	DrainingSessionPlacementSchema,
	ReconcilingSessionPlacementSchema,
	ReclaimedSessionPlacementSchema,
	FailedSessionPlacementSchema
]);
/** Requests one-way dispatch of an existing local session to exactly one worker target. */
const SessionsDispatchParamsSchema = Type.Object({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	profileId: Type.Optional(NonEmptyString),
	deviceId: Type.Optional(NonEmptyString)
}, {
	additionalProperties: false,
	oneOf: [{
		required: ["profileId"],
		not: { required: ["deviceId"] }
	}, {
		required: ["deviceId"],
		not: { required: ["profileId"] }
	}]
});
/** Result returned once session dispatch reaches durable worker ownership. */
const SessionsDispatchResultSchema = closedObject({
	ok: Type.Literal(true),
	key: NonEmptyString,
	sessionId: NonEmptyString,
	placement: ActiveWorkerSessionPlacementSchema
});
/** Requests safe workspace reconciliation and teardown of an active cloud worker. */
const SessionsReclaimParamsSchema = Type.Object({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
}, { additionalProperties: false });
/** Result returned once worker ownership has been destroyed and reclaimed. */
const SessionsReclaimResultSchema = Type.Object({
	ok: Type.Literal(true),
	key: NonEmptyString,
	sessionId: NonEmptyString,
	placement: ReclaimedSessionPlacementSchema
}, { additionalProperties: false });
//#endregion
//#region packages/gateway-protocol/src/schema/session-discussion.ts
const SessionDiscussionStateSchema = Type.Union([
	Type.Literal("none"),
	Type.Literal("available"),
	Type.Literal("open")
]);
const SessionDiscussionInfoSchema = closedObject({
	state: SessionDiscussionStateSchema,
	embedUrl: Type.Optional(Type.String()),
	openUrl: Type.Optional(Type.String())
});
const SessionDiscussionInfoParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
});
const SessionDiscussionOpenParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
});
const SessionDiscussionInfoResultSchema = SessionDiscussionInfoSchema;
const SessionDiscussionOpenResultSchema = SessionDiscussionInfoSchema;
/** Replaces the sessions this connection is currently rendering. */
const SessionsViewerPresenceSetParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	sessionKeys: Type.Array(ChatSendSessionKeyString, { maxItems: 32 })
});
closedObject({ sessionKeys: Type.Array(ChatSendSessionKeyString, { maxItems: 32 }) });
//#endregion
//#region packages/gateway-protocol/src/schema/system-info.ts
/** Empty request payload for Gateway host system information. */
const SystemInfoParamsSchema = closedObject({});
const UtilityModelStatusSchema = Type.Union([
	closedObject({
		status: Type.Literal("auto"),
		model: Type.String({ minLength: 1 })
	}),
	closedObject({
		status: Type.Literal("configured"),
		model: Type.String({ minLength: 1 })
	}),
	closedObject({ status: Type.Literal("disabled") }),
	closedObject({ status: Type.Literal("unavailable") })
]);
/** Gateway host identity and resource snapshot. */
const SystemInfoResultSchema = closedObject({
	machineName: Type.String(),
	hostname: Type.String(),
	platform: Type.String(),
	release: Type.String(),
	arch: Type.String(),
	osLabel: Type.String(),
	lanAddress: Type.Optional(Type.String()),
	port: Type.Optional(Type.Integer()),
	nodeVersion: Type.String(),
	pid: Type.Integer(),
	/** Process-start identity for invalidating work that cannot survive a Gateway restart. */
	processInstanceId: Type.Optional(Type.String({ minLength: 1 })),
	uptimeMs: Type.Integer(),
	cpuCount: Type.Integer(),
	cpuModel: Type.Optional(Type.String()),
	loadAverage: Type.Optional(Type.Tuple([
		Type.Number(),
		Type.Number(),
		Type.Number()
	])),
	memoryTotalBytes: Type.Integer(),
	memoryFreeBytes: Type.Integer(),
	diskTotalBytes: Type.Optional(Type.Integer()),
	diskAvailableBytes: Type.Optional(Type.Integer()),
	diskPath: Type.Optional(Type.String()),
	/** Resolved utility model for the configured default agent. */
	defaultAgentUtilityModel: Type.Optional(UtilityModelStatusSchema)
});
//#endregion
//#region packages/gateway-protocol/src/schema/task-suggestions.ts
const TaskIdSchema = Type.String({
	minLength: 1,
	maxLength: 128
});
const TaskTitleSchema = Type.String({
	minLength: 1,
	maxLength: 60,
	pattern: "\\S"
});
const TaskPromptSchema = Type.String({
	minLength: 1,
	maxLength: 32768,
	pattern: "\\S"
});
const TaskTldrSchema = Type.String({
	minLength: 1,
	maxLength: 1024,
	pattern: "\\S"
});
const TaskCwdSchema = Type.String({
	minLength: 1,
	maxLength: 4096
});
const TaskSessionKeySchema = Type.String({
	minLength: 1,
	maxLength: 512
});
const TaskAgentIdSchema = Type.String({
	minLength: 1,
	maxLength: 128
});
const TaskSuggestionAcceptanceModeSchema = Type.Enum({
	WORKTREE: "worktree",
	LOCAL: "local",
	CLOUD: "cloud",
	SESSION: "session"
}, { type: "string" });
/** One model-proposed follow-up task waiting for operator action. */
const TaskSuggestionSchema = closedObject({
	id: TaskIdSchema,
	title: TaskTitleSchema,
	prompt: TaskPromptSchema,
	tldr: TaskTldrSchema,
	cwd: TaskCwdSchema,
	sessionKey: TaskSessionKeySchema,
	agentId: Type.Optional(TaskAgentIdSchema),
	createdAt: Type.Integer({ minimum: 0 })
});
/** Lists pending suggestions, optionally narrowed to one source session. */
const TaskSuggestionsListParamsSchema = closedObject({
	sessionKey: Type.Optional(TaskSessionKeySchema),
	agentId: Type.Optional(TaskAgentIdSchema)
});
const TaskSuggestionsListResultSchema = closedObject({ suggestions: Type.Array(TaskSuggestionSchema) });
/** Creates a pending suggestion without starting any work. */
const TaskSuggestionsCreateParamsSchema = closedObject({
	title: TaskTitleSchema,
	prompt: TaskPromptSchema,
	tldr: TaskTldrSchema,
	cwd: TaskCwdSchema,
	sessionKey: TaskSessionKeySchema,
	agentId: Type.Optional(TaskAgentIdSchema)
});
const TaskSuggestionsCreateResultSchema = closedObject({
	taskId: TaskIdSchema,
	suggestion: TaskSuggestionSchema
});
const TaskSuggestionResolutionSchema = Type.Union([
	Type.Literal("dismissed"),
	Type.Literal("accepted"),
	Type.Literal("expired")
]);
/** Atomically claims a pending suggestion and starts it in the requested execution mode. */
const TaskSuggestionsAcceptParamsSchema = closedObject({
	taskId: TaskIdSchema,
	mode: Type.Optional(TaskSuggestionAcceptanceModeSchema),
	cloudProfileId: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 128
	}))
});
const TaskSuggestionsAcceptResultSchema = closedObject({
	taskId: TaskIdSchema,
	key: TaskSessionKeySchema
});
/** Removes a pending suggestion without starting work. */
const TaskSuggestionsDismissParamsSchema = closedObject({
	taskId: TaskIdSchema,
	reason: Type.Optional(Type.String({ maxLength: 1024 }))
});
const TaskSuggestionsDismissResultSchema = closedObject({
	taskId: TaskIdSchema,
	dismissed: Type.Boolean()
});
/** Live update emitted when a pending suggestion is created or resolved. */
const TaskSuggestionEventSchema = Type.Union([closedObject({
	action: Type.Literal("created"),
	suggestion: TaskSuggestionSchema
}), closedObject({
	action: Type.Literal("resolved"),
	taskId: TaskIdSchema,
	resolution: TaskSuggestionResolutionSchema
})]);
//#endregion
//#region packages/gateway-protocol/src/schema/tasks.ts
/**
* Task ledger protocol schemas.
*
* Tasks represent long-running SDK/agent operations exposed through the gateway;
* these schemas keep list/get/cancel payloads bounded and status values closed.
*/
/** Closed task lifecycle statuses visible in the gateway task ledger. */
const TaskLedgerStatusSchema = Type.Union([
	Type.Literal("queued"),
	Type.Literal("running"),
	Type.Literal("completed"),
	Type.Literal("failed"),
	Type.Literal("cancelled"),
	Type.Literal("timed_out")
]);
const TimestampSchema = Type.Union([Type.String(), Type.Integer({ minimum: 0 })]);
const TaskDeliveryStatusSchema = Type.Union([
	Type.Literal("pending"),
	Type.Literal("delivered"),
	Type.Literal("session_queued"),
	Type.Literal("failed"),
	Type.Literal("dismissed"),
	Type.Literal("parent_missing"),
	Type.Literal("not_applicable")
]);
const TaskTerminalOutcomeSchema = Type.Union([Type.Literal("succeeded"), Type.Literal("blocked")]);
const TaskDiffStatSchema = withSince("2026.8", closedObject({
	files: Type.Integer({ minimum: 0 }),
	added: Type.Integer({ minimum: 0 }),
	removed: Type.Integer({ minimum: 0 })
}));
/** Public task summary returned by task list/get/cancel responses. */
const TaskSummarySchema = closedObject({
	id: NonEmptyString,
	kind: Type.Optional(Type.String()),
	runtime: Type.Optional(Type.String()),
	status: TaskLedgerStatusSchema,
	title: Type.Optional(Type.String()),
	agentId: Type.Optional(Type.String()),
	sessionKey: Type.Optional(Type.String()),
	childSessionKey: Type.Optional(Type.String()),
	ownerKey: Type.Optional(Type.String()),
	runId: Type.Optional(Type.String()),
	taskId: Type.Optional(Type.String()),
	flowId: Type.Optional(Type.String()),
	parentTaskId: Type.Optional(Type.String()),
	sourceId: Type.Optional(Type.String()),
	createdAt: Type.Optional(TimestampSchema),
	updatedAt: Type.Optional(TimestampSchema),
	startedAt: Type.Optional(TimestampSchema),
	endedAt: Type.Optional(TimestampSchema),
	toolUseCount: Type.Optional(Type.Integer({ minimum: 0 })),
	lastToolName: Type.Optional(Type.String()),
	lastActivity: Type.Optional(withSince("2026.8", Type.String({ maxLength: 200 }))),
	diffStat: Type.Optional(TaskDiffStatSchema),
	progressSummary: Type.Optional(Type.String()),
	terminalSummary: Type.Optional(Type.String()),
	error: Type.Optional(Type.String()),
	deliveryStatus: Type.Optional(TaskDeliveryStatusSchema),
	terminalOutcome: Type.Optional(TaskTerminalOutcomeSchema),
	/** Bounded canonical completion result. Returned only by tasks.get. */
	result: Type.Optional(Type.String()),
	/** Bounded task input. Returned by tasks.get; omitted from list/event summaries. */
	prompt: Type.Optional(Type.String())
});
/** Task list filters with bounded pagination. */
const TasksListParamsSchema = closedObject({
	status: Type.Optional(Type.Union([TaskLedgerStatusSchema, Type.Array(TaskLedgerStatusSchema)])),
	agentId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(NonEmptyString),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 500
	})),
	cursor: Type.Optional(Type.String())
});
/** Task list page response. */
const TasksListResultSchema = closedObject({
	tasks: Type.Array(TaskSummarySchema),
	nextCursor: Type.Optional(Type.String())
});
/** Lookup request for one task id. */
const TasksGetParamsSchema = closedObject({ taskId: NonEmptyString });
/** Lookup result for one task summary. */
const TasksGetResultSchema = closedObject({ task: TaskSummarySchema });
/** Cancel request for one task id with optional operator reason. */
const TasksCancelParamsSchema = closedObject({
	taskId: NonEmptyString,
	reason: Type.Optional(Type.String())
});
/** Cancel result, including the task snapshot when it was found. */
const TasksCancelResultSchema = closedObject({
	found: Type.Boolean(),
	cancelled: Type.Boolean(),
	reason: Type.Optional(Type.String()),
	task: Type.Optional(TaskSummarySchema)
});
const TasksRecoveryParamsSchema = closedObject({ taskIds: Type.Array(NonEmptyString, {
	minItems: 1,
	maxItems: 10
}) });
const TaskRecoveryItemSchema = closedObject({
	taskId: NonEmptyString,
	ok: Type.Boolean(),
	reason: Type.Optional(Type.String()),
	duplicateRisk: Type.Optional(Type.Boolean()),
	task: Type.Optional(TaskSummarySchema)
});
const TasksRecoveryResultSchema = closedObject({ results: Type.Array(TaskRecoveryItemSchema, { maxItems: 10 }) });
/** Approval request raised by a plugin before a sensitive tool action proceeds. */
const PluginApprovalRequestParamsSchema = closedObject({
	pluginId: Type.Optional(NonEmptyString),
	title: Type.String({
		minLength: 1,
		maxLength: 80
	}),
	description: Type.String({
		minLength: 1,
		maxLength: 512
	}),
	detail: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 16384,
		description: "Reviewer-surface-only detail; not delivered to channels or push notifications."
	})),
	severity: Type.Optional(Type.String({ enum: [
		"info",
		"warning",
		"critical"
	] })),
	toolName: Type.Optional(Type.String()),
	toolCallId: Type.Optional(Type.String()),
	allowedDecisions: Type.Optional(Type.Array(Type.String({ enum: [
		"allow-once",
		"allow-always",
		"deny"
	] }), {
		minItems: 1,
		maxItems: 3
	})),
	agentId: Type.Optional(Type.String()),
	sessionKey: Type.Optional(Type.String()),
	approvalReviewerDeviceIds: Type.Optional(Type.Array(NonEmptyString, { description: "Trusted approval-runtime metadata naming operator devices that may review this approval; ordinary Gateway clients may send the field, but the Gateway only binds it for internal approval-runtime requests." })),
	turnSourceChannel: Type.Optional(Type.String()),
	turnSourceTo: Type.Optional(Type.String()),
	turnSourceAccountId: Type.Optional(Type.String()),
	turnSourceThreadId: Type.Optional(Type.Union([Type.String(), Type.Number()])),
	timeoutMs: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 6e5
	})),
	twoPhase: Type.Optional(Type.Boolean())
});
/** Reviewer decision payload resolving one pending plugin approval request. */
const PluginApprovalResolveParamsSchema = closedObject({
	id: NonEmptyString,
	decision: NonEmptyString,
	reviewer: Type.Optional(ApprovalChannelReviewerSchema)
});
//#endregion
//#region packages/gateway-protocol/src/schema/portals.ts
const PortalSummaryIdentityFields = {
	id: NonEmptyString,
	title: NonEmptyString,
	port: Type.Integer({
		minimum: 1,
		maximum: 65535
	}),
	listenPort: Type.Integer({
		minimum: 1,
		maximum: 65535
	})
};
const PortalSummaryMetadataFields = {
	publicUrl: NonEmptyString,
	path: Type.Optional(Type.String({ pattern: "^/" })),
	description: Type.Optional(Type.String()),
	createdAtMs: Type.Integer({ minimum: 0 })
};
const PortalSummarySchema = closedObject({
	...PortalSummaryIdentityFields,
	tokenQuery: Type.Optional(NonEmptyString),
	url: Type.Optional(NonEmptyString),
	...PortalSummaryMetadataFields
});
const PortalListParamsSchema = closedObject({});
const PortalListResultSchema = closedObject({ portals: Type.Array(PortalSummarySchema) });
const PortalOpenParamsSchema = closedObject({
	port: Type.Integer({
		minimum: 1,
		maximum: 65535
	}),
	title: Type.Optional(NonEmptyString),
	description: Type.Optional(Type.String()),
	path: Type.Optional(Type.String({ pattern: "^/" }))
});
const PortalOpenResultSchema = closedObject({
	...PortalSummaryIdentityFields,
	tokenQuery: NonEmptyString,
	url: NonEmptyString,
	...PortalSummaryMetadataFields
});
const PortalCloseParamsSchema = closedObject({ id: NonEmptyString });
const PortalCloseResultSchema = closedObject({ closed: Type.Boolean() });
const PortalChangedEventSchema = closedObject({ portals: Type.Array(PortalSummarySchema) });
//#endregion
//#region packages/gateway-protocol/src/schema/worktrees.ts
const WorktreeNameSchema = Type.String({ pattern: "^[a-z0-9][a-z0-9-]{0,63}$" });
const WorktreeRunEndCleanupSchema = Type.Union([closedObject({
	outcome: Type.String({ enum: [
		"removed-lossless",
		"retained-busy",
		"retained-dirty",
		"retained-unpushed",
		"retained-provisioned-drift"
	] }),
	at: Type.Integer({ minimum: 0 })
}), closedObject({
	outcome: Type.Literal("failed"),
	at: Type.Integer({ minimum: 0 }),
	reason: Type.String({
		minLength: 1,
		maxLength: 500
	})
})]);
const WorktreeRecordSchema = closedObject({
	id: NonEmptyString,
	name: WorktreeNameSchema,
	repoFingerprint: Type.String({ pattern: "^[a-f0-9]{16}$" }),
	repoRoot: NonEmptyString,
	path: NonEmptyString,
	branch: NonEmptyString,
	baseRef: NonEmptyString,
	ownerKind: Type.String({ enum: [
		"manual",
		"workboard",
		"session"
	] }),
	ownerId: Type.Optional(NonEmptyString),
	snapshotRef: Type.Optional(NonEmptyString),
	createdAt: Type.Integer({ minimum: 0 }),
	lastActiveAt: Type.Integer({ minimum: 0 }),
	removedAt: Type.Optional(Type.Integer({ minimum: 0 })),
	runEndCleanup: Type.Optional(WorktreeRunEndCleanupSchema)
});
const WorktreesListParamsSchema = closedObject({});
const WorktreesListResultSchema = closedObject({ worktrees: Type.Array(WorktreeRecordSchema) });
const WorktreesCreateParamsSchema = closedObject({
	repoRoot: NonEmptyString,
	name: Type.Optional(WorktreeNameSchema),
	baseRef: Type.Optional(NonEmptyString)
});
const WorktreesRemoveParamsSchema = closedObject({
	id: NonEmptyString,
	force: Type.Optional(Type.Boolean())
});
const WorktreesRemoveResultSchema = closedObject({
	removed: Type.Boolean(),
	snapshotRef: Type.Optional(NonEmptyString),
	/** Why the pre-removal snapshot failed; present only on forced removals that continued without one. */
	snapshotError: Type.Optional(NonEmptyString)
});
const WorktreeRepositoryStatusSchema = Type.String({ enum: [...[
	"git",
	"not_git",
	"unavailable"
]] });
const WorktreesBranchesParamsSchema = closedObject({
	repoRoot: NonEmptyString,
	includeRepositoryStatus: Type.Optional(Type.Boolean())
});
const WorktreeBranchSchema = closedObject({
	name: NonEmptyString,
	kind: Type.Union([Type.Literal("local"), Type.Literal("remote")])
});
const WorktreesBranchesResultSchema = closedObject({
	branches: Type.Array(WorktreeBranchSchema),
	defaultBranch: Type.Optional(NonEmptyString),
	headBranch: Type.Optional(NonEmptyString),
	repositoryStatus: Type.Optional(WorktreeRepositoryStatusSchema)
});
const WorktreesRestoreParamsSchema = closedObject({ id: NonEmptyString });
const WorktreesGcParamsSchema = closedObject({});
const WorktreesGcResultSchema = closedObject({
	removed: Type.Array(NonEmptyString),
	orphansDeleted: Type.Integer({ minimum: 0 }),
	snapshotsPruned: Type.Integer({ minimum: 0 })
});
//#endregion
//#region packages/gateway-protocol/src/validator-registry.ts
const validateCommandsListParams = /* @__PURE__ */ lazyCompile(CommandsListParamsSchema);
const validateConnectParams = /* @__PURE__ */ lazyCompile(ConnectParamsSchema);
const validateWorkerAdmissionHandshake = /* @__PURE__ */ lazyCompile(WorkerAdmissionHandshakeSchema);
const validateWorkerConnectRequestFrame = /* @__PURE__ */ lazyCompile(WorkerConnectRequestFrameSchema);
const validateWorkerHeartbeatParams = /* @__PURE__ */ lazyCompile(WorkerHeartbeatParamsSchema);
const validateWorkerSessionsSpawnParams = /* @__PURE__ */ lazyCompile(WorkerSessionsSpawnParamsSchema);
const validateWorkerSessionsSendParams = /* @__PURE__ */ lazyCompile(WorkerSessionsSendParamsSchema);
function checkWorkerProtocolJson(data) {
	const stack = [{
		depth: 0,
		value: data
	}];
	const seen = /* @__PURE__ */ new WeakSet();
	while (stack.length > 0) {
		const current = stack.pop();
		if (!current) break;
		if (current.depth > 32) return {
			keyword: "maxDepth",
			params: { limit: 32 },
			message: `must not exceed JSON nesting depth 32`
		};
		if (current.value === null || typeof current.value === "string" || typeof current.value === "boolean") continue;
		if (typeof current.value === "number") {
			if (!Number.isFinite(current.value)) return {
				keyword: "finite",
				message: "must contain only finite JSON numbers"
			};
			continue;
		}
		if (typeof current.value !== "object") return {
			keyword: "jsonValue",
			message: "must contain only JSON values"
		};
		if (seen.has(current.value)) return {
			keyword: "acyclic",
			message: "must be an acyclic JSON value"
		};
		seen.add(current.value);
		const values = Array.isArray(current.value) ? current.value : Object.values(current.value);
		for (const value of values) stack.push({
			depth: current.depth + 1,
			value
		});
	}
}
const validateWorkerTranscriptCommitParams = /* @__PURE__ */ lazyCompile(WorkerTranscriptCommitParamsSchema, checkWorkerProtocolJson);
const validateWorkerLiveEventParams = /* @__PURE__ */ lazyCompile(WorkerLiveEventParamsSchema, checkWorkerProtocolJson);
const validateGatewaySuspendPrepareParams = /* @__PURE__ */ lazyCompile(GatewaySuspendPrepareParamsSchema);
const validateGatewaySuspendStatusParams = /* @__PURE__ */ lazyCompile(GatewaySuspendStatusParamsSchema);
const validateGatewaySuspendResumeParams = /* @__PURE__ */ lazyCompile(GatewaySuspendResumeParamsSchema);
const validateRequestFrame = /* @__PURE__ */ lazyCompile(RequestFrameSchema);
const validateMessageActionParams = /* @__PURE__ */ lazyCompile(MessageActionParamsSchema);
const validateSendParams = /* @__PURE__ */ lazyCompile(SendParamsSchema);
const validateConversationListParams = /* @__PURE__ */ lazyCompile(ConversationListParamsSchema);
const validateConversationSendParams = /* @__PURE__ */ lazyCompile(ConversationSendParamsSchema);
const validateConversationTurnCancelParams = /* @__PURE__ */ lazyCompile(ConversationTurnCancelParamsSchema);
const validateConversationTurnParams = /* @__PURE__ */ lazyCompile(ConversationTurnParamsSchema);
const validatePollParams = /* @__PURE__ */ lazyCompile(PollParamsSchema);
const validateAgentParams = /* @__PURE__ */ lazyCompile(AgentParamsSchema);
const validateAuditActivityListParams = /* @__PURE__ */ lazyCompile(AuditActivityListParamsSchema);
const validateAuditRunInspectParams = /* @__PURE__ */ lazyCompile(AuditRunInspectParamsSchema);
const validateExecutionIdentityContextV1 = /* @__PURE__ */ lazyCompile(ExecutionIdentityContextV1Schema);
const validateDecisionReceiptV1 = /* @__PURE__ */ lazyCompile(DecisionReceiptV1Schema);
const validateAuditListParams = /* @__PURE__ */ lazyCompile(AuditListParamsSchema);
const validateUsersListParams = /* @__PURE__ */ lazyCompile(UsersListParamsSchema);
const validateUsersPrefsGetParams = /* @__PURE__ */ lazyCompile(UsersPrefsGetParamsSchema);
const validateUsersPrefsSetParams = /* @__PURE__ */ lazyCompile(UsersPrefsSetParamsSchema);
const validateUsersSelfParams = /* @__PURE__ */ lazyCompile(UsersSelfParamsSchema);
const validateUsersSelfResult = /* @__PURE__ */ lazyCompile(UsersSelfResultSchema);
const validateUsersLinkEmailParams = /* @__PURE__ */ lazyCompile(UsersLinkEmailParamsSchema);
const validateUsersLinkEmailResult = /* @__PURE__ */ lazyCompile(UsersLinkEmailResultSchema);
const validateUsersSetDisplayNameParams = /* @__PURE__ */ lazyCompile(UsersSetDisplayNameParamsSchema);
const validateUsersSetDisplayNameResult = /* @__PURE__ */ lazyCompile(UsersSetDisplayNameResultSchema);
const validateUsersSetAvatarParams = /* @__PURE__ */ lazyCompile(UsersSetAvatarParamsSchema);
const validateUsersSetAvatarResult = /* @__PURE__ */ lazyCompile(UsersSetAvatarResultSchema);
const validateAgentIdentityParams = /* @__PURE__ */ lazyCompile(AgentIdentityParamsSchema);
const validateAgentWaitParams = /* @__PURE__ */ lazyCompile(AgentWaitParamsSchema);
const validateWakeParams = /* @__PURE__ */ lazyCompile(WakeParamsSchema);
const validateAgentsListParams = /* @__PURE__ */ lazyCompile(AgentsListParamsSchema);
const validateProjectsListParams = /* @__PURE__ */ lazyCompile(ProjectsListParamsSchema);
const validateProjectsRegisterParams = /* @__PURE__ */ lazyCompile(ProjectsRegisterParamsSchema);
const validateProjectsAddParams = /* @__PURE__ */ lazyCompile(ProjectsAddParamsSchema);
const validateProjectsSearchRemoteParams = /* @__PURE__ */ lazyCompile(ProjectsSearchRemoteParamsSchema);
const validateProjectsRemoveParams = /* @__PURE__ */ lazyCompile(ProjectsRemoveParamsSchema);
const validateWorktreesListParams = /* @__PURE__ */ lazyCompile(WorktreesListParamsSchema);
const validateBoardGetParams = /* @__PURE__ */ lazyCompile(BoardGetParamsSchema);
const validateBoardUpdateParams = /* @__PURE__ */ lazyCompile(BoardUpdateParamsSchema);
const validateBoardWidgetContent = /* @__PURE__ */ lazyCompile(BoardWidgetContentSchema);
const validateBoardWidgetAppViewParams = /* @__PURE__ */ lazyCompile(BoardWidgetAppViewParamsSchema);
const validateBoardWidgetPutParams = /* @__PURE__ */ lazyCompile(BoardWidgetPutParamsSchema);
const validateBoardWidgetGrantParams = /* @__PURE__ */ lazyCompile(BoardWidgetGrantParamsSchema);
const validateBoardEventParams = /* @__PURE__ */ lazyCompile(BoardEventParamsSchema);
const validateBoardPromptAuthorizeParams = /* @__PURE__ */ lazyCompile(BoardPromptAuthorizeParamsSchema);
const validateBoardDataReadParams = /* @__PURE__ */ lazyCompile(BoardDataReadParamsSchema);
const validateBoardActionParams = /* @__PURE__ */ lazyCompile(BoardActionParamsSchema);
const validateWorktreesCreateParams = /* @__PURE__ */ lazyCompile(WorktreesCreateParamsSchema);
const validateWorktreesRemoveParams = /* @__PURE__ */ lazyCompile(WorktreesRemoveParamsSchema);
const validateWorktreesRestoreParams = /* @__PURE__ */ lazyCompile(WorktreesRestoreParamsSchema);
const validateWorktreesGcParams = /* @__PURE__ */ lazyCompile(WorktreesGcParamsSchema);
const validateWorktreesBranchesParams = /* @__PURE__ */ lazyCompile(WorktreesBranchesParamsSchema);
const validateFsListDirParams = /* @__PURE__ */ lazyCompile(FsListDirParamsSchema);
const validateFsListDirResult = /* @__PURE__ */ lazyCompile(FsListDirResultSchema);
const validateAgentsCreateParams = /* @__PURE__ */ lazyCompile(AgentsCreateParamsSchema);
const validateAgentsUpdateParams = /* @__PURE__ */ lazyCompile(AgentsUpdateParamsSchema);
const validateAgentsDeleteParams = /* @__PURE__ */ lazyCompile(AgentsDeleteParamsSchema);
const validateAgentsFilesListParams = /* @__PURE__ */ lazyCompile(AgentsFilesListParamsSchema);
const validateAgentsFilesGetParams = /* @__PURE__ */ lazyCompile(AgentsFilesGetParamsSchema);
const validateAgentsFilesSetParams = /* @__PURE__ */ lazyCompile(AgentsFilesSetParamsSchema);
const validateAgentsWorkspaceListParams = /* @__PURE__ */ lazyCompile(AgentsWorkspaceListParamsSchema);
const validateAgentsWorkspaceGetParams = /* @__PURE__ */ lazyCompile(AgentsWorkspaceGetParamsSchema);
const validateArtifactsListParams = /* @__PURE__ */ lazyCompile(ArtifactsListParamsSchema);
const validateArtifactsGetParams = /* @__PURE__ */ lazyCompile(ArtifactsGetParamsSchema);
const validateArtifactsDownloadParams = /* @__PURE__ */ lazyCompile(ArtifactsDownloadParamsSchema);
const validateNodePairListParams = /* @__PURE__ */ lazyCompile(NodePairListParamsSchema);
const validateNodePairApproveParams = /* @__PURE__ */ lazyCompile(NodePairApproveParamsSchema);
const validateNodePairRejectParams = /* @__PURE__ */ lazyCompile(NodePairRejectParamsSchema);
const validateNodePairRemoveParams = /* @__PURE__ */ lazyCompile(NodePairRemoveParamsSchema);
const validateNodeRenameParams = /* @__PURE__ */ lazyCompile(NodeRenameParamsSchema);
const validateNodeListParams = /* @__PURE__ */ lazyCompile(NodeListParamsSchema);
const validateNodePluginToolsUpdateParams = /* @__PURE__ */ lazyCompile(NodePluginToolsUpdateParamsSchema);
const validateNodeSkillsUpdateParams = /* @__PURE__ */ lazyCompile(NodeSkillsUpdateParamsSchema);
const validateEnvironmentsCreateParams = /* @__PURE__ */ lazyCompile(EnvironmentsCreateParamsSchema);
const validateEnvironmentsDestroyParams = /* @__PURE__ */ lazyCompile(EnvironmentsDestroyParamsSchema);
const validateEnvironmentsListParams = /* @__PURE__ */ lazyCompile(EnvironmentsListParamsSchema);
const validateEnvironmentsStatusParams = /* @__PURE__ */ lazyCompile(EnvironmentsStatusParamsSchema);
const validatePortalListParams = /* @__PURE__ */ lazyCompile(PortalListParamsSchema);
const validatePortalOpenParams = /* @__PURE__ */ lazyCompile(PortalOpenParamsSchema);
const validatePortalCloseParams = /* @__PURE__ */ lazyCompile(PortalCloseParamsSchema);
const validateWorkerDesktopObserveParams = /* @__PURE__ */ lazyCompile(WorkerDesktopObserveParamsSchema);
const validateWorkerDesktopObserveResult = /* @__PURE__ */ lazyCompile(WorkerDesktopObserveResultSchema);
const validateWorkerDesktopLaunchParams = /* @__PURE__ */ lazyCompile(WorkerDesktopLaunchParamsSchema);
const validateWorkerDesktopLaunchResult = /* @__PURE__ */ lazyCompile(WorkerDesktopLaunchResultSchema);
const validateDesktopObserveParams = /* @__PURE__ */ lazyCompile(DesktopObserveParamsSchema);
const validateDesktopObserveResult = /* @__PURE__ */ lazyCompile(DesktopObserveResultSchema);
const validateDesktopLaunchParams = /* @__PURE__ */ lazyCompile(DesktopLaunchParamsSchema);
const validateSystemInfoParams = /* @__PURE__ */ lazyCompile(SystemInfoParamsSchema);
const validateSystemInfoResult = /* @__PURE__ */ lazyCompile(SystemInfoResultSchema);
const validateNodePendingAckParams = /* @__PURE__ */ lazyCompile(NodePendingAckParamsSchema);
const validateNodeDescribeParams = /* @__PURE__ */ lazyCompile(NodeDescribeParamsSchema);
const validateNodeInvokeParams = /* @__PURE__ */ lazyCompile(NodeInvokeParamsSchema);
const validateNodeInvokeResultParams = /* @__PURE__ */ lazyCompile(NodeInvokeResultParamsSchema);
const validateNodeInvokeProgressParams = /* @__PURE__ */ lazyCompile(NodeInvokeProgressParamsSchema);
const validateNodeEventParams = /* @__PURE__ */ lazyCompile(NodeEventParamsSchema);
const validateNodePresenceActivityPayload = /* @__PURE__ */ lazyCompile(NodePresenceActivityPayloadSchema);
const validateNodePendingDrainParams = /* @__PURE__ */ lazyCompile(NodePendingDrainParamsSchema);
const validateNodePendingEnqueueParams = /* @__PURE__ */ lazyCompile(NodePendingEnqueueParamsSchema);
const validatePushTestParams = /* @__PURE__ */ lazyCompile(PushTestParamsSchema);
const validateWebPushVapidPublicKeyParams = /* @__PURE__ */ lazyCompile(WebPushVapidPublicKeyParamsSchema);
const validateWebPushSubscribeParams = /* @__PURE__ */ lazyCompile(WebPushSubscribeParamsSchema);
const validateWebPushUnsubscribeParams = /* @__PURE__ */ lazyCompile(WebPushUnsubscribeParamsSchema);
const validateWebPushTestParams = /* @__PURE__ */ lazyCompile(WebPushTestParamsSchema);
const validateSecretsResolveParams = /* @__PURE__ */ lazyCompile(SecretsResolveParamsSchema);
const validateSecretsResolveResult = /* @__PURE__ */ lazyCompile(SecretsResolveResultSchema);
const validateSecretsStoreListParams = /* @__PURE__ */ lazyCompile(SecretsStoreListParamsSchema);
const validateSecretsStoreListResult = /* @__PURE__ */ lazyCompile(SecretsStoreListResultSchema);
const validateSecretsStoreSetParams = /* @__PURE__ */ lazyCompile(SecretsStoreSetParamsSchema);
const validateSecretsStoreDeleteParams = /* @__PURE__ */ lazyCompile(SecretsStoreDeleteParamsSchema);
const validateSecretsStoreMutationResult = /* @__PURE__ */ lazyCompile(SecretsStoreMutationResultSchema);
const validateSessionsListParams = /* @__PURE__ */ lazyCompile(SessionsListParamsSchema);
const validateSessionsCatalogListParams = /* @__PURE__ */ lazyCompile(SessionsCatalogListParamsSchema);
const validateSessionsCatalogReadParams = /* @__PURE__ */ lazyCompile(SessionsCatalogReadParamsSchema);
const validateSessionsCatalogContinueParams = /* @__PURE__ */ lazyCompile(SessionsCatalogContinueParamsSchema);
const validateSessionsCatalogArchiveParams = /* @__PURE__ */ lazyCompile(SessionsCatalogArchiveParamsSchema);
const validateSessionsCatalogStartTerminalParams = /* @__PURE__ */ lazyCompile(SessionsCatalogStartTerminalParamsSchema);
const validateSessionsSearchParams = /* @__PURE__ */ lazyCompile(SessionsSearchParamsSchema);
const validateSessionsCleanupParams = /* @__PURE__ */ lazyCompile(SessionsCleanupParamsSchema);
const validateSessionsPreviewParams = /* @__PURE__ */ lazyCompile(SessionsPreviewParamsSchema);
const validateSessionsDescribeParams = /* @__PURE__ */ lazyCompile(SessionsDescribeParamsSchema);
const validateSessionsResolveParams = /* @__PURE__ */ lazyCompile(SessionsResolveParamsSchema);
const validateSessionsFilesListParams = /* @__PURE__ */ lazyCompile(SessionsFilesListParamsSchema);
const validateSessionsFilesGetParams = /* @__PURE__ */ lazyCompile(SessionsFilesGetParamsSchema);
const validateSessionsFilesSetParams = /* @__PURE__ */ lazyCompile(SessionsFilesSetParamsSchema);
const validateSessionsFilesRevealParams = /* @__PURE__ */ lazyCompile(SessionsFilesRevealParamsSchema);
const validateSessionsDiffParams = /* @__PURE__ */ lazyCompile(SessionsDiffParamsSchema);
const validateSessionsCompanionAskParams = /* @__PURE__ */ lazyCompile(SessionsCompanionAskParamsSchema);
const validateSessionsCompanionStateParams = /* @__PURE__ */ lazyCompile(SessionsCompanionStateParamsSchema);
const validateSessionsCompanionResetParams = /* @__PURE__ */ lazyCompile(SessionsCompanionResetParamsSchema);
const validateSessionsObserverVisibilityParams = /* @__PURE__ */ lazyCompile(SessionsObserverVisibilityParamsSchema);
const validateSessionVisibilitySetParams = /* @__PURE__ */ lazyCompile(SessionVisibilitySetParamsSchema);
const validateSessionMembersListParams = /* @__PURE__ */ lazyCompile(SessionMembersListParamsSchema);
const validateSessionMemberAddParams = /* @__PURE__ */ lazyCompile(SessionMemberAddParamsSchema);
const validateSessionMemberRemoveParams = /* @__PURE__ */ lazyCompile(SessionMemberRemoveParamsSchema);
const validateSessionSuggestionsAddParams = /* @__PURE__ */ lazyCompile(SessionSuggestionsAddParamsSchema);
const validateSessionSuggestionsListParams = /* @__PURE__ */ lazyCompile(SessionSuggestionsListParamsSchema);
const validateSessionSuggestionsResolveParams = /* @__PURE__ */ lazyCompile(SessionSuggestionsResolveParamsSchema);
const validateSessionTypingParams = /* @__PURE__ */ lazyCompile(SessionTypingParamsSchema);
const validateSessionsCreateParams = /* @__PURE__ */ lazyCompile(SessionsCreateParamsSchema);
const validateSessionsRecoverParams = /* @__PURE__ */ lazyCompile(SessionsRecoverParamsSchema);
const validateSessionsSendParams = /* @__PURE__ */ lazyCompile(SessionsSendParamsSchema);
const validateSessionsSendReconcileParams = /* @__PURE__ */ lazyCompile(SessionsSendReconcileParamsSchema);
const validateSessionsSendReconcileResult = /* @__PURE__ */ lazyCompile(SessionsSendReconcileResultSchema);
const validateSessionsDispatchParams = /* @__PURE__ */ lazyCompile(SessionsDispatchParamsSchema);
const validateSessionsReclaimParams = /* @__PURE__ */ lazyCompile(SessionsReclaimParamsSchema);
const validateSessionsMessagesSubscribeParams = /* @__PURE__ */ lazyCompile(SessionsMessagesSubscribeParamsSchema);
const validateSessionsMessagesUnsubscribeParams = /* @__PURE__ */ lazyCompile(SessionsMessagesUnsubscribeParamsSchema);
const validateSessionsViewerPresenceSetParams = /* @__PURE__ */ lazyCompile(SessionsViewerPresenceSetParamsSchema);
const validateSessionsAbortParams = /* @__PURE__ */ lazyCompile(SessionsAbortParamsSchema);
const validateSessionsPatchParams = /* @__PURE__ */ lazyCompile(Type.Object({
	...SessionsPatchParamsSchema.properties,
	icon: Type.Optional(Type.Union([NonEmptyString, Type.Null()]))
}, { additionalProperties: false }));
const validateSessionsPatchManyParams = /* @__PURE__ */ lazyCompile(SessionsPatchManyParamsSchema);
const validateSessionsPluginPatchParams = /* @__PURE__ */ lazyCompile(SessionsPluginPatchParamsSchema);
const validateSessionsResetParams = /* @__PURE__ */ lazyCompile(SessionsResetParamsSchema);
const validateSessionsDeleteParams = /* @__PURE__ */ lazyCompile(SessionsDeleteParamsSchema);
const validateSessionsGroupsListParams = /* @__PURE__ */ lazyCompile(SessionsGroupsListParamsSchema);
const validateSessionsGroupsListResult = /* @__PURE__ */ lazyCompile(SessionsGroupsListResultSchema);
const validateSessionsGroupsPutParams = /* @__PURE__ */ lazyCompile(SessionsGroupsPutParamsSchema);
const validateSessionsGroupsRenameParams = /* @__PURE__ */ lazyCompile(SessionsGroupsRenameParamsSchema);
const validateSessionsGroupsDeleteParams = /* @__PURE__ */ lazyCompile(SessionsGroupsDeleteParamsSchema);
const validateSessionsGroupsMutationResult = /* @__PURE__ */ lazyCompile(SessionsGroupsMutationResultSchema);
const validateSessionsCompactParams = /* @__PURE__ */ lazyCompile(SessionsCompactParamsSchema);
const validateSessionsCompactionListParams = /* @__PURE__ */ lazyCompile(SessionsCompactionListParamsSchema);
const validateSessionsCompactionBranchParams = /* @__PURE__ */ lazyCompile(SessionsCompactionBranchParamsSchema);
const validateSessionsCompactionRestoreParams = /* @__PURE__ */ lazyCompile(SessionsCompactionRestoreParamsSchema);
const validateSessionsBranchesListParams = /* @__PURE__ */ lazyCompile(SessionsBranchesListParamsSchema);
const validateSessionsBranchesSwitchParams = /* @__PURE__ */ lazyCompile(SessionsBranchesSwitchParamsSchema);
const validateSessionsRewindParams = /* @__PURE__ */ lazyCompile(SessionsRewindParamsSchema);
const validateSessionsForkParams = /* @__PURE__ */ lazyCompile(SessionsForkParamsSchema);
const validateSessionsUsageParams = /* @__PURE__ */ lazyCompile(SessionsUsageParamsSchema);
const validateSessionDiscussionInfoParams = /* @__PURE__ */ lazyCompile(SessionDiscussionInfoParamsSchema);
const validateSessionDiscussionInfoResult = /* @__PURE__ */ lazyCompile(SessionDiscussionInfoResultSchema);
const validateSessionDiscussionOpenParams = /* @__PURE__ */ lazyCompile(SessionDiscussionOpenParamsSchema);
const validateSessionDiscussionOpenResult = /* @__PURE__ */ lazyCompile(SessionDiscussionOpenResultSchema);
const validateTaskSuggestionsListParams = /* @__PURE__ */ lazyCompile(TaskSuggestionsListParamsSchema);
const validateTaskSuggestionsCreateParams = /* @__PURE__ */ lazyCompile(TaskSuggestionsCreateParamsSchema);
const validateTaskSuggestionsAcceptParams = /* @__PURE__ */ lazyCompile(TaskSuggestionsAcceptParamsSchema);
const validateTaskSuggestionsDismissParams = /* @__PURE__ */ lazyCompile(TaskSuggestionsDismissParamsSchema);
const validateTasksListParams = /* @__PURE__ */ lazyCompile(TasksListParamsSchema);
const validateTasksGetParams = /* @__PURE__ */ lazyCompile(TasksGetParamsSchema);
const validateTasksCancelParams = /* @__PURE__ */ lazyCompile(TasksCancelParamsSchema);
const validateTasksRecoveryParams = /* @__PURE__ */ lazyCompile(TasksRecoveryParamsSchema);
const validateConfigGetParams = /* @__PURE__ */ lazyCompile(ConfigGetParamsSchema);
const validateConfigSetParams = /* @__PURE__ */ lazyCompile(ConfigSetParamsSchema);
const validateConfigApplyParams = /* @__PURE__ */ lazyCompile(ConfigApplyParamsSchema);
const validateConfigPatchParams = /* @__PURE__ */ lazyCompile(ConfigPatchParamsSchema);
const validateConfigSchemaParams = /* @__PURE__ */ lazyCompile(ConfigSchemaParamsSchema);
const validateConfigSchemaLookupParams = /* @__PURE__ */ lazyCompile(ConfigSchemaLookupParamsSchema);
const validateConfigSchemaLookupResult = /* @__PURE__ */ lazyCompile(ConfigSchemaLookupResultSchema);
const validateSystemAgentChatParams = /* @__PURE__ */ lazyCompile(SystemAgentChatParamsSchema);
const validateSystemAgentChatHistoryParams = /* @__PURE__ */ lazyCompile(SystemAgentChatHistoryParamsSchema);
const validateSystemChangesListParams = /* @__PURE__ */ lazyCompile(SystemChangesListParamsSchema);
const validateSystemAgentSetupDetectParams = /* @__PURE__ */ lazyCompile(SystemAgentSetupDetectParamsSchema);
const validateSystemAgentSetupVerifyParams = /* @__PURE__ */ lazyCompile(SystemAgentSetupVerifyParamsSchema);
const validateSystemAgentSetupActivateParams = /* @__PURE__ */ lazyCompile(SystemAgentSetupActivateParamsSchema);
const validateSystemAgentSetupAuthStartParams = /* @__PURE__ */ lazyCompile(SystemAgentSetupAuthStartParamsSchema);
const validateWizardStartParams = /* @__PURE__ */ lazyCompile(WizardStartParamsSchema);
const validateWizardNextParams = /* @__PURE__ */ lazyCompile(WizardNextParamsSchema);
const validateWizardCancelParams = /* @__PURE__ */ lazyCompile(WizardCancelParamsSchema);
const validateWizardStatusParams = /* @__PURE__ */ lazyCompile(WizardStatusParamsSchema);
const validateTalkModeParams = /* @__PURE__ */ lazyCompile(TalkModeParamsSchema);
const validateTalkCatalogParams = /* @__PURE__ */ lazyCompile(TalkCatalogParamsSchema);
const validateTalkConfigParams = /* @__PURE__ */ lazyCompile(TalkConfigParamsSchema);
const validateTalkConfigResult = /* @__PURE__ */ lazyCompile(TalkConfigResultSchema);
const validateTalkClientCreateParams = /* @__PURE__ */ lazyCompile(TalkClientCreateParamsSchema);
const validateTalkClientCreateResult = /* @__PURE__ */ lazyCompile(TalkClientCreateResultSchema);
const validateTalkClientCloseParams = /* @__PURE__ */ lazyCompile(TalkClientCloseParamsSchema);
const validateTalkClientMutationResult = /* @__PURE__ */ lazyCompile(TalkClientMutationResultSchema);
const validateTalkClientToolCallParams = /* @__PURE__ */ lazyCompile(TalkClientToolCallParamsSchema);
const validateTalkClientToolCallResult = /* @__PURE__ */ lazyCompile(TalkClientToolCallResultSchema);
const validateTalkClientTranscriptParams = /* @__PURE__ */ lazyCompile(TalkClientTranscriptParamsSchema);
const validateTalkClientSteerParams = /* @__PURE__ */ lazyCompile(TalkClientSteerParamsSchema);
const validateTalkSessionCreateParams = /* @__PURE__ */ lazyCompile(TalkSessionCreateParamsSchema);
const validateTalkSessionAppendAudioParams = /* @__PURE__ */ lazyCompile(TalkSessionAppendAudioParamsSchema);
const validateTalkSessionAcknowledgeMarkParams = /* @__PURE__ */ lazyCompile(TalkSessionAcknowledgeMarkParamsSchema);
const validateTalkSessionCancelOutputParams = /* @__PURE__ */ lazyCompile(TalkSessionCancelOutputParamsSchema);
const validateTalkSessionSteerParams = /* @__PURE__ */ lazyCompile(TalkSessionSteerParamsSchema);
const validateTalkSessionSubmitToolResultParams = /* @__PURE__ */ lazyCompile(TalkSessionSubmitToolResultParamsSchema);
const validateTalkSessionCloseParams = /* @__PURE__ */ lazyCompile(TalkSessionCloseParamsSchema);
const validateTalkSpeakParams = /* @__PURE__ */ lazyCompile(TalkSpeakParamsSchema);
const validateTtsSpeakParams = /* @__PURE__ */ lazyCompile(TtsSpeakParamsSchema);
const validateChannelsStatusParams = /* @__PURE__ */ lazyCompile(ChannelsStatusParamsSchema);
const validateChannelsPairingListParams = /* @__PURE__ */ lazyCompile(ChannelsPairingListParamsSchema);
const validateChannelsPairingApproveParams = /* @__PURE__ */ lazyCompile(ChannelsPairingApproveParamsSchema);
const validateChannelsPairingDismissParams = /* @__PURE__ */ lazyCompile(ChannelsPairingDismissParamsSchema);
const validateChannelsStartParams = /* @__PURE__ */ lazyCompile(ChannelsStartParamsSchema);
const validateChannelsStopParams = /* @__PURE__ */ lazyCompile(ChannelsStopParamsSchema);
const validateChannelsLogoutParams = /* @__PURE__ */ lazyCompile(ChannelsLogoutParamsSchema);
const validateModelsAuthLogoutParams = /* @__PURE__ */ lazyCompile(ModelsAuthLogoutParamsSchema);
const validateModelsAuthStatusParams = /* @__PURE__ */ lazyCompile(ModelsAuthStatusParamsSchema);
const validateModelsListParams = /* @__PURE__ */ lazyCompile(ModelsListParamsSchema);
const validateSkillsStatusParams = /* @__PURE__ */ lazyCompile(SkillsStatusParamsSchema);
const validateHooksStatusParams = /* @__PURE__ */ lazyCompile(HooksStatusParamsSchema);
const validateToolsCatalogParams = /* @__PURE__ */ lazyCompile(ToolsCatalogParamsSchema);
const validateToolsEffectiveParams = /* @__PURE__ */ lazyCompile(ToolsEffectiveParamsSchema);
const validateToolsInvokeParams = /* @__PURE__ */ lazyCompile(ToolsInvokeParamsSchema);
const validateSkillsBinsParams = /* @__PURE__ */ lazyCompile(SkillsBinsParamsSchema);
const validateSkillsInstallParams = /* @__PURE__ */ lazyCompile(SkillsInstallParamsSchema);
const validateSkillsUploadBeginParams = /* @__PURE__ */ lazyCompile(SkillsUploadBeginParamsSchema);
const validateSkillsUploadChunkParams = /* @__PURE__ */ lazyCompile(SkillsUploadChunkParamsSchema);
const validateSkillsUploadCommitParams = /* @__PURE__ */ lazyCompile(SkillsUploadCommitParamsSchema);
const validateSkillsUpdateParams = /* @__PURE__ */ lazyCompile(SkillsUpdateParamsSchema);
const validateSkillsSearchParams = /* @__PURE__ */ lazyCompile(SkillsSearchParamsSchema);
const validateSkillsDetailParams = /* @__PURE__ */ lazyCompile(SkillsDetailParamsSchema);
const validateSkillsCuratorStatusParams = /* @__PURE__ */ lazyCompile(SkillsCuratorStatusParamsSchema);
const validateSkillsCuratorActionParams = /* @__PURE__ */ lazyCompile(SkillsCuratorActionParamsSchema);
const validateSkillsProposalsListParams = /* @__PURE__ */ lazyCompile(SkillsProposalsListParamsSchema);
const validateSkillsProposalInspectParams = /* @__PURE__ */ lazyCompile(SkillsProposalInspectParamsSchema);
const validateSkillsProposalCreateParams = /* @__PURE__ */ lazyCompile(SkillsProposalCreateParamsSchema);
const validateSkillsProposalUpdateParams = /* @__PURE__ */ lazyCompile(SkillsProposalUpdateParamsSchema);
const validateSkillsProposalReviseParams = /* @__PURE__ */ lazyCompile(SkillsProposalReviseParamsSchema);
const validateSkillsProposalRequestRevisionParams = /* @__PURE__ */ lazyCompile(SkillsProposalRequestRevisionParamsSchema);
const validateSkillsProposalActionParams = /* @__PURE__ */ lazyCompile(SkillsProposalActionParamsSchema);
const validateSkillsProposalEvaluateParams = /* @__PURE__ */ lazyCompile(SkillsProposalEvaluateParamsSchema);
const validateSkillsProposalEventsListParams = /* @__PURE__ */ lazyCompile(SkillsProposalEventsListParamsSchema);
const validateSkillsSecurityVerdictsParams = /* @__PURE__ */ lazyCompile(SkillsSecurityVerdictsParamsSchema);
const validateSkillsSkillCardParams = /* @__PURE__ */ lazyCompile(SkillsSkillCardParamsSchema);
const validateCronListParams = /* @__PURE__ */ lazyCompile(CronListParamsSchema);
const validateCronStatusParams = /* @__PURE__ */ lazyCompile(CronStatusParamsSchema);
const validateCronGetParams = /* @__PURE__ */ lazyCompile(CronGetParamsSchema);
const validateCronAddParams = /* @__PURE__ */ lazyCompile(CronAddParamsSchema);
const validateCronUpdateParams = /* @__PURE__ */ lazyCompile(CronUpdateParamsSchema);
const validateCronRemoveParams = /* @__PURE__ */ lazyCompile(CronRemoveParamsSchema);
const validateCronRunParams = /* @__PURE__ */ lazyCompile(CronRunParamsSchema);
const validateCronRunsParams = /* @__PURE__ */ lazyCompile(CronRunsParamsSchema);
const validateCronScratchGetParams = /* @__PURE__ */ lazyCompile(CronScratchGetParamsSchema);
const validateCronScratchSetParams = /* @__PURE__ */ lazyCompile(CronScratchSetParamsSchema);
const validateDevicePairListParams = /* @__PURE__ */ lazyCompile(DevicePairListParamsSchema);
const validateDevicePairApproveParams = /* @__PURE__ */ lazyCompile(DevicePairApproveParamsSchema);
const validateDevicePairRejectParams = /* @__PURE__ */ lazyCompile(DevicePairRejectParamsSchema);
const validateDevicePairRemoveParams = /* @__PURE__ */ lazyCompile(DevicePairRemoveParamsSchema);
const validateDevicePairSetupCodeParams = /* @__PURE__ */ lazyCompile(DevicePairSetupCodeParamsSchema);
const validateDevicePairSetupStatusParams = /* @__PURE__ */ lazyCompile(DevicePairSetupStatusParamsSchema);
const validateDevicePairRenameParams = /* @__PURE__ */ lazyCompile(DevicePairRenameParamsSchema);
const validateDeviceTokenRotateParams = /* @__PURE__ */ lazyCompile(DeviceTokenRotateParamsSchema);
const validateDeviceTokenRevokeParams = /* @__PURE__ */ lazyCompile(DeviceTokenRevokeParamsSchema);
const validateScopeUpgradeRequest = /* @__PURE__ */ lazyCompile(ScopeUpgradeRequestSchema);
const validateScopeUpgradeWait = /* @__PURE__ */ lazyCompile(ScopeUpgradeWaitSchema);
const validateApprovalPresentation = /* @__PURE__ */ lazyCompile(ApprovalPresentationSchema);
const validateApprovalGetParams = /* @__PURE__ */ lazyCompile(ApprovalGetParamsSchema);
const validateApprovalHistoryParams = /* @__PURE__ */ lazyCompile(ApprovalHistoryParamsSchema);
const validateApprovalResolveParams = /* @__PURE__ */ lazyCompile(ApprovalResolveParamsSchema);
const validateExecApprovalsGetParams = /* @__PURE__ */ lazyCompile(ExecApprovalsGetParamsSchema);
const validateExecApprovalsSetParams = /* @__PURE__ */ lazyCompile(ExecApprovalsSetParamsSchema);
const validateExecApprovalGetParams = /* @__PURE__ */ lazyCompile(ExecApprovalGetParamsSchema);
const validateExecApprovalRequestParams = /* @__PURE__ */ lazyCompile(ExecApprovalRequestParamsSchema);
const validateExecApprovalResolveParams = /* @__PURE__ */ lazyCompile(ExecApprovalResolveParamsSchema);
const validateQuestionRequestParams = /* @__PURE__ */ lazyCompile(QuestionRequestParamsSchema);
const validateQuestionWaitAnswerParams = /* @__PURE__ */ lazyCompile(QuestionWaitAnswerParamsSchema);
const validateQuestionResolveParams = /* @__PURE__ */ lazyCompile(QuestionResolveParamsSchema);
const validateQuestionGetParams = /* @__PURE__ */ lazyCompile(QuestionGetParamsSchema);
const validateQuestionListParams = /* @__PURE__ */ lazyCompile(QuestionListParamsSchema);
const validatePluginApprovalRequestParams = /* @__PURE__ */ lazyCompile(PluginApprovalRequestParamsSchema);
const validatePluginApprovalResolveParams = /* @__PURE__ */ lazyCompile(PluginApprovalResolveParamsSchema);
const validatePluginsListParams = /* @__PURE__ */ lazyCompile(PluginsListParamsSchema);
const validatePluginsRefreshParams = /* @__PURE__ */ lazyCompile(PluginsRefreshParamsSchema);
const validatePluginsSearchParams = /* @__PURE__ */ lazyCompile(PluginsSearchParamsSchema);
const validatePluginsInstallParams = /* @__PURE__ */ lazyCompile(PluginsInstallParamsSchema);
const validatePluginsSetEnabledParams = /* @__PURE__ */ lazyCompile(PluginsSetEnabledParamsSchema);
const validatePluginsUninstallParams = /* @__PURE__ */ lazyCompile(PluginsUninstallParamsSchema);
const validatePluginsUiDescriptorsParams = /* @__PURE__ */ lazyCompile(PluginsUiDescriptorsParamsSchema);
const validatePluginsUiDescriptorsResult = /* @__PURE__ */ lazyCompile(PluginsUiDescriptorsResultSchema);
const validatePluginsSessionActionParams = /* @__PURE__ */ lazyCompile(PluginsSessionActionParamsSchema);
const validatePluginsSessionActionResult = /* @__PURE__ */ lazyCompile(PluginsSessionActionResultSchema);
const validateExecApprovalsNodeGetParams = /* @__PURE__ */ lazyCompile(ExecApprovalsNodeGetParamsSchema);
const validateExecApprovalsNodeSetParams = /* @__PURE__ */ lazyCompile(ExecApprovalsNodeSetParamsSchema);
const validateExecApprovalsNodeSnapshot = /* @__PURE__ */ lazyCompile(ExecApprovalsNodeSnapshotSchema);
const validateLogsTailParams = /* @__PURE__ */ lazyCompile(LogsTailParamsSchema);
const validateModelsProbeParams = /* @__PURE__ */ lazyCompile(ModelsProbeParamsSchema);
const validateChatHistoryParams = /* @__PURE__ */ lazyCompile(ChatHistoryParamsSchema);
const validateChatMetadataParams = /* @__PURE__ */ lazyCompile(ChatMetadataParamsSchema);
const validateChatMessageGetParams = /* @__PURE__ */ lazyCompile(ChatMessageGetParamsSchema);
const validateChatToolTitlesParams = /* @__PURE__ */ lazyCompile(ChatToolTitlesParamsSchema);
const validateChatSendParams = /* @__PURE__ */ lazyCompile(ChatSendParamsSchema);
const validateChatAbortParams = /* @__PURE__ */ lazyCompile(ChatAbortParamsSchema);
const validateChatInjectParams = /* @__PURE__ */ lazyCompile(ChatInjectParamsSchema);
const validateUpdateStatusParams = /* @__PURE__ */ lazyCompile(UpdateStatusParamsSchema);
const validateUpdateStatusResult = /* @__PURE__ */ lazyCompile(UpdateStatusResultSchema);
const validateUpdateHoldParams = /* @__PURE__ */ lazyCompile(UpdateHoldParamsSchema);
const validateUpdateHoldResult = /* @__PURE__ */ lazyCompile(UpdateHoldResultSchema);
const validateUpdateRunParams = /* @__PURE__ */ lazyCompile(UpdateRunParamsSchema);
const validateUiCommandParams = /* @__PURE__ */ lazyCompile(UiCommandParamsSchema);
const validateWebLoginStartParams = /* @__PURE__ */ lazyCompile(WebLoginStartParamsSchema);
const validateWebLoginWaitParams = /* @__PURE__ */ lazyCompile(WebLoginWaitParamsSchema);
//#endregion
export { validateConfigSchemaParams as $, SessionCatalogSchema as $_, validateWorkerHeartbeatParams as $a, WorkerTunnelStatusSchema as $c, SessionSuggestionSchema as $d, SessionsCompanionResetResultSchema as $f, validateSkillsProposalHistoryStatusParams as $g, BoardFocusTabCommandSchema as $h, validateTalkSessionAcknowledgeMarkParams as $i, ChannelsStartParamsSchema as $l, ModelsProbeResultSchema as $m, validateSecretsStoreSetParams as $n, SessionDiscussionInfoParamsSchema as $o, ChatToolTitlesParamsSchema as $p, validateSessionsReclaimParams as $r, NodePendingAckParamsSchema as $s, validateModelsProbeParams as $t, ArtifactsListParamsSchema as $u, validateBoardWidgetContent as A, validateTerminalResizeParams as A_, validateUsersSelfParams as Aa, DesktopSourceSchema as Ac, PROJECTS_LIST_DEFAULT_LIMIT as Ad, SessionFileContentEncodingSchema as Af, BoardWidgetPluginContentSchema as Ag, SkillsSkillCardParamsSchema as Ah, validateSkillsUploadChunkParams as Ai, SystemChangeKindSchema as Al, UpdateStatusResultSchema as Am, validatePortalCloseParams as An, PortalSummarySchema as Ao, SessionsRewindResultSchema as Ap, validateSessionsDeleteParams as Ar, QuestionRequestedEventSchema as As, validateEnvironmentsDestroyParams as At, WebLoginWaitParamsSchema as Au, PluginsSearchParamsSchema as Av, validateChatAbortParams as B, TerminalInputParamsSchema as B_, validateWebPushTestParams as Ba, EnvironmentsDestroyParamsSchema as Bc, ProjectsAddResultSchema as Bd, SessionsAbortParamsSchema as Bf, UiClosePaneCommandSchema as Bg, BOARD_CRON_JOB_ID_MAX_LENGTH as Bh, validateSystemInfoResult as Bi, WizardStatusResultSchema as Bl, AgentsFilesListParamsSchema as Bm, validateQuestionListParams as Bn, TaskSuggestionEventSchema as Bo, SessionsPatchMutationSchema as Bp, validateSessionsGroupsListParams as Br, WebPushSubscribeParamsSchema as Bs, validateExecApprovalsSetParams as Bt, AuditRunInspectResultSchema as Bu, lazyCompile as Bv, validateBoardActionParams as C, SessionApprovalEventSchema as C_, validateUpdateStatusParams as Ca, GatewaySuspendTaskBlockerSchema as Cc, WakeParamsSchema as Cd, SessionCompanionExchangeSchema as Cf, BoardWidgetGrantParamsSchema as Cg, SkillsProposalUpdateParamsSchema as Ch, validateSkillsProposalsListParams as Ci, SystemAgentSetupAuthStartParamsSchema as Cl, ConfigSetParamsSchema as Cm, validatePluginsSessionActionParams as Cn, PortalChangedEventSchema as Co, SessionsListParamsSchema as Cp, validateSessionsCompactionBranchParams as Cr, QuestionListParamsSchema as Cs, validateDevicePairRemoveParams as Ct, TalkSessionSteerParamsSchema as Cu, PluginSearchResultEntrySchema as Cv, validateBoardPromptAuthorizeParams as D, validateTerminalCloseParams as D_, validateUsersListParams as Da, DesktopLaunchParamsSchema as Dc, MigrationProtocolSchemas as Dd, SessionDiffScopeSchema as Df, BoardWidgetMcpAppPutContentSchema as Dg, SkillsSearchResultSchema as Dh, validateSkillsStatusParams as Di, SystemAgentSetupVerifyParamsSchema as Dl, UpdateRunParamsSchema as Dm, validatePluginsUiDescriptorsResult as Dn, PortalListResultSchema as Do, SessionsPreviewParamsSchema as Dp, validateSessionsCompanionResetParams as Dr, QuestionRequestParamsSchema as Ds, validateDeviceTokenRevokeParams as Dt, TtsSpeakParamsSchema as Du, PluginsListResultSchema as Dv, validateBoardGetParams as E, validateTerminalAttachParams as E_, validateUsersLinkEmailResult as Ea, FsListDirResultSchema as Ec, MAX_MEMORY_MIGRATION_ITEMS as Ed, SessionDiffFileStatusSchema as Ef, BoardWidgetMcpAppContentSchema as Eg, SkillsSearchParamsSchema as Eh, validateSkillsSkillCardParams as Ei, SystemAgentSetupDetectResultSchema as El, UpdateHoldResultSchema as Em, validatePluginsUiDescriptorsParams as En, PortalListParamsSchema as Eo, SessionsPluginPatchParamsSchema as Ep, validateSessionsCompanionAskParams as Er, QuestionRecordSchema as Es, validateDevicePairSetupStatusParams as Et, TalkSpeakResultSchema as Eu, PluginsListParamsSchema as Ev, validateChannelsPairingDismissParams as F, TerminalAttachResultSchema as F_, validateUsersSetDisplayNameResult as Fa, ExecApprovalsSetParamsSchema as Fc, ProjectRecentProjectSchema as Fd, SessionGroupSchema as Ff, BoardWidgetPutParamsSchema as Fg, SkillsUploadChunkParamsSchema as Fh, validateSystemAgentSetupAuthStartParams as Fi, WizardNextParamsSchema as Fl, AgentsDeleteParamsSchema as Fm, validateProjectsRegisterParams as Fn, TasksGetResultSchema as Fo, SessionsUsageParamsSchema as Fp, validateSessionsFilesListParams as Fr, QuestionStatusSchema as Fs, validateExecApprovalResolveParams as Ft, AuditRunIdentityPresentV1Schema as Fu, PluginsSetEnabledResultSchema as Fv, validateChatSendParams as G, TerminalSessionInfoSchema as G_, validateWizardStartParams as Ga, EnvironmentsStatusResultSchema as Gc, ProjectsRemoveParamsSchema as Gd, SessionsCleanupParamsSchema as Gf, UiNavigateCommandSchema as Gg, BoardCanvasDocumentSourceSchema as Gh, validateTalkClientMutationResult as Gi, TalkSessionAcknowledgeMarkParamsSchema as Gl, AgentsListResultSchema as Gm, validateScopeUpgradeRequest as Gn, TaskSuggestionsCreateParamsSchema as Go, SessionsCreateParamsSchema as Gp, validateSessionsListParams as Gr, NodeInvokeInputEventSchema as Gs, validateGatewaySuspendResumeParams as Gt, AuditActivityInboundMessageV1Schema as Gu, readSystemAgentInferenceUnavailableErrorDetails as Gv, validateChatInjectParams as H, TerminalOpenParamsSchema as H_, validateWebPushVapidPublicKeyParams as Ha, EnvironmentsListParamsSchema as Hc, ProjectsListResultSchema as Hd, SessionsBranchesListResultSchema as Hf, UiCommandResultSchema as Hg, BOARD_DATA_BINDING_ID_MAX_LENGTH as Hh, validateTalkClientCloseParams as Hi, COMMAND_DESCRIPTION_MAX_LENGTH as Hl, AgentsFilesSetParamsSchema as Hm, validateQuestionResolveParams as Hn, TaskSuggestionSchema as Ho, SessionsResolveParamsSchema as Hp, validateSessionsGroupsMutationResult as Hr, WebPushUnsubscribeParamsSchema as Hs, validateFsListDirParams as Ht, ExecutionIdentityContextV1Schema as Hu, SystemAgentErrorDetailCodes as Hv, validateChannelsPairingListParams as I, TerminalCloseParamsSchema as I_, validateWakeParams as Ia, EnvironmentStatusSchema as Ic, ProjectRecentSchema as Id, SessionObserverDigestSchema as If, BoardWidgetPutResultSchema as Ig, SkillsUploadCommitParamsSchema as Ih, validateSystemAgentSetupDetectParams as Ii, WizardNextResultSchema as Il, AgentsDeleteResultSchema as Im, validateProjectsRemoveParams as In, TasksListParamsSchema as Io, SESSIONS_PATCH_MANY_MAX_TARGETS as Ip, validateSessionsFilesRevealParams as Ir, QuestionWaitAnswerParamsSchema as Is, validateExecApprovalsGetParams as It, AuditRunIdentityUnknownV1Schema as Iu, PluginsUiDescriptorsParamsSchema as Iv, validateConfigApplyParams as J, SessionCatalogCapabilitiesSchema as J_, validateWorkerConnectRequestFrame as Ja, WorkerDesktopLaunchResultSchema as Jc, ProjectsSearchRemoteResultSchema as Jd, SessionsCompactionListParamsSchema as Jf, UiSplitCommandSchema as Jg, BoardCommandEventSchema as Jh, validateTalkClientToolCallResult as Ji, ChannelsPairingDismissParamsSchema as Jl, AuthProbeStatusSchema as Jm, validateSecretsResolveResult as Jn, TaskSuggestionsDismissResultSchema as Jo, ChatInjectParamsSchema as Jp, validateSessionsObserverVisibilityParams as Jr, NodeListParamsSchema as Js, validateLogsTailParams as Jt, AuditActivityOutboundMessageV1Schema as Ju, buildClawHubTrustErrorDetails as Jv, validateChatToolTitlesParams as K, TerminalUploadParamsSchema as K_, validateWizardStatusParams as Ka, WorkerDesktopAppIdSchema as Kc, ProjectsRemoveResultSchema as Kd, SessionsCompactParamsSchema as Kf, UiPanelCommandSchema as Kg, BoardChangedEventSchema as Kh, validateTalkClientSteerParams as Ki, ChannelsPairingApproveParamsSchema as Kl, AgentsUpdateParamsSchema as Km, validateScopeUpgradeWait as Kn, TaskSuggestionsCreateResultSchema as Ko, ChatEventSchema as Kp, validateSessionsMessagesSubscribeParams as Kr, NodeInvokeParamsSchema as Ks, validateGatewaySuspendStatusParams as Kt, AuditActivityListParamsSchema as Ku, readSystemAgentSessionInvalidatedErrorDetails as Kv, validateChannelsStartParams as L, TerminalDataEventSchema as L_, validateWebLoginStartParams as La, EnvironmentSummarySchema as Lc, ProjectRecordSchema as Ld, SessionObserverHealthSchema as Lf, BoardWidgetRemoveOpSchema as Lg, ToolsCatalogParamsSchema as Lh, validateSystemAgentSetupVerifyParams as Li, WizardStartParamsSchema as Ll, AgentsFileEntrySchema as Lm, validateProjectsSearchRemoteParams as Ln, TasksListResultSchema as Lo, SessionsPatchManyParamsSchema as Lp, validateSessionsFilesSetParams as Lr, QuestionWaitAnswerResultSchema as Ls, validateExecApprovalsNodeGetParams as Lt, AuditRunIdentityUnsupportedV1Schema as Lu, PluginsUiDescriptorsResultSchema as Lv, validateBoardWidgetPutParams as M, validateTerminalUploadResult as M_, validateUsersSetAvatarParams as Ma, ExecApprovalRequestParamsSchema as Mc, PROJECTS_LIST_MAX_IDENTITY_PROBES as Md, SessionFileKindSchema as Mf, BoardWidgetPluginPropsSchema as Mg, SkillsStatusParamsSchema as Mh, validateSystemAgentChatHistoryParams as Mi, SystemChangesListParamsSchema as Ml, AgentSummarySchema as Mm, validatePortalOpenParams as Mn, TasksCancelParamsSchema as Mo, SessionsSearchParamsSchema as Mp, validateSessionsDiffParams as Mr, QuestionResolveResultSchema as Ms, validateEnvironmentsStatusParams as Mt, AuditListParamsSchema as Mu, PluginsSessionActionParamsSchema as Mv, validateChannelsLogoutParams as N, TerminalAckResultSchema as N_, validateUsersSetAvatarResult as Na, ExecApprovalResolveParamsSchema as Nc, ProjectCheckoutSchema as Nd, SessionFilePreviewKindSchema as Nf, BoardWidgetPresentationSchema as Ng, SkillsUpdateParamsSchema as Nh, validateSystemAgentChatParams as Ni, SystemChangesListResultSchema as Nl, AgentsCreateParamsSchema as Nm, validateProjectsAddParams as Nn, TasksCancelResultSchema as No, SessionsSearchResultSchema as Np, validateSessionsDispatchParams as Nr, QuestionResolvedEventSchema as Ns, validateExecApprovalGetParams as Nt, AuditListResultSchema as Nu, PluginsSessionActionResultSchema as Nv, validateBoardUpdateParams as O, validateTerminalInputParams as O_, validateUsersPrefsGetParams as Oa, DesktopObserveParamsSchema as Oc, MigrationsMemoryApplyParamsSchema as Od, SessionFileBrowserEntrySchema as Of, BoardWidgetMoveOpSchema as Og, SkillsSecurityVerdictsParamsSchema as Oh, validateSkillsUpdateParams as Oi, SystemAgentSetupVerifyResultSchema as Ol, UpdateScheduleStateSchema as Om, validatePluginsUninstallParams as On, PortalOpenParamsSchema as Oo, SessionsResetParamsSchema as Op, validateSessionsCompanionStateParams as Or, QuestionRequestQuestionSchema as Os, validateDeviceTokenRotateParams as Ot, TtsSpeakResultSchema as Ou, PluginsRefreshParamsSchema as Ov, validateChannelsPairingApproveParams as P, TerminalAttachParamsSchema as P_, validateUsersSetDisplayNameParams as Pa, ExecApprovalsGetParamsSchema as Pc, ProjectRecentFolderSchema as Pd, SessionFileRelevanceSchema as Pf, BoardWidgetPutContentSchema as Pg, SkillsUploadBeginParamsSchema as Ph, validateSystemAgentSetupActivateParams as Pi, WizardCancelParamsSchema as Pl, AgentsCreateResultSchema as Pm, validateProjectsListParams as Pn, TasksGetParamsSchema as Po, SessionsSendParamsSchema as Pp, validateSessionsFilesGetParams as Pr, QuestionSchema as Ps, validateExecApprovalRequestParams as Pt, AuditRunIdentityAmbiguousV1Schema as Pu, PluginsSetEnabledParamsSchema as Pv, validateConfigSchemaLookupResult as Q, SessionCatalogPullRequestSummarySchema as Q_, validateWorkerDesktopObserveResult as Qa, WorkerEnvironmentStateSchema as Qc, SessionSuggestionResolutionSchema as Qd, SessionsCompanionResetParamsSchema as Qf, validateSkillsProposalHistoryScanParams as Qg, BoardEventParamsSchema as Qh, validateTalkModeParams as Qi, ChannelsLogoutParamsSchema as Ql, ModelsProbeParamsSchema as Qm, validateSecretsStoreMutationResult as Qn, SystemInfoResultSchema as Qo, ChatStatusEventSchema as Qp, validateSessionsPreviewParams as Qr, NodePairRemoveParamsSchema as Qs, validateModelsListParams as Qt, ArtifactsGetParamsSchema as Qu, validateChannelsStatusParams as R, TerminalEventSchema as R_, validateWebLoginWaitParams as Ra, EnvironmentsCreateParamsSchema as Rc, ProjectSummarySchema as Rd, SessionObserverPlanProgressSchema as Rf, BoardWidgetResizeOpSchema as Rg, ToolsEffectiveParamsSchema as Rh, validateSystemChangesListParams as Ri, WizardStartResultSchema as Rl, AgentsFilesGetParamsSchema as Rm, validatePushTestParams as Rn, TasksRecoveryParamsSchema as Ro, SessionsPatchManyResultSchema as Rp, validateSessionsForkParams as Rr, PushTestParamsSchema as Rs, validateExecApprovalsNodeSetParams as Rt, AuditRunIdentityV1Schema as Ru, PluginsUninstallParamsSchema as Rv, validateAuditRunInspectParams as S, PluginApprovalSeveritySchema as S_, validateUpdateRunParams as Sa, GatewaySuspendStatusRunningResultSchema as Sc, SendParamsSchema as Sd, SessionBranchSchema as Sf, BoardWidgetGeneratedIdentitySchema as Sg, SkillsProposalReviseParamsSchema as Sh, validateSkillsProposalUpdateParams as Si, SystemAgentSetupActivateResultSchema as Sl, ConfigSchemaResponseSchema as Sm, validatePluginsSearchParams as Sn, WorktreesRestoreParamsSchema as So, SessionsGroupsRenameParamsSchema as Sp, validateSessionsCompactParams as Sr, QuestionGetResultSchema as Ss, validateDevicePairRejectParams as St, TalkSessionOkResultSchema as Su, PluginSearchPackageSchema as Sv, validateBoardEventParams as T, TerminalApprovalSnapshotSchema as T_, validateUsersLinkEmailParams as Ta, FsListDirParamsSchema as Tc, validateMigrationsMemoryPlanParams as Td, SessionDiffFileSchema as Tf, BoardWidgetHtmlContentSchema as Tg, SkillsProposalsListResultSchema as Th, validateSkillsSecurityVerdictsParams as Ti, SystemAgentSetupDetectParamsSchema as Tl, UpdateHoldParamsSchema as Tm, validatePluginsSetEnabledParams as Tn, PortalCloseResultSchema as To, SessionsObserverVisibilityResultSchema as Tp, validateSessionsCompactionRestoreParams as Tr, QuestionOptionSchema as Ts, validateDevicePairSetupCodeParams as Tt, TalkSpeakParamsSchema as Tu, PluginsInstallResultSchema as Tv, validateChatMessageGetParams as U, TerminalOpenResultSchema as U_, validateWizardCancelParams as Ua, EnvironmentsListResultSchema as Uc, ProjectsRegisterParamsSchema as Ud, SessionsBranchesSwitchParamsSchema as Uf, UiCommandSchema as Ug, BOARD_WIDGET_TOOL_MAX_LENGTH as Uh, validateTalkClientCreateParams as Ui, CommandsListParamsSchema as Ul, AgentsFilesSetResultSchema as Um, validateQuestionWaitAnswerParams as Un, TaskSuggestionsAcceptParamsSchema as Uo, SessionsRecoverParamsSchema as Up, validateSessionsGroupsPutParams as Ur, WebPushVapidPublicKeyParamsSchema as Us, validateFsListDirResult as Ut, AuditActivityAgentRunV1Schema as Uu, buildSystemAgentInferenceUnavailableErrorDetails as Uv, validateChatHistoryParams as V, TerminalListResultSchema as V_, validateWebPushUnsubscribeParams as Va, EnvironmentsDestroyResultSchema as Vc, ProjectsListParamsSchema as Vd, SessionsBranchesListParamsSchema as Vf, UiCommandParamsSchema as Vg, BOARD_CRON_TRIGGER_PREFIX as Vh, validateTalkCatalogParams as Vi, WizardStepSchema as Vl, AgentsFilesListResultSchema as Vm, validateQuestionRequestParams as Vn, TaskSuggestionResolutionSchema as Vo, SessionsPatchParamsSchema as Vp, validateSessionsGroupsListResult as Vr, WebPushTestParamsSchema as Vs, validateExecutionIdentityContextV1 as Vt, DecisionReceiptV1Schema as Vu, SESSION_AGENT_ATTENTION_ICON_IDS as Vv, validateChatMetadataParams as W, TerminalResizeParamsSchema as W_, validateWizardNextParams as Wa, EnvironmentsStatusParamsSchema as Wc, ProjectsRegisterResultSchema as Wd, SessionsBranchesSwitchResultSchema as Wf, UiFocusCommandSchema as Wg, BoardActionParamsSchema as Wh, validateTalkClientCreateResult as Wi, CommandsListResultSchema as Wl, AgentsListParamsSchema as Wm, validateRequestFrame as Wn, TaskSuggestionsAcceptResultSchema as Wo, SessionsRecoverResultSchema as Wp, validateSessionsGroupsRenameParams as Wr, NodeEventResultSchema as Ws, validateGatewaySuspendPrepareParams as Wt, AuditActivityEventV1Schema as Wu, buildSystemAgentSessionInvalidatedErrorDetails as Wv, validateConfigPatchParams as X, SessionCatalogHostSchema as X_, validateWorkerDesktopLaunchResult as Xa, WorkerDesktopObserveResultSchema as Xc, SessionSuggestionActionSchema as Xd, SessionsCompanionAskParamsSchema as Xf, SkillsProposalHistoryScanResultSchema as Xg, BoardCronActionParamsSchema as Xh, validateTalkConfigParams as Xi, ChannelsPairingListParamsSchema as Xl, ModelsAuthStatusParamsSchema as Xm, validateSecretsStoreListParams as Xn, TaskSuggestionsListResultSchema as Xo, ChatRunStartupPhaseSchema as Xp, validateSessionsPatchParams as Xr, NodePairListParamsSchema as Xs, validateModelsAuthLogoutParams as Xt, ArtifactSummarySchema as Xu, readClawHubTrustErrorDetails as Xv, validateConfigGetParams as Y, SessionCatalogDescriptorSchema as Y_, validateWorkerDesktopLaunchParams as Ya, WorkerDesktopObserveParamsSchema as Yc, RemoteProjectSchema as Yd, SessionsCompactionRestoreParamsSchema as Yf, SkillsProposalHistoryScanParamsSchema as Yg, BoardCommandSchema as Yh, validateTalkClientTranscriptParams as Yi, ChannelsPairingDismissResultSchema as Yl, ModelsAuthLogoutParamsSchema as Ym, validateSecretsStoreDeleteParams as Yn, TaskSuggestionsListParamsSchema as Yo, ChatMetadataParamsSchema as Yp, validateSessionsPatchManyParams as Yr, NodePairApproveParamsSchema as Ys, validateMessageActionParams as Yt, AuditActivityToolActionV1Schema as Yu, isClawHubTrustErrorCode as Yv, validateConfigSchemaLookupParams as Z, SessionCatalogLocatorSchema as Z_, validateWorkerDesktopObserveParams as Za, WorkerEnvironmentMetadataSchema as Zc, SessionSuggestionEventSchema as Zd, SessionsCompanionAskResultSchema as Zf, SkillsProposalHistoryStatusParamsSchema as Zg, BoardDataReadParamsSchema as Zh, validateTalkConfigResult as Zi, ChannelsPairingListResultSchema as Zl, ModelsListParamsSchema as Zm, validateSecretsStoreListResult as Zn, SystemInfoParamsSchema as Zo, ChatSendParamsSchema as Zp, validateSessionsPluginPatchParams as Zr, NodePairRejectParamsSchema as Zs, validateModelsAuthStatusParams as Zt, ArtifactsDownloadParamsSchema as Zu, validateArtifactsDownloadParams as _, DeniedApprovalSnapshotSchema as __, validateToolsInvokeParams as _a, GatewaySuspendResumeParamsSchema as _c, ConversationTurnParamsSchema as _d, SessionSharingEventSchema as _f, BoardViewTicketSchema as _g, SkillsProposalInspectParamsSchema as _h, validateSkillsProposalEvaluateParams as _i, SystemAgentChatHistoryTurnSchema as _l, ConfigGetParamsSchema as _m, validatePluginApprovalRequestParams as _n, WorktreesGcResultSchema as _o, SessionsGroupsDeleteParamsSchema as _p, validateSessionsCatalogContinueParams as _r, SecretsStoreListResultSchema as _s, validateDesktopLaunchParams as _t, TalkSessionAppendAudioParamsSchema as _u, SessionVisibilitySchema as _v, validateAgentsDeleteParams as a, ApprovalDecisionSchema as a_, validateTalkSessionSubmitToolResultParams as aa, NodePluginToolsUpdateParamsSchema as ac, AgentsWorkspaceListResultSchema as ad, SessionSuggestionsResolveParamsSchema as af, BoardPromptAuthorizeParamsSchema as ag, SkillsCuratorStatusParamsSchema as ah, validateSessionsSendParams as ai, CronListParamsSchema as al, EventFrameSchema as am, validateNodeListParams as an, validateWorktreesCreateParams as ao, SessionsDiffParamsSchema as ap, validateSessionMemberAddParams as ar, SessionPlacementSchema as as, validateConversationTurnParams as at, TalkCatalogResultSchema as au, SessionsCatalogContinueResultSchema as av, validateAuditActivityListParams as b, PendingApprovalSnapshotSchema as b_, validateUpdateHoldParams as ba, GatewaySuspendStatusReadyResultSchema as bc, MessageActionParamsSchema as bd, SessionVisibilitySetResultSchema as bf, BoardWidgetContentSchema as bg, SkillsProposalRequestRevisionParamsSchema as bh, validateSkillsProposalRequestRevisionParams as bi, SystemAgentChatResultSchema as bl, ConfigSchemaLookupResultSchema as bm, validatePluginsListParams as bn, WorktreesRemoveParamsSchema as bo, SessionsGroupsMutationResultSchema as bp, validateSessionsCatalogStartTerminalParams as br, QuestionAnswersSchema as bs, validateDevicePairApproveParams as bt, TalkSessionCreateParamsSchema as bu, PluginCatalogEntrySchema as bv, validateAgentsFilesSetParams as c, ApprovalHistoryParamsSchema as c_, validateTaskSuggestionsCreateParams as ca, NodePresenceAliveReasonSchema as cc, AgentIdentityResultSchema as cd, SessionTypingParamsSchema as cf, BoardSnapshotSchema as cg, SkillsDetailResultSchema as ch, validateSessionsUsageParams as ci, CronRunsParamsSchema as cl, HelloOkSchema as cm, validateNodePairRejectParams as cn, validateWorktreesRemoveParams as co, SessionsFilesGetResultSchema as cp, validateSessionSuggestionsAddParams as cr, SessionsDispatchResultSchema as cs, validateCronListParams as ct, TalkClientCreateResultSchema as cu, SessionsCatalogListResultSchema as cv, validateAgentsWorkspaceGetParams as d, ApprovalPresentationSchema as d_, validateTasksCancelParams as da, HooksStatusParamsSchema as dc, ConversationListParamsSchema as dd, SessionMemberMutationResultSchema as df, BoardTabIdSchema as dg, SkillsProposalApplyResultSchema as dh, validateSkillsCuratorActionParams as di, CronScratchSetParamsSchema as dl, ShutdownEventSchema as dm, validateNodePendingDrainParams as dn, WorktreeRecordSchema as do, SessionsFilesRevealParamsSchema as dp, validateSessionTypingParams as dr, isCloudWorkerPlacementState as ds, validateCronRunsParams as dt, TalkClientToolCallParamsSchema as du, SessionsCatalogStartTerminalParamsSchema as dv, validateApprovalGetResult as e_, validateTalkSessionAppendAudioParams as ea, NodePendingDrainParamsSchema as ec, AgentsWorkspaceEntrySchema as ed, SessionSuggestionStateSchema as ef, BoardGetParamsSchema as eg, ModelsProbeTargetResultSchema as eh, validateSessionsRecoverParams as ei, CronAddParamsSchema as el, ChatToolTitlesResultSchema as em, validateNodeDescribeParams as en, validateWorkerLiveEventParams as eo, SessionsCompanionStateParamsSchema as ep, validateSendParams as er, SessionDiscussionInfoResultSchema as es, validateConfigSetParams as et, ChannelsStatusParamsSchema as eu, SessionCatalogSessionSchema as ev, validateAgentsWorkspaceListParams as f, ApprovalResolveParamsSchema as f_, validateTasksGetParams as fa, GatewaySuspendBlockerSchema as fc, ConversationListResultSchema as fd, SessionMemberRemoveParamsSchema as ff, BoardTabSchema as fg, SkillsProposalCreateParamsSchema as fh, validateSkillsCuratorStatusParams as fi, CronScratchSetResultSchema as fl, TickEventSchema as fm, validateNodePendingEnqueueParams as fn, WorktreeRepositoryStatusSchema as fo, SessionsFilesRevealResultSchema as fp, validateSessionVisibilitySetParams as fr, SecretStoreEntrySchema as fs, validateCronScratchGetParams as ft, TalkClientToolCallResultSchema as fu, SessionsCatalogStartTerminalResultSchema as fv, validateApprovalResolveParams as g, CancelledApprovalSnapshotSchema as g_, validateToolsEffectiveParams as ga, GatewaySuspendPrepareResultSchema as gc, ConversationTurnCancelResultSchema as gd, SessionSharingActionSchema as gf, BoardUpdateParamsSchema as gg, SkillsProposalEventsListResultSchema as gh, validateSkillsProposalCreateParams as gi, SystemAgentChatHistoryResultSchema as gl, ConfigApplyParamsSchema as gm, validateNodeSkillsUpdateParams as gn, WorktreesGcParamsSchema as go, SessionsForkResultSchema as gp, validateSessionsCatalogArchiveParams as gr, SecretsStoreListParamsSchema as gs, validateDecisionReceiptV1 as gt, TalkEventSchema as gu, SessionSharingRoleSchema as gv, validateApprovalPresentation as h, ApprovalTerminalReasonSchema as h_, validateToolsCatalogParams as ha, GatewaySuspendPrepareReadyResultSchema as hc, ConversationTurnCancelParamsSchema as hd, SessionMembersListResultSchema as hf, BoardTicketEventParamsSchema as hg, SkillsProposalEventsListParamsSchema as hh, validateSkillsProposalActionParams as hi, SystemAgentChatHistoryParamsSchema as hl, StateVersionSchema as hm, validateNodeRenameParams as hn, WorktreesCreateParamsSchema as ho, SessionsForkParamsSchema as hp, validateSessionsBranchesSwitchParams as hr, SecretsStoreDeleteParamsSchema as hs, validateCronUpdateParams as ht, TalkConfigResultSchema as hu, SessionToolOverridesSchema as hv, validateAgentsCreateParams as i, ApprovalAllowDecisionSchema as i_, validateTalkSessionSteerParams as ia, NodePluginToolDescriptorSchema as ic, AgentsWorkspaceListParamsSchema as id, SessionSuggestionsListResultSchema as if, BoardPluginActionParamsSchema as ig, SkillsCuratorActionResultSchema as ih, validateSessionsSearchParams as ii, CronJobSchema as il, ErrorShapeSchema as im, validateNodeInvokeResultParams as in, validateWorktreesBranchesParams as io, SessionsDescribeParamsSchema as ip, validateSessionDiscussionOpenResult as ir, SessionDiscussionStateSchema as is, validateConversationTurnCancelParams as it, TalkCatalogParamsSchema as iu, SessionsCatalogContinueParamsSchema as iv, validateBoardWidgetGrantParams as j, validateTerminalUploadParams as j_, validateUsersSelfResult as ja, ExecApprovalGetParamsSchema as jc, PROJECTS_LIST_MAX_CHECKOUTS_PER_PROJECT as jd, SessionFileEntrySchema as jf, BoardWidgetPluginKindSchema as jg, SkillsSkillCardResultSchema as jh, validateSkillsUploadCommitParams as ji, SystemChangeSourceSchema as jl, AgentKindSchema as jm, validatePortalListParams as jn, TaskSummarySchema as jo, SessionsSearchHitSchema as jp, validateSessionsDescribeParams as jr, QuestionResolveParamsSchema as js, validateEnvironmentsListParams as jt, AuditEventSchema as ju, PluginsSearchResultSchema as jv, validateBoardWidgetAppViewParams as k, validateTerminalOpenParams as k_, validateUsersPrefsSetParams as ka, DesktopObserveResultSchema as kc, MigrationsMemoryPlanParamsSchema as kd, SessionFileBrowserResultSchema as kf, BoardWidgetNameSchema as kg, SkillsSecurityVerdictsResultSchema as kh, validateSkillsUploadBeginParams as ki, SystemChangeEntrySchema as kl, UpdateStatusParamsSchema as km, validatePollParams as kn, PortalOpenResultSchema as ko, SessionsRewindParamsSchema as kp, validateSessionsCreateParams as kr, QuestionRequestResultSchema as ks, validateEnvironmentsCreateParams as kt, WebLoginStartParamsSchema as ku, PluginsRefreshResultSchema as kv, validateAgentsListParams as l, ApprovalHistoryResultSchema as l_, validateTaskSuggestionsDismissParams as la, NodeSkillDescriptorSchema as lc, AgentParamsSchema as ld, SessionTypingResultSchema as lf, BoardTabCreateOpSchema as lg, SkillsInstallParamsSchema as lh, validateSessionsViewerPresenceSetParams as li, CronScratchGetParamsSchema as ll, RequestFrameSchema as lm, validateNodePairRemoveParams as ln, validateWorktreesRestoreParams as lo, SessionsFilesListParamsSchema as lp, validateSessionSuggestionsListParams as lr, SessionsReclaimParamsSchema as ls, validateCronRemoveParams as lt, TalkClientMutationResultSchema as lu, SessionsCatalogReadParamsSchema as lv, validateApprovalHistoryParams as m, ApprovalSnapshotSchema as m_, validateTasksRecoveryParams as ma, GatewaySuspendPrepareParamsSchema as mc, ConversationSendResultSchema as md, SessionMembersListParamsSchema as mf, BoardTabsReorderOpSchema as mg, SkillsProposalEvaluateResultSchema as mh, validateSkillsInstallParams as mi, CronUpdateParamsSchema as ml, SnapshotSchema as mm, validateNodePresenceActivityPayload as mn, WorktreesBranchesResultSchema as mo, SessionsFilesSetResultSchema as mp, validateSessionsBranchesListParams as mr, SecretStoreSecretEntrySchema as ms, validateCronStatusParams as mt, TalkConfigParamsSchema as mu, SessionRowSchema as mv, validateAgentParams as n, validateApprovalResolveResult as n_, validateTalkSessionCloseParams as na, NodePendingEnqueueParamsSchema as nc, AgentsWorkspaceGetParamsSchema as nd, SessionSuggestionsAddResultSchema as nf, BoardMcpAppDescriptorSchema as ng, SkillProposalLifecycleEventSchema as nh, validateSessionsResolveParams as ni, CronDeclarativeAddResultSchema as nl, LogsTailResultSchema as nm, validateNodeInvokeParams as nn, validateWorkerSessionsSpawnParams as no, SessionsCreateResultSchema as np, validateSessionDiscussionInfoResult as nr, SessionDiscussionOpenParamsSchema as ns, validateConversationListParams as nt, ChannelsStopParamsSchema as nu, SessionsCatalogArchiveParamsSchema as nv, validateAgentsFilesGetParams as o, ApprovalGetParamsSchema as o_, validateTalkSpeakParams as oa, NodePresenceActivityPayloadSchema as oc, AgentEventSchema as od, SessionSuggestionsResolveResultSchema as of, BoardSetChatDockCommandSchema as og, SkillsCuratorStatusResultSchema as oh, validateSessionsSendReconcileParams as oi, CronRemoveParamsSchema as ol, GATEWAY_SERVER_CAPS as om, validateNodePairApproveParams as on, validateWorktreesGcParams as oo, SessionsDiffResultSchema as op, validateSessionMemberRemoveParams as or, SessionPlacementStateSchema as os, validateCronAddParams as ot, TalkClientCloseParamsSchema as ou, SessionsCatalogHostEventSchema as ov, validateApprovalGetParams as p, ApprovalResolveResultSchema as p_, validateTasksListParams as pa, GatewaySuspendPrepareBusyResultSchema as pc, ConversationSendParamsSchema as pd, SessionMemberSchema as pf, BoardTabUpdateOpSchema as pg, SkillsProposalEvaluateParamsSchema as ph, validateSkillsDetailParams as pi, CronStatusParamsSchema as pl, PresenceEntrySchema as pm, validateNodePluginToolsUpdateParams as pn, WorktreesBranchesParamsSchema as po, SessionsFilesSetParamsSchema as pp, validateSessionsAbortParams as pr, SecretStoreEnvEntrySchema as ps, validateCronScratchSetParams as pt, TalkClientTranscriptParamsSchema as pu, SessionCreatedActorSchema as pv, validateCommandsListParams as q, TerminalUploadResultSchema as q_, validateWorkerAdmissionHandshake as qa, WorkerDesktopLaunchParamsSchema as qc, ProjectsSearchRemoteParamsSchema as qd, SessionsCompactionBranchParamsSchema as qf, UiSidebarCommandSchema as qg, BoardChatDockSchema as qh, validateTalkClientToolCallParams as qi, ChannelsPairingApproveResultSchema as ql, AgentsUpdateResultSchema as qm, validateSecretsResolveParams as qn, TaskSuggestionsDismissParamsSchema as qo, ChatHistoryParamsSchema as qp, validateSessionsMessagesUnsubscribeParams as qr, NodeInvokeProgressParamsSchema as qs, validateHooksStatusParams as qt, AuditActivityListResultSchema as qu, ClawHubTrustErrorCodes as qv, validateAgentWaitParams as r, AllowedApprovalSnapshotSchema as r_, validateTalkSessionCreateParams as ra, NodePendingEnqueueResultSchema as rc, AgentsWorkspaceGetResultSchema as rd, SessionSuggestionsListParamsSchema as rf, BoardOpSchema as rg, SkillsCuratorActionParamsSchema as rh, validateSessionsRewindParams as ri, CronGetParamsSchema as rl, ConnectParamsSchema as rm, validateNodeInvokeProgressParams as rn, validateWorkerTranscriptCommitParams as ro, SessionsDeleteParamsSchema as rp, validateSessionDiscussionOpenParams as rr, SessionDiscussionOpenResultSchema as rs, validateConversationSendParams as rt, TalkAgentControlResultSchema as ru, SessionsCatalogArchiveResultSchema as rv, validateAgentsFilesListParams as s, ApprovalGetResultSchema as s_, validateTaskSuggestionsAcceptParams as sa, NodePresenceAlivePayloadSchema as sc, AgentIdentityParamsSchema as sd, SessionTypingEventSchema as sf, BoardSizeSchema as sg, SkillsDetailParamsSchema as sh, validateSessionsSendReconcileResult as si, CronRunParamsSchema as sl, GatewayFrameSchema as sm, validateNodePairListParams as sn, validateWorktreesListParams as so, SessionsFilesGetParamsSchema as sp, validateSessionMembersListParams as sr, SessionsDispatchParamsSchema as ss, validateCronGetParams as st, TalkClientCreateParamsSchema as su, SessionsCatalogListParamsSchema as sv, validateAgentIdentityParams as t, validateApprovalHistoryResult as t_, validateTalkSessionCancelOutputParams as ta, NodePendingDrainResultSchema as tc, AgentsWorkspaceFileSchema as td, SessionSuggestionsAddParamsSchema as tf, BoardLegacyEventParamsSchema as tg, SkillProposalEvaluationSchema as th, validateSessionsResetParams as ti, CronAddResultSchema as tl, LogsTailParamsSchema as tm, validateNodeEventParams as tn, validateWorkerSessionsSendParams as to, SessionsCompanionStateResultSchema as tp, validateSessionDiscussionInfoParams as tr, SessionDiscussionInfoSchema as ts, validateConnectParams as tt, ChannelsStatusResultSchema as tu, SessionCatalogTranscriptItemSchema as tv, validateAgentsUpdateParams as u, ApprovalKindSchema as u_, validateTaskSuggestionsListParams as ua, NodeSkillsUpdateParamsSchema as uc, ConversationListItemSchema as ud, SessionMemberAddParamsSchema as uf, BoardTabDeleteOpSchema as ug, SkillsProposalActionParamsSchema as uh, validateSkillsBinsParams as ui, CronScratchGetResultSchema as ul, ResponseFrameSchema as um, validateNodePendingAckParams as un, WorktreeBranchSchema as uo, SessionsFilesListResultSchema as up, validateSessionSuggestionsResolveParams as ur, SessionsReclaimResultSchema as us, validateCronRunParams as ut, TalkClientSteerParamsSchema as uu, SessionsCatalogReadResultSchema as uv, validateArtifactsGetParams as v, ExecApprovalPresentationSchema as v_, validateTtsSpeakParams as va, GatewaySuspendResumeResultSchema as vc, ConversationTurnReplySchema as vd, SessionSharingIdentitySchema as vf, BoardWidgetAppViewParamsSchema as vg, SkillsProposalInspectResultSchema as vh, validateSkillsProposalEventsListParams as vi, SystemAgentChatParamsSchema as vl, ConfigPatchParamsSchema as vm, validatePluginApprovalResolveParams as vn, WorktreesListParamsSchema as vo, SessionsGroupsListParamsSchema as vp, validateSessionsCatalogListParams as vr, SecretsStoreMutationResultSchema as vs, validateDesktopObserveParams as vt, TalkSessionCancelOutputParamsSchema as vu, SessionClassificationSchema as vv, validateBoardDataReadParams as w, SessionApprovalReplaySchema as w_, validateUpdateStatusResult as wa, FsDirEntrySchema as wc, validateMigrationsMemoryApplyParams as wd, SessionDiffCommitSchema as wf, BoardWidgetHeightModeSchema as wg, SkillsProposalsListParamsSchema as wh, validateSkillsSearchParams as wi, SystemAgentSetupAuthStartResultSchema as wl, UpdateAvailableSchema as wm, validatePluginsSessionActionResult as wn, PortalCloseParamsSchema as wo, SessionsObserverVisibilityParamsSchema as wp, validateSessionsCompactionListParams as wr, QuestionListResultSchema as ws, validateDevicePairRenameParams as wt, TalkSessionSubmitToolResultParamsSchema as wu, PluginsInstallParamsSchema as wv, validateAuditListParams as x, PluginApprovalPresentationSchema as x_, validateUpdateHoldResult as xa, GatewaySuspendStatusResultSchema as xc, PollParamsSchema as xd, SESSION_OBSERVER_HEALTH_VALUES as xf, BoardWidgetDeclaredSchema as xg, SkillsProposalRequestRevisionResultSchema as xh, validateSkillsProposalReviseParams as xi, SystemAgentSetupActivateParamsSchema as xl, ConfigSchemaParamsSchema as xm, validatePluginsRefreshParams as xn, WorktreesRemoveResultSchema as xo, SessionsGroupsPutParamsSchema as xp, validateSessionsCleanupParams as xr, QuestionGetParamsSchema as xs, validateDevicePairListParams as xt, TalkSessionCreateResultSchema as xu, PluginCatalogInstallActionSchema as xv, validateArtifactsListParams as y, ExpiredApprovalSnapshotSchema as y_, validateUiCommandParams as ya, GatewaySuspendStatusParamsSchema as yc, ConversationTurnResultSchema as yd, SessionVisibilitySetParamsSchema as yf, BoardWidgetAppViewResultSchema as yg, SkillsProposalRecordResultSchema as yh, validateSkillsProposalInspectParams as yi, SystemAgentChatQuestionSchema as yl, ConfigSchemaLookupParamsSchema as ym, validatePluginsInstallParams as yn, WorktreesListResultSchema as yo, SessionsGroupsListResultSchema as yp, validateSessionsCatalogReadParams as yr, SecretsStoreSetParamsSchema as ys, validateDesktopObserveResult as yt, TalkSessionCloseParamsSchema as yu, SessionPeerKindSchema as yv, validateChannelsStopParams as z, TerminalExitEventSchema as z_, validateWebPushSubscribeParams as za, EnvironmentsCreateResultSchema as zc, ProjectsAddParamsSchema as zd, SessionWorktreeInfoSchema as zf, BoardWidgetSchema as zg, ToolsInvokeParamsSchema as zh, validateSystemInfoParams as zi, WizardStatusParamsSchema as zl, AgentsFilesGetResultSchema as zm, validateQuestionGetParams as zn, TasksRecoveryResultSchema as zo, SessionsPatchManyTargetSchema as zp, validateSessionsGroupsDeleteParams as zr, PushTestResultSchema as zs, validateExecApprovalsNodeSnapshot as zt, AuditRunInspectParamsSchema as zu, PluginsUninstallResultSchema as zv };
