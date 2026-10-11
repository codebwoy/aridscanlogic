/**
 * How to find Twi / Igbo translators for bilingual children’s books (DE).
 * Community-first; machine translate is unreliable. Soften freelance upsells with ⚠.
 */

export const HERITAGE_TRANSLATOR_CONFIG = {
  lastVerified: '2026-04-11',
  sourceLabel:
    'Owner playbook: diaspora community + verification rules for Twi/Igbo picture books — costs and “existing ASIN” notes are snapshots, re-check live',
  independenceDisclaimer: {
    en: 'Not affiliated with Fiverr, Upwork, ProZ, universities, or churches named as examples. Price ranges are rough owner notes — agree terms in writing. Never publish without a second native review.',
    de: 'Nicht mit Fiverr, Upwork, ProZ, Universitäten oder genannten Kirchen verbunden. Preisranges sind grobe Owner-Notizen — Bedingungen schriftlich klären. Nie ohne zweiten Muttersprach-Check publishen.',
  },
  intro: {
    en: 'A poor translation loses diaspora trust faster than a weak cover. For Twi and Igbo, human native-speaker translation is the only reliable route — that also raises the bar for competitors who cannot simply auto-translate.',
    de: 'Eine schlechte Übersetzung verliert Diaspora-Trust schneller als ein schwaches Cover. Für Twi und Igbo ist menschliche Muttersprach-Übersetzung der einzige zuverlässige Weg — das erhöht auch die Hürde für Konkurrenz, die nicht einfach auto-übersetzen kann.',
  },
  machineTools: {
    heading: {
      en: 'Part 1 — Why not Google Translate / standard AI?',
      de: 'Teil 1 — Warum nicht Google Translate / Standard-KI?',
    },
    rows: [
      {
        id: 'google',
        tool: { en: 'Google Translate', de: 'Google Translate' },
        reliability: { en: 'Very low', de: 'Sehr niedrig' },
        why: {
          en: 'Twi and Igbo are low-resource — frequent errors, unnatural phrasing',
          de: 'Twi und Igbo sind ressourcenarm — häufige Fehler, unnatürliche Phrasen',
        },
      },
      {
        id: 'deepl',
        tool: { en: 'DeepL', de: 'DeepL' },
        reliability: { en: 'Low–none', de: 'Niedrig–keine' },
        why: {
          en: 'Does not currently support Twi or Igbo (verify live)',
          de: 'Unterstützt derzeit kein Twi oder Igbo (live prüfen)',
        },
      },
      {
        id: 'llm',
        tool: { en: 'ChatGPT / Claude etc.', de: 'ChatGPT / Claude usw.' },
        reliability: { en: 'Moderate at best', de: 'Bestenfalls mittel' },
        why: {
          en: 'May sound plausible but be culturally wrong — never ship without native review',
          de: 'Kann plausibel klingen, aber kulturell falsch sein — nie ohne Muttersprach-Review shippen',
        },
      },
      {
        id: 'kdp_translate',
        tool: { en: 'Amazon Kindle Translate', de: 'Amazon Kindle Translate' },
        reliability: { en: 'None for Twi/Igbo', de: 'Keines für Twi/Igbo' },
        why: {
          en: 'Pair support is limited (e.g. EN↔ES, DE↔EN style pairs — verify current Amazon Help)',
          de: 'Sprachpaar-Support begrenzt (z. B. EN↔ES, DE↔EN-ähnlich — aktuelle Amazon-Hilfe prüfen)',
        },
      },
      {
        id: 'other',
        tool: { en: 'Consumer apps (e.g. LingoHop-type)', de: 'Consumer-Apps (z. B. LingoHop-Typ)' },
        reliability: { en: 'Usually none', de: 'Meist keines' },
        why: {
          en: 'Consumer language apps rarely include Twi/Igbo for book-quality work',
          de: 'Consumer-Sprach-Apps enthalten selten Twi/Igbo für Buchqualität',
        },
      },
    ],
    conclusion: {
      en: 'Human native translation only. That scarcity is a moat if your quality and community trust are real.',
      de: 'Nur menschliche Muttersprach-Übersetzung. Diese Knappheit ist ein Moat, wenn Qualität und Community-Trust echt sind.',
    },
  },
  twi: {
    heading: {
      en: 'Part 2 — Where to find Twi translators',
      de: 'Teil 2 — Twi-Übersetzer:innen finden',
    },
    options: [
      {
        id: 'fb',
        title: {
          en: '1) Diaspora Facebook & WhatsApp (Germany) — best first stop',
          de: '1) Diaspora Facebook & WhatsApp (Deutschland) — bester erster Stopp',
        },
        bullets: {
          en: [
            'Search groups such as: Ghanaians in Germany; Ghanaians in Berlin / Hamburg / Frankfurt / Munich; Akan/Twi speakers in Europe; Ghanaian Community Deutschland',
            'Group names change — search and join respectfully; follow group rules',
            'Offer credit in the book + free copy; paid options also fine',
          ],
          de: [
            'Gruppen suchen z. B.: Ghanaians in Germany; Ghanaians in Berlin / Hamburg / Frankfurt / Munich; Akan/Twi speakers in Europe; Ghanaian Community Deutschland',
            'Gruppennamen ändern sich — respektvoll suchen und beitreten; Gruppenregeln einhalten',
            'Credit im Buch + Freiexemplar anbieten; bezahlte Optionen auch ok',
          ],
        },
        postTemplate: {
          en: 'Hello! I am writing a bilingual children’s picture book in Twi and German. I need a fluent Twi speaker to translate about 300–400 words. I will credit you in the book and offer a free copy. Paid options also available. Please message me if interested.',
          de: 'Hallo! Ich schreibe ein bilinguales Kinderbilderbuch auf Twi und Deutsch. Ich brauche eine fließende Twi-Sprecher:in für ca. 300–400 Wörter. Ich nenne Sie im Buch und biete ein Freiexemplar. Bezahlte Optionen möglich. Bitte schreiben Sie mir bei Interesse.',
        },
      },
      {
        id: 'fiverr',
        title: {
          en: '2) Freelance marketplaces (e.g. Fiverr) ⚠',
          de: '2) Freelance-Marktplätze (z. B. Fiverr) ⚠',
        },
        bullets: {
          en: [
            'Search “Twi translator” / “Akan translator”',
            'Filter native speaker, strong ratings, preferably children’s content experience',
            'Rough budget owner note: ~€30–€80 for ~300–500 words — agree in writing',
            'Always request a short sample (1 paragraph) before committing',
          ],
          de: [
            'Suchen: „Twi translator“ / „Akan translator“',
            'Filter: Muttersprachler:in, starke Ratings, ideal Kinderbuch-Erfahrung',
            'Grobes Budget (Owner-Notiz): ca. 30–80 € für ca. 300–500 Wörter — schriftlich vereinbaren',
            'Immer kurzen Sample (1 Absatz) vor Commit verlangen',
          ],
        },
      },
      {
        id: 'proz',
        title: {
          en: '3) ProZ.com (professional directory) ⚠',
          de: '3) ProZ.com (Profi-Verzeichnis) ⚠',
        },
        bullets: {
          en: [
            'Search Twi (Akan) translators',
            'Often higher cost (owner note ~€80–€200) with more formal accountability',
            'Still use the two-translator verification rule',
          ],
          de: [
            'Twi-(Akan)-Übersetzer:innen suchen',
            'Oft teurer (Owner-Notiz ca. 80–200 €) mit formellerer Accountability',
            'Trotzdem Zwei-Übersetzer-Verifikation nutzen',
          ],
        },
      },
      {
        id: 'uni',
        title: {
          en: '4) University African Studies departments (Germany)',
          de: '4) Unis — Afrikanistik / African Studies (Deutschland)',
        },
        bullets: {
          en: [
            'Examples to inquire (programmes change — verify): Universität Hamburg; Humboldt-Universität Berlin; Universität Leipzig',
            'Ask if students or lecturers specialise in Akan/Twi and take paid short projects',
            'Students often welcome paid language work — stay professional and clear on rights',
          ],
          de: [
            'Beispiele zum Anfragen (Programme ändern sich — prüfen): Uni Hamburg; Humboldt-Universität Berlin; Uni Leipzig',
            'Fragen, ob Studierende oder Dozierende Akan/Twi spezialisieren und kurze bezahlte Projekte annehmen',
            'Studierende begrüßen oft bezahlte Sprachprojekte — professionell bleiben, Rechte klären',
          ],
        },
      },
      {
        id: 'church',
        title: {
          en: '5) Ghanaian churches / community centres',
          de: '5) Ghanaische Kirchen / Community-Zentren',
        },
        bullets: {
          en: [
            'Many Ghanaian diaspora communities centre around churches',
            'Pastors and leaders are often highly fluent and trusted',
            'A warm personal introduction beats a cold online ask',
          ],
          de: [
            'Viele ghanaische Diaspora-Communities sind um Kirchen zentriert',
            'Pastor:innen und Leader sind oft hoch fließend und vertrauenswürdig',
            'Warme persönliche Einführung schlägt kalte Online-Anfrage',
          ],
        },
      },
    ],
  },
  igbo: {
    heading: {
      en: 'Part 3 — Where to find Igbo translators',
      de: 'Teil 3 — Igbo-Übersetzer:innen finden',
    },
    options: [
      {
        id: 'fb',
        title: {
          en: '1) Nigerian / Igbo diaspora groups (Germany)',
          de: '1) Nigerianische / Igbo-Diaspora-Gruppen (Deutschland)',
        },
        bullets: {
          en: [
            'Search: Nigerians in Germany; Igbo Community Germany; Ndi Igbo Germany / Berlin / Frankfurt; Nigerian Community Deutschland',
            'Nigerian diaspora communities in Germany are large — fluent Igbo speakers are often findable quickly when you ask respectfully',
          ],
          de: [
            'Suchen: Nigerians in Germany; Igbo Community Germany; Ndi Igbo Germany / Berlin / Frankfurt; Nigerian Community Deutschland',
            'Nigerianische Diaspora in DE ist groß — fließende Igbo-Sprecher:innen oft schnell findbar bei respektvoller Anfrage',
          ],
        },
      },
      {
        id: 'fiverr',
        title: {
          en: '2) Freelance marketplaces ⚠',
          de: '2) Freelance-Marktplätze ⚠',
        },
        bullets: {
          en: [
            'Search “Igbo translator” — often more listings than Twi',
            'Rough budget owner note: ~€30–€100 for picture-book length',
            'Confirm dialect (e.g. Owerri, Onitsha, or another) — match your target audience',
          ],
          de: [
            'Suchen „Igbo translator“ — oft mehr Listings als Twi',
            'Grobes Budget (Owner-Notiz): ca. 30–100 € für Bilderbuch-Länge',
            'Dialekt bestätigen (z. B. Owerri, Onitsha oder anderer) — zur Zielgruppe matchen',
          ],
        },
      },
      {
        id: 'orgs',
        title: {
          en: '3) Igbo language organisations',
          de: '3) Igbo-Sprachorganisationen',
        },
        bullets: {
          en: [
            'Igbo language institutes and culture societies (names and chapters change — search current orgs)',
            'Examples often cited: Igbo language literacy institutes; Society for Promoting Igbo Language and Culture (SPILC) — verify current contact paths',
            'Ask for children’s-literature experience when possible',
          ],
          de: [
            'Igbo-Sprachinstitute und Kulturvereine (Namen/Chapter ändern sich — aktuelle Orgs suchen)',
            'Oft genannt: Igbo-Literacy-Institute; Society for Promoting Igbo Language and Culture (SPILC) — aktuelle Kontaktwege prüfen',
            'Wenn möglich Kinderliteratur-Erfahrung erfragen',
          ],
        },
      },
      {
        id: 'upwork',
        title: {
          en: '4) Upwork (vetted freelancers) ⚠',
          de: '4) Upwork (geprüfter Freelance) ⚠',
        },
        bullets: {
          en: [
            'Post a job: Igbo translator for children’s picture book, short word count, dialect specified',
            'Review work history and request a paid sample paragraph',
          ],
          de: [
            'Job posten: Igbo-Übersetzer:in für Kinderbilderbuch, kurze Wortzahl, Dialekt spezifiziert',
            'Work History prüfen und bezahlten Sample-Absatz verlangen',
          ],
        },
      },
    ],
  },
  verify: {
    heading: {
      en: 'Part 4 — Verify quality (never skip)',
      de: 'Teil 4 — Qualität prüfen (nie überspringen)',
    },
    bullets: {
      en: [
        'Two-translator rule: a second native speaker reviews without seeing your English/German original first (or reviews independently)',
        'Read-aloud test: does it sound natural to a child / parent?',
        'Cultural check: any phrases unnatural or inappropriate for kids?',
        'Back-translation: have the reviewer render a few lines back into English/German; meaning should match',
        'Dialect confirmation: Twi (e.g. Asante vs Fante); Igbo dialects — match your audience',
      ],
      de: [
        'Zwei-Übersetzer-Regel: zweite Muttersprachler:in prüft unabhängig (ohne Ihr EN/DE-Original zuerst zu sehen, wo sinnvoll)',
        'Lautlese-Test: klingt es natürlich für Kind / Eltern?',
        'Kultur-Check: Phrasen unnatürlich oder ungeeignet für Kinder?',
        'Rückübersetzung: Reviewer:in übersetzt ein paar Zeilen zurück ins EN/DE; Bedeutung soll matchen',
        'Dialekt-Bestätigung: Twi (z. B. Asante vs. Fante); Igbo-Dialekte — zur Zielgruppe matchen',
      ],
    },
  },
  brief: {
    heading: {
      en: 'Part 5 — Translation brief checklist',
      de: 'Teil 5 — Übersetzungs-Briefing-Checkliste',
    },
    bullets: {
      en: [
        'Target age: ~3–7',
        'Reading level: simple vocabulary, short sentences',
        'Tone: warm, encouraging, read-aloud friendly',
        'Format: ~1–3 lines per page max',
        'Names stay unchanged (e.g. Kofi stays Kofi)',
        'Dialect preference stated (e.g. Asante Twi / Standard Igbo)',
        'Credit line agreed (“Twi translation by …”) + rights / payment clear',
      ],
      de: [
        'Zielalter: ca. 3–7',
        'Leseniveau: einfacher Wortschatz, kurze Sätze',
        'Ton: warm, ermutigend, vorlesefreundlich',
        'Format: max. ca. 1–3 Zeilen pro Seite',
        'Namen unverändert (z. B. Kofi bleibt Kofi)',
        'Dialekt-Präferenz genannt (z. B. Asante Twi / Standard Igbo)',
        'Credit-Zeile vereinbart („Twi-Übersetzung von …“) + Rechte / Zahlung klar',
      ],
    },
  },
  costs: {
    heading: {
      en: 'Part 6 — Cost summary (owner estimates ⚠)',
      de: 'Teil 6 — Kosten-Übersicht (Owner-Schätzungen ⚠)',
    },
    note: {
      en: '⚠ Ranges vary by length, dialect, rush fees, and experience. Negotiate clearly; never pay full amount before a sample.',
      de: '⚠ Ranges variieren nach Länge, Dialekt, Rush und Erfahrung. Klar verhandeln; nie Vollbetrag vor Sample zahlen.',
    },
    rows: [
      {
        source: { en: 'Diaspora community (DE)', de: 'Diaspora-Community (DE)' },
        twi: { en: 'Free–€50', de: 'Gratis–50 €' },
        igbo: { en: 'Free–€50', de: 'Gratis–50 €' },
        reliability: { en: 'High (native + cultural)', de: 'Hoch (nativ + kulturell)' },
      },
      {
        source: { en: 'Fiverr-type marketplaces', de: 'Fiverr-ähnliche Marktplätze' },
        twi: { en: '~€30–€80', de: 'ca. 30–80 €' },
        igbo: { en: '~€30–€100', de: 'ca. 30–100 €' },
        reliability: { en: 'Medium — verify carefully', de: 'Mittel — sorgfältig prüfen' },
      },
      {
        source: { en: 'Upwork-type', de: 'Upwork-ähnlich' },
        twi: { en: '~€60–€150', de: 'ca. 60–150 €' },
        igbo: { en: '~€60–€150', de: 'ca. 60–150 €' },
        reliability: { en: 'Medium–high', de: 'Mittel–hoch' },
      },
      {
        source: { en: 'ProZ / pro directories', de: 'ProZ / Profi-Verzeichnisse' },
        twi: { en: '~€80–€200', de: 'ca. 80–200 €' },
        igbo: { en: '~€80–€200', de: 'ca. 80–200 €' },
        reliability: { en: 'High (still verify)', de: 'Hoch (trotzdem prüfen)' },
      },
      {
        source: { en: 'University department', de: 'Uni-Fachbereich' },
        twi: { en: '~€50–€120', de: 'ca. 50–120 €' },
        igbo: { en: '~€50–€120', de: 'ca. 50–120 €' },
        reliability: { en: 'High', de: 'Hoch' },
      },
    ],
  },
  marketSignal: {
    heading: {
      en: 'Market signal — study, don’t copy',
      de: 'Markt-Signal — studieren, nicht kopieren',
    },
    bullets: {
      en: [
        'Owner notes: at least one Igbo–German bilingual children’s book has appeared on Amazon.de (example snapshot ~4.1★ / ~13 reviews) — study layout, translation style, and keywords; never copy',
        'Low review counts on early titles can mean under-marketing — authenticity + diaspora promotion can still win',
        'Twi learning / parallel-text books appearing in catalogues can signal buyer interest in the language — not the same as picture-book demand; validate both',
        '⚠ Optional KDP / AI-illustration guides may upsell — prefer free niche research + bilingual story craft modules in this hub first',
      ],
      de: [
        'Owner-Notizen: mindestens ein Igbo–deutsches bilinguales Kinderbuch ist auf Amazon.de erschienen (Beispiel-Snapshot ca. 4,1★ / ca. 13 Reviews) — Layout, Übersetzungsstil und Keywords studieren; nie kopieren',
        'Niedrige Review-Zahlen bei Early Titles können Under-Marketing bedeuten — Authentizität + Diaspora-Promotion kann trotzdem gewinnen',
        'Twi-Lern- / Paralleltext-Bücher im Katalog können Interesse an der Sprache signalisieren — nicht gleich Bilderbuch-Demand; beides validieren',
        '⚠ Optionale KDP-/KI-Illustrations-Guides können upsellen — zuerst Free Nischen-Research + Bilingual-Story-Craft in diesem Hub',
      ],
    },
  },
  takeaway: {
    en: 'Strongest edge: authenticity + community connection. A book diaspora parents trust was made for them will outperform a generic translation — even if a thin Igbo–DE listing already exists.',
    de: 'Stärkster Vorteil: Authentizität + Community-Verbindung. Ein Buch, dem Diaspora-Eltern vertrauen, dass es für sie gemacht wurde, schlägt eine generische Übersetzung — auch wenn schon ein dünnes Igbo–DE-Listing existiert.',
  },
  links: [
    {
      label: 'Amazon.de — Igbo Deutsch Kinderbuch',
      url: 'https://www.amazon.de/s?k=Igbo+Deutsch+Kinderbuch',
    },
    {
      label: 'Amazon.de — Twi Kinderbuch',
      url: 'https://www.amazon.de/s?k=Twi+Kinderbuch',
    },
    { label: 'ProZ.com', url: 'https://www.proz.com/' },
    { label: 'KDP', url: 'https://kdp.amazon.com/' },
  ],
}
