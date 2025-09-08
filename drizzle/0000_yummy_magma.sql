CREATE TYPE "public"."avatar_icon" AS ENUM('club', 'crown', 'diamond', 'fire', 'gamepad', 'heart', 'lightning', 'moon', 'rocket', 'shield', 'snowflake', 'spade', 'star', 'sun', 'user');--> statement-breakpoint
CREATE TABLE "account" (
	"userId" integer NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE "authenticator" (
	"credentialID" text NOT NULL,
	"userId" integer NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE "group_week" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" integer NOT NULL,
	"week_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"lowest_valid_points" integer,
	CONSTRAINT "group_week_id_unique" UNIQUE("group_id","week_id")
);
--> statement-breakpoint
CREATE TABLE "group" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"finished" boolean DEFAULT false NOT NULL,
	"joinable" boolean DEFAULT false NOT NULL,
	"tournament_id" integer NOT NULL,
	"payment_due_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "group_tournament_id_name_unique" UNIQUE("tournament_id","name")
);
--> statement-breakpoint
CREATE TABLE "match" (
	"id" serial PRIMARY KEY NOT NULL,
	"week_id" integer NOT NULL,
	"home_team_id" integer NOT NULL,
	"visit_team_id" integer NOT NULL,
	"winning_team_id" integer,
	"start_time" timestamp with time zone,
	"untie" boolean DEFAULT false NOT NULL,
	"premium" boolean DEFAULT false NOT NULL,
	"visit_team_score" integer,
	"home_team_score" integer,
	"tie" boolean DEFAULT false NOT NULL,
	"order" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "match_week_id_home_team_id_unique" UNIQUE("week_id","home_team_id"),
	CONSTRAINT "match_week_id_visit_team_id_unique" UNIQUE("week_id","visit_team_id"),
	CONSTRAINT "winning_team_valid" CHECK ("match"."winning_team_id" IS NULL OR "match"."winning_team_id" = "match"."home_team_id" OR "match"."winning_team_id" = "match"."visit_team_id")
);
--> statement-breakpoint
CREATE TABLE "membership_week" (
	"id" serial PRIMARY KEY NOT NULL,
	"membership_id" integer NOT NULL,
	"week_id" integer NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"week_winner" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"forgot_picks" boolean DEFAULT false NOT NULL,
	CONSTRAINT "membership_week_id_unique" UNIQUE("membership_id","week_id")
);
--> statement-breakpoint
CREATE TABLE "membership" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_account_id" integer NOT NULL,
	"group_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"paid" boolean DEFAULT false NOT NULL,
	"suspended" boolean DEFAULT false NOT NULL,
	"notes" text,
	"position" integer DEFAULT 0,
	"total" integer DEFAULT 0,
	"forgot_picks" boolean DEFAULT false NOT NULL,
	CONSTRAINT "membership_user_account_id_group_id_unique" UNIQUE("user_account_id","group_id")
);
--> statement-breakpoint
CREATE TABLE "pick" (
	"id" serial PRIMARY KEY NOT NULL,
	"match_id" integer NOT NULL,
	"membership_week_id" integer NOT NULL,
	"picked_team_id" integer,
	"correct" boolean DEFAULT false NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"modified_by_admin" boolean DEFAULT false NOT NULL,
	CONSTRAINT "pick_match_id_membership_week_id_unique" UNIQUE("match_id","membership_week_id")
);
--> statement-breakpoint
CREATE TABLE "request" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" integer NOT NULL,
	"user_account_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"denied" boolean DEFAULT false,
	CONSTRAINT "request_group_id_user_account_id_unique" UNIQUE("group_id","user_account_id")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sport" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sport_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "team" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"short_name" text NOT NULL,
	"sport_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "team_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "tournament" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"sport_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"year" integer NOT NULL,
	CONSTRAINT "tournament_sport_id_name_year_unique" UNIQUE("sport_id","name","year")
);
--> statement-breakpoint
CREATE TABLE "user_account" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"username" text NOT NULL,
	"avatar" "avatar_icon" DEFAULT 'user' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_account_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"admin" boolean DEFAULT false NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	"encryptedPassword" text,
	"phone" text,
	"suspended" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "week" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" integer NOT NULL,
	"finished" boolean DEFAULT false NOT NULL,
	"tournament_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "week_number_tournament_id_unique" UNIQUE("number","tournament_id")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_week" ADD CONSTRAINT "group_week_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_week" ADD CONSTRAINT "group_week_week_id_week_id_fk" FOREIGN KEY ("week_id") REFERENCES "public"."week"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group" ADD CONSTRAINT "group_tournament_id_tournament_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournament"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match" ADD CONSTRAINT "match_home_team_id_team_id_fk" FOREIGN KEY ("home_team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match" ADD CONSTRAINT "match_visit_team_id_team_id_fk" FOREIGN KEY ("visit_team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership_week" ADD CONSTRAINT "membership_week_membership_id_membership_id_fk" FOREIGN KEY ("membership_id") REFERENCES "public"."membership"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership_week" ADD CONSTRAINT "membership_week_week_id_week_id_fk" FOREIGN KEY ("week_id") REFERENCES "public"."week"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership" ADD CONSTRAINT "membership_user_account_id_user_account_id_fk" FOREIGN KEY ("user_account_id") REFERENCES "public"."user_account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership" ADD CONSTRAINT "membership_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pick" ADD CONSTRAINT "pick_match_id_match_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."match"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pick" ADD CONSTRAINT "pick_membership_week_id_membership_week_id_fk" FOREIGN KEY ("membership_week_id") REFERENCES "public"."membership_week"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pick" ADD CONSTRAINT "pick_picked_team_id_team_id_fk" FOREIGN KEY ("picked_team_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "request" ADD CONSTRAINT "request_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "request" ADD CONSTRAINT "request_user_account_id_user_account_id_fk" FOREIGN KEY ("user_account_id") REFERENCES "public"."user_account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_sport_id_sport_id_fk" FOREIGN KEY ("sport_id") REFERENCES "public"."sport"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament" ADD CONSTRAINT "tournament_sport_id_sport_id_fk" FOREIGN KEY ("sport_id") REFERENCES "public"."sport"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_account" ADD CONSTRAINT "user_account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "week" ADD CONSTRAINT "week_tournament_id_tournament_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournament"("id") ON DELETE cascade ON UPDATE no action;