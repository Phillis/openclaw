//#region extensions/openai/realtime-quicksilver-instructions.d.ts
type OpenAIQuicksilverTranscriptEntry = {
  role: "user" | "assistant";
  text: string;
};
declare function buildOpenAIQuicksilverInstructions(operatorInstructions?: string): string;
declare function buildOpenAIQuicksilverDelegationPrompt(params: {
  input: string;
  transcript: readonly OpenAIQuicksilverTranscriptEntry[];
}): string;
//#endregion
export { OpenAIQuicksilverTranscriptEntry, buildOpenAIQuicksilverDelegationPrompt, buildOpenAIQuicksilverInstructions };