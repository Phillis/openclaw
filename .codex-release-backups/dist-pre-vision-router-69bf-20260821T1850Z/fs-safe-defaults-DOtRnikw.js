import { t as configureFsSafeNative } from "./native-config-Br-9QMqs.js";
//#region src/infra/fs-safe-defaults.ts
if (!Object.keys(process.env).some((key) => /^(?:OPENCLAW_)?FS_SAFE_(?:NATIVE|PYTHON)_MODE$/u.test(process.platform === "win32" ? key.toUpperCase() : key))) configureFsSafeNative({ mode: "off" });
//#endregion
export {};
