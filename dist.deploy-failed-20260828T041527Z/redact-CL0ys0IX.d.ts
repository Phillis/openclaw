import "./types.openclaw-CflOMr0r.js";
//#region src/logging/redact.d.ts
type RedactSensitiveMode = "off" | "tools";
type RedactPattern = string | RegExp;
type RedactOptions = {
  mode?: RedactSensitiveMode;
  patterns?: readonly RedactPattern[];
  sensitiveFieldPatterns?: readonly RedactPattern[];
};
declare function redactSensitiveText(text: string, options?: RedactOptions): string;
declare function redactToolPayloadText(text: string): string;
declare function redactSensitiveFieldValue(key: string, value: string, options?: RedactOptions): string;
//#endregion
export { redactSensitiveText as n, redactToolPayloadText as r, redactSensitiveFieldValue as t };