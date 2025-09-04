ALTER TABLE "group_week" DROP CONSTRAINT "group_week_group_id_week_id_unique";--> statement-breakpoint
ALTER TABLE "membership_week" DROP CONSTRAINT "membership_week_membership_id_week_id_unique";--> statement-breakpoint
ALTER TABLE "group_week" ADD CONSTRAINT "group_week_id_unique" UNIQUE("group_id","week_id");--> statement-breakpoint
ALTER TABLE "membership_week" ADD CONSTRAINT "membership_week_id_unique" UNIQUE("membership_id","week_id");