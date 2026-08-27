import "./worker-admission-v0PuudgP.js";
import { g as NODE_WORKER_BUNDLE_INSTALL_COMMAND } from "./node-commands-DRxP7loh.js";
import { n as workerBootstrapOperationTimeoutMs } from "./bootstrap-CfZygi6V.js";
import { o as parseNodeWorkerBundleInstallResult } from "./node-bundle-install-protocol-C5qCRbvl.js";
import { o as verifyWorkerAdmissionHandshake } from "./admission-CzKwSq5g.js";
//#region src/gateway/worker-environments/node-worker-bundle-installer.ts
function createGatewayNodeWorkerBundleInstaller(options) {
	return async (params) => {
		const transport = options.getTransport();
		if (!transport) throw new Error("Device worker node transport is unavailable");
		const node = (await transport.listCurrentNodes()).find((candidate) => candidate.nodeId === params.deviceId);
		if (!node) throw new Error("Device worker node is not connected with the installer dialect");
		const artifact = await options.prepareBundle();
		const isAuthorized = () => transport.isCurrent(node);
		const bundlePrewarm = (node.workerHost.bundlePrewarm ?? 0) >= 1 ? 1 : void 0;
		const prepared = options.transfer.prepare({
			node,
			gatewayNamespace: options.gatewayNamespace,
			artifact,
			...bundlePrewarm ? { bundlePrewarm } : {},
			isAuthorized,
			signal: params.signal
		});
		try {
			const result = await transport.invoke({
				node,
				command: NODE_WORKER_BUNDLE_INSTALL_COMMAND,
				params: prepared.input,
				timeoutMs: workerBootstrapOperationTimeoutMs(artifact),
				idempotencyKey: `${options.gatewayNamespace}:${artifact.bundleHash}`,
				isDispatchAuthorized: isAuthorized,
				...params.signal ? { signal: params.signal } : {}
			});
			if (!result.ok) throw new Error(result.error?.message ? `Device worker bundle installation failed: ${result.error.message}` : "Device worker bundle installation failed");
			let payload = result.payload;
			if (result.payloadJSON) try {
				payload = JSON.parse(result.payloadJSON);
			} catch {
				payload = void 0;
			}
			const receipt = parseNodeWorkerBundleInstallResult(payload);
			if (!receipt || !verifyWorkerAdmissionHandshake(receipt, artifact)) throw new Error("Device worker bundle installer returned a mismatched build receipt");
			return receipt;
		} finally {
			options.transfer.revoke(prepared.token);
		}
	};
}
//#endregion
export { createGatewayNodeWorkerBundleInstaller };
