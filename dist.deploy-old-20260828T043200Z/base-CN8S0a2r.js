//#region node_modules/nostr-tools/node_modules/@noble/hashes/utils.js
/**
* Utilities for hex, bytes, CSPRNG.
* @module
*/
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
/** Checks if something is Uint8Array. Be careful: nodejs Buffer will return true. */
function isBytes$1(a) {
	return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
/** Asserts something is positive integer. */
function anumber$1(n, title = "") {
	if (!Number.isSafeInteger(n) || n < 0) {
		const prefix = title && `"${title}" `;
		throw new Error(`${prefix}expected integer >= 0, got ${n}`);
	}
}
/** Asserts something is Uint8Array. */
function abytes$1(value, length, title = "") {
	const bytes = isBytes$1(value);
	const len = value?.length;
	const needsLen = length !== void 0;
	if (!bytes || needsLen && len !== length) {
		const prefix = title && `"${title}" `;
		const ofLen = needsLen ? ` of length ${length}` : "";
		const got = bytes ? `length=${len}` : `type=${typeof value}`;
		throw new Error(prefix + "expected Uint8Array" + ofLen + ", got " + got);
	}
	return value;
}
/** Asserts something is hash */
function ahash(h) {
	if (typeof h !== "function" || typeof h.create !== "function") throw new Error("Hash must wrapped by utils.createHasher");
	anumber$1(h.outputLen);
	anumber$1(h.blockLen);
}
/** Asserts a hash instance has not been destroyed / finished */
function aexists(instance, checkFinished = true) {
	if (instance.destroyed) throw new Error("Hash instance has been destroyed");
	if (checkFinished && instance.finished) throw new Error("Hash#digest() has already been called");
}
/** Asserts output is properly-sized byte array */
function aoutput(out, instance) {
	abytes$1(out, void 0, "digestInto() output");
	const min = instance.outputLen;
	if (out.length < min) throw new Error("\"digestInto() output\" expected to be of length >=" + min);
}
/** Zeroize a byte array. Warning: JS provides no guarantees. */
function clean(...arrays) {
	for (let i = 0; i < arrays.length; i++) arrays[i].fill(0);
}
/** Create DataView of an array for easy byte-level manipulation. */
function createView(arr) {
	return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
/** The rotate right (circular right shift) operation for uint32 */
function rotr(word, shift) {
	return word << 32 - shift | word >>> shift;
}
const hasHexBuiltin$1 = /* @__PURE__ */ (() => typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function")();
const hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
/**
* Convert byte array to hex string. Uses built-in function, when available.
* @example bytesToHex(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])) // 'cafe0123'
*/
function bytesToHex(bytes) {
	abytes$1(bytes);
	if (hasHexBuiltin$1) return bytes.toHex();
	let hex = "";
	for (let i = 0; i < bytes.length; i++) hex += hexes[bytes[i]];
	return hex;
}
const asciis = {
	_0: 48,
	_9: 57,
	A: 65,
	F: 70,
	a: 97,
	f: 102
};
function asciiToBase16(ch) {
	if (ch >= asciis._0 && ch <= asciis._9) return ch - asciis._0;
	if (ch >= asciis.A && ch <= asciis.F) return ch - (asciis.A - 10);
	if (ch >= asciis.a && ch <= asciis.f) return ch - (asciis.a - 10);
}
/**
* Convert hex string to byte array. Uses built-in function, when available.
* @example hexToBytes('cafe0123') // Uint8Array.from([0xca, 0xfe, 0x01, 0x23])
*/
function hexToBytes(hex) {
	if (typeof hex !== "string") throw new Error("hex string expected, got " + typeof hex);
	if (hasHexBuiltin$1) return Uint8Array.fromHex(hex);
	const hl = hex.length;
	const al = hl / 2;
	if (hl % 2) throw new Error("hex string expected, got unpadded hex of length " + hl);
	const array = new Uint8Array(al);
	for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
		const n1 = asciiToBase16(hex.charCodeAt(hi));
		const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
		if (n1 === void 0 || n2 === void 0) {
			const char = hex[hi] + hex[hi + 1];
			throw new Error("hex string expected, got non-hex character \"" + char + "\" at index " + hi);
		}
		array[ai] = n1 * 16 + n2;
	}
	return array;
}
/** Copies several Uint8Arrays into one. */
function concatBytes(...arrays) {
	let sum = 0;
	for (let i = 0; i < arrays.length; i++) {
		const a = arrays[i];
		abytes$1(a);
		sum += a.length;
	}
	const res = new Uint8Array(sum);
	for (let i = 0, pad = 0; i < arrays.length; i++) {
		const a = arrays[i];
		res.set(a, pad);
		pad += a.length;
	}
	return res;
}
/** Creates function with outputLen, blockLen, create properties from a class constructor. */
function createHasher(hashCons, info = {}) {
	const hashC = (msg, opts) => hashCons(opts).update(msg).digest();
	const tmp = hashCons(void 0);
	hashC.outputLen = tmp.outputLen;
	hashC.blockLen = tmp.blockLen;
	hashC.create = (opts) => hashCons(opts);
	Object.assign(hashC, info);
	return Object.freeze(hashC);
}
/** Cryptographically secure PRNG. Uses internal OS-level `crypto.getRandomValues`. */
function randomBytes(bytesLength = 32) {
	const cr = typeof globalThis === "object" ? globalThis.crypto : null;
	if (typeof cr?.getRandomValues !== "function") throw new Error("crypto.getRandomValues must be defined");
	return cr.getRandomValues(new Uint8Array(bytesLength));
}
/** Creates OID opts for NIST hashes, with prefix 06 09 60 86 48 01 65 03 04 02. */
const oidNist = (suffix) => ({ oid: Uint8Array.from([
	6,
	9,
	96,
	134,
	72,
	1,
	101,
	3,
	4,
	2,
	suffix
]) });
//#endregion
//#region node_modules/@scure/base/index.js
/*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function isBytes(a) {
	return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
/** Asserts something is Uint8Array. */
function abytes(b) {
	if (!isBytes(b)) throw new Error("Uint8Array expected");
}
function isArrayOf(isString, arr) {
	if (!Array.isArray(arr)) return false;
	if (arr.length === 0) return true;
	if (isString) return arr.every((item) => typeof item === "string");
	else return arr.every((item) => Number.isSafeInteger(item));
}
function afn(input) {
	if (typeof input !== "function") throw new Error("function expected");
	return true;
}
function astr(label, input) {
	if (typeof input !== "string") throw new Error(`${label}: string expected`);
	return true;
}
function anumber(n) {
	if (!Number.isSafeInteger(n)) throw new Error(`invalid integer: ${n}`);
}
function aArr(input) {
	if (!Array.isArray(input)) throw new Error("array expected");
}
function astrArr(label, input) {
	if (!isArrayOf(true, input)) throw new Error(`${label}: array of strings expected`);
}
function anumArr(label, input) {
	if (!isArrayOf(false, input)) throw new Error(`${label}: array of numbers expected`);
}
/**
* @__NO_SIDE_EFFECTS__
*/
function chain(...args) {
	const id = (a) => a;
	const wrap = (a, b) => (c) => a(b(c));
	return {
		encode: args.map((x) => x.encode).reduceRight(wrap, id),
		decode: args.map((x) => x.decode).reduce(wrap, id)
	};
}
/**
* Encodes integer radix representation to array of strings using alphabet and back.
* Could also be array of strings.
* @__NO_SIDE_EFFECTS__
*/
function alphabet(letters) {
	const lettersA = typeof letters === "string" ? letters.split("") : letters;
	const len = lettersA.length;
	astrArr("alphabet", lettersA);
	const indexes = new Map(lettersA.map((l, i) => [l, i]));
	return {
		encode: (digits) => {
			aArr(digits);
			return digits.map((i) => {
				if (!Number.isSafeInteger(i) || i < 0 || i >= len) throw new Error(`alphabet.encode: digit index outside alphabet "${i}". Allowed: ${letters}`);
				return lettersA[i];
			});
		},
		decode: (input) => {
			aArr(input);
			return input.map((letter) => {
				astr("alphabet.decode", letter);
				const i = indexes.get(letter);
				if (i === void 0) throw new Error(`Unknown letter: "${letter}". Allowed: ${letters}`);
				return i;
			});
		}
	};
}
/**
* @__NO_SIDE_EFFECTS__
*/
function join(separator = "") {
	astr("join", separator);
	return {
		encode: (from) => {
			astrArr("join.decode", from);
			return from.join(separator);
		},
		decode: (to) => {
			astr("join.decode", to);
			return to.split(separator);
		}
	};
}
/**
* Pad strings array so it has integer number of bits
* @__NO_SIDE_EFFECTS__
*/
function padding(bits, chr = "=") {
	anumber(bits);
	astr("padding", chr);
	return {
		encode(data) {
			astrArr("padding.encode", data);
			while (data.length * bits % 8) data.push(chr);
			return data;
		},
		decode(input) {
			astrArr("padding.decode", input);
			let end = input.length;
			if (end * bits % 8) throw new Error("padding: invalid, string should have whole number of bytes");
			for (; end > 0 && input[end - 1] === chr; end--) if ((end - 1) * bits % 8 === 0) throw new Error("padding: invalid, string has too much padding");
			return input.slice(0, end);
		}
	};
}
/**
* @__NO_SIDE_EFFECTS__
*/
function normalize(fn) {
	afn(fn);
	return {
		encode: (from) => from,
		decode: (to) => fn(to)
	};
}
const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
const radix2carry = /* @__NO_SIDE_EFFECTS__ */ (from, to) => from + (to - gcd(from, to));
const powers = /* @__PURE__ */ (() => {
	let res = [];
	for (let i = 0; i < 40; i++) res.push(2 ** i);
	return res;
})();
/**
* Implemented with numbers, because BigInt is 5x slower
*/
function convertRadix2(data, from, to, padding) {
	aArr(data);
	if (from <= 0 || from > 32) throw new Error(`convertRadix2: wrong from=${from}`);
	if (to <= 0 || to > 32) throw new Error(`convertRadix2: wrong to=${to}`);
	if (/* @__PURE__ */ radix2carry(from, to) > 32) throw new Error(`convertRadix2: carry overflow from=${from} to=${to} carryBits=${/* @__PURE__ */ radix2carry(from, to)}`);
	let carry = 0;
	let pos = 0;
	const max = powers[from];
	const mask = powers[to] - 1;
	const res = [];
	for (const n of data) {
		anumber(n);
		if (n >= max) throw new Error(`convertRadix2: invalid data word=${n} from=${from}`);
		carry = carry << from | n;
		if (pos + from > 32) throw new Error(`convertRadix2: carry overflow pos=${pos} from=${from}`);
		pos += from;
		for (; pos >= to; pos -= to) res.push((carry >> pos - to & mask) >>> 0);
		const pow = powers[pos];
		if (pow === void 0) throw new Error("invalid carry");
		carry &= pow - 1;
	}
	carry = carry << to - pos & mask;
	if (!padding && pos >= from) throw new Error("Excess padding");
	if (!padding && carry > 0) throw new Error(`Non-zero padding: ${carry}`);
	if (padding && pos > 0) res.push(carry >>> 0);
	return res;
}
/**
* If both bases are power of same number (like `2**8 <-> 2**64`),
* there is a linear algorithm. For now we have implementation for power-of-two bases only.
* @__NO_SIDE_EFFECTS__
*/
function radix2(bits, revPadding = false) {
	anumber(bits);
	if (bits <= 0 || bits > 32) throw new Error("radix2: bits should be in (0..32]");
	if (/* @__PURE__ */ radix2carry(8, bits) > 32 || /* @__PURE__ */ radix2carry(bits, 8) > 32) throw new Error("radix2: carry overflow");
	return {
		encode: (bytes) => {
			if (!isBytes(bytes)) throw new Error("radix2.encode input should be Uint8Array");
			return convertRadix2(Array.from(bytes), 8, bits, !revPadding);
		},
		decode: (digits) => {
			anumArr("radix2.decode", digits);
			return Uint8Array.from(convertRadix2(digits, bits, 8, revPadding));
		}
	};
}
function unsafeWrapper(fn) {
	afn(fn);
	return function(...args) {
		try {
			return fn.apply(null, args);
		} catch (e) {}
	};
}
chain(radix2(4), alphabet("0123456789ABCDEF"), join(""));
chain(radix2(5), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), padding(5), join(""));
chain(radix2(5), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), join(""));
chain(radix2(5), alphabet("0123456789ABCDEFGHIJKLMNOPQRSTUV"), padding(5), join(""));
chain(radix2(5), alphabet("0123456789ABCDEFGHIJKLMNOPQRSTUV"), join(""));
chain(radix2(5), alphabet("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), join(""), normalize((s) => s.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1")));
const hasBase64Builtin = /* @__PURE__ */ (() => typeof Uint8Array.from([]).toBase64 === "function" && typeof Uint8Array.fromBase64 === "function")();
const decodeBase64Builtin = (s, isUrl) => {
	astr("base64", s);
	const re = isUrl ? /^[A-Za-z0-9=_-]+$/ : /^[A-Za-z0-9=+/]+$/;
	const alphabet = isUrl ? "base64url" : "base64";
	if (s.length > 0 && !re.test(s)) throw new Error("invalid base64");
	return Uint8Array.fromBase64(s, {
		alphabet,
		lastChunkHandling: "strict"
	});
};
/**
* base64 from RFC 4648. Padded.
* Use `base64nopad` for unpadded version.
* Also check out `base64url`, `base64urlnopad`.
* Falls back to built-in function, when available.
* @example
* ```js
* base64.encode(Uint8Array.from([0x12, 0xab]));
* // => 'Eqs='
* base64.decode('Eqs=');
* // => Uint8Array.from([0x12, 0xab])
* ```
*/
const base64 = hasBase64Builtin ? {
	encode(b) {
		abytes(b);
		return b.toBase64();
	},
	decode(s) {
		return decodeBase64Builtin(s, false);
	}
} : chain(radix2(6), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), padding(6), join(""));
chain(radix2(6), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), join(""));
hasBase64Builtin || chain(radix2(6), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), padding(6), join(""));
chain(radix2(6), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), join(""));
const BECH_ALPHABET = chain(alphabet("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), join(""));
const POLYMOD_GENERATORS = [
	996825010,
	642813549,
	513874426,
	1027748829,
	705979059
];
function bech32Polymod(pre) {
	const b = pre >> 25;
	let chk = (pre & 33554431) << 5;
	for (let i = 0; i < POLYMOD_GENERATORS.length; i++) if ((b >> i & 1) === 1) chk ^= POLYMOD_GENERATORS[i];
	return chk;
}
function bechChecksum(prefix, words, encodingConst = 1) {
	const len = prefix.length;
	let chk = 1;
	for (let i = 0; i < len; i++) {
		const c = prefix.charCodeAt(i);
		if (c < 33 || c > 126) throw new Error(`Invalid prefix (${prefix})`);
		chk = bech32Polymod(chk) ^ c >> 5;
	}
	chk = bech32Polymod(chk);
	for (let i = 0; i < len; i++) chk = bech32Polymod(chk) ^ prefix.charCodeAt(i) & 31;
	for (let v of words) chk = bech32Polymod(chk) ^ v;
	for (let i = 0; i < 6; i++) chk = bech32Polymod(chk);
	chk ^= encodingConst;
	return BECH_ALPHABET.encode(convertRadix2([chk % powers[30]], 30, 5, false));
}
/**
* @__NO_SIDE_EFFECTS__
*/
function genBech32(encoding) {
	const ENCODING_CONST = encoding === "bech32" ? 1 : 734539939;
	const _words = radix2(5);
	const fromWords = _words.decode;
	const toWords = _words.encode;
	const fromWordsUnsafe = unsafeWrapper(fromWords);
	function encode(prefix, words, limit = 90) {
		astr("bech32.encode prefix", prefix);
		if (isBytes(words)) words = Array.from(words);
		anumArr("bech32.encode", words);
		const plen = prefix.length;
		if (plen === 0) throw new TypeError(`Invalid prefix length ${plen}`);
		const actualLength = plen + 7 + words.length;
		if (limit !== false && actualLength > limit) throw new TypeError(`Length ${actualLength} exceeds limit ${limit}`);
		const lowered = prefix.toLowerCase();
		const sum = bechChecksum(lowered, words, ENCODING_CONST);
		return `${lowered}1${BECH_ALPHABET.encode(words)}${sum}`;
	}
	function decode(str, limit = 90) {
		astr("bech32.decode input", str);
		const slen = str.length;
		if (slen < 8 || limit !== false && slen > limit) throw new TypeError(`invalid string length: ${slen} (${str}). Expected (8..${limit})`);
		const lowered = str.toLowerCase();
		if (str !== lowered && str !== str.toUpperCase()) throw new Error(`String must be lowercase or uppercase`);
		const sepIndex = lowered.lastIndexOf("1");
		if (sepIndex === 0 || sepIndex === -1) throw new Error(`Letter "1" must be present between prefix and data only`);
		const prefix = lowered.slice(0, sepIndex);
		const data = lowered.slice(sepIndex + 1);
		if (data.length < 6) throw new Error("Data must be at least 6 characters long");
		const words = BECH_ALPHABET.decode(data).slice(0, -6);
		const sum = bechChecksum(prefix, words, ENCODING_CONST);
		if (!data.endsWith(sum)) throw new Error(`Invalid checksum in ${str}: expected "${sum}"`);
		return {
			prefix,
			words
		};
	}
	const decodeUnsafe = unsafeWrapper(decode);
	function decodeToBytes(str) {
		const { prefix, words } = decode(str, false);
		return {
			prefix,
			words,
			bytes: fromWords(words)
		};
	}
	function encodeFromBytes(prefix, bytes) {
		return encode(prefix, toWords(bytes));
	}
	return {
		encode,
		decode,
		encodeFromBytes,
		decodeToBytes,
		decodeUnsafe,
		fromWords,
		fromWordsUnsafe,
		toWords
	};
}
/**
* bech32 from BIP 173. Operates on words.
* For high-level, check out scure-btc-signer:
* https://github.com/paulmillr/scure-btc-signer.
*/
const bech32 = genBech32("bech32");
genBech32("bech32m");
/* @__PURE__ */ (() => typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function")() || chain(radix2(4), alphabet("0123456789abcdef"), join(""), normalize((s) => {
	if (typeof s !== "string" || s.length % 2 !== 0) throw new TypeError(`hex.decode: expected string, got ${typeof s} with length ${s.length}`);
	return s.toLowerCase();
}));
//#endregion
export { ahash as a, bytesToHex as c, createHasher as d, createView as f, rotr as g, randomBytes as h, aexists as i, clean as l, oidNist as m, bech32 as n, anumber$1 as o, hexToBytes as p, abytes$1 as r, aoutput as s, base64 as t, concatBytes as u };
