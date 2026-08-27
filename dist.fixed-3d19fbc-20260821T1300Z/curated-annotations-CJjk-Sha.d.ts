//#region packages/memory-host-sdk/src/host/curated-annotations.d.ts
declare const INVALID_PROJECT_ANNOTATION_KEY = "!invalid-project-annotation";
declare function stripMemoryAnnotationCarriers(text: string): string;
type CuratedProjectAnnotations = {
  annotated: boolean;
  valid: boolean;
  keys: string[];
  rawCount: number;
  validCount: number;
};
declare function normalizeProjectAnnotationKey(value: string): string | null;
declare function extractProjectKeysFromCuratedEntry(text: string): CuratedProjectAnnotations;
//#endregion
export { stripMemoryAnnotationCarriers as a, normalizeProjectAnnotationKey as i, INVALID_PROJECT_ANNOTATION_KEY as n, extractProjectKeysFromCuratedEntry as r, CuratedProjectAnnotations as t };