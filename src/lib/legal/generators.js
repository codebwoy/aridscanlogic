/**
 * Draft generators for Impressum, Datenschutzerklärung, and AVV.
 * Educational drafts only — must be reviewed by a licensed Rechtsanwalt.
 */

import { formatAddress } from './profile'

const DISCLAIMER_DE =
  '⚠️ Entwurf zur Vorbereitung — keine Rechtsberatung. Vor Veröffentlichung von einem Rechtsanwalt prüfen lassen.'
const DISCLAIMER_EN =
  '⚠️ Draft for preparation only — not legal advice. Have a licensed lawyer review before publishing.'

function rep(profile, key, fallback = '[BITTE ERGÄNZEN]') {
  const v = profile[key]
  return v && String(v).trim() ? String(v).trim() : fallback
}

function repQ(q, key, fallback = '[BITTE ERGÄNZEN]') {
  const v = q[key]
  return v && String(v).trim() ? String(v).trim() : fallback
}

export function generateImpressum(profile, lang = 'de') {
  const addr = formatAddress(profile)
  const isCompany = ['gmbh', 'ug', 'gbr'].includes(profile.legalStructure)
  const responsible = isCompany
    ? `${rep(profile, 'businessName')} — vertreten durch ${rep(profile, 'ownerName')}`
    : rep(profile, 'ownerName')

  if (lang === 'en') {
    return `${DISCLAIMER_EN}

# Imprint (Impressum)

**Information pursuant to § 5 DDG (Digitale-Dienste-Gesetz)**

**Service provider / responsible person:**
${responsible}

**Address:**
${addr}
(No P.O. box — physical address required)

**Contact:**
Phone: ${rep(profile, 'phone')}
E-mail: ${rep(profile, 'email')}
${profile.website ? `Website: ${profile.website}` : ''}

**Legal form:** ${profile.legalStructureLabel}

${profile.steuernummer ? `**Tax number (Steuernummer):** ${profile.steuernummer}` : '**Tax number:** [to be added after Finanzamt registration]'}
${profile.ustIdNr ? `**VAT ID (USt-IdNr.):** ${profile.ustIdNr}` : ''}
${profile.handelsregister ? `**Commercial register:** ${profile.handelsregister}` : ''}

${profile.activityDescription ? `**Activity:** ${profile.activityDescription}` : ''}

**Dispute resolution:** We are not obliged or willing to participate in dispute resolution proceedings before a consumer arbitration board.

---
_Place this page in your website footer as "Impressum"._`
  }

  return `${DISCLAIMER_DE}

# Impressum

**Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)**

**Diensteanbieter / Verantwortlich:**
${responsible}

**Anschrift:**
${addr}
(Kein Postfach — ladungsfähige Anschrift erforderlich)

**Kontakt:**
Telefon: ${rep(profile, 'phone')}
E-Mail: ${rep(profile, 'email')}
${profile.website ? `Website: ${profile.website}` : ''}

**Rechtsform:** ${profile.legalStructureLabel}

${profile.steuernummer ? `**Steuernummer:** ${profile.steuernummer}` : '**Steuernummer:** [nach Finanzamt-Anmeldung ergänzen]'}
${profile.ustIdNr ? `**USt-IdNr.:** ${profile.ustIdNr}` : ''}
${profile.handelsregister ? `**Handelsregister:** ${profile.handelsregister}` : ''}

${profile.activityDescription ? `**Tätigkeit:** ${profile.activityDescription}` : ''}

**Streitschlichtung:** Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.

---
_Diese Seite im Website-Footer als „Impressum" verlinken._`
}

export function generateDatenschutz(profile, lang = 'de') {
  const q = profile.questionnaire || {}
  const addr = formatAddress(profile)
  const processors = []

  if (q.hostingProvider) processors.push({ name: q.hostingProvider, purpose: 'Hosting' })
  if (q.emailProvider) processors.push({ name: q.emailProvider, purpose: 'E-Mail' })
  if (q.hasAnalytics && q.analyticsProvider)
    processors.push({ name: q.analyticsProvider, purpose: 'Webanalyse' })
  if (q.usesAiApi && q.aiApiProvider)
    processors.push({ name: q.aiApiProvider, purpose: 'KI-Verarbeitung' })
  if (q.usesPaymentProcessor && q.paymentProvider)
    processors.push({ name: q.paymentProvider, purpose: 'Zahlungsabwicklung' })

  const processorList =
    processors.length > 0
      ? processors.map((p) => `- **${p.name}** — ${p.purpose}`).join('\n')
      : lang === 'en'
        ? '- [List all hosting, email, analytics, and other processors]'
        : '- [Alle Hosting-, E-Mail-, Analyse- und sonstigen Auftragsverarbeiter auflisten]'

  const sections = []

  if (lang === 'en') {
    sections.push(`${DISCLAIMER_EN}

# Privacy Policy (Datenschutzerklärung)

**Controller pursuant to Art. 4(7) GDPR:**
${rep(profile, 'businessName')}
${addr}
E-mail: ${rep(profile, 'email')}

## 1. Overview
This privacy policy explains how we process personal data on ${rep(profile, 'website', 'our website')} in accordance with the GDPR (DSGVO).

## 2. Data we collect
- **Server log files:** IP address, browser type, date/time, pages viewed (legitimate interest / Art. 6(1)(f) GDPR)
${q.hasContactForm ? '- **Contact form:** name, e-mail, message content (Art. 6(1)(b) GDPR — pre-contractual measures)' : ''}
${q.hasNewsletter ? '- **Newsletter:** e-mail address (Art. 6(1)(a) GDPR — consent)' : ''}

## 3. Cookies & tracking
${q.hasCookies || q.hasAnalytics ? `We use cookies/tracking tools. **Consent is required** for non-essential cookies (TTDSG §25).\n${q.analyticsProvider ? `Analytics: ${q.analyticsProvider}` : ''}\nConfigure a cookie consent banner before going live.` : 'We only use technically necessary cookies. No marketing or analytics cookies without prior consent.'}

## 4. Processors (Art. 28 GDPR)
${processorList}

## 5. Retention
Data is deleted when the purpose no longer applies or statutory retention periods expire.

## 6. Your rights
You have the right to access, rectification, erasure, restriction, portability, and objection (Art. 15–21 GDPR). Contact: ${rep(profile, 'email')}. You may lodge a complaint with your supervisory authority.

## 7. Changes
We may update this policy. The current version is always published on our website.

---
_Link as "Datenschutz" in your website footer. Set up cookie consent if using analytics or marketing cookies._`)
  } else {
    sections.push(`${DISCLAIMER_DE}

# Datenschutzerklärung

**Verantwortlicher gemäß Art. 4 Nr. 7 DSGVO:**
${rep(profile, 'businessName')}
${addr}
E-Mail: ${rep(profile, 'email')}

## 1. Überblick
Diese Datenschutzerklärung informiert über die Verarbeitung personenbezogener Daten auf ${rep(profile, 'website', 'unserer Website')} gemäß DSGVO.

## 2. Erhobene Daten
- **Server-Logdateien:** IP-Adresse, Browsertyp, Datum/Uhrzeit, aufgerufene Seiten (berechtigtes Interesse / Art. 6 Abs. 1 lit. f DSGVO)
${q.hasContactForm ? '- **Kontaktformular:** Name, E-Mail, Nachricht (Art. 6 Abs. 1 lit. b DSGVO — vorvertragliche Maßnahmen)' : ''}
${q.hasNewsletter ? '- **Newsletter:** E-Mail-Adresse (Art. 6 Abs. 1 lit. a DSGVO — Einwilligung)' : ''}

## 3. Cookies & Tracking
${q.hasCookies || q.hasAnalytics ? `Wir setzen Cookies/Tracking-Tools ein. Für nicht notwendige Cookies ist **Einwilligung erforderlich** (TTDSG §25).\n${q.analyticsProvider ? `Analyse: ${q.analyticsProvider}` : ''}\nVor Live-Schaltung Cookie-Banner konfigurieren.` : 'Wir verwenden nur technisch notwendige Cookies. Keine Marketing- oder Analyse-Cookies ohne vorherige Einwilligung.'}

## 4. Auftragsverarbeiter (Art. 28 DSGVO)
${processorList}

## 5. Speicherdauer
Daten werden gelöscht, sobald der Zweck entfällt oder gesetzliche Aufbewahrungsfristen ablaufen.

## 6. Ihre Rechte
Sie haben Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO). Kontakt: ${rep(profile, 'email')}. Beschwerderecht bei der zuständigen Aufsichtsbehörde.

## 7. Änderungen
Wir können diese Erklärung anpassen. Die aktuelle Fassung ist stets auf der Website veröffentlicht.

---
_Im Website-Footer als „Datenschutz" verlinken. Bei Analyse-/Marketing-Cookies Cookie-Einwilligung einrichten._`)
  }

  return sections.join('\n')
}

export function generateAvv(profile, lang = 'de') {
  const q = profile.questionnaire || {}
  const addr = formatAddress(profile)
  const isAgency = q.isWebAgency

  const controllerName = isAgency
    ? repQ(q, 'clientCompanyName', '[Auftraggeber / Kunde]')
    : rep(profile, 'businessName')
  const controllerContact = isAgency
    ? `${repQ(q, 'clientContactName')} — ${repQ(q, 'clientEmail')}`
    : `${rep(profile, 'ownerName')} — ${rep(profile, 'email')}`
  const controllerAddress = isAgency ? repQ(q, 'clientAddress', addr) : addr

  const processorName = isAgency ? rep(profile, 'businessName') : '[Hosting-/IT-Dienstleister]'
  const processorContact = isAgency
    ? `${rep(profile, 'ownerName')} — ${rep(profile, 'email')}`
  : '[Name, E-Mail des Auftragsverarbeiters]'

  if (lang === 'en') {
    return `${DISCLAIMER_EN}

# Data Processing Agreement (AVV / DPA)
## Pursuant to Art. 28 GDPR

**Between:**

**Controller (Auftraggeber):**
${controllerName}
${controllerAddress}
Contact: ${controllerContact}

**and**

**Processor (Auftragsverarbeiter):**
${processorName}
${isAgency ? addr : '[Processor address]'}
Contact: ${processorContact}

## 1. Subject and duration
The processor processes personal data on behalf of the controller for: **${q.processingPurpose || 'Website hosting, maintenance, and form data storage'}**.

Duration: for the term of the main service agreement.

## 2. Nature and purpose of processing
- Hosting website content and databases
${q.hasContactForm ? '- Storing and forwarding contact form submissions' : ''}
- Technical support and backups

## 3. Categories of data subjects & data
- Website visitors (IP, browser data, form entries)
${q.hasNewsletter ? '- Newsletter subscribers (e-mail)' : ''}

## 4. Obligations of the processor
- Process data only on documented instructions (Art. 28(3)(a) GDPR)
- Ensure confidentiality of personnel
- Implement appropriate technical and organisational measures (TOMs)
- Assist with data subject requests
- Delete or return data after contract end
- Notify controller of data breaches without undue delay

## 5. Sub-processors
${q.hostingProvider ? `Approved sub-processor: ${q.hostingProvider}` : '[List sub-processors — requires prior written consent]'}

## 6. Audits
The controller may audit compliance with reasonable notice.

## 7. Signatures

Controller: _________________________ Date: _________

Processor: _________________________ Date: _________

---
_The AVV is a contract between controller and processor — not a public footer page. Have your lawyer finalize before signing._`
  }

  return `${DISCLAIMER_DE}

# Auftragsverarbeitungsvertrag (AVV)
## gemäß Art. 28 DSGVO

**Zwischen:**

**Verantwortlicher (Auftraggeber):**
${controllerName}
${controllerAddress}
Kontakt: ${controllerContact}

**und**

**Auftragsverarbeiter:**
${processorName}
${isAgency ? addr : '[Anschrift des Auftragsverarbeiters]'}
Kontakt: ${processorContact}

## 1. Gegenstand und Dauer
Der Auftragsverarbeiter verarbeitet personenbezogene Daten im Auftrag des Verantwortlichen für: **${q.processingPurpose || 'Website-Hosting, Wartung und Speicherung von Formulardaten'}**.

Dauer: Laufzeit des Hauptvertrags.

## 2. Art und Zweck der Verarbeitung
- Hosting von Website-Inhalten und Datenbanken
${q.hasContactForm ? '- Speicherung und Weiterleitung von Kontaktformular-Eingaben' : ''}
- Technischer Support und Backups

## 3. Kategorien betroffener Personen & Daten
- Website-Besucher (IP, Browserdaten, Formulareingaben)
${q.hasNewsletter ? '- Newsletter-Abonnenten (E-Mail)' : ''}

## 4. Pflichten des Auftragsverarbeiters
- Verarbeitung nur auf dokumentierte Weisung (Art. 28 Abs. 3 lit. a DSGVO)
- Vertraulichkeit des Personals sicherstellen
- Geeignete technische und organisatorische Maßnahmen (TOMs) umsetzen
- Unterstützung bei Betroffenenanfragen
- Löschung oder Rückgabe der Daten nach Vertragsende
- Meldung von Datenschutzverletzungen unverzüglich

## 5. Unterauftragsverarbeiter
${q.hostingProvider ? `Genehmigter Unterauftragsverarbeiter: ${q.hostingProvider}` : '[Unterauftragsverarbeiter auflisten — vorherige schriftliche Zustimmung erforderlich]'}

## 6. Kontrollen
Der Verantwortliche kann die Einhaltung mit angemessener Vorankündigung prüfen.

## 7. Unterschriften

Verantwortlicher: _________________________ Datum: _________

Auftragsverarbeiter: _________________________ Datum: _________

---
_Der AVV ist ein Vertrag zwischen Verantwortlichem und Auftragsverarbeiter — keine öffentliche Footer-Seite. Vor Unterzeichnung vom Rechtsanwalt prüfen lassen._`
}

export function generateAllDrafts(profile, lang = 'de') {
  return {
    impressum: generateImpressum(profile, lang),
    datenschutz: generateDatenschutz(profile, lang),
    avv: generateAvv(profile, lang),
    lastGeneratedAt: new Date().toISOString(),
  }
}
