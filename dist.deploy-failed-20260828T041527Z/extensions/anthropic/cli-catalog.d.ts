import "../../plugin-entry-CX5-Xb96.js";
import "../../types.openclaw-BZZbt-SF.js";
import "../../types.models-DQnz5K9u.js";
import "../../setup-wizard-types-D9afUG0f.js";
import "../../types-B-9ShV5F.js";
import { n as ModelCatalogEntry } from "../../markdown-tables.types-DWb4Iw5E.js";
import "../../types-4lHSWofV.js";
import "../../model-selection-BvyNgXm5.js";
//#region extensions/anthropic/cli-catalog.d.ts
declare function resolveClaudeCliContextWindowModelId(modelId: string, contextWindow: string | undefined): string;
/** Build catalog entries for the default Claude CLI allowlist. */
declare function buildClaudeCliCatalogEntries(): ModelCatalogEntry[];
//#endregion
export { buildClaudeCliCatalogEntries, resolveClaudeCliContextWindowModelId };