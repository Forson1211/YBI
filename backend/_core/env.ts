const DEFAULT_SUPABASE_URL = "https://ahttzsovlbdzhmjukdwr.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodHR6c292bGJkemhtanVrZHdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4OTY3MzAsImV4cCI6MjEwMjQ3MjczMH0.f7a9Y8JLdxlgrmbOraBsz1_S_NoUPkfxqKYzl5_Co6k";
const DEFAULT_SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodHR6c292bGJkemhtanVrZHdyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njg5NjczMCwiZXhwIjoyMTAyNDcyNzMwfQ.7SqkHGEVRoQ4N9e8nPWTeVw5ChvrQRv5GiwifNfzguY";
const DEFAULT_DATABASE_URL = "postgresql://postgres.ahttzsovlbdzhmjukdwr:Forsonodonkor%401211@aws-0-us-east-1.pooler.supabase.com:6543/postgres";

export const ENV = {
  appId: process.env.VITE_APP_ID ?? "ybi-community-platform",
  cookieSecret: process.env.JWT_SECRET || process.env.COOKIE_SECRET || "ybi-secure-admin-session-cookie-key-2026",
  databaseUrl: (process.env.DATABASE_URL || DEFAULT_DATABASE_URL).trim(),
  supabaseUrl: process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SUPABASE_SERVICE_ROLE_KEY,
  supabaseBucket: process.env.SUPABASE_STORAGE_BUCKET || "ybi-storage",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL || process.env.OPENAI_BASE_URL || "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY || process.env.OPENAI_API_KEY || "",
};
