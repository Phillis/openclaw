import { t as restoreTerminalState } from "./restore-DuVRJEfl.js";
import { r as isTerminalInteractive } from "./terminal-interactivity-DXUXAq5U.js";
import { n as WizardCancelledError } from "./prompts-DLsO8MlU.js";
//#region src/commands/onboard-interactive-runner.ts
function hasInteractiveOnboardingTty() {
	return isTerminalInteractive();
}
async function runInteractiveOnboarding(action, runtime) {
	let exitCode = null;
	try {
		await action();
	} catch (error) {
		if (error instanceof WizardCancelledError) {
			exitCode = 1;
			return;
		}
		throw error;
	} finally {
		restoreTerminalState("setup finish", { resumeStdinIfPaused: false });
		if (exitCode !== null) runtime.exit(exitCode);
	}
}
//#endregion
export { runInteractiveOnboarding as n, hasInteractiveOnboardingTty as t };
