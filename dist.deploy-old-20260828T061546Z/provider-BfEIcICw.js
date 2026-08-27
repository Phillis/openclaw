import { n as isMemoryOnlyMigration } from "./memory-CQxeG9ap.js";
import { n as hasHermesSource, t as discoverHermesSource } from "./source-CIcAcT0K.js";
import { t as buildHermesPlan } from "./plan-DvzLqGUS.js";
import { t as applyHermesPlan } from "./apply-BWqZSgRD.js";
//#region extensions/migrate-hermes/provider.ts
function buildHermesMigrationProvider(params = {}) {
	return {
		id: "hermes",
		label: "Hermes",
		description: "Import Hermes config, memories, skills, and supported credentials.",
		supportedItemKinds: ["memory"],
		async detect(ctx) {
			const source = await discoverHermesSource(ctx.source);
			const found = isMemoryOnlyMigration(ctx) ? Boolean(source.memoryPath || source.userPath) : hasHermesSource(source);
			return {
				found,
				source: source.root,
				label: "Hermes",
				confidence: found ? "high" : "low",
				message: found ? "Hermes state found." : "Hermes state not found."
			};
		},
		plan: buildHermesPlan,
		async apply(ctx, plan) {
			return await applyHermesPlan({
				ctx,
				plan,
				runtime: params.runtime
			});
		}
	};
}
//#endregion
export { buildHermesMigrationProvider as t };
