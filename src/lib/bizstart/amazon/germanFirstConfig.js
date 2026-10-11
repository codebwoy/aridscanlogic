/**
 * How to start KDP in Germany — language strategy + market numbers.
 * All market figures are owner/source snapshots — verify Börsenverein, PublishDrive, Statista, Destatis.
 * Not affiliated with Amazon. Guidance only — not investment advice.
 */

export const GERMAN_FIRST_CONFIG = {
  lastVerified: '2026-10-01',
  sourceLabel:
    'Owner notes: PublishDrive (2025/Sep 2026 notes), Börsenverein (Jul/2026 notes), Statista context — re-check primary sources',
  independenceDisclaimer: {
    en: 'Not affiliated with Amazon, Börsenverein, or PublishDrive. Growth % and € figures are dated source claims — not forecasts.',
    de: 'Nicht mit Amazon, Börsenverein oder PublishDrive verbunden. Wachstums-% und €-Zahlen sind datierte Quellen-Claims — keine Prognosen.',
  },
  strategicAnswer: {
    en: 'Sequence languages: start German for DE parents/schools/libraries, then English editions (same art, new text), then consider bilingual. Do not pick English-only for DE children’s picture books as phase 1.',
    de: 'Sprachen sequenzieren: zuerst Deutsch für DE-Eltern/Schulen/Bibliotheken, dann EN-Ausgaben (gleiche Kunst, neuer Text), dann bilingual prüfen. Nicht Englisch-only als Phase 1 für DE-Kinderbilderbücher.',
  },
  whyGermanGrows: {
    verifiedNote: {
      en: '⚠ PublishDrive-style growth comparisons can reflect a smaller German indie base (base effect). Directional signal only — verify current reports.',
      de: '⚠ PublishDrive-Wachstumsvergleiche können eine kleinere DE-Indie-Basis widerspiegeln (Basiseffekt). Nur Richtungssignal — aktuelle Reports prüfen.',
    },
    bullets: {
      en: [
        'Source: German-language indie KDP revenue growth cited much higher than English-in-Germany (e.g. ~+101% vs ~+33% in PublishDrive 2025 notes)',
        'Source: more new German-language titles entering (~+27% in 2025 notes)',
        'Children’s books remain a top product group in German book trade (Börsenverein structure)',
      ],
      de: [
        'Quelle: DE-sprachiges Indie-KDP-Umsatzwachstum deutlich höher als EN-in-DE genannt (z. B. ca. +101 % vs. ca. +33 % in PublishDrive-2025-Notizen)',
        'Quelle: mehr neue DE-Titel (~+27 % in 2025-Notizen)',
        'Kinderbücher bleiben Top-Produktgruppe im DE-Buchhandel (Börsenverein-Struktur)',
      ],
    },
    structuralAdvantages: {
      en: [
        'Domestic platforms (Tolino ecosystem, Libreka, German library channels) favour German-language content in discovery',
        'German reaches global + domestic DE ecosystems; English often reaches global platforms only (Amazon, Kobo) for DE buyers',
        'Schools, libraries, and institutional buyers overwhelmingly purchase German-language kids content',
      ],
      de: [
        'Inlandsplattformen (Tolino, Libreka, Bibliotheken) bevorzugen DE-Inhalt in der Entdeckung',
        'Deutsch erreicht global + DE-Ökosysteme; Englisch oft nur globale Plattformen (Amazon, Kobo) für DE-Käufer',
        'Schulen, Bibliotheken und Institutionen kaufen überwiegend DE-Kinderinhalte',
      ],
    },
    whereEnglishWorks: {
      en: [
        'English can perform in business, technology, academic, and some self-help',
        'For children’s picture books, German dominates because parents/educators want native-language rhyme, rhythm, and wordplay',
      ],
      de: [
        'Englisch kann in Business, Technik, Academia und Self-Help funktionieren',
        'Bei Kinderbilderbüchern dominiert Deutsch — Eltern/Pädagog:innen wollen muttersprachlichen Reim, Rhythmus und Wortspiel',
      ],
    },
  },
  phases: [
    {
      id: 'phase1',
      title: { en: 'Phase 1 — Start with German', de: 'Phase 1 — Mit Deutsch starten' },
      bullets: {
        en: [
          'Target buyers (DE parents, schools, libraries) expect German children’s books',
          'Emotional themes (courage, anger, kindness) need native rhyme/rhythm — machine translation is not enough',
          'German unlocks the fuller domestic ecosystem alongside Amazon.de',
        ],
        de: [
          'Zielkäufer (DE-Eltern, Schulen, Bibliotheken) erwarten deutsche Kinderbücher',
          'Emotionsthemen brauchen muttersprachlichen Reim/Rhythmus — Maschinenübersetzung reicht nicht',
          'Deutsch öffnet das volle Inlands-Ökosystem neben Amazon.de',
        ],
      },
    },
    {
      id: 'phase2',
      title: {
        en: 'Phase 2 — Add English as secondary market',
        de: 'Phase 2 — Englisch als Zweitmarkt',
      },
      bullets: {
        en: [
          'After German titles show traction, publish English editions on Amazon.com / .co.uk etc.',
          'Same illustrations, new text — doubles reach with lower incremental production cost',
          'Common pattern for successful kids series: original language + translation',
        ],
        de: [
          'Nach Traktion der DE-Titel EN-Ausgaben auf Amazon.com / .co.uk usw.',
          'Gleiche Illustrationen, neuer Text — mehr Reichweite bei geringeren Mehrkosten',
          'Häufiges Muster erfolgreicher Serien: Originalsprache + Übersetzung',
        ],
      },
    },
    {
      id: 'phase3',
      title: {
        en: 'Phase 3 — Consider bilingual editions',
        de: 'Phase 3 — Bilinguale Ausgaben prüfen',
      },
      bullets: {
        en: [
          'Audience: expats in Germany, DE families wanting early English exposure, international schools',
          'Differentiation with often lower competition density on Amazon.de',
          '⚠ No large public KDP dataset on bilingual kids performance — structural logic only; validate listings yourself',
        ],
        de: [
          'Zielgruppe: Expats in DE, DE-Familien mit frühem EN-Input, internationale Schulen',
          'Differenzierung mit oft geringerer Konkurrenzdichte auf Amazon.de',
          '⚠ Kein großes öffentliches KDP-Dataset zu bilingualen Kinderbüchern — nur Strukturlogik; Listings selbst validieren',
        ],
      },
    },
  ],
  printEconomics: {
    claim: {
      en: 'Source notes often cite KDP Germany among the lower base printing costs of major marketplaces (example figures like €0.60 + €0.012/page appear in older playbooks).',
      de: 'Quellen nennen KDP Deutschland oft unter den niedrigeren Basis-Druckkosten großer Marktplätze (Beispielzahlen wie 0,60 € + 0,012 €/Seite in älteren Playbooks).',
    },
    verifiedNote: {
      en: '⚠ Printing/base costs change by trim, ink, page count, and marketplace — always use the live KDP calculator; never hardcode these € figures into pricing decisions.',
      de: '⚠ Druck-/Basiskosten ändern sich mit Format, Farbe, Seitenzahl und Marktplatz — immer den Live-KDP-Rechner nutzen; diese €-Zahlen nie fest verdrahten.',
    },
  },
  marketHardNumbers: {
    source: {
      en: 'Börsenverein des Deutschen Buchhandels (owner notes, mid/late 2026 reports cited)',
      de: 'Börsenverein des Deutschen Buchhandels (Owner-Notizen, genannte Reports Mitte/Ende 2026)',
    },
    verifiedNote: {
      en: '⚠ Confirm current Börsenverein Jahreswirtschaftszahlen before citing externally.',
      de: '⚠ Aktuelle Börsenverein-Jahreswirtschaftszahlen prüfen, bevor Sie extern zitieren.',
    },
    rows: [
      {
        label: { en: 'Total book market turnover (2025 note)', de: 'Gesamtumsatz Buchmarkt (2025-Notiz)' },
        value: {
          en: '~€9.619 billion (source: down ~2.7% vs 2024 — contracting overall)',
          de: 'ca. 9,619 Mrd. € (Quelle: ca. −2,7 % vs. 2024 — Gesamtmarkt rückläufig)',
        },
      },
      {
        label: { en: 'Online book trade', de: 'Online-Buchhandel' },
        value: {
          en: '~€2.51 billion (~26.1% of market; relatively resilient in source notes)',
          de: 'ca. 2,51 Mrd. € (ca. 26,1 %; in Quellen relativ resilient)',
        },
      },
      {
        label: { en: 'Fiction share', de: 'Anteil Belletristik' },
        value: {
          en: '~38.1% of sales (source: growing category)',
          de: 'ca. 38,1 % der Verkäufe (Quelle: wachsende Kategorie)',
        },
      },
      {
        label: { en: 'Children’s & YA share', de: 'Anteil Kinder & Jugend' },
        value: {
          en: '~11.3% of sales (source: ~flat / holding in a declining market)',
          de: 'ca. 11,3 % der Verkäufe (Quelle: flach / hält in rückläufigem Markt)',
        },
      },
    ],
    meaning: {
      en: 'Children’s books look structurally resilient — defensive niche, not a guaranteed boom.',
      de: 'Kinderbücher wirken strukturell resilient — defensives Segment, kein garantierter Boom.',
    },
  },
  languageCompare: {
    source: { en: 'PublishDrive notes (Sep 2026 context)', de: 'PublishDrive-Notizen (Kontext Sep 2026)' },
    verifiedNote: {
      en: '⚠ Re-check PublishDrive / your own KDP reports. Base-effect caveat applies to German % growth.',
      de: '⚠ PublishDrive / eigene KDP-Reports prüfen. Basiseffekt-Caveat gilt für DE-%-Wachstum.',
    },
    rows: [
      {
        metric: { en: 'Indie KDP revenue growth (cited)', de: 'Indie-KDP-Umsatzwachstum (genannt)' },
        german: { en: '~+101%', de: 'ca. +101 %' },
        english: { en: '~+33%', de: 'ca. +33 %' },
      },
      {
        metric: { en: 'New titles (2025 note)', de: 'Neue Titel (2025-Notiz)' },
        german: { en: '~+27% more', de: 'ca. +27 % mehr' },
        english: { en: 'Baseline', de: 'Baseline' },
      },
      {
        metric: { en: 'Platform reach', de: 'Plattform-Reichweite' },
        german: {
          en: 'Global + domestic DE (Tolino, Libreka, libraries…)',
          de: 'Global + DE inland (Tolino, Libreka, Bibliotheken…)',
        },
        english: {
          en: 'Mostly global (Amazon, Kobo…)',
          de: 'Meist global (Amazon, Kobo…)',
        },
      },
    ],
  },
  childrenStructure: {
    source: { en: 'Statista / trade structure notes 2024–2026', de: 'Statista- / Handelsstruktur-Notizen 2024–2026' },
    bullets: {
      en: [
        'Children’s books (to ~age 11) are the largest slice within children’s & YA',
        'Picture books are a major segment within children’s & YA',
        'Children’s & YA is #2 product group in DE book trade after fiction',
        'Top traditional kids publishers cited: Carlsen, Ravensburger, Oettinger — all German-language — infrastructure is DE-first',
      ],
      de: [
        'Kinderbücher (bis ca. 11) sind der größte Slice innerhalb Kinder & Jugend',
        'Bilderbücher sind ein großes Segment innerhalb Kinder & Jugend',
        'Kinder & Jugend ist #2 Produktgruppe im DE-Buchhandel nach Belletristik',
        'Genannte Traditionsverlage: Carlsen, Ravensburger, Oettinger — alle DE — Infrastruktur ist DE-first',
      ],
    },
  },
  audiobook: {
    claim: {
      en: 'Source (Börsenverein notes): audiobook turnover ~+13.2% in 2025 — among fastest-growing formats; physical often flat/down.',
      de: 'Quelle (Börsenverein-Notizen): Hörbuch-Umsatz ca. +13,2 % in 2025 — unter den am schnellsten wachsenden Formaten; Print oft flach/rückläufig.',
    },
    kidsAngle: {
      en: 'Read-aloud / audio add-ons for German picture books are an emerging upside — after the print/ebook title exists (ACX / DE audio paths).',
      de: 'Vorlese-/Audio-Add-ons für DE-Bilderbücher sind ein aufkommendes Upside — nach dem Print/E-Book-Titel (ACX / DE-Audio-Wege).',
    },
    verifiedNote: {
      en: '⚠ Confirm current Börsenverein audio figures and KDP/ACX rules for kids audio.',
      de: '⚠ Aktuelle Börsenverein-Audio-Zahlen und KDP/ACX-Regeln für Kinder-Audio prüfen.',
    },
  },
  tweenRisk: {
    claim: {
      en: 'Source: consumers aged 10–15 cited ~−30.6% — sharpest demographic decline in DE book market notes.',
      de: 'Quelle: Konsument:innen 10–15 ca. −30,6 % — schärfster demografischer Rückgang in DE-Buchmarkt-Notizen.',
    },
    meaning: {
      en: 'Tween/teen focus is high risk. Preschool/picture books (parent-purchased, ages ~1–6) are insulated from that child-choice screen shift.',
      de: 'Tween/Teen-Fokus ist Hochrisiko. Vorschul-/Bilderbücher (Elternkauf, Alter ca. 1–6) sind von diesem Screen-Shift eher entkoppelt.',
    },
    verifiedNote: {
      en: '⚠ Verify current Börsenverein demographic tables.',
      de: '⚠ Aktuelle Börsenverein-Demografie-Tabellen prüfen.',
    },
  },
  bilingual: {
    noHardData: {
      en: 'No large public dataset on bilingual DE/EN kids KDP performance — do not invent precise ROI numbers.',
      de: 'Kein großes öffentliches Dataset zu bilingualem DE/EN-Kinder-KDP — keine präzisen ROI-Zahlen erfinden.',
    },
    structuralLogic: {
      en: [
        'Destatis-scale notes often cite on the order of ~170k English-speaking residents/expats in Germany — verify current Destatis',
        'Early English education is a priority for many middle-class DE families',
        'Bilingual can support premium pricing with lower listing density — validate yourself',
        'Industry signal: some major illustrators publish bilingual series (e.g. Monsieur Roscoe-type formats) — anecdote, not proof',
      ],
      de: [
        'Destatis-Skala-Notizen nennen oft Größenordnung ca. 170k englischsprachige Residents/Expats in DE — aktuelle Destatis prüfen',
        'Frühes Englisch ist für viele bildungsnahe DE-Familien Priorität',
        'Bilingual kann Premium-Preise bei geringerer Listing-Dichte tragen — selbst validieren',
        'Branchen-Signal: manche Illustrator:innen machen bilinguale Serien (z. B. Monsieur-Roscoe-Formate) — Anekdote, kein Beweis',
      ],
    },
  },
  strategyTable: [
    {
      strategy: { en: 'German-language first', de: 'Zuerst Deutsch' },
      support: { en: 'Strong — infrastructure favours it', de: 'Stark — Infrastruktur bevorzugt es' },
      risk: { en: 'Low', de: 'Niedrig' },
    },
    {
      strategy: { en: 'English edition second', de: 'Englisch als Zweitausgabe' },
      support: {
        en: 'Moderate — global reach; bypasses some DE ecosystems',
        de: 'Moderat — globale Reichweite; umgeht Teile des DE-Ökosystems',
      },
      risk: { en: 'Low–medium', de: 'Niedrig–mittel' },
    },
    {
      strategy: { en: 'Bilingual edition', de: 'Bilinguale Ausgabe' },
      support: {
        en: 'Structural logic sound; hard KDP data limited',
        de: 'Strukturlogik stimmig; harte KDP-Daten begrenzt',
      },
      risk: { en: 'Medium', de: 'Mittel' },
    },
    {
      strategy: { en: 'Audiobook (German)', de: 'Hörbuch (Deutsch)' },
      support: {
        en: 'Strong format growth in source notes (~+13.2%)',
        de: 'Starkes Format-Wachstum in Quellen (ca. +13,2 %)',
      },
      risk: { en: 'Low', de: 'Niedrig' },
    },
    {
      strategy: { en: 'Targeting teens/tweens', de: 'Teen/Tween als Ziel' },
      support: { en: 'Weak — demographic decline cited', de: 'Schwach — demografischer Rückgang genannt' },
      risk: { en: 'High', de: 'Hoch' },
    },
    {
      strategy: {
        en: 'Preschool / picture books',
        de: 'Vorschule / Bilderbücher',
      },
      support: {
        en: 'Strong — resilient, parent-purchased',
        de: 'Stark — resilient, Elternkauf',
      },
      risk: { en: 'Low', de: 'Niedrig' },
    },
  ],
  conclusion: {
    en: 'Data-supported sequence: publish in German first → preschool/picture segment → add German audiobook when ready → only then English or bilingual as secondary markets.',
    de: 'Datenbasierte Sequenz: zuerst auf Deutsch veröffentlichen → Vorschul-/Bilderbuch-Segment → DE-Hörbuch wenn bereit → erst dann Englisch oder bilingual als Zweitmärkte.',
  },
  links: [
    { label: 'Börsenverein', url: 'https://www.boersenverein.de/' },
    { label: 'KDP', url: 'https://kdp.amazon.com/' },
    { label: 'Destatis', url: 'https://www.destatis.de/' },
  ],
}
