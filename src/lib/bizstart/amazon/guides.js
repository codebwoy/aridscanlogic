/**
 * Amazon Business Hub — deep-dive playbooks for DE founders (guide only).
 * Rates, tiers, tax outcomes, and tool prices change — verify on official portals.
 */

/**
 * @typedef {{ en: string, de: string }} LangStr
 * @typedef {{ en: string[], de: string[] }} LangList
 * @typedef {{ label: LangStr, detail: LangStr }[]} GuideRows
 * @typedef {{
 *   heading: LangStr
 *   bullets?: LangList
 *   rows?: GuideRows
 *   note?: LangStr
 *   links?: { label: string, url: string }[]
 * }} GuideSection
 * @typedef {{
 *   id: string
 *   defaultOpen?: boolean
 *   title: LangStr
 *   summary: LangStr
 *   sections: GuideSection[]
 * }} AmazonGuide
 */

/** @type {AmazonGuide[]} */
export const AMAZON_GUIDES = [
  {
    id: 'kdp-start',
    defaultOpen: true,
    title: {
      en: 'KDP requirements — start in Germany',
      de: 'KDP-Anforderungen — Start in Deutschland',
    },
    summary: {
      en: 'Complete practical checklist to start Amazon KDP from Germany: account, tax (critical), book assets, and picture-book technical files. Pair with the KDP learning centre Jumpstart curriculum (official Amazon 6-step guide). Config tables below include ⚠ verification notes.',
      de: 'Praktische Checkliste für Amazon KDP aus Deutschland: Konto, Steuern (kritisch), Buch-Assets und Bilderbuch-Technik. Dazu das KDP-Lernzentrum Jumpstart-Curriculum (offizieller Amazon-6-Schritte-Guide). Tabellen unten mit ⚠ Prüfen-Hinweisen.',
    },
    sections: [
      {
        heading: {
          en: '0. Official learning path (KDP Jumpstart)',
          de: '0. Offizieller Lernpfad (KDP Jumpstart)',
        },
        bullets: {
          en: [
            'Study Amazon’s Jumpstart before + Create on the Bookshelf: (1) account (2) manuscript (3) cover (4) title setup (5) publishing & review (6) promote & get paid',
            'Read Content Guidelines first — they apply to title, cover, description, and interior',
            'Open the full chapter notes + Help links in Amazon Hub → KDP learning centre',
          ],
          de: [
            'Amazons Jumpstart vor + Create auf dem Bookshelf: (1) Konto (2) Manuskript (3) Cover (4) Titel-Setup (5) Publish & Review (6) Promotion & Auszahlung',
            'Zuerst Content Guidelines — gelten für Titel, Cover, Beschreibung und Innenteil',
            'Vollständige Kapitel-Notizen + Help-Links im Amazon Hub → KDP-Lernzentrum',
          ],
        },
        links: [
          {
            label: 'KDP Jumpstart',
            url: 'https://kdp.amazon.com/en_US/help/topic/G202187740',
          },
          {
            label: 'Content Guidelines',
            url: 'https://kdp.amazon.com/en_US/help/topic/G200672390',
          },
        ],
      },
      {
        heading: { en: '1. Account requirements', de: '1. Konto-Anforderungen' },
        bullets: {
          en: [
            'Amazon account — existing Amazon.de login works at kdp.amazon.com',
            'Full legal name (person or publishing company / imprint)',
            'German address + phone for identity verification',
            'Tax interview completed (see section 2 / Tax playbook)',
            'German bank IBAN for EUR royalty payments',
          ],
          de: [
            'Amazon-Konto — bestehendes Amazon.de-Login funktioniert unter kdp.amazon.com',
            'Vollständiger Rechtsname (Person oder Verlag / Imprint)',
            'Deutsche Adresse + Telefon zur Identitätsprüfung',
            'Steuerinterview abgeschlossen (siehe Abschnitt 2 / Steuer-Playbook)',
            'Deutsche IBAN für Royalty-Zahlungen in EUR',
          ],
        },
        links: [{ label: 'KDP', url: 'https://kdp.amazon.com/' }],
      },
      {
        heading: { en: '2. Tax — most important step', de: '2. Steuern — wichtigster Schritt' },
        bullets: {
          en: [
            'KDP is US-based: complete W-8BEN (individual) or W-8BEN-E (company) inside KDP online',
            'Need German Steueridentifikationsnummer — from registration docs or via bzst.de',
            'US–DE treaty may reduce withholding vs a default 30% — only the rate in your interview counts (see ⚠ in config panel)',
            'Declare royalties on your German Einkommensteuererklärung; check Kleinunternehmer / VAT thresholds yearly',
            'Consult a Steuerberater before the first meaningful payout',
          ],
          de: [
            'KDP ist US-basiert: W-8BEN (Privat) oder W-8BEN-E (Firma) online in KDP ausfüllen',
            'Deutsche Steueridentifikationsnummer nötig — Meldeunterlagen oder bzst.de',
            'US–DE-Abkommen kann Quellensteuer unter typisch 30 % senken — nur der Satz im Interview zählt (⚠ im Config-Panel)',
            'Royalties in der Einkommensteuererklärung; Kleinunternehmer-/USt-Schwellen jährlich prüfen',
            'Steuerberater vor der ersten nennenswerten Auszahlung konsultieren',
          ],
        },
        links: [
          { label: 'BzSt', url: 'https://www.bzst.de/' },
          { label: 'KDP', url: 'https://kdp.amazon.com/' },
        ],
        note: {
          en: '⚠ Never treat “0% withholding” as guaranteed — confirm Amazon’s applied rate and German VAT rules with a professional.',
          de: '⚠ „0 % Quellensteuer“ nie als Garantie behandeln — Amazons Satz und deutsche USt-Regeln mit Fachperson prüfen.',
        },
      },
      {
        heading: { en: '3. Book requirements', de: '3. Buch-Anforderungen' },
        bullets: {
          en: [
            'Manuscript + cover + listing fields (title, DE description, keywords, categories, age, language, rights)',
            'ISBN: free KDP ISBN is often acceptable for DE titles — verify current KDP rules',
            'Full requirement table is in the config panel below',
          ],
          de: [
            'Manuskript + Cover + Listing-Felder (Titel, DE-Beschreibung, Keywords, Kategorien, Alter, Sprache, Rechte)',
            'ISBN: kostenlose KDP-ISBN oft ok für DE-Titel — aktuelle KDP-Regeln prüfen',
            'Vollständige Anforderungstabelle im Config-Panel unten',
          ],
        },
      },
      {
        heading: { en: '4. Picture-book technical files', de: '4. Bilderbuch — Technikdateien' },
        bullets: {
          en: [
            'Use KDP trim + bleed calculator for your page count; aim ~300 DPI',
            'Keep characters consistent — StoryForge Character Turbo anchor → Editor Pro → Canvas → preflight → interior PDF',
            'Disclose AI-generated images at upload when required (verify KDP Help)',
            'Plan Merch reuse: keep a transparent PNG of the hero (see Merch full guide)',
          ],
          de: [
            'KDP-Rechner für Trim + Bleed; ca. 300 DPI anstreben',
            'Figuren konsistent halten — StoryForge Character Turbo-Anker → Editor Pro → Canvas → Preflight → Innenteil-PDF',
            'KI-Bilder beim Upload angeben, wenn vorgeschrieben (KDP-Help prüfen)',
            'Merch mitdenken: transparente PNG der Heldenfigur (siehe Merch-Vollguide)',
          ],
        },
        note: {
          en: '⚠ File specs and AI disclosure wording change — confirm in KDP Help before upload.',
          de: '⚠ Dateispezifikationen und KI-Disclosure ändern sich — vor Upload im KDP-Help prüfen.',
        },
      },
    ],
  },
  {
    id: 'tax-de',
    title: {
      en: 'Tax for DE publishers (KDP / Merch)',
      de: 'Steuern für DE-Publisher (KDP / Merch)',
    },
    summary: {
      en: 'Deep dive: W-8BEN interview, US–DE treaty claims (⚠), Einkommensteuer, Kleinunternehmer / VAT. Not tax advice — Steuerberater required for your case. Detail tables also live in the KDP requirements playbook.',
      de: 'Deep Dive: W-8BEN-Interview, US–DE-Abkommens-Claims (⚠), ESt, Kleinunternehmer / USt. Keine Steuerberatung — Steuerberater für Ihren Fall. Detailtabellen auch im KDP-Anforderungs-Playbook.',
    },
    sections: [
      {
        heading: { en: 'Inside KDP / Merch', de: 'In KDP / Merch' },
        bullets: {
          en: [
            'Complete W-8BEN (individual) or W-8BEN-E (entity) in the Amazon tax interview — typically online only',
            'Have your German Steueridentifikationsnummer ready (BzSt / registration docs)',
            'Default US withholding is often described as 30%; treaty relief may reduce it — only the rate Amazon shows after your interview is authoritative',
            'Complete tax setup in each programme that pays you (KDP and Merch separately if prompted)',
          ],
          de: [
            'W-8BEN (Privat) oder W-8BEN-E (Firma) im Amazon-Steuerinterview — meist nur online',
            'Deutsche Steueridentifikationsnummer bereithalten (BzSt / Meldeunterlagen)',
            'US-Quellensteuer wird oft mit 30 % Default beschrieben; Abkommen kann senken — maßgeblich ist Amazons Satz nach dem Interview',
            'Steuer-Setup in jedem auszahlenden Programm abschließen (KDP und Merch ggf. getrennt)',
          ],
        },
        links: [
          { label: 'BzSt', url: 'https://www.bzst.de/' },
          { label: 'KDP', url: 'https://kdp.amazon.com/' },
        ],
        note: {
          en: '⚠ Never hardcode “0% forever” for ebook or print — confirm the rate Amazon applies to your account.',
          de: '⚠ Niemals „0 % für immer“ für E-Book oder Print annehmen — den von Amazon ausgewiesenen Satz prüfen.',
        },
      },
      {
        heading: { en: 'German domestic obligations', de: 'Deutsche Pflichten' },
        bullets: {
          en: [
            'Declare royalty income on your Einkommensteuererklärung',
            'Kleinunternehmerregelung may apply below current VAT turnover thresholds — verify € limits each year (older notes often cite ~€22k — not frozen in this app)',
            'Above thresholds: register for Umsatzsteuer as required',
            'Talk to a Steuerberater before your first meaningful royalty payout',
          ],
          de: [
            'Royalty-Einkünfte in der Einkommensteuererklärung erklären',
            'Kleinunternehmerregelung unterhalb der aktuellen USt-Umsatzgrenzen möglich — €-Grenzen jährlich prüfen (ältere Notizen nennen oft ~22k € — hier nicht fest verdrahtet)',
            'Darüber: Umsatzsteuer-Registrierung wie vorgeschrieben',
            'Steuerberater vor der ersten nennenswerten Auszahlung konsultieren',
          ],
        },
      },
    ],
  },
  {
    id: 'kdp-resources',
    title: {
      en: 'Resources to begin with Amazon KDP',
      de: 'Ressourcen für den KDP-Start',
    },
    summary: {
      en: 'Best free starting path (Jumpstart → Help → Kindlepreneur → Reedsy), children’s-book resources after KDP basics, one optional paid course, what to learn first, and a realistic 30-day plan. Prefer free first — treat upsells critically.',
      de: 'Bester Free-Pfad (Jumpstart → Help → Kindlepreneur → Reedsy), Kinderbuch-Ressourcen nach KDP-Basics, optional ein bezahlter Kurs, Lernreihenfolge und realistischer 30-Tage-Plan. Zuerst kostenlos — Upsells kritisch prüfen.',
    },
    sections: [
      {
        heading: { en: 'Best free starting path', de: 'Bester kostenloser Einstieg' },
        bullets: {
          en: [
            '1) Amazon KDP Jumpstart — official account → publish → payment walkthrough + content guidelines',
            '2) KDP Help Center — formatting, print specs, royalties, tax troubleshooting',
            '3) Kindlepreneur — free SEO/keywords/categories/descriptions/ads library',
            '4) Reedsy Self-Publishing 101 — free ~10-day email course on craft + distribution basics',
            '5) Self Publishing Titans free intro — useful videos; ignore hype and upsells',
          ],
          de: [
            '1) Amazon KDP Jumpstart — offizieller Weg Konto → Publish → Zahlung + Content-Guidelines',
            '2) KDP Help Center — Formatierung, Print-Specs, Royalties, Steuer-Troubleshooting',
            '3) Kindlepreneur — kostenlose SEO-/Keyword-/Kategorie-/Ads-Bibliothek',
            '4) Reedsy Self-Publishing 101 — ca. 10-Tage-E-Mail-Kurs zu Craft + Distribution',
            '5) Self Publishing Titans Free-Intro — nützliche Videos; Hype und Upsells ignorieren',
          ],
        },
        links: [
          { label: 'KDP Jumpstart', url: 'https://kdp.amazon.com/en_US/help/topic/G200672390' },
          { label: 'KDP Help', url: 'https://kdp.amazon.com/help' },
          { label: 'Kindlepreneur', url: 'https://kindlepreneur.com/' },
          { label: 'Reedsy Learning', url: 'https://reedsy.com/learning' },
        ],
      },
      {
        heading: {
          en: 'Children’s-book resources (after KDP basics)',
          de: 'Kinderbuch-Ressourcen (nach KDP-Basics)',
        },
        bullets: {
          en: [
            'Only after you understand KDP setup, formatting, keywords, and Amazon content rules',
            'Reedsy picture-book course — prioritize over generic “make money on KDP” content',
            'Harleigh Manske / Author Growth Academy — free kids-book tips; expect coaching/affiliate upsells',
            'Children’s Book Marketing Made Easy podcast — listings + audience building',
            'Self Publishing Central — niche research methods; skip impulse tool buys',
          ],
          de: [
            'Erst wenn KDP-Setup, Formatierung, Keywords und Content-Regeln klar sind',
            'Reedsy-Bilderbuch-Kurs — wichtiger als generische „KDP-Geld“-Inhalte',
            'Harleigh Manske / Author Growth Academy — Free-Tipps; mit Coaching-/Affiliate-Upsells rechnen',
            'Podcast Children’s Book Marketing Made Easy — Listings + Audience',
            'Self Publishing Central — Recherche-Methoden; Tools nicht impulsiv kaufen',
          ],
        },
        note: {
          en: '⚠ Third-party creators change URLs and promote paid products — verify links and ignore guaranteed-income claims.',
          de: '⚠ Drittanbieter ändern URLs und bewerben Bezahlprodukte — Links prüfen, Einkommensgarantien ignorieren.',
        },
      },
      {
        heading: {
          en: 'Paid courses (when ready) — source ratings',
          de: 'Bezahlte Kurse (wenn bereit) — Quellen-Ratings',
        },
        bullets: {
          en: [
            'Udemy: Bestseller Book Marketing / Amazon KDP — source ~4.5★ (1,100+) as of config date — keywords, categories, launch',
            'Udemy: Kindle Launch — source ~4.4★ — first-book launch window',
            'Udemy/Class Central: AI kids storybook → KDP — relevant niche; verify AI disclosure advice',
            'Premium alternative: Kindlepreneur Authorpreneur Academy (~$179 source note)',
            'Avoid accelerators, done-for-you packages, and passive-income promises',
          ],
          de: [
            'Udemy: Bestseller Book Marketing / Amazon KDP — Quelle ca. 4,5★ (1.100+) zum Config-Datum — Keywords, Kategorien, Launch',
            'Udemy: Kindle Launch — Quelle ca. 4,4★ — Launch-Fenster fürs erste Buch',
            'Udemy/Class Central: KI-Kinderbuch → KDP — relevante Nische; KI-Disclosure prüfen',
            'Premium-Alternative: Kindlepreneur Authorpreneur Academy (Quellen ~179 $)',
            'Accelerators, Done-for-you und Passiv-Einkommens-Versprechen meiden',
          ],
        },
        note: {
          en: '⚠ Ratings and prices change — confirm on Udemy before buying. Free path first. Full cards in the panel below.',
          de: '⚠ Ratings und Preise ändern sich — vor Kauf auf Udemy prüfen. Zuerst Free-Pfad. Volle Karten im Panel unten.',
        },
      },
      {
        heading: { en: 'What to learn first', de: 'Zuerst lernen' },
        bullets: {
          en: [
            'KDP mechanics → children’s production → discoverability → validation → marketing/ads last',
            'See the ordered tables in the resources panel below',
          ],
          de: [
            'KDP-Mechanik → Kinderbuch-Produktion → Auffindbarkeit → Validierung → Marketing/Ads zuletzt',
            'Siehe die geordneten Tabellen im Ressourcen-Panel unten',
          ],
        },
      },
    ],
  },
  {
    id: 'inspiration',
    title: {
      en: 'Books for inspiration + Amazon.de study shelf',
      de: 'Bücher zur Inspiration + Amazon.de-Studier-Regal',
    },
    summary: {
      en: 'Beginner categories (SEL, bedtime, first experiences…), classics + SEL study shelf, deep-dive case studies (Koala, Giraffe, Wild Things, Goodnight Moon…), ages 2–4 / 3–6 sweet spot, StoryForge + Merch character loop. Ratings/reviews are snapshots ⚠ — never copy text/art.',
      de: 'Anfänger-Kategorien (SEL, Gute Nacht, erste Erfahrungen…), Klassiker- + SEL-Studier-Regal, Deep-Dive-Fallstudien (Koala, Giraffe, Wild Things, Goodnight Moon…), Sweet Spot Alter 2–4 / 3–6, StoryForge + Merch-Figuren-Loop. Ratings/Reviews sind Snapshots ⚠ — nie Text/Kunst kopieren.',
    },
    sections: [
      {
        heading: {
          en: 'Part 1 — Beginner categories (Amazon.de notes)',
          de: 'Teil 1 — Anfänger-Kategorien (Amazon.de-Notizen)',
        },
        bullets: {
          en: [
            'SEL / emotions (empathy, kindness, anger, confidence) — parents + teachers',
            'Bedtime & mindfulness — evergreen, short word count, repetitive calm language',
            'First experiences (school, sibling, move, potty) — high search intent',
            'Diversity & representation — validate density yourself ⚠',
            'Holiday / seasonal — spikes; evergreen still safer for year-round cashflow',
          ],
          de: [
            'SEL / Gefühle (Empathie, Freundlichkeit, Wut, Selbstvertrauen) — Eltern + Lehrkräfte',
            'Gute Nacht & Achtsamkeit — Evergreen, kurzer Text, repetitive Ruhe-Sprache',
            'Erste Erfahrungen (Schule, Geschwister, Umzug, Töpfchen) — hohe Suchabsicht',
            'Vielfalt & Repräsentation — Dichte selbst prüfen ⚠',
            'Feiertage / Saison — Spikes; Evergreen sicherer für Ganzjahres-Cashflow',
          ],
        },
        note: {
          en: '⚠ “Low competition” claims are guidance — confirm with live Amazon.de bestsellers. Full tips + Merch bridge in the panel.',
          de: '⚠ „Wenig Konkurrenz“-Claims sind Guidance — mit Live-Amazon.de-Bestsellern prüfen. Volle Tipps + Merch-Brücke im Panel.',
        },
      },
      {
        heading: {
          en: 'Part 2 — Study shelf & case studies',
          de: 'Teil 2 — Studier-Regal & Fallstudien',
        },
        bullets: {
          en: [
            'Classics: Guess How Much I Love You, Goodnight Moon, Where the Wild Things Are',
            'SEL: I Am Stronger Than Anger, Kindness Makes Me Stronger',
            'Adventure / rhyme: The Girl and the Dinosaur, The Koala Who Could, Giraffes Can’t Dance',
            'Notice: simple repetitive language, one message, short emotionally strong text, series potential',
            'Deep dives below: why each sells + KDP lessons (structure only — no copyrighted text)',
          ],
          de: [
            'Klassiker: Guess How Much I Love You, Goodnight Moon, Where the Wild Things Are',
            'SEL: I Am Stronger Than Anger, Kindness Makes Me Stronger',
            'Abenteuer / Reim: The Girl and the Dinosaur, The Koala Who Could, Giraffes Can’t Dance',
            'Achten auf: einfache Wiederholung, eine Botschaft, kurzer emotionaler Text, Serienpotenzial',
            'Deep Dives unten: warum jedes verkauft + KDP-Lektionen (nur Struktur — kein geschützter Text)',
          ],
        },
        note: {
          en: '⚠ Review counts and ★ change hourly — open Amazon.de before treating any number as current.',
          de: '⚠ Review-Zahlen und ★ ändern sich stündlich — Amazon.de öffnen, bevor Sie Zahlen als aktuell behandeln.',
        },
        links: [
          { label: 'Amazon.de Bestsellers', url: 'https://www.amazon.de/gp/bestsellers/books/' },
        ],
      },
      {
        heading: { en: 'Part 3 — Age groups', de: 'Teil 3 — Altersgruppen' },
        bullets: {
          en: [
            'Primary commercial focus in owner research: ages 2–4 (preschool animals/emotions/courage)',
            'Strong second: ages 3–6 (Kindergarten / institutional buyers)',
            'Tween 10–15: avoid as primary kids KDP focus for now — source cites sharp DE demographic decline (verify Börsenverein)',
          ],
          de: [
            'Primärer Fokus in Owner-Recherche: Alter 2–4 (Vorschule Tiere/Emotionen/Mut)',
            'Stark sekundär: Alter 3–6 (Kindergarten / institutionelle Käufer)',
            'Tween 10–15: vorerst nicht als primärer KDP-Kinderfokus — Quelle nennt starken DE-demografischen Rückgang (Börsenverein prüfen)',
          ],
        },
      },
      {
        heading: {
          en: 'Part 4 — Tools beyond Neolemon',
          de: 'Teil 4 — Tools jenseits von Neolemon',
        },
        bullets: {
          en: [
            'Most important free habit: Amazon.de Kinderbücher bestseller lists weekly',
            'Research: KDP Bookshelf, Publisher Rocket / KDP Spy (paid estimates ⚠), Kindlepreneur description tools',
            'SEO: Keyword Planner, Ubersuggest, AnswerThePublic (DE phrases)',
            'Create: StoryForge pinned anchor → Canva / InDesign / Procreate as needed',
            'DE rhyme: DeepL draft + native translator — never ship machine rhyme alone',
          ],
          de: [
            'Wichtigste Free-Routine: wöchentlich Amazon.de Kinderbuch-Bestseller',
            'Recherche: KDP Bookshelf, Publisher Rocket / KDP Spy (bezahlte Schätzungen ⚠), Kindlepreneur-Beschreibungen',
            'SEO: Keyword Planner, Ubersuggest, AnswerThePublic (DE-Phrasen)',
            'Erstellen: StoryForge-Anker → bei Bedarf Canva / InDesign / Procreate',
            'DE-Reim: DeepL-Entwurf + Native-Übersetzer — nie Maschinenreim allein live schalten',
          ],
        },
        links: [
          { label: 'Amazon.de Bestsellers', url: 'https://www.amazon.de/gp/bestsellers/books/' },
          { label: 'KDP', url: 'https://kdp.amazon.com/' },
        ],
      },
    ],
  },
  {
    id: 'publish-what',
    title: {
      en: 'What to publish first (Amazon.de data notes)',
      de: 'Was zuerst veröffentlichen (Amazon.de-Daten-Notizen)',
    },
    summary: {
      en: 'Owner research snapshot (Oct 2026): start with German picture books ages 2–6 — animal + courage/emotional change + rhyme. Avoid handwriting workbooks. Kindness only inside a story with conflict. Verify ranks live weekly ⚠.',
      de: 'Owner-Research-Snapshot (Okt 2026): starten mit deutschen Bilderbüchern Alter 2–6 — Tier + Mut/emotionale Veränderung + Reim. Schreibhefte meiden. Freundlichkeit nur in Story mit Konflikt. Ränge wöchentlich live prüfen ⚠.',
    },
    sections: [
      {
        heading: {
          en: 'What the DE kids charts emphasise',
          de: 'Was DE-Kindercharts betonen',
        },
        bullets: {
          en: [
            'Courage / Mut, emotional bonds, animals/nature, adventure, early reading, fantasy, activity books all appear in owner’s Oct 2026 notes',
            'Strongest indie-friendly start: picture books combining courage + emotional themes',
            'Example pattern cited: Geh deinen Weg, Schildkröte (Koala Who Could family) — study structure, write original German text',
          ],
          de: [
            'Mut, Bindung, Tiere/Natur, Abenteuer, Erstlesen, Fantasy, Aktivität erscheinen in Owner-Notizen Okt 2026',
            'Stärkster Indie-Start: Bilderbücher mit Mut + Emotionsthemen',
            'Genanntes Muster: Geh deinen Weg, Schildkröte (Koala-Who-Could-Familie) — Struktur studieren, eigenen DE-Text schreiben',
          ],
        },
        note: {
          en: '⚠ Chart positions change hourly — open Amazon.de bestsellers before you commit. Full tables in the panel below.',
          de: '⚠ Chart-Positionen ändern sich stündlich — Amazon.de-Bestseller öffnen, bevor Sie sich festlegen. Volle Tabellen im Panel unten.',
        },
        links: [
          { label: 'Amazon.de Bestsellers', url: 'https://www.amazon.de/gp/bestsellers/books/' },
        ],
      },
      {
        heading: {
          en: 'Category answers (picture / emotions / letters / kindness / writing)',
          de: 'Kategorie-Antworten (Bilderbuch / Emotionen / Buchstaben / Freundlichkeit / Schreiben)',
        },
        bullets: {
          en: [
            '✅ Start: picture books courage + animals + rhyme (ages ~2–6)',
            '✅ Strong: emotional bonds / feelings / early reading (with pedagogical care)',
            '⚠️ Kindness only embedded in conflict+resolution stories',
            '❌ Avoid handwriting workbooks as primary indie KDP (Klett/Cornelsen/Westermann territory)',
          ],
          de: [
            '✅ Start: Bilderbücher Mut + Tiere + Reim (Alter ca. 2–6)',
            '✅ Stark: Bindung / Gefühle / Erstlesen (mit pädagogischer Sorgfalt)',
            '⚠️ Freundlichkeit nur in Stories mit Konflikt+Lösung',
            '❌ Schreibhefte als primäres Indie-KDP meiden (Klett/Cornelsen/Westermann-Territorium)',
          ],
        },
      },
    ],
  },
  {
    id: 'german-first',
    title: {
      en: 'How to start KDP in Germany — language & market',
      de: 'KDP in Deutschland starten — Sprache & Markt',
    },
    summary: {
      en: 'Sequence German → English → bilingual. Preschool/picture first; bilingual kids pairs (EN/TR/AR proven; Igbo/Twi/Swahili↔DE underserved). All %/€ ⚠.',
      de: 'Sequenz Deutsch → Englisch → bilingual. Zuerst Vorschule/Bilderbuch; bilinguale Paare (EN/TR/AR bewiesen; Igbo/Twi/Swahili↔DE unterversorgt). Alle %/€ ⚠.',
    },
    sections: [
      {
        heading: {
          en: 'Strategic answer: sequence languages',
          de: 'Strategische Antwort: Sprachen sequenzieren',
        },
        bullets: {
          en: [
            'Phase 1: German — parents, schools, libraries + Tolino/Libreka domestic reach',
            'Phase 2: English editions (same art, new text) on .com / .co.uk after DE traction',
            'Phase 3: bilingual — EN/FR/ES/TR/AR↔DE have Amazon.de catalogue proof; African-language↔DE often empty (first-mover or unproven)',
            'Heritage-language pairs: validate in diaspora Facebook/WhatsApp groups before print; keywords in both languages',
          ],
          de: [
            'Phase 1: Deutsch — Eltern, Schulen, Bibliotheken + Tolino/Libreka Inland',
            'Phase 2: EN-Ausgaben (gleiche Kunst, neuer Text) auf .com / .co.uk nach DE-Traktion',
            'Phase 3: bilingual — EN/FR/ES/TR/AR↔DE mit Amazon.de-Katalog-Belegen; afrikanische Sprachen↔DE oft leer (First-Mover oder unbewiesen)',
            'Heritage-Language-Paare: in Diaspora-Facebook-/WhatsApp-Gruppen validieren vor Print; Keywords in beiden Sprachen',
          ],
        },
        note: {
          en: '⚠ PublishDrive growth % can reflect a smaller German indie base. Verify Börsenverein / PublishDrive / live KDP calculator / Amazon.de bilingual search before citing. Full bilingual kids module: Amazon Hub → Language & market.',
          de: '⚠ PublishDrive-Wachstums-% können eine kleinere DE-Indie-Basis widerspiegeln. Börsenverein / PublishDrive / Live-KDP-Rechner / Amazon.de-Bilingual-Suche prüfen. Volles Bilingual-Kids-Modul: Amazon Hub → Sprache & Markt.',
        },
      },
      {
        heading: {
          en: 'What the market numbers support',
          de: 'Was die Marktzahlen stützen',
        },
        bullets: {
          en: [
            'Children’s & YA hold ~flat in a contracting overall DE book market (defensive niche)',
            'German-language indie KDP growth cited far above English-in-DE in PublishDrive notes',
            'Audiobooks among fastest-growing formats — German read-aloud add-on is low-risk upside',
            'Ages 10–15 demographic decline is sharp — preschool/picture (parent-bought) insulated',
          ],
          de: [
            'Kinder & Jugend halten flach in einem rückläufigen Gesamtmarkt (defensives Segment)',
            'DE-sprachiges Indie-KDP-Wachstum in PublishDrive-Notizen weit über EN-in-DE',
            'Hörbücher unter den am schnellsten wachsenden Formaten — DE-Vorlese-Add-on ist Low-Risk-Upside',
            'Demografie 10–15 stark rückläufig — Vorschul-/Bilderbuch (Elternkauf) eher entkoppelt',
          ],
        },
        links: [
          { label: 'Börsenverein', url: 'https://www.boersenverein.de/' },
          { label: 'KDP', url: 'https://kdp.amazon.com/' },
        ],
      },
    ],
  },
  {
    id: 'merch-ops',
    defaultOpen: false,
    title: {
      en: 'Merch on Demand — full guide (DE)',
      de: 'Merch on Demand — Vollständiger Guide (DE)',
    },
    summary: {
      en: 'Complementary income to KDP: upload designs, Amazon prints & ships, you earn a royalty. Reuse StoryForge / book characters on tees, totes, and hoodies. Config tables below are estimates with ⚠ — verify in Merch.',
      de: 'Ergänzung zu KDP: Design hochladen, Amazon druckt & versendet, Sie erhalten Royalty. StoryForge-/Buchfiguren auf Tees, Taschen und Hoodies. Tabellen unten = Schätzungen mit ⚠ — in Merch prüfen.',
    },
    sections: [
      {
        heading: { en: '1. What it is & how it works', de: '1. Was es ist & wie es funktioniert' },
        bullets: {
          en: [
            'Upload artwork → choose products (tees, hoodies, totes, cases…) → set price',
            'Amazon prints, packs, and ships each order — zero inventory, zero shipping ops',
            'You receive a royalty per sale (list price minus Amazon base cost)',
            'KDP link: the same children’s characters become Merch designs — book → matching tee is a classic brand extension',
          ],
          de: [
            'Design hochladen → Produkte wählen (Tees, Hoodies, Taschen…) → Preis setzen',
            'Amazon druckt, verpackt und versendet — kein Lager, kein Versandaufwand',
            'Royalty je Verkauf (Listenpreis minus Amazon-Basiskosten)',
            'KDP-Link: dieselben Kinderbuch-Figuren werden Merch-Motive — Buch → passendes Shirt ist Marken-Extension',
          ],
        },
      },
      {
        heading: { en: '2. Apply (do this now)', de: '2. Bewerben (jetzt)' },
        bullets: {
          en: [
            'Go to merch.amazon.com → Request Invitation',
            'Sign in with your Amazon.de account',
            'Provide legal name, German address, tax interview (same W-8BEN idea as KDP), DE IBAN',
            'Short description of planned designs (kids characters / book brand)',
            'Apply in parallel with KDP — do not wait until the book is live',
          ],
          de: [
            'merch.amazon.com → Einladung anfordern',
            'Mit Amazon.de-Konto anmelden',
            'Rechtsname, DE-Adresse, Steuerinterview (wie bei KDP / W-8BEN), DE-IBAN',
            'Kurze Beschreibung geplanter Motive (Kinderfiguren / Buchmarke)',
            'Parallel zu KDP bewerben — nicht auf das Live-Buch warten',
          ],
        },
        links: [{ label: 'Merch on Demand', url: 'https://merch.amazon.com/' }],
        note: {
          en: '⚠ Approval can take from a few days to several weeks — confirm current wait experience yourself.',
          de: '⚠ Freigabe kann Tage bis mehrere Wochen dauern — aktuelle Wartezeit selbst prüfen.',
        },
      },
      {
        heading: { en: '3. Tier mindset', de: '3. Tier-Logik' },
        bullets: {
          en: [
            'Merch limits how many designs can be live at once',
            'Higher tiers unlock with cumulative sales (see config table below)',
            'First tier: quality over quantity — research German kids demand before each upload',
          ],
          de: [
            'Merch begrenzt gleichzeitig live Designs',
            'Höhere Tiers durch kumulierte Verkäufe (siehe Tabelle unten)',
            'Erster Tier: Qualität vor Quantität — deutschen Kindermarkt vor jedem Upload recherchieren',
          ],
        },
      },
      {
        heading: { en: '4. Create designs', de: '4. Designs erstellen' },
        bullets: {
          en: [
            'PNG + transparent background; high DPI; RGB — exact px/MB in the file-spec table below',
            'No copyrighted characters, trademarked slogans, or celebrity likenesses',
            'Best path: pin a Character Turbo anchor in StoryForge (desktop), then export a Merch-ready PNG',
            'If using an external illustrator: require 300 DPI transparent PNGs in the contract from day one',
          ],
          de: [
            'PNG + transparenter Hintergrund; hohe DPI; RGB — exakte px/MB in der Spez-Tabelle unten',
            'Keine fremden Markenfiguren, Slogans oder Celebrity-Likenesses',
            'Bester Weg: Character-Turbo-Anker in StoryForge (Desktop) pinnen, dann Merch-PNG exportieren',
            'Externe Illustrator:innen: ab Tag 1 300-DPI-PNG mit Transparenz vertraglich verlangen',
          ],
        },
      },
      {
        heading: {
          en: '5. What actually sells — four design types',
          de: '5. Was wirklich verkauft — vier Design-Typen',
        },
        bullets: {
          en: [
            '1) Character portrait (core asset): clean, centred book character on a plain/simple background — often your top seller. Variations: left/right, full body, face only, with props',
            '2) Quote + character: short memorable DE phrase + character (e.g. “Ich trau mich!”, “Schritt für Schritt”) — parents buy educational/values messaging',
            '3) Seasonal: same character for DE moments — Weihnachtsmütze, Osterkorb, “Ich bin 3!” birthday — sales spike in season',
            '4) Matching family: child playful version + adult minimalist version; “Mama & Ich” / “Papa & Ich” — gift-friendly, often premium price',
          ],
          de: [
            '1) Figuren-Portrait (Kernasset): klare, zentrierte Buchfigur auf schlichtem Hintergrund — oft Top-Seller. Varianten: links/rechts, Ganzkörper, nur Gesicht, mit Props',
            '2) Spruch + Figur: kurze DE-Phrase + Figur (z. B. „Ich trau mich!“, „Schritt für Schritt“) — Eltern kaufen Werte-/Bildungsbotschaften',
            '3) Saisonal: dieselbe Figur für DE-Anlässe — Weihnachtsmütze, Osterkorb, „Ich bin 3!“ — starke Peak-Phasen',
            '4) Family-Match: Kind spielerisch + Erwachsene minimalistisch; „Mama & Ich“ / „Papa & Ich“ — geschenkstark, oft Premiumpreis',
          ],
        },
        note: {
          en: 'These are market patterns to test — not guarantees. Validate with Amazon.de research before uploading.',
          de: 'Markt-Muster zum Testen — keine Garantie. Vor Upload mit Amazon.de-Recherche validieren.',
        },
      },
      {
        heading: {
          en: '6. Maximising first ~10 slots (Tier start)',
          de: '6. Erste ~10 Slots maximieren (Tier-Start)',
        },
        rows: [
          {
            label: { en: '1', de: '1' },
            detail: {
              en: 'Character portrait — white / light background T-shirt',
              de: 'Figuren-Portrait — weißes / helles T-Shirt',
            },
          },
          {
            label: { en: '2', de: '2' },
            detail: {
              en: 'Character portrait — coloured background T-shirt',
              de: 'Figuren-Portrait — farbiges T-Shirt',
            },
          },
          {
            label: { en: '3', de: '3' },
            detail: {
              en: 'Character + German quote — T-shirt',
              de: 'Figur + deutscher Spruch — T-Shirt',
            },
          },
          {
            label: { en: '4', de: '4' },
            detail: {
              en: 'Character portrait — tote bag',
              de: 'Figuren-Portrait — Tragetasche',
            },
          },
          {
            label: { en: '5', de: '5' },
            detail: {
              en: 'Character + quote — hoodie',
              de: 'Figur + Spruch — Hoodie',
            },
          },
          {
            label: { en: '6', de: '6' },
            detail: {
              en: 'Seasonal (next DE season approaching)',
              de: 'Saisonal (nächste DE-Saison)',
            },
          },
          {
            label: { en: '7', de: '7' },
            detail: {
              en: 'Character portrait — children’s size T-shirt',
              de: 'Figuren-Portrait — Kindergröße T-Shirt',
            },
          },
          {
            label: { en: '8', de: '8' },
            detail: {
              en: 'Minimalist silhouette — adult T-shirt',
              de: 'Minimalistische Silhouette — Erwachsenen-T-Shirt',
            },
          },
          {
            label: { en: '9', de: '9' },
            detail: {
              en: 'Gift / name-style prompt design — T-shirt (your original art only)',
              de: 'Geschenk- / Namens-Motiv — T-Shirt (nur eigene Kunst)',
            },
          },
          {
            label: { en: '10', de: '10' },
            detail: {
              en: '“Mama & Ich” or “Papa & Ich” matching design',
              de: '„Mama & Ich“ oder „Papa & Ich“ Matching-Design',
            },
          },
        ],
        note: {
          en: '⚠ Exact live-design limits and unlock tiers change — confirm in your Merch account. Goal: cover products, audiences, and occasions to earn early sales.',
          de: '⚠ Exakte Live-Limits und Freischaltungen ändern sich — im Merch-Konto prüfen. Ziel: Produkte, Zielgruppen und Anlässe abdecken für frühe Verkäufe.',
        },
      },
      {
        heading: { en: '7. Next: ads, IP & scale', de: '7. Weiter: Ads, IP & Skalierung' },
        bullets: {
          en: [
            'Do not burn budget on ads at the first small tier — build organic listings first',
            'Full playbook for Merch ads, DPMA/Brand Registry, FBA/Etsy/Shopify scale, and outlook → open “Merch scale & brand empire” below',
          ],
          de: [
            'Kein Ad-Budget im ersten kleinen Tier verbrennen — zuerst organische Listings',
            'Vollständiges Playbook zu Merch-Ads, DPMA/Brand Registry, FBA/Etsy/Shopify und Ausblick → „Merch-Skalierung & Marken-Ökosystem“ unten öffnen',
          ],
        },
      },
    ],
  },
  {
    id: 'research-de',
    title: {
      en: 'Research the German kids market',
      de: 'Deutschen Kindermarkt recherchieren',
    },
    summary: {
      en: 'Before burning Merch slots: Amazon.de signals, Trends seasonality, social taste checks, optional paid tools. No scraping.',
      de: 'Bevor Merch-Slots verbrennen: Amazon.de-Signale, Trends-Saisonalität, Social-Checks, optionale Tools. Kein Scraping.',
    },
    sections: [
      {
        heading: { en: 'Free — Amazon.de', de: 'Kostenlos — Amazon.de' },
        bullets: {
          en: [
            'Browse Best Sellers in kids fashion / toys — note animals, phrases, prices, review counts, colours',
            'Use search autocomplete (“Koala Kinder”, “Tier Kinder T-Shirt”, “Kinderbuch Geschenk”) as real query seeds',
            'Open top listings → “Customers also bought” / “Frequently bought together” for theme clusters',
            'Write findings in your own notes — do not treat any third-party “live BSR dump” as truth without re-checking',
          ],
          de: [
            'Bestseller in Kindermode / Spielzeug — Tiere, Sprüche, Preise, Reviews, Farben notieren',
            'Autocomplete (“Koala Kinder”, “Tier Kinder T-Shirt”, “Kinderbuch Geschenk”) als echte Suchkeime',
            'Top-Listings → „Kunden kauften auch“ / „Wird häufig zusammen gekauft“ für Themen-Cluster',
            'Eigene Notizen — keine fremden „Live-BSR-Dumps“ ohne erneute Prüfung als Fakt behandeln',
          ],
        },
        links: [
          { label: 'Amazon.de', url: 'https://www.amazon.de/' },
          {
            label: 'Fashion bestsellers (example path)',
            url: 'https://www.amazon.de/gp/bestsellers/fashion/',
          },
        ],
      },
      {
        heading: { en: 'Free — Trends & social', de: 'Kostenlos — Trends & Social' },
        bullets: {
          en: [
            'Google Trends (Germany): gift/kids apparel interest often peaks Oct–Dec — have Christmas designs live by early autumn',
            'Pinterest.de / Instagram: scan recent pins/posts for animal motifs and short DE phrases (taste signal, not BSR)',
            'Etsy.de: sort relevant kids tees — note clean designs, short text, age-specific phrases',
          ],
          de: [
            'Google Trends (Deutschland): Geschenk/Kindermode oft Peak Okt–Dez — Weihnachtsmotive früh im Herbst live',
            'Pinterest.de / Instagram: aktuelle Pins/Posts zu Tiermotiven und kurzen DE-Sprüchen (Geschmack, nicht BSR)',
            'Etsy.de: relevante Kinder-Tees — klare Motive, kurzer Text, altersbezogene Phrasen notieren',
          ],
        },
        links: [
          { label: 'Google Trends DE', url: 'https://trends.google.de/' },
          { label: 'Pinterest', url: 'https://www.pinterest.de/' },
          { label: 'Etsy', url: 'https://www.etsy.com/' },
        ],
      },
      {
        heading: { en: 'Paid tools (optional)', de: 'Bezahlte Tools (optional)' },
        bullets: {
          en: [
            'Merch-focused research tools (e.g. Merch Informer) — useful for BSR/keyword ideas; cancel after intensive research weeks',
            'KDP keyword tools (e.g. Publisher Rocket) — book search demand often maps to related merch queries',
            'FBA suites (e.g. Helium 10 free tier) — reverse-ASIN / magnet-style keyword expansion on Amazon.de',
            'Always verify pricing and DE marketplace coverage on the vendor site before subscribing',
          ],
          de: [
            'Merch-Recherche-Tools (z. B. Merch Informer) — BSR/Keyword-Ideen; nach intensiven Wochen kündigen',
            'KDP-Keyword-Tools (z. B. Publisher Rocket) — Buchnachfrage oft verwandt mit Merch-Suchen',
            'FBA-Suites (z. B. Helium 10 Free Tier) — Reverse-ASIN / Keyword-Expansion auf Amazon.de',
            'Preise und DE-Abdeckung immer auf der Anbieterseite prüfen',
          ],
        },
        note: {
          en: '⚠ Tool prices, features, and estimates change — treat sales estimates as rough, not accounting.',
          de: '⚠ Tool-Preise, Features und Schätzungen ändern sich — Verkaufsschätzungen nur grob, keine Buchhaltung.',
        },
      },
      {
        heading: { en: 'Research loop (per design)', de: 'Recherche-Loop (pro Design)' },
        bullets: {
          en: [
            'Seed keyword → autocomplete list → open top 10 listings',
            'Note animal/phrase/price/reviews → optional reverse-ASIN keywords',
            'Only then create an original design (never copy)',
            'Hypotheses to test: animals + short DE values · seasonal · clean art · gift language',
          ],
          de: [
            'Seed-Keyword → Autocomplete → Top-10-Listings öffnen',
            'Tier/Spruch/Preis/Reviews notieren → optional Reverse-ASIN-Keywords',
            'Erst dann eigenes Original-Design (niemals kopieren)',
            'Hypothesen: Tiere + kurze DE-Werte · saisonal · klar · Geschenk-Sprache',
          ],
        },
      },
    ],
  },
  {
    id: 'brand-loop',
    title: {
      en: 'KDP ↔ Merch brand loop',
      de: 'KDP ↔ Merch Marken-Loop',
    },
    summary: {
      en: 'Connect book and merch so each sale feeds the other — Author Central, back matter, series characters. This is what separates a book brand from a random Merch seller.',
      de: 'Buch und Merch verbinden — Author Central, Nachsatzseiten, Serienfiguren. Das trennt eine Buchmarke von einem zufälligen Merch-Seller.',
    },
    sections: [
      {
        heading: { en: '1. Author Central (free)', de: '1. Author Central (kostenlos)' },
        bullets: {
          en: [
            'Set up author.amazon.de — bio, photo, upcoming titles, blog feed where useful',
            'Add your Merch / storefront URL in the biography where allowed',
            'Parents who finish a book often open the author page next — that is your brand hub on Amazon.de',
          ],
          de: [
            'author.amazon.de einrichten — Bio, Foto, kommende Titel, ggf. Blog',
            'Merch-/Storefront-URL in der Biografie verlinken, wo erlaubt',
            'Eltern öffnen nach dem Buch oft die Autorenseite — Ihr Marken-Hub auf Amazon.de',
          ],
        },
        links: [{ label: 'Author Central DE', url: 'https://author.amazon.de/' }],
      },
      {
        heading: { en: '2. Inside the KDP book', de: '2. Im KDP-Buch' },
        bullets: {
          en: [
            'Last 1–2 pages: “Magst du [Figur]? Entdecke mehr!” + Author Central URL',
            'Optional simple mockup of your character on a tee (your art only)',
            'Stay within KDP content guidelines — no spammy QR/redirect schemes',
          ],
          de: [
            'Letzte 1–2 Seiten: „Magst du [Figur]? Entdecke mehr!“ + Author-Central-URL',
            'Optional einfaches Tee-Mockup der Figur (nur eigene Kunst)',
            'KDP-Inhaltsrichtlinien einhalten — keine Spam-QR/Redirect-Tricks',
          ],
        },
      },
      {
        heading: { en: '3. Book series → Merch ranges', de: '3. Buchserie → Merch-Linien' },
        bullets: {
          en: [
            'Each new book can introduce a named character = new Merch design range',
            'Named characters with one clear value (courage, kindness…) travel better than generic animals',
            'By book three you can run several character ranges in parallel if tiers allow',
          ],
          de: [
            'Jedes neue Buch kann eine benannte Figur = neue Merch-Linie bringen',
            'Benannte Figuren mit einem klaren Wert (Mut, Freundlichkeit…) tragen besser als generische Tiere',
            'Ab Buch drei können mehrere Figurenlinien parallel laufen, wenn Tiers es erlauben',
          ],
        },
      },
      {
        heading: {
          en: '4. Series growth pattern (illustrative only)',
          de: '4. Serien-Wachstumsmuster (nur illustrativ)',
        },
        rows: [
          {
            label: { en: 'Book 1', de: 'Buch 1' },
            detail: {
              en: 'Character A · ~10–20 Merch designs · illustrative Merch ~€200–€500/mo once selling',
              de: 'Figur A · ca. 10–20 Merch-Designs · illustrativ Merch ca. 200–500 €/Mon. bei Verkäufen',
            },
          },
          {
            label: { en: 'Book 2', de: 'Buch 2' },
            detail: {
              en: 'Character B range added · illustrative combined Merch ~€400–€1,000/mo',
              de: 'Figur-B-Linie dazu · illustrativ kombiniert Merch ca. 400–1.000 €/Mon.',
            },
          },
          {
            label: { en: 'Book 3', de: 'Buch 3' },
            detail: {
              en: 'Character C range · illustrative combined Merch ~€700–€1,800/mo',
              de: 'Figur-C-Linie · illustrativ kombiniert Merch ca. 700–1.800 €/Mon.',
            },
          },
          {
            label: { en: 'Book 4', de: 'Buch 4' },
            detail: {
              en: 'Character D range · illustrative combined Merch ~€1,100–€2,800/mo',
              de: 'Figur-D-Linie · illustrativ kombiniert Merch ca. 1.100–2.800 €/Mon.',
            },
          },
        ],
        note: {
          en: '⚠ Not a forecast. Many titles earn less or nothing. Track your own Merch reports.',
          de: '⚠ Keine Prognose. Viele Titel verdienen weniger oder nichts. Eigene Merch-Reports tracken.',
        },
      },
    ],
  },
  {
    id: 'merch-scale',
    title: {
      en: 'Merch scale & brand empire',
      de: 'Merch-Skalierung & Marken-Ökosystem',
    },
    summary: {
      en: 'Ads timing, trademark/Brand Registry, scaling beyond Merch (FBA / Etsy / Shopify), and how the full ecosystem fits together. All € figures are illustrative.',
      de: 'Ad-Timing, Marke/Brand Registry, Skalierung jenseits Merch (FBA / Etsy / Shopify) und das Gesamt-Ökosystem. Alle €-Angaben nur illustrativ.',
    },
    sections: [
      {
        heading: { en: '1. Merch ads — when to start', de: '1. Merch-Ads — wann starten' },
        bullets: {
          en: [
            'At the first small tier: spend time on organic listings and research, not ads',
            'Ads tend to make sense only after you have organic winners, a higher tier, and a small daily test budget (often cited ~€5–€10/campaign — verify)',
            'Sponsored Products for Merch usually runs via Seller Central (separate from the KDP dashboard)',
            'Example DE keyword seeds to test: “Koala Kinder T-Shirt”, “Lustiges Tiershirt Kind”, “Kinderbuch Geschenk” — use your own character terms',
            'Start automatic targeting briefly to harvest search terms, then move winning terms to manual',
            'ACOS heuristic: if royalty is ~€7–€9, many sellers aim ~30–40% ACOS so ads stay under royalty headroom — calculate with your live royalty',
            'Never advertise designs that do not already convert organically',
          ],
          de: [
            'Im ersten kleinen Tier: Zeit in organische Listings und Recherche, nicht in Ads',
            'Ads oft erst sinnvoll mit organischen Gewinnern, höherem Tier und kleinem Tagesbudget (oft ca. 5–10 €/Kampagne genannt — prüfen)',
            'Sponsored Products für Merch meist über Seller Central (getrennt vom KDP-Dashboard)',
            'Beispiel-DE-Keywords: „Koala Kinder T-Shirt“, „Lustiges Tiershirt Kind“, „Kinderbuch Geschenk“ — eigene Figurenbegriffe nutzen',
            'Kurz Automatic Targeting für Suchbegriffe, dann Gewinner manuell',
            'ACOS-Heuristik: bei ca. 7–9 € Royalty zielen viele auf ca. 30–40 % ACOS — mit Ihrer Live-Royalty rechnen',
            'Nie Designs bewerben, die organisch nicht konvertieren',
          ],
        },
        note: {
          en: '⚠ Ad products, eligibility, and best practices change — confirm in Seller Central / Merch help.',
          de: '⚠ Ad-Produkte, Zugang und Best Practices ändern sich — in Seller Central / Merch-Help prüfen.',
        },
      },
      {
        heading: { en: '2. Trademark & Brand Registry', de: '2. Marke & Brand Registry' },
        bullets: {
          en: [
            'Successful characters get copied on Amazon — trademark improves your options',
            'DPMA (dpma.de): word mark for the character name + figurative mark for the logo/illustration',
            'Common classes to discuss with counsel: 16 (books/print) and 25 (clothing)',
            'Fees/processing often cited around a few hundred € per class and a few months — verify current DPMA fees and timelines',
            'Heuristic: wait until Merch is generating consistent monthly sales (e.g. ~€200+/mo cited in many playbooks) before paying registration costs',
            'With a registered (or pending) mark, enrol in Amazon Brand Registry for listing control and copycat reporting tools',
          ],
          de: [
            'Erfolgreiche Figuren werden auf Amazon kopiert — eine Marke verbessert Ihre Optionen',
            'DPMA (dpma.de): Wortmarke für den Figurenamen + Bildmarke für Logo/Illustration',
            'Mit Anwalt/in typische Klassen prüfen: 16 (Bücher/Druck) und 25 (Kleidung)',
            'Gebühren/Dauer oft „einige hundert € je Klasse“ und Monate — aktuelle DPMA-Gebühren und Fristen prüfen',
            'Heuristik: warten, bis Merch konsistent Umsatz macht (in vielen Guides ca. 200+ €/Mon.), bevor Sie registrieren',
            'Mit eingetragener (oder anhängiger) Marke: Amazon Brand Registry für Listing-Kontrolle und Copycat-Meldungen',
          ],
        },
        links: [
          { label: 'DPMA', url: 'https://www.dpma.de/' },
          { label: 'Brand Registry', url: 'https://brandregistry.amazon.com/' },
        ],
        note: {
          en: '⚠ Not legal advice. Confirm classes, fees, and Brand Registry eligibility with counsel / official sites.',
          de: '⚠ Keine Rechtsberatung. Klassen, Gebühren und Brand-Registry-Zugang mit Anwalt/in / offiziellen Seiten klären.',
        },
      },
      {
        heading: { en: '3. Scale beyond Merch', de: '3. Skalierung jenseits Merch' },
        bullets: {
          en: [
            'White-label / FBA: only for proven Merch top sellers — inventory risk; illustrative margins can beat Merch royalties but verify landed cost + fees',
            'Etsy.de + Printful/Printify: same art, different shoppers; you set price and pay POD base cost',
            'Own webshop (e.g. Shopify + Printful): email list, promos, less Amazon dependency — monthly platform cost only when traction exists',
            'Do not open all channels on day one — earn signal on Merch/KDP first',
          ],
          de: [
            'White-Label / FBA: nur für bewährte Merch-Top-Seller — Lagerrisiko; Margen können Merch schlagen — Einkauf + Gebühren prüfen',
            'Etsy.de + Printful/Printify: dieselbe Kunst, andere Käufer; Sie setzen Preis und zahlen POD-Basis',
            'Eigener Shop (z. B. Shopify + Printful): E-Mail-Liste, Aktionen, weniger Amazon-Abhängigkeit — Plattformkosten erst bei Traction',
            'Nicht alle Kanäle am Tag 1 öffnen — zuerst Signal auf Merch/KDP',
          ],
        },
      },
      {
        heading: {
          en: '4. Ecosystem — everything feeding everything',
          de: '4. Ökosystem — alles speist alles',
        },
        bullets: {
          en: [
            'Children’s book brand → KDP books + Merch on Demand (royalties)',
            'Author Central = free hub linking both on Amazon.de',
            'Later: Associates commissions + ACX/Audible royalties',
            'Social (Instagram/Pinterest DE parenting niche) feeds discovery',
            'Long-term: Shopify + Etsy for direct / POD sales',
            'Loop: parent finds book → Author Central → Merch tee → social → book 2 → shares with other parents',
          ],
          de: [
            'Kinderbuch-Marke → KDP-Bücher + Merch on Demand (Royalties)',
            'Author Central = kostenloser Hub, der beides auf Amazon.de verbindet',
            'Später: PartnerNet-Provisionen + ACX/Audible-Royalties',
            'Social (Instagram/Pinterest DE-Eltern-Nische) für Entdeckung',
            'Langfristig: Shopify + Etsy für Direkt-/POD-Verkauf',
            'Loop: Eltern finden Buch → Author Central → Merch-Tee → Social → Buch 2 → teilen',
          ],
        },
      },
      {
        heading: { en: '5. Do today', de: '5. Heute tun' },
        bullets: {
          en: [
            'Apply at merch.amazon.com if you have not already — waitlist time is tier-building time lost',
            'Finish your first researched 10-slot plan using the four design types',
          ],
          de: [
            'Falls noch nicht: merch.amazon.com beantragen — Wartezeit = verlorene Tier-Zeit',
            'Ersten recherchierten 10-Slot-Plan mit den vier Design-Typen fertigstellen',
          ],
        },
        links: [{ label: 'Merch on Demand', url: 'https://merch.amazon.com/' }],
      },
    ],
  },
  {
    id: 'milestones',
    title: {
      en: 'Milestones, outlook & next programmes',
      de: 'Meilensteine, Ausblick & nächste Programme',
    },
    summary: {
      en: 'Targets and illustrative 3-year bands — not promises. Track real royalties in KDP/Merch reports.',
      de: 'Ziele und illustrative 3-Jahres-Bänder — keine Versprechen. Echte Royalties in KDP/Merch-Reports tracken.',
    },
    sections: [
      {
        heading: { en: 'Key milestones to track', de: 'Wichtige Meilensteine' },
        rows: [
          {
            label: { en: 'Month 1–2', de: 'Monat 1–2' },
            detail: {
              en: 'Merch account approved (or still waiting — keep creating)',
              de: 'Merch-Konto freigegeben (oder Warteliste — weiter produzieren)',
            },
          },
          {
            label: { en: 'Month 2–3', de: 'Monat 2–3' },
            detail: {
              en: 'First 10 researched designs live',
              de: 'Erste 10 recherchierte Designs live',
            },
          },
          {
            label: { en: 'Month 3–4', de: 'Monat 3–4' },
            detail: {
              en: 'First Merch sale',
              de: 'Erster Merch-Verkauf',
            },
          },
          {
            label: { en: 'Month 3–5', de: 'Monat 3–5' },
            detail: {
              en: 'First KDP picture book live + Author Central',
              de: 'Erstes KDP-Bilderbuch live + Author Central',
            },
          },
          {
            label: { en: 'Month 4–6', de: 'Monat 4–6' },
            detail: {
              en: 'Next Merch tier unlock (verify your account rules)',
              de: 'Nächste Merch-Tier-Freischaltung (Kontoregeln prüfen)',
            },
          },
          {
            label: { en: 'Month 6–8', de: 'Monat 6–8' },
            detail: {
              en: 'Illustrative target: ~€500 combined monthly (not guaranteed)',
              de: 'Illustratives Ziel: ca. 500 € kombiniert/Mon. (keine Garantie)',
            },
          },
          {
            label: { en: 'Month 8–12', de: 'Monat 8–12' },
            detail: {
              en: 'Higher Merch tier if sales continue (verify unlocks)',
              de: 'Höherer Merch-Tier bei anhaltenden Verkäufen (Freischaltungen prüfen)',
            },
          },
          {
            label: { en: 'Month 10–16', de: 'Monat 10–16' },
            detail: {
              en: 'Consider DPMA + Brand Registry if sales sustain',
              de: 'DPMA + Brand Registry prüfen, wenn Umsatz trägt',
            },
          },
          {
            label: { en: 'Month 12–30', de: 'Monat 12–30' },
            detail: {
              en: 'Illustrative stretch: €1,500 → €3,000+ combined monthly if books + Merch compound',
              de: 'Illustrativer Stretch: 1.500 → 3.000+ € kombiniert/Mon., wenn Bücher + Merch skalieren',
            },
          },
        ],
        note: {
          en: '⚠ Dates and € targets are planning aids only — many founders move slower or earn less.',
          de: '⚠ Daten und €-Ziele nur Planungshilfe — viele Gründer:innen sind langsamer oder verdienen weniger.',
        },
      },
      {
        heading: {
          en: 'Illustrative 3-year combined outlook',
          de: 'Illustrativer 3-Jahres-Ausblick (kombiniert)',
        },
        rows: [
          {
            label: { en: 'Year 1', de: 'Jahr 1' },
            detail: {
              en: 'KDP ~€3k–€6k · Merch ~€1.5k–€3k · combined ~€4.5k–€9k',
              de: 'KDP ca. 3–6k € · Merch ca. 1,5–3k € · kombiniert ca. 4,5–9k €',
            },
          },
          {
            label: { en: 'Year 2', de: 'Jahr 2' },
            detail: {
              en: 'KDP ~€8k–€15k · Merch ~€4k–€8k · combined ~€12k–€23k',
              de: 'KDP ca. 8–15k € · Merch ca. 4–8k € · kombiniert ca. 12–23k €',
            },
          },
          {
            label: { en: 'Year 3', de: 'Jahr 3' },
            detail: {
              en: 'KDP ~€15k–€30k · Merch ~€8k–€18k · combined ~€23k–€48k',
              de: 'KDP ca. 15–30k € · Merch ca. 8–18k € · kombiniert ca. 23–48k €',
            },
          },
        ],
        note: {
          en: '⚠ Illustrative only (assumes ~2–3 books/year + consistent marketing). Not guaranteed. Not tax advice.',
          de: '⚠ Nur illustrativ (Annahme ca. 2–3 Bücher/Jahr + Marketing). Keine Garantie. Keine Steuerberatung.',
        },
      },
      {
        heading: { en: 'After KDP + Merch', de: 'Nach KDP + Merch' },
        bullets: {
          en: [
            'ACX / Audible — audio after the book exists (royalty-share narrator option)',
            'Associates / Influencer — when you have content & social presence',
            'Handmade / FBA — only for proven demand or craft SKUs',
            'Video Direct — long-term brand adaptation',
            'Vella / serials — monitor; often not primary for DE yet',
          ],
          de: [
            'ACX / Audible — Audio nach dem Buch (Royalty-Share-Sprecher möglich)',
            'PartnerNet / Influencer — mit Content & Social-Präsenz',
            'Handmade / FBA — nur bei bewährter Nachfrage oder Handwerk-SKUs',
            'Video Direct — langfristige Marken-Adaptation',
            'Vella / Serials — beobachten; für DE oft noch nicht primär',
          ],
        },
      },
      {
        heading: {
          en: 'After first book is Live — listing optimisation',
          de: 'Nach dem ersten Live-Buch — Listing-Optimierung',
        },
        bullets: {
          en: [
            'Priority order: 7 backend keywords → categories → title/subtitle → cover mobile tests → A+ → format stack → short ads → social',
            'Live books: zero sales → full hygiene; already selling → one change at a time (categories last)',
            'Audience + topic fit first: wrong age/use-case or fast-expiring tips beat pretty SEO',
            'Scripture / quotes: confirm Bible (or other) translation rights — trademarks can ban books',
            'Demand first: never invent niches (e.g. Christmas journal notebook); skip tiny-opportunity + huge competition',
            'Activity / workbook keywords: exact-match from Amazon autocomplete — inventing phrases kills sales',
            'Keyword seed loop: singular/plural + audience swaps until subtitle + all 7 backend slots are filled',
            'Organic ranking: longtail sweet spot; compare close niches; front-load title for mobile cutoff',
            'Low/medium titles: exact-match longtail in title; coloring = show genre on cover + longtail niches; difficulty must match age; ~1–2 lines',
            'Literary / high-content: creative title OK — searchable subtitle + all 7 backend slots if title is keyword-empty',
            'Title hygiene: zero duplicates; orphan quotes out; honest skill keywords; Amazon typo fix or republish',
            'How-to: niche longtail in title/subtitle; under ~40 pages add examples / FAQs / practices',
            'Seasonal: ~8 weeks before holiday peak (not months early); Author Central + early reviews + launch ads',
            'Coloring categories: real coloring nodes; never mix kids + adult/grown-ups on one affirmations/adult coloring book',
            'Categories: soft-fit themes → tighter node OR clarify theme on cover/description/A+',
            'Cover: one character style; funny books look funny; unclear props kill CTR; hire/rebuild if collage-random',
            'Description: opener + five bullets + consistent spacing + buy CTA; light bold only',
            'A+: match cover fonts/colors; pages > text for activity books; one-line bullets; don’t skip A+',
            'Keyword-empty title + non-brand author: consider compliant unpublish → relaunch (verify KDP rules)',
            'Honeymoon relaunch: fix main longtail; ebook+paperback+hardcover together; short auto/keyword ads + social',
            'Sales decline / old titles: fix then compliant new ASIN; optional different pen name only if brand plan + KDP rules allow',
            'Subtitle: exact-match + SERP CTR; coloring longtails (who/theme/relaxing); difficulty labels must match age band',
            'Kids age bands: searched ranges (3–5, 4–8, 5–7) — avoid wide unpopular bands like 3–7',
            'Already selling + locked title: polish 7 backend keywords + small cover/description tweaks first',
            'Missing subtitle: add searchable subtitle for organic + CTR, or overload all 7 backend slots',
            'Zero-sales audit: poetic title + no subtitle, high price, print-only, empty A+, bad categories',
            'Series: drop redundant “Book 1” from the title if the series module already shows it; fix casing via title update',
            'Formats: paperback without Kindle is a miss; stack ebook+print+audio when it fits',
            'Title: obscure names need genre subtitle; one title + one subtitle; longtails for workbooks',
            'Zero / early 1★: compliant ARC / early readers before traffic scales — never buy fake stars',
            'Stuck titles: clean listing → short ads → niche social',
            'Full checklist: Amazon Hub → KDP learning centre → “After you’re Live — listing optimisation”',
          ],
          de: [
            'Reihenfolge: 7 Backend-Keywords → Kategorien → Titel/Untertitel → Cover-Mobile-Tests → A+ → Format-Stack → kurze Ads → Social',
            'Live-Bücher: Null Sales → volle Hygiene; schon Sales → eine Änderung nach der anderen (Kategorien zuletzt)',
            'Zuerst Zielgruppe + Themen-Fit: falsches Alter/Use-Case oder schnell veraltende Tipps schlagen SEO',
            'Schriftstellen / Zitate: Bibel- (oder andere) Übersetzungsrechte prüfen — Marken können Bücher bannen',
            'Zuerst Demand: keine Nischen erfinden (z. B. Christmas Journal Notebook); winzige Opportunity + riesige Konkurrenz skippen',
            'Activity-/Workbook-Keywords: Exact-Match aus Amazon-Autocomplete — erfundene Phrasen killen Sales',
            'Keyword-Seed-Loop: Singular/Plural + Zielgruppen-Swaps, bis Untertitel + alle 7 Backend-Slots gefüllt sind',
            'Organisches Ranking: Longtail-Sweet-Spot; nahe Nischen vergleichen; Titel für Mobile-Cutoff front-loaden',
            'Low/Medium-Titel: Exact-Match-Longtail im Titel; Malbuch = Genre auf Cover + Longtail-Nischen; Schwierigkeit = Altersband; ~1–2 Zeilen',
            'Literarisch / High-Content: kreativer Titel ok — suchbarer Untertitel + alle 7 Backend-Slots wenn Titel keyword-leer',
            'Titel-Hygiene: null Duplikate; verwaiste Quotes weg; ehrliche Skill-Keywords; Amazon-Tippfehler-Fix oder Republish',
            'How-to: Nischen-Longtail in Titel/Untertitel; unter ~40 Seiten Beispiele / FAQs / Übungen ergänzen',
            'Saisonal: ~8 Wochen vor Feiertags-Peak (nicht monatelang früh); Author Central + Early-Reviews + Launch-Ads',
            'Malbuch-Kategorien: echte Malbuch-Nodes; nie Kids + Adult/Grown-ups auf einem Affirmations-/Adult-Malbuch mischen',
            'Kategorien: Soft-Fit-Themen → engere Node ODER Thema auf Cover/Beschreibung/A+ klar machen',
            'Cover: ein Charakter-Stil; Funny-Bücher wirken funny; unklare Props killen CTR; hire/rebuild bei Collage-Zufall',
            'Beschreibung: Opener + fünf Bullets + konsistente Abstände + Kauf-CTA; Bold sparsam',
            'A+: Cover-Fonts/-Farben matchen; Seiten > Text bei Activity; einzeilige Bullets; A+ nicht skippen',
            'Keyword-leerer Titel + keine Autor-Marke: konformen Unpublish → Relaunch prüfen (KDP-Regeln)',
            'Honeymoon-Relaunch: Haupt-Longtail fixen; E-Book+Paperback+Hardcover gemeinsam; kurze Auto-/Keyword-Ads + Social',
            'Sales-Decline / alte Titel: fixen dann konforme neue ASIN; anderer Pen Name nur wenn Markenplan + KDP-Regeln erlauben',
            'Untertitel: Exact-Match + SERP-CTR; Malbuch-Longtails (wer/Thema/relaxing); Schwierigkeit muss zum Altersband passen',
            'Kinder-Altersbänder: gesuchte Ranges (3–5, 4–8, 5–7) — keine breiten unpopulären Bänder wie 3–7',
            'Schon Sales + fester Titel: zuerst 7 Backend-Keywords + kleine Cover-/Beschreibungs-Tweaks',
            'Fehlender Untertitel: suchbaren Untertitel für Organic + CTR, oder alle 7 Backend-Slots überladen',
            'Null-Sales-Audit: poetischer Titel + kein Untertitel, hoher Preis, nur-Print, leeres A+, schlechte Kategorien',
            'Serie: „Band 1“ aus dem Titel streichen, wenn das Serienmodul es schon zeigt; Großschreibung per Titel-Update',
            'Formate: Paperback ohne Kindle ist ein Miss; E-Book+Print+Audio stacken wenn passend',
            'Titel: obskure Namen brauchen Genre-Untertitel; ein Titel + ein Untertitel; Longtails für Workbooks',
            'Null / früher 1★: konforme ARC / Early Reader bevor Traffic skaliert — nie Fake-Sterne kaufen',
            'Steckengebliebene Titel: Listing sauber → kurze Ads → Nischen-Social',
            'Vollständige Checkliste: Amazon Hub → KDP-Lernzentrum → „Nach dem Live-Gang — Listing-Optimierung“',
          ],
        },
      },
      {
        heading: { en: 'Do this week', de: 'Diese Woche' },
        bullets: {
          en: [
            'Apply to Merch on Demand',
            'Finish character + emotional core for book 1',
            'Open StoryForge Launchpad course on desktop (≥1024px)',
            'Run one Amazon.de autocomplete research session before designing Merch',
            'Draft your first 10 Merch slots from the four design types',
          ],
          de: [
            'Merch on Demand beantragen',
            'Figur + emotionaler Kern für Buch 1 fertigstellen',
            'StoryForge-Launchpad-Kurs am Desktop öffnen (≥1024px)',
            'Eine Amazon.de-Autocomplete-Recherche vor dem ersten Merch-Design',
            'Erste 10 Merch-Slots aus den vier Design-Typen skizzieren',
          ],
        },
      },
    ],
  },
]

export function getGuide(id) {
  return AMAZON_GUIDES.find((g) => g.id === id) || null
}
