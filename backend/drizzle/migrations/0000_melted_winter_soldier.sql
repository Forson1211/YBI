CREATE TYPE "public"."content_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."impact_status" AS ENUM('active', 'archived');--> statement-breakpoint
CREATE TYPE "public"."inquiry_status" AS ENUM('new', 'in_progress', 'responded', 'closed');--> statement-breakpoint
CREATE TYPE "public"."opportunity_status" AS ENUM('draft', 'published', 'closed');--> statement-breakpoint
CREATE TYPE "public"."program_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."session_status" AS ENUM('draft', 'published', 'complete');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "communityInquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(140) NOT NULL,
	"email" varchar(320) NOT NULL,
	"interest" varchar(100) NOT NULL,
	"message" text NOT NULL,
	"status" "inquiry_status" DEFAULT 'new' NOT NULL,
	"adminNotes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "galleryPhotos" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(160) NOT NULL,
	"altText" varchar(240) NOT NULL,
	"imageUrl" text NOT NULL,
	"storageKey" varchar(500) NOT NULL,
	"isPublished" boolean DEFAULT true NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "impactMetrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(160) NOT NULL,
	"focusArea" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"currentValue" integer DEFAULT 0 NOT NULL,
	"targetValue" integer,
	"unit" varchar(60) NOT NULL,
	"period" varchar(100) NOT NULL,
	"status" "impact_status" DEFAULT 'active' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "opportunities" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(180) NOT NULL,
	"category" varchar(100) NOT NULL,
	"summary" text NOT NULL,
	"commitment" varchar(160) NOT NULL,
	"status" "opportunity_status" DEFAULT 'draft' NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "programSessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(180) NOT NULL,
	"focusArea" varchar(100) NOT NULL,
	"details" text NOT NULL,
	"scheduledFor" timestamp NOT NULL,
	"venue" varchar(180) NOT NULL,
	"capacity" integer,
	"status" "session_status" DEFAULT 'draft' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "programs" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(160) NOT NULL,
	"category" varchar(80) NOT NULL,
	"summary" text NOT NULL,
	"status" "program_status" DEFAULT 'draft' NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "siteContent" (
	"id" serial PRIMARY KEY NOT NULL,
	"contentKey" varchar(100) NOT NULL,
	"label" varchar(140) NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"actionLabel" varchar(100),
	"actionHref" varchar(300),
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "siteContent_contentKey_unique" UNIQUE("contentKey")
);
--> statement-breakpoint
CREATE TABLE "updates" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(180) NOT NULL,
	"excerpt" text NOT NULL,
	"body" text NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"publishedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
