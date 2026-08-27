import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import { l as resolveNodeCommandAllowlist, o as isNodeCommandAllowed } from "./node-command-policy-XnskQsTT.js";
import { t as DEVICE_WORKER_PROVIDER_ID } from "./device-provider-identity-v6nXqNq_.js";
import { i as deviceUnavailableText, o as resolveDeviceWorkerAvailability } from "./device-provider-CGBGkDeS.js";
//#region src/gateway/worker-environments/device-placement-eligibility.ts
async function resolveDevicePlacementEligibility(params) {
	const { deviceId, requirement } = params;
	if (!requirement) return {
		ok: false,
		error: `runtime ${params.runtimeId ?? "selection"} does not support paired-device placement; select a compatible runtime or cloud worker provider`
	};
	const availability = await resolveDeviceWorkerAvailability(params.environmentService, deviceId);
	if (!availability.available || !availability.node) return {
		ok: false,
		error: deviceUnavailableText(deviceId, availability)
	};
	const node = availability.node;
	if (node.nodeId !== deviceId || params.currentNode && (params.currentNode.nodeId !== node.nodeId || params.currentNode.connId && params.currentNode.connId !== node.connId || params.currentNode.pairingGeneration && params.currentNode.pairingGeneration !== node.pairingGeneration)) return {
		ok: false,
		error: deviceUnavailableText(deviceId, {
			available: false,
			unavailableReason: "disconnected"
		})
	};
	const declaredCommands = [...node.commands];
	const allowlist = resolveNodeCommandAllowlist(params.config, {
		...params.currentNode?.platform ? { platform: params.currentNode.platform } : {},
		...params.currentNode?.deviceFamily ? { deviceFamily: params.currentNode.deviceFamily } : {},
		commands: declaredCommands,
		approvedCommands: declaredCommands
	});
	for (const command of requirement.requiredNodeCommands) if (!isNodeCommandAllowed({
		command,
		declaredCommands,
		allowlist
	}).ok) return {
		ok: false,
		error: `paired-device command ${command} is not enabled or approved for ${deviceId}; enable it in gateway.nodes.commands.allow and approve the command on the node`
	};
	if (requirement.consumesWorkerSlot && node.workerHost.capacity.available <= 0) return {
		ok: false,
		error: deviceUnavailableText(deviceId, {
			available: false,
			unavailableReason: "at-capacity"
		})
	};
	return {
		ok: true,
		availableSlots: node.workerHost.capacity.available,
		node
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-destination.ts
function resolveWorkerPlacementDestination(params) {
	const profileId = normalizeOptionalString(params.profileId);
	if (profileId) {
		if (!Object.hasOwn(params.cfg.cloudWorkers?.profiles ?? {}, profileId)) return err(`cloud worker profile is not configured: ${profileId}`);
		const machineClass = normalizeOptionalString(params.machineClass);
		if (params.machineClass !== void 0 && !machineClass) return err("cloud worker machine class must be non-empty");
		return ok({
			profileId,
			...machineClass ? { machineClass } : {}
		});
	}
	const deviceId = normalizeOptionalString(params.deviceId);
	if (!deviceId) return ok(void 0);
	return ok({
		profileId: `device:${deviceId}`,
		deviceId,
		inheritedProfile: {
			providerId: DEVICE_WORKER_PROVIDER_ID,
			profileSnapshot: {
				install: "bundle",
				settings: { device: deviceId }
			}
		}
	});
}
//#endregion
export { resolveDevicePlacementEligibility as n, resolveWorkerPlacementDestination as t };
