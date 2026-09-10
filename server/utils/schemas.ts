/**
 * Shared zod validation schemas for the CMS write endpoints.
 * Lives in server/utils so Nitro auto-imports every export below —
 * no explicit import needed in server/api/** route files.
 */
import { z } from 'zod'

export const profileSchema = z.object({
  name: z.string().trim().max(255).default(''),
  headline: z.string().trim().max(255).default(''),
  bio: z.string().trim().max(10000).default(''),
  avatarUrl: z.string().trim().max(2048).default(''),
  resumeUrl: z.string().trim().max(2048).default(''),
  email: z.string().trim().max(255).default(''),
  phone: z.string().trim().max(64).default(''),
  location: z.string().trim().max(255).default(''),
  socials: z.record(z.string(), z.string()).default({})
})

export const skillSchema = z.object({
  name: z.string().trim().min(1).max(128),
  category: z.string().trim().min(1).max(128).default('general'),
  level: z.coerce.number().int().min(1).max(5).default(3),
  sortOrder: z.coerce.number().int().default(0)
})

export const experienceSchema = z.object({
  company: z.string().trim().min(1).max(255),
  role: z.string().trim().min(1).max(255),
  description: z.string().trim().max(5000).default(''),
  location: z.string().trim().max(255).default(''),
  startDate: z.string().trim().min(1).max(32),
  endDate: z.string().trim().max(32).nullable().default(null),
  isCurrent: z.coerce.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0)
})

export const educationSchema = z.object({
  school: z.string().trim().min(1).max(255),
  degree: z.string().trim().max(255).default(''),
  field: z.string().trim().max(255).default(''),
  startDate: z.string().trim().min(1).max(32),
  endDate: z.string().trim().max(32).nullable().default(null),
  description: z.string().trim().max(5000).default(''),
  sortOrder: z.coerce.number().int().default(0)
})

export const projectSchema = z.object({
  title: z.string().trim().min(1).max(255),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase, alphanumeric, dash-separated'),
  summary: z.string().trim().max(500).default(''),
  description: z.string().trim().max(10000).default(''),
  coverImageUrl: z.string().trim().max(2048).default(''),
  projectUrl: z.string().trim().max(2048).default(''),
  repoUrl: z.string().trim().max(2048).default(''),
  tags: z.array(z.string().trim().min(1).max(64)).default([]),
  featured: z.coerce.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0)
})

export const messageSchema = z.object({
  name: z.string().trim().min(1).max(255),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().max(255).default(''),
  body: z.string().trim().min(1).max(5000)
})
