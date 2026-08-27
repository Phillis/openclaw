import { n as OpenClawConfig } from "./types.openclaw-Djf9z9fV.js";
import { s as LineGroupConfig } from "./accounts-CvfZVWLk.js";

//#region extensions/line/src/group-keys.d.ts
declare function resolveLineGroupLookupIds(groupId?: string | null): string[];
declare function resolveLineGroupConfigEntry<T>(groups: Record<string, T | undefined> | undefined, params: {
  groupId?: string | null;
  roomId?: string | null;
}): T | undefined;
declare function resolveLineGroupsConfig(cfg: OpenClawConfig, accountId?: string | null): Record<string, LineGroupConfig | undefined> | undefined;
declare function resolveExactLineGroupConfigKey(params: {
  groups: Record<string, unknown> | undefined;
  groupId?: string | null;
}): string | undefined;
//#endregion
export { resolveLineGroupsConfig as i, resolveLineGroupConfigEntry as n, resolveLineGroupLookupIds as r, resolveExactLineGroupConfigKey as t };