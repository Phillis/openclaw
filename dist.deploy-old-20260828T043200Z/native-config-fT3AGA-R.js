//#region node_modules/@openclaw/fs-safe/dist/native-config.js
let overrideConfig = {};
let legacyWarningEmitted = false;
const legacyModeEnvKeys = ["FS_SAFE_PYTHON_MODE", "OPENCLAW_FS_SAFE_PYTHON_MODE"];
const legacyPathEnvKeys = [
	"FS_SAFE_PYTHON",
	"OPENCLAW_FS_SAFE_PYTHON",
	"OPENCLAW_PINNED_PYTHON",
	"OPENCLAW_PINNED_WRITE_PYTHON"
];
function parseMode(value) {
	if (!value) return;
	const normalized = value.trim().toLowerCase();
	if (normalized === "0" || normalized === "false" || normalized === "off" || normalized === "never") return "off";
	if (normalized === "1" || normalized === "true" || normalized === "on" || normalized === "auto") return "auto";
	if (normalized === "required" || normalized === "require") return "require";
}
function configureFsSafeNative(config) {
	overrideConfig = {
		...overrideConfig,
		...config
	};
}
function warnLegacyPythonConfiguration(source, mappedMode) {
	if (legacyWarningEmitted) return;
	legacyWarningEmitted = true;
	process.emitWarning(`${source} is a deprecated 0.4 compatibility bridge; mapped to native mode "${mappedMode}". Use configureFsSafeNative({ mode: "${mappedMode}" }) or FS_SAFE_NATIVE_MODE=${mappedMode}. Python interpreter paths are no longer used.`, {
		code: "FS_SAFE_PYTHON_DEPRECATED",
		type: "DeprecationWarning"
	});
}
function readLegacyPythonMode() {
	const configuredKeys = [...legacyModeEnvKeys, ...legacyPathEnvKeys].filter((key) => process.env[key] !== void 0);
	if (configuredKeys.length === 0) return;
	const mappedMode = parseMode(legacyModeEnvKeys.map((key) => process.env[key]).find((value) => value !== void 0)) ?? "auto";
	warnLegacyPythonConfiguration(`Legacy ${configuredKeys.join(", ")}`, mappedMode);
	return mappedMode;
}
function getFsSafeNativeConfig() {
	const legacyMode = readLegacyPythonMode();
	return { mode: overrideConfig.mode ?? parseMode(process.env.FS_SAFE_NATIVE_MODE) ?? parseMode(process.env.OPENCLAW_FS_SAFE_NATIVE_MODE) ?? legacyMode ?? "auto" };
}
//#endregion
export { getFsSafeNativeConfig as n, configureFsSafeNative as t };
