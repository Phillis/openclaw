import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { d as AUTH_RATE_LIMIT_SCOPE_WORKER_TRANSFER } from "./auth-rate-limit-C6x9QPnp.js";
import { n as withSerializedRateLimitAttempt } from "./rate-limit-attempt-serialization-YzBasB1g.js";
import { m as watchClientDisconnect, s as sendJson } from "./http-common-m4pDgMA2.js";
import { a as classifyNodeWorkerBundleTransferPath } from "./gateway-http-route-contracts-ByqHS7gV.js";
import { n as NODE_WORKER_BUNDLE_TRANSFER_PATH } from "./node-bundle-install-protocol-C5qCRbvl.js";
import fs from "node:fs";
import { pipeline } from "node:stream/promises";
//#region src/gateway/worker-environments/node-worker-bundle-transfer-http.ts
const SHA256_PATTERN = /^[a-f0-9]{64}$/u;
const OPAQUE_NOT_FOUND = { error: "not_found" };
function parseRoute(pathname, method) {
	if (method !== "GET" || !pathname.startsWith(`/__openclaw__/worker-bundle/v1/bundles/`)) return;
	const hash = pathname.slice(`${NODE_WORKER_BUNDLE_TRANSFER_PATH}/bundles/`.length);
	return SHA256_PATTERN.test(hash) ? hash : void 0;
}
function bearerToken(req) {
	const authorization = normalizeOptionalString(req.headers.authorization);
	if (!authorization?.toLowerCase().startsWith("bearer ")) return;
	return normalizeOptionalString(authorization.slice(7));
}
function sendOpaqueNotFound(res) {
	sendJson(res, 404, OPAQUE_NOT_FOUND);
}
async function handleNodeWorkerBundleTransferHttpRequest(params) {
	const parsed = URL.parse(params.req.url ?? "/", "http://localhost");
	if (!parsed?.pathname || classifyNodeWorkerBundleTransferPath(parsed.pathname) === "outside") return false;
	params.res.setHeader("Cache-Control", "no-store");
	const bundleHash = parseRoute(parsed.pathname, params.req.method);
	if (!bundleHash || parsed.search) {
		sendOpaqueNotFound(params.res);
		return true;
	}
	const bearer = bearerToken(params.req);
	const admission = await withSerializedRateLimitAttempt({
		ip: params.clientIp,
		scope: AUTH_RATE_LIMIT_SCOPE_WORKER_TRANSFER,
		run: async () => {
			const rateCheck = params.rateLimiter?.check(params.clientIp, AUTH_RATE_LIMIT_SCOPE_WORKER_TRANSFER);
			if (rateCheck && !rateCheck.allowed) return {
				kind: "rate-limited",
				retryAfterMs: rateCheck.retryAfterMs
			};
			const outcome = bearer && params.callback ? await params.callback({
				req: params.req,
				res: params.res,
				bundleHash,
				bearer
			}) : { kind: "unauthorized" };
			if (outcome.kind === "unauthorized") params.rateLimiter?.recordFailure(params.clientIp, AUTH_RATE_LIMIT_SCOPE_WORKER_TRANSFER);
			else params.rateLimiter?.reset(params.clientIp, AUTH_RATE_LIMIT_SCOPE_WORKER_TRANSFER);
			return outcome;
		}
	});
	if (admission.kind === "rate-limited") {
		if (admission.retryAfterMs > 0) params.res.setHeader("Retry-After", String(Math.ceil(admission.retryAfterMs / 1e3)));
		sendJson(params.res, 429, { error: "rate_limited" });
		return true;
	}
	if (admission.kind === "unauthorized") {
		sendOpaqueNotFound(params.res);
		return true;
	}
	await admission.handle();
	return true;
}
function createNodeWorkerBundleTransferHttpCallback(service) {
	return async ({ req, res, bundleHash, bearer }) => {
		const authorization = service.authorize({
			token: bearer,
			bundleHash
		});
		if (!authorization) return { kind: "unauthorized" };
		return {
			kind: "authorized",
			handle: async () => {
				const clientAbort = new AbortController();
				const stopWatchingDisconnect = watchClientDisconnect(req, res, clientAbort);
				const timeoutMs = Math.max(1, authorization.expiresAtMs - Date.now());
				const signal = AbortSignal.any([
					service.authorizationSignal(authorization),
					clientAbort.signal,
					AbortSignal.timeout(timeoutMs)
				]);
				try {
					const file = await service.file(authorization);
					if (!file || signal.aborted || !service.isAuthorizationCurrent(authorization)) {
						sendOpaqueNotFound(res);
						return;
					}
					res.writeHead(200, {
						"content-type": "application/octet-stream",
						"content-length": String(file.bytes),
						"x-openclaw-content-sha256": file.sha256
					});
					await pipeline(fs.createReadStream(file.path), res, { signal });
				} catch (error) {
					if (!signal.aborted && !res.destroyed) throw error;
				} finally {
					stopWatchingDisconnect();
					service.revoke(authorization);
				}
			}
		};
	};
}
//#endregion
export { handleNodeWorkerBundleTransferHttpRequest as n, createNodeWorkerBundleTransferHttpCallback as t };
