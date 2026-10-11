/**
 * Reedsy Learning — Self-Publishing 101 curriculum (learning centre).
 * Distilled from the public course overview + Reedsy Learning format.
 * Enroll on Reedsy for the daily email lessons — this is a study companion, not a copy of their emails.
 * Course: https://reedsy.com/learning/courses/publishing/self-publishing-101
 */

export const REEDSY_LEARNING_CONFIG = {
  lastVerified: '2026-04-11',
  sourceLabel:
    'Distilled from Reedsy’s public Self-Publishing 101 course page + Learning catalog — enroll on Reedsy for full daily lessons',
  independenceDisclaimer: {
    en: 'Not affiliated with Reedsy. Reedsy is a marketplace (editors, designers, marketers) and may promote paid services. Prefer free email courses first; enroll on their site for the actual 10-day sequence.',
    de: 'Nicht mit Reedsy verbunden. Reedsy ist ein Marketplace (Lektorat, Design, Marketing) und kann bezahlte Services bewerben. Zuerst Free-E-Mail-Kurse; für die echten 10 Tageslektionen auf Reedsy einschreiben.',
  },
  hub: {
    title: {
      en: 'How to Self-Publish a Book (Self-Publishing 101)',
      de: 'How to Self-Publish a Book (Self-Publishing 101)',
    },
    url: 'https://reedsy.com/learning/courses/publishing/self-publishing-101',
    catalogUrl: 'https://reedsy.com/learning/courses/',
    teacher: 'Martin Cavannagh',
    format: {
      en: 'Free 10-part email course · ~5-minute lessons · one lesson per morning (sign in on Reedsy to enroll)',
      de: 'Kostenloser 10-teiliger E-Mail-Kurs · ca. 5-Minuten-Lektionen · eine Lektion morgens (auf Reedsy anmelden)',
    },
    intro: {
      en: 'Reedsy’s free indie-author primer: get a book to professional standards, sell ebooks and print on Amazon and other portals, then learn marketing practices used by successful self-publishers. Pair with Amazon KDP Jumpstart for Amazon-specific upload mechanics.',
      de: 'Reedsys kostenloser Indie-Einstieg: Buch auf Profi-Niveau bringen, E-Books und Print auf Amazon und anderen Portalen verkaufen, dann Marketing-Praktiken erfolgreicher Self-Publisher. Mit Amazon KDP Jumpstart für Upload-Mechanik kombinieren.',
    },
    outcomes: {
      en: [
        'Identifying your target reader',
        'Developing a productive writing habit',
        'How to work with professional editors and designers',
        'How to format and typeset your book',
        'Your options for distribution: ebooks and print',
        'The basics of book marketing',
      ],
      de: [
        'Ziel-Leser:innen identifizieren',
        'Produktive Schreibgewohnheit aufbauen',
        'Mit professionellem Lektorat und Design arbeiten',
        'Buch formatieren und setzen',
        'Distributions-Optionen: E-Book und Print',
        'Grundlagen des Buch-Marketings',
      ],
    },
  },
  /**
   * 10 study modules aligned to the 10-part course themes.
   * Not verbatim Reedsy email text — actionable study notes for DE KDP/Merch founders.
   */
  modules: [
    {
      id: 'rs1',
      number: 1,
      title: {
        en: 'Mindset — indie career vs “upload and hope”',
        de: 'Mindset — Indie-Karriere vs. „hochladen und hoffen“',
      },
      learn: {
        en: [
          'Self-publishing is a small publishing business: craft + product + discoverability',
          'Famous indie breakouts are outliers — plan for professional standards, not lottery tickets',
          'Your near-term goal: one strong, researched title (especially children’s picture books on Amazon.de)',
        ],
        de: [
          'Self-Publishing ist ein kleines Verlagsgeschäft: Craft + Produkt + Auffindbarkeit',
          'Berühmte Indie-Hits sind Ausreißer — Profi-Standard planen, keine Lotterie',
          'Nahziel: ein starkes, recherchiertes Titelprojekt (z. B. Bilderbuch auf Amazon.de)',
        ],
      },
      doNow: {
        en: [
          'Enroll in the official course on Reedsy (one course at a time — their rule of thumb)',
          'Write a one-sentence “why this book exists” for parents/kids on Amazon.de',
        ],
        de: [
          'Offiziellen Kurs auf Reedsy starten (oft nur ein Kurs gleichzeitig)',
          'Einen Satz „Warum dieses Buch?“ für Eltern/Kinder auf Amazon.de schreiben',
        ],
      },
    },
    {
      id: 'rs2',
      number: 2,
      title: {
        en: 'Identify your target reader',
        de: 'Ziel-Leser:innen finden',
      },
      learn: {
        en: [
          'Course pillar: knowing who buys and who reads (for kids: parent buyer + child reader)',
          'Define age band, emotional core, and “shelf neighbors” on Amazon.de',
          'Validate with search autocomplete, comps, and review themes before writing/illustrating',
        ],
        de: [
          'Kurs-Säule: wer kauft und wer liest (Kinder: Eltern kaufen, Kind liest)',
          'Altersband, emotionaler Kern und „Regal-Nachbarn“ auf Amazon.de definieren',
          'Mit Autocomplete, Comps und Review-Themen validieren — vor Schreiben/Illustrieren',
        ],
      },
      doNow: {
        en: [
          'List 5 competing titles and note age, page count, price, and unmet needs in reviews',
          'Open Amazon Hub → DE research playbook for the research loop',
        ],
        de: [
          '5 Konkurrenztitel: Alter, Seiten, Preis, Review-Lücken notieren',
          'Amazon Hub → DE-Recherche-Playbook für den Research-Loop öffnen',
        ],
      },
    },
    {
      id: 'rs3',
      number: 3,
      title: {
        en: 'Productive writing habit',
        de: 'Produktive Schreibgewohnheit',
      },
      learn: {
        en: [
          'Course pillar: small consistent sessions beat rare marathon dumps',
          'Picture books: plan page turns first — words and images as a duet',
          'Lock emotional core before drafting; keep text sparse per page',
        ],
        de: [
          'Kurs-Säule: kleine konstante Sessions schlagen seltene Marathon-Texte',
          'Bilderbuch: zuerst Seitenumbrüche — Text und Bild als Duett',
          'Emotionalen Kern vor dem Draft festlegen; Text pro Seite sparsam',
        ],
      },
      doNow: {
        en: [
          'Draft a 24–32 page outline (one beat per spread)',
          'Use StoryForge Launchpad manuscript principles (desktop) if creating art next',
        ],
        de: [
          '24–32-Seiten-Outline (ein Beat pro Doppelseite)',
          'StoryForge-Launchpad-Manuskript-Prinzipien nutzen (Desktop), wenn als Nächstes Kunst kommt',
        ],
      },
    },
    {
      id: 'rs4',
      number: 4,
      title: {
        en: 'Work with professional editors',
        de: 'Mit Profi-Lektorat arbeiten',
      },
      learn: {
        en: [
          'Course pillar: professional editors raise quality — developmental vs copyedit vs proofread',
          'Reedsy marketplace connects freelancers; budget deliberately (optional, not required for KDP)',
          'Even DIY: freeze a “editor pass” checklist (clarity, age-fit language, page-turn logic)',
        ],
        de: [
          'Kurs-Säule: Profi-Lektorat hebt Qualität — Entwicklung vs. Copyedit vs. Korrektorat',
          'Reedsy-Marketplace vermittelt Freelancer — Budget bewusst (optional, für KDP nicht Pflicht)',
          'Auch DIY: „Editor-Pass“-Checkliste (Klarheit, Altersfit, Seitenumbruch-Logik)',
        ],
      },
      doNow: {
        en: [
          'Run one cold-reader pass with a parent in your target age band',
          'List must-fix issues before illustration lock',
        ],
        de: [
          'Einen Cold-Reader-Pass mit einem Elternteil der Zielaltersgruppe',
          'Muss-Fix-Liste vor Illustrations-Freeze',
        ],
      },
    },
    {
      id: 'rs5',
      number: 5,
      title: {
        en: 'Work with designers & illustrators',
        de: 'Mit Design & Illustration arbeiten',
      },
      learn: {
        en: [
          'Course pillar: cover and interior design sell the click — amateur art is a silent killer',
          'Children’s books: character consistency across pages (StoryForge Character Turbo anchor path)',
          'If commissioning: clarify rights, deliverables (print PDF, transparent PNG for Merch), and AI disclosure needs',
        ],
        de: [
          'Kurs-Säule: Cover und Innendesign verkaufen den Klick — Amateurkunst ist ein stiller Killer',
          'Kinderbücher: Figuren-Konsistenz über Seiten (StoryForge Character-Turbo-Anker)',
          'Bei Auftrag: Rechte, Deliverables (Print-PDF, transparente PNG für Merch), KI-Disclosure klären',
        ],
      },
      doNow: {
        en: [
          'Decide: StoryForge AI-assisted path vs human illustrator vs hybrid',
          'Require Merch-ready transparent character PNG in the brief',
        ],
        de: [
          'Entscheiden: StoryForge-KI-Pfad vs. menschliche:r Illustrator:in vs. Hybrid',
          'Im Brief Merch-fähige transparente Figuren-PNG verlangen',
        ],
      },
    },
    {
      id: 'rs6',
      number: 6,
      title: {
        en: 'Format and typeset your book',
        de: 'Buch formatieren und setzen',
      },
      learn: {
        en: [
          'Course pillar: formatting/typesetting to professional standards for ebook and print',
          'For KDP print: trim, margins, bleed, PDF interior — see Jumpstart §2–3',
          'Metadata in the file (title/author) must match Title Setup exactly',
        ],
        de: [
          'Kurs-Säule: Formatierung/Satz auf Profi-Niveau für E-Book und Print',
          'Für KDP-Print: Trim, Ränder, Bleed, PDF-Innenteil — Jumpstart §§2–3',
          'Metadaten im File (Titel/Autor) müssen exakt dem Title Setup entsprechen',
        ],
      },
      doNow: {
        en: [
          'Pick trim size from comps + KDP Print Options',
          'Export a preflight sample and open KDP Previewer before full submit',
        ],
        de: [
          'Trim aus Comps + KDP Print Options wählen',
          'Preflight-Sample exportieren und KDP Previewer vor dem Full-Submit öffnen',
        ],
      },
    },
    {
      id: 'rs7',
      number: 7,
      title: {
        en: 'Distribution — ebooks',
        de: 'Distribution — E-Books',
      },
      learn: {
        en: [
          'Course pillar: ebook distribution options beyond a single store',
          'Amazon KDP is primary for many DE founders; KDP Select is optional exclusivity for Kindle benefits',
          'Decide Select vs wide later — first nail metadata, sample, and quality review',
        ],
        de: [
          'Kurs-Säule: E-Book-Distribution über einen Store hinaus',
          'Amazon KDP ist für viele DE-Gründer:innen primär; KDP Select ist optionale Exklusivität',
          'Select vs. Wide später entscheiden — zuerst Metadaten, Sample und Quality Review',
        ],
      },
      doNow: {
        en: [
          'Skim Jumpstart §4 Rights & Pricing + KDP Select Help',
          'Draft DE keywords and description (parent search language)',
        ],
        de: [
          'Jumpstart §4 Rights & Pricing + KDP-Select-Help skimmen',
          'DE-Keywords und Beschreibung skizzieren (Eltern-Suchsprache)',
        ],
      },
    },
    {
      id: 'rs8',
      number: 8,
      title: {
        en: 'Distribution — print',
        de: 'Distribution — Print',
      },
      learn: {
        en: [
          'Course pillar: print options and online portals',
          'KDP paperback/hardcover print-on-demand; Expanded Distribution has different timelines/pay',
          'Picture books: color ink, bleed, and spine rules matter — verify in KDP Help',
        ],
        de: [
          'Kurs-Säule: Print-Optionen und Online-Portale',
          'KDP Paperback/Hardcover Print-on-Demand; Expanded Distribution mit anderen Timelines/Auszahlungen',
          'Bilderbücher: Color, Bleed, Spine-Regeln — in KDP Help prüfen',
        ],
      },
      doNow: {
        en: [
          'Run KDP printing cost & royalty calculator for your page count',
          'Order a proof copy after Live if cash allows — feel the physical product',
        ],
        de: [
          'KDP Printing-Cost- & Royalty-Rechner für Ihre Seitenzahl nutzen',
          'Nach Live ggf. Proof-Copy bestellen — physisches Produkt prüfen',
        ],
      },
    },
    {
      id: 'rs9',
      number: 9,
      title: {
        en: 'Book marketing basics',
        de: 'Buch-Marketing-Basics',
      },
      learn: {
        en: [
          'Course pillar: marketing practices from successful self-publishers',
          'Start with Author Central, listing quality, and a simple launch checklist — ads later',
          'Children’s brand loop: book ↔ Merch ↔ social (Amazon Hub brand-loop playbook)',
        ],
        de: [
          'Kurs-Säule: Marketing-Praktiken erfolgreicher Self-Publisher',
          'Start mit Author Central, Listing-Qualität und Launch-Checkliste — Ads später',
          'Kinderbuch-Marken-Loop: Buch ↔ Merch ↔ Social (Amazon-Hub Brand-Loop)',
        ],
      },
      doNow: {
        en: [
          'Enroll next in Reedsy Book Marketing 101 after this course finishes',
          'Draft Author Central bio + Merch link plan',
        ],
        de: [
          'Als Nächstes Reedsy Book Marketing 101 nach diesem Kurs',
          'Author-Central-Bio + Merch-Link-Plan skizzieren',
        ],
      },
    },
    {
      id: 'rs10',
      number: 10,
      title: {
        en: 'Launch plan & next Reedsy courses',
        de: 'Launch-Plan & nächste Reedsy-Kurse',
      },
      learn: {
        en: [
          'Finish the 10 email days on Reedsy — don’t skip; one course at a time',
          'Then specialize: Picture Book course (Kim Fleming) → Amazon Algorithms → Amazon Ads (only with organic signal)',
          'Keep Amazon official Jumpstart as the source of truth for upload/review/payment mechanics',
        ],
        de: [
          'Die 10 E-Mail-Tage auf Reedsy zu Ende bringen — nicht skippen; ein Kurs gleichzeitig',
          'Dann spezialisieren: Bilderbuch-Kurs (Kim Fleming) → Amazon Algorithms → Amazon Ads (nur mit organischem Signal)',
          'Amazon Jumpstart bleibt die Wahrheit für Upload/Review/Auszahlung',
        ],
      },
      doNow: {
        en: [
          'Tick the study checklist below',
          'Schedule picture-book course enrollment when Self-Publishing 101 completes',
        ],
        de: [
          'Lern-Checkliste unten abhaken',
          'Bilderbuch-Kurs einplanen, sobald Self-Publishing 101 fertig ist',
        ],
      },
    },
  ],
  relatedCourses: [
    {
      id: 'picture_book',
      title: {
        en: 'How to Publish Your Picture Book',
        de: 'How to Publish Your Picture Book',
      },
      teacher: 'Kim Fleming',
      why: {
        en: 'Picture-book market, marketability, trad vs self-pub, querying agents, illustrator costs & rights — priority after Self-Publishing 101 for children’s founders.',
        de: 'Bilderbuch-Markt, Marktfähigkeit, Trad vs. Self-Pub, Agenten-Query, Illustrationskosten & Rechte — Priorität nach Self-Publishing 101 für Kinderbuch-Gründer:innen.',
      },
      outcomes: {
        en: [
          'Introduction to the picture book market',
          'What makes a marketable picture book',
          'Pros & cons of traditional vs self-publishing a picture book',
          'How to query a children’s book agent',
          'Costs and rights of commissioning an illustrator',
        ],
        de: [
          'Einführung in den Bilderbuch-Markt',
          'Was ein marktfähiges Bilderbuch ausmacht',
          'Vor-/Nachteile Trad vs. Self-Pub für Bilderbücher',
          'Children’s-Agenten queryen',
          'Kosten und Rechte beim Illustrations-Auftrag',
        ],
      },
      url: 'https://reedsy.com/learning/courses/publishing/how-to-publish-a-picture-book',
      priority: 'high',
    },
    {
      id: 'book_marketing_101',
      title: { en: 'Book Marketing 101', de: 'Book Marketing 101' },
      teacher: 'Ricardo Fayet',
      why: {
        en: 'Marketing plan, prioritization, mailing list, 7 channels, Amazon algorithms intro — take when your first book is nearly ready.',
        de: 'Marketingplan, Priorisierung, Mailingliste, 7 Kanäle, Amazon-Algorithmen-Intro — wenn das erste Buch fast fertig ist.',
      },
      outcomes: {
        en: [
          'Build a robust marketing plan',
          'Prioritize efforts to avoid burnout',
          'Set up and grow a mailing list',
          'Seven proven marketing channels',
          'Leverage Amazon algorithms to sell more books',
        ],
        de: [
          'Soliden Marketingplan bauen',
          'Aufwand priorisieren (Burnout vermeiden)',
          'Mailingliste aufbauen',
          'Sieben bewährte Marketing-Kanäle',
          'Amazon-Algorithmen nutzen',
        ],
      },
      url: 'https://reedsy.com/learning/courses/marketing/book-marketing-101',
      priority: 'high',
    },
    {
      id: 'amazon_algorithms',
      title: {
        en: 'Everything You Need to Know About Amazon Algorithms',
        de: 'Everything You Need to Know About Amazon Algorithms',
      },
      teacher: 'Ricardo Fayet',
      why: {
        en: 'Product page, categories/keywords, lists, launch — deep discoverability after listings exist.',
        de: 'Produktseite, Kategorien/Keywords, Listen, Launch — tiefere Auffindbarkeit nach dem Listing.',
      },
      outcomes: {
        en: [
          'Algorithm fundamentals',
          'Optimize the product page',
          'Pick categories and keywords',
          'Ascend Kindle store lists',
          'Launch the right way',
        ],
        de: [
          'Algorithmus-Grundlagen',
          'Produktseite optimieren',
          'Kategorien und Keywords wählen',
          'Kindle-Listen erklimmen',
          'Richtig launchen',
        ],
      },
      url: 'https://reedsy.com/learning/courses/marketing/amazon-algorithms',
      priority: 'medium',
    },
    {
      id: 'amazon_ads',
      title: {
        en: 'Amazon Ads for Authors',
        de: 'Amazon Ads for Authors',
      },
      teacher: 'Ricardo Fayet',
      why: {
        en: 'Targeting, keywords, metrics, test/scale — only after organic conversion; ads can lose money fast.',
        de: 'Targeting, Keywords, Metriken, Test/Scale — erst nach organischer Conversion; Ads können schnell Geld verbrennen.',
      },
      outcomes: {
        en: [
          'Use Amazon ads to sell books',
          'Learn from case-study approaches (verify current ad UI yourself)',
          'Targeting and keyword discovery',
          'Important metrics',
          'Test and scale with a small budget',
        ],
        de: [
          'Amazon Ads zum Buchverkauf nutzen',
          'Case-Study-Ansätze (aktuelle Ad-UI selbst prüfen)',
          'Targeting und Keyword-Findung',
          'Wichtige Metriken',
          'Mit kleinem Budget testen und skalieren',
        ],
      },
      url: 'https://reedsy.com/learning/courses/marketing/amazon-ads-authors',
      priority: 'later',
    },
    {
      id: 'self_vs_trad',
      title: {
        en: 'Self-Publishing vs. Traditional Publishing',
        de: 'Self-Publishing vs. Traditional Publishing',
      },
      teacher: 'Martin Cavannagh',
      why: {
        en: 'Clarify path choice — most Amazon Hub users stay indie/KDP, but know the tradeoffs.',
        de: 'Pfad klären — die meisten Amazon-Hub-Nutzer:innen bleiben Indie/KDP, Tradeoffs kennen.',
      },
      outcomes: {
        en: ['Key differences', 'Benefits you can expect from both paths'],
        de: ['Wesentliche Unterschiede', 'Vorteile beider Pfade'],
      },
      url: 'https://reedsy.com/learning/courses/categories/publishing',
      priority: 'optional',
    },
    {
      id: 'audiobook',
      title: {
        en: 'Behind the Microphone: How to Create a Great Audiobook',
        de: 'Behind the Microphone: How to Create a Great Audiobook',
      },
      teacher: 'David Markowitz',
      why: {
        en: 'After print/ebook exist — pairs with ACX in Amazon Hub programmes. Find the current course slug in the Reedsy catalog if the direct link moves.',
        de: 'Nach Print/E-Book — passt zu ACX in den Amazon-Hub-Programmen. Aktuellen Kurs-Slug im Reedsy-Katalog prüfen, falls der Direktlink wandert.',
      },
      outcomes: {
        en: ['Produce, distribute, and sell a professional audiobook'],
        de: ['Professionelles Hörbuch produzieren, distribuieren und verkaufen'],
      },
      url: 'https://reedsy.com/learning/courses/',
      priority: 'later',
    },
  ],
  howItPairsWithKdp: {
    en: [
      'Reedsy = craft, professional standards, marketing mindset (email lessons)',
      'KDP Jumpstart = Amazon account, files, title setup, review, royalties (official Amazon)',
      'StoryForge = children’s art consistency + Canvas export (desktop)',
      'Amazon Hub Merch playbooks = character merch after the book brand exists',
    ],
    de: [
      'Reedsy = Craft, Profi-Standard, Marketing-Mindset (E-Mail-Lektionen)',
      'KDP Jumpstart = Amazon-Konto, Dateien, Title Setup, Review, Royalties (offiziell Amazon)',
      'StoryForge = Kinderbuch-Kunst-Konsistenz + Canvas-Export (Desktop)',
      'Amazon-Hub Merch-Playbooks = Figuren-Merch, wenn die Buchmarke steht',
    ],
  },
  studyChecklist: {
    en: [
      'Enroll at reedsy.com (Self-Publishing 101) and finish all 10 email days',
      'Complete the six published learning outcomes as notes in your own doc',
      'Run DE market research before locking the manuscript',
      'Finish KDP Jumpstart §§1–4 before upload',
      'Enroll in How to Publish Your Picture Book next (children’s path)',
      'Delay Amazon Ads course until you have organic sales signal',
    ],
    de: [
      'Auf reedsy.com (Self-Publishing 101) einschreiben und alle 10 E-Mail-Tage absolvieren',
      'Die sechs veröffentlichten Learning Outcomes als eigene Notizen festhalten',
      'DE-Marktrecherche vor Manuskript-Freeze',
      'KDP Jumpstart §§1–4 vor Upload',
      'Als Nächstes How to Publish Your Picture Book (Kinderbuch-Pfad)',
      'Amazon-Ads-Kurs erst bei organischem Verkaufssignal',
    ],
  },
}
