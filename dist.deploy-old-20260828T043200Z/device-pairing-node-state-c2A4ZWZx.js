import { S as loadPairedDevicePairingStoreRecord } from "./device-bootstrap-DpkEF5MF.js";
import { _ as resolveNodePairingState, g as resolveNodePairingGeneration, i as hasEffectivePairedDeviceRole, n as getPairedDevice } from "./device-pairing-Li5h-3GZ.js";
//#region src/infra/device-pairing-node-state.ts
function toPairedDeviceNodeBinding(state) {
	return state ? {
		identity: state.identity.key,
		...state.generation ? { generation: state.generation.key } : {}
	} : void 0;
}
async function captureNodePairingState(nodeId, baseDir) {
	return resolveNodePairingState(await getPairedDevice(nodeId, baseDir));
}
async function resolveCurrentPairedDeviceNodeBinding(nodeId) {
	return toPairedDeviceNodeBinding(await captureNodePairingState(nodeId));
}
function isPairedDeviceNodeBindingCurrent(nodeId, expected) {
	const current = toPairedDeviceNodeBinding(resolveNodePairingState(loadPairedDevicePairingStoreRecord(nodeId)));
	return Boolean(current && current.identity === expected.identity && (!expected.generation || current.generation === expected.generation));
}
async function captureNodePairingGeneration(nodeId) {
	return (await captureNodePairingState(nodeId))?.generation ?? null;
}
/** Binds a connected session to the exact device key and node token used for authentication. */
async function captureAuthenticatedNodePairingState(params) {
	const device = await getPairedDevice(params.nodeId, params.baseDir);
	if (!device || device.publicKey !== params.publicKey || device.tokens?.node?.token !== params.token || !hasEffectivePairedDeviceRole(device, "node")) return null;
	return resolveNodePairingState(device);
}
async function isNodePairingGenerationCurrent(generation) {
	return resolveNodePairingGeneration(await getPairedDevice(generation.nodeId))?.key === generation.key;
}
//#endregion
export { isPairedDeviceNodeBindingCurrent as a, isNodePairingGenerationCurrent as i, captureNodePairingGeneration as n, resolveCurrentPairedDeviceNodeBinding as o, captureNodePairingState as r, captureAuthenticatedNodePairingState as t };
