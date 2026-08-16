import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

/**
 * A stale browser document can still request Vite's development client after
 * the managed preview has disabled HMR. Return an inert module instead of the
 * real client so that request cannot attempt a connection through an unavailable
 * proxy. The replacement preserves Vite's transformed-module exports.
 */
export const DISABLED_VITE_CLIENT_MODULE = `// Managed preview: Vite HMR is intentionally disabled.
const styleElements = new Map();

function createHotContext() {
  const noop = () => {};
  return {
    data: {},
    accept: noop,
    acceptExports: noop,
    dispose: noop,
    prune: noop,
    decline: noop,
    invalidate: noop,
    on: noop,
    off: noop,
    send: noop,
  };
}

function updateStyle(id, content) {
  let style = styleElements.get(id);
  if (!style) {
    style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.setAttribute("data-vite-dev-id", id);
    document.head.appendChild(style);
    styleElements.set(id, style);
  }
  style.textContent = content;
}

function removeStyle(id) {
  const style = styleElements.get(id) || document.querySelector('style[data-vite-dev-id="' + id + '"]');
  style?.remove();
  styleElements.delete(id);
}

function injectQuery(url, queryToInject) {
  const [path, hash = ""] = url.split("#");
  const separator = path.includes("?") ? "&" : "?";
  return path + separator + queryToInject + (hash ? "#" + hash : "");
}

class ErrorOverlay extends HTMLElement {
  constructor(error) {
    super();
    this.textContent = error?.message || "Development preview error";
  }
}

export { ErrorOverlay, createHotContext, injectQuery, removeStyle, updateStyle };
`;

export async function setupVite(app: Express, server: Server) {
  const configuredHmr = viteConfig.server?.hmr;
  const serverOptions = {
    ...viteConfig.server,
    middlewareMode: true,
    // Respect an explicitly disabled client HMR mode. When HMR is enabled,
    // attach its WebSocket server to Express as before.
    hmr:
      configuredHmr === false
        ? false
        : { ...(typeof configuredHmr === "object" ? configuredHmr : {}), server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  // This route must precede Vite middleware. It protects an already-cached
  // HTML shell that still references /@vite/client from creating a failed HMR
  // WebSocket after the managed preview has switched to no-HMR mode.
  app.get("/@vite/client", (_req, res) => {
    res
      .status(200)
      .set({
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "no-store, max-age=0",
      })
      .send(DISABLED_VITE_CLIENT_MODULE);
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "frontend",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res
        .status(200)
        .set({
          "Content-Type": "text/html",
          "Cache-Control": "no-store, max-age=0",
        })
        .end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
