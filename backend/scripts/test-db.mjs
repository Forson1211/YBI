import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("❌ DATABASE_URL not set");
  process.exit(1);
}

console.log("🔗 Connecting to:", url.replace(/:([^@]+)@/, ":[HIDDEN]@"));

const sql = postgres(url, { ssl: "require", connect_timeout: 15 });

try {
  const result = await sql`SELECT current_database(), version()`;
  console.log("✅ Connected to Supabase!");
  console.log("   Database:", result[0].current_database);
  console.log("   Version:", result[0].version.split(" ").slice(0, 2).join(" "));
} catch (err) {
  console.error("❌ Connection failed:", err.message);
} finally {
  await sql.end();
  process.exit(0);
}
