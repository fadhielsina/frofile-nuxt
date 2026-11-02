/**
 * SEO + GEO (Generative Engine Optimization) in one place.
 *  - classic SEO: title/description, canonical, Open Graph, Twitter, robots
 *  - GEO: JSON-LD (Person, ProfilePage, WebSite, FAQPage) + plain-language
 *    FAQ content that AI answer engines can quote directly.
 * Everything is derived from the same profile data the page renders.
 */
export interface FaqItem {
  q: string
  a: string
}

export function buildFaq(
  profile: Profile,
  skills: Skill[],
  experiences: Experience[],
  education: Education[]
): FaqItem[] {
  const byCategory = new Map<string, string[]>()
  for (const s of skills) byCategory.set(s.category, [...(byCategory.get(s.category) || []), s.name])
  const stack = [...byCategory.entries()].map(([cat, list]) => `${cat}: ${list.join(', ')}`).join('. ')

  const current = experiences.find((e) => e.isCurrent) || experiences[0]
  const items: FaqItem[] = [
    { q: `Who is ${profile.name}?`, a: `${profile.name} is a ${profile.headline}${profile.location ? ` based in ${profile.location}` : ''}. ${profile.bio}` }
  ]
  if (stack) items.push({ q: `What technologies does ${profile.name} work with?`, a: `${stack}.` })
  if (current)
    items.push({
      q: `What does ${profile.name} do now?`,
      a: `${profile.name} works as ${current.role} at ${current.company} (${current.startDate} – ${current.isCurrent ? 'present' : current.endDate}). ${current.description}`.trim()
    })
  if (experiences.length)
    items.push({
      q: `Where has ${profile.name} worked?`,
      a: experiences.map((e) => `${e.role} at ${e.company} (${e.startDate} – ${e.isCurrent ? 'present' : e.endDate})`).join('; ') + '.'
    })
  if (education.length)
    items.push({
      q: `What is ${profile.name}'s education?`,
      a: education.map((e) => [e.degree, e.field, e.school, `${e.startDate}–${e.endDate || 'present'}`].filter(Boolean).join(', ')).join('; ') + '.'
    })
  if (profile.email)
    items.push({ q: `How can I contact ${profile.name}?`, a: `Email ${profile.email}${profile.phone ? ` or call/WhatsApp ${profile.phone}` : ''}.` })
  return items
}

export function useProfileSeo(
  profile: Profile,
  skills: Skill[],
  experiences: Experience[],
  education: Education[],
  faq: FaqItem[]
) {
  const { origin } = useRequestURL()
  const route = useRoute()
  const url = `${origin}${route.path === '/' ? '' : route.path}` || origin
  const canonical = origin + '/'
  const image = profile.avatarUrl?.startsWith('http') ? profile.avatarUrl : `${origin}${profile.avatarUrl || '/avatar.png'}`
  const title = `${profile.name} — ${profile.headline}`
  const description = (profile.bio || title).slice(0, 158)
  const current = experiences.find((e) => e.isCurrent) || experiences[0]

  useSeoMeta({
    title,
    description,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1',
    ogType: 'profile',
    ogTitle: title,
    ogDescription: description,
    ogUrl: canonical,
    ogImage: image,
    ogImageAlt: `Portrait of ${profile.name}`,
    ogSiteName: profile.name,
    ogLocale: 'en_US',
    twitterCard: 'summary',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image
  })

  const sameAs = Object.values(profile.socials || {}).filter(Boolean)
  const person = {
    '@type': 'Person',
    '@id': `${canonical}#person`,
    name: profile.name,
    jobTitle: profile.headline,
    description: profile.bio,
    url: canonical,
    image,
    email: profile.email ? `mailto:${profile.email}` : undefined,
    telephone: profile.phone || undefined,
    address: profile.location ? { '@type': 'PostalAddress', addressLocality: profile.location } : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    knowsAbout: skills.map((s) => s.name),
    worksFor: current ? { '@type': 'Organization', name: current.company } : undefined,
    alumniOf: education.map((e) => ({ '@type': 'EducationalOrganization', name: e.school }))
  }

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      person,
      {
        '@type': 'WebSite',
        '@id': `${canonical}#website`,
        url: canonical,
        name: `${profile.name} — Portfolio`,
        inLanguage: 'en',
        publisher: { '@id': `${canonical}#person` }
      },
      {
        '@type': 'ProfilePage',
        '@id': `${canonical}#profilepage`,
        url: canonical,
        name: title,
        mainEntity: { '@id': `${canonical}#person` },
        isPartOf: { '@id': `${canonical}#website` },
        about: { '@id': `${canonical}#person` }
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        mainEntity: faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a }
        }))
      }
    ]
  }

  useHead({
    link: [{ rel: 'canonical', href: canonical }],
    script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(graph) }]
  })

  return { url }
}
