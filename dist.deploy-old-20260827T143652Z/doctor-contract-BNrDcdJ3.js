import { t as createLegacyPrivateNetworkDoctorContract } from "./legacy-private-network-migration-e2JdDsve.js";
import "./runtime-doctor-migrations-Bxiar_G3.js";
//#region extensions/tlon/src/doctor-contract.ts
const contract = createLegacyPrivateNetworkDoctorContract({ channelKey: "tlon" });
const legacyConfigRules = contract.legacyConfigRules;
const normalizeCompatibilityConfig = contract.normalizeCompatibilityConfig;
//#endregion
export { normalizeCompatibilityConfig as n, legacyConfigRules as t };
