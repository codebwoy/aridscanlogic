/**
 * Under-explored Amazon ecosystems beyond KDP / standard FBA retail.
 * Concrete numbers from official Amazon/AWS docs + dated third-party notes — all ⚠ verify live.
 * Guidance only — not investment or legal advice.
 */

export const AMAZON_ALT_ECOSYSTEMS_CONFIG = {
  lastVerified: '2026-10-12',
  sourceLabel:
    'Official: AWS Marketplace seller docs, sell.amazon.com Renewed/Custom/Business, merch.amazon.com. Third-party Merch tier/royalty notes ⚠. Re-check before applying.',
  hubGuideId: 'amazon-alt-ecosystems',
  independenceDisclaimer: {
    en: 'Not affiliated with Amazon or AWS. Entry barriers, fees, tiers, and margins change by marketplace (US vs DE). Margin % below are directional owner/third-party ranges — not guarantees. Verify on official portals before you invest time or capital.',
    de: 'Nicht mit Amazon oder AWS verbunden. Einstiegshürden, Gebühren, Tiers und Margen ändern sich je Marktplatz (US vs DE). %-Margen unten sind Richtwerte — keine Garantie. Vor Zeit-/Kapitalinvestition offizielle Portale prüfen.',
  },
  intro: {
    en: 'While KDP and standard FBA/FBM attract millions of sellers, Amazon also runs specialized ecosystems with higher skill barriers, enterprise buyers, or approval gates — often less saturated than consumer retail. Use this matrix to pick what fits your skills, capital, and risk tolerance.',
    de: 'Während KDP und Standard-FBA/FBM Millionen Seller anziehen, betreibt Amazon auch spezialisierte Ökosysteme mit höheren Skill-Hürden, Enterprise-Käufern oder Freigaben — oft weniger gesättigt als Consumer-Retail. Nutzen Sie die Matrix, um zu wählen, was zu Skills, Kapital und Risiko passt.',
  },
  chainVsKdp: {
    en: 'These are not “easier than KDP” — they trade competition for specialized knowledge, capital, or ops. Many DE creators should still start KDP + Merch; add these when skills/capital match.',
    de: 'Das ist nicht „leichter als KDP“ — weniger Konkurrenz gegen spezialisiertes Wissen, Kapital oder Ops. Viele DE-Creator starten weiter mit KDP + Merch; diese Programme dazu, wenn Skills/Kapital passen.',
  },
  ecosystems: [
    {
      id: 'aws_marketplace',
      number: 1,
      name: {
        en: 'AWS Marketplace (SaaS, APIs, data, AI agents)',
        de: 'AWS Marketplace (SaaS, APIs, Daten, KI-Agents)',
      },
      tagline: {
        en: 'B2B shift: sell SaaS/AI to companies on AWS billing — not B2C retail shoppers. AWS handles customer billing; payouts route to your bank.',
        de: 'B2B-Shift: SaaS/KI an Unternehmen über AWS-Billing verkaufen — nicht B2C-Retail. AWS übernimmt Customer Billing; Auszahlungen auf Ihr Konto.',
      },
      businessModelShift: {
        en: [
          'Selling a SaaS or AI Solution on the AWS Marketplace shifts your business model from B2C (selling to retail shoppers) to B2B (selling directly to companies and software teams)',
          'Instead of handling payments yourself, AWS handles customer billing',
          'Buyers use their pre-approved company cloud budgets to purchase your product, while AWS automatically routes payouts to your bank account',
        ],
        de: [
          'Ein SaaS- oder KI-Produkt im AWS Marketplace verschiebt das Modell von B2C (Retail-Shopper) zu B2B (Unternehmen und Software-Teams)',
          'Statt selbst Zahlungen abzuwickeln, übernimmt AWS das Customer Billing',
          'Käufer:innen zahlen aus freigegebenen Firmen-Cloud-Budgets; AWS leitet Auszahlungen automatisch auf Ihr Bankkonto',
        ],
      },
      whatYouSell: {
        en: [
          'SaaS subscriptions, pay-as-you-go APIs, AMI/containers, ML models, datasets (AWS Data Exchange)',
          'Niche business tools and automated workflows that run on or integrate with AWS (including Bedrock-based AI agents — where compliant)',
          'Offer types: public SaaS subscriptions, contracts, and contracts with consumption (metering via AWS Marketplace APIs)',
          'Idea examples: shop-management / Shopware tools, bulk e-commerce SEO generators, document/data processors, translation pipelines, AI API gateways / workflow managers for SMBs',
        ],
        de: [
          'SaaS-Abos, Pay-as-you-go-APIs, AMI/Container, ML-Modelle, Datasets (AWS Data Exchange)',
          'Nischen-Business-Tools und Workflows auf/mit AWS (inkl. Bedrock-basierter KI-Agents — wo konform)',
          'Angebotsarten: öffentliche SaaS-Subscriptions, Contracts und Contracts mit Consumption (Metering über AWS-Marketplace-APIs)',
          'Ideen-Beispiele: Shop-Management / Shopware-Tools, Bulk-E-Commerce-SEO-Generatoren, Dokument-/Daten-Prozessoren, Übersetzungs-Pipelines, KI-API-Gateways / Workflow-Manager für KMUs',
        ],
      },
      whyLowCompetition: {
        en: [
          'Most “Amazon sellers” only know retail/KDP — packaging software + cloud metering is a different skill set',
          'Requires AWS seller registration, tax/bank details, and product integration (entitlement / BatchMeterUsage) before public launch',
          'Public SaaS launch typically needs AWS review (~7–10 business days cited in docs — verify live)',
        ],
        de: [
          'Die meisten „Amazon-Seller“ kennen nur Retail/KDP — Software + Cloud-Metering ist ein anderes Skillset',
          'Erfordert AWS-Seller-Registrierung, Steuer-/Bankdaten und Produkt-Integration (Entitlement / BatchMeterUsage) vor Public Launch',
          'Öffentlicher SaaS-Launch braucht typisch AWS-Review (Docs nennen oft ca. 7–10 Werktage — live prüfen)',
        ],
      },
      potential: {
        en: [
          'Enterprise Budgets: AWS customers often spend from pre-approved cloud budgets — deal sizes can be thousands of dollars per contract',
          'Zero Logistics / Zero Returns: no physical inventory, no retail-style returns warehouse (software entitlements, not boxed goods)',
          'Official listing fees (software/data public offers, as of AWS docs): SaaS ~3%, AMI/container/ML ~20%, Data Exchange ~3% of TCV — private offers tier by contract size (e.g. 3% under $1M, lower at higher TCV). Always confirm current fee schedule.',
        ],
        de: [
          'Enterprise Budgets: AWS-Kunden zahlen oft aus freigegebenen Cloud-Budgets — Deal-Größen können Tausende Dollar je Contract sein',
          'Zero Logistics / Zero Returns: kein physisches Lager, kein Retail-Return-Warehouse (Software-Entitlements, keine Kartons)',
          'Offizielle Listing-Fees (Software/Daten öffentliche Angebote laut AWS-Docs): SaaS ca. 3 %, AMI/Container/ML ca. 20 %, Data Exchange ca. 3 % vom TCV — Private Offers je Contract-Größe gestaffelt. Aktuelle Fee-Tabelle immer prüfen.',
        ],
      },
      howToEnter: {
        en: [
          'Step 1 — Define B2B idea: automated shop tools, SEO generators, doc/data processors, translation pipelines, AI API gateways',
          'Step 2 — Register as AWS Marketplace Seller in the AWS Marketplace Management Portal (AMMP); bank details for direct-deposit payouts (DE/EMEA often W-8/VAT + SWIFT + KYC for EMEA SARL)',
          'Step 3 — Build the SaaS in Cursor IDE (frontend + backend + DB); add onboarding route e.g. /api/aws/fulfill that accepts the POST token, calls ResolveCustomer, creates workspace in Supabase, logs user into dashboard',
          'Step 4 — Submit listing: Create SaaS Product → Flat Monthly Rate / Per-User Contract / Pay-As-You-Go Usage (metered) → set Fulfillment URL → sandbox test → submit for review → go live',
        ],
        de: [
          'Schritt 1 — B2B-Idee definieren: Shop-Tools, SEO-Generatoren, Doc/Daten-Prozessoren, Übersetzungs-Pipelines, KI-API-Gateways',
          'Schritt 2 — Als AWS-Marketplace-Seller im AWS Marketplace Management Portal (AMMP) registrieren; Bankdaten für Direct-Deposit (DE/EMEA oft W-8/USt + SWIFT + KYC für EMEA SARL)',
          'Schritt 3 — SaaS in Cursor IDE bauen (Frontend + Backend + DB); Onboarding-Route z. B. /api/aws/fulfill: POST-Token, ResolveCustomer, Workspace in Supabase, Login ins Dashboard',
          'Schritt 4 — Listing einreichen: Create SaaS Product → Flat Monthly Rate / Per-User Contract / Pay-As-You-Go Usage (metered) → Fulfillment URL → Sandbox-Test → Review → Live',
        ],
      },
      howItWorks: {
        en: [
          'You are not handing over your full source code to Amazon',
          '1 You Host the Software: core app (Next.js, Node.js, Python, Supabase, etc.) runs on cloud infra (AWS, Vercel, Fly.io, or your own servers)',
          '2 AWS Handles the Paywall: when an enterprise customer subscribes, AWS redirects them to your Fulfillment/Onboarding Landing Page with a secure token (x-amzn-marketplace-token)',
          '3 Your App Calls the AWS API: exchange the token with the AWS Marketplace SDK (ResolveCustomer) to identify who subscribed and what tier/contract they bought',
        ],
        de: [
          'Sie übergeben Amazon nicht Ihren vollständigen Quellcode',
          '1 You Host the Software: Kern-App (Next.js, Node.js, Python, Supabase usw.) läuft auf Cloud-Infra (AWS, Vercel, Fly.io oder eigene Server)',
          '2 AWS Handles the Paywall: bei Enterprise-Abo leitet AWS zur Fulfillment/Onboarding Landing Page mit Secure Token (x-amzn-marketplace-token)',
          '3 Your App Calls the AWS API: Token mit AWS Marketplace SDK (ResolveCustomer) lösen — wer hat abonniert, welches Tier/Contract',
        ],
      },
      techStackCore: {
        en: [
          'Frontend: React, Next.js, or SvelteKit',
          'Backend: Node.js, Python (FastAPI/Express), or serverless API routes',
          'Database & Auth: Supabase (PostgreSQL, Row Level Security, Auth) or PostgreSQL',
          'Hosting: Vercel, Fly.io, or AWS (ECS / App Runner / Lambda)',
        ],
        de: [
          'Frontend: React, Next.js oder SvelteKit',
          'Backend: Node.js, Python (FastAPI/Express) oder serverless API-Routes',
          'Database & Auth: Supabase (PostgreSQL, Row Level Security, Auth) oder PostgreSQL',
          'Hosting: Vercel, Fly.io oder AWS (ECS / App Runner / Lambda)',
        ],
      },
      techStackAws: {
        en: [
          'AWS SDK v3 for JavaScript / Node.js — specifically @aws-sdk/client-marketplace-metering and @aws-sdk/client-marketplace-entitlement',
          'Amazon Simple Queue Service (SQS) & SNS — automated backend events when a customer cancels, upgrades, or fails a payment',
          'Metering for usage pricing: BatchMeterUsage (alongside ResolveCustomer / entitlement checks)',
        ],
        de: [
          'AWS SDK v3 for JavaScript / Node.js — speziell @aws-sdk/client-marketplace-metering und @aws-sdk/client-marketplace-entitlement',
          'Amazon Simple Queue Service (SQS) & SNS — Backend-Events bei Cancel, Upgrade oder fehlgeschlagener Zahlung',
          'Metering für Usage-Pricing: BatchMeterUsage (neben ResolveCustomer / Entitlement-Checks)',
        ],
      },
      cursorIde: {
        en: [
          'Yes — Cursor IDE is well-suited for building AWS Marketplace apps (TypeScript, React, Node.js, backend config = standard full-stack)',
          'Cursor Rules (.cursorrules or .cursor/rules): define workspace rules so the AI knows your AWS Marketplace integration logic',
          'Example rule: “This project is an AWS Marketplace SaaS application. Always handle incoming POST requests on /api/aws/onboard by parsing the x-amzn-marketplace-token, calling ResolveCustomer via the AWS SDK v3, storing the returned CustomerIdentifier in Supabase, and mapping it to the user profile.”',
          'Prompt engineering example: “Write a Node.js API route that accepts the AWS Marketplace token, resolves it using @aws-sdk/client-marketplace-metering, and registers the subscriber inside my Supabase database.”',
          'Suggested next: keep a ready Node.js/TypeScript ResolveCustomer → Supabase snippet in-repo; keep a Marketplace-specific .cursor/rules file',
        ],
        de: [
          'Ja — Cursor IDE eignet sich gut für AWS-Marketplace-Apps (TypeScript, React, Node.js, Backend-Config = Standard-Full-Stack)',
          'Cursor Rules (.cursorrules oder .cursor/rules): Workspace-Regeln, damit die KI Ihre AWS-Marketplace-Integrationslogik kennt',
          'Beispiel-Regel: „This project is an AWS Marketplace SaaS application. Always handle incoming POST requests on /api/aws/onboard by parsing the x-amzn-marketplace-token, calling ResolveCustomer via the AWS SDK v3, storing the returned CustomerIdentifier in Supabase, and mapping it to the user profile.“',
          'Prompt-Beispiel: „Write a Node.js API route that accepts the AWS Marketplace token, resolves it using @aws-sdk/client-marketplace-metering, and registers the subscriber inside my Supabase database.“',
          'Nächste Schritte: fertiges Node.js/TypeScript ResolveCustomer → Supabase-Snippet im Repo; Marketplace-spezifische .cursor/rules-Datei',
        ],
      },
      resolveCustomerOutline: {
        en: [
          'POST /api/aws/fulfill (or /api/aws/onboard) — parse body/form field x-amzn-marketplace-token',
          'Call ResolveCustomer via @aws-sdk/client-marketplace-metering with that token',
          'Persist CustomerIdentifier (+ ProductCode / dimension) in Supabase; map to user profile / workspace',
          'Subscribe to SNS → SQS for cancel / upgrade / payment-failure events; update entitlements in DB',
          'For metered plans: emit usage with BatchMeterUsage on a schedule',
          '⚠ Educational outline only — verify against current AWS Marketplace SaaS integration docs before shipping',
        ],
        de: [
          'POST /api/aws/fulfill (oder /api/aws/onboard) — Body/Form-Feld x-amzn-marketplace-token parsen',
          'ResolveCustomer über @aws-sdk/client-marketplace-metering mit dem Token aufrufen',
          'CustomerIdentifier (+ ProductCode / Dimension) in Supabase speichern; auf User-Profil / Workspace mappen',
          'SNS → SQS für Cancel / Upgrade / Zahlungsausfall abonnieren; Entitlements in der DB aktualisieren',
          'Bei metered Plans: Usage per BatchMeterUsage zeitgesteuert melden',
          '⚠ Nur Bildungs-Outline — vor Shipping aktuelle AWS-Marketplace-SaaS-Integrations-Docs prüfen',
        ],
      },
      suitsYouIf: {
        en: [
          'You can ship and support software (or partner with a developer) — Cursor IDE + full-stack stack is enough',
          'You want B2B recurring revenue and can wait for integration + review cycles',
          'You are comfortable with AWS accounts, IAM, and compliance docs',
        ],
        de: [
          'Sie können Software liefern und supporten (oder mit Entwickler:in) — Cursor IDE + Full-Stack reicht',
          'Sie wollen B2B-Recurring und halten Integrations-/Review-Zyklen aus',
          'Sie sind mit AWS-Konten, IAM und Compliance-Docs vertraut',
        ],
      },
      notIdealIf: {
        en: [
          'You only want to publish books/art with no tech partner',
          'You need revenue in days, not months of integration',
        ],
        de: [
          'Sie wollen nur Bücher/Kunst ohne Tech-Partner',
          'Sie brauchen Umsatz in Tagen, nicht Monaten Integration',
        ],
      },
      capital: {
        en: 'Mostly time + AWS usage while building; listing fee is % of sales, not a large upfront marketplace fee',
        de: 'Hauptsächlich Zeit + AWS-Nutzung beim Bauen; Listing-Fee ist %-Anteil am Umsatz, keine große Vorab-Marktplatzgebühr',
      },
      effort: { en: 'Very high (dev + cloud ops)', de: 'Sehr hoch (Dev + Cloud-Ops)' },
      competition: { en: 'Extremely low vs retail', de: 'Extrem niedrig vs Retail' },
      marginNote: {
        en: 'Directional: software COGS can leave ~80–95% gross after AWS listing fee if infra is efficient — ⚠ not a promise; infra + support eat margin.',
        de: 'Richtwert: Software-COGS können nach Listing-Fee ~80–95 % Brutto lassen, wenn Infra effizient — ⚠ keine Zusage; Infra + Support fressen Marge.',
      },
      links: [
        {
          label: 'AWS Marketplace — sellers',
          url: 'https://docs.aws.amazon.com/marketplace/latest/userguide/user-guide-for-sellers.html',
        },
        {
          label: 'Listing fees',
          url: 'https://docs.aws.amazon.com/marketplace/latest/userguide/listing-fees.html',
        },
        {
          label: 'SaaS guidelines',
          url: 'https://docs.aws.amazon.com/marketplace/latest/userguide/saas-guidelines.html',
        },
        {
          label: 'SaaS product integration',
          url: 'https://docs.aws.amazon.com/marketplace/latest/userguide/saas-product-integration.html',
        },
      ],
    },
    {
      id: 'renewed',
      number: 2,
      name: {
        en: 'Amazon Renewed (certified refurbished)',
        de: 'Amazon Renewed (zertifiziert generalüberholt)',
      },
      tagline: {
        en: 'Invite-only / application-gated marketplace for inspected refurbished electronics & tools.',
        de: 'Invite-only / bewerbungspflichtiger Marktplatz für geprüfte generalüberholte Elektronik & Tools.',
      },
      whatYouSell: {
        en: [
          'Professionally inspected, repaired, cleaned, tested, and repackaged goods that meet manufacturer-like specs',
          'Typical: laptops, power tools, automotive parts, smart home, audio — only products that can be repaired/refurbished (electrical/mechanical)',
          'Renewed offers sit in a dedicated Renewed buy-box lane next to New (separate ASIN workflow)',
        ],
        de: [
          'Professionell geprüfte, reparierte, gereinigte, getestete und neu verpackte Ware nach Hersteller-ähnlichen Specs',
          'Typisch: Laptops, Elektrowerkzeuge, Auto-Teile, Smart Home, Audio — nur reparier-/überholbare Produkte',
          'Renewed-Angebote in eigener Buy-Box-Spur neben Neu (separater ASIN-Workflow)',
        ],
      },
      whyLowCompetition: {
        en: [
          'Invite-only style gate: Amazon applies strict entry barriers — US sell.amazon.com cites itemized invoices totaling ≥ $50,000 (and owner briefs often cite $50,000 to $100,000 range) in qualifying refurbished purchases in the prior 90 days (180 days for Home/Tools/Kitchen/Lawn & Garden); Apple-branded CE often much higher (e.g. $2.5M US cited — verify live)',
          'Existing sellers often need strong performance (e.g. ODR ≤ 0.8% trailing 90 days on some marketplaces)',
          'You need a real refurbishing, repair, or sourcing pipeline — you cannot simply buy cheap new goods from suppliers and list as Renewed',
          'Approval often ~10 days cited — varies; provide sample packaging photos and warranty capability',
        ],
        de: [
          'Invite-only-ähnliche Hürde: Amazon setzt strenge Einstiegsbarrieren — US sell.amazon.com nennt Rechnungen ≥ 50.000 $ (Owner-Briefs oft $50,000 to $100,000 Spanne) qualifizierender Refurbished-Einkäufe in 90 Tagen (180 Tage Home/Tools/Kitchen/Garten); Apple oft höher (z. B. 2,5 Mio $) — live prüfen',
          'Bestehende Seller brauchen oft starke Performance (z. B. ODR ≤ 0,8 % auf manchen Marktplätzen)',
          'Echte Refurbishing-/Reparatur-/Sourcing-Pipeline nötig — kein einfacher Einkauf billiger Neuware als Renewed',
          'Freigabe oft ca. 10 Tage genannt — variiert; Sample-Fotos und Garantiefähigkeit vorlegen',
        ],
      },
      potential: {
        en: [
          'Buy Box Advantage: separate Renewed featured-offer / buy-box lane next to New can convert discount hunters',
          'Program terms: Renewed must typically price ≥ ~5% below the New featured offer or risk losing featured eligibility',
          'Massive Profit Margins (directional): buy broken/open-box/returns cheap, repair, and resell them at 70%–80% of retail value — net after repair often cited ~40–60% — ⚠ both ranges depend on acquisition cost and failure rates',
        ],
        de: [
          'Buy Box Advantage: eigene Renewed-Featured-Offer-/Buy-Box-Spur neben Neu konvertiert Discount-Suchende',
          'Programmbedingungen: Renewed typisch ≥ ca. 5 % unter Neu-Featured-Offer — sonst Featured-Risiko',
          'Massive Profit Margins (Richtwert): kaputte/Open-Box/Returns günstig kaufen, reparieren und bei 70%–80% of retail value verkaufen — Netto nach Reparatur oft ca. 40–60 % — ⚠ beide Spannen hängen an Einkauf und Ausfallquote',
        ],
      },
      howToEnter: {
        en: [
          'Professional Seller Central account → apply via Amazon Renewed program page for your marketplace',
          'Submit invoices, seller type, Brand Registry/trademark docs if manufacturer, sample images for “Excellent” cosmetic grade',
          'Fulfill yourself or via FBA where allowed; maintain warranty (marketplace minimums vary, e.g. 12 months AU cited)',
        ],
        de: [
          'Professional Seller Central → über Renewed-Programmseite Ihres Marktplatzes bewerben',
          'Rechnungen, Seller-Typ, ggf. Brand Registry, Sample-Bilder für kosmetische Stufe „Excellent“',
          'Selbst fulfillment oder FBA wo erlaubt; Garantie halten (Mindestlaufzeiten je Marktplatz)',
        ],
      },
      suitsYouIf: {
        en: [
          'You already source/repair electronics or tools at scale',
          'You can fund and document $50k+ refurbished inventory purchases',
          'You can run QC, packaging, and warranty ops',
        ],
        de: [
          'Sie sourcen/reparieren Elektronik oder Tools bereits in Scale',
          'Sie können ≥ 50k $-Refurbished-Einkäufe finanzieren und dokumentieren',
          'Sie können QC, Verpackung und Garantie-Ops stemmen',
        ],
      },
      notIdealIf: {
        en: [
          'You are a DE creator with book/Merch capital only',
          'You cannot prove invoice history or repair capability',
          'Your home marketplace does not offer Renewed yet — verify amazon.de availability',
        ],
        de: [
          'Sie sind DE-Creator nur mit Buch-/Merch-Kapital',
          'Sie können keine Rechnungs-Historie oder Reparaturfähigkeit nachweisen',
          'Ihr Heimatmarktplatz bietet Renewed ggf. noch nicht — amazon.de-Verfügbarkeit prüfen',
        ],
      },
      capital: {
        en: 'High — inventory + repair parts + Professional seller fees',
        de: 'Hoch — Lager + Ersatzteile + Professional-Seller-Gebühren',
      },
      effort: { en: 'Very high (ops + QC)', de: 'Sehr hoch (Ops + QC)' },
      competition: { en: 'Very low (gatekept)', de: 'Sehr niedrig (Zugangskontrolle)' },
      marginNote: {
        en: 'Directional 40–60% after repair costs when sourcing is excellent — ⚠ verify every deal.',
        de: 'Richtwert 40–60 % nach Reparaturkosten bei gutem Sourcing — ⚠ jeden Deal prüfen.',
      },
      links: [
        { label: 'Amazon Renewed (US)', url: 'https://sell.amazon.com/programs/renewed' },
        { label: 'Seller Central', url: 'https://sellercentral.amazon.com/' },
      ],
    },
    {
      id: 'merch',
      number: 3,
      name: {
        en: 'Amazon Merch on Demand (POD apparel & prints)',
        de: 'Amazon Merch on Demand (POD-Bekleidung & Prints)',
      },
      tagline: {
        en: 'Zero inventory POD on Amazon’s catalog — royalties only; tier-gated slots.',
        de: 'Zero-Inventory-POD im Amazon-Katalog — nur Royalties; slot-begrenzt per Tier.',
      },
      whatYouSell: {
        en: [
          'Custom art on T-shirts, hoodies, totes, phone cases, pop-sockets, and other Merch products Amazon offers in your account',
          'Best fit for DE children’s publishers: reuse StoryForge character art as apparel next to the book brand',
        ],
        de: [
          'Eigene Kunst auf T-Shirts, Hoodies, Taschen, Hüllen, PopSockets u. a. Merch-Produkten',
          'Beste Passung für DE-Kinderbuch-Publisher: StoryForge-Figurenkunst als Apparel neben der Buchmarke',
        ],
      },
      whyLowCompetition: {
        en: [
          'Application gate at merch.amazon.com — wait often weeks; third-party 2025/2026 notes often cite ~30–40% acceptance (⚠ not official Amazon %)',
          'Tier System: sellers start at Tier 10 (10 live designs) then unlock Tier 25 / 100 / 500 / 1,000+ with real sales — this prevents new users from spamming thousands of low-quality designs',
          'US store (from 1 Jun 2026 Amazon Merch notes): royalty groups Creator / Plus / Premium by non-organic traffic share (ads/social you drive). Plus needs ~15%+ external + often ≥10 US units/month; Premium ~35%+. Plus ≈ 2× Creator; Premium ≈ 2.16× Creator — ⚠ verify Merch Resource Center',
        ],
        de: [
          'Bewerbung unter merch.amazon.com — Wartezeit oft Wochen; Drittanbieter 2025/2026 nennen oft ca. 30–40 % Annahme (⚠ keine offizielle Amazon-%)',
          'Tier System: Start bei Tier 10 (10 Live-Designs), dann Freischaltung Tier 25 / 100 / 500 / 1.000+ mit echten Sales — verhindert Spam mit Tausenden Low-Quality-Designs',
          'US-Store (ab 1. Jun 2026 laut Amazon-Merch): Royalty-Gruppen Creator / Plus / Premium nach Non-Organic-Traffic. Plus ca. 15 %+ External + oft ≥10 US-Units/Monat; Premium ca. 35 %+. Plus ≈ 2× Creator; Premium ≈ 2,16× Creator — ⚠ Merch Resource Center prüfen',
        ],
      },
      potential: {
        en: [
          'Zero Production Cost: Amazon manufactures, packages, ships, and handles customer service — you simply earn a royalty (list minus Amazon base)',
          'Directional: a ~$19.99 US tee example cited ~$2.44 Creator / ~$4.88 Plus / ~$5.27 Premium after Jun 2026 — Creator ≈ half prior flat rate if entirely organic; historical / Plus-group royalties often ~15% - 25% (Royalty) of list (⚠ third-party examples; check your dashboard)',
          'High Scale: once you tier up (e.g. Tier 1,000+), you can operate a multi-thousand-product catalog generating passive royalties with no inventory risk — still need niche research + (US) some owned traffic',
        ],
        de: [
          'Zero Production Cost: Amazon produziert, verpackt, versendet und macht CS — Sie verdienen nur Royalty (Liste minus Amazon-Basis)',
          'Richtwert: ca. 19,99 $-US-Tee oft ca. 2,44 $ Creator / 4,88 $ Plus / 5,27 $ Premium nach Jun 2026 — Creator ≈ Hälfte der alten Flat bei rein organisch; historisch / Plus-Gruppe oft ~15% - 25% (Royalty) vom Listenpreis (⚠ Drittanbieter; Dashboard prüfen)',
          'High Scale: nach Tier-Up (z. B. Tier 1.000+) multi-thousand-product catalog mit passiven Royalties und ohne Lagerrisiko — trotzdem Nischen-Research + (US) etwas eigenen Traffic',
        ],
      },
      howToEnter: {
        en: [
          'Apply at merch.amazon.com with tax + bank details; if denied, many guides cite waiting ~60 days before reapply (verify)',
          'Upload print-ready art (Hub Merch guide: often 4500×5400 PNG — confirm live specs)',
          'Open Hub playbook “Merch on Demand — full guide” for DE tiers, pricing maths, and KDP brand loop',
        ],
        de: [
          'Unter merch.amazon.com mit Steuer + Bank bewerben; bei Ablehnung nennen viele Guides ca. 60 Tage Wartezeit vor Neuversuch (prüfen)',
          'Druckfertige Kunst hochladen (Hub-Merch-Guide: oft 4500×5400 PNG — Live-Specs prüfen)',
          'Hub-Playbook „Merch on Demand — Vollständiger Guide“ für DE-Tiers, Preisrechnung und KDP-Marken-Loop',
        ],
      },
      suitsYouIf: {
        en: [
          'You already make illustration / character IP (perfect with StoryForge + KDP)',
          'You want $0 inventory risk and can grind niches at Tier 10–25',
          'You can drive some external traffic if US royalty groups matter to you',
        ],
        de: [
          'Sie haben bereits Illustration / Figuren-IP (perfekt mit StoryForge + KDP)',
          'Sie wollen 0 € Lagerrisiko und können Nischen bei Tier 10–25 grinden',
          'Sie können etwas External Traffic treiben, falls US-Royalty-Gruppen relevant sind',
        ],
      },
      notIdealIf: {
        en: [
          'You refuse application uncertainty / waitlists',
          'You need bulk physical wholesale margins (use FBA/Business instead)',
        ],
        de: [
          'Sie wollen keine Bewerbungs-Unsicherheit / Wartelisten',
          'Sie brauchen Bulk-Wholesale-Margen (eher FBA/Business)',
        ],
      },
      capital: { en: '€0 inventory; time only', de: '0 € Lager; nur Zeit' },
      effort: { en: 'Low–medium (design + SEO)', de: 'Niedrig–mittel (Design + SEO)' },
      competition: {
        en: 'High at Tier 10 spam niches; lower at quality high tiers',
        de: 'Hoch in Spam-Nischen auf Tier 10; niedriger bei Qualität auf hohen Tiers',
      },
      marginNote: {
        en: 'Directional: Plus-group tee royalty often ~24% of a $19.99 list; Creator ~12% if fully organic (US Jun 2026) — ⚠ verify Merch dashboard; DE rates may differ.',
        de: 'Richtwert: Plus-Gruppe oft ca. 24 % von 19,99 $ Listenpreis; Creator ca. 12 % bei rein organisch (US Jun 2026) — ⚠ Merch-Dashboard; DE-Sätze können abweichen.',
      },
      deepGuideId: 'merch-ops',
      links: [
        { label: 'Merch on Demand', url: 'https://merch.amazon.com/' },
        {
          label: 'Sell on Amazon — Merch',
          url: 'https://sell.amazon.com/programs/merch',
        },
      ],
    },
    {
      id: 'custom',
      number: 4,
      name: {
        en: 'Amazon Custom (personalized / made-to-order)',
        de: 'Amazon Custom (personalisiert / Made-to-Order)',
      },
      tagline: {
        en: 'Seller Central addon for engraving, monograms, custom print, embroidery.',
        de: 'Seller-Central-Addon für Gravur, Monogramm, Custom-Print, Stickerei.',
      },
      whatYouSell: {
        en: [
          'Personalized gifts, engraved wood/metal, custom cases, bespoke home decor, customized sports gear',
          'Shoppers configure options (text, image, choices) on the listing; you fulfill made-to-order (typically merchant-fulfilled)',
        ],
        de: [
          'Personalisierte Geschenke, graviertes Holz/Metall, Custom-Hüllen, Home-Decor, Sport-Gear',
          'Käufer:innen konfigurieren Optionen (Text, Bild, Auswahl) am Listing; Sie fulfillment Made-to-Order (typisch merchant-fulfilled)',
        ],
      },
      whyLowCompetition: {
        en: [
          'Requires Professional selling plan (or Handmade exception); Custom registration in Seller Central — approvals often emailed within ~1 hour per Amazon Custom pages',
          'Defeats Chinese Manufacturers & Automated Bots: standard private-label listings are heavily targeted by overseas / Chinese manufacturers; custom goods need local, fast fulfillment (each item made to order)',
          'Each unit is made to order — harder to race-to-bottom on identical ASINs',
        ],
        de: [
          'Braucht Professional Selling Plan (oder Handmade-Ausnahme); Custom-Registrierung in Seller Central — Freigaben oft innerhalb ca. 1 Stunde laut Amazon-Custom-Seiten',
          'Defeats Chinese Manufacturers & Automated Bots: Standard-Private-Label wird stark von Overseas-/chinesischen Herstellern angegriffen; Custom braucht lokale, schnelle Fulfillment (jedes Stück Made-to-Order)',
          'Jedes Stück Made-to-Order — schwerer im Race-to-Bottom auf identischen ASINs',
        ],
      },
      potential: {
        en: [
          'High margins from emotional/gift purchases (weddings, anniversaries, corporate gifts) with typically low return rates',
          'No Amazon Returns (preference): customized products are generally not returnable under Amazon Custom rules — but may be refunded/replaced within 30 days if damaged, defective, or materially different; SFP/FBA Prime return rules can override — ⚠ read live Custom return policy',
          'Directional margins often cited ~35–50% when personalization adds value — ⚠ verify COGS + labor time',
        ],
        de: [
          'Hohe Margen durch Emotions-/Geschenkkäufe (Hochzeit, Jubiläum, Corporate Gifts) bei typisch niedrigen Return-Raten',
          'No Amazon Returns (Geschmack): Custom-Produkte typisch nicht rückgabefähig unter Amazon-Custom-Regeln — aber Erstattung/Ersatz innerhalb 30 Tagen bei Schaden/Defekt/wesentlicher Abweichung; SFP/FBA-Prime kann überschreiben — ⚠ Live-Policy',
          'Richt-Margen oft ca. 35–50 % bei starker Personalisierung — ⚠ COGS + Arbeitszeit prüfen',
        ],
      },
      howToEnter: {
        en: [
          'Upgrade to Professional Seller → register for Amazon Custom in Seller Central',
          'Create/edit listings with customization types; show accurate after-custom images and realistic lead times',
          'Fulfill via merchant fulfillment with the customer’s configuration from Manage Orders',
        ],
        de: [
          'Auf Professional Seller upgraden → Amazon Custom in Seller Central registrieren',
          'Listings mit Customization-Typen anlegen; After-Custom-Bilder und realistische Lieferzeiten zeigen',
          'Per Merchant Fulfillment mit Konfiguration aus Manage Orders ausliefern',
        ],
      },
      suitsYouIf: {
        en: [
          'You can laser-engrave, embroider, or print-to-order locally with short lead times',
          'You want gift niches without fighting identical FBA clones',
        ],
        de: [
          'Sie können lokal gravieren, sticken oder Print-to-Order mit kurzen Lead Times',
          'Sie wollen Geschenk-Nischen ohne identische FBA-Clones',
        ],
      },
      notIdealIf: {
        en: [
          'You cannot fulfill custom work yourself and refuse MFN ops',
          'You only want zero-touch POD (use Merch instead)',
        ],
        de: [
          'Sie können Custom-Arbeit nicht selbst fulfillmenten und wollen kein MFN',
          'Sie wollen nur Zero-Touch-POD (lieber Merch)',
        ],
      },
      capital: {
        en: 'Medium — tools (laser/embroidery) + Professional fee + materials',
        de: 'Mittel — Tools (Laser/Stick) + Professional-Gebühr + Material',
      },
      effort: { en: 'Medium–high (per-order labor)', de: 'Mittel–hoch (Arbeit pro Order)' },
      competition: { en: 'Low vs standard PL', de: 'Niedrig vs Standard-PL' },
      marginNote: {
        en: 'Directional 35–50% when personalization premium sticks — ⚠ labor is the hidden cost.',
        de: 'Richtwert 35–50 %, wenn Personalization-Premium hält — ⚠ Arbeit ist die versteckte Kostenstelle.',
      },
      links: [
        { label: 'Amazon Custom', url: 'https://sell.amazon.com/programs/custom' },
        { label: 'Seller Central', url: 'https://sellercentral.amazon.com/' },
      ],
    },
    {
      id: 'amazon_business',
      number: 5,
      name: {
        en: 'Amazon Business (B2B bulk & org buyers)',
        de: 'Amazon Business (B2B-Bulk & Organisationskäufer)',
      },
      tagline: {
        en: 'Same catalog — different buyers: orgs, schools, clinics, government-style procurement.',
        de: 'Gleicher Katalog — andere Käufer: Orgs, Schulen, Kliniken, Beschaffung.',
      },
      whatYouSell: {
        en: [
          'Office supplies, janitorial, commercial packaging, educational kits, lab consumables, bulk materials — any ASIN business buyers need in volume',
          'You already sell on Amazon; Business features layer on: business-only prices + quantity discounts (up to 5 tiers)',
        ],
        de: [
          'Bürobedarf, Reinigung, Verpackung, Bildungs-Kits, Labor-Verbrauch, Bulk-Material — jede ASIN, die Orgs in Menge brauchen',
          'Sie verkaufen schon auf Amazon; Business-Features obendrauf: Business-only-Preise + Mengenrabatte (bis 5 Tiers)',
        ],
      },
      whyLowCompetition: {
        en: [
          'Most sellers optimize only for consumer keywords and ignore business pricing columns',
          'Requires setting up Quantity Discounts, Business-Only Pricing, and Tax-Exemption certificates (ATEP / VCS where available)',
          'Amazon marketing cites millions of business customers globally (e.g. “8 million+” on sell.amazon.com Business pages — ⚠ marketing figure; verify)',
        ],
        de: [
          'Die meisten Seller optimieren nur Consumer-Keywords und ignorieren Business-Preis-Spalten',
          'Erfordert Quantity Discounts, Business-Only Pricing und Tax-Exemption-Zertifikate (ATEP / VCS wo verfügbar)',
          'Amazon-Marketing nennt Millionen Business-Kunden global (z. B. „8 Millionen+“ auf sell.amazon.com — ⚠ Marketingzahl; prüfen)',
        ],
      },
      potential: {
        en: [
          'High Average Order Value (AOV): instead of selling 1 unit for $20, a single B2B order frequently spans 50 to 500 units to a single corporate address',
          'Repeat Automated Orders: corporate clients set up recurring / scheduled purchase schedules — predictable monthly revenue',
          'From 1 Oct 2025: reduced referral fees on qualifying bulk Business orders when business price or quantity discount is ≥ ~3% under standard; typically applies to the portion of a single-ASIN order above ~$1,000 (bands by category — verify Seller Central)',
          'Amazon marketing cites “8 million+” business customers worldwide — ⚠ marketing figure',
          'Directional net margins often cited ~25–40% for well-sourced bulk — ⚠ category referral fees dominate',
        ],
        de: [
          'High Average Order Value (AOV): statt 1 Einheit für 20 $ oft 50 to 500 units an eine Corporate-Adresse',
          'Repeat Automated Orders: Corporate-Kunden richten recurring / geplante Kaufpläne ein — planbarer Monatsumsatz',
          'Ab 1. Okt 2025: reduzierte Referral Fees bei qualifizierenden Bulk-Business-Orders, wenn Business-Preis/Mengenrabatt ≥ ca. 3 % unter Standard; typisch auf den Anteil einer Single-ASIN-Order über ca. 1.000 $ (Bänder je Kategorie — Seller Central prüfen)',
          'Amazon-Marketing nennt „8 Millionen+“ Business-Kunden weltweit — ⚠ Marketingzahl',
          'Richt-Nettomargen oft ca. 25–40 % bei gutem Bulk-Sourcing — ⚠ Kategorie-Fees dominieren',
        ],
      },
      howToEnter: {
        en: [
          'Active Professional seller → enable Business pricing / quantity discounts in Manage Inventory or Automate Pricing rules',
          'Offer business-only prices below retail; stack up to five quantity tiers (lower unit price at higher bounds)',
          'Participate in tax-exemption flows where your marketplace supports seller participation; keep invoices clean for orgs',
        ],
        de: [
          'Aktiver Professional Seller → Business-Pricing / Mengenrabatte in Manage Inventory oder Automate Pricing',
          'Business-only-Preise unter Retail; bis fünf Mengen-Tiers (niedrigerer Stückpreis bei höherer Menge)',
          'An Steuerbefreiungs-Flows teilnehmen, wo der Marktplatz Seller-Teilnahme unterstützt; Rechnungen für Orgs sauber halten',
        ],
      },
      suitsYouIf: {
        en: [
          'You already hold inventory (FBA/FBM) that orgs buy in packs',
          'You can negotiate supplier MOQs and cash-flow bulk buys',
          'You want AOV upside without leaving Amazon',
        ],
        de: [
          'Sie halten schon Lager (FBA/FBM), das Orgs in Packs kaufen',
          'Sie können Lieferanten-MOQs und Bulk-Cashflow stemmen',
          'Sie wollen AOV-Upside ohne Amazon zu verlassen',
        ],
      },
      notIdealIf: {
        en: [
          'You only sell digital KDP/Merch with no physical SKUs',
          'You cannot offer meaningful bulk discounts',
        ],
        de: [
          'Sie verkaufen nur digitales KDP/Merch ohne physische SKUs',
          'Sie können keine sinnvollen Mengenrabatte anbieten',
        ],
      },
      capital: {
        en: 'Medium–high inventory for bulk readiness',
        de: 'Mittel–hoch Lager für Bulk-Bereitschaft',
      },
      effort: { en: 'Medium (pricing + ops)', de: 'Mittel (Pricing + Ops)' },
      competition: { en: 'Low–medium', de: 'Niedrig–mittel' },
      marginNote: {
        en: 'Directional 25–40% after referral/FBA — ⚠ bulk discounts cut list price; win on volume.',
        de: 'Richtwert 25–40 % nach Referral/FBA — ⚠ Mengenrabatte senken Listenpreis; Volume gewinnt.',
      },
      links: [
        {
          label: 'Amazon Business (sellers)',
          url: 'https://sell.amazon.com/programs/amazon-business',
        },
        {
          label: 'B2B prices & quantity discounts',
          url: 'https://sell.amazon.com/blog/amazon-b2b-prices',
        },
      ],
    },
  ],
  comparisonMatrix: [
    {
      opportunity: { en: 'AWS Marketplace (SaaS/AI)', de: 'AWS Marketplace (SaaS/KI)' },
      barrier: { en: 'High (dev + cloud)', de: 'Hoch (Dev + Cloud)' },
      competition: { en: 'Extremely low', de: 'Extrem niedrig' },
      margins: { en: '80% - 95%*', de: '80% - 95%*' },
      skill: { en: 'Software Dev / API / Cloud Infra', de: 'Software Dev / API / Cloud Infra' },
    },
    {
      opportunity: { en: 'Amazon Renewed', de: 'Amazon Renewed' },
      barrier: { en: 'High (Financial)', de: 'Hoch (Kapital)' },
      competition: { en: 'Very Low', de: 'Sehr niedrig' },
      margins: { en: '40% - 60%*', de: '40% - 60%*' },
      skill: { en: 'Sourcing / Repair / Operations', de: 'Sourcing / Reparatur / Ops' },
    },
    {
      opportunity: { en: 'Amazon Custom', de: 'Amazon Custom' },
      barrier: { en: 'Medium', de: 'Mittel' },
      competition: { en: 'Low', de: 'Niedrig' },
      margins: { en: '35% - 50%*', de: '35% - 50%*' },
      skill: { en: 'Personalization / Laser Engraving / POD', de: 'Personalisierung / Laser / POD' },
    },
    {
      opportunity: { en: 'Amazon Business (B2B)', de: 'Amazon Business (B2B)' },
      barrier: { en: 'Medium', de: 'Mittel' },
      competition: { en: 'Low to Medium', de: 'Niedrig bis mittel' },
      margins: { en: '25% - 40%*', de: '25% - 40%*' },
      skill: { en: 'Bulk Sourcing / B2B Pricing Strategy', de: 'Bulk-Sourcing / B2B-Pricing' },
    },
    {
      opportunity: { en: 'Merch on Demand', de: 'Merch on Demand' },
      barrier: { en: 'High (approval + tiers)', de: 'Hoch (Freigabe + Tiers)' },
      competition: { en: 'Low at high tiers', de: 'Niedrig auf hohen Tiers' },
      margins: { en: '15% - 25% (Royalty)*', de: '15% - 25% (Royalty)*' },
      skill: { en: 'Niche Graphic Design / SEO', de: 'Nischen-Grafikdesign / SEO' },
    },
    {
      opportunity: { en: 'Standard KDP / FBA (ref.)', de: 'Standard KDP / FBA (Ref.)' },
      barrier: { en: 'Low–medium', de: 'Niedrig–mittel' },
      competition: { en: 'Hyper-saturated', de: 'Hyper-gesättigt' },
      margins: { en: '15% - 30% typical*', de: '15% - 30% typisch*' },
      skill: { en: 'Heavy Ad Spend / Competition', de: 'Starke Ads / Konkurrenz' },
    },
  ],
  matrixFootnote: {
    en: '*Profit Margins are directional owner/third-party ranges for comparison only — not Amazon guarantees. US Merch Creator group can run ~12% on organic-only; Plus often lands in the 15% - 25% (Royalty) band. Fees, COGS, ads, and returns decide real net.',
    de: '*Profit Margins sind Richtwerte zum Vergleich — keine Amazon-Garantie. US-Merch Creator kann bei rein organisch ca. 12 % liegen; Plus oft in der 15% - 25% (Royalty)-Bande. Fees, COGS, Ads und Returns entscheiden das echte Netto.',
  },
  pickPath: {
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
  relatedHubGuides: [
    { id: 'merch-ops', label: { en: 'Merch full guide', de: 'Merch-Vollguide' } },
    { id: 'kdp-start', label: { en: 'KDP requirements', de: 'KDP-Anforderungen' } },
    { id: 'publisher-truths', label: { en: 'Publisher truths', de: 'Publisher-Wahrheiten' } },
    { id: 'kdp-plan-to-win', label: { en: 'Plan to Win', de: 'Plan to Win' } },
    { id: 'tax-de', label: { en: 'DE tax / Freiberufler', de: 'DE-Steuer / Freiberufler' } },
  ],
}
