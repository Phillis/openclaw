//#region src/media/load-options.d.ts
/** Host callback used to read an already-authorized outbound media file. */
type OutboundMediaReadFile = (filePath: string) => Promise<Buffer>;
/** Host-provided file access used when a runtime can read outbound media from local disk. */
type OutboundMediaAccess = {
  localRoots?: readonly string[];
  readFile?: OutboundMediaReadFile; /** Agent workspace directory for resolving relative media paths. */
  workspaceDir?: string;
};
//#endregion
export { OutboundMediaReadFile as n, OutboundMediaAccess as t };