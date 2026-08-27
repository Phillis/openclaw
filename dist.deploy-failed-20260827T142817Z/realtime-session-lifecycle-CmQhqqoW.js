//#region src/talk/realtime-session-lifecycle.ts
const REALTIME_VOICE_MAX_PENDING_AUDIO_CHUNKS = 320;
const REALTIME_VOICE_MAX_PENDING_AUDIO_BYTES = 1024 * 1024;
function createRealtimeVoiceAudioQueue(overflowPolicy) {
	let chunks = [];
	let bytes = 0;
	const clear = () => {
		chunks = [];
		bytes = 0;
	};
	return {
		clear,
		dequeue: () => {
			const chunk = chunks.shift();
			if (chunk) bytes -= chunk.byteLength;
			return chunk;
		},
		drain: () => {
			const drained = chunks;
			clear();
			return drained;
		},
		enqueue: (audio) => {
			if (audio.byteLength > REALTIME_VOICE_MAX_PENDING_AUDIO_BYTES) return false;
			if (overflowPolicy === "reject-newest" && (chunks.length >= REALTIME_VOICE_MAX_PENDING_AUDIO_CHUNKS || bytes + audio.byteLength > REALTIME_VOICE_MAX_PENDING_AUDIO_BYTES)) return false;
			while (chunks.length >= REALTIME_VOICE_MAX_PENDING_AUDIO_CHUNKS || bytes + audio.byteLength > REALTIME_VOICE_MAX_PENDING_AUDIO_BYTES) {
				const dropped = chunks.shift();
				if (!dropped) return false;
				bytes -= dropped.byteLength;
			}
			const chunk = Buffer.from(audio);
			chunks.push(chunk);
			bytes += chunk.byteLength;
			return true;
		}
	};
}
var RealtimeVoiceSessionLifecycle = class {
	constructor(label) {
		this.label = label;
		this.state = { phase: "idle" };
		this.pendingAudio = createRealtimeVoiceAudioQueue("reject-newest");
	}
	connect(start) {
		if (this.isReady()) return Promise.resolve();
		if (this.connectPromise) return this.connectPromise;
		const promise = start(this.createFreshConnection());
		this.connectPromise = promise;
		const clear = () => {
			if (this.connectPromise === promise) this.connectPromise = void 0;
		};
		promise.then(clear, clear);
		return promise;
	}
	reconnect(connection) {
		const state = this.currentState(connection);
		if (!state || state.phase !== "retry-wait" || state.terminalOutcome) return;
		const nextConnection = this.createConnection(state.controller);
		state.connection = nextConnection;
		state.phase = "connecting";
		return nextConnection;
	}
	ready(connection) {
		const state = this.currentState(connection);
		if (!state || state.phase !== "connecting" || state.terminalOutcome) return false;
		state.phase = "ready";
		state.retryAttempts = 0;
		return true;
	}
	retry(connection, maxAttempts) {
		const state = this.currentState(connection);
		if (!state || state.phase === "retry-wait" || state.terminalOutcome) return;
		if (state.retryAttempts >= maxAttempts) return "exhausted";
		state.retryAttempts += 1;
		state.phase = "retry-wait";
		return {
			attempt: state.retryAttempts,
			signal: state.controller.signal
		};
	}
	createConnectAttempt(options) {
		let settled = false;
		let ready = false;
		let startupFailed = false;
		let resolvePromise;
		let rejectPromise;
		const promise = new Promise((resolve, reject) => {
			resolvePromise = resolve;
			rejectPromise = reject;
		});
		let removeAbortListener = () => {};
		let timeout;
		const cleanup = () => {
			if (timeout) clearTimeout(timeout);
			removeAbortListener();
		};
		const resolve = (providerReady = false) => {
			if (settled) return;
			settled = true;
			ready = providerReady;
			cleanup();
			resolvePromise();
		};
		const reject = (error) => {
			if (settled) return;
			settled = true;
			cleanup();
			rejectPromise(error);
		};
		const rejectStartup = (error) => {
			if (settled || !this.acceptsEvents(options.connection) || ready) return false;
			startupFailed = true;
			reject(error);
			return true;
		};
		const startTimeout = () => {
			if (settled || timeout) return;
			timeout = setTimeout(() => {
				if (this.isCurrent(options.connection) && !ready && this.terminalOutcome(options.connection) !== "completed") {
					startupFailed = true;
					options.onTimeout();
					reject(options.timeoutError());
				}
			}, options.timeoutMs);
		};
		const onAbort = () => {
			const outcome = this.terminalOutcome(options.connection);
			options.onAbort(outcome);
			if (outcome === "completed") {
				resolve();
				return;
			}
			const reason = options.connection.signal.reason;
			reject(reason instanceof Error ? reason : new Error(String(reason)));
		};
		options.connection.signal.addEventListener("abort", onAbort, { once: true });
		removeAbortListener = () => options.connection.signal.removeEventListener("abort", onAbort);
		if (options.connection.signal.aborted) onAbort();
		return {
			promise,
			get ready() {
				return ready;
			},
			get settled() {
				return settled;
			},
			get startupFailed() {
				return startupFailed;
			},
			reject,
			rejectStartup,
			resolve,
			startTimeout
		};
	}
	cancel() {
		const state = this.state;
		if (state.phase === "terminal") return false;
		this.connectPromise = void 0;
		this.pendingAudio.clear();
		if (!("controller" in state)) {
			this.state = {
				phase: "terminal",
				terminalOutcome: "completed"
			};
			return true;
		}
		state.phase = "terminal";
		state.terminalOutcome = "completed";
		state.controller.abort(/* @__PURE__ */ new Error(`${this.label} realtime voice session canceled`));
		return true;
	}
	failure(connection) {
		const state = this.currentState(connection);
		if (!state || state.terminalOutcome) return false;
		this.pendingAudio.clear();
		state.phase = "terminal";
		state.terminalOutcome = "error";
		state.controller.abort(/* @__PURE__ */ new Error(`${this.label} realtime voice session failed`));
		return true;
	}
	close(connection, outcome) {
		const state = this.currentState(connection);
		if (!state) return;
		this.pendingAudio.clear();
		if (!state.terminalOutcome) {
			state.phase = "terminal";
			state.terminalOutcome = outcome;
			state.controller.abort(/* @__PURE__ */ new Error(`${this.label} realtime voice session closed`));
		}
		if (state.terminalNotified) return;
		state.terminalNotified = true;
		return state.terminalOutcome;
	}
	currentConnection() {
		return "connection" in this.state ? this.state.connection : void 0;
	}
	isCurrent(connection) {
		return this.currentState(connection) !== void 0;
	}
	acceptsEvents(connection) {
		const phase = this.currentState(connection)?.phase;
		return phase === "connecting" || phase === "ready";
	}
	isReady() {
		return this.state.phase === "ready";
	}
	phase() {
		return this.state.phase;
	}
	terminalOutcome(connection) {
		return this.currentState(connection)?.terminalOutcome;
	}
	enqueuePendingAudio(audio) {
		return this.pendingAudio.enqueue(audio);
	}
	drainPendingAudio() {
		return this.pendingAudio.drain();
	}
	createFreshConnection() {
		if ("controller" in this.state) this.state.controller.abort(/* @__PURE__ */ new Error(`${this.label} realtime voice connection replaced`));
		const controller = new AbortController();
		const connection = this.createConnection(controller);
		this.state = {
			connection,
			controller,
			phase: "connecting",
			retryAttempts: 0,
			terminalNotified: false
		};
		return connection;
	}
	createConnection(controller) {
		return {
			id: Symbol(`${this.label.toLowerCase()}-realtime-voice-connection`),
			signal: controller.signal
		};
	}
	currentState(connection) {
		return "connection" in this.state && this.state.connection.id === connection.id ? this.state : void 0;
	}
};
//#endregion
export { createRealtimeVoiceAudioQueue as n, RealtimeVoiceSessionLifecycle as t };
