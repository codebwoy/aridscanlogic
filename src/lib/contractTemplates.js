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
}
