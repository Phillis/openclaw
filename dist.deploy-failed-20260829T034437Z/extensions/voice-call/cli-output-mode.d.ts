//#region extensions/voice-call/cli-output-mode.d.ts
/** Voice-call result actions emit JSON, while tail reserves stdout for JSONL. */
declare function isVoiceCallMachineOutput(params: {
  argv: readonly string[];
}): boolean;
declare const VOICE_CALL_CLI_DESCRIPTOR: {
  readonly name: "voicecall";
  readonly description: "Voice call utilities";
  readonly hasSubcommands: true;
  readonly machineOutput: typeof isVoiceCallMachineOutput;
};
//#endregion
export { VOICE_CALL_CLI_DESCRIPTOR };