import { createHash } from "node:crypto";
//#region src/gateway/worker-environments/service-contract.ts
function deriveEnvironmentIntent(idempotencyKey) {
	const digest = createHash("sha256").update(idempotencyKey).digest("hex");
	return {
		environmentId: `worker:${digest.slice(0, 32)}`,
		provisionOperationId: `provision:v2:${digest}`
	};
}
//#endregion
export { deriveEnvironmentIntent as t };
