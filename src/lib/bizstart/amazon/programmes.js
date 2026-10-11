/**
 * Amazon Business Hub — programmes for DE founders (guide only, not Amazon API).
 * Rates and access rules change; always verify on official portals.
 */

export const PRIORITY = {
  start_now: 'start_now',
  alongside: 'alongside',
  after_book: 'after_book',
  after_presence: 'after_presence',
  later: 'later',
  monitor: 'monitor',
}

/** @typedef {'start_now'|'alongside'|'after_book'|'after_presence'|'later'|'monitor'} PriorityId */

/**
 * @type {Array<{
 *   id: string
 *   priority: PriorityId
 *   startupCost: { en: string, de: string }
 *   effort: { en: string, de: string }
 *   relevance: { en: string, de: string }
 *   name: { en: string, de: string }
 *   what: { en: string, de: string }
 *   why: { en: string[], de: string[] }
 *   howAccess: { en: string, de: string }
 *   links: { label: string, url: string }[]
 *   actionableDe: boolean
 * }>}
 */
export const AMAZON_PROGRAMMES = [
  {
    id: 'kdp',
    priority: PRIORITY.start_now,
    startupCost: { en: '€0–€2,000', de: '0–2.000 €' },
    effort: { en: 'Medium upfront', de: 'Mittel (Start)' },
    relevance: { en: 'Direct — primary income', de: 'Direkt — Haupteinkommen' },
    name: { en: 'Amazon KDP (Kindle Direct Publishing)', de: 'Amazon KDP (Kindle Direct Publishing)' },
    what: {
      en: 'Self-publish eBooks and paperbacks on Amazon. You keep control of rights and set list prices; Amazon prints/distributes paperbacks on demand.',
      de: 'E-Books und Taschenbücher selbst auf Amazon veröffentlichen. Rechte bleiben bei Ihnen; Paperbacks werden on demand gedruckt und versendet.',
    },
    why: {
      en: [
        'Primary path for authors and children’s book publishers in Germany',
        'No inventory for print-on-demand paperbacks',
        'German and English catalogues (amazon.de / amazon.com)',
        'Builds the brand you can extend to Merch, audio, and affiliates',
      ],
      de: [
        'Hauptweg für Autor:innen und Kinderbuch-Verlage in Deutschland',
        'Kein Lager für Print-on-Demand-Paperbacks',
        'Deutsche und englische Kataloge (amazon.de / amazon.com)',
        'Basis-Marke für Merch, Audio und Affiliate',
      ],
    },
    howAccess: {
      en: 'kdp.amazon.com — create a KDP account, complete tax interview, upload manuscript + cover, set territories and pricing. See Playbooks → KDP requirements for the full DE checklist.',
      de: 'kdp.amazon.com — KDP-Konto anlegen, Steuerinterview, Manuskript + Cover, Territorien und Preise. Playbooks → KDP-Anforderungen für die komplette DE-Checkliste.',
    },
    links: [
      { label: 'KDP', url: 'https://kdp.amazon.com/' },
      { label: 'Amazon.de', url: 'https://www.amazon.de/' },
    ],
    actionableDe: true,
    deepGuideId: 'kdp-start',
  },
  {
    id: 'merch',
    priority: PRIORITY.alongside,
    startupCost: { en: '€0', de: '0 €' },
    effort: { en: 'Low', de: 'Niedrig' },
    relevance: { en: 'High — reuse illustrations', de: 'Hoch — Illustrationen wiederverwenden' },
    name: { en: 'Amazon Merch on Demand', de: 'Amazon Merch on Demand' },
    what: {
      en: 'Upload artwork; Amazon prints on T-shirts, hoodies, totes, phone cases, and more — and ships on demand. Zero inventory.',
      de: 'Designs hochladen; Amazon bedruckt T-Shirts, Hoodies, Taschen, Hüllen u. a. und versendet on demand. Kein Lager.',
    },
    why: {
      en: [
        'Children’s book illustrations can become Merch designs',
        'Characters (koala, dinosaur, lion…) become kids’ apparel sold next to the book',
        'Brand ecosystem around your characters',
        'Royalties typically ~13–37% per sale (product & price dependent — verify in Merch)',
      ],
      de: [
        'Kinderbuch-Illustrationen lassen sich als Merch-Designs nutzen',
        'Figuren werden zu Kindermotiven neben dem Buch',
        'Marken-Ökosystem um Ihre Charaktere',
        'Royalties typisch ca. 13–37 % pro Verkauf (Produkt/Preis — im Merch-Portal prüfen)',
      ],
    },
    howAccess: {
      en: 'merch.amazon.com — application + approval (waitlist). Apply early; approval can take weeks. See Playbooks → Merch full guide for tiers, 4500×5400 PNG specs, and pricing examples (⚠ verify).',
      de: 'merch.amazon.com — Bewerbung + Freigabe (Warteliste). Früh bewerben; Freigabe kann Wochen dauern. Playbooks → Merch-Vollguide: Tiers, 4500×5400-PNG-Specs und Preisbeispiele (⚠ prüfen).',
    },
    links: [{ label: 'Merch on Demand', url: 'https://merch.amazon.com/' }],
    actionableDe: true,
    deepGuideId: 'merch-ops',
  },
  {
    id: 'associates',
    priority: PRIORITY.after_presence,
    startupCost: { en: '€0', de: '0 €' },
    effort: { en: 'Low–Medium', de: 'Niedrig–Mittel' },
    relevance: { en: 'High — content marketing', de: 'Hoch — Content-Marketing' },
    name: { en: 'Amazon Associates (Affiliate)', de: 'Amazon PartnerNet (Affiliate)' },
    what: {
      en: 'Earn a commission by referring shoppers to Amazon via unique links on a blog, social, YouTube, or site.',
      de: 'Provision verdienen, wenn Kund:innen über Ihre Links auf Amazon kaufen — Blog, Social, YouTube oder Website.',
    },
    why: {
      en: [
        'Parenting / literacy niche around your books: toys, books, educational materials',
        'Commission often ~1–10% by category (books commonly ~4–5% — check PartnerNet)',
        'Zero inventory; passive once content exists',
      ],
      de: [
        'Eltern-/Lese-Nische um Ihre Bücher: Spielzeug, Bücher, Lernmaterial',
        'Provision oft ca. 1–10 % je Kategorie (Bücher oft ca. 4–5 % — PartnerNet prüfen)',
        'Kein Lager; nach Content weitgehend passiv',
      ],
    },
    howAccess: {
      en: 'German programme: programm.partnernet.amazon.de',
      de: 'Deutsches Programm: programm.partnernet.amazon.de',
    },
    links: [
      {
        label: 'PartnerNet DE',
        url: 'https://programm.partnernet.amazon.de/',
      },
    ],
    actionableDe: true,
  },
  {
    id: 'acx',
    priority: PRIORITY.after_book,
    startupCost: { en: '€0 (royalty share)', de: '0 € (Royalty-Share)' },
    effort: { en: 'Medium', de: 'Mittel' },
    relevance: { en: 'High — audio versions', de: 'Hoch — Hörbuch-Versionen' },
    name: { en: 'Audible / ACX (Audiobooks)', de: 'Audible / ACX (Hörbücher)' },
    what: {
      en: 'Produce an audiobook and distribute via Audible, Amazon, and iTunes through ACX (Audiobook Creation Exchange).',
      de: 'Hörbuch produzieren und über ACX auf Audible, Amazon und iTunes vertreiben.',
    },
    why: {
      en: [
        'Picture books work well with character voices and sound effects',
        'German children’s audio is growing on Audible.de',
        'Hire a narrator on ACX with royalty-share (often no upfront fee)',
        'Royalty often ~25–40% on Audible (verify current ACX terms)',
      ],
      de: [
        'Bilderbücher eignen sich gut mit Stimmen und Geräuschen',
        'Deutschsprachige Kinderhörbücher wachsen auf Audible.de',
        'Sprecher:in über ACX mit Royalty-Share (oft ohne Vorabkosten)',
        'Royalty oft ca. 25–40 % auf Audible (aktuelle ACX-Bedingungen prüfen)',
      ],
    },
    howAccess: {
      en: 'acx.com — project + narrator (or upload finished audio).',
      de: 'acx.com — Projekt + Sprecher:in (oder fertiges Audio hochladen).',
    },
    links: [
      { label: 'ACX', url: 'https://www.acx.com/' },
      { label: 'Audible.de', url: 'https://www.audible.de/' },
    ],
    actionableDe: true,
  },
  {
    id: 'handmade',
    priority: PRIORITY.later,
    startupCost: { en: 'Low', de: 'Niedrig' },
    effort: { en: 'Medium', de: 'Mittel' },
    relevance: { en: 'Medium — brand merch', de: 'Mittel — Marken-Merch' },
    name: { en: 'Amazon Handmade', de: 'Amazon Handmade' },
    what: {
      en: 'Marketplace for handcrafted artisan products — Etsy-like, inside Amazon.',
      de: 'Marktplatz für handgefertigte Produkte — ähnlich Etsy, im Amazon-Ökosystem.',
    },
    why: {
      en: [
        'Soft toys, prints, or artwork based on book characters',
        'Often lower competition than the open marketplace',
        'Application required; referral fee commonly ~15% (verify current fees)',
      ],
      de: [
        'Kuscheltiere, Prints oder Kunst zu Buchfiguren',
        'Oft weniger Wettbewerb als der offene Marktplatz',
        'Bewerbung nötig; Vermittlungsgebühr oft ca. 15 % (aktuelle Gebühren prüfen)',
      ],
    },
    howAccess: {
      en: 'Apply via Amazon Handmade seller programme (availability may vary by marketplace).',
      de: 'Bewerbung über das Amazon-Handmade-Verkäuferprogramm (Verfügbarkeit je Marktplatz).',
    },
    links: [
      {
        label: 'Amazon Handmade',
        url: 'https://sell.amazon.com/programs/handmade',
      },
    ],
    actionableDe: true,
  },
  {
    id: 'influencer',
    priority: PRIORITY.after_presence,
    startupCost: { en: '€0', de: '0 €' },
    effort: { en: 'Medium ongoing', de: 'Mittel (laufend)' },
    relevance: { en: 'Medium — storefront', de: 'Mittel — Storefront' },
    name: { en: 'Amazon Influencer Programme', de: 'Amazon Influencer-Programm' },
    what: {
      en: 'Associates extension for creators: your own Amazon storefront to curate and recommend products.',
      de: 'Erweiterung von PartnerNet für Creator: eigene Amazon-Storefront mit kuratierten Empfehlungen.',
    },
    why: {
      en: [
        'Parenting / children’s literacy niche storefront in Germany',
        'Recommend books, educational toys, reading accessories',
        'Needs an eligible social presence (Instagram, YouTube, TikTok, Facebook…)',
      ],
      de: [
        'Storefront in der Eltern-/Kinderlese-Nische in Deutschland',
        'Bücher, Lernspielzeug, Lese-Zubehör empfehlen',
        'Geeignete Social-Präsenz nötig (Instagram, YouTube, TikTok, Facebook…)',
      ],
    },
    howAccess: {
      en: 'Apply through PartnerNet / Influencer onboarding — programm.partnernet.amazon.de',
      de: 'Bewerbung über PartnerNet / Influencer-Onboarding — programm.partnernet.amazon.de',
    },
    links: [
      {
        label: 'PartnerNet DE',
        url: 'https://programm.partnernet.amazon.de/',
      },
    ],
    actionableDe: true,
  },
  {
    id: 'fba_fbm',
    priority: PRIORITY.later,
    startupCost: { en: 'Medium–High', de: 'Mittel–Hoch' },
    effort: { en: 'High', de: 'Hoch' },
    relevance: { en: 'Products / retail', de: 'Produkte / Handel' },
    name: { en: 'Amazon Selling (FBA / FBM)', de: 'Amazon Verkauf (FBA / FBM)' },
    what: {
      en: 'Sell physical products as a Seller Central merchant. FBA: Amazon stores and ships. FBM: you fulfil orders yourself.',
      de: 'Physische Produkte über Seller Central verkaufen. FBA: Amazon lagert und versendet. FBM: Sie erfüllen selbst.',
    },
    why: {
      en: [
        'Classic product business on Amazon.de',
        'Higher capital, compliance (GPSR, VAT, packaging), and ops than KDP/Merch',
        'Use when you have a product line beyond books and print-on-demand',
      ],
      de: [
        'Klassisches Produktgeschäft auf Amazon.de',
        'Mehr Kapital, Compliance (GPSR, USt, Verpackung) und Ops als KDP/Merch',
        'Sinnvoll bei Produktlinien jenseits Buch und Print-on-Demand',
      ],
    },
    howAccess: {
      en: 'sellercentral.amazon.de — seller account; choose FBA or FBM per SKU.',
      de: 'sellercentral.amazon.de — Verkäuferkonto; FBA oder FBM je SKU wählen.',
    },
    links: [
      {
        label: 'Seller Central DE',
        url: 'https://sellercentral.amazon.de/',
      },
      {
        label: 'Sell on Amazon',
        url: 'https://sell.amazon.de/',
      },
    ],
    actionableDe: true,
  },
  {
    id: 'vella',
    priority: PRIORITY.monitor,
    startupCost: { en: '€0', de: '0 €' },
    effort: { en: '—', de: '—' },
    relevance: { en: 'US-focused for now', de: 'Derzeit vor allem US' },
    name: { en: 'Kindle Vella / Serials', de: 'Kindle Vella / Serials' },
    what: {
      en: 'Serialised storytelling where readers pay per episode or subscribe.',
      de: 'Serielles Erzählen — Leser:innen zahlen pro Episode oder per Abo.',
    },
    why: {
      en: [
        'Currently limited / not a primary Germany play',
        'Worth monitoring for future DE expansion — not actionable yet for most DE founders',
      ],
      de: [
        'Derzeit eingeschränkt / kein primärer DE-Hebel',
        'Beobachten für künftige DE-Expansion — für die meisten Gründer:innen in DE noch nicht actionable',
      ],
    },
    howAccess: {
      en: 'Monitor KDP / Kindle announcements for market availability.',
      de: 'KDP-/Kindle-Ankündigungen zur Marktverfügbarkeit beobachten.',
    },
    links: [{ label: 'KDP', url: 'https://kdp.amazon.com/' }],
    actionableDe: false,
  },
  {
    id: 'video_direct',
    priority: PRIORITY.later,
    startupCost: { en: 'Medium–High', de: 'Mittel–Hoch' },
    effort: { en: 'High', de: 'Hoch' },
    relevance: { en: 'Long-term brand', de: 'Langfristige Marke' },
    name: { en: 'Prime Video Direct', de: 'Prime Video Direct' },
    what: {
      en: 'Upload series, films, or shorts for distribution on Prime Video.',
      de: 'Serien, Filme oder Shorts für die Distribution auf Prime Video hochladen.',
    },
    why: {
      en: [
        'A successful children’s series could become animated shorts later',
        'Longer-term once the book brand is established',
      ],
      de: [
        'Erfolgreiche Kinderbuch-Serien können später als Animation laufen',
        'Langfristig, wenn die Buchmarke steht',
      ],
    },
    howAccess: {
      en: 'videodirect.amazon.com — apply / upload per Amazon’s current programme rules.',
      de: 'videodirect.amazon.com — Bewerbung / Upload nach aktuellen Programmregeln.',
    },
    links: [
      {
        label: 'Video Direct',
        url: 'https://videodirect.amazon.com/',
      },
    ],
    actionableDe: true,
  },
]

export const PRIORITY_ORDER = [
  PRIORITY.start_now,
  PRIORITY.alongside,
  PRIORITY.after_book,
  PRIORITY.after_presence,
  PRIORITY.later,
  PRIORITY.monitor,
]

export function programmesByPriority() {
  return [...AMAZON_PROGRAMMES].sort(
    (a, b) => PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority)
  )
}

export function getProgramme(id) {
  return AMAZON_PROGRAMMES.find((p) => p.id === id) || null
}
