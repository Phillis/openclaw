//#region extensions/file-transfer/doctor-contract-api.d.ts
declare function hasLegacyPositivePolicy(value: unknown): boolean;
declare const legacyConfigRules: {
  path: string[];
  message: string;
  match: typeof hasLegacyPositivePolicy;
}[];
//#endregion
export { legacyConfigRules };