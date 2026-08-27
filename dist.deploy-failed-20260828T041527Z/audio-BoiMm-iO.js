import { r as defaultRuntime } from "./runtime-LRpY2Icg.js";
import "./agent-scope-DigoIwHb.js";
import { l as resolveAgentDir } from "./agent-scope-config-CUBiGmG3.js";
import { n as getRuntimeConfig } from "./io-ClLVsBMp.js";
import { t as getProviderEnvVars } from "./provider-env-vars-CHIRS9qE.js";
import "./config-B_0xOnKq.js";
import { c as buildMediaUnderstandingRegistry } from "./defaults.constants-C1BdJzCZ.js";
import { u as getModelsCommandSecretTargetIds } from "./command-secret-targets-B3UG58Gq.js";
import { r as inspectLocalAudioSelection } from "./local-audio-DE7TZHDP.js";
import { n as runCommandWithRuntime } from "./cli-utils-DKdcuZ9M.js";
import { c as transcribeAudioFile } from "./runtime-CAkYG6ZI.js";
import { c as providerSummaryText, d as resolveCapabilityProviderAgentId, f as resolveLocalCapabilityRuntimeConfig, l as requireProviderModelOverride, n as formatEnvelopeForText, s as providerHasGenericConfig, t as emitJsonOrText, u as resolveCapabilityAgentOption } from "./shared-Dq9Owf7C.js";
import { t as isMissingMediaUnderstandingProvider } from "./media-understanding-result-CCD7dk7R.js";
import path from "node:path";
//#region src/cli/capability-cli/audio.ts
async function runAudioTranscribe(params) {
	const cfg = await resolveLocalCapabilityRuntimeConfig({
		commandName: "infer audio transcribe",
		targetIds: getModelsCommandSecretTargetIds()
	});
	const agentDir = resolveAgentDir(cfg, resolveCapabilityProviderAgentId(cfg, params.agent, "infer audio transcribe"));
	const activeModel = requireProviderModelOverride(params.model);
	const result = await transcribeAudioFile({
		filePath: path.resolve(params.file),
		cfg,
		agentDir,
		language: params.language,
		activeModel,
		prompt: params.prompt
	});
	if (!result.text) {
		if (isMissingMediaUnderstandingProvider(result)) throw new Error("No audio transcription provider is configured or ready. Configure an audio-capable tools.media.models entry, or pass --model <provider/model> after configuring that provider's auth/API key.");
		throw new Error(`No transcript returned for audio: ${path.resolve(params.file)}`);
	}
	return {
		ok: true,
		capability: "audio.transcribe",
		transport: "local",
		attempts: [],
		outputs: [{
			path: path.resolve(params.file),
			text: result.text,
			kind: "audio.transcription"
		}]
	};
}
function registerAudioCapabilityCommands(capability) {
	const audio = capability.command("audio").description("Audio transcription").option("--agent <id>", "Agent whose model and auth state should be used");
	audio.command("transcribe").description("Transcribe one audio file").requiredOption("--file <path>", "Audio file").option("--agent <id>", "Agent whose model and auth state should be used").option("--language <code>", "Language hint").option("--prompt <text>", "Prompt hint").option("--model <provider/model>", "Model override").option("--json", "Output JSON", false).action(async (opts, command) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = await runAudioTranscribe({
				file: String(opts.file),
				agent: resolveCapabilityAgentOption(command, opts.agent),
				language: opts.language,
				model: opts.model,
				prompt: opts.prompt
			});
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
		});
	});
	audio.command("providers").description("List audio transcription providers").option("--agent <id>", "Agent whose provider state should be inspected").option("--json", "Output JSON", false).action(async (opts, command) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const cfg = getRuntimeConfig();
			const agentId = resolveCapabilityProviderAgentId(cfg, resolveCapabilityAgentOption(command, opts.agent));
			const remoteProviders = [...buildMediaUnderstandingRegistry(void 0, cfg).values()].filter((provider) => provider.capabilities?.includes("audio")).map((provider) => ({
				available: true,
				configured: providerHasGenericConfig({
					cfg,
					providerId: provider.id,
					agentId,
					envVars: getProviderEnvVars(provider.id, {
						config: cfg,
						includeUntrustedWorkspacePlugins: false
					})
				}),
				selected: false,
				id: provider.id,
				capabilities: provider.capabilities,
				defaultModels: provider.defaultModels
			}));
			const localProviders = (await inspectLocalAudioSelection()).candidates.filter((candidate) => candidate.available).map((candidate) => Object.assign({
				available: candidate.available,
				configured: candidate.ready,
				selected: false,
				localFallbackSelected: candidate.selected,
				id: `local/${candidate.id}`,
				transport: "local-cli",
				command: candidate.command,
				observedBackend: candidate.observedBackend ?? "unknown",
				evidence: candidate.evidence
			}, candidate.capableBackend ? { capableBackend: candidate.capableBackend } : {}, candidate.requestedBackend ? { requestedBackend: candidate.requestedBackend } : {}, candidate.reason ? { reason: candidate.reason } : {}));
			const providers = [...remoteProviders, ...localProviders];
			emitJsonOrText(defaultRuntime, Boolean(opts.json), providers, providerSummaryText);
		});
	});
}
//#endregion
export { registerAudioCapabilityCommands };
