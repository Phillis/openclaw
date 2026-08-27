import "./fs-safe-defaults-DOtRnikw.js";
import { n as fileStoreSync, t as fileStore } from "./file-store-COJcnc0p.js";
//#region src/infra/private-file-store.ts
/** Create an async private file store rooted at `rootDir`. */
function privateFileStore(rootDir) {
	return fileStore({
		rootDir,
		private: true
	});
}
/** Create a sync private file store rooted at `rootDir`. */
function privateFileStoreSync(rootDir) {
	return fileStoreSync({
		rootDir,
		private: true
	});
}
//#endregion
export { privateFileStoreSync as n, privateFileStore as t };
