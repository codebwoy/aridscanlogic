/**
 * First-time author-publisher “critical truths” — Amazon Hub playbook.
 * Strategic guidance for DE / bilingual / culturally specific kids + parenting brands.
 * ⚠ Not official Amazon advice; fees, ISBN rules, tax, and school purchasing change — verify.
 */

export const PUBLISHER_TRUTHS_CONFIG = {
  lastVerified: '2026-10-12',
  sourceLabel: 'Strategic founder playbook (ScanLogic Amazon Hub) — not Amazon Help verbatim',
  independenceDisclaimer: {
    en: '⚠ Guide only — not Amazon, tax, legal, or school-procurement advice. Prices, ISBN rules, Freiberufler/Kleinunternehmer thresholds, and school budgets change. Verify on official portals and with a Steuerberater / Rechtsanwalt before you act.',
    de: '⚠ Nur Orientierung — keine Amazon-, Steuer-, Rechts- oder Schulbeschaffungsberatung. Preise, ISBN-Regeln, Freiberufler-/Kleinunternehmer-Schwellen und Schulbudgets ändern sich. Offizielle Portale und Steuerberater/Rechtsanwalt prüfen.',
  },
  closing: {
    en: 'You have a unique cultural voice, a specific audience, and a real gap to serve. Start with one book, one character, done brilliantly — then build the ecosystem.',
    de: 'Sie haben eine einzigartige kulturelle Stimme, eine klare Zielgruppe und eine echte Marktlücke. Starten Sie mit einem Buch, einer Figur — brillant umgesetzt — und bauen Sie dann das Ökosystem.',
  },
  truths: [
    {
      id: 'ecosystem',
      number: 1,
      title: {
        en: 'You are building a business, not just a book',
        de: 'Sie bauen ein Business — nicht nur ein Buch',
      },
      lead: {
        en: 'Successful authors think ecosystem. A book without one is a hobby; with one, it is a business.',
        de: 'Erfolgreiche Autor:innen denken in Ökosystemen. Ein Buch ohne Ökosystem ist ein Hobby — mit Ökosystem ein Business.',
      },
      bullets: {
        en: [
          'Book series → recurring revenue',
          'Workbook / activity book → upsell (StoryForge + AuthorForge)',
          'Merchandise → Merch by Amazon (same character art)',
          'Speaking / coaching → book as credibility',
          'Website + email list → your most valuable long-term asset',
        ],
        de: [
          'Buchserie → wiederkehrender Umsatz',
          'Workbook / Activity-Buch → Upsell (StoryForge + AuthorForge)',
          'Merchandise → Merch by Amazon (gleiche Figuren-Kunst)',
          'Vorträge / Coaching → Buch als Glaubwürdigkeit',
          'Website + E-Mail-Liste → wertvollstes Langzeit-Asset',
        ],
      },
      appHooks: {
        en: 'Use the niche ladder above: StoryForge for kids’ series + activity; AuthorForge for parenting / coaching companions; Merch playbooks after the character exists.',
        de: 'Nutzen Sie die Nischen-Leiter oben: StoryForge für Kinderbuchserie + Activity; AuthorForge für Eltern-/Coaching-Begleiter; Merch-Playbooks nach der Figur.',
      },
    },
    {
      id: 'distribution',
      number: 2,
      title: {
        en: 'KDP alone is not enough — distribution matters',
        de: 'KDP allein reicht nicht — Distribution zählt',
      },
      lead: {
        en: 'Be where your reader is — not only on Amazon.',
        de: 'Seien Sie dort, wo Ihre Leser:innen sind — nicht nur auf Amazon.',
      },
      rows: [
        {
          platform: 'KDP (Amazon)',
          adds: {
            en: 'Print + Kindle, largest reach',
            de: 'Print + Kindle, größte Reichweite',
          },
        },
        {
          platform: 'IngramSpark',
          adds: {
            en: 'Physical bookshops across Germany / Europe (verify current terms)',
            de: 'Physische Buchhandlungen in DE / Europa (aktuelle Konditionen prüfen)',
          },
        },
        {
          platform: 'Lulu.com',
          adds: {
            en: 'Bulk printing for events / schools',
            de: 'Mengen-Druck für Events / Schulen',
          },
        },
        {
          platform: 'Gumroad / Payhip',
          adds: {
            en: 'Direct PDF workbook sales — you keep most of the revenue (fees vary)',
            de: 'Direkter PDF-Workbook-Verkauf — Sie behalten den Großteil (Gebühren variieren)',
          },
        },
        {
          platform: 'Draft2Digital',
          adds: {
            en: 'eBook distribution to Apple Books, Kobo, B&N and more',
            de: 'E-Book-Distribution zu Apple Books, Kobo, B&N u. a.',
          },
        },
      ],
      note: {
        en: '⚠ Third-party platforms have their own fees, exclusivity rules, and quality checks — read current terms before committing.',
        de: '⚠ Drittanbieter haben eigene Gebühren, Exklusivitätsregeln und Qualitätschecks — aktuelle AGB prüfen.',
      },
      links: [
        { label: 'KDP', url: 'https://kdp.amazon.com/' },
        { label: 'IngramSpark', url: 'https://www.ingramspark.com/' },
        { label: 'Lulu', url: 'https://www.lulu.com/' },
        { label: 'Gumroad', url: 'https://gumroad.com/' },
        { label: 'Payhip', url: 'https://payhip.com/' },
        { label: 'Draft2Digital', url: 'https://www.draft2digital.com/' },
      ],
    },
    {
      id: 'isbn_rights',
      number: 3,
      title: {
        en: 'ISBN and rights planning are non-negotiable',
        de: 'ISBN und Rechteplanung sind nicht verhandelbar',
      },
      bullets: {
        en: [
          'Free KDP ISBN is convenient but ties that edition’s imprint path to Amazon — fine for many first titles; buy your own via German channels (MVB / VLB) if you need bookshop independence',
          'Copyright in Germany arises automatically on creation — still keep dated files and contracts',
          'If you plan Merch / series branding, consider trademark research for character name / title early (DPMA) — before you publish widely',
          'Do ISBN / brand decisions before upload, not after a messy launch',
        ],
        de: [
          'Kostenlose KDP-ISBN ist bequem, bindet den Imprint-Pfad dieser Ausgabe an Amazon — oft okay für Ersttitel; eigene ISBN über DE-Kanäle (MVB / VLB) wenn Buchhandels-Unabhängigkeit nötig',
          'Urheberrecht entsteht in DE mit der Schöpfung — trotzdem datierte Dateien und Verträge behalten',
          'Bei Merch / Serienmarke früh Markenrecherche zu Figurenname / Titel (DPMA) — bevor Sie breit launchen',
          'ISBN-/Marken-Entscheidungen vor dem Upload, nicht nach chaotischem Launch',
        ],
      },
      note: {
        en: '⚠ ISBN and trademark rules are jurisdiction-specific — verify on KDP Help + MVB/VLB + DPMA; this is not legal advice.',
        de: '⚠ ISBN- und Markenregeln sind rechtskreisabhängig — KDP Help + MVB/VLB + DPMA prüfen; keine Rechtsberatung.',
      },
      links: [
        { label: 'KDP ISBN & imprint', url: 'https://kdp.amazon.com/en_US/help/topic/G201354010' },
        { label: 'MVB / VLB (DE book trade)', url: 'https://www.mvb-online.de/' },
        { label: 'DPMA (trademarks)', url: 'https://www.dpma.de/' },
      ],
    },
    {
      id: 'schools',
      number: 4,
      title: {
        en: 'Schools and libraries are a major untapped channel',
        de: 'Schulen und Bibliotheken sind ein großer ungenutzter Kanal',
      },
      bullets: {
        en: [
          'German schools and libraries often seek culturally diverse children’s books — bilingual Twi/German or Twi/English can support diversity goals (confirm locally)',
          'A single institutional order can be many copies — full-margin direct sales possible without Amazon',
          'Reach out to Stadtbibliotheken, Grundschulen, and Kitas with a professional sample + invoice path',
          'Pair StoryForge print packs with a simple school one-pager (age band, languages, themes)',
        ],
        de: [
          'Deutsche Schulen und Bibliotheken suchen oft kulturell diverse Kinderbücher — Twi/Deutsch oder Twi/Englisch kann Diversitätsziele unterstützen (lokal prüfen)',
          'Eine institutionelle Bestellung kann viele Exemplare sein — Direktvertrieb mit voller Marge ohne Amazon möglich',
          'Stadtbibliotheken, Grundschulen und Kitas mit professionellem Sample + Rechnungsweg ansprechen',
          'StoryForge-Printpacks mit einfachem Schul-One-Pager (Altersband, Sprachen, Themen) kombinieren',
        ],
      },
      note: {
        en: '⚠ School purchasing is local and slow — never claim guaranteed curriculum adoption. Build relationships; do not spam.',
        de: '⚠ Schulbeschaffung ist lokal und langsam — keine Garantie für Lehrplan-Aufnahme. Beziehungen aufbauen; kein Spam.',
      },
    },
    {
      id: 'pricing',
      number: 5,
      title: {
        en: 'Pricing — most new authors underprice',
        de: 'Preise — die meisten Neueinsteiger unterpreisen',
      },
      lead: {
        en: 'Common mistakes: workbooks at €7.99 when peers charge much more; free PDFs with no list capture; no premium tier (signed / bundles / coaching).',
        de: 'Häufige Fehler: Workbooks für €7,99 während Peers deutlich mehr verlangen; PDFs gratis ohne Listenaufbau; keine Premium-Stufe (signiert / Bundles / Coaching).',
      },
      pricing: [
        {
          product: { en: 'Picture book (print)', de: 'Bilderbuch (Print)' },
          range: '€12.99 – €16.99',
        },
        {
          product: { en: 'Activity / colouring book', de: 'Activity- / Malbuch' },
          range: '€8.99 – €12.99',
        },
        {
          product: { en: 'Parenting guide (print)', de: 'Erziehungsratgeber (Print)' },
          range: '€14.99 – €19.99',
        },
        {
          product: { en: 'Workbook (print or PDF)', de: 'Workbook (Print oder PDF)' },
          range: '€18.99 – €34.99',
        },
        {
          product: { en: 'eBook', de: 'E-Book' },
          range: '€4.99 – €9.99',
        },
      ],
      note: {
        en: '⚠ Ranges are strategic starting points — always run KDP print cost + royalty calculator for your trim, pages, and marketplaces.',
        de: '⚠ Spannen sind strategische Startpunkte — immer KDP-Druckkosten- + Royalty-Rechner für Trim, Seiten und Marktplätze nutzen.',
      },
      links: [
        {
          label: 'KDP print & royalty calculator',
          url: 'https://kdp.amazon.com/en_US/help/topic/GSQF43YAMUPFTMSP',
        },
      ],
    },
    {
      id: 'audience',
      number: 6,
      title: {
        en: 'Build your audience before the book is finished',
        de: 'Publikum aufbauen, bevor das Buch fertig ist',
      },
      bullets: {
        en: [
          'Do not wait until publish day to start marketing',
          'Document the journey on Instagram, TikTok, or YouTube — sketches, name choices, cultural stories',
          'Launch with people waiting — not hoping Amazon discovers you',
          'African parent communities in Germany (e.g. Facebook groups) are often active and loyal first readers — engage respectfully, no spam',
        ],
        de: [
          'Nicht bis zum Publish-Tag mit Marketing warten',
          'Reise dokumentieren auf Instagram, TikTok oder YouTube — Skizzen, Namen, kulturelle Geschichten',
          'Mit wartendem Publikum launchen — nicht hoffen, dass Amazon Sie findet',
          'Afrikanische Eltern-Communities in DE (z. B. Facebook) sind oft aktive, loyale Erstleser — respektvoll, kein Spam',
        ],
      },
    },
    {
      id: 'reviews',
      number: 7,
      title: {
        en: 'Reviews matter on Amazon — plan for them',
        de: 'Reviews zählen auf Amazon — planen Sie sie',
      },
      bullets: {
        en: [
          'Early reviews help discoverability in the first weeks (exact ranking weights are Amazon’s secret)',
          'Plan for ~10–15 genuine early reviews from beta readers, community parents, and fellow creators — quality and authenticity over vanity counts',
          'Never buy fake reviews — Amazon can ban accounts permanently',
          'Advance copies via legitimate services (e.g. NetGalley / BookSirens) only if terms fit — verify current policies',
        ],
        de: [
          'Frühe Reviews helfen der Sichtbarkeit in den ersten Wochen (genaue Ranking-Gewichte kennt nur Amazon)',
          'Planen Sie ca. 10–15 echte Early Reviews von Beta-Lesern, Community-Eltern und Creator-Kolleg:innen — Qualität vor Vanity-Zahlen',
          'Niemals Fake-Reviews kaufen — Amazon kann Konten dauerhaft sperren',
          'Vorab-Exemplare über legitime Dienste (z. B. NetGalley / BookSirens) nur wenn Konditionen passen — aktuell prüfen',
        ],
      },
      note: {
        en: '⚠ Follow Amazon’s Customer Reviews guidelines — incentivised reviews have strict rules. “10–15” is a planning target, not a guarantee of ranking.',
        de: '⚠ Amazons Customer-Reviews-Richtlinien beachten — incentivierte Reviews haben strenge Regeln. „10–15“ ist ein Planungsziel, keine Ranking-Garantie.',
      },
      links: [
        {
          label: 'Amazon Customer Reviews guidelines',
          url: 'https://www.amazon.com/gp/help/customer/display.html?nodeId=G3UA5PMKAK6R42OM',
        },
        { label: 'NetGalley', url: 'https://www.netgalley.com/' },
        { label: 'BookSirens', url: 'https://booksirens.com/' },
      ],
    },
    {
      id: 'tax_de',
      number: 8,
      title: {
        en: 'Tax and business registration in Germany',
        de: 'Steuern und Gewerbe / Freiberufler in Deutschland',
      },
      bullets: {
        en: [
          'Book income in Germany usually means registering with your Finanzamt — many authors use Freiberufler status (confirm for your case)',
          'Check Kleinunternehmerregelung eligibility against current Umsatz thresholds',
          'Complete KDP tax interview (W-8BEN / W-8BEN-E) before meaningful payouts',
          'Use BizStart / Tax Vault in ScanLogic for registration orientation — then confirm with a Steuerberater',
        ],
        de: [
          'Bucheinnahmen in DE bedeuten meist Meldung beim Finanzamt — viele Autor:innen als Freiberufler (für Ihren Fall prüfen)',
          'Kleinunternehmerregelung anhand aktueller Umsatzschwellen prüfen',
          'KDP-Steuerinterview (W-8BEN / W-8BEN-E) vor nennenswerten Auszahlungen',
          'BizStart / Tax Vault in ScanLogic zur Orientierung — dann Steuerberater bestätigen lassen',
        ],
      },
      note: {
        en: '⚠ Tax status is personal — this is not Steuerberatung. Sort registration before your first sale when possible.',
        de: '⚠ Steuerstatus ist individuell — keine Steuerberatung. Anmeldung möglichst vor dem ersten Verkauf klären.',
      },
      appHooks: {
        en: 'Open the Amazon Hub tax playbook below (Tax in Germany) and BizStart for registration orientation.',
        de: 'Öffnen Sie unten das Steuer-Playbook im Amazon Hub und BizStart zur Anmelde-Orientierung.',
      },
      hubGuideId: 'tax-de',
    },
    {
      id: 'child_test',
      number: 9,
      title: {
        en: 'Your child is your best research tool',
        de: 'Ihr Kind ist Ihr bestes Research-Tool',
      },
      bullets: {
        en: [
          'Test every book, character name, and story beat with a real child first',
          'If they do not ask for the character by name after one reading — redesign',
          'If they do not ask you to read it again — rewrite',
          'Honest kid reactions beat generic market research for picture books',
        ],
        de: [
          'Jedes Buch, jeden Figurenamen und jede Story-Beat zuerst mit einem echten Kind testen',
          'Wenn sie die Figur nach einmaligem Lesen nicht beim Namen verlangen — redesign',
          'Wenn sie nicht nochmal vorgelesen haben wollen — rewrite',
          'Ehrliche Kinderreaktionen schlagen generische Marktforschung für Bilderbücher',
        ],
      },
      appHooks: {
        en: 'StoryForge: pin one Character Turbo anchor, then iterate pages until the character sticks.',
        de: 'StoryForge: einen Character-Turbo-Anker pinnen, dann Seiten iterieren bis die Figur „klebt“.',
      },
    },
    {
      id: 'long_game',
      number: 10,
      title: {
        en: 'The long game — what success actually looks like',
        de: 'Das lange Spiel — so sieht Erfolg wirklich aus',
      },
      lead: {
        en: 'No overnight success — a 3-year committed plan works.',
        de: 'Kein Overnight-Erfolg — ein konsequenter 3-Jahres-Plan funktioniert.',
      },
      timeline: [
        {
          when: { en: 'Month 1–3', de: 'Monat 1–3' },
          what: {
            en: 'Write, illustrate, publish Book 1 (StoryForge)',
            de: 'Schreiben, illustrieren, Buch 1 publishen (StoryForge)',
          },
        },
        {
          when: { en: 'Month 3–6', de: 'Monat 3–6' },
          what: {
            en: 'Social presence; approach ~5 local schools / libraries',
            de: 'Social Presence; ca. 5 lokale Schulen / Bibliotheken ansprechen',
          },
        },
        {
          when: { en: 'Month 6–12', de: 'Monat 6–12' },
          what: {
            en: 'Book 2; workbook / parenting companion (AuthorForge); first speaking event',
            de: 'Buch 2; Workbook / Eltern-Begleiter (AuthorForge); erstes Speaking',
          },
        },
        {
          when: { en: 'Year 2', de: 'Jahr 2' },
          what: {
            en: 'Book 3; Merch launch; library distribution push',
            de: 'Buch 3; Merch-Launch; Bibliotheks-Distribution',
          },
        },
        {
          when: { en: 'Year 3+', de: 'Jahr 3+' },
          what: {
            en: 'Licensing talks; school relationships; series brand recognition',
            de: 'Lizenzgespräche; Schulbeziehungen; Serien-Markenwiedererkennung',
          },
        },
      ],
    },
  ],
}
