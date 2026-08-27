//#region node_modules/@openclaw/fs-safe/dist/write-queue.js
const writeQueues = /* @__PURE__ */ new Map();
async function serializePathWrite(key, run) {
	const previous = writeQueues.get(key) ?? Promise.resolve();
	const task = (async () => {
		await previous.catch(() => void 0);
		return await run();
	})();
	const done = task.then(() => void 0, () => void 0);
	writeQueues.set(key, done);
	try {
		return await task;
	} finally {
		if (writeQueues.get(key) === done) writeQueues.delete(key);
	}
}
//#endregion
export { serializePathWrite as t };
