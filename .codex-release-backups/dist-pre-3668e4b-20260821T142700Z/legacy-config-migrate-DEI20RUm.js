import { N as validateConfigObjectWithPlugins, at as applyLegacyDoctorMigrations } from "./io-BTBpQ7uO.js";
//#region src/commands/doctor/shared/legacy-config-migrate.ts
/** Apply legacy migrations and validate the resulting OpenClaw config shape when possible. */
function migrateLegacyConfig(raw, context) {
	const { next, changes } = applyLegacyDoctorMigrations(raw, context);
	if (!next) return {
		config: null,
		changes: []
	};
	const validated = validateConfigObjectWithPlugins(context ? applyLegacyDoctorMigrations(context.resolvedRaw, context).next ?? context.resolvedRaw : next);
	if (!validated.ok) {
		changes.push("Migration applied; other validation issues remain — run doctor to review.");
		return {
			config: next,
			changes,
			partiallyValid: true
		};
	}
	return {
		config: validated.config,
		sourceConfig: next,
		changes
	};
}
//#endregion
export { migrateLegacyConfig as t };
