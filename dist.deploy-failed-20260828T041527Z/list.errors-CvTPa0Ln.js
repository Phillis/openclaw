//#region src/commands/models/list.errors.ts
/** Formats an unknown error with stack detail when available. */
function formatErrorWithStack(err) {
	if (err instanceof Error) return err.stack ?? `${err.name}: ${err.message}`;
	return String(err);
}
//#endregion
export { formatErrorWithStack as t };
