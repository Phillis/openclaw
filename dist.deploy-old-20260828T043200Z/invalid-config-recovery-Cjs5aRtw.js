import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import { t as ExitError } from "./runtime-LRpY2Icg.js";
import { r as isTerminalInteractive } from "./terminal-interactivity-DXUXAq5U.js";
//#region src/cli/invalid-config-recovery.ts
/** Offer a consent-gated doctor repair, then retry the failed operation once. */
async function offerInvalidConfigRecovery(params) {
	const command = formatCliCommand("openclaw doctor --fix");
	const printCommand = () => {
		params.runtime.error(`Run "${command}" to repair the config, then retry.`);
	};
	if (!(params.deps?.isInteractive ?? isTerminalInteractive)()) {
		printCommand();
		return { status: "declined" };
	}
	if (!await (params.deps?.confirm ?? (async (question, defaultYes) => {
		const { promptYesNo } = await import("./prompt-BgjBlZUk.js");
		return await promptYesNo(question, defaultYes);
	}))(`Run "${command}" now?`, true)) {
		printCommand();
		return { status: "declined" };
	}
	const runDoctor = params.deps?.runDoctor ?? (async (runtime) => {
		const { doctorCommand } = await import("./doctor-DIAnTMga.js");
		await doctorCommand(runtime, { repair: true });
	});
	try {
		await runDoctor(params.runtime);
	} catch (error) {
		if (error instanceof ExitError) throw error;
		params.runtime.error(`Failed to run "${command}": ${formatErrorMessage(error)}`);
		return { status: "retry-failed" };
	}
	try {
		return {
			status: "recovered",
			value: await params.retry()
		};
	} catch (error) {
		const { isInvalidConfigError } = await import("./io.invalid-config-BkkoIlrN.js");
		if (!isInvalidConfigError(error)) throw error;
		params.runtime.error(`Config is still invalid after "${command}":`);
		params.runtime.error(formatErrorMessage(error));
		return { status: "retry-failed" };
	}
}
//#endregion
export { offerInvalidConfigRecovery };
