export const STRINGS = {
  en: {
    title: 'Register your business in Germany — step by step',
    subtitle: 'We guide you through every form, in plain language',
    continue: 'Continue where I left off',
    bizstartCard: 'BizStart Germany',
    bizstartCardDesc: 'Register Gewerbe, Finanzamt & VAT — guided in plain language',
    startRegistration: 'Start registration',
    chatHelp: 'Have questions? Chat with our registration guide',
    notStarted: 'Not started',
    inProgress: 'In progress',
    submitted: 'Submitted',
    confirmed: 'Confirmed',
    disclaimer:
      'This guide provides general information only. Consult a licensed Steuerberater or Rechtsanwalt for your specific situation.',
    websiteLegalTitle: 'Website legal pages',
    websiteLegalDesc: 'Impressum, Privacy Policy & AVV — guided drafts for your lawyer review',
  },
  de: {
    title: 'Gewerbe in Deutschland anmelden — Schritt für Schritt',
    subtitle: 'Wir führen Sie durch jedes Formular in verständlicher Sprache',
    continue: 'Dort weitermachen, wo ich aufgehört habe',
    bizstartCard: 'BizStart Germany',
    bizstartCardDesc: 'Gewerbe-, Finanzamt- & USt-Anmeldung — Schritt für Schritt',
    startRegistration: 'Anmeldung starten',
    chatHelp: 'Fragen? Chat mit unserem Anmelde-Assistenten',
    notStarted: 'Nicht begonnen',
    inProgress: 'In Bearbeitung',
    submitted: 'Eingereicht',
    confirmed: 'Bestätigt',
    disclaimer:
      'Dieser Leitfaden bietet nur allgemeine Informationen. Für Ihre Situation konsultieren Sie einen Steuerberater oder Rechtsanwalt.',
    websiteLegalTitle: 'Website-Rechtliches',
    websiteLegalDesc: 'Impressum, Datenschutz & AVV — Entwürfe zur Anwaltsvorbereitung',
  },
}

export function t(lang, key) {
  return STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key
}
