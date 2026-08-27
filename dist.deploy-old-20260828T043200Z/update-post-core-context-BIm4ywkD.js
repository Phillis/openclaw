import { t as mergeProcessEnv } from "./process-env-CW4bkwqq.js";
//#region src/infra/update-post-core-context.ts
const POST_CORE_UPDATE_ENV = "OPENCLAW_UPDATE_POST_CORE";
const POST_CORE_UPDATE_REQUESTED_CHANNEL_ENV = "OPENCLAW_UPDATE_POST_CORE_REQUESTED_CHANNEL";
const POST_CORE_UPDATE_SOURCE_CONFIG_PATH_ENV = "OPENCLAW_UPDATE_POST_CORE_SOURCE_CONFIG_PATH";
function buildPostCoreHandoffEnv(params) {
	return mergeProcessEnv([params.baseEnv, {
		OPENCLAW_COMPATIBILITY_HOST_VERSION: params.compatHostVersion || void 0,
		[POST_CORE_UPDATE_REQUESTED_CHANNEL_ENV]: params.requestedChannel || void 0,
		[POST_CORE_UPDATE_SOURCE_CONFIG_PATH_ENV]: params.sourceConfigPath || void 0
	}]);
}
//#endregion
export { buildPostCoreHandoffEnv as i, POST_CORE_UPDATE_REQUESTED_CHANNEL_ENV as n, POST_CORE_UPDATE_SOURCE_CONFIG_PATH_ENV as r, POST_CORE_UPDATE_ENV as t };
