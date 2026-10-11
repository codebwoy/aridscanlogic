/**
 * Amazon KDP — configurable requirements for DE founders (Amazon Hub).
 * Tax rates, VAT thresholds, and file rules change — UI must show lastVerified + ⚠.
 * Guidance only — not tax/legal advice. Not affiliated with Amazon.
 */

export const KDP_CONFIG = {
  lastVerified: '2026-04-11',
  sourceLabel: 'Owner playbook for DE KDP starters — verify in KDP Help & with a Steuerberater',
  independenceDisclaimer: {
    en: 'Not affiliated with Amazon. Not tax or legal advice. Confirm every rate and threshold yourself.',
    de: 'Nicht mit Amazon verbunden. Keine Steuer- oder Rechtsberatung. Jeden Satz und jede Schwelle selbst prüfen.',
  },
  applyUrl: 'https://kdp.amazon.com/',
  bzstUrl: 'https://www.bzst.de/',
  accountRequirements: [
    {
      id: 'amazon_account',
      label: { en: 'Amazon account', de: 'Amazon-Konto' },
      detail: {
        en: 'Existing Amazon.de account works — sign in at kdp.amazon.com',
        de: 'Bestehendes Amazon.de-Konto funktioniert — bei kdp.amazon.com anmelden',
      },
    },
    {
      id: 'legal_name',
      label: { en: 'Full legal name', de: 'Vollständiger Rechtsname' },
      detail: {
        en: 'Your real name or registered publishing / company name',
        de: 'Ihr echter Name oder eingetragener Verlags-/Firmenname',
      },
    },
    {
      id: 'address',
      label: { en: 'Address', de: 'Adresse' },
      detail: {
        en: 'German residential or business address',
        de: 'Deutsche Wohn- oder Geschäftsadresse',
      },
    },
    {
      id: 'phone',
      label: { en: 'Phone number', de: 'Telefonnummer' },
      detail: {
        en: 'For identity verification',
        de: 'Zur Identitätsprüfung',
      },
    },
    {
      id: 'tax',
      label: { en: 'Tax information', de: 'Steuerdaten' },
      detail: {
        en: 'W-8BEN / W-8BEN-E interview inside KDP (see Tax section)',
        de: 'W-8BEN / W-8BEN-E-Interview in KDP (siehe Steuer-Abschnitt)',
      },
    },
    {
      id: 'bank',
      label: { en: 'Bank account', de: 'Bankkonto' },
      detail: {
        en: 'German IBAN for royalty payouts in EUR',
        de: 'Deutsche IBAN für Royalty-Auszahlungen in EUR',
      },
    },
  ],
  tax: {
    usForms: {
      en: [
        'Complete W-8BEN (individuals) or W-8BEN-E (companies) inside KDP — online, no paper by default',
        'Establishes you as a non-US person and drives the US withholding rate Amazon applies',
        'Have your German Steueridentifikationsnummer ready (registration docs or request via bzst.de)',
      ],
      de: [
        'W-8BEN (Privat) oder W-8BEN-E (Firma) in KDP ausfüllen — online, i. d. R. kein Papier',
        'Weist Sie als Nicht-US-Person aus und steuert den US-Quellensteuer-Satz bei Amazon',
        'Deutsche Steueridentifikationsnummer bereithalten (Meldeunterlagen oder Anforderung über bzst.de)',
      ],
    },
    treatyClaim: {
      value: {
        en: 'Source text often states US–DE treaty may reduce royalty withholding from a default 30% toward 0% for qualifying German residents (ebook + print) — only the rate shown in your completed KDP tax interview counts.',
        de: 'Quelltexte nennen oft: US–DE-Abkommen kann Royalty-Quellensteuer von typisch 30 % Richtung 0 % für qualifizierte DE-Resident:innen senken (E-Book + Print) — maßgeblich ist nur der Satz im abgeschlossenen KDP-Steuerinterview.',
      },
      verifiedNote: {
        en: '⚠ Do not assume 0% forever. Treaty eligibility, product type, and Amazon’s interview result can differ — confirm the rate on your account and with a Steuerberater.',
        de: '⚠ Nicht dauerhaft 0 % annehmen. Abkommen, Produktart und Interview-Ergebnis können abweichen — Satz im Konto und mit Steuerberater prüfen.',
      },
    },
    germanDomestic: {
      en: [
        'Declare KDP royalty income on your Einkommensteuererklärung',
        'Kleinunternehmerregelung may apply below current VAT turnover thresholds — verify € limits each year',
        'Above thresholds: register for Umsatzsteuer as required',
        'Strongly recommended: consult a Steuerberater before your first meaningful royalty payout',
      ],
      de: [
        'KDP-Royalty-Einkünfte in der Einkommensteuererklärung erklären',
        'Kleinunternehmerregelung unterhalb der aktuellen USt-Umsatzgrenzen möglich — €-Grenzen jährlich prüfen',
        'Darüber: Umsatzsteuer-Registrierung wie vorgeschrieben',
        'Dringend empfohlen: Steuerberater vor der ersten nennenswerten Auszahlung',
      ],
    },
    kleinunternehmerHint: {
      value: {
        en: 'Older playbooks often cite ~€22,000/year as a Kleinunternehmer reference — German VAT thresholds change; always verify the current figures (UStG / Finanzamt).',
        de: 'Ältere Playbooks nennen oft ca. 22.000 €/Jahr als Kleinunternehmer-Referenz — USt-Schwellen ändern sich; aktuelle Werte (UStG / Finanzamt) prüfen.',
      },
      verifiedNote: {
        en: '⚠ Threshold figure is not a hard-coded legal fact in this app — confirm current Kleinunternehmer limits before relying on them.',
        de: '⚠ Schwellenwert ist hier keine fest verdrahtete Rechtsnorm — aktuelle Kleinunternehmer-Grenzen prüfen.',
      },
    },
  },
  bookRequirements: [
    {
      label: { en: 'Manuscript file', de: 'Manuskript-Datei' },
      detail: {
        en: 'Print: PDF or Word (.doc/.docx). Ebook: EPUB (MOBI may appear only in older docs)',
        de: 'Print: PDF oder Word (.doc/.docx). E-Book: EPUB (MOBI nur noch in älteren Docs)',
      },
    },
    {
      label: { en: 'Cover file', de: 'Cover-Datei' },
      detail: {
        en: 'High-resolution PDF or JPG; or free KDP Cover Creator',
        de: 'Hochauflösendes PDF oder JPG; oder kostenloser KDP Cover Creator',
      },
    },
    {
      label: { en: 'ISBN', de: 'ISBN' },
      detail: {
        en: 'KDP can provide a free ISBN — usually fine for DE-language titles; verify current KDP ISBN rules',
        de: 'KDP kann eine kostenlose ISBN vergeben — für DE-Titel meist ok; aktuelle KDP-ISBN-Regeln prüfen',
      },
    },
    {
      label: { en: 'Book title', de: 'Buchtitel' },
      detail: {
        en: 'Unique; must not infringe trademarks',
        de: 'Einzigartig; keine Markenrechte verletzen',
      },
    },
    {
      label: { en: 'Description', de: 'Beschreibung' },
      detail: {
        en: 'Sales copy in German for Amazon.de listings',
        de: 'Verkaufstext auf Deutsch für Amazon.de-Listings',
      },
    },
    {
      label: { en: 'Keywords', de: 'Keywords' },
      detail: {
        en: 'Up to 7 keyword fields to help discovery on Amazon.de',
        de: 'Bis zu 7 Keyword-Felder für die Auffindbarkeit auf Amazon.de',
      },
    },
    {
      label: { en: 'Categories', de: 'Kategorien' },
      detail: {
        en: 'Up to 3 categories (e.g. Juvenile Fiction → Social Themes → Emotions)',
        de: 'Bis zu 3 Kategorien (z. B. Juvenile Fiction → Social Themes → Emotions)',
      },
    },
    {
      label: { en: 'Age range', de: 'Altersgruppe' },
      detail: {
        en: 'Set target ages (e.g. 2–5 or 3–7 for picture books)',
        de: 'Zielalter setzen (z. B. 2–5 oder 3–7 für Bilderbücher)',
      },
    },
    {
      label: { en: 'Language', de: 'Sprache' },
      detail: {
        en: 'German (Deutsch) for German-language books',
        de: 'Deutsch für deutschsprachige Bücher',
      },
    },
    {
      label: { en: 'Rights declaration', de: 'Rechteerklärung' },
      detail: {
        en: 'You confirm you own (or control) the rights to publish the content',
        de: 'Sie bestätigen, dass Sie die Rechte zur Veröffentlichung besitzen/kontrollieren',
      },
    },
  ],
  pictureBookTech: {
    verifiedNote: {
      en: '⚠ Trim, bleed, DPI, and page rules: use KDP’s calculator for your trim + page count. StoryForge preflight uses the same style of math with lastVerified specs.',
      de: '⚠ Trim, Bleed, DPI und Seitenregeln: KDP-Rechner für Ihr Format + Seitenzahl nutzen. StoryForge-Preflight nutzt vergleichbare Mathematik mit lastVerified-Specs.',
    },
    rows: [
      {
        label: { en: 'Print resolution', de: 'Druckauflösung' },
        detail: {
          en: 'Aim for ~300 DPI at final print size (trim + bleed)',
          de: 'Ca. 300 DPI bei finaler Druckgröße (Trim + Bleed) anstreben',
        },
      },
      {
        label: { en: 'Bleed', de: 'Beschnitt' },
        detail: {
          en: 'Typically 0.125″ (3.175 mm) when full-bleed art — confirm in KDP',
          de: 'Typisch 0,125″ (3,175 mm) bei randabfallender Grafik — in KDP bestätigen',
        },
      },
      {
        label: { en: 'Common kids trims', de: 'Häufige Kinderbuch-Formate' },
        detail: {
          en: '8.5×8.5″ square or 8.5×11″ — match StoryForge project trim',
          de: '8,5×8,5″ quadratisch oder 8,5×11″ — zum StoryForge-Projekttrim passend',
        },
      },
      {
        label: { en: 'Page count', de: 'Seitenzahl' },
        detail: {
          en: 'Even page counts for print; picture books often 24 / 32 / 40',
          de: 'Gerade Seitenzahl für Print; Bilderbücher oft 24 / 32 / 40',
        },
      },
      {
        label: { en: 'Character consistency', de: 'Figuren-Konsistenz' },
        detail: {
          en: 'Pin one Character Turbo anchor in StoryForge — every page from that anchor',
          de: 'Einen Character-Turbo-Anker in StoryForge pinnen — jede Seite von diesem Anker',
        },
      },
      {
        label: { en: 'AI disclosure', de: 'KI-Disclosure' },
        detail: {
          en: 'Disclose AI-generated images at upload if KDP requires it for your case (verify Help)',
          de: 'KI-Bilder beim Upload angeben, wenn KDP das für Ihren Fall verlangt (Help prüfen)',
        },
      },
      {
        label: { en: 'Interior file', de: 'Innenteil-Datei' },
        detail: {
          en: 'Export print-ready PDF from StoryForge Canvas after preflight passes',
          de: 'Druckfertiges PDF aus StoryForge Canvas nach bestandenem Preflight exportieren',
        },
      },
      {
        label: { en: 'Cover', de: 'Cover' },
        detail: {
          en: 'Wrap cover (front + spine + back) — prepare separately if studio cover export is Phase 2',
          de: 'Umschlag (Vorderseite + Rücken + Rückseite) — ggf. separat, wenn Cover-Export noch Phase 2 ist',
        },
      },
    ],
  },
  startThisWeek: {
    en: [
      'Create / sign in to KDP and start the tax interview',
      'Confirm Steuer-ID + German IBAN ready',
      'Open StoryForge Launchpad course (desktop) for format + manuscript steps',
      'Apply to Merch in parallel (see Merch full guide)',
    ],
    de: [
      'KDP anlegen / anmelden und Steuerinterview starten',
      'Steuer-ID + deutsche IBAN bereithalten',
      'StoryForge-Launchpad-Kurs (Desktop) für Format + Manuskript öffnen',
      'Merch parallel beantragen (siehe Merch-Vollguide)',
    ],
  },
}
