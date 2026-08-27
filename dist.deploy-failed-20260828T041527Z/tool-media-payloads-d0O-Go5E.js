import { a as getReplyPayloadMetadata, i as copyReplyPayloadMetadata, m as markReplyPayloadForSourceSuppressionDelivery } from "./reply-payload-BeeUJOmJ.js";
import { n as splitMediaFromOutput } from "./reply-directives-CBwQknKg.js";
//#region src/agents/embedded-agent-runner/run/tool-media-payloads.ts
/**
* Merges media emitted by tools into the channel payloads produced by the
* assistant turn. The first non-reasoning reply owns the media so text and
* attachments stay together; metadata is preserved for delivery bookkeeping.
*/
function mergeAttemptToolMediaPayloads(params) {
	let mediaUrls = Array.from(new Set(params.toolMediaUrls?.map((url) => url.trim()).filter(Boolean) ?? []));
	const payloads = params.payloads?.length ? [...params.payloads] : [];
	const payloadIndex = payloads.findIndex((payload) => !payload.isReasoning);
	const visiblePayload = payloads.at(payloadIndex);
	const isSourceReplyTranscriptMirror = params.sourceReplyDeliveryMode === "message_tool_only" && visiblePayload && getReplyPayloadMetadata(visiblePayload)?.sourceReplyTranscriptMirror;
	if (visiblePayload?.text && mediaUrls.length > 0 && !isSourceReplyTranscriptMirror) {
		const selected = splitMediaFromOutput(visiblePayload.text, {
			extractAudioDirectives: false,
			extractMediaDirectives: false,
			markdownImageAllowlist: mediaUrls
		});
		if (selected.mediaUrls?.length) {
			const selectedMediaUrls = new Set(selected.mediaUrls);
			mediaUrls = mediaUrls.filter((url) => selectedMediaUrls.has(url));
			payloads[payloadIndex] = copyReplyPayloadMetadata(visiblePayload, {
				...visiblePayload,
				text: selected.text
			});
		}
	}
	const mediaUrlSet = new Set(mediaUrls);
	const hostOwnedMediaUrls = Array.from(new Set(params.hostOwnedToolMediaUrls?.map((url) => url.trim()).filter((url) => url.length > 0 && mediaUrlSet.has(url)) ?? []));
	if (mediaUrls.length === 0 && !params.toolAudioAsVoice && !params.toolTrustedLocalMedia) return params.payloads;
	const buildMediaPayload = (urls, includeAudio) => ({
		mediaUrls: urls.length ? urls : void 0,
		mediaUrl: urls[0],
		audioAsVoice: includeAudio && params.toolAudioAsVoice || void 0,
		trustedLocalMedia: params.toolTrustedLocalMedia || void 0
	});
	const shouldSplitHostOwnedMedia = params.sourceReplyDeliveryMode === "message_tool_only" && hostOwnedMediaUrls.length > 0;
	const hostOwnedMediaUrlSet = new Set(hostOwnedMediaUrls);
	const mergeableMediaUrls = shouldSplitHostOwnedMedia ? mediaUrls.filter((url) => !hostOwnedMediaUrlSet.has(url)) : mediaUrls;
	const appendHostOwnedMedia = (nextPayloads) => {
		if (!shouldSplitHostOwnedMedia) return nextPayloads;
		return [...nextPayloads, markReplyPayloadForSourceSuppressionDelivery(buildMediaPayload(hostOwnedMediaUrls, false))];
	};
	if (payloadIndex >= 0) {
		const payload = payloads.at(payloadIndex);
		if (!payload) return payloads;
		if (isSourceReplyTranscriptMirror) return appendHostOwnedMedia(payloads);
		if (mergeableMediaUrls.length === 0 && shouldSplitHostOwnedMedia) return appendHostOwnedMedia(payloads);
		const mergedMediaUrls = Array.from(/* @__PURE__ */ new Set([...payload.mediaUrls ?? [], ...mergeableMediaUrls]));
		payloads[payloadIndex] = copyReplyPayloadMetadata(payload, {
			...payload,
			mediaUrls: mergedMediaUrls.length ? mergedMediaUrls : void 0,
			mediaUrl: payload.mediaUrl ?? mergedMediaUrls[0],
			audioAsVoice: payload.audioAsVoice || params.toolAudioAsVoice || void 0,
			trustedLocalMedia: payload.trustedLocalMedia || params.toolTrustedLocalMedia || void 0
		});
		return appendHostOwnedMedia(payloads);
	}
	if (shouldSplitHostOwnedMedia) {
		const genericMediaPayload = mergeableMediaUrls.length > 0 ? [buildMediaPayload(mergeableMediaUrls, true)] : [];
		return appendHostOwnedMedia([...payloads, ...genericMediaPayload]);
	}
	const mediaPayload = buildMediaPayload(mergeableMediaUrls, true);
	return [...payloads, mediaPayload];
}
//#endregion
export { mergeAttemptToolMediaPayloads as t };
