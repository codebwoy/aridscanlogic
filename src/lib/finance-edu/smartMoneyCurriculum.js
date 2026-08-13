/**
 * ScanLogic “Smart Money” / wealth principles education — original summaries
 * structured after public LIQID Smart Money Leitfaden themes
 * (https://www.liqid.de/lp/smg). Educational only — not a wealth-manager pitch.
 */

export const LIQID_SMG_URL = 'https://www.liqid.de/lp/smg'
export const LIQID_HOME_URL = 'https://www.liqid.de/'

export const SMART_MONEY_COURSE = {
  id: 'liqid-smart-money',
  storageKey: 'scanlogic_smart_money_edu_progress',
  sourceBase: 'https://www.liqid.de',
  handbookUrl: LIQID_SMG_URL,
  icon: 'Briefcase',
  titleDe: 'Smart Money & Vermögensprinzipien',
  titleEn: 'Smart money & wealth principles',
  taglineDe:
    'Struktur statt Spekulation, Streuung über Anlageklassen, Disziplin — Themen wie im LIQID Smart Money Leitfaden. Plus: wann DIY-ETFs reichen und wann Verwaltung Sinn ergeben kann.',
  taglineEn:
    'Structure over speculation, multi-asset diversification, discipline — themes like LIQID’s Smart Money guide. Plus: when DIY ETFs suffice and when management can make sense.',
  deepenDe: 'Smart Money Leitfaden bei LIQID',
  deepenEn: 'Smart Money guide at LIQID',
  externalDe: 'LIQID Smart Money Leitfaden (extern)',
  externalEn: 'LIQID Smart Money guide (external)',
  creditDe:
    'Inhalte sind eigenständige ScanLogic-Kurzfassungen zu „Smart Money“-/Vermögensprinzipien. Anbieter-Leitfäden und Konditionen ändern sich. Keine Anlage- oder Vermögensverwaltungsempfehlung.',
  creditEn:
    'Lessons are original ScanLogic summaries of smart-money / wealth principles. Vendor guides and fees change. Not investment or wealth-management advice.',
}

export const SMART_MONEY_CHAPTERS = [
  {
    id: 'sm-principles',
    number: 1,
    icon: 'Briefcase',
    titleDe: 'Smart Money Prinzipien',
    titleEn: 'Smart money principles',
    blurbDe: 'Was institutionelle Logik von Spekulation unterscheidet.',
    blurbEn: 'How institutional logic differs from speculation.',
    lessons: [
      {
        id: 'sm-structure',
        titleDe: 'Strukturiert statt spekulativ',
        titleEn: 'Structured instead of speculative',
        minutes: 4,
        sourcePath: '/lp/smg',
        bodyDe: `## Kurz erklärt

„Smart Money“-Leitfäden (z. B. [LIQID](https://www.liqid.de/lp/smg)) betonen oft: Professionelle Anleger folgen **klaren Prinzipien**, statt auf Marktrauschen und Tipps zu reagieren.

### Praktische Übersetzung

| Spekulativ | Strukturiert |
| --- | --- |
| Hot Tips, Timing, Themes | schriftliche Allokation |
| ständiges Umschichten | Rebalancing nach Plan |
| Hebel / Enge Wetten | breite, langfristige Bausteine |

Struktur heißt: Ziel, Horizont, Risikobudget und Regeln **vor** dem nächsten Headline-Crash festlegen.

> Bildungsinhalt, keine Strategieempfehlung.`,
        bodyEn: `## In short

“Smart money” guides (e.g. [LIQID](https://www.liqid.de/lp/smg)) often stress: professional investors follow **clear principles** instead of reacting to market noise and tips.

### Practical translation

| Speculative | Structured |
| --- | --- |
| Hot tips, timing, themes | Written allocation |
| Constant reshuffling | Rebalancing by plan |
| Leverage / narrow bets | Broad, long-horizon building blocks |

Structure means: set goal, horizon, risk budget, and rules **before** the next headline crash.

> Educational only — not a strategy recommendation.`,
        keyPointsDe: [
          'Prinzipien vor Impulsen.',
          'Schriftlicher Plan schlägt Bauchgefühl.',
          'Rauschen ignorieren ist Teil der Disziplin.',
        ],
        keyPointsEn: [
          'Principles before impulses.',
          'A written plan beats gut feel.',
          'Ignoring noise is part of discipline.',
        ],
      },
      {
        id: 'sm-diversify',
        titleDe: 'Diversifikation über Anlageklassen',
        titleEn: 'Diversification across asset classes',
        minutes: 5,
        sourcePath: '/lp/smg',
        bodyDe: `## Mehr als nur Aktien-ETFs

Viele Retail-Portfolios sind **nur** Aktien. Institutionelle Logik streut oft über:

- Aktien (breit)
- Anleihen / Zinsbausteine
- Cash / Liquidität
- ggf. Immobilien, Rohstoffe, Private Markets (nur mit Verständnis & Zugang)

### Merksatz

Diversifikation senkt Konzentrationsrisiko — sie **eliminiert** Marktrisiko nicht. Korrelationen steigen in Krisen oft.

Für die meisten Einstiege reicht ein einfaches Aktien/Anleihen/Cash-Gerüst; exotische Bausteine sind kein Muss.

> Keine Allokationsempfehlung.`,
        bodyEn: `## More than equity ETFs alone

Many retail portfolios are **only** stocks. Institutional logic often spreads across:

- equities (broad)
- bonds / rate sleeves
- cash / liquidity
- optionally property, commodities, private markets (only with understanding & access)

### Takeaway

Diversification cuts concentration risk — it does **not** erase market risk. Correlations often rise in crises.

For most beginners a simple equity/bond/cash frame is enough; exotic sleeves are optional.

> Not an allocation recommendation.`,
        keyPointsDe: [
          'Anlageklassen streuen, nicht nur Titel.',
          'Einfachheit schlägt Komplexität ohne Mehrwert.',
          'Private Markets ≠ Pflicht für Privatanleger.',
        ],
        keyPointsEn: [
          'Diversify asset classes, not only tickers.',
          'Simplicity beats complexity without edge.',
          'Private markets ≠ mandatory for retail.',
        ],
      },
      {
        id: 'sm-discipline',
        titleDe: 'Rendite durch Disziplin',
        titleEn: 'Returns through discipline',
        minutes: 4,
        sourcePath: '/lp/smg',
        bodyDe: `## Langfrist-Prinzip

Kurzfristige Schwankungen aushalten und den Plan **konsequent** anwenden — das ist der Kern vieler Smart-Money-Botschaften.

### Disziplin in der Praxis

1. Spar-/Investitionsrate automatisieren
2. Rebalancing-Kalender (z. B. jährlich)
3. keine Panikverkäufe bei −20 %
4. Kosten und Steuern nicht ignorieren

Disziplin ersetzt keine ausreichende Risikotoleranz: Wer nachts nicht schlafen kann, braucht oft **weniger** Aktienanteil — nicht mehr Tipps.

> Vergangene Renditen sind keine Garantie.`,
        bodyEn: `## Long-horizon principle

Tolerate short-term swings and apply the plan **consistently** — the core of many smart-money messages.

### Discipline in practice

1. Automate contributions
2. Rebalancing calendar (e.g. yearly)
3. no panic selling at −20%
4. do not ignore costs and taxes

Discipline does not replace risk tolerance: if you cannot sleep, you often need **less** equity — not more tips.

> Past returns are not a guarantee.`,
        keyPointsDe: [
          'Durchhalten schlägt Timing.',
          'Automatisierung stützt Disziplin.',
          'Risikotoleranz ehrlich einschätzen.',
        ],
        keyPointsEn: [
          'Sticking with it beats timing.',
          'Automation supports discipline.',
          'Assess risk tolerance honestly.',
        ],
      },
    ],
  },
  {
    id: 'sm-diy-vs-managed',
    number: 2,
    icon: 'Scale',
    titleDe: 'DIY-ETFs vs. Vermögensverwaltung',
    titleEn: 'DIY ETFs vs wealth management',
    blurbDe: 'Wann Selbstmachen reicht — und was „professionell verwaltet“ wirklich heißt.',
    blurbEn: 'When DIY is enough — and what “professionally managed” really means.',
    lessons: [
      {
        id: 'sm-diy',
        titleDe: 'Wann DIY mit ETFs sinnvoll ist',
        titleEn: 'When DIY with ETFs makes sense',
        minutes: 4,
        sourcePath: '/lp/smg',
        bodyDe: `## Typische DIY-Passung

- du willst niedrige laufende Kosten
- Horizont ist lang, Plan ist einfach (1–3 ETFs)
- du hältst Disziplin ohne Coaching
- Vermögen ist noch überschaubar

ScanLogic-Pfade **ETF-Bildung** und **ETF-Sparplan** decken genau diese Logik ab.

Professionelle Verwaltung ist kein Muss für soliden Vermögensaufbau.

> Keine Ablehnung von Verwaltern — Abwägung.`,
        bodyEn: `## Typical DIY fit

- you want low ongoing costs
- horizon is long, plan is simple (1–3 ETFs)
- you keep discipline without coaching
- wealth is still modest

ScanLogic’s **ETF Education** and **ETF savings plan** tracks cover this logic.

Professional management is not required for solid wealth building.

> Not anti-manager — a trade-off.`,
        keyPointsDe: [
          'Einfache ETF-Pläne sind für viele ausreichend.',
          'Kosten-Disziplin ist ein DIY-Vorteil.',
          'Komplexität nur bei echtem Mehrwert.',
        ],
        keyPointsEn: [
          'Simple ETF plans are enough for many.',
          'Cost discipline is a DIY advantage.',
          'Add complexity only for real value.',
        ],
      },
      {
        id: 'sm-managed',
        titleDe: 'Was digitale Vermögensverwaltung anbietet',
        titleEn: 'What digital wealth management offers',
        minutes: 5,
        sourcePath: '/lp/smg',
        bodyDe: `## Typische Versprechen

Anbieter wie LIQID positionieren sich als **digitaler Vermögensverwalter**: Portfolios nach professionellen Strategien, oft ab höheren Einstiegssummen (Beispiel-Marketing: ab 100.000 €), mit transparenten Gebühren und ETF-/Multi-Asset-Bausteinen.

### Was du prüfen solltest

| Thema | Frage |
| --- | --- |
| Regulierung | BaFin / Bundesbank / vergleichbare Aufsicht? |
| Verwahrung | Sondervermögen bei Depotbank? |
| Gebühren | All-in % p.a. — was ist drin, was nicht? |
| Mindestanlage | Passt die Summe zu deinem Leben? |
| Strategie | Aktienquote, Anleihen, Alternativen — verständlich? |
| Ausstieg | Kündigungsfristen, Transfer |

„Zugang zu Institutionen“ klingt stark — rechne trotzdem **Netto nach Gebühren**.

> Keine Empfehlung für LIQID oder andere VV.`,
        bodyEn: `## Typical promises

Firms like LIQID position as **digital wealth managers**: portfolios using professional strategies, often from higher entry amounts (example marketing: from €100,000), with transparent fees and ETF / multi-asset sleeves.

### What to verify

| Topic | Question |
| --- | --- |
| Regulation | BaFin / Bundesbank / comparable supervisor? |
| Custody | Segregated assets at a custodian bank? |
| Fees | All-in % p.a. — what’s included? |
| Minimum | Does the amount fit your life? |
| Strategy | Equity share, bonds, alternatives — clear? |
| Exit | Notice periods, transfers |

“Institutional access” sounds strong — still compute **net after fees**.

> Not a recommendation for LIQID or any manager.`,
        keyPointsDe: [
          'Gebühren und Mindestsumme entscheiden mit.',
          'Regulierung und Sondervermögen prüfen.',
          'Marketing ≠ persönlicher Fit.',
        ],
        keyPointsEn: [
          'Fees and minimums matter.',
          'Check regulation and segregated assets.',
          'Marketing ≠ personal fit.',
        ],
      },
      {
        id: 'sm-fees-safety',
        titleDe: 'Gebühren, Sicherheit, Sondervermögen',
        titleEn: 'Fees, safety, segregated assets',
        minutes: 4,
        sourcePath: LIQID_HOME_URL,
        bodyDe: `## Sicherheit (Bildung)

Seriöse Anbieter in DE nennen oft:

- Aufsicht (z. B. BaFin)
- Verwahrung als **Sondervermögen** (getrennt vom Firmenvermögen)
- klare Gebühren statt undurchsichtiger Provisionen

Das schützt vor Emittenteninsolvenz der **Verwaltung** — nicht vor Kursverlusten am Markt.

### Gebühren

Auch „transparent“ kann teuer sein gegenüber einem selbst geführten Welt-ETF-Sparplan. Vergleiche Prozentpunkte über 10–20 Jahre.

> Keine Sicherheitsgarantie. Keine Gebührenberatung.`,
        bodyEn: `## Safety (education)

Serious DE providers often cite:

- supervision (e.g. BaFin)
- custody as **segregated assets** (separate from firm capital)
- clear fees instead of opaque commissions

That protects against manager **insolvency** — not against market losses.

### Fees

Even “transparent” can be expensive vs a self-run world-ETF plan. Compare percentage points over 10–20 years.

> Not a safety guarantee. Not fee advice.`,
        keyPointsDe: [
          'Sondervermögen ≠ keine Kursverluste.',
          'Transparente Gebühren trotzdem rechnen.',
          'Aufsicht prüfen, nicht nur Logos glauben.',
        ],
        keyPointsEn: [
          'Segregated assets ≠ no market losses.',
          'Still math transparent fees.',
          'Verify supervision — do not just trust logos.',
        ],
      },
    ],
  },
  {
    id: 'sm-practice',
    number: 3,
    icon: 'ListChecks',
    titleDe: 'Umsetzen ohne Hype',
    titleEn: 'Apply without the hype',
    blurbDe: 'Persönliche Checkliste — Leitfaden als Impuls, nicht als Auftrag.',
    blurbEn: 'Personal checklist — treat guides as sparks, not orders.',
    lessons: [
      {
        id: 'sm-questions',
        titleDe: 'Die wichtigsten Fragen an dich',
        titleEn: 'The key questions for you',
        minutes: 3,
        sourcePath: '/lp/smg',
        bodyDe: `## Vor „Leitfaden anfordern“ / Konto

1. Welches Ziel und welcher Horizont?
2. Brauche ich Multi-Asset — oder reicht ein einfacher ETF-Kern?
3. Kann ich Gebühren der Verwaltung tragen / rechtfertigen?
4. Habe ich Disziplin für DIY — oder brauche ich Prozess-Unterstützung?
5. Ist die Mindestanlage realistisch ohne Notgroschen zu opfern?

Externe Leitfäden (Smart Money o. Ä.) können Prinzipien erklären — die Entscheidung bleibt bei dir.

> Keine Beratungsersatz.`,
        bodyEn: `## Before “get the guide” / signup

1. What goal and horizon?
2. Do I need multi-asset — or is a simple ETF core enough?
3. Can I carry / justify management fees?
4. Do I have DIY discipline — or need process support?
5. Is the minimum realistic without raiding the emergency fund?

External guides (smart money etc.) can explain principles — the decision stays yours.

> Not a substitute for advice.`,
        keyPointsDe: [
          'Fragen vor Formular.',
          'Mindestanlage vs. Liquidität abwägen.',
          'Prinzipien übernehmen, Produkte selbst wählen.',
        ],
        keyPointsEn: [
          'Questions before the form.',
          'Weigh minimum vs liquidity.',
          'Adopt principles; choose products yourself.',
        ],
      },
      {
        id: 'sm-checklist',
        titleDe: 'Checkliste Smart Money → Alltag',
        titleEn: 'Checklist: smart money → daily life',
        minutes: 3,
        sourcePath: LIQID_SMG_URL,
        bodyDe: `## Übersetzung in Handlungen

1. Schriftliche Allokation (auch wenn nur 2 Bausteine)
2. Automatischer Spar-/Investitionsplan
3. Jährliches Rebalancing / Review
4. Kosten und Steuern notieren
5. Optional: Leitfaden/Webinar als Weiterbildung — kritisch lesen
6. Bei großen Vermögen / komplexen Zielen: unabhängige Beratung erwägen

Vertiefung: [LIQID Smart Money Leitfaden](https://www.liqid.de/lp/smg) — Marketing + Wissen trennen.

Andere ScanLogic-Pfade: ETF-Bildung, Sparplan, Finanztip.

> Keine Empfehlung für Vermögensverwalter.`,
        bodyEn: `## Translate into actions

1. Written allocation (even if only 2 sleeves)
2. Automated contribution plan
3. Yearly rebalance / review
4. Track costs and taxes
5. Optional: guide/webinar as learning — read critically
6. For large/complex wealth: consider independent advice

Deep dive: [LIQID Smart Money guide](https://www.liqid.de/lp/smg) — separate marketing from knowledge.

Other ScanLogic paths: ETF Education, savings plan, Finanztip.

> Not a recommendation for any wealth manager.`,
        keyPointsDe: [
          'Prinzipien in Routine übersetzen.',
          'Leitfäden kritisch nutzen.',
          'DIY und VV sind Alternativen — kein Zwang.',
        ],
        keyPointsEn: [
          'Turn principles into routines.',
          'Use guides critically.',
          'DIY and managed are options — not obligations.',
        ],
      },
    ],
  },
]
