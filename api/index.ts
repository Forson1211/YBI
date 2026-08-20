import "dotenv/config";
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
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,x-trpc-source,Cookie");
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
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

app.use("/api/trpc", trpcHandler);
app.use("/trpc", trpcHandler);

// Clean fallback for Vercel serverless functions when routed directly or with stripped path
app.use((req, res, next) => {
  const url = req.url || "/";
  if (
    !url.startsWith("/api/oauth") &&
    !url.startsWith("/oauth") &&
    !url.startsWith("/api/webhooks") &&
    !url.startsWith("/webhooks") &&
    !url.startsWith("/manus-storage") &&
    !url.startsWith("/api/manus-storage") &&
    !url.startsWith("/uploads") &&
    !url.startsWith("/api/uploads")
  ) {
    return trpcHandler(req, res, next);
  }
  next();
});

// Fallback error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("[Vercel API Handler Error]:", err);
  if (!res.headersSent) {
    res.status(err.status || 500).json({ error: err.message || "Internal server error" });
  }
});

export default function handler(req: any, res: any) {
  return new Promise((resolve) => {
    res.on("finish", resolve);
    res.on("close", resolve);
    (app as any)(req, res);
  });
}
