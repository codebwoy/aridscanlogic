/**
 * Learning resources to begin Amazon KDP (DE founders).
 * Prices, course contents, and third-party claims change — show lastVerified + ⚠.
 * Prefer Amazon official docs first. No affiliation with listed third parties.
 */

import { KDP_JUMPSTART_CONFIG } from '@/lib/bizstart/amazon/kdpJumpstartConfig'
import { REEDSY_LEARNING_CONFIG } from '@/lib/bizstart/amazon/reedsyLearningConfig'

export const KDP_RESOURCES_CONFIG = {
  lastVerified: '2026-04-11',
  sourceLabel:
    'Owner-curated path — Amazon KDP Jumpstart + Reedsy Self-Publishing 101 curricula first, then free/paid third parties (ratings & sales claims are source notes)',
  /** Official Jumpstart curriculum (rich learning centre core) */
  jumpstart: KDP_JUMPSTART_CONFIG,
  /** Reedsy Learning — Self-Publishing 101 + related free courses */
  reedsy: REEDSY_LEARNING_CONFIG,
  independenceDisclaimer: {
    en: 'Not affiliated with Amazon or any course vendor. Ratings, “verified” counts, and publisher sales claims are owner/source notes — re-check on the platform before buying. Treat upsells critically. Official Amazon pages always win when wording differs.',
    de: 'Nicht mit Amazon oder Kursanbietern verbunden. Ratings, „verified“-Zahlen und Verlags-Verkaufsansprüche sind Quellen-Notizen — vor Kauf auf der Plattform prüfen. Upsells kritisch sehen. Offizielle Amazon-Seiten gelten bei abweichendem Wortlaut.',
  },
  recommendation: {
    en: 'Start free: (1) KDP Jumpstart curriculum in this panel (2) enroll in Reedsy’s Self-Publishing 101 (10 email days) and use the study modules here (3) Picture Book course next. Then Kindlepreneur. Paid Udemy only after a draft concept and demand check.',
    de: 'Zuerst kostenlos: (1) KDP-Jumpstart-Curriculum in diesem Panel (2) Reedsy Self-Publishing 101 (10 E-Mail-Tage) + Studienmodule hier (3) danach Bilderbuch-Kurs. Dann Kindlepreneur. Bezahlte Udemy erst nach Konzept und Nachfrage-Check.',
  },
  /** Part 1 — paid courses (ratings are as-of source notes) */
  paidCourses: [
    {
      id: 'udemy_bestseller_book_marketing',
      order: 1,
      name: {
        en: 'Bestseller Book Marketing: Amazon KDP Self-Publishing',
        de: 'Bestseller Book Marketing: Amazon KDP Self-Publishing',
      },
      platform: 'Udemy',
      rating: {
        stars: '4.5',
        count: '1,100+',
        asOf: '2026-04-11',
        sourceNote: {
          en: 'Source snapshot — confirm live Udemy rating before purchase.',
          de: 'Quellen-Snapshot — aktuelle Udemy-Bewertung vor Kauf prüfen.',
        },
      },
      covers: {
        en: 'KDP keywords, categories, launch strategy, reviews, and full publishing mechanics',
        de: 'KDP-Keywords, Kategorien, Launch-Strategie, Reviews und Publishing-Mechanik',
      },
      why: {
        en: 'Source pick as a practical KDP/launch system focused on real mechanics rather than passive-income hype — not an Amazon endorsement.',
        de: 'Quellen-Tipp als praxisnahes KDP-/Launch-System mit Fokus auf echte Mechanik statt Passiv-Einkommens-Hype — keine Amazon-Empfehlung.',
      },
      bestFor: {
        en: 'Complete KDP publishing + launch system once you are ready to pay for structure',
        de: 'Komplettes KDP-Publishing + Launch-System, wenn Sie Struktur kaufen wollen',
      },
      cost: {
        en: 'Typically €10–€20 on Udemy sales (verify)',
        de: 'Typisch 10–20 € bei Udemy-Sales (prüfen)',
      },
      url: 'https://www.udemy.com/courses/search/?q=Bestseller+Book+Marketing+Amazon+KDP+Self-Publishing',
      urlLabel: 'Search on Udemy',
    },
    {
      id: 'udemy_kindle_launch',
      order: 2,
      name: { en: 'Kindle Launch', de: 'Kindle Launch' },
      platform: 'Udemy',
      rating: {
        stars: '4.4',
        count: '',
        asOf: '2026-04-11',
        sourceNote: {
          en: 'Source snapshot — confirm live Udemy rating.',
          de: 'Quellen-Snapshot — aktuelle Udemy-Bewertung prüfen.',
        },
      },
      covers: {
        en: 'Launching your first book correctly — Amazon launch window and early ranking dynamics',
        de: 'Ersten Launch richtig setzen — Launch-Fenster und frühe Ranking-Dynamik',
      },
      why: {
        en: 'Pair with a full KDP mechanics course once the manuscript/cover are nearly ready',
        de: 'Mit einem vollen KDP-Mechanik-Kurs kombinieren, wenn Manuskript/Cover fast fertig sind',
      },
      bestFor: {
        en: 'Launch week execution',
        de: 'Launch-Woche umsetzen',
      },
      cost: {
        en: 'Typically €10–€20 on sale (verify)',
        de: 'Typisch 10–20 € im Sale (prüfen)',
      },
      url: 'https://www.udemy.com/courses/search/?q=Kindle+Launch+KDP',
      urlLabel: 'Search on Udemy',
    },
    {
      id: 'udemy_ai_storybook_kids',
      order: 3,
      name: {
        en: 'How to Create a Storybook for Kids Using AI — Amazon KDP Guide',
        de: 'How to Create a Storybook for Kids Using AI — Amazon KDP Guide',
      },
      platform: 'Udemy / Class Central',
      rating: {
        stars: '',
        count: '',
        asOf: '2026-04-11',
        sourceNote: {
          en: '⚠ Confirm syllabus, AI/disclosure advice, and ratings on Udemy or Class Central before buying.',
          de: '⚠ Lehrplan, KI-/Disclosure-Hinweise und Ratings auf Udemy oder Class Central vor Kauf prüfen.',
        },
      },
      covers: {
        en: 'Children’s storybooks with AI tools, page design, and publishing to KDP',
        de: 'Kinderbücher mit KI-Tools, Seitendesign und Veröffentlichung auf KDP',
      },
      why: {
        en: 'Directly relevant to picture-book / AI-assisted workflows — always cross-check Amazon AI disclosure rules',
        de: 'Direkt relevant für Bilderbuch-/KI-Workflows — Amazon KI-Disclosure-Regeln immer gegenchecken',
      },
      bestFor: {
        en: 'Children’s picture books on KDP (with StoryForge for consistency)',
        de: 'Kinderbilderbücher auf KDP (mit StoryForge für Konsistenz)',
      },
      cost: {
        en: 'Udemy sale pricing varies — verify',
        de: 'Udemy-Sale-Preise variieren — prüfen',
      },
      url: 'https://www.udemy.com/courses/search/?q=Create+Storybook+Kids+AI+Amazon+KDP',
      urlLabel: 'Search on Udemy',
      note: {
        en: '⚠ AI courses go stale quickly. Prefer StoryForge pinned-anchor workflow + official KDP AI disclosure Help.',
        de: '⚠ KI-Kurse veralten schnell. StoryForge-Anker-Workflow + offizielles KDP-AI-Disclosure-Help bevorzugen.',
      },
    },
  ],
  paidCoursesNote: {
    en: '⚠ Ratings and “top pick” wording are source notes for 2026 research — not guarantees. Prefer free path first. Always read recent reviews.',
    de: '⚠ Ratings und „Top-Pick“-Formulierungen sind Quellen-Notizen zur 2026-Recherche — keine Garantie. Zuerst Free-Pfad. Immer aktuelle Reviews lesen.',
  },
  avoid: {
    en: [
      'Expensive “publishing accelerators” and done-for-you packages',
      'Courses promising passive income or guaranteed bestsellers',
      'Anyone implying they are Amazon’s paid editing/design service — KDP itself is free self-publishing; third parties are separate businesses',
    ],
    de: [
      'Teure „Publishing Accelerators“ und Done-for-you-Pakete',
      'Kurse mit passivem Einkommen oder Bestseller-Garantien',
      'Anbieter, die wie Amazons bezahlter Editing-/Design-Service wirken — KDP selbst ist kostenloses Self-Publishing; Dritte sind eigene Firmen',
    ],
  },
  freePath: [
    {
      order: 1,
      name: { en: 'Amazon KDP Jumpstart', de: 'Amazon KDP Jumpstart' },
      why: {
        en: 'Official beginner walkthrough: account, manuscript, cover, title setup, publishing, review, promotion, payment — and content guidelines before upload.',
        de: 'Offizieller Einstieg: Konto, Manuskript, Cover, Titel-Setup, Veröffentlichen, Review, Promotion, Zahlung — inkl. Content-Guidelines vor dem Upload.',
      },
      cost: { en: 'Free', de: 'Kostenlos' },
      url: 'https://kdp.amazon.com/en_US/help/topic/G202187740',
      urlLabel: 'KDP Jumpstart',
    },
    {
      order: 2,
      name: { en: 'KDP Content Guidelines', de: 'KDP Content Guidelines' },
      why: {
        en: 'Read before upload — applies to title, cover, description, and interior. Required companion to Jumpstart.',
        de: 'Vor Upload lesen — gilt für Titel, Cover, Beschreibung und Innenteil. Pflicht-Begleiter zu Jumpstart.',
      },
      cost: { en: 'Free', de: 'Kostenlos' },
      url: 'https://kdp.amazon.com/en_US/help/topic/G200672390',
      urlLabel: 'Content Guidelines',
    },
    {
      order: 3,
      name: { en: 'Amazon KDP Help Center', de: 'Amazon KDP Help Center' },
      why: {
        en: 'Reference manual for formatting, print specs, royalties, tax details, and troubleshooting.',
        de: 'Nachschlagewerk für Formatierung, Print-Specs, Royalties, Steuern und Fehlerbehebung.',
      },
      cost: { en: 'Free', de: 'Kostenlos' },
      url: 'https://kdp.amazon.com/help',
      urlLabel: 'KDP Help',
    },
    {
      order: 4,
      name: { en: 'Kindlepreneur', de: 'Kindlepreneur' },
      why: {
        en: 'Strong free library for Amazon SEO, keywords, categories, descriptions, launches, and ads; often includes a free Amazon Ads intro.',
        de: 'Starkes Free-Angebot zu Amazon-SEO, Keywords, Kategorien, Beschreibungen, Launches und Ads; oft mit kostenlosem Ads-Einstieg.',
      },
      cost: { en: 'Free (core library)', de: 'Kostenlos (Kernbibliothek)' },
      url: 'https://kindlepreneur.com/',
      urlLabel: 'Kindlepreneur',
      note: {
        en: '⚠ Third-party site — may promote paid tools/courses.',
        de: '⚠ Drittanbieter — kann bezahlte Tools/Kurse bewerben.',
      },
    },
    {
      order: 5,
      name: {
        en: 'Reedsy Learning: Self-Publishing 101',
        de: 'Reedsy Learning: Self-Publishing 101',
      },
      why: {
        en: 'Free 10-part email course (Martin Cavannagh): target reader, writing habit, editors/designers, formatting, ebook/print distribution, marketing basics. Study companion modules are in this panel.',
        de: 'Kostenloser 10-teiliger E-Mail-Kurs (Martin Cavannagh): Zielgruppe, Schreibgewohnheit, Lektorat/Design, Formatierung, E-Book/Print-Distribution, Marketing-Basics. Studienmodule in diesem Panel.',
      },
      cost: { en: 'Free', de: 'Kostenlos' },
      url: 'https://reedsy.com/learning/courses/publishing/self-publishing-101',
      urlLabel: 'Self-Publishing 101',
      note: {
        en: '⚠ Enroll on Reedsy for daily emails; this app’s modules are a study companion, not a copy of their lessons.',
        de: '⚠ Auf Reedsy für tägliche E-Mails einschreiben; Module hier sind Studienbegleiter, keine Kopie der Lektionen.',
      },
    },
    {
      order: 6,
      name: {
        en: 'Self Publishing Titans — free KDP intro course',
        de: 'Self Publishing Titans — kostenloser KDP-Intro-Kurs',
      },
      why: {
        en: 'Source notes: ~18 structured beginner videos + downloadable resources on their site. Useful no-fluff overview for complete beginners — still expect tool upsells elsewhere on the site.',
        de: 'Quellen: ca. 18 strukturierte Anfänger-Videos + Downloads auf ihrer Site. Nützlicher Überblick für Absolute Beginner — trotzdem Tool-Upsells auf der Site erwarten.',
      },
      cost: { en: 'Free (+ optional tools/upsells)', de: 'Kostenlos (+ optionale Tools/Upsells)' },
      url: 'https://selfpublishingtitans.com/',
      urlLabel: 'selfpublishingtitans.com',
      credibilityClaim: {
        en: 'Source claim: founders have sold large volumes on KDP and offer free research tools — treat volume claims as marketing; verify tools yourself.',
        de: 'Quellen-Claim: Gründer:innen mit hohem KDP-Volumen und Free-Recherche-Tools — Volumen-Claims als Marketing sehen; Tools selbst prüfen.',
      },
      note: {
        en: '⚠ Use the free intro sequence; postpone paid tool purchases until after your first research pass on Amazon.de.',
        de: '⚠ Free-Intro nutzen; bezahlte Tools erst nach der ersten Amazon.de-Recherche.',
      },
    },
  ],
  freeCoursesDetail: {
    heading: {
      en: 'Free courses — depth notes',
      de: 'Kostenlose Kurse — Tiefen-Notizen',
    },
    titans: {
      en: [
        'Platform: selfpublishingtitans.com (structured sequence; still a commercial site)',
        'Cost: free intro course',
        'Includes: beginner video sequence + downloadable resources (confirm current count on site)',
        'Best for: complete beginners wanting a linear path before paying for Udemy',
        'Credibility: publisher-founded; sales-volume claims are theirs — not verified by this app',
      ],
      de: [
        'Plattform: selfpublishingtitans.com (strukturierte Sequenz; trotzdem kommerzielle Site)',
        'Kosten: kostenloser Intro-Kurs',
        'Inhalt: Anfänger-Videos + Downloads (aktuelle Anzahl auf der Site prüfen)',
        'Am besten für: Absolute Beginner vor bezahlten Udemy-Kursen',
        'Glaubwürdigkeit: von Publisher:innen gegründet; Verkaufsvolumen-Claims sind deren Aussage — hier nicht verifiziert',
      ],
    },
  },
  childrensResources: [
    {
      name: {
        en: 'Reedsy: How to Publish Your Picture Book',
        de: 'Reedsy: How to Publish Your Picture Book',
      },
      why: {
        en: 'Free 10-day course by Kim Fleming: picture-book market, marketability, trad vs self-pub, querying agents, illustrator costs & rights — take after Self-Publishing 101 + KDP basics.',
        de: 'Kostenloser 10-Tage-Kurs von Kim Fleming: Bilderbuch-Markt, Marktfähigkeit, Trad vs. Self-Pub, Agenten-Query, Illustrationskosten & Rechte — nach Self-Publishing 101 + KDP-Basics.',
      },
      url: 'https://reedsy.com/learning/courses/publishing/how-to-publish-a-picture-book',
      urlLabel: 'Picture Book course',
      note: {
        en: '⚠ Confirm the course is still listed; enroll on Reedsy for the email sequence.',
        de: '⚠ Prüfen, ob der Kurs noch gelistet ist; E-Mail-Sequenz auf Reedsy starten.',
      },
    },
    {
      name: {
        en: 'Harleigh Manske / Author Growth Academy',
        de: 'Harleigh Manske / Author Growth Academy',
      },
      why: {
        en: 'Free children’s-book KDP publishing/formatting content and marketing tips; YouTube is useful — also promotes paid coaching and affiliate tools.',
        de: 'Kostenlose Kinderbuch-KDP-/Formatierungs-Inhalte und Marketing-Tipps; YouTube nützlich — bewirbt auch bezahltes Coaching und Affiliate-Tools.',
      },
      url: 'https://www.youtube.com/',
      urlLabel: 'Search YouTube',
      note: {
        en: '⚠ Search her name on YouTube; verify channel authenticity. Expect paid upsells.',
        de: '⚠ Namen auf YouTube suchen; Kanal-Authentizität prüfen. Mit Upsells rechnen.',
      },
    },
    {
      name: {
        en: 'Children’s Book Marketing Made Easy (podcast)',
        de: 'Children’s Book Marketing Made Easy (Podcast)',
      },
      why: {
        en: 'Marketing-focused content for self-published children’s authors: listing optimisation and audience building.',
        de: 'Marketing-Fokus für Self-Publishing-Kinderbuch-Autor:innen: Listing-Optimierung und Audience-Building.',
      },
      url: 'https://www.youtube.com/results?search_query=Children%27s+Book+Marketing+Made+Easy',
      urlLabel: 'Find podcast',
    },
    {
      name: { en: 'Self Publishing Central', de: 'Self Publishing Central' },
      why: {
        en: 'Useful for children’s niche research and workbook ideas — videos often contain affiliate links and funnels; use research methods first.',
        de: 'Nützlich für Nischen-Recherche und Workbook-Ideen — Videos oft mit Affiliates/Funnels; zuerst Recherche-Methoden nutzen.',
      },
      url: 'https://www.youtube.com/results?search_query=Self+Publishing+Central+children%27s+book',
      urlLabel: 'Find channel',
      note: {
        en: '⚠ Affiliate-heavy — do not buy tools immediately.',
        de: '⚠ Affiliate-lastig — Tools nicht sofort kaufen.',
      },
    },
  ],
  paidOption: {
    name: {
      en: 'Kindlepreneur Authorpreneur Academy (if you buy one)',
      de: 'Kindlepreneur Authorpreneur Academy (falls Sie einen Kurs kaufen)',
    },
    why: {
      en: 'Often cited as a reputable all-in-one: market research, KDP optimisation, keywords, launches, marketing, author-business growth.',
      de: 'Oft als seriöses All-in-one genannt: Marktrecherche, KDP-Optimierung, Keywords, Launches, Marketing, Autoren-Business.',
    },
    priceDisplay: {
      en: 'Source notes ~$179 one-time — verify current price on Kindlepreneur before buying.',
      de: 'Quellen nennen ca. 179 $ einmalig — aktuellen Preis auf Kindlepreneur prüfen.',
    },
    verifiedNote: {
      en: '⚠ Price and syllabus change. Not required to start. Prefer free path first.',
      de: '⚠ Preis und Lehrplan ändern sich. Nicht nötig zum Start. Zuerst Free-Pfad.',
    },
    url: 'https://kindlepreneur.com/',
    urlLabel: 'Kindlepreneur',
  },
  learnFirst: [
    {
      label: { en: 'KDP mechanics', de: 'KDP-Mechanik' },
      detail: {
        en: 'Account setup, paperback vs Kindle ebook, trim, bleed, cover, pricing, royalties',
        de: 'Konto, Paperback vs. Kindle-E-Book, Trim, Bleed, Cover, Preis, Royalties',
      },
    },
    {
      label: { en: 'Children’s-book production', de: 'Kinderbuch-Produktion' },
      detail: {
        en: 'Story length, age band, page count, illustration consistency, readable type, print-quality files',
        de: 'Textlänge, Altersband, Seitenzahl, Figuren-Konsistenz, lesbare Typo, druckfähige Dateien',
      },
    },
    {
      label: { en: 'Amazon discoverability', de: 'Amazon-Auffindbarkeit' },
      detail: {
        en: 'Keywords, categories, title/subtitle, description, A+ Content (when eligible)',
        de: 'Keywords, Kategorien, Titel/Untertitel, Beschreibung, A+ Content (wenn verfügbar)',
      },
    },
    {
      label: { en: 'Validation before creation', de: 'Validierung vor Produktion' },
      detail: {
        en: 'Study search results, reviews, BSR signals, pricing, and gaps before writing/illustrating',
        de: 'Suchergebnisse, Reviews, BSR-Signale, Preise und Lücken prüfen — bevor Sie schreiben/illustrieren',
      },
    },
    {
      label: { en: 'Marketing', de: 'Marketing' },
      detail: {
        en: 'Launch checklist, author platform, email list — Amazon Ads only after a proven product',
        de: 'Launch-Checkliste, Autorenplattform, E-Mail-Liste — Amazon Ads erst nach bewährtem Produkt',
      },
    },
  ],
  plan30: [
    {
      days: { en: 'Days 1–7', de: 'Tag 1–7' },
      detail: {
        en: 'Complete official Jumpstart §§1–3 in this learning centre + Content Guidelines; start Reedsy Self-Publishing 101',
        de: 'Offizielles Jumpstart §§1–3 in diesem Lernzentrum + Content Guidelines; Reedsy Self-Publishing 101 starten',
      },
    },
    {
      days: { en: 'Days 8–14', de: 'Tag 8–14' },
      detail: {
        en: 'Study 20–30 competing children’s books: age, pages, price, review themes, cover style, unmet needs',
        de: '20–30 konkurrierende Kinderbücher: Alter, Seiten, Preis, Review-Themen, Cover-Stil, Lücken',
      },
    },
    {
      days: { en: 'Days 15–21', de: 'Tag 15–21' },
      detail: {
        en: 'Finish Reedsy picture-book course; draft one small original concept — not a generic AI story dump',
        de: 'Reedsy-Bilderbuch-Kurs; ein kleines originales Konzept — kein generischer KI-Text',
      },
    },
    {
      days: { en: 'Days 22–30', de: 'Tag 22–30' },
      detail: {
        en: 'Print-ready sample: cover, interior, copyright page, metadata. Upload only after content guidelines check. Use StoryForge (desktop) for consistent art + preflight.',
        de: 'Druckfertiges Sample: Cover, Innenteil, Impressum/Copyright, Metadaten. Upload erst nach Content-Guidelines. StoryForge (Desktop) für konsistente Kunst + Preflight.',
      },
    },
  ],
}
