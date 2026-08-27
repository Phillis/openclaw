//#region packages/terminal-core/src/note.d.ts
declare function wrapNoteMessage(message: unknown, options?: {
  maxWidth?: number;
  columns?: number;
}): string;
declare function resolveNoteColumns(columns: number | undefined): number;
declare function resolveNoteOutputColumns(message: string, columns: number): number;
declare function noteToStream(message: unknown, title: string | undefined, output: NodeJS.WriteStream): void;
declare function note(message: unknown, title?: string): void;
declare function withSuppressedNotes<T>(callback: () => T): T;
//#endregion
export { note, noteToStream, resolveNoteColumns, resolveNoteOutputColumns, withSuppressedNotes, wrapNoteMessage };