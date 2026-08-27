import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { J as appendTranscriptEventSync, Q as replaceTranscriptEventsSync, Qt as loadSessionEntry, Ut as ensureSessionEntrySync, X as appendTranscriptMessageSync, an as replaceSessionEntrySync, rt as readActiveTranscriptEntryAnchor, tt as withTranscriptWriteTransaction } from "./session-accessor-CVnxp3UM.js";
import { n as projectCanonicalSessionEntryShape } from "./store-entry-shape-BcuqmtLR.js";
import { _ as isSessionTranscriptSideAppendEntry } from "./session-transcript-index-U6HbS8-N.js";
import { x as loadTranscriptEventsSync } from "./session-accessor.sqlite-transcript-store-DmssQj1u.js";
import { O as buildSessionContext } from "./agent-core-r8cobJ0S.js";
import { f as partitionSessionFileEntries, i as isSessionContextMetadataEntry, l as parseOpaqueLeafEntry, m as generateSessionEntryId, p as createManagedSessionId, r as isIndexedSessionEntry, s as migrateToCurrentVersion, u as parseParentLinkedOpaqueEntry } from "./session-manager-codec-DXlXWhl0.js";
//#region src/agents/sessions/session-manager-core.ts
var SessionManagerCore = class {
	constructor(cwd, persistenceTarget, loadedEntries) {
		this.migrated = false;
		this.sessionId = "";
		this.fileEntries = [];
		this.opaqueFileEntries = [];
		this.byId = /* @__PURE__ */ new Map();
		this.opaqueParentsById = /* @__PURE__ */ new Map();
		this.logicalParentsById = /* @__PURE__ */ new Map();
		this.invalidLeafControlIds = /* @__PURE__ */ new Set();
		this.labelsById = /* @__PURE__ */ new Map();
		this.labelTimestampsById = /* @__PURE__ */ new Map();
		this.leafId = null;
		this.appendParentId = null;
		this.pendingDeliberateAppend = false;
		this.persistenceHeaderPending = false;
		this.cwd = cwd;
		this.persistenceTarget = persistenceTarget;
		if (persistenceTarget || loadedEntries) this.setLoadedSessionTarget(persistenceTarget, loadedEntries ?? []);
		else this.newSession();
	}
	setSessionTarget(target) {
		const entries = loadTranscriptEventsSync(target);
		const header = entries.find((entry) => typeof entry === "object" && entry !== null && entry.type === "session");
		this.setLoadedSessionTarget(target, entries);
		if (header?.cwd) this.cwd = header.cwd;
	}
	setLoadedSessionTarget(target, entries) {
		const partitioned = partitionSessionFileEntries(entries);
		if (partitioned.fileEntries.length === 0 && partitioned.opaqueEntries.length === 0) {
			this.persistenceTarget = target ? { ...target } : void 0;
			this.initializeSession({ id: target?.sessionId });
			this.persistenceHeaderPending = target !== void 0;
			return;
		}
		const header = partitioned.fileEntries.find((entry) => entry.type === "session");
		if (target && (header?.version ?? 1) < 3) throw new Error("Persisted legacy session transcripts require doctor/import migration before runtime use");
		this.persistenceHeaderPending = false;
		this.persistenceTarget = target ? { ...target } : void 0;
		this.fileEntries = partitioned.fileEntries;
		this.opaqueFileEntries = partitioned.opaqueEntries;
		this.sessionId = header?.id ?? target?.sessionId ?? createManagedSessionId();
		this.migrated = migrateToCurrentVersion(this.fileEntries, partitioned.fileEntriesByOriginalIndex);
		this.buildIndex();
	}
	reloadPersistedTranscript() {
		if (this.persistenceTarget) {
			const runtimeCwd = this.cwd;
			this.setSessionTarget(this.persistenceTarget);
			this.cwd = runtimeCwd;
		}
	}
	newSession(options) {
		if (this.persistenceTarget) throw new Error("Persisted session managers cannot change session identity in place");
		return this.initializeSession(options);
	}
	initializeSession(options) {
		this.sessionId = options?.id ?? this.persistenceTarget?.sessionId ?? createManagedSessionId();
		this.migrated = false;
		const timestamp = (/* @__PURE__ */ new Date()).toISOString();
		const header = {
			type: "session",
			version: 3,
			id: this.sessionId,
			timestamp,
			cwd: this.cwd,
			parentSession: options?.parentSession
		};
		this.fileEntries = [header];
		this.opaqueFileEntries = [];
		this.byId.clear();
		this.opaqueParentsById.clear();
		this.logicalParentsById.clear();
		this.invalidLeafControlIds.clear();
		this.labelsById.clear();
		this.labelTimestampsById.clear();
		this.leafId = null;
		this.appendParentId = null;
		this.appendMode = void 0;
		this.pendingDeliberateAppend = false;
		return this.persistenceTarget ? this.sessionId : void 0;
	}
	resolveOpaqueLeafTargetId(targetId) {
		if (targetId === null || this.byId.has(targetId)) return targetId;
		return this.resolveCanonicalParentId(targetId);
	}
	resolveOpaqueAppendParentId(parentId) {
		if (parentId === null || this.byId.has(parentId) || this.opaqueParentsById.has(parentId)) return parentId;
		return this.resolveCanonicalParentId(parentId);
	}
	resolveOpaqueLeafControl(leafEntry) {
		if (!leafEntry) return;
		const isKnownReference = (id) => id === null || this.byId.has(id) || this.opaqueParentsById.has(id) && !this.invalidLeafControlIds.has(id);
		if (!isKnownReference(leafEntry.targetId) || leafEntry.appendParentId !== void 0 && !isKnownReference(leafEntry.appendParentId)) return;
		const leafId = this.resolveOpaqueLeafTargetId(leafEntry.targetId);
		return {
			leafId,
			appendParentId: leafEntry.appendParentId === void 0 ? leafId : this.resolveOpaqueAppendParentId(leafEntry.appendParentId),
			...leafEntry.appendMode ? { appendMode: leafEntry.appendMode } : {}
		};
	}
	buildIndex() {
		this.byId.clear();
		this.opaqueParentsById.clear();
		this.logicalParentsById.clear();
		this.invalidLeafControlIds.clear();
		this.labelsById.clear();
		this.labelTimestampsById.clear();
		this.leafId = null;
		this.appendParentId = null;
		this.appendMode = void 0;
		this.pendingDeliberateAppend = false;
		let opaqueIndex = 0;
		let latestResetId;
		const resetDescendantIds = /* @__PURE__ */ new Set();
		for (let index = 0; index <= this.fileEntries.length; index += 1) {
			while (this.opaqueFileEntries[opaqueIndex]?.index === index) {
				const opaqueRecord = this.opaqueFileEntries[opaqueIndex]?.record;
				const leafEntry = parseOpaqueLeafEntry(opaqueRecord);
				if (leafEntry) {
					const leafState = this.resolveOpaqueLeafControl(leafEntry);
					if (!leafState) {
						this.invalidLeafControlIds.add(leafEntry.id);
						this.opaqueParentsById.set(leafEntry.id, this.resolveOpaqueAppendParentId(leafEntry.parentId));
						opaqueIndex += 1;
						continue;
					}
					const effectiveLeafState = latestResetId !== void 0 && (leafState.leafId === null || !resetDescendantIds.has(leafState.leafId)) ? {
						leafId: this.leafId,
						appendParentId: this.leafId
					} : leafState;
					this.opaqueParentsById.set(leafEntry.id, effectiveLeafState.leafId);
					if (latestResetId !== void 0 && effectiveLeafState.leafId !== null && resetDescendantIds.has(effectiveLeafState.leafId)) resetDescendantIds.add(leafEntry.id);
					this.leafId = effectiveLeafState.leafId;
					this.appendParentId = effectiveLeafState.appendParentId;
					this.appendMode = effectiveLeafState.appendMode;
					opaqueIndex += 1;
					continue;
				}
				const link = parseParentLinkedOpaqueEntry(opaqueRecord);
				if (link) {
					this.opaqueParentsById.set(link.id, link.parentId);
					if (latestResetId !== void 0 && link.parentId !== null && resetDescendantIds.has(link.parentId)) resetDescendantIds.add(link.id);
					this.appendParentId = link.id;
				}
				opaqueIndex += 1;
			}
			const entry = this.fileEntries[index];
			if (!isIndexedSessionEntry(entry)) continue;
			if (entry.type === "label" && !this.byId.has(entry.targetId)) {
				this.opaqueParentsById.set(entry.id, this.resolveCanonicalParentId(entry.parentId));
				continue;
			}
			if (latestResetId !== void 0 && !isSessionTranscriptSideAppendEntry(entry) && (entry.parentId === null || !resetDescendantIds.has(entry.parentId)) || !Object.hasOwn(entry, "parentId") || !isSessionTranscriptSideAppendEntry(entry) && entry.parentId === this.appendParentId && this.leafId !== this.appendParentId) this.logicalParentsById.set(entry.id, this.leafId);
			this.byId.set(entry.id, entry);
			if (entry.type === "reset") {
				latestResetId = entry.id;
				resetDescendantIds.clear();
				resetDescendantIds.add(entry.id);
			} else {
				const logicalParentId = this.logicalParentsById.has(entry.id) ? this.logicalParentsById.get(entry.id) ?? null : entry.parentId;
				if (latestResetId !== void 0 && logicalParentId !== null && resetDescendantIds.has(logicalParentId)) resetDescendantIds.add(entry.id);
			}
			this.appendParentId = entry.id;
			if (isSessionTranscriptSideAppendEntry(entry)) this.appendMode = "side";
			else {
				this.leafId = entry.id;
				this.appendMode = void 0;
			}
			if (entry.type === "label") if (entry.label) {
				this.labelsById.set(entry.targetId, entry.label);
				this.labelTimestampsById.set(entry.targetId, entry.timestamp);
			} else {
				this.labelsById.delete(entry.targetId);
				this.labelTimestampsById.delete(entry.targetId);
			}
		}
	}
	resolveCanonicalParentId(parentId) {
		const seen = /* @__PURE__ */ new Set();
		let currentId = parentId;
		while (currentId && !this.byId.has(currentId)) {
			if (seen.has(currentId)) return null;
			seen.add(currentId);
			currentId = this.opaqueParentsById.get(currentId) ?? null;
		}
		return currentId;
	}
	normalizeEntryParent(entry) {
		const parentId = this.logicalParentsById.has(entry.id) ? this.logicalParentsById.get(entry.id) ?? null : this.resolveCanonicalParentId(entry.parentId);
		let normalized = parentId === entry.parentId ? entry : {
			...entry,
			parentId
		};
		if (normalized.parentId === normalized.id) normalized = {
			...normalized,
			parentId: null
		};
		if ((normalized.type === "compaction" || normalized.type === "reset") && normalized.firstKeptEntryId !== void 0 && !this.byId.has(normalized.firstKeptEntryId) && this.opaqueParentsById.has(normalized.firstKeptEntryId)) {
			const firstKeptEntryId = this.resolveCanonicalParentId(normalized.firstKeptEntryId) ?? this.findFirstCanonicalDescendantOnBranch(normalized.firstKeptEntryId, normalized.parentId) ?? this.findFirstCanonicalDescendant(normalized.firstKeptEntryId) ?? parentId;
			if (firstKeptEntryId && firstKeptEntryId !== normalized.firstKeptEntryId) normalized = {
				...normalized,
				firstKeptEntryId
			};
		}
		return normalized;
	}
	findFirstCanonicalDescendantOnBranch(opaqueId, leafId) {
		const seen = /* @__PURE__ */ new Set();
		let currentId = leafId;
		let firstCanonicalDescendant;
		while (currentId && !seen.has(currentId)) {
			if (currentId === opaqueId) return firstCanonicalDescendant;
			seen.add(currentId);
			const entry = this.byId.get(currentId);
			if (entry) {
				firstCanonicalDescendant = entry.id;
				currentId = entry.parentId;
			} else currentId = this.opaqueParentsById.get(currentId) ?? null;
		}
	}
	findFirstCanonicalDescendant(opaqueId) {
		for (const entry of this.fileEntries) {
			if (!isIndexedSessionEntry(entry)) continue;
			const seen = /* @__PURE__ */ new Set();
			let parentId = entry.parentId;
			while (parentId && this.opaqueParentsById.has(parentId) && !seen.has(parentId)) {
				if (parentId === opaqueId) return entry.id;
				seen.add(parentId);
				parentId = this.opaqueParentsById.get(parentId) ?? null;
			}
		}
	}
	resolveBranchTargetId(branchFromId) {
		if (this.byId.has(branchFromId)) return branchFromId;
		if (!this.opaqueParentsById.has(branchFromId)) return;
		return this.resolveCanonicalParentId(branchFromId);
	}
	clampOpaqueFileEntryIndexes() {
		let previousOpaqueIndex = 0;
		for (const opaqueEntry of this.opaqueFileEntries) {
			opaqueEntry.index = Math.max(previousOpaqueIndex, Math.min(opaqueEntry.index, this.fileEntries.length));
			previousOpaqueIndex = opaqueEntry.index;
		}
	}
	createLeafControl(parentId, appendParentId = this.appendParentId, appendMode) {
		return {
			type: "leaf",
			id: generateSessionEntryId({ has: (id) => this.byId.has(id) || this.opaqueParentsById.has(id) }),
			parentId,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			targetId: this.leafId,
			...appendParentId !== this.leafId ? { appendParentId } : {},
			...appendMode ? { appendMode } : {}
		};
	}
	rememberLeafControl(leafEntry) {
		this.opaqueFileEntries.push({
			index: this.fileEntries.length,
			record: leafEntry
		});
		this.opaqueParentsById.set(leafEntry.id, leafEntry.targetId);
	}
	getAppendParentId() {
		return this.appendParentId;
	}
	getAppendMode() {
		return this.appendMode;
	}
	getPersistedFileEntries(leafAppendParentId = this.appendParentId, leafAppendMode) {
		this.clampOpaqueFileEntryIndexes();
		const entries = [];
		let opaqueIndex = 0;
		for (let index = 0; index <= this.fileEntries.length; index += 1) {
			while (this.opaqueFileEntries[opaqueIndex]?.index === index) {
				entries.push(this.opaqueFileEntries[opaqueIndex]?.record);
				opaqueIndex += 1;
			}
			const entry = this.fileEntries[index];
			if (entry) entries.push(entry);
		}
		while (opaqueIndex < this.opaqueFileEntries.length) {
			entries.push(this.opaqueFileEntries[opaqueIndex]?.record);
			opaqueIndex += 1;
		}
		let persistedLeafId = null;
		let persistedAppendParentId = null;
		let rawTailId = null;
		for (const entry of entries) {
			const leafEntry = parseOpaqueLeafEntry(entry);
			if (leafEntry) {
				rawTailId = leafEntry.id;
				if (this.invalidLeafControlIds.has(leafEntry.id)) continue;
				const targetId = this.resolveOpaqueLeafTargetId(leafEntry.targetId);
				persistedLeafId = targetId;
				persistedAppendParentId = leafEntry.appendParentId === void 0 ? targetId : this.resolveOpaqueAppendParentId(leafEntry.appendParentId);
				continue;
			}
			if (isIndexedSessionEntry(entry)) {
				persistedLeafId = entry.id;
				persistedAppendParentId = entry.id;
				rawTailId = entry.id;
				continue;
			}
			const opaqueLink = parseParentLinkedOpaqueEntry(entry);
			if (opaqueLink) {
				persistedAppendParentId = opaqueLink.id;
				rawTailId = opaqueLink.id;
			}
		}
		if (persistedLeafId !== this.leafId || persistedAppendParentId !== this.appendParentId) {
			const leafEntry = this.createLeafControl(rawTailId, leafAppendParentId, leafAppendMode);
			this.rememberLeafControl(leafEntry);
			entries.push(leafEntry);
		}
		return entries;
	}
	getPersistedEntries() {
		return this.getPersistedFileEntries();
	}
	clearPreservedOpaqueFileEntries() {
		this.opaqueFileEntries = [];
		this.opaqueParentsById.clear();
		this.invalidLeafControlIds.clear();
		this.appendParentId = null;
		this.appendMode = void 0;
		this.pendingDeliberateAppend = false;
	}
	replacePersistedTranscript(options) {
		if (!this.persistenceTarget) return;
		const leafAppendParentId = options?.leafAppendParentId === void 0 ? this.appendParentId : options.leafAppendParentId;
		replaceTranscriptEventsSync(this.persistenceTarget, this.getPersistedFileEntries(leafAppendParentId, options?.leafAppendMode ?? this.appendMode));
		this.persistenceHeaderPending = false;
	}
	/** SQLite appends are synchronous; retained for the AgentSession contract. */
	flushPendingPersistence() {}
	isPersisted() {
		return this.persistenceTarget !== void 0;
	}
	getCwd() {
		return this.cwd;
	}
	getSessionId() {
		return this.sessionId;
	}
	getSessionTarget() {
		return this.persistenceTarget ? { ...this.persistenceTarget } : void 0;
	}
};
//#endregion
//#region src/agents/sessions/session-manager-persistence.ts
function requireTranscriptEventAppend(result, message) {
	if (result.ok && result.value) return;
	const cause = result.ok ? { code: "transcript-event-not-appended" } : result.error;
	throw new Error(`${message}: ${cause.code}`, { cause });
}
var SessionManagerPersistence = class extends SessionManagerCore {
	removeTrailingEntries(predicate, options) {
		let preservedStart = this.fileEntries.length;
		while (preservedStart > 1) {
			const entry = this.fileEntries[preservedStart - 1];
			if (!isIndexedSessionEntry(entry) || !options?.preserveTrailing?.(entry)) break;
			preservedStart -= 1;
		}
		let removeStart = preservedStart;
		while (removeStart > 1) {
			const entry = this.fileEntries[removeStart - 1];
			if (!isIndexedSessionEntry(entry) || !predicate(entry)) break;
			removeStart -= 1;
		}
		if (removeStart === preservedStart) return 0;
		const shiftOpaqueIndexesAfterRemoval = (start, count) => {
			for (const opaqueEntry of this.opaqueFileEntries) {
				const removedBeforeOpaque = Math.max(0, Math.min(count, opaqueEntry.index - start));
				opaqueEntry.index -= removedBeforeOpaque;
			}
		};
		const removedCount = preservedStart - removeStart;
		shiftOpaqueIndexesAfterRemoval(removeStart, removedCount);
		const removedEntries = this.fileEntries.splice(removeStart, removedCount);
		const removedParentById = new Map(removedEntries.map((entry) => [entry.id, entry.parentId]));
		for (let index = removeStart; index < this.fileEntries.length;) {
			const entry = this.fileEntries[index];
			if (isIndexedSessionEntry(entry) && entry.type === "label" && removedParentById.has(entry.targetId)) {
				removedParentById.set(entry.id, entry.parentId);
				shiftOpaqueIndexesAfterRemoval(index, 1);
				this.fileEntries.splice(index, 1);
				continue;
			}
			index += 1;
		}
		const resolveRetainedParentId = (parentId) => {
			const seen = /* @__PURE__ */ new Set();
			let currentId = parentId;
			while (currentId && removedParentById.has(currentId) && !seen.has(currentId)) {
				seen.add(currentId);
				currentId = removedParentById.get(currentId) ?? null;
			}
			return currentId;
		};
		const replacementParentId = resolveRetainedParentId(removedEntries[0]?.parentId ?? null);
		this.fileEntries = this.fileEntries.map((entry) => {
			if (!isIndexedSessionEntry(entry)) return entry;
			const parentId = resolveRetainedParentId(entry.parentId);
			return parentId === entry.parentId ? entry : {
				...entry,
				parentId
			};
		});
		this.opaqueFileEntries = this.opaqueFileEntries.map((opaqueEntry) => {
			if (!isRecord(opaqueEntry.record)) return opaqueEntry;
			const record = opaqueEntry.record;
			const parentId = record.parentId === null || typeof record.parentId === "string" ? resolveRetainedParentId(record.parentId) : void 0;
			const leafEntry = parseOpaqueLeafEntry(record);
			const targetId = leafEntry ? resolveRetainedParentId(leafEntry.targetId) : void 0;
			const appendParentId = leafEntry?.appendParentId !== void 0 ? resolveRetainedParentId(leafEntry.appendParentId) : void 0;
			if ((parentId === void 0 || parentId === record.parentId) && (targetId === void 0 || targetId === leafEntry?.targetId) && (appendParentId === void 0 || appendParentId === leafEntry?.appendParentId)) return opaqueEntry;
			return {
				...opaqueEntry,
				record: {
					...record,
					...parentId !== void 0 ? { parentId } : {},
					...targetId !== void 0 ? { targetId } : {},
					...appendParentId !== void 0 ? { appendParentId } : {}
				}
			};
		});
		this.clampOpaqueFileEntryIndexes();
		this.buildIndex();
		this.leafId = this.resolveCanonicalParentId(replacementParentId);
		this.appendParentId = replacementParentId;
		this.replacePersistedTranscript();
		return removedEntries.length;
	}
	persistRecord(entry, options) {
		if (this.persistenceTarget) return this.persistSqliteRecord(entry, options);
	}
	persist(entry, options) {
		return this.persistRecord(entry, options);
	}
	persistSqliteRecord(entry, options) {
		if (!this.persistenceTarget) return;
		const scope = this.persistenceTarget;
		if (this.persistenceHeaderPending) {
			if (!ensureSessionEntrySync(scope, {
				sessionId: scope.sessionId,
				updatedAt: Date.now()
			})) throw new Error("Session transcript header was not persisted");
			const header = this.fileEntries[0];
			if (!header || header.type !== "session") throw new Error("Session transcript header was not persisted");
			requireTranscriptEventAppend(appendTranscriptEventSync(scope, header), "Session transcript header was not persisted");
			this.persistenceHeaderPending = false;
		}
		const leafEntry = parseOpaqueLeafEntry(entry);
		if (leafEntry) {
			requireTranscriptEventAppend(appendTranscriptEventSync(scope, entry), `Session transcript leaf control was not persisted: ${leafEntry.id}`);
			return;
		}
		if (!isIndexedSessionEntry(entry)) return;
		if (entry.type !== "message") {
			requireTranscriptEventAppend(appendTranscriptEventSync(scope, entry, options?.appendIntent === "active-branch" ? { appendIntent: options.appendIntent } : void 0), `Session transcript entry was not persisted: ${entry.id}`);
			return;
		}
		const result = appendTranscriptMessageSync(scope, {
			cwd: this.cwd,
			eventId: entry.id,
			...options?.config ? { config: options.config } : {},
			...options?.idempotencyLookup ? { idempotencyLookup: options.idempotencyLookup } : {},
			message: entry.message,
			now: Date.parse(entry.timestamp),
			parentId: entry.parentId,
			...options?.appendIntent === "active-branch" ? { appendIntent: options.appendIntent } : {}
		});
		if (!result) throw new Error(`Session transcript message was not persisted: ${entry.id}`);
		if (result.messageId !== entry.id) {
			if ((entry.message.role === "user" && "idempotencyKey" in entry.message && typeof entry.message.idempotencyKey === "string" && entry.message.idempotencyKey.length > 0 ? entry.message.idempotencyKey : void 0) && options?.idempotencyLookup !== "caller-checked") {
				if (!result.anchor) throw new Error(`Session transcript anchor was not returned: ${result.messageId}`);
				return {
					adoptedMessageId: result.messageId,
					anchor: result.anchor,
					effectiveParentId: result.effectiveParentId ?? null
				};
			}
			throw new Error(`Session transcript parent entry was not persisted: ${entry.id}`);
		}
		if (options?.idempotencyLookup === "caller-checked" && (!result?.appended || result.messageId !== entry.id)) throw new Error(`Session transcript append was not persisted: ${entry.id}`);
		if (result.effectiveParentId === void 0) throw new Error(`Session transcript append parent was not returned: ${entry.id}`);
		return {
			...result.anchor ? { anchor: result.anchor } : {},
			effectiveParentId: result.effectiveParentId
		};
	}
};
//#endregion
//#region src/agents/sessions/session-manager-entries.ts
var SessionManagerEntries = class extends SessionManagerPersistence {
	appendEntry(entry, options) {
		const canonicalEntry = JSON.parse(JSON.stringify(entry));
		if (!isIndexedSessionEntry(canonicalEntry)) throw new Error(`Invalid session transcript entry: ${entry.type}`);
		const activeBranchAppend = !this.pendingDeliberateAppend && this.appendMode !== "side" && !isSessionTranscriptSideAppendEntry(canonicalEntry);
		const persistenceResult = this.persist(canonicalEntry, {
			...options,
			...activeBranchAppend ? { appendIntent: "active-branch" } : {}
		});
		if (persistenceResult && typeof persistenceResult === "object") {
			if (persistenceResult.adoptedMessageId) {
				this.reloadPersistedTranscript();
				if ((canonicalEntry.type === "message" ? this.resolveCurrentKeyedUserId(canonicalEntry.message) : void 0) !== persistenceResult.adoptedMessageId) throw new Error(`Session transcript parent entry was not persisted: ${canonicalEntry.id}`);
				this.pendingDeliberateAppend = false;
				return persistenceResult.anchor;
			}
		}
		const effectiveParentId = persistenceResult && typeof persistenceResult === "object" ? persistenceResult.effectiveParentId : persistenceResult;
		if (effectiveParentId !== void 0 && effectiveParentId !== canonicalEntry.parentId) {
			this.reloadPersistedTranscript();
			this.pendingDeliberateAppend = false;
			return persistenceResult && typeof persistenceResult === "object" ? persistenceResult.anchor : void 0;
		}
		if (!isSessionTranscriptSideAppendEntry(canonicalEntry) && canonicalEntry.parentId === this.appendParentId && this.leafId !== this.appendParentId) this.logicalParentsById.set(canonicalEntry.id, this.leafId);
		this.fileEntries.push(canonicalEntry);
		this.byId.set(canonicalEntry.id, canonicalEntry);
		this.appendParentId = canonicalEntry.id;
		this.pendingDeliberateAppend = false;
		if (isSessionTranscriptSideAppendEntry(canonicalEntry)) this.appendMode = "side";
		else {
			this.leafId = canonicalEntry.id;
			this.appendMode = void 0;
		}
		return persistenceResult && typeof persistenceResult === "object" ? persistenceResult.anchor : void 0;
	}
	resolveCurrentKeyedUserId(message) {
		if (message.role !== "user" || !("idempotencyKey" in message) || typeof message.idempotencyKey !== "string" || message.idempotencyKey.length === 0) return;
		let parent = this.appendParentId ? this.byId.get(this.appendParentId) : void 0;
		let remainingAncestors = this.byId.size;
		while (parent && remainingAncestors-- > 0 && isSessionContextMetadataEntry(parent)) parent = parent.parentId ? this.byId.get(parent.parentId) : void 0;
		if (parent?.type === "message" && parent.message.role === "user" && "idempotencyKey" in parent.message && parent.message.idempotencyKey === message.idempotencyKey) return parent.id;
	}
	appendMessage(message, options) {
		return this.appendMessageWithTranscriptAnchor(message, options).entryId;
	}
	appendMessageWithTranscriptAnchor(message, options) {
		if (options?.idempotencyLookup !== "caller-checked") {
			const currentUserId = this.resolveCurrentKeyedUserId(message);
			if (currentUserId) {
				const anchor = this.persistenceTarget ? readActiveTranscriptEntryAnchor({
					...this.persistenceTarget,
					entryId: currentUserId
				}) : void 0;
				if (this.persistenceTarget && !anchor) throw new Error(`Session transcript anchor was not returned: ${currentUserId}`);
				return {
					entryId: currentUserId,
					...anchor ? { anchor } : {}
				};
			}
		}
		const entry = {
			type: "message",
			id: generateSessionEntryId(this.byId),
			parentId: this.appendParentId,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			message
		};
		const anchor = this.appendEntry(entry, options);
		return {
			entryId: this.resolveCurrentKeyedUserId(message) ?? entry.id,
			...anchor ? { anchor } : {}
		};
	}
	appendThinkingLevelChange(thinkingLevel) {
		const entry = {
			type: "thinking_level_change",
			id: generateSessionEntryId(this.byId),
			parentId: this.appendParentId,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			thinkingLevel
		};
		this.appendEntry(entry);
		return entry.id;
	}
	appendModelChange(provider, modelId) {
		const entry = {
			type: "model_change",
			id: generateSessionEntryId(this.byId),
			parentId: this.appendParentId,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			provider,
			modelId
		};
		this.appendEntry(entry);
		return entry.id;
	}
	appendCompaction(summary, firstKeptEntryId, tokensBefore, details, fromHook) {
		const entry = {
			type: "compaction",
			id: generateSessionEntryId(this.byId),
			parentId: this.appendParentId,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			summary,
			firstKeptEntryId,
			tokensBefore,
			details,
			fromHook
		};
		this.appendEntry(entry, { invalidateSerializedPrefixCache: fromHook === true || details !== void 0 });
		return entry.id;
	}
	appendResetBoundary(reason, firstKeptEntryId) {
		const entry = {
			type: "reset",
			id: generateSessionEntryId(this.byId),
			parentId: this.appendParentId,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			reason,
			...firstKeptEntryId ? { firstKeptEntryId } : {}
		};
		this.appendEntry(entry);
		return entry.id;
	}
	appendCustomEntry(customType, data) {
		const entry = {
			type: "custom",
			customType,
			data,
			id: generateSessionEntryId(this.byId),
			parentId: this.appendParentId,
			timestamp: (/* @__PURE__ */ new Date()).toISOString()
		};
		this.appendEntry(entry, { invalidateSerializedPrefixCache: true });
		return entry.id;
	}
	appendSessionInfo(name) {
		const entry = {
			type: "session_info",
			id: generateSessionEntryId(this.byId),
			parentId: this.appendParentId,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			name: name.replace(/[\r\n]+/g, " ").trim()
		};
		this.appendEntry(entry);
		return entry.id;
	}
	getSessionName() {
		for (const entry of this.getEntries().toReversed()) if (entry.type === "session_info") return entry.name?.trim() || void 0;
	}
	appendCustomMessageEntry(customType, content, display, details) {
		const entry = {
			type: "custom_message",
			customType,
			content,
			display,
			details,
			id: generateSessionEntryId(this.byId),
			parentId: this.appendParentId,
			timestamp: (/* @__PURE__ */ new Date()).toISOString()
		};
		this.appendEntry(entry, { invalidateSerializedPrefixCache: true });
		return entry.id;
	}
	getLeafId() {
		return this.leafId;
	}
	appendLeafControl(params) {
		if (params.targetId !== null && !this.byId.has(params.targetId)) throw new Error(`Entry ${params.targetId} not found`);
		if (params.appendParentId !== null && !this.byId.has(params.appendParentId) && !this.opaqueParentsById.has(params.appendParentId)) throw new Error(`Append parent ${params.appendParentId} not found`);
		const previousLeafId = this.leafId;
		this.leafId = params.targetId;
		const entry = this.createLeafControl(this.appendParentId, params.appendParentId, params.appendMode);
		this.leafId = previousLeafId;
		this.persistRecord(entry);
		this.rememberLeafControl(entry);
		this.leafId = params.targetId;
		this.appendParentId = params.appendParentId;
		this.appendMode = params.appendMode;
		this.pendingDeliberateAppend = false;
		return entry;
	}
	getLeafEntry() {
		return this.leafId ? this.getEntry(this.leafId) : void 0;
	}
	getEntry(id) {
		const entry = this.byId.get(id);
		return entry ? this.normalizeEntryParent(entry) : void 0;
	}
	getChildren(parentId) {
		const children = [];
		for (const entry of this.byId.values()) {
			const normalizedEntry = this.normalizeEntryParent(entry);
			if (normalizedEntry.parentId === parentId) children.push(normalizedEntry);
		}
		return children;
	}
	getLabel(id) {
		return this.labelsById.get(id);
	}
	appendLabelChange(targetId, label) {
		if (!this.byId.has(targetId)) throw new Error(`Entry ${targetId} not found`);
		const entry = {
			type: "label",
			id: generateSessionEntryId(this.byId),
			parentId: this.appendParentId,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			targetId,
			label
		};
		this.appendEntry(entry);
		if (label) {
			this.labelsById.set(targetId, label);
			this.labelTimestampsById.set(targetId, entry.timestamp);
		} else {
			this.labelsById.delete(targetId);
			this.labelTimestampsById.delete(targetId);
		}
		return entry.id;
	}
	getBranch(fromId) {
		const path = [];
		const seen = /* @__PURE__ */ new Set();
		let currentId = fromId ?? this.leafId;
		while (currentId && !seen.has(currentId)) {
			seen.add(currentId);
			const current = this.byId.get(currentId);
			if (current) {
				const normalizedCurrent = this.normalizeEntryParent(current);
				path.push(normalizedCurrent);
				currentId = normalizedCurrent.parentId;
			} else currentId = this.opaqueParentsById.get(currentId) ?? null;
		}
		path.reverse();
		return path;
	}
	buildSessionContext() {
		return buildSessionContext(this.getBranch());
	}
	getBoundaryCount() {
		return this.getBranch().filter((entry) => entry.type === "compaction" || entry.type === "reset").length;
	}
	getHeader() {
		return this.fileEntries.find((entry) => entry.type === "session") ?? null;
	}
	getEntries() {
		return this.fileEntries.filter((entry) => entry.type !== "session" && this.byId.has(entry.id)).map((entry) => this.normalizeEntryParent(entry));
	}
	getTree() {
		const entries = this.getEntries();
		const nodeMap = /* @__PURE__ */ new Map();
		const roots = [];
		for (const entry of entries) nodeMap.set(entry.id, {
			entry,
			children: [],
			label: this.labelsById.get(entry.id),
			labelTimestamp: this.labelTimestampsById.get(entry.id)
		});
		for (const entry of entries) {
			const node = nodeMap.get(entry.id);
			const parentId = this.resolveCanonicalParentId(entry.parentId);
			if (parentId === null || parentId === entry.id) roots.push(node);
			else {
				const parent = nodeMap.get(parentId);
				if (parent) parent.children.push(node);
				else roots.push(node);
			}
		}
		const stack = [...roots];
		while (stack.length > 0) {
			const node = stack.pop();
			node.children.sort((left, right) => new Date(left.entry.timestamp).getTime() - new Date(right.entry.timestamp).getTime());
			stack.push(...node.children);
		}
		return roots;
	}
	branch(branchFromId) {
		const branchTargetId = this.resolveBranchTargetId(branchFromId);
		if (branchTargetId === void 0) throw new Error(`Entry ${branchFromId} not found`);
		this.leafId = branchTargetId;
		this.appendParentId = branchTargetId;
		this.appendMode = void 0;
		this.pendingDeliberateAppend = true;
	}
	resetLeaf() {
		this.leafId = null;
		this.appendParentId = null;
		this.appendMode = void 0;
		this.pendingDeliberateAppend = true;
	}
	branchWithSummary(branchFromId, summary, details, fromHook) {
		const branchTargetId = branchFromId === null ? null : this.resolveBranchTargetId(branchFromId);
		if (branchTargetId === void 0) throw new Error(`Entry ${branchFromId} not found`);
		const entry = {
			type: "branch_summary",
			id: generateSessionEntryId(this.byId),
			parentId: branchTargetId,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			fromId: branchTargetId ?? "root",
			summary,
			details,
			fromHook
		};
		this.appendEntry(entry, { invalidateSerializedPrefixCache: fromHook === true || details !== void 0 });
		return entry.id;
	}
};
//#endregion
//#region src/agents/sessions/session-manager-branching.ts
var SessionManagerBranching = class extends SessionManagerEntries {
	collectBranchedSessionPath(leafId) {
		const opaqueById = /* @__PURE__ */ new Map();
		for (const opaqueEntry of this.opaqueFileEntries) {
			const link = parseOpaqueLeafEntry(opaqueEntry.record) ?? parseParentLinkedOpaqueEntry(opaqueEntry.record);
			if (link && isRecord(opaqueEntry.record)) opaqueById.set(link.id, opaqueEntry.record);
		}
		const reversedNodes = [];
		const seen = /* @__PURE__ */ new Set();
		let currentId = leafId;
		while (currentId && !seen.has(currentId)) {
			seen.add(currentId);
			const entry = this.byId.get(currentId);
			if (entry) {
				reversedNodes.push({
					type: "entry",
					entry
				});
				if (this.logicalParentsById.has(entry.id)) {
					let physicalId = entry.parentId;
					while (physicalId && !seen.has(physicalId)) {
						const physicalRecord = opaqueById.get(physicalId);
						if (!physicalRecord || !this.opaqueParentsById.has(physicalId)) break;
						seen.add(physicalId);
						reversedNodes.push({
							type: "opaque",
							id: physicalId,
							record: physicalRecord
						});
						physicalId = this.opaqueParentsById.get(physicalId) ?? null;
					}
					currentId = this.logicalParentsById.get(entry.id) ?? null;
				} else currentId = entry.parentId;
				continue;
			}
			const record = opaqueById.get(currentId);
			if (!record || !this.opaqueParentsById.has(currentId)) break;
			reversedNodes.push({
				type: "opaque",
				id: currentId,
				record
			});
			currentId = this.opaqueParentsById.get(currentId) ?? null;
		}
		const entries = [];
		const opaqueEntries = [];
		const usedIds = /* @__PURE__ */ new Set();
		let tailId = null;
		for (const node of reversedNodes.toReversed()) {
			if (node.type === "entry") {
				if (node.entry.type === "label") continue;
				const branchEntry = node.entry.parentId === tailId ? node.entry : {
					...node.entry,
					parentId: tailId
				};
				entries.push(branchEntry);
				usedIds.add(branchEntry.id);
				tailId = branchEntry.id;
				continue;
			}
			if (parseOpaqueLeafEntry(node.record)) continue;
			opaqueEntries.push({
				index: entries.length + 1,
				record: {
					...node.record,
					parentId: tailId
				}
			});
			usedIds.add(node.id);
			tailId = node.id;
		}
		return {
			entries,
			opaqueEntries,
			tailId,
			usedIds
		};
	}
	async createBranchedSession(leafId) {
		const previousSessionId = this.sessionId;
		const branchPath = this.collectBranchedSessionPath(leafId);
		if (branchPath.entries.length === 0) throw new Error(`Entry ${leafId} not found`);
		const newSessionId = createManagedSessionId();
		const timestamp = (/* @__PURE__ */ new Date()).toISOString();
		const persistenceTarget = this.persistenceTarget;
		const header = {
			type: "session",
			version: 3,
			id: newSessionId,
			timestamp,
			cwd: this.cwd,
			parentSession: persistenceTarget ? previousSessionId : void 0
		};
		const pathEntryIds = new Set(branchPath.entries.map((entry) => entry.id));
		const labelsToWrite = [];
		for (const [targetId, label] of this.labelsById) if (pathEntryIds.has(targetId)) labelsToWrite.push({
			targetId,
			label,
			timestamp: this.labelTimestampsById.get(targetId)
		});
		const labelEntries = [];
		let parentId = branchPath.tailId;
		for (const { targetId, label, timestamp: labelTimestamp } of labelsToWrite) {
			const labelEntry = {
				type: "label",
				id: generateSessionEntryId(branchPath.usedIds),
				parentId,
				timestamp: labelTimestamp,
				targetId,
				label
			};
			branchPath.usedIds.add(labelEntry.id);
			labelEntries.push(labelEntry);
			parentId = labelEntry.id;
		}
		this.fileEntries = [
			header,
			...branchPath.entries,
			...labelEntries
		];
		this.opaqueFileEntries = branchPath.opaqueEntries;
		this.sessionId = newSessionId;
		this.buildIndex();
		if (!persistenceTarget) return;
		const entryScope = {
			agentId: persistenceTarget.agentId,
			sessionKey: persistenceTarget.sessionKey,
			storePath: persistenceTarget.storePath
		};
		const previousEntry = loadSessionEntry(entryScope);
		const updatedAt = Date.now();
		const nextTarget = {
			...persistenceTarget,
			sessionId: newSessionId
		};
		const nextEntry = {
			...previousEntry ? projectCanonicalSessionEntryShape(previousEntry) : { updatedAt },
			sessionId: newSessionId,
			updatedAt
		};
		try {
			if (!await withTranscriptWriteTransaction(persistenceTarget, () => {
				const currentEntry = loadSessionEntry(entryScope);
				if (currentEntry?.sessionId !== previousSessionId || currentEntry.lifecycleRevision !== previousEntry?.lifecycleRevision) return false;
				replaceSessionEntrySync(entryScope, nextEntry);
				if (!replaceTranscriptEventsSync(nextTarget, this.getPersistedFileEntries())) throw new Error("Branched session transcript was not persisted");
				return true;
			})) {
				const actualEntry = loadSessionEntry(entryScope);
				const cause = actualEntry ? {
					actualSessionId: actualEntry.sessionId,
					code: "session-rebound",
					expectedSessionId: previousSessionId,
					sessionKey: persistenceTarget.sessionKey
				} : {
					code: "session-entry-missing",
					expectedSessionId: previousSessionId,
					sessionKey: persistenceTarget.sessionKey
				};
				throw new Error(`Branched session was not persisted: ${cause.code}`, { cause });
			}
		} catch (error) {
			this.setSessionTarget(persistenceTarget);
			throw error;
		}
		this.persistenceTarget = nextTarget;
		this.persistenceHeaderPending = false;
		return newSessionId;
	}
};
//#endregion
//#region src/agents/sessions/session-manager.ts
/**
* Session tree manager backed by an explicit SQLite transcript identity.
*
* The public facade lives here; codec, storage, persistence, and branching
* behavior are split into focused internal modules.
*/
var SessionManager = class SessionManager extends SessionManagerBranching {
	constructor(cwd, persistenceTarget, loadedEntries) {
		super(cwd, persistenceTarget, loadedEntries);
	}
	/** Makes pending append-oriented persistence durable without rewriting committed entries. */
	flushPendingPersistence() {
		super.flushPendingPersistence();
	}
	appendMessage(message, options) {
		return super.appendMessage(message, options);
	}
	appendMessageWithTranscriptAnchor(message, options) {
		return super.appendMessageWithTranscriptAnchor(message, options);
	}
	static open(target, cwdOverride) {
		const entries = loadTranscriptEventsSync(target);
		const header = entries.find((entry) => typeof entry === "object" && entry !== null && entry.type === "session");
		return new SessionManager(cwdOverride ?? header?.cwd ?? process.cwd(), target, entries);
	}
	/** Appends to the current transcript leaf without hydrating its history. */
	static appendMessageToTranscript(target, message, options) {
		const result = appendTranscriptMessageSync(target, {
			cwd: process.cwd(),
			message,
			...options?.config ? { config: options.config } : {}
		});
		if (!result) throw new Error(`Session transcript message was not persisted: ${target.sessionId}`);
		return result.messageId;
	}
	static inMemory(cwd = process.cwd()) {
		return new SessionManager(cwd);
	}
	static fromEntries(entries, cwdOverride) {
		const fileEntries = structuredClone(entries);
		const header = fileEntries.find((entry) => typeof entry === "object" && entry !== null && entry.type === "session");
		return new SessionManager(cwdOverride ?? header?.cwd ?? process.cwd(), void 0, fileEntries);
	}
};
//#endregion
export { SessionManager as t };
