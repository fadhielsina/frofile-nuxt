/**
 * MySQL dialect schema.
 * Mirrors server/db/schema/pg.ts and sqlite.ts field-for-field.
 */
import { mysqlTable, serial, text, varchar, int, boolean, timestamp, json } from 'drizzle-orm/mysql-core'

export const adminUsers = mysqlTable('admin_users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
})

export const profile = mysqlTable('profile', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().default(''),
  headline: varchar('headline', { length: 255 }).notNull().default(''),
  bio: text('bio').notNull(),
  avatarUrl: text('avatar_url').notNull(),
  resumeUrl: text('resume_url').notNull(),
  email: varchar('email', { length: 255 }).notNull().default(''),
  phone: varchar('phone', { length: 64 }).notNull().default(''),
  location: varchar('location', { length: 255 }).notNull().default(''),
  socials: json('socials').notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

export const skills = mysqlTable('skills', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 128 }).notNull(),
  category: varchar('category', { length: 128 }).notNull().default('general'),
  level: int('level').notNull().default(3),
  sortOrder: int('sort_order').notNull().default(0)
})

export const experiences = mysqlTable('experiences', {
  id: serial('id').primaryKey(),
  company: varchar('company', { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }).notNull(),
  description: text('description'),
  location: varchar('location', { length: 255 }).notNull().default(''),
  startDate: varchar('start_date', { length: 32 }).notNull(),
  endDate: varchar('end_date', { length: 32 }),
  isCurrent: boolean('is_current').notNull().default(false),
  sortOrder: int('sort_order').notNull().default(0)
})

export const education = mysqlTable('education', {
  id: serial('id').primaryKey(),
  school: varchar('school', { length: 255 }).notNull(),
  degree: varchar('degree', { length: 255 }).notNull().default(''),
  field: varchar('field', { length: 255 }).notNull().default(''),
  startDate: varchar('start_date', { length: 32 }).notNull(),
  endDate: varchar('end_date', { length: 32 }),
  description: text('description'),
  sortOrder: int('sort_order').notNull().default(0)
})

export const projects = mysqlTable('projects', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  summary: text('summary'),
  description: text('description'),
  coverImageUrl: text('cover_image_url'),
  projectUrl: text('project_url'),
  repoUrl: text('repo_url'),
  tags: json('tags').notNull(),
  featured: boolean('featured').notNull().default(false),
  sortOrder: int('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow()
})

export const messages = mysqlTable('messages', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }).notNull().default(''),
  body: text('body').notNull(),
  read: boolean('read').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow()
})
