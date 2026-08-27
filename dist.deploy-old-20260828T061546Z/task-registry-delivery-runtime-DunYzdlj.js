import { n as getRuntimeConfig } from "./io-ClLVsBMp.js";
import { r as resolveControlUiSessionUrl } from "./control-ui-link-base-Do6aarSP.js";
import { t as sendMessage } from "./message-dARLE1vh.js";
import "./message.config.runtime-DpbAp-8z.js";
//#region src/tasks/task-registry-delivery-runtime.ts
function resolveTaskControlUiSessionUrl(params) {
	return resolveControlUiSessionUrl(getRuntimeConfig(), {
		...params,
		exactKey: true
	});
}
//#endregion
export { resolveTaskControlUiSessionUrl, sendMessage };
