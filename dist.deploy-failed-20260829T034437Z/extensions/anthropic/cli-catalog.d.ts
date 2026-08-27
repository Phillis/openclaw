import "../../plugin-entry-BZAeuuKK.js";
import "../../types.openclaw-CZEJqSSW.js";
import "../../types.models-DQnz5K9u.js";
import "../../setup-wizard-types-BW-DTrda.js";
import "../../types-h9rrY_6u.js";
import { n as ModelCatalogEntry } from "../../markdown-tables.types-bT4dRxv9.js";
import "../../types-D3xm6h3f.js";
import "../../model-selection-Chlw2Epu.js";
//#region extensions/anthropic/cli-catalog.d.ts
declare function resolveClaudeCliContextWindowModelId(modelId: string, contextWindow: string | undefined): string;
/** Build catalog entries for the default Claude CLI allowlist. */
declare function buildClaudeCliCatalogEntries(): ModelCatalogEntry[];
//#endregion
export { buildClaudeCliCatalogEntries, resolveClaudeCliContextWindowModelId };