CREATE TABLE `admin_users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`password_hash` text NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `admin_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `education` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`school` varchar(255) NOT NULL,
	`degree` varchar(255) NOT NULL DEFAULT '',
	`field` varchar(255) NOT NULL DEFAULT '',
	`start_date` varchar(32) NOT NULL,
	`end_date` varchar(32),
	`description` text,
	`sort_order` int NOT NULL DEFAULT 0,
	CONSTRAINT `education_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `experiences` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`company` varchar(255) NOT NULL,
	`role` varchar(255) NOT NULL,
	`description` text,
	`location` varchar(255) NOT NULL DEFAULT '',
	`start_date` varchar(32) NOT NULL,
	`end_date` varchar(32),
	`is_current` boolean NOT NULL DEFAULT false,
	`sort_order` int NOT NULL DEFAULT 0,
	CONSTRAINT `experiences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`subject` varchar(255) NOT NULL DEFAULT '',
	`body` text NOT NULL,
	`read` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `profile` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL DEFAULT '',
	`headline` varchar(255) NOT NULL DEFAULT '',
	`bio` text NOT NULL,
	`avatar_url` text NOT NULL,
	`resume_url` text NOT NULL,
	`email` varchar(255) NOT NULL DEFAULT '',
	`phone` varchar(64) NOT NULL DEFAULT '',
	`location` varchar(255) NOT NULL DEFAULT '',
	`socials` json NOT NULL,
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `profile_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`summary` text,
	`description` text,
	`cover_image_url` text,
	`project_url` text,
	`repo_url` text,
	`tags` json NOT NULL,
	`featured` boolean NOT NULL DEFAULT false,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `projects_id` PRIMARY KEY(`id`),
	CONSTRAINT `projects_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`category` varchar(128) NOT NULL DEFAULT 'general',
	`level` int NOT NULL DEFAULT 3,
	`sort_order` int NOT NULL DEFAULT 0,
	CONSTRAINT `skills_id` PRIMARY KEY(`id`)
);
