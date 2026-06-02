const DE_ONES = [
  '',
  'ein',
  'zwei',
  'drei',
  'vier',
  'fünf',
  'sechs',
  'sieben',
  'acht',
  'neun',
  'zehn',
  'elf',
  'zwölf',
  'dreizehn',
  'vierzehn',
  'fünfzehn',
  'sechzehn',
  'siebzehn',
  'achtzehn',
  'neunzehn',
]
const DE_TENS = ['', '', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig']

function deBelow100(n) {
  if (n < 20) return DE_ONES[n]
  const t = Math.floor(n / 10)
  const o = n % 10
  if (o === 0) return DE_TENS[t]
  if (o === 1 && t !== 0) return `einund${DE_TENS[t]}`
  return `${DE_ONES[o]}und${DE_TENS[t]}`
}

function amountInGerman(euros, cents) {
  if (euros === 0 && cents === 0) return 'null Euro'
  const parts = []
  if (euros >= 1000000) {
    const m = Math.floor(euros / 1000000)
    parts.push(`${deBelow100(m) || m} Million`)
    euros %= 1000000
  }
  if (euros >= 1000) {
    const t = Math.floor(euros / 1000)
    parts.push(t === 1 ? 'eintausend' : `${deBelow100(t)}tausend`)
    euros %= 1000
  }
  if (euros >= 100) {
    const h = Math.floor(euros / 100)
    parts.push(h === 1 ? 'einhundert' : `${deBelow100(h)}hundert`)
    euros %= 100
  }
  if (euros > 0) parts.push(deBelow100(euros))
  const euroStr = parts.length ? `${parts.join('')} Euro` : 'null Euro'
  const centStr =
    cents === 0 ? 'null Cent' : cents === 1 ? 'ein Cent' : `${deBelow100(cents)} Cent`
  return `${euroStr} und ${centStr}`
}

const EN_ONES = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
]
const EN_TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

function amountInEnglish(amount) {
  const euros = Math.floor(amount)
  const cents = Math.round((amount - euros) * 100)
  if (euros === 0 && cents === 0) return 'zero euros'
  let words = euros < 20 ? EN_ONES[euros] : `${EN_TENS[Math.floor(euros / 10)]} ${EN_ONES[euros % 10]}`.trim()
  words += euros === 1 ? ' euro' : ' euros'
  words += ` and ${cents} cent${cents === 1 ? '' : 's'}`
  return words
}

export function amountToWords(amount) {
  const euros = Math.floor(amount)
  const cents = Math.round((amount - euros) * 100)
  return {
    de: amountInGerman(euros, cents),
    en: amountInEnglish(amount),
    formatted: `${amountInEnglish(amount)} / ${amountInGerman(euros, cents)} — €${amount.toFixed(2)}`,
  }
}
