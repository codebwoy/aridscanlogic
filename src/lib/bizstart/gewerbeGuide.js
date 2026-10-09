/**
 * Educational Gewerbeanmeldung guide for BizStart (GewA 1).
 * Facts summarized for founders — not legal advice.
 * Source overview: https://www.gewerbeanmeldung.de/ (independent info portal, not an official authority).
 */

export const GEWERBE_GUIDE_SOURCE = {
  name: 'gewerbeanmeldung.de',
  url: 'https://www.gewerbeanmeldung.de/',
  noteDe:
    'Unabhängiges Infoportal — kein amtliches Gewerbeamt. Ein wirksamer Gewerbeschein kommt nur von Ihrer Kommune.',
  noteEn:
    'Independent info portal — not an official trade office. Only your municipality issues a valid Gewerbeschein.',
}

/** Official / regional online portals commonly mentioned for digital filing (availability varies by city). */
export const ONLINE_PORTAL_HINTS = [
  {
    id: 'nrw',
    de: 'NRW — Wirtschafts-Service-Portal.NRW',
    en: 'NRW — Wirtschafts-Service-Portal.NRW',
    url: 'https://service.wirtschaft.nrw/',
  },
  {
    id: 'berlin',
    de: 'Berlin — eMeldung (weitgehend papierlos)',
    en: 'Berlin — eMeldung (largely paperless)',
    url: 'https://service.berlin.de',
  },
  {
    id: 'bayern',
    de: 'Bayern — BayernPortal / kommunale Portale',
    en: 'Bavaria — BayernPortal / municipal portals',
    url: 'https://www.bayernportal.de/',
  },
  {
    id: 'bw',
    de: 'Baden-Württemberg — Service-BW',
    en: 'Baden-Württemberg — Service-BW',
    url: 'https://www.service-bw.de/',
  },
  {
    id: 'hamburg',
    de: 'Hamburg — Serviceportal',
    en: 'Hamburg — service portal',
    url: 'https://www.hamburg.de/gewerbeanmeldung',
  },
]

export const COST_ROWS = [
  {
    id: 'new',
    de: { item: 'Neuanmeldung (Gewerbeschein)', range: 'ca. 10–65 €', note: 'keine bundeseinheitliche Gebühr' },
    en: { item: 'New registration (Gewerbeschein)', range: 'approx. €10–65', note: 'set by municipality' },
  },
  {
    id: 'change',
    de: { item: 'Ummeldung', range: 'ca. 10–20 €', note: 'oft günstiger als Neuanmeldung' },
    en: { item: 'Change of registration', range: 'approx. €10–20', note: 'usually cheaper than new' },
  },
  {
    id: 'cancel',
    de: { item: 'Abmeldung', range: 'meist kostenlos', note: 'oft per Post möglich' },
    en: { item: 'Deregistration', range: 'usually free', note: 'often by post' },
  },
  {
    id: 'fz',
    de: { item: 'Führungszeugnis (falls nötig)', range: 'ca. 13 €', note: 'nur bei bestimmten Tätigkeiten' },
    en: { item: 'Police clearance (if required)', range: 'approx. €13', note: 'only for certain trades' },
  },
  {
    id: 'gzr',
    de: { item: 'Gewerbezentralregister-Auszug', range: 'ca. 13 €', note: 'nur falls verlangt' },
    en: { item: 'Central trade register extract', range: 'approx. €13', note: 'only if required' },
  },
  {
    id: 'hwk',
    de: { item: 'Handwerks-/Gewerbekarte', range: 'ca. 80–250 €', note: 'bei eintragungspflichtigem Handwerk' },
    en: { item: 'Craft / trade chamber card', range: 'approx. €80–250', note: 'for registered crafts' },
  },
  {
    id: 'gmbh',
    de: { item: 'Notar & Handelsregister (GmbH/UG)', range: 'mehrere hundert €', note: 'nur Kapitalgesellschaften' },
    en: { item: 'Notary & commercial register (GmbH/UG)', range: 'several hundred €', note: 'corporations only' },
  },
]

export const CHECKLIST_ITEMS = {
  de: [
    'Gültiger Personalausweis oder Reisepass (online ggf. eID + PIN)',
    'Zugang zum kommunalen / landesweiten Verwaltungsportal',
    'Persönliche Daten: Name, Geburt, Meldeadresse, Telefon, E-Mail',
    'Betriebsdaten: Name, Betriebsadresse, Startdatum, klare Tätigkeitsbeschreibung',
    'Rechtsform (Einzelunternehmen, GbR, GmbH/UG …) — bei GbR oft alle Gesellschafter',
    'Handelsregisterauszug bei eintragungspflichtigen Firmen',
    'Branchenerlaubnisse / Qualifikationsnachweise falls erlaubnispflichtig',
    'Zahlungsmittel für die Amtsgebühr',
  ],
  en: [
    'Valid ID or passport (online: eID + PIN where offered)',
    'Access to the municipal / state admin portal',
    'Personal data: name, birth, registered address, phone, email',
    'Business data: name, premises, start date, precise activity description',
    'Legal form (sole trader, GbR, GmbH/UG …) — GbR often needs all partners',
    'Commercial register extract for registered companies',
    'Licences / qualifications if your trade is permit-required',
    'Payment method for the municipal fee',
  ],
}

export const GUIDE_SECTIONS = {
  de: [
    {
      id: 'basics',
      title: 'Wann müssen Sie ein Gewerbe anmelden?',
      body: [
        'Ein Gewerbe ist in der Regel anzumelden, wenn Sie dauerhaft, selbstständig und mit Gewinnerzielungsabsicht tätig werden — und keine freiberufliche Ausnahme greift.',
        'Freiberufler (z. B. bestimmte Heil-, Rechts- oder künstlerische Berufe nach § 18 EStG) melden kein Gewerbe an, sondern nur beim Finanzamt.',
        'Bei Grenzfällen (IT, Beratung, Content, Training) früh mit Finanzamt oder IHK klären — unterlassene Anmeldung kann teuer werden.',
      ],
    },
    {
      id: 'online',
      title: 'Online anmelden 2026 — was zählt',
      body: [
        'Online und Papier verlangen dieselben Angaben; online spart vor allem Zeit und Behördengänge.',
        'Verfügbarkeit und Identifikation (Nutzerkonto, eID) unterscheiden sich stark nach Kommune — prüfen Sie das Portal Ihrer Stadt.',
        'Nur das zuständige Gewerbeamt stellt einen wirksamen Gewerbeschein aus. Private „Sofort-Anmelde“-Seiten sind keine Behörde und können teuer sein.',
      ],
    },
    {
      id: 'klein',
      title: 'Kleingewerbe vs. Kleinunternehmer',
      body: [
        '„Kleingewerbe“ ist kein eigener Anmeldetyp: Sie melden immer ein normales Gewerbe an; Formular und Gewerbeschein sind gleich.',
        'Die Kleinunternehmerregelung (§ 19 UStG) betrifft nur die Umsatzsteuer und wird beim Finanzamt (Fragebogen steuerliche Erfassung) gewählt — nicht beim Gewerbeamt.',
        'Orientierung seit 2025: Umsatzgrenzen oft 25.000 € (Vorjahr) / 100.000 € (laufendes Jahr) — aktuelle Werte beim Finanzamt prüfen.',
      ],
    },
    {
      id: 'neben',
      title: 'Nebengewerbe (Nebenerwerb)',
      body: [
        'Anmeldung wie beim Hauptgewerbe — im Formular „Nebenerwerb“ ankreuzen (Feld 16). Finanzamt wird automatisch informiert.',
        'Hauptjob muss klar im Vordergrund bleiben; Arbeitgeber oft informieren / Genehmigung einholen (Arbeitsvertrag prüfen).',
        'Faustregel Krankenkasse: oft ≤ ca. 20 Std./Woche und weniger Einkommen als im Hauptjob; Familienversicherung enger (häufig ≤ 18 Std.).',
        'Gewerbesteuer-Freibetrag (Einzelunternehmen/Personengesellschaften) aktuell 24.500 € Gewerbeertrag — darunter meist keine Gewerbesteuer.',
      ],
    },
    {
      id: 'after',
      title: 'Was passiert nach der Anmeldung?',
      body: [
        'Gewerbeamt leitet Daten oft an Finanzamt, IHK/HWK und ggf. Berufsgenossenschaft weiter.',
        'Fragebogen zur steuerlichen Erfassung (häufig über ELSTER) fristgerecht einreichen.',
        'IHK-Beiträge entfallen für viele Gründer in den ersten zwei Jahren; Handwerk ggf. Handwerksrolle.',
        'Krankenversicherung über geänderte Einkünfte informieren — sonst drohen Nachzahlungen.',
      ],
    },
    {
      id: 'warn',
      title: 'Warnung vor unseriösen Anbietern',
      body: [
        'Seriöse Anmeldung läuft über Stadt/Gemeinde oder landeseigene Portale — nicht über werbliche „zentrale Register“-Seiten.',
        'Vorsicht bei Sofortversprechen, versteckten Gebühren und Zahlung vor klarer Leistung.',
        'ScanLogic erstellt nur einen Entwurfs-PDF zur Vorbereitung — die Einreichung erfolgt bei Ihrer Kommune.',
      ],
    },
  ],
  en: [
    {
      id: 'basics',
      title: 'When do you need to register a trade?',
      body: [
        'You usually must register if you work permanently, independently and for profit — and you are not a liberal profession (Freiberufler).',
        'Freelancers in certain § 18 EStG professions register with the tax office only, not the trade office.',
        'Borderline cases (IT, consulting, content, training): clarify early with tax office or chamber — skipping registration can be costly.',
      ],
    },
    {
      id: 'online',
      title: 'Online registration 2026 — what matters',
      body: [
        'Online and paper need the same data; online mainly saves time and office visits.',
        'Availability and ID methods (account, eID) vary by city — check your municipality portal.',
        'Only the competent trade office issues a valid Gewerbeschein. Private “instant registration” sites are not authorities and can be expensive.',
      ],
    },
    {
      id: 'klein',
      title: 'Small trade vs small-business VAT scheme',
      body: [
        '“Kleingewerbe” is not a separate filing type: you always register a normal trade; form and certificate are the same.',
        'The Kleinunternehmer scheme (§ 19 UStG) is VAT-only and chosen with the tax office — not at the trade office.',
        'Since 2025, common VAT thresholds are €25,000 (prior year) / €100,000 (current year) — verify current figures.',
      ],
    },
    {
      id: 'neben',
      title: 'Side business (Nebenerwerb)',
      body: [
        'Same registration as a main trade — tick “secondary occupation” on the form. The tax office is notified automatically.',
        'Your main job must stay primary; inform / get consent from your employer if required by contract.',
        'Health-insurance rule of thumb: often ≤ ~20 hrs/week and less income than the main job; family cover is stricter (~18 hrs).',
        'Trade-tax allowance for sole traders/partnerships is currently €24,500 of trade income — often none below that.',
      ],
    },
    {
      id: 'after',
      title: 'What happens after filing?',
      body: [
        'The trade office often forwards data to tax office, IHK/HWK and accident insurance.',
        'Submit the tax registration questionnaire (often via ELSTER) on time.',
        'Many founders are exempt from IHK dues for the first two years; crafts may need the craft roll.',
        'Tell your health insurer about new income — otherwise back-payments can follow.',
      ],
    },
    {
      id: 'warn',
      title: 'Beware of unofficial providers',
      body: [
        'File via city/state portals — not ad-heavy “central register” websites.',
        'Watch for instant promises, hidden fees, and payment before a clear service.',
        'ScanLogic only prepares a draft PDF — you submit with your municipality.',
      ],
    },
  ],
}

/** Short tips shown inside the GewA wizard by step id. */
export const WIZARD_STEP_TIPS = {
  registrationType: {
    de: 'Neuanmeldung, Ummeldung oder Abmeldung wählen. Online und Papier nutzen dieselben Angaben — die Amtsgebühr ist meist gleich (ca. 10–65 €).',
    en: 'Choose new, change or cancel. Online and paper need the same data — the fee is usually the same (approx. €10–65).',
  },
  owner: {
    de: 'Rechtsform früh klären: Einzelunternehmen/GbR sind schnell, GmbH/UG brauchen Notar & Handelsregister. Bei GbR oft alle Gesellschafter nennen.',
    en: 'Pick the legal form early: sole trader/GbR is fast; GmbH/UG need notary & register. GbR often lists all partners.',
  },
  personal: {
    de: 'Namen und Daten wie im Ausweis. Online-Portale verlangen oft eID oder Nutzerkonto zur Identifikation.',
    en: 'Match ID spelling. Online portals often require eID or an account for identity checks.',
  },
  address: {
    de: 'Betriebsadresse kann von der Wohnadresse abweichen. Kontaktdaten braucht das Amt für Rückfragen und Bestätigungen.',
    en: 'Premises may differ from home. Contact details are needed for follow-ups and confirmations.',
  },
  business: {
    de: 'Tätigkeit präzise beschreiben — zu vage Formulierungen lösen Rückfragen aus. Nebenerwerb im Formular ankreuzen, wenn der Hauptjob Vorrang hat.',
    en: 'Describe the activity precisely — vague wording causes follow-ups. Tick secondary occupation if your main job comes first.',
  },
  summary: {
    de: 'Vor dem Absenden alles prüfen. ScanLogic liefert einen Entwurf — einreichen nur über das offizielle Portal Ihrer Kommune.',
    en: 'Review before you finish. ScanLogic produces a draft — file only via your municipality’s official portal.',
  },
}

export function getGuideSections(lang = 'de') {
  return GUIDE_SECTIONS[lang] || GUIDE_SECTIONS.en
}

export function getChecklist(lang = 'de') {
  return CHECKLIST_ITEMS[lang] || CHECKLIST_ITEMS.en
}

export function getCostRows(lang = 'de') {
  return COST_ROWS.map((row) => row[lang] || row.en)
}

export function getStepTip(stepId, lang = 'de') {
  const tip = WIZARD_STEP_TIPS[stepId]
  if (!tip) return ''
  return tip[lang] || tip.en
}
