import { d as isRootVersionInvocation } from "./argv-ubyZhwcH.js";
import { r as resolveCliContainerTarget } from "./container-target-BxmLKL0n.js";
//#region src/entry.version-fast-path.ts
function tryHandleRootVersionFastPath(argv, deps = {}) {
	if (resolveCliContainerTarget(argv, deps.env)) return false;
	if (!isRootVersionInvocation(argv)) return false;
	const output = deps.output ?? ((message) => console.log(message));
	const exit = deps.exit ?? ((code) => process.exit(code));
	const onError = deps.onError ?? (async (error) => {
		const message = `[openclaw] Failed to resolve version: ${error instanceof Error ? error.stack ?? error.message : String(error)}\n`;
		try {
			const [{ loadCliDotEnv }, { formatConsoleDiagnosticBlock }] = await Promise.all([import("./dotenv-CbzVTcDw.js"), import("./json-console-line-BVGe0_he.js")]);
			loadCliDotEnv({ quiet: true });
			process.stderr.write(formatConsoleDiagnosticBlock({
				level: "error",
				message
			}));
		} catch {
			process.stderr.write(message);
		} finally {
			exit(1);
		}
	});
	(deps.resolveVersion ?? (async () => {
		const [{ VERSION }, { resolveCommitHash }] = await Promise.all([import("./version-qnM0RpgZ.js"), import("./git-commit-CaUGcoMK.js")]);
		return {
			VERSION,
			resolveCommitHash
		};
	}))().then(({ VERSION, resolveCommitHash }) => {
		const commit = resolveCommitHash({ moduleUrl: deps.moduleUrl ?? import.meta.url });
		output(commit ? `OpenClaw ${VERSION} (${commit})` : `OpenClaw ${VERSION}`);
		exit(0);
	}).catch(onError);
	return true;
}
//#endregion
export { tryHandleRootVersionFastPath as t };
