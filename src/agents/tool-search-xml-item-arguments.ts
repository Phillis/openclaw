import { isRecord } from "@openclaw/normalization-core/record-coerce";

/**
 * Generic `tool_call` wrappers carry no target schema, so some providers serialize
 * nested arrays as XML-style `{item: ...}` wrappers before the target tool's own
 * schema is applied. Unwrapping happens only where the target schema explicitly
 * declares an array, so every other value still reaches fail-closed validation
 * exactly as the model sent it.
 */

/** Model arguments are small; a bounded walk keeps hostile-shaped input cheap. */
const MAX_SCHEMA_DEPTH = 12;
/** Observed transcripts nest the wrapper more than once (`{item:{item:[...]}}`). */
const MAX_ITEM_UNWRAPS = 4;

/** Only a single-key `item` object is an unambiguous wrapper; anything else is data. */
function readXmlItemWrapper(value: unknown): { readonly wrapped: unknown } | undefined {
  if (!isRecord(value)) {
    return undefined;
  }
  const keys = Object.keys(value);
  return keys.length === 1 && keys[0] === "item" ? { wrapped: value.item } : undefined;
}

function schemaExpectsArray(schema: Record<string, unknown>): boolean {
  const type = schema.type;
  return type === "array" || (Array.isArray(type) && type.includes("array"));
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
    const normalizedElement = normalizeXmlItemArrayArguments(element, items, depth + 1);
    changed ||= normalizedElement !== element;
    return normalizedElement;
  });
  return changed ? normalized : value;
}

/**
 * Returns the input with unambiguous XML-style array wrappers removed at the
 * locations the target schema declares as arrays. The original value is returned
 * unchanged when nothing was rewritten, so callers keep object identity.
 */
export function normalizeXmlItemArrayArguments(
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
        : normalizeXmlItemArrayArguments(child, childSchema, depth + 1);
    normalized[key] = normalizedChild;
    changed ||= normalizedChild !== child;
  }
  return changed ? normalized : value;
}
