import { n as validateFirstOnboardingAgentName } from "./onboard-agent-B7-6q6-R.js";
//#region src/commands/onboard-first-agent.ts
async function promptFirstOnboardingAgent(hasAuthoredRoster, requestedName, prompter, nonInteractive = false) {
	if (hasAuthoredRoster) return;
	return { name: requestedName ?? (nonInteractive ? "main" : await prompter.text({
		message: "What should we call your first agent?",
		initialValue: "main",
		validate: validateFirstOnboardingAgentName
	})) };
}
async function showSessionMigrationWarnings(prompter, warnings) {
	if (warnings?.length) await prompter.note(warnings.join("\n"), "Session history migration");
}
//#endregion
export { showSessionMigrationWarnings as n, promptFirstOnboardingAgent as t };
