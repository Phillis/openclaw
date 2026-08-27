//#region src/gateway/control-ui-shared.ts
/** Normalizes a Control UI base path to either "" or a leading-slash path without trailing slash. */
function normalizeControlUiBasePath(basePath) {
	const value = basePath?.trim() ?? "";
	if (!value || value === "/") return "";
	const withSlash = value.startsWith("/") ? value : `/${value}`;
	return withSlash.endsWith("/") ? withSlash.slice(0, -1) : withSlash;
}
//#endregion
export { normalizeControlUiBasePath as t };
