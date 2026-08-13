/**
 * ScanLogic family / kids investing education — original summaries structured
 * after public ETF4Kids Kindersparen themes
 * (https://www.etf4kids.com/de/blog/etf-sparplan-kinder-deutschland and related guides).
 * Educational only; not a product ranking or advisory pitch.
 */

export const ETF4KIDS_HUB_URL = 'https://www.etf4kids.com/de/blog/etf-sparplan-kinder-deutschland'
export const ETF4KIDS_TOP10_URL = 'https://start.etf4kids.com/top10-child-savings-plan/'

export const KIDS_COURSE = {
  id: 'etf4kids-family',
  storageKey: 'scanlogic_kids_edu_progress',
  sourceBase: 'https://www.etf4kids.com',
  handbookUrl: ETF4KIDS_HUB_URL,
  icon: 'Baby',
  titleDe: 'Kindersparen & Familie',
  titleEn: 'Kids savings & family',
  taglineDe:
    'ETF-Sparplan für Kinder, Kinderdepot vs. Eltern-Depot, Steuern, Risiken und Haushaltsstruktur — Themen aus dem ETF4Kids-Leitfaden.',
  taglineEn:
    'ETF savings plans for kids, junior vs parent accounts, tax, risks, and household structure — themes from the ETF4Kids guide.',
  deepenDe: 'Vertiefen auf etf4kids.com',
  deepenEn: 'Go deeper on etf4kids.com',
  externalDe: 'ETF4Kids Leitfaden & Top-10 Kindersparen',
  externalEn: 'ETF4Kids guide & top-10 child savings',
  creditDe:
    'Inhalte sind eigenständige ScanLogic-Kurzfassungen zu öffentlichen Kindersparen-Themen. Ausführliche Ratgeber und Beratungsangebote findest du bei ETF4Kids. Keine Anlage-, Steuer- oder Rechtsberatung — keine Produktempfehlung.',
  creditEn:
    'Lessons are original ScanLogic summaries of public kids-savings themes. Full guides and advisory offers live on ETF4Kids. Not investment, tax, or legal advice — no product recommendation.',
}

export const KIDS_CHAPTERS = [
  {
    id: 'kids-basics',
    number: 1,
    icon: 'Baby',
    titleDe: 'Grundlagen Kindersparen',
    titleEn: 'Kids savings basics',
    blurbDe: 'Was ein ETF-Sparplan für Kinder ist — und warum der Horizont zählt.',
    blurbEn: 'What a kids ETF savings plan is — and why horizon matters.',
    lessons: [
      {
        id: 'kids-what',
        titleDe: 'Was ist ein ETF-Sparplan für Kinder?',
        titleEn: 'What is an ETF savings plan for kids?',
        minutes: 4,
        sourcePath: '/de/blog/etf-sparplan-kinder-deutschland',
        bodyDe: `## Kurz erklärt

Ein **ETF-Sparplan für Kinder** heißt: du investierst regelmäßig (z. B. monatlich) in breite Indexfonds — oft über 15–18+ Jahre. Die Strategie ist der Sparplan; das Konto/Depot ist die Hülle.

### Typische Bausteine

| Baustein | Rolle |
| --- | --- |
| Feste Rate | z. B. 25 / 50 / 100 € im Monat |
| Breite ETFs | Welt / Industrieländer (+ ggf. EM) |
| Automatisierung | Lastschrift / Broker-Sparplan |
| Langer Horizont | Zinseszins braucht Zeit |

Ziel ist selten „schnell reich“, sondern **verlässlicher Aufbau** bis Ausbildung, Startkapital oder Absicherung.

> Bildungsinhalt, keine Produktempfehlung.`,
        bodyEn: `## In short

A **kids ETF savings plan** means investing regularly (e.g. monthly) into broad index funds — often over 15–18+ years. The plan is the strategy; the brokerage account is the wrapper.

### Typical pieces

| Piece | Role |
| --- | --- |
| Fixed amount | e.g. €25 / €50 / €100 per month |
| Broad ETFs | world / developed (+ optional EM) |
| Automation | direct debit / broker plan |
| Long horizon | compounding needs time |

The goal is rarely “get rich quick”, but **reliable building** toward education, a start nest egg, or security.

> Educational only — not a product recommendation.`,
        keyPointsDe: [
          'Sparplan = Strategie, Depot = Struktur.',
          'Regelmäßigkeit schlägt Timing-Stress.',
          'Langer Horizont ist der Hauptvorteil.',
        ],
        keyPointsEn: [
          'Plan = strategy, account = structure.',
          'Consistency beats timing stress.',
          'Long horizon is the main advantage.',
        ],
      },
      {
        id: 'kids-why-etf',
        titleDe: 'Warum viele Eltern ETFs wählen',
        titleEn: 'Why many parents choose ETFs',
        minutes: 4,
        sourcePath: '/de/blog/etf-sparplan-kinder-deutschland',
        bodyDe: `## Vorteile im Überblick

1. **Diversifikation** — hunderte/tausende Unternehmen statt Einzelaktien-Roulette
2. **Wachstumschancen** — globale Aktienmärkte über lange Zeiträume historisch positiv (keine Garantie)
3. **Flexibilität** — Rate erhöhen, senken oder pausieren
4. **Kosten** — oft günstiger als aktiv gemanagte „Kinderprodukte“ mit hohen Gebühren

### Merksatz

Vergleiche nicht nur „Kindersparbuch vs. ETF“, sondern **Gesamtkosten + Horizont + Risikoakzeptanz**.

> Vergangene Marktrenditen sind keine Zukunftsgarantie.`,
        bodyEn: `## Upsides at a glance

1. **Diversification** — hundreds/thousands of companies instead of stock-picking
2. **Growth potential** — global equities historically positive over long periods (no guarantee)
3. **Flexibility** — raise, cut, or pause the contribution
4. **Cost** — often cheaper than high-fee “kids products”

### Takeaway

Do not only compare “kids savings account vs ETF” — compare **total cost + horizon + risk tolerance**.

> Past market returns are not a future guarantee.`,
        keyPointsDe: [
          'Breite streuen statt Einzelwetten.',
          'Flexibilität der Rate ist familienfreundlich.',
          'Gebühren über 18 Jahre summieren sich.',
        ],
        keyPointsEn: [
          'Diversify instead of single bets.',
          'Flexible contributions fit family life.',
          'Fees compound over 18 years too.',
        ],
      },
      {
        id: 'kids-how-much',
        titleDe: 'Wie viel monatlich sparen?',
        titleEn: 'How much to save monthly?',
        minutes: 4,
        sourcePath: '/de/blog/wie-viel-monatlich-fuer-kind-sparen',
        bodyDe: `## Es gibt keine Universalzahl

Die „richtige“ Rate hängt von Einkommen, Fixkosten, eigenen Notgroschen/Altersvorsorge und dem Ziel fürs Kind ab.

### Orientierung (nicht Vorschrift)

| Situation | Tendenz |
| --- | --- |
| Enges Budget | lieber klein starten (z. B. 25 €) als gar nicht |
| Stabiler Haushalt | 50–100 € oft üblich |
| Großeltern helfen | Paten-Sparplan + klare Regeln |

### Reihenfolge in der Familie

1. eigener Notgroschen / hochverzinsliche Schulden
2. eigene Absicherung (Haftpflicht, ggf. BU)
3. dann Kindersparplan — sonst finanzierst du das Kind mit dem Dispo

Kleine Beträge über viele Jahre wirken stärker als große Versprechen ohne Durchhaltevermögen.

> Bildungsinhalt, keine Finanzplanung.`,
        bodyEn: `## There is no universal number

The “right” amount depends on income, fixed costs, your own emergency fund/retirement, and the goal for the child.

### Orientation (not a rule)

| Situation | Tendency |
| --- | --- |
| Tight budget | start small (e.g. €25) rather than zero |
| Stable household | €50–100 is common |
| Grandparents help | gift plan + clear rules |

### Family order of operations

1. your emergency fund / high-interest debt
2. your protection (liability, maybe disability)
3. then the kids plan — otherwise you fund the child via overdraft

Small amounts over many years beat big promises without consistency.

> Educational only — not financial planning.`,
        keyPointsDe: [
          'Eltern-Finanzen zuerst stabilisieren.',
          'Klein starten schlägt Aufschieben.',
          'Ziel und Budget bestimmen die Rate.',
        ],
        keyPointsEn: [
          'Stabilize parent finances first.',
          'Starting small beats delaying.',
          'Goal and budget set the amount.',
        ],
      },
    ],
  },
  {
    id: 'kids-structure',
    number: 2,
    icon: 'Layers',
    titleDe: 'Struktur: Depot, Steuern, Zugriff',
    titleEn: 'Structure: account, tax, access',
    blurbDe: 'Kinderdepot vs. Eltern-Depot, Freibeträge und Volljährigkeit.',
    blurbEn: 'Junior vs parent account, allowances, and turning 18.',
    lessons: [
      {
        id: 'kids-depot-vs-plan',
        titleDe: 'Kinderdepot vs. ETF-Sparplan',
        titleEn: 'Junior account vs ETF savings plan',
        minutes: 5,
        sourcePath: '/de/blog/kinderdepot-oder-etf-sparplan',
        bodyDe: `## Zwei verschiedene Dinge

| Begriff | Bedeutung |
| --- | --- |
| **ETF-Sparplan** | die Anlagestrategie (regelmäßig ETFs kaufen) |
| **Kinderdepot / Junior-Depot** | Depot **auf den Namen des Kindes** |

Du kannst ETFs auch auf dem **Eltern-Depot** besparen und intern „fürs Kind“ markieren — rechtlich gehört das Geld dann den Eltern.

### Typische Abwägung

**Kinderdepot**

- ggf. kindliche Freibeträge nutzbar
- ab 18 gehört das Vermögen dem Kind (Zugriff)

**Eltern-Depot (eingeplant fürs Kind)**

- mehr Kontrolle über Timing der Übergabe
- steuerlich oft auf Eltern bezogen

Welche Struktur passt, hängt von Steuer, Familie und Vertrauen ab — Einzelfall.

> Keine Steuer- oder Rechtsberatung.`,
        bodyEn: `## Two different things

| Term | Meaning |
| --- | --- |
| **ETF savings plan** | the investment strategy (buy ETFs regularly) |
| **Junior / kids brokerage** | account **in the child’s name** |

You can also run ETFs in a **parent account** and earmark them “for the child” — legally the assets then belong to the parents.

### Typical trade-off

**Junior account**

- may use child tax allowances
- at 18 the child owns/accesses the assets

**Parent account (earmarked)**

- more control over when to hand over money
- tax usually sits with the parents

Which structure fits depends on tax, family, and trust — case by case.

> Not tax or legal advice.`,
        keyPointsDe: [
          'Strategie und Depotstruktur trennen.',
          'Kinderdepot = Vermögen des Kindes ab 18.',
          'Kontrolle vs. Steuerwirkung abwägen.',
        ],
        keyPointsEn: [
          'Separate strategy from account structure.',
          'Junior account = child’s assets at 18.',
          'Weigh control vs. tax effects.',
        ],
      },
      {
        id: 'kids-tax',
        titleDe: 'Steuern beim Kindersparen (Überblick)',
        titleEn: 'Tax on kids investing (overview)',
        minutes: 5,
        sourcePath: '/de/blog/kinderinvestments-steuern',
        bodyDe: `## Was Eltern oft prüfen

Wenn Anlagen **auf den Namen des Kindes** laufen, können u. a. relevant sein:

- **Sparerpauschbetrag** des Kindes
- ggf. Zusammenspiel mit dem **Grundfreibetrag**
- Melde-/Grenzfragen, wenn Erträge steigen
- Schenkung / Zuwendungen der Eltern (Freigrenzen)

Läuft alles über die Eltern, greifen typischerweise deren steuerliche Regeln (Freistellungsauftrag usw.).

### Praxis

Broker/Steuersoftware helfen — ersetzen aber keinen Steuerberater bei knappen Grenzen oder komplexen Familienkonstellationen.

> Keine Steuerberatung. Regeln ändern sich.`,
        bodyEn: `## What parents often check

If investments run **in the child’s name**, relevant items can include:

- the child’s **investment tax allowance**
- interaction with the **basic tax-free allowance**
- reporting/thresholds when income grows
- gifts from parents (allowance limits)

If everything sits with the parents, their tax rules usually apply (allowance forms, etc.).

### Practice

Brokers/tax software help — they do not replace a tax advisor near thresholds or in complex family setups.

> Not tax advice. Rules change.`,
        keyPointsDe: [
          'Name des Inhabers entscheidet mit über die Steuer.',
          'Freibeträge kennen, Grenzen beobachten.',
          'Bei Unsicherheit Steuerberatung fragen.',
        ],
        keyPointsEn: [
          'Whose name is on the account affects tax.',
          'Know allowances; watch thresholds.',
          'Ask a tax advisor when unsure.',
        ],
      },
      {
        id: 'kids-access',
        titleDe: 'Risiken: Märkte & Zugriff ab 18',
        titleEn: 'Risks: markets & access at 18',
        minutes: 4,
        sourcePath: '/de/blog/etf-sparplan-kinder-deutschland',
        bodyDe: `## Zwei Risiko-Ebenen

### 1. Marktrisiko

Aktien-ETFs schwanken. Über 15–20 Jahre historisch oft erholt — **keine Garantie**. Geld, das in 2–3 Jahren gebraucht wird, gehört eher nicht zu 100 % in Aktien.

### 2. Zugriffsrisiko

Liegt das Depot auf den Namen des Kindes, kann das Kind mit Volljährigkeit **selbst verfügen**. Ob das zum Familienplan passt, solltest du vor der Eröffnung klären — nicht erst mit 17.

### Kommunikation

Viele Familien sprechen früh über Ziele (Ausbildung, Führerschein, Startwohnung) und Grenzen — das reduziert Konflikte später.

> Bildungsinhalt, keine Rechtsberatung.`,
        bodyEn: `## Two risk layers

### 1. Market risk

Equity ETFs swing. Over 15–20 years they have often recovered historically — **no guarantee**. Money needed in 2–3 years rarely belongs 100% in stocks.

### 2. Access risk

If the account is in the child’s name, at adulthood the child can **control the assets**. Decide whether that fits your family plan before opening — not at age 17.

### Communication

Many families talk early about goals (education, license, first flat) and boundaries — that reduces conflict later.

> Educational only — not legal advice.`,
        keyPointsDe: [
          'Kurzfristiger Bedarf ≠ Aktienquote 100 %.',
          'Volljährigkeit = Zugriff beim Kinderdepot.',
          'Ziele und Regeln früh besprechen.',
        ],
        keyPointsEn: [
          'Near-term needs ≠ 100% equities.',
          'Adulthood = access on a junior account.',
          'Discuss goals and rules early.',
        ],
      },
    ],
  },
  {
    id: 'kids-quality',
    number: 3,
    icon: 'ListChecks',
    titleDe: 'Qualität: ETF & Broker wählen',
    titleEn: 'Quality: picking ETFs & brokers',
    blurbDe: 'Worauf Top-Listen achten — ohne Verkaufsrangliste zu kopieren.',
    blurbEn: 'What “top 10” lists usually check — without copying a sales ranking.',
    lessons: [
      {
        id: 'kids-etf-criteria',
        titleDe: 'Auswahlkriterien für Kinder-ETFs',
        titleEn: 'Selection criteria for kids ETFs',
        minutes: 5,
        sourcePath: '/de/blog/etf-portfolio-fuer-kinder',
        bodyDe: `## Checkliste (Bildung)

Viele Vergleiche (auch „Top 10 Kindersparen“) drehen sich um ähnliche Qualitätsfragen:

1. **Breiter Index** — Welt / ACWI / All-World statt Nischen-Thema
2. **Niedrige TER** — Kosten über 18 Jahre summieren sich
3. **Tracking Difference** — wie gut der ETF den Index wirklich trifft
4. **Fondsvolumen** — zu kleine Fonds können geschlossen werden
5. **Replikation** — physisch / Sampling vs. Swap verstehen
6. **Thesaurierend vs. ausschüttend** — oft thesaurierend für Aufbau
7. **Sparplanfähigkeit** beim gewählten Broker

Kein einzelnes Kriterium ersetzt den Gesamteindruck. Vergangene Performance ist keine Garantie.

> Keine ETF-Empfehlung / keine Rangliste.`,
        bodyEn: `## Checklist (education)

Many comparisons (including “top 10 kids savings” pages) circle the same quality questions:

1. **Broad index** — world / ACWI / All-World over niche themes
2. **Low TER** — costs compound over 18 years
3. **Tracking difference** — how cleanly the ETF follows the index
4. **Fund size** — tiny funds may close
5. **Replication** — understand physical / sampling vs swap
6. **Accumulating vs distributing** — accumulating is common for building
7. **Plan eligibility** at your chosen broker

No single metric replaces the full picture. Past performance is not a guarantee.

> Not an ETF recommendation / not a ranking.`,
        keyPointsDe: [
          'Breite + Kosten + Volumen zuerst.',
          'Themen-ETFs für den Kern meist unnötig.',
          'Broker-Sparplankosten mitrechnen.',
        ],
        keyPointsEn: [
          'Breadth + cost + size first.',
          'Theme ETFs are usually unnecessary as the core.',
          'Include broker plan fees in the math.',
        ],
      },
      {
        id: 'kids-broker',
        titleDe: 'Kinderdepot / Broker vergleichen',
        titleEn: 'Comparing junior brokers',
        minutes: 4,
        sourcePath: ETF4KIDS_TOP10_URL,
        bodyDe: `## Worauf Vergleiche schauen

Beim Broker/Kinderdepot zählen oft:

| Kriterium | Warum |
| --- | --- |
| Depotgebühr | 0 € ist Standard — prüfen |
| Sparplankosten | 0 € vs. Prozent / Fixbetrag |
| Mindesttrate | 1 € vs. 25 € |
| ETF-Auswahl | genug weltweite UCITS-ETFs? |
| Eröffnung | Ausweise, Geburtsurkunde, beide Eltern? |
| Service | Support, wenn etwas hakt |

### Merksatz

Der „Testsieger“ eines Portals ist keine Garantie für **deine** Familie — Konditionen und Angebot ändern sich.

Externe Übersichten (z. B. ETF4Kids Top-10-Seiten) können Impulse geben; entscheide anhand aktueller Konditionen und deiner Struktur.

> Keine Broker-Empfehlung.`,
        bodyEn: `## What comparisons look at

For junior brokers, lists often weigh:

| Criterion | Why |
| --- | --- |
| Account fee | €0 is common — verify |
| Plan fee | €0 vs % / flat fee |
| Minimum contribution | €1 vs €25 |
| ETF range | enough global UCITS ETFs? |
| Onboarding | IDs, birth certificate, both parents? |
| Support | help when something breaks |

### Takeaway

A site’s “winner” is not a guarantee for **your** family — fees and product lists change.

External overviews (e.g. ETF4Kids top-10 pages) can spark ideas; decide on current terms and your structure.

> Not a broker recommendation.`,
        keyPointsDe: [
          'Sparplankosten über Jahre zählen.',
          'Eröffnungsaufwand einplanen.',
          'Aktuelle Konditionen selbst prüfen.',
        ],
        keyPointsEn: [
          'Plan fees matter over years.',
          'Budget onboarding effort.',
          'Verify current terms yourself.',
        ],
      },
    ],
  },
  {
    id: 'kids-family',
    number: 4,
    icon: 'Home',
    titleDe: 'Familie zuerst: Struktur & Haushalt',
    titleEn: 'Family first: structure & household',
    blurbDe: 'Warum Produktwahl allein selten reicht — Absicherung und Fixkosten.',
    blurbEn: 'Why product choice alone rarely works — protection and fixed costs.',
    lessons: [
      {
        id: 'kids-structure-first',
        titleDe: 'Struktur schlägt Einzelprodukt',
        titleEn: 'Structure beats a single product',
        minutes: 4,
        sourcePath: '/de/blog/etf-sparplan-kinder-deutschland',
        bodyDe: `## Ganzheitlich denken

Langfristiger Erfolg beim Kindersparen hängt oft weniger vom „einen ETF“ ab als von:

- Haushaltsbudget & Fixkosten
- Absicherung der Eltern (Existenzrisiken)
- klarer Sparstrategie (Automatisierung)
- steuerlicher / rechtlicher Hülle
- eigenen Altersvorsorge der Eltern

Ein Kindersparplan auf wackligen Eltern-Finanzen ist fragil. Erst Stabilität, dann Optimierung.

> Bildungsinhalt — kein Beratungsverkauf.`,
        bodyEn: `## Think in systems

Long-term kids-savings success often depends less on “the one ETF” than on:

- household budget & fixed costs
- parent protection (existential risks)
- a clear automated savings strategy
- tax / legal wrapper
- the parents’ own retirement plan

A kids plan on shaky parent finances is fragile. Stability first, optimization second.

> Educational only — not an advisory pitch.`,
        keyPointsDe: [
          'Eltern-Stabilität vor Kinder-Optimierung.',
          'Automatisierung + Budget schlagen Produkt-Hype.',
          'Mehrere Bausteine zusammendenken.',
        ],
        keyPointsEn: [
          'Parent stability before kids optimization.',
          'Automation + budget beat product hype.',
          'Think in connected building blocks.',
        ],
      },
      {
        id: 'kids-household',
        titleDe: 'Haushaltsoptimierung als Hebel',
        titleEn: 'Household optimization as a lever',
        minutes: 3,
        sourcePath: '/de/blog/haushaltsoptimierung-familien',
        bodyDe: `## Mehr Sparrate ohne Gehaltserhöhung

Oft finanzierst du den Kindersparplan am einfachsten, indem du **unnötige Fixkosten** senkst: Energie, Versicherungen ohne Nutzen, Abos, teure Altverträge.

Freigewordene 20–50 €/Monat → Dauerauftrag in den ETF-Sparplan.

Das ist unspektakulär — und über 18 Jahre sehr wirksam.

> Bildungsinhalt, keine Wechselberatung.`,
        bodyEn: `## More contribution without a raise

Often the easiest way to fund a kids plan is cutting **useless fixed costs**: energy, useless insurance, subscriptions, expensive legacy contracts.

Freed €20–50/month → standing order into the ETF plan.

Unspectacular — and very powerful over 18 years.

> Educational only — not switching advice.`,
        keyPointsDe: [
          'Fixkosten-Killers füttern den Sparplan.',
          'Kleine Monatsbeträge × Jahre = Wirkung.',
          'Jährlicher Haushalts-Check reicht oft.',
        ],
        keyPointsEn: [
          'Fixed-cost cuts feed the plan.',
          'Small monthly amounts × years = impact.',
          'A yearly household review is often enough.',
        ],
      },
      {
        id: 'kids-next',
        titleDe: 'Nächste Schritte (Checkliste)',
        titleEn: 'Next steps (checklist)',
        minutes: 3,
        sourcePath: '/de/blog/kindersparen-deutschland',
        bodyDe: `## Praktische Reihenfolge

1. Notgroschen & teure Schulden der Eltern klären
2. Existenzabsicherung prüfen (Haftpflicht, ggf. BU)
3. Ziel fürs Kind formulieren (Horizont, Betragsrahmen)
4. Struktur wählen: Kinderdepot vs. Eltern-Depot
5. ETF-Kriterien + Broker-Kosten vergleichen
6. Sparplan starten und **einmal im Jahr** reviewen
7. Bei Steuer-/Rechtsfragen Fachleute einbeziehen

Vertiefung: ETF4Kids-Blog & Top-10-Übersichten — immer aktuelle Konditionen selbst prüfen.

In ScanLogic zusätzlich: **ETF-Bildung** (Finanzfluss) und **Finanztip Bildung** für die Erwachsenen-Grundlagen.

> Keine Beratung, keine Produktempfehlung.`,
        bodyEn: `## Practical order

1. Fix parent emergency fund & expensive debt
2. Check existential cover (liability, maybe disability)
3. Define the goal for the child (horizon, budget range)
4. Choose structure: junior vs parent account
5. Compare ETF criteria + broker fees
6. Start the plan and **review yearly**
7. Involve professionals for tax/legal questions

Deep dives: ETF4Kids blog & top-10 overviews — always verify current terms yourself.

In ScanLogic also use **ETF Education** (Finanzfluss) and **Finanztip Education** for adult fundamentals.

> Not advice, not a product recommendation.`,
        keyPointsDe: [
          'Checkliste schlägt Impulskauf.',
          'Jährliches Review einplanen.',
          'Externe Rankings nur als Impuls nutzen.',
        ],
        keyPointsEn: [
          'A checklist beats impulse buying.',
          'Schedule a yearly review.',
          'Treat external rankings as sparks only.',
        ],
      },
    ],
  },
]
