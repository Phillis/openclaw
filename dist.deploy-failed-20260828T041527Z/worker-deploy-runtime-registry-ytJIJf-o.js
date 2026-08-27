//#region src/worker/worker-deploy-runtime-registry.ts
const runtime = {};
function getWorkerDeployHighlightJs() {
	return runtime.highlightJs;
}
function getWorkerDeployJson5() {
	return runtime.json5;
}
function getWorkerDeploySecureTempRoot() {
	return runtime.resolveSecureTempRoot;
}
//#endregion
export { getWorkerDeployJson5 as n, getWorkerDeploySecureTempRoot as r, getWorkerDeployHighlightJs as t };
