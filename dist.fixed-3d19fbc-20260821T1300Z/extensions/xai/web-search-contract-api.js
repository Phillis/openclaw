import { t as buildXaiWebSearchProviderBase } from "../../web-search-provider-shared-CVjZ3WM4.js";
//#region extensions/xai/web-search-contract-api.ts
function createXaiWebSearchProvider() {
	return {
		...buildXaiWebSearchProviderBase(),
		createTool: () => null
	};
}
//#endregion
export { createXaiWebSearchProvider };
