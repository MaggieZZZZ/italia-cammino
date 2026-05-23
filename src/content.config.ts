import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const eraIds = ["ancient_rome", "medieval", "renaissance", "baroque", "unification", "fascism", "postwar", "contemporary"] as const;
const eraEnum = z.enum(eraIds);

const cities = defineCollection({
  loader: glob({ pattern: "*/_meta.md", base: "./src/content/cities" }),
  schema: z.object({
    slug: z.string(),
    name_zh: z.string(),
    name_it: z.string(),
    lat: z.number(),
    lng: z.number(),
    hero_image: z.string().optional(),
    on_route: z.boolean().default(false),
    status: z.enum(["confirmed", "candidate"]),
    era_weights: z.record(eraEnum, z.number().min(0).max(5)),
    suggested_stay: z.string().optional(),
    recommended_next: z.array(z.string()).default([]),
  }),
});

const places = defineCollection({
  loader: glob({ pattern: "*/[!_]*.md", base: "./src/content/cities" }),
  schema: z.object({
    slug: z.string(),
    city: z.string(),
    era: eraEnum,
    name_zh: z.string(),
    name_it: z.string(),
    nickname: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    address: z.string().optional(),
    hook: z.string(),
    related_topics: z.array(z.string()).default([]),
    related_places: z.array(z.string()).default([]),
    resources: z.array(z.string()).default([]),
    is_museum: z.boolean().default(false),
    booking_required: z.boolean().optional(),
    booking_url: z.string().url().optional(),
    booking_window: z.string().optional(),
    ticket_price: z.string().optional(),
    opening_hours: z.string().optional(),
    must_see_checklist: z.array(z.string()).default([]),
  }),
});

const eras = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/eras" }),
  schema: z.object({
    id: eraEnum,
    name_zh: z.string(),
    name_en: z.string(),
    range: z.string(),
    range_years: z.tuple([z.number(), z.number()]),
    color: z.string(),
    order: z.number(),
  }),
});

const topics = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/topics" }),
  schema: z.object({
    slug: z.string(),
    name_zh: z.string(),
    name_en: z.string().optional(),
    category: z.enum(["family", "person", "movement", "event", "concept"]),
    related_cities: z.array(z.string()).default([]),
    related_places: z.array(z.string()).default([]),
    resources: z.array(z.string()).default([]),
  }),
});

const resources = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/resources" }),
  schema: z.object({
    id: z.string(),
    type: z.enum(["book", "film", "tv", "doc", "audio", "video", "site", "podcast"]),
    title_zh: z.string(),
    title_orig: z.string().optional(),
    creator: z.string().optional(),
    year: z.number().optional(),
    url: z.string().url().optional(),
    hook_zh: z.string(),
    length: z.string().optional(),
    language: z.string().optional(),
  }),
});

const restaurants = defineCollection({
  loader: glob({ pattern: "*/_restaurants/*.md", base: "./src/content/cities" }),
  schema: z.object({
    slug: z.string(),
    city: z.string(),
    name: z.string(),
    area: z.string().optional(),
    price: z.enum(["€", "€€", "€€€"]),
    dishes: z.array(z.string()).default([]),
    hours: z.string().optional(),
    trust: z.number().int().min(1).max(3),
    source: z.string(),
  }),
});

const lodging = defineCollection({
  loader: glob({ pattern: "*/_lodging/*.md", base: "./src/content/cities" }),
  schema: z.object({
    slug: z.string(),
    city: z.string(),
    area_name: z.string(),
    trust: z.number().int().min(1).max(3),
    suitable_for: z.string().optional(),
    search_tips: z.string().optional(),
  }),
});

const transport = defineCollection({
  loader: glob({ pattern: "*/_transport/*.md", base: "./src/content/cities" }),
  schema: z.object({
    slug: z.string(),
    from_city: z.string(),
    to_city: z.string(),
    mode: z.enum(["train", "plane", "bus", "ferry", "walk", "metro"]),
    operator: z.string().optional(),
    duration: z.string(),
    cost_estimate: z.string().optional(),
    booking_url: z.string().url().optional(),
    when_to_book: z.string().optional(),
    trust: z.number().int().min(1).max(3),
  }),
});

const trivia = defineCollection({
  loader: glob({ pattern: "*/_trivia/*.md", base: "./src/content/cities" }),
  schema: z.object({
    content: z.string(),
    attached_to: z.enum(["city", "era", "topic", "place"]),
    attached_slug: z.string(),
    category: z.enum(["language", "art", "food", "religion", "curiosity", "history"]),
  }),
});

export const collections = { cities, places, eras, topics, resources, restaurants, lodging, transport, trivia };
