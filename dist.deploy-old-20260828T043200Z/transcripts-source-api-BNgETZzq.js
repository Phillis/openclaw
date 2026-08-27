import { t as discordVoiceTranscriptsSourceProvider } from "./transcripts-source-B7B51rAO.js";
//#region extensions/discord/transcripts-source-api.ts
function registerDiscordTranscriptSourceProvider(api) {
	api.registerTranscriptSourceProvider(discordVoiceTranscriptsSourceProvider);
}
//#endregion
export { registerDiscordTranscriptSourceProvider as t };
