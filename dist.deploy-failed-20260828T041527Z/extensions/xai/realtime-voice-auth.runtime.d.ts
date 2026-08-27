import { n as OpenClawConfig } from "../../types.openclaw-R2xZRh0U.js";
import "../../provider-auth-D67Fy80c.js";
//#region extensions/xai/realtime-voice-auth.runtime.d.ts
declare function resolveXaiRealtimeApiKey(configApiKey: string | undefined, cfg: OpenClawConfig | undefined, agentId?: string): Promise<string>;
//#endregion
export { resolveXaiRealtimeApiKey };