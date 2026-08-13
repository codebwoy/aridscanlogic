/**
 * ScanLogic trading risk-literacy — original summaries structured after the
 * public WH SelfInvest “Der Scalper” ebook outline
 * (https://www.whselfinvest.de/.../scalping-ea-scalper).
 * Education & risk awareness only — not a scalping playbook, not a broker pitch.
 */

export const WH_SCALPER_EBOOK_URL =
  'https://www.whselfinvest.de/de-de/trading-plattform/bibliothek/kostenlose-e-book-pdf/scalping-ea-scalper'
export const WH_LIBRARY_URL =
  'https://www.whselfinvest.de/de-de/trading-plattform/bibliothek'

export const TRADING_COURSE = {
  id: 'wh-scalper-risk',
  storageKey: 'scanlogic_trading_edu_progress',
  sourceBase: 'https://www.whselfinvest.de',
  handbookUrl: WH_SCALPER_EBOOK_URL,
  icon: 'Activity',
  titleDe: 'Trading & Scalping — Risiken verstehen',
  titleEn: 'Trading & scalping — understand the risks',
  taglineDe:
    'Was Scalping/Daytrading ist, warum Hebel gefährlich ist, und wie sich das von langfristigem Investieren unterscheidet — Themen aus dem WH-SelfInvest-E-Book „Der Scalper“.',
  taglineEn:
    'What scalping/day trading is, why leverage is dangerous, and how it differs from long-term investing — themes from WH SelfInvest’s “The Scalper” ebook.',
  deepenDe: 'E-Book / Bibliothek bei WH SelfInvest',
  deepenEn: 'Ebook / library at WH SelfInvest',
  externalDe: 'Kostenloses E-Book „Der Scalper“ (WH SelfInvest)',
  externalEn: 'Free “The Scalper” ebook (WH SelfInvest)',
  creditDe:
    'Inhalte sind eigenständige ScanLogic-Kurzfassungen zur Risikokompetenz. Strategie-Details und Plattformwissen findest du im verlinkten WH-SelfInvest-E-Book. Keine Handelsempfehlung. CFDs und gehebeltes Trading bergen hohes Verlustrisiko.',
  creditEn:
    'Lessons are original ScanLogic risk-literacy summaries. Strategy detail and platform material live in the linked WH SelfInvest ebook. Not trading advice. CFDs and leveraged trading carry a high risk of loss.',
}

export const TRADING_CHAPTERS = [
  {
    id: 'trading-styles',
    number: 1,
    icon: 'Activity',
    titleDe: 'Trading-Stile einordnen',
    titleEn: 'Placing trading styles',
    blurbDe: 'Scalping, Daytrading, Swing — und der Abstand zum ETF-Investieren.',
    blurbEn: 'Scalping, day trading, swing — and the gap to ETF investing.',
    lessons: [
      {
        id: 'tr-what-scalping',
        titleDe: 'Was ist Scalping?',
        titleEn: 'What is scalping?',
        minutes: 4,
        sourcePath:
          '/de-de/trading-plattform/bibliothek/kostenlose-e-book-pdf/scalping-ea-scalper',
        bodyDe: `## Kurz erklärt

**Scalping** ist ein Trading-Stil mit sehr kurzen Haltedauern: oft Sekunden bis wenige Minuten. Ziel ist, viele kleine Kursbewegungen mitzunehmen — nicht langfristig am Unternehmenswachstum teilzuhaben.

### Gegenüberstellung

| Stil | Horizont | typischer Fokus |
| --- | --- | --- |
| Scalping | Sekunden–Minuten | engste Kursschwankungen |
| Daytrading | Stunden, Position über Nacht oft zu | Intraday-Trends |
| Swing | Tage–Wochen | mittelfristige Moves |
| Investieren (ETF) | Jahre | Marktrendite / Vermögen |

Scalping verlangt hohe Konzentration, schnelle Entscheidungen und **sehr niedrige Kosten** — sonst fressen Spread und Gebühren die kleinen Gewinne.

> Bildungsinhalt. Keine Aufforderung zum Scalpen.`,
        bodyEn: `## In short

**Scalping** is a trading style with very short holding periods: often seconds to a few minutes. The aim is many small price moves — not long-term ownership of business growth.

### Contrast

| Style | Horizon | Typical focus |
| --- | --- | --- |
| Scalping | Seconds–minutes | tiniest price ticks |
| Day trading | Hours, usually flat overnight | Intraday trends |
| Swing | Days–weeks | Medium-term moves |
| Investing (ETF) | Years | Market return / wealth |

Scalping needs high focus, fast decisions, and **very low costs** — otherwise spreads and fees eat the small wins.

> Educational only. Not an invitation to scalp.`,
        keyPointsDe: [
          'Scalping ≠ Investieren.',
          'Sehr kurze Horizonte, viele Trades.',
          'Kosten entscheiden, ob der Stil überhaupt tragfähig ist.',
        ],
        keyPointsEn: [
          'Scalping ≠ investing.',
          'Very short horizons, many trades.',
          'Costs decide whether the style can work at all.',
        ],
      },
      {
        id: 'tr-what-traded',
        titleDe: 'Was Scalper typischerweise handeln',
        titleEn: 'What scalpers typically trade',
        minutes: 4,
        sourcePath:
          '/de-de/trading-plattform/bibliothek/kostenlose-e-book-pdf/scalping-ea-scalper',
        bodyDe: `## Liquide Märkte

Scalping braucht **enge Spreads** und hohe Liquidität. Deshalb tauchen oft auf:

- Indizes / Index-CFDs oder Futures
- große Devisenpaare (Forex)
- sehr liquide Einzelwerte / Futures

### CFD-Warnung (wichtig)

**CFDs** sind komplexe, gehebelte Produkte. Anbieter müssen ausweisen, dass ein Großteil der Kleinanlegerkonten **Geld verliert** (bei WH SelfInvest laut Pflichtangabe z. B. 76 %). Hebel verstärkt Gewinne **und** Verluste — auch über den Einsatz hinaus möglich.

Futures und gehebelte Produkte sind ebenfalls nicht für jeden geeignet.

> Keine Produktempfehlung. Prüfe regulatorische Risikohinweise selbst.`,
        bodyEn: `## Liquid markets

Scalping needs **tight spreads** and high liquidity. Common instruments include:

- indexes / index CFDs or futures
- major FX pairs
- very liquid single names / futures

### CFD warning (critical)

**CFDs** are complex leveraged products. Providers must disclose that a majority of retail accounts **lose money** (WH SelfInvest’s mandatory figure is e.g. 76%). Leverage amplifies gains **and** losses — including beyond your deposit.

Futures and leveraged products are also not suitable for everyone.

> Not a product recommendation. Read regulatory risk warnings yourself.`,
        keyPointsDe: [
          'Liquidität und enge Spreads sind Voraussetzung.',
          'Hebelprodukte sind für die meisten Retail-Konten verlustreich.',
          'Instrument ≠ Strategie — beides verstehen.',
        ],
        keyPointsEn: [
          'Liquidity and tight spreads are prerequisites.',
          'Leveraged products lose money for most retail accounts.',
          'Instrument ≠ strategy — understand both.',
        ],
      },
      {
        id: 'tr-vs-invest',
        titleDe: 'Scalping vs. ScanLogic-Investieren',
        titleEn: 'Scalping vs ScanLogic investing',
        minutes: 3,
        sourcePath:
          '/de-de/trading-plattform/bibliothek/kostenlose-e-book-pdf/scalping-ea-scalper',
        bodyDe: `## Zwei Welten

Die anderen Lernpfade in ScanLogic (Finanzfluss-ETFs, Finanztip, Kindersparen) zielen auf **langfristigen Vermögensaufbau** mit Streuung und Disziplin.

Scalping zielt auf **kurzfristige Kurswetten** mit Zeitdruck, Technik und oft Hebel.

| | Langfrist-ETF | Scalping |
| --- | --- | --- |
| Zeitaufwand | niedrig | sehr hoch |
| typisches Risiko | Marktschwankung | Hebel + Timing + Kosten |
| Lernziel hier | Vermögen aufbauen | Risiken verstehen |

Viele Menschen brauchen **kein** Scalping, um finanziell voranzukommen.

> Bildung — keine Karriereberatung als Trader.`,
        bodyEn: `## Two worlds

ScanLogic’s other paths (Finanzfluss ETFs, Finanztip, kids savings) aim at **long-term wealth** with diversification and discipline.

Scalping aims at **short-term price bets** with time pressure, tooling, and often leverage.

| | Long-term ETF | Scalping |
| --- | --- | --- |
| Time cost | Low | Very high |
| Typical risk | Market swings | Leverage + timing + costs |
| Goal here | Build wealth | Understand risks |

Most people do **not** need scalping to make financial progress.

> Education — not career advice as a trader.`,
        keyPointsDe: [
          'Vermögensaufbau und Scalping sind unterschiedliche Ziele.',
          'Zeit- und Stresskosten beim Scalping sind hoch.',
          'Erst Grundlagen (andere Kurse), dann ggf. Trading-Risiken.',
        ],
        keyPointsEn: [
          'Wealth building and scalping are different goals.',
          'Scalping’s time and stress costs are high.',
          'Learn foundations (other courses) before trading risk literacy.',
        ],
      },
    ],
  },
  {
    id: 'trading-tools',
    number: 2,
    icon: 'Gauge',
    titleDe: 'Werkzeuge & Orders (Überblick)',
    titleEn: 'Tools & orders (overview)',
    blurbDe: 'Was E-Books mit „Geheimwaffe“, Kursen und Orders meinen — ohne Setup-Anleitung.',
    blurbEn: 'What ebooks mean by “secret weapon”, quotes, and orders — without a setup guide.',
    lessons: [
      {
        id: 'tr-tools',
        titleDe: 'Vorbereitung & Werkzeuge',
        titleEn: 'Preparation & tools',
        minutes: 4,
        sourcePath:
          '/de-de/trading-plattform/bibliothek/kostenlose-e-book-pdf/scalping-ea-scalper',
        bodyDe: `## Was Scalper-Material oft betont

Öffentliche Einführungen (z. B. WH SelfInvest „Der Scalper“) sprechen von:

- **Vorbereitung** — Regeln, bevor der Markt öffnet
- **Werkzeugen** — Chartplattform, schnelle Ordererfassung, zuverlässige Kurse
- **Markt „lesen“** — Orderflow / Kursbewegung in kurzen Timeframes

Die „Geheimwaffe“ in Marketing-Texten ist selten magisch: meist Disziplin, Timing und Technik — und selbst dann verlieren viele Konten Geld.

### Realistisch

Ohne Demo-Übung, schriftliche Regeln und **risikofähiges** Kapital ist Live-Scalping Glücksspiel mit Spreadsheet.

> Keine Tool-Empfehlung. Kein Scalping-Setup.`,
        bodyEn: `## What scalper materials often stress

Public intros (e.g. WH SelfInvest “The Scalper”) talk about:

- **Preparation** — rules before the open
- **Tools** — charting, fast order entry, reliable quotes
- **“Reading” the market** — short-timeframe price action / order flow

The “secret weapon” in marketing copy is rarely magic: usually discipline, timing, and tech — and even then many accounts lose money.

### Be realistic

Without demo practice, written rules, and capital you can **afford to lose**, live scalping is gambling with a spreadsheet.

> Not a tool recommendation. Not a scalping setup.`,
        keyPointsDe: [
          'Vorbereitung und Regeln vor dem ersten Live-Trade.',
          'Technik ersetzt kein Risikomanagement.',
          'Marketing-„Geheimwaffen“ skeptisch lesen.',
        ],
        keyPointsEn: [
          'Preparation and rules before the first live trade.',
          'Tech does not replace risk management.',
          'Read marketing “secret weapons” skeptically.',
        ],
      },
      {
        id: 'tr-quotes-orders',
        titleDe: 'Kurse & Orders fehlerfrei verstehen',
        titleEn: 'Understanding quotes & orders',
        minutes: 5,
        sourcePath:
          '/de-de/trading-plattform/bibliothek/kostenlose-e-book-pdf/scalping-ea-scalper',
        bodyDe: `## Kurse

Scalper brauchen **aktuelle, korrekte Kurse** (Bid/Ask). Der Spread ist die erste Hürde: jeder Roundtrip kostet.

### Order-Typen (Bildung)

| Order | Idee |
| --- | --- |
| Market | sofort zum nächsten verfügbaren Kurs |
| Limit | nur zu einem gewünschten oder besseren Kurs |
| Stop / Stop-Limit | Auslöser bei Kursniveau (Absicherung oder Einstieg) |

Fehlerhafte Orders (falsche Größe, falsches Instrument, fehlender Stop) sind eine häufige Verlustquelle — besonders unter Stress.

Vertiefung zu konkreten Plattform-Klicks: Anbieter-E-Book / Demo — nicht hier als Anleitung.

> Keine Order-Empfehlung.`,
        bodyEn: `## Quotes

Scalpers need **current, correct quotes** (bid/ask). The spread is the first hurdle: every round-trip costs.

### Order types (education)

| Order | Idea |
| --- | --- |
| Market | fill now at the next available price |
| Limit | only at a chosen or better price |
| Stop / stop-limit | trigger at a level (exit or entry) |

Bad orders (wrong size, wrong instrument, missing stop) are a common loss source — especially under stress.

For platform click-paths: provider ebook / demo — not taught as a playbook here.

> Not an order recommendation.`,
        keyPointsDe: [
          'Spread ist Kosten — besonders beim Scalping.',
          'Order-Typen kennen, bevor Kapital riskiert wird.',
          'Stress erhöht Fehlerrate.',
        ],
        keyPointsEn: [
          'Spread is a cost — especially in scalping.',
          'Know order types before risking capital.',
          'Stress raises error rates.',
        ],
      },
      {
        id: 'tr-analysis',
        titleDe: 'Marktanalyse in kurzen Timeframes',
        titleEn: 'Short-timeframe market analysis',
        minutes: 4,
        sourcePath:
          '/de-de/trading-plattform/bibliothek/kostenlose-e-book-pdf/scalping-ea-scalper',
        bodyDe: `## Was „den Markt analysieren“ hier meint

Bei Scalping geht es oft um **Intraday-Struktur**: Volatilität, Session-Zeiten, Liquidität, engste Chart-Intervalle.

E-Books nennen manchmal benannte Setups (z. B. „T-Line“ oder „KPL“-Scalping). Das sind **Anbieter-/Autorenmethoden** — keine Garantie und hier **nicht** als Handlungsanweisung abgebildet.

### Merksatz

Chartmuster ohne Risiko-, Kosten- und Psychologie-Rahmen sind Unterhaltung, kein Plan.

Wenn du solche Stile studieren willst: Demo, kleines Risiko, schriftliches Journal — und akzeptiere, dass die meisten Retail-Trader verlieren.

> Keine Strategie-Rezepte (T-Line/KPL o. Ä.).`,
        bodyEn: `## What “analyzing the market” means here

Scalping often focuses on **intraday structure**: volatility, session times, liquidity, the tightest chart intervals.

Ebooks sometimes name setups (e.g. “T-Line” or “KPL” scalping). Those are **vendor/author methods** — not guarantees, and **not** reproduced here as instructions.

### Takeaway

Chart patterns without risk, cost, and psychology frameworks are entertainment, not a plan.

If you study such styles: demo, tiny risk, written journal — and accept that most retail traders lose.

> No strategy recipes (T-Line/KPL etc.).`,
        keyPointsDe: [
          'Kurze Timeframes ≠ sichere Signale.',
          'Benannte Setups sind Autorenmethoden, keine Garantie.',
          'Ohne Risk-Framework bleibt Analyse Spekulation.',
        ],
        keyPointsEn: [
          'Short timeframes ≠ safe signals.',
          'Named setups are author methods, not guarantees.',
          'Without a risk framework, analysis stays speculation.',
        ],
      },
    ],
  },
  {
    id: 'trading-risk',
    number: 3,
    icon: 'ShieldAlert',
    titleDe: 'Risiko, Kosten, Psyche',
    titleEn: 'Risk, cost, psychology',
    blurbDe: 'Warum die meisten verlieren — und welche Regeln vor dem Konto zählen.',
    blurbEn: 'Why most lose — and which rules matter before funding an account.',
    lessons: [
      {
        id: 'tr-costs-leverage',
        titleDe: 'Kosten, Hebel & Verluststatistik',
        titleEn: 'Costs, leverage & loss statistics',
        minutes: 5,
        sourcePath:
          '/de-de/trading-plattform/bibliothek/kostenlose-e-book-pdf/scalping-ea-scalper',
        bodyDe: `## Die unangenehme Wahrheit

- Bei **CFDs** verlieren laut Pflichtangaben vieler Anbieter **die Mehrheit** der Kleinanlegerkonten Geld (Beispiel WH SelfInvest: 76 %).
- **Hebel** vergrößert Verluste; Margin-Calls und Totalverlust sind real.
- Scalping multipliziert **Transaktionskosten** (Spread, Kommission, Slippage).

### Vor dem Live-Konto

1. Nur Kapital, dessen Verlust dich nicht ruinieren darf
2. Risiko pro Trade begrenzen (feste Regel)
3. Hebel bewusst niedrig halten oder meiden
4. Demo ≠ echte Emotionen — trotzdem üben

Vergangene Ergebnisse / Backtests garantieren keine Zukunft.

> Keine Handelsempfehlung.`,
        bodyEn: `## The uncomfortable truth

- For **CFDs**, provider disclosures show **most** retail accounts lose money (WH SelfInvest example: 76%).
- **Leverage** magnifies losses; margin calls and wipeouts are real.
- Scalping multiplies **transaction costs** (spread, commission, slippage).

### Before going live

1. Only capital whose loss must not ruin you
2. Cap risk per trade (hard rule)
3. Keep leverage low or avoid it
4. Demo ≠ real emotions — still practice

Past results / backtests do not guarantee the future.

> Not trading advice.`,
        keyPointsDe: [
          'Mehrheit der CFD-Retail-Konten verliert.',
          'Hebel und Kosten sind der stille Gegner.',
          'Kapitalgrenzen vor Strategie-Fantasie.',
        ],
        keyPointsEn: [
          'Most CFD retail accounts lose.',
          'Leverage and costs are the silent opponent.',
          'Capital limits before strategy fantasy.',
        ],
      },
      {
        id: 'tr-psychology',
        titleDe: 'Psychologie & Disziplin',
        titleEn: 'Psychology & discipline',
        minutes: 4,
        sourcePath:
          '/de-de/trading-plattform/bibliothek/kostenlose-e-book-pdf/scalping-ea-scalper',
        bodyDe: `## Typische Fallen

- Revenge Trading nach Verlusten
- Positionsgröße erhöhen „um es wieder reinzuholen“
- Übertrading aus Langeweile
- Regeln im Live-Markt vergessen

E-Books betonen oft Regeln — zu Recht. Ohne schriftlichen Plan und Stopp-Kriterien (Tagesverlustlimit, Pause nach X Verlusten) ist Scalping emotionale Achterbahn.

### Alternative für die meisten Nutzer dieser App

Langfristige ETF-/Sparplan-Pfade in **Finanz-Bildung** — weniger Drama, historisch für Privatanleger oft sinnvoller.

> Keine Therapie, keine Handelsempfehlung.`,
        bodyEn: `## Common traps

- Revenge trading after losses
- Sizing up “to make it back”
- Overtrading from boredom
- Forgetting rules live

Ebooks often stress rules — for good reason. Without a written plan and stop criteria (daily loss limit, pause after X losses), scalping is an emotional rollercoaster.

### Alternative for most users of this app

Long-term ETF / savings-plan paths in **Finance education** — less drama, often more suitable for private investors historically.

> Not therapy, not trading advice.`,
        keyPointsDe: [
          'Emotionen zerstören mehr Konten als „fehlende Indikatoren“.',
          'Tagesverlustlimit schriftlich festlegen.',
          'ETF-Pfade bleiben für viele die bessere Passung.',
        ],
        keyPointsEn: [
          'Emotions wreck more accounts than “missing indicators”.',
          'Write a daily loss limit.',
          'ETF paths remain the better fit for many people.',
        ],
      },
      {
        id: 'tr-checklist',
        titleDe: 'Checkliste vor dem Einstieg',
        titleEn: 'Checklist before you start',
        minutes: 3,
        sourcePath: WH_LIBRARY_URL,
        bodyDe: `## Bevor du ein Trading-Konto finanzierst

1. Risikohinweise zu CFD/Futures gelesen und verstanden?
2. Verlust des Einsatzes finanziell und emotional verkraftbar?
3. Schriftliche Regeln (Größe, Stop, Tageslimit)?
4. Demo geübt — nicht nur ein Video geschaut?
5. Kostenmodell (Spread/Kommission) gerechnet?
6. Klar: Scalping ist **kein** Ersatz für Notgroschen/Altersvorsorge?

Vertiefung: kostenloses E-Book „Der Scalper“ und weitere Bibliothekstitel bei [WH SelfInvest](https://www.whselfinvest.de/de-de/trading-plattform/bibliothek/kostenlose-e-book-pdf/scalping-ea-scalper) — kritisch lesen, nicht als Garantie behandeln.

> Bildung endet hier. Trading-Entscheidung trägst du allein.`,
        bodyEn: `## Before you fund a trading account

1. Read and understood CFD/futures risk warnings?
2. Can you afford the loss financially and emotionally?
3. Written rules (size, stop, daily limit)?
4. Practiced on demo — not only watched a video?
5. Calculated the cost model (spread/commission)?
6. Clear: scalping is **not** a substitute for emergency fund/retirement?

Deep dive: free “The Scalper” ebook and library titles at [WH SelfInvest](https://www.whselfinvest.de/de-de/trading-plattform/bibliothek/kostenlose-e-book-pdf/scalping-ea-scalper) — read critically, not as a guarantee.

> Education ends here. Any trading decision is yours alone.`,
        keyPointsDe: [
          'Checkliste vor Einzahlung.',
          'E-Books kritisch, nicht als Heilsversprechen lesen.',
          'Langfrist-Investieren bleibt der Kern von ScanLogic-Bildung.',
        ],
        keyPointsEn: [
          'Checklist before depositing.',
          'Read ebooks critically, not as gospel.',
          'Long-term investing remains the core of ScanLogic education.',
        ],
      },
    ],
  },
]
