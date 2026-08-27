//#region packages/acp-core/src/runtime/types.d.ts
type AcpRuntimePromptMode = "prompt" | "steer";
type AcpRuntimeSessionMode = "persistent" | "oneshot";
/** Runtime update tags emitted by ACP adapters; unknown backend tags are passed through. */
type AcpSessionUpdateTag = "agent_message_chunk" | "agent_thought_chunk" | "tool_call" | "tool_call_update" | "usage_update" | "available_commands_update" | "current_mode_update" | "config_option_update" | "session_info_update" | "plan" | (string & {});
type AcpRuntimeControl = "session/set_mode" | "session/set_config_option" | "session/status";
/** Stable handle returned by ensureSession and passed back into all ACP runtime operations. */
type AcpRuntimeHandle = {
  sessionKey: string;
  backend: string;
  runtimeSessionName: string;
  /** Effective runtime working directory for this ACP session, if exposed by adapter/runtime. */
  cwd?: string;
  /** Backend-local record identifier, if exposed by adapter/runtime (for example acpx record id). */
  acpxRecordId?: string;
  /** Backend-level ACP session identifier, if exposed by adapter/runtime. */
  backendSessionId?: string;
  /** Upstream harness session identifier, if exposed by adapter/runtime. */
  agentSessionId?: string;
  /**
   * Effective model the backend applied during session creation, when it can differ from the
   * requested model. A backend that drops an unsupported inherited default reports `dropped` so
   * the manager omits that model from persisted runtime controls instead of replaying a rejected
   * model before the first turn. Absent when the backend did not deviate from the request.
   */
  appliedModel?: {
    kind: "applied";
    model: string;
  } | {
    kind: "dropped";
  };
};
type AcpRuntimeEnsureInput = {
  sessionKey: string;
  agent: string;
  mode: AcpRuntimeSessionMode;
  /** Backend or agent session id to resume when reopening an existing conversation. */
  resumeSessionId?: string;
  /** Optional runtime model override that must be available during session creation. */
  model?: string;
  /**
   * Whether `model` was an explicit caller selection rather than an inherited default. A backend
   * that cannot honor an explicit unsupported model must fail closed; an unsupported inherited
   * default may be dropped so the backend starts on its own default.
   */
  modelExplicit?: boolean;
  /** Optional runtime thinking/reasoning override that must be available during session creation. */
  thinking?: string;
  cwd?: string;
  env?: Record<string, string>;
};
type AcpRuntimeTurnAttachment = {
  mediaType: string;
  data: string;
};
type AcpJsonRpcId = string | number | null;
type AcpElicitationMeta = Record<string, unknown> | null;
/** Structural ACP wire boundary; the harness-owned compiler validates concrete modes and schemas. */
type AcpElicitationRequest = {
  mode: string;
  message: string;
  [key: string]: unknown;
};
type AcpElicitationContentValue = string | number | boolean | string[];
type AcpElicitationResponse = {
  action: "accept";
  content?: Record<string, AcpElicitationContentValue> | null;
  _meta?: AcpElicitationMeta;
} | {
  action: "decline";
  _meta?: AcpElicitationMeta;
} | {
  action: "cancel";
  _meta?: AcpElicitationMeta;
};
type AcpElicitationContext = {
  requestId: AcpJsonRpcId;
  signal: AbortSignal;
};
type AcpElicitationHandler = (request: AcpElicitationRequest, context: AcpElicitationContext) => Promise<AcpElicitationResponse>;
/** Per-turn payload delivered to ACP adapters. */
type AcpRuntimeTurnInput = {
  handle: AcpRuntimeHandle;
  text: string;
  attachments?: AcpRuntimeTurnAttachment[];
  mode: AcpRuntimePromptMode;
  requestId: string;
  signal?: AbortSignal;
  /** Handles provider-neutral user input requests owned by this exact turn. */
  onElicitation?: AcpElicitationHandler;
};
type AcpRuntimeCapabilities = {
  controls: AcpRuntimeControl[];
  /**
   * Optional backend-advertised option keys for session/set_config_option.
   * Empty/undefined means "backend accepts keys, but did not advertise a strict list".
   */
  configOptionKeys?: string[];
};
type AcpRuntimeStatus = {
  summary?: string;
  /** Backend-local record identifier, if exposed by adapter/runtime. */
  acpxRecordId?: string;
  /** Backend-level ACP session identifier, if known at status time. */
  backendSessionId?: string;
  /** Upstream harness session identifier, if known at status time. */
  agentSessionId?: string;
  details?: Record<string, unknown>;
};
type AcpRuntimeDoctorReport = {
  ok: boolean;
  code?: string;
  message: string;
  installCommand?: string;
  details?: string[];
};
/** Streaming event union produced by ACP adapters while a turn is running. */
type AcpRuntimeEvent = {
  type: "text_delta";
  text: string;
  stream?: "output" | "thought";
  tag?: AcpSessionUpdateTag;
} | {
  type: "status";
  text: string;
  tag?: AcpSessionUpdateTag;
  used?: number;
  size?: number;
} | {
  type: "tool_call";
  text: string;
  tag?: AcpSessionUpdateTag;
  toolCallId?: string;
  status?: string;
  title?: string;
  kind?: "read" | "edit" | "delete" | "move" | "search" | "execute" | "fetch" | "switch_mode" | "think" | "other";
} | {
  type: "done";
  /** Closed result status when the manager synthesizes the terminal event. */
  status?: "completed" | "cancelled";
  stopReason?: string;
} | {
  type: "error";
  message: string;
  code?: string;
  detailCode?: string;
  retryable?: boolean;
};
type AcpRuntimeTurnResultError = {
  message: string;
  code?: string;
  detailCode?: string;
  retryable?: boolean;
};
/** Terminal turn result, separated from the live event stream for reliable failure handling. */
type AcpRuntimeTurnResult = {
  status: "completed";
  stopReason?: string;
} | {
  status: "cancelled";
  stopReason?: string;
} | {
  status: "failed";
  error: AcpRuntimeTurnResultError;
};
interface AcpRuntimeTurn {
  readonly requestId: string;
  /** Resolves when the backend has submitted this prompt; older third-party runtimes may omit it. */
  readonly promptStarted?: Promise<void>;
  readonly events: AsyncIterable<AcpRuntimeEvent>;
  readonly result: Promise<AcpRuntimeTurnResult>;
  /** Requests backend cancellation while keeping result/error reporting adapter-owned. */
  cancel(input?: {
    reason?: string;
  }): Promise<void>;
  /** Closes the event stream when the caller stops listening before terminal result. */
  closeStream(input?: {
    reason?: string;
  }): Promise<void>;
}
/** ACP adapter contract implemented by backend plugins and consumed by gateway/session flows. */
interface AcpRuntime {
  ensureSession(input: AcpRuntimeEnsureInput): Promise<AcpRuntimeHandle>;
  /**
   * Preferred turn API. Live events are streamed separately from the terminal
   * result so adapters can report failures without relying on legacy done/error
   * events in the stream.
   */
  startTurn?(input: AcpRuntimeTurnInput): AcpRuntimeTurn;
  runTurn(input: AcpRuntimeTurnInput): AsyncIterable<AcpRuntimeEvent>;
  getCapabilities?(input: {
    handle?: AcpRuntimeHandle;
  }): Promise<AcpRuntimeCapabilities> | AcpRuntimeCapabilities;
  getStatus?(input: {
    handle: AcpRuntimeHandle;
    signal?: AbortSignal;
  }): Promise<AcpRuntimeStatus>;
  setMode?(input: {
    handle: AcpRuntimeHandle;
    mode: string;
  }): Promise<void>;
  setConfigOption?(input: {
    handle: AcpRuntimeHandle;
    key: string;
    value: string;
  }): Promise<void>;
  doctor?(): Promise<AcpRuntimeDoctorReport>;
  /**
   * Prepare the next ensureSession for this session key to start fresh instead
   * of reopening backend-owned persistent state.
   */
  prepareFreshSession?(input: {
    sessionKey: string;
  }): Promise<void>;
  cancel(input: {
    handle: AcpRuntimeHandle;
    reason?: string;
  }): Promise<void>;
  close(input: {
    handle: AcpRuntimeHandle;
    reason: string;
    /**
     * Discard backend-owned persistent session state so the next ensureSession
     * starts fresh instead of reopening the same conversation.
     */
    discardPersistentState?: boolean;
  }): Promise<void>;
}
//#endregion
export { AcpSessionUpdateTag as C, AcpRuntimeTurnResultError as S, AcpRuntimeStatus as _, AcpElicitationRequest as a, AcpRuntimeTurnInput as b, AcpRuntime as c, AcpRuntimeDoctorReport as d, AcpRuntimeEnsureInput as f, AcpRuntimeSessionMode as g, AcpRuntimePromptMode as h, AcpElicitationMeta as i, AcpRuntimeCapabilities as l, AcpRuntimeHandle as m, AcpElicitationContext as n, AcpElicitationResponse as o, AcpRuntimeEvent as p, AcpElicitationHandler as r, AcpJsonRpcId as s, AcpElicitationContentValue as t, AcpRuntimeControl as u, AcpRuntimeTurn as v, AcpRuntimeTurnResult as x, AcpRuntimeTurnAttachment as y };