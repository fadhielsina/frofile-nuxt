/**
 * llms.txt — a plain-Markdown summary of the site for LLM crawlers and AI
 * answer engines (GEO). Generated from the same data the pages render.
 */
export default defineEventHandler(async (event) => {
  const origin = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true }).origin
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=3600')

  const [profile, skills, experiences, education] = await Promise.all([
    $fetch<Profile | null>('/api/profile'),
    $fetch<Skill[]>('/api/skills'),
    $fetch<Experience[]>('/api/experiences'),
    $fetch<Education[]>('/api/education')
  ])
  if (!profile) return '# Portfolio\n'

  const range = (a: string, b: string | null, current?: boolean) => `${a} – ${current ? 'present' : b || ''}`
  const byCat = new Map<string, string[]>()
  for (const s of skills) byCat.set(s.category, [...(byCat.get(s.category) || []), s.name])

  const lines = [
    `# ${profile.name}`,
    '',
    `> ${profile.headline}${profile.location ? ` — ${profile.location}` : ''}. ${profile.bio}`,
    '',
    '## Contact',
    profile.email ? `- Email: ${profile.email}` : '',
    profile.phone ? `- Phone / WhatsApp: ${profile.phone}` : '',
    ...Object.entries(profile.socials || {}).filter(([, u]) => u).map(([k, u]) => `- ${k}: ${u}`),
    `- Website: ${origin}/`,
    '',
    '## Skills',
    ...[...byCat.entries()].map(([c, l]) => `- ${c}: ${l.join(', ')}`),
    '',
    '## Experience',
    ...experiences.map((e) => `- ${e.role}, ${e.company} (${range(e.startDate, e.endDate, e.isCurrent)}): ${e.description}`),
    '',
    '## Education',
    ...education.map((e) => `- ${[e.degree, e.field, e.school].filter(Boolean).join(', ')} (${range(e.startDate, e.endDate)})`),
    ''
  ]
  return lines.filter((l, i, a) => !(l === '' && a[i - 1] === '')).join('\n')
})
