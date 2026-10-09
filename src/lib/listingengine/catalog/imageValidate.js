/**
 * Catalog image checks — HTTPS required; optional reachability probe.
 */

export function validateImageUrls(urls = []) {
  const list = (Array.isArray(urls) ? urls : []).map(String).filter(Boolean)
  const flags = []
  if (!list.length) {
    flags.push('missing_images')
    return { ok: false, flags, reachable: [] }
  }
  for (const u of list) {
    if (!/^https:\/\//i.test(u)) flags.push(`insecure_image:${u.slice(0, 40)}`)
  }
  return {
    ok: flags.length === 0,
    flags,
    reachable: list.filter((u) => /^https:\/\//i.test(u)),
  }
}

/**
 * Best-effort HEAD/GET probe (browser CORS may block — treat failure as warning only).
 */
export async function probeImageReachability(urls = [], { timeoutMs = 4000 } = {}) {
  const list = (Array.isArray(urls) ? urls : []).slice(0, 6)
  const results = []
  for (const url of list) {
    if (!/^https:\/\//i.test(url)) {
      results.push({ url, ok: false, reason: 'not_https' })
      continue
    }
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), timeoutMs)
    try {
      let res = await fetch(url, { method: 'HEAD', mode: 'cors', signal: controller.signal })
      if (!res.ok || res.status === 405) {
        res = await fetch(url, { method: 'GET', mode: 'cors', signal: controller.signal })
      }
      results.push({
        url,
        ok: res.ok,
        status: res.status,
        reason: res.ok ? '' : `http_${res.status}`,
      })
    } catch {
      // CORS often blocks — warn, don't hard-fail
      results.push({ url, ok: null, reason: 'probe_blocked_or_failed' })
    } finally {
      clearTimeout(t)
    }
  }
  return results
}

export async function attachImageValidation(product) {
  const basic = validateImageUrls(product.images)
  const probes = await probeImageReachability(basic.reachable)
  const hardFail = basic.flags.filter((f) => f.startsWith('insecure') || f === 'missing_images')
  const soft = probes.filter((p) => p.ok === false).map((p) => `unreachable:${p.url.slice(0, 32)}`)
  const warn = probes.filter((p) => p.ok === null).map(() => 'warn:image_probe_inconclusive')
  const flags = [...hardFail, ...soft, ...warn]
  return {
    ...product,
    image_validation: { basic, probes },
    policy_flags: [...new Set([...(product.policy_flags || []), ...flags])],
    policy_ok: product.policy_ok !== false && hardFail.length === 0,
  }
}
