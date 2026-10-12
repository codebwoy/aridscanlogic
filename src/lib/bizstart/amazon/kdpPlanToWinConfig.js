/**
 * KDP “Plan to Win” — five-pillar execution chain for all formats.
 * Fiction, non-fiction, low/medium content. Guidance only — not Amazon Help.
 */

export const KDP_PLAN_TO_WIN_CONFIG = {
  lastVerified: '2026-10-12',
  sourceLabel:
    'Owner playbook: Niche → Product → Metadata/SEO → Launch → Brand expansion — verify BSR, ads, and A+ eligibility live',
  hubGuideId: 'kdp-plan-to-win',
  independenceDisclaimer: {
    en: 'Not affiliated with Amazon. BSR thresholds, ACoS targets, A+ lift %, and review tactics change — confirm in KDP Help / Ads Console. Never buy fake reviews.',
    de: 'Nicht mit Amazon verbunden. BSR-Schwellen, ACoS-Ziele, A+-Lift-% und Review-Taktiken ändern sich — in KDP Help / Ads Console prüfen. Keine Fake-Reviews kaufen.',
  },
  chain: {
    en: 'Niche Selection → Product Superiority → Metadata/SEO → Launch Dynamics → Monetization & Brand Expansion',
    de: 'Nischenwahl → Produktüberlegenheit → Metadaten/SEO → Launch-Dynamik → Monetarisierung & Markenausbau',
  },
  intro: {
    en: 'Winning on Amazon KDP needs a repeatable end-to-end framework. Every link must be optimized — if one fails (great keywords but a weak cover), the book underperforms. Works across Fiction, Non-Fiction, and Low/Medium Content.',
    de: 'Gewinnen auf Amazon KDP braucht ein wiederholbares End-to-End-Framework. Jedes Glied muss stimmen — scheitert eines (starke Keywords, schwaches Cover), underperformt das Buch. Gilt für Fiction, Non-Fiction und Low/Medium Content.',
  },
  pillars: [
    {
      id: 'niche',
      number: 1,
      title: {
        en: 'Strategic niche validation (micro-targeting)',
        de: 'Strategische Nischen-Validierung (Micro-Targeting)',
      },
      bullets: {
        en: [
          'Most publishers fail before writing a word by publishing in overly broad, saturated categories',
          'Niche equation: Broad Category + Specific Audience + Clear Outcome',
          'Bad: “Cookbook for Air Fryers”',
          'Winning: “Air Fryer Cookbook for Seniors (Large Print, Low-Sodium, 5-Ingredients or Less)”',
          'Validation: top 3–5 organic books for the keyword have Best Sellers Rank (BSR) under 100,000 (demand signal)',
          'Fewer than 1,000–2,000 total competing results for that long-tail search phrase',
          'Spot weakness in top sellers: outdated covers, poor interiors, recurring complaints in 3-star reviews',
        ],
        de: [
          'Die meisten Publisher scheitern vor dem ersten Wort — zu breite, gesättigte Kategorien',
          'Nischen-Gleichung: Breite Kategorie + spezifische Zielgruppe + klares Ergebnis',
          'Schlecht: „Kochbuch für Heißluftfritteusen“',
          'Gewinner: „Heißluftfritteusen-Kochbuch für Senioren (Großdruck, natriumarm, max. 5 Zutaten)“',
          'Validierung: Top 3–5 organische Bücher zum Keyword haben Best Sellers Rank (BSR) unter 100.000 (Nachfrage)',
          'Unter 1.000–2.000 Gesamttreffern für diese Longtail-Suchphrase',
          'Schwächen der Topseller: veraltete Cover, schwache Innenteile, wiederkehrende Kritik in 3-Sterne-Reviews',
        ],
      },
    },
    {
      id: 'product',
      number: 2,
      title: {
        en: 'Product superiority (the conversion engine)',
        de: 'Produktüberlegenheit (Conversion-Motor)',
      },
      bullets: {
        en: [
          'Once a reader finds your listing, cover, title, and A+ Content decide click and buy',
          'Thumbnail-first design: cover must stand out at ~100×100 pixels on mobile — high-contrast typography + clear focal points',
          'Genre match: study the top 10 bestsellers in your sub-niche; match visual tropes (color, fonts) while staying premium',
          'Title: punchy, memorable, strictly matching your physical cover',
          'Subtitle: clear value proposition for exact audience + outcome — avoid keyword stuffing list words that trigger account flags',
          'Amazon A+ Content (KDP Dashboard): interior previews, comparison tables, brand storytelling — often cited to lift conversion ~10%–20% (verify eligibility)',
        ],
        de: [
          'Wenn Leser:innen Ihr Listing finden, entscheiden Cover, Titel und A+ Content über Klick und Kauf',
          'Thumbnail-first: Cover muss bei ca. 100×100 Pixeln auf Mobile auffallen — hoher Kontrast + klarer Fokus',
          'Genre-Match: Top-10-Bestseller in Ihrer Sub-Nische; visuelle Tropes (Farbe, Fonts) treffen, aber premium bleiben',
          'Titel: knackig, einprägsam, exakt wie auf dem physischen Cover',
          'Untertitel: klare Value Proposition für Zielgruppe + Ergebnis — kein Keyword Stuffing, das Account-Flags auslöst',
          'Amazon A+ Content (KDP-Dashboard): Innenteil-Previews, Vergleichstabellen, Brand-Story — oft mit ca. 10–20 % Conversion-Lift genannt (Berechtigung prüfen)',
        ],
      },
    },
    {
      id: 'metadata',
      number: 3,
      title: {
        en: 'Metadata & Amazon algorithm SEO',
        de: 'Metadaten & Amazon-Algorithmus-SEO',
      },
      bullets: {
        en: [
          'KDP is an e-commerce search engine — win by aligning metadata with search intent',
          'Fill all 7 backend keyword slots with non-repetitive long-tail phrases (e.g. “bilingual children german twi bedtime activity” — not single words like “book”)',
          'Never include brand names, price promises (“cheap”), or claims like “Bestseller”',
          'Category dominance: use specific, narrow BISAC / browse categories — not broad top-level nodes',
          'Being #1 in a small sub-category earns the “#1 Best Seller” badge and boosts organic click-through',
        ],
        de: [
          'KDP ist eine E-Commerce-Suchmaschine — gewinnen Sie, indem Metadaten zur Suchabsicht passen',
          'Alle 7 Backend-Keyword-Slots mit nicht-wiederholenden Longtails füllen (z. B. „bilingual children german twi bedtime activity“ — nicht Einzelwörter wie „book“)',
          'Nie Markennamen, Preisversprechen („cheap“) oder Claims wie „Bestseller“',
          'Kategorie-Dominanz: spezifische, enge BISAC-/Browse-Kategorien — keine breiten Top-Level-Nodes',
          'Platz #1 in einer kleinen Subkategorie bringt das „#1 Best Seller“-Badge und steigert organische CTR',
        ],
      },
    },
    {
      id: 'launch',
      number: 4,
      title: {
        en: 'Launch dynamics & ad engine',
        de: 'Launch-Dynamik & Ad-Engine',
      },
      bullets: {
        en: [
          'Amazon grants new titles a temporary “Honeymoon Period” visibility boost — maximize sales velocity in that window',
          'Phase 1 Soft Launch: target 5–10 (aim up to 5–15) verified reviews via Advance Reader Copy (ARC) team, email subscribers, or book review platforms',
          'Phase 2 Ad Acceleration: skip broad campaigns at first — Exact Match sponsored ads on proven search terms + Product Targeting Ads on 20–30 direct competitor listings (comp titles)',
          'Aim for ACoS (Advertising Cost of Sales) under your break-even royalty margin',
          'Phase 3 Flywheel: organic velocity + ad conversions push you into “Customers who bought this also bought…” recommendations',
        ],
        de: [
          'Amazon gibt neuen Titeln eine temporäre „Honeymoon Period“-Sichtbarkeit — Sales-Velocity in diesem Fenster maximieren',
          'Phase 1 Soft Launch: 5–10 (Ziel bis 5–15) verifizierte Reviews über Advance Reader Copy (ARC)-Team, E-Mail-Abonnent:innen oder Review-Plattformen',
          'Phase 2 Ad Acceleration: zuerst keine Broad-Kampagnen — Exact-Match Sponsored Ads auf bewährte Suchbegriffe + Product-Targeting-Ads auf 20–30 direkte Konkurrenz-Listings (Comp-Titel)',
          'ACoS (Advertising Cost of Sales) unter Ihrer Break-even-Royalty-Marge anstreben',
          'Phase 3 Flywheel: organische Velocity + Ad-Conversions → „Kunden, die dies kauften, kauften auch…“',
        ],
      },
      phases: [
        {
          label: { en: 'Phase 1: Soft Launch', de: 'Phase 1: Soft Launch' },
          detail: {
            en: 'Target 5–10 reviews (up to 5–15)',
            de: 'Ziel 5–10 Reviews (bis 5–15)',
          },
        },
        {
          label: { en: 'Phase 2: Ad Acceleration', de: 'Phase 2: Ad Acceleration' },
          detail: {
            en: 'Targeted Amazon PPC (Exact Match + Product Targeting)',
            de: 'Gezielte Amazon-PPC (Exact Match + Product Targeting)',
          },
        },
        {
          label: { en: 'Phase 3: Flywheel', de: 'Phase 3: Flywheel' },
          detail: {
            en: 'Organic rank scaling + also-bought',
            de: 'Organisches Ranking + Auch-gekauft',
          },
        },
      ],
    },
    {
      id: 'brand',
      number: 5,
      title: {
        en: 'Brand expansion & off-Amazon ownership',
        de: 'Markenausbau & Ownership jenseits Amazon',
      },
      bullets: {
        en: [
          'Relying only on Amazon algorithm changes or single standalone titles creates fragile revenue',
          'Fiction: interconnected series — Book 1 as reader magnet / low-friction entry; Books 2–5 drive high-margin read-through',
          'Non-fiction / low-content: cohesive brand imprint across a niche (e.g. multi-volume activity series)',
          'Own the reader relationship with lead magnets: high-value lead magnet bonus (printable activity kit, bonus chapter, resource guide) in front and back matter → convert shoppers to your email list',
          'Publish wide once established: Draft2Digital, IngramSpark, Tolino Media, BoD — diversify beyond one platform',
        ],
        de: [
          'Nur Amazon-Algorithmus oder einzelne Standalone-Titel erzeugen fragile Einnahmen',
          'Fiction: verbundene Serie — Buch 1 als Magnet / Low-Friction-Einstieg; Bücher 2–5 mit hoher Read-through-Marge',
          'Non-Fiction / Low-Content: kohärentes Brand-Imprint in einer Nische (z. B. mehrbändige Activity-Serie)',
          'Reader-Beziehung mit Lead-Magneten: hochwertiger Lead-Magnet-Bonus (druckbares Activity-Kit, Bonuskapitel, Resource Guide) in Front- und Back-Matter → Shopper auf Ihre E-Mail-Liste',
          'Wide publizieren wenn etabliert: Draft2Digital, IngramSpark, Tolino Media, BoD — Diversifikation jenseits einer Plattform',
        ],
      },
    },
  ],
  executionMatrix: [
    {
      metric: { en: 'Catalog focus', de: 'Katalog-Fokus' },
      weak: {
        en: 'Mass-producing 100+ low-effort titles',
        de: 'Massenproduktion von 100+ Low-Effort-Titeln',
      },
      winning: {
        en: 'Deep focus on 5–10 high-quality, high-converting titles',
        de: 'Tiefer Fokus auf 5–10 hochwertige, stark konvertierende Titel',
      },
    },
    {
      metric: { en: 'Niche selection', de: 'Nischenwahl' },
      weak: {
        en: 'Chasing high-volume, hyper-competitive keywords',
        de: 'High-Volume, hyper-kompetitive Keywords jagen',
      },
      winning: {
        en: 'Owning long-tail, low-competition sub-niches with proven buyers',
        de: 'Longtail-Subnischen mit geringer Konkurrenz und bewährten Käufer:innen besitzen',
      },
    },
    {
      metric: { en: 'Marketing', de: 'Marketing' },
      weak: {
        en: 'Relying on luck or random social media posts',
        de: 'Auf Glück oder zufällige Social-Media-Posts setzen',
      },
      winning: {
        en: 'Strategic Amazon PPC, ARC review teams, and email list captures',
        de: 'Strategische Amazon-PPC, ARC-Review-Teams und E-Mail-Listen-Captures',
      },
    },
    {
      metric: { en: 'Risk management', de: 'Risikomanagement' },
      weak: {
        en: '100% dependent on Amazon KDP',
        de: '100 % abhängig von Amazon KDP',
      },
      winning: {
        en: 'Multi-platform publishing wide + direct-to-reader mailing list',
        de: 'Multi-Plattform wide + Direct-to-Reader-Mailingliste',
      },
    },
  ],
  relatedHubGuides: [
    { id: 'kdp-niche-research', label: { en: 'Niche research', de: 'Nischen-Research' } },
    { id: 'kdp-resources', label: { en: 'Listing / Hard Topics', de: 'Listing / Schwierigsthemen' } },
    { id: 'publish-wide-email', label: { en: 'Publish wide + email', de: 'Wide + E-Mail' } },
    { id: 'kdp-hidden-pitfalls', label: { en: 'Hidden pitfalls', de: 'Versteckte Fallen' } },
    {
      id: 'amazon-alt-ecosystems',
      label: { en: 'Under-explored ecosystems', de: 'Unterschätzte Ökosysteme' },
    },
  ],
  links: [
    { label: 'KDP home', url: 'https://kdp.amazon.com/' },
    {
      label: 'A+ Content (Help)',
      url: 'https://kdp.amazon.com/en_US/help/topic/G201173080',
    },
    {
      label: 'Amazon Advertising',
      url: 'https://advertising.amazon.com/',
    },
  ],
}
