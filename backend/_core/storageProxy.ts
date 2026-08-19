import type { Express } from "express";
import { storageGet } from "../storage";

export function registerStorageProxy(app: Express) {
  // Legacy /manus-storage compatibility redirect
  app.get("/manus-storage/*", async (req, res) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    try {
      const { url } = await storageGet(key);
      if (url.startsWith("data:")) {
        const parts = url.split(",");
        const mime = parts[0]?.match(/:(.*?);/)?.[1] || "image/jpeg";
        const imgBuffer = Buffer.from(parts[1], "base64");
        res.setHeader("Content-Type", mime);
        res.setHeader("Cache-Control", "public, max-age=86400");
        res.send(imgBuffer);
        return;
      }
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] redirect error:", err);
      res.status(404).send("File not found");
    }
  });
}
