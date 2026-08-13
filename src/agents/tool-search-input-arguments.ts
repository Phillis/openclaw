import { isRecord } from "@openclaw/normalization-core/record-coerce";

/**
 * Generic `tool_call` wrappers carry no target schema, so some providers serialize
 * nested arrays as XML-style `{item: ...}` wrappers and string-quote scalar numbers
 * before the target tool's own schema is applied. Both rewrites happen only where
 * the target schema explicitly declares the matching shape (array, number, or
 * integer), so every other value still reaches fail-closed validation exactly as
 * the model sent it. Native numbers and objects stay untouched; noncanonical
 * strings fail through to the validator instead of being silently coerced.
 */

/** Model arguments are small; a bounded walk keeps hostile-shaped input cheap. */
const MAX_SCHEMA_DEPTH = 12;
/** Observed transcripts nest the wrapper more than once (`{item:{item:[...]}}`). */
const MAX_ITEM_UNWRAPS = 4;

/**
 * Canonical JSON-number grammar (RFC 8259 §6): optional `-`, integer (`0` or
 * non-zero digit + digits), optional fraction, optional exponent. Leading-zero
 * ints, hex, plus sign, `Infinity`, `NaN`, and whitespace all fail to match, so
 * combined with `Number.isFinite`/`Number.isSafeInteger` no noncanonical input
 * survives coercion.
 */
const CANONICAL_JSON_NUMBER = /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?$/;

/** Only a single-key `item` object is an unambiguous wrapper; anything else is data. */
function readXmlItemWrapper(value: unknown): { readonly wrapped: unknown } | undefined {
  if (!isRecord(value)) {
    return undefined;
  }
  const keys = Object.keys(value);
  return keys.length === 1 && keys[0] === "item" ? { wrapped: value.item } : undefined;
}

function schemaMatchesType(schema: Record<string, unknown>, typeName: string): boolean {
  const type = schema.type;
  return type === typeName || (Array.isArray(type) && type.includes(typeName));
}

function schemaExpectsArray(schema: Record<string, unknown>): boolean {
  return schemaMatchesType(schema, "array");
}

/**
 * An element schema that itself declares an `item` property makes `{item: ...}`
 * a plausible single element, so the wrapper reading is ambiguous and skipped.
 */
function elementSchemaDeclaresItem(items: unknown): boolean {
  return isRecord(items) && isRecord(items.properties) && Object.hasOwn(items.properties, "item");
}

function normalizeArrayLocation(
  value: unknown,
  schema: Record<string, unknown>,
  depth: number,
): unknown {
  const items = schema.items;
  let unwrapped = value;
  if (!Array.isArray(unwrapped) && !elementSchemaDeclaresItem(items)) {
    for (let unwraps = 0; unwraps < MAX_ITEM_UNWRAPS; unwraps += 1) {
      const wrapper = readXmlItemWrapper(unwrapped);
      if (!wrapper) {
        break;
      }
      unwrapped = wrapper.wrapped;
      if (Array.isArray(unwrapped)) {
        break;
      }
    }
    if (unwrapped !== value) {
      unwrapped = Array.isArray(unwrapped) ? unwrapped : [unwrapped];
    }
  }
  // Tuple `items` arrays and untyped element schemas keep their values untouched.
  if (!Array.isArray(unwrapped) || !isRecord(items)) {
    return unwrapped;
  }
  let changed = unwrapped !== value;
  const normalized = unwrapped.map((element) => {
    const normalizedElement = normalizeToolSearchTargetInput(element, items, depth + 1);
    changed ||= normalizedElement !== element;
    return normalizedElement;
  });
  return changed ? normalized : value;
}

/**
 * Returns the parsed number when `value` is a canonical JSON-number string and
 * the schema demands a number/integer at this exact location, otherwise returns
 * `value` unchanged. Integer additionally requires `Number.isSafeInteger`; no
 * values are truncated or rounded. Noncanonical strings fall through, leaving
 * the target validator to reject them.
 */
function coerceNumericStringAtSchema(value: unknown, schema: Record<string, unknown>): unknown {
  if (typeof value !== "string") {
    return value;
  }
  const wantsInteger = schemaMatchesType(schema, "integer");
  if (!wantsInteger && !schemaMatchesType(schema, "number")) {
    return value;
  }
  if (!CANONICAL_JSON_NUMBER.test(value)) {
    return value;
  }
  const parsed = Number(value);
  if (wantsInteger) {
    return Number.isSafeInteger(parsed) ? parsed : value;
  }
  return Number.isFinite(parsed) ? parsed : value;
}

/**
 * Returns the input with unambiguous XML-style array wrappers removed at the
 * locations the target schema declares as arrays, plus canonical JSON-number
 * strings coerced to numbers where the schema declares number/integer. The
 * original value is returned unchanged when nothing was rewritten, so callers
 * keep object identity and validators still see the model input on rejection.
 */
export function normalizeToolSearchTargetInput(
  value: unknown,
  schema: unknown,
  depth = 0,
): unknown {
  if (depth >= MAX_SCHEMA_DEPTH || !isRecord(schema)) {
    return value;
  }
  if (schemaExpectsArray(schema)) {
    return normalizeArrayLocation(value, schema, depth);
  }
  const coerced = coerceNumericStringAtSchema(value, schema);
  if (coerced !== value) {
    return coerced;
  }
  const properties = schema.properties;
  if (!isRecord(value) || Array.isArray(value) || !isRecord(properties)) {
    return value;
  }
  let changed = false;
  const normalized: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value)) {
    const childSchema = Object.hasOwn(properties, key) ? properties[key] : undefined;
    const normalizedChild =
      childSchema === undefined
        ? child
        : normalizeToolSearchTargetInput(child, childSchema, depth + 1);
    normalized[key] = normalizedChild;
    changed ||= normalizedChild !== child;
  }
  return changed ? normalized : value;
}
