import { L as MigrationProviderContext } from "../../runtime-api-IAhSVA75.js";
import { n as OpenClawConfig } from "../../types.openclaw-DRR8P0H2.js";
import "../../provider-auth-DGP_kfRF.js";
//#region extensions/migrate-hermes/auth-config.d.ts
type HermesAuthProfileConfig = {
  profileId: string;
  provider: string;
  mode: "api_key" | "oauth" | "token";
  email?: string;
  displayName?: string;
};
type HermesAuthConfigApplyResult = "configured" | "conflict" | "unavailable";
declare function hasAuthProfileConfigConflict(config: OpenClawConfig, profile: HermesAuthProfileConfig, overwrite: boolean): boolean;
declare function hasCurrentAuthProfileConfigConflict(ctx: MigrationProviderContext, profile: HermesAuthProfileConfig): boolean;
declare function applyAuthProfileConfigWithConflictCheck(params: {
  ctx: MigrationProviderContext;
  profile: HermesAuthProfileConfig;
  applyConfigPatch?: (config: OpenClawConfig) => OpenClawConfig;
}): Promise<HermesAuthConfigApplyResult>;
//#endregion
export { HermesAuthProfileConfig, applyAuthProfileConfigWithConflictCheck, hasAuthProfileConfigConflict, hasCurrentAuthProfileConfigConflict };