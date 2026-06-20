/** IHK-style guidance per business plan step (inspiration: IHK Köln business & finance plan). */

export const PLAN_AUDIENCES = [
  { id: 'bank', de: 'Bank / Kredit', en: 'Bank / loan' },
  { id: 'investor', de: 'Investor / Förderung', en: 'Investor / grant' },
  { id: 'award', de: 'Award / Pitch-Wettbewerb', en: 'Award / pitch competition' },
  { id: 'sponsor', de: 'Sponsor / Partner', en: 'Sponsor / partner' },
  { id: 'employment', de: 'Agentur für Arbeit / Gründungszuschuss', en: 'Employment agency / startup grant' },
  { id: 'advisor', de: 'Berater / IHK', en: 'Advisor / chamber' },
  { id: 'general', de: 'Eigene Planung', en: 'Personal planning' },
]

/** Static priority guidance per target reader — instant fallback before / without AI. */
export const AUDIENCE_PLAYBOOK = {
  bank: {
    prioritySteps: ['summary', 'finances', 'risks', 'competencies', 'market', 'company'],
    summaryFocus: {
      de: [
        'Klarer Kapitalbedarf und Verwendung der Mittel',
        'Rückzahlungsfähigkeit und konservative Umsatzprognose',
        'Eigenkapital, Sicherheiten und persönliche Qualifikation',
        'Realistische Risiken mit Gegenmaßnahmen',
      ],
      en: [
        'Clear capital need and use of funds',
        'Repayment ability and conservative revenue forecast',
        'Equity, collateral, and personal qualifications',
        'Realistic risks with mitigations',
      ],
    },
    tone: {
      de: 'Sachlich, vorsichtig, zahlenbasiert — Vertrauen durch Nachvollziehbarkeit.',
      en: 'Factual, cautious, numbers-driven — build trust through traceability.',
    },
  },
  investor: {
    prioritySteps: ['summary', 'market', 'idea', 'sales', 'finances', 'competencies', 'partners'],
    summaryFocus: {
      de: [
        'Marktgröße, Wachstumspotenzial und Alleinstellungsmerkmal',
        'Skalierbares Geschäftsmodell und Nutzen für Kunden',
        'Team-Expertise und Meilensteine',
        'Kapitalbedarf, Mittelverwendung und erwartete Rendite',
      ],
      en: [
        'Market size, growth potential, and unique advantage',
        'Scalable business model and customer value',
        'Team expertise and milestones',
        'Funding need, use of funds, and expected return',
      ],
    },
    tone: {
      de: 'Visionär aber belegbar — Wachstum und Differenzierung betonen.',
      en: 'Visionary but evidence-based — emphasise growth and differentiation.',
    },
  },
  award: {
    prioritySteps: ['summary', 'idea', 'market', 'competencies', 'values', 'sales', 'annexes'],
    summaryFocus: {
      de: [
        'Innovation, gesellschaftlicher Nutzen oder Branchenbeitrag',
        'Überzeugende Story: Problem, Lösung, Wirkung',
        'Gründerpassion, Expertise und bisherige Erfolge',
        'Klares Alleinstellungsmerkmal und Zukunftspotenzial',
      ],
      en: [
        'Innovation, social impact, or industry contribution',
        'Compelling story: problem, solution, impact',
        'Founder passion, expertise, and track record',
        'Clear unique advantage and future potential',
      ],
    },
    tone: {
      de: 'Inspirierend und prägnant — Jury soll sich an Ihre Idee erinnern.',
      en: 'Inspiring and concise — make the jury remember your idea.',
    },
  },
  sponsor: {
    prioritySteps: ['summary', 'customers', 'sales', 'values', 'idea', 'partners', 'annexes'],
    summaryFocus: {
      de: [
        'Sichtbarkeit und Markenfit für den Sponsor',
        'Zielgruppe, Reichweite und gemeinsame Werte',
        'Konkretes Gegenleistungsmodell (Logo, Events, Content)',
        'Glaubwürdigkeit und professionelle Umsetzung',
      ],
      en: [
        'Visibility and brand fit for the sponsor',
        'Audience, reach, and shared values',
        'Concrete value exchange (logo, events, content)',
        'Credibility and professional delivery',
      ],
    },
    tone: {
      de: 'Partnerschaftlich und wertschätzend — Nutzen für beide Seiten zeigen.',
      en: 'Partnership-oriented — show mutual benefit.',
    },
  },
  employment: {
    prioritySteps: ['summary', 'finances', 'competencies', 'customers', 'production', 'risks', 'company'],
    summaryFocus: {
      de: [
        'Tragfähigkeit der Selbstständigkeit und realistisches Einkommen',
        'Arbeitszeitmodell und konkrete Kunden/Aufträge',
        'Fachliche Qualifikation und Marktchancen',
        'Konservative Finanzplanung (Liquidität, Lebenshaltung)',
      ],
      en: [
        'Viability of self-employment and realistic income',
        'Working hours model and concrete clients/orders',
        'Professional qualifications and market opportunity',
        'Conservative finance plan (liquidity, living costs)',
      ],
    },
    tone: {
      de: 'Ernsthaft und nachvollziehbar — Lebensunterhalt muss plausibel gedeckt sein.',
      en: 'Serious and plausible — living expenses must be credibly covered.',
    },
  },
  advisor: {
    prioritySteps: ['summary', 'production', 'market', 'finances', 'risks', 'organization', 'annexes'],
    summaryFocus: {
      de: [
        'Vollständiges Bild: Tätigkeit, Markt, Organisation',
        'Offene Fragen und Annahmen transparent benennen',
        'Strukturierter Finanzplan mit nachvollziehbaren Annahmen',
        'Was Sie bereits recherchiert vs. was noch fehlt',
      ],
      en: [
        'Complete picture: activity, market, organisation',
        'Name open questions and assumptions transparently',
        'Structured finance plan with traceable assumptions',
        'What you researched vs. what is still missing',
      ],
    },
    tone: {
      de: 'Ehrlich und strukturiert — Berater soll Lücken erkennen können.',
      en: 'Honest and structured — advisor should spot gaps easily.',
    },
  },
  general: {
    prioritySteps: ['summary', 'production', 'customers', 'idea', 'market', 'finances', 'risks'],
    summaryFocus: {
      de: [
        'Geschäftsidee und Zielgruppe in eigenen Worten',
        'Ihre Stärken und erste Schritte',
        'Umsatz- und Kostenübersicht',
        'Persönliche Ziele für die nächsten 3 Jahre',
      ],
      en: [
        'Business idea and target customers in your own words',
        'Your strengths and first steps',
        'Revenue and cost overview',
        'Personal goals for the next 3 years',
      ],
    },
    tone: {
      de: 'Praktisch und klar — Plan als persönlicher Leitfaden.',
      en: 'Practical and clear — plan as your personal roadmap.',
    },
  },
}

export function getAudiencePlaybook(audienceId, lang = 'de') {
  const book = AUDIENCE_PLAYBOOK[audienceId] || AUDIENCE_PLAYBOOK.general
  return {
    audience: audienceId || 'general',
    prioritySteps: book.prioritySteps,
    summaryFocus: book.summaryFocus[lang] || book.summaryFocus.en,
    tone: book.tone[lang] || book.tone.en,
  }
}

export function isPriorityStep(stepId, prioritySteps) {
  return Array.isArray(prioritySteps) && prioritySteps.includes(stepId)
}

export const BP_GUIDELINES = {
  meta: {
    de: {
      title: 'Wozu dient ein Businessplan?',
      bullets: [
        'Leitfaden für Sie als Gründer — hält Sie auf Kurs.',
        'Überzeugt Partner, Investoren und Berater von Ihrer Idee.',
        'Passen Sie Ton und Schwerpunkt an Ihre Zielgruppe an (Bank, Agentur, Investor …).',
        'Kurze, klare Sätze in eigenen Worten — gründliche Recherche zählt mehr als glänzender Text.',
      ],
    },
    en: {
      title: 'What is a business plan for?',
      bullets: [
        'A planning guide that keeps you on track as founder.',
        'Helps persuade partners, investors, and advisors.',
        'Tailor tone and focus to your audience (bank, agency, investor …).',
        'Use short, clear sentences — thorough research beats flashy prose.',
      ],
    },
  },
  summary: {
    de: {
      title: 'Executive Summary — der Einstieg',
      bullets: [
        'Leser soll allein anhand dieser Seite entscheiden können: interessant oder nicht.',
        'Enthalten: Geschäftskonzept, Team-Expertise, Kundennutzen, USP, Umsatz-/Rentabilitätsaussicht, Rechtsform, Kapitalbedarf.',
        'Werbung ist erlaubt — aber im Folgenden belegen.',
        'Typisch 1–2 Seiten; bei unter 6 Seiten Gesamttext wirkt der Plan oft zu dünn (ohne Tabellen/Anhang).',
      ],
    },
    en: {
      title: 'Executive summary — your opening',
      bullets: [
        'Readers should decide interest from this section alone.',
        'Include: concept, team expertise, customer benefit, USP, sales/profit outlook, legal form, capital needs.',
        'Promotional claims are fine — but prove them in later chapters.',
        'Aim for 1–2 pages here; fewer than 6 pages of body text is usually too thin (excluding tables).',
      ],
    },
  },
  production: {
    de: {
      title: 'Leistungserbringung',
      bullets: [
        'Beschreiben Sie konkret, wie Ihre Leistung entsteht und geliefert wird.',
        'Zeigen Sie, dass Sie die Idee praktisch durchdacht haben.',
        'Formulieren Sie Leistungen als kalkulierbare „Produkte“ (auch bei Dienstleistungen).',
      ],
    },
    en: {
      title: 'How you deliver',
      bullets: [
        'Describe concretely how your service is produced and delivered.',
        'Show you have tested the idea in practice.',
        'Frame services as calculable “products” (even for services).',
      ],
    },
  },
  customers: {
    de: {
      title: 'Zielgruppe & Marktsegmente',
      bullets: [
        'Quantifizieren Sie Ihre Zielgruppe wo möglich (Alter, Einkommen, Verhalten).',
        'Nicht nur „typische“ Kunden — wer wurde bisher übersehen?',
        'Erste Kontakte und konkrete Pipeline nennen.',
      ],
    },
    en: {
      title: 'Target customers',
      bullets: [
        'Quantify your target market where possible (age, income, behaviour).',
        'Go beyond “obvious” clients — who is underserved?',
        'Name initial contacts and a realistic pipeline.',
      ],
    },
  },
  idea: {
    de: {
      title: 'Geschäftsidee überzeugend darstellen',
      bullets: [
        'Was ist neu, besser, nützlicher — und langfristig nachgefragt?',
        'Nur günstiger zu sein reicht oft nicht — klare Abgrenzung zum Wettbewerb.',
        'Preise, Pakete und Abrechnungslogik transparent erklären.',
      ],
    },
    en: {
      title: 'Make the idea convincing',
      bullets: [
        'What is new, better, useful — with lasting demand?',
        'Being cheaper alone is often not enough — clear differentiation from competitors.',
        'Explain pricing, packages, and billing logic transparently.',
      ],
    },
  },
  market: {
    de: {
      title: 'Marktanalyse',
      bullets: [
        'Markt beschreiben und quantifizieren — zeigen Sie Branchenkenntnis.',
        'Wettbewerb ernst nehmen und benennen.',
        'Trends (Digitalisierung, Regulierung …) einbeziehen.',
      ],
    },
    en: {
      title: 'Market analysis',
      bullets: [
        'Describe and quantify the market — demonstrate sector knowledge.',
        'Take competition seriously and name key players.',
        'Include trends (digitalisation, regulation …).',
      ],
    },
  },
  values: {
    de: {
      title: 'Werte & Qualitätsversprechen',
      bullets: [
        'Was garantieren Sie Kunden in Qualität, Zuverlässigkeit, Diskretion?',
        'Werte sollten im Vertrieb und in Referenzen sichtbar werden.',
      ],
    },
    en: {
      title: 'Values & quality promise',
      bullets: [
        'What do you guarantee on quality, reliability, discretion?',
        'Values should show through in sales and references.',
      ],
    },
  },
  sales: {
    de: {
      title: 'Marketing & Vertrieb',
      bullets: [
        'Vertriebskanäle definieren (Website, Netzwerk, Empfehlungen, Messen …).',
        'Werbekosten schätzen und Wirkung auf Umsatz erläutern.',
        'Nicht nur Flyer/Website — auch Botschaft und Inhalte beschreiben.',
        'Servicepakete mit Preis und erwarteten Stückzahlen zuordnen.',
      ],
    },
    en: {
      title: 'Marketing & sales',
      bullets: [
        'Define sales channels (website, network, referrals, events …).',
        'Estimate advertising costs and impact on revenue.',
        'Describe messaging and content — not just materials.',
        'Link service packages to price and expected volumes.',
      ],
    },
  },
  organization: {
    de: {
      title: 'Organisation — oft vergessen, besonders wichtig',
      bullets: [
        'Wie viel Zeit pro Tätigkeit (Produktion, Akquise, Verwaltung)?',
        'Wer ist wofür verantwortlich? Auch Solo-Gründer brauchen klare Rollen.',
        'Spielen Teammitglieder ihre Stärken aus?',
      ],
    },
    en: {
      title: 'Organisation — often overlooked',
      bullets: [
        'How much time per activity (production, sales, admin)?',
        'Who is responsible for what? Solo founders need clear roles too.',
        'Are team members playing to their strengths?',
      ],
    },
  },
  competencies: {
    de: {
      title: 'Gründerqualifikation',
      bullets: [
        'Fachliche und kaufmännische Kompetenz getrennt darstellen.',
        'Branchenerfahrung und Nachweise (Abschlüsse, Projekte, Preise).',
        'Lebenslauf gehört in den Anhang, hier die Kernaussage.',
      ],
    },
    en: {
      title: 'Founder qualifications',
      bullets: [
        'Separate professional and commercial expertise.',
        'Sector experience and evidence (degrees, projects, awards).',
        'Full CV goes in annexes — state the core message here.',
      ],
    },
  },
  partners: {
    de: {
      title: 'Schlüsselpartner & Netzwerk',
      bullets: [
        'Kooperationen, Subunternehmer, Mentoren, Branchennetzwerk.',
        'Welche Partner sichern Aufträge oder Kompetenzlücken?',
      ],
    },
    en: {
      title: 'Key partners',
      bullets: [
        'Cooperations, subcontractors, mentors, industry network.',
        'Which partners secure orders or fill skill gaps?',
      ],
    },
  },
  company: {
    de: {
      title: 'Gründer, Standort, Rechtsform',
      bullets: [
        'Warum sind Sie/Ihr Team besonders geeignet?',
        'Standortvorteile oder Remote-Setup begründen.',
        'Rechtsform und besondere Vorschriften (Gewerbe, Kammer, Versicherung).',
      ],
    },
    en: {
      title: 'Founders, location, legal form',
      bullets: [
        'Why are you/your team especially qualified?',
        'Justify location advantages or remote setup.',
        'Legal form and special rules (trade register, chamber, insurance).',
      ],
    },
  },
  risks: {
    de: {
      title: 'Chancen & Risiken (SWOT-Tiefe)',
      bullets: [
        'Welche Stärken nutzen Sie für welche Chancen?',
        'Welche Risiken mindern welche Stärken?',
        'Wie werden Schwächen zu Stärken — oder Schaden verhindert?',
        'Erfahrene Leser erkennen hier die Tiefe Ihrer Analyse.',
      ],
    },
    en: {
      title: 'Opportunities & risks (SWOT depth)',
      bullets: [
        'Which strengths help you seize which opportunities?',
        'Which risks are mitigated by which strengths?',
        'How do weaknesses become strengths — or damage prevented?',
        'Experienced readers judge your depth here.',
      ],
    },
  },
  finances: {
    de: {
      title: 'Finanzplan — Kapital, Rentabilität, Liquidität',
      bullets: [
        'Kapitalbedarf: langfristig (Investitionen) und kurzfristig (Anlaufphase, Privatentnahmen).',
        'Rentabilität: Reicht der erwartete Gewinn für Lebenshaltung inkl. Sozialversicherung?',
        'Als Selbstständiger muss der Gewinn höher sein als ein Angestelltengehalt bei gleichem Lebensstandard.',
        'Liquidität: Monat für Monat — Fehlbeträge früh mit Kreditlinie planen, nicht erst in der Krise.',
        'Vor Kreditbewilligung keine bindenden Verträge (Miete, Großbestellungen)!',
        'Angebote für Investitionen dem Anhang beilegen.',
      ],
    },
    en: {
      title: 'Finance plan — capital, profit, liquidity',
      bullets: [
        'Capital needs: long-term (investments) and short-term (startup phase, private withdrawals).',
        'Profitability: does expected profit cover living costs including social insurance?',
        'As self-employed, profit must exceed an employee salary at the same living standard.',
        'Liquidity: month by month — plan overdraft early, not in crisis.',
        'Do not sign binding contracts before loan approval!',
        'Attach quotes for planned investments in annexes.',
      ],
    },
  },
  annexes: {
    de: {
      title: 'Anhang',
      bullets: [
        'Lebenslauf(e), wenn nicht im Gründerteil enthalten.',
        'Finanztabellen, Angebote, Mietverträge, Kooperationsentwürfe.',
        'Marktanalysen, Markenrechte, Referenzen, Probekalkulationen.',
      ],
    },
    en: {
      title: 'Annexes',
      bullets: [
        'CV(s) if not fully covered in founder section.',
        'Financial tables, quotes, lease drafts, cooperation agreements.',
        'Market research, trademark rights, references, sample calculations.',
      ],
    },
  },
  review: {
    de: {
      title: 'Abschlussprüfung',
      bullets: [
        'Zahlen nachvollziehbar und konsistent?',
        'Zielgruppe des Plans berücksichtigt (Bank vs. Agentur)?',
        'Vor Einreichung: Steuerberater oder IHK-Gründungsberatung einbeziehen.',
      ],
    },
    en: {
      title: 'Final check',
      bullets: [
        'Are figures traceable and consistent?',
        'Does the plan fit your audience (bank vs. agency)?',
        'Before submission: involve a Steuerberater or chamber startup advisor.',
      ],
    },
  },
}

export function getBpGuidelines(stepId, lang) {
  const g = BP_GUIDELINES[stepId]
  if (!g) return null
  return g[lang] || g.en
}
