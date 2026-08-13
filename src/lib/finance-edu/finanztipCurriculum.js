/**
 * ScanLogic personal-finance education — original summaries structured after
 * Finanztip book themes (https://www.finanztip.de/buch/).
 * Not a reprint of the books. Educational only; deep dives link to Finanztip.
 */

export const FINANZTIP_BOOKS_URL = 'https://www.finanztip.de/buch/'

export const FINANZTIP_COURSE = {
  id: 'finanztip-books',
  storageKey: 'scanlogic_finanztip_edu_progress',
  sourceBase: 'https://www.finanztip.de',
  handbookUrl: FINANZTIP_BOOKS_URL,
  icon: 'Library',
  titleDe: 'Finanztip Bildung',
  titleEn: 'Finanztip Education',
  taglineDe:
    'Kurzlektionen nach den Finanztip-Büchern „Finanzen ganz einfach“ und „Finanzen ab 50“ — kompakt, unabhängig gedacht, umsetzbar.',
  taglineEn:
    'Short lessons after the Finanztip books “Finanzen ganz einfach” and “Finanzen ab 50” — compact, consumer-first, actionable.',
  deepenDe: 'Vertiefen auf finanztip.de',
  deepenEn: 'Go deeper on finanztip.de',
  externalDe: 'Finanztip Bücher & Ratgeber auf finanztip.de',
  externalEn: 'Finanztip books & guides on finanztip.de',
  creditDe:
    'Inhalte sind eigenständige ScanLogic-Kurzfassungen zu öffentlichen Finanztip-Buchthemen. Ausführliche Ratgeber und die Bücher selbst findest du bei Finanztip. Keine Anlage-, Steuer- oder Rechtsberatung.',
  creditEn:
    'Lessons are original ScanLogic summaries of public Finanztip book themes. Full guides and the books live on Finanztip. Not investment, tax, or legal advice.',
}

export const FINANZTIP_CHAPTERS = [
  {
    id: 'einfach-prinzip',
    number: 1,
    icon: 'Layers',
    titleDe: 'Finanzen ganz einfach — Prinzip',
    titleEn: 'Personal finance basics — principle',
    blurbDe: 'Weniger ist mehr: Finanzen strukturieren statt Produkte sammeln.',
    blurbEn: 'Less is more: structure money instead of collecting products.',
    lessons: [
      {
        id: 'ft-prinzip',
        titleDe: 'Das Finanztip-Prinzip (Vier Töpfe)',
        titleEn: 'The Finanztip principle (four buckets)',
        minutes: 5,
        sourcePath: '/buch/finanzenganzeinfach/',
        bodyDe: `## Kurz erklärt

Viele Finanzprobleme entstehen durch **zu viele** Konten, Verträge und „Beraterprodukte“. Ein einfaches Prinzip hilft: wenige klare **Töpfe** und automatisierte Geldflüsse.

### Typische Töpfe (Idee)

| Topf | Zweck |
| --- | --- |
| Alltag | Girokonto für laufende Ausgaben |
| Sicherheit | Notgroschen / kurzfristige Ziele (z. B. Tagesgeld) |
| Zukunft | langfristiger Vermögensaufbau (z. B. ETF-Sparplan) |
| Optional | große Wünsche / Extra — nur wenn die ersten drei stehen |

### Automatisieren

1. Gehalt → Giro
2. Dauerauftrag → Sicherheitstopf
3. Sparplan → Zukunftstopf

So entscheidest du **einmal**, nicht jeden Monat neu.

> Bildungsinhalt, keine Anlageberatung. Die Bücher von Finanztip vertiefen das Prinzip.`,
        bodyEn: `## In short

Many money problems come from **too many** accounts, contracts, and sales-driven products. A simple principle helps: a few clear **buckets** and automated cash flows.

### Typical buckets (idea)

| Bucket | Purpose |
| --- | --- |
| Day-to-day | Checking account for living costs |
| Safety | Emergency fund / short-term goals (e.g. call money) |
| Future | Long-term investing (e.g. ETF savings plan) |
| Optional | Big wants / extras — only after the first three are solid |

### Automate

1. Pay → checking
2. Standing order → safety bucket
3. Savings plan → future bucket

You decide **once**, not every month.

> Educational only — not investment advice. Finanztip’s books expand this principle.`,
        keyPointsDe: [
          'Wenige Töpfe schlagen Produktchaos.',
          'Automatisierung schlägt Willenskraft.',
          'Zukunftstopf erst nach Notgroschen ernsthaft füllen.',
        ],
        keyPointsEn: [
          'Few buckets beat product clutter.',
          'Automation beats willpower.',
          'Fund the future bucket seriously only after the emergency fund.',
        ],
      },
      {
        id: 'ft-notgroschen',
        titleDe: 'Notgroschen & nie wieder Dispo',
        titleEn: 'Emergency fund & leave the overdraft',
        minutes: 4,
        sourcePath: '/tagesgeld/',
        bodyDe: `## Kurz erklärt

Ein **Notgroschen** hält dich aus dem Dispo und verhindert Panikverkäufe aus dem Depot.

### Praxis-Orientierung

- oft **2–6 Monatsausgaben** als Richtwert (je nach Job-Sicherheit und Verpflichtungen)
- parken auf einem **sicheren, verfügbaren** Konto (z. B. Tagesgeld) — nicht in Einzelaktien
- Dispo-Zinsen sind teuer: erst Schulden-/Dispo-Falle stopfen, dann investieren

### Merksatz

Liquidität zuerst, Rendite danach — sonst finanzierst du Notfälle mit dem teuersten Kredit.

> Bildungsinhalt, keine Produktempfehlung.`,
        bodyEn: `## In short

An **emergency fund** keeps you out of expensive overdrafts and prevents panic-selling investments.

### Practical orientation

- often **2–6 months of expenses** as a rule of thumb (depends on job security and obligations)
- park it in a **safe, accessible** account (e.g. call money) — not in single stocks
- overdraft interest is expensive: fix that trap before investing

### Takeaway

Liquidity first, return second — otherwise emergencies become your costliest loan.

> Educational only — not a product recommendation.`,
        keyPointsDe: [
          'Notgroschen vor Aktien-ETFs.',
          'Dispo ist meist der teuerste „Kredit“.',
          'Verfügbarkeit zählt mehr als Maximalzins.',
        ],
        keyPointsEn: [
          'Emergency cash before equity ETFs.',
          'Overdraft is often your costliest “loan”.',
          'Access matters more than the top rate.',
        ],
      },
      {
        id: 'ft-schulden',
        titleDe: 'Gute vs. schlechte Schulden',
        titleEn: 'Good vs. bad debt',
        minutes: 4,
        sourcePath: '/ratenkredit/',
        bodyDe: `## Kurz erklärt

Nicht jede Schuld ist gleich. Entscheidend sind **Zins, Zweck und Alternativen**.

### Grobe Einordnung

| Tendenz „teuer / riskant“ | Tendenz „planbarer“ |
| --- | --- |
| Dispo, Kreditkarte auf Raten, Konsumkredite für Lifestyle | günstige Immobilienfinanzierung mit Tragfähigkeit |
| Restschuldversicherungen „mitverkauft“ | Umschuldung teurer Kredite in klar kalkulierbare Raten |

### Reihenfolge (oft sinnvoll)

1. Hochzins-Schulden abbauen
2. Notgroschen aufbauen
3. langfristig investieren / vorsorgen

> Bildungsinhalt, keine Kreditberatung.`,
        bodyEn: `## In short

Not all debt is equal. What matters is **rate, purpose, and alternatives**.

### Rough guide

| Often costly / risky | Often more plannable |
| --- | --- |
| Overdraft, revolving card debt, lifestyle loans | Affordable mortgage with realistic payments |
| Add-on payment protection sold at the desk | Refinancing expensive loans into clear installments |

### Common order

1. Kill high-interest debt
2. Build the emergency fund
3. Invest / save for the long term

> Educational only — not credit advice.`,
        keyPointsDe: [
          'Zins und Zweck trennen „gute“ von „schlechten“ Schulden.',
          'Teure Konsumkredite zuerst.',
          'Umschulden nur mit klarer Gesamtrechnung.',
        ],
        keyPointsEn: [
          'Rate and purpose separate “good” from “bad” debt.',
          'Attack expensive consumer debt first.',
          'Refinance only with a clear total math.',
        ],
      },
    ],
  },
  {
    id: 'einfach-schutz',
    number: 2,
    icon: 'Shield',
    titleDe: 'Finanzen ganz einfach — Absichern',
    titleEn: 'Personal finance basics — protection',
    blurbDe: 'Welche Versicherungen wirklich zählen — und was oft überflüssig ist.',
    blurbEn: 'Which insurance actually matters — and what is often noise.',
    lessons: [
      {
        id: 'ft-versicherungen',
        titleDe: 'Versicherungen: brauchen vs. verzichten',
        titleEn: 'Insurance: need vs. skip',
        minutes: 5,
        sourcePath: '/haftpflichtversicherung/',
        bodyDe: `## Kurz erklärt

Versicherung soll **Existenzrisiken** abfedern — nicht jedes kleine Ärgernis.

### Oft zentral

- **Privathaftpflicht** — Schäden an Dritten können existenzbedrohend sein
- **Berufsunfähigkeit** (je nach Beruf/Situation) — Absicherung der Arbeitskraft
- **Krankenversicherung** — Pflicht, aber Tarif/Status prüfen
- bei Immobilien: Gebäude / Elementar je nach Lage

### Oft hinterfragen

Handy-, Brillen-, Einzelgerät- oder teure Kombi-Pakete ohne klaren Nutzen; teure Zusatzbausteine „mitverkauft“.

### Merksatz

Erst Risiken priorisieren, dann Policen — nicht umgekehrt.

> Bildungsinhalt, keine Versicherungsberatung.`,
        bodyEn: `## In short

Insurance should cover **existential risks** — not every minor annoyance.

### Often central

- **Personal liability** — third-party damage can be life-changing
- **Disability cover** (depends on job/situation) — protect earning power
- **Health insurance** — mandatory, but check status/tariff
- for property: buildings / natural hazard cover depending on location

### Often question

Phone, glasses, single-device, or pricey combo packs with weak value; expensive add-ons sold at the desk.

### Takeaway

Prioritize risks first, then policies — not the other way around.

> Educational only — not insurance advice.`,
        keyPointsDe: [
          'Existenzrisiken vor Komfort-Policen.',
          'Haftpflicht ist für die meisten zentral.',
          'Mitverkaufte Zusätze skeptisch prüfen.',
        ],
        keyPointsEn: [
          'Existential risks before comfort policies.',
          'Liability cover is central for most people.',
          'Be skeptical of add-ons sold at the desk.',
        ],
      },
      {
        id: 'ft-vertraege',
        titleDe: 'Verträge & laufende Kosten prüfen',
        titleEn: 'Review contracts & recurring costs',
        minutes: 3,
        sourcePath: '/stromanbieter-wechseln/',
        bodyDe: `## Kurz erklärt

Mehr investieren geht oft leichter, wenn **weniger** unnötig abfließt: Strom, Gas, Mobilfunk, Abos, Kontoführungsgebühren, teure Altverträge.

### Mini-Check (1× im Jahr)

1. Alle Lastschriften / Abos listen
2. kündigen oder wechseln, was keinen Nutzen hat
3. freigewordenes Geld → Dauerauftrag in Sicherheit / ETF-Sparplan

Kleine Monatsbeträge werden über Jahre zu echtem Vermögen — oder zu echtem Verschleiß.

> Bildungsinhalt, keine Wechselberatung.`,
        bodyEn: `## In short

Investing gets easier when **less** leaks out: energy, mobile, subscriptions, account fees, expensive legacy contracts.

### Mini check (once a year)

1. List all direct debits / subscriptions
2. Cancel or switch what you do not use
3. Route freed cash → standing order to safety / ETF plan

Small monthly amounts become real wealth — or real waste — over years.

> Educational only — not switching advice.`,
        keyPointsDe: [
          'Kostenkillers finanzieren den Sparplan.',
          'Jährlicher Vertrags-Check reicht oft.',
          'Freies Geld sofort automatisieren.',
        ],
        keyPointsEn: [
          'Cost cuts fund the savings plan.',
          'A yearly contract review is often enough.',
          'Automate freed cash immediately.',
        ],
      },
    ],
  },
  {
    id: 'einfach-vermoegen',
    number: 3,
    icon: 'TrendingUp',
    titleDe: 'Finanzen ganz einfach — Vermögen',
    titleEn: 'Personal finance basics — wealth',
    blurbDe: 'ETFs, Immobilie ja/nein und alternative Anlagen einordnen.',
    blurbEn: 'ETFs, buy-vs-rent, and putting alternative assets in context.',
    lessons: [
      {
        id: 'ft-etf',
        titleDe: 'Langsam reich werden mit ETFs',
        titleEn: 'Getting rich slowly with ETFs',
        minutes: 5,
        sourcePath: '/indexfonds-etf/',
        bodyDe: `## Kurz erklärt

Für den **Zukunftstopf** setzen viele auf breite **Aktien-ETFs** + monatlichen Sparplan: einfach, streuend, kostengünstig.

### Grundregeln (Bildung)

- langer Horizont, Schwankungen aushalten
- breit streuen (Welt / Industrieländer+EM)
- Kosten (TER, Depot, Spreads) im Blick
- nicht mit Geld spekulieren, das du bald brauchst

Vertiefung zu Indizes, Risiken und Auswahl findest du auch in der ScanLogic **ETF-Bildung** (Finanzfluss-Struktur).

> Bildungsinhalt, keine Kaufempfehlung.`,
        bodyEn: `## In short

For the **future bucket**, many people use broad **equity ETFs** + a monthly plan: simple, diversified, low-cost.

### Ground rules (education)

- long horizon, tolerate volatility
- diversify broadly (world / developed+EM)
- watch costs (TER, broker, spreads)
- do not invest money you need soon

For indexes, risks, and selection, also see ScanLogic **ETF Education** (Finanzfluss structure).

> Educational only — not a buy recommendation.`,
        keyPointsDe: [
          'Sparplan + Breite schlägt Timing-Stress.',
          'Kosten und Horizont entscheiden mit.',
          'Notgroschen bleibt getrennt vom Depot.',
        ],
        keyPointsEn: [
          'Plan + breadth beats timing stress.',
          'Costs and horizon matter.',
          'Keep the emergency fund separate from the portfolio.',
        ],
      },
      {
        id: 'ft-immobilie',
        titleDe: 'Kaufen oder mieten?',
        titleEn: 'Buy or rent?',
        minutes: 5,
        sourcePath: '/mieten-oder-kaufen/',
        bodyDe: `## Kurz erklärt

Immobilie ist **Lebensentscheidung + Finanzprodukt**. „Miete ist rausgeworfenes Geld“ ist zu simpel.

### Fragen vor dem Kauf

- Wie lange bleibe ich voraussichtlich?
- Eigenkapital, Nebenkosten, Modernisierung, Rücklagen?
- Rate + Lebenshaltung noch tragbar bei Zins-/Einkommensstress?
- Alternative: mieten + parallel ETF-Sparplan — oft unterschätzt

### Merksatz

Rechne ehrlich (inkl. Instandhaltung) und plane Puffer — Emotion allein ist ein teurer Berater.

> Bildungsinhalt, keine Immobilienberatung.`,
        bodyEn: `## In short

Housing is a **life choice + financial product**. “Rent is wasted money” is too simplistic.

### Questions before buying

- How long will I likely stay?
- Equity, closing costs, renovations, reserves?
- Is the payment + living costs still viable under rate/income stress?
- Alternative: rent + invest in parallel — often underestimated

### Takeaway

Do honest math (including maintenance) and keep buffers — emotion alone is an expensive advisor.

> Educational only — not property advice.`,
        keyPointsDe: [
          'Kaufnebenkosten und Instandhaltung mitrechnen.',
          'Tragfähigkeit wichtiger als Maximalobjekt.',
          'Mieten + Investieren kann eine valide Strategie sein.',
        ],
        keyPointsEn: [
          'Include closing costs and maintenance.',
          'Affordability beats the dream object.',
          'Renting + investing can be a valid strategy.',
        ],
      },
      {
        id: 'ft-alternativen',
        titleDe: 'Aktien, Gold, Krypto & Co. einordnen',
        titleEn: 'Stocks, gold, crypto & co. in context',
        minutes: 4,
        sourcePath: '/gold/',
        bodyDe: `## Kurz erklärt

Neben dem Kernportfolio tauchen oft **Einzelaktien, Gold, Krypto, klassische Rentenversicherungen** auf. Einordnen statt dem Hype folgen.

### Faustbild

| Thema | Typische Rolle |
| --- | --- |
| Breite ETFs | Kern für langfristigen Aufbau |
| Einzelaktien | spekulativer Satellit — nur mit Geld, das wegkann |
| Gold | eher Diversifikation / Krisennarrativ, keine „Renditemaschine“ |
| Krypto | hochvolatil — klar als Risiko kennzeichnen |
| teure Garantieprodukte | Kosten und Flexibilität prüfen |

Kern solide, Satelliten klein halten — wenn überhaupt.

> Bildungsinhalt, keine Anlageempfehlung.`,
        bodyEn: `## In short

Beside a core portfolio you will hear about **single stocks, gold, crypto, traditional annuity products**. Contextualize instead of chasing hype.

### Rough map

| Topic | Typical role |
| --- | --- |
| Broad ETFs | Core for long-term building |
| Single stocks | Speculative satellite — only with money you can lose |
| Gold | Diversifier / crisis narrative, not a return engine |
| Crypto | Highly volatile — label as risk |
| Pricey guarantee products | Scrutinize costs and flexibility |

Keep the core solid and satellites small — if any.

> Educational only — not investment advice.`,
        keyPointsDe: [
          'Kernportfolio vor Satelliten.',
          'Hype ≠ Plan.',
          'Kosten und Volatilität ehrlich benennen.',
        ],
        keyPointsEn: [
          'Core portfolio before satellites.',
          'Hype ≠ a plan.',
          'Name costs and volatility honestly.',
        ],
      },
    ],
  },
  {
    id: 'ab50',
    number: 4,
    icon: 'Clock',
    titleDe: 'Finanzen ab 50',
    titleEn: 'Finances after 50',
    blurbDe: 'Kassensturz, Rente, Entnahme, Versicherungen und Nachlass.',
    blurbEn: 'Cash check, pension, withdrawals, insurance, and estate basics.',
    lessons: [
      {
        id: 'ft50-kassensturz',
        titleDe: 'Kassensturz: Was ist da — was brauche ich?',
        titleEn: 'Cash check: what you have vs. what you need',
        minutes: 4,
        sourcePath: '/buch/',
        bodyDe: `## Kurz erklärt

Ab der zweiten Lebenshälfte zählt ein klarer **Ist-Soll-Abgleich**: Vermögen, Schulden, gewünschter Lebensstil, Restlaufzeit bis/im Ruhestand.

### Mini-Inventur

1. Konten, Depot, Immobilie (realistisch), Versicherungen mit Rückkaufswert
2. Kredite / Restschulden
3. monatlicher Bedarf heute vs. im Ruhestand
4. Lücke oder Puffer sichtbar machen

Ohne Inventur bleiben Tipps zu Rente, ETF und Immobilie Spekulation.

> Bildungsinhalt, keine Finanzplanung.`,
        bodyEn: `## In short

Later in life, start with a clear **have vs. need** check: assets, debts, desired lifestyle, time to/in retirement.

### Mini inventory

1. Accounts, portfolio, property (realistic), cash-value insurance
2. Loans / remaining debt
3. Monthly spend today vs. in retirement
4. Make the gap or buffer visible

Without an inventory, pension/ETF/housing tips stay guesswork.

> Educational only — not financial planning.`,
        keyPointsDe: [
          'Zahlen vor Produktentscheidungen.',
          'Lebensstil-Wunsch ehrlich beziffern.',
          'Schulden und Vermögen gemeinsam betrachten.',
        ],
        keyPointsEn: [
          'Numbers before product decisions.',
          'Price your desired lifestyle honestly.',
          'View debts and assets together.',
        ],
      },
      {
        id: 'ft50-rente',
        titleDe: 'Rente & Vorsorge ab 50',
        titleEn: 'Pension & provision after 50',
        minutes: 5,
        sourcePath: '/altersvorsorge/',
        bodyDe: `## Kurz erklärt

Themen wie **Renteninformation**, mögliche Zuzahlungen / Lücken schließen, Weiterarbeiten und neue Rahmen (z. B. Aktivrente-Diskussionen) werden wichtiger.

### Was du klären solltest

- Wie hoch ist die erwartete gesetzliche Rente (Brutto/Netto grob)?
- Welche betrieblichen / privaten Bausteine existieren wirklich?
- Lohnt sich freiwilliges Auffüllen — oder eher freies Depot? (Einzelfall)

Steuer- und Sozialversicherungsdetails ändern sich — bei Unsicherheit Rentenversicherung / Steuerberatung fragen.

> Keine Renten- oder Steuerberatung.`,
        bodyEn: `## In short

Topics like your **pension statement**, possible voluntary top-ups, working longer, and newer frameworks matter more.

### Clarify

- Expected statutory pension (gross/net roughly)?
- Which occupational / private pieces actually exist?
- Is topping up worth it — or a flexible portfolio? (case-by-case)

Tax and social-security rules change — ask official/pension advisors when unsure.

> Not pension or tax advice.`,
        keyPointsDe: [
          'Renteninformation lesen und verstehen.',
          'Bausteine inventarisieren, bevor du neu abschließt.',
          'Einzelfall: Zuzahlung vs. freies Investieren.',
        ],
        keyPointsEn: [
          'Read and understand your pension statement.',
          'Inventory existing pieces before buying new ones.',
          'Case-by-case: top-ups vs. flexible investing.',
        ],
      },
      {
        id: 'ft50-entnahme',
        titleDe: 'Entnahmestrategie & Investieren ab 50',
        titleEn: 'Withdrawal strategy & investing after 50',
        minutes: 5,
        sourcePath: '/auszahlplan/',
        bodyDe: `## Kurz erklärt

Es ist oft **nicht zu spät** zu investieren — aber der Mix aus Sicherheit und Wachstum wird kritischer. Später kommt die Frage: Wie **entspare** ich Depot oder Immobilie, ohne zu früh leer zu sein?

### Denkrahmen

- Aktienanteil an Horizont und Nerven anpassen (nicht an „Tipps“)
- Entnahmeplanung: Bedarf, Inflation, Langlebigkeit, Steuern
- Immobilie: Wohnen bleiben, Teilverkauf, Vermietung, Verkauf — Vor- und Nachteile

Ein schriftlicher Plan hilft gegen Angstverkäufe und gegen zu großzügiges Ausgeben in guten Jahren.

> Bildungsinhalt, keine Entnahmeempfehlung.`,
        bodyEn: `## In short

It is often **not too late** to invest — but the mix of safety and growth gets more critical. Later comes: how do I **draw down** a portfolio or property without running out early?

### Thinking frame

- Match equity share to horizon and temperament (not to hot tips)
- Withdrawal plan: needs, inflation, longevity, taxes
- Property: stay, partial sale, rent, sell — trade-offs

A written plan helps against panic sales and overspending in good years.

> Educational only — not a withdrawal recommendation.`,
        keyPointsDe: [
          'Investieren ab 50 kann sinnvoll bleiben.',
          'Entnahme braucht Plan gegen Langlebigkeitsrisiko.',
          'Immobilie ist Wohn- und Vermögensfrage zugleich.',
        ],
        keyPointsEn: [
          'Investing after 50 can still make sense.',
          'Withdrawals need a plan against longevity risk.',
          'Housing is both a home and an asset question.',
        ],
      },
      {
        id: 'ft50-erbe',
        titleDe: 'Versicherungs-Check & Nachlass',
        titleEn: 'Insurance check & estate basics',
        minutes: 4,
        sourcePath: '/testament/',
        bodyDe: `## Kurz erklärt

Ab 50 lohnt ein **Versicherungs-Hausputz** (was noch nötig ist) und eine grobe **Nachlassordnung**, damit Angehörige nicht im Chaos landen.

### Checkliste

- Policen kündigen/anpassen, die Risiken nicht mehr decken
- Krankenversicherung im Alter: Kosten und Status verstehen
- Vollmachten, Patientenverfügung, Testament — Form und Aktualität
- Übersicht: Konten, Depot, Verträge, digitale Zugänge

Rechtliche Gestaltung ist Einzelfall — Notar/Anwalt bei Bedarf.

> Keine Rechtsberatung.`,
        bodyEn: `## In short

After 50, do an **insurance tidy-up** (what still matters) and a basic **estate setup** so relatives are not left in chaos.

### Checklist

- Cancel/adjust policies that no longer match your risks
- Understand health-insurance costs/status later in life
- Powers of attorney, living will, will — form and freshness
- Inventory: accounts, portfolio, contracts, digital access

Legal design is case-specific — use a notary/lawyer when needed.

> Not legal advice.`,
        keyPointsDe: [
          'Unnötige Policen streichen, nötige behalten.',
          'Vorsorgedokumente aktuell halten.',
          'Vermögensübersicht für Angehörige hinterlegen.',
        ],
        keyPointsEn: [
          'Drop useless policies; keep necessary ones.',
          'Keep advance documents current.',
          'Leave an asset overview for relatives.',
        ],
      },
    ],
  },
]
