/** Personalized German tax deadlines for current year */

export function buildTaxCalendar(formData, year = new Date().getFullYear()) {
  const isKlein = formData.vatScheme === 'kleinunternehmer'
  const freq = formData.vatFilingFrequency || 'quarterly'
  const items = []

  if (!isKlein) {
    const months = freq === 'monthly' ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] : [3, 6, 9, 12]
    months.forEach((m) => {
      const dueMonth = m === 12 ? 1 : m + 1
      const dueYear = m === 12 ? year + 1 : year
      items.push({
        id: `ust-${m}`,
        name: 'Umsatzsteuervoranmeldung',
        nameEn: 'VAT pre-return (USt-VA)',
        dueDate: `${dueYear}-${String(dueMonth).padStart(2, '0')}-10`,
        category: 'USt',
        prepare: 'VAT collected minus input VAT from receipts',
      })
    })
  }

  ;[
    { m: 3, d: 15, name: 'Gewerbesteuervorauszahlung Q1' },
    { m: 6, d: 15, name: 'Gewerbesteuervorauszahlung Q2' },
    { m: 9, d: 15, name: 'Gewerbesteuervorauszahlung Q3' },
    { m: 12, d: 15, name: 'Gewerbesteuervorauszahlung Q4' },
  ].forEach((q) => {
    items.push({
      id: `gew-${q.m}`,
      name: q.name,
      dueDate: `${year}-${String(q.m).padStart(2, '0')}-${String(q.d).padStart(2, '0')}`,
      category: 'Gewerbe',
    })
  })

  ;[
    { m: 3, d: 10 },
    { m: 6, d: 10 },
    { m: 9, d: 10 },
    { m: 12, d: 10 },
  ].forEach((q, i) => {
    items.push({
      id: `est-${i}`,
      name: 'Einkommensteuervorauszahlung',
      dueDate: `${year}-${String(q.m).padStart(2, '0')}-${String(q.d).padStart(2, '0')}`,
      category: 'ESt',
    })
  })

  items.push({
    id: 'est-annual',
    name: 'Einkommensteuererklärung',
    dueDate: `${year + 1}-07-31`,
    category: 'ESt',
    prepare: 'Annual income tax return',
  })

  if (['gmbh', 'ug'].includes(formData.businessStructure)) {
    items.push({
      id: 'kst',
      name: 'Körperschaftsteuervorauszahlung',
      dueDate: `${year}-03-10`,
      category: 'KSt',
    })
  }

  return items
    .map((item) => {
      const due = new Date(item.dueDate)
      const days = Math.ceil((due - new Date()) / 86400000)
      return { ...item, daysUntil: days, urgent: days >= 0 && days < 14 }
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
}
