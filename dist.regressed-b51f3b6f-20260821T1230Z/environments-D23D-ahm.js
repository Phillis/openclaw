import { l as normalizeSortedUniqueTrimmedStringList } from "./string-normalization-e_fvmxMf.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { At as validateEnvironmentsDestroyParams, Mt as validateEnvironmentsStatusParams, Ya as validateWorkerDesktopLaunchParams, Za as validateWorkerDesktopObserveParams, _t as validateDesktopLaunchParams, jt as validateEnvironmentsListParams, kt as validateEnvironmentsCreateParams, vt as validateDesktopObserveParams } from "./src-BlUKtAtD.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import "./node-desktop-stream-B3QCoQfh.js";
import { l as resolveNodeCommandAllowlist, o as isNodeCommandAllowed } from "./node-command-policy-Cru_no7H.js";
import { a as isNodeRunnerSessionHost } from "./node-registry-private-BEIBFAdy.js";
import { d as listDevicePairing, x as resolveNodePairingState } from "./device-pairing-CkbDK__R.js";
import { a as listNodePairing } from "./device-pairing-node-koBZUtkr.js";
import { t as formatForLog } from "./ws-log-DAJ6wT2O.js";
import { i as respondUnavailableOnThrow, t as respondInvalidParams } from "./nodes.helpers-CkPbEFOM.js";
import { r as isDesktopCredentialsRequiredError } from "./host-source-errors-46uOYNUn.js";
import { n as getNodeDesktopService } from "./node-source-context-Csxf7qYw.js";
import { r as listKnownNodes, t as createKnownNodeCatalog } from "./node-catalog-BHBjKs5a.js";
//#region src/gateway/server-methods/environments.ts
const GATEWAY_ENVIRONMENT = {
	id: "gateway",
	type: "local",
	label: "Gateway local",
	status: "available",
	platform: process.platform,
	sessionHost: true,
	trust: "persistent",
	capabilities: [
		"agent.run",
		"sessions",
		"tools",
		"workspace"
	]
};
const WORKER_STATUS = {
	requested: "starting",
	provisioning: "starting",
	bootstrapping: "starting",
	ready: "available",
	attached: "available",
	idle: "available",
	draining: "stopping",
	destroying: "stopping",
	destroyed: "unavailable",
	failed: "error",
	orphaned: "error"
};
function uniqueSortedStrings(...items) {
	return normalizeSortedUniqueTrimmedStringList(items.flatMap((item) => item ?? []));
}
function rejectInvalid(respond, method, validator) {
	return respondInvalidParams({
		respond,
		method,
		validator
	});
}
function summarizeNodeEnvironment(node, config) {
	const capabilities = uniqueSortedStrings(node.caps, node.commands);
	const platform = node.platform?.trim();
	const desktop = node.connected === true && isNodeCommandAllowed({
		command: "desktop.stream",
		declaredCommands: node.commands,
		allowlist: resolveNodeCommandAllowlist(config, {
			platform: node.platform,
			deviceFamily: node.deviceFamily,
			commands: node.commands,
			approvedCommands: node.commands
		})
	}).ok;
	return {
		id: `node:${node.nodeId}`,
		type: "node",
		label: node.displayName ?? node.nodeId,
		status: node.connected ? "available" : "unavailable",
		...platform ? { platform } : {},
		sessionHost: node.connected === true && node.sessionHost === true,
		...node.lastConnectedAtMs !== void 0 ? { lastConnectedAtMs: node.lastConnectedAtMs } : {},
		...node.lastDisconnectedAtMs !== void 0 ? { lastDisconnectedAtMs: node.lastDisconnectedAtMs } : {},
		...node.lastSeenAtMs !== void 0 ? { lastSeenAtMs: node.lastSeenAtMs } : {},
		...node.lastSeenReason ? { lastSeenReason: node.lastSeenReason } : {},
		trust: "persistent",
		...desktop ? { desktop: true } : {},
		...capabilities.length > 0 ? { capabilities } : {}
	};
}
/** Projects a durable worker row without exposing its SSH credential reference. */
function summarizeWorkerEnvironment(record, now = Date.now()) {
	return {
		id: record.environmentId,
		type: "worker",
		status: WORKER_STATUS[record.state],
		...record.sharedHost === null ? {} : { trust: record.sharedHost ? "persistent" : "disposable" },
		...record.desktopAvailable ? { desktop: true } : {},
		worker: {
			providerId: record.providerId,
			...record.leaseId ? { leaseId: record.leaseId } : {},
			state: record.state,
			ageMs: Math.max(0, Math.trunc(now - record.createdAtMs)),
			...record.state === "idle" && record.idleSinceAtMs !== null ? { idleMs: Math.max(0, Math.trunc(now - record.idleSinceAtMs)) } : {},
			attachedSessionIds: uniqueSortedStrings(record.attachedSessionIds),
			tunnelStatus: record.tunnelStatus,
			...(record.state === "failed" || record.state === "orphaned") && record.error ? { error: record.error } : {},
			...record.desktopAvailable ? { desktop: true } : {},
			...record.desktopApps.length > 0 ? { desktopApps: [...record.desktopApps] } : {}
		}
	};
}
async function listEnvironments(context) {
	const [devices, nodes] = await Promise.all([listDevicePairing(), listNodePairing()]);
	const currentPairingStates = /* @__PURE__ */ new Map();
	for (const device of devices.paired) {
		const state = resolveNodePairingState(device);
		if (state) currentPairingStates.set(state.identity.nodeId, {
			identity: state.identity.key,
			...state.generation ? { generation: state.generation.key } : {}
		});
	}
	const connectedNodes = context.nodeRegistry.listConnectedForPairingStates(currentPairingStates);
	const sessionHostNodeIds = new Set(connectedNodes.flatMap((node) => isNodeRunnerSessionHost({
		registry: context.nodeRegistry,
		nodeId: node.nodeId,
		connId: node.connId,
		pairingGeneration: node.pairingGeneration
	}) ? [node.nodeId] : []));
	const catalog = createKnownNodeCatalog({
		pairedDevices: devices.paired,
		pairedNodes: nodes.paired,
		connectedNodes,
		sessionHostNodeIds
	});
	const config = context.getRuntimeConfig();
	return [config.desktop?.host?.enabled === true ? {
		...GATEWAY_ENVIRONMENT,
		desktop: true
	} : GATEWAY_ENVIRONMENT, ...listKnownNodes(catalog).map((node) => summarizeNodeEnvironment(node, config))];
}
function listWorkerEnvironments(context) {
	try {
		return context.workerEnvironmentService?.list() ?? [];
	} catch {
		return [];
	}
}
function listWorkerProfiles(context) {
	if (!context.workerEnvironmentService || !context.workerPlacementDispatchService) return [];
	const profiles = context.getRuntimeConfig().cloudWorkers?.profiles ?? {};
	return Object.entries(profiles).flatMap(([id, profile]) => {
		const providerId = typeof profile.provider === "string" ? profile.provider.trim() : "";
		return id.trim() && providerId ? [{
			id: id.trim(),
			providerId
		}] : [];
	}).toSorted((left, right) => left.id.localeCompare(right.id));
}
async function respondWorkerMutation(respond, run, invalidCodes, unavailableMessage) {
	try {
		respond(true, summarizeWorkerEnvironment(await run()), void 0);
	} catch (error) {
		const code = error && typeof error === "object" && "code" in error ? error.code : void 0;
		const invalid = typeof code === "string" && invalidCodes.includes(code);
		const message = invalid && error instanceof Error ? error.message : unavailableMessage;
		respond(false, void 0, errorShape(invalid ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, message));
	}
}
async function respondDesktopObserve(params) {
	if (params.request.source.kind === "host") {
		if (params.context.getRuntimeConfig().desktop?.host?.enabled !== true) {
			params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "gateway host desktop is disabled; enable the Desktop lab (config: desktop.host.enabled=true), then restart the gateway"));
			return;
		}
		if (!params.context.hostDesktopService) {
			params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "gateway host desktop is not active; desktop.host.enabled changes require a gateway restart"));
			return;
		}
		try {
			params.respond(true, await params.context.hostDesktopService.observe({
				control: params.request.control ?? false,
				..."credentials" in params.request && params.request.credentials ? { credentials: params.request.credentials } : {}
			}), void 0);
		} catch (error) {
			if (isDesktopCredentialsRequiredError(error)) {
				params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message, { details: {
					code: error.detailCode,
					auth: error.auth
				} }));
				return;
			}
			params.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : "gateway host desktop observe unavailable; verify the VNC server and retry"));
		}
		return;
	}
	if (params.request.source.kind === "node") {
		const service = getNodeDesktopService(params.context);
		if (!service) {
			params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "node desktop is disabled; explicitly allow desktop.stream, then restart the gateway"));
			return;
		}
		try {
			params.respond(true, await service.observe({
				nodeId: params.request.source.nodeId,
				control: params.request.control ?? false,
				..."credentials" in params.request && params.request.credentials ? { credentials: params.request.credentials } : {}
			}), void 0);
		} catch (error) {
			if (isDesktopCredentialsRequiredError(error)) {
				params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message, { details: {
					code: error.detailCode,
					auth: error.auth
				} }));
				return;
			}
			params.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : "node desktop observe unavailable"));
		}
		return;
	}
	const service = params.context.workerEnvironmentService;
	if (!service) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown environmentId"));
		return;
	}
	try {
		const result = await service.observeDesktop({
			environmentId: params.request.source.environmentId,
			control: params.request.control ?? false
		});
		params.respond(true, result, void 0);
	} catch (error) {
		const code = error && typeof error === "object" && "code" in error ? error.code : void 0;
		const invalid = code === "environment_not_found" || code === "invalid_state";
		params.respond(false, void 0, errorShape(invalid ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, invalid && error instanceof Error ? error.message : "worker desktop observe unavailable"));
	}
}
async function respondDesktopLaunch(params) {
	const service = params.context.workerEnvironmentService;
	if (!service) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown environmentId"));
		return;
	}
	try {
		params.respond(true, await service.launchDesktopApp({
			environmentId: params.environmentId,
			app: params.app
		}), void 0);
	} catch (error) {
		const code = error && typeof error === "object" && "code" in error ? error.code : void 0;
		const invalid = code === "environment_not_found" || code === "invalid_state" || code === "desktop_app_not_found" || code === "unsupported_platform";
		const actionable = invalid || code === "launcher_failure";
		params.respond(false, void 0, errorShape(invalid ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, actionable && error instanceof Error ? error.message : "worker desktop app launch unavailable; try again"));
	}
}
const environmentsHandlers = {
	"environments.list": async ({ params, respond, context }) => {
		if (!validateEnvironmentsListParams(params)) return rejectInvalid(respond, "environments.list", validateEnvironmentsListParams);
		await respondUnavailableOnThrow(respond, async () => {
			const environments = await listEnvironments(context);
			const workers = listWorkerEnvironments(context);
			const summarizedAtMs = Date.now();
			environments.push(...workers.map((record) => summarizeWorkerEnvironment(record, summarizedAtMs)));
			const profiles = listWorkerProfiles(context);
			respond(true, {
				environments,
				...profiles.length > 0 ? { profiles } : {}
			}, void 0);
		});
	},
	"environments.status": async ({ params, respond, context }) => {
		if (!validateEnvironmentsStatusParams(params)) return rejectInvalid(respond, "environments.status", validateEnvironmentsStatusParams);
		await respondUnavailableOnThrow(respond, async () => {
			const environment = (await listEnvironments(context)).find((entry) => entry.id === params.environmentId);
			if (environment) {
				respond(true, environment, void 0);
				return;
			}
			let worker;
			try {
				worker = context.workerEnvironmentService?.get(params.environmentId);
			} catch {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "environment status unavailable"));
				return;
			}
			respond(Boolean(worker), worker ? summarizeWorkerEnvironment(worker) : void 0, worker ? void 0 : errorShape(ErrorCodes.INVALID_REQUEST, "unknown environmentId"));
		});
	},
	"environments.create": async ({ params, respond, context }) => {
		if (!validateEnvironmentsCreateParams(params)) return rejectInvalid(respond, "environments.create", validateEnvironmentsCreateParams);
		const service = context.workerEnvironmentService;
		if (!service) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "cloud worker environments are not configured"));
			return;
		}
		await respondWorkerMutation(respond, () => service.create(params.profileId, params.idempotencyKey), ["profile_not_found", "invalid_profile"], "worker environment creation failed");
	},
	"environments.destroy": async ({ params, respond, context }) => {
		if (!validateEnvironmentsDestroyParams(params)) return rejectInvalid(respond, "environments.destroy", validateEnvironmentsDestroyParams);
		const service = context.workerEnvironmentService;
		if (!service) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown environmentId"));
			return;
		}
		await respondWorkerMutation(respond, async () => {
			const placementService = context.workerPlacementDispatchService;
			if (params.force && !placementService?.forceDestroyEnvironment) throw new Error("cloud worker placement control is unavailable");
			const destroyed = params.force ? await placementService.forceDestroyEnvironment(params.environmentId, (error) => {
				context.logGateway.warn(`worker environment forced teardown cleanup failed: ${formatForLog(error)}`);
			}) : await service.destroyUnattached(params.environmentId);
			try {
				await context.workerPlacementDispatchService?.reconcileActive?.(params.environmentId);
			} catch (error) {
				context.logGateway.warn(`worker placement reconciliation after destroy failed: ${formatForLog(error)}`);
			}
			return destroyed;
		}, ["environment_not_found", "invalid_state"], "worker environment destruction failed");
	},
	"worker.desktop.observe": async ({ params, respond, context }) => {
		if (!validateWorkerDesktopObserveParams(params)) return rejectInvalid(respond, "worker.desktop.observe", validateWorkerDesktopObserveParams);
		await respondDesktopObserve({
			request: {
				source: {
					kind: "environment",
					environmentId: params.environmentId
				},
				...params.control === void 0 ? {} : { control: params.control }
			},
			respond,
			context
		});
	},
	"worker.desktop.launch": async ({ params, respond, context }) => {
		if (!validateWorkerDesktopLaunchParams(params)) return rejectInvalid(respond, "worker.desktop.launch", validateWorkerDesktopLaunchParams);
		await respondDesktopLaunch({
			environmentId: params.environmentId,
			app: params.app,
			respond,
			context
		});
	},
	"desktop.observe": async ({ params, respond, context }) => {
		if (!validateDesktopObserveParams(params)) return rejectInvalid(respond, "desktop.observe", validateDesktopObserveParams);
		await respondDesktopObserve({
			request: params,
			respond,
			context
		});
	},
	"desktop.launch": async ({ params, respond, context }) => {
		if (!validateDesktopLaunchParams(params)) return rejectInvalid(respond, "desktop.launch", validateDesktopLaunchParams);
		await respondDesktopLaunch({
			environmentId: params.source.environmentId,
			app: params.app,
			respond,
			context
		});
	}
};
//#endregion
export { listWorkerProfiles as n, summarizeWorkerEnvironment as r, environmentsHandlers as t };
