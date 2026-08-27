import { i as registerSecretValueForRedaction } from "./secret-redaction-registry-gIFE-2_j.js";
import { i as generateSecureToken } from "./secure-random-Ds4AFLgz.js";
import "./worker-bundle-limits-BFwcdQuE.js";
import { n as workerBootstrapOperationTimeoutMs } from "./bootstrap-CfZygi6V.js";
import fs from "node:fs/promises";
//#region src/gateway/worker-environments/node-worker-bundle-transfer-service.ts
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/u;
function mintToken(generateToken) {
	const token = generateToken(32);
	if (!TOKEN_PATTERN.test(token)) throw new Error("Worker bundle transfer token generator returned an invalid bearer");
	registerSecretValueForRedaction(token);
	return token;
}
function createNodeWorkerBundleTransferService(options = {}) {
	const now = options.now ?? Date.now;
	const generateToken = options.generateToken ?? generateSecureToken;
	const capabilities = /* @__PURE__ */ new Map();
	const isCurrent = (capability) => capabilities.get(capability.token) === capability && capability.state === "serving" && capability.expiresAtMs > now() && !capability.abortController.signal.aborted && capability.isAuthorized();
	const revokeCapability = (capability) => {
		if (capabilities.get(capability.token) === capability) capabilities.delete(capability.token);
		capability.stopWatchingSignal?.();
		if (!capability.abortController.signal.aborted) capability.abortController.abort(/* @__PURE__ */ new Error("Worker bundle transfer capability closed"));
	};
	return {
		prepare(params) {
			if (!Number.isSafeInteger(params.artifact.tarballBytes) || params.artifact.tarballBytes < 1 || params.artifact.tarballBytes > 536870912) throw new Error("Worker bundle archive exceeds the node transfer limit");
			if (!params.isAuthorized()) throw new Error("Worker bundle transfer authority is unavailable");
			const token = mintToken(generateToken);
			const abortController = new AbortController();
			const capability = {
				token,
				nodeId: params.node.nodeId,
				connId: params.node.connId,
				pairingGeneration: params.node.pairingGeneration,
				gatewayNamespace: params.gatewayNamespace,
				artifact: params.artifact,
				expiresAtMs: now() + workerBootstrapOperationTimeoutMs(params.artifact),
				state: "ready",
				abortController,
				isAuthorized: params.isAuthorized
			};
			if (params.signal) {
				const abort = () => revokeCapability(capability);
				params.signal.addEventListener("abort", abort, { once: true });
				capability.stopWatchingSignal = () => params.signal?.removeEventListener("abort", abort);
				if (params.signal.aborted) abort();
			}
			if (abortController.signal.aborted) throw new Error("Worker bundle transfer authority is unavailable");
			capabilities.set(token, capability);
			return {
				token,
				input: {
					gatewayNamespace: params.gatewayNamespace,
					...params.bundlePrewarm ? { bundlePrewarm: params.bundlePrewarm } : {},
					build: {
						bundleHash: params.artifact.bundleHash,
						openclawVersion: params.artifact.openclawVersion,
						protocolFeatures: [...params.artifact.protocolFeatures]
					},
					archive: {
						token,
						sha256: params.artifact.tarballSha256,
						bytes: params.artifact.tarballBytes
					}
				}
			};
		},
		authorize(params) {
			const capability = capabilities.get(params.token);
			if (!capability || capability.state !== "ready" || capability.expiresAtMs <= now() || capability.abortController.signal.aborted || !capability.isAuthorized() || capability.artifact.bundleHash !== params.bundleHash) return;
			capability.state = "serving";
			return capability;
		},
		isAuthorizationCurrent: isCurrent,
		authorizationSignal(capability) {
			return capability.abortController.signal;
		},
		async file(capability) {
			if (!isCurrent(capability)) return null;
			const stats = await fs.lstat(capability.artifact.tarballPath);
			if (stats.isSymbolicLink() || !stats.isFile() || stats.size !== capability.artifact.tarballBytes || !isCurrent(capability)) return null;
			return {
				path: capability.artifact.tarballPath,
				bytes: capability.artifact.tarballBytes,
				sha256: capability.artifact.tarballSha256
			};
		},
		revoke(capabilityOrToken) {
			const capability = typeof capabilityOrToken === "string" ? capabilities.get(capabilityOrToken) : capabilityOrToken;
			if (capability) revokeCapability(capability);
		},
		closeAll() {
			for (const capability of capabilities.values()) revokeCapability(capability);
		}
	};
}
//#endregion
export { createNodeWorkerBundleTransferService };
