import "./runtime-doctor-migrations-D-k1ye_X.js";
import { t as createLegacyPrivateNetworkDoctorContract } from "./legacy-private-network-migration-e2JdDsve.js";
//#region extensions/tlon/src/doctor-contract.ts
const contract = createLegacyPrivateNetworkDoctorContract({ channelKey: "tlon" });
const legacyConfigRules = contract.legacyConfigRules;
const normalizeCompatibilityConfig = contract.normalizeCompatibilityConfig;
//#endregion
export { normalizeCompatibilityConfig as n, legacyConfigRules as t };
