const buckets = new Map()

export function rateLimit({ windowMs = 60_000, max = 90, keyFn } = {}) {
  return (req, res) => {
    const key = keyFn ? keyFn(req) : req.socket?.remoteAddress || 'unknown'
    const now = Date.now()
    let bucket = buckets.get(key)
    if (!bucket || now - bucket.start > windowMs) {
      bucket = { start: now, count: 0 }
    }
    buckets.set(key, bucket)
    if (buckets.size > 2000 && Math.random() < 0.02) {
      for (const [k, b] of buckets) {
        if (now - b.start > windowMs) buckets.delete(k)
      }
    }
    bucket.count += 1
    if (bucket.count > max) {
      res.writeHead(429, {
        'Content-Type': 'application/json',
        'Retry-After': String(Math.ceil(windowMs / 1000)),
      })
      res.end(JSON.stringify({ error: 'Too many requests', code: 'rate_limited' }))
      return false
    }
    return true
  }
}
