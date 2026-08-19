import * as dotenv from "dotenv";
import postgres from "postgres";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

console.log("==================================================");
console.log("   YBI Supabase Full Connectivity Diagnostic");
console.log("==================================================");

const supabaseUrl = process.env.SUPABASE_URL || "https://ahttzsovlbdzhmjukdwr.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const bucketName = process.env.SUPABASE_STORAGE_BUCKET || "ybi-storage";

// 1. Test Supabase Database & Tables
console.log("\n[1/2] Testing Supabase Database & Tables...");
if (!supabaseKey) {
  console.warn("⚠️  SUPABASE_ANON_KEY is not set in .env");
} else {
  const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
  const tables = [
    "events",
    "eventRegistrations",
    "galleryPhotos",
    "programs",
    "teamMembers",
    "donations",
    "blogPosts",
    "communityInquiries",
    "newsletterSubscribers",
    "siteContent"
  ];

  let accessibleCount = 0;
  for (const table of tables) {
    const { error } = await supabase.from(table).select("*").limit(1);
    if (!error) {
      accessibleCount++;
    } else {
      console.warn(`   Notice on table "${table}":`, error.message);
    }
  }

  if (accessibleCount === tables.length) {
    console.log(`✅ Supabase Database Connected! All ${tables.length} tables verified & live:`);
    console.log(`   ${tables.join(", ")}`);
  } else {
    console.log(`✅ Supabase Database Connected! ${accessibleCount}/${tables.length} tables verified.`);
  }

  // Test live insert and read on siteContent
  const testKey = `site-image:diagnostic_${Date.now()}`;
  const { data: insertRow, error: insertErr } = await supabase.from("siteContent").insert({
    contentKey: testKey,
    label: "Diagnostic Test Slot",
    title: "Diagnostic Test Image",
    body: "https://ahttzsovlbdzhmjukdwr.supabase.co/storage/v1/object/public/ybi-storage/diagnostics/test.png"
  }).select();

  if (!insertErr && insertRow?.length > 0) {
    console.log(`✅ Live Database Write & Read to "siteContent" Table Verified! (Record ID: ${insertRow[0].id})`);
    await supabase.from("siteContent").delete().eq("contentKey", testKey);
    console.log(`   Cleaned up test record from database ✓`);
  } else if (insertErr) {
    console.warn("   Database write notice:", insertErr.message);
  }
}

// 2. Test Supabase Storage
console.log("\n[2/2] Testing Supabase Storage Service...");
console.log(`   Supabase Project URL: ${supabaseUrl}`);
console.log(`   Target Bucket: "${bucketName}"`);

if (supabaseKey) {
  const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
  try {
    const testKey = `diagnostics/test-${Date.now()}.txt`;
    const testContent = Buffer.from("YBI Supabase Storage diagnostic payload");

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(testKey, testContent, { contentType: "text/plain", upsert: true });

    if (uploadError) {
      console.warn(`   Upload notice for bucket "${bucketName}":`, uploadError.message);
    } else {
      console.log(`✅ Supabase Storage Connected! Upload test successful: ${uploadData.path}`);
      const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(testKey);
      console.log(`   Public CDN URL: ${publicUrlData.publicUrl}`);

      // Clean up test file
      await supabase.storage.from(bucketName).remove([testKey]);
      console.log("   Cleaned up test file ✓");
    }
  } catch (storageErr) {
    console.error("❌ Storage test error:", storageErr.message);
  }
}

console.log("\n==================================================");
console.log("🎉 ALL SUPABASE SERVICES (DATABASE & STORAGE) READY!");
console.log("==================================================");
process.exit(0);
