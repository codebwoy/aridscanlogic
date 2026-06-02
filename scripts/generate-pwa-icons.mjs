import sharp from 'sharp'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'public/pwa-icon.svg')
const maskableSrc = join(root, 'public/pwa-icon-maskable.svg')

const sizes = [
  { name: 'pwa-192x192.png', size: 192 },
  { name: 'pwa-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
]

for (const { name, size } of sizes) {
  await sharp(src).resize(size, size).png().toFile(join(root, 'public', name))
  console.log(`Wrote public/${name}`)
}

await sharp(maskableSrc).resize(512, 512).png().toFile(join(root, 'public/pwa-512x512-maskable.png'))
console.log('Wrote public/pwa-512x512-maskable.png')
