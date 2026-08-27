import { t as discordVoiceTranscriptsSourceProvider } from "./transcripts-source-D6SZP1lC.js";
//#region extensions/discord/transcripts-source-api.ts
function registerDiscordTranscriptSourceProvider(api) {
	api.registerTranscriptSourceProvider(discordVoiceTranscriptsSourceProvider);
}
//#endregion
export { registerDiscordTranscriptSourceProvider as t };
