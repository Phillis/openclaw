import { a as resolveRetryConfig } from "../src-BQ327IOM.js";
import { n as isTransientNetworkError } from "../retryable-network-errors-y3dAO9Jq.js";
import { t as parseRetryAfterHeaderSeconds } from "../retry-after-CiglPIF1.js";
import { t as retryAsync } from "../retry-DIUON3ys.js";
import { n as createChannelApiRetryRunner, r as createRateLimitRetryRunner, t as CHANNEL_API_RETRY_DEFAULTS } from "../retry-policy-D9ZaAo4y.js";
import { t as classifyTransientNetworkErrorCode } from "../retry-runtime-Bk755-nu.js";
export { CHANNEL_API_RETRY_DEFAULTS as TELEGRAM_RETRY_DEFAULTS, classifyTransientNetworkErrorCode, createChannelApiRetryRunner, createChannelApiRetryRunner as createTelegramRetryRunner, createRateLimitRetryRunner, isTransientNetworkError, parseRetryAfterHeaderSeconds, resolveRetryConfig, retryAsync };
