import { r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import { n as t } from "./i18n-BzsUVhtU.js";
import { t as WizardCancelledError } from "./prompts-B0iOB1_a.js";
import { randomUUID } from "node:crypto";
//#region src/commands/onboard-remote-gateway.ts
const GATEWAY_SETUP_DETECT_TIMEOUT_MS = 2e4;
const GATEWAY_SETUP_ACTIVATE_TIMEOUT_MS = 15e4;
const GATEWAY_CODEX_SETUP_ACTIVATE_TIMEOUT_MS = 48e4;
const GATEWAY_SETUP_VERIFY_TIMEOUT_MS = 3e4;
const GATEWAY_SYSTEM_AGENT_CHAT_TIMEOUT_MS = 19e4;
function toSetupInferenceDetection(result) {
	return {
		candidates: result.candidates.map((candidate) => ({
			kind: candidate.kind,
			...candidate.brandId !== void 0 ? { brandId: candidate.brandId } : {},
			label: candidate.label,
			detail: candidate.detail,
			modelRef: candidate.modelRef,
			...candidate.icon !== void 0 ? { icon: candidate.icon } : {},
			...candidate.website !== void 0 ? { website: candidate.website } : {},
			recommended: false,
			...candidate.credentials !== void 0 ? { credentials: candidate.credentials } : {}
		})),
		manualProviders: result.manualProviders.map((provider) => ({
			id: provider.id,
			...provider.brandId !== void 0 ? { brandId: provider.brandId } : {},
			label: provider.label,
			...provider.hint !== void 0 ? { hint: provider.hint } : {},
			...provider.icon !== void 0 ? { icon: provider.icon } : {},
			...provider.website !== void 0 ? { website: provider.website } : {}
		})),
		authOptions: (result.authOptions ?? []).map((option) => Object.assign({
			id: option.id,
			...option.brandId !== void 0 ? { brandId: option.brandId } : {},
			label: option.label,
			kind: option.kind,
			featured: option.featured
		}, option.hint !== void 0 ? { hint: option.hint } : {}, option.groupLabel !== void 0 ? { groupLabel: option.groupLabel } : {}, option.icon !== void 0 ? { icon: option.icon } : {}, option.website !== void 0 ? { website: option.website } : {})),
		...result.prepareOptions !== void 0 ? { prepareOptions: result.prepareOptions.map((option) => Object.assign({
			id: option.id,
			label: option.label
		}, option.brandId !== void 0 ? { brandId: option.brandId } : {}, option.hint !== void 0 ? { hint: option.hint } : {}, option.icon !== void 0 ? { icon: option.icon } : {}, option.website !== void 0 ? { website: option.website } : {})) } : {},
		recommendedInstalls: result.recommendedInstalls ?? [],
		unavailableCandidates: (result.unavailableCandidates ?? []).map((candidate) => ({
			id: candidate.id,
			label: candidate.label,
			detail: candidate.detail,
			reason: candidate.reason
		})),
		workspace: result.workspace,
		...result.configuredModel !== void 0 ? { configuredModel: result.configuredModel } : {},
		setupComplete: result.setupComplete
	};
}
function isSetupInferenceFailureStatus(value) {
	return value === "auth" || value === "rate_limit" || value === "billing" || value === "timeout" || value === "format" || value === "unavailable" || value === "unknown";
}
function toSetupInferenceActivationResult(result) {
	if (result.ok) {
		if (!result.modelRef?.trim() || typeof result.latencyMs !== "number" || !Array.isArray(result.lines)) throw new Error("Gateway returned an invalid successful inference activation result.");
		return {
			ok: true,
			modelRef: result.modelRef,
			latencyMs: result.latencyMs,
			lines: result.lines
		};
	}
	if (!isSetupInferenceFailureStatus(result.status) || !result.error?.trim()) throw new Error("Gateway returned an invalid failed inference activation result.");
	return {
		ok: false,
		status: result.status,
		error: result.error
	};
}
function activationTimeoutMs(kind) {
	return kind === "codex-cli" ? GATEWAY_CODEX_SETUP_ACTIVATE_TIMEOUT_MS : GATEWAY_SETUP_ACTIVATE_TIMEOUT_MS;
}
function bindGatewayConfig(target) {
	return {
		...target.config,
		gateway: {
			...target.config.gateway,
			mode: "remote",
			remote: {
				...target.config.gateway?.remote,
				url: target.gatewayUrl
			}
		}
	};
}
function assertVerifiedActivation(params) {
	if (params.requestedModelRef && params.activation.modelRef.trim() !== params.requestedModelRef.trim()) throw new Error(`Gateway activated ${params.activation.modelRef}, not the selected ${params.requestedModelRef}.`);
	if (!params.verification.ok) throw new Error(`Gateway inference verification failed: ${params.verification.error}`);
	if (params.verification.modelRef.trim() !== params.activation.modelRef.trim()) throw new Error(`Gateway verified ${params.verification.modelRef}, not the activated ${params.activation.modelRef}.`);
}
/**
* Configure missing inference on the selected remote Gateway, then let that
* Gateway's OpenClaw finish setup before handing off to its normal TUI.
* The local config is routing input only; every setup mutation runs through
* Gateway RPC.
*/
async function runRemoteGatewayInferenceOnboarding(target, runtime = defaultRuntime, deps = {}) {
	const callGateway = deps.callGateway ?? (await import("./call-DrR5WyUw.js")).callGatewayCli;
	const runGuidedOnboarding = deps.runGuidedOnboarding ?? (await import("./onboard-guided-DcZRGHcG.js")).runGuidedOnboarding;
	const boundConfig = bindGatewayConfig(target);
	const explicitAuth = Boolean(target.token || target.password);
	let gatewayWorkspace;
	const request = async (params) => await callGateway({
		config: boundConfig,
		...explicitAuth ? { url: target.gatewayUrl } : {},
		...target.token ? { token: target.token } : {},
		...target.password ? { password: target.password } : {},
		...target.tlsFingerprint ? { tlsFingerprint: target.tlsFingerprint } : {},
		ignoreEnvUrlOverride: true,
		method: params.method,
		params: params.payload,
		timeoutMs: params.timeoutMs
	});
	const detect = async () => {
		const detection = toSetupInferenceDetection(await request({
			method: "openclaw.setup.detect",
			payload: {},
			timeoutMs: GATEWAY_SETUP_DETECT_TIMEOUT_MS
		}));
		gatewayWorkspace = detection.workspace;
		return detection;
	};
	const activate = async (params) => {
		const activation = toSetupInferenceActivationResult(await request({
			method: "openclaw.setup.activate",
			payload: {
				kind: params.kind,
				...params.modelRef !== void 0 ? { modelRef: params.modelRef } : {},
				...params.authChoice !== void 0 ? { authChoice: params.authChoice } : {},
				...params.apiKey !== void 0 ? { apiKey: params.apiKey } : {},
				...gatewayWorkspace ? { workspace: gatewayWorkspace } : {}
			},
			timeoutMs: activationTimeoutMs(params.kind)
		}));
		if (!activation.ok) return activation;
		assertVerifiedActivation({
			activation,
			verification: await request({
				method: "openclaw.setup.verify",
				payload: {},
				timeoutMs: GATEWAY_SETUP_VERIFY_TIMEOUT_MS
			}),
			...params.modelRef ? { requestedModelRef: params.modelRef } : {}
		});
		return activation;
	};
	await runGuidedOnboarding({}, runtime, {
		detect,
		activate,
		handoffMode: "chat",
		runSetupMemoryImportStep: async () => ({
			status: "skipped",
			providers: []
		}),
		...deps.createPrompter ? { createPrompter: deps.createPrompter } : {},
		runSystemAgentChat: async () => {
			const prompter = await (deps.createPrompter?.() ?? import("./clack-prompter-bWpU8ovy.js").then(({ createClackPrompter }) => createClackPrompter()));
			await prompter.intro("OpenClaw");
			const sessionId = randomUUID();
			let reply = await request({
				method: "openclaw.chat",
				payload: {
					sessionId,
					welcomeVariant: "onboarding"
				},
				timeoutMs: GATEWAY_SYSTEM_AGENT_CHAT_TIMEOUT_MS
			});
			let agentDraft;
			try {
				for (;;) {
					await prompter.note(reply.reply, "OpenClaw");
					if (reply.action === "exit") {
						await prompter.outro("OpenClaw setup finished.");
						return;
					}
					if (reply.action === "open-agent") {
						agentDraft = reply.agentDraft;
						await prompter.outro("Opening your agent…");
						break;
					}
					const message = await prompter.text({
						message: "Reply to OpenClaw",
						...reply.sensitive ? { sensitive: true } : {},
						validate: (value) => value.trim() ? void 0 : "Required"
					});
					reply = await request({
						method: "openclaw.chat",
						payload: {
							sessionId,
							message
						},
						timeoutMs: GATEWAY_SYSTEM_AGENT_CHAT_TIMEOUT_MS
					});
				}
			} catch (error) {
				if (error instanceof WizardCancelledError) {
					await prompter.outro("OpenClaw setup paused.");
					return;
				}
				throw error;
			}
			await (deps.runTui ?? (await import("./tui-CY1HWFQf.js")).runTui)({
				config: boundConfig,
				deliver: false,
				...agentDraft === "hatch" ? { message: t("wizard.finalize.bootstrapHatchMessage") } : {},
				boundGateway: {
					url: target.gatewayUrl,
					...target.token ? { token: target.token } : {},
					...target.password ? { password: target.password } : {},
					...target.tlsFingerprint ? { tlsFingerprint: target.tlsFingerprint } : {}
				}
			});
		}
	});
}
//#endregion
export { runRemoteGatewayInferenceOnboarding };
