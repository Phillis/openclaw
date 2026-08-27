//#region src/config/dangerous-name-matching.d.ts
type DangerousNameMatchingConfig = {
  dangerouslyAllowNameMatching?: boolean;
};
/** Returns true only for the explicit dangerous name-matching opt-in flag. */
declare function isDangerousNameMatchingEnabled(config: DangerousNameMatchingConfig | null | undefined): boolean;
//#endregion
export { isDangerousNameMatchingEnabled as t };