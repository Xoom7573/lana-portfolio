import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'nl');
  CREATE TYPE "public"."enum_projects_layout" AS ENUM('sticky', 'grid');
  CREATE TYPE "public"."enum_projects_page_label" AS ENUM('page', 'fraction');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_layout" AS ENUM('sticky', 'grid');
  CREATE TYPE "public"."enum__projects_v_version_page_label" AS ENUM('page', 'fraction');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_published_locale" AS ENUM('en', 'nl');
  CREATE TYPE "public"."enum_home_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_v_published_locale" AS ENUM('en', 'nl');
  CREATE TYPE "public"."enum_site_nav_links_target" AS ENUM('about', 'toolkit', 'work', 'design', 'contact');
  CREATE TYPE "public"."enum_site_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_v_version_nav_links_target" AS ENUM('about', 'toolkit', 'work', 'design', 'contact');
  CREATE TYPE "public"."enum__site_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_v_published_locale" AS ENUM('en', 'nl');
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"name" varchar,
  	"slug" varchar,
  	"layout" "enum_projects_layout" DEFAULT 'sticky',
  	"page_label" "enum_projects_page_label" DEFAULT 'page',
  	"cover_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "projects_locales" (
  	"heading" varchar,
  	"discipline" varchar,
  	"description" varchar,
  	"cover_alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"media_id" integer
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_layout" "enum__projects_v_version_layout" DEFAULT 'sticky',
  	"version_page_label" "enum__projects_v_version_page_label" DEFAULT 'page',
  	"version_cover_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__projects_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_projects_v_locales" (
  	"version_heading" varchar,
  	"version_discipline" varchar,
  	"version_description" varchar,
  	"version_cover_alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"media_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar,
  	"sizes_full_url" varchar,
  	"sizes_full_width" numeric,
  	"sizes_full_height" numeric,
  	"sizes_full_mime_type" varchar,
  	"sizes_full_filesize" numeric,
  	"sizes_full_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home_toolkit_groups_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_toolkit_groups_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_toolkit_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_toolkit_groups_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_design_colours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hex" varchar
  );
  
  CREATE TABLE "home_design_colours_locales" (
  	"name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_portrait_id" integer,
  	"_status" "enum_home_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_locales" (
  	"hero_words_line1" varchar,
  	"hero_words_line2" varchar,
  	"about_heading_line1" varchar,
  	"about_heading_line2" varchar,
  	"about_sticker" varchar,
  	"about_sticker_center" varchar,
  	"about_greeting" varchar,
  	"about_body" jsonb,
  	"toolkit_heading_line1" varchar,
  	"toolkit_heading_line2" varchar,
  	"work_heading" varchar,
  	"work_eyebrow" varchar,
  	"work_portfolio_label" varchar,
  	"work_portfolio_kind" varchar,
  	"work_portfolio_cover_line1" varchar,
  	"work_portfolio_cover_line2" varchar,
  	"design_heading" varchar,
  	"design_palette_label" varchar,
  	"design_typography_label" varchar,
  	"design_headline_font" varchar,
  	"design_body_font" varchar,
  	"design_moodboard_label" varchar,
  	"contact_eyebrow" varchar,
  	"contact_heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "home_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_home_v_version_toolkit_groups_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_version_toolkit_groups_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_version_toolkit_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_version_toolkit_groups_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_version_design_colours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hex" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_version_design_colours_locales" (
  	"name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_portrait_id" integer,
  	"version__status" "enum__home_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__home_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_home_v_locales" (
  	"version_hero_words_line1" varchar,
  	"version_hero_words_line2" varchar,
  	"version_about_heading_line1" varchar,
  	"version_about_heading_line2" varchar,
  	"version_about_sticker" varchar,
  	"version_about_sticker_center" varchar,
  	"version_about_greeting" varchar,
  	"version_about_body" jsonb,
  	"version_toolkit_heading_line1" varchar,
  	"version_toolkit_heading_line2" varchar,
  	"version_work_heading" varchar,
  	"version_work_eyebrow" varchar,
  	"version_work_portfolio_label" varchar,
  	"version_work_portfolio_kind" varchar,
  	"version_work_portfolio_cover_line1" varchar,
  	"version_work_portfolio_cover_line2" varchar,
  	"version_design_heading" varchar,
  	"version_design_palette_label" varchar,
  	"version_design_typography_label" varchar,
  	"version_design_headline_font" varchar,
  	"version_design_body_font" varchar,
  	"version_design_moodboard_label" varchar,
  	"version_contact_eyebrow" varchar,
  	"version_contact_heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "site_nav_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"target" "enum_site_nav_links_target"
  );
  
  CREATE TABLE "site_nav_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_marquee_locales" (
  	"word" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"email" varchar,
  	"phone" varchar,
  	"seo_og_image_id" integer,
  	"_status" "enum_site_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_locales" (
  	"nav_cta" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_site_v_version_nav_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"target" "enum__site_v_version_nav_links_target",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_v_version_nav_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_site_v_version_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_v_version_marquee_locales" (
  	"word" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_site_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_name" varchar,
  	"version_email" varchar,
  	"version_phone" varchar,
  	"version_seo_og_image_id" integer,
  	"version__status" "enum__site_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__site_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_site_v_locales" (
  	"version_nav_cta" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_og_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "projects" ADD CONSTRAINT "projects_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_locales" ADD CONSTRAINT "projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_locales" ADD CONSTRAINT "_projects_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_toolkit_groups_items" ADD CONSTRAINT "home_toolkit_groups_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_toolkit_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_toolkit_groups_items_locales" ADD CONSTRAINT "home_toolkit_groups_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_toolkit_groups_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_toolkit_groups" ADD CONSTRAINT "home_toolkit_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_toolkit_groups_locales" ADD CONSTRAINT "home_toolkit_groups_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_toolkit_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_design_colours" ADD CONSTRAINT "home_design_colours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_design_colours_locales" ADD CONSTRAINT "home_design_colours_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_design_colours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_hero_portrait_id_media_id_fk" FOREIGN KEY ("hero_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_locales" ADD CONSTRAINT "home_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_toolkit_groups_items" ADD CONSTRAINT "_home_v_version_toolkit_groups_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_version_toolkit_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_toolkit_groups_items_locales" ADD CONSTRAINT "_home_v_version_toolkit_groups_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_version_toolkit_groups_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_toolkit_groups" ADD CONSTRAINT "_home_v_version_toolkit_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_toolkit_groups_locales" ADD CONSTRAINT "_home_v_version_toolkit_groups_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_version_toolkit_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_design_colours" ADD CONSTRAINT "_home_v_version_design_colours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_version_design_colours_locales" ADD CONSTRAINT "_home_v_version_design_colours_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_version_design_colours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v" ADD CONSTRAINT "_home_v_version_hero_portrait_id_media_id_fk" FOREIGN KEY ("version_hero_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_locales" ADD CONSTRAINT "_home_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_rels" ADD CONSTRAINT "_home_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_rels" ADD CONSTRAINT "_home_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_nav_links" ADD CONSTRAINT "site_nav_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_nav_links_locales" ADD CONSTRAINT "site_nav_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_nav_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_marquee" ADD CONSTRAINT "site_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_marquee_locales" ADD CONSTRAINT "site_marquee_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site" ADD CONSTRAINT "site_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_locales" ADD CONSTRAINT "site_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_v_version_nav_links" ADD CONSTRAINT "_site_v_version_nav_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_v_version_nav_links_locales" ADD CONSTRAINT "_site_v_version_nav_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_v_version_nav_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_v_version_marquee" ADD CONSTRAINT "_site_v_version_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_v_version_marquee_locales" ADD CONSTRAINT "_site_v_version_marquee_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_v_version_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_v" ADD CONSTRAINT "_site_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_v_locales" ADD CONSTRAINT "_site_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects__order_idx" ON "projects" USING btree ("_order");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_cover_idx" ON "projects" USING btree ("cover_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE UNIQUE INDEX "projects_locales_locale_parent_id_unique" ON "projects_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_locales_parent_id_idx" ON "projects_locales" USING btree ("_parent_id");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_locale_idx" ON "projects_rels" USING btree ("locale");
  CREATE INDEX "projects_rels_media_id_idx" ON "projects_rels" USING btree ("media_id","locale");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version__order_idx" ON "_projects_v" USING btree ("version__order");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_cover_idx" ON "_projects_v" USING btree ("version_cover_id");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_snapshot_idx" ON "_projects_v" USING btree ("snapshot");
  CREATE INDEX "_projects_v_published_locale_idx" ON "_projects_v" USING btree ("published_locale");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE INDEX "_projects_v_autosave_idx" ON "_projects_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_projects_v_locales_locale_parent_id_unique" ON "_projects_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_locales_parent_id_idx" ON "_projects_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_rels_order_idx" ON "_projects_v_rels" USING btree ("order");
  CREATE INDEX "_projects_v_rels_parent_idx" ON "_projects_v_rels" USING btree ("parent_id");
  CREATE INDEX "_projects_v_rels_path_idx" ON "_projects_v_rels" USING btree ("path");
  CREATE INDEX "_projects_v_rels_locale_idx" ON "_projects_v_rels" USING btree ("locale");
  CREATE INDEX "_projects_v_rels_media_id_idx" ON "_projects_v_rels" USING btree ("media_id","locale");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_full_sizes_full_filename_idx" ON "media" USING btree ("sizes_full_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_locales_parent_id_idx" ON "media_locales" USING btree ("_parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "home_toolkit_groups_items_order_idx" ON "home_toolkit_groups_items" USING btree ("_order");
  CREATE INDEX "home_toolkit_groups_items_parent_id_idx" ON "home_toolkit_groups_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_toolkit_groups_items_locales_locale_parent_id_unique" ON "home_toolkit_groups_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_toolkit_groups_items_locales_parent_id_idx" ON "home_toolkit_groups_items_locales" USING btree ("_parent_id");
  CREATE INDEX "home_toolkit_groups_order_idx" ON "home_toolkit_groups" USING btree ("_order");
  CREATE INDEX "home_toolkit_groups_parent_id_idx" ON "home_toolkit_groups" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_toolkit_groups_locales_locale_parent_id_unique" ON "home_toolkit_groups_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_toolkit_groups_locales_parent_id_idx" ON "home_toolkit_groups_locales" USING btree ("_parent_id");
  CREATE INDEX "home_design_colours_order_idx" ON "home_design_colours" USING btree ("_order");
  CREATE INDEX "home_design_colours_parent_id_idx" ON "home_design_colours" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_design_colours_locales_locale_parent_id_unique" ON "home_design_colours_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_design_colours_locales_parent_id_idx" ON "home_design_colours_locales" USING btree ("_parent_id");
  CREATE INDEX "home_hero_hero_portrait_idx" ON "home" USING btree ("hero_portrait_id");
  CREATE INDEX "home__status_idx" ON "home" USING btree ("_status");
  CREATE UNIQUE INDEX "home_locales_locale_parent_id_unique" ON "home_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_locales_parent_id_idx" ON "home_locales" USING btree ("_parent_id");
  CREATE INDEX "home_rels_order_idx" ON "home_rels" USING btree ("order");
  CREATE INDEX "home_rels_parent_idx" ON "home_rels" USING btree ("parent_id");
  CREATE INDEX "home_rels_path_idx" ON "home_rels" USING btree ("path");
  CREATE INDEX "home_rels_media_id_idx" ON "home_rels" USING btree ("media_id");
  CREATE INDEX "_home_v_version_toolkit_groups_items_order_idx" ON "_home_v_version_toolkit_groups_items" USING btree ("_order");
  CREATE INDEX "_home_v_version_toolkit_groups_items_parent_id_idx" ON "_home_v_version_toolkit_groups_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_version_toolkit_groups_items_locales_locale_parent_i" ON "_home_v_version_toolkit_groups_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_version_toolkit_groups_items_locales_parent_id_idx" ON "_home_v_version_toolkit_groups_items_locales" USING btree ("_parent_id");
  CREATE INDEX "_home_v_version_toolkit_groups_order_idx" ON "_home_v_version_toolkit_groups" USING btree ("_order");
  CREATE INDEX "_home_v_version_toolkit_groups_parent_id_idx" ON "_home_v_version_toolkit_groups" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_version_toolkit_groups_locales_locale_parent_id_uniq" ON "_home_v_version_toolkit_groups_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_version_toolkit_groups_locales_parent_id_idx" ON "_home_v_version_toolkit_groups_locales" USING btree ("_parent_id");
  CREATE INDEX "_home_v_version_design_colours_order_idx" ON "_home_v_version_design_colours" USING btree ("_order");
  CREATE INDEX "_home_v_version_design_colours_parent_id_idx" ON "_home_v_version_design_colours" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_version_design_colours_locales_locale_parent_id_uniq" ON "_home_v_version_design_colours_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_version_design_colours_locales_parent_id_idx" ON "_home_v_version_design_colours_locales" USING btree ("_parent_id");
  CREATE INDEX "_home_v_version_hero_version_hero_portrait_idx" ON "_home_v" USING btree ("version_hero_portrait_id");
  CREATE INDEX "_home_v_version_version__status_idx" ON "_home_v" USING btree ("version__status");
  CREATE INDEX "_home_v_created_at_idx" ON "_home_v" USING btree ("created_at");
  CREATE INDEX "_home_v_updated_at_idx" ON "_home_v" USING btree ("updated_at");
  CREATE INDEX "_home_v_snapshot_idx" ON "_home_v" USING btree ("snapshot");
  CREATE INDEX "_home_v_published_locale_idx" ON "_home_v" USING btree ("published_locale");
  CREATE INDEX "_home_v_latest_idx" ON "_home_v" USING btree ("latest");
  CREATE INDEX "_home_v_autosave_idx" ON "_home_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_home_v_locales_locale_parent_id_unique" ON "_home_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_locales_parent_id_idx" ON "_home_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_home_v_rels_order_idx" ON "_home_v_rels" USING btree ("order");
  CREATE INDEX "_home_v_rels_parent_idx" ON "_home_v_rels" USING btree ("parent_id");
  CREATE INDEX "_home_v_rels_path_idx" ON "_home_v_rels" USING btree ("path");
  CREATE INDEX "_home_v_rels_media_id_idx" ON "_home_v_rels" USING btree ("media_id");
  CREATE INDEX "site_nav_links_order_idx" ON "site_nav_links" USING btree ("_order");
  CREATE INDEX "site_nav_links_parent_id_idx" ON "site_nav_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_nav_links_locales_locale_parent_id_unique" ON "site_nav_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_nav_links_locales_parent_id_idx" ON "site_nav_links_locales" USING btree ("_parent_id");
  CREATE INDEX "site_marquee_order_idx" ON "site_marquee" USING btree ("_order");
  CREATE INDEX "site_marquee_parent_id_idx" ON "site_marquee" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_marquee_locales_locale_parent_id_unique" ON "site_marquee_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_marquee_locales_parent_id_idx" ON "site_marquee_locales" USING btree ("_parent_id");
  CREATE INDEX "site_seo_seo_og_image_idx" ON "site" USING btree ("seo_og_image_id");
  CREATE INDEX "site__status_idx" ON "site" USING btree ("_status");
  CREATE UNIQUE INDEX "site_locales_locale_parent_id_unique" ON "site_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_locales_parent_id_idx" ON "site_locales" USING btree ("_parent_id");
  CREATE INDEX "_site_v_version_nav_links_order_idx" ON "_site_v_version_nav_links" USING btree ("_order");
  CREATE INDEX "_site_v_version_nav_links_parent_id_idx" ON "_site_v_version_nav_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_site_v_version_nav_links_locales_locale_parent_id_unique" ON "_site_v_version_nav_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_site_v_version_nav_links_locales_parent_id_idx" ON "_site_v_version_nav_links_locales" USING btree ("_parent_id");
  CREATE INDEX "_site_v_version_marquee_order_idx" ON "_site_v_version_marquee" USING btree ("_order");
  CREATE INDEX "_site_v_version_marquee_parent_id_idx" ON "_site_v_version_marquee" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_site_v_version_marquee_locales_locale_parent_id_unique" ON "_site_v_version_marquee_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_site_v_version_marquee_locales_parent_id_idx" ON "_site_v_version_marquee_locales" USING btree ("_parent_id");
  CREATE INDEX "_site_v_version_seo_version_seo_og_image_idx" ON "_site_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_site_v_version_version__status_idx" ON "_site_v" USING btree ("version__status");
  CREATE INDEX "_site_v_created_at_idx" ON "_site_v" USING btree ("created_at");
  CREATE INDEX "_site_v_updated_at_idx" ON "_site_v" USING btree ("updated_at");
  CREATE INDEX "_site_v_snapshot_idx" ON "_site_v" USING btree ("snapshot");
  CREATE INDEX "_site_v_published_locale_idx" ON "_site_v" USING btree ("published_locale");
  CREATE INDEX "_site_v_latest_idx" ON "_site_v" USING btree ("latest");
  CREATE INDEX "_site_v_autosave_idx" ON "_site_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_site_v_locales_locale_parent_id_unique" ON "_site_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_site_v_locales_parent_id_idx" ON "_site_v_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_locales" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_projects_v_locales" CASCADE;
  DROP TABLE "_projects_v_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "home_toolkit_groups_items" CASCADE;
  DROP TABLE "home_toolkit_groups_items_locales" CASCADE;
  DROP TABLE "home_toolkit_groups" CASCADE;
  DROP TABLE "home_toolkit_groups_locales" CASCADE;
  DROP TABLE "home_design_colours" CASCADE;
  DROP TABLE "home_design_colours_locales" CASCADE;
  DROP TABLE "home" CASCADE;
  DROP TABLE "home_locales" CASCADE;
  DROP TABLE "home_rels" CASCADE;
  DROP TABLE "_home_v_version_toolkit_groups_items" CASCADE;
  DROP TABLE "_home_v_version_toolkit_groups_items_locales" CASCADE;
  DROP TABLE "_home_v_version_toolkit_groups" CASCADE;
  DROP TABLE "_home_v_version_toolkit_groups_locales" CASCADE;
  DROP TABLE "_home_v_version_design_colours" CASCADE;
  DROP TABLE "_home_v_version_design_colours_locales" CASCADE;
  DROP TABLE "_home_v" CASCADE;
  DROP TABLE "_home_v_locales" CASCADE;
  DROP TABLE "_home_v_rels" CASCADE;
  DROP TABLE "site_nav_links" CASCADE;
  DROP TABLE "site_nav_links_locales" CASCADE;
  DROP TABLE "site_marquee" CASCADE;
  DROP TABLE "site_marquee_locales" CASCADE;
  DROP TABLE "site" CASCADE;
  DROP TABLE "site_locales" CASCADE;
  DROP TABLE "_site_v_version_nav_links" CASCADE;
  DROP TABLE "_site_v_version_nav_links_locales" CASCADE;
  DROP TABLE "_site_v_version_marquee" CASCADE;
  DROP TABLE "_site_v_version_marquee_locales" CASCADE;
  DROP TABLE "_site_v" CASCADE;
  DROP TABLE "_site_v_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_projects_layout";
  DROP TYPE "public"."enum_projects_page_label";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_layout";
  DROP TYPE "public"."enum__projects_v_version_page_label";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum__projects_v_published_locale";
  DROP TYPE "public"."enum_home_status";
  DROP TYPE "public"."enum__home_v_version_status";
  DROP TYPE "public"."enum__home_v_published_locale";
  DROP TYPE "public"."enum_site_nav_links_target";
  DROP TYPE "public"."enum_site_status";
  DROP TYPE "public"."enum__site_v_version_nav_links_target";
  DROP TYPE "public"."enum__site_v_version_status";
  DROP TYPE "public"."enum__site_v_published_locale";`)
}
