//#region src/infra/process-env.ts
/** Read one environment value using the same Windows key precedence as child_process. */
function resolveEnvironmentValue(env, name, platform = process.platform) {
	if (!env) return;
	if (platform !== "win32") return env[name] ?? (name === "PATH" ? env.Path : void 0);
	const normalizedName = name.toUpperCase();
	const key = Object.keys(env).toSorted().find((candidate) => candidate.toUpperCase() === normalizedName);
	return key === void 0 ? void 0 : env[key];
}
/** Merge child environments while preserving Node's platform-specific key semantics. */
function mergeProcessEnv(sources, platform = process.platform) {
	const merged = {};
	for (const source of sources) {
		if (!source) continue;
		const keys = Object.keys(source);
		const sourceKeys = /* @__PURE__ */ new Set();
		for (const key of platform === "win32" ? keys.toSorted() : keys) {
			if (platform === "win32") {
				const normalizedKey = key.toUpperCase();
				if (sourceKeys.has(normalizedKey)) continue;
				sourceKeys.add(normalizedKey);
				for (const previousKey of Object.keys(merged)) if (previousKey.toUpperCase() === normalizedKey) delete merged[previousKey];
			}
			const value = source[key];
			if (value === void 0) delete merged[key];
			else merged[key] = value;
		}
	}
	return merged;
}
//#endregion
export { resolveEnvironmentValue as n, mergeProcessEnv as t };
