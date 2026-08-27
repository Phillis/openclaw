//#region src/flows/health-check-adapter.ts
function defineSplitHealthCheckInput(check) {
	return {
		...check,
		sourceContract: "split"
	};
}
/** Wraps a detect/repair health check in the runnable health-check contract. */
function defineSplitHealthCheck(check) {
	return {
		id: check.id,
		kind: check.kind,
		description: check.description,
		source: check.source,
		defaultEnabled: check.defaultEnabled,
		sourceContract: "split",
		detect: (ctx, scope) => check.detect(ctx, scope),
		repair: check.repair === void 0 ? void 0 : (ctx, findings) => check.repair?.(ctx, findings) ?? Promise.resolve({ changes: [] }),
		async run(ctx, scope) {
			const findings = await check.detect(ctx, scope);
			if (findings.length === 0 || check.repair === void 0 || !ctx.repair && ctx.previewRepair !== true) return { findings };
			const repairResult = await check.repair({
				...ctx,
				mode: "fix",
				dryRun: !ctx.repair,
				diff: ctx.diff === true
			}, findings);
			return {
				findings,
				config: ctx.repair ? repairResult.config : void 0,
				changes: repairResult.changes,
				warnings: repairResult.warnings,
				diffs: repairResult.diffs,
				effects: repairResult.effects,
				status: ctx.repair ? repairResult.status : repairResult.status ?? "repairable",
				reason: repairResult.reason
			};
		}
	};
}
/** Normalizes any supported health-check shape before lint/fix execution. */
function normalizeHealthCheck(check) {
	if (check.sourceContract === "split") return defineSplitHealthCheck(check);
	return {
		id: check.id,
		kind: check.kind,
		description: check.description,
		source: check.source,
		defaultEnabled: check.defaultEnabled,
		sourceContract: "run",
		async detect(ctx, scope) {
			return (await check.run({
				...ctx,
				repair: false
			}, scope)).findings ?? [];
		},
		run: (ctx, scope) => check.run(ctx, scope)
	};
}
//#endregion
export { normalizeHealthCheck as n, defineSplitHealthCheckInput as t };
