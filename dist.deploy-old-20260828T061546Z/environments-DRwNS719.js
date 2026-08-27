import { l as normalizeSortedUniqueTrimmedStringList } from "./string-normalization-e_fvmxMf.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { At as validateEnvironmentsCreateParams, Mt as validateEnvironmentsListParams, Nt as validateEnvironmentsStatusParams, _o as validateWorkerDesktopLaunchParams, jt as validateEnvironmentsDestroyParams, vt as validateDesktopLaunchParams, yo as validateWorkerDesktopObserveParams, yt as validateDesktopObserveParams } from "./src-4dv5TpeQ.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { n as NODE_DESKTOP_STREAM_COMMAND } from "./node-desktop-stream-BZM2AiRA.js";
import { l as resolveNodeCommandAllowlist, o as isNodeCommandAllowed } from "./node-command-policy-XnskQsTT.js";
import { _ as resolveNodePairingState, c as listDevicePairing } from "./device-pairing-BIRweQsd.js";
import { a as listNodePairing } from "./device-pairing-node-yaKle7Kn.js";
import { c as isNodeRunnerSessionHost, n as collectNodeWorkerBundleStatusByNodeId, r as collectNodeWorkerCapacityByNodeId, t as collectNodeRunnerIssuesByNodeId } from "./node-registry-private-CsBI1Ypg.js";
import { t as formatForLog } from "./ws-log-CjO1AAG7.js";
import { i as respondUnavailableOnThrow, t as respondInvalidParams } from "./nodes.helpers-C2d4BQ6I.js";
import { r as isDesktopCredentialsRequiredError } from "./host-source-errors-46uOYNUn.js";
import { n as getNodeDesktopService } from "./node-source-context-Csxf7qYw.js";
import { r as listKnownNodes, t as createKnownNodeCatalog } from "./node-catalog-DGajSSq2.js";
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
	const allowlist = node.connected === true ? resolveNodeCommandAllowlist(config, {
		platform: node.platform,
		deviceFamily: node.deviceFamily,
		commands: node.commands,
		approvedCommands: node.commands
	}) : void 0;
	const invocableCommands = allowlist ? uniqueSortedStrings(node.commands).filter((command) => command.length <= 128 && isNodeCommandAllowed({
		command,
		declaredCommands: node.commands,
		allowlist
	}).ok).slice(0, 128) : [];
	const desktop = invocableCommands.includes(NODE_DESKTOP_STREAM_COMMAND);
	return {
		id: `node:${node.nodeId}`,
		type: "node",
		label: node.displayName ?? node.nodeId,
		status: node.connected ? "available" : "unavailable",
		...platform ? { platform } : {},
		sessionHost: node.sessionHost === true,
		...node.workerSlots ? { workerSlots: { ...node.workerSlots } } : {},
		...node.workerBundle ? { workerBundle: structuredClone(node.workerBundle) } : {},
		...node.lastConnectedAtMs !== void 0 ? { lastConnectedAtMs: node.lastConnectedAtMs } : {},
		...node.lastDisconnectedAtMs !== void 0 ? { lastDisconnectedAtMs: node.lastDisconnectedAtMs } : {},
		...node.lastSeenAtMs !== void 0 ? { lastSeenAtMs: node.lastSeenAtMs } : {},
		...node.lastSeenReason ? { lastSeenReason: node.lastSeenReason } : {},
		trust: "persistent",
		...desktop ? { desktop: true } : {},
		...capabilities.length > 0 ? { capabilities } : {},
		...invocableCommands.length > 0 ? { invocableCommands } : {},
		...node.issues?.length ? { issues: [...node.issues] } : {}
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
async function listGatewayEnvironments(context, workers = listWorkerEnvironments(context)) {
	const [devices, nodes] = await Promise.all([listDevicePairing(), listNodePairing()]);
	const managedCloudNodeIds = new Set(workers.flatMap((environment) => environment.providerId !== "device" && environment.nodeDeviceId && environment.state !== "destroyed" ? [environment.nodeDeviceId] : []));
	const visibleDevices = devices.paired.filter((device) => !managedCloudNodeIds.has(device.deviceId));
	const currentPairingStates = /* @__PURE__ */ new Map();
	for (const device of visibleDevices) {
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
	const issuesByNodeId = collectNodeRunnerIssuesByNodeId(context.nodeRegistry, connectedNodes);
	const workerSlotsByNodeId = collectNodeWorkerCapacityByNodeId(context.nodeRegistry, connectedNodes);
	const workerBundleByNodeId = collectNodeWorkerBundleStatusByNodeId(context.nodeRegistry, connectedNodes);
	const catalog = createKnownNodeCatalog({
		pairedDevices: visibleDevices,
		pairedNodes: nodes.paired.filter((node) => !managedCloudNodeIds.has(node.nodeId)),
		connectedNodes: connectedNodes.filter((node) => !managedCloudNodeIds.has(node.nodeId)),
		sessionHostNodeIds,
		workerSlotsByNodeId,
		workerBundleByNodeId,
		issuesByNodeId
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
		throw new Error("environment inventory unavailable");
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
async function listWorkerProfilesWithMachines(context) {
	const summaries = listWorkerProfiles(context);
	return await Promise.all(summaries.map(async (summary) => {
		const executionModes = ["worker-turn", "remote-exec"].filter((mode) => context.workerEnvironmentService?.supportsExecutionMode?.(summary.id, mode) === true);
		const executionMode = executionModes[0];
		const resolvedSummary = Object.assign(summary, executionMode ? {
			executionMode,
			executionModes
		} : {});
		try {
			const machines = await context.workerEnvironmentService?.listMachineOptions?.(summary.id) ?? [];
			return machines.length > 0 ? Object.assign(resolvedSummary, { machines }) : resolvedSummary;
		} catch (error) {
			context.logGateway.warn(`worker machine catalog unavailable (${summary.id}): ${formatForLog(error)}`);
			return resolvedSummary;
		}
	}));
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
			const workers = listWorkerEnvironments(context);
			const environments = await listGatewayEnvironments(context, workers);
			const summarizedAtMs = Date.now();
			environments.push(...workers.map((record) => summarizeWorkerEnvironment(record, summarizedAtMs)));
			const profiles = await listWorkerProfilesWithMachines(context);
			respond(true, {
				environments,
				...profiles.length > 0 ? { profiles } : {}
			}, void 0);
		});
	},
	"environments.status": async ({ params, respond, context }) => {
		if (!validateEnvironmentsStatusParams(params)) return rejectInvalid(respond, "environments.status", validateEnvironmentsStatusParams);
		await respondUnavailableOnThrow(respond, async () => {
			const environment = (await listGatewayEnvironments(context)).find((entry) => entry.id === params.environmentId);
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
export { summarizeWorkerEnvironment as i, listGatewayEnvironments as n, listWorkerProfiles as r, environmentsHandlers as t };
