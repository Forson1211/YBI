export const ENV = {
  appId: process.env.VITE_APP_ID ?? "ybi-community-platform",
  cookieSecret: process.env.JWT_SECRET || process.env.COOKIE_SECRET || "ybi-secure-admin-session-cookie-key-2026",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL || process.env.OPENAI_BASE_URL || "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY || process.env.OPENAI_API_KEY || "",
};
