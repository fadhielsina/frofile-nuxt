/**
 * robots.txt — public pages are open to everyone, including AI answer-engine
 * crawlers (GEO). Admin and API stay out of indexes.
 */
export default defineEventHandler((event) => {
  const origin = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true }).origin
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=3600')

  const aiBots = [
    'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
    'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'CCBot'
  ]

  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /api/',
    '',
    ...aiBots.flatMap((bot) => [`User-agent: ${bot}`, 'Allow: /', 'Disallow: /admin', 'Disallow: /api/', '']),
    `Sitemap: ${origin}/sitemap.xml`,
    `# LLM-friendly summary: ${origin}/llms.txt`,
    ''
  ].join('\n')
})
