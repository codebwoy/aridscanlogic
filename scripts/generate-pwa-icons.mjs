import sharp from 'sharp'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'public/brand-logo.png')
const maskBg = { r: 10, g: 15, b: 26, alpha: 1 }

const sizes = [
  { name: 'favicon-16.png', size: 16 },
  { name: 'favicon-32.png', size: 32 },
  { name: 'favicon.png', size: 48 },
  { name: 'pwa-192x192.png', size: 192 },
  { name: 'pwa-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
]

for (const { name, size } of sizes) {
  await sharp(src).resize(size, size).png().toFile(join(root, 'public', name))
  console.log(`Wrote public/${name}`)
}

await sharp(src)
  .resize(410, 410)
  .extend({
    top: 51,
    bottom: 51,
    left: 51,
    right: 51,
    background: maskBg,
  })
  .png()
  .toFile(join(root, 'public/pwa-512x512-maskable.png'))
console.log('Wrote public/pwa-512x512-maskable.png')
