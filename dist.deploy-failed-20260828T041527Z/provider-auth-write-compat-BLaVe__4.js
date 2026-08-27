import { b as updateAuthProfileStoreWithLock } from "./store-C6iqqcJy.js";
import { d as upsertAuthProfileWithLock, o as removeProviderAuthProfilesWithLock } from "./profiles-FGrQtdwI.js";
//#region src/plugin-sdk/provider-auth-write-compat.ts
async function updateAuthProfileStoreWithLockCompat(params) {
	try {
		return await updateAuthProfileStoreWithLock(params);
	} catch {
		return null;
	}
}
async function upsertAuthProfileWithLockCompat(params) {
	try {
		return await upsertAuthProfileWithLock(params);
	} catch {
		return null;
	}
}
async function removeProviderAuthProfilesWithLockCompat(params) {
	try {
		return await removeProviderAuthProfilesWithLock(params);
	} catch {
		return null;
	}
}
//#endregion
export { updateAuthProfileStoreWithLockCompat as n, upsertAuthProfileWithLockCompat as r, removeProviderAuthProfilesWithLockCompat as t };
