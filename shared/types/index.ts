// Shared between app/ and server/ (Nuxt 4 auto-imports the shared/ dir on both sides).

export interface Profile {
  id: number
  name: string
  headline: string
  bio: string
  avatarUrl: string
  resumeUrl: string
  email: string
  phone: string
  location: string
  socials: Record<string, string>
}

export interface Skill {
  id: number
  name: string
  category: string
  level: number
  sortOrder: number
}

export interface Experience {
  id: number
  company: string
  role: string
  description: string
  location: string
  startDate: string
  endDate: string | null
  isCurrent: boolean
  sortOrder: number
}

export interface Education {
  id: number
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string | null
  description: string
  sortOrder: number
}

export interface Project {
  id: number
  title: string
  slug: string
  summary: string
  description: string
  coverImageUrl: string
  projectUrl: string
  repoUrl: string
  tags: string[]
  featured: boolean
  sortOrder: number
  createdAt: string
}

export interface ContactMessage {
  id: number
  name: string
  email: string
  subject: string
  body: string
  read: boolean
  createdAt: string
}
