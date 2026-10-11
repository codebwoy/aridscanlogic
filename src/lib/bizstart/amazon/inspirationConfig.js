/**
 * Inspirational picture-book blueprints, age bands, and tools for DE KDP.
 * Ratings / review counts / “bestseller” claims are source snapshots — verify on Amazon.de.
 * Do not scrape Amazon. Do not paste copyrighted book text — titles + structural notes only.
 */

export const INSPIRATION_CONFIG = {
  lastVerified: '2026-10-11',
  sourceLabel:
    'Owner research notes for DE children’s KDP / Amazon.de study shelf — re-check listings before relying on ranks/reviews',
  independenceDisclaimer: {
    en: 'Not affiliated with Amazon or listed authors/publishers. Ratings, review counts, and “underserved” claims are dated source snapshots — verify live. Study structure and themes only — never copy text or art.',
    de: 'Nicht mit Amazon oder genannten Autor:innen/Verlagen verbunden. Ratings, Review-Zahlen und „unterversorgt“-Claims sind datierte Quellen-Snapshots — live prüfen. Nur Struktur und Themen studieren — niemals Text oder Kunst kopieren.',
  },
  primaryBlueprint: {
    en: 'Courage + animal character (ages ~2–5), rhyming or rhythmic German text, fear-of-change / inner courage arc — validate weekly on Amazon.de Kinderbücher bestseller paths.',
    de: 'Mut + Tierfigur (Alter ca. 2–5), reimender/rhythmischer deutscher Text, Angst vor Veränderung / innerer Mut — wöchentlich auf Amazon.de Kinderbuch-Bestseller-Pfaden validieren.',
  },
  beginnerAdvise: {
    heading: {
      en: 'Amazon.de / KDP beginner categories (2026 notes)',
      de: 'Amazon.de- / KDP-Anfänger-Kategorien (2026-Notizen)',
    },
    verifiedNote: {
      en: '⚠ “Highest demand / lowest competition” is owner guidance, not Amazon ranking science. Confirm with weekly Amazon.de Kinderbücher bestsellers + your keyword tools.',
      de: '⚠ „Höchste Nachfrage / geringste Konkurrenz“ ist Owner-Guidance, keine Amazon-Rang-Wissenschaft. Wöchentlich Amazon.de-Kinderbuch-Bestseller + eigene Keyword-Tools prüfen.',
    },
    categories: [
      {
        id: 'sel',
        title: {
          en: '1. Social-Emotional Learning (SEL) stories',
          de: '1. Social-Emotional Learning (SEL) / Gefühlsgeschichten',
        },
        bullets: {
          en: [
            'Emotions, empathy, kindness, confidence, resilience',
            'Strong buying intent from parents and teachers',
            'Idea shapes: overcoming shyness, big feelings, making friends',
          ],
          de: [
            'Emotionen, Empathie, Freundlichkeit, Selbstvertrauen, Resilienz',
            'Starke Kaufabsicht von Eltern und Lehrkräften',
            'Ideen: Schüchternheit, große Gefühle, Freunde finden',
          ],
        },
      },
      {
        id: 'bedtime_mindful',
        title: {
          en: '2. Bedtime & mindfulness books',
          de: '2. Gute-Nacht- & Achtsamkeitsbücher',
        },
        bullets: {
          en: [
            'Evergreen — parents always need bedtime books',
            'Calming, repetitive language suits beginners',
            'Short word count (~200–500) keeps production manageable',
          ],
          de: [
            'Evergreen — Eltern brauchen immer Gute-Nacht-Bücher',
            'Beruhigende, repetitive Sprache eignet sich für Einsteiger',
            'Kurzer Wortumfang (ca. 200–500) hält Produktion machbar',
          ],
        },
      },
      {
        id: 'first_exp',
        title: {
          en: '3. First experiences & life transitions',
          de: '3. Erste Erfahrungen & Übergänge',
        },
        bullets: {
          en: [
            'First day of school, new sibling, moving house, potty training',
            'Parents actively search — direct buying intent',
          ],
          de: [
            'Erster Schultag, Geschwisterchen, Umzug, Töpfchentraining',
            'Eltern suchen aktiv — direkte Kaufabsicht',
          ],
        },
      },
      {
        id: 'diversity',
        title: {
          en: '4. Diversity & representation',
          de: '4. Vielfalt & Repräsentation',
        },
        bullets: {
          en: [
            'Different ethnicities, abilities, and family structures',
            'Source claim: demand often outpaces supply — validate niche density yourself on Amazon.de ⚠',
          ],
          de: [
            'Unterschiedliche Herkünfte, Fähigkeiten und Familienformen',
            'Quellen-Claim: Nachfrage oft größer als Angebot — Nischen-Dichte selbst auf Amazon.de prüfen ⚠',
          ],
        },
      },
      {
        id: 'holiday',
        title: {
          en: '5. Holiday & seasonal books',
          de: '5. Feiertags- & Saisonbücher',
        },
        bullets: {
          en: [
            'Christmas, Easter, Halloween (and DE seasons: Nikolaustag, Fasching) can spike sales',
            'Series potential around a seasonal character — but evergreen SEL/bedtime is safer for year-round cashflow',
          ],
          de: [
            'Weihnachten, Ostern, Halloween (plus DE: Nikolaustag, Fasching) können spiken',
            'Serienpotenzial um eine Saisonfigur — Evergreen SEL/Gute Nacht ist sicherer für Ganzjahres-Cashflow',
          ],
        },
      },
    ],
    tips: {
      en: [
        'Start with picture books ages ~3–7: often 24–32 pages, ~200–1,000 words',
        'Keep text simple — illustrations carry half the story',
        'Prefer evergreen topics (emotions, bedtime, first experiences) for year-round sales',
        'If you are not an illustrator: StoryForge pinned character → consistent pages (AI image apps alone are not a production system)',
        'Lived insight from parenting is a real beginner advantage — write what children actually respond to',
      ],
      de: [
        'Start mit Bilderbüchern Alter ca. 3–7: oft 24–32 Seiten, ca. 200–1.000 Wörter',
        'Text einfach halten — Illustrationen tragen die Hälfte der Story',
        'Evergreen-Themen (Gefühle, Gute Nacht, erste Erfahrungen) für Ganzjahres-Verkäufe',
        'Ohne Illustrator: StoryForge-Ankerfigur → konsistente Seiten (KI-Bild-Apps allein sind kein Produktionssystem)',
        'Eltern-Alltag ist ein echter Einsteiger-Vorteil — schreiben, worauf Kinder wirklich reagieren',
      ],
    },
    merchBridge: {
      en: 'Same character that works in SEL/courage picture books becomes Merch (tees, totes, hoodies) — book → matching product is the KDP+Merch loop.',
      de: 'Dieselbe Figur aus SEL-/Mut-Bilderbüchern wird Merch (Tees, Taschen, Hoodies) — Buch → passendes Produkt ist die KDP+Merch-Schleife.',
    },
  },
  studyShelf: {
    heading: {
      en: 'Study shelf — titles to analyse (not copy)',
      de: 'Studier-Regal — Titel zum Analysieren (nicht kopieren)',
    },
    notice: {
      en: [
        'Most use simple, repetitive language',
        'One central emotion or message per book',
        'Best ones are short (often under ~500 words) but emotionally impactful',
        'Many spawn series — strong long-term KDP strategy',
      ],
      de: [
        'Meist einfache, repetitive Sprache',
        'Eine zentrale Emotion oder Botschaft pro Buch',
        'Die besten sind kurz (oft unter ca. 500 Wörtern), aber emotional stark',
        'Viele werden zu Serien — starke langfristige KDP-Strategie',
      ],
    },
    groups: [
      {
        id: 'classics',
        title: {
          en: 'Classic bestsellers — timeless storytelling',
          de: 'Klassische Bestseller — zeitlose Erzählkunst',
        },
        books: [
          {
            id: 'shelf_guess',
            title: 'Guess How Much I Love You',
            blurb: {
              en: 'Parent–child love competition — enduring gift classic (source: very high ★ / ~12k+ reviews — verify).',
              de: 'Eltern-Kind-Liebes-Wettkampf — zeitloses Geschenk-Klassiker (Quelle: sehr hohe ★ / ca. 12k+ Reviews — prüfen).',
            },
          },
          {
            id: 'shelf_moon',
            title: 'Goodnight Moon',
            blurb: {
              en: 'Bedtime rhythm + repetition — study calm language for beginners (source: massive review volume — verify).',
              de: 'Gute-Nacht-Rhythmus + Wiederholung — beruhigende Sprache für Einsteiger studieren (Quelle: enorme Reviews — prüfen).',
            },
          },
          {
            id: 'shelf_wild',
            title: 'Where the Wild Things Are',
            blurb: {
              en: 'Imagination + belonging + return home — literary gold standard (source: huge review volume — verify).',
              de: 'Imagination + Zugehörigkeit + Heimkehr — literarischer Goldstandard (Quelle: enorme Reviews — prüfen).',
            },
          },
        ],
      },
      {
        id: 'sel_hot',
        title: {
          en: 'Social-emotional — hot niche patterns',
          de: 'Sozial-emotional — heiße Nischenmuster',
        },
        books: [
          {
            id: 'shelf_anger',
            title: 'I Am Stronger Than Anger',
            blurb: {
              en: 'Anger self-regulation; series proof (source: ~4.5k+ reviews / ~4.6★ — verify).',
              de: 'Wut-Selbstregulation; Serien-Beweis (Quelle: ca. 4,5k+ Reviews / ca. 4,6★ — prüfen).',
            },
          },
          {
            id: 'shelf_kind',
            title: 'Kindness Makes Me Stronger',
            blurb: {
              en: 'Kindness / empathy in emotions series (source: ~1.3k+ reviews — verify).',
              de: 'Freundlichkeit / Empathie in Emotions-Serie (Quelle: ca. 1,3k+ Reviews — prüfen).',
            },
          },
        ],
      },
      {
        id: 'adventure',
        title: {
          en: 'Fun & adventure — engaging narratives',
          de: 'Spaß & Abenteuer — mitreißende Narrative',
        },
        books: [
          {
            id: 'shelf_dino',
            title: 'The Girl and the Dinosaur',
            blurb: {
              en: 'Girl + dinosaur niche combo; bedtime gift positioning (source: ~1.7k+ reviews / ~4.8★ — verify).',
              de: 'Mädchen + Dino-Nischenkombi; Gute-Nacht-Geschenk (Quelle: ca. 1,7k+ Reviews / ca. 4,8★ — prüfen).',
            },
          },
          {
            id: 'shelf_koala',
            title: 'The Koala Who Could',
            blurb: {
              en: 'Fear of change + rhyme (Bright/Field) — DE editions also chart (source: ~7.6k+ reviews — verify).',
              de: 'Angst vor Veränderung + Reim (Bright/Field) — DE-Ausgaben auch in Charts (Quelle: ca. 7,6k+ Reviews — prüfen).',
            },
          },
          {
            id: 'shelf_giraffe',
            title: "Giraffes Can't Dance",
            blurb: {
              en: 'Self-belief + rhythm; long evergreen (source: strong ★ / long sales history — verify).',
              de: 'Selbstvertrauen + Rhythmus; langes Evergreen (Quelle: starke ★ / lange Verkaufshistorie — prüfen).',
            },
          },
        ],
      },
    ],
  },
  bookDeepDives: [
    {
      id: 'dive_giraffe',
      title: "Giraffes Can't Dance",
      concept: {
        en: 'Gerald thinks he cannot dance until he finds his own rhythm — self-acceptance and self-belief.',
        de: 'Gerald glaubt, er könne nicht tanzen, bis er seinen eigenen Rhythmus findet — Selbstakzeptanz und Selbstvertrauen.',
      },
      whySells: {
        en: [
          'Long evergreen sales history (published 2001; still cited as strong — verify current editions)',
          'Source snapshot: high ★ / hundreds of reviews on some listings — confirm live',
          'Anniversary/translation editions signal lasting demand',
        ],
        de: [
          'Lange Evergreen-Historie (2001; noch stark genannt — aktuelle Editionen prüfen)',
          'Quellen-Snapshot: hohe ★ / hunderte Reviews auf manchen Listings — live bestätigen',
          'Jubiläums-/Übersetzungsausgaben signalisieren anhaltende Nachfrage',
        ],
      },
      kdpLessons: {
        en: [
          'One protagonist, one clear message',
          'Emotional core = confidence/self-worth (high-demand SEL)',
          'Bouncy rhythm that works read-aloud',
          '~32-page beginner length; character franchise / series potential',
        ],
        de: [
          'Ein Protagonist, eine klare Botschaft',
          'Emotionaler Kern = Selbstvertrauen (hoch nachgefragtes SEL)',
          'Federnder Rhythmus für Vorlesen',
          'Ca. 32 Seiten Einsteigerlänge; Figuren-/Serienpotenzial',
        ],
      },
      studyPoints: {
        en: [
          'Relatable doubt in the hero',
          'Single powerful message — not cluttered',
          'Illustration and text share the emotional load',
          'Rhythmic language for memorability',
        ],
        de: [
          'Nachvollziehbarer Zweifel im Helden',
          'Eine starke Botschaft — nicht überladen',
          'Illustration und Text teilen die emotionale Last',
          'Rhythmische Sprache für Einprägsamkeit',
        ],
      },
    },
    {
      id: 'dive_koala',
      title: 'The Koala Who Could',
      concept: {
        en: 'Cautious koala faces unwanted change and learns that leaving the comfort zone brings new adventures.',
        de: 'Vorsichtiger Koala trifft auf unerwünschte Veränderung und lernt: Komfortzone verlassen bringt neue Abenteuer.',
      },
      whySells: {
        en: [
          'Universal childhood fear of change — reassuring, not preachy',
          'Strong fit for shy / cautious children',
          'Source: awards citations + high review volume (~7.6k / ~4.8★ — verify)',
          'Bright + Field partnership also behind other bestsellers (same craft school)',
        ],
        de: [
          'Universelle Kindheitsangst vor Veränderung — tröstend, nicht belehrend',
          'Stark für schüchterne / vorsichtige Kinder',
          'Quelle: Award-Nennungen + hohe Reviews (ca. 7,6k / ca. 4,8★ — prüfen)',
          'Bright + Field auch hinter anderen Bestsellern (gleiche Craft-Schule)',
        ],
      },
      kdpLessons: {
        en: [
          'Rhyming / rhythmic text praised for read-aloud',
          'Ages ~1–6 bridge toddlers and older preschoolers',
          'Show managing fear — do not only say “be brave”',
          'Bold, clear illustration style — achievable with a pinned character system',
        ],
        de: [
          'Reim/Rhythmus für Vorlesen gelobt',
          'Alter ca. 1–6 verbindet Kleinkinder und ältere Vorschulkinder',
          'Angst managen zeigen — nicht nur „sei mutig“ sagen',
          'Klare, kraftvolle Illustration — machbar mit Ankerfigur-System',
        ],
      },
      studyPoints: {
        en: [
          'Emotional authenticity + rhyme + clear art = evergreen sales',
          'Fear of change never goes out of fashion',
        ],
        de: [
          'Emotionale Echtheit + Reim + klare Kunst = Evergreen-Verkäufe',
          'Angst vor Veränderung wird nie unmodern',
        ],
      },
    },
    {
      id: 'dive_dino',
      title: 'The Girl and the Dinosaur',
      concept: {
        en: 'A girl’s imagination befriends a gentle dinosaur — wonder, friendship, soft adventure for ages ~0–5.',
        de: 'Mädchenfreundschaft mit sanftem Dino — Wunder, Freundschaft, sanftes Abenteuer Alter ca. 0–5.',
      },
      whySells: {
        en: [
          'Niche combo parents search: girls + dinosaurs',
          'Gift positioning (“little girl who loves dinosaurs”)',
          'Source snapshot: ~1.7k+ reviews / ~4.8★ — verify; sequel demand signals series appetite',
        ],
        de: [
          'Nischenkombi, die Eltern suchen: Mädchen + Dinos',
          'Geschenk-Positionierung („kleines Mädchen, das Dinos liebt“)',
          'Quellen-Snapshot: ca. 1,7k+ Reviews / ca. 4,8★ — prüfen; Sequel-Wünsche = Serienhunger',
        ],
      },
      kdpLessons: {
        en: [
          'Combine two appealing elements (relatable hero + passion interest)',
          'Keep bedtime-safe: no scary beats for sensitive kids',
          'Series template: “Child and the …” (mermaid, dragon, fairy…)',
        ],
        de: [
          'Zwei Anziehungspunkte kombinieren (Held:in + Leidenschaft)',
          'Gute-Nacht-sicher: keine Schreck-Momente für sensible Kinder',
          'Serien-Template: „Kind und der/die …“ (Meerjungfrau, Drache, Fee…)',
        ],
      },
      studyPoints: {
        en: [
          'Joyful, not trendy-dated art wins bedtime loyalty',
          'Specific niches can outsell generic “adventure” books',
        ],
        de: [
          'Freudige, nicht trend-datierte Kunst gewinnt Gute-Nacht-Loyalität',
          'Spezifische Nischen können generische „Abenteuer“-Bücher übertreffen',
        ],
      },
    },
    {
      id: 'dive_kindness',
      title: 'Kindness Makes Me Stronger',
      concept: {
        en: 'Acts of kindness make children emotionally stronger — empathy as strength (emotions-series format).',
        de: 'Freundlichkeit macht Kinder emotional stärker — Empathie als Stärke (Emotions-Serienformat).',
      },
      whySells: {
        en: [
          'Schools and parents prioritise emotional intelligence',
          'Series bundling drives multi-book purchases',
          'Source snapshot: ~1.3k+ reviews / ~4.6★ since ~2021 — verify live',
        ],
        de: [
          'Schulen und Eltern priorisieren emotionale Intelligenz',
          'Serien-Bündelung treibt Mehrfachkäufe',
          'Quellen-Snapshot: ca. 1,3k+ Reviews / ca. 4,6★ seit ca. 2021 — live prüfen',
        ],
      },
      kdpLessons: {
        en: [
          'One emotion / virtue per title → collectible set',
          'Keywords to validate on Amazon.de: Gefühle, Freundlichkeit, Empathie, SEL',
          'Educators and libraries are secondary buyers beyond parents',
        ],
        de: [
          'Eine Emotion / Tugend pro Titel → sammelbare Reihe',
          'Keywords auf Amazon.de prüfen: Gefühle, Freundlichkeit, Empathie, SEL',
          'Pädagog:innen und Bibliotheken sind Zweitkäufer neben Eltern',
        ],
      },
      studyPoints: {
        en: [
          'Solves a parenting problem (teach feelings), not only entertains',
          'Series > one-off for predictable monthly income',
        ],
        de: [
          'Löst ein Eltern-Problem (Gefühle lehren), unterhält nicht nur',
          'Serie > Einzelbuch für planbareren Monatsumsatz',
        ],
      },
    },
    {
      id: 'dive_anger',
      title: 'I Am Stronger Than Anger',
      concept: {
        en: 'Anger is natural; the child learns self-regulation — “stronger than” the emotion, not controlled by it.',
        de: 'Wut ist natürlich; das Kind lernt Selbstregulation — „stärker als“ die Emotion, nicht von ihr gesteuert.',
      },
      whySells: {
        en: [
          'High parental search intent for anger / big feelings',
          'Schools buy SEL / self-regulation titles (institutional upside)',
          'Source snapshot: ~4.5k+ reviews / ~4.6★; same emotions-series family — verify',
        ],
        de: [
          'Hohe Eltern-Suchabsicht bei Wut / großen Gefühlen',
          'Schulen kaufen SEL-/Selbstregulations-Titel (institutionelles Upside)',
          'Quellen-Snapshot: ca. 4,5k+ Reviews / ca. 4,6★; gleiche Emotions-Serie — prüfen',
        ],
      },
      kdpLessons: {
        en: [
          'Practical coping > vague “be nice” messaging',
          'Keywords: Wut, Gefühle regulieren, Selbstkontrolle, anger management for kids',
          'Buyers: parents, schools, therapists, grandparents',
        ],
        de: [
          'Praktische Coping-Strategien > vages „sei nett“',
          'Keywords: Wut, Gefühle regulieren, Selbstkontrolle',
          'Käufer: Eltern, Schulen, Therapeut:innen, Großeltern',
        ],
      },
      studyPoints: {
        en: [
          'Measurable parenting value drives reviews and word-of-mouth',
          'Emotion-specific books bundle into recurring revenue',
        ],
        de: [
          'Messbarer Eltern-Nutzen treibt Reviews und Mundpropaganda',
          'Emotions-spezifische Bücher bündeln wiederkehrenden Umsatz',
        ],
      },
    },
    {
      id: 'dive_wild',
      title: 'Where the Wild Things Are',
      concept: {
        en: 'Mischief → wild imagination → return to unconditional love at home — anger, adventure, belonging.',
        de: 'Unfug → wilde Imagination → Rückkehr zur bedingungslosen Liebe zu Hause — Wut, Abenteuer, Zugehörigkeit.',
      },
      whySells: {
        en: [
          'Caldecott-level cultural landmark (1963+) — institutional permanence',
          'Source snapshot: tens of thousands of reviews / ~4.8★ — verify current listing',
          'Appeals to toddlers and adults — rare multi-audience stickiness',
        ],
        de: [
          'Caldecott-Level Kultur-Landmarke (ab 1963) — institutionelle Dauer',
          'Quellen-Snapshot: zehntausende Reviews / ca. 4,8★ — aktuelles Listing prüfen',
          'Spricht Kleinkinder und Erwachsene an — seltene Multi-Audience-Haftung',
        ],
      },
      kdpLessons: {
        en: [
          'Treat children as emotionally intelligent — do not talk down',
          'Visual progression can carry as much story as words',
          'Literary depth can still be commercial — but indie KDP should study craft, not chase awards as a plan',
        ],
        de: [
          'Kinder als emotional intelligent behandeln — nicht herabreden',
          'Visueller Fortschritt kann so viel Story tragen wie Worte',
          'Literarische Tiefe kann kommerziell sein — Indie-KDP sollte Craft studieren, nicht Awards als Plan jagen',
        ],
      },
      studyPoints: {
        en: [
          'Quality + emotional truth + imagination → generational sales',
          'Libraries/schools create permanent demand for true classics',
        ],
        de: [
          'Qualität + emotionale Wahrheit + Imagination → Generationen-Verkäufe',
          'Bibliotheken/Schulen schaffen permanente Nachfrage nach echten Klassikern',
        ],
      },
    },
    {
      id: 'dive_moon',
      title: 'Goodnight Moon',
      concept: {
        en: 'Bunny says goodnight to room objects — hypnotic repetition guides children toward sleep.',
        de: 'Hase sagt allem im Zimmer Gute Nacht — hypnotische Wiederholung führt zum Schlafen.',
      },
      whySells: {
        en: [
          'Solves a universal parenting problem: getting kids to sleep',
          'Source snapshot: ~50k+ reviews on some editions / decades of sales — verify',
          'Board book durability = multiple copies (home, grandparents, travel)',
        ],
        de: [
          'Löst ein universelles Eltern-Problem: Kinder zum Schlafen bringen',
          'Quellen-Snapshot: ca. 50k+ Reviews auf manchen Editionen / Jahrzehnte Verkäufe — prüfen',
          'Pappebuch-Haltbarkeit = Mehrfachkäufe (Zuhause, Großeltern, Reise)',
        ],
      },
      kdpLessons: {
        en: [
          'Rhythm + repetition outperform exciting plots for bedtime',
          'Soft art that supports calm — never distracts',
          'Consider a dedicated bedtime subseries next to emotions titles',
        ],
        de: [
          'Rhythmus + Wiederholung schlagen spannende Plots für die Gute Nacht',
          'Weiche Kunst, die Ruhe stützt — nie ablenkt',
          'Dedizierte Gute-Nacht-Unterserie neben Emotions-Titeln prüfen',
        ],
      },
      studyPoints: {
        en: [
          'Functional elegance beats flashy trends for 70+ year sales',
          'Format (board vs paperback) is a commercial decision',
        ],
        de: [
          'Funktionale Eleganz schlägt trendige Flashiness über 70+ Jahre',
          'Format (Pappe vs. Paperback) ist eine kommerzielle Entscheidung',
        ],
      },
    },
    {
      id: 'dive_guess',
      title: 'Guess How Much I Love You',
      concept: {
        en: 'Two hares escalate “I love you” comparisons — unconditional love framed as playful competition.',
        de: 'Zwei Hasen steigern „Ich hab dich lieb“-Vergleiche — bedingungslose Liebe als spielerischer Wettkampf.',
      },
      whySells: {
        en: [
          'Source snapshot: ~12k+ reviews / ~4.9★ — among highest-rated classics — verify',
          'Gift market: baby showers, new parents, teachers, nostalgia',
          'Board book + series universe around Nutbrown Hare',
        ],
        de: [
          'Quellen-Snapshot: ca. 12k+ Reviews / ca. 4,9★ — unter höchstbewerteten Klassikern — prüfen',
          'Geschenkmarkt: Babyparty, frische Eltern, Lehrkräfte, Nostalgie',
          'Pappebuch + Serienuniversum um Nutbrown Hare',
        ],
      },
      kdpLessons: {
        en: [
          'Heartfelt simplicity can outperform clever complexity',
          'Emotion milestones (love, goodbye, waiting) make series fuel',
          'Institutional + generational demand compounds over decades',
        ],
        de: [
          'Herzliche Einfachheit kann clevere Komplexität schlagen',
          'Emotions-Meilensteine (Liebe, Abschied, Warten) speisen Serien',
          'Institutionelle + generationsübergreifende Nachfrage wirkt über Jahrzehnte',
        ],
      },
      studyPoints: {
        en: [
          'Appeals to child and adult reader at once',
          'Escalating structure = easy beginner narrative engine',
        ],
        de: [
          'Spricht Kind und erwachsene Vorleser:innen zugleich an',
          'Steigerungsstruktur = einfacher Einsteiger-Erzählmotor',
        ],
      },
    },
  ],
  categories: [
    {
      id: 'courage_animal',
      title: {
        en: '1. Picture books — courage + animal (start here)',
        de: '1. Bilderbücher — Mut + Tierfigur (hier starten)',
      },
      priority: {
        en: 'Primary blueprint — most frequently cited commercial pattern in owner research',
        de: 'Primärer Blueprint — häufigstes kommerzielles Muster in der Owner-Recherche',
      },
      books: [
        {
          id: 'insp_koala',
          title: 'The Koala Who Could / Trau dich, Koalabär',
          ages: '3–5',
          formula: {
            en: 'Animal + fear of change + rhyming text (Rachel Bright series pattern)',
            de: 'Tier + Angst vor Veränderung + Reimtext (Rachel-Bright-Serienmuster)',
          },
          ratingNote: {
            en: 'Source snapshot: ~4.8★ / large review counts on EN; DE edition often cited in Amazon.de kids charts — verify live.',
            de: 'Quellen-Snapshot: ca. 4,8★ / hohe Review-Zahlen EN; DE-Ausgabe oft in Amazon.de-Charts genannt — live prüfen.',
          },
          role: {
            en: 'Exact formula to study for a German original — structure notes only, no copyrighted text',
            de: 'Formel für ein deutsches Original studieren — nur Struktur-Notizen, kein urheberrechtlich geschützter Text',
          },
        },
        {
          id: 'insp_lion',
          title: 'The Lion Inside / Der Löwe in dir',
          ages: '3–5',
          formula: {
            en: 'Small animal finds inner courage — same series family pattern',
            de: 'Kleines Tier findet inneren Mut — gleiches Serien-Muster',
          },
          ratingNote: {
            en: 'Source snapshot: high ★ / review volume on EN and DE editions — confirm on Amazon.de.',
            de: 'Quellen-Snapshot: hohe ★ / Review-Zahlen EN und DE — auf Amazon.de bestätigen.',
          },
          role: {
            en: 'Proof German readers buy this series pattern',
            de: 'Beleg, dass DE-Leser:innen dieses Serienmuster kaufen',
          },
        },
        {
          id: 'insp_different',
          title: '',
          titleHint: {
            en: 'Search Amazon.de: animal who feels different + uniqueness + rhyme (often compared to “Giraffes Can’t Dance” territory)',
            de: 'Auf Amazon.de suchen: Tier fühlt sich anders + Einzigartigkeit + Reim (oft „Giraffes Can’t Dance“-Territorium)',
          },
          ages: '3–5',
          formula: {
            en: 'Animal feels different → celebrates uniqueness; rhyme + self-belief',
            de: 'Tier fühlt sich anders → feiert Einzigartigkeit; Reim + Selbstvertrauen',
          },
          ratingNote: {
            en: 'Source cited strong ★ — confirm exact title/edition before treating as a model.',
            de: 'Quelle nennt starke ★ — genauen Titel/Edition prüfen, bevor Sie ihn als Modell nutzen.',
          },
          role: {
            en: 'Uniqueness / belonging theme blueprint',
            de: 'Blueprint für Einzigartigkeit / Zugehörigkeit',
          },
        },
        {
          id: 'insp_penguin',
          title: '',
          titleHint: {
            en: 'Search: Rachel Bright penguin + courage (same series family)',
            de: 'Suchen: Rachel Bright Pinguin + Mut (gleiche Serienfamilie)',
          },
          ages: '3–5',
          formula: {
            en: 'Courage theme with penguin character — animal + courage formula again',
            de: 'Mut-Thema mit Pinguin — erneut Tier + Mut-Formel',
          },
          ratingNote: {
            en: 'Source snapshot: strong ★ / reviews — verify live listing.',
            de: 'Quellen-Snapshot: starke ★ / Reviews — Live-Listing prüfen.',
          },
          role: {
            en: 'Validates repeating the animal + courage formula',
            de: 'Bestätigt die Wiederholung der Formel Tier + Mut',
          },
        },
      ],
    },
    {
      id: 'worry_resilience',
      title: {
        en: '2. Worry + emotional resilience (second priority)',
        de: '2. Sorgen + emotionale Resilienz (zweite Priorität)',
      },
      priority: {
        en: 'Emotions series with animal / playful characters',
        de: 'Emotions-Serie mit Tier- / Spielfiguren',
      },
      books: [
        {
          id: 'insp_worrysaurus',
          title: 'The Worrysaurus (and related)',
          ages: '1–5 / 3–6',
          formula: {
            en: 'Dinosaur / animal dealing with worry and anxiety',
            de: 'Dino / Tier mit Sorgen und Angst',
          },
          ratingNote: {
            en: 'Source snapshot: high ★ / review volume — verify edition on Amazon.de.',
            de: 'Quellen-Snapshot: hohe ★ / Reviews — Edition auf Amazon.de prüfen.',
          },
          role: {
            en: 'Blueprint for an emotions-based animal series',
            de: 'Blueprint für emotionsbasierte Tier-Serie',
          },
        },
        {
          id: 'insp_crayons',
          title: 'The Day the Crayons Quit (and sequels)',
          ages: '3–6',
          formula: {
            en: 'Feelings via humorous non-animal characters (crayons)',
            de: 'Gefühle über humorvolle Nicht-Tier-Figuren (Stifte)',
          },
          ratingNote: {
            en: 'Source snapshot: very high review volume / NYT-bestseller mentions — verify live.',
            de: 'Quellen-Snapshot: sehr hohe Review-Zahlen / NYT-Bestseller-Nennungen — live prüfen.',
          },
          role: {
            en: 'Shows emotional themes can ship with humour',
            de: 'Zeigt: Emotionsthemen funktionieren mit Humor',
          },
        },
      ],
    },
    {
      id: 'bonds_gift',
      title: {
        en: '3. Emotional bonds / love — gift market',
        de: '3. Emotionale Bindung / Liebe — Geschenkmarkt',
      },
      priority: {
        en: 'Board books and gift purchases dominate',
        de: 'Pappebücher und Geschenkkäufe dominieren',
      },
      books: [
        {
          id: 'insp_guess_love',
          title: 'Guess How Much I Love You (board book editions)',
          ages: '1–5',
          formula: {
            en: 'Parent–child love; board book format — classic gift pattern',
            de: 'Eltern-Kind-Liebe; Pappebuch — klassisches Geschenk-Muster',
          },
          ratingNote: {
            en: 'Source snapshot: very high ★ / reviews — verify current edition.',
            de: 'Quellen-Snapshot: sehr hohe ★ / Reviews — aktuelle Edition prüfen.',
          },
          role: {
            en: 'Gift-market gold-standard structure to study (not copy)',
            de: 'Geschenkmarkt-Goldstandard zum Studieren (nicht kopieren)',
          },
        },
        {
          id: 'insp_de_bonds',
          title: '',
          titleHint: {
            en: 'Search Amazon.de for German emotional-bond picture books (owner notes cite high international sales for DE titles)',
            de: 'Auf Amazon.de nach deutschen Bindungs-Bilderbüchern suchen (Owner-Notizen: hohe internationale Auflagen)',
          },
          ages: '3–99 (gift)',
          formula: {
            en: 'German-language emotional bonds picture book — gift positioning',
            de: 'Deutschsprachiges Bindungs-Bilderbuch — Geschenk-Positionierung',
          },
          ratingNote: {
            en: 'Source claims large worldwide sales — treat as marketing until you verify the specific title.',
            de: 'Quellen nennen hohe Weltauflagen — als Marketing sehen, bis der konkrete Titel verifiziert ist.',
          },
          role: {
            en: 'Proof DE market buys emotional-bond picture books',
            de: 'Beleg: DE-Markt kauft Bindungs-Bilderbücher',
          },
        },
      ],
    },
    {
      id: 'bedtime',
      title: {
        en: '4. Bedtime / soothing — structural classics',
        de: '4. Gute Nacht / beruhigend — Struktur-Klassiker',
      },
      priority: {
        en: 'Rhythm + repetition',
        de: 'Rhythmus + Wiederholung',
      },
      books: [
        {
          id: 'insp_goodnight_moon',
          title: 'Goodnight Moon',
          ages: '1–5',
          formula: {
            en: 'Iconic bedtime rhythm + repetition inducing calm',
            de: 'Ikonischer Gute-Nacht-Rhythmus + Wiederholung für Ruhe',
          },
          ratingNote: {
            en: 'Source snapshot: massive long-term review volume — verify edition.',
            de: 'Quellen-Snapshot: enorme langfristige Review-Zahlen — Edition prüfen.',
          },
          role: {
            en: 'Commercial bedtime formula — structure only',
            de: 'Kommerzielle Gute-Nacht-Formel — nur Struktur',
          },
        },
      ],
    },
    {
      id: 'donaldson',
      title: {
        en: '5. Animal adventure + rhyming — Donaldson-style formula',
        de: '5. Tier-Abenteuer + Reim — Donaldson-Formel',
      },
      priority: {
        en: 'Rhythm German parents recognise',
        de: 'Rhythmus, den DE-Eltern kennen',
      },
      books: [
        {
          id: 'insp_gruffalo',
          title: 'The Gruffalo',
          ages: '2–5',
          formula: {
            en: 'Global benchmark for rhyming animal picture books',
            de: 'Globaler Maßstab für reimende Tier-Bilderbücher',
          },
          ratingNote: {
            en: 'Source snapshot: very high ★ / reviews — verify DE edition ranks.',
            de: 'Quellen-Snapshot: sehr hohe ★ / Reviews — DE-Edition-Ränge prüfen.',
          },
          role: {
            en: 'Study rhyme architecture — never reproduce Donaldson text',
            de: 'Reim-Architektur studieren — niemals Donaldson-Text übernehmen',
          },
        },
        {
          id: 'insp_donaldson_friend',
          title: '',
          titleHint: {
            en: 'Search Julia Donaldson: adventure + friendship + animals (same rhyme school)',
            de: 'Julia Donaldson suchen: Abenteuer + Freundschaft + Tiere (gleiche Reim-Schule)',
          },
          ages: '2–5',
          formula: {
            en: 'Adventure + friendship with animals; rhyme-driven page turns',
            de: 'Abenteuer + Freundschaft mit Tieren; reimgetriebene Seitenumbrüche',
          },
          ratingNote: {
            en: 'Source snapshot: high ★ / reviews — confirm title on Amazon.de.',
            de: 'Quellen-Snapshot: hohe ★ / Reviews — Titel auf Amazon.de bestätigen.',
          },
          role: {
            en: 'Friendship / exploration theme in rhyme',
            de: 'Freundschafts-/Entdeckungs-Thema im Reim',
          },
        },
      ],
    },
  ],
  ageGroups: {
    verifiedNote: {
      en: '⚠ Segment notes are owner research — not Amazon guarantees. Tween decline % is a source claim (Börsenverein) — verify current reports.',
      de: '⚠ Segment-Notizen sind Owner-Recherche — keine Amazon-Garantie. Tween-Rückgang-% ist Quellen-Claim (Börsenverein) — aktuelle Reports prüfen.',
    },
    sweetSpot: {
      en: 'Sweet spot supported by owner research: ages 3–6, with primary focus on 2–4.',
      de: 'Sweet Spot laut Owner-Recherche: Alter 3–6, Fokus primär 2–4.',
    },
    rows: [
      {
        ages: { en: '0–2 (baby / toddler)', de: '0–2 (Baby / Kleinkind)' },
        sells: {
          en: 'Board books, soothing rhymes, simple repetition, soft illustrations',
          de: 'Pappebücher, beruhigende Reime, einfache Wiederholung, weiche Illustrationen',
        },
        why: {
          en: 'Parent-purchased; bedtime & sensory — Goodnight Moon territory',
          de: 'Eltern kaufen; Gute Nacht & Sensorik — Goodnight-Moon-Territorium',
        },
      },
      {
        ages: { en: '2–4 (preschool)', de: '2–4 (Vorschule)' },
        sells: {
          en: 'Animal characters, simple emotions, courage, change',
          de: 'Tierfiguren, einfache Emotionen, Mut, Veränderung',
        },
        why: {
          en: 'Largest commercially active kids picture segment in owner notes — Bright / Donaldson territory. Primary target.',
          de: 'Größtes kommerziell aktives Bilderbuch-Segment in Owner-Notizen — Bright-/Donaldson-Territorium. Primäres Ziel.',
        },
      },
      {
        ages: { en: '3–6 (Kindergarten)', de: '3–6 (Kindergarten)' },
        sells: {
          en: 'Emotional resilience, friendship, being different, worry',
          de: 'Emotionale Resilienz, Freundschaft, Anderssein, Sorgen',
        },
        why: {
          en: 'Nurseries / Kindergärten buy here — Worrysaurus territory',
          de: 'Kitas / Kindergärten kaufen hier — Worrysaurus-Territorium',
        },
      },
      {
        ages: { en: '5–7 (school starter)', de: '5–7 (Schulanfang)' },
        sells: {
          en: 'Early reading, rhyme with slightly longer text',
          de: 'Frühes Lesen, Reim mit etwas längerem Text',
        },
        why: {
          en: 'Schools & libraries — Gruffalo / Giraffes Can’t Dance territory',
          de: 'Schulen & Bibliotheken — Gruffalo- / Giraffes-Can’t-Dance-Territorium',
        },
      },
      {
        ages: { en: '10–15 (tween)', de: '10–15 (Tween)' },
        sells: {
          en: 'AVOID as primary KDP kids focus for now',
          de: 'VORERST MEIDEN als primären KDP-Kinderfokus',
        },
        why: {
          en: 'Source note (Börsenverein): sharp demographic decline cited (~−30.6%) — verify current Börsenverein data before any tween strategy.',
          de: 'Quellen-Notiz (Börsenverein): starker demografischer Rückgang genannt (ca. −30,6 %) — aktuelle Börsenverein-Daten prüfen.',
        },
      },
    ],
  },
  tools: {
    heading: {
      en: 'Tools beyond Neolemon / generic AI image apps',
      de: 'Tools jenseits von Neolemon / generischen KI-Bild-Apps',
    },
    verifiedNote: {
      en: '⚠ Tool prices and features change — confirm on vendor sites. Prefer free Amazon.de bestseller lists before paid research tools.',
      de: '⚠ Tool-Preise und Features ändern sich — auf Anbieterseiten prüfen. Kostenlose Amazon.de-Bestseller-Listen vor bezahlten Tools.',
    },
    groups: [
      {
        id: 'research',
        title: { en: 'KDP research & market analysis', de: 'KDP-Recherche & Marktanalyse' },
        items: [
          {
            name: 'Amazon KDP Bookshelf',
            cost: { en: 'Free', de: 'Kostenlos' },
            why: {
              en: 'Publishing dashboard — sales, royalties, rank',
              de: 'Publishing-Dashboard — Verkäufe, Royalties, Rang',
            },
            url: 'https://kdp.amazon.com/',
          },
          {
            name: 'Amazon.de Bestseller — Kinderbücher',
            cost: { en: 'Free (most important weekly habit)', de: 'Kostenlos (wichtigste Wochen-Routine)' },
            why: {
              en: 'Live signal: Amazon.de → Bücher → Kinderbücher (e.g. Familie für Kinder paths). Updated frequently — better than any paid tool for trend checks.',
              de: 'Live-Signal: Amazon.de → Bücher → Kinderbücher (z. B. Familie für Kinder). Häufig aktualisiert — besser als jedes bezahlte Tool für Trend-Checks.',
            },
            url: 'https://www.amazon.de/gp/bestsellers/books/',
          },
          {
            name: 'Publisher Rocket',
            cost: { en: 'Paid ~$97 one-time (verify)', de: 'Bezahlt ca. 97 $ einmalig (prüfen)' },
            why: {
              en: 'KDP keyword/category research — search volume & competition estimates',
              de: 'KDP-Keyword-/Kategorie-Recherche — Suchvolumen- & Wettbewerbs-Schätzungen',
            },
            url: 'https://publisherrocket.com/',
            note: {
              en: '⚠ Estimates only — always re-check on Amazon.de.',
              de: '⚠ Nur Schätzungen — immer auf Amazon.de gegenchecken.',
            },
          },
          {
            name: 'KDP Spy (Chrome)',
            cost: { en: 'Paid ~$67/year (verify)', de: 'Bezahlt ca. 67 $/Jahr (prüfen)' },
            why: {
              en: 'Competitor estimates on search pages — treat as rough',
              de: 'Konkurrenz-Schätzungen auf Suchseiten — nur grob',
            },
            url: 'https://chrome.google.com/webstore/',
            note: {
              en: '⚠ Search the extension name; verify publisher and privacy before install.',
              de: '⚠ Extension-Namen suchen; Anbieter und Privacy vor Installation prüfen.',
            },
          },
          {
            name: 'Kindlepreneur Book Description Generator',
            cost: { en: 'Free', de: 'Kostenlos' },
            why: {
              en: 'HTML-friendly description formatting for KDP',
              de: 'HTML-freundliche Beschreibungs-Formatierung für KDP',
            },
            url: 'https://kindlepreneur.com/',
          },
        ],
      },
      {
        id: 'seo',
        title: { en: 'Keyword & SEO research', de: 'Keyword- & SEO-Recherche' },
        items: [
          {
            name: 'Google Keyword Planner',
            cost: { en: 'Free (Google Ads account)', de: 'Kostenlos (Google-Ads-Konto)' },
            why: {
              en: 'German parent phrases e.g. „Bilderbuch Mut“, „Kinderbuch Gefühle“',
              de: 'Deutsche Eltern-Phrasen z. B. „Bilderbuch Mut“, „Kinderbuch Gefühle“',
            },
            url: 'https://ads.google.com/home/lib_zulu/keyword-planner/',
          },
          {
            name: 'Ubersuggest',
            cost: { en: 'Free tier + paid', de: 'Free-Tier + bezahlt' },
            why: {
              en: 'Keyword ideas with DE language support',
              de: 'Keyword-Ideen mit DE-Sprachsupport',
            },
            url: 'https://neilpatel.com/ubersuggest/',
          },
          {
            name: 'AnswerThePublic',
            cost: { en: 'Free tier + paid', de: 'Free-Tier + bezahlt' },
            why: {
              en: 'Questions/phrases parents ask around children’s books',
              de: 'Fragen/Phrasen von Eltern rund um Kinderbücher',
            },
            url: 'https://answerthepublic.com/',
          },
        ],
      },
      {
        id: 'create',
        title: { en: 'Illustration & book creation', de: 'Illustration & Bucherstellung' },
        items: [
          {
            name: 'StoryForge (ScanLogic)',
            cost: { en: 'App credits — desktop', de: 'App-Credits — Desktop' },
            why: {
              en: 'Pinned Character Turbo anchor → consistent pages → preflight → interior PDF (beyond one-off AI apps)',
              de: 'Character-Turbo-Anker → konsistente Seiten → Preflight → Innenteil-PDF (jenseits Einmal-KI-Apps)',
            },
            url: null,
            storyforge: true,
          },
          {
            name: 'Canva Pro',
            cost: { en: '~€13/mo (verify)', de: 'ca. 13 €/Mon. (prüfen)' },
            why: {
              en: 'Layouts and mockups; common among indie KDP publishers',
              de: 'Layouts und Mockups; häufig bei Indie-KDP-Publishern',
            },
            url: 'https://www.canva.com/',
          },
          {
            name: 'Adobe InDesign',
            cost: { en: '~€25/mo (verify)', de: 'ca. 25 €/Mon. (prüfen)' },
            why: {
              en: 'Industry-standard interior formatting',
              de: 'Branchenstandard für Innenteil-Formatierung',
            },
            url: 'https://www.adobe.com/',
          },
          {
            name: 'Procreate (iPad)',
            cost: { en: 'One-time ~€13 (verify)', de: 'Einmalig ca. 13 € (prüfen)' },
            why: {
              en: 'Popular for hand-drawn kids illustration',
              de: 'Beliebt für handgezeichnete Kinderillustration',
            },
            url: 'https://procreate.com/',
          },
          {
            name: 'Book Bolt',
            cost: { en: 'Paid ~$9.99/mo (verify)', de: 'Bezahlt ca. 9,99 $/Mon. (prüfen)' },
            why: {
              en: 'KDP interiors/covers; check DE template quality yourself',
              de: 'KDP-Innenteile/Cover; DE-Template-Qualität selbst prüfen',
            },
            url: 'https://bookbolt.io/',
          },
        ],
      },
      {
        id: 'translate',
        title: { en: 'Translation (EN → DE)', de: 'Übersetzung (EN → DE)' },
        items: [
          {
            name: 'DeepL Pro',
            cost: { en: '~€8.99/mo (verify)', de: 'ca. 8,99 €/Mon. (prüfen)' },
            why: {
              en: 'Strong MT for German — always native review, especially rhyme',
              de: 'Starke MT für Deutsch — immer Native-Review, besonders bei Reimen',
            },
            url: 'https://www.deepl.com/',
          },
          {
            name: 'Upwork / Fiverr',
            cost: { en: 'Per project', de: 'Pro Projekt' },
            why: {
              en: 'Hire DE children’s translators/proofreaders — critical for rhyme/rhythm',
              de: 'DE-Kinderbuch-Übersetzer:innen/Lektor:innen — kritisch für Reim/Rhythmus',
            },
            url: 'https://www.upwork.com/',
          },
        ],
      },
      {
        id: 'community',
        title: { en: 'Community & validation', de: 'Community & Validierung' },
        items: [
          {
            name: 'KDP Community Forums',
            cost: { en: 'Free', de: 'Kostenlos' },
            why: {
              en: 'Indie publishers — including DE topics',
              de: 'Indie-Publisher — inkl. DE-Themen',
            },
            url: 'https://www.kdpcommunity.com/',
          },
          {
            name: 'Kindlepreneur Blog',
            cost: { en: 'Free', de: 'Kostenlos' },
            why: {
              en: 'KDP strategy, pricing, keywords (verify DE applicability)',
              de: 'KDP-Strategie, Pricing, Keywords (DE-Tauglichkeit prüfen)',
            },
            url: 'https://kindlepreneur.com/blog/',
          },
        ],
      },
    ],
  },
}
