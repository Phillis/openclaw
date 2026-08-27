import { t as sameFileIdentity } from "./file-identity-CaVBmM56.js";
import { n as canonicalPathFromExistingAncestor, s as pathExists } from "./absolute-path-CYFPfAjt.js";
import "./fs-safe-CmrQUApq.js";
import { u as ensureDurableDirectory } from "./pinned-write-powa_mtU.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import { p as shortenHomeInString, t as CONFIG_DIR } from "./utils-Bw16L5tB.js";
import { t as resolveSystemBin } from "./resolve-system-bin-ClCg60C2.js";
import { n as runExec } from "./exec-D2kbpwdA.js";
import { r as normalizeTlsFingerprint } from "./client-address-utils-ycG4vrin.js";
import { n as publishFileNoClobber } from "./directory-durability-y-xIUhxC.js";
import path from "node:path";
import fs from "node:fs/promises";
import { X509Certificate } from "node:crypto";
import tls from "node:tls";
//#region src/infra/tls/gateway.ts
const GATEWAY_TLS_CERT_GENERATION_TIMEOUT_MS = 3e4;
function gatewayTlsDegradation(reason) {
	return {
		event: "gateway.tls.degraded",
		ownerKind: "gateway",
		ownerId: "tls",
		reason,
		state: "best-effort"
	};
}
async function publishGeneratedTlsOutput(stagedPath, finalPath) {
	const degradationReasons = [];
	const stagedHandle = await fs.open(stagedPath, "r+");
	let stagedIdentity;
	try {
		await stagedHandle.sync();
		stagedIdentity = await stagedHandle.stat();
	} finally {
		await stagedHandle.close();
	}
	const publication = await publishFileNoClobber(stagedPath, finalPath, {
		strategy: "link-or-copy",
		durability: "degrade"
	});
	if (publication.method === "exclusive-copy") degradationReasons.push("atomic hard-link publication unavailable");
	if (publication.durability === "degraded") degradationReasons.push("directory durability unavailable");
	const [currentStagedIdentity, currentPublishedIdentity] = await Promise.all([fs.lstat(stagedPath), fs.lstat(finalPath)]);
	const hardlinkChanged = publication.method === "hardlink" && !sameFileIdentity(stagedIdentity, publication.identity);
	if (!currentStagedIdentity.isFile() || !currentPublishedIdentity.isFile() || !sameFileIdentity(stagedIdentity, currentStagedIdentity) || !sameFileIdentity(publication.identity, currentPublishedIdentity) || hardlinkChanged) throw new Error(`Generated TLS output changed during publication: ${finalPath}`);
	return {
		degradationReasons,
		identity: publication.identity
	};
}
async function generateSelfSignedCert(params) {
	const certDir = await canonicalPathFromExistingAncestor(path.dirname(params.certPath));
	const keyDir = await canonicalPathFromExistingAncestor(path.dirname(params.keyPath));
	const certDirectory = await ensureDurableDirectory({ directoryPath: certDir });
	const keyDirectory = keyDir === certDir ? certDirectory : await ensureDurableDirectory({ directoryPath: keyDir });
	const opensslBin = resolveSystemBin("openssl");
	if (!opensslBin) throw new Error("openssl not found in trusted system directories. Install it in an OS-managed location.");
	const certStageDir = await fs.mkdtemp(path.join(certDir, ".openclaw-gateway-tls-cert-"));
	const stagedCertPath = path.join(certStageDir, "cert.pem");
	let keyStageDir;
	try {
		keyStageDir = await fs.mkdtemp(path.join(keyDir, ".openclaw-gateway-tls-key-"));
		const stagedKeyPath = path.join(keyStageDir, "key.pem");
		await Promise.all([fs.chmod(certStageDir, 448), fs.chmod(keyStageDir, 448)]);
		await runExec(opensslBin, [
			"req",
			"-x509",
			"-newkey",
			"rsa:2048",
			"-sha256",
			"-days",
			"3650",
			"-nodes",
			"-keyout",
			stagedKeyPath,
			"-out",
			stagedCertPath,
			"-subj",
			"/CN=openclaw-gateway"
		], {
			logOutput: false,
			timeoutMs: GATEWAY_TLS_CERT_GENERATION_TIMEOUT_MS
		});
		await Promise.all([fs.chmod(stagedKeyPath, 384), fs.chmod(stagedCertPath, 384)]);
		const [cert, key] = await Promise.all([fs.readFile(stagedCertPath, "utf8"), fs.readFile(stagedKeyPath, "utf8")]);
		tls.createSecureContext({
			cert,
			key,
			minVersion: "TLSv1.3"
		});
		const degradationReasons = /* @__PURE__ */ new Set();
		if (certDirectory.parentSync.status === "unsupported" || keyDirectory.parentSync.status === "unsupported") degradationReasons.add("directory durability unavailable");
		(await publishGeneratedTlsOutput(stagedCertPath, path.join(certDirectory.path, path.basename(params.certPath)))).degradationReasons.forEach((reason) => degradationReasons.add(reason));
		(await publishGeneratedTlsOutput(stagedKeyPath, path.join(keyDirectory.path, path.basename(params.keyPath)))).degradationReasons.forEach((reason) => degradationReasons.add(reason));
		for (const reason of degradationReasons) {
			const degradation = gatewayTlsDegradation(reason);
			params.log?.warn?.(`[GATEWAY_TLS_DEGRADED] best-effort gateway:tls: ${degradation.reason}.`, degradation);
		}
		params.log?.info?.(`gateway tls: generated self-signed cert at ${shortenHomeInString(params.certPath)}`);
	} finally {
		await Promise.allSettled([certStageDir, keyStageDir].filter((dir) => Boolean(dir)).map((dir) => fs.rm(dir, {
			force: true,
			recursive: true
		})));
	}
}
/** Load or generate gateway TLS material and return server-ready TLS options. */
async function loadGatewayTlsRuntime(cfg, log) {
	if (!cfg || cfg.enabled !== true) return {
		enabled: false,
		required: false
	};
	const autoGenerate = cfg.autoGenerate !== false;
	const baseDir = path.join(CONFIG_DIR, "gateway", "tls");
	const certPath = resolveUserPath(typeof cfg.certPath === "string" && cfg.certPath.trim() ? cfg.certPath : path.join(baseDir, "gateway-cert.pem"));
	const keyPath = resolveUserPath(typeof cfg.keyPath === "string" && cfg.keyPath.trim() ? cfg.keyPath : path.join(baseDir, "gateway-key.pem"));
	const caPath = cfg.caPath ? resolveUserPath(cfg.caPath) : void 0;
	const hasCert = await pathExists(certPath);
	const hasKey = await pathExists(keyPath);
	if (!hasCert && !hasKey && autoGenerate) try {
		await generateSelfSignedCert({
			certPath,
			keyPath,
			log
		});
	} catch (err) {
		return {
			enabled: false,
			required: true,
			certPath,
			keyPath,
			error: `gateway tls: failed to generate cert (${String(err)})`
		};
	}
	if (!await pathExists(certPath) || !await pathExists(keyPath)) return {
		enabled: false,
		required: true,
		certPath,
		keyPath,
		error: "gateway tls: cert/key missing"
	};
	try {
		const cert = await fs.readFile(certPath, "utf8");
		const key = await fs.readFile(keyPath, "utf8");
		const ca = caPath ? await fs.readFile(caPath, "utf8") : void 0;
		const fingerprintSha256 = normalizeTlsFingerprint(new X509Certificate(cert).fingerprint256 ?? "");
		if (!fingerprintSha256) return {
			enabled: false,
			required: true,
			certPath,
			keyPath,
			caPath,
			error: "gateway tls: unable to compute certificate fingerprint"
		};
		return {
			enabled: true,
			required: true,
			certPath,
			keyPath,
			caPath,
			fingerprintSha256,
			tlsOptions: {
				cert,
				key,
				ca,
				minVersion: "TLSv1.3"
			}
		};
	} catch (err) {
		return {
			enabled: false,
			required: true,
			certPath,
			keyPath,
			caPath,
			error: `gateway tls: failed to load cert (${String(err)})`
		};
	}
}
//#endregion
export { loadGatewayTlsRuntime as t };
