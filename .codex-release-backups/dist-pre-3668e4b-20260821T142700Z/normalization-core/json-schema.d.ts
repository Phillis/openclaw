//#region packages/normalization-core/src/json-schema.d.ts
type JsonSchemaObject = Record<string, unknown>;
type JsonSchemaValue = JsonSchemaObject | boolean;
/** Normalize JSON Schema constructs into the TypeBox runtime subset used by validators. */
declare function normalizeJsonSchemaForTypeBox(schema: JsonSchemaValue): JsonSchemaValue;
/** Compare acyclic JSON values using the same equality semantics as TypeBox. */
declare function jsonSchemaValuesEqual(left: unknown, right: unknown): boolean;
/** Validate an acyclic JSON value against the canonical normalized schema. */
declare function isJsonSchemaValueValid(schema: JsonSchemaValue, value: unknown): boolean;
//#endregion
export { JsonSchemaValue, isJsonSchemaValueValid, jsonSchemaValuesEqual, normalizeJsonSchemaForTypeBox };