import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BBjU-hqW.js";
import { t as resolveSystemBin } from "./resolve-system-bin-ClCg60C2.js";
import { RastermillUnavailableError, createRastermill, isRastermillUnavailableError, readImageProbeFromHeader } from "rastermill";
//#region src/media/image-ops.ts
/** OpenClaw-facing image backend availability error, preserving the failed operation and causes. */
var ImageProcessorUnavailableError = class extends Error {
	constructor(operation, message, causes = []) {
		super(message ?? `Image processor unavailable for ${operation}`, { cause: causes.find((cause) => cause instanceof Error) });
		this.code = "IMAGE_PROCESSOR_UNAVAILABLE";
		this.name = "ImageProcessorUnavailableError";
		this.operation = operation;
		this.causes = causes;
	}
};
/** Ordered JPEG quality ladder used when shrinking generated or attached images. */
const IMAGE_REDUCE_QUALITY_STEPS = [
	85,
	75,
	65,
	55,
	45,
	35
];
/** Shared input/output pixel cap for Rastermill-backed image operations. */
const MAX_IMAGE_INPUT_PIXELS = 25e6;
const loadPhotonRuntime = createLazyRuntimeModule(() => import("./photon.runtime.js"));
/** Creates a Rastermill processor with OpenClaw temp-dir, pixel-limit, and command trust policy. */
function createImageProcessor() {
	return createRastermill({
		execution: "auto",
		limits: {
			inputPixels: MAX_IMAGE_INPUT_PIXELS,
			outputPixels: MAX_IMAGE_INPUT_PIXELS
		},
		temp: {
			rootDir: resolvePreferredOpenClawTmpDir(),
			prefix: "openclaw-img-"
		},
		commandResolver: (command) => resolveSystemBin(command, { trust: command === "powershell" ? "strict" : "standard" })
	});
}
/** Detects either OpenClaw's wrapper error or Rastermill's native unavailable error. */
function isImageProcessorUnavailableError(err) {
	return err instanceof ImageProcessorUnavailableError || isRastermillUnavailableError(err);
}
/** Builds a descending, de-duplicated max-side search grid for iterative image resizing. */
function buildImageResizeSideGrid(maxSide, sideStart) {
	return [
		sideStart,
		1800,
		1600,
		1400,
		1200,
		1e3,
		800
	].map((value) => Math.min(maxSide, value)).filter((value, idx, arr) => value > 0 && arr.indexOf(value) === idx).toSorted((a, b) => b - a);
}
function resolveDisplayImageMetadata(probe) {
	if (!probe) return null;
	if (probe.orientation && probe.orientation >= 5 && probe.orientation <= 8) return {
		width: probe.height,
		height: probe.width
	};
	return {
		width: probe.width,
		height: probe.height
	};
}
/** Reads display dimensions from image header bytes without invoking a full image decode. */
function readImageMetadataFromHeader(buffer) {
	return resolveDisplayImageMetadata(readImageProbeFromHeader(buffer));
}
/** Reads image probe data from header bytes without invoking a full image decode. */
function readImageProbeFromHeader$1(buffer) {
	return readImageProbeFromHeader(buffer);
}
function wrapRastermillUnavailable(operation, error) {
	if (error instanceof RastermillUnavailableError) throw new ImageProcessorUnavailableError(operation, error.message, error.causes);
	throw error;
}
/** Fully probes display dimensions through Rastermill when header-only metadata is insufficient. */
async function getImageMetadata(buffer) {
	return resolveDisplayImageMetadata(await createImageProcessor().probe(buffer));
}
/** Resizes or encodes image bytes as JPEG through the shared image processor. */
async function resizeToJpeg(params) {
	try {
		return (await createImageProcessor().encode(params.buffer, {
			format: "jpeg",
			resize: {
				maxSide: params.maxSide,
				enlarge: params.withoutEnlargement === false
			},
			quality: params.quality
		})).data;
	} catch (error) {
		return wrapRastermillUnavailable("resizeToJpeg", error);
	}
}
async function encodeImageToJpeg(buffer, operation) {
	try {
		return (await createImageProcessor().encode(buffer, { format: "jpeg" })).data;
	} catch (error) {
		return wrapRastermillUnavailable(operation, error);
	}
}
/** Converts image bytes into JPEG through the shared image processor. */
async function convertImageToJpeg(buffer) {
	return await encodeImageToJpeg(buffer, "convertImageToJpeg");
}
/** Converts HEIC/HEIF-like image bytes into JPEG through the shared image processor. */
async function convertHeicToJpeg(buffer) {
	return await encodeImageToJpeg(buffer, "convertHeicToJpeg");
}
/** Converts image bytes to PNG, including BMP fallback unsupported by Rastermill's Photon gate. */
async function convertImageToPng(buffer) {
	try {
		return (await createImageProcessor().encode(buffer, { format: "png" })).data;
	} catch (error) {
		const probe = readImageProbeFromHeader(buffer);
		if (!(probe && probe.format === "bmp" && probe.width > 0 && probe.height > 0 && probe.width <= 25e6 / probe.height)) throw error;
		try {
			return (await loadPhotonRuntime()).convertBmpToPngWithPhoton(buffer);
		} catch {
			throw error;
		}
	}
}
/** Optimizes PNG bytes under a target size and returns the chosen search parameters. */
async function optimizeImageToPng(buffer, maxBytes, options) {
	let out;
	try {
		out = await createImageProcessor().encode(buffer, {
			format: "png",
			maxBytes,
			search: options?.sides === void 0 ? {} : { maxSide: options.sides }
		});
	} catch (error) {
		wrapRastermillUnavailable("optimizeImageToPng", error);
	}
	return {
		buffer: out.data,
		optimizedSize: out.bytes,
		resizeSide: out.chosen.maxSide ?? out.width,
		compressionLevel: out.chosen.compressionLevel ?? 6
	};
}
//#endregion
export { convertImageToJpeg as a, getImageMetadata as c, readImageMetadataFromHeader as d, readImageProbeFromHeader$1 as f, convertHeicToJpeg as i, isImageProcessorUnavailableError as l, MAX_IMAGE_INPUT_PIXELS as n, convertImageToPng as o, resizeToJpeg as p, buildImageResizeSideGrid as r, createImageProcessor as s, IMAGE_REDUCE_QUALITY_STEPS as t, optimizeImageToPng as u };
