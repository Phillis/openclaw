import { r as loadBundledEntryExportSync } from "./channel-entry-contract-DmYo-ZOH.js";
import "./setup-core--DlrIas_.js";
import "./group-access-ai6P20Qu.js";
//#region extensions/zalo/setup-api.ts
function createLazyObjectValue(load) {
	return new Proxy({}, {
		get(_target, property, receiver) {
			return Reflect.get(load(), property, receiver);
		},
		has(_target, property) {
			return property in load();
		},
		ownKeys() {
			return Reflect.ownKeys(load());
		},
		getOwnPropertyDescriptor(_target, property) {
			const descriptor = Object.getOwnPropertyDescriptor(load(), property);
			return descriptor ? {
				...descriptor,
				configurable: true
			} : void 0;
		}
	});
}
function loadSetupSurfaceModule() {
	return loadBundledEntryExportSync(import.meta.url, { specifier: "./setup-surface.js" });
}
const zaloSetupWizard = createLazyObjectValue(() => loadSetupSurfaceModule().zaloSetupWizard);
//#endregion
export { zaloSetupWizard as t };
