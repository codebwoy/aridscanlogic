import {
  FileText,
  Receipt,
  FilePenLine,
  FileSignature,
  Settings,
  Scale,
  ScanLine,
} from 'lucide-react'

/** Canonical guide for every main suite area (matches sidebar / bottom nav). */
export const APP_GUIDE_MODULES = [
  {
    id: 'docs',
    icon: FileText,
    titleDe: 'Docs',
    titleEn: 'Docs',
    taglineDe: 'Scan, OCR & Dokumenten-Hub',
    taglineEn: 'Scan, OCR & document hub',
    summaryDe:
      'Docs ist das Eingangstor für alle Papierdokumente. Sie scannen mehrseitige Belege, Verträge oder Briefe mit der Kamera, die KI erkennt Text (OCR) und sortiert alles in Ordnern.',
    summaryEn:
      'Docs is the front door for paper. Multi-page camera scans, AI OCR, folders, search, and export — everything lands here first.',
    featuresDe: [
      'Multi-Page-Scan mit Kantenerkennung und Optimierung',
      'KI-OCR: Titel, Typ, Volltext und Markdown-Export',
      'Ordner, Sterne, Suche über Titel & OCR-Text',
      'PDF- oder ZIP-Export, Massenaktionen',
      'Weiterleitung an Tax Vault oder DocDraft',
    ],
    featuresEn: [
      'Multi-page scan with edge detection & filters',
      'AI OCR: title, type, full text, markdown export',
      'Folders, stars, search across title & OCR',
      'PDF/ZIP export and bulk actions',
      'Send scans to Tax Vault or DocDraft',
    ],
    workflowDe: [
      'Tippen Sie auf „Neuer Scan“ und fotografieren Sie alle Seiten.',
      'Nach der Verarbeitung prüfen Sie OCR und Titel.',
      'Ordnen Sie das Dokument zu (Inbox, Receipts, Contracts …).',
      'Optional: an Tax Vault (Beleg) oder DocDraft (Rechnung) senden.',
    ],
    workflowEn: [
      'Tap “New scan” and capture all pages.',
      'Review OCR, title, and document type.',
      'File into a folder (Inbox, Receipts, Contracts …).',
      'Optionally push to Tax Vault (receipt) or DocDraft (invoice).',
    ],
    connectsDe: ['Tax Vault', 'DocDraft', 'Lawyer AI (Dokument anhängen)'],
    connectsEn: ['Tax Vault', 'DocDraft', 'Lawyer AI (attach document)'],
    tipsDe: [
      'Gute Beleuchtung = bessere OCR.',
      'Nutzen Sie Ordner „Receipts“, bevor Sie Belege in Tax Vault übernehmen.',
    ],
    tipsEn: [
      'Even lighting improves OCR quality.',
      'Use the Receipts folder before sending to Tax Vault.',
    ],
  },
  {
    id: 'tax',
    icon: Receipt,
    titleDe: 'Tax Vault',
    titleEn: 'Tax Vault',
    taglineDe: 'Belege, Fahrtenbuch & Steuerübersicht',
    taglineEn: 'Receipts, mileage & tax overview',
    summaryDe:
      'Tax Vault bündelt betriebliche Ausgaben für die Steuererklärung: gescannte Belege, manuelle Einträge, Kilometer, Kategorien und Schätzungen (Gewerbesteuer, ESt, USt). Der Steuer-Overhead-Hub zeigt Krankenkasse, Gewerbe-Konfiguration und Gesamtbelastung.',
    summaryEn:
      'Tax Vault collects business expenses for tax prep: scanned receipts, manual entries, mileage, categories, and estimates (trade tax, income tax, VAT). The Tax Overhead hub covers Krankenkasse, Gewerbe config, and total burden.',
    featuresDe: [
      'Beleg-Scan mit KI (Händler, Betrag, MwSt, Kategorie)',
      'Manuelle Ausgaben & Fahrtenbuch',
      'Jahresübersicht, geschätzte Steuern, Fristen',
      'Steuer-Overhead: Krankenkasse (GKV/PKV), Gewerbesteuer, USt',
      'BizStart Germany — GewA-1-Formular, Krankenkasse & Website-Rechtliches',
      'Export / verschlüsseltes Backup',
      'Freigabe fürs Steuerberater-Paket',
    ],
    featuresEn: [
      'Receipt scan with AI (vendor, VAT, category)',
      'Manual expenses & mileage log',
      'Annual summary, tax estimates, deadlines',
      'Tax overhead: Krankenkasse (GKV/PKV), trade tax, VAT',
      'BizStart Germany — GewA 1 form, Krankenkasse & website legal pages',
      'Export & encrypted backup',
      'Share package for your accountant',
    ],
    workflowDe: [
      'Profil unter Tax Vault Settings anlegen (Firma, Kleinunternehmer, Krankenkasse …).',
      'Optional: BizStart Germany für Gewerbe-Anmeldung inkl. Krankenkasse-Schritt.',
      'Steuer-Overhead-Hub für KV-, Gewerbe- und USt-Schätzungen nutzen.',
      'Belege scannen, Kategorien prüfen, Export für Steuerberater.',
    ],
    workflowEn: [
      'Set up profile in Tax Vault Settings (business, VAT, Krankenkasse …).',
      'Optional: BizStart Germany for registration incl. Krankenkasse step.',
      'Use Tax Overhead hub for health, trade tax, and VAT estimates.',
      'Scan receipts, confirm categories, export for your tax advisor.',
    ],
    connectsDe: ['Docs (Scan → Beleg)', 'Settings → Tax Vault Settings'],
    connectsEn: ['Docs (scan → receipt)', 'Settings → Tax Vault Settings'],
    tipsDe: [
      'Kleinunternehmer-Status beeinflusst MwSt-Anzeige.',
      'Regelmäßig Backup mit Passphrase erstellen.',
    ],
    tipsEn: [
      'Small-business status affects VAT display.',
      'Create encrypted backups regularly.',
    ],
  },
  {
    id: 'docdraft',
    icon: FilePenLine,
    titleDe: 'DocDraft',
    titleEn: 'DocDraft',
    taglineDe: 'Angebote, Rechnungen & Kunden',
    taglineEn: 'Quotes, invoices & clients',
    summaryDe:
      'DocDraft ist Ihr Rechnungs- und Angebotsmodul mit Live-MwSt-Berechnung, Kunden- und Produktkatalog, wiederkehrenden Rechnungen und PDF-Versand.',
    summaryEn:
      'DocDraft handles quotes and invoices with live VAT math, clients, products, recurring invoices, and PDF send.',
    featuresDe: [
      'Angebot → Rechnung umwandeln',
      '§19 UStG / Kleinunternehmer-Unterstützung',
      'Kunden- & Produktdatenbank',
      'Zahlungsstatus & Berichte',
      'Aus ScanLogic-Docs übernehmen',
    ],
    featuresEn: [
      'Convert quote → invoice',
      '§19 UStG / small-business support',
      'Client & product database',
      'Payment status & reports',
      'Import from Docs scans',
    ],
    workflowDe: [
      'Geschäftsprofil anlegen (Name, USt-ID, Bank).',
      'Kunde wählen, Positionen aus Katalog oder frei eingeben.',
      'PDF erzeugen oder „Senden“ (Demo: Download/Teilen).',
      'Status auf bezahlt/offen pflegen.',
    ],
    workflowEn: [
      'Create business profile (name, VAT ID, bank).',
      'Pick client, add line items from catalog or free text.',
      'Generate PDF or send (demo: download/share).',
      'Track paid/open status.',
    ],
    connectsDe: ['Docs (Scan → Entwurf)', 'Tax Vault (Ausgaben getrennt)'],
    connectsEn: ['Docs (scan → draft)', 'Tax Vault (expenses separate)'],
    tipsDe: [
      'Kleinunternehmer: 0 % MwSt wird automatisch im PDF vermerkt.',
      'Wiederkehrende Rechnungen sparen Zeit bei Abos.',
    ],
    tipsEn: [
      'Small business: 0 % VAT is noted on PDFs automatically.',
      'Use recurring invoices for subscriptions.',
    ],
  },
  {
    id: 'contracts',
    icon: FileSignature,
    titleDe: 'Contracts',
    titleEn: 'Contracts',
    taglineDe: 'Verträge, Vorlagen & Signatur',
    taglineEn: 'Contracts, templates & e-sign',
    summaryDe:
      'Contract Safe verwaltet Vertragsentwürfe aus deutschen Vorlagen (NDA, Freelance, SaaS …), Designer, parallele oder sequenzielle Unterschrift und Audit-Protokoll.',
    summaryEn:
      'Contract Safe manages drafts from German templates, designer, parallel/sequential signing, and audit trail.',
    featuresDe: [
      '6+ Vorlagen (NDA, Freelance, Employment, Impressum, Datenschutz, AVV …)',
      'Visueller Vertrags-Designer',
      'Signatur-Pad (Base64) für Parteien',
      'PDF-Export, Duplikat, Suche',
      'Status: Entwurf → zur Unterschrift → vollständig',
    ],
    featuresEn: [
      '6+ templates (NDA, freelance, employment, Impressum, privacy, AVV …)',
      'Visual contract designer',
      'Signature pad for parties',
      'PDF export, duplicate, search',
      'Status: draft → signing → completed',
    ],
    workflowDe: [
      '„New contract“ oder Vorlage wählen.',
      'Felder ausfüllen, speichern.',
      'Signatur-Flow starten (Reihenfolge beachten).',
      'PDF archivieren; bei Bedarf an Lawyer AI zur Prüfung.',
    ],
    workflowEn: [
      '“New contract” or pick a template.',
      'Fill fields and save.',
      'Start signing flow (mind signing order).',
      'Archive PDF; ask Lawyer AI to review if needed.',
    ],
    connectsDe: ['Lawyer AI (Vertrags-Check)', 'Docs (Archiv-Kopie)'],
    connectsEn: ['Lawyer AI (contract review)', 'Docs (archive copy)'],
    tipsDe: [
      'Sequenzielle Signatur: erst Partei A, dann B.',
      'Kein Ersatz für notariellen Vertrag — rechtliche Prüfung empfohlen.',
    ],
    tipsEn: [
      'Sequential signing: party A before B.',
      'Not a notarized contract — legal review recommended.',
    ],
  },
  {
    id: 'lawyer',
    icon: Scale,
    titleDe: 'Lawyer AI',
    titleEn: 'Lawyer AI',
    taglineDe: 'Herr Müller — Business-Coach',
    taglineEn: 'Herr Müller — business coach',
    summaryDe:
      'Herr Müller ist Ihr KI-Mentor für Finanzen, Steuern, Recht und Strategie (13 Bereiche). Kein lizenzierter Anwalt — Bildungs-Coaching mit Archiv und Fall-Timeline.',
    summaryEn:
      'Herr Müller is your AI mentor for finance, tax, law, and strategy (13 areas). Not a licensed lawyer — educational coaching with archive and case timeline.',
    featuresDe: [
      '13 Fachbereiche & Starter-Karten',
      'Gescanntes Dokument anhängen (aus Docs)',
      'Executive Summary & Transcript-Export',
      'Mehrere „Fälle“ / Konversationen',
      'Live mit Anthropic, sonst Demo-Antworten',
    ],
    featuresEn: [
      '13 domains & starter cards',
      'Attach scanned docs from Docs',
      'Executive summary & transcript export',
      'Multiple cases / conversations',
      'Live with Anthropic, else demo replies',
    ],
    workflowDe: [
      'Bereich wählen oder Frage frei stellen.',
      'Optional Dokument aus Docs anhängen.',
      'Antwort speichern oder Timeline aktualisieren.',
      'Bei echten Mandaten: Steuerberater/Anwalt hinzuziehen.',
    ],
    workflowEn: [
      'Pick a domain or ask freely.',
      'Optionally attach a Doc.',
      'Save replies or update timeline.',
      'For real matters: involve licensed advisors.',
    ],
    connectsDe: ['Docs', 'Contracts', 'Tax Vault', 'BizStart-Themen'],
    connectsEn: ['Docs', 'Contracts', 'Tax Vault', 'BizStart topics'],
    tipsDe: [
      'Kurze, konkrete Fragen liefern bessere Antworten.',
      'Disclaimer beachten — keine Rechtsberatung.',
    ],
    tipsEn: [
      'Short, specific questions work best.',
      'Mind the disclaimer — not legal advice.',
    ],
  },
  {
    id: 'settings',
    icon: Settings,
    titleDe: 'Settings',
    titleEn: 'Settings',
    taglineDe: 'Konto, Premium, Sync & PWA',
    taglineEn: 'Account, premium, sync & PWA',
    summaryDe:
      'Einstellungen bündeln Profil, Premium, Tax-Vault-Profil, Supabase-Sync, PWA-Installation und Status von KI/ Datenbank.',
    summaryEn:
      'Settings holds profile, premium, Tax Vault profile, Supabase sync, PWA install, and AI/DB status.',
    featuresDe: [
      'ScanVault Scanner öffnen',
      'Tax Vault Settings (Firmendaten)',
      'Push local → Supabase',
      'App installieren (PWA)',
      'Anthropic- & DB-Status',
    ],
    featuresEn: [
      'Open ScanVault scanner',
      'Tax Vault settings (company data)',
      'Push local data → Supabase',
      'Install app (PWA)',
      'Anthropic & database status',
    ],
    workflowDe: [
      'Premium und Steuerprofil prüfen.',
      'Bei Supabase: DATABASE_URL in .env, dann „Push“.',
      'PWA installieren für Offline-Shell.',
    ],
    workflowEn: [
      'Check premium and tax profile.',
      'For Supabase: DATABASE_URL in .env, then Push.',
      'Install PWA for offline shell.',
    ],
    connectsDe: ['ScanVault', 'Tax Vault', 'Supabase', 'App Guide'],
    connectsEn: ['ScanVault', 'Tax Vault', 'Supabase', 'App Guide'],
    tipsDe: ['Dev-Server nach .env-Änderung neu starten.'],
    tipsEn: ['Restart dev server after .env changes.'],
  },
  {
    id: 'scanvault',
    icon: ScanLine,
    titleDe: 'ScanVault',
    titleEn: 'ScanVault',
    taglineDe: 'Separater Dokumenten-Scanner',
    taglineEn: 'Dedicated document scanner app',
    summaryDe:
      'ScanVault ist der fokussierte Scanner mit Ordnern, Auto-Capture, Batch-ZIP und Share-Links — erreichbar über Settings.',
    summaryEn:
      'ScanVault is the focused scanner with folders, auto-capture, batch ZIP, and share links — open from Settings.',
    featuresDe: [
      'Edge-Detection & Auto-Capture',
      'Ordner & Volltextsuche',
      'Share-Link (7 Tage)',
      'Backup / Demo-Cloud-Sync (Premium)',
    ],
    featuresEn: [
      'Edge detection & auto-capture',
      'Folders & full-text search',
      'Share links (7 days)',
      'Backup / demo cloud sync (premium)',
    ],
    workflowDe: ['Settings → ScanVault → scannen & archivieren.'],
    workflowEn: ['Settings → ScanVault → scan & archive.'],
    connectsDe: ['Docs (ähnliche OCR-Pipeline)'],
    connectsEn: ['Docs (similar OCR pipeline)'],
    tipsDe: ['Ideal für schnelle Einzelscans unterwegs.'],
    tipsEn: ['Great for quick single scans on the go.'],
  },
]

export function getModuleGuide(id) {
  return APP_GUIDE_MODULES.find((m) => m.id === id) ?? null
}

export function formatModule(m, language = 'de') {
  const en = language === 'en'
  return {
    id: m.id,
    title: en ? m.titleEn : m.titleDe,
    tagline: en ? m.taglineEn : m.taglineDe,
    summary: en ? m.summaryEn : m.summaryDe,
    features: en ? m.featuresEn : m.featuresDe,
    workflow: en ? m.workflowEn : m.workflowDe,
    connects: en ? m.connectsEn : m.connectsDe,
    tips: en ? m.tipsEn : m.tipsDe,
    icon: m.icon,
  }
}
