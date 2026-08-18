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
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// CORS headers for Vercel
app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (_req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  next();
});

registerStorageProxy(app);
registerOAuthRoutes(app);
registerPaystackWebhook(app);

const trpcHandler = createExpressMiddleware({
  router: appRouter,
  createContext,
});

// Mount at all possible paths Vercel might pass
app.use("/api/trpc", trpcHandler);
app.use("/trpc", trpcHandler);
app.use("/", trpcHandler);

export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req as any, res as any);
}
