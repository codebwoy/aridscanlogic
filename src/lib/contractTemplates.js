export const CONTRACT_TEMPLATES = {
  nda: {
    title: 'Geheimhaltungsvereinbarung (NDA)',
    template_type: 'nda',
    sections: [
      { heading: 'Vertragsparteien', body: 'Zwischen [Partei A] und [Partei B]…' },
      { heading: 'Vertrauliche Informationen', body: 'Als vertraulich gelten alle…' },
      { heading: 'Laufzeit', body: 'Diese Vereinbarung gilt für 3 Jahre…' },
    ],
  },
  employment: {
    title: 'Arbeitsvertrag',
    template_type: 'employment',
    sections: [
      { heading: 'Arbeitgeber / Arbeitnehmer', body: '…' },
      { heading: 'Tätigkeitsbeschreibung', body: '…' },
      { heading: 'Vergütung', body: 'Monatsgehalt brutto…' },
      { heading: 'Urlaub', body: 'Gesetzlicher Mindesturlaub…' },
    ],
  },
  service: {
    title: 'Dienstleistungsvertrag',
    template_type: 'service',
    sections: [
      { heading: 'Leistungsgegenstand', body: 'Der Auftragnehmer erbringt…' },
      { heading: 'Vergütung', body: 'Die Vergütung beträgt…' },
      { heading: 'Haftung', body: 'Die Haftung ist beschränkt auf…' },
    ],
  },
  freelance: {
    title: 'Freelance / Werkvertrag (Software)',
    template_type: 'freelance',
    sections: [
      { heading: 'Parties / Parteien', body: 'Auftraggeber [Client] — Auftragnehmer [Freelancer]' },
      { heading: 'Scope / Leistung', body: 'Development of software as per Annex SOW.' },
      { heading: 'IP / Urheberrecht', body: 'Work product transfers upon full payment.' },
      { heading: 'Payment / Vergütung', body: 'Fixed fee or T&M per rate card.' },
    ],
  },
  minijob: {
    title: 'Minijob-Vereinbarung',
    template_type: 'minijob',
    sections: [
      { heading: 'Arbeitgeber / Arbeitnehmer', body: '…' },
      { heading: 'Entgelt', body: 'Monatliches Entgelt bis Minijob-Grenze.' },
      { heading: 'Sozialversicherung', body: 'Hinweise zur Meldung und Grenze.' },
    ],
  },
  saas: {
    title: 'SaaS / Software Service Agreement',
    template_type: 'saas',
    sections: [
      { heading: 'Service', body: 'Provider grants access to hosted software.' },
      { heading: 'SLA', body: '99.5% uptime target, maintenance windows.' },
      { heading: 'Data / DSGVO', body: 'Processing agreement per Art. 28 DSGVO.' },
      { heading: 'Liability', body: 'Limited to fees paid in last 12 months.' },
    ],
  },
  partnership: {
    title: 'GbR Gesellschaftsvertrag (Entwurf)',
    template_type: 'partnership',
    sections: [
      { heading: 'Gesellschafter', body: '…' },
      { heading: 'Gewinnverteilung', body: 'Nach Kapitalanteilen.' },
      { heading: 'Geschäftsführung', body: 'Gesamtvertretungsbefugnis.' },
    ],
  },
  impressum: {
    title: 'Impressum (Website-Footer)',
    template_type: 'impressum',
    category: 'legal',
    sections: [
      {
        heading: 'Impressum — Vorbereitungsentwurf',
        body: 'Wird aus BizStart-/DocDraft-Profil befüllt. Enthält § 5 DDG Pflichtangaben: Anbieter, ladungsfähige Anschrift (kein Postfach), Kontakt, Steuernummer.',
      },
      {
        heading: 'Footer-Hinweis',
        body: 'Im Website-Footer als „Impressum" verlinken. Vor Veröffentlichung Rechtsanwalt konsultieren.',
      },
    ],
  },
  datenschutz: {
    title: 'Datenschutzerklärung (DSGVO)',
    template_type: 'datenschutz',
    category: 'legal',
    sections: [
      {
        heading: 'Datenschutzerklärung — Vorbereitungsentwurf',
        body: 'Wird aus Fragebogen (Kontaktformular, Cookies, Hosting, Analyse) und Profildaten befüllt. Art. 13/14 DSGVO.',
      },
      {
        heading: 'Cookie-Banner',
        body: 'Bei Analyse- oder Marketing-Cookies Cookie-Einwilligung einrichten (TTDSG §25).',
      },
    ],
  },
  avv: {
    title: 'Auftragsverarbeitungsvertrag (AVV)',
    template_type: 'avv',
    category: 'legal',
    sections: [
      {
        heading: 'AVV — Vorbereitungsentwurf',
        body: 'Vertrag gemäß Art. 28 DSGVO zwischen Verantwortlichem (Auftraggeber/Kunde) und Auftragsverarbeiter (Sie als Web-Agentur oder Ihr Hosting-Anbieter).',
      },
      {
        heading: 'Verwendung',
        body: 'Nicht im Website-Footer — Vertrag zur Unterzeichnung. TOMs, Unterauftragsverarbeiter und Löschfristen vom Rechtsanwalt prüfen lassen.',
      },
    ],
  },
}
