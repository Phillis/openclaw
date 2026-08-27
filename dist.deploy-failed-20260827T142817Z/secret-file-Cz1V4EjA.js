import "./fs-safe-defaults-BPVQr7Lx.js";
import { t as FsSafeError } from "./errors-CQDiIdj7.js";
import { a as readSecretFileSync, o as tryReadSecretFileSync$1 } from "./secret-file-CSNlJNCL.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./utils-DEqefz4f.js";
//#region src/infra/secret-file.ts
function tryReadSecretFileSync(filePath, label, options = {}, diagnostic) {
	if ("credentialDiagnostic" in options) {
		const { credentialDiagnostic, ...readOptions } = options;
		if (!filePath?.trim()) return;
		try {
			return readSecretFileSync(filePath, label, readOptions);
		} catch (error) {
			if (!(error instanceof FsSafeError)) throw error;
			credentialDiagnostic.report({
				code: "CREDENTIAL_FILE_UNAVAILABLE",
				path: credentialDiagnostic.configPath,
				reason: error.code
			});
			return;
		}
	}
	if (!diagnostic) return tryReadSecretFileSync$1(filePath, label, options);
	if (!filePath?.trim()) return { status: "missing" };
	try {
		return {
			status: "available",
			value: readSecretFileSync(filePath, label, options)
		};
	} catch (error) {
		if (!(error instanceof FsSafeError)) throw error;
		return {
			status: "configured_unavailable",
			diagnostic: {
				code: "CREDENTIAL_FILE_UNAVAILABLE",
				path: diagnostic.configPath,
				reason: error.code
			}
		};
	}
}
/** @deprecated Use readSecretFileSync() or tryReadSecretFileSync(). */
function loadSecretFileSync(filePath, label, options = {}) {
	const resolvedPath = resolveUserPath(filePath.trim());
	if (!resolvedPath) return {
		ok: false,
		message: `${label} file path is empty.`
	};
	try {
		return {
			ok: true,
			secret: readSecretFileSync(filePath, label, options),
			resolvedPath
		};
	} catch (error) {
		return {
			ok: false,
			message: error instanceof Error ? error.message : String(error),
			resolvedPath,
			error
		};
	}
}
//#endregion
export { tryReadSecretFileSync as n, loadSecretFileSync as t };
