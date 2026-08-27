//#region node_modules/@noble/ciphers/utils.js
/**
* Utilities for hex, bytes, CSPRNG.
* @module
*/
/*! noble-ciphers - MIT License (c) 2023 Paul Miller (paulmillr.com) */
/** Checks if something is Uint8Array. Be careful: nodejs Buffer will return true. */
function isBytes(a) {
	return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
/** Asserts something is boolean. */
function abool(b) {
	if (typeof b !== "boolean") throw new Error(`boolean expected, not ${b}`);
}
/** Asserts something is positive integer. */
function anumber(n) {
	if (!Number.isSafeInteger(n) || n < 0) throw new Error("positive integer expected, got " + n);
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
/** Asserts a hash instance has not been destroyed / finished */
function aexists(instance, checkFinished = true) {
	if (instance.destroyed) throw new Error("Hash instance has been destroyed");
	if (checkFinished && instance.finished) throw new Error("Hash#digest() has already been called");
}
/** Asserts output is properly-sized byte array */
function aoutput(out, instance) {
	abytes(out, void 0, "output");
	const min = instance.outputLen;
	if (out.length < min) throw new Error("digestInto() expects output buffer of length at least " + min);
}
/** Cast u8 / u16 / u32 to u8. */
function u8(arr) {
	return new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
}
/** Cast u8 / u16 / u32 to u32. */
function u32(arr) {
	return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}
/** Zeroize a byte array. Warning: JS provides no guarantees. */
function clean(...arrays) {
	for (let i = 0; i < arrays.length; i++) arrays[i].fill(0);
}
/** Create DataView of an array for easy byte-level manipulation. */
function createView(arr) {
	return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
/** Is current platform little-endian? Most are. Big-Endian platform: IBM */
const isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
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
/**
* Converts string to bytes using UTF8 encoding.
* @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
*/
function utf8ToBytes(str) {
	if (typeof str !== "string") throw new Error("string expected");
	return new Uint8Array(new TextEncoder().encode(str));
}
/**
* Checks if two U8A use same underlying buffer and overlaps.
* This is invalid and can corrupt data.
*/
function overlapBytes(a, b) {
	return a.buffer === b.buffer && a.byteOffset < b.byteOffset + b.byteLength && b.byteOffset < a.byteOffset + a.byteLength;
}
/**
* If input and output overlap and input starts before output, we will overwrite end of input before
* we start processing it, so this is not supported for most ciphers (except chacha/salse, which designed with this)
*/
function complexOverlapBytes(input, output) {
	if (overlapBytes(input, output) && input.byteOffset < output.byteOffset) throw new Error("complex overlap of input and output is not supported");
}
function checkOpts(defaults, opts) {
	if (opts == null || typeof opts !== "object") throw new Error("options must be defined");
	return Object.assign(defaults, opts);
}
/** Compares 2 uint8array-s in kinda constant time. */
function equalBytes(a, b) {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
	return diff === 0;
}
/**
* Wraps a cipher: validates args, ensures encrypt() can only be called once.
* @__NO_SIDE_EFFECTS__
*/
const wrapCipher = (params, constructor) => {
	function wrappedCipher(key, ...args) {
		abytes(key, void 0, "key");
		if (!isLE) throw new Error("Non little-endian hardware is not yet supported");
		if (params.nonceLength !== void 0) {
			const nonce = args[0];
			abytes(nonce, params.varSizeNonce ? void 0 : params.nonceLength, "nonce");
		}
		const tagl = params.tagLength;
		if (tagl && args[1] !== void 0) abytes(args[1], void 0, "AAD");
		const cipher = constructor(key, ...args);
		const checkOutput = (fnLength, output) => {
			if (output !== void 0) {
				if (fnLength !== 2) throw new Error("cipher output not supported");
				abytes(output, void 0, "output");
			}
		};
		let called = false;
		return {
			encrypt(data, output) {
				if (called) throw new Error("cannot encrypt() twice with same key + nonce");
				called = true;
				abytes(data);
				checkOutput(cipher.encrypt.length, output);
				return cipher.encrypt(data, output);
			},
			decrypt(data, output) {
				abytes(data);
				if (tagl && data.length < tagl) throw new Error("\"ciphertext\" expected length bigger than tagLength=" + tagl);
				checkOutput(cipher.decrypt.length, output);
				return cipher.decrypt(data, output);
			}
		};
	}
	Object.assign(wrappedCipher, params);
	return wrappedCipher;
};
/**
* By default, returns u8a of length.
* When out is available, it checks it for validity and uses it.
*/
function getOutput(expectedLength, out, onlyAligned = true) {
	if (out === void 0) return new Uint8Array(expectedLength);
	if (out.length !== expectedLength) throw new Error("\"output\" expected Uint8Array of length " + expectedLength + ", got: " + out.length);
	if (onlyAligned && !isAligned32(out)) throw new Error("invalid output, must be aligned");
	return out;
}
function u64Lengths(dataLength, aadLength, isLE) {
	abool(isLE);
	const num = /* @__PURE__ */ new Uint8Array(16);
	const view = createView(num);
	view.setBigUint64(0, BigInt(aadLength), isLE);
	view.setBigUint64(8, BigInt(dataLength), isLE);
	return num;
}
function isAligned32(bytes) {
	return bytes.byteOffset % 4 === 0;
}
function copyBytes(bytes) {
	return Uint8Array.from(bytes);
}
//#endregion
//#region node_modules/@noble/ciphers/_polyval.js
/**
* GHash from AES-GCM and its little-endian "mirror image" Polyval from AES-SIV.
*
* Implemented in terms of GHash with conversion function for keys
* GCM GHASH from
* [NIST SP800-38d](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf),
* SIV from
* [RFC 8452](https://www.rfc-editor.org/rfc/rfc8452).
*
* GHASH   modulo: x^128 + x^7   + x^2   + x     + 1
* POLYVAL modulo: x^128 + x^127 + x^126 + x^121 + 1
*
* @module
*/
const BLOCK_SIZE$1 = 16;
const ZEROS16 = /* @__PURE__ */ new Uint8Array(16);
const ZEROS32 = u32(ZEROS16);
const POLY$1 = 225;
const mul2$1 = (s0, s1, s2, s3) => {
	const hiBit = s3 & 1;
	return {
		s3: s2 << 31 | s3 >>> 1,
		s2: s1 << 31 | s2 >>> 1,
		s1: s0 << 31 | s1 >>> 1,
		s0: s0 >>> 1 ^ POLY$1 << 24 & -(hiBit & 1)
	};
};
const swapLE = (n) => (n >>> 0 & 255) << 24 | (n >>> 8 & 255) << 16 | (n >>> 16 & 255) << 8 | n >>> 24 & 255 | 0;
/**
* `mulX_POLYVAL(ByteReverse(H))` from spec
* @param k mutated in place
*/
function _toGHASHKey(k) {
	k.reverse();
	const hiBit = k[15] & 1;
	let carry = 0;
	for (let i = 0; i < k.length; i++) {
		const t = k[i];
		k[i] = t >>> 1 | carry;
		carry = (t & 1) << 7;
	}
	k[0] ^= -hiBit & 225;
	return k;
}
const estimateWindow = (bytes) => {
	if (bytes > 64 * 1024) return 8;
	if (bytes > 1024) return 4;
	return 2;
};
var GHASH = class {
	blockLen = BLOCK_SIZE$1;
	outputLen = BLOCK_SIZE$1;
	s0 = 0;
	s1 = 0;
	s2 = 0;
	s3 = 0;
	finished = false;
	t;
	W;
	windowSize;
	constructor(key, expectedLength) {
		abytes(key, 16, "key");
		key = copyBytes(key);
		const kView = createView(key);
		let k0 = kView.getUint32(0, false);
		let k1 = kView.getUint32(4, false);
		let k2 = kView.getUint32(8, false);
		let k3 = kView.getUint32(12, false);
		const doubles = [];
		for (let i = 0; i < 128; i++) {
			doubles.push({
				s0: swapLE(k0),
				s1: swapLE(k1),
				s2: swapLE(k2),
				s3: swapLE(k3)
			});
			({s0: k0, s1: k1, s2: k2, s3: k3} = mul2$1(k0, k1, k2, k3));
		}
		const W = estimateWindow(expectedLength || 1024);
		if (![
			1,
			2,
			4,
			8
		].includes(W)) throw new Error("ghash: invalid window size, expected 2, 4 or 8");
		this.W = W;
		const windows = 128 / W;
		const windowSize = this.windowSize = 2 ** W;
		const items = [];
		for (let w = 0; w < windows; w++) for (let byte = 0; byte < windowSize; byte++) {
			let s0 = 0, s1 = 0, s2 = 0, s3 = 0;
			for (let j = 0; j < W; j++) {
				if (!(byte >>> W - j - 1 & 1)) continue;
				const { s0: d0, s1: d1, s2: d2, s3: d3 } = doubles[W * w + j];
				s0 ^= d0, s1 ^= d1, s2 ^= d2, s3 ^= d3;
			}
			items.push({
				s0,
				s1,
				s2,
				s3
			});
		}
		this.t = items;
	}
	_updateBlock(s0, s1, s2, s3) {
		s0 ^= this.s0, s1 ^= this.s1, s2 ^= this.s2, s3 ^= this.s3;
		const { W, t, windowSize } = this;
		let o0 = 0, o1 = 0, o2 = 0, o3 = 0;
		const mask = (1 << W) - 1;
		let w = 0;
		for (const num of [
			s0,
			s1,
			s2,
			s3
		]) for (let bytePos = 0; bytePos < 4; bytePos++) {
			const byte = num >>> 8 * bytePos & 255;
			for (let bitPos = 8 / W - 1; bitPos >= 0; bitPos--) {
				const bit = byte >>> W * bitPos & mask;
				const { s0: e0, s1: e1, s2: e2, s3: e3 } = t[w * windowSize + bit];
				o0 ^= e0, o1 ^= e1, o2 ^= e2, o3 ^= e3;
				w += 1;
			}
		}
		this.s0 = o0;
		this.s1 = o1;
		this.s2 = o2;
		this.s3 = o3;
	}
	update(data) {
		aexists(this);
		abytes(data);
		data = copyBytes(data);
		const b32 = u32(data);
		const blocks = Math.floor(data.length / BLOCK_SIZE$1);
		const left = data.length % BLOCK_SIZE$1;
		for (let i = 0; i < blocks; i++) this._updateBlock(b32[i * 4 + 0], b32[i * 4 + 1], b32[i * 4 + 2], b32[i * 4 + 3]);
		if (left) {
			ZEROS16.set(data.subarray(blocks * BLOCK_SIZE$1));
			this._updateBlock(ZEROS32[0], ZEROS32[1], ZEROS32[2], ZEROS32[3]);
			clean(ZEROS32);
		}
		return this;
	}
	destroy() {
		const { t } = this;
		for (const elm of t) elm.s0 = 0, elm.s1 = 0, elm.s2 = 0, elm.s3 = 0;
	}
	digestInto(out) {
		aexists(this);
		aoutput(out, this);
		this.finished = true;
		const { s0, s1, s2, s3 } = this;
		const o32 = u32(out);
		o32[0] = s0;
		o32[1] = s1;
		o32[2] = s2;
		o32[3] = s3;
		return out;
	}
	digest() {
		const res = new Uint8Array(BLOCK_SIZE$1);
		this.digestInto(res);
		this.destroy();
		return res;
	}
};
var Polyval = class extends GHASH {
	constructor(key, expectedLength) {
		abytes(key);
		const ghKey = _toGHASHKey(copyBytes(key));
		super(ghKey, expectedLength);
		clean(ghKey);
	}
	update(data) {
		aexists(this);
		abytes(data);
		data = copyBytes(data);
		const b32 = u32(data);
		const left = data.length % BLOCK_SIZE$1;
		const blocks = Math.floor(data.length / BLOCK_SIZE$1);
		for (let i = 0; i < blocks; i++) this._updateBlock(swapLE(b32[i * 4 + 3]), swapLE(b32[i * 4 + 2]), swapLE(b32[i * 4 + 1]), swapLE(b32[i * 4 + 0]));
		if (left) {
			ZEROS16.set(data.subarray(blocks * BLOCK_SIZE$1));
			this._updateBlock(swapLE(ZEROS32[3]), swapLE(ZEROS32[2]), swapLE(ZEROS32[1]), swapLE(ZEROS32[0]));
			clean(ZEROS32);
		}
		return this;
	}
	digestInto(out) {
		aexists(this);
		aoutput(out, this);
		this.finished = true;
		const { s0, s1, s2, s3 } = this;
		const o32 = u32(out);
		o32[0] = s0;
		o32[1] = s1;
		o32[2] = s2;
		o32[3] = s3;
		return out.reverse();
	}
};
function wrapConstructorWithKey(hashCons) {
	const hashC = (msg, key) => hashCons(key, msg.length).update(msg).digest();
	const tmp = hashCons(/* @__PURE__ */ new Uint8Array(16), 0);
	hashC.outputLen = tmp.outputLen;
	hashC.blockLen = tmp.blockLen;
	hashC.create = (key, expectedLength) => hashCons(key, expectedLength);
	return hashC;
}
/** GHash MAC for AES-GCM. */
const ghash = wrapConstructorWithKey((key, expectedLength) => new GHASH(key, expectedLength));
wrapConstructorWithKey((key, expectedLength) => new Polyval(key, expectedLength));
//#endregion
//#region node_modules/@noble/ciphers/aes.js
/**
* [AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)
* a.k.a. Advanced Encryption Standard
* is a variant of Rijndael block cipher, standardized by NIST in 2001.
* We provide the fastest available pure JS implementation.
*
* `cipher = encrypt(block, key)`
*
* Data is split into 128-bit blocks. Encrypted in 10/12/14 rounds (128/192/256 bits). In every round:
* 1. **S-box**, table substitution
* 2. **Shift rows**, cyclic shift left of all rows of data array
* 3. **Mix columns**, multiplying every column by fixed polynomial
* 4. **Add round key**, round_key xor i-th column of array
*
* Check out [FIPS-197](https://csrc.nist.gov/files/pubs/fips/197/final/docs/fips-197.pdf),
* [NIST 800-38G](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-38G.pdf)
* and [original proposal](https://csrc.nist.gov/csrc/media/projects/cryptographic-standards-and-guidelines/documents/aes-development/rijndael-ammended.pdf)
* @module
*/
const BLOCK_SIZE = 16;
const BLOCK_SIZE32 = 4;
const EMPTY_BLOCK = /* @__PURE__ */ new Uint8Array(BLOCK_SIZE);
const POLY = 283;
function validateKeyLength(key) {
	if (![
		16,
		24,
		32
	].includes(key.length)) throw new Error("\"aes key\" expected Uint8Array of length 16/24/32, got length=" + key.length);
}
function mul2(n) {
	return n << 1 ^ POLY & -(n >> 7);
}
function mul(a, b) {
	let res = 0;
	for (; b > 0; b >>= 1) {
		res ^= a & -(b & 1);
		a = mul2(a);
	}
	return res;
}
const sbox = /* @__PURE__ */ (() => {
	const t = /* @__PURE__ */ new Uint8Array(256);
	for (let i = 0, x = 1; i < 256; i++, x ^= mul2(x)) t[i] = x;
	const box = /* @__PURE__ */ new Uint8Array(256);
	box[0] = 99;
	for (let i = 0; i < 255; i++) {
		let x = t[255 - i];
		x |= x << 8;
		box[t[i]] = (x ^ x >> 4 ^ x >> 5 ^ x >> 6 ^ x >> 7 ^ 99) & 255;
	}
	clean(t);
	return box;
})();
const invSbox = /* @__PURE__ */ sbox.map((_, j) => sbox.indexOf(j));
const rotr32_8 = (n) => n << 24 | n >>> 8;
const rotl32_8 = (n) => n << 8 | n >>> 24;
function genTtable(sbox, fn) {
	if (sbox.length !== 256) throw new Error("Wrong sbox length");
	const T0 = (/* @__PURE__ */ new Uint32Array(256)).map((_, j) => fn(sbox[j]));
	const T1 = T0.map(rotl32_8);
	const T2 = T1.map(rotl32_8);
	const T3 = T2.map(rotl32_8);
	const T01 = new Uint32Array(256 * 256);
	const T23 = new Uint32Array(256 * 256);
	const sbox2 = new Uint16Array(256 * 256);
	for (let i = 0; i < 256; i++) for (let j = 0; j < 256; j++) {
		const idx = i * 256 + j;
		T01[idx] = T0[i] ^ T1[j];
		T23[idx] = T2[i] ^ T3[j];
		sbox2[idx] = sbox[i] << 8 | sbox[j];
	}
	return {
		sbox,
		sbox2,
		T0,
		T1,
		T2,
		T3,
		T01,
		T23
	};
}
const tableEncoding = /* @__PURE__ */ genTtable(sbox, (s) => mul(s, 3) << 24 | s << 16 | s << 8 | mul(s, 2));
const tableDecoding = /* @__PURE__ */ genTtable(invSbox, (s) => mul(s, 11) << 24 | mul(s, 13) << 16 | mul(s, 9) << 8 | mul(s, 14));
const xPowers = /* @__PURE__ */ (() => {
	const p = /* @__PURE__ */ new Uint8Array(16);
	for (let i = 0, x = 1; i < 16; i++, x = mul2(x)) p[i] = x;
	return p;
})();
/** Key expansion used in CTR. */
function expandKeyLE(key) {
	abytes(key);
	const len = key.length;
	validateKeyLength(key);
	const { sbox2 } = tableEncoding;
	const toClean = [];
	if (!isAligned32(key)) toClean.push(key = copyBytes(key));
	const k32 = u32(key);
	const Nk = k32.length;
	const subByte = (n) => applySbox(sbox2, n, n, n, n);
	const xk = new Uint32Array(len + 28);
	xk.set(k32);
	for (let i = Nk; i < xk.length; i++) {
		let t = xk[i - 1];
		if (i % Nk === 0) t = subByte(rotr32_8(t)) ^ xPowers[i / Nk - 1];
		else if (Nk > 6 && i % Nk === 4) t = subByte(t);
		xk[i] = xk[i - Nk] ^ t;
	}
	clean(...toClean);
	return xk;
}
function expandKeyDecLE(key) {
	const encKey = expandKeyLE(key);
	const xk = encKey.slice();
	const Nk = encKey.length;
	const { sbox2 } = tableEncoding;
	const { T0, T1, T2, T3 } = tableDecoding;
	for (let i = 0; i < Nk; i += 4) for (let j = 0; j < 4; j++) xk[i + j] = encKey[Nk - i - 4 + j];
	clean(encKey);
	for (let i = 4; i < Nk - 4; i++) {
		const x = xk[i];
		const w = applySbox(sbox2, x, x, x, x);
		xk[i] = T0[w & 255] ^ T1[w >>> 8 & 255] ^ T2[w >>> 16 & 255] ^ T3[w >>> 24];
	}
	return xk;
}
function apply0123(T01, T23, s0, s1, s2, s3) {
	return T01[s0 << 8 & 65280 | s1 >>> 8 & 255] ^ T23[s2 >>> 8 & 65280 | s3 >>> 24 & 255];
}
function applySbox(sbox2, s0, s1, s2, s3) {
	return sbox2[s0 & 255 | s1 & 65280] | sbox2[s2 >>> 16 & 255 | s3 >>> 16 & 65280] << 16;
}
function encrypt(xk, s0, s1, s2, s3) {
	const { sbox2, T01, T23 } = tableEncoding;
	let k = 0;
	s0 ^= xk[k++], s1 ^= xk[k++], s2 ^= xk[k++], s3 ^= xk[k++];
	const rounds = xk.length / 4 - 2;
	for (let i = 0; i < rounds; i++) {
		const t0 = xk[k++] ^ apply0123(T01, T23, s0, s1, s2, s3);
		const t1 = xk[k++] ^ apply0123(T01, T23, s1, s2, s3, s0);
		const t2 = xk[k++] ^ apply0123(T01, T23, s2, s3, s0, s1);
		const t3 = xk[k++] ^ apply0123(T01, T23, s3, s0, s1, s2);
		s0 = t0, s1 = t1, s2 = t2, s3 = t3;
	}
	return {
		s0: xk[k++] ^ applySbox(sbox2, s0, s1, s2, s3),
		s1: xk[k++] ^ applySbox(sbox2, s1, s2, s3, s0),
		s2: xk[k++] ^ applySbox(sbox2, s2, s3, s0, s1),
		s3: xk[k++] ^ applySbox(sbox2, s3, s0, s1, s2)
	};
}
function decrypt(xk, s0, s1, s2, s3) {
	const { sbox2, T01, T23 } = tableDecoding;
	let k = 0;
	s0 ^= xk[k++], s1 ^= xk[k++], s2 ^= xk[k++], s3 ^= xk[k++];
	const rounds = xk.length / 4 - 2;
	for (let i = 0; i < rounds; i++) {
		const t0 = xk[k++] ^ apply0123(T01, T23, s0, s3, s2, s1);
		const t1 = xk[k++] ^ apply0123(T01, T23, s1, s0, s3, s2);
		const t2 = xk[k++] ^ apply0123(T01, T23, s2, s1, s0, s3);
		const t3 = xk[k++] ^ apply0123(T01, T23, s3, s2, s1, s0);
		s0 = t0, s1 = t1, s2 = t2, s3 = t3;
	}
	return {
		s0: xk[k++] ^ applySbox(sbox2, s0, s3, s2, s1),
		s1: xk[k++] ^ applySbox(sbox2, s1, s0, s3, s2),
		s2: xk[k++] ^ applySbox(sbox2, s2, s1, s0, s3),
		s3: xk[k++] ^ applySbox(sbox2, s3, s2, s1, s0)
	};
}
function ctr32(xk, isLE, nonce, src, dst) {
	abytes(nonce, BLOCK_SIZE, "nonce");
	abytes(src);
	dst = getOutput(src.length, dst);
	const ctr = nonce;
	const c32 = u32(ctr);
	const view = createView(ctr);
	const src32 = u32(src);
	const dst32 = u32(dst);
	const ctrPos = isLE ? 0 : 12;
	const srcLen = src.length;
	let ctrNum = view.getUint32(ctrPos, isLE);
	let { s0, s1, s2, s3 } = encrypt(xk, c32[0], c32[1], c32[2], c32[3]);
	for (let i = 0; i + 4 <= src32.length; i += 4) {
		dst32[i + 0] = src32[i + 0] ^ s0;
		dst32[i + 1] = src32[i + 1] ^ s1;
		dst32[i + 2] = src32[i + 2] ^ s2;
		dst32[i + 3] = src32[i + 3] ^ s3;
		ctrNum = ctrNum + 1 >>> 0;
		view.setUint32(ctrPos, ctrNum, isLE);
		({s0, s1, s2, s3} = encrypt(xk, c32[0], c32[1], c32[2], c32[3]));
	}
	const start = BLOCK_SIZE * Math.floor(src32.length / BLOCK_SIZE32);
	if (start < srcLen) {
		const b32 = new Uint32Array([
			s0,
			s1,
			s2,
			s3
		]);
		const buf = u8(b32);
		for (let i = start, pos = 0; i < srcLen; i++, pos++) dst[i] = src[i] ^ buf[pos];
		clean(b32);
	}
	return dst;
}
function validateBlockDecrypt(data) {
	abytes(data);
	if (data.length % BLOCK_SIZE !== 0) throw new Error("aes-(cbc/ecb).decrypt ciphertext should consist of blocks with size 16");
}
function validateBlockEncrypt(plaintext, pcks5, dst) {
	abytes(plaintext);
	let outLen = plaintext.length;
	const remaining = outLen % BLOCK_SIZE;
	if (!pcks5 && remaining !== 0) throw new Error("aec/(cbc-ecb): unpadded plaintext with disabled padding");
	if (!isAligned32(plaintext)) plaintext = copyBytes(plaintext);
	const b = u32(plaintext);
	if (pcks5) {
		let left = BLOCK_SIZE - remaining;
		if (!left) left = BLOCK_SIZE;
		outLen = outLen + left;
	}
	dst = getOutput(outLen, dst);
	complexOverlapBytes(plaintext, dst);
	return {
		b,
		o: u32(dst),
		out: dst
	};
}
function validatePCKS(data, pcks5) {
	if (!pcks5) return data;
	const len = data.length;
	if (!len) throw new Error("aes/pcks5: empty ciphertext not allowed");
	const lastByte = data[len - 1];
	if (lastByte <= 0 || lastByte > 16) throw new Error("aes/pcks5: wrong padding");
	const out = data.subarray(0, -lastByte);
	for (let i = 0; i < lastByte; i++) if (data[len - i - 1] !== lastByte) throw new Error("aes/pcks5: wrong padding");
	return out;
}
function padPCKS(left) {
	const tmp = /* @__PURE__ */ new Uint8Array(16);
	const tmp32 = u32(tmp);
	tmp.set(left);
	const paddingByte = BLOCK_SIZE - left.length;
	for (let i = BLOCK_SIZE - paddingByte; i < BLOCK_SIZE; i++) tmp[i] = paddingByte;
	return tmp32;
}
/**
* **CBC** (Cipher Block Chaining): Each plaintext block is XORed with the
* previous block of ciphertext before encryption.
* Hard to use: requires proper padding and an IV. Unauthenticated: needs MAC.
*/
const cbc = /* @__PURE__ */ wrapCipher({
	blockSize: 16,
	nonceLength: 16
}, function aescbc(key, iv, opts = {}) {
	const pcks5 = !opts.disablePadding;
	return {
		encrypt(plaintext, dst) {
			const xk = expandKeyLE(key);
			const { b, o, out: _out } = validateBlockEncrypt(plaintext, pcks5, dst);
			let _iv = iv;
			const toClean = [xk];
			if (!isAligned32(_iv)) toClean.push(_iv = copyBytes(_iv));
			const n32 = u32(_iv);
			let s0 = n32[0], s1 = n32[1], s2 = n32[2], s3 = n32[3];
			let i = 0;
			for (; i + 4 <= b.length;) {
				s0 ^= b[i + 0], s1 ^= b[i + 1], s2 ^= b[i + 2], s3 ^= b[i + 3];
				({s0, s1, s2, s3} = encrypt(xk, s0, s1, s2, s3));
				o[i++] = s0, o[i++] = s1, o[i++] = s2, o[i++] = s3;
			}
			if (pcks5) {
				const tmp32 = padPCKS(plaintext.subarray(i * 4));
				s0 ^= tmp32[0], s1 ^= tmp32[1], s2 ^= tmp32[2], s3 ^= tmp32[3];
				({s0, s1, s2, s3} = encrypt(xk, s0, s1, s2, s3));
				o[i++] = s0, o[i++] = s1, o[i++] = s2, o[i++] = s3;
			}
			clean(...toClean);
			return _out;
		},
		decrypt(ciphertext, dst) {
			validateBlockDecrypt(ciphertext);
			const xk = expandKeyDecLE(key);
			let _iv = iv;
			const toClean = [xk];
			if (!isAligned32(_iv)) toClean.push(_iv = copyBytes(_iv));
			const n32 = u32(_iv);
			dst = getOutput(ciphertext.length, dst);
			if (!isAligned32(ciphertext)) toClean.push(ciphertext = copyBytes(ciphertext));
			complexOverlapBytes(ciphertext, dst);
			const b = u32(ciphertext);
			const o = u32(dst);
			let s0 = n32[0], s1 = n32[1], s2 = n32[2], s3 = n32[3];
			for (let i = 0; i + 4 <= b.length;) {
				const ps0 = s0, ps1 = s1, ps2 = s2, ps3 = s3;
				s0 = b[i + 0], s1 = b[i + 1], s2 = b[i + 2], s3 = b[i + 3];
				const { s0: o0, s1: o1, s2: o2, s3: o3 } = decrypt(xk, s0, s1, s2, s3);
				o[i++] = o0 ^ ps0, o[i++] = o1 ^ ps1, o[i++] = o2 ^ ps2, o[i++] = o3 ^ ps3;
			}
			clean(...toClean);
			return validatePCKS(dst, pcks5);
		}
	};
});
function computeTag(fn, isLE, key, data, AAD) {
	const aadLength = AAD ? AAD.length : 0;
	const h = fn.create(key, data.length + aadLength);
	if (AAD) h.update(AAD);
	const num = u64Lengths(8 * data.length, 8 * aadLength, isLE);
	h.update(data);
	h.update(num);
	const res = h.digest();
	clean(num);
	return res;
}
/**
* **GCM** (Galois/Counter Mode): Combines CTR mode with polynomial MAC. Efficient and widely used.
* Not perfect:
* a) conservative key wear-out is `2**32` (4B) msgs.
* b) key wear-out under random nonces is even smaller: `2**23` (8M) messages for `2**-50` chance.
* c) MAC can be forged: see Poly1305 documentation.
*/
const gcm = /* @__PURE__ */ wrapCipher({
	blockSize: 16,
	nonceLength: 12,
	tagLength: 16,
	varSizeNonce: true
}, function aesgcm(key, nonce, AAD) {
	if (nonce.length < 8) throw new Error("aes/gcm: invalid nonce length");
	const tagLength = 16;
	function _computeTag(authKey, tagMask, data) {
		const tag = computeTag(ghash, false, authKey, data, AAD);
		for (let i = 0; i < tagMask.length; i++) tag[i] ^= tagMask[i];
		return tag;
	}
	function deriveKeys() {
		const xk = expandKeyLE(key);
		const authKey = EMPTY_BLOCK.slice();
		const counter = EMPTY_BLOCK.slice();
		ctr32(xk, false, counter, counter, authKey);
		if (nonce.length === 12) counter.set(nonce);
		else {
			const nonceLen = EMPTY_BLOCK.slice();
			createView(nonceLen).setBigUint64(8, BigInt(nonce.length * 8), false);
			const g = ghash.create(authKey).update(nonce).update(nonceLen);
			g.digestInto(counter);
			g.destroy();
		}
		return {
			xk,
			authKey,
			counter,
			tagMask: ctr32(xk, false, counter, EMPTY_BLOCK)
		};
	}
	return {
		encrypt(plaintext) {
			const { xk, authKey, counter, tagMask } = deriveKeys();
			const out = new Uint8Array(plaintext.length + tagLength);
			const toClean = [
				xk,
				authKey,
				counter,
				tagMask
			];
			if (!isAligned32(plaintext)) toClean.push(plaintext = copyBytes(plaintext));
			ctr32(xk, false, counter, plaintext, out.subarray(0, plaintext.length));
			const tag = _computeTag(authKey, tagMask, out.subarray(0, out.length - tagLength));
			toClean.push(tag);
			out.set(tag, plaintext.length);
			clean(...toClean);
			return out;
		},
		decrypt(ciphertext) {
			const { xk, authKey, counter, tagMask } = deriveKeys();
			const toClean = [
				xk,
				authKey,
				tagMask,
				counter
			];
			if (!isAligned32(ciphertext)) toClean.push(ciphertext = copyBytes(ciphertext));
			const data = ciphertext.subarray(0, -16);
			const passedTag = ciphertext.subarray(-16);
			const tag = _computeTag(authKey, tagMask, data);
			toClean.push(tag);
			if (!equalBytes(tag, passedTag)) throw new Error("aes/gcm: invalid ghash tag");
			const out = ctr32(xk, false, counter, data);
			clean(...toClean);
			return out;
		}
	};
});
function isBytes32(a) {
	return a instanceof Uint32Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint32Array";
}
function encryptBlock(xk, block) {
	abytes(block, 16, "block");
	if (!isBytes32(xk)) throw new Error("_encryptBlock accepts result of expandKeyLE");
	const b32 = u32(block);
	let { s0, s1, s2, s3 } = encrypt(xk, b32[0], b32[1], b32[2], b32[3]);
	b32[0] = s0, b32[1] = s1, b32[2] = s2, b32[3] = s3;
	return block;
}
/**
* Left-shift by one bit and conditionally XOR with 0x87:
* ```
* if MSB(L) is equal to 0
* then    K1 := L << 1;
* else    K1 := (L << 1) XOR const_Rb;
* ```
*
* Specs: [RFC 4493, Section 2.3](https://www.rfc-editor.org/rfc/rfc4493.html#section-2.3),
*        [RFC 5297 Section 2.3](https://datatracker.ietf.org/doc/html/rfc5297.html#section-2.3)
*
* @returns modified `block` (for chaining)
*/
function dbl(block) {
	let carry = 0;
	for (let i = BLOCK_SIZE - 1; i >= 0; i--) {
		const newCarry = (block[i] & 128) >>> 7;
		block[i] = block[i] << 1 | carry;
		carry = newCarry;
	}
	if (carry) block[BLOCK_SIZE - 1] ^= 135;
	return block;
}
/**
* `a XOR b`, running in-site on `a`.
* @param a left operand and output
* @param b right operand
* @returns `a` (for chaining)
*/
function xorBlock(a, b) {
	if (a.length !== b.length) throw new Error("xorBlock: blocks must have same length");
	for (let i = 0; i < a.length; i++) a[i] = a[i] ^ b[i];
	return a;
}
/**
* Internal CMAC class.
*/
var _CMAC = class {
	buffer;
	destroyed;
	k1;
	k2;
	xk;
	constructor(key) {
		abytes(key);
		validateKeyLength(key);
		this.xk = expandKeyLE(key);
		this.buffer = /* @__PURE__ */ new Uint8Array(0);
		this.destroyed = false;
		const L = new Uint8Array(BLOCK_SIZE);
		encryptBlock(this.xk, L);
		this.k1 = dbl(L);
		this.k2 = dbl(new Uint8Array(this.k1));
	}
	update(data) {
		const { destroyed, buffer } = this;
		if (destroyed) throw new Error("CMAC instance was destroyed");
		abytes(data);
		const newBuffer = new Uint8Array(buffer.length + data.length);
		newBuffer.set(buffer);
		newBuffer.set(data, buffer.length);
		this.buffer = newBuffer;
		return this;
	}
	digest() {
		if (this.destroyed) throw new Error("CMAC instance was destroyed");
		const { buffer } = this;
		const msgLen = buffer.length;
		let n = Math.ceil(msgLen / BLOCK_SIZE);
		let flag;
		if (n === 0) {
			n = 1;
			flag = false;
		} else flag = msgLen % BLOCK_SIZE === 0;
		const lastBlockStart = (n - 1) * BLOCK_SIZE;
		const lastBlockData = buffer.subarray(lastBlockStart);
		let m_last;
		if (flag) m_last = xorBlock(new Uint8Array(lastBlockData), this.k1);
		else {
			const padded = new Uint8Array(BLOCK_SIZE);
			padded.set(lastBlockData);
			padded[lastBlockData.length] = 128;
			m_last = xorBlock(padded, this.k2);
		}
		let x = new Uint8Array(BLOCK_SIZE);
		for (let i = 0; i < n - 1; i++) {
			xorBlock(x, buffer.subarray(i * BLOCK_SIZE, (i + 1) * BLOCK_SIZE));
			encryptBlock(this.xk, x);
		}
		xorBlock(x, m_last);
		encryptBlock(this.xk, x);
		clean(m_last);
		return x;
	}
	destroy() {
		const { buffer, destroyed, xk, k1, k2 } = this;
		if (destroyed) return;
		this.destroyed = true;
		clean(buffer, xk, k1, k2);
	}
};
/**
* AES-CMAC (Cipher-based Message Authentication Code).
* Specs: [RFC 4493](https://www.rfc-editor.org/rfc/rfc4493.html).
*/
const cmac = (key, message) => new _CMAC(key).update(message).digest();
cmac.create = (key) => new _CMAC(key);
//#endregion
export { wrapCipher as _, aexists as a, bytesToHex as c, copyBytes as d, equalBytes as f, utf8ToBytes as g, u64Lengths as h, abytes as i, checkOpts as l, u32 as m, gcm as n, anumber as o, getOutput as p, abool as r, aoutput as s, cbc as t, clean as u };
