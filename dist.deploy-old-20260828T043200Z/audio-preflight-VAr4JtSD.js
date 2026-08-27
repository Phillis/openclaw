import { i as shouldLogVerbose, r as logVerbose } from "./globals-GZNLg1ns.js";
import { u as normalizeMediaFacts } from "./media-facts-Bd6apMSF.js";
import { t as isAudioAttachment } from "./attachments.normalize-bAPjiGNs.js";
import "./runner.entries-BdFbwPcl.js";
import { a as createMediaAttachmentCache, i as runCapability, o as normalizeMediaAttachments, r as resolveMediaAttachmentLocalRoots, t as buildProviderRegistry } from "./runner-CbQ8T8pT.js";
import { n as sendTranscriptEcho } from "./echo-transcript-D_G5RW5T.js";
//#region src/media-understanding/audio-transcription-runner.ts
/** Runs the configured audio-understanding pipeline and returns the first transcript output. */
async function runAudioTranscription(params) {
	const attachments = params.attachments ?? normalizeMediaAttachments(params.ctx);
	if (attachments.length === 0) return {
		transcript: void 0,
		attachments
	};
	const providerRegistry = buildProviderRegistry(params.providers, params.cfg);
	const cache = createMediaAttachmentCache(attachments, {
		...params.localPathRoots ? { localPathRoots: params.localPathRoots } : {},
		ssrfPolicy: params.cfg.tools?.web?.fetch?.ssrfPolicy
	});
	try {
		return {
			transcript: (await runCapability({
				capability: "audio",
				cfg: params.cfg,
				ctx: params.ctx,
				attachments: cache,
				media: attachments,
				agentDir: params.agentDir,
				providerRegistry,
				config: params.cfg.tools?.media?.audio,
				activeModel: params.activeModel
			})).outputs.find((entry) => entry.kind === "audio.transcription")?.text?.trim() || void 0,
			attachments
		};
	} finally {
		await cache.cleanup();
	}
}
//#endregion
//#region src/media-understanding/audio-preflight.ts
/**
* Transcribes the first audio attachment BEFORE mention checking.
* This allows voice notes to be processed in group chats with requireMention: true.
* Returns the transcript or undefined if transcription fails or no audio is found.
*/
async function transcribeFirstAudio(params) {
	const { ctx, cfg } = params;
	const audioConfig = cfg.tools?.media?.audio;
	if (audioConfig?.enabled === false) return;
	const attachments = normalizeMediaAttachments(ctx);
	if (!attachments || attachments.length === 0) return;
	const firstAudio = attachments.find((att) => att && isAudioAttachment(att) && !att.alreadyTranscribed);
	if (!firstAudio) return;
	if (shouldLogVerbose()) logVerbose(`audio-preflight: transcribing attachment ${firstAudio.index} for mention check`);
	try {
		const { transcript } = await runAudioTranscription({
			ctx,
			cfg,
			attachments,
			agentDir: params.agentDir,
			providers: params.providers,
			activeModel: params.activeModel,
			localPathRoots: resolveMediaAttachmentLocalRoots({
				cfg,
				ctx
			})
		});
		if (!transcript) return;
		if (audioConfig?.echoTranscript) await sendTranscriptEcho({
			ctx,
			cfg,
			transcript,
			format: audioConfig.echoFormat ?? "📝 \"{transcript}\""
		});
		const media = normalizeMediaFacts(ctx.media);
		const transcribedFact = media[firstAudio.index];
		if (transcribedFact) {
			media[firstAudio.index] = {
				...transcribedFact,
				transcribed: true
			};
			ctx.media = media;
		}
		if (shouldLogVerbose()) logVerbose(`audio-preflight: transcribed ${transcript.length} chars from attachment ${firstAudio.index}`);
		return transcript;
	} catch (err) {
		if (shouldLogVerbose()) logVerbose(`audio-preflight: transcription failed: ${String(err)}`);
		return;
	}
}
//#endregion
export { transcribeFirstAudio as t };
