//#region src/global-state.ts
let globalVerbose = false;
let globalYes = false;
function setVerbose(v) {
	globalVerbose = v;
}
function isVerbose() {
	return globalVerbose;
}
function isYes() {
	return globalYes;
}
//#endregion
export { isYes as n, setVerbose as r, isVerbose as t };
