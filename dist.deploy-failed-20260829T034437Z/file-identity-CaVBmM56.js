import { createHash } from "node:crypto";
//#region node_modules/@openclaw/fs-safe/dist/file-identity.js
function isZero(value) {
	return value === 0 || value === 0n;
}
function sameStatValue(left, right) {
	return typeof left === typeof right ? left === right : BigInt(left) === BigInt(right);
}
function isStatValueProvablyDifferent(left, right, platform) {
	if (sameStatValue(left, right)) return false;
	return platform !== "win32" || !isZero(left) && !isZero(right);
}
function sha256Hex(data, encoding) {
	const buffer = typeof data === "string" ? Buffer.from(data, encoding ?? "utf8") : data;
	return createHash("sha256").update(buffer).digest("hex");
}
function sameFileIdentity(left, right, platform = process.platform) {
	return !isStatValueProvablyDifferent(left.dev, right.dev, platform) && !isStatValueProvablyDifferent(left.ino, right.ino, platform);
}
function sameFileIdentityForCleanup(left, right, platform = process.platform) {
	if (platform === "win32" && (isZero(left.dev) || isZero(left.ino) || isZero(right.dev) || isZero(right.ino))) return false;
	return sameStatValue(left.dev, right.dev) && sameStatValue(left.ino, right.ino);
}
//#endregion
export { sameFileIdentityForCleanup as n, sha256Hex as r, sameFileIdentity as t };
