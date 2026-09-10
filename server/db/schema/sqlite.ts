/**
 * SQLite dialect schema (default/local-dev provider, zero external setup).
 * Mirrors server/db/schema/pg.ts and mysql.ts field-for-field.
 */
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

export const adminUsers = sqliteTable('admin_users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP')
})

export const profile = sqliteTable('profile', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().default(''),
  headline: text('headline').notNull().default(''),
  bio: text('bio').notNull().default(''),
  avatarUrl: text('avatar_url').notNull().default(''),
  resumeUrl: text('resume_url').notNull().default(''),
  email: text('email').notNull().default(''),
  phone: text('phone').notNull().default(''),
  location: text('location').notNull().default(''),
  socials: text('socials', { mode: 'json' }).notNull().default({}),
  updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP')
})

export const skills = sqliteTable('skills', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  category: text('category').notNull().default('general'),
  level: integer('level').notNull().default(3),
  sortOrder: integer('sort_order').notNull().default(0)
})

export const experiences = sqliteTable('experiences', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  company: text('company').notNull(),
  role: text('role').notNull(),
  description: text('description').notNull().default(''),
  location: text('location').notNull().default(''),
  startDate: text('start_date').notNull(),
  endDate: text('end_date'),
  isCurrent: integer('is_current', { mode: 'boolean' }).notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0)
})

export const education = sqliteTable('education', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  school: text('school').notNull(),
  degree: text('degree').notNull().default(''),
  field: text('field').notNull().default(''),
  startDate: text('start_date').notNull(),
  endDate: text('end_date'),
  description: text('description').notNull().default(''),
  sortOrder: integer('sort_order').notNull().default(0)
})

export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  summary: text('summary').notNull().default(''),
  description: text('description').notNull().default(''),
  coverImageUrl: text('cover_image_url').notNull().default(''),
  projectUrl: text('project_url').notNull().default(''),
  repoUrl: text('repo_url').notNull().default(''),
  tags: text('tags', { mode: 'json' }).notNull().default([]),
  featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP')
})

export const messages = sqliteTable('messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull().default(''),
  body: text('body').notNull(),
  read: integer('read', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP')
})
