/**
 * Built-in edit session tool.
 *
 * Applies exact targeted replacements with queued file mutation, diff previews, and TUI renderers.
 */
import { constants } from "node:fs";
import {
  access as fsAccess,
  readFile as fsReadFile,
  stat as fsStat,
  writeFile as fsWriteFile,
} from "node:fs/promises";
import { Box, Container, Spacer, Text } from "@earendil-works/pi-tui";
import { repairJson } from "@openclaw/ai/internal/runtime";
import { isRecord } from "@openclaw/normalization-core/record-coerce";
import { truncateUtf16Safe } from "@openclaw/normalization-core/utf16-slice";
import { Type } from "typebox";
import { captureAgentToolSourceExecutionGuard } from "../../agent-tool-source-execution-guard.js";
import { normalizeToLF } from "../../line-endings.js";
import { renderDiff } from "../../modes/interactive/components/diff.js";
import type { AgentTool } from "../../runtime/index.js";
import { textResult } from "../../tools/common.js";
import { decodeUtf8File } from "../../utf8-file.js";
import type { ToolDefinition } from "../extensions/types.js";
import {
  applyEditsPreservingLineEndings,
  computeEditsDiff,
  EditNoChangeError,
  type Edit,
  type EditDiffError,
  type EditDiffResult,
  findClosestMatchLine,
  generateDiffString,
  generateUnifiedPatch,
  splitNoOpEdits,
  stripBom,
  validateNoOpEditTargets,
} from "./edit-diff.js";
import {
  resolveFileMutationQueueKey,
  withFileMutationQueueKeyResolution,
} from "./file-mutation-queue.js";
import { type PersistedFileStat, verifyPersistedUtf8File } from "./file-write-verification.js";
import { resolveLocalPathToCwd, resolveToCwd } from "./path-utils.js";
import { invalidArgText, shortenPath, str } from "./render-utils.js";
import type { EditToolDetails, EditToolInput } from "./tool-contracts.js";
import { wrapToolDefinition } from "./tool-definition-wrapper.js";

type EditPreview = EditDiffResult | EditDiffError;

type EditRenderState = {
  callComponent?: EditCallRenderComponent;
};

const replaceEditSchema = Type.Object(
  {
    oldText: Type.String({
      description: "Exact original text; unique and non-overlapping in this call.",
    }),
    newText: Type.String({
      description: "Replacement text.",
    }),
  },
  {},
);

const editSchema = Type.Object(
  {
    path: Type.String({
      description: "File path; relative/absolute.",
    }),
    edits: Type.Array(replaceEditSchema, {
      description:
        "Targeted replacements against original file; no overlap/nesting. Merge nearby changes.",
    }),
  },
  {},
);

const EditToolOutputSchema = Type.Union([
  Type.Object({ changed: Type.Literal(false) }, { additionalProperties: false }),
  Type.Object(
    {
      changed: Type.Literal(true),
      diff: Type.String(),
      patch: Type.String(),
      firstChangedLine: Type.Optional(Type.Integer({ minimum: 1 })),
    },
    { additionalProperties: false },
  ),
]);

const EDIT_MISMATCH_MESSAGE = "Could not find the exact text in";
const EDIT_MISMATCH_HINT_LIMIT = 800;

/**
 * BUG-072 (F3): pollution sink guard.
 *
 * These sentinels are host-generated read-cap/truncation markers; a write or
 * edit payload that contains one is synthetic read-path output, not file data.
 * Persisting them amplified BUG-072 (read-all + write-back round trips), so
 * file-writing sinks reject payloads carrying them with a named error. Edit
 * `oldText` is NOT checked: already-polluted files must remain repairable by
 * targeted edits.
 */
export const POLLUTION_GUARD_MARKER_IN_PAYLOAD = "POLLUTION_GUARD_MARKER_IN_PAYLOAD";

const POLLUTION_MARKER_RE =
  /\[Read output capped at |…\(truncated\)…|\.\.\.\(live output truncated\)\.\.\.|\[\d+ more lines? in file\. |\[Showing (?:lines|part of line) /;

/** Reject a single write/edit payload that carries a host-generated truncation marker. */
export function assertNoPollutionMarkersInText(text: string, path: string): void {
  if (POLLUTION_MARKER_RE.test(text)) {
    throw new Error(
      `${POLLUTION_GUARD_MARKER_IN_PAYLOAD}: refusing to write read-cap/truncation markers into ${path}. ` +
        "The payload contains a host-generated truncation notice ([Read output capped at …], …(truncated)…, or ...(live output truncated)...), which is not file content. " +
        "Re-read the file (windows are content-pure) and write only verified content.",
    );
  }
}

/** Reject replacement texts carrying pollution markers; oldText stays exempt. */
export function assertNoPollutionMarkers(edits: readonly Edit[], path: string): void {
  for (const edit of edits) {
    assertNoPollutionMarkersInText(edit.newText, path);
  }
}
/** Context lines shown before/after the best-match line in a windowed mismatch dump. */
const EDIT_MISMATCH_CONTEXT_LINES = 4;

/**
 * Pluggable operations for the edit tool.
 * Override these to delegate file editing to remote systems (for example SSH).
 */
export interface EditOperations {
  /** Resolve the physical identity used to order this backend's file operations. */
  resolveQueueKey?: (absolutePath: string, signal?: AbortSignal) => string | Promise<string>;
  /** Read file contents as a Buffer */
  readFile: (absolutePath: string) => Promise<Buffer>;
  /** Write content to a file */
  writeFile: (absolutePath: string, content: string) => Promise<void>;
  /** Stat the target before reporting success */
  statFile: (absolutePath: string) => Promise<PersistedFileStat | null>;
  /** Check if file is readable and writable (throw if not) */
  access: (absolutePath: string) => Promise<void>;
}

const defaultEditOperations: EditOperations = {
  readFile: (path) => fsReadFile(path),
  writeFile: (path, content) => fsWriteFile(path, content, "utf-8"),
  statFile: async (path) => {
    try {
      const stat = await fsStat(path);
      return {
        type: stat.isFile() ? "file" : stat.isDirectory() ? "directory" : "other",
        size: stat.size,
        mtimeMs: stat.mtimeMs,
      } as const;
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        (error as { code?: unknown }).code === "ENOENT"
      ) {
        return null;
      }
      throw error;
    }
  },
  access: (path) => fsAccess(path, constants.R_OK | constants.W_OK),
};

export interface EditToolOptions {
  /** Custom operations for file editing. Default: local filesystem */
  operations?: EditOperations;
}

function prepareEditArguments(input: unknown): EditToolInput {
  if (!input || typeof input !== "object") {
    return input as EditToolInput;
  }

  const args = { ...(input as Record<string, unknown>) };

  // Serialized replacements contain literal file text, so valid JSON escapes must
  // survive rather than being reinterpreted by the repair owner's path heuristic.
  if (typeof args.edits === "string") {
    try {
      const parsed = JSON.parse(repairJson(args.edits, { preserveValidControlEscapes: true }));
      if (Array.isArray(parsed)) {
        args.edits = parsed;
      }
    } catch {}
  }

  let edits = Array.isArray(args.edits)
    ? args.edits.map((edit) => {
        if (!isRecord(edit)) {
          return edit;
        }
        return { oldText: edit.oldText, newText: edit.newText };
      })
    : args.edits;

  const { oldText, newText } = args;
  if (typeof oldText === "string" && typeof newText === "string") {
    const batch = Array.isArray(edits) ? edits : [];
    if (
      !batch.some(
        (edit: unknown) => isRecord(edit) && edit.oldText === oldText && edit.newText === newText,
      )
    ) {
      batch.push({ oldText, newText });
    }
    edits = batch;
  }

  // Keep the strict provider schema while tolerating model-added metadata.
  return { path: args.path, edits } as EditToolInput;
}

function validateEditInput(input: EditToolInput): {
  path: string;
  edits: Edit[];
} {
  if (!Array.isArray(input.edits) || input.edits.length === 0) {
    throw new Error("Edit tool input is invalid. edits must contain at least one replacement.");
  }
  return { path: input.path, edits: input.edits };
}

/**
 * Window the mismatch snippet around the best-match line for the failing
 * oldText, so large files surface the failing region instead of only the file
 * head (BUG-067: an 8.4KB file's failing line 42 was never reachable in the
 * 800-char head dump). Falls back to the head-of-file behavior when no focus
 * line is known.
 */
function buildMismatchSnippet(content: string, focusLine: number | undefined): string {
  if (content.length <= EDIT_MISMATCH_HINT_LIMIT) {
    return content;
  }
  if (focusLine === undefined) {
    return `${truncateUtf16Safe(content, EDIT_MISMATCH_HINT_LIMIT)}\n... (truncated)`;
  }
  const lines = content.split("\n");
  const focusIndex = Math.min(Math.max(focusLine - 1, 0), Math.max(lines.length - 1, 0));
  const start = Math.max(0, focusIndex - EDIT_MISMATCH_CONTEXT_LINES);
  const end = Math.min(lines.length, focusIndex + 1 + EDIT_MISMATCH_CONTEXT_LINES);
  const prefix = start > 0 ? `... (lines 1-${start} omitted)\n` : "";
  let snippetLines = lines.slice(start, end);
  let snippet = prefix + snippetLines.join("\n") + (end < lines.length ? "\n... (truncated)" : "");
  // Trim from the tail (farthest from the focus line) until within budget.
  while (snippet.length > EDIT_MISMATCH_HINT_LIMIT && snippetLines.length > 1) {
    snippetLines = snippetLines.slice(0, -1);
    snippet = prefix + snippetLines.join("\n") + "\n... (truncated)";
  }
  if (snippet.length > EDIT_MISMATCH_HINT_LIMIT) {
    snippet = `${truncateUtf16Safe(snippet, EDIT_MISMATCH_HINT_LIMIT)}\n... (truncated)`;
  }
  return snippet;
}

function appendMismatchHint(
  error: Error,
  currentContent: string,
  focusLine: number | undefined,
): Error {
  const enhanced = new Error(
    `${error.message}\nCurrent file contents:\n${buildMismatchSnippet(currentContent, focusLine)}`,
    { cause: error },
  );
  enhanced.stack = error.stack;
  return enhanced;
}

type RenderableEditArgs = {
  path?: string;
  file_path?: string;
  edits?: Edit[];
  oldText?: string;
  newText?: string;
};

type EditToolResultLike = {
  content: Array<{
    type: string;
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
  details?: EditToolDetails;
};

type EditCallRenderComponent = Box & {
  preview?: EditPreview;
  previewArgsKey?: string;
  previewPending?: boolean;
  settledError?: boolean;
};

function createEditCallRenderComponent(): EditCallRenderComponent {
  return Object.assign(new Box(1, 1, (text: string) => text), {
    preview: undefined as EditPreview | undefined,
    previewArgsKey: undefined as string | undefined,
    previewPending: false,
    settledError: false,
  });
}

function getEditCallRenderComponent(
  state: EditRenderState,
  lastComponent: unknown,
): EditCallRenderComponent {
  if (lastComponent instanceof Box) {
    const component = lastComponent as EditCallRenderComponent;
    state.callComponent = component;
    return component;
  }
  if (state.callComponent) {
    return state.callComponent;
  }
  const component = createEditCallRenderComponent();
  state.callComponent = component;
  return component;
}

function getRenderablePreviewInput(
  args: RenderableEditArgs | undefined,
): { path: string; edits: Edit[] } | null {
  if (!args) {
    return null;
  }

  const path =
    typeof args.path === "string"
      ? args.path
      : typeof args.file_path === "string"
        ? args.file_path
        : null;
  if (!path) {
    return null;
  }

  if (
    Array.isArray(args.edits) &&
    args.edits.length > 0 &&
    args.edits.every(
      (edit) => typeof edit?.oldText === "string" && typeof edit?.newText === "string",
    )
  ) {
    return { path, edits: args.edits };
  }

  if (typeof args.oldText === "string" && typeof args.newText === "string") {
    return { path, edits: [{ oldText: args.oldText, newText: args.newText }] };
  }

  return null;
}

function formatEditCall(
  args: RenderableEditArgs | undefined,
  theme: typeof import("../../modes/interactive/theme/theme.js").interactiveAgentTheme,
): string {
  const invalidArg = invalidArgText(theme);
  const rawPath = str(args?.file_path ?? args?.path);
  const path = rawPath !== null ? shortenPath(rawPath) : null;
  const pathDisplay =
    path === null ? invalidArg : path ? theme.fg("accent", path) : theme.fg("toolOutput", "...");
  return `${theme.fg("toolTitle", theme.bold("edit"))} ${pathDisplay}`;
}

function formatEditResult(
  preview: EditPreview | undefined,
  result: EditToolResultLike,
  theme: typeof import("../../modes/interactive/theme/theme.js").interactiveAgentTheme,
  isError: boolean,
): string | undefined {
  const previewDiff = preview && !("error" in preview) ? preview.diff : undefined;
  const previewError = preview && "error" in preview ? preview.error : undefined;
  if (isError) {
    const errorText = result.content
      .filter((c) => c.type === "text")
      .map((c) => c.text || "")
      .join("\n");
    if (!errorText || errorText === previewError) {
      return undefined;
    }
    return theme.fg("error", errorText);
  }

  const resultDiff = result.details?.changed === true ? result.details.diff : undefined;
  if (resultDiff && resultDiff !== previewDiff) {
    return renderDiff(resultDiff);
  }

  return undefined;
}

function getEditHeaderBg(
  preview: EditPreview | undefined,
  settledError: boolean | undefined,
  theme: typeof import("../../modes/interactive/theme/theme.js").interactiveAgentTheme,
): (text: string) => string {
  if (preview) {
    if ("error" in preview) {
      return (text: string) => theme.bg("toolErrorBg", text);
    }
    return (text: string) => theme.bg("toolSuccessBg", text);
  }
  if (settledError) {
    return (text: string) => theme.bg("toolErrorBg", text);
  }
  return (text: string) => theme.bg("toolPendingBg", text);
}

function buildEditCallComponent(
  component: EditCallRenderComponent,
  args: RenderableEditArgs | undefined,
  theme: typeof import("../../modes/interactive/theme/theme.js").interactiveAgentTheme,
): EditCallRenderComponent {
  component.setBgFn(getEditHeaderBg(component.preview, component.settledError, theme));
  component.clear();
  component.addChild(new Text(formatEditCall(args, theme), 0, 0));

  if (!component.preview) {
    return component;
  }

  const body =
    "error" in component.preview
      ? theme.fg("error", component.preview.error)
      : renderDiff(component.preview.diff);
  component.addChild(new Spacer(1));
  component.addChild(new Text(body, 0, 0));
  return component;
}

function setEditPreview(
  component: EditCallRenderComponent,
  preview: EditPreview,
  argsKey: string | undefined,
): boolean {
  const current = component.preview;
  const changed =
    current === undefined ||
    ("error" in current && "error" in preview
      ? current.error !== preview.error
      : "error" in current !== "error" in preview) ||
    (!("error" in current) &&
      !("error" in preview) &&
      (current.diff !== preview.diff || current.firstChangedLine !== preview.firstChangedLine));
  component.preview = preview;
  component.previewArgsKey = argsKey;
  component.previewPending = false;
  return changed;
}

export function createEditToolDefinition(
  cwd: string,
  options?: EditToolOptions,
): ToolDefinition<typeof editSchema, EditToolDetails, EditRenderState> {
  const ops = options?.operations ?? defaultEditOperations;
  const resolvePath = options?.operations ? resolveToCwd : resolveLocalPathToCwd;
  return {
    name: "edit",
    label: "edit",
    description:
      "Exact single-file replacements. oldText unique/non-overlapping against original. Merge nearby changes; omit large unchanged spans.",
    promptSnippet: "Exact file edits; multiple disjoint edits per call",
    promptGuidelines: [
      "oldText must match exactly",
      "Multiple disjoint locations: one call, multiple edits[]",
      "Match original file; no overlap/nesting; merge nearby",
      "oldText minimal but unique; no padding",
    ],
    parameters: editSchema,
    outputSchema: EditToolOutputSchema,
    renderShell: "self",
    prepareArguments: prepareEditArguments,
    async execute(toolCallId, input: EditToolInput, signal?: AbortSignal, onUpdate?, ctx?) {
      void toolCallId;
      void onUpdate;
      void ctx;
      const assertCurrent = captureAgentToolSourceExecutionGuard();
      const { path, edits: originalEdits } = validateEditInput(input);
      const absolutePath = resolvePath(path, cwd);
      const queueKey = resolveFileMutationQueueKey(absolutePath, ops.resolveQueueKey, signal);

      return withFileMutationQueueKeyResolution(queueKey, async () => {
        if (signal?.aborted) {
          throw new Error("Operation aborted");
        }
        assertCurrent();

        let realEdits: Edit[] = [];
        let expectedContent: string | undefined;

        try {
          await ops.access(absolutePath);
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error && "code" in error
              ? `Error code: ${String(error.code)}`
              : String(error);
          throw new Error(`Could not edit file: ${path}. ${errorMessage}.`, {
            cause: error,
          });
        }

        const buffer = await ops.readFile(absolutePath);
        const rawContent = decodeUtf8File(buffer, absolutePath);
        try {
          if (signal?.aborted) {
            throw new Error("Operation aborted");
          }
          assertCurrent();

          const { bom, text: content } = stripBom(rawContent);
          const normalizedContent = normalizeToLF(content);
          const editSets = splitNoOpEdits(normalizedContent, originalEdits, path);
          const noOpEdits = editSets.noOpEdits;
          realEdits = editSets.realEdits;
          validateNoOpEditTargets(normalizedContent, noOpEdits, realEdits, path);
          // BUG-072 (F3): reject polluted replacement payloads before anything
          // is written. oldText is exempt so polluted files stay repairable.
          assertNoPollutionMarkers(realEdits, path);
          // No-op: not terminal — the model may still be mid-task and needs a
          // continuation, not an ended turn.
          if (realEdits.length === 0) {
            return textResult(
              `No changes made to ${path}. The replacement text is identical to the original.`,
              { changed: false } satisfies EditToolDetails,
            );
          }
          const { baseContent, newContent, finalContent } = applyEditsPreservingLineEndings(
            content,
            realEdits,
            path,
          );
          expectedContent = bom + finalContent;
          await ops.writeFile(absolutePath, expectedContent);
          if (signal?.aborted) {
            throw new Error("Operation aborted");
          }
          assertCurrent();
          if (!(await verifyPersistedUtf8File(absolutePath, expectedContent, ops))) {
            throw new Error(
              `Edit verification failed for ${path}: the persisted regular file does not match the requested content. Inspect the target and retry.`,
            );
          }

          assertCurrent();
          const diffResult = generateDiffString(baseContent, newContent);
          const patch = generateUnifiedPatch(path, baseContent, newContent);
          return {
            content: [
              {
                type: "text",
                text: `Successfully replaced ${realEdits.length} block(s) in ${path}.`,
              },
            ],
            details: {
              changed: true,
              diff: diffResult.diff,
              patch,
              ...(diffResult.firstChangedLine === undefined
                ? {}
                : { firstChangedLine: diffResult.firstChangedLine }),
            },
          };
        } catch (error: unknown) {
          assertCurrent();
          const normalizedError = error instanceof Error ? error : new Error(String(error));
          const currentContent = await ops
            .readFile(absolutePath)
            .then((current) => current.toString("utf-8"))
            .catch(() => rawContent);
          if (
            expectedContent !== undefined &&
            (await verifyPersistedUtf8File(absolutePath, expectedContent, ops))
          ) {
            assertCurrent();
            return {
              content: [
                {
                  type: "text",
                  text: `Successfully replaced ${realEdits.length} block(s) in ${path}.`,
                },
              ],
              details: { changed: true, diff: "", patch: "" },
            };
          }
          if (normalizedError.message.includes(EDIT_MISMATCH_MESSAGE)) {
            // Locate the failing region for the dump window: prefer the first
            // real edit whose oldText is absent from the current content.
            const { text: retryContent } = stripBom(currentContent);
            const retryNormalized = normalizeToLF(retryContent);
            const failingOldText = realEdits.find(
              (edit) => !retryNormalized.includes(normalizeToLF(edit.oldText)),
            )?.oldText;
            const focusLine = failingOldText
              ? findClosestMatchLine(retryNormalized, normalizeToLF(failingOldText))
              : undefined;
            throw appendMismatchHint(normalizedError, currentContent, focusLine);
          }
          // No-op: the edit matched but produced identical content. Not
          // terminal — see the realEdits.length===0 case above.
          if (normalizedError instanceof EditNoChangeError) {
            return textResult(
              `No changes made to ${path}. The replacement produced identical content.`,
              { changed: false } satisfies EditToolDetails,
            );
          }
          throw normalizedError;
        }
      });
    },
    renderCall(args, theme, context) {
      const component = getEditCallRenderComponent(context.state, context.lastComponent);
      const previewInput = getRenderablePreviewInput(args as RenderableEditArgs | undefined);
      const argsKey = previewInput
        ? JSON.stringify({ path: previewInput.path, edits: previewInput.edits })
        : undefined;

      if (component.previewArgsKey !== argsKey) {
        component.preview = undefined;
        component.previewArgsKey = argsKey;
        component.previewPending = false;
        component.settledError = false;
      }

      if (context.argsComplete && previewInput && !component.preview && !component.previewPending) {
        component.previewPending = true;
        const requestKey = argsKey;
        void computeEditsDiff(
          previewInput.path,
          previewInput.edits,
          context.cwd,
          ops,
          resolvePath,
        ).then((preview) => {
          if (component.previewArgsKey === requestKey) {
            setEditPreview(component, preview, requestKey);
            context.invalidate();
          }
        });
      }

      return buildEditCallComponent(component, args, theme);
    },
    renderResult(result, optionsLocal, theme, context) {
      void optionsLocal;
      const callComponent = context.state.callComponent;
      const previewInput = getRenderablePreviewInput(
        context.args as RenderableEditArgs | undefined,
      );
      const argsKey = previewInput
        ? JSON.stringify({ path: previewInput.path, edits: previewInput.edits })
        : undefined;
      const typedResult = result as EditToolResultLike;
      const resultDiff =
        !context.isError && typedResult.details?.changed === true
          ? typedResult.details.diff
          : undefined;
      let changed = false;
      if (callComponent) {
        if (typeof resultDiff === "string") {
          changed =
            setEditPreview(
              callComponent,
              {
                diff: resultDiff,
                firstChangedLine:
                  typedResult.details?.changed === true
                    ? typedResult.details.firstChangedLine
                    : undefined,
              },
              argsKey,
            ) || changed;
        }
        if (callComponent.settledError !== context.isError) {
          callComponent.settledError = context.isError;
          changed = true;
        }
        if (changed) {
          buildEditCallComponent(
            callComponent,
            context.args as RenderableEditArgs | undefined,
            theme,
          );
        }
      }

      const output = formatEditResult(callComponent?.preview, typedResult, theme, context.isError);
      const component = (context.lastComponent as Container | undefined) ?? new Container();
      component.clear();
      if (!output) {
        return component;
      }
      component.addChild(new Spacer(1));
      component.addChild(new Text(output, 1, 0));
      return component;
    },
  };
}

export function createEditTool(
  cwd: string,
  options?: EditToolOptions,
): AgentTool<typeof editSchema> {
  return wrapToolDefinition(createEditToolDefinition(cwd, options));
}
