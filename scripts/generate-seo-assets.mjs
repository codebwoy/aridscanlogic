import sharp from 'sharp'
import { writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const siteUrl = (process.env.VITE_SITE_URL || 'https://codebwoy.github.io/aridscanlogic').replace(
  /\/$/,
  ''
)
const today = new Date().toISOString().slice(0, 10)

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`

writeFileSync(join(root, 'public/sitemap.xml'), sitemap, 'utf8')
console.log(`Wrote public/sitemap.xml (${siteUrl})`)

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`
writeFileSync(join(root, 'public/robots.txt'), robots, 'utf8')
console.log('Wrote public/robots.txt')

const src = join(root, 'public/pwa-icon.svg')
await sharp(src)
  .resize(1200, 630, { fit: 'contain', background: { r: 15, g: 23, b: 42 } })
  .png()
  .toFile(join(root, 'public/og-image.png'))
console.log('Wrote public/og-image.png')
