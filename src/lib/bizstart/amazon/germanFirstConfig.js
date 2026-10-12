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
        'You can upload directly to DE platforms: Tolino Media, BoD, epubli, tredition — see DACH upload platforms below',
        'German reaches global + domestic DE ecosystems; English often reaches global platforms only (Amazon, Kobo) for DE buyers',
        'Schools, libraries, and institutional buyers overwhelmingly purchase German-language kids content',
      ],
      de: [
        'Inlandsplattformen (Tolino, Libreka, Bibliotheken) bevorzugen DE-Inhalt in der Entdeckung',
        'Direkt-Upload auf DE-Plattformen möglich: Tolino Media, BoD, epubli, tredition — siehe DACH-Upload-Plattformen unten',
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
          'EN/FR/ES/TR/AR↔DE show live catalogue proof; African-language↔DE pairs are often empty — first-mover or unproven (see bilingual kids module)',
          '⚠ Always validate on Amazon.de + community groups before printing; no ROI guarantees',
        ],
        de: [
          'Zielgruppe: Expats in DE, DE-Familien mit frühem EN-Input, internationale Schulen',
          'Differenzierung mit oft geringerer Konkurrenzdichte auf Amazon.de',
          'EN/FR/ES/TR/AR↔DE zeigen Live-Katalog-Belege; afrikanische Sprachen↔DE oft leer — First-Mover oder unbewiesen (siehe Bilingual-Kids-Modul)',
          '⚠ Immer auf Amazon.de + in Community-Gruppen validieren vor dem Druck; keine ROI-Garantien',
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
  /** Direct upload platforms for DE/AT/CH readers beyond Amazon KDP. */
  dachUploadPlatforms: {
    lastVerified: '2026-10-12',
    intro: {
      en: 'Yes — Germany has strong domestic self-publishing platforms. DACH (Germany, Austria, Switzerland) has a massive ecosystem independent of Amazon. Reach Thalia, Hugendubel, Weltbild, and Tolino e-reader users who never shop Kindle. Keep KDP Select OFF for the same ebook.',
      de: 'Ja — Deutschland hat starke heimische Selfpublishing-Plattformen. DACH (DE, AT, CH) hat ein großes Ökosystem unabhängig von Amazon. Erreichen Sie Thalia, Hugendubel, Weltbild und Tolino-Nutzer:innen, die nie Kindle kaufen. KDP Select für dasselbe E-Book AUS.',
    },
    verifiedNote: {
      en: '⚠ Fees, royalty %, ISBN ownership, VLB listing, and exclusivity change — confirm on each site. If a platform also distributes to Amazon, do not double-list the same ebook via KDP. Add an Impressum for DE editions (Pressegesetz) — platforms often supply templates.',
      de: '⚠ Gebühren, Royalty-%, ISBN, VLB und Exklusivität ändern sich — auf jeder Site bestätigen. Wenn eine Plattform auch zu Amazon liefert: dasselbe E-Book nicht doppelt über KDP listen. Impressum für DE-Ausgaben (Pressegesetz) — Plattformen liefern oft Vorlagen.',
    },
    platforms: [
      {
        id: 'tolino_media',
        name: 'Tolino Media',
        url: 'https://www.tolino-media.de/',
        format: { en: 'Ebook + audiobook (+ print option)', de: 'E-Book + Hörbuch (+ Print-Option)' },
        reach: {
          en: 'Tolino Alliance: Thalia, Hugendubel, Osiander, Weltbild + Deutsche Telekom; Tolino e-readers; DE public libraries',
          de: 'Tolino-Allianz: Thalia, Hugendubel, Osiander, Weltbild + Deutsche Telekom; Tolino-E-Reader; DE-Öffentliche Bibliotheken',
        },
        beginnerNote: {
          en: 'Main Kindle rival in DE. Free ebook upload; royalties often cited up to ~87% of net sales depending on price (verify live). Best first DE ebook path after non-Select KDP — reaches readers who never use Amazon.',
          de: 'Hauptkonkurrent zu Kindle in DE. E-Book-Upload gratis; Royalties oft bis ca. 87 % vom Nettoverkauf je nach Preis (live prüfen). Bester erster DE-E-Book-Pfad nach Non-Select-KDP — erreicht Leser:innen, die nie Amazon nutzen.',
        },
      },
      {
        id: 'bod',
        name: 'BoD (Books on Demand)',
        url: 'https://www.bod.de/',
        format: { en: 'Print (paperback/hardcover) + ebook', de: 'Print (Paperback/Hardcover) + E-Book' },
        reach: {
          en: 'Hamburg HQ — Europe’s POD pioneer; DE/AT/CH bookstores via ISBN + Verzeichnis Lieferbarer Bücher (VLB) — any local shop can order',
          de: 'Sitz Hamburg — Europas POD-Pionier; DE/AT/CH-Buchhandel via ISBN + Verzeichnis Lieferbarer Bücher (VLB) — jede lokale Buchhandlung kann bestellen',
        },
        beginnerNote: {
          en: 'Ebook often free; print setup often ~€19–€39 for cataloging and physical distribution — verify live packages.',
          de: 'E-Book oft gratis; Print-Setup oft ca. 19–39 € für Katalogisierung und physische Distribution — Live-Pakete prüfen.',
        },
      },
      {
        id: 'epubli',
        name: 'epubli',
        url: 'https://www.epubli.de/',
        format: { en: 'Print-on-demand + ebook', de: 'Print-on-Demand + E-Book' },
        reach: {
          en: 'Holtzbrinck Publishing Group (Berlin) — Tolino, Amazon, Apple Books, Google Play, local German online shops + VLB for stores',
          de: 'Holtzbrinck Publishing Group (Berlin) — Tolino, Amazon, Apple Books, Google Play, lokale DE-Online-Shops + VLB für Läden',
        },
        beginnerNote: {
          en: 'Ebook publishing completely free (as commonly marketed); print setup starts with low pay-per-project options. Avoid double Amazon listing if epubli already pushes to Amazon.',
          de: 'E-Book-Publish oft komplett gratis vermarktet; Print-Setup mit günstigen Pay-per-Project-Optionen. Kein Doppel-Amazon-Listing, wenn epubli schon zu Amazon liefert.',
        },
      },
      {
        id: 'bookrix',
        name: 'BookRix',
        url: 'https://www.bookrix.de/',
        format: { en: 'Primarily ebook (+ community)', de: 'Vor allem E-Book (+ Community)' },
        reach: {
          en: 'Munich — one of DE’s oldest digital self-pub platforms; Thalia, Hugendubel, Weltbild, Apple Books, Kobo, Amazon (upload once)',
          de: 'München — eine der ältesten digitalen Selfpub-Plattformen in DE; Thalia, Hugendubel, Weltbild, Apple Books, Kobo, Amazon (einmal hochladen)',
        },
        beginnerNote: {
          en: 'Free setup; small commission on ebook sales royalties — verify share. Same Amazon double-list caution.',
          de: 'Setup gratis; kleine Kommission auf E-Book-Royalties — Anteil prüfen. Gleiche Amazon-Doppel-Listungs-Vorsicht.',
        },
      },
      {
        id: 'tredition',
        name: 'tredition',
        url: 'https://tredition.de/',
        format: { en: 'Print + ebook', de: 'Print + E-Book' },
        reach: {
          en: 'Independent DE self-pub; bookstore distribution options',
          de: 'Unabhängiges DE-Selfpub; Buchhandelsoptionen',
        },
        beginnerNote: {
          en: 'Often free to publish; read exclusivity before parallel KDP/Tolino.',
          de: 'Oft kostenloses Publish; Exklusivität vor parallelem KDP/Tolino lesen.',
        },
      },
    ],
    wideFit: [
      {
        label: { en: 'Amazon KDP (non-exclusive)', de: 'Amazon KDP (nicht-exklusiv)' },
        detail: {
          en: 'What it covers: Amazon.de. Key benefit in Germany: reaches Amazon Kindle and Prime readers.',
          de: 'Abdeckung: Amazon.de. Vorteil in DE: erreicht Amazon-Kindle- und Prime-Leser:innen.',
        },
      },
      {
        label: { en: 'Tolino Media OR Draft2Digital', de: 'Tolino Media ODER Draft2Digital' },
        detail: {
          en: 'What it covers: Thalia, Hugendubel, Weltbild, Kobo, Apple. Key benefit: captures non-Amazon ebook readers across Germany.',
          de: 'Abdeckung: Thalia, Hugendubel, Weltbild, Kobo, Apple. Vorteil: Nicht-Amazon-E-Book-Leser:innen in ganz DE.',
        },
      },
      {
        label: { en: 'BoD OR IngramSpark', de: 'BoD ODER IngramSpark' },
        detail: {
          en: 'What it covers: VLB catalog, German physical bookstores. Key benefit: allows local brick-and-mortar bookstores to order physical print copies.',
          de: 'Abdeckung: VLB-Katalog, physische DE-Buchhandlungen. Vorteil: lokale Buchhandlungen können physische Print-Exemplare bestellen.',
        },
      },
    ],
    impressumTip: {
      en: 'Pro-tip for German regulations: if you publish on German-focused platforms (Tolino Media, BoD, epubli, BookRix) or direct-sell to German readers, ensure book metadata includes an Impressum (legal publisher info page) as required under German media law (Pressegesetz). Most platforms like Tolino Media provide built-in tools or templates to create a compliant Impressum during upload — ⚠ verify with a qualified advisor.',
      de: 'Pro-Tipp für DE-Recht: bei deutschen Plattformen (Tolino Media, BoD, epubli, BookRix) oder Direktverkauf an DE-Leser:innen Impressum (rechtliche Verlagsangaben) in den Metadaten — laut Pressegesetz. Die meisten Plattformen wie Tolino Media liefern Tools/Vorlagen beim Upload — ⚠ mit Fachperson prüfen.',
    },
    /** Legal / tax / file rules when uploading to DE domestic platforms (beyond Amazon KDP). */
    domesticRequirements: {
      intro: {
        en: 'BoD, Tolino Media, epubli, and BookRix operate out of Germany — they follow German publishing law, tax, and commercial rules more strictly than typical US/global platforms.',
        de: 'BoD, Tolino Media, epubli und BookRix sitzen in DE — sie folgen deutschem Verlags-, Steuer- und Handelsrecht strenger als typische US-/globale Plattformen.',
      },
      verifiedNote: {
        en: '⚠ Not legal/tax advice. Confirm Pressegesetz, Buchpreisbindung, UStG § 19, SEPA payouts, and DNB Pflichtexemplare for your case.',
        de: '⚠ Keine Rechts-/Steuerberatung. Pressegesetz, Buchpreisbindung, UStG § 19, SEPA-Auszahlungen und DNB-Pflichtexemplare für Ihren Fall prüfen.',
      },
      impressum: {
        en: [
          'Mandatory Impressum with a valid physical address under Pressegesetz',
          'Without a publisher address you may have to print your personal home address',
          'BoD / Tolino Media ISBN: they often act as publisher of record — you may list their company address (keeps home address private; verify terms)',
          'Own ISBN: your business address or a recognized German Impressum-Service (proxy)',
        ],
        de: [
          'Pflicht-Impressum mit gültiger physischer Adresse laut Pressegesetz',
          'Ohne Verlagsadresse ggf. private Wohnadresse im Buch',
          'BoD-/Tolino-Media-ISBN: oft Verleger — Firmenadresse listen möglich (Privatadresse privat; AGB prüfen)',
          'Eigene ISBN: Geschäftsadresse oder anerkannter Impressum-Service',
        ],
      },
      buchpreisbindung: {
        en: [
          'Buchpreisbindung: same format = same retail price across stores',
          'Example: €4.99 on Amazon.de must also be €4.99 on Tolino, Thalia, Hugendubel, and Apple Books',
          'Discounting on one shop while full price on another is illegal in the German market (⚠ verify print vs ebook nuances)',
        ],
        de: [
          'Buchpreisbindung: gleiches Format = gleicher Ladenpreis über Shops',
          'Beispiel: 4,99 € auf Amazon.de auch 4,99 € auf Tolino, Thalia, Hugendubel und Apple Books',
          'Rabatt in einem Shop bei Vollpreis in einem anderen ist unzulässig (⚠ Print- vs E-Book-Nuancen prüfen)',
        ],
      },
      accountAdmin: {
        en: [
          'Valid passport / national ID for verification',
          'SEPA IBAN for EUR payouts',
          'Steuernummer or Umsatzsteuer-ID (USt-IdNr.) as Freiberufler (own books — typically no Gewerbe; see author tax registration below)',
          'Kleinunternehmer (§ 19 UStG): check “no VAT charged” when eligible',
          'Non-DE residents: Reverse Charge with home-country TIN / VAT ID',
        ],
        de: [
          'Gültiger Reisepass / Personalausweis',
          'SEPA-IBAN für EUR-Auszahlungen',
          'Steuernummer oder Umsatzsteuer-ID (USt-IdNr.) als Freiberufler (eigene Bücher — typisch kein Gewerbe; siehe Steueranmeldung unten)',
          'Kleinunternehmer (§ 19 UStG): „keine USt“ wenn berechtigt',
          'Nicht-DE: Reverse Charge mit TIN / USt-ID des Heimatlandes',
        ],
      },
      filesDeposit: {
        en: [
          'Ebooks: reflowable .epub only — not .kfx / .mobi',
          'Print (BoD & epubli): high-res .pdf interior (fonts embedded) + wrap cover .pdf (Front + Spine + Back) with precise bleed',
          'Pflichtexemplare: ISBN titles must be archived at Deutsche Nationalbibliothek (DNB) + regional state library',
          'BoD / Tolino Media usually file deposit copies and DNB cataloging for you (verify)',
        ],
        de: [
          'E-Books: nur reflowable .epub — nicht .kfx / .mobi',
          'Print (BoD & epubli): hochauflösendes .pdf-Innenteil (Schriften eingebettet) + Umschlag-.pdf (Vorderseite + Rücken + Rückseite) mit präzisem Bleed',
          'Pflichtexemplare: ISBN-Titel bei Deutscher Nationalbibliothek (DNB) + Landesbibliothek',
          'BoD / Tolino Media übernehmen Ablieferung und DNB-Katalogisierung meist für Sie (prüfen)',
        ],
      },
      checklist: [
        {
          label: { en: 'Legal contact', de: 'Rechtlicher Kontakt' },
          detail: {
            en: 'Impressum inside the book (BoD/Tolino address, your address, or Impressum-Service)',
            de: 'Impressum im Buch (BoD/Tolino-Adresse, Ihre Adresse oder Impressum-Service)',
          },
        },
        {
          label: { en: 'Pricing', de: 'Preis' },
          detail: {
            en: 'Universal EUR price across platforms (Buchpreisbindung)',
            de: 'Einheitlicher EUR-Preis über Plattformen (Buchpreisbindung)',
          },
        },
        {
          label: { en: 'Banking', de: 'Banking' },
          detail: {
            en: 'IBAN for SEPA Euro payouts',
            de: 'IBAN für SEPA-Euro-Auszahlungen',
          },
        },
        {
          label: { en: 'Tax info', de: 'Steuerdaten' },
          detail: {
            en: 'Steuernummer / VAT status / Kleinunternehmer / Reverse Charge TIN',
            de: 'Steuernummer / USt-Status / Kleinunternehmer / Reverse-Charge-TIN',
          },
        },
        {
          label: { en: 'File types', de: 'Dateitypen' },
          detail: {
            en: '.epub for ebooks; .pdf for print interiors + wrap covers',
            de: '.epub für E-Books; .pdf für Print-Innenteile + Umschläge',
          },
        },
      ],
    },
    links: [
      { label: 'Tolino Media', url: 'https://www.tolino-media.de/' },
      { label: 'BoD', url: 'https://www.bod.de/' },
      { label: 'epubli', url: 'https://www.epubli.de/' },
      { label: 'BookRix', url: 'https://www.bookrix.de/' },
      { label: 'tredition', url: 'https://tredition.de/' },
      { label: 'MVB / VLB', url: 'https://www.mvb-online.de/' },
      { label: 'Deutsche Nationalbibliothek', url: 'https://www.dnb.de/' },
    ],
    beginnerStack: {
      en: [
        'Amazon KDP ebook — Select OFF',
        'Tolino Media OR Draft2Digital — non-Amazon ebook readers (Thalia / Tolino / Apple / Kobo)',
        'KDP Print (Expanded Distribution OFF) + BoD OR IngramSpark for VLB / bookstore print',
        'Impressum + one EUR price (Buchpreisbindung) + SEPA IBAN + Steuernummer / USt-IdNr.',
        'Fragebogen zur steuerlichen Erfassung as Freiberuflicher Autor (Steuer-ID alone is not enough)',
        '.epub (not .mobi) + print .pdf; confirm DNB deposit via BoD/Tolino',
        'Email list lead magnet in every edition',
        'Before publish: AI-Generated disclosure if needed, title matches cover (no Best Seller stuffing), clean 7 keywords, free vs owned ISBN, Bleed + 0.375″ margins — open Hidden pitfalls playbook',
      ],
      de: [
        'Amazon KDP E-Book — Select AUS',
        'Tolino Media ODER Draft2Digital — Nicht-Amazon-E-Book (Thalia / Tolino / Apple / Kobo)',
        'KDP Print (Expanded Distribution AUS) + BoD ODER IngramSpark für VLB / Buchhandels-Print',
        'Impressum + ein EUR-Preis (Buchpreisbindung) + SEPA-IBAN + Steuernummer / USt-IdNr.',
        'Fragebogen zur steuerlichen Erfassung als Freiberuflicher Autor (Steuer-ID allein reicht nicht)',
        '.epub (nicht .mobi) + Print-.pdf; DNB-Ablieferung über BoD/Tolino bestätigen',
        'E-Mail-Listen-Lead-Magnet in jeder Ausgabe',
        'Vor Publish: KI-generiert-Disclosure wenn nötig, Titel = Cover (kein Best-Seller-Stuffing), saubere 7 Keywords, Free vs eigene ISBN, Bleed + 0,375″ — Playbook Versteckte Fallen öffnen',
      ],
    },
  },
  /** Freiberufler tax registration for DE authors (full detail also in tax-de playbook + KDP panel). */
  authorTaxRegistration: {
    hubGuideId: 'tax-de',
    intro: {
      en: 'You do NOT need a Gewerbe to publish your own books — but personal Steuer-ID alone is NOT enough once you earn royalties.',
      de: 'Sie brauchen KEIN Gewerbe zum Veröffentlichen eigener Bücher — aber die persönliche Steuer-ID allein reicht NICHT, sobald Royalties fließen.',
    },
    verifiedNote: {
      en: '⚠ Not tax advice. Confirm Freiberufler vs Gewerbe and Kleinunternehmer thresholds with Steuerberater / Finanzamt.',
      de: '⚠ Keine Steuerberatung. Freiberufler vs Gewerbe und Kleinunternehmer-Schwellen mit Steuerberater / Finanzamt klären.',
    },
    gewerbeVsFreelance: {
      en: [
        '§ 18 EStG: writing + self-publishing your own original literary works is typically Freiberufler (freie freiberufliche Tätigkeit)',
        'No Gewerbeanmeldung while you publish own books via KDP, Tolino Media, BoD, Draft2Digital and earn Tantiemen',
        'Can become Gewerbe for bulk print + own e-commerce, merch (t-shirts, mugs), or publishing other authors',
      ],
      de: [
        '§ 18 EStG: Schreiben + Selfpublishing eigener Werke typisch Freiberufler (freie freiberufliche Tätigkeit)',
        'Keine Gewerbeanmeldung, solange eigene Bücher über KDP, Tolino Media, BoD, Draft2Digital und Tantiemen',
        'Gewerbe möglich bei Mengen-Print + eigenem Online-Shop, Merch (T-Shirts, Tassen) oder Verlag für andere',
      ],
    },
    taxNumbers: {
      en: [
        'Steuer-ID (11 digits, e.g. 12 345 678 901) — lifelong personal ID; NOT enough alone',
        'Steuernummer (e.g. 15/123/45678) — from Finanzamt after Fragebogen zur steuerlichen Erfassung',
        'Umsatzsteuer-ID / USt-IdNr. (DE + 9 digits) — request free on Fragebogen for EU Reverse Charge (KDP Luxembourg, Draft2Digital, Apple)',
      ],
      de: [
        'Steuer-ID (11 Ziffern, z. B. 12 345 678 901) — lebenslange persönliche ID; allein NICHT genug',
        'Steuernummer (z. B. 15/123/45678) — vom Finanzamt nach Fragebogen zur steuerlichen Erfassung',
        'Umsatzsteuer-ID / USt-IdNr. (DE + 9 Ziffern) — kostenlos im Fragebogen für EU-Reverse-Charge (KDP Luxemburg, Draft2Digital, Apple)',
      ],
    },
    setupSteps: {
      en: [
        'ELSTER / Accountable / Sorted: Fragebogen zur steuerlichen Erfassung — Freiberufliche Autorin / Freiberuflicher Autor + estimated income',
        'Kleinunternehmerregelung (§ 19 UStG) if eligible (older notes ~€22,000 — verify current thresholds)',
        'In ~2–4 weeks: Steuernummer + USt-IdNr. by post',
        'Enter both on Amazon KDP, Tolino Media, BoD, Draft2Digital',
      ],
      de: [
        'ELSTER / Accountable / Sorted: Fragebogen zur steuerlichen Erfassung — Freiberufliche Autorin / Freiberuflicher Autor + geschätztes Einkommen',
        'Kleinunternehmerregelung (§ 19 UStG) wenn berechtigt (ältere Notizen ~22.000 € — aktuelle Schwellen prüfen)',
        'In ca. 2–4 Wochen: Steuernummer + USt-IdNr. per Post',
        'Beide in Amazon KDP, Tolino Media, BoD, Draft2Digital eintragen',
      ],
    },
    checklist: [
      {
        label: { en: 'Gewerbe registration?', de: 'Gewerbeanmeldung?' },
        status: { en: 'Not needed', de: 'Nicht nötig' },
        detail: {
          en: 'Own-book author typically freiberuflich (§ 18 EStG)',
          de: 'Autor:in eigener Werke typisch freiberuflich (§ 18 EStG)',
        },
      },
      {
        label: { en: 'Personal Steuer-ID only?', de: 'Nur persönliche Steuer-ID?' },
        status: { en: 'Not enough', de: 'Nicht genug' },
        detail: {
          en: 'Register freelance author activity with Finanzamt',
          de: 'Freiberufliche Autorentätigkeit beim Finanzamt anmelden',
        },
      },
      {
        label: { en: 'Required tax number', de: 'Erforderliche Steuernummer' },
        status: { en: 'Steuernummer', de: 'Steuernummer' },
        detail: {
          en: 'After Fragebogen zur steuerlichen Erfassung',
          de: 'Nach Fragebogen zur steuerlichen Erfassung',
        },
      },
      {
        label: { en: 'Recommended tax ID', de: 'Empfohlene Steuer-ID' },
        status: { en: 'USt-IdNr.', de: 'USt-IdNr.' },
        detail: {
          en: 'Cross-border royalties under EU Reverse Charge',
          de: 'Grenzüberschreitende Royalties unter EU-Reverse-Charge',
        },
      },
    ],
    links: [
      { label: 'ELSTER', url: 'https://www.elster.de/' },
      { label: 'BzSt', url: 'https://www.bzst.de/' },
    ],
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
    /** Expanded research lives in bilingualKidsConfig — panel renders that module. */
    noHardData: {
      en: 'EN/FR/ES/TR/AR↔DE show Amazon.de catalogue proof; African-language↔DE pairs are often empty (first-mover or unproven). Do not invent precise ROI — see the bilingual kids module below.',
      de: 'EN/FR/ES/TR/AR↔DE zeigen Amazon.de-Katalog-Belege; afrikanische Sprachen↔DE sind oft leer (First-Mover oder unbewiesen). Keine präzisen ROI-Zahlen erfinden — siehe Bilingual-Kids-Modul unten.',
    },
    structuralLogic: {
      en: [
        'Destatis-scale notes often cite on the order of ~170k English-speaking residents/expats in Germany — verify current Destatis',
        'Early English education is a priority for many middle-class DE families',
        'Bilingual can support premium pricing with lower listing density — validate yourself',
        'Industry signal: some major illustrators publish bilingual series (e.g. Monsieur Roscoe-type formats) — anecdote, not proof',
        'Diaspora pairs (TR/AR and potentially Igbo/Twi/Swahili↔DE) add heritage-language demand beyond classic EN–DE',
      ],
      de: [
        'Destatis-Skala-Notizen nennen oft Größenordnung ca. 170k englischsprachige Residents/Expats in DE — aktuelle Destatis prüfen',
        'Frühes Englisch ist für viele bildungsnahe DE-Familien Priorität',
        'Bilingual kann Premium-Preise bei geringerer Listing-Dichte tragen — selbst validieren',
        'Branchen-Signal: manche Illustrator:innen machen bilinguale Serien (z. B. Monsieur-Roscoe-Formate) — Anekdote, kein Beweis',
        'Diaspora-Paare (TR/AR und potenziell Igbo/Twi/Swahili↔DE) ergänzen Heritage-Language-Demand jenseits klassischem EN–DE',
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
        en: 'EN/FR/ES/TR/AR↔DE catalogue-proven; African↔DE underserved — validate community demand',
        de: 'EN/FR/ES/TR/AR↔DE katalog-bewiesen; afrikanisch↔DE unterversorgt — Community-Demand validieren',
      },
      risk: { en: 'Medium (pair-dependent)', de: 'Mittel (paar-abhängig)' },
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
    en: 'Data-supported sequence: publish in German first → preschool/picture segment → add German audiobook when ready → then English or bilingual. For bilingual: study proven EN/TR/AR pairs; treat Igbo/Twi/Swahili↔DE as community-validated first-mover bets, not guaranteed gold.',
    de: 'Datenbasierte Sequenz: zuerst auf Deutsch → Vorschul-/Bilderbuch → DE-Hörbuch wenn bereit → dann Englisch oder bilingual. Bilingual: bewiesene EN/TR/AR-Paare studieren; Igbo/Twi/Swahili↔DE als community-validierte First-Mover-Wetten — keine Garantie.',
  },
  links: [
    { label: 'Börsenverein', url: 'https://www.boersenverein.de/' },
    { label: 'KDP', url: 'https://kdp.amazon.com/' },
    { label: 'Destatis', url: 'https://www.destatis.de/' },
  ],
}
