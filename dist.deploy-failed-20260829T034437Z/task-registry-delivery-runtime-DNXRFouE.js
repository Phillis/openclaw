import { n as getRuntimeConfig } from "./io-DlN5njvP.js";
import { r as resolveControlUiSessionUrl } from "./control-ui-link-base-Do6aarSP.js";
import { t as sendMessage } from "./message-BFCs5k2E.js";
import "./message.config.runtime-DZTqyv3G.js";
//#region src/tasks/task-registry-delivery-runtime.ts
function resolveTaskControlUiSessionUrl(params) {
	return resolveControlUiSessionUrl(getRuntimeConfig(), {
		...params,
		exactKey: true
	});
}
//#endregion
export { resolveTaskControlUiSessionUrl, sendMessage };
