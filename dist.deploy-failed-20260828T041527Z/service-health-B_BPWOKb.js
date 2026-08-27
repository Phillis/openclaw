import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
//#region src/plugins/service-health.ts
/** Keeps plugin service failures scoped to the registry generation that owns them. */
const states = /* @__PURE__ */ new WeakMap();
function createPluginServiceHealthGeneration(registry) {
	const generation = Symbol("plugin-service-health-generation");
	const state = {
		generation,
		failures: /* @__PURE__ */ new Map()
	};
	states.set(registry, state);
	const ownsGeneration = () => states.get(registry)?.generation === generation;
	return {
		createReporter(service) {
			let active = true;
			const canReport = () => active && ownsGeneration();
			return {
				health: {
					reportFailure: (error) => {
						if (!canReport()) return;
						state.failures.set(service.service.id, {
							pluginId: service.pluginId,
							serviceId: service.service.id,
							origin: service.origin,
							error: formatErrorMessage(error)
						});
					},
					clearFailure: () => {
						if (canReport()) state.failures.delete(service.service.id);
					}
				},
				revoke: () => {
					active = false;
				}
			};
		},
		retire: () => {
			if (ownsGeneration()) states.delete(registry);
		}
	};
}
function listPluginServiceHealthFailures(registry) {
	return [...states.get(registry)?.failures.values() ?? []].toSorted((left, right) => left.pluginId.localeCompare(right.pluginId) || left.serviceId.localeCompare(right.serviceId));
}
//#endregion
export { listPluginServiceHealthFailures as n, createPluginServiceHealthGeneration as t };
