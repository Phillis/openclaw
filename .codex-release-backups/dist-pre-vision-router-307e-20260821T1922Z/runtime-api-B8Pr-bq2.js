import { a as __require, n as __esmMin, o as __toCommonJS, r as __exportAll, s as __toESM, t as __commonJSMin } from "./rolldown-runtime-DE1ahGrs.js";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { c as asFiniteNumberInRange, s as asFiniteNumber } from "./number-coercion-oCkfUEEq.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { c as redactSensitiveText } from "./redact-Cl7lwBnl.js";
import { t as collectErrorGraphCandidates } from "./errors-CSNUPl5U.js";
import { c as registerUnhandledRejectionHandler } from "./unhandled-rejections-ELdqUxS7.js";
import { A as isValidDiagnosticTraceFlags, j as isValidDiagnosticTraceId, k as isValidDiagnosticSpanId } from "./diagnostic-events-Djn4AVRp.js";
import { n as createNodeProxyAgent } from "./node-proxy-agent-CK7jQCLo.js";
import "./error-runtime-CmlvK1A3.js";
import "./runtime-env-COkbgBI4.js";
import "./fetch-runtime-CGFA9obr.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./text-utility-runtime-LRU688AB.js";
import { n as normalizeDiagnosticValue, t as normalizeDiagnosticLane } from "./diagnostic-runtime-D8PDaSTa.js";
import { C as ROOT_CONTEXT, c as metrics, d as context, h as SpanKind, i as trace, l as diag, n as init_esm$2, o as propagation, p as SpanStatusCode, t as esm_exports$2, v as isSpanContextValid, w as createContextKey, x as createNoopMeter, y as TraceFlags } from "./esm-CvWNL7AL.js";
import "./api-CI44dJ2S.js";
import { readFileSync } from "node:fs";
import path from "node:path";
import * as zlib from "zlib";
import { Readable } from "stream";
import * as fs$1 from "fs";
import * as path$1 from "path";
//#region node_modules/@opentelemetry/core/build/src/trace/suppress-tracing.js
var require_suppress_tracing = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isTracingSuppressed = exports.unsuppressTracing = exports.suppressTracing = void 0;
	const SUPPRESS_TRACING_KEY = (0, (init_esm$2(), __toCommonJS(esm_exports$2)).createContextKey)("OpenTelemetry SDK Context Key SUPPRESS_TRACING");
	function suppressTracing(context) {
		return context.setValue(SUPPRESS_TRACING_KEY, true);
	}
	exports.suppressTracing = suppressTracing;
	function unsuppressTracing(context) {
		return context.deleteValue(SUPPRESS_TRACING_KEY);
	}
	exports.unsuppressTracing = unsuppressTracing;
	function isTracingSuppressed(context) {
		return context.getValue(SUPPRESS_TRACING_KEY) === true;
	}
	exports.isTracingSuppressed = isTracingSuppressed;
}));
//#endregion
//#region node_modules/@opentelemetry/core/build/src/baggage/constants.js
var require_constants$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.BAGGAGE_MAX_TOTAL_LENGTH = exports.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS = exports.BAGGAGE_MAX_NAME_VALUE_PAIRS = exports.BAGGAGE_HEADER = exports.BAGGAGE_ITEMS_SEPARATOR = exports.BAGGAGE_PROPERTIES_SEPARATOR = exports.BAGGAGE_KEY_PAIR_SEPARATOR = void 0;
	exports.BAGGAGE_KEY_PAIR_SEPARATOR = "=";
	exports.BAGGAGE_PROPERTIES_SEPARATOR = ";";
	exports.BAGGAGE_ITEMS_SEPARATOR = ",";
	exports.BAGGAGE_HEADER = "baggage";
	exports.BAGGAGE_MAX_NAME_VALUE_PAIRS = 180;
	exports.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS = 4096;
	exports.BAGGAGE_MAX_TOTAL_LENGTH = 8192;
}));
//#endregion
//#region node_modules/@opentelemetry/core/build/src/baggage/utils.js
var require_utils$6 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.parseKeyPairsIntoRecord = exports.parseBaggageHeaderString = exports.parsePairKeyValue = exports.getKeyPairs = exports.serializeKeyPairs = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const constants_1 = require_constants$1();
	function serializeKeyPairs(keyPairs) {
		return keyPairs.reduce((hValue, current) => {
			const value = `${hValue}${hValue !== "" ? constants_1.BAGGAGE_ITEMS_SEPARATOR : ""}${current}`;
			return value.length > constants_1.BAGGAGE_MAX_TOTAL_LENGTH ? hValue : value;
		}, "");
	}
	exports.serializeKeyPairs = serializeKeyPairs;
	function getKeyPairs(baggage) {
		return baggage.getAllEntries().map(([key, value]) => {
			let entry = `${encodeURIComponent(key)}=${encodeURIComponent(value.value)}`;
			if (value.metadata !== void 0) entry += constants_1.BAGGAGE_PROPERTIES_SEPARATOR + value.metadata.toString();
			return entry;
		});
	}
	exports.getKeyPairs = getKeyPairs;
	function parsePairKeyValue(entry) {
		if (!entry) return;
		const metadataSeparatorIndex = entry.indexOf(constants_1.BAGGAGE_PROPERTIES_SEPARATOR);
		const keyPairPart = metadataSeparatorIndex === -1 ? entry : entry.substring(0, metadataSeparatorIndex);
		const separatorIndex = keyPairPart.indexOf(constants_1.BAGGAGE_KEY_PAIR_SEPARATOR);
		if (separatorIndex <= 0) return;
		const rawKey = keyPairPart.substring(0, separatorIndex).trim();
		const rawValue = keyPairPart.substring(separatorIndex + 1).trim();
		if (!rawKey || !rawValue) return;
		let key;
		let value;
		try {
			key = decodeURIComponent(rawKey);
			value = decodeURIComponent(rawValue);
		} catch {
			return;
		}
		let metadata;
		if (metadataSeparatorIndex !== -1 && metadataSeparatorIndex < entry.length - 1) {
			const metadataString = entry.substring(metadataSeparatorIndex + 1);
			metadata = (0, api_1.baggageEntryMetadataFromString)(metadataString);
		}
		return {
			key,
			value,
			metadata
		};
	}
	exports.parsePairKeyValue = parsePairKeyValue;
	/**
	* Parses a single baggage header string into the provided record, applying limits defined in this package.
	* Uses indexOf/substring in a while loop to avoid allocating a full array of split entries.
	* Returns the updated pair count so callers can track totals across multiple header values.
	*/
	function parseBaggageHeaderString(value, baggage, count, totalSize) {
		let start = 0;
		while (start < value.length && count < constants_1.BAGGAGE_MAX_NAME_VALUE_PAIRS) {
			const end = value.indexOf(constants_1.BAGGAGE_ITEMS_SEPARATOR, start);
			const entryEnd = end === -1 ? value.length : end;
			const entryLength = entryEnd - start;
			if (entryLength <= constants_1.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS) {
				const keyPair = parsePairKeyValue(value.substring(start, entryEnd));
				if (keyPair) {
					const entrySize = (count === 0 ? 0 : 1) + entryLength;
					if (totalSize + entrySize > constants_1.BAGGAGE_MAX_TOTAL_LENGTH) break;
					baggage[keyPair.key] = keyPair.metadata ? {
						value: keyPair.value,
						metadata: keyPair.metadata
					} : { value: keyPair.value };
					count++;
					totalSize += entrySize;
				}
			}
			if (end === -1) break;
			start = end + 1;
		}
		return [count, totalSize];
	}
	exports.parseBaggageHeaderString = parseBaggageHeaderString;
	/**
	* Parse a string serialized in the baggage HTTP Format (without metadata):
	* https://github.com/w3c/baggage/blob/master/baggage/HTTP_HEADER_FORMAT.md
	*/
	function parseKeyPairsIntoRecord(value) {
		const result = {};
		if (typeof value === "string" && value.length > 0) value.split(constants_1.BAGGAGE_ITEMS_SEPARATOR).forEach((entry) => {
			const keyPair = parsePairKeyValue(entry);
			if (keyPair !== void 0 && keyPair.value.length > 0) result[keyPair.key] = keyPair.value;
		});
		return result;
	}
	exports.parseKeyPairsIntoRecord = parseKeyPairsIntoRecord;
}));
//#endregion
//#region node_modules/@opentelemetry/core/build/src/baggage/propagation/W3CBaggagePropagator.js
var require_W3CBaggagePropagator = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.W3CBaggagePropagator = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const suppress_tracing_1 = require_suppress_tracing();
	const constants_1 = require_constants$1();
	const utils_1 = require_utils$6();
	/**
	* Propagates {@link Baggage} through Context format propagation.
	*
	* Based on the Baggage specification:
	* https://w3c.github.io/baggage/
	*/
	var W3CBaggagePropagator = class {
		inject(context, carrier, setter) {
			const baggage = api_1.propagation.getBaggage(context);
			if (!baggage || (0, suppress_tracing_1.isTracingSuppressed)(context)) return;
			const keyPairs = (0, utils_1.getKeyPairs)(baggage).filter((pair) => {
				return pair.length <= constants_1.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS;
			}).slice(0, constants_1.BAGGAGE_MAX_NAME_VALUE_PAIRS);
			const headerValue = (0, utils_1.serializeKeyPairs)(keyPairs);
			if (headerValue.length > 0) setter.set(carrier, constants_1.BAGGAGE_HEADER, headerValue);
		}
		extract(context, carrier, getter) {
			const headerValue = getter.get(carrier, constants_1.BAGGAGE_HEADER);
			if (!headerValue) return context;
			const baggage = {};
			let count = 0;
			let totalSize = 0;
			if (Array.isArray(headerValue)) for (let i = 0; i < headerValue.length; i++) [count, totalSize] = (0, utils_1.parseBaggageHeaderString)(headerValue[i], baggage, count, totalSize);
			else [count] = (0, utils_1.parseBaggageHeaderString)(headerValue, baggage, count, totalSize);
			if (count === 0) return context;
			return api_1.propagation.setBaggage(context, api_1.propagation.createBaggage(baggage));
		}
		fields() {
			return [constants_1.BAGGAGE_HEADER];
		}
	};
	exports.W3CBaggagePropagator = W3CBaggagePropagator;
}));
//#endregion
//#region node_modules/@opentelemetry/core/build/src/common/anchored-clock.js
var require_anchored_clock = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AnchoredClock = void 0;
	/**
	* A utility for returning wall times anchored to a given point in time. Wall time measurements will
	* not be taken from the system, but instead are computed by adding a monotonic clock time
	* to the anchor point.
	*
	* This is needed because the system time can change and result in unexpected situations like
	* spans ending before they are started. Creating an anchored clock for each local root span
	* ensures that span timings and durations are accurate while preventing span times from drifting
	* too far from the system clock.
	*
	* Only creating an anchored clock once per local trace ensures span times are correct relative
	* to each other. For example, a child span will never have a start time before its parent even
	* if the system clock is corrected during the local trace.
	*
	* Heavily inspired by the OTel Java anchored clock
	* https://github.com/open-telemetry/opentelemetry-java/blob/main/sdk/trace/src/main/java/io/opentelemetry/sdk/trace/AnchoredClock.java
	*/
	var AnchoredClock = class {
		_monotonicClock;
		_epochMillis;
		_performanceMillis;
		/**
		* Create a new AnchoredClock anchored to the current time returned by systemClock.
		*
		* @param systemClock should be a clock that returns the number of milliseconds since January 1 1970 such as Date
		* @param monotonicClock should be a clock that counts milliseconds monotonically such as window.performance or perf_hooks.performance
		*/
		constructor(systemClock, monotonicClock) {
			this._monotonicClock = monotonicClock;
			this._epochMillis = systemClock.now();
			this._performanceMillis = monotonicClock.now();
		}
		/**
		* Returns the current time by adding the number of milliseconds since the
		* AnchoredClock was created to the creation epoch time
		*/
		now() {
			const delta = this._monotonicClock.now() - this._performanceMillis;
			return this._epochMillis + delta;
		}
	};
	exports.AnchoredClock = AnchoredClock;
}));
//#endregion
//#region node_modules/@opentelemetry/core/build/src/common/attributes.js
var require_attributes = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isAttributeValue = exports.isAttributeKey = exports.sanitizeAttributes = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	function sanitizeAttributes(attributes) {
		const out = {};
		if (typeof attributes !== "object" || attributes == null) return out;
		for (const key in attributes) {
			if (!Object.prototype.hasOwnProperty.call(attributes, key)) continue;
			if (!isAttributeKey(key)) {
				api_1.diag.warn(`Invalid attribute key: ${key}`);
				continue;
			}
			const val = attributes[key];
			if (!isAttributeValue(val)) {
				api_1.diag.warn(`Invalid attribute value set for key: ${key}`);
				continue;
			}
			if (Array.isArray(val)) out[key] = val.slice();
			else out[key] = val;
		}
		return out;
	}
	exports.sanitizeAttributes = sanitizeAttributes;
	function isAttributeKey(key) {
		return typeof key === "string" && key !== "";
	}
	exports.isAttributeKey = isAttributeKey;
	function isAttributeValue(val) {
		if (val == null) return true;
		if (Array.isArray(val)) return isHomogeneousAttributeValueArray(val);
		return isValidPrimitiveAttributeValueType(typeof val);
	}
	exports.isAttributeValue = isAttributeValue;
	function isHomogeneousAttributeValueArray(arr) {
		let type;
		for (const element of arr) {
			if (element == null) continue;
			const elementType = typeof element;
			if (elementType === type) continue;
			if (!type) {
				if (isValidPrimitiveAttributeValueType(elementType)) {
					type = elementType;
					continue;
				}
				return false;
			}
			return false;
		}
		return true;
	}
	function isValidPrimitiveAttributeValueType(valType) {
		switch (valType) {
			case "number":
			case "boolean":
			case "string": return true;
		}
		return false;
	}
}));
//#endregion
//#region node_modules/@opentelemetry/core/build/src/common/logging-error-handler.js
var require_logging_error_handler = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.loggingErrorHandler = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	/**
	* Returns a function that logs an error using the provided logger, or a
	* console logger if one was not provided.
	*/
	function loggingErrorHandler() {
		return (ex) => {
			api_1.diag.error(stringifyException(ex));
		};
	}
	exports.loggingErrorHandler = loggingErrorHandler;
	/**
	* Converts an exception into a string representation
	* @param {Exception} ex
	*/
	function stringifyException(ex) {
		if (typeof ex === "string") return ex;
		else return JSON.stringify(flattenException(ex));
	}
	/**
	* Flattens an exception into key-value pairs by traversing the prototype chain
	* and coercing values to strings. Duplicate properties will not be overwritten;
	* the first insert wins.
	*/
	function flattenException(ex) {
		const result = {};
		let current = ex;
		while (current !== null) {
			Object.getOwnPropertyNames(current).forEach((propertyName) => {
				if (result[propertyName]) return;
				const value = current[propertyName];
				if (value) result[propertyName] = String(value);
			});
			current = Object.getPrototypeOf(current);
		}
		return result;
	}
}));
//#endregion
//#region node_modules/@opentelemetry/core/build/src/common/global-error-handler.js
var require_global_error_handler = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.globalErrorHandler = exports.setGlobalErrorHandler = void 0;
	/** The global error handler delegate */
	let delegateHandler = (0, require_logging_error_handler().loggingErrorHandler)();
	/**
	* Set the global error handler
	* @param {ErrorHandler} handler
	*/
	function setGlobalErrorHandler(handler) {
		delegateHandler = handler;
	}
	exports.setGlobalErrorHandler = setGlobalErrorHandler;
	/**
	* Return the global error handler
	* @param {Exception} ex
	*/
	function globalErrorHandler(ex) {
		try {
			delegateHandler(ex);
		} catch {}
	}
	exports.globalErrorHandler = globalErrorHandler;
}));
//#endregion
//#region node_modules/@opentelemetry/core/build/src/platform/node/environment.js
var require_environment = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getStringListFromEnv = exports.getBooleanFromEnv = exports.getStringFromEnv = exports.getNumberFromEnv = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const util_1 = __require("util");
	/**
	* Retrieves a number from an environment variable.
	* - Returns `undefined` if the environment variable is empty, unset, contains only whitespace, or is not a number.
	* - Returns a number in all other cases.
	*
	* @param {string} key - The name of the environment variable to retrieve.
	* @returns {number | undefined} - The number value or `undefined`.
	*/
	function getNumberFromEnv(key) {
		const raw = process.env[key];
		if (raw == null || raw.trim() === "") return;
		const value = Number(raw);
		if (isNaN(value)) {
			api_1.diag.warn(`Unknown value ${(0, util_1.inspect)(raw)} for ${key}, expected a number, using defaults`);
			return;
		}
		return value;
	}
	exports.getNumberFromEnv = getNumberFromEnv;
	/**
	* Retrieves a string from an environment variable.
	* - Returns `undefined` if the environment variable is empty, unset, or contains only whitespace.
	*
	* @param {string} key - The name of the environment variable to retrieve.
	* @returns {string | undefined} - The string value or `undefined`.
	*/
	function getStringFromEnv(key) {
		const raw = process.env[key];
		if (raw == null || raw.trim() === "") return;
		return raw;
	}
	exports.getStringFromEnv = getStringFromEnv;
	/**
	* Retrieves a boolean value from an environment variable.
	* - Trims leading and trailing whitespace and ignores casing.
	* - Returns `false` if the environment variable is empty, unset, or contains only whitespace.
	* - Returns `false` for strings that cannot be mapped to a boolean.
	*
	* @param {string} key - The name of the environment variable to retrieve.
	* @returns {boolean} - The boolean value or `false` if the environment variable is unset empty, unset, or contains only whitespace.
	*/
	function getBooleanFromEnv(key) {
		const raw = process.env[key]?.trim().toLowerCase();
		if (raw == null || raw === "") return false;
		if (raw === "true") return true;
		else if (raw === "false") return false;
		else {
			api_1.diag.warn(`Unknown value ${(0, util_1.inspect)(raw)} for ${key}, expected 'true' or 'false', falling back to 'false' (default)`);
			return false;
		}
	}
	exports.getBooleanFromEnv = getBooleanFromEnv;
	/**
	* Retrieves a list of strings from an environment variable.
	* - Uses ',' as the delimiter.
	* - Trims leading and trailing whitespace from each entry.
	* - Excludes empty entries.
	* - Returns `undefined` if the environment variable is empty or contains only whitespace.
	* - Returns an empty array if all entries are empty or whitespace.
	*
	* @param {string} key - The name of the environment variable to retrieve.
	* @returns {string[] | undefined} - The list of strings or `undefined`.
	*/
	function getStringListFromEnv(key) {
		return getStringFromEnv(key)?.split(",").map((v) => v.trim()).filter((s) => s !== "");
	}
	exports.getStringListFromEnv = getStringListFromEnv;
}));
//#endregion
//#region node_modules/@opentelemetry/core/build/src/common/globalThis.js
var require_globalThis = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports._globalThis = void 0;
	/**
	* @deprecated Use globalThis directly instead.
	*/
	exports._globalThis = globalThis;
}));
//#endregion
//#region node_modules/@opentelemetry/core/build/src/version.js
var require_version$3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.VERSION = void 0;
	exports.VERSION = "2.10.0";
}));
//#endregion
//#region node_modules/@opentelemetry/semantic-conventions/build/esm/internal/utils.js
/**
* Creates a const map from the given values
* @param values - An array of values to be used as keys and values in the map.
* @returns A populated version of the map with the values and keys derived from the values.
*/
/*#__NO_SIDE_EFFECTS__*/
function createConstMap(values) {
	let res = {};
	const len = values.length;
	for (let lp = 0; lp < len; lp++) {
		const val = values[lp];
		if (val) res[String(val).toUpperCase().replace(/[-.]/g, "_")] = val;
	}
	return res;
}
var init_utils = __esmMin((() => {})), TMP_AWS_LAMBDA_INVOKED_ARN, TMP_DB_SYSTEM, TMP_DB_CONNECTION_STRING, TMP_DB_USER, TMP_DB_JDBC_DRIVER_CLASSNAME, TMP_DB_NAME, TMP_DB_STATEMENT, TMP_DB_OPERATION, TMP_DB_MSSQL_INSTANCE_NAME, TMP_DB_CASSANDRA_KEYSPACE, TMP_DB_CASSANDRA_PAGE_SIZE, TMP_DB_CASSANDRA_CONSISTENCY_LEVEL, TMP_DB_CASSANDRA_TABLE, TMP_DB_CASSANDRA_IDEMPOTENCE, TMP_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT, TMP_DB_CASSANDRA_COORDINATOR_ID, TMP_DB_CASSANDRA_COORDINATOR_DC, TMP_DB_HBASE_NAMESPACE, TMP_DB_REDIS_DATABASE_INDEX, TMP_DB_MONGODB_COLLECTION, TMP_DB_SQL_TABLE, TMP_EXCEPTION_TYPE, TMP_EXCEPTION_MESSAGE, TMP_EXCEPTION_STACKTRACE, TMP_EXCEPTION_ESCAPED, TMP_FAAS_TRIGGER, TMP_FAAS_EXECUTION, TMP_FAAS_DOCUMENT_COLLECTION, TMP_FAAS_DOCUMENT_OPERATION, TMP_FAAS_DOCUMENT_TIME, TMP_FAAS_DOCUMENT_NAME, TMP_FAAS_TIME, TMP_FAAS_CRON, TMP_FAAS_COLDSTART, TMP_FAAS_INVOKED_NAME, TMP_FAAS_INVOKED_PROVIDER, TMP_FAAS_INVOKED_REGION, TMP_NET_TRANSPORT, TMP_NET_PEER_IP, TMP_NET_PEER_PORT, TMP_NET_PEER_NAME, TMP_NET_HOST_IP, TMP_NET_HOST_PORT, TMP_NET_HOST_NAME, TMP_NET_HOST_CONNECTION_TYPE, TMP_NET_HOST_CONNECTION_SUBTYPE, TMP_NET_HOST_CARRIER_NAME, TMP_NET_HOST_CARRIER_MCC, TMP_NET_HOST_CARRIER_MNC, TMP_NET_HOST_CARRIER_ICC, TMP_PEER_SERVICE, TMP_ENDUSER_ID, TMP_ENDUSER_ROLE, TMP_ENDUSER_SCOPE, TMP_THREAD_ID, TMP_THREAD_NAME, TMP_CODE_FUNCTION, TMP_CODE_NAMESPACE, TMP_CODE_FILEPATH, TMP_CODE_LINENO, TMP_HTTP_METHOD, TMP_HTTP_URL, TMP_HTTP_TARGET, TMP_HTTP_HOST, TMP_HTTP_SCHEME, TMP_HTTP_STATUS_CODE, TMP_HTTP_FLAVOR, TMP_HTTP_USER_AGENT, TMP_HTTP_REQUEST_CONTENT_LENGTH, TMP_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED, TMP_HTTP_RESPONSE_CONTENT_LENGTH, TMP_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED, TMP_HTTP_SERVER_NAME, TMP_HTTP_ROUTE, TMP_HTTP_CLIENT_IP, TMP_AWS_DYNAMODB_TABLE_NAMES, TMP_AWS_DYNAMODB_CONSUMED_CAPACITY, TMP_AWS_DYNAMODB_ITEM_COLLECTION_METRICS, TMP_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY, TMP_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY, TMP_AWS_DYNAMODB_CONSISTENT_READ, TMP_AWS_DYNAMODB_PROJECTION, TMP_AWS_DYNAMODB_LIMIT, TMP_AWS_DYNAMODB_ATTRIBUTES_TO_GET, TMP_AWS_DYNAMODB_INDEX_NAME, TMP_AWS_DYNAMODB_SELECT, TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES, TMP_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES, TMP_AWS_DYNAMODB_EXCLUSIVE_START_TABLE, TMP_AWS_DYNAMODB_TABLE_COUNT, TMP_AWS_DYNAMODB_SCAN_FORWARD, TMP_AWS_DYNAMODB_SEGMENT, TMP_AWS_DYNAMODB_TOTAL_SEGMENTS, TMP_AWS_DYNAMODB_COUNT, TMP_AWS_DYNAMODB_SCANNED_COUNT, TMP_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS, TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES, TMP_MESSAGING_SYSTEM, TMP_MESSAGING_DESTINATION, TMP_MESSAGING_DESTINATION_KIND, TMP_MESSAGING_TEMP_DESTINATION, TMP_MESSAGING_PROTOCOL, TMP_MESSAGING_PROTOCOL_VERSION, TMP_MESSAGING_URL, TMP_MESSAGING_MESSAGE_ID, TMP_MESSAGING_CONVERSATION_ID, TMP_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES, TMP_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES, TMP_MESSAGING_OPERATION, TMP_MESSAGING_CONSUMER_ID, TMP_MESSAGING_RABBITMQ_ROUTING_KEY, TMP_MESSAGING_KAFKA_MESSAGE_KEY, TMP_MESSAGING_KAFKA_CONSUMER_GROUP, TMP_MESSAGING_KAFKA_CLIENT_ID, TMP_MESSAGING_KAFKA_PARTITION, TMP_MESSAGING_KAFKA_TOMBSTONE, TMP_RPC_SYSTEM, TMP_RPC_SERVICE, TMP_RPC_METHOD, TMP_RPC_GRPC_STATUS_CODE, TMP_RPC_JSONRPC_VERSION, TMP_RPC_JSONRPC_REQUEST_ID, TMP_RPC_JSONRPC_ERROR_CODE, TMP_RPC_JSONRPC_ERROR_MESSAGE, TMP_MESSAGE_TYPE, TMP_MESSAGE_ID, TMP_MESSAGE_COMPRESSED_SIZE, TMP_MESSAGE_UNCOMPRESSED_SIZE, SEMATTRS_AWS_LAMBDA_INVOKED_ARN, SEMATTRS_DB_SYSTEM, SEMATTRS_DB_CONNECTION_STRING, SEMATTRS_DB_USER, SEMATTRS_DB_JDBC_DRIVER_CLASSNAME, SEMATTRS_DB_NAME, SEMATTRS_DB_STATEMENT, SEMATTRS_DB_OPERATION, SEMATTRS_DB_MSSQL_INSTANCE_NAME, SEMATTRS_DB_CASSANDRA_KEYSPACE, SEMATTRS_DB_CASSANDRA_PAGE_SIZE, SEMATTRS_DB_CASSANDRA_CONSISTENCY_LEVEL, SEMATTRS_DB_CASSANDRA_TABLE, SEMATTRS_DB_CASSANDRA_IDEMPOTENCE, SEMATTRS_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT, SEMATTRS_DB_CASSANDRA_COORDINATOR_ID, SEMATTRS_DB_CASSANDRA_COORDINATOR_DC, SEMATTRS_DB_HBASE_NAMESPACE, SEMATTRS_DB_REDIS_DATABASE_INDEX, SEMATTRS_DB_MONGODB_COLLECTION, SEMATTRS_DB_SQL_TABLE, SEMATTRS_EXCEPTION_TYPE, SEMATTRS_EXCEPTION_MESSAGE, SEMATTRS_EXCEPTION_STACKTRACE, SEMATTRS_EXCEPTION_ESCAPED, SEMATTRS_FAAS_TRIGGER, SEMATTRS_FAAS_EXECUTION, SEMATTRS_FAAS_DOCUMENT_COLLECTION, SEMATTRS_FAAS_DOCUMENT_OPERATION, SEMATTRS_FAAS_DOCUMENT_TIME, SEMATTRS_FAAS_DOCUMENT_NAME, SEMATTRS_FAAS_TIME, SEMATTRS_FAAS_CRON, SEMATTRS_FAAS_COLDSTART, SEMATTRS_FAAS_INVOKED_NAME, SEMATTRS_FAAS_INVOKED_PROVIDER, SEMATTRS_FAAS_INVOKED_REGION, SEMATTRS_NET_TRANSPORT, SEMATTRS_NET_PEER_IP, SEMATTRS_NET_PEER_PORT, SEMATTRS_NET_PEER_NAME, SEMATTRS_NET_HOST_IP, SEMATTRS_NET_HOST_PORT, SEMATTRS_NET_HOST_NAME, SEMATTRS_NET_HOST_CONNECTION_TYPE, SEMATTRS_NET_HOST_CONNECTION_SUBTYPE, SEMATTRS_NET_HOST_CARRIER_NAME, SEMATTRS_NET_HOST_CARRIER_MCC, SEMATTRS_NET_HOST_CARRIER_MNC, SEMATTRS_NET_HOST_CARRIER_ICC, SEMATTRS_PEER_SERVICE, SEMATTRS_ENDUSER_ID, SEMATTRS_ENDUSER_ROLE, SEMATTRS_ENDUSER_SCOPE, SEMATTRS_THREAD_ID, SEMATTRS_THREAD_NAME, SEMATTRS_CODE_FUNCTION, SEMATTRS_CODE_NAMESPACE, SEMATTRS_CODE_FILEPATH, SEMATTRS_CODE_LINENO, SEMATTRS_HTTP_METHOD, SEMATTRS_HTTP_URL, SEMATTRS_HTTP_TARGET, SEMATTRS_HTTP_HOST, SEMATTRS_HTTP_SCHEME, SEMATTRS_HTTP_STATUS_CODE, SEMATTRS_HTTP_FLAVOR, SEMATTRS_HTTP_USER_AGENT, SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH, SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED, SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH, SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED, SEMATTRS_HTTP_SERVER_NAME, SEMATTRS_HTTP_ROUTE, SEMATTRS_HTTP_CLIENT_IP, SEMATTRS_AWS_DYNAMODB_TABLE_NAMES, SEMATTRS_AWS_DYNAMODB_CONSUMED_CAPACITY, SEMATTRS_AWS_DYNAMODB_ITEM_COLLECTION_METRICS, SEMATTRS_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY, SEMATTRS_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY, SEMATTRS_AWS_DYNAMODB_CONSISTENT_READ, SEMATTRS_AWS_DYNAMODB_PROJECTION, SEMATTRS_AWS_DYNAMODB_LIMIT, SEMATTRS_AWS_DYNAMODB_ATTRIBUTES_TO_GET, SEMATTRS_AWS_DYNAMODB_INDEX_NAME, SEMATTRS_AWS_DYNAMODB_SELECT, SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES, SEMATTRS_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES, SEMATTRS_AWS_DYNAMODB_EXCLUSIVE_START_TABLE, SEMATTRS_AWS_DYNAMODB_TABLE_COUNT, SEMATTRS_AWS_DYNAMODB_SCAN_FORWARD, SEMATTRS_AWS_DYNAMODB_SEGMENT, SEMATTRS_AWS_DYNAMODB_TOTAL_SEGMENTS, SEMATTRS_AWS_DYNAMODB_COUNT, SEMATTRS_AWS_DYNAMODB_SCANNED_COUNT, SEMATTRS_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS, SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES, SEMATTRS_MESSAGING_SYSTEM, SEMATTRS_MESSAGING_DESTINATION, SEMATTRS_MESSAGING_DESTINATION_KIND, SEMATTRS_MESSAGING_TEMP_DESTINATION, SEMATTRS_MESSAGING_PROTOCOL, SEMATTRS_MESSAGING_PROTOCOL_VERSION, SEMATTRS_MESSAGING_URL, SEMATTRS_MESSAGING_MESSAGE_ID, SEMATTRS_MESSAGING_CONVERSATION_ID, SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES, SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES, SEMATTRS_MESSAGING_OPERATION, SEMATTRS_MESSAGING_CONSUMER_ID, SEMATTRS_MESSAGING_RABBITMQ_ROUTING_KEY, SEMATTRS_MESSAGING_KAFKA_MESSAGE_KEY, SEMATTRS_MESSAGING_KAFKA_CONSUMER_GROUP, SEMATTRS_MESSAGING_KAFKA_CLIENT_ID, SEMATTRS_MESSAGING_KAFKA_PARTITION, SEMATTRS_MESSAGING_KAFKA_TOMBSTONE, SEMATTRS_RPC_SYSTEM, SEMATTRS_RPC_SERVICE, SEMATTRS_RPC_METHOD, SEMATTRS_RPC_GRPC_STATUS_CODE, SEMATTRS_RPC_JSONRPC_VERSION, SEMATTRS_RPC_JSONRPC_REQUEST_ID, SEMATTRS_RPC_JSONRPC_ERROR_CODE, SEMATTRS_RPC_JSONRPC_ERROR_MESSAGE, SEMATTRS_MESSAGE_TYPE, SEMATTRS_MESSAGE_ID, SEMATTRS_MESSAGE_COMPRESSED_SIZE, SEMATTRS_MESSAGE_UNCOMPRESSED_SIZE, SemanticAttributes, TMP_DBSYSTEMVALUES_OTHER_SQL, TMP_DBSYSTEMVALUES_MSSQL, TMP_DBSYSTEMVALUES_MYSQL, TMP_DBSYSTEMVALUES_ORACLE, TMP_DBSYSTEMVALUES_DB2, TMP_DBSYSTEMVALUES_POSTGRESQL, TMP_DBSYSTEMVALUES_REDSHIFT, TMP_DBSYSTEMVALUES_HIVE, TMP_DBSYSTEMVALUES_CLOUDSCAPE, TMP_DBSYSTEMVALUES_HSQLDB, TMP_DBSYSTEMVALUES_PROGRESS, TMP_DBSYSTEMVALUES_MAXDB, TMP_DBSYSTEMVALUES_HANADB, TMP_DBSYSTEMVALUES_INGRES, TMP_DBSYSTEMVALUES_FIRSTSQL, TMP_DBSYSTEMVALUES_EDB, TMP_DBSYSTEMVALUES_CACHE, TMP_DBSYSTEMVALUES_ADABAS, TMP_DBSYSTEMVALUES_FIREBIRD, TMP_DBSYSTEMVALUES_DERBY, TMP_DBSYSTEMVALUES_FILEMAKER, TMP_DBSYSTEMVALUES_INFORMIX, TMP_DBSYSTEMVALUES_INSTANTDB, TMP_DBSYSTEMVALUES_INTERBASE, TMP_DBSYSTEMVALUES_MARIADB, TMP_DBSYSTEMVALUES_NETEZZA, TMP_DBSYSTEMVALUES_PERVASIVE, TMP_DBSYSTEMVALUES_POINTBASE, TMP_DBSYSTEMVALUES_SQLITE, TMP_DBSYSTEMVALUES_SYBASE, TMP_DBSYSTEMVALUES_TERADATA, TMP_DBSYSTEMVALUES_VERTICA, TMP_DBSYSTEMVALUES_H2, TMP_DBSYSTEMVALUES_COLDFUSION, TMP_DBSYSTEMVALUES_CASSANDRA, TMP_DBSYSTEMVALUES_HBASE, TMP_DBSYSTEMVALUES_MONGODB, TMP_DBSYSTEMVALUES_REDIS, TMP_DBSYSTEMVALUES_COUCHBASE, TMP_DBSYSTEMVALUES_COUCHDB, TMP_DBSYSTEMVALUES_COSMOSDB, TMP_DBSYSTEMVALUES_DYNAMODB, TMP_DBSYSTEMVALUES_NEO4J, TMP_DBSYSTEMVALUES_GEODE, TMP_DBSYSTEMVALUES_ELASTICSEARCH, TMP_DBSYSTEMVALUES_MEMCACHED, TMP_DBSYSTEMVALUES_COCKROACHDB, DBSYSTEMVALUES_OTHER_SQL, DBSYSTEMVALUES_MSSQL, DBSYSTEMVALUES_MYSQL, DBSYSTEMVALUES_ORACLE, DBSYSTEMVALUES_POSTGRESQL, DBSYSTEMVALUES_REDSHIFT, DBSYSTEMVALUES_HIVE, DBSYSTEMVALUES_CLOUDSCAPE, DBSYSTEMVALUES_HSQLDB, DBSYSTEMVALUES_PROGRESS, DBSYSTEMVALUES_MAXDB, DBSYSTEMVALUES_HANADB, DBSYSTEMVALUES_INGRES, DBSYSTEMVALUES_FIRSTSQL, DBSYSTEMVALUES_CACHE, DBSYSTEMVALUES_ADABAS, DBSYSTEMVALUES_FIREBIRD, DBSYSTEMVALUES_DERBY, DBSYSTEMVALUES_FILEMAKER, DBSYSTEMVALUES_INFORMIX, DBSYSTEMVALUES_INSTANTDB, DBSYSTEMVALUES_INTERBASE, DBSYSTEMVALUES_MARIADB, DBSYSTEMVALUES_NETEZZA, DBSYSTEMVALUES_PERVASIVE, DBSYSTEMVALUES_POINTBASE, DBSYSTEMVALUES_SQLITE, DBSYSTEMVALUES_SYBASE, DBSYSTEMVALUES_TERADATA, DBSYSTEMVALUES_VERTICA, DBSYSTEMVALUES_COLDFUSION, DBSYSTEMVALUES_CASSANDRA, DBSYSTEMVALUES_HBASE, DBSYSTEMVALUES_MONGODB, DBSYSTEMVALUES_REDIS, DBSYSTEMVALUES_COUCHBASE, DBSYSTEMVALUES_COUCHDB, DBSYSTEMVALUES_COSMOSDB, DBSYSTEMVALUES_DYNAMODB, DBSYSTEMVALUES_NEO4J, DBSYSTEMVALUES_GEODE, DBSYSTEMVALUES_ELASTICSEARCH, DBSYSTEMVALUES_MEMCACHED, DBSYSTEMVALUES_COCKROACHDB, DbSystemValues, TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ALL, TMP_DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM, TMP_DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM, TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM, TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ONE, TMP_DBCASSANDRACONSISTENCYLEVELVALUES_TWO, TMP_DBCASSANDRACONSISTENCYLEVELVALUES_THREE, TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE, TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ANY, TMP_DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL, TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL, DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM, DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM, DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM, DBCASSANDRACONSISTENCYLEVELVALUES_THREE, DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE, DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL, DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL, DbCassandraConsistencyLevelValues, TMP_FAASTRIGGERVALUES_DATASOURCE, TMP_FAASTRIGGERVALUES_HTTP, TMP_FAASTRIGGERVALUES_PUBSUB, TMP_FAASTRIGGERVALUES_TIMER, TMP_FAASTRIGGERVALUES_OTHER, FAASTRIGGERVALUES_DATASOURCE, FAASTRIGGERVALUES_HTTP, FAASTRIGGERVALUES_PUBSUB, FAASTRIGGERVALUES_TIMER, FAASTRIGGERVALUES_OTHER, FaasTriggerValues, TMP_FAASDOCUMENTOPERATIONVALUES_INSERT, TMP_FAASDOCUMENTOPERATIONVALUES_EDIT, TMP_FAASDOCUMENTOPERATIONVALUES_DELETE, FAASDOCUMENTOPERATIONVALUES_INSERT, FAASDOCUMENTOPERATIONVALUES_EDIT, FAASDOCUMENTOPERATIONVALUES_DELETE, FaasDocumentOperationValues, TMP_FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD, TMP_FAASINVOKEDPROVIDERVALUES_AWS, TMP_FAASINVOKEDPROVIDERVALUES_AZURE, TMP_FAASINVOKEDPROVIDERVALUES_GCP, FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD, FAASINVOKEDPROVIDERVALUES_AZURE, FaasInvokedProviderValues, TMP_NETTRANSPORTVALUES_IP_TCP, TMP_NETTRANSPORTVALUES_IP_UDP, TMP_NETTRANSPORTVALUES_IP, TMP_NETTRANSPORTVALUES_UNIX, TMP_NETTRANSPORTVALUES_PIPE, TMP_NETTRANSPORTVALUES_INPROC, TMP_NETTRANSPORTVALUES_OTHER, NETTRANSPORTVALUES_IP_TCP, NETTRANSPORTVALUES_IP_UDP, NETTRANSPORTVALUES_UNIX, NETTRANSPORTVALUES_PIPE, NETTRANSPORTVALUES_INPROC, NETTRANSPORTVALUES_OTHER, NetTransportValues, TMP_NETHOSTCONNECTIONTYPEVALUES_WIFI, TMP_NETHOSTCONNECTIONTYPEVALUES_WIRED, TMP_NETHOSTCONNECTIONTYPEVALUES_CELL, TMP_NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE, TMP_NETHOSTCONNECTIONTYPEVALUES_UNKNOWN, NETHOSTCONNECTIONTYPEVALUES_WIFI, NETHOSTCONNECTIONTYPEVALUES_WIRED, NETHOSTCONNECTIONTYPEVALUES_CELL, NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE, NETHOSTCONNECTIONTYPEVALUES_UNKNOWN, NetHostConnectionTypeValues, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GPRS, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EDGE, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_UMTS, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPA, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IDEN, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GSM, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NR, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA, NETHOSTCONNECTIONSUBTYPEVALUES_GPRS, NETHOSTCONNECTIONSUBTYPEVALUES_EDGE, NETHOSTCONNECTIONSUBTYPEVALUES_UMTS, NETHOSTCONNECTIONSUBTYPEVALUES_CDMA, NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0, NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A, NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT, NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA, NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA, NETHOSTCONNECTIONSUBTYPEVALUES_HSPA, NETHOSTCONNECTIONSUBTYPEVALUES_IDEN, NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B, NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD, NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP, NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA, NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN, NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA, NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA, NetHostConnectionSubtypeValues, TMP_HTTPFLAVORVALUES_HTTP_1_0, TMP_HTTPFLAVORVALUES_HTTP_1_1, TMP_HTTPFLAVORVALUES_HTTP_2_0, TMP_HTTPFLAVORVALUES_SPDY, TMP_HTTPFLAVORVALUES_QUIC, HTTPFLAVORVALUES_SPDY, HTTPFLAVORVALUES_QUIC, HttpFlavorValues, TMP_MESSAGINGDESTINATIONKINDVALUES_QUEUE, TMP_MESSAGINGDESTINATIONKINDVALUES_TOPIC, MESSAGINGDESTINATIONKINDVALUES_QUEUE, MESSAGINGDESTINATIONKINDVALUES_TOPIC, MessagingDestinationKindValues, TMP_MESSAGINGOPERATIONVALUES_RECEIVE, TMP_MESSAGINGOPERATIONVALUES_PROCESS, MESSAGINGOPERATIONVALUES_RECEIVE, MESSAGINGOPERATIONVALUES_PROCESS, MessagingOperationValues, TMP_RPCGRPCSTATUSCODEVALUES_OK, TMP_RPCGRPCSTATUSCODEVALUES_CANCELLED, TMP_RPCGRPCSTATUSCODEVALUES_UNKNOWN, TMP_RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT, TMP_RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED, TMP_RPCGRPCSTATUSCODEVALUES_NOT_FOUND, TMP_RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS, TMP_RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED, TMP_RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED, TMP_RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION, TMP_RPCGRPCSTATUSCODEVALUES_ABORTED, TMP_RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE, TMP_RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED, TMP_RPCGRPCSTATUSCODEVALUES_INTERNAL, TMP_RPCGRPCSTATUSCODEVALUES_UNAVAILABLE, TMP_RPCGRPCSTATUSCODEVALUES_DATA_LOSS, TMP_RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED, RpcGrpcStatusCodeValues, TMP_MESSAGETYPEVALUES_SENT, TMP_MESSAGETYPEVALUES_RECEIVED, MESSAGETYPEVALUES_SENT, MESSAGETYPEVALUES_RECEIVED, MessageTypeValues;
var init_SemanticAttributes = __esmMin((() => {
	init_utils();
	TMP_AWS_LAMBDA_INVOKED_ARN = "aws.lambda.invoked_arn";
	TMP_DB_SYSTEM = "db.system";
	TMP_DB_CONNECTION_STRING = "db.connection_string";
	TMP_DB_USER = "db.user";
	TMP_DB_JDBC_DRIVER_CLASSNAME = "db.jdbc.driver_classname";
	TMP_DB_NAME = "db.name";
	TMP_DB_STATEMENT = "db.statement";
	TMP_DB_OPERATION = "db.operation";
	TMP_DB_MSSQL_INSTANCE_NAME = "db.mssql.instance_name";
	TMP_DB_CASSANDRA_KEYSPACE = "db.cassandra.keyspace";
	TMP_DB_CASSANDRA_PAGE_SIZE = "db.cassandra.page_size";
	TMP_DB_CASSANDRA_CONSISTENCY_LEVEL = "db.cassandra.consistency_level";
	TMP_DB_CASSANDRA_TABLE = "db.cassandra.table";
	TMP_DB_CASSANDRA_IDEMPOTENCE = "db.cassandra.idempotence";
	TMP_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT = "db.cassandra.speculative_execution_count";
	TMP_DB_CASSANDRA_COORDINATOR_ID = "db.cassandra.coordinator.id";
	TMP_DB_CASSANDRA_COORDINATOR_DC = "db.cassandra.coordinator.dc";
	TMP_DB_HBASE_NAMESPACE = "db.hbase.namespace";
	TMP_DB_REDIS_DATABASE_INDEX = "db.redis.database_index";
	TMP_DB_MONGODB_COLLECTION = "db.mongodb.collection";
	TMP_DB_SQL_TABLE = "db.sql.table";
	TMP_EXCEPTION_TYPE = "exception.type";
	TMP_EXCEPTION_MESSAGE = "exception.message";
	TMP_EXCEPTION_STACKTRACE = "exception.stacktrace";
	TMP_EXCEPTION_ESCAPED = "exception.escaped";
	TMP_FAAS_TRIGGER = "faas.trigger";
	TMP_FAAS_EXECUTION = "faas.execution";
	TMP_FAAS_DOCUMENT_COLLECTION = "faas.document.collection";
	TMP_FAAS_DOCUMENT_OPERATION = "faas.document.operation";
	TMP_FAAS_DOCUMENT_TIME = "faas.document.time";
	TMP_FAAS_DOCUMENT_NAME = "faas.document.name";
	TMP_FAAS_TIME = "faas.time";
	TMP_FAAS_CRON = "faas.cron";
	TMP_FAAS_COLDSTART = "faas.coldstart";
	TMP_FAAS_INVOKED_NAME = "faas.invoked_name";
	TMP_FAAS_INVOKED_PROVIDER = "faas.invoked_provider";
	TMP_FAAS_INVOKED_REGION = "faas.invoked_region";
	TMP_NET_TRANSPORT = "net.transport";
	TMP_NET_PEER_IP = "net.peer.ip";
	TMP_NET_PEER_PORT = "net.peer.port";
	TMP_NET_PEER_NAME = "net.peer.name";
	TMP_NET_HOST_IP = "net.host.ip";
	TMP_NET_HOST_PORT = "net.host.port";
	TMP_NET_HOST_NAME = "net.host.name";
	TMP_NET_HOST_CONNECTION_TYPE = "net.host.connection.type";
	TMP_NET_HOST_CONNECTION_SUBTYPE = "net.host.connection.subtype";
	TMP_NET_HOST_CARRIER_NAME = "net.host.carrier.name";
	TMP_NET_HOST_CARRIER_MCC = "net.host.carrier.mcc";
	TMP_NET_HOST_CARRIER_MNC = "net.host.carrier.mnc";
	TMP_NET_HOST_CARRIER_ICC = "net.host.carrier.icc";
	TMP_PEER_SERVICE = "peer.service";
	TMP_ENDUSER_ID = "enduser.id";
	TMP_ENDUSER_ROLE = "enduser.role";
	TMP_ENDUSER_SCOPE = "enduser.scope";
	TMP_THREAD_ID = "thread.id";
	TMP_THREAD_NAME = "thread.name";
	TMP_CODE_FUNCTION = "code.function";
	TMP_CODE_NAMESPACE = "code.namespace";
	TMP_CODE_FILEPATH = "code.filepath";
	TMP_CODE_LINENO = "code.lineno";
	TMP_HTTP_METHOD = "http.method";
	TMP_HTTP_URL = "http.url";
	TMP_HTTP_TARGET = "http.target";
	TMP_HTTP_HOST = "http.host";
	TMP_HTTP_SCHEME = "http.scheme";
	TMP_HTTP_STATUS_CODE = "http.status_code";
	TMP_HTTP_FLAVOR = "http.flavor";
	TMP_HTTP_USER_AGENT = "http.user_agent";
	TMP_HTTP_REQUEST_CONTENT_LENGTH = "http.request_content_length";
	TMP_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED = "http.request_content_length_uncompressed";
	TMP_HTTP_RESPONSE_CONTENT_LENGTH = "http.response_content_length";
	TMP_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED = "http.response_content_length_uncompressed";
	TMP_HTTP_SERVER_NAME = "http.server_name";
	TMP_HTTP_ROUTE = "http.route";
	TMP_HTTP_CLIENT_IP = "http.client_ip";
	TMP_AWS_DYNAMODB_TABLE_NAMES = "aws.dynamodb.table_names";
	TMP_AWS_DYNAMODB_CONSUMED_CAPACITY = "aws.dynamodb.consumed_capacity";
	TMP_AWS_DYNAMODB_ITEM_COLLECTION_METRICS = "aws.dynamodb.item_collection_metrics";
	TMP_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY = "aws.dynamodb.provisioned_read_capacity";
	TMP_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY = "aws.dynamodb.provisioned_write_capacity";
	TMP_AWS_DYNAMODB_CONSISTENT_READ = "aws.dynamodb.consistent_read";
	TMP_AWS_DYNAMODB_PROJECTION = "aws.dynamodb.projection";
	TMP_AWS_DYNAMODB_LIMIT = "aws.dynamodb.limit";
	TMP_AWS_DYNAMODB_ATTRIBUTES_TO_GET = "aws.dynamodb.attributes_to_get";
	TMP_AWS_DYNAMODB_INDEX_NAME = "aws.dynamodb.index_name";
	TMP_AWS_DYNAMODB_SELECT = "aws.dynamodb.select";
	TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES = "aws.dynamodb.global_secondary_indexes";
	TMP_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES = "aws.dynamodb.local_secondary_indexes";
	TMP_AWS_DYNAMODB_EXCLUSIVE_START_TABLE = "aws.dynamodb.exclusive_start_table";
	TMP_AWS_DYNAMODB_TABLE_COUNT = "aws.dynamodb.table_count";
	TMP_AWS_DYNAMODB_SCAN_FORWARD = "aws.dynamodb.scan_forward";
	TMP_AWS_DYNAMODB_SEGMENT = "aws.dynamodb.segment";
	TMP_AWS_DYNAMODB_TOTAL_SEGMENTS = "aws.dynamodb.total_segments";
	TMP_AWS_DYNAMODB_COUNT = "aws.dynamodb.count";
	TMP_AWS_DYNAMODB_SCANNED_COUNT = "aws.dynamodb.scanned_count";
	TMP_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS = "aws.dynamodb.attribute_definitions";
	TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES = "aws.dynamodb.global_secondary_index_updates";
	TMP_MESSAGING_SYSTEM = "messaging.system";
	TMP_MESSAGING_DESTINATION = "messaging.destination";
	TMP_MESSAGING_DESTINATION_KIND = "messaging.destination_kind";
	TMP_MESSAGING_TEMP_DESTINATION = "messaging.temp_destination";
	TMP_MESSAGING_PROTOCOL = "messaging.protocol";
	TMP_MESSAGING_PROTOCOL_VERSION = "messaging.protocol_version";
	TMP_MESSAGING_URL = "messaging.url";
	TMP_MESSAGING_MESSAGE_ID = "messaging.message_id";
	TMP_MESSAGING_CONVERSATION_ID = "messaging.conversation_id";
	TMP_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES = "messaging.message_payload_size_bytes";
	TMP_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES = "messaging.message_payload_compressed_size_bytes";
	TMP_MESSAGING_OPERATION = "messaging.operation";
	TMP_MESSAGING_CONSUMER_ID = "messaging.consumer_id";
	TMP_MESSAGING_RABBITMQ_ROUTING_KEY = "messaging.rabbitmq.routing_key";
	TMP_MESSAGING_KAFKA_MESSAGE_KEY = "messaging.kafka.message_key";
	TMP_MESSAGING_KAFKA_CONSUMER_GROUP = "messaging.kafka.consumer_group";
	TMP_MESSAGING_KAFKA_CLIENT_ID = "messaging.kafka.client_id";
	TMP_MESSAGING_KAFKA_PARTITION = "messaging.kafka.partition";
	TMP_MESSAGING_KAFKA_TOMBSTONE = "messaging.kafka.tombstone";
	TMP_RPC_SYSTEM = "rpc.system";
	TMP_RPC_SERVICE = "rpc.service";
	TMP_RPC_METHOD = "rpc.method";
	TMP_RPC_GRPC_STATUS_CODE = "rpc.grpc.status_code";
	TMP_RPC_JSONRPC_VERSION = "rpc.jsonrpc.version";
	TMP_RPC_JSONRPC_REQUEST_ID = "rpc.jsonrpc.request_id";
	TMP_RPC_JSONRPC_ERROR_CODE = "rpc.jsonrpc.error_code";
	TMP_RPC_JSONRPC_ERROR_MESSAGE = "rpc.jsonrpc.error_message";
	TMP_MESSAGE_TYPE = "message.type";
	TMP_MESSAGE_ID = "message.id";
	TMP_MESSAGE_COMPRESSED_SIZE = "message.compressed_size";
	TMP_MESSAGE_UNCOMPRESSED_SIZE = "message.uncompressed_size";
	SEMATTRS_AWS_LAMBDA_INVOKED_ARN = TMP_AWS_LAMBDA_INVOKED_ARN;
	SEMATTRS_DB_SYSTEM = TMP_DB_SYSTEM;
	SEMATTRS_DB_CONNECTION_STRING = TMP_DB_CONNECTION_STRING;
	SEMATTRS_DB_USER = TMP_DB_USER;
	SEMATTRS_DB_JDBC_DRIVER_CLASSNAME = TMP_DB_JDBC_DRIVER_CLASSNAME;
	SEMATTRS_DB_NAME = TMP_DB_NAME;
	SEMATTRS_DB_STATEMENT = TMP_DB_STATEMENT;
	SEMATTRS_DB_OPERATION = TMP_DB_OPERATION;
	SEMATTRS_DB_MSSQL_INSTANCE_NAME = TMP_DB_MSSQL_INSTANCE_NAME;
	SEMATTRS_DB_CASSANDRA_KEYSPACE = TMP_DB_CASSANDRA_KEYSPACE;
	SEMATTRS_DB_CASSANDRA_PAGE_SIZE = TMP_DB_CASSANDRA_PAGE_SIZE;
	SEMATTRS_DB_CASSANDRA_CONSISTENCY_LEVEL = TMP_DB_CASSANDRA_CONSISTENCY_LEVEL;
	SEMATTRS_DB_CASSANDRA_TABLE = TMP_DB_CASSANDRA_TABLE;
	SEMATTRS_DB_CASSANDRA_IDEMPOTENCE = TMP_DB_CASSANDRA_IDEMPOTENCE;
	SEMATTRS_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT = TMP_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT;
	SEMATTRS_DB_CASSANDRA_COORDINATOR_ID = TMP_DB_CASSANDRA_COORDINATOR_ID;
	SEMATTRS_DB_CASSANDRA_COORDINATOR_DC = TMP_DB_CASSANDRA_COORDINATOR_DC;
	SEMATTRS_DB_HBASE_NAMESPACE = TMP_DB_HBASE_NAMESPACE;
	SEMATTRS_DB_REDIS_DATABASE_INDEX = TMP_DB_REDIS_DATABASE_INDEX;
	SEMATTRS_DB_MONGODB_COLLECTION = TMP_DB_MONGODB_COLLECTION;
	SEMATTRS_DB_SQL_TABLE = TMP_DB_SQL_TABLE;
	SEMATTRS_EXCEPTION_TYPE = TMP_EXCEPTION_TYPE;
	SEMATTRS_EXCEPTION_MESSAGE = TMP_EXCEPTION_MESSAGE;
	SEMATTRS_EXCEPTION_STACKTRACE = TMP_EXCEPTION_STACKTRACE;
	SEMATTRS_EXCEPTION_ESCAPED = TMP_EXCEPTION_ESCAPED;
	SEMATTRS_FAAS_TRIGGER = TMP_FAAS_TRIGGER;
	SEMATTRS_FAAS_EXECUTION = TMP_FAAS_EXECUTION;
	SEMATTRS_FAAS_DOCUMENT_COLLECTION = TMP_FAAS_DOCUMENT_COLLECTION;
	SEMATTRS_FAAS_DOCUMENT_OPERATION = TMP_FAAS_DOCUMENT_OPERATION;
	SEMATTRS_FAAS_DOCUMENT_TIME = TMP_FAAS_DOCUMENT_TIME;
	SEMATTRS_FAAS_DOCUMENT_NAME = TMP_FAAS_DOCUMENT_NAME;
	SEMATTRS_FAAS_TIME = TMP_FAAS_TIME;
	SEMATTRS_FAAS_CRON = TMP_FAAS_CRON;
	SEMATTRS_FAAS_COLDSTART = TMP_FAAS_COLDSTART;
	SEMATTRS_FAAS_INVOKED_NAME = TMP_FAAS_INVOKED_NAME;
	SEMATTRS_FAAS_INVOKED_PROVIDER = TMP_FAAS_INVOKED_PROVIDER;
	SEMATTRS_FAAS_INVOKED_REGION = TMP_FAAS_INVOKED_REGION;
	SEMATTRS_NET_TRANSPORT = TMP_NET_TRANSPORT;
	SEMATTRS_NET_PEER_IP = TMP_NET_PEER_IP;
	SEMATTRS_NET_PEER_PORT = TMP_NET_PEER_PORT;
	SEMATTRS_NET_PEER_NAME = TMP_NET_PEER_NAME;
	SEMATTRS_NET_HOST_IP = TMP_NET_HOST_IP;
	SEMATTRS_NET_HOST_PORT = TMP_NET_HOST_PORT;
	SEMATTRS_NET_HOST_NAME = TMP_NET_HOST_NAME;
	SEMATTRS_NET_HOST_CONNECTION_TYPE = TMP_NET_HOST_CONNECTION_TYPE;
	SEMATTRS_NET_HOST_CONNECTION_SUBTYPE = TMP_NET_HOST_CONNECTION_SUBTYPE;
	SEMATTRS_NET_HOST_CARRIER_NAME = TMP_NET_HOST_CARRIER_NAME;
	SEMATTRS_NET_HOST_CARRIER_MCC = TMP_NET_HOST_CARRIER_MCC;
	SEMATTRS_NET_HOST_CARRIER_MNC = TMP_NET_HOST_CARRIER_MNC;
	SEMATTRS_NET_HOST_CARRIER_ICC = TMP_NET_HOST_CARRIER_ICC;
	SEMATTRS_PEER_SERVICE = TMP_PEER_SERVICE;
	SEMATTRS_ENDUSER_ID = TMP_ENDUSER_ID;
	SEMATTRS_ENDUSER_ROLE = TMP_ENDUSER_ROLE;
	SEMATTRS_ENDUSER_SCOPE = TMP_ENDUSER_SCOPE;
	SEMATTRS_THREAD_ID = TMP_THREAD_ID;
	SEMATTRS_THREAD_NAME = TMP_THREAD_NAME;
	SEMATTRS_CODE_FUNCTION = TMP_CODE_FUNCTION;
	SEMATTRS_CODE_NAMESPACE = TMP_CODE_NAMESPACE;
	SEMATTRS_CODE_FILEPATH = TMP_CODE_FILEPATH;
	SEMATTRS_CODE_LINENO = TMP_CODE_LINENO;
	SEMATTRS_HTTP_METHOD = TMP_HTTP_METHOD;
	SEMATTRS_HTTP_URL = TMP_HTTP_URL;
	SEMATTRS_HTTP_TARGET = TMP_HTTP_TARGET;
	SEMATTRS_HTTP_HOST = TMP_HTTP_HOST;
	SEMATTRS_HTTP_SCHEME = TMP_HTTP_SCHEME;
	SEMATTRS_HTTP_STATUS_CODE = TMP_HTTP_STATUS_CODE;
	SEMATTRS_HTTP_FLAVOR = TMP_HTTP_FLAVOR;
	SEMATTRS_HTTP_USER_AGENT = TMP_HTTP_USER_AGENT;
	SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH = TMP_HTTP_REQUEST_CONTENT_LENGTH;
	SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED = TMP_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED;
	SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH = TMP_HTTP_RESPONSE_CONTENT_LENGTH;
	SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED = TMP_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED;
	SEMATTRS_HTTP_SERVER_NAME = TMP_HTTP_SERVER_NAME;
	SEMATTRS_HTTP_ROUTE = TMP_HTTP_ROUTE;
	SEMATTRS_HTTP_CLIENT_IP = TMP_HTTP_CLIENT_IP;
	SEMATTRS_AWS_DYNAMODB_TABLE_NAMES = TMP_AWS_DYNAMODB_TABLE_NAMES;
	SEMATTRS_AWS_DYNAMODB_CONSUMED_CAPACITY = TMP_AWS_DYNAMODB_CONSUMED_CAPACITY;
	SEMATTRS_AWS_DYNAMODB_ITEM_COLLECTION_METRICS = TMP_AWS_DYNAMODB_ITEM_COLLECTION_METRICS;
	SEMATTRS_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY = TMP_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY;
	SEMATTRS_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY = TMP_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY;
	SEMATTRS_AWS_DYNAMODB_CONSISTENT_READ = TMP_AWS_DYNAMODB_CONSISTENT_READ;
	SEMATTRS_AWS_DYNAMODB_PROJECTION = TMP_AWS_DYNAMODB_PROJECTION;
	SEMATTRS_AWS_DYNAMODB_LIMIT = TMP_AWS_DYNAMODB_LIMIT;
	SEMATTRS_AWS_DYNAMODB_ATTRIBUTES_TO_GET = TMP_AWS_DYNAMODB_ATTRIBUTES_TO_GET;
	SEMATTRS_AWS_DYNAMODB_INDEX_NAME = TMP_AWS_DYNAMODB_INDEX_NAME;
	SEMATTRS_AWS_DYNAMODB_SELECT = TMP_AWS_DYNAMODB_SELECT;
	SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES = TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES;
	SEMATTRS_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES = TMP_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES;
	SEMATTRS_AWS_DYNAMODB_EXCLUSIVE_START_TABLE = TMP_AWS_DYNAMODB_EXCLUSIVE_START_TABLE;
	SEMATTRS_AWS_DYNAMODB_TABLE_COUNT = TMP_AWS_DYNAMODB_TABLE_COUNT;
	SEMATTRS_AWS_DYNAMODB_SCAN_FORWARD = TMP_AWS_DYNAMODB_SCAN_FORWARD;
	SEMATTRS_AWS_DYNAMODB_SEGMENT = TMP_AWS_DYNAMODB_SEGMENT;
	SEMATTRS_AWS_DYNAMODB_TOTAL_SEGMENTS = TMP_AWS_DYNAMODB_TOTAL_SEGMENTS;
	SEMATTRS_AWS_DYNAMODB_COUNT = TMP_AWS_DYNAMODB_COUNT;
	SEMATTRS_AWS_DYNAMODB_SCANNED_COUNT = TMP_AWS_DYNAMODB_SCANNED_COUNT;
	SEMATTRS_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS = TMP_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS;
	SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES = TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES;
	SEMATTRS_MESSAGING_SYSTEM = TMP_MESSAGING_SYSTEM;
	SEMATTRS_MESSAGING_DESTINATION = TMP_MESSAGING_DESTINATION;
	SEMATTRS_MESSAGING_DESTINATION_KIND = TMP_MESSAGING_DESTINATION_KIND;
	SEMATTRS_MESSAGING_TEMP_DESTINATION = TMP_MESSAGING_TEMP_DESTINATION;
	SEMATTRS_MESSAGING_PROTOCOL = TMP_MESSAGING_PROTOCOL;
	SEMATTRS_MESSAGING_PROTOCOL_VERSION = TMP_MESSAGING_PROTOCOL_VERSION;
	SEMATTRS_MESSAGING_URL = TMP_MESSAGING_URL;
	SEMATTRS_MESSAGING_MESSAGE_ID = TMP_MESSAGING_MESSAGE_ID;
	SEMATTRS_MESSAGING_CONVERSATION_ID = TMP_MESSAGING_CONVERSATION_ID;
	SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES = TMP_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES;
	SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES = TMP_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES;
	SEMATTRS_MESSAGING_OPERATION = TMP_MESSAGING_OPERATION;
	SEMATTRS_MESSAGING_CONSUMER_ID = TMP_MESSAGING_CONSUMER_ID;
	SEMATTRS_MESSAGING_RABBITMQ_ROUTING_KEY = TMP_MESSAGING_RABBITMQ_ROUTING_KEY;
	SEMATTRS_MESSAGING_KAFKA_MESSAGE_KEY = TMP_MESSAGING_KAFKA_MESSAGE_KEY;
	SEMATTRS_MESSAGING_KAFKA_CONSUMER_GROUP = TMP_MESSAGING_KAFKA_CONSUMER_GROUP;
	SEMATTRS_MESSAGING_KAFKA_CLIENT_ID = TMP_MESSAGING_KAFKA_CLIENT_ID;
	SEMATTRS_MESSAGING_KAFKA_PARTITION = TMP_MESSAGING_KAFKA_PARTITION;
	SEMATTRS_MESSAGING_KAFKA_TOMBSTONE = TMP_MESSAGING_KAFKA_TOMBSTONE;
	SEMATTRS_RPC_SYSTEM = TMP_RPC_SYSTEM;
	SEMATTRS_RPC_SERVICE = TMP_RPC_SERVICE;
	SEMATTRS_RPC_METHOD = TMP_RPC_METHOD;
	SEMATTRS_RPC_GRPC_STATUS_CODE = TMP_RPC_GRPC_STATUS_CODE;
	SEMATTRS_RPC_JSONRPC_VERSION = TMP_RPC_JSONRPC_VERSION;
	SEMATTRS_RPC_JSONRPC_REQUEST_ID = TMP_RPC_JSONRPC_REQUEST_ID;
	SEMATTRS_RPC_JSONRPC_ERROR_CODE = TMP_RPC_JSONRPC_ERROR_CODE;
	SEMATTRS_RPC_JSONRPC_ERROR_MESSAGE = TMP_RPC_JSONRPC_ERROR_MESSAGE;
	SEMATTRS_MESSAGE_TYPE = TMP_MESSAGE_TYPE;
	SEMATTRS_MESSAGE_ID = TMP_MESSAGE_ID;
	SEMATTRS_MESSAGE_COMPRESSED_SIZE = TMP_MESSAGE_COMPRESSED_SIZE;
	SEMATTRS_MESSAGE_UNCOMPRESSED_SIZE = TMP_MESSAGE_UNCOMPRESSED_SIZE;
	SemanticAttributes = /*#__PURE__*/ createConstMap([
		TMP_AWS_LAMBDA_INVOKED_ARN,
		TMP_DB_SYSTEM,
		TMP_DB_CONNECTION_STRING,
		TMP_DB_USER,
		TMP_DB_JDBC_DRIVER_CLASSNAME,
		TMP_DB_NAME,
		TMP_DB_STATEMENT,
		TMP_DB_OPERATION,
		TMP_DB_MSSQL_INSTANCE_NAME,
		TMP_DB_CASSANDRA_KEYSPACE,
		TMP_DB_CASSANDRA_PAGE_SIZE,
		TMP_DB_CASSANDRA_CONSISTENCY_LEVEL,
		TMP_DB_CASSANDRA_TABLE,
		TMP_DB_CASSANDRA_IDEMPOTENCE,
		TMP_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT,
		TMP_DB_CASSANDRA_COORDINATOR_ID,
		TMP_DB_CASSANDRA_COORDINATOR_DC,
		TMP_DB_HBASE_NAMESPACE,
		TMP_DB_REDIS_DATABASE_INDEX,
		TMP_DB_MONGODB_COLLECTION,
		TMP_DB_SQL_TABLE,
		TMP_EXCEPTION_TYPE,
		TMP_EXCEPTION_MESSAGE,
		TMP_EXCEPTION_STACKTRACE,
		TMP_EXCEPTION_ESCAPED,
		TMP_FAAS_TRIGGER,
		TMP_FAAS_EXECUTION,
		TMP_FAAS_DOCUMENT_COLLECTION,
		TMP_FAAS_DOCUMENT_OPERATION,
		TMP_FAAS_DOCUMENT_TIME,
		TMP_FAAS_DOCUMENT_NAME,
		TMP_FAAS_TIME,
		TMP_FAAS_CRON,
		TMP_FAAS_COLDSTART,
		TMP_FAAS_INVOKED_NAME,
		TMP_FAAS_INVOKED_PROVIDER,
		TMP_FAAS_INVOKED_REGION,
		TMP_NET_TRANSPORT,
		TMP_NET_PEER_IP,
		TMP_NET_PEER_PORT,
		TMP_NET_PEER_NAME,
		TMP_NET_HOST_IP,
		TMP_NET_HOST_PORT,
		TMP_NET_HOST_NAME,
		TMP_NET_HOST_CONNECTION_TYPE,
		TMP_NET_HOST_CONNECTION_SUBTYPE,
		TMP_NET_HOST_CARRIER_NAME,
		TMP_NET_HOST_CARRIER_MCC,
		TMP_NET_HOST_CARRIER_MNC,
		TMP_NET_HOST_CARRIER_ICC,
		TMP_PEER_SERVICE,
		TMP_ENDUSER_ID,
		TMP_ENDUSER_ROLE,
		TMP_ENDUSER_SCOPE,
		TMP_THREAD_ID,
		TMP_THREAD_NAME,
		TMP_CODE_FUNCTION,
		TMP_CODE_NAMESPACE,
		TMP_CODE_FILEPATH,
		TMP_CODE_LINENO,
		TMP_HTTP_METHOD,
		TMP_HTTP_URL,
		TMP_HTTP_TARGET,
		TMP_HTTP_HOST,
		TMP_HTTP_SCHEME,
		TMP_HTTP_STATUS_CODE,
		TMP_HTTP_FLAVOR,
		TMP_HTTP_USER_AGENT,
		TMP_HTTP_REQUEST_CONTENT_LENGTH,
		TMP_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED,
		TMP_HTTP_RESPONSE_CONTENT_LENGTH,
		TMP_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED,
		TMP_HTTP_SERVER_NAME,
		TMP_HTTP_ROUTE,
		TMP_HTTP_CLIENT_IP,
		TMP_AWS_DYNAMODB_TABLE_NAMES,
		TMP_AWS_DYNAMODB_CONSUMED_CAPACITY,
		TMP_AWS_DYNAMODB_ITEM_COLLECTION_METRICS,
		TMP_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY,
		TMP_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY,
		TMP_AWS_DYNAMODB_CONSISTENT_READ,
		TMP_AWS_DYNAMODB_PROJECTION,
		TMP_AWS_DYNAMODB_LIMIT,
		TMP_AWS_DYNAMODB_ATTRIBUTES_TO_GET,
		TMP_AWS_DYNAMODB_INDEX_NAME,
		TMP_AWS_DYNAMODB_SELECT,
		TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES,
		TMP_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES,
		TMP_AWS_DYNAMODB_EXCLUSIVE_START_TABLE,
		TMP_AWS_DYNAMODB_TABLE_COUNT,
		TMP_AWS_DYNAMODB_SCAN_FORWARD,
		TMP_AWS_DYNAMODB_SEGMENT,
		TMP_AWS_DYNAMODB_TOTAL_SEGMENTS,
		TMP_AWS_DYNAMODB_COUNT,
		TMP_AWS_DYNAMODB_SCANNED_COUNT,
		TMP_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS,
		TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES,
		TMP_MESSAGING_SYSTEM,
		TMP_MESSAGING_DESTINATION,
		TMP_MESSAGING_DESTINATION_KIND,
		TMP_MESSAGING_TEMP_DESTINATION,
		TMP_MESSAGING_PROTOCOL,
		TMP_MESSAGING_PROTOCOL_VERSION,
		TMP_MESSAGING_URL,
		TMP_MESSAGING_MESSAGE_ID,
		TMP_MESSAGING_CONVERSATION_ID,
		TMP_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES,
		TMP_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES,
		TMP_MESSAGING_OPERATION,
		TMP_MESSAGING_CONSUMER_ID,
		TMP_MESSAGING_RABBITMQ_ROUTING_KEY,
		TMP_MESSAGING_KAFKA_MESSAGE_KEY,
		TMP_MESSAGING_KAFKA_CONSUMER_GROUP,
		TMP_MESSAGING_KAFKA_CLIENT_ID,
		TMP_MESSAGING_KAFKA_PARTITION,
		TMP_MESSAGING_KAFKA_TOMBSTONE,
		TMP_RPC_SYSTEM,
		TMP_RPC_SERVICE,
		TMP_RPC_METHOD,
		TMP_RPC_GRPC_STATUS_CODE,
		TMP_RPC_JSONRPC_VERSION,
		TMP_RPC_JSONRPC_REQUEST_ID,
		TMP_RPC_JSONRPC_ERROR_CODE,
		TMP_RPC_JSONRPC_ERROR_MESSAGE,
		TMP_MESSAGE_TYPE,
		TMP_MESSAGE_ID,
		TMP_MESSAGE_COMPRESSED_SIZE,
		TMP_MESSAGE_UNCOMPRESSED_SIZE
	]);
	TMP_DBSYSTEMVALUES_OTHER_SQL = "other_sql";
	TMP_DBSYSTEMVALUES_MSSQL = "mssql";
	TMP_DBSYSTEMVALUES_MYSQL = "mysql";
	TMP_DBSYSTEMVALUES_ORACLE = "oracle";
	TMP_DBSYSTEMVALUES_DB2 = "db2";
	TMP_DBSYSTEMVALUES_POSTGRESQL = "postgresql";
	TMP_DBSYSTEMVALUES_REDSHIFT = "redshift";
	TMP_DBSYSTEMVALUES_HIVE = "hive";
	TMP_DBSYSTEMVALUES_CLOUDSCAPE = "cloudscape";
	TMP_DBSYSTEMVALUES_HSQLDB = "hsqldb";
	TMP_DBSYSTEMVALUES_PROGRESS = "progress";
	TMP_DBSYSTEMVALUES_MAXDB = "maxdb";
	TMP_DBSYSTEMVALUES_HANADB = "hanadb";
	TMP_DBSYSTEMVALUES_INGRES = "ingres";
	TMP_DBSYSTEMVALUES_FIRSTSQL = "firstsql";
	TMP_DBSYSTEMVALUES_EDB = "edb";
	TMP_DBSYSTEMVALUES_CACHE = "cache";
	TMP_DBSYSTEMVALUES_ADABAS = "adabas";
	TMP_DBSYSTEMVALUES_FIREBIRD = "firebird";
	TMP_DBSYSTEMVALUES_DERBY = "derby";
	TMP_DBSYSTEMVALUES_FILEMAKER = "filemaker";
	TMP_DBSYSTEMVALUES_INFORMIX = "informix";
	TMP_DBSYSTEMVALUES_INSTANTDB = "instantdb";
	TMP_DBSYSTEMVALUES_INTERBASE = "interbase";
	TMP_DBSYSTEMVALUES_MARIADB = "mariadb";
	TMP_DBSYSTEMVALUES_NETEZZA = "netezza";
	TMP_DBSYSTEMVALUES_PERVASIVE = "pervasive";
	TMP_DBSYSTEMVALUES_POINTBASE = "pointbase";
	TMP_DBSYSTEMVALUES_SQLITE = "sqlite";
	TMP_DBSYSTEMVALUES_SYBASE = "sybase";
	TMP_DBSYSTEMVALUES_TERADATA = "teradata";
	TMP_DBSYSTEMVALUES_VERTICA = "vertica";
	TMP_DBSYSTEMVALUES_H2 = "h2";
	TMP_DBSYSTEMVALUES_COLDFUSION = "coldfusion";
	TMP_DBSYSTEMVALUES_CASSANDRA = "cassandra";
	TMP_DBSYSTEMVALUES_HBASE = "hbase";
	TMP_DBSYSTEMVALUES_MONGODB = "mongodb";
	TMP_DBSYSTEMVALUES_REDIS = "redis";
	TMP_DBSYSTEMVALUES_COUCHBASE = "couchbase";
	TMP_DBSYSTEMVALUES_COUCHDB = "couchdb";
	TMP_DBSYSTEMVALUES_COSMOSDB = "cosmosdb";
	TMP_DBSYSTEMVALUES_DYNAMODB = "dynamodb";
	TMP_DBSYSTEMVALUES_NEO4J = "neo4j";
	TMP_DBSYSTEMVALUES_GEODE = "geode";
	TMP_DBSYSTEMVALUES_ELASTICSEARCH = "elasticsearch";
	TMP_DBSYSTEMVALUES_MEMCACHED = "memcached";
	TMP_DBSYSTEMVALUES_COCKROACHDB = "cockroachdb";
	DBSYSTEMVALUES_OTHER_SQL = TMP_DBSYSTEMVALUES_OTHER_SQL;
	DBSYSTEMVALUES_MSSQL = TMP_DBSYSTEMVALUES_MSSQL;
	DBSYSTEMVALUES_MYSQL = TMP_DBSYSTEMVALUES_MYSQL;
	DBSYSTEMVALUES_ORACLE = TMP_DBSYSTEMVALUES_ORACLE;
	DBSYSTEMVALUES_POSTGRESQL = TMP_DBSYSTEMVALUES_POSTGRESQL;
	DBSYSTEMVALUES_REDSHIFT = TMP_DBSYSTEMVALUES_REDSHIFT;
	DBSYSTEMVALUES_HIVE = TMP_DBSYSTEMVALUES_HIVE;
	DBSYSTEMVALUES_CLOUDSCAPE = TMP_DBSYSTEMVALUES_CLOUDSCAPE;
	DBSYSTEMVALUES_HSQLDB = TMP_DBSYSTEMVALUES_HSQLDB;
	DBSYSTEMVALUES_PROGRESS = TMP_DBSYSTEMVALUES_PROGRESS;
	DBSYSTEMVALUES_MAXDB = TMP_DBSYSTEMVALUES_MAXDB;
	DBSYSTEMVALUES_HANADB = TMP_DBSYSTEMVALUES_HANADB;
	DBSYSTEMVALUES_INGRES = TMP_DBSYSTEMVALUES_INGRES;
	DBSYSTEMVALUES_FIRSTSQL = TMP_DBSYSTEMVALUES_FIRSTSQL;
	DBSYSTEMVALUES_CACHE = TMP_DBSYSTEMVALUES_CACHE;
	DBSYSTEMVALUES_ADABAS = TMP_DBSYSTEMVALUES_ADABAS;
	DBSYSTEMVALUES_FIREBIRD = TMP_DBSYSTEMVALUES_FIREBIRD;
	DBSYSTEMVALUES_DERBY = TMP_DBSYSTEMVALUES_DERBY;
	DBSYSTEMVALUES_FILEMAKER = TMP_DBSYSTEMVALUES_FILEMAKER;
	DBSYSTEMVALUES_INFORMIX = TMP_DBSYSTEMVALUES_INFORMIX;
	DBSYSTEMVALUES_INSTANTDB = TMP_DBSYSTEMVALUES_INSTANTDB;
	DBSYSTEMVALUES_INTERBASE = TMP_DBSYSTEMVALUES_INTERBASE;
	DBSYSTEMVALUES_MARIADB = TMP_DBSYSTEMVALUES_MARIADB;
	DBSYSTEMVALUES_NETEZZA = TMP_DBSYSTEMVALUES_NETEZZA;
	DBSYSTEMVALUES_PERVASIVE = TMP_DBSYSTEMVALUES_PERVASIVE;
	DBSYSTEMVALUES_POINTBASE = TMP_DBSYSTEMVALUES_POINTBASE;
	DBSYSTEMVALUES_SQLITE = TMP_DBSYSTEMVALUES_SQLITE;
	DBSYSTEMVALUES_SYBASE = TMP_DBSYSTEMVALUES_SYBASE;
	DBSYSTEMVALUES_TERADATA = TMP_DBSYSTEMVALUES_TERADATA;
	DBSYSTEMVALUES_VERTICA = TMP_DBSYSTEMVALUES_VERTICA;
	DBSYSTEMVALUES_COLDFUSION = TMP_DBSYSTEMVALUES_COLDFUSION;
	DBSYSTEMVALUES_CASSANDRA = TMP_DBSYSTEMVALUES_CASSANDRA;
	DBSYSTEMVALUES_HBASE = TMP_DBSYSTEMVALUES_HBASE;
	DBSYSTEMVALUES_MONGODB = TMP_DBSYSTEMVALUES_MONGODB;
	DBSYSTEMVALUES_REDIS = TMP_DBSYSTEMVALUES_REDIS;
	DBSYSTEMVALUES_COUCHBASE = TMP_DBSYSTEMVALUES_COUCHBASE;
	DBSYSTEMVALUES_COUCHDB = TMP_DBSYSTEMVALUES_COUCHDB;
	DBSYSTEMVALUES_COSMOSDB = TMP_DBSYSTEMVALUES_COSMOSDB;
	DBSYSTEMVALUES_DYNAMODB = TMP_DBSYSTEMVALUES_DYNAMODB;
	DBSYSTEMVALUES_NEO4J = TMP_DBSYSTEMVALUES_NEO4J;
	DBSYSTEMVALUES_GEODE = TMP_DBSYSTEMVALUES_GEODE;
	DBSYSTEMVALUES_ELASTICSEARCH = TMP_DBSYSTEMVALUES_ELASTICSEARCH;
	DBSYSTEMVALUES_MEMCACHED = TMP_DBSYSTEMVALUES_MEMCACHED;
	DBSYSTEMVALUES_COCKROACHDB = TMP_DBSYSTEMVALUES_COCKROACHDB;
	DbSystemValues = /*#__PURE__*/ createConstMap([
		TMP_DBSYSTEMVALUES_OTHER_SQL,
		TMP_DBSYSTEMVALUES_MSSQL,
		TMP_DBSYSTEMVALUES_MYSQL,
		TMP_DBSYSTEMVALUES_ORACLE,
		TMP_DBSYSTEMVALUES_DB2,
		TMP_DBSYSTEMVALUES_POSTGRESQL,
		TMP_DBSYSTEMVALUES_REDSHIFT,
		TMP_DBSYSTEMVALUES_HIVE,
		TMP_DBSYSTEMVALUES_CLOUDSCAPE,
		TMP_DBSYSTEMVALUES_HSQLDB,
		TMP_DBSYSTEMVALUES_PROGRESS,
		TMP_DBSYSTEMVALUES_MAXDB,
		TMP_DBSYSTEMVALUES_HANADB,
		TMP_DBSYSTEMVALUES_INGRES,
		TMP_DBSYSTEMVALUES_FIRSTSQL,
		TMP_DBSYSTEMVALUES_EDB,
		TMP_DBSYSTEMVALUES_CACHE,
		TMP_DBSYSTEMVALUES_ADABAS,
		TMP_DBSYSTEMVALUES_FIREBIRD,
		TMP_DBSYSTEMVALUES_DERBY,
		TMP_DBSYSTEMVALUES_FILEMAKER,
		TMP_DBSYSTEMVALUES_INFORMIX,
		TMP_DBSYSTEMVALUES_INSTANTDB,
		TMP_DBSYSTEMVALUES_INTERBASE,
		TMP_DBSYSTEMVALUES_MARIADB,
		TMP_DBSYSTEMVALUES_NETEZZA,
		TMP_DBSYSTEMVALUES_PERVASIVE,
		TMP_DBSYSTEMVALUES_POINTBASE,
		TMP_DBSYSTEMVALUES_SQLITE,
		TMP_DBSYSTEMVALUES_SYBASE,
		TMP_DBSYSTEMVALUES_TERADATA,
		TMP_DBSYSTEMVALUES_VERTICA,
		TMP_DBSYSTEMVALUES_H2,
		TMP_DBSYSTEMVALUES_COLDFUSION,
		TMP_DBSYSTEMVALUES_CASSANDRA,
		TMP_DBSYSTEMVALUES_HBASE,
		TMP_DBSYSTEMVALUES_MONGODB,
		TMP_DBSYSTEMVALUES_REDIS,
		TMP_DBSYSTEMVALUES_COUCHBASE,
		TMP_DBSYSTEMVALUES_COUCHDB,
		TMP_DBSYSTEMVALUES_COSMOSDB,
		TMP_DBSYSTEMVALUES_DYNAMODB,
		TMP_DBSYSTEMVALUES_NEO4J,
		TMP_DBSYSTEMVALUES_GEODE,
		TMP_DBSYSTEMVALUES_ELASTICSEARCH,
		TMP_DBSYSTEMVALUES_MEMCACHED,
		TMP_DBSYSTEMVALUES_COCKROACHDB
	]);
	TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ALL = "all";
	TMP_DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM = "each_quorum";
	TMP_DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM = "quorum";
	TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM = "local_quorum";
	TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ONE = "one";
	TMP_DBCASSANDRACONSISTENCYLEVELVALUES_TWO = "two";
	TMP_DBCASSANDRACONSISTENCYLEVELVALUES_THREE = "three";
	TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE = "local_one";
	TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ANY = "any";
	TMP_DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL = "serial";
	TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL = "local_serial";
	DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM;
	DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM;
	DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM;
	DBCASSANDRACONSISTENCYLEVELVALUES_THREE = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_THREE;
	DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE;
	DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL;
	DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL;
	DbCassandraConsistencyLevelValues = /*#__PURE__*/ createConstMap([
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ALL,
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM,
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM,
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM,
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ONE,
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_TWO,
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_THREE,
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE,
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ANY,
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL,
		TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL
	]);
	TMP_FAASTRIGGERVALUES_DATASOURCE = "datasource";
	TMP_FAASTRIGGERVALUES_HTTP = "http";
	TMP_FAASTRIGGERVALUES_PUBSUB = "pubsub";
	TMP_FAASTRIGGERVALUES_TIMER = "timer";
	TMP_FAASTRIGGERVALUES_OTHER = "other";
	FAASTRIGGERVALUES_DATASOURCE = TMP_FAASTRIGGERVALUES_DATASOURCE;
	FAASTRIGGERVALUES_HTTP = TMP_FAASTRIGGERVALUES_HTTP;
	FAASTRIGGERVALUES_PUBSUB = TMP_FAASTRIGGERVALUES_PUBSUB;
	FAASTRIGGERVALUES_TIMER = TMP_FAASTRIGGERVALUES_TIMER;
	FAASTRIGGERVALUES_OTHER = TMP_FAASTRIGGERVALUES_OTHER;
	FaasTriggerValues = /*#__PURE__*/ createConstMap([
		TMP_FAASTRIGGERVALUES_DATASOURCE,
		TMP_FAASTRIGGERVALUES_HTTP,
		TMP_FAASTRIGGERVALUES_PUBSUB,
		TMP_FAASTRIGGERVALUES_TIMER,
		TMP_FAASTRIGGERVALUES_OTHER
	]);
	TMP_FAASDOCUMENTOPERATIONVALUES_INSERT = "insert";
	TMP_FAASDOCUMENTOPERATIONVALUES_EDIT = "edit";
	TMP_FAASDOCUMENTOPERATIONVALUES_DELETE = "delete";
	FAASDOCUMENTOPERATIONVALUES_INSERT = TMP_FAASDOCUMENTOPERATIONVALUES_INSERT;
	FAASDOCUMENTOPERATIONVALUES_EDIT = TMP_FAASDOCUMENTOPERATIONVALUES_EDIT;
	FAASDOCUMENTOPERATIONVALUES_DELETE = TMP_FAASDOCUMENTOPERATIONVALUES_DELETE;
	FaasDocumentOperationValues = /*#__PURE__*/ createConstMap([
		TMP_FAASDOCUMENTOPERATIONVALUES_INSERT,
		TMP_FAASDOCUMENTOPERATIONVALUES_EDIT,
		TMP_FAASDOCUMENTOPERATIONVALUES_DELETE
	]);
	TMP_FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD = "alibaba_cloud";
	TMP_FAASINVOKEDPROVIDERVALUES_AWS = "aws";
	TMP_FAASINVOKEDPROVIDERVALUES_AZURE = "azure";
	TMP_FAASINVOKEDPROVIDERVALUES_GCP = "gcp";
	FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD = TMP_FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD;
	FAASINVOKEDPROVIDERVALUES_AZURE = TMP_FAASINVOKEDPROVIDERVALUES_AZURE;
	FaasInvokedProviderValues = /*#__PURE__*/ createConstMap([
		TMP_FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD,
		TMP_FAASINVOKEDPROVIDERVALUES_AWS,
		TMP_FAASINVOKEDPROVIDERVALUES_AZURE,
		TMP_FAASINVOKEDPROVIDERVALUES_GCP
	]);
	TMP_NETTRANSPORTVALUES_IP_TCP = "ip_tcp";
	TMP_NETTRANSPORTVALUES_IP_UDP = "ip_udp";
	TMP_NETTRANSPORTVALUES_IP = "ip";
	TMP_NETTRANSPORTVALUES_UNIX = "unix";
	TMP_NETTRANSPORTVALUES_PIPE = "pipe";
	TMP_NETTRANSPORTVALUES_INPROC = "inproc";
	TMP_NETTRANSPORTVALUES_OTHER = "other";
	NETTRANSPORTVALUES_IP_TCP = TMP_NETTRANSPORTVALUES_IP_TCP;
	NETTRANSPORTVALUES_IP_UDP = TMP_NETTRANSPORTVALUES_IP_UDP;
	NETTRANSPORTVALUES_UNIX = TMP_NETTRANSPORTVALUES_UNIX;
	NETTRANSPORTVALUES_PIPE = TMP_NETTRANSPORTVALUES_PIPE;
	NETTRANSPORTVALUES_INPROC = TMP_NETTRANSPORTVALUES_INPROC;
	NETTRANSPORTVALUES_OTHER = TMP_NETTRANSPORTVALUES_OTHER;
	NetTransportValues = /*#__PURE__*/ createConstMap([
		TMP_NETTRANSPORTVALUES_IP_TCP,
		TMP_NETTRANSPORTVALUES_IP_UDP,
		TMP_NETTRANSPORTVALUES_IP,
		TMP_NETTRANSPORTVALUES_UNIX,
		TMP_NETTRANSPORTVALUES_PIPE,
		TMP_NETTRANSPORTVALUES_INPROC,
		TMP_NETTRANSPORTVALUES_OTHER
	]);
	TMP_NETHOSTCONNECTIONTYPEVALUES_WIFI = "wifi";
	TMP_NETHOSTCONNECTIONTYPEVALUES_WIRED = "wired";
	TMP_NETHOSTCONNECTIONTYPEVALUES_CELL = "cell";
	TMP_NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE = "unavailable";
	TMP_NETHOSTCONNECTIONTYPEVALUES_UNKNOWN = "unknown";
	NETHOSTCONNECTIONTYPEVALUES_WIFI = TMP_NETHOSTCONNECTIONTYPEVALUES_WIFI;
	NETHOSTCONNECTIONTYPEVALUES_WIRED = TMP_NETHOSTCONNECTIONTYPEVALUES_WIRED;
	NETHOSTCONNECTIONTYPEVALUES_CELL = TMP_NETHOSTCONNECTIONTYPEVALUES_CELL;
	NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE = TMP_NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE;
	NETHOSTCONNECTIONTYPEVALUES_UNKNOWN = TMP_NETHOSTCONNECTIONTYPEVALUES_UNKNOWN;
	NetHostConnectionTypeValues = /*#__PURE__*/ createConstMap([
		TMP_NETHOSTCONNECTIONTYPEVALUES_WIFI,
		TMP_NETHOSTCONNECTIONTYPEVALUES_WIRED,
		TMP_NETHOSTCONNECTIONTYPEVALUES_CELL,
		TMP_NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE,
		TMP_NETHOSTCONNECTIONTYPEVALUES_UNKNOWN
	]);
	TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GPRS = "gprs";
	TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EDGE = "edge";
	TMP_NETHOSTCONNECTIONSUBTYPEVALUES_UMTS = "umts";
	TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA = "cdma";
	TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0 = "evdo_0";
	TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A = "evdo_a";
	TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT = "cdma2000_1xrtt";
	TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA = "hsdpa";
	TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA = "hsupa";
	TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPA = "hspa";
	TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IDEN = "iden";
	TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B = "evdo_b";
	TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE = "lte";
	TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD = "ehrpd";
	TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP = "hspap";
	TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GSM = "gsm";
	TMP_NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA = "td_scdma";
	TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN = "iwlan";
	TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NR = "nr";
	TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA = "nrnsa";
	TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA = "lte_ca";
	NETHOSTCONNECTIONSUBTYPEVALUES_GPRS = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GPRS;
	NETHOSTCONNECTIONSUBTYPEVALUES_EDGE = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EDGE;
	NETHOSTCONNECTIONSUBTYPEVALUES_UMTS = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_UMTS;
	NETHOSTCONNECTIONSUBTYPEVALUES_CDMA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA;
	NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0 = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0;
	NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A;
	NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT;
	NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA;
	NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA;
	NETHOSTCONNECTIONSUBTYPEVALUES_HSPA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPA;
	NETHOSTCONNECTIONSUBTYPEVALUES_IDEN = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IDEN;
	NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B;
	NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD;
	NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP;
	NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA;
	NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN;
	NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA;
	NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA;
	NetHostConnectionSubtypeValues = /*#__PURE__*/ createConstMap([
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GPRS,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EDGE,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_UMTS,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPA,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IDEN,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GSM,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NR,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA,
		TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA
	]);
	TMP_HTTPFLAVORVALUES_HTTP_1_0 = "1.0";
	TMP_HTTPFLAVORVALUES_HTTP_1_1 = "1.1";
	TMP_HTTPFLAVORVALUES_HTTP_2_0 = "2.0";
	TMP_HTTPFLAVORVALUES_SPDY = "SPDY";
	TMP_HTTPFLAVORVALUES_QUIC = "QUIC";
	HTTPFLAVORVALUES_SPDY = TMP_HTTPFLAVORVALUES_SPDY;
	HTTPFLAVORVALUES_QUIC = TMP_HTTPFLAVORVALUES_QUIC;
	HttpFlavorValues = {
		HTTP_1_0: TMP_HTTPFLAVORVALUES_HTTP_1_0,
		HTTP_1_1: TMP_HTTPFLAVORVALUES_HTTP_1_1,
		HTTP_2_0: TMP_HTTPFLAVORVALUES_HTTP_2_0,
		SPDY: TMP_HTTPFLAVORVALUES_SPDY,
		QUIC: TMP_HTTPFLAVORVALUES_QUIC
	};
	TMP_MESSAGINGDESTINATIONKINDVALUES_QUEUE = "queue";
	TMP_MESSAGINGDESTINATIONKINDVALUES_TOPIC = "topic";
	MESSAGINGDESTINATIONKINDVALUES_QUEUE = TMP_MESSAGINGDESTINATIONKINDVALUES_QUEUE;
	MESSAGINGDESTINATIONKINDVALUES_TOPIC = TMP_MESSAGINGDESTINATIONKINDVALUES_TOPIC;
	MessagingDestinationKindValues = /*#__PURE__*/ createConstMap([TMP_MESSAGINGDESTINATIONKINDVALUES_QUEUE, TMP_MESSAGINGDESTINATIONKINDVALUES_TOPIC]);
	TMP_MESSAGINGOPERATIONVALUES_RECEIVE = "receive";
	TMP_MESSAGINGOPERATIONVALUES_PROCESS = "process";
	MESSAGINGOPERATIONVALUES_RECEIVE = TMP_MESSAGINGOPERATIONVALUES_RECEIVE;
	MESSAGINGOPERATIONVALUES_PROCESS = TMP_MESSAGINGOPERATIONVALUES_PROCESS;
	MessagingOperationValues = /*#__PURE__*/ createConstMap([TMP_MESSAGINGOPERATIONVALUES_RECEIVE, TMP_MESSAGINGOPERATIONVALUES_PROCESS]);
	TMP_RPCGRPCSTATUSCODEVALUES_OK = 0;
	TMP_RPCGRPCSTATUSCODEVALUES_CANCELLED = 1;
	TMP_RPCGRPCSTATUSCODEVALUES_UNKNOWN = 2;
	TMP_RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT = 3;
	TMP_RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED = 4;
	TMP_RPCGRPCSTATUSCODEVALUES_NOT_FOUND = 5;
	TMP_RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS = 6;
	TMP_RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED = 7;
	TMP_RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED = 8;
	TMP_RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION = 9;
	TMP_RPCGRPCSTATUSCODEVALUES_ABORTED = 10;
	TMP_RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE = 11;
	TMP_RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED = 12;
	TMP_RPCGRPCSTATUSCODEVALUES_INTERNAL = 13;
	TMP_RPCGRPCSTATUSCODEVALUES_UNAVAILABLE = 14;
	TMP_RPCGRPCSTATUSCODEVALUES_DATA_LOSS = 15;
	TMP_RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED = 16;
	RpcGrpcStatusCodeValues = {
		OK: TMP_RPCGRPCSTATUSCODEVALUES_OK,
		CANCELLED: TMP_RPCGRPCSTATUSCODEVALUES_CANCELLED,
		UNKNOWN: TMP_RPCGRPCSTATUSCODEVALUES_UNKNOWN,
		INVALID_ARGUMENT: TMP_RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT,
		DEADLINE_EXCEEDED: TMP_RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED,
		NOT_FOUND: TMP_RPCGRPCSTATUSCODEVALUES_NOT_FOUND,
		ALREADY_EXISTS: TMP_RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS,
		PERMISSION_DENIED: TMP_RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED,
		RESOURCE_EXHAUSTED: TMP_RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED,
		FAILED_PRECONDITION: TMP_RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION,
		ABORTED: TMP_RPCGRPCSTATUSCODEVALUES_ABORTED,
		OUT_OF_RANGE: TMP_RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE,
		UNIMPLEMENTED: TMP_RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED,
		INTERNAL: TMP_RPCGRPCSTATUSCODEVALUES_INTERNAL,
		UNAVAILABLE: TMP_RPCGRPCSTATUSCODEVALUES_UNAVAILABLE,
		DATA_LOSS: TMP_RPCGRPCSTATUSCODEVALUES_DATA_LOSS,
		UNAUTHENTICATED: TMP_RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED
	};
	TMP_MESSAGETYPEVALUES_SENT = "SENT";
	TMP_MESSAGETYPEVALUES_RECEIVED = "RECEIVED";
	MESSAGETYPEVALUES_SENT = TMP_MESSAGETYPEVALUES_SENT;
	MESSAGETYPEVALUES_RECEIVED = TMP_MESSAGETYPEVALUES_RECEIVED;
	MessageTypeValues = /*#__PURE__*/ createConstMap([TMP_MESSAGETYPEVALUES_SENT, TMP_MESSAGETYPEVALUES_RECEIVED]);
}));
//#endregion
//#region node_modules/@opentelemetry/semantic-conventions/build/esm/trace/index.js
var init_trace = __esmMin((() => {
	init_SemanticAttributes();
})), TMP_CLOUD_PROVIDER, TMP_CLOUD_ACCOUNT_ID, TMP_CLOUD_REGION, TMP_CLOUD_AVAILABILITY_ZONE, TMP_CLOUD_PLATFORM, TMP_AWS_ECS_CONTAINER_ARN, TMP_AWS_ECS_CLUSTER_ARN, TMP_AWS_ECS_LAUNCHTYPE, TMP_AWS_ECS_TASK_ARN, TMP_AWS_ECS_TASK_FAMILY, TMP_AWS_ECS_TASK_REVISION, TMP_AWS_EKS_CLUSTER_ARN, TMP_AWS_LOG_GROUP_NAMES, TMP_AWS_LOG_GROUP_ARNS, TMP_AWS_LOG_STREAM_NAMES, TMP_AWS_LOG_STREAM_ARNS, TMP_CONTAINER_NAME, TMP_CONTAINER_ID, TMP_CONTAINER_RUNTIME, TMP_CONTAINER_IMAGE_NAME, TMP_CONTAINER_IMAGE_TAG, TMP_DEPLOYMENT_ENVIRONMENT, TMP_DEVICE_ID, TMP_DEVICE_MODEL_IDENTIFIER, TMP_DEVICE_MODEL_NAME, TMP_FAAS_NAME, TMP_FAAS_ID, TMP_FAAS_VERSION, TMP_FAAS_INSTANCE, TMP_FAAS_MAX_MEMORY, TMP_HOST_ID, TMP_HOST_NAME, TMP_HOST_TYPE, TMP_HOST_ARCH, TMP_HOST_IMAGE_NAME, TMP_HOST_IMAGE_ID, TMP_HOST_IMAGE_VERSION, TMP_K8S_CLUSTER_NAME, TMP_K8S_NODE_NAME, TMP_K8S_NODE_UID, TMP_K8S_NAMESPACE_NAME, TMP_K8S_POD_UID, TMP_K8S_POD_NAME, TMP_K8S_CONTAINER_NAME, TMP_K8S_REPLICASET_UID, TMP_K8S_REPLICASET_NAME, TMP_K8S_DEPLOYMENT_UID, TMP_K8S_DEPLOYMENT_NAME, TMP_K8S_STATEFULSET_UID, TMP_K8S_STATEFULSET_NAME, TMP_K8S_DAEMONSET_UID, TMP_K8S_DAEMONSET_NAME, TMP_K8S_JOB_UID, TMP_K8S_JOB_NAME, TMP_K8S_CRONJOB_UID, TMP_K8S_CRONJOB_NAME, TMP_OS_TYPE, TMP_OS_DESCRIPTION, TMP_OS_NAME, TMP_OS_VERSION, TMP_PROCESS_PID, TMP_PROCESS_EXECUTABLE_NAME, TMP_PROCESS_EXECUTABLE_PATH, TMP_PROCESS_COMMAND, TMP_PROCESS_COMMAND_LINE, TMP_PROCESS_COMMAND_ARGS, TMP_PROCESS_OWNER, TMP_PROCESS_RUNTIME_NAME, TMP_PROCESS_RUNTIME_VERSION, TMP_PROCESS_RUNTIME_DESCRIPTION, TMP_SERVICE_NAME, TMP_SERVICE_NAMESPACE, TMP_SERVICE_INSTANCE_ID, TMP_SERVICE_VERSION, TMP_TELEMETRY_SDK_NAME, TMP_TELEMETRY_SDK_LANGUAGE, TMP_TELEMETRY_SDK_VERSION, TMP_TELEMETRY_AUTO_VERSION, TMP_WEBENGINE_NAME, TMP_WEBENGINE_VERSION, TMP_WEBENGINE_DESCRIPTION, SEMRESATTRS_CLOUD_PROVIDER, SEMRESATTRS_CLOUD_ACCOUNT_ID, SEMRESATTRS_CLOUD_REGION, SEMRESATTRS_CLOUD_AVAILABILITY_ZONE, SEMRESATTRS_CLOUD_PLATFORM, SEMRESATTRS_AWS_ECS_CONTAINER_ARN, SEMRESATTRS_AWS_ECS_CLUSTER_ARN, SEMRESATTRS_AWS_ECS_LAUNCHTYPE, SEMRESATTRS_AWS_ECS_TASK_ARN, SEMRESATTRS_AWS_ECS_TASK_FAMILY, SEMRESATTRS_AWS_ECS_TASK_REVISION, SEMRESATTRS_AWS_EKS_CLUSTER_ARN, SEMRESATTRS_AWS_LOG_GROUP_NAMES, SEMRESATTRS_AWS_LOG_GROUP_ARNS, SEMRESATTRS_AWS_LOG_STREAM_NAMES, SEMRESATTRS_AWS_LOG_STREAM_ARNS, SEMRESATTRS_CONTAINER_NAME, SEMRESATTRS_CONTAINER_ID, SEMRESATTRS_CONTAINER_RUNTIME, SEMRESATTRS_CONTAINER_IMAGE_NAME, SEMRESATTRS_CONTAINER_IMAGE_TAG, SEMRESATTRS_DEPLOYMENT_ENVIRONMENT, SEMRESATTRS_DEVICE_ID, SEMRESATTRS_DEVICE_MODEL_IDENTIFIER, SEMRESATTRS_DEVICE_MODEL_NAME, SEMRESATTRS_FAAS_NAME, SEMRESATTRS_FAAS_ID, SEMRESATTRS_FAAS_VERSION, SEMRESATTRS_FAAS_INSTANCE, SEMRESATTRS_FAAS_MAX_MEMORY, SEMRESATTRS_HOST_ID, SEMRESATTRS_HOST_NAME, SEMRESATTRS_HOST_TYPE, SEMRESATTRS_HOST_ARCH, SEMRESATTRS_HOST_IMAGE_NAME, SEMRESATTRS_HOST_IMAGE_ID, SEMRESATTRS_HOST_IMAGE_VERSION, SEMRESATTRS_K8S_CLUSTER_NAME, SEMRESATTRS_K8S_NODE_NAME, SEMRESATTRS_K8S_NODE_UID, SEMRESATTRS_K8S_NAMESPACE_NAME, SEMRESATTRS_K8S_POD_UID, SEMRESATTRS_K8S_POD_NAME, SEMRESATTRS_K8S_CONTAINER_NAME, SEMRESATTRS_K8S_REPLICASET_UID, SEMRESATTRS_K8S_REPLICASET_NAME, SEMRESATTRS_K8S_DEPLOYMENT_UID, SEMRESATTRS_K8S_DEPLOYMENT_NAME, SEMRESATTRS_K8S_STATEFULSET_UID, SEMRESATTRS_K8S_STATEFULSET_NAME, SEMRESATTRS_K8S_DAEMONSET_UID, SEMRESATTRS_K8S_DAEMONSET_NAME, SEMRESATTRS_K8S_JOB_UID, SEMRESATTRS_K8S_JOB_NAME, SEMRESATTRS_K8S_CRONJOB_UID, SEMRESATTRS_K8S_CRONJOB_NAME, SEMRESATTRS_OS_TYPE, SEMRESATTRS_OS_DESCRIPTION, SEMRESATTRS_OS_NAME, SEMRESATTRS_OS_VERSION, SEMRESATTRS_PROCESS_PID, SEMRESATTRS_PROCESS_EXECUTABLE_NAME, SEMRESATTRS_PROCESS_EXECUTABLE_PATH, SEMRESATTRS_PROCESS_COMMAND, SEMRESATTRS_PROCESS_COMMAND_LINE, SEMRESATTRS_PROCESS_COMMAND_ARGS, SEMRESATTRS_PROCESS_OWNER, SEMRESATTRS_PROCESS_RUNTIME_NAME, SEMRESATTRS_PROCESS_RUNTIME_VERSION, SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION, SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_NAMESPACE, SEMRESATTRS_SERVICE_INSTANCE_ID, SEMRESATTRS_SERVICE_VERSION, SEMRESATTRS_TELEMETRY_SDK_NAME, SEMRESATTRS_TELEMETRY_SDK_LANGUAGE, SEMRESATTRS_TELEMETRY_SDK_VERSION, SEMRESATTRS_TELEMETRY_AUTO_VERSION, SEMRESATTRS_WEBENGINE_NAME, SEMRESATTRS_WEBENGINE_VERSION, SEMRESATTRS_WEBENGINE_DESCRIPTION, SemanticResourceAttributes, TMP_CLOUDPROVIDERVALUES_ALIBABA_CLOUD, TMP_CLOUDPROVIDERVALUES_AWS, TMP_CLOUDPROVIDERVALUES_AZURE, TMP_CLOUDPROVIDERVALUES_GCP, CLOUDPROVIDERVALUES_ALIBABA_CLOUD, CLOUDPROVIDERVALUES_AZURE, CloudProviderValues, TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS, TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC, TMP_CLOUDPLATFORMVALUES_AWS_EC2, TMP_CLOUDPLATFORMVALUES_AWS_ECS, TMP_CLOUDPLATFORMVALUES_AWS_EKS, TMP_CLOUDPLATFORMVALUES_AWS_LAMBDA, TMP_CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK, TMP_CLOUDPLATFORMVALUES_AZURE_VM, TMP_CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES, TMP_CLOUDPLATFORMVALUES_AZURE_AKS, TMP_CLOUDPLATFORMVALUES_AZURE_FUNCTIONS, TMP_CLOUDPLATFORMVALUES_AZURE_APP_SERVICE, TMP_CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE, TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_RUN, TMP_CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE, TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS, TMP_CLOUDPLATFORMVALUES_GCP_APP_ENGINE, CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS, CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC, CLOUDPLATFORMVALUES_AWS_EC2, CLOUDPLATFORMVALUES_AWS_ECS, CLOUDPLATFORMVALUES_AWS_EKS, CLOUDPLATFORMVALUES_AWS_LAMBDA, CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK, CLOUDPLATFORMVALUES_AZURE_VM, CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES, CLOUDPLATFORMVALUES_AZURE_AKS, CLOUDPLATFORMVALUES_AZURE_FUNCTIONS, CLOUDPLATFORMVALUES_AZURE_APP_SERVICE, CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE, CLOUDPLATFORMVALUES_GCP_CLOUD_RUN, CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE, CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS, CLOUDPLATFORMVALUES_GCP_APP_ENGINE, CloudPlatformValues, TMP_AWSECSLAUNCHTYPEVALUES_EC2, TMP_AWSECSLAUNCHTYPEVALUES_FARGATE, AWSECSLAUNCHTYPEVALUES_FARGATE, AwsEcsLaunchtypeValues, TMP_HOSTARCHVALUES_AMD64, TMP_HOSTARCHVALUES_ARM32, TMP_HOSTARCHVALUES_ARM64, TMP_HOSTARCHVALUES_IA64, TMP_HOSTARCHVALUES_PPC32, TMP_HOSTARCHVALUES_PPC64, TMP_HOSTARCHVALUES_X86, HOSTARCHVALUES_AMD64, HOSTARCHVALUES_ARM32, HOSTARCHVALUES_ARM64, HOSTARCHVALUES_IA64, HOSTARCHVALUES_PPC32, HOSTARCHVALUES_PPC64, HostArchValues, TMP_OSTYPEVALUES_WINDOWS, TMP_OSTYPEVALUES_LINUX, TMP_OSTYPEVALUES_DARWIN, TMP_OSTYPEVALUES_FREEBSD, TMP_OSTYPEVALUES_NETBSD, TMP_OSTYPEVALUES_OPENBSD, TMP_OSTYPEVALUES_DRAGONFLYBSD, TMP_OSTYPEVALUES_HPUX, TMP_OSTYPEVALUES_AIX, TMP_OSTYPEVALUES_SOLARIS, TMP_OSTYPEVALUES_Z_OS, OSTYPEVALUES_WINDOWS, OSTYPEVALUES_LINUX, OSTYPEVALUES_DARWIN, OSTYPEVALUES_FREEBSD, OSTYPEVALUES_NETBSD, OSTYPEVALUES_OPENBSD, OSTYPEVALUES_DRAGONFLYBSD, OSTYPEVALUES_HPUX, OSTYPEVALUES_SOLARIS, OSTYPEVALUES_Z_OS, OsTypeValues, TMP_TELEMETRYSDKLANGUAGEVALUES_CPP, TMP_TELEMETRYSDKLANGUAGEVALUES_DOTNET, TMP_TELEMETRYSDKLANGUAGEVALUES_ERLANG, TMP_TELEMETRYSDKLANGUAGEVALUES_GO, TMP_TELEMETRYSDKLANGUAGEVALUES_JAVA, TMP_TELEMETRYSDKLANGUAGEVALUES_NODEJS, TMP_TELEMETRYSDKLANGUAGEVALUES_PHP, TMP_TELEMETRYSDKLANGUAGEVALUES_PYTHON, TMP_TELEMETRYSDKLANGUAGEVALUES_RUBY, TMP_TELEMETRYSDKLANGUAGEVALUES_WEBJS, TELEMETRYSDKLANGUAGEVALUES_DOTNET, TELEMETRYSDKLANGUAGEVALUES_ERLANG, TELEMETRYSDKLANGUAGEVALUES_JAVA, TELEMETRYSDKLANGUAGEVALUES_NODEJS, TELEMETRYSDKLANGUAGEVALUES_PYTHON, TELEMETRYSDKLANGUAGEVALUES_RUBY, TELEMETRYSDKLANGUAGEVALUES_WEBJS, TelemetrySdkLanguageValues;
var init_SemanticResourceAttributes = __esmMin((() => {
	init_utils();
	TMP_CLOUD_PROVIDER = "cloud.provider";
	TMP_CLOUD_ACCOUNT_ID = "cloud.account.id";
	TMP_CLOUD_REGION = "cloud.region";
	TMP_CLOUD_AVAILABILITY_ZONE = "cloud.availability_zone";
	TMP_CLOUD_PLATFORM = "cloud.platform";
	TMP_AWS_ECS_CONTAINER_ARN = "aws.ecs.container.arn";
	TMP_AWS_ECS_CLUSTER_ARN = "aws.ecs.cluster.arn";
	TMP_AWS_ECS_LAUNCHTYPE = "aws.ecs.launchtype";
	TMP_AWS_ECS_TASK_ARN = "aws.ecs.task.arn";
	TMP_AWS_ECS_TASK_FAMILY = "aws.ecs.task.family";
	TMP_AWS_ECS_TASK_REVISION = "aws.ecs.task.revision";
	TMP_AWS_EKS_CLUSTER_ARN = "aws.eks.cluster.arn";
	TMP_AWS_LOG_GROUP_NAMES = "aws.log.group.names";
	TMP_AWS_LOG_GROUP_ARNS = "aws.log.group.arns";
	TMP_AWS_LOG_STREAM_NAMES = "aws.log.stream.names";
	TMP_AWS_LOG_STREAM_ARNS = "aws.log.stream.arns";
	TMP_CONTAINER_NAME = "container.name";
	TMP_CONTAINER_ID = "container.id";
	TMP_CONTAINER_RUNTIME = "container.runtime";
	TMP_CONTAINER_IMAGE_NAME = "container.image.name";
	TMP_CONTAINER_IMAGE_TAG = "container.image.tag";
	TMP_DEPLOYMENT_ENVIRONMENT = "deployment.environment";
	TMP_DEVICE_ID = "device.id";
	TMP_DEVICE_MODEL_IDENTIFIER = "device.model.identifier";
	TMP_DEVICE_MODEL_NAME = "device.model.name";
	TMP_FAAS_NAME = "faas.name";
	TMP_FAAS_ID = "faas.id";
	TMP_FAAS_VERSION = "faas.version";
	TMP_FAAS_INSTANCE = "faas.instance";
	TMP_FAAS_MAX_MEMORY = "faas.max_memory";
	TMP_HOST_ID = "host.id";
	TMP_HOST_NAME = "host.name";
	TMP_HOST_TYPE = "host.type";
	TMP_HOST_ARCH = "host.arch";
	TMP_HOST_IMAGE_NAME = "host.image.name";
	TMP_HOST_IMAGE_ID = "host.image.id";
	TMP_HOST_IMAGE_VERSION = "host.image.version";
	TMP_K8S_CLUSTER_NAME = "k8s.cluster.name";
	TMP_K8S_NODE_NAME = "k8s.node.name";
	TMP_K8S_NODE_UID = "k8s.node.uid";
	TMP_K8S_NAMESPACE_NAME = "k8s.namespace.name";
	TMP_K8S_POD_UID = "k8s.pod.uid";
	TMP_K8S_POD_NAME = "k8s.pod.name";
	TMP_K8S_CONTAINER_NAME = "k8s.container.name";
	TMP_K8S_REPLICASET_UID = "k8s.replicaset.uid";
	TMP_K8S_REPLICASET_NAME = "k8s.replicaset.name";
	TMP_K8S_DEPLOYMENT_UID = "k8s.deployment.uid";
	TMP_K8S_DEPLOYMENT_NAME = "k8s.deployment.name";
	TMP_K8S_STATEFULSET_UID = "k8s.statefulset.uid";
	TMP_K8S_STATEFULSET_NAME = "k8s.statefulset.name";
	TMP_K8S_DAEMONSET_UID = "k8s.daemonset.uid";
	TMP_K8S_DAEMONSET_NAME = "k8s.daemonset.name";
	TMP_K8S_JOB_UID = "k8s.job.uid";
	TMP_K8S_JOB_NAME = "k8s.job.name";
	TMP_K8S_CRONJOB_UID = "k8s.cronjob.uid";
	TMP_K8S_CRONJOB_NAME = "k8s.cronjob.name";
	TMP_OS_TYPE = "os.type";
	TMP_OS_DESCRIPTION = "os.description";
	TMP_OS_NAME = "os.name";
	TMP_OS_VERSION = "os.version";
	TMP_PROCESS_PID = "process.pid";
	TMP_PROCESS_EXECUTABLE_NAME = "process.executable.name";
	TMP_PROCESS_EXECUTABLE_PATH = "process.executable.path";
	TMP_PROCESS_COMMAND = "process.command";
	TMP_PROCESS_COMMAND_LINE = "process.command_line";
	TMP_PROCESS_COMMAND_ARGS = "process.command_args";
	TMP_PROCESS_OWNER = "process.owner";
	TMP_PROCESS_RUNTIME_NAME = "process.runtime.name";
	TMP_PROCESS_RUNTIME_VERSION = "process.runtime.version";
	TMP_PROCESS_RUNTIME_DESCRIPTION = "process.runtime.description";
	TMP_SERVICE_NAME = "service.name";
	TMP_SERVICE_NAMESPACE = "service.namespace";
	TMP_SERVICE_INSTANCE_ID = "service.instance.id";
	TMP_SERVICE_VERSION = "service.version";
	TMP_TELEMETRY_SDK_NAME = "telemetry.sdk.name";
	TMP_TELEMETRY_SDK_LANGUAGE = "telemetry.sdk.language";
	TMP_TELEMETRY_SDK_VERSION = "telemetry.sdk.version";
	TMP_TELEMETRY_AUTO_VERSION = "telemetry.auto.version";
	TMP_WEBENGINE_NAME = "webengine.name";
	TMP_WEBENGINE_VERSION = "webengine.version";
	TMP_WEBENGINE_DESCRIPTION = "webengine.description";
	SEMRESATTRS_CLOUD_PROVIDER = TMP_CLOUD_PROVIDER;
	SEMRESATTRS_CLOUD_ACCOUNT_ID = TMP_CLOUD_ACCOUNT_ID;
	SEMRESATTRS_CLOUD_REGION = TMP_CLOUD_REGION;
	SEMRESATTRS_CLOUD_AVAILABILITY_ZONE = TMP_CLOUD_AVAILABILITY_ZONE;
	SEMRESATTRS_CLOUD_PLATFORM = TMP_CLOUD_PLATFORM;
	SEMRESATTRS_AWS_ECS_CONTAINER_ARN = TMP_AWS_ECS_CONTAINER_ARN;
	SEMRESATTRS_AWS_ECS_CLUSTER_ARN = TMP_AWS_ECS_CLUSTER_ARN;
	SEMRESATTRS_AWS_ECS_LAUNCHTYPE = TMP_AWS_ECS_LAUNCHTYPE;
	SEMRESATTRS_AWS_ECS_TASK_ARN = TMP_AWS_ECS_TASK_ARN;
	SEMRESATTRS_AWS_ECS_TASK_FAMILY = TMP_AWS_ECS_TASK_FAMILY;
	SEMRESATTRS_AWS_ECS_TASK_REVISION = TMP_AWS_ECS_TASK_REVISION;
	SEMRESATTRS_AWS_EKS_CLUSTER_ARN = TMP_AWS_EKS_CLUSTER_ARN;
	SEMRESATTRS_AWS_LOG_GROUP_NAMES = TMP_AWS_LOG_GROUP_NAMES;
	SEMRESATTRS_AWS_LOG_GROUP_ARNS = TMP_AWS_LOG_GROUP_ARNS;
	SEMRESATTRS_AWS_LOG_STREAM_NAMES = TMP_AWS_LOG_STREAM_NAMES;
	SEMRESATTRS_AWS_LOG_STREAM_ARNS = TMP_AWS_LOG_STREAM_ARNS;
	SEMRESATTRS_CONTAINER_NAME = TMP_CONTAINER_NAME;
	SEMRESATTRS_CONTAINER_ID = TMP_CONTAINER_ID;
	SEMRESATTRS_CONTAINER_RUNTIME = TMP_CONTAINER_RUNTIME;
	SEMRESATTRS_CONTAINER_IMAGE_NAME = TMP_CONTAINER_IMAGE_NAME;
	SEMRESATTRS_CONTAINER_IMAGE_TAG = TMP_CONTAINER_IMAGE_TAG;
	SEMRESATTRS_DEPLOYMENT_ENVIRONMENT = TMP_DEPLOYMENT_ENVIRONMENT;
	SEMRESATTRS_DEVICE_ID = TMP_DEVICE_ID;
	SEMRESATTRS_DEVICE_MODEL_IDENTIFIER = TMP_DEVICE_MODEL_IDENTIFIER;
	SEMRESATTRS_DEVICE_MODEL_NAME = TMP_DEVICE_MODEL_NAME;
	SEMRESATTRS_FAAS_NAME = TMP_FAAS_NAME;
	SEMRESATTRS_FAAS_ID = TMP_FAAS_ID;
	SEMRESATTRS_FAAS_VERSION = TMP_FAAS_VERSION;
	SEMRESATTRS_FAAS_INSTANCE = TMP_FAAS_INSTANCE;
	SEMRESATTRS_FAAS_MAX_MEMORY = TMP_FAAS_MAX_MEMORY;
	SEMRESATTRS_HOST_ID = TMP_HOST_ID;
	SEMRESATTRS_HOST_NAME = TMP_HOST_NAME;
	SEMRESATTRS_HOST_TYPE = TMP_HOST_TYPE;
	SEMRESATTRS_HOST_ARCH = TMP_HOST_ARCH;
	SEMRESATTRS_HOST_IMAGE_NAME = TMP_HOST_IMAGE_NAME;
	SEMRESATTRS_HOST_IMAGE_ID = TMP_HOST_IMAGE_ID;
	SEMRESATTRS_HOST_IMAGE_VERSION = TMP_HOST_IMAGE_VERSION;
	SEMRESATTRS_K8S_CLUSTER_NAME = TMP_K8S_CLUSTER_NAME;
	SEMRESATTRS_K8S_NODE_NAME = TMP_K8S_NODE_NAME;
	SEMRESATTRS_K8S_NODE_UID = TMP_K8S_NODE_UID;
	SEMRESATTRS_K8S_NAMESPACE_NAME = TMP_K8S_NAMESPACE_NAME;
	SEMRESATTRS_K8S_POD_UID = TMP_K8S_POD_UID;
	SEMRESATTRS_K8S_POD_NAME = TMP_K8S_POD_NAME;
	SEMRESATTRS_K8S_CONTAINER_NAME = TMP_K8S_CONTAINER_NAME;
	SEMRESATTRS_K8S_REPLICASET_UID = TMP_K8S_REPLICASET_UID;
	SEMRESATTRS_K8S_REPLICASET_NAME = TMP_K8S_REPLICASET_NAME;
	SEMRESATTRS_K8S_DEPLOYMENT_UID = TMP_K8S_DEPLOYMENT_UID;
	SEMRESATTRS_K8S_DEPLOYMENT_NAME = TMP_K8S_DEPLOYMENT_NAME;
	SEMRESATTRS_K8S_STATEFULSET_UID = TMP_K8S_STATEFULSET_UID;
	SEMRESATTRS_K8S_STATEFULSET_NAME = TMP_K8S_STATEFULSET_NAME;
	SEMRESATTRS_K8S_DAEMONSET_UID = TMP_K8S_DAEMONSET_UID;
	SEMRESATTRS_K8S_DAEMONSET_NAME = TMP_K8S_DAEMONSET_NAME;
	SEMRESATTRS_K8S_JOB_UID = TMP_K8S_JOB_UID;
	SEMRESATTRS_K8S_JOB_NAME = TMP_K8S_JOB_NAME;
	SEMRESATTRS_K8S_CRONJOB_UID = TMP_K8S_CRONJOB_UID;
	SEMRESATTRS_K8S_CRONJOB_NAME = TMP_K8S_CRONJOB_NAME;
	SEMRESATTRS_OS_TYPE = TMP_OS_TYPE;
	SEMRESATTRS_OS_DESCRIPTION = TMP_OS_DESCRIPTION;
	SEMRESATTRS_OS_NAME = TMP_OS_NAME;
	SEMRESATTRS_OS_VERSION = TMP_OS_VERSION;
	SEMRESATTRS_PROCESS_PID = TMP_PROCESS_PID;
	SEMRESATTRS_PROCESS_EXECUTABLE_NAME = TMP_PROCESS_EXECUTABLE_NAME;
	SEMRESATTRS_PROCESS_EXECUTABLE_PATH = TMP_PROCESS_EXECUTABLE_PATH;
	SEMRESATTRS_PROCESS_COMMAND = TMP_PROCESS_COMMAND;
	SEMRESATTRS_PROCESS_COMMAND_LINE = TMP_PROCESS_COMMAND_LINE;
	SEMRESATTRS_PROCESS_COMMAND_ARGS = TMP_PROCESS_COMMAND_ARGS;
	SEMRESATTRS_PROCESS_OWNER = TMP_PROCESS_OWNER;
	SEMRESATTRS_PROCESS_RUNTIME_NAME = TMP_PROCESS_RUNTIME_NAME;
	SEMRESATTRS_PROCESS_RUNTIME_VERSION = TMP_PROCESS_RUNTIME_VERSION;
	SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION = TMP_PROCESS_RUNTIME_DESCRIPTION;
	SEMRESATTRS_SERVICE_NAME = TMP_SERVICE_NAME;
	SEMRESATTRS_SERVICE_NAMESPACE = TMP_SERVICE_NAMESPACE;
	SEMRESATTRS_SERVICE_INSTANCE_ID = TMP_SERVICE_INSTANCE_ID;
	SEMRESATTRS_SERVICE_VERSION = TMP_SERVICE_VERSION;
	SEMRESATTRS_TELEMETRY_SDK_NAME = TMP_TELEMETRY_SDK_NAME;
	SEMRESATTRS_TELEMETRY_SDK_LANGUAGE = TMP_TELEMETRY_SDK_LANGUAGE;
	SEMRESATTRS_TELEMETRY_SDK_VERSION = TMP_TELEMETRY_SDK_VERSION;
	SEMRESATTRS_TELEMETRY_AUTO_VERSION = TMP_TELEMETRY_AUTO_VERSION;
	SEMRESATTRS_WEBENGINE_NAME = TMP_WEBENGINE_NAME;
	SEMRESATTRS_WEBENGINE_VERSION = TMP_WEBENGINE_VERSION;
	SEMRESATTRS_WEBENGINE_DESCRIPTION = TMP_WEBENGINE_DESCRIPTION;
	SemanticResourceAttributes = /*#__PURE__*/ createConstMap([
		TMP_CLOUD_PROVIDER,
		TMP_CLOUD_ACCOUNT_ID,
		TMP_CLOUD_REGION,
		TMP_CLOUD_AVAILABILITY_ZONE,
		TMP_CLOUD_PLATFORM,
		TMP_AWS_ECS_CONTAINER_ARN,
		TMP_AWS_ECS_CLUSTER_ARN,
		TMP_AWS_ECS_LAUNCHTYPE,
		TMP_AWS_ECS_TASK_ARN,
		TMP_AWS_ECS_TASK_FAMILY,
		TMP_AWS_ECS_TASK_REVISION,
		TMP_AWS_EKS_CLUSTER_ARN,
		TMP_AWS_LOG_GROUP_NAMES,
		TMP_AWS_LOG_GROUP_ARNS,
		TMP_AWS_LOG_STREAM_NAMES,
		TMP_AWS_LOG_STREAM_ARNS,
		TMP_CONTAINER_NAME,
		TMP_CONTAINER_ID,
		TMP_CONTAINER_RUNTIME,
		TMP_CONTAINER_IMAGE_NAME,
		TMP_CONTAINER_IMAGE_TAG,
		TMP_DEPLOYMENT_ENVIRONMENT,
		TMP_DEVICE_ID,
		TMP_DEVICE_MODEL_IDENTIFIER,
		TMP_DEVICE_MODEL_NAME,
		TMP_FAAS_NAME,
		TMP_FAAS_ID,
		TMP_FAAS_VERSION,
		TMP_FAAS_INSTANCE,
		TMP_FAAS_MAX_MEMORY,
		TMP_HOST_ID,
		TMP_HOST_NAME,
		TMP_HOST_TYPE,
		TMP_HOST_ARCH,
		TMP_HOST_IMAGE_NAME,
		TMP_HOST_IMAGE_ID,
		TMP_HOST_IMAGE_VERSION,
		TMP_K8S_CLUSTER_NAME,
		TMP_K8S_NODE_NAME,
		TMP_K8S_NODE_UID,
		TMP_K8S_NAMESPACE_NAME,
		TMP_K8S_POD_UID,
		TMP_K8S_POD_NAME,
		TMP_K8S_CONTAINER_NAME,
		TMP_K8S_REPLICASET_UID,
		TMP_K8S_REPLICASET_NAME,
		TMP_K8S_DEPLOYMENT_UID,
		TMP_K8S_DEPLOYMENT_NAME,
		TMP_K8S_STATEFULSET_UID,
		TMP_K8S_STATEFULSET_NAME,
		TMP_K8S_DAEMONSET_UID,
		TMP_K8S_DAEMONSET_NAME,
		TMP_K8S_JOB_UID,
		TMP_K8S_JOB_NAME,
		TMP_K8S_CRONJOB_UID,
		TMP_K8S_CRONJOB_NAME,
		TMP_OS_TYPE,
		TMP_OS_DESCRIPTION,
		TMP_OS_NAME,
		TMP_OS_VERSION,
		TMP_PROCESS_PID,
		TMP_PROCESS_EXECUTABLE_NAME,
		TMP_PROCESS_EXECUTABLE_PATH,
		TMP_PROCESS_COMMAND,
		TMP_PROCESS_COMMAND_LINE,
		TMP_PROCESS_COMMAND_ARGS,
		TMP_PROCESS_OWNER,
		TMP_PROCESS_RUNTIME_NAME,
		TMP_PROCESS_RUNTIME_VERSION,
		TMP_PROCESS_RUNTIME_DESCRIPTION,
		TMP_SERVICE_NAME,
		TMP_SERVICE_NAMESPACE,
		TMP_SERVICE_INSTANCE_ID,
		TMP_SERVICE_VERSION,
		TMP_TELEMETRY_SDK_NAME,
		TMP_TELEMETRY_SDK_LANGUAGE,
		TMP_TELEMETRY_SDK_VERSION,
		TMP_TELEMETRY_AUTO_VERSION,
		TMP_WEBENGINE_NAME,
		TMP_WEBENGINE_VERSION,
		TMP_WEBENGINE_DESCRIPTION
	]);
	TMP_CLOUDPROVIDERVALUES_ALIBABA_CLOUD = "alibaba_cloud";
	TMP_CLOUDPROVIDERVALUES_AWS = "aws";
	TMP_CLOUDPROVIDERVALUES_AZURE = "azure";
	TMP_CLOUDPROVIDERVALUES_GCP = "gcp";
	CLOUDPROVIDERVALUES_ALIBABA_CLOUD = TMP_CLOUDPROVIDERVALUES_ALIBABA_CLOUD;
	CLOUDPROVIDERVALUES_AZURE = TMP_CLOUDPROVIDERVALUES_AZURE;
	CloudProviderValues = /*#__PURE__*/ createConstMap([
		TMP_CLOUDPROVIDERVALUES_ALIBABA_CLOUD,
		TMP_CLOUDPROVIDERVALUES_AWS,
		TMP_CLOUDPROVIDERVALUES_AZURE,
		TMP_CLOUDPROVIDERVALUES_GCP
	]);
	TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS = "alibaba_cloud_ecs";
	TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC = "alibaba_cloud_fc";
	TMP_CLOUDPLATFORMVALUES_AWS_EC2 = "aws_ec2";
	TMP_CLOUDPLATFORMVALUES_AWS_ECS = "aws_ecs";
	TMP_CLOUDPLATFORMVALUES_AWS_EKS = "aws_eks";
	TMP_CLOUDPLATFORMVALUES_AWS_LAMBDA = "aws_lambda";
	TMP_CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK = "aws_elastic_beanstalk";
	TMP_CLOUDPLATFORMVALUES_AZURE_VM = "azure_vm";
	TMP_CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES = "azure_container_instances";
	TMP_CLOUDPLATFORMVALUES_AZURE_AKS = "azure_aks";
	TMP_CLOUDPLATFORMVALUES_AZURE_FUNCTIONS = "azure_functions";
	TMP_CLOUDPLATFORMVALUES_AZURE_APP_SERVICE = "azure_app_service";
	TMP_CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE = "gcp_compute_engine";
	TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_RUN = "gcp_cloud_run";
	TMP_CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE = "gcp_kubernetes_engine";
	TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS = "gcp_cloud_functions";
	TMP_CLOUDPLATFORMVALUES_GCP_APP_ENGINE = "gcp_app_engine";
	CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS = TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS;
	CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC = TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC;
	CLOUDPLATFORMVALUES_AWS_EC2 = TMP_CLOUDPLATFORMVALUES_AWS_EC2;
	CLOUDPLATFORMVALUES_AWS_ECS = TMP_CLOUDPLATFORMVALUES_AWS_ECS;
	CLOUDPLATFORMVALUES_AWS_EKS = TMP_CLOUDPLATFORMVALUES_AWS_EKS;
	CLOUDPLATFORMVALUES_AWS_LAMBDA = TMP_CLOUDPLATFORMVALUES_AWS_LAMBDA;
	CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK = TMP_CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK;
	CLOUDPLATFORMVALUES_AZURE_VM = TMP_CLOUDPLATFORMVALUES_AZURE_VM;
	CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES = TMP_CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES;
	CLOUDPLATFORMVALUES_AZURE_AKS = TMP_CLOUDPLATFORMVALUES_AZURE_AKS;
	CLOUDPLATFORMVALUES_AZURE_FUNCTIONS = TMP_CLOUDPLATFORMVALUES_AZURE_FUNCTIONS;
	CLOUDPLATFORMVALUES_AZURE_APP_SERVICE = TMP_CLOUDPLATFORMVALUES_AZURE_APP_SERVICE;
	CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE = TMP_CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE;
	CLOUDPLATFORMVALUES_GCP_CLOUD_RUN = TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_RUN;
	CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE = TMP_CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE;
	CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS = TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS;
	CLOUDPLATFORMVALUES_GCP_APP_ENGINE = TMP_CLOUDPLATFORMVALUES_GCP_APP_ENGINE;
	CloudPlatformValues = /*#__PURE__*/ createConstMap([
		TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS,
		TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC,
		TMP_CLOUDPLATFORMVALUES_AWS_EC2,
		TMP_CLOUDPLATFORMVALUES_AWS_ECS,
		TMP_CLOUDPLATFORMVALUES_AWS_EKS,
		TMP_CLOUDPLATFORMVALUES_AWS_LAMBDA,
		TMP_CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK,
		TMP_CLOUDPLATFORMVALUES_AZURE_VM,
		TMP_CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES,
		TMP_CLOUDPLATFORMVALUES_AZURE_AKS,
		TMP_CLOUDPLATFORMVALUES_AZURE_FUNCTIONS,
		TMP_CLOUDPLATFORMVALUES_AZURE_APP_SERVICE,
		TMP_CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE,
		TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_RUN,
		TMP_CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE,
		TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS,
		TMP_CLOUDPLATFORMVALUES_GCP_APP_ENGINE
	]);
	TMP_AWSECSLAUNCHTYPEVALUES_EC2 = "ec2";
	TMP_AWSECSLAUNCHTYPEVALUES_FARGATE = "fargate";
	AWSECSLAUNCHTYPEVALUES_FARGATE = TMP_AWSECSLAUNCHTYPEVALUES_FARGATE;
	AwsEcsLaunchtypeValues = /*#__PURE__*/ createConstMap([TMP_AWSECSLAUNCHTYPEVALUES_EC2, TMP_AWSECSLAUNCHTYPEVALUES_FARGATE]);
	TMP_HOSTARCHVALUES_AMD64 = "amd64";
	TMP_HOSTARCHVALUES_ARM32 = "arm32";
	TMP_HOSTARCHVALUES_ARM64 = "arm64";
	TMP_HOSTARCHVALUES_IA64 = "ia64";
	TMP_HOSTARCHVALUES_PPC32 = "ppc32";
	TMP_HOSTARCHVALUES_PPC64 = "ppc64";
	TMP_HOSTARCHVALUES_X86 = "x86";
	HOSTARCHVALUES_AMD64 = TMP_HOSTARCHVALUES_AMD64;
	HOSTARCHVALUES_ARM32 = TMP_HOSTARCHVALUES_ARM32;
	HOSTARCHVALUES_ARM64 = TMP_HOSTARCHVALUES_ARM64;
	HOSTARCHVALUES_IA64 = TMP_HOSTARCHVALUES_IA64;
	HOSTARCHVALUES_PPC32 = TMP_HOSTARCHVALUES_PPC32;
	HOSTARCHVALUES_PPC64 = TMP_HOSTARCHVALUES_PPC64;
	HostArchValues = /*#__PURE__*/ createConstMap([
		TMP_HOSTARCHVALUES_AMD64,
		TMP_HOSTARCHVALUES_ARM32,
		TMP_HOSTARCHVALUES_ARM64,
		TMP_HOSTARCHVALUES_IA64,
		TMP_HOSTARCHVALUES_PPC32,
		TMP_HOSTARCHVALUES_PPC64,
		TMP_HOSTARCHVALUES_X86
	]);
	TMP_OSTYPEVALUES_WINDOWS = "windows";
	TMP_OSTYPEVALUES_LINUX = "linux";
	TMP_OSTYPEVALUES_DARWIN = "darwin";
	TMP_OSTYPEVALUES_FREEBSD = "freebsd";
	TMP_OSTYPEVALUES_NETBSD = "netbsd";
	TMP_OSTYPEVALUES_OPENBSD = "openbsd";
	TMP_OSTYPEVALUES_DRAGONFLYBSD = "dragonflybsd";
	TMP_OSTYPEVALUES_HPUX = "hpux";
	TMP_OSTYPEVALUES_AIX = "aix";
	TMP_OSTYPEVALUES_SOLARIS = "solaris";
	TMP_OSTYPEVALUES_Z_OS = "z_os";
	OSTYPEVALUES_WINDOWS = TMP_OSTYPEVALUES_WINDOWS;
	OSTYPEVALUES_LINUX = TMP_OSTYPEVALUES_LINUX;
	OSTYPEVALUES_DARWIN = TMP_OSTYPEVALUES_DARWIN;
	OSTYPEVALUES_FREEBSD = TMP_OSTYPEVALUES_FREEBSD;
	OSTYPEVALUES_NETBSD = TMP_OSTYPEVALUES_NETBSD;
	OSTYPEVALUES_OPENBSD = TMP_OSTYPEVALUES_OPENBSD;
	OSTYPEVALUES_DRAGONFLYBSD = TMP_OSTYPEVALUES_DRAGONFLYBSD;
	OSTYPEVALUES_HPUX = TMP_OSTYPEVALUES_HPUX;
	OSTYPEVALUES_SOLARIS = TMP_OSTYPEVALUES_SOLARIS;
	OSTYPEVALUES_Z_OS = TMP_OSTYPEVALUES_Z_OS;
	OsTypeValues = /*#__PURE__*/ createConstMap([
		TMP_OSTYPEVALUES_WINDOWS,
		TMP_OSTYPEVALUES_LINUX,
		TMP_OSTYPEVALUES_DARWIN,
		TMP_OSTYPEVALUES_FREEBSD,
		TMP_OSTYPEVALUES_NETBSD,
		TMP_OSTYPEVALUES_OPENBSD,
		TMP_OSTYPEVALUES_DRAGONFLYBSD,
		TMP_OSTYPEVALUES_HPUX,
		TMP_OSTYPEVALUES_AIX,
		TMP_OSTYPEVALUES_SOLARIS,
		TMP_OSTYPEVALUES_Z_OS
	]);
	TMP_TELEMETRYSDKLANGUAGEVALUES_CPP = "cpp";
	TMP_TELEMETRYSDKLANGUAGEVALUES_DOTNET = "dotnet";
	TMP_TELEMETRYSDKLANGUAGEVALUES_ERLANG = "erlang";
	TMP_TELEMETRYSDKLANGUAGEVALUES_GO = "go";
	TMP_TELEMETRYSDKLANGUAGEVALUES_JAVA = "java";
	TMP_TELEMETRYSDKLANGUAGEVALUES_NODEJS = "nodejs";
	TMP_TELEMETRYSDKLANGUAGEVALUES_PHP = "php";
	TMP_TELEMETRYSDKLANGUAGEVALUES_PYTHON = "python";
	TMP_TELEMETRYSDKLANGUAGEVALUES_RUBY = "ruby";
	TMP_TELEMETRYSDKLANGUAGEVALUES_WEBJS = "webjs";
	TELEMETRYSDKLANGUAGEVALUES_DOTNET = TMP_TELEMETRYSDKLANGUAGEVALUES_DOTNET;
	TELEMETRYSDKLANGUAGEVALUES_ERLANG = TMP_TELEMETRYSDKLANGUAGEVALUES_ERLANG;
	TELEMETRYSDKLANGUAGEVALUES_JAVA = TMP_TELEMETRYSDKLANGUAGEVALUES_JAVA;
	TELEMETRYSDKLANGUAGEVALUES_NODEJS = TMP_TELEMETRYSDKLANGUAGEVALUES_NODEJS;
	TELEMETRYSDKLANGUAGEVALUES_PYTHON = TMP_TELEMETRYSDKLANGUAGEVALUES_PYTHON;
	TELEMETRYSDKLANGUAGEVALUES_RUBY = TMP_TELEMETRYSDKLANGUAGEVALUES_RUBY;
	TELEMETRYSDKLANGUAGEVALUES_WEBJS = TMP_TELEMETRYSDKLANGUAGEVALUES_WEBJS;
	TelemetrySdkLanguageValues = /*#__PURE__*/ createConstMap([
		TMP_TELEMETRYSDKLANGUAGEVALUES_CPP,
		TMP_TELEMETRYSDKLANGUAGEVALUES_DOTNET,
		TMP_TELEMETRYSDKLANGUAGEVALUES_ERLANG,
		TMP_TELEMETRYSDKLANGUAGEVALUES_GO,
		TMP_TELEMETRYSDKLANGUAGEVALUES_JAVA,
		TMP_TELEMETRYSDKLANGUAGEVALUES_NODEJS,
		TMP_TELEMETRYSDKLANGUAGEVALUES_PHP,
		TMP_TELEMETRYSDKLANGUAGEVALUES_PYTHON,
		TMP_TELEMETRYSDKLANGUAGEVALUES_RUBY,
		TMP_TELEMETRYSDKLANGUAGEVALUES_WEBJS
	]);
}));
//#endregion
//#region node_modules/@opentelemetry/semantic-conventions/build/esm/resource/index.js
var init_resource = __esmMin((() => {
	init_SemanticResourceAttributes();
})), ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT, ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_ABORTED, ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_HANDLED, ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_SKIPPED, ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_UNHANDLED, ATTR_ASPNETCORE_DIAGNOSTICS_HANDLER_TYPE, ATTR_ASPNETCORE_RATE_LIMITING_POLICY, ATTR_ASPNETCORE_RATE_LIMITING_RESULT, ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ACQUIRED, ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ENDPOINT_LIMITER, ASPNETCORE_RATE_LIMITING_RESULT_VALUE_GLOBAL_LIMITER, ASPNETCORE_RATE_LIMITING_RESULT_VALUE_REQUEST_CANCELED, ATTR_ASPNETCORE_REQUEST_IS_UNHANDLED, ATTR_ASPNETCORE_ROUTING_IS_FALLBACK, ATTR_ASPNETCORE_ROUTING_MATCH_STATUS, ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_FAILURE, ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_SUCCESS, ATTR_ASPNETCORE_USER_IS_AUTHENTICATED, ATTR_CLIENT_ADDRESS, ATTR_CLIENT_PORT, ATTR_CODE_COLUMN_NUMBER, ATTR_CODE_FILE_PATH, ATTR_CODE_FUNCTION_NAME, ATTR_CODE_LINE_NUMBER, ATTR_CODE_STACKTRACE, ATTR_CONTAINER_ID, ATTR_CONTAINER_IMAGE_NAME, ATTR_CONTAINER_IMAGE_REPO_DIGESTS, ATTR_CONTAINER_IMAGE_TAGS, ATTR_DB_COLLECTION_NAME, ATTR_DB_NAMESPACE, ATTR_DB_OPERATION_BATCH_SIZE, ATTR_DB_OPERATION_NAME, ATTR_DB_QUERY_SUMMARY, ATTR_DB_QUERY_TEXT, ATTR_DB_RESPONSE_STATUS_CODE, ATTR_DB_STORED_PROCEDURE_NAME, ATTR_DB_SYSTEM_NAME, DB_SYSTEM_NAME_VALUE_MARIADB, DB_SYSTEM_NAME_VALUE_MICROSOFT_SQL_SERVER, DB_SYSTEM_NAME_VALUE_MYSQL, DB_SYSTEM_NAME_VALUE_POSTGRESQL, ATTR_DEPLOYMENT_ENVIRONMENT_NAME, DEPLOYMENT_ENVIRONMENT_NAME_VALUE_DEVELOPMENT, DEPLOYMENT_ENVIRONMENT_NAME_VALUE_PRODUCTION, DEPLOYMENT_ENVIRONMENT_NAME_VALUE_STAGING, DEPLOYMENT_ENVIRONMENT_NAME_VALUE_TEST, ATTR_DOTNET_GC_HEAP_GENERATION, DOTNET_GC_HEAP_GENERATION_VALUE_GEN0, DOTNET_GC_HEAP_GENERATION_VALUE_GEN1, DOTNET_GC_HEAP_GENERATION_VALUE_GEN2, ATTR_ERROR_TYPE$1, ERROR_TYPE_VALUE_OTHER, ATTR_EXCEPTION_ESCAPED, ATTR_EXCEPTION_MESSAGE, ATTR_EXCEPTION_STACKTRACE, ATTR_EXCEPTION_TYPE, ATTR_HTTP_REQUEST_HEADER, ATTR_HTTP_REQUEST_METHOD, HTTP_REQUEST_METHOD_VALUE_OTHER, HTTP_REQUEST_METHOD_VALUE_CONNECT, HTTP_REQUEST_METHOD_VALUE_DELETE, HTTP_REQUEST_METHOD_VALUE_HEAD, HTTP_REQUEST_METHOD_VALUE_OPTIONS, HTTP_REQUEST_METHOD_VALUE_PATCH, HTTP_REQUEST_METHOD_VALUE_POST, HTTP_REQUEST_METHOD_VALUE_TRACE, ATTR_HTTP_REQUEST_METHOD_ORIGINAL, ATTR_HTTP_REQUEST_RESEND_COUNT, ATTR_HTTP_RESPONSE_HEADER, ATTR_HTTP_RESPONSE_STATUS_CODE$1, ATTR_HTTP_ROUTE, ATTR_JVM_GC_ACTION, ATTR_JVM_GC_NAME, ATTR_JVM_MEMORY_POOL_NAME, ATTR_JVM_MEMORY_TYPE, JVM_MEMORY_TYPE_VALUE_HEAP, JVM_MEMORY_TYPE_VALUE_NON_HEAP, ATTR_JVM_THREAD_DAEMON, ATTR_JVM_THREAD_STATE, JVM_THREAD_STATE_VALUE_BLOCKED, JVM_THREAD_STATE_VALUE_RUNNABLE, JVM_THREAD_STATE_VALUE_TERMINATED, JVM_THREAD_STATE_VALUE_TIMED_WAITING, JVM_THREAD_STATE_VALUE_WAITING, ATTR_K8S_CLUSTER_NAME, ATTR_K8S_CLUSTER_UID, ATTR_K8S_CONTAINER_NAME, ATTR_K8S_CONTAINER_RESTART_COUNT, ATTR_K8S_CRONJOB_ANNOTATION, ATTR_K8S_CRONJOB_LABEL, ATTR_K8S_CRONJOB_NAME, ATTR_K8S_CRONJOB_UID, ATTR_K8S_DAEMONSET_ANNOTATION, ATTR_K8S_DAEMONSET_LABEL, ATTR_K8S_DAEMONSET_NAME, ATTR_K8S_DAEMONSET_UID, ATTR_K8S_DEPLOYMENT_ANNOTATION, ATTR_K8S_DEPLOYMENT_LABEL, ATTR_K8S_DEPLOYMENT_NAME, ATTR_K8S_DEPLOYMENT_UID, ATTR_K8S_JOB_ANNOTATION, ATTR_K8S_JOB_LABEL, ATTR_K8S_JOB_NAME, ATTR_K8S_JOB_UID, ATTR_K8S_NAMESPACE_ANNOTATION, ATTR_K8S_NAMESPACE_LABEL, ATTR_K8S_NAMESPACE_NAME, ATTR_K8S_NODE_ANNOTATION, ATTR_K8S_NODE_LABEL, ATTR_K8S_NODE_NAME, ATTR_K8S_NODE_UID, ATTR_K8S_POD_ANNOTATION, ATTR_K8S_POD_HOSTNAME, ATTR_K8S_POD_IP, ATTR_K8S_POD_LABEL, ATTR_K8S_POD_NAME, ATTR_K8S_POD_START_TIME, ATTR_K8S_POD_UID, ATTR_K8S_REPLICASET_ANNOTATION, ATTR_K8S_REPLICASET_LABEL, ATTR_K8S_REPLICASET_NAME, ATTR_K8S_REPLICASET_UID, ATTR_K8S_STATEFULSET_ANNOTATION, ATTR_K8S_STATEFULSET_LABEL, ATTR_K8S_STATEFULSET_NAME, ATTR_K8S_STATEFULSET_UID, ATTR_NETWORK_LOCAL_ADDRESS, ATTR_NETWORK_LOCAL_PORT, ATTR_NETWORK_PEER_ADDRESS, ATTR_NETWORK_PEER_PORT, ATTR_NETWORK_PROTOCOL_NAME, ATTR_NETWORK_PROTOCOL_VERSION, ATTR_NETWORK_TRANSPORT, NETWORK_TRANSPORT_VALUE_PIPE, NETWORK_TRANSPORT_VALUE_QUIC, NETWORK_TRANSPORT_VALUE_UNIX, ATTR_NETWORK_TYPE, NETWORK_TYPE_VALUE_IPV4, NETWORK_TYPE_VALUE_IPV6, ATTR_OTEL_EVENT_NAME, ATTR_OTEL_SCOPE_NAME, ATTR_OTEL_SCOPE_VERSION, ATTR_OTEL_STATUS_CODE, OTEL_STATUS_CODE_VALUE_ERROR, ATTR_OTEL_STATUS_DESCRIPTION, ATTR_SERVER_ADDRESS$1, ATTR_SERVER_PORT$1, ATTR_SERVICE_INSTANCE_ID, ATTR_SERVICE_NAME, ATTR_SERVICE_NAMESPACE, ATTR_SERVICE_VERSION, ATTR_SIGNALR_CONNECTION_STATUS, SIGNALR_CONNECTION_STATUS_VALUE_APP_SHUTDOWN, SIGNALR_CONNECTION_STATUS_VALUE_NORMAL_CLOSURE, SIGNALR_CONNECTION_STATUS_VALUE_TIMEOUT, ATTR_SIGNALR_TRANSPORT, SIGNALR_TRANSPORT_VALUE_LONG_POLLING, SIGNALR_TRANSPORT_VALUE_SERVER_SENT_EVENTS, SIGNALR_TRANSPORT_VALUE_WEB_SOCKETS, ATTR_TELEMETRY_DISTRO_NAME, ATTR_TELEMETRY_DISTRO_VERSION, ATTR_TELEMETRY_SDK_LANGUAGE, TELEMETRY_SDK_LANGUAGE_VALUE_DOTNET, TELEMETRY_SDK_LANGUAGE_VALUE_ERLANG, TELEMETRY_SDK_LANGUAGE_VALUE_JAVA, TELEMETRY_SDK_LANGUAGE_VALUE_KOTLIN, TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS, TELEMETRY_SDK_LANGUAGE_VALUE_PYTHON, TELEMETRY_SDK_LANGUAGE_VALUE_RUBY, TELEMETRY_SDK_LANGUAGE_VALUE_RUST, TELEMETRY_SDK_LANGUAGE_VALUE_SWIFT, TELEMETRY_SDK_LANGUAGE_VALUE_WEBJS, ATTR_TELEMETRY_SDK_NAME, ATTR_TELEMETRY_SDK_VERSION, ATTR_URL_FRAGMENT, ATTR_URL_FULL, ATTR_URL_PATH, ATTR_URL_QUERY, ATTR_URL_SCHEME, ATTR_USER_AGENT_ORIGINAL;
var init_stable_attributes = __esmMin((() => {
	ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT = "aspnetcore.diagnostics.exception.result";
	ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_ABORTED = "aborted";
	ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_HANDLED = "handled";
	ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_SKIPPED = "skipped";
	ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_UNHANDLED = "unhandled";
	ATTR_ASPNETCORE_DIAGNOSTICS_HANDLER_TYPE = "aspnetcore.diagnostics.handler.type";
	ATTR_ASPNETCORE_RATE_LIMITING_POLICY = "aspnetcore.rate_limiting.policy";
	ATTR_ASPNETCORE_RATE_LIMITING_RESULT = "aspnetcore.rate_limiting.result";
	ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ACQUIRED = "acquired";
	ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ENDPOINT_LIMITER = "endpoint_limiter";
	ASPNETCORE_RATE_LIMITING_RESULT_VALUE_GLOBAL_LIMITER = "global_limiter";
	ASPNETCORE_RATE_LIMITING_RESULT_VALUE_REQUEST_CANCELED = "request_canceled";
	ATTR_ASPNETCORE_REQUEST_IS_UNHANDLED = "aspnetcore.request.is_unhandled";
	ATTR_ASPNETCORE_ROUTING_IS_FALLBACK = "aspnetcore.routing.is_fallback";
	ATTR_ASPNETCORE_ROUTING_MATCH_STATUS = "aspnetcore.routing.match_status";
	ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_FAILURE = "failure";
	ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_SUCCESS = "success";
	ATTR_ASPNETCORE_USER_IS_AUTHENTICATED = "aspnetcore.user.is_authenticated";
	ATTR_CLIENT_ADDRESS = "client.address";
	ATTR_CLIENT_PORT = "client.port";
	ATTR_CODE_COLUMN_NUMBER = "code.column.number";
	ATTR_CODE_FILE_PATH = "code.file.path";
	ATTR_CODE_FUNCTION_NAME = "code.function.name";
	ATTR_CODE_LINE_NUMBER = "code.line.number";
	ATTR_CODE_STACKTRACE = "code.stacktrace";
	ATTR_CONTAINER_ID = "container.id";
	ATTR_CONTAINER_IMAGE_NAME = "container.image.name";
	ATTR_CONTAINER_IMAGE_REPO_DIGESTS = "container.image.repo_digests";
	ATTR_CONTAINER_IMAGE_TAGS = "container.image.tags";
	ATTR_DB_COLLECTION_NAME = "db.collection.name";
	ATTR_DB_NAMESPACE = "db.namespace";
	ATTR_DB_OPERATION_BATCH_SIZE = "db.operation.batch.size";
	ATTR_DB_OPERATION_NAME = "db.operation.name";
	ATTR_DB_QUERY_SUMMARY = "db.query.summary";
	ATTR_DB_QUERY_TEXT = "db.query.text";
	ATTR_DB_RESPONSE_STATUS_CODE = "db.response.status_code";
	ATTR_DB_STORED_PROCEDURE_NAME = "db.stored_procedure.name";
	ATTR_DB_SYSTEM_NAME = "db.system.name";
	DB_SYSTEM_NAME_VALUE_MARIADB = "mariadb";
	DB_SYSTEM_NAME_VALUE_MICROSOFT_SQL_SERVER = "microsoft.sql_server";
	DB_SYSTEM_NAME_VALUE_MYSQL = "mysql";
	DB_SYSTEM_NAME_VALUE_POSTGRESQL = "postgresql";
	ATTR_DEPLOYMENT_ENVIRONMENT_NAME = "deployment.environment.name";
	DEPLOYMENT_ENVIRONMENT_NAME_VALUE_DEVELOPMENT = "development";
	DEPLOYMENT_ENVIRONMENT_NAME_VALUE_PRODUCTION = "production";
	DEPLOYMENT_ENVIRONMENT_NAME_VALUE_STAGING = "staging";
	DEPLOYMENT_ENVIRONMENT_NAME_VALUE_TEST = "test";
	ATTR_DOTNET_GC_HEAP_GENERATION = "dotnet.gc.heap.generation";
	DOTNET_GC_HEAP_GENERATION_VALUE_GEN0 = "gen0";
	DOTNET_GC_HEAP_GENERATION_VALUE_GEN1 = "gen1";
	DOTNET_GC_HEAP_GENERATION_VALUE_GEN2 = "gen2";
	ATTR_ERROR_TYPE$1 = "error.type";
	ERROR_TYPE_VALUE_OTHER = "_OTHER";
	ATTR_EXCEPTION_ESCAPED = "exception.escaped";
	ATTR_EXCEPTION_MESSAGE = "exception.message";
	ATTR_EXCEPTION_STACKTRACE = "exception.stacktrace";
	ATTR_EXCEPTION_TYPE = "exception.type";
	ATTR_HTTP_REQUEST_HEADER = (key) => `http.request.header.${key}`;
	ATTR_HTTP_REQUEST_METHOD = "http.request.method";
	HTTP_REQUEST_METHOD_VALUE_OTHER = "_OTHER";
	HTTP_REQUEST_METHOD_VALUE_CONNECT = "CONNECT";
	HTTP_REQUEST_METHOD_VALUE_DELETE = "DELETE";
	HTTP_REQUEST_METHOD_VALUE_HEAD = "HEAD";
	HTTP_REQUEST_METHOD_VALUE_OPTIONS = "OPTIONS";
	HTTP_REQUEST_METHOD_VALUE_PATCH = "PATCH";
	HTTP_REQUEST_METHOD_VALUE_POST = "POST";
	HTTP_REQUEST_METHOD_VALUE_TRACE = "TRACE";
	ATTR_HTTP_REQUEST_METHOD_ORIGINAL = "http.request.method_original";
	ATTR_HTTP_REQUEST_RESEND_COUNT = "http.request.resend_count";
	ATTR_HTTP_RESPONSE_HEADER = (key) => `http.response.header.${key}`;
	ATTR_HTTP_RESPONSE_STATUS_CODE$1 = "http.response.status_code";
	ATTR_HTTP_ROUTE = "http.route";
	ATTR_JVM_GC_ACTION = "jvm.gc.action";
	ATTR_JVM_GC_NAME = "jvm.gc.name";
	ATTR_JVM_MEMORY_POOL_NAME = "jvm.memory.pool.name";
	ATTR_JVM_MEMORY_TYPE = "jvm.memory.type";
	JVM_MEMORY_TYPE_VALUE_HEAP = "heap";
	JVM_MEMORY_TYPE_VALUE_NON_HEAP = "non_heap";
	ATTR_JVM_THREAD_DAEMON = "jvm.thread.daemon";
	ATTR_JVM_THREAD_STATE = "jvm.thread.state";
	JVM_THREAD_STATE_VALUE_BLOCKED = "blocked";
	JVM_THREAD_STATE_VALUE_RUNNABLE = "runnable";
	JVM_THREAD_STATE_VALUE_TERMINATED = "terminated";
	JVM_THREAD_STATE_VALUE_TIMED_WAITING = "timed_waiting";
	JVM_THREAD_STATE_VALUE_WAITING = "waiting";
	ATTR_K8S_CLUSTER_NAME = "k8s.cluster.name";
	ATTR_K8S_CLUSTER_UID = "k8s.cluster.uid";
	ATTR_K8S_CONTAINER_NAME = "k8s.container.name";
	ATTR_K8S_CONTAINER_RESTART_COUNT = "k8s.container.restart_count";
	ATTR_K8S_CRONJOB_ANNOTATION = (key) => `k8s.cronjob.annotation.${key}`;
	ATTR_K8S_CRONJOB_LABEL = (key) => `k8s.cronjob.label.${key}`;
	ATTR_K8S_CRONJOB_NAME = "k8s.cronjob.name";
	ATTR_K8S_CRONJOB_UID = "k8s.cronjob.uid";
	ATTR_K8S_DAEMONSET_ANNOTATION = (key) => `k8s.daemonset.annotation.${key}`;
	ATTR_K8S_DAEMONSET_LABEL = (key) => `k8s.daemonset.label.${key}`;
	ATTR_K8S_DAEMONSET_NAME = "k8s.daemonset.name";
	ATTR_K8S_DAEMONSET_UID = "k8s.daemonset.uid";
	ATTR_K8S_DEPLOYMENT_ANNOTATION = (key) => `k8s.deployment.annotation.${key}`;
	ATTR_K8S_DEPLOYMENT_LABEL = (key) => `k8s.deployment.label.${key}`;
	ATTR_K8S_DEPLOYMENT_NAME = "k8s.deployment.name";
	ATTR_K8S_DEPLOYMENT_UID = "k8s.deployment.uid";
	ATTR_K8S_JOB_ANNOTATION = (key) => `k8s.job.annotation.${key}`;
	ATTR_K8S_JOB_LABEL = (key) => `k8s.job.label.${key}`;
	ATTR_K8S_JOB_NAME = "k8s.job.name";
	ATTR_K8S_JOB_UID = "k8s.job.uid";
	ATTR_K8S_NAMESPACE_ANNOTATION = (key) => `k8s.namespace.annotation.${key}`;
	ATTR_K8S_NAMESPACE_LABEL = (key) => `k8s.namespace.label.${key}`;
	ATTR_K8S_NAMESPACE_NAME = "k8s.namespace.name";
	ATTR_K8S_NODE_ANNOTATION = (key) => `k8s.node.annotation.${key}`;
	ATTR_K8S_NODE_LABEL = (key) => `k8s.node.label.${key}`;
	ATTR_K8S_NODE_NAME = "k8s.node.name";
	ATTR_K8S_NODE_UID = "k8s.node.uid";
	ATTR_K8S_POD_ANNOTATION = (key) => `k8s.pod.annotation.${key}`;
	ATTR_K8S_POD_HOSTNAME = "k8s.pod.hostname";
	ATTR_K8S_POD_IP = "k8s.pod.ip";
	ATTR_K8S_POD_LABEL = (key) => `k8s.pod.label.${key}`;
	ATTR_K8S_POD_NAME = "k8s.pod.name";
	ATTR_K8S_POD_START_TIME = "k8s.pod.start_time";
	ATTR_K8S_POD_UID = "k8s.pod.uid";
	ATTR_K8S_REPLICASET_ANNOTATION = (key) => `k8s.replicaset.annotation.${key}`;
	ATTR_K8S_REPLICASET_LABEL = (key) => `k8s.replicaset.label.${key}`;
	ATTR_K8S_REPLICASET_NAME = "k8s.replicaset.name";
	ATTR_K8S_REPLICASET_UID = "k8s.replicaset.uid";
	ATTR_K8S_STATEFULSET_ANNOTATION = (key) => `k8s.statefulset.annotation.${key}`;
	ATTR_K8S_STATEFULSET_LABEL = (key) => `k8s.statefulset.label.${key}`;
	ATTR_K8S_STATEFULSET_NAME = "k8s.statefulset.name";
	ATTR_K8S_STATEFULSET_UID = "k8s.statefulset.uid";
	ATTR_NETWORK_LOCAL_ADDRESS = "network.local.address";
	ATTR_NETWORK_LOCAL_PORT = "network.local.port";
	ATTR_NETWORK_PEER_ADDRESS = "network.peer.address";
	ATTR_NETWORK_PEER_PORT = "network.peer.port";
	ATTR_NETWORK_PROTOCOL_NAME = "network.protocol.name";
	ATTR_NETWORK_PROTOCOL_VERSION = "network.protocol.version";
	ATTR_NETWORK_TRANSPORT = "network.transport";
	NETWORK_TRANSPORT_VALUE_PIPE = "pipe";
	NETWORK_TRANSPORT_VALUE_QUIC = "quic";
	NETWORK_TRANSPORT_VALUE_UNIX = "unix";
	ATTR_NETWORK_TYPE = "network.type";
	NETWORK_TYPE_VALUE_IPV4 = "ipv4";
	NETWORK_TYPE_VALUE_IPV6 = "ipv6";
	ATTR_OTEL_EVENT_NAME = "otel.event.name";
	ATTR_OTEL_SCOPE_NAME = "otel.scope.name";
	ATTR_OTEL_SCOPE_VERSION = "otel.scope.version";
	ATTR_OTEL_STATUS_CODE = "otel.status_code";
	OTEL_STATUS_CODE_VALUE_ERROR = "ERROR";
	ATTR_OTEL_STATUS_DESCRIPTION = "otel.status_description";
	ATTR_SERVER_ADDRESS$1 = "server.address";
	ATTR_SERVER_PORT$1 = "server.port";
	ATTR_SERVICE_INSTANCE_ID = "service.instance.id";
	ATTR_SERVICE_NAME = "service.name";
	ATTR_SERVICE_NAMESPACE = "service.namespace";
	ATTR_SERVICE_VERSION = "service.version";
	ATTR_SIGNALR_CONNECTION_STATUS = "signalr.connection.status";
	SIGNALR_CONNECTION_STATUS_VALUE_APP_SHUTDOWN = "app_shutdown";
	SIGNALR_CONNECTION_STATUS_VALUE_NORMAL_CLOSURE = "normal_closure";
	SIGNALR_CONNECTION_STATUS_VALUE_TIMEOUT = "timeout";
	ATTR_SIGNALR_TRANSPORT = "signalr.transport";
	SIGNALR_TRANSPORT_VALUE_LONG_POLLING = "long_polling";
	SIGNALR_TRANSPORT_VALUE_SERVER_SENT_EVENTS = "server_sent_events";
	SIGNALR_TRANSPORT_VALUE_WEB_SOCKETS = "web_sockets";
	ATTR_TELEMETRY_DISTRO_NAME = "telemetry.distro.name";
	ATTR_TELEMETRY_DISTRO_VERSION = "telemetry.distro.version";
	ATTR_TELEMETRY_SDK_LANGUAGE = "telemetry.sdk.language";
	TELEMETRY_SDK_LANGUAGE_VALUE_DOTNET = "dotnet";
	TELEMETRY_SDK_LANGUAGE_VALUE_ERLANG = "erlang";
	TELEMETRY_SDK_LANGUAGE_VALUE_JAVA = "java";
	TELEMETRY_SDK_LANGUAGE_VALUE_KOTLIN = "kotlin";
	TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS = "nodejs";
	TELEMETRY_SDK_LANGUAGE_VALUE_PYTHON = "python";
	TELEMETRY_SDK_LANGUAGE_VALUE_RUBY = "ruby";
	TELEMETRY_SDK_LANGUAGE_VALUE_RUST = "rust";
	TELEMETRY_SDK_LANGUAGE_VALUE_SWIFT = "swift";
	TELEMETRY_SDK_LANGUAGE_VALUE_WEBJS = "webjs";
	ATTR_TELEMETRY_SDK_NAME = "telemetry.sdk.name";
	ATTR_TELEMETRY_SDK_VERSION = "telemetry.sdk.version";
	ATTR_URL_FRAGMENT = "url.fragment";
	ATTR_URL_FULL = "url.full";
	ATTR_URL_PATH = "url.path";
	ATTR_URL_QUERY = "url.query";
	ATTR_URL_SCHEME = "url.scheme";
	ATTR_USER_AGENT_ORIGINAL = "user_agent.original";
}));
//#endregion
//#region node_modules/@opentelemetry/semantic-conventions/build/esm/stable_metrics.js
var METRIC_ASPNETCORE_DIAGNOSTICS_EXCEPTIONS, METRIC_ASPNETCORE_RATE_LIMITING_ACTIVE_REQUEST_LEASES, METRIC_ASPNETCORE_RATE_LIMITING_QUEUED_REQUESTS, METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_TIME_IN_QUEUE, METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_LEASE_DURATION, METRIC_ASPNETCORE_RATE_LIMITING_REQUESTS, METRIC_ASPNETCORE_ROUTING_MATCH_ATTEMPTS, METRIC_DB_CLIENT_OPERATION_DURATION, METRIC_DOTNET_ASSEMBLY_COUNT, METRIC_DOTNET_EXCEPTIONS, METRIC_DOTNET_GC_COLLECTIONS, METRIC_DOTNET_GC_HEAP_TOTAL_ALLOCATED, METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_FRAGMENTATION_SIZE, METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_SIZE, METRIC_DOTNET_GC_LAST_COLLECTION_MEMORY_COMMITTED_SIZE, METRIC_DOTNET_GC_PAUSE_TIME, METRIC_DOTNET_JIT_COMPILATION_TIME, METRIC_DOTNET_JIT_COMPILED_IL_SIZE, METRIC_DOTNET_JIT_COMPILED_METHODS, METRIC_DOTNET_MONITOR_LOCK_CONTENTIONS, METRIC_DOTNET_PROCESS_CPU_COUNT, METRIC_DOTNET_PROCESS_CPU_TIME, METRIC_DOTNET_PROCESS_MEMORY_WORKING_SET, METRIC_DOTNET_THREAD_POOL_QUEUE_LENGTH, METRIC_DOTNET_THREAD_POOL_THREAD_COUNT, METRIC_DOTNET_THREAD_POOL_WORK_ITEM_COUNT, METRIC_DOTNET_TIMER_COUNT, METRIC_HTTP_CLIENT_REQUEST_DURATION, METRIC_HTTP_SERVER_REQUEST_DURATION, METRIC_JVM_CLASS_COUNT, METRIC_JVM_CLASS_LOADED, METRIC_JVM_CLASS_UNLOADED, METRIC_JVM_CPU_COUNT, METRIC_JVM_CPU_RECENT_UTILIZATION, METRIC_JVM_CPU_TIME, METRIC_JVM_GC_DURATION, METRIC_JVM_MEMORY_COMMITTED, METRIC_JVM_MEMORY_LIMIT, METRIC_JVM_MEMORY_USED, METRIC_JVM_MEMORY_USED_AFTER_LAST_GC, METRIC_JVM_THREAD_COUNT, METRIC_KESTREL_ACTIVE_CONNECTIONS, METRIC_KESTREL_ACTIVE_TLS_HANDSHAKES, METRIC_KESTREL_CONNECTION_DURATION, METRIC_KESTREL_QUEUED_CONNECTIONS, METRIC_KESTREL_QUEUED_REQUESTS, METRIC_KESTREL_REJECTED_CONNECTIONS, METRIC_KESTREL_TLS_HANDSHAKE_DURATION, METRIC_KESTREL_UPGRADED_CONNECTIONS, METRIC_SIGNALR_SERVER_ACTIVE_CONNECTIONS, METRIC_SIGNALR_SERVER_CONNECTION_DURATION;
var init_stable_metrics = __esmMin((() => {
	METRIC_ASPNETCORE_DIAGNOSTICS_EXCEPTIONS = "aspnetcore.diagnostics.exceptions";
	METRIC_ASPNETCORE_RATE_LIMITING_ACTIVE_REQUEST_LEASES = "aspnetcore.rate_limiting.active_request_leases";
	METRIC_ASPNETCORE_RATE_LIMITING_QUEUED_REQUESTS = "aspnetcore.rate_limiting.queued_requests";
	METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_TIME_IN_QUEUE = "aspnetcore.rate_limiting.request.time_in_queue";
	METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_LEASE_DURATION = "aspnetcore.rate_limiting.request_lease.duration";
	METRIC_ASPNETCORE_RATE_LIMITING_REQUESTS = "aspnetcore.rate_limiting.requests";
	METRIC_ASPNETCORE_ROUTING_MATCH_ATTEMPTS = "aspnetcore.routing.match_attempts";
	METRIC_DB_CLIENT_OPERATION_DURATION = "db.client.operation.duration";
	METRIC_DOTNET_ASSEMBLY_COUNT = "dotnet.assembly.count";
	METRIC_DOTNET_EXCEPTIONS = "dotnet.exceptions";
	METRIC_DOTNET_GC_COLLECTIONS = "dotnet.gc.collections";
	METRIC_DOTNET_GC_HEAP_TOTAL_ALLOCATED = "dotnet.gc.heap.total_allocated";
	METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_FRAGMENTATION_SIZE = "dotnet.gc.last_collection.heap.fragmentation.size";
	METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_SIZE = "dotnet.gc.last_collection.heap.size";
	METRIC_DOTNET_GC_LAST_COLLECTION_MEMORY_COMMITTED_SIZE = "dotnet.gc.last_collection.memory.committed_size";
	METRIC_DOTNET_GC_PAUSE_TIME = "dotnet.gc.pause.time";
	METRIC_DOTNET_JIT_COMPILATION_TIME = "dotnet.jit.compilation.time";
	METRIC_DOTNET_JIT_COMPILED_IL_SIZE = "dotnet.jit.compiled_il.size";
	METRIC_DOTNET_JIT_COMPILED_METHODS = "dotnet.jit.compiled_methods";
	METRIC_DOTNET_MONITOR_LOCK_CONTENTIONS = "dotnet.monitor.lock_contentions";
	METRIC_DOTNET_PROCESS_CPU_COUNT = "dotnet.process.cpu.count";
	METRIC_DOTNET_PROCESS_CPU_TIME = "dotnet.process.cpu.time";
	METRIC_DOTNET_PROCESS_MEMORY_WORKING_SET = "dotnet.process.memory.working_set";
	METRIC_DOTNET_THREAD_POOL_QUEUE_LENGTH = "dotnet.thread_pool.queue.length";
	METRIC_DOTNET_THREAD_POOL_THREAD_COUNT = "dotnet.thread_pool.thread.count";
	METRIC_DOTNET_THREAD_POOL_WORK_ITEM_COUNT = "dotnet.thread_pool.work_item.count";
	METRIC_DOTNET_TIMER_COUNT = "dotnet.timer.count";
	METRIC_HTTP_CLIENT_REQUEST_DURATION = "http.client.request.duration";
	METRIC_HTTP_SERVER_REQUEST_DURATION = "http.server.request.duration";
	METRIC_JVM_CLASS_COUNT = "jvm.class.count";
	METRIC_JVM_CLASS_LOADED = "jvm.class.loaded";
	METRIC_JVM_CLASS_UNLOADED = "jvm.class.unloaded";
	METRIC_JVM_CPU_COUNT = "jvm.cpu.count";
	METRIC_JVM_CPU_RECENT_UTILIZATION = "jvm.cpu.recent_utilization";
	METRIC_JVM_CPU_TIME = "jvm.cpu.time";
	METRIC_JVM_GC_DURATION = "jvm.gc.duration";
	METRIC_JVM_MEMORY_COMMITTED = "jvm.memory.committed";
	METRIC_JVM_MEMORY_LIMIT = "jvm.memory.limit";
	METRIC_JVM_MEMORY_USED = "jvm.memory.used";
	METRIC_JVM_MEMORY_USED_AFTER_LAST_GC = "jvm.memory.used_after_last_gc";
	METRIC_JVM_THREAD_COUNT = "jvm.thread.count";
	METRIC_KESTREL_ACTIVE_CONNECTIONS = "kestrel.active_connections";
	METRIC_KESTREL_ACTIVE_TLS_HANDSHAKES = "kestrel.active_tls_handshakes";
	METRIC_KESTREL_CONNECTION_DURATION = "kestrel.connection.duration";
	METRIC_KESTREL_QUEUED_CONNECTIONS = "kestrel.queued_connections";
	METRIC_KESTREL_QUEUED_REQUESTS = "kestrel.queued_requests";
	METRIC_KESTREL_REJECTED_CONNECTIONS = "kestrel.rejected_connections";
	METRIC_KESTREL_TLS_HANDSHAKE_DURATION = "kestrel.tls_handshake.duration";
	METRIC_KESTREL_UPGRADED_CONNECTIONS = "kestrel.upgraded_connections";
	METRIC_SIGNALR_SERVER_ACTIVE_CONNECTIONS = "signalr.server.active_connections";
	METRIC_SIGNALR_SERVER_CONNECTION_DURATION = "signalr.server.connection.duration";
}));
//#endregion
//#region node_modules/@opentelemetry/semantic-conventions/build/esm/stable_events.js
var EVENT_EXCEPTION;
var init_stable_events = __esmMin((() => {
	EVENT_EXCEPTION = "exception";
}));
//#endregion
//#region node_modules/@opentelemetry/semantic-conventions/build/esm/index.js
var esm_exports$1 = /* @__PURE__ */ __exportAll({
	ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_ABORTED: () => ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_ABORTED,
	ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_HANDLED: () => ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_HANDLED,
	ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_SKIPPED: () => ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_SKIPPED,
	ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_UNHANDLED: () => ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_UNHANDLED,
	ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ACQUIRED: () => ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ACQUIRED,
	ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ENDPOINT_LIMITER: () => ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ENDPOINT_LIMITER,
	ASPNETCORE_RATE_LIMITING_RESULT_VALUE_GLOBAL_LIMITER: () => ASPNETCORE_RATE_LIMITING_RESULT_VALUE_GLOBAL_LIMITER,
	ASPNETCORE_RATE_LIMITING_RESULT_VALUE_REQUEST_CANCELED: () => ASPNETCORE_RATE_LIMITING_RESULT_VALUE_REQUEST_CANCELED,
	ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_FAILURE: () => ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_FAILURE,
	ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_SUCCESS: () => ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_SUCCESS,
	ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT: () => ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT,
	ATTR_ASPNETCORE_DIAGNOSTICS_HANDLER_TYPE: () => ATTR_ASPNETCORE_DIAGNOSTICS_HANDLER_TYPE,
	ATTR_ASPNETCORE_RATE_LIMITING_POLICY: () => ATTR_ASPNETCORE_RATE_LIMITING_POLICY,
	ATTR_ASPNETCORE_RATE_LIMITING_RESULT: () => ATTR_ASPNETCORE_RATE_LIMITING_RESULT,
	ATTR_ASPNETCORE_REQUEST_IS_UNHANDLED: () => ATTR_ASPNETCORE_REQUEST_IS_UNHANDLED,
	ATTR_ASPNETCORE_ROUTING_IS_FALLBACK: () => ATTR_ASPNETCORE_ROUTING_IS_FALLBACK,
	ATTR_ASPNETCORE_ROUTING_MATCH_STATUS: () => ATTR_ASPNETCORE_ROUTING_MATCH_STATUS,
	ATTR_ASPNETCORE_USER_IS_AUTHENTICATED: () => ATTR_ASPNETCORE_USER_IS_AUTHENTICATED,
	ATTR_CLIENT_ADDRESS: () => ATTR_CLIENT_ADDRESS,
	ATTR_CLIENT_PORT: () => ATTR_CLIENT_PORT,
	ATTR_CODE_COLUMN_NUMBER: () => ATTR_CODE_COLUMN_NUMBER,
	ATTR_CODE_FILE_PATH: () => ATTR_CODE_FILE_PATH,
	ATTR_CODE_FUNCTION_NAME: () => ATTR_CODE_FUNCTION_NAME,
	ATTR_CODE_LINE_NUMBER: () => ATTR_CODE_LINE_NUMBER,
	ATTR_CODE_STACKTRACE: () => ATTR_CODE_STACKTRACE,
	ATTR_CONTAINER_ID: () => ATTR_CONTAINER_ID,
	ATTR_CONTAINER_IMAGE_NAME: () => ATTR_CONTAINER_IMAGE_NAME,
	ATTR_CONTAINER_IMAGE_REPO_DIGESTS: () => ATTR_CONTAINER_IMAGE_REPO_DIGESTS,
	ATTR_CONTAINER_IMAGE_TAGS: () => ATTR_CONTAINER_IMAGE_TAGS,
	ATTR_DB_COLLECTION_NAME: () => ATTR_DB_COLLECTION_NAME,
	ATTR_DB_NAMESPACE: () => ATTR_DB_NAMESPACE,
	ATTR_DB_OPERATION_BATCH_SIZE: () => ATTR_DB_OPERATION_BATCH_SIZE,
	ATTR_DB_OPERATION_NAME: () => ATTR_DB_OPERATION_NAME,
	ATTR_DB_QUERY_SUMMARY: () => ATTR_DB_QUERY_SUMMARY,
	ATTR_DB_QUERY_TEXT: () => ATTR_DB_QUERY_TEXT,
	ATTR_DB_RESPONSE_STATUS_CODE: () => ATTR_DB_RESPONSE_STATUS_CODE,
	ATTR_DB_STORED_PROCEDURE_NAME: () => ATTR_DB_STORED_PROCEDURE_NAME,
	ATTR_DB_SYSTEM_NAME: () => ATTR_DB_SYSTEM_NAME,
	ATTR_DEPLOYMENT_ENVIRONMENT_NAME: () => ATTR_DEPLOYMENT_ENVIRONMENT_NAME,
	ATTR_DOTNET_GC_HEAP_GENERATION: () => ATTR_DOTNET_GC_HEAP_GENERATION,
	ATTR_ERROR_TYPE: () => ATTR_ERROR_TYPE$1,
	ATTR_EXCEPTION_ESCAPED: () => ATTR_EXCEPTION_ESCAPED,
	ATTR_EXCEPTION_MESSAGE: () => ATTR_EXCEPTION_MESSAGE,
	ATTR_EXCEPTION_STACKTRACE: () => ATTR_EXCEPTION_STACKTRACE,
	ATTR_EXCEPTION_TYPE: () => ATTR_EXCEPTION_TYPE,
	ATTR_HTTP_REQUEST_HEADER: () => ATTR_HTTP_REQUEST_HEADER,
	ATTR_HTTP_REQUEST_METHOD: () => ATTR_HTTP_REQUEST_METHOD,
	ATTR_HTTP_REQUEST_METHOD_ORIGINAL: () => ATTR_HTTP_REQUEST_METHOD_ORIGINAL,
	ATTR_HTTP_REQUEST_RESEND_COUNT: () => ATTR_HTTP_REQUEST_RESEND_COUNT,
	ATTR_HTTP_RESPONSE_HEADER: () => ATTR_HTTP_RESPONSE_HEADER,
	ATTR_HTTP_RESPONSE_STATUS_CODE: () => ATTR_HTTP_RESPONSE_STATUS_CODE$1,
	ATTR_HTTP_ROUTE: () => ATTR_HTTP_ROUTE,
	ATTR_JVM_GC_ACTION: () => ATTR_JVM_GC_ACTION,
	ATTR_JVM_GC_NAME: () => ATTR_JVM_GC_NAME,
	ATTR_JVM_MEMORY_POOL_NAME: () => ATTR_JVM_MEMORY_POOL_NAME,
	ATTR_JVM_MEMORY_TYPE: () => ATTR_JVM_MEMORY_TYPE,
	ATTR_JVM_THREAD_DAEMON: () => ATTR_JVM_THREAD_DAEMON,
	ATTR_JVM_THREAD_STATE: () => ATTR_JVM_THREAD_STATE,
	ATTR_K8S_CLUSTER_NAME: () => ATTR_K8S_CLUSTER_NAME,
	ATTR_K8S_CLUSTER_UID: () => ATTR_K8S_CLUSTER_UID,
	ATTR_K8S_CONTAINER_NAME: () => ATTR_K8S_CONTAINER_NAME,
	ATTR_K8S_CONTAINER_RESTART_COUNT: () => ATTR_K8S_CONTAINER_RESTART_COUNT,
	ATTR_K8S_CRONJOB_ANNOTATION: () => ATTR_K8S_CRONJOB_ANNOTATION,
	ATTR_K8S_CRONJOB_LABEL: () => ATTR_K8S_CRONJOB_LABEL,
	ATTR_K8S_CRONJOB_NAME: () => ATTR_K8S_CRONJOB_NAME,
	ATTR_K8S_CRONJOB_UID: () => ATTR_K8S_CRONJOB_UID,
	ATTR_K8S_DAEMONSET_ANNOTATION: () => ATTR_K8S_DAEMONSET_ANNOTATION,
	ATTR_K8S_DAEMONSET_LABEL: () => ATTR_K8S_DAEMONSET_LABEL,
	ATTR_K8S_DAEMONSET_NAME: () => ATTR_K8S_DAEMONSET_NAME,
	ATTR_K8S_DAEMONSET_UID: () => ATTR_K8S_DAEMONSET_UID,
	ATTR_K8S_DEPLOYMENT_ANNOTATION: () => ATTR_K8S_DEPLOYMENT_ANNOTATION,
	ATTR_K8S_DEPLOYMENT_LABEL: () => ATTR_K8S_DEPLOYMENT_LABEL,
	ATTR_K8S_DEPLOYMENT_NAME: () => ATTR_K8S_DEPLOYMENT_NAME,
	ATTR_K8S_DEPLOYMENT_UID: () => ATTR_K8S_DEPLOYMENT_UID,
	ATTR_K8S_JOB_ANNOTATION: () => ATTR_K8S_JOB_ANNOTATION,
	ATTR_K8S_JOB_LABEL: () => ATTR_K8S_JOB_LABEL,
	ATTR_K8S_JOB_NAME: () => ATTR_K8S_JOB_NAME,
	ATTR_K8S_JOB_UID: () => ATTR_K8S_JOB_UID,
	ATTR_K8S_NAMESPACE_ANNOTATION: () => ATTR_K8S_NAMESPACE_ANNOTATION,
	ATTR_K8S_NAMESPACE_LABEL: () => ATTR_K8S_NAMESPACE_LABEL,
	ATTR_K8S_NAMESPACE_NAME: () => ATTR_K8S_NAMESPACE_NAME,
	ATTR_K8S_NODE_ANNOTATION: () => ATTR_K8S_NODE_ANNOTATION,
	ATTR_K8S_NODE_LABEL: () => ATTR_K8S_NODE_LABEL,
	ATTR_K8S_NODE_NAME: () => ATTR_K8S_NODE_NAME,
	ATTR_K8S_NODE_UID: () => ATTR_K8S_NODE_UID,
	ATTR_K8S_POD_ANNOTATION: () => ATTR_K8S_POD_ANNOTATION,
	ATTR_K8S_POD_HOSTNAME: () => ATTR_K8S_POD_HOSTNAME,
	ATTR_K8S_POD_IP: () => ATTR_K8S_POD_IP,
	ATTR_K8S_POD_LABEL: () => ATTR_K8S_POD_LABEL,
	ATTR_K8S_POD_NAME: () => ATTR_K8S_POD_NAME,
	ATTR_K8S_POD_START_TIME: () => ATTR_K8S_POD_START_TIME,
	ATTR_K8S_POD_UID: () => ATTR_K8S_POD_UID,
	ATTR_K8S_REPLICASET_ANNOTATION: () => ATTR_K8S_REPLICASET_ANNOTATION,
	ATTR_K8S_REPLICASET_LABEL: () => ATTR_K8S_REPLICASET_LABEL,
	ATTR_K8S_REPLICASET_NAME: () => ATTR_K8S_REPLICASET_NAME,
	ATTR_K8S_REPLICASET_UID: () => ATTR_K8S_REPLICASET_UID,
	ATTR_K8S_STATEFULSET_ANNOTATION: () => ATTR_K8S_STATEFULSET_ANNOTATION,
	ATTR_K8S_STATEFULSET_LABEL: () => ATTR_K8S_STATEFULSET_LABEL,
	ATTR_K8S_STATEFULSET_NAME: () => ATTR_K8S_STATEFULSET_NAME,
	ATTR_K8S_STATEFULSET_UID: () => ATTR_K8S_STATEFULSET_UID,
	ATTR_NETWORK_LOCAL_ADDRESS: () => ATTR_NETWORK_LOCAL_ADDRESS,
	ATTR_NETWORK_LOCAL_PORT: () => ATTR_NETWORK_LOCAL_PORT,
	ATTR_NETWORK_PEER_ADDRESS: () => ATTR_NETWORK_PEER_ADDRESS,
	ATTR_NETWORK_PEER_PORT: () => ATTR_NETWORK_PEER_PORT,
	ATTR_NETWORK_PROTOCOL_NAME: () => ATTR_NETWORK_PROTOCOL_NAME,
	ATTR_NETWORK_PROTOCOL_VERSION: () => ATTR_NETWORK_PROTOCOL_VERSION,
	ATTR_NETWORK_TRANSPORT: () => ATTR_NETWORK_TRANSPORT,
	ATTR_NETWORK_TYPE: () => ATTR_NETWORK_TYPE,
	ATTR_OTEL_EVENT_NAME: () => ATTR_OTEL_EVENT_NAME,
	ATTR_OTEL_SCOPE_NAME: () => ATTR_OTEL_SCOPE_NAME,
	ATTR_OTEL_SCOPE_VERSION: () => ATTR_OTEL_SCOPE_VERSION,
	ATTR_OTEL_STATUS_CODE: () => ATTR_OTEL_STATUS_CODE,
	ATTR_OTEL_STATUS_DESCRIPTION: () => ATTR_OTEL_STATUS_DESCRIPTION,
	ATTR_SERVER_ADDRESS: () => ATTR_SERVER_ADDRESS$1,
	ATTR_SERVER_PORT: () => ATTR_SERVER_PORT$1,
	ATTR_SERVICE_INSTANCE_ID: () => ATTR_SERVICE_INSTANCE_ID,
	ATTR_SERVICE_NAME: () => ATTR_SERVICE_NAME,
	ATTR_SERVICE_NAMESPACE: () => ATTR_SERVICE_NAMESPACE,
	ATTR_SERVICE_VERSION: () => ATTR_SERVICE_VERSION,
	ATTR_SIGNALR_CONNECTION_STATUS: () => ATTR_SIGNALR_CONNECTION_STATUS,
	ATTR_SIGNALR_TRANSPORT: () => ATTR_SIGNALR_TRANSPORT,
	ATTR_TELEMETRY_DISTRO_NAME: () => ATTR_TELEMETRY_DISTRO_NAME,
	ATTR_TELEMETRY_DISTRO_VERSION: () => ATTR_TELEMETRY_DISTRO_VERSION,
	ATTR_TELEMETRY_SDK_LANGUAGE: () => ATTR_TELEMETRY_SDK_LANGUAGE,
	ATTR_TELEMETRY_SDK_NAME: () => ATTR_TELEMETRY_SDK_NAME,
	ATTR_TELEMETRY_SDK_VERSION: () => ATTR_TELEMETRY_SDK_VERSION,
	ATTR_URL_FRAGMENT: () => ATTR_URL_FRAGMENT,
	ATTR_URL_FULL: () => ATTR_URL_FULL,
	ATTR_URL_PATH: () => ATTR_URL_PATH,
	ATTR_URL_QUERY: () => ATTR_URL_QUERY,
	ATTR_URL_SCHEME: () => ATTR_URL_SCHEME,
	ATTR_USER_AGENT_ORIGINAL: () => ATTR_USER_AGENT_ORIGINAL,
	AWSECSLAUNCHTYPEVALUES_EC2: () => "ec2",
	AWSECSLAUNCHTYPEVALUES_FARGATE: () => AWSECSLAUNCHTYPEVALUES_FARGATE,
	AwsEcsLaunchtypeValues: () => AwsEcsLaunchtypeValues,
	CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS: () => CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS,
	CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC: () => CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC,
	CLOUDPLATFORMVALUES_AWS_EC2: () => CLOUDPLATFORMVALUES_AWS_EC2,
	CLOUDPLATFORMVALUES_AWS_ECS: () => CLOUDPLATFORMVALUES_AWS_ECS,
	CLOUDPLATFORMVALUES_AWS_EKS: () => CLOUDPLATFORMVALUES_AWS_EKS,
	CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK: () => CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK,
	CLOUDPLATFORMVALUES_AWS_LAMBDA: () => CLOUDPLATFORMVALUES_AWS_LAMBDA,
	CLOUDPLATFORMVALUES_AZURE_AKS: () => CLOUDPLATFORMVALUES_AZURE_AKS,
	CLOUDPLATFORMVALUES_AZURE_APP_SERVICE: () => CLOUDPLATFORMVALUES_AZURE_APP_SERVICE,
	CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES: () => CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES,
	CLOUDPLATFORMVALUES_AZURE_FUNCTIONS: () => CLOUDPLATFORMVALUES_AZURE_FUNCTIONS,
	CLOUDPLATFORMVALUES_AZURE_VM: () => CLOUDPLATFORMVALUES_AZURE_VM,
	CLOUDPLATFORMVALUES_GCP_APP_ENGINE: () => CLOUDPLATFORMVALUES_GCP_APP_ENGINE,
	CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS: () => CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS,
	CLOUDPLATFORMVALUES_GCP_CLOUD_RUN: () => CLOUDPLATFORMVALUES_GCP_CLOUD_RUN,
	CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE: () => CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE,
	CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE: () => CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE,
	CLOUDPROVIDERVALUES_ALIBABA_CLOUD: () => CLOUDPROVIDERVALUES_ALIBABA_CLOUD,
	CLOUDPROVIDERVALUES_AWS: () => "aws",
	CLOUDPROVIDERVALUES_AZURE: () => CLOUDPROVIDERVALUES_AZURE,
	CLOUDPROVIDERVALUES_GCP: () => "gcp",
	CloudPlatformValues: () => CloudPlatformValues,
	CloudProviderValues: () => CloudProviderValues,
	DBCASSANDRACONSISTENCYLEVELVALUES_ALL: () => "all",
	DBCASSANDRACONSISTENCYLEVELVALUES_ANY: () => "any",
	DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM: () => DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM,
	DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE: () => DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE,
	DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM: () => DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM,
	DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL: () => DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL,
	DBCASSANDRACONSISTENCYLEVELVALUES_ONE: () => "one",
	DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM: () => DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM,
	DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL: () => DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL,
	DBCASSANDRACONSISTENCYLEVELVALUES_THREE: () => DBCASSANDRACONSISTENCYLEVELVALUES_THREE,
	DBCASSANDRACONSISTENCYLEVELVALUES_TWO: () => "two",
	DBSYSTEMVALUES_ADABAS: () => DBSYSTEMVALUES_ADABAS,
	DBSYSTEMVALUES_CACHE: () => DBSYSTEMVALUES_CACHE,
	DBSYSTEMVALUES_CASSANDRA: () => DBSYSTEMVALUES_CASSANDRA,
	DBSYSTEMVALUES_CLOUDSCAPE: () => DBSYSTEMVALUES_CLOUDSCAPE,
	DBSYSTEMVALUES_COCKROACHDB: () => DBSYSTEMVALUES_COCKROACHDB,
	DBSYSTEMVALUES_COLDFUSION: () => DBSYSTEMVALUES_COLDFUSION,
	DBSYSTEMVALUES_COSMOSDB: () => DBSYSTEMVALUES_COSMOSDB,
	DBSYSTEMVALUES_COUCHBASE: () => DBSYSTEMVALUES_COUCHBASE,
	DBSYSTEMVALUES_COUCHDB: () => DBSYSTEMVALUES_COUCHDB,
	DBSYSTEMVALUES_DB2: () => "db2",
	DBSYSTEMVALUES_DERBY: () => DBSYSTEMVALUES_DERBY,
	DBSYSTEMVALUES_DYNAMODB: () => DBSYSTEMVALUES_DYNAMODB,
	DBSYSTEMVALUES_EDB: () => "edb",
	DBSYSTEMVALUES_ELASTICSEARCH: () => DBSYSTEMVALUES_ELASTICSEARCH,
	DBSYSTEMVALUES_FILEMAKER: () => DBSYSTEMVALUES_FILEMAKER,
	DBSYSTEMVALUES_FIREBIRD: () => DBSYSTEMVALUES_FIREBIRD,
	DBSYSTEMVALUES_FIRSTSQL: () => DBSYSTEMVALUES_FIRSTSQL,
	DBSYSTEMVALUES_GEODE: () => DBSYSTEMVALUES_GEODE,
	DBSYSTEMVALUES_H2: () => "h2",
	DBSYSTEMVALUES_HANADB: () => DBSYSTEMVALUES_HANADB,
	DBSYSTEMVALUES_HBASE: () => DBSYSTEMVALUES_HBASE,
	DBSYSTEMVALUES_HIVE: () => DBSYSTEMVALUES_HIVE,
	DBSYSTEMVALUES_HSQLDB: () => DBSYSTEMVALUES_HSQLDB,
	DBSYSTEMVALUES_INFORMIX: () => DBSYSTEMVALUES_INFORMIX,
	DBSYSTEMVALUES_INGRES: () => DBSYSTEMVALUES_INGRES,
	DBSYSTEMVALUES_INSTANTDB: () => DBSYSTEMVALUES_INSTANTDB,
	DBSYSTEMVALUES_INTERBASE: () => DBSYSTEMVALUES_INTERBASE,
	DBSYSTEMVALUES_MARIADB: () => DBSYSTEMVALUES_MARIADB,
	DBSYSTEMVALUES_MAXDB: () => DBSYSTEMVALUES_MAXDB,
	DBSYSTEMVALUES_MEMCACHED: () => DBSYSTEMVALUES_MEMCACHED,
	DBSYSTEMVALUES_MONGODB: () => DBSYSTEMVALUES_MONGODB,
	DBSYSTEMVALUES_MSSQL: () => DBSYSTEMVALUES_MSSQL,
	DBSYSTEMVALUES_MYSQL: () => DBSYSTEMVALUES_MYSQL,
	DBSYSTEMVALUES_NEO4J: () => DBSYSTEMVALUES_NEO4J,
	DBSYSTEMVALUES_NETEZZA: () => DBSYSTEMVALUES_NETEZZA,
	DBSYSTEMVALUES_ORACLE: () => DBSYSTEMVALUES_ORACLE,
	DBSYSTEMVALUES_OTHER_SQL: () => DBSYSTEMVALUES_OTHER_SQL,
	DBSYSTEMVALUES_PERVASIVE: () => DBSYSTEMVALUES_PERVASIVE,
	DBSYSTEMVALUES_POINTBASE: () => DBSYSTEMVALUES_POINTBASE,
	DBSYSTEMVALUES_POSTGRESQL: () => DBSYSTEMVALUES_POSTGRESQL,
	DBSYSTEMVALUES_PROGRESS: () => DBSYSTEMVALUES_PROGRESS,
	DBSYSTEMVALUES_REDIS: () => DBSYSTEMVALUES_REDIS,
	DBSYSTEMVALUES_REDSHIFT: () => DBSYSTEMVALUES_REDSHIFT,
	DBSYSTEMVALUES_SQLITE: () => DBSYSTEMVALUES_SQLITE,
	DBSYSTEMVALUES_SYBASE: () => DBSYSTEMVALUES_SYBASE,
	DBSYSTEMVALUES_TERADATA: () => DBSYSTEMVALUES_TERADATA,
	DBSYSTEMVALUES_VERTICA: () => DBSYSTEMVALUES_VERTICA,
	DB_SYSTEM_NAME_VALUE_MARIADB: () => DB_SYSTEM_NAME_VALUE_MARIADB,
	DB_SYSTEM_NAME_VALUE_MICROSOFT_SQL_SERVER: () => DB_SYSTEM_NAME_VALUE_MICROSOFT_SQL_SERVER,
	DB_SYSTEM_NAME_VALUE_MYSQL: () => DB_SYSTEM_NAME_VALUE_MYSQL,
	DB_SYSTEM_NAME_VALUE_POSTGRESQL: () => DB_SYSTEM_NAME_VALUE_POSTGRESQL,
	DEPLOYMENT_ENVIRONMENT_NAME_VALUE_DEVELOPMENT: () => DEPLOYMENT_ENVIRONMENT_NAME_VALUE_DEVELOPMENT,
	DEPLOYMENT_ENVIRONMENT_NAME_VALUE_PRODUCTION: () => DEPLOYMENT_ENVIRONMENT_NAME_VALUE_PRODUCTION,
	DEPLOYMENT_ENVIRONMENT_NAME_VALUE_STAGING: () => DEPLOYMENT_ENVIRONMENT_NAME_VALUE_STAGING,
	DEPLOYMENT_ENVIRONMENT_NAME_VALUE_TEST: () => DEPLOYMENT_ENVIRONMENT_NAME_VALUE_TEST,
	DOTNET_GC_HEAP_GENERATION_VALUE_GEN0: () => DOTNET_GC_HEAP_GENERATION_VALUE_GEN0,
	DOTNET_GC_HEAP_GENERATION_VALUE_GEN1: () => DOTNET_GC_HEAP_GENERATION_VALUE_GEN1,
	DOTNET_GC_HEAP_GENERATION_VALUE_GEN2: () => DOTNET_GC_HEAP_GENERATION_VALUE_GEN2,
	DOTNET_GC_HEAP_GENERATION_VALUE_LOH: () => "loh",
	DOTNET_GC_HEAP_GENERATION_VALUE_POH: () => "poh",
	DbCassandraConsistencyLevelValues: () => DbCassandraConsistencyLevelValues,
	DbSystemValues: () => DbSystemValues,
	ERROR_TYPE_VALUE_OTHER: () => ERROR_TYPE_VALUE_OTHER,
	EVENT_EXCEPTION: () => EVENT_EXCEPTION,
	FAASDOCUMENTOPERATIONVALUES_DELETE: () => FAASDOCUMENTOPERATIONVALUES_DELETE,
	FAASDOCUMENTOPERATIONVALUES_EDIT: () => FAASDOCUMENTOPERATIONVALUES_EDIT,
	FAASDOCUMENTOPERATIONVALUES_INSERT: () => FAASDOCUMENTOPERATIONVALUES_INSERT,
	FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD: () => FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD,
	FAASINVOKEDPROVIDERVALUES_AWS: () => "aws",
	FAASINVOKEDPROVIDERVALUES_AZURE: () => FAASINVOKEDPROVIDERVALUES_AZURE,
	FAASINVOKEDPROVIDERVALUES_GCP: () => "gcp",
	FAASTRIGGERVALUES_DATASOURCE: () => FAASTRIGGERVALUES_DATASOURCE,
	FAASTRIGGERVALUES_HTTP: () => FAASTRIGGERVALUES_HTTP,
	FAASTRIGGERVALUES_OTHER: () => FAASTRIGGERVALUES_OTHER,
	FAASTRIGGERVALUES_PUBSUB: () => FAASTRIGGERVALUES_PUBSUB,
	FAASTRIGGERVALUES_TIMER: () => FAASTRIGGERVALUES_TIMER,
	FaasDocumentOperationValues: () => FaasDocumentOperationValues,
	FaasInvokedProviderValues: () => FaasInvokedProviderValues,
	FaasTriggerValues: () => FaasTriggerValues,
	HOSTARCHVALUES_AMD64: () => HOSTARCHVALUES_AMD64,
	HOSTARCHVALUES_ARM32: () => HOSTARCHVALUES_ARM32,
	HOSTARCHVALUES_ARM64: () => HOSTARCHVALUES_ARM64,
	HOSTARCHVALUES_IA64: () => HOSTARCHVALUES_IA64,
	HOSTARCHVALUES_PPC32: () => HOSTARCHVALUES_PPC32,
	HOSTARCHVALUES_PPC64: () => HOSTARCHVALUES_PPC64,
	HOSTARCHVALUES_X86: () => "x86",
	HTTPFLAVORVALUES_HTTP_1_0: () => "1.0",
	HTTPFLAVORVALUES_HTTP_1_1: () => "1.1",
	HTTPFLAVORVALUES_HTTP_2_0: () => "2.0",
	HTTPFLAVORVALUES_QUIC: () => HTTPFLAVORVALUES_QUIC,
	HTTPFLAVORVALUES_SPDY: () => HTTPFLAVORVALUES_SPDY,
	HTTP_REQUEST_METHOD_VALUE_CONNECT: () => HTTP_REQUEST_METHOD_VALUE_CONNECT,
	HTTP_REQUEST_METHOD_VALUE_DELETE: () => HTTP_REQUEST_METHOD_VALUE_DELETE,
	HTTP_REQUEST_METHOD_VALUE_GET: () => "GET",
	HTTP_REQUEST_METHOD_VALUE_HEAD: () => HTTP_REQUEST_METHOD_VALUE_HEAD,
	HTTP_REQUEST_METHOD_VALUE_OPTIONS: () => HTTP_REQUEST_METHOD_VALUE_OPTIONS,
	HTTP_REQUEST_METHOD_VALUE_OTHER: () => HTTP_REQUEST_METHOD_VALUE_OTHER,
	HTTP_REQUEST_METHOD_VALUE_PATCH: () => HTTP_REQUEST_METHOD_VALUE_PATCH,
	HTTP_REQUEST_METHOD_VALUE_POST: () => HTTP_REQUEST_METHOD_VALUE_POST,
	HTTP_REQUEST_METHOD_VALUE_PUT: () => "PUT",
	HTTP_REQUEST_METHOD_VALUE_TRACE: () => HTTP_REQUEST_METHOD_VALUE_TRACE,
	HostArchValues: () => HostArchValues,
	HttpFlavorValues: () => HttpFlavorValues,
	JVM_MEMORY_TYPE_VALUE_HEAP: () => JVM_MEMORY_TYPE_VALUE_HEAP,
	JVM_MEMORY_TYPE_VALUE_NON_HEAP: () => JVM_MEMORY_TYPE_VALUE_NON_HEAP,
	JVM_THREAD_STATE_VALUE_BLOCKED: () => JVM_THREAD_STATE_VALUE_BLOCKED,
	JVM_THREAD_STATE_VALUE_NEW: () => "new",
	JVM_THREAD_STATE_VALUE_RUNNABLE: () => JVM_THREAD_STATE_VALUE_RUNNABLE,
	JVM_THREAD_STATE_VALUE_TERMINATED: () => JVM_THREAD_STATE_VALUE_TERMINATED,
	JVM_THREAD_STATE_VALUE_TIMED_WAITING: () => JVM_THREAD_STATE_VALUE_TIMED_WAITING,
	JVM_THREAD_STATE_VALUE_WAITING: () => JVM_THREAD_STATE_VALUE_WAITING,
	MESSAGETYPEVALUES_RECEIVED: () => MESSAGETYPEVALUES_RECEIVED,
	MESSAGETYPEVALUES_SENT: () => MESSAGETYPEVALUES_SENT,
	MESSAGINGDESTINATIONKINDVALUES_QUEUE: () => MESSAGINGDESTINATIONKINDVALUES_QUEUE,
	MESSAGINGDESTINATIONKINDVALUES_TOPIC: () => MESSAGINGDESTINATIONKINDVALUES_TOPIC,
	MESSAGINGOPERATIONVALUES_PROCESS: () => MESSAGINGOPERATIONVALUES_PROCESS,
	MESSAGINGOPERATIONVALUES_RECEIVE: () => MESSAGINGOPERATIONVALUES_RECEIVE,
	METRIC_ASPNETCORE_DIAGNOSTICS_EXCEPTIONS: () => METRIC_ASPNETCORE_DIAGNOSTICS_EXCEPTIONS,
	METRIC_ASPNETCORE_RATE_LIMITING_ACTIVE_REQUEST_LEASES: () => METRIC_ASPNETCORE_RATE_LIMITING_ACTIVE_REQUEST_LEASES,
	METRIC_ASPNETCORE_RATE_LIMITING_QUEUED_REQUESTS: () => METRIC_ASPNETCORE_RATE_LIMITING_QUEUED_REQUESTS,
	METRIC_ASPNETCORE_RATE_LIMITING_REQUESTS: () => METRIC_ASPNETCORE_RATE_LIMITING_REQUESTS,
	METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_LEASE_DURATION: () => METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_LEASE_DURATION,
	METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_TIME_IN_QUEUE: () => METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_TIME_IN_QUEUE,
	METRIC_ASPNETCORE_ROUTING_MATCH_ATTEMPTS: () => METRIC_ASPNETCORE_ROUTING_MATCH_ATTEMPTS,
	METRIC_DB_CLIENT_OPERATION_DURATION: () => METRIC_DB_CLIENT_OPERATION_DURATION,
	METRIC_DOTNET_ASSEMBLY_COUNT: () => METRIC_DOTNET_ASSEMBLY_COUNT,
	METRIC_DOTNET_EXCEPTIONS: () => METRIC_DOTNET_EXCEPTIONS,
	METRIC_DOTNET_GC_COLLECTIONS: () => METRIC_DOTNET_GC_COLLECTIONS,
	METRIC_DOTNET_GC_HEAP_TOTAL_ALLOCATED: () => METRIC_DOTNET_GC_HEAP_TOTAL_ALLOCATED,
	METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_FRAGMENTATION_SIZE: () => METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_FRAGMENTATION_SIZE,
	METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_SIZE: () => METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_SIZE,
	METRIC_DOTNET_GC_LAST_COLLECTION_MEMORY_COMMITTED_SIZE: () => METRIC_DOTNET_GC_LAST_COLLECTION_MEMORY_COMMITTED_SIZE,
	METRIC_DOTNET_GC_PAUSE_TIME: () => METRIC_DOTNET_GC_PAUSE_TIME,
	METRIC_DOTNET_JIT_COMPILATION_TIME: () => METRIC_DOTNET_JIT_COMPILATION_TIME,
	METRIC_DOTNET_JIT_COMPILED_IL_SIZE: () => METRIC_DOTNET_JIT_COMPILED_IL_SIZE,
	METRIC_DOTNET_JIT_COMPILED_METHODS: () => METRIC_DOTNET_JIT_COMPILED_METHODS,
	METRIC_DOTNET_MONITOR_LOCK_CONTENTIONS: () => METRIC_DOTNET_MONITOR_LOCK_CONTENTIONS,
	METRIC_DOTNET_PROCESS_CPU_COUNT: () => METRIC_DOTNET_PROCESS_CPU_COUNT,
	METRIC_DOTNET_PROCESS_CPU_TIME: () => METRIC_DOTNET_PROCESS_CPU_TIME,
	METRIC_DOTNET_PROCESS_MEMORY_WORKING_SET: () => METRIC_DOTNET_PROCESS_MEMORY_WORKING_SET,
	METRIC_DOTNET_THREAD_POOL_QUEUE_LENGTH: () => METRIC_DOTNET_THREAD_POOL_QUEUE_LENGTH,
	METRIC_DOTNET_THREAD_POOL_THREAD_COUNT: () => METRIC_DOTNET_THREAD_POOL_THREAD_COUNT,
	METRIC_DOTNET_THREAD_POOL_WORK_ITEM_COUNT: () => METRIC_DOTNET_THREAD_POOL_WORK_ITEM_COUNT,
	METRIC_DOTNET_TIMER_COUNT: () => METRIC_DOTNET_TIMER_COUNT,
	METRIC_HTTP_CLIENT_REQUEST_DURATION: () => METRIC_HTTP_CLIENT_REQUEST_DURATION,
	METRIC_HTTP_SERVER_REQUEST_DURATION: () => METRIC_HTTP_SERVER_REQUEST_DURATION,
	METRIC_JVM_CLASS_COUNT: () => METRIC_JVM_CLASS_COUNT,
	METRIC_JVM_CLASS_LOADED: () => METRIC_JVM_CLASS_LOADED,
	METRIC_JVM_CLASS_UNLOADED: () => METRIC_JVM_CLASS_UNLOADED,
	METRIC_JVM_CPU_COUNT: () => METRIC_JVM_CPU_COUNT,
	METRIC_JVM_CPU_RECENT_UTILIZATION: () => METRIC_JVM_CPU_RECENT_UTILIZATION,
	METRIC_JVM_CPU_TIME: () => METRIC_JVM_CPU_TIME,
	METRIC_JVM_GC_DURATION: () => METRIC_JVM_GC_DURATION,
	METRIC_JVM_MEMORY_COMMITTED: () => METRIC_JVM_MEMORY_COMMITTED,
	METRIC_JVM_MEMORY_LIMIT: () => METRIC_JVM_MEMORY_LIMIT,
	METRIC_JVM_MEMORY_USED: () => METRIC_JVM_MEMORY_USED,
	METRIC_JVM_MEMORY_USED_AFTER_LAST_GC: () => METRIC_JVM_MEMORY_USED_AFTER_LAST_GC,
	METRIC_JVM_THREAD_COUNT: () => METRIC_JVM_THREAD_COUNT,
	METRIC_KESTREL_ACTIVE_CONNECTIONS: () => METRIC_KESTREL_ACTIVE_CONNECTIONS,
	METRIC_KESTREL_ACTIVE_TLS_HANDSHAKES: () => METRIC_KESTREL_ACTIVE_TLS_HANDSHAKES,
	METRIC_KESTREL_CONNECTION_DURATION: () => METRIC_KESTREL_CONNECTION_DURATION,
	METRIC_KESTREL_QUEUED_CONNECTIONS: () => METRIC_KESTREL_QUEUED_CONNECTIONS,
	METRIC_KESTREL_QUEUED_REQUESTS: () => METRIC_KESTREL_QUEUED_REQUESTS,
	METRIC_KESTREL_REJECTED_CONNECTIONS: () => METRIC_KESTREL_REJECTED_CONNECTIONS,
	METRIC_KESTREL_TLS_HANDSHAKE_DURATION: () => METRIC_KESTREL_TLS_HANDSHAKE_DURATION,
	METRIC_KESTREL_UPGRADED_CONNECTIONS: () => METRIC_KESTREL_UPGRADED_CONNECTIONS,
	METRIC_SIGNALR_SERVER_ACTIVE_CONNECTIONS: () => METRIC_SIGNALR_SERVER_ACTIVE_CONNECTIONS,
	METRIC_SIGNALR_SERVER_CONNECTION_DURATION: () => METRIC_SIGNALR_SERVER_CONNECTION_DURATION,
	MessageTypeValues: () => MessageTypeValues,
	MessagingDestinationKindValues: () => MessagingDestinationKindValues,
	MessagingOperationValues: () => MessagingOperationValues,
	NETHOSTCONNECTIONSUBTYPEVALUES_CDMA: () => NETHOSTCONNECTIONSUBTYPEVALUES_CDMA,
	NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT: () => NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT,
	NETHOSTCONNECTIONSUBTYPEVALUES_EDGE: () => NETHOSTCONNECTIONSUBTYPEVALUES_EDGE,
	NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD: () => NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD,
	NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0: () => NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0,
	NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A: () => NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A,
	NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B: () => NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B,
	NETHOSTCONNECTIONSUBTYPEVALUES_GPRS: () => NETHOSTCONNECTIONSUBTYPEVALUES_GPRS,
	NETHOSTCONNECTIONSUBTYPEVALUES_GSM: () => "gsm",
	NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA: () => NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA,
	NETHOSTCONNECTIONSUBTYPEVALUES_HSPA: () => NETHOSTCONNECTIONSUBTYPEVALUES_HSPA,
	NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP: () => NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP,
	NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA: () => NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA,
	NETHOSTCONNECTIONSUBTYPEVALUES_IDEN: () => NETHOSTCONNECTIONSUBTYPEVALUES_IDEN,
	NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN: () => NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN,
	NETHOSTCONNECTIONSUBTYPEVALUES_LTE: () => "lte",
	NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA: () => NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA,
	NETHOSTCONNECTIONSUBTYPEVALUES_NR: () => "nr",
	NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA: () => NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA,
	NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA: () => NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA,
	NETHOSTCONNECTIONSUBTYPEVALUES_UMTS: () => NETHOSTCONNECTIONSUBTYPEVALUES_UMTS,
	NETHOSTCONNECTIONTYPEVALUES_CELL: () => NETHOSTCONNECTIONTYPEVALUES_CELL,
	NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE: () => NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE,
	NETHOSTCONNECTIONTYPEVALUES_UNKNOWN: () => NETHOSTCONNECTIONTYPEVALUES_UNKNOWN,
	NETHOSTCONNECTIONTYPEVALUES_WIFI: () => NETHOSTCONNECTIONTYPEVALUES_WIFI,
	NETHOSTCONNECTIONTYPEVALUES_WIRED: () => NETHOSTCONNECTIONTYPEVALUES_WIRED,
	NETTRANSPORTVALUES_INPROC: () => NETTRANSPORTVALUES_INPROC,
	NETTRANSPORTVALUES_IP: () => "ip",
	NETTRANSPORTVALUES_IP_TCP: () => NETTRANSPORTVALUES_IP_TCP,
	NETTRANSPORTVALUES_IP_UDP: () => NETTRANSPORTVALUES_IP_UDP,
	NETTRANSPORTVALUES_OTHER: () => NETTRANSPORTVALUES_OTHER,
	NETTRANSPORTVALUES_PIPE: () => NETTRANSPORTVALUES_PIPE,
	NETTRANSPORTVALUES_UNIX: () => NETTRANSPORTVALUES_UNIX,
	NETWORK_TRANSPORT_VALUE_PIPE: () => NETWORK_TRANSPORT_VALUE_PIPE,
	NETWORK_TRANSPORT_VALUE_QUIC: () => NETWORK_TRANSPORT_VALUE_QUIC,
	NETWORK_TRANSPORT_VALUE_TCP: () => "tcp",
	NETWORK_TRANSPORT_VALUE_UDP: () => "udp",
	NETWORK_TRANSPORT_VALUE_UNIX: () => NETWORK_TRANSPORT_VALUE_UNIX,
	NETWORK_TYPE_VALUE_IPV4: () => NETWORK_TYPE_VALUE_IPV4,
	NETWORK_TYPE_VALUE_IPV6: () => NETWORK_TYPE_VALUE_IPV6,
	NetHostConnectionSubtypeValues: () => NetHostConnectionSubtypeValues,
	NetHostConnectionTypeValues: () => NetHostConnectionTypeValues,
	NetTransportValues: () => NetTransportValues,
	OSTYPEVALUES_AIX: () => "aix",
	OSTYPEVALUES_DARWIN: () => OSTYPEVALUES_DARWIN,
	OSTYPEVALUES_DRAGONFLYBSD: () => OSTYPEVALUES_DRAGONFLYBSD,
	OSTYPEVALUES_FREEBSD: () => OSTYPEVALUES_FREEBSD,
	OSTYPEVALUES_HPUX: () => OSTYPEVALUES_HPUX,
	OSTYPEVALUES_LINUX: () => OSTYPEVALUES_LINUX,
	OSTYPEVALUES_NETBSD: () => OSTYPEVALUES_NETBSD,
	OSTYPEVALUES_OPENBSD: () => OSTYPEVALUES_OPENBSD,
	OSTYPEVALUES_SOLARIS: () => OSTYPEVALUES_SOLARIS,
	OSTYPEVALUES_WINDOWS: () => OSTYPEVALUES_WINDOWS,
	OSTYPEVALUES_Z_OS: () => OSTYPEVALUES_Z_OS,
	OTEL_STATUS_CODE_VALUE_ERROR: () => OTEL_STATUS_CODE_VALUE_ERROR,
	OTEL_STATUS_CODE_VALUE_OK: () => "OK",
	OsTypeValues: () => OsTypeValues,
	RPCGRPCSTATUSCODEVALUES_ABORTED: () => 10,
	RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS: () => 6,
	RPCGRPCSTATUSCODEVALUES_CANCELLED: () => 1,
	RPCGRPCSTATUSCODEVALUES_DATA_LOSS: () => 15,
	RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED: () => 4,
	RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION: () => 9,
	RPCGRPCSTATUSCODEVALUES_INTERNAL: () => 13,
	RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT: () => 3,
	RPCGRPCSTATUSCODEVALUES_NOT_FOUND: () => 5,
	RPCGRPCSTATUSCODEVALUES_OK: () => 0,
	RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE: () => 11,
	RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED: () => 7,
	RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED: () => 8,
	RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED: () => 16,
	RPCGRPCSTATUSCODEVALUES_UNAVAILABLE: () => 14,
	RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED: () => 12,
	RPCGRPCSTATUSCODEVALUES_UNKNOWN: () => 2,
	RpcGrpcStatusCodeValues: () => RpcGrpcStatusCodeValues,
	SEMATTRS_AWS_DYNAMODB_ATTRIBUTES_TO_GET: () => SEMATTRS_AWS_DYNAMODB_ATTRIBUTES_TO_GET,
	SEMATTRS_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS: () => SEMATTRS_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS,
	SEMATTRS_AWS_DYNAMODB_CONSISTENT_READ: () => SEMATTRS_AWS_DYNAMODB_CONSISTENT_READ,
	SEMATTRS_AWS_DYNAMODB_CONSUMED_CAPACITY: () => SEMATTRS_AWS_DYNAMODB_CONSUMED_CAPACITY,
	SEMATTRS_AWS_DYNAMODB_COUNT: () => SEMATTRS_AWS_DYNAMODB_COUNT,
	SEMATTRS_AWS_DYNAMODB_EXCLUSIVE_START_TABLE: () => SEMATTRS_AWS_DYNAMODB_EXCLUSIVE_START_TABLE,
	SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES: () => SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES,
	SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES: () => SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES,
	SEMATTRS_AWS_DYNAMODB_INDEX_NAME: () => SEMATTRS_AWS_DYNAMODB_INDEX_NAME,
	SEMATTRS_AWS_DYNAMODB_ITEM_COLLECTION_METRICS: () => SEMATTRS_AWS_DYNAMODB_ITEM_COLLECTION_METRICS,
	SEMATTRS_AWS_DYNAMODB_LIMIT: () => SEMATTRS_AWS_DYNAMODB_LIMIT,
	SEMATTRS_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES: () => SEMATTRS_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES,
	SEMATTRS_AWS_DYNAMODB_PROJECTION: () => SEMATTRS_AWS_DYNAMODB_PROJECTION,
	SEMATTRS_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY: () => SEMATTRS_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY,
	SEMATTRS_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY: () => SEMATTRS_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY,
	SEMATTRS_AWS_DYNAMODB_SCANNED_COUNT: () => SEMATTRS_AWS_DYNAMODB_SCANNED_COUNT,
	SEMATTRS_AWS_DYNAMODB_SCAN_FORWARD: () => SEMATTRS_AWS_DYNAMODB_SCAN_FORWARD,
	SEMATTRS_AWS_DYNAMODB_SEGMENT: () => SEMATTRS_AWS_DYNAMODB_SEGMENT,
	SEMATTRS_AWS_DYNAMODB_SELECT: () => SEMATTRS_AWS_DYNAMODB_SELECT,
	SEMATTRS_AWS_DYNAMODB_TABLE_COUNT: () => SEMATTRS_AWS_DYNAMODB_TABLE_COUNT,
	SEMATTRS_AWS_DYNAMODB_TABLE_NAMES: () => SEMATTRS_AWS_DYNAMODB_TABLE_NAMES,
	SEMATTRS_AWS_DYNAMODB_TOTAL_SEGMENTS: () => SEMATTRS_AWS_DYNAMODB_TOTAL_SEGMENTS,
	SEMATTRS_AWS_LAMBDA_INVOKED_ARN: () => SEMATTRS_AWS_LAMBDA_INVOKED_ARN,
	SEMATTRS_CODE_FILEPATH: () => SEMATTRS_CODE_FILEPATH,
	SEMATTRS_CODE_FUNCTION: () => SEMATTRS_CODE_FUNCTION,
	SEMATTRS_CODE_LINENO: () => SEMATTRS_CODE_LINENO,
	SEMATTRS_CODE_NAMESPACE: () => SEMATTRS_CODE_NAMESPACE,
	SEMATTRS_DB_CASSANDRA_CONSISTENCY_LEVEL: () => SEMATTRS_DB_CASSANDRA_CONSISTENCY_LEVEL,
	SEMATTRS_DB_CASSANDRA_COORDINATOR_DC: () => SEMATTRS_DB_CASSANDRA_COORDINATOR_DC,
	SEMATTRS_DB_CASSANDRA_COORDINATOR_ID: () => SEMATTRS_DB_CASSANDRA_COORDINATOR_ID,
	SEMATTRS_DB_CASSANDRA_IDEMPOTENCE: () => SEMATTRS_DB_CASSANDRA_IDEMPOTENCE,
	SEMATTRS_DB_CASSANDRA_KEYSPACE: () => SEMATTRS_DB_CASSANDRA_KEYSPACE,
	SEMATTRS_DB_CASSANDRA_PAGE_SIZE: () => SEMATTRS_DB_CASSANDRA_PAGE_SIZE,
	SEMATTRS_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT: () => SEMATTRS_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT,
	SEMATTRS_DB_CASSANDRA_TABLE: () => SEMATTRS_DB_CASSANDRA_TABLE,
	SEMATTRS_DB_CONNECTION_STRING: () => SEMATTRS_DB_CONNECTION_STRING,
	SEMATTRS_DB_HBASE_NAMESPACE: () => SEMATTRS_DB_HBASE_NAMESPACE,
	SEMATTRS_DB_JDBC_DRIVER_CLASSNAME: () => SEMATTRS_DB_JDBC_DRIVER_CLASSNAME,
	SEMATTRS_DB_MONGODB_COLLECTION: () => SEMATTRS_DB_MONGODB_COLLECTION,
	SEMATTRS_DB_MSSQL_INSTANCE_NAME: () => SEMATTRS_DB_MSSQL_INSTANCE_NAME,
	SEMATTRS_DB_NAME: () => SEMATTRS_DB_NAME,
	SEMATTRS_DB_OPERATION: () => SEMATTRS_DB_OPERATION,
	SEMATTRS_DB_REDIS_DATABASE_INDEX: () => SEMATTRS_DB_REDIS_DATABASE_INDEX,
	SEMATTRS_DB_SQL_TABLE: () => SEMATTRS_DB_SQL_TABLE,
	SEMATTRS_DB_STATEMENT: () => SEMATTRS_DB_STATEMENT,
	SEMATTRS_DB_SYSTEM: () => SEMATTRS_DB_SYSTEM,
	SEMATTRS_DB_USER: () => SEMATTRS_DB_USER,
	SEMATTRS_ENDUSER_ID: () => SEMATTRS_ENDUSER_ID,
	SEMATTRS_ENDUSER_ROLE: () => SEMATTRS_ENDUSER_ROLE,
	SEMATTRS_ENDUSER_SCOPE: () => SEMATTRS_ENDUSER_SCOPE,
	SEMATTRS_EXCEPTION_ESCAPED: () => SEMATTRS_EXCEPTION_ESCAPED,
	SEMATTRS_EXCEPTION_MESSAGE: () => SEMATTRS_EXCEPTION_MESSAGE,
	SEMATTRS_EXCEPTION_STACKTRACE: () => SEMATTRS_EXCEPTION_STACKTRACE,
	SEMATTRS_EXCEPTION_TYPE: () => SEMATTRS_EXCEPTION_TYPE,
	SEMATTRS_FAAS_COLDSTART: () => SEMATTRS_FAAS_COLDSTART,
	SEMATTRS_FAAS_CRON: () => SEMATTRS_FAAS_CRON,
	SEMATTRS_FAAS_DOCUMENT_COLLECTION: () => SEMATTRS_FAAS_DOCUMENT_COLLECTION,
	SEMATTRS_FAAS_DOCUMENT_NAME: () => SEMATTRS_FAAS_DOCUMENT_NAME,
	SEMATTRS_FAAS_DOCUMENT_OPERATION: () => SEMATTRS_FAAS_DOCUMENT_OPERATION,
	SEMATTRS_FAAS_DOCUMENT_TIME: () => SEMATTRS_FAAS_DOCUMENT_TIME,
	SEMATTRS_FAAS_EXECUTION: () => SEMATTRS_FAAS_EXECUTION,
	SEMATTRS_FAAS_INVOKED_NAME: () => SEMATTRS_FAAS_INVOKED_NAME,
	SEMATTRS_FAAS_INVOKED_PROVIDER: () => SEMATTRS_FAAS_INVOKED_PROVIDER,
	SEMATTRS_FAAS_INVOKED_REGION: () => SEMATTRS_FAAS_INVOKED_REGION,
	SEMATTRS_FAAS_TIME: () => SEMATTRS_FAAS_TIME,
	SEMATTRS_FAAS_TRIGGER: () => SEMATTRS_FAAS_TRIGGER,
	SEMATTRS_HTTP_CLIENT_IP: () => SEMATTRS_HTTP_CLIENT_IP,
	SEMATTRS_HTTP_FLAVOR: () => SEMATTRS_HTTP_FLAVOR,
	SEMATTRS_HTTP_HOST: () => SEMATTRS_HTTP_HOST,
	SEMATTRS_HTTP_METHOD: () => SEMATTRS_HTTP_METHOD,
	SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH: () => SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH,
	SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED: () => SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED,
	SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH: () => SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH,
	SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED: () => SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED,
	SEMATTRS_HTTP_ROUTE: () => SEMATTRS_HTTP_ROUTE,
	SEMATTRS_HTTP_SCHEME: () => SEMATTRS_HTTP_SCHEME,
	SEMATTRS_HTTP_SERVER_NAME: () => SEMATTRS_HTTP_SERVER_NAME,
	SEMATTRS_HTTP_STATUS_CODE: () => SEMATTRS_HTTP_STATUS_CODE,
	SEMATTRS_HTTP_TARGET: () => SEMATTRS_HTTP_TARGET,
	SEMATTRS_HTTP_URL: () => SEMATTRS_HTTP_URL,
	SEMATTRS_HTTP_USER_AGENT: () => SEMATTRS_HTTP_USER_AGENT,
	SEMATTRS_MESSAGE_COMPRESSED_SIZE: () => SEMATTRS_MESSAGE_COMPRESSED_SIZE,
	SEMATTRS_MESSAGE_ID: () => SEMATTRS_MESSAGE_ID,
	SEMATTRS_MESSAGE_TYPE: () => SEMATTRS_MESSAGE_TYPE,
	SEMATTRS_MESSAGE_UNCOMPRESSED_SIZE: () => SEMATTRS_MESSAGE_UNCOMPRESSED_SIZE,
	SEMATTRS_MESSAGING_CONSUMER_ID: () => SEMATTRS_MESSAGING_CONSUMER_ID,
	SEMATTRS_MESSAGING_CONVERSATION_ID: () => SEMATTRS_MESSAGING_CONVERSATION_ID,
	SEMATTRS_MESSAGING_DESTINATION: () => SEMATTRS_MESSAGING_DESTINATION,
	SEMATTRS_MESSAGING_DESTINATION_KIND: () => SEMATTRS_MESSAGING_DESTINATION_KIND,
	SEMATTRS_MESSAGING_KAFKA_CLIENT_ID: () => SEMATTRS_MESSAGING_KAFKA_CLIENT_ID,
	SEMATTRS_MESSAGING_KAFKA_CONSUMER_GROUP: () => SEMATTRS_MESSAGING_KAFKA_CONSUMER_GROUP,
	SEMATTRS_MESSAGING_KAFKA_MESSAGE_KEY: () => SEMATTRS_MESSAGING_KAFKA_MESSAGE_KEY,
	SEMATTRS_MESSAGING_KAFKA_PARTITION: () => SEMATTRS_MESSAGING_KAFKA_PARTITION,
	SEMATTRS_MESSAGING_KAFKA_TOMBSTONE: () => SEMATTRS_MESSAGING_KAFKA_TOMBSTONE,
	SEMATTRS_MESSAGING_MESSAGE_ID: () => SEMATTRS_MESSAGING_MESSAGE_ID,
	SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES: () => SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES,
	SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES: () => SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES,
	SEMATTRS_MESSAGING_OPERATION: () => SEMATTRS_MESSAGING_OPERATION,
	SEMATTRS_MESSAGING_PROTOCOL: () => SEMATTRS_MESSAGING_PROTOCOL,
	SEMATTRS_MESSAGING_PROTOCOL_VERSION: () => SEMATTRS_MESSAGING_PROTOCOL_VERSION,
	SEMATTRS_MESSAGING_RABBITMQ_ROUTING_KEY: () => SEMATTRS_MESSAGING_RABBITMQ_ROUTING_KEY,
	SEMATTRS_MESSAGING_SYSTEM: () => SEMATTRS_MESSAGING_SYSTEM,
	SEMATTRS_MESSAGING_TEMP_DESTINATION: () => SEMATTRS_MESSAGING_TEMP_DESTINATION,
	SEMATTRS_MESSAGING_URL: () => SEMATTRS_MESSAGING_URL,
	SEMATTRS_NET_HOST_CARRIER_ICC: () => SEMATTRS_NET_HOST_CARRIER_ICC,
	SEMATTRS_NET_HOST_CARRIER_MCC: () => SEMATTRS_NET_HOST_CARRIER_MCC,
	SEMATTRS_NET_HOST_CARRIER_MNC: () => SEMATTRS_NET_HOST_CARRIER_MNC,
	SEMATTRS_NET_HOST_CARRIER_NAME: () => SEMATTRS_NET_HOST_CARRIER_NAME,
	SEMATTRS_NET_HOST_CONNECTION_SUBTYPE: () => SEMATTRS_NET_HOST_CONNECTION_SUBTYPE,
	SEMATTRS_NET_HOST_CONNECTION_TYPE: () => SEMATTRS_NET_HOST_CONNECTION_TYPE,
	SEMATTRS_NET_HOST_IP: () => SEMATTRS_NET_HOST_IP,
	SEMATTRS_NET_HOST_NAME: () => SEMATTRS_NET_HOST_NAME,
	SEMATTRS_NET_HOST_PORT: () => SEMATTRS_NET_HOST_PORT,
	SEMATTRS_NET_PEER_IP: () => SEMATTRS_NET_PEER_IP,
	SEMATTRS_NET_PEER_NAME: () => SEMATTRS_NET_PEER_NAME,
	SEMATTRS_NET_PEER_PORT: () => SEMATTRS_NET_PEER_PORT,
	SEMATTRS_NET_TRANSPORT: () => SEMATTRS_NET_TRANSPORT,
	SEMATTRS_PEER_SERVICE: () => SEMATTRS_PEER_SERVICE,
	SEMATTRS_RPC_GRPC_STATUS_CODE: () => SEMATTRS_RPC_GRPC_STATUS_CODE,
	SEMATTRS_RPC_JSONRPC_ERROR_CODE: () => SEMATTRS_RPC_JSONRPC_ERROR_CODE,
	SEMATTRS_RPC_JSONRPC_ERROR_MESSAGE: () => SEMATTRS_RPC_JSONRPC_ERROR_MESSAGE,
	SEMATTRS_RPC_JSONRPC_REQUEST_ID: () => SEMATTRS_RPC_JSONRPC_REQUEST_ID,
	SEMATTRS_RPC_JSONRPC_VERSION: () => SEMATTRS_RPC_JSONRPC_VERSION,
	SEMATTRS_RPC_METHOD: () => SEMATTRS_RPC_METHOD,
	SEMATTRS_RPC_SERVICE: () => SEMATTRS_RPC_SERVICE,
	SEMATTRS_RPC_SYSTEM: () => SEMATTRS_RPC_SYSTEM,
	SEMATTRS_THREAD_ID: () => SEMATTRS_THREAD_ID,
	SEMATTRS_THREAD_NAME: () => SEMATTRS_THREAD_NAME,
	SEMRESATTRS_AWS_ECS_CLUSTER_ARN: () => SEMRESATTRS_AWS_ECS_CLUSTER_ARN,
	SEMRESATTRS_AWS_ECS_CONTAINER_ARN: () => SEMRESATTRS_AWS_ECS_CONTAINER_ARN,
	SEMRESATTRS_AWS_ECS_LAUNCHTYPE: () => SEMRESATTRS_AWS_ECS_LAUNCHTYPE,
	SEMRESATTRS_AWS_ECS_TASK_ARN: () => SEMRESATTRS_AWS_ECS_TASK_ARN,
	SEMRESATTRS_AWS_ECS_TASK_FAMILY: () => SEMRESATTRS_AWS_ECS_TASK_FAMILY,
	SEMRESATTRS_AWS_ECS_TASK_REVISION: () => SEMRESATTRS_AWS_ECS_TASK_REVISION,
	SEMRESATTRS_AWS_EKS_CLUSTER_ARN: () => SEMRESATTRS_AWS_EKS_CLUSTER_ARN,
	SEMRESATTRS_AWS_LOG_GROUP_ARNS: () => SEMRESATTRS_AWS_LOG_GROUP_ARNS,
	SEMRESATTRS_AWS_LOG_GROUP_NAMES: () => SEMRESATTRS_AWS_LOG_GROUP_NAMES,
	SEMRESATTRS_AWS_LOG_STREAM_ARNS: () => SEMRESATTRS_AWS_LOG_STREAM_ARNS,
	SEMRESATTRS_AWS_LOG_STREAM_NAMES: () => SEMRESATTRS_AWS_LOG_STREAM_NAMES,
	SEMRESATTRS_CLOUD_ACCOUNT_ID: () => SEMRESATTRS_CLOUD_ACCOUNT_ID,
	SEMRESATTRS_CLOUD_AVAILABILITY_ZONE: () => SEMRESATTRS_CLOUD_AVAILABILITY_ZONE,
	SEMRESATTRS_CLOUD_PLATFORM: () => SEMRESATTRS_CLOUD_PLATFORM,
	SEMRESATTRS_CLOUD_PROVIDER: () => SEMRESATTRS_CLOUD_PROVIDER,
	SEMRESATTRS_CLOUD_REGION: () => SEMRESATTRS_CLOUD_REGION,
	SEMRESATTRS_CONTAINER_ID: () => SEMRESATTRS_CONTAINER_ID,
	SEMRESATTRS_CONTAINER_IMAGE_NAME: () => SEMRESATTRS_CONTAINER_IMAGE_NAME,
	SEMRESATTRS_CONTAINER_IMAGE_TAG: () => SEMRESATTRS_CONTAINER_IMAGE_TAG,
	SEMRESATTRS_CONTAINER_NAME: () => SEMRESATTRS_CONTAINER_NAME,
	SEMRESATTRS_CONTAINER_RUNTIME: () => SEMRESATTRS_CONTAINER_RUNTIME,
	SEMRESATTRS_DEPLOYMENT_ENVIRONMENT: () => SEMRESATTRS_DEPLOYMENT_ENVIRONMENT,
	SEMRESATTRS_DEVICE_ID: () => SEMRESATTRS_DEVICE_ID,
	SEMRESATTRS_DEVICE_MODEL_IDENTIFIER: () => SEMRESATTRS_DEVICE_MODEL_IDENTIFIER,
	SEMRESATTRS_DEVICE_MODEL_NAME: () => SEMRESATTRS_DEVICE_MODEL_NAME,
	SEMRESATTRS_FAAS_ID: () => SEMRESATTRS_FAAS_ID,
	SEMRESATTRS_FAAS_INSTANCE: () => SEMRESATTRS_FAAS_INSTANCE,
	SEMRESATTRS_FAAS_MAX_MEMORY: () => SEMRESATTRS_FAAS_MAX_MEMORY,
	SEMRESATTRS_FAAS_NAME: () => SEMRESATTRS_FAAS_NAME,
	SEMRESATTRS_FAAS_VERSION: () => SEMRESATTRS_FAAS_VERSION,
	SEMRESATTRS_HOST_ARCH: () => SEMRESATTRS_HOST_ARCH,
	SEMRESATTRS_HOST_ID: () => SEMRESATTRS_HOST_ID,
	SEMRESATTRS_HOST_IMAGE_ID: () => SEMRESATTRS_HOST_IMAGE_ID,
	SEMRESATTRS_HOST_IMAGE_NAME: () => SEMRESATTRS_HOST_IMAGE_NAME,
	SEMRESATTRS_HOST_IMAGE_VERSION: () => SEMRESATTRS_HOST_IMAGE_VERSION,
	SEMRESATTRS_HOST_NAME: () => SEMRESATTRS_HOST_NAME,
	SEMRESATTRS_HOST_TYPE: () => SEMRESATTRS_HOST_TYPE,
	SEMRESATTRS_K8S_CLUSTER_NAME: () => SEMRESATTRS_K8S_CLUSTER_NAME,
	SEMRESATTRS_K8S_CONTAINER_NAME: () => SEMRESATTRS_K8S_CONTAINER_NAME,
	SEMRESATTRS_K8S_CRONJOB_NAME: () => SEMRESATTRS_K8S_CRONJOB_NAME,
	SEMRESATTRS_K8S_CRONJOB_UID: () => SEMRESATTRS_K8S_CRONJOB_UID,
	SEMRESATTRS_K8S_DAEMONSET_NAME: () => SEMRESATTRS_K8S_DAEMONSET_NAME,
	SEMRESATTRS_K8S_DAEMONSET_UID: () => SEMRESATTRS_K8S_DAEMONSET_UID,
	SEMRESATTRS_K8S_DEPLOYMENT_NAME: () => SEMRESATTRS_K8S_DEPLOYMENT_NAME,
	SEMRESATTRS_K8S_DEPLOYMENT_UID: () => SEMRESATTRS_K8S_DEPLOYMENT_UID,
	SEMRESATTRS_K8S_JOB_NAME: () => SEMRESATTRS_K8S_JOB_NAME,
	SEMRESATTRS_K8S_JOB_UID: () => SEMRESATTRS_K8S_JOB_UID,
	SEMRESATTRS_K8S_NAMESPACE_NAME: () => SEMRESATTRS_K8S_NAMESPACE_NAME,
	SEMRESATTRS_K8S_NODE_NAME: () => SEMRESATTRS_K8S_NODE_NAME,
	SEMRESATTRS_K8S_NODE_UID: () => SEMRESATTRS_K8S_NODE_UID,
	SEMRESATTRS_K8S_POD_NAME: () => SEMRESATTRS_K8S_POD_NAME,
	SEMRESATTRS_K8S_POD_UID: () => SEMRESATTRS_K8S_POD_UID,
	SEMRESATTRS_K8S_REPLICASET_NAME: () => SEMRESATTRS_K8S_REPLICASET_NAME,
	SEMRESATTRS_K8S_REPLICASET_UID: () => SEMRESATTRS_K8S_REPLICASET_UID,
	SEMRESATTRS_K8S_STATEFULSET_NAME: () => SEMRESATTRS_K8S_STATEFULSET_NAME,
	SEMRESATTRS_K8S_STATEFULSET_UID: () => SEMRESATTRS_K8S_STATEFULSET_UID,
	SEMRESATTRS_OS_DESCRIPTION: () => SEMRESATTRS_OS_DESCRIPTION,
	SEMRESATTRS_OS_NAME: () => SEMRESATTRS_OS_NAME,
	SEMRESATTRS_OS_TYPE: () => SEMRESATTRS_OS_TYPE,
	SEMRESATTRS_OS_VERSION: () => SEMRESATTRS_OS_VERSION,
	SEMRESATTRS_PROCESS_COMMAND: () => SEMRESATTRS_PROCESS_COMMAND,
	SEMRESATTRS_PROCESS_COMMAND_ARGS: () => SEMRESATTRS_PROCESS_COMMAND_ARGS,
	SEMRESATTRS_PROCESS_COMMAND_LINE: () => SEMRESATTRS_PROCESS_COMMAND_LINE,
	SEMRESATTRS_PROCESS_EXECUTABLE_NAME: () => SEMRESATTRS_PROCESS_EXECUTABLE_NAME,
	SEMRESATTRS_PROCESS_EXECUTABLE_PATH: () => SEMRESATTRS_PROCESS_EXECUTABLE_PATH,
	SEMRESATTRS_PROCESS_OWNER: () => SEMRESATTRS_PROCESS_OWNER,
	SEMRESATTRS_PROCESS_PID: () => SEMRESATTRS_PROCESS_PID,
	SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION: () => SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION,
	SEMRESATTRS_PROCESS_RUNTIME_NAME: () => SEMRESATTRS_PROCESS_RUNTIME_NAME,
	SEMRESATTRS_PROCESS_RUNTIME_VERSION: () => SEMRESATTRS_PROCESS_RUNTIME_VERSION,
	SEMRESATTRS_SERVICE_INSTANCE_ID: () => SEMRESATTRS_SERVICE_INSTANCE_ID,
	SEMRESATTRS_SERVICE_NAME: () => SEMRESATTRS_SERVICE_NAME,
	SEMRESATTRS_SERVICE_NAMESPACE: () => SEMRESATTRS_SERVICE_NAMESPACE,
	SEMRESATTRS_SERVICE_VERSION: () => SEMRESATTRS_SERVICE_VERSION,
	SEMRESATTRS_TELEMETRY_AUTO_VERSION: () => SEMRESATTRS_TELEMETRY_AUTO_VERSION,
	SEMRESATTRS_TELEMETRY_SDK_LANGUAGE: () => SEMRESATTRS_TELEMETRY_SDK_LANGUAGE,
	SEMRESATTRS_TELEMETRY_SDK_NAME: () => SEMRESATTRS_TELEMETRY_SDK_NAME,
	SEMRESATTRS_TELEMETRY_SDK_VERSION: () => SEMRESATTRS_TELEMETRY_SDK_VERSION,
	SEMRESATTRS_WEBENGINE_DESCRIPTION: () => SEMRESATTRS_WEBENGINE_DESCRIPTION,
	SEMRESATTRS_WEBENGINE_NAME: () => SEMRESATTRS_WEBENGINE_NAME,
	SEMRESATTRS_WEBENGINE_VERSION: () => SEMRESATTRS_WEBENGINE_VERSION,
	SIGNALR_CONNECTION_STATUS_VALUE_APP_SHUTDOWN: () => SIGNALR_CONNECTION_STATUS_VALUE_APP_SHUTDOWN,
	SIGNALR_CONNECTION_STATUS_VALUE_NORMAL_CLOSURE: () => SIGNALR_CONNECTION_STATUS_VALUE_NORMAL_CLOSURE,
	SIGNALR_CONNECTION_STATUS_VALUE_TIMEOUT: () => SIGNALR_CONNECTION_STATUS_VALUE_TIMEOUT,
	SIGNALR_TRANSPORT_VALUE_LONG_POLLING: () => SIGNALR_TRANSPORT_VALUE_LONG_POLLING,
	SIGNALR_TRANSPORT_VALUE_SERVER_SENT_EVENTS: () => SIGNALR_TRANSPORT_VALUE_SERVER_SENT_EVENTS,
	SIGNALR_TRANSPORT_VALUE_WEB_SOCKETS: () => SIGNALR_TRANSPORT_VALUE_WEB_SOCKETS,
	SemanticAttributes: () => SemanticAttributes,
	SemanticResourceAttributes: () => SemanticResourceAttributes,
	TELEMETRYSDKLANGUAGEVALUES_CPP: () => "cpp",
	TELEMETRYSDKLANGUAGEVALUES_DOTNET: () => TELEMETRYSDKLANGUAGEVALUES_DOTNET,
	TELEMETRYSDKLANGUAGEVALUES_ERLANG: () => TELEMETRYSDKLANGUAGEVALUES_ERLANG,
	TELEMETRYSDKLANGUAGEVALUES_GO: () => "go",
	TELEMETRYSDKLANGUAGEVALUES_JAVA: () => TELEMETRYSDKLANGUAGEVALUES_JAVA,
	TELEMETRYSDKLANGUAGEVALUES_NODEJS: () => TELEMETRYSDKLANGUAGEVALUES_NODEJS,
	TELEMETRYSDKLANGUAGEVALUES_PHP: () => "php",
	TELEMETRYSDKLANGUAGEVALUES_PYTHON: () => TELEMETRYSDKLANGUAGEVALUES_PYTHON,
	TELEMETRYSDKLANGUAGEVALUES_RUBY: () => TELEMETRYSDKLANGUAGEVALUES_RUBY,
	TELEMETRYSDKLANGUAGEVALUES_WEBJS: () => TELEMETRYSDKLANGUAGEVALUES_WEBJS,
	TELEMETRY_SDK_LANGUAGE_VALUE_CPP: () => "cpp",
	TELEMETRY_SDK_LANGUAGE_VALUE_DOTNET: () => TELEMETRY_SDK_LANGUAGE_VALUE_DOTNET,
	TELEMETRY_SDK_LANGUAGE_VALUE_ERLANG: () => TELEMETRY_SDK_LANGUAGE_VALUE_ERLANG,
	TELEMETRY_SDK_LANGUAGE_VALUE_GO: () => "go",
	TELEMETRY_SDK_LANGUAGE_VALUE_JAVA: () => TELEMETRY_SDK_LANGUAGE_VALUE_JAVA,
	TELEMETRY_SDK_LANGUAGE_VALUE_KOTLIN: () => TELEMETRY_SDK_LANGUAGE_VALUE_KOTLIN,
	TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS: () => TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS,
	TELEMETRY_SDK_LANGUAGE_VALUE_PHP: () => "php",
	TELEMETRY_SDK_LANGUAGE_VALUE_PYTHON: () => TELEMETRY_SDK_LANGUAGE_VALUE_PYTHON,
	TELEMETRY_SDK_LANGUAGE_VALUE_RUBY: () => TELEMETRY_SDK_LANGUAGE_VALUE_RUBY,
	TELEMETRY_SDK_LANGUAGE_VALUE_RUST: () => TELEMETRY_SDK_LANGUAGE_VALUE_RUST,
	TELEMETRY_SDK_LANGUAGE_VALUE_SWIFT: () => TELEMETRY_SDK_LANGUAGE_VALUE_SWIFT,
	TELEMETRY_SDK_LANGUAGE_VALUE_WEBJS: () => TELEMETRY_SDK_LANGUAGE_VALUE_WEBJS,
	TelemetrySdkLanguageValues: () => TelemetrySdkLanguageValues
});
var init_esm$1 = __esmMin((() => {
	init_trace();
	init_resource();
	init_stable_attributes();
	init_stable_metrics();
	init_stable_events();
}));
//#endregion
//#region node_modules/@opentelemetry/core/build/src/semconv.js
var require_semconv$8 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ATTR_PROCESS_RUNTIME_NAME = void 0;
	/**
	* The name of the runtime of this process.
	*
	* @example OpenJDK Runtime Environment
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_PROCESS_RUNTIME_NAME = "process.runtime.name";
}));
//#endregion
//#region node_modules/@opentelemetry/core/build/src/platform/node/sdk-info.js
var require_sdk_info = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SDK_INFO = void 0;
	const version_1 = require_version$3();
	const semantic_conventions_1 = (init_esm$1(), __toCommonJS(esm_exports$1));
	const semconv_1 = require_semconv$8();
	/** Constants describing the SDK in use */
	exports.SDK_INFO = {
		[semantic_conventions_1.ATTR_TELEMETRY_SDK_NAME]: "opentelemetry",
		[semconv_1.ATTR_PROCESS_RUNTIME_NAME]: "node",
		[semantic_conventions_1.ATTR_TELEMETRY_SDK_LANGUAGE]: semantic_conventions_1.TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS,
		[semantic_conventions_1.ATTR_TELEMETRY_SDK_VERSION]: version_1.VERSION
	};
}));
//#endregion
//#region node_modules/@opentelemetry/core/build/src/platform/node/index.js
var require_node$7 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.otperformance = exports.SDK_INFO = exports._globalThis = exports.getStringListFromEnv = exports.getNumberFromEnv = exports.getBooleanFromEnv = exports.getStringFromEnv = void 0;
	var environment_1 = require_environment();
	Object.defineProperty(exports, "getStringFromEnv", {
		enumerable: true,
		get: function() {
			return environment_1.getStringFromEnv;
		}
	});
	Object.defineProperty(exports, "getBooleanFromEnv", {
		enumerable: true,
		get: function() {
			return environment_1.getBooleanFromEnv;
		}
	});
	Object.defineProperty(exports, "getNumberFromEnv", {
		enumerable: true,
		get: function() {
			return environment_1.getNumberFromEnv;
		}
	});
	Object.defineProperty(exports, "getStringListFromEnv", {
		enumerable: true,
		get: function() {
			return environment_1.getStringListFromEnv;
		}
	});
	var globalThis_1 = require_globalThis();
	Object.defineProperty(exports, "_globalThis", {
		enumerable: true,
		get: function() {
			return globalThis_1._globalThis;
		}
	});
	var sdk_info_1 = require_sdk_info();
	Object.defineProperty(exports, "SDK_INFO", {
		enumerable: true,
		get: function() {
			return sdk_info_1.SDK_INFO;
		}
	});
	/**
	* @deprecated Use performance directly.
	*/
	exports.otperformance = performance;
}));
//#endregion
//#region node_modules/@opentelemetry/core/build/src/platform/index.js
var require_platform$7 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getStringListFromEnv = exports.getNumberFromEnv = exports.getStringFromEnv = exports.getBooleanFromEnv = exports.otperformance = exports._globalThis = exports.SDK_INFO = void 0;
	var node_1 = require_node$7();
	Object.defineProperty(exports, "SDK_INFO", {
		enumerable: true,
		get: function() {
			return node_1.SDK_INFO;
		}
	});
	Object.defineProperty(exports, "_globalThis", {
		enumerable: true,
		get: function() {
			return node_1._globalThis;
		}
	});
	Object.defineProperty(exports, "otperformance", {
		enumerable: true,
		get: function() {
			return node_1.otperformance;
		}
	});
	Object.defineProperty(exports, "getBooleanFromEnv", {
		enumerable: true,
		get: function() {
			return node_1.getBooleanFromEnv;
		}
	});
	Object.defineProperty(exports, "getStringFromEnv", {
		enumerable: true,
		get: function() {
			return node_1.getStringFromEnv;
		}
	});
	Object.defineProperty(exports, "getNumberFromEnv", {
		enumerable: true,
		get: function() {
			return node_1.getNumberFromEnv;
		}
	});
	Object.defineProperty(exports, "getStringListFromEnv", {
		enumerable: true,
		get: function() {
			return node_1.getStringListFromEnv;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/core/build/src/common/time.js
var require_time = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.addHrTimes = exports.isTimeInput = exports.isTimeInputHrTime = exports.hrTimeToSeconds = exports.hrTimeToMilliseconds = exports.hrTimeToMicroseconds = exports.hrTimeToNanoseconds = exports.hrTimeToTimeStamp = exports.hrTimeDuration = exports.timeInputToHrTime = exports.hrTime = exports.getTimeOrigin = exports.millisToHrTime = void 0;
	const platform_1 = require_platform$7();
	const NANOSECOND_DIGITS = 9;
	const MILLISECONDS_TO_NANOSECONDS = Math.pow(10, 6);
	const SECOND_TO_NANOSECONDS = Math.pow(10, NANOSECOND_DIGITS);
	/**
	* Converts a number of milliseconds from epoch to HrTime([seconds, remainder in nanoseconds]).
	* @param epochMillis
	*/
	function millisToHrTime(epochMillis) {
		const epochSeconds = epochMillis / 1e3;
		return [Math.trunc(epochSeconds), Math.round(epochMillis % 1e3 * MILLISECONDS_TO_NANOSECONDS)];
	}
	exports.millisToHrTime = millisToHrTime;
	/**
	* @deprecated Use `performance.timeOrigin` directly.
	*/
	function getTimeOrigin() {
		return platform_1.otperformance.timeOrigin;
	}
	exports.getTimeOrigin = getTimeOrigin;
	/**
	* Returns an hrtime calculated via performance component.
	* @param performanceNow
	*/
	function hrTime(performanceNow) {
		return addHrTimes(millisToHrTime(platform_1.otperformance.timeOrigin), millisToHrTime(typeof performanceNow === "number" ? performanceNow : platform_1.otperformance.now()));
	}
	exports.hrTime = hrTime;
	/**
	*
	* Converts a TimeInput to an HrTime, defaults to _hrtime().
	* @param time
	*/
	function timeInputToHrTime(time) {
		if (isTimeInputHrTime(time)) return time;
		else if (typeof time === "number") if (time < platform_1.otperformance.timeOrigin / 2) return hrTime(time);
		else return millisToHrTime(time);
		else if (time instanceof Date) return millisToHrTime(time.getTime());
		else throw TypeError("Invalid input type");
	}
	exports.timeInputToHrTime = timeInputToHrTime;
	/**
	* Returns a duration of two hrTime.
	* @param startTime
	* @param endTime
	*/
	function hrTimeDuration(startTime, endTime) {
		let seconds = endTime[0] - startTime[0];
		let nanos = endTime[1] - startTime[1];
		if (nanos < 0) {
			seconds -= 1;
			nanos += SECOND_TO_NANOSECONDS;
		}
		return [seconds, nanos];
	}
	exports.hrTimeDuration = hrTimeDuration;
	/**
	* Convert hrTime to timestamp, for example "2019-05-14T17:00:00.000123456Z"
	* @param time
	*/
	function hrTimeToTimeStamp(time) {
		const precision = NANOSECOND_DIGITS;
		const tmp = `${"0".repeat(precision)}${time[1]}Z`;
		const nanoString = tmp.substring(tmp.length - precision - 1);
		return (/* @__PURE__ */ new Date(time[0] * 1e3)).toISOString().replace("000Z", nanoString);
	}
	exports.hrTimeToTimeStamp = hrTimeToTimeStamp;
	/**
	* Convert hrTime to nanoseconds.
	* @param time
	*/
	function hrTimeToNanoseconds(time) {
		return time[0] * SECOND_TO_NANOSECONDS + time[1];
	}
	exports.hrTimeToNanoseconds = hrTimeToNanoseconds;
	/**
	* Convert hrTime to microseconds.
	* @param time
	*/
	function hrTimeToMicroseconds(time) {
		return time[0] * 1e6 + time[1] / 1e3;
	}
	exports.hrTimeToMicroseconds = hrTimeToMicroseconds;
	/**
	* Convert hrTime to milliseconds.
	* @param time
	*/
	function hrTimeToMilliseconds(time) {
		return time[0] * 1e3 + time[1] / 1e6;
	}
	exports.hrTimeToMilliseconds = hrTimeToMilliseconds;
	/**
	* Convert hrTime to seconds.
	* @param time
	*/
	function hrTimeToSeconds(time) {
		return time[0] + time[1] / SECOND_TO_NANOSECONDS;
	}
	exports.hrTimeToSeconds = hrTimeToSeconds;
	/**
	* check if time is HrTime
	* @param value
	*/
	function isTimeInputHrTime(value) {
		return Array.isArray(value) && value.length === 2 && typeof value[0] === "number" && typeof value[1] === "number";
	}
	exports.isTimeInputHrTime = isTimeInputHrTime;
	/**
	* check if input value is a correct types.TimeInput
	* @param value
	*/
	function isTimeInput(value) {
		return isTimeInputHrTime(value) || typeof value === "number" || value instanceof Date;
	}
	exports.isTimeInput = isTimeInput;
	/**
	* Given 2 HrTime formatted times, return their sum as an HrTime.
	*/
	function addHrTimes(time1, time2) {
		const out = [time1[0] + time2[0], time1[1] + time2[1]];
		if (out[1] >= SECOND_TO_NANOSECONDS) {
			out[1] -= SECOND_TO_NANOSECONDS;
			out[0] += 1;
		}
		return out;
	}
	exports.addHrTimes = addHrTimes;
}));
//#endregion
//#region node_modules/@opentelemetry/core/build/src/common/timer-util.js
var require_timer_util = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.unrefTimer = void 0;
	/**
	* @deprecated please copy this code to your implementation instead, this function will be removed in the next major version of this package.
	* @param timer
	*/
	function unrefTimer(timer) {
		if (typeof timer !== "number") timer.unref();
	}
	exports.unrefTimer = unrefTimer;
}));
//#endregion
//#region node_modules/@opentelemetry/core/build/src/ExportResult.js
var require_ExportResult = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ExportResultCode = void 0;
	var ExportResultCode;
	(function(ExportResultCode) {
		ExportResultCode[ExportResultCode["SUCCESS"] = 0] = "SUCCESS";
		ExportResultCode[ExportResultCode["FAILED"] = 1] = "FAILED";
	})(ExportResultCode || (exports.ExportResultCode = ExportResultCode = {}));
}));
//#endregion
//#region node_modules/@opentelemetry/core/build/src/propagation/composite.js
var require_composite = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.CompositePropagator = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	/** Combines multiple propagators into a single propagator. */
	var CompositePropagator = class {
		_propagators;
		_fields;
		/**
		* Construct a composite propagator from a list of propagators.
		*
		* @param [config] Configuration object for composite propagator
		*/
		constructor(config = {}) {
			this._propagators = config.propagators ?? [];
			const fields = /* @__PURE__ */ new Set();
			for (const propagator of this._propagators) {
				const propagatorFields = typeof propagator.fields === "function" ? propagator.fields() : [];
				for (const field of propagatorFields) fields.add(field);
			}
			this._fields = Array.from(fields);
		}
		/**
		* Run each of the configured propagators with the given context and carrier.
		* Propagators are run in the order they are configured, so if multiple
		* propagators write the same carrier key, the propagator later in the list
		* will "win".
		*
		* @param context Context to inject
		* @param carrier Carrier into which context will be injected
		*/
		inject(context, carrier, setter) {
			for (const propagator of this._propagators) try {
				propagator.inject(context, carrier, setter);
			} catch (err) {
				api_1.diag.warn(`Failed to inject with ${propagator.constructor.name}. Err: ${err.message}`);
			}
		}
		/**
		* Run each of the configured propagators with the given context and carrier.
		* Propagators are run in the order they are configured, so if multiple
		* propagators write the same context key, the propagator later in the list
		* will "win".
		*
		* @param context Context to add values to
		* @param carrier Carrier from which to extract context
		*/
		extract(context, carrier, getter) {
			return this._propagators.reduce((ctx, propagator) => {
				try {
					return propagator.extract(ctx, carrier, getter);
				} catch (err) {
					api_1.diag.warn(`Failed to extract with ${propagator.constructor.name}. Err: ${err.message}`);
				}
				return ctx;
			}, context);
		}
		fields() {
			return this._fields.slice();
		}
	};
	exports.CompositePropagator = CompositePropagator;
}));
//#endregion
//#region node_modules/@opentelemetry/core/build/src/internal/validators.js
var require_validators = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateValue = exports.validateKey = void 0;
	const VALID_KEY_CHAR_RANGE = "[_0-9a-z-*/]";
	const VALID_KEY_REGEX = new RegExp(`^(?:${`[a-z]${VALID_KEY_CHAR_RANGE}{0,255}`}|${`[a-z0-9]${VALID_KEY_CHAR_RANGE}{0,240}@[a-z]${VALID_KEY_CHAR_RANGE}{0,13}`})$`);
	const VALID_VALUE_BASE_REGEX = /^[ -~]{0,255}[!-~]$/;
	const INVALID_VALUE_COMMA_EQUAL_REGEX = /,|=/;
	/**
	* Key is opaque string up to 256 characters printable. It MUST begin with a
	* lowercase letter, and can only contain lowercase letters a-z, digits 0-9,
	* underscores _, dashes -, asterisks *, and forward slashes /.
	* For multi-tenant vendor scenarios, an at sign (@) can be used to prefix the
	* vendor name. Vendors SHOULD set the tenant ID at the beginning of the key.
	* see https://www.w3.org/TR/trace-context/#key
	*/
	function validateKey(key) {
		return VALID_KEY_REGEX.test(key);
	}
	exports.validateKey = validateKey;
	/**
	* Value is opaque string up to 256 characters printable ASCII RFC0020
	* characters (i.e., the range 0x20 to 0x7E) except comma , and =.
	*/
	function validateValue(value) {
		return VALID_VALUE_BASE_REGEX.test(value) && !INVALID_VALUE_COMMA_EQUAL_REGEX.test(value);
	}
	exports.validateValue = validateValue;
}));
//#endregion
//#region node_modules/@opentelemetry/core/build/src/trace/TraceState.js
var require_TraceState = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.TraceState = void 0;
	const validators_1 = require_validators();
	const MAX_TRACE_STATE_ITEMS = 32;
	const MAX_TRACE_STATE_LEN = 512;
	const LIST_MEMBERS_SEPARATOR = ",";
	const LIST_MEMBER_KEY_VALUE_SPLITTER = "=";
	exports.TraceState = class TraceState {
		_length;
		_rawTraceState;
		_internalState;
		constructor(rawTraceState) {
			this._rawTraceState = typeof rawTraceState === "string" ? rawTraceState : "";
			this._length = this._rawTraceState.length;
		}
		set(key, value) {
			if (!(0, validators_1.validateKey)(key) || !(0, validators_1.validateValue)(value)) return this;
			const currState = this._getState();
			const currValue = currState.get(key);
			let newLength = this._length;
			if (typeof currValue === "string") newLength += value.length - currValue.length;
			else newLength += key.length + value.length + (currState.size > 0 ? 2 : 1);
			if (newLength > MAX_TRACE_STATE_LEN) return this;
			const newState = new Map(currState);
			newState.delete(key);
			newState.set(key, value);
			return this._fromState(newState, newLength);
		}
		unset(key) {
			const currState = this._getState();
			const currValue = currState.get(key);
			if (typeof currValue !== "string") return this;
			let newLength = this._length - (key.length + currValue.length + 1);
			if (currState.size > 1) newLength = newLength - 1;
			const newState = new Map(currState);
			newState.delete(key);
			return this._fromState(newState, newLength);
		}
		get(key) {
			return this._getState().get(key);
		}
		serialize() {
			let serialized = "";
			let index = 0;
			for (const entry of this._getState()) {
				if (index > 0) serialized = LIST_MEMBERS_SEPARATOR + serialized;
				serialized = `${entry[0]}${LIST_MEMBER_KEY_VALUE_SPLITTER}${entry[1]}` + serialized;
				index++;
			}
			return serialized;
		}
		_getState() {
			if (this._internalState) return this._internalState;
			const vendorMembers = this._rawTraceState.split(LIST_MEMBERS_SEPARATOR);
			const vendorEntries = /* @__PURE__ */ new Map();
			let currentLength = 0;
			for (const member of vendorMembers) {
				const m = member.trim();
				const idx = m.indexOf(LIST_MEMBER_KEY_VALUE_SPLITTER);
				if (idx === -1) continue;
				const key = m.slice(0, idx);
				const value = m.slice(idx + 1);
				if (!(0, validators_1.validateKey)(key) || !(0, validators_1.validateValue)(value)) continue;
				const futureLength = currentLength + m.length + (vendorEntries.size > 0 ? 1 : 0);
				if (futureLength > MAX_TRACE_STATE_LEN) continue;
				vendorEntries.set(key, value);
				currentLength = futureLength;
				if (vendorEntries.size >= MAX_TRACE_STATE_ITEMS) break;
			}
			this._length = currentLength;
			this._internalState = new Map(Array.from(vendorEntries.entries()).reverse());
			return this._internalState;
		}
		_fromState(state, length) {
			const traceState = Object.create(TraceState.prototype);
			traceState._internalState = state;
			traceState._length = length;
			return traceState;
		}
	};
}));
//#endregion
//#region node_modules/@opentelemetry/core/build/src/trace/W3CTraceContextPropagator.js
var require_W3CTraceContextPropagator = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.W3CTraceContextPropagator = exports.parseTraceParent = exports.TRACE_STATE_HEADER = exports.TRACE_PARENT_HEADER = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const suppress_tracing_1 = require_suppress_tracing();
	const TraceState_1 = require_TraceState();
	exports.TRACE_PARENT_HEADER = "traceparent";
	exports.TRACE_STATE_HEADER = "tracestate";
	const VERSION = "00";
	const TRACE_PARENT_REGEX = new RegExp(`^\\s?((?!ff)[\\da-f]{2})-((?![0]{32})[\\da-f]{32})-((?![0]{16})[\\da-f]{16})-([\\da-f]{2})(-.*)?\\s?$`);
	/**
	* Parses information from the [traceparent] span tag and converts it into {@link SpanContext}
	* @param traceParent - A meta property that comes from server.
	*     It should be dynamically generated server side to have the server's request trace Id,
	*     a parent span Id that was set on the server's request span,
	*     and the trace flags to indicate the server's sampling decision
	*     (01 = sampled, 00 = not sampled).
	*     for example: '{version}-{traceId}-{spanId}-{sampleDecision}'
	*     For more information see {@link https://www.w3.org/TR/trace-context/}
	*/
	function parseTraceParent(traceParent) {
		const match = TRACE_PARENT_REGEX.exec(traceParent);
		if (!match) return null;
		if (match[1] === "00" && match[5]) return null;
		return {
			traceId: match[2],
			spanId: match[3],
			traceFlags: parseInt(match[4], 16)
		};
	}
	exports.parseTraceParent = parseTraceParent;
	/**
	* Propagates {@link SpanContext} through Trace Context format propagation.
	*
	* Based on the Trace Context specification:
	* https://www.w3.org/TR/trace-context/
	*/
	var W3CTraceContextPropagator = class {
		inject(context, carrier, setter) {
			const spanContext = api_1.trace.getSpanContext(context);
			if (!spanContext || (0, suppress_tracing_1.isTracingSuppressed)(context) || !(0, api_1.isSpanContextValid)(spanContext)) return;
			const traceParent = `${VERSION}-${spanContext.traceId}-${spanContext.spanId}-0${Number(spanContext.traceFlags || api_1.TraceFlags.NONE).toString(16)}`;
			setter.set(carrier, exports.TRACE_PARENT_HEADER, traceParent);
			if (spanContext.traceState) setter.set(carrier, exports.TRACE_STATE_HEADER, spanContext.traceState.serialize());
		}
		extract(context, carrier, getter) {
			const traceParentHeader = getter.get(carrier, exports.TRACE_PARENT_HEADER);
			if (!traceParentHeader) return context;
			const traceParent = Array.isArray(traceParentHeader) ? traceParentHeader[0] : traceParentHeader;
			if (typeof traceParent !== "string") return context;
			const spanContext = parseTraceParent(traceParent);
			if (!spanContext) return context;
			spanContext.isRemote = true;
			const traceStateHeader = getter.get(carrier, exports.TRACE_STATE_HEADER);
			if (traceStateHeader) {
				const state = Array.isArray(traceStateHeader) ? traceStateHeader.join(",") : traceStateHeader;
				spanContext.traceState = new TraceState_1.TraceState(typeof state === "string" ? state : void 0);
			}
			return api_1.trace.setSpanContext(context, spanContext);
		}
		fields() {
			return [exports.TRACE_PARENT_HEADER, exports.TRACE_STATE_HEADER];
		}
	};
	exports.W3CTraceContextPropagator = W3CTraceContextPropagator;
}));
//#endregion
//#region node_modules/@opentelemetry/core/build/src/trace/rpc-metadata.js
var require_rpc_metadata = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getRPCMetadata = exports.deleteRPCMetadata = exports.setRPCMetadata = exports.RPCType = void 0;
	const RPC_METADATA_KEY = (0, (init_esm$2(), __toCommonJS(esm_exports$2)).createContextKey)("OpenTelemetry SDK Context Key RPC_METADATA");
	var RPCType;
	(function(RPCType) {
		RPCType["HTTP"] = "http";
	})(RPCType || (exports.RPCType = RPCType = {}));
	function setRPCMetadata(context, meta) {
		return context.setValue(RPC_METADATA_KEY, meta);
	}
	exports.setRPCMetadata = setRPCMetadata;
	function deleteRPCMetadata(context) {
		return context.deleteValue(RPC_METADATA_KEY);
	}
	exports.deleteRPCMetadata = deleteRPCMetadata;
	function getRPCMetadata(context) {
		return context.getValue(RPC_METADATA_KEY);
	}
	exports.getRPCMetadata = getRPCMetadata;
}));
//#endregion
//#region node_modules/@opentelemetry/core/build/src/utils/lodash.merge.js
var require_lodash_merge = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isPlainObject = void 0;
	/**
	* based on lodash in order to support esm builds without esModuleInterop.
	* lodash is using MIT License.
	**/
	const objectTag = "[object Object]";
	const nullTag = "[object Null]";
	const undefinedTag = "[object Undefined]";
	const funcToString = Function.prototype.toString;
	const objectCtorString = funcToString.call(Object);
	const getPrototypeOf = Object.getPrototypeOf;
	const objectProto = Object.prototype;
	const hasOwnProperty = objectProto.hasOwnProperty;
	const symToStringTag = Symbol ? Symbol.toStringTag : void 0;
	const nativeObjectToString = objectProto.toString;
	/**
	* Checks if `value` is a plain object, that is, an object created by the
	* `Object` constructor or one with a `[[Prototype]]` of `null`.
	*
	* @static
	* @memberOf _
	* @since 0.8.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	* @example
	*
	* function Foo() {
	*   this.a = 1;
	* }
	*
	* _.isPlainObject(new Foo);
	* // => false
	*
	* _.isPlainObject([1, 2, 3]);
	* // => false
	*
	* _.isPlainObject({ 'x': 0, 'y': 0 });
	* // => true
	*
	* _.isPlainObject(Object.create(null));
	* // => true
	*/
	function isPlainObject(value) {
		if (!isObjectLike(value) || baseGetTag(value) !== objectTag) return false;
		const proto = getPrototypeOf(value);
		if (proto === null) return true;
		const Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
		return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) === objectCtorString;
	}
	exports.isPlainObject = isPlainObject;
	/**
	* Checks if `value` is object-like. A value is object-like if it's not `null`
	* and has a `typeof` result of "object".
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	* @example
	*
	* _.isObjectLike({});
	* // => true
	*
	* _.isObjectLike([1, 2, 3]);
	* // => true
	*
	* _.isObjectLike(_.noop);
	* // => false
	*
	* _.isObjectLike(null);
	* // => false
	*/
	function isObjectLike(value) {
		return value != null && typeof value == "object";
	}
	/**
	* The base implementation of `getTag` without fallbacks for buggy environments.
	*
	* @private
	* @param {*} value The value to query.
	* @returns {string} Returns the `toStringTag`.
	*/
	function baseGetTag(value) {
		if (value == null) return value === void 0 ? undefinedTag : nullTag;
		return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
	}
	/**
	* A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	*
	* @private
	* @param {*} value The value to query.
	* @returns {string} Returns the raw `toStringTag`.
	*/
	function getRawTag(value) {
		const isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
		let unmasked = false;
		try {
			value[symToStringTag] = void 0;
			unmasked = true;
		} catch {}
		const result = nativeObjectToString.call(value);
		if (unmasked) if (isOwn) value[symToStringTag] = tag;
		else delete value[symToStringTag];
		return result;
	}
	/**
	* Converts `value` to a string using `Object.prototype.toString`.
	*
	* @private
	* @param {*} value The value to convert.
	* @returns {string} Returns the converted string.
	*/
	function objectToString(value) {
		return nativeObjectToString.call(value);
	}
}));
//#endregion
//#region node_modules/@opentelemetry/core/build/src/utils/merge.js
var require_merge = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.merge = void 0;
	const lodash_merge_1 = require_lodash_merge();
	const MAX_LEVEL = 20;
	/**
	* Merges objects together
	* @param args - objects / values to be merged
	*/
	function merge(...args) {
		let result = args.shift();
		const objects = /* @__PURE__ */ new WeakMap();
		while (args.length > 0) result = mergeTwoObjects(result, args.shift(), 0, objects);
		return result;
	}
	exports.merge = merge;
	function takeValue(value) {
		if (isArray(value)) return value.slice();
		return value;
	}
	/**
	* Merges two objects
	* @param one - first object
	* @param two - second object
	* @param level - current deep level
	* @param objects - objects holder that has been already referenced - to prevent
	* cyclic dependency
	*/
	function mergeTwoObjects(one, two, level = 0, objects) {
		let result;
		if (level > MAX_LEVEL) return;
		level++;
		if (isPrimitive(one) || isPrimitive(two) || isFunction(two)) result = takeValue(two);
		else if (isArray(one)) {
			result = one.slice();
			if (isArray(two)) for (let i = 0, j = two.length; i < j; i++) result.push(takeValue(two[i]));
			else if (isObject(two)) {
				const keys = Object.keys(two);
				for (let i = 0, j = keys.length; i < j; i++) {
					const key = keys[i];
					if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
					result[key] = takeValue(two[key]);
				}
			}
		} else if (isObject(one)) if (isObject(two)) {
			if (!shouldMerge(one, two)) return two;
			result = Object.assign({}, one);
			const keys = Object.keys(two);
			for (let i = 0, j = keys.length; i < j; i++) {
				const key = keys[i];
				if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
				const twoValue = two[key];
				if (isPrimitive(twoValue)) if (typeof twoValue === "undefined") delete result[key];
				else result[key] = twoValue;
				else {
					const obj1 = result[key];
					const obj2 = twoValue;
					if (wasObjectReferenced(one, key, objects) || wasObjectReferenced(two, key, objects)) delete result[key];
					else {
						if (isObject(obj1) && isObject(obj2)) {
							const arr1 = objects.get(obj1) || [];
							const arr2 = objects.get(obj2) || [];
							arr1.push({
								obj: one,
								key
							});
							arr2.push({
								obj: two,
								key
							});
							objects.set(obj1, arr1);
							objects.set(obj2, arr2);
						}
						result[key] = mergeTwoObjects(result[key], twoValue, level, objects);
					}
				}
			}
		} else result = two;
		return result;
	}
	/**
	* Function to check if object has been already reference
	* @param obj
	* @param key
	* @param objects
	*/
	function wasObjectReferenced(obj, key, objects) {
		const arr = objects.get(obj[key]) || [];
		for (let i = 0, j = arr.length; i < j; i++) {
			const info = arr[i];
			if (info.key === key && info.obj === obj) return true;
		}
		return false;
	}
	function isArray(value) {
		return Array.isArray(value);
	}
	function isFunction(value) {
		return typeof value === "function";
	}
	function isObject(value) {
		return !isPrimitive(value) && !isArray(value) && !isFunction(value) && typeof value === "object";
	}
	function isPrimitive(value) {
		return typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "undefined" || value instanceof Date || value instanceof RegExp || value === null;
	}
	function shouldMerge(one, two) {
		if (!(0, lodash_merge_1.isPlainObject)(one) || !(0, lodash_merge_1.isPlainObject)(two)) return false;
		return true;
	}
}));
//#endregion
//#region node_modules/@opentelemetry/core/build/src/utils/timeout.js
var require_timeout = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.callWithTimeout = exports.TimeoutError = void 0;
	/**
	* Error that is thrown on timeouts.
	*/
	var TimeoutError = class TimeoutError extends Error {
		constructor(message) {
			super(message);
			Object.setPrototypeOf(this, TimeoutError.prototype);
		}
	};
	exports.TimeoutError = TimeoutError;
	/**
	* Adds a timeout to a promise and rejects if the specified timeout has elapsed. Also rejects if the specified promise
	* rejects, and resolves if the specified promise resolves.
	*
	* <p> NOTE: this operation will continue even after it throws a {@link TimeoutError}.
	*
	* @param promise promise to use with timeout.
	* @param timeout the timeout in milliseconds until the returned promise is rejected.
	*/
	function callWithTimeout(promise, timeout) {
		let timeoutHandle;
		const timeoutPromise = new Promise(function timeoutFunction(_resolve, reject) {
			timeoutHandle = setTimeout(function timeoutHandler() {
				reject(new TimeoutError("Operation timed out."));
			}, timeout);
		});
		return Promise.race([promise, timeoutPromise]).then((result) => {
			clearTimeout(timeoutHandle);
			return result;
		}, (reason) => {
			clearTimeout(timeoutHandle);
			throw reason;
		});
	}
	exports.callWithTimeout = callWithTimeout;
}));
//#endregion
//#region node_modules/@opentelemetry/core/build/src/utils/url.js
var require_url = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isUrlIgnored = exports.urlMatches = void 0;
	function urlMatches(url, urlToMatch) {
		if (typeof urlToMatch === "string") return url === urlToMatch;
		else return !!url.match(urlToMatch);
	}
	exports.urlMatches = urlMatches;
	/**
	* Check if {@param url} should be ignored when comparing against {@param ignoredUrls}
	* @param url
	* @param ignoredUrls
	*/
	function isUrlIgnored(url, ignoredUrls) {
		if (!ignoredUrls) return false;
		for (const ignoreUrl of ignoredUrls) if (urlMatches(url, ignoreUrl)) return true;
		return false;
	}
	exports.isUrlIgnored = isUrlIgnored;
}));
//#endregion
//#region node_modules/@opentelemetry/core/build/src/utils/promise.js
var require_promise = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Deferred = void 0;
	var Deferred = class {
		_promise;
		_resolve;
		_reject;
		constructor() {
			this._promise = new Promise((resolve, reject) => {
				this._resolve = resolve;
				this._reject = reject;
			});
		}
		get promise() {
			return this._promise;
		}
		resolve(val) {
			this._resolve(val);
		}
		reject(err) {
			this._reject(err);
		}
	};
	exports.Deferred = Deferred;
}));
//#endregion
//#region node_modules/@opentelemetry/core/build/src/utils/callback.js
var require_callback = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.BindOnceFuture = void 0;
	const promise_1 = require_promise();
	/**
	* Bind the callback and only invoke the callback once regardless how many times `BindOnceFuture.call` is invoked.
	*/
	var BindOnceFuture = class {
		_isCalled = false;
		_deferred = new promise_1.Deferred();
		_callback;
		_that;
		constructor(callback, that) {
			this._callback = callback;
			this._that = that;
		}
		get isCalled() {
			return this._isCalled;
		}
		get promise() {
			return this._deferred.promise;
		}
		call(...args) {
			if (!this._isCalled) {
				this._isCalled = true;
				try {
					Promise.resolve(this._callback.call(this._that, ...args)).then((val) => this._deferred.resolve(val), (err) => this._deferred.reject(err));
				} catch (err) {
					this._deferred.reject(err);
				}
			}
			return this._deferred.promise;
		}
	};
	exports.BindOnceFuture = BindOnceFuture;
}));
//#endregion
//#region node_modules/@opentelemetry/core/build/src/utils/configuration.js
var require_configuration = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.diagLogLevelFromString = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const logLevelMap = {
		ALL: api_1.DiagLogLevel.ALL,
		VERBOSE: api_1.DiagLogLevel.VERBOSE,
		DEBUG: api_1.DiagLogLevel.DEBUG,
		INFO: api_1.DiagLogLevel.INFO,
		WARN: api_1.DiagLogLevel.WARN,
		ERROR: api_1.DiagLogLevel.ERROR,
		NONE: api_1.DiagLogLevel.NONE
	};
	/**
	* Convert a string to a {@link DiagLogLevel}, defaults to {@link DiagLogLevel} if the log level does not exist or undefined if the input is undefined.
	* @param value
	*/
	function diagLogLevelFromString(value) {
		if (value == null) return;
		const resolvedLogLevel = logLevelMap[value.toUpperCase()];
		if (resolvedLogLevel == null) {
			api_1.diag.warn(`Unknown log level "${value}", expected one of ${Object.keys(logLevelMap)}, using default`);
			return api_1.DiagLogLevel.INFO;
		}
		return resolvedLogLevel;
	}
	exports.diagLogLevelFromString = diagLogLevelFromString;
}));
//#endregion
//#region node_modules/@opentelemetry/core/build/src/internal/exporter.js
var require_exporter = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports._export = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const suppress_tracing_1 = require_suppress_tracing();
	/**
	* @internal
	* Shared functionality used by Exporters while exporting data, including suppression of Traces.
	*/
	function _export(exporter, arg) {
		return new Promise((resolve) => {
			api_1.context.with((0, suppress_tracing_1.suppressTracing)(api_1.context.active()), () => {
				exporter.export(arg, resolve);
			});
		});
	}
	exports._export = _export;
}));
//#endregion
//#region node_modules/@opentelemetry/core/build/src/index.js
var require_src$13 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.diagLogLevelFromString = exports.BindOnceFuture = exports.urlMatches = exports.isUrlIgnored = exports.callWithTimeout = exports.TimeoutError = exports.merge = exports.TraceState = exports.unsuppressTracing = exports.suppressTracing = exports.isTracingSuppressed = exports.setRPCMetadata = exports.getRPCMetadata = exports.deleteRPCMetadata = exports.RPCType = exports.parseTraceParent = exports.W3CTraceContextPropagator = exports.TRACE_STATE_HEADER = exports.TRACE_PARENT_HEADER = exports.CompositePropagator = exports.otperformance = exports.getStringListFromEnv = exports.getNumberFromEnv = exports.getBooleanFromEnv = exports.getStringFromEnv = exports._globalThis = exports.SDK_INFO = exports.parseKeyPairsIntoRecord = exports.ExportResultCode = exports.unrefTimer = exports.timeInputToHrTime = exports.millisToHrTime = exports.isTimeInputHrTime = exports.isTimeInput = exports.hrTimeToTimeStamp = exports.hrTimeToSeconds = exports.hrTimeToNanoseconds = exports.hrTimeToMilliseconds = exports.hrTimeToMicroseconds = exports.hrTimeDuration = exports.hrTime = exports.getTimeOrigin = exports.addHrTimes = exports.loggingErrorHandler = exports.setGlobalErrorHandler = exports.globalErrorHandler = exports.sanitizeAttributes = exports.isAttributeValue = exports.AnchoredClock = exports.W3CBaggagePropagator = void 0;
	exports.internal = void 0;
	var W3CBaggagePropagator_1 = require_W3CBaggagePropagator();
	Object.defineProperty(exports, "W3CBaggagePropagator", {
		enumerable: true,
		get: function() {
			return W3CBaggagePropagator_1.W3CBaggagePropagator;
		}
	});
	var anchored_clock_1 = require_anchored_clock();
	Object.defineProperty(exports, "AnchoredClock", {
		enumerable: true,
		get: function() {
			return anchored_clock_1.AnchoredClock;
		}
	});
	var attributes_1 = require_attributes();
	Object.defineProperty(exports, "isAttributeValue", {
		enumerable: true,
		get: function() {
			return attributes_1.isAttributeValue;
		}
	});
	Object.defineProperty(exports, "sanitizeAttributes", {
		enumerable: true,
		get: function() {
			return attributes_1.sanitizeAttributes;
		}
	});
	var global_error_handler_1 = require_global_error_handler();
	Object.defineProperty(exports, "globalErrorHandler", {
		enumerable: true,
		get: function() {
			return global_error_handler_1.globalErrorHandler;
		}
	});
	Object.defineProperty(exports, "setGlobalErrorHandler", {
		enumerable: true,
		get: function() {
			return global_error_handler_1.setGlobalErrorHandler;
		}
	});
	var logging_error_handler_1 = require_logging_error_handler();
	Object.defineProperty(exports, "loggingErrorHandler", {
		enumerable: true,
		get: function() {
			return logging_error_handler_1.loggingErrorHandler;
		}
	});
	var time_1 = require_time();
	Object.defineProperty(exports, "addHrTimes", {
		enumerable: true,
		get: function() {
			return time_1.addHrTimes;
		}
	});
	Object.defineProperty(exports, "getTimeOrigin", {
		enumerable: true,
		get: function() {
			return time_1.getTimeOrigin;
		}
	});
	Object.defineProperty(exports, "hrTime", {
		enumerable: true,
		get: function() {
			return time_1.hrTime;
		}
	});
	Object.defineProperty(exports, "hrTimeDuration", {
		enumerable: true,
		get: function() {
			return time_1.hrTimeDuration;
		}
	});
	Object.defineProperty(exports, "hrTimeToMicroseconds", {
		enumerable: true,
		get: function() {
			return time_1.hrTimeToMicroseconds;
		}
	});
	Object.defineProperty(exports, "hrTimeToMilliseconds", {
		enumerable: true,
		get: function() {
			return time_1.hrTimeToMilliseconds;
		}
	});
	Object.defineProperty(exports, "hrTimeToNanoseconds", {
		enumerable: true,
		get: function() {
			return time_1.hrTimeToNanoseconds;
		}
	});
	Object.defineProperty(exports, "hrTimeToSeconds", {
		enumerable: true,
		get: function() {
			return time_1.hrTimeToSeconds;
		}
	});
	Object.defineProperty(exports, "hrTimeToTimeStamp", {
		enumerable: true,
		get: function() {
			return time_1.hrTimeToTimeStamp;
		}
	});
	Object.defineProperty(exports, "isTimeInput", {
		enumerable: true,
		get: function() {
			return time_1.isTimeInput;
		}
	});
	Object.defineProperty(exports, "isTimeInputHrTime", {
		enumerable: true,
		get: function() {
			return time_1.isTimeInputHrTime;
		}
	});
	Object.defineProperty(exports, "millisToHrTime", {
		enumerable: true,
		get: function() {
			return time_1.millisToHrTime;
		}
	});
	Object.defineProperty(exports, "timeInputToHrTime", {
		enumerable: true,
		get: function() {
			return time_1.timeInputToHrTime;
		}
	});
	var timer_util_1 = require_timer_util();
	Object.defineProperty(exports, "unrefTimer", {
		enumerable: true,
		get: function() {
			return timer_util_1.unrefTimer;
		}
	});
	var ExportResult_1 = require_ExportResult();
	Object.defineProperty(exports, "ExportResultCode", {
		enumerable: true,
		get: function() {
			return ExportResult_1.ExportResultCode;
		}
	});
	var utils_1 = require_utils$6();
	Object.defineProperty(exports, "parseKeyPairsIntoRecord", {
		enumerable: true,
		get: function() {
			return utils_1.parseKeyPairsIntoRecord;
		}
	});
	var platform_1 = require_platform$7();
	Object.defineProperty(exports, "SDK_INFO", {
		enumerable: true,
		get: function() {
			return platform_1.SDK_INFO;
		}
	});
	Object.defineProperty(exports, "_globalThis", {
		enumerable: true,
		get: function() {
			return platform_1._globalThis;
		}
	});
	Object.defineProperty(exports, "getStringFromEnv", {
		enumerable: true,
		get: function() {
			return platform_1.getStringFromEnv;
		}
	});
	Object.defineProperty(exports, "getBooleanFromEnv", {
		enumerable: true,
		get: function() {
			return platform_1.getBooleanFromEnv;
		}
	});
	Object.defineProperty(exports, "getNumberFromEnv", {
		enumerable: true,
		get: function() {
			return platform_1.getNumberFromEnv;
		}
	});
	Object.defineProperty(exports, "getStringListFromEnv", {
		enumerable: true,
		get: function() {
			return platform_1.getStringListFromEnv;
		}
	});
	Object.defineProperty(exports, "otperformance", {
		enumerable: true,
		get: function() {
			return platform_1.otperformance;
		}
	});
	var composite_1 = require_composite();
	Object.defineProperty(exports, "CompositePropagator", {
		enumerable: true,
		get: function() {
			return composite_1.CompositePropagator;
		}
	});
	var W3CTraceContextPropagator_1 = require_W3CTraceContextPropagator();
	Object.defineProperty(exports, "TRACE_PARENT_HEADER", {
		enumerable: true,
		get: function() {
			return W3CTraceContextPropagator_1.TRACE_PARENT_HEADER;
		}
	});
	Object.defineProperty(exports, "TRACE_STATE_HEADER", {
		enumerable: true,
		get: function() {
			return W3CTraceContextPropagator_1.TRACE_STATE_HEADER;
		}
	});
	Object.defineProperty(exports, "W3CTraceContextPropagator", {
		enumerable: true,
		get: function() {
			return W3CTraceContextPropagator_1.W3CTraceContextPropagator;
		}
	});
	Object.defineProperty(exports, "parseTraceParent", {
		enumerable: true,
		get: function() {
			return W3CTraceContextPropagator_1.parseTraceParent;
		}
	});
	var rpc_metadata_1 = require_rpc_metadata();
	Object.defineProperty(exports, "RPCType", {
		enumerable: true,
		get: function() {
			return rpc_metadata_1.RPCType;
		}
	});
	Object.defineProperty(exports, "deleteRPCMetadata", {
		enumerable: true,
		get: function() {
			return rpc_metadata_1.deleteRPCMetadata;
		}
	});
	Object.defineProperty(exports, "getRPCMetadata", {
		enumerable: true,
		get: function() {
			return rpc_metadata_1.getRPCMetadata;
		}
	});
	Object.defineProperty(exports, "setRPCMetadata", {
		enumerable: true,
		get: function() {
			return rpc_metadata_1.setRPCMetadata;
		}
	});
	var suppress_tracing_1 = require_suppress_tracing();
	Object.defineProperty(exports, "isTracingSuppressed", {
		enumerable: true,
		get: function() {
			return suppress_tracing_1.isTracingSuppressed;
		}
	});
	Object.defineProperty(exports, "suppressTracing", {
		enumerable: true,
		get: function() {
			return suppress_tracing_1.suppressTracing;
		}
	});
	Object.defineProperty(exports, "unsuppressTracing", {
		enumerable: true,
		get: function() {
			return suppress_tracing_1.unsuppressTracing;
		}
	});
	var TraceState_1 = require_TraceState();
	Object.defineProperty(exports, "TraceState", {
		enumerable: true,
		get: function() {
			return TraceState_1.TraceState;
		}
	});
	var merge_1 = require_merge();
	Object.defineProperty(exports, "merge", {
		enumerable: true,
		get: function() {
			return merge_1.merge;
		}
	});
	var timeout_1 = require_timeout();
	Object.defineProperty(exports, "TimeoutError", {
		enumerable: true,
		get: function() {
			return timeout_1.TimeoutError;
		}
	});
	Object.defineProperty(exports, "callWithTimeout", {
		enumerable: true,
		get: function() {
			return timeout_1.callWithTimeout;
		}
	});
	var url_1 = require_url();
	Object.defineProperty(exports, "isUrlIgnored", {
		enumerable: true,
		get: function() {
			return url_1.isUrlIgnored;
		}
	});
	Object.defineProperty(exports, "urlMatches", {
		enumerable: true,
		get: function() {
			return url_1.urlMatches;
		}
	});
	var callback_1 = require_callback();
	Object.defineProperty(exports, "BindOnceFuture", {
		enumerable: true,
		get: function() {
			return callback_1.BindOnceFuture;
		}
	});
	var configuration_1 = require_configuration();
	Object.defineProperty(exports, "diagLogLevelFromString", {
		enumerable: true,
		get: function() {
			return configuration_1.diagLogLevelFromString;
		}
	});
	exports.internal = { _export: require_exporter()._export };
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/export/AggregationTemporality.js
var require_AggregationTemporality = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AggregationTemporality = void 0;
	/**
	* AggregationTemporality indicates the way additive quantities are expressed.
	*/
	var AggregationTemporality;
	(function(AggregationTemporality) {
		AggregationTemporality[AggregationTemporality["DELTA"] = 0] = "DELTA";
		AggregationTemporality[AggregationTemporality["CUMULATIVE"] = 1] = "CUMULATIVE";
	})(AggregationTemporality || (exports.AggregationTemporality = AggregationTemporality = {}));
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/export/MetricData.js
var require_MetricData = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DataPointType = exports.InstrumentType = void 0;
	/**
	* Supported types of metric instruments.
	*/
	var InstrumentType;
	(function(InstrumentType) {
		InstrumentType["COUNTER"] = "COUNTER";
		InstrumentType["GAUGE"] = "GAUGE";
		InstrumentType["HISTOGRAM"] = "HISTOGRAM";
		InstrumentType["UP_DOWN_COUNTER"] = "UP_DOWN_COUNTER";
		InstrumentType["OBSERVABLE_COUNTER"] = "OBSERVABLE_COUNTER";
		InstrumentType["OBSERVABLE_GAUGE"] = "OBSERVABLE_GAUGE";
		InstrumentType["OBSERVABLE_UP_DOWN_COUNTER"] = "OBSERVABLE_UP_DOWN_COUNTER";
	})(InstrumentType || (exports.InstrumentType = InstrumentType = {}));
	/**
	* The aggregated point data type.
	*/
	var DataPointType;
	(function(DataPointType) {
		/**
		* A histogram data point contains a histogram statistics of collected
		* values with a list of explicit bucket boundaries and statistics such
		* as min, max, count, and sum of all collected values.
		*/
		DataPointType[DataPointType["HISTOGRAM"] = 0] = "HISTOGRAM";
		/**
		* An exponential histogram data point contains a histogram statistics of
		* collected values where bucket boundaries are automatically calculated
		* using an exponential function, and statistics such as min, max, count,
		* and sum of all collected values.
		*/
		DataPointType[DataPointType["EXPONENTIAL_HISTOGRAM"] = 1] = "EXPONENTIAL_HISTOGRAM";
		/**
		* A gauge metric data point has only a single numeric value.
		*/
		DataPointType[DataPointType["GAUGE"] = 2] = "GAUGE";
		/**
		* A sum metric data point has a single numeric value and a
		* monotonicity-indicator.
		*/
		DataPointType[DataPointType["SUM"] = 3] = "SUM";
	})(DataPointType || (exports.DataPointType = DataPointType = {}));
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/utils.js
var require_utils$5 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.equalsCaseInsensitive = exports.binarySearchUB = exports.setEquals = exports.callWithTimeout = exports.TimeoutError = exports.instrumentationScopeId = exports.hashAttributes = void 0;
	/**
	* Converting the unordered attributes into unique identifier string.
	* @param attributes user provided unordered Attributes.
	*/
	function hashAttributes(attributes) {
		let keys = Object.keys(attributes);
		if (keys.length === 0) return "";
		keys = keys.sort();
		return JSON.stringify(keys.map((key) => [key, attributes[key]]));
	}
	exports.hashAttributes = hashAttributes;
	/**
	* Converting the instrumentation scope object to a unique identifier string.
	* @param instrumentationScope
	*/
	function instrumentationScopeId(instrumentationScope) {
		return `${instrumentationScope.name}:${instrumentationScope.version ?? ""}:${instrumentationScope.schemaUrl ?? ""}`;
	}
	exports.instrumentationScopeId = instrumentationScopeId;
	/**
	* Error that is thrown on timeouts.
	*/
	var TimeoutError = class TimeoutError extends Error {
		constructor(message) {
			super(message);
			Object.setPrototypeOf(this, TimeoutError.prototype);
		}
	};
	exports.TimeoutError = TimeoutError;
	/**
	* Adds a timeout to a promise and rejects if the specified timeout has elapsed. Also rejects if the specified promise
	* rejects, and resolves if the specified promise resolves.
	*
	* <p> NOTE: this operation will continue even after it throws a {@link TimeoutError}.
	*
	* @param promise promise to use with timeout.
	* @param timeout the timeout in milliseconds until the returned promise is rejected.
	*/
	function callWithTimeout(promise, timeout) {
		let timeoutHandle;
		const timeoutPromise = new Promise(function timeoutFunction(_resolve, reject) {
			timeoutHandle = setTimeout(function timeoutHandler() {
				reject(new TimeoutError("Operation timed out."));
			}, timeout);
		});
		return Promise.race([promise, timeoutPromise]).then((result) => {
			clearTimeout(timeoutHandle);
			return result;
		}, (reason) => {
			clearTimeout(timeoutHandle);
			throw reason;
		});
	}
	exports.callWithTimeout = callWithTimeout;
	function setEquals(lhs, rhs) {
		if (lhs.size !== rhs.size) return false;
		for (const item of lhs) if (!rhs.has(item)) return false;
		return true;
	}
	exports.setEquals = setEquals;
	/**
	* Binary search the sorted array to the find upper bound for the value.
	* @param arr
	* @param value
	* @returns
	*/
	function binarySearchUB(arr, value) {
		let lo = 0;
		let hi = arr.length - 1;
		let ret = arr.length;
		while (hi >= lo) {
			const mid = lo + Math.trunc((hi - lo) / 2);
			if (arr[mid] < value) lo = mid + 1;
			else {
				ret = mid;
				hi = mid - 1;
			}
		}
		return ret;
	}
	exports.binarySearchUB = binarySearchUB;
	function equalsCaseInsensitive(lhs, rhs) {
		return lhs.toLowerCase() === rhs.toLowerCase();
	}
	exports.equalsCaseInsensitive = equalsCaseInsensitive;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/aggregator/types.js
var require_types$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AggregatorKind = void 0;
	/** The kind of aggregator. */
	var AggregatorKind;
	(function(AggregatorKind) {
		AggregatorKind[AggregatorKind["DROP"] = 0] = "DROP";
		AggregatorKind[AggregatorKind["SUM"] = 1] = "SUM";
		AggregatorKind[AggregatorKind["LAST_VALUE"] = 2] = "LAST_VALUE";
		AggregatorKind[AggregatorKind["HISTOGRAM"] = 3] = "HISTOGRAM";
		AggregatorKind[AggregatorKind["EXPONENTIAL_HISTOGRAM"] = 4] = "EXPONENTIAL_HISTOGRAM";
	})(AggregatorKind || (exports.AggregatorKind = AggregatorKind = {}));
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/aggregator/Drop.js
var require_Drop = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DropAggregator = void 0;
	const types_1 = require_types$2();
	/** Basic aggregator for None which keeps no recorded value. */
	var DropAggregator = class {
		kind = types_1.AggregatorKind.DROP;
		createAccumulation() {}
		merge(_previous, _delta) {}
		diff(_previous, _current) {}
		toMetricData(_descriptor, _aggregationTemporality, _accumulationByAttributes, _endTime) {}
	};
	exports.DropAggregator = DropAggregator;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/aggregator/Histogram.js
var require_Histogram = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.HistogramAggregator = exports.HistogramAccumulation = void 0;
	const types_1 = require_types$2();
	const MetricData_1 = require_MetricData();
	const utils_1 = require_utils$5();
	function createNewEmptyCheckpoint(boundaries) {
		const counts = boundaries.map(() => 0);
		counts.push(0);
		return {
			buckets: {
				boundaries,
				counts
			},
			sum: 0,
			count: 0,
			hasMinMax: false,
			min: Infinity,
			max: -Infinity
		};
	}
	var HistogramAccumulation = class {
		startTime;
		_boundaries;
		_recordMinMax;
		_current;
		constructor(startTime, boundaries, recordMinMax = true, current = createNewEmptyCheckpoint(boundaries)) {
			this.startTime = startTime;
			this._boundaries = boundaries;
			this._recordMinMax = recordMinMax;
			this._current = current;
		}
		record(value) {
			if (Number.isNaN(value)) return;
			this._current.count += 1;
			this._current.sum += value;
			if (this._recordMinMax) {
				this._current.min = Math.min(value, this._current.min);
				this._current.max = Math.max(value, this._current.max);
				this._current.hasMinMax = true;
			}
			const idx = (0, utils_1.binarySearchUB)(this._boundaries, value);
			this._current.buckets.counts[idx] += 1;
		}
		setStartTime(startTime) {
			this.startTime = startTime;
		}
		toPointValue() {
			return this._current;
		}
	};
	exports.HistogramAccumulation = HistogramAccumulation;
	/**
	* Basic aggregator which observes events and counts them in pre-defined buckets
	* and provides the total sum and count of all observations.
	*/
	var HistogramAggregator = class {
		kind = types_1.AggregatorKind.HISTOGRAM;
		_boundaries;
		_recordMinMax;
		/**
		* @param _boundaries sorted upper bounds of recorded values.
		* @param _recordMinMax If set to true, min and max will be recorded. Otherwise, min and max will not be recorded.
		*/
		constructor(boundaries, recordMinMax) {
			this._boundaries = boundaries;
			this._recordMinMax = recordMinMax;
		}
		createAccumulation(startTime) {
			return new HistogramAccumulation(startTime, this._boundaries, this._recordMinMax);
		}
		/**
		* Return the result of the merge of two histogram accumulations. As long as one Aggregator
		* instance produces all Accumulations with constant boundaries we don't need to worry about
		* merging accumulations with different boundaries.
		*/
		merge(previous, delta) {
			const previousValue = previous.toPointValue();
			const deltaValue = delta.toPointValue();
			const previousCounts = previousValue.buckets.counts;
			const deltaCounts = deltaValue.buckets.counts;
			const mergedCounts = new Array(previousCounts.length);
			for (let idx = 0; idx < previousCounts.length; idx++) mergedCounts[idx] = previousCounts[idx] + deltaCounts[idx];
			let min = Infinity;
			let max = -Infinity;
			if (this._recordMinMax) {
				if (previousValue.hasMinMax && deltaValue.hasMinMax) {
					min = Math.min(previousValue.min, deltaValue.min);
					max = Math.max(previousValue.max, deltaValue.max);
				} else if (previousValue.hasMinMax) {
					min = previousValue.min;
					max = previousValue.max;
				} else if (deltaValue.hasMinMax) {
					min = deltaValue.min;
					max = deltaValue.max;
				}
			}
			return new HistogramAccumulation(previous.startTime, previousValue.buckets.boundaries, this._recordMinMax, {
				buckets: {
					boundaries: previousValue.buckets.boundaries,
					counts: mergedCounts
				},
				count: previousValue.count + deltaValue.count,
				sum: previousValue.sum + deltaValue.sum,
				hasMinMax: this._recordMinMax && (previousValue.hasMinMax || deltaValue.hasMinMax),
				min,
				max
			});
		}
		/**
		* Returns a new DELTA aggregation by comparing two cumulative measurements.
		*/
		diff(previous, current) {
			const previousValue = previous.toPointValue();
			const currentValue = current.toPointValue();
			const previousCounts = previousValue.buckets.counts;
			const currentCounts = currentValue.buckets.counts;
			const diffedCounts = new Array(previousCounts.length);
			for (let idx = 0; idx < previousCounts.length; idx++) diffedCounts[idx] = currentCounts[idx] - previousCounts[idx];
			return new HistogramAccumulation(current.startTime, previousValue.buckets.boundaries, this._recordMinMax, {
				buckets: {
					boundaries: previousValue.buckets.boundaries,
					counts: diffedCounts
				},
				count: currentValue.count - previousValue.count,
				sum: currentValue.sum - previousValue.sum,
				hasMinMax: false,
				min: Infinity,
				max: -Infinity
			});
		}
		toMetricData(descriptor, aggregationTemporality, accumulationByAttributes, endTime) {
			return {
				descriptor,
				aggregationTemporality,
				dataPointType: MetricData_1.DataPointType.HISTOGRAM,
				dataPoints: accumulationByAttributes.map(([attributes, accumulation]) => {
					const pointValue = accumulation.toPointValue();
					const allowsNegativeValues = descriptor.type === MetricData_1.InstrumentType.GAUGE || descriptor.type === MetricData_1.InstrumentType.UP_DOWN_COUNTER || descriptor.type === MetricData_1.InstrumentType.OBSERVABLE_GAUGE || descriptor.type === MetricData_1.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER;
					return {
						attributes,
						startTime: accumulation.startTime,
						endTime,
						value: {
							min: pointValue.hasMinMax ? pointValue.min : void 0,
							max: pointValue.hasMinMax ? pointValue.max : void 0,
							sum: !allowsNegativeValues ? pointValue.sum : void 0,
							buckets: pointValue.buckets,
							count: pointValue.count
						}
					};
				})
			};
		}
	};
	exports.HistogramAggregator = HistogramAggregator;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/aggregator/exponential-histogram/Buckets.js
var require_Buckets = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Buckets = void 0;
	exports.Buckets = class Buckets {
		backing;
		indexBase;
		indexStart;
		indexEnd;
		/**
		* The term index refers to the number of the exponential histogram bucket
		* used to determine its boundaries. The lower boundary of a bucket is
		* determined by base ** index and the upper boundary of a bucket is
		* determined by base ** (index + 1). index values are signed to account
		* for values less than or equal to 1.
		*
		* indexBase is the index of the 0th position in the
		* backing array, i.e., backing[0] is the count
		* in the bucket with index `indexBase`.
		*
		* indexStart is the smallest index value represented
		* in the backing array.
		*
		* indexEnd is the largest index value represented in
		* the backing array.
		*/
		constructor(backing = new BucketsBacking(), indexBase = 0, indexStart = 0, indexEnd = 0) {
			this.backing = backing;
			this.indexBase = indexBase;
			this.indexStart = indexStart;
			this.indexEnd = indexEnd;
		}
		/**
		* Offset is the bucket index of the smallest entry in the counts array
		* @returns {number}
		*/
		get offset() {
			return this.indexStart;
		}
		/**
		* Buckets is a view into the backing array.
		* @returns {number}
		*/
		get length() {
			if (this.backing.length === 0) return 0;
			if (this.indexEnd === this.indexStart && this.at(0) === 0) return 0;
			return this.indexEnd - this.indexStart + 1;
		}
		/**
		* An array of counts, where count[i] carries the count
		* of the bucket at index (offset+i).  count[i] is the count of
		* values greater than base^(offset+i) and less than or equal to
		* base^(offset+i+1).
		* @returns {number} The logical counts based on the backing array
		*/
		counts() {
			return Array.from({ length: this.length }, (_, i) => this.at(i));
		}
		/**
		* At returns the count of the bucket at a position in the logical
		* array of counts.
		* @param position
		* @returns {number}
		*/
		at(position) {
			const bias = this.indexBase - this.indexStart;
			if (position < bias) position += this.backing.length;
			position -= bias;
			return this.backing.countAt(position);
		}
		/**
		* incrementBucket increments the backing array index by `increment`
		* @param bucketIndex
		* @param increment
		*/
		incrementBucket(bucketIndex, increment) {
			this.backing.increment(bucketIndex, increment);
		}
		/**
		* decrementBucket decrements the backing array index by `decrement`
		* if decrement is greater than the current value, it's set to 0.
		* @param bucketIndex
		* @param decrement
		*/
		decrementBucket(bucketIndex, decrement) {
			this.backing.decrement(bucketIndex, decrement);
		}
		/**
		* trim removes leading and / or trailing zero buckets (which can occur
		* after diffing two histos) and rotates the backing array so that the
		* smallest non-zero index is in the 0th position of the backing array
		*/
		trim() {
			for (let i = 0; i < this.length; i++) if (this.at(i) !== 0) {
				this.indexStart += i;
				break;
			} else if (i === this.length - 1) {
				this.indexStart = this.indexEnd = this.indexBase = 0;
				return;
			}
			for (let i = this.length - 1; i >= 0; i--) if (this.at(i) !== 0) {
				this.indexEnd -= this.length - i - 1;
				break;
			}
			this._rotate();
		}
		/**
		* downscale first rotates, then collapses 2**`by`-to-1 buckets.
		* @param by
		*/
		downscale(by) {
			this._rotate();
			const size = 1 + this.indexEnd - this.indexStart;
			const each = 1 << by;
			let inpos = 0;
			let outpos = 0;
			for (let pos = this.indexStart; pos <= this.indexEnd;) {
				let mod = pos % each;
				if (mod < 0) mod += each;
				for (let i = mod; i < each && inpos < size; i++) {
					this._relocateBucket(outpos, inpos);
					inpos++;
					pos++;
				}
				outpos++;
			}
			this.indexStart >>= by;
			this.indexEnd >>= by;
			this.indexBase = this.indexStart;
		}
		/**
		* Clone returns a deep copy of Buckets
		* @returns {Buckets}
		*/
		clone() {
			return new Buckets(this.backing.clone(), this.indexBase, this.indexStart, this.indexEnd);
		}
		/**
		* _rotate shifts the backing array contents so that indexStart ==
		* indexBase to simplify the downscale logic.
		*/
		_rotate() {
			const bias = this.indexBase - this.indexStart;
			if (bias === 0) return;
			else if (bias > 0) {
				this.backing.reverse(0, this.backing.length);
				this.backing.reverse(0, bias);
				this.backing.reverse(bias, this.backing.length);
			} else {
				this.backing.reverse(0, this.backing.length);
				this.backing.reverse(0, this.backing.length + bias);
			}
			this.indexBase = this.indexStart;
		}
		/**
		* _relocateBucket adds the count in counts[src] to counts[dest] and
		* resets count[src] to zero.
		*/
		_relocateBucket(dest, src) {
			if (dest === src) return;
			this.incrementBucket(dest, this.backing.emptyBucket(src));
		}
	};
	/**
	* BucketsBacking holds the raw buckets and some utility methods to
	* manage them.
	*/
	var BucketsBacking = class BucketsBacking {
		_counts;
		constructor(counts = [0]) {
			this._counts = counts;
		}
		/**
		* length returns the physical size of the backing array, which
		* is >= buckets.length()
		*/
		get length() {
			return this._counts.length;
		}
		/**
		* countAt returns the count in a specific bucket
		*/
		countAt(pos) {
			return this._counts[pos];
		}
		/**
		* growTo grows a backing array and copies old entries
		* into their correct new positions.
		*/
		growTo(newSize, oldPositiveLimit, newPositiveLimit) {
			const tmp = new Array(newSize).fill(0);
			tmp.splice(newPositiveLimit, this._counts.length - oldPositiveLimit, ...this._counts.slice(oldPositiveLimit));
			tmp.splice(0, oldPositiveLimit, ...this._counts.slice(0, oldPositiveLimit));
			this._counts = tmp;
		}
		/**
		* reverse the items in the backing array in the range [from, limit).
		*/
		reverse(from, limit) {
			const num = Math.floor((from + limit) / 2) - from;
			for (let i = 0; i < num; i++) {
				const tmp = this._counts[from + i];
				this._counts[from + i] = this._counts[limit - i - 1];
				this._counts[limit - i - 1] = tmp;
			}
		}
		/**
		* emptyBucket empties the count from a bucket, for
		* moving into another.
		*/
		emptyBucket(src) {
			const tmp = this._counts[src];
			this._counts[src] = 0;
			return tmp;
		}
		/**
		* increments a bucket by `increment`
		*/
		increment(bucketIndex, increment) {
			this._counts[bucketIndex] += increment;
		}
		/**
		* decrements a bucket by `decrement`
		*/
		decrement(bucketIndex, decrement) {
			if (this._counts[bucketIndex] >= decrement) this._counts[bucketIndex] -= decrement;
			else this._counts[bucketIndex] = 0;
		}
		/**
		* clone returns a deep copy of BucketsBacking
		*/
		clone() {
			return new BucketsBacking([...this._counts]);
		}
	};
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/aggregator/exponential-histogram/mapping/ieee754.js
var require_ieee754 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getSignificand = exports.getNormalBase2 = exports.MIN_VALUE = exports.MAX_NORMAL_EXPONENT = exports.MIN_NORMAL_EXPONENT = exports.SIGNIFICAND_WIDTH = void 0;
	/**
	* The functions and constants in this file allow us to interact
	* with the internal representation of an IEEE 64-bit floating point
	* number. We need to work with all 64-bits, thus, care needs to be
	* taken when working with Javascript's bitwise operators (<<, >>, &,
	* |, etc) as they truncate operands to 32-bits. In order to work around
	* this we work with the 64-bits as two 32-bit halves, perform bitwise
	* operations on them independently, and combine the results (if needed).
	*/
	exports.SIGNIFICAND_WIDTH = 52;
	/**
	* EXPONENT_MASK is set to 1 for the hi 32-bits of an IEEE 754
	* floating point exponent: 0x7ff00000.
	*/
	const EXPONENT_MASK = 2146435072;
	/**
	* SIGNIFICAND_MASK is the mask for the significand portion of the hi 32-bits
	* of an IEEE 754 double-precision floating-point value: 0xfffff
	*/
	const SIGNIFICAND_MASK = 1048575;
	/**
	* EXPONENT_BIAS is the exponent bias specified for encoding
	* the IEEE 754 double-precision floating point exponent: 1023
	*/
	const EXPONENT_BIAS = 1023;
	/**
	* MIN_NORMAL_EXPONENT is the minimum exponent of a normalized
	* floating point: -1022.
	*/
	exports.MIN_NORMAL_EXPONENT = -1022;
	/**
	* MAX_NORMAL_EXPONENT is the maximum exponent of a normalized
	* floating point: 1023.
	*/
	exports.MAX_NORMAL_EXPONENT = EXPONENT_BIAS;
	/**
	* MIN_VALUE is the smallest normal number
	*/
	exports.MIN_VALUE = Math.pow(2, -1022);
	/**
	* getNormalBase2 extracts the normalized base-2 fractional exponent.
	* This returns k for the equation f x 2**k where f is
	* in the range [1, 2).  Note that this function is not called for
	* subnormal numbers.
	* @param {number} value - the value to determine normalized base-2 fractional
	*    exponent for
	* @returns {number} the normalized base-2 exponent
	*/
	function getNormalBase2(value) {
		const dv = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(8));
		dv.setFloat64(0, value);
		return ((dv.getUint32(0) & EXPONENT_MASK) >> 20) - EXPONENT_BIAS;
	}
	exports.getNormalBase2 = getNormalBase2;
	/**
	* GetSignificand returns the 52 bit (unsigned) significand as a signed value.
	* @param {number} value - the floating point number to extract the significand from
	* @returns {number} The 52-bit significand
	*/
	function getSignificand(value) {
		const dv = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(8));
		dv.setFloat64(0, value);
		const hiBits = dv.getUint32(0);
		const loBits = dv.getUint32(4);
		return (hiBits & SIGNIFICAND_MASK) * Math.pow(2, 32) + loBits;
	}
	exports.getSignificand = getSignificand;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/aggregator/exponential-histogram/util.js
var require_util = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.nextGreaterSquare = exports.ldexp = void 0;
	/**
	* Note: other languages provide this as a built in function. This is
	* a naive, but functionally correct implementation. This is used sparingly,
	* when creating a new mapping in a running application.
	*
	* ldexp returns frac × 2**exp. With the following special cases:
	*   ldexp(±0, exp) = ±0
	*   ldexp(±Inf, exp) = ±Inf
	*   ldexp(NaN, exp) = NaN
	* @param frac
	* @param exp
	* @returns {number}
	*/
	function ldexp(frac, exp) {
		if (frac === 0 || frac === Number.POSITIVE_INFINITY || frac === Number.NEGATIVE_INFINITY || Number.isNaN(frac)) return frac;
		return frac * Math.pow(2, exp);
	}
	exports.ldexp = ldexp;
	/**
	* Computes the next power of two that is greater than or equal to v.
	* This implementation more efficient than, but functionally equivalent
	* to Math.pow(2, Math.ceil(Math.log(x)/Math.log(2))).
	* @param v
	* @returns {number}
	*/
	function nextGreaterSquare(v) {
		v--;
		v |= v >> 1;
		v |= v >> 2;
		v |= v >> 4;
		v |= v >> 8;
		v |= v >> 16;
		v++;
		return v;
	}
	exports.nextGreaterSquare = nextGreaterSquare;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/aggregator/exponential-histogram/mapping/types.js
var require_types$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MappingError = void 0;
	var MappingError = class extends Error {};
	exports.MappingError = MappingError;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/aggregator/exponential-histogram/mapping/ExponentMapping.js
var require_ExponentMapping = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ExponentMapping = void 0;
	const ieee754 = require_ieee754();
	const util = require_util();
	const types_1 = require_types$1();
	/**
	* ExponentMapping implements exponential mapping functions for
	* scales <=0. For scales > 0 LogarithmMapping should be used.
	*/
	var ExponentMapping = class {
		_shift;
		constructor(scale) {
			this._shift = -scale;
		}
		/**
		* Maps positive floating point values to indexes corresponding to scale
		* @param value
		* @returns {number} index for provided value at the current scale
		*/
		mapToIndex(value) {
			if (value < ieee754.MIN_VALUE) return this._minNormalLowerBoundaryIndex();
			return ieee754.getNormalBase2(value) + this._rightShift(ieee754.getSignificand(value) - 1, ieee754.SIGNIFICAND_WIDTH) >> this._shift;
		}
		/**
		* Returns the lower bucket boundary for the given index for scale
		*
		* @param index
		* @returns {number}
		*/
		lowerBoundary(index) {
			const minIndex = this._minNormalLowerBoundaryIndex();
			if (index < minIndex) throw new types_1.MappingError(`underflow: ${index} is < minimum lower boundary: ${minIndex}`);
			const maxIndex = this._maxNormalLowerBoundaryIndex();
			if (index > maxIndex) throw new types_1.MappingError(`overflow: ${index} is > maximum lower boundary: ${maxIndex}`);
			return util.ldexp(1, index << this._shift);
		}
		/**
		* The scale used by this mapping
		* @returns {number}
		*/
		get scale() {
			if (this._shift === 0) return 0;
			return -this._shift;
		}
		_minNormalLowerBoundaryIndex() {
			let index = ieee754.MIN_NORMAL_EXPONENT >> this._shift;
			if (this._shift < 2) index--;
			return index;
		}
		_maxNormalLowerBoundaryIndex() {
			return ieee754.MAX_NORMAL_EXPONENT >> this._shift;
		}
		_rightShift(value, shift) {
			return Math.floor(value * Math.pow(2, -shift));
		}
	};
	exports.ExponentMapping = ExponentMapping;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/aggregator/exponential-histogram/mapping/LogarithmMapping.js
var require_LogarithmMapping = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.LogarithmMapping = void 0;
	const ieee754 = require_ieee754();
	const util = require_util();
	const types_1 = require_types$1();
	/**
	* LogarithmMapping implements exponential mapping functions for scale > 0.
	* For scales <= 0 the exponent mapping should be used.
	*/
	var LogarithmMapping = class {
		_scale;
		_scaleFactor;
		_inverseFactor;
		constructor(scale) {
			this._scale = scale;
			this._scaleFactor = util.ldexp(Math.LOG2E, scale);
			this._inverseFactor = util.ldexp(Math.LN2, -scale);
		}
		/**
		* Maps positive floating point values to indexes corresponding to scale
		* @param value
		* @returns {number} index for provided value at the current scale
		*/
		mapToIndex(value) {
			if (value <= ieee754.MIN_VALUE) return this._minNormalLowerBoundaryIndex() - 1;
			if (ieee754.getSignificand(value) === 0) return (ieee754.getNormalBase2(value) << this._scale) - 1;
			const index = Math.floor(Math.log(value) * this._scaleFactor);
			const maxIndex = this._maxNormalLowerBoundaryIndex();
			if (index >= maxIndex) return maxIndex;
			return index;
		}
		/**
		* Returns the lower bucket boundary for the given index for scale
		*
		* @param index
		* @returns {number}
		*/
		lowerBoundary(index) {
			const maxIndex = this._maxNormalLowerBoundaryIndex();
			if (index >= maxIndex) {
				if (index === maxIndex) return 2 * Math.exp((index - (1 << this._scale)) / this._scaleFactor);
				throw new types_1.MappingError(`overflow: ${index} is > maximum lower boundary: ${maxIndex}`);
			}
			const minIndex = this._minNormalLowerBoundaryIndex();
			if (index <= minIndex) {
				if (index === minIndex) return ieee754.MIN_VALUE;
				else if (index === minIndex - 1) return Math.exp((index + (1 << this._scale)) / this._scaleFactor) / 2;
				throw new types_1.MappingError(`overflow: ${index} is < minimum lower boundary: ${minIndex}`);
			}
			return Math.exp(index * this._inverseFactor);
		}
		/**
		* The scale used by this mapping
		* @returns {number}
		*/
		get scale() {
			return this._scale;
		}
		_minNormalLowerBoundaryIndex() {
			return ieee754.MIN_NORMAL_EXPONENT << this._scale;
		}
		_maxNormalLowerBoundaryIndex() {
			return (ieee754.MAX_NORMAL_EXPONENT + 1 << this._scale) - 1;
		}
	};
	exports.LogarithmMapping = LogarithmMapping;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/aggregator/exponential-histogram/mapping/getMapping.js
var require_getMapping = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getMapping = void 0;
	const ExponentMapping_1 = require_ExponentMapping();
	const LogarithmMapping_1 = require_LogarithmMapping();
	const types_1 = require_types$1();
	const MIN_SCALE = -10;
	const MAX_SCALE = 20;
	const PREBUILT_MAPPINGS = Array.from({ length: 31 }, (_, i) => {
		if (i > 10) return new LogarithmMapping_1.LogarithmMapping(i - 10);
		return new ExponentMapping_1.ExponentMapping(i - 10);
	});
	/**
	* getMapping returns an appropriate mapping for the given scale. For scales -10
	* to 0 the underlying type will be ExponentMapping. For scales 1 to 20 the
	* underlying type will be LogarithmMapping.
	* @param scale a number in the range [-10, 20]
	* @returns {Mapping}
	*/
	function getMapping(scale) {
		if (scale > MAX_SCALE || scale < MIN_SCALE) throw new types_1.MappingError(`expected scale >= ${MIN_SCALE} && <= ${MAX_SCALE}, got: ${scale}`);
		return PREBUILT_MAPPINGS[scale + 10];
	}
	exports.getMapping = getMapping;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/aggregator/ExponentialHistogram.js
var require_ExponentialHistogram = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ExponentialHistogramAggregator = exports.ExponentialHistogramAccumulation = void 0;
	const types_1 = require_types$2();
	const MetricData_1 = require_MetricData();
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const Buckets_1 = require_Buckets();
	const getMapping_1 = require_getMapping();
	const util_1 = require_util();
	var HighLow = class HighLow {
		static combine(h1, h2) {
			return new HighLow(Math.min(h1.low, h2.low), Math.max(h1.high, h2.high));
		}
		low;
		high;
		constructor(low, high) {
			this.low = low;
			this.high = high;
		}
	};
	const MAX_SCALE = 20;
	const DEFAULT_MAX_SIZE = 160;
	const MIN_MAX_SIZE = 2;
	var ExponentialHistogramAccumulation = class ExponentialHistogramAccumulation {
		startTime;
		_maxSize;
		_recordMinMax;
		_sum;
		_count;
		_zeroCount;
		_min;
		_max;
		_positive;
		_negative;
		_mapping;
		constructor(startTime, maxSize = DEFAULT_MAX_SIZE, recordMinMax = true, sum = 0, count = 0, zeroCount = 0, min = Number.POSITIVE_INFINITY, max = Number.NEGATIVE_INFINITY, positive = new Buckets_1.Buckets(), negative = new Buckets_1.Buckets(), mapping = (0, getMapping_1.getMapping)(MAX_SCALE)) {
			this.startTime = startTime;
			this._maxSize = maxSize;
			this._recordMinMax = recordMinMax;
			this._sum = sum;
			this._count = count;
			this._zeroCount = zeroCount;
			this._min = min;
			this._max = max;
			this._positive = positive;
			this._negative = negative;
			this._mapping = mapping;
			if (this._maxSize < MIN_MAX_SIZE) {
				api_1.diag.warn(`Exponential Histogram Max Size set to ${this._maxSize}, \
                changing to the minimum size of: ${MIN_MAX_SIZE}`);
				this._maxSize = MIN_MAX_SIZE;
			}
		}
		/**
		* record updates a histogram with a single count
		* @param {Number} value
		*/
		record(value) {
			this.updateByIncrement(value, 1);
		}
		/**
		* Sets the start time for this accumulation
		* @param {HrTime} startTime
		*/
		setStartTime(startTime) {
			this.startTime = startTime;
		}
		/**
		* Returns the datapoint representation of this accumulation
		* @param {HrTime} startTime
		*/
		toPointValue() {
			return {
				hasMinMax: this._recordMinMax,
				min: this.min,
				max: this.max,
				sum: this.sum,
				positive: {
					offset: this.positive.offset,
					bucketCounts: this.positive.counts()
				},
				negative: {
					offset: this.negative.offset,
					bucketCounts: this.negative.counts()
				},
				count: this.count,
				scale: this.scale,
				zeroCount: this.zeroCount
			};
		}
		/**
		* @returns {Number} The sum of values recorded by this accumulation
		*/
		get sum() {
			return this._sum;
		}
		/**
		* @returns {Number} The minimum value recorded by this accumulation
		*/
		get min() {
			return this._min;
		}
		/**
		* @returns {Number} The maximum value recorded by this accumulation
		*/
		get max() {
			return this._max;
		}
		/**
		* @returns {Number} The count of values recorded by this accumulation
		*/
		get count() {
			return this._count;
		}
		/**
		* @returns {Number} The number of 0 values recorded by this accumulation
		*/
		get zeroCount() {
			return this._zeroCount;
		}
		/**
		* @returns {Number} The scale used by this accumulation
		*/
		get scale() {
			if (this._count === this._zeroCount) return 0;
			return this._mapping.scale;
		}
		/**
		* positive holds the positive values
		* @returns {Buckets}
		*/
		get positive() {
			return this._positive;
		}
		/**
		* negative holds the negative values by their absolute value
		* @returns {Buckets}
		*/
		get negative() {
			return this._negative;
		}
		/**
		* updateByIncr supports updating a histogram with a non-negative
		* increment.
		* @param value
		* @param increment
		*/
		updateByIncrement(value, increment) {
			if (Number.isNaN(value)) return;
			if (value > this._max) this._max = value;
			if (value < this._min) this._min = value;
			this._count += increment;
			if (value === 0) {
				this._zeroCount += increment;
				return;
			}
			this._sum += value * increment;
			if (value > 0) this._updateBuckets(this._positive, value, increment);
			else this._updateBuckets(this._negative, -value, increment);
		}
		/**
		* merge combines data from previous value into self
		* @param {ExponentialHistogramAccumulation} previous
		*/
		merge(previous) {
			if (this._count === 0) {
				this._min = previous.min;
				this._max = previous.max;
			} else if (previous.count !== 0) {
				if (previous.min < this.min) this._min = previous.min;
				if (previous.max > this.max) this._max = previous.max;
			}
			this.startTime = previous.startTime;
			this._sum += previous.sum;
			this._count += previous.count;
			this._zeroCount += previous.zeroCount;
			const minScale = this._minScale(previous);
			this._downscale(this.scale - minScale);
			this._mergeBuckets(this.positive, previous, previous.positive, minScale);
			this._mergeBuckets(this.negative, previous, previous.negative, minScale);
		}
		/**
		* diff subtracts other from self
		* @param {ExponentialHistogramAccumulation} other
		*/
		diff(other) {
			this._min = Infinity;
			this._max = -Infinity;
			this._sum -= other.sum;
			this._count -= other.count;
			this._zeroCount -= other.zeroCount;
			const minScale = this._minScale(other);
			this._downscale(this.scale - minScale);
			this._diffBuckets(this.positive, other, other.positive, minScale);
			this._diffBuckets(this.negative, other, other.negative, minScale);
		}
		/**
		* clone returns a deep copy of self
		* @returns {ExponentialHistogramAccumulation}
		*/
		clone() {
			return new ExponentialHistogramAccumulation(this.startTime, this._maxSize, this._recordMinMax, this._sum, this._count, this._zeroCount, this._min, this._max, this.positive.clone(), this.negative.clone(), this._mapping);
		}
		/**
		* _updateBuckets maps the incoming value to a bucket index for the current
		* scale. If the bucket index is outside of the range of the backing array,
		* it will rescale the backing array and update the mapping for the new scale.
		*/
		_updateBuckets(buckets, value, increment) {
			let index = this._mapping.mapToIndex(value);
			let rescalingNeeded = false;
			let high = 0;
			let low = 0;
			if (buckets.length === 0) {
				buckets.indexStart = index;
				buckets.indexEnd = buckets.indexStart;
				buckets.indexBase = buckets.indexStart;
			} else if (index < buckets.indexStart && buckets.indexEnd - index >= this._maxSize) {
				rescalingNeeded = true;
				low = index;
				high = buckets.indexEnd;
			} else if (index > buckets.indexEnd && index - buckets.indexStart >= this._maxSize) {
				rescalingNeeded = true;
				low = buckets.indexStart;
				high = index;
			}
			if (rescalingNeeded) {
				const change = this._changeScale(high, low);
				this._downscale(change);
				index = this._mapping.mapToIndex(value);
			}
			this._incrementIndexBy(buckets, index, increment);
		}
		/**
		* _incrementIndexBy increments the count of the bucket specified by `index`.
		* If the index is outside of the range [buckets.indexStart, buckets.indexEnd]
		* the boundaries of the backing array will be adjusted and more buckets will
		* be added if needed.
		*/
		_incrementIndexBy(buckets, index, increment) {
			if (increment === 0) return;
			if (buckets.length === 0) buckets.indexStart = buckets.indexEnd = buckets.indexBase = index;
			if (index < buckets.indexStart) {
				const span = buckets.indexEnd - index;
				if (span >= buckets.backing.length) this._grow(buckets, span + 1);
				buckets.indexStart = index;
			} else if (index > buckets.indexEnd) {
				const span = index - buckets.indexStart;
				if (span >= buckets.backing.length) this._grow(buckets, span + 1);
				buckets.indexEnd = index;
			}
			let bucketIndex = index - buckets.indexBase;
			if (bucketIndex < 0) bucketIndex += buckets.backing.length;
			buckets.incrementBucket(bucketIndex, increment);
		}
		/**
		* grow resizes the backing array by doubling in size up to maxSize.
		* This extends the array with a bunch of zeros and copies the
		* existing counts to the same position.
		*/
		_grow(buckets, needed) {
			const size = buckets.backing.length;
			const bias = buckets.indexBase - buckets.indexStart;
			const oldPositiveLimit = size - bias;
			let newSize = (0, util_1.nextGreaterSquare)(needed);
			if (newSize > this._maxSize) newSize = this._maxSize;
			const newPositiveLimit = newSize - bias;
			buckets.backing.growTo(newSize, oldPositiveLimit, newPositiveLimit);
		}
		/**
		* _changeScale computes how much downscaling is needed by shifting the
		* high and low values until they are separated by no more than size.
		*/
		_changeScale(high, low) {
			let change = 0;
			while (high - low >= this._maxSize) {
				high >>= 1;
				low >>= 1;
				change++;
			}
			return change;
		}
		/**
		* _downscale subtracts `change` from the current mapping scale.
		*/
		_downscale(change) {
			if (change === 0) return;
			if (change < 0) throw new Error(`impossible change of scale: ${this.scale}`);
			const newScale = this._mapping.scale - change;
			this._positive.downscale(change);
			this._negative.downscale(change);
			this._mapping = (0, getMapping_1.getMapping)(newScale);
		}
		/**
		* _minScale is used by diff and merge to compute an ideal combined scale
		*/
		_minScale(other) {
			const minScale = Math.min(this.scale, other.scale);
			const highLowPos = HighLow.combine(this._highLowAtScale(this.positive, this.scale, minScale), this._highLowAtScale(other.positive, other.scale, minScale));
			const highLowNeg = HighLow.combine(this._highLowAtScale(this.negative, this.scale, minScale), this._highLowAtScale(other.negative, other.scale, minScale));
			return Math.min(minScale - this._changeScale(highLowPos.high, highLowPos.low), minScale - this._changeScale(highLowNeg.high, highLowNeg.low));
		}
		/**
		* _highLowAtScale is used by diff and merge to compute an ideal combined scale.
		*/
		_highLowAtScale(buckets, currentScale, newScale) {
			if (buckets.length === 0) return new HighLow(0, -1);
			const shift = currentScale - newScale;
			return new HighLow(buckets.indexStart >> shift, buckets.indexEnd >> shift);
		}
		/**
		* _mergeBuckets translates index values from another histogram and
		* adds the values into the corresponding buckets of this histogram.
		*/
		_mergeBuckets(ours, other, theirs, scale) {
			const theirOffset = theirs.offset;
			const theirChange = other.scale - scale;
			for (let i = 0; i < theirs.length; i++) this._incrementIndexBy(ours, theirOffset + i >> theirChange, theirs.at(i));
		}
		/**
		* _diffBuckets translates index values from another histogram and
		* subtracts the values in the corresponding buckets of this histogram.
		*/
		_diffBuckets(ours, other, theirs, scale) {
			const theirOffset = theirs.offset;
			const theirChange = other.scale - scale;
			for (let i = 0; i < theirs.length; i++) {
				let bucketIndex = (theirOffset + i >> theirChange) - ours.indexBase;
				if (bucketIndex < 0) bucketIndex += ours.backing.length;
				ours.decrementBucket(bucketIndex, theirs.at(i));
			}
			ours.trim();
		}
	};
	exports.ExponentialHistogramAccumulation = ExponentialHistogramAccumulation;
	/**
	* Aggregator for ExponentialHistogramAccumulations
	*/
	var ExponentialHistogramAggregator = class {
		kind = types_1.AggregatorKind.EXPONENTIAL_HISTOGRAM;
		_maxSize;
		_recordMinMax;
		/**
		* @param _maxSize Maximum number of buckets for each of the positive
		*    and negative ranges, exclusive of the zero-bucket.
		* @param _recordMinMax If set to true, min and max will be recorded.
		*    Otherwise, min and max will not be recorded.
		*/
		constructor(maxSize, recordMinMax) {
			this._maxSize = maxSize;
			this._recordMinMax = recordMinMax;
		}
		createAccumulation(startTime) {
			return new ExponentialHistogramAccumulation(startTime, this._maxSize, this._recordMinMax);
		}
		/**
		* Return the result of the merge of two exponential histogram accumulations.
		*/
		merge(previous, delta) {
			const result = delta.clone();
			result.merge(previous);
			return result;
		}
		/**
		* Returns a new DELTA aggregation by comparing two cumulative measurements.
		*/
		diff(previous, current) {
			const result = current.clone();
			result.diff(previous);
			return result;
		}
		toMetricData(descriptor, aggregationTemporality, accumulationByAttributes, endTime) {
			return {
				descriptor,
				aggregationTemporality,
				dataPointType: MetricData_1.DataPointType.EXPONENTIAL_HISTOGRAM,
				dataPoints: accumulationByAttributes.map(([attributes, accumulation]) => {
					const pointValue = accumulation.toPointValue();
					const allowsNegativeValues = descriptor.type === MetricData_1.InstrumentType.GAUGE || descriptor.type === MetricData_1.InstrumentType.UP_DOWN_COUNTER || descriptor.type === MetricData_1.InstrumentType.OBSERVABLE_GAUGE || descriptor.type === MetricData_1.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER;
					return {
						attributes,
						startTime: accumulation.startTime,
						endTime,
						value: {
							min: pointValue.hasMinMax ? pointValue.min : void 0,
							max: pointValue.hasMinMax ? pointValue.max : void 0,
							sum: !allowsNegativeValues ? pointValue.sum : void 0,
							positive: {
								offset: pointValue.positive.offset,
								bucketCounts: pointValue.positive.bucketCounts
							},
							negative: {
								offset: pointValue.negative.offset,
								bucketCounts: pointValue.negative.bucketCounts
							},
							count: pointValue.count,
							scale: pointValue.scale,
							zeroCount: pointValue.zeroCount
						}
					};
				})
			};
		}
	};
	exports.ExponentialHistogramAggregator = ExponentialHistogramAggregator;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/aggregator/LastValue.js
var require_LastValue = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.LastValueAggregator = exports.LastValueAccumulation = void 0;
	const types_1 = require_types$2();
	const core_1 = require_src$13();
	const MetricData_1 = require_MetricData();
	var LastValueAccumulation = class {
		startTime;
		_current;
		sampleTime;
		constructor(startTime, current = 0, sampleTime = [0, 0]) {
			this.startTime = startTime;
			this._current = current;
			this.sampleTime = sampleTime;
		}
		record(value) {
			this._current = value;
			this.sampleTime = (0, core_1.millisToHrTime)(Date.now());
		}
		setStartTime(startTime) {
			this.startTime = startTime;
		}
		toPointValue() {
			return this._current;
		}
	};
	exports.LastValueAccumulation = LastValueAccumulation;
	/** Basic aggregator which calculates a LastValue from individual measurements. */
	var LastValueAggregator = class {
		kind = types_1.AggregatorKind.LAST_VALUE;
		createAccumulation(startTime) {
			return new LastValueAccumulation(startTime);
		}
		/**
		* Returns the result of the merge of the given accumulations.
		*
		* Return the newly captured (delta) accumulation for LastValueAggregator.
		*/
		merge(previous, delta) {
			const latestAccumulation = (0, core_1.hrTimeToMicroseconds)(delta.sampleTime) >= (0, core_1.hrTimeToMicroseconds)(previous.sampleTime) ? delta : previous;
			return new LastValueAccumulation(previous.startTime, latestAccumulation.toPointValue(), latestAccumulation.sampleTime);
		}
		/**
		* Returns a new DELTA aggregation by comparing two cumulative measurements.
		*
		* A delta aggregation is not meaningful to LastValueAggregator, just return
		* the newly captured (delta) accumulation for LastValueAggregator.
		*/
		diff(previous, current) {
			const latestAccumulation = (0, core_1.hrTimeToMicroseconds)(current.sampleTime) >= (0, core_1.hrTimeToMicroseconds)(previous.sampleTime) ? current : previous;
			return new LastValueAccumulation(current.startTime, latestAccumulation.toPointValue(), latestAccumulation.sampleTime);
		}
		toMetricData(descriptor, aggregationTemporality, accumulationByAttributes, endTime) {
			return {
				descriptor,
				aggregationTemporality,
				dataPointType: MetricData_1.DataPointType.GAUGE,
				dataPoints: accumulationByAttributes.map(([attributes, accumulation]) => {
					return {
						attributes,
						startTime: accumulation.startTime,
						endTime,
						value: accumulation.toPointValue()
					};
				})
			};
		}
	};
	exports.LastValueAggregator = LastValueAggregator;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/aggregator/Sum.js
var require_Sum = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SumAggregator = exports.SumAccumulation = void 0;
	const types_1 = require_types$2();
	const MetricData_1 = require_MetricData();
	var SumAccumulation = class {
		startTime;
		monotonic;
		_current;
		reset;
		constructor(startTime, monotonic, current = 0, reset = false) {
			this.startTime = startTime;
			this.monotonic = monotonic;
			this._current = current;
			this.reset = reset;
		}
		record(value) {
			if (this.monotonic && value < 0) return;
			this._current += value;
		}
		setStartTime(startTime) {
			this.startTime = startTime;
		}
		toPointValue() {
			return this._current;
		}
	};
	exports.SumAccumulation = SumAccumulation;
	/** Basic aggregator which calculates a Sum from individual measurements. */
	var SumAggregator = class {
		kind = types_1.AggregatorKind.SUM;
		monotonic;
		constructor(monotonic) {
			this.monotonic = monotonic;
		}
		createAccumulation(startTime) {
			return new SumAccumulation(startTime, this.monotonic);
		}
		/**
		* Returns the result of the merge of the given accumulations.
		*/
		merge(previous, delta) {
			const prevPv = previous.toPointValue();
			const deltaPv = delta.toPointValue();
			if (delta.reset) return new SumAccumulation(delta.startTime, this.monotonic, deltaPv, delta.reset);
			return new SumAccumulation(previous.startTime, this.monotonic, prevPv + deltaPv);
		}
		/**
		* Returns a new DELTA aggregation by comparing two cumulative measurements.
		*/
		diff(previous, current) {
			const prevPv = previous.toPointValue();
			const currPv = current.toPointValue();
			/**
			* If the SumAggregator is a monotonic one and the previous point value is
			* greater than the current one, a reset is deemed to be happened.
			* Return the current point value to prevent the value from been reset.
			*/
			if (this.monotonic && prevPv > currPv) return new SumAccumulation(current.startTime, this.monotonic, currPv, true);
			return new SumAccumulation(current.startTime, this.monotonic, currPv - prevPv);
		}
		toMetricData(descriptor, aggregationTemporality, accumulationByAttributes, endTime) {
			return {
				descriptor,
				aggregationTemporality,
				dataPointType: MetricData_1.DataPointType.SUM,
				dataPoints: accumulationByAttributes.map(([attributes, accumulation]) => {
					return {
						attributes,
						startTime: accumulation.startTime,
						endTime,
						value: accumulation.toPointValue()
					};
				}),
				isMonotonic: this.monotonic
			};
		}
	};
	exports.SumAggregator = SumAggregator;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/aggregator/index.js
var require_aggregator = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SumAggregator = exports.SumAccumulation = exports.LastValueAggregator = exports.LastValueAccumulation = exports.ExponentialHistogramAggregator = exports.ExponentialHistogramAccumulation = exports.HistogramAggregator = exports.HistogramAccumulation = exports.DropAggregator = void 0;
	var Drop_1 = require_Drop();
	Object.defineProperty(exports, "DropAggregator", {
		enumerable: true,
		get: function() {
			return Drop_1.DropAggregator;
		}
	});
	var Histogram_1 = require_Histogram();
	Object.defineProperty(exports, "HistogramAccumulation", {
		enumerable: true,
		get: function() {
			return Histogram_1.HistogramAccumulation;
		}
	});
	Object.defineProperty(exports, "HistogramAggregator", {
		enumerable: true,
		get: function() {
			return Histogram_1.HistogramAggregator;
		}
	});
	var ExponentialHistogram_1 = require_ExponentialHistogram();
	Object.defineProperty(exports, "ExponentialHistogramAccumulation", {
		enumerable: true,
		get: function() {
			return ExponentialHistogram_1.ExponentialHistogramAccumulation;
		}
	});
	Object.defineProperty(exports, "ExponentialHistogramAggregator", {
		enumerable: true,
		get: function() {
			return ExponentialHistogram_1.ExponentialHistogramAggregator;
		}
	});
	var LastValue_1 = require_LastValue();
	Object.defineProperty(exports, "LastValueAccumulation", {
		enumerable: true,
		get: function() {
			return LastValue_1.LastValueAccumulation;
		}
	});
	Object.defineProperty(exports, "LastValueAggregator", {
		enumerable: true,
		get: function() {
			return LastValue_1.LastValueAggregator;
		}
	});
	var Sum_1 = require_Sum();
	Object.defineProperty(exports, "SumAccumulation", {
		enumerable: true,
		get: function() {
			return Sum_1.SumAccumulation;
		}
	});
	Object.defineProperty(exports, "SumAggregator", {
		enumerable: true,
		get: function() {
			return Sum_1.SumAggregator;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/view/Aggregation.js
var require_Aggregation = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DEFAULT_AGGREGATION = exports.EXPONENTIAL_HISTOGRAM_AGGREGATION = exports.HISTOGRAM_AGGREGATION = exports.LAST_VALUE_AGGREGATION = exports.SUM_AGGREGATION = exports.DROP_AGGREGATION = exports.DefaultAggregation = exports.ExponentialHistogramAggregation = exports.ExplicitBucketHistogramAggregation = exports.HistogramAggregation = exports.LastValueAggregation = exports.SumAggregation = exports.DropAggregation = void 0;
	const api = (init_esm$2(), __toCommonJS(esm_exports$2));
	const aggregator_1 = require_aggregator();
	const MetricData_1 = require_MetricData();
	/**
	* The default drop aggregation.
	*/
	var DropAggregation = class DropAggregation {
		static DEFAULT_INSTANCE = new aggregator_1.DropAggregator();
		createAggregator(_instrument) {
			return DropAggregation.DEFAULT_INSTANCE;
		}
	};
	exports.DropAggregation = DropAggregation;
	/**
	* The default sum aggregation.
	*/
	var SumAggregation = class SumAggregation {
		static MONOTONIC_INSTANCE = new aggregator_1.SumAggregator(true);
		static NON_MONOTONIC_INSTANCE = new aggregator_1.SumAggregator(false);
		createAggregator(instrument) {
			switch (instrument.type) {
				case MetricData_1.InstrumentType.COUNTER:
				case MetricData_1.InstrumentType.OBSERVABLE_COUNTER:
				case MetricData_1.InstrumentType.HISTOGRAM: return SumAggregation.MONOTONIC_INSTANCE;
				default: return SumAggregation.NON_MONOTONIC_INSTANCE;
			}
		}
	};
	exports.SumAggregation = SumAggregation;
	/**
	* The default last value aggregation.
	*/
	var LastValueAggregation = class LastValueAggregation {
		static DEFAULT_INSTANCE = new aggregator_1.LastValueAggregator();
		createAggregator(_instrument) {
			return LastValueAggregation.DEFAULT_INSTANCE;
		}
	};
	exports.LastValueAggregation = LastValueAggregation;
	/**
	* The default histogram aggregation.
	
	*/
	var HistogramAggregation = class HistogramAggregation {
		static DEFAULT_INSTANCE = new aggregator_1.HistogramAggregator([
			0,
			5,
			10,
			25,
			50,
			75,
			100,
			250,
			500,
			750,
			1e3,
			2500,
			5e3,
			7500,
			1e4
		], true);
		createAggregator(_instrument) {
			return HistogramAggregation.DEFAULT_INSTANCE;
		}
	};
	exports.HistogramAggregation = HistogramAggregation;
	/**
	* The explicit bucket histogram aggregation.
	*/
	var ExplicitBucketHistogramAggregation = class {
		_boundaries;
		_recordMinMax;
		/**
		* @param boundaries the bucket boundaries of the histogram aggregation
		* @param _recordMinMax If set to true, min and max will be recorded. Otherwise, min and max will not be recorded.
		*/
		constructor(boundaries, recordMinMax = true) {
			if (boundaries == null) throw new Error("ExplicitBucketHistogramAggregation should be created with explicit boundaries, if a single bucket histogram is required, please pass an empty array");
			boundaries = boundaries.concat();
			boundaries = boundaries.sort((a, b) => a - b);
			const minusInfinityIndex = boundaries.lastIndexOf(-Infinity);
			let infinityIndex = boundaries.indexOf(Infinity);
			if (infinityIndex === -1) infinityIndex = void 0;
			this._boundaries = boundaries.slice(minusInfinityIndex + 1, infinityIndex);
			this._recordMinMax = recordMinMax;
		}
		createAggregator(_instrument) {
			return new aggregator_1.HistogramAggregator(this._boundaries, this._recordMinMax);
		}
	};
	exports.ExplicitBucketHistogramAggregation = ExplicitBucketHistogramAggregation;
	var ExponentialHistogramAggregation = class {
		_maxSize;
		_recordMinMax;
		constructor(maxSize = 160, recordMinMax = true) {
			this._maxSize = maxSize;
			this._recordMinMax = recordMinMax;
		}
		createAggregator(_instrument) {
			return new aggregator_1.ExponentialHistogramAggregator(this._maxSize, this._recordMinMax);
		}
	};
	exports.ExponentialHistogramAggregation = ExponentialHistogramAggregation;
	/**
	* The default aggregation.
	*/
	var DefaultAggregation = class {
		_resolve(instrument) {
			switch (instrument.type) {
				case MetricData_1.InstrumentType.COUNTER:
				case MetricData_1.InstrumentType.UP_DOWN_COUNTER:
				case MetricData_1.InstrumentType.OBSERVABLE_COUNTER:
				case MetricData_1.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER: return exports.SUM_AGGREGATION;
				case MetricData_1.InstrumentType.GAUGE:
				case MetricData_1.InstrumentType.OBSERVABLE_GAUGE: return exports.LAST_VALUE_AGGREGATION;
				case MetricData_1.InstrumentType.HISTOGRAM:
					if (instrument.advice.explicitBucketBoundaries) return new ExplicitBucketHistogramAggregation(instrument.advice.explicitBucketBoundaries);
					return exports.HISTOGRAM_AGGREGATION;
			}
			api.diag.warn(`Unable to recognize instrument type: ${instrument.type}`);
			return exports.DROP_AGGREGATION;
		}
		createAggregator(instrument) {
			return this._resolve(instrument).createAggregator(instrument);
		}
	};
	exports.DefaultAggregation = DefaultAggregation;
	exports.DROP_AGGREGATION = new DropAggregation();
	exports.SUM_AGGREGATION = new SumAggregation();
	exports.LAST_VALUE_AGGREGATION = new LastValueAggregation();
	exports.HISTOGRAM_AGGREGATION = new HistogramAggregation();
	exports.EXPONENTIAL_HISTOGRAM_AGGREGATION = new ExponentialHistogramAggregation();
	exports.DEFAULT_AGGREGATION = new DefaultAggregation();
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/view/AggregationOption.js
var require_AggregationOption = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.toAggregation = exports.AggregationType = void 0;
	const Aggregation_1 = require_Aggregation();
	var AggregationType;
	(function(AggregationType) {
		AggregationType[AggregationType["DEFAULT"] = 0] = "DEFAULT";
		AggregationType[AggregationType["DROP"] = 1] = "DROP";
		AggregationType[AggregationType["SUM"] = 2] = "SUM";
		AggregationType[AggregationType["LAST_VALUE"] = 3] = "LAST_VALUE";
		AggregationType[AggregationType["EXPLICIT_BUCKET_HISTOGRAM"] = 4] = "EXPLICIT_BUCKET_HISTOGRAM";
		AggregationType[AggregationType["EXPONENTIAL_HISTOGRAM"] = 5] = "EXPONENTIAL_HISTOGRAM";
	})(AggregationType || (exports.AggregationType = AggregationType = {}));
	function toAggregation(option) {
		switch (option.type) {
			case AggregationType.DEFAULT: return Aggregation_1.DEFAULT_AGGREGATION;
			case AggregationType.DROP: return Aggregation_1.DROP_AGGREGATION;
			case AggregationType.SUM: return Aggregation_1.SUM_AGGREGATION;
			case AggregationType.LAST_VALUE: return Aggregation_1.LAST_VALUE_AGGREGATION;
			case AggregationType.EXPONENTIAL_HISTOGRAM: {
				const expOption = option;
				return new Aggregation_1.ExponentialHistogramAggregation(expOption.options?.maxSize, expOption.options?.recordMinMax);
			}
			case AggregationType.EXPLICIT_BUCKET_HISTOGRAM: {
				const expOption = option;
				if (expOption.options == null) return Aggregation_1.HISTOGRAM_AGGREGATION;
				else return new Aggregation_1.ExplicitBucketHistogramAggregation(expOption.options?.boundaries, expOption.options?.recordMinMax);
			}
			default: throw new Error("Unsupported Aggregation");
		}
	}
	exports.toAggregation = toAggregation;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/export/AggregationSelector.js
var require_AggregationSelector = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR = exports.DEFAULT_AGGREGATION_SELECTOR = void 0;
	const AggregationTemporality_1 = require_AggregationTemporality();
	const AggregationOption_1 = require_AggregationOption();
	const DEFAULT_AGGREGATION_SELECTOR = (_instrumentType) => {
		return { type: AggregationOption_1.AggregationType.DEFAULT };
	};
	exports.DEFAULT_AGGREGATION_SELECTOR = DEFAULT_AGGREGATION_SELECTOR;
	const DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR = (_instrumentType) => AggregationTemporality_1.AggregationTemporality.CUMULATIVE;
	exports.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR = DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/semconv.js
var require_semconv$7 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ATTR_ERROR_TYPE = exports.METRIC_OTEL_SDK_METRIC_READER_COLLECTION_DURATION = exports.OTEL_COMPONENT_TYPE_VALUE_PERIODIC_METRIC_READER = exports.ATTR_OTEL_COMPONENT_TYPE = exports.ATTR_OTEL_COMPONENT_NAME = void 0;
	/**
	* A name uniquely identifying the instance of the OpenTelemetry component within its containing SDK instance.
	*
	* @example otlp_grpc_span_exporter/0
	* @example custom-name
	*
	* @note Implementations **SHOULD** ensure a low cardinality for this attribute, even across application or SDK restarts.
	* E.g. implementations **MUST NOT** use UUIDs as values for this attribute.
	*
	* Implementations **MAY** achieve these goals by following a `<otel.component.type>/<instance-counter>` pattern, e.g. `batching_span_processor/0`.
	* Hereby `otel.component.type` refers to the corresponding attribute value of the component.
	*
	* The value of `instance-counter` **MAY** be automatically assigned by the component and uniqueness within the enclosing SDK instance **MUST** be guaranteed.
	* For example, `<instance-counter>` **MAY** be implemented by using a monotonically increasing counter (starting with `0`), which is incremented every time an
	* instance of the given component type is started.
	*
	* With this implementation, for example the first Batching Span Processor would have `batching_span_processor/0`
	* as `otel.component.name`, the second one `batching_span_processor/1` and so on.
	* These values will therefore be reused in the case of an application restart.
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_OTEL_COMPONENT_NAME = "otel.component.name";
	/**
	* A name identifying the type of the OpenTelemetry component.
	*
	* @example batching_span_processor
	* @example com.example.MySpanExporter
	*
	* @note If none of the standardized values apply, implementations **SHOULD** use the language-defined name of the type.
	* E.g. for Java the fully qualified classname **SHOULD** be used in this case.
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_OTEL_COMPONENT_TYPE = "otel.component.type";
	/**
	* Enum value "periodic_metric_reader" for attribute {@link ATTR_OTEL_COMPONENT_TYPE}.
	*
	* The builtin SDK periodically exporting metric reader
	*
	* @experimental This enum value is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.OTEL_COMPONENT_TYPE_VALUE_PERIODIC_METRIC_READER = "periodic_metric_reader";
	/**
	* The duration of the collect operation of the metric reader.
	*
	* @note For successful collections, `error.type` **MUST NOT** be set. For failed collections, `error.type` **SHOULD** contain the failure cause.
	* It can happen that metrics collection is successful for some MetricProducers, while others fail. In that case `error.type` **SHOULD** be set to any of the failure causes.
	*
	* @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.METRIC_OTEL_SDK_METRIC_READER_COLLECTION_DURATION = "otel.sdk.metric_reader.collection.duration";
	/**
	* Describes a class of error the operation ended with.
	*
	* @example timeout
	* @example java.net.UnknownHostException
	* @example server_certificate_invalid
	* @example 500
	*
	* @note The `error.type` **SHOULD** be predictable, and **SHOULD** have low cardinality.
	*
	* When `error.type` is set to a type (e.g., an exception type), its
	* canonical class name identifying the type within the artifact **SHOULD** be used.
	*
	* Instrumentations **SHOULD** document the list of errors they report.
	*
	* The cardinality of `error.type` within one instrumentation library **SHOULD** be low.
	* Telemetry consumers that aggregate data from multiple instrumentation libraries and applications
	* should be prepared for `error.type` to have high cardinality at query time when no
	* additional filters are applied.
	*
	* If the operation has completed successfully, instrumentations **SHOULD NOT** set `error.type`.
	*
	* If a specific domain defines its own set of error identifiers (such as HTTP or RPC status codes),
	* it's **RECOMMENDED** to:
	*
	*   - Use a domain-specific attribute
	*   - Set `error.type` to capture all errors, regardless of whether they are defined within the domain-specific set or not.
	*/
	exports.ATTR_ERROR_TYPE = "error.type";
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/export/MetricReaderMetrics.js
var require_MetricReaderMetrics = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MetricReaderMetrics = void 0;
	const semconv_1 = require_semconv$7();
	const componentCounter = /* @__PURE__ */ new Map();
	/**
	* Generates `otel.sdk.metric_reader.*` self-observability metrics.
	* https://opentelemetry.io/docs/specs/semconv/otel/sdk-metrics/#metric-otelsdkmetric_readercollectionduration
	*/
	var MetricReaderMetrics = class {
		collectionDuration;
		standardAttrs;
		constructor(componentType, meter) {
			const counter = componentCounter.get(componentType) ?? 0;
			componentCounter.set(componentType, counter + 1);
			this.standardAttrs = {
				[semconv_1.ATTR_OTEL_COMPONENT_TYPE]: componentType,
				[semconv_1.ATTR_OTEL_COMPONENT_NAME]: `${componentType}/${counter}`
			};
			this.collectionDuration = meter.createHistogram(semconv_1.METRIC_OTEL_SDK_METRIC_READER_COLLECTION_DURATION, {
				unit: "s",
				description: "The duration of the collect operation of the metric reader.",
				advice: { explicitBucketBoundaries: [] }
			});
		}
		recordCollection(durationSecs, error) {
			const attrs = error ? {
				...this.standardAttrs,
				[semconv_1.ATTR_ERROR_TYPE]: error
			} : this.standardAttrs;
			this.collectionDuration.record(durationSecs, attrs);
		}
	};
	exports.MetricReaderMetrics = MetricReaderMetrics;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/version.js
var require_version$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.VERSION = void 0;
	exports.VERSION = "2.10.0";
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/export/MetricReader.js
var require_MetricReader = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MetricReader = void 0;
	const api = (init_esm$2(), __toCommonJS(esm_exports$2));
	const utils_1 = require_utils$5();
	const AggregationSelector_1 = require_AggregationSelector();
	const MetricReaderMetrics_1 = require_MetricReaderMetrics();
	const version_1 = require_version$2();
	const core_1 = require_src$13();
	/**
	* A registered reader of metrics that, when linked to a {@link MetricProducer}, offers global
	* control over metrics.
	*/
	var MetricReader = class {
		_shutdown = false;
		_metricProducers;
		_sdkMetricProducer;
		_selfObsMetrics;
		_aggregationTemporalitySelector;
		_aggregationSelector;
		_cardinalitySelector;
		_otelComponentType;
		constructor(options) {
			this._aggregationSelector = options?.aggregationSelector ?? AggregationSelector_1.DEFAULT_AGGREGATION_SELECTOR;
			this._aggregationTemporalitySelector = options?.aggregationTemporalitySelector ?? AggregationSelector_1.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR;
			this._metricProducers = options?.metricProducers ?? [];
			this._cardinalitySelector = options?.cardinalitySelector;
			this._otelComponentType = options?.otelComponentType ?? this.constructor.name;
			this._selfObsMetrics = new MetricReaderMetrics_1.MetricReaderMetrics(this._otelComponentType, api.createNoopMeter());
		}
		setMetricProducer(metricProducer) {
			if (this._sdkMetricProducer) throw new Error("MetricReader can not be bound to a MeterProvider again.");
			this._sdkMetricProducer = metricProducer;
			this.onInitialized();
		}
		_setSelfObsMeterProvider(meterProvider) {
			const meter = meterProvider.getMeter("@opentelemetry/sdk-metrics", version_1.VERSION);
			this._selfObsMetrics = new MetricReaderMetrics_1.MetricReaderMetrics(this._otelComponentType, meter);
		}
		selectAggregation(instrumentType) {
			return this._aggregationSelector(instrumentType);
		}
		selectAggregationTemporality(instrumentType) {
			return this._aggregationTemporalitySelector(instrumentType);
		}
		selectCardinalityLimit(instrumentType) {
			return this._cardinalitySelector ? this._cardinalitySelector(instrumentType) : 2e3;
		}
		/**
		* Handle once the SDK has initialized this {@link MetricReader}
		* Overriding this method is optional.
		*/
		onInitialized() {}
		async collect(options) {
			if (this._sdkMetricProducer === void 0) throw new Error("MetricReader is not bound to a MetricProducer");
			if (this._shutdown) throw new Error("MetricReader is shutdown");
			const startTime = (0, core_1.hrTime)();
			const [sdkCollectionResults, ...additionalCollectionResults] = await Promise.all([this._sdkMetricProducer.collect({ timeoutMillis: options?.timeoutMillis }), ...this._metricProducers.map((producer) => producer.collect({ timeoutMillis: options?.timeoutMillis }))]);
			const endTime = (0, core_1.hrTime)();
			const errors = sdkCollectionResults.errors.concat(additionalCollectionResults.flatMap((result) => result.errors));
			const collectDuration = (0, core_1.hrTimeToSeconds)((0, core_1.hrTimeDuration)(startTime, endTime));
			this._selfObsMetrics.recordCollection(collectDuration, errors.length > 0 ? errors[0].name ?? "collect_error" : void 0);
			return {
				resourceMetrics: {
					resource: sdkCollectionResults.resourceMetrics.resource,
					scopeMetrics: sdkCollectionResults.resourceMetrics.scopeMetrics.concat(additionalCollectionResults.flatMap((result) => result.resourceMetrics.scopeMetrics))
				},
				errors
			};
		}
		async shutdown(options) {
			if (this._shutdown) {
				api.diag.error("Cannot call shutdown twice.");
				return;
			}
			if (options?.timeoutMillis == null) await this.onShutdown();
			else await (0, utils_1.callWithTimeout)(this.onShutdown(), options.timeoutMillis);
			this._shutdown = true;
		}
		async forceFlush(options) {
			if (this._shutdown) {
				api.diag.warn("Cannot forceFlush on already shutdown MetricReader.");
				return;
			}
			if (options?.timeoutMillis == null) {
				await this.onForceFlush();
				return;
			}
			await (0, utils_1.callWithTimeout)(this.onForceFlush(), options.timeoutMillis);
		}
	};
	exports.MetricReader = MetricReader;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/export/MetricDataSplitter.js
var require_MetricDataSplitter = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.splitMetricData = void 0;
	/**
	* Splits a ResourceMetrics object into smaller ResourceMetrics objects
	* such that no batch exceeds maxExportBatchSize data points.
	* @param resourceMetrics The metrics to split.
	* @param maxExportBatchSize The maximum number of data points per batch.
	* @internal
	*/
	function splitMetricData(resourceMetrics, maxExportBatchSize) {
		if (!Number.isInteger(maxExportBatchSize) || maxExportBatchSize <= 0) throw new Error("maxExportBatchSize must be a positive integer");
		const batches = [];
		let currentBatchPoints = 0;
		let currentScopeMetrics = [];
		function flush() {
			if (currentScopeMetrics.length > 0) {
				batches.push({
					resource: resourceMetrics.resource,
					scopeMetrics: currentScopeMetrics
				});
				currentScopeMetrics = [];
				currentBatchPoints = 0;
			}
		}
		for (const scopeMetric of resourceMetrics.scopeMetrics) {
			let scopeMetricCopy = null;
			for (const metric of scopeMetric.metrics) {
				const dataPoints = metric.dataPoints;
				if (dataPoints.length === 0) {
					if (!scopeMetricCopy) {
						scopeMetricCopy = {
							scope: scopeMetric.scope,
							metrics: []
						};
						currentScopeMetrics.push(scopeMetricCopy);
					}
					scopeMetricCopy.metrics.push(metric);
					continue;
				}
				let offset = 0;
				while (offset < dataPoints.length) {
					const spaceLeft = maxExportBatchSize - currentBatchPoints;
					const take = Math.min(spaceLeft, dataPoints.length - offset);
					if (!scopeMetricCopy) {
						scopeMetricCopy = {
							scope: scopeMetric.scope,
							metrics: []
						};
						currentScopeMetrics.push(scopeMetricCopy);
					}
					const metricCopy = {
						...metric,
						dataPoints: dataPoints.slice(offset, offset + take)
					};
					scopeMetricCopy.metrics.push(metricCopy);
					offset += take;
					currentBatchPoints += take;
					if (currentBatchPoints === maxExportBatchSize) {
						flush();
						scopeMetricCopy = null;
					}
				}
			}
		}
		flush();
		return batches;
	}
	exports.splitMetricData = splitMetricData;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/export/PeriodicExportingMetricReader.js
var require_PeriodicExportingMetricReader = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.PeriodicExportingMetricReader = void 0;
	const api = (init_esm$2(), __toCommonJS(esm_exports$2));
	const core_1 = require_src$13();
	const MetricReader_1 = require_MetricReader();
	const utils_1 = require_utils$5();
	const MetricData_1 = require_MetricData();
	const MetricDataSplitter_1 = require_MetricDataSplitter();
	const semconv_1 = require_semconv$7();
	/**
	* {@link MetricReader} which collects metrics based on a user-configurable time interval, and passes the metrics to
	* the configured {@link PushMetricExporter}
	*/
	var PeriodicExportingMetricReader = class extends MetricReader_1.MetricReader {
		_interval;
		_exporter;
		_exportInterval;
		_exportTimeout;
		_maxExportBatchSize;
		_ongoingExportPromise = null;
		constructor(options) {
			const { exporter, exportIntervalMillis = 6e4, metricProducers, cardinalityLimits, maxExportBatchSize } = options;
			let { exportTimeoutMillis = 3e4 } = options;
			super({
				aggregationSelector: exporter.selectAggregation?.bind(exporter),
				aggregationTemporalitySelector: exporter.selectAggregationTemporality?.bind(exporter),
				otelComponentType: semconv_1.OTEL_COMPONENT_TYPE_VALUE_PERIODIC_METRIC_READER,
				metricProducers,
				cardinalitySelector: (instrumentType) => {
					const limits = {
						default: 2e3,
						...cardinalityLimits
					};
					switch (instrumentType) {
						case MetricData_1.InstrumentType.COUNTER: return limits.counter ?? limits.default;
						case MetricData_1.InstrumentType.GAUGE: return limits.gauge ?? limits.default;
						case MetricData_1.InstrumentType.HISTOGRAM: return limits.histogram ?? limits.default;
						case MetricData_1.InstrumentType.OBSERVABLE_COUNTER: return limits.observableCounter ?? limits.default;
						case MetricData_1.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER: return limits.observableUpDownCounter ?? limits.default;
						case MetricData_1.InstrumentType.OBSERVABLE_GAUGE: return limits.observableGauge ?? limits.default;
						case MetricData_1.InstrumentType.UP_DOWN_COUNTER: return limits.upDownCounter ?? limits.default;
						default: return limits.default;
					}
				}
			});
			if (exportIntervalMillis <= 0) throw Error("exportIntervalMillis must be greater than 0");
			if (exportTimeoutMillis <= 0) throw Error("exportTimeoutMillis must be greater than 0");
			if (maxExportBatchSize !== void 0 && (!Number.isInteger(maxExportBatchSize) || maxExportBatchSize <= 0)) throw Error("maxExportBatchSize must be a positive integer");
			if (exportIntervalMillis < exportTimeoutMillis) if ("exportIntervalMillis" in options && "exportTimeoutMillis" in options) throw Error("exportIntervalMillis must be greater than or equal to exportTimeoutMillis");
			else {
				api.diag.info(`Timeout of ${exportTimeoutMillis} exceeds the interval of ${exportIntervalMillis}. Clamping timeout to interval duration.`);
				exportTimeoutMillis = exportIntervalMillis;
			}
			this._exportInterval = exportIntervalMillis;
			this._exportTimeout = exportTimeoutMillis;
			this._exporter = exporter;
			this._maxExportBatchSize = maxExportBatchSize;
		}
		async _runOnce() {
			try {
				await this._doRun();
			} catch (err) {
				(0, core_1.globalErrorHandler)(err);
			}
		}
		async _doRun() {
			if (this._ongoingExportPromise) {
				api.diag.debug("PeriodicExportingMetricReader: export already in progress, skipping");
				return;
			}
			const currentRun = async () => {
				const { resourceMetrics, errors } = await this.collect({ timeoutMillis: this._exportTimeout });
				if (errors.length > 0) api.diag.error("PeriodicExportingMetricReader: metrics collection errors", ...errors);
				if (resourceMetrics.resource.asyncAttributesPending) try {
					await resourceMetrics.resource.waitForAsyncAttributes?.();
				} catch (e) {
					api.diag.debug("Error while resolving async portion of resource: ", e);
					(0, core_1.globalErrorHandler)(e);
				}
				if (resourceMetrics.scopeMetrics.length === 0) return;
				const batches = this._maxExportBatchSize ? (0, MetricDataSplitter_1.splitMetricData)(resourceMetrics, this._maxExportBatchSize) : [resourceMetrics];
				let anyErr = null;
				for (const batch of batches) try {
					const result = await (0, utils_1.callWithTimeout)(core_1.internal._export(this._exporter, batch), this._exportTimeout);
					if (result.code !== core_1.ExportResultCode.SUCCESS) anyErr = /* @__PURE__ */ new Error(`PeriodicExportingMetricReader: metrics export failed (error ${result.error})`);
				} catch (e) {
					if (e instanceof utils_1.TimeoutError) {
						api.diag.error(`PeriodicExportingMetricReader: metrics export timed out after ${this._exportTimeout}ms`);
						break;
					} else {
						api.diag.error("PeriodicExportingMetricReader: metrics export threw error", e);
						anyErr = e instanceof Error ? e : new Error(String(e));
					}
				}
				if (anyErr) throw anyErr;
			};
			this._ongoingExportPromise = currentRun();
			try {
				await this._ongoingExportPromise;
			} finally {
				this._ongoingExportPromise = null;
			}
		}
		onInitialized() {
			this._interval = setInterval(() => {
				this._runOnce();
			}, this._exportInterval);
			if (typeof this._interval !== "number") this._interval.unref();
		}
		async onForceFlush() {
			await this._awaitOngoingExport();
			if (this._ongoingExportPromise) await this._awaitOngoingExport();
			else await this._runOnce();
			await this._exporter.forceFlush();
		}
		/**
		* Helper function to wait for an ongoing export to complete.
		* Errors are swallowed and handled by the original _runOnce().
		*/
		async _awaitOngoingExport() {
			if (this._ongoingExportPromise) {
				api.diag.debug("PeriodicExportingMetricReader: export already in progress, awaiting ongoing export");
				try {
					await this._ongoingExportPromise;
				} catch {}
			}
		}
		async onShutdown() {
			if (this._interval) clearInterval(this._interval);
			await this.onForceFlush();
			await this._exporter.shutdown();
		}
	};
	exports.PeriodicExportingMetricReader = PeriodicExportingMetricReader;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/export/InMemoryMetricExporter.js
var require_InMemoryMetricExporter = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.InMemoryMetricExporter = void 0;
	const core_1 = require_src$13();
	/**
	* In-memory Metrics Exporter is a Push Metric Exporter
	* which accumulates metrics data in the local memory and
	* allows to inspect it (useful for e.g. unit tests).
	*/
	var InMemoryMetricExporter = class {
		_shutdown = false;
		_aggregationTemporality;
		_metrics = [];
		constructor(aggregationTemporality) {
			this._aggregationTemporality = aggregationTemporality;
		}
		/**
		* @inheritedDoc
		*/
		export(metrics, resultCallback) {
			if (this._shutdown) {
				setTimeout(() => resultCallback({ code: core_1.ExportResultCode.FAILED }), 0);
				return;
			}
			this._metrics.push(metrics);
			setTimeout(() => resultCallback({ code: core_1.ExportResultCode.SUCCESS }), 0);
		}
		/**
		* Returns all the collected resource metrics
		* @returns ResourceMetrics[]
		*/
		getMetrics() {
			return this._metrics;
		}
		forceFlush() {
			return Promise.resolve();
		}
		reset() {
			this._metrics = [];
		}
		selectAggregationTemporality(_instrumentType) {
			return this._aggregationTemporality;
		}
		shutdown() {
			this._shutdown = true;
			return Promise.resolve();
		}
	};
	exports.InMemoryMetricExporter = InMemoryMetricExporter;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/export/ConsoleMetricExporter.js
var require_ConsoleMetricExporter = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ConsoleMetricExporter = void 0;
	const core_1 = require_src$13();
	const AggregationSelector_1 = require_AggregationSelector();
	exports.ConsoleMetricExporter = class ConsoleMetricExporter {
		_shutdown = false;
		_temporalitySelector;
		constructor(options) {
			this._temporalitySelector = options?.temporalitySelector ?? AggregationSelector_1.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR;
		}
		export(metrics, resultCallback) {
			if (this._shutdown) {
				resultCallback({ code: core_1.ExportResultCode.FAILED });
				return;
			}
			return ConsoleMetricExporter._sendMetrics(metrics, resultCallback);
		}
		forceFlush() {
			return Promise.resolve();
		}
		selectAggregationTemporality(_instrumentType) {
			return this._temporalitySelector(_instrumentType);
		}
		shutdown() {
			this._shutdown = true;
			return Promise.resolve();
		}
		static _sendMetrics(metrics, done) {
			for (const scopeMetrics of metrics.scopeMetrics) for (const metric of scopeMetrics.metrics) console.dir({
				descriptor: metric.descriptor,
				dataPointType: metric.dataPointType,
				dataPoints: metric.dataPoints
			}, { depth: null });
			done({ code: core_1.ExportResultCode.SUCCESS });
		}
	};
}));
//#endregion
//#region node_modules/@opentelemetry/resources/build/src/default-service-name.js
var require_default_service_name = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports._clearDefaultServiceNameCache = exports.defaultServiceName = void 0;
	let serviceName;
	/**
	* Returns the default service name for OpenTelemetry resources.
	* In Node.js environments, returns "unknown_service:<process.argv0>".
	* In browser/edge environments, returns "unknown_service".
	*/
	function defaultServiceName() {
		if (serviceName === void 0) try {
			const argv0 = globalThis.process.argv0;
			serviceName = argv0 ? `unknown_service:${argv0}` : "unknown_service";
		} catch {
			serviceName = "unknown_service";
		}
		return serviceName;
	}
	exports.defaultServiceName = defaultServiceName;
	/** @internal For testing purposes only */
	function _clearDefaultServiceNameCache() {
		serviceName = void 0;
	}
	exports._clearDefaultServiceNameCache = _clearDefaultServiceNameCache;
}));
//#endregion
//#region node_modules/@opentelemetry/resources/build/src/utils.js
var require_utils$4 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isPromiseLike = void 0;
	const isPromiseLike = (val) => {
		return val !== null && typeof val === "object" && typeof val.then === "function";
	};
	exports.isPromiseLike = isPromiseLike;
}));
//#endregion
//#region node_modules/@opentelemetry/resources/build/src/ResourceImpl.js
var require_ResourceImpl = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.defaultResource = exports.emptyResource = exports.resourceFromDetectedResource = exports.resourceFromAttributes = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const core_1 = require_src$13();
	const semantic_conventions_1 = (init_esm$1(), __toCommonJS(esm_exports$1));
	const default_service_name_1 = require_default_service_name();
	const utils_1 = require_utils$4();
	var ResourceImpl = class ResourceImpl {
		_rawAttributes;
		_asyncAttributesPending = false;
		_schemaUrl;
		_memoizedAttributes;
		static FromAttributeList(attributes, options) {
			const res = new ResourceImpl({}, options);
			res._rawAttributes = guardedRawAttributes(attributes);
			res._asyncAttributesPending = attributes.filter(([_, val]) => (0, utils_1.isPromiseLike)(val)).length > 0;
			return res;
		}
		constructor(resource, options) {
			const attributes = resource.attributes ?? {};
			this._rawAttributes = Object.entries(attributes).map(([k, v]) => {
				if ((0, utils_1.isPromiseLike)(v)) this._asyncAttributesPending = true;
				return [k, v];
			});
			this._rawAttributes = guardedRawAttributes(this._rawAttributes);
			this._schemaUrl = validateSchemaUrl(options?.schemaUrl);
		}
		get asyncAttributesPending() {
			return this._asyncAttributesPending;
		}
		async waitForAsyncAttributes() {
			if (!this.asyncAttributesPending) return;
			for (let i = 0; i < this._rawAttributes.length; i++) {
				const [k, v] = this._rawAttributes[i];
				this._rawAttributes[i] = [k, (0, utils_1.isPromiseLike)(v) ? await v : v];
			}
			this._asyncAttributesPending = false;
		}
		get attributes() {
			if (this.asyncAttributesPending) api_1.diag.error("Accessing resource attributes before async attributes settled");
			if (this._memoizedAttributes) return this._memoizedAttributes;
			const attrs = {};
			for (const [k, v] of this._rawAttributes) {
				if ((0, utils_1.isPromiseLike)(v)) {
					api_1.diag.debug(`Unsettled resource attribute ${k} skipped`);
					continue;
				}
				if (v != null) attrs[k] ??= v;
			}
			if (!this._asyncAttributesPending) this._memoizedAttributes = attrs;
			return attrs;
		}
		getRawAttributes() {
			return this._rawAttributes;
		}
		get schemaUrl() {
			return this._schemaUrl;
		}
		merge(resource) {
			if (resource == null) return this;
			const mergedSchemaUrl = mergeSchemaUrl(this, resource);
			const mergedOptions = mergedSchemaUrl ? { schemaUrl: mergedSchemaUrl } : void 0;
			return ResourceImpl.FromAttributeList([...resource.getRawAttributes(), ...this.getRawAttributes()], mergedOptions);
		}
	};
	function resourceFromAttributes(attributes, options) {
		return ResourceImpl.FromAttributeList(Object.entries(attributes), options);
	}
	exports.resourceFromAttributes = resourceFromAttributes;
	function resourceFromDetectedResource(detectedResource, options) {
		return new ResourceImpl(detectedResource, options);
	}
	exports.resourceFromDetectedResource = resourceFromDetectedResource;
	function emptyResource() {
		return resourceFromAttributes({});
	}
	exports.emptyResource = emptyResource;
	function defaultResource() {
		return resourceFromAttributes({
			[semantic_conventions_1.ATTR_SERVICE_NAME]: (0, default_service_name_1.defaultServiceName)(),
			[semantic_conventions_1.ATTR_TELEMETRY_SDK_LANGUAGE]: core_1.SDK_INFO[semantic_conventions_1.ATTR_TELEMETRY_SDK_LANGUAGE],
			[semantic_conventions_1.ATTR_TELEMETRY_SDK_NAME]: core_1.SDK_INFO[semantic_conventions_1.ATTR_TELEMETRY_SDK_NAME],
			[semantic_conventions_1.ATTR_TELEMETRY_SDK_VERSION]: core_1.SDK_INFO[semantic_conventions_1.ATTR_TELEMETRY_SDK_VERSION]
		});
	}
	exports.defaultResource = defaultResource;
	function guardedRawAttributes(attributes) {
		return attributes.map(([k, v]) => {
			if ((0, utils_1.isPromiseLike)(v)) return [k, v.catch((err) => {
				api_1.diag.debug("promise rejection for resource attribute: %s - %s", k, err);
			})];
			return [k, v];
		});
	}
	function validateSchemaUrl(schemaUrl) {
		if (typeof schemaUrl === "string" || schemaUrl === void 0) return schemaUrl;
		api_1.diag.warn("Schema URL must be string or undefined, got %s. Schema URL will be ignored.", schemaUrl);
	}
	function mergeSchemaUrl(old, updating) {
		const oldSchemaUrl = old?.schemaUrl;
		const updatingSchemaUrl = updating?.schemaUrl;
		const isOldEmpty = oldSchemaUrl === void 0 || oldSchemaUrl === "";
		const isUpdatingEmpty = updatingSchemaUrl === void 0 || updatingSchemaUrl === "";
		if (isOldEmpty) return updatingSchemaUrl;
		if (isUpdatingEmpty) return oldSchemaUrl;
		if (oldSchemaUrl === updatingSchemaUrl) return oldSchemaUrl;
		api_1.diag.warn("Schema URL merge conflict: old resource has \"%s\", updating resource has \"%s\". Resulting resource will have undefined Schema URL.", oldSchemaUrl, updatingSchemaUrl);
	}
}));
//#endregion
//#region node_modules/@opentelemetry/resources/build/src/detect-resources.js
var require_detect_resources = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.detectResources = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const ResourceImpl_1 = require_ResourceImpl();
	/**
	* Runs all resource detectors and returns the results merged into a single Resource.
	*
	* @param config Configuration for resource detection
	*/
	const detectResources = (config = {}) => {
		return (config.detectors || []).map((d) => {
			try {
				const resource = (0, ResourceImpl_1.resourceFromDetectedResource)(d.detect(config));
				api_1.diag.debug(`${d.constructor.name} found resource.`, resource);
				return resource;
			} catch (e) {
				api_1.diag.debug(`${d.constructor.name} failed: ${e.message}`);
				return (0, ResourceImpl_1.emptyResource)();
			}
		}).reduce((acc, resource) => acc.merge(resource), (0, ResourceImpl_1.emptyResource)());
	};
	exports.detectResources = detectResources;
}));
//#endregion
//#region node_modules/@opentelemetry/resources/build/src/detectors/EnvDetector.js
var require_EnvDetector = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.envDetector = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const semantic_conventions_1 = (init_esm$1(), __toCommonJS(esm_exports$1));
	const core_1 = require_src$13();
	/**
	* EnvDetector can be used to detect the presence of and create a Resource
	* from the OTEL_RESOURCE_ATTRIBUTES environment variable.
	*/
	var EnvDetector = class {
		_MAX_LENGTH = 255;
		_COMMA_SEPARATOR = ",";
		_LABEL_KEY_VALUE_SPLITTER = "=";
		/**
		* Returns a {@link Resource} populated with attributes from the
		* OTEL_RESOURCE_ATTRIBUTES environment variable. Note this is an async
		* function to conform to the Detector interface.
		*
		* @param config The resource detection config
		*/
		detect(_config) {
			const attributes = {};
			const rawAttributes = (0, core_1.getStringFromEnv)("OTEL_RESOURCE_ATTRIBUTES");
			const serviceName = (0, core_1.getStringFromEnv)("OTEL_SERVICE_NAME");
			if (rawAttributes) try {
				const parsedAttributes = this._parseResourceAttributes(rawAttributes);
				Object.assign(attributes, parsedAttributes);
			} catch (e) {
				api_1.diag.debug(`EnvDetector failed: ${e instanceof Error ? e.message : e}`);
			}
			if (serviceName) attributes[semantic_conventions_1.ATTR_SERVICE_NAME] = serviceName;
			return { attributes };
		}
		/**
		* Creates an attribute map from the OTEL_RESOURCE_ATTRIBUTES environment
		* variable.
		*
		* OTEL_RESOURCE_ATTRIBUTES: A comma-separated list of attributes in the
		* format "key1=value1,key2=value2". The ',' and '=' characters in keys
		* and values MUST be percent-encoded. Other characters MAY be percent-encoded.
		*
		* Per the spec, on any error (e.g., decoding failure), the entire environment
		* variable value is discarded.
		*
		* @param rawEnvAttributes The resource attributes as a comma-separated list
		* of key/value pairs.
		* @returns The parsed resource attributes.
		* @throws Error if parsing fails (caller handles by discarding all attributes)
		*/
		_parseResourceAttributes(rawEnvAttributes) {
			if (!rawEnvAttributes) return {};
			const attributes = {};
			const rawAttributes = rawEnvAttributes.split(this._COMMA_SEPARATOR).filter((attr) => attr.trim() !== "");
			for (const rawAttribute of rawAttributes) {
				const keyValuePair = rawAttribute.split(this._LABEL_KEY_VALUE_SPLITTER);
				if (keyValuePair.length !== 2) throw new Error(`Invalid format for OTEL_RESOURCE_ATTRIBUTES: "${rawAttribute}". Expected format: key=value. The ',' and '=' characters must be percent-encoded in keys and values.`);
				const [rawKey, rawValue] = keyValuePair;
				const key = rawKey.trim();
				const value = rawValue.trim();
				if (key.length === 0) throw new Error(`Invalid OTEL_RESOURCE_ATTRIBUTES: empty attribute key in "${rawAttribute}".`);
				let decodedKey;
				let decodedValue;
				try {
					decodedKey = decodeURIComponent(key);
					decodedValue = decodeURIComponent(value);
				} catch (e) {
					throw new Error(`Failed to percent-decode OTEL_RESOURCE_ATTRIBUTES entry "${rawAttribute}": ${e instanceof Error ? e.message : e}`, { cause: e });
				}
				if (decodedKey.length > this._MAX_LENGTH) throw new Error(`Attribute key exceeds the maximum length of ${this._MAX_LENGTH} characters: "${decodedKey}".`);
				if (decodedValue.length > this._MAX_LENGTH) throw new Error(`Attribute value exceeds the maximum length of ${this._MAX_LENGTH} characters for key "${decodedKey}".`);
				attributes[decodedKey] = decodedValue;
			}
			return attributes;
		}
	};
	exports.envDetector = new EnvDetector();
}));
//#endregion
//#region node_modules/@opentelemetry/resources/build/src/semconv.js
var require_semconv$6 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ATTR_WEBENGINE_VERSION = exports.ATTR_WEBENGINE_NAME = exports.ATTR_WEBENGINE_DESCRIPTION = exports.ATTR_SERVICE_NAMESPACE = exports.ATTR_SERVICE_INSTANCE_ID = exports.ATTR_PROCESS_RUNTIME_VERSION = exports.ATTR_PROCESS_RUNTIME_NAME = exports.ATTR_PROCESS_RUNTIME_DESCRIPTION = exports.ATTR_PROCESS_PID = exports.ATTR_PROCESS_OWNER = exports.ATTR_PROCESS_EXECUTABLE_PATH = exports.ATTR_PROCESS_EXECUTABLE_NAME = exports.ATTR_PROCESS_COMMAND_ARGS = exports.ATTR_PROCESS_COMMAND = exports.ATTR_OS_VERSION = exports.ATTR_OS_TYPE = exports.ATTR_K8S_POD_NAME = exports.ATTR_K8S_NAMESPACE_NAME = exports.ATTR_K8S_DEPLOYMENT_NAME = exports.ATTR_K8S_CLUSTER_NAME = exports.ATTR_HOST_TYPE = exports.ATTR_HOST_NAME = exports.ATTR_HOST_IMAGE_VERSION = exports.ATTR_HOST_IMAGE_NAME = exports.ATTR_HOST_IMAGE_ID = exports.ATTR_HOST_ID = exports.ATTR_HOST_ARCH = exports.ATTR_CONTAINER_NAME = exports.ATTR_CONTAINER_IMAGE_TAGS = exports.ATTR_CONTAINER_IMAGE_NAME = exports.ATTR_CONTAINER_ID = exports.ATTR_CLOUD_REGION = exports.ATTR_CLOUD_PROVIDER = exports.ATTR_CLOUD_AVAILABILITY_ZONE = exports.ATTR_CLOUD_ACCOUNT_ID = void 0;
	/**
	* The cloud account ID the resource is assigned to.
	*
	* @example 111111111111
	* @example opentelemetry
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_CLOUD_ACCOUNT_ID = "cloud.account.id";
	/**
	* Cloud regions often have multiple, isolated locations known as zones to increase availability. Availability zone represents the zone where the resource is running.
	*
	* @example us-east-1c
	*
	* @note Availability zones are called "zones" on Alibaba Cloud and Google Cloud.
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_CLOUD_AVAILABILITY_ZONE = "cloud.availability_zone";
	/**
	* Name of the cloud provider.
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_CLOUD_PROVIDER = "cloud.provider";
	/**
	* The geographical region the resource is running.
	*
	* @example us-central1
	* @example us-east-1
	*
	* @note Refer to your provider's docs to see the available regions, for example [Alibaba Cloud regions](https://www.alibabacloud.com/help/doc-detail/40654.htm), [AWS regions](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/), [Azure regions](https://azure.microsoft.com/global-infrastructure/geographies/), [Google Cloud regions](https://cloud.google.com/about/locations), or [Tencent Cloud regions](https://www.tencentcloud.com/document/product/213/6091).
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_CLOUD_REGION = "cloud.region";
	/**
	* Container ID. Usually a UUID, as for example used to [identify Docker containers](https://docs.docker.com/engine/containers/run/#container-identification). The UUID might be abbreviated.
	*
	* @example a3bf90e006b2
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_CONTAINER_ID = "container.id";
	/**
	* Name of the image the container was built on.
	*
	* @example gcr.io/opentelemetry/operator
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_CONTAINER_IMAGE_NAME = "container.image.name";
	/**
	* Container image tags. An example can be found in [Docker Image Inspect](https://docs.docker.com/engine/api/v1.43/#tag/Image/operation/ImageInspect). Should be only the `<tag>` section of the full name for example from `registry.example.com/my-org/my-image:<tag>`.
	*
	* @example ["v1.27.1", "3.5.7-0"]
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_CONTAINER_IMAGE_TAGS = "container.image.tags";
	/**
	* Container name used by container runtime.
	*
	* @example opentelemetry-autoconf
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_CONTAINER_NAME = "container.name";
	/**
	* The CPU architecture the host system is running on.
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_HOST_ARCH = "host.arch";
	/**
	* Unique host ID. For Cloud, this must be the instance_id assigned by the cloud provider. For non-containerized systems, this should be the `machine-id`. See the table below for the sources to use to determine the `machine-id` based on operating system.
	*
	* @example fdbf79e8af94cb7f9e8df36789187052
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_HOST_ID = "host.id";
	/**
	* VM image ID or host OS image ID. For Cloud, this value is from the provider.
	*
	* @example ami-07b06b442921831e5
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_HOST_IMAGE_ID = "host.image.id";
	/**
	* Name of the VM image or OS install the host was instantiated from.
	*
	* @example infra-ami-eks-worker-node-7d4ec78312
	* @example CentOS-8-x86_64-1905
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_HOST_IMAGE_NAME = "host.image.name";
	/**
	* The version string of the VM image or host OS as defined in [Version Attributes](/docs/resource/README.md#version-attributes).
	*
	* @example 0.1
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_HOST_IMAGE_VERSION = "host.image.version";
	/**
	* Name of the host. On Unix systems, it may contain what the hostname command returns, or the fully qualified hostname, or another name specified by the user.
	*
	* @example opentelemetry-test
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_HOST_NAME = "host.name";
	/**
	* Type of host. For Cloud, this must be the machine type.
	*
	* @example n1-standard-1
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_HOST_TYPE = "host.type";
	/**
	* The name of the cluster.
	*
	* @example opentelemetry-cluster
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_K8S_CLUSTER_NAME = "k8s.cluster.name";
	/**
	* The name of the Deployment.
	*
	* @example opentelemetry
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_K8S_DEPLOYMENT_NAME = "k8s.deployment.name";
	/**
	* The name of the namespace that the pod is running in.
	*
	* @example default
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_K8S_NAMESPACE_NAME = "k8s.namespace.name";
	/**
	* The name of the Pod.
	*
	* @example opentelemetry-pod-autoconf
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_K8S_POD_NAME = "k8s.pod.name";
	/**
	* The operating system type.
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_OS_TYPE = "os.type";
	/**
	* The version string of the operating system as defined in [Version Attributes](/docs/resource/README.md#version-attributes).
	*
	* @example 14.2.1
	* @example 18.04.1
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_OS_VERSION = "os.version";
	/**
	* The command used to launch the process (i.e. the command name). On Linux based systems, can be set to the zeroth string in `proc/[pid]/cmdline`. On Windows, can be set to the first parameter extracted from `GetCommandLineW`.
	*
	* @example cmd/otelcol
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_PROCESS_COMMAND = "process.command";
	/**
	* All the command arguments (including the command/executable itself) as received by the process. On Linux-based systems (and some other Unixoid systems supporting procfs), can be set according to the list of null-delimited strings extracted from `proc/[pid]/cmdline`. For libc-based executables, this would be the full argv vector passed to `main`.
	*
	* @example ["cmd/otecol", "--config=config.yaml"]
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_PROCESS_COMMAND_ARGS = "process.command_args";
	/**
	* The name of the process executable. On Linux based systems, this **SHOULD** be set to the base name of the target of `/proc/[pid]/exe`. On Windows, this **SHOULD** be set to the base name of `GetProcessImageFileNameW`.
	*
	* @example otelcol
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_PROCESS_EXECUTABLE_NAME = "process.executable.name";
	/**
	* The full path to the process executable. On Linux based systems, can be set to the target of `proc/[pid]/exe`. On Windows, can be set to the result of `GetProcessImageFileNameW`.
	*
	* @example /usr/bin/cmd/otelcol
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_PROCESS_EXECUTABLE_PATH = "process.executable.path";
	/**
	* The username of the user that owns the process.
	*
	* @example root
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_PROCESS_OWNER = "process.owner";
	/**
	* Process identifier (PID).
	*
	* @example 1234
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_PROCESS_PID = "process.pid";
	/**
	* An additional description about the runtime of the process, for example a specific vendor customization of the runtime environment.
	*
	* @example "Eclipse OpenJ9 Eclipse OpenJ9 VM openj9-0.21.0"
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_PROCESS_RUNTIME_DESCRIPTION = "process.runtime.description";
	/**
	* The name of the runtime of this process.
	*
	* @example OpenJDK Runtime Environment
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_PROCESS_RUNTIME_NAME = "process.runtime.name";
	/**
	* The version of the runtime of this process, as returned by the runtime without modification.
	*
	* @example "14.0.2"
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_PROCESS_RUNTIME_VERSION = "process.runtime.version";
	/**
	* The string ID of the service instance.
	*
	* @example 627cc493-f310-47de-96bd-71410b7dec09
	*
	* @note **MUST** be unique for each instance of the same `service.namespace,service.name` pair (in other words
	* `service.namespace,service.name,service.instance.id` triplet **MUST** be globally unique). The ID helps to
	* distinguish instances of the same service that exist at the same time (e.g. instances of a horizontally scaled
	* service).
	*
	* Implementations, such as SDKs, are recommended to generate a random Version 1 or Version 4 [RFC
	* 4122](https://www.ietf.org/rfc/rfc4122.txt) UUID, but are free to use an inherent unique ID as the source of
	* this value if stability is desirable. In that case, the ID **SHOULD** be used as source of a UUID Version 5 and
	* **SHOULD** use the following UUID as the namespace: `4d63009a-8d0f-11ee-aad7-4c796ed8e320`.
	*
	* UUIDs are typically recommended, as only an opaque value for the purposes of identifying a service instance is
	* needed. Similar to what can be seen in the man page for the
	* [`/etc/machine-id`](https://www.freedesktop.org/software/systemd/man/latest/machine-id.html) file, the underlying
	* data, such as pod name and namespace should be treated as confidential, being the user's choice to expose it
	* or not via another resource attribute.
	*
	* For applications running behind an application server (like unicorn), we do not recommend using one identifier
	* for all processes participating in the application. Instead, it's recommended each division (e.g. a worker
	* thread in unicorn) to have its own instance.id.
	*
	* It's not recommended for a Collector to set `service.instance.id` if it can't unambiguously determine the
	* service instance that is generating that telemetry. For instance, creating an UUID based on `pod.name` will
	* likely be wrong, as the Collector might not know from which container within that pod the telemetry originated.
	* However, Collectors can set the `service.instance.id` if they can unambiguously determine the service instance
	* for that telemetry. This is typically the case for scraping receivers, as they know the target address and
	* port.
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_SERVICE_INSTANCE_ID = "service.instance.id";
	/**
	* A namespace for `service.name`.
	*
	* @example Shop
	*
	* @note A string value having a meaning that helps to distinguish a group of services, for example the team name that owns a group of services. `service.name` is expected to be unique within the same namespace. If `service.namespace` is not specified in the Resource then `service.name` is expected to be unique for all services that have no explicit namespace defined (so the empty/unspecified namespace is simply one more valid namespace). Zero-length namespace string is assumed equal to unspecified namespace.
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_SERVICE_NAMESPACE = "service.namespace";
	/**
	* Additional description of the web engine (e.g. detailed version and edition information).
	*
	* @example WildFly Full 21.0.0.Final (WildFly Core 13.0.1.Final) - 2.2.2.Final
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_WEBENGINE_DESCRIPTION = "webengine.description";
	/**
	* The name of the web engine.
	*
	* @example WildFly
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_WEBENGINE_NAME = "webengine.name";
	/**
	* The version of the web engine.
	*
	* @example 21.0.0
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_WEBENGINE_VERSION = "webengine.version";
}));
//#endregion
//#region node_modules/@opentelemetry/resources/build/src/detectors/platform/node/machine-id/getMachineId.js
var require_getMachineId = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getMachineId = void 0;
	const process$1 = __require("process");
	let getMachineIdImpl;
	async function getMachineId() {
		if (!getMachineIdImpl) switch (process$1.platform) {
			case "darwin":
				getMachineIdImpl = (await import("./getMachineId-darwin-DMAaaNax.js").then((m) => /* @__PURE__ */ __toESM(m.default))).getMachineId;
				break;
			case "linux":
				getMachineIdImpl = (await import("./getMachineId-linux-BdswWW7B.js").then((m) => /* @__PURE__ */ __toESM(m.default))).getMachineId;
				break;
			case "freebsd":
				getMachineIdImpl = (await import("./getMachineId-bsd-HCZ1q_57.js").then((m) => /* @__PURE__ */ __toESM(m.default))).getMachineId;
				break;
			case "win32":
				getMachineIdImpl = (await import("./getMachineId-win-CeXnDqVe.js").then((m) => /* @__PURE__ */ __toESM(m.default))).getMachineId;
				break;
			default:
				getMachineIdImpl = (await import("./getMachineId-unsupported-GeKbbsNm.js").then((m) => /* @__PURE__ */ __toESM(m.default))).getMachineId;
				break;
		}
		return getMachineIdImpl();
	}
	exports.getMachineId = getMachineId;
}));
//#endregion
//#region node_modules/@opentelemetry/resources/build/src/detectors/platform/node/utils.js
var require_utils$3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.normalizeType = exports.normalizeArch = void 0;
	const normalizeArch = (nodeArchString) => {
		switch (nodeArchString) {
			case "arm": return "arm32";
			case "ppc": return "ppc32";
			case "x64": return "amd64";
			default: return nodeArchString;
		}
	};
	exports.normalizeArch = normalizeArch;
	const normalizeType = (nodePlatform) => {
		switch (nodePlatform) {
			case "sunos": return "solaris";
			case "win32": return "windows";
			default: return nodePlatform;
		}
	};
	exports.normalizeType = normalizeType;
}));
//#endregion
//#region node_modules/@opentelemetry/resources/build/src/detectors/platform/node/HostDetector.js
var require_HostDetector = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.hostDetector = void 0;
	const semconv_1 = require_semconv$6();
	const os_1$1 = __require("os");
	const getMachineId_1 = require_getMachineId();
	const utils_1 = require_utils$3();
	/**
	* HostDetector detects the resources related to the host current process is
	* running on. Currently only non-cloud-based attributes are included.
	*/
	var HostDetector = class {
		detect(_config) {
			return { attributes: {
				[semconv_1.ATTR_HOST_NAME]: (0, os_1$1.hostname)(),
				[semconv_1.ATTR_HOST_ARCH]: (0, utils_1.normalizeArch)((0, os_1$1.arch)()),
				[semconv_1.ATTR_HOST_ID]: (0, getMachineId_1.getMachineId)()
			} };
		}
	};
	exports.hostDetector = new HostDetector();
}));
//#endregion
//#region node_modules/@opentelemetry/resources/build/src/detectors/platform/node/OSDetector.js
var require_OSDetector = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.osDetector = void 0;
	const semconv_1 = require_semconv$6();
	const os_1 = __require("os");
	const utils_1 = require_utils$3();
	/**
	* OSDetector detects the resources related to the operating system (OS) on
	* which the process represented by this resource is running.
	*/
	var OSDetector = class {
		detect(_config) {
			return { attributes: {
				[semconv_1.ATTR_OS_TYPE]: (0, utils_1.normalizeType)((0, os_1.platform)()),
				[semconv_1.ATTR_OS_VERSION]: (0, os_1.release)()
			} };
		}
	};
	exports.osDetector = new OSDetector();
}));
//#endregion
//#region node_modules/@opentelemetry/resources/build/src/detectors/platform/node/ProcessDetector.js
var require_ProcessDetector = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.processDetector = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const semconv_1 = require_semconv$6();
	const os = __require("os");
	/**
	* ProcessDetector will be used to detect the resources related current process running
	* and being instrumented from the NodeJS Process module.
	*/
	var ProcessDetector = class {
		detect(_config) {
			const attributes = {
				[semconv_1.ATTR_PROCESS_PID]: process.pid,
				[semconv_1.ATTR_PROCESS_EXECUTABLE_NAME]: process.title,
				[semconv_1.ATTR_PROCESS_EXECUTABLE_PATH]: process.execPath,
				[semconv_1.ATTR_PROCESS_COMMAND_ARGS]: [
					process.argv[0],
					...process.execArgv,
					...process.argv.slice(1)
				],
				[semconv_1.ATTR_PROCESS_RUNTIME_VERSION]: process.versions.node,
				[semconv_1.ATTR_PROCESS_RUNTIME_NAME]: "nodejs",
				[semconv_1.ATTR_PROCESS_RUNTIME_DESCRIPTION]: "Node.js"
			};
			if (process.argv.length > 1) attributes[semconv_1.ATTR_PROCESS_COMMAND] = process.argv[1];
			try {
				const userInfo = os.userInfo();
				attributes[semconv_1.ATTR_PROCESS_OWNER] = userInfo.username;
			} catch (e) {
				api_1.diag.debug(`error obtaining process owner: ${e}`);
			}
			return { attributes };
		}
	};
	exports.processDetector = new ProcessDetector();
}));
//#endregion
//#region node_modules/@opentelemetry/resources/build/src/detectors/platform/node/ServiceInstanceIdDetector.js
var require_ServiceInstanceIdDetector = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.serviceInstanceIdDetector = void 0;
	const semconv_1 = require_semconv$6();
	const crypto_1 = __require("crypto");
	/**
	* ServiceInstanceIdDetector detects the resources related to the service instance ID.
	*/
	var ServiceInstanceIdDetector = class {
		detect(_config) {
			return { attributes: { [semconv_1.ATTR_SERVICE_INSTANCE_ID]: (0, crypto_1.randomUUID)() } };
		}
	};
	/**
	* @experimental
	*/
	exports.serviceInstanceIdDetector = new ServiceInstanceIdDetector();
}));
//#endregion
//#region node_modules/@opentelemetry/resources/build/src/detectors/platform/node/index.js
var require_node$6 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.serviceInstanceIdDetector = exports.processDetector = exports.osDetector = exports.hostDetector = void 0;
	var HostDetector_1 = require_HostDetector();
	Object.defineProperty(exports, "hostDetector", {
		enumerable: true,
		get: function() {
			return HostDetector_1.hostDetector;
		}
	});
	var OSDetector_1 = require_OSDetector();
	Object.defineProperty(exports, "osDetector", {
		enumerable: true,
		get: function() {
			return OSDetector_1.osDetector;
		}
	});
	var ProcessDetector_1 = require_ProcessDetector();
	Object.defineProperty(exports, "processDetector", {
		enumerable: true,
		get: function() {
			return ProcessDetector_1.processDetector;
		}
	});
	var ServiceInstanceIdDetector_1 = require_ServiceInstanceIdDetector();
	Object.defineProperty(exports, "serviceInstanceIdDetector", {
		enumerable: true,
		get: function() {
			return ServiceInstanceIdDetector_1.serviceInstanceIdDetector;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/resources/build/src/detectors/platform/index.js
var require_platform$6 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.serviceInstanceIdDetector = exports.processDetector = exports.osDetector = exports.hostDetector = void 0;
	var node_1 = require_node$6();
	Object.defineProperty(exports, "hostDetector", {
		enumerable: true,
		get: function() {
			return node_1.hostDetector;
		}
	});
	Object.defineProperty(exports, "osDetector", {
		enumerable: true,
		get: function() {
			return node_1.osDetector;
		}
	});
	Object.defineProperty(exports, "processDetector", {
		enumerable: true,
		get: function() {
			return node_1.processDetector;
		}
	});
	Object.defineProperty(exports, "serviceInstanceIdDetector", {
		enumerable: true,
		get: function() {
			return node_1.serviceInstanceIdDetector;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/resources/build/src/detectors/NoopDetector.js
var require_NoopDetector = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.noopDetector = exports.NoopDetector = void 0;
	var NoopDetector = class {
		detect() {
			return { attributes: {} };
		}
	};
	exports.NoopDetector = NoopDetector;
	exports.noopDetector = new NoopDetector();
}));
//#endregion
//#region node_modules/@opentelemetry/resources/build/src/detectors/index.js
var require_detectors = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.noopDetector = exports.serviceInstanceIdDetector = exports.processDetector = exports.osDetector = exports.hostDetector = exports.envDetector = void 0;
	var EnvDetector_1 = require_EnvDetector();
	Object.defineProperty(exports, "envDetector", {
		enumerable: true,
		get: function() {
			return EnvDetector_1.envDetector;
		}
	});
	var platform_1 = require_platform$6();
	Object.defineProperty(exports, "hostDetector", {
		enumerable: true,
		get: function() {
			return platform_1.hostDetector;
		}
	});
	Object.defineProperty(exports, "osDetector", {
		enumerable: true,
		get: function() {
			return platform_1.osDetector;
		}
	});
	Object.defineProperty(exports, "processDetector", {
		enumerable: true,
		get: function() {
			return platform_1.processDetector;
		}
	});
	Object.defineProperty(exports, "serviceInstanceIdDetector", {
		enumerable: true,
		get: function() {
			return platform_1.serviceInstanceIdDetector;
		}
	});
	var NoopDetector_1 = require_NoopDetector();
	Object.defineProperty(exports, "noopDetector", {
		enumerable: true,
		get: function() {
			return NoopDetector_1.noopDetector;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/resources/build/src/index.js
var require_src$12 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.defaultServiceName = exports.emptyResource = exports.defaultResource = exports.resourceFromAttributes = exports.serviceInstanceIdDetector = exports.processDetector = exports.osDetector = exports.hostDetector = exports.envDetector = exports.detectResources = void 0;
	var detect_resources_1 = require_detect_resources();
	Object.defineProperty(exports, "detectResources", {
		enumerable: true,
		get: function() {
			return detect_resources_1.detectResources;
		}
	});
	var detectors_1 = require_detectors();
	Object.defineProperty(exports, "envDetector", {
		enumerable: true,
		get: function() {
			return detectors_1.envDetector;
		}
	});
	Object.defineProperty(exports, "hostDetector", {
		enumerable: true,
		get: function() {
			return detectors_1.hostDetector;
		}
	});
	Object.defineProperty(exports, "osDetector", {
		enumerable: true,
		get: function() {
			return detectors_1.osDetector;
		}
	});
	Object.defineProperty(exports, "processDetector", {
		enumerable: true,
		get: function() {
			return detectors_1.processDetector;
		}
	});
	Object.defineProperty(exports, "serviceInstanceIdDetector", {
		enumerable: true,
		get: function() {
			return detectors_1.serviceInstanceIdDetector;
		}
	});
	var ResourceImpl_1 = require_ResourceImpl();
	Object.defineProperty(exports, "resourceFromAttributes", {
		enumerable: true,
		get: function() {
			return ResourceImpl_1.resourceFromAttributes;
		}
	});
	Object.defineProperty(exports, "defaultResource", {
		enumerable: true,
		get: function() {
			return ResourceImpl_1.defaultResource;
		}
	});
	Object.defineProperty(exports, "emptyResource", {
		enumerable: true,
		get: function() {
			return ResourceImpl_1.emptyResource;
		}
	});
	var default_service_name_1 = require_default_service_name();
	Object.defineProperty(exports, "defaultServiceName", {
		enumerable: true,
		get: function() {
			return default_service_name_1.defaultServiceName;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/view/ViewRegistry.js
var require_ViewRegistry = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ViewRegistry = void 0;
	var ViewRegistry = class {
		_registeredViews = [];
		addView(view) {
			this._registeredViews.push(view);
		}
		findViews(instrument, meter) {
			return this._registeredViews.filter((registeredView) => {
				return this._matchInstrument(registeredView.instrumentSelector, instrument) && this._matchMeter(registeredView.meterSelector, meter);
			});
		}
		_matchInstrument(selector, instrument) {
			return (selector.getType() === void 0 || instrument.type === selector.getType()) && selector.getNameFilter().match(instrument.name) && selector.getUnitFilter().match(instrument.unit);
		}
		_matchMeter(selector, meter) {
			return selector.getNameFilter().match(meter.name) && (meter.version === void 0 || selector.getVersionFilter().match(meter.version)) && (meter.schemaUrl === void 0 || selector.getSchemaUrlFilter().match(meter.schemaUrl));
		}
	};
	exports.ViewRegistry = ViewRegistry;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/InstrumentDescriptor.js
var require_InstrumentDescriptor = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isValidName = exports.isDescriptorCompatibleWith = exports.createInstrumentDescriptorWithView = exports.createInstrumentDescriptor = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const utils_1 = require_utils$5();
	function createInstrumentDescriptor(name, type, options) {
		if (!isValidName(name)) api_1.diag.warn(`Invalid metric name: "${name}". The metric name should be a ASCII string with a length no greater than 255 characters.`);
		return {
			name,
			type,
			description: options?.description ?? "",
			unit: options?.unit ?? "",
			valueType: options?.valueType ?? api_1.ValueType.DOUBLE,
			advice: options?.advice ?? {}
		};
	}
	exports.createInstrumentDescriptor = createInstrumentDescriptor;
	function createInstrumentDescriptorWithView(view, instrument) {
		return {
			name: view.name ?? instrument.name,
			description: view.description ?? instrument.description,
			type: instrument.type,
			unit: instrument.unit,
			valueType: instrument.valueType,
			advice: instrument.advice
		};
	}
	exports.createInstrumentDescriptorWithView = createInstrumentDescriptorWithView;
	function isDescriptorCompatibleWith(descriptor, otherDescriptor) {
		return (0, utils_1.equalsCaseInsensitive)(descriptor.name, otherDescriptor.name) && descriptor.unit === otherDescriptor.unit && descriptor.type === otherDescriptor.type && descriptor.valueType === otherDescriptor.valueType;
	}
	exports.isDescriptorCompatibleWith = isDescriptorCompatibleWith;
	const NAME_REGEXP = /^[a-z][a-z0-9_.\-/]{0,254}$/i;
	function isValidName(name) {
		return NAME_REGEXP.test(name);
	}
	exports.isValidName = isValidName;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/Instruments.js
var require_Instruments = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isObservableInstrument = exports.ObservableUpDownCounterInstrument = exports.ObservableGaugeInstrument = exports.ObservableCounterInstrument = exports.ObservableInstrument = exports.HistogramInstrument = exports.GaugeInstrument = exports.CounterInstrument = exports.UpDownCounterInstrument = exports.SyncInstrument = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	var SyncInstrument = class {
		_writableMetricStorage;
		_descriptor;
		constructor(writableMetricStorage, descriptor) {
			this._writableMetricStorage = writableMetricStorage;
			this._descriptor = descriptor;
		}
		_record(value, attributes = {}, context) {
			if (typeof value !== "number") {
				api_1.diag.warn(`non-number value provided to metric ${this._descriptor.name}: ${value}`);
				return;
			}
			if (this._descriptor.valueType === api_1.ValueType.INT && !Number.isInteger(value)) {
				api_1.diag.warn(`INT value type cannot accept a floating-point value for ${this._descriptor.name}, ignoring the fractional digits.`);
				value = Math.trunc(value);
				if (!Number.isInteger(value)) return;
			}
			this._writableMetricStorage.record(value, attributes, context, Date.now());
		}
	};
	exports.SyncInstrument = SyncInstrument;
	/**
	* The class implements {@link UpDownCounter} interface.
	*/
	var UpDownCounterInstrument = class extends SyncInstrument {
		/**
		* Increment value of counter by the input. Inputs may be negative.
		*/
		add(value, attributes, ctx) {
			this._record(value, attributes, ctx);
		}
	};
	exports.UpDownCounterInstrument = UpDownCounterInstrument;
	/**
	* The class implements {@link Counter} interface.
	*/
	var CounterInstrument = class extends SyncInstrument {
		/**
		* Increment value of counter by the input. Inputs may not be negative.
		*/
		add(value, attributes, ctx) {
			if (value < 0) {
				api_1.diag.warn(`negative value provided to counter ${this._descriptor.name}: ${value}`);
				return;
			}
			this._record(value, attributes, ctx);
		}
	};
	exports.CounterInstrument = CounterInstrument;
	/**
	* The class implements {@link Gauge} interface.
	*/
	var GaugeInstrument = class extends SyncInstrument {
		/**
		* Records a measurement.
		*/
		record(value, attributes, ctx) {
			this._record(value, attributes, ctx);
		}
	};
	exports.GaugeInstrument = GaugeInstrument;
	/**
	* The class implements {@link Histogram} interface.
	*/
	var HistogramInstrument = class extends SyncInstrument {
		/**
		* Records a measurement. Value of the measurement must not be negative.
		*/
		record(value, attributes, ctx) {
			if (value < 0) {
				api_1.diag.warn(`negative value provided to histogram ${this._descriptor.name}: ${value}`);
				return;
			}
			this._record(value, attributes, ctx);
		}
	};
	exports.HistogramInstrument = HistogramInstrument;
	var ObservableInstrument = class {
		/** @internal */
		_metricStorages;
		/** @internal */
		_descriptor;
		_observableRegistry;
		constructor(descriptor, metricStorages, observableRegistry) {
			this._descriptor = descriptor;
			this._metricStorages = metricStorages;
			this._observableRegistry = observableRegistry;
		}
		/**
		* @see {Observable.addCallback}
		*/
		addCallback(callback) {
			this._observableRegistry.addCallback(callback, this);
		}
		/**
		* @see {Observable.removeCallback}
		*/
		removeCallback(callback) {
			this._observableRegistry.removeCallback(callback, this);
		}
	};
	exports.ObservableInstrument = ObservableInstrument;
	var ObservableCounterInstrument = class extends ObservableInstrument {};
	exports.ObservableCounterInstrument = ObservableCounterInstrument;
	var ObservableGaugeInstrument = class extends ObservableInstrument {};
	exports.ObservableGaugeInstrument = ObservableGaugeInstrument;
	var ObservableUpDownCounterInstrument = class extends ObservableInstrument {};
	exports.ObservableUpDownCounterInstrument = ObservableUpDownCounterInstrument;
	function isObservableInstrument(it) {
		return it instanceof ObservableInstrument;
	}
	exports.isObservableInstrument = isObservableInstrument;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/Meter.js
var require_Meter = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Meter = void 0;
	const InstrumentDescriptor_1 = require_InstrumentDescriptor();
	const Instruments_1 = require_Instruments();
	const MetricData_1 = require_MetricData();
	/**
	* This class implements the {@link IMeter} interface.
	*/
	var Meter = class {
		_meterSharedState;
		constructor(meterSharedState) {
			this._meterSharedState = meterSharedState;
		}
		/**
		* Create a {@link Gauge} instrument.
		*/
		createGauge(name, options) {
			const descriptor = (0, InstrumentDescriptor_1.createInstrumentDescriptor)(name, MetricData_1.InstrumentType.GAUGE, options);
			const storage = this._meterSharedState.registerMetricStorage(descriptor);
			return new Instruments_1.GaugeInstrument(storage, descriptor);
		}
		/**
		* Create a {@link Histogram} instrument.
		*/
		createHistogram(name, options) {
			const descriptor = (0, InstrumentDescriptor_1.createInstrumentDescriptor)(name, MetricData_1.InstrumentType.HISTOGRAM, options);
			const storage = this._meterSharedState.registerMetricStorage(descriptor);
			return new Instruments_1.HistogramInstrument(storage, descriptor);
		}
		/**
		* Create a {@link Counter} instrument.
		*/
		createCounter(name, options) {
			const descriptor = (0, InstrumentDescriptor_1.createInstrumentDescriptor)(name, MetricData_1.InstrumentType.COUNTER, options);
			const storage = this._meterSharedState.registerMetricStorage(descriptor);
			return new Instruments_1.CounterInstrument(storage, descriptor);
		}
		/**
		* Create a {@link UpDownCounter} instrument.
		*/
		createUpDownCounter(name, options) {
			const descriptor = (0, InstrumentDescriptor_1.createInstrumentDescriptor)(name, MetricData_1.InstrumentType.UP_DOWN_COUNTER, options);
			const storage = this._meterSharedState.registerMetricStorage(descriptor);
			return new Instruments_1.UpDownCounterInstrument(storage, descriptor);
		}
		/**
		* Create a {@link ObservableGauge} instrument.
		*/
		createObservableGauge(name, options) {
			const descriptor = (0, InstrumentDescriptor_1.createInstrumentDescriptor)(name, MetricData_1.InstrumentType.OBSERVABLE_GAUGE, options);
			const storages = this._meterSharedState.registerAsyncMetricStorage(descriptor);
			return new Instruments_1.ObservableGaugeInstrument(descriptor, storages, this._meterSharedState.observableRegistry);
		}
		/**
		* Create a {@link ObservableCounter} instrument.
		*/
		createObservableCounter(name, options) {
			const descriptor = (0, InstrumentDescriptor_1.createInstrumentDescriptor)(name, MetricData_1.InstrumentType.OBSERVABLE_COUNTER, options);
			const storages = this._meterSharedState.registerAsyncMetricStorage(descriptor);
			return new Instruments_1.ObservableCounterInstrument(descriptor, storages, this._meterSharedState.observableRegistry);
		}
		/**
		* Create a {@link ObservableUpDownCounter} instrument.
		*/
		createObservableUpDownCounter(name, options) {
			const descriptor = (0, InstrumentDescriptor_1.createInstrumentDescriptor)(name, MetricData_1.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER, options);
			const storages = this._meterSharedState.registerAsyncMetricStorage(descriptor);
			return new Instruments_1.ObservableUpDownCounterInstrument(descriptor, storages, this._meterSharedState.observableRegistry);
		}
		/**
		* @see {@link Meter.addBatchObservableCallback}
		*/
		addBatchObservableCallback(callback, observables) {
			this._meterSharedState.observableRegistry.addBatchCallback(callback, observables);
		}
		/**
		* @see {@link Meter.removeBatchObservableCallback}
		*/
		removeBatchObservableCallback(callback, observables) {
			this._meterSharedState.observableRegistry.removeBatchCallback(callback, observables);
		}
	};
	exports.Meter = Meter;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/state/MetricStorage.js
var require_MetricStorage = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MetricStorage = void 0;
	const InstrumentDescriptor_1 = require_InstrumentDescriptor();
	/**
	* Internal interface.
	*
	* Represents a storage from which we can collect metrics.
	*/
	var MetricStorage = class {
		_instrumentDescriptor;
		constructor(instrumentDescriptor) {
			this._instrumentDescriptor = instrumentDescriptor;
		}
		getInstrumentDescriptor() {
			return this._instrumentDescriptor;
		}
		updateDescription(description) {
			this._instrumentDescriptor = (0, InstrumentDescriptor_1.createInstrumentDescriptor)(this._instrumentDescriptor.name, this._instrumentDescriptor.type, {
				description,
				valueType: this._instrumentDescriptor.valueType,
				unit: this._instrumentDescriptor.unit,
				advice: this._instrumentDescriptor.advice
			});
		}
	};
	exports.MetricStorage = MetricStorage;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/state/HashMap.js
var require_HashMap = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AttributeHashMap = exports.HashMap = void 0;
	const utils_1 = require_utils$5();
	var HashMap = class {
		_valueMap = /* @__PURE__ */ new Map();
		_keyMap = /* @__PURE__ */ new Map();
		_hash;
		constructor(hash) {
			this._hash = hash;
		}
		get(key, hashCode) {
			hashCode ??= this._hash(key);
			return this._valueMap.get(hashCode);
		}
		getOrDefault(key, defaultFactory) {
			const hash = this._hash(key);
			if (this._valueMap.has(hash)) return this._valueMap.get(hash);
			const val = defaultFactory();
			if (!this._keyMap.has(hash)) this._keyMap.set(hash, key);
			this._valueMap.set(hash, val);
			return val;
		}
		set(key, value, hashCode) {
			hashCode ??= this._hash(key);
			if (!this._keyMap.has(hashCode)) this._keyMap.set(hashCode, key);
			this._valueMap.set(hashCode, value);
		}
		has(key, hashCode) {
			hashCode ??= this._hash(key);
			return this._valueMap.has(hashCode);
		}
		*keys() {
			const keyIterator = this._keyMap.entries();
			let next = keyIterator.next();
			while (next.done !== true) {
				yield [next.value[1], next.value[0]];
				next = keyIterator.next();
			}
		}
		*entries() {
			const valueIterator = this._valueMap.entries();
			let next = valueIterator.next();
			while (next.done !== true) {
				yield [
					this._keyMap.get(next.value[0]),
					next.value[1],
					next.value[0]
				];
				next = valueIterator.next();
			}
		}
		get size() {
			return this._valueMap.size;
		}
	};
	exports.HashMap = HashMap;
	var AttributeHashMap = class extends HashMap {
		constructor() {
			super(utils_1.hashAttributes);
		}
	};
	exports.AttributeHashMap = AttributeHashMap;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/state/DeltaMetricProcessor.js
var require_DeltaMetricProcessor = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DeltaMetricProcessor = void 0;
	const core_1 = require_src$13();
	const utils_1 = require_utils$5();
	const HashMap_1 = require_HashMap();
	/**
	* Internal interface.
	*
	* Allows synchronous collection of metrics. This processor should allow
	* allocation of new aggregation cells for metrics and convert cumulative
	* recording to delta data points.
	*/
	var DeltaMetricProcessor = class {
		_activeCollectionStorage = new HashMap_1.AttributeHashMap();
		_cumulativeMemoStorage = new HashMap_1.AttributeHashMap();
		_cardinalityLimit;
		_overflowAttributes = { "otel.metric.overflow": true };
		_overflowHashCode;
		_aggregator;
		constructor(aggregator, aggregationCardinalityLimit) {
			this._aggregator = aggregator;
			this._cardinalityLimit = (aggregationCardinalityLimit ?? 2e3) - 1;
			this._overflowHashCode = (0, utils_1.hashAttributes)(this._overflowAttributes);
		}
		record(value, attributes, collectionTime) {
			let accumulation = this._activeCollectionStorage.get(attributes);
			if (!accumulation) {
				const hrTime = (0, core_1.millisToHrTime)(collectionTime);
				if (this._activeCollectionStorage.size >= this._cardinalityLimit) {
					this._activeCollectionStorage.getOrDefault(this._overflowAttributes, () => this._aggregator.createAccumulation(hrTime))?.record(value);
					return;
				}
				accumulation = this._aggregator.createAccumulation(hrTime);
				this._activeCollectionStorage.set(attributes, accumulation);
			}
			accumulation?.record(value);
		}
		batchCumulate(measurements, collectionTime) {
			for (const [originalAttributes, value, originalHashCode] of measurements.entries()) {
				let attributes = originalAttributes;
				let hashCode = originalHashCode;
				const accumulation = this._aggregator.createAccumulation(collectionTime);
				accumulation?.record(value);
				let delta = accumulation;
				if (this._cumulativeMemoStorage.has(attributes, hashCode)) {
					const previous = this._cumulativeMemoStorage.get(attributes, hashCode);
					delta = this._aggregator.diff(previous, accumulation);
				} else if (this._cumulativeMemoStorage.size >= this._cardinalityLimit) {
					attributes = this._overflowAttributes;
					hashCode = this._overflowHashCode;
					if (this._cumulativeMemoStorage.has(attributes, hashCode)) {
						const previous = this._cumulativeMemoStorage.get(attributes, hashCode);
						delta = this._aggregator.diff(previous, accumulation);
					}
				}
				if (this._activeCollectionStorage.has(attributes, hashCode)) {
					const active = this._activeCollectionStorage.get(attributes, hashCode);
					delta = this._aggregator.merge(active, delta);
				}
				this._cumulativeMemoStorage.set(attributes, accumulation, hashCode);
				this._activeCollectionStorage.set(attributes, delta, hashCode);
			}
		}
		/**
		* Returns a collection of delta metrics. Start time is the when first
		* time event collected.
		*/
		collect() {
			const unreportedDelta = this._activeCollectionStorage;
			this._activeCollectionStorage = new HashMap_1.AttributeHashMap();
			return unreportedDelta;
		}
	};
	exports.DeltaMetricProcessor = DeltaMetricProcessor;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/state/TemporalMetricProcessor.js
var require_TemporalMetricProcessor = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.TemporalMetricProcessor = void 0;
	const AggregationTemporality_1 = require_AggregationTemporality();
	const HashMap_1 = require_HashMap();
	exports.TemporalMetricProcessor = class TemporalMetricProcessor {
		_aggregator;
		_unreportedAccumulations = /* @__PURE__ */ new Map();
		_reportHistory = /* @__PURE__ */ new Map();
		constructor(aggregator, collectorHandles) {
			this._aggregator = aggregator;
			collectorHandles.forEach((handle) => {
				this._unreportedAccumulations.set(handle, []);
			});
		}
		/**
		* Builds the {@link MetricData} streams to report against a specific MetricCollector.
		* @param collector The information of the MetricCollector.
		* @param collectors The registered collectors.
		* @param instrumentDescriptor The instrumentation descriptor that these metrics generated with.
		* @param currentAccumulations The current accumulation of metric data from instruments.
		* @param collectionTime The current collection timestamp.
		* @returns The {@link MetricData} points or `null`.
		*/
		buildMetrics(collector, instrumentDescriptor, currentAccumulations, collectionTime) {
			this._stashAccumulations(currentAccumulations);
			const unreportedAccumulations = this._getMergedUnreportedAccumulations(collector);
			let result = unreportedAccumulations;
			let aggregationTemporality;
			if (this._reportHistory.has(collector)) {
				const last = this._reportHistory.get(collector);
				const lastCollectionTime = last.collectionTime;
				aggregationTemporality = last.aggregationTemporality;
				if (aggregationTemporality === AggregationTemporality_1.AggregationTemporality.CUMULATIVE) result = TemporalMetricProcessor.merge(last.accumulations, unreportedAccumulations, this._aggregator);
				else result = TemporalMetricProcessor.calibrateStartTime(last.accumulations, unreportedAccumulations, lastCollectionTime);
			} else aggregationTemporality = collector.selectAggregationTemporality(instrumentDescriptor.type);
			this._reportHistory.set(collector, {
				accumulations: result,
				collectionTime,
				aggregationTemporality
			});
			const accumulationRecords = AttributesMapToAccumulationRecords(result);
			if (accumulationRecords.length === 0) return;
			return this._aggregator.toMetricData(instrumentDescriptor, aggregationTemporality, accumulationRecords, collectionTime);
		}
		_stashAccumulations(currentAccumulation) {
			const registeredCollectors = this._unreportedAccumulations.keys();
			for (const collector of registeredCollectors) {
				let stash = this._unreportedAccumulations.get(collector);
				if (stash === void 0) {
					stash = [];
					this._unreportedAccumulations.set(collector, stash);
				}
				stash.push(currentAccumulation);
			}
		}
		_getMergedUnreportedAccumulations(collector) {
			let result = new HashMap_1.AttributeHashMap();
			const unreportedList = this._unreportedAccumulations.get(collector);
			this._unreportedAccumulations.set(collector, []);
			if (unreportedList === void 0) return result;
			for (const it of unreportedList) result = TemporalMetricProcessor.merge(result, it, this._aggregator);
			return result;
		}
		static merge(last, current, aggregator) {
			const result = last;
			const iterator = current.entries();
			let next = iterator.next();
			while (next.done !== true) {
				const [key, record, hash] = next.value;
				if (last.has(key, hash)) {
					const lastAccumulation = last.get(key, hash);
					const accumulation = aggregator.merge(lastAccumulation, record);
					result.set(key, accumulation, hash);
				} else result.set(key, record, hash);
				next = iterator.next();
			}
			return result;
		}
		/**
		* Calibrate the reported metric streams' startTime to lastCollectionTime. Leaves
		* the new stream to be the initial observation time unchanged.
		*/
		static calibrateStartTime(last, current, lastCollectionTime) {
			for (const [key, hash] of last.keys()) current.get(key, hash)?.setStartTime(lastCollectionTime);
			return current;
		}
	};
	function AttributesMapToAccumulationRecords(map) {
		return Array.from(map.entries());
	}
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/state/AsyncMetricStorage.js
var require_AsyncMetricStorage = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AsyncMetricStorage = void 0;
	const MetricStorage_1 = require_MetricStorage();
	const DeltaMetricProcessor_1 = require_DeltaMetricProcessor();
	const TemporalMetricProcessor_1 = require_TemporalMetricProcessor();
	const HashMap_1 = require_HashMap();
	/**
	* Internal interface.
	*
	* Stores and aggregates {@link MetricData} for asynchronous instruments.
	*/
	var AsyncMetricStorage = class extends MetricStorage_1.MetricStorage {
		_aggregationCardinalityLimit;
		_deltaMetricStorage;
		_temporalMetricStorage;
		_attributesProcessor;
		constructor(_instrumentDescriptor, aggregator, attributesProcessor, collectorHandles, aggregationCardinalityLimit) {
			super(_instrumentDescriptor);
			this._aggregationCardinalityLimit = aggregationCardinalityLimit;
			this._deltaMetricStorage = new DeltaMetricProcessor_1.DeltaMetricProcessor(aggregator, this._aggregationCardinalityLimit);
			this._temporalMetricStorage = new TemporalMetricProcessor_1.TemporalMetricProcessor(aggregator, collectorHandles);
			this._attributesProcessor = attributesProcessor;
		}
		record(measurements, observationTime) {
			if (this._attributesProcessor === void 0) {
				this._deltaMetricStorage.batchCumulate(measurements, observationTime);
				return;
			}
			const processed = new HashMap_1.AttributeHashMap();
			for (const [attributes, value] of measurements.entries()) processed.set(this._attributesProcessor.process(attributes), value);
			this._deltaMetricStorage.batchCumulate(processed, observationTime);
		}
		/**
		* Collects the metrics from this storage. The ObservableCallback is invoked
		* during the collection.
		*
		* Note: This is a stateful operation and may reset any interval-related
		* state for the MetricCollector.
		*/
		collect(collector, collectionTime) {
			const accumulations = this._deltaMetricStorage.collect();
			return this._temporalMetricStorage.buildMetrics(collector, this._instrumentDescriptor, accumulations, collectionTime);
		}
	};
	exports.AsyncMetricStorage = AsyncMetricStorage;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/view/RegistrationConflicts.js
var require_RegistrationConflicts = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getConflictResolutionRecipe = exports.getDescriptionResolutionRecipe = exports.getTypeConflictResolutionRecipe = exports.getUnitConflictResolutionRecipe = exports.getValueTypeConflictResolutionRecipe = exports.getIncompatibilityDetails = void 0;
	function getIncompatibilityDetails(existing, otherDescriptor) {
		let incompatibility = "";
		if (existing.unit !== otherDescriptor.unit) incompatibility += `\t- Unit '${existing.unit}' does not match '${otherDescriptor.unit}'\n`;
		if (existing.type !== otherDescriptor.type) incompatibility += `\t- Type '${existing.type}' does not match '${otherDescriptor.type}'\n`;
		if (existing.valueType !== otherDescriptor.valueType) incompatibility += `\t- Value Type '${existing.valueType}' does not match '${otherDescriptor.valueType}'\n`;
		if (existing.description !== otherDescriptor.description) incompatibility += `\t- Description '${existing.description}' does not match '${otherDescriptor.description}'\n`;
		return incompatibility;
	}
	exports.getIncompatibilityDetails = getIncompatibilityDetails;
	function getValueTypeConflictResolutionRecipe(existing, otherDescriptor) {
		return `\t- use valueType '${existing.valueType}' on instrument creation or use an instrument name other than '${otherDescriptor.name}'`;
	}
	exports.getValueTypeConflictResolutionRecipe = getValueTypeConflictResolutionRecipe;
	function getUnitConflictResolutionRecipe(existing, otherDescriptor) {
		return `\t- use unit '${existing.unit}' on instrument creation or use an instrument name other than '${otherDescriptor.name}'`;
	}
	exports.getUnitConflictResolutionRecipe = getUnitConflictResolutionRecipe;
	function getTypeConflictResolutionRecipe(existing, otherDescriptor) {
		const selector = {
			name: otherDescriptor.name,
			type: otherDescriptor.type,
			unit: otherDescriptor.unit
		};
		const selectorString = JSON.stringify(selector);
		return `\t- create a new view with a name other than '${existing.name}' and InstrumentSelector '${selectorString}'`;
	}
	exports.getTypeConflictResolutionRecipe = getTypeConflictResolutionRecipe;
	function getDescriptionResolutionRecipe(existing, otherDescriptor) {
		const selector = {
			name: otherDescriptor.name,
			type: otherDescriptor.type,
			unit: otherDescriptor.unit
		};
		const selectorString = JSON.stringify(selector);
		return `\t- create a new view with a name other than '${existing.name}' and InstrumentSelector '${selectorString}'
    \t- OR - create a new view with the name ${existing.name} and description '${existing.description}' and InstrumentSelector ${selectorString}
    \t- OR - create a new view with the name ${otherDescriptor.name} and description '${existing.description}' and InstrumentSelector ${selectorString}`;
	}
	exports.getDescriptionResolutionRecipe = getDescriptionResolutionRecipe;
	function getConflictResolutionRecipe(existing, otherDescriptor) {
		if (existing.valueType !== otherDescriptor.valueType) return getValueTypeConflictResolutionRecipe(existing, otherDescriptor);
		if (existing.unit !== otherDescriptor.unit) return getUnitConflictResolutionRecipe(existing, otherDescriptor);
		if (existing.type !== otherDescriptor.type) return getTypeConflictResolutionRecipe(existing, otherDescriptor);
		if (existing.description !== otherDescriptor.description) return getDescriptionResolutionRecipe(existing, otherDescriptor);
		return "";
	}
	exports.getConflictResolutionRecipe = getConflictResolutionRecipe;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/state/MetricStorageRegistry.js
var require_MetricStorageRegistry = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MetricStorageRegistry = void 0;
	const InstrumentDescriptor_1 = require_InstrumentDescriptor();
	const api = (init_esm$2(), __toCommonJS(esm_exports$2));
	const RegistrationConflicts_1 = require_RegistrationConflicts();
	exports.MetricStorageRegistry = class MetricStorageRegistry {
		_sharedRegistry = /* @__PURE__ */ new Map();
		_perCollectorRegistry = /* @__PURE__ */ new Map();
		static create() {
			return new MetricStorageRegistry();
		}
		getStorages(collector) {
			let storages = [];
			for (const metricStorages of this._sharedRegistry.values()) storages = storages.concat(metricStorages);
			const perCollectorStorages = this._perCollectorRegistry.get(collector);
			if (perCollectorStorages != null) for (const metricStorages of perCollectorStorages.values()) storages = storages.concat(metricStorages);
			return storages;
		}
		register(storage) {
			this._registerStorage(storage, this._sharedRegistry);
		}
		registerForCollector(collector, storage) {
			let storageMap = this._perCollectorRegistry.get(collector);
			if (storageMap == null) {
				storageMap = /* @__PURE__ */ new Map();
				this._perCollectorRegistry.set(collector, storageMap);
			}
			this._registerStorage(storage, storageMap);
		}
		findOrUpdateCompatibleStorage(expectedDescriptor) {
			const storages = this._sharedRegistry.get(expectedDescriptor.name);
			if (storages === void 0) return null;
			return this._findOrUpdateCompatibleStorage(expectedDescriptor, storages);
		}
		findOrUpdateCompatibleCollectorStorage(collector, expectedDescriptor) {
			const storageMap = this._perCollectorRegistry.get(collector);
			if (storageMap === void 0) return null;
			const storages = storageMap.get(expectedDescriptor.name);
			if (storages === void 0) return null;
			return this._findOrUpdateCompatibleStorage(expectedDescriptor, storages);
		}
		_registerStorage(storage, storageMap) {
			const descriptor = storage.getInstrumentDescriptor();
			const storages = storageMap.get(descriptor.name);
			if (storages === void 0) {
				storageMap.set(descriptor.name, [storage]);
				return;
			}
			storages.push(storage);
		}
		_findOrUpdateCompatibleStorage(expectedDescriptor, existingStorages) {
			let compatibleStorage = null;
			for (const existingStorage of existingStorages) {
				const existingDescriptor = existingStorage.getInstrumentDescriptor();
				if ((0, InstrumentDescriptor_1.isDescriptorCompatibleWith)(existingDescriptor, expectedDescriptor)) {
					if (existingDescriptor.description !== expectedDescriptor.description) {
						if (expectedDescriptor.description.length > existingDescriptor.description.length) existingStorage.updateDescription(expectedDescriptor.description);
						api.diag.warn("A view or instrument with the name ", expectedDescriptor.name, " has already been registered, but has a different description and is incompatible with another registered view.\n", "Details:\n", (0, RegistrationConflicts_1.getIncompatibilityDetails)(existingDescriptor, expectedDescriptor), "The longer description will be used.\nTo resolve the conflict:", (0, RegistrationConflicts_1.getConflictResolutionRecipe)(existingDescriptor, expectedDescriptor));
					}
					compatibleStorage = existingStorage;
				} else api.diag.warn("A view or instrument with the name ", expectedDescriptor.name, " has already been registered and is incompatible with another registered view.\n", "Details:\n", (0, RegistrationConflicts_1.getIncompatibilityDetails)(existingDescriptor, expectedDescriptor), "To resolve the conflict:\n", (0, RegistrationConflicts_1.getConflictResolutionRecipe)(existingDescriptor, expectedDescriptor));
			}
			return compatibleStorage;
		}
	};
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/state/MultiWritableMetricStorage.js
var require_MultiWritableMetricStorage = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MultiMetricStorage = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	/**
	* Internal interface.
	*/
	var MultiMetricStorage = class {
		_backingStorages;
		hasAttributeProcessor;
		constructor(backingStorages) {
			this._backingStorages = backingStorages;
			this.hasAttributeProcessor = backingStorages.some((s) => s.hasAttributeProcessor);
		}
		record(value, attributes, context, recordTime) {
			if (this.hasAttributeProcessor && context === void 0) context = api_1.context.active();
			const storages = this._backingStorages;
			for (let i = 0; i < storages.length; i++) storages[i].record(value, attributes, context, recordTime);
		}
	};
	exports.MultiMetricStorage = MultiMetricStorage;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/ObservableResult.js
var require_ObservableResult = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.BatchObservableResultImpl = exports.ObservableResultImpl = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const HashMap_1 = require_HashMap();
	const Instruments_1 = require_Instruments();
	/**
	* The class implements {@link ObservableResult} interface.
	*/
	var ObservableResultImpl = class {
		/**
		* @internal
		*/
		_buffer = new HashMap_1.AttributeHashMap();
		_instrumentName;
		_valueType;
		constructor(instrumentName, valueType) {
			this._instrumentName = instrumentName;
			this._valueType = valueType;
		}
		/**
		* Observe a measurement of the value associated with the given attributes.
		*/
		observe(value, attributes = {}) {
			if (typeof value !== "number") {
				api_1.diag.warn(`non-number value provided to metric ${this._instrumentName}: ${value}`);
				return;
			}
			if (this._valueType === api_1.ValueType.INT && !Number.isInteger(value)) {
				api_1.diag.warn(`INT value type cannot accept a floating-point value for ${this._instrumentName}, ignoring the fractional digits.`);
				value = Math.trunc(value);
				if (!Number.isInteger(value)) return;
			}
			this._buffer.set(attributes, value);
		}
	};
	exports.ObservableResultImpl = ObservableResultImpl;
	/**
	* The class implements {@link BatchObservableCallback} interface.
	*/
	var BatchObservableResultImpl = class {
		/**
		* @internal
		*/
		_buffer = /* @__PURE__ */ new Map();
		/**
		* Observe a measurement of the value associated with the given attributes.
		*/
		observe(metric, value, attributes = {}) {
			if (!(0, Instruments_1.isObservableInstrument)(metric)) return;
			let map = this._buffer.get(metric);
			if (map == null) {
				map = new HashMap_1.AttributeHashMap();
				this._buffer.set(metric, map);
			}
			if (typeof value !== "number") {
				api_1.diag.warn(`non-number value provided to metric ${metric._descriptor.name}: ${value}`);
				return;
			}
			if (metric._descriptor.valueType === api_1.ValueType.INT && !Number.isInteger(value)) {
				api_1.diag.warn(`INT value type cannot accept a floating-point value for ${metric._descriptor.name}, ignoring the fractional digits.`);
				value = Math.trunc(value);
				if (!Number.isInteger(value)) return;
			}
			map.set(attributes, value);
		}
	};
	exports.BatchObservableResultImpl = BatchObservableResultImpl;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/state/ObservableRegistry.js
var require_ObservableRegistry = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ObservableRegistry = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const Instruments_1 = require_Instruments();
	const ObservableResult_1 = require_ObservableResult();
	const utils_1 = require_utils$5();
	/**
	* An internal interface for managing ObservableCallbacks.
	*
	* Every registered callback associated with a set of instruments are be evaluated
	* exactly once during collection prior to reading data for that instrument.
	*/
	var ObservableRegistry = class {
		_callbacks = [];
		_batchCallbacks = [];
		addCallback(callback, instrument) {
			if (this._findCallback(callback, instrument) >= 0) return;
			this._callbacks.push({
				callback,
				instrument
			});
		}
		removeCallback(callback, instrument) {
			const idx = this._findCallback(callback, instrument);
			if (idx < 0) return;
			this._callbacks.splice(idx, 1);
		}
		addBatchCallback(callback, instruments) {
			const observableInstruments = new Set(instruments.filter(Instruments_1.isObservableInstrument));
			if (observableInstruments.size === 0) {
				api_1.diag.error("BatchObservableCallback is not associated with valid instruments", instruments);
				return;
			}
			if (this._findBatchCallback(callback, observableInstruments) >= 0) return;
			this._batchCallbacks.push({
				callback,
				instruments: observableInstruments
			});
		}
		removeBatchCallback(callback, instruments) {
			const observableInstruments = new Set(instruments.filter(Instruments_1.isObservableInstrument));
			const idx = this._findBatchCallback(callback, observableInstruments);
			if (idx < 0) return;
			this._batchCallbacks.splice(idx, 1);
		}
		/**
		* @returns a promise of rejected reasons for invoking callbacks.
		*/
		async observe(collectionTime, timeoutMillis) {
			const callbackFutures = this._observeCallbacks(collectionTime, timeoutMillis);
			const batchCallbackFutures = this._observeBatchCallbacks(collectionTime, timeoutMillis);
			return (await Promise.allSettled([...callbackFutures, ...batchCallbackFutures])).filter((result) => result.status === "rejected").map((result) => result.reason);
		}
		_observeCallbacks(observationTime, timeoutMillis) {
			return this._callbacks.map(async ({ callback, instrument }) => {
				const observableResult = new ObservableResult_1.ObservableResultImpl(instrument._descriptor.name, instrument._descriptor.valueType);
				let callPromise = Promise.resolve(callback(observableResult));
				if (timeoutMillis != null) callPromise = (0, utils_1.callWithTimeout)(callPromise, timeoutMillis);
				await callPromise;
				instrument._metricStorages.forEach((metricStorage) => {
					metricStorage.record(observableResult._buffer, observationTime);
				});
			});
		}
		_observeBatchCallbacks(observationTime, timeoutMillis) {
			return this._batchCallbacks.map(async ({ callback, instruments }) => {
				const observableResult = new ObservableResult_1.BatchObservableResultImpl();
				let callPromise = Promise.resolve(callback(observableResult));
				if (timeoutMillis != null) callPromise = (0, utils_1.callWithTimeout)(callPromise, timeoutMillis);
				await callPromise;
				instruments.forEach((instrument) => {
					const buffer = observableResult._buffer.get(instrument);
					if (buffer == null) return;
					instrument._metricStorages.forEach((metricStorage) => {
						metricStorage.record(buffer, observationTime);
					});
				});
			});
		}
		_findCallback(callback, instrument) {
			return this._callbacks.findIndex((record) => {
				return record.callback === callback && record.instrument === instrument;
			});
		}
		_findBatchCallback(callback, instruments) {
			return this._batchCallbacks.findIndex((record) => {
				return record.callback === callback && (0, utils_1.setEquals)(record.instruments, instruments);
			});
		}
	};
	exports.ObservableRegistry = ObservableRegistry;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/state/SyncMetricStorage.js
var require_SyncMetricStorage = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SyncMetricStorage = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const MetricStorage_1 = require_MetricStorage();
	const DeltaMetricProcessor_1 = require_DeltaMetricProcessor();
	const TemporalMetricProcessor_1 = require_TemporalMetricProcessor();
	/**
	* Internal interface.
	*
	* Stores and aggregates {@link MetricData} for synchronous instruments.
	*/
	var SyncMetricStorage = class extends MetricStorage_1.MetricStorage {
		_aggregationCardinalityLimit;
		_deltaMetricStorage;
		_temporalMetricStorage;
		_attributesProcessor;
		constructor(instrumentDescriptor, aggregator, attributesProcessor, collectorHandles, aggregationCardinalityLimit) {
			super(instrumentDescriptor);
			this._aggregationCardinalityLimit = aggregationCardinalityLimit;
			this._deltaMetricStorage = new DeltaMetricProcessor_1.DeltaMetricProcessor(aggregator, this._aggregationCardinalityLimit);
			this._temporalMetricStorage = new TemporalMetricProcessor_1.TemporalMetricProcessor(aggregator, collectorHandles);
			this._attributesProcessor = attributesProcessor;
			this.hasAttributeProcessor = attributesProcessor !== void 0;
		}
		hasAttributeProcessor;
		record(value, attributes, context, recordTime) {
			if (this._attributesProcessor !== void 0) attributes = this._attributesProcessor.process(attributes, context ?? api_1.context.active());
			this._deltaMetricStorage.record(value, attributes, recordTime);
		}
		/**
		* Collects the metrics from this storage.
		*
		* Note: This is a stateful operation and may reset any interval-related
		* state for the MetricCollector.
		*/
		collect(collector, collectionTime) {
			const accumulations = this._deltaMetricStorage.collect();
			return this._temporalMetricStorage.buildMetrics(collector, this._instrumentDescriptor, accumulations, collectionTime);
		}
	};
	exports.SyncMetricStorage = SyncMetricStorage;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/state/MeterSharedState.js
var require_MeterSharedState = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MeterSharedState = void 0;
	const InstrumentDescriptor_1 = require_InstrumentDescriptor();
	const Meter_1 = require_Meter();
	const AsyncMetricStorage_1 = require_AsyncMetricStorage();
	const MetricStorageRegistry_1 = require_MetricStorageRegistry();
	const MultiWritableMetricStorage_1 = require_MultiWritableMetricStorage();
	const ObservableRegistry_1 = require_ObservableRegistry();
	const SyncMetricStorage_1 = require_SyncMetricStorage();
	/**
	* An internal record for shared meter provider states.
	*/
	var MeterSharedState = class {
		metricStorageRegistry = new MetricStorageRegistry_1.MetricStorageRegistry();
		observableRegistry = new ObservableRegistry_1.ObservableRegistry();
		meter;
		_meterProviderSharedState;
		_instrumentationScope;
		constructor(meterProviderSharedState, instrumentationScope) {
			this.meter = new Meter_1.Meter(this);
			this._meterProviderSharedState = meterProviderSharedState;
			this._instrumentationScope = instrumentationScope;
		}
		registerMetricStorage(descriptor) {
			const storages = this._registerMetricStorage(descriptor, SyncMetricStorage_1.SyncMetricStorage);
			if (storages.length === 1) return storages[0];
			return new MultiWritableMetricStorage_1.MultiMetricStorage(storages);
		}
		registerAsyncMetricStorage(descriptor) {
			return this._registerMetricStorage(descriptor, AsyncMetricStorage_1.AsyncMetricStorage);
		}
		/**
		* @param collector opaque handle of {@link MetricCollector} which initiated the collection.
		* @param collectionTime the HrTime at which the collection was initiated.
		* @param options options for collection.
		* @returns the list of metric data collected.
		*/
		async collect(collector, collectionTime, options) {
			/**
			* 1. Call all observable callbacks first.
			* 2. Collect metric result for the collector.
			*/
			const errors = await this.observableRegistry.observe(collectionTime, options?.timeoutMillis);
			const storages = this.metricStorageRegistry.getStorages(collector);
			if (storages.length === 0) return null;
			const metricDataList = [];
			storages.forEach((metricStorage) => {
				const metricData = metricStorage.collect(collector, collectionTime);
				if (metricData != null) metricDataList.push(metricData);
			});
			if (metricDataList.length === 0) return { errors };
			return {
				scopeMetrics: {
					scope: this._instrumentationScope,
					metrics: metricDataList
				},
				errors
			};
		}
		_registerMetricStorage(descriptor, MetricStorageType) {
			let storages = this._meterProviderSharedState.viewRegistry.findViews(descriptor, this._instrumentationScope).map((view) => {
				const viewDescriptor = (0, InstrumentDescriptor_1.createInstrumentDescriptorWithView)(view, descriptor);
				const compatibleStorage = this.metricStorageRegistry.findOrUpdateCompatibleStorage(viewDescriptor);
				if (compatibleStorage != null) return compatibleStorage;
				const viewStorage = new MetricStorageType(viewDescriptor, view.aggregation.createAggregator(viewDescriptor), view.attributesProcessor, this._meterProviderSharedState.metricCollectors, view.aggregationCardinalityLimit);
				this.metricStorageRegistry.register(viewStorage);
				return viewStorage;
			});
			if (storages.length === 0) {
				const collectorStorages = this._meterProviderSharedState.selectAggregations(descriptor.type).map(([collector, aggregation]) => {
					const compatibleStorage = this.metricStorageRegistry.findOrUpdateCompatibleCollectorStorage(collector, descriptor);
					if (compatibleStorage != null) return compatibleStorage;
					const aggregator = aggregation.createAggregator(descriptor);
					const cardinalityLimit = collector.selectCardinalityLimit(descriptor.type);
					const storage = new MetricStorageType(descriptor, aggregator, void 0, [collector], cardinalityLimit);
					this.metricStorageRegistry.registerForCollector(collector, storage);
					return storage;
				});
				storages = storages.concat(collectorStorages);
			}
			return storages;
		}
	};
	exports.MeterSharedState = MeterSharedState;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/state/MeterProviderSharedState.js
var require_MeterProviderSharedState = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MeterProviderSharedState = void 0;
	const utils_1 = require_utils$5();
	const ViewRegistry_1 = require_ViewRegistry();
	const MeterSharedState_1 = require_MeterSharedState();
	const AggregationOption_1 = require_AggregationOption();
	/**
	* An internal record for shared meter provider states.
	*/
	var MeterProviderSharedState = class {
		viewRegistry = new ViewRegistry_1.ViewRegistry();
		metricCollectors = [];
		meterSharedStates = /* @__PURE__ */ new Map();
		resource;
		constructor(resource) {
			this.resource = resource;
		}
		getMeterSharedState(instrumentationScope) {
			const id = (0, utils_1.instrumentationScopeId)(instrumentationScope);
			let meterSharedState = this.meterSharedStates.get(id);
			if (meterSharedState == null) {
				meterSharedState = new MeterSharedState_1.MeterSharedState(this, instrumentationScope);
				this.meterSharedStates.set(id, meterSharedState);
			}
			return meterSharedState;
		}
		selectAggregations(instrumentType) {
			const result = [];
			for (const collector of this.metricCollectors) result.push([collector, (0, AggregationOption_1.toAggregation)(collector.selectAggregation(instrumentType))]);
			return result;
		}
	};
	exports.MeterProviderSharedState = MeterProviderSharedState;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/state/MetricCollector.js
var require_MetricCollector = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MetricCollector = void 0;
	const core_1 = require_src$13();
	/**
	* An internal opaque interface that the MetricReader receives as
	* MetricProducer. It acts as the storage key to the internal metric stream
	* state for each MetricReader.
	*/
	var MetricCollector = class {
		_sharedState;
		_metricReader;
		constructor(sharedState, metricReader) {
			this._sharedState = sharedState;
			this._metricReader = metricReader;
		}
		async collect(options) {
			const collectionTime = (0, core_1.millisToHrTime)(Date.now());
			const scopeMetrics = [];
			const errors = [];
			const meterCollectionPromises = Array.from(this._sharedState.meterSharedStates.values()).map(async (meterSharedState) => {
				const current = await meterSharedState.collect(this, collectionTime, options);
				if (current?.scopeMetrics != null) scopeMetrics.push(current.scopeMetrics);
				if (current?.errors != null) errors.push(...current.errors);
			});
			await Promise.all(meterCollectionPromises);
			return {
				resourceMetrics: {
					resource: this._sharedState.resource,
					scopeMetrics
				},
				errors
			};
		}
		/**
		* Delegates for MetricReader.forceFlush.
		*/
		async forceFlush(options) {
			await this._metricReader.forceFlush(options);
		}
		/**
		* Delegates for MetricReader.shutdown.
		*/
		async shutdown(options) {
			await this._metricReader.shutdown(options);
		}
		selectAggregationTemporality(instrumentType) {
			return this._metricReader.selectAggregationTemporality(instrumentType);
		}
		selectAggregation(instrumentType) {
			return this._metricReader.selectAggregation(instrumentType);
		}
		/**
		* Select the cardinality limit for the given {@link InstrumentType} for this
		* collector.
		*/
		selectCardinalityLimit(instrumentType) {
			return this._metricReader.selectCardinalityLimit?.(instrumentType) ?? 2e3;
		}
	};
	exports.MetricCollector = MetricCollector;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/view/Predicate.js
var require_Predicate = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ExactPredicate = exports.PatternPredicate = void 0;
	const ESCAPE = /[\^$\\.+?()[\]{}|]/g;
	exports.PatternPredicate = class PatternPredicate {
		_matchAll;
		_regexp;
		constructor(pattern) {
			if (pattern === "*") {
				this._matchAll = true;
				this._regexp = /.*/;
			} else {
				this._matchAll = false;
				this._regexp = new RegExp(PatternPredicate.escapePattern(pattern));
			}
		}
		match(str) {
			if (this._matchAll) return true;
			return this._regexp.test(str);
		}
		static escapePattern(pattern) {
			return `^${pattern.replace(ESCAPE, "\\$&").replace("*", ".*")}$`;
		}
		static hasWildcard(pattern) {
			return pattern.includes("*");
		}
	};
	var ExactPredicate = class {
		_matchAll;
		_pattern;
		constructor(pattern) {
			this._matchAll = pattern === void 0;
			this._pattern = pattern;
		}
		match(str) {
			if (this._matchAll) return true;
			if (str === this._pattern) return true;
			return false;
		}
	};
	exports.ExactPredicate = ExactPredicate;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/view/AttributesProcessor.js
var require_AttributesProcessor = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createDenyListAttributesProcessor = exports.createAllowListAttributesProcessor = exports.createMultiAttributesProcessor = exports.createNoopAttributesProcessor = void 0;
	var NoopAttributesProcessor = class {
		process(incoming, _context) {
			return incoming;
		}
	};
	var MultiAttributesProcessor = class {
		_processors;
		constructor(processors) {
			this._processors = processors;
		}
		process(incoming, context) {
			let filteredAttributes = incoming;
			for (const processor of this._processors) filteredAttributes = processor.process(filteredAttributes, context);
			return filteredAttributes;
		}
	};
	var AllowListProcessor = class {
		_allowedAttributeNames;
		constructor(allowedAttributeNames) {
			this._allowedAttributeNames = new Set(allowedAttributeNames);
		}
		process(incoming, _context) {
			const filteredAttributes = {};
			for (const attributeName in incoming) if (Object.prototype.hasOwnProperty.call(incoming, attributeName) && this._allowedAttributeNames.has(attributeName)) filteredAttributes[attributeName] = incoming[attributeName];
			return filteredAttributes;
		}
	};
	var DenyListProcessor = class {
		_deniedAttributeNames;
		constructor(deniedAttributeNames) {
			this._deniedAttributeNames = new Set(deniedAttributeNames);
		}
		process(incoming, _context) {
			const filteredAttributes = {};
			for (const attributeName in incoming) if (Object.prototype.hasOwnProperty.call(incoming, attributeName) && !this._deniedAttributeNames.has(attributeName)) filteredAttributes[attributeName] = incoming[attributeName];
			return filteredAttributes;
		}
	};
	/**
	* @internal
	*
	* Create an {@link IAttributesProcessor} that acts as a simple pass-through for attributes.
	*/
	function createNoopAttributesProcessor() {
		return NOOP;
	}
	exports.createNoopAttributesProcessor = createNoopAttributesProcessor;
	/**
	* @internal
	*
	* Create an {@link IAttributesProcessor} that applies all processors from the provided list in order.
	*
	* @param processors Processors to apply in order.
	*/
	function createMultiAttributesProcessor(processors) {
		return new MultiAttributesProcessor(processors);
	}
	exports.createMultiAttributesProcessor = createMultiAttributesProcessor;
	/**
	* Create an {@link IAttributesProcessor} that filters by allowed attribute names and drops any names that are not in the
	* allow list.
	*/
	function createAllowListAttributesProcessor(attributeAllowList) {
		return new AllowListProcessor(attributeAllowList);
	}
	exports.createAllowListAttributesProcessor = createAllowListAttributesProcessor;
	/**
	* Create an {@link IAttributesProcessor} that drops attributes based on the names provided in the deny list
	*/
	function createDenyListAttributesProcessor(attributeDenyList) {
		return new DenyListProcessor(attributeDenyList);
	}
	exports.createDenyListAttributesProcessor = createDenyListAttributesProcessor;
	const NOOP = new NoopAttributesProcessor();
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/view/InstrumentSelector.js
var require_InstrumentSelector = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.InstrumentSelector = void 0;
	const Predicate_1 = require_Predicate();
	var InstrumentSelector = class {
		_nameFilter;
		_type;
		_unitFilter;
		constructor(criteria) {
			this._nameFilter = new Predicate_1.PatternPredicate(criteria?.name ?? "*");
			this._type = criteria?.type;
			this._unitFilter = new Predicate_1.ExactPredicate(criteria?.unit);
		}
		getType() {
			return this._type;
		}
		getNameFilter() {
			return this._nameFilter;
		}
		getUnitFilter() {
			return this._unitFilter;
		}
	};
	exports.InstrumentSelector = InstrumentSelector;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/view/MeterSelector.js
var require_MeterSelector = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MeterSelector = void 0;
	const Predicate_1 = require_Predicate();
	var MeterSelector = class {
		_nameFilter;
		_versionFilter;
		_schemaUrlFilter;
		constructor(criteria) {
			this._nameFilter = new Predicate_1.ExactPredicate(criteria?.name);
			this._versionFilter = new Predicate_1.ExactPredicate(criteria?.version);
			this._schemaUrlFilter = new Predicate_1.ExactPredicate(criteria?.schemaUrl);
		}
		getNameFilter() {
			return this._nameFilter;
		}
		/**
		* TODO: semver filter? no spec yet.
		*/
		getVersionFilter() {
			return this._versionFilter;
		}
		getSchemaUrlFilter() {
			return this._schemaUrlFilter;
		}
	};
	exports.MeterSelector = MeterSelector;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/view/View.js
var require_View = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.View = void 0;
	const Predicate_1 = require_Predicate();
	const AttributesProcessor_1 = require_AttributesProcessor();
	const InstrumentSelector_1 = require_InstrumentSelector();
	const MeterSelector_1 = require_MeterSelector();
	const AggregationOption_1 = require_AggregationOption();
	function isSelectorNotProvided(options) {
		return options.instrumentName == null && options.instrumentType == null && options.instrumentUnit == null && options.meterName == null && options.meterVersion == null && options.meterSchemaUrl == null;
	}
	function validateViewOptions(viewOptions) {
		if (isSelectorNotProvided(viewOptions)) throw new Error("Cannot create view with no selector arguments supplied");
		if (viewOptions.name != null && (viewOptions?.instrumentName == null || Predicate_1.PatternPredicate.hasWildcard(viewOptions.instrumentName))) throw new Error("Views with a specified name must be declared with an instrument selector that selects at most one instrument per meter.");
	}
	/**
	* Can be passed to a {@link MeterProvider} to select instruments and alter their metric stream.
	*/
	var View = class {
		name;
		description;
		aggregation;
		attributesProcessor;
		instrumentSelector;
		meterSelector;
		aggregationCardinalityLimit;
		/**
		* Create a new {@link View} instance.
		*
		* Parameters can be categorized as two types:
		*  Instrument selection criteria: Used to describe the instrument(s) this view will be applied to.
		*  Will be treated as additive (the Instrument has to meet all the provided criteria to be selected).
		*
		*  Metric stream altering: Alter the metric stream of instruments selected by instrument selection criteria.
		*
		* @param viewOptions {@link ViewOptions} for altering the metric stream and instrument selection.
		* @param viewOptions.name
		* Alters the metric stream:
		*  This will be used as the name of the metrics stream.
		*  If not provided, the original Instrument name will be used.
		* @param viewOptions.description
		* Alters the metric stream:
		*  This will be used as the description of the metrics stream.
		*  If not provided, the original Instrument description will be used by default.
		* @param viewOptions.attributesProcessors
		* Alters the metric stream:
		*  If provided, the attributes will be modified as defined by the added processors.
		*  If not provided, all attribute keys will be used by default.
		* @param viewOptions.aggregationCardinalityLimit
		* Alters the metric stream:
		*  Sets a limit on the number of unique attribute combinations (cardinality) that can be aggregated.
		*  If not provided, the default limit of 2000 will be used.
		* @param viewOptions.aggregation
		* Alters the metric stream:
		*  Alters the {@link Aggregation} of the metric stream.
		* @param viewOptions.instrumentName
		* Instrument selection criteria:
		*  Original name of the Instrument(s) with wildcard support.
		* @param viewOptions.instrumentType
		* Instrument selection criteria:
		*  The original type of the Instrument(s).
		* @param viewOptions.instrumentUnit
		* Instrument selection criteria:
		*  The unit of the Instrument(s).
		* @param viewOptions.meterName
		* Instrument selection criteria:
		*  The name of the Meter. No wildcard support, name must match the meter exactly.
		* @param viewOptions.meterVersion
		* Instrument selection criteria:
		*  The version of the Meter. No wildcard support, version must match exactly.
		* @param viewOptions.meterSchemaUrl
		* Instrument selection criteria:
		*  The schema URL of the Meter. No wildcard support, schema URL must match exactly.
		*
		* @example
		* // Create a view that changes the Instrument 'my.instrument' to use to an
		* // ExplicitBucketHistogramAggregation with the boundaries [20, 30, 40]
		* new View({
		*   aggregation: new ExplicitBucketHistogramAggregation([20, 30, 40]),
		*   instrumentName: 'my.instrument'
		* })
		*/
		constructor(viewOptions) {
			validateViewOptions(viewOptions);
			if (viewOptions.attributesProcessors != null) this.attributesProcessor = (0, AttributesProcessor_1.createMultiAttributesProcessor)(viewOptions.attributesProcessors);
			else this.attributesProcessor = (0, AttributesProcessor_1.createNoopAttributesProcessor)();
			this.name = viewOptions.name;
			this.description = viewOptions.description;
			this.aggregation = (0, AggregationOption_1.toAggregation)(viewOptions.aggregation ?? { type: AggregationOption_1.AggregationType.DEFAULT });
			this.instrumentSelector = new InstrumentSelector_1.InstrumentSelector({
				name: viewOptions.instrumentName,
				type: viewOptions.instrumentType,
				unit: viewOptions.instrumentUnit
			});
			this.meterSelector = new MeterSelector_1.MeterSelector({
				name: viewOptions.meterName,
				version: viewOptions.meterVersion,
				schemaUrl: viewOptions.meterSchemaUrl
			});
			this.aggregationCardinalityLimit = viewOptions.aggregationCardinalityLimit;
		}
	};
	exports.View = View;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/MeterProvider.js
var require_MeterProvider = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MeterProvider = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const resources_1 = require_src$12();
	const MetricReader_1 = require_MetricReader();
	const MeterProviderSharedState_1 = require_MeterProviderSharedState();
	const MetricCollector_1 = require_MetricCollector();
	const View_1 = require_View();
	/**
	* This class implements the {@link MeterProvider} interface.
	*/
	var MeterProvider = class {
		_sharedState;
		_shutdown = false;
		constructor(options) {
			this._sharedState = new MeterProviderSharedState_1.MeterProviderSharedState(options?.resource ?? (0, resources_1.defaultResource)());
			if (options?.views != null && options.views.length > 0) for (const viewOption of options.views) this._sharedState.viewRegistry.addView(new View_1.View(viewOption));
			if (options?.readers != null && options.readers.length > 0) for (const metricReader of options.readers) {
				const collector = new MetricCollector_1.MetricCollector(this._sharedState, metricReader);
				metricReader.setMetricProducer(collector);
				this._sharedState.metricCollectors.push(collector);
				if (options.sdkMetricsEnabled && metricReader instanceof MetricReader_1.MetricReader) metricReader._setSelfObsMeterProvider(this);
			}
		}
		/**
		* Get a meter with the configuration of the MeterProvider.
		*/
		getMeter(name, version = "", options = {}) {
			if (this._shutdown) {
				api_1.diag.warn("A shutdown MeterProvider cannot provide a Meter");
				return (0, api_1.createNoopMeter)();
			}
			return this._sharedState.getMeterSharedState({
				name,
				version,
				schemaUrl: options.schemaUrl
			}).meter;
		}
		/**
		* Shut down the MeterProvider and all registered
		* MetricReaders.
		*
		* Returns a promise which is resolved when all flushes are complete.
		*/
		async shutdown(options) {
			if (this._shutdown) {
				api_1.diag.warn("shutdown may only be called once per MeterProvider");
				return;
			}
			this._shutdown = true;
			await Promise.all(this._sharedState.metricCollectors.map((collector) => {
				return collector.shutdown(options);
			}));
		}
		/**
		* Notifies all registered MetricReaders to flush any buffered data.
		*
		* Returns a promise which is resolved when all flushes are complete.
		*/
		async forceFlush(options) {
			if (this._shutdown) {
				api_1.diag.warn("invalid attempt to force flush after MeterProvider shutdown");
				return;
			}
			await Promise.all(this._sharedState.metricCollectors.map((collector) => {
				return collector.forceFlush(options);
			}));
		}
	};
	exports.MeterProvider = MeterProvider;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-metrics/build/src/index.js
var require_src$11 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.TimeoutError = exports.createDenyListAttributesProcessor = exports.createAllowListAttributesProcessor = exports.AggregationType = exports.MeterProvider = exports.ConsoleMetricExporter = exports.InMemoryMetricExporter = exports.PeriodicExportingMetricReader = exports.MetricReader = exports.InstrumentType = exports.DataPointType = exports.AggregationTemporality = void 0;
	var AggregationTemporality_1 = require_AggregationTemporality();
	Object.defineProperty(exports, "AggregationTemporality", {
		enumerable: true,
		get: function() {
			return AggregationTemporality_1.AggregationTemporality;
		}
	});
	var MetricData_1 = require_MetricData();
	Object.defineProperty(exports, "DataPointType", {
		enumerable: true,
		get: function() {
			return MetricData_1.DataPointType;
		}
	});
	Object.defineProperty(exports, "InstrumentType", {
		enumerable: true,
		get: function() {
			return MetricData_1.InstrumentType;
		}
	});
	var MetricReader_1 = require_MetricReader();
	Object.defineProperty(exports, "MetricReader", {
		enumerable: true,
		get: function() {
			return MetricReader_1.MetricReader;
		}
	});
	var PeriodicExportingMetricReader_1 = require_PeriodicExportingMetricReader();
	Object.defineProperty(exports, "PeriodicExportingMetricReader", {
		enumerable: true,
		get: function() {
			return PeriodicExportingMetricReader_1.PeriodicExportingMetricReader;
		}
	});
	var InMemoryMetricExporter_1 = require_InMemoryMetricExporter();
	Object.defineProperty(exports, "InMemoryMetricExporter", {
		enumerable: true,
		get: function() {
			return InMemoryMetricExporter_1.InMemoryMetricExporter;
		}
	});
	var ConsoleMetricExporter_1 = require_ConsoleMetricExporter();
	Object.defineProperty(exports, "ConsoleMetricExporter", {
		enumerable: true,
		get: function() {
			return ConsoleMetricExporter_1.ConsoleMetricExporter;
		}
	});
	var MeterProvider_1 = require_MeterProvider();
	Object.defineProperty(exports, "MeterProvider", {
		enumerable: true,
		get: function() {
			return MeterProvider_1.MeterProvider;
		}
	});
	var AggregationOption_1 = require_AggregationOption();
	Object.defineProperty(exports, "AggregationType", {
		enumerable: true,
		get: function() {
			return AggregationOption_1.AggregationType;
		}
	});
	var AttributesProcessor_1 = require_AttributesProcessor();
	Object.defineProperty(exports, "createAllowListAttributesProcessor", {
		enumerable: true,
		get: function() {
			return AttributesProcessor_1.createAllowListAttributesProcessor;
		}
	});
	Object.defineProperty(exports, "createDenyListAttributesProcessor", {
		enumerable: true,
		get: function() {
			return AttributesProcessor_1.createDenyListAttributesProcessor;
		}
	});
	var utils_1 = require_utils$5();
	Object.defineProperty(exports, "TimeoutError", {
		enumerable: true,
		get: function() {
			return utils_1.TimeoutError;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/exporter-metrics-otlp-http/build/src/OTLPMetricExporterOptions.js
var require_OTLPMetricExporterOptions = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AggregationTemporalityPreference = void 0;
	var AggregationTemporalityPreference;
	(function(AggregationTemporalityPreference) {
		AggregationTemporalityPreference[AggregationTemporalityPreference["DELTA"] = 0] = "DELTA";
		AggregationTemporalityPreference[AggregationTemporalityPreference["CUMULATIVE"] = 1] = "CUMULATIVE";
		AggregationTemporalityPreference[AggregationTemporalityPreference["LOWMEMORY"] = 2] = "LOWMEMORY";
	})(AggregationTemporalityPreference || (exports.AggregationTemporalityPreference = AggregationTemporalityPreference = {}));
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-exporter-base/build/esm/OTLPExporterBase.js
var OTLPExporterBase;
var init_OTLPExporterBase = __esmMin((() => {
	OTLPExporterBase = class {
		_delegate;
		constructor(delegate) {
			this._delegate = delegate;
		}
		/**
		* Export items.
		* @param items
		* @param resultCallback
		*/
		export(items, resultCallback) {
			this._delegate.export(items, resultCallback);
		}
		forceFlush() {
			return this._delegate.forceFlush();
		}
		shutdown() {
			return this._delegate.shutdown();
		}
		setMetrics(metrics) {
			this._delegate.setMetrics(metrics);
		}
	};
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-exporter-base/build/esm/types.js
var OTLPExporterError;
var init_types = __esmMin((() => {
	OTLPExporterError = class extends Error {
		code;
		name = "OTLPExporterError";
		data;
		constructor(message, code, data) {
			super(message);
			this.data = data;
			this.code = code;
		}
	};
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/shared-configuration.js
function validateTimeoutMillis(timeoutMillis) {
	if (Number.isFinite(timeoutMillis) && timeoutMillis > 0) return timeoutMillis;
	throw new Error(`Configuration: timeoutMillis is invalid, expected number greater than 0 (actual: '${timeoutMillis}')`);
}
function wrapStaticHeadersInFunction(headers) {
	if (headers == null) return;
	return async () => headers;
}
/**
* @param userProvidedConfiguration  Configuration options provided by the user in code.
* @param fallbackConfiguration Fallback to use when the {@link userProvidedConfiguration} does not specify an option.
* @param defaultConfiguration The defaults as defined by the exporter specification
*/
function mergeOtlpSharedConfigurationWithDefaults(userProvidedConfiguration, fallbackConfiguration, defaultConfiguration) {
	return {
		timeoutMillis: validateTimeoutMillis(userProvidedConfiguration.timeoutMillis ?? fallbackConfiguration.timeoutMillis ?? defaultConfiguration.timeoutMillis),
		concurrencyLimit: userProvidedConfiguration.concurrencyLimit ?? fallbackConfiguration.concurrencyLimit ?? defaultConfiguration.concurrencyLimit,
		compression: userProvidedConfiguration.compression ?? fallbackConfiguration.compression ?? defaultConfiguration.compression
	};
}
function getSharedConfigurationDefaults() {
	return {
		timeoutMillis: 1e4,
		concurrencyLimit: 30,
		compression: "none"
	};
}
var init_shared_configuration = __esmMin((() => {}));
//#endregion
//#region node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/legacy-node-configuration.js
var CompressionAlgorithm;
var init_legacy_node_configuration = __esmMin((() => {
	(function(CompressionAlgorithm) {
		CompressionAlgorithm["NONE"] = "none";
		CompressionAlgorithm["GZIP"] = "gzip";
	})(CompressionAlgorithm || (CompressionAlgorithm = {}));
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-exporter-base/build/esm/bounded-queue-export-promise-handler.js
/**
* Promise queue for keeping track of export promises. Finished promises will be auto-dequeued.
* Allows for awaiting all promises in the queue.
*/
function createBoundedQueueExportPromiseHandler(options) {
	return new BoundedQueueExportPromiseHandler(options.concurrencyLimit);
}
var BoundedQueueExportPromiseHandler;
var init_bounded_queue_export_promise_handler = __esmMin((() => {
	BoundedQueueExportPromiseHandler = class {
		_concurrencyLimit;
		_sendingPromises = [];
		/**
		* @param concurrencyLimit maximum promises allowed in a queue at the same time.
		*/
		constructor(concurrencyLimit) {
			this._concurrencyLimit = concurrencyLimit;
		}
		pushPromise(promise) {
			if (this.hasReachedLimit()) throw new Error("Concurrency Limit reached");
			this._sendingPromises.push(promise);
			const popPromise = () => {
				const index = this._sendingPromises.indexOf(promise);
				this._sendingPromises.splice(index, 1);
			};
			promise.then(popPromise, popPromise);
		}
		hasReachedLimit() {
			return this._sendingPromises.length >= this._concurrencyLimit;
		}
		async awaitAll() {
			await Promise.all(this._sendingPromises);
		}
	};
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-exporter-base/build/esm/logging-response-handler.js
function isPartialSuccessResponse(response) {
	return Object.prototype.hasOwnProperty.call(response, "partialSuccess");
}
/**
* Default response handler that logs a partial success to the console.
*/
function createLoggingPartialSuccessResponseHandler() {
	return { handleResponse(response) {
		if (response == null || !isPartialSuccessResponse(response) || response.partialSuccess == null || Object.keys(response.partialSuccess).length === 0) return;
		diag.warn("Received Partial Success response:", JSON.stringify(response.partialSuccess));
	} };
}
var init_logging_response_handler = __esmMin((() => {
	init_esm$2();
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-exporter-base/build/esm/otlp-export-delegate.js
/**
* Creates a generic delegate for OTLP exports which only contains parts of the OTLP export that are shared across all
* signals.
*/
function createOtlpExportDelegate(components, settings) {
	return new OTLPExportDelegate(components.transport, components.serializer, createLoggingPartialSuccessResponseHandler(), components.promiseHandler, components.metrics, settings.timeout);
}
var import_src$13, OTLPExportDelegate;
var init_otlp_export_delegate = __esmMin((() => {
	import_src$13 = /* @__PURE__ */ __toESM(require_src$13());
	init_types();
	init_logging_response_handler();
	init_esm$2();
	OTLPExportDelegate = class {
		_metrics;
		_diagLogger;
		_transport;
		_serializer;
		_responseHandler;
		_promiseQueue;
		_timeout;
		constructor(transport, serializer, responseHandler, promiseQueue, metrics, timeout) {
			this._transport = transport;
			this._serializer = serializer;
			this._responseHandler = responseHandler;
			this._promiseQueue = promiseQueue;
			this._timeout = timeout;
			this._diagLogger = diag.createComponentLogger({ namespace: "OTLPExportDelegate" });
			this._metrics = metrics;
		}
		export(internalRepresentation, resultCallback) {
			this._diagLogger.debug("items to be sent", internalRepresentation);
			if (this._promiseQueue.hasReachedLimit()) {
				resultCallback({
					code: import_src$13.ExportResultCode.FAILED,
					error: /* @__PURE__ */ new Error("Concurrent export limit reached")
				});
				return;
			}
			const serializedRequest = this._serializer.serializeRequest(internalRepresentation);
			if (serializedRequest == null) {
				resultCallback({
					code: import_src$13.ExportResultCode.FAILED,
					error: /* @__PURE__ */ new Error("Nothing to send")
				});
				return;
			}
			const finishExport = this._metrics.startExport(internalRepresentation);
			this._promiseQueue.pushPromise(this._transport.send(serializedRequest, this._timeout).then((response) => {
				if (response.status === "success") {
					finishExport(void 0);
					if (response.data != null) try {
						this._responseHandler.handleResponse(this._serializer.deserializeResponse(response.data));
					} catch (e) {
						this._diagLogger.warn("Export succeeded but could not deserialize response - is the response specification compliant?", e, response.data);
					}
					resultCallback({ code: import_src$13.ExportResultCode.SUCCESS });
					return;
				} else if (response.status === "failure" && response.error) {
					finishExport(response.error);
					resultCallback({
						code: import_src$13.ExportResultCode.FAILED,
						error: response.error
					});
					return;
				} else if (response.status === "retryable") {
					finishExport("export_max_retries");
					resultCallback({
						code: import_src$13.ExportResultCode.FAILED,
						error: response.error ?? new OTLPExporterError("Export failed with retryable status")
					});
				} else {
					finishExport("export_failed");
					resultCallback({
						code: import_src$13.ExportResultCode.FAILED,
						error: new OTLPExporterError("Export failed with unknown error")
					});
				}
			}, (reason) => {
				finishExport(reason);
				resultCallback({
					code: import_src$13.ExportResultCode.FAILED,
					error: reason
				});
			}));
		}
		forceFlush() {
			return this._promiseQueue.awaitAll();
		}
		setMetrics(metrics) {
			this._metrics = metrics;
		}
		async shutdown() {
			this._diagLogger.debug("shutdown started");
			await this.forceFlush();
			this._transport.shutdown();
		}
	};
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-exporter-base/build/esm/otlp-network-export-delegate.js
function createOtlpNetworkExportDelegate(options, serializer, metrics, transport) {
	return createOtlpExportDelegate({
		transport,
		serializer,
		promiseHandler: createBoundedQueueExportPromiseHandler(options),
		metrics
	}, { timeout: options.timeoutMillis });
}
var init_otlp_network_export_delegate = __esmMin((() => {
	init_bounded_queue_export_promise_handler();
	init_otlp_export_delegate();
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-exporter-base/build/esm/semconv.js
var ATTR_HTTP_RESPONSE_STATUS_CODE, ATTR_OTEL_COMPONENT_NAME, ATTR_OTEL_COMPONENT_TYPE, ATTR_SERVER_ADDRESS, ATTR_SERVER_PORT, ATTR_ERROR_TYPE;
var init_semconv = __esmMin((() => {
	ATTR_HTTP_RESPONSE_STATUS_CODE = "http.response.status_code";
	ATTR_OTEL_COMPONENT_NAME = "otel.component.name";
	ATTR_OTEL_COMPONENT_TYPE = "otel.component.type";
	ATTR_SERVER_ADDRESS = "server.address";
	ATTR_SERVER_PORT = "server.port";
	ATTR_ERROR_TYPE = "error.type";
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-exporter-base/build/esm/version.js
var VERSION;
var init_version = __esmMin((() => {
	VERSION = "0.221.0";
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-exporter-base/build/esm/ExporterMetrics.js
var import_src$12, componentCounter, ExporterMetrics;
var init_ExporterMetrics = __esmMin((() => {
	init_esm$2();
	import_src$12 = /* @__PURE__ */ __toESM(require_src$13());
	init_semconv();
	init_version();
	componentCounter = /* @__PURE__ */ new Map();
	ExporterMetrics = class {
		inflight;
		exported;
		duration;
		standardAttrs;
		responseAttributesFromError;
		helper;
		constructor(options) {
			const { componentType, metricsHelper, meterProvider, url, responseAttributesFromError } = options;
			this.responseAttributesFromError = responseAttributesFromError;
			const meter = meterProvider ? meterProvider.getMeter("@opentelemetry/otlp-exporter", VERSION) : createNoopMeter();
			const counter = componentCounter.get(componentType) ?? 0;
			componentCounter.set(componentType, counter + 1);
			this.standardAttrs = {
				[ATTR_OTEL_COMPONENT_TYPE]: componentType,
				[ATTR_OTEL_COMPONENT_NAME]: `${componentType}/${counter}`
			};
			if (url) {
				let urlToParse = url;
				if (!url.includes("://")) urlToParse = `http://${url}`;
				try {
					const parsedUrl = new URL(urlToParse);
					this.standardAttrs[ATTR_SERVER_ADDRESS] = parsedUrl.hostname;
					let port = void 0;
					if (parsedUrl.port) port = Number(parsedUrl.port);
					else if (parsedUrl.protocol === "http:") port = 80;
					else if (parsedUrl.protocol === "https:") port = 443;
					if (typeof port === "number") this.standardAttrs[ATTR_SERVER_PORT] = port;
				} catch {}
			}
			this.helper = metricsHelper;
			this.inflight = meter.createUpDownCounter(`otel.sdk.exporter.${this.helper.name}.inflight`, {
				unit: `{${this.helper.name}}`,
				description: `The number of ${this.helper.name}s which were passed to the exporter, but that have not been exported yet (neither successful, nor failed).`
			});
			this.exported = meter.createCounter(`otel.sdk.exporter.${this.helper.name}.exported`, {
				unit: `{${this.helper.name}}`,
				description: `The number of ${this.helper.name}s for which the export has finished, either successful or failed.`
			});
			this.duration = meter.createHistogram("otel.sdk.exporter.operation.duration", {
				unit: "s",
				description: "The duration of exporting a batch of telemetry records.",
				advice: { explicitBucketBoundaries: [] }
			});
		}
		startExport(request) {
			const numItems = this.helper.countItems(request);
			const startTime = (0, import_src$12.hrTime)();
			this.inflight.add(numItems, this.standardAttrs);
			return (error) => {
				const endTime = (0, import_src$12.hrTime)();
				this.inflight.add(-numItems, this.standardAttrs);
				const exportedAttrs = error ? {
					...this.standardAttrs,
					[ATTR_ERROR_TYPE]: error instanceof Error ? error.name : "export_failed"
				} : this.standardAttrs;
				this.exported.add(numItems, exportedAttrs);
				const durationAttrs = {
					...exportedAttrs,
					...this.responseAttributesFromError(error)
				};
				const duration = (0, import_src$12.hrTimeToMilliseconds)((0, import_src$12.hrTimeDuration)(startTime, endTime)) / 1e3;
				this.duration.record(duration, durationAttrs);
			};
		}
	};
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-exporter-base/build/esm/index.js
var esm_exports = /* @__PURE__ */ __exportAll({
	CompressionAlgorithm: () => CompressionAlgorithm,
	ExporterMetrics: () => ExporterMetrics,
	OTLPExporterBase: () => OTLPExporterBase,
	OTLPExporterError: () => OTLPExporterError,
	createOtlpNetworkExportDelegate: () => createOtlpNetworkExportDelegate,
	getSharedConfigurationDefaults: () => getSharedConfigurationDefaults,
	mergeOtlpSharedConfigurationWithDefaults: () => mergeOtlpSharedConfigurationWithDefaults
});
var init_esm = __esmMin((() => {
	init_OTLPExporterBase();
	init_types();
	init_shared_configuration();
	init_legacy_node_configuration();
	init_otlp_network_export_delegate();
	init_ExporterMetrics();
}));
//#endregion
//#region node_modules/@opentelemetry/exporter-metrics-otlp-http/build/src/OTLPMetricExporterBase.js
var require_OTLPMetricExporterBase = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.OTLPMetricExporterBase = exports.LowMemoryTemporalitySelector = exports.DeltaTemporalitySelector = exports.CumulativeTemporalitySelector = void 0;
	const core_1 = require_src$13();
	const sdk_metrics_1 = require_src$11();
	const OTLPMetricExporterOptions_1 = require_OTLPMetricExporterOptions();
	const otlp_exporter_base_1 = (init_esm(), __toCommonJS(esm_exports));
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const CumulativeTemporalitySelector = () => sdk_metrics_1.AggregationTemporality.CUMULATIVE;
	exports.CumulativeTemporalitySelector = CumulativeTemporalitySelector;
	const DeltaTemporalitySelector = (instrumentType) => {
		switch (instrumentType) {
			case sdk_metrics_1.InstrumentType.COUNTER:
			case sdk_metrics_1.InstrumentType.OBSERVABLE_COUNTER:
			case sdk_metrics_1.InstrumentType.GAUGE:
			case sdk_metrics_1.InstrumentType.HISTOGRAM:
			case sdk_metrics_1.InstrumentType.OBSERVABLE_GAUGE: return sdk_metrics_1.AggregationTemporality.DELTA;
			case sdk_metrics_1.InstrumentType.UP_DOWN_COUNTER:
			case sdk_metrics_1.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER: return sdk_metrics_1.AggregationTemporality.CUMULATIVE;
		}
	};
	exports.DeltaTemporalitySelector = DeltaTemporalitySelector;
	const LowMemoryTemporalitySelector = (instrumentType) => {
		switch (instrumentType) {
			case sdk_metrics_1.InstrumentType.COUNTER:
			case sdk_metrics_1.InstrumentType.HISTOGRAM: return sdk_metrics_1.AggregationTemporality.DELTA;
			case sdk_metrics_1.InstrumentType.GAUGE:
			case sdk_metrics_1.InstrumentType.UP_DOWN_COUNTER:
			case sdk_metrics_1.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER:
			case sdk_metrics_1.InstrumentType.OBSERVABLE_COUNTER:
			case sdk_metrics_1.InstrumentType.OBSERVABLE_GAUGE: return sdk_metrics_1.AggregationTemporality.CUMULATIVE;
		}
	};
	exports.LowMemoryTemporalitySelector = LowMemoryTemporalitySelector;
	function chooseTemporalitySelectorFromEnvironment() {
		const configuredTemporality = ((0, core_1.getStringFromEnv)("OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE") ?? "cumulative").toLowerCase();
		if (configuredTemporality === "cumulative") return exports.CumulativeTemporalitySelector;
		if (configuredTemporality === "delta") return exports.DeltaTemporalitySelector;
		if (configuredTemporality === "lowmemory") return exports.LowMemoryTemporalitySelector;
		api_1.diag.warn(`OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE is set to '${configuredTemporality}', but only 'cumulative' and 'delta' are allowed. Using default ('cumulative') instead.`);
		return exports.CumulativeTemporalitySelector;
	}
	function chooseTemporalitySelector(temporalityPreference) {
		if (temporalityPreference != null) {
			if (temporalityPreference === OTLPMetricExporterOptions_1.AggregationTemporalityPreference.DELTA) return exports.DeltaTemporalitySelector;
			else if (temporalityPreference === OTLPMetricExporterOptions_1.AggregationTemporalityPreference.LOWMEMORY) return exports.LowMemoryTemporalitySelector;
			return exports.CumulativeTemporalitySelector;
		}
		return chooseTemporalitySelectorFromEnvironment();
	}
	const DEFAULT_AGGREGATION = Object.freeze({ type: sdk_metrics_1.AggregationType.DEFAULT });
	function chooseAggregationSelector(config) {
		return config?.aggregationPreference ?? (() => DEFAULT_AGGREGATION);
	}
	var OTLPMetricExporterBase = class extends otlp_exporter_base_1.OTLPExporterBase {
		_aggregationTemporalitySelector;
		_aggregationSelector;
		constructor(delegate, config) {
			super(delegate);
			this._aggregationSelector = chooseAggregationSelector(config);
			this._aggregationTemporalitySelector = chooseTemporalitySelector(config?.temporalityPreference);
		}
		selectAggregation(instrumentType) {
			return this._aggregationSelector(instrumentType);
		}
		selectAggregationTemporality(instrumentType) {
			return this._aggregationTemporalitySelector(instrumentType);
		}
	};
	exports.OTLPMetricExporterBase = OTLPMetricExporterBase;
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/metrics/index.js
var require_metrics$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MetricsExporterMetricsHelper = void 0;
	exports.MetricsExporterMetricsHelper = {
		name: "metric_data_point",
		countItems: (request) => {
			let count = 0;
			for (const scopeMetrics of request.scopeMetrics) for (const metric of scopeMetrics.metrics) count += metric.dataPoints.length;
			return count;
		}
	};
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/trace/index.js
var require_trace$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.TraceExporterMetricsHelper = void 0;
	exports.TraceExporterMetricsHelper = {
		name: "span",
		countItems: (request) => request.length
	};
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/logs/index.js
var require_logs$3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.LogsExporterMetricsHelper = void 0;
	exports.LogsExporterMetricsHelper = {
		name: "log",
		countItems: (request) => request.length
	};
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/common/protobuf/utils.js
var require_utils$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.estimateVarintSize = void 0;
	/**
	* Estimate size of a number encoded as varint.
	* @param v value to calculate size for
	* @returns size in bytes of the varint encoding of the value
	*/
	function estimateVarintSize(v) {
		if (v < 0) return 10;
		if (v < 128) return 1;
		if (v < 16384) return 2;
		if (v < 2097152) return 3;
		if (v < 268435456) return 4;
		if (v < 34359738368) return 5;
		if (v < 4398046511104) return 6;
		if (v < 562949953421312) return 7;
		if (v < 72057594037927940) return 8;
		return 9;
	}
	exports.estimateVarintSize = estimateVarintSize;
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/common/protobuf/protobuf-writer.js
var require_protobuf_writer = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ProtobufWriter = exports.GROWING_BUFFER_DEBUG_MESSAGE = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const utils_1 = require_utils$2();
	exports.GROWING_BUFFER_DEBUG_MESSAGE = "ProtobufWriter: estimated size was too small, growing buffer.";
	/**
	* bytes reserved for length in length-delimited fields
	* using 1 to assume most length-delimited fields are small
	*/
	const RESERVED_LENGTH_BYTES = 1;
	/**
	* Primitive protobuf writer, optimized to avoid small object allocations.
	* Grows buffer dynamically if initial size is exceeded.
	*/
	var ProtobufWriter = class {
		_buffer;
		_textEncoder;
		_dataView;
		pos = 0;
		constructor(estimatedSize = 65536) {
			this._buffer = new Uint8Array(estimatedSize);
			this._textEncoder = new TextEncoder();
			this._dataView = new DataView(this._buffer.buffer, this._buffer.byteOffset);
		}
		/**
		* Ensure buffer has capacity for at least size more bytes
		*/
		_ensureCapacity(size) {
			const needed = this.pos + size;
			if (needed <= this._buffer.length) return;
			api_1.diag.debug(exports.GROWING_BUFFER_DEBUG_MESSAGE);
			let newSize = this._buffer.length * 2;
			while (newSize < needed) newSize *= 2;
			const newBuffer = new Uint8Array(newSize);
			newBuffer.set(this._buffer);
			this._buffer = newBuffer;
			this._dataView = new DataView(this._buffer.buffer, this._buffer.byteOffset);
		}
		/**
		* Get the written bytes as a Uint8Array
		*/
		finish() {
			return this._buffer.subarray(0, this.pos);
		}
		/**
		* Insert placeholder for length. Update later with {@link finishLengthDelimited}
		* Returns the position where to write the length.
		*/
		startLengthDelimited() {
			const lengthPos = this.pos;
			this._ensureCapacity(RESERVED_LENGTH_BYTES);
			this.pos += RESERVED_LENGTH_BYTES;
			return lengthPos;
		}
		/**
		* Write length varint at placeholder position and shift content forward if needed.
		* Most messages are small (< 128 bytes), so we reserve 1 byte and only shift
		* when the length needs more bytes.
		*/
		finishLengthDelimited(pos, length) {
			const v = length >>> 0;
			const varintSize = (0, utils_1.estimateVarintSize)(v);
			if (varintSize > RESERVED_LENGTH_BYTES) {
				const additionalBytes = varintSize - RESERVED_LENGTH_BYTES;
				this._ensureCapacity(additionalBytes);
				this._buffer.copyWithin(pos + varintSize, pos + RESERVED_LENGTH_BYTES, this.pos);
				this.pos += additionalBytes;
			}
			let writePos = pos;
			if (v < 128) this._buffer[writePos] = v;
			else if (v < 16384) {
				this._buffer[writePos++] = v & 127 | 128;
				this._buffer[writePos] = v >>> 7;
			} else if (v < 2097152) {
				this._buffer[writePos++] = v & 127 | 128;
				this._buffer[writePos++] = v >>> 7 & 127 | 128;
				this._buffer[writePos] = v >>> 14;
			} else if (v < 268435456) {
				this._buffer[writePos++] = v & 127 | 128;
				this._buffer[writePos++] = v >>> 7 & 127 | 128;
				this._buffer[writePos++] = v >>> 14 & 127 | 128;
				this._buffer[writePos] = v >>> 21;
			} else {
				this._buffer[writePos++] = v & 127 | 128;
				this._buffer[writePos++] = v >>> 7 & 127 | 128;
				this._buffer[writePos++] = v >>> 14 & 127 | 128;
				this._buffer[writePos++] = v >>> 21 & 127 | 128;
				this._buffer[writePos] = v >>> 28;
			}
		}
		/**
		* Write a sint32 value using zigzag encoding
		*/
		writeSint32(value) {
			this.writeVarint((value << 1 ^ value >> 31) >>> 0);
		}
		/**
		* Write a signed 64-bit fixed integer (sfixed64) from a JS number.
		* Handles negative values via two's complement.
		*/
		writeSfixed64(value) {
			let low;
			let high;
			if (value >= 0) {
				low = value >>> 0;
				high = value / 4294967296 >>> 0;
			} else {
				const abs = Math.abs(value);
				low = abs >>> 0;
				high = abs / 4294967296 >>> 0;
				low = ~low >>> 0;
				high = ~high >>> 0;
				low = low + 1 >>> 0;
				if (low === 0) high = high + 1 >>> 0;
			}
			this.writeFixed64(low, high);
		}
		/**
		* Write a varint (variable-length integer)
		*/
		writeVarint(value) {
			this._ensureCapacity((0, utils_1.estimateVarintSize)(value));
			if (value >= 0 && value <= 4294967295) {
				let v = value >>> 0;
				while (v > 127) {
					this._buffer[this.pos++] = v & 127 | 128;
					v >>>= 7;
				}
				this._buffer[this.pos++] = v;
			} else {
				let low;
				let high;
				if (value >= 0) {
					low = value >>> 0;
					high = value / 4294967296 >>> 0;
				} else {
					const abs = Math.abs(value);
					low = abs >>> 0;
					high = abs / 4294967296 >>> 0;
					low = ~low >>> 0;
					high = ~high >>> 0;
					low = low + 1 >>> 0;
					if (low === 0) high = high + 1 >>> 0;
				}
				while (high > 0 || low > 127) {
					this._buffer[this.pos++] = low & 127 | 128;
					low = (low >>> 7 | high << 25) >>> 0;
					high >>>= 7;
				}
				this._buffer[this.pos++] = low & 127;
			}
		}
		/**
		* Write a 32-bit fixed integer (little-endian)
		*/
		writeFixed32(value) {
			this._ensureCapacity(4);
			const v = value >>> 0;
			this._buffer[this.pos++] = v & 255;
			this._buffer[this.pos++] = v >>> 8 & 255;
			this._buffer[this.pos++] = v >>> 16 & 255;
			this._buffer[this.pos++] = v >>> 24 & 255;
		}
		/**
		* Write a 64-bit fixed integer (little-endian)
		* @param low - Low 32 bits
		* @param high - High 32 bits
		*/
		writeFixed64(low, high) {
			this._ensureCapacity(8);
			const l = low >>> 0;
			const h = high >>> 0;
			this._buffer[this.pos++] = l & 255;
			this._buffer[this.pos++] = l >>> 8 & 255;
			this._buffer[this.pos++] = l >>> 16 & 255;
			this._buffer[this.pos++] = l >>> 24 & 255;
			this._buffer[this.pos++] = h & 255;
			this._buffer[this.pos++] = h >>> 8 & 255;
			this._buffer[this.pos++] = h >>> 16 & 255;
			this._buffer[this.pos++] = h >>> 24 & 255;
		}
		/**
		* Write length-delimited data (varint length + bytes)
		*/
		writeBytes(bytes) {
			this.writeVarint(bytes.length);
			this._ensureCapacity(bytes.length);
			this._buffer.set(bytes, this.pos);
			this.pos += bytes.length;
		}
		/**
		* Write a field key (field number + wire type)
		*/
		writeTag(fieldNumber, wireType) {
			this.writeVarint(fieldNumber << 3 | wireType);
		}
		/**
		* Write a double (64-bit IEEE 754)
		*/
		writeDouble(value) {
			this._ensureCapacity(8);
			this._dataView.setFloat64(this.pos, value, true);
			this.pos += 8;
		}
		/**
		* Write a string as UTF-8 bytes (length-delimited)
		*/
		writeString(str) {
			let isAscii = true;
			const len = str.length;
			for (let i = 0; i < len; i++) if (str.charCodeAt(i) > 127) {
				isAscii = false;
				break;
			}
			if (isAscii) {
				this.writeVarint(len);
				this._ensureCapacity(len);
				for (let i = 0; i < len; i++) this._buffer[this.pos++] = str.charCodeAt(i);
			} else {
				const bytes = this._textEncoder.encode(str);
				this.writeBytes(bytes);
			}
		}
	};
	exports.ProtobufWriter = ProtobufWriter;
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/common/hex-to-binary.js
var require_hex_to_binary = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.hexToBinary = void 0;
	function intValue(charCode) {
		if (charCode >= 48 && charCode <= 57) return charCode - 48;
		if (charCode >= 97 && charCode <= 102) return charCode - 87;
		return charCode - 55;
	}
	function hexToBinary(hexStr) {
		const buf = new Uint8Array(hexStr.length / 2);
		let offset = 0;
		for (let i = 0; i < hexStr.length; i += 2) {
			const hi = intValue(hexStr.charCodeAt(i));
			const lo = intValue(hexStr.charCodeAt(i + 1));
			buf[offset++] = hi << 4 | lo;
		}
		return buf;
	}
	exports.hexToBinary = hexToBinary;
}));
//#endregion
//#region node_modules/@opentelemetry/api-logs/build/src/types/LogRecord.js
var require_LogRecord = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SeverityNumber = void 0;
	var SeverityNumber;
	(function(SeverityNumber) {
		SeverityNumber[SeverityNumber["UNSPECIFIED"] = 0] = "UNSPECIFIED";
		SeverityNumber[SeverityNumber["TRACE"] = 1] = "TRACE";
		SeverityNumber[SeverityNumber["TRACE2"] = 2] = "TRACE2";
		SeverityNumber[SeverityNumber["TRACE3"] = 3] = "TRACE3";
		SeverityNumber[SeverityNumber["TRACE4"] = 4] = "TRACE4";
		SeverityNumber[SeverityNumber["DEBUG"] = 5] = "DEBUG";
		SeverityNumber[SeverityNumber["DEBUG2"] = 6] = "DEBUG2";
		SeverityNumber[SeverityNumber["DEBUG3"] = 7] = "DEBUG3";
		SeverityNumber[SeverityNumber["DEBUG4"] = 8] = "DEBUG4";
		SeverityNumber[SeverityNumber["INFO"] = 9] = "INFO";
		SeverityNumber[SeverityNumber["INFO2"] = 10] = "INFO2";
		SeverityNumber[SeverityNumber["INFO3"] = 11] = "INFO3";
		SeverityNumber[SeverityNumber["INFO4"] = 12] = "INFO4";
		SeverityNumber[SeverityNumber["WARN"] = 13] = "WARN";
		SeverityNumber[SeverityNumber["WARN2"] = 14] = "WARN2";
		SeverityNumber[SeverityNumber["WARN3"] = 15] = "WARN3";
		SeverityNumber[SeverityNumber["WARN4"] = 16] = "WARN4";
		SeverityNumber[SeverityNumber["ERROR"] = 17] = "ERROR";
		SeverityNumber[SeverityNumber["ERROR2"] = 18] = "ERROR2";
		SeverityNumber[SeverityNumber["ERROR3"] = 19] = "ERROR3";
		SeverityNumber[SeverityNumber["ERROR4"] = 20] = "ERROR4";
		SeverityNumber[SeverityNumber["FATAL"] = 21] = "FATAL";
		SeverityNumber[SeverityNumber["FATAL2"] = 22] = "FATAL2";
		SeverityNumber[SeverityNumber["FATAL3"] = 23] = "FATAL3";
		SeverityNumber[SeverityNumber["FATAL4"] = 24] = "FATAL4";
	})(SeverityNumber || (exports.SeverityNumber = SeverityNumber = {}));
}));
//#endregion
//#region node_modules/@opentelemetry/api-logs/build/src/NoopLogger.js
var require_NoopLogger = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createNoopLogger = exports.NOOP_LOGGER = exports.NoopLogger = void 0;
	var NoopLogger = class {
		emit(_logRecord) {}
		enabled() {
			return false;
		}
	};
	exports.NoopLogger = NoopLogger;
	exports.NOOP_LOGGER = new NoopLogger();
	/**
	* Create a no-op Logger
	*/
	function createNoopLogger() {
		return exports.NOOP_LOGGER;
	}
	exports.createNoopLogger = createNoopLogger;
}));
//#endregion
//#region node_modules/@opentelemetry/api-logs/build/src/internal/global-utils.js
var require_global_utils = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.API_BACKWARDS_COMPATIBILITY_VERSION = exports.makeGetter = exports._global = exports.GLOBAL_LOGS_API_KEY = void 0;
	exports.GLOBAL_LOGS_API_KEY = Symbol.for("io.opentelemetry.js.api.logs");
	exports._global = globalThis;
	/**
	* Make a function which accepts a version integer and returns the instance of an API if the version
	* is compatible, or a fallback version (usually NOOP) if it is not.
	*
	* @param requiredVersion Backwards compatibility version which is required to return the instance
	* @param instance Instance which should be returned if the required version is compatible
	* @param fallback Fallback instance, usually NOOP, which will be returned if the required version is not compatible
	*/
	function makeGetter(requiredVersion, instance, fallback) {
		return (version) => version === requiredVersion ? instance : fallback;
	}
	exports.makeGetter = makeGetter;
	/**
	* A number which should be incremented each time a backwards incompatible
	* change is made to the API. This number is used when an API package
	* attempts to access the global API to ensure it is getting a compatible
	* version. If the global API is not compatible with the API package
	* attempting to get it, a NOOP API implementation will be returned.
	*/
	exports.API_BACKWARDS_COMPATIBILITY_VERSION = 1;
}));
//#endregion
//#region node_modules/@opentelemetry/api-logs/build/src/NoopLoggerProvider.js
var require_NoopLoggerProvider = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.NOOP_LOGGER_PROVIDER = exports.NoopLoggerProvider = void 0;
	const NoopLogger_1 = require_NoopLogger();
	var NoopLoggerProvider = class {
		getLogger(_name, _version, _options) {
			return new NoopLogger_1.NoopLogger();
		}
	};
	exports.NoopLoggerProvider = NoopLoggerProvider;
	exports.NOOP_LOGGER_PROVIDER = new NoopLoggerProvider();
}));
//#endregion
//#region node_modules/@opentelemetry/api-logs/build/src/ProxyLogger.js
var require_ProxyLogger = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ProxyLogger = void 0;
	const NoopLogger_1 = require_NoopLogger();
	var ProxyLogger = class {
		constructor(provider, name, version, options) {
			this._provider = provider;
			this.name = name;
			this.version = version;
			this.options = options;
		}
		/**
		* Emit a log record. This method should only be used by log appenders.
		*
		* @param logRecord
		*/
		emit(logRecord) {
			this._getLogger().emit(logRecord);
		}
		enabled(options) {
			return this._getLogger().enabled(options);
		}
		/**
		* Try to get a logger from the proxy logger provider.
		* If the proxy logger provider has no delegate, return a noop logger.
		*/
		_getLogger() {
			if (this._delegate) return this._delegate;
			const logger = this._provider._getDelegateLogger(this.name, this.version, this.options);
			if (!logger) return NoopLogger_1.NOOP_LOGGER;
			this._delegate = logger;
			return this._delegate;
		}
	};
	exports.ProxyLogger = ProxyLogger;
}));
//#endregion
//#region node_modules/@opentelemetry/api-logs/build/src/ProxyLoggerProvider.js
var require_ProxyLoggerProvider = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ProxyLoggerProvider = void 0;
	const NoopLoggerProvider_1 = require_NoopLoggerProvider();
	const ProxyLogger_1 = require_ProxyLogger();
	var ProxyLoggerProvider = class {
		getLogger(name, version, options) {
			var _a;
			return (_a = this._getDelegateLogger(name, version, options)) !== null && _a !== void 0 ? _a : new ProxyLogger_1.ProxyLogger(this, name, version, options);
		}
		/**
		* Get the delegate logger provider.
		* Used by tests only.
		* @internal
		*/
		_getDelegate() {
			var _a;
			return (_a = this._delegate) !== null && _a !== void 0 ? _a : NoopLoggerProvider_1.NOOP_LOGGER_PROVIDER;
		}
		/**
		* Set the delegate logger provider
		* @internal
		*/
		_setDelegate(delegate) {
			this._delegate = delegate;
		}
		/**
		* @internal
		*/
		_getDelegateLogger(name, version, options) {
			var _a;
			return (_a = this._delegate) === null || _a === void 0 ? void 0 : _a.getLogger(name, version, options);
		}
	};
	exports.ProxyLoggerProvider = ProxyLoggerProvider;
}));
//#endregion
//#region node_modules/@opentelemetry/api-logs/build/src/api/logs.js
var require_logs$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.LogsAPI = void 0;
	const global_utils_1 = require_global_utils();
	const NoopLoggerProvider_1 = require_NoopLoggerProvider();
	const ProxyLoggerProvider_1 = require_ProxyLoggerProvider();
	exports.LogsAPI = class LogsAPI {
		constructor() {
			this._proxyLoggerProvider = new ProxyLoggerProvider_1.ProxyLoggerProvider();
		}
		static getInstance() {
			if (!this._instance) this._instance = new LogsAPI();
			return this._instance;
		}
		setGlobalLoggerProvider(provider) {
			if (global_utils_1._global[global_utils_1.GLOBAL_LOGS_API_KEY]) return this.getLoggerProvider();
			global_utils_1._global[global_utils_1.GLOBAL_LOGS_API_KEY] = (0, global_utils_1.makeGetter)(global_utils_1.API_BACKWARDS_COMPATIBILITY_VERSION, provider, NoopLoggerProvider_1.NOOP_LOGGER_PROVIDER);
			this._proxyLoggerProvider._setDelegate(provider);
			return provider;
		}
		/**
		* Returns the global logger provider.
		*
		* @returns LoggerProvider
		*/
		getLoggerProvider() {
			var _a, _b;
			return (_b = (_a = global_utils_1._global[global_utils_1.GLOBAL_LOGS_API_KEY]) === null || _a === void 0 ? void 0 : _a.call(global_utils_1._global, global_utils_1.API_BACKWARDS_COMPATIBILITY_VERSION)) !== null && _b !== void 0 ? _b : this._proxyLoggerProvider;
		}
		/**
		* Returns a Logger, creating one if one with the given name, version,
		* schemaUrl, and attributes is not already created.
		*
		* Getting a Logger may be expensive, especially when `attributes` are
		* provided. Reuse Logger instances where possible instead of calling
		* `getLogger()` on hot paths.
		*
		* @param name The name of the logger or instrumentation library.
		* @param version The version of the logger or instrumentation library.
		* @param options The options of the logger or instrumentation library.
		* @returns {@link Logger}
		*/
		getLogger(name, version, options) {
			return this.getLoggerProvider().getLogger(name, version, options);
		}
		/** Remove the global logger provider */
		disable() {
			delete global_utils_1._global[global_utils_1.GLOBAL_LOGS_API_KEY];
			this._proxyLoggerProvider = new ProxyLoggerProvider_1.ProxyLoggerProvider();
		}
	};
}));
//#endregion
//#region node_modules/@opentelemetry/api-logs/build/src/index.js
var require_src$10 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.logs = exports.createNoopLogger = exports.SeverityNumber = void 0;
	var LogRecord_1 = require_LogRecord();
	Object.defineProperty(exports, "SeverityNumber", {
		enumerable: true,
		get: function() {
			return LogRecord_1.SeverityNumber;
		}
	});
	var NoopLogger_1 = require_NoopLogger();
	Object.defineProperty(exports, "createNoopLogger", {
		enumerable: true,
		get: function() {
			return NoopLogger_1.createNoopLogger;
		}
	});
	exports.logs = require_logs$2().LogsAPI.getInstance();
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/common/protobuf/common-serializer.js
var require_common_serializer = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.writeResource = exports.writeInstrumentationScope = exports.writeAnyValue = exports.writeKeyValue = exports.writeAttributes = exports.writeHrTimeAsFixed64 = void 0;
	/**
	* Write HrTime [seconds, nanoseconds] directly as fixed64 to the serializer.
	* Converts to nanoseconds and writes as 64-bit little-endian integer without allocations.
	*
	* HrTime represents: total_nanos = seconds * 1_000_000_000 + nanoseconds
	* We need to split this into low (bits 0-31) and high (bits 32-63).
	*
	* @param serializer - The protobuf writer
	* @param hrTime - HrTime tuple [seconds, nanoseconds]
	*/
	function writeHrTimeAsFixed64(serializer, hrTime) {
		const seconds = hrTime[0];
		const nanos = hrTime[1];
		const nanosPerSecond = 1e9;
		const secondsLower16Bits = seconds & 65535;
		const secondsUpperBits = seconds / 65536 >>> 0;
		const nanosFromLower16Bits = secondsLower16Bits * nanosPerSecond;
		const nanosFromUpperBits = secondsUpperBits * nanosPerSecond;
		const lower16ContributionLow32 = nanosFromLower16Bits >>> 0;
		const lower16ContributionHigh32 = Math.floor(nanosFromLower16Bits / 4294967296);
		const upperBitsContributionLow32 = (nanosFromUpperBits & 65535) * 65536 >>> 0;
		const upperBitsContributionHigh32 = nanosFromUpperBits / 65536 >>> 0;
		const low32WithCarry = lower16ContributionLow32 + upperBitsContributionLow32 + nanos;
		const totalLow = low32WithCarry >>> 0;
		const carry = Math.floor(low32WithCarry / 4294967296);
		const totalHigh = lower16ContributionHigh32 + upperBitsContributionHigh32 + carry >>> 0;
		serializer.writeFixed64(totalLow, totalHigh);
	}
	exports.writeHrTimeAsFixed64 = writeHrTimeAsFixed64;
	/**
	* Write Attributes directly to protobuf as repeated KeyValue
	*/
	function writeAttributes(writer, attributes, fieldNumber) {
		for (const key in attributes) {
			if (!Object.prototype.hasOwnProperty.call(attributes, key)) continue;
			const value = attributes[key];
			writer.writeTag(fieldNumber, 2);
			const kvStart = writer.startLengthDelimited();
			const startPos = writer.pos;
			writeKeyValue(writer, key, value);
			writer.finishLengthDelimited(kvStart, writer.pos - startPos);
		}
	}
	exports.writeAttributes = writeAttributes;
	/**
	* Write a KeyValue pair directly to protobuf
	*/
	function writeKeyValue(writer, key, value) {
		writer.writeTag(1, 2);
		writer.writeString(key);
		writer.writeTag(2, 2);
		const valueStart = writer.startLengthDelimited();
		const startPos = writer.pos;
		writeAnyValue(writer, value);
		writer.finishLengthDelimited(valueStart, writer.pos - startPos);
	}
	exports.writeKeyValue = writeKeyValue;
	const MIN_64_BIT_INT = -(2 ** 63);
	const MAX_64_BIT_INT = 2 ** 63;
	/**
	* Write an AnyValue directly from raw attribute value to protobuf
	*/
	function writeAnyValue(writer, value) {
		const t = typeof value;
		if (t === "string") {
			writer.writeTag(1, 2);
			writer.writeString(value);
		} else if (t === "boolean") {
			writer.writeTag(2, 0);
			writer.writeVarint(value ? 1 : 0);
		} else if (t === "number") {
			const numValue = value;
			if (Number.isInteger(numValue) && numValue >= MIN_64_BIT_INT && numValue < MAX_64_BIT_INT) {
				writer.writeTag(3, 0);
				writer.writeVarint(numValue);
			} else {
				writer.writeTag(4, 1);
				writer.writeDouble(numValue);
			}
		} else if (value instanceof Uint8Array) {
			writer.writeTag(7, 2);
			writer.writeBytes(value);
		} else if (Array.isArray(value)) {
			writer.writeTag(5, 2);
			const arrayStart = writer.startLengthDelimited();
			const arrayStartPos = writer.pos;
			for (const item of value) {
				writer.writeTag(1, 2);
				const itemStart = writer.startLengthDelimited();
				const itemStartPos = writer.pos;
				writeAnyValue(writer, item);
				writer.finishLengthDelimited(itemStart, writer.pos - itemStartPos);
			}
			writer.finishLengthDelimited(arrayStart, writer.pos - arrayStartPos);
		} else if (t === "object" && value != null) {
			writer.writeTag(6, 2);
			const kvlistStart = writer.startLengthDelimited();
			const kvlistStartPos = writer.pos;
			const obj = value;
			for (const k in obj) {
				if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
				const v = obj[k];
				writer.writeTag(1, 2);
				const kvStart = writer.startLengthDelimited();
				const kvStartPos = writer.pos;
				writer.writeTag(1, 2);
				writer.writeString(k);
				writer.writeTag(2, 2);
				const valueStart = writer.startLengthDelimited();
				const valueStartPos = writer.pos;
				writeAnyValue(writer, v);
				writer.finishLengthDelimited(valueStart, writer.pos - valueStartPos);
				writer.finishLengthDelimited(kvStart, writer.pos - kvStartPos);
			}
			writer.finishLengthDelimited(kvlistStart, writer.pos - kvlistStartPos);
		}
	}
	exports.writeAnyValue = writeAnyValue;
	/**
	* Write an InstrumentationScope message.
	*
	* Proto fields (InstrumentationScope):
	*   1  name     string  (wire type 2)
	*   2  version  string  (wire type 2)
	*/
	function writeInstrumentationScope(writer, scope, fieldNumber) {
		writer.writeTag(fieldNumber, 2);
		const start = writer.startLengthDelimited();
		const startPos = writer.pos;
		writer.writeTag(1, 2);
		writer.writeString(scope.name);
		if (scope.version) {
			writer.writeTag(2, 2);
			writer.writeString(scope.version);
		}
		if (scope.attributes) writeAttributes(writer, scope.attributes, 3);
		if (scope.droppedAttributesCount) {
			writer.writeTag(4, 0);
			writer.writeVarint(scope.droppedAttributesCount);
		}
		writer.finishLengthDelimited(start, writer.pos - startPos);
	}
	exports.writeInstrumentationScope = writeInstrumentationScope;
	/**
	* Write a Resource message and its enclosing tag.
	*
	* Proto fields (Resource):
	*   1  attributes                repeated KeyValue  (wire type 2)
	*   2  dropped_attributes_count  uint32             (wire type 0)
	*/
	function writeResource(writer, resource, fieldNumber) {
		writer.writeTag(fieldNumber, 2);
		const resourceStart = writer.startLengthDelimited();
		const resourceStartPos = writer.pos;
		if (resource.attributes) writeAttributes(writer, resource.attributes, 1);
		writer.writeTag(2, 0);
		writer.writeVarint(0);
		writer.finishLengthDelimited(resourceStart, writer.pos - resourceStartPos);
	}
	exports.writeResource = writeResource;
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/common/protobuf/protobuf-size-estimator.js
var require_protobuf_size_estimator = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ProtobufSizeEstimator = void 0;
	const utils_1 = require_utils$2();
	/**
	* Calculate UTF-8 byte length without encoding
	* @param str valid UTF-16 string
	*/
	function utf8ByteLength(str) {
		const len = str.length;
		let byteLen = 0;
		for (let i = 0; i < len; i++) {
			const code = str.charCodeAt(i);
			if (code < 128) byteLen += 1;
			else if (code < 2048) byteLen += 2;
			else if (code < 55296 || code >= 57344) byteLen += 3;
			else {
				i++;
				byteLen += 4;
			}
		}
		return byteLen;
	}
	/**
	* Size estimator for protobuf messages.
	* Implements the same interface as ProtobufWriter but only counts bytes without allocating a buffer.
	* @internal
	*/
	var ProtobufSizeEstimator = class {
		pos = 0;
		startLengthDelimited() {
			return this.pos;
		}
		finishLengthDelimited(_, length) {
			this.pos += (0, utils_1.estimateVarintSize)(length);
		}
		writeVarint(value) {
			this.pos += (0, utils_1.estimateVarintSize)(value);
		}
		writeSint32(value) {
			this.pos += (0, utils_1.estimateVarintSize)((value << 1 ^ value >> 31) >>> 0);
		}
		writeSfixed64(_value) {
			this.pos += 8;
		}
		writeFixed32(_value) {
			this.pos += 4;
		}
		writeFixed64(_low, _high) {
			this.pos += 8;
		}
		writeBytes(bytes) {
			this.pos += (0, utils_1.estimateVarintSize)(bytes.length);
			this.pos += bytes.length;
		}
		writeTag(fieldNumber, wireType) {
			this.writeVarint(fieldNumber << 3 | wireType);
		}
		writeDouble(_value) {
			this.pos += 8;
		}
		writeString(str) {
			const byteLen = utf8ByteLength(str);
			this.pos += (0, utils_1.estimateVarintSize)(byteLen);
			this.pos += byteLen;
		}
	};
	exports.ProtobufSizeEstimator = ProtobufSizeEstimator;
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/logs/protobuf/logs-serializer.js
var require_logs_serializer = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.serializeLogsExportRequest = void 0;
	const protobuf_writer_1 = require_protobuf_writer();
	const hex_to_binary_1 = require_hex_to_binary();
	const api_logs_1 = require_src$10();
	const common_serializer_1 = require_common_serializer();
	const protobuf_size_estimator_1 = require_protobuf_size_estimator();
	/**
	* Serialize a single LogRecord directly from ReadableLogRecord
	*/
	function serializeLogRecord(writer, logRecord) {
		const logStart = writer.startLengthDelimited();
		const logStartPos = writer.pos;
		writer.writeTag(1, 1);
		(0, common_serializer_1.writeHrTimeAsFixed64)(writer, logRecord.hrTime);
		if (logRecord.severityNumber !== void 0 && logRecord.severityNumber !== api_logs_1.SeverityNumber.UNSPECIFIED) {
			writer.writeTag(2, 0);
			writer.writeVarint(logRecord.severityNumber);
		}
		if (logRecord.severityText) {
			writer.writeTag(3, 2);
			writer.writeString(logRecord.severityText);
		}
		if (logRecord.body !== void 0) {
			writer.writeTag(5, 2);
			const bodyStart = writer.startLengthDelimited();
			const bodyStartPos = writer.pos;
			(0, common_serializer_1.writeAnyValue)(writer, logRecord.body);
			writer.finishLengthDelimited(bodyStart, writer.pos - bodyStartPos);
		}
		if (logRecord.attributes) (0, common_serializer_1.writeAttributes)(writer, logRecord.attributes, 6);
		writer.writeTag(7, 0);
		writer.writeVarint(logRecord.droppedAttributesCount);
		if (logRecord.spanContext?.traceFlags) {
			writer.writeTag(8, 5);
			writer.writeFixed32(logRecord.spanContext.traceFlags);
		}
		if (logRecord.spanContext?.traceId) {
			writer.writeTag(9, 2);
			writer.writeBytes((0, hex_to_binary_1.hexToBinary)(logRecord.spanContext.traceId));
		}
		if (logRecord.spanContext?.spanId) {
			writer.writeTag(10, 2);
			writer.writeBytes((0, hex_to_binary_1.hexToBinary)(logRecord.spanContext.spanId));
		}
		writer.writeTag(11, 1);
		(0, common_serializer_1.writeHrTimeAsFixed64)(writer, logRecord.hrTimeObserved);
		if (logRecord.eventName) {
			writer.writeTag(12, 2);
			writer.writeString(logRecord.eventName);
		}
		writer.finishLengthDelimited(logStart, writer.pos - logStartPos);
	}
	/**
	* Serialize ScopeLogs directly from SDK types
	*/
	function serializeScopeLogs(writer, scope, logRecords) {
		const scopeLogsStart = writer.startLengthDelimited();
		const scopeLogsStartPos = writer.pos;
		(0, common_serializer_1.writeInstrumentationScope)(writer, scope, 1);
		for (const logRecord of logRecords) {
			writer.writeTag(2, 2);
			serializeLogRecord(writer, logRecord);
		}
		if (scope.schemaUrl) {
			writer.writeTag(3, 2);
			writer.writeString(scope.schemaUrl);
		}
		writer.finishLengthDelimited(scopeLogsStart, writer.pos - scopeLogsStartPos);
	}
	/**
	* Serialize ResourceLogs directly from SDK Resource type
	*/
	function serializeResourceLogs(writer, resource, scopeMap) {
		const resourceLogsStart = writer.startLengthDelimited();
		const resourceLogsStartPos = writer.pos;
		(0, common_serializer_1.writeResource)(writer, resource, 1);
		for (const scopeLogs of scopeMap.values()) {
			writer.writeTag(2, 2);
			const scope = scopeLogs[0].instrumentationScope;
			serializeScopeLogs(writer, scope, scopeLogs);
		}
		if (resource.schemaUrl) {
			writer.writeTag(3, 2);
			writer.writeString(resource.schemaUrl);
		}
		writer.finishLengthDelimited(resourceLogsStart, writer.pos - resourceLogsStartPos);
	}
	/**
	* Group log records by resource and instrumentation scope
	*/
	function createResourceMap(logRecords) {
		const resourceMap = /* @__PURE__ */ new Map();
		for (const record of logRecords) {
			const resource = record.resource;
			const scope = record.instrumentationScope;
			let ismMap = resourceMap.get(resource);
			if (!ismMap) {
				ismMap = /* @__PURE__ */ new Map();
				resourceMap.set(resource, ismMap);
			}
			let records = ismMap.get(scope);
			if (!records) {
				records = [];
				ismMap.set(scope, records);
			}
			records.push(record);
		}
		return resourceMap;
	}
	/**
	* Serialize ExportLogsServiceRequest directly from ReadableLogRecord[]
	*/
	function serializeLogsExportRequest(logRecords) {
		const resourceMap = createResourceMap(logRecords);
		const estimator = new protobuf_size_estimator_1.ProtobufSizeEstimator();
		for (const [resource, scopeMap] of resourceMap) {
			estimator.writeTag(1, 2);
			serializeResourceLogs(estimator, resource, scopeMap);
		}
		const writer = new protobuf_writer_1.ProtobufWriter(estimator.pos);
		for (const [resource, scopeMap] of resourceMap) {
			writer.writeTag(1, 2);
			serializeResourceLogs(writer, resource, scopeMap);
		}
		return writer.finish();
	}
	exports.serializeLogsExportRequest = serializeLogsExportRequest;
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/common/protobuf/protobuf-reader.js
var require_protobuf_reader = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ProtobufReader = void 0;
	/**
	* Minimal binary protobuf reader.
	* Only implements the wire-types that we currently need; this is not intended
	* to be a general-purpose protobuf reader.
	*
	* Since the values we parse are generally small and not very nested, it's public
	* interface does not enforce the same low-allocation philosophy that ProtobufWriter does.
	* If this is needed in the future, we should refactor this to fit the use-case.
	*/
	var ProtobufReader = class {
		pos = 0;
		_buf;
		_textDecoder;
		constructor(buf) {
			this._buf = buf;
			this._textDecoder = new TextDecoder();
		}
		isAtEnd() {
			return this.pos >= this._buf.length;
		}
		/** Read a varint and decode it as a tag, returning field number and wire type. */
		readTag() {
			const raw = this.readVarint();
			return {
				fieldNumber: raw >>> 3,
				wireType: raw & 7
			};
		}
		/**
		* Read a base-128 varint.
		* Returns a JS `number`; precision above 2^53 is silently lost.
		* Throws if the buffer is truncated mid-varint.
		*/
		readVarint() {
			let result = 0;
			let shift = 0;
			let terminated = false;
			while (this.pos < this._buf.length) {
				const b = this._buf[this.pos++];
				result += (b & 127) * Math.pow(2, shift);
				shift += 7;
				if ((b & 128) === 0) {
					terminated = true;
					break;
				}
			}
			if (!terminated) throw new Error("Truncated buffer: unexpected end of data while reading varint");
			return result;
		}
		/** Read a length-delimited byte sequence (bytes field or embedded message). */
		readBytes() {
			const len = this.readVarint();
			if (this.pos + len > this._buf.length) throw new Error(`Truncated buffer: expected ${len} bytes at position ${this.pos}, but only ${this._buf.length - this.pos} available`);
			const slice = this._buf.subarray(this.pos, this.pos + len);
			this.pos += len;
			return slice;
		}
		/** Read a length-delimited UTF-8 string. */
		readString() {
			return this._textDecoder.decode(this.readBytes());
		}
		/**
		* Skip an unknown field.
		* Handles wire types 0 (varint), 1 (64-bit), 2 (length-delimited),
		* and 5 (32-bit).
		*
		* Wire types 3 and 4 (start-group / end-group) are deprecated in proto3
		* and are not used by any OpenTelemetry proto definition. Encountering
		* them is treated as an error.
		*/
		skip(wireType) {
			switch (wireType) {
				case 0:
					this.readVarint();
					break;
				case 1:
					this.pos += 8;
					break;
				case 2:
					this.readBytes();
					break;
				case 5:
					this.pos += 4;
					break;
				default: throw new Error(`Unknown wire type ${wireType}, cannot safely skip`);
			}
		}
	};
	exports.ProtobufReader = ProtobufReader;
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/logs/protobuf/response-deserializer.js
var require_response_deserializer$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.deserializeExportLogsServiceResponse = void 0;
	const protobuf_reader_1 = require_protobuf_reader();
	/**
	* Parse an ExportLogsPartialSuccess embedded message from raw bytes.
	*
	* Field map (opentelemetry/proto/collector/logs/v1/logs_service.proto):
	*   1  rejected_log_records  int64   (varint)
	*   2  error_message         string  (length-delimited)
	*/
	function deserializePartialSuccess(data) {
		const reader = new protobuf_reader_1.ProtobufReader(data);
		const result = {};
		while (!reader.isAtEnd()) {
			const { fieldNumber, wireType } = reader.readTag();
			switch (fieldNumber) {
				case 1:
					if (wireType === 0) result.rejectedLogRecords = reader.readVarint();
					else reader.skip(wireType);
					break;
				case 2:
					if (wireType === 2) result.errorMessage = reader.readString();
					else reader.skip(wireType);
					break;
				default:
					reader.skip(wireType);
					break;
			}
		}
		return result;
	}
	/**
	* Parse an ExportLogsServiceResponse protobuf message from raw bytes.
	*
	* Field map (opentelemetry/proto/collector/logs/v1/logs_service.proto):
	*   1  partial_success  ExportLogsPartialSuccess  (length-delimited)
	*/
	function deserializeExportLogsServiceResponse(data) {
		const reader = new protobuf_reader_1.ProtobufReader(data);
		const result = {};
		while (!reader.isAtEnd()) {
			const { fieldNumber, wireType } = reader.readTag();
			switch (fieldNumber) {
				case 1:
					if (wireType === 2) result.partialSuccess = deserializePartialSuccess(reader.readBytes());
					else reader.skip(wireType);
					break;
				default:
					reader.skip(wireType);
					break;
			}
		}
		return result;
	}
	exports.deserializeExportLogsServiceResponse = deserializeExportLogsServiceResponse;
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/logs/protobuf/logs.js
var require_logs$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ProtobufLogsSerializer = void 0;
	const logs_serializer_1 = require_logs_serializer();
	const response_deserializer_1 = require_response_deserializer$2();
	exports.ProtobufLogsSerializer = {
		serializeRequest: (arg) => {
			return (0, logs_serializer_1.serializeLogsExportRequest)(arg);
		},
		deserializeResponse: (arg) => {
			return (0, response_deserializer_1.deserializeExportLogsServiceResponse)(arg);
		}
	};
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/logs/protobuf/index.js
var require_protobuf$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ProtobufLogsSerializer = void 0;
	var logs_1 = require_logs$1();
	Object.defineProperty(exports, "ProtobufLogsSerializer", {
		enumerable: true,
		get: function() {
			return logs_1.ProtobufLogsSerializer;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/metrics/protobuf/metrics-serializer.js
var require_metrics_serializer = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.serializeMetricsExportRequest = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const sdk_metrics_1 = require_src$11();
	const common_serializer_1 = require_common_serializer();
	const protobuf_size_estimator_1 = require_protobuf_size_estimator();
	const protobuf_writer_1 = require_protobuf_writer();
	/**
	* Serialize a NumberDataPoint directly from SDK DataPoint<number>
	*
	* Proto fields (NumberDataPoint):
	*   7  attributes               repeated KeyValue  (wire type 2)
	*   2  start_time_unix_nano     fixed64            (wire type 1)
	*   3  time_unix_nano           fixed64            (wire type 1)
	*   4  as_double                double             (wire type 1)
	*   6  as_int                   sfixed64           (wire type 1)
	*   5  exemplars                repeated Exemplar  (wire type 2)
	*   8  flags                    uint32             (wire type 0)
	*/
	function serializeNumberDataPoint(writer, dataPoint, valueType) {
		const start = writer.startLengthDelimited();
		const startPos = writer.pos;
		writer.writeTag(2, 1);
		(0, common_serializer_1.writeHrTimeAsFixed64)(writer, dataPoint.startTime);
		writer.writeTag(3, 1);
		(0, common_serializer_1.writeHrTimeAsFixed64)(writer, dataPoint.endTime);
		if (valueType === api_1.ValueType.INT) {
			writer.writeTag(6, 1);
			writer.writeSfixed64(dataPoint.value);
		} else {
			writer.writeTag(4, 1);
			writer.writeDouble(dataPoint.value);
		}
		if (dataPoint.attributes) (0, common_serializer_1.writeAttributes)(writer, dataPoint.attributes, 7);
		writer.finishLengthDelimited(start, writer.pos - startPos);
	}
	/**
	* Serialize a HistogramDataPoint directly from SDK DataPoint<Histogram>
	*
	* Proto fields (HistogramDataPoint):
	*   9  attributes               repeated KeyValue  (wire type 2)
	*   2  start_time_unix_nano     fixed64            (wire type 1)
	*   3  time_unix_nano           fixed64            (wire type 1)
	*   4  count                    fixed64            (wire type 1)
	*   5  sum                      optional double    (wire type 1)
	*   6  bucket_counts            repeated fixed64   (packed, wire type 2)
	*   7  explicit_bounds          repeated double    (packed, wire type 2)
	*   8  exemplars                repeated Exemplar  (wire type 2)
	*  10  flags                    uint32             (wire type 0)
	*  11  min                      optional double    (wire type 1)
	*  12  max                      optional double    (wire type 1)
	*/
	function serializeHistogramDataPoint(writer, dataPoint) {
		const start = writer.startLengthDelimited();
		const startPos = writer.pos;
		const histogram = dataPoint.value;
		writer.writeTag(2, 1);
		(0, common_serializer_1.writeHrTimeAsFixed64)(writer, dataPoint.startTime);
		writer.writeTag(3, 1);
		(0, common_serializer_1.writeHrTimeAsFixed64)(writer, dataPoint.endTime);
		writer.writeTag(4, 1);
		writer.writeFixed64(histogram.count >>> 0, histogram.count / 4294967296 >>> 0);
		if (histogram.sum !== void 0) {
			writer.writeTag(5, 1);
			writer.writeDouble(histogram.sum);
		}
		if (histogram.buckets.counts.length > 0) {
			writer.writeTag(6, 2);
			const countsStart = writer.startLengthDelimited();
			const countsStartPos = writer.pos;
			for (const count of histogram.buckets.counts) writer.writeFixed64(count >>> 0, count / 4294967296 >>> 0);
			writer.finishLengthDelimited(countsStart, writer.pos - countsStartPos);
		}
		if (histogram.buckets.boundaries.length > 0) {
			writer.writeTag(7, 2);
			const boundsStart = writer.startLengthDelimited();
			const boundsStartPos = writer.pos;
			for (const bound of histogram.buckets.boundaries) writer.writeDouble(bound);
			writer.finishLengthDelimited(boundsStart, writer.pos - boundsStartPos);
		}
		if (dataPoint.attributes) (0, common_serializer_1.writeAttributes)(writer, dataPoint.attributes, 9);
		if (histogram.min !== void 0) {
			writer.writeTag(11, 1);
			writer.writeDouble(histogram.min);
		}
		if (histogram.max !== void 0) {
			writer.writeTag(12, 1);
			writer.writeDouble(histogram.max);
		}
		writer.finishLengthDelimited(start, writer.pos - startPos);
	}
	/**
	* Serialize ExponentialHistogramDataPoint.Buckets
	*
	* Proto fields (Buckets):
	*   1  offset         sint32           (wire type 0, zigzag)
	*   2  bucket_counts  repeated uint64  (packed, wire type 2)
	*/
	function serializeExponentialBuckets(writer, offset, bucketCounts) {
		const start = writer.startLengthDelimited();
		const startPos = writer.pos;
		if (offset !== 0) {
			writer.writeTag(1, 0);
			writer.writeSint32(offset);
		}
		if (bucketCounts.length > 0) {
			writer.writeTag(2, 2);
			const bcStart = writer.startLengthDelimited();
			const bcStartPos = writer.pos;
			for (const count of bucketCounts) writer.writeVarint(count);
			writer.finishLengthDelimited(bcStart, writer.pos - bcStartPos);
		}
		writer.finishLengthDelimited(start, writer.pos - startPos);
	}
	/**
	* Serialize an ExponentialHistogramDataPoint directly from SDK DataPoint<ExponentialHistogram>
	*
	* Proto fields (ExponentialHistogramDataPoint):
	*   1  attributes               repeated KeyValue  (wire type 2)
	*   2  start_time_unix_nano     fixed64            (wire type 1)
	*   3  time_unix_nano           fixed64            (wire type 1)
	*   4  count                    fixed64            (wire type 1)
	*   5  sum                      optional double    (wire type 1)
	*   6  scale                    sint32             (wire type 0, zigzag)
	*   7  zero_count               fixed64            (wire type 1)
	*   8  positive                 Buckets            (wire type 2)
	*   9  negative                 Buckets            (wire type 2)
	*  10  flags                    uint32             (wire type 0)
	*  11  exemplars                repeated Exemplar  (wire type 2)
	*  12  min                      optional double    (wire type 1)
	*  13  max                      optional double    (wire type 1)
	*/
	function serializeExponentialHistogramDataPoint(writer, dataPoint) {
		const start = writer.startLengthDelimited();
		const startPos = writer.pos;
		const histogram = dataPoint.value;
		if (dataPoint.attributes) (0, common_serializer_1.writeAttributes)(writer, dataPoint.attributes, 1);
		writer.writeTag(2, 1);
		(0, common_serializer_1.writeHrTimeAsFixed64)(writer, dataPoint.startTime);
		writer.writeTag(3, 1);
		(0, common_serializer_1.writeHrTimeAsFixed64)(writer, dataPoint.endTime);
		writer.writeTag(4, 1);
		writer.writeFixed64(histogram.count >>> 0, histogram.count / 4294967296 >>> 0);
		if (histogram.sum !== void 0) {
			writer.writeTag(5, 1);
			writer.writeDouble(histogram.sum);
		}
		if (histogram.scale !== 0) {
			writer.writeTag(6, 0);
			writer.writeSint32(histogram.scale);
		}
		writer.writeTag(7, 1);
		writer.writeFixed64(histogram.zeroCount >>> 0, histogram.zeroCount / 4294967296 >>> 0);
		writer.writeTag(8, 2);
		serializeExponentialBuckets(writer, histogram.positive.offset, histogram.positive.bucketCounts);
		writer.writeTag(9, 2);
		serializeExponentialBuckets(writer, histogram.negative.offset, histogram.negative.bucketCounts);
		if (histogram.min !== void 0) {
			writer.writeTag(12, 1);
			writer.writeDouble(histogram.min);
		}
		if (histogram.max !== void 0) {
			writer.writeTag(13, 1);
			writer.writeDouble(histogram.max);
		}
		writer.finishLengthDelimited(start, writer.pos - startPos);
	}
	/**
	* Serialize a Metric message with its data type
	*
	* Proto fields (Metric):
	*   1  name                     string             (wire type 2)
	*   2  description              string             (wire type 2)
	*   3  unit                     string             (wire type 2)
	*   5  gauge                    Gauge              (wire type 2)
	*   7  sum                      Sum                (wire type 2)
	*   9  histogram                Histogram          (wire type 2)
	*  10  exponential_histogram    ExponentialHist    (wire type 2)
	*  11  summary                  Summary            (wire type 2)
	*/
	function serializeMetric(writer, metricData) {
		const metricStart = writer.startLengthDelimited();
		const metricStartPos = writer.pos;
		writer.writeTag(1, 2);
		writer.writeString(metricData.descriptor.name);
		if (metricData.descriptor.description) {
			writer.writeTag(2, 2);
			writer.writeString(metricData.descriptor.description);
		}
		if (metricData.descriptor.unit) {
			writer.writeTag(3, 2);
			writer.writeString(metricData.descriptor.unit);
		}
		switch (metricData.dataPointType) {
			case sdk_metrics_1.DataPointType.GAUGE:
				writer.writeTag(5, 2);
				serializeGauge(writer, metricData);
				break;
			case sdk_metrics_1.DataPointType.SUM:
				writer.writeTag(7, 2);
				serializeSum(writer, metricData);
				break;
			case sdk_metrics_1.DataPointType.HISTOGRAM:
				writer.writeTag(9, 2);
				serializeHistogramMetric(writer, metricData);
				break;
			case sdk_metrics_1.DataPointType.EXPONENTIAL_HISTOGRAM:
				writer.writeTag(10, 2);
				serializeExponentialHistogramMetric(writer, metricData);
				break;
			default:
		}
		writer.finishLengthDelimited(metricStart, writer.pos - metricStartPos);
	}
	/**
	* Proto fields (Gauge):
	*   1  data_points  repeated NumberDataPoint  (wire type 2)
	*/
	function serializeGauge(writer, metricData) {
		const start = writer.startLengthDelimited();
		const startPos = writer.pos;
		for (const dataPoint of metricData.dataPoints) {
			writer.writeTag(1, 2);
			serializeNumberDataPoint(writer, dataPoint, metricData.descriptor.valueType);
		}
		writer.finishLengthDelimited(start, writer.pos - startPos);
	}
	/**
	* Proto fields (Sum):
	*   1  data_points               repeated NumberDataPoint  (wire type 2)
	*   2  aggregation_temporality   AggregationTemporality    (wire type 0)
	*   3  is_monotonic              bool                      (wire type 0)
	*/
	function serializeSum(writer, metricData) {
		const start = writer.startLengthDelimited();
		const startPos = writer.pos;
		for (const dataPoint of metricData.dataPoints) {
			writer.writeTag(1, 2);
			serializeNumberDataPoint(writer, dataPoint, metricData.descriptor.valueType);
		}
		const temporality = toProtoAggregationTemporality(metricData.aggregationTemporality);
		if (temporality !== 0) {
			writer.writeTag(2, 0);
			writer.writeVarint(temporality);
		}
		if (metricData.isMonotonic) {
			writer.writeTag(3, 0);
			writer.writeVarint(1);
		}
		writer.finishLengthDelimited(start, writer.pos - startPos);
	}
	/**
	* Proto fields (Histogram):
	*   1  data_points               repeated HistogramDataPoint  (wire type 2)
	*   2  aggregation_temporality   AggregationTemporality       (wire type 0)
	*/
	function serializeHistogramMetric(writer, metricData) {
		const start = writer.startLengthDelimited();
		const startPos = writer.pos;
		for (const dataPoint of metricData.dataPoints) {
			writer.writeTag(1, 2);
			serializeHistogramDataPoint(writer, dataPoint);
		}
		const temporality = toProtoAggregationTemporality(metricData.aggregationTemporality);
		if (temporality !== 0) {
			writer.writeTag(2, 0);
			writer.writeVarint(temporality);
		}
		writer.finishLengthDelimited(start, writer.pos - startPos);
	}
	/**
	* Proto fields (ExponentialHistogram):
	*   1  data_points               repeated ExponentialHistogramDataPoint  (wire type 2)
	*   2  aggregation_temporality   AggregationTemporality                 (wire type 0)
	*/
	function serializeExponentialHistogramMetric(writer, metricData) {
		const start = writer.startLengthDelimited();
		const startPos = writer.pos;
		for (const dataPoint of metricData.dataPoints) {
			writer.writeTag(1, 2);
			serializeExponentialHistogramDataPoint(writer, dataPoint);
		}
		const temporality = toProtoAggregationTemporality(metricData.aggregationTemporality);
		if (temporality !== 0) {
			writer.writeTag(2, 0);
			writer.writeVarint(temporality);
		}
		writer.finishLengthDelimited(start, writer.pos - startPos);
	}
	/**
	* Serialize ScopeMetrics directly from SDK types
	*/
	function serializeScopeMetrics(writer, scopeMetrics) {
		const scopeStart = writer.startLengthDelimited();
		const scopeStartPos = writer.pos;
		(0, common_serializer_1.writeInstrumentationScope)(writer, scopeMetrics.scope, 1);
		for (const metric of scopeMetrics.metrics) {
			writer.writeTag(2, 2);
			serializeMetric(writer, metric);
		}
		if (scopeMetrics.scope.schemaUrl) {
			writer.writeTag(3, 2);
			writer.writeString(scopeMetrics.scope.schemaUrl);
		}
		writer.finishLengthDelimited(scopeStart, writer.pos - scopeStartPos);
	}
	/**
	* Serialize ResourceMetrics directly from SDK types
	*
	* Proto fields (ResourceMetrics):
	*   1  resource       Resource           (wire type 2)
	*   2  scope_metrics  repeated ScopeMetrics  (wire type 2)
	*   3  schema_url     string             (wire type 2)
	*/
	function serializeResourceMetrics(writer, resourceMetrics) {
		const start = writer.startLengthDelimited();
		const startPos = writer.pos;
		(0, common_serializer_1.writeResource)(writer, resourceMetrics.resource, 1);
		for (const scopeMetrics of resourceMetrics.scopeMetrics) {
			writer.writeTag(2, 2);
			serializeScopeMetrics(writer, scopeMetrics);
		}
		if (resourceMetrics.resource.schemaUrl) {
			writer.writeTag(3, 2);
			writer.writeString(resourceMetrics.resource.schemaUrl);
		}
		writer.finishLengthDelimited(start, writer.pos - startPos);
	}
	function toProtoAggregationTemporality(temporality) {
		switch (temporality) {
			case sdk_metrics_1.AggregationTemporality.DELTA: return 1;
			case sdk_metrics_1.AggregationTemporality.CUMULATIVE: return 2;
			default: return 0;
		}
	}
	/**
	* Serialize ExportMetricsServiceRequest directly from ResourceMetrics
	*/
	function serializeMetricsExportRequest(resourceMetrics) {
		const estimator = new protobuf_size_estimator_1.ProtobufSizeEstimator();
		estimator.writeTag(1, 2);
		serializeResourceMetrics(estimator, resourceMetrics);
		const writer = new protobuf_writer_1.ProtobufWriter(estimator.pos);
		writer.writeTag(1, 2);
		serializeResourceMetrics(writer, resourceMetrics);
		return writer.finish();
	}
	exports.serializeMetricsExportRequest = serializeMetricsExportRequest;
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/metrics/protobuf/response-deserializer.js
var require_response_deserializer$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.deserializeExportMetricsServiceResponse = void 0;
	const protobuf_reader_1 = require_protobuf_reader();
	/**
	* Parse an ExportMetricsPartialSuccess embedded message from raw bytes.
	*
	* Field map (opentelemetry/proto/collector/metrics/v1/metrics_service.proto):
	*   1  rejected_data_points  int64   (varint)
	*   2  error_message         string  (length-delimited)
	*/
	function deserializePartialSuccess(data) {
		const reader = new protobuf_reader_1.ProtobufReader(data);
		const result = {};
		while (!reader.isAtEnd()) {
			const { fieldNumber, wireType } = reader.readTag();
			switch (fieldNumber) {
				case 1:
					if (wireType === 0) result.rejectedDataPoints = reader.readVarint();
					else reader.skip(wireType);
					break;
				case 2:
					if (wireType === 2) result.errorMessage = reader.readString();
					else reader.skip(wireType);
					break;
				default:
					reader.skip(wireType);
					break;
			}
		}
		return result;
	}
	/**
	* Parse an ExportMetricsServiceResponse protobuf message from raw bytes.
	*
	* Field map (opentelemetry/proto/collector/metrics/v1/metrics_service.proto):
	*   1  partial_success  ExportMetricsPartialSuccess  (length-delimited)
	*/
	function deserializeExportMetricsServiceResponse(data) {
		const reader = new protobuf_reader_1.ProtobufReader(data);
		const result = {};
		while (!reader.isAtEnd()) {
			const { fieldNumber, wireType } = reader.readTag();
			switch (fieldNumber) {
				case 1:
					if (wireType === 2) result.partialSuccess = deserializePartialSuccess(reader.readBytes());
					else reader.skip(wireType);
					break;
				default:
					reader.skip(wireType);
					break;
			}
		}
		return result;
	}
	exports.deserializeExportMetricsServiceResponse = deserializeExportMetricsServiceResponse;
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/metrics/protobuf/metrics.js
var require_metrics$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ProtobufMetricsSerializer = void 0;
	const metrics_serializer_1 = require_metrics_serializer();
	const response_deserializer_1 = require_response_deserializer$1();
	exports.ProtobufMetricsSerializer = {
		serializeRequest: (arg) => {
			return (0, metrics_serializer_1.serializeMetricsExportRequest)(arg);
		},
		deserializeResponse: (arg) => {
			return (0, response_deserializer_1.deserializeExportMetricsServiceResponse)(arg);
		}
	};
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/metrics/protobuf/index.js
var require_protobuf$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ProtobufMetricsSerializer = void 0;
	var metrics_1 = require_metrics$1();
	Object.defineProperty(exports, "ProtobufMetricsSerializer", {
		enumerable: true,
		get: function() {
			return metrics_1.ProtobufMetricsSerializer;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/trace/protobuf/trace-serializer.js
var require_trace_serializer = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.serializeTraceExportRequest = void 0;
	const protobuf_writer_1 = require_protobuf_writer();
	const hex_to_binary_1 = require_hex_to_binary();
	const common_serializer_1 = require_common_serializer();
	const protobuf_size_estimator_1 = require_protobuf_size_estimator();
	const SPAN_FLAGS_CONTEXT_HAS_IS_REMOTE_MASK = 256;
	const SPAN_FLAGS_CONTEXT_IS_REMOTE_MASK = 512;
	function buildSpanFlags(traceFlags, isRemote) {
		let flags = traceFlags & 255 | SPAN_FLAGS_CONTEXT_HAS_IS_REMOTE_MASK;
		if (isRemote) flags |= SPAN_FLAGS_CONTEXT_IS_REMOTE_MASK;
		return flags;
	}
	/**
	* Serialize a Span.Status message
	*
	* Proto fields (Status):
	*   1  (reserved)
	*   2  message   string         (length-delimited)
	*   3  code      StatusCode     (varint)
	*/
	function serializeStatus(writer, status) {
		const statusStart = writer.startLengthDelimited();
		const statusStartPos = writer.pos;
		if (status.message) {
			writer.writeTag(2, 2);
			writer.writeString(status.message);
		}
		writer.writeTag(3, 0);
		writer.writeVarint(status.code);
		writer.finishLengthDelimited(statusStart, writer.pos - statusStartPos);
	}
	/**
	* Serialize a Span.Event message
	*
	* Proto fields (Span.Event):
	*   1  time_unix_nano           fixed64            (wire type 1)
	*   2  name                     string             (wire type 2)
	*   3  attributes               repeated KeyValue  (wire type 2)
	*   4  dropped_attributes_count uint32             (wire type 0)
	*/
	function serializeEvent(writer, event) {
		const eventStart = writer.startLengthDelimited();
		const eventStartPos = writer.pos;
		writer.writeTag(1, 1);
		(0, common_serializer_1.writeHrTimeAsFixed64)(writer, event.time);
		writer.writeTag(2, 2);
		writer.writeString(event.name);
		if (event.attributes) (0, common_serializer_1.writeAttributes)(writer, event.attributes, 3);
		writer.writeTag(4, 0);
		writer.writeVarint(event.droppedAttributesCount || 0);
		writer.finishLengthDelimited(eventStart, writer.pos - eventStartPos);
	}
	/**
	* Serialize a Span.Link message
	*
	* Proto fields (Span.Link):
	*   1  trace_id                 bytes              (wire type 2)
	*   2  span_id                  bytes              (wire type 2)
	*   3  trace_state              string             (wire type 2)
	*   4  attributes               repeated KeyValue  (wire type 2)
	*   5  dropped_attributes_count uint32             (wire type 0)
	*   6  flags                    fixed32            (wire type 5)
	*/
	function serializeLink(writer, link) {
		const linkStart = writer.startLengthDelimited();
		const linkStartPos = writer.pos;
		const context = link.context;
		writer.writeTag(1, 2);
		writer.writeBytes((0, hex_to_binary_1.hexToBinary)(context.traceId));
		writer.writeTag(2, 2);
		writer.writeBytes((0, hex_to_binary_1.hexToBinary)(context.spanId));
		const linkTraceState = context.traceState?.serialize();
		if (linkTraceState) {
			writer.writeTag(3, 2);
			writer.writeString(linkTraceState);
		}
		if (link.attributes) (0, common_serializer_1.writeAttributes)(writer, link.attributes, 4);
		writer.writeTag(5, 0);
		writer.writeVarint(link.droppedAttributesCount || 0);
		const linkFlags = buildSpanFlags(context.traceFlags, context.isRemote);
		if (linkFlags) {
			writer.writeTag(6, 5);
			writer.writeFixed32(linkFlags);
		}
		writer.finishLengthDelimited(linkStart, writer.pos - linkStartPos);
	}
	/**
	* Serialize a single Span message directly from ReadableSpan
	*
	* Proto fields (Span):
	*   1  trace_id                 bytes              (wire type 2)
	*   2  span_id                  bytes              (wire type 2)
	*   3  trace_state              string             (wire type 2)
	*   4  parent_span_id           bytes              (wire type 2)
	*   5  name                     string             (wire type 2)
	*   6  kind                     SpanKind           (wire type 0)
	*   7  start_time_unix_nano     fixed64            (wire type 1)
	*   8  end_time_unix_nano       fixed64            (wire type 1)
	*   9  attributes               repeated KeyValue  (wire type 2)
	*  10  dropped_attributes_count uint32             (wire type 0)
	*  11  events                   repeated Event     (wire type 2)
	*  12  dropped_events_count     uint32             (wire type 0)
	*  13  links                    repeated Link      (wire type 2)
	*  14  dropped_links_count      uint32             (wire type 0)
	*  15  status                   Status             (wire type 2)
	*  16  flags                    fixed32            (wire type 5)
	*/
	function serializeSpan(writer, span) {
		const spanStart = writer.startLengthDelimited();
		const spanStartPos = writer.pos;
		const ctx = span.spanContext();
		writer.writeTag(1, 2);
		writer.writeBytes((0, hex_to_binary_1.hexToBinary)(ctx.traceId));
		writer.writeTag(2, 2);
		writer.writeBytes((0, hex_to_binary_1.hexToBinary)(ctx.spanId));
		const traceState = ctx.traceState?.serialize();
		if (traceState) {
			writer.writeTag(3, 2);
			writer.writeString(traceState);
		}
		if (span.parentSpanContext?.spanId) {
			writer.writeTag(4, 2);
			writer.writeBytes((0, hex_to_binary_1.hexToBinary)(span.parentSpanContext.spanId));
		}
		writer.writeTag(5, 2);
		writer.writeString(span.name);
		const kind = span.kind == null ? 0 : span.kind + 1;
		if (kind !== 0) {
			writer.writeTag(6, 0);
			writer.writeVarint(kind);
		}
		writer.writeTag(7, 1);
		(0, common_serializer_1.writeHrTimeAsFixed64)(writer, span.startTime);
		writer.writeTag(8, 1);
		(0, common_serializer_1.writeHrTimeAsFixed64)(writer, span.endTime);
		if (span.attributes) (0, common_serializer_1.writeAttributes)(writer, span.attributes, 9);
		writer.writeTag(10, 0);
		writer.writeVarint(span.droppedAttributesCount);
		for (const event of span.events) {
			writer.writeTag(11, 2);
			serializeEvent(writer, event);
		}
		writer.writeTag(12, 0);
		writer.writeVarint(span.droppedEventsCount);
		for (const link of span.links) {
			writer.writeTag(13, 2);
			serializeLink(writer, link);
		}
		writer.writeTag(14, 0);
		writer.writeVarint(span.droppedLinksCount);
		writer.writeTag(15, 2);
		serializeStatus(writer, span.status);
		const flags = buildSpanFlags(ctx.traceFlags, span.parentSpanContext?.isRemote);
		if (flags) {
			writer.writeTag(16, 5);
			writer.writeFixed32(flags);
		}
		writer.finishLengthDelimited(spanStart, writer.pos - spanStartPos);
	}
	/**
	* Serialize ScopeSpans directly from SDK types
	*/
	function serializeScopeSpans(writer, scope, spans) {
		const scopeSpansStart = writer.startLengthDelimited();
		const scopeSpansStartPos = writer.pos;
		(0, common_serializer_1.writeInstrumentationScope)(writer, scope, 1);
		for (const span of spans) {
			writer.writeTag(2, 2);
			serializeSpan(writer, span);
		}
		if (scope.schemaUrl) {
			writer.writeTag(3, 2);
			writer.writeString(scope.schemaUrl);
		}
		writer.finishLengthDelimited(scopeSpansStart, writer.pos - scopeSpansStartPos);
	}
	/**
	* Serialize ResourceSpans directly from SDK Resource type
	*/
	function serializeResourceSpans(writer, resource, scopeMap) {
		const resourceSpansStart = writer.startLengthDelimited();
		const resourceSpansStartPos = writer.pos;
		(0, common_serializer_1.writeResource)(writer, resource, 1);
		for (const scopeSpans of scopeMap.values()) {
			writer.writeTag(2, 2);
			const scope = scopeSpans[0].instrumentationScope;
			serializeScopeSpans(writer, scope, scopeSpans);
		}
		if (resource.schemaUrl) {
			writer.writeTag(3, 2);
			writer.writeString(resource.schemaUrl);
		}
		writer.finishLengthDelimited(resourceSpansStart, writer.pos - resourceSpansStartPos);
	}
	/**
	* Group spans by resource and instrumentation scope using identity comparison
	*/
	function createResourceMap(spans) {
		const resourceMap = /* @__PURE__ */ new Map();
		for (const span of spans) {
			const resource = span.resource;
			const scope = span.instrumentationScope;
			let scopeMap = resourceMap.get(resource);
			if (!scopeMap) {
				scopeMap = /* @__PURE__ */ new Map();
				resourceMap.set(resource, scopeMap);
			}
			let records = scopeMap.get(scope);
			if (!records) {
				records = [];
				scopeMap.set(scope, records);
			}
			records.push(span);
		}
		return resourceMap;
	}
	/**
	* Serialize ExportTraceServiceRequest directly from ReadableSpan[]
	*/
	function serializeTraceExportRequest(spans) {
		const resourceMap = createResourceMap(spans);
		const estimator = new protobuf_size_estimator_1.ProtobufSizeEstimator();
		for (const [resource, scopeMap] of resourceMap) {
			estimator.writeTag(1, 2);
			serializeResourceSpans(estimator, resource, scopeMap);
		}
		const writer = new protobuf_writer_1.ProtobufWriter(estimator.pos);
		for (const [resource, scopeMap] of resourceMap) {
			writer.writeTag(1, 2);
			serializeResourceSpans(writer, resource, scopeMap);
		}
		return writer.finish();
	}
	exports.serializeTraceExportRequest = serializeTraceExportRequest;
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/trace/protobuf/response-deserializer.js
var require_response_deserializer = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.deserializeExportTraceServiceResponse = void 0;
	const protobuf_reader_1 = require_protobuf_reader();
	/**
	* Parse an ExportTracePartialSuccess embedded message from raw bytes.
	*
	* Field map (opentelemetry/proto/collector/trace/v1/trace_service.proto):
	*   1  rejected_spans   int64   (varint)
	*   2  error_message    string  (length-delimited)
	*/
	function deserializePartialSuccess(data) {
		const reader = new protobuf_reader_1.ProtobufReader(data);
		const result = {};
		while (!reader.isAtEnd()) {
			const { fieldNumber, wireType } = reader.readTag();
			switch (fieldNumber) {
				case 1:
					if (wireType === 0) result.rejectedSpans = reader.readVarint();
					else reader.skip(wireType);
					break;
				case 2:
					if (wireType === 2) result.errorMessage = reader.readString();
					else reader.skip(wireType);
					break;
				default:
					reader.skip(wireType);
					break;
			}
		}
		return result;
	}
	/**
	* Parse an ExportTraceServiceResponse protobuf message from raw bytes.
	*
	* Field map (opentelemetry/proto/collector/trace/v1/trace_service.proto):
	*   1  partial_success  ExportTracePartialSuccess  (length-delimited)
	*/
	function deserializeExportTraceServiceResponse(data) {
		const reader = new protobuf_reader_1.ProtobufReader(data);
		const result = {};
		while (!reader.isAtEnd()) {
			const { fieldNumber, wireType } = reader.readTag();
			switch (fieldNumber) {
				case 1:
					if (wireType === 2) result.partialSuccess = deserializePartialSuccess(reader.readBytes());
					else reader.skip(wireType);
					break;
				default:
					reader.skip(wireType);
					break;
			}
		}
		return result;
	}
	exports.deserializeExportTraceServiceResponse = deserializeExportTraceServiceResponse;
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/trace/protobuf/trace.js
var require_trace$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ProtobufTraceSerializer = void 0;
	const trace_serializer_1 = require_trace_serializer();
	const response_deserializer_1 = require_response_deserializer();
	exports.ProtobufTraceSerializer = {
		serializeRequest: (arg) => {
			return (0, trace_serializer_1.serializeTraceExportRequest)(arg);
		},
		deserializeResponse: (arg) => {
			return (0, response_deserializer_1.deserializeExportTraceServiceResponse)(arg);
		}
	};
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/trace/protobuf/index.js
var require_protobuf = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ProtobufTraceSerializer = void 0;
	var trace_1 = require_trace$1();
	Object.defineProperty(exports, "ProtobufTraceSerializer", {
		enumerable: true,
		get: function() {
			return trace_1.ProtobufTraceSerializer;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/common/internal.js
var require_internal$3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.toAnyValue = exports.toKeyValue = exports.toAttributes = exports.createInstrumentationScope = exports.createResource = void 0;
	function createResource(resource, encoder) {
		const result = {
			attributes: toAttributes(resource.attributes, encoder),
			droppedAttributesCount: 0
		};
		const schemaUrl = resource.schemaUrl;
		if (schemaUrl && schemaUrl !== "") result.schemaUrl = schemaUrl;
		return result;
	}
	exports.createResource = createResource;
	function createInstrumentationScope(scope, encoder) {
		const result = {
			name: scope.name,
			version: scope.version
		};
		if (scope.attributes && Object.keys(scope.attributes).length > 0) {
			result.attributes = toAttributes(scope.attributes, encoder);
			result.droppedAttributesCount = scope.droppedAttributesCount ?? 0;
		}
		return result;
	}
	exports.createInstrumentationScope = createInstrumentationScope;
	function toAttributes(attributes, encoder) {
		return Object.keys(attributes).map((key) => toKeyValue(key, attributes[key], encoder));
	}
	exports.toAttributes = toAttributes;
	function toKeyValue(key, value, encoder) {
		return {
			key,
			value: toAnyValue(value, encoder)
		};
	}
	exports.toKeyValue = toKeyValue;
	function toAnyValue(value, encoder) {
		const t = typeof value;
		if (t === "string") return { stringValue: value };
		if (t === "number") {
			if (!Number.isInteger(value)) return { doubleValue: value };
			return { intValue: value };
		}
		if (t === "boolean") return { boolValue: value };
		if (value instanceof Uint8Array) return { bytesValue: encoder.encodeUint8Array(value) };
		if (Array.isArray(value)) {
			const values = new Array(value.length);
			for (let i = 0; i < value.length; i++) values[i] = toAnyValue(value[i], encoder);
			return { arrayValue: { values } };
		}
		if (t === "object" && value != null) {
			const keys = Object.keys(value);
			const values = new Array(keys.length);
			for (let i = 0; i < keys.length; i++) values[i] = {
				key: keys[i],
				value: toAnyValue(value[keys[i]], encoder)
			};
			return { kvlistValue: { values } };
		}
		return {};
	}
	exports.toAnyValue = toAnyValue;
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/logs/internal.js
var require_internal$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createExportLogsServiceRequest = void 0;
	const internal_1 = require_internal$3();
	function createExportLogsServiceRequest(logRecords, encoder) {
		return { resourceLogs: logRecordsToResourceLogs(logRecords, encoder) };
	}
	exports.createExportLogsServiceRequest = createExportLogsServiceRequest;
	function createResourceMap(logRecords) {
		const resourceMap = /* @__PURE__ */ new Map();
		for (const record of logRecords) {
			const { resource, instrumentationScope } = record;
			let ismMap = resourceMap.get(resource);
			if (!ismMap) {
				ismMap = /* @__PURE__ */ new Map();
				resourceMap.set(resource, ismMap);
			}
			let records = ismMap.get(instrumentationScope);
			if (!records) {
				records = [];
				ismMap.set(instrumentationScope, records);
			}
			records.push(record);
		}
		return resourceMap;
	}
	function logRecordsToResourceLogs(logRecords, encoder) {
		const resourceMap = createResourceMap(logRecords);
		return Array.from(resourceMap, ([resource, ismMap]) => {
			const processedResource = (0, internal_1.createResource)(resource, encoder);
			return {
				resource: processedResource,
				scopeLogs: Array.from(ismMap, ([, scopeLogs]) => {
					return {
						scope: (0, internal_1.createInstrumentationScope)(scopeLogs[0].instrumentationScope, encoder),
						logRecords: scopeLogs.map((log) => toLogRecord(log, encoder)),
						schemaUrl: scopeLogs[0].instrumentationScope.schemaUrl
					};
				}),
				schemaUrl: processedResource.schemaUrl
			};
		});
	}
	function toLogRecord(log, encoder) {
		return {
			timeUnixNano: encoder.encodeHrTime(log.hrTime),
			observedTimeUnixNano: encoder.encodeHrTime(log.hrTimeObserved),
			severityNumber: toSeverityNumber(log.severityNumber),
			severityText: log.severityText,
			body: (0, internal_1.toAnyValue)(log.body, encoder),
			eventName: log.eventName,
			attributes: (0, internal_1.toAttributes)(log.attributes, encoder),
			droppedAttributesCount: log.droppedAttributesCount,
			flags: log.spanContext?.traceFlags,
			traceId: encoder.encodeOptionalSpanContext(log.spanContext?.traceId),
			spanId: encoder.encodeOptionalSpanContext(log.spanContext?.spanId)
		};
	}
	function toSeverityNumber(severityNumber) {
		return severityNumber;
	}
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/common/utils.js
var require_utils$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.JSON_ENCODER = exports.PROTOBUF_ENCODER = exports.encodeAsString = exports.encodeAsLongBits = exports.toLongBits = exports.hrTimeToNanos = void 0;
	const core_1 = require_src$13();
	const hex_to_binary_1 = require_hex_to_binary();
	function hrTimeToNanos(hrTime) {
		const NANOSECONDS = BigInt(1e9);
		return BigInt(Math.trunc(hrTime[0])) * NANOSECONDS + BigInt(Math.trunc(hrTime[1]));
	}
	exports.hrTimeToNanos = hrTimeToNanos;
	function toLongBits(value) {
		return {
			low: Number(BigInt.asUintN(32, value)),
			high: Number(BigInt.asUintN(32, value >> BigInt(32)))
		};
	}
	exports.toLongBits = toLongBits;
	function encodeAsLongBits(hrTime) {
		return toLongBits(hrTimeToNanos(hrTime));
	}
	exports.encodeAsLongBits = encodeAsLongBits;
	function encodeAsString(hrTime) {
		return hrTimeToNanos(hrTime).toString();
	}
	exports.encodeAsString = encodeAsString;
	const encodeTimestamp = typeof BigInt !== "undefined" ? encodeAsString : core_1.hrTimeToNanoseconds;
	function identity(value) {
		return value;
	}
	function optionalHexToBinary(str) {
		if (str === void 0) return void 0;
		return (0, hex_to_binary_1.hexToBinary)(str);
	}
	/**
	* Encoder for protobuf format.
	* Uses { high, low } timestamps and binary for span/trace IDs, leaves Uint8Array attributes as-is.
	*/
	exports.PROTOBUF_ENCODER = {
		encodeHrTime: encodeAsLongBits,
		encodeSpanContext: hex_to_binary_1.hexToBinary,
		encodeOptionalSpanContext: optionalHexToBinary,
		encodeUint8Array: identity
	};
	/**
	* Encoder for JSON format.
	* Uses string timestamps, hex for span/trace IDs, and base64 for Uint8Array.
	*/
	exports.JSON_ENCODER = {
		encodeHrTime: encodeTimestamp,
		encodeSpanContext: identity,
		encodeOptionalSpanContext: identity,
		encodeUint8Array: (bytes) => {
			if (typeof Buffer !== "undefined") return Buffer.from(bytes).toString("base64");
			const chars = new Array(bytes.length);
			for (let i = 0; i < bytes.length; i++) chars[i] = String.fromCharCode(bytes[i]);
			return btoa(chars.join(""));
		}
	};
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/logs/json/logs.js
var require_logs = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.JsonLogsSerializer = void 0;
	const internal_1 = require_internal$2();
	const utils_1 = require_utils$1();
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	exports.JsonLogsSerializer = {
		serializeRequest: (arg) => {
			const request = (0, internal_1.createExportLogsServiceRequest)(arg, utils_1.JSON_ENCODER);
			return new TextEncoder().encode(JSON.stringify(request));
		},
		deserializeResponse: (arg) => {
			if (arg.length === 0) return {};
			const decoder = new TextDecoder();
			try {
				return JSON.parse(decoder.decode(arg));
			} catch (err) {
				api_1.diag.warn(`Failed to parse logs export response: ${err.message}. Returning empty response`);
				return {};
			}
		}
	};
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/logs/json/index.js
var require_json$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.JsonLogsSerializer = void 0;
	var logs_1 = require_logs();
	Object.defineProperty(exports, "JsonLogsSerializer", {
		enumerable: true,
		get: function() {
			return logs_1.JsonLogsSerializer;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/metrics/internal-types.js
var require_internal_types = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.EAggregationTemporality = void 0;
	/**
	* AggregationTemporality defines how a metric aggregator reports aggregated
	* values. It describes how those values relate to the time interval over
	* which they are aggregated.
	*/
	var EAggregationTemporality;
	(function(EAggregationTemporality) {
		EAggregationTemporality[EAggregationTemporality["AGGREGATION_TEMPORALITY_UNSPECIFIED"] = 0] = "AGGREGATION_TEMPORALITY_UNSPECIFIED";
		/** DELTA is an AggregationTemporality for a metric aggregator which reports
		changes since last report time. Successive metrics contain aggregation of
		values from continuous and non-overlapping intervals.
		
		The values for a DELTA metric are based only on the time interval
		associated with one measurement cycle. There is no dependency on
		previous measurements like is the case for CUMULATIVE metrics.
		
		For example, consider a system measuring the number of requests that
		it receives and reports the sum of these requests every second as a
		DELTA metric:
		
		1. The system starts receiving at time=t_0.
		2. A request is received, the system measures 1 request.
		3. A request is received, the system measures 1 request.
		4. A request is received, the system measures 1 request.
		5. The 1 second collection cycle ends. A metric is exported for the
		number of requests received over the interval of time t_0 to
		t_0+1 with a value of 3.
		6. A request is received, the system measures 1 request.
		7. A request is received, the system measures 1 request.
		8. The 1 second collection cycle ends. A metric is exported for the
		number of requests received over the interval of time t_0+1 to
		t_0+2 with a value of 2. */
		EAggregationTemporality[EAggregationTemporality["AGGREGATION_TEMPORALITY_DELTA"] = 1] = "AGGREGATION_TEMPORALITY_DELTA";
		/** CUMULATIVE is an AggregationTemporality for a metric aggregator which
		reports changes since a fixed start time. This means that current values
		of a CUMULATIVE metric depend on all previous measurements since the
		start time. Because of this, the sender is required to retain this state
		in some form. If this state is lost or invalidated, the CUMULATIVE metric
		values MUST be reset and a new fixed start time following the last
		reported measurement time sent MUST be used.
		
		For example, consider a system measuring the number of requests that
		it receives and reports the sum of these requests every second as a
		CUMULATIVE metric:
		
		1. The system starts receiving at time=t_0.
		2. A request is received, the system measures 1 request.
		3. A request is received, the system measures 1 request.
		4. A request is received, the system measures 1 request.
		5. The 1 second collection cycle ends. A metric is exported for the
		number of requests received over the interval of time t_0 to
		t_0+1 with a value of 3.
		6. A request is received, the system measures 1 request.
		7. A request is received, the system measures 1 request.
		8. The 1 second collection cycle ends. A metric is exported for the
		number of requests received over the interval of time t_0 to
		t_0+2 with a value of 5.
		9. The system experiences a fault and loses state.
		10. The system recovers and resumes receiving at time=t_1.
		11. A request is received, the system measures 1 request.
		12. The 1 second collection cycle ends. A metric is exported for the
		number of requests received over the interval of time t_1 to
		t_0+1 with a value of 1.
		
		Note: Even though, when reporting changes since last report time, using
		CUMULATIVE is valid, it is not recommended. This may cause problems for
		systems that do not use start_time to determine when the aggregation
		value was reset (e.g. Prometheus). */
		EAggregationTemporality[EAggregationTemporality["AGGREGATION_TEMPORALITY_CUMULATIVE"] = 2] = "AGGREGATION_TEMPORALITY_CUMULATIVE";
	})(EAggregationTemporality || (exports.EAggregationTemporality = EAggregationTemporality = {}));
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/metrics/internal.js
var require_internal$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createExportMetricsServiceRequest = exports.toMetric = exports.toScopeMetrics = exports.toResourceMetrics = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const sdk_metrics_1 = require_src$11();
	const internal_types_1 = require_internal_types();
	const internal_1 = require_internal$3();
	function toResourceMetrics(resourceMetrics, encoder) {
		const processedResource = (0, internal_1.createResource)(resourceMetrics.resource, encoder);
		return {
			resource: processedResource,
			schemaUrl: processedResource.schemaUrl,
			scopeMetrics: toScopeMetrics(resourceMetrics.scopeMetrics, encoder)
		};
	}
	exports.toResourceMetrics = toResourceMetrics;
	function toScopeMetrics(scopeMetrics, encoder) {
		return Array.from(scopeMetrics.map((metrics) => ({
			scope: (0, internal_1.createInstrumentationScope)(metrics.scope, encoder),
			metrics: metrics.metrics.map((metricData) => toMetric(metricData, encoder)),
			schemaUrl: metrics.scope.schemaUrl
		})));
	}
	exports.toScopeMetrics = toScopeMetrics;
	function toMetric(metricData, encoder) {
		const out = {
			name: metricData.descriptor.name,
			description: metricData.descriptor.description,
			unit: metricData.descriptor.unit
		};
		const aggregationTemporality = toAggregationTemporality(metricData.aggregationTemporality);
		switch (metricData.dataPointType) {
			case sdk_metrics_1.DataPointType.SUM:
				out.sum = {
					aggregationTemporality,
					isMonotonic: metricData.isMonotonic,
					dataPoints: toSingularDataPoints(metricData, encoder)
				};
				break;
			case sdk_metrics_1.DataPointType.GAUGE:
				out.gauge = { dataPoints: toSingularDataPoints(metricData, encoder) };
				break;
			case sdk_metrics_1.DataPointType.HISTOGRAM:
				out.histogram = {
					aggregationTemporality,
					dataPoints: toHistogramDataPoints(metricData, encoder)
				};
				break;
			case sdk_metrics_1.DataPointType.EXPONENTIAL_HISTOGRAM:
				out.exponentialHistogram = {
					aggregationTemporality,
					dataPoints: toExponentialHistogramDataPoints(metricData, encoder)
				};
				break;
		}
		return out;
	}
	exports.toMetric = toMetric;
	function toSingularDataPoint(dataPoint, valueType, encoder) {
		const out = {
			attributes: (0, internal_1.toAttributes)(dataPoint.attributes, encoder),
			startTimeUnixNano: encoder.encodeHrTime(dataPoint.startTime),
			timeUnixNano: encoder.encodeHrTime(dataPoint.endTime)
		};
		switch (valueType) {
			case api_1.ValueType.INT:
				out.asInt = dataPoint.value;
				break;
			case api_1.ValueType.DOUBLE:
				out.asDouble = dataPoint.value;
				break;
		}
		return out;
	}
	function toSingularDataPoints(metricData, encoder) {
		return metricData.dataPoints.map((dataPoint) => {
			return toSingularDataPoint(dataPoint, metricData.descriptor.valueType, encoder);
		});
	}
	function toHistogramDataPoints(metricData, encoder) {
		return metricData.dataPoints.map((dataPoint) => {
			const histogram = dataPoint.value;
			return {
				attributes: (0, internal_1.toAttributes)(dataPoint.attributes, encoder),
				bucketCounts: histogram.buckets.counts,
				explicitBounds: histogram.buckets.boundaries,
				count: histogram.count,
				sum: histogram.sum,
				min: histogram.min,
				max: histogram.max,
				startTimeUnixNano: encoder.encodeHrTime(dataPoint.startTime),
				timeUnixNano: encoder.encodeHrTime(dataPoint.endTime)
			};
		});
	}
	function toExponentialHistogramDataPoints(metricData, encoder) {
		return metricData.dataPoints.map((dataPoint) => {
			const histogram = dataPoint.value;
			return {
				attributes: (0, internal_1.toAttributes)(dataPoint.attributes, encoder),
				count: histogram.count,
				min: histogram.min,
				max: histogram.max,
				sum: histogram.sum,
				positive: {
					offset: histogram.positive.offset,
					bucketCounts: histogram.positive.bucketCounts
				},
				negative: {
					offset: histogram.negative.offset,
					bucketCounts: histogram.negative.bucketCounts
				},
				scale: histogram.scale,
				zeroCount: histogram.zeroCount,
				startTimeUnixNano: encoder.encodeHrTime(dataPoint.startTime),
				timeUnixNano: encoder.encodeHrTime(dataPoint.endTime)
			};
		});
	}
	function toAggregationTemporality(temporality) {
		switch (temporality) {
			case sdk_metrics_1.AggregationTemporality.DELTA: return internal_types_1.EAggregationTemporality.AGGREGATION_TEMPORALITY_DELTA;
			case sdk_metrics_1.AggregationTemporality.CUMULATIVE: return internal_types_1.EAggregationTemporality.AGGREGATION_TEMPORALITY_CUMULATIVE;
		}
	}
	function createExportMetricsServiceRequest(resourceMetrics, encoder) {
		return { resourceMetrics: resourceMetrics.map((metrics) => toResourceMetrics(metrics, encoder)) };
	}
	exports.createExportMetricsServiceRequest = createExportMetricsServiceRequest;
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/metrics/json/metrics.js
var require_metrics = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.JsonMetricsSerializer = void 0;
	const internal_1 = require_internal$1();
	const utils_1 = require_utils$1();
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	exports.JsonMetricsSerializer = {
		serializeRequest: (arg) => {
			const request = (0, internal_1.createExportMetricsServiceRequest)([arg], utils_1.JSON_ENCODER);
			return new TextEncoder().encode(JSON.stringify(request));
		},
		deserializeResponse: (arg) => {
			if (arg.length === 0) return {};
			const decoder = new TextDecoder();
			try {
				return JSON.parse(decoder.decode(arg));
			} catch (err) {
				api_1.diag.warn(`Failed to parse metrics export response: ${err.message}. Returning empty response`);
				return {};
			}
		}
	};
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/metrics/json/index.js
var require_json$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.JsonMetricsSerializer = void 0;
	var metrics_1 = require_metrics();
	Object.defineProperty(exports, "JsonMetricsSerializer", {
		enumerable: true,
		get: function() {
			return metrics_1.JsonMetricsSerializer;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/trace/internal.js
var require_internal = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createExportTraceServiceRequest = exports.toOtlpSpanEvent = exports.toOtlpLink = exports.sdkSpanToOtlpSpan = void 0;
	const internal_1 = require_internal$3();
	const SPAN_FLAGS_CONTEXT_HAS_IS_REMOTE_MASK = 256;
	const SPAN_FLAGS_CONTEXT_IS_REMOTE_MASK = 512;
	/**
	* Builds the 32-bit span flags value combining the low 8-bit W3C TraceFlags
	* with the HAS_IS_REMOTE and IS_REMOTE bits according to the OTLP spec.
	*/
	function buildSpanFlagsFrom(traceFlags, isRemote) {
		let flags = traceFlags & 255 | SPAN_FLAGS_CONTEXT_HAS_IS_REMOTE_MASK;
		if (isRemote) flags |= SPAN_FLAGS_CONTEXT_IS_REMOTE_MASK;
		return flags;
	}
	function sdkSpanToOtlpSpan(span, encoder) {
		const ctx = span.spanContext();
		const status = span.status;
		const parentSpanId = span.parentSpanContext?.spanId ? encoder.encodeSpanContext(span.parentSpanContext?.spanId) : void 0;
		return {
			traceId: encoder.encodeSpanContext(ctx.traceId),
			spanId: encoder.encodeSpanContext(ctx.spanId),
			parentSpanId,
			traceState: ctx.traceState?.serialize(),
			name: span.name,
			kind: span.kind == null ? 0 : span.kind + 1,
			startTimeUnixNano: encoder.encodeHrTime(span.startTime),
			endTimeUnixNano: encoder.encodeHrTime(span.endTime),
			attributes: (0, internal_1.toAttributes)(span.attributes, encoder),
			droppedAttributesCount: span.droppedAttributesCount,
			events: span.events.map((event) => toOtlpSpanEvent(event, encoder)),
			droppedEventsCount: span.droppedEventsCount,
			status: {
				code: status.code,
				message: status.message
			},
			links: span.links.map((link) => toOtlpLink(link, encoder)),
			droppedLinksCount: span.droppedLinksCount,
			flags: buildSpanFlagsFrom(ctx.traceFlags, span.parentSpanContext?.isRemote)
		};
	}
	exports.sdkSpanToOtlpSpan = sdkSpanToOtlpSpan;
	function toOtlpLink(link, encoder) {
		return {
			attributes: link.attributes ? (0, internal_1.toAttributes)(link.attributes, encoder) : [],
			spanId: encoder.encodeSpanContext(link.context.spanId),
			traceId: encoder.encodeSpanContext(link.context.traceId),
			traceState: link.context.traceState?.serialize(),
			droppedAttributesCount: link.droppedAttributesCount || 0,
			flags: buildSpanFlagsFrom(link.context.traceFlags, link.context.isRemote)
		};
	}
	exports.toOtlpLink = toOtlpLink;
	function toOtlpSpanEvent(timedEvent, encoder) {
		return {
			attributes: timedEvent.attributes ? (0, internal_1.toAttributes)(timedEvent.attributes, encoder) : [],
			name: timedEvent.name,
			timeUnixNano: encoder.encodeHrTime(timedEvent.time),
			droppedAttributesCount: timedEvent.droppedAttributesCount || 0
		};
	}
	exports.toOtlpSpanEvent = toOtlpSpanEvent;
	function createExportTraceServiceRequest(spans, encoder) {
		return { resourceSpans: spanRecordsToResourceSpans(spans, encoder) };
	}
	exports.createExportTraceServiceRequest = createExportTraceServiceRequest;
	function createResourceMap(readableSpans) {
		const resourceMap = /* @__PURE__ */ new Map();
		for (const record of readableSpans) {
			let ilsMap = resourceMap.get(record.resource);
			if (!ilsMap) {
				ilsMap = /* @__PURE__ */ new Map();
				resourceMap.set(record.resource, ilsMap);
			}
			const instrumentationScopeKey = `${record.instrumentationScope.name}@${record.instrumentationScope.version || ""}:${record.instrumentationScope.schemaUrl || ""}`;
			let records = ilsMap.get(instrumentationScopeKey);
			if (!records) {
				records = [];
				ilsMap.set(instrumentationScopeKey, records);
			}
			records.push(record);
		}
		return resourceMap;
	}
	function spanRecordsToResourceSpans(readableSpans, encoder) {
		const resourceMap = createResourceMap(readableSpans);
		const out = [];
		const entryIterator = resourceMap.entries();
		let entry = entryIterator.next();
		while (!entry.done) {
			const [resource, ilmMap] = entry.value;
			const scopeResourceSpans = [];
			const ilmIterator = ilmMap.values();
			let ilmEntry = ilmIterator.next();
			while (!ilmEntry.done) {
				const scopeSpans = ilmEntry.value;
				if (scopeSpans.length > 0) {
					const spans = scopeSpans.map((readableSpan) => sdkSpanToOtlpSpan(readableSpan, encoder));
					scopeResourceSpans.push({
						scope: (0, internal_1.createInstrumentationScope)(scopeSpans[0].instrumentationScope, encoder),
						spans,
						schemaUrl: scopeSpans[0].instrumentationScope.schemaUrl
					});
				}
				ilmEntry = ilmIterator.next();
			}
			const processedResource = (0, internal_1.createResource)(resource, encoder);
			const transformedSpans = {
				resource: processedResource,
				scopeSpans: scopeResourceSpans,
				schemaUrl: processedResource.schemaUrl
			};
			out.push(transformedSpans);
			entry = entryIterator.next();
		}
		return out;
	}
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/trace/json/trace.js
var require_trace = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.JsonTraceSerializer = void 0;
	const internal_1 = require_internal();
	const utils_1 = require_utils$1();
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	exports.JsonTraceSerializer = {
		serializeRequest: (arg) => {
			const request = (0, internal_1.createExportTraceServiceRequest)(arg, utils_1.JSON_ENCODER);
			return new TextEncoder().encode(JSON.stringify(request));
		},
		deserializeResponse: (arg) => {
			if (arg.length === 0) return {};
			const decoder = new TextDecoder();
			try {
				return JSON.parse(decoder.decode(arg));
			} catch (err) {
				api_1.diag.warn(`Failed to parse trace export response: ${err.message}. Returning empty response`);
				return {};
			}
		}
	};
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/trace/json/index.js
var require_json = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.JsonTraceSerializer = void 0;
	var trace_1 = require_trace();
	Object.defineProperty(exports, "JsonTraceSerializer", {
		enumerable: true,
		get: function() {
			return trace_1.JsonTraceSerializer;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-transformer/build/src/index.js
var require_src$9 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.JsonTraceSerializer = exports.JsonMetricsSerializer = exports.JsonLogsSerializer = exports.ProtobufTraceSerializer = exports.ProtobufMetricsSerializer = exports.ProtobufLogsSerializer = exports.LogsExporterMetricsHelper = exports.TraceExporterMetricsHelper = exports.MetricsExporterMetricsHelper = void 0;
	var metrics_1 = require_metrics$2();
	Object.defineProperty(exports, "MetricsExporterMetricsHelper", {
		enumerable: true,
		get: function() {
			return metrics_1.MetricsExporterMetricsHelper;
		}
	});
	var trace_1 = require_trace$2();
	Object.defineProperty(exports, "TraceExporterMetricsHelper", {
		enumerable: true,
		get: function() {
			return trace_1.TraceExporterMetricsHelper;
		}
	});
	var logs_1 = require_logs$3();
	Object.defineProperty(exports, "LogsExporterMetricsHelper", {
		enumerable: true,
		get: function() {
			return logs_1.LogsExporterMetricsHelper;
		}
	});
	var protobuf_1 = require_protobuf$2();
	Object.defineProperty(exports, "ProtobufLogsSerializer", {
		enumerable: true,
		get: function() {
			return protobuf_1.ProtobufLogsSerializer;
		}
	});
	var protobuf_2 = require_protobuf$1();
	Object.defineProperty(exports, "ProtobufMetricsSerializer", {
		enumerable: true,
		get: function() {
			return protobuf_2.ProtobufMetricsSerializer;
		}
	});
	var protobuf_3 = require_protobuf();
	Object.defineProperty(exports, "ProtobufTraceSerializer", {
		enumerable: true,
		get: function() {
			return protobuf_3.ProtobufTraceSerializer;
		}
	});
	var json_1 = require_json$2();
	Object.defineProperty(exports, "JsonLogsSerializer", {
		enumerable: true,
		get: function() {
			return json_1.JsonLogsSerializer;
		}
	});
	var json_2 = require_json$1();
	Object.defineProperty(exports, "JsonMetricsSerializer", {
		enumerable: true,
		get: function() {
			return json_2.JsonMetricsSerializer;
		}
	});
	var json_3 = require_json();
	Object.defineProperty(exports, "JsonTraceSerializer", {
		enumerable: true,
		get: function() {
			return json_3.JsonTraceSerializer;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-exporter-base/build/esm/util.js
/**
* Parses headers from config leaving only those that have defined values
* @param partialHeaders
*/
function validateAndNormalizeHeaders(partialHeaders) {
	const headers = {};
	Object.entries(partialHeaders ?? {}).forEach(([key, value]) => {
		if (typeof value !== "undefined") headers[key] = String(value);
		else diag.warn(`Header "${key}" has invalid value (${value}) and will be ignored`);
	});
	return headers;
}
var init_util = __esmMin((() => {
	init_esm$2();
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/otlp-http-configuration.js
function mergeHeaders(userProvidedHeaders, fallbackHeaders, defaultHeaders) {
	return async () => {
		const requiredHeaders = { ...await defaultHeaders() };
		const headers = {};
		if (fallbackHeaders != null) Object.assign(headers, await fallbackHeaders());
		if (userProvidedHeaders != null) Object.assign(headers, validateAndNormalizeHeaders(await userProvidedHeaders()));
		return Object.assign(headers, requiredHeaders);
	};
}
function validateUserProvidedUrl(url) {
	if (url == null) return;
	try {
		const base = globalThis.location?.href;
		return new URL(url, base).href;
	} catch {
		throw new Error(`Configuration: Could not parse user-provided export URL: '${url}'`);
	}
}
/**
* @param userProvidedConfiguration  Configuration options provided by the user in code.
* @param fallbackConfiguration Fallback to use when the {@link userProvidedConfiguration} does not specify an option.
* @param defaultConfiguration The defaults as defined by the exporter specification
*/
function mergeOtlpHttpConfigurationWithDefaults(userProvidedConfiguration, fallbackConfiguration, defaultConfiguration) {
	return {
		...mergeOtlpSharedConfigurationWithDefaults(userProvidedConfiguration, fallbackConfiguration, defaultConfiguration),
		headers: mergeHeaders(userProvidedConfiguration.headers, fallbackConfiguration.headers, defaultConfiguration.headers),
		url: validateUserProvidedUrl(userProvidedConfiguration.url) ?? fallbackConfiguration.url ?? defaultConfiguration.url
	};
}
function getHttpConfigurationDefaults(requiredHeaders, signalResourcePath) {
	return {
		...getSharedConfigurationDefaults(),
		headers: async () => requiredHeaders,
		url: "http://localhost:4318/" + signalResourcePath
	};
}
var init_otlp_http_configuration = __esmMin((() => {
	init_shared_configuration();
	init_util();
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/otlp-node-http-configuration.js
function httpAgentFactoryFromOptions(options) {
	return async (protocol) => {
		const isInsecure = protocol === "http:";
		const { Agent } = await (isInsecure ? import("http") : import("https"));
		if (isInsecure) {
			const { ca, cert, key, ...insecureOptions } = options;
			return new Agent(insecureOptions);
		}
		return new Agent(options);
	};
}
/**
* @param userProvidedConfiguration  Configuration options provided by the user in code.
* @param fallbackConfiguration Fallback to use when the {@link userProvidedConfiguration} does not specify an option.
* @param defaultConfiguration The defaults as defined by the exporter specification
*/
function mergeOtlpNodeHttpConfigurationWithDefaults(userProvidedConfiguration, fallbackConfiguration, defaultConfiguration) {
	return {
		...mergeOtlpHttpConfigurationWithDefaults(userProvidedConfiguration, fallbackConfiguration, defaultConfiguration),
		agentFactory: userProvidedConfiguration.agentFactory ?? fallbackConfiguration.agentFactory ?? defaultConfiguration.agentFactory,
		userAgent: userProvidedConfiguration.userAgent
	};
}
function getNodeHttpConfigurationDefaults(requiredHeaders, signalResourcePath) {
	return {
		...getHttpConfigurationDefaults(requiredHeaders, signalResourcePath),
		agentFactory: httpAgentFactoryFromOptions({ keepAlive: true })
	};
}
var init_otlp_node_http_configuration = __esmMin((() => {
	init_otlp_http_configuration();
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-exporter-base/build/esm/is-export-retryable.js
function isExportHTTPErrorRetryable(statusCode) {
	return statusCode === 429 || statusCode === 502 || statusCode === 503 || statusCode === 504;
}
function parseRetryAfterToMills(retryAfter) {
	if (retryAfter == null) return;
	const seconds = Number.parseInt(retryAfter, 10);
	if (Number.isInteger(seconds)) return seconds > 0 ? seconds * 1e3 : -1;
	const delay = new Date(retryAfter).getTime() - Date.now();
	if (delay >= 0) return delay;
	return 0;
}
var init_is_export_retryable = __esmMin((() => {}));
//#endregion
//#region node_modules/@opentelemetry/otlp-exporter-base/build/esm/transport/http-transport-utils.js
/**
* Sends data using http
* @param request
* @param url
* @param headers
* @param compression
* @param userAgent
* @param agent
* @param data
* @param timeoutMillis
*/
function sendWithHttp(request, url, headers, compression, userAgent, agent, data, timeoutMillis) {
	return new Promise((resolve) => {
		const parsedUrl = new URL(url);
		if (userAgent) headers["User-Agent"] = `${userAgent} ${DEFAULT_USER_AGENT}`;
		else headers["User-Agent"] = DEFAULT_USER_AGENT;
		const req = request(parsedUrl, {
			method: "POST",
			headers,
			agent
		}, (res) => {
			const responseData = [];
			let responseSize = 0;
			res.on("data", (chunk) => {
				responseSize += chunk.length;
				if (responseSize > 4194304) {
					resolve({
						status: "failure",
						error: /* @__PURE__ */ new Error(`OTLP export response body exceeded size limit of ${MAX_RESPONSE_BODY_SIZE} bytes`)
					});
					res.destroy();
					return;
				}
				responseData.push(chunk);
			});
			res.on("end", () => {
				if (res.statusCode && res.statusCode <= 299) resolve({
					status: "success",
					data: Buffer.concat(responseData)
				});
				else if (res.statusCode && isExportHTTPErrorRetryable(res.statusCode)) resolve({
					status: "retryable",
					retryInMillis: parseRetryAfterToMills(res.headers["retry-after"])
				});
				else resolve({
					status: "failure",
					error: new OTLPExporterError(res.statusMessage, res.statusCode, Buffer.concat(responseData).toString())
				});
			});
			res.on("error", (error) => {
				if (res.statusCode && res.statusCode <= 299) resolve({ status: "success" });
				else if (res.statusCode && isExportHTTPErrorRetryable(res.statusCode)) resolve({
					status: "retryable",
					error,
					retryInMillis: parseRetryAfterToMills(res.headers["retry-after"])
				});
				else resolve({
					status: "failure",
					error
				});
			});
		});
		req.setTimeout(timeoutMillis, () => {
			req.destroy();
			resolve({
				status: "retryable",
				error: /* @__PURE__ */ new Error("Request timed out")
			});
		});
		req.on("error", (error) => {
			if (isHttpTransportNetworkErrorRetryable(error)) resolve({
				status: "retryable",
				error
			});
			else resolve({
				status: "failure",
				error
			});
		});
		compressAndSend(req, compression, data, (error) => {
			resolve({
				status: "failure",
				error
			});
		});
	});
}
function compressAndSend(req, compression, data, onError) {
	let dataStream = readableFromUint8Array(data);
	if (compression === "gzip") {
		req.setHeader("Content-Encoding", "gzip");
		dataStream = dataStream.on("error", onError).pipe(zlib.createGzip()).on("error", onError);
	}
	dataStream.pipe(req).on("error", onError);
}
function readableFromUint8Array(buff) {
	const readable = new Readable();
	readable.push(buff);
	readable.push(null);
	return readable;
}
function isHttpTransportNetworkErrorRetryable(error) {
	const RETRYABLE_NETWORK_ERROR_CODES = /* @__PURE__ */ new Set([
		"ECONNRESET",
		"ECONNREFUSED",
		"EPIPE",
		"ETIMEDOUT",
		"EAI_AGAIN",
		"ENOTFOUND",
		"ENETUNREACH",
		"EHOSTUNREACH"
	]);
	if ("code" in error && typeof error.code === "string") return RETRYABLE_NETWORK_ERROR_CODES.has(error.code);
	return false;
}
var DEFAULT_USER_AGENT, MAX_RESPONSE_BODY_SIZE;
var init_http_transport_utils = __esmMin((() => {
	init_is_export_retryable();
	init_types();
	init_version();
	DEFAULT_USER_AGENT = `OTel-OTLP-Exporter-JavaScript/${VERSION}`;
	MAX_RESPONSE_BODY_SIZE = 4 * 1024 * 1024;
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-exporter-base/build/esm/transport/http-exporter-transport.js
async function requestFunctionFactory(protocol) {
	const { request } = await (protocol === "http:" ? import("http") : import("https"));
	return request;
}
function createHttpExporterTransport(parameters) {
	return new HttpExporterTransport(parameters);
}
var HttpExporterTransport;
var init_http_exporter_transport = __esmMin((() => {
	init_http_transport_utils();
	HttpExporterTransport = class {
		_utils = null;
		_parameters;
		constructor(parameters) {
			this._parameters = parameters;
		}
		async send(data, timeoutMillis) {
			const { agent, request } = await this._loadUtils();
			const headers = await this._parameters.headers();
			return sendWithHttp(request, this._parameters.url, headers, this._parameters.compression, this._parameters.userAgent, agent, data, timeoutMillis);
		}
		shutdown() {}
		async _loadUtils() {
			let utils = this._utils;
			if (utils === null) {
				const protocol = new URL(this._parameters.url).protocol;
				const [agent, request] = await Promise.all([this._parameters.agentFactory(protocol), requestFunctionFactory(protocol)]);
				utils = this._utils = {
					agent,
					request
				};
			}
			return utils;
		}
	};
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-exporter-base/build/esm/retrying-transport.js
/**
* Get a pseudo-random jitter that falls in the range of [-JITTER, +JITTER]
*/
function getJitter() {
	return Math.random() * (2 * JITTER) - JITTER;
}
/**
* Creates an Exporter Transport that retries on 'retryable' response.
*/
function createRetryingTransport(options) {
	return new RetryingTransport(options.transport);
}
var MAX_ATTEMPTS, INITIAL_BACKOFF, MAX_BACKOFF, BACKOFF_MULTIPLIER, JITTER, RetryingTransport;
var init_retrying_transport = __esmMin((() => {
	init_esm$2();
	MAX_ATTEMPTS = 5;
	INITIAL_BACKOFF = 1e3;
	MAX_BACKOFF = 5e3;
	BACKOFF_MULTIPLIER = 1.5;
	JITTER = .2;
	RetryingTransport = class {
		_transport;
		constructor(transport) {
			this._transport = transport;
		}
		retry(data, timeoutMillis, inMillis) {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					this._transport.send(data, timeoutMillis).then(resolve, reject);
				}, inMillis);
			});
		}
		async send(data, timeoutMillis) {
			let attempts = MAX_ATTEMPTS;
			let nextBackoff = INITIAL_BACKOFF;
			const deadline = Date.now() + timeoutMillis;
			let result = await this._transport.send(data, timeoutMillis);
			while (result.status === "retryable" && attempts > 0) {
				attempts--;
				const backoff = Math.max(Math.min(nextBackoff * (1 + getJitter()), MAX_BACKOFF), 0);
				nextBackoff = nextBackoff * BACKOFF_MULTIPLIER;
				const retryInMillis = result.retryInMillis ?? backoff;
				const remainingTimeoutMillis = deadline - Date.now();
				if (retryInMillis > remainingTimeoutMillis) {
					diag.info(`Export retry time ${Math.round(retryInMillis)}ms exceeds remaining timeout ${Math.round(remainingTimeoutMillis)}ms, not retrying further.`);
					return result;
				}
				diag.verbose(`Scheduling export retry in ${Math.round(retryInMillis)}ms`);
				result = await this.retry(data, remainingTimeoutMillis, retryInMillis);
			}
			if (result.status === "success") diag.verbose(`Export succeeded after ${MAX_ATTEMPTS - attempts} retry attempts.`);
			else if (result.status === "retryable") diag.info(`Export failed after maximum retry attempts (${MAX_ATTEMPTS}).`);
			else diag.info(`Export failed with non-retryable error: ${result.error}`);
			return result;
		}
		shutdown() {
			return this._transport.shutdown();
		}
	};
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-exporter-base/build/esm/otlp-http-export-delegate.js
function createOtlpHttpExporterMetrics(metricsComponentType, exporterMetricsHelper, url, meterProvider) {
	return new ExporterMetrics({
		componentType: metricsComponentType,
		metricsHelper: exporterMetricsHelper,
		url,
		meterProvider,
		responseAttributesFromError: (error) => {
			if (!error) return { [ATTR_HTTP_RESPONSE_STATUS_CODE]: 200 };
			if (!(error instanceof OTLPExporterError)) return {};
			return { [ATTR_HTTP_RESPONSE_STATUS_CODE]: error.code };
		}
	});
}
function createOtlpHttpExportDelegate(options, serializer, metricsComponentType, exporterMetricsHelper, meterProvider) {
	return createOtlpExportDelegate({
		transport: createRetryingTransport({ transport: createHttpExporterTransport(options) }),
		serializer,
		promiseHandler: createBoundedQueueExportPromiseHandler(options),
		metrics: createOtlpHttpExporterMetrics(metricsComponentType, exporterMetricsHelper, options.url, meterProvider)
	}, { timeout: options.timeoutMillis });
}
var init_otlp_http_export_delegate = __esmMin((() => {
	init_otlp_export_delegate();
	init_http_exporter_transport();
	init_bounded_queue_export_promise_handler();
	init_retrying_transport();
	init_types();
	init_semconv();
	init_ExporterMetrics();
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/shared-env-configuration.js
function parseAndValidateTimeoutFromEnv(timeoutEnvVar) {
	const envTimeout = (0, import_src$11.getNumberFromEnv)(timeoutEnvVar);
	if (envTimeout != null) {
		if (Number.isFinite(envTimeout) && envTimeout > 0) return envTimeout;
		diag.warn(`Configuration: ${timeoutEnvVar} is invalid, expected number greater than 0 (actual: ${envTimeout})`);
	}
}
function getTimeoutFromEnv(signalIdentifier) {
	const specificTimeout = parseAndValidateTimeoutFromEnv(`OTEL_EXPORTER_OTLP_${signalIdentifier}_TIMEOUT`);
	const nonSpecificTimeout = parseAndValidateTimeoutFromEnv("OTEL_EXPORTER_OTLP_TIMEOUT");
	return specificTimeout ?? nonSpecificTimeout;
}
function parseAndValidateCompressionFromEnv(compressionEnvVar) {
	const compression = (0, import_src$11.getStringFromEnv)(compressionEnvVar)?.trim();
	if (compression == null || compression === "none" || compression === "gzip") return compression;
	diag.warn(`Configuration: ${compressionEnvVar} is invalid, expected 'none' or 'gzip' (actual: '${compression}')`);
}
function getCompressionFromEnv(signalIdentifier) {
	const specificCompression = parseAndValidateCompressionFromEnv(`OTEL_EXPORTER_OTLP_${signalIdentifier}_COMPRESSION`);
	const nonSpecificCompression = parseAndValidateCompressionFromEnv("OTEL_EXPORTER_OTLP_COMPRESSION");
	return specificCompression ?? nonSpecificCompression;
}
function getSharedConfigurationFromEnvironment(signalIdentifier) {
	return {
		timeoutMillis: getTimeoutFromEnv(signalIdentifier),
		compression: getCompressionFromEnv(signalIdentifier)
	};
}
var import_src$11;
var init_shared_env_configuration = __esmMin((() => {
	import_src$11 = /* @__PURE__ */ __toESM(require_src$13());
	init_esm$2();
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/otlp-node-http-env-configuration.js
function getStaticHeadersFromEnv(signalIdentifier) {
	const signalSpecificRawHeaders = (0, import_src$10.getStringFromEnv)(`OTEL_EXPORTER_OTLP_${signalIdentifier}_HEADERS`);
	const nonSignalSpecificRawHeaders = (0, import_src$10.getStringFromEnv)("OTEL_EXPORTER_OTLP_HEADERS");
	const signalSpecificHeaders = (0, import_src$10.parseKeyPairsIntoRecord)(signalSpecificRawHeaders);
	const nonSignalSpecificHeaders = (0, import_src$10.parseKeyPairsIntoRecord)(nonSignalSpecificRawHeaders);
	if (Object.keys(signalSpecificHeaders).length === 0 && Object.keys(nonSignalSpecificHeaders).length === 0) return;
	return Object.assign({}, (0, import_src$10.parseKeyPairsIntoRecord)(nonSignalSpecificRawHeaders), (0, import_src$10.parseKeyPairsIntoRecord)(signalSpecificRawHeaders));
}
function appendRootPathToUrlIfNeeded(url) {
	try {
		return new URL(url).toString();
	} catch {
		diag.warn(`Configuration: Could not parse environment-provided export URL: '${url}', falling back to undefined`);
		return;
	}
}
function appendResourcePathToUrl(url, path) {
	try {
		new URL(url);
	} catch {
		diag.warn(`Configuration: Could not parse environment-provided export URL: '${url}', falling back to undefined`);
		return;
	}
	if (!url.endsWith("/")) url = url + "/";
	url += path;
	try {
		new URL(url);
	} catch {
		diag.warn(`Configuration: Provided URL appended with '${path}' is not a valid URL, using 'undefined' instead of '${url}'`);
		return;
	}
	return url;
}
function getNonSpecificUrlFromEnv(signalResourcePath) {
	const envUrl = (0, import_src$10.getStringFromEnv)("OTEL_EXPORTER_OTLP_ENDPOINT");
	if (envUrl === void 0) return;
	return appendResourcePathToUrl(envUrl, signalResourcePath);
}
function getSpecificUrlFromEnv(signalIdentifier) {
	const envUrl = (0, import_src$10.getStringFromEnv)(`OTEL_EXPORTER_OTLP_${signalIdentifier}_ENDPOINT`);
	if (envUrl === void 0) return;
	return appendRootPathToUrlIfNeeded(envUrl);
}
function readFileFromEnv(signalSpecificEnvVar, nonSignalSpecificEnvVar, warningMessage) {
	const signalSpecificPath = (0, import_src$10.getStringFromEnv)(signalSpecificEnvVar);
	const nonSignalSpecificPath = (0, import_src$10.getStringFromEnv)(nonSignalSpecificEnvVar);
	const filePath = signalSpecificPath ?? nonSignalSpecificPath;
	if (filePath != null) try {
		return fs$1.readFileSync(path$1.resolve(process.cwd(), filePath));
	} catch {
		diag.warn(warningMessage);
		return;
	}
	else return;
}
function getClientCertificateFromEnv(signalIdentifier) {
	return readFileFromEnv(`OTEL_EXPORTER_OTLP_${signalIdentifier}_CLIENT_CERTIFICATE`, "OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE", "Failed to read client certificate chain file");
}
function getClientKeyFromEnv(signalIdentifier) {
	return readFileFromEnv(`OTEL_EXPORTER_OTLP_${signalIdentifier}_CLIENT_KEY`, "OTEL_EXPORTER_OTLP_CLIENT_KEY", "Failed to read client certificate private key file");
}
function getRootCertificateFromEnv(signalIdentifier) {
	return readFileFromEnv(`OTEL_EXPORTER_OTLP_${signalIdentifier}_CERTIFICATE`, "OTEL_EXPORTER_OTLP_CERTIFICATE", "Failed to read root certificate file");
}
/**
* Reads and returns configuration from the environment
*
* @param signalIdentifier all caps part in environment variables that identifies the signal (e.g.: METRICS, TRACES, LOGS)
* @param signalResourcePath signal resource path to append if necessary (e.g.: v1/metrics, v1/traces, v1/logs)
*/
function getNodeHttpConfigurationFromEnvironment(signalIdentifier, signalResourcePath) {
	return {
		...getSharedConfigurationFromEnvironment(signalIdentifier),
		url: getSpecificUrlFromEnv(signalIdentifier) ?? getNonSpecificUrlFromEnv(signalResourcePath),
		headers: wrapStaticHeadersInFunction(getStaticHeadersFromEnv(signalIdentifier)),
		agentFactory: httpAgentFactoryFromOptions({
			keepAlive: true,
			ca: getRootCertificateFromEnv(signalIdentifier),
			cert: getClientCertificateFromEnv(signalIdentifier),
			key: getClientKeyFromEnv(signalIdentifier)
		})
	};
}
var import_src$10;
var init_otlp_node_http_env_configuration = __esmMin((() => {
	import_src$10 = /* @__PURE__ */ __toESM(require_src$13());
	init_esm$2();
	init_shared_env_configuration();
	init_shared_configuration();
	init_otlp_node_http_configuration();
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/convert-legacy-http-options.js
function convertLegacyHeaders(config) {
	if (typeof config.headers === "function") return config.headers;
	return wrapStaticHeadersInFunction(config.headers);
}
var init_convert_legacy_http_options = __esmMin((() => {
	init_shared_configuration();
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-exporter-base/build/esm/configuration/convert-legacy-node-http-options.js
function convertLegacyAgentOptions(config) {
	if (typeof config.httpAgentOptions === "function") return config.httpAgentOptions;
	let legacy = config.httpAgentOptions;
	if (config.keepAlive != null) legacy = {
		keepAlive: config.keepAlive,
		...legacy
	};
	if (legacy != null) return httpAgentFactoryFromOptions(legacy);
	else return;
}
/**
* @deprecated this will be removed in 2.0
* @param config
* @param signalIdentifier
* @param signalResourcePath
* @param requiredHeaders
*/
function convertLegacyHttpOptions(config, signalIdentifier, signalResourcePath, requiredHeaders) {
	if (config.metadata) diag.warn("Metadata cannot be set when using http");
	return mergeOtlpNodeHttpConfigurationWithDefaults({
		url: config.url,
		headers: convertLegacyHeaders(config),
		concurrencyLimit: config.concurrencyLimit,
		timeoutMillis: config.timeoutMillis,
		compression: config.compression,
		agentFactory: convertLegacyAgentOptions(config),
		userAgent: config.userAgent
	}, getNodeHttpConfigurationFromEnvironment(signalIdentifier, signalResourcePath), getNodeHttpConfigurationDefaults(requiredHeaders, signalResourcePath));
}
var init_convert_legacy_node_http_options = __esmMin((() => {
	init_esm$2();
	init_otlp_node_http_configuration();
	init_index_node_http();
	init_otlp_node_http_env_configuration();
	init_convert_legacy_http_options();
}));
//#endregion
//#region node_modules/@opentelemetry/otlp-exporter-base/build/esm/index-node-http.js
var index_node_http_exports = /* @__PURE__ */ __exportAll({
	convertLegacyHttpOptions: () => convertLegacyHttpOptions,
	createOtlpHttpExportDelegate: () => createOtlpHttpExportDelegate,
	createOtlpHttpExporterMetrics: () => createOtlpHttpExporterMetrics,
	getSharedConfigurationFromEnvironment: () => getSharedConfigurationFromEnvironment,
	httpAgentFactoryFromOptions: () => httpAgentFactoryFromOptions
});
var init_index_node_http = __esmMin((() => {
	init_otlp_node_http_configuration();
	init_otlp_http_export_delegate();
	init_shared_env_configuration();
	init_convert_legacy_node_http_options();
}));
//#endregion
//#region node_modules/@opentelemetry/exporter-metrics-otlp-http/build/src/semconv.js
var require_semconv$5 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.OTEL_COMPONENT_TYPE_VALUE_OTLP_HTTP_METRIC_EXPORTER = void 0;
	/**
	* Enum value "otlp_http_metric_exporter" for attribute {@link ATTR_OTEL_COMPONENT_TYPE}.
	*
	* OTLP metric exporter over HTTP with protobuf serialization
	*
	* @experimental This enum value is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.OTEL_COMPONENT_TYPE_VALUE_OTLP_HTTP_METRIC_EXPORTER = "otlp_http_metric_exporter";
}));
//#endregion
//#region node_modules/@opentelemetry/exporter-metrics-otlp-http/build/src/platform/node/OTLPMetricExporter.js
var require_OTLPMetricExporter$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.OTLPMetricExporter = void 0;
	const OTLPMetricExporterBase_1 = require_OTLPMetricExporterBase();
	const otlp_transformer_1 = require_src$9();
	const node_http_1 = (init_index_node_http(), __toCommonJS(index_node_http_exports));
	const semconv_1 = require_semconv$5();
	/**
	* OTLP Metric Exporter for Node.js
	*/
	var OTLPMetricExporter = class extends OTLPMetricExporterBase_1.OTLPMetricExporterBase {
		_url;
		constructor(config) {
			super((0, node_http_1.createOtlpHttpExportDelegate)((0, node_http_1.convertLegacyHttpOptions)(config ?? {}, "METRICS", "v1/metrics", { "Content-Type": "application/json" }), otlp_transformer_1.JsonMetricsSerializer, semconv_1.OTEL_COMPONENT_TYPE_VALUE_OTLP_HTTP_METRIC_EXPORTER, otlp_transformer_1.MetricsExporterMetricsHelper, config?.selfObsMeterProvider), config);
			this._url = config?.url;
		}
		/**
		* Sets the meter provider to use to collect metrics for the exporter itself.
		* @experimental This method is experimental and is subject to breaking changes in minor releases.
		*/
		setSelfObsMeterProvider(meterProvider) {
			this.setMetrics((0, node_http_1.createOtlpHttpExporterMetrics)(semconv_1.OTEL_COMPONENT_TYPE_VALUE_OTLP_HTTP_METRIC_EXPORTER, otlp_transformer_1.MetricsExporterMetricsHelper, this._url, meterProvider));
		}
	};
	exports.OTLPMetricExporter = OTLPMetricExporter;
}));
//#endregion
//#region node_modules/@opentelemetry/exporter-metrics-otlp-http/build/src/platform/node/index.js
var require_node$5 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.OTLPMetricExporter = void 0;
	var OTLPMetricExporter_1 = require_OTLPMetricExporter$1();
	Object.defineProperty(exports, "OTLPMetricExporter", {
		enumerable: true,
		get: function() {
			return OTLPMetricExporter_1.OTLPMetricExporter;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/exporter-metrics-otlp-http/build/src/platform/index.js
var require_platform$5 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.OTLPMetricExporter = void 0;
	var node_1 = require_node$5();
	Object.defineProperty(exports, "OTLPMetricExporter", {
		enumerable: true,
		get: function() {
			return node_1.OTLPMetricExporter;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/exporter-metrics-otlp-http/build/src/index.js
var require_src$8 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.OTLPMetricExporterBase = exports.LowMemoryTemporalitySelector = exports.DeltaTemporalitySelector = exports.CumulativeTemporalitySelector = exports.AggregationTemporalityPreference = exports.OTLPMetricExporter = void 0;
	var platform_1 = require_platform$5();
	Object.defineProperty(exports, "OTLPMetricExporter", {
		enumerable: true,
		get: function() {
			return platform_1.OTLPMetricExporter;
		}
	});
	var OTLPMetricExporterOptions_1 = require_OTLPMetricExporterOptions();
	Object.defineProperty(exports, "AggregationTemporalityPreference", {
		enumerable: true,
		get: function() {
			return OTLPMetricExporterOptions_1.AggregationTemporalityPreference;
		}
	});
	var OTLPMetricExporterBase_1 = require_OTLPMetricExporterBase();
	Object.defineProperty(exports, "CumulativeTemporalitySelector", {
		enumerable: true,
		get: function() {
			return OTLPMetricExporterBase_1.CumulativeTemporalitySelector;
		}
	});
	Object.defineProperty(exports, "DeltaTemporalitySelector", {
		enumerable: true,
		get: function() {
			return OTLPMetricExporterBase_1.DeltaTemporalitySelector;
		}
	});
	Object.defineProperty(exports, "LowMemoryTemporalitySelector", {
		enumerable: true,
		get: function() {
			return OTLPMetricExporterBase_1.LowMemoryTemporalitySelector;
		}
	});
	Object.defineProperty(exports, "OTLPMetricExporterBase", {
		enumerable: true,
		get: function() {
			return OTLPMetricExporterBase_1.OTLPMetricExporterBase;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/exporter-metrics-otlp-proto/build/src/semconv.js
var require_semconv$4 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.OTEL_COMPONENT_TYPE_VALUE_OTLP_HTTP_METRIC_EXPORTER = void 0;
	/**
	* Enum value "otlp_http_metric_exporter" for attribute {@link ATTR_OTEL_COMPONENT_TYPE}.
	*
	* OTLP metric exporter over HTTP with protobuf serialization
	*
	* @experimental This enum value is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.OTEL_COMPONENT_TYPE_VALUE_OTLP_HTTP_METRIC_EXPORTER = "otlp_http_metric_exporter";
}));
//#endregion
//#region node_modules/@opentelemetry/exporter-metrics-otlp-proto/build/src/platform/node/OTLPMetricExporter.js
var require_OTLPMetricExporter = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.OTLPMetricExporter = void 0;
	const exporter_metrics_otlp_http_1 = require_src$8();
	const otlp_transformer_1 = require_src$9();
	const node_http_1 = (init_index_node_http(), __toCommonJS(index_node_http_exports));
	const semconv_1 = require_semconv$4();
	var OTLPMetricExporter = class extends exporter_metrics_otlp_http_1.OTLPMetricExporterBase {
		_url;
		constructor(config) {
			super((0, node_http_1.createOtlpHttpExportDelegate)((0, node_http_1.convertLegacyHttpOptions)(config ?? {}, "METRICS", "v1/metrics", { "Content-Type": "application/x-protobuf" }), otlp_transformer_1.ProtobufMetricsSerializer, semconv_1.OTEL_COMPONENT_TYPE_VALUE_OTLP_HTTP_METRIC_EXPORTER, otlp_transformer_1.MetricsExporterMetricsHelper, config?.selfObsMeterProvider), config);
			this._url = config?.url;
		}
		/**
		* Sets the meter provider to use to collect metrics for the exporter itself.
		* @experimental This method is experimental and is subject to breaking changes in minor releases.
		*/
		setSelfObsMeterProvider(meterProvider) {
			this.setMetrics((0, node_http_1.createOtlpHttpExporterMetrics)(semconv_1.OTEL_COMPONENT_TYPE_VALUE_OTLP_HTTP_METRIC_EXPORTER, otlp_transformer_1.MetricsExporterMetricsHelper, this._url, meterProvider));
		}
	};
	exports.OTLPMetricExporter = OTLPMetricExporter;
}));
//#endregion
//#region node_modules/@opentelemetry/exporter-metrics-otlp-proto/build/src/platform/node/index.js
var require_node$4 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.OTLPMetricExporter = void 0;
	var OTLPMetricExporter_1 = require_OTLPMetricExporter();
	Object.defineProperty(exports, "OTLPMetricExporter", {
		enumerable: true,
		get: function() {
			return OTLPMetricExporter_1.OTLPMetricExporter;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/exporter-metrics-otlp-proto/build/src/platform/index.js
var require_platform$4 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.OTLPMetricExporter = void 0;
	var node_1 = require_node$4();
	Object.defineProperty(exports, "OTLPMetricExporter", {
		enumerable: true,
		get: function() {
			return node_1.OTLPMetricExporter;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/exporter-metrics-otlp-proto/build/src/index.js
var require_src$7 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.OTLPMetricExporter = void 0;
	var platform_1 = require_platform$4();
	Object.defineProperty(exports, "OTLPMetricExporter", {
		enumerable: true,
		get: function() {
			return platform_1.OTLPMetricExporter;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/exporter-trace-otlp-proto/build/src/semconv.js
var require_semconv$3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.OTEL_COMPONENT_TYPE_VALUE_OTLP_HTTP_SPAN_EXPORTER = void 0;
	/**
	* Enum value "otlp_http_span_exporter" for attribute {@link ATTR_OTEL_COMPONENT_TYPE}.
	*
	* OTLP span exporter over HTTP with protobuf serialization
	*
	* @experimental This enum value is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.OTEL_COMPONENT_TYPE_VALUE_OTLP_HTTP_SPAN_EXPORTER = "otlp_http_span_exporter";
}));
//#endregion
//#region node_modules/@opentelemetry/exporter-trace-otlp-proto/build/src/platform/node/OTLPTraceExporter.js
var require_OTLPTraceExporter = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.OTLPTraceExporter = void 0;
	const otlp_exporter_base_1 = (init_esm(), __toCommonJS(esm_exports));
	const otlp_transformer_1 = require_src$9();
	const node_http_1 = (init_index_node_http(), __toCommonJS(index_node_http_exports));
	const semconv_1 = require_semconv$3();
	/**
	* Collector Trace Exporter for Node with protobuf
	*/
	var OTLPTraceExporter = class extends otlp_exporter_base_1.OTLPExporterBase {
		constructor(config = {}) {
			super((0, node_http_1.createOtlpHttpExportDelegate)((0, node_http_1.convertLegacyHttpOptions)(config, "TRACES", "v1/traces", { "Content-Type": "application/x-protobuf" }), otlp_transformer_1.ProtobufTraceSerializer, semconv_1.OTEL_COMPONENT_TYPE_VALUE_OTLP_HTTP_SPAN_EXPORTER, otlp_transformer_1.TraceExporterMetricsHelper, config.selfObsMeterProvider));
		}
	};
	exports.OTLPTraceExporter = OTLPTraceExporter;
}));
//#endregion
//#region node_modules/@opentelemetry/exporter-trace-otlp-proto/build/src/platform/node/index.js
var require_node$3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.OTLPTraceExporter = void 0;
	var OTLPTraceExporter_1 = require_OTLPTraceExporter();
	Object.defineProperty(exports, "OTLPTraceExporter", {
		enumerable: true,
		get: function() {
			return OTLPTraceExporter_1.OTLPTraceExporter;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/exporter-trace-otlp-proto/build/src/platform/index.js
var require_platform$3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.OTLPTraceExporter = void 0;
	var node_1 = require_node$3();
	Object.defineProperty(exports, "OTLPTraceExporter", {
		enumerable: true,
		get: function() {
			return node_1.OTLPTraceExporter;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/exporter-trace-otlp-proto/build/src/index.js
var require_src$6 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.OTLPTraceExporter = void 0;
	var platform_1 = require_platform$3();
	Object.defineProperty(exports, "OTLPTraceExporter", {
		enumerable: true,
		get: function() {
			return platform_1.OTLPTraceExporter;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-trace/build/src/enums.js
var require_enums = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ExceptionEventName = void 0;
	exports.ExceptionEventName = "exception";
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-trace/build/src/inspect.js
var require_inspect = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.formatInspect = exports.settledResourceAttributes = exports.inspectCustom = void 0;
	/**
	* Well-known symbol used by Node.js `util.inspect` (and `console.*`) to
	* render an object via a custom representation. Defined as a global Symbol
	* so it works without importing from `node:util`, keeping this module safe
	* for browser builds (where the symbol is simply never looked up).
	*/
	exports.inspectCustom = Symbol.for("nodejs.util.inspect.custom");
	/**
	* Collect a Resource's settled attributes without touching the
	* `attributes` getter, which emits diag.error/debug entries when async
	* attribute detectors are still pending. Promise-like (unsettled)
	* entries are silently skipped so logging a Span/Tracer/Provider during
	* startup doesn't recurse through the diag pipeline.
	*/
	function settledResourceAttributes(resource) {
		const attrs = {};
		for (const [k, v] of resource.getRawAttributes()) {
			if (typeof v?.then === "function") continue;
			if (v != null) attrs[k] ??= v;
		}
		return attrs;
	}
	exports.settledResourceAttributes = settledResourceAttributes;
	/**
	* Build a class-tagged inspect representation. Returns a stub like
	* `[ClassName]` once the recursion budget is exhausted, otherwise returns
	* `ClassName <inspected payload>` so nested fields keep proper coloring,
	* indentation, and depth handling. In environments that don't supply an
	* `inspect` callback (e.g. browsers), falls back to returning the raw
	* payload object.
	*/
	function formatInspect(className, payload, depth, options, inspect) {
		if (typeof depth === "number" && depth < 0) {
			const tag = `[${className}]`;
			return options?.stylize ? options.stylize(tag, "special") : tag;
		}
		if (typeof inspect !== "function" || !options) return payload;
		return `${className} ${inspect(payload, {
			...options,
			depth: options.depth == null ? options.depth : options.depth - 1
		})}`;
	}
	exports.formatInspect = formatInspect;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-trace/build/src/Span.js
var require_Span = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SpanImpl = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const core_1 = require_src$13();
	const semantic_conventions_1 = (init_esm$1(), __toCommonJS(esm_exports$1));
	const enums_1 = require_enums();
	const inspect_1 = require_inspect();
	/**
	* This class represents a span.
	*/
	var SpanImpl = class {
		_spanContext;
		kind;
		parentSpanContext;
		attributes = {};
		links = [];
		events = [];
		startTime;
		resource;
		instrumentationScope;
		_droppedAttributesCount = 0;
		_droppedEventsCount = 0;
		_droppedLinksCount = 0;
		_attributesCount = 0;
		name;
		status = { code: api_1.SpanStatusCode.UNSET };
		endTime = [0, 0];
		_ended = false;
		_duration = [-1, -1];
		_spanProcessor;
		_spanLimits;
		_attributeValueLengthLimit;
		_recordEndMetrics;
		_performanceStartTime;
		_performanceOffset;
		_startTimeProvided;
		/**
		* Constructs a new SpanImpl instance.
		*/
		constructor(opts) {
			const now = Date.now();
			this._spanContext = opts.spanContext;
			this._performanceStartTime = core_1.otperformance.now();
			this._performanceOffset = now - (this._performanceStartTime + core_1.otperformance.timeOrigin);
			this._startTimeProvided = opts.startTime != null;
			this._spanLimits = opts.spanLimits;
			this._attributeValueLengthLimit = this._spanLimits.attributeValueLengthLimit ?? 0;
			this._spanProcessor = opts.spanProcessor;
			this.name = opts.name;
			this.parentSpanContext = opts.parentSpanContext;
			this.kind = opts.kind;
			if (opts.links) for (const link of opts.links) this.addLink(link);
			this.startTime = this._getTime(opts.startTime ?? now);
			this.resource = opts.resource;
			this.instrumentationScope = opts.scope;
			this._recordEndMetrics = opts.recordEndMetrics;
			if (opts.attributes != null) this.setAttributes(opts.attributes);
			this._spanProcessor.onStart(this, opts.context);
		}
		spanContext() {
			return this._spanContext;
		}
		setAttribute(key, value) {
			if (value == null || this._isSpanEnded()) return this;
			if (key.length === 0) {
				api_1.diag.warn(`Invalid attribute key: ${key}`);
				return this;
			}
			if (!(0, core_1.isAttributeValue)(value)) {
				api_1.diag.warn(`Invalid attribute value set for key: ${key}`);
				return this;
			}
			const { attributeCountLimit } = this._spanLimits;
			const isNewKey = !Object.prototype.hasOwnProperty.call(this.attributes, key);
			if (attributeCountLimit !== void 0 && this._attributesCount >= attributeCountLimit && isNewKey) {
				this._droppedAttributesCount++;
				return this;
			}
			this.attributes[key] = this._truncateToSize(value);
			if (isNewKey) this._attributesCount++;
			return this;
		}
		setAttributes(attributes) {
			for (const key in attributes) if (Object.prototype.hasOwnProperty.call(attributes, key)) this.setAttribute(key, attributes[key]);
			return this;
		}
		/**
		*
		* @param name Span Name
		* @param [attributesOrStartTime] Span attributes or start time
		*     if type is {@type TimeInput} and 3rd param is undefined
		* @param [timeStamp] Specified time stamp for the event
		*/
		addEvent(name, attributesOrStartTime, timeStamp) {
			if (this._isSpanEnded()) return this;
			const { eventCountLimit } = this._spanLimits;
			if (eventCountLimit === 0) {
				api_1.diag.warn("No events allowed.");
				this._droppedEventsCount++;
				return this;
			}
			if (eventCountLimit !== void 0 && this.events.length >= eventCountLimit) {
				if (this._droppedEventsCount === 0) api_1.diag.debug("Dropping extra events.");
				this.events.shift();
				this._droppedEventsCount++;
			}
			if ((0, core_1.isTimeInput)(attributesOrStartTime)) {
				if (!(0, core_1.isTimeInput)(timeStamp)) timeStamp = attributesOrStartTime;
				attributesOrStartTime = void 0;
			}
			const sanitized = (0, core_1.sanitizeAttributes)(attributesOrStartTime);
			const { attributePerEventCountLimit } = this._spanLimits;
			const attributes = {};
			let droppedAttributesCount = 0;
			let eventAttributesCount = 0;
			for (const attr in sanitized) {
				if (!Object.prototype.hasOwnProperty.call(sanitized, attr)) continue;
				const attrVal = sanitized[attr];
				if (attributePerEventCountLimit !== void 0 && eventAttributesCount >= attributePerEventCountLimit) {
					droppedAttributesCount++;
					continue;
				}
				attributes[attr] = this._truncateToSize(attrVal);
				eventAttributesCount++;
			}
			this.events.push({
				name,
				attributes,
				time: this._getTime(timeStamp),
				droppedAttributesCount
			});
			return this;
		}
		addLink(link) {
			if (this._isSpanEnded()) return this;
			const { linkCountLimit } = this._spanLimits;
			if (linkCountLimit === 0) {
				this._droppedLinksCount++;
				return this;
			}
			if (linkCountLimit !== void 0 && this.links.length >= linkCountLimit) {
				if (this._droppedLinksCount === 0) api_1.diag.debug("Dropping extra links.");
				this.links.shift();
				this._droppedLinksCount++;
			}
			const { attributePerLinkCountLimit } = this._spanLimits;
			const sanitized = (0, core_1.sanitizeAttributes)(link.attributes);
			const attributes = {};
			let droppedAttributesCount = 0;
			let linkAttributesCount = 0;
			for (const attr in sanitized) {
				if (!Object.prototype.hasOwnProperty.call(sanitized, attr)) continue;
				const attrVal = sanitized[attr];
				if (attributePerLinkCountLimit !== void 0 && linkAttributesCount >= attributePerLinkCountLimit) {
					droppedAttributesCount++;
					continue;
				}
				attributes[attr] = this._truncateToSize(attrVal);
				linkAttributesCount++;
			}
			const processedLink = { context: link.context };
			if (linkAttributesCount > 0) processedLink.attributes = attributes;
			if (droppedAttributesCount > 0) processedLink.droppedAttributesCount = droppedAttributesCount;
			this.links.push(processedLink);
			return this;
		}
		addLinks(links) {
			for (const link of links) this.addLink(link);
			return this;
		}
		setStatus(status) {
			if (this._isSpanEnded()) return this;
			if (status.code === api_1.SpanStatusCode.UNSET) return this;
			if (this.status.code === api_1.SpanStatusCode.OK) return this;
			const newStatus = { code: status.code };
			if (status.code === api_1.SpanStatusCode.ERROR) {
				if (typeof status.message === "string") newStatus.message = status.message;
				else if (status.message != null) api_1.diag.warn(`Dropping invalid status.message of type '${typeof status.message}', expected 'string'`);
			}
			this.status = newStatus;
			return this;
		}
		updateName(name) {
			if (this._isSpanEnded()) return this;
			this.name = name;
			return this;
		}
		end(endTime) {
			if (this._isSpanEnded()) {
				api_1.diag.error(`${this.name} ${this._spanContext.traceId}-${this._spanContext.spanId} - You can only call end() on a span once.`);
				return;
			}
			this.endTime = this._getTime(endTime);
			this._duration = (0, core_1.hrTimeDuration)(this.startTime, this.endTime);
			if (this._duration[0] < 0) {
				api_1.diag.warn("Inconsistent start and end time, startTime > endTime. Setting span duration to 0ms.", this.startTime, this.endTime);
				this.endTime = this.startTime.slice();
				this._duration = [0, 0];
			}
			if (this._droppedEventsCount > 0) api_1.diag.warn(`Dropped ${this._droppedEventsCount} events because eventCountLimit reached`);
			if (this._droppedLinksCount > 0) api_1.diag.warn(`Dropped ${this._droppedLinksCount} links because linkCountLimit reached`);
			if (this._spanProcessor.onEnding) this._spanProcessor.onEnding(this);
			this._recordEndMetrics?.();
			this._ended = true;
			this._spanProcessor.onEnd(this);
		}
		_getTime(inp) {
			if (typeof inp === "number" && inp <= core_1.otperformance.now()) return (0, core_1.hrTime)(inp + this._performanceOffset);
			if (typeof inp === "number") return (0, core_1.millisToHrTime)(inp);
			if (inp instanceof Date) return (0, core_1.millisToHrTime)(inp.getTime());
			if ((0, core_1.isTimeInputHrTime)(inp)) return inp;
			if (this._startTimeProvided) return (0, core_1.millisToHrTime)(Date.now());
			const msDuration = core_1.otperformance.now() - this._performanceStartTime;
			return (0, core_1.addHrTimes)(this.startTime, (0, core_1.millisToHrTime)(msDuration));
		}
		isRecording() {
			return this._ended === false;
		}
		recordException(exception, time) {
			const attributes = {};
			if (typeof exception === "string") attributes[semantic_conventions_1.ATTR_EXCEPTION_MESSAGE] = exception;
			else if (exception) {
				if (exception.code) attributes[semantic_conventions_1.ATTR_EXCEPTION_TYPE] = exception.code.toString();
				else if (exception.name) attributes[semantic_conventions_1.ATTR_EXCEPTION_TYPE] = exception.name;
				if (exception.message) attributes[semantic_conventions_1.ATTR_EXCEPTION_MESSAGE] = exception.message;
				if (exception.stack) attributes[semantic_conventions_1.ATTR_EXCEPTION_STACKTRACE] = exception.stack;
			}
			if (attributes[semantic_conventions_1.ATTR_EXCEPTION_TYPE] || attributes[semantic_conventions_1.ATTR_EXCEPTION_MESSAGE]) this.addEvent(enums_1.ExceptionEventName, attributes, time);
			else api_1.diag.warn(`Failed to record an exception ${exception}`);
		}
		get duration() {
			return this._duration;
		}
		get ended() {
			return this._ended;
		}
		get droppedAttributesCount() {
			return this._droppedAttributesCount;
		}
		get droppedEventsCount() {
			return this._droppedEventsCount;
		}
		get droppedLinksCount() {
			return this._droppedLinksCount;
		}
		_isSpanEnded() {
			if (this._ended) {
				const error = /* @__PURE__ */ new Error(`Operation attempted on ended Span {traceId: ${this._spanContext.traceId}, spanId: ${this._spanContext.spanId}}`);
				api_1.diag.warn(`Cannot execute the operation on ended Span {traceId: ${this._spanContext.traceId}, spanId: ${this._spanContext.spanId}}`, error);
			}
			return this._ended;
		}
		_truncateToLimitUtil(value, limit) {
			if (value.length <= limit) return value;
			return value.substring(0, limit);
		}
		/**
		* If the given attribute value is of type string and has more characters than given {@code attributeValueLengthLimit} then
		* return string with truncated to {@code attributeValueLengthLimit} characters
		*
		* If the given attribute value is array of strings then
		* return new array of strings with each element truncated to {@code attributeValueLengthLimit} characters
		*
		* Otherwise return same Attribute {@code value}
		*
		* @param value Attribute value
		* @returns truncated attribute value if required, otherwise same value
		*/
		_truncateToSize(value) {
			const limit = this._attributeValueLengthLimit;
			if (limit <= 0) {
				api_1.diag.warn(`Attribute value limit must be positive, got ${limit}`);
				return value;
			}
			if (typeof value === "string") return this._truncateToLimitUtil(value, limit);
			if (Array.isArray(value)) return value.map((val) => typeof val === "string" ? this._truncateToLimitUtil(val, limit) : val);
			return value;
		}
		[inspect_1.inspectCustom](depth, options, inspect) {
			const payload = {
				name: this.name,
				kind: this.kind,
				spanContext: this._spanContext,
				parentSpanContext: this.parentSpanContext,
				status: this.status,
				startTime: this.startTime,
				endTime: this.endTime,
				duration: this._duration,
				ended: this._ended,
				attributes: this.attributes,
				events: this.events,
				links: this.links,
				droppedAttributesCount: this._droppedAttributesCount,
				droppedEventsCount: this._droppedEventsCount,
				droppedLinksCount: this._droppedLinksCount,
				instrumentationScope: this.instrumentationScope,
				resource: { attributes: (0, inspect_1.settledResourceAttributes)(this.resource) }
			};
			return (0, inspect_1.formatInspect)("SpanImpl", payload, depth, options, inspect);
		}
	};
	exports.SpanImpl = SpanImpl;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-trace/build/src/Sampler.js
var require_Sampler = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SamplingDecision = void 0;
	/**
	* A sampling decision that determines how a {@link Span} will be recorded
	* and collected.
	*/
	var SamplingDecision;
	(function(SamplingDecision) {
		/**
		* `Span.isRecording() === false`, span will not be recorded and all events
		* and attributes will be dropped.
		*/
		SamplingDecision[SamplingDecision["NOT_RECORD"] = 0] = "NOT_RECORD";
		/**
		* `Span.isRecording() === true`, but `Sampled` flag in {@link TraceFlags}
		* MUST NOT be set.
		*/
		SamplingDecision[SamplingDecision["RECORD"] = 1] = "RECORD";
		/**
		* `Span.isRecording() === true` AND `Sampled` flag in {@link TraceFlags}
		* MUST be set.
		*/
		SamplingDecision[SamplingDecision["RECORD_AND_SAMPLED"] = 2] = "RECORD_AND_SAMPLED";
	})(SamplingDecision || (exports.SamplingDecision = SamplingDecision = {}));
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-trace/build/src/semconv.js
var require_semconv$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.OTEL_COMPONENT_TYPE_VALUE_SIMPLE_SPAN_PROCESSOR = exports.OTEL_COMPONENT_TYPE_VALUE_BATCHING_SPAN_PROCESSOR = exports.METRIC_OTEL_SDK_SPAN_STARTED = exports.METRIC_OTEL_SDK_SPAN_LIVE = exports.METRIC_OTEL_SDK_PROCESSOR_SPAN_QUEUE_SIZE = exports.METRIC_OTEL_SDK_PROCESSOR_SPAN_QUEUE_CAPACITY = exports.METRIC_OTEL_SDK_PROCESSOR_SPAN_PROCESSED = exports.ATTR_OTEL_SPAN_SAMPLING_RESULT = exports.ATTR_OTEL_SPAN_PARENT_ORIGIN = exports.ATTR_OTEL_COMPONENT_TYPE = exports.ATTR_OTEL_COMPONENT_NAME = void 0;
	/**
	* A name uniquely identifying the instance of the OpenTelemetry component within its containing SDK instance.
	*
	* @example otlp_grpc_span_exporter/0
	* @example custom-name
	*
	* @note Implementations **SHOULD** ensure a low cardinality for this attribute, even across application or SDK restarts.
	* E.g. implementations **MUST NOT** use UUIDs as values for this attribute.
	*
	* Implementations **MAY** achieve these goals by following a `<otel.component.type>/<instance-counter>` pattern, e.g. `batching_span_processor/0`.
	* Hereby `otel.component.type` refers to the corresponding attribute value of the component.
	*
	* The value of `instance-counter` **MAY** be automatically assigned by the component and uniqueness within the enclosing SDK instance **MUST** be guaranteed.
	* For example, `<instance-counter>` **MAY** be implemented by using a monotonically increasing counter (starting with `0`), which is incremented every time an
	* instance of the given component type is started.
	*
	* With this implementation, for example the first Batching Span Processor would have `batching_span_processor/0`
	* as `otel.component.name`, the second one `batching_span_processor/1` and so on.
	* These values will therefore be reused in the case of an application restart.
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_OTEL_COMPONENT_NAME = "otel.component.name";
	/**
	* A name identifying the type of the OpenTelemetry component.
	*
	* @example batching_span_processor
	* @example com.example.MySpanExporter
	*
	* @note If none of the standardized values apply, implementations **SHOULD** use the language-defined name of the type.
	* E.g. for Java the fully qualified classname **SHOULD** be used in this case.
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_OTEL_COMPONENT_TYPE = "otel.component.type";
	/**
	* Determines whether the span has a parent span, and if so, [whether it is a remote parent](https://opentelemetry.io/docs/specs/otel/trace/api/#isremote)
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_OTEL_SPAN_PARENT_ORIGIN = "otel.span.parent.origin";
	/**
	* The result value of the sampler for this span
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_OTEL_SPAN_SAMPLING_RESULT = "otel.span.sampling_result";
	/**
	* The number of spans for which the processing has finished, either successful or failed.
	*
	* @note For successful processing, `error.type` **MUST NOT** be set. For failed processing, `error.type` **MUST** contain the failure cause.
	* For the SDK Simple and Batching Span Processor a span is considered to be processed already when it has been submitted to the exporter, not when the corresponding export call has finished.
	*
	* @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.METRIC_OTEL_SDK_PROCESSOR_SPAN_PROCESSED = "otel.sdk.processor.span.processed";
	/**
	* The maximum number of spans the queue of a given instance of an SDK span processor can hold.
	*
	* @note Only applies to span processors which use a queue, e.g. the SDK Batching Span Processor.
	*
	* @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.METRIC_OTEL_SDK_PROCESSOR_SPAN_QUEUE_CAPACITY = "otel.sdk.processor.span.queue.capacity";
	/**
	* The number of spans in the queue of a given instance of an SDK span processor.
	*
	* @note Only applies to span processors which use a queue, e.g. the SDK Batching Span Processor.
	*
	* @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.METRIC_OTEL_SDK_PROCESSOR_SPAN_QUEUE_SIZE = "otel.sdk.processor.span.queue.size";
	/**
	* The number of created spans with `recording=true` for which the end operation has not been called yet.
	*
	* @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.METRIC_OTEL_SDK_SPAN_LIVE = "otel.sdk.span.live";
	/**
	* The number of created spans.
	*
	* @note Implementations **MUST** record this metric for all spans, even for non-recording ones.
	*
	* @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.METRIC_OTEL_SDK_SPAN_STARTED = "otel.sdk.span.started";
	/**
	* Enum value "batching_span_processor" for attribute {@link ATTR_OTEL_COMPONENT_TYPE}.
	*
	* The builtin SDK batching span processor
	*
	* @experimental This enum value is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.OTEL_COMPONENT_TYPE_VALUE_BATCHING_SPAN_PROCESSOR = "batching_span_processor";
	/**
	* Enum value "simple_span_processor" for attribute {@link ATTR_OTEL_COMPONENT_TYPE}.
	*
	* The builtin SDK simple span processor
	*
	* @experimental This enum value is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.OTEL_COMPONENT_TYPE_VALUE_SIMPLE_SPAN_PROCESSOR = "simple_span_processor";
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-trace/build/src/TracerMetrics.js
var require_TracerMetrics = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.TracerMetrics = void 0;
	const Sampler_1 = require_Sampler();
	const semconv_1 = require_semconv$2();
	/**
	* Generates `otel.sdk.span.*` metrics.
	* https://opentelemetry.io/docs/specs/semconv/otel/sdk-metrics/#span-metrics
	*/
	var TracerMetrics = class {
		startedSpans;
		liveSpans;
		constructor(meter) {
			this.startedSpans = meter.createCounter(semconv_1.METRIC_OTEL_SDK_SPAN_STARTED, {
				unit: "{span}",
				description: "The number of created spans."
			});
			this.liveSpans = meter.createUpDownCounter(semconv_1.METRIC_OTEL_SDK_SPAN_LIVE, {
				unit: "{span}",
				description: "The number of currently live spans."
			});
		}
		startSpan(parentSpanCtx, samplingDecision) {
			const samplingDecisionStr = samplingDecisionToString(samplingDecision);
			this.startedSpans.add(1, {
				[semconv_1.ATTR_OTEL_SPAN_PARENT_ORIGIN]: parentOrigin(parentSpanCtx),
				[semconv_1.ATTR_OTEL_SPAN_SAMPLING_RESULT]: samplingDecisionStr
			});
			if (samplingDecision === Sampler_1.SamplingDecision.NOT_RECORD) return () => {};
			const liveSpanAttributes = { [semconv_1.ATTR_OTEL_SPAN_SAMPLING_RESULT]: samplingDecisionStr };
			this.liveSpans.add(1, liveSpanAttributes);
			return () => {
				this.liveSpans.add(-1, liveSpanAttributes);
			};
		}
	};
	exports.TracerMetrics = TracerMetrics;
	function parentOrigin(parentSpanContext) {
		if (!parentSpanContext) return "none";
		if (parentSpanContext.isRemote) return "remote";
		return "local";
	}
	function samplingDecisionToString(decision) {
		switch (decision) {
			case Sampler_1.SamplingDecision.RECORD_AND_SAMPLED: return "RECORD_AND_SAMPLE";
			case Sampler_1.SamplingDecision.RECORD: return "RECORD_ONLY";
			case Sampler_1.SamplingDecision.NOT_RECORD: return "DROP";
		}
	}
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-trace/build/src/version.js
var require_version$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.VERSION = void 0;
	exports.VERSION = "2.10.0";
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-trace/build/src/Tracer.js
var require_Tracer = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Tracer = void 0;
	const api = (init_esm$2(), __toCommonJS(esm_exports$2));
	const core_1 = require_src$13();
	const Span_1 = require_Span();
	const TracerMetrics_1 = require_TracerMetrics();
	const version_1 = require_version$1();
	const inspect_1 = require_inspect();
	/**
	* This class represents a basic tracer.
	*/
	var Tracer = class {
		_sampler;
		_spanLimits;
		_idGenerator;
		instrumentationScope;
		_resource;
		_spanProcessor;
		_tracerMetrics;
		/**
		* Constructs a new Tracer instance.
		*/
		constructor(instrumentationScope, options) {
			this.instrumentationScope = instrumentationScope;
			this._sampler = options.sampler;
			this._spanLimits = options.spanLimits;
			this._resource = options.resource;
			this._idGenerator = options.idGenerator;
			this._spanProcessor = options.spanProcessor;
			const meter = options.meterProvider.getMeter("@opentelemetry/sdk-trace", version_1.VERSION);
			this._tracerMetrics = new TracerMetrics_1.TracerMetrics(meter);
		}
		/**
		* Starts a new Span or returns the default NoopSpan based on the sampling
		* decision.
		*/
		startSpan(name, options = {}, context = api.context.active()) {
			if (options.root) context = api.trace.deleteSpan(context);
			const parentSpan = api.trace.getSpan(context);
			if ((0, core_1.isTracingSuppressed)(context)) {
				api.diag.debug("Instrumentation suppressed, returning Noop Span");
				return api.trace.wrapSpanContext(api.INVALID_SPAN_CONTEXT);
			}
			const parentSpanContext = parentSpan?.spanContext();
			const spanId = this._idGenerator.generateSpanId();
			let validParentSpanContext;
			let traceId;
			let traceState;
			if (!parentSpanContext || !api.trace.isSpanContextValid(parentSpanContext)) traceId = this._idGenerator.generateTraceId();
			else {
				traceId = parentSpanContext.traceId;
				traceState = parentSpanContext.traceState;
				validParentSpanContext = parentSpanContext;
			}
			const spanKind = options.kind ?? api.SpanKind.INTERNAL;
			const links = (options.links ?? []).map((link) => {
				return {
					context: link.context,
					attributes: (0, core_1.sanitizeAttributes)(link.attributes)
				};
			});
			const attributes = (0, core_1.sanitizeAttributes)(options.attributes);
			const samplingResult = this._sampler.shouldSample(context, traceId, name, spanKind, attributes, links);
			const recordEndMetrics = this._tracerMetrics.startSpan(parentSpanContext, samplingResult.decision);
			traceState = samplingResult.traceState ?? traceState;
			const traceFlags = samplingResult.decision === api.SamplingDecision.RECORD_AND_SAMPLED ? api.TraceFlags.SAMPLED : api.TraceFlags.NONE;
			const spanContext = {
				traceId,
				spanId,
				traceFlags,
				traceState
			};
			if (samplingResult.decision === api.SamplingDecision.NOT_RECORD) {
				api.diag.debug("Recording is off, propagating context in a non-recording span");
				return api.trace.wrapSpanContext(spanContext);
			}
			const initAttributes = (0, core_1.sanitizeAttributes)(Object.assign(attributes, samplingResult.attributes));
			return new Span_1.SpanImpl({
				resource: this._resource,
				scope: this.instrumentationScope,
				context,
				spanContext,
				name,
				kind: spanKind,
				links,
				parentSpanContext: validParentSpanContext,
				attributes: initAttributes,
				startTime: options.startTime,
				spanProcessor: this._spanProcessor,
				spanLimits: this._spanLimits,
				recordEndMetrics
			});
		}
		startActiveSpan(name, arg2, arg3, arg4) {
			let opts;
			let ctx;
			let fn;
			if (arguments.length < 2) return;
			else if (arguments.length === 2) fn = arg2;
			else if (arguments.length === 3) {
				opts = arg2;
				fn = arg3;
			} else {
				opts = arg2;
				ctx = arg3;
				fn = arg4;
			}
			const parentContext = ctx ?? api.context.active();
			const span = this.startSpan(name, opts, parentContext);
			const contextWithSpanSet = api.trace.setSpan(parentContext, span);
			return api.context.with(contextWithSpanSet, fn, void 0, span);
		}
		[inspect_1.inspectCustom](depth, options, inspect) {
			const payload = {
				instrumentationScope: this.instrumentationScope,
				resource: { attributes: (0, inspect_1.settledResourceAttributes)(this._resource) },
				spanLimits: this._spanLimits
			};
			return (0, inspect_1.formatInspect)("Tracer", payload, depth, options, inspect);
		}
	};
	exports.Tracer = Tracer;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-trace/build/src/MultiSpanProcessor.js
var require_MultiSpanProcessor = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MultiSpanProcessor = void 0;
	const core_1 = require_src$13();
	/**
	* Implementation of the {@link SpanProcessor} that simply forwards all
	* received events to a list of {@link SpanProcessor}s.
	*/
	var MultiSpanProcessor = class {
		_spanProcessors;
		constructor(spanProcessors) {
			this._spanProcessors = spanProcessors;
		}
		forceFlush() {
			const promises = [];
			for (const spanProcessor of this._spanProcessors) promises.push(spanProcessor.forceFlush());
			return new Promise((resolve) => {
				Promise.all(promises).then(() => {
					resolve();
				}).catch((error) => {
					(0, core_1.globalErrorHandler)(error || /* @__PURE__ */ new Error("MultiSpanProcessor: forceFlush failed"));
					resolve();
				});
			});
		}
		onStart(span, context) {
			for (const spanProcessor of this._spanProcessors) spanProcessor.onStart(span, context);
		}
		onEnding(span) {
			for (const spanProcessor of this._spanProcessors) if (spanProcessor.onEnding) spanProcessor.onEnding(span);
		}
		onEnd(span) {
			for (const spanProcessor of this._spanProcessors) spanProcessor.onEnd(span);
		}
		shutdown() {
			const promises = [];
			for (const spanProcessor of this._spanProcessors) promises.push(spanProcessor.shutdown());
			return new Promise((resolve, reject) => {
				Promise.all(promises).then(() => {
					resolve();
				}, reject);
			});
		}
	};
	exports.MultiSpanProcessor = MultiSpanProcessor;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-trace/build/src/sampler/AlwaysOffSampler.js
var require_AlwaysOffSampler = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AlwaysOffSampler = void 0;
	const Sampler_1 = require_Sampler();
	/** Sampler that samples no traces. */
	var AlwaysOffSampler = class {
		shouldSample() {
			return { decision: Sampler_1.SamplingDecision.NOT_RECORD };
		}
		toString() {
			return "AlwaysOffSampler";
		}
	};
	exports.AlwaysOffSampler = AlwaysOffSampler;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-trace/build/src/sampler/AlwaysOnSampler.js
var require_AlwaysOnSampler = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AlwaysOnSampler = void 0;
	const Sampler_1 = require_Sampler();
	/** Sampler that samples all traces. */
	var AlwaysOnSampler = class {
		shouldSample() {
			return { decision: Sampler_1.SamplingDecision.RECORD_AND_SAMPLED };
		}
		toString() {
			return "AlwaysOnSampler";
		}
	};
	exports.AlwaysOnSampler = AlwaysOnSampler;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-trace/build/src/sampler/ParentBasedSampler.js
var require_ParentBasedSampler = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ParentBasedSampler = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const core_1 = require_src$13();
	const AlwaysOffSampler_1 = require_AlwaysOffSampler();
	const AlwaysOnSampler_1 = require_AlwaysOnSampler();
	/**
	* A composite sampler that either respects the parent span's sampling decision
	* or delegates to `delegateSampler` for root spans.
	*/
	var ParentBasedSampler = class {
		_root;
		_remoteParentSampled;
		_remoteParentNotSampled;
		_localParentSampled;
		_localParentNotSampled;
		constructor(config) {
			this._root = config.root;
			if (!this._root) {
				(0, core_1.globalErrorHandler)(/* @__PURE__ */ new Error("ParentBasedSampler must have a root sampler configured"));
				this._root = new AlwaysOnSampler_1.AlwaysOnSampler();
			}
			this._remoteParentSampled = config.remoteParentSampled ?? new AlwaysOnSampler_1.AlwaysOnSampler();
			this._remoteParentNotSampled = config.remoteParentNotSampled ?? new AlwaysOffSampler_1.AlwaysOffSampler();
			this._localParentSampled = config.localParentSampled ?? new AlwaysOnSampler_1.AlwaysOnSampler();
			this._localParentNotSampled = config.localParentNotSampled ?? new AlwaysOffSampler_1.AlwaysOffSampler();
		}
		shouldSample(context, traceId, spanName, spanKind, attributes, links) {
			const parentContext = api_1.trace.getSpanContext(context);
			if (!parentContext || !(0, api_1.isSpanContextValid)(parentContext)) return this._root.shouldSample(context, traceId, spanName, spanKind, attributes, links);
			if (parentContext.isRemote) {
				if (parentContext.traceFlags & api_1.TraceFlags.SAMPLED) return this._remoteParentSampled.shouldSample(context, traceId, spanName, spanKind, attributes, links);
				return this._remoteParentNotSampled.shouldSample(context, traceId, spanName, spanKind, attributes, links);
			}
			if (parentContext.traceFlags & api_1.TraceFlags.SAMPLED) return this._localParentSampled.shouldSample(context, traceId, spanName, spanKind, attributes, links);
			return this._localParentNotSampled.shouldSample(context, traceId, spanName, spanKind, attributes, links);
		}
		toString() {
			return `ParentBased{root=${this._root.toString()}, remoteParentSampled=${this._remoteParentSampled.toString()}, remoteParentNotSampled=${this._remoteParentNotSampled.toString()}, localParentSampled=${this._localParentSampled.toString()}, localParentNotSampled=${this._localParentNotSampled.toString()}}`;
		}
	};
	exports.ParentBasedSampler = ParentBasedSampler;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-trace/build/src/export/SpanProcessorMetrics.js
var require_SpanProcessorMetrics = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SpanProcessorMetrics = void 0;
	const semantic_conventions_1 = (init_esm$1(), __toCommonJS(esm_exports$1));
	const semconv_1 = require_semconv$2();
	const componentCounter = /* @__PURE__ */ new Map();
	var SpanProcessorMetrics = class {
		processedSpans;
		queueSize;
		queueSizeCallback;
		standardAttrs;
		droppedAttrs;
		constructor(componentType, meter, queueConfig) {
			const counter = componentCounter.get(componentType) ?? 0;
			componentCounter.set(componentType, counter + 1);
			this.standardAttrs = {
				[semconv_1.ATTR_OTEL_COMPONENT_TYPE]: componentType,
				[semconv_1.ATTR_OTEL_COMPONENT_NAME]: `${componentType}/${counter}`
			};
			this.droppedAttrs = {
				...this.standardAttrs,
				[semantic_conventions_1.ATTR_ERROR_TYPE]: "queue_full"
			};
			this.processedSpans = meter.createCounter(semconv_1.METRIC_OTEL_SDK_PROCESSOR_SPAN_PROCESSED, {
				unit: "{span}",
				description: "The number of spans for which the processing has finished, either successful or failed."
			});
			if (queueConfig) {
				const { capacity, getQueueSize } = queueConfig;
				meter.createUpDownCounter(semconv_1.METRIC_OTEL_SDK_PROCESSOR_SPAN_QUEUE_CAPACITY, {
					unit: "{span}",
					description: "The maximum number of spans the queue of a given instance of an SDK span processor can hold."
				}).add(capacity, this.standardAttrs);
				this.queueSize = meter.createObservableUpDownCounter(semconv_1.METRIC_OTEL_SDK_PROCESSOR_SPAN_QUEUE_SIZE, {
					unit: "{span}",
					description: "The number of spans in the queue of a given instance of an SDK span processor."
				});
				this.queueSizeCallback = (result) => result.observe(getQueueSize(), this.standardAttrs);
				this.queueSize.addCallback(this.queueSizeCallback);
			}
		}
		dropSpans(count) {
			this.processedSpans.add(count, this.droppedAttrs);
		}
		finishSpans(count, error) {
			if (!error) {
				this.processedSpans.add(count, this.standardAttrs);
				return;
			}
			const attrs = {
				...this.standardAttrs,
				[semantic_conventions_1.ATTR_ERROR_TYPE]: error.name
			};
			this.processedSpans.add(count, attrs);
		}
		shutdown() {
			if (this.queueSize && this.queueSizeCallback) this.queueSize.removeCallback(this.queueSizeCallback);
		}
	};
	exports.SpanProcessorMetrics = SpanProcessorMetrics;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-trace/build/src/export/BatchSpanProcessorBase.js
var require_BatchSpanProcessorBase = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.BatchSpanProcessorBase = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const core_1 = require_src$13();
	const SpanProcessorMetrics_1 = require_SpanProcessorMetrics();
	const semconv_1 = require_semconv$2();
	/**
	* Implementation of the {@link SpanProcessor} that batches spans exported by
	* the SDK then pushes them to the exporter pipeline.
	*/
	var BatchSpanProcessorBase = class {
		_maxExportBatchSize;
		_maxQueueSize;
		_scheduledDelayMillis;
		_exportTimeoutMillis;
		_exporter;
		_metrics;
		_isExporting = false;
		_finishedSpans = [];
		_timer;
		_shutdownOnce;
		_droppedSpansCount = 0;
		constructor(options) {
			this._exporter = options.exporter;
			this._maxExportBatchSize = options.maxExportBatchSize ?? 512;
			this._maxQueueSize = options.maxQueueSize ?? 2048;
			this._scheduledDelayMillis = options.scheduledDelayMillis ?? 5e3;
			this._exportTimeoutMillis = options.exportTimeoutMillis ?? 3e4;
			this._shutdownOnce = new core_1.BindOnceFuture(this._shutdown, this);
			if (this._maxExportBatchSize > this._maxQueueSize) {
				api_1.diag.warn("BatchSpanProcessor: maxExportBatchSize must be smaller or equal to maxQueueSize, setting maxExportBatchSize to match maxQueueSize");
				this._maxExportBatchSize = this._maxQueueSize;
			}
			const meter = options.selfObsMeterProvider ? options.selfObsMeterProvider.getMeter("@opentelemetry/sdk-trace") : (0, api_1.createNoopMeter)();
			this._metrics = new SpanProcessorMetrics_1.SpanProcessorMetrics(semconv_1.OTEL_COMPONENT_TYPE_VALUE_BATCHING_SPAN_PROCESSOR, meter, {
				capacity: this._maxQueueSize,
				getQueueSize: () => this._finishedSpans.length
			});
		}
		forceFlush() {
			if (this._shutdownOnce.isCalled) return this._shutdownOnce.promise;
			return this._flushAll();
		}
		onStart(_span, _parentContext) {}
		onEnd(span) {
			if (this._shutdownOnce.isCalled) return;
			if ((span.spanContext().traceFlags & api_1.TraceFlags.SAMPLED) === 0) return;
			this._addToBuffer(span);
		}
		shutdown() {
			return this._shutdownOnce.call();
		}
		_shutdown() {
			return Promise.resolve().then(() => {
				return this.onShutdown();
			}).then(() => {
				return this._flushAll();
			}).then(() => {
				this._metrics.shutdown();
				return this._exporter.shutdown();
			});
		}
		/** Add a span in the buffer. */
		_addToBuffer(span) {
			if (this._finishedSpans.length >= this._maxQueueSize) {
				if (this._droppedSpansCount === 0) api_1.diag.debug("maxQueueSize reached, dropping spans");
				this._droppedSpansCount++;
				this._metrics.dropSpans(1);
				return;
			}
			if (this._droppedSpansCount > 0) {
				api_1.diag.warn(`Dropped ${this._droppedSpansCount} spans because maxQueueSize reached`);
				this._droppedSpansCount = 0;
			}
			this._finishedSpans.push(span);
			this._maybeStartTimer();
		}
		/**
		* Send all spans to the exporter respecting the batch size limit
		* This function is used only on forceFlush or shutdown,
		* for all other cases _flush should be used
		* */
		_flushAll() {
			return new Promise((resolve, reject) => {
				const promises = [];
				const count = Math.ceil(this._finishedSpans.length / this._maxExportBatchSize);
				for (let i = 0, j = count; i < j; i++) promises.push(this._flushOneBatch());
				Promise.all(promises).then(() => {
					resolve();
				}).catch(reject);
			});
		}
		_flushOneBatch() {
			this._clearTimer();
			if (this._finishedSpans.length === 0) return Promise.resolve();
			return new Promise((resolve, reject) => {
				const timer = setTimeout(() => {
					reject(/* @__PURE__ */ new Error("Timeout"));
				}, this._exportTimeoutMillis);
				api_1.context.with((0, core_1.suppressTracing)(api_1.context.active()), () => {
					let spans;
					if (this._finishedSpans.length <= this._maxExportBatchSize) {
						spans = this._finishedSpans;
						this._finishedSpans = [];
					} else spans = this._finishedSpans.splice(0, this._maxExportBatchSize);
					const doExport = () => this._exporter.export(spans, (result) => {
						clearTimeout(timer);
						this._metrics.finishSpans(spans.length, result.error);
						if (result.code === core_1.ExportResultCode.SUCCESS) resolve();
						else reject(result.error ?? /* @__PURE__ */ new Error("BatchSpanProcessor: span export failed"));
					});
					let pendingResources = null;
					for (let i = 0, len = spans.length; i < len; i++) {
						const span = spans[i];
						if (span.resource.asyncAttributesPending && span.resource.waitForAsyncAttributes) {
							pendingResources ??= [];
							pendingResources.push(span.resource.waitForAsyncAttributes());
						}
					}
					if (pendingResources === null) doExport();
					else Promise.all(pendingResources).then(doExport, (err) => {
						(0, core_1.globalErrorHandler)(err);
						reject(err);
					});
				});
			});
		}
		_maybeStartTimer() {
			if (this._isExporting) return;
			const flush = () => {
				this._isExporting = true;
				this._flushOneBatch().finally(() => {
					this._isExporting = false;
					if (this._finishedSpans.length > 0) {
						this._clearTimer();
						this._maybeStartTimer();
					}
				}).catch((e) => {
					this._isExporting = false;
					(0, core_1.globalErrorHandler)(e);
				});
			};
			if (this._finishedSpans.length >= this._maxExportBatchSize) return flush();
			if (this._timer !== void 0) return;
			this._timer = setTimeout(() => flush(), this._scheduledDelayMillis);
			if (typeof this._timer !== "number") this._timer.unref();
		}
		_clearTimer() {
			if (this._timer !== void 0) {
				clearTimeout(this._timer);
				this._timer = void 0;
			}
		}
	};
	exports.BatchSpanProcessorBase = BatchSpanProcessorBase;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-trace/build/src/platform/node/export/BatchSpanProcessor.js
var require_BatchSpanProcessor = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.BatchSpanProcessor = void 0;
	const BatchSpanProcessorBase_1 = require_BatchSpanProcessorBase();
	var BatchSpanProcessor = class extends BatchSpanProcessorBase_1.BatchSpanProcessorBase {
		onShutdown() {}
	};
	exports.BatchSpanProcessor = BatchSpanProcessor;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-trace/build/src/platform/node/RandomIdGenerator.js
var require_RandomIdGenerator = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.RandomIdGenerator = void 0;
	const SPAN_ID_BYTES = 8;
	const TRACE_ID_BYTES = 16;
	var RandomIdGenerator = class {
		/**
		* Returns a random 16-byte trace ID formatted/encoded as a 32 lowercase hex
		* characters corresponding to 128 bits.
		*/
		generateTraceId = getIdGenerator(TRACE_ID_BYTES);
		/**
		* Returns a random 8-byte span ID formatted/encoded as a 16 lowercase hex
		* characters corresponding to 64 bits.
		*/
		generateSpanId = getIdGenerator(SPAN_ID_BYTES);
	};
	exports.RandomIdGenerator = RandomIdGenerator;
	const SHARED_BUFFER = Buffer.allocUnsafe(TRACE_ID_BYTES);
	function getIdGenerator(bytes) {
		return function generateId() {
			for (let i = 0; i < bytes / 4; i++) SHARED_BUFFER.writeUInt32BE(Math.random() * 2 ** 32 >>> 0, i * 4);
			for (let i = 0; i < bytes; i++) if (SHARED_BUFFER[i] > 0) break;
			else if (i === bytes - 1) SHARED_BUFFER[bytes - 1] = 1;
			return SHARED_BUFFER.toString("hex", 0, bytes);
		};
	}
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-trace/build/src/platform/node/index.js
var require_node$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.RandomIdGenerator = exports.BatchSpanProcessor = void 0;
	var BatchSpanProcessor_1 = require_BatchSpanProcessor();
	Object.defineProperty(exports, "BatchSpanProcessor", {
		enumerable: true,
		get: function() {
			return BatchSpanProcessor_1.BatchSpanProcessor;
		}
	});
	var RandomIdGenerator_1 = require_RandomIdGenerator();
	Object.defineProperty(exports, "RandomIdGenerator", {
		enumerable: true,
		get: function() {
			return RandomIdGenerator_1.RandomIdGenerator;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-trace/build/src/platform/index.js
var require_platform$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.RandomIdGenerator = exports.BatchSpanProcessor = void 0;
	var node_1 = require_node$2();
	Object.defineProperty(exports, "BatchSpanProcessor", {
		enumerable: true,
		get: function() {
			return node_1.BatchSpanProcessor;
		}
	});
	Object.defineProperty(exports, "RandomIdGenerator", {
		enumerable: true,
		get: function() {
			return node_1.RandomIdGenerator;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-trace/build/src/TracerProvider.js
var require_TracerProvider = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.TracerProvider = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const resources_1 = require_src$12();
	const Tracer_1 = require_Tracer();
	const MultiSpanProcessor_1 = require_MultiSpanProcessor();
	const ParentBasedSampler_1 = require_ParentBasedSampler();
	const AlwaysOnSampler_1 = require_AlwaysOnSampler();
	const platform_1 = require_platform$2();
	const inspect_1 = require_inspect();
	var ForceFlushState;
	(function(ForceFlushState) {
		ForceFlushState[ForceFlushState["resolved"] = 0] = "resolved";
		ForceFlushState[ForceFlushState["timeout"] = 1] = "timeout";
		ForceFlushState[ForceFlushState["error"] = 2] = "error";
		ForceFlushState[ForceFlushState["unresolved"] = 3] = "unresolved";
	})(ForceFlushState || (ForceFlushState = {}));
	/**
	* This class represents a basic tracer provider which platform libraries can extend
	*/
	var TracerProvider = class {
		_resource;
		_activeSpanProcessor;
		_forceFlushTimeoutMillis;
		_tracerOptions;
		_tracers = /* @__PURE__ */ new Map();
		constructor(options = {}) {
			this._forceFlushTimeoutMillis = options.forceFlushTimeoutMillis ?? 3e4;
			this._resource = options.resource ?? (0, resources_1.defaultResource)();
			const spanProcessors = options.spanProcessors ?? [];
			this._activeSpanProcessor = new MultiSpanProcessor_1.MultiSpanProcessor(spanProcessors);
			this._tracerOptions = {
				resource: this._resource,
				sampler: options.sampler ?? new ParentBasedSampler_1.ParentBasedSampler({ root: new AlwaysOnSampler_1.AlwaysOnSampler() }),
				spanLimits: {
					attributeCountLimit: options.spanLimits?.attributeCountLimit ?? 128,
					attributeValueLengthLimit: options.spanLimits?.attributeValueLengthLimit ?? Infinity,
					eventCountLimit: options.spanLimits?.eventCountLimit ?? 128,
					linkCountLimit: options.spanLimits?.linkCountLimit ?? 128,
					attributePerEventCountLimit: options.spanLimits?.attributePerEventCountLimit ?? 128,
					attributePerLinkCountLimit: options.spanLimits?.attributePerLinkCountLimit ?? 128
				},
				idGenerator: options.idGenerator || new platform_1.RandomIdGenerator(),
				spanProcessor: this._activeSpanProcessor,
				meterProvider: options.meterProvider ?? { getMeter() {
					return (0, api_1.createNoopMeter)();
				} }
			};
		}
		getTracer(name, version, options) {
			const key = `${name}@${version || ""}:${options?.schemaUrl || ""}`;
			if (!this._tracers.has(key)) this._tracers.set(key, new Tracer_1.Tracer({
				name,
				version,
				schemaUrl: options?.schemaUrl
			}, this._tracerOptions));
			return this._tracers.get(key);
		}
		forceFlush() {
			const timeout = this._forceFlushTimeoutMillis;
			const promises = this._activeSpanProcessor["_spanProcessors"].map((spanProcessor) => {
				return new Promise((resolve) => {
					let state;
					const timeoutInterval = setTimeout(() => {
						resolve(/* @__PURE__ */ new Error(`Span processor did not completed within timeout period of ${timeout} ms`));
						state = ForceFlushState.timeout;
					}, timeout);
					spanProcessor.forceFlush().then(() => {
						clearTimeout(timeoutInterval);
						if (state !== ForceFlushState.timeout) {
							state = ForceFlushState.resolved;
							resolve(state);
						}
					}).catch((error) => {
						clearTimeout(timeoutInterval);
						state = ForceFlushState.error;
						resolve(error);
					});
				});
			});
			return new Promise((resolve, reject) => {
				Promise.all(promises).then((results) => {
					const errors = results.filter((result) => result !== ForceFlushState.resolved);
					if (errors.length > 0) reject(errors);
					else resolve();
				}).catch((error) => reject([error]));
			});
		}
		shutdown() {
			return this._activeSpanProcessor.shutdown();
		}
		[inspect_1.inspectCustom](depth, options, inspect) {
			const processors = this._activeSpanProcessor["_spanProcessors"];
			const payload = {
				resource: { attributes: (0, inspect_1.settledResourceAttributes)(this._resource) },
				tracers: Array.from(this._tracers.keys()),
				spanProcessors: processors.map((p) => p.constructor?.name ?? "SpanProcessor")
			};
			return (0, inspect_1.formatInspect)("TracerProvider", payload, depth, options, inspect);
		}
	};
	exports.TracerProvider = TracerProvider;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-trace/build/src/export/ConsoleSpanExporter.js
var require_ConsoleSpanExporter = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ConsoleSpanExporter = void 0;
	const core_1 = require_src$13();
	/**
	* This is implementation of {@link SpanExporter} that prints spans to the
	* console. This class can be used for diagnostic purposes.
	*
	* NOTE: This {@link SpanExporter} is intended for diagnostics use only, output rendered to the console may change at any time.
	*/
	var ConsoleSpanExporter = class {
		/**
		* Export spans.
		* @param spans
		* @param resultCallback
		*/
		export(spans, resultCallback) {
			return this._sendSpans(spans, resultCallback);
		}
		/**
		* Shutdown the exporter.
		*/
		shutdown() {
			this._sendSpans([]);
			return this.forceFlush();
		}
		/**
		* Exports any pending spans in exporter
		*/
		forceFlush() {
			return Promise.resolve();
		}
		/**
		* converts span info into more readable format
		* @param span
		*/
		_exportInfo(span) {
			return {
				resource: { attributes: span.resource.attributes },
				instrumentationScope: span.instrumentationScope,
				traceId: span.spanContext().traceId,
				parentSpanContext: span.parentSpanContext,
				traceState: span.spanContext().traceState?.serialize(),
				name: span.name,
				id: span.spanContext().spanId,
				kind: span.kind,
				timestamp: (0, core_1.hrTimeToMicroseconds)(span.startTime),
				duration: (0, core_1.hrTimeToMicroseconds)(span.duration),
				attributes: span.attributes,
				status: span.status,
				events: span.events,
				links: span.links
			};
		}
		/**
		* Showing spans in console
		* @param spans
		* @param done
		*/
		_sendSpans(spans, done) {
			for (const span of spans) console.dir(this._exportInfo(span), { depth: 3 });
			if (done) return done({ code: core_1.ExportResultCode.SUCCESS });
		}
	};
	exports.ConsoleSpanExporter = ConsoleSpanExporter;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-trace/build/src/export/InMemorySpanExporter.js
var require_InMemorySpanExporter = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.InMemorySpanExporter = void 0;
	const core_1 = require_src$13();
	/**
	* This class can be used for testing purposes. It stores the exported spans
	* in a list in memory that can be retrieved using the `getFinishedSpans()`
	* method.
	*/
	var InMemorySpanExporter = class {
		_finishedSpans = [];
		/**
		* Indicates if the exporter has been "shutdown."
		* When false, exported spans will not be stored in-memory.
		*/
		_stopped = false;
		export(spans, resultCallback) {
			if (this._stopped) return resultCallback({
				code: core_1.ExportResultCode.FAILED,
				error: /* @__PURE__ */ new Error("Exporter has been stopped")
			});
			this._finishedSpans.push(...spans);
			setTimeout(() => resultCallback({ code: core_1.ExportResultCode.SUCCESS }), 0);
		}
		shutdown() {
			this._stopped = true;
			this._finishedSpans = [];
			return this.forceFlush();
		}
		/**
		* Exports any pending spans in the exporter
		*/
		forceFlush() {
			return Promise.resolve();
		}
		reset() {
			this._finishedSpans = [];
		}
		getFinishedSpans() {
			return this._finishedSpans;
		}
	};
	exports.InMemorySpanExporter = InMemorySpanExporter;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-trace/build/src/export/SimpleSpanProcessor.js
var require_SimpleSpanProcessor = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SimpleSpanProcessor = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const core_1 = require_src$13();
	const SpanProcessorMetrics_1 = require_SpanProcessorMetrics();
	const semconv_1 = require_semconv$2();
	/**
	* An implementation of the {@link SpanProcessor} that converts the {@link Span}
	* to {@link ReadableSpan} and passes it to the configured exporter.
	*
	* Only spans that are sampled are converted.
	*
	* NOTE: This {@link SpanProcessor} exports every ended span individually instead of batching spans together, which causes significant performance overhead with most exporters. For production use, please consider using the {@link BatchSpanProcessor} instead.
	*/
	var SimpleSpanProcessor = class {
		_exporter;
		_metrics;
		_shutdownOnce;
		_pendingExports;
		constructor(options) {
			this._exporter = options.exporter;
			this._shutdownOnce = new core_1.BindOnceFuture(this._shutdown, this);
			this._pendingExports = /* @__PURE__ */ new Set();
			const meter = options.selfObsMeterProvider ? options.selfObsMeterProvider.getMeter("@opentelemetry/sdk-trace") : (0, api_1.createNoopMeter)();
			this._metrics = new SpanProcessorMetrics_1.SpanProcessorMetrics(semconv_1.OTEL_COMPONENT_TYPE_VALUE_SIMPLE_SPAN_PROCESSOR, meter);
		}
		async forceFlush() {
			let pendingExportError;
			let pendingExportRejected = false;
			try {
				await Promise.all(Array.from(this._pendingExports));
			} catch (err) {
				pendingExportError = err;
				pendingExportRejected = true;
			}
			if (this._exporter.forceFlush) await this._exporter.forceFlush();
			if (pendingExportRejected) throw pendingExportError;
		}
		onStart(_span, _parentContext) {}
		onEnd(span) {
			if (this._shutdownOnce.isCalled) return;
			if ((span.spanContext().traceFlags & api_1.TraceFlags.SAMPLED) === 0) return;
			const pendingExport = this._doExport(span);
			this._pendingExports.add(pendingExport);
			pendingExport.then(() => {
				this._pendingExports.delete(pendingExport);
			}, (err) => {
				(0, core_1.globalErrorHandler)(err);
				this._pendingExports.delete(pendingExport);
			});
		}
		async _doExport(span) {
			if (span.resource.asyncAttributesPending) await span.resource.waitForAsyncAttributes?.();
			const result = await core_1.internal._export(this._exporter, [span]);
			this._metrics.finishSpans(1, result.error);
			if (result.code !== core_1.ExportResultCode.SUCCESS) throw result.error ?? /* @__PURE__ */ new Error(`SimpleSpanProcessor: span export failed (status ${result})`);
		}
		shutdown() {
			return this._shutdownOnce.call();
		}
		_shutdown() {
			this._metrics.shutdown();
			return this._exporter.shutdown();
		}
	};
	exports.SimpleSpanProcessor = SimpleSpanProcessor;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-trace/build/src/export/NoopSpanProcessor.js
var require_NoopSpanProcessor = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.NoopSpanProcessor = void 0;
	/** No-op implementation of SpanProcessor */
	var NoopSpanProcessor = class {
		onStart(_span, _context) {}
		onEnd(_span) {}
		shutdown() {
			return Promise.resolve();
		}
		forceFlush() {
			return Promise.resolve();
		}
	};
	exports.NoopSpanProcessor = NoopSpanProcessor;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-trace/build/src/sampler/AlwaysRecordSampler.js
var require_AlwaysRecordSampler = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createAlwaysRecordSampler = void 0;
	const Sampler_1 = require_Sampler();
	/**
	* Creates a sampler that wraps a delegate and upgrades NOT_RECORD decisions to
	* RECORD, ensuring all spans are recorded without affecting the sampling rate.
	*/
	function createAlwaysRecordSampler(delegate) {
		if (!delegate) throw new Error("createAlwaysRecordSampler requires a delegate sampler");
		return {
			shouldSample(context, traceId, spanName, spanKind, attributes, links) {
				const result = delegate.shouldSample(context, traceId, spanName, spanKind, attributes, links);
				if (result.decision === Sampler_1.SamplingDecision.NOT_RECORD) return {
					decision: Sampler_1.SamplingDecision.RECORD,
					attributes: result.attributes,
					traceState: result.traceState
				};
				return result;
			},
			toString() {
				return `AlwaysRecordSampler{${delegate.toString()}}`;
			}
		};
	}
	exports.createAlwaysRecordSampler = createAlwaysRecordSampler;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-trace/build/src/sampler/TraceIdRatioBasedSampler.js
var require_TraceIdRatioBasedSampler = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.TraceIdRatioBasedSampler = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const Sampler_1 = require_Sampler();
	/** Sampler that samples a given fraction of traces based of trace id deterministically. */
	var TraceIdRatioBasedSampler = class {
		_ratio;
		_upperBound;
		constructor(ratio = 0) {
			this._ratio = this._normalize(ratio);
			this._upperBound = this._ratio === 1 ? 4294967296 : Math.floor(this._ratio * 4294967295);
		}
		shouldSample(context, traceId) {
			return { decision: (0, api_1.isValidTraceId)(traceId) && this._accumulate(traceId) < this._upperBound ? Sampler_1.SamplingDecision.RECORD_AND_SAMPLED : Sampler_1.SamplingDecision.NOT_RECORD };
		}
		toString() {
			return `TraceIdRatioBased{${this._ratio}}`;
		}
		_normalize(ratio) {
			if (typeof ratio !== "number" || isNaN(ratio)) return 0;
			return ratio >= 1 ? 1 : ratio <= 0 ? 0 : ratio;
		}
		_accumulate(traceId) {
			let accumulation = 0;
			for (let i = 0; i < 32; i += 8) {
				let part = 0;
				for (let j = 0; j < 8; j++) {
					const c = traceId.charCodeAt(i + j);
					const v = c < 58 ? c - 48 : c < 71 ? c - 55 : c - 87;
					part = part << 4 | v;
				}
				accumulation = (accumulation ^ part) >>> 0;
			}
			return accumulation;
		}
	};
	exports.TraceIdRatioBasedSampler = TraceIdRatioBasedSampler;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-trace/build/src/index.js
var require_src$5 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SamplingDecision = exports.TraceIdRatioBasedSampler = exports.ParentBasedSampler = exports.createAlwaysRecordSampler = exports.AlwaysOnSampler = exports.AlwaysOffSampler = exports.NoopSpanProcessor = exports.SimpleSpanProcessor = exports.InMemorySpanExporter = exports.ConsoleSpanExporter = exports.RandomIdGenerator = exports.BatchSpanProcessor = exports.TracerProvider = void 0;
	var TracerProvider_1 = require_TracerProvider();
	Object.defineProperty(exports, "TracerProvider", {
		enumerable: true,
		get: function() {
			return TracerProvider_1.TracerProvider;
		}
	});
	var platform_1 = require_platform$2();
	Object.defineProperty(exports, "BatchSpanProcessor", {
		enumerable: true,
		get: function() {
			return platform_1.BatchSpanProcessor;
		}
	});
	Object.defineProperty(exports, "RandomIdGenerator", {
		enumerable: true,
		get: function() {
			return platform_1.RandomIdGenerator;
		}
	});
	var ConsoleSpanExporter_1 = require_ConsoleSpanExporter();
	Object.defineProperty(exports, "ConsoleSpanExporter", {
		enumerable: true,
		get: function() {
			return ConsoleSpanExporter_1.ConsoleSpanExporter;
		}
	});
	var InMemorySpanExporter_1 = require_InMemorySpanExporter();
	Object.defineProperty(exports, "InMemorySpanExporter", {
		enumerable: true,
		get: function() {
			return InMemorySpanExporter_1.InMemorySpanExporter;
		}
	});
	var SimpleSpanProcessor_1 = require_SimpleSpanProcessor();
	Object.defineProperty(exports, "SimpleSpanProcessor", {
		enumerable: true,
		get: function() {
			return SimpleSpanProcessor_1.SimpleSpanProcessor;
		}
	});
	var NoopSpanProcessor_1 = require_NoopSpanProcessor();
	Object.defineProperty(exports, "NoopSpanProcessor", {
		enumerable: true,
		get: function() {
			return NoopSpanProcessor_1.NoopSpanProcessor;
		}
	});
	var AlwaysOffSampler_1 = require_AlwaysOffSampler();
	Object.defineProperty(exports, "AlwaysOffSampler", {
		enumerable: true,
		get: function() {
			return AlwaysOffSampler_1.AlwaysOffSampler;
		}
	});
	var AlwaysOnSampler_1 = require_AlwaysOnSampler();
	Object.defineProperty(exports, "AlwaysOnSampler", {
		enumerable: true,
		get: function() {
			return AlwaysOnSampler_1.AlwaysOnSampler;
		}
	});
	var AlwaysRecordSampler_1 = require_AlwaysRecordSampler();
	Object.defineProperty(exports, "createAlwaysRecordSampler", {
		enumerable: true,
		get: function() {
			return AlwaysRecordSampler_1.createAlwaysRecordSampler;
		}
	});
	var ParentBasedSampler_1 = require_ParentBasedSampler();
	Object.defineProperty(exports, "ParentBasedSampler", {
		enumerable: true,
		get: function() {
			return ParentBasedSampler_1.ParentBasedSampler;
		}
	});
	var TraceIdRatioBasedSampler_1 = require_TraceIdRatioBasedSampler();
	Object.defineProperty(exports, "TraceIdRatioBasedSampler", {
		enumerable: true,
		get: function() {
			return TraceIdRatioBasedSampler_1.TraceIdRatioBasedSampler;
		}
	});
	var Sampler_1 = require_Sampler();
	Object.defineProperty(exports, "SamplingDecision", {
		enumerable: true,
		get: function() {
			return Sampler_1.SamplingDecision;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-trace-base/build/src/config.js
var require_config = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.buildSamplerFromEnv = exports.loadDefaultConfig = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const core_1 = require_src$13();
	const sdk_trace_1 = require_src$5();
	var TracesSamplerValues;
	(function(TracesSamplerValues) {
		TracesSamplerValues["AlwaysOff"] = "always_off";
		TracesSamplerValues["AlwaysOn"] = "always_on";
		TracesSamplerValues["ParentBasedAlwaysOff"] = "parentbased_always_off";
		TracesSamplerValues["ParentBasedAlwaysOn"] = "parentbased_always_on";
		TracesSamplerValues["ParentBasedTraceIdRatio"] = "parentbased_traceidratio";
		TracesSamplerValues["TraceIdRatio"] = "traceidratio";
	})(TracesSamplerValues || (TracesSamplerValues = {}));
	const DEFAULT_RATIO = 1;
	/**
	* Load default configuration. For fields with primitive values, any user-provided
	* value will override the corresponding default value. For fields with
	* non-primitive values (like `spanLimits`), the user-provided value will be
	* used to extend the default value.
	*/
	function loadDefaultConfig() {
		return {
			sampler: buildSamplerFromEnv(),
			forceFlushTimeoutMillis: 3e4,
			generalLimits: {
				attributeValueLengthLimit: (0, core_1.getNumberFromEnv)("OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? Infinity,
				attributeCountLimit: (0, core_1.getNumberFromEnv)("OTEL_ATTRIBUTE_COUNT_LIMIT") ?? 128
			},
			spanLimits: {
				attributeValueLengthLimit: (0, core_1.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? Infinity,
				attributeCountLimit: (0, core_1.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT") ?? 128,
				linkCountLimit: (0, core_1.getNumberFromEnv)("OTEL_SPAN_LINK_COUNT_LIMIT") ?? 128,
				eventCountLimit: (0, core_1.getNumberFromEnv)("OTEL_SPAN_EVENT_COUNT_LIMIT") ?? 128,
				attributePerEventCountLimit: (0, core_1.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT") ?? 128,
				attributePerLinkCountLimit: (0, core_1.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT") ?? 128
			}
		};
	}
	exports.loadDefaultConfig = loadDefaultConfig;
	/**
	* Based on environment, builds a sampler, complies with specification.
	*/
	function buildSamplerFromEnv() {
		const sampler = (0, core_1.getStringFromEnv)("OTEL_TRACES_SAMPLER") ?? TracesSamplerValues.ParentBasedAlwaysOn;
		switch (sampler) {
			case TracesSamplerValues.AlwaysOn: return new sdk_trace_1.AlwaysOnSampler();
			case TracesSamplerValues.AlwaysOff: return new sdk_trace_1.AlwaysOffSampler();
			case TracesSamplerValues.ParentBasedAlwaysOn: return new sdk_trace_1.ParentBasedSampler({ root: new sdk_trace_1.AlwaysOnSampler() });
			case TracesSamplerValues.ParentBasedAlwaysOff: return new sdk_trace_1.ParentBasedSampler({ root: new sdk_trace_1.AlwaysOffSampler() });
			case TracesSamplerValues.TraceIdRatio: return new sdk_trace_1.TraceIdRatioBasedSampler(getSamplerProbabilityFromEnv());
			case TracesSamplerValues.ParentBasedTraceIdRatio: return new sdk_trace_1.ParentBasedSampler({ root: new sdk_trace_1.TraceIdRatioBasedSampler(getSamplerProbabilityFromEnv()) });
			default:
				api_1.diag.error(`OTEL_TRACES_SAMPLER value "${sampler}" invalid, defaulting to "${TracesSamplerValues.ParentBasedAlwaysOn}".`);
				return new sdk_trace_1.ParentBasedSampler({ root: new sdk_trace_1.AlwaysOnSampler() });
		}
	}
	exports.buildSamplerFromEnv = buildSamplerFromEnv;
	function getSamplerProbabilityFromEnv() {
		const probability = (0, core_1.getNumberFromEnv)("OTEL_TRACES_SAMPLER_ARG");
		if (probability == null) {
			api_1.diag.error(`OTEL_TRACES_SAMPLER_ARG is blank, defaulting to ${DEFAULT_RATIO}.`);
			return DEFAULT_RATIO;
		}
		if (probability < 0 || probability > 1) {
			api_1.diag.error(`OTEL_TRACES_SAMPLER_ARG=${probability} was given, but it is out of range ([0..1]), defaulting to ${DEFAULT_RATIO}.`);
			return DEFAULT_RATIO;
		}
		return probability;
	}
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-trace-base/build/src/utility.js
var require_utility = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.reconfigureLimits = exports.DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT = exports.DEFAULT_ATTRIBUTE_COUNT_LIMIT = void 0;
	const core_1 = require_src$13();
	exports.DEFAULT_ATTRIBUTE_COUNT_LIMIT = 128;
	exports.DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT = Infinity;
	/**
	* When general limits are provided and model specific limits are not,
	* configures the model specific limits by using the values from the general ones.
	* @param userConfig User provided tracer configuration
	*/
	function reconfigureLimits(userConfig) {
		const spanLimits = Object.assign({}, userConfig.spanLimits);
		/**
		* Reassign span attribute count limit to use first non null value defined by user or use default value
		*/
		spanLimits.attributeCountLimit = userConfig.spanLimits?.attributeCountLimit ?? userConfig.generalLimits?.attributeCountLimit ?? (0, core_1.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT") ?? (0, core_1.getNumberFromEnv)("OTEL_ATTRIBUTE_COUNT_LIMIT") ?? exports.DEFAULT_ATTRIBUTE_COUNT_LIMIT;
		/**
		* Reassign span attribute value length limit to use first non null value defined by user or use default value
		*/
		spanLimits.attributeValueLengthLimit = userConfig.spanLimits?.attributeValueLengthLimit ?? userConfig.generalLimits?.attributeValueLengthLimit ?? (0, core_1.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? (0, core_1.getNumberFromEnv)("OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? exports.DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT;
		return Object.assign({}, userConfig, { spanLimits });
	}
	exports.reconfigureLimits = reconfigureLimits;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-trace-base/build/src/BasicTracerProvider-shim.js
var require_BasicTracerProvider_shim = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.BasicTracerProvider = void 0;
	const core_1 = require_src$13();
	const config_1 = require_config();
	const utility_1 = require_utility();
	const sdk_trace_1 = require_src$5();
	/**
	* A TracerProvider implementation that reads configuration defaults from
	* OTEL_* environment variables per
	* https://opentelemetry.io/docs/specs/otel/configuration/sdk-environment-variables/
	*/
	var BasicTracerProvider = class extends sdk_trace_1.TracerProvider {
		constructor(config = {}) {
			const mergedConfig = (0, core_1.merge)({}, (0, config_1.loadDefaultConfig)(), (0, utility_1.reconfigureLimits)(config));
			delete mergedConfig.generalLimits;
			super(mergedConfig);
		}
	};
	exports.BasicTracerProvider = BasicTracerProvider;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-trace-base/build/src/BatchSpanProcessor-shim.js
var require_BatchSpanProcessor_shim = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.BatchSpanProcessor = void 0;
	const core_1 = require_src$13();
	const sdk_trace_1 = require_src$5();
	/**
	* A BatchSpanProcessor that applies `OTEL_*` environment variable fallbacks per
	* https://opentelemetry.io/docs/specs/otel/configuration/sdk-environment-variables/
	*/
	var BatchSpanProcessor = class extends sdk_trace_1.BatchSpanProcessor {
		constructor(exporter, config) {
			if (!config) config = {};
			for (const [configName, envName] of [
				["maxExportBatchSize", "OTEL_BSP_MAX_EXPORT_BATCH_SIZE"],
				["maxQueueSize", "OTEL_BSP_MAX_QUEUE_SIZE"],
				["scheduledDelayMillis", "OTEL_BSP_SCHEDULE_DELAY"],
				["exportTimeoutMillis", "OTEL_BSP_EXPORT_TIMEOUT"]
			]) if (config[configName] === void 0) {
				const envFallback = (0, core_1.getNumberFromEnv)(envName);
				if (envFallback !== void 0) config[configName] = envFallback;
			}
			super({
				exporter,
				...config
			});
		}
	};
	exports.BatchSpanProcessor = BatchSpanProcessor;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-trace-base/build/src/SimpleSpanProcessor-shim.js
var require_SimpleSpanProcessor_shim = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SimpleSpanProcessor = void 0;
	const sdk_trace_1 = require_src$5();
	/**
	* A SimpleSpanProcessor with the old constructor call signature that
	* takes just a single exporter argument. This version does not support
	* the additional options that the SimpleSpanProcessor in sdk-trace does.
	*/
	var SimpleSpanProcessor = class extends sdk_trace_1.SimpleSpanProcessor {
		constructor(exporter) {
			super({ exporter });
		}
	};
	exports.SimpleSpanProcessor = SimpleSpanProcessor;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-trace-base/build/src/index-shim.js
var require_index_shim = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SamplingDecision = exports.TraceIdRatioBasedSampler = exports.ParentBasedSampler = exports.AlwaysOnSampler = exports.AlwaysOffSampler = exports.NoopSpanProcessor = exports.InMemorySpanExporter = exports.RandomIdGenerator = exports.ConsoleSpanExporter = exports.SimpleSpanProcessor = exports.BatchSpanProcessor = exports.BasicTracerProvider = void 0;
	var BasicTracerProvider_shim_1 = require_BasicTracerProvider_shim();
	Object.defineProperty(exports, "BasicTracerProvider", {
		enumerable: true,
		get: function() {
			return BasicTracerProvider_shim_1.BasicTracerProvider;
		}
	});
	var BatchSpanProcessor_shim_1 = require_BatchSpanProcessor_shim();
	Object.defineProperty(exports, "BatchSpanProcessor", {
		enumerable: true,
		get: function() {
			return BatchSpanProcessor_shim_1.BatchSpanProcessor;
		}
	});
	var SimpleSpanProcessor_shim_1 = require_SimpleSpanProcessor_shim();
	Object.defineProperty(exports, "SimpleSpanProcessor", {
		enumerable: true,
		get: function() {
			return SimpleSpanProcessor_shim_1.SimpleSpanProcessor;
		}
	});
	var sdk_trace_1 = require_src$5();
	Object.defineProperty(exports, "ConsoleSpanExporter", {
		enumerable: true,
		get: function() {
			return sdk_trace_1.ConsoleSpanExporter;
		}
	});
	Object.defineProperty(exports, "RandomIdGenerator", {
		enumerable: true,
		get: function() {
			return sdk_trace_1.RandomIdGenerator;
		}
	});
	Object.defineProperty(exports, "InMemorySpanExporter", {
		enumerable: true,
		get: function() {
			return sdk_trace_1.InMemorySpanExporter;
		}
	});
	Object.defineProperty(exports, "NoopSpanProcessor", {
		enumerable: true,
		get: function() {
			return sdk_trace_1.NoopSpanProcessor;
		}
	});
	Object.defineProperty(exports, "AlwaysOffSampler", {
		enumerable: true,
		get: function() {
			return sdk_trace_1.AlwaysOffSampler;
		}
	});
	Object.defineProperty(exports, "AlwaysOnSampler", {
		enumerable: true,
		get: function() {
			return sdk_trace_1.AlwaysOnSampler;
		}
	});
	Object.defineProperty(exports, "ParentBasedSampler", {
		enumerable: true,
		get: function() {
			return sdk_trace_1.ParentBasedSampler;
		}
	});
	Object.defineProperty(exports, "TraceIdRatioBasedSampler", {
		enumerable: true,
		get: function() {
			return sdk_trace_1.TraceIdRatioBasedSampler;
		}
	});
	Object.defineProperty(exports, "SamplingDecision", {
		enumerable: true,
		get: function() {
			return sdk_trace_1.SamplingDecision;
		}
	});
}));
//#endregion
//#region extensions/diagnostics-otel/src/service-constants.ts
init_esm$1();
var import_src$2 = /* @__PURE__ */ __toESM(require_src$12(), 1);
var import_src$3 = require_src$11();
var import_src = require_src$7();
var import_src$1 = require_src$6();
var import_index_shim = require_index_shim();
const DROPPED_OTEL_ATTRIBUTE_KEYS = /* @__PURE__ */ new Set([
	"openclaw.callId",
	"openclaw.call_id",
	"openclaw.chatId",
	"openclaw.chat_id",
	"openclaw.messageId",
	"openclaw.message_id",
	"openclaw.parentSpanId",
	"openclaw.parent_span_id",
	"openclaw.runId",
	"openclaw.run_id",
	"openclaw.sessionId",
	"openclaw.session_id",
	"openclaw.sessionKey",
	"openclaw.session_key",
	"openclaw.spanId",
	"openclaw.span_id",
	"openclaw.toolCallId",
	"openclaw.tool_call_id",
	"openclaw.traceId",
	"openclaw.trace_id"
]);
const SECURITY_TARGET_NAME_VALUE_RE = /^[A-Za-z0-9@/_.:-]{1,256}$/u;
const MAX_OTEL_LOG_BODY_CHARS = 4 * 1024;
const MAX_OTEL_LOG_ATTRIBUTE_VALUE_CHARS = 4 * 1024;
const OTEL_LOG_RAW_ATTRIBUTE_KEY_RE = /^[A-Za-z0-9_.:-]{1,64}$/u;
const OTEL_LOG_ATTRIBUTE_KEY_RE = /^[A-Za-z0-9_.:-]{1,96}$/u;
const BLOCKED_OTEL_LOG_ATTRIBUTE_KEYS = /* @__PURE__ */ new Set([
	"__proto__",
	"prototype",
	"constructor"
]);
const OTEL_EXPORTER_OTLP_ENDPOINT_ENV = "OTEL_EXPORTER_OTLP_ENDPOINT";
const OTEL_EXPORTER_OTLP_TRACES_ENDPOINT_ENV = "OTEL_EXPORTER_OTLP_TRACES_ENDPOINT";
const OTEL_EXPORTER_OTLP_METRICS_ENDPOINT_ENV = "OTEL_EXPORTER_OTLP_METRICS_ENDPOINT";
const OTEL_EXPORTER_OTLP_LOGS_ENDPOINT_ENV = "OTEL_EXPORTER_OTLP_LOGS_ENDPOINT";
const OTEL_EXPORTER_OTLP_TRACES_PROTOCOL_ENV = "OTEL_EXPORTER_OTLP_TRACES_PROTOCOL";
const OTEL_EXPORTER_OTLP_METRICS_PROTOCOL_ENV = "OTEL_EXPORTER_OTLP_METRICS_PROTOCOL";
const OTEL_EXPORTER_OTLP_LOGS_PROTOCOL_ENV = "OTEL_EXPORTER_OTLP_LOGS_PROTOCOL";
const OTEL_EXPORTER_OTLP_CERTIFICATE_ENV = "OTEL_EXPORTER_OTLP_CERTIFICATE";
const OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE_ENV = "OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE";
const OTEL_EXPORTER_OTLP_CLIENT_KEY_ENV = "OTEL_EXPORTER_OTLP_CLIENT_KEY";
const OTEL_SEMCONV_STABILITY_OPT_IN_ENV = "OTEL_SEMCONV_STABILITY_OPT_IN";
const GEN_AI_LATEST_EXPERIMENTAL_OPT_IN = "gen_ai_latest_experimental";
const GEN_AI_TOKEN_USAGE_BUCKETS = [
	1,
	4,
	16,
	64,
	256,
	1024,
	4096,
	16384,
	65536,
	262144,
	1048576,
	4194304,
	16777216,
	67108864
];
const GEN_AI_OPERATION_DURATION_BUCKETS = [
	.01,
	.02,
	.04,
	.08,
	.16,
	.32,
	.64,
	1.28,
	2.56,
	5.12,
	10.24,
	20.48,
	40.96,
	81.92
];
const OTEL_DEFAULT_HISTOGRAM_BUCKETS = [
	0,
	5,
	10,
	25,
	50,
	75,
	100,
	250,
	500,
	750,
	1e3,
	2500,
	5e3,
	7500,
	1e4
];
const AGENT_DURATION_MS_BUCKETS = [
	...OTEL_DEFAULT_HISTOGRAM_BUCKETS,
	15e3,
	2e4,
	3e4,
	45e3,
	6e4,
	12e4,
	18e4,
	24e4,
	3e5,
	6e5,
	9e5,
	18e5,
	36e5
];
const CONTEXT_TOKENS_BUCKETS = [
	...OTEL_DEFAULT_HISTOGRAM_BUCKETS,
	16e3,
	32e3,
	64e3,
	128e3,
	2e5,
	4e5,
	1e6,
	2e6
];
const MAX_RETAINED_TRUSTED_SPAN_CONTEXTS = 1024;
//#endregion
//#region extensions/diagnostics-otel/src/service-content-normalization.ts
const MAX_OTEL_CONTENT_ATTRIBUTE_CHARS = 128 * 1024;
const MAX_OTEL_ERROR_MESSAGE_CHARS = 4 * 1024;
const PRELOADED_OTEL_SDK_ENV = "OPENCLAW_OTEL_PRELOADED";
const NO_CONTENT_CAPTURE = {
	inputMessages: false,
	outputMessages: false,
	toolInputs: false,
	toolOutputs: false,
	systemPrompt: false,
	toolDefinitions: false,
	logBodies: false
};
function clampOtelLogText(value, maxChars) {
	return value.length > maxChars ? `${truncateUtf16Safe(value, maxChars)}...(truncated)` : value;
}
function normalizeOtelLogString(value, maxChars) {
	return clampOtelLogText(redactSensitiveText(value), maxChars);
}
function normalizeOtelErrorMessage(value) {
	if (!value) return;
	return normalizeOtelLogString(value.trim(), MAX_OTEL_ERROR_MESSAGE_CHARS) || void 0;
}
function resolveContentCapturePolicy(value) {
	return value === true ? {
		inputMessages: true,
		outputMessages: true,
		toolInputs: true,
		toolOutputs: true,
		systemPrompt: false,
		toolDefinitions: true,
		logBodies: true
	} : NO_CONTENT_CAPTURE;
}
function hasPreloadedOtelSdk() {
	return process.env[PRELOADED_OTEL_SDK_ENV] === "1";
}
function normalizeOtelContentValue(value) {
	if (typeof value === "string") return normalizeOtelLogString(value, MAX_OTEL_CONTENT_ATTRIBUTE_CHARS);
	if (Array.isArray(value)) {
		const items = [];
		for (const item of value.slice(0, 200)) if (typeof item === "string") items.push(item);
		if (items.length > 0) return normalizeOtelLogString(items.join("\n"), MAX_OTEL_CONTENT_ATTRIBUTE_CHARS);
	}
	const json = safeJsonString(value, MAX_OTEL_CONTENT_ATTRIBUTE_CHARS);
	if (json) return json;
}
const TRUNCATED_JSON_TEXT_SUFFIX = "...(truncated)";
const JSON_TRUNCATION_STRING_BUDGETS = [
	8192,
	4096,
	2048,
	1024,
	512,
	256,
	128,
	64,
	32
];
const JSON_TRUNCATION_ARRAY_ITEM_BUDGETS = [
	200,
	100,
	50,
	25,
	10,
	5,
	1
];
const JSON_TRUNCATION_MAX_OBJECT_FIELDS = 64;
const JSON_TRUNCATION_MAX_DEPTH = 8;
function safeJsonString(value, maxChars) {
	if (value === void 0 || typeof value === "function" || typeof value === "symbol") return;
	const exact = stringifyJsonForOtelAttribute(value);
	if (exact && exact.length <= maxChars) return exact;
	for (const maxArrayItems of JSON_TRUNCATION_ARRAY_ITEM_BUDGETS) for (const maxStringChars of JSON_TRUNCATION_STRING_BUDGETS) {
		const json = stringifyJsonForOtelAttribute(truncateJsonValueForOtelAttribute(value, {
			maxArrayItems,
			maxDepth: JSON_TRUNCATION_MAX_DEPTH,
			maxObjectFields: JSON_TRUNCATION_MAX_OBJECT_FIELDS,
			maxStringChars,
			seen: /* @__PURE__ */ new WeakSet()
		}));
		if (json && json.length <= maxChars) return json;
	}
	const summary = stringifyJsonForOtelAttribute({
		truncated: true,
		reason: exact ? "max_attribute_size" : "unserializable_value",
		type: describeJsonValue(value)
	});
	return summary && summary.length <= maxChars ? summary : void 0;
}
function stringifyJsonForOtelAttribute(value) {
	try {
		const json = JSON.stringify(value);
		if (!json) return;
		return redactSensitiveText(json);
	} catch {
		return;
	}
}
function truncateJsonValueForOtelAttribute(value, options) {
	if (typeof value === "string") return truncateJsonTextForOtelAttribute(value, options.maxStringChars);
	if (typeof value === "number" || typeof value === "boolean" || value === null) return value;
	if (typeof value === "bigint") return truncateJsonTextForOtelAttribute(String(value), options.maxStringChars);
	if (value === void 0 || typeof value === "function" || typeof value === "symbol") return;
	if (options.maxDepth <= 0) return {
		truncated: true,
		reason: "max_depth"
	};
	if (Array.isArray(value)) return truncateJsonArrayForOtelAttribute(value, options);
	if (typeof value === "object") return truncateJsonObjectForOtelAttribute(value, options);
}
function truncateJsonArrayForOtelAttribute(value, options) {
	if (options.seen.has(value)) return [{
		truncated: true,
		reason: "circular_reference"
	}];
	options.seen.add(value);
	const nextOptions = {
		...options,
		maxDepth: options.maxDepth - 1
	};
	const items = value.slice(0, options.maxArrayItems).map((item) => truncateJsonValueForOtelAttribute(item, nextOptions));
	if (value.length > items.length) items.push({
		truncated: true,
		omittedItems: value.length - items.length
	});
	options.seen.delete(value);
	return items;
}
function truncateJsonObjectForOtelAttribute(value, options) {
	if (options.seen.has(value)) return {
		truncated: true,
		reason: "circular_reference"
	};
	options.seen.add(value);
	const nextOptions = {
		...options,
		maxDepth: options.maxDepth - 1
	};
	const result = {};
	const entries = Object.entries(value).filter(([, field]) => field !== void 0 && typeof field !== "function" && typeof field !== "symbol");
	for (const [key, field] of entries.slice(0, options.maxObjectFields)) result[key] = truncateJsonValueForOtelAttribute(field, nextOptions);
	if (entries.length > options.maxObjectFields) {
		result.truncated = true;
		result.omittedFields = entries.length - options.maxObjectFields;
	}
	options.seen.delete(value);
	return result;
}
function truncateJsonTextForOtelAttribute(value, maxChars) {
	const redacted = redactSensitiveText(value);
	if (redacted.length <= maxChars) return redacted;
	const suffixBudget = Math.min(14, maxChars);
	return `${truncateUtf16Safe(redacted, Math.max(0, maxChars - suffixBudget))}${TRUNCATED_JSON_TEXT_SUFFIX.slice(14 - suffixBudget)}`;
}
function describeJsonValue(value) {
	if (Array.isArray(value)) return "array";
	if (value === null) return "null";
	return typeof value;
}
//#endregion
//#region extensions/diagnostics-otel/src/service-exporter.ts
function normalizeEndpoint(endpoint) {
	const trimmed = endpoint?.trim();
	return trimmed ? trimmed.replace(/\/+$/, "") : void 0;
}
const SIGNAL_QUALIFIED_OTLP_PATH_PATTERN = /\/v1\/(traces|metrics|logs)$/iu;
function appendOrReplaceSignalPath(value, path) {
	const base = value.replace(/\/+$/u, "");
	return SIGNAL_QUALIFIED_OTLP_PATH_PATTERN.test(base) ? base.replace(SIGNAL_QUALIFIED_OTLP_PATH_PATTERN, `/${path}`) : `${base}/${path}`;
}
function resolveSharedOtelUrl(endpoint, path) {
	const matchedSignal = (endpoint.split(/[?#]/, 1)[0] ?? endpoint).replace(/\/+$/u, "").match(SIGNAL_QUALIFIED_OTLP_PATH_PATTERN)?.[1];
	const requestedSignal = path.slice(path.lastIndexOf("/") + 1);
	if (matchedSignal?.toLowerCase() === requestedSignal.toLowerCase()) return endpoint;
	if (/[?#]/u.test(endpoint)) {
		const url = new URL(endpoint);
		url.pathname = appendOrReplaceSignalPath(url.pathname, path);
		return url.toString();
	}
	return appendOrReplaceSignalPath(endpoint, path);
}
function normalizeSignalEndpoint(endpoint) {
	return endpoint?.trim() || void 0;
}
function resolveSignalOtelUrl(params) {
	const signalEndpoint = normalizeSignalEndpoint(params.signalEndpoint ?? params.signalEnvEndpoint);
	const endpoint = signalEndpoint ?? params.endpoint;
	const signalEnvEndpoint = params.signalEnvEndpoint?.trim() ? params.signalEnvEndpoint : void 0;
	const sharedEnvEndpoint = params.sharedEnvEndpoint?.trim() ? params.sharedEnvEndpoint : void 0;
	const consumedSharedEnvEndpoint = signalEnvEndpoint ? void 0 : sharedEnvEndpoint;
	const appendedSharedEnvEndpoint = consumedSharedEnvEndpoint ? `${consumedSharedEnvEndpoint}${consumedSharedEnvEndpoint.endsWith("/") ? "" : "/"}${params.path}` : void 0;
	const resolvedEndpoint = endpoint && URL.canParse(endpoint) && !signalEndpoint ? resolveSharedOtelUrl(endpoint, params.path) : endpoint;
	for (const candidate of [
		endpoint,
		signalEnvEndpoint ?? sharedEnvEndpoint,
		appendedSharedEnvEndpoint,
		resolvedEndpoint
	]) if (candidate && !URL.canParse(candidate)) throw new Error("Configured OpenTelemetry collector endpoint is invalid; check the collector URL");
	return resolvedEndpoint;
}
function readOtelEnvFile(params) {
	const signalEnvName = `OTEL_EXPORTER_OTLP_${params.signalIdentifier}_${params.signalSuffix}`;
	const filePath = normalizeOtelEnvValue(process.env[signalEnvName]) ?? normalizeOtelEnvValue(process.env[params.sharedEnvName]);
	if (!filePath) return;
	try {
		const material = readFileSync(path.resolve(process.cwd(), filePath));
		if (material.length > 0) return material;
	} catch {}
	throw new Error(`Configured OpenTelemetry ${params.label} file is missing, empty, or unreadable; refusing insecure export`);
}
function normalizeOtelEnvValue(value) {
	return value?.trim() ? value : void 0;
}
function resolveOtelHttpAgentOptions(params) {
	const { url, signalIdentifier } = params;
	const ca = readOtelEnvFile({
		signalIdentifier,
		signalSuffix: "CERTIFICATE",
		sharedEnvName: OTEL_EXPORTER_OTLP_CERTIFICATE_ENV,
		label: "TLS root certificate"
	});
	const cert = readOtelEnvFile({
		signalIdentifier,
		signalSuffix: "CLIENT_CERTIFICATE",
		sharedEnvName: OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE_ENV,
		label: "mTLS client certificate"
	});
	const key = readOtelEnvFile({
		signalIdentifier,
		signalSuffix: "CLIENT_KEY",
		sharedEnvName: OTEL_EXPORTER_OTLP_CLIENT_KEY_ENV,
		label: "mTLS client private key"
	});
	if (cert === void 0 !== (key === void 0)) throw new Error("Configured OpenTelemetry mTLS requires both a client certificate and private key; refusing insecure export");
	if (!url) return;
	const agentOptions = {
		keepAlive: true,
		...ca !== void 0 ? { ca } : {},
		...cert !== void 0 ? { cert } : {},
		...key !== void 0 ? { key } : {}
	};
	try {
		const agent = createNodeProxyAgent({
			mode: "env",
			targetUrl: url,
			agentOptions
		});
		if (agent) return () => agent;
	} catch {
		throw new Error("Configured telemetry proxy is invalid or unsupported; refusing direct export");
	}
	return (ca || cert || key) && new URL(url).protocol === "https:" ? agentOptions : void 0;
}
function resolveSampleRate(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return;
	if (value < 0 || value > 1) return;
	return value;
}
function formatError(err) {
	if (err instanceof Error) return err.stack ?? err.message;
	if (typeof err === "string") return err;
	try {
		return JSON.stringify(err);
	} catch {
		return String(err);
	}
}
function errorCategory(err) {
	try {
		if (err instanceof Error && typeof err.name === "string" && err.name.trim()) return normalizeDiagnosticValue(err.name, "Error");
		return normalizeDiagnosticValue(typeof err, "unknown");
	} catch {
		return "unknown";
	}
}
function readErrorName(err) {
	if (!err || typeof err !== "object") return;
	const name = err.name;
	return typeof name === "string" && name.trim() ? name : void 0;
}
function readErrorCode(err) {
	if (!err || typeof err !== "object") return;
	const code = err.code;
	return typeof code === "string" || typeof code === "number" ? code : void 0;
}
function findOtlpExporterError(reason) {
	for (const candidate of collectErrorGraphCandidates(reason, (current) => Array.isArray(current) ? current : [
		current.cause,
		current.reason,
		current.original,
		current.error,
		...Array.isArray(current.errors) ? current.errors : []
	])) if (readErrorName(candidate) === "OTLPExporterError" && candidate && typeof candidate === "object") return candidate;
}
//#endregion
//#region extensions/diagnostics-otel/src/service-events.ts
function createDiagnosticsEventHandler(params) {
	const { logger, recorders, recordLogRecord, recordSecurityEvent } = params;
	const { recordModelUsage, recordWebhookReceived, recordWebhookProcessed, recordWebhookError, recordMessageQueued, recordMessageReceived, recordMessageDispatchStarted, recordMessageDispatchCompleted, recordMessageProcessed, recordMessageDeliveryStarted, recordMessageDeliveryCompleted, recordMessageDeliveryError, recordTalkEvent, recordLaneEnqueue, recordLaneDequeue, recordSessionState, recordSessionTurnCreated, recordSessionStuck, recordSessionRecoveryRequested, recordSessionRecoveryCompleted, recordRunAttempt, recordHeartbeat, recordLivenessWarning, recordDiagnosticPhaseCompleted, recordRunStarted, recordRunCompleted, recordHarnessRunStarted, recordHarnessRunCompleted, recordHarnessRunError, recordContextAssembled, recordModelCallStarted, recordModelCallCompleted, recordModelCallError, recordToolExecutionStarted, recordToolExecutionCompleted, recordToolExecutionError, recordToolExecutionBlocked, recordSkillUsed, recordExecProcessCompleted, recordToolLoop, recordMemorySample, recordMemoryPressure, recordAsyncQueueDropped, recordTelemetryExporter, recordPayloadLarge, recordModelFailover } = recorders;
	return (evt, metadata, privateData) => {
		try {
			switch (evt.type) {
				case "model.usage":
					recordModelUsage(evt, metadata, privateData.hostPluginId);
					return;
				case "webhook.received":
					recordWebhookReceived(evt);
					return;
				case "webhook.processed":
					recordWebhookProcessed(evt);
					return;
				case "webhook.error":
					recordWebhookError(evt);
					return;
				case "message.queued":
					recordMessageQueued(evt);
					return;
				case "message.received":
					recordMessageReceived(evt);
					return;
				case "message.dispatch.started":
					recordMessageDispatchStarted(evt, metadata);
					return;
				case "message.dispatch.completed":
					recordMessageDispatchCompleted(evt);
					return;
				case "message.processed":
					recordMessageProcessed(evt, metadata);
					return;
				case "message.delivery.started":
					recordMessageDeliveryStarted(evt);
					return;
				case "message.delivery.completed":
					recordMessageDeliveryCompleted(evt, metadata);
					return;
				case "message.delivery.error":
					recordMessageDeliveryError(evt, metadata);
					return;
				case "talk.event":
					recordTalkEvent(evt, metadata);
					return;
				case "queue.lane.enqueue":
					recordLaneEnqueue(evt);
					return;
				case "queue.lane.dequeue":
					recordLaneDequeue(evt);
					return;
				case "session.state":
					recordSessionState(evt);
					break;
				case "session.long_running":
				case "session.stalled": break;
				case "session.turn.created":
					recordSessionTurnCreated(evt);
					return;
				case "session.stuck":
					recordSessionStuck(evt);
					return;
				case "session.recovery.requested":
					recordSessionRecoveryRequested(evt);
					return;
				case "session.recovery.completed":
					recordSessionRecoveryCompleted(evt);
					return;
				case "run.attempt":
					recordRunAttempt(evt);
					break;
				case "run.progress": break;
				case "run.execution_phase": break;
				case "diagnostic.heartbeat":
					recordHeartbeat(evt);
					return;
				case "diagnostic.liveness.warning":
					recordLivenessWarning(evt);
					return;
				case "diagnostic.phase.completed":
					recordDiagnosticPhaseCompleted(evt);
					return;
				case "run.started":
					recordRunStarted(evt, metadata);
					return;
				case "run.completed":
					recordRunCompleted(evt, metadata, privateData);
					return;
				case "harness.run.started":
					recordHarnessRunStarted(evt, metadata);
					return;
				case "harness.run.completed":
					recordHarnessRunCompleted(evt, metadata, privateData);
					return;
				case "harness.run.error":
					recordHarnessRunError(evt, metadata, privateData);
					return;
				case "context.assembled":
					recordContextAssembled(evt, metadata);
					return;
				case "model.call.started":
					recordModelCallStarted(evt, metadata);
					return;
				case "model.call.completed":
					recordModelCallCompleted(evt, metadata, privateData.modelContent);
					return;
				case "model.call.error":
					recordModelCallError(evt, metadata, privateData.modelContent);
					return;
				case "tool.execution.started":
					recordToolExecutionStarted(evt, metadata);
					return;
				case "tool.execution.completed":
					recordToolExecutionCompleted(evt, metadata, privateData.toolContent);
					return;
				case "tool.execution.error":
					recordToolExecutionError(evt, metadata, privateData.toolContent);
					return;
				case "tool.execution.blocked":
					recordToolExecutionBlocked(evt, metadata);
					return;
				case "skill.used":
					recordSkillUsed(evt, metadata);
					return;
				case "exec.process.completed":
					recordExecProcessCompleted(evt, metadata);
					break;
				case "exec.approval.followup_suppressed": break;
				case "log.record":
					recordLogRecord?.(evt, metadata);
					return;
				case "security.event":
					recordSecurityEvent?.(evt, metadata);
					return;
				case "tool.loop":
					recordToolLoop(evt);
					return;
				case "diagnostic.memory.sample":
					recordMemorySample(evt);
					return;
				case "diagnostic.memory.pressure":
					recordMemoryPressure(evt);
					return;
				case "diagnostic.async_queue.dropped":
					recordAsyncQueueDropped(evt);
					return;
				case "telemetry.exporter":
					recordTelemetryExporter(evt, metadata);
					return;
				case "payload.large":
					recordPayloadLarge(evt);
					return;
				case "model.failover": recordModelFailover(evt, metadata);
			}
		} catch (err) {
			logger.error(`diagnostics-otel: event handler failed (${evt.type}): ${formatError(err)}`);
		}
	};
}
//#endregion
//#region extensions/diagnostics-otel/src/service-exporter-health.ts
var import_src$9 = /* @__PURE__ */ __toESM(require_src$13(), 1);
function publicFailureKey(event) {
	return `${event.reason ?? "unspecified"}\u0000${event.errorCategory ?? "unknown"}`;
}
/** Owns route transitions so one producer cannot recover another producer's failure. */
function createExporterHealthEventEmitter(publish) {
	const failures = /* @__PURE__ */ new Map();
	return (event) => {
		const key = `${event.exporter}\u0000${event.signal}\u0000${event.transport}`;
		if (event.status === "started" || event.status === "dropped") {
			failures.delete(key);
			publish(event);
			return;
		}
		const reason = event.reason ?? "unspecified";
		if (event.status === "failure") {
			const route = failures.get(key) ?? { active: /* @__PURE__ */ new Map() };
			failures.set(key, route);
			if (route.active.has(reason)) return;
			route.active.set(reason, event);
			if (route.reported === void 0) {
				route.reported = reason;
				publish(event);
			}
			return;
		}
		const route = failures.get(key);
		if (!route?.active.delete(reason) || route.reported !== reason) return;
		const next = route.active.entries().next().value;
		if (next) {
			route.reported = next[0];
			publish(next[1]);
			return;
		}
		failures.delete(key);
		publish(event);
	};
}
/** Coalesces private transport transitions into the shipped signal-level public stream. */
function createPublicExporterHealthEventEmitter(publish) {
	const signals = /* @__PURE__ */ new Map();
	return (event) => {
		const signalKey = `${event.exporter}\u0000${event.signal}`;
		let state = signals.get(signalKey);
		if (!state) {
			if (event.status === "dropped") return;
			state = {
				routes: /* @__PURE__ */ new Set(),
				started: false,
				routeFailures: /* @__PURE__ */ new Map()
			};
			signals.set(signalKey, state);
		}
		const routeKey = event.transport;
		if (event.status === "dropped") {
			const removed = state.routes.delete(routeKey);
			state.routeFailures.delete(routeKey);
			if (!removed || state.routes.size > 0) return;
			signals.delete(signalKey);
			publish({
				...event,
				status: "dropped"
			});
			return;
		}
		state.routes.add(routeKey);
		if (event.status === "started") {
			state.routeFailures.delete(routeKey);
			if (state.started) return;
			state.started = true;
			publish({
				...event,
				status: "started"
			});
			return;
		}
		if (event.status === "recovered") {
			state.routeFailures.delete(routeKey);
			return;
		}
		const failureKey = publicFailureKey(event);
		if (state.routeFailures.get(routeKey) === failureKey) return;
		const duplicate = [...state.routeFailures.entries()].some(([transport, activeFailure]) => transport !== routeKey && activeFailure === failureKey);
		state.routeFailures.set(routeKey, failureKey);
		if (!duplicate) publish({
			...event,
			status: "failure"
		});
	};
}
/**
* Observes the exporter result callback, which runs only after the OTLP
* transport has exhausted dependency-owned retries.
*/
function observeOtlpExporterHealth(exporter, params) {
	const observed = exporter;
	const exportItems = observed.export.bind(observed);
	const shutdown = observed.shutdown.bind(observed);
	const emit = (status, reason, error) => {
		params.emitExporterEvent({
			exporter: "diagnostics-otel",
			signal: params.signal,
			transport: "otlp-http-protobuf",
			status,
			reason,
			...error ? { errorCategory: errorCategory(error) } : {}
		});
	};
	observed.export = (items, resultCallback) => {
		let dependencyCallbackInvoked = false;
		try {
			exportItems(items, (result) => {
				dependencyCallbackInvoked = true;
				if (result.code === import_src$9.ExportResultCode.FAILED) emit("failure", "export_failed", result.error);
				else if (result.code === import_src$9.ExportResultCode.SUCCESS) emit("recovered", "export_failed");
				resultCallback(result);
			});
		} catch (error) {
			if (!dependencyCallbackInvoked) emit("failure", "export_failed", error);
			throw error;
		}
	};
	observed.shutdown = async () => {
		try {
			await shutdown();
		} catch (error) {
			emit("failure", "shutdown_failed", error);
			throw error;
		}
	};
	return exporter;
}
//#endregion
//#region node_modules/@opentelemetry/exporter-logs-otlp-proto/build/src/semconv.js
var require_semconv$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.OTEL_COMPONENT_TYPE_VALUE_OTLP_HTTP_LOG_EXPORTER = void 0;
	/**
	* Enum value "otlp_http_log_exporter" for attribute {@link ATTR_OTEL_COMPONENT_TYPE}.
	*
	* OTLP log record exporter over HTTP with protobuf serialization
	*
	* @experimental This enum value is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.OTEL_COMPONENT_TYPE_VALUE_OTLP_HTTP_LOG_EXPORTER = "otlp_http_log_exporter";
}));
//#endregion
//#region node_modules/@opentelemetry/exporter-logs-otlp-proto/build/src/platform/node/OTLPLogExporter.js
var require_OTLPLogExporter = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.OTLPLogExporter = void 0;
	const otlp_exporter_base_1 = (init_esm(), __toCommonJS(esm_exports));
	const otlp_transformer_1 = require_src$9();
	const node_http_1 = (init_index_node_http(), __toCommonJS(index_node_http_exports));
	const semconv_1 = require_semconv$1();
	/**
	* OTLP Log Protobuf Exporter for Node.js
	*/
	var OTLPLogExporter = class extends otlp_exporter_base_1.OTLPExporterBase {
		constructor(config = {}) {
			super((0, node_http_1.createOtlpHttpExportDelegate)((0, node_http_1.convertLegacyHttpOptions)(config, "LOGS", "v1/logs", { "Content-Type": "application/x-protobuf" }), otlp_transformer_1.ProtobufLogsSerializer, semconv_1.OTEL_COMPONENT_TYPE_VALUE_OTLP_HTTP_LOG_EXPORTER, otlp_transformer_1.LogsExporterMetricsHelper, config.selfObsMeterProvider));
		}
	};
	exports.OTLPLogExporter = OTLPLogExporter;
}));
//#endregion
//#region node_modules/@opentelemetry/exporter-logs-otlp-proto/build/src/platform/node/index.js
var require_node$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.OTLPLogExporter = void 0;
	var OTLPLogExporter_1 = require_OTLPLogExporter();
	Object.defineProperty(exports, "OTLPLogExporter", {
		enumerable: true,
		get: function() {
			return OTLPLogExporter_1.OTLPLogExporter;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/exporter-logs-otlp-proto/build/src/platform/index.js
var require_platform$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.OTLPLogExporter = void 0;
	var node_1 = require_node$1();
	Object.defineProperty(exports, "OTLPLogExporter", {
		enumerable: true,
		get: function() {
			return node_1.OTLPLogExporter;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/exporter-logs-otlp-proto/build/src/index.js
var require_src$4 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.OTLPLogExporter = void 0;
	var platform_1 = require_platform$1();
	Object.defineProperty(exports, "OTLPLogExporter", {
		enumerable: true,
		get: function() {
			return platform_1.OTLPLogExporter;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-logs/build/src/utils/validation.js
var require_validation = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.normalizeScopeAttributes = exports.addAttribute = exports.AddAttributeDecision = exports.isLogAttributeValue = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	/**
	* Validates if a value is a valid AnyValue for Log Attributes according to OpenTelemetry spec.
	* Log Attributes support a superset of standard Attributes and must support:
	* - Scalar values: string, boolean, signed 64-bit integer, or double precision floating point
	* - Byte arrays (Uint8Array)
	* - Arrays of any values (heterogeneous arrays allowed)
	* - Maps from string to any value (nested objects)
	* - Empty values (null/undefined)
	*
	* @param val - The value to validate
	* @returns true if the value is a valid AnyValue, false otherwise
	*/
	function isLogAttributeValue(val) {
		return isLogAttributeValueInternal(val, /* @__PURE__ */ new WeakSet());
	}
	exports.isLogAttributeValue = isLogAttributeValue;
	function isLogAttributeValueInternal(val, visited) {
		if (val == null) return true;
		if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") return true;
		if (val instanceof Uint8Array) return true;
		if (typeof val === "object") {
			if (visited.has(val)) return false;
			visited.add(val);
			if (Array.isArray(val)) {
				for (const item of val) if (!isLogAttributeValueInternal(item, visited)) return false;
				return true;
			}
			const obj = val;
			if (obj.constructor !== Object && obj.constructor !== void 0) return false;
			for (const key in obj) if (Object.prototype.hasOwnProperty.call(obj, key) && !isLogAttributeValueInternal(obj[key], visited)) return false;
			return true;
		}
		return false;
	}
	var AddAttributeDecision;
	(function(AddAttributeDecision) {
		AddAttributeDecision[AddAttributeDecision["DROP_INVALID"] = 0] = "DROP_INVALID";
		AddAttributeDecision[AddAttributeDecision["DROP_LIMIT_REACHED"] = 1] = "DROP_LIMIT_REACHED";
		AddAttributeDecision[AddAttributeDecision["ADD_NEW"] = 2] = "ADD_NEW";
		AddAttributeDecision[AddAttributeDecision["ADD_OVERWRITE_EXISTING"] = 3] = "ADD_OVERWRITE_EXISTING";
	})(AddAttributeDecision || (exports.AddAttributeDecision = AddAttributeDecision = {}));
	function addAttribute(attributes, limits, currentAttributesCount, key, value) {
		if (key.length === 0) {
			api_1.diag.warn(`Invalid attribute key: ${key}`);
			return AddAttributeDecision.DROP_INVALID;
		}
		if (!isLogAttributeValue(value)) {
			api_1.diag.warn(`Invalid attribute value set for key: ${key}`);
			return AddAttributeDecision.DROP_INVALID;
		}
		const isNewKey = !Object.prototype.hasOwnProperty.call(attributes, key);
		if (isNewKey && currentAttributesCount >= limits.attributeCountLimit) return AddAttributeDecision.DROP_LIMIT_REACHED;
		attributes[key] = truncateToSize(value, limits.attributeValueLengthLimit);
		if (isNewKey) return AddAttributeDecision.ADD_NEW;
		return AddAttributeDecision.ADD_OVERWRITE_EXISTING;
	}
	exports.addAttribute = addAttribute;
	function truncateToSize(value, limit) {
		if (limit <= 0) {
			api_1.diag.warn(`Attribute value limit must be positive, got ${limit}`);
			return value;
		}
		if (value == null) return value;
		if (typeof value === "string") {
			if (value.length <= limit) return value;
			return value.substring(0, limit);
		}
		if (value instanceof Uint8Array) return value;
		if (Array.isArray(value)) return value.map((val) => truncateToSize(val, limit));
		if (typeof value === "object") {
			const truncatedObj = {};
			for (const [k, v] of Object.entries(value)) truncatedObj[k] = truncateToSize(v, limit);
			return truncatedObj;
		}
		return value;
	}
	/**
	* Normalize attributes for use on the instrumentation scope. Drops invalid attributes and keeps track of
	* how many were dropped.
	*
	* @param limits
	* @param attributes
	*/
	function normalizeScopeAttributes(limits, attributes) {
		if (attributes == null) return {};
		const normalizedAttributes = {};
		let currentAttributesCount = 0;
		let droppedAttributesCount = 0;
		for (const [key, value] of Object.entries(attributes)) {
			const decision = addAttribute(normalizedAttributes, limits, currentAttributesCount, key, value);
			if (decision === AddAttributeDecision.ADD_NEW) currentAttributesCount += 1;
			else if (decision === AddAttributeDecision.DROP_INVALID) droppedAttributesCount += 1;
			else if (decision === AddAttributeDecision.DROP_LIMIT_REACHED) droppedAttributesCount += 1;
		}
		return {
			attributes: currentAttributesCount > 0 ? normalizedAttributes : void 0,
			droppedAttributesCount
		};
	}
	exports.normalizeScopeAttributes = normalizeScopeAttributes;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-logs/build/src/LogRecordImpl.js
var require_LogRecordImpl = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.LogRecordImpl = void 0;
	const api = (init_esm$2(), __toCommonJS(esm_exports$2));
	const core_1 = require_src$13();
	const semantic_conventions_1 = (init_esm$1(), __toCommonJS(esm_exports$1));
	const validation_1 = require_validation();
	var LogRecordImpl = class {
		resource;
		instrumentationScope;
		attributes = {};
		_hrTime;
		_hrTimeObserved;
		_spanContext;
		_severityText;
		_severityNumber;
		_body;
		_eventName;
		_attributesCount = 0;
		_droppedAttributesCount = 0;
		_isReadonly = false;
		_logRecordLimits;
		get hrTime() {
			return this._hrTime;
		}
		set hrTime(hrTime) {
			if (this._isLogRecordReadonly()) return;
			this._hrTime = hrTime;
		}
		get hrTimeObserved() {
			return this._hrTimeObserved;
		}
		set hrTimeObserved(hrTimeObserved) {
			if (this._isLogRecordReadonly()) return;
			this._hrTimeObserved = hrTimeObserved;
		}
		get spanContext() {
			return this._spanContext;
		}
		set spanContext(spanContext) {
			if (this._isLogRecordReadonly()) return;
			this._spanContext = spanContext;
		}
		set severityText(severityText) {
			if (this._isLogRecordReadonly()) return;
			this._severityText = severityText;
		}
		get severityText() {
			return this._severityText;
		}
		set severityNumber(severityNumber) {
			if (this._isLogRecordReadonly()) return;
			this._severityNumber = severityNumber;
		}
		get severityNumber() {
			return this._severityNumber;
		}
		set body(body) {
			if (this._isLogRecordReadonly()) return;
			this._body = body;
		}
		get body() {
			return this._body;
		}
		get eventName() {
			return this._eventName;
		}
		set eventName(eventName) {
			if (this._isLogRecordReadonly()) return;
			this._eventName = eventName;
		}
		get droppedAttributesCount() {
			return this._droppedAttributesCount;
		}
		constructor(_sharedState, instrumentationScope, logRecord) {
			const { timestamp, observedTimestamp, eventName, severityNumber, severityText, body, attributes = {}, exception, context } = logRecord;
			const now = Date.now();
			this._hrTime = (0, core_1.timeInputToHrTime)(timestamp ?? now);
			this._hrTimeObserved = (0, core_1.timeInputToHrTime)(observedTimestamp ?? now);
			if (context) {
				const spanContext = api.trace.getSpanContext(context);
				if (spanContext && api.isSpanContextValid(spanContext)) this._spanContext = spanContext;
			}
			this.severityNumber = severityNumber;
			this.severityText = severityText;
			this.body = body;
			this.resource = _sharedState.resource;
			this.instrumentationScope = instrumentationScope;
			this._logRecordLimits = _sharedState.logRecordLimits;
			this._eventName = eventName;
			this.setAttributes(attributes);
			if (exception != null) this._setException(exception);
		}
		setAttribute(key, value) {
			if (this._isLogRecordReadonly()) return this;
			const decision = (0, validation_1.addAttribute)(this.attributes, this._logRecordLimits, this._attributesCount, key, value);
			if (decision === validation_1.AddAttributeDecision.DROP_LIMIT_REACHED) {
				this._droppedAttributesCount++;
				if (this._droppedAttributesCount === 1) api.diag.warn("Dropping extra attributes.");
			} else if (decision === validation_1.AddAttributeDecision.ADD_NEW) this._attributesCount++;
			return this;
		}
		setAttributes(attributes) {
			for (const [k, v] of Object.entries(attributes)) this.setAttribute(k, v);
			return this;
		}
		setBody(body) {
			this.body = body;
			return this;
		}
		setEventName(eventName) {
			this.eventName = eventName;
			return this;
		}
		setSeverityNumber(severityNumber) {
			this.severityNumber = severityNumber;
			return this;
		}
		setSeverityText(severityText) {
			this.severityText = severityText;
			return this;
		}
		/**
		* @internal
		* A LogRecordProcessor may freely modify logRecord for the duration of the OnEmit call.
		* If logRecord is needed after OnEmit returns (i.e. for asynchronous processing) only reads are permitted.
		*/
		_makeReadonly() {
			this._isReadonly = true;
		}
		_setException(exception) {
			let hasMinimumAttributes = false;
			if (typeof exception === "string" || typeof exception === "number") {
				if (!Object.hasOwn(this.attributes, semantic_conventions_1.ATTR_EXCEPTION_MESSAGE)) this.setAttribute(semantic_conventions_1.ATTR_EXCEPTION_MESSAGE, String(exception));
				hasMinimumAttributes = true;
			} else if (exception && typeof exception === "object") {
				const exceptionObj = exception;
				if (exceptionObj.code) {
					if (!Object.hasOwn(this.attributes, semantic_conventions_1.ATTR_EXCEPTION_TYPE)) this.setAttribute(semantic_conventions_1.ATTR_EXCEPTION_TYPE, exceptionObj.code.toString());
					hasMinimumAttributes = true;
				} else if (exceptionObj.name) {
					if (!Object.hasOwn(this.attributes, semantic_conventions_1.ATTR_EXCEPTION_TYPE)) this.setAttribute(semantic_conventions_1.ATTR_EXCEPTION_TYPE, exceptionObj.name);
					hasMinimumAttributes = true;
				}
				if (exceptionObj.message) {
					if (!Object.hasOwn(this.attributes, semantic_conventions_1.ATTR_EXCEPTION_MESSAGE)) this.setAttribute(semantic_conventions_1.ATTR_EXCEPTION_MESSAGE, exceptionObj.message);
					hasMinimumAttributes = true;
				}
				if (exceptionObj.stack) {
					if (!Object.hasOwn(this.attributes, semantic_conventions_1.ATTR_EXCEPTION_STACKTRACE)) this.setAttribute(semantic_conventions_1.ATTR_EXCEPTION_STACKTRACE, exceptionObj.stack);
					hasMinimumAttributes = true;
				}
			}
			if (!hasMinimumAttributes) api.diag.warn(`Failed to record an exception ${exception}`);
		}
		_isLogRecordReadonly() {
			if (this._isReadonly) api.diag.warn("Can not execute the operation on emitted log record");
			return this._isReadonly;
		}
	};
	exports.LogRecordImpl = LogRecordImpl;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-logs/build/src/Logger.js
var require_Logger = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Logger = void 0;
	const api_logs_1 = require_src$10();
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const LogRecordImpl_1 = require_LogRecordImpl();
	var Logger = class {
		_instrumentationScope;
		_sharedState;
		_loggerConfig;
		constructor(instrumentationScope, sharedState) {
			this._instrumentationScope = instrumentationScope;
			this._sharedState = sharedState;
			this._loggerConfig = this._sharedState.getLoggerConfig(this._instrumentationScope);
		}
		emit(logRecord) {
			const currentContext = logRecord.context || api_1.context.active();
			if (!this.enabled(logRecord)) return;
			/**
			* If a Logger was obtained with include_trace_context=true,
			* the LogRecords it emits MUST automatically include the Trace Context from the active Context,
			* if Context has not been explicitly set.
			*/
			const logRecordInstance = new LogRecordImpl_1.LogRecordImpl(this._sharedState, this._instrumentationScope, {
				context: currentContext,
				...logRecord
			});
			this._sharedState.loggerMetrics.emitLog();
			/**
			* the explicitly passed Context,
			* the current Context, or an empty Context if the Logger was obtained with include_trace_context=false
			*/
			this._sharedState.activeProcessor.onEmit(logRecordInstance, currentContext);
			/**
			* A LogRecordProcessor may freely modify logRecord for the duration of the OnEmit call.
			* If logRecord is needed after OnEmit returns (i.e. for asynchronous processing) only reads are permitted.
			*/
			logRecordInstance._makeReadonly();
		}
		enabled(options) {
			if (this._sharedState.hasShutdown) return false;
			const loggerConfig = this._loggerConfig;
			if (loggerConfig.disabled) return false;
			const severityNumber = options?.severityNumber;
			if (typeof severityNumber === "number" && severityNumber !== api_logs_1.SeverityNumber.UNSPECIFIED && severityNumber < loggerConfig.minimumSeverity) return false;
			const currentContext = options?.context || api_1.context.active();
			if (loggerConfig.traceBased) {
				const spanContext = api_1.trace.getSpanContext(currentContext);
				if (spanContext && (0, api_1.isSpanContextValid)(spanContext)) {
					if (!((spanContext.traceFlags & api_1.TraceFlags.SAMPLED) === api_1.TraceFlags.SAMPLED)) return false;
				}
			}
			const enabledOpts = {
				context: currentContext,
				instrumentationScope: this._instrumentationScope,
				severityNumber: options?.severityNumber,
				eventName: options?.eventName
			};
			for (const processor of this._sharedState.processors) if (!processor.enabled || processor.enabled(enabledOpts)) return true;
			return false;
		}
	};
	exports.Logger = Logger;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-logs/build/src/export/NoopLogRecordProcessor.js
var require_NoopLogRecordProcessor = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.NoopLogRecordProcessor = void 0;
	var NoopLogRecordProcessor = class {
		forceFlush() {
			return Promise.resolve();
		}
		onEmit(_logRecord, _context) {}
		shutdown() {
			return Promise.resolve();
		}
		enabled(_options) {
			return false;
		}
	};
	exports.NoopLogRecordProcessor = NoopLogRecordProcessor;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-logs/build/src/MultiLogRecordProcessor.js
var require_MultiLogRecordProcessor = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MultiLogRecordProcessor = void 0;
	const core_1 = require_src$13();
	/**
	* Implementation of the {@link LogRecordProcessor} that simply forwards all
	* received events to a list of {@link LogRecordProcessor}s.
	*/
	var MultiLogRecordProcessor = class {
		processors;
		constructor(processors) {
			this.processors = processors;
		}
		async forceFlush(options) {
			const timeout = options?.timeoutMillis ?? 3e4;
			await Promise.all(this.processors.map((processor) => (0, core_1.callWithTimeout)(processor.forceFlush(), timeout)));
		}
		onEmit(logRecord, context) {
			this.processors.forEach((processors) => processors.onEmit(logRecord, context));
		}
		async shutdown() {
			await Promise.all(this.processors.map((processor) => processor.shutdown()));
		}
		enabled(options) {
			for (const processor of this.processors) if (!processor.enabled || processor.enabled(options)) return true;
			return false;
		}
	};
	exports.MultiLogRecordProcessor = MultiLogRecordProcessor;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-logs/build/src/internal/utils.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getInstrumentationScopeKey = void 0;
	/**
	* Normalizes an AnyValue to a JSON-serializable [typeTag, payload] tuple.
	*
	* Using a type tag as the first element guarantees that two values can only
	* produce the same tuple when they have the same type AND the same data,
	* avoiding cross-type collisions such as:
	*   - null vs NaN vs Infinity (all become JSON `null` via JSON.stringify)
	*   - -0 vs 0 (both become JSON `0` via JSON.stringify)
	*   - string "null" vs the value null
	*
	* Object keys are sorted so that attribute maps with the same entries but
	* different insertion orders produce the same key.
	*/
	function normalizeAnyValue(value) {
		if (value === void 0) return ["u", null];
		if (value === null) return ["n", null];
		const valueType = typeof value;
		if (valueType === "string") return ["s", value];
		if (valueType === "boolean") return ["b", value];
		if (valueType === "number") {
			if (Number.isNaN(value)) return ["nan", null];
			if (value === Infinity) return ["inf", null];
			if (value === -Infinity) return ["-inf", null];
			if (Object.is(value, -0)) return ["n0", null];
			return ["d", value];
		}
		if (value instanceof Uint8Array) return ["bytes", Array.from(value)];
		if (Array.isArray(value)) return ["arr", value.map(normalizeAnyValue)];
		return ["map", Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => [k, normalizeAnyValue(v)])];
	}
	/**
	* Converting the instrumentation scope object to a unique identifier string.
	* @param scope - The instrumentation scope to convert
	* @returns A unique string identifier for the scope
	*/
	function getInstrumentationScopeKey(scope) {
		return JSON.stringify([
			scope.name,
			scope.version || "",
			scope.schemaUrl || "",
			normalizeAnyValue(scope.attributes),
			scope.droppedAttributesCount ?? 0
		]);
	}
	exports.getInstrumentationScopeKey = getInstrumentationScopeKey;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-logs/build/src/semconv.js
var require_semconv = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ATTR_ERROR_TYPE = exports.OTEL_COMPONENT_TYPE_VALUE_SIMPLE_LOG_PROCESSOR = exports.OTEL_COMPONENT_TYPE_VALUE_BATCHING_LOG_PROCESSOR = exports.ATTR_OTEL_COMPONENT_TYPE = exports.ATTR_OTEL_COMPONENT_NAME = exports.METRIC_OTEL_SDK_PROCESSOR_LOG_QUEUE_SIZE = exports.METRIC_OTEL_SDK_PROCESSOR_LOG_QUEUE_CAPACITY = exports.METRIC_OTEL_SDK_PROCESSOR_LOG_PROCESSED = exports.METRIC_OTEL_SDK_LOG_CREATED = void 0;
	/**
	* The number of logs submitted to enabled SDK Loggers.
	*
	* @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.METRIC_OTEL_SDK_LOG_CREATED = "otel.sdk.log.created";
	/**
	* The number of log records for which the processing has finished, either successful or failed.
	*
	* @note For successful processing, `error.type` **MUST NOT** be set. For failed processing, `error.type` **MUST** contain the failure cause.
	* For the SDK Simple and Batching Log Record Processor a log record is considered to be processed already when it has been submitted to the exporter,
	* not when the corresponding export call has finished.
	*
	* @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.METRIC_OTEL_SDK_PROCESSOR_LOG_PROCESSED = "otel.sdk.processor.log.processed";
	/**
	* The maximum number of log records the queue of a given instance of an SDK Log Record processor can hold.
	*
	* @note Only applies to Log Record processors which use a queue, e.g. the SDK Batching Log Record Processor.
	*
	* @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.METRIC_OTEL_SDK_PROCESSOR_LOG_QUEUE_CAPACITY = "otel.sdk.processor.log.queue.capacity";
	/**
	* The number of log records in the queue of a given instance of an SDK log processor.
	*
	* @note Only applies to log record processors which use a queue, e.g. the SDK Batching Log Record Processor.
	*
	* @experimental This metric is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.METRIC_OTEL_SDK_PROCESSOR_LOG_QUEUE_SIZE = "otel.sdk.processor.log.queue.size";
	/**
	* A name uniquely identifying the instance of the OpenTelemetry component within its containing SDK instance.
	*
	* @example otlp_grpc_span_exporter/0
	* @example custom-name
	*
	* @note Implementations **SHOULD** ensure a low cardinality for this attribute, even across application or SDK restarts.
	* E.g. implementations **MUST NOT** use UUIDs as values for this attribute.
	*
	* Implementations **MAY** achieve these goals by following a `<otel.component.type>/<instance-counter>` pattern, e.g. `batching_span_processor/0`.
	* Hereby `otel.component.type` refers to the corresponding attribute value of the component.
	*
	* The value of `instance-counter` **MAY** be automatically assigned by the component and uniqueness within the enclosing SDK instance **MUST** be guaranteed.
	* For example, `<instance-counter>` **MAY** be implemented by using a monotonically increasing counter (starting with `0`), which is incremented every time an
	* instance of the given component type is started.
	*
	* With this implementation, for example the first Batching Span Processor would have `batching_span_processor/0`
	* as `otel.component.name`, the second one `batching_span_processor/1` and so on.
	* These values will therefore be reused in the case of an application restart.
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_OTEL_COMPONENT_NAME = "otel.component.name";
	/**
	* A name identifying the type of the OpenTelemetry component.
	*
	* @example batching_span_processor
	* @example com.example.MySpanExporter
	*
	* @note If none of the standardized values apply, implementations **SHOULD** use the language-defined name of the type.
	* E.g. for Java the fully qualified classname **SHOULD** be used in this case.
	*
	* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.ATTR_OTEL_COMPONENT_TYPE = "otel.component.type";
	/**
	* Enum value "batching_log_processor" for attribute {@link ATTR_OTEL_COMPONENT_TYPE}.
	*
	* The builtin SDK batching log record processor
	*
	* @experimental This enum value is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.OTEL_COMPONENT_TYPE_VALUE_BATCHING_LOG_PROCESSOR = "batching_log_processor";
	/**
	* Enum value "simple_log_processor" for attribute {@link ATTR_OTEL_COMPONENT_TYPE}.
	*
	* The builtin SDK simple log record processor
	*
	* @experimental This enum value is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
	*/
	exports.OTEL_COMPONENT_TYPE_VALUE_SIMPLE_LOG_PROCESSOR = "simple_log_processor";
	/**
	* Describes a class of error the operation ended with.
	*
	* @example timeout
	* @example java.net.UnknownHostException
	* @example server_certificate_invalid
	* @example 500
	*
	* @note The `error.type` **SHOULD** be predictable, and **SHOULD** have low cardinality.
	*
	* When `error.type` is set to a type (e.g., an exception type), its
	* canonical class name identifying the type within the artifact **SHOULD** be used.
	*
	* Instrumentations **SHOULD** document the list of errors they report.
	*
	* The cardinality of `error.type` within one instrumentation library **SHOULD** be low.
	* Telemetry consumers that aggregate data from multiple instrumentation libraries and applications
	* should be prepared for `error.type` to have high cardinality at query time when no
	* additional filters are applied.
	*
	* If the operation has completed successfully, instrumentations **SHOULD NOT** set `error.type`.
	*
	* If a specific domain defines its own set of error identifiers (such as HTTP or RPC status codes),
	* it's **RECOMMENDED** to:
	*
	*   - Use a domain-specific attribute
	*   - Set `error.type` to capture all errors, regardless of whether they are defined within the domain-specific set or not.
	*/
	exports.ATTR_ERROR_TYPE = "error.type";
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-logs/build/src/LoggerMetrics.js
var require_LoggerMetrics = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.LoggerMetrics = void 0;
	const semconv_1 = require_semconv();
	/**
	* Generates `otel.sdk.log.*` metrics.
	* https://opentelemetry.io/docs/specs/semconv/otel/sdk-metrics/#log-metrics
	*/
	var LoggerMetrics = class {
		createdLogs;
		constructor(meter) {
			this.createdLogs = meter.createCounter(semconv_1.METRIC_OTEL_SDK_LOG_CREATED, {
				unit: "{log_record}",
				description: "The number of logs submitted to enabled SDK Loggers."
			});
		}
		emitLog() {
			this.createdLogs.add(1);
		}
	};
	exports.LoggerMetrics = LoggerMetrics;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-logs/build/src/version.js
var require_version = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.VERSION = void 0;
	exports.VERSION = "0.221.0";
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-logs/build/src/internal/LoggerProviderSharedState.js
var require_LoggerProviderSharedState = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.LoggerProviderSharedState = exports.DEFAULT_LOGGER_CONFIGURATOR = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const api_logs_1 = require_src$10();
	const NoopLogRecordProcessor_1 = require_NoopLogRecordProcessor();
	const MultiLogRecordProcessor_1 = require_MultiLogRecordProcessor();
	const utils_1 = require_utils();
	const LoggerMetrics_1 = require_LoggerMetrics();
	const version_1 = require_version();
	const DEFAULT_LOGGER_CONFIG = {
		disabled: false,
		minimumSeverity: api_logs_1.SeverityNumber.UNSPECIFIED,
		traceBased: false
	};
	/**
	* Default LoggerConfigurator that returns the default config for all loggers
	*/
	const DEFAULT_LOGGER_CONFIGURATOR = () => ({ ...DEFAULT_LOGGER_CONFIG });
	exports.DEFAULT_LOGGER_CONFIGURATOR = DEFAULT_LOGGER_CONFIGURATOR;
	var LoggerProviderSharedState = class {
		loggers = /* @__PURE__ */ new Map();
		activeProcessor;
		registeredLogRecordProcessors = [];
		resource;
		logRecordLimits;
		processors;
		loggerMetrics;
		hasShutdown = false;
		_loggerConfigurator;
		_loggerConfigs = /* @__PURE__ */ new Map();
		constructor(resource, logRecordLimits, processors, loggerConfigurator, meterProvider) {
			this.resource = resource;
			this.logRecordLimits = logRecordLimits;
			this.processors = processors;
			if (processors.length > 0) {
				this.registeredLogRecordProcessors = processors;
				this.activeProcessor = new MultiLogRecordProcessor_1.MultiLogRecordProcessor(this.registeredLogRecordProcessors);
			} else this.activeProcessor = new NoopLogRecordProcessor_1.NoopLogRecordProcessor();
			this._loggerConfigurator = loggerConfigurator ?? exports.DEFAULT_LOGGER_CONFIGURATOR;
			const meter = meterProvider ? meterProvider.getMeter("@opentelemetry/sdk-logs", version_1.VERSION) : (0, api_1.createNoopMeter)();
			this.loggerMetrics = new LoggerMetrics_1.LoggerMetrics(meter);
		}
		/**
		* Get the LoggerConfig for a given instrumentation scope.
		* Uses the LoggerConfigurator function to compute the config on first access
		* and caches the result.
		*
		* @experimental This feature is in development as per the OpenTelemetry specification.
		*/
		getLoggerConfig(instrumentationScope) {
			const key = (0, utils_1.getInstrumentationScopeKey)(instrumentationScope);
			let config = this._loggerConfigs.get(key);
			if (config) return config;
			config = this._loggerConfigurator(instrumentationScope);
			this._loggerConfigs.set(key, config);
			return config;
		}
	};
	exports.LoggerProviderSharedState = LoggerProviderSharedState;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-logs/build/src/LoggerProvider.js
var require_LoggerProvider = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.LoggerProvider = exports.DEFAULT_LOGGER_NAME = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const api_logs_1 = require_src$10();
	const resources_1 = require_src$12();
	const core_1 = require_src$13();
	const Logger_1 = require_Logger();
	const LoggerProviderSharedState_1 = require_LoggerProviderSharedState();
	const utils_1 = require_utils();
	const validation_1 = require_validation();
	exports.DEFAULT_LOGGER_NAME = "unknown";
	var LoggerProvider = class {
		_shutdownOnce;
		_sharedState;
		constructor(config = {}) {
			const mergedConfig = {
				resource: config.resource ?? (0, resources_1.defaultResource)(),
				logRecordLimits: {
					attributeCountLimit: config.logRecordLimits?.attributeCountLimit ?? 128,
					attributeValueLengthLimit: config.logRecordLimits?.attributeValueLengthLimit ?? Infinity
				},
				loggerConfigurator: config.loggerConfigurator ?? LoggerProviderSharedState_1.DEFAULT_LOGGER_CONFIGURATOR,
				processors: config.processors ?? [],
				meterProvider: config.meterProvider
			};
			this._sharedState = new LoggerProviderSharedState_1.LoggerProviderSharedState(mergedConfig.resource, mergedConfig.logRecordLimits, mergedConfig.processors, mergedConfig.loggerConfigurator, mergedConfig.meterProvider);
			this._shutdownOnce = new core_1.BindOnceFuture(this._shutdown, this);
		}
		/**
		* Get a logger with the configuration of the LoggerProvider.
		*/
		getLogger(name, version, options) {
			if (this._shutdownOnce.isCalled) {
				api_1.diag.warn("A shutdown LoggerProvider cannot provide a Logger");
				return (0, api_logs_1.createNoopLogger)();
			}
			if (!name) api_1.diag.warn("Logger requested without instrumentation scope name.");
			const instrumentationScope = {
				name: name || exports.DEFAULT_LOGGER_NAME,
				version,
				schemaUrl: options?.schemaUrl,
				...(0, validation_1.normalizeScopeAttributes)(this._sharedState.logRecordLimits, options?.attributes)
			};
			const key = (0, utils_1.getInstrumentationScopeKey)(instrumentationScope);
			if (!this._sharedState.loggers.has(key)) this._sharedState.loggers.set(key, new Logger_1.Logger(instrumentationScope, this._sharedState));
			return this._sharedState.loggers.get(key);
		}
		/**
		* Notifies all registered LogRecordProcessor to flush any buffered data.
		*
		* Returns a promise which is resolved when all flushes are complete.
		*/
		forceFlush(options) {
			if (this._shutdownOnce.isCalled) {
				api_1.diag.warn("invalid attempt to force flush after LoggerProvider shutdown");
				return this._shutdownOnce.promise;
			}
			return this._sharedState.activeProcessor.forceFlush(options);
		}
		/**
		* Flush all buffered data and shut down the LoggerProvider and all registered
		* LogRecordProcessor.
		*
		* Returns a promise which is resolved when all flushes are complete.
		*/
		shutdown() {
			if (this._shutdownOnce.isCalled) {
				api_1.diag.warn("shutdown may only be called once per LoggerProvider");
				return this._shutdownOnce.promise;
			}
			return this._shutdownOnce.call();
		}
		_shutdown() {
			this._sharedState.hasShutdown = true;
			return this._sharedState.activeProcessor.shutdown();
		}
	};
	exports.LoggerProvider = LoggerProvider;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-logs/build/src/export/ConsoleLogRecordExporter.js
var require_ConsoleLogRecordExporter = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ConsoleLogRecordExporter = void 0;
	const core_1 = require_src$13();
	/**
	* This is implementation of {@link LogRecordExporter} that prints LogRecords to the
	* console. This class can be used for diagnostic purposes.
	*
	* NOTE: This {@link LogRecordExporter} is intended for diagnostics use only, output rendered to the console may change at any time.
	*/
	var ConsoleLogRecordExporter = class {
		/**
		* Export logs.
		* @param logs
		* @param resultCallback
		*/
		export(logs, resultCallback) {
			this._sendLogRecords(logs, resultCallback);
		}
		/**
		* ForceFlush the exporter.
		* No-op for {@link ConsoleLogRecordExporter}
		*/
		async forceFlush() {}
		/**
		* Shutdown the exporter.
		*/
		async shutdown() {}
		/**
		* converts logRecord info into more readable format
		* @param logRecord
		*/
		_exportInfo(logRecord) {
			return {
				resource: { attributes: logRecord.resource.attributes },
				instrumentationScope: logRecord.instrumentationScope,
				timestamp: (0, core_1.hrTimeToMicroseconds)(logRecord.hrTime),
				traceId: logRecord.spanContext?.traceId,
				spanId: logRecord.spanContext?.spanId,
				traceFlags: logRecord.spanContext?.traceFlags,
				severityText: logRecord.severityText,
				severityNumber: logRecord.severityNumber,
				eventName: logRecord.eventName,
				body: logRecord.body,
				attributes: logRecord.attributes
			};
		}
		/**
		* Showing logs  in console
		* @param logRecords
		* @param done
		*/
		_sendLogRecords(logRecords, done) {
			for (const logRecord of logRecords) console.dir(this._exportInfo(logRecord), { depth: 3 });
			done?.({ code: core_1.ExportResultCode.SUCCESS });
		}
	};
	exports.ConsoleLogRecordExporter = ConsoleLogRecordExporter;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-logs/build/src/export/LogRecordProcessorMetrics.js
var require_LogRecordProcessorMetrics = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.LogRecordProcessorMetrics = void 0;
	const semconv_1 = require_semconv();
	const componentCounter = /* @__PURE__ */ new Map();
	var LogRecordProcessorMetrics = class {
		processedLogs;
		queueSize;
		queueSizeCallback;
		standardAttrs;
		droppedAttrs;
		constructor(componentType, meter, queueConfig) {
			const counter = componentCounter.get(componentType) ?? 0;
			componentCounter.set(componentType, counter + 1);
			this.standardAttrs = {
				[semconv_1.ATTR_OTEL_COMPONENT_TYPE]: componentType,
				[semconv_1.ATTR_OTEL_COMPONENT_NAME]: `${componentType}/${counter}`
			};
			this.droppedAttrs = {
				...this.standardAttrs,
				[semconv_1.ATTR_ERROR_TYPE]: "queue_full"
			};
			this.processedLogs = meter.createCounter(semconv_1.METRIC_OTEL_SDK_PROCESSOR_LOG_PROCESSED, {
				unit: "{log_record}",
				description: "The number of log records for which the processing has finished, either successful or failed."
			});
			if (queueConfig) {
				const { capacity, getQueueSize } = queueConfig;
				meter.createUpDownCounter(semconv_1.METRIC_OTEL_SDK_PROCESSOR_LOG_QUEUE_CAPACITY, {
					unit: "{log_record}",
					description: "The maximum number of log records the queue of a given instance of an SDK log processor can hold."
				}).add(capacity, this.standardAttrs);
				this.queueSize = meter.createObservableUpDownCounter(semconv_1.METRIC_OTEL_SDK_PROCESSOR_LOG_QUEUE_SIZE, {
					unit: "{log_record}",
					description: "The number of log records in the queue of a given instance of an SDK log processor."
				});
				this.queueSizeCallback = (result) => result.observe(getQueueSize(), this.standardAttrs);
				this.queueSize.addCallback(this.queueSizeCallback);
			}
		}
		dropLogs(count) {
			this.processedLogs.add(count, this.droppedAttrs);
		}
		finishLogs(count, error) {
			if (!error) {
				this.processedLogs.add(count, this.standardAttrs);
				return;
			}
			const attrs = {
				...this.standardAttrs,
				[semconv_1.ATTR_ERROR_TYPE]: error.name
			};
			this.processedLogs.add(count, attrs);
		}
		shutdown() {
			if (this.queueSize && this.queueSizeCallback) this.queueSize.removeCallback(this.queueSizeCallback);
		}
	};
	exports.LogRecordProcessorMetrics = LogRecordProcessorMetrics;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-logs/build/src/export/SimpleLogRecordProcessor.js
var require_SimpleLogRecordProcessor = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SimpleLogRecordProcessor = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const core_1 = require_src$13();
	const semconv_1 = require_semconv();
	const LogRecordProcessorMetrics_1 = require_LogRecordProcessorMetrics();
	/**
	* An implementation of the {@link LogRecordProcessor} interface that exports
	* each {@link LogRecord} as it is emitted.
	*
	* NOTE: This {@link LogRecordProcessor} exports every {@link LogRecord}
	* individually instead of batching them together, which can cause significant
	* performance overhead with most exporters. For production use, please consider
	* using the {@link BatchLogRecordProcessor} instead.
	*/
	var SimpleLogRecordProcessor = class {
		_exporter;
		_metrics;
		_shutdownOnce;
		_unresolvedExports;
		constructor(options) {
			this._exporter = options.exporter;
			this._shutdownOnce = new core_1.BindOnceFuture(this._shutdown, this);
			this._unresolvedExports = /* @__PURE__ */ new Set();
			const meter = options?.selfObsMeterProvider ? options.selfObsMeterProvider.getMeter("@opentelemetry/sdk-logs") : (0, api_1.createNoopMeter)();
			this._metrics = new LogRecordProcessorMetrics_1.LogRecordProcessorMetrics(semconv_1.OTEL_COMPONENT_TYPE_VALUE_SIMPLE_LOG_PROCESSOR, meter);
		}
		onEmit(logRecord, _context) {
			if (this._shutdownOnce.isCalled) return;
			const doExport = () => core_1.internal._export(this._exporter, [logRecord]).then((result) => {
				this._metrics.finishLogs(1, result.error);
				if (result.code !== core_1.ExportResultCode.SUCCESS) (0, core_1.globalErrorHandler)(result.error ?? /* @__PURE__ */ new Error(`SimpleLogRecordProcessor: log record export failed (status ${result})`));
			}).catch(core_1.globalErrorHandler);
			if (logRecord.resource.asyncAttributesPending) {
				const exportPromise = logRecord.resource.waitForAsyncAttributes?.().then(() => {
					this._unresolvedExports.delete(exportPromise);
					return doExport();
				}, core_1.globalErrorHandler);
				if (exportPromise != null) this._unresolvedExports.add(exportPromise);
			} else doExport();
		}
		async forceFlush() {
			await Promise.all(Array.from(this._unresolvedExports));
		}
		shutdown() {
			return this._shutdownOnce.call();
		}
		_shutdown() {
			this._metrics.shutdown();
			return this._exporter.shutdown();
		}
	};
	exports.SimpleLogRecordProcessor = SimpleLogRecordProcessor;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-logs/build/src/export/InMemoryLogRecordExporter.js
var require_InMemoryLogRecordExporter = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.InMemoryLogRecordExporter = void 0;
	const core_1 = require_src$13();
	/**
	* This class can be used for testing purposes. It stores the exported LogRecords
	* in a list in memory that can be retrieved using the `getFinishedLogRecords()`
	* method.
	*/
	var InMemoryLogRecordExporter = class {
		_finishedLogRecords = [];
		/**
		* Indicates if the exporter has been "shutdown."
		* When false, exported log records will not be stored in-memory.
		*/
		_stopped = false;
		export(logs, resultCallback) {
			if (this._stopped) return resultCallback({
				code: core_1.ExportResultCode.FAILED,
				error: /* @__PURE__ */ new Error("Exporter has been stopped")
			});
			this._finishedLogRecords.push(...logs);
			resultCallback({ code: core_1.ExportResultCode.SUCCESS });
		}
		async shutdown() {
			this._stopped = true;
			this.reset();
		}
		async forceFlush() {}
		getFinishedLogRecords() {
			return this._finishedLogRecords;
		}
		reset() {
			this._finishedLogRecords = [];
		}
	};
	exports.InMemoryLogRecordExporter = InMemoryLogRecordExporter;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-logs/build/src/export/BatchLogRecordProcessorBase.js
var require_BatchLogRecordProcessorBase = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.BatchLogRecordProcessorBase = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const core_1 = require_src$13();
	const LogRecordProcessorMetrics_1 = require_LogRecordProcessorMetrics();
	const semconv_1 = require_semconv();
	/**
	* Waits for all pending async resources in the log records to be resolved.
	*/
	async function waitForResources(logRecords) {
		const pendingResources = [];
		for (let i = 0, len = logRecords.length; i < len; i++) {
			const logRecord = logRecords[i];
			if (logRecord.resource.asyncAttributesPending && logRecord.resource.waitForAsyncAttributes) pendingResources.push(logRecord.resource.waitForAsyncAttributes());
		}
		if (pendingResources != null && pendingResources.length > 0) await Promise.all(pendingResources);
	}
	/**
	* Represents an export operation that handles the entire export workflow.
	*/
	var ExportOperation = class {
		_exportCompleted;
		_exportScheduledPromise;
		_metrics;
		_exportScheduledResolve;
		constructor(exporter, logRecords, exportTimeoutMillis, metrics) {
			this._exportScheduledPromise = new Promise((resolve) => {
				this._exportScheduledResolve = resolve;
			});
			this._exportCompleted = this._executeExport(exporter, logRecords, exportTimeoutMillis);
			this._metrics = metrics;
		}
		/** Get the promise that resolves when the export completes */
		get exportCompleted() {
			return this._exportCompleted;
		}
		/** Get the promise that resolves when exporter.export() has been called */
		get exportScheduled() {
			return this._exportScheduledPromise;
		}
		async _executeExport(exporter, logRecords, exportTimeoutMillis) {
			try {
				await waitForResources(logRecords);
				await api_1.context.with((0, core_1.suppressTracing)(api_1.context.active()), async () => {
					return this._exportWithTimeout(exporter, logRecords, exportTimeoutMillis);
				});
			} catch (e) {
				(0, core_1.globalErrorHandler)(e);
				this._exportScheduledResolve();
			}
		}
		async _exportWithTimeout(exporter, logRecords, exportTimeoutMillis) {
			return new Promise((resolve, reject) => {
				const timer = setTimeout(() => {
					reject(/* @__PURE__ */ new Error("Timeout"));
				}, exportTimeoutMillis);
				exporter.export(logRecords, (result) => {
					this._metrics.finishLogs(logRecords.length, result.error);
					clearTimeout(timer);
					if (result.code === core_1.ExportResultCode.SUCCESS) resolve();
					else reject(result.error ?? /* @__PURE__ */ new Error("BatchLogRecordProcessor: log record export failed"));
				});
				this._exportScheduledResolve();
			});
		}
	};
	var BatchLogRecordProcessorBase = class {
		_maxExportBatchSize;
		_maxQueueSize;
		_scheduledDelayMillis;
		_exportTimeoutMillis;
		_exporter;
		_metrics;
		_currentExport = null;
		_finishedLogRecords = [];
		_timer;
		_shutdownOnce;
		_flushing = false;
		constructor(options) {
			this._exporter = options.exporter;
			this._maxExportBatchSize = options.maxExportBatchSize ?? 512;
			this._maxQueueSize = options.maxQueueSize ?? 2048;
			this._scheduledDelayMillis = options.scheduledDelayMillis ?? 1e3;
			this._exportTimeoutMillis = options.exportTimeoutMillis ?? 3e4;
			this._shutdownOnce = new core_1.BindOnceFuture(this._shutdown, this);
			if (this._maxExportBatchSize > this._maxQueueSize) {
				api_1.diag.warn("BatchLogRecordProcessor: maxExportBatchSize must be smaller or equal to maxQueueSize, setting maxExportBatchSize to match maxQueueSize");
				this._maxExportBatchSize = this._maxQueueSize;
			}
			const meter = options?.selfObsMeterProvider ? options.selfObsMeterProvider.getMeter("@opentelemetry/sdk-logs") : (0, api_1.createNoopMeter)();
			this._metrics = new LogRecordProcessorMetrics_1.LogRecordProcessorMetrics(semconv_1.OTEL_COMPONENT_TYPE_VALUE_BATCHING_LOG_PROCESSOR, meter, {
				capacity: this._maxQueueSize,
				getQueueSize: () => this._finishedLogRecords.length
			});
		}
		onEmit(logRecord) {
			if (this._shutdownOnce.isCalled) return;
			this._addToBuffer(logRecord);
		}
		forceFlush() {
			if (this._shutdownOnce.isCalled) return this._shutdownOnce.promise;
			return this._flushAll();
		}
		/** Add a LogRecord in the buffer. */
		_addToBuffer(logRecord) {
			if (this._finishedLogRecords.length >= this._maxQueueSize) {
				this._metrics.dropLogs(1);
				return;
			}
			this._finishedLogRecords.push(logRecord);
			this._maybeStartTimer();
		}
		shutdown() {
			return this._shutdownOnce.call();
		}
		async _shutdown() {
			this.onShutdown();
			await this._flushAll();
			this._metrics.shutdown();
			await this._exporter.shutdown();
		}
		/**
		* Send all LogRecords to the exporter respecting the batch size limit
		* This function is used only on forceFlush or shutdown,
		* for all other cases _exportOneBatch should be used
		* */
		async _flushAll() {
			if (this._flushing) return;
			this._flushing = true;
			let toFlush = this._finishedLogRecords;
			this._finishedLogRecords = [];
			this._clearTimer();
			const inFlight = this._currentExport;
			if (inFlight !== null) {
				await this._exporter.forceFlush();
				await inFlight.exportCompleted;
				this._currentExport = null;
			}
			while (toFlush.length > 0) {
				let batch;
				if (toFlush.length <= this._maxExportBatchSize) {
					batch = toFlush;
					toFlush = [];
				} else batch = toFlush.splice(0, this._maxExportBatchSize);
				const exportOp = new ExportOperation(this._exporter, batch, this._exportTimeoutMillis, this._metrics);
				this._currentExport = exportOp;
				try {
					await exportOp.exportScheduled;
					await this._exporter.forceFlush();
					await exportOp.exportCompleted;
				} catch (e) {
					(0, core_1.globalErrorHandler)(e);
				} finally {
					this._currentExport = null;
				}
			}
			this._flushing = false;
			this._maybeStartTimer();
		}
		/**
		* Extracts one batch from the buffer.
		* Returns null if buffer is empty.
		*/
		_extractBatch() {
			if (this._finishedLogRecords.length === 0) return null;
			if (this._finishedLogRecords.length <= this._maxExportBatchSize) {
				const batch = this._finishedLogRecords;
				this._finishedLogRecords = [];
				return batch;
			} else return this._finishedLogRecords.splice(0, this._maxExportBatchSize);
		}
		_exportOneBatch() {
			this._clearTimer();
			const logRecords = this._extractBatch();
			if (logRecords === null) return;
			const exportOp = new ExportOperation(this._exporter, logRecords, this._exportTimeoutMillis, this._metrics);
			this._currentExport = exportOp;
			exportOp.exportCompleted.then(() => {
				this._currentExport = null;
				this._maybeStartTimer();
			}).catch((error) => {
				this._currentExport = null;
				(0, core_1.globalErrorHandler)(error);
				this._maybeStartTimer();
			});
		}
		_maybeStartTimer() {
			if (this._shutdownOnce.isCalled) return;
			if (this._flushing) return;
			if (this._finishedLogRecords.length === 0) return;
			if (this._currentExport !== null) return;
			if (this._finishedLogRecords.length >= this._maxExportBatchSize) {
				this._exportOneBatch();
				return;
			}
			if (this._timer !== void 0) return;
			this._timer = setTimeout(() => {
				this._timer = void 0;
				this._exportOneBatch();
			}, this._scheduledDelayMillis);
			if (typeof this._timer !== "number") this._timer.unref();
		}
		_clearTimer() {
			if (this._timer !== void 0) {
				clearTimeout(this._timer);
				this._timer = void 0;
			}
		}
	};
	exports.BatchLogRecordProcessorBase = BatchLogRecordProcessorBase;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-logs/build/src/platform/node/export/BatchLogRecordProcessor.js
var require_BatchLogRecordProcessor = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.BatchLogRecordProcessor = void 0;
	const BatchLogRecordProcessorBase_1 = require_BatchLogRecordProcessorBase();
	var BatchLogRecordProcessor = class extends BatchLogRecordProcessorBase_1.BatchLogRecordProcessorBase {
		onShutdown() {}
	};
	exports.BatchLogRecordProcessor = BatchLogRecordProcessor;
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-logs/build/src/platform/node/index.js
var require_node = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.BatchLogRecordProcessor = void 0;
	var BatchLogRecordProcessor_1 = require_BatchLogRecordProcessor();
	Object.defineProperty(exports, "BatchLogRecordProcessor", {
		enumerable: true,
		get: function() {
			return BatchLogRecordProcessor_1.BatchLogRecordProcessor;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-logs/build/src/platform/index.js
var require_platform = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.BatchLogRecordProcessor = void 0;
	var node_1 = require_node();
	Object.defineProperty(exports, "BatchLogRecordProcessor", {
		enumerable: true,
		get: function() {
			return node_1.BatchLogRecordProcessor;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-logs/build/src/config/LoggerConfigurators.js
var require_LoggerConfigurators = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createLoggerConfigurator = void 0;
	/**
	* Default LoggerConfig used when no pattern matches
	*
	* @experimental This feature is in development as per the OpenTelemetry specification.
	*/
	const DEFAULT_LOGGER_CONFIG = {
		disabled: false,
		minimumSeverity: require_src$10().SeverityNumber.UNSPECIFIED,
		traceBased: false
	};
	/**
	* Creates a LoggerConfigurator from an array of logger patterns.
	* Patterns are evaluated in order, and the first matching pattern's config is used.
	* Supports exact matching and simple wildcard patterns with '*'.
	*
	* The returned configurator computes a complete LoggerConfig by merging the matched
	* pattern's config with default values for any unspecified properties.
	*
	* @param patterns - Array of logger patterns with their configurations
	* @returns A LoggerConfigurator function that computes complete LoggerConfig
	* @experimental This feature is in development as per the OpenTelemetry specification.
	*
	* @example
	* ```typescript
	* const configurator = createLoggerConfigurator([
	*   { pattern: 'debug-logger', config: { minimumSeverity: SeverityNumber.DEBUG } },
	*   { pattern: 'prod-*', config: { minimumSeverity: SeverityNumber.WARN } },
	*   { pattern: '*', config: { minimumSeverity: SeverityNumber.INFO } },
	* ]);
	* ```
	*/
	function createLoggerConfigurator(patterns) {
		return (loggerScope) => {
			const loggerName = loggerScope.name;
			for (const { pattern, config } of patterns) if (matchesPattern(loggerName, pattern)) return {
				disabled: config.disabled ?? DEFAULT_LOGGER_CONFIG.disabled,
				minimumSeverity: config.minimumSeverity ?? DEFAULT_LOGGER_CONFIG.minimumSeverity,
				traceBased: config.traceBased ?? DEFAULT_LOGGER_CONFIG.traceBased
			};
			return { ...DEFAULT_LOGGER_CONFIG };
		};
	}
	exports.createLoggerConfigurator = createLoggerConfigurator;
	/**
	* Matches a logger name against a pattern.
	* Supports simple wildcard matching with '*'.
	*
	* @param name - The logger name to match
	* @param pattern - The pattern to match against (supports '*' wildcard)
	* @returns true if the name matches the pattern
	*/
	function matchesPattern(name, pattern) {
		if (pattern === name) return true;
		if (pattern.includes("*")) {
			const regexPattern = pattern.split("*").map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(".*");
			return new RegExp(`^${regexPattern}$`).test(name);
		}
		return false;
	}
}));
//#endregion
//#region node_modules/@opentelemetry/sdk-logs/build/src/index.js
var require_src$3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createLoggerConfigurator = exports.BatchLogRecordProcessor = exports.InMemoryLogRecordExporter = exports.SimpleLogRecordProcessor = exports.ConsoleLogRecordExporter = exports.LoggerProvider = void 0;
	var LoggerProvider_1 = require_LoggerProvider();
	Object.defineProperty(exports, "LoggerProvider", {
		enumerable: true,
		get: function() {
			return LoggerProvider_1.LoggerProvider;
		}
	});
	var ConsoleLogRecordExporter_1 = require_ConsoleLogRecordExporter();
	Object.defineProperty(exports, "ConsoleLogRecordExporter", {
		enumerable: true,
		get: function() {
			return ConsoleLogRecordExporter_1.ConsoleLogRecordExporter;
		}
	});
	var SimpleLogRecordProcessor_1 = require_SimpleLogRecordProcessor();
	Object.defineProperty(exports, "SimpleLogRecordProcessor", {
		enumerable: true,
		get: function() {
			return SimpleLogRecordProcessor_1.SimpleLogRecordProcessor;
		}
	});
	var InMemoryLogRecordExporter_1 = require_InMemoryLogRecordExporter();
	Object.defineProperty(exports, "InMemoryLogRecordExporter", {
		enumerable: true,
		get: function() {
			return InMemoryLogRecordExporter_1.InMemoryLogRecordExporter;
		}
	});
	var platform_1 = require_platform();
	Object.defineProperty(exports, "BatchLogRecordProcessor", {
		enumerable: true,
		get: function() {
			return platform_1.BatchLogRecordProcessor;
		}
	});
	var LoggerConfigurators_1 = require_LoggerConfigurators();
	Object.defineProperty(exports, "createLoggerConfigurator", {
		enumerable: true,
		get: function() {
			return LoggerConfigurators_1.createLoggerConfigurator;
		}
	});
}));
//#endregion
//#region extensions/diagnostics-otel/src/service-attributes.ts
var import_src$7 = require_src$4();
var import_src$8 = require_src$3();
function redactOtelAttributes(attributes) {
	const redactedAttributes = {};
	for (const [key, value] of Object.entries(attributes)) {
		if (DROPPED_OTEL_ATTRIBUTE_KEYS.has(key)) continue;
		redactedAttributes[key] = typeof value === "string" ? redactSensitiveText(value) : value;
	}
	return redactedAttributes;
}
function securityTargetNameAttr(value, fallback = "unknown") {
	if (!value) return fallback;
	const redacted = redactSensitiveText(value.trim());
	const redactedLower = redacted.toLowerCase();
	if (redactedLower.startsWith("agent:") || redactedLower.includes(":agent:")) return fallback;
	return SECURITY_TARGET_NAME_VALUE_RE.test(redacted) ? redacted : fallback;
}
function shouldCaptureOtelLogBody(policy) {
	return policy.logBodies;
}
function otelLogTimestampIso(timestamp) {
	if (timestamp instanceof Date) return timestamp.toISOString();
	if (typeof timestamp === "number" && Number.isFinite(timestamp)) return new Date(timestamp).toISOString();
	if (Array.isArray(timestamp)) {
		const [seconds, nanoseconds] = timestamp;
		if (Number.isFinite(seconds) && Number.isFinite(nanoseconds)) return new Date(seconds * 1e3 + Math.trunc(nanoseconds / 1e6)).toISOString();
	}
	return (/* @__PURE__ */ new Date()).toISOString();
}
function writeStdoutDiagnosticLogRecord(params) {
	const { logRecord, serviceName, traceContext } = params;
	const line = {
		ts: otelLogTimestampIso(logRecord.timestamp),
		signal: "openclaw.diagnostic.log",
		"service.name": serviceName,
		severityText: logRecord.severityText,
		severityNumber: logRecord.severityNumber,
		body: logRecord.body,
		attributes: logRecord.attributes ?? {},
		...traceContext?.traceId ? { trace_id: traceContext.traceId } : {},
		...traceContext?.spanId ? { span_id: traceContext.spanId } : {},
		...traceContext?.traceFlags ? { trace_flags: traceContext.traceFlags } : {}
	};
	process.stdout.write(`${JSON.stringify(line)}\n`);
}
function assignOtelLogAttribute(attributes, key, value) {
	if (Object.keys(attributes).length >= 64) return;
	if (BLOCKED_OTEL_LOG_ATTRIBUTE_KEYS.has(key)) return;
	if (redactSensitiveText(key) !== key) return;
	if (!OTEL_LOG_ATTRIBUTE_KEY_RE.test(key)) return;
	if (typeof value === "string") {
		attributes[key] = normalizeOtelLogString(value, MAX_OTEL_LOG_ATTRIBUTE_VALUE_CHARS);
		return;
	}
	if (typeof value === "number" && Number.isFinite(value)) {
		attributes[key] = value;
		return;
	}
	if (typeof value === "boolean") attributes[key] = value;
}
function assignOtelEventAttributes(attributes, eventAttributes, keyPrefix, normalizeString) {
	if (!eventAttributes) return;
	for (const [rawKey, value] of Object.entries(eventAttributes)) {
		if (Object.keys(attributes).length >= 64) break;
		const key = rawKey.trim();
		if (BLOCKED_OTEL_LOG_ATTRIBUTE_KEYS.has(key) || redactSensitiveText(key) !== key || !OTEL_LOG_RAW_ATTRIBUTE_KEY_RE.test(key)) continue;
		const normalized = typeof value === "string" && normalizeString ? normalizeString(value) : value;
		assignOtelLogAttribute(attributes, `${keyPrefix}${key}`, normalized);
	}
}
function assignOtelLogEventAttributes(attributes, eventAttributes) {
	assignOtelEventAttributes(attributes, eventAttributes, "openclaw.");
}
function assignOtelSecurityEventAttributes(attributes, eventAttributes) {
	assignOtelEventAttributes(attributes, eventAttributes, "openclaw.security.attribute.", normalizeDiagnosticValue);
}
function securitySeverityText(severity) {
	switch (severity) {
		case "critical": return "FATAL";
		case "high": return "ERROR";
		case "medium": return "WARN";
		case "info":
		case "low": return "INFO";
	}
	return severity;
}
function assignOtelSecurityAttributes(attributes, evt) {
	assignOtelLogAttribute(attributes, "openclaw.security.event_id", evt.eventId);
	assignOtelLogAttribute(attributes, "openclaw.security.category", evt.category);
	assignOtelLogAttribute(attributes, "openclaw.security.action", normalizeDiagnosticValue(evt.action));
	assignOtelLogAttribute(attributes, "openclaw.security.outcome", evt.outcome);
	assignOtelLogAttribute(attributes, "openclaw.security.severity", evt.severity);
	if (evt.reason) assignOtelLogAttribute(attributes, "openclaw.security.reason", normalizeDiagnosticValue(evt.reason));
	if (evt.actor) {
		assignOtelLogAttribute(attributes, "openclaw.security.actor.kind", evt.actor.kind);
		if (evt.actor.idHash) assignOtelLogAttribute(attributes, "openclaw.security.actor.id_hash", normalizeDiagnosticValue(evt.actor.idHash));
		if (evt.actor.deviceIdHash) assignOtelLogAttribute(attributes, "openclaw.security.actor.device_id_hash", normalizeDiagnosticValue(evt.actor.deviceIdHash));
		if (evt.actor.channel) assignOtelLogAttribute(attributes, "openclaw.security.actor.channel", normalizeDiagnosticValue(evt.actor.channel));
		if (evt.actor.role) assignOtelLogAttribute(attributes, "openclaw.security.actor.role", normalizeDiagnosticValue(evt.actor.role));
		if (evt.actor.scopes?.length) assignOtelLogAttribute(attributes, "openclaw.security.actor.scopes", evt.actor.scopes.map((scope) => normalizeDiagnosticValue(scope)).join(","));
	}
	if (evt.target) {
		assignOtelLogAttribute(attributes, "openclaw.security.target.kind", evt.target.kind);
		if (evt.target.idHash) assignOtelLogAttribute(attributes, "openclaw.security.target.id_hash", normalizeDiagnosticValue(evt.target.idHash));
		if (evt.target.name) assignOtelLogAttribute(attributes, "openclaw.security.target.name", securityTargetNameAttr(evt.target.name));
		if (evt.target.owner) assignOtelLogAttribute(attributes, "openclaw.security.target.owner", normalizeDiagnosticValue(evt.target.owner));
	}
	if (evt.policy) {
		if (evt.policy.id) assignOtelLogAttribute(attributes, "openclaw.security.policy.id", normalizeDiagnosticValue(evt.policy.id));
		if (evt.policy.decision) assignOtelLogAttribute(attributes, "openclaw.security.policy.decision", evt.policy.decision);
		if (evt.policy.reason) assignOtelLogAttribute(attributes, "openclaw.security.policy.reason", normalizeDiagnosticValue(evt.policy.reason));
	}
	if (evt.control) {
		if (evt.control.id) assignOtelLogAttribute(attributes, "openclaw.security.control.id", normalizeDiagnosticValue(evt.control.id));
		if (evt.control.family) assignOtelLogAttribute(attributes, "openclaw.security.control.family", evt.control.family);
	}
	assignOtelSecurityEventAttributes(attributes, evt.attributes);
}
//#endregion
//#region extensions/diagnostics-otel/src/service-trace-context.ts
init_esm$2();
function normalizeTraceContext(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const candidate = value;
	if (!isValidDiagnosticTraceId(candidate.traceId)) return;
	if (candidate.spanId !== void 0 && !isValidDiagnosticSpanId(candidate.spanId)) return;
	if (candidate.parentSpanId !== void 0 && !isValidDiagnosticSpanId(candidate.parentSpanId)) return;
	if (candidate.traceFlags !== void 0 && !isValidDiagnosticTraceFlags(candidate.traceFlags)) return;
	return {
		traceId: candidate.traceId,
		...candidate.spanId ? { spanId: candidate.spanId } : {},
		...candidate.parentSpanId ? { parentSpanId: candidate.parentSpanId } : {},
		...candidate.traceFlags ? { traceFlags: candidate.traceFlags } : {}
	};
}
function traceFlagsToOtel(traceFlags) {
	return (Number.parseInt(traceFlags ?? "00", 16) & TraceFlags.SAMPLED) !== 0 ? TraceFlags.SAMPLED : TraceFlags.NONE;
}
function contextForTraceContext(traceContext) {
	const normalized = normalizeTraceContext(traceContext);
	if (!normalized?.spanId) return;
	return trace.setSpanContext(context.active(), {
		traceId: normalized.traceId,
		spanId: normalized.spanId,
		traceFlags: traceFlagsToOtel(normalized.traceFlags),
		isRemote: true
	});
}
function contextForTrustedTraceContext(evt, metadata) {
	return metadata.trusted || metadata.trustedTraceContext === true ? contextForTraceContext(evt.trace) : void 0;
}
function normalizedTrustedTraceContext(evt, metadata) {
	return metadata.trusted || metadata.trustedTraceContext === true ? normalizeTraceContext(evt.trace) : void 0;
}
function addTraceAttributes(attributes, traceContext) {
	const normalized = normalizeTraceContext(traceContext);
	if (!normalized) return;
	attributes["openclaw.traceId"] = normalized.traceId;
	if (normalized.spanId) attributes["openclaw.spanId"] = normalized.spanId;
	if (normalized.parentSpanId) attributes["openclaw.parentSpanId"] = normalized.parentSpanId;
	if (normalized.traceFlags) attributes["openclaw.traceFlags"] = normalized.traceFlags;
}
//#endregion
//#region extensions/diagnostics-otel/src/service-logs.ts
const LOG_SEVERITY_MAP = {
	TRACE: 1,
	DEBUG: 5,
	INFO: 9,
	WARN: 13,
	ERROR: 17,
	FATAL: 21
};
function createDiagnosticsLogExporter(params) {
	const { contentCapturePolicy, emitExporterEvent, flushIntervalMs, headers, logger, logsEnabled, logsToOtlp, logsToStdout, logHttpAgentOptions, logUrl, resource, serviceName } = params;
	let logProvider = null;
	const logSeverityMap = LOG_SEVERITY_MAP;
	let recordLogRecord;
	let recordSecurityEvent;
	if (logsEnabled) {
		let logRecordExportFailureLastReportedAt = Number.NEGATIVE_INFINITY;
		let otelLogger;
		const activeTransports = [...logsToOtlp ? ["otlp-http-protobuf"] : [], ...logsToStdout ? ["stdout"] : []];
		if (logsToOtlp) {
			logProvider = new import_src$8.LoggerProvider({
				resource,
				processors: [new import_src$8.BatchLogRecordProcessor({
					exporter: observeOtlpExporterHealth(new import_src$7.OTLPLogExporter({
						...logUrl ? { url: logUrl } : {},
						...headers ? { headers } : {},
						...logHttpAgentOptions ? { httpAgentOptions: logHttpAgentOptions } : {}
					}), {
						emitExporterEvent,
						signal: "logs"
					}),
					...typeof flushIntervalMs === "number" ? { scheduledDelayMillis: Math.max(1e3, flushIntervalMs) } : {}
				})]
			});
			otelLogger = logProvider.getLogger("openclaw");
		}
		const reportLogExportFailure = (err, label, transport) => {
			emitExporterEvent({
				exporter: "diagnostics-otel",
				signal: "logs",
				transport,
				status: "failure",
				reason: "emit_failed",
				errorCategory: errorCategory(err)
			});
			const now = Date.now();
			if (now - logRecordExportFailureLastReportedAt >= 6e4) {
				logRecordExportFailureLastReportedAt = now;
				logger.error(`diagnostics-otel: ${label} export failed: ${formatError(err)}`);
			}
		};
		const reportLogExportRecovery = (transport) => {
			emitExporterEvent({
				exporter: "diagnostics-otel",
				signal: "logs",
				transport,
				status: "recovered",
				reason: "emit_failed"
			});
		};
		const reportLogPreparationFailure = (err, label) => {
			for (const transport of activeTransports) reportLogExportFailure(err, label, transport);
		};
		const emitLogRecord = ({ logRecord, traceContext }, label) => {
			if (logsToOtlp) try {
				otelLogger?.emit(logRecord);
				reportLogExportRecovery("otlp-http-protobuf");
			} catch (error) {
				reportLogExportFailure(error, label, "otlp-http-protobuf");
			}
			if (logsToStdout) try {
				writeStdoutDiagnosticLogRecord({
					logRecord,
					serviceName,
					...traceContext ? { traceContext } : {}
				});
				reportLogExportRecovery("stdout");
			} catch (error) {
				reportLogExportFailure(error, label, "stdout");
			}
		};
		const buildDiagnosticLogRecord = (evt, metadata) => {
			const logLevelName = evt.level || "INFO";
			const severityNumber = logSeverityMap[logLevelName] ?? 9;
			const body = shouldCaptureOtelLogBody(contentCapturePolicy) ? normalizeOtelLogString(evt.message || "log", MAX_OTEL_LOG_BODY_CHARS) : "log";
			const attributes = Object.create(null);
			assignOtelLogAttribute(attributes, "openclaw.log.level", logLevelName);
			if (evt.loggerName) assignOtelLogAttribute(attributes, "openclaw.logger", evt.loggerName);
			if (evt.loggerParents?.length) assignOtelLogAttribute(attributes, "openclaw.logger.parents", evt.loggerParents.join("."));
			assignOtelLogEventAttributes(attributes, evt.attributes);
			if (evt.code?.line) assignOtelLogAttribute(attributes, "code.lineno", evt.code.line);
			if (evt.code?.functionName) assignOtelLogAttribute(attributes, "code.function", evt.code.functionName);
			const traceContext = normalizedTrustedTraceContext(evt, metadata);
			addTraceAttributes(attributes, traceContext);
			const logRecord = {
				body,
				severityText: logLevelName,
				severityNumber,
				attributes: redactOtelAttributes(attributes),
				timestamp: evt.ts
			};
			const logContext = contextForTrustedTraceContext(evt, metadata);
			if (logContext) logRecord.context = logContext;
			return {
				logRecord,
				...traceContext ? { traceContext } : {}
			};
		};
		const buildSecurityLogRecord = (evt, metadata) => {
			const severityText = securitySeverityText(evt.severity);
			const attributes = Object.create(null);
			assignOtelSecurityAttributes(attributes, evt);
			const traceContext = normalizedTrustedTraceContext(evt, metadata);
			const logRecord = {
				body: "openclaw.security.event",
				severityText,
				severityNumber: logSeverityMap[severityText] ?? 9,
				attributes: redactOtelAttributes(attributes),
				timestamp: evt.ts
			};
			const logContext = contextForTrustedTraceContext(evt, metadata);
			if (logContext) logRecord.context = logContext;
			return {
				logRecord,
				...traceContext ? { traceContext } : {}
			};
		};
		recordLogRecord = (evt, metadata) => {
			try {
				const record = buildDiagnosticLogRecord(evt, metadata);
				emitLogRecord(record, "log record");
			} catch (err) {
				reportLogPreparationFailure(err, "log record");
			}
		};
		recordSecurityEvent = (evt, metadata) => {
			if (!metadata.trusted) return;
			try {
				const record = buildSecurityLogRecord(evt, metadata);
				emitLogRecord(record, "security event");
			} catch (err) {
				reportLogPreparationFailure(err, "security event");
			}
		};
	}
	return {
		logProvider,
		recordLogRecord,
		recordSecurityEvent
	};
}
//#endregion
//#region extensions/diagnostics-otel/src/service-metrics.ts
const DEFAULT_METRIC_NAME_PREFIX = "openclaw.";
function createDiagnosticsMetrics(meter, metricNamePrefix = DEFAULT_METRIC_NAME_PREFIX) {
	const resolveMetricName = (name) => `${metricNamePrefix}${name.slice(9)}`;
	const createCounter = (name, options) => meter.createCounter(resolveMetricName(name), options);
	const createHistogram = (name, options) => meter.createHistogram(resolveMetricName(name), options);
	return {
		tokensCounter: createCounter("openclaw.tokens", {
			unit: "1",
			description: "Token usage by type"
		}),
		genAiTokenUsageHistogram: meter.createHistogram("gen_ai.client.token.usage", {
			unit: "{token}",
			description: "Number of input and output tokens used by GenAI client operations",
			advice: { explicitBucketBoundaries: GEN_AI_TOKEN_USAGE_BUCKETS }
		}),
		genAiOperationDurationHistogram: meter.createHistogram("gen_ai.client.operation.duration", {
			unit: "s",
			description: "GenAI client operation duration",
			advice: { explicitBucketBoundaries: GEN_AI_OPERATION_DURATION_BUCKETS }
		}),
		costCounter: createCounter("openclaw.cost.usd", {
			unit: "1",
			description: "Estimated model cost (USD)"
		}),
		durationHistogram: createHistogram("openclaw.run.duration_ms", {
			unit: "ms",
			description: "Agent run duration",
			advice: { explicitBucketBoundaries: AGENT_DURATION_MS_BUCKETS }
		}),
		harnessDurationHistogram: createHistogram("openclaw.harness.duration_ms", {
			unit: "ms",
			description: "Agent harness lifecycle duration",
			advice: { explicitBucketBoundaries: AGENT_DURATION_MS_BUCKETS }
		}),
		contextHistogram: createHistogram("openclaw.context.tokens", {
			unit: "1",
			description: "Context window size and usage",
			advice: { explicitBucketBoundaries: CONTEXT_TOKENS_BUCKETS }
		}),
		webhookReceivedCounter: createCounter("openclaw.webhook.received", {
			unit: "1",
			description: "Webhook requests received"
		}),
		webhookErrorCounter: createCounter("openclaw.webhook.error", {
			unit: "1",
			description: "Webhook processing errors"
		}),
		webhookDurationHistogram: createHistogram("openclaw.webhook.duration_ms", {
			unit: "ms",
			description: "Webhook processing duration"
		}),
		messageQueuedCounter: createCounter("openclaw.message.queued", {
			unit: "1",
			description: "Messages queued for processing"
		}),
		messageReceivedCounter: createCounter("openclaw.message.received", {
			unit: "1",
			description: "Inbound messages received"
		}),
		messageDispatchStartedCounter: createCounter("openclaw.message.dispatch.started", {
			unit: "1",
			description: "Inbound message dispatch attempts started"
		}),
		messageDispatchCompletedCounter: createCounter("openclaw.message.dispatch.completed", {
			unit: "1",
			description: "Inbound message dispatch attempts completed"
		}),
		messageDispatchDurationHistogram: createHistogram("openclaw.message.dispatch.duration_ms", {
			unit: "ms",
			description: "Inbound message dispatch duration"
		}),
		messageProcessedCounter: createCounter("openclaw.message.processed", {
			unit: "1",
			description: "Messages processed by outcome"
		}),
		messageDurationHistogram: createHistogram("openclaw.message.duration_ms", {
			unit: "ms",
			description: "Message processing duration"
		}),
		messageDeliveryStartedCounter: createCounter("openclaw.message.delivery.started", {
			unit: "1",
			description: "Outbound message delivery attempts started"
		}),
		messageDeliveryDurationHistogram: createHistogram("openclaw.message.delivery.duration_ms", {
			unit: "ms",
			description: "Outbound message delivery duration"
		}),
		queueDepthHistogram: createHistogram("openclaw.queue.depth", {
			unit: "1",
			description: "Queue depth on enqueue/dequeue"
		}),
		queueWaitHistogram: createHistogram("openclaw.queue.wait_ms", {
			unit: "ms",
			description: "Queue wait time before execution"
		}),
		laneEnqueueCounter: createCounter("openclaw.queue.lane.enqueue", {
			unit: "1",
			description: "Command queue lane enqueue events"
		}),
		laneDequeueCounter: createCounter("openclaw.queue.lane.dequeue", {
			unit: "1",
			description: "Command queue lane dequeue events"
		}),
		sessionStateCounter: createCounter("openclaw.session.state", {
			unit: "1",
			description: "Session state transitions"
		}),
		sessionTurnCreatedCounter: createCounter("openclaw.session.turn.created", {
			unit: "1",
			description: "Agent session turns created"
		}),
		sessionStuckCounter: createCounter("openclaw.session.stuck", {
			unit: "1",
			description: "Sessions stuck in processing"
		}),
		sessionStuckAgeHistogram: createHistogram("openclaw.session.stuck_age_ms", {
			unit: "ms",
			description: "Age of stuck sessions"
		}),
		sessionRecoveryRequestedCounter: createCounter("openclaw.session.recovery.requested", {
			unit: "1",
			description: "Session recovery attempts requested"
		}),
		sessionRecoveryCompletedCounter: createCounter("openclaw.session.recovery.completed", {
			unit: "1",
			description: "Session recovery attempts completed"
		}),
		sessionRecoveryAgeHistogram: createHistogram("openclaw.session.recovery.age_ms", {
			unit: "ms",
			description: "Age of sessions selected for recovery"
		}),
		talkEventCounter: createCounter("openclaw.talk.event", {
			unit: "1",
			description: "Talk events emitted by type"
		}),
		talkEventDurationHistogram: createHistogram("openclaw.talk.event.duration_ms", {
			unit: "ms",
			description: "Talk event duration when reported"
		}),
		talkAudioBytesHistogram: createHistogram("openclaw.talk.audio.bytes", {
			unit: "By",
			description: "Talk audio frame byte lengths"
		}),
		runAttemptCounter: createCounter("openclaw.run.attempt", {
			unit: "1",
			description: "Run attempts"
		}),
		toolLoopCounter: createCounter("openclaw.tool.loop", {
			unit: "1",
			description: "Detected repetitive tool-call loop events"
		}),
		skillUsedCounter: createCounter("openclaw.skill.used", {
			unit: "1",
			description: "Skills used by agent runs"
		}),
		modelCallDurationHistogram: createHistogram("openclaw.model_call.duration_ms", {
			unit: "ms",
			description: "Model call duration"
		}),
		modelCallRequestBytesHistogram: createHistogram("openclaw.model_call.request_bytes", {
			unit: "By",
			description: "UTF-8 byte size of sanitized model request payloads"
		}),
		modelCallResponseBytesHistogram: createHistogram("openclaw.model_call.response_bytes", {
			unit: "By",
			description: "UTF-8 byte size of bounded streamed model response payloads"
		}),
		modelCallTimeToFirstByteHistogram: createHistogram("openclaw.model_call.time_to_first_byte_ms", {
			unit: "ms",
			description: "Elapsed time before the first streamed model response event"
		}),
		modelFailoverCounter: createCounter("openclaw.model.failover", {
			unit: "1",
			description: "Model failovers by source, destination, lane, and reason"
		}),
		toolExecutionDurationHistogram: createHistogram("openclaw.tool.execution.duration_ms", {
			unit: "ms",
			description: "Tool execution duration"
		}),
		toolExecutionBlockedCounter: createCounter("openclaw.tool.execution.blocked", {
			unit: "1",
			description: "Tool executions blocked by policy or sandbox diagnostics"
		}),
		execProcessDurationHistogram: createHistogram("openclaw.exec.duration_ms", {
			unit: "ms",
			description: "Exec process duration"
		}),
		memoryRssHistogram: createHistogram("openclaw.memory.rss_bytes", {
			unit: "By",
			description: "Resident set size reported by diagnostic memory samples"
		}),
		memoryHeapUsedHistogram: createHistogram("openclaw.memory.heap_used_bytes", {
			unit: "By",
			description: "Heap used bytes reported by diagnostic memory samples"
		}),
		memoryHeapTotalHistogram: createHistogram("openclaw.memory.heap_total_bytes", {
			unit: "By",
			description: "Heap total bytes reported by diagnostic memory samples"
		}),
		memoryExternalHistogram: createHistogram("openclaw.memory.external_bytes", {
			unit: "By",
			description: "External memory bytes reported by diagnostic memory samples"
		}),
		memoryArrayBuffersHistogram: createHistogram("openclaw.memory.array_buffers_bytes", {
			unit: "By",
			description: "ArrayBuffer bytes reported by diagnostic memory samples"
		}),
		memoryPressureCounter: createCounter("openclaw.memory.pressure", {
			unit: "1",
			description: "Diagnostic memory pressure events"
		}),
		asyncQueueDroppedCounter: createCounter("openclaw.diagnostic.async_queue.dropped", {
			unit: "1",
			description: "Async diagnostic queue drops by dropped event class"
		}),
		payloadLargeCounter: createCounter("openclaw.payload.large", {
			unit: "1",
			description: "Oversized payload diagnostics by surface and action"
		}),
		payloadLargeBytesHistogram: createHistogram("openclaw.payload.large_bytes", {
			unit: "By",
			description: "Oversized payload byte sizes by surface and action"
		}),
		livenessWarningCounter: createCounter("openclaw.liveness.warning", {
			unit: "1",
			description: "Diagnostic liveness warning events"
		}),
		livenessEventLoopDelayP99Histogram: createHistogram("openclaw.liveness.event_loop_delay_p99_ms", {
			unit: "ms",
			description: "P99 event-loop delay reported by diagnostic liveness warnings"
		}),
		livenessEventLoopDelayMaxHistogram: createHistogram("openclaw.liveness.event_loop_delay_max_ms", {
			unit: "ms",
			description: "Maximum event-loop delay reported by diagnostic liveness warnings"
		}),
		livenessEventLoopUtilizationHistogram: createHistogram("openclaw.liveness.event_loop_utilization", {
			unit: "1",
			description: "Event-loop utilization reported by diagnostic liveness warnings"
		}),
		livenessCpuCoreRatioHistogram: createHistogram("openclaw.liveness.cpu_core_ratio", {
			unit: "1",
			description: "CPU core ratio reported by diagnostic liveness warnings"
		}),
		telemetryExporterCounter: createCounter("openclaw.telemetry.exporter.events", {
			unit: "1",
			description: "Diagnostic telemetry exporter lifecycle and failure events"
		})
	};
}
//#endregion
//#region node_modules/@opentelemetry/context-async-hooks/build/src/AbstractAsyncHooksContextManager.js
var require_AbstractAsyncHooksContextManager = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AbstractAsyncHooksContextManager = void 0;
	const events_1 = __require("events");
	const ADD_LISTENER_METHODS = [
		"addListener",
		"on",
		"once",
		"prependListener",
		"prependOnceListener"
	];
	var AbstractAsyncHooksContextManager = class {
		/**
		* Binds a the certain context or the active one to the target function and then returns the target
		* @param context A context (span) to be bind to target
		* @param target a function or event emitter. When target or one of its callbacks is called,
		*  the provided context will be used as the active context for the duration of the call.
		*/
		bind(context, target) {
			if (target instanceof events_1.EventEmitter) return this._bindEventEmitter(context, target);
			if (typeof target === "function") return this._bindFunction(context, target);
			return target;
		}
		_bindFunction(context, target) {
			const manager = this;
			const contextWrapper = function(...args) {
				return manager.with(context, () => target.apply(this, args));
			};
			Object.defineProperty(contextWrapper, "length", {
				enumerable: false,
				configurable: true,
				writable: false,
				value: target.length
			});
			/**
			* It isn't possible to tell Typescript that contextWrapper is the same as T
			* so we forced to cast as any here.
			*/
			return contextWrapper;
		}
		/**
		* By default, EventEmitter call their callback with their context, which we do
		* not want, instead we will bind a specific context to all callbacks that
		* go through it.
		* @param context the context we want to bind
		* @param ee EventEmitter an instance of EventEmitter to patch
		*/
		_bindEventEmitter(context, ee) {
			if (this._getPatchMap(ee) !== void 0) return ee;
			this._createPatchMap(ee);
			ADD_LISTENER_METHODS.forEach((methodName) => {
				if (ee[methodName] === void 0) return;
				ee[methodName] = this._patchAddListener(ee, ee[methodName], context);
			});
			if (typeof ee.removeListener === "function") ee.removeListener = this._patchRemoveListener(ee, ee.removeListener);
			if (typeof ee.off === "function") ee.off = this._patchRemoveListener(ee, ee.off);
			if (typeof ee.removeAllListeners === "function") ee.removeAllListeners = this._patchRemoveAllListeners(ee, ee.removeAllListeners);
			return ee;
		}
		/**
		* Patch methods that remove a given listener so that we match the "patched"
		* version of that listener (the one that propagate context).
		* @param ee EventEmitter instance
		* @param original reference to the patched method
		*/
		_patchRemoveListener(ee, original) {
			const contextManager = this;
			return function(event, listener) {
				const events = contextManager._getPatchMap(ee)?.[event];
				if (events === void 0) return original.call(this, event, listener);
				const patchedListener = events.get(listener);
				return original.call(this, event, patchedListener || listener);
			};
		}
		/**
		* Patch methods that remove all listeners so we remove our
		* internal references for a given event.
		* @param ee EventEmitter instance
		* @param original reference to the patched method
		*/
		_patchRemoveAllListeners(ee, original) {
			const contextManager = this;
			return function(event) {
				const map = contextManager._getPatchMap(ee);
				if (map !== void 0) {
					if (arguments.length === 0) contextManager._createPatchMap(ee);
					else if (map[event] !== void 0) delete map[event];
				}
				return original.apply(this, arguments);
			};
		}
		/**
		* Patch methods on an event emitter instance that can add listeners so we
		* can force them to propagate a given context.
		* @param ee EventEmitter instance
		* @param original reference to the patched method
		* @param [context] context to propagate when calling listeners
		*/
		_patchAddListener(ee, original, context) {
			const contextManager = this;
			return function(event, listener) {
				/**
				* This check is required to prevent double-wrapping the listener.
				* The implementation for ee.once wraps the listener and calls ee.on.
				* Without this check, we would wrap that wrapped listener.
				* This causes an issue because ee.removeListener depends on the onceWrapper
				* to properly remove the listener. If we wrap their wrapper, we break
				* that detection.
				*/
				if (contextManager._wrapped) return original.call(this, event, listener);
				let map = contextManager._getPatchMap(ee);
				if (map === void 0) map = contextManager._createPatchMap(ee);
				let listeners = map[event];
				if (listeners === void 0) {
					listeners = /* @__PURE__ */ new WeakMap();
					map[event] = listeners;
				}
				const patchedListener = contextManager.bind(context, listener);
				listeners.set(listener, patchedListener);
				/**
				* See comment at the start of this function for the explanation of this property.
				*/
				contextManager._wrapped = true;
				try {
					return original.call(this, event, patchedListener);
				} finally {
					contextManager._wrapped = false;
				}
			};
		}
		_createPatchMap(ee) {
			const map = Object.create(null);
			ee[this._kOtListeners] = map;
			return map;
		}
		_getPatchMap(ee) {
			return ee[this._kOtListeners];
		}
		_kOtListeners = Symbol("OtListeners");
		_wrapped = false;
	};
	exports.AbstractAsyncHooksContextManager = AbstractAsyncHooksContextManager;
}));
//#endregion
//#region node_modules/@opentelemetry/context-async-hooks/build/src/AsyncHooksContextManager.js
var require_AsyncHooksContextManager = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AsyncHooksContextManager = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const asyncHooks = __require("async_hooks");
	const AbstractAsyncHooksContextManager_1 = require_AbstractAsyncHooksContextManager();
	/**
	* @deprecated Use AsyncLocalStorageContextManager instead.
	*/
	var AsyncHooksContextManager = class extends AbstractAsyncHooksContextManager_1.AbstractAsyncHooksContextManager {
		_asyncHook;
		_contexts = /* @__PURE__ */ new Map();
		_stack = [];
		constructor() {
			super();
			this._asyncHook = asyncHooks.createHook({
				init: this._init.bind(this),
				before: this._before.bind(this),
				after: this._after.bind(this),
				destroy: this._destroy.bind(this),
				promiseResolve: this._destroy.bind(this)
			});
		}
		active() {
			return this._stack[this._stack.length - 1] ?? api_1.ROOT_CONTEXT;
		}
		with(context, fn, thisArg, ...args) {
			this._enterContext(context);
			try {
				return fn.call(thisArg, ...args);
			} finally {
				this._exitContext();
			}
		}
		enable() {
			this._asyncHook.enable();
			return this;
		}
		disable() {
			this._asyncHook.disable();
			this._contexts.clear();
			this._stack = [];
			return this;
		}
		/**
		* Init hook will be called when userland create a async context, setting the
		* context as the current one if it exist.
		* @param uid id of the async context
		* @param type the resource type
		*/
		_init(uid, type) {
			if (type === "TIMERWRAP") return;
			const context = this._stack[this._stack.length - 1];
			if (context !== void 0) this._contexts.set(uid, context);
		}
		/**
		* Destroy hook will be called when a given context is no longer used so we can
		* remove its attached context.
		* @param uid uid of the async context
		*/
		_destroy(uid) {
			this._contexts.delete(uid);
		}
		/**
		* Before hook is called just before executing a async context.
		* @param uid uid of the async context
		*/
		_before(uid) {
			const context = this._contexts.get(uid);
			if (context !== void 0) this._enterContext(context);
		}
		/**
		* After hook is called just after completing the execution of a async context.
		*/
		_after() {
			this._exitContext();
		}
		/**
		* Set the given context as active
		*/
		_enterContext(context) {
			this._stack.push(context);
		}
		/**
		* Remove the context at the root of the stack
		*/
		_exitContext() {
			this._stack.pop();
		}
	};
	exports.AsyncHooksContextManager = AsyncHooksContextManager;
}));
//#endregion
//#region node_modules/@opentelemetry/context-async-hooks/build/src/AsyncLocalStorageContextManager.js
var require_AsyncLocalStorageContextManager = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AsyncLocalStorageContextManager = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const async_hooks_1 = __require("async_hooks");
	const AbstractAsyncHooksContextManager_1 = require_AbstractAsyncHooksContextManager();
	var AsyncLocalStorageContextManager = class extends AbstractAsyncHooksContextManager_1.AbstractAsyncHooksContextManager {
		_asyncLocalStorage;
		constructor() {
			super();
			this._asyncLocalStorage = new async_hooks_1.AsyncLocalStorage();
		}
		active() {
			return this._asyncLocalStorage.getStore() ?? api_1.ROOT_CONTEXT;
		}
		with(context, fn, thisArg, ...args) {
			const cb = thisArg == null ? fn : fn.bind(thisArg);
			return this._asyncLocalStorage.run(context, cb, ...args);
		}
		enable() {
			return this;
		}
		disable() {
			this._asyncLocalStorage.disable();
			return this;
		}
	};
	exports.AsyncLocalStorageContextManager = AsyncLocalStorageContextManager;
}));
//#endregion
//#region node_modules/@opentelemetry/context-async-hooks/build/src/index.js
var require_src$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AsyncLocalStorageContextManager = exports.AsyncHooksContextManager = void 0;
	var AsyncHooksContextManager_1 = require_AsyncHooksContextManager();
	Object.defineProperty(exports, "AsyncHooksContextManager", {
		enumerable: true,
		get: function() {
			return AsyncHooksContextManager_1.AsyncHooksContextManager;
		}
	});
	var AsyncLocalStorageContextManager_1 = require_AsyncLocalStorageContextManager();
	Object.defineProperty(exports, "AsyncLocalStorageContextManager", {
		enumerable: true,
		get: function() {
			return AsyncLocalStorageContextManager_1.AsyncLocalStorageContextManager;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/propagator-b3/build/src/common.js
var require_common = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.B3_DEBUG_FLAG_KEY = void 0;
	/** shared context for storing an extracted b3 debug flag */
	exports.B3_DEBUG_FLAG_KEY = (0, (init_esm$2(), __toCommonJS(esm_exports$2)).createContextKey)("OpenTelemetry Context Key B3 Debug Flag");
}));
//#endregion
//#region node_modules/@opentelemetry/propagator-b3/build/src/constants.js
var require_constants = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.X_B3_FLAGS = exports.X_B3_PARENT_SPAN_ID = exports.X_B3_SAMPLED = exports.X_B3_SPAN_ID = exports.X_B3_TRACE_ID = exports.B3_CONTEXT_HEADER = void 0;
	/** B3 single-header key */
	exports.B3_CONTEXT_HEADER = "b3";
	exports.X_B3_TRACE_ID = "x-b3-traceid";
	exports.X_B3_SPAN_ID = "x-b3-spanid";
	exports.X_B3_SAMPLED = "x-b3-sampled";
	exports.X_B3_PARENT_SPAN_ID = "x-b3-parentspanid";
	exports.X_B3_FLAGS = "x-b3-flags";
}));
//#endregion
//#region node_modules/@opentelemetry/propagator-b3/build/src/B3MultiPropagator.js
var require_B3MultiPropagator = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.B3MultiPropagator = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const core_1 = require_src$13();
	const common_1 = require_common();
	const constants_1 = require_constants();
	const VALID_SAMPLED_VALUES = /* @__PURE__ */ new Set([
		true,
		"true",
		"True",
		"1",
		1
	]);
	const VALID_UNSAMPLED_VALUES = /* @__PURE__ */ new Set([
		false,
		"false",
		"False",
		"0",
		0
	]);
	function isValidSampledValue(sampled) {
		return sampled === api_1.TraceFlags.SAMPLED || sampled === api_1.TraceFlags.NONE;
	}
	function parseHeader(header) {
		return Array.isArray(header) ? header[0] : header;
	}
	function getHeaderValue(carrier, getter, key) {
		return parseHeader(getter.get(carrier, key));
	}
	function getTraceId(carrier, getter) {
		const traceId = getHeaderValue(carrier, getter, constants_1.X_B3_TRACE_ID);
		if (typeof traceId === "string") return traceId.padStart(32, "0");
		return "";
	}
	function getSpanId(carrier, getter) {
		const spanId = getHeaderValue(carrier, getter, constants_1.X_B3_SPAN_ID);
		if (typeof spanId === "string") return spanId;
		return "";
	}
	function getDebug(carrier, getter) {
		return getHeaderValue(carrier, getter, constants_1.X_B3_FLAGS) === "1" ? "1" : void 0;
	}
	function getTraceFlags(carrier, getter) {
		const traceFlags = getHeaderValue(carrier, getter, constants_1.X_B3_SAMPLED);
		if (getDebug(carrier, getter) === "1" || VALID_SAMPLED_VALUES.has(traceFlags)) return api_1.TraceFlags.SAMPLED;
		if (traceFlags === void 0 || VALID_UNSAMPLED_VALUES.has(traceFlags)) return api_1.TraceFlags.NONE;
	}
	/**
	* Propagator for the B3 multiple-header HTTP format.
	* Based on: https://github.com/openzipkin/b3-propagation
	*/
	var B3MultiPropagator = class {
		inject(context, carrier, setter) {
			const spanContext = api_1.trace.getSpanContext(context);
			if (!spanContext || !(0, api_1.isSpanContextValid)(spanContext) || (0, core_1.isTracingSuppressed)(context)) return;
			const debug = context.getValue(common_1.B3_DEBUG_FLAG_KEY);
			setter.set(carrier, constants_1.X_B3_TRACE_ID, spanContext.traceId);
			setter.set(carrier, constants_1.X_B3_SPAN_ID, spanContext.spanId);
			if (debug === "1") setter.set(carrier, constants_1.X_B3_FLAGS, debug);
			else if (spanContext.traceFlags !== void 0) setter.set(carrier, constants_1.X_B3_SAMPLED, (api_1.TraceFlags.SAMPLED & spanContext.traceFlags) === api_1.TraceFlags.SAMPLED ? "1" : "0");
		}
		extract(context, carrier, getter) {
			const traceId = getTraceId(carrier, getter);
			const spanId = getSpanId(carrier, getter);
			const traceFlags = getTraceFlags(carrier, getter);
			const debug = getDebug(carrier, getter);
			if ((0, api_1.isValidTraceId)(traceId) && (0, api_1.isValidSpanId)(spanId) && isValidSampledValue(traceFlags)) {
				context = context.setValue(common_1.B3_DEBUG_FLAG_KEY, debug);
				return api_1.trace.setSpanContext(context, {
					traceId,
					spanId,
					isRemote: true,
					traceFlags
				});
			}
			return context;
		}
		fields() {
			return [
				constants_1.X_B3_TRACE_ID,
				constants_1.X_B3_SPAN_ID,
				constants_1.X_B3_FLAGS,
				constants_1.X_B3_SAMPLED,
				constants_1.X_B3_PARENT_SPAN_ID
			];
		}
	};
	exports.B3MultiPropagator = B3MultiPropagator;
}));
//#endregion
//#region node_modules/@opentelemetry/propagator-b3/build/src/B3SinglePropagator.js
var require_B3SinglePropagator = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.B3SinglePropagator = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const core_1 = require_src$13();
	const common_1 = require_common();
	const constants_1 = require_constants();
	const B3_CONTEXT_REGEX = /((?:[0-9a-f]{16}){1,2})-([0-9a-f]{16})(?:-([01d](?![0-9a-f])))?(?:-([0-9a-f]{16}))?/;
	const PADDING = "0".repeat(16);
	const SAMPLED_VALUES = /* @__PURE__ */ new Set(["d", "1"]);
	const DEBUG_STATE = "d";
	function convertToTraceId128(traceId) {
		return traceId.length === 32 ? traceId : `${PADDING}${traceId}`;
	}
	function convertToTraceFlags(samplingState) {
		if (samplingState && SAMPLED_VALUES.has(samplingState)) return api_1.TraceFlags.SAMPLED;
		return api_1.TraceFlags.NONE;
	}
	/**
	* Propagator for the B3 single-header HTTP format.
	* Based on: https://github.com/openzipkin/b3-propagation
	*/
	var B3SinglePropagator = class {
		inject(context, carrier, setter) {
			const spanContext = api_1.trace.getSpanContext(context);
			if (!spanContext || !(0, api_1.isSpanContextValid)(spanContext) || (0, core_1.isTracingSuppressed)(context)) return;
			const samplingState = context.getValue(common_1.B3_DEBUG_FLAG_KEY) || spanContext.traceFlags & 1;
			const value = `${spanContext.traceId}-${spanContext.spanId}-${samplingState}`;
			setter.set(carrier, constants_1.B3_CONTEXT_HEADER, value);
		}
		extract(context, carrier, getter) {
			const header = getter.get(carrier, constants_1.B3_CONTEXT_HEADER);
			const b3Context = Array.isArray(header) ? header[0] : header;
			if (typeof b3Context !== "string") return context;
			const match = b3Context.match(B3_CONTEXT_REGEX);
			if (!match) return context;
			const [, extractedTraceId, spanId, samplingState] = match;
			const traceId = convertToTraceId128(extractedTraceId);
			if (!(0, api_1.isValidTraceId)(traceId) || !(0, api_1.isValidSpanId)(spanId)) return context;
			const traceFlags = convertToTraceFlags(samplingState);
			if (samplingState === DEBUG_STATE) context = context.setValue(common_1.B3_DEBUG_FLAG_KEY, samplingState);
			return api_1.trace.setSpanContext(context, {
				traceId,
				spanId,
				isRemote: true,
				traceFlags
			});
		}
		fields() {
			return [constants_1.B3_CONTEXT_HEADER];
		}
	};
	exports.B3SinglePropagator = B3SinglePropagator;
}));
//#endregion
//#region node_modules/@opentelemetry/propagator-b3/build/src/types.js
var require_types = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.B3InjectEncoding = void 0;
	/** Enumeration of B3 inject encodings */
	var B3InjectEncoding;
	(function(B3InjectEncoding) {
		B3InjectEncoding[B3InjectEncoding["SINGLE_HEADER"] = 0] = "SINGLE_HEADER";
		B3InjectEncoding[B3InjectEncoding["MULTI_HEADER"] = 1] = "MULTI_HEADER";
	})(B3InjectEncoding || (exports.B3InjectEncoding = B3InjectEncoding = {}));
}));
//#endregion
//#region node_modules/@opentelemetry/propagator-b3/build/src/B3Propagator.js
var require_B3Propagator = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.B3Propagator = void 0;
	const core_1 = require_src$13();
	const B3MultiPropagator_1 = require_B3MultiPropagator();
	const B3SinglePropagator_1 = require_B3SinglePropagator();
	const constants_1 = require_constants();
	const types_1 = require_types();
	/**
	* Propagator that extracts B3 context in both single and multi-header variants,
	* with configurable injection format defaulting to B3 single-header. Due to
	* the asymmetry in injection and extraction formats this is not suitable to
	* be implemented as a composite propagator.
	* Based on: https://github.com/openzipkin/b3-propagation
	*/
	var B3Propagator = class {
		_b3MultiPropagator = new B3MultiPropagator_1.B3MultiPropagator();
		_b3SinglePropagator = new B3SinglePropagator_1.B3SinglePropagator();
		_inject;
		_fields;
		constructor(config = {}) {
			if (config.injectEncoding === types_1.B3InjectEncoding.MULTI_HEADER) {
				this._inject = this._b3MultiPropagator.inject;
				this._fields = this._b3MultiPropagator.fields();
			} else {
				this._inject = this._b3SinglePropagator.inject;
				this._fields = this._b3SinglePropagator.fields();
			}
		}
		inject(context, carrier, setter) {
			if ((0, core_1.isTracingSuppressed)(context)) return;
			this._inject(context, carrier, setter);
		}
		extract(context, carrier, getter) {
			const header = getter.get(carrier, constants_1.B3_CONTEXT_HEADER);
			if (Array.isArray(header) ? header[0] : header) return this._b3SinglePropagator.extract(context, carrier, getter);
			else return this._b3MultiPropagator.extract(context, carrier, getter);
		}
		fields() {
			return this._fields;
		}
	};
	exports.B3Propagator = B3Propagator;
}));
//#endregion
//#region node_modules/@opentelemetry/propagator-b3/build/src/index.js
var require_src$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.B3InjectEncoding = exports.X_B3_TRACE_ID = exports.X_B3_SPAN_ID = exports.X_B3_SAMPLED = exports.X_B3_PARENT_SPAN_ID = exports.X_B3_FLAGS = exports.B3_CONTEXT_HEADER = exports.B3Propagator = void 0;
	var B3Propagator_1 = require_B3Propagator();
	Object.defineProperty(exports, "B3Propagator", {
		enumerable: true,
		get: function() {
			return B3Propagator_1.B3Propagator;
		}
	});
	var constants_1 = require_constants();
	Object.defineProperty(exports, "B3_CONTEXT_HEADER", {
		enumerable: true,
		get: function() {
			return constants_1.B3_CONTEXT_HEADER;
		}
	});
	Object.defineProperty(exports, "X_B3_FLAGS", {
		enumerable: true,
		get: function() {
			return constants_1.X_B3_FLAGS;
		}
	});
	Object.defineProperty(exports, "X_B3_PARENT_SPAN_ID", {
		enumerable: true,
		get: function() {
			return constants_1.X_B3_PARENT_SPAN_ID;
		}
	});
	Object.defineProperty(exports, "X_B3_SAMPLED", {
		enumerable: true,
		get: function() {
			return constants_1.X_B3_SAMPLED;
		}
	});
	Object.defineProperty(exports, "X_B3_SPAN_ID", {
		enumerable: true,
		get: function() {
			return constants_1.X_B3_SPAN_ID;
		}
	});
	Object.defineProperty(exports, "X_B3_TRACE_ID", {
		enumerable: true,
		get: function() {
			return constants_1.X_B3_TRACE_ID;
		}
	});
	var types_1 = require_types();
	Object.defineProperty(exports, "B3InjectEncoding", {
		enumerable: true,
		get: function() {
			return types_1.B3InjectEncoding;
		}
	});
}));
//#endregion
//#region node_modules/@opentelemetry/propagator-jaeger/build/src/JaegerPropagator.js
var require_JaegerPropagator = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.JaegerPropagator = exports.UBER_BAGGAGE_HEADER_PREFIX = exports.UBER_TRACE_ID_HEADER = void 0;
	const api_1 = (init_esm$2(), __toCommonJS(esm_exports$2));
	const core_1 = require_src$13();
	exports.UBER_TRACE_ID_HEADER = "uber-trace-id";
	exports.UBER_BAGGAGE_HEADER_PREFIX = "uberctx";
	/**
	* Propagates {@link SpanContext} through Trace Context format propagation.
	* {trace-id}:{span-id}:{parent-span-id}:{flags}
	* {trace-id}
	* 64-bit or 128-bit random number in base16 format.
	* Can be variable length, shorter values are 0-padded on the left.
	* Value of 0 is invalid.
	* {span-id}
	* 64-bit random number in base16 format.
	* {parent-span-id}
	* Set to 0 because this field is deprecated.
	* {flags}
	* One byte bitmap, as two hex digits.
	* Inspired by jaeger-client-node project.
	* @deprecated Use {@link W3CTraceContextPropagator} from `@opentelemetry/core` instead.
	* The Jaeger propagator is deprecated by the OpenTelemetry specification.
	* This package will be removed in a future major release.
	*/
	var JaegerPropagator = class {
		_jaegerTraceHeader;
		_jaegerBaggageHeaderPrefix;
		constructor(config) {
			if (typeof config === "string") {
				this._jaegerTraceHeader = config;
				this._jaegerBaggageHeaderPrefix = exports.UBER_BAGGAGE_HEADER_PREFIX;
			} else {
				this._jaegerTraceHeader = config?.customTraceHeader || exports.UBER_TRACE_ID_HEADER;
				this._jaegerBaggageHeaderPrefix = config?.customBaggageHeaderPrefix || exports.UBER_BAGGAGE_HEADER_PREFIX;
			}
		}
		inject(context, carrier, setter) {
			const spanContext = api_1.trace.getSpanContext(context);
			const baggage = api_1.propagation.getBaggage(context);
			if (spanContext && (0, core_1.isTracingSuppressed)(context) === false) {
				const traceFlags = `0${(spanContext.traceFlags || api_1.TraceFlags.NONE).toString(16)}`;
				setter.set(carrier, this._jaegerTraceHeader, `${spanContext.traceId}:${spanContext.spanId}:0:${traceFlags}`);
			}
			if (baggage) for (const [key, entry] of baggage.getAllEntries()) setter.set(carrier, `${this._jaegerBaggageHeaderPrefix}-${key}`, encodeURIComponent(entry.value));
		}
		extract(context, carrier, getter) {
			const uberTraceIdHeader = getter.get(carrier, this._jaegerTraceHeader);
			const uberTraceId = Array.isArray(uberTraceIdHeader) ? uberTraceIdHeader[0] : uberTraceIdHeader;
			const baggageValues = getter.keys(carrier).filter((key) => key.startsWith(`${this._jaegerBaggageHeaderPrefix}-`)).map((key) => {
				const value = getter.get(carrier, key);
				return {
					key: key.substring(this._jaegerBaggageHeaderPrefix.length + 1),
					value: Array.isArray(value) ? value[0] : value
				};
			});
			let newContext = context;
			if (typeof uberTraceId === "string") {
				const spanContext = deserializeSpanContext(uberTraceId);
				if (spanContext) newContext = api_1.trace.setSpanContext(newContext, spanContext);
			}
			if (baggageValues.length === 0) return newContext;
			let currentBaggage = api_1.propagation.getBaggage(context) ?? api_1.propagation.createBaggage();
			for (const baggageEntry of baggageValues) {
				if (baggageEntry.value === void 0) continue;
				let decodedValue;
				try {
					decodedValue = decodeURIComponent(baggageEntry.value);
				} catch {
					continue;
				}
				currentBaggage = currentBaggage.setEntry(baggageEntry.key, { value: decodedValue });
			}
			newContext = api_1.propagation.setBaggage(newContext, currentBaggage);
			return newContext;
		}
		fields() {
			return [this._jaegerTraceHeader];
		}
	};
	exports.JaegerPropagator = JaegerPropagator;
	const VALID_HEX_RE = /^[0-9a-f]{1,2}$/i;
	/**
	* @param {string} serializedString - a serialized span context.
	* @return {SpanContext} - returns a span context represented by the serializedString.
	**/
	function deserializeSpanContext(serializedString) {
		let decoded;
		try {
			decoded = decodeURIComponent(serializedString);
		} catch {
			return null;
		}
		const headers = decoded.split(":");
		if (headers.length !== 4) return null;
		const [_traceId, _spanId, , flags] = headers;
		return {
			traceId: _traceId.padStart(32, "0"),
			spanId: _spanId.padStart(16, "0"),
			isRemote: true,
			traceFlags: VALID_HEX_RE.test(flags) ? parseInt(flags, 16) & 1 : 1
		};
	}
}));
//#endregion
//#region node_modules/@opentelemetry/propagator-jaeger/build/src/index.js
var require_src = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.UBER_TRACE_ID_HEADER = exports.UBER_BAGGAGE_HEADER_PREFIX = exports.JaegerPropagator = void 0;
	var JaegerPropagator_1 = require_JaegerPropagator();
	Object.defineProperty(exports, "JaegerPropagator", {
		enumerable: true,
		get: function() {
			return JaegerPropagator_1.JaegerPropagator;
		}
	});
	Object.defineProperty(exports, "UBER_BAGGAGE_HEADER_PREFIX", {
		enumerable: true,
		get: function() {
			return JaegerPropagator_1.UBER_BAGGAGE_HEADER_PREFIX;
		}
	});
	Object.defineProperty(exports, "UBER_TRACE_ID_HEADER", {
		enumerable: true,
		get: function() {
			return JaegerPropagator_1.UBER_TRACE_ID_HEADER;
		}
	});
}));
//#endregion
//#region extensions/diagnostics-otel/src/service-propagation.ts
init_esm$2();
var import_src$4 = require_src$2();
var import_src$5 = require_src$1();
var import_src$6 = require_src();
const DEFAULT_PROPAGATORS = ["tracecontext", "baggage"];
const CONTEXT_OWNER_KEY = createContextKey("openclaw.owned-sdk.context-owner");
const PROPAGATOR_OWNER_KEY = createContextKey("openclaw.owned-sdk.propagator-owner");
var OwnedContextManager = class extends import_src$4.AsyncLocalStorageContextManager {
	constructor(owner) {
		super();
		this.owner = owner;
	}
	with(activeContext, fn, thisArg, ...args) {
		const probe = activeContext.getValue(CONTEXT_OWNER_KEY);
		if (probe && typeof probe === "object") probe.owner = this.owner;
		return super.with(activeContext, fn, thisArg, ...args);
	}
};
var OwnedPropagator = class {
	constructor(delegate, owner) {
		this.delegate = delegate;
		this.owner = owner;
	}
	inject(carrierContext, carrier, setter) {
		const probe = carrierContext.getValue(PROPAGATOR_OWNER_KEY);
		if (probe && typeof probe === "object") {
			probe.owner = this.owner;
			return;
		}
		this.delegate.inject(carrierContext, carrier, setter);
	}
	extract(carrierContext, carrier, getter) {
		return this.delegate.extract(carrierContext, carrier, getter);
	}
	fields() {
		return this.delegate.fields();
	}
};
function ownsGlobalPropagator(owner) {
	const probe = {};
	propagation.inject(ROOT_CONTEXT.setValue(PROPAGATOR_OWNER_KEY, probe), {}, { set() {} });
	return probe.owner === owner;
}
function ownsGlobalContextManager(owner) {
	const probe = {};
	context.with(ROOT_CONTEXT.setValue(CONTEXT_OWNER_KEY, probe), () => {});
	return probe.owner === owner;
}
function createConfiguredPropagator(warn) {
	const names = ((0, import_src$9.getStringListFromEnv)("OTEL_PROPAGATORS") ?? DEFAULT_PROPAGATORS).map((name) => name.toLowerCase());
	if (names.includes("none")) return null;
	const propagators = [...new Set(names)].flatMap((name) => {
		switch (name) {
			case "tracecontext": return [new import_src$9.W3CTraceContextPropagator()];
			case "baggage": return [new import_src$9.W3CBaggagePropagator()];
			case "b3": return [new import_src$5.B3Propagator()];
			case "b3multi": return [new import_src$5.B3Propagator({ injectEncoding: import_src$5.B3InjectEncoding.MULTI_HEADER })];
			case "jaeger":
				warn("The Jaeger propagator is deprecated and will be removed in a future release. Use the W3C TraceContext propagator (\"tracecontext\") instead.");
				return [new import_src$6.JaegerPropagator()];
			default:
				warn(`Propagator "${name}" requested through environment variable is unavailable.`);
				return [];
		}
	});
	if (propagators.length === 0) return null;
	return propagators.length === 1 ? propagators[0] : new import_src$9.CompositePropagator({ propagators });
}
function registerOwnedSdkRuntime(warn) {
	const owner = {};
	const contextManager = new OwnedContextManager(owner).enable();
	const ownsContext = context.setGlobalContextManager(contextManager);
	if (!ownsContext) contextManager.disable();
	const propagator = createConfiguredPropagator(warn);
	const ownsPropagation = propagator ? propagation.setGlobalPropagator(new OwnedPropagator(propagator, owner)) : false;
	if (!ownsContext && !ownsPropagation) return null;
	return () => {
		if (ownsPropagation && ownsGlobalPropagator(owner)) propagation.disable();
		if (ownsContext && ownsGlobalContextManager(owner)) context.disable();
		else if (ownsContext) contextManager.disable();
	};
}
//#endregion
//#region extensions/diagnostics-otel/src/service-recorder-runtime.ts
function createDiagnosticsRecorderRuntime(params) {
	return {
		...params.metrics,
		...params.traces,
		contentCapturePolicy: params.contentCapturePolicy,
		tracesEnabled: params.tracesEnabled
	};
}
//#endregion
//#region extensions/diagnostics-otel/src/service-recorders-harness.ts
init_esm$2();
function createHarnessRecorders(runtime) {
	const { harnessDurationHistogram, modelFailoverCounter, activeTrustedSpans, spanWithDuration, trustedTraceContext, activeTrustedParentContext, trackTrustedSpan, setSpanAttrs, completeTrackedLifecycleSpan, addRunAttrs, tracesEnabled } = runtime;
	const harnessRunMetricAttrs = (evt) => ({
		"openclaw.harness.id": normalizeDiagnosticValue(evt.harnessId, "unknown"),
		"openclaw.harness.plugin": normalizeDiagnosticValue(evt.pluginId),
		...evt.type === "harness.run.started" ? {} : { "openclaw.outcome": evt.type === "harness.run.error" ? "error" : evt.outcome },
		"openclaw.provider": normalizeDiagnosticValue(evt.provider, "unknown"),
		"openclaw.model": normalizeDiagnosticValue(evt.model, "unknown"),
		...evt.channel ? { "openclaw.channel": normalizeDiagnosticValue(evt.channel) } : {}
	});
	const recordHarnessRunStarted = (evt, metadata) => {
		if (!tracesEnabled || !metadata.trusted) return;
		trackTrustedSpan(evt, metadata, spanWithDuration("openclaw.harness.run", harnessRunMetricAttrs(evt), void 0, {
			parentContext: activeTrustedParentContext(evt, metadata),
			startTimeMs: evt.ts
		}));
	};
	const recordHarnessRunCompleted = (evt, metadata, privateData) => {
		harnessDurationHistogram.record(evt.durationMs, harnessRunMetricAttrs(evt));
		if (!tracesEnabled) return;
		const spanAttrs = { ...harnessRunMetricAttrs(evt) };
		if (evt.resultClassification) spanAttrs["openclaw.harness.result_classification"] = normalizeDiagnosticValue(evt.resultClassification);
		if (typeof evt.yieldDetected === "boolean") spanAttrs["openclaw.harness.yield_detected"] = evt.yieldDetected;
		if (evt.itemLifecycle) {
			spanAttrs["openclaw.harness.items.started"] = evt.itemLifecycle.startedCount;
			spanAttrs["openclaw.harness.items.completed"] = evt.itemLifecycle.completedCount;
			spanAttrs["openclaw.harness.items.active"] = evt.itemLifecycle.activeCount;
		}
		const redactedError = normalizeOtelErrorMessage(privateData.errorMessage);
		if (redactedError) spanAttrs["openclaw.error"] = redactedError;
		const trustedTrace = trustedTraceContext(evt, metadata);
		const trackedSpan = trustedTrace?.spanId ? activeTrustedSpans.get(trustedTrace.spanId) : void 0;
		const span = trackedSpan ?? spanWithDuration("openclaw.harness.run", spanAttrs, evt.durationMs, {
			parentContext: activeTrustedParentContext(evt, metadata),
			endTimeMs: evt.ts
		});
		setSpanAttrs(span, spanAttrs);
		if (evt.outcome === "error") span.setStatus({
			code: SpanStatusCode.ERROR,
			message: redactedError ?? "error"
		});
		if (trackedSpan && trustedTrace?.spanId) {
			completeTrackedLifecycleSpan(trustedTrace, trackedSpan, evt.ts);
			return;
		}
		span.end(evt.ts);
	};
	const recordHarnessRunError = (evt, metadata, privateData) => {
		const errorType = normalizeDiagnosticValue(evt.errorCategory, "other");
		const attrs = {
			...harnessRunMetricAttrs(evt),
			"openclaw.harness.phase": evt.phase,
			"openclaw.errorCategory": errorType
		};
		harnessDurationHistogram.record(evt.durationMs, attrs);
		if (!tracesEnabled) return;
		const redactedError = normalizeOtelErrorMessage(privateData.errorMessage);
		const spanAttrs = {
			...attrs,
			"error.type": errorType,
			...redactedError ? { "openclaw.error": redactedError } : {},
			...evt.cleanupFailed ? { "openclaw.harness.cleanup_failed": true } : {}
		};
		const trustedTrace = trustedTraceContext(evt, metadata);
		const trackedSpan = trustedTrace?.spanId ? activeTrustedSpans.get(trustedTrace.spanId) : void 0;
		const span = trackedSpan ?? spanWithDuration("openclaw.harness.run", spanAttrs, evt.durationMs, {
			parentContext: activeTrustedParentContext(evt, metadata),
			endTimeMs: evt.ts
		});
		setSpanAttrs(span, spanAttrs);
		span.setStatus({
			code: SpanStatusCode.ERROR,
			message: redactedError ?? errorType
		});
		if (trackedSpan && trustedTrace?.spanId) {
			completeTrackedLifecycleSpan(trustedTrace, trackedSpan, evt.ts);
			return;
		}
		span.end(evt.ts);
	};
	const recordContextAssembled = (evt, metadata) => {
		if (!tracesEnabled) return;
		const spanAttrs = {
			"openclaw.context.message_count": evt.messageCount,
			"openclaw.context.history_text_chars": evt.historyTextChars,
			"openclaw.context.history_image_blocks": evt.historyImageBlocks,
			"openclaw.context.max_message_text_chars": evt.maxMessageTextChars,
			"openclaw.context.system_prompt_chars": evt.systemPromptChars,
			"openclaw.context.prompt_chars": evt.promptChars,
			"openclaw.context.prompt_images": evt.promptImages
		};
		addRunAttrs(spanAttrs, evt);
		if (evt.contextTokenBudget !== void 0) spanAttrs["openclaw.context.token_budget"] = evt.contextTokenBudget;
		if (evt.reserveTokens !== void 0) spanAttrs["openclaw.context.reserve_tokens"] = evt.reserveTokens;
		spanWithDuration("openclaw.context.assembled", spanAttrs, 0, {
			parentContext: activeTrustedParentContext(evt, metadata),
			endTimeMs: evt.ts
		}).end(evt.ts);
	};
	const recordModelFailover = (evt, metadata) => {
		const metricAttrs = {
			"openclaw.failover.reason": normalizeDiagnosticValue(evt.reason, "unknown"),
			"openclaw.failover.suspended": evt.suspended === void 0 ? "unknown" : String(evt.suspended),
			"openclaw.lane": normalizeDiagnosticLane(evt.lane, "unknown"),
			"openclaw.model": normalizeDiagnosticValue(evt.fromModel),
			"openclaw.provider": normalizeDiagnosticValue(evt.fromProvider),
			"openclaw.failover.to_model": normalizeDiagnosticValue(evt.toModel),
			"openclaw.failover.to_provider": normalizeDiagnosticValue(evt.toProvider)
		};
		modelFailoverCounter.add(1, metricAttrs);
		if (!tracesEnabled) return;
		const spanAttrs = { "openclaw.failover.reason": normalizeDiagnosticValue(evt.reason, "unknown") };
		if (evt.fromProvider) spanAttrs["openclaw.provider"] = evt.fromProvider;
		if (evt.fromModel) spanAttrs["openclaw.model"] = evt.fromModel;
		if (evt.toProvider) spanAttrs["openclaw.failover.to_provider"] = evt.toProvider;
		if (evt.toModel) spanAttrs["openclaw.failover.to_model"] = evt.toModel;
		if (evt.lane) spanAttrs["openclaw.lane"] = normalizeDiagnosticLane(evt.lane, "unknown");
		if (evt.suspended !== void 0) spanAttrs["openclaw.failover.suspended"] = evt.suspended;
		if (evt.cascadeDepth !== void 0) spanAttrs["openclaw.failover.cascade_depth"] = evt.cascadeDepth;
		spanWithDuration("openclaw.model.failover", spanAttrs, 0, {
			parentContext: activeTrustedParentContext(evt, metadata),
			endTimeMs: evt.ts
		}).end(evt.ts);
	};
	return {
		recordHarnessRunStarted,
		recordHarnessRunCompleted,
		recordHarnessRunError,
		recordContextAssembled,
		recordModelFailover
	};
}
//#endregion
//#region node_modules/@opentelemetry/semantic-conventions/build/esm/experimental_attributes.js
/**
* The chat history provided to the model as an input.
*
* @example [
* {
* "role": "user",
* "parts": [
* {
* "type": "text",
* "content": "Weather in Paris?"
* }
* ]
* },
* {
* "role": "assistant",
* "parts": [
* {
* "type": "tool_call",
* "id": "call_VSPygqKTWdrhaFErNvMV18Yl",
* "name": "get_weather",
* "arguments": {
* "location": "Paris"
* }
* }
* ]
* },
* {
* "role": "tool",
* "parts": [
* {
* "type": "tool_call_response",
* "id": " call_VSPygqKTWdrhaFErNvMV18Yl",
* "result": "rainy, 57°F"
* }
* ]
* }
* ]
*
* @note Instrumentations **MUST** follow [Input messages JSON schema](https://github.com/open-telemetry/semantic-conventions/blob/v1.41.0/docs/gen-ai/gen-ai-input-messages.json).
* When the attribute is recorded on events, it **MUST** be recorded in structured
* form. When recorded on spans, it **MAY** be recorded as a JSON string if structured
* format is not supported and **SHOULD** be recorded in structured form otherwise.
*
* Messages **MUST** be provided in the order they were sent to the model.
* Instrumentations **MAY** provide a way for users to filter or truncate
* input messages.
*
* > [!Warning]
* > This attribute is likely to contain sensitive information including user/PII data.
*
* See [Recording content on attributes](https://github.com/open-telemetry/semantic-conventions/blob/v1.41.0/docs/gen-ai/gen-ai-spans.md#recording-content-on-attributes)
* section for more details.
*
* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
*
* @deprecated Moved to the [OpenTelemetry GenAI semantic conventions repository](https://github.com/open-telemetry/semantic-conventions-genai).
*/
const ATTR_GEN_AI_INPUT_MESSAGES = "gen_ai.input.messages";
/**
* Enum value "execute_tool" for attribute {@link ATTR_GEN_AI_OPERATION_NAME}.
*
* Execute a tool
*
* @experimental This enum value is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
*/
const GEN_AI_OPERATION_NAME_VALUE_EXECUTE_TOOL = "execute_tool";
/**
* Enum value "invoke_agent" for attribute {@link ATTR_GEN_AI_OPERATION_NAME}.
*
* Invoke GenAI agent
*
* @experimental This enum value is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
*/
const GEN_AI_OPERATION_NAME_VALUE_INVOKE_AGENT = "invoke_agent";
/**
* Messages returned by the model where each message represents a specific model response (choice, candidate).
*
* @example [
* {
* "role": "assistant",
* "parts": [
* {
* "type": "text",
* "content": "The weather in Paris is currently rainy with a temperature of 57°F."
* }
* ],
* "finish_reason": "stop"
* }
* ]
*
* @note Instrumentations **MUST** follow [Output messages JSON schema](https://github.com/open-telemetry/semantic-conventions/blob/v1.41.0/docs/gen-ai/gen-ai-output-messages.json)
*
* Each message represents a single output choice/candidate generated by
* the model. Each message corresponds to exactly one generation
* (choice/candidate) and vice versa - one choice cannot be split across
* multiple messages or one message cannot contain parts from multiple choices.
*
* When the attribute is recorded on events, it **MUST** be recorded in structured
* form. When recorded on spans, it **MAY** be recorded as a JSON string if structured
* format is not supported and **SHOULD** be recorded in structured form otherwise.
*
* Instrumentations **MAY** provide a way for users to filter or truncate
* output messages.
*
* > [!Warning]
* > This attribute is likely to contain sensitive information including user/PII data.
*
* See [Recording content on attributes](https://github.com/open-telemetry/semantic-conventions/blob/v1.41.0/docs/gen-ai/gen-ai-spans.md#recording-content-on-attributes)
* section for more details.
*
* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
*
* @deprecated Moved to the [OpenTelemetry GenAI semantic conventions repository](https://github.com/open-telemetry/semantic-conventions-genai).
*/
const ATTR_GEN_AI_OUTPUT_MESSAGES = "gen_ai.output.messages";
/**
* The system message or instructions provided to the GenAI model separately from the chat history.
*
* @example [
* {
* "type": "text",
* "content": "You are an Agent that greet users, always use greetings tool to respond"
* }
* ]
*
* @example [
* {
* "type": "text",
* "content": "You are a language translator."
* },
* {
* "type": "text",
* "content": "Your mission is to translate text in English to French."
* }
* ]
*
* @note This attribute **SHOULD** be used when the corresponding provider or API
* allows to provide system instructions or messages separately from the
* chat history.
*
* Instructions that are part of the chat history **SHOULD** be recorded in
* `gen_ai.input.messages` attribute instead.
*
* Instrumentations **MUST** follow [System instructions JSON schema](https://github.com/open-telemetry/semantic-conventions/blob/v1.41.0/docs/gen-ai/gen-ai-system-instructions.json).
*
* When recorded on spans, it **MAY** be recorded as a JSON string if structured
* format is not supported and **SHOULD** be recorded in structured form otherwise.
*
* Instrumentations **MAY** provide a way for users to filter or truncate
* system instructions.
*
* > [!Warning]
* > This attribute may contain sensitive information.
*
* See [Recording content on attributes](https://github.com/open-telemetry/semantic-conventions/blob/v1.41.0/docs/gen-ai/gen-ai-spans.md#recording-content-on-attributes)
* section for more details.
*
* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
*
* @deprecated Moved to the [OpenTelemetry GenAI semantic conventions repository](https://github.com/open-telemetry/semantic-conventions-genai).
*/
const ATTR_GEN_AI_SYSTEM_INSTRUCTIONS = "gen_ai.system_instructions";
/**
* Parameters passed to the tool call.
*
* @example {
* "location": "San Francisco?",
* "date": "2025-10-01"
* }
*
* @note > [!WARNING]
*
* > This attribute may contain sensitive information.
*
* It's expected to be an object - in case a serialized string is available
* to the instrumentation, the instrumentation **SHOULD** do the best effort to
* deserialize it to an object. When recorded on spans, it **MAY** be recorded as a JSON string if structured format is not supported and **SHOULD** be recorded in structured form otherwise.
*
* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
*
* @deprecated Moved to the [OpenTelemetry GenAI semantic conventions repository](https://github.com/open-telemetry/semantic-conventions-genai).
*/
const ATTR_GEN_AI_TOOL_CALL_ARGUMENTS = "gen_ai.tool.call.arguments";
/**
* The tool call identifier.
*
* @example call_mszuSIzqtI65i1wAUOE8w5H4
*
* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
*
* @deprecated Moved to the [OpenTelemetry GenAI semantic conventions repository](https://github.com/open-telemetry/semantic-conventions-genai).
*/
const ATTR_GEN_AI_TOOL_CALL_ID = "gen_ai.tool.call.id";
/**
* The result returned by the tool call (if any and if execution was successful).
*
* @example {
* "temperature_range": {
* "high": 75,
* "low": 60
* },
* "conditions": "sunny"
* }
*
* @note > [!WARNING]
*
* > This attribute may contain sensitive information.
*
* It's expected to be an object - in case a serialized string is available
* to the instrumentation, the instrumentation **SHOULD** do the best effort to
* deserialize it to an object. When recorded on spans, it **MAY** be recorded as a JSON string if structured format is not supported and **SHOULD** be recorded in structured form otherwise.
*
* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
*
* @deprecated Moved to the [OpenTelemetry GenAI semantic conventions repository](https://github.com/open-telemetry/semantic-conventions-genai).
*/
const ATTR_GEN_AI_TOOL_CALL_RESULT = "gen_ai.tool.call.result";
/**
* The list of tool definitions available to the GenAI agent or model.
*
* @example [
* {
* "type": "function",
* "name": "get_current_weather",
* "description": "Get the current weather in a given location",
* "parameters": {
* "type": "object",
* "properties": {
* "location": {
* "type": "string",
* "description": "The city and state, e.g. San Francisco, CA"
* },
* "unit": {
* "type": "string",
* "enum": [
* "celsius",
* "fahrenheit"
* ]
* }
* },
* "required": [
* "location",
* "unit"
* ]
* }
* }
* ]
*
* @note Instrumentations **MUST** follow [Tool Definitions JSON Schema](https://github.com/open-telemetry/semantic-conventions/blob/v1.41.0/docs/gen-ai/gen-ai-tool-definitions.json).
*
* When the attribute is recorded on events, it **MUST** be recorded in structured
* form. When recorded on spans, it **MAY** be recorded as a JSON string if structured
* format is not supported and **SHOULD** be recorded in structured form otherwise.
*
* Since this attribute could be large, it's NOT **RECOMMENDED** to populate
* non-required properties by default. Instrumentations **MAY** provide a way
* to enable populating optional properties.
*
* @experimental This attribute is experimental and is subject to breaking changes in minor releases of `@opentelemetry/semantic-conventions`.
*
* @deprecated Moved to the [OpenTelemetry GenAI semantic conventions repository](https://github.com/open-telemetry/semantic-conventions-genai).
*/
const ATTR_GEN_AI_TOOL_DEFINITIONS = "gen_ai.tool.definitions";
//#endregion
//#region extensions/diagnostics-otel/src/service-genai-attributes.ts
init_esm$2();
function hasOtelSemconvOptIn(value, optIn) {
	return value?.split(",").map((part) => part.trim()).includes(optIn) ?? false;
}
function emitLatestGenAiSemconv() {
	return hasOtelSemconvOptIn(process.env[OTEL_SEMCONV_STABILITY_OPT_IN_ENV], GEN_AI_LATEST_EXPERIMENTAL_OPT_IN);
}
function genAiOperationName(api, observationUnit) {
	if (observationUnit === "turn") return GEN_AI_OPERATION_NAME_VALUE_INVOKE_AGENT;
	const normalized = api?.trim().toLowerCase();
	if (!normalized) return "chat";
	if (normalized === "completions" || normalized.endsWith("-completions")) return "text_completion";
	if (normalized === "generate_content" || normalized.includes("generative-ai")) return "generate_content";
	return "chat";
}
function positiveFiniteNumber(value) {
	return asFiniteNumberInRange(value, {
		min: 0,
		minExclusive: true
	});
}
function nonNegativeFiniteNumber(value) {
	return asFiniteNumberInRange(value, { min: 0 });
}
function assignPositiveNumberAttr(attrs, key, value) {
	const normalized = positiveFiniteNumber(value);
	if (normalized !== void 0) attrs[key] = normalized;
}
function assignModelCallSizeTimingAttrs(attrs, evt) {
	assignPositiveNumberAttr(attrs, "openclaw.model_call.request_bytes", evt.requestPayloadBytes);
	assignPositiveNumberAttr(attrs, "openclaw.model_call.response_bytes", evt.responseStreamBytes);
	assignPositiveNumberAttr(attrs, "openclaw.model_call.time_to_first_byte_ms", evt.timeToFirstByteMs);
}
function assignNumberAttr(attrs, key, value) {
	const normalized = asFiniteNumber(value);
	if (normalized !== void 0) attrs[key] = normalized;
}
function modelCallPromptTokens(usage) {
	const promptTokens = nonNegativeFiniteNumber(usage.promptTokens);
	if (promptTokens !== void 0) return promptTokens;
	const input = nonNegativeFiniteNumber(usage.input);
	const cacheRead = nonNegativeFiniteNumber(usage.cacheRead);
	const cacheWrite = nonNegativeFiniteNumber(usage.cacheWrite);
	if (input === void 0 && cacheRead === void 0 && cacheWrite === void 0) return;
	return (input ?? 0) + (cacheRead ?? 0) + (cacheWrite ?? 0);
}
function assignModelCallPromptStatsAttrs(attrs, evt) {
	const stats = evt.promptStats;
	if (!stats) return;
	for (const [key, value] of [
		["openclaw.model_call.prompt.input_messages_count", stats.inputMessagesCount],
		["openclaw.model_call.prompt.input_messages_chars", stats.inputMessagesChars],
		["openclaw.model_call.prompt.system_prompt_chars", stats.systemPromptChars],
		["openclaw.model_call.prompt.tool_definitions_count", stats.toolDefinitionsCount],
		["openclaw.model_call.prompt.tool_definitions_chars", stats.toolDefinitionsChars],
		["openclaw.model_call.prompt.total_chars", stats.totalChars]
	]) assignNumberAttr(attrs, key, value);
}
function assignModelCallUsageAttrs(attrs, evt) {
	const usage = evt.usage;
	if (!usage) return;
	const promptTokens = modelCallPromptTokens(usage);
	for (const [key, value] of [
		["openclaw.model_call.usage.input_tokens", usage.input],
		["openclaw.model_call.usage.output_tokens", usage.output],
		["openclaw.model_call.usage.cache_read_input_tokens", usage.cacheRead],
		["openclaw.model_call.usage.cache_creation_input_tokens", usage.cacheWrite],
		["openclaw.model_call.usage.reasoning_output_tokens", usage.reasoningTokens],
		["openclaw.model_call.usage.prompt_tokens", promptTokens],
		["openclaw.model_call.usage.total_tokens", usage.total],
		["gen_ai.usage.input_tokens", promptTokens],
		["gen_ai.usage.output_tokens", usage.output],
		["gen_ai.usage.cache_read.input_tokens", usage.cacheRead],
		["gen_ai.usage.cache_creation.input_tokens", usage.cacheWrite]
	]) {
		const normalized = nonNegativeFiniteNumber(value);
		if (normalized !== void 0) attrs[key] = normalized;
	}
}
function assignGenAiSpanIdentityAttrs(attrs, input) {
	if (emitLatestGenAiSemconv()) attrs["gen_ai.provider.name"] = normalizeDiagnosticValue(input.provider);
	else attrs["gen_ai.system"] = normalizeDiagnosticValue(input.provider);
	if (input.model) attrs["gen_ai.request.model"] = redactSensitiveText(input.model.trim());
	attrs["gen_ai.operation.name"] = genAiOperationName(input.api, input.observationUnit);
}
function assignGenAiModelCallAttrs(attrs, evt) {
	assignGenAiSpanIdentityAttrs(attrs, evt);
	attrs["openclaw.model_call.observation_unit"] = modelCallObservationUnit(evt);
}
function modelCallObservationUnit(evt) {
	return evt.observationUnit ?? "request";
}
function modelCallSpanName(evt) {
	if (!emitLatestGenAiSemconv()) return "openclaw.model.call";
	const operationName = genAiOperationName(evt.api, evt.observationUnit);
	return operationName === "invoke_agent" ? operationName : `${operationName} ${normalizeDiagnosticValue(evt.model)}`;
}
function modelCallSpanKind() {
	return SpanKind.CLIENT;
}
function addUpstreamRequestIdSpanEvent(span, upstreamRequestIdHash) {
	if (!upstreamRequestIdHash) return;
	const boundedHash = normalizeDiagnosticValue(upstreamRequestIdHash);
	if (boundedHash === "unknown") return;
	span.addEvent?.("openclaw.provider.request", { "openclaw.upstreamRequestIdHash": boundedHash });
}
//#endregion
//#region extensions/diagnostics-otel/src/service-genai-content.ts
function textPart(content) {
	return {
		type: "text",
		content
	};
}
function textPartContent(part) {
	if (part.type !== "text") return;
	if (typeof part.text === "string") return part.text;
	return typeof part.content === "string" ? part.content : void 0;
}
function toolCallResponseValue(value) {
	if (!Array.isArray(value)) return value;
	const textItems = [];
	for (const item of value) {
		const text = typeof item === "string" ? item : isRecord(item) ? textPartContent(item) : void 0;
		if (typeof text !== "string") return value;
		textItems.push(text);
	}
	const kept = textItems.slice(0, 200);
	const joined = kept.filter((text) => text.length > 0).join("\n");
	if (joined.length === 0) return value;
	const omitted = textItems.length - kept.length;
	return omitted > 0 ? `${joined}\n...(${omitted} more text parts omitted)` : joined;
}
function toolCallResponsePart(part) {
	return {
		type: "tool_call_response",
		...typeof part.id === "string" ? { id: part.id } : {},
		response: toolCallResponseValue(part.response ?? part.result ?? part.content ?? part.details ?? "")
	};
}
function contentParts(value) {
	if (typeof value === "string") return value.length > 0 ? [textPart(value)] : [];
	if (!Array.isArray(value)) {
		if (value === void 0 || value === null) return [];
		if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return [textPart(String(value))];
		const json = safeJsonString(value, MAX_OTEL_CONTENT_ATTRIBUTE_CHARS);
		return json ? [textPart(json)] : [];
	}
	const parts = [];
	for (const part of value) {
		if (typeof part === "string") {
			if (part.length > 0) parts.push(textPart(part));
			continue;
		}
		if (!isRecord(part)) continue;
		const text = textPartContent(part);
		if (text !== void 0) parts.push(textPart(text));
		else if (part.type === "toolCall" && typeof part.name === "string") parts.push({
			type: "tool_call",
			name: part.name,
			...typeof part.id === "string" ? { id: part.id } : {},
			...part.arguments !== void 0 ? { arguments: part.arguments } : {}
		});
		else if (part.type === "tool_call" && typeof part.name === "string") parts.push({
			type: "tool_call",
			name: part.name,
			...typeof part.id === "string" ? { id: part.id } : {},
			...part.arguments !== void 0 ? { arguments: part.arguments } : {}
		});
		else if (part.type === "tool_call_response") parts.push(toolCallResponsePart(part));
		else if (part.type === "image") {
			const data = typeof part.data === "string" ? part.data : void 0;
			parts.push({
				type: "blob",
				modality: "image",
				...typeof part.mimeType === "string" ? { mime_type: part.mimeType } : {},
				...typeof part.mime_type === "string" ? { mime_type: part.mime_type } : {},
				...data ? { content: data } : {}
			});
		}
	}
	return parts;
}
const INTERNAL_REASONING_MESSAGE_FIELDS = [
	"reasoning",
	"reasoning_content",
	"reasoning_details",
	"reasoning_text"
];
const INTERNAL_REASONING_PART_FIELDS = [
	"textSignature",
	"thinkingSignature",
	"thoughtSignature"
];
function redactInternalReasoningParts(value) {
	if (!Array.isArray(value)) return value;
	return value.map((part) => {
		if (isRecord(part) && (part.type === "thinking" || part.type === "redacted_thinking" || part.type === "reasoning")) return {
			type: "reasoning",
			redacted: true
		};
		if (!isRecord(part)) return part;
		const redacted = { ...part };
		for (const field of INTERNAL_REASONING_PART_FIELDS) delete redacted[field];
		return redacted;
	});
}
function redactInternalReasoningFromMessage(value) {
	if (!isRecord(value)) return value;
	const redacted = { ...value };
	for (const field of INTERNAL_REASONING_MESSAGE_FIELDS) delete redacted[field];
	const hasContentParts = Array.isArray(value.content);
	const hasExplicitParts = Array.isArray(value.parts);
	if (hasContentParts) redacted.content = redactInternalReasoningParts(value.content);
	if (hasExplicitParts) redacted.parts = redactInternalReasoningParts(value.parts);
	return redacted;
}
function redactInternalReasoningFromMessages(value) {
	return Array.isArray(value) ? value.map((message) => redactInternalReasoningFromMessage(message)) : redactInternalReasoningFromMessage(value);
}
function normalizeGenAiMessage(value, fallbackRole = "user") {
	if (typeof value === "string") return {
		role: fallbackRole,
		parts: [textPart(value)]
	};
	if (!isRecord(value)) return;
	const rawRole = typeof value.role === "string" ? value.role : fallbackRole;
	const role = rawRole === "toolResult" ? "tool" : rawRole;
	let parts;
	if (role === "tool") {
		const explicitParts = contentParts(value.parts);
		parts = explicitParts.length > 0 ? explicitParts : [toolCallResponsePart({
			id: value.toolCallId,
			response: value.content ?? value.details ?? ""
		})];
	} else parts = contentParts(value.parts ?? value.content);
	if (parts.length === 0) return;
	return {
		role,
		parts,
		...typeof value.name === "string" ? { name: value.name } : {},
		...typeof value.finish_reason === "string" ? { finish_reason: value.finish_reason } : {},
		...typeof value.stopReason === "string" ? { finish_reason: value.stopReason } : {}
	};
}
function normalizeGenAiMessages(value, fallbackRole) {
	const source = Array.isArray(value) ? value : value === void 0 ? [] : [value];
	const messages = [];
	for (const item of source.slice(0, 200)) {
		const message = normalizeGenAiMessage(item, fallbackRole);
		if (message) messages.push(message);
	}
	return messages;
}
function normalizeGenAiToolDefinition(value) {
	if (!isRecord(value) || typeof value.name !== "string" || value.name.trim().length === 0) return;
	return {
		type: typeof value.type === "string" ? value.type : "function",
		name: value.name,
		...typeof value.description === "string" ? { description: value.description } : {},
		...value.parameters !== void 0 ? { parameters: value.parameters } : {}
	};
}
function normalizeGenAiToolDefinitions(value) {
	if (!Array.isArray(value)) return [];
	const definitions = [];
	for (const item of value.slice(0, 200)) {
		const definition = normalizeGenAiToolDefinition(item);
		if (definition) definitions.push(definition);
	}
	return definitions;
}
function assignJsonAttribute(attributes, key, value) {
	const json = safeJsonString(value, MAX_OTEL_CONTENT_ATTRIBUTE_CHARS);
	if (json) attributes[key] = json;
}
function assignGenAiModelContentAttributes(attributes, content, policy) {
	if (policy.systemPrompt && typeof content?.systemPrompt === "string") assignJsonAttribute(attributes, ATTR_GEN_AI_SYSTEM_INSTRUCTIONS, [textPart(content.systemPrompt)]);
	if (policy.inputMessages) {
		const inputMessages = normalizeGenAiMessages(content?.inputMessages, "user");
		if (inputMessages.length > 0) {
			assignJsonAttribute(attributes, ATTR_GEN_AI_INPUT_MESSAGES, inputMessages);
			assignJsonAttribute(attributes, "input.value", inputMessages);
			attributes["input.mime_type"] = "application/json";
		}
	}
	if (policy.toolDefinitions) {
		const toolDefinitions = normalizeGenAiToolDefinitions(content?.toolDefinitions);
		if (toolDefinitions.length > 0) assignJsonAttribute(attributes, ATTR_GEN_AI_TOOL_DEFINITIONS, toolDefinitions);
	}
	if (policy.outputMessages) {
		const outputMessages = normalizeGenAiMessages(content?.outputMessages, "assistant");
		if (outputMessages.length > 0) {
			assignJsonAttribute(attributes, ATTR_GEN_AI_OUTPUT_MESSAGES, outputMessages);
			assignJsonAttribute(attributes, "output.value", outputMessages);
			attributes["output.mime_type"] = "application/json";
		}
	}
}
function assignOtelContentAttribute(attributes, key, value) {
	const normalized = normalizeOtelContentValue(value);
	if (normalized) attributes[key] = normalized;
}
function assignOtelToolIdentityAttributes(attributes, evt) {
	attributes["gen_ai.operation.name"] = GEN_AI_OPERATION_NAME_VALUE_EXECUTE_TOOL;
	const toolCallId = evt.toolCallId?.trim();
	if (toolCallId) attributes[ATTR_GEN_AI_TOOL_CALL_ID] = toolCallId;
}
function assignOtelModelContentAttributes(attributes, content, policy) {
	const redactedContent = content ? {
		...content,
		inputMessages: redactInternalReasoningFromMessages(content.inputMessages),
		outputMessages: redactInternalReasoningFromMessages(content.outputMessages)
	} : void 0;
	assignGenAiModelContentAttributes(attributes, redactedContent, policy);
	if (policy.inputMessages) assignOtelContentAttribute(attributes, "openclaw.content.input_messages", redactedContent?.inputMessages);
	if (policy.toolDefinitions) assignOtelContentAttribute(attributes, "openclaw.content.tool_definitions", content?.toolDefinitions);
	if (policy.outputMessages) assignOtelContentAttribute(attributes, "openclaw.content.output_messages", redactedContent?.outputMessages);
	if (policy.systemPrompt) assignOtelContentAttribute(attributes, "openclaw.content.system_prompt", content?.systemPrompt);
}
function assignOtelToolContentAttributes(attributes, content, policy) {
	if (policy.toolInputs) {
		const toolInput = normalizeOtelContentValue(content?.toolInput);
		if (toolInput) {
			attributes[ATTR_GEN_AI_TOOL_CALL_ARGUMENTS] = toolInput;
			attributes["openclaw.content.tool_input"] = toolInput;
		}
	}
	if (policy.toolOutputs) {
		const toolOutput = normalizeOtelContentValue(content?.toolOutput);
		if (toolOutput) {
			attributes[ATTR_GEN_AI_TOOL_CALL_RESULT] = toolOutput;
			attributes["openclaw.content.tool_output"] = toolOutput;
		}
	}
}
//#endregion
//#region extensions/diagnostics-otel/src/service-recorders-model.ts
init_esm$2();
function createModelRecorders(runtime) {
	const { genAiOperationDurationHistogram, modelCallDurationHistogram, modelCallRequestBytesHistogram, modelCallResponseBytesHistogram, modelCallTimeToFirstByteHistogram, spanWithDuration, activeTrustedParentContext, trackTrustedSpan, getTrackedInternalOrTrustedSpan, takeTrackedTrustedSpan, setSpanAttrs, contentCapturePolicy, tracesEnabled } = runtime;
	const modelCallMetricAttrs = (evt) => ({
		"openclaw.provider": evt.provider,
		"openclaw.model": evt.model,
		"openclaw.api": normalizeDiagnosticValue(evt.api),
		"openclaw.transport": normalizeDiagnosticValue(evt.transport),
		"openclaw.model_call.observation_unit": modelCallObservationUnit(evt)
	});
	const genAiModelCallMetricAttrs = (evt, errorType) => ({
		"gen_ai.operation.name": genAiOperationName(evt.api, evt.observationUnit),
		"gen_ai.provider.name": normalizeDiagnosticValue(evt.provider),
		"gen_ai.request.model": normalizeDiagnosticValue(evt.model),
		...errorType ? { "error.type": errorType } : {}
	});
	const recordGenAiModelCallDuration = (evt, errorType) => {
		genAiOperationDurationHistogram.record(evt.durationMs / 1e3, genAiModelCallMetricAttrs(evt, errorType));
	};
	const recordModelCallSizeTimingMetrics = (evt, attrs) => {
		const requestPayloadBytes = positiveFiniteNumber(evt.requestPayloadBytes);
		if (requestPayloadBytes !== void 0) modelCallRequestBytesHistogram.record(requestPayloadBytes, attrs);
		const responseStreamBytes = positiveFiniteNumber(evt.responseStreamBytes);
		if (responseStreamBytes !== void 0) modelCallResponseBytesHistogram.record(responseStreamBytes, attrs);
		const timeToFirstByteMs = positiveFiniteNumber(evt.timeToFirstByteMs);
		if (timeToFirstByteMs !== void 0) modelCallTimeToFirstByteHistogram.record(timeToFirstByteMs, attrs);
	};
	const recordModelCallStarted = (evt, metadata) => {
		if (!tracesEnabled || !metadata.trusted) return;
		const trackedSpan = getTrackedInternalOrTrustedSpan(evt, metadata);
		if (trackedSpan) return trackedSpan.spanContext();
		const spanAttrs = {
			"openclaw.provider": evt.provider,
			"openclaw.model": evt.model
		};
		assignGenAiModelCallAttrs(spanAttrs, evt);
		if (evt.api) spanAttrs["openclaw.api"] = evt.api;
		if (evt.transport) spanAttrs["openclaw.transport"] = evt.transport;
		assignModelCallPromptStatsAttrs(spanAttrs, evt);
		return trackTrustedSpan(evt, metadata, spanWithDuration(modelCallSpanName(evt), spanAttrs, void 0, {
			kind: modelCallSpanKind(),
			parentContext: activeTrustedParentContext(evt, metadata),
			startTimeMs: evt.ts
		})).spanContext();
	};
	const recordModelCallCompleted = (evt, metadata, modelContent) => {
		const metricAttrs = modelCallMetricAttrs(evt);
		modelCallDurationHistogram.record(evt.durationMs, metricAttrs);
		recordModelCallSizeTimingMetrics(evt, metricAttrs);
		recordGenAiModelCallDuration(evt);
		if (!tracesEnabled) return;
		const spanAttrs = {
			"openclaw.provider": evt.provider,
			"openclaw.model": evt.model
		};
		assignGenAiModelCallAttrs(spanAttrs, evt);
		if (evt.api) spanAttrs["openclaw.api"] = evt.api;
		if (evt.transport) spanAttrs["openclaw.transport"] = evt.transport;
		assignModelCallSizeTimingAttrs(spanAttrs, evt);
		assignModelCallPromptStatsAttrs(spanAttrs, evt);
		assignModelCallUsageAttrs(spanAttrs, evt);
		assignOtelModelContentAttributes(spanAttrs, modelContent, contentCapturePolicy);
		const span = takeTrackedTrustedSpan(evt, metadata) ?? spanWithDuration(modelCallSpanName(evt), spanAttrs, evt.durationMs, {
			kind: modelCallSpanKind(),
			parentContext: activeTrustedParentContext(evt, metadata),
			endTimeMs: evt.ts
		});
		setSpanAttrs(span, spanAttrs);
		addUpstreamRequestIdSpanEvent(span, evt.upstreamRequestIdHash);
		span.end(evt.ts);
	};
	const recordModelCallError = (evt, metadata, modelContent) => {
		const errorType = normalizeDiagnosticValue(evt.errorCategory, "other");
		const metricAttrs = {
			...modelCallMetricAttrs(evt),
			"openclaw.errorCategory": errorType,
			...evt.failureKind ? { "openclaw.failureKind": normalizeDiagnosticValue(evt.failureKind, "other") } : {}
		};
		modelCallDurationHistogram.record(evt.durationMs, metricAttrs);
		recordModelCallSizeTimingMetrics(evt, metricAttrs);
		recordGenAiModelCallDuration(evt, errorType);
		if (!tracesEnabled) return;
		const spanAttrs = {
			"openclaw.provider": evt.provider,
			"openclaw.model": evt.model,
			"openclaw.errorCategory": errorType,
			"error.type": errorType
		};
		if (evt.failureKind) spanAttrs["openclaw.failureKind"] = normalizeDiagnosticValue(evt.failureKind, "other");
		assignGenAiModelCallAttrs(spanAttrs, evt);
		if (evt.api) spanAttrs["openclaw.api"] = evt.api;
		if (evt.transport) spanAttrs["openclaw.transport"] = evt.transport;
		assignModelCallSizeTimingAttrs(spanAttrs, evt);
		assignModelCallPromptStatsAttrs(spanAttrs, evt);
		assignModelCallUsageAttrs(spanAttrs, evt);
		assignOtelModelContentAttributes(spanAttrs, modelContent, contentCapturePolicy);
		const span = takeTrackedTrustedSpan(evt, metadata) ?? spanWithDuration(modelCallSpanName(evt), spanAttrs, evt.durationMs, {
			kind: modelCallSpanKind(),
			parentContext: activeTrustedParentContext(evt, metadata),
			endTimeMs: evt.ts
		});
		setSpanAttrs(span, spanAttrs);
		addUpstreamRequestIdSpanEvent(span, evt.upstreamRequestIdHash);
		span.setStatus({
			code: SpanStatusCode.ERROR,
			message: redactSensitiveText(evt.errorCategory)
		});
		span.end(evt.ts);
	};
	return {
		recordModelCallSizeTimingMetrics,
		recordModelCallStarted,
		recordModelCallCompleted,
		recordModelCallError
	};
}
//#endregion
//#region extensions/diagnostics-otel/src/service-recorders-operations.ts
init_esm$2();
function createOperationsRecorders(runtime) {
	const { durationHistogram, queueDepthHistogram, queueWaitHistogram, laneEnqueueCounter, laneDequeueCounter, sessionStateCounter, sessionTurnCreatedCounter, sessionStuckCounter, sessionStuckAgeHistogram, sessionRecoveryRequestedCounter, sessionRecoveryCompletedCounter, sessionRecoveryAgeHistogram, talkEventCounter, talkEventDurationHistogram, talkAudioBytesHistogram, runAttemptCounter, toolLoopCounter, memoryRssHistogram, memoryHeapUsedHistogram, memoryHeapTotalHistogram, memoryExternalHistogram, memoryArrayBuffersHistogram, memoryPressureCounter, asyncQueueDroppedCounter, tracer, activeTrustedSpans, spanWithDuration, trustedTraceContext, activeTrustedParentContext, setSpanAttrs, completeTrackedLifecycleSpan, addRunAttrs, tracesEnabled } = runtime;
	const recordLaneEnqueue = (evt) => {
		const attrs = { "openclaw.lane": normalizeDiagnosticLane(evt.lane) };
		laneEnqueueCounter.add(1, attrs);
		queueDepthHistogram.record(evt.queueSize, attrs);
	};
	const recordLaneDequeue = (evt) => {
		const attrs = { "openclaw.lane": normalizeDiagnosticLane(evt.lane) };
		laneDequeueCounter.add(1, attrs);
		queueDepthHistogram.record(evt.queueSize, attrs);
		if (typeof evt.waitMs === "number") queueWaitHistogram.record(evt.waitMs, attrs);
	};
	const recordSessionState = (evt) => {
		const attrs = { "openclaw.state": evt.state };
		if (evt.reason) attrs["openclaw.reason"] = redactSensitiveText(evt.reason);
		sessionStateCounter.add(1, attrs);
	};
	const recordSessionTurnCreated = (evt) => {
		sessionTurnCreatedCounter.add(1, {
			"openclaw.agent": normalizeDiagnosticValue(evt.agentId, "unknown"),
			"openclaw.channel": normalizeDiagnosticValue(evt.channel, "unknown"),
			"openclaw.trigger": evt.trigger
		});
	};
	const recordSessionStuck = (evt) => {
		const attrs = { "openclaw.state": evt.state };
		sessionStuckCounter.add(1, attrs);
		if (typeof evt.ageMs === "number") sessionStuckAgeHistogram.record(evt.ageMs, attrs);
		if (!tracesEnabled) return;
		const spanAttrs = { ...attrs };
		spanAttrs["openclaw.queueDepth"] = evt.queueDepth ?? 0;
		spanAttrs["openclaw.ageMs"] = evt.ageMs;
		const span = tracer.startSpan("openclaw.session.stuck", { attributes: spanAttrs });
		span.setStatus({
			code: SpanStatusCode.ERROR,
			message: "session stuck"
		});
		span.end();
	};
	const sessionRecoveryAttrs = (evt) => {
		const attrs = { "openclaw.state": evt.state };
		if (evt.reason) attrs["openclaw.reason"] = redactSensitiveText(evt.reason);
		if (evt.activeWorkKind) attrs["openclaw.active_work_kind"] = evt.activeWorkKind;
		return attrs;
	};
	const recordSessionRecoveryRequested = (evt) => {
		const attrs = sessionRecoveryAttrs(evt);
		attrs["openclaw.action"] = evt.allowActiveAbort ? "abort" : "recover";
		sessionRecoveryRequestedCounter.add(1, attrs);
		sessionRecoveryAgeHistogram.record(evt.ageMs, attrs);
	};
	const recordSessionRecoveryCompleted = (evt) => {
		const attrs = sessionRecoveryAttrs(evt);
		attrs["openclaw.status"] = evt.status;
		attrs["openclaw.action"] = normalizeDiagnosticValue(evt.action, "unknown");
		if (evt.outcomeReason) attrs["openclaw.reason"] = redactSensitiveText(evt.outcomeReason);
		sessionRecoveryCompletedCounter.add(1, attrs);
		sessionRecoveryAgeHistogram.record(evt.ageMs, attrs);
	};
	const talkEventAttrs = (evt) => ({
		"openclaw.talk.brain": normalizeDiagnosticValue(evt.brain),
		"openclaw.talk.event_type": normalizeDiagnosticValue(evt.talkEventType),
		"openclaw.talk.mode": normalizeDiagnosticValue(evt.mode),
		"openclaw.talk.provider": normalizeDiagnosticValue(evt.provider),
		"openclaw.talk.transport": normalizeDiagnosticValue(evt.transport)
	});
	const recordTalkEvent = (evt, metadata) => {
		if (!metadata.trusted) return;
		const attrs = talkEventAttrs(evt);
		talkEventCounter.add(1, attrs);
		if (typeof evt.durationMs === "number") talkEventDurationHistogram.record(evt.durationMs, attrs);
		if (typeof evt.byteLength === "number") talkAudioBytesHistogram.record(evt.byteLength, attrs);
	};
	const recordRunAttempt = (evt) => {
		runAttemptCounter.add(1, { "openclaw.attempt": evt.attempt });
	};
	const toolLoopAttrs = (evt) => ({
		"openclaw.toolName": normalizeDiagnosticValue(evt.toolName, "tool"),
		"openclaw.loop.level": evt.level,
		"openclaw.loop.action": evt.action,
		"openclaw.loop.detector": evt.detector,
		"openclaw.loop.count": evt.count,
		...evt.pairedToolName ? { "openclaw.loop.paired_tool": normalizeDiagnosticValue(evt.pairedToolName, "tool") } : {}
	});
	const recordToolLoop = (evt) => {
		const attrs = toolLoopAttrs(evt);
		toolLoopCounter.add(1, attrs);
		if (!tracesEnabled) return;
		const span = spanWithDuration("openclaw.tool.loop", attrs, 0, { endTimeMs: evt.ts });
		if (evt.level === "critical" || evt.action === "block") span.setStatus({
			code: SpanStatusCode.ERROR,
			message: `${evt.detector}:${evt.action}`
		});
		span.end(evt.ts);
	};
	const recordMemoryUsageMetrics = (evt, attrs = {}) => {
		memoryRssHistogram.record(evt.memory.rssBytes, attrs);
		memoryHeapUsedHistogram.record(evt.memory.heapUsedBytes, attrs);
		memoryHeapTotalHistogram.record(evt.memory.heapTotalBytes, attrs);
		memoryExternalHistogram.record(evt.memory.externalBytes, attrs);
		memoryArrayBuffersHistogram.record(evt.memory.arrayBuffersBytes, attrs);
	};
	const recordMemorySample = (evt) => {
		recordMemoryUsageMetrics(evt);
	};
	const recordMemoryPressure = (evt) => {
		const attrs = {
			"openclaw.memory.level": evt.level,
			"openclaw.memory.reason": evt.reason
		};
		memoryPressureCounter.add(1, attrs);
		recordMemoryUsageMetrics(evt, attrs);
		if (!tracesEnabled) return;
		const spanAttrs = {
			...attrs,
			"openclaw.memory.rss_bytes": evt.memory.rssBytes,
			"openclaw.memory.heap_used_bytes": evt.memory.heapUsedBytes,
			"openclaw.memory.heap_total_bytes": evt.memory.heapTotalBytes,
			"openclaw.memory.external_bytes": evt.memory.externalBytes,
			"openclaw.memory.array_buffers_bytes": evt.memory.arrayBuffersBytes,
			...evt.thresholdBytes !== void 0 ? { "openclaw.memory.threshold_bytes": evt.thresholdBytes } : {},
			...evt.rssGrowthBytes !== void 0 ? { "openclaw.memory.rss_growth_bytes": evt.rssGrowthBytes } : {},
			...evt.windowMs !== void 0 ? { "openclaw.memory.window_ms": evt.windowMs } : {}
		};
		const span = spanWithDuration("openclaw.memory.pressure", spanAttrs, 0, { endTimeMs: evt.ts });
		if (evt.level === "critical") span.setStatus({
			code: SpanStatusCode.ERROR,
			message: evt.reason
		});
		span.end(evt.ts);
	};
	const recordAsyncQueueDropped = (evt) => {
		asyncQueueDroppedCounter.add(evt.droppedEvents, { "openclaw.diagnostic.async_queue.drop_class": "total" });
		if (evt.droppedTrustedEvents !== void 0) asyncQueueDroppedCounter.add(evt.droppedTrustedEvents, { "openclaw.diagnostic.async_queue.drop_class": "trusted" });
		if (evt.droppedUntrustedEvents !== void 0) asyncQueueDroppedCounter.add(evt.droppedUntrustedEvents, { "openclaw.diagnostic.async_queue.drop_class": "untrusted" });
		if (evt.droppedPriorityEvents !== void 0) asyncQueueDroppedCounter.add(evt.droppedPriorityEvents, { "openclaw.diagnostic.async_queue.drop_class": "priority" });
	};
	const recordRunCompleted = (evt, metadata, privateData) => {
		const attrs = {
			"openclaw.outcome": evt.outcome,
			"openclaw.provider": evt.provider ?? "unknown",
			"openclaw.model": evt.model ?? "unknown"
		};
		if (evt.channel) attrs["openclaw.channel"] = evt.channel;
		if (evt.blockedBy) attrs["openclaw.blocked_by"] = normalizeDiagnosticValue(evt.blockedBy, "unknown");
		durationHistogram.record(evt.durationMs, attrs);
		if (!tracesEnabled) return;
		const spanAttrs = { "openclaw.outcome": evt.outcome };
		addRunAttrs(spanAttrs, evt);
		if (evt.blockedBy) spanAttrs["openclaw.blocked_by"] = normalizeDiagnosticValue(evt.blockedBy, "unknown");
		if (evt.errorCategory) spanAttrs["openclaw.errorCategory"] = normalizeDiagnosticValue(evt.errorCategory, "other");
		const redactedError = normalizeOtelErrorMessage(privateData.errorMessage);
		if (redactedError) spanAttrs["openclaw.error"] = redactedError;
		const trustedTrace = trustedTraceContext(evt, metadata);
		const trackedSpan = trustedTrace?.spanId ? activeTrustedSpans.get(trustedTrace.spanId) : void 0;
		const span = trackedSpan ?? spanWithDuration("openclaw.run", spanAttrs, evt.durationMs, {
			parentContext: activeTrustedParentContext(evt, metadata),
			endTimeMs: evt.ts
		});
		setSpanAttrs(span, spanAttrs);
		if (evt.outcome === "error") {
			const message = redactedError ?? (evt.errorCategory ? redactSensitiveText(evt.errorCategory) : void 0);
			span.setStatus({
				code: SpanStatusCode.ERROR,
				...message ? { message } : {}
			});
		}
		if (trackedSpan && trustedTrace?.spanId) {
			completeTrackedLifecycleSpan(trustedTrace, trackedSpan, evt.ts);
			return;
		}
		span.end(evt.ts);
	};
	return {
		recordLaneEnqueue,
		recordLaneDequeue,
		recordSessionState,
		recordSessionTurnCreated,
		recordSessionStuck,
		recordSessionRecoveryRequested,
		recordSessionRecoveryCompleted,
		recordTalkEvent,
		recordRunAttempt,
		recordToolLoop,
		recordMemoryUsageMetrics,
		recordMemorySample,
		recordMemoryPressure,
		recordAsyncQueueDropped,
		recordRunCompleted
	};
}
//#endregion
//#region extensions/diagnostics-otel/src/service-recorders-tools.ts
init_esm$2();
function createToolAndSystemRecorders(runtime) {
	const { queueDepthHistogram, skillUsedCounter, toolExecutionDurationHistogram, toolExecutionBlockedCounter, execProcessDurationHistogram, payloadLargeCounter, payloadLargeBytesHistogram, livenessWarningCounter, livenessEventLoopDelayP99Histogram, livenessEventLoopDelayMaxHistogram, livenessEventLoopUtilizationHistogram, livenessCpuCoreRatioHistogram, telemetryExporterCounter, spanWithDuration, activeTrustedParentContext, exportedInternalOrTrustedContext, trackTrustedSpan, getTrackedInternalOrTrustedSpan, takeTrackedTrustedSpan, setSpanAttrs, addRunAttrs, paramsSummaryAttrs, contentCapturePolicy, tracesEnabled } = runtime;
	const toolExecutionBaseAttrs = (evt) => ({
		"openclaw.toolName": evt.toolName,
		"openclaw.tool.source": normalizeDiagnosticValue(evt.toolSource, "core"),
		"gen_ai.tool.name": evt.toolName,
		...evt.toolOwner ? { "openclaw.tool.owner": normalizeDiagnosticValue(evt.toolOwner) } : {},
		...paramsSummaryAttrs(evt.paramsSummary)
	});
	const toolTimestampMs = (evt) => evt.sourceTimestampMs ?? evt.ts;
	const skillUsedAttrs = (evt) => ({
		"openclaw.skill.name": normalizeDiagnosticValue(evt.skillName, "skill"),
		"openclaw.skill.source": normalizeDiagnosticValue(evt.skillSource),
		"openclaw.skill.activation": normalizeDiagnosticValue(evt.activation),
		...evt.agentId ? { "openclaw.agent": normalizeDiagnosticValue(evt.agentId) } : {},
		...evt.toolName ? { "openclaw.toolName": normalizeDiagnosticValue(evt.toolName, "tool") } : {}
	});
	const recordSkillUsed = (evt, metadata) => {
		if (!metadata.trusted) return;
		const attrs = skillUsedAttrs(evt);
		skillUsedCounter.add(1, attrs);
		if (!tracesEnabled) return;
		const spanAttrs = { ...attrs };
		addRunAttrs(spanAttrs, evt);
		const span = spanWithDuration("openclaw.skill.used", spanAttrs, 0, {
			parentContext: activeTrustedParentContext(evt, metadata),
			endTimeMs: evt.ts
		});
		setSpanAttrs(span, spanAttrs);
		span.end(evt.ts);
	};
	const recordToolExecutionStarted = (evt, metadata) => {
		if (!tracesEnabled || !metadata.trusted) return;
		const trackedSpan = getTrackedInternalOrTrustedSpan(evt, metadata);
		if (trackedSpan) return trackedSpan.spanContext();
		const spanAttrs = toolExecutionBaseAttrs(evt);
		assignOtelToolIdentityAttributes(spanAttrs, evt);
		return trackTrustedSpan(evt, metadata, spanWithDuration("openclaw.tool.execution", spanAttrs, void 0, {
			parentContext: activeTrustedParentContext(evt, metadata),
			startTimeMs: toolTimestampMs(evt)
		})).spanContext();
	};
	const recordToolExecutionCompleted = (evt, metadata, toolContent) => {
		const attrs = toolExecutionBaseAttrs(evt);
		toolExecutionDurationHistogram.record(evt.durationMs, attrs);
		if (!tracesEnabled) return;
		const spanAttrs = { ...attrs };
		addRunAttrs(spanAttrs, evt);
		assignOtelToolIdentityAttributes(spanAttrs, evt);
		assignOtelToolContentAttributes(spanAttrs, toolContent, contentCapturePolicy);
		const span = takeTrackedTrustedSpan(evt, metadata) ?? spanWithDuration("openclaw.tool.execution", spanAttrs, evt.durationMs, {
			parentContext: activeTrustedParentContext(evt, metadata),
			endTimeMs: toolTimestampMs(evt)
		});
		setSpanAttrs(span, spanAttrs);
		span.end(toolTimestampMs(evt));
	};
	const recordToolExecutionError = (evt, metadata, toolContent) => {
		const attrs = {
			...toolExecutionBaseAttrs(evt),
			"openclaw.errorCategory": normalizeDiagnosticValue(evt.errorCategory, "other")
		};
		toolExecutionDurationHistogram.record(evt.durationMs, attrs);
		if (!tracesEnabled) return;
		const spanAttrs = { ...attrs };
		addRunAttrs(spanAttrs, evt);
		assignOtelToolIdentityAttributes(spanAttrs, evt);
		if (evt.errorCode) spanAttrs["openclaw.errorCode"] = normalizeDiagnosticValue(evt.errorCode, "other");
		assignOtelToolContentAttributes(spanAttrs, toolContent, contentCapturePolicy);
		const span = takeTrackedTrustedSpan(evt, metadata) ?? spanWithDuration("openclaw.tool.execution", spanAttrs, evt.durationMs, {
			parentContext: activeTrustedParentContext(evt, metadata),
			endTimeMs: toolTimestampMs(evt)
		});
		setSpanAttrs(span, spanAttrs);
		span.setStatus({
			code: SpanStatusCode.ERROR,
			message: redactSensitiveText(evt.errorCategory)
		});
		span.end(toolTimestampMs(evt));
	};
	const recordToolExecutionBlocked = (evt, metadata) => {
		toolExecutionBlockedCounter.add(1, {
			...toolExecutionBaseAttrs(evt),
			"openclaw.deniedReason": normalizeDiagnosticValue(evt.deniedReason, "other")
		});
		if (!tracesEnabled) return;
		const spanAttrs = {
			...toolExecutionBaseAttrs(evt),
			"openclaw.outcome": "blocked",
			"openclaw.deniedReason": normalizeDiagnosticValue(evt.deniedReason, "other")
		};
		addRunAttrs(spanAttrs, evt);
		assignOtelToolIdentityAttributes(spanAttrs, evt);
		const span = takeTrackedTrustedSpan(evt, metadata) ?? spanWithDuration("openclaw.tool.execution", spanAttrs, 0, {
			parentContext: activeTrustedParentContext(evt, metadata),
			endTimeMs: toolTimestampMs(evt)
		});
		setSpanAttrs(span, spanAttrs);
		span.end(toolTimestampMs(evt));
	};
	const recordPayloadLarge = (evt) => {
		const attrs = {
			"openclaw.payload.action": evt.action,
			"openclaw.payload.surface": normalizeDiagnosticValue(evt.surface, "unknown"),
			"openclaw.channel": normalizeDiagnosticValue(evt.channel, "none"),
			"openclaw.plugin": normalizeDiagnosticValue(evt.pluginId, "none"),
			"openclaw.reason": normalizeDiagnosticValue(evt.reason, "none")
		};
		payloadLargeCounter.add(1, attrs);
		const bytes = positiveFiniteNumber(evt.bytes);
		if (bytes !== void 0) payloadLargeBytesHistogram.record(bytes, attrs);
	};
	const recordExecProcessCompleted = (evt, metadata) => {
		const attrs = {
			"openclaw.exec.target": evt.target,
			"openclaw.exec.mode": evt.mode,
			"openclaw.outcome": evt.outcome
		};
		if (evt.failureKind) attrs["openclaw.failureKind"] = evt.failureKind;
		execProcessDurationHistogram.record(evt.durationMs, attrs);
		if (!tracesEnabled) return;
		const spanAttrs = {
			...attrs,
			"openclaw.exec.command_length": evt.commandLength
		};
		if (typeof evt.exitCode === "number") spanAttrs["openclaw.exec.exit_code"] = evt.exitCode;
		if (evt.exitSignal) spanAttrs["openclaw.exec.exit_signal"] = normalizeDiagnosticValue(evt.exitSignal, "other");
		if (evt.timedOut !== void 0) spanAttrs["openclaw.exec.timed_out"] = evt.timedOut;
		const span = spanWithDuration("openclaw.exec", spanAttrs, evt.durationMs, {
			parentContext: exportedInternalOrTrustedContext(evt, metadata),
			endTimeMs: evt.ts
		});
		if (evt.outcome === "failed") span.setStatus({
			code: SpanStatusCode.ERROR,
			...evt.failureKind ? { message: evt.failureKind } : {}
		});
		span.end(evt.ts);
	};
	const recordHeartbeat = (evt) => {
		queueDepthHistogram.record(evt.queued, { "openclaw.channel": "heartbeat" });
	};
	const recordLivenessWarning = (evt) => {
		const reason = evt.reasons.join(":");
		const attrs = { "openclaw.liveness.reason": normalizeDiagnosticValue(reason, "unknown") };
		livenessWarningCounter.add(1, attrs);
		queueDepthHistogram.record(evt.queued, { "openclaw.channel": "liveness" });
		if (evt.eventLoopDelayP99Ms !== void 0) livenessEventLoopDelayP99Histogram.record(evt.eventLoopDelayP99Ms, attrs);
		if (evt.eventLoopDelayMaxMs !== void 0) livenessEventLoopDelayMaxHistogram.record(evt.eventLoopDelayMaxMs, attrs);
		if (evt.eventLoopUtilization !== void 0) livenessEventLoopUtilizationHistogram.record(evt.eventLoopUtilization, attrs);
		if (evt.cpuCoreRatio !== void 0) livenessCpuCoreRatioHistogram.record(evt.cpuCoreRatio, attrs);
		if (!tracesEnabled) return;
		const spanAttrs = {
			...attrs,
			"openclaw.liveness.active": evt.active,
			"openclaw.liveness.waiting": evt.waiting,
			"openclaw.liveness.queued": evt.queued,
			"openclaw.liveness.interval_ms": evt.intervalMs,
			...evt.eventLoopDelayP99Ms !== void 0 ? { "openclaw.liveness.event_loop_delay_p99_ms": evt.eventLoopDelayP99Ms } : {},
			...evt.eventLoopDelayMaxMs !== void 0 ? { "openclaw.liveness.event_loop_delay_max_ms": evt.eventLoopDelayMaxMs } : {},
			...evt.eventLoopUtilization !== void 0 ? { "openclaw.liveness.event_loop_utilization": evt.eventLoopUtilization } : {},
			...evt.cpuUserMs !== void 0 ? { "openclaw.liveness.cpu_user_ms": evt.cpuUserMs } : {},
			...evt.cpuSystemMs !== void 0 ? { "openclaw.liveness.cpu_system_ms": evt.cpuSystemMs } : {},
			...evt.cpuTotalMs !== void 0 ? { "openclaw.liveness.cpu_total_ms": evt.cpuTotalMs } : {},
			...evt.cpuCoreRatio !== void 0 ? { "openclaw.liveness.cpu_core_ratio": evt.cpuCoreRatio } : {}
		};
		const span = spanWithDuration("openclaw.liveness.warning", spanAttrs, 0, { endTimeMs: evt.ts });
		span.setStatus({
			code: SpanStatusCode.ERROR,
			message: reason
		});
		span.end(evt.ts);
	};
	const recordDiagnosticPhaseCompleted = (evt) => {
		if (!tracesEnabled) return;
		const spanAttrs = {
			"openclaw.phase": normalizeDiagnosticValue(evt.name, "unknown"),
			...evt.cpuUserMs !== void 0 ? { "openclaw.phase.cpu_user_ms": evt.cpuUserMs } : {},
			...evt.cpuSystemMs !== void 0 ? { "openclaw.phase.cpu_system_ms": evt.cpuSystemMs } : {},
			...evt.cpuTotalMs !== void 0 ? { "openclaw.phase.cpu_total_ms": evt.cpuTotalMs } : {},
			...evt.cpuCoreRatio !== void 0 ? { "openclaw.phase.cpu_core_ratio": evt.cpuCoreRatio } : {}
		};
		for (const [key, value] of Object.entries(evt.details ?? {})) spanAttrs[`openclaw.phase.detail.${key}`] = typeof value === "boolean" ? String(value) : value;
		spanWithDuration("openclaw.diagnostic.phase", spanAttrs, evt.durationMs, { endTimeMs: evt.ts }).end(evt.ts);
	};
	const recordTelemetryExporter = (evt, metadata) => {
		if (!metadata.trusted) return;
		telemetryExporterCounter.add(1, {
			"openclaw.exporter": normalizeDiagnosticValue(evt.exporter, "unknown"),
			"openclaw.signal": evt.signal,
			"openclaw.status": evt.status,
			...evt.reason ? { "openclaw.reason": evt.reason } : {},
			...evt.errorCategory ? { "openclaw.errorCategory": normalizeDiagnosticValue(evt.errorCategory, "other") } : {}
		});
	};
	return {
		recordSkillUsed,
		recordToolExecutionStarted,
		recordToolExecutionCompleted,
		recordToolExecutionError,
		recordToolExecutionBlocked,
		recordPayloadLarge,
		recordExecProcessCompleted,
		recordHeartbeat,
		recordLivenessWarning,
		recordDiagnosticPhaseCompleted,
		recordTelemetryExporter
	};
}
//#endregion
//#region extensions/diagnostics-otel/src/service-recorders-usage.ts
init_esm$2();
function createUsageRecorders(runtime) {
	const { tokensCounter, genAiTokenUsageHistogram, costCounter, durationHistogram, contextHistogram, webhookReceivedCounter, webhookErrorCounter, webhookDurationHistogram, messageQueuedCounter, messageReceivedCounter, messageDispatchStartedCounter, messageDispatchCompletedCounter, messageDispatchDurationHistogram, messageProcessedCounter, messageDurationHistogram, messageDeliveryStartedCounter, messageDeliveryDurationHistogram, queueDepthHistogram, tracer, activeTrustedSpans, activeTrustedSpanAliases, trustedSpanAliasKey, spanWithDuration, trustedTraceContext, internalOrTrustedTraceContext, internalOrTrustedExplicitParentContext, activeTrustedParentContext, activeInternalOrTrustedContext, trackTrustedSpan, trackInternalOrTrustedSpan, getTrackedInternalOrTrustedSpan, setSpanAttrs, completeTrackedLifecycleSpan, addRunAttrs, tracesEnabled } = runtime;
	const recordModelUsage = (evt, metadata, hostPluginId) => {
		const attrs = {
			"openclaw.channel": evt.channel ?? "unknown",
			"openclaw.agent": normalizeDiagnosticValue(evt.agentId),
			"openclaw.provider": evt.provider ?? "unknown",
			"openclaw.model": evt.model ?? "unknown"
		};
		const genAiAttrs = {
			"gen_ai.operation.name": "chat",
			"gen_ai.provider.name": normalizeDiagnosticValue(evt.provider),
			"gen_ai.request.model": normalizeDiagnosticValue(evt.model)
		};
		const usage = evt.usage;
		if (usage.input) {
			tokensCounter.add(usage.input, {
				...attrs,
				"openclaw.token": "input"
			});
			genAiTokenUsageHistogram.record(usage.input, {
				...genAiAttrs,
				"gen_ai.token.type": "input"
			});
		}
		if (usage.output) {
			tokensCounter.add(usage.output, {
				...attrs,
				"openclaw.token": "output"
			});
			genAiTokenUsageHistogram.record(usage.output, {
				...genAiAttrs,
				"gen_ai.token.type": "output"
			});
		}
		if (usage.cacheRead) tokensCounter.add(usage.cacheRead, {
			...attrs,
			"openclaw.token": "cache_read"
		});
		if (usage.cacheWrite) tokensCounter.add(usage.cacheWrite, {
			...attrs,
			"openclaw.token": "cache_write"
		});
		if (usage.promptTokens) tokensCounter.add(usage.promptTokens, {
			...attrs,
			"openclaw.token": "prompt"
		});
		if (usage.total) tokensCounter.add(usage.total, {
			...attrs,
			"openclaw.token": "total"
		});
		if (evt.costUsd) costCounter.add(evt.costUsd, attrs);
		if (evt.durationMs) durationHistogram.record(evt.durationMs, attrs);
		if (evt.context?.limit) contextHistogram.record(evt.context.limit, {
			...attrs,
			"openclaw.context": "limit"
		});
		if (evt.context?.used) contextHistogram.record(evt.context.used, {
			...attrs,
			"openclaw.context": "used"
		});
		if (!tracesEnabled) return;
		const genAiInputTokens = usage.promptTokens ?? (usage.input ?? 0) + (usage.cacheRead ?? 0) + (usage.cacheWrite ?? 0);
		const spanAttrs = {
			...attrs,
			"openclaw.tokens.input": usage.input ?? 0,
			"openclaw.tokens.output": usage.output ?? 0,
			"openclaw.tokens.cache_read": usage.cacheRead ?? 0,
			"openclaw.tokens.cache_write": usage.cacheWrite ?? 0,
			"openclaw.tokens.total": usage.total ?? 0
		};
		if (metadata.trusted && metadata.internal && hostPluginId) spanAttrs["openclaw.plugin"] = normalizeDiagnosticValue(hostPluginId);
		assignGenAiSpanIdentityAttrs(spanAttrs, evt);
		assignPositiveNumberAttr(spanAttrs, "gen_ai.usage.input_tokens", genAiInputTokens);
		assignPositiveNumberAttr(spanAttrs, "gen_ai.usage.output_tokens", usage.output);
		assignPositiveNumberAttr(spanAttrs, "gen_ai.usage.cache_read.input_tokens", usage.cacheRead);
		assignPositiveNumberAttr(spanAttrs, "gen_ai.usage.cache_creation.input_tokens", usage.cacheWrite);
		spanWithDuration("openclaw.model.usage", spanAttrs, evt.durationMs, {
			parentContext: activeTrustedParentContext(evt, metadata),
			endTimeMs: evt.ts
		}).end(evt.ts);
	};
	const recordWebhookReceived = (evt) => {
		const attrs = {
			"openclaw.channel": evt.channel ?? "unknown",
			"openclaw.webhook": evt.updateType ?? "unknown"
		};
		webhookReceivedCounter.add(1, attrs);
	};
	const recordWebhookProcessed = (evt) => {
		const attrs = {
			"openclaw.channel": normalizeDiagnosticValue(evt.channel),
			"openclaw.webhook": normalizeDiagnosticValue(evt.updateType)
		};
		if (typeof evt.durationMs === "number") webhookDurationHistogram.record(evt.durationMs, attrs);
		if (!tracesEnabled) return;
		const spanAttrs = { ...attrs };
		spanWithDuration("openclaw.webhook.processed", spanAttrs, evt.durationMs).end();
	};
	const recordWebhookError = (evt) => {
		const attrs = {
			"openclaw.channel": normalizeDiagnosticValue(evt.channel),
			"openclaw.webhook": normalizeDiagnosticValue(evt.updateType)
		};
		webhookErrorCounter.add(1, attrs);
		if (!tracesEnabled) return;
		const redactedError = redactSensitiveText(evt.error);
		const spanAttrs = {
			...attrs,
			"openclaw.error": redactedError
		};
		const span = tracer.startSpan("openclaw.webhook.error", { attributes: spanAttrs });
		span.setStatus({
			code: SpanStatusCode.ERROR,
			message: redactedError
		});
		span.end();
	};
	const recordMessageQueued = (evt) => {
		const attrs = {
			"openclaw.channel": normalizeDiagnosticValue(evt.channel),
			"openclaw.source": normalizeDiagnosticValue(evt.source)
		};
		messageQueuedCounter.add(1, attrs);
		if (typeof evt.queueDepth === "number") queueDepthHistogram.record(evt.queueDepth, attrs);
	};
	const recordMessageReceived = (evt) => {
		messageReceivedCounter.add(1, {
			"openclaw.channel": normalizeDiagnosticValue(evt.channel),
			"openclaw.source": normalizeDiagnosticValue(evt.source)
		});
	};
	const recordMessageDispatchStarted = (evt, metadata) => {
		const attrs = {
			"openclaw.channel": normalizeDiagnosticValue(evt.channel),
			"openclaw.source": normalizeDiagnosticValue(evt.source)
		};
		messageDispatchStartedCounter.add(1, attrs);
		if (!tracesEnabled) return;
		const traceContext = internalOrTrustedTraceContext(evt, metadata);
		if (!traceContext?.spanId || activeTrustedSpans.has(traceContext.spanId)) return;
		trackInternalOrTrustedSpan(evt, metadata, spanWithDuration("openclaw.message.processed", attrs, void 0, {
			parentContext: internalOrTrustedExplicitParentContext(evt, metadata),
			startTimeMs: evt.ts
		}));
	};
	const recordMessageDispatchCompleted = (evt) => {
		const attrs = {
			"openclaw.channel": normalizeDiagnosticValue(evt.channel),
			"openclaw.outcome": evt.outcome,
			"openclaw.reason": normalizeDiagnosticValue(evt.reason, "none"),
			"openclaw.source": normalizeDiagnosticValue(evt.source)
		};
		messageDispatchCompletedCounter.add(1, attrs);
		messageDispatchDurationHistogram.record(evt.durationMs, attrs);
	};
	const recordMessageProcessed = (evt, metadata) => {
		const attrs = {
			"openclaw.channel": normalizeDiagnosticValue(evt.channel),
			"openclaw.outcome": evt.outcome ?? "unknown"
		};
		messageProcessedCounter.add(1, attrs);
		if (typeof evt.durationMs === "number") messageDurationHistogram.record(evt.durationMs, attrs);
		if (!tracesEnabled) return;
		const spanAttrs = { ...attrs };
		if (evt.reason) spanAttrs["openclaw.reason"] = normalizeDiagnosticValue(evt.reason, "unknown");
		const trackedSpan = getTrackedInternalOrTrustedSpan(evt, metadata);
		const span = trackedSpan ?? spanWithDuration("openclaw.message.processed", spanAttrs, evt.durationMs, {
			parentContext: internalOrTrustedExplicitParentContext(evt, metadata),
			endTimeMs: evt.ts
		});
		setSpanAttrs(span, spanAttrs);
		if (evt.outcome === "error" && evt.error) span.setStatus({
			code: SpanStatusCode.ERROR,
			message: redactSensitiveText(evt.error)
		});
		const traceContext = internalOrTrustedTraceContext(evt, metadata);
		if (trackedSpan && traceContext?.spanId) {
			completeTrackedLifecycleSpan(traceContext, trackedSpan, evt.ts);
			return;
		}
		span.end(evt.ts);
	};
	const messageDeliveryAttrs = (evt) => ({
		"openclaw.channel": normalizeDiagnosticValue(evt.channel),
		"openclaw.delivery.kind": normalizeDiagnosticValue(evt.deliveryKind, "other")
	});
	const recordMessageDeliveryStarted = (evt) => {
		messageDeliveryStartedCounter.add(1, messageDeliveryAttrs(evt));
	};
	const recordMessageDeliveryCompleted = (evt, metadata) => {
		const attrs = {
			...messageDeliveryAttrs(evt),
			"openclaw.outcome": "completed"
		};
		messageDeliveryDurationHistogram.record(evt.durationMs, attrs);
		if (!tracesEnabled) return;
		spanWithDuration("openclaw.message.delivery", {
			...attrs,
			"openclaw.delivery.result_count": evt.resultCount
		}, evt.durationMs, {
			parentContext: activeInternalOrTrustedContext(evt, metadata),
			endTimeMs: evt.ts
		}).end(evt.ts);
	};
	const recordMessageDeliveryError = (evt, metadata) => {
		const attrs = {
			...messageDeliveryAttrs(evt),
			"openclaw.outcome": "error",
			"openclaw.errorCategory": normalizeDiagnosticValue(evt.errorCategory, "other")
		};
		messageDeliveryDurationHistogram.record(evt.durationMs, attrs);
		if (!tracesEnabled) return;
		const span = spanWithDuration("openclaw.message.delivery", attrs, evt.durationMs, {
			parentContext: activeInternalOrTrustedContext(evt, metadata),
			endTimeMs: evt.ts
		});
		span.setStatus({
			code: SpanStatusCode.ERROR,
			message: redactSensitiveText(evt.errorCategory)
		});
		span.end(evt.ts);
	};
	const recordRunStarted = (evt, metadata) => {
		if (!tracesEnabled || !metadata.trusted) return;
		const spanAttrs = {};
		addRunAttrs(spanAttrs, evt);
		const span = trackTrustedSpan(evt, metadata, spanWithDuration("openclaw.run", spanAttrs, void 0, {
			parentContext: activeTrustedParentContext(evt, metadata),
			startTimeMs: evt.ts
		}));
		const parentSpanId = trustedTraceContext(evt, metadata)?.parentSpanId;
		if (parentSpanId && !activeTrustedSpans.has(parentSpanId)) {
			const owner = {
				kind: "run",
				id: evt.runId
			};
			activeTrustedSpanAliases.set(trustedSpanAliasKey(parentSpanId, owner), {
				span,
				spanId: parentSpanId,
				owner
			});
		}
	};
	return {
		recordModelUsage,
		recordWebhookReceived,
		recordWebhookProcessed,
		recordWebhookError,
		recordMessageQueued,
		recordMessageReceived,
		recordMessageDispatchStarted,
		recordMessageDispatchCompleted,
		recordMessageProcessed,
		recordMessageDeliveryStarted,
		recordMessageDeliveryCompleted,
		recordMessageDeliveryError,
		recordRunStarted
	};
}
//#endregion
//#region extensions/diagnostics-otel/src/service-traces.ts
init_esm$2();
function createDiagnosticsTraceRuntime(tracer) {
	const activeTrustedSpans = /* @__PURE__ */ new Map();
	const activeTrustedSpanAliases = /* @__PURE__ */ new Map();
	const retainedTrustedSpanContexts = /* @__PURE__ */ new Map();
	const stopActiveTrustedSpans = () => {
		const stopAt = Date.now();
		retainedTrustedSpanContexts.clear();
		for (const span of /* @__PURE__ */ new Set([...activeTrustedSpans.values(), ...Array.from(activeTrustedSpanAliases.values(), (entry) => entry.span)])) span.end(stopAt);
		activeTrustedSpans.clear();
		activeTrustedSpanAliases.clear();
	};
	const spanWithDuration = (name, attributes, durationMs, options = {}) => {
		const endTimeMs = options.endTimeMs ?? Date.now();
		const startTime = typeof options.startTimeMs === "number" ? options.startTimeMs : typeof durationMs === "number" && durationMs >= 0 ? endTimeMs - durationMs : void 0;
		const parentContext = "parentContext" in options ? options.parentContext ?? void 0 : void 0;
		return tracer.startSpan(name, {
			attributes: redactOtelAttributes(attributes),
			...options.kind !== void 0 ? { kind: options.kind } : {},
			...startTime !== void 0 ? { startTime } : {}
		}, parentContext);
	};
	const trustedTraceContext = (evt, metadata) => metadata.trusted ? normalizeTraceContext(evt.trace) : void 0;
	const internalOrTrustedTraceContext = (evt, metadata) => metadata.internal ? normalizeTraceContext(evt.trace) : normalizedTrustedTraceContext(evt, metadata);
	const trustedSpanAliasOwner = (evt) => {
		if ("runId" in evt && evt.runId) return {
			kind: "run",
			id: evt.runId
		};
	};
	const sameTrustedSpanAliasOwner = (left, right) => Boolean(left && right && left.kind === right.kind && left.id === right.id);
	const trustedSpanAliasKey = (spanId, owner) => `${spanId}:${owner.kind}:${owner.id}`;
	const retainedTrustedSpanContextKey = (traceId, spanId, owner) => `${traceId}:${owner ? trustedSpanAliasKey(spanId, owner) : spanId}`;
	const retainedTrustedSpanContext = (traceContext, spanId, owner) => {
		if (!traceContext?.traceId || !spanId) return;
		const retained = (owner ? retainedTrustedSpanContexts.get(retainedTrustedSpanContextKey(traceContext.traceId, spanId, owner)) : void 0) ?? retainedTrustedSpanContexts.get(retainedTrustedSpanContextKey(traceContext.traceId, spanId));
		if (!retained) return;
		if (retained.owner && !sameTrustedSpanAliasOwner(retained.owner, owner)) return;
		return retained.spanContext;
	};
	const activeTrustedSpanAlias = (spanId, owner) => {
		if (!owner) return;
		const alias = activeTrustedSpanAliases.get(trustedSpanAliasKey(spanId, owner));
		if (!alias || !sameTrustedSpanAliasOwner(alias.owner, owner)) return;
		return alias.span;
	};
	const internalOrTrustedParentContext = (evt, metadata) => {
		const traceContext = internalOrTrustedTraceContext(evt, metadata);
		const parentSpanId = traceContext?.parentSpanId ?? traceContext?.spanId;
		if (!traceContext || !parentSpanId) return;
		return contextForTraceContext({
			...traceContext,
			spanId: parentSpanId
		});
	};
	const internalOrTrustedExplicitParentContext = (evt, metadata) => {
		const traceContext = internalOrTrustedTraceContext(evt, metadata);
		if (!traceContext?.parentSpanId) return;
		return contextForTraceContext({
			...traceContext,
			spanId: traceContext.parentSpanId
		});
	};
	const activeTrustedParentContext = (evt, metadata) => {
		const traceContext = trustedTraceContext(evt, metadata);
		const parentSpanId = traceContext?.parentSpanId;
		if (!parentSpanId) return;
		const owner = trustedSpanAliasOwner(evt);
		const spanContext = (activeTrustedSpans.get(parentSpanId) ?? activeTrustedSpanAlias(parentSpanId, owner))?.spanContext() ?? retainedTrustedSpanContext(traceContext, parentSpanId, owner);
		if (!spanContext) return;
		return trace.setSpanContext(context.active(), spanContext);
	};
	const exportedInternalOrTrustedContext = (evt, metadata) => {
		const traceContext = internalOrTrustedTraceContext(evt, metadata);
		if (!traceContext) return;
		const owner = trustedSpanAliasOwner(evt);
		const activeSpan = (traceContext.spanId ? activeTrustedSpans.get(traceContext.spanId) ?? activeTrustedSpanAlias(traceContext.spanId, owner) : void 0) ?? (traceContext.parentSpanId ? activeTrustedSpans.get(traceContext.parentSpanId) ?? activeTrustedSpanAlias(traceContext.parentSpanId, owner) : void 0);
		if (activeSpan) return trace.setSpanContext(context.active(), activeSpan.spanContext());
		const retainedSpanContext = retainedTrustedSpanContext(traceContext, traceContext.spanId, owner) ?? retainedTrustedSpanContext(traceContext, traceContext.parentSpanId, owner);
		return retainedSpanContext ? trace.setSpanContext(context.active(), retainedSpanContext) : void 0;
	};
	const exportedSpanContextForDiagnosticTraceContext = (traceContext) => {
		if (!traceContext.spanId) return;
		const spanContext = activeTrustedSpans.get(traceContext.spanId)?.spanContext() ?? retainedTrustedSpanContext(traceContext, traceContext.spanId);
		return spanContext && isSpanContextValid(spanContext) ? spanContext : void 0;
	};
	const activeInternalOrTrustedContext = (evt, metadata) => exportedInternalOrTrustedContext(evt, metadata) ?? internalOrTrustedParentContext(evt, metadata);
	const trackTrustedSpan = (evt, metadata, span) => {
		const spanId = trustedTraceContext(evt, metadata)?.spanId;
		if (spanId) activeTrustedSpans.set(spanId, span);
		return span;
	};
	const trackInternalOrTrustedSpan = (evt, metadata, span) => {
		const spanId = internalOrTrustedTraceContext(evt, metadata)?.spanId;
		if (spanId) activeTrustedSpans.set(spanId, span);
		return span;
	};
	const takeTrackedTrustedSpan = (evt, metadata) => {
		const spanId = trustedTraceContext(evt, metadata)?.spanId;
		if (!spanId) return;
		const span = activeTrustedSpans.get(spanId);
		if (span) activeTrustedSpans.delete(spanId);
		return span;
	};
	const getTrackedInternalOrTrustedSpan = (evt, metadata) => {
		const spanId = internalOrTrustedTraceContext(evt, metadata)?.spanId;
		if (!spanId) return;
		return activeTrustedSpans.get(spanId);
	};
	const setSpanAttrs = (span, attributes) => {
		span.setAttributes?.(redactOtelAttributes(attributes));
	};
	const retainTrustedSpanContext = (traceId, spanId, spanContext, owner) => {
		retainedTrustedSpanContexts.set(retainedTrustedSpanContextKey(traceId, spanId, owner), {
			spanContext,
			...owner ? { owner } : {}
		});
		while (retainedTrustedSpanContexts.size > MAX_RETAINED_TRUSTED_SPAN_CONTEXTS) {
			const oldestKey = retainedTrustedSpanContexts.keys().next().value;
			if (!oldestKey) break;
			retainedTrustedSpanContexts.delete(oldestKey);
		}
	};
	const completeTrackedLifecycleSpan = (traceContext, span, endTimeMs) => {
		const spanId = traceContext.spanId;
		if (!spanId) {
			span.end(endTimeMs);
			return;
		}
		const spanContext = span.spanContext();
		const retainedKeys = [{ spanId }];
		const retainedAliasKeys = [];
		for (const [aliasKey, alias] of activeTrustedSpanAliases) if (alias.span === span) {
			retainedKeys.push({
				spanId: alias.spanId,
				owner: alias.owner
			});
			retainedAliasKeys.push(aliasKey);
		}
		if (activeTrustedSpans.get(spanId) === span) activeTrustedSpans.delete(spanId);
		for (const aliasKey of retainedAliasKeys) if (activeTrustedSpanAliases.get(aliasKey)?.span === span) activeTrustedSpanAliases.delete(aliasKey);
		span.end(endTimeMs);
		for (const retainedKey of retainedKeys) retainTrustedSpanContext(traceContext.traceId, retainedKey.spanId, spanContext, retainedKey.owner);
	};
	const addRunAttrs = (spanAttrs, evt) => {
		if (evt.provider) spanAttrs["openclaw.provider"] = evt.provider;
		if (evt.model) spanAttrs["openclaw.model"] = evt.model;
		if (evt.channel) spanAttrs["openclaw.channel"] = evt.channel;
		if (evt.trigger) spanAttrs["openclaw.trigger"] = evt.trigger;
	};
	const paramsSummaryAttrs = (summary) => {
		if (!summary) return {};
		return {
			"openclaw.tool.params.kind": summary.kind,
			..."length" in summary ? { "openclaw.tool.params.length": summary.length } : {}
		};
	};
	return {
		tracer,
		activeTrustedSpans,
		activeTrustedSpanAliases,
		trustedSpanAliasKey,
		trustedSpanAliasOwner,
		spanWithDuration,
		trustedTraceContext,
		internalOrTrustedTraceContext,
		internalOrTrustedParentContext,
		internalOrTrustedExplicitParentContext,
		activeTrustedParentContext,
		activeInternalOrTrustedContext,
		exportedInternalOrTrustedContext,
		exportedSpanContextForDiagnosticTraceContext,
		trackTrustedSpan,
		trackInternalOrTrustedSpan,
		takeTrackedTrustedSpan,
		getTrackedInternalOrTrustedSpan,
		setSpanAttrs,
		completeTrackedLifecycleSpan,
		addRunAttrs,
		paramsSummaryAttrs,
		stopActiveTrustedSpans
	};
}
//#endregion
//#region extensions/diagnostics-otel/src/service.ts
init_esm$2();
const OTLP_HTTP_PROTOBUF_PROTOCOL = "http/protobuf";
const RESOURCE_DETECTORS = [
	["host", import_src$2.hostDetector],
	["os", import_src$2.osDetector],
	["serviceinstance", import_src$2.serviceInstanceIdDetector],
	["process", import_src$2.processDetector],
	["env", import_src$2.envDetector]
];
const OTEL_SIGNAL_PROTOCOL_ENV = {
	traces: OTEL_EXPORTER_OTLP_TRACES_PROTOCOL_ENV,
	metrics: OTEL_EXPORTER_OTLP_METRICS_PROTOCOL_ENV,
	logs: OTEL_EXPORTER_OTLP_LOGS_PROTOCOL_ENV
};
function isOtelSdkDisabled(logger) {
	const value = process.env.OTEL_SDK_DISABLED?.trim().toLowerCase();
	if (!value || value === "false") return false;
	if (value === "true") return true;
	logger.warn("diagnostics-otel: invalid OTEL_SDK_DISABLED value; expected true or false, using false");
	return false;
}
function readNonblankOtelEnv(name) {
	const value = process.env[name];
	return value?.trim() ? value : void 0;
}
function readPositiveOtelNumber(name, fallback) {
	const value = import_src$9.getNumberFromEnv(name);
	if (value !== void 0 && value <= 0) {
		diag.warn(`${name} (${value}) is invalid, expected number greater than 0, using default.`);
		return fallback;
	}
	return value ?? fallback;
}
function resolveResourceDetectors() {
	const names = import_src$9.getStringListFromEnv("OTEL_NODE_RESOURCE_DETECTORS");
	if (names === void 0) return [
		import_src$2.envDetector,
		import_src$2.processDetector,
		import_src$2.hostDetector
	];
	if (names.includes("all")) return RESOURCE_DETECTORS.map(([, detector]) => detector);
	if (names.includes("none")) return [];
	return names.flatMap((name) => {
		const detector = RESOURCE_DETECTORS.find(([candidate]) => candidate === name)?.[1];
		if (!detector) diag.warn(`Invalid resource detector "${name}" specified in the environment variable OTEL_NODE_RESOURCE_DETECTORS`);
		return detector ? [detector] : [];
	});
}
function resolveSignalProtocol(signal, configuredProtocol) {
	return configuredProtocol ?? readNonblankOtelEnv(OTEL_SIGNAL_PROTOCOL_ENV[signal]) ?? readNonblankOtelEnv("OTEL_EXPORTER_OTLP_PROTOCOL") ?? OTLP_HTTP_PROTOBUF_PROTOCOL;
}
function createStartupRollbackError(startupError, cleanupError) {
	return new AggregateError([startupError, cleanupError], "diagnostics-otel startup failed and rollback cleanup failed", { cause: startupError });
}
function publicExporterEventForHealth(event) {
	const base = {
		exporter: event.exporter,
		signal: event.signal
	};
	if (event.status === "recovered") return;
	if (event.status === "started") return {
		...base,
		status: "started",
		reason: "configured"
	};
	if (event.status === "dropped") return {
		...base,
		status: "dropped"
	};
	const reason = event.reason === "export_failed" ? "emit_failed" : event.reason;
	return {
		...base,
		status: "failure",
		...reason && reason !== "default_endpoint" ? { reason } : {},
		...event.errorCategory ? { errorCategory: event.errorCategory } : {}
	};
}
function diagnosticTraceContextFromSpanContext(spanContext) {
	return {
		traceId: spanContext.traceId,
		spanId: spanContext.spanId,
		traceFlags: spanContext.traceFlags.toString(16).padStart(2, "0")
	};
}
function createDiagnosticsOtelService() {
	let traceProvider = null;
	let meterProvider = null;
	let logProvider = null;
	let unsubscribe = null;
	let unregisterTracePropagationBridge = null;
	let stopActiveTrustedSpans = null;
	let unregisterOwnedSdkRuntime = null;
	let unregisterUnhandledRejectionHandler = null;
	let retireExporterRoutes = null;
	let preserveExporterRoutesOnNextStop = false;
	const stopStarted = async (options) => {
		const currentUnsubscribe = unsubscribe;
		const currentUnregisterTracePropagationBridge = unregisterTracePropagationBridge;
		const currentLogProvider = logProvider;
		const currentTraceProvider = traceProvider;
		const currentMeterProvider = meterProvider;
		const currentStopActiveTrustedSpans = stopActiveTrustedSpans;
		const currentUnregisterOwnedSdkRuntime = unregisterOwnedSdkRuntime;
		const currentUnregisterUnhandledRejectionHandler = unregisterUnhandledRejectionHandler;
		const currentRetireExporterRoutes = retireExporterRoutes;
		unsubscribe = null;
		unregisterTracePropagationBridge = null;
		logProvider = null;
		traceProvider = null;
		meterProvider = null;
		stopActiveTrustedSpans = null;
		unregisterOwnedSdkRuntime = null;
		unregisterUnhandledRejectionHandler = null;
		retireExporterRoutes = options?.preserveExporterRoutes ? currentRetireExporterRoutes : null;
		const settle = async (...stops) => (await Promise.allSettled(stops.map((stop) => Promise.resolve().then(() => stop?.())))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		const failures = await settle(currentUnregisterTracePropagationBridge, currentUnsubscribe, currentStopActiveTrustedSpans, currentUnregisterOwnedSdkRuntime);
		const providerFailures = await settle(currentLogProvider ? () => currentLogProvider.shutdown() : null, currentTraceProvider ? () => currentTraceProvider.shutdown() : null, currentMeterProvider ? () => currentMeterProvider.shutdown() : null);
		failures.push(...providerFailures);
		if (!options?.preserveExporterRoutes) currentRetireExporterRoutes?.(providerFailures.length > 0);
		if (providerFailures.length > 0) retireExporterRoutes = currentRetireExporterRoutes;
		failures.push(...await settle(currentUnregisterUnhandledRejectionHandler));
		if (failures.length === 1) throw failures[0];
		if (failures.length > 1) throw new AggregateError(failures, `diagnostics-otel shutdown failed: ${failures.join("; ")}`);
	};
	return {
		id: "diagnostics-otel",
		async start(ctx) {
			preserveExporterRoutesOnNextStop = false;
			await stopStarted();
			const cfg = ctx.config.diagnostics;
			const otel = cfg?.otel;
			if (!cfg || cfg.enabled === false || !otel?.enabled) return;
			const sdkDisabled = isOtelSdkDisabled(ctx.logger);
			const sdkPreloaded = hasPreloadedOtelSdk();
			if (!sdkPreloaded) unregisterOwnedSdkRuntime = registerOwnedSdkRuntime((message) => ctx.logger.warn(message));
			if (!sdkPreloaded && sdkDisabled) return;
			const exporterRoutes = /* @__PURE__ */ new Map();
			const internalDiagnostics = ctx.internalDiagnostics;
			const exporterHealthReporter = internalDiagnostics;
			const emitPublicExporterEvent = createPublicExporterHealthEventEmitter((event) => {
				const publicEvent = publicExporterEventForHealth(event);
				if (!publicEvent) return;
				try {
					internalDiagnostics?.emit({
						type: "telemetry.exporter",
						...publicEvent
					});
				} catch {}
			});
			const emitExporterEvent = createExporterHealthEventEmitter((event) => {
				const key = `${event.signal}\u0000${event.transport}`;
				if (event.status === "dropped") exporterRoutes.delete(key);
				else exporterRoutes.set(key, {
					signal: event.signal,
					status: event.status,
					transport: event.transport
				});
				try {
					const { exporter: _exporter, ...update } = event;
					exporterHealthReporter?.reportExporterHealth?.(update);
				} catch {}
				emitPublicExporterEvent(event);
			});
			const tracesEnabled = otel.traces !== false;
			const metricsEnabled = otel.metrics !== false;
			const logsEnabled = otel.logs === true && !sdkDisabled;
			const logsExporter = otel.logsExporter ?? "otlp";
			const logsToOtlpRequested = logsEnabled && (logsExporter === "otlp" || logsExporter === "both");
			const logsToStdout = logsEnabled && (logsExporter === "stdout" || logsExporter === "both");
			if ([
				...tracesEnabled ? ["traces"] : [],
				...metricsEnabled ? ["metrics"] : [],
				...logsEnabled ? ["logs"] : []
			].length === 0) return;
			const subscribe = ctx.internalDiagnostics?.onEvent;
			if (!subscribe) {
				ctx.logger.error("diagnostics-otel: internal diagnostics capability unavailable");
				return;
			}
			retireExporterRoutes = (preserveFailures = false) => {
				for (const route of exporterRoutes.values()) {
					if (preserveFailures && route.status === "failure") continue;
					emitExporterEvent({
						exporter: "diagnostics-otel",
						signal: route.signal,
						transport: route.transport,
						status: "dropped"
					});
				}
			};
			const ownedOtlpSignals = [
				...!sdkPreloaded && tracesEnabled ? ["traces"] : [],
				...!sdkPreloaded && metricsEnabled ? ["metrics"] : [],
				...logsToOtlpRequested ? ["logs"] : []
			];
			const supportedOtlpSignals = /* @__PURE__ */ new Set();
			for (const signal of ownedOtlpSignals) {
				const protocol = resolveSignalProtocol(signal, otel.protocol);
				if (protocol === OTLP_HTTP_PROTOBUF_PROTOCOL) {
					supportedOtlpSignals.add(signal);
					continue;
				}
				emitExporterEvent({
					signal,
					exporter: "diagnostics-otel",
					transport: "otlp-http-protobuf",
					status: "failure",
					reason: "unsupported_protocol"
				});
				ctx.logger.warn(`diagnostics-otel: unsupported ${signal} protocol ${protocol}; OTLP export disabled`);
			}
			const tracesToOtlp = !sdkPreloaded && tracesEnabled && supportedOtlpSignals.has("traces");
			const metricsToOtlp = !sdkPreloaded && metricsEnabled && supportedOtlpSignals.has("metrics");
			const logsToOtlp = logsToOtlpRequested && supportedOtlpSignals.has("logs");
			const tracesActive = sdkPreloaded ? tracesEnabled : tracesToOtlp;
			const metricsActive = sdkPreloaded ? metricsEnabled : metricsToOtlp;
			const logsActive = logsToStdout || logsToOtlp;
			if (!tracesActive && !metricsActive && !logsActive) return;
			const hasOwnedOtlpSignal = ownedOtlpSignals.length > 0;
			const sharedEnvEndpoint = hasOwnedOtlpSignal ? process.env[OTEL_EXPORTER_OTLP_ENDPOINT_ENV] : void 0;
			const endpoint = hasOwnedOtlpSignal ? normalizeEndpoint(otel.endpoint ?? sharedEnvEndpoint) : void 0;
			const headers = otel.headers ?? void 0;
			const serviceName = otel.serviceName?.trim() || process.env.OTEL_SERVICE_NAME || "openclaw";
			const sampleRate = resolveSampleRate(otel.sampleRate);
			const contentCapturePolicy = resolveContentCapturePolicy(otel.captureContent);
			const resource = import_src$2.resourceFromAttributes({ [ATTR_SERVICE_NAME]: serviceName });
			const logUrl = logsToOtlp ? resolveSignalOtelUrl({
				signalEndpoint: otel.logsEndpoint,
				signalEnvEndpoint: process.env[OTEL_EXPORTER_OTLP_LOGS_ENDPOINT_ENV],
				sharedEnvEndpoint,
				endpoint,
				path: "v1/logs"
			}) : void 0;
			const traceUrl = tracesToOtlp ? resolveSignalOtelUrl({
				signalEndpoint: otel.tracesEndpoint,
				signalEnvEndpoint: process.env[OTEL_EXPORTER_OTLP_TRACES_ENDPOINT_ENV],
				sharedEnvEndpoint,
				endpoint,
				path: "v1/traces"
			}) : void 0;
			const metricUrl = metricsToOtlp ? resolveSignalOtelUrl({
				signalEndpoint: otel.metricsEndpoint,
				signalEnvEndpoint: process.env[OTEL_EXPORTER_OTLP_METRICS_ENDPOINT_ENV],
				sharedEnvEndpoint,
				endpoint,
				path: "v1/metrics"
			}) : void 0;
			const logHttpAgentOptions = logsToOtlp ? resolveOtelHttpAgentOptions({
				url: logUrl,
				signalIdentifier: "LOGS"
			}) : void 0;
			const traceHttpAgentOptions = tracesToOtlp ? resolveOtelHttpAgentOptions({
				url: traceUrl,
				signalIdentifier: "TRACES"
			}) : void 0;
			const metricHttpAgentOptions = metricsToOtlp ? resolveOtelHttpAgentOptions({
				url: metricUrl,
				signalIdentifier: "METRICS"
			}) : void 0;
			if (tracesToOtlp || metricsToOtlp) try {
				const detectedResource = import_src$2.detectResources({ detectors: resolveResourceDetectors() }).merge(resource);
				const sdkMetricsEnabled = import_src$9.getBooleanFromEnv("OTEL_NODE_EXPERIMENTAL_SDK_METRICS");
				const metricExporter = metricsToOtlp ? observeOtlpExporterHealth(new import_src.OTLPMetricExporter({
					...metricUrl ? { url: metricUrl } : {},
					...headers ? { headers } : {},
					...metricHttpAgentOptions ? { httpAgentOptions: metricHttpAgentOptions } : {}
				}), {
					emitExporterEvent,
					signal: "metrics"
				}) : void 0;
				const metricInterval = typeof otel.flushIntervalMs === "number" ? Math.max(1e3, otel.flushIntervalMs) : readPositiveOtelNumber("OTEL_METRIC_EXPORT_INTERVAL", 6e4);
				let metricTimeout = readPositiveOtelNumber("OTEL_METRIC_EXPORT_TIMEOUT", 3e4);
				if (metricTimeout > metricInterval) {
					diag.warn(`OTEL_METRIC_EXPORT_TIMEOUT (${metricTimeout}) is greater than the active metric export interval (${metricInterval}). Clamping timeout to interval value.`);
					metricTimeout = metricInterval;
				}
				const metricReader = metricExporter ? new import_src$3.PeriodicExportingMetricReader({
					exporter: metricExporter,
					exportIntervalMillis: metricInterval,
					exportTimeoutMillis: metricTimeout
				}) : void 0;
				if (metricReader) meterProvider = new import_src$3.MeterProvider({
					resource: detectedResource,
					readers: [metricReader],
					sdkMetricsEnabled
				});
				const traceExporter = tracesToOtlp ? observeOtlpExporterHealth(new import_src$1.OTLPTraceExporter({
					...traceUrl ? { url: traceUrl } : {},
					...headers ? { headers } : {},
					...traceHttpAgentOptions ? { httpAgentOptions: traceHttpAgentOptions } : {}
				}), {
					emitExporterEvent,
					signal: "traces"
				}) : void 0;
				if (traceExporter) {
					const maxQueueSize = readPositiveOtelNumber("OTEL_BSP_MAX_QUEUE_SIZE", 2048);
					traceProvider = new import_index_shim.BasicTracerProvider({
						resource: detectedResource,
						spanProcessors: [new import_index_shim.BatchSpanProcessor(traceExporter, {
							maxQueueSize,
							maxExportBatchSize: Math.min(readPositiveOtelNumber("OTEL_BSP_MAX_EXPORT_BATCH_SIZE", 512), maxQueueSize),
							scheduledDelayMillis: typeof otel.flushIntervalMs === "number" ? Math.max(1e3, otel.flushIntervalMs) : readPositiveOtelNumber("OTEL_BSP_SCHEDULE_DELAY", 5e3),
							exportTimeoutMillis: readPositiveOtelNumber("OTEL_BSP_EXPORT_TIMEOUT", 3e4),
							...sdkMetricsEnabled && meterProvider ? { selfObsMeterProvider: meterProvider } : {}
						})],
						...sampleRate !== void 0 ? { sampler: new import_index_shim.ParentBasedSampler({ root: new import_index_shim.TraceIdRatioBasedSampler(sampleRate) }) } : {},
						...sdkMetricsEnabled && meterProvider ? { meterProvider } : {}
					});
				}
			} catch (err) {
				for (const [signal, url] of [...tracesToOtlp ? [["traces", traceUrl]] : [], ...metricsToOtlp ? [["metrics", metricUrl]] : []]) emitExporterEvent({
					exporter: "diagnostics-otel",
					signal,
					transport: "otlp-http-protobuf",
					endpointMode: url ? "configured" : "default_endpoint",
					status: "failure",
					reason: "start_failed",
					errorCategory: errorCategory(err)
				});
				ctx.logger.error(`diagnostics-otel: failed to start SDK: ${formatError(err)}`);
				preserveExporterRoutesOnNextStop = true;
				try {
					await stopStarted({ preserveExporterRoutes: true });
				} catch (cleanupError) {
					ctx.logger.error(`diagnostics-otel: SDK startup rollback cleanup failed: ${formatError(cleanupError)}`);
					throw createStartupRollbackError(err, cleanupError);
				}
				throw err;
			}
			else if (sdkPreloaded && (tracesEnabled || metricsEnabled)) ctx.logger.info("diagnostics-otel: using preloaded OpenTelemetry SDK");
			const meter = meterProvider ? meterProvider.getMeter("openclaw") : metrics.getMeter("openclaw");
			const diagnosticsTrace = createDiagnosticsTraceRuntime(traceProvider ? traceProvider.getTracer("openclaw") : trace.getTracer("openclaw"));
			stopActiveTrustedSpans = diagnosticsTrace.stopActiveTrustedSpans;
			const diagnosticMetrics = createDiagnosticsMetrics(meter, otel.metricNamePrefix);
			const diagnosticsLogs = createDiagnosticsLogExporter({
				contentCapturePolicy,
				emitExporterEvent,
				flushIntervalMs: otel.flushIntervalMs,
				headers,
				logger: ctx.logger,
				logsEnabled: logsActive,
				logsToOtlp,
				logsToStdout,
				logHttpAgentOptions,
				logUrl,
				resource,
				serviceName
			});
			logProvider = diagnosticsLogs.logProvider;
			const { recordLogRecord, recordSecurityEvent } = diagnosticsLogs;
			const recorderRuntime = createDiagnosticsRecorderRuntime({
				contentCapturePolicy,
				metrics: diagnosticMetrics,
				traces: diagnosticsTrace,
				tracesEnabled: tracesActive
			});
			const recorders = {
				...createUsageRecorders(recorderRuntime),
				...createOperationsRecorders(recorderRuntime),
				...createHarnessRecorders(recorderRuntime),
				...createModelRecorders(recorderRuntime),
				...createToolAndSystemRecorders(recorderRuntime)
			};
			unsubscribe = subscribe(createDiagnosticsEventHandler({
				logger: ctx.logger,
				recorders,
				recordLogRecord,
				recordSecurityEvent
			}));
			if (tracesActive) unregisterTracePropagationBridge = ctx.internalDiagnostics?.registerTracePropagationBridge?.({
				shouldPrepareEvent(event) {
					return event.type === "model.call.started" || event.type === "tool.execution.started";
				},
				prepareEvent(event, metadata) {
					if (event.type === "model.call.started") recorders.recordModelCallStarted(event, metadata);
					else if (event.type === "tool.execution.started") recorders.recordToolExecutionStarted(event, metadata);
				},
				resolveTraceContext(traceContext) {
					const spanContext = diagnosticsTrace.exportedSpanContextForDiagnosticTraceContext(traceContext);
					return spanContext ? diagnosticTraceContextFromSpanContext(spanContext) : void 0;
				}
			}) ?? null;
			if (hasOwnedOtlpSignal || sdkPreloaded && !sdkDisabled) unregisterUnhandledRejectionHandler = registerUnhandledRejectionHandler((reason) => {
				const otlpError = findOtlpExporterError(reason);
				if (!otlpError) return false;
				const code = readErrorCode(otlpError) ?? "unknown";
				ctx.logger.warn(`diagnostics-otel: suppressed OTLP exporter unhandled rejection (code=${String(code)})`);
				return true;
			});
			const emitStarted = (signal, transport, endpointMode) => {
				emitExporterEvent({
					exporter: "diagnostics-otel",
					signal,
					transport,
					...endpointMode ? { endpointMode } : {},
					status: "started",
					reason: endpointMode ?? "configured"
				});
			};
			if (sdkPreloaded && tracesEnabled) emitStarted("traces", "external-sdk");
			else if (tracesToOtlp) emitStarted("traces", "otlp-http-protobuf", traceUrl ? "configured" : "default_endpoint");
			if (sdkPreloaded && metricsEnabled) emitStarted("metrics", "external-sdk");
			else if (metricsToOtlp) emitStarted("metrics", "otlp-http-protobuf", metricUrl ? "configured" : "default_endpoint");
			if (logsToOtlp) emitStarted("logs", "otlp-http-protobuf", logUrl ? "configured" : "default_endpoint");
			if (logsToStdout) emitStarted("logs", "stdout");
			if (logsActive) {
				const label = logsToOtlp && logsToStdout ? "OTLP/Protobuf + stdout JSONL" : logsToStdout ? "stdout JSONL" : "OTLP/Protobuf";
				ctx.logger.info(`diagnostics-otel: logs exporter enabled (${label})`);
			}
		},
		async stop() {
			const preserveExporterRoutes = preserveExporterRoutesOnNextStop;
			preserveExporterRoutesOnNextStop = false;
			await stopStarted(preserveExporterRoutes ? { preserveExporterRoutes: true } : void 0);
		}
	};
}
//#endregion
export { createDiagnosticsOtelService as t };
