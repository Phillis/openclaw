//#region extensions/browser/src/browser/trash.d.ts
/** Moves a path to trash only when it lives under allowed Browser roots. */
declare function movePathToTrash(targetPath: string): Promise<string>;
//#endregion
export { movePathToTrash as t };