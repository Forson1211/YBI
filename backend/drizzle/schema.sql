-- ============================================================================
-- Young Beginners Inspiration (YBI) - Complete Supabase PostgreSQL Schema
-- Run this in the Supabase Dashboard -> SQL Editor
-- ============================================================================

-- 1. Create Enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE program_status AS ENUM ('draft', 'published');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE content_status AS ENUM ('draft', 'published');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE inquiry_status AS ENUM ('new', 'in_progress', 'responded', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE session_status AS ENUM ('draft', 'published', 'complete');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE opportunity_status AS ENUM ('draft', 'published', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE impact_status AS ENUM ('active', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'success', 'failed', 'free');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE blog_status AS ENUM ('draft', 'published');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Tables

CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL PRIMARY KEY,
    "openId" VARCHAR(64) NOT NULL UNIQUE,
    "name" TEXT,
    "email" VARCHAR(320),
    "loginMethod" VARCHAR(64),
    "role" user_role DEFAULT 'user' NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "lastSignedIn" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "galleryPhotos" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(160) NOT NULL,
    "altText" VARCHAR(240) NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "storageKey" VARCHAR(500) NOT NULL,
    "isPublished" BOOLEAN DEFAULT true NOT NULL,
    "sortOrder" INTEGER DEFAULT 0 NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "programs" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(160) NOT NULL,
    "category" VARCHAR(80) NOT NULL,
    "summary" TEXT NOT NULL,
    "status" program_status DEFAULT 'draft' NOT NULL,
    "sortOrder" INTEGER DEFAULT 0 NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "updates" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(180) NOT NULL,
    "excerpt" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" content_status DEFAULT 'draft' NOT NULL,
    "publishedAt" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "siteContent" (
    "id" SERIAL PRIMARY KEY,
    "contentKey" VARCHAR(100) NOT NULL UNIQUE,
    "label" VARCHAR(140) NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "actionLabel" VARCHAR(100),
    "actionHref" VARCHAR(300),
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "communityInquiries" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(140) NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "interest" VARCHAR(100) NOT NULL,
    "message" TEXT NOT NULL,
    "status" inquiry_status DEFAULT 'new' NOT NULL,
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "programSessions" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(180) NOT NULL,
    "focusArea" VARCHAR(100) NOT NULL,
    "details" TEXT NOT NULL,
    "scheduledFor" TIMESTAMP NOT NULL,
    "venue" VARCHAR(180) NOT NULL,
    "capacity" INTEGER,
    "status" session_status DEFAULT 'draft' NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "opportunities" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(180) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "summary" TEXT NOT NULL,
    "commitment" VARCHAR(160) NOT NULL,
    "status" opportunity_status DEFAULT 'draft' NOT NULL,
    "sortOrder" INTEGER DEFAULT 0 NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "impactMetrics" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(160) NOT NULL,
    "focusArea" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "currentValue" INTEGER DEFAULT 0 NOT NULL,
    "targetValue" INTEGER,
    "unit" VARCHAR(60) NOT NULL,
    "period" VARCHAR(100) NOT NULL,
    "status" impact_status DEFAULT 'active' NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "events" (
    "id" SERIAL PRIMARY KEY,
    "slug" VARCHAR(200) NOT NULL UNIQUE,
    "title" VARCHAR(180) NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "scheduledFor" TIMESTAMP NOT NULL,
    "location" VARCHAR(240) NOT NULL,
    "capacity" INTEGER,
    "isFree" BOOLEAN DEFAULT true NOT NULL,
    "priceGhs" INTEGER DEFAULT 0 NOT NULL,
    "status" event_status DEFAULT 'draft' NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "eventRegistrations" (
    "id" SERIAL PRIMARY KEY,
    "eventId" INTEGER NOT NULL,
    "name" VARCHAR(140) NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "phone" VARCHAR(30) NOT NULL,
    "smsOptIn" BOOLEAN DEFAULT false NOT NULL,
    "paystackRef" VARCHAR(100),
    "paymentStatus" payment_status DEFAULT 'pending' NOT NULL,
    "isWaitlist" BOOLEAN DEFAULT false NOT NULL,
    "confirmedAt" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "blogPosts" (
    "id" SERIAL PRIMARY KEY,
    "slug" VARCHAR(220) NOT NULL UNIQUE,
    "title" VARCHAR(200) NOT NULL,
    "excerpt" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "authorName" VARCHAR(120) NOT NULL,
    "coverImageUrl" TEXT,
    "category" VARCHAR(80) NOT NULL,
    "status" blog_status DEFAULT 'draft' NOT NULL,
    "publishedAt" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "donations" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(140) NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "phone" VARCHAR(30),
    "amountGhs" INTEGER NOT NULL,
    "message" TEXT,
    "paystackRef" VARCHAR(100),
    "paymentStatus" payment_status DEFAULT 'pending' NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "faqItems" (
    "id" SERIAL PRIMARY KEY,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" VARCHAR(80) NOT NULL,
    "sortOrder" INTEGER DEFAULT 0 NOT NULL,
    "isPublished" BOOLEAN DEFAULT true NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "newsletterSubscribers" (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(320) NOT NULL UNIQUE,
    "name" VARCHAR(140),
    "phone" VARCHAR(30),
    "smsOptIn" BOOLEAN DEFAULT false NOT NULL,
    "subscribedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "smsLogs" (
    "id" SERIAL PRIMARY KEY,
    "recipientPhone" VARCHAR(30) NOT NULL,
    "message" TEXT NOT NULL,
    "provider" VARCHAR(40) DEFAULT 'africastalking' NOT NULL,
    "status" VARCHAR(40) DEFAULT 'queued' NOT NULL,
    "providerRef" VARCHAR(100),
    "sentAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS "teamMembers" (
    "id" SERIAL PRIMARY KEY,
    "slug" VARCHAR(180) NOT NULL UNIQUE,
    "name" VARCHAR(140) NOT NULL,
    "role" VARCHAR(100) NOT NULL,
    "bio" TEXT NOT NULL,
    "imageUrl" TEXT DEFAULT '' NOT NULL,
    "email" VARCHAR(320),
    "linkedIn" VARCHAR(300),
    "sortOrder" INTEGER DEFAULT 0 NOT NULL,
    "isPublished" BOOLEAN DEFAULT true NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- 3. Create Helpful Indexes
CREATE INDEX IF NOT EXISTS idx_events_slug ON "events"("slug");
CREATE INDEX IF NOT EXISTS idx_events_status ON "events"("status");
CREATE INDEX IF NOT EXISTS idx_event_reg_event ON "eventRegistrations"("eventId");
CREATE INDEX IF NOT EXISTS idx_blog_slug ON "blogPosts"("slug");
CREATE INDEX IF NOT EXISTS idx_team_slug ON "teamMembers"("slug");
CREATE INDEX IF NOT EXISTS idx_site_content_key ON "siteContent"("contentKey");

-- 4. Create Public Supabase Storage Bucket ('ybi-storage')
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'ybi-storage',
    'ybi-storage',
    true,
    15728640, -- 15MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 15728640;

-- Storage Policy: Allow public read access to all objects in ybi-storage
DO $$ BEGIN
    CREATE POLICY "Public Read Access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'ybi-storage');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Storage Policy: Allow insert/upload to ybi-storage
DO $$ BEGIN
    CREATE POLICY "Public Insert Access"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'ybi-storage');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Storage Policy: Allow update to ybi-storage
DO $$ BEGIN
    CREATE POLICY "Public Update Access"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'ybi-storage');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Storage Policy: Allow delete in ybi-storage
DO $$ BEGIN
    CREATE POLICY "Public Delete Access"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'ybi-storage');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

