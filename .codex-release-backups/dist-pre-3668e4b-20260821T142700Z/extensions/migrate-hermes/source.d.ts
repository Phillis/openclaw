//#region extensions/migrate-hermes/source.d.ts
type HermesSource = {
  root: string;
  configPath?: string;
  envPath?: string;
  authPath?: string;
  globalAuthPath?: string;
  opencodeAuthPath?: string;
  soulPath?: string;
  agentsPath?: string;
  memoryPath?: string;
  userPath?: string;
  skillsDir?: string;
  archivePaths: HermesArchivePath[];
};
type HermesArchivePath = {
  id: string;
  path: string;
  relativePath: string;
};
declare function discoverHermesSource(input?: string, options?: {
  env?: NodeJS.ProcessEnv;
  platform?: NodeJS.Platform;
}): Promise<HermesSource>;
declare function hasHermesSource(source: HermesSource): boolean;
//#endregion
export { HermesSource, discoverHermesSource, hasHermesSource };