/**
 * ScanLogic ETF education — original summaries structured after the public
 * Finanzfluss ETF Handbuch chapter map (https://www.finanzfluss.de/etf-handbuch/).
 * Content is educational only; not investment advice. Deep dives link out.
 */

export const ETF_HANDBOOK_URL = 'https://www.finanzfluss.de/etf-handbuch/'

export const ETF_COURSE = {
  id: 'finanzfluss-etf',
  storageKey: 'scanlogic_etf_edu_progress',
  sourceBase: 'https://www.finanzfluss.de',
  handbookUrl: ETF_HANDBOOK_URL,
  icon: 'GraduationCap',
  titleDe: 'ETF-Bildung',
  titleEn: 'ETF Education',
  taglineDe: 'Kurzlektionen zum Vermögensaufbau mit ETFs — strukturiert nach dem Finanzfluss ETF-Handbuch.',
  taglineEn: 'Short lessons on building wealth with ETFs — structured after the Finanzfluss ETF handbook.',
  deepenDe: 'Vertiefen im Finanzfluss ETF-Handbuch',
  deepenEn: 'Go deeper in the Finanzfluss ETF handbook',
  externalDe: 'Vollständiges Handbuch auf finanzfluss.de',
  externalEn: 'Full handbook on finanzfluss.de',
  creditDe:
    'Inhalte sind eigenständige ScanLogic-Kurzfassungen. Ausführliche Ratgeber und Rechner findest du beim verlinkten Finanzfluss ETF-Handbuch. Keine Anlageberatung.',
  creditEn:
    'Lessons are original ScanLogic summaries. Full guides and tools live on the linked Finanzfluss ETF handbook. Not investment advice.',
}

export const ETF_CHAPTERS = [
  {
    id: 'theory',
    number: 1,
    icon: 'BookOpen',
    titleDe: 'Theorie',
    titleEn: 'Theory',
    blurbDe: 'Indizes, ETFs und warum passives Investieren oft sinnvoll ist.',
    blurbEn: 'Indexes, ETFs, and why passive investing often makes sense.',
    lessons: [
      {
        id: 'index',
        titleDe: 'Was ist ein Index?',
        titleEn: 'What is an index?',
        minutes: 4,
        sourcePath: '/etf-handbuch/aktienindex/',
        bodyDe: `## Kurz erklärt

Ein **Aktienindex** fasst die Kursentwicklung vieler Unternehmen zu einer Kennzahl zusammen — wie ein Börsenbarometer für eine Region, Branche oder Größe.

### Wichtige Beispiele

| Index | Fokus |
| --- | --- |
| DAX | 40 große deutsche Unternehmen |
| S&P 500 | 500 große US-Unternehmen |
| MSCI World | Industrieländer weltweit |
| MSCI Emerging Markets | Schwellenländer |

### Kurs- vs. Performanceindex

- **Kursindex**: nur Kursbewegungen (ohne Dividenden).
- **Performanceindex**: rechnet Dividenden (meist fiktiv reinvestiert) mit ein — der DAX ist typischerweise so gemeint.

### Merksatz

Du kannst nicht „den Index kaufen“. ETFs und Indexfonds **bilden** ihn nach — möglichst genau und günstig.

> Bildungsinhalt, keine Anlageberatung.`,
        bodyEn: `## In short

A **stock index** combines many companies into one figure — a barometer for a region, sector, or size segment.

### Common examples

| Index | Focus |
| --- | --- |
| DAX | 40 large German companies |
| S&P 500 | 500 large US companies |
| MSCI World | Developed markets worldwide |
| MSCI Emerging Markets | Emerging markets |

### Price vs. total-return indexes

- **Price index**: price moves only (no dividends).
- **Total-return / performance index**: includes dividends (usually reinvested notionally) — how the DAX is typically quoted.

### Takeaway

You cannot buy “the index” itself. ETFs and index funds **track** it — as closely and cheaply as possible.

> Educational only — not investment advice.`,
        keyPointsDe: [
          'Ein Index ist ein Barometer, kein Produkt zum Direktkauf.',
          'Leitindizes unterscheiden sich stark nach Region und Gewichtung.',
          'Performanceindizes berücksichtigen Dividenden.',
        ],
        keyPointsEn: [
          'An index is a barometer, not something you buy directly.',
          'Benchmark indexes differ a lot by region and weighting.',
          'Total-return indexes include dividends.',
        ],
      },
      {
        id: 'etf',
        titleDe: 'Was sind ETFs?',
        titleEn: 'What are ETFs?',
        minutes: 5,
        sourcePath: '/etf-handbuch/etf/',
        bodyDe: `## Kurz erklärt

**ETF** = Exchange Traded Fund = börsengehandelter Indexfonds. Ein ETF bündelt Anlegergeld und bildet einen Index möglichst genau ab.

### Warum populär?

- **Diversifikation**: mit einem Anteil viele Titel
- **Kosten**: meist deutlich günstiger als aktiv gemanagte Fonds (TER oft weit unter 1 %)
- **Handel**: während der Börsenzeiten handelbar
- **Sondervermögen**: Fondsvermögen ist rechtlich vom Emittenten getrennt

### Replikation (vereinfacht)

1. **Physisch / Vollreplikation** — Aktien des Index werden gekauft
2. **Sampling** — nur die wichtigsten Titel (bei sehr großen Indizes)
3. **Synthetisch (Swap)** — Indexrendite über Tauschgeschäft

### ETF vs. klassischer Indexfonds

Beide bilden Indizes ab. ETFs handelst du an der Börse flexibel; viele Indexfonds nur einmal täglich über den Anbieter.

> Bildungsinhalt, keine Anlageberatung.`,
        bodyEn: `## In short

**ETF** = Exchange Traded Fund — a listed index fund that pools money and tracks an index as closely as possible.

### Why people use them

- **Diversification**: one share covers many holdings
- **Cost**: usually far cheaper than active funds (TER often well under 1%)
- **Trading**: buy/sell during market hours
- **Segregated assets**: fund assets are legally separate from the issuer

### Replication (simplified)

1. **Physical / full** — buy the index constituents
2. **Sampling** — hold the most influential names (for huge indexes)
3. **Synthetic (swap)** — deliver index return via a swap

### ETF vs. classic index fund

Both track indexes. ETFs trade on exchange; many index funds settle once daily via the provider.

> Educational only — not investment advice.`,
        keyPointsDe: [
          'ETFs bilden Indizes ab — passiv, automatisiert.',
          'Sondervermögen schützt vor Emittenteninsolvenz.',
          'Replikationsmethode beeinflusst Kosten und Risiken.',
        ],
        keyPointsEn: [
          'ETFs track indexes — passively and automatically.',
          'Segregated assets protect against issuer insolvency.',
          'Replication method affects cost and risk profile.',
        ],
      },
      {
        id: 'passive',
        titleDe: 'Passiv investieren',
        titleEn: 'Passive investing',
        minutes: 4,
        sourcePath: '/etf-handbuch/passiv-investieren/',
        bodyDe: `## Kurz erklärt

**Passiv** heißt: du setzt auf die Marktrendite (den Index), statt Einzelaktien oder Fondsmanager „schlagen“ zu wollen.

### Typische Bausteine

- **Indexing** — breite Märkte abbilden
- **Buy & Hold** — langfristig halten, wenig handeln
- **Kostenkontrolle** — niedrige TER und Handelskosten

### Aktiv vs. passiv (Praxisblick)

Viele aktive Fonds schaffen es über längere Zeiträume **nicht**, ihren Vergleichsindex nach Kosten zu schlagen. Passive ETFs zielen bewusst nur auf die Marktrendite — dafür mit klaren, niedrigen Kosten.

### Für wen geeignet?

Eher für Menschen mit **langem Horizont**, die Schwankungen aushalten und einen einfachen, wiederholbaren Plan wollen — z. B. monatlicher Sparplan in breite Welt-ETFs.

> Bildungsinhalt, keine Anlageberatung. Vergangene Renditen sind keine Garantie.`,
        bodyEn: `## In short

**Passive** means aiming for market return (the index) instead of trying to beat it with stock picks or active managers.

### Typical building blocks

- **Indexing** — own broad markets
- **Buy & hold** — stay invested, trade rarely
- **Cost control** — low TER and trading fees

### Active vs. passive (practical view)

Over long periods, many active funds fail to beat their benchmark after fees. Passive ETFs deliberately target market return — with transparent, low costs.

### Who it fits

Often people with a **long horizon** who can tolerate volatility and want a simple, repeatable plan — e.g. a monthly savings plan into broad world ETFs.

> Educational only — not investment advice. Past returns are not a guarantee.`,
        keyPointsDe: [
          'Passiv = Marktrendite anstreben, nicht den Markt schlagen.',
          'Kosten und Disziplin sind oft entscheidender als „Tipps“.',
          'Langer Horizont und Sparplan passen gut zusammen.',
        ],
        keyPointsEn: [
          'Passive = capture market return, not beat it.',
          'Costs and discipline often matter more than hot tips.',
          'Long horizon + savings plan are a natural pair.',
        ],
      },
    ],
  },
  {
    id: 'risks',
    number: 2,
    icon: 'ShieldAlert',
    titleDe: 'Risiken',
    titleEn: 'Risks',
    blurbDe: 'Welche Risiken ETFs mitbringen — und wie du sie einordnen kannst.',
    blurbEn: 'What risks ETFs carry — and how to put them in context.',
    lessons: [
      {
        id: 'risks-overview',
        titleDe: 'ETF-Risiken im Überblick',
        titleEn: 'ETF risks at a glance',
        minutes: 5,
        sourcePath: '/etf-handbuch/risiken/',
        bodyDe: `## Kurz erklärt

ETFs streuen Einzelwertrisiken — **Marktrisiko** bleibt. Kurse können stark und lange fallen.

### Wichtige Risikotypen

| Risiko | Bedeutung |
| --- | --- |
| Marktrisiko | Gesamter Markt fällt |
| Währungsrisiko | Fremdwährung schwankt zum Euro |
| Konzentrationsrisiko | wenige Regionen/Branchen dominieren |
| Tracking-Abweichung | ETF weicht vom Index ab |
| Kontrahentenrisiko | vor allem bei Swap-ETFs |
| Liquiditätsrisiko | enge Märkte, große Spreads |

### Realistisch bleiben

- Kurseinbrüche von 30–50 % sind historisch bei Aktienmärkten vorgekommen.
- Ein ETF auf einen engen Sektor kann volatiler sein als ein Welt-ETF.
- „Sicher“ heißt bei Aktien-ETFs nicht „ohne Verlust“.

> Bildungsinhalt, keine Anlageberatung.`,
        bodyEn: `## In short

ETFs diversify single-stock risk — **market risk** remains. Prices can fall hard and stay down for years.

### Key risk types

| Risk | Meaning |
| --- | --- |
| Market risk | The whole market drops |
| Currency risk | FX moves vs. your home currency |
| Concentration | Few regions/sectors dominate |
| Tracking difference | ETF drifts from the index |
| Counterparty | Mainly relevant for swap ETFs |
| Liquidity | Thin markets, wide spreads |

### Stay realistic

- 30–50% drawdowns have happened in equity markets historically.
- A narrow-sector ETF can swing more than a world ETF.
- “Safer than a single stock” is not “risk-free”.

> Educational only — not investment advice.`,
        keyPointsDe: [
          'Diversifikation ersetzt kein Marktrisiko.',
          'Währung und Konzentration oft unterschätzt.',
          'Swap-ETFs haben zusätzliches Kontrahentenrisiko.',
        ],
        keyPointsEn: [
          'Diversification does not remove market risk.',
          'Currency and concentration are often underestimated.',
          'Swap ETFs add counterparty considerations.',
        ],
      },
      {
        id: 'reduce-risks',
        titleDe: 'Risiken reduzieren',
        titleEn: 'Reducing risks',
        minutes: 4,
        sourcePath: '/etf-handbuch/risiken-reduzieren/',
        bodyDe: `## Praktische Hebel (keine Garantie)

1. **Breit streuen** — Welt / viele Regionen statt Einzelaktien oder Nischen-Themen
2. **Zeithorizont** — Geld, das du in 1–3 Jahren brauchst, gehört selten zu 100 % in Aktien-ETFs
3. **Notgroschen zuerst** — Liquiditätspuffer auf dem Konto
4. **Kosten & Qualität** — etablierte, liquide ETFs mit ausreichend Volumen
5. **Sparplan** — regelmäßige Käufe glätten Einstiegszeitpunkte (Cost Averaging)
6. **Ruhe bewahren** — Panikverkäufe in Crashes sind oft der teuerste Fehler

### Risikoprofil

Wie viel Schwankung du aushältst, hängt von Einkommen, Verpflichtungen, Alter und Psyche ab. Ein schriftlicher Plan hilft, in Stressphasen nicht umzuschwenken.

> Bildungsinhalt, keine Anlageberatung.`,
        bodyEn: `## Practical levers (no guarantees)

1. **Diversify broadly** — world / many regions over single stocks or niche themes
2. **Horizon** — money needed in 1–3 years rarely belongs 100% in equity ETFs
3. **Emergency fund first** — cash buffer before investing
4. **Cost & quality** — established, liquid ETFs with adequate AUM
5. **Savings plan** — regular buys smooth entry timing (cost averaging)
6. **Stay calm** — panic selling in crashes is often the costliest mistake

### Risk profile

How much volatility you can bear depends on income, obligations, age, and temperament. A written plan helps you avoid knee-jerk changes under stress.

> Educational only — not investment advice.`,
        keyPointsDe: [
          'Breite Streuung + langer Horizont sind die größten Hebel.',
          'Notgroschen vor Aktien-ETFs.',
          'Plan schlägt Bauchgefühl in Crash-Phasen.',
        ],
        keyPointsEn: [
          'Broad diversification + long horizon are the biggest levers.',
          'Emergency cash before equity ETFs.',
          'A written plan beats gut feelings in crashes.',
        ],
      },
    ],
  },
  {
    id: 'strategy',
    number: 3,
    icon: 'PieChart',
    titleDe: 'Strategie & Portfolio',
    titleEn: 'Strategy & portfolio',
    blurbDe: 'Weltportfolio, Gewichtung, Rebalancing und Entnahme.',
    blurbEn: 'World portfolio, weights, rebalancing, and withdrawals.',
    lessons: [
      {
        id: 'world-portfolio',
        titleDe: 'Weltportfolio-Idee',
        titleEn: 'The world-portfolio idea',
        minutes: 5,
        sourcePath: '/etf-handbuch/weltportfolio/',
        bodyDe: `## Kurz erklärt

Ein **Weltportfolio** streut möglichst über die globale Aktienwirtschaft — oft ergänzt um einen **risikärmeren** Anteil (z. B. Anleihen / Tagesgeld), je nach Risikoprofil.

### Typische Logik

- **Risikoteil**: breite Aktien-ETFs (z. B. Industrieländer + Emerging Markets oder ein All-World-ETF)
- **Sicherheitsanteil**: je höher der Bedarf an Stabilität, desto größer
- **Einfachheit**: 1–3 ETFs reichen vielen Anlegern

### Gewichtung

Manche nutzen marktkapitalisierungsgewichtete Welt-ETFs (einfach). Andere mischen bewusst Regionen. Es gibt **kein einzig richtiges** Mischungsverhältnis — nur passende zu Ziel und Risikotoleranz.

### Rebalancing

Wenn Aktien stark steigen, kann der Aktienanteil zu groß werden. **Rebalancing** bringt die Zielgewichte zurück — per Nachkauf oder Umschichtung.

> Bildungsinhalt, keine Anlageberatung.`,
        bodyEn: `## In short

A **world portfolio** aims to own global equity markets — often plus a **safer** sleeve (e.g. bonds / cash) sized to your risk profile.

### Typical logic

- **Risk sleeve**: broad equity ETFs (developed + emerging, or one all-world ETF)
- **Safety sleeve**: larger when you need stability
- **Simplicity**: 1–3 ETFs are enough for many people

### Weighting

Some use market-cap world ETFs (simple). Others tilt regions deliberately. There is **no single correct** mix — only one that fits goals and risk tolerance.

### Rebalancing

If equities rally, the equity share can grow too large. **Rebalancing** restores target weights via new buys or switches.

> Educational only — not investment advice.`,
        keyPointsDe: [
          'Weltweit streuen schlägt Heimatbias oft.',
          'Aktienanteil = Risikohebel Nr. 1.',
          'Rebalancing hält den Plan auf Kurs.',
        ],
        keyPointsEn: [
          'Global diversification often beats home bias.',
          'Equity share is risk lever #1.',
          'Rebalancing keeps the plan on track.',
        ],
      },
      {
        id: 'risk-profile',
        titleDe: 'Risikoprofil & Allokation',
        titleEn: 'Risk profile & allocation',
        minutes: 4,
        sourcePath: '/etf-handbuch/risikoprofil/',
        bodyDe: `## Fragen an dich selbst

- Wann brauche ich das Geld wirklich?
- Wie reagiere ich bei −30 % auf dem Depotauszug?
- Habe ich stabile Einkünfte / Verpflichtungen (Miete, Kinder, Kredite)?
- Ist der Notgroschen gefüllt?

### Grobe Orientierung (nicht Vorschrift)

| Horizont | Tendenz |
| --- | --- |
| &lt; 3 Jahre | eher wenig Aktienanteil |
| 3–10 Jahre | Mischungen möglich |
| &gt; 10 Jahre | höherer Aktienanteil oft denkbar |

Persönlichkeit zählt: Wer bei jedem Dip verkauft, braucht oft **weniger** Risiko als die Theorie „erlaubt“.

> Bildungsinhalt, keine Anlageberatung.`,
        bodyEn: `## Questions for yourself

- When do I truly need this money?
- How do I react to −30% on a statement?
- Are income and obligations stable (rent, kids, loans)?
- Is the emergency fund filled?

### Rough orientation (not a rule)

| Horizon | Tendency |
| --- | --- |
| &lt; 3 years | usually lower equity share |
| 3–10 years | mixes can make sense |
| &gt; 10 years | higher equity share often plausible |

Personality matters: if every dip triggers a sale, you may need **less** risk than theory “allows”.

> Educational only — not investment advice.`,
        keyPointsDe: [
          'Horizont und Nervenstärke bestimmen die Allokation.',
          'Theorie ≠ was du nachts aushältst.',
          'Erst Liquidität, dann Investieren.',
        ],
        keyPointsEn: [
          'Horizon and temperament drive allocation.',
          'Theory ≠ what you can sleep with.',
          'Cash buffer before investing.',
        ],
      },
    ],
  },
  {
    id: 'selection',
    number: 4,
    icon: 'ListChecks',
    titleDe: 'ETF-Auswahl',
    titleEn: 'Choosing ETFs',
    blurbDe: 'TER, Volumen, Factsheet, Ausschüttung und Domizil.',
    blurbEn: 'TER, AUM, factsheets, distributions, and domicile.',
    lessons: [
      {
        id: 'selection-criteria',
        titleDe: 'Auswahlkriterien',
        titleEn: 'Selection criteria',
        minutes: 5,
        sourcePath: '/etf-handbuch/etf-auswahl-kriterien/',
        bodyDe: `## Checkliste vor dem Kauf

1. **Index** — bildet er genau den Markt ab, den du willst?
2. **TER** — jährliche Gesamtkostenquote (niedriger ist meist besser)
3. **Fondsvolumen** — zu kleine Fonds können geschlossen werden
4. **Tracking Difference** — reale Abweichung vom Index über Zeit
5. **Replikation** — physisch / Sampling / Swap
6. **Handelskosten & Spread** — was kostet der Kauf beim Broker?
7. **Factsheet** — offizielle Kurzinfo des Emittenten lesen

### Domizil & Steuern (DE-Kontext)

Viele Anleger achten auf **UCITS**-ETFs und Domizile wie Irland/Luxemburg. Steuerdetails ändern sich — bei Unsicherheit Steuerberater fragen.

> Bildungsinhalt, keine Anlage- oder Steuerberatung.`,
        bodyEn: `## Pre-buy checklist

1. **Index** — does it track the market you want?
2. **TER** — annual total expense ratio (lower is usually better)
3. **AUM / fund size** — tiny funds may close
4. **Tracking difference** — real drift vs. index over time
5. **Replication** — physical / sampling / swap
6. **Trading cost & spread** — what does your broker charge?
7. **Factsheet** — read the issuer’s short summary

### Domicile & tax (Germany context)

Many investors prefer **UCITS** ETFs and domiciles such as Ireland/Luxembourg. Tax rules change — ask a tax advisor when unsure.

> Educational only — not investment or tax advice.`,
        keyPointsDe: [
          'Index zuerst, dann Kosten und Qualität.',
          'Factsheet und Tracking Difference lesen.',
          'Steuerfragen separat klären.',
        ],
        keyPointsEn: [
          'Pick the index first, then cost and quality.',
          'Read the factsheet and tracking difference.',
          'Handle tax questions separately.',
        ],
      },
      {
        id: 'distributing',
        titleDe: 'Ausschüttend oder thesaurierend?',
        titleEn: 'Distributing vs. accumulating',
        minutes: 3,
        sourcePath: '/etf-handbuch/ausschuettend-oder-thesaurierend/',
        bodyDe: `## Unterschied

| Variante | Was passiert mit Dividenden? |
| --- | --- |
| **Thesaurierend** | bleiben im Fonds / werden reinvestiert |
| **Ausschüttend** | fließen (regelmäßig) aufs Verrechnungskonto |

### Praxis

- **Vermögensaufbau**: viele bevorzugen thesaurierend (weniger Aufwand, Zinseszins im Fonds).
- **Cashflow**: ausschüttend, wenn du laufende Erträge nutzen willst.
- Steuerlich können beide Varianten relevant sein (Vorabpauschale etc.) — Details beim Steuerberater.

Beide können denselben Index abbilden; die Wahl ist oft **Präferenz + Steuersituation**, nicht „richtig/falsch“.

> Bildungsinhalt, keine Steuerberatung.`,
        bodyEn: `## Difference

| Style | What happens to dividends? |
| --- | --- |
| **Accumulating** | stay in the fund / get reinvested |
| **Distributing** | paid (periodically) to your cash account |

### Practice

- **Building wealth**: many prefer accumulating (less hassle, compounding inside the fund).
- **Cash flow**: distributing if you want regular income.
- Tax treatment can differ — confirm with a tax advisor.

Both can track the same index; the choice is often **preference + tax situation**, not right vs. wrong.

> Educational only — not tax advice.`,
        keyPointsDe: [
          'Thesaurierend = Dividenden bleiben im Fonds.',
          'Ausschüttend = Cashflow auf dem Konto.',
          'Steuerregeln separat prüfen.',
        ],
        keyPointsEn: [
          'Accumulating keeps dividends in the fund.',
          'Distributing pays cash to your account.',
          'Check tax rules separately.',
        ],
      },
    ],
  },
  {
    id: 'trading',
    number: 5,
    icon: 'Landmark',
    titleDe: 'ETF-Handel',
    titleEn: 'Trading ETFs',
    blurbDe: 'Depot, Sparplan, Einmalanlage und Steuern — die Praxis.',
    blurbEn: 'Brokerage, savings plans, lumpsums, and tax basics.',
    lessons: [
      {
        id: 'depot',
        titleDe: 'Depot wählen & eröffnen',
        titleEn: 'Choosing & opening a brokerage',
        minutes: 4,
        sourcePath: '/etf-handbuch/depot-waehlen/',
        bodyDe: `## Was du brauchst

Ein **Wertpapierdepot** (oft inkl. Verrechnungskonto) beim Broker oder der Bank.

### Vergleichskriterien

- Depot- und Ordergebühren
- Kostenlose / günstige **ETF-Sparpläne**
- Angebot an sparplanfähigen ETFs
- Bedienung (App), Kundenservice, Sicherheit
- Auslandsaktien / Quellensteuer — falls relevant

### Ablauf (typisch)

1. Broker vergleichen
2. Online eröffnen (Identverfahren)
3. Geld einzahlen
4. ETF suchen (ISIN) und kaufen / Sparplan anlegen

> Bildungsinhalt, keine Produktempfehlung.`,
        bodyEn: `## What you need

A **brokerage account** (often with a cash account) at a broker or bank.

### Comparison criteria

- Account and order fees
- Cheap / free **ETF savings plans**
- Range of plan-eligible ETFs
- UX (app), support, security
- Foreign stocks / withholding tax — if relevant

### Typical flow

1. Compare brokers
2. Open online (ID verification)
3. Deposit cash
4. Find the ETF (ISIN) and buy / set up a plan

> Educational only — not a product recommendation.`,
        keyPointsDe: [
          'Sparplankosten oft wichtiger als einmalige Ordergebühren.',
          'ISIN nutzen, um den richtigen ETF zu finden.',
          'Sicherheit und Angebot prüfen.',
        ],
        keyPointsEn: [
          'Plan fees often matter more than one-off order fees.',
          'Use the ISIN to find the right ETF.',
          'Check security and product range.',
        ],
      },
      {
        id: 'sparplan',
        titleDe: 'Sparplan & Einmalanlage',
        titleEn: 'Savings plan & lumpsum',
        minutes: 4,
        sourcePath: '/etf-handbuch/etf-sparplan/',
        bodyDe: `## Zwei Wege — oft kombiniert

| Weg | Idee |
| --- | --- |
| **Sparplan** | fester Betrag monatlich (oder häufiger) |
| **Einmalanlage** | größerer Betrag auf einmal |

### Vorteile Sparplan

- Automatisierung → Disziplin
- Einstieg mit kleinen Beträgen
- glättet Timing-Risiko über die Zeit

### Einmalanlage

Historisch war „so früh wie möglich investieren“ oft vorteilhaft — psychologisch fällt vielen der Sparplan leichter. Beides kann kombiniert werden (z. B. Bonus → Einmal, Gehalt → Sparplan).

> Bildungsinhalt, keine Timing-Empfehlung.`,
        bodyEn: `## Two paths — often combined

| Path | Idea |
| --- | --- |
| **Savings plan** | fixed amount monthly (or more often) |
| **Lumpsum** | invest a larger amount at once |

### Savings-plan upsides

- Automation → discipline
- Start with small amounts
- Smooths timing risk over time

### Lumpsum

Historically, “invest as soon as possible” often won on paper — psychologically, many people prefer a plan. You can combine both (bonus → lumpsum, salary → plan).

> Educational only — not a timing recommendation.`,
        keyPointsDe: [
          'Sparplan = Automatisierung und Disziplin.',
          'Einmalanlage und Sparplan sind kombinierbar.',
          'Kein Timing-Zwang für den Einstieg.',
        ],
        keyPointsEn: [
          'Plans automate discipline.',
          'Lumpsum and plans can combine.',
          'You do not need perfect timing to start.',
        ],
      },
      {
        id: 'taxes',
        titleDe: 'Steuern auf ETFs (Überblick DE)',
        titleEn: 'ETF taxes (Germany overview)',
        minutes: 4,
        sourcePath: '/etf-handbuch/steuern/',
        bodyDe: `## Grober Überblick (Stand-agnostisch)

In Deutschland greifen u. a.:

- **Abgeltungsteuer** auf Kapitalerträge (zzgl. Soli / ggf. KiSt)
- **Freistellungsauftrag** / Sparerpauschbetrag
- bei thesaurierenden Fonds u. a. die **Vorabpauschale**
- Teilfreistellung bei Aktienfonds (vereinfacht)

Broker führen oft Steuer ab — das ersetzt **keine** individuelle Steuerberatung.

Für Selbstständige in ScanLogic: ETF-Privatvermögen und Betriebsausgaben strikt trennen; bei Unklarheit Steuerberater fragen.

> Keine Steuerberatung. Regeln ändern sich.`,
        bodyEn: `## High-level overview (rules change)

In Germany you typically encounter:

- **Flat withholding tax** on investment income (plus solidarity / church tax if applicable)
- **Tax allowance** (Freistellungsauftrag / Sparerpauschbetrag)
- **Vorabpauschale** for some accumulating funds
- Partial exemption rules for equity funds (simplified)

Brokers often withhold tax — that does **not** replace personal tax advice.

For freelancers using ScanLogic: keep private ETF assets separate from business expenses; ask a tax advisor when unsure.

> Not tax advice. Rules change.`,
        keyPointsDe: [
          'Freistellungsauftrag nicht vergessen.',
          'Vorabpauschale bei Thesaurierern kennen.',
          'Privat vs. Betrieb klar trennen.',
        ],
        keyPointsEn: [
          'Remember the tax allowance.',
          'Know Vorabpauschale for accumulators.',
          'Keep private vs. business assets separate.',
        ],
      },
    ],
  },
]

export function getChapter(chapters, chapterId) {
  return chapters.find((c) => c.id === chapterId) || null
}

export function getLesson(chapters, chapterId, lessonId) {
  const chapter = getChapter(chapters, chapterId)
  if (!chapter) return null
  const lesson = chapter.lessons.find((l) => l.id === lessonId)
  if (!lesson) return null
  return { chapter, lesson }
}

export function allLessons(chapters) {
  return chapters.flatMap((c) => c.lessons.map((l) => ({ chapterId: c.id, lesson: l })))
}

export function totalLessonCount(chapters = ETF_CHAPTERS) {
  return allLessons(chapters).length
}

export function sourceUrl(path, base = 'https://www.finanzfluss.de', fallback = ETF_HANDBOOK_URL) {
  if (!path) return fallback
  if (path.startsWith('http')) return path
  return `${base}${path}`
}
