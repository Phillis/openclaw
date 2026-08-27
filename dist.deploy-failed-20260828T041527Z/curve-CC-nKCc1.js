//#region node_modules/@noble/curves/node_modules/@noble/hashes/utils.js
/**
* Utilities for hex, bytes, CSPRNG.
* @module
*/
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
/** Checks if something is Uint8Array. Be careful: nodejs Buffer will return true. */
function isBytes(a) {
	return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
/** Asserts something is positive integer. */
function anumber(n, title = "") {
	if (!Number.isSafeInteger(n) || n < 0) {
		const prefix = title && `"${title}" `;
		throw new Error(`${prefix}expected integer >= 0, got ${n}`);
	}
}
/** Asserts something is Uint8Array. */
function abytes(value, length, title = "") {
	const bytes = isBytes(value);
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
	anumber(h.outputLen);
	anumber(h.blockLen);
}
/** Asserts a hash instance has not been destroyed / finished */
function aexists(instance, checkFinished = true) {
	if (instance.destroyed) throw new Error("Hash instance has been destroyed");
	if (checkFinished && instance.finished) throw new Error("Hash#digest() has already been called");
}
/** Asserts output is properly-sized byte array */
function aoutput(out, instance) {
	abytes(out, void 0, "digestInto() output");
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
const hasHexBuiltin = /* @__PURE__ */ (() => typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function")();
const hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
/**
* Convert byte array to hex string. Uses built-in function, when available.
* @example bytesToHex(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])) // 'cafe0123'
*/
function bytesToHex(bytes) {
	abytes(bytes);
	if (hasHexBuiltin) return bytes.toHex();
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
	if (hasHexBuiltin) return Uint8Array.fromHex(hex);
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
		abytes(a);
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
//#region node_modules/@noble/curves/node_modules/@noble/hashes/_md.js
/**
* Internal Merkle-Damgard hash utils.
* @module
*/
/** Choice: a ? b : c */
function Chi(a, b, c) {
	return a & b ^ ~a & c;
}
/** Majority function, true if any two inputs is true. */
function Maj(a, b, c) {
	return a & b ^ a & c ^ b & c;
}
/**
* Merkle-Damgard hash construction base class.
* Could be used to create MD5, RIPEMD, SHA1, SHA2.
*/
var HashMD = class {
	blockLen;
	outputLen;
	padOffset;
	isLE;
	buffer;
	view;
	finished = false;
	length = 0;
	pos = 0;
	destroyed = false;
	constructor(blockLen, outputLen, padOffset, isLE) {
		this.blockLen = blockLen;
		this.outputLen = outputLen;
		this.padOffset = padOffset;
		this.isLE = isLE;
		this.buffer = new Uint8Array(blockLen);
		this.view = createView(this.buffer);
	}
	update(data) {
		aexists(this);
		abytes(data);
		const { view, buffer, blockLen } = this;
		const len = data.length;
		for (let pos = 0; pos < len;) {
			const take = Math.min(blockLen - this.pos, len - pos);
			if (take === blockLen) {
				const dataView = createView(data);
				for (; blockLen <= len - pos; pos += blockLen) this.process(dataView, pos);
				continue;
			}
			buffer.set(data.subarray(pos, pos + take), this.pos);
			this.pos += take;
			pos += take;
			if (this.pos === blockLen) {
				this.process(view, 0);
				this.pos = 0;
			}
		}
		this.length += data.length;
		this.roundClean();
		return this;
	}
	digestInto(out) {
		aexists(this);
		aoutput(out, this);
		this.finished = true;
		const { buffer, view, blockLen, isLE } = this;
		let { pos } = this;
		buffer[pos++] = 128;
		clean(this.buffer.subarray(pos));
		if (this.padOffset > blockLen - pos) {
			this.process(view, 0);
			pos = 0;
		}
		for (let i = pos; i < blockLen; i++) buffer[i] = 0;
		view.setBigUint64(blockLen - 8, BigInt(this.length * 8), isLE);
		this.process(view, 0);
		const oview = createView(out);
		const len = this.outputLen;
		if (len % 4) throw new Error("_sha2: outputLen must be aligned to 32bit");
		const outLen = len / 4;
		const state = this.get();
		if (outLen > state.length) throw new Error("_sha2: outputLen bigger than state");
		for (let i = 0; i < outLen; i++) oview.setUint32(4 * i, state[i], isLE);
	}
	digest() {
		const { buffer, outputLen } = this;
		this.digestInto(buffer);
		const res = buffer.slice(0, outputLen);
		this.destroy();
		return res;
	}
	_cloneInto(to) {
		to ||= new this.constructor();
		to.set(...this.get());
		const { blockLen, buffer, length, finished, destroyed, pos } = this;
		to.destroyed = destroyed;
		to.finished = finished;
		to.length = length;
		to.pos = pos;
		if (length % blockLen) to.buffer.set(buffer);
		return to;
	}
	clone() {
		return this._cloneInto();
	}
};
/**
* Initial SHA-2 state: fractional parts of square roots of first 16 primes 2..53.
* Check out `test/misc/sha2-gen-iv.js` for recomputation guide.
*/
/** Initial SHA256 state. Bits 0..32 of frac part of sqrt of primes 2..19 */
const SHA256_IV = /* @__PURE__ */ Uint32Array.from([
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
]);
/** Initial SHA512 state. Bits 0..64 of frac part of sqrt of primes 2..19 */
const SHA512_IV = /* @__PURE__ */ Uint32Array.from([
	1779033703,
	4089235720,
	3144134277,
	2227873595,
	1013904242,
	4271175723,
	2773480762,
	1595750129,
	1359893119,
	2917565137,
	2600822924,
	725511199,
	528734635,
	4215389547,
	1541459225,
	327033209
]);
//#endregion
//#region node_modules/@noble/curves/node_modules/@noble/hashes/_u64.js
/**
* Internal helpers for u64. BigUint64Array is too slow as per 2025, so we implement it using Uint32Array.
* @todo re-check https://issues.chromium.org/issues/42212588
* @module
*/
const U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
const _32n = /* @__PURE__ */ BigInt(32);
function fromBig(n, le = false) {
	if (le) return {
		h: Number(n & U32_MASK64),
		l: Number(n >> _32n & U32_MASK64)
	};
	return {
		h: Number(n >> _32n & U32_MASK64) | 0,
		l: Number(n & U32_MASK64) | 0
	};
}
function split(lst, le = false) {
	const len = lst.length;
	let Ah = new Uint32Array(len);
	let Al = new Uint32Array(len);
	for (let i = 0; i < len; i++) {
		const { h, l } = fromBig(lst[i], le);
		[Ah[i], Al[i]] = [h, l];
	}
	return [Ah, Al];
}
const shrSH = (h, _l, s) => h >>> s;
const shrSL = (h, l, s) => h << 32 - s | l >>> s;
const rotrSH = (h, l, s) => h >>> s | l << 32 - s;
const rotrSL = (h, l, s) => h << 32 - s | l >>> s;
const rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
const rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
function add(Ah, Al, Bh, Bl) {
	const l = (Al >>> 0) + (Bl >>> 0);
	return {
		h: Ah + Bh + (l / 2 ** 32 | 0) | 0,
		l: l | 0
	};
}
const add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
const add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
const add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
const add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
const add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
const add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
//#endregion
//#region node_modules/@noble/curves/node_modules/@noble/hashes/sha2.js
/**
* SHA2 hash function. A.k.a. sha256, sha384, sha512, sha512_224, sha512_256.
* SHA256 is the fastest hash implementable in JS, even faster than Blake3.
* Check out [RFC 4634](https://www.rfc-editor.org/rfc/rfc4634) and
* [FIPS 180-4](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf).
* @module
*/
/**
* Round constants:
* First 32 bits of fractional parts of the cube roots of the first 64 primes 2..311)
*/
const SHA256_K = /* @__PURE__ */ Uint32Array.from([
	1116352408,
	1899447441,
	3049323471,
	3921009573,
	961987163,
	1508970993,
	2453635748,
	2870763221,
	3624381080,
	310598401,
	607225278,
	1426881987,
	1925078388,
	2162078206,
	2614888103,
	3248222580,
	3835390401,
	4022224774,
	264347078,
	604807628,
	770255983,
	1249150122,
	1555081692,
	1996064986,
	2554220882,
	2821834349,
	2952996808,
	3210313671,
	3336571891,
	3584528711,
	113926993,
	338241895,
	666307205,
	773529912,
	1294757372,
	1396182291,
	1695183700,
	1986661051,
	2177026350,
	2456956037,
	2730485921,
	2820302411,
	3259730800,
	3345764771,
	3516065817,
	3600352804,
	4094571909,
	275423344,
	430227734,
	506948616,
	659060556,
	883997877,
	958139571,
	1322822218,
	1537002063,
	1747873779,
	1955562222,
	2024104815,
	2227730452,
	2361852424,
	2428436474,
	2756734187,
	3204031479,
	3329325298
]);
/** Reusable temporary buffer. "W" comes straight from spec. */
const SHA256_W = /* @__PURE__ */ new Uint32Array(64);
/** Internal 32-byte base SHA2 hash class. */
var SHA2_32B = class extends HashMD {
	constructor(outputLen) {
		super(64, outputLen, 8, false);
	}
	get() {
		const { A, B, C, D, E, F, G, H } = this;
		return [
			A,
			B,
			C,
			D,
			E,
			F,
			G,
			H
		];
	}
	set(A, B, C, D, E, F, G, H) {
		this.A = A | 0;
		this.B = B | 0;
		this.C = C | 0;
		this.D = D | 0;
		this.E = E | 0;
		this.F = F | 0;
		this.G = G | 0;
		this.H = H | 0;
	}
	process(view, offset) {
		for (let i = 0; i < 16; i++, offset += 4) SHA256_W[i] = view.getUint32(offset, false);
		for (let i = 16; i < 64; i++) {
			const W15 = SHA256_W[i - 15];
			const W2 = SHA256_W[i - 2];
			const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
			const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
			SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
		}
		let { A, B, C, D, E, F, G, H } = this;
		for (let i = 0; i < 64; i++) {
			const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
			const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
			const T2 = (rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22)) + Maj(A, B, C) | 0;
			H = G;
			G = F;
			F = E;
			E = D + T1 | 0;
			D = C;
			C = B;
			B = A;
			A = T1 + T2 | 0;
		}
		A = A + this.A | 0;
		B = B + this.B | 0;
		C = C + this.C | 0;
		D = D + this.D | 0;
		E = E + this.E | 0;
		F = F + this.F | 0;
		G = G + this.G | 0;
		H = H + this.H | 0;
		this.set(A, B, C, D, E, F, G, H);
	}
	roundClean() {
		clean(SHA256_W);
	}
	destroy() {
		this.set(0, 0, 0, 0, 0, 0, 0, 0);
		clean(this.buffer);
	}
};
/** Internal SHA2-256 hash class. */
var _SHA256 = class extends SHA2_32B {
	A = SHA256_IV[0] | 0;
	B = SHA256_IV[1] | 0;
	C = SHA256_IV[2] | 0;
	D = SHA256_IV[3] | 0;
	E = SHA256_IV[4] | 0;
	F = SHA256_IV[5] | 0;
	G = SHA256_IV[6] | 0;
	H = SHA256_IV[7] | 0;
	constructor() {
		super(32);
	}
};
const K512 = /* @__PURE__ */ (() => split([
	"0x428a2f98d728ae22",
	"0x7137449123ef65cd",
	"0xb5c0fbcfec4d3b2f",
	"0xe9b5dba58189dbbc",
	"0x3956c25bf348b538",
	"0x59f111f1b605d019",
	"0x923f82a4af194f9b",
	"0xab1c5ed5da6d8118",
	"0xd807aa98a3030242",
	"0x12835b0145706fbe",
	"0x243185be4ee4b28c",
	"0x550c7dc3d5ffb4e2",
	"0x72be5d74f27b896f",
	"0x80deb1fe3b1696b1",
	"0x9bdc06a725c71235",
	"0xc19bf174cf692694",
	"0xe49b69c19ef14ad2",
	"0xefbe4786384f25e3",
	"0x0fc19dc68b8cd5b5",
	"0x240ca1cc77ac9c65",
	"0x2de92c6f592b0275",
	"0x4a7484aa6ea6e483",
	"0x5cb0a9dcbd41fbd4",
	"0x76f988da831153b5",
	"0x983e5152ee66dfab",
	"0xa831c66d2db43210",
	"0xb00327c898fb213f",
	"0xbf597fc7beef0ee4",
	"0xc6e00bf33da88fc2",
	"0xd5a79147930aa725",
	"0x06ca6351e003826f",
	"0x142929670a0e6e70",
	"0x27b70a8546d22ffc",
	"0x2e1b21385c26c926",
	"0x4d2c6dfc5ac42aed",
	"0x53380d139d95b3df",
	"0x650a73548baf63de",
	"0x766a0abb3c77b2a8",
	"0x81c2c92e47edaee6",
	"0x92722c851482353b",
	"0xa2bfe8a14cf10364",
	"0xa81a664bbc423001",
	"0xc24b8b70d0f89791",
	"0xc76c51a30654be30",
	"0xd192e819d6ef5218",
	"0xd69906245565a910",
	"0xf40e35855771202a",
	"0x106aa07032bbd1b8",
	"0x19a4c116b8d2d0c8",
	"0x1e376c085141ab53",
	"0x2748774cdf8eeb99",
	"0x34b0bcb5e19b48a8",
	"0x391c0cb3c5c95a63",
	"0x4ed8aa4ae3418acb",
	"0x5b9cca4f7763e373",
	"0x682e6ff3d6b2b8a3",
	"0x748f82ee5defb2fc",
	"0x78a5636f43172f60",
	"0x84c87814a1f0ab72",
	"0x8cc702081a6439ec",
	"0x90befffa23631e28",
	"0xa4506cebde82bde9",
	"0xbef9a3f7b2c67915",
	"0xc67178f2e372532b",
	"0xca273eceea26619c",
	"0xd186b8c721c0c207",
	"0xeada7dd6cde0eb1e",
	"0xf57d4f7fee6ed178",
	"0x06f067aa72176fba",
	"0x0a637dc5a2c898a6",
	"0x113f9804bef90dae",
	"0x1b710b35131c471b",
	"0x28db77f523047d84",
	"0x32caab7b40c72493",
	"0x3c9ebe0a15c9bebc",
	"0x431d67c49c100d4c",
	"0x4cc5d4becb3e42b6",
	"0x597f299cfc657e2a",
	"0x5fcb6fab3ad6faec",
	"0x6c44198c4a475817"
].map((n) => BigInt(n))))();
const SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
const SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
const SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
const SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
/** Internal 64-byte base SHA2 hash class. */
var SHA2_64B = class extends HashMD {
	constructor(outputLen) {
		super(128, outputLen, 16, false);
	}
	get() {
		const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
		return [
			Ah,
			Al,
			Bh,
			Bl,
			Ch,
			Cl,
			Dh,
			Dl,
			Eh,
			El,
			Fh,
			Fl,
			Gh,
			Gl,
			Hh,
			Hl
		];
	}
	set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
		this.Ah = Ah | 0;
		this.Al = Al | 0;
		this.Bh = Bh | 0;
		this.Bl = Bl | 0;
		this.Ch = Ch | 0;
		this.Cl = Cl | 0;
		this.Dh = Dh | 0;
		this.Dl = Dl | 0;
		this.Eh = Eh | 0;
		this.El = El | 0;
		this.Fh = Fh | 0;
		this.Fl = Fl | 0;
		this.Gh = Gh | 0;
		this.Gl = Gl | 0;
		this.Hh = Hh | 0;
		this.Hl = Hl | 0;
	}
	process(view, offset) {
		for (let i = 0; i < 16; i++, offset += 4) {
			SHA512_W_H[i] = view.getUint32(offset);
			SHA512_W_L[i] = view.getUint32(offset += 4);
		}
		for (let i = 16; i < 80; i++) {
			const W15h = SHA512_W_H[i - 15] | 0;
			const W15l = SHA512_W_L[i - 15] | 0;
			const s0h = rotrSH(W15h, W15l, 1) ^ rotrSH(W15h, W15l, 8) ^ shrSH(W15h, W15l, 7);
			const s0l = rotrSL(W15h, W15l, 1) ^ rotrSL(W15h, W15l, 8) ^ shrSL(W15h, W15l, 7);
			const W2h = SHA512_W_H[i - 2] | 0;
			const W2l = SHA512_W_L[i - 2] | 0;
			const s1h = rotrSH(W2h, W2l, 19) ^ rotrBH(W2h, W2l, 61) ^ shrSH(W2h, W2l, 6);
			const s1l = rotrSL(W2h, W2l, 19) ^ rotrBL(W2h, W2l, 61) ^ shrSL(W2h, W2l, 6);
			const SUMl = add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
			const SUMh = add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
			SHA512_W_H[i] = SUMh | 0;
			SHA512_W_L[i] = SUMl | 0;
		}
		let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
		for (let i = 0; i < 80; i++) {
			const sigma1h = rotrSH(Eh, El, 14) ^ rotrSH(Eh, El, 18) ^ rotrBH(Eh, El, 41);
			const sigma1l = rotrSL(Eh, El, 14) ^ rotrSL(Eh, El, 18) ^ rotrBL(Eh, El, 41);
			const CHIh = Eh & Fh ^ ~Eh & Gh;
			const CHIl = El & Fl ^ ~El & Gl;
			const T1ll = add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
			const T1h = add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
			const T1l = T1ll | 0;
			const sigma0h = rotrSH(Ah, Al, 28) ^ rotrBH(Ah, Al, 34) ^ rotrBH(Ah, Al, 39);
			const sigma0l = rotrSL(Ah, Al, 28) ^ rotrBL(Ah, Al, 34) ^ rotrBL(Ah, Al, 39);
			const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
			const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
			Hh = Gh | 0;
			Hl = Gl | 0;
			Gh = Fh | 0;
			Gl = Fl | 0;
			Fh = Eh | 0;
			Fl = El | 0;
			({h: Eh, l: El} = add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
			Dh = Ch | 0;
			Dl = Cl | 0;
			Ch = Bh | 0;
			Cl = Bl | 0;
			Bh = Ah | 0;
			Bl = Al | 0;
			const All = add3L(T1l, sigma0l, MAJl);
			Ah = add3H(All, T1h, sigma0h, MAJh);
			Al = All | 0;
		}
		({h: Ah, l: Al} = add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
		({h: Bh, l: Bl} = add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
		({h: Ch, l: Cl} = add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
		({h: Dh, l: Dl} = add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
		({h: Eh, l: El} = add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
		({h: Fh, l: Fl} = add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
		({h: Gh, l: Gl} = add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
		({h: Hh, l: Hl} = add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
		this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
	}
	roundClean() {
		clean(SHA512_W_H, SHA512_W_L);
	}
	destroy() {
		clean(this.buffer);
		this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
	}
};
/** Internal SHA2-512 hash class. */
var _SHA512 = class extends SHA2_64B {
	Ah = SHA512_IV[0] | 0;
	Al = SHA512_IV[1] | 0;
	Bh = SHA512_IV[2] | 0;
	Bl = SHA512_IV[3] | 0;
	Ch = SHA512_IV[4] | 0;
	Cl = SHA512_IV[5] | 0;
	Dh = SHA512_IV[6] | 0;
	Dl = SHA512_IV[7] | 0;
	Eh = SHA512_IV[8] | 0;
	El = SHA512_IV[9] | 0;
	Fh = SHA512_IV[10] | 0;
	Fl = SHA512_IV[11] | 0;
	Gh = SHA512_IV[12] | 0;
	Gl = SHA512_IV[13] | 0;
	Hh = SHA512_IV[14] | 0;
	Hl = SHA512_IV[15] | 0;
	constructor() {
		super(64);
	}
};
/**
* SHA2-256 hash function from RFC 4634. In JS it's the fastest: even faster than Blake3. Some info:
*
* - Trying 2^128 hashes would get 50% chance of collision, using birthday attack.
* - BTC network is doing 2^70 hashes/sec (2^95 hashes/year) as per 2025.
* - Each sha256 hash is executing 2^18 bit operations.
* - Good 2024 ASICs can do 200Th/sec with 3500 watts of power, corresponding to 2^36 hashes/joule.
*/
const sha256 = /* @__PURE__ */ createHasher(() => new _SHA256(), /* @__PURE__ */ oidNist(1));
/** SHA2-512 hash function from RFC 4634. */
const sha512 = /* @__PURE__ */ createHasher(() => new _SHA512(), /* @__PURE__ */ oidNist(3));
//#endregion
//#region node_modules/@noble/curves/utils.js
/**
* Hex, bytes and number utilities.
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _0n$2 = /* @__PURE__ */ BigInt(0);
const _1n$2 = /* @__PURE__ */ BigInt(1);
function abool(value, title = "") {
	if (typeof value !== "boolean") {
		const prefix = title && `"${title}" `;
		throw new Error(prefix + "expected boolean, got type=" + typeof value);
	}
	return value;
}
function abignumber(n) {
	if (typeof n === "bigint") {
		if (!isPosBig(n)) throw new Error("positive bigint expected, got " + n);
	} else anumber(n);
	return n;
}
function numberToHexUnpadded(num) {
	const hex = abignumber(num).toString(16);
	return hex.length & 1 ? "0" + hex : hex;
}
function hexToNumber(hex) {
	if (typeof hex !== "string") throw new Error("hex string expected, got " + typeof hex);
	return hex === "" ? _0n$2 : BigInt("0x" + hex);
}
function bytesToNumberBE(bytes) {
	return hexToNumber(bytesToHex(bytes));
}
function bytesToNumberLE(bytes) {
	return hexToNumber(bytesToHex(copyBytes(abytes(bytes)).reverse()));
}
function numberToBytesBE(n, len) {
	anumber(len);
	n = abignumber(n);
	const res = hexToBytes(n.toString(16).padStart(len * 2, "0"));
	if (res.length !== len) throw new Error("number too large");
	return res;
}
function numberToBytesLE(n, len) {
	return numberToBytesBE(n, len).reverse();
}
/**
* Copies Uint8Array. We can't use u8a.slice(), because u8a can be Buffer,
* and Buffer#slice creates mutable copy. Never use Buffers!
*/
function copyBytes(bytes) {
	return Uint8Array.from(bytes);
}
/**
* Decodes 7-bit ASCII string to Uint8Array, throws on non-ascii symbols
* Should be safe to use for things expected to be ASCII.
* Returns exact same result as `TextEncoder` for ASCII or throws.
*/
function asciiToBytes(ascii) {
	return Uint8Array.from(ascii, (c, i) => {
		const charCode = c.charCodeAt(0);
		if (c.length !== 1 || charCode > 127) throw new Error(`string contains non-ASCII character "${ascii[i]}" with code ${charCode} at position ${i}`);
		return charCode;
	});
}
const isPosBig = (n) => typeof n === "bigint" && _0n$2 <= n;
function inRange(n, min, max) {
	return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
}
/**
* Asserts min <= n < max. NOTE: It's < max and not <= max.
* @example
* aInRange('x', x, 1n, 256n); // would assume x is in (1n..255n)
*/
function aInRange(title, n, min, max) {
	if (!inRange(n, min, max)) throw new Error("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
}
/**
* Calculates amount of bits in a bigint.
* Same as `n.toString(2).length`
* TODO: merge with nLength in modular
*/
function bitLen(n) {
	let len;
	for (len = 0; n > _0n$2; n >>= _1n$2, len += 1);
	return len;
}
/**
* Calculate mask for N bits. Not using ** operator with bigints because of old engines.
* Same as BigInt(`0b${Array(i).fill('1').join('')}`)
*/
const bitMask = (n) => (_1n$2 << BigInt(n)) - _1n$2;
/**
* Minimal HMAC-DRBG from NIST 800-90 for RFC6979 sigs.
* @returns function that will call DRBG until 2nd arg returns something meaningful
* @example
*   const drbg = createHmacDRBG<Key>(32, 32, hmac);
*   drbg(seed, bytesToKey); // bytesToKey must return Key or undefined
*/
function createHmacDrbg(hashLen, qByteLen, hmacFn) {
	anumber(hashLen, "hashLen");
	anumber(qByteLen, "qByteLen");
	if (typeof hmacFn !== "function") throw new Error("hmacFn must be a function");
	const u8n = (len) => new Uint8Array(len);
	const NULL = Uint8Array.of();
	const byte0 = Uint8Array.of(0);
	const byte1 = Uint8Array.of(1);
	const _maxDrbgIters = 1e3;
	let v = u8n(hashLen);
	let k = u8n(hashLen);
	let i = 0;
	const reset = () => {
		v.fill(1);
		k.fill(0);
		i = 0;
	};
	const h = (...msgs) => hmacFn(k, concatBytes(v, ...msgs));
	const reseed = (seed = NULL) => {
		k = h(byte0, seed);
		v = h();
		if (seed.length === 0) return;
		k = h(byte1, seed);
		v = h();
	};
	const gen = () => {
		if (i++ >= _maxDrbgIters) throw new Error("drbg: tried max amount of iterations");
		let len = 0;
		const out = [];
		while (len < qByteLen) {
			v = h();
			const sl = v.slice();
			out.push(sl);
			len += v.length;
		}
		return concatBytes(...out);
	};
	const genUntil = (seed, pred) => {
		reset();
		reseed(seed);
		let res = void 0;
		while (!(res = pred(gen()))) reseed();
		reset();
		return res;
	};
	return genUntil;
}
function validateObject(object, fields = {}, optFields = {}) {
	if (!object || typeof object !== "object") throw new Error("expected valid options object");
	function checkField(fieldName, expectedType, isOpt) {
		const val = object[fieldName];
		if (isOpt && val === void 0) return;
		const current = typeof val;
		if (current !== expectedType || val === null) throw new Error(`param "${fieldName}" is invalid: expected ${expectedType}, got ${current}`);
	}
	const iter = (f, isOpt) => Object.entries(f).forEach(([k, v]) => checkField(k, v, isOpt));
	iter(fields, false);
	iter(optFields, true);
}
/**
* Memoizes (caches) computation result.
* Uses WeakMap: the value is going auto-cleaned by GC after last reference is removed.
*/
function memoized(fn) {
	const map = /* @__PURE__ */ new WeakMap();
	return (arg, ...args) => {
		const val = map.get(arg);
		if (val !== void 0) return val;
		const computed = fn(arg, ...args);
		map.set(arg, computed);
		return computed;
	};
}
//#endregion
//#region node_modules/@noble/curves/abstract/modular.js
/**
* Utils for modular division and fields.
* Field over 11 is a finite (Galois) field is integer number operations `mod 11`.
* There is no division: it is replaced by modular multiplicative inverse.
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _0n$1 = /* @__PURE__ */ BigInt(0);
const _1n$1 = /* @__PURE__ */ BigInt(1);
const _2n = /* @__PURE__ */ BigInt(2);
const _3n = /* @__PURE__ */ BigInt(3);
const _4n = /* @__PURE__ */ BigInt(4);
const _5n = /* @__PURE__ */ BigInt(5);
const _7n = /* @__PURE__ */ BigInt(7);
const _8n = /* @__PURE__ */ BigInt(8);
const _9n = /* @__PURE__ */ BigInt(9);
const _16n = /* @__PURE__ */ BigInt(16);
function mod(a, b) {
	const result = a % b;
	return result >= _0n$1 ? result : b + result;
}
/** Does `x^(2^power)` mod p. `pow2(30, 4)` == `30^(2^4)` */
function pow2(x, power, modulo) {
	let res = x;
	while (power-- > _0n$1) {
		res *= res;
		res %= modulo;
	}
	return res;
}
/**
* Inverses number over modulo.
* Implemented using [Euclidean GCD](https://brilliant.org/wiki/extended-euclidean-algorithm/).
*/
function invert(number, modulo) {
	if (number === _0n$1) throw new Error("invert: expected non-zero number");
	if (modulo <= _0n$1) throw new Error("invert: expected positive modulus, got " + modulo);
	let a = mod(number, modulo);
	let b = modulo;
	let x = _0n$1, y = _1n$1, u = _1n$1, v = _0n$1;
	while (a !== _0n$1) {
		const q = b / a;
		const r = b % a;
		const m = x - u * q;
		const n = y - v * q;
		b = a, a = r, x = u, y = v, u = m, v = n;
	}
	if (b !== _1n$1) throw new Error("invert: does not exist");
	return mod(x, modulo);
}
function assertIsSquare(Fp, root, n) {
	if (!Fp.eql(Fp.sqr(root), n)) throw new Error("Cannot find square root");
}
function sqrt3mod4(Fp, n) {
	const p1div4 = (Fp.ORDER + _1n$1) / _4n;
	const root = Fp.pow(n, p1div4);
	assertIsSquare(Fp, root, n);
	return root;
}
function sqrt5mod8(Fp, n) {
	const p5div8 = (Fp.ORDER - _5n) / _8n;
	const n2 = Fp.mul(n, _2n);
	const v = Fp.pow(n2, p5div8);
	const nv = Fp.mul(n, v);
	const i = Fp.mul(Fp.mul(nv, _2n), v);
	const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
	assertIsSquare(Fp, root, n);
	return root;
}
function sqrt9mod16(P) {
	const Fp_ = Field(P);
	const tn = tonelliShanks(P);
	const c1 = tn(Fp_, Fp_.neg(Fp_.ONE));
	const c2 = tn(Fp_, c1);
	const c3 = tn(Fp_, Fp_.neg(c1));
	const c4 = (P + _7n) / _16n;
	return (Fp, n) => {
		let tv1 = Fp.pow(n, c4);
		let tv2 = Fp.mul(tv1, c1);
		const tv3 = Fp.mul(tv1, c2);
		const tv4 = Fp.mul(tv1, c3);
		const e1 = Fp.eql(Fp.sqr(tv2), n);
		const e2 = Fp.eql(Fp.sqr(tv3), n);
		tv1 = Fp.cmov(tv1, tv2, e1);
		tv2 = Fp.cmov(tv4, tv3, e2);
		const e3 = Fp.eql(Fp.sqr(tv2), n);
		const root = Fp.cmov(tv1, tv2, e3);
		assertIsSquare(Fp, root, n);
		return root;
	};
}
/**
* Tonelli-Shanks square root search algorithm.
* 1. https://eprint.iacr.org/2012/685.pdf (page 12)
* 2. Square Roots from 1; 24, 51, 10 to Dan Shanks
* @param P field order
* @returns function that takes field Fp (created from P) and number n
*/
function tonelliShanks(P) {
	if (P < _3n) throw new Error("sqrt is not defined for small field");
	let Q = P - _1n$1;
	let S = 0;
	while (Q % _2n === _0n$1) {
		Q /= _2n;
		S++;
	}
	let Z = _2n;
	const _Fp = Field(P);
	while (FpLegendre(_Fp, Z) === 1) if (Z++ > 1e3) throw new Error("Cannot find square root: probably non-prime P");
	if (S === 1) return sqrt3mod4;
	let cc = _Fp.pow(Z, Q);
	const Q1div2 = (Q + _1n$1) / _2n;
	return function tonelliSlow(Fp, n) {
		if (Fp.is0(n)) return n;
		if (FpLegendre(Fp, n) !== 1) throw new Error("Cannot find square root");
		let M = S;
		let c = Fp.mul(Fp.ONE, cc);
		let t = Fp.pow(n, Q);
		let R = Fp.pow(n, Q1div2);
		while (!Fp.eql(t, Fp.ONE)) {
			if (Fp.is0(t)) return Fp.ZERO;
			let i = 1;
			let t_tmp = Fp.sqr(t);
			while (!Fp.eql(t_tmp, Fp.ONE)) {
				i++;
				t_tmp = Fp.sqr(t_tmp);
				if (i === M) throw new Error("Cannot find square root");
			}
			const exponent = _1n$1 << BigInt(M - i - 1);
			const b = Fp.pow(c, exponent);
			M = i;
			c = Fp.sqr(b);
			t = Fp.mul(t, c);
			R = Fp.mul(R, b);
		}
		return R;
	};
}
/**
* Square root for a finite field. Will try optimized versions first:
*
* 1. P ≡ 3 (mod 4)
* 2. P ≡ 5 (mod 8)
* 3. P ≡ 9 (mod 16)
* 4. Tonelli-Shanks algorithm
*
* Different algorithms can give different roots, it is up to user to decide which one they want.
* For example there is FpSqrtOdd/FpSqrtEven to choice root based on oddness (used for hash-to-curve).
*/
function FpSqrt(P) {
	if (P % _4n === _3n) return sqrt3mod4;
	if (P % _8n === _5n) return sqrt5mod8;
	if (P % _16n === _9n) return sqrt9mod16(P);
	return tonelliShanks(P);
}
const isNegativeLE = (num, modulo) => (mod(num, modulo) & _1n$1) === _1n$1;
const FIELD_FIELDS = [
	"create",
	"isValid",
	"is0",
	"neg",
	"inv",
	"sqrt",
	"sqr",
	"eql",
	"add",
	"sub",
	"mul",
	"pow",
	"div",
	"addN",
	"subN",
	"mulN",
	"sqrN"
];
function validateField(field) {
	validateObject(field, FIELD_FIELDS.reduce((map, val) => {
		map[val] = "function";
		return map;
	}, {
		ORDER: "bigint",
		BYTES: "number",
		BITS: "number"
	}));
	return field;
}
/**
* Same as `pow` but for Fp: non-constant-time.
* Unsafe in some contexts: uses ladder, so can expose bigint bits.
*/
function FpPow(Fp, num, power) {
	if (power < _0n$1) throw new Error("invalid exponent, negatives unsupported");
	if (power === _0n$1) return Fp.ONE;
	if (power === _1n$1) return num;
	let p = Fp.ONE;
	let d = num;
	while (power > _0n$1) {
		if (power & _1n$1) p = Fp.mul(p, d);
		d = Fp.sqr(d);
		power >>= _1n$1;
	}
	return p;
}
/**
* Efficiently invert an array of Field elements.
* Exception-free. Will return `undefined` for 0 elements.
* @param passZero map 0 to 0 (instead of undefined)
*/
function FpInvertBatch(Fp, nums, passZero = false) {
	const inverted = new Array(nums.length).fill(passZero ? Fp.ZERO : void 0);
	const multipliedAcc = nums.reduce((acc, num, i) => {
		if (Fp.is0(num)) return acc;
		inverted[i] = acc;
		return Fp.mul(acc, num);
	}, Fp.ONE);
	const invertedAcc = Fp.inv(multipliedAcc);
	nums.reduceRight((acc, num, i) => {
		if (Fp.is0(num)) return acc;
		inverted[i] = Fp.mul(acc, inverted[i]);
		return Fp.mul(acc, num);
	}, invertedAcc);
	return inverted;
}
/**
* Legendre symbol.
* Legendre constant is used to calculate Legendre symbol (a | p)
* which denotes the value of a^((p-1)/2) (mod p).
*
* * (a | p) ≡ 1    if a is a square (mod p), quadratic residue
* * (a | p) ≡ -1   if a is not a square (mod p), quadratic non residue
* * (a | p) ≡ 0    if a ≡ 0 (mod p)
*/
function FpLegendre(Fp, n) {
	const p1mod2 = (Fp.ORDER - _1n$1) / _2n;
	const powered = Fp.pow(n, p1mod2);
	const yes = Fp.eql(powered, Fp.ONE);
	const zero = Fp.eql(powered, Fp.ZERO);
	const no = Fp.eql(powered, Fp.neg(Fp.ONE));
	if (!yes && !zero && !no) throw new Error("invalid Legendre symbol result");
	return yes ? 1 : zero ? 0 : -1;
}
function nLength(n, nBitLength) {
	if (nBitLength !== void 0) anumber(nBitLength);
	const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
	return {
		nBitLength: _nBitLength,
		nByteLength: Math.ceil(_nBitLength / 8)
	};
}
var _Field = class {
	ORDER;
	BITS;
	BYTES;
	isLE;
	ZERO = _0n$1;
	ONE = _1n$1;
	_lengths;
	_sqrt;
	_mod;
	constructor(ORDER, opts = {}) {
		if (ORDER <= _0n$1) throw new Error("invalid field: expected ORDER > 0, got " + ORDER);
		let _nbitLength = void 0;
		this.isLE = false;
		if (opts != null && typeof opts === "object") {
			if (typeof opts.BITS === "number") _nbitLength = opts.BITS;
			if (typeof opts.sqrt === "function") this.sqrt = opts.sqrt;
			if (typeof opts.isLE === "boolean") this.isLE = opts.isLE;
			if (opts.allowedLengths) this._lengths = opts.allowedLengths?.slice();
			if (typeof opts.modFromBytes === "boolean") this._mod = opts.modFromBytes;
		}
		const { nBitLength, nByteLength } = nLength(ORDER, _nbitLength);
		if (nByteLength > 2048) throw new Error("invalid field: expected ORDER of <= 2048 bytes");
		this.ORDER = ORDER;
		this.BITS = nBitLength;
		this.BYTES = nByteLength;
		this._sqrt = void 0;
		Object.preventExtensions(this);
	}
	create(num) {
		return mod(num, this.ORDER);
	}
	isValid(num) {
		if (typeof num !== "bigint") throw new Error("invalid field element: expected bigint, got " + typeof num);
		return _0n$1 <= num && num < this.ORDER;
	}
	is0(num) {
		return num === _0n$1;
	}
	isValidNot0(num) {
		return !this.is0(num) && this.isValid(num);
	}
	isOdd(num) {
		return (num & _1n$1) === _1n$1;
	}
	neg(num) {
		return mod(-num, this.ORDER);
	}
	eql(lhs, rhs) {
		return lhs === rhs;
	}
	sqr(num) {
		return mod(num * num, this.ORDER);
	}
	add(lhs, rhs) {
		return mod(lhs + rhs, this.ORDER);
	}
	sub(lhs, rhs) {
		return mod(lhs - rhs, this.ORDER);
	}
	mul(lhs, rhs) {
		return mod(lhs * rhs, this.ORDER);
	}
	pow(num, power) {
		return FpPow(this, num, power);
	}
	div(lhs, rhs) {
		return mod(lhs * invert(rhs, this.ORDER), this.ORDER);
	}
	sqrN(num) {
		return num * num;
	}
	addN(lhs, rhs) {
		return lhs + rhs;
	}
	subN(lhs, rhs) {
		return lhs - rhs;
	}
	mulN(lhs, rhs) {
		return lhs * rhs;
	}
	inv(num) {
		return invert(num, this.ORDER);
	}
	sqrt(num) {
		if (!this._sqrt) this._sqrt = FpSqrt(this.ORDER);
		return this._sqrt(this, num);
	}
	toBytes(num) {
		return this.isLE ? numberToBytesLE(num, this.BYTES) : numberToBytesBE(num, this.BYTES);
	}
	fromBytes(bytes, skipValidation = false) {
		abytes(bytes);
		const { _lengths: allowedLengths, BYTES, isLE, ORDER, _mod: modFromBytes } = this;
		if (allowedLengths) {
			if (!allowedLengths.includes(bytes.length) || bytes.length > BYTES) throw new Error("Field.fromBytes: expected " + allowedLengths + " bytes, got " + bytes.length);
			const padded = new Uint8Array(BYTES);
			padded.set(bytes, isLE ? 0 : padded.length - bytes.length);
			bytes = padded;
		}
		if (bytes.length !== BYTES) throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
		let scalar = isLE ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
		if (modFromBytes) scalar = mod(scalar, ORDER);
		if (!skipValidation) {
			if (!this.isValid(scalar)) throw new Error("invalid field element: outside of range 0..ORDER");
		}
		return scalar;
	}
	invertBatch(lst) {
		return FpInvertBatch(this, lst);
	}
	cmov(a, b, condition) {
		return condition ? b : a;
	}
};
/**
* Creates a finite field. Major performance optimizations:
* * 1. Denormalized operations like mulN instead of mul.
* * 2. Identical object shape: never add or remove keys.
* * 3. `Object.freeze`.
* Fragile: always run a benchmark on a change.
* Security note: operations don't check 'isValid' for all elements for performance reasons,
* it is caller responsibility to check this.
* This is low-level code, please make sure you know what you're doing.
*
* Note about field properties:
* * CHARACTERISTIC p = prime number, number of elements in main subgroup.
* * ORDER q = similar to cofactor in curves, may be composite `q = p^m`.
*
* @param ORDER field order, probably prime, or could be composite
* @param bitLen how many bits the field consumes
* @param isLE (default: false) if encoding / decoding should be in little-endian
* @param redef optional faster redefinitions of sqrt and other methods
*/
function Field(ORDER, opts = {}) {
	return new _Field(ORDER, opts);
}
/**
* Returns total number of bytes consumed by the field element.
* For example, 32 bytes for usual 256-bit weierstrass curve.
* @param fieldOrder number of field elements, usually CURVE.n
* @returns byte length of field
*/
function getFieldBytesLength(fieldOrder) {
	if (typeof fieldOrder !== "bigint") throw new Error("field order must be bigint");
	const bitLength = fieldOrder.toString(2).length;
	return Math.ceil(bitLength / 8);
}
/**
* Returns minimal amount of bytes that can be safely reduced
* by field order.
* Should be 2^-128 for 128-bit curve such as P256.
* @param fieldOrder number of field elements, usually CURVE.n
* @returns byte length of target hash
*/
function getMinHashLength(fieldOrder) {
	const length = getFieldBytesLength(fieldOrder);
	return length + Math.ceil(length / 2);
}
/**
* "Constant-time" private key generation utility.
* Can take (n + n/2) or more bytes of uniform input e.g. from CSPRNG or KDF
* and convert them into private scalar, with the modulo bias being negligible.
* Needs at least 48 bytes of input for 32-byte private key.
* https://research.kudelskisecurity.com/2020/07/28/the-definitive-guide-to-modulo-bias-and-how-to-avoid-it/
* FIPS 186-5, A.2 https://csrc.nist.gov/publications/detail/fips/186/5/final
* RFC 9380, https://www.rfc-editor.org/rfc/rfc9380#section-5
* @param hash hash output from SHA3 or a similar function
* @param groupOrder size of subgroup - (e.g. secp256k1.Point.Fn.ORDER)
* @param isLE interpret hash bytes as LE num
* @returns valid private scalar
*/
function mapHashToField(key, fieldOrder, isLE = false) {
	abytes(key);
	const len = key.length;
	const fieldLen = getFieldBytesLength(fieldOrder);
	const minLen = getMinHashLength(fieldOrder);
	if (len < 16 || len < minLen || len > 1024) throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
	const reduced = mod(isLE ? bytesToNumberLE(key) : bytesToNumberBE(key), fieldOrder - _1n$1) + _1n$1;
	return isLE ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
}
//#endregion
//#region node_modules/@noble/curves/abstract/curve.js
/**
* Methods for elliptic curve multiplication by scalars.
* Contains wNAF, pippenger.
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _0n = /* @__PURE__ */ BigInt(0);
const _1n = /* @__PURE__ */ BigInt(1);
function negateCt(condition, item) {
	const neg = item.negate();
	return condition ? neg : item;
}
/**
* Takes a bunch of Projective Points but executes only one
* inversion on all of them. Inversion is very slow operation,
* so this improves performance massively.
* Optimization: converts a list of projective points to a list of identical points with Z=1.
*/
function normalizeZ(c, points) {
	const invertedZs = FpInvertBatch(c.Fp, points.map((p) => p.Z));
	return points.map((p, i) => c.fromAffine(p.toAffine(invertedZs[i])));
}
function validateW(W, bits) {
	if (!Number.isSafeInteger(W) || W <= 0 || W > bits) throw new Error("invalid window size, expected [1.." + bits + "], got W=" + W);
}
function calcWOpts(W, scalarBits) {
	validateW(W, scalarBits);
	const windows = Math.ceil(scalarBits / W) + 1;
	const windowSize = 2 ** (W - 1);
	const maxNumber = 2 ** W;
	return {
		windows,
		windowSize,
		mask: bitMask(W),
		maxNumber,
		shiftBy: BigInt(W)
	};
}
function calcOffsets(n, window, wOpts) {
	const { windowSize, mask, maxNumber, shiftBy } = wOpts;
	let wbits = Number(n & mask);
	let nextN = n >> shiftBy;
	if (wbits > windowSize) {
		wbits -= maxNumber;
		nextN += _1n;
	}
	const offsetStart = window * windowSize;
	const offset = offsetStart + Math.abs(wbits) - 1;
	const isZero = wbits === 0;
	const isNeg = wbits < 0;
	const isNegF = window % 2 !== 0;
	return {
		nextN,
		offset,
		isZero,
		isNeg,
		isNegF,
		offsetF: offsetStart
	};
}
const pointPrecomputes = /* @__PURE__ */ new WeakMap();
const pointWindowSizes = /* @__PURE__ */ new WeakMap();
function getW(P) {
	return pointWindowSizes.get(P) || 1;
}
function assert0(n) {
	if (n !== _0n) throw new Error("invalid wNAF");
}
/**
* Elliptic curve multiplication of Point by scalar. Fragile.
* Table generation takes **30MB of ram and 10ms on high-end CPU**,
* but may take much longer on slow devices. Actual generation will happen on
* first call of `multiply()`. By default, `BASE` point is precomputed.
*
* Scalars should always be less than curve order: this should be checked inside of a curve itself.
* Creates precomputation tables for fast multiplication:
* - private scalar is split by fixed size windows of W bits
* - every window point is collected from window's table & added to accumulator
* - since windows are different, same point inside tables won't be accessed more than once per calc
* - each multiplication is 'Math.ceil(CURVE_ORDER / 𝑊) + 1' point additions (fixed for any scalar)
* - +1 window is neccessary for wNAF
* - wNAF reduces table size: 2x less memory + 2x faster generation, but 10% slower multiplication
*
* @todo Research returning 2d JS array of windows, instead of a single window.
* This would allow windows to be in different memory locations
*/
var wNAF = class {
	BASE;
	ZERO;
	Fn;
	bits;
	constructor(Point, bits) {
		this.BASE = Point.BASE;
		this.ZERO = Point.ZERO;
		this.Fn = Point.Fn;
		this.bits = bits;
	}
	_unsafeLadder(elm, n, p = this.ZERO) {
		let d = elm;
		while (n > _0n) {
			if (n & _1n) p = p.add(d);
			d = d.double();
			n >>= _1n;
		}
		return p;
	}
	/**
	* Creates a wNAF precomputation window. Used for caching.
	* Default window size is set by `utils.precompute()` and is equal to 8.
	* Number of precomputed points depends on the curve size:
	* 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
	* - 𝑊 is the window size
	* - 𝑛 is the bitlength of the curve order.
	* For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
	* @param point Point instance
	* @param W window size
	* @returns precomputed point tables flattened to a single array
	*/
	precomputeWindow(point, W) {
		const { windows, windowSize } = calcWOpts(W, this.bits);
		const points = [];
		let p = point;
		let base = p;
		for (let window = 0; window < windows; window++) {
			base = p;
			points.push(base);
			for (let i = 1; i < windowSize; i++) {
				base = base.add(p);
				points.push(base);
			}
			p = base.double();
		}
		return points;
	}
	/**
	* Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
	* More compact implementation:
	* https://github.com/paulmillr/noble-secp256k1/blob/47cb1669b6e506ad66b35fe7d76132ae97465da2/index.ts#L502-L541
	* @returns real and fake (for const-time) points
	*/
	wNAF(W, precomputes, n) {
		if (!this.Fn.isValid(n)) throw new Error("invalid scalar");
		let p = this.ZERO;
		let f = this.BASE;
		const wo = calcWOpts(W, this.bits);
		for (let window = 0; window < wo.windows; window++) {
			const { nextN, offset, isZero, isNeg, isNegF, offsetF } = calcOffsets(n, window, wo);
			n = nextN;
			if (isZero) f = f.add(negateCt(isNegF, precomputes[offsetF]));
			else p = p.add(negateCt(isNeg, precomputes[offset]));
		}
		assert0(n);
		return {
			p,
			f
		};
	}
	/**
	* Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
	* @param acc accumulator point to add result of multiplication
	* @returns point
	*/
	wNAFUnsafe(W, precomputes, n, acc = this.ZERO) {
		const wo = calcWOpts(W, this.bits);
		for (let window = 0; window < wo.windows; window++) {
			if (n === _0n) break;
			const { nextN, offset, isZero, isNeg } = calcOffsets(n, window, wo);
			n = nextN;
			if (isZero) continue;
			else {
				const item = precomputes[offset];
				acc = acc.add(isNeg ? item.negate() : item);
			}
		}
		assert0(n);
		return acc;
	}
	getPrecomputes(W, point, transform) {
		let comp = pointPrecomputes.get(point);
		if (!comp) {
			comp = this.precomputeWindow(point, W);
			if (W !== 1) {
				if (typeof transform === "function") comp = transform(comp);
				pointPrecomputes.set(point, comp);
			}
		}
		return comp;
	}
	cached(point, scalar, transform) {
		const W = getW(point);
		return this.wNAF(W, this.getPrecomputes(W, point, transform), scalar);
	}
	unsafe(point, scalar, transform, prev) {
		const W = getW(point);
		if (W === 1) return this._unsafeLadder(point, scalar, prev);
		return this.wNAFUnsafe(W, this.getPrecomputes(W, point, transform), scalar, prev);
	}
	createCache(P, W) {
		validateW(W, this.bits);
		pointWindowSizes.set(P, W);
		pointPrecomputes.delete(P);
	}
	hasCache(elm) {
		return getW(elm) !== 1;
	}
};
/**
* Endomorphism-specific multiplication for Koblitz curves.
* Cost: 128 dbl, 0-256 adds.
*/
function mulEndoUnsafe(Point, point, k1, k2) {
	let acc = point;
	let p1 = Point.ZERO;
	let p2 = Point.ZERO;
	while (k1 > _0n || k2 > _0n) {
		if (k1 & _1n) p1 = p1.add(acc);
		if (k2 & _1n) p2 = p2.add(acc);
		acc = acc.double();
		k1 >>= _1n;
		k2 >>= _1n;
	}
	return {
		p1,
		p2
	};
}
function createField(order, field, isLE) {
	if (field) {
		if (field.ORDER !== order) throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
		validateField(field);
		return field;
	} else return Field(order, { isLE });
}
/** Validates CURVE opts and creates fields */
function createCurveFields(type, CURVE, curveOpts = {}, FpFnLE) {
	if (FpFnLE === void 0) FpFnLE = type === "edwards";
	if (!CURVE || typeof CURVE !== "object") throw new Error(`expected valid ${type} CURVE object`);
	for (const p of [
		"p",
		"n",
		"h"
	]) {
		const val = CURVE[p];
		if (!(typeof val === "bigint" && val > _0n)) throw new Error(`CURVE.${p} must be positive bigint`);
	}
	const Fp = createField(CURVE.p, curveOpts.Fp, FpFnLE);
	const Fn = createField(CURVE.n, curveOpts.Fn, FpFnLE);
	const params = [
		"Gx",
		"Gy",
		"a",
		type === "weierstrass" ? "b" : "d"
	];
	for (const p of params) if (!Fp.isValid(CURVE[p])) throw new Error(`CURVE.${p} must be valid field element of CURVE.Fp`);
	CURVE = Object.freeze(Object.assign({}, CURVE));
	return {
		CURVE,
		Fp,
		Fn
	};
}
function createKeygen(randomSecretKey, getPublicKey) {
	return function keygen(seed) {
		const secretKey = randomSecretKey(seed);
		return {
			secretKey,
			publicKey: getPublicKey(secretKey)
		};
	};
}
//#endregion
export { ahash as A, numberToBytesLE as C, sha512 as D, sha256 as E, isBytes as F, randomBytes as I, clean as M, concatBytes as N, abytes as O, hexToBytes as P, memoized as S, validateObject as T, bitMask as _, normalizeZ as a, copyBytes as b, getMinHashLength as c, mod as d, pow2 as f, bitLen as g, asciiToBytes as h, negateCt as i, bytesToHex as j, aexists as k, isNegativeLE as l, abool as m, createKeygen as n, wNAF as o, aInRange as p, mulEndoUnsafe as r, Field as s, createCurveFields as t, mapHashToField as u, bytesToNumberBE as v, numberToHexUnpadded as w, createHmacDrbg as x, bytesToNumberLE as y };
