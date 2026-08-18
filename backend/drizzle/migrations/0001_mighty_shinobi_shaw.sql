CREATE TYPE "public"."blog_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."event_status" AS ENUM('draft', 'published', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'success', 'failed', 'free');--> statement-breakpoint
CREATE TABLE "blogPosts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(220) NOT NULL,
	"title" varchar(200) NOT NULL,
	"excerpt" text NOT NULL,
	"body" text NOT NULL,
	"authorName" varchar(120) NOT NULL,
	"coverImageUrl" text,
	"category" varchar(80) NOT NULL,
	"status" "blog_status" DEFAULT 'draft' NOT NULL,
	"publishedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blogPosts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "donations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(140) NOT NULL,
	"email" varchar(320) NOT NULL,
	"phone" varchar(30),
	"amountGhs" integer NOT NULL,
	"message" text,
	"paystackRef" varchar(100),
	"paymentStatus" "payment_status" DEFAULT 'pending' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "eventRegistrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"eventId" integer NOT NULL,
	"name" varchar(140) NOT NULL,
	"email" varchar(320) NOT NULL,
	"phone" varchar(30) NOT NULL,
	"smsOptIn" boolean DEFAULT false NOT NULL,
	"paystackRef" varchar(100),
	"paymentStatus" "payment_status" DEFAULT 'pending' NOT NULL,
	"isWaitlist" boolean DEFAULT false NOT NULL,
	"confirmedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(200) NOT NULL,
	"title" varchar(180) NOT NULL,
	"description" text NOT NULL,
	"imageUrl" text,
	"scheduledFor" timestamp NOT NULL,
	"location" varchar(240) NOT NULL,
	"capacity" integer,
	"isFree" boolean DEFAULT true NOT NULL,
	"priceGhs" integer DEFAULT 0 NOT NULL,
	"status" "event_status" DEFAULT 'draft' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "events_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "faqItems" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"category" varchar(80) NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"isPublished" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletterSubscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(320) NOT NULL,
	"name" varchar(140),
	"phone" varchar(30),
	"smsOptIn" boolean DEFAULT false NOT NULL,
	"subscribedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "newsletterSubscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "smsLogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"recipientPhone" varchar(30) NOT NULL,
	"message" text NOT NULL,
	"provider" varchar(40) DEFAULT 'africastalking' NOT NULL,
	"status" varchar(40) DEFAULT 'queued' NOT NULL,
	"providerRef" varchar(100),
	"sentAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teamMembers" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(180) NOT NULL,
	"name" varchar(140) NOT NULL,
	"role" varchar(100) NOT NULL,
	"bio" text NOT NULL,
	"imageUrl" text DEFAULT '' NOT NULL,
	"email" varchar(320),
	"linkedIn" varchar(300),
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"isPublished" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "teamMembers_slug_unique" UNIQUE("slug")
);
