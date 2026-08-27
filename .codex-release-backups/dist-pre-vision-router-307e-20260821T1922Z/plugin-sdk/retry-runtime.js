import { a as resolveRetryConfig } from "../src-BQ327IOM.js";
import { n as isTransientNetworkError } from "../retryable-network-errors-CWL0k-Ls.js";
import { t as parseRetryAfterHeaderSeconds } from "../retry-after-CiglPIF1.js";
import { t as retryAsync } from "../retry-DIUON3ys.js";
import { n as createChannelApiRetryRunner, r as createRateLimitRetryRunner, t as CHANNEL_API_RETRY_DEFAULTS } from "../retry-policy-C4xi4B3U.js";
import { t as classifyTransientNetworkErrorCode } from "../retry-runtime-ELyDVNAC.js";
export { CHANNEL_API_RETRY_DEFAULTS as TELEGRAM_RETRY_DEFAULTS, classifyTransientNetworkErrorCode, createChannelApiRetryRunner, createChannelApiRetryRunner as createTelegramRetryRunner, createRateLimitRetryRunner, isTransientNetworkError, parseRetryAfterHeaderSeconds, resolveRetryConfig, retryAsync };
