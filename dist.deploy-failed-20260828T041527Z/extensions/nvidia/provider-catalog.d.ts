import { u as ModelProviderDeclarationConfig } from "../../types.openclaw-OHssSjQn.js";
import "../../provider-model-shared-Bps1k4-8.js";
//#region extensions/nvidia/provider-catalog.d.ts
declare const NVIDIA_DEFAULT_MODEL_ID = "nvidia/nemotron-3-ultra-550b-a55b";
declare function buildNvidiaProvider(): ModelProviderDeclarationConfig;
declare function buildSelectableNvidiaProvider(): ModelProviderDeclarationConfig;
declare function buildLiveNvidiaProvider(): Promise<ModelProviderDeclarationConfig>;
declare function buildSelectableLiveNvidiaProvider(): Promise<ModelProviderDeclarationConfig>;
//#endregion
export { NVIDIA_DEFAULT_MODEL_ID, buildLiveNvidiaProvider, buildNvidiaProvider, buildSelectableLiveNvidiaProvider, buildSelectableNvidiaProvider };