import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import { m as shortenHomePath } from "./utils-D9gvQMP6.js";
import { d as isSecretRef, h as normalizeSecretInputString } from "./types.secrets-BrIfhxSG.js";
import { t as formatSystemAgentOnboardingWelcome } from "./overview-Cs2G3rQv.js";
//#region src/system-agent/onboarding-welcome.ts
/**
* Card-client questions for the two welcome variants. Replies are texts the
* engine already understands; the prose welcome always stands alone for
* text-only clients (macOS app, TUI).
*/
const READY_WELCOME_QUESTION = {
	id: "onboarding-next-step",
	header: "Next step",
	question: "What would you like to do first?",
	options: [
		{
			label: "Talk to my agent",
			reply: "talk to agent",
			recommended: true,
			description: "Meet your agent right here."
		},
		{
			label: "Connect WhatsApp",
			reply: "connect whatsapp"
		},
		{
			label: "Connect Telegram",
			reply: "connect telegram"
		},
		{
			label: "See all channels",
			reply: "channels"
		}
	],
	isOther: true,
	skipAction: "exit"
};
const SETUP_WELCOME_QUESTION = {
	id: "onboarding-apply-setup",
	header: "Ready when you are",
	question: "Should I set all of that up now?",
	options: [{
		label: "Yes — set it up",
		reply: "yes",
		recommended: true
	}, {
		label: "What will you change?",
		reply: "what exactly will you set up?",
		description: "Ask before anything is written."
	}],
	isOther: true
};
/**
* The basic bootstrap is conversational: the welcome message carries the plan
* and the engine holds it as the pending proposal, so a bare "yes" applies it.
* This path starts only after a live inference turn. Already-configured
* installs get the channels/handoff guide instead.
*/
/**
* "Configured" must match the app onboarding gate (wizard metadata or gateway
* auth), not just a model: a model-only config would otherwise get the
* ready-guide welcome while the gate stays locked, stranding the page.
*/
async function loadAuthoredSetupConfig(params) {
	const authoredConfig = await (async () => {
		if (!params.configExists || !params.configValid) return;
		try {
			const { readConfigFileSnapshot } = await import("./config/config.js");
			const snapshot = await readConfigFileSnapshot();
			return snapshot.sourceConfig ?? snapshot.config ?? {};
		} catch {
			return;
		}
	})();
	const auth = authoredConfig?.gateway?.auth;
	const hasAuthMode = normalizeSecretInputString(auth?.mode) !== void 0;
	const hasAuthSecret = isSecretRef(auth?.token) || normalizeSecretInputString(auth?.token) !== void 0 || isSecretRef(auth?.password) || normalizeSecretInputString(auth?.password) !== void 0;
	const hasAuthoredSetup = authoredConfig?.wizard !== void 0 && Object.keys(authoredConfig.wizard).length > 0 || hasAuthMode || hasAuthSecret;
	return {
		...authoredConfig ? { authoredConfig } : {},
		hasAuthoredSetup
	};
}
async function buildOnboardingWelcome(params) {
	const overview = await params.engine.loadOverview();
	const { authoredConfig, hasAuthoredSetup } = await loadAuthoredSetupConfig({
		configExists: overview.config.exists,
		configValid: overview.config.valid
	});
	const localSetup = params.localRecovery === true && overview.config.exists && overview.config.valid && authoredConfig !== void 0 && authoredConfig?.gateway?.mode !== "remote" ? (await import("./local-onboarding-state-MF0R7TfF.js")).readLocalOnboardingStateForConfig(overview.config.path, authoredConfig) : void 0;
	const pendingSetup = localSetup?.status === "pending" ? localSetup : void 0;
	const defaultModel = overview.defaultModel?.trim();
	const requestedWorkspace = params.workspace?.trim() ? resolveUserPath(params.workspace.trim()) : void 0;
	const authoredWorkspace = authoredConfig?.agents?.defaults?.workspace?.trim() ? resolveUserPath(authoredConfig.agents.defaults.workspace.trim()) : void 0;
	if (hasAuthoredSetup && !pendingSetup && defaultModel && (!requestedWorkspace || requestedWorkspace === authoredWorkspace)) {
		const welcome = formatSystemAgentOnboardingWelcome(overview);
		params.engine.noteAssistantMessage(welcome);
		return {
			text: welcome,
			question: READY_WELCOME_QUESTION
		};
	}
	if (!defaultModel) throw new Error("OpenClaw onboarding requires working inference first. Run `openclaw onboard` on the machine running OpenClaw to configure and verify a default model.");
	const { DEFAULT_WORKSPACE } = await import("./onboard-helpers-BTdKJ26T.js");
	const workspace = resolveUserPath(pendingSetup?.workspace || requestedWorkspace || authoredWorkspace || DEFAULT_WORKSPACE);
	params.engine.propose({
		kind: "setup",
		workspace,
		...params.agentName ? { agentName: params.agentName } : {}
	});
	const welcome = [
		"## Hi, I'm OpenClaw — let's hatch your agent.",
		"",
		"No menus here: tell me what you want and I'll do the configuring. I looked around this machine:",
		"",
		`- AI: ${defaultModel} — already verified with a real reply; switching later is one sentence.`,
		`- Workspace: ${shortenHomePath(workspace)}`,
		"- Gateway: runs locally, private to this machine (token auth).",
		"",
		"Say **yes** and I'll set all of that up now.",
		"",
		"Heads up: your agent gets real access to this machine — https://docs.openclaw.ai/security",
		"Afterwards: `connect discord`, `connect slack`, `connect telegram`, `connect whatsapp` (or `channels` for the full list), then `talk to agent` to meet your agent."
	].join("\n");
	params.engine.noteAssistantMessage(welcome);
	return {
		text: welcome,
		question: SETUP_WELCOME_QUESTION
	};
}
//#endregion
export { loadAuthoredSetupConfig as n, buildOnboardingWelcome as t };
