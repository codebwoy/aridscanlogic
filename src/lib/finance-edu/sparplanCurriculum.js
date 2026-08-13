/**
 * ScanLogic ETF savings-plan education — original summaries structured after
 * public “ETF-Sparplan / Investment Plan” themes (e.g. Freedom24 LP
 * https://lp.freedom24.com/de/etf-investment-plan).
 * Educational only — not a broker or product recommendation.
 */

export const FREEDOM24_ETF_PLAN_URL = 'https://lp.freedom24.com/de/etf-investment-plan'
export const FREEDOM24_HOME_URL = 'https://freedom24.com/de/'

export const SPARPLAN_COURSE = {
  id: 'etf-sparplan-plan',
  storageKey: 'scanlogic_sparplan_edu_progress',
  sourceBase: 'https://lp.freedom24.com',
  handbookUrl: FREEDOM24_ETF_PLAN_URL,
  icon: 'CalendarClock',
  titleDe: 'ETF-Sparplan & Investment Plan',
  titleEn: 'ETF savings & investment plan',
  taglineDe:
    'Regelmäßig ETFs besparen: Cost Averaging, Kosten, Broker-Check und Automatisierung — Themen wie auf ETF-Investment-Plan-Seiten (z. B. Freedom24).',
  taglineEn:
    'Invest in ETFs regularly: cost averaging, fees, broker checks, and automation — themes like ETF investment-plan pages (e.g. Freedom24).',
  deepenDe: 'Beispiel-Landingpage Freedom24 ETF-Sparplan',
  deepenEn: 'Example Freedom24 ETF savings-plan landing page',
  externalDe: 'Freedom24 ETF-Investment-Plan (extern)',
  externalEn: 'Freedom24 ETF investment plan (external)',
  creditDe:
    'Inhalte sind eigenständige ScanLogic-Kurzfassungen zum ETF-Sparplan. Broker-Konditionen ändern sich — immer aktuell prüfen. Keine Anlage- oder Brokerempfehlung.',
  creditEn:
    'Lessons are original ScanLogic summaries on ETF savings plans. Broker terms change — always verify current fees. Not investment or broker advice.',
}

export const SPARPLAN_CHAPTERS = [
  {
    id: 'plan-basics',
    number: 1,
    icon: 'CalendarClock',
    titleDe: 'Was ist ein ETF-Sparplan?',
    titleEn: 'What is an ETF savings plan?',
    blurbDe: 'Automatisches Investieren in festen Abständen — die Idee hinter dem Investment Plan.',
    blurbEn: 'Automatic investing on a fixed schedule — the idea behind an investment plan.',
    lessons: [
      {
        id: 'sp-what',
        titleDe: 'Sparplan vs. Einmalanlage',
        titleEn: 'Savings plan vs lumpsum',
        minutes: 4,
        sourcePath: '/de/etf-investment-plan',
        bodyDe: `## Kurz erklärt

Ein **ETF-Sparplan** (oft „Investment Plan“) investiert in festen Abständen (meist monatlich) einen Betrag in einen oder mehrere ETFs — automatisch.

| | Sparplan | Einmalanlage |
| --- | --- | --- |
| Timing | viele kleine Käufe | ein großer Kauf |
| Psychologie | oft leichter durchzuhalten | Timing-Druck |
| Kosten | Ausführungskosten × Anzahl | eine Order |
| Flexibilität | Rate pausieren/ändern | neu entscheiden |

Viele Landingpages bewerben genau das: **regelmäßiges, automatisiertes Investieren** statt jedes Mal manuell zu ordern.

> Bildungsinhalt, keine Brokerempfehlung.`,
        bodyEn: `## In short

An **ETF savings plan** (often “investment plan”) invests a fixed amount into one or more ETFs on a schedule (usually monthly) — automatically.

| | Plan | Lumpsum |
| --- | --- | --- |
| Timing | many small buys | one large buy |
| Psychology | often easier to stick with | timing pressure |
| Cost | execution cost × count | one order |
| Flexibility | pause/change amount | decide again |

Many landing pages sell exactly that: **regular, automated investing** instead of placing every order by hand.

> Educational only — not a broker recommendation.`,
        keyPointsDe: [
          'Sparplan = Automatisierung + Disziplin.',
          'Einmalanlage und Sparplan sind kombinierbar.',
          'Landingpages erklären die Idee — Konditionen separat prüfen.',
        ],
        keyPointsEn: [
          'A plan = automation + discipline.',
          'Lumpsum and plan can combine.',
          'Landing pages explain the idea — verify terms separately.',
        ],
      },
      {
        id: 'sp-cost-averaging',
        titleDe: 'Cost Averaging verstehen',
        titleEn: 'Understanding cost averaging',
        minutes: 4,
        sourcePath: '/de/etf-investment-plan',
        bodyDe: `## Idee

Beim regelmäßigen Kauf kaufst du bei hohen Kursen **weniger Anteile** und bei niedrigen Kursen **mehr**. Der durchschnittliche Einstiegspreis glättet sich über die Zeit — **Cost Averaging**.

### Was Cost Averaging nicht ist

- keine Garantie für Gewinn
- kein Schutz vor langem Bärenmarkt
- kein Ersatz für einen Notgroschen

Psychologisch hilft der Sparplan oft mehr als mathematisch „perfekt“ zu timen — weil du investiert bleibst.

> Vergangene Kurse sind keine Zukunftsgarantie.`,
        bodyEn: `## Idea

With regular buys you purchase **fewer shares** at high prices and **more** at low prices. Your average entry price smooths over time — **cost averaging**.

### What cost averaging is not

- no guarantee of profit
- no shield against a long bear market
- no substitute for an emergency fund

Psychologically, a plan often beats “perfect” timing — because you stay invested.

> Past prices are not a future guarantee.`,
        keyPointsDe: [
          'Durchschnittspreis über viele Käufe.',
          'Kein Renditeversprechen.',
          'Disziplin ist der eigentliche Nutzen.',
        ],
        keyPointsEn: [
          'Average price across many buys.',
          'Not a return promise.',
          'Discipline is the real benefit.',
        ],
      },
      {
        id: 'sp-how-much',
        titleDe: 'Rate, Intervall, Start',
        titleEn: 'Amount, interval, starting',
        minutes: 3,
        sourcePath: '/de/etf-investment-plan',
        bodyDe: `## Praktisch wählen

1. **Rate** — Betrag, den du nach Fixkosten und Notgroschen wirklich entbehren kannst
2. **Intervall** — meist monatlich (manche Broker auch wöchentlich)
3. **ETF** — breit, günstig, sparplanfähig (siehe ETF-Bildung)
4. **Start klein** — lieber 25–50 € durchhalten als 300 € abbrechen

Erhöhe die Rate mit Gehalt/Überschuss — nicht mit Dispo.

> Keine Betragsempfehlung.`,
        bodyEn: `## Choose practically

1. **Amount** — what you can spare after fixed costs and emergency cash
2. **Interval** — usually monthly (some brokers weekly)
3. **ETF** — broad, cheap, plan-eligible (see ETF Education)
4. **Start small** — better €25–50 sustained than €300 abandoned

Raise the amount with surplus income — not with overdraft.

> Not an amount recommendation.`,
        keyPointsDe: [
          'Tragbare Rate schlägt Maximalrate.',
          'Intervall an Gehaltseingang koppeln.',
          'Klein starten, später skalieren.',
        ],
        keyPointsEn: [
          'A sustainable amount beats a max amount.',
          'Align the interval with payday.',
          'Start small, scale later.',
        ],
      },
    ],
  },
  {
    id: 'plan-costs',
    number: 2,
    icon: 'Wallet',
    titleDe: 'Kosten & Broker-Check',
    titleEn: 'Costs & broker check',
    blurbDe: 'Was hinter „kostenlosem Sparplan“ steckt — und was du vergleichen solltest.',
    blurbEn: 'What “free savings plan” really means — and what to compare.',
    lessons: [
      {
        id: 'sp-fee-layers',
        titleDe: 'Kostenschichten beim Sparplan',
        titleEn: 'Fee layers in a savings plan',
        minutes: 5,
        sourcePath: '/de/etf-investment-plan',
        bodyDe: `## Nicht nur die Ausführungsgebühr

Landingpages heben oft **0 € Sparplanausführung** oder günstige Pläne hervor. Rechne trotzdem die Gesamtkette:

| Schicht | Beispiele |
| --- | --- |
| Depotführung | 0 € oder Modellgebühr |
| Sparplanausführung | 0 € / Fix / % |
| Produktkosten | TER des ETFs |
| Einzahlung | SEPA gratis? Karte mit Aufschlag? |
| Auszahlung | Pauschale je Transfer? |
| Order außerhalb Plan | Einmalkäufe teurer? |
| Währung / FX | USD-Assets, Umrechnung |

„Kostenlos“ bezieht sich oft nur auf **eine** Schicht.

> Keine Gebührengarantie — Konditionen ändern sich.`,
        bodyEn: `## Not just the plan fee

Landing pages often highlight **€0 plan execution** or cheap plans. Still add up the full chain:

| Layer | Examples |
| --- | --- |
| Custody | €0 or tier fee |
| Plan execution | €0 / flat / % |
| Product cost | ETF TER |
| Deposit | Free SEPA? Card surcharge? |
| Withdrawal | Flat fee per transfer? |
| Off-plan orders | One-off buys costlier? |
| FX | USD assets, conversion |

“Free” often refers to **one** layer only.

> Not a fee guarantee — terms change.`,
        keyPointsDe: [
          'Gesamtkosten > Werbezeile.',
          'Auszahlungsgebühren nicht vergessen.',
          'TER läuft jedes Jahr mit.',
        ],
        keyPointsEn: [
          'Total cost > headline.',
          'Do not forget withdrawal fees.',
          'TER runs every year.',
        ],
      },
      {
        id: 'sp-broker-checklist',
        titleDe: 'Broker-Checkliste (DE-Kontext)',
        titleEn: 'Broker checklist (DE context)',
        minutes: 5,
        sourcePath: FREEDOM24_HOME_URL,
        bodyDe: `## Vor der Depoteröffnung

1. **Steuereinfach?** — Deutsche Broker führen Abgeltungsteuer oft automatisch ab; ausländische Depots erfordern häufig **Selbstdeklaration** (Steuererklärung / Software).
2. **Regulierung & Einlagensicherung** — wo sitzt der Broker, welche Aufsicht?
3. **Sparplan-Universum** — welche ETFs (ISIN) sind sparplanfähig?
4. **Mindestrate & Intervalle**
5. **App / Service**, wenn etwas schiefgeht
6. **Auszahlung & Wechselaufwand** — wie teuer/schwer ist ein Brokerwechsel später?

Beispiel-Anbieter-Seiten (wie Freedom24 ETF-Investment-Plan) können Ideen liefern — ersetze sie nicht durch einen ungeprüften Klick auf „Konto eröffnen“.

> Keine Brokerempfehlung. Keine Steuerberatung.`,
        bodyEn: `## Before opening an account

1. **Tax simplicity?** — German brokers often withhold investment tax automatically; foreign accounts often need **self-reporting**.
2. **Regulation & protection** — where is the broker based, which supervisor?
3. **Plan universe** — which ETFs (ISIN) are plan-eligible?
4. **Minimum amount & intervals**
5. **App / support** when something breaks
6. **Withdrawal & switching cost** — how hard/expensive is leaving later?

Example vendor pages (like Freedom24’s ETF investment plan) can spark ideas — do not replace due diligence with an unchecked “open account” click.

> Not a broker recommendation. Not tax advice.`,
        keyPointsDe: [
          'Steuerabwicklung kann entscheidender sein als 0 € Ausführung.',
          'Sparplanfähige ISINs vorher checken.',
          'Ausstiegskosten mitdenken.',
        ],
        keyPointsEn: [
          'Tax handling can matter more than €0 execution.',
          'Check plan-eligible ISINs first.',
          'Price in exit costs.',
        ],
      },
      {
        id: 'sp-marketing',
        titleDe: 'Landingpages kritisch lesen',
        titleEn: 'Reading landing pages critically',
        minutes: 3,
        sourcePath: '/de/etf-investment-plan',
        bodyDe: `## Typische Werbebotschaften

- „Kostenloser Sparplan“
- „Automatisch Vermögen aufbauen“
- Bonus / Cashback / Influencer-Links

### Gegenfragen

- Welche Kosten fehlen in der Headline?
- Gilt das Angebot nur für bestimmte ETFs/Modelle?
- Bin ich die Zielgruppe — oder der Affiliate?

Unabhängige Vergleiche und das eigene Rechenbeispiel (Rate × Jahre × Gebühren) schlagen bunte LP-Grafiken.

> Bildung — kein Verriss einzelner Anbieter.`,
        bodyEn: `## Typical marketing lines

- “Free savings plan”
- “Build wealth automatically”
- Bonus / cashback / influencer links

### Counter-questions

- Which costs are missing from the headline?
- Does the offer only cover certain ETFs/tiers?
- Am I the customer — or the affiliate?

Independent comparisons and your own math (amount × years × fees) beat flashy LP graphics.

> Education — not a takedown of any single broker.`,
        keyPointsDe: [
          'Headline ≠ Gesamtkondition.',
          'Affiliate-Links kennzeichnen Motivation.',
          'Eigene Rechnung vor Kontoeröffnung.',
        ],
        keyPointsEn: [
          'Headline ≠ full terms.',
          'Affiliate links show incentives.',
          'Do your own math before signing up.',
        ],
      },
    ],
  },
  {
    id: 'plan-practice',
    number: 3,
    icon: 'ListChecks',
    titleDe: 'Umsetzung & Pflege',
    titleEn: 'Setup & upkeep',
    blurbDe: 'ETF wählen, Plan starten, jährlich reviewen — ohne Timing-Stress.',
    blurbEn: 'Pick an ETF, start the plan, review yearly — without timing stress.',
    lessons: [
      {
        id: 'sp-etf-pick',
        titleDe: 'Welchen ETF für den Plan?',
        titleEn: 'Which ETF for the plan?',
        minutes: 4,
        sourcePath: '/de/etf-investment-plan',
        bodyDe: `## Kernkriterien (Erinnerung)

1. Breiter Index (Welt / ACWI / All-World …)
2. Niedrige TER + akzeptable Tracking Difference
3. Ausreichendes Fondsvolumen
4. Thesaurierend oder ausschüttend — zu deinem Cashflow/Steuerwunsch
5. **Beim Broker sparplanfähig**

Details: Lernpfad **ETF-Bildung** (Finanzfluss-Struktur). Ein Investment-Plan-Anbieter ändert diese Qualitätslogik nicht.

> Keine ISIN-Empfehlung.`,
        bodyEn: `## Core criteria (reminder)

1. Broad index (world / ACWI / All-World …)
2. Low TER + acceptable tracking difference
3. Adequate fund size
4. Accumulating or distributing — match cashflow/tax preference
5. **Plan-eligible at your broker**

Details: **ETF Education** track (Finanzfluss structure). An investment-plan vendor does not change this quality logic.

> Not an ISIN recommendation.`,
        keyPointsDe: [
          'Qualität des ETF vor Broker-Werbe-ETF.',
          'Sparplanfähigkeit ist hartes Kriterium.',
          'Ein Welt-ETF reicht vielen.',
        ],
        keyPointsEn: [
          'ETF quality before broker promo ETFs.',
          'Plan eligibility is a hard filter.',
          'One world ETF is enough for many.',
        ],
      },
      {
        id: 'sp-automation',
        titleDe: 'Automatisieren & durchhalten',
        titleEn: 'Automate & stick with it',
        minutes: 3,
        sourcePath: '/de/etf-investment-plan',
        bodyDe: `## Setup-Routine

1. Verrechnungskonto / Lastschrift koppeln
2. Sparplan anlegen (ISIN, Rate, Intervall)
3. optional: Gehaltseingang → Dauerauftrag aufs Depotkonto
4. Kalendererinnerung: **1× jährlich** Rate und Ziele prüfen
5. nicht bei jedem Dip „pausieren aus Panik“

Der Investment Plan ist nur so gut wie deine **Durchhaltequote**.

> Keine Timing-Empfehlung.`,
        bodyEn: `## Setup routine

1. Link cash account / direct debit
2. Create the plan (ISIN, amount, interval)
3. optional: payday → standing order into the brokerage cash
4. Calendar: **yearly** review of amount and goals
5. do not “panic pause” on every dip

An investment plan is only as good as your **stick-with-it rate**.

> Not a timing recommendation.`,
        keyPointsDe: [
          'Automatisierung vor Willenskraft.',
          'Jährliches Review reicht oft.',
          'Panikpausen sabotieren Cost Averaging.',
        ],
        keyPointsEn: [
          'Automation before willpower.',
          'A yearly review is often enough.',
          'Panic pauses sabotage cost averaging.',
        ],
      },
      {
        id: 'sp-checklist',
        titleDe: 'Checkliste vor dem Start',
        titleEn: 'Checklist before you start',
        minutes: 3,
        sourcePath: FREEDOM24_ETF_PLAN_URL,
        bodyDe: `## Bevor du den Plan aktivierst

1. Notgroschen und teure Schulden geklärt?
2. Horizont ≥ mehrere Jahre?
3. ETF-Kriterien + ISIN notiert?
4. Broker: Steuern, Gebühren, Auszahlung verstanden?
5. Rate realistisch und automatisiert?
6. Risikohinweise gelesen — Märkte schwanken?

Vertiefung / Anbieterbeispiel: [Freedom24 ETF-Investment-Plan](https://lp.freedom24.com/de/etf-investment-plan) — kritisch lesen, Konditionen aktuell prüfen.

Weitere Pfade in ScanLogic: **ETF-Bildung**, **Finanztip**, **Kindersparen**.

> Keine Konto- oder Kaufempfehlung.`,
        bodyEn: `## Before you activate the plan

1. Emergency fund and expensive debt handled?
2. Horizon of several years+?
3. ETF criteria + ISIN noted?
4. Broker: tax, fees, withdrawals understood?
5. Amount realistic and automated?
6. Risk warnings read — markets swing?

Deep dive / vendor example: [Freedom24 ETF investment plan](https://lp.freedom24.com/de/etf-investment-plan) — read critically, verify current terms.

Other ScanLogic paths: **ETF Education**, **Finanztip**, **Kids savings**.

> Not an account or buy recommendation.`,
        keyPointsDe: [
          'Checkliste vor Aktivierung.',
          'Anbieter-LP nur als Impuls.',
          'Langfrist-Logik bleibt der Kern.',
        ],
        keyPointsEn: [
          'Checklist before activation.',
          'Treat vendor LPs as sparks only.',
          'Long-term logic stays the core.',
        ],
      },
    ],
  },
]
