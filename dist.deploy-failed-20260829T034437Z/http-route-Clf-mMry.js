import { t as handleA2uiHttpRequest } from "./a2ui-7poXcpBK.js";
//#region extensions/canvas/src/http-route.ts
function createCanvasHttpRouteHandler() {
	return { handleHttpRequest: (req, res) => handleA2uiHttpRequest(req, res) };
}
//#endregion
export { createCanvasHttpRouteHandler };
