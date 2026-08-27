//#region packages/normalization-core/src/mountinfo-path.d.ts
/** Decodes an octal-escaped path field from a Linux procfs mount table. */
declare function decodeMountInfoPath(value: string): string;
//#endregion
export { decodeMountInfoPath };