/**
 * DDL de arranque, espejo de server/db/schema.ts. Se incrusta como constante
 * para ejecutarlo desde /api/setup en Vercel, donde no hay terminal para
 * `npm run db:migrate`. Los marcadores `--> statement-breakpoint` separan
 * sentencias (Neon HTTP ejecuta de a una).
 *
 * Si cambia el esquema: regenerar con `npm run db:generate`, actualizar esto y
 * sumar a ALTERS lo que haga falta para bases ya creadas.
 */
export const DDL = `CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"name" varchar(120),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "site_content" (
	"key" varchar(120) PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"label" text,
	"group" varchar(60),
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(160) NOT NULL,
	"name" text NOT NULL,
	"line" varchar(40) NOT NULL,
	"pests" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"brand" text,
	"summary" text,
	"body_md" text,
	"image" text,
	"featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"seo_title" text,
	"seo_description" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "quotes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(160) NOT NULL,
	"company" varchar(200),
	"email" varchar(255),
	"phone" varchar(60) NOT NULL,
	"comuna" varchar(120),
	"message" text,
	"items" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"handled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);`

/** Cambios sobre tablas ya existentes. Vacío en la primera versión. */
export const ALTERS = ``
