import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "../backend/_core/oauth";
import { registerStorageProxy } from "../backend/_core/storageProxy";
import { registerPaystackWebhook } from "../backend/routers/payments";
import { appRouter } from "../backend/routers";
import { createContext } from "../backend/_core/context";

const app = express();

// 1. CORS headers first before anything else (compatible with credentialed requests)
app.use((req, res, next) => {
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,x-trpc-source");
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  next();
});

// URL Normalizer: Cleanly strip /api/trpc, /trpc, or /api prefixes so tRPC receives the pure procedure name
app.use((req, _res, next) => {
  let url = req.url || "/";
  if (url.startsWith("/api/trpc")) {
    url = url.slice("/api/trpc".length) || "/";
  } else if (url.startsWith("/trpc")) {
    url = url.slice("/trpc".length) || "/";
  } else if (url.startsWith("/api/")) {
    url = url.slice("/api".length) || "/";
  }
  req.url = url;
  next();
});

// 2. Safe body parsing for Vercel serverless environment (handles both pre-parsed and unparsed bodies)
app.use((req, res, next) => {
  if (req.body && typeof req.body === "object") {
    return next();
  }
  express.json({ limit: "50mb" })(req, res, (err) => {
    if (err) return next(err);
    express.urlencoded({ limit: "50mb", extended: true })(req, res, next);
  });
});

registerStorageProxy(app);
registerOAuthRoutes(app);
registerPaystackWebhook(app);

const trpcHandler = createExpressMiddleware({
  router: appRouter,
  createContext,
  onError({ error, path }) {
    console.error(`[tRPC Error on ${path}]:`, error);
  },
});

app.use(trpcHandler);

// Fallback error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("[Vercel API Handler Error]:", err);
  if (!res.headersSent) {
    res.status(err.status || 500).json({ error: err.message || "Internal server error" });
  }
});

export const config = {
  maxDuration: 60,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log(`[Vercel API] ${req.method} ${req.url} (body: ${typeof req.body === 'object' ? 'pre-parsed' : typeof req.body})`);
    return await (app as any)(req, res);
  } catch (err: any) {
    console.error("[Vercel API] Unhandled error in handler:", err?.message || err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error", detail: String(err?.message || err) });
    }
  }
}
