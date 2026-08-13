/**
 * ScanLogic master path: genuine wealth building in Germany.
 * Synthesizes publicly documented consumer guidance patterns from sources such as
 * Finanztip (geldanlage / ETF-Sparplan), Verbraucherzentrale (Geldanlage),
 * Stiftung Warentest Pantoffel-Portfolio ideas, and Bankenverband (Freistellungsauftrag).
 * Original ScanLogic summaries — educational only, not personal advice.
 */

export const DE_WEALTH_HUB_URL = 'https://www.finanztip.de/geldanlage/'
export const DE_VZ_URL =
  'https://www.verbraucherzentrale.de/wissen/geld-versicherungen/sparen-und-anlegen/geldanlage-und-altersvorsorge-so-legen-sie-ihr-erspartes-am-besten-an-43767'
export const DE_PANTOFFEL_URL = 'https://www.test.de/Anlagestrategie-Pantoffelportfolio-Einzahlphase-5179990-0/'
export const DE_ETF_SPARPLAN_URL = 'https://www.finanztip.de/indexfonds-etf/fondssparplan/'
export const DE_FREISTELLUNG_URL =
  'https://bankenverband.de/verbraucher/so-richten-sie-ihren-freistellungsauftrag-richtig-ein'

export const DE_WEALTH_COURSE = {
  id: 'de-wealth-master',
  storageKey: 'scanlogic_de_wealth_edu_progress',
  sourceBase: 'https://www.finanztip.de',
  handbookUrl: DE_WEALTH_HUB_URL,
  icon: 'Map',
  titleDe: 'Vermögensaufbau Deutschland',
  titleEn: 'Building wealth in Germany',
  taglineDe:
    'Der Master-Pfad: Schulden → Notgroschen → Risikoprofil → Welt-ETF-Sparplan → Steuern → Disziplin. Orientiert an unabhängiger Verbraucher-Logik (Finanztip, Verbraucherzentrale, Pantoffel-Idee).',
  taglineEn:
    'The master path: debt → emergency fund → risk profile → world ETF plan → taxes → discipline. Aligned with independent consumer logic (Finanztip, Verbraucherzentrale, Pantoffel-style ideas).',
  deepenDe: 'Vertiefen bei Finanztip / Verbraucherzentrale',
  deepenEn: 'Go deeper at Finanztip / Verbraucherzentrale',
  externalDe: 'Finanztip Geldanlage-Plan (extern)',
  externalEn: 'Finanztip investing plan (external)',
  creditDe:
    'Eigenständige ScanLogic-Zusammenfassung öffentlich dokumentierter Grundsätze zum Vermögensaufbau in DE. Keine Anlage-, Steuer- oder Produktberatung. Konditionen und Steuerregeln ändern sich.',
  creditEn:
    'Original ScanLogic synthesis of publicly documented wealth-building principles in Germany. Not investment, tax, or product advice. Terms and tax rules change.',
}

export const DE_WEALTH_CHAPTERS = [
  {
    id: 'de-foundation',
    number: 1,
    icon: 'Shield',
    titleDe: 'Fundament zuerst',
    titleEn: 'Foundation first',
    blurbDe: 'Haushalt, teure Schulden und Notgroschen — bevor ein Depot Sinn ergibt.',
    blurbEn: 'Budget, expensive debt, and emergency cash — before a brokerage makes sense.',
    lessons: [
      {
        id: 'de-order',
        titleDe: 'Die echte Reihenfolge',
        titleEn: 'The real order of operations',
        minutes: 5,
        sourcePath: '/geldanlage/',
        bodyDe: `## Konsens unabhängiger Ratgeber

Verbraucherorganisationen und unabhängige Redaktionen in Deutschland beschreiben denselben Ablauf — nicht „Aktien tippen“, sondern **Stabilität vor Rendite**:

1. **Überblick** — Einnahmen, Fixkosten, Verbindlichkeiten
2. **Teure Schulden** — Dispo, Kreditkarte, hochverzinsliche Raten zuerst
3. **Notgroschen** — liquide Reserve (Tagesgeld)
4. **Existenzschutz** — Haftpflicht u. a. sinnvolle Absicherung
5. **Erst dann** — langfristig investieren (ETF-Sparplan)

Wer Schritt 5 vor 2–3 macht, finanziert oft „Investments“ mit dem teuersten Kredit.

> Bildungsinhalt. Quellen-Impulse: [Finanztip Geldanlage](https://www.finanztip.de/geldanlage/), [Verbraucherzentrale](https://www.verbraucherzentrale.de/wissen/geld-versicherungen/sparen-und-anlegen/bevor-sie-geld-anlegen-das-kleine-einmaleins-der-geldanlage-10622).`,
        bodyEn: `## Independent guides agree

German consumer orgs and independent editors describe the same sequence — not “stock tips”, but **stability before return**:

1. **Overview** — income, fixed costs, debts
2. **Expensive debt** — overdraft, cards, high-rate loans first
3. **Emergency fund** — liquid reserve (call money / Tagesgeld)
4. **Existential cover** — liability insurance and similar essentials
5. **Only then** — long-term investing (ETF savings plan)

Doing step 5 before 2–3 often means funding “investments” with your costliest credit.

> Educational only. Source sparks: [Finanztip investing](https://www.finanztip.de/geldanlage/), [Verbraucherzentrale](https://www.verbraucherzentrale.de/wissen/geld-versicherungen/sparen-und-anlegen/bevor-sie-geld-anlegen-das-kleine-einmaleins-der-geldanlage-10622).`,
        keyPointsDe: [
          'Reihenfolge schlägt Produktwahl.',
          'Teure Schulden vor ETF-Sparplan.',
          'Absicherung und Liquidität sind Teil des Vermögensaufbaus.',
        ],
        keyPointsEn: [
          'Order beats product choice.',
          'Expensive debt before an ETF plan.',
          'Protection and liquidity are part of wealth building.',
        ],
      },
      {
        id: 'de-budget',
        titleDe: 'Haushalt: Spielraum schaffen',
        titleEn: 'Household: create room to invest',
        minutes: 4,
        sourcePath: '/daily/6-schritte-zum-finanziellen-masterplan/',
        bodyDe: `## Ohne Überschuss kein Plan

Vermögen entsteht aus dem **Differenzbetrag** zwischen Einkommen und Konsum — investiert über Jahre.

### Praktisch

1. 1–2 Monate Ausgaben tracken (App oder Tabelle)
2. Fixkosten prüfen (Energie, Abos, Versicherungen ohne Nutzen)
3. Dauerauftrag am Monatsanfang: Sparen/Investieren **zuerst**
4. Orientierung mancher Ratgeber: grob ~20 % des Netto beiseitelegen (wenn machbar) — z. B. Anteil Sicherheit + Anteil ETF

Selbstständige (ScanLogic-Nutzer): trenne Betriebs- und Privatkonten; investiere nur aus **Privatüberschuss**.

> Keine Sparquoten-Vorschrift.`,
        bodyEn: `## No surplus, no plan

Wealth comes from the **gap** between income and spending — invested over years.

### Practically

1. Track spending 1–2 months (app or sheet)
2. Review fixed costs (energy, unused subscriptions/insurance)
3. Standing order at month start: save/invest **first**
4. Some guides suggest ~20% of net aside when feasible — split safety + ETF

Freelancers (ScanLogic users): separate business and private accounts; invest only from **private surplus**.

> Not a savings-rate rule.`,
        keyPointsDe: [
          'Pay-yourself-first per Dauerauftrag.',
          'Fixkosten-Killers erhöhen die Sparrate.',
          'Privat vs. Betrieb klar trennen.',
        ],
        keyPointsEn: [
          'Pay yourself first via standing order.',
          'Cutting fixed costs raises the investable amount.',
          'Keep private vs business money separate.',
        ],
      },
      {
        id: 'de-emergency',
        titleDe: 'Notgroschen auf Tagesgeld',
        titleEn: 'Emergency fund in call money',
        minutes: 4,
        sourcePath: '/tagesgeld/',
        bodyDe: `## Wozu?

Damit Autoreparatur oder Job-Lücke **nicht** das Depot zwangsweise leeren.

### Orientierung (häufig in DE-Ratgebern)

- oft **3–6 Nettomonatsausgaben**
- parken auf **Tagesgeld** (verfügbar, Einlagensicherung beachten — typisch bis 100.000 € pro Person/Bank in der EU)
- Zinsen vergleichen, aber Verfügbarkeit vor Maximalzins

Erst wenn die Reserve steht: überschüssiges Geld in den langfristigen Renditebaustein.

> Keine Bankempfehlung.`,
        bodyEn: `## Why?

So a car repair or job gap does **not** force-sell the portfolio.

### Orientation (common in DE guides)

- often **3–6 months of net expenses**
- park in **call money / Tagesgeld** (accessible; mind deposit insurance — typically €100k per person/bank in the EU)
- compare rates, but access beats max yield

Only when the buffer is set: send surplus into the long-term return sleeve.

> Not a bank recommendation.`,
        keyPointsDe: [
          'Liquidität vor Aktienrisiko.',
          'Einlagensicherung prüfen.',
          'Notgroschen und Depot mental trennen.',
        ],
        keyPointsEn: [
          'Liquidity before equity risk.',
          'Check deposit insurance.',
          'Mentally separate emergency cash and portfolio.',
        ],
      },
    ],
  },
  {
    id: 'de-risk-plan',
    number: 2,
    icon: 'PieChart',
    titleDe: 'Risiko, Horizont, Allokation',
    titleEn: 'Risk, horizon, allocation',
    blurbDe: 'Aktienquote ehrlich wählen — Pantoffel-Logik: Rendite- + Sicherheitsbaustein.',
    blurbEn: 'Pick an equity share honestly — Pantoffel logic: return + safety sleeves.',
    lessons: [
      {
        id: 'de-horizon',
        titleDe: 'Anlagehorizont entscheidet',
        titleEn: 'Horizon decides the vehicle',
        minutes: 4,
        sourcePath: DE_VZ_URL,
        bodyDe: `## Faustbild der Verbraucherzentrale-Logik

| Wann brauchst du das Geld? | Tendenz |
| --- | --- |
| Wenige Jahre | eher Tages-/Festgeld |
| ~10+ Jahre | Aktien-ETFs können Sinn ergeben |
| Unklar / gemischt | **mischen** (Sicherheit + Rendite) |

Aktienmärkte können 10–15 Jahre schwach sein — deshalb gehört kurzfristiger Bedarf nicht zu 100 % in ETFs.

Quelle-Impuls: [VZ Geldanlage & Altersvorsorge](${DE_VZ_URL}).

> Keine Horizont-Garantie.`,
        bodyEn: `## Verbraucherzentrale-style rule of thumb

| When do you need the money? | Tendency |
| --- | --- |
| A few years | Prefer call/fixed deposits |
| ~10+ years | Equity ETFs can make sense |
| Unclear / mixed | **Mix** (safety + return) |

Equity markets can be weak for 10–15 years — so near-term needs do not belong 100% in ETFs.

Source spark: [VZ investing & retirement](${DE_VZ_URL}).

> Not a horizon guarantee.`,
        keyPointsDe: [
          'Kurzfristig = Sicherheit.',
          'Langfristig = Raum für Aktienrisiko.',
          'Mischen ist oft die ehrliche Antwort.',
        ],
        keyPointsEn: [
          'Short-term = safety.',
          'Long-term = room for equity risk.',
          'Mixing is often the honest answer.',
        ],
      },
      {
        id: 'de-pantoffel',
        titleDe: 'Zwei Bausteine (Pantoffel-Idee)',
        titleEn: 'Two sleeves (Pantoffel idea)',
        minutes: 5,
        sourcePath: DE_PANTOFFEL_URL,
        bodyDe: `## Einfaches Modell

Stiftung Warentest popularisierte das **Pantoffel-Portfolio**: wenig Komplexität, zwei Töpfe.

| Baustein | Rolle | Beispiele |
| --- | --- | --- |
| **Rendite** | Wachstum | breiter Welt-Aktien-ETF |
| **Sicherheit** | Stabilität / Nachkaufpuffer | Tagesgeld, Festgeld, ggf. Anleihen-/Geldmarkt-ETF |

### Beispiel-Gewichtungen (Orientierung, keine Vorschrift)

- defensiv ~25 % Aktien / 75 % sicher
- ausgewogen ~50 / 50
- offensiv ~75 / 25

Wähle nach **Nerven + Horizont**, nicht nach YouTube-Renditeversprechen.

Impuls: [Stiftung Warentest Pantoffel](${DE_PANTOFFEL_URL}).

> Keine Allokationsempfehlung.`,
        bodyEn: `## Simple model

Stiftung Warentest popularized the **Pantoffel portfolio**: low complexity, two sleeves.

| Sleeve | Role | Examples |
| --- | --- | --- |
| **Return** | Growth | Broad world equity ETF |
| **Safety** | Stability / dry powder | Call/fixed deposits, maybe bond/money-market ETF |

### Example weights (orientation, not a rule)

- defensive ~25% equity / 75% safe
- balanced ~50 / 50
- offensive ~75 / 25

Choose by **temperament + horizon**, not YouTube return promises.

Spark: [Stiftung Warentest Pantoffel](${DE_PANTOFFEL_URL}).

> Not an allocation recommendation.`,
        keyPointsDe: [
          'Zwei Bausteine reichen oft.',
          'Aktienquote = Hauptrisikohebel.',
          'Einfachheit senkt Umsetzungsfehler.',
        ],
        keyPointsEn: [
          'Two sleeves are often enough.',
          'Equity share is the main risk lever.',
          'Simplicity reduces implementation errors.',
        ],
      },
      {
        id: 'de-risk-self',
        titleDe: 'Risikotoleranz ehrlich testen',
        titleEn: 'Test risk tolerance honestly',
        minutes: 3,
        sourcePath: 'https://www.verbraucherzentrale.de/renditerechner',
        bodyDe: `## Fragen

- Hielte ich −30 % im Depot aus, ohne alles zu verkaufen?
- Brauche ich das Geld vorzeitig für Immobilie/Ausbildung?
- Habe ich sicheres Einkommen / Verpflichtungen?

Wenn die Antwort „ich würde panisch verkaufen“ ist: **niedrigere** Aktienquote — nicht „bessere Tipps“.

VZ-Renditerechner kann historisch Mischungen illustrieren (Vergangenheit ≠ Zukunft): [verbraucherzentrale.de/renditerechner](https://www.verbraucherzentrale.de/renditerechner).

> Keine Prognose.`,
        bodyEn: `## Questions

- Could I stomach −30% without selling everything?
- Might I need the money early for housing/education?
- Is income stable / are obligations high?

If the answer is “I would panic-sell”: **lower** equity share — not “better tips”.

The VZ return calculator can illustrate historical mixes (past ≠ future): [verbraucherzentrale.de/renditerechner](https://www.verbraucherzentrale.de/renditerechner).

> Not a forecast.`,
        keyPointsDe: [
          'Schlaf-Test schlägt Backtest-Fantasie.',
          'Panikverkauf ist der teuerste Fehler.',
          'Quote anpassen statt Märkte timen.',
        ],
        keyPointsEn: [
          'Sleep test beats backtest fantasy.',
          'Panic selling is the costliest mistake.',
          'Adjust the mix instead of timing markets.',
        ],
      },
    ],
  },
  {
    id: 'de-engine',
    number: 3,
    icon: 'TrendingUp',
    titleDe: 'Renditebaustein: Depot & Welt-ETF',
    titleEn: 'Return sleeve: brokerage & world ETF',
    blurbDe: 'Depot eröffnen, breiten ETF wählen, Sparplan starten — Buy and Hold.',
    blurbEn: 'Open a brokerage, pick a broad ETF, start a plan — buy and hold.',
    lessons: [
      {
        id: 'de-depot',
        titleDe: 'Depot eröffnen (Überblick)',
        titleEn: 'Opening a brokerage (overview)',
        minutes: 4,
        sourcePath: DE_ETF_SPARPLAN_URL,
        bodyDe: `## Was du brauchst

Ein **Wertpapierdepot** + Verrechnungskonto bei Direktbank/Broker.

### Typischer Ablauf

1. Online beantragen
2. Ident (VideoIdent / PostIdent)
3. Geld einzahlen (SEPA)
4. ETF per ISIN suchen
5. Sparplan anlegen

### Vergleichskriterien

- Depot- & Sparplankosten
- sparplanfähige Welt-ETFs
- steuereinfach (DE-Abgeltung) vs. Selbstdeklaration
- App/Service

Unabhängige Vergleiche (z. B. Finanztip Depot-/Sparplan-Ratgeber) regelmäßig aktualisieren — Konditionen ändern sich.

Impuls: [Finanztip Fondssparplan](${DE_ETF_SPARPLAN_URL}).

> Keine Brokerempfehlung.`,
        bodyEn: `## What you need

A **brokerage account** + cash account at an online bank/broker.

### Typical flow

1. Apply online
2. ID verification (video / post)
3. Deposit (SEPA)
4. Find ETF by ISIN
5. Create savings plan

### Comparison criteria

- custody & plan fees
- plan-eligible world ETFs
- tax-simple (DE withholding) vs self-reporting
- app/support

Independent comparisons (e.g. Finanztip) update often — terms change.

Spark: [Finanztip savings plan](${DE_ETF_SPARPLAN_URL}).

> Not a broker recommendation.`,
        keyPointsDe: [
          'Kosten + Steuern + ETF-Auswahl prüfen.',
          'ISIN nutzen, nicht Fantasienamen.',
          'Konditionen vor Eröffnung nachlesen.',
        ],
        keyPointsEn: [
          'Check costs + tax + ETF range.',
          'Use ISINs, not fantasy names.',
          'Read current terms before opening.',
        ],
      },
      {
        id: 'de-world-etf',
        titleDe: 'Welchen ETF? Breite & Kosten',
        titleEn: 'Which ETF? Breadth & cost',
        minutes: 5,
        sourcePath: '/indexfonds-etf/',
        bodyDe: `## Was unabhängige Ratgeber oft suchen

Für den langfristigen Kern:

1. **Weltweite Aktienstreuung** (Industrieländer ± Schwellenländer / All-World / ACWI-Familie)
2. **Niedrige TER** und akzeptable Tracking Difference
3. Ausreichendes **Fondsvolumen**
4. UCITS, sparplanfähig
5. thesaurierend vs. ausschüttend — Präferenz/Steuerfluss

Ein einzelner breiter Welt-ETF reicht vielen Privatanlegern. Themen-, Sektor- und Hebel-ETFs sind selten der Kern.

Details: ScanLogic **ETF-Bildung**; Vertiefung [Finanztip ETF-Vergleich](https://www.finanztip.de/indexfonds-etf/).

> Keine ISIN-Empfehlung.`,
        bodyEn: `## What independent guides often look for

For the long-term core:

1. **Global equity diversification** (developed ± emerging / All-World / ACWI family)
2. **Low TER** and acceptable tracking difference
3. Adequate **fund size**
4. UCITS, plan-eligible
5. accumulating vs distributing — preference/tax cashflow

One broad world ETF is enough for many retail investors. Theme, sector, and leveraged ETFs are rarely the core.

Details: ScanLogic **ETF Education**; deepen via [Finanztip ETF comparison](https://www.finanztip.de/indexfonds-etf/).

> Not an ISIN recommendation.`,
        keyPointsDe: [
          'Breite vor Themenhype.',
          'Kosten über Jahrzehnte summieren sich.',
          'Ein Kern-ETF schlägt Produktchaos.',
        ],
        keyPointsEn: [
          'Breadth before theme hype.',
          'Costs compound over decades.',
          'One core ETF beats product clutter.',
        ],
      },
      {
        id: 'de-sparplan-start',
        titleDe: 'Sparplan starten & durchhalten',
        titleEn: 'Start the plan & stick with it',
        minutes: 4,
        sourcePath: DE_ETF_SPARPLAN_URL,
        bodyDe: `## Umsetzung

1. Rate wählen, die nach Notgroschen tragbar ist (auch 25–50 € starten)
2. Intervall an Gehalt koppeln
3. Automatisieren — nicht jeden Monat neu entscheiden
4. Bei Dips **weiterlaufen lassen** (Cost Averaging)
5. Rate erhöhen, wenn Einkommen steigt

Finanztip-ähnliche Aufteilung nach Notgroschen (Orientierung): z. B. Teil des Sparanteils in ETF, kleiner Teil weiter in Sicherheit — Details in deren Geldanlage-Plan.

> Keine Ratenempfehlung. Vergangene Renditen ≠ Zukunft.`,
        bodyEn: `## Execution

1. Pick an amount sustainable after the emergency fund (even €25–50 to start)
2. Align interval with payday
3. Automate — do not redecide monthly
4. On dips **keep going** (cost averaging)
5. Raise the amount when income rises

Finanztip-style splits after the emergency fund (orientation): part of savings into ETF, a smaller part still into safety — see their investing plan for detail.

> Not an amount recommendation. Past returns ≠ future.`,
        keyPointsDe: [
          'Automatisierung = Disziplin.',
          'Kleine Rate > kein Start.',
          'Durchhalten schlägt Timing.',
        ],
        keyPointsEn: [
          'Automation = discipline.',
          'A small start beats no start.',
          'Sticking with it beats timing.',
        ],
      },
    ],
  },
  {
    id: 'de-tax',
    number: 4,
    icon: 'Landmark',
    titleDe: 'Steuern & Konten in DE',
    titleEn: 'Taxes & accounts in Germany',
    blurbDe: 'Abgeltungsteuer, Freistellungsauftrag, Vorabpauschale — Überblick ohne Steuerberatung.',
    blurbEn: 'Withholding tax, allowance forms, Vorabpauschale — overview without tax advice.',
    lessons: [
      {
        id: 'de-abgeltung',
        titleDe: 'Abgeltungsteuer grob verstehen',
        titleEn: 'Withholding tax in plain terms',
        minutes: 4,
        sourcePath: DE_FREISTELLUNG_URL,
        bodyDe: `## Überblick (Stand-agnostisch, prüfen!)

Kapitalerträge (Zinsen, Dividenden, realisierte Kursgewinne, Vorabpauschale) unterliegen in DE typischerweise der **Abgeltungsteuer** (25 % + Soli, ggf. KiSt).

Aktienfonds/ETFs können eine **Teilfreistellung** nutzen (Broker wendet oft automatisch an) — Details ändern sich / Einzelfall.

Steuereinfache deutsche Broker führen oft automatisch ab; ausländische Depots erfordern häufig Selbstangabe.

> Keine Steuerberatung. Regeln ändern sich.`,
        bodyEn: `## Overview (check current law!)

Investment income (interest, dividends, realized gains, Vorabpauschale) in Germany typically faces **withholding tax** (25% + solidarity, maybe church tax).

Equity funds/ETFs may get a **partial exemption** (brokers often apply automatically) — details change / case-by-case.

Tax-simple German brokers often withhold automatically; foreign accounts often need self-reporting.

> Not tax advice. Rules change.`,
        keyPointsDe: [
          'Kapitalerträge sind grundsätzlich steuerrelevant.',
          'Broker-Automatik ≠ persönliche Prüfung.',
          'Bei Unsicherheit Steuerberater.',
        ],
        keyPointsEn: [
          'Investment income is generally taxable.',
          'Broker automation ≠ personal review.',
          'Ask a tax advisor when unsure.',
        ],
      },
      {
        id: 'de-freistellung',
        titleDe: 'Freistellungsauftrag / Sparerpauschbetrag',
        titleEn: 'Allowance form / Sparerpauschbetrag',
        minutes: 4,
        sourcePath: DE_FREISTELLUNG_URL,
        bodyDe: `## Praxis

Ohne **Freistellungsauftrag** führt die Bank oft ab dem ersten Euro ab — auch wenn noch Freibetrag offen wäre.

Orientierung (prüfen!): Sparerpauschbetrag häufig **1.000 €**/Person bzw. **2.000 €** bei Zusammenveranlagung — Summe aller Aufträge über Banken darf das Maximum nicht überschreiten.

Impuls: [Bankenverband Freistellungsauftrag](${DE_FREISTELLUNG_URL}).

> Keine Steuerberatung.`,
        bodyEn: `## Practice

Without an **allowance form (Freistellungsauftrag)** the bank often withholds from the first euro — even if allowance remains.

Orientation (verify!): Sparerpauschbetrag often **€1,000**/person or **€2,000** jointly assessed — sum across banks must not exceed the max.

Spark: [Bankenverband Freistellungsauftrag](${DE_FREISTELLUNG_URL}).

> Not tax advice.`,
        keyPointsDe: [
          'Freistellungsauftrag früh einrichten.',
          'Mehrere Banken: Beträge aufteilen, nicht überziehen.',
          'Zu viel Abzug ggf. über Steuererklärung korrigieren.',
        ],
        keyPointsEn: [
          'Set the allowance form early.',
          'Multiple banks: split amounts, do not over-allocate.',
          'Excess withholding may be fixed via the tax return.',
        ],
      },
      {
        id: 'de-vorab',
        titleDe: 'Vorabpauschale (Thesaurierer)',
        titleEn: 'Vorabpauschale (accumulating funds)',
        minutes: 3,
        sourcePath: DE_FREISTELLUNG_URL,
        bodyDe: `## Was viele übersehen

Bei **thesaurierenden** Fonds/ETFs kann jährlich eine **Vorabpauschale** anfallen — fiktive Mindestbesteuerung, oft Anfang des Folgejahres vom Verrechnungskonto.

Deshalb:

- Freistellungsauftrag bedenken
- etwas Cash auf dem Verrechnungskonto lassen

Details und Basiszins ändern sich jährlich — aktuelle Infos beim Broker/BMF/Steuerberater.

> Keine Steuerberatung.`,
        bodyEn: `## What many miss

**Accumulating** funds/ETFs can trigger an annual **Vorabpauschale** — notional minimum tax, often taken from the cash account early the next year.

Therefore:

- factor the allowance form
- keep some cash in the brokerage cash account

Details and base rates change yearly — check broker/BMF/tax advisor.

> Not tax advice.`,
        keyPointsDe: [
          'Thesaurierer ≠ steuerfrei jedes Jahr.',
          'Cashpuffer für Steuerabzug.',
          'Freibetrag kann Vorabpauschale auffangen.',
        ],
        keyPointsEn: [
          'Accumulators ≠ tax-free every year.',
          'Cash buffer for tax pulls.',
          'Allowance can absorb Vorabpauschale.',
        ],
      },
    ],
  },
  {
    id: 'de-stay',
    number: 5,
    icon: 'ListChecks',
    titleDe: 'Dranbleiben & Fehler vermeiden',
    titleEn: 'Stay the course & avoid mistakes',
    blurbDe: 'Rebalancing, Jahrescheck, typische Stolperfallen in DE.',
    blurbEn: 'Rebalancing, yearly check, typical German pitfalls.',
    lessons: [
      {
        id: 'de-rebalance',
        titleDe: 'Jährliches Rebalancing',
        titleEn: 'Yearly rebalancing',
        minutes: 4,
        sourcePath: DE_PANTOFFEL_URL,
        bodyDe: `## Warum?

Wenn Aktien stark steigen, wird das Portfolio riskanter als geplant. **Rebalancing** bringt die Zielquote zurück — per Nachkauf der schwächeren Seite oder Umschichtung.

Oft reicht **1× pro Jahr**. Nicht wöchentlich traden.

Pantoffel-Logik: Depotcheck, dann Sicherheit/Rendite nachjustieren.

> Keine Timing-Empfehlung.`,
        bodyEn: `## Why?

When equities rally hard, the portfolio gets riskier than planned. **Rebalancing** restores the target mix — by buying the weaker sleeve or switching.

Often **once a year** is enough. Do not trade weekly.

Pantoffel logic: yearly check, then nudge safety/return.

> Not a timing recommendation.`,
        keyPointsDe: [
          'Zielquote halten.',
          'Selten rebalancen reicht oft.',
          'Nachkäufe über Sparplan sind schon halb Rebalancing.',
        ],
        keyPointsEn: [
          'Hold the target mix.',
          'Infrequent rebalancing is often enough.',
          'Plan contributions already half-rebalance.',
        ],
      },
      {
        id: 'de-mistakes',
        titleDe: 'Typische Fehler in Deutschland',
        titleEn: 'Typical mistakes in Germany',
        minutes: 4,
        sourcePath: DE_WEALTH_HUB_URL,
        bodyDe: `## Vermeiden

| Fehler | Besser |
| --- | --- |
| Teure aktive Fonds / Provisionen | niedrige ETF-Kosten |
| Einzelaktien als „Plan“ | breiter Welt-ETF |
| Markt timen / News jagen | Sparplan + Halten |
| Ohne Notgroschen investieren | Reserve zuerst |
| Freistellungsauftrag vergessen | Auftrag setzen |
| Alles auf eine Trendwette | Diversifikation |
| Scalping/CFD als Vermögensaufbau | separate Risikobildung |

Trading-Risiken: ScanLogic-Pfad **Trading & Scalping**. Kindersparen: eigener Pfad.

> Bildung, keine Produktliste.`,
        bodyEn: `## Avoid

| Mistake | Better |
| --- | --- |
| Expensive active funds / commissions | Low ETF costs |
| Single stocks as “the plan” | Broad world ETF |
| Timing / news chasing | Plan + hold |
| Investing without emergency cash | Buffer first |
| Forgetting the allowance form | Set the form |
| All-in on a theme bet | Diversification |
| Scalping/CFDs as wealth building | Separate risk literacy |

Trading risks: ScanLogic **Trading & Scalping** track. Kids savings: own track.

> Education, not a product list.`,
        keyPointsDe: [
          'Kosten und Komplexität sind stille Renditekiller.',
          'Prozess schlägt Prognose.',
          'Hebelprodukte ≠ Vermögensaufbau.',
        ],
        keyPointsEn: [
          'Cost and complexity silently kill returns.',
          'Process beats prediction.',
          'Leveraged products ≠ wealth building.',
        ],
      },
      {
        id: 'de-yearly',
        titleDe: 'Jahres-Checkliste Vermögensaufbau',
        titleEn: 'Yearly wealth-building checklist',
        minutes: 4,
        sourcePath: DE_WEALTH_HUB_URL,
        bodyDe: `## 1× jährlich

1. Notgroschen noch ausreichend?
2. Teure Schulden / Dispo?
3. Aktien-/Sicherheitsquote noch passend?
4. Sparrate erhöhen möglich?
5. Freistellungsauftrag aktuell / aufgeteilt?
6. Depot- & ETF-Kosten noch ok?
7. Versicherungen / Fixkosten geprüft?
8. Ziele (Immobilie, Ruhestand, Kinder) unverändert?

### Weiterlernen in der App

- **ETF-Bildung** — Indizes & Auswahl
- **ETF-Sparplan** — Cost Averaging & Broker-Check
- **Finanztip Bildung** — Alltagsfinanzen
- **Smart Money** — DIY vs. Verwaltung
- **Kindersparen** — Familie

Externe Vertiefung: [Finanztip Geldanlage](${DE_WEALTH_HUB_URL}), [Verbraucherzentrale](${DE_VZ_URL}).

> Keine persönliche Finanzplanung.`,
        bodyEn: `## Once a year

1. Emergency fund still enough?
2. Expensive debt / overdraft?
3. Equity/safety mix still right?
4. Can you raise the contribution?
5. Allowance form current / split correctly?
6. Broker & ETF costs still fine?
7. Insurance / fixed costs reviewed?
8. Goals (housing, retirement, kids) unchanged?

### Keep learning in-app

- **ETF Education** — indexes & selection
- **ETF savings plan** — cost averaging & broker check
- **Finanztip Education** — everyday money
- **Smart Money** — DIY vs managed
- **Kids savings** — family

External deep dives: [Finanztip investing](${DE_WEALTH_HUB_URL}), [Verbraucherzentrale](${DE_VZ_URL}).

> Not personal financial planning.`,
        keyPointsDe: [
          'Ein Jahresritual schlägt Dauerstress.',
          'Master-Pfad + Spezialpfade kombinieren.',
          'Unabhängige Quellen > Verkaufs-Landingpages.',
        ],
        keyPointsEn: [
          'One yearly ritual beats constant stress.',
          'Combine master path + specialty tracks.',
          'Independent sources > sales landing pages.',
        ],
      },
    ],
  },
]
