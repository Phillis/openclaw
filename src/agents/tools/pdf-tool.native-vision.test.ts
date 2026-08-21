import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as pdfExtractModule from "../../media/pdf-extract.js";
import * as webMedia from "../../media/web-media.js";
import * as modelAuth from "../model-auth.js";
import * as preparedModelRuntime from "../prepared-model-runtime.js";
import * as pdfModelConfigModule from "./pdf-tool.model-config.js";
import {
  createPdfToolInfraStub,
  FAKE_PDF_MEDIA,
  resetPdfToolAuthEnv,
  withTempPdfAgentDir,
} from "./pdf-tool.test-support.js";

const completeMock = vi.hoisted(() => vi.fn());
const registerProviderStreamForModelMock = vi.hoisted(() => vi.fn());
const { stubPdfToolInfra } = createPdfToolInfraStub(completeMock);

vi.mock("../../llm/stream.js", async () => {
  const actual = await vi.importActual<typeof import("../../llm/stream.js")>("../../llm/stream.js");
  return { ...actual, complete: completeMock };
});
vi.mock("../provider-stream.js", () => ({
  registerProviderStreamForModel: registerProviderStreamForModelMock,
}));

const TINY_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAADUlEQVR4nGP4////KwAJ5gPoxLp9owAAAABJRU5ErkJggg==";

type PdfToolModule = typeof import("./pdf-tool.js");
let createPdfTool: PdfToolModule["createPdfTool"];

async function loadCreatePdfTool() {
  createPdfTool ??= (await import("./pdf-tool.js")).createPdfTool;
  return createPdfTool;
}

describe("createPdfTool native vision", () => {
  beforeEach(() => {
    resetPdfToolAuthEnv();
    completeMock.mockReset();
    registerProviderStreamForModelMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns rendered pages without nested model setup", async () => {
    await withTempPdfAgentDir(async (agentDir) => {
      const resolveSpy = vi.spyOn(pdfModelConfigModule, "resolvePdfModelConfigForTool");
      const acquireSpy = vi.spyOn(preparedModelRuntime, "acquireAgentRunPreparedModelRuntime");
      const getApiKeySpy = vi.spyOn(modelAuth, "getApiKeyForModelCore");
      const requireApiKeySpy = vi.spyOn(modelAuth, "requireApiKey");
      vi.spyOn(webMedia, "loadWebMediaRaw").mockResolvedValue(FAKE_PDF_MEDIA as never);
      const extractSpy = vi.spyOn(pdfExtractModule, "extractPdfContent").mockResolvedValue({
        text: "Visible heading and chart labels",
        images: [{ type: "image", data: TINY_PNG_BASE64, mimeType: "image/png", page: 1 }],
      });
      const tool = (await loadCreatePdfTool())({ agentDir, modelHasVision: true });
      if (!tool) {
        throw new Error("expected pdf tool");
      }
      expect(tool.catalogMode).toBe("direct-only");
      expect(tool.description).toContain("direct visual inspection");
      expect(
        (tool.parameters as { properties?: Record<string, unknown> }).properties,
      ).not.toHaveProperty("model");

      const result = await tool.execute("t1", {
        prompt: "Inspect the page layout",
        pdf: "/tmp/doc.pdf",
        pages: "1",
        password: " secret ",
      });

      expect(extractSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          minTextChars: Number.MAX_SAFE_INTEGER,
          pageNumbers: [1],
          password: " secret ",
        }),
      );
      expect(result.content).toEqual([
        { type: "text", text: "[PDF text]\nVisible heading and chart labels" },
        { type: "text", text: "[PDF page 1]" },
        { type: "image", data: TINY_PNG_BASE64, mimeType: "image/png" },
        { type: "text", text: "Inspect the page layout" },
      ]);
      expect(result.details).toMatchObject({
        transport: "native",
        pdf: "/tmp/doc.pdf",
        media: { outbound: false },
      });
      expect(resolveSpy).not.toHaveBeenCalled();
      expect(acquireSpy).not.toHaveBeenCalled();
      expect(completeMock).not.toHaveBeenCalled();
      expect(registerProviderStreamForModelMock).not.toHaveBeenCalled();
      expect(getApiKeySpy).not.toHaveBeenCalled();
      expect(requireApiKeySpy).not.toHaveBeenCalled();
    });
  });

  it("preserves unlabeled image content for the nonvision nested fallback", async () => {
    await withTempPdfAgentDir(async (agentDir) => {
      await stubPdfToolInfra(agentDir, {
        provider: "openai",
        api: "openai-responses",
        input: ["text", "image"],
      });
      vi.spyOn(pdfExtractModule, "extractPdfContent").mockResolvedValue({
        text: "Extracted content",
        images: [{ type: "image", data: TINY_PNG_BASE64, mimeType: "image/png", page: 1 }],
      });
      completeMock.mockResolvedValue({
        role: "assistant",
        stopReason: "stop",
        content: [{ type: "text", text: "fallback summary" }],
      } as never);
      const tool = (await loadCreatePdfTool())({
        agentDir,
        config: {
          agents: { defaults: { pdfModel: { primary: "openai/gpt-5.4-mini" } } },
        },
      });
      if (!tool) {
        throw new Error("expected pdf tool");
      }

      await tool.execute("t1", { prompt: "Summarize", pdf: "/tmp/doc.pdf" });

      const context = completeMock.mock.calls[0]?.[1] as
        | { messages?: Array<{ content?: unknown }> }
        | undefined;
      expect(context?.messages?.[0]?.content).toEqual([
        { type: "text", text: "[PDF text]\nExtracted content" },
        { type: "image", data: TINY_PNG_BASE64, mimeType: "image/png" },
        { type: "text", text: "Summarize" },
      ]);
    });
  });

  it("fails closed when page rendering returns no image", async () => {
    await withTempPdfAgentDir(async (agentDir) => {
      vi.spyOn(webMedia, "loadWebMediaRaw").mockResolvedValue(FAKE_PDF_MEDIA as never);
      vi.spyOn(pdfExtractModule, "extractPdfContent").mockResolvedValue({
        text: "Text-only extraction",
        images: [],
      });
      const acquireSpy = vi.spyOn(preparedModelRuntime, "acquireAgentRunPreparedModelRuntime");
      const tool = (await loadCreatePdfTool())({ agentDir, modelHasVision: true });
      if (!tool) {
        throw new Error("expected pdf tool");
      }

      await expect(
        tool.execute("t1", { prompt: "Inspect visually", pdf: "/tmp/doc.pdf" }),
      ).rejects.toThrow("every document in direct visual inspection");
      expect(acquireSpy).not.toHaveBeenCalled();
      expect(completeMock).not.toHaveBeenCalled();
    });
  });

  it("rejects partial multi-PDF rendering and applies aggregate budgets", async () => {
    await withTempPdfAgentDir(async (agentDir) => {
      vi.spyOn(webMedia, "loadWebMediaRaw").mockResolvedValue(FAKE_PDF_MEDIA as never);
      const extractSpy = vi
        .spyOn(pdfExtractModule, "extractPdfContent")
        .mockResolvedValueOnce({
          text: "",
          images: [{ type: "image", data: TINY_PNG_BASE64, mimeType: "image/png", page: 1 }],
        })
        .mockResolvedValueOnce({ text: "text only", images: [] });
      const tool = (await loadCreatePdfTool())({ agentDir, modelHasVision: true });
      if (!tool) {
        throw new Error("expected pdf tool");
      }

      await expect(
        tool.execute("t1", { prompt: "Compare", pdfs: ["/tmp/a.pdf", "/tmp/b.pdf"] }),
      ).rejects.toThrow("every document in direct visual inspection");
      expect(extractSpy).toHaveBeenCalledTimes(2);
      expect(extractSpy).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ maxPages: 10, maxPixels: 2_000_000 }),
      );
    });
  });

  it("labels every document and page in a textless multi-PDF result", async () => {
    await withTempPdfAgentDir(async (agentDir) => {
      vi.spyOn(webMedia, "loadWebMediaRaw").mockResolvedValue(FAKE_PDF_MEDIA as never);
      vi.spyOn(pdfExtractModule, "extractPdfContent")
        .mockResolvedValueOnce({
          text: "",
          images: [{ type: "image", data: TINY_PNG_BASE64, mimeType: "image/png", page: 2 }],
        })
        .mockResolvedValueOnce({
          text: "",
          images: [{ type: "image", data: TINY_PNG_BASE64, mimeType: "image/png", page: 4 }],
        });
      const tool = (await loadCreatePdfTool())({ agentDir, modelHasVision: true });
      if (!tool) {
        throw new Error("expected pdf tool");
      }

      const result = await tool.execute("t1", {
        prompt: "Compare layouts",
        pdfs: ["/tmp/a.pdf", "/tmp/b.pdf"],
      });

      expect(result.content.map((block) => (block.type === "text" ? block.text : "image"))).toEqual(
        ["[PDF 1 page 2]", "image", "[PDF 2 page 4]", "image", "Compare layouts"],
      );
    });
  });

  it("rejects selected pages above the aggregate cap before loading media", async () => {
    await withTempPdfAgentDir(async (agentDir) => {
      const loadSpy = vi.spyOn(webMedia, "loadWebMediaRaw");
      const tool = (await loadCreatePdfTool())({ agentDir, modelHasVision: true });
      if (!tool) {
        throw new Error("expected pdf tool");
      }

      await expect(
        tool.execute("t1", {
          prompt: "Inspect",
          pdfs: ["/tmp/a.pdf", "/tmp/b.pdf"],
          pages: "1-11",
        }),
      ).rejects.toThrow("limited to 20 total rendered pages");
      expect(loadSpy).not.toHaveBeenCalled();
    });
  });

  it("rejects rendered images removed by sanitization", async () => {
    await withTempPdfAgentDir(async (agentDir) => {
      vi.spyOn(webMedia, "loadWebMediaRaw").mockResolvedValue(FAKE_PDF_MEDIA as never);
      vi.spyOn(pdfExtractModule, "extractPdfContent").mockResolvedValue({
        text: "",
        images: [{ type: "image", data: "%%%", mimeType: "image/png", page: 1 }],
      });
      const tool = (await loadCreatePdfTool())({ agentDir, modelHasVision: true });
      if (!tool) {
        throw new Error("expected pdf tool");
      }

      await expect(tool.execute("t1", { prompt: "Inspect", pdf: "/tmp/doc.pdf" })).rejects.toThrow(
        "sanitization removed one or more rendered pages",
      );
    });
  });

  it("rejects an abort that occurs while PDF extraction is in flight", async () => {
    await withTempPdfAgentDir(async (agentDir) => {
      vi.spyOn(webMedia, "loadWebMediaRaw").mockResolvedValue(FAKE_PDF_MEDIA as never);
      let resolveExtraction!: (value: {
        text: string;
        images: Array<{ type: "image"; data: string; mimeType: string; page: number }>;
      }) => void;
      const extraction = new Promise<Parameters<typeof resolveExtraction>[0]>((resolve) => {
        resolveExtraction = resolve;
      });
      const extractSpy = vi
        .spyOn(pdfExtractModule, "extractPdfContent")
        .mockReturnValue(extraction);
      const tool = (await loadCreatePdfTool())({ agentDir, modelHasVision: true });
      if (!tool) {
        throw new Error("expected pdf tool");
      }
      const controller = new AbortController();
      const execution = tool.execute(
        "t1",
        { prompt: "Inspect", pdf: "/tmp/doc.pdf" },
        controller.signal,
      );
      await vi.waitFor(() => expect(extractSpy).toHaveBeenCalledTimes(1));
      controller.abort();
      resolveExtraction({
        text: "",
        images: [{ type: "image", data: TINY_PNG_BASE64, mimeType: "image/png", page: 1 }],
      });

      await expect(execution).rejects.toThrow();
      expect(completeMock).not.toHaveBeenCalled();
    });
  });
});
