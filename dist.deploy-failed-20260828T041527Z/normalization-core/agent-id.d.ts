import { t as Result } from "../result-Op6FTu_Y.js";
//#region packages/normalization-core/src/agent-id.d.ts
/** Normalizes an OpenClaw agent id to its filesystem-safe canonical form. */
declare function normalizeAgentId(value: string | undefined | null): string;
/** Normalizes an explicitly supplied agent id without falling back to the default agent. */
declare function normalizeAgentIdStrict(value: string | undefined | null): Result<string, "unrepresentable">;
/** Returns whether a value is already a canonical agent-id input. */
declare function isValidAgentId(value: string | undefined | null): boolean;
//#endregion
export { isValidAgentId, normalizeAgentId, normalizeAgentIdStrict };