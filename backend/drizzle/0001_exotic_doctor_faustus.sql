CREATE TABLE `communityInquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(140) NOT NULL,
	`email` varchar(320) NOT NULL,
	`interest` varchar(100) NOT NULL,
	`message` text NOT NULL,
	`status` enum('new','in_progress','responded','closed') NOT NULL DEFAULT 'new',
	`adminNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `communityInquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `impactMetrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(160) NOT NULL,
	`focusArea` varchar(100) NOT NULL,
	`description` text NOT NULL,
	`currentValue` int NOT NULL DEFAULT 0,
	`targetValue` int,
	`unit` varchar(60) NOT NULL,
	`period` varchar(100) NOT NULL,
	`status` enum('active','archived') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `impactMetrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `opportunities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(180) NOT NULL,
	`category` varchar(100) NOT NULL,
	`summary` text NOT NULL,
	`commitment` varchar(160) NOT NULL,
	`status` enum('draft','published','closed') NOT NULL DEFAULT 'draft',
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `opportunities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `programSessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(180) NOT NULL,
	`focusArea` varchar(100) NOT NULL,
	`details` text NOT NULL,
	`scheduledFor` timestamp NOT NULL,
	`venue` varchar(180) NOT NULL,
	`capacity` int,
	`status` enum('draft','published','complete') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `programSessions_id` PRIMARY KEY(`id`)
);
