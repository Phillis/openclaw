//#region src/transcripts/source-locator.ts
/** Strip invitation credentials from meeting locators before persistence/provider handoff. */
function sanitizeTranscriptSourceLocator(source) {
	if (!source.meetingUrl) return source;
	const { meetingUrl: _meetingUrl, ...rest } = source;
	try {
		const url = new URL(source.meetingUrl);
		return {
			...rest,
			meetingUrl: `${url.origin}${url.pathname}`
		};
	} catch {
		return rest;
	}
}
//#endregion
export { sanitizeTranscriptSourceLocator as t };
