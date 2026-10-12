import test from 'node:test'
import assert from 'node:assert/strict'
import { PUBLISHER_TRUTHS_CONFIG } from './publisherTruthsConfig.js'
import { AMAZON_GUIDES } from './guides.js'

test('publisher truths has ten numbered EN/DE entries', () => {
  assert.equal(PUBLISHER_TRUTHS_CONFIG.truths.length, 10)
  for (const t of PUBLISHER_TRUTHS_CONFIG.truths) {
    assert.ok(t.number >= 1)
    assert.ok(t.title.en)
    assert.ok(t.title.de)
  }
})

test('pricing and timeline sections are present', () => {
  const pricing = PUBLISHER_TRUTHS_CONFIG.truths.find((t) => t.id === 'pricing')
  const longGame = PUBLISHER_TRUTHS_CONFIG.truths.find((t) => t.id === 'long_game')
  assert.ok((pricing?.pricing || []).length >= 4)
  assert.ok((longGame?.timeline || []).length >= 4)
})

test('publisher-truths is the first default-open Amazon Hub guide', () => {
  assert.equal(AMAZON_GUIDES[0].id, 'publisher-truths')
  assert.equal(AMAZON_GUIDES[0].defaultOpen, true)
})

test('kdp-account-termination playbook exists with EN/DE sections', () => {
  const guide = AMAZON_GUIDES.find((g) => g.id === 'kdp-account-termination')
  assert.ok(guide, 'missing kdp-account-termination guide')
  assert.ok(guide.title.en)
  assert.ok(guide.title.de)
  assert.ok(guide.sections.length >= 12)
  assert.match(guide.summary.en, /150 books/)
  assert.match(guide.summary.en, /POA template/)
  const headings = guide.sections.map((s) => s.heading.en).join(' | ')
  for (const need of [
    'POA template',
    'Draft2Digital',
    'IngramSpark',
    'Quality over mass quantity',
    'rented land',
    'copyright & trademark',
    'Back up everything',
  ]) {
    assert.match(headings, new RegExp(need, 'i'), `missing section covering: ${need}`)
  }
  for (const section of guide.sections) {
    assert.ok(section.heading.en)
    assert.ok(section.heading.de)
  }
})

test('independence disclaimer is marked', () => {
  assert.match(PUBLISHER_TRUTHS_CONFIG.independenceDisclaimer.en, /⚠/)
  assert.match(PUBLISHER_TRUTHS_CONFIG.independenceDisclaimer.de, /⚠/)
})

test('distribution links cover KDP alternatives and direct sales', () => {
  const dist = PUBLISHER_TRUTHS_CONFIG.truths.find((t) => t.id === 'distribution')
  const labels = (dist?.links || []).map((l) => l.label)
  for (const need of [
    'KDP',
    'IngramSpark',
    'Lulu',
    'Gumroad',
    'Payhip',
    'Draft2Digital',
    'Tolino Media',
    'BoD',
    'epubli',
    'BookRix',
    'tredition',
  ]) {
    assert.ok(labels.includes(need), `missing link ${need}`)
  }
})

test('german-first config lists DACH upload platforms', async () => {
  const { GERMAN_FIRST_CONFIG } = await import('./germanFirstConfig.js')
  const dach = GERMAN_FIRST_CONFIG.dachUploadPlatforms
  assert.ok(dach)
  assert.ok(dach.platforms.length >= 5)
  const ids = dach.platforms.map((p) => p.id)
  for (const need of ['tolino_media', 'bod', 'epubli', 'bookrix', 'tredition']) {
    assert.ok(ids.includes(need), `missing platform ${need}`)
  }
  assert.ok((dach.wideFit || []).length >= 3)
  assert.match(dach.impressumTip.en, /Impressum/)
  assert.match(dach.impressumTip.en, /Pressegesetz/)
  assert.match(dach.wideFit.map((r) => r.detail.en).join(' '), /brick-and-mortar/)
  assert.match(dach.platforms.find((p) => p.id === 'bookrix').beginnerNote.en, /small commission/)
  const dom = dach.domesticRequirements
  assert.ok(dom)
  const domText = [
    ...dom.impressum.en,
    ...dom.buchpreisbindung.en,
    ...dom.accountAdmin.en,
    ...dom.filesDeposit.en,
    ...dom.checklist.flatMap((r) => [r.label.en, r.detail.en]),
    dom.intro.en,
  ].join(' ')
  for (const need of [
    'Pressegesetz',
    'publisher of record',
    'Impressum-Service',
    'home address',
    'Buchpreisbindung',
    '€4.99',
    'Thalia',
    'Hugendubel',
    'Apple Books',
    'passport',
    'SEPA',
    'IBAN',
    'Steuernummer',
    'Umsatzsteuer',
    'Gewerbe',
    'Freiberufler',
    'Kleinunternehmer',
    '§ 19 UStG',
    'Reverse Charge',
    'reflowable',
    '.epub',
    '.kfx',
    '.mobi',
    'fonts embedded',
    'Front + Spine + Back',
    'bleed',
    'Pflichtexemplare',
    'Deutsche Nationalbibliothek',
    'BoD',
    'Tolino Media',
  ]) {
    assert.match(domText, new RegExp(need.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), `germanFirst domestic missing: ${need}`)
  }
  assert.equal(dom.checklist.length, 5)
})

test('reviews plan includes 10–15 target and advance-copy services', () => {
  const reviews = PUBLISHER_TRUTHS_CONFIG.truths.find((t) => t.id === 'reviews')
  assert.match((reviews?.bullets?.en || []).join(' '), /10–15/)
  const labels = (reviews?.links || []).map((l) => l.label)
  assert.ok(labels.includes('NetGalley'))
  assert.ok(labels.includes('BookSirens'))
})

test('tax truth deep-links to Hub tax-de playbook', () => {
  const tax = PUBLISHER_TRUTHS_CONFIG.truths.find((t) => t.id === 'tax_de')
  assert.equal(tax?.hubGuideId, 'tax-de')
  const taxText = [...(tax?.bullets?.en || []), tax?.note?.en || ''].join(' ')
  for (const need of [
    'Gewerbe',
    'Freiberufler',
    '§ 18 EStG',
    'Steuer-ID',
    'Fragebogen zur steuerlichen Erfassung',
    'Steuernummer',
    'USt-IdNr',
    'Reverse Charge',
    'Kleinunternehmer',
    '§ 19 UStG',
  ]) {
    assert.match(
      taxText,
      new RegExp(need.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      `tax_de truth missing: ${need}`,
    )
  }
})

test('tax-de playbook covers Freiberufler registration 100%', () => {
  const guide = AMAZON_GUIDES.find((g) => g.id === 'tax-de')
  assert.ok(guide, 'missing tax-de guide')
  assert.ok(guide.sections.length >= 5)
  const text = guide.sections
    .flatMap((s) => [
      s.heading.en,
      ...(s.bullets?.en || []),
      ...(s.rows || []).flatMap((r) => [r.label.en, r.detail.en]),
      s.note?.en || '',
    ])
    .join(' ')
  for (const need of [
    'Gewerbe',
    'Gewerbeanmeldung',
    'Freiberufler',
    '§ 18 EStG',
    'freie freiberufliche Tätigkeit',
    'Tantiemen',
    'Steuer-ID',
    'Identifikationsnummer',
    '12 345 678 901',
    'NOT enough',
    'Steuernummer',
    '15/123/45678',
    'Fragebogen zur steuerlichen Erfassung',
    'ELSTER',
    'Accountable',
    'Sorted',
    'Umsatzsteuer-ID',
    'USt-IdNr',
    'DE123456789',
    'Reverse Charge',
    'Luxembourg',
    'Draft2Digital',
    'Apple Books',
    'Freiberufliche Autorin',
    'Freiberuflicher Autor',
    'Kleinunternehmerregelung',
    '§ 19 UStG',
    '€22,000',
    '2–4 weeks',
    'Tolino Media',
    'BoD',
    'Not needed',
    'Not enough',
    'merchandise',
    't-shirts',
    'e-commerce',
  ]) {
    assert.match(
      text,
      new RegExp(need.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      `tax-de missing: ${need}`,
    )
  }
})

test('KDP + German-first embed author tax registration 100%', async () => {
  const { KDP_CONFIG } = await import('./kdpConfig.js')
  const { GERMAN_FIRST_CONFIG } = await import('./germanFirstConfig.js')
  assert.ok(KDP_CONFIG.tax.authorRegistration)
  assert.equal(KDP_CONFIG.tax.hubGuideId, 'tax-de')
  assert.ok(GERMAN_FIRST_CONFIG.authorTaxRegistration)
  assert.equal(GERMAN_FIRST_CONFIG.authorTaxRegistration.hubGuideId, 'tax-de')
  for (const [name, block] of [
    ['kdp', KDP_CONFIG.tax.authorRegistration],
    ['germanFirst', GERMAN_FIRST_CONFIG.authorTaxRegistration],
  ]) {
    const text = [
      block.intro.en,
      ...block.gewerbeVsFreelance.en,
      ...block.taxNumbers.en,
      ...block.setupSteps.en,
      ...block.checklist.flatMap((r) => [r.label.en, r.status.en, r.detail.en]),
    ].join(' ')
    for (const need of [
      'Gewerbe',
      '§ 18 EStG',
      'Freiberufler',
      'Steuer-ID',
      'NOT enough',
      'Steuernummer',
      'Fragebogen zur steuerlichen Erfassung',
      'USt-IdNr',
      'Reverse Charge',
      'ELSTER',
      'Kleinunternehmer',
      '§ 19 UStG',
      '€22,000',
      '2–4 weeks',
      'Not needed',
      'Luxembourg',
      'Draft2Digital',
      't-shirts',
    ]) {
      assert.match(
        text,
        new RegExp(need.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
        `${name} authorTax missing: ${need}`,
      )
    }
    assert.equal(block.checklist.length, 4)
  }
  assert.match(KDP_CONFIG.startThisWeek.en.join(' '), /Fragebogen zur steuerlichen Erfassung/)
  assert.match(KDP_CONFIG.startThisWeek.en.join(' '), /Steuer-ID alone is not enough/)
})

test('distribution truth deep-links to publish-wide-email playbook', () => {
  const dist = PUBLISHER_TRUTHS_CONFIG.truths.find((t) => t.id === 'distribution')
  assert.equal(dist?.hubGuideId, 'publish-wide-email')
})

test('KDP config embeds eggs-in-one-basket wide + email checklist', async () => {
  const { KDP_CONFIG } = await import('./kdpConfig.js')
  assert.ok(KDP_CONFIG.eggsInOneBasket)
  assert.equal(KDP_CONFIG.eggsInOneBasket.hubGuideId, 'publish-wide-email')
  assert.ok(KDP_CONFIG.accountRequirements.some((r) => r.id === 'eggs_basket'))
  const bookLabels = KDP_CONFIG.bookRequirements.map((r) => r.label.en)
  assert.ok(bookLabels.includes('KDP Select (ebook)'))
  assert.ok(bookLabels.includes('Expanded Distribution (print)'))
  assert.ok(bookLabels.includes('Email-list CTA pages'))
  const eggsText = [
    ...(KDP_CONFIG.eggsInOneBasket.why.en || []),
    ...(KDP_CONFIG.eggsInOneBasket.strategy1Wide.en || []),
    ...(KDP_CONFIG.eggsInOneBasket.strategy2Email.en || []),
  ].join(' ')
  const eggsTextFull = [
    eggsText,
    ...(KDP_CONFIG.eggsInOneBasket.strategy1Dach.en || []),
  ].join(' ')
  for (const need of [
    'vanishes overnight',
    'KDP Select',
    'Draft2Digital',
    'Expanded Distribution',
    'IngramSpark',
    'Tolino Media',
    'BoD',
    'epubli',
    'BookRix',
    'Impressum',
    '87%',
    'tredition',
    'Lead magnet',
    'MailerLite',
    'FREE BONUS FOR READERS',
  ]) {
    assert.match(eggsTextFull, new RegExp(need, 'i'), `kdpConfig missing: ${need}`)
  }
  assert.ok(
    KDP_CONFIG.bookRequirements.some((r) => /Impressum/i.test(r.label.en)),
    'missing Impressum book requirement',
  )
  assert.match(KDP_CONFIG.startThisWeek.en.join(' '), /KDP Select/)
  assert.match(KDP_CONFIG.startThisWeek.en.join(' '), /Impressum/)
  assert.ok((KDP_CONFIG.eggsInOneBasket.dachWideFit || []).length >= 3)
  const dachReq = KDP_CONFIG.eggsInOneBasket.dachDomesticReqs
  assert.ok(dachReq)
  const dachReqText = [
    ...dachReq.impressum.en,
    ...dachReq.buchpreisbindung.en,
    ...dachReq.accountAdmin.en,
    ...dachReq.filesDeposit.en,
    ...dachReq.checklist.flatMap((r) => [r.label.en, r.detail.en]),
  ].join(' ')
  for (const need of [
    'Pressegesetz',
    'publisher of record',
    'Impressum-Service',
    'home address',
    'Buchpreisbindung',
    '€4.99',
    'illegal',
    'passport',
    'SEPA',
    'IBAN',
    'Steuernummer',
    'Umsatzsteuer',
    'Gewerbe',
    'Freiberufler',
    'Kleinunternehmer',
    '§ 19 UStG',
    'Reverse Charge',
    'reflowable',
    '.epub',
    '.kfx',
    '.mobi',
    'Front + Spine + Back',
    'bleed',
    'Pflichtexemplare',
    'Deutsche Nationalbibliothek',
  ]) {
    assert.match(dachReqText, new RegExp(need.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), `kdp dachDomesticReqs missing: ${need}`)
  }
  assert.equal(dachReq.checklist.length, 5)
  assert.ok(KDP_CONFIG.bookRequirements.some((r) => /Buchpreisbindung/i.test(r.label.en)))
  assert.ok(KDP_CONFIG.bookRequirements.some((r) => /Pflichtexemplare/i.test(r.label.en)))
  assert.ok(KDP_CONFIG.bookRequirements.some((r) => /Front \+ Spine \+ Back/i.test(r.detail.en)))
})

test('publish-wide-email playbook covers wide + email list for beginners', () => {
  const guide = AMAZON_GUIDES.find((g) => g.id === 'publish-wide-email')
  assert.ok(guide, 'missing publish-wide-email guide')
  assert.ok(guide.sections.length >= 10)
  assert.match(guide.summary.en, /eggs in one basket|email list/i)
  const text = guide.sections
    .flatMap((s) => [
      s.heading.en,
      ...(s.bullets?.en || []),
      ...(s.rows || []).flatMap((r) => [r.label.en, r.detail.en]),
    ])
    .join(' ')
  for (const need of [
    'KDP Select',
    '90 days',
    'Draft2Digital',
    'Expanded Distribution',
    'IngramSpark',
    'Ingram Content Group',
    'OverDrive',
    'Hoopla',
    'Bibliotheca',
    'direct platform accounts',
    'dominant reader platform',
    'Tolino Media',
    'BoD',
    'epubli',
    'BookRix',
    'Deutsche Telekom',
    'Osiander',
    'Verzeichnis Lieferbarer',
    'brick-and-mortar',
    'small commission',
    'VLB',
    'Impressum',
    'Pressegesetz',
    'Buchpreisbindung',
    'SEPA',
    'Kleinunternehmer',
    'Pflichtexemplare',
    'Deutsche Nationalbibliothek',
    'Impressum-Service',
    '€4.99',
    'Reverse Charge',
    'Gewerbe',
    'Freiberufler',
    '§ 19 UStG',
    'reflowable',
    '.kfx',
    '.mobi',
    'Front + Spine + Back',
    'publisher of record',
    'illegal',
    '87%',
    'tredition',
    'Lead Magnet',
    'MailerLite',
    'ConvertKit',
    'Mailchimp',
    'FREE BONUS FOR READERS',
    'Thank You for Reading',
    'landing page',
    'welcome',
    'Platform risk',
    'Audience control',
    'Market reach',
    'day-one',
    'vanishes overnight',
  ]) {
    assert.match(
      text,
      new RegExp(need.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      `missing advice: ${need}`,
    )
  }
  for (const section of guide.sections) {
    assert.ok(section.heading.de)
  }
})

test('kdp-plan-to-win covers five pillars + execution matrix 100%', async () => {
  const guide = AMAZON_GUIDES.find((g) => g.id === 'kdp-plan-to-win')
  assert.ok(guide, 'missing kdp-plan-to-win guide')
  assert.ok(guide.sections.length >= 6)
  const text = guide.sections
    .flatMap((s) => [
      s.heading.en,
      ...(s.bullets?.en || []),
      ...(s.rows || []).flatMap((r) => [r.label.en, r.detail.en]),
      s.note?.en || '',
    ])
    .join(' ')
  for (const need of [
    'Niche Selection',
    'Product Superiority',
    'Metadata/SEO',
    'Launch Dynamics',
    'Monetization & Brand Expansion',
    'Broad Category + Specific Audience + Clear Outcome',
    'Cookbook for Air Fryers',
    'Air Fryer Cookbook for Seniors',
    '100,000',
    '1,000–2,000',
    '3-star',
    '100×100',
    'Thumbnail-first',
    'top 10 bestsellers',
    'A+ Content',
    '10%–20%',
    '7 backend keyword',
    'bilingual children german twi bedtime activity',
    'Bestseller',
    'cheap',
    'BISAC',
    '#1 Best Seller',
    'Honeymoon Period',
    'Soft Launch',
    '5–15',
    'ARC',
    'Exact Match',
    'Product Targeting',
    '20–30',
    'ACoS',
    'Customers who bought this also bought',
    'read-through',
    'Draft2Digital',
    'IngramSpark',
    'Tolino Media',
    'BoD',
    '100+ low-effort',
    '5–10 high-quality',
    'direct-to-reader mailing list',
    'keyword stuffing',
    'lead magnet',
    'Advance Reader Copy',
  ]) {
    assert.match(
      text,
      new RegExp(need.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      `plan-to-win missing: ${need}`,
    )
  }
  const planCfg = (await import('./kdpPlanToWinConfig.js')).KDP_PLAN_TO_WIN_CONFIG
  const kdpCfg = (await import('./kdpConfig.js')).KDP_CONFIG
  assert.equal(planCfg.pillars.length, 5)
  assert.equal(planCfg.executionMatrix.length, 4)
  assert.equal(planCfg.hubGuideId, 'kdp-plan-to-win')
  const cfgText = [
    planCfg.chain.en,
    ...planCfg.pillars.flatMap((p) => p.bullets.en),
    ...planCfg.executionMatrix.flatMap((r) => [r.metric.en, r.weak.en, r.winning.en]),
  ].join(' ')
  assert.match(cfgText, /Honeymoon Period/)
  assert.match(cfgText, /ACoS/)
  assert.match(cfgText, /keyword stuffing/i)
  assert.match(cfgText, /Advance Reader Copy/)
  assert.match(cfgText, /lead magnet/i)
  assert.ok(cfgText.includes('100,000'), 'plan config missing BSR 100,000')
  assert.match(kdpCfg.startThisWeek.en.join(' '), /Plan to Win/)
  assert.ok(kdpCfg.planToWin)
  assert.equal(kdpCfg.planToWin.hubGuideId, 'kdp-plan-to-win')
  const compact = [
    kdpCfg.planToWin.chain.en,
    ...kdpCfg.planToWin.pillars.en,
    ...kdpCfg.planToWin.matrix.flatMap((r) => [r.metric.en, r.winning.en]),
  ].join(' ')
  for (const need of [
    'Niche Selection',
    '100,000',
    'keyword stuffing',
    'A+ Content',
    'Honeymoon',
    'Exact Match',
    'lead magnets',
    'Draft2Digital',
    '5–10 high-quality',
  ]) {
    assert.match(
      compact,
      new RegExp(need.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      `kdpConfig.planToWin missing: ${need}`,
    )
  }
})

test('kdp-hidden-pitfalls playbook covers five operational realities 100%', () => {
  const guide = AMAZON_GUIDES.find((g) => g.id === 'kdp-hidden-pitfalls')
  assert.ok(guide, 'missing kdp-hidden-pitfalls guide')
  assert.ok(guide.sections.length >= 6)
  const text = guide.sections
    .flatMap((s) => [
      s.heading.en,
      ...(s.bullets?.en || []),
      ...(s.rows || []).flatMap((r) => [r.label.en, r.detail.en]),
      s.note?.en || '',
    ])
    .join(' ')
  for (const need of [
    'AI-Assisted',
    'AI-Generated',
    'brainstorming',
    'proofreading',
    'never shown to buyers',
    'account suspension',
    'physical cover',
    'Best Seller Gift Idea',
    'Bilingual German-Twi',
    '7 backend keyword',
    'Disney',
    'Peppa Pig',
    'Best Seller',
    'On Sale',
    'Award-Winning',
    'Paperback',
    'Independently Published',
    'Tolino Media',
    'MVB',
    'GeBü',
    'ISBN-Agentur',
    'No Bleed',
    'Bleed',
    '0.375',
    '9.5 mm',
    'coloring books',
  ]) {
    assert.match(
      text,
      new RegExp(need.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      `hidden-pitfalls missing: ${need}`,
    )
  }
})

test('amazon-alt-ecosystems covers five platforms + matrix 100%', async () => {
  const guide = AMAZON_GUIDES.find((g) => g.id === 'amazon-alt-ecosystems')
  assert.ok(guide, 'missing amazon-alt-ecosystems guide')
  assert.ok(guide.sections.length >= 10)
  const text = guide.sections
    .flatMap((s) => [
      s.heading.en,
      ...(s.bullets?.en || []),
      ...(s.rows || []).flatMap((r) => [r.label.en, r.detail.en]),
      s.note?.en || '',
    ])
    .join(' ')
  for (const need of [
    'AWS Marketplace',
    'Amazon Renewed',
    'Merch on Demand',
    'Amazon Custom',
    'Amazon Business',
    'SaaS',
    'B2C',
    'B2B',
    'AWS handles customer billing',
    'pre-approved company cloud budgets',
    'You Host the Software',
    'x-amzn-marketplace-token',
    'ResolveCustomer',
    'Fulfillment/Onboarding Landing Page',
    'Next.js',
    'Supabase',
    'Row Level Security',
    '@aws-sdk/client-marketplace-metering',
    '@aws-sdk/client-marketplace-entitlement',
    'Amazon Simple Queue Service (SQS)',
    'SNS',
    'Cursor IDE',
    '.cursor/rules',
    '/api/aws/onboard',
    'CustomerIdentifier',
    'AWS Marketplace Management Portal',
    'AMMP',
    'Create SaaS Product',
    'Flat Monthly Rate',
    'Per-User Contract',
    'Pay-As-You-Go Usage',
    '/api/aws/fulfill',
    '3%',
    '20%',
    'BatchMeterUsage',
    'Enterprise Budgets',
    'Zero Logistics / Zero Returns',
    'invite-only',
    '$50,000',
    '$100,000',
    '2.5M',
    'Buy Box Advantage',
    '70%–80% of retail value',
    'refurbishing, repair, or sourcing pipeline',
    'Tier System',
    'Zero Production Cost',
    'High Scale',
    'multi-thousand-product catalog',
    '30–40%',
    'Creator',
    'Plus',
    'Premium',
    '1 Jun 2026',
    '15% - 25% (Royalty)',
    'Defeats Chinese Manufacturers & Automated Bots',
    'No Amazon Returns',
    'gift',
    'Quantity Discounts',
    'Business-Only Pricing',
    'Tax-Exemption',
    'High Average Order Value',
    '50 to 500',
    'Repeat Automated Orders',
    '1 Oct 2025',
    '8 million',
    '$1,000',
    '80% - 95%',
    '40% - 60%',
    '35% - 50%',
    '25% - 40%',
    'Entry Barrier',
    'Competition Level',
    'Profit Margins',
    'Key Skill Required',
    'StoryForge',
    'Developer / AI tool builder',
  ]) {
    assert.match(
      text,
      new RegExp(need.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      `alt-ecosystems guide missing: ${need}`,
    )
  }

  const { AMAZON_ALT_ECOSYSTEMS_CONFIG } = await import('./amazonAltEcosystemsConfig.js')
  const cfg = AMAZON_ALT_ECOSYSTEMS_CONFIG
  assert.equal(cfg.hubGuideId, 'amazon-alt-ecosystems')
  assert.equal(cfg.ecosystems.length, 5)
  assert.equal(cfg.comparisonMatrix.length, 6)
  assert.ok((cfg.pickPath.en || []).length >= 5)
  assert.ok((cfg.relatedHubGuides || []).some((g) => g.id === 'merch-ops'))
  assert.ok((cfg.relatedHubGuides || []).some((g) => g.id === 'kdp-plan-to-win'))

  const aws = cfg.ecosystems.find((e) => e.id === 'aws_marketplace')
  assert.ok(aws?.businessModelShift && aws?.howItWorks && aws?.techStackCore && aws?.techStackAws)
  assert.ok(aws?.cursorIde && aws?.resolveCustomerOutline)

  const cfgText = [
    cfg.intro.en,
    ...cfg.ecosystems.flatMap((e) => [
      e.name.en,
      e.tagline.en,
      ...(e.businessModelShift?.en || []),
      ...(e.whatYouSell.en || []),
      ...(e.whyLowCompetition.en || []),
      ...(e.potential.en || []),
      ...(e.howItWorks?.en || []),
      ...(e.techStackCore?.en || []),
      ...(e.techStackAws?.en || []),
      ...(e.cursorIde?.en || []),
      ...(e.resolveCustomerOutline?.en || []),
      ...(e.howToEnter.en || []),
      ...(e.suitsYouIf.en || []),
      e.marginNote.en,
    ]),
    ...cfg.comparisonMatrix.flatMap((r) => [
      r.opportunity.en,
      r.barrier.en,
      r.margins.en,
      r.skill.en,
    ]),
    ...(cfg.pickPath.en || []),
    cfg.matrixFootnote.en,
  ].join(' ')

  for (const need of [
    'AWS Marketplace',
    'B2C',
    'B2B',
    'AWS handles customer billing',
    'You Host the Software',
    'x-amzn-marketplace-token',
    'ResolveCustomer',
    'Supabase',
    '@aws-sdk/client-marketplace-metering',
    'SQS',
    'SNS',
    'Cursor IDE',
    'CustomerIdentifier',
    'AMMP',
    'Create SaaS Product',
    'Flat Monthly Rate',
    'Pay-As-You-Go Usage',
    '/api/aws/fulfill',
    'Enterprise Budgets',
    'Zero Logistics / Zero Returns',
    'invite-only',
    '$50,000',
    '$100,000',
    '70%–80% of retail value',
    'Tier System',
    'Zero Production Cost',
    'High Scale',
    '15% - 25% (Royalty)',
    'Defeats Chinese Manufacturers & Automated Bots',
    'No Amazon Returns',
    'Repeat Automated Orders',
    'Quantity Discounts',
    'Tax-Exemption',
    '8 million',
    '80% - 95%',
    'StoryForge',
  ]) {
    assert.match(
      cfgText,
      new RegExp(need.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      `alt-ecosystems config missing: ${need}`,
    )
  }

  const { AMAZON_PROGRAMMES } = await import('./programmes.js')
  for (const id of ['aws_marketplace', 'renewed', 'amazon_custom', 'amazon_business', 'fba_fbm']) {
    const prog = AMAZON_PROGRAMMES.find((p) => p.id === id)
    assert.ok(prog, `missing programme ${id}`)
    assert.equal(prog.deepGuideId, 'amazon-alt-ecosystems')
  }
  assert.match(
    AMAZON_PROGRAMMES.find((p) => p.id === 'merch').howAccess.en,
    /Under-explored ecosystems/,
  )

  const { KDP_CONFIG } = await import('./kdpConfig.js')
  assert.ok(KDP_CONFIG.altEcosystems)
  assert.equal(KDP_CONFIG.altEcosystems.hubGuideId, 'amazon-alt-ecosystems')
  assert.match(KDP_CONFIG.startThisWeek.en.join(' '), /Under-explored Amazon ecosystems/)
  const compact = [
    KDP_CONFIG.altEcosystems.intro.en,
    ...KDP_CONFIG.altEcosystems.lanes.en,
    ...KDP_CONFIG.altEcosystems.matrix.flatMap((r) => [r.opportunity.en, r.margins.en, r.skill.en]),
    KDP_CONFIG.altEcosystems.pickPath.en,
  ].join(' ')
  for (const need of [
    'B2C→B2B',
    'AWS handles customer billing',
    'You Host the Software',
    'x-amzn-marketplace-token',
    'ResolveCustomer',
    'Supabase',
    '@aws-sdk/client-marketplace-metering',
    'SQS/SNS',
    'Cursor IDE',
    'AMMP',
    'Create SaaS Product',
    'Pay-As-You-Go',
    'Enterprise Budgets',
    'Zero Logistics / Zero Returns',
    'invite-only',
    '$50,000 to $100,000',
    '70%–80% of retail value',
    'Tier System',
    'Zero Production Cost',
    'High Scale',
    '15% - 25% (Royalty)',
    'Defeats Chinese Manufacturers & Automated Bots',
    'No Amazon Returns',
    'Repeat Automated Orders',
    '80% - 95%',
  ]) {
    assert.match(
      compact,
      new RegExp(need.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      `kdpConfig.altEcosystems missing: ${need}`,
    )
  }

  const planCfg = (await import('./kdpPlanToWinConfig.js')).KDP_PLAN_TO_WIN_CONFIG
  assert.ok(planCfg.relatedHubGuides.some((g) => g.id === 'amazon-alt-ecosystems'))

  const ecoTruth = PUBLISHER_TRUTHS_CONFIG.truths.find((t) => t.id === 'ecosystem')
  assert.equal(ecoTruth?.hubGuideId, 'amazon-alt-ecosystems')
  assert.match(ecoTruth.bullets.en.join(' '), /under-explored Amazon ecosystems/i)

  const merchGuide = AMAZON_GUIDES.find((g) => g.id === 'merch-ops')
  assert.match(
    merchGuide.sections.flatMap((s) => s.bullets?.en || []).join(' '),
    /Under-explored Amazon ecosystems/,
  )
})

test('KDP config embeds hidden pitfalls 100%', async () => {
  const { KDP_CONFIG } = await import('./kdpConfig.js')
  const { KDP_HARD_TOPICS_CONFIG } = await import('./kdpHardTopicsConfig.js')
  assert.ok(KDP_CONFIG.hiddenPitfalls)
  assert.equal(KDP_CONFIG.hiddenPitfalls.hubGuideId, 'kdp-hidden-pitfalls')
  const hp = KDP_CONFIG.hiddenPitfalls
  const text = [
    hp.intro.en,
    ...hp.aiDisclosure.en,
    ...hp.titleSubtitle.en,
    ...hp.forbiddenKeywords.en,
    ...hp.isbnOwnership.en,
    ...hp.bleedMargins.en,
    ...hp.checklist.flatMap((r) => [r.label.en, r.detail.en]),
  ].join(' ')
  for (const need of [
    'AI-Assisted',
    'AI-Generated',
    'never shown to buyers',
    'suspension',
    'physical cover',
    'Best Seller',
    '7 backend',
    'Disney',
    'Peppa Pig',
    'Independently Published',
    'GeBü',
    'MVB',
    '0.375',
    '9.5 mm',
    'Bleed',
  ]) {
    assert.match(
      text,
      new RegExp(need.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      `kdp hiddenPitfalls missing: ${need}`,
    )
  }
  assert.equal(hp.checklist.length, 5)
  const bookText = KDP_CONFIG.bookRequirements.map((r) => `${r.label.en} ${r.detail.en}`).join(' ')
  for (const need of [
    'AI-Generated',
    'AI-Assisted',
    'never shown to buyers',
    'account suspension',
    'termination',
    'proofreading',
    'physical cover',
    'Best Seller Gift Idea',
    'German-Twi',
    'Peppa Pig',
    'On Sale',
    'Award-Winning',
    'Paperback',
    'ISBN-Agentur',
    'Independently Published',
    'IngramSpark',
    'Tolino Media',
    '0.375',
    '9.5 mm',
    'No Bleed',
    'gutter',
    'coloring',
  ]) {
    assert.match(
      bookText,
      new RegExp(need.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      `bookRequirements missing: ${need}`,
    )
  }
  assert.match(KDP_CONFIG.startThisWeek.en.join(' '), /0\.375/)
  assert.match(KDP_CONFIG.startThisWeek.en.join(' '), /AI-generated/i)
  const ai = KDP_HARD_TOPICS_CONFIG.topics.find((t) => t.id === 'ai_disclosure')
  assert.match(ai.learn.en.join(' '), /never shown to buyers/i)
  const meta = KDP_HARD_TOPICS_CONFIG.topics.find((t) => t.id === 'metadata_keywords')
  assert.match(meta.learn.en.join(' '), /Peppa Pig/)
  assert.match(meta.learn.en.join(' '), /Independently Published/)
  assert.match(meta.learn.en.join(' '), /ISBN-Agentur/)
  const print = KDP_HARD_TOPICS_CONFIG.topics.find((t) => t.id === 'print_files_trim')
  assert.match(print.learn.en.join(' '), /0\.375/)
  assert.match(print.learn.en.join(' '), /gutter/i)
  const { GERMAN_FIRST_CONFIG } = await import('./germanFirstConfig.js')
  assert.match(
    GERMAN_FIRST_CONFIG.dachUploadPlatforms.beginnerStack.en.join(' '),
    /Hidden pitfalls/i,
  )
  const { readFileSync } = await import('node:fs')
  const { fileURLToPath } = await import('node:url')
  const { dirname, join } = await import('node:path')
  const resourcesPath = join(dirname(fileURLToPath(import.meta.url)), 'kdpResourcesConfig.js')
  assert.match(readFileSync(resourcesPath, 'utf8'), /Hidden pitfalls/)
})
