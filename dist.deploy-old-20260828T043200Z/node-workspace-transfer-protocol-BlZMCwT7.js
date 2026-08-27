//#region src/worker/node-workspace-transfer-protocol.ts
const NODE_WORKSPACE_TRANSFER_PATH = "/__openclaw__/worker-transfer/v1";
const NODE_WORKSPACE_TRANSFER_ERROR_CODE = "WORKSPACE_TRANSFER_FAILED";
var NodeWorkerWorkspaceTransferError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.code = NODE_WORKSPACE_TRANSFER_ERROR_CODE;
		this.name = "NodeWorkerWorkspaceTransferError";
	}
};
function nodeWorkspaceTransferEnvironmentPath(environmentId) {
	return `${NODE_WORKSPACE_TRANSFER_PATH}/environments/${encodeURIComponent(environmentId)}`;
}
function nodeWorkspaceTransferManifestPath(environmentId, manifestRef) {
	return `${nodeWorkspaceTransferEnvironmentPath(environmentId)}/snapshots/${manifestRef.slice(7)}/manifest`;
}
function nodeWorkspaceTransferPackPath(environmentId, manifestRef) {
	return `${nodeWorkspaceTransferEnvironmentPath(environmentId)}/snapshots/${manifestRef.slice(7)}/pack`;
}
function nodeWorkspaceTransferBlobPath(environmentId, sha256) {
	return `${nodeWorkspaceTransferEnvironmentPath(environmentId)}/blobs/${sha256}`;
}
function nodeWorkspaceTransferReconcilePath(environmentId, baseManifestRef) {
	return `${nodeWorkspaceTransferEnvironmentPath(environmentId)}/reconciliations/${baseManifestRef.slice(7)}`;
}
//#endregion
export { nodeWorkspaceTransferManifestPath as a, nodeWorkspaceTransferBlobPath as i, NODE_WORKSPACE_TRANSFER_PATH as n, nodeWorkspaceTransferPackPath as o, NodeWorkerWorkspaceTransferError as r, nodeWorkspaceTransferReconcilePath as s, NODE_WORKSPACE_TRANSFER_ERROR_CODE as t };
