import { n as isVolatileBackupPath } from "./backup-volatile-filter-DWFmNw39.js";
//#region src/infra/backup-volatile-stat-cache.ts
const VOLATILE_BACKUP_SYNTHETIC_STAT = {
	isBlockDevice: () => false,
	isCharacterDevice: () => false,
	isDirectory: () => false,
	isFIFO: () => false,
	isFile: () => false,
	isSocket: () => false,
	isSymbolicLink: () => false
};
var BackupVolatileStatCache = class extends Map {
	constructor(volatilePlan) {
		super();
		this.volatilePlan = volatilePlan;
	}
	get(key) {
		const cached = super.get(key);
		if (cached) return cached;
		return isVolatileBackupPath(key, this.volatilePlan) ? VOLATILE_BACKUP_SYNTHETIC_STAT : void 0;
	}
};
var BackupLinkCache = class extends Map {
	get(_key) {}
	set(_key, _value) {
		return this;
	}
};
function createBackupVolatileStatCache(volatilePlan) {
	return new BackupVolatileStatCache(volatilePlan);
}
function createBackupLinkCache() {
	return new BackupLinkCache();
}
//#endregion
export { createBackupVolatileStatCache as n, createBackupLinkCache as t };
