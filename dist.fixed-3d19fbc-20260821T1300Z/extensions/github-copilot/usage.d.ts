import { t as ProviderUsageSnapshot } from "../../provider-usage.types-BZaNBkIn.js";

//#region extensions/github-copilot/usage.d.ts
declare function fetchCopilotUsage(token: string, timeoutMs: number, fetchFn: typeof fetch, githubDomain?: string): Promise<ProviderUsageSnapshot>;
//#endregion
export { fetchCopilotUsage };