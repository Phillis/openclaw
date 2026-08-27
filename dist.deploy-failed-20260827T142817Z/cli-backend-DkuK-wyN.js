import { n as CLI_RESUME_WATCHDOG_DEFAULTS, t as CLI_FRESH_WATCHDOG_DEFAULTS } from "./cli-watchdog-defaults-CzmnkdzO.js";
import { t as parseClaudeCliJsonlEvent } from "./cli-output-B7kBngJo.js";
import { a as CLAUDE_CLI_DEFAULT_MODEL_REF, c as CLAUDE_CLI_SESSION_ID_FIELDS, n as CLAUDE_CLI_BACKEND_ID, o as CLAUDE_CLI_MODEL_ALIASES } from "./cli-constants-BoJ2vZl0.js";
import { a as resolveClaudeCliAutoCompactEnv, i as normalizeClaudeBackendConfig, o as resolveClaudeCliExecutionArgs, t as CLAUDE_CLI_CLEAR_ENV } from "./cli-shared-d7iVyJUW.js";
import { createHmac, randomBytes } from "node:crypto";
//#region extensions/anthropic/cli-backend.ts
/**
* Claude CLI backend descriptor. It configures Claude Code process arguments,
* MCP bundling, session handling, credential transport, and watchdog defaults.
*/
const CLAUDE_CLI_CREDENTIAL_FINGERPRINT_KEY = randomBytes(32);
function createClaudeCliAuthInput(params) {
	const trimmed = params.value.trim();
	if (!trimmed) return;
	const source = Buffer.from(trimmed, "utf8");
	let destroyed = false;
	return {
		env: { [params.envName]: "3" },
		clearEnv: [...CLAUDE_CLI_CLEAR_ENV],
		secretInput: {
			fd: 3,
			fingerprint: createHmac("sha256", CLAUDE_CLI_CREDENTIAL_FINGERPRINT_KEY).update(source).digest("hex"),
			createData: () => {
				if (destroyed) throw new Error("Claude CLI credential input is no longer available");
				return Buffer.from(source);
			}
		},
		cleanup: async () => {
			destroyed = true;
			source.fill(0);
		}
	};
}
function resolveClaudeCliAuthInput(credential) {
	if (credential?.type === "oauth" && "access" in credential) {
		const expires = "expires" in credential ? credential.expires : void 0;
		if (typeof expires !== "number" || !Number.isFinite(expires) || expires <= Date.now()) throw new Error("Selected Claude CLI OAuth credential is expired or invalid. Re-authenticate the selected profile and retry. OpenClaw did not start the run.");
		if (typeof credential.access !== "string") return;
		return createClaudeCliAuthInput({
			envName: "CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR",
			value: credential.access
		});
	}
	if (credential?.type === "token" && "token" in credential && typeof credential.token === "string") return createClaudeCliAuthInput({
		envName: "CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR",
		value: credential.token
	});
	if (credential?.type === "api_key" && "key" in credential && typeof credential.key === "string") return createClaudeCliAuthInput({
		envName: "CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR",
		value: credential.key
	});
}
/** Build the Claude CLI backend plugin descriptor. */
function buildAnthropicCliBackend() {
	return {
		id: CLAUDE_CLI_BACKEND_ID,
		modelProvider: "anthropic",
		liveTest: {
			defaultModelRef: CLAUDE_CLI_DEFAULT_MODEL_REF,
			defaultImageProbe: true,
			defaultMcpProbe: true,
			docker: {
				npmPackage: "@anthropic-ai/claude-code",
				binaryName: "claude"
			}
		},
		runtimeArtifact: {
			kind: "bundled-package-tree",
			packageName: "@anthropic-ai/claude-code",
			entrypoint: "command",
			nativeExecutableNames: ["claude", "claude.exe"]
		},
		liveSessionRequirement: {
			capability: "msg_lifecycle_v1",
			minimumVersion: "2.1.206",
			versionArgs: ["--version"],
			updateCommand: "claude update"
		},
		bundleMcp: true,
		bundleMcpMode: "claude-config-file",
		nativeToolMode: "selectable",
		toolAvailabilityEnforcement: "execution-args",
		sideQuestionToolMode: "disabled",
		ownsNativeCompaction: true,
		manualCompaction: {
			buildPrompt: (customInstructions) => {
				const instructions = customInstructions?.trim();
				return instructions ? `/compact ${instructions}` : "/compact";
			},
			input: "arg",
			validateOutput: (rawOutput) => {
				for (const line of rawOutput.split("\n")) try {
					const event = JSON.parse(line);
					if (event.compact_result === "success" || event.type === "system" && event.subtype === "compact_boundary") return { ok: true };
				} catch {}
				return {
					ok: false,
					reason: "Claude CLI did not confirm that native compaction ran."
				};
			}
		},
		subscriptionAuthDispatch: true,
		config: {
			command: "claude",
			args: [
				"-p",
				"--output-format",
				"stream-json",
				"--include-partial-messages",
				"--verbose",
				"--setting-sources",
				"user",
				"--allowedTools",
				"mcp__openclaw__*",
				"--disallowedTools",
				"ScheduleWakeup,CronCreate,Bash(run_in_background:true),Monitor"
			],
			resumeArgs: [
				"-p",
				"--output-format",
				"stream-json",
				"--include-partial-messages",
				"--verbose",
				"--setting-sources",
				"user",
				"--allowedTools",
				"mcp__openclaw__*",
				"--disallowedTools",
				"ScheduleWakeup,CronCreate,Bash(run_in_background:true),Monitor",
				"--resume",
				"{sessionId}"
			],
			forkArg: "--fork-session",
			resumeAtArg: "--resume-session-at",
			output: "jsonl",
			liveSession: "claude-stdio",
			input: "stdin",
			modelArg: "--model",
			modelAliases: CLAUDE_CLI_MODEL_ALIASES,
			imageArg: "@",
			imagePathScope: "workspace",
			sessionArgs: ["--session-id", "{sessionId}"],
			sessionMode: "always",
			reseedFromRawTranscriptWhenUncompacted: true,
			sessionIdFields: [...CLAUDE_CLI_SESSION_ID_FIELDS],
			systemPromptFileArg: "--append-system-prompt-file",
			systemPromptMode: "append",
			systemPromptWhen: "always",
			clearEnv: [...CLAUDE_CLI_CLEAR_ENV],
			reliability: { watchdog: {
				fresh: { ...CLI_FRESH_WATCHDOG_DEFAULTS },
				resume: { ...CLI_RESUME_WATCHDOG_DEFAULTS }
			} },
			serialize: true
		},
		normalizeConfig: normalizeClaudeBackendConfig,
		authEpochMode: "profile-only",
		prepareExecution: (context) => {
			const credentialContext = context;
			const authInput = resolveClaudeCliAuthInput(credentialContext.authCredential);
			const isolatedCompletion = credentialContext.isolatedCompletionPrompt !== void 0;
			const env = {
				...resolveClaudeCliAutoCompactEnv(context.contextTokenBudget),
				...authInput?.env
			};
			return Object.keys(env).length > 0 || isolatedCompletion ? {
				env,
				...isolatedCompletion ? { isolatedCompletionEnforced: true } : {},
				...authInput?.clearEnv ? { clearEnv: authInput.clearEnv } : {},
				...authInput?.secretInput ? { secretInput: authInput.secretInput } : {},
				...authInput?.cleanup ? { cleanup: authInput.cleanup } : {}
			} : void 0;
		},
		parseJsonlEvent: parseClaudeCliJsonlEvent,
		resolveExecutionArgs: resolveClaudeCliExecutionArgs
	};
}
//#endregion
export { buildAnthropicCliBackend as t };
