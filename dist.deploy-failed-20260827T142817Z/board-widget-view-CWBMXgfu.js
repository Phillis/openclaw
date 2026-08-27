import { o as resolveSessionStorePathCore } from "./paths-B2oibYbs.js";
import { r as getRuntimeConfig } from "./io-D1h6pxaD.js";
import { l as runSqliteDeferredTransactionSync, u as runSqliteImmediateTransactionSync } from "./node-sqlite-sCL6pEgr.js";
import { _ as getNodeSqliteKysely, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-D5QeoU_L.js";
import { g as openOpenClawAgentDatabase, v as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-CyHApqW_.js";
import { A as resolveOpenClawAgentSqlitePath, E as listOpenClawRegisteredAgentDatabases, y as ensureOpenClawAgentBoardSchemaInTransaction } from "./openclaw-agent-db-maintenance-1xIPEKIN.js";
import { n as resolveSessionStoreAgentId, r as resolveSessionStoreKey } from "./session-store-key-CoZdm5gl.js";
import { t as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DTj1P3q4.js";
import { r as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-CgxvSLWw.js";
import { r as buildSandboxHostPath } from "./sandbox-host-B8_dlG6f.js";
import { a as BoardValidationError, c as normalizeBoardLayout, i as BOARD_SIZE_PRESETS, o as applyBoardOps, r as normalizeBoardWidgetDeclared, s as insertBoardWidget, t as boardDeclarationIsSubset } from "./board-capabilities-D21FluIN.js";
import { a as verifyBoardViewTicket } from "./board-view-ticket-BF1ZeJAn.js";
import { createHash, randomBytes } from "node:crypto";
//#region src/gateway/board-sandbox.ts
function grantedConnectOrigins(document) {
	if (document.grantState !== "granted") return;
	const origins = document.declared?.netOrigins;
	return origins?.length ? origins : void 0;
}
function buildBoardWidgetSandboxPath(document) {
	const connectDomains = grantedConnectOrigins(document);
	return buildSandboxHostPath({
		blockDescendantFrames: true,
		...connectDomains ? { connectDomains } : {}
	});
}
/** Defense in depth for direct/legacy widget document loads outside the proxy host. */
function buildBoardWidgetContentSecurityPolicy(document) {
	return [
		"default-src 'none'",
		"script-src 'unsafe-inline'",
		"style-src 'unsafe-inline'",
		"img-src data:",
		`connect-src ${grantedConnectOrigins(document)?.join(" ") ?? "'none'"}`,
		"webrtc 'block'",
		"base-uri 'none'",
		"object-src 'none'",
		"form-action 'none'",
		"frame-src 'none'",
		"sandbox allow-scripts"
	].join("; ");
}
//#endregion
//#region src/boards/board-store.ts
const BOARD_MAX_WIDGETS = 48;
const BOARD_MAX_WIDGET_HTML_BYTES = 256 * 1024;
const BOARD_MAX_WIDGET_PLUGIN_PROPS_BYTES = 8 * 1024;
function cloneBoardSnapshot(snapshot) {
	return {
		sessionKey: snapshot.sessionKey,
		revision: snapshot.revision,
		tabs: snapshot.tabs.map((tab) => ({ ...tab })),
		widgets: snapshot.widgets.map((widget) => ({
			...widget,
			...widget.props !== void 0 ? { props: structuredClone(widget.props) } : {},
			...widget.declaredSummary !== void 0 ? { declaredSummary: [...widget.declaredSummary] } : {},
			...widget.declared !== void 0 ? { declared: {
				...widget.declared.netOrigins ? { netOrigins: [...widget.declared.netOrigins] } : {},
				...widget.declared.tools ? { tools: [...widget.declared.tools] } : {}
			} } : {}
		}))
	};
}
function createBoardDeclaredSummary(declared) {
	const lines = [...(declared?.netOrigins ?? []).map((origin) => `Network access: ${origin}`), ...(declared?.tools ?? []).map((tool) => `Tool access: ${tool}`)];
	return lines.length > 0 ? lines : void 0;
}
function generatedIdentityMatches(left, right) {
	return left?.kind === "generated" && left.source === right.source && left.key === right.key;
}
function resolveBoardWidgetPutParams(prior, params, nameIdentities) {
	const generatedIdentity = params.generatedIdentity;
	if (!generatedIdentity) return params;
	if (generatedIdentity.fallbackName === params.name) throw new BoardValidationError("invalid_operation", "generated widget fallback name must differ from its preferred name");
	const marker = {
		kind: "generated",
		source: generatedIdentity.source,
		key: generatedIdentity.key
	};
	const existingGenerated = prior.widgets.find((widget) => generatedIdentityMatches(nameIdentities.get(widget.name), marker));
	if (existingGenerated) return {
		...params,
		name: existingGenerated.name
	};
	if (!prior.widgets.find((widget) => widget.name === params.name)) return params;
	if (prior.widgets.find((widget) => widget.name === generatedIdentity.fallbackName)) throw new BoardValidationError("conflict", `generated widget fallback name is already in use: ${generatedIdentity.fallbackName}`);
	return {
		...params,
		name: generatedIdentity.fallbackName
	};
}
function normalizeBoardWidgetPutParams(params, sessionKey = params.sessionKey) {
	const declared = normalizeBoardWidgetDeclared(params.declared);
	const canonical = {
		...params,
		sessionKey
	};
	if (declared) canonical.declared = declared;
	else delete canonical.declared;
	return canonical;
}
function createBoardWidgetPutResult(snapshot, resolvedWidgetName) {
	return {
		...cloneBoardSnapshot(snapshot),
		resolvedWidgetName
	};
}
function validatePluginContent(params) {
	if (params.content.kind !== "plugin") return;
	if (params.declared !== void 0) throw new BoardValidationError("invalid_operation", "trusted plugin widgets do not accept sandbox capability declarations");
	if (Buffer.byteLength(JSON.stringify(params.content.props ?? {}), "utf8") > BOARD_MAX_WIDGET_PLUGIN_PROPS_BYTES) throw new BoardValidationError("invalid_operation", `board plugin widget props exceed ${BOARD_MAX_WIDGET_PLUGIN_PROPS_BYTES} UTF-8 bytes`);
}
function createBoardWidgetPutSnapshot(prior, params, context) {
	validatePluginContent(params);
	if (params.content.kind === "html" && Buffer.byteLength(params.content.html, "utf8") > BOARD_MAX_WIDGET_HTML_BYTES) throw new BoardValidationError("invalid_operation", `board widget HTML exceeds ${BOARD_MAX_WIDGET_HTML_BYTES} UTF-8 bytes`);
	let layout = normalizeBoardLayout(prior);
	if (layout.tabs.length === 0) layout.tabs.push({
		tabId: "main",
		title: "Main",
		position: 0,
		chatDock: "right"
	});
	const existing = layout.widgets.find((widget) => widget.name === params.name);
	if (!existing && layout.widgets.length >= BOARD_MAX_WIDGETS) throw new BoardValidationError("invalid_operation", `board cannot contain more than ${BOARD_MAX_WIDGETS} widgets`);
	const tabId = params.placement?.tabId ?? existing?.tabId ?? layout.tabs[0].tabId;
	if (!layout.tabs.some((tab) => tab.tabId === tabId)) throw new BoardValidationError("not_found", `board tab not found: ${tabId}`);
	const size = BOARD_SIZE_PRESETS[params.placement?.size ?? "md"];
	const widgetRevision = (existing?.revision ?? 0) + 1;
	const declared = params.content.kind === "plugin" ? void 0 : normalizeBoardWidgetDeclared(params.declared);
	const declaredSummary = createBoardDeclaredSummary(declared);
	const contentSha256 = params.content.kind === "html" ? createHash("sha256").update(params.content.html).digest("hex") : void 0;
	const preservesGrant = declared !== void 0 && context.grantScopeMatches && (params.content.kind !== "mcp-app" || params.content.interactive) && existing?.grantState === "granted" && (params.content.kind === "html" ? contentSha256 === context.grantedSha256 : true) && boardDeclarationIsSubset(declared, existing.declared);
	layout = insertBoardWidget(layout, {
		name: params.name,
		tabId,
		...params.title !== void 0 ? { title: params.title } : existing?.title !== void 0 ? { title: existing.title } : {},
		contentKind: params.content.kind,
		...params.presentation !== void 0 ? { presentation: params.presentation } : existing?.presentation !== void 0 ? { presentation: existing.presentation } : {},
		...params.heightMode !== void 0 ? { heightMode: params.heightMode } : existing?.heightMode !== void 0 ? { heightMode: existing.heightMode } : {},
		...params.content.kind === "plugin" ? {
			pluginKind: params.content.pluginKind,
			...params.content.props !== void 0 ? { props: structuredClone(params.content.props) } : {}
		} : {},
		sizeW: params.placement?.size ? size.sizeW : existing?.sizeW ?? size.sizeW,
		sizeH: params.placement?.size ? size.sizeH : existing?.sizeH ?? size.sizeH,
		position: existing?.position ?? layout.widgets.length,
		grantState: params.content.kind === "plugin" ? "none" : preservesGrant ? "granted" : params.content.kind === "mcp-app" && !params.content.interactive ? "none" : declaredSummary || params.content.kind === "mcp-app" ? "pending" : "none",
		revision: widgetRevision,
		...params.content.kind !== "plugin" ? { instanceId: context.instanceId } : {},
		...declaredSummary ? { declaredSummary } : {},
		...declared ? { declared } : {}
	}, {
		tabId,
		...params.placement?.after ? { after: params.placement.after } : {},
		move: params.placement?.tabId !== void 0 || params.placement?.after !== void 0
	});
	if (!declaredSummary) {
		const widget = layout.widgets.find((candidate) => candidate.name === params.name);
		delete widget.declaredSummary;
		delete widget.declared;
	}
	return {
		sessionKey: params.sessionKey,
		revision: prior.revision + 1,
		...layout
	};
}
function createBoardGrantSnapshot(current, name, decision, revision, instanceId) {
	const widget = current.widgets.find((candidate) => candidate.name === name);
	if (!widget) throw new BoardValidationError("not_found", `board widget not found: ${name}`);
	if (widget.revision !== revision) throw new BoardValidationError("conflict", `board widget revision changed: ${name} is revision ${widget.revision}, not ${revision}`);
	if (widget.instanceId !== void 0 && widget.instanceId !== instanceId) throw new BoardValidationError("conflict", `board widget instance changed: ${name}`);
	if (widget.grantState !== "pending") throw new BoardValidationError("invalid_operation", `board widget grant is not pending: ${name}`);
	const snapshot = cloneBoardSnapshot(current);
	snapshot.widgets.find((candidate) => candidate.name === name).grantState = decision;
	snapshot.revision += 1;
	return snapshot;
}
//#endregion
//#region src/boards/sqlite-board-codec.ts
const BOARD_WIDGET_SNAPSHOT_COLUMNS = [
	"session_key",
	"name",
	"tab_id",
	"title",
	"content_kind",
	"descriptor_json",
	"sha256",
	"view_generation",
	"revision",
	"size_w",
	"size_h",
	"position",
	"manifest",
	"grant_state",
	"granted_sha",
	"created_by",
	"created_at",
	"updated_at"
];
const BOARD_GRANT_SEMANTICS_VERSION = 2;
function parseManifest(value) {
	const parsed = JSON.parse(value);
	const netOrigins = Array.isArray(parsed.netOrigins) ? parsed.netOrigins.filter((entry) => typeof entry === "string") : void 0;
	const tools = Array.isArray(parsed.tools) ? parsed.tools.filter((entry) => typeof entry === "string") : void 0;
	const mcpAppInteractive = typeof parsed.mcpAppInteractive === "boolean" ? parsed.mcpAppInteractive : void 0;
	const mcpAppInstanceId = typeof parsed.mcpAppInstanceId === "string" && /^[a-f0-9]{32}$/u.test(parsed.mcpAppInstanceId) ? parsed.mcpAppInstanceId : void 0;
	const presentation = parsed.presentation === "card" || parsed.presentation === "full-bleed" || parsed.presentation === "frameless" ? parsed.presentation : void 0;
	const heightMode = parsed.heightMode === "auto" || parsed.heightMode === "fixed" ? parsed.heightMode : void 0;
	const nameIdentityPresent = Object.hasOwn(parsed, "nameIdentity");
	const nameIdentity = (() => {
		if (!parsed.nameIdentity || typeof parsed.nameIdentity !== "object" || Array.isArray(parsed.nameIdentity)) return;
		const identity = parsed.nameIdentity;
		if (identity.kind === "explicit") return { kind: "explicit" };
		if (identity.kind === "generated" && identity.source === "show_widget" && typeof identity.key === "string" && /^[a-f0-9]{64}$/u.test(identity.key)) return {
			kind: "generated",
			source: "show_widget",
			key: identity.key
		};
	})();
	try {
		const declared = normalizeBoardWidgetDeclared({
			...netOrigins?.length ? { netOrigins } : {},
			...tools?.length ? { tools } : {}
		});
		return {
			...declared ? { declared } : {},
			...parsed.grantSemanticsVersion === BOARD_GRANT_SEMANTICS_VERSION ? { grantSemanticsVersion: BOARD_GRANT_SEMANTICS_VERSION } : {},
			...presentation ? { presentation } : {},
			...heightMode ? { heightMode } : {},
			...nameIdentity ? { nameIdentity } : {},
			...!nameIdentity && nameIdentityPresent ? { nameIdentityInvalid: true } : {},
			...mcpAppInteractive !== void 0 ? { mcpAppInteractive } : {},
			...mcpAppInstanceId ? { mcpAppInstanceId } : {}
		};
	} catch (error) {
		if (error instanceof BoardValidationError) return { declarationInvalid: true };
		throw error;
	}
}
function serializeManifest(declared, grantState, mcpAppAuthority, widgetOptions, nameIdentity) {
	return JSON.stringify({
		...declared,
		...widgetOptions?.presentation ? { presentation: widgetOptions.presentation } : {},
		...widgetOptions?.heightMode ? { heightMode: widgetOptions.heightMode } : {},
		...nameIdentity ? { nameIdentity } : {},
		...grantState === "granted" ? { grantSemanticsVersion: BOARD_GRANT_SEMANTICS_VERSION } : {},
		...mcpAppAuthority ? {
			mcpAppInteractive: mcpAppAuthority.interactive,
			mcpAppInstanceId: mcpAppAuthority.instanceId
		} : {}
	});
}
function createBoardWidgetContentFields(params, frame, revision, grantState, viewGeneration, now) {
	const manifest = serializeManifest(params.declared, grantState, params.content.kind === "mcp-app" ? {
		interactive: params.content.interactive,
		instanceId: viewGeneration
	} : void 0, frame, params.generatedIdentity ? {
		kind: "generated",
		source: params.generatedIdentity.source,
		key: params.generatedIdentity.key
	} : { kind: "explicit" });
	if (params.content.kind === "html") {
		const sha256 = createHash("sha256").update(params.content.html).digest("hex");
		return {
			content_kind: "html",
			html: Buffer.from(params.content.html, "utf8"),
			descriptor_json: null,
			sha256,
			view_generation: viewGeneration,
			revision,
			manifest,
			grant_state: grantState,
			granted_sha: grantState === "granted" ? sha256 : null,
			updated_at: now
		};
	}
	if (params.content.kind === "plugin") {
		const descriptorJson = JSON.stringify({
			pluginKind: params.content.pluginKind,
			...params.content.props !== void 0 ? { props: params.content.props } : {}
		});
		return {
			content_kind: "plugin",
			html: null,
			descriptor_json: descriptorJson,
			sha256: createHash("sha256").update(descriptorJson).digest("hex"),
			view_generation: null,
			revision,
			manifest,
			grant_state: "none",
			granted_sha: null,
			updated_at: now
		};
	}
	const descriptorJson = JSON.stringify(params.content.descriptor);
	const sha256 = createHash("sha256").update(descriptorJson).digest("hex");
	return {
		content_kind: "mcp-app",
		html: null,
		descriptor_json: descriptorJson,
		sha256,
		view_generation: null,
		revision,
		manifest,
		grant_state: grantState,
		granted_sha: grantState === "granted" ? sha256 : null,
		updated_at: now
	};
}
function resolveSqliteBoardWidgetPutParams(snapshot, params, rows) {
	const identities = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const manifest = parseManifest(row.manifest);
		const nameIdentity = manifest.nameIdentity ?? (manifest.nameIdentityInvalid ? { kind: "invalid" } : void 0);
		if (nameIdentity) identities.set(row.name, nameIdentity);
	}
	return resolveBoardWidgetPutParams(snapshot, params, identities);
}
function updateManifestHeightMode(value, heightMode) {
	const parsed = JSON.parse(value);
	return JSON.stringify({
		...parsed,
		heightMode
	});
}
function effectiveGrantState(grantState, manifest) {
	if (manifest.declarationInvalid || !manifest.declared && manifest.mcpAppInteractive !== true) return grantState === "rejected" ? "rejected" : "none";
	if (grantState === "granted" && manifest.grantSemanticsVersion !== BOARD_GRANT_SEMANTICS_VERSION) return "pending";
	return grantState;
}
function parseDescriptor(value) {
	return JSON.parse(value);
}
function parsePluginContent(value) {
	return JSON.parse(value);
}
function rowToTab(row) {
	return {
		tabId: row.tab_id,
		title: row.title,
		position: row.position,
		chatDock: row.chat_dock
	};
}
function rowToWidget(row, manifest = parseManifest(row.manifest)) {
	const declared = manifest.declared;
	const declaredSummary = createBoardDeclaredSummary(declared);
	const pluginContent = row.content_kind === "plugin" && row.descriptor_json !== null ? parsePluginContent(row.descriptor_json) : void 0;
	const instanceId = row.content_kind === "mcp-app" ? manifest.mcpAppInstanceId : row.view_generation;
	return {
		name: row.name,
		tabId: row.tab_id,
		...row.title !== null ? { title: row.title } : {},
		contentKind: row.content_kind,
		...manifest.presentation ? { presentation: manifest.presentation } : {},
		...manifest.heightMode ? { heightMode: manifest.heightMode } : {},
		...pluginContent ? {
			pluginKind: pluginContent.pluginKind,
			...pluginContent.props !== void 0 ? { props: pluginContent.props } : {}
		} : {},
		sizeW: row.size_w,
		sizeH: row.size_h,
		position: row.position,
		grantState: effectiveGrantState(row.grant_state, manifest),
		revision: row.revision,
		...instanceId ? { instanceId } : {},
		...declaredSummary ? { declaredSummary } : {},
		...declared ? { declared } : {}
	};
}
function rowToHtmlViewMetadata(row, manifest) {
	if (row.content_kind !== "html" || row.view_generation === null) return;
	const declared = manifest.declared;
	return {
		revision: row.revision,
		sha256: row.sha256,
		viewGeneration: row.view_generation,
		grantState: effectiveGrantState(row.grant_state, manifest),
		...declared ? { declared } : {}
	};
}
//#endregion
//#region src/boards/sqlite-board-store.ts
const ensuredBoardDatabases = /* @__PURE__ */ new WeakSet();
const presentBoardDatabases = /* @__PURE__ */ new WeakSet();
function boardTablesPresent(database) {
	if (ensuredBoardDatabases.has(database.db) || presentBoardDatabases.has(database.db)) return true;
	if (!database.db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'board_widgets'").get()) return false;
	presentBoardDatabases.add(database.db);
	return true;
}
function ensureBoardSchema(database) {
	if (ensuredBoardDatabases.has(database.db)) return;
	if (database.db.isTransaction) throw new Error("board schema must be ensured before the write transaction starts");
	runSqliteImmediateTransactionSync(database.db, () => ensureOpenClawAgentBoardSchemaInTransaction(database.db), {
		databaseLabel: database.path,
		operationLabel: "board.ensure-schema"
	});
	ensuredBoardDatabases.add(database.db);
	presentBoardDatabases.add(database.db);
}
function readStoredBoard(database, sessionKey) {
	return runSqliteDeferredTransactionSync(database.db, () => {
		const db = getNodeSqliteKysely(database.db);
		const tabRows = executeSqliteQuerySync(database.db, db.selectFrom("board_tabs").selectAll().where("session_key", "=", sessionKey).orderBy("position", "asc").orderBy("tab_id", "asc")).rows;
		const admittedWidgetRows = executeSqliteQuerySync(database.db, db.selectFrom("board_widgets").select(BOARD_WIDGET_SNAPSHOT_COLUMNS).where("session_key", "=", sessionKey).orderBy("tab_id", "asc").orderBy("position", "asc").orderBy("name", "asc")).rows.map((row) => ({
			row,
			manifest: parseManifest(row.manifest)
		})).filter(({ row, manifest }) => {
			if (row.content_kind !== "mcp-app") return true;
			return manifest.mcpAppInteractive !== void 0 && manifest.mcpAppInstanceId !== void 0;
		});
		const htmlViewMetadata = /* @__PURE__ */ new Map();
		for (const { row, manifest } of admittedWidgetRows) {
			const metadata = rowToHtmlViewMetadata(row, manifest);
			if (metadata) htmlViewMetadata.set(row.name, metadata);
		}
		const layout = normalizeBoardLayout({
			tabs: tabRows.map(rowToTab),
			widgets: admittedWidgetRows.map(({ row, manifest }) => rowToWidget(row, manifest))
		});
		return {
			snapshot: {
				sessionKey,
				revision: tabRows.reduce((revision, row) => Math.max(revision, row.revision), 0),
				...layout
			},
			tabRows,
			widgetRows: admittedWidgetRows.map(({ row }) => row),
			htmlViewMetadata
		};
	}, {
		databaseLabel: database.path,
		operationLabel: "board.read"
	});
}
function rowToHtmlDocument(row) {
	if (row.content_kind !== "html" || row.html === null || row.view_generation === null) return;
	const manifest = parseManifest(row.manifest);
	const declared = manifest.declared;
	return {
		html: Buffer.from(row.html).toString("utf8"),
		revision: row.revision,
		sha256: row.sha256,
		viewGeneration: row.view_generation,
		grantState: effectiveGrantState(row.grant_state, manifest),
		...declared ? { declared } : {}
	};
}
function upsertTabs(database, previous, next) {
	const db = getNodeSqliteKysely(database.db);
	const createdBy = new Map(previous.tabRows.map((row) => [row.tab_id, row.created_by]));
	for (const tab of next.tabs) executeSqliteQuerySync(database.db, db.insertInto("board_tabs").values({
		session_key: next.sessionKey,
		tab_id: tab.tabId,
		title: tab.title,
		position: tab.position,
		chat_dock: tab.chatDock,
		created_by: createdBy.get(tab.tabId) ?? "agent",
		revision: next.revision
	}).onConflict((conflict) => conflict.columns(["session_key", "tab_id"]).doUpdateSet({
		title: tab.title,
		position: tab.position,
		chat_dock: tab.chatDock,
		revision: next.revision
	})));
}
function updateWidgetLayouts(database, snapshot, updatedAt) {
	const db = getNodeSqliteKysely(database.db);
	for (const widget of snapshot.widgets) executeSqliteQuerySync(database.db, db.updateTable("board_widgets").set({
		tab_id: widget.tabId,
		title: widget.title ?? null,
		size_w: widget.sizeW,
		size_h: widget.sizeH,
		position: widget.position,
		updated_at: updatedAt
	}).where("session_key", "=", snapshot.sessionKey).where("name", "=", widget.name));
}
function updateWidgetHeightModes(database, previous, ops) {
	const db = getNodeSqliteKysely(database.db);
	for (const op of ops) {
		if (op.kind !== "widget_resize") continue;
		const row = previous.widgetRows.find((candidate) => candidate.name === op.name);
		if (!row) continue;
		executeSqliteQuerySync(database.db, db.updateTable("board_widgets").set({ manifest: updateManifestHeightMode(row.manifest, op.heightMode ?? "fixed") }).where("session_key", "=", previous.snapshot.sessionKey).where("name", "=", op.name));
	}
}
function deleteRemovedWidgets(database, previous, next) {
	const db = getNodeSqliteKysely(database.db);
	const widgetNames = new Set(next.widgets.map((widget) => widget.name));
	for (const row of previous.widgetRows) if (!widgetNames.has(row.name)) executeSqliteQuerySync(database.db, db.deleteFrom("board_widgets").where("session_key", "=", next.sessionKey).where("name", "=", row.name));
}
function deleteRemovedTabs(database, previous, next) {
	const db = getNodeSqliteKysely(database.db);
	const tabIds = new Set(next.tabs.map((tab) => tab.tabId));
	for (const row of previous.tabRows) if (!tabIds.has(row.tab_id)) executeSqliteQuerySync(database.db, db.deleteFrom("board_tabs").where("session_key", "=", next.sessionKey).where("tab_id", "=", row.tab_id));
}
function hasSession(database, sessionKey) {
	const db = getNodeSqliteKysely(database.db);
	const row = executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select("entry_json").where("session_key", "=", sessionKey).limit(1)).rows[0];
	if (!row) return false;
	try {
		const entry = JSON.parse(row.entry_json);
		return Boolean(entry && typeof entry === "object" && !Array.isArray(entry) && typeof entry.sessionId === "string");
	} catch {
		return false;
	}
}
function emptyBoardSnapshot(sessionKey) {
	return {
		sessionKey,
		revision: 0,
		tabs: [],
		widgets: []
	};
}
var SqliteBoardStore = class {
	constructor(options) {
		this.options = options;
	}
	resolve(sessionKey) {
		return this.options.resolveSession(sessionKey);
	}
	requireExistingSession(resolved) {
		const result = withOpenClawAgentDatabaseReadOnly((database) => hasSession(database, resolved.sessionKey), {
			agentId: resolved.agentId,
			...resolved.path ? { path: resolved.path } : {},
			env: this.options.env
		});
		if (!result.found || !result.value) throw new BoardValidationError("not_found", `board session not found: ${resolved.sessionKey}`);
	}
	prepareWrite(sessionKey) {
		const resolved = this.resolve(sessionKey);
		this.requireExistingSession(resolved);
		const database = openOpenClawAgentDatabase({
			agentId: resolved.agentId,
			...resolved.path ? { path: resolved.path } : {},
			env: this.options.env
		});
		ensureBoardSchema(database);
		return {
			database,
			resolved
		};
	}
	getSnapshot(sessionKey) {
		const resolved = this.resolve(sessionKey);
		const result = withOpenClawAgentDatabaseReadOnly((database) => hasSession(database, resolved.sessionKey) && boardTablesPresent(database) ? readStoredBoard(database, resolved.sessionKey).snapshot : void 0, {
			agentId: resolved.agentId,
			...resolved.path ? { path: resolved.path } : {},
			env: this.options.env
		});
		return cloneBoardSnapshot(result.found && result.value ? result.value : emptyBoardSnapshot(resolved.sessionKey));
	}
	getSnapshotWithHtmlViewMetadata(sessionKey) {
		const resolved = this.resolve(sessionKey);
		const result = withOpenClawAgentDatabaseReadOnly((database) => hasSession(database, resolved.sessionKey) && boardTablesPresent(database) ? readStoredBoard(database, resolved.sessionKey) : void 0, {
			agentId: resolved.agentId,
			...resolved.path ? { path: resolved.path } : {},
			env: this.options.env
		});
		const stored = result.found ? result.value : void 0;
		return {
			snapshot: cloneBoardSnapshot(stored?.snapshot ?? emptyBoardSnapshot(resolved.sessionKey)),
			htmlViewMetadata: stored?.htmlViewMetadata ?? /* @__PURE__ */ new Map()
		};
	}
	applyOps(sessionKey, ops) {
		if (ops.length === 0) return this.getSnapshot(sessionKey);
		const { database, resolved } = this.prepareWrite(sessionKey);
		return runOpenClawAgentWriteTransaction((transactionDatabase) => {
			if (!hasSession(transactionDatabase, resolved.sessionKey)) throw new BoardValidationError("not_found", `board session not found: ${resolved.sessionKey}`);
			const previous = readStoredBoard(transactionDatabase, resolved.sessionKey);
			const layout = applyBoardOps(previous.snapshot, ops);
			const next = {
				sessionKey: resolved.sessionKey,
				revision: previous.snapshot.revision + 1,
				...layout
			};
			const now = Date.now();
			upsertTabs(transactionDatabase, previous, next);
			deleteRemovedWidgets(transactionDatabase, previous, next);
			updateWidgetLayouts(transactionDatabase, next, now);
			updateWidgetHeightModes(transactionDatabase, previous, ops);
			deleteRemovedTabs(transactionDatabase, previous, next);
			return cloneBoardSnapshot(next);
		}, {
			agentId: resolved.agentId,
			path: database.path,
			env: this.options.env
		}, { operationLabel: "board.apply-ops" });
	}
	putWidget(params) {
		const { database, resolved } = this.prepareWrite(params.sessionKey);
		const canonicalInput = normalizeBoardWidgetPutParams(params, resolved.sessionKey);
		const viewGeneration = randomBytes(16).toString("hex");
		return runOpenClawAgentWriteTransaction((transactionDatabase) => {
			if (!hasSession(transactionDatabase, resolved.sessionKey)) throw new BoardValidationError("not_found", `board session not found: ${resolved.sessionKey}`);
			const previous = readStoredBoard(transactionDatabase, resolved.sessionKey);
			const canonicalParams = resolveSqliteBoardWidgetPutParams(previous.snapshot, canonicalInput, previous.widgetRows);
			const existing = previous.widgetRows.find((row) => row.name === canonicalParams.name);
			const grantScopeMatches = existing ? existing.content_kind === "html" ? canonicalParams.content.kind === "html" : existing.content_kind === "mcp-app" ? existing.descriptor_json !== null && canonicalParams.content.kind === "mcp-app" && parseDescriptor(existing.descriptor_json).serverName === canonicalParams.content.descriptor.serverName : existing.descriptor_json !== null && canonicalParams.content.kind === "plugin" && parsePluginContent(existing.descriptor_json).pluginKind === canonicalParams.content.pluginKind : true;
			const next = createBoardWidgetPutSnapshot(previous.snapshot, canonicalParams, {
				grantScopeMatches,
				grantedSha256: existing?.granted_sha ?? void 0,
				instanceId: viewGeneration
			});
			const widget = next.widgets.find((candidate) => candidate.name === canonicalParams.name);
			const now = Date.now();
			upsertTabs(transactionDatabase, previous, next);
			const db = getNodeSqliteKysely(transactionDatabase.db);
			const fields = createBoardWidgetContentFields(canonicalParams, {
				presentation: widget.presentation,
				heightMode: widget.heightMode
			}, widget.revision, widget.grantState, viewGeneration, now);
			executeSqliteQuerySync(transactionDatabase.db, db.insertInto("board_widgets").values({
				session_key: resolved.sessionKey,
				name: canonicalParams.name,
				tab_id: widget.tabId,
				title: widget.title ?? null,
				size_w: widget.sizeW,
				size_h: widget.sizeH,
				position: widget.position,
				created_by: existing?.created_by ?? "agent",
				created_at: existing?.created_at ?? now,
				...fields
			}).onConflict((conflict) => conflict.columns(["session_key", "name"]).doUpdateSet({
				tab_id: widget.tabId,
				title: widget.title ?? null,
				size_w: widget.sizeW,
				size_h: widget.sizeH,
				position: widget.position,
				...fields
			})));
			updateWidgetLayouts(transactionDatabase, next, now);
			return createBoardWidgetPutResult(next, canonicalParams.name);
		}, {
			agentId: resolved.agentId,
			path: database.path,
			env: this.options.env
		}, { operationLabel: "board.put-widget" });
	}
	grant(sessionKey, name, decision, revision, instanceId) {
		const { database, resolved } = this.prepareWrite(sessionKey);
		return runOpenClawAgentWriteTransaction((transactionDatabase) => {
			if (!hasSession(transactionDatabase, resolved.sessionKey)) throw new BoardValidationError("not_found", `board session not found: ${resolved.sessionKey}`);
			const previous = readStoredBoard(transactionDatabase, resolved.sessionKey);
			const next = createBoardGrantSnapshot(previous.snapshot, name, decision, revision, instanceId);
			upsertTabs(transactionDatabase, previous, next);
			const row = previous.widgetRows.find((candidate) => candidate.name === name);
			const manifest = parseManifest(row.manifest);
			const declared = manifest.declared;
			const db = getNodeSqliteKysely(transactionDatabase.db);
			executeSqliteQuerySync(transactionDatabase.db, db.updateTable("board_widgets").set({
				grant_state: decision,
				granted_sha: decision === "granted" ? row.sha256 : null,
				manifest: serializeManifest(declared, decision, manifest.mcpAppInteractive !== void 0 && manifest.mcpAppInstanceId ? {
					interactive: manifest.mcpAppInteractive,
					instanceId: manifest.mcpAppInstanceId
				} : void 0, {
					presentation: manifest.presentation,
					heightMode: manifest.heightMode
				}, manifest.nameIdentity),
				updated_at: Date.now()
			}).where("session_key", "=", resolved.sessionKey).where("name", "=", name));
			return cloneBoardSnapshot(next);
		}, {
			agentId: resolved.agentId,
			path: database.path,
			env: this.options.env
		}, { operationLabel: "board.grant-widget" });
	}
	readWidgetHtml(sessionKey, name) {
		const resolved = this.resolve(sessionKey);
		const result = withOpenClawAgentDatabaseReadOnly((database) => {
			if (!hasSession(database, resolved.sessionKey) || !boardTablesPresent(database)) return;
			const db = getNodeSqliteKysely(database.db);
			const row = executeSqliteQuerySync(database.db, db.selectFrom("board_widgets").select([
				"content_kind",
				"html",
				"descriptor_json",
				"revision",
				"sha256",
				"view_generation",
				"grant_state",
				"manifest"
			]).where("session_key", "=", resolved.sessionKey).where("name", "=", name).limit(1)).rows[0];
			if (!row) return;
			return rowToHtmlDocument(row);
		}, {
			agentId: resolved.agentId,
			...resolved.path ? { path: resolved.path } : {},
			env: this.options.env
		});
		return result.found ? result.value : void 0;
	}
	readWidgetMcpApp(sessionKey, name) {
		const resolved = this.resolve(sessionKey);
		const result = withOpenClawAgentDatabaseReadOnly((database) => {
			if (!hasSession(database, resolved.sessionKey) || !boardTablesPresent(database)) return;
			const db = getNodeSqliteKysely(database.db);
			const row = executeSqliteQuerySync(database.db, db.selectFrom("board_widgets").select([
				"content_kind",
				"descriptor_json",
				"revision",
				"grant_state",
				"manifest"
			]).where("session_key", "=", resolved.sessionKey).where("name", "=", name).limit(1)).rows[0];
			if (!row || row.content_kind !== "mcp-app" || row.descriptor_json === null) return;
			const manifest = parseManifest(row.manifest);
			if (manifest.mcpAppInteractive === void 0 || manifest.mcpAppInstanceId === void 0) return;
			return {
				descriptor: parseDescriptor(row.descriptor_json),
				revision: row.revision,
				instanceId: manifest.mcpAppInstanceId,
				grantState: effectiveGrantState(row.grant_state, manifest),
				declaredTools: manifest.declared?.tools ?? [],
				interactive: manifest.mcpAppInteractive
			};
		}, {
			agentId: resolved.agentId,
			...resolved.path ? { path: resolved.path } : {},
			env: this.options.env
		});
		return result.found ? result.value : void 0;
	}
	listSessionsWithBoards() {
		const sessionKeys = /* @__PURE__ */ new Set();
		const agentIds = new Set(listOpenClawRegisteredAgentDatabases({ env: this.options.env }).map((registered) => registered.agentId));
		for (const agentId of agentIds) {
			const result = withOpenClawAgentDatabaseReadOnly((database) => {
				if (!boardTablesPresent(database)) return [];
				const db = getNodeSqliteKysely(database.db);
				return executeSqliteQuerySync(database.db, db.selectFrom("board_tabs").select("session_key").distinct()).rows;
			}, {
				agentId,
				path: this.resolve(`agent:${agentId}:main`).path ?? resolveOpenClawAgentSqlitePath({
					agentId,
					env: this.options.env
				}),
				env: this.options.env
			});
			if (result.found) for (const row of result.value) sessionKeys.add(row.session_key);
		}
		return [...sessionKeys].toSorted();
	}
};
//#endregion
//#region src/gateway/board-store.ts
const boardStore = new SqliteBoardStore({ resolveSession: (sessionKey) => {
	const cfg = getRuntimeConfig();
	const canonicalSessionKey = resolveSessionStoreKey({
		cfg,
		sessionKey
	});
	const agentId = resolveSessionStoreAgentId(cfg, canonicalSessionKey);
	const databasePath = resolveSqliteTargetFromSessionStorePath(resolveSessionStorePathCore(cfg.session?.store, { agentId }), { agentId }).path;
	return {
		agentId,
		...databasePath ? { path: databasePath } : {},
		sessionKey: canonicalSessionKey
	};
} });
//#endregion
//#region src/gateway/board-widget-view.ts
function resolveAuthorizedBoardWidgetView(store, ticket, options = {}) {
	const claims = verifyBoardViewTicket(ticket, options);
	if (!claims) throw new BoardValidationError("invalid_operation", "board widget view ticket is invalid");
	const document = store.readWidgetHtml(claims.sessionKey, claims.name);
	if (!document || !("html" in document) || document.grantState !== "none" && document.grantState !== "granted" || document.revision !== claims.revision || document.viewGeneration !== claims.viewGeneration) throw new BoardValidationError("invalid_operation", "board widget view ticket is stale");
	return {
		sessionKey: claims.sessionKey,
		name: claims.name,
		document
	};
}
//#endregion
export { buildBoardWidgetSandboxPath as i, boardStore as n, buildBoardWidgetContentSecurityPolicy as r, resolveAuthorizedBoardWidgetView as t };
