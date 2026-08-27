import { t as HealthCheck } from "../../health-85pz_yVk.js";
import "../../config-6KUQc6vC.js";
//#region extensions/codex/src/doctor.d.ts
declare const CODEX_MANAGED_APP_SERVER_CHECK_ID = "codex/managed-app-server";
//#endregion
//#region extensions/codex/api.d.ts
declare function registerCodexManagedAppServerDoctorChecks(host: {
  getHealthCheck(id: string): HealthCheck | undefined;
  registerHealthCheck(check: HealthCheck): void;
}): void;
//#endregion
export { CODEX_MANAGED_APP_SERVER_CHECK_ID, registerCodexManagedAppServerDoctorChecks };