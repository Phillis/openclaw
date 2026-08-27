//#region ../../../../../../openclaw/node_modules/@openclaw/fs-safe/dist/errors.js
const OPERATIONAL_CODES = /* @__PURE__ */ new Set([
	"helper-failed",
	"helper-unavailable",
	"not-empty",
	"not-found",
	"not-removable",
	"permission-unverified",
	"read-failed",
	"timeout",
	"unsupported-platform"
]);
function categorizeFsSafeError(code) {
	return OPERATIONAL_CODES.has(code) ? "operational" : "policy";
}
var FsSafeError = class extends Error {
	code;
	category;
	details;
	constructor(code, message, options = {}) {
		super(message, options);
		this.name = "FsSafeError";
		this.code = code;
		this.category = categorizeFsSafeError(code);
		this.details = options.details;
	}
};
//#endregion
export { FsSafeError as t };
