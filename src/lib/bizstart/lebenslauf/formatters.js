/** Format helpers shared by preview and export */

export function formatGeburtsdatum(iso) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return iso
  }
}

export function bulletsFromMultiline(text) {
  if (!text?.trim()) return []
  return text
    .split('\n')
    .map((l) => l.replace(/^[\s•\-–*]+/, '').trim())
    .filter(Boolean)
}

export function familienstandLabel(v) {
  const map = {
    ledig: 'ledig',
    verheiratet: 'verheiratet',
    geschieden: 'geschieden',
    verwitwet: 'verwitwet',
    'eingetragene Lebenspartnerschaft': 'eingetragene Lebenspartnerschaft',
  }
  return map[v] || v || ''
}
