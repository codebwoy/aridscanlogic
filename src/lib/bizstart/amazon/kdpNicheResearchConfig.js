/**
 * How to research KDP niches before publishing (DE-first).
 * Free methods first. BSR→sales tables and paid tools are third-party estimates — ⚠ verify.
 */

export const KDP_NICHE_RESEARCH_CONFIG = {
  lastVerified: '2026-04-11',
  sourceLabel:
    'Owner playbook: Amazon autocomplete + BSR hygiene + community validation — BSR/revenue tables are rough third-party heuristics, not Amazon official',
  independenceDisclaimer: {
    en: 'Not affiliated with Amazon, Publisher Rocket, Book Bolt, KDSpy, BookBeam, or Neolemon. BSR→sales and “€/month” examples are rough estimates that change by marketplace, season, and format — never treat them as guarantees.',
    de: 'Nicht mit Amazon, Publisher Rocket, Book Bolt, KDSpy, BookBeam oder Neolemon verbunden. BSR→Sales und „€/Monat“-Beispiele sind grobe Schätzungen (Marktplatz, Saison, Format) — nie als Garantie behandeln.',
  },
  goldenRule: {
    en: 'Research first. Write second. Most KDP failures are research failures, not creative failures.',
    de: 'Zuerst recherchieren. Dann schreiben. Die meisten KDP-Misserfolge sind Research-Fehler, keine Kreativ-Fehler.',
  },
  timeBudget: {
    en: 'Spend at least 2–3 focused hours on research before writing a single word of the manuscript.',
    de: 'Mindestens 2–3 fokussierte Stunden Research, bevor Sie ein Wort des Manuskripts schreiben.',
  },
  step1: {
    heading: {
      en: 'Step 1 — Generate niche ideas (free, ~30 min)',
      de: 'Schritt 1 — Nischen-Ideen generieren (kostenlos, ca. 30 Min.)',
    },
    methods: [
      {
        id: 'autocomplete',
        title: {
          en: 'A) Amazon autocomplete (most reliable free method)',
          de: 'A) Amazon-Autocomplete (zuverlässigste Free-Methode)',
        },
        bullets: {
          en: [
            'Open Amazon.de (or .com) in a private/incognito window so personal history does not skew suggestions',
            'Set the department to Books / Bücher',
            'Type seed phrases and record every autocomplete suggestion — each one is a real buyer query',
            'Seed examples: “bilingual children’s book ___”, “zweisprachiges Kinderbuch ___”, “children’s book about ___”, “Kinderbuch für ___”, “activity book for ___”',
          ],
          de: [
            'Amazon.de (oder .com) im privaten/Inkognito-Fenster öffnen, damit Verlauf die Vorschläge nicht verzerrt',
            'Abteilung auf Bücher setzen',
            'Seed-Phrasen tippen und jede Autocomplete-Suggestion notieren — jede ist eine echte Käufer-Suche',
            'Seed-Beispiele: „bilingual children’s book ___“, „zweisprachiges Kinderbuch ___“, „children’s book about ___“, „Kinderbuch für ___“, „activity book for ___“',
          ],
        },
      },
      {
        id: 'categories',
        title: {
          en: 'B) Amazon category browsing',
          de: 'B) Amazon-Kategorien durchstöbern',
        },
        bullets: {
          en: [
            'Books → Children’s Books → subcategories (Bücher → Kinderbücher → Unterkategorien)',
            'Scan Top 100 bestsellers in each subcategory; note repeated themes (farm animals, bedtime, self-confidence, bilingual…)',
            'Open ~20 top books in tabs; record BSR, review count, price, and publish year',
          ],
          de: [
            'Bücher → Kinderbücher → Unterkategorien',
            'Top-100-Bestseller je Unterkategorie scannen; wiederkehrende Themen notieren (Bauernhof, Gute Nacht, Selbstvertrauen, bilingual…)',
            'Ca. 20 Top-Bücher in Tabs öffnen; BSR, Reviews, Preis und Erscheinungsjahr notieren',
          ],
        },
      },
      {
        id: 'community',
        title: {
          en: 'C) Community validation (especially diaspora / niche languages)',
          de: 'C) Community-Validierung (besonders Diaspora / Nischensprachen)',
        },
        bullets: {
          en: [
            'Post in relevant Facebook / WhatsApp groups in Germany before you create anything',
            'Example: “Would you buy a Twi–German or Igbo–German children’s picture book for your child?”',
            'Real replies = demand signal before you invest creation time',
          ],
          de: [
            'In relevanten Facebook-/WhatsApp-Gruppen in DE posten, bevor Sie etwas erstellen',
            'Beispiel: „Würden Sie ein Twi–deutsches oder Igbo–deutsches Kinderbilderbuch für Ihr Kind kaufen?“',
            'Echte Antworten = Demand-Signal, bevor Sie Erstellungszeit investieren',
          ],
        },
      },
    ],
  },
  step2: {
    heading: {
      en: 'Step 2 — Validate demand (3-point BSR check)',
      de: 'Schritt 2 — Demand validieren (3-Punkt-BSR-Check)',
    },
    intro: {
      en: 'For any niche, open the top ~10 books and apply these three filters:',
      de: 'Für jede Nische die Top ~10 Bücher öffnen und diese drei Filter anwenden:',
    },
    howBsr: {
      en: 'Find BSR: book detail page → Product details / Produktinformation → Best Sellers Rank / Bestseller-Rang.',
      de: 'BSR finden: Detailseite → Produktinformation → Bestseller-Rang.',
    },
    rows: [
      {
        id: 'bsr',
        check: { en: 'BSR under ~300,000', de: 'BSR unter ca. 300.000' },
        lookFor: {
          en: 'At least 3–5 of the top 10 have BSR below ~300k',
          de: 'Mindestens 3–5 der Top 10 haben BSR unter ca. 300k',
        },
        why: {
          en: 'Rough signal of ongoing sales (marketplace-dependent; verify live)',
          de: 'Grobes Signal für laufende Sales (marktplatzabhängig; live prüfen)',
        },
      },
      {
        id: 'reviews',
        check: { en: 'Review count gap', de: 'Review-Lücke' },
        lookFor: {
          en: 'Some top-10 books have under ~200 reviews',
          de: 'Einige Top-10-Bücher haben unter ca. 200 Reviews',
        },
        why: {
          en: 'If every leader has 2,000+ reviews, a new publisher rarely breaks in soon',
          de: 'Wenn jede Führung 2.000+ Reviews hat, bricht ein neuer Publisher selten bald ein',
        },
      },
      {
        id: 'recent',
        check: { en: 'Recent new entries', de: 'Neue Einträge' },
        lookFor: {
          en: '1–2 books published in the last 12–18 months still ranking well',
          de: '1–2 Bücher der letzten 12–18 Monate ranken noch gut',
        },
        why: {
          en: 'Shows the market is still active, not exhausted',
          de: 'Zeigt: Markt noch aktiv, nicht ausgelaugt',
        },
      },
    ],
    note: {
      en: '⚠ BSR thresholds are coaching heuristics, not Amazon policy. Compare within the same marketplace (.de vs .com).',
      de: '⚠ BSR-Schwellen sind Coaching-Heuristiken, keine Amazon-Policy. Innerhalb desselben Marktplatzes vergleichen (.de vs. .com).',
    },
  },
  step3: {
    heading: {
      en: 'Step 3 — BSR → rough revenue (estimate only)',
      de: 'Schritt 3 — BSR → grobe Revenue (nur Schätzung)',
    },
    intro: {
      en: 'After demand looks real, rough third-party heuristics often map paperback BSR to monthly sales like this — treat as order-of-magnitude only:',
      de: 'Wenn Demand real wirkt, mappen Drittanbieter-Heuristiken Paperback-BSR oft so auf monatliche Sales — nur Größenordnung:',
    },
    rows: [
      {
        bsr: { en: 'Under 10,000', de: 'Unter 10.000' },
        sales: { en: '~300+ copies/month (very rough)', de: 'ca. 300+ Exemplare/Monat (sehr grob)' },
      },
      {
        bsr: { en: '10,000 – 50,000', de: '10.000 – 50.000' },
        sales: { en: '~30–150 copies/month', de: 'ca. 30–150 Exemplare/Monat' },
      },
      {
        bsr: { en: '50,000 – 100,000', de: '50.000 – 100.000' },
        sales: { en: '~10–30 copies/month', de: 'ca. 10–30 Exemplare/Monat' },
      },
      {
        bsr: { en: '100,000 – 300,000', de: '100.000 – 300.000' },
        sales: { en: '~3–10 copies/month', de: 'ca. 3–10 Exemplare/Monat' },
      },
      {
        bsr: { en: 'Over 300,000', de: 'Über 300.000' },
        sales: { en: '~0–2 copies/month', de: 'ca. 0–2 Exemplare/Monat' },
      },
    ],
    royaltyNote: {
      en: '⚠ Example only: a €9.99 paperback might net roughly €2.50–€3.50 after print — use the live KDP calculator for your trim/ink/page count. “BSR 50k ≈ €25–€105/month” is an illustration, not a forecast. Royalties compound across titles only if each listing actually sells.',
      de: '⚠ Nur Beispiel: ein Paperback zu 9,99 € kann nach Druck grob 2,50–3,50 € netto bringen — Live-KDP-Rechner für Trim/Farbe/Seitenzahl nutzen. „BSR 50k ≈ 25–105 €/Monat“ ist Illustration, keine Prognose. Royalties compounden über Titel nur, wenn jedes Listing wirklich verkauft.',
    },
  },
  step4: {
    heading: {
      en: 'Step 4 — Competition scoring (can you win?)',
      de: 'Schritt 4 — Konkurrenz-Scoring (können Sie gewinnen?)',
    },
    lights: [
      {
        id: 'green',
        label: { en: 'Green light — publish', de: 'Grün — publishen' },
        bullets: {
          en: [
            'Multiple books with BSR under ~300k',
            'Several results with under ~200 reviews',
            'Covers look amateurish or generic (you can out-design them)',
            'Many leaders last updated 2–3+ years ago',
          ],
          de: [
            'Mehrere Bücher mit BSR unter ca. 300k',
            'Mehrere Treffer mit unter ca. 200 Reviews',
            'Cover wirken amateurhaft oder generisch (Sie können besser designen)',
            'Viele Führende zuletzt vor 2–3+ Jahren aktualisiert',
          ],
        },
      },
      {
        id: 'yellow',
        label: { en: 'Yellow light — proceed carefully', de: 'Gelb — vorsichtig weiter' },
        bullets: {
          en: [
            'Top books have ~200–500 reviews',
            'Mix of established and newer titles',
            'You need a strong hook or clear differentiation',
          ],
          de: [
            'Top-Bücher haben ca. 200–500 Reviews',
            'Mix aus etablierten und neueren Titeln',
            'Sie brauchen einen starken Hook oder klare Differenzierung',
          ],
        },
      },
      {
        id: 'red',
        label: { en: 'Red light — avoid (for now)', de: 'Rot — vorerst meiden' },
        bullets: {
          en: [
            'Every top-10 book has 500+ reviews',
            'Well-known traditional publishers dominate results',
            'Ads look expensive and clicks do not convert for weak listings',
          ],
          de: [
            'Jedes Top-10-Buch hat 500+ Reviews',
            'Bekannte Traditionsverlage dominieren die Treffer',
            'Ads wirken teuer und Klicks konvertieren bei schwachen Listings nicht',
          ],
        },
      },
    ],
  },
  step5: {
    heading: {
      en: 'Step 5 — Keyword research (how buyers search)',
      de: 'Schritt 5 — Keyword-Research (wie Käufer suchen)',
    },
    freeMethods: {
      en: [
        'Amazon autocomplete — record exact phrases buyers type',
        '“Customers also bought” / “Kunden kauften auch” — adjacent niches and clusters',
        'Also-viewed / frequently bought together for theme language',
      ],
      de: [
        'Amazon-Autocomplete — exakte Phrasen notieren, die Käufer tippen',
        '„Kunden kauften auch“ — angrenzende Nischen und Cluster',
        'Auch angesehen / häufig zusammen gekauft für Themen-Sprache',
      ],
    },
    bilingualPatterns: {
      heading: {
        en: 'Bilingual / heritage keyword patterns',
        de: 'Bilingual- / Heritage-Keyword-Muster',
      },
      bullets: {
        en: [
          '“bilingual children’s book [Language 1] [Language 2]”',
          '“zweisprachiges Kinderbuch [Sprache]”',
          '“[Language] German picture book” / “[Sprache] Deutsch Bilderbuch”',
          '“heritage language children’s book”',
          '“[community] children’s book Germany” / “[Community] Kinderbuch Deutschland”',
        ],
        de: [
          '„bilingual children’s book [Language 1] [Language 2]“',
          '„zweisprachiges Kinderbuch [Sprache]“',
          '„[Language] German picture book“ / „[Sprache] Deutsch Bilderbuch“',
          '„heritage language children’s book“',
          '„[community] children’s book Germany“ / „[Community] Kinderbuch Deutschland“',
        ],
      },
    },
    paidNote: {
      en: '⚠ Paid keyword tools (Publisher Rocket ~one-time fee, Book Bolt subscriptions, KDSpy extensions, BookBeam free tiers) may show search volumes and competition scores — treat as estimates; they often upsell. Free autocomplete + live SERP still come first.',
      de: '⚠ Bezahlte Keyword-Tools (Publisher Rocket ~Einmalpreis, Book-Bolt-Abos, KDSpy-Extensions, BookBeam Free-Tiers) können Suchvolumen und Konkurrenz-Scores zeigen — als Schätzungen behandeln; oft Upsells. Free Autocomplete + Live-SERP kommen zuerst.',
    },
  },
  step6: {
    heading: {
      en: 'Step 6 — Cover audit (visual competitiveness)',
      de: 'Schritt 6 — Cover-Audit (visuelle Konkurrenzfähigkeit)',
    },
    bullets: {
      en: [
        'Search your niche keyword and look at the results page at phone thumbnail size',
        'Ask: professional or amateur? Does your cover stand out tiny? Is the title readable small?',
        'If existing covers look weak, a clean professional cover becomes a conversion edge',
        '⚠ AI illustration pipelines / third-party art services vary — keep rights, disclosure, and style consistency clear (StoryForge desktop studio is one in-app path)',
      ],
      de: [
        'Nischen-Keyword suchen und Ergebnisse in Handy-Thumbnail-Größe ansehen',
        'Fragen: professionell oder amateurhaft? Sticht Ihr Cover winzig heraus? Ist der Titel klein lesbar?',
        'Wenn bestehende Cover schwach wirken, wird ein sauberes Profi-Cover zum Conversion-Vorteil',
        '⚠ KI-Illustrations-Pipelines / Drittanbieter-Art-Services variieren — Rechte, Disclosure und Stil-Konsistenz klären (StoryForge Desktop-Studio ist ein In-App-Pfad)',
      ],
    },
  },
  toolsTable: {
    heading: {
      en: 'Free vs paid research tools',
      de: 'Kostenlose vs. bezahlte Research-Tools',
    },
    rows: [
      {
        tool: { en: 'Amazon autocomplete', de: 'Amazon-Autocomplete' },
        cost: { en: 'Free', de: 'Kostenlos' },
        bestFor: { en: 'Keyword discovery', de: 'Keyword-Entdeckung' },
      },
      {
        tool: { en: 'Amazon BSR (detail page)', de: 'Amazon BSR (Detailseite)' },
        cost: { en: 'Free', de: 'Kostenlos' },
        bestFor: { en: 'Demand validation', de: 'Demand-Validierung' },
      },
      {
        tool: { en: 'Google Trends', de: 'Google Trends' },
        cost: { en: 'Free', de: 'Kostenlos' },
        bestFor: {
          en: 'Seasonal timing (back to school, holidays)',
          de: 'Saisonales Timing (Schulanfang, Feiertage)',
        },
      },
      {
        tool: { en: 'BookBeam (free tier)', de: 'BookBeam (Free-Tier)' },
        cost: { en: 'Free tier ⚠', de: 'Free-Tier ⚠' },
        bestFor: {
          en: 'Optional BSR / multi-marketplace views — verify claims',
          de: 'Optionale BSR- / Multi-Marketplace-Views — Claims prüfen',
        },
      },
      {
        tool: { en: 'Publisher Rocket', de: 'Publisher Rocket' },
        cost: { en: '~one-time fee ⚠', de: '~Einmalpreis ⚠' },
        bestFor: {
          en: 'Optional deep keyword volumes — upsell risk',
          de: 'Optional tiefe Keyword-Volumen — Upsell-Risiko',
        },
      },
      {
        tool: { en: 'Book Bolt / KDSpy', de: 'Book Bolt / KDSpy' },
        cost: { en: 'Paid ⚠', de: 'Bezahlt ⚠' },
        bestFor: {
          en: 'Optional low-content / browser BSR helpers — not required',
          de: 'Optionale Low-Content- / Browser-BSR-Helfer — nicht nötig',
        },
      },
    ],
  },
  bilingualWorkflow: {
    heading: {
      en: 'Applied workflow — bilingual + Germany',
      de: 'Angewandter Workflow — bilingual + Deutschland',
    },
    bullets: {
      en: [
        'Amazon.de → Books → search “zweisprachiges Kinderbuch Twi” or “bilingual Igbo German”',
        'Record result count and BSRs of anything that appears',
        'Near-zero results = unproven + low competition — validate in diaspora groups before creating',
        'Check Google Trends (Germany) for related terms; sparse data is normal for ultra-niche pairs',
        'If community validation is positive, proceed as a careful first mover',
        'Target keywords in both languages (e.g. “Twi German bilingual book”, “zweisprachiges Kinderbuch Ghana”, “Igbo Deutsch Kinderbuch”)',
        'Cross-check Amazon Hub → Language & market → bilingual children’s books module',
      ],
      de: [
        'Amazon.de → Bücher → „zweisprachiges Kinderbuch Twi“ oder „bilingual Igbo German“ suchen',
        'Trefferzahl und BSRs notieren',
        'Nahezu null Treffer = unbewiesen + wenig Konkurrenz — in Diaspora-Gruppen validieren vor dem Erstellen',
        'Google Trends (Deutschland) für verwandte Begriffe prüfen; dünne Daten sind bei Ultra-Nischen normal',
        'Bei positiver Community-Validierung vorsichtig als First Mover starten',
        'Keywords in beiden Sprachen (z. B. „Twi German bilingual book“, „zweisprachiges Kinderbuch Ghana“, „Igbo Deutsch Kinderbuch“)',
        'Gegenprüfen: Amazon Hub → Sprache & Markt → Modul bilinguale Kinderbücher',
      ],
    },
  },
  studyGuides: {
    heading: {
      en: 'Optional study guides (not required)',
      de: 'Optionale Studien-Guides (nicht nötig)',
    },
    note: {
      en: '⚠ Amazon book links and star counts change. Prefer free methods above. If you buy a guide, verify live ratings and ignore income hype.',
      de: '⚠ Amazon-Buchlinks und Sterne ändern sich. Free-Methoden oben bevorzugen. Wenn Sie einen Guide kaufen: Live-Ratings prüfen, Einkommens-Hype ignorieren.',
    },
    bullets: {
      en: [
        'English KDP strategy / launch / ads guides — useful for mechanics; ratings vary',
        'German-language KDP beginner guides on Amazon.de — helpful for DE-specific wording',
        'Niche/keyword research journals or worksheets — only if you like paper tracking; a simple spreadsheet is enough',
        'AI + children’s book KDP guides — check current Amazon AI disclosure rules yourself',
      ],
      de: [
        'Englische KDP-Strategie-/Launch-/Ads-Guides — nützlich für Mechanik; Ratings variieren',
        'Deutschsprachige KDP-Einsteiger-Guides auf Amazon.de — hilfreich für DE-Wortlaut',
        'Nischen-/Keyword-Research-Journale — nur wenn Sie Papier mögen; ein einfaches Spreadsheet reicht',
        'KI + Kinderbuch-KDP-Guides — aktuelle Amazon-KI-Disclosure-Regeln selbst prüfen',
      ],
    },
  },
  takeaway: {
    en: 'Free stack that works today: Amazon.de autocomplete + Top-100 category scan + 3-point BSR check + cover thumbnail audit + (for diaspora niches) Facebook/WhatsApp validation. Paid tools are optional polish, not a prerequisite.',
    de: 'Free-Stack, der heute funktioniert: Amazon.de-Autocomplete + Top-100-Kategorie-Scan + 3-Punkt-BSR-Check + Cover-Thumbnail-Audit + (bei Diaspora-Nischen) Facebook-/WhatsApp-Validierung. Bezahlte Tools sind optionaler Feinschliff, keine Voraussetzung.',
  },
  links: [
    {
      label: 'Amazon.de — Bücher suchen',
      url: 'https://www.amazon.de/s?i=stripbooks&k=Kinderbuch',
    },
    {
      label: 'Amazon.de — zweisprachiges Kinderbuch',
      url: 'https://www.amazon.de/s?k=zweisprachiges+Kinderbuch',
    },
    {
      label: 'Google Trends',
      url: 'https://trends.google.com/trends/?geo=DE',
    },
    { label: 'KDP', url: 'https://kdp.amazon.com/' },
  ],
}
