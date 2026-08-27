import { n as OpenClawConfig } from "../../types.openclaw-DRR8P0H2.js";
import "../../provider-auth-DGP_kfRF.js";
//#region extensions/xai/realtime-voice-auth.runtime.d.ts
declare function resolveXaiRealtimeApiKey(configApiKey: string | undefined, cfg: OpenClawConfig | undefined, agentId?: string): Promise<string>;
//#endregion
export { resolveXaiRealtimeApiKey };