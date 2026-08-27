import { GoogleGenAI, GoogleGenAIOptions } from "@google/genai";
//#region extensions/google/google-genai-runtime.d.ts
type GoogleGenAIClient = InstanceType<typeof GoogleGenAI>;
declare function createGoogleGenAI(options: GoogleGenAIOptions): GoogleGenAIClient;
//#endregion
export { GoogleGenAIClient, createGoogleGenAI };