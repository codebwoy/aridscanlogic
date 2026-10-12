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
    id: 'publisher-truths',
    defaultOpen: true,
    title: {
      en: 'First-time publisher truths — ecosystem before upload',
      de: 'Wahrheiten für Erstautor:innen — Ökosystem vor dem Upload',
    },
    summary: {
      en: 'Critical advice most first-time author-publishers never hear: build a business ecosystem (series + workbook + Merch + list), distribute beyond KDP, plan ISBN/rights, reach schools/libraries, price correctly, grow audience before launch, plan real reviews, handle DE tax, test with kids, and play the 3-year game. Opens above the niche ladder studios. ⚠ Not official Amazon Help.',
      de: 'Kritische Tipps, die Erstautor:innen selten hören: Ökosystem bauen (Serie + Workbook + Merch + Liste), über KDP hinaus distribuieren, ISBN/Rechte planen, Schulen/Bibliotheken, richtige Preise, Publikum vor Launch, echte Reviews, DE-Steuern, mit Kindern testen, 3-Jahres-Spiel. Steht über den Studio-Karten. ⚠ Kein offizielles Amazon-Help.',
    },
    sections: [
      {
        heading: {
          en: 'How to use this playbook',
          de: 'So nutzen Sie dieses Playbook',
        },
        bullets: {
          en: [
            'Read the 10 truths in the panel below — then open StoryForge for Book 1 and AuthorForge for the parent/coaching companion',
            'Open “Publish wide + email list” next — so you never put all eggs in one Amazon basket',
            'Use Merch playbooks only after your character is pinned and brand-safe',
            'Pair with KDP requirements + Hard Topics for upload mechanics; this playbook is strategy, not the print calculator',
            'Open “Plan to Win” for the five-pillar execution chain: Niche → Product → Metadata/SEO → Launch → Brand expansion',
            'When comparing lanes beyond KDP/FBA, open “Under-explored Amazon ecosystems” (AWS Marketplace, Renewed, Merch, Custom, Business)',
            'Every price, ISBN, tax, and school claim has a ⚠ — verify before you spend money or register',
          ],
          de: [
            'Lesen Sie die 10 Wahrheiten im Panel unten — dann StoryForge für Buch 1 und AuthorForge für Eltern-/Coaching-Begleiter',
            'Als Nächstes „Wide publizieren + E-Mail-Liste“ öffnen — damit Sie nicht alle Eier in einen Amazon-Korb legen',
            'Merch-Playbooks erst nach gepinnter, markensicherer Figur',
            'Danach KDP-Anforderungen + Schwierigsthemen für Upload-Technik; dieses Playbook ist Strategie, kein Druckkosten-Rechner',
            '„Plan to Win“ öffnen für die Fünf-Säulen-Kette: Nische → Produkt → Metadaten/SEO → Launch → Marke',
            'Beim Vergleich jenseits KDP/FBA „Unterschätzte Amazon-Ökosysteme“ öffnen (AWS Marketplace, Renewed, Merch, Custom, Business)',
            'Jeder Preis-, ISBN-, Steuer- und Schul-Hinweis hat ⚠ — vor Ausgaben oder Anmeldung prüfen',
          ],
        },
        links: [
          { label: 'KDP home', url: 'https://kdp.amazon.com/' },
          {
            label: 'KDP Jumpstart',
            url: 'https://kdp.amazon.com/en_US/help/topic/G202187740',
          },
        ],
      },
    ],
  },
  {
    id: 'kdp-plan-to-win',
    defaultOpen: false,
    title: {
      en: 'Plan to Win — five-pillar KDP execution chain',
      de: 'Plan to Win — Fünf-Säulen-KDP-Ausführungskette',
    },
    summary: {
      en: 'Repeatable end-to-end framework: Niche Selection → Product Superiority → Metadata/SEO → Launch Dynamics → Monetization & Brand Expansion. Micro-targeting, thumbnail covers, A+, 7 keywords, honeymoon PPC, series + wide + email. ⚠ Not Amazon Help.',
      de: 'Wiederholbares End-to-End-Framework: Nischenwahl → Produktüberlegenheit → Metadaten/SEO → Launch-Dynamik → Monetarisierung & Marke. Micro-Targeting, Thumbnail-Cover, A+, 7 Keywords, Honeymoon-PPC, Serie + Wide + E-Mail. ⚠ Kein Amazon-Help.',
    },
    sections: [
      {
        heading: {
          en: 'The execution chain',
          de: 'Die Ausführungskette',
        },
        bullets: {
          en: [
            'Winning on Amazon KDP requires a repeatable, end-to-end framework across Fiction, Non-Fiction, and Low/Medium Content',
            'Chain: Niche Selection → Product Superiority → Metadata/SEO → Launch Dynamics → Monetization & Brand Expansion',
            'If one link fails (e.g. great keywords but a weak cover), the book will underperform — optimize every link',
            'Full pillar detail + master execution matrix live in the panel below',
          ],
          de: [
            'Gewinnen auf Amazon KDP braucht ein wiederholbares End-to-End-Framework für Fiction, Non-Fiction und Low/Medium Content',
            'Kette: Nischenwahl → Produktüberlegenheit → Metadaten/SEO → Launch-Dynamik → Monetarisierung & Markenausbau',
            'Scheitert ein Glied (z. B. starke Keywords, schwaches Cover), underperformt das Buch — jedes Glied optimieren',
            'Volle Säulen-Details + Master-Ausführungsmatrix im Panel unten',
          ],
        },
        note: {
          en: '⚠ BSR cutoffs, ACoS targets, and A+ conversion lift claims are directional — verify live. Never buy fake reviews.',
          de: '⚠ BSR-Grenzen, ACoS-Ziele und A+-Conversion-Lift sind Richtungswerte — live prüfen. Keine Fake-Reviews kaufen.',
        },
      },
      {
        heading: {
          en: '1. Strategic niche validation (micro-targeting)',
          de: '1. Strategische Nischen-Validierung (Micro-Targeting)',
        },
        bullets: {
          en: [
            'Most publishers fail before writing a word because they publish in overly broad, saturated categories',
            'Niche equation: Broad Category + Specific Audience + Clear Outcome',
            'Bad: “Cookbook for Air Fryers”',
            'Winning: “Air Fryer Cookbook for Seniors (Large Print, Low-Sodium, 5-Ingredients or Less)”',
            'Validation checkpoint: top 3–5 organically ranking books have Best Sellers Rank (BSR) under 100,000 (proving demand)',
            'Fewer than 1,000–2,000 total competing results for that long-tail search phrase',
            'Identify weakness in current top sellers (outdated covers, poor interior formatting, recurring reader complaints in 3-star reviews)',
          ],
          de: [
            'Die meisten Publisher scheitern vor dem ersten Wort — zu breite, gesättigte Kategorien',
            'Nischen-Gleichung: Breite Kategorie + spezifische Zielgruppe + klares Ergebnis',
            'Schlecht: „Kochbuch für Heißluftfritteusen“',
            'Gewinner: „Heißluftfritteusen-Kochbuch für Senioren (Großdruck, natriumarm, max. 5 Zutaten)“',
            'Validierung: Top 3–5 organisch rankende Bücher haben Best Sellers Rank (BSR) unter 100.000 (Nachfrage)',
            'Unter 1.000–2.000 Gesamttreffern für diese Longtail-Suchphrase',
            'Schwächen der Topseller: veraltete Cover, schwache Formatierung, wiederkehrende Kritik in 3-Sterne-Reviews',
          ],
        },
      },
      {
        heading: {
          en: '2. Product superiority (the conversion engine)',
          de: '2. Produktüberlegenheit (Conversion-Motor)',
        },
        bullets: {
          en: [
            'Once a reader finds your listing, cover, title, and A+ Content determine whether they click and buy',
            'Thumbnail-first design: cover must stand out at 100×100 pixels on a mobile screen — high-contrast typography and clear focal points',
            'Genre match: look at the top 10 bestsellers in your sub-niche; match expected visual tropes (color scheme, font choices) while keeping a premium feel',
            'Title: punchy, memorable, and strictly matching your physical cover',
            'Subtitle: clear value proposition addressing exact audience and outcome — avoid keyword stuffing list words that trigger account flags',
            'Amazon A+ Content (from your KDP Dashboard): interior preview images, feature comparison tables, and brand storytelling visuals — often cited to lift conversion rates by 10%–20% (verify eligibility)',
          ],
          de: [
            'Wenn Leser:innen Ihr Listing finden, entscheiden Cover, Titel und A+ Content über Klick und Kauf',
            'Thumbnail-first: Cover muss bei 100×100 Pixeln auf Mobile auffallen — hoher Kontrast und klarer Fokus',
            'Genre-Match: Top-10-Bestseller in der Sub-Nische; visuelle Tropes (Farbe, Fonts) treffen, premium bleiben',
            'Titel: knackig, einprägsam, exakt wie auf dem physischen Cover',
            'Untertitel: klare Value Proposition für Zielgruppe und Ergebnis — kein Keyword Stuffing mit Account-Flags',
            'Amazon A+ Content (KDP-Dashboard): Innenteil-Previews, Vergleichstabellen, Brand-Story — oft mit 10–20 % Conversion-Lift genannt (Berechtigung prüfen)',
          ],
        },
        links: [
          {
            label: 'A+ Content (Help)',
            url: 'https://kdp.amazon.com/en_US/help/topic/G201173080',
          },
        ],
      },
      {
        heading: {
          en: '3. Metadata & Amazon algorithm SEO',
          de: '3. Metadaten & Amazon-Algorithmus-SEO',
        },
        bullets: {
          en: [
            'Amazon KDP is an e-commerce search engine — win by aligning metadata with search intent',
            '7 backend keyword slots: fill every slot with non-repetitive, long-tail phrases (e.g. “bilingual children german twi bedtime activity” instead of single words like “book”)',
            'Never include brand names, price promises (“cheap”), or claims like “Bestseller”',
            'Category dominance: use specific, narrow BISAC categories rather than broad top-level categories',
            'Being ranked #1 in a small sub-category earns the “#1 Best Seller” badge, which dramatically boosts organic click-through rates',
          ],
          de: [
            'Amazon KDP ist eine E-Commerce-Suchmaschine — Metadaten an Suchabsicht ausrichten',
            '7 Backend-Keyword-Slots: jeden Slot mit nicht-wiederholenden Longtails füllen (z. B. „bilingual children german twi bedtime activity“ statt Einzelwörter wie „book“)',
            'Nie Markennamen, Preisversprechen („cheap“) oder Claims wie „Bestseller“',
            'Kategorie-Dominanz: spezifische, enge BISAC-Kategorien statt breiter Top-Level-Kategorien',
            'Platz #1 in einer kleinen Subkategorie bringt das „#1 Best Seller“-Badge und steigert organische CTR stark',
          ],
        },
      },
      {
        heading: {
          en: '4. Launch dynamics & ad engine',
          de: '4. Launch-Dynamik & Ad-Engine',
        },
        bullets: {
          en: [
            'Amazon’s algorithm grants new titles a temporary “Honeymoon Period” visibility boost — maximize sales velocity during this window',
            'Phase 1 Soft Launch (social proof base): secure 5–15 verified reviews immediately via Advance Reader Copy (ARC) team, email newsletter subscribers, or book review platforms (target often cited as 5–10 to start)',
            'Phase 2 Ad Acceleration: do not run broad campaigns initially — Exact Match sponsored keyword ads on proven search terms and Product Targeting Ads on 20–30 direct competitor book listings (comp titles)',
            'Aim for an ACoS (Advertising Cost of Sales) under your break-even royalty margin',
            'Phase 3 Flywheel (algorithm takeover): organic sales velocity paired with ad conversions pushes your title into Amazon’s internal recommendation engine (“Customers who bought this also bought…”)',
          ],
          de: [
            'Amazons Algorithmus gibt neuen Titeln eine temporäre „Honeymoon Period“-Sichtbarkeit — Sales-Velocity in diesem Fenster maximieren',
            'Phase 1 Soft Launch (Social Proof): 5–15 verifizierte Reviews sofort über Advance Reader Copy (ARC)-Team, E-Mail-Abonnent:innen oder Review-Plattformen (Start oft mit Ziel 5–10)',
            'Phase 2 Ad Acceleration: zuerst keine Broad-Kampagnen — Exact-Match Sponsored Keyword Ads auf bewährte Suchbegriffe und Product-Targeting-Ads auf 20–30 direkte Konkurrenz-Listings (Comp-Titel)',
            'ACoS (Advertising Cost of Sales) unter Ihrer Break-even-Royalty-Marge anstreben',
            'Phase 3 Flywheel (Algorithmus-Übernahme): organische Sales-Velocity + Ad-Conversions → Amazons Empfehlungs-Engine („Kunden, die dies kauften, kauften auch…“)',
          ],
        },
        rows: [
          {
            label: { en: 'Phase 1: Soft Launch', de: 'Phase 1: Soft Launch' },
            detail: {
              en: 'Target 5–10 reviews (up to 5–15 via ARC / list)',
              de: 'Ziel 5–10 Reviews (bis 5–15 via ARC / Liste)',
            },
          },
          {
            label: { en: 'Phase 2: Ad Acceleration', de: 'Phase 2: Ad Acceleration' },
            detail: {
              en: 'Exact Match PPC + Product Targeting on 20–30 comps; ACoS under break-even',
              de: 'Exact-Match-PPC + Product Targeting auf 20–30 Comps; ACoS unter Break-even',
            },
          },
          {
            label: { en: 'Phase 3: Flywheel', de: 'Phase 3: Flywheel' },
            detail: {
              en: 'Organic rank scaling + “also bought” recommendations',
              de: 'Organisches Ranking + „Auch gekauft“-Empfehlungen',
            },
          },
        ],
        links: [
          { label: 'Amazon Advertising', url: 'https://advertising.amazon.com/' },
        ],
      },
      {
        heading: {
          en: '5. Brand expansion & off-Amazon ownership',
          de: '5. Markenausbau & Ownership jenseits Amazon',
        },
        bullets: {
          en: [
            'Relying solely on Amazon algorithm changes or single standalone titles creates fragile revenue',
            'Series/catalog: in fiction, write interconnected series — Book 1 as reader magnet or low-friction entry; Books 2–5 drive high-margin read-through revenue',
            'In non-fiction / low-content, build a cohesive brand imprint across a specific niche (e.g. a multi-volume activity series)',
            'Own the reader relationship (lead magnets): place a high-value lead magnet bonus download (printable activity kit, bonus chapter, resource guide) at the front and back of your interior — convert Amazon shoppers into direct email subscribers',
            'Publish wide: once a title is established on Amazon, distribute via Draft2Digital, IngramSpark, Tolino Media, BoD to diversify income beyond a single platform',
          ],
          de: [
            'Nur Amazon-Algorithmus oder einzelne Standalone-Titel erzeugen fragile Einnahmen',
            'Serie/Katalog: in Fiction verbundene Serien — Buch 1 als Magnet / Low-Friction-Einstieg; Bücher 2–5 mit hoher Read-through-Marge',
            'In Non-Fiction / Low-Content: kohärentes Brand-Imprint in einer Nische (z. B. mehrbändige Activity-Serie)',
            'Reader-Beziehung besitzen (Lead-Magnete): hochwertigen Lead-Magnet-Bonus (druckbares Activity-Kit, Bonuskapitel, Resource Guide) in Front- und Back-Matter — Amazon-Shopper zu direkten E-Mail-Abonnent:innen machen',
            'Wide publizieren: wenn der Titel auf Amazon etabliert ist, über Draft2Digital, IngramSpark, Tolino Media, BoD diversifizieren',
          ],
        },
      },
      {
        heading: {
          en: 'Master execution matrix',
          de: 'Master-Ausführungsmatrix',
        },
        rows: [
          {
            label: { en: 'Catalog focus', de: 'Katalog-Fokus' },
            detail: {
              en: 'Weak: mass-producing 100+ low-effort titles → Winning: deep focus on 5–10 high-quality, high-converting titles',
              de: 'Schwach: 100+ Low-Effort-Titel → Gewinner: tiefer Fokus auf 5–10 hochwertige, stark konvertierende Titel',
            },
          },
          {
            label: { en: 'Niche selection', de: 'Nischenwahl' },
            detail: {
              en: 'Weak: chasing high-volume, hyper-competitive keywords → Winning: owning long-tail, low-competition sub-niches with proven buyers',
              de: 'Schwach: High-Volume-Keywords jagen → Gewinner: Longtail-Subnischen mit geringer Konkurrenz und bewährten Käufer:innen',
            },
          },
          {
            label: { en: 'Marketing', de: 'Marketing' },
            detail: {
              en: 'Weak: luck or random social posts → Winning: strategic Amazon PPC, ARC review teams, and email list captures',
              de: 'Schwach: Glück oder zufällige Social-Posts → Gewinner: strategische Amazon-PPC, ARC-Teams und E-Mail-Captures',
            },
          },
          {
            label: { en: 'Risk management', de: 'Risikomanagement' },
            detail: {
              en: 'Weak: 100% dependent on Amazon KDP → Winning: multi-platform publishing wide + direct-to-reader mailing list',
              de: 'Schwach: 100 % abhängig von Amazon KDP → Gewinner: Multi-Plattform wide + Direct-to-Reader-Mailingliste',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'amazon-alt-ecosystems',
    defaultOpen: false,
    title: {
      en: 'Under-explored Amazon ecosystems — beyond KDP & retail FBA',
      de: 'Unterschätzte Amazon-Ökosysteme — jenseits von KDP & Retail-FBA',
    },
    summary: {
      en: 'Five specialized Amazon paths with higher skill/capital barriers and often less seller competition than KDP or standard FBA: AWS Marketplace (full SaaS/AI how-it-works, tech stack, Cursor IDE, AMMP action plan), Renewed, Merch on Demand, Amazon Custom, Amazon Business. Comparison matrix + who-it-suits. ⚠ Not Amazon/AWS advice; margins directional.',
      de: 'Fünf spezialisierte Amazon-Pfade mit höheren Skill-/Kapital-Hürden und oft weniger Seller-Konkurrenz als KDP oder Standard-FBA: AWS Marketplace (volles SaaS/KI How-it-works, Tech-Stack, Cursor IDE, AMMP-Action-Plan), Renewed, Merch on Demand, Amazon Custom, Amazon Business. Vergleichsmatrix + Wer-passt. ⚠ Keine Amazon/AWS-Beratung; Margen Richtwerte.',
    },
    sections: [
      {
        heading: {
          en: 'How to use this playbook',
          de: 'So nutzen Sie dieses Playbook',
        },
        bullets: {
          en: [
            'KDP and standard FBA/FBM still attract millions of sellers — these ecosystems trade saturation for specialized knowledge, enterprise buyers, approval gates, or capital',
            'Read each ecosystem card in the panel: what you sell, why competition is low, potential, how to enter, suits you / not ideal, capital, effort',
            'Use the master comparison matrix + pick-your-path list to choose one lane that matches your skills',
            'Most DE children’s publishers still start KDP + Merch; add Custom / Business / Renewed / AWS only when capital or ops match',
            'Every fee, tier, invoice threshold, and margin % has ⚠ — verify on official portals before investing',
          ],
          de: [
            'KDP und Standard-FBA/FBM ziehen weiter Millionen Seller an — diese Ökosysteme tauschen Sättigung gegen Spezialwissen, Enterprise-Käufer, Freigaben oder Kapital',
            'Jede Ökosystem-Karte im Panel lesen: Was verkaufen, warum wenig Konkurrenz, Potenzial, Einstieg, passt / passt nicht, Kapital, Aufwand',
            'Master-Vergleichsmatrix + Pfad-Liste nutzen, um eine Spur zu wählen, die zu Ihren Skills passt',
            'Die meisten DE-Kinderbuch-Publisher starten weiter mit KDP + Merch; Custom / Business / Renewed / AWS nur bei passendem Kapital oder Ops',
            'Jede Fee, jeder Tier, jede Rechnungs-Schwelle und jede %-Marge hat ⚠ — vor Investition offizielle Portale prüfen',
          ],
        },
        note: {
          en: '⚠ Not affiliated with Amazon or AWS. Margin columns are directional owner/third-party ranges — not guarantees.',
          de: '⚠ Nicht mit Amazon oder AWS verbunden. Margen-Spalten sind Richtwerte — keine Garantie.',
        },
      },
      {
        heading: {
          en: '1. AWS Marketplace (SaaS, APIs, data, AI agents)',
          de: '1. AWS Marketplace (SaaS, APIs, Daten, KI-Agents)',
        },
        bullets: {
          en: [
            'Selling a SaaS or AI Solution on the AWS Marketplace shifts B2C (retail shoppers) → B2B (companies and software teams)',
            'Instead of handling payments yourself, AWS handles customer billing; buyers use pre-approved company cloud budgets; AWS routes payouts to your bank',
            'Sell SaaS, pay-as-you-go APIs, AMI/containers, ML models, datasets (Data Exchange), or Bedrock-based AI agents',
            'Competition is low because most Amazon sellers only know retail/KDP — packaging software + entitlement/metering is a different skill set',
            'Enterprise Budgets + Zero Logistics / Zero Returns — no physical inventory or retail-style returns warehouse',
            'Official public listing fees (software/data): SaaS ~3%, AMI/container/ML ~20%, Data Exchange ~3% of TCV; private offers tier by contract size (e.g. 3% under $1M) — verify AWS docs',
            'Directional software gross after listing fee often cited 80% - 95% if infra is efficient — ⚠ support + AWS usage eat margin',
            'Full how-it-works, tech stack, Cursor IDE, and 4-step action plan live in the panel below + sections 1a–1d',
          ],
          de: [
            'SaaS oder KI im AWS Marketplace: Shift von B2C (Retail-Shopper) → B2B (Unternehmen und Software-Teams)',
            'Statt selbst zu kassieren: AWS handles customer billing; Käufer:innen nutzen freigegebene Firmen-Cloud-Budgets; AWS zahlt auf Ihr Bankkonto aus',
            'SaaS, Pay-as-you-go-APIs, AMI/Container, ML-Modelle, Datasets (Data Exchange) oder Bedrock-basierte KI-Agents',
            'Wenig Konkurrenz: die meisten Amazon-Seller kennen nur Retail/KDP — Software + Entitlement/Metering ist ein anderes Skillset',
            'Enterprise Budgets + Zero Logistics / Zero Returns — kein physisches Lager, kein Retail-Return-Warehouse',
            'Offizielle öffentliche Listing-Fees (Software/Daten): SaaS ca. 3 %, AMI/Container/ML ca. 20 %, Data Exchange ca. 3 % vom TCV; Private Offers gestaffelt (z. B. 3 % unter 1 Mio $) — AWS-Docs prüfen',
            'Richt-Bruttomarge Software nach Listing-Fee oft 80% - 95 %, wenn Infra effizient — ⚠ Support + AWS-Nutzung fressen Marge',
            'Volles How-it-works, Tech-Stack, Cursor IDE und 4-Schritt-Action-Plan im Panel unten + Abschnitte 1a–1d',
          ],
        },
        links: [
          {
            label: 'AWS Marketplace sellers',
            url: 'https://docs.aws.amazon.com/marketplace/latest/userguide/user-guide-for-sellers.html',
          },
          {
            label: 'Listing fees',
            url: 'https://docs.aws.amazon.com/marketplace/latest/userguide/listing-fees.html',
          },
        ],
      },
      {
        heading: {
          en: '1a. How AWS Marketplace (SaaS/AI) works',
          de: '1a. So funktioniert AWS Marketplace (SaaS/KI)',
        },
        bullets: {
          en: [
            'You are not handing over your full source code to Amazon',
            'You Host the Software: core application (Next.js, Node.js, Python, Supabase, etc.) runs on cloud infrastructure (AWS, Vercel, Fly.io, or your own servers)',
            'AWS Handles the Paywall: enterprise customer subscribes → AWS redirects to your Fulfillment/Onboarding Landing Page with secure token x-amzn-marketplace-token',
            'Your App Calls the AWS API: exchange the token with the AWS Marketplace SDK (ResolveCustomer) to identify who subscribed and what tier/contract they bought',
          ],
          de: [
            'Sie übergeben Amazon nicht Ihren vollständigen Quellcode',
            'You Host the Software: Kern-App (Next.js, Node.js, Python, Supabase usw.) auf Cloud-Infra (AWS, Vercel, Fly.io oder eigene Server)',
            'AWS Handles the Paywall: Enterprise-Abo → Redirect zur Fulfillment/Onboarding Landing Page mit Secure Token x-amzn-marketplace-token',
            'Your App Calls the AWS API: Token mit AWS Marketplace SDK (ResolveCustomer) lösen — wer hat abonniert, welches Tier/Contract',
          ],
        },
        links: [
          {
            label: 'SaaS product integration',
            url: 'https://docs.aws.amazon.com/marketplace/latest/userguide/saas-product-integration.html',
          },
        ],
      },
      {
        heading: {
          en: '1b. Recommended tech stack',
          de: '1b. Empfohlener Tech-Stack',
        },
        bullets: {
          en: [
            'You do not need a radically different stack from full-stack web apps — your existing toolkit fits',
            'Core — Frontend: React, Next.js, or SvelteKit',
            'Core — Backend: Node.js, Python (FastAPI/Express), or serverless API routes',
            'Core — Database & Auth: Supabase (PostgreSQL, Row Level Security, Auth) or PostgreSQL',
            'Core — Hosting: Vercel, Fly.io, or AWS (ECS / App Runner / Lambda)',
            'AWS-specific — AWS SDK v3: @aws-sdk/client-marketplace-metering and @aws-sdk/client-marketplace-entitlement',
            'AWS-specific — Amazon Simple Queue Service (SQS) & SNS for cancel / upgrade / payment-failure events',
            'Usage metering: BatchMeterUsage alongside ResolveCustomer / entitlement checks',
          ],
          de: [
            'Kein radikal anderer Stack als Full-Stack-Web-Apps — Ihr bestehendes Toolkit passt',
            'Core — Frontend: React, Next.js oder SvelteKit',
            'Core — Backend: Node.js, Python (FastAPI/Express) oder serverless API-Routes',
            'Core — Database & Auth: Supabase (PostgreSQL, Row Level Security, Auth) oder PostgreSQL',
            'Core — Hosting: Vercel, Fly.io oder AWS (ECS / App Runner / Lambda)',
            'AWS-spezifisch — AWS SDK v3: @aws-sdk/client-marketplace-metering und @aws-sdk/client-marketplace-entitlement',
            'AWS-spezifisch — Amazon Simple Queue Service (SQS) & SNS für Cancel / Upgrade / Zahlungsausfall',
            'Usage-Metering: BatchMeterUsage neben ResolveCustomer / Entitlement-Checks',
          ],
        },
      },
      {
        heading: {
          en: '1c. Using Cursor IDE for AWS Marketplace apps',
          de: '1c. Cursor IDE für AWS-Marketplace-Apps',
        },
        bullets: {
          en: [
            'Yes, Cursor IDE is well-suited for building AWS Marketplace apps — TypeScript, React, Node.js, backend configuration = standard full-stack development',
            'Configure Cursor Rules (.cursorrules or .cursor/rules) so the AI understands your AWS Marketplace integration logic',
            'Example rule: “This project is an AWS Marketplace SaaS application. Always handle incoming POST requests on /api/aws/onboard by parsing the x-amzn-marketplace-token, calling ResolveCustomer via the AWS SDK v3, storing the returned CustomerIdentifier in Supabase, and mapping it to the user profile.”',
            'Prompt engineering: “Write a Node.js API route that accepts the AWS Marketplace token, resolves it using @aws-sdk/client-marketplace-metering, and registers the subscriber inside my Supabase database.”',
            'Suggested next steps: keep a ready Node.js/TypeScript ResolveCustomer → Supabase snippet; keep a Marketplace-tailored .cursor/rules file',
          ],
          de: [
            'Ja — Cursor IDE eignet sich gut für AWS-Marketplace-Apps — TypeScript, React, Node.js, Backend-Config = Standard-Full-Stack',
            'Cursor Rules (.cursorrules oder .cursor/rules) setzen, damit die KI Ihre AWS-Marketplace-Integrationslogik kennt',
            'Beispiel-Regel: „This project is an AWS Marketplace SaaS application. Always handle incoming POST requests on /api/aws/onboard by parsing the x-amzn-marketplace-token, calling ResolveCustomer via the AWS SDK v3, storing the returned CustomerIdentifier in Supabase, and mapping it to the user profile.“',
            'Prompt: „Write a Node.js API route that accepts the AWS Marketplace token, resolves it using @aws-sdk/client-marketplace-metering, and registers the subscriber inside my Supabase database.“',
            'Nächste Schritte: fertiges Node.js/TypeScript ResolveCustomer → Supabase-Snippet; Marketplace-.cursor/rules-Datei',
          ],
        },
      },
      {
        heading: {
          en: '1d. Step-by-step action plan to get started',
          de: '1d. Schritt-für-Schritt-Action-Plan',
        },
        bullets: {
          en: [
            'Step 1 — Define Your B2B Software Idea: shop management / Shopware tools, bulk e-commerce SEO generators, document/data processors, translation pipelines, AI API gateways / workflow managers for SMBs',
            'Step 2 — Register as an AWS Marketplace Seller: AWS Marketplace Management Portal (AMMP) → seller profile → bank details for direct deposit payouts',
            'Step 3 — Build the SaaS App in Cursor IDE: frontend + backend + DB; add onboarding Route /api/aws/fulfill — POST token → ResolveCustomer → workspace in Supabase → dashboard login',
            'Step 4 — Submit Your Listing on AWS: Create SaaS Product → Flat Monthly Rate, Per-User Contract, or Pay-As-You-Go Usage (metered) → Fulfillment URL (e.g. https://your-app.com/api/aws/fulfill) → sandbox test → submit for review → go live',
            '⚠ Educational outline — verify AMMP fields, tokens, and SDK APIs in current AWS docs before shipping',
          ],
          de: [
            'Schritt 1 — B2B-Software-Idee: Shop-Management / Shopware-Tools, Bulk-E-Commerce-SEO, Doc/Daten-Prozessoren, Übersetzungs-Pipelines, KI-API-Gateways / Workflow-Manager für KMUs',
            'Schritt 2 — Als AWS-Marketplace-Seller registrieren: AWS Marketplace Management Portal (AMMP) → Seller-Profil → Bankdaten für Direct Deposit',
            'Schritt 3 — SaaS in Cursor IDE bauen: Frontend + Backend + DB; Onboarding-Route /api/aws/fulfill — POST-Token → ResolveCustomer → Workspace in Supabase → Dashboard-Login',
            'Schritt 4 — Listing einreichen: Create SaaS Product → Flat Monthly Rate, Per-User Contract oder Pay-As-You-Go Usage (metered) → Fulfillment URL (z. B. https://your-app.com/api/aws/fulfill) → Sandbox → Review → Live',
            '⚠ Bildungs-Outline — AMMP-Felder, Tokens und SDK-APIs vor Shipping in aktuellen AWS-Docs prüfen',
          ],
        },
        links: [
          {
            label: 'SaaS guidelines',
            url: 'https://docs.aws.amazon.com/marketplace/latest/userguide/saas-guidelines.html',
          },
        ],
      },
      {
        heading: {
          en: '2. Amazon Renewed (certified refurbished)',
          de: '2. Amazon Renewed (zertifiziert generalüberholt)',
        },
        bullets: {
          en: [
            'Sell professionally inspected, repaired, cleaned, tested, and repackaged electronics, tools, appliances — separate Renewed buy-box lane next to New',
            'Invite-only / application-gated: US sell.amazon.com cites itemized invoices ≥ $50,000 (owner briefs often $50,000 to $100,000) qualifying refurbished purchases in prior 90 days (180 days Home/Tools/Kitchen/Lawn & Garden); Apple CE often $2.5M / 90 days — UK often £20,000 / 90 days (verify marketplace)',
            'You must operate a refurbishing, repair, or sourcing pipeline — not dropshipping cheap new goods',
            'Existing sellers often need ODR ≤ 0.8% trailing 90 days; approval typically within ~10 days; sample packaging photos + warranty capability',
            'Buy Box Advantage: Renewed products get a separate high-converting buy box alongside brand-new retail items; must typically price ≥ ~5% below the New featured offer',
            'Massive Profit Margins (directional): buy broken/open-box cheap, repair, and resell them at 70%–80% of retail value — net after repair often ~40% - 60% — ⚠ verify every deal',
            'Suits: technicians with capital + repair/sourcing pipeline. Not ideal: DE creators with book/Merch capital only — verify amazon.de Renewed availability',
          ],
          de: [
            'Professionell geprüfte, reparierte, gereinigte, getestete, neu verpackte Elektronik, Tools, Geräte verkaufen — eigene Renewed-Buy-Box neben Neu',
            'Invite-only / bewerbungspflichtig: US sell.amazon.com nennt Rechnungen ≥ 50.000 $ (Owner-Briefs oft $50,000 to $100,000) in 90 Tagen (180 Tage Home/Tools/Kitchen/Garten); Apple oft 2,5 Mio $ — UK oft 20.000 £ (Marktplatz prüfen)',
            'Refurbishing-/Reparatur-/Sourcing-Pipeline nötig — kein Dropshipping billiger Neuware',
            'Bestehende Seller oft ODR ≤ 0,8 % trailing 90 Tage; Freigabe typisch ca. 10 Tage; Sample-Fotos + Garantiefähigkeit',
            'Buy Box Advantage: eigene hochkonvertierende Buy Box neben Neu; typisch ≥ ca. 5 % unter Neu-Featured-Offer',
            'Massive Profit Margins (Richtwert): günstig kaufen, reparieren, bei 70%–80% of retail value verkaufen — Netto oft 40% - 60% — ⚠ jeden Deal prüfen',
            'Passt: Techniker:innen mit Kapital + Reparatur-/Sourcing-Pipeline. Nicht ideal: DE-Creator nur mit Buch-/Merch-Kapital — amazon.de-Verfügbarkeit prüfen',
          ],
        },
        links: [
          { label: 'Amazon Renewed (US)', url: 'https://sell.amazon.com/programs/renewed' },
        ],
      },
      {
        heading: {
          en: '3. Amazon Merch on Demand (niche apparel & prints)',
          de: '3. Amazon Merch on Demand (Nischen-Apparel & Prints)',
        },
        bullets: {
          en: [
            'Zero Production Cost: Amazon manufactures, packages, ships, and handles CS for every item — you simply earn a royalty on Amazon’s primary catalog',
            'Application gate + Tier System: start Tier 10 (10 live designs), then Tier 25 / 100 / 500 / 1,000+ with real sales — blocks spam catalogs; third-party acceptance often cited ~30–40% (⚠ not official)',
            'US royalties from 1 Jun 2026: Creator / Plus / Premium by non-organic traffic — Plus ~15%+ external (+ often ≥10 US units/mo), Premium ~35%; Plus ≈ 2× Creator, Premium ≈ 2.16× Creator',
            'Example cited for ~$19.99 US tee: ~$2.44 Creator / ~$4.88 Plus / ~$5.27 Premium — historical / Plus-group often 15% - 25% (Royalty) of list (⚠ verify dashboard; DE may differ)',
            'High Scale: once you tier up (e.g. Tier 1,000+), operate a multi-thousand-product catalog with passive royalties and no inventory risk',
            'Best DE kids-publisher fit: reuse StoryForge character art next to the book brand; open Hub Merch full guide for 4500×5400 PNG specs',
            'Suits: illustrators with €0 inventory. Not ideal: anyone who needs bulk wholesale margins',
          ],
          de: [
            'Zero Production Cost: Amazon produziert, verpackt, versendet und macht CS — Sie verdienen nur Royalty im primären Amazon-Katalog',
            'Bewerbungs-Gate + Tier System: Start Tier 10 (10 Live-Designs), dann Tier 25 / 100 / 500 / 1.000+ mit echten Sales — blockiert Spam; Drittanbieter-Annahme oft ca. 30–40 % (⚠ nicht offiziell)',
            'US-Royalties ab 1. Jun 2026: Creator / Plus / Premium nach Non-Organic-Traffic — Plus ca. 15 %+ External (+ oft ≥10 US-Units/Mo), Premium ca. 35 %; Plus ≈ 2× Creator, Premium ≈ 2,16× Creator',
            'Beispiel ca. 19,99 $-US-Tee: ca. 2,44 $ Creator / 4,88 $ Plus / 5,27 $ Premium — historisch / Plus oft 15% - 25% (Royalty) vom Listenpreis (⚠ Dashboard; DE kann abweichen)',
            'High Scale: nach Tier-Up (z. B. Tier 1.000+) multi-thousand-product catalog mit passiven Royalties ohne Lagerrisiko',
            'Beste DE-Kinderbuch-Passung: StoryForge-Figurenkunst neben der Buchmarke; Hub-Merch-Vollguide für 4500×5400-PNG-Specs',
            'Passt: Illustrator:innen mit 0 € Lager. Nicht ideal: wer Bulk-Wholesale-Margen braucht',
          ],
        },
        links: [
          { label: 'Merch on Demand', url: 'https://merch.amazon.com/' },
        ],
      },
      {
        heading: {
          en: '4. Amazon Custom (customizable & personalized)',
          de: '4. Amazon Custom (anpassbar & personalisiert)',
        },
        bullets: {
          en: [
            'Seller Central addon for engraving, monogramming, custom print, embroidery — shoppers configure text/image on the listing; you fulfill made-to-order (typically MFN)',
            'Requires Professional selling plan (Handmade can waive monthly fee); Custom registration — approvals often emailed within ~1 hour',
            'Defeats Chinese Manufacturers & Automated Bots: standard private-label is heavily targeted by overseas / Chinese manufacturers; custom needs local, fast fulfillment',
            'No Amazon Returns (preference): custom products generally not returnable for preference changes; may still be refunded/replaced within 30 days if damaged, defective, or materially different — SFP/FBA Prime rules can override (⚠ read live policy)',
            'High margins from emotional/gift purchases (weddings, anniversaries, corporate gifts) combined with low return rates — directional ~35% - 50%',
            'Suits: makers with laser/embroidery and short lead times. Not ideal: zero-touch POD only (use Merch)',
          ],
          de: [
            'Seller-Central-Addon für Gravur, Monogramm, Custom-Print, Stickerei — Käufer:innen konfigurieren Text/Bild am Listing; Sie fulfillment Made-to-Order (typisch MFN)',
            'Braucht Professional Selling Plan (Handmade kann Monatsgebühr erlassen); Custom-Registrierung — Freigaben oft innerhalb ca. 1 Stunde',
            'Defeats Chinese Manufacturers & Automated Bots: Standard-Private-Label wird stark von Overseas-/chinesischen Herstellern angegriffen; Custom braucht lokale, schnelle Fulfillment',
            'No Amazon Returns (Geschmack): Custom typisch nicht rückgabefähig bei Geschmackswechsel; Erstattung/Ersatz innerhalb 30 Tagen bei Schaden/Defekt möglich — SFP/FBA-Prime kann überschreiben (⚠ Live-Policy)',
            'Hohe Margen durch Emotions-/Geschenkkäufe (Hochzeit, Jubiläum, Corporate Gifts) bei niedrigen Returns — Richtwert ca. 35% - 50%',
            'Passt: Maker mit Laser/Stick und kurzen Lead Times. Nicht ideal: nur Zero-Touch-POD (lieber Merch)',
          ],
        },
        links: [
          { label: 'Amazon Custom', url: 'https://sell.amazon.com/programs/custom' },
        ],
      },
      {
        heading: {
          en: '5. Amazon Business (B2B bulk sourcing)',
          de: '5. Amazon Business (B2B-Bulk)',
        },
        bullets: {
          en: [
            'Same catalog, different buyers: orgs, schools, clinics, procurement — layer Business-Only Pricing + Quantity Discounts (up to 5 tiers) on existing ASINs',
            'Most sellers optimize only consumer keywords; requires Quantity Discounts, Business-Only Pricing, and Tax-Exemption certificates (ATEP / VCS where available)',
            'High Average Order Value (AOV): instead of 1 unit for $20, a single B2B order frequently spans 50 to 500 units to one corporate address',
            'Repeat Automated Orders: corporate clients set up recurring / scheduled purchase schedules — predictable monthly revenue',
            'From 1 Oct 2025: reduced referral fees on qualifying bulk Business orders when business price or quantity discount ≥ ~3% under standard; typically on the portion of a single-ASIN order above ~$1,000 (verify Seller Central)',
            'Amazon marketing cites “8 million+” business customers worldwide — ⚠ marketing figure',
            'Suits: inventory sellers (FBA/FBM) with packable SKUs. Not ideal: digital-only KDP/Merch with no physical stock',
            'Directional net margins often cited 25% - 40% — ⚠ referral fees dominate',
          ],
          de: [
            'Gleicher Katalog, andere Käufer: Orgs, Schulen, Kliniken, Beschaffung — Business-Only Pricing + Quantity Discounts (bis 5 Tiers) auf bestehende ASINs',
            'Die meisten Seller optimieren nur Consumer-Keywords; braucht Quantity Discounts, Business-Only Pricing und Tax-Exemption-Zertifikate (ATEP / VCS wo verfügbar)',
            'High Average Order Value (AOV): statt 1 Einheit für 20 $ oft 50 to 500 units an eine Corporate-Adresse',
            'Repeat Automated Orders: Corporate-Kunden richten recurring / geplante Kaufpläne ein — planbarer Monatsumsatz',
            'Ab 1. Okt 2025: reduzierte Referral Fees bei qualifizierenden Bulk-Business-Orders, wenn Business-Preis/Mengenrabatt ≥ ca. 3 % unter Standard; typisch auf den Anteil einer Single-ASIN-Order über ca. 1.000 $ (Seller Central prüfen)',
            'Amazon-Marketing nennt „8 Millionen+“ Business-Kunden weltweit — ⚠ Marketingzahl',
            'Passt: Lager-Seller (FBA/FBM) mit packbaren SKUs. Nicht ideal: nur digitales KDP/Merch ohne physisches Lager',
            'Richt-Nettomargen oft 25% - 40% — ⚠ Referral Fees dominieren',
          ],
        },
        links: [
          {
            label: 'Amazon Business (sellers)',
            url: 'https://sell.amazon.com/programs/amazon-business',
          },
        ],
      },
      {
        heading: {
          en: 'Master comparison matrix (directional)',
          de: 'Master-Vergleichsmatrix (Richtwerte)',
        },
        rows: [
          {
            label: { en: 'AWS Marketplace (SaaS/AI)', de: 'AWS Marketplace (SaaS/KI)' },
            detail: {
              en: 'Entry Barrier High · Competition Level Extremely Low · Profit Margins 80% - 95%* · Key Skill Required: Software Dev / API / Cloud Infra',
              de: 'Entry Barrier Hoch · Competition Level Extrem niedrig · Profit Margins 80% - 95%* · Key Skill Required: Software Dev / API / Cloud Infra',
            },
          },
          {
            label: { en: 'Amazon Renewed', de: 'Amazon Renewed' },
            detail: {
              en: 'Entry Barrier High (Financial) · Competition Level Very Low · Profit Margins 40% - 60%* · Key Skill Required: Sourcing / Repair / Operations',
              de: 'Entry Barrier Hoch (Kapital) · Competition Level Sehr niedrig · Profit Margins 40% - 60%* · Key Skill Required: Sourcing / Reparatur / Ops',
            },
          },
          {
            label: { en: 'Amazon Custom', de: 'Amazon Custom' },
            detail: {
              en: 'Entry Barrier Medium · Competition Level Low · Profit Margins 35% - 50%* · Key Skill Required: Personalization / Laser Engraving / POD',
              de: 'Entry Barrier Mittel · Competition Level Niedrig · Profit Margins 35% - 50%* · Key Skill Required: Personalisierung / Laser / POD',
            },
          },
          {
            label: { en: 'Amazon Business (B2B)', de: 'Amazon Business (B2B)' },
            detail: {
              en: 'Entry Barrier Medium · Competition Level Low to Medium · Profit Margins 25% - 40%* · Key Skill Required: Bulk Sourcing / B2B Pricing Strategy',
              de: 'Entry Barrier Mittel · Competition Level Niedrig bis mittel · Profit Margins 25% - 40%* · Key Skill Required: Bulk-Sourcing / B2B-Pricing',
            },
          },
          {
            label: { en: 'Merch on Demand', de: 'Merch on Demand' },
            detail: {
              en: 'Entry Barrier High (Approval) · Competition Level Low at High Tiers · Profit Margins 15% - 25% (Royalty)* · Key Skill Required: Niche Graphic Design / SEO',
              de: 'Entry Barrier Hoch (Freigabe) · Competition Level Niedrig auf hohen Tiers · Profit Margins 15% - 25% (Royalty)* · Key Skill Required: Nischen-Grafikdesign / SEO',
            },
          },
          {
            label: { en: 'Standard KDP / FBA (ref.)', de: 'Standard KDP / FBA (Ref.)' },
            detail: {
              en: 'Entry Barrier Low · Competition Level Hyper-Saturated · Profit Margins 15% - 30%* · Key Skill Required: Heavy Ad Spend / Competition',
              de: 'Entry Barrier Niedrig · Competition Level Hyper-gesättigt · Profit Margins 15% - 30%* · Key Skill Required: Starke Ads / Konkurrenz',
            },
          },
        ],
        note: {
          en: '*Profit Margins are directional for comparison only — fees, COGS, ads, and returns decide real net. US Merch Creator can run ~12% organic-only.',
          de: '*Profit Margins sind Richtwerte zum Vergleich — Fees, COGS, Ads und Returns entscheiden das echte Netto. US-Merch Creator kann bei rein organisch ca. 12 % liegen.',
        },
      },
      {
        heading: {
          en: 'Pick your path (DE founder cheat-sheet)',
          de: 'Pfad wählen (DE-Gründer:innen-Cheat-Sheet)',
        },
        bullets: {
          en: [
            'Creator with art/books, €0 inventory → Merch (+ keep KDP)',
            'Maker with laser/embroidery shop → Amazon Custom',
            'Inventory seller wanting larger orders → Amazon Business pricing',
            'Technician with capital + repair line → Amazon Renewed (check DE availability)',
            'Developer / AI tool builder → AWS Marketplace',
          ],
          de: [
            'Creator mit Kunst/Büchern, 0 € Lager → Merch (+ KDP behalten)',
            'Maker mit Laser-/Stick-Shop → Amazon Custom',
            'Lager-Seller mit größeren Orders → Amazon Business Pricing',
            'Techniker:in mit Kapital + Reparaturlinie → Amazon Renewed (DE-Verfügbarkeit prüfen)',
            'Developer / KI-Tool-Builder → AWS Marketplace',
          ],
        },
      },
    ],
  },
  {
    id: 'publish-wide-email',
    title: {
      en: 'Publish wide + email list — don’t put all eggs in one basket',
      de: 'Wide publizieren + E-Mail-Liste — nicht alle Eier in einen Korb',
    },
    summary: {
      en: 'Beginner insurance: publish wide (KDP non-Select + Draft2Digital / Tolino Media; KDP Print + BoD / IngramSpark) plus DACH platforms (Tolino, BoD, epubli, BookRix) with DE legal/admin rules (Impressum, Buchpreisbindung, SEPA, Steuernummer, .epub/.pdf, DNB Pflichtexemplare) and a lead-magnet email list. ⚠ Not Amazon Help; not legal/tax advice.',
      de: 'Anfänger-Absicherung: wide publizieren (KDP ohne Select + Draft2Digital / Tolino Media; KDP Print + BoD / IngramSpark) plus DACH-Plattformen (Tolino, BoD, epubli, BookRix) mit DE-Recht/Admin (Impressum, Buchpreisbindung, SEPA, Steuernummer, .epub/.pdf, DNB-Pflichtexemplare) und Lead-Magnet-E-Mail-Liste. ⚠ Kein Amazon-Help; keine Rechts-/Steuerberatung.',
    },
    sections: [
      {
        heading: {
          en: 'Why beginners must not put all eggs in one basket',
          de: 'Warum Einsteiger:innen nicht alle Eier in einen Korb legen dürfen',
        },
        bullets: {
          en: [
            'When you rely only on Amazon KDP, your entire business depends on one company',
            'If Amazon changes algorithms, adjusts royalty rates, or closes an account, your publishing income can vanish overnight',
            'Two strategies fix this: (1) Publishing Wide across multiple platforms (2) Building an email list you own direct-to-consumer',
            'Implement both into your setup before you treat Amazon as “the whole business”',
          ],
          de: [
            'Wenn Sie nur auf Amazon KDP setzen, hängt Ihr ganzes Business von einer Firma ab',
            'Wenn Amazon Algorithmen ändert, Royalties anpasst oder ein Konto schließt, kann Ihr Publishing-Einkommen über Nacht verschwinden',
            'Zwei Strategien dagegen: (1) Wide über mehrere Plattformen (2) E-Mail-Liste, die Sie Direct-to-Consumer besitzen',
            'Beide in Ihr Setup einbauen, bevor Sie Amazon als „das ganze Business“ behandeln',
          ],
        },
        note: {
          en: '⚠ Guide only — not tax, legal, or Amazon advice. Verify KDP Select, Expanded Distribution, D2D, IngramSpark, and ESP terms before you enroll or pay.',
          de: '⚠ Nur Orientierung — keine Steuer-, Rechts- oder Amazon-Beratung. KDP Select, Expanded Distribution, D2D, IngramSpark und ESP-AGB vor Anmeldung oder Zahlung prüfen.',
        },
        links: [
          { label: 'KDP home', url: 'https://kdp.amazon.com/' },
          {
            label: 'KDP Select',
            url: 'https://kdp.amazon.com/en_US/help/topic/G200798990',
          },
        ],
      },
      {
        heading: {
          en: 'Strategy 1 — Publishing wide (protecting your business across platforms)',
          de: 'Strategie 1 — Wide publizieren (Business über Plattformen absichern)',
        },
        bullets: {
          en: [
            'Goal: protect your business by distributing across multiple platforms — not Amazon alone',
            'What it means: making your book available everywhere readers buy or read books, rather than giving Amazon 100% exclusivity',
            'Why it matters: when you rely only on Amazon KDP, your entire business depends on one company',
            'If Amazon changes its algorithms, adjusts royalty rates, or closes an account, your entire publishing income vanishes overnight',
            'By publishing wide you build multiple income streams and maintain direct access to global audiences',
            'How to set it up: (1a) ebooks via KDP non-Select + Draft2Digital or direct platform accounts (1b) print via KDP + IngramSpark',
          ],
          de: [
            'Ziel: Business absichern, indem Sie über mehrere Plattformen distribuieren — nicht nur Amazon',
            'Bedeutung: Ihr Buch überall verfügbar machen, wo Leser:innen kaufen oder lesen — statt Amazon 100 % Exklusivität zu geben',
            'Warum: wenn Sie nur auf Amazon KDP setzen, hängt Ihr ganzes Business von einer Firma ab',
            'Wenn Amazon Algorithmen ändert, Royalties anpasst oder ein Konto schließt, verschwindet Ihr gesamtes Publishing-Einkommen über Nacht',
            'Wide baut mehrere Einkommensströme und erhält direkten Zugang zu globalen Audiences',
            'Setup: (1a) E-Books über KDP ohne Select + Draft2Digital oder Direktkonten (1b) Print über KDP + IngramSpark',
          ],
        },
      },
      {
        heading: {
          en: 'Strategy 1a — Ebooks: KDP + Draft2Digital (or direct platform accounts)',
          de: 'Strategie 1a — E-Books: KDP + Draft2Digital (oder Direktkonten)',
        },
        bullets: {
          en: [
            'The non-exclusive choice: when publishing an ebook on Amazon KDP, do NOT enroll in KDP Select / Kindle Unlimited',
            'KDP Select requires 90 days of absolute ebook exclusivity on Amazon',
            'Standard KDP publishing remains non-exclusive, leaving you free to sell your ebook anywhere else',
            'Using Draft2Digital (D2D): instead of manually creating accounts on dozens of small international sites, upload your ebook file (.epub) to Draft2Digital',
            'D2D automatically distributes your ebook to Apple Books (huge market for iOS / Mac users)',
            'Kobo (dominant reader platform in Canada, Europe, Australia, and Asia)',
            'Barnes & Noble (Nook)',
            'Google Play Books',
            'Public library systems (e.g. OverDrive, Hoopla, Bibliotheca) — where libraries buy copies or pay per checkout',
            'Or direct platform accounts: later you may also open Apple Books for Authors, Kobo Writing Life, and Google Play Books Publisher Center yourself — D2D is the beginner start so you are not blocked on day one',
          ],
          de: [
            'Nicht-exklusive Wahl: beim E-Book auf Amazon KDP KDP Select / Kindle Unlimited NICHT einschreiben',
            'KDP Select verlangt 90 Tage absolute E-Book-Exklusivität bei Amazon',
            'Standard-KDP bleibt nicht-exklusiv — Sie dürfen Ihr E-Book überall sonst verkaufen',
            'Draft2Digital (D2D): statt Dutzende kleine internationale Konten manuell anzulegen, E-Book-Datei (.epub) bei Draft2Digital hochladen',
            'D2D distribuiert automatisch an Apple Books (großer Markt für iOS-/Mac-Nutzer:innen)',
            'Kobo (dominante Reader-Plattform in Kanada, Europa, Australien und Asien)',
            'Barnes & Noble (Nook)',
            'Google Play Books',
            'Öffentliche Bibliothekssysteme (z. B. OverDrive, Hoopla, Bibliotheca) — Bibliotheken kaufen Exemplare oder zahlen pro Ausleihe',
            'Oder Direktkonten: später auch Apple Books for Authors, Kobo Writing Life und Google Play Books Publisher Center selbst — D2D ist der Einsteiger-Start, damit Sie am Tag eins nicht blockiert sind',
          ],
        },
        links: [
          { label: 'Draft2Digital', url: 'https://www.draft2digital.com/' },
          {
            label: 'KDP Select',
            url: 'https://kdp.amazon.com/en_US/help/topic/G200798990',
          },
          { label: 'Apple Books for Authors', url: 'https://authors.apple.com/' },
          { label: 'Kobo Writing Life', url: 'https://www.kobo.com/writinglife' },
        ],
        note: {
          en: '⚠ Never upload a Select-enrolled ebook to D2D or other stores during the exclusive window — that can trigger account problems. Verify live D2D outlet list before publish.',
          de: '⚠ Nie ein Select-eingeschriebenes E-Book während der Exklusivität bei D2D oder anderen Stores hochladen — das kann Kontoprobleme auslösen. Aktuelle D2D-Outlet-Liste vor Publish prüfen.',
        },
      },
      {
        heading: {
          en: 'Strategy 1b — Print: Amazon KDP + IngramSpark',
          de: 'Strategie 1b — Print: Amazon KDP + IngramSpark',
        },
        bullets: {
          en: [
            'Amazon KDP for Amazon sales: use Amazon KDP Print to manufacture and ship paperbacks/hardcovers sold directly on Amazon',
            'Uncheck “Expanded Distribution” on KDP',
            'IngramSpark for global & physical retailers: upload the exact same PDF interior and print cover files to IngramSpark',
            'Ingram Content Group is the primary book distributor used by physical bookstores, independent shops, schools, and libraries worldwide',
            'When bookstores or libraries look up your ISBN in their ordering catalog, Ingram handles fulfillment, enabling them to stock your physical book',
            'Plan ISBN early: bookstore-friendly distribution often needs your own ISBN (see First-time publisher truths → ISBN & rights)',
          ],
          de: [
            'Amazon KDP für Amazon-Verkäufe: Amazon KDP Print für Herstellung und Versand von Paperbacks/Hardcovern, die direkt auf Amazon verkauft werden',
            '„Expanded Distribution“ bei KDP abwählen',
            'IngramSpark für globale & physische Händler: exakt dieselben PDF-Innenteil- und Print-Cover-Dateien bei IngramSpark hochladen',
            'Ingram Content Group ist der Haupt-Buchdistributor für physische Buchhandlungen, Independent Shops, Schulen und Bibliotheken weltweit',
            'Wenn Buchhandlungen oder Bibliotheken Ihre ISBN im Bestellkatalog suchen, übernimmt Ingram die Erfüllung — so können sie Ihr physisches Buch führen',
            'ISBN früh planen: buchhandelsfreundliche Distribution braucht oft eine eigene ISBN (siehe Wahrheiten für Erstautor:innen → ISBN & Rechte)',
          ],
        },
        links: [
          { label: 'IngramSpark', url: 'https://www.ingramspark.com/' },
          { label: 'KDP', url: 'https://kdp.amazon.com/' },
        ],
        note: {
          en: '⚠ Print file specs, setup fees, wholesale discounts, and returnability differ between KDP and IngramSpark — confirm current terms on both sites.',
          de: '⚠ Print-Dateispecs, Setup-Gebühren, Großhandelsrabatte und Remission unterscheiden sich zwischen KDP und IngramSpark — aktuelle Konditionen auf beiden Seiten prüfen.',
        },
      },
      {
        heading: {
          en: 'Strategy 2 — Email list (owning reader relationships direct-to-consumer)',
          de: 'Strategie 2 — E-Mail-Liste (Leser:innen-Beziehung Direct-to-Consumer besitzen)',
        },
        bullets: {
          en: [
            'Goal: own your reader relationships direct-to-consumer — not only through rented storefronts',
            'When a reader buys a book on Amazon, Apple, or Kobo, that platform keeps the reader’s email address and contact information',
            'You do not know who bought your book',
            'Building an email list means placing an invitation inside your book that offers the reader a free piece of bonus content (a “Lead Magnet”) in exchange for joining your mailing list',
            'You then own a direct channel for launch day sales, series news, and Merch offers without renting Amazon’s algorithm',
          ],
          de: [
            'Ziel: Leser:innen-Beziehungen Direct-to-Consumer besitzen — nicht nur über gemietete Storefronts',
            'Wenn jemand ein Buch auf Amazon, Apple oder Kobo kauft, behält die Plattform E-Mail-Adresse und Kontaktdaten',
            'Sie wissen nicht, wer Ihr Buch gekauft hat',
            'E-Mail-Liste aufbauen heißt: Einladung im Buch mit gratis Bonus-Inhalt („Lead-Magnet“) im Tausch gegen Anmeldung zur Mailingliste',
            'Dann besitzen Sie einen Direktkanal für Launch-Day-Sales, Serien-News und Merch ohne Amazons Algorithmus zu mieten',
          ],
        },
      },
      {
        heading: {
          en: 'Strategy 2 — Step 1: Create a compelling lead magnet',
          de: 'Strategie 2 — Schritt 1: Überzeugenden Lead-Magnet erstellen',
        },
        bullets: {
          en: [
            'A lead magnet is a free bonus designed specifically for someone who enjoyed your book',
            'For Fiction / Children’s Books: free coloring pages / activity sheets based on the characters',
            'For Fiction / Children’s Books: a bonus printable reward chart or bilingual vocabulary poster (strong fit for StoryForge bilingual series)',
            'For Fiction / Children’s Books: a free companion short story or deleted prequel chapter',
            'For Non-Fiction Books: a downloadable PDF cheat sheet, checklist, or template',
            'For Non-Fiction Books: a resource directory or video tutorial extending a topic covered in the book (AuthorForge companions)',
          ],
          de: [
            'Ein Lead-Magnet ist ein Gratis-Bonus speziell für jemanden, dem Ihr Buch gefallen hat',
            'Für Fiction / Kinderbücher: kostenlose Malvorlagen / Activity-Sheets zu den Figuren',
            'Für Fiction / Kinderbücher: druckbare Belohnungstabelle oder zweisprachiges Vokabel-Poster (stark für StoryForge-Zweisprach-Serien)',
            'Für Fiction / Kinderbücher: kostenlose Begleit-Kurzgeschichte oder gestrichenes Prequel-Kapitel',
            'Für Non-Fiction: herunterladbares PDF-Cheat-Sheet, Checkliste oder Vorlage',
            'Für Non-Fiction: Ressourcenverzeichnis oder Video-Tutorial, das ein Buchthema vertieft (AuthorForge-Begleiter)',
          ],
        },
      },
      {
        heading: {
          en: 'Strategy 2 — Step 2: Set up an ESP, landing page & welcome sequence',
          de: 'Strategie 2 — Schritt 2: ESP, Landingpage & Welcome-Sequenz einrichten',
        },
        bullets: {
          en: [
            '1) Sign up for a free or low-cost Email Service Provider (ESP) such as MailerLite, ConvertKit (Kit), or Mailchimp',
            '2) Create a simple landing page with a sign-up form (e.g. “Enter your email to download your free bonus activity pack!”)',
            '3) Set up an automated welcome sequence: when someone enters their email, the platform instantly emails them a link to download the PDF',
            'Host the PDF on your site, Drive/Dropbox link, or the ESP’s file feature — keep the URL stable so printed books do not break',
            'Use a short vanity URL in the book (www.yourwebsite.com/bonus) that redirects to the real landing page',
          ],
          de: [
            '1) Kostenlosen oder günstigen E-Mail-Service (ESP) wählen — z. B. MailerLite, ConvertKit (Kit) oder Mailchimp',
            '2) Einfache Landingpage mit Anmeldeformular (z. B. „E-Mail eingeben und Gratis-Bonus-Activity-Pack laden!“)',
            '3) Automatische Welcome-Sequenz: nach E-Mail-Eingabe sofort Link zum PDF-Download',
            'PDF auf Ihrer Site, Drive/Dropbox oder ESP-Dateihosting — URL stabil halten, damit gedruckte Bücher nicht brechen',
            'Kurze Vanity-URL im Buch (www.ihrewebsite.de/bonus), die zur echten Landingpage weiterleitet',
          ],
        },
        links: [
          { label: 'MailerLite', url: 'https://www.mailerlite.com/' },
          { label: 'Kit (ConvertKit)', url: 'https://kit.com/' },
          { label: 'Mailchimp', url: 'https://mailchimp.com/' },
        ],
        note: {
          en: '⚠ ESP free tiers, GDPR consent wording, and DE Impressum rules change — use double opt-in where required and keep a privacy note on the form.',
          de: '⚠ ESP-Free-Tiers, DSGVO-Einwilligungstexte und DE-Impressum ändern sich — Double-Opt-in wo nötig; Datenschutzhinweis am Formular.',
        },
      },
      {
        heading: {
          en: 'Strategy 2 — Step 3: Embed the CTA inside your book (copy-paste)',
          de: 'Strategie 2 — Schritt 3: CTA ins Buch einbetten (Kopiervorlage)',
        },
        bullets: {
          en: [
            'Place the offer in two high-visibility locations inside your book interior file',
            '1) In the Front Matter (Before Chapter 1): FREE BONUS FOR READERS: Download your free printable activity kit at: www.yourwebsite.com/bonus',
            '2) In the Back Matter (Right After the Final Page): Thank You for Reading! Get your exclusive bonus materials at www.yourwebsite.com/bonus. If you enjoyed this book, please leave an honest review on Amazon or Goodreads!',
            'Replace www.yourwebsite.com/bonus with your real vanity URL that points to the ESP landing page',
            'StoryForge / AuthorForge: add these pages before final PDF/EPUB export so every wide storefront carries the same list CTA',
          ],
          de: [
            'Das Angebot an zwei hochsichtbaren Stellen im Buch-Innenteil platzieren',
            '1) Im Front Matter (vor Kapitel 1): GRATIS-BONUS FÜR LESER:INNEN: Laden Sie Ihr druckbares Activity-Kit herunter unter: www.ihrewebsite.de/bonus',
            '2) Im Back Matter (direkt nach der letzten Seite): Danke fürs Lesen! Exklusive Bonus-Materialien unter www.ihrewebsite.de/bonus. Wenn Ihnen das Buch gefallen hat, hinterlassen Sie bitte eine ehrliche Rezension auf Amazon oder Goodreads!',
            'www.ihrewebsite.de/bonus durch Ihre echte Vanity-URL ersetzen, die zur ESP-Landingpage zeigt',
            'StoryForge / AuthorForge: diese Seiten vor dem finalen PDF/EPUB-Export einfügen, damit jeder Wide-Storefront denselben Listen-CTA trägt',
          ],
        },
      },
      {
        heading: {
          en: 'Sample landing page layout (copy structure)',
          de: 'Beispiel-Landingpage-Layout (Kopierstruktur)',
        },
        bullets: {
          en: [
            'Headline: Free bonus for [Book Title] readers',
            'Subhead: Enter your email to download the printable activity pack / checklist',
            'Bullet proof of value: 3–5 concrete bonuses (pages, poster, cheat sheet)',
            'Form fields: email (+ first name optional) + GDPR consent checkbox',
            'Button: Send my free bonus',
            'Trust line: No spam. Unsubscribe anytime. Privacy policy link',
            'Footer: Impressum / contact (required for many DE sites)',
          ],
          de: [
            'Headline: Gratis-Bonus für Leser:innen von [Buchtitel]',
            'Subhead: E-Mail eingeben und druckbares Activity-Pack / Checkliste laden',
            'Wert-Bullets: 3–5 konkrete Boni (Seiten, Poster, Cheat-Sheet)',
            'Formular: E-Mail (+ optional Vorname) + DSGVO-Checkbox',
            'Button: Bonus jetzt senden',
            'Trust-Zeile: Kein Spam. Jederzeit abmelden. Link zur Datenschutzerklärung',
            'Footer: Impressum / Kontakt (für viele DE-Sites Pflicht)',
          ],
        },
      },
      {
        heading: {
          en: 'Sample welcome email template',
          de: 'Beispiel-Welcome-E-Mail-Vorlage',
        },
        bullets: {
          en: [
            'Subject: Your free bonus for [Book Title] is here',
            'Hi [First name / there], thank you for reading [Book Title] — here is your promised bonus.',
            'Download link: [secure PDF URL]',
            'What’s inside: [1–3 bullet list matching the landing page]',
            'Soft CTA: When you finish the bonus, reply and tell me which character / tip helped most — I read every reply.',
            'Review ask (optional, honest only): If the book helped, an honest review on Amazon or Goodreads helps other families find it.',
            'Sign-off: [Your name] · [Series / imprint] · Unsubscribe link (required)',
          ],
          de: [
            'Betreff: Ihr Gratis-Bonus zu [Buchtitel] ist da',
            'Hallo [Vorname / dort], danke dass Sie [Buchtitel] lesen — hier ist Ihr versprochener Bonus.',
            'Download-Link: [sichere PDF-URL]',
            'Inhalt: [1–3 Bullets wie auf der Landingpage]',
            'Sanfter CTA: Wenn der Bonus fertig ist, antworten Sie gerne welche Figur / welcher Tipp am meisten geholfen hat — ich lese jede Antwort.',
            'Review-Bitte (optional, nur ehrlich): Wenn das Buch geholfen hat, hilft eine ehrliche Rezension auf Amazon oder Goodreads anderen Familien.',
            'Gruß: [Ihr Name] · [Serie / Imprint] · Abmeldelink (Pflicht)',
          ],
        },
        note: {
          en: '⚠ Never incentivize reviews with free gifts in ways that break Amazon’s Customer Reviews policies — keep review asks voluntary and honest.',
          de: '⚠ Reviews nie mit Geschenken so anreizen, dass Amazons Customer-Reviews-Regeln verletzt werden — Review-Bitten freiwillig und ehrlich halten.',
        },
      },
      {
        heading: {
          en: 'Comparison summary — Amazon Exclusive (KDP Select) vs Publishing Wide + Email List',
          de: 'Vergleich — Amazon Exclusive (KDP Select) vs Publishing Wide + E-Mail-Liste',
        },
        rows: [
          {
            label: { en: 'Platform risk', de: 'Plattform-Risiko' },
            detail: {
              en: 'Amazon Exclusive (KDP Select): High — one account termination stops all income. Publishing Wide + Email List: Low — income diversified across multiple platforms.',
              de: 'Amazon Exclusive (KDP Select): Hoch — eine Kontokündigung stoppt alles Einkommen. Publishing Wide + E-Mail-Liste: Niedrig — Einkommen über mehrere Plattformen gestreut.',
            },
          },
          {
            label: { en: 'Audience control', de: 'Audience-Kontrolle' },
            detail: {
              en: 'Amazon Exclusive: Amazon owns all customer records and data. Publishing Wide + Email List: You own your subscriber list and can contact readers anytime.',
              de: 'Amazon Exclusive: Amazon besitzt alle Kundendaten. Publishing Wide + E-Mail-Liste: Sie besitzen Ihre Abonnentenliste und erreichen Leser:innen jederzeit.',
            },
          },
          {
            label: { en: 'Market reach', de: 'Marktreichweite' },
            detail: {
              en: 'Amazon Exclusive: primarily Amazon Kindle ecosystems. Publishing Wide + Email List: Global (Apple, Kobo, Libraries, Bookstores, Direct Website).',
              de: 'Amazon Exclusive: vor allem Amazon-Kindle-Ökosysteme. Publishing Wide + E-Mail-Liste: Global (Apple, Kobo, Bibliotheken, Buchhandel, eigene Website).',
            },
          },
          {
            label: { en: 'New book launches', de: 'Neue Buch-Launches' },
            detail: {
              en: 'Amazon Exclusive: reliant on Amazon’s internal algorithms. Publishing Wide + Email List: send one email to your reader list to drive instant day-one sales.',
              de: 'Amazon Exclusive: abhängig von Amazons internen Algorithmen. Publishing Wide + E-Mail-Liste: eine E-Mail an die Leser:innen-Liste für sofortige Day-One-Sales.',
            },
          },
        ],
      },
      {
        heading: {
          en: 'Strategy 1c — German / DACH self-publishing (independent of Amazon)',
          de: 'Strategie 1c — Deutsches / DACH-Selfpublishing (unabhängig von Amazon)',
        },
        bullets: {
          en: [
            'Yes — Germany has strong domestic self-publishing platforms. German-speaking Europe (Germany, Austria, Switzerland — the DACH region) has a massive self-publishing ecosystem independent of Amazon',
            'If you want readers who buy through local chains (Thalia, Hugendubel, Weltbild) or read on Tolino e-readers rather than Kindles, publish directly through these platforms',
            'Keep KDP Select OFF if you also upload the same ebook here',
          ],
          de: [
            'Ja — Deutschland hat starke heimische Selfpublishing-Plattformen. Der deutschsprachige Raum (DE, AT, CH — DACH) hat ein großes Selfpublishing-Ökosystem unabhängig von Amazon',
            'Wenn Leser:innen über lokale Ketten (Thalia, Hugendubel, Weltbild) kaufen oder auf Tolino statt Kindle lesen, direkt über diese Plattformen publizieren',
            'KDP Select AUS lassen, wenn Sie dasselbe E-Book auch hier hochladen',
          ],
        },
      },
      {
        heading: {
          en: '1. Tolino Media (tolino-media.de)',
          de: '1. Tolino Media (tolino-media.de)',
        },
        bullets: {
          en: [
            'The Tolino Alliance is the main rival to Amazon Kindle in Germany — backed by Germany’s largest traditional bookstore chains (Thalia, Hugendubel, Osiander, Weltbild) and telecommunications provider Deutsche Telekom',
            'What it does: distributes your ebooks and audiobooks across major German bookstore chains, the Tolino e-reader ecosystem, and German public libraries',
            'Ebook distribution: free upload; high royalty rates often cited up to ~87% of net sales depending on price (⚠ verify live rate card)',
            'Key advantage: Tolino e-readers hold a massive share of the German e-reader market — places your book in front of readers who never use Amazon',
          ],
          de: [
            'Die Tolino-Allianz ist der Hauptkonkurrent zu Amazon Kindle in DE — gestützt von großen Buchhandelsketten (Thalia, Hugendubel, Osiander, Weltbild) und Telekom',
            'Was sie tut: distribuiert E-Books und Hörbücher über große DE-Buchhandelsketten, das Tolino-E-Reader-Ökosystem und deutsche öffentliche Bibliotheken',
            'E-Book-Distribution: kostenloser Upload; hohe Royalties oft bis ca. 87 % vom Nettoverkauf je nach Preis genannt (⚠ Live-Tarif prüfen)',
            'Vorteil: Tolino-E-Reader haben großen Anteil am DE-E-Reader-Markt — Ihr Buch vor Leser:innen, die nie Amazon nutzen',
          ],
        },
        links: [{ label: 'Tolino Media', url: 'https://www.tolino-media.de/' }],
      },
      {
        heading: {
          en: '2. BoD – Books on Demand (bod.de)',
          de: '2. BoD – Books on Demand (bod.de)',
        },
        bullets: {
          en: [
            'Headquartered in Hamburg — Europe’s pioneer and market leader in print-on-demand and digital self-publishing',
            'What it does: publishes both print (paperback/hardcover) and ebooks',
            'VLB & bookstore entry: BoD assigns your print book an ISBN and registers it in the VLB (Verzeichnis Lieferbarer Bücher — the official German catalog of available books)',
            'Any local physical bookstore in Germany, Austria, or Switzerland can then order physical copies of your book',
            'Cost: ebook publishing often free; print publication usually carries a small setup fee (around €19–€39 cited for cataloging and physical distribution — ⚠ verify live package prices)',
          ],
          de: [
            'Sitz Hamburg — Europas Pionier und Marktführer bei Print-on-Demand und digitalem Selfpublishing',
            'Was sie tut: Print (Paperback/Hardcover) und E-Books',
            'VLB & Buchhandel: BoD vergibt eine ISBN und meldet im VLB (Verzeichnis Lieferbarer Bücher — offizieller DE-Katalog lieferbarer Bücher)',
            'Jede lokale physische Buchhandlung in DE, AT oder CH kann dann physische Exemplare bestellen',
            'Kosten: E-Book oft gratis; Print meist kleine Setup-Gebühr (oft ca. 19–39 € für Katalogisierung und physische Distribution genannt — ⚠ Live-Pakete prüfen)',
          ],
        },
        links: [
          { label: 'BoD', url: 'https://www.bod.de/' },
          { label: 'MVB / VLB', url: 'https://www.mvb-online.de/' },
        ],
      },
      {
        heading: {
          en: '3. epubli (epubli.de)',
          de: '3. epubli (epubli.de)',
        },
        bullets: {
          en: [
            'Owned by the Holtzbrinck Publishing Group (one of Germany’s largest publishing conglomerates) — popular self-publishing platform for German and international authors; based in Berlin',
            'What it does: handles both print-on-demand books and ebooks',
            'Distribution: ebook across Tolino, Amazon, Apple Books, Google Play, and local German online shops; prints on demand and lists physical books in the VLB for physical store ordering',
            'Cost: ebook publishing completely free (as commonly marketed); print setup starts with low pay-per-project options (⚠ verify live)',
          ],
          de: [
            'Gehört zur Holtzbrinck Publishing Group (eines der größten DE-Verlagsunternehmen) — beliebte Selfpublishing-Plattform für DE- und internationale Autor:innen; Sitz Berlin',
            'Was sie tut: Print-on-Demand und E-Books',
            'Distribution: E-Book über Tolino, Amazon, Apple Books, Google Play und lokale DE-Online-Shops; Print-on-Demand und VLB-Listung für Bestellung im Laden',
            'Kosten: E-Book-Publish oft komplett gratis vermarktet; Print-Setup mit günstigen Pay-per-Project-Optionen (⚠ live prüfen)',
          ],
        },
        links: [{ label: 'epubli', url: 'https://www.epubli.de/' }],
        note: {
          en: '⚠ If epubli also pushes to Amazon, avoid double-listing the same ebook edition via KDP + epubli Amazon channel — choose one Amazon path per edition.',
          de: '⚠ Wenn epubli auch zu Amazon liefert: dieselbe E-Book-Ausgabe nicht doppelt über KDP + epubli-Amazon-Kanal listen — einen Amazon-Pfad je Ausgabe wählen.',
        },
      },
      {
        heading: {
          en: '4. BookRix (bookrix.de)',
          de: '4. BookRix (bookrix.de)',
        },
        bullets: {
          en: [
            'Based in Munich — one of Germany’s oldest dedicated digital self-publishing platforms',
            'What it does: specializes primarily in ebook distribution and community-building for indie authors',
            'Distribution: upload once to distribute across Thalia, Hugendubel, Weltbild, Apple Books, Kobo, and Amazon',
            'Cost: free setup; they take a small commission on ebook sales royalties (⚠ verify current share)',
          ],
          de: [
            'Sitz München — eine der ältesten dedizierten digitalen Selfpublishing-Plattformen in DE',
            'Was sie tut: vor allem E-Book-Distribution und Community für Indie-Autor:innen',
            'Distribution: einmal hochladen → Thalia, Hugendubel, Weltbild, Apple Books, Kobo und Amazon',
            'Kosten: Setup gratis; kleine Kommission auf E-Book-Royalties (⚠ aktuellen Anteil prüfen)',
          ],
        },
        links: [{ label: 'BookRix', url: 'https://www.bookrix.de/' }],
        note: {
          en: '⚠ Same double-listing caution if BookRix distributes to Amazon while you also use KDP for that ebook.',
          de: '⚠ Gleiche Doppel-Listing-Vorsicht, wenn BookRix zu Amazon liefert und Sie dasselbe E-Book auch über KDP listen.',
        },
      },
      {
        heading: {
          en: 'Also useful: tredition + VLB layer',
          de: 'Auch nützlich: tredition + VLB-Schicht',
        },
        bullets: {
          en: [
            'tredition (tredition.de): independent DE self-pub; print + ebook; bookstore options — check exclusivity before parallel KDP',
            'VLB (Verzeichnis Lieferbarer Bücher): official German available-books catalog — bookstores order print via ISBN listed there (BoD / Tolino print / epubli / IngramSpark workflows often register you)',
            'Libreka: major DE ebook wholesale/discovery layer — usually reached via distributors, not always a direct beginner upload UI',
          ],
          de: [
            'tredition (tredition.de): unabhängiges DE-Selfpub; Print + E-Book; Buchhandelsoptionen — Exklusivität vor parallelem KDP prüfen',
            'VLB (Verzeichnis Lieferbarer Bücher): offizieller DE-Katalog lieferbarer Bücher — Buchhandlungen bestellen Print über dort gelistete ISBN (BoD / Tolino-Print / epubli / IngramSpark melden oft an)',
            'Libreka: große DE-E-Book-Wholesale-/Discovery-Schicht — meist über Distributoren, nicht immer direktes Einsteiger-Upload-UI',
          ],
        },
        links: [
          { label: 'tredition', url: 'https://tredition.de/' },
          { label: 'MVB / VLB', url: 'https://www.mvb-online.de/' },
        ],
      },
      {
        heading: {
          en: 'How these fit a wide publishing setup (DACH)',
          de: 'So passen sie in ein Wide-Setup (DACH)',
        },
        bullets: {
          en: [
            'Maximum reach without KDP Select: Amazon KDP (non-exclusive) + Tolino Media OR Draft2Digital + BoD OR IngramSpark',
            'Pro-tip for German regulations (Pressegesetz): DE-focused platforms or direct sales to German readers need an Impressum (legal publisher info page) in metadata / front matter — Tolino Media and similar often provide upload templates (⚠ not legal advice)',
          ],
          de: [
            'Maximale Reichweite ohne KDP Select: Amazon KDP (nicht-exklusiv) + Tolino Media ODER Draft2Digital + BoD ODER IngramSpark',
            'Pro-Tipp DE-Recht (Pressegesetz): DE-Plattformen oder Direktverkauf brauchen ein Impressum (rechtliche Verlagsangaben) in Metadaten / Front Matter — Tolino Media u. a. liefern oft Upload-Vorlagen (⚠ keine Rechtsberatung)',
          ],
        },
        rows: [
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
              de: 'Abdeckung: Thalia, Hugendubel, Weltbild, Kobo, Apple. Vorteil: erreicht Nicht-Amazon-E-Book-Leser:innen in ganz DE.',
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
        note: {
          en: 'Pro-tip (German regulations): if you publish on German-focused platforms (Tolino Media, BoD, epubli, BookRix…) or direct-sell to German readers, ensure book metadata / front matter includes an Impressum (legal publisher info page) as required under German media law (Pressegesetz). Tolino Media and similar platforms often provide tools or templates for a compliant Impressum during upload — ⚠ verify current legal requirements with a qualified advisor.',
          de: 'Pro-Tipp (DE-Recht): bei deutschen Plattformen (Tolino Media, BoD, epubli, BookRix…) oder Direktverkauf an DE-Leser:innen Impressum (rechtliche Verlagsangaben) in Metadaten / Front Matter — laut Presse-/Medienrecht. Tolino Media u. a. bieten oft Tools/Vorlagen beim Upload — ⚠ aktuelle Rechtslage mit Fachperson prüfen.',
        },
        links: [
          { label: 'Tolino Media', url: 'https://www.tolino-media.de/' },
          { label: 'BoD', url: 'https://www.bod.de/' },
          { label: 'epubli', url: 'https://www.epubli.de/' },
          { label: 'BookRix', url: 'https://www.bookrix.de/' },
          { label: 'Draft2Digital', url: 'https://www.draft2digital.com/' },
          { label: 'IngramSpark', url: 'https://www.ingramspark.com/' },
        ],
      },
      {
        heading: {
          en: 'DACH requirements vs US/global platforms',
          de: 'DACH-Anforderungen vs. US-/globale Plattformen',
        },
        bullets: {
          en: [
            'When expanding beyond Amazon to BoD, Tolino Media, epubli, and BookRix, requirements shift from typical US/global platforms',
            'These platforms operate directly out of Germany and adhere strictly to German publishing laws, tax regulations, and commercial rules',
            'Plan Impressum, Buchpreisbindung, SEPA banking, Steuernummer / Kleinunternehmer status, .epub/.pdf files, and DNB deposit copies before you upload',
          ],
          de: [
            'Beim Expandieren jenseits Amazon zu BoD, Tolino Media, epubli und BookRix verschieben sich Anforderungen gegenüber typischen US-/globalen Plattformen',
            'Diese Plattformen sitzen in DE und halten strikt deutsche Verlags-, Steuer- und Handelsregeln ein',
            'Vor Upload planen: Impressum, Buchpreisbindung, SEPA-Banking, Steuernummer / Kleinunternehmer, .epub/.pdf-Dateien und DNB-Pflichtexemplare',
          ],
        },
        note: {
          en: '⚠ Not legal or tax advice — verify Pressegesetz, Buchpreisbindung, UStG § 19, and DNB deposit rules with a Steuerberater / Rechtsanwalt for your case.',
          de: '⚠ Keine Rechts- oder Steuerberatung — Pressegesetz, Buchpreisbindung, UStG § 19 und DNB-Ablieferungspflicht mit Steuerberater/Rechtsanwalt für Ihren Fall prüfen.',
        },
      },
      {
        heading: {
          en: '1. Mandatory legal: the Impressum (Pressegesetz)',
          de: '1. Pflichtrechtlich: das Impressum (Pressegesetz)',
        },
        bullets: {
          en: [
            'Under German media law (Pressegesetz), every published book distributed or printed in Germany must include an Impressum (legal publisher page) listing a valid physical address',
            'The challenge: if you publish independently without a publisher address, you are legally required to put your personal home address inside the book',
            'BoD & Tolino Media fix: when you buy or use an ISBN provided by BoD or Tolino Media, they act as the publisher of record — their terms often allow you to list their company address in the interior, keeping your personal home address private (verify current terms)',
            'Self-provided ISBN: if you use your own independent ISBN, you must provide your own physical business address or use a recognized German Impressum-Service (proxy address service)',
          ],
          de: [
            'Nach deutschem Medienrecht (Pressegesetz) muss jedes in DE verbreitete/gedruckte Buch ein Impressum (rechtliche Verlagsseite) mit gültiger physischer Adresse enthalten',
            'Herausforderung: ohne Verlagsadresse müssen Sie rechtlich oft Ihre private Wohnadresse ins Buch setzen',
            'BoD & Tolino Media: bei ISBN von BoD/Tolino Media treten sie oft als Verleger auf — AGB erlauben häufig deren Firmenadresse im Innenteil, damit Ihre Privatadresse privat bleibt (aktuelle AGB prüfen)',
            'Eigene ISBN: dann eigene physische Geschäftsadresse oder anerkannter deutscher Impressum-Service (Proxy-Adresse)',
          ],
        },
      },
      {
        heading: {
          en: '2. Fixed book price law (Buchpreisbindung)',
          de: '2. Buchpreisbindung',
        },
        bullets: {
          en: [
            'Germany enforces a strict law called Buchpreisbindung',
            'The rule: you cannot set different retail prices for the exact same book format across different stores',
            'What it means: if your ebook is priced at €4.99 on Amazon.de, it must also be €4.99 on Tolino, Thalia, Hugendubel, and Apple Books',
            'Discounting your book on one platform while keeping it full price on another is illegal in the German market (⚠ confirm current scope for print vs ebook with a professional — rules can be nuanced)',
          ],
          de: [
            'Deutschland hat die strenge Buchpreisbindung',
            'Regel: für dasselbe Buchformat keinen unterschiedlichen Ladenpreis über Shops setzen',
            'Bedeutung: E-Book zu 4,99 € auf Amazon.de muss auch 4,99 € auf Tolino, Thalia, Hugendubel und Apple Books sein',
            'Rabatt auf einer Plattform bei Vollpreis auf einer anderen ist im DE-Markt unzulässig (⚠ aktuellen Umfang Print vs E-Book mit Fachperson prüfen — Regeln können nuanciert sein)',
          ],
        },
      },
      {
        heading: {
          en: '3. Account & admin — identity, SEPA, tax',
          de: '3. Konto & Admin — Identität, SEPA, Steuern',
        },
        bullets: {
          en: [
            'Valid passport / national ID for platform identity verification',
            'SEPA bank account (IBAN): European platforms pay via direct SEPA bank transfers in EUR',
            'German Steuernummer or USt-IdNr. as Freiberufler for own books (typically no Gewerbe — see Tax for DE publishers playbook); personal Steuer-ID alone is not enough',
            'Kleinunternehmerregelung (§ 19 UStG): if you qualify, check the box that you do not charge VAT — the platform handles end-customer tax on net payouts (verify eligibility yearly)',
            'International authors: non-German residents typically use Reverse Charge VAT by providing their country’s Tax Identification Number (TIN) or VAT ID',
          ],
          de: [
            'Gültiger Reisepass / Personalausweis zur Identitätsprüfung',
            'SEPA-Bankkonto (IBAN): europäische Plattformen zahlen per SEPA-Überweisung in EUR',
            'Deutsche Steuernummer oder USt-IdNr. als Freiberufler für eigene Bücher (typisch kein Gewerbe — siehe Playbook Steuern für DE-Publisher); persönliche Steuer-ID allein reicht nicht',
            'Kleinunternehmerregelung (§ 19 UStG): wenn qualifiziert, Häkchen „keine USt“ — Plattform handhabt Endkunden-Steuer auf Netto-Auszahlungen (jährlich prüfen)',
            'Internationale Autor:innen: Nicht-DE-Resident:innen nutzen typisch Reverse Charge mit TIN oder USt-ID des Heimatlandes',
          ],
        },
      },
      {
        heading: {
          en: '4. Technical files + deposit copies (Pflichtexemplare)',
          de: '4. Technikdateien + Pflichtexemplare',
        },
        bullets: {
          en: [
            'Ebooks: standard reflowable .epub — they do not accept Amazon’s proprietary .kfx or .mobi files',
            'Print (BoD & epubli): high-resolution print-ready .pdf interior (all fonts embedded)',
            'Print cover: high-resolution .pdf for the full wrap (Front + Spine + Back) with precise bleed measurements',
            'Deposit copies (Pflichtexemplare): by law, books published in Germany with an ISBN must be archived',
            'Copies must be submitted to the Deutsche Nationalbibliothek (DNB) and your respective regional state library',
            'When you publish via BoD or Tolino Media, they typically handle mandatory legal deposit copies and DNB cataloging on your behalf (verify current workflow)',
          ],
          de: [
            'E-Books: standardmäßiges reflowable .epub — Amazons proprietäre .kfx- oder .mobi-Dateien werden nicht akzeptiert',
            'Print (BoD & epubli): hochauflösendes druckfertiges .pdf-Innenteil (alle Schriften eingebettet)',
            'Print-Cover: hochauflösendes .pdf für den ganzen Umschlag (Vorderseite + Rücken + Rückseite) mit präzisem Bleed',
            'Pflichtexemplare: Bücher mit ISBN in DE müssen gesetzlich archiviert werden',
            'Exemplare an die Deutsche Nationalbibliothek (DNB) und die jeweilige Landesbibliothek',
            'Bei Publish über BoD oder Tolino Media übernehmen diese typisch Ablieferung und DNB-Katalogisierung (aktuellen Workflow prüfen)',
          ],
        },
        links: [
          { label: 'Deutsche Nationalbibliothek', url: 'https://www.dnb.de/' },
          { label: 'BoD', url: 'https://www.bod.de/' },
          { label: 'Tolino Media', url: 'https://www.tolino-media.de/' },
        ],
      },
      {
        heading: {
          en: 'DACH get-started checklist (legal + admin + files)',
          de: 'DACH-Start-Checkliste (Recht + Admin + Dateien)',
        },
        rows: [
          {
            label: { en: 'Legal contact', de: 'Rechtlicher Kontakt' },
            detail: {
              en: 'German Impressum page inside the book (supplied by BoD/Tolino publisher-of-record address, or your address / Impressum-Service)',
              de: 'Deutsches Impressum im Buch (BoD/Tolino als Verleger-Adresse, oder Ihre Adresse / Impressum-Service)',
            },
          },
          {
            label: { en: 'Pricing', de: 'Preis' },
            detail: {
              en: 'Universal Euro price across platforms (Buchpreisbindung) — e.g. €4.99 everywhere for the same ebook format',
              de: 'Einheitlicher Euro-Preis über Plattformen (Buchpreisbindung) — z. B. 4,99 € überall für dasselbe E-Book-Format',
            },
          },
          {
            label: { en: 'Banking', de: 'Banking' },
            detail: {
              en: 'IBAN bank account for direct SEPA Euro payouts',
              de: 'IBAN für direkte SEPA-Euro-Auszahlungen',
            },
          },
          {
            label: { en: 'Tax info', de: 'Steuerdaten' },
            detail: {
              en: 'Tax ID (Steuernummer) or VAT status / Kleinunternehmer / Reverse Charge TIN',
              de: 'Steuernummer oder USt-Status / Kleinunternehmer / Reverse-Charge-TIN',
            },
          },
          {
            label: { en: 'File types', de: 'Dateitypen' },
            detail: {
              en: '.epub for digital ebooks; .pdf for print-on-demand books (interior + wrap cover)',
              de: '.epub für digitale E-Books; .pdf für Print-on-Demand (Innenteil + Umschlag)',
            },
          },
        ],
      },
      {
        heading: {
          en: 'Beginner checklist — implement this week',
          de: 'Anfänger-Checkliste — diese Woche umsetzen',
        },
        bullets: {
          en: [
            'Decide: ebook stays OFF KDP Select (unless you knowingly choose 90-day exclusivity)',
            'Create Draft2Digital and/or Tolino Media account + prepare .epub (not .mobi/.kfx); publish wide after Amazon non-Select live',
            'Optional DE ebook aggregator: BookRix or epubli — avoid double-listing the same ebook on Amazon via two uploaders',
            'KDP Print on + Expanded Distribution OFF; open BoD and/or IngramSpark with matching print PDFs + ISBN / VLB plan',
            'Impressum: use BoD/Tolino publisher-of-record address if their ISBN, else your business address or Impressum-Service',
            'Set one EUR retail price for the same format across Amazon.de, Tolino, Thalia, Apple (Buchpreisbindung)',
            'Confirm SEPA IBAN + Steuernummer / USt-IdNr. (Fragebogen as Freiberufler — Steuer-ID alone is not enough) / Kleinunternehmer or Reverse Charge TIN',
            'Confirm BoD/Tolino will file DNB / Pflichtexemplare for your ISBN titles',
            'Pick one lead magnet + ESP; insert front/back matter CTAs before final StoryForge / AuthorForge export',
          ],
          de: [
            'Entscheiden: E-Book bleibt OHNE KDP Select (außer bewusst 90-Tage-Exklusivität)',
            'Draft2Digital- und/oder Tolino-Media-Konto + .epub (nicht .mobi/.kfx); wide nach Amazon Non-Select live',
            'Optional DE-E-Book-Aggregator: BookRix oder epubli — kein Doppel-Listing auf Amazon',
            'KDP Print an + Expanded Distribution AUS; BoD und/oder IngramSpark mit Print-PDFs + ISBN-/VLB-Plan',
            'Impressum: BoD/Tolino-Verlegeradresse bei deren ISBN, sonst Ihre Geschäftsadresse oder Impressum-Service',
            'Einen EUR-Ladenpreis für dasselbe Format auf Amazon.de, Tolino, Thalia, Apple (Buchpreisbindung)',
            'SEPA-IBAN + Steuernummer / USt-IdNr. (Fragebogen als Freiberufler — Steuer-ID allein reicht nicht) / Kleinunternehmer oder Reverse-Charge-TIN',
            'Prüfen, dass BoD/Tolino DNB / Pflichtexemplare für Ihre ISBN-Titel übernehmen',
            'Einen Lead-Magnet + ESP; Front-/Back-Matter-CTAs vor finalem StoryForge-/AuthorForge-Export',
          ],
        },
        links: [
          { label: 'Draft2Digital', url: 'https://www.draft2digital.com/' },
          { label: 'IngramSpark', url: 'https://www.ingramspark.com/' },
          { label: 'Tolino Media', url: 'https://www.tolino-media.de/' },
          { label: 'BoD', url: 'https://www.bod.de/' },
          { label: 'BookRix', url: 'https://www.bookrix.de/' },
          { label: 'Deutsche Nationalbibliothek', url: 'https://www.dnb.de/' },
          {
            label: 'KDP Select',
            url: 'https://kdp.amazon.com/en_US/help/topic/G200798990',
          },
        ],
      },
    ],
  },
  {
    id: 'kdp-start',
    defaultOpen: false,
    title: {
      en: 'KDP requirements — start in Germany',
      de: 'KDP-Anforderungen — Start in Deutschland',
    },
    summary: {
      en: 'Complete practical checklist to start Amazon KDP from Germany: account, don’t put all eggs in one basket (wide + email list), tax (critical), book assets (Select OFF / Expanded Distribution OFF / CTA pages), and picture-book technical files. Pair with Hard Topics + Jumpstart. Config tables below include ⚠ verification notes.',
      de: 'Praktische Checkliste für Amazon KDP aus Deutschland: Konto, nicht alle Eier in einen Korb (Wide + E-Mail-Liste), Steuern (kritisch), Buch-Assets (Select AUS / Expanded Distribution AUS / CTA-Seiten) und Bilderbuch-Technik. Dazu Schwierigsthemen + Jumpstart. Tabellen unten mit ⚠ Prüfen-Hinweisen.',
    },
    sections: [
      {
        heading: {
          en: '0. Official learning path (Hard Topics + Jumpstart)',
          de: '0. Offizieller Lernpfad (Schwierigsthemen + Jumpstart)',
        },
        bullets: {
          en: [
            'First: Amazon Hub → KDP learning centre → Hard Topics (print 50%/60% − cost, eBook VAT/delivery, AI disclosure, categories/reading age, Select/KU, trim/bleed, tax)',
            'Then Jumpstart before + Create: (1) account (2) manuscript (3) cover (4) title setup (5) publishing & review (6) promote & get paid',
            'Read Content Guidelines first — they apply to title, cover, description, and interior (including AI-generated images/text/translations)',
            'Verify every price with the official Printing Cost & Royalty Calculator — never hardcode blog “60%” maths',
          ],
          de: [
            'Zuerst: Amazon Hub → KDP-Lernzentrum → Schwierigsthemen (Print 50%/60% − Kosten, E-Book MwSt./Delivery, KI-Disclosure, Kategorien/Lesealter, Select/KU, Trim/Bleed, Steuern)',
            'Dann Jumpstart vor + Create: (1) Konto (2) Manuskript (3) Cover (4) Titel-Setup (5) Publish & Review (6) Promotion & Auszahlung',
            'Zuerst Content Guidelines — gelten für Titel, Cover, Beschreibung und Innenteil (inkl. KI-generierte Bilder/Text/Übersetzungen)',
            'Jeden Preis mit dem offiziellen Printing Cost & Royalty Calculator prüfen — keine Blog-„60 %-Mathe“ fest verdrahten',
          ],
        },
        links: [
          {
            label: 'KDP home',
            url: 'https://kdp.amazon.com/',
          },
          {
            label: 'KDP Jumpstart',
            url: 'https://kdp.amazon.com/en_US/help/topic/G202187740',
          },
          {
            label: 'Content Guidelines',
            url: 'https://kdp.amazon.com/en_US/help/topic/G200672390',
          },
          {
            label: 'Print & royalty calculator',
            url: 'https://kdp.amazon.com/en_US/help/topic/GSQF43YAMUPFTMSP',
          },
          {
            label: 'Paperback Royalty',
            url: 'https://kdp.amazon.com/en_US/help/topic/G201834330',
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
            'Do not put all eggs in one basket from day one: keep ebooks OFF KDP Select unless you knowingly want 90-day exclusivity; uncheck Expanded Distribution on print and use IngramSpark + Draft2Digital + an email list (open Publish wide + email list playbook)',
          ],
          de: [
            'Amazon-Konto — bestehendes Amazon.de-Login funktioniert unter kdp.amazon.com',
            'Vollständiger Rechtsname (Person oder Verlag / Imprint)',
            'Deutsche Adresse + Telefon zur Identitätsprüfung',
            'Steuerinterview abgeschlossen (siehe Abschnitt 2 / Steuer-Playbook)',
            'Deutsche IBAN für Royalty-Zahlungen in EUR',
            'Nicht alle Eier in einen Korb ab Tag eins: E-Books OHNE KDP Select (außer Sie wollen bewusst 90-Tage-Exklusivität); Expanded Distribution bei Print abwählen und IngramSpark + Draft2Digital + E-Mail-Liste nutzen (Playbook „Wide publizieren + E-Mail-Liste“ öffnen)',
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
      {
        heading: {
          en: '5. Five hidden operational pitfalls (before you publish)',
          de: '5. Fünf versteckte Betriebsfallen (vor dem Publish)',
        },
        bullets: {
          en: [
            'After wide distribution, email list, and DE tax (Steuernummer vs Gewerbe), still master these non-obvious KDP realities',
            'AI-assisted vs AI-generated disclosure, title/subtitle stuffing bans, forbidden backend keywords, free vs owned ISBN, bleed + 0.375″ margins',
            'Full detail in the Hidden pitfalls playbook + KDP config panel below',
          ],
          de: [
            'Nach Wide, E-Mail-Liste und DE-Steuer (Steuernummer vs Gewerbe) bleiben diese nicht offensichtlichen KDP-Realitäten',
            'KI-assisted vs KI-generiert, Titel-/Untertitel-Stuffing-Verbote, verbotene Backend-Keywords, Free vs eigene ISBN, Bleed + 0,375″-Ränder',
            'Volle Details im Playbook Versteckte Fallen + KDP-Config-Panel unten',
          ],
        },
      },
    ],
  },
  {
    id: 'kdp-hidden-pitfalls',
    title: {
      en: 'Five hidden KDP pitfalls (before you publish)',
      de: 'Fünf versteckte KDP-Fallen (vor dem Publish)',
    },
    summary: {
      en: 'Beyond wide distribution, email lists, and DE tax (Steuernummer vs Gewerbe): AI-assisted vs AI-generated disclosure, title/subtitle stuffing bans, forbidden backend keywords, free vs owned ISBN, and bleed / 0.375″ margins. ⚠ Not Amazon Help; rules change — verify in KDP.',
      de: 'Jenseits von Wide, E-Mail-Liste und DE-Steuer (Steuernummer vs Gewerbe): KI-assisted vs KI-generiert, Titel-/Untertitel-Stuffing-Verbote, verbotene Backend-Keywords, Free vs eigene ISBN, Bleed / 0,375″-Ränder. ⚠ Kein Amazon-Help; Regeln ändern sich — in KDP prüfen.',
    },
    sections: [
      {
        heading: {
          en: 'Why these five matter',
          de: 'Warum diese fünf zählen',
        },
        bullets: {
          en: [
            'You may already know publishing wide, building an email list, and German tax (Steuernummer vs Gewerbe)',
            'These five critical, non-obvious operational realities still get beginners suspended, rejected, or stuck with the wrong ISBN imprint',
          ],
          de: [
            'Wide publizieren, E-Mail-Liste und DE-Steuer (Steuernummer vs Gewerbe) kennen Sie vielleicht schon',
            'Diese fünf kritischen, nicht offensichtlichen Betriebsrealitäten führen trotzdem zu Sperren, Ablehnungen oder falschem ISBN-Imprint',
          ],
        },
        note: {
          en: '⚠ Guide only — not legal advice. Confirm AI disclosure, metadata, ISBN, and print specs in current KDP Help.',
          de: '⚠ Nur Orientierung — keine Rechtsberatung. KI-Disclosure, Metadaten, ISBN und Print-Specs im aktuellen KDP-Help prüfen.',
        },
      },
      {
        heading: {
          en: '1. AI-Generated vs AI-Assisted (KDP disclosure)',
          de: '1. KI-generiert vs KI-unterstützt (KDP-Disclosure)',
        },
        bullets: {
          en: [
            'AI-Assisted (no disclosure needed): you wrote the manuscript or drew the artwork yourself and used AI only for brainstorming, editing, proofreading, formatting, or outlines',
            'AI-Generated (mandatory private disclosure): if an AI tool generated the actual text, cover images, interior illustrations, or translations — even if you heavily edited them afterward — you MUST check the AI-Generated declaration box in the KDP backend',
            'Crucial: this disclosure is kept internally by Amazon and is never shown to buyers on the product page',
            'Failing to declare AI-generated content can lead to account suspension or termination',
          ],
          de: [
            'KI-unterstützt (keine Disclosure nötig): Sie haben Manuskript oder Kunst selbst gemacht; KI nur für Brainstorming, Editieren, Korrekturlesen, Formatieren oder Outlines',
            'KI-generiert (Pflicht-Disclosure intern): wenn ein KI-Tool den eigentlichen Text, Cover-Bilder, Innenteil-Illustrationen oder Übersetzungen erzeugt hat — auch bei starker Nachbearbeitung — MÜSSEN Sie die KI-generiert-Checkbox im KDP-Backend setzen',
            'Wichtig: diese Disclosure bleibt intern bei Amazon und wird Käufer:innen auf der Produktseite nie angezeigt',
            'Unterlassene Angabe von KI-Inhalten kann zu Kontosperrung oder Kündigung führen',
          ],
        },
        links: [
          {
            label: 'Content Guidelines (incl. AI)',
            url: 'https://kdp.amazon.com/en_US/help/topic/G200672390',
          },
        ],
      },
      {
        heading: {
          en: '2. Title / subtitle keyword stuffing → automated bans',
          de: '2. Titel-/Untertitel-Keyword-Stuffing → automatische Sperren',
        },
        bullets: {
          en: [
            'One of the most common reasons beginners get accounts terminated without warning is manipulating titles and subtitles',
            'Rule: your book title and subtitle must match the exact text printed on your physical cover',
            'What gets accounts blocked: promotional phrases or keyword-stuffed lists in the subtitle (e.g. “Children’s Book: Fun Animal Stories for Kids Ages 3-5 Best Seller Gift Idea”)',
            'Safe practice: keep subtitles purely descriptive or stylistic (e.g. “A Bilingual German-Twi Story for Young Readers”)',
            'Put all descriptive marketing search terms into KDP’s designated 7 backend keyword slots — not the title/subtitle fields',
          ],
          de: [
            'Eine der häufigsten Gründe für unerwartete Kontosperren bei Einsteiger:innen: manipulierte Titel und Untertitel',
            'Regel: Titel und Untertitel müssen exakt dem Text auf dem physischen Cover entsprechen',
            'Sperren auslösen: Werbephrasen oder Keyword-Stuffing im Untertitel (z. B. „Kinderbuch: Lustige Tiergeschichten für Kinder 3–5 Best Seller Geschenkidee“)',
            'Sicher: Untertitel rein beschreibend oder stilistisch (z. B. „Eine bilinguale Deutsch-Twi-Geschichte für junge Leser:innen“)',
            'Alle Marketing-Suchbegriffe in die 7 Backend-Keyword-Slots — nicht in Titel/Untertitel',
          ],
        },
        links: [
          {
            label: 'Book info rules (official)',
            url: 'https://kdp.amazon.com/en_US/help/topic/G201097560',
          },
        ],
      },
      {
        heading: {
          en: '3. Forbidden backend keyword types',
          de: '3. Verbotene Backend-Keyword-Typen',
        },
        bullets: {
          en: [
            'Inside KDP’s 7 backend keyword boxes, Amazon forbids certain term types — they trigger automated “misleading content” flags',
            'Competitor / brand names: never “Disney”, “Peppa Pig”, or popular author names',
            'Promotional / sales words: “Best Seller”, “Free”, “On Sale”, “Discount”',
            'Quality claims: “High Quality”, “Top Rated”, “Award-Winning”',
            'Format duplication: “Paperback”, “Book”, or “Print” (Amazon already knows the format)',
          ],
          de: [
            'In den 7 Backend-Keyword-Feldern verbietet Amazon bestimmte Begriffstypen — automatische Flags für „irreführenden Inhalt“',
            'Konkurrenz / Marken: nie „Disney“, „Peppa Pig“ oder bekannte Autorennamen',
            'Werbe-/Verkaufswörter: „Best Seller“, „Free“, „On Sale“, „Discount“',
            'Qualitätsclaims: „High Quality“, „Top Rated“, „Award-Winning“',
            'Format-Duplikate: „Paperback“, „Book“ oder „Print“ (Amazon kennt das Format schon)',
          ],
        },
      },
      {
        heading: {
          en: '4. Free vs owned ISBNs',
          de: '4. Kostenlose vs. eigene ISBNs',
        },
        bullets: {
          en: [
            'An ISBN is the global barcode used to track books',
            'Free KDP / platform ISBN: KDP, IngramSpark, and Tolino Media can assign a free ISBN',
            'Catch: a free ISBN locks that format to that platform; publisher of record reads “Independently Published” or “Tolino Media” — you cannot reuse that free ISBN on other platforms',
            'Owned ISBNs: buy via MVB / GeBü / ISBN-Agentur in Germany — you are listed as the official publisher of record worldwide',
            'Best practice: start with free platform ISBNs (zero overhead); buy a batch of owned ISBNs when you establish a formal imprint or publish widely under your own company name',
          ],
          de: [
            'Eine ISBN ist der globale Barcode zur Buchverfolgung',
            'Kostenlose KDP-/Plattform-ISBN: KDP, IngramSpark und Tolino Media können eine Free-ISBN vergeben',
            'Haken: Free-ISBN bindet dieses Format an die Plattform; Verleger lautet „Independently Published“ oder „Tolino Media“ — dieselbe Free-ISBN nicht auf anderen Plattformen nutzbar',
            'Eigene ISBNs: über MVB / GeBü / ISBN-Agentur in DE kaufen — Sie stehen weltweit als Verleger',
            'Best Practice: Start mit Free-Plattform-ISBNs (null Overhead); eigene ISBN-Pakete kaufen, wenn Sie ein formales Imprint aufbauen oder wide unter eigenem Firmennamen publizieren',
          ],
        },
        links: [
          {
            label: 'KDP ISBN & imprint',
            url: 'https://kdp.amazon.com/en_US/help/topic/G201354010',
          },
          { label: 'MVB / VLB', url: 'https://www.mvb-online.de/' },
        ],
      },
      {
        heading: {
          en: '5. Quality guidelines — bleed & margin safety',
          de: '5. Qualitätsrichtlinien — Bleed & Sicherheitsrand',
        },
        bullets: {
          en: [
            'Formatting errors cause a high percentage of print file rejections during book setup',
            'No Bleed: for standard text/reading books where images do not touch the outer edge of the physical page',
            'Bleed: mandatory for children’s picture books, coloring books, or illustrated titles where background colors or illustrations extend to the edge of the page',
            'Margin safety zone: any text or critical illustration detail must stay at least 0.375 in (approx. 9.5 mm) from the page edge (and deeper toward the spine/gutter), or Amazon’s automated printer will reject the PDF',
          ],
          de: [
            'Formatierungsfehler verursachen einen hohen Anteil der Print-Datei-Ablehnungen beim Setup',
            'Kein Bleed: für normale Text-/Lesebücher, bei denen Bilder den äußeren Seitenrand nicht berühren',
            'Bleed: Pflicht für Kinderbilderbücher, Malbücher oder illustrierte Titel, bei denen Hintergründe/Illustrationen bis zum Rand reichen',
            'Sicherheitsrand: Text oder kritische Illustrationsdetails mindestens 0,375 in (ca. 9,5 mm) vom Seitenrand entfernt halten (zum Bund/Gutter noch tiefer) — sonst lehnt Amazons automatischer Drucker das PDF ab',
          ],
        },
        links: [
          {
            label: 'Trim, bleed, margins (official)',
            url: 'https://kdp.amazon.com/en_US/help/topic/G201834230',
          },
        ],
      },
      {
        heading: {
          en: 'Hidden pitfalls checklist',
          de: 'Checkliste versteckte Fallen',
        },
        rows: [
          {
            label: { en: 'AI content', de: 'KI-Inhalt' },
            detail: {
              en: 'Declare AI-generated text/images in KDP; stays hidden from buyers but protects your account',
              de: 'KI-generierten Text/Bilder in KDP angeben; bleibt vor Käufer:innen verborgen, schützt aber Ihr Konto',
            },
          },
          {
            label: { en: 'Book titles', de: 'Buchtitel' },
            detail: {
              en: 'Match cover text exactly; no promotional keywords in the subtitle field',
              de: 'Cover-Text exakt matchen; keine Werbe-Keywords im Untertitel',
            },
          },
          {
            label: { en: 'Backend keywords', de: 'Backend-Keywords' },
            detail: {
              en: 'Avoid brand names, format descriptors, and promotional words (“Bestseller”)',
              de: 'Keine Markennamen, Formatbegriffe und Werbewörter („Bestseller“)',
            },
          },
          {
            label: { en: 'ISBN ownership', de: 'ISBN-Eigentum' },
            detail: {
              en: 'Free ISBNs assign the platform as publisher; owned ISBNs assign your name/imprint',
              de: 'Free-ISBNs setzen die Plattform als Verleger; eigene ISBNs Ihren Namen/Ihr Imprint',
            },
          },
          {
            label: { en: 'File specs', de: 'Dateispezifikationen' },
            detail: {
              en: 'Set Bleed correctly for illustrated books + keep 0.375″ / ~9.5 mm safety from edges',
              de: 'Bleed für illustrierte Bücher korrekt setzen + 0,375″ / ca. 9,5 mm Sicherheitsabstand zum Rand',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'kdp-account-termination',
    title: {
      en: 'KDP account termination — appeal, go wide, protect yourself',
      de: 'KDP-Kontosperrung — Einspruch, Wide-Publish, Absicherung',
    },
    summary: {
      en: 'When Amazon blocks or terminates a KDP account, it can feel catastrophic — especially when an author loses an entire catalog of 150 books at once. Whether you are helping that person or taking lessons as a beginner: exact step-by-step appeal (Plan of Action), what to do with the books if reinstatement fails (go wide), and how to protect yourself so this never happens. Includes a copy-ready POA template and Draft2Digital / IngramSpark setup steps. ⚠ Guide only — not legal advice; Amazon decisions are final on their side.',
      de: 'Wenn Amazon ein KDP-Konto sperrt oder kündigt, fühlt sich das katastrophal an — besonders wenn ein:e Autor:in einen ganzen Katalog von 150 Büchern auf einmal verliert. Ob Sie dieser Person helfen oder als Einsteiger:in lernen: exakter Einspruchs-Plan (Plan of Action), was mit den Büchern passiert wenn die Reaktivierung scheitert (Wide), und Absicherung damit es nie passiert. Inkl. kopierfertiger POA-Vorlage und Draft2Digital-/IngramSpark-Setup. ⚠ Nur Orientierung — keine Rechtsberatung; Amazons Entscheidungen sind auf ihrer Seite final.',
    },
    sections: [
      {
        heading: {
          en: 'Who this is for + critical first rule',
          de: 'Für wen + kritische erste Regel',
        },
        bullets: {
          en: [
            'Use this if you are helping someone whose KDP account was terminated — or if you are a beginner taking lessons so it never happens to you',
            'Once Amazon terminates an account: do not panic and do not try to create a new account',
            'Amazon’s systems will flag and terminate any newly opened account tied to the same identity, payment details, or IP address — often making the situation permanent',
            'Reply through the official termination notice with a structured, professional Plan of Action (POA) — not an emotional email',
          ],
          de: [
            'Nutzen Sie dies, wenn Sie jemandem helfen, dessen KDP-Konto gekündigt wurde — oder als Einsteiger:in, um zu lernen, damit es Ihnen nie passiert',
            'Sobald Amazon ein Konto kündigt: nicht panikartig handeln und kein neues Konto eröffnen',
            'Amazons Systeme kennzeichnen und sperren jedes neu eröffnete Konto mit derselben Identität, denselben Zahlungsdaten oder derselben IP — oft wird die Lage dadurch endgültig',
            'Über den offiziellen Kündigungshinweis mit einem strukturierten, professionellen Plan of Action (POA) antworten — keine emotionale E-Mail',
          ],
        },
        note: {
          en: '⚠ Not Amazon Help verbatim and not legal advice. Content Guidelines, account policies, and appeal channels change — verify on KDP Help and with a qualified IP / publishing attorney if stakes are high.',
          de: '⚠ Kein Amazon-Help-Wortlaut und keine Rechtsberatung. Content Guidelines, Kontorichtlinien und Einspruchskanäle ändern sich — im KDP-Help prüfen und bei hohem Einsatz IP-/Verlagsanwalt:in hinzuziehen.',
        },
        links: [
          { label: 'KDP home', url: 'https://kdp.amazon.com/' },
          {
            label: 'Content Guidelines',
            url: 'https://kdp.amazon.com/en_US/help/topic/G200672390',
          },
          {
            label: 'KDP Help',
            url: 'https://kdp.amazon.com/help',
          },
        ],
      },
      {
        heading: {
          en: 'Part 1 — Step 1: Analyze the specific termination notice',
          de: 'Teil 1 — Schritt 1: Spezifischen Kündigungshinweis analysieren',
        },
        bullets: {
          en: [
            'Read the termination email carefully to identify the core cause Amazon cites',
            'Intellectual Property (IP) issues: using trademarked keywords, copyrighted images, or public-domain text without adding unique value',
            'Low-content or “spam” publishing: publishing hundreds of AI-generated books, duplicate interiors, or misleading titles/subtitles aimed at manipulating search results',
            'Multiple accounts: operating more than one KDP account without explicit permission',
            'Customer review manipulation: swapping or incentivizing reviews',
          ],
          de: [
            'Kündigungs-E-Mail genau lesen und die von Amazon genannte Kernursache identifizieren',
            'Geistiges Eigentum (IP): markenrechtlich geschützte Keywords, urheberrechtlich geschützte Bilder oder Public-Domain-Text ohne eigenen Mehrwert',
            'Low-Content- oder „Spam“-Publishing: hunderte KI-generierte Bücher, doppelte Innenteile oder irreführende Titel/Untertitel zur Suchmanipulation',
            'Mehrere Konten: mehr als ein KDP-Konto ohne ausdrückliche Erlaubnis betreiben',
            'Review-Manipulation: Reviews tauschen oder anreizen',
          ],
        },
      },
      {
        heading: {
          en: 'Part 1 — Step 2: Write a Plan of Action (POA) appeal',
          de: 'Teil 1 — Schritt 2: Plan of Action (POA) schreiben',
        },
        bullets: {
          en: [
            'Instead of an emotional email, reply directly to the termination notice with a structured, professional POA',
            'Root cause analysis: admit the exact policy oversight without making excuses or blaming Amazon',
            'Immediate corrective actions: explain what you have already done to fix it (e.g. removing unauthorized images, pulling conflicting metadata, securing proper copyright documentation)',
            'Preventative steps: outline how your publishing workflow has changed so the mistake will never happen again',
            'Documentation: attach original copyright licenses, rights transfer agreements, or source files proving you own the content',
          ],
          de: [
            'Statt einer emotionalen E-Mail direkt auf den Kündigungshinweis mit einem strukturierten, professionellen POA antworten',
            'Ursachenanalyse: den genauen Richtlinienverstoß eingestehen — ohne Ausreden und ohne Amazon die Schuld zu geben',
            'Sofortmaßnahmen: erklären, was Sie bereits behoben haben (z. B. unautorisierte Bilder entfernt, widersprüchliche Metadaten zurückgezogen, Copyright-Nachweise gesichert)',
            'Prävention: darlegen, wie sich Ihr Publishing-Workflow geändert hat, damit der Fehler nie wieder vorkommt',
            'Dokumentation: Original-Copyright-Lizenzen, Rechteübertragungen oder Quelldateien anhängen, die Besitz belegen',
          ],
        },
      },
      {
        heading: {
          en: 'Part 1 — POA template (copy, fill, send)',
          de: 'Teil 1 — POA-Vorlage (kopieren, ausfüllen, senden)',
        },
        bullets: {
          en: [
            'Subject: Appeal / Plan of Action — KDP account [your KDP account email] — [ASIN or title list if cited]',
            'Opening: Thank you for reviewing this Plan of Action. I take full responsibility for the policy issue identified in your notice dated [date].',
            '1) Root cause: On [date/period], I [exact action]. This violated [policy name / Content Guidelines area Amazon cited] because [plain-language reason]. I am not disputing Amazon’s finding; I am correcting it.',
            '2) Immediate corrective actions already taken: (a) [removed / unpublished titles or assets]; (b) [metadata / keyword / cover fixes]; (c) [licenses or rights docs gathered]; (d) [any other fix].',
            '3) Preventative steps going forward: (a) [pre-publish IP + trademark checklist]; (b) [quality/volume limit — e.g. no mass low-content uploads]; (c) [single-account + review policy compliance]; (d) [who reviews each title before publish].',
            '4) Documentation attached: [license PDFs], [rights transfers], [source files / invoices], [list of ASINs corrected].',
            'Closing: I respectfully request reinstatement. I will comply fully with current KDP Terms and Content Guidelines. Sincerely, [legal name], [phone], [address].',
          ],
          de: [
            'Betreff: Einspruch / Plan of Action — KDP-Konto [Ihre KDP-E-Mail] — [ASIN oder Titelliste falls genannt]',
            'Einstieg: Danke für die Prüfung dieses Plan of Action. Ich übernehme volle Verantwortung für den in Ihrer Mitteilung vom [Datum] genannten Richtlinienverstoß.',
            '1) Ursache: Am / Im [Datum/Zeitraum] habe ich [genaue Handlung]. Das verstieß gegen [Richtlinienname / Content-Guidelines-Bereich] weil [klare Begründung]. Ich bestreite Amazons Feststellung nicht; ich korrigiere sie.',
            '2) Bereits ergriffene Sofortmaßnahmen: (a) [Titel/Assets entfernt oder unveröffentlicht]; (b) [Metadaten-/Keyword-/Cover-Korrekturen]; (c) [Lizenzen/Rechte-Docs gesammelt]; (d) [weitere Fixes].',
            '3) Prävention ab sofort: (a) [IP- + Marken-Checkliste vor Publish]; (b) [Qualitäts-/Mengenlimit — z. B. kein Massen-Low-Content]; (c) [Ein-Konto- + Review-Richtlinientreue]; (d) [wer jeden Titel vor Publish prüft].',
            '4) Anhang: [Lizenz-PDFs], [Rechteübertragungen], [Quelldateien/Rechnungen], [Liste korrigierter ASINs].',
            'Schluss: Ich bitte höflich um Reaktivierung. Ich halte die aktuellen KDP-AGB und Content Guidelines vollständig ein. Mit freundlichen Grüßen, [Rechtsname], [Telefon], [Adresse].',
          ],
        },
        rows: [
          {
            label: { en: 'POA block 1', de: 'POA-Block 1' },
            detail: {
              en: 'Root cause — what policy was missed and why (facts only)',
              de: 'Ursache — welche Richtlinie verfehlt wurde und warum (nur Fakten)',
            },
          },
          {
            label: { en: 'POA block 2', de: 'POA-Block 2' },
            detail: {
              en: 'Corrective actions already taken on titles, files, and metadata',
              de: 'Bereits ergriffene Korrekturen an Titeln, Dateien und Metadaten',
            },
          },
          {
            label: { en: 'POA block 3', de: 'POA-Block 3' },
            detail: {
              en: 'New workflow controls so it cannot happen again',
              de: 'Neue Workflow-Kontrollen, damit es nicht wieder passiert',
            },
          },
          {
            label: { en: 'POA block 4', de: 'POA-Block 4' },
            detail: {
              en: 'Evidence pack — licenses, rights docs, source files',
              de: 'Beweispaket — Lizenzen, Rechtsdokumente, Quelldateien',
            },
          },
        ],
        note: {
          en: '⚠ Fill every bracket with your real facts. Never invent licenses or blame Amazon. Keep one consistent story across all replies.',
          de: '⚠ Jede Klammer mit echten Fakten füllen. Keine Lizenzen erfinden und Amazon nicht beschuldigen. Eine konsistente Story über alle Antworten hinweg.',
        },
      },
      {
        heading: {
          en: 'Part 1 — Step 3: Escalate if standard appeals fail',
          de: 'Teil 1 — Schritt 3: Eskalation wenn Standard-Einsprüche scheitern',
        },
        bullets: {
          en: [
            'If standard email appeals receive automated rejections: send a formal, polite appeal email to Amazon’s executive customer support (historically often cited: jeff@amazon.com) outlining the case and attaching/referencing your POA — outcomes vary; never spam',
            'Hire an intellectual property attorney specializing in Amazon reinstatements to draft a formal legal appeal or initiate mediation/arbitration as allowed by KDP’s Terms of Service',
            'Keep every reply factual, short, and consistent with prior POA statements',
          ],
          de: [
            'Wenn Standard-E-Mail-Einsprüche nur automatische Ablehnungen bringen: formelle, höfliche Eskalation an Amazons Executive Customer Support (historisch oft genannt: jeff@amazon.com) mit Fallkurzfassung und POA — Ergebnisse variieren; kein Spam',
            'IP-Anwalt:in mit Fokus Amazon-Reaktivierung beauftragen — formellen rechtlichen Einspruch oder Mediation/Schiedsverfahren gemäß KDP-AGB',
            'Jede Antwort faktisch, kurz und konsistent zu früheren POA-Aussagen halten',
          ],
        },
        note: {
          en: '⚠ Escalation emails and attorney paths are not guaranteed reinstatement. Do not invent facts or open shadow accounts while an appeal is open.',
          de: '⚠ Eskalations-Mails und Anwaltspfade garantieren keine Reaktivierung. Keine Fakten erfinden und keine Schattenkonten eröffnen, solange ein Einspruch läuft.',
        },
      },
      {
        heading: {
          en: 'Part 2 — What to do with the 150 books (going wide)',
          de: 'Teil 2 — Was mit den 150 Büchern tun (Wide gehen)',
        },
        bullets: {
          en: [
            'If Amazon refuses to reinstate the account, the author still owns the copyright to their original books — unless the works were written specifically under an exclusive contract (e.g. KDP Select / Kindle Unlimited exclusivity for enrolled titles)',
            'Verify current Select / KU exclusivity status before republishing the same ebook elsewhere',
            'IngramSpark: the largest global print distributor — gets physical paperbacks into independent bookstores, libraries, Barnes & Noble online, and international retailers',
            'Draft2Digital (D2D): an aggregator that distributes ebooks to Apple Books, Kobo, Barnes & Noble, Google Play, and digital public library systems',
            'DACH (Germany/Austria/Switzerland): Tolino Media (Thalia/Hugendubel/Weltbild/Tolino + libraries), BoD (ISBN + VLB for any local bookstore), epubli, BookRix — keep Select OFF; add Impressum for DE editions',
            'Payhip / Shopify / direct selling: sell ebooks and print-on-demand books directly to readers via a personal website — often cited as up to ~95% royalties after platform fees (⚠ fees change; verify current plans) without third-party marketplace account risk',
            'Kobo Writing Life & Apple Books: publish directly on major non-Amazon digital readers',
          ],
          de: [
            'Wenn Amazon die Reaktivierung verweigert, gehört das Urheberrecht an den Originalwerken weiterhin der Autorin / dem Autor — außer die Werke entstanden unter einem Exklusivvertrag (z. B. KDP Select / Kindle Unlimited für eingeschriebene Titel)',
            'Aktuellen Select-/KU-Exklusivitätsstatus prüfen, bevor dasselbe E-Book woanders erscheint',
            'IngramSpark: größter globaler Print-Distributor — bringt physische Paperbacks in unabhängige Buchhandlungen, Bibliotheken, Barnes & Noble online und internationale Händler',
            'Draft2Digital (D2D): Aggregator, der E-Books an Apple Books, Kobo, Barnes & Noble, Google Play und digitale Bibliothekssysteme liefert',
            'DACH (DE/AT/CH): Tolino Media (Thalia/Hugendubel/Weltbild/Tolino + Bibliotheken), BoD (ISBN + VLB für jede lokale Buchhandlung), epubli, BookRix — Select AUS; Impressum für DE-Ausgaben',
            'Payhip / Shopify / Direktverkauf: E-Books und Print-on-Demand über die eigene Website — oft mit bis zu ca. 95 % Royalty nach Plattformgebühren genannt (⚠ Gebühren ändern sich; aktuelle Tarife prüfen), ohne Marketplace-Kontorisiko',
            'Kobo Writing Life & Apple Books: direkt auf großen Nicht-Amazon-E-Readern publizieren',
          ],
        },
        links: [
          { label: 'IngramSpark', url: 'https://www.ingramspark.com/' },
          { label: 'Draft2Digital', url: 'https://www.draft2digital.com/' },
          { label: 'Tolino Media', url: 'https://www.tolino-media.de/' },
          { label: 'BoD', url: 'https://www.bod.de/' },
          { label: 'BookRix', url: 'https://www.bookrix.de/' },
          { label: 'Payhip', url: 'https://payhip.com/' },
          { label: 'Shopify', url: 'https://www.shopify.com/' },
          { label: 'Kobo Writing Life', url: 'https://www.kobo.com/writinglife' },
          { label: 'Apple Books for Authors', url: 'https://authors.apple.com/' },
        ],
        note: {
          en: '⚠ Pair with Publish wide + email list (DACH section) and First-time publisher truths. Third-party fees, file specs, and exclusivity rules change — read current terms before upload.',
          de: '⚠ Mit „Wide + E-Mail-Liste“ (DACH-Abschnitt) und Wahrheiten für Erstautor:innen kombinieren. Gebühren, Dateispecs und Exklusivität ändern sich — aktuelle AGB vor Upload lesen.',
        },
      },
      {
        heading: {
          en: 'Part 2b — Setup: Draft2Digital (ebooks wide)',
          de: 'Teil 2b — Setup: Draft2Digital (E-Books wide)',
        },
        bullets: {
          en: [
            '1) Create a Draft2Digital account at draft2digital.com and complete tax / payment details (W-8BEN or local forms as prompted)',
            '2) Confirm each title is free of KDP Select / KU exclusivity (or wait until the exclusive period ends)',
            '3) Prepare files: EPUB (preferred) or DOC/DOCX that D2D can convert; cover JPG/PNG at their current size minimums',
            '4) Add a new book: title, subtitle, series, description, contributors, language, categories, price per store',
            '5) Choose distribution outlets (Apple Books, Kobo, B&N, Google Play, libraries, etc.) — leave Amazon off if you still hope to return to KDP later, or follow D2D’s current Amazon options carefully',
            '6) Upload interior + cover → review automated conversion → publish when the proof looks correct',
            '7) After live: note store links, keep your own ISBN/metadata sheet, and never upload a Select-exclusive file elsewhere',
          ],
          de: [
            '1) Draft2Digital-Konto unter draft2digital.com anlegen und Steuer-/Zahlungsdaten ausfüllen (W-8BEN oder lokale Formulare wie angezeigt)',
            '2) Pro Titel prüfen: frei von KDP-Select-/KU-Exklusivität (oder Exklusivperiode abwarten)',
            '3) Dateien vorbereiten: EPUB (bevorzugt) oder DOC/DOCX zur Konvertierung; Cover JPG/PNG nach aktuellen Mindestgrößen',
            '4) Neues Buch anlegen: Titel, Untertitel, Serie, Beschreibung, Mitwirkende, Sprache, Kategorien, Preis je Store',
            '5) Vertriebskanäle wählen (Apple Books, Kobo, B&N, Google Play, Bibliotheken usw.) — Amazon auslassen, wenn Sie später zu KDP zurückwollen, oder D2Ds aktuelle Amazon-Optionen genau prüfen',
            '6) Innenteil + Cover hochladen → automatische Konvertierung prüfen → veröffentlichen wenn der Proof stimmt',
            '7) Nach Live: Store-Links notieren, eigene ISBN-/Metadaten-Tabelle führen, nie eine Select-exklusive Datei woanders hochladen',
          ],
        },
        links: [{ label: 'Draft2Digital', url: 'https://www.draft2digital.com/' }],
        note: {
          en: '⚠ UI labels and store list change — follow Draft2Digital’s live help for the exact clicks.',
          de: '⚠ UI-Labels und Store-Liste ändern sich — aktuelle Draft2Digital-Hilfe für die genauen Klicks nutzen.',
        },
      },
      {
        heading: {
          en: 'Part 2c — Setup: IngramSpark (print wide)',
          de: 'Teil 2c — Setup: IngramSpark (Print wide)',
        },
        bullets: {
          en: [
            '1) Create an IngramSpark account and complete publisher / tax / banking setup',
            '2) Decide ISBN strategy: use your own ISBN (often required for bookstore-friendly distribution) vs any free options Ingram currently offers — verify before you pay',
            '3) Match trim size, page count, paper, and color to your print-ready PDF (bleed + margins per their current template)',
            '4) Upload interior PDF + cover PDF (or use their cover template) → run their automated preflight and fix errors',
            '5) Set wholesale discount, returnability, and territories carefully — bookstore terms differ from Amazon KDP Expanded Distribution',
            '6) Enable distribution to desired channels (independent bookstores, libraries, B&N online, international) after titles pass review',
            '7) Order a physical proof before large marketing spends; keep local backups of every print master',
          ],
          de: [
            '1) IngramSpark-Konto anlegen und Verlag-/Steuer-/Bankdaten abschließen',
            '2) ISBN-Strategie: eigene ISBN (oft nötig für buchhandelsfreundliche Distribution) vs. aktuelle Free-Optionen von Ingram — vor Zahlung prüfen',
            '3) Trim, Seitenzahl, Papier und Farbe an Ihr druckfertiges PDF anpassen (Bleed + Ränder laut aktuellem Template)',
            '4) Innenteil-PDF + Cover-PDF hochladen (oder deren Cover-Template) → automatischen Preflight laufen lassen und Fehler beheben',
            '5) Großhandelsrabatt, Remissionsfähigkeit und Territorien sorgfältig setzen — Buchhandelskonditionen unterscheiden sich von KDP Expanded Distribution',
            '6) Distribution zu gewünschten Kanälen freischalten (unabhängige Buchhandlungen, Bibliotheken, B&N online, international) nachdem Titel die Prüfung bestehen',
            '7) Physischen Proof bestellen bevor große Marketing-Budgets fließen; lokale Backups jedes Print-Masters behalten',
          ],
        },
        links: [{ label: 'IngramSpark', url: 'https://www.ingramspark.com/' }],
        note: {
          en: '⚠ Setup fees, ISBN rules, and wholesale defaults change — confirm on IngramSpark before you publish.',
          de: '⚠ Setup-Gebühren, ISBN-Regeln und Wholesale-Defaults ändern sich — vor Publish auf IngramSpark bestätigen.',
        },
      },
      {
        heading: {
          en: 'Part 3.1 — Quality over mass quantity',
          de: 'Teil 3.1 — Qualität vor Masse',
        },
        bullets: {
          en: [
            'Accounts with 150+ thin, low-quality, or rapidly generated books are frequently flagged by Amazon’s automated algorithms for spam',
            'Focus on publishing a few high-quality, fully original books rather than pumping out hundreds of generic titles',
            'In this hub: prefer the StoryForge / AuthorForge niche ladder (one strong series + companion) over mass low-content catalogs',
          ],
          de: [
            'Konten mit 150+ dünnen, minderwertigen oder hastig generierten Büchern werden häufig von Amazons automatischen Algorithmen als Spam geflaggt',
            'Lieber wenige hochwertige, voll originale Bücher publizieren statt hunderte generischer Titel auszustoßen',
            'In diesem Hub: StoryForge-/AuthorForge-Nischenleiter (eine starke Serie + Begleiter) statt Massen-Low-Content-Kataloge',
          ],
        },
      },
      {
        heading: {
          en: 'Part 3.2 — Never depend 100% on Amazon (“Don’t build on rented land”)',
          de: 'Teil 3.2 — Nie 100 % von Amazon abhängig (“Nicht auf gemietetem Land bauen”)',
        },
        bullets: {
          en: [
            'Amazon is a marketplace platform; they can modify their Terms of Service or disable accounts at will — if you rely only on KDP, your entire publishing income can vanish overnight',
            'Don’t build on rented land: your long-term assets are your copyright, your files, your email list, and your direct storefront — not a single KDP login',
            'Strategy 1 — Publishing wide: keep ebooks OFF KDP Select (90-day exclusivity); use Draft2Digital for Apple / Kobo / B&N / Google Play / libraries (OverDrive, Hoopla, Bibliotheca); use KDP Print for Amazon sales with Expanded Distribution unchecked; upload the same print PDFs to IngramSpark for bookstores, schools, and libraries',
            'Strategy 2 — Email list: platforms keep buyer contact data — you do not know who bought; put a lead magnet CTA in front matter and back matter; ESP (MailerLite / Kit / Mailchimp) + landing page + automated welcome download',
            'Comparison: Exclusive = high platform risk + Amazon owns audience; Wide + list = diversified income + you own the subscriber list + day-one launch emails',
            'Full copy-paste CTAs, landing-page layout, and welcome-email template: open the Publish wide + email list playbook',
          ],
          de: [
            'Amazon ist eine Marketplace-Plattform; sie können AGB ändern oder Konten jederzeit deaktivieren — wer nur auf KDP setzt, kann das gesamte Publishing-Einkommen über Nacht verlieren',
            'Nicht auf gemietetem Land bauen: Langzeit-Assets sind Urheberrecht, Dateien, E-Mail-Liste und eigener Shop — nicht ein einzelnes KDP-Login',
            'Strategie 1 — Wide: E-Books OHNE KDP Select (90-Tage-Exklusivität); Draft2Digital für Apple / Kobo / B&N / Google Play / Bibliotheken (OverDrive, Hoopla, Bibliotheca); KDP Print für Amazon-Verkäufe mit Expanded Distribution aus; dieselben Print-PDFs bei IngramSpark für Buchhandel, Schulen und Bibliotheken',
            'Strategie 2 — E-Mail-Liste: Plattformen behalten Käufer-Kontaktdaten — Sie wissen nicht wer kaufte; Lead-Magnet-CTA in Front- und Back-Matter; ESP (MailerLite / Kit / Mailchimp) + Landingpage + automatischer Welcome-Download',
            'Vergleich: Exclusive = hohes Plattformrisiko + Amazon besitzt die Audience; Wide + Liste = gestreutes Einkommen + Sie besitzen die Abonnentenliste + Day-One-Launch-Mails',
            'Vollständige Kopier-CTAs, Landingpage-Layout und Welcome-Mail-Vorlage: Playbook „Wide publizieren + E-Mail-Liste“ öffnen',
          ],
        },
      },
      {
        heading: {
          en: 'Part 3.3 — Strict copyright & trademark audits',
          de: 'Teil 3.3 — Strenge Copyright- & Marken-Audits',
        },
        bullets: {
          en: [
            'Design assets: always keep full commercial licensing records for every stock image, font, and illustration used on covers and interiors',
            'Keywords / titles: never use trademarked brand names (e.g. Disney, Lego, Barbie) or other authors’ names in your title, subtitle, or backend keywords',
            'Public-domain text still needs unique value (new commentary, design, curation) — thin reprints are a common termination trigger',
          ],
          de: [
            'Design-Assets: immer vollständige kommerzielle Lizenznachweise für jedes Stockbild, jede Schrift und Illustration auf Cover und Innenteil behalten',
            'Keywords / Titel: nie markenrechtlich geschützte Markennamen (z. B. Disney, Lego, Barbie) oder fremde Autorennamen in Titel, Untertitel oder Backend-Keywords',
            'Public-Domain-Text braucht trotzdem eigenen Mehrwert (Kommentar, Design, Kuratierung) — dünne Nachdrucke sind ein häufiger Kündigungs-Trigger',
          ],
        },
        links: [
          {
            label: 'Content Guidelines',
            url: 'https://kdp.amazon.com/en_US/help/topic/G200672390',
          },
        ],
      },
      {
        heading: {
          en: 'Part 3.4 — Back up everything',
          de: 'Teil 3.4 — Alles sichern',
        },
        bullets: {
          en: [
            'Always keep local copies on your own hard drive and a separate cloud backup',
            'Raw manuscripts (.docx)',
            'Final formatted interiors (.pdf / .epub)',
            'High-resolution cover source files',
            'Copyright documentation, licenses, and rights transfers',
          ],
          de: [
            'Immer lokale Kopien auf der eigenen Festplatte und ein separates Cloud-Backup behalten',
            'Rohe Manuskripte (.docx)',
            'Final formatierte Innenteile (.pdf / .epub)',
            'Hochauflösende Cover-Quelldateien',
            'Copyright-Dokumentation, Lizenzen und Rechteübertragungen',
          ],
        },
      },
      {
        heading: {
          en: 'Suggested next steps',
          de: 'Empfohlene nächste Schritte',
        },
        bullets: {
          en: [
            'If appealing now: fill the POA template above, attach evidence, and reply to the termination notice only',
            'If going wide: follow Part 2b (Draft2Digital) for ebooks and/or Part 2c (IngramSpark) for print',
            'Re-read KDP Content Guidelines + Hard Topics (AI disclosure, metadata honesty) before any future upload',
            'Open First-time publisher truths for email-list + distribution planning',
          ],
          de: [
            'Bei Einspruch jetzt: POA-Vorlage oben ausfüllen, Belege anhängen, nur auf den Kündigungshinweis antworten',
            'Bei Wide: Teil 2b (Draft2Digital) für E-Books und/oder Teil 2c (IngramSpark) für Print',
            'KDP Content Guidelines + Schwierigsthemen (KI-Disclosure, ehrliche Metadaten) vor jedem künftigen Upload erneut lesen',
            'Playbook „Wahrheiten für Erstautor:innen“ für E-Mail-Liste + Distributionsplanung öffnen',
          ],
        },
        links: [
          {
            label: 'Content Guidelines',
            url: 'https://kdp.amazon.com/en_US/help/topic/G200672390',
          },
          { label: 'KDP Jumpstart', url: 'https://kdp.amazon.com/en_US/help/topic/G202187740' },
          { label: 'Draft2Digital', url: 'https://www.draft2digital.com/' },
          { label: 'IngramSpark', url: 'https://www.ingramspark.com/' },
        ],
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
      en: 'Deep dive: Freiberufler vs Gewerbe, Steuer-ID vs Steuernummer vs USt-IdNr., Fragebogen zur steuerlichen Erfassung, Kleinunternehmer § 19, W-8BEN / treaty (⚠). Not tax advice — Steuerberater required. Detail also in KDP requirements panel.',
      de: 'Deep Dive: Freiberufler vs Gewerbe, Steuer-ID vs Steuernummer vs USt-IdNr., Fragebogen zur steuerlichen Erfassung, Kleinunternehmer § 19, W-8BEN / Abkommen (⚠). Keine Steuerberatung — Steuerberater nötig. Detail auch im KDP-Anforderungs-Panel.',
    },
    sections: [
      {
        heading: {
          en: 'Freiberufler vs Gewerbe — do you need a trade registration?',
          de: 'Freiberufler vs Gewerbe — brauchen Sie eine Gewerbeanmeldung?',
        },
        bullets: {
          en: [
            'In Germany you do NOT need to register a trade business (Gewerbe) just to publish your own books',
            'Your personal Tax ID (Steuer-ID / Identifikationsnummer) alone is NOT sufficient if you earn self-publishing royalties — the Finanzamt expects you to declare self-employed author income',
            'Under § 18 EStG, writing and self-publishing your own original literary works is typically classified as a freelance artistic/literary activity (freie freiberufliche Tätigkeit)',
            'No Gewerbeanmeldung with the Gewerbeamt as long as you publish your own books via distributor platforms (Amazon KDP, Tolino Media, BoD, Draft2Digital) and earn royalties (Tantiemen) / self-employment income as an author',
            'It can become a Gewerbe if you buy printed copies in bulk and sell them via your own e-commerce shop, sell physical merchandise (t-shirts, mugs), or run a commercial publishing house for other authors',
          ],
          de: [
            'In DE brauchen Sie KEINE Gewerbeanmeldung nur zum Veröffentlichen eigener Bücher',
            'Die persönliche Steuer-ID (Identifikationsnummer) allein reicht NICHT, wenn Sie Selfpublishing-Royalties verdienen — das Finanzamt erwartet die Erklärung selbstständiger Autoreneinkünfte',
            'Nach § 18 EStG gilt das Schreiben und Selfpublishing eigener literarischer Werke typisch als freie freiberufliche Tätigkeit',
            'Keine Gewerbeanmeldung beim Gewerbeamt, solange Sie eigene Bücher über Distributoren (Amazon KDP, Tolino Media, BoD, Draft2Digital) veröffentlichen und Tantiemen / selbstständige Autoreneinkünfte erzielen',
            'Gewerbe kann entstehen, wenn Sie gedruckte Exemplare in Mengen kaufen und über eigenen Online-Shop verkaufen, physische Merch-Artikel (T-Shirts, Tassen) verkaufen oder ein Verlagsgewerbe für andere Autor:innen betreiben',
          ],
        },
        note: {
          en: '⚠ Not tax or legal advice — classification (Freiberufler vs Gewerbe) depends on your exact activities; confirm with a Steuerberater / Finanzamt.',
          de: '⚠ Keine Steuer-/Rechtsberatung — Freiberufler vs Gewerbe hängt von Ihren konkreten Tätigkeiten ab; mit Steuerberater / Finanzamt klären.',
        },
      },
      {
        heading: {
          en: '1. Three German tax numbers authors mix up',
          de: '1. Drei deutsche Steuernummern, die Autor:innen verwechseln',
        },
        bullets: {
          en: [
            'A) Personal Tax ID (Steuer-ID / Identifikationsnummer): 11 digits (e.g. 12 345 678 901) — lifelong ID every resident receives',
            'Steuer-ID is NOT enough to publish legally as a self-employed author: KDP may accept it at signup, but the Finanzamt still requires you to declare self-employed income',
            'B) Self-employed / freelance tax number (Steuernummer): 10–11 digits with slashes (e.g. 15/123/45678) — issued by your local Finanzamt for freelance revenue',
            'How to get a Steuernummer: register your freelance writing with the Finanzamt via Fragebogen zur steuerlichen Erfassung (ELSTER or tax software such as Accountable / Sorted)',
            'C) VAT ID (Umsatzsteuer-ID / USt-IdNr.): starts with DE + 9 digits (e.g. DE123456789)',
            'Why USt-IdNr. matters: platforms like Amazon KDP (Luxembourg), Draft2Digital (US), and Apple Books pay across EU borders — a VAT ID supports EU Reverse Charge royalty payouts and can reduce unnecessary withholding friction; request it free on the Fragebogen',
          ],
          de: [
            'A) Persönliche Steuer-ID (Identifikationsnummer): 11 Ziffern (z. B. 12 345 678 901) — lebenslange ID jeder/s Resident:in',
            'Steuer-ID reicht NICHT als alleinige Grundlage für selbstständige Autorentätigkeit: KDP akzeptiert sie ggf. bei Anmeldung, aber das Finanzamt verlangt die Erklärung selbstständiger Einkünfte',
            'B) Steuernummer für Selbstständige / Freiberufler: 10–11 Ziffern mit Schrägstrichen (z. B. 15/123/45678) — vom zuständigen Finanzamt für freiberufliche Einnahmen',
            'Steuernummer erhalten: freiberufliche Autorentätigkeit per Fragebogen zur steuerlichen Erfassung melden (ELSTER oder Steuersoftware wie Accountable / Sorted)',
            'C) Umsatzsteuer-ID (USt-IdNr.): beginnt mit DE + 9 Ziffern (z. B. DE123456789)',
            'Warum USt-IdNr. zählt: Plattformen wie Amazon KDP (Luxemburg), Draft2Digital (US) und Apple Books zahlen grenzüberschreitend — USt-IdNr. stützt EU-Reverse-Charge bei Royalties und kann Quellensteuer-Reibung verringern; kostenlos im Fragebogen beantragen',
          ],
        },
      },
      {
        heading: {
          en: '2. Step-by-step — notify the Finanzamt',
          de: '2. Schritt für Schritt — Finanzamt informieren',
        },
        bullets: {
          en: [
            '1) Submit the Fragebogen zur steuerlichen Erfassung via ELSTER or a simplified tax-registration tool',
            'State your activity as “Freiberufliche Autorin / Freiberuflicher Autor” (Freelance Author) and indicate estimated first-year income',
            '2) Select Kleinunternehmerregelung (§ 19 UStG) if eligible — older notes often cite under ~€22,000 first-year self-employed revenue (⚠ thresholds change; verify current UStG / Finanzamt figures)',
            'Kleinunternehmer means you typically do not charge VAT on sales and avoid complex monthly VAT returns (confirm current rules)',
            '3) Within about 2–4 weeks your Finanzamt usually posts your official Steuernummer and Umsatzsteuer-ID (USt-IdNr.)',
            '4) Update publishing platforms: enter Steuernummer and/or USt-IdNr. in profile settings on Amazon KDP, Tolino Media, BoD, and Draft2Digital',
          ],
          de: [
            '1) Fragebogen zur steuerlichen Erfassung über ELSTER oder vereinfachtes Anmelde-Tool einreichen',
            'Tätigkeit als „Freiberufliche Autorin / Freiberuflicher Autor“ angeben und geschätztes Einkommen im ersten Jahr eintragen',
            '2) Kleinunternehmerregelung (§ 19 UStG) wählen, wenn berechtigt — ältere Notizen nennen oft unter ca. 22.000 € Umsatz im ersten Jahr (⚠ Schwellen ändern sich; aktuelle UStG-/Finanzamt-Zahlen prüfen)',
            'Kleinunternehmer: typisch keine USt auf Verkäufe und keine komplexen monatlichen USt-Voranmeldungen (aktuelle Regeln prüfen)',
            '3) Innerhalb von ca. 2–4 Wochen schickt das Finanzamt meist Steuernummer und Umsatzsteuer-ID (USt-IdNr.) per Post',
            '4) Plattformen aktualisieren: Steuernummer und/oder USt-IdNr. in den Profilen von Amazon KDP, Tolino Media, BoD und Draft2Digital eintragen',
          ],
        },
        links: [
          { label: 'ELSTER', url: 'https://www.elster.de/' },
          { label: 'BzSt', url: 'https://www.bzst.de/' },
          { label: 'KDP', url: 'https://kdp.amazon.com/' },
        ],
      },
      {
        heading: {
          en: 'Author tax registration checklist',
          de: 'Checkliste Steueranmeldung Autor:in',
        },
        rows: [
          {
            label: { en: 'Gewerbe registration?', de: 'Gewerbeanmeldung?' },
            detail: {
              en: 'Not needed — author / self-publisher of own works is typically freiberuflich (§ 18 EStG)',
              de: 'Nicht nötig — Autor:in / Selfpublisher eigener Werke typisch freiberuflich (§ 18 EStG)',
            },
          },
          {
            label: { en: 'Personal Steuer-ID only?', de: 'Nur persönliche Steuer-ID?' },
            detail: {
              en: 'Not enough — register freelance author activity with the Finanzamt',
              de: 'Nicht genug — freiberufliche Autorentätigkeit beim Finanzamt anmelden',
            },
          },
          {
            label: { en: 'Required tax number', de: 'Erforderliche Steuernummer' },
            detail: {
              en: 'Steuernummer from your local Finanzamt after Fragebogen zur steuerlichen Erfassung',
              de: 'Steuernummer vom lokalen Finanzamt nach Fragebogen zur steuerlichen Erfassung',
            },
          },
          {
            label: { en: 'Recommended tax ID', de: 'Empfohlene Steuer-ID' },
            detail: {
              en: 'Umsatzsteuer-ID (USt-IdNr.) — helps B2B cross-border royalties (e.g. KDP Luxembourg) under EU Reverse Charge',
              de: 'Umsatzsteuer-ID (USt-IdNr.) — hilft bei B2B-grenzüberschreitenden Royalties (z. B. KDP Luxemburg) unter EU-Reverse-Charge',
            },
          },
        ],
      },
      {
        heading: { en: 'Inside KDP / Merch', de: 'In KDP / Merch' },
        bullets: {
          en: [
            'Complete W-8BEN (individual) or W-8BEN-E (entity) in the Amazon tax interview — typically online only',
            'Have your German Steueridentifikationsnummer ready (BzSt / registration docs) — and your Steuernummer / USt-IdNr. once issued',
            'Default US withholding is often described as 30%; treaty relief may reduce it — only the rate Amazon shows after your interview is authoritative',
            'Complete tax setup in each programme that pays you (KDP and Merch separately if prompted)',
          ],
          de: [
            'W-8BEN (Privat) oder W-8BEN-E (Firma) im Amazon-Steuerinterview — meist nur online',
            'Deutsche Steueridentifikationsnummer bereithalten (BzSt / Meldeunterlagen) — und Steuernummer / USt-IdNr., sobald erteilt',
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
      en: 'Best free starting path (Hard Topics → Jumpstart → Help → Kindlepreneur → Reedsy), children’s-book resources after KDP basics, one optional paid course, what to learn first, and a realistic 30-day plan. Prefer free first — treat upsells critically.',
      de: 'Bester Free-Pfad (Schwierigsthemen → Jumpstart → Help → Kindlepreneur → Reedsy), Kinderbuch-Ressourcen nach KDP-Basics, optional ein bezahlter Kurs, Lernreihenfolge und realistischer 30-Tage-Plan. Zuerst kostenlos — Upsells kritisch prüfen.',
    },
    sections: [
      {
        heading: { en: 'Best free starting path', de: 'Bester kostenloser Einstieg' },
        bullets: {
          en: [
            '0) Amazon Hub → KDP learning centre → Hard Topics (print 50%/60% − cost, eBook VAT/delivery, AI disclosure, categories)',
            '1) Amazon KDP Jumpstart — official account → publish → payment walkthrough + content guidelines',
            '2) KDP Help Center — formatting, print specs, royalties, tax troubleshooting + live calculator',
            '3) Kindlepreneur — free SEO/keywords/categories/descriptions/ads library',
            '4) Reedsy Self-Publishing 101 — free ~10-day email course on craft + distribution basics',
            '5) Self Publishing Titans free intro — useful videos; ignore hype and upsells',
          ],
          de: [
            '0) Amazon Hub → KDP-Lernzentrum → Schwierigsthemen (Print 50%/60% − Kosten, E-Book MwSt./Delivery, KI-Disclosure, Kategorien)',
            '1) Amazon KDP Jumpstart — offizieller Weg Konto → Publish → Zahlung + Content-Guidelines',
            '2) KDP Help Center — Formatierung, Print-Specs, Royalties, Steuer-Troubleshooting + Live-Rechner',
            '3) Kindlepreneur — kostenlose SEO-/Keyword-/Kategorie-/Ads-Bibliothek',
            '4) Reedsy Self-Publishing 101 — ca. 10-Tage-E-Mail-Kurs zu Craft + Distribution',
            '5) Self Publishing Titans Free-Intro — nützliche Videos; Hype und Upsells ignorieren',
          ],
        },
        links: [
          { label: 'KDP home', url: 'https://kdp.amazon.com/' },
          { label: 'KDP Jumpstart', url: 'https://kdp.amazon.com/en_US/help/topic/G202187740' },
          {
            label: 'Print & royalty calculator',
            url: 'https://kdp.amazon.com/en_US/help/topic/GSQF43YAMUPFTMSP',
          },
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
    id: 'bilingual-story',
    title: {
      en: 'How to write a bilingual children’s book story',
      de: 'Bilinguale Kinderbuch-Story schreiben',
    },
    summary: {
      en: 'One emotional core → character → ~14 spreads → rhyme or lyrical prose → bilingual layout → native translation. Belonging / two-worlds themes for diaspora. Study comps — never copy.',
      de: 'Ein emotionaler Kern → Figur → ca. 14 Spreads → Reim oder lyrische Prosa → bilinguales Layout → Muttersprach-Übersetzung. Zugehörigkeit / Zwei-Welten für Diaspora. Comps studieren — nie kopieren.',
    },
    sections: [
      {
        heading: {
          en: 'Craft formula (study, don’t copy)',
          de: 'Craft-Formel (studieren, nicht kopieren)',
        },
        bullets: {
          en: [
            'One universal feeling + one character with a clear problem + hopeful close',
            'Diaspora themes: belonging between two worlds / brave in a new place / heritage pride',
            'Heritage-culture names can signal authenticity when community-checked',
            '~32 pages ≈ 14 spreads: open → problem → struggle → turn → resolve → memorable close',
          ],
          de: [
            'Ein universelles Gefühl + eine Figur mit klarem Problem + hoffnungsvoller Schluss',
            'Diaspora-Themen: Zugehörigkeit zwischen zwei Welten / Mut an neuem Ort / Heritage-Stolz',
            'Heritage-Kultur-Namen können Authentizität signalisieren, wenn community-geprüft',
            'Ca. 32 Seiten ≈ 14 Spreads: Öffnen → Problem → Kampf → Wendung → Auflösung → merkbarer Schluss',
          ],
        },
      },
      {
        heading: {
          en: 'Bilingual layout + translation',
          de: 'Bilinguales Layout + Übersetzung',
        },
        bullets: {
          en: [
            'Side-by-side or top/bottom split work best for parent–child reading on Amazon.de',
            'Rhyme rarely survives direct translation — separate rhymes per language or use lyrical prose',
            'Never raw machine-translate Twi/Igbo/Swahili/Zulu — two native verifiers before publish',
            'Aim ~300–500 words per language so pages stay light',
          ],
          de: [
            'Side-by-side oder oben/unten-Split am besten für Eltern–Kind-Lesen auf Amazon.de',
            'Reim überlebt Direktübersetzung selten — getrennte Reime pro Sprache oder lyrische Prosa',
            'Nie rohe Maschinenübersetzung für Twi/Igbo/Swahili/Zulu — zwei Muttersprach-Checks vor Publish',
            'Ca. 300–500 Wörter pro Sprache, damit Seiten leicht bleiben',
          ],
        },
        note: {
          en: 'Full template + tables in the module below. Cross-check niche research + bilingual kids demand first. For Twi/Igbo: use the heritage translator playbook.',
          de: 'Volles Template + Tabellen im Modul unten. Zuerst Nischen-Research + Bilingual-Kids-Demand gegenprüfen. Für Twi/Igbo: Heritage-Übersetzer-Playbook nutzen.',
        },
      },
    ],
  },
  {
    id: 'heritage-translator',
    title: {
      en: 'How to find a Twi or Igbo translator',
      de: 'Twi- oder Igbo-Übersetzer:in finden',
    },
    summary: {
      en: 'Machine tools fail for Twi/Igbo. Community-first in DE diaspora → verify with two natives → brief + dialect. Freelance sites optional with samples. Authenticity beats a thin existing listing.',
      de: 'Maschinen-Tools scheitern bei Twi/Igbo. Community-first in der DE-Diaspora → zwei Muttersprach-Checks → Briefing + Dialekt. Freelance optional mit Samples. Authentizität schlägt ein dünnes bestehendes Listing.',
    },
    sections: [
      {
        heading: {
          en: 'Human native only + where to look',
          de: 'Nur Muttersprach + wo suchen',
        },
        bullets: {
          en: [
            'Google Translate / DeepL / consumer apps / Kindle Translate are unreliable or unsupported for Twi & Igbo',
            'Best: Ghanaian / Nigerian Facebook & WhatsApp groups and churches in Germany (credit + free copy or modest pay)',
            'Universities with African Studies (Hamburg, HU Berlin, Leipzig) often have students open to paid short projects',
            'Fiverr / Upwork / ProZ: always buy a sample paragraph; confirm dialect (Asante/Fante; Igbo variants)',
          ],
          de: [
            'Google Translate / DeepL / Consumer-Apps / Kindle Translate sind für Twi & Igbo unzuverlässig oder nicht unterstützt',
            'Beste Quelle: ghanaische / nigerianische Facebook- & WhatsApp-Gruppen und Kirchen in DE (Credit + Freiexemplar oder bescheidene Bezahlung)',
            'Unis mit Afrikanistik (Hamburg, HU Berlin, Leipzig) haben oft Studierende für kurze bezahlte Projekte',
            'Fiverr / Upwork / ProZ: immer Sample-Absatz kaufen; Dialekt bestätigen (Asante/Fante; Igbo-Varianten)',
          ],
        },
      },
      {
        heading: {
          en: 'Verify, brief, cost reality',
          de: 'Prüfen, briefen, Kosten-Realität',
        },
        bullets: {
          en: [
            'Two-translator rule + read-aloud + cultural + back-translation before publish',
            'Brief: ages 3–7, short lines, warm tone, names unchanged, dialect stated, credit agreed',
            '⚠ € ranges in the module are owner snapshots — negotiate in writing',
            'Study any Igbo–DE comps on Amazon.de for layout/keywords — never copy; authenticity + community promo is the edge',
          ],
          de: [
            'Zwei-Übersetzer-Regel + Lautlese + Kultur + Rückübersetzung vor Publish',
            'Briefing: Alter 3–7, kurze Zeilen, warmer Ton, Namen unverändert, Dialekt genannt, Credit vereinbart',
            '⚠ €-Ranges im Modul sind Owner-Snapshots — schriftlich verhandeln',
            'Igbo–DE-Comps auf Amazon.de für Layout/Keywords studieren — nie kopieren; Authentizität + Community-Promo ist der Vorteil',
          ],
        },
        note: {
          en: 'Full tables, post template, and checklists in the module below.',
          de: 'Volle Tabellen, Post-Vorlage und Checklisten im Modul unten.',
        },
      },
    ],
  },
  {
    id: 'kdp-niche-research',
    title: {
      en: 'How to research KDP niches before publishing',
      de: 'KDP-Nischen recherchieren vor dem Publish',
    },
    summary: {
      en: 'Research first, write second. Free stack: autocomplete → category Top 100 → 3-point BSR check → competition lights → keywords → cover audit. BSR→€ tables ⚠. Bilingual DE workflow included.',
      de: 'Zuerst Research, dann schreiben. Free-Stack: Autocomplete → Kategorie Top 100 → 3-Punkt-BSR-Check → Konkurrenz-Ampel → Keywords → Cover-Audit. BSR→€-Tabellen ⚠. Bilingual-DE-Workflow inklusive.',
    },
    sections: [
      {
        heading: {
          en: 'Golden rule + free idea generation',
          de: 'Goldene Regel + Free-Ideenfindung',
        },
        bullets: {
          en: [
            'Most KDP failures are research failures — spend 2–3 hours before writing',
            'Incognito Amazon.de Books autocomplete with seed phrases (Kinderbuch / bilingual / activity)',
            'Scan Children’s Books subcategory Top 100; note themes, BSR, reviews, price, year',
            'Diaspora niches: validate in Facebook/WhatsApp groups before creating',
          ],
          de: [
            'Die meisten KDP-Misserfolge sind Research-Fehler — 2–3 Stunden vor dem Schreiben',
            'Inkognito Amazon.de Bücher-Autocomplete mit Seed-Phrasen (Kinderbuch / bilingual / Activity)',
            'Kinderbuch-Unterkategorie Top 100 scannen; Themen, BSR, Reviews, Preis, Jahr notieren',
            'Diaspora-Nischen: in Facebook-/WhatsApp-Gruppen validieren vor dem Erstellen',
          ],
        },
      },
      {
        heading: {
          en: 'Demand, competition, keywords',
          de: 'Demand, Konkurrenz, Keywords',
        },
        bullets: {
          en: [
            '3-point check: several BSR under ~300k, some under ~200 reviews, recent entrants still ranking',
            'Green / yellow / red competition lights before you commit',
            'Keywords must match buyer language; bilingual patterns in both DE + partner language',
            'Cover must win at thumbnail size — weak comps = your design edge',
          ],
          de: [
            '3-Punkt-Check: mehrere BSR unter ca. 300k, einige unter ca. 200 Reviews, neue Einträge ranken noch',
            'Grün-/Gelb-/Rot-Konkurrenz-Ampel vor dem Commit',
            'Keywords müssen Käufersprache matchen; bilinguale Muster in DE + Partnersprache',
            'Cover muss in Thumbnail-Größe gewinnen — schwache Comps = Ihr Design-Vorteil',
          ],
        },
        note: {
          en: '⚠ BSR→monthly sales and royalty € examples are third-party heuristics — use live KDP calculator. Paid tools optional. Full module below.',
          de: '⚠ BSR→Monats-Sales und Royalty-€-Beispiele sind Drittanbieter-Heuristiken — Live-KDP-Rechner nutzen. Bezahlte Tools optional. Volles Modul unten.',
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
            'Upload beyond Amazon: Tolino Media, BoD, epubli, tredition (see Language & market panel + Publish wide playbook) — keep KDP Select OFF',
            'Phase 2: English editions (same art, new text) on .com / .co.uk after DE traction',
            'Phase 3: bilingual — EN/FR/ES/TR/AR↔DE have Amazon.de catalogue proof; African-language↔DE often empty (first-mover or unproven)',
            'Heritage-language pairs: validate in diaspora Facebook/WhatsApp groups before print; keywords in both languages',
          ],
          de: [
            'Phase 1: Deutsch — Eltern, Schulen, Bibliotheken + Tolino/Libreka Inland',
            'Upload jenseits Amazon: Tolino Media, BoD, epubli, tredition (siehe Panel Sprache & Markt + Wide-Playbook) — KDP Select AUS',
            'Phase 2: EN-Ausgaben (gleiche Kunst, neuer Text) auf .com / .co.uk nach DE-Traktion',
            'Phase 3: bilingual — EN/FR/ES/TR/AR↔DE mit Amazon.de-Katalog-Belegen; afrikanische Sprachen↔DE oft leer (First-Mover oder unbewiesen)',
            'Heritage-Language-Paare: in Diaspora-Facebook-/WhatsApp-Gruppen validieren vor Print; Keywords in beiden Sprachen',
          ],
        },
        links: [
          { label: 'Tolino Media', url: 'https://www.tolino-media.de/' },
          { label: 'BoD', url: 'https://www.bod.de/' },
          { label: 'epubli', url: 'https://www.epubli.de/' },
          { label: 'tredition', url: 'https://tredition.de/' },
        ],
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
            'Amazon prints, packs, and ships each order — zero inventory, zero shipping ops (Zero Production Cost)',
            'You receive a royalty per sale (list price minus Amazon base cost) — often cited 15% - 25% (Royalty) historically / Plus group',
            'KDP link: the same children’s characters become Merch designs — book → matching tee is a classic brand extension',
            'Compare Merch vs AWS / Renewed / Custom / Business in Playbooks → Under-explored Amazon ecosystems before you over-invest in one lane',
          ],
          de: [
            'Design hochladen → Produkte wählen (Tees, Hoodies, Taschen…) → Preis setzen',
            'Amazon druckt, verpackt und versendet — kein Lager, kein Versandaufwand (Zero Production Cost)',
            'Royalty je Verkauf (Listenpreis minus Amazon-Basiskosten) — historisch / Plus oft 15% - 25% (Royalty)',
            'KDP-Link: dieselben Kinderbuch-Figuren werden Merch-Motive — Buch → passendes Shirt ist Marken-Extension',
            'Merch vs AWS / Renewed / Custom / Business in Playbooks → Unterschätzte Amazon-Ökosysteme vergleichen, bevor Sie eine Spur überinvestieren',
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
            'Open StoryForge Launchpad Tutorials tab on desktop (≥1024px) — map videos to Character Turbo / Editor Pro / Canvas',
            'Run one Amazon.de autocomplete research session before designing Merch',
            'Draft your first 10 Merch slots from the four design types',
          ],
          de: [
            'Merch on Demand beantragen',
            'Figur + emotionaler Kern für Buch 1 fertigstellen',
            'StoryForge-Launchpad-Tab Tutorials am Desktop öffnen (≥1024px) — Videos auf Character Turbo / Editor Pro / Canvas mappen',
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
