import { t as validateJsonSchemaValue } from "./schema-validator-yfJyG0DX.js";
import "./src-4dv5TpeQ.js";
//#region src/boards/board-host-capability-ids.ts
const CORE_BOARD_DATA_BINDING_IDS = [
	"sessions.list",
	"usage.status",
	"usage.cost",
	"cron.list",
	"cron.status",
	"agents.list",
	"health"
];
const CORE_BOARD_ACTION_VERB_IDS = ["cron.trigger"];
/** Widget grants share one string namespace across reads and actions. */
const CORE_BOARD_HOST_CAPABILITY_IDS = [...CORE_BOARD_DATA_BINDING_IDS, ...CORE_BOARD_ACTION_VERB_IDS];
//#endregion
//#region src/plugins/dashboard-capabilities.ts
var PluginDashboardDeclarationError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "PluginDashboardDeclarationError";
	}
};
function fail$1(pluginId, message) {
	throw new PluginDashboardDeclarationError(`invalid dashboard declaration for plugin ${JSON.stringify(pluginId)}: ${message}`);
}
function buildCapabilityId(params) {
	const capabilityId = `${params.pluginId.replaceAll("%", "%25").replaceAll(".", "%2E")}.${params.localId}`;
	if (capabilityId.length > params.maxLength) return fail$1(params.pluginId, `capability id ${JSON.stringify(capabilityId)} exceeds ${params.maxLength} characters`);
	return capabilityId;
}
function requireOwnedMethod(params) {
	const descriptor = params.registry.gatewayMethodDescriptors.find((candidate) => candidate.name === params.method);
	if (descriptor?.owner.kind !== "plugin" || descriptor.owner.pluginId !== params.pluginId) return fail$1(params.pluginId, `method ${JSON.stringify(params.method)} must be registered by the declaring plugin`);
	if (descriptor.scope !== params.expectedScope) return fail$1(params.pluginId, `method ${JSON.stringify(params.method)} must use ${params.expectedScope}, got ${descriptor.scope}`);
	const handler = params.registry.gatewayHandlers[params.method];
	if (!handler) return fail$1(params.pluginId, `method ${JSON.stringify(params.method)} is missing its registered handler`);
	return handler;
}
/** Validates and publishes one plugin's manifest-declared dashboard capabilities atomically. */
function registerPluginDashboardCapabilities(params) {
	const dashboard = params.record.dashboard;
	if (!dashboard) return;
	const dataBindings = [];
	const actionVerbs = [];
	const capabilityIds = /* @__PURE__ */ new Set();
	const claimCapabilityId = (capabilityId) => {
		if (capabilityIds.has(capabilityId) || params.registry.dashboardDataBindings.has(capabilityId) || params.registry.dashboardActionVerbs.has(capabilityId)) fail$1(params.record.id, `duplicate capability id ${JSON.stringify(capabilityId)}`);
		if (CORE_BOARD_HOST_CAPABILITY_IDS.includes(capabilityId) || capabilityId.startsWith("cron.trigger:")) fail$1(params.record.id, `capability id ${JSON.stringify(capabilityId)} is reserved by core`);
		capabilityIds.add(capabilityId);
	};
	for (const declaration of dashboard.dataBindings ?? []) {
		const capabilityId = buildCapabilityId({
			pluginId: params.record.id,
			localId: declaration.id,
			maxLength: 64
		});
		claimCapabilityId(capabilityId);
		dataBindings.push({
			...declaration,
			pluginId: params.record.id,
			capabilityId,
			handler: requireOwnedMethod({
				pluginId: params.record.id,
				method: declaration.method,
				expectedScope: "operator.read",
				registry: params.registry
			})
		});
	}
	for (const declaration of dashboard.actionVerbs ?? []) {
		const capabilityId = buildCapabilityId({
			pluginId: params.record.id,
			localId: declaration.id,
			maxLength: 269
		});
		claimCapabilityId(capabilityId);
		const handler = requireOwnedMethod({
			pluginId: params.record.id,
			method: declaration.method,
			expectedScope: "operator.write",
			registry: params.registry
		});
		if (declaration.paramShape) try {
			validateJsonSchemaValue({
				schema: declaration.paramShape,
				cacheKey: `dashboard-action:${params.record.id}:${declaration.id}`,
				value: void 0
			});
		} catch (error) {
			fail$1(params.record.id, `action ${JSON.stringify(capabilityId)} has an invalid paramShape: ${String(error)}`);
		}
		actionVerbs.push({
			...declaration,
			pluginId: params.record.id,
			capabilityId,
			handler
		});
	}
	for (const registration of dataBindings) params.registry.dashboardDataBindings.set(registration.capabilityId, registration);
	for (const registration of actionVerbs) params.registry.dashboardActionVerbs.set(registration.capabilityId, registration);
}
//#endregion
//#region src/plugins/board-widget-content-kinds.ts
const CONTENT_KIND_PATTERN = /^[a-z][a-z0-9-]{0,31}$/u;
const SURFACE_PATTERN = /^[a-z][a-z0-9._-]{0,63}$/u;
const RESERVED_CONTENT_KINDS = /* @__PURE__ */ new Set([
	"html",
	"mcp-app",
	"plugin"
]);
function fail(pluginId, message) {
	throw new PluginDashboardDeclarationError(`invalid board widget content kind for plugin ${JSON.stringify(pluginId)}: ${message}`);
}
function isGatewayLocalPath(value) {
	return value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\");
}
/** Validates and publishes one runtime board-widget content kind. */
function registerPluginBoardWidgetContentKind(params) {
	const { definition, record, registry } = params;
	const kind = typeof definition.kind === "string" ? definition.kind.trim() : "";
	const label = typeof definition.label === "string" ? definition.label.trim() : "";
	const surface = typeof definition.resources?.surface === "string" ? definition.resources.surface.trim() : "";
	const paths = definition.resources?.paths;
	if (!CONTENT_KIND_PATTERN.test(kind) || RESERVED_CONTENT_KINDS.has(kind)) fail(record.id, `kind ${JSON.stringify(kind)} is invalid or reserved`);
	if (!label || label.length > 80) fail(record.id, "label must contain 1-80 characters");
	if (!SURFACE_PATTERN.test(surface)) fail(record.id, `resource surface ${JSON.stringify(surface)} is invalid`);
	if (!Array.isArray(paths) || paths.length === 0 || paths.length > 8 || paths.some((resourcePath) => typeof resourcePath !== "string" || resourcePath.length > 256 || !isGatewayLocalPath(resourcePath)) || new Set(paths).size !== paths.length) fail(record.id, "resource paths must be 1-8 unique gateway-local absolute paths");
	if (typeof definition.validateSource !== "function" || typeof definition.composeDocument !== "function") fail(record.id, "validateSource and composeDocument callbacks are required");
	if (registry.boardWidgetContentKinds.has(kind)) fail(record.id, `duplicate kind ${JSON.stringify(kind)}`);
	const pluginKind = `${record.id}:${kind}`;
	if (!/^[a-z0-9][a-z0-9-]{0,63}:[a-z0-9][a-z0-9._-]{0,63}$/u.test(pluginKind)) fail(record.id, `persisted kind ${JSON.stringify(pluginKind)} is invalid`);
	registry.boardWidgetContentKinds.set(kind, {
		pluginId: record.id,
		pluginKind,
		definition: {
			...definition,
			kind,
			label,
			resources: {
				surface,
				paths: [...paths]
			}
		}
	});
}
function createPluginBoardWidgetContentKindRegistrar(registry) {
	return (record, definition) => registerPluginBoardWidgetContentKind({
		record,
		registry,
		definition
	});
}
function resolveBoardWidgetContentKind(registry, kind) {
	return registry?.boardWidgetContentKinds.get(kind);
}
function resolveBoardWidgetContentKindByPluginKind(registry, pluginKind) {
	if (!registry) return;
	for (const registration of registry.boardWidgetContentKinds.values()) if (registration.pluginKind === pluginKind) return registration;
}
function listBoardWidgetContentKinds(registry) {
	return [...registry?.boardWidgetContentKinds.keys() ?? []].toSorted();
}
/** Resolves registration resource paths below one connection-scoped plugin capability URL. */
function resolveBoardWidgetContentKindResourceUrls(registration, scopedHostUrl) {
	try {
		const scoped = new URL(scopedHostUrl);
		const prefix = scoped.pathname.replace(/\/+$/u, "");
		if (!/^\/__openclaw__\/cap\/[^/]+$/u.test(prefix)) return;
		return Object.fromEntries(registration.definition.resources.paths.map((resourcePath) => {
			const url = new URL(scoped.toString());
			url.pathname = `${prefix}${resourcePath}`;
			url.search = "";
			url.hash = "";
			return [resourcePath, url.toString()];
		}));
	} catch {
		return;
	}
}
//#endregion
export { resolveBoardWidgetContentKindResourceUrls as a, CORE_BOARD_DATA_BINDING_IDS as c, resolveBoardWidgetContentKindByPluginKind as i, listBoardWidgetContentKinds as n, PluginDashboardDeclarationError as o, resolveBoardWidgetContentKind as r, registerPluginDashboardCapabilities as s, createPluginBoardWidgetContentKindRegistrar as t };
