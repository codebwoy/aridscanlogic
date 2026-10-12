/**
 * Amazon KDP — configurable requirements for DE founders (Amazon Hub).
 * Tax rates, VAT thresholds, and file rules change — UI must show lastVerified + ⚠.
 * Guidance only — not tax/legal advice. Not affiliated with Amazon.
 */

export const KDP_CONFIG = {
  lastVerified: '2026-10-12',
  sourceLabel: 'Owner playbook for DE KDP starters — verify in KDP Help & with a Steuerberater',
  independenceDisclaimer: {
    en: 'Not affiliated with Amazon. Not tax or legal advice. Confirm every rate and threshold yourself. Do not put all eggs in one Amazon basket — see Protect your business below.',
    de: 'Nicht mit Amazon verbunden. Keine Steuer- oder Rechtsberatung. Jeden Satz und jede Schwelle selbst prüfen. Nicht alle Eier in einen Amazon-Korb — siehe Business absichern unten.',
  },
  applyUrl: 'https://kdp.amazon.com/',
  bzstUrl: 'https://www.bzst.de/',
  publishWideGuideId: 'publish-wide-email',
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
    {
      id: 'eggs_basket',
      label: { en: 'Don’t put all eggs in one basket', de: 'Nicht alle Eier in einen Korb' },
      detail: {
        en: 'From day one: keep ebook OFF KDP Select unless you knowingly want 90-day exclusivity; uncheck Expanded Distribution on print; plan Draft2Digital + IngramSpark + email list (see Protect your business)',
        de: 'Ab Tag eins: E-Book OHNE KDP Select (außer bewusst 90-Tage-Exklusivität); Expanded Distribution bei Print abwählen; Draft2Digital + IngramSpark + E-Mail-Liste planen (siehe Business absichern)',
      },
    },
  ],
  /**
   * Beginner insurance: publish wide + email list (full actionable checklist inside KDP requirements).
   * Mirrors the Publish wide + email list Hub playbook so KDP starters see it without hunting.
   */
  eggsInOneBasket: {
    hubGuideId: 'publish-wide-email',
    why: {
      en: [
        'When you rely only on Amazon KDP, your entire business depends on one company',
        'If Amazon changes its algorithms, adjusts royalty rates, or closes an account, your entire publishing income vanishes overnight',
        'Two strategies: (1) Publishing Wide across platforms (2) Building an email list you own direct-to-consumer',
      ],
      de: [
        'Wenn Sie nur auf Amazon KDP setzen, hängt Ihr ganzes Business von einer Firma ab',
        'Wenn Amazon Algorithmen ändert, Royalties anpasst oder ein Konto schließt, verschwindet Ihr gesamtes Publishing-Einkommen über Nacht',
        'Zwei Strategien: (1) Wide über Plattformen (2) E-Mail-Liste, die Sie Direct-to-Consumer besitzen',
      ],
    },
    strategy1Wide: {
      en: [
        'Publishing wide = make your book available everywhere readers buy/read — not Amazon 100% exclusivity',
        'Ebooks: do NOT enroll in KDP Select / Kindle Unlimited (requires 90 days absolute ebook exclusivity)',
        'Standard KDP ebook stays non-exclusive — you may sell the same ebook elsewhere',
        'Upload .epub to Draft2Digital → Apple Books, Kobo (dominant in Canada/Europe/Australia/Asia), Barnes & Noble (Nook), Google Play Books, public libraries (OverDrive, Hoopla, Bibliotheca)',
        'Or later: direct platform accounts (Apple Books for Authors, Kobo Writing Life, Google Play)',
        'Print: use KDP Print for Amazon sales; uncheck Expanded Distribution on KDP',
        'Upload the exact same PDF interior + print cover to IngramSpark (Ingram Content Group = primary bookstore/library distributor worldwide)',
        'German / DACH uploads: Tolino Media (Thalia, Hugendubel, Weltbild / Tolino shops), BoD (Books on Demand / Libri trade), epubli, tredition — keep Select OFF; verify fees + VLB/ISBN terms',
      ],
      de: [
        'Wide = Buch überall verfügbar, wo Leser:innen kaufen/lesen — nicht Amazon 100 % Exklusivität',
        'E-Books: KDP Select / Kindle Unlimited NICHT einschreiben (90 Tage absolute E-Book-Exklusivität)',
        'Standard-KDP-E-Book bleibt nicht-exklusiv — Verkauf woanders möglich',
        '.epub bei Draft2Digital → Apple Books, Kobo (dominant in Kanada/Europa/Australien/Asien), Barnes & Noble (Nook), Google Play Books, Bibliotheken (OverDrive, Hoopla, Bibliotheca)',
        'Oder später: Direktkonten (Apple Books for Authors, Kobo Writing Life, Google Play)',
        'Print: KDP Print für Amazon-Verkäufe; Expanded Distribution bei KDP abwählen',
        'Exakt dieselben PDF-Innenteil + Print-Cover bei IngramSpark (Ingram Content Group = Haupt-Distributor für Buchhandel/Bibliotheken weltweit)',
        'DE-/DACH-Uploads: Tolino Media (Thalia, Hugendubel, Osiander, Weltbild + Telekom), BoD (Hamburg / VLB), epubli, BookRix, tredition — Select AUS; Gebühren + VLB/ISBN prüfen',
      ],
    },
    strategy1Dach: {
      en: [
        'DACH has a massive self-publishing ecosystem independent of Amazon — for readers on Thalia / Hugendubel / Weltbild / Tolino (not Kindle)',
        'Tolino Media — Tolino Alliance (Thalia, Hugendubel, Osiander, Weltbild + Deutsche Telekom); ebooks + audiobooks + libraries; free ebook upload; royalties often cited up to ~87% of net (verify live)',
        'BoD (Hamburg) — print + ebook; ISBN + Verzeichnis Lieferbarer Bücher (VLB) so any DE/AT/CH bookstore can order; ebook often free; print setup often ~€19–€39 (verify live)',
        'epubli (Holtzbrinck, Berlin) — POD + ebook to Tolino/Amazon/Apple/Google + VLB; ebook often free — avoid double Amazon listing',
        'BookRix (Munich) — ebook + indie community; Thalia/Hugendubel/Weltbild/Apple/Kobo/Amazon; free setup + small commission (verify)',
        'Wide fit: KDP (non-Select) + Tolino Media OR Draft2Digital + BoD OR IngramSpark',
        'Impressum required for many DE editions (Pressegesetz) — platforms often provide templates',
      ],
      de: [
        'DACH hat ein großes Selfpublishing-Ökosystem unabhängig von Amazon — für Leser:innen bei Thalia / Hugendubel / Weltbild / Tolino (nicht Kindle)',
        'Tolino Media — Tolino-Allianz (Thalia, Hugendubel, Osiander, Weltbild + Deutsche Telekom); E-Books + Hörbücher + Bibliotheken; E-Book-Upload gratis; Royalties oft bis ca. 87 % netto (live prüfen)',
        'BoD (Hamburg) — Print + E-Book; ISBN + Verzeichnis Lieferbarer Bücher (VLB) damit jede DE/AT/CH-Buchhandlung bestellen kann; E-Book oft gratis; Print-Setup oft ca. 19–39 € (live prüfen)',
        'epubli (Holtzbrinck, Berlin) — POD + E-Book zu Tolino/Amazon/Apple/Google + VLB; E-Book oft gratis — kein Doppel-Amazon-Listing',
        'BookRix (München) — E-Book + Indie-Community; Thalia/Hugendubel/Weltbild/Apple/Kobo/Amazon; Setup gratis + kleine Kommission (prüfen)',
        'Wide-Fit: KDP (ohne Select) + Tolino Media ODER Draft2Digital + BoD ODER IngramSpark',
        'Impressum für viele DE-Ausgaben nötig (Pressegesetz) — Plattformen liefern oft Vorlagen',
      ],
    },
    dachWideFit: [
      {
        label: { en: 'Amazon KDP (non-exclusive)', de: 'Amazon KDP (nicht-exklusiv)' },
        detail: {
          en: 'What it covers: Amazon.de. Key benefit: reaches Amazon Kindle and Prime readers.',
          de: 'Abdeckung: Amazon.de. Vorteil: erreicht Amazon-Kindle- und Prime-Leser:innen.',
        },
      },
      {
        label: { en: 'Tolino Media OR Draft2Digital', de: 'Tolino Media ODER Draft2Digital' },
        detail: {
          en: 'What it covers: Thalia, Hugendubel, Weltbild, Kobo, Apple. Key benefit: captures non-Amazon ebook readers across Germany.',
          de: 'Abdeckung: Thalia, Hugendubel, Weltbild, Kobo, Apple. Vorteil: Nicht-Amazon-E-Book-Leser:innen in ganz DE.',
        },
      },
      {
        label: { en: 'BoD OR IngramSpark', de: 'BoD ODER IngramSpark' },
        detail: {
          en: 'What it covers: VLB catalog, German physical bookstores. Key benefit: local brick-and-mortar bookstores can order physical print copies.',
          de: 'Abdeckung: VLB-Katalog, physische DE-Buchhandlungen. Vorteil: lokale Buchhandlungen können physische Print-Exemplare bestellen.',
        },
      },
    ],
    dachDomesticReqs: {
      impressum: {
        en: [
          'Pressegesetz: every book distributed or printed in Germany needs an Impressum (legal publisher page) with a valid physical address',
          'Challenge: without a publisher address you are often required to put your personal home address inside the book',
          'BoD & Tolino Media ISBN → they act as publisher of record; terms often allow listing their company address so your home address stays private (verify terms)',
          'Self-provided / own ISBN → your physical business address or a recognized German Impressum-Service (proxy address)',
        ],
        de: [
          'Pressegesetz: jedes in DE verbreitete/gedruckte Buch braucht ein Impressum (rechtliche Verlagsseite) mit gültiger physischer Adresse',
          'Herausforderung: ohne Verlagsadresse oft private Wohnadresse im Buch nötig',
          'BoD- & Tolino-Media-ISBN → sie treten als Verleger auf; AGB erlauben oft deren Firmenadresse, damit Privatadresse privat bleibt (AGB prüfen)',
          'Eigene ISBN → physische Geschäftsadresse oder anerkannter deutscher Impressum-Service (Proxy-Adresse)',
        ],
      },
      buchpreisbindung: {
        en: [
          'Buchpreisbindung: you cannot set different retail prices for the exact same book format across stores',
          'If your ebook is €4.99 on Amazon.de, it must also be €4.99 on Tolino, Thalia, Hugendubel, and Apple Books',
          'Discounting on one platform while full price on another is illegal in the German market (⚠ verify print vs ebook nuances)',
        ],
        de: [
          'Buchpreisbindung: für dasselbe Buchformat keinen unterschiedlichen Ladenpreis über Shops',
          'E-Book zu 4,99 € auf Amazon.de muss auch 4,99 € auf Tolino, Thalia, Hugendubel und Apple Books sein',
          'Rabatt auf einer Plattform bei Vollpreis auf einer anderen ist im DE-Markt unzulässig (⚠ Print- vs E-Book-Nuancen prüfen)',
        ],
      },
      accountAdmin: {
        en: [
          'Valid passport / national ID for platform identity verification',
          'SEPA bank account (IBAN) — European platforms pay via direct SEPA transfers in EUR',
          'Steuernummer or Umsatzsteuer-ID (USt-IdNr.) as Freiberufler (own books — typically no Gewerbe; see Tax playbook)',
          'Kleinunternehmerregelung (§ 19 UStG): when eligible, check that you do not charge VAT — platform handles end-customer tax on net payouts',
          'International / non-DE residents: Reverse Charge VAT with home-country TIN or VAT ID',
        ],
        de: [
          'Gültiger Reisepass / Personalausweis zur Identitätsprüfung',
          'SEPA-Bankkonto (IBAN) — europäische Plattformen zahlen per SEPA-Überweisung in EUR',
          'Steuernummer oder Umsatzsteuer-ID (USt-IdNr.) als Freiberufler (eigene Bücher — typisch kein Gewerbe; siehe Steuer-Playbook)',
          'Kleinunternehmerregelung (§ 19 UStG): wenn berechtigt „keine USt“ — Plattform handhabt Endkunden-Steuer auf Netto-Auszahlungen',
          'Internationale / Nicht-DE: Reverse Charge mit TIN oder USt-ID des Heimatlandes',
        ],
      },
      filesDeposit: {
        en: [
          'Ebooks: standard reflowable .epub — DE platforms do not accept Amazon .kfx or .mobi',
          'Print (BoD & epubli): high-resolution print-ready .pdf interior with all fonts embedded',
          'Print cover: high-resolution .pdf wrap (Front + Spine + Back) with precise bleed',
          'Pflichtexemplare: ISBN titles must go to Deutsche Nationalbibliothek (DNB) + regional state library',
          'BoD / Tolino Media typically file deposit copies and DNB cataloging on your behalf (verify)',
        ],
        de: [
          'E-Books: standardmäßiges reflowable .epub — DE-Plattformen akzeptieren kein Amazon-.kfx oder -.mobi',
          'Print (BoD & epubli): hochauflösendes druckfertiges .pdf-Innenteil mit allen Schriften eingebettet',
          'Print-Cover: hochauflösendes Umschlag-.pdf (Vorderseite + Rücken + Rückseite) mit präzisem Bleed',
          'Pflichtexemplare: ISBN-Titel an Deutsche Nationalbibliothek (DNB) + Landesbibliothek',
          'BoD / Tolino Media übernehmen Ablieferung und DNB-Katalogisierung meist für Sie (prüfen)',
        ],
      },
      checklist: [
        {
          label: { en: 'Legal contact', de: 'Rechtlicher Kontakt' },
          detail: {
            en: 'German Impressum page inside the book (BoD/Tolino publisher-of-record address, or your address / Impressum-Service)',
            de: 'Deutsches Impressum im Buch (BoD/Tolino als Verleger-Adresse, oder Ihre Adresse / Impressum-Service)',
          },
        },
        {
          label: { en: 'Pricing', de: 'Preis' },
          detail: {
            en: 'Universal Euro price across platforms (Buchpreisbindung) — e.g. €4.99 everywhere for the same ebook format',
            de: 'Einheitlicher Euro-Preis über Plattformen (Buchpreisbindung) — z. B. 4,99 € überall für dasselbe E-Book-Format',
          },
        },
        {
          label: { en: 'Banking', de: 'Banking' },
          detail: {
            en: 'IBAN bank account for direct SEPA Euro payouts',
            de: 'IBAN für direkte SEPA-Euro-Auszahlungen',
          },
        },
        {
          label: { en: 'Tax info', de: 'Steuerdaten' },
          detail: {
            en: 'Tax ID (Steuernummer) or VAT status / Kleinunternehmer / Reverse Charge TIN',
            de: 'Steuernummer oder USt-Status / Kleinunternehmer / Reverse-Charge-TIN',
          },
        },
        {
          label: { en: 'File types', de: 'Dateitypen' },
          detail: {
            en: '.epub for digital ebooks; .pdf for print-on-demand (interior + wrap cover)',
            de: '.epub für digitale E-Books; .pdf für Print-on-Demand (Innenteil + Umschlag)',
          },
        },
      ],
    },
    strategy2Email: {
      en: [
        'When a reader buys on Amazon, Apple, or Kobo, that platform keeps their email — you do not know who bought your book',
        'Lead magnet = free bonus for someone who enjoyed the book (kids: coloring/activity sheets, reward chart, bilingual poster, short story; non-fiction: PDF cheat sheet/checklist/template, resource directory, video tutorial)',
        'ESP: MailerLite, ConvertKit (Kit), or Mailchimp → landing page (“Enter your email to download your free bonus activity pack!”) → automated welcome email with PDF link',
        'Front matter CTA: FREE BONUS FOR READERS — Download your free printable activity kit at: www.yourwebsite.com/bonus',
        'Back matter CTA: Thank You for Reading! Get your exclusive bonus materials at www.yourwebsite.com/bonus. If you enjoyed this book, please leave an honest review on Amazon or Goodreads!',
      ],
      de: [
        'Kauf auf Amazon, Apple oder Kobo: die Plattform behält die E-Mail — Sie wissen nicht, wer Ihr Buch gekauft hat',
        'Lead-Magnet = Gratis-Bonus (Kids: Malvorlagen/Activity, Belohnungstabelle, zweisprachiges Poster, Kurzgeschichte; Non-Fiction: PDF-Cheat-Sheet/Checkliste/Vorlage, Ressourcen, Video)',
        'ESP: MailerLite, ConvertKit (Kit) oder Mailchimp → Landingpage („E-Mail eingeben und Gratis-Activity-Pack laden!“) → automatische Welcome-Mail mit PDF-Link',
        'Front-Matter-CTA: GRATIS-BONUS FÜR LESER:INNEN — druckbares Activity-Kit unter: www.ihrewebsite.de/bonus',
        'Back-Matter-CTA: Danke fürs Lesen! Bonus-Materialien unter www.ihrewebsite.de/bonus. Bitte ehrliche Rezension auf Amazon oder Goodreads!',
      ],
    },
    comparison: [
      {
        label: { en: 'Platform risk', de: 'Plattform-Risiko' },
        detail: {
          en: 'Amazon Exclusive (KDP Select): High — one account termination stops all income. Wide + Email List: Low — diversified.',
          de: 'Amazon Exclusive (KDP Select): Hoch — eine Kontokündigung stoppt alles. Wide + E-Mail-Liste: Niedrig — gestreut.',
        },
      },
      {
        label: { en: 'Audience control', de: 'Audience-Kontrolle' },
        detail: {
          en: 'Exclusive: Amazon owns customer records. Wide + Email List: You own your subscriber list.',
          de: 'Exclusive: Amazon besitzt Kundendaten. Wide + E-Mail-Liste: Sie besitzen die Abonnentenliste.',
        },
      },
      {
        label: { en: 'Market reach', de: 'Marktreichweite' },
        detail: {
          en: 'Exclusive: primarily Kindle. Wide + Email List: Global (Apple, Kobo, Libraries, Bookstores, Direct Website).',
          de: 'Exclusive: vor allem Kindle. Wide + E-Mail-Liste: Global (Apple, Kobo, Bibliotheken, Buchhandel, eigene Website).',
        },
      },
      {
        label: { en: 'New book launches', de: 'Neue Buch-Launches' },
        detail: {
          en: 'Exclusive: reliant on Amazon algorithms. Wide + Email List: one email drives day-one sales.',
          de: 'Exclusive: abhängig von Amazon-Algorithmen. Wide + E-Mail-Liste: eine E-Mail für Day-One-Sales.',
        },
      },
    ],
    links: [
      { label: 'Draft2Digital', url: 'https://www.draft2digital.com/' },
      { label: 'IngramSpark', url: 'https://www.ingramspark.com/' },
      { label: 'Tolino Media', url: 'https://www.tolino-media.de/' },
      { label: 'BoD', url: 'https://www.bod.de/' },
      { label: 'epubli', url: 'https://www.epubli.de/' },
      { label: 'BookRix', url: 'https://www.bookrix.de/' },
      { label: 'tredition', url: 'https://tredition.de/' },
      { label: 'MVB / VLB', url: 'https://www.mvb-online.de/' },
      { label: 'Deutsche Nationalbibliothek', url: 'https://www.dnb.de/' },
      { label: 'KDP Select', url: 'https://kdp.amazon.com/en_US/help/topic/G200798990' },
      { label: 'MailerLite', url: 'https://www.mailerlite.com/' },
      { label: 'Kit (ConvertKit)', url: 'https://kit.com/' },
      { label: 'Mailchimp', url: 'https://mailchimp.com/' },
    ],
    verifiedNote: {
      en: '⚠ Fees, Select rules, Expanded Distribution, DE platform contracts, and ESP/GDPR wording change — verify live terms. Full templates + DACH platform table: open Publish wide + email list playbook.',
      de: '⚠ Gebühren, Select-Regeln, Expanded Distribution, DE-Plattform-Verträge und ESP/DSGVO ändern sich — live prüfen. Volle Vorlagen + DACH-Plattform-Tabelle: Playbook „Wide publizieren + E-Mail-Liste“ öffnen.',
    },
  },
  tax: {
    hubGuideId: 'tax-de',
    usForms: {
      en: [
        'Complete W-8BEN (individuals) or W-8BEN-E (companies) inside KDP — online, no paper by default',
        'Establishes you as a non-US person and drives the US withholding rate Amazon applies',
        'Have your German Steueridentifikationsnummer ready (registration docs or request via bzst.de) — plus Steuernummer / USt-IdNr. once Finanzamt issues them',
      ],
      de: [
        'W-8BEN (Privat) oder W-8BEN-E (Firma) in KDP ausfüllen — online, i. d. R. kein Papier',
        'Weist Sie als Nicht-US-Person aus und steuert den US-Quellensteuer-Satz bei Amazon',
        'Deutsche Steueridentifikationsnummer bereithalten (Meldeunterlagen oder bzst.de) — plus Steuernummer / USt-IdNr., sobald das Finanzamt sie erteilt',
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
    /** Freiberufler tax registration for DE authors (beyond Amazon W-8BEN). */
    authorRegistration: {
      intro: {
        en: 'You do NOT need a Gewerbe to publish your own books — but personal Steuer-ID alone is NOT enough once you earn royalties. Register as Freiberufler with the Finanzamt.',
        de: 'Sie brauchen KEIN Gewerbe zum Veröffentlichen eigener Bücher — aber die persönliche Steuer-ID allein reicht NICHT, sobald Royalties fließen. Als Freiberufler beim Finanzamt anmelden.',
      },
      verifiedNote: {
        en: '⚠ Not tax advice. Freiberufler vs Gewerbe and Kleinunternehmer thresholds depend on your case — confirm with Steuerberater / Finanzamt. Full playbook: Tax for DE publishers.',
        de: '⚠ Keine Steuerberatung. Freiberufler vs Gewerbe und Kleinunternehmer-Schwellen sind fallabhängig — mit Steuerberater / Finanzamt klären. Volles Playbook: Steuern für DE-Publisher.',
      },
      gewerbeVsFreelance: {
        en: [
          '§ 18 EStG: writing + self-publishing your own original literary works is typically a freie freiberufliche Tätigkeit (freelance artistic/literary)',
          'No Gewerbeanmeldung with the Gewerbeamt while you publish own books via KDP, Tolino Media, BoD, Draft2Digital and earn Tantiemen / author self-employment income',
          'Can become Gewerbe if you bulk-buy print and sell via your own e-commerce shop, sell merch (t-shirts, mugs), or run a publishing house for other authors',
        ],
        de: [
          '§ 18 EStG: Schreiben + Selfpublishing eigener literarischer Werke typisch als freie freiberufliche Tätigkeit',
          'Keine Gewerbeanmeldung beim Gewerbeamt, solange Sie eigene Bücher über KDP, Tolino Media, BoD, Draft2Digital veröffentlichen und Tantiemen / selbstständige Autoreneinkünfte erzielen',
          'Gewerbe möglich bei Mengen-Einkauf Print + Verkauf über eigenen Online-Shop, Merch (T-Shirts, Tassen) oder Verlag für andere Autor:innen',
        ],
      },
      taxNumbers: {
        en: [
          'Steuer-ID / Identifikationsnummer: 11 digits (e.g. 12 345 678 901) — lifelong personal ID; NOT enough alone for self-employed author income',
          'Steuernummer: 10–11 digits with slashes (e.g. 15/123/45678) — from local Finanzamt for freelance revenue; required after Fragebogen zur steuerlichen Erfassung',
          'Umsatzsteuer-ID / USt-IdNr.: DE + 9 digits (e.g. DE123456789) — request free on the Fragebogen; helps EU Reverse Charge royalties from KDP (Luxembourg), Draft2Digital (US), Apple Books',
        ],
        de: [
          'Steuer-ID / Identifikationsnummer: 11 Ziffern (z. B. 12 345 678 901) — lebenslange persönliche ID; allein NICHT genug für selbstständige Autoreneinkünfte',
          'Steuernummer: 10–11 Ziffern mit Schrägstrichen (z. B. 15/123/45678) — vom lokalen Finanzamt für freiberufliche Einnahmen; nötig nach Fragebogen zur steuerlichen Erfassung',
          'Umsatzsteuer-ID / USt-IdNr.: DE + 9 Ziffern (z. B. DE123456789) — kostenlos im Fragebogen beantragen; hilft bei EU-Reverse-Charge-Royalties von KDP (Luxemburg), Draft2Digital (US), Apple Books',
        ],
      },
      setupSteps: {
        en: [
          'Submit Fragebogen zur steuerlichen Erfassung via ELSTER (or Accountable / Sorted) — activity: Freiberufliche Autorin / Freiberuflicher Autor + estimated first-year income',
          'Opt into Kleinunternehmerregelung (§ 19 UStG) if eligible — older notes cite ~€22,000 first-year revenue (⚠ verify current thresholds); then typically no VAT charged / no complex monthly VAT returns',
          'In ~2–4 weeks Finanzamt posts Steuernummer + USt-IdNr.',
          'Enter Steuernummer / USt-IdNr. in Amazon KDP, Tolino Media, BoD, Draft2Digital profiles',
        ],
        de: [
          'Fragebogen zur steuerlichen Erfassung über ELSTER (oder Accountable / Sorted) — Tätigkeit: Freiberufliche Autorin / Freiberuflicher Autor + geschätztes Einkommen Jahr 1',
          'Kleinunternehmerregelung (§ 19 UStG) wählen wenn berechtigt — ältere Notizen nennen ca. 22.000 € Umsatz Jahr 1 (⚠ aktuelle Schwellen prüfen); dann typisch keine USt / keine komplexen monatlichen Voranmeldungen',
          'In ca. 2–4 Wochen schickt das Finanzamt Steuernummer + USt-IdNr.',
          'Steuernummer / USt-IdNr. in Amazon KDP, Tolino Media, BoD, Draft2Digital eintragen',
        ],
      },
      checklist: [
        {
          label: { en: 'Gewerbe registration?', de: 'Gewerbeanmeldung?' },
          status: { en: 'Not needed', de: 'Nicht nötig' },
          detail: {
            en: 'Own-book author / self-publisher is typically freiberuflich (§ 18 EStG)',
            de: 'Autor:in eigener Werke typisch freiberuflich (§ 18 EStG)',
          },
        },
        {
          label: { en: 'Personal Steuer-ID only?', de: 'Nur persönliche Steuer-ID?' },
          status: { en: 'Not enough', de: 'Nicht genug' },
          detail: {
            en: 'Register freelance author activity with the Finanzamt',
            de: 'Freiberufliche Autorentätigkeit beim Finanzamt anmelden',
          },
        },
        {
          label: { en: 'Required tax number', de: 'Erforderliche Steuernummer' },
          status: { en: 'Steuernummer', de: 'Steuernummer' },
          detail: {
            en: 'Issued after Fragebogen zur steuerlichen Erfassung',
            de: 'Nach Fragebogen zur steuerlichen Erfassung',
          },
        },
        {
          label: { en: 'Recommended tax ID', de: 'Empfohlene Steuer-ID' },
          status: { en: 'USt-IdNr.', de: 'USt-IdNr.' },
          detail: {
            en: 'B2B cross-border royalties (e.g. KDP Luxembourg) under EU Reverse Charge',
            de: 'B2B-grenzüberschreitende Royalties (z. B. KDP Luxemburg) unter EU-Reverse-Charge',
          },
        },
      ],
    },
    germanDomestic: {
      en: [
        'Declare KDP royalty income on your Einkommensteuererklärung',
        'Personal Steuer-ID alone is not enough — obtain Steuernummer via Fragebogen zur steuerlichen Erfassung as Freiberuflicher Autor',
        'Kleinunternehmerregelung may apply below current VAT turnover thresholds — verify € limits each year',
        'Above thresholds: register for Umsatzsteuer as required',
        'Strongly recommended: consult a Steuerberater before your first meaningful royalty payout',
      ],
      de: [
        'KDP-Royalty-Einkünfte in der Einkommensteuererklärung erklären',
        'Persönliche Steuer-ID allein reicht nicht — Steuernummer per Fragebogen zur steuerlichen Erfassung als Freiberuflicher Autor holen',
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
    links: [
      { label: 'ELSTER', url: 'https://www.elster.de/' },
      { label: 'BzSt', url: 'https://www.bzst.de/' },
    ],
  },
  /** Compact Plan to Win chain — full pillars in kdp-plan-to-win playbook / PlanToWinPanel. */
  planToWin: {
    hubGuideId: 'kdp-plan-to-win',
    chain: {
      en: 'Niche Selection → Product Superiority → Metadata/SEO → Launch Dynamics → Monetization & Brand Expansion',
      de: 'Nischenwahl → Produktüberlegenheit → Metadaten/SEO → Launch-Dynamik → Monetarisierung & Markenausbau',
    },
    intro: {
      en: 'Optimize every link — great keywords with a weak cover still underperform. Fiction, Non-Fiction, Low/Medium Content.',
      de: 'Jedes Glied optimieren — starke Keywords mit schwachem Cover underperformen trotzdem. Fiction, Non-Fiction, Low/Medium Content.',
    },
    pillars: {
      en: [
        '1 Niche: Broad Category + Specific Audience + Clear Outcome — not “Cookbook for Air Fryers”; winning “Air Fryer Cookbook for Seniors…” — BSR under 100,000; under 1,000–2,000 comps; mine 3-star weaknesses',
        '2 Product: Thumbnail-first ~100×100; genre-match top 10; title = physical cover; no keyword stuffing; A+ Content for ~10%–20% conversion lift',
        '3 SEO: fill all 7 backend keyword slots with longtails (e.g. bilingual children german twi bedtime activity); never cheap/Bestseller brands; narrow BISAC for #1 Best Seller badge',
        '4 Launch: Honeymoon Period Soft Launch (5–15 Advance Reader Copy / ARC reviews) → Exact Match + Product Targeting on 20–30 comps (ACoS under break-even) → Flywheel “Customers who bought this also bought…”',
        '5 Brand: series read-through (Book 1 magnet, Books 2–5); lead magnets; publish wide (Draft2Digital, IngramSpark, Tolino Media, BoD)',
      ],
      de: [
        '1 Nische: Breite Kategorie + Zielgruppe + Ergebnis — nicht „Kochbuch für Heißluftfritteusen“; Gewinner „Heißluftfritteusen-Kochbuch für Senioren…“ — BSR unter 100.000; unter 1.000–2.000 Comps; 3-Sterne-Schwächen',
        '2 Produkt: Thumbnail-first ca. 100×100; Genre-Match Top 10; Titel = physisches Cover; kein Keyword Stuffing; A+ Content für ca. 10–20 % Conversion-Lift',
        '3 SEO: alle 7 Backend-Keyword-Slots mit Longtails füllen; nie cheap/Bestseller/Marken; enge BISAC für #1 Best Seller-Badge',
        '4 Launch: Honeymoon Period Soft Launch (5–15 Advance Reader Copy / ARC-Reviews) → Exact Match + Product Targeting auf 20–30 Comps (ACoS unter Break-even) → Flywheel „Kunden, die dies kauften…“',
        '5 Marke: Serien-Read-through (Buch 1 Magnet, Bücher 2–5); Lead-Magnete; Wide (Draft2Digital, IngramSpark, Tolino Media, BoD)',
      ],
    },
    matrix: [
      {
        metric: { en: 'Catalog focus', de: 'Katalog-Fokus' },
        winning: {
          en: '5–10 high-quality titles — not 100+ low-effort',
          de: '5–10 hochwertige Titel — nicht 100+ Low-Effort',
        },
      },
      {
        metric: { en: 'Niche', de: 'Nische' },
        winning: {
          en: 'Long-tail sub-niches with proven buyers',
          de: 'Longtail-Subnischen mit bewährten Käufer:innen',
        },
      },
      {
        metric: { en: 'Marketing', de: 'Marketing' },
        winning: {
          en: 'PPC + ARC + email list — not luck/random social',
          de: 'PPC + ARC + E-Mail-Liste — nicht Glück/Social',
        },
      },
      {
        metric: { en: 'Risk', de: 'Risiko' },
        winning: {
          en: 'Wide + direct-to-reader mailing list — not 100% KDP',
          de: 'Wide + Direct-to-Reader-Liste — nicht 100 % KDP',
        },
      },
    ],
  },
  /** Compact under-explored Amazon ecosystems — full cards in amazon-alt-ecosystems playbook. */
  altEcosystems: {
    hubGuideId: 'amazon-alt-ecosystems',
    intro: {
      en: 'Beyond KDP / FBA: five less-saturated Amazon lanes — AWS Marketplace, Renewed, Merch, Custom, Business. Pick by skills + capital, not hype.',
      de: 'Jenseits von KDP / FBA: fünf weniger gesättigte Amazon-Spuren — AWS Marketplace, Renewed, Merch, Custom, Business. Nach Skills + Kapital wählen, nicht nach Hype.',
    },
    lanes: {
      en: [
        '1 AWS Marketplace: B2C→B2B SaaS/AI — AWS handles customer billing; Enterprise Budgets; Zero Logistics / Zero Returns; You Host the Software; x-amzn-marketplace-token → ResolveCustomer; stack React/Next + Supabase + @aws-sdk/client-marketplace-metering + SQS/SNS; Cursor IDE + AMMP Create SaaS Product (Flat Monthly / Per-User / Pay-As-You-Go); fee ~3%; Margins 80% - 95%*',
        '2 Amazon Renewed: invite-only refurbished — invoices $50,000 to $100,000 (US often ≥$50k/90d), Buy Box Advantage, resell at 70%–80% of retail value — Skill: Sourcing / Repair / Operations — Margins 40% - 60%*',
        '3 Merch on Demand: Tier System (Tier 10+), ~30–40% acceptance ⚠, Zero Production Cost, High Scale multi-thousand-product catalog — 15% - 25% (Royalty)* — Skill: Niche Graphic Design / SEO',
        '4 Amazon Custom: Defeats Chinese Manufacturers & Automated Bots; No Amazon Returns (preference); gift margins 35% - 50%* — Skill: Personalization / Laser Engraving / POD',
        '5 Amazon Business: Quantity Discounts + Business-Only Pricing + Tax-Exemption; High AOV 50 to 500 units; Repeat Automated Orders — Margins 25% - 40%*',
      ],
      de: [
        '1 AWS Marketplace: B2C→B2B SaaS/KI — AWS handles customer billing; Enterprise Budgets; Zero Logistics / Zero Returns; You Host the Software; x-amzn-marketplace-token → ResolveCustomer; Stack React/Next + Supabase + @aws-sdk/client-marketplace-metering + SQS/SNS; Cursor IDE + AMMP Create SaaS Product (Flat Monthly / Per-User / Pay-As-You-Go); Fee ca. 3 %; Margen 80% - 95%*',
        '2 Amazon Renewed: invite-only Refurbished — Rechnungen $50,000 to $100,000 (US oft ≥50k $/90d), Buy Box Advantage, Verkauf bei 70%–80% of retail value — Skill: Sourcing / Reparatur / Ops — Margen 40% - 60%*',
        '3 Merch on Demand: Tier System (Tier 10+), ca. 30–40 % Annahme ⚠, Zero Production Cost, High Scale multi-thousand-product catalog — 15% - 25% (Royalty)* — Skill: Nischen-Grafikdesign / SEO',
        '4 Amazon Custom: Defeats Chinese Manufacturers & Automated Bots; No Amazon Returns (Geschmack); Geschenk-Margen 35% - 50%* — Skill: Personalisierung / Laser / POD',
        '5 Amazon Business: Quantity Discounts + Business-Only Pricing + Tax-Exemption; High AOV 50 to 500 units; Repeat Automated Orders — Margen 25% - 40%*',
      ],
    },
    matrix: [
      {
        opportunity: { en: 'AWS Marketplace', de: 'AWS Marketplace' },
        margins: { en: '80% - 95%*', de: '80% - 95%*' },
        skill: { en: 'Software / Cloud', de: 'Software / Cloud' },
      },
      {
        opportunity: { en: 'Renewed', de: 'Renewed' },
        margins: { en: '40% - 60%*', de: '40% - 60%*' },
        skill: { en: 'Repair / ops', de: 'Reparatur / Ops' },
      },
      {
        opportunity: { en: 'Custom', de: 'Custom' },
        margins: { en: '35% - 50%*', de: '35% - 50%*' },
        skill: { en: 'Personalization', de: 'Personalisierung' },
      },
      {
        opportunity: { en: 'Business B2B', de: 'Business B2B' },
        margins: { en: '25% - 40%*', de: '25% - 40%*' },
        skill: { en: 'Bulk pricing', de: 'Bulk-Pricing' },
      },
      {
        opportunity: { en: 'Merch', de: 'Merch' },
        margins: { en: '15% - 25% (Royalty)*', de: '15% - 25% (Royalty)*' },
        skill: { en: 'Design / SEO', de: 'Design / SEO' },
      },
      {
        opportunity: { en: 'KDP / FBA (ref.)', de: 'KDP / FBA (Ref.)' },
        margins: { en: '15% - 30%*', de: '15% - 30%*' },
        skill: { en: 'Ads / competition', de: 'Ads / Konkurrenz' },
      },
    ],
    pickPath: {
      en: 'Art/books → Merch+KDP · Maker → Custom · Inventory → Business · Repair capital → Renewed · Developer → AWS',
      de: 'Kunst/Bücher → Merch+KDP · Maker → Custom · Lager → Business · Reparatur-Kapital → Renewed · Developer → AWS',
    },
  },
  /** Five non-obvious KDP operational pitfalls (AI, titles, keywords, ISBN, bleed). */
  hiddenPitfalls: {
    hubGuideId: 'kdp-hidden-pitfalls',
    intro: {
      en: 'Beyond wide distribution, email lists, and DE tax (Steuernummer vs Gewerbe): five critical operational realities that still get beginners suspended or rejected.',
      de: 'Jenseits von Wide, E-Mail-Liste und DE-Steuer (Steuernummer vs Gewerbe): fünf kritische Betriebsrealitäten, an denen Einsteiger:innen trotzdem scheitern.',
    },
    verifiedNote: {
      en: '⚠ Not Amazon Help or legal advice. Confirm AI disclosure, metadata, ISBN, and print specs in current KDP Help.',
      de: '⚠ Kein Amazon-Help und keine Rechtsberatung. KI-Disclosure, Metadaten, ISBN und Print-Specs im aktuellen KDP-Help prüfen.',
    },
    aiDisclosure: {
      en: [
        'AI-Assisted (no disclosure): you wrote/drew the content; AI only for brainstorming, editing, proofreading, formatting, or outlines',
        'AI-Generated (mandatory): AI created actual text, cover, interior art, or translations — even after heavy edits — check the AI-Generated box in KDP',
        'Disclosure is internal to Amazon — never shown to buyers on the product page',
        'Failing to declare AI-generated content can lead to account suspension or termination',
      ],
      de: [
        'KI-unterstützt (keine Disclosure): Sie haben Inhalt selbst geschrieben/gezeichnet; KI nur Brainstorming, Editieren, Korrektur, Format, Outlines',
        'KI-generiert (Pflicht): KI erzeugte Text, Cover, Innenteil oder Übersetzungen — auch nach starker Bearbeitung — KI-generiert-Box in KDP setzen',
        'Disclosure bleibt intern bei Amazon — nie sichtbar für Käufer:innen auf der Produktseite',
        'Unterlassene Angabe kann zu Kontosperrung oder Kündigung führen',
      ],
    },
    titleSubtitle: {
      en: [
        'Title + subtitle must match the exact text on your physical cover',
        'Keyword stuffing / promo lists in subtitles (e.g. “…Best Seller Gift Idea”) is a top cause of automated account bans',
        'Safe subtitle: descriptive/stylistic only (e.g. “A Bilingual German-Twi Story for Young Readers”)',
        'Put marketing search terms in the 7 backend keyword slots — not title/subtitle',
      ],
      de: [
        'Titel + Untertitel müssen exakt dem Text auf dem physischen Cover entsprechen',
        'Keyword-Stuffing / Promo-Listen im Untertitel (z. B. „…Best Seller Geschenkidee“) gehören zu den Top-Ursachen automatischer Kontosperren',
        'Sicherer Untertitel: nur beschreibend/stilistisch (z. B. „Eine bilinguale Deutsch-Twi-Geschichte…“)',
        'Marketing-Suchbegriffe in die 7 Backend-Keyword-Slots — nicht in Titel/Untertitel',
      ],
    },
    forbiddenKeywords: {
      en: [
        'Competitor / brands: never Disney, Peppa Pig, or popular author names',
        'Promo / sales: Best Seller, Free, On Sale, Discount',
        'Quality claims: High Quality, Top Rated, Award-Winning',
        'Format duplication: Paperback, Book, Print (Amazon already knows the format)',
      ],
      de: [
        'Konkurrenz / Marken: nie Disney, Peppa Pig oder bekannte Autorennamen',
        'Werbung / Sale: Best Seller, Free, On Sale, Discount',
        'Qualitätsclaims: High Quality, Top Rated, Award-Winning',
        'Format-Duplikate: Paperback, Book, Print (Amazon kennt das Format)',
      ],
    },
    isbnOwnership: {
      en: [
        'Free KDP / IngramSpark / Tolino Media ISBN locks that format to the platform; imprint shows Independently Published or Tolino Media',
        'You cannot reuse a free platform ISBN on other platforms',
        'Owned ISBNs via MVB / GeBü / ISBN-Agentur (DE) list you as publisher of record worldwide',
        'Start free for zero overhead; buy owned ISBNs when you need a formal imprint / company name wide',
      ],
      de: [
        'Free-ISBN von KDP / IngramSpark / Tolino Media bindet dieses Format an die Plattform; Imprint zeigt Independently Published oder Tolino Media',
        'Free-Plattform-ISBN nicht auf anderen Plattformen wiederverwenden',
        'Eigene ISBNs über MVB / GeBü / ISBN-Agentur (DE) listen Sie weltweit als Verleger',
        'Start mit Free (null Overhead); eigene ISBNs kaufen, wenn formales Imprint / Firmenname wide nötig',
      ],
    },
    bleedMargins: {
      en: [
        'No Bleed: text/reading books where art does not touch the outer page edge',
        'Bleed: mandatory for children’s picture books, coloring books, illustrated titles that go edge-to-edge',
        'Safety zone: keep text / critical art ≥ 0.375 in (≈ 9.5 mm) from the page edge (deeper toward spine/gutter) or the PDF is rejected',
      ],
      de: [
        'Kein Bleed: Text-/Lesebücher ohne Kunst am äußeren Seitenrand',
        'Bleed: Pflicht für Kinderbilderbücher, Malbücher, illustrierte Titel bis zum Rand',
        'Sicherheitszone: Text / kritische Kunst ≥ 0,375 in (≈ 9,5 mm) vom Seitenrand (zum Bund tiefer) — sonst PDF-Ablehnung',
      ],
    },
    checklist: [
      {
        label: { en: 'AI content', de: 'KI-Inhalt' },
        detail: {
          en: 'Declare AI-generated text/images in KDP (hidden from buyers; protects account)',
          de: 'KI-generierten Text/Bilder in KDP angeben (vor Käufer:innen verborgen; schützt Konto)',
        },
      },
      {
        label: { en: 'Book titles', de: 'Buchtitel' },
        detail: {
          en: 'Match cover text exactly; no promo keywords in subtitle',
          de: 'Cover-Text exakt matchen; keine Promo-Keywords im Untertitel',
        },
      },
      {
        label: { en: 'Backend keywords', de: 'Backend-Keywords' },
        detail: {
          en: 'No brands, format words, or promo terms (e.g. Bestseller)',
          de: 'Keine Marken, Formatwörter oder Promo-Begriffe (z. B. Bestseller)',
        },
      },
      {
        label: { en: 'ISBN ownership', de: 'ISBN-Eigentum' },
        detail: {
          en: 'Free ISBN → platform as publisher; owned ISBN → your imprint',
          de: 'Free-ISBN → Plattform als Verleger; eigene ISBN → Ihr Imprint',
        },
      },
      {
        label: { en: 'File specs', de: 'Dateispezifikationen' },
        detail: {
          en: 'Bleed on for illustrated books; 0.375″ / ~9.5 mm safety from edges',
          de: 'Bleed an für illustrierte Bücher; 0,375″ / ca. 9,5 mm Sicherheitsabstand',
        },
      },
    ],
    links: [
      {
        label: 'Content Guidelines (AI)',
        url: 'https://kdp.amazon.com/en_US/help/topic/G200672390',
      },
      {
        label: 'Book info rules',
        url: 'https://kdp.amazon.com/en_US/help/topic/G201097560',
      },
      {
        label: 'ISBN & imprint',
        url: 'https://kdp.amazon.com/en_US/help/topic/G201354010',
      },
      {
        label: 'Trim / bleed / margins',
        url: 'https://kdp.amazon.com/en_US/help/topic/G201834230',
      },
      { label: 'MVB / VLB', url: 'https://www.mvb-online.de/' },
    ],
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
        en: 'Free KDP / IngramSpark / Tolino Media ISBN → Independently Published or Tolino Media (format locked; cannot reuse elsewhere). Owned via MVB / GeBü / ISBN-Agentur for your imprint wide.',
        de: 'Free-ISBN von KDP / IngramSpark / Tolino Media → Independently Published oder Tolino Media (Format gebunden; nicht woanders nutzbar). Eigene über MVB / GeBü / ISBN-Agentur für Ihr Imprint wide.',
      },
    },
    {
      label: { en: 'Book title', de: 'Buchtitel' },
      detail: {
        en: 'Must match physical cover text exactly; no trademark infringement; no subtitle stuffing (e.g. “…Best Seller Gift Idea”) — use descriptive lines like “A Bilingual German-Twi Story…”',
        de: 'Muss physischem Cover-Text exakt entsprechen; keine Markenverletzung; kein Untertitel-Stuffing (z. B. „…Best Seller Geschenkidee“) — eher beschreibend wie „Eine bilinguale Deutsch-Twi-Geschichte…“',
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
        en: '7 backend keyword slots only — never Disney, Peppa Pig, Best Seller, Free, On Sale, Discount, High Quality, Top Rated, Award-Winning, Paperback, Book, Print',
        de: 'Nur 7 Backend-Keyword-Slots — nie Disney, Peppa Pig, Best Seller, Free, On Sale, Discount, High Quality, Top Rated, Award-Winning, Paperback, Book, Print',
      },
    },
    {
      label: { en: 'AI disclosure', de: 'KI-Disclosure' },
      detail: {
        en: 'AI-Generated text/cover/interior/translation → declare in KDP (never shown to buyers; skipping risks account suspension or termination). AI-Assisted brainstorming/editing/proofreading/formatting/outlines → no disclosure',
        de: 'KI-generierter Text/Cover/Innenteil/Übersetzung → in KDP angeben (nie für Käufer:innen sichtbar; Unterlassen riskiert Kontosperrung oder Kündigung). KI-unterstützt Brainstorm/Edit/Korrektur/Format/Outlines → keine Disclosure',
      },
    },
    {
      label: { en: 'Bleed & margins', de: 'Bleed & Ränder' },
      detail: {
        en: 'Bleed mandatory for picture/coloring books edge-to-edge; No Bleed for text-only. Keep critical art/text ≥ 0.375″ (~9.5 mm) from edges (deeper at spine/gutter)',
        de: 'Bleed Pflicht für Bilderbücher/Malbücher bis zum Rand; kein Bleed bei Text-only. Kritische Kunst/Text ≥ 0,375″ (ca. 9,5 mm) vom Rand (am Bund/Gutter tiefer)',
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
    {
      label: { en: 'KDP Select (ebook)', de: 'KDP Select (E-Book)' },
      detail: {
        en: 'Beginner default: leave OFF (90-day exclusivity blocks Draft2Digital / Apple / Kobo). Only enroll if you knowingly choose Amazon-only ebook',
        de: 'Anfänger-Default: AUS lassen (90-Tage-Exklusivität blockiert Draft2Digital / Apple / Kobo). Nur einschreiben bei bewusster Amazon-only-Wahl',
      },
    },
    {
      label: { en: 'Expanded Distribution (print)', de: 'Expanded Distribution (Print)' },
      detail: {
        en: 'Uncheck on KDP Print — use IngramSpark for bookstores / libraries instead of double-listing the wholesale channel',
        de: 'Bei KDP Print abwählen — IngramSpark für Buchhandel / Bibliotheken statt denselben Wholesale-Kanal doppelt zu listen',
      },
    },
    {
      label: { en: 'Email-list CTA pages', de: 'E-Mail-Listen-CTA-Seiten' },
      detail: {
        en: 'Front matter + back matter lead-magnet URLs before final PDF/EPUB (see Protect your business / Publish wide playbook)',
        de: 'Front- + Back-Matter Lead-Magnet-URLs vor finalem PDF/EPUB (siehe Business absichern / Wide-Playbook)',
      },
    },
    {
      label: { en: 'Impressum (DE editions)', de: 'Impressum (DE-Ausgaben)' },
      detail: {
        en: 'Pressegesetz: valid physical address. BoD/Tolino ISBN → often list their publisher address; own ISBN → your address or Impressum-Service (⚠ not legal advice)',
        de: 'Pressegesetz: gültige physische Adresse. BoD-/Tolino-ISBN → oft deren Verlegeradresse; eigene ISBN → Ihre Adresse oder Impressum-Service (⚠ keine Rechtsberatung)',
      },
    },
    {
      label: { en: 'Buchpreisbindung', de: 'Buchpreisbindung' },
      detail: {
        en: 'Same format = same EUR retail price on Amazon.de, Tolino, Thalia, Hugendubel, Apple — no cross-shop discounting (⚠ verify nuances)',
        de: 'Gleiches Format = gleicher EUR-Ladenpreis auf Amazon.de, Tolino, Thalia, Hugendubel, Apple — kein Cross-Shop-Rabatt (⚠ Nuancen prüfen)',
      },
    },
    {
      label: { en: 'DE file types', de: 'DE-Dateitypen' },
      detail: {
        en: 'Reflowable .epub only (not .mobi/.kfx); print = embedded-font .pdf interior + wrap cover .pdf (Front + Spine + Back) with bleed — BoD & epubli',
        de: 'Nur reflowable .epub (nicht .mobi/.kfx); Print = .pdf-Innenteil mit Schriften + Umschlag-.pdf (Vorderseite + Rücken + Rückseite) mit Bleed — BoD & epubli',
      },
    },
    {
      label: { en: 'Pflichtexemplare / DNB', de: 'Pflichtexemplare / DNB' },
      detail: {
        en: 'ISBN titles in DE must be deposited with Deutsche Nationalbibliothek (+ regional state library); BoD/Tolino usually handle deposit + DNB cataloging',
        de: 'ISBN-Titel in DE müssen bei der Deutschen Nationalbibliothek (+ Landesbibliothek) abgeliefert werden; BoD/Tolino übernehmen Ablieferung + DNB-Katalogisierung meist',
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
          en: 'Use Bleed for edge-to-edge kids/coloring art; no bleed for text-only. Keep critical content ≥ 0.375″ (~9.5 mm) from edges. Outer bleed often ~0.125″ (3.175 mm) — confirm in KDP',
          de: 'Bleed für randabfallende Kinder-/Malbuch-Kunst; kein Bleed bei Text-only. Kritischen Inhalt ≥ 0,375″ (ca. 9,5 mm) vom Rand. Äußerer Bleed oft ca. 0,125″ (3,175 mm) — in KDP bestätigen',
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
      'File Fragebogen zur steuerlichen Erfassung as Freiberuflicher Autor (Steuer-ID alone is not enough) + German IBAN',
      'Decide ebook OFF KDP Select + Expanded Distribution OFF on print (don’t put all eggs in one basket)',
      'Open Draft2Digital + Tolino Media (DE ebooks) + IngramSpark and/or BoD; optional BookRix/epubli (no Amazon double-list)',
      'Impressum (BoD/Tolino address or yours) + one EUR price (Buchpreisbindung) + SEPA IBAN + Steuernummer/USt-IdNr./Kleinunternehmer',
      'Prepare .epub (not .mobi) + print .pdf; confirm DNB Pflichtexemplare via BoD/Tolino',
      'Draft one lead magnet + ESP landing page (MailerLite / Kit / Mailchimp)',
      'Insert front-matter + back-matter bonus CTAs before final StoryForge / AuthorForge export',
      'Open Plan to Win: Niche (BSR <100k + long-tail) → Product (thumbnail + A+) → SEO (7 keywords + narrow BISAC) → Launch (ARC + Exact Match PPC) → Brand (series + wide + email)',
      'Declare AI-generated text/cover/interior honestly (hidden from buyers); keep title/subtitle matching the cover — no Best Seller stuffing',
      'Fill 7 backend keywords without Disney/Peppa/Free/Paperback; choose free vs owned ISBN (MVB/GeBü) deliberately',
      'Set Bleed for illustrated books; keep critical art/text ≥ 0.375″ (~9.5 mm) from edges',
      'Open StoryForge Launchpad course (desktop) for format + manuscript steps',
      'Apply to Merch in parallel (see Merch full guide) — merch can trigger Gewerbe; ask Steuerberater',
      'Open Under-explored Amazon ecosystems: compare AWS Marketplace, Renewed, Merch, Custom, Business — pick the lane that fits your skills/capital (not only KDP/FBA)',
    ],
    de: [
      'KDP anlegen / anmelden und Steuerinterview starten',
      'Fragebogen zur steuerlichen Erfassung als Freiberuflicher Autor einreichen (Steuer-ID allein reicht nicht) + deutsche IBAN',
      'Entscheiden: E-Book OHNE KDP Select + Expanded Distribution bei Print AUS (nicht alle Eier in einen Korb)',
      'Draft2Digital + Tolino Media (DE-E-Books) + IngramSpark und/oder BoD; optional BookRix/epubli (kein Amazon-Doppel-Listing)',
      'Impressum (BoD/Tolino-Adresse oder Ihre) + ein EUR-Preis (Buchpreisbindung) + SEPA-IBAN + Steuernummer/USt-IdNr./Kleinunternehmer',
      '.epub (nicht .mobi) + Print-.pdf; DNB-Pflichtexemplare über BoD/Tolino bestätigen',
      'Einen Lead-Magnet + ESP-Landingpage (MailerLite / Kit / Mailchimp)',
      'Front- + Back-Matter-Bonus-CTAs vor finalem StoryForge-/AuthorForge-Export einfügen',
      'Plan to Win öffnen: Nische (BSR <100k + Longtail) → Produkt (Thumbnail + A+) → SEO (7 Keywords + enge BISAC) → Launch (ARC + Exact-Match-PPC) → Marke (Serie + Wide + E-Mail)',
      'KI-generierten Text/Cover/Innenteil ehrlich angeben (vor Käufer:innen verborgen); Titel/Untertitel = Cover — kein Best-Seller-Stuffing',
      '7 Backend-Keywords ohne Disney/Peppa/Free/Paperback; Free vs eigene ISBN (MVB/GeBü) bewusst wählen',
      'Bleed für illustrierte Bücher; kritische Kunst/Text ≥ 0,375″ (ca. 9,5 mm) vom Rand',
      'StoryForge-Launchpad-Kurs (Desktop) für Format + Manuskript öffnen',
      'Merch parallel beantragen (siehe Merch-Vollguide) — Merch kann Gewerbe auslösen; Steuerberater fragen',
      'Unterschätzte Amazon-Ökosysteme öffnen: AWS Marketplace, Renewed, Merch, Custom, Business vergleichen — Spur nach Skills/Kapital wählen (nicht nur KDP/FBA)',
    ],
  },
}
