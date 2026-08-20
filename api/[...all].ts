import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "./index";

export default function handler(req: VercelRequest, res: VercelResponse) {
  return new Promise((resolve) => {
    res.on("finish", resolve);
    res.on("close", resolve);
    (app as any)(req, res);
  });
}
