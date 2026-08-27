import { n as OpenClawConfig } from "../../types.openclaw-Dbu8qmVI.js";
import "../../provider-onboard-dxkwMmct.js";
//#region extensions/nvidia/onboard.d.ts
declare const NVIDIA_DEFAULT_MODEL_REF = "nvidia/nemotron-3-ultra-550b-a55b";
declare const applyNvidiaConfig: (cfg: OpenClawConfig) => OpenClawConfig, applyNvidiaProviderConfig: (cfg: OpenClawConfig) => OpenClawConfig;
//#endregion
export { NVIDIA_DEFAULT_MODEL_REF, applyNvidiaConfig, applyNvidiaProviderConfig };