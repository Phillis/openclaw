import "./src-BkwWvwB2.js";
import { t as stableStringify } from "./stable-stringify-DoZ6Yalc.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import "./agent-scope-BizOtGGz.js";
import { n as normalizeAgentId, t as isValidAgentId } from "./agent-id-Db0rqw_J.js";
import { a as listAgentIds, d as resolveAgentWorkspaceDir } from "./agent-scope-config-BdXMWufB.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { Td as validateMigrationsMemoryPlanParams, wd as validateMigrationsMemoryApplyParams } from "./src-BlUKtAtD.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { y as summarizeMigrationItems } from "./migration-q6QzXKht.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
import { n as listMemoryMigrationProviders, r as planProviderMemoryImport, t as applyProviderMemoryImport } from "./memory-import-iiw_E7QZ.js";
import crypto from "node:crypto";
//#region src/gateway/server-methods/migrations.ts
const MEMORY_APPLY_DEDUPE_PREFIX = "migrations.memory.apply:";
const activeApplies = /* @__PURE__ */ new Set();
function emptySummary() {
	return summarizeMigrationItems([]);
}
const inFlightMemoryApplies = /* @__PURE__ */ new WeakMap();
function memoryApplyInflightMap(dedupe) {
	let active = inFlightMemoryApplies.get(dedupe);
	if (!active) {
		active = /* @__PURE__ */ new Map();
		inFlightMemoryApplies.set(dedupe, active);
	}
	return active;
}
function memoryApplyRequestFingerprint(params) {
	return stableStringify({
		agentId: params.agentId,
		providerId: params.providerId,
		planFingerprint: params.planFingerprint,
		itemIds: params.itemIds,
		overwrite: params.overwrite === true
	});
}
function isCachedMemoryApply(value) {
	if (!value || typeof value !== "object") return false;
	const candidate = value;
	return typeof candidate.requestFingerprint === "string" && candidate.result !== void 0;
}
function toWireItem(item) {
	return {
		id: item.id,
		status: item.status,
		...item.source ? { source: item.source } : {},
		...item.target ? { target: item.target } : {},
		...item.message !== void 0 ? { message: item.message } : {},
		...item.reason !== void 0 ? { reason: item.reason } : {},
		...item.details !== void 0 ? { details: item.details } : {}
	};
}
function fingerprintMemoryPlan(params) {
	return crypto.createHash("sha256").update(stableStringify({
		version: 3,
		agentId: params.agentId,
		workspace: params.workspace,
		providerId: params.providerId,
		overwrite: params.overwrite === true,
		plan: params.plan
	})).digest("hex");
}
function targetAgentOrRespond(rawAgentId, config, respond) {
	if (!isValidAgentId(rawAgentId)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid agent id"));
		return;
	}
	const agentId = normalizeAgentId(rawAgentId);
	if (!new Set(listAgentIds(config)).has(agentId)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown agent id"));
		return;
	}
	return agentId;
}
async function planMemoryProvider(params) {
	const base = {
		providerId: params.provider.id,
		label: params.provider.label,
		...params.provider.description ? { description: params.provider.description } : {}
	};
	try {
		const { detection, plan } = await planProviderMemoryImport({
			provider: params.provider,
			config: params.config,
			agentId: params.agentId,
			overwrite: params.overwrite
		});
		if (detection && !detection.found) return {
			...base,
			found: false,
			...detection.source ? { source: detection.source } : {},
			...detection.confidence ? { confidence: detection.confidence } : {},
			...detection.message ? { message: detection.message } : {},
			summary: emptySummary(),
			items: []
		};
		const found = plan.items.length > 0;
		const workspace = resolveAgentWorkspaceDir(params.config, params.agentId);
		return {
			...base,
			found,
			planFingerprint: fingerprintMemoryPlan({
				agentId: params.agentId,
				workspace,
				providerId: params.provider.id,
				overwrite: params.overwrite,
				plan
			}),
			source: plan.source,
			...plan.target ? { target: plan.target } : {},
			...detection?.confidence ? { confidence: detection.confidence } : {},
			...detection?.message ? { message: detection.message } : {},
			summary: plan.summary,
			items: plan.items.map(toWireItem),
			...plan.warnings?.length ? { warnings: plan.warnings } : {}
		};
	} catch (error) {
		return {
			...base,
			found: false,
			error: formatErrorMessage(error),
			summary: emptySummary(),
			items: []
		};
	}
}
function findMemoryProvider(providers, providerId) {
	return providers.find((provider) => provider.id === providerId);
}
const migrationsHandlers = {
	"migrations.memory.plan": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateMigrationsMemoryPlanParams, "migrations.memory.plan", respond)) return;
		const config = context.getRuntimeConfig();
		const agentId = targetAgentOrRespond(params.agentId, config, respond);
		if (!agentId) return;
		const providers = listMemoryMigrationProviders(config);
		const planned = await Promise.all(providers.map(async (provider) => await planMemoryProvider({
			provider,
			config,
			agentId,
			overwrite: params.overwrite
		})));
		respond(true, {
			agentId,
			workspace: resolveAgentWorkspaceDir(config, agentId),
			providers: planned
		}, void 0);
	},
	"migrations.memory.apply": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateMigrationsMemoryApplyParams, "migrations.memory.apply", respond)) return;
		const config = context.getRuntimeConfig();
		const agentId = targetAgentOrRespond(params.agentId, config, respond);
		if (!agentId) return;
		const requestFingerprint = memoryApplyRequestFingerprint({
			agentId,
			providerId: params.providerId,
			planFingerprint: params.planFingerprint,
			itemIds: params.itemIds,
			overwrite: params.overwrite
		});
		const dedupeKey = `${MEMORY_APPLY_DEDUPE_PREFIX}${params.idempotencyKey}`;
		const cached = context.dedupe.get(dedupeKey);
		if (cached && isCachedMemoryApply(cached.payload)) {
			if (cached.payload.requestFingerprint !== requestFingerprint) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "memory import idempotency key was reused"));
				return;
			}
			respond(true, cached.payload.result, void 0, { cached: true });
			return;
		}
		const provider = findMemoryProvider(listMemoryMigrationProviders(config), params.providerId);
		if (!provider) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown memory migration provider"));
			return;
		}
		const inFlightMap = memoryApplyInflightMap(context.dedupe);
		const inFlight = inFlightMap.get(dedupeKey);
		if (inFlight) {
			if (inFlight.requestFingerprint !== requestFingerprint) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "memory import idempotency key was reused"));
				return;
			}
			const outcome = await inFlight.completion;
			if (outcome.ok) respond(true, outcome.result, void 0, { cached: true });
			else respond(false, void 0, outcome.error, { cached: true });
			return;
		}
		let settle;
		const completion = new Promise((resolve) => {
			settle = resolve;
		});
		inFlightMap.set(dedupeKey, {
			requestFingerprint,
			completion
		});
		const complete = (outcome) => {
			settle(outcome);
			if (outcome.ok) respond(true, outcome.result, void 0);
			else respond(false, void 0, outcome.error);
		};
		const applyKey = `${agentId}:${provider.id}`;
		if (activeApplies.has(applyKey)) {
			complete({
				ok: false,
				error: errorShape(ErrorCodes.UNAVAILABLE, "memory import already running", {
					retryable: true,
					retryAfterMs: 1e3
				})
			});
			inFlightMap.delete(dedupeKey);
			return;
		}
		activeApplies.add(applyKey);
		try {
			const { plan } = await planProviderMemoryImport({
				provider,
				config,
				agentId,
				overwrite: params.overwrite
			});
			if (fingerprintMemoryPlan({
				agentId,
				workspace: resolveAgentWorkspaceDir(config, agentId),
				providerId: provider.id,
				overwrite: params.overwrite,
				plan
			}) !== params.planFingerprint) {
				complete({
					ok: false,
					error: errorShape(ErrorCodes.INVALID_REQUEST, "memory migration plan changed; refresh the plan before importing")
				});
				return;
			}
			const selectable = new Map(plan.items.filter((item) => item.status === "planned" || item.status === "conflict").map((item) => [item.id, item]));
			const unavailable = params.itemIds.filter((id) => !selectable.has(id));
			if (unavailable.length > 0) {
				complete({
					ok: false,
					error: errorShape(ErrorCodes.INVALID_REQUEST, `memory migration items changed; refresh the plan (${unavailable.join(", ")})`)
				});
				return;
			}
			const selectedConflicts = params.itemIds.filter((id) => selectable.get(id)?.status === "conflict");
			if (!params.overwrite && selectedConflicts.length > 0) {
				complete({
					ok: false,
					error: errorShape(ErrorCodes.INVALID_REQUEST, "selected memory was already imported; enable replacement and refresh the plan")
				});
				return;
			}
			const applied = await applyProviderMemoryImport({
				provider,
				config,
				agentId,
				itemIds: params.itemIds,
				overwrite: params.overwrite,
				preflightPlan: plan
			});
			const result = {
				providerId: applied.providerId,
				source: applied.source,
				...applied.target ? { target: applied.target } : {},
				summary: applied.summary,
				items: applied.items.map(toWireItem),
				...applied.warnings?.length ? { warnings: applied.warnings } : {},
				...applied.backupPath ? { backupPath: applied.backupPath } : {},
				...applied.reportDir ? { reportDir: applied.reportDir } : {}
			};
			context.dedupe.set(dedupeKey, {
				ts: Date.now(),
				ok: true,
				payload: {
					requestFingerprint,
					result
				}
			});
			complete({
				ok: true,
				result
			});
		} catch (error) {
			complete({
				ok: false,
				error: errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error))
			});
		} finally {
			activeApplies.delete(applyKey);
			inFlightMap.delete(dedupeKey);
		}
	}
};
//#endregion
export { migrationsHandlers };
