/**
 * Official Amazon KDP Jumpstart curriculum (learning centre).
 * Distilled from KDP Help — always open the linked topics for current wording.
 * Source hub: https://kdp.amazon.com/en_US/help/topic/G202187740
 */

export const KDP_JUMPSTART_CONFIG = {
  lastVerified: '2026-04-11',
  sourceLabel:
    'Distilled from Amazon KDP Jumpstart + linked Help topics — not a substitute for official pages',
  hub: {
    title: { en: 'Amazon KDP Jumpstart (official)', de: 'Amazon KDP Jumpstart (offiziell)' },
    url: 'https://kdp.amazon.com/en_US/help/topic/G202187740',
    intro: {
      en: 'Amazon’s official beginner path. Review sections 1–3 before clicking + Create on your KDP Bookshelf. Section 4 is title setup; 5–6 cover review, promotion, and payment. Read Content Guidelines before you upload.',
      de: 'Amazons offizieller Einstieg. Abschnitte 1–3 lesen, bevor Sie auf dem KDP Bookshelf auf + Create klicken. Abschnitt 4 ist Titel-Setup; 5–6 Review, Promotion und Zahlung. Content Guidelines vor dem Upload lesen.',
    },
    beforeYouStart: {
      en: 'Before you begin: confirm your content fits KDP Content Guidelines (title, cover, description, and interior).',
      de: 'Vor dem Start: Prüfen, ob Inhalt zu den KDP Content Guidelines passt (Titel, Cover, Beschreibung und Innenteil).',
    },
    contentGuidelinesUrl: 'https://kdp.amazon.com/en_US/help/topic/G200672390',
  },
  /** Six Jumpstart chapters with learning bullets + official deep links */
  chapters: [
    {
      id: 'js1',
      number: 1,
      title: { en: 'Set up your KDP account', de: 'KDP-Konto einrichten' },
      url: 'https://kdp.amazon.com/en_US/help/topic/G202187760',
      youNeed: {
        en: [
          'Amazon sign-in (existing account recommended)',
          'Legal name, address, phone',
          'Bank details / IBAN (country-dependent)',
          'Tax info / TIN (non-US authors: complete tax questionnaire)',
        ],
        de: [
          'Amazon-Login (bestehendes Konto empfohlen)',
          'Rechtsname, Adresse, Telefon',
          'Bankdaten / IBAN (landabhängig)',
          'Steuerdaten / TIN (Nicht-US: Steuerfragebogen)',
        ],
      },
      learn: {
        en: [
          'Sign in at kdp.amazon.com with your Amazon customer account (or create one)',
          'Using your existing Amazon account helps later when ordering proof / author copies',
          'Enter author, payment, and tax information after account creation',
          'Do not put a pen name in account details — payments/tax forms use the legal account name; pen name goes in title setup',
          'Prefer EFT / direct deposit when available — local currency, often no minimum threshold (verify Payment Options)',
          'Amazon requires valid taxpayer ID for IRS reporting/withholding rules; US 1099-MISC may apply from low royalty thresholds (US context — DE authors still complete the interview)',
        ],
        de: [
          'Bei kdp.amazon.com mit Amazon-Kundenkonto anmelden (oder Konto anlegen)',
          'Bestehendes Amazon-Konto hilft später bei Proof-/Author-Copies',
          'Autor-, Zahlungs- und Steuerdaten nach Kontoanlage eingeben',
          'Kein Pseudonym in Kontodaten — Auszahlungen/Steuerformulare nutzen den Rechtsnamen; Pseudonym erst im Titel-Setup',
          'Wenn verfügbar EFT/Direkteinzahlung bevorzugen — lokale Währung, oft ohne Mindestschwelle (Payment Options prüfen)',
          'Amazon verlangt gültige Steuer-ID für IRS-Melde-/Quellensteuerregeln; DE-Autor:innen füllen trotzdem das Interview aus',
        ],
      },
      links: [
        { label: 'Jumpstart §1', url: 'https://kdp.amazon.com/en_US/help/topic/G202187760' },
        { label: 'Create a KDP Account', url: 'https://kdp.amazon.com/en_US/help/topic/G200620010' },
        {
          label: 'Complete Tax Profile',
          url: 'https://kdp.amazon.com/en_US/help/topic/G201274750',
        },
        {
          label: 'When will I get paid?',
          url: 'https://kdp.amazon.com/en_US/help/topic/GK2MKZUL6U3SFBPZ',
        },
        { label: 'KDP Help home', url: 'https://kdp.amazon.com/help' },
      ],
      note: {
        en: '⚠ Account/tax Help IDs can move — if a deep link 404s, search the title inside KDP Help.',
        de: '⚠ Konto-/Steuer-Help-IDs können wandern — bei 404 den Titel in KDP Help suchen.',
      },
    },
    {
      id: 'js2',
      number: 2,
      title: { en: 'Prepare your manuscript', de: 'Manuskript vorbereiten' },
      url: 'https://kdp.amazon.com/en_US/help/topic/G202187840',
      youNeed: {
        en: [
          'eBook: DOC/DOCX or PDF (and tools like Kindle Create where useful)',
          'Print: trim size, bleed prefs, ink/paper prefs, ideally PDF interior',
          'Manuscript template matched to your trim size',
        ],
        de: [
          'E-Book: DOC/DOCX oder PDF (ggf. Kindle Create)',
          'Print: Trim, Bleed, Tinte/Papier — Innenteil ideal als PDF',
          'Manuskript-Vorlage passend zur Trim-Größe',
        ],
      },
      learn: {
        en: [
          'If you may print later, start from a paperback/hardcover manuscript template even for eBook-first plans',
          'Pick trim size first (US common example 6"×9" — children’s picture books often use other sizes; study comps on Amazon.de)',
          'Title/author text inside the file must exactly match Title Setup details later',
          'Print interiors hinge on trim, margins, and bleed — missing bleed is a top quality-review failure',
          'Same interior PDF can often serve paperback and hardcover; covers must be separate files',
          'Convert interior to PDF before upload when possible; bleed interiors must be PDF',
          'After upload, content/quality review can require edits and resubmit',
        ],
        de: [
          'Wenn Print möglich ist: Manuskript-Vorlage für Paperback/Hardcover nutzen (auch bei E-Book-first)',
          'Zuerst Trim wählen (US oft 6"×9" — Bilderbücher oft andere Größen; Comps auf Amazon.de studieren)',
          'Titel/Autor im File müssen exakt den späteren Title-Setup-Details entsprechen',
          'Print: Trim, Ränder, Bleed — fehlender Bleed ist ein Top-Grund für Review-Ablehnung',
          'Gleicher Innenteil oft für Paperback und Hardcover; Cover immer separate Dateien',
          'Innenteil möglichst als PDF; mit Bleed muss es PDF sein',
          'Nach Upload: Content-/Quality-Review kann Korrekturen verlangen',
        ],
      },
      links: [
        { label: 'Jumpstart §2', url: 'https://kdp.amazon.com/en_US/help/topic/G202187840' },
        {
          label: 'Trim, bleed & margins',
          url: 'https://kdp.amazon.com/en_US/help/topic/G201834230',
        },
        {
          label: 'Paperback & hardcover templates',
          url: 'https://kdp.amazon.com/en_US/help/topic/G201723120',
        },
        { label: 'Print Options', url: 'https://kdp.amazon.com/en_US/help/topic/G201834170' },
        {
          label: 'Save manuscript file / checklist',
          url: 'https://kdp.amazon.com/en_US/help/topic/G202145060',
        },
        {
          label: 'Kindle Create overview',
          url: 'https://kdp.amazon.com/en_US/help/topic/G202187300',
        },
      ],
      note: {
        en: 'Picture books: use StoryForge Canvas + publishing-specs, then export KDP-ready PDF and still run KDP Previewer.',
        de: 'Bilderbücher: StoryForge Canvas + Publishing-Specs, KDP-PDF exportieren und trotzdem KDP Previewer nutzen.',
      },
    },
    {
      id: 'js3',
      number: 3,
      title: { en: 'Prepare your cover', de: 'Cover vorbereiten' },
      url: 'https://kdp.amazon.com/en_US/help/topic/G202187850',
      youNeed: {
        en: [
          'Final interior page count (after trim/margins)',
          'Primary language, title, author/pen name, blurb',
          'Rights + primary audience + browse categories (can refine later)',
          'High-res art; optional author photo; barcode plan if using your own',
        ],
        de: [
          'Endgültige Innenteil-Seitenzahl (nach Trim/Rändern)',
          'Hauptsprache, Titel, Autor/Pseudonym, Klappentext',
          'Rechte + Zielgruppe + Browse-Kategorien (später anpassbar)',
          'Hochauflösende Kunst; optional Autorenfoto; Barcode-Plan falls eigener',
        ],
      },
      learn: {
        en: [
          'Finish and lock interior page count before sizing the wrap cover',
          'Cover Creator auto-sizes for your selected print options — simplest official path',
          'Or download a Print Cover Calculator template (binding, ink, paper, trim, page count → dimensions PNG)',
          'Paperback and hardcover need separate cover files',
          'Hardcover is not supported on kdp.amazon.co.jp (Japan account path)',
          'Leave barcode area clear if KDP will place the barcode automatically',
        ],
        de: [
          'Innenteil-Seitenzahl finalisieren, bevor das Wrap-Cover dimensioniert wird',
          'Cover Creator dimensioniert automatisch — einfachster offizieller Weg',
          'Oder Print Cover Calculator-Template (Bindung, Tinte, Papier, Trim, Seitenzahl → PNG)',
          'Paperback und Hardcover brauchen getrennte Cover-Dateien',
          'Hardcover nicht auf kdp.amazon.co.jp unterstützt',
          'Barcode-Bereich freilassen, wenn KDP den Barcode setzt',
        ],
      },
      links: [
        { label: 'Jumpstart §3', url: 'https://kdp.amazon.com/en_US/help/topic/G202187850' },
        { label: 'Cover Creator', url: 'https://kdp.amazon.com/en_US/help/topic/G201634390' },
        {
          label: 'Print cover calculator & templates',
          url: 'https://kdp.amazon.com/en_US/help/topic/G201723070',
        },
        {
          label: 'Create a paperback cover',
          url: 'https://kdp.amazon.com/en_US/help/topic/G201910060',
        },
        {
          label: 'eBook cover image criteria',
          url: 'https://kdp.amazon.com/en_US/help/topic/G200645690',
        },
      ],
    },
    {
      id: 'js4',
      number: 4,
      title: {
        en: 'Title setup: details, content & pricing',
        de: 'Titel-Setup: Details, Content & Pricing',
      },
      url: 'https://kdp.amazon.com/en_US/help/topic/G73MVSZ5P69VVCN6',
      youNeed: {
        en: [
          'Formatted interior + cover (or Cover Creator assets)',
          'ISBN / imprint plan if using your own ISBN',
          'Matching metadata across eBook / paperback / hardcover',
        ],
        de: [
          'Formatierter Innenteil + Cover (oder Cover-Creator-Assets)',
          'ISBN-/Imprint-Plan bei eigener ISBN',
          'Identische Metadaten über E-Book / Paperback / Hardcover',
        ],
      },
      learn: {
        en: [
          'Complete Title Setup separately for each format — language, title, author etc. must match exactly to auto-link detail pages',
          '4.1 Details: title, contributors, description, categories, audience/age, publication/release options — many fields are hard to change after publish',
          '4.2 Content: ISBN, print options (ink, paper, trim, bleed, finish), upload manuscript + cover, Launch Previewer (required)',
          'If any page needs bleed, select Bleed (PDF only) and size the manuscript correctly or review will reject it',
          'Upload from a computer (desktop/laptop) — mobile upload not recommended by KDP',
          'If cover has no barcode, KDP can place one — keep that zone clear',
          '4.3 Rights & Pricing: IP rights, territories, list price, royalties; eBook-only KDP Select (90-day enrolment option)',
          'Low-content books: free KDP ISBN rules differ — check low-content Help if relevant',
        ],
        de: [
          'Titel-Setup je Format separat — Sprache, Titel, Autor usw. müssen exakt matchen für Auto-Link der Detailseite',
          '4.1 Details: Titel, Mitwirkende, Beschreibung, Kategorien, Zielgruppe/Alter, Publish/Release — vieles nach Publish schwer änderbar',
          '4.2 Content: ISBN, Print-Optionen, Manuskript + Cover hochladen, Previewer starten (pflicht)',
          'Sobald eine Seite Bleed braucht: Bleed (nur PDF) wählen und richtig dimensionieren — sonst Review-Ablehnung',
          'Upload vom Computer — Mobile laut KDP nicht empfohlen',
          'Ohne eigenen Barcode setzt KDP einen — Zone freilassen',
          '4.3 Rights & Pricing: Rechte, Territorien, Listenpreis, Royalties; nur E-Book: KDP Select (90 Tage optional)',
          'Low-Content: andere ISBN-Regeln — Help prüfen falls relevant',
        ],
      },
      links: [
        { label: 'Jumpstart §4', url: 'https://kdp.amazon.com/en_US/help/topic/G73MVSZ5P69VVCN6' },
        { label: 'Create a book', url: 'https://kdp.amazon.com/en_US/help/topic/G202172740' },
        { label: 'Book detail resources', url: 'https://kdp.amazon.com/en_US/help/topic/G200645680' },
        { label: 'Keywords', url: 'https://kdp.amazon.com/en_US/help/topic/G200652310' },
        { label: 'ISBN & imprint', url: 'https://kdp.amazon.com/en_US/help/topic/G201354010' },
        { label: 'Price your book', url: 'https://kdp.amazon.com/en_US/help/topic/G200649470' },
        {
          label: 'Printing cost & royalty calculator',
          url: 'https://kdp.amazon.com/en_US/help/topic/G201411300',
        },
        { label: 'KDP Select', url: 'https://kdp.amazon.com/en_US/help/topic/G200634500' },
        {
          label: 'Link your books together',
          url: 'https://kdp.amazon.com/en_US/help/topic/G200654100',
        },
        {
          label: 'Update book details (what can change)',
          url: 'https://kdp.amazon.com/en_US/help/topic/G200645680',
        },
      ],
      note: {
        en: '⚠ Use Manual Review Checklist before submit. Preview every page — saves review cycles.',
        de: '⚠ Manual Review Checklist vor Submit. Jede Seite previewen — spart Review-Runden.',
      },
    },
    {
      id: 'js5',
      number: 5,
      title: { en: 'Publishing & review', de: 'Veröffentlichen & Review' },
      url: 'https://kdp.amazon.com/en_US/help/topic/G202187860',
      youNeed: {
        en: ['Submitted title on the Bookshelf', 'Patience for status updates'],
        de: ['Eingereichter Titel auf dem Bookshelf', 'Geduld für Status-Updates'],
      },
      learn: {
        en: [
          'After submit, KDP checks formatting + content guidelines; title is locked while In Review',
          'Typical publish/update: often ~3 business days — verify Timelines Help (marketplace-dependent)',
          'Low-content titles can take much longer (Help has cited 3–4 weeks during volume spikes)',
          'Watch Book Status on the Bookshelf; Customer Support does not expedite the queue',
          'Print formatting fixes: Fix Paperback and Hardcover Formatting Issues; eBook: Quality Notifications Dashboard',
          'Once Live, search indexing can take up to ~72 hours (longer on some marketplaces per Timelines)',
          'After Live, updates follow Update Your Book rules — some core fields need a new edition after a short window',
        ],
        de: [
          'Nach Submit prüft KDP Format + Content Guidelines; Titel ist In Review gesperrt',
          'Typisch ca. 3 Werktage für Publish/Update — Timelines-Help prüfen (marktplatzabhängig)',
          'Low-Content kann deutlich länger dauern (Help nannte 3–4 Wochen bei Last)',
          'Book Status auf dem Bookshelf; Support beschleunigt die Queue nicht',
          'Print-Fixes: Fix Paperback/Hardcover Formatting; E-Book: Quality Notifications Dashboard',
          'Nach Live: Suche oft bis ~72 Std. (laut Timelines auf manchen Marktplätzen länger)',
          'Updates folgen „Update Your Book“ — manche Kernfelder brauchen nach kurzem Fenster eine neue Edition',
        ],
      },
      links: [
        { label: 'Jumpstart §5', url: 'https://kdp.amazon.com/en_US/help/topic/G202187860' },
        { label: 'Timelines', url: 'https://kdp.amazon.com/en_US/help/topic/G202173620' },
        { label: 'Content Guidelines', url: 'https://kdp.amazon.com/en_US/help/topic/G200672390' },
        {
          label: 'Save manuscript / manual review checklist',
          url: 'https://kdp.amazon.com/en_US/help/topic/G202145060',
        },
        { label: 'KDP Help home', url: 'https://kdp.amazon.com/help' },
      ],
      note: {
        en: '⚠ Exact day counts change — always open Timelines in KDP Help before promising a go-live date.',
        de: '⚠ Tagesangaben ändern sich — Timelines in KDP Help öffnen, bevor Sie Go-Live zusagen.',
      },
    },
    {
      id: 'js6',
      number: 6,
      title: {
        en: 'Promoting your book & getting paid',
        de: 'Buch bewerben & Auszahlung',
      },
      url: 'https://kdp.amazon.com/en_US/help/topic/G202187870',
      youNeed: {
        en: ['Live title', 'Completed payment method', 'Optional ads/promo plan'],
        de: ['Live-Titel', 'Zahlungsart eingerichtet', 'Optional Ads/Promo-Plan'],
      },
      learn: {
        en: [
          'Start with Ways to Promote Your Book (official marketing menu)',
          'Sales / category ranks reflect relative customer activity — not a vanity metric to obsess over day one',
          'Royalties pay monthly after you meet the minimum threshold — Jumpstart cites ~60 days after month-end (longer for Expanded Distribution; verify When Will I Get Paid?)',
          'Use Reports (Dashboard, Orders, KENP, Payments, etc.) from the top nav when signed in',
          'Author Central, A+ Content (when eligible), KDP Select promos, and Advertising for KDP are separate Help tracks',
          'For children’s brands: also plan Merch + Author Central links (see Amazon Hub Merch playbooks)',
          'After Live with low sales: open the Listing optimisation playbook in this learning centre (keywords → A+ → reviews → short ads)',
        ],
        de: [
          'Start mit „Ways to Promote Your Book“ (offizielles Marketing-Menü)',
          'Sales-/Kategorie-Ranks spiegeln relative Aktivität — kein Day-1-Vanity-Fokus',
          'Royalties monatlich nach Mindestschwelle — Jumpstart nennt ca. 60 Tage nach Monatsende (Expanded Distribution länger; „When Will I Get Paid?“ prüfen)',
          'Reports (Dashboard, Orders, KENP, Payments…) oben in KDP nutzen',
          'Author Central, A+ Content (wenn berechtigt), KDP-Select-Promos und KDP-Advertising sind eigene Help-Tracks',
          'Kinderbuch-Marke: Merch + Author-Central-Links mitplanen (Amazon-Hub Merch-Playbooks)',
          'Nach Live bei wenigen Sales: Listing-Optimierungs-Playbook in diesem Lernzentrum (Keywords → A+ → Reviews → kurze Ads)',
        ],
      },
      links: [
        { label: 'Jumpstart §6', url: 'https://kdp.amazon.com/en_US/help/topic/G202187870' },
        {
          label: 'When will I get paid?',
          url: 'https://kdp.amazon.com/en_US/help/topic/GK2MKZUL6U3SFBPZ',
        },
        { label: 'Complete Tax Profile', url: 'https://kdp.amazon.com/en_US/help/topic/G201274750' },
        { label: 'Author Central DE', url: 'https://author.amazon.de/' },
        { label: 'ACX audiobooks', url: 'https://www.acx.com/' },
        { label: 'KDP Help home', url: 'https://kdp.amazon.com/help' },
        { label: 'Merch on Demand', url: 'https://merch.amazon.com/' },
      ],
      note: {
        en: '⚠ Some Jumpstart deep links share parent Help IDs in Amazon’s tree — search by title if a URL lands on the wrong article.',
        de: '⚠ Manche Deep-Links teilen Help-IDs — bei falschem Artikel nach Titel suchen.',
      },
    },
  ],
  /** High-value official link library beyond Jumpstart */
  officialLibrary: [
    {
      group: { en: 'Account & tax', de: 'Konto & Steuern' },
      links: [
        { label: 'KDP Help home', url: 'https://kdp.amazon.com/help' },
        { label: 'Create a KDP Account', url: 'https://kdp.amazon.com/en_US/help/topic/G200620010' },
        { label: 'Complete Tax Profile', url: 'https://kdp.amazon.com/en_US/help/topic/G201274750' },
        {
          label: 'When will I get paid?',
          url: 'https://kdp.amazon.com/en_US/help/topic/GK2MKZUL6U3SFBPZ',
        },
        { label: 'Jumpstart §1 — account', url: 'https://kdp.amazon.com/en_US/help/topic/G202187760' },
      ],
    },
    {
      group: { en: 'Formatting & tools', de: 'Formatierung & Tools' },
      links: [
        { label: 'Jumpstart §2 — manuscript', url: 'https://kdp.amazon.com/en_US/help/topic/G202187840' },
        { label: 'Jumpstart §3 — cover', url: 'https://kdp.amazon.com/en_US/help/topic/G202187850' },
        {
          label: 'Trim, bleed & margins',
          url: 'https://kdp.amazon.com/en_US/help/topic/G201834230',
        },
        {
          label: 'Manuscript templates',
          url: 'https://kdp.amazon.com/en_US/help/topic/G201723120',
        },
        {
          label: 'Save manuscript / review checklist',
          url: 'https://kdp.amazon.com/en_US/help/topic/G202145060',
        },
        { label: 'Cover Creator', url: 'https://kdp.amazon.com/en_US/help/topic/G201634390' },
        {
          label: 'Print cover calculator',
          url: 'https://kdp.amazon.com/en_US/help/topic/G201723070',
        },
      ],
    },
    {
      group: { en: 'Title setup, royalties & legal', de: 'Titel-Setup, Royalties & Legal' },
      links: [
        {
          label: 'Jumpstart §4 — title setup',
          url: 'https://kdp.amazon.com/en_US/help/topic/G73MVSZ5P69VVCN6',
        },
        { label: 'Create a book', url: 'https://kdp.amazon.com/en_US/help/topic/G202172740' },
        { label: 'Content Guidelines', url: 'https://kdp.amazon.com/en_US/help/topic/G200672390' },
        { label: 'Keywords Help', url: 'https://kdp.amazon.com/en_US/help/topic/G200652310' },
        { label: 'ISBN & imprint', url: 'https://kdp.amazon.com/en_US/help/topic/G201354010' },
        {
          label: 'Printing cost & royalty calculator',
          url: 'https://kdp.amazon.com/en_US/help/topic/G201411300',
        },
        { label: 'Timelines', url: 'https://kdp.amazon.com/en_US/help/topic/G202173620' },
      ],
    },
    {
      group: { en: 'Marketing & grow', de: 'Marketing & Wachstum' },
      links: [
        { label: 'Jumpstart §6 — promote & pay', url: 'https://kdp.amazon.com/en_US/help/topic/G202187870' },
        { label: 'Author Central DE', url: 'https://author.amazon.de/' },
        { label: 'KDP Select (via Jumpstart hub)', url: 'https://kdp.amazon.com/en_US/help/topic/G202187740' },
        { label: 'KDP University / Jumpstart hub', url: 'https://kdp.amazon.com/en_US/help/topic/G202187740' },
      ],
    },
    {
      group: { en: 'Related Amazon programmes', de: 'Verwandte Amazon-Programme' },
      links: [
        { label: 'Merch on Demand', url: 'https://merch.amazon.com/' },
        { label: 'ACX (audiobooks)', url: 'https://www.acx.com/' },
        {
          label: 'PartnerNet DE (Associates)',
          url: 'https://programm.partnernet.amazon.de/',
        },
        { label: 'Seller Central DE (FBA/FBM)', url: 'https://sellercentral.amazon.de/' },
        { label: 'Brand Registry', url: 'https://brandregistry.amazon.com/' },
      ],
    },
  ],
  studyChecklist: {
    en: [
      'Read Jumpstart hub + Content Guidelines end-to-end',
      'Complete account + tax + bank before creating a title',
      'Choose trim / page count → template → PDF interior with correct bleed',
      'Build cover only after final page count',
      'Run Previewer on every page; fix before Rights & Pricing submit',
      'Match metadata across formats for linking',
      'After Live: Author Central, reports, then Merch handoff for characters',
    ],
    de: [
      'Jumpstart-Hub + Content Guidelines komplett lesen',
      'Konto + Steuern + Bank vor dem ersten Titel abschließen',
      'Trim / Seitenzahl → Vorlage → PDF-Innenteil mit korrektem Bleed',
      'Cover erst nach finaler Seitenzahl',
      'Previewer auf jeder Seite; vor Rights & Pricing korrigieren',
      'Metadaten über Formate matchen für Linking',
      'Nach Live: Author Central, Reports, dann Merch-Handoff für Figuren',
    ],
  },
}
