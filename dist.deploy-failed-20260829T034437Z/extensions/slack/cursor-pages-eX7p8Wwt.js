//#region extensions/slack/src/cursor-pages.ts
const SLACK_CURSOR_PAGE_LIMIT = 1e4;
async function collectSlackCursorPages(params) {
	const items = [];
	let cursor;
	const seenCursors = /* @__PURE__ */ new Set();
	for (let pageCount = 1; pageCount <= SLACK_CURSOR_PAGE_LIMIT; pageCount += 1) {
		const response = await params.fetchPage(cursor);
		items.push(...params.collectPageItems(response));
		const nextCursor = response.response_metadata?.next_cursor?.trim() || void 0;
		if (!nextCursor) return items;
		if (seenCursors.has(nextCursor)) throw new Error(`Slack cursor pagination repeated a cursor after ${pageCount} pages`);
		seenCursors.add(nextCursor);
		cursor = nextCursor;
	}
	throw new Error(`Slack cursor pagination exceeded ${SLACK_CURSOR_PAGE_LIMIT} pages`);
}
//#endregion
export { collectSlackCursorPages as t };
