/**
 * PostgreSQL dialect schema.
 * Column shapes mirror server/db/schema/mysql.ts and sqlite.ts field-for-field
 * so the rest of the app can query `schema.<table>` without caring which
 * dialect is active (selected at runtime via DB_PROVIDER, see server/db/index.ts).
 */
import { pgTable, serial, text, varchar, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core'

export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
})

export const profile = pgTable('profile', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().default(''),
  headline: varchar('headline', { length: 255 }).notNull().default(''),
  bio: text('bio').notNull().default(''),
  avatarUrl: text('avatar_url').notNull().default(''),
  resumeUrl: text('resume_url').notNull().default(''),
  email: varchar('email', { length: 255 }).notNull().default(''),
  phone: varchar('phone', { length: 64 }).notNull().default(''),
  location: varchar('location', { length: 255 }).notNull().default(''),
  socials: jsonb('socials').notNull().default({}),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

export const skills = pgTable('skills', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 128 }).notNull(),
  category: varchar('category', { length: 128 }).notNull().default('general'),
  level: integer('level').notNull().default(3),
  sortOrder: integer('sort_order').notNull().default(0)
})

export const experiences = pgTable('experiences', {
  id: serial('id').primaryKey(),
  company: varchar('company', { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }).notNull(),
  description: text('description').notNull().default(''),
  location: varchar('location', { length: 255 }).notNull().default(''),
  startDate: varchar('start_date', { length: 32 }).notNull(),
  endDate: varchar('end_date', { length: 32 }),
  isCurrent: boolean('is_current').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0)
})

export const education = pgTable('education', {
  id: serial('id').primaryKey(),
  school: varchar('school', { length: 255 }).notNull(),
  degree: varchar('degree', { length: 255 }).notNull().default(''),
  field: varchar('field', { length: 255 }).notNull().default(''),
  startDate: varchar('start_date', { length: 32 }).notNull(),
  endDate: varchar('end_date', { length: 32 }),
  description: text('description').notNull().default(''),
  sortOrder: integer('sort_order').notNull().default(0)
})

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  summary: text('summary').notNull().default(''),
  description: text('description').notNull().default(''),
  coverImageUrl: text('cover_image_url').notNull().default(''),
  projectUrl: text('project_url').notNull().default(''),
  repoUrl: text('repo_url').notNull().default(''),
  tags: jsonb('tags').notNull().default([]),
  featured: boolean('featured').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow()
})

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }).notNull().default(''),
  body: text('body').notNull(),
  read: boolean('read').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow()
})
