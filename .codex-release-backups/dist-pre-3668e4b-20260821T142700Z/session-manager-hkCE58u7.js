import { t as createSubsystemLogger } from "./subsystem-DNgaGOch.js";
import { t as truncateUtf8Prefix } from "./utf8-truncate-Dro7v_iB.js";
import { t as spawnTerminalPty } from "./terminal-pty-VAmjoA5g.js";
import { n as stageTerminalUpload, t as ensureTerminalUploadCleanup } from "./terminal-file-upload-DDHBuIJa.js";
import { t as TerminalOutputRing } from "./output-ring-Bz-YhhYd.js";
import { n as TERMINAL_EVENT_EXIT, t as TERMINAL_EVENT_DATA } from "./gateway-transport-BMjBhNL-.js";
import { randomUUID } from "node:crypto";
//#region src/gateway/terminal/backend.ts
async function createLocalTerminalBackend(params, spawn = spawnTerminalPty) {
	const pty = await spawn(params);
	return {
		write: (data) => pty.write(data),
		resize: (cols, rows) => pty.resize(cols, rows),
		pause: () => pty.pause(),
		resume: () => pty.resume(),
		kill: () => pty.kill(),
		onData: (callback) => pty.onData(callback),
		onExit: (callback) => pty.onExit(callback)
	};
}
//#endregion
//#region src/gateway/terminal/intro-banner.ts
const RESET = "\x1B[0m";
const TERMINAL_INTRO_ART = [
	"          ..              ..",
	"        .●●:.:          • •●●",
	"       .●●●•●●          ●•●●●●",
	"       :●●●●●•  ..  ..  ●●●●●●.",
	"       .●●●●●::.:●••●:..•●●●●●",
	"        :●●●●.  :●●●●.  :●●●●.",
	"         •●●●•  ●●●●●● .●●●●:",
	"        ..:••●●•●●●●●●•●●••...",
	"       ..:●•●••●●●●●●●●••●●•:..",
	"       :.:•:•••●●●●●●●••••••:.:",
	"       .•. ●:..:●●●●●●...:• :•",
	"          .:.   ●●●●●●   .:.",
	"            .   ●●●●●•   .",
	"           .   :●●●●●●.   .",
	"              ●●●●●●●●●•",
	"              .::•::•::"
];
function composeTerminalIntroBanner() {
	return `\r\n${`\x1b[33mWelcome to the Claw.${RESET}`}\r\n\r\n${`\x1b[91m${TERMINAL_INTRO_ART.join("\r\n")}\r\n\r\n`}${RESET}`;
}
//#endregion
//#region src/gateway/terminal/output-coalescer.ts
const TERMINAL_OUTPUT_COALESCE_WINDOW_MS = 4;
const TERMINAL_OUTPUT_FRAME_BYTES = 64 * 1024;
/** Batches adjacent PTY chunks while keeping each emitted frame UTF-8 bounded. */
var TerminalOutputCoalescer = class {
	constructor(emit) {
		this.chunks = [];
		this.bufferedBytes = 0;
		this.timer = null;
		this.emit = emit;
	}
	get isEmpty() {
		return this.chunks.length === 0;
	}
	push(data, opts) {
		let remaining = data;
		while (remaining) {
			const available = TERMINAL_OUTPUT_FRAME_BYTES - this.bufferedBytes;
			const part = truncateUtf8Prefix(remaining, available);
			if (!part) {
				this.flush();
				continue;
			}
			this.chunks.push(part);
			this.bufferedBytes += Buffer.byteLength(part, "utf8");
			remaining = remaining.slice(part.length);
			if (this.bufferedBytes >= TERMINAL_OUTPUT_FRAME_BYTES) this.flush();
		}
		if (opts?.flushNow) this.flush();
		else this.schedule();
	}
	flush() {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
		if (this.chunks.length === 0) return;
		const data = this.chunks.join("");
		this.chunks = [];
		this.bufferedBytes = 0;
		this.emit(data);
	}
	clear() {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
		this.chunks = [];
		this.bufferedBytes = 0;
	}
	dispose(opts) {
		if (opts?.flush) this.flush();
		else this.clear();
	}
	schedule() {
		if (this.timer || this.chunks.length === 0) return;
		this.timer = setTimeout(() => {
			this.timer = null;
			this.flush();
		}, TERMINAL_OUTPUT_COALESCE_WINDOW_MS);
		this.timer.unref?.();
	}
};
//#endregion
//#region src/gateway/terminal/output-flow-control.ts
const TERMINAL_OUTPUT_HIGH_WATER_BYTES = 4 * 1024 * 1024;
const TERMINAL_OUTPUT_LOW_WATER_BYTES = 512 * 1024;
const TERMINAL_OUTPUT_REASSERT_MS = 5e3;
const INTERACTIVE_OUTPUT_BYTES = 1024;
const INTERACTIVE_OUTPUT_WINDOW_MS = 100;
/** Couples PTY output batching to the live recipient WebSockets' send pressure. */
var TerminalOutputController = class {
	constructor(options) {
		this.endOffsetValue = 0;
		this.emittedOffset = 0;
		this.lastInputAtMs = Number.NEGATIVE_INFINITY;
		this.desiredPaused = false;
		this.reassertTimer = null;
		this.backend = options.backend;
		this.getConnIds = options.getConnIds;
		this.getBufferedAmount = options.getBufferedAmount;
		this.record = options.record;
		this.emit = options.emit;
		this.now = options.now ?? Date.now;
		this.coalescer = new TerminalOutputCoalescer((data) => this.emitBuffered(data));
	}
	/** Cumulative UTF-16 end offset across streamed and detached output. */
	get endOffset() {
		return this.endOffsetValue;
	}
	push(chunk) {
		this.record(chunk);
		this.endOffsetValue += chunk.length;
		const connIds = this.getConnIds();
		if (connIds.length === 0) return;
		if (this.coalescer.isEmpty) this.reconcile(connIds);
		const interactive = Buffer.byteLength(chunk, "utf8") <= INTERACTIVE_OUTPUT_BYTES && this.now() - this.lastInputAtMs <= INTERACTIVE_OUTPUT_WINDOW_MS;
		this.coalescer.push(chunk, { flushNow: interactive });
	}
	noteInput() {
		this.lastInputAtMs = this.now();
	}
	/** Reassesses flow control immediately when the live recipient set changes. */
	reconcileRecipients() {
		this.reconcile(this.getConnIds());
	}
	/** Flushes existing viewers, then aligns live frames after the attach snapshot. */
	prepareViewerAttach() {
		this.coalescer.flush();
		this.emittedOffset = this.endOffsetValue;
	}
	resetOwnership() {
		this.coalescer.clear();
		this.emittedOffset = this.endOffsetValue;
		this.lastInputAtMs = Number.NEGATIVE_INFINITY;
		if (this.reassertTimer) {
			this.desiredPaused = false;
			this.tryResume();
		}
	}
	dispose(opts) {
		this.coalescer.dispose(opts);
		if (this.reassertTimer) {
			clearInterval(this.reassertTimer);
			this.reassertTimer = null;
			this.desiredPaused = false;
			this.tryResume();
		}
	}
	emitBuffered(data) {
		const connIds = this.getConnIds();
		if (connIds.length === 0) return;
		this.emittedOffset += data.length;
		this.emit(connIds, data, this.emittedOffset);
		this.reconcile(connIds);
	}
	reconcile(connIds) {
		const bufferedAmount = this.maxBufferedAmount(connIds);
		if (bufferedAmount === void 0) return;
		if (bufferedAmount >= TERMINAL_OUTPUT_HIGH_WATER_BYTES) {
			this.ensureReassertTimer();
			if (!this.desiredPaused) {
				this.desiredPaused = true;
				this.tryPause();
			}
			return;
		}
		if (bufferedAmount <= TERMINAL_OUTPUT_LOW_WATER_BYTES && this.desiredPaused) {
			this.desiredPaused = false;
			this.tryResume();
		}
	}
	ensureReassertTimer() {
		if (this.reassertTimer) return;
		this.reassertTimer = setInterval(() => {
			const bufferedAmount = this.maxBufferedAmount(this.getConnIds());
			if (bufferedAmount !== void 0) {
				if (bufferedAmount >= TERMINAL_OUTPUT_HIGH_WATER_BYTES) this.desiredPaused = true;
				else if (bufferedAmount <= TERMINAL_OUTPUT_LOW_WATER_BYTES) this.desiredPaused = false;
			} else this.desiredPaused = false;
			if (this.desiredPaused) this.tryPause();
			else this.tryResume();
		}, TERMINAL_OUTPUT_REASSERT_MS);
		this.reassertTimer.unref?.();
	}
	maxBufferedAmount(connIds) {
		let maximum;
		for (const connId of connIds) {
			const amount = this.getBufferedAmount(connId);
			if (amount !== void 0 && (maximum === void 0 || amount > maximum)) maximum = amount;
		}
		return maximum;
	}
	tryPause() {
		try {
			this.backend.pause();
		} catch {}
	}
	tryResume() {
		try {
			this.backend.resume();
		} catch {}
	}
};
/** Default grace period before a detached session is killed (seconds). */
const DEFAULT_TERMINAL_DETACH_SECONDS = 300;
//#endregion
//#region src/gateway/terminal/session-manager.ts
const log = createSubsystemLogger("gateway/terminal");
function terminalOwnerMatches(owner, ownerKey, agentId) {
	if (owner?.kind !== "agent") return false;
	return owner.agentSessionKey === ownerKey && owner.agentId === agentId;
}
function terminalLifecycleOwnerMatches(owner, ownerKey) {
	return owner?.kind === "agent" && (owner.agentSessionKey === ownerKey || owner.taskId === ownerKey);
}
/**
* Tracks live PTY sessions keyed by session id, with a reverse index for
* connection owners and viewers so disconnect cleanup stays bounded.
*/
var TerminalSessionManager = class {
	constructor(options) {
		this.sessions = /* @__PURE__ */ new Map();
		this.byConn = /* @__PURE__ */ new Map();
		this.pendingOpens = /* @__PURE__ */ new Map();
		this.pendingByConn = /* @__PURE__ */ new Map();
		this.opening = 0;
		this.spawning = 0;
		ensureTerminalUploadCleanup();
		this.emit = options.emit;
		this.getBufferedAmount = options.getBufferedAmount ?? (() => void 0);
		this.spawn = options.spawn;
		this.maxSessions = options.maxSessions ?? 24;
		this.detachGraceMs = options.detachGraceMs ?? 0;
		this.maxDetachedSessions = options.maxDetachedSessions ?? 8;
		this.scrollbackChars = options.scrollbackChars ?? 262144;
	}
	/** Number of live sessions; used by tests and health surfaces. */
	get size() {
		return this.sessions.size;
	}
	/** Spawns a shell and wires its output/exit to its live connection recipients. */
	async open(request) {
		if (request.signal?.aborted) return {
			ok: false,
			code: "closed",
			message: this.openAbortMessage(request.signal)
		};
		if (this.spawning >= this.maxSessions * 2) return {
			ok: false,
			code: "limit",
			message: `terminal spawn limit reached (${this.maxSessions * 2})`
		};
		let evictionCandidate;
		if (this.sessions.size + this.opening >= this.maxSessions) {
			evictionCandidate = this.claimLongestIdleAgentSession();
			if (!evictionCandidate) return {
				ok: false,
				code: "limit",
				message: `terminal session limit reached (${this.maxSessions})`
			};
		}
		const releaseEvictionClaim = () => {
			if (evictionCandidate) {
				evictionCandidate.evictionClaimed = false;
				evictionCandidate = void 0;
			}
		};
		this.opening += 1;
		this.spawning += 1;
		let reservationActive = true;
		const releaseReservation = () => {
			if (!reservationActive) return;
			reservationActive = false;
			this.opening -= 1;
			this.untrackPendingOpen(request.owner, pending);
		};
		const pending = {
			agentId: request.agentId,
			abort: (message) => {
				pending.abortMessage ??= message;
				releaseReservation();
				releaseEvictionClaim();
			}
		};
		const abortPending = () => {
			pending.abort(this.openAbortMessage(request.signal));
		};
		request.signal?.addEventListener("abort", abortPending, { once: true });
		this.trackPendingOpen(request.owner, pending);
		let backend;
		try {
			backend = request.createBackend ? await request.createBackend() : await createLocalTerminalBackend({
				file: request.shell,
				args: request.args,
				cwd: request.cwd,
				env: request.env,
				cols: request.cols,
				rows: request.rows
			}, this.spawn);
		} catch (err) {
			this.spawning -= 1;
			releaseReservation();
			releaseEvictionClaim();
			request.signal?.removeEventListener("abort", abortPending);
			return {
				ok: false,
				code: "spawn_failed",
				message: err instanceof Error ? err.message : String(err)
			};
		}
		this.spawning -= 1;
		releaseReservation();
		request.signal?.removeEventListener("abort", abortPending);
		if (pending.abortMessage) {
			releaseEvictionClaim();
			try {
				backend.kill();
			} catch {}
			return {
				ok: false,
				code: "closed",
				message: pending.abortMessage
			};
		}
		if (evictionCandidate) {
			const claimed = evictionCandidate;
			evictionCandidate = void 0;
			claimed.evictionClaimed = false;
			if (this.sessions.size + this.opening >= this.maxSessions) {
				const victim = this.claimLongestIdleAgentSession();
				if (!victim) {
					try {
						backend.kill();
					} catch {}
					return {
						ok: false,
						code: "limit",
						message: `terminal session limit reached (${this.maxSessions})`
					};
				}
				victim.evictionClaimed = false;
				log.info(`evicted idle agent terminal session under pool pressure: id=${victim.id} agent=${victim.agentId} idleMs=${Date.now() - victim.lastActivityAtMs}`);
				this.finalize(victim, "closed", {});
			}
		}
		const sessionId = randomUUID();
		const buffer = new TerminalOutputRing(this.scrollbackChars);
		const output = new TerminalOutputController({
			backend,
			getConnIds: () => this.sessionConnIds(session),
			getBufferedAmount: this.getBufferedAmount,
			record: (chunk) => buffer.push(chunk),
			emit: (connIds, data, seq) => {
				for (const connId of connIds) this.emit(connId, TERMINAL_EVENT_DATA, {
					sessionId,
					seq,
					data
				});
			}
		});
		const session = {
			id: sessionId,
			owner: request.owner,
			viewers: /* @__PURE__ */ new Set(),
			agentId: request.agentId,
			cwd: request.cwd,
			shell: request.shell,
			backend,
			stageUpload: request.stageUpload ?? stageTerminalUpload,
			closed: false,
			createdAtMs: Date.now(),
			buffer,
			output,
			reaper: null,
			detachedAtMs: null,
			lastActivityAtMs: Date.now()
		};
		this.sessions.set(session.id, session);
		if (request.owner.kind === "conn") {
			this.indexByConn(request.owner.connId, session.id);
			session.output.push(composeTerminalIntroBanner());
		}
		backend.onData((chunk) => {
			if (!session.closed) {
				session.lastActivityAtMs = Date.now();
				session.output.push(chunk);
			}
		});
		backend.onExit((event) => {
			const signal = event.signal && event.signal !== 0 ? event.signal : null;
			this.finalize(session, event.error ? "error" : "process_exit", {
				exitCode: event.exitCode ?? null,
				signal,
				...event.error ? { error: event.error } : {}
			});
		});
		return {
			ok: true,
			sessionId: session.id,
			agentId: session.agentId,
			cwd: session.cwd,
			shell: session.shell
		};
	}
	/** Writes client input to a session; returns false when the session is gone. */
	write(connId, sessionId, data) {
		const session = this.interactiveSession(connId, sessionId);
		if (!session) return false;
		return this.writeSession(session, data);
	}
	/** Writes agent input after proving session-key ownership. */
	writeAgent(agentSessionKey, sessionId, data, agentId) {
		const session = this.agentOwnedSession(agentSessionKey, sessionId, agentId);
		return session ? this.writeSession(session, data) : false;
	}
	writeSession(session, data) {
		try {
			session.lastActivityAtMs = Date.now();
			session.output.noteInput();
			session.backend.write(data);
			return true;
		} catch {
			this.finalize(session, "error", { error: "write failed" });
			return false;
		}
	}
	/** Applies a new PTY grid size; returns false when the session is gone. */
	resize(connId, sessionId, cols, rows) {
		const session = this.interactiveSession(connId, sessionId);
		if (!session) return false;
		return this.resizeSession(session, cols, rows);
	}
	/** Resizes an agent-owned PTY after proving session-key ownership. */
	resizeAgent(agentSessionKey, sessionId, cols, rows, agentId) {
		const session = this.agentOwnedSession(agentSessionKey, sessionId, agentId);
		return session ? this.resizeSession(session, cols, rows) : false;
	}
	resizeSession(session, cols, rows) {
		try {
			session.backend.resize(cols, rows);
			return true;
		} catch {
			this.finalize(session, "error", { error: "resize failed" });
			return false;
		}
	}
	/** Stages a file on the same host as an owned terminal session. */
	async upload(connId, sessionId, file) {
		const session = this.interactiveSession(connId, sessionId);
		if (!session) return;
		const result = await session.stageUpload(file);
		return this.interactiveSession(connId, sessionId) === session ? result : void 0;
	}
	/** Closes one session on operator request. */
	close(connId, sessionId) {
		const session = this.sessions.get(sessionId);
		if (!session) return false;
		if (session.owner?.kind === "agent" && session.viewers.has(connId)) return this.removeViewer(session, connId);
		if (session.owner?.kind !== "conn" || session.owner.connId !== connId || session.closed) return false;
		this.finalize(session, "closed", {});
		return true;
	}
	/** Closes an agent-owned PTY after proving session-key ownership. */
	closeAgent(agentSessionKey, sessionId, agentId) {
		const session = this.agentOwnedSession(agentSessionKey, sessionId, agentId);
		if (!session) return false;
		this.finalize(session, "closed", {});
		return true;
	}
	/** Closes every live or spawning PTY owned by one exact agent session or task. */
	closeAgentSessions(agentSessionKey, agentId) {
		for (const [pending, owner] of this.pendingOpens) if (agentId ? terminalOwnerMatches(owner, agentSessionKey, agentId) : terminalLifecycleOwnerMatches(owner, agentSessionKey)) pending.abort("terminal closed because its task ended");
		const owned = [...this.sessions.values()].filter((session) => !session.closed && (agentId ? terminalOwnerMatches(session.owner, agentSessionKey, agentId) : terminalLifecycleOwnerMatches(session.owner, agentSessionKey)));
		for (const session of owned) this.finalize(session, "closed", {});
		return owned.length;
	}
	/**
	* Rebinds a connection-owned session, or co-attaches a viewer to an
	* agent-owned session. Operator-to-operator attach remains take-over; only
	* agent-owned sessions gain shared viewers.
	*/
	attach(connId, sessionId) {
		const session = this.sessions.get(sessionId);
		if (!session || session.closed) return;
		if (session.owner?.kind === "agent") {
			session.output.prepareViewerAttach();
			session.viewers.add(connId);
			this.indexByConn(connId, session.id);
			return this.attachSummary(session);
		}
		if (session.reaper) {
			clearTimeout(session.reaper);
			session.reaper = null;
		}
		session.output.resetOwnership();
		session.detachedAtMs = null;
		const previousConnId = session.owner?.kind === "conn" ? session.owner.connId : null;
		if (previousConnId !== null && previousConnId !== connId) {
			this.unindexByConn(previousConnId, session.id);
			this.emit(previousConnId, TERMINAL_EVENT_EXIT, {
				sessionId: session.id,
				exitCode: null,
				signal: null,
				reason: "detached"
			});
		}
		session.owner = {
			kind: "conn",
			connId
		};
		this.indexByConn(connId, session.id);
		return this.attachSummary(session);
	}
	attachSummary(session) {
		return {
			sessionId: session.id,
			agentId: session.agentId,
			cwd: session.cwd,
			shell: session.shell,
			buffer: session.buffer.snapshot(),
			seq: session.output.endOffset
		};
	}
	/** Every live session, oldest first; all admin connections see the same list. */
	list() {
		return [...this.sessions.values()].filter((session) => !session.closed).map((session) => {
			const owner = session.owner?.kind === "agent" ? `agent:${session.owner.agentSessionKey}` : "conn";
			return {
				sessionId: session.id,
				agentId: session.agentId,
				shell: session.shell,
				cwd: session.cwd,
				attached: session.owner?.kind === "conn" || session.owner?.kind === "agent" && session.viewers.size > 0,
				owner,
				createdAtMs: session.createdAtMs
			};
		}).toSorted((a, b) => a.createdAtMs - b.createdAtMs);
	}
	/** Raw buffered output for one session, or undefined when it is gone. */
	snapshot(sessionId) {
		const session = this.sessions.get(sessionId);
		if (!session || session.closed) return;
		return session.buffer.snapshot();
	}
	/** Raw buffer for an agent-owned session, guarded by the caller session key. */
	snapshotAgent(agentSessionKey, sessionId, agentId) {
		return this.agentOwnedSession(agentSessionKey, sessionId, agentId)?.buffer.snapshot();
	}
	/** Live sessions owned by one agent tool caller. */
	listAgent(agentSessionKey, agentId) {
		const sessionIds = new Set([...this.sessions.values()].filter((session) => !session.closed && terminalOwnerMatches(session.owner, agentSessionKey, agentId)).map((session) => session.id));
		return this.list().filter((summary) => sessionIds.has(summary.sessionId));
	}
	trackPendingOpen(owner, pending) {
		this.pendingOpens.set(pending, owner);
		if (owner.kind !== "conn") return;
		let set = this.pendingByConn.get(owner.connId);
		if (!set) {
			set = /* @__PURE__ */ new Set();
			this.pendingByConn.set(owner.connId, set);
		}
		set.add(pending);
	}
	openAbortMessage(signal) {
		return signal?.reason instanceof Error ? signal.reason.message : "terminal open cancelled";
	}
	untrackPendingOpen(owner, pending) {
		this.pendingOpens.delete(pending);
		if (owner.kind !== "conn") return;
		const set = this.pendingByConn.get(owner.connId);
		if (set) {
			set.delete(pending);
			if (set.size === 0) this.pendingByConn.delete(owner.connId);
		}
	}
	/**
	* Handles a dropped connection: detaches its sessions for later reattach
	* when a grace period is configured, otherwise kills them (legacy behavior,
	* still selected by detachedSessionTimeoutSeconds: 0).
	*/
	handleDisconnect(connId) {
		const opens = this.pendingByConn.get(connId);
		if (opens) for (const pending of opens) pending.abort("connection closed during open");
		const ids = this.byConn.get(connId);
		if (!ids) return;
		for (const id of Array.from(ids)) {
			const session = this.sessions.get(id);
			if (!session) continue;
			if (session.owner?.kind === "agent") {
				this.removeViewer(session, connId);
				continue;
			}
			if (session.owner?.kind !== "conn" || session.owner.connId !== connId) continue;
			if (this.detachGraceMs > 0) this.detach(session);
			else this.finalize(session, "disconnected", {}, { silent: true });
		}
		this.byConn.delete(connId);
	}
	/** Closes live and pending sessions whose agent no longer permits a host shell. */
	closeDisallowedAgents(isAllowed) {
		for (const pending of this.pendingOpens.keys()) if (!isAllowed(pending.agentId)) pending.abort("terminal closed because the agent policy changed");
		for (const session of Array.from(this.sessions.values())) if (!isAllowed(session.agentId)) this.finalize(session, "closed", { error: "terminal closed because the agent policy changed" });
	}
	/** Parks a session ownerless with a reaper; PTY output keeps buffering. */
	detach(session) {
		session.output.resetOwnership();
		session.owner = null;
		session.detachedAtMs = Date.now();
		session.reaper = setTimeout(() => {
			this.finalize(session, "disconnected", {}, { silent: true });
		}, this.detachGraceMs);
		session.reaper.unref?.();
		this.enforceDetachedCap();
	}
	enforceDetachedCap() {
		const detached = [...this.sessions.values()].filter((session) => !session.closed && session.owner === null).toSorted((a, b) => (a.detachedAtMs ?? 0) - (b.detachedAtMs ?? 0));
		for (const session of detached.slice(0, Math.max(0, detached.length - this.maxDetachedSessions))) this.finalize(session, "disconnected", {}, { silent: true });
	}
	/**
	* Tears down every session — detached ones included — on gateway
	* shutdown/stop. Silent because the sockets are going away anyway (disabling
	* the terminal is a `gateway` restart, so that path also runs through here,
	* not a live notification).
	*/
	disposeAll() {
		for (const pending of this.pendingOpens.keys()) pending.abort("gateway closed during terminal open");
		for (const session of Array.from(this.sessions.values())) this.finalize(session, "disconnected", {}, { silent: true });
	}
	indexByConn(connId, sessionId) {
		let connSessions = this.byConn.get(connId);
		if (!connSessions) {
			connSessions = /* @__PURE__ */ new Set();
			this.byConn.set(connId, connSessions);
		}
		connSessions.add(sessionId);
	}
	unindexByConn(connId, sessionId) {
		const sessions = this.byConn.get(connId);
		sessions?.delete(sessionId);
		if (sessions?.size === 0) this.byConn.delete(connId);
	}
	/**
	* Claims the longest-idle agent-owned session as an eviction candidate when
	* the pool is exhausted. Viewer-attached and connection-owned sessions are
	* never evicted; an idle viewer-free background job losing its PTY under
	* pressure is the accepted tradeoff for keeping the pool available. Claimed
	* sessions are skipped so concurrent opens select distinct victims.
	*/
	claimLongestIdleAgentSession() {
		let candidate;
		for (const session of this.sessions.values()) {
			if (session.closed || session.evictionClaimed || session.owner?.kind !== "agent" || session.viewers.size > 0) continue;
			if (!candidate || session.lastActivityAtMs < candidate.lastActivityAtMs) candidate = session;
		}
		if (candidate) candidate.evictionClaimed = true;
		return candidate;
	}
	removeViewer(session, connId) {
		if (!session.viewers.delete(connId)) return false;
		this.unindexByConn(connId, session.id);
		if (session.viewers.size === 0) session.output.resetOwnership();
		else session.output.reconcileRecipients();
		return true;
	}
	interactiveSession(connId, sessionId) {
		const session = this.sessions.get(sessionId);
		if (!session || session.closed) return;
		if (session.owner?.kind === "conn") return session.owner.connId === connId ? session : void 0;
		return session.owner?.kind === "agent" && session.viewers.has(connId) ? session : void 0;
	}
	/** Agents may operate only PTYs created by their exact trusted session key. */
	agentOwnedSession(agentSessionKey, sessionId, agentId) {
		const session = this.sessions.get(sessionId);
		if (!session || session.closed || session.owner?.kind !== "agent" || !terminalOwnerMatches(session.owner, agentSessionKey, agentId)) return;
		return session;
	}
	sessionConnIds(session) {
		const connIds = new Set(session.viewers);
		if (session.owner?.kind === "conn") connIds.add(session.owner.connId);
		return [...connIds];
	}
	finalize(session, reason, detail, opts) {
		if (session.closed) return;
		const recipients = this.sessionConnIds(session);
		session.output.dispose({ flush: !opts?.silent && recipients.length > 0 });
		session.closed = true;
		if (session.reaper) {
			clearTimeout(session.reaper);
			session.reaper = null;
		}
		this.sessions.delete(session.id);
		if (session.owner?.kind === "conn") this.unindexByConn(session.owner.connId, session.id);
		for (const viewerConnId of session.viewers) this.unindexByConn(viewerConnId, session.id);
		session.viewers.clear();
		try {
			session.backend.kill();
		} catch {}
		if (!opts?.silent) for (const connId of recipients) this.emit(connId, TERMINAL_EVENT_EXIT, {
			sessionId: session.id,
			exitCode: detail.exitCode ?? null,
			signal: detail.signal ?? null,
			reason,
			...detail.error ? { error: detail.error } : {}
		});
	}
};
//#endregion
export { DEFAULT_TERMINAL_DETACH_SECONDS, TerminalSessionManager };
