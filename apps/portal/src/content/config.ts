/**
 * Astro Content Collections — schema definitions for every content type the
 * portal ships.
 *
 * Schemas enforce the shape documented in
 * docs/superpowers/specs/2026-04-19-ghana-gov-v1-design.md §5. `astro check`
 * fails the build if any markdown file violates its schema.
 */
import { defineCollection, z } from 'astro:content';

const lifeStage = z.enum(['live', 'work', 'business', 'visit']);

const services = defineCollection({
  type: 'content',
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string().min(4).max(120),
    lifeStage,
    topics: z.array(z.string()).min(1),
    lede: z.string().min(20).max(300),
    priority: z.number().int().positive(),
    eligibility: z.array(z.object({ text: z.string() })),
    youWillNeed: z.array(z.string()),
    cost: z.object({
      amount: z.number().nonnegative(),
      currency: z.literal('GHS'),
      unit: z.string(),
      notes: z.string().optional(),
    }),
    timeline: z.string(),
    agency: z.object({
      name: z.string(),
      url: z.string().url(),
      phone: z.string().optional(),
    }),
    applyUrl: z.string().url(),
    updatedAt: z.coerce.date(),
    sourceOfTruth: z.string().url(),
    twiSlug: z.string().optional(),
  }),
});

const news = defineCollection({
  type: 'content',
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string().min(4).max(160),
    lede: z.string().min(20).max(400),
    publishedAt: z.coerce.date(),
    ministry: z.string(),
    author: z.string(),
    heroImage: z.string().optional(),
    topics: z.array(z.string()).default([]),
  }),
});

const ministries = defineCollection({
  type: 'content',
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string().min(4),
    shortName: z.string().optional(),
    minister: z.string().optional(),
    deputyMinister: z.string().optional(),
    parentGovernment: z.enum(['Executive', 'Legislature', 'Judiciary', 'Independent']),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    website: z.string().url().optional(),
    address: z.string().optional(),
    mandate: z.string(),
    departments: z.array(z.string()).default([]),
    keyServices: z.array(z.string()).default([]),
  }),
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string(),
    lede: z.string(),
    updatedAt: z.coerce.date(),
  }),
});

export const collections = { services, news, ministries, pages };
