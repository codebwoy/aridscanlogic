import { deflateRawSync } from 'node:zlib'

/**
 * Minimal ZIP (store or deflate) writer — no extra dependency.
 * PDFs are already compressed; we STORE them. Text/JSON use deflate.
 */

function crc32Of(buf) {
  let c = ~0
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i]
    for (let k = 0; k < 8; k++) c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : c >>> 1
  }
  return ~c >>> 0
}

function dosDateTime(d = new Date()) {
  const year = Math.max(1980, d.getFullYear())
  const dosTime =
    (d.getHours() << 11) | (d.getMinutes() << 5) | Math.floor(d.getSeconds() / 2)
  const dosDate = ((year - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()
  return { dosTime, dosDate }
}

/**
 * @param {{ name: string, data: Buffer|string, compress?: boolean }[]} files
 * @returns {Buffer}
 */
export function buildZip(files) {
  const { dosTime, dosDate } = dosDateTime()
  const localParts = []
  const centralParts = []
  let offset = 0

  for (const file of files) {
    const name = Buffer.from(String(file.name).replace(/^\/+/, ''), 'utf8')
    const raw = Buffer.isBuffer(file.data) ? file.data : Buffer.from(String(file.data), 'utf8')
    const useDeflate = file.compress !== false && raw.length > 256 && !/\.pdf$/i.test(file.name)
    let compressed = raw
    let method = 0
    if (useDeflate) {
      try {
        const deflated = deflateRawSync(raw, { level: 9 })
        if (deflated.length < raw.length) {
          compressed = deflated
          method = 8
        }
      } catch {
        compressed = raw
        method = 0
      }
    }
    const crc = crc32Of(raw)
    const localHeader = Buffer.alloc(30)
    localHeader.writeUInt32LE(0x04034b50, 0)
    localHeader.writeUInt16LE(20, 4)
    localHeader.writeUInt16LE(0, 6)
    localHeader.writeUInt16LE(method, 8)
    localHeader.writeUInt16LE(dosTime, 10)
    localHeader.writeUInt16LE(dosDate, 12)
    localHeader.writeUInt32LE(crc, 14)
    localHeader.writeUInt32LE(compressed.length, 18)
    localHeader.writeUInt32LE(raw.length, 22)
    localHeader.writeUInt16LE(name.length, 26)
    localHeader.writeUInt16LE(0, 28)

    const localOffset = offset
    localParts.push(localHeader, name, compressed)
    offset += localHeader.length + name.length + compressed.length

    const central = Buffer.alloc(46)
    central.writeUInt32LE(0x02014b50, 0)
    central.writeUInt16LE(20, 4)
    central.writeUInt16LE(20, 6)
    central.writeUInt16LE(0, 8)
    central.writeUInt16LE(method, 10)
    central.writeUInt16LE(dosTime, 12)
    central.writeUInt16LE(dosDate, 14)
    central.writeUInt32LE(crc, 16)
    central.writeUInt32LE(compressed.length, 20)
    central.writeUInt32LE(raw.length, 24)
    central.writeUInt16LE(name.length, 28)
    central.writeUInt16LE(0, 30)
    central.writeUInt16LE(0, 32)
    central.writeUInt16LE(0, 34)
    central.writeUInt16LE(0, 36)
    central.writeUInt32LE(0, 38)
    central.writeUInt32LE(localOffset, 42)
    centralParts.push(central, name)
  }

  const centralDir = Buffer.concat(centralParts)
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0)
  end.writeUInt16LE(0, 4)
  end.writeUInt16LE(0, 6)
  end.writeUInt16LE(files.length, 8)
  end.writeUInt16LE(files.length, 10)
  end.writeUInt32LE(centralDir.length, 12)
  end.writeUInt32LE(offset, 16)
  end.writeUInt16LE(0, 20)

  return Buffer.concat([...localParts, centralDir, end])
}

export function dataUrlToBuffer(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string') return null
  const m = dataUrl.match(/^data:([^;]+);base64,(.+)$/)
  if (!m) return null
  return Buffer.from(m[2], 'base64')
}
