//#region ../../../../../../openclaw/node_modules/@openclaw/fs-safe/dist/archive-errors.js
var ArchiveSecurityError = class extends Error {
	code;
	constructor(code, message, options) {
		super(message, options);
		this.code = code;
		this.name = "ArchiveSecurityError";
	}
};
var ArchiveFormatError = class extends Error {
	code;
	constructor(message, options) {
		super(message, options);
		this.name = "ArchiveFormatError";
		this.code = "archive-header-invalid";
	}
};
function isArchiveFormatErrorMessage(message) {
	return message.includes("archive-header-invalid") || message.includes("archive entry size did not match its manifest");
}
//#endregion
export { ArchiveSecurityError as n, isArchiveFormatErrorMessage as r, ArchiveFormatError as t };
