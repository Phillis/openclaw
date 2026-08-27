import "./types-CL_qQaPo.js";
import "./index-C1qx1Yoz.js";
import "./types-CPd3N9Q-.js";
import "@openclaw/ai/validation";
//#region packages/agent-core/src/harness/compaction/compaction.d.ts
/** Generated compaction data ready to be persisted as a compaction entry. */
interface CompactionResult<T = unknown> {
  /** Summary text that replaces compacted history in future context. */
  summary: string;
  /** Entry id where retained history starts. */
  firstKeptEntryId: string;
  /** Estimated context tokens before compaction. */
  tokensBefore: number;
  /** Optional implementation-specific details stored with the compaction entry. */
  details?: T;
}
//#endregion
export { CompactionResult as t };