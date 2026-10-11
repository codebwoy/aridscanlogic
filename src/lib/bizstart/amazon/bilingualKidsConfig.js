/**
 * Bilingual children’s books on Amazon.de / KDP — owner research notes.
 * Catalogue signals and diaspora logic change — re-check Amazon.de + Destatis yourself.
 * Not a live scrape. Soften third-party CPC / tool claims with ⚠.
 */

export const BILINGUAL_KIDS_CONFIG = {
  lastVerified: '2026-04-11',
  sourceLabel:
    'Owner notes: Amazon.de bilingual Kinderbuch catalogue signals + diaspora / school-demand logic — re-check live listings and Destatis before deciding',
  independenceDisclaimer: {
    en: 'Not affiliated with Amazon. Review counts, BSR anecdotes, diaspora size, and “ad costs half of US” claims are dated source notes — verify on Amazon.de / Destatis / your ad console. First-mover niches can also mean no demand.',
    de: 'Nicht mit Amazon verbunden. Review-Zahlen, BSR-Anekdoten, Diaspora-Größe und „Ads halb so teuer wie US“ sind datierte Quellen-Notizen — auf Amazon.de / Destatis / Ihrer Ad-Konsole prüfen. First-Mover-Nischen können auch Null-Demand bedeuten.',
  },
  verdict: {
    en: 'Yes — bilingual children’s books sell on Amazon.de. Demand varies strongly by language pair: EN/FR/ES/TR/AR↔DE show clear catalogue proof; many African-language↔DE pairs look underserved (first-mover or unproven — validate before you print).',
    de: 'Ja — bilinguale Kinderbücher verkaufen auf Amazon.de. Demand variiert stark nach Sprachpaar: EN/FR/ES/TR/AR↔DE zeigen klare Katalog-Belege; viele afrikanische Sprachen↔DE wirken unterversorgt (First-Mover oder unbewiesen — vor dem Druck validieren).',
  },
  provenPairs: {
    heading: {
      en: 'Language pairs with catalogue evidence on Amazon.de',
      de: 'Sprachpaare mit Katalog-Belegen auf Amazon.de',
    },
    note: {
      en: '⚠ Star counts / review totals are owner snapshots — open live ASINs before citing.',
      de: '⚠ Sterne / Review-Zahlen sind Owner-Snapshots — Live-ASINs öffnen, bevor Sie zitieren.',
    },
    rows: [
      {
        id: 'en_de',
        pair: { en: 'English ↔ German', de: 'Englisch ↔ Deutsch' },
        evidence: {
          en: 'Hundreds of titles; strong BSR anecdotes; many 4.4–4.9★ listings; some titles with hundreds of reviews (e.g. source notes up to ~722) — prove the format sells',
          de: 'Hunderte Titel; starke BSR-Anekdoten; viele 4,4–4,9★-Listings; manche Titel mit Hunderten Reviews (Quellen bis ca. 722) — Format verkauft sich',
        },
        status: { en: '✅ High demand', de: '✅ Hoher Demand' },
      },
      {
        id: 'fr_de',
        pair: { en: 'French ↔ German', de: 'Französisch ↔ Deutsch' },
        evidence: {
          en: 'Multiple established series; consistent buyers; cross-border DE–FR families',
          de: 'Mehrere etablierte Serien; konstante Käufer:innen; grenznahe DE–FR-Familien',
        },
        status: { en: '✅ Proven', de: '✅ Bewiesen' },
      },
      {
        id: 'es_de',
        pair: { en: 'Spanish ↔ German', de: 'Spanisch ↔ Deutsch' },
        evidence: {
          en: 'Active category with multiple sellers; Spanish among widely spoken foreign languages in DE',
          de: 'Aktive Kategorie mit mehreren Seller:innen; Spanisch unter den häufig gesprochenen Fremdsprachen in DE',
        },
        status: { en: '✅ Proven', de: '✅ Bewiesen' },
      },
      {
        id: 'ar_de',
        pair: { en: 'Arabic ↔ German', de: 'Arabisch ↔ Deutsch' },
        evidence: {
          en: 'Dedicated series exist (e.g. bilibrini-type brands) — diaspora-language books can sustain buyers',
          de: 'Dedizierte Serien existieren (z. B. bilibrini-ähnliche Marken) — Diaspora-Sprachbücher können Käufer halten',
        },
        status: { en: '✅ Growing', de: '✅ Wachsend' },
      },
      {
        id: 'tr_de',
        pair: { en: 'Turkish ↔ German', de: 'Türkisch ↔ Deutsch' },
        evidence: {
          en: 'Strong catalogue activity — large Turkish-speaking community in Germany',
          de: 'Starke Katalog-Aktivität — große türkischsprachige Community in Deutschland',
        },
        status: { en: '✅ Strong', de: '✅ Stark' },
      },
      {
        id: 'pt_de',
        pair: { en: 'Portuguese ↔ German', de: 'Portugiesisch ↔ Deutsch' },
        evidence: {
          en: 'Active titles found (source example ~4.2★ / ~51 reviews) — non-English pairs can sell',
          de: 'Aktive Titel gefunden (Quellenbeispiel ca. 4,2★ / ca. 51 Reviews) — Nicht-Englisch-Paare können verkaufen',
        },
        status: { en: '✅ Active', de: '✅ Aktiv' },
      },
    ],
  },
  africanPairs: {
    heading: {
      en: 'African language ↔ German — honest catalogue picture',
      de: 'Afrikanische Sprachen ↔ Deutsch — ehrliches Katalogbild',
    },
    bullets: {
      en: [
        'Twi–DE, Swahili–DE, Igbo–DE, Zulu–DE: owner searches found no dedicated, well-reviewed Amazon.de titles for these exact pairs (re-check live)',
        'Results often collapse into generic “bilingual German” books — not African-language pairs specifically',
        'That means either: (1) real first-mover opportunity, or (2) unproven / tiny demand — validate before you invest in print',
      ],
      de: [
        'Twi–DE, Swahili–DE, Igbo–DE, Zulu–DE: Owner-Suchen fanden keine dedizierten, gut bewerteten Amazon.de-Titel für genau diese Paare (live nachprüfen)',
        'Treffer kollabieren oft in generische „bilingual Deutsch“-Bücher — nicht spezifisch afrikanische Sprachpaare',
        'Das heißt entweder: (1) echte First-Mover-Chance, oder (2) unbewiesener / winziger Demand — vor Print-Invest validieren',
      ],
    },
  },
  opportunityLogic: {
    heading: {
      en: 'Why African-language ↔ DE can still be legitimate',
      de: 'Warum afrikanische Sprachen ↔ DE trotzdem legitim sein können',
    },
    bullets: {
      en: [
        'Germany has a large and growing African diaspora — Ghanaian (Twi), Nigerian (Igbo/Yoruba), East African (Swahili), South African (Zulu) communities are often cited; ⚠ verify current Destatis / BAMF figures (source notes sometimes say “1M+ of African origin” — treat as order-of-magnitude)',
        'Heritage-language buyers are highly motivated — parents pay for cultural identity + mother-tongue tools while raising kids in Germany',
        'Few options today → premium willingness if quality and authenticity are real',
        'Low competition can mean cheaper Amazon.de ads to test — ⚠ “DE CPC ≈ half of US” is a third-party (e.g. Kindlepreneur-style) claim; check your own console',
        'Schools / Kitas seeking multicultural books can add B2B buyers (teachers, librarians) beyond parents — still validate locally',
      ],
      de: [
        'Deutschland hat eine große und wachsende afrikanische Diaspora — ghanaische (Twi), nigerianische (Igbo/Yoruba), ostafrikanische (Swahili), südafrikanische (Zulu) Communities werden oft genannt; ⚠ aktuelle Destatis-/BAMF-Zahlen prüfen (Quellen sagen manchmal „1 Mio.+ afrikanischer Herkunft“ — nur Größenordnung)',
        'Heritage-Language-Käufer:innen sind hochmotiviert — Eltern zahlen für kulturelle Identität + Muttersprache, während Kinder in DE aufwachsen',
        'Wenige Optionen heute → Premium-Bereitschaft bei echter Qualität und Authentizität',
        'Wenig Konkurrenz kann günstigere Amazon.de-Ads zum Testen bedeuten — ⚠ „DE-CPC ≈ halb so teuer wie US“ ist Drittanbieter-Claim (z. B. Kindlepreneur-Stil); eigene Konsole prüfen',
        'Schulen / Kitas mit Multikulti-Bedarf können B2B-Käufer:innen (Lehrkräfte, Bibliotheken) ergänzen — lokal validieren',
      ],
    },
  },
  pairAssessments: {
    heading: {
      en: 'Language-by-language assessment',
      de: 'Bewertung Sprache für Sprache',
    },
    items: [
      {
        id: 'twi',
        title: { en: 'Twi–German', de: 'Twi–Deutsch' },
        bullets: {
          en: [
            'Audience: Ghanaian diaspora (often cited in Hamburg, Berlin, Frankfurt hubs)',
            'Competition on Amazon.de: near zero (owner note)',
            'Verdict: high-risk / high-reward first-mover — validate in Ghanaian Germany Facebook / WhatsApp groups before publishing',
          ],
          de: [
            'Zielgruppe: ghanaische Diaspora (oft Hamburg, Berlin, Frankfurt genannt)',
            'Konkurrenz auf Amazon.de: nahe null (Owner-Notiz)',
            'Urteil: High-Risk / High-Reward First-Mover — in ghanaischen DE-Facebook-/WhatsApp-Gruppen validieren vor Publish',
          ],
        },
      },
      {
        id: 'swahili',
        title: { en: 'Swahili–German', de: 'Swahili–Deutsch' },
        bullets: {
          en: [
            'Audience: East African diaspora (Kenya, Tanzania, Uganda) + Germans learning African languages',
            'Competition: near zero (owner note)',
            'Verdict: broader appeal than single-country pairs — still validate demand first',
          ],
          de: [
            'Zielgruppe: ostafrikanische Diaspora (Kenia, Tansania, Uganda) + Deutsche, die afrikanische Sprachen lernen',
            'Konkurrenz: nahe null (Owner-Notiz)',
            'Urteil: breiterer Appeal als Ein-Land-Paare — Demand trotzdem zuerst validieren',
          ],
        },
      },
      {
        id: 'igbo',
        title: { en: 'Igbo–German', de: 'Igbo–Deutsch' },
        bullets: {
          en: [
            'Audience: Nigerian diaspora — among larger African national groups in Germany',
            'Competition: near zero (owner note)',
            'Verdict: strong potential + community word-of-mouth if authentic; validate in Igbo/Nigerian DE communities',
          ],
          de: [
            'Zielgruppe: nigerianische Diaspora — unter den größeren afrikanischen Nationalgruppen in DE',
            'Konkurrenz: nahe null (Owner-Notiz)',
            'Urteil: starkes Potenzial + Community-Mundpropaganda bei Authentizität; in Igbo-/nigerianischen DE-Communities validieren',
          ],
        },
      },
      {
        id: 'zulu',
        title: { en: 'Zulu–German', de: 'Zulu–Deutsch' },
        bullets: {
          en: [
            'Audience: South African diaspora in Germany',
            'Competition: near zero (owner note)',
            'Verdict: smaller community than Igbo/Twi — higher risk; validate hard before production',
          ],
          de: [
            'Zielgruppe: südafrikanische Diaspora in Deutschland',
            'Konkurrenz: nahe null (Owner-Notiz)',
            'Urteil: kleinere Community als Igbo/Twi — höheres Risiko; hart validieren vor Produktion',
          ],
        },
      },
      {
        id: 'es',
        title: { en: 'Spanish–German', de: 'Spanisch–Deutsch' },
        bullets: {
          en: [
            'Proven market, moderate competition',
            'Need standout quality or a sharp angle (specific culture / story), not a generic bilingual clone',
          ],
          de: [
            'Bewiesener Markt, moderate Konkurrenz',
            'Herausragende Qualität oder scharfer Winkel nötig (spezifische Kultur / Story) — kein generischer Bilingual-Klon',
          ],
        },
      },
      {
        id: 'fr',
        title: { en: 'French–German', de: 'Französisch–Deutsch' },
        bullets: {
          en: [
            'Reliable buyers, medium–high competition',
            'Differentiation idea: Cameroonian French–German (or other Francophone African diaspora) vs generic Parisian FR–DE',
          ],
          de: [
            'Zuverlässige Käufer:innen, mittel–hohe Konkurrenz',
            'Differenzierung: kamerunisches Französisch–Deutsch (oder andere frankophone afrikanische Diaspora) vs. generisches FR–DE',
          ],
        },
      },
    ],
  },
  strategy: {
    heading: {
      en: 'Recommended path (Germany-based, non-illustrator)',
      de: 'Empfohlener Pfad (in DE, ohne Illustrations-Hintergrund)',
    },
    bullets: {
      en: [
        'Start with one African-language pair (Igbo–DE or Twi–DE often cited for community size + first-mover) — or Swahili–DE for broader appeal',
        'Create consistent picture-book art with a controlled AI / studio pipeline (StoryForge Launchpad on desktop, or other tools) — ⚠ third-party AI art services (e.g. Neolemon-style) may upsell; keep rights/disclosure clear',
        'Validate demand first: post in diaspora Facebook / WhatsApp groups in Germany — ask if parents would buy that exact language pair',
        'Publish on KDP with keywords in both languages (e.g. “Twi Kinderbuch”, “zweisprachiges Kinderbuch Twi”, “Ghanaian German children’s book”)',
        'Test Amazon.de ads with a small budget — DE CPC is often cited as lower than US; ⚠ verify in your console',
        'Still follow German-first sequencing for mono-DE books; bilingual diaspora titles can be a parallel niche when you have authentic language access',
      ],
      de: [
        'Mit einem afrikanischen Sprachpaar starten (Igbo–DE oder Twi–DE oft für Community-Größe + First-Mover genannt) — oder Swahili–DE für breiteren Appeal',
        'Konsistente Bilderbuch-Kunst mit kontrollierter KI-/Studio-Pipeline (StoryForge Launchpad am Desktop oder andere Tools) — ⚠ Drittanbieter-KI-Art-Services (z. B. Neolemon-Stil) können Upsells haben; Rechte/Disclosure klären',
        'Demand zuerst validieren: in Diaspora-Facebook-/WhatsApp-Gruppen in DE posten — fragen, ob Eltern genau dieses Sprachpaar kaufen würden',
        'Auf KDP mit Keywords in beiden Sprachen publishen (z. B. „Twi Kinderbuch“, „zweisprachiges Kinderbuch Twi“, „Ghanaian German children’s book“)',
        'Amazon.de-Ads mit kleinem Budget testen — DE-CPC wird oft günstiger als US genannt; ⚠ in Ihrer Konsole prüfen',
        'German-first-Sequenz für mono-DE-Bücher trotzdem einhalten; bilinguale Diaspora-Titel können parallele Nische sein, wenn Sie authentischen Sprachzugang haben',
      ],
    },
  },
  proofExamples: {
    heading: {
      en: 'Proof-of-concept patterns (study, don’t copy)',
      de: 'Proof-of-Concept-Muster (studieren, nicht kopieren)',
    },
    note: {
      en: '⚠ Do not copy text, art, or titles. Use these as format/theme proof only — open live Amazon.de results for current stars/reviews.',
      de: '⚠ Text, Kunst oder Titel nicht kopieren. Nur als Format-/Themen-Beweis — Live-Amazon.de-Ergebnisse für aktuelle Sterne/Reviews öffnen.',
    },
    bullets: {
      en: [
        'EN–DE bilingual: high-review titles (source notes ~722 reviews / ~4.4★) show the bilingual format can convert hard',
        'Newer EN–DE entries (e.g. 2024 pubs with ~84 reviews / ~4.4★ in source notes) show the niche still accepts new entrants',
        'Simple emotional themes (“I love you” style) + bilingual layout can earn very high ratings — craft and clarity matter',
        'PT–DE and AR–DE titles prove non-English pairs can sustain buyers when community demand is real',
      ],
      de: [
        'EN–DE bilingual: hoch bewertete Titel (Quellen ca. 722 Reviews / ca. 4,4★) zeigen, dass das Format hart konvertieren kann',
        'Neuere EN–DE-Einträge (z. B. 2024 mit ca. 84 Reviews / ca. 4,4★ in Quellen) zeigen: die Nische nimmt noch Newcomer an',
        'Einfache Emotionsthemen („I love you“-Stil) + bilinguales Layout können sehr hohe Ratings erreichen — Craft und Klarheit zählen',
        'PT–DE- und AR–DE-Titel beweisen: Nicht-Englisch-Paare können Käufer halten, wenn Community-Demand real ist',
      ],
    },
  },
  summaryTable: [
    {
      pair: { en: 'English–German', de: 'Englisch–Deutsch' },
      potential: { en: '✅ Proven', de: '✅ Bewiesen' },
      competition: { en: 'High', de: 'Hoch' },
      recommended: { en: 'Benchmark / study comps', de: 'Benchmark / Comps studieren' },
    },
    {
      pair: { en: 'French–German', de: 'Französisch–Deutsch' },
      potential: { en: '✅ Proven', de: '✅ Bewiesen' },
      competition: { en: 'Medium–high', de: 'Mittel–hoch' },
      recommended: { en: 'Yes, with niche angle', de: 'Ja, mit Nischen-Winkel' },
    },
    {
      pair: { en: 'Spanish–German', de: 'Spanisch–Deutsch' },
      potential: { en: '✅ Proven', de: '✅ Bewiesen' },
      competition: { en: 'Medium', de: 'Mittel' },
      recommended: { en: 'Yes, with differentiation', de: 'Ja, mit Differenzierung' },
    },
    {
      pair: { en: 'Igbo–German', de: 'Igbo–Deutsch' },
      potential: { en: '🟡 Unproven, strong potential', de: '🟡 Unbewiesen, starkes Potenzial' },
      competition: { en: 'Very low', de: 'Sehr niedrig' },
      recommended: { en: 'Yes — first-mover if authentic', de: 'Ja — First-Mover bei Authentizität' },
    },
    {
      pair: { en: 'Twi–German', de: 'Twi–Deutsch' },
      potential: { en: '🟡 Unproven, strong potential', de: '🟡 Unbewiesen, starkes Potenzial' },
      competition: { en: 'Very low', de: 'Sehr niedrig' },
      recommended: { en: 'Yes — validate in community first', de: 'Ja — zuerst in Community validieren' },
    },
    {
      pair: { en: 'Swahili–German', de: 'Swahili–Deutsch' },
      potential: { en: '🟡 Unproven, strong potential', de: '🟡 Unbewiesen, starkes Potenzial' },
      competition: { en: 'Very low', de: 'Sehr niedrig' },
      recommended: { en: 'Yes — broadest African-language appeal', de: 'Ja — breitester Appeal unter afrikanischen Sprachen' },
    },
    {
      pair: { en: 'Zulu–German', de: 'Zulu–Deutsch' },
      potential: { en: '🟡 Unproven', de: '🟡 Unbewiesen' },
      competition: { en: 'Very low', de: 'Sehr niedrig' },
      recommended: { en: 'Validate first', de: 'Zuerst validieren' },
    },
  ],
  conclusion: {
    en: 'African-language ↔ German pairs are the most underserved and potentially most rewarding — especially if you (or a trusted collaborator) can create and market authentically inside that community. Proven EN/FR/ES/TR/AR↔DE pairs are safer benchmarks but need differentiation.',
    de: 'Afrikanische Sprachen ↔ Deutsch sind am stärksten unterversorgt und potenziell am lohnendsten — besonders wenn Sie (oder eine vertrauenswürdige Kollaboration) authentisch in dieser Community erstellen und vermarkten können. Bewiesene EN/FR/ES/TR/AR↔DE-Paare sind sicherere Benchmarks, brauchen aber Differenzierung.',
  },
  links: [
    {
      label: 'Amazon.de — zweisprachiges Kinderbuch',
      url: 'https://www.amazon.de/s?k=zweisprachiges+Kinderbuch',
    },
    {
      label: 'Amazon.de — bilingual children\'s book',
      url: 'https://www.amazon.de/s?k=bilingual+children%27s+book+german',
    },
    { label: 'Destatis', url: 'https://www.destatis.de/' },
    { label: 'KDP', url: 'https://kdp.amazon.com/' },
  ],
}
