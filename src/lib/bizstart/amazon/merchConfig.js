/**
 * Merch on Demand — configurable facts for Amazon Hub playbooks.
 * Marketplace numbers change; UI must surface lastVerified + verifiedNote (⚠).
 * Not affiliated with Amazon. No scraping.
 */

export const MERCH_CONFIG = {
  lastVerified: '2026-04-11',
  sourceLabel: 'Owner playbook distilled for DE KDP creators — verify in Merch account',
  independenceDisclaimer: {
    en: 'Not affiliated with or endorsed by Amazon. Estimates are not guarantees.',
    de: 'Nicht mit Amazon verbunden oder von Amazon empfohlen. Schätzungen sind keine Garantien.',
  },
  applyUrl: 'https://merch.amazon.com/',
  applyNote: {
    en: 'Invitation / approval system. Apply immediately — waiting can take days to ~8 weeks (verify current experience).',
    de: 'Einladungs-/Freigabesystem. Sofort bewerben — Wartezeit oft Tage bis ca. 8 Wochen (aktuell prüfen).',
  },
  fileSpecs: {
    format: 'PNG',
    transparentBackground: true,
    minDpi: 300,
    widthPx: 4500,
    heightPx: 5400,
    colorSpace: 'sRGB / RGB (not CMYK)',
    maxFileBytes: 25 * 1024 * 1024,
    maxFileLabel: '25 MB',
    note: {
      en: '⚠ Pixel size and MB limits follow Merch templates — confirm before upload.',
      de: '⚠ Pixelgröße und MB-Limits folgen Merch-Templates — vor Upload bestätigen.',
    },
  },
  /** Illustrative tier ladder — unlock rules change */
  tiers: {
    verifiedNote: {
      en: '⚠ Exact design caps and unlock sales change — confirm in your Merch dashboard.',
      de: '⚠ Exakte Design-Caps und Freischalt-Verkäufe ändern sich — im Merch-Dashboard prüfen.',
    },
    rows: [
      { tier: 'Tier 10', designs: '10', unlock: { en: 'Sell ~10 units total', de: 'Ca. 10 Verkäufe gesamt' } },
      { tier: 'Tier 25', designs: '25', unlock: { en: 'Sell ~25 units total', de: 'Ca. 25 Verkäufe gesamt' } },
      { tier: 'Tier 100', designs: '100', unlock: { en: 'Sell ~100 units total', de: 'Ca. 100 Verkäufe gesamt' } },
      { tier: 'Tier 500', designs: '500', unlock: { en: 'Sell ~500 units total', de: 'Ca. 500 Verkäufe gesamt' } },
      {
        tier: 'Tier 1000+',
        designs: '1,000+',
        unlock: { en: 'Continued sales volume', de: 'Weiteres Verkaufsvolumen' },
      },
    ],
  },
  /** Royalty bands — illustrative only */
  products: {
    verifiedNote: {
      en: '⚠ Royalty ranges are illustrative owner notes — use Merch’s live base-cost calculator per size/marketplace.',
      de: '⚠ Royalty-Spannen sind illustrative Owner-Notizen — Live-Basiskosten-Rechner in Merch je Größe/Marktplatz nutzen.',
    },
    rows: [
      {
        product: { en: 'Standard T-shirt', de: 'Standard-T-Shirt' },
        royalty: { en: '≈ €3–€8 / sale', de: '≈ 3–8 € / Verkauf' },
        bestFor: { en: 'Kids character tees', de: 'Kinder-Figuren-Tees' },
        priority: 1,
      },
      {
        product: { en: 'Premium T-shirt', de: 'Premium-T-Shirt' },
        royalty: { en: '≈ €4–€10 / sale', de: '≈ 4–10 € / Verkauf' },
        bestFor: { en: 'Parents / adult fans', de: 'Eltern / erwachsene Fans' },
        priority: 4,
      },
      {
        product: { en: 'Pullover hoodie', de: 'Pullover-Hoodie' },
        royalty: { en: '≈ €8–€18 / sale', de: '≈ 8–18 € / Verkauf' },
        bestFor: { en: 'Autumn / winter peak', de: 'Herbst-/Winter-Peak' },
        priority: 3,
      },
      {
        product: { en: 'Zip hoodie', de: 'Zip-Hoodie' },
        royalty: { en: '≈ €8–€18 / sale', de: '≈ 8–18 € / Verkauf' },
        bestFor: { en: 'Premium option', de: 'Premium-Option' },
        priority: 5,
      },
      {
        product: { en: 'Tote bag', de: 'Tragetasche' },
        royalty: { en: '≈ €3–€7 / sale', de: '≈ 3–7 € / Verkauf' },
        bestFor: { en: 'Parents, school / gift', de: 'Eltern, Schule / Geschenk' },
        priority: 2,
      },
      {
        product: { en: 'Phone case', de: 'Handyhülle' },
        royalty: { en: '≈ €2–€5 / sale', de: '≈ 2–5 € / Verkauf' },
        bestFor: { en: 'Older kids / teens', de: 'Ältere Kinder / Teens' },
        priority: 6,
      },
      {
        product: { en: 'Throw pillow', de: 'Kissen' },
        royalty: { en: '≈ €4–€9 / sale', de: '≈ 4–9 € / Verkauf' },
        bestFor: { en: 'Nursery / home décor', de: 'Kinderzimmer / Deko' },
        priority: 7,
      },
      {
        product: { en: 'PopSocket', de: 'PopSocket' },
        royalty: { en: '≈ €2–€4 / sale', de: '≈ 2–4 € / Verkauf' },
        bestFor: { en: 'Accessories', de: 'Accessoires' },
        priority: 8,
      },
    ],
    kidsBrandPriority: {
      en: ['Children’s T-shirts (core)', 'Tote bags (parents / school)', 'Hoodies (seasonal, higher royalty)'],
      de: ['Kinder-T-Shirts (Kern)', 'Tragetaschen (Eltern / Schule)', 'Hoodies (saisonal, höhere Royalty)'],
    },
  },
  pricingExample: {
    verifiedNote: {
      en: '⚠ Example maths only — base cost and royalty are what Merch shows for your SKU.',
      de: '⚠ Nur Beispielrechnung — Basiskosten und Royalty zeigt Merch für Ihr SKU.',
    },
    marketplace: 'Amazon.de',
    product: { en: 'Children’s T-shirt (illustrative)', de: 'Kinder-T-Shirt (illustrativ)' },
    rows: [
      { label: { en: 'Amazon base cost', de: 'Amazon-Basiskosten' }, value: { en: '~€9.00', de: '~9,00 €' } },
      { label: { en: 'Your list price', de: 'Ihr Listenpreis' }, value: { en: '€17.99', de: '17,99 €' } },
      { label: { en: 'Royalty per sale', de: 'Royalty je Verkauf' }, value: { en: '~€8.99', de: '~8,99 €' } },
      {
        label: { en: '50 sales/month (estimate)', de: '50 Verkäufe/Monat (Schätzung)' },
        value: { en: '~€450/month', de: '~450 €/Monat' },
      },
      {
        label: { en: '100 sales/month (estimate)', de: '100 Verkäufe/Monat (Schätzung)' },
        value: { en: '~€900/month', de: '~900 €/Monat' },
      },
    ],
    marketPriceBand: {
      en: 'Similar kids character tees often list around €15.99–€22.99 on Amazon.de — price to market, not only max royalty.',
      de: 'Ähnliche Kindermotive oft ca. 15,99–22,99 € auf Amazon.de — marktgerecht preisen, nicht nur Max-Royalty.',
    },
  },
  designTools: {
    verifiedNote: {
      en: '⚠ Tool prices change — check vendor sites. StoryForge (desktop) can produce consistent character art for Merch PNGs.',
      de: '⚠ Tool-Preise ändern sich — Anbieterseiten prüfen. StoryForge (Desktop) liefert konsistente Figuren für Merch-PNGs.',
    },
    rows: [
      {
        tool: 'StoryForge',
        cost: { en: 'App credits (suite)', de: 'App-Credits (Suite)' },
        bestFor: {
          en: 'Pinned character → transparent Merch-ready export path',
          de: 'Anker-Figur → transparenter Merch-Export-Pfad',
        },
      },
      {
        tool: 'Adobe Illustrator',
        cost: { en: '~€24/mo (verify)', de: '~24 €/Mon. (prüfen)' },
        bestFor: { en: 'Professional vectors', de: 'Professionelle Vektoren' },
      },
      {
        tool: 'Canva Pro',
        cost: { en: '~€13/mo (verify)', de: '~13 €/Mon. (prüfen)' },
        bestFor: { en: 'Template-based layouts', de: 'Template-Layouts' },
      },
      {
        tool: 'Photoshop',
        cost: { en: '~€24/mo (verify)', de: '~24 €/Mon. (prüfen)' },
        bestFor: { en: 'Photo-based designs', de: 'Foto-basierte Designs' },
      },
      {
        tool: 'GIMP',
        cost: { en: 'Free', de: 'Kostenlos' },
        bestFor: { en: 'Basic editing', de: 'Basis-Bearbeitung' },
      },
      {
        tool: 'Affinity Designer',
        cost: { en: 'One-time ~€70 (verify)', de: 'Einmalig ~70 € (prüfen)' },
        bestFor: { en: 'Illustrator alternative', de: 'Illustrator-Alternative' },
      },
    ],
  },
  listingExample: {
    title: {
      en: 'Kevin der Koala Kinder T-Shirt — Lustiges Tier-Shirt für Jungen und Mädchen',
      de: 'Kevin der Koala Kinder T-Shirt — Lustiges Tier-Shirt für Jungen und Mädchen',
    },
    bullets: {
      en: [
        'Weiches, hautfreundliches Baumwollmaterial — ideal für aktive Kinder',
        'Perfektes Geschenk für Geburtstage und Weihnachten',
      ],
      de: [
        'Weiches, hautfreundliches Baumwollmaterial — ideal für aktive Kinder',
        'Perfektes Geschenk für Geburtstage und Weihnachten',
      ],
    },
    tips: {
      en: [
        'Title: character name + product type + age cue',
        'Fill both bullet points (design + fit/use)',
        'Short keyword-rich description',
        'Fill all hidden keyword / backend search fields',
      ],
      de: [
        'Titel: Figurenname + Produkttyp + Alters-Hinweis',
        'Beide Bullets füllen (Design + Passform/Nutzen)',
        'Kurze, keyword-reiche Beschreibung',
        'Alle versteckten Keyword-/Backend-Felder füllen',
      ],
    },
  },
  businessPlanTemplate: {
    brandPlaceholder: {
      en: '[Your publishing brand]',
      de: '[Ihre Verlags-/Publishing-Marke]',
    },
    fields: {
      en: [
        'Brand / imprint name',
        'Hero character(s) from KDP book 1',
        'First 10 Merch designs (research-backed)',
        'Target Amazon.de price band per product',
        'Tax interview complete (W-8BEN) + DE IBAN',
        'Author Central link + book back-matter CTA',
      ],
      de: [
        'Marken-/Imprint-Name',
        'Heldenfigur(en) aus KDP-Buch 1',
        'Erste 10 Merch-Designs (recherchiert)',
        'Ziel-Preisband Amazon.de je Produkt',
        'Steuerinterview (W-8BEN) + DE-IBAN',
        'Author-Central-Link + Buch-Nachsatz-CTA',
      ],
    },
  },
}

export function merchFileSpecSummary(lang = 'en') {
  const s = MERCH_CONFIG.fileSpecs
  if (lang === 'de') {
    return `${s.format}, transparent, mind. ${s.minDpi} DPI, ${s.widthPx}×${s.heightPx} px, ${s.colorSpace}, max. ${s.maxFileLabel}`
  }
  return `${s.format}, transparent, min ${s.minDpi} DPI, ${s.widthPx}×${s.heightPx} px, ${s.colorSpace}, max ${s.maxFileLabel}`
}
