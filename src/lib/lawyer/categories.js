import {
  TrendingUp,
  PieChart,
  Search,
  Lightbulb,
  Building2,
  Calculator,
  Shield,
  HeartPulse,
  Landmark,
  Globe2,
  FileSearch,
  FilePen,
  ClipboardList,
} from 'lucide-react'

/** 13 Herr Müller activity categories */
export const MUELLER_CATEGORIES = [
  {
    id: 'financial-literacy',
    title: 'Wealth Building',
    titleDe: 'Vermögensaufbau',
    icon: TrendingUp,
    promptDe:
      'Als Herr Müller: Erklären Sie Notgroschen, Zinseszins und eine einfache Budgetstruktur für einen deutschen Selbstständigen — inkl. FIRE-Grundlagen.',
    promptEn:
      'As Herr Müller: Explain emergency funds, compound interest, and a simple budget structure for a German self-employed person — including FIRE basics.',
  },
  {
    id: 'portfolio',
    title: 'Portfolio & ETFs',
    titleDe: 'Portfolio & ETFs',
    icon: PieChart,
    promptDe:
      'Beraten Sie zu einer diversifizierten Allokation (DE/EU/US) inkl. Riester/Rürup, UCITS-ETFs und typischer Quellensteuer für deutsche Anleger.',
    promptEn:
      'Advise on diversified allocation (DE/EU/US) including Riester/Rürup, UCITS ETFs, and typical withholding tax for German investors.',
  },
  {
    id: 'research',
    title: 'Research & Risk',
    titleDe: 'Research & Risiko',
    icon: Search,
    promptDe:
      'Vergleichen Sie TER, Risikoprofile (konservativ/moderat/offensiv) und Due-Diligence-Checkliste für ETF-Auswahl in Deutschland.',
    promptEn:
      'Compare TER, risk profiles (conservative/moderate/aggressive), and due diligence checklist for ETF selection in Germany.',
  },
  {
    id: 'strategy',
    title: 'Business Strategy',
    titleDe: 'Business-Strategie',
    icon: Lightbulb,
    promptDe:
      'Als Mentor: Wie prüfe ich die Tragfähigkeit eines Startup-Modells (Pricing, CAC, KPIs, Skalierung)?',
    promptEn:
      'As mentor: How do I test startup viability (pricing, CAC, KPIs, scaling)?',
  },
  {
    id: 'legal-structure',
    title: 'Legal Structures',
    titleDe: 'Rechtsformen',
    icon: Building2,
    promptDe:
      'Vergleichen Sie GmbH, UG, Einzelunternehmen, Freiberufler und GbR — Haftung, Kosten, Gewerbe/Handelsregister/Finanzamt.',
    promptEn:
      'Compare GmbH, UG, sole trader, Freiberufler, and GbR — liability, costs, trade/commercial register, tax office.',
  },
  {
    id: 'tax',
    title: 'Tax Planning',
    titleDe: 'Steuerplanung',
    icon: Calculator,
    promptDe:
      'Erklären Sie ESt, GewSt, USt (19/7%), Kleinunternehmer §19 UStG und typische abzugsfähige Betriebsausgaben.',
    promptEn:
      'Explain income tax, trade tax, VAT (19/7%), small business VAT exemption §19 UStG, and typical deductible expenses.',
  },
  {
    id: 'compliance',
    title: 'Compliance & GDPR',
    titleDe: 'Compliance & DSGVO',
    icon: Shield,
    promptDe:
      'Checkliste: AGB, NDAs, DSGVO/Cookies und typische BGB/HGB-Punkte für Dienstleistungsverträge.',
    promptEn:
      'Checklist: terms, NDAs, GDPR/cookies, and typical BGB/HGB points for service contracts.',
  },
  {
    id: 'insurance',
    title: 'Insurance & Risk',
    titleDe: 'Versicherungen',
    icon: HeartPulse,
    promptDe:
      'GKV vs PKV für Gründer; wann Berufshaftpflicht, D&O und BU sinnvoll sind.',
    promptEn:
      'Statutory vs private health insurance for founders; when professional indemnity, D&O, and disability insurance make sense.',
  },
  {
    id: 'pension',
    title: 'Retirement',
    titleDe: 'Altersvorsorge',
    icon: Landmark,
    promptDe:
      'Gesetzliche Rente schätzen, private Vorsorge und betriebliche Altersvorsorge für GmbH-Geschäftsführer.',
    promptEn:
      'Estimate statutory pension, private savings, and occupational pension for GmbH managing directors.',
  },
  {
    id: 'international',
    title: 'International Tax',
    titleDe: 'Internationale Steuer',
    icon: Globe2,
    promptDe:
      'FATCA, W-8BEN, DBA USA-DE und EU-Grenzüberschreitende USt bei Expansion.',
    promptEn:
      'FATCA, W-8BEN, US-DE tax treaty, and EU cross-border VAT when expanding.',
  },
  {
    id: 'doc-review',
    title: 'Document Review',
    titleDe: 'Vertragsprüfung',
    icon: FileSearch,
    promptDe:
      'Ich lade gleich Vertragstext hoch. Prüfen Sie Haftung, IP, Kündigung und versteckte Risiken strukturiert.',
    promptEn:
      'I will paste contract text next. Review liability, IP, termination, and hidden risks in a structured way.',
  },
  {
    id: 'contracts',
    title: 'Draft Contract',
    titleDe: 'Vertrag erstellen',
    icon: FilePen,
    promptDe:
      'Erstellen Sie eine zweisprachige (DE/EN) NDA-Vorlage für Freelancer-Softwareprojekte mit klaren Klauseln.',
    promptEn:
      'Draft a bilingual (DE/EN) NDA template for freelance software projects with clear clauses.',
  },
  {
    id: 'case-mgmt',
    title: 'Executive Summary',
    titleDe: 'Zusammenfassung',
    icon: ClipboardList,
    promptDe:
      'Fassen Sie unsere bisherige Beratung als Executive Summary mit Timeline und offenen Punkten zusammen.',
    promptEn:
      'Summarize our consultation so far as an executive summary with timeline and open items.',
  },
]

export function getCategoryById(id) {
  return MUELLER_CATEGORIES.find((c) => c.id === id)
}

export function getStarterPrompt(category, lang = 'de') {
  if (!category) return ''
  return lang === 'en' ? category.promptEn : category.promptDe
}
