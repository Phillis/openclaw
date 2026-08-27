import { t as loadLanceDbModule } from "./lancedb-runtime-DjzdYfTF.js";
import { a as memoryAgentPredicate, i as legacyMemorySchemaError, n as MEMORY_TABLE_NAME, o as quoteLanceSqlString, r as hasAgentScopeColumn } from "./lancedb-schema-DX2uM3rj.js";
import { randomUUID } from "node:crypto";
import { setTimeout } from "node:timers/promises";
//#region node_modules/apache-arrow/fb/metadata-version.mjs
/**
* Logical types, vector layouts, and schemas
* Format Version History.
* Version 1.0 - Forward and backwards compatibility guaranteed.
* Version 1.1 - Add Decimal256.
* Version 1.2 - Add Interval MONTH_DAY_NANO.
* Version 1.3 - Add Run-End Encoded.
*/
var MetadataVersion;
(function(MetadataVersion) {
	/**
	* 0.1.0 (October 2016).
	*/
	MetadataVersion[MetadataVersion["V1"] = 0] = "V1";
	/**
	* 0.2.0 (February 2017). Non-backwards compatible with V1.
	*/
	MetadataVersion[MetadataVersion["V2"] = 1] = "V2";
	/**
	* 0.3.0 -> 0.7.1 (May - December 2017). Non-backwards compatible with V2.
	*/
	MetadataVersion[MetadataVersion["V3"] = 2] = "V3";
	/**
	* >= 0.8.0 (December 2017). Non-backwards compatible with V3.
	*/
	MetadataVersion[MetadataVersion["V4"] = 3] = "V4";
	/**
	* >= 1.0.0 (July 2020. Backwards compatible with V4 (V5 readers can read V4
	* metadata and IPC messages). Implementations are recommended to provide a
	* V4 compatibility mode with V5 format changes disabled.
	*
	* Incompatible changes between V4 and V5:
	* - Union buffer layout has changed. In V5, Unions don't have a validity
	*   bitmap buffer.
	*/
	MetadataVersion[MetadataVersion["V5"] = 4] = "V5";
})(MetadataVersion || (MetadataVersion = {}));
//#endregion
//#region node_modules/apache-arrow/fb/union-mode.mjs
var UnionMode;
(function(UnionMode) {
	UnionMode[UnionMode["Sparse"] = 0] = "Sparse";
	UnionMode[UnionMode["Dense"] = 1] = "Dense";
})(UnionMode || (UnionMode = {}));
//#endregion
//#region node_modules/apache-arrow/fb/precision.mjs
var Precision;
(function(Precision) {
	Precision[Precision["HALF"] = 0] = "HALF";
	Precision[Precision["SINGLE"] = 1] = "SINGLE";
	Precision[Precision["DOUBLE"] = 2] = "DOUBLE";
})(Precision || (Precision = {}));
//#endregion
//#region node_modules/apache-arrow/fb/date-unit.mjs
var DateUnit;
(function(DateUnit) {
	DateUnit[DateUnit["DAY"] = 0] = "DAY";
	DateUnit[DateUnit["MILLISECOND"] = 1] = "MILLISECOND";
})(DateUnit || (DateUnit = {}));
//#endregion
//#region node_modules/apache-arrow/fb/time-unit.mjs
var TimeUnit;
(function(TimeUnit) {
	TimeUnit[TimeUnit["SECOND"] = 0] = "SECOND";
	TimeUnit[TimeUnit["MILLISECOND"] = 1] = "MILLISECOND";
	TimeUnit[TimeUnit["MICROSECOND"] = 2] = "MICROSECOND";
	TimeUnit[TimeUnit["NANOSECOND"] = 3] = "NANOSECOND";
})(TimeUnit || (TimeUnit = {}));
//#endregion
//#region node_modules/apache-arrow/fb/interval-unit.mjs
var IntervalUnit;
(function(IntervalUnit) {
	IntervalUnit[IntervalUnit["YEAR_MONTH"] = 0] = "YEAR_MONTH";
	IntervalUnit[IntervalUnit["DAY_TIME"] = 1] = "DAY_TIME";
	IntervalUnit[IntervalUnit["MONTH_DAY_NANO"] = 2] = "MONTH_DAY_NANO";
})(IntervalUnit || (IntervalUnit = {}));
//#endregion
//#region node_modules/apache-arrow/enum.mjs
/**
* Main data type enumeration.
*
* Data types in this library are all *logical*. They can be expressed as
* either a primitive physical type (bytes or bits of some fixed size), a
* nested type consisting of other data types, or another data type (e.g. a
* timestamp encoded as an int64).
*
* **Note**: Only non-negative enum values are written to an Arrow IPC payload.
*
* The rest of the values are specified here so TypeScript can narrow the type
* signatures further beyond the base Arrow Types. The Arrow DataTypes include
* metadata like `bitWidth` that impact the type signatures of the values we
* accept and return.
*
* For example, the `Int8Vector` reads 1-byte numbers from an `Int8Array`, an
* `Int32Vector` reads a 4-byte number from an `Int32Array`, and an `Int64Vector`
* reads a pair of 4-byte lo, hi 32-bit integers as a zero-copy slice from the
* underlying `Int32Array`.
*
* Library consumers benefit by knowing the narrowest type, since we can ensure
* the types across all public methods are propagated, and never bail to `any`.
* These values are _never_ used at runtime, and they will _never_ be written
* to the flatbuffers metadata of serialized Arrow IPC payloads.
*/
var Type;
(function(Type) {
	Type[Type["NONE"] = 0] = "NONE";
	Type[Type["Null"] = 1] = "Null";
	Type[Type["Int"] = 2] = "Int";
	Type[Type["Float"] = 3] = "Float";
	Type[Type["Binary"] = 4] = "Binary";
	Type[Type["Utf8"] = 5] = "Utf8";
	Type[Type["Bool"] = 6] = "Bool";
	Type[Type["Decimal"] = 7] = "Decimal";
	Type[Type["Date"] = 8] = "Date";
	Type[Type["Time"] = 9] = "Time";
	Type[Type["Timestamp"] = 10] = "Timestamp";
	Type[Type["Interval"] = 11] = "Interval";
	Type[Type["List"] = 12] = "List";
	Type[Type["Struct"] = 13] = "Struct";
	Type[Type["Union"] = 14] = "Union";
	Type[Type["FixedSizeBinary"] = 15] = "FixedSizeBinary";
	Type[Type["FixedSizeList"] = 16] = "FixedSizeList";
	Type[Type["Map"] = 17] = "Map";
	Type[Type["Duration"] = 18] = "Duration";
	Type[Type["LargeBinary"] = 19] = "LargeBinary";
	Type[Type["LargeUtf8"] = 20] = "LargeUtf8";
	Type[Type["Dictionary"] = -1] = "Dictionary";
	Type[Type["Int8"] = -2] = "Int8";
	Type[Type["Int16"] = -3] = "Int16";
	Type[Type["Int32"] = -4] = "Int32";
	Type[Type["Int64"] = -5] = "Int64";
	Type[Type["Uint8"] = -6] = "Uint8";
	Type[Type["Uint16"] = -7] = "Uint16";
	Type[Type["Uint32"] = -8] = "Uint32";
	Type[Type["Uint64"] = -9] = "Uint64";
	Type[Type["Float16"] = -10] = "Float16";
	Type[Type["Float32"] = -11] = "Float32";
	Type[Type["Float64"] = -12] = "Float64";
	Type[Type["DateDay"] = -13] = "DateDay";
	Type[Type["DateMillisecond"] = -14] = "DateMillisecond";
	Type[Type["TimestampSecond"] = -15] = "TimestampSecond";
	Type[Type["TimestampMillisecond"] = -16] = "TimestampMillisecond";
	Type[Type["TimestampMicrosecond"] = -17] = "TimestampMicrosecond";
	Type[Type["TimestampNanosecond"] = -18] = "TimestampNanosecond";
	Type[Type["TimeSecond"] = -19] = "TimeSecond";
	Type[Type["TimeMillisecond"] = -20] = "TimeMillisecond";
	Type[Type["TimeMicrosecond"] = -21] = "TimeMicrosecond";
	Type[Type["TimeNanosecond"] = -22] = "TimeNanosecond";
	Type[Type["DenseUnion"] = -23] = "DenseUnion";
	Type[Type["SparseUnion"] = -24] = "SparseUnion";
	Type[Type["IntervalDayTime"] = -25] = "IntervalDayTime";
	Type[Type["IntervalYearMonth"] = -26] = "IntervalYearMonth";
	Type[Type["DurationSecond"] = -27] = "DurationSecond";
	Type[Type["DurationMillisecond"] = -28] = "DurationMillisecond";
	Type[Type["DurationMicrosecond"] = -29] = "DurationMicrosecond";
	Type[Type["DurationNanosecond"] = -30] = "DurationNanosecond";
})(Type || (Type = {}));
var BufferType;
(function(BufferType) {
	/**
	* used in List type, Dense Union and variable length primitive types (String, Binary)
	*/
	BufferType[BufferType["OFFSET"] = 0] = "OFFSET";
	/**
	* actual data, either fixed width primitive types in slots or variable width delimited by an OFFSET vector
	*/
	BufferType[BufferType["DATA"] = 1] = "DATA";
	/**
	* Bit vector indicating if each value is null
	*/
	BufferType[BufferType["VALIDITY"] = 2] = "VALIDITY";
	/**
	* Type vector used in Union type
	*/
	BufferType[BufferType["TYPE"] = 3] = "TYPE";
})(BufferType || (BufferType = {}));
//#endregion
//#region node_modules/apache-arrow/util/bigint.mjs
/**
* Converts an integer as a number or bigint to a number, throwing an error if the input cannot safely be represented as a number.
*/
function bigIntToNumber(number) {
	if (typeof number === "bigint" && (number < Number.MIN_SAFE_INTEGER || number > Number.MAX_SAFE_INTEGER)) throw new TypeError(`${number} is not safe to convert to a number.`);
	return Number(number);
}
//#endregion
//#region node_modules/apache-arrow/type.mjs
var _a;
var _b;
var _c;
var _d;
var _e;
var _f;
var _g;
var _h;
var _j;
var _k;
var _l;
var _m;
var _o;
var _p;
var _q;
var _r;
var _s;
var _t;
var _u;
var _v;
var _w;
var _x;
/**
* An abstract base class for classes that encapsulate metadata about each of
* the logical types that Arrow can represent.
*/
var DataType = class DataType {
	/** @nocollapse */ static isNull(x) {
		return (x === null || x === void 0 ? void 0 : x.typeId) === Type.Null;
	}
	/** @nocollapse */ static isInt(x) {
		return (x === null || x === void 0 ? void 0 : x.typeId) === Type.Int;
	}
	/** @nocollapse */ static isFloat(x) {
		return (x === null || x === void 0 ? void 0 : x.typeId) === Type.Float;
	}
	/** @nocollapse */ static isBinary(x) {
		return (x === null || x === void 0 ? void 0 : x.typeId) === Type.Binary;
	}
	/** @nocollapse */ static isLargeBinary(x) {
		return (x === null || x === void 0 ? void 0 : x.typeId) === Type.LargeBinary;
	}
	/** @nocollapse */ static isUtf8(x) {
		return (x === null || x === void 0 ? void 0 : x.typeId) === Type.Utf8;
	}
	/** @nocollapse */ static isLargeUtf8(x) {
		return (x === null || x === void 0 ? void 0 : x.typeId) === Type.LargeUtf8;
	}
	/** @nocollapse */ static isBool(x) {
		return (x === null || x === void 0 ? void 0 : x.typeId) === Type.Bool;
	}
	/** @nocollapse */ static isDecimal(x) {
		return (x === null || x === void 0 ? void 0 : x.typeId) === Type.Decimal;
	}
	/** @nocollapse */ static isDate(x) {
		return (x === null || x === void 0 ? void 0 : x.typeId) === Type.Date;
	}
	/** @nocollapse */ static isTime(x) {
		return (x === null || x === void 0 ? void 0 : x.typeId) === Type.Time;
	}
	/** @nocollapse */ static isTimestamp(x) {
		return (x === null || x === void 0 ? void 0 : x.typeId) === Type.Timestamp;
	}
	/** @nocollapse */ static isInterval(x) {
		return (x === null || x === void 0 ? void 0 : x.typeId) === Type.Interval;
	}
	/** @nocollapse */ static isDuration(x) {
		return (x === null || x === void 0 ? void 0 : x.typeId) === Type.Duration;
	}
	/** @nocollapse */ static isList(x) {
		return (x === null || x === void 0 ? void 0 : x.typeId) === Type.List;
	}
	/** @nocollapse */ static isStruct(x) {
		return (x === null || x === void 0 ? void 0 : x.typeId) === Type.Struct;
	}
	/** @nocollapse */ static isUnion(x) {
		return (x === null || x === void 0 ? void 0 : x.typeId) === Type.Union;
	}
	/** @nocollapse */ static isFixedSizeBinary(x) {
		return (x === null || x === void 0 ? void 0 : x.typeId) === Type.FixedSizeBinary;
	}
	/** @nocollapse */ static isFixedSizeList(x) {
		return (x === null || x === void 0 ? void 0 : x.typeId) === Type.FixedSizeList;
	}
	/** @nocollapse */ static isMap(x) {
		return (x === null || x === void 0 ? void 0 : x.typeId) === Type.Map;
	}
	/** @nocollapse */ static isDictionary(x) {
		return (x === null || x === void 0 ? void 0 : x.typeId) === Type.Dictionary;
	}
	/** @nocollapse */ static isDenseUnion(x) {
		return DataType.isUnion(x) && x.mode === UnionMode.Dense;
	}
	/** @nocollapse */ static isSparseUnion(x) {
		return DataType.isUnion(x) && x.mode === UnionMode.Sparse;
	}
	constructor(typeId) {
		this.typeId = typeId;
	}
};
_a = Symbol.toStringTag;
DataType[_a] = ((proto) => {
	proto.children = null;
	proto.ArrayType = Array;
	proto.OffsetArrayType = Int32Array;
	return proto[Symbol.toStringTag] = "DataType";
})(DataType.prototype);
/** @ignore */
var Null = class extends DataType {
	constructor() {
		super(Type.Null);
	}
	toString() {
		return `Null`;
	}
};
_b = Symbol.toStringTag;
Null[_b] = ((proto) => proto[Symbol.toStringTag] = "Null")(Null.prototype);
/** @ignore */
var Int_ = class extends DataType {
	constructor(isSigned, bitWidth) {
		super(Type.Int);
		this.isSigned = isSigned;
		this.bitWidth = bitWidth;
	}
	get ArrayType() {
		switch (this.bitWidth) {
			case 8: return this.isSigned ? Int8Array : Uint8Array;
			case 16: return this.isSigned ? Int16Array : Uint16Array;
			case 32: return this.isSigned ? Int32Array : Uint32Array;
			case 64: return this.isSigned ? BigInt64Array : BigUint64Array;
		}
		throw new Error(`Unrecognized ${this[Symbol.toStringTag]} type`);
	}
	toString() {
		return `${this.isSigned ? `I` : `Ui`}nt${this.bitWidth}`;
	}
};
_c = Symbol.toStringTag;
Int_[_c] = ((proto) => {
	proto.isSigned = null;
	proto.bitWidth = null;
	return proto[Symbol.toStringTag] = "Int";
})(Int_.prototype);
/** @ignore */
var Int8 = class extends Int_ {
	constructor() {
		super(true, 8);
	}
	get ArrayType() {
		return Int8Array;
	}
};
/** @ignore */
var Int16 = class extends Int_ {
	constructor() {
		super(true, 16);
	}
	get ArrayType() {
		return Int16Array;
	}
};
/** @ignore */
var Int32 = class extends Int_ {
	constructor() {
		super(true, 32);
	}
	get ArrayType() {
		return Int32Array;
	}
};
/** @ignore */
var Int64 = class extends Int_ {
	constructor() {
		super(true, 64);
	}
	get ArrayType() {
		return BigInt64Array;
	}
};
/** @ignore */
var Uint8 = class extends Int_ {
	constructor() {
		super(false, 8);
	}
	get ArrayType() {
		return Uint8Array;
	}
};
/** @ignore */
var Uint16 = class extends Int_ {
	constructor() {
		super(false, 16);
	}
	get ArrayType() {
		return Uint16Array;
	}
};
/** @ignore */
var Uint32 = class extends Int_ {
	constructor() {
		super(false, 32);
	}
	get ArrayType() {
		return Uint32Array;
	}
};
/** @ignore */
var Uint64 = class extends Int_ {
	constructor() {
		super(false, 64);
	}
	get ArrayType() {
		return BigUint64Array;
	}
};
Object.defineProperty(Int8.prototype, "ArrayType", { value: Int8Array });
Object.defineProperty(Int16.prototype, "ArrayType", { value: Int16Array });
Object.defineProperty(Int32.prototype, "ArrayType", { value: Int32Array });
Object.defineProperty(Int64.prototype, "ArrayType", { value: BigInt64Array });
Object.defineProperty(Uint8.prototype, "ArrayType", { value: Uint8Array });
Object.defineProperty(Uint16.prototype, "ArrayType", { value: Uint16Array });
Object.defineProperty(Uint32.prototype, "ArrayType", { value: Uint32Array });
Object.defineProperty(Uint64.prototype, "ArrayType", { value: BigUint64Array });
/** @ignore */
var Float = class extends DataType {
	constructor(precision) {
		super(Type.Float);
		this.precision = precision;
	}
	get ArrayType() {
		switch (this.precision) {
			case Precision.HALF: return Uint16Array;
			case Precision.SINGLE: return Float32Array;
			case Precision.DOUBLE: return Float64Array;
		}
		throw new Error(`Unrecognized ${this[Symbol.toStringTag]} type`);
	}
	toString() {
		return `Float${this.precision << 5 || 16}`;
	}
};
_d = Symbol.toStringTag;
Float[_d] = ((proto) => {
	proto.precision = null;
	return proto[Symbol.toStringTag] = "Float";
})(Float.prototype);
/** @ignore */
var Float16 = class extends Float {
	constructor() {
		super(Precision.HALF);
	}
};
/** @ignore */
var Float32 = class extends Float {
	constructor() {
		super(Precision.SINGLE);
	}
};
/** @ignore */
var Float64 = class extends Float {
	constructor() {
		super(Precision.DOUBLE);
	}
};
Object.defineProperty(Float16.prototype, "ArrayType", { value: Uint16Array });
Object.defineProperty(Float32.prototype, "ArrayType", { value: Float32Array });
Object.defineProperty(Float64.prototype, "ArrayType", { value: Float64Array });
/** @ignore */
var Binary = class extends DataType {
	constructor() {
		super(Type.Binary);
	}
	toString() {
		return `Binary`;
	}
};
_e = Symbol.toStringTag;
Binary[_e] = ((proto) => {
	proto.ArrayType = Uint8Array;
	return proto[Symbol.toStringTag] = "Binary";
})(Binary.prototype);
/** @ignore */
var LargeBinary = class extends DataType {
	constructor() {
		super(Type.LargeBinary);
	}
	toString() {
		return `LargeBinary`;
	}
};
_f = Symbol.toStringTag;
LargeBinary[_f] = ((proto) => {
	proto.ArrayType = Uint8Array;
	proto.OffsetArrayType = BigInt64Array;
	return proto[Symbol.toStringTag] = "LargeBinary";
})(LargeBinary.prototype);
/** @ignore */
var Utf8 = class extends DataType {
	constructor() {
		super(Type.Utf8);
	}
	toString() {
		return `Utf8`;
	}
};
_g = Symbol.toStringTag;
Utf8[_g] = ((proto) => {
	proto.ArrayType = Uint8Array;
	return proto[Symbol.toStringTag] = "Utf8";
})(Utf8.prototype);
/** @ignore */
var LargeUtf8 = class extends DataType {
	constructor() {
		super(Type.LargeUtf8);
	}
	toString() {
		return `LargeUtf8`;
	}
};
_h = Symbol.toStringTag;
LargeUtf8[_h] = ((proto) => {
	proto.ArrayType = Uint8Array;
	proto.OffsetArrayType = BigInt64Array;
	return proto[Symbol.toStringTag] = "LargeUtf8";
})(LargeUtf8.prototype);
/** @ignore */
var Bool = class extends DataType {
	constructor() {
		super(Type.Bool);
	}
	toString() {
		return `Bool`;
	}
};
_j = Symbol.toStringTag;
Bool[_j] = ((proto) => {
	proto.ArrayType = Uint8Array;
	return proto[Symbol.toStringTag] = "Bool";
})(Bool.prototype);
/** @ignore */
var Decimal = class extends DataType {
	constructor(scale, precision, bitWidth = 128) {
		super(Type.Decimal);
		this.scale = scale;
		this.precision = precision;
		this.bitWidth = bitWidth;
	}
	toString() {
		return `Decimal[${this.precision}e${this.scale > 0 ? `+` : ``}${this.scale}]`;
	}
};
_k = Symbol.toStringTag;
Decimal[_k] = ((proto) => {
	proto.scale = null;
	proto.precision = null;
	proto.ArrayType = Uint32Array;
	return proto[Symbol.toStringTag] = "Decimal";
})(Decimal.prototype);
/** @ignore */
var Date_ = class extends DataType {
	constructor(unit) {
		super(Type.Date);
		this.unit = unit;
	}
	toString() {
		return `Date${(this.unit + 1) * 32}<${DateUnit[this.unit]}>`;
	}
	get ArrayType() {
		return this.unit === DateUnit.DAY ? Int32Array : BigInt64Array;
	}
};
_l = Symbol.toStringTag;
Date_[_l] = ((proto) => {
	proto.unit = null;
	return proto[Symbol.toStringTag] = "Date";
})(Date_.prototype);
/** @ignore */
var Time_ = class extends DataType {
	constructor(unit, bitWidth) {
		super(Type.Time);
		this.unit = unit;
		this.bitWidth = bitWidth;
	}
	toString() {
		return `Time${this.bitWidth}<${TimeUnit[this.unit]}>`;
	}
	get ArrayType() {
		switch (this.bitWidth) {
			case 32: return Int32Array;
			case 64: return BigInt64Array;
		}
		throw new Error(`Unrecognized ${this[Symbol.toStringTag]} type`);
	}
};
_m = Symbol.toStringTag;
Time_[_m] = ((proto) => {
	proto.unit = null;
	proto.bitWidth = null;
	return proto[Symbol.toStringTag] = "Time";
})(Time_.prototype);
/** @ignore */
var Timestamp_ = class extends DataType {
	constructor(unit, timezone) {
		super(Type.Timestamp);
		this.unit = unit;
		this.timezone = timezone;
	}
	toString() {
		return `Timestamp<${TimeUnit[this.unit]}${this.timezone ? `, ${this.timezone}` : ``}>`;
	}
};
_o = Symbol.toStringTag;
Timestamp_[_o] = ((proto) => {
	proto.unit = null;
	proto.timezone = null;
	proto.ArrayType = BigInt64Array;
	return proto[Symbol.toStringTag] = "Timestamp";
})(Timestamp_.prototype);
/** @ignore */
var Interval_ = class extends DataType {
	constructor(unit) {
		super(Type.Interval);
		this.unit = unit;
	}
	toString() {
		return `Interval<${IntervalUnit[this.unit]}>`;
	}
};
_p = Symbol.toStringTag;
Interval_[_p] = ((proto) => {
	proto.unit = null;
	proto.ArrayType = Int32Array;
	return proto[Symbol.toStringTag] = "Interval";
})(Interval_.prototype);
/** @ignore */
var Duration = class extends DataType {
	constructor(unit) {
		super(Type.Duration);
		this.unit = unit;
	}
	toString() {
		return `Duration<${TimeUnit[this.unit]}>`;
	}
};
_q = Symbol.toStringTag;
Duration[_q] = ((proto) => {
	proto.unit = null;
	proto.ArrayType = BigInt64Array;
	return proto[Symbol.toStringTag] = "Duration";
})(Duration.prototype);
/** @ignore */
var List = class extends DataType {
	constructor(child) {
		super(Type.List);
		this.children = [child];
	}
	toString() {
		return `List<${this.valueType}>`;
	}
	get valueType() {
		return this.children[0].type;
	}
	get valueField() {
		return this.children[0];
	}
	get ArrayType() {
		return this.valueType.ArrayType;
	}
};
_r = Symbol.toStringTag;
List[_r] = ((proto) => {
	proto.children = null;
	return proto[Symbol.toStringTag] = "List";
})(List.prototype);
/** @ignore */
var Struct = class extends DataType {
	constructor(children) {
		super(Type.Struct);
		this.children = children;
	}
	toString() {
		return `Struct<{${this.children.map((f) => `${f.name}:${f.type}`).join(`, `)}}>`;
	}
};
_s = Symbol.toStringTag;
Struct[_s] = ((proto) => {
	proto.children = null;
	return proto[Symbol.toStringTag] = "Struct";
})(Struct.prototype);
/** @ignore */
var Union_ = class extends DataType {
	constructor(mode, typeIds, children) {
		super(Type.Union);
		this.mode = mode;
		this.children = children;
		this.typeIds = typeIds = Int32Array.from(typeIds);
		this.typeIdToChildIndex = typeIds.reduce((typeIdToChildIndex, typeId, idx) => (typeIdToChildIndex[typeId] = idx) && typeIdToChildIndex || typeIdToChildIndex, Object.create(null));
	}
	toString() {
		return `${this[Symbol.toStringTag]}<${this.children.map((x) => `${x.type}`).join(` | `)}>`;
	}
};
_t = Symbol.toStringTag;
Union_[_t] = ((proto) => {
	proto.mode = null;
	proto.typeIds = null;
	proto.children = null;
	proto.typeIdToChildIndex = null;
	proto.ArrayType = Int8Array;
	return proto[Symbol.toStringTag] = "Union";
})(Union_.prototype);
/** @ignore */
var FixedSizeBinary = class extends DataType {
	constructor(byteWidth) {
		super(Type.FixedSizeBinary);
		this.byteWidth = byteWidth;
	}
	toString() {
		return `FixedSizeBinary[${this.byteWidth}]`;
	}
};
_u = Symbol.toStringTag;
FixedSizeBinary[_u] = ((proto) => {
	proto.byteWidth = null;
	proto.ArrayType = Uint8Array;
	return proto[Symbol.toStringTag] = "FixedSizeBinary";
})(FixedSizeBinary.prototype);
/** @ignore */
var FixedSizeList = class extends DataType {
	constructor(listSize, child) {
		super(Type.FixedSizeList);
		this.listSize = listSize;
		this.children = [child];
	}
	get valueType() {
		return this.children[0].type;
	}
	get valueField() {
		return this.children[0];
	}
	get ArrayType() {
		return this.valueType.ArrayType;
	}
	toString() {
		return `FixedSizeList[${this.listSize}]<${this.valueType}>`;
	}
};
_v = Symbol.toStringTag;
FixedSizeList[_v] = ((proto) => {
	proto.children = null;
	proto.listSize = null;
	return proto[Symbol.toStringTag] = "FixedSizeList";
})(FixedSizeList.prototype);
/** @ignore */
var Map_ = class extends DataType {
	constructor(entries, keysSorted = false) {
		var _y, _z, _0;
		super(Type.Map);
		this.children = [entries];
		this.keysSorted = keysSorted;
		if (entries) {
			entries["name"] = "entries";
			if ((_y = entries === null || entries === void 0 ? void 0 : entries.type) === null || _y === void 0 ? void 0 : _y.children) {
				const key = (_z = entries === null || entries === void 0 ? void 0 : entries.type) === null || _z === void 0 ? void 0 : _z.children[0];
				if (key) key["name"] = "key";
				const val = (_0 = entries === null || entries === void 0 ? void 0 : entries.type) === null || _0 === void 0 ? void 0 : _0.children[1];
				if (val) val["name"] = "value";
			}
		}
	}
	get keyType() {
		return this.children[0].type.children[0].type;
	}
	get valueType() {
		return this.children[0].type.children[1].type;
	}
	get childType() {
		return this.children[0].type;
	}
	toString() {
		return `Map<{${this.children[0].type.children.map((f) => `${f.name}:${f.type}`).join(`, `)}}>`;
	}
};
_w = Symbol.toStringTag;
Map_[_w] = ((proto) => {
	proto.children = null;
	proto.keysSorted = null;
	return proto[Symbol.toStringTag] = "Map_";
})(Map_.prototype);
/** @ignore */
const getId = ((atomicDictionaryId) => () => ++atomicDictionaryId)(-1);
/** @ignore */
var Dictionary = class extends DataType {
	constructor(dictionary, indices, id, isOrdered) {
		super(Type.Dictionary);
		this.indices = indices;
		this.dictionary = dictionary;
		this.isOrdered = isOrdered || false;
		this.id = id == null ? getId() : bigIntToNumber(id);
	}
	get children() {
		return this.dictionary.children;
	}
	get valueType() {
		return this.dictionary;
	}
	get ArrayType() {
		return this.dictionary.ArrayType;
	}
	toString() {
		return `Dictionary<${this.indices}, ${this.dictionary}>`;
	}
};
_x = Symbol.toStringTag;
Dictionary[_x] = ((proto) => {
	proto.id = null;
	proto.indices = null;
	proto.isOrdered = null;
	proto.dictionary = null;
	return proto[Symbol.toStringTag] = "Dictionary";
})(Dictionary.prototype);
//#endregion
//#region node_modules/apache-arrow/schema.mjs
var Schema = class Schema {
	constructor(fields = [], metadata, dictionaries, metadataVersion = MetadataVersion.V5) {
		this.fields = fields || [];
		this.metadata = metadata || /* @__PURE__ */ new Map();
		if (!dictionaries) dictionaries = generateDictionaryMap(this.fields);
		this.dictionaries = dictionaries;
		this.metadataVersion = metadataVersion;
	}
	get [Symbol.toStringTag]() {
		return "Schema";
	}
	get names() {
		return this.fields.map((f) => f.name);
	}
	toString() {
		return `Schema<{ ${this.fields.map((f, i) => `${i}: ${f}`).join(", ")} }>`;
	}
	/**
	* Construct a new Schema containing only specified fields.
	*
	* @param fieldNames Names of fields to keep.
	* @returns A new Schema of fields matching the specified names.
	*/
	select(fieldNames) {
		const names = new Set(fieldNames);
		const fields = this.fields.filter((f) => names.has(f.name));
		return new Schema(fields, this.metadata);
	}
	/**
	* Construct a new Schema containing only fields at the specified indices.
	*
	* @param fieldIndices Indices of fields to keep.
	* @returns A new Schema of fields at the specified indices.
	*/
	selectAt(fieldIndices) {
		const fields = fieldIndices.map((i) => this.fields[i]).filter(Boolean);
		return new Schema(fields, this.metadata);
	}
	assign(...args) {
		const other = args[0] instanceof Schema ? args[0] : Array.isArray(args[0]) ? new Schema(args[0]) : new Schema(args);
		const curFields = [...this.fields];
		const metadata = mergeMaps(mergeMaps(/* @__PURE__ */ new Map(), this.metadata), other.metadata);
		const newFields = other.fields.filter((f2) => {
			const i = curFields.findIndex((f) => f.name === f2.name);
			return ~i ? (curFields[i] = f2.clone({ metadata: mergeMaps(mergeMaps(/* @__PURE__ */ new Map(), curFields[i].metadata), f2.metadata) })) && false : true;
		});
		const newDictionaries = generateDictionaryMap(newFields, /* @__PURE__ */ new Map());
		return new Schema([...curFields, ...newFields], metadata, new Map([...this.dictionaries, ...newDictionaries]));
	}
};
Schema.prototype.fields = null;
Schema.prototype.metadata = null;
Schema.prototype.dictionaries = null;
var Field = class Field {
	/** @nocollapse */
	static new(...args) {
		let [name, type, nullable, metadata] = args;
		if (args[0] && typeof args[0] === "object") {
			({name} = args[0]);
			type === void 0 && (type = args[0].type);
			nullable === void 0 && (nullable = args[0].nullable);
			metadata === void 0 && (metadata = args[0].metadata);
		}
		return new Field(`${name}`, type, nullable, metadata);
	}
	constructor(name, type, nullable = false, metadata) {
		this.name = name;
		this.type = type;
		this.nullable = nullable;
		this.metadata = metadata || /* @__PURE__ */ new Map();
	}
	get typeId() {
		return this.type.typeId;
	}
	get [Symbol.toStringTag]() {
		return "Field";
	}
	toString() {
		return `${this.name}: ${this.type}`;
	}
	clone(...args) {
		let [name, type, nullable, metadata] = args;
		!args[0] || typeof args[0] !== "object" ? [name = this.name, type = this.type, nullable = this.nullable, metadata = this.metadata] = args : {name = this.name, type = this.type, nullable = this.nullable, metadata = this.metadata} = args[0];
		return Field.new(name, type, nullable, metadata);
	}
};
Field.prototype.type = null;
Field.prototype.name = null;
Field.prototype.nullable = null;
Field.prototype.metadata = null;
/** @ignore */
function mergeMaps(m1, m2) {
	return new Map([...m1 || /* @__PURE__ */ new Map(), ...m2 || /* @__PURE__ */ new Map()]);
}
/** @ignore */
function generateDictionaryMap(fields, dictionaries = /* @__PURE__ */ new Map()) {
	for (let i = -1, n = fields.length; ++i < n;) {
		const type = fields[i].type;
		if (DataType.isDictionary(type)) {
			if (!dictionaries.has(type.id)) dictionaries.set(type.id, type.dictionary);
			else if (dictionaries.get(type.id) !== type.dictionary) throw new Error(`Cannot create Schema containing two different dictionaries with the same Id`);
		}
		if (type.children && type.children.length > 0) generateDictionaryMap(type.children, dictionaries);
	}
	return dictionaries;
}
//#endregion
//#region extensions/memory-lancedb/lancedb-store.ts
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TABLE_INITIALIZATION_ATTEMPTS = 3;
const MEMORY_QUERY_COLUMNS = [
	"id",
	"text",
	"importance",
	"category",
	"createdAt"
];
function createMemoryTableSchema(vectorDim) {
	return new Schema([
		new Field("id", new Utf8(), true),
		new Field("text", new Utf8(), true),
		new Field("vector", new FixedSizeList(vectorDim, new Field("item", new Float32(), true)), true),
		new Field("importance", new Float64(), true),
		new Field("category", new Utf8(), true),
		new Field("createdAt", new Float64(), true),
		new Field("agentId", new Utf8(), true)
	]);
}
async function openOrCreateMemoryTable(db, vectorDim) {
	let lastError;
	for (let attempt = 1; attempt <= TABLE_INITIALIZATION_ATTEMPTS; attempt += 1) {
		let table = null;
		try {
			table = (await db.tableNames()).includes("memories") ? await db.openTable(MEMORY_TABLE_NAME) : await db.createEmptyTable(MEMORY_TABLE_NAME, createMemoryTableSchema(vectorDim), { existOk: true });
			await table.schema();
			return table;
		} catch (error) {
			table?.close();
			lastError = error;
			if (attempt < TABLE_INITIALIZATION_ATTEMPTS) await setTimeout(attempt * 10);
		}
	}
	throw lastError;
}
function formatQueryFilter(filter) {
	if (filter.operator === "LIKE" && typeof filter.value !== "string") throw new Error("LIKE requires a string memory filter value");
	if (typeof filter.value === "number" && !Number.isFinite(filter.value)) throw new Error("Memory filter number must be finite");
	const value = typeof filter.value === "string" ? quoteLanceSqlString(filter.value) : String(filter.value);
	return `${filter.column} ${filter.operator} ${value}`;
}
function scopedPredicate(agentId, filter) {
	const scope = memoryAgentPredicate(agentId);
	return filter ? `(${scope}) AND (${formatQueryFilter(filter)})` : scope;
}
var MemoryDB = class {
	constructor(dbPath, vectorDim, storageOptions) {
		this.dbPath = dbPath;
		this.vectorDim = vectorDim;
		this.storageOptions = storageOptions;
		this.db = null;
		this.table = null;
		this.initPromise = null;
	}
	async ensureInitialized() {
		if (this.table) return;
		if (this.initPromise) return await this.initPromise;
		this.initPromise = this.doInitialize().catch((error) => {
			this.initPromise = null;
			throw error;
		});
		return await this.initPromise;
	}
	async doInitialize() {
		const lancedb = await loadLanceDbModule();
		const connectionOptions = this.storageOptions ? { storageOptions: this.storageOptions } : {};
		const db = await lancedb.connect(this.dbPath, connectionOptions);
		let table = null;
		try {
			table = await openOrCreateMemoryTable(db, this.vectorDim);
			if (!hasAgentScopeColumn(await table.schema())) throw legacyMemorySchemaError();
			this.db = db;
			this.table = table;
		} catch (error) {
			table?.close();
			db.close();
			throw error;
		}
	}
	async store(agentId, entry) {
		await this.ensureInitialized();
		const fullEntry = {
			...entry,
			id: randomUUID(),
			createdAt: Date.now()
		};
		const storedEntry = {
			...fullEntry,
			agentId
		};
		await this.table.add([storedEntry]);
		return fullEntry;
	}
	async search(agentId, vector, limit = 5, minScore = .5) {
		await this.ensureInitialized();
		return (await this.table.vectorSearch(vector).where(memoryAgentPredicate(agentId)).limit(limit).toArray()).map((row) => {
			const score = 1 / (1 + (row["_distance"] ?? 0));
			return {
				entry: {
					id: row.id,
					text: row.text,
					vector: row.vector,
					importance: row.importance,
					category: row.category,
					createdAt: row.createdAt
				},
				score
			};
		}).filter((result) => result.score >= minScore);
	}
	async list(agentId, limit, options = {}) {
		await this.ensureInitialized();
		let query = this.table.query().where(memoryAgentPredicate(agentId)).select([
			"id",
			"text",
			"importance",
			"category",
			"createdAt"
		]);
		if (!options.orderByCreatedAt && limit !== void 0) query = query.limit(limit);
		const entries = (await query.toArray()).map((row) => ({
			id: row.id,
			text: row.text,
			importance: row.importance,
			category: row.category,
			createdAt: row.createdAt
		}));
		if (options.orderByCreatedAt) entries.sort((a, b) => b.createdAt - a.createdAt);
		return limit === void 0 ? entries : entries.slice(0, limit);
	}
	async query(agentId, options) {
		await this.ensureInitialized();
		let query = this.table.query().where(scopedPredicate(agentId, options.filter)).select(options.columns);
		if (options.limit !== void 0) query = query.limit(options.limit);
		return await query.toArray();
	}
	async delete(agentId, id) {
		await this.ensureInitialized();
		if (!UUID_PATTERN.test(id)) throw new Error(`Invalid memory ID format: ${id}`);
		const predicate = scopedPredicate(agentId, {
			column: "id",
			operator: "=",
			value: id
		});
		if (await this.table.countRows(predicate) === 0) return false;
		await this.table.delete(predicate);
		return true;
	}
	async count(agentId) {
		await this.ensureInitialized();
		return await this.table.countRows(memoryAgentPredicate(agentId));
	}
	close() {
		this.table?.close();
		this.db?.close();
		this.table = null;
		this.db = null;
		this.initPromise = null;
	}
};
//#endregion
export { MemoryDB as n, MEMORY_QUERY_COLUMNS as t };
