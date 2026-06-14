// Remote health capability tests cover configured model endpoint and gateway probes.
import { afterEach, describe, expect, it, vi } from "vitest";
import { getHealthRemoteCapabilitiesSnapshot } from "./health.remote-capabilities.js";

describe("health remote capabilities", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("probes configured memory endpoints and remote gateway health", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url === "http://127.0.0.1:1234/v1/models") {
        return Response.json({
          data: [{ id: "text-embedding-qwen3-embedding-8b" }],
        });
      }
      if (url === "http://127.0.0.1:5678/healthz") {
        return new Response("ok", { status: 200 });
      }
      throw new Error(`unexpected probe ${url}`);
    });
    globalThis.fetch = fetchMock as typeof fetch;

    const result = await getHealthRemoteCapabilitiesSnapshot({
      bypassCache: true,
      defaultAgentId: "main",
      cfg: {
        gateway: {
          remote: {
            url: "ws://127.0.0.1:5678",
          },
        },
        agents: {
          list: [
            {
              id: "main",
              memorySearch: {
                provider: "openai-compatible",
                model: "text-embedding-qwen3-embedding-8b",
                remote: {
                  baseUrl: "http://127.0.0.1:1234/v1",
                },
              },
            },
          ],
        },
      },
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result.modelEndpoints?.state).toBe("ok");
    expect(result.modelEndpoints?.probes[0]).toMatchObject({
      id: "memory-search",
      label: "memory embeddings",
      state: "ok",
      status: 200,
      url: "http://127.0.0.1:1234/v1",
    });
    expect(result.modelEndpoints?.detail).toContain("1/1 reachable");
    expect(result.gateway).toMatchObject({
      state: "ok",
      status: 200,
      url: "ws://127.0.0.1:5678",
    });
  });

  it("recognizes Ollama tag responses when checking configured models", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url === "http://127.0.0.1:11434/api/tags") {
        return Response.json({
          models: [{ name: "nomic-embed-text" }],
        });
      }
      throw new Error(`unexpected probe ${url}`);
    });
    globalThis.fetch = fetchMock as typeof fetch;

    const result = await getHealthRemoteCapabilitiesSnapshot({
      bypassCache: true,
      defaultAgentId: "main",
      cfg: {
        agents: {
          list: [
            {
              id: "main",
              memorySearch: {
                provider: "ollama",
                model: "nomic-embed-text",
                remote: {
                  baseUrl: "http://127.0.0.1:11434",
                },
              },
            },
          ],
        },
      },
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(result.modelEndpoints?.state).toBe("ok");
    expect(result.modelEndpoints?.probes[0]).toMatchObject({
      id: "memory-search",
      state: "ok",
      detail: "http://127.0.0.1:11434 reachable · 1/1 models visible",
    });
  });
});
