/**
 * How to write a bilingual children’s picture-book story (DE KDP).
 * Benchmark patterns from beloved read-aloud picture books (e.g. Koala Who Could–type arcs).
 * Study structure only — never copy text or art. Soften freelance / AI tool upsells with ⚠.
 */

export const BILINGUAL_STORY_CONFIG = {
  lastVerified: '2026-04-11',
  sourceLabel:
    'Owner craft playbook: picture-book story formula + bilingual layout/translation rules — study comps on Amazon.de; do not copy',
  independenceDisclaimer: {
    en: 'Not affiliated with Amazon or any named title’s publisher. Review % / star counts are dated source notes. Study structure and emotional craft only — never copy text, rhyme, or illustrations. Freelance marketplaces and AI art tools may upsell.',
    de: 'Nicht mit Amazon oder Verlagen genannter Titel verbunden. Review-% / Sterne sind datierte Quellen-Notizen. Nur Struktur und emotionale Craft studieren — nie Text, Reim oder Illus kopieren. Freelance-Marktplätze und KI-Art-Tools können Upsells haben.',
  },
  intro: {
    en: 'Great bilingual picture books use the same craft as beloved mono-language read-alouds: one emotional core, one clear character arc, rhythm that kids ask to hear again — then a clean dual-language layout and a verified native translation.',
    de: 'Große bilinguale Bilderbücher nutzen dieselbe Craft wie geliebte einsprachige Vorlesebücher: ein emotionaler Kern, ein klarer Charakterbogen, Rhythmus den Kinder wiederhören wollen — dann ein sauberes Dual-Language-Layout und eine verifizierte Muttersprach-Übersetzung.',
  },
  formula: {
    heading: {
      en: 'Part 1 — What makes a great children’s book story',
      de: 'Teil 1 — Was eine große Kinderbuch-Story ausmacht',
    },
    note: {
      en: 'Benchmark pattern (Koala Who Could–type books): one universal feeling, one character with a clear problem, rhyme/rhythm, hopeful close. Study — do not copy.',
      de: 'Benchmark-Muster (Koala-Who-Could-Typ): ein universelles Gefühl, ein Charakter mit klarem Problem, Reim/Rhythmus, hoffnungsvolles Ende. Studieren — nicht kopieren.',
    },
    rows: [
      {
        id: 'core',
        element: { en: 'Emotional core', de: 'Emotionaler Kern' },
        works: {
          en: 'One simple, universal feeling',
          de: 'Ein einfaches, universelles Gefühl',
        },
        example: {
          en: 'Fear of change',
          de: 'Angst vor Veränderung',
        },
      },
      {
        id: 'character',
        element: { en: 'Character', de: 'Figur' },
        works: {
          en: 'One relatable main character with a clear problem',
          de: 'Eine nahbare Hauptfigur mit klarem Problem',
        },
        example: {
          en: 'Cautious koala who clings to safety',
          de: 'Vorsichtiger Koala, der an Sicherheit klammert',
        },
      },
      {
        id: 'arc',
        element: { en: 'Arc', de: 'Bogen' },
        works: {
          en: 'Starts stuck → faces challenge → transforms',
          de: 'Steckt fest → stellt sich Herausforderung → wandelt sich',
        },
        example: {
          en: 'Learns to embrace change',
          de: 'Lernt, Veränderung anzunehmen',
        },
      },
      {
        id: 'rhythm',
        element: { en: 'Rhyme & rhythm', de: 'Reim & Rhythmus' },
        works: {
          en: 'Sing-song, read-aloud text kids request again',
          de: 'Sing-sang, Vorlese-Text den Kinder wieder verlangen',
        },
        example: {
          en: 'Rhythmic rhyming (or strong lyrical repetition)',
          de: 'Rhythmischer Reim (oder starke lyrische Wiederholung)',
        },
      },
      {
        id: 'message',
        element: { en: 'Message', de: 'Botschaft' },
        works: {
          en: 'One clear life lesson',
          de: 'Eine klare Lebenslehre',
        },
        example: {
          en: 'Outside comfort zone → adventure',
          de: 'Außerhalb der Komfortzone → Abenteuer',
        },
      },
      {
        id: 'resolution',
        element: { en: 'Resolution', de: 'Auflösung' },
        works: {
          en: 'Hopeful, positive ending',
          de: 'Hoffnungsvolles, positives Ende',
        },
        example: {
          en: 'Life can be new and wonderful',
          de: 'Leben kann neu und wunderbar sein',
        },
      },
    ],
  },
  themes: {
    heading: {
      en: 'Step 1 — Choose ONE emotional core theme',
      de: 'Schritt 1 — EINEN emotionalen Kern wählen',
    },
    bullets: {
      en: [
        'Overcoming fear / trying new things',
        'Embracing who you are / self-acceptance',
        'Making friends / loneliness',
        'Sharing / kindness',
        'Missing home / belonging — excellent for diaspora bilingual books',
        'Being brave in a new place — strong fit for Twi–DE, Igbo–DE, etc.',
        'Belonging between two worlds / pride in heritage is deeply resonant for diaspora kids — and still rare for many African-language↔DE pairs (validate demand first)',
      ],
      de: [
        'Angst überwinden / Neues wagen',
        'Sich selbst annehmen / Selbstakzeptanz',
        'Freunde finden / Einsamkeit',
        'Teilen / Freundlichkeit',
        'Heimat vermissen / Zugehörigkeit — stark für Diaspora-Bilingual',
        'Mut an einem neuen Ort — starker Fit für Twi–DE, Igbo–DE usw.',
        'Zwischen zwei Welten / Stolz auf Heritage resoniert tief bei Diaspora-Kindern — und ist für viele afrikanische Sprachen↔DE noch selten (Demand zuerst validieren)',
      ],
    },
  },
  character: {
    heading: {
      en: 'Step 2 — Create your character',
      de: 'Schritt 2 — Figur entwickeln',
    },
    bullets: {
      en: [
        'Simple and iconic — one main visual trait (clings to a tree, wears a bright scarf…)',
        'Relatable — child readers should see themselves',
        'Named simply — short, memorable names',
        'Emotionally expressive — illustrated reactions carry the story',
        'Bilingual tip: a heritage-culture name (e.g. Kofi, Chidi) can signal authenticity to diaspora buyers — only if respectful and community-checked',
      ],
      de: [
        'Einfach und ikonisch — ein visuelles Hauptmerkmal (klammert am Baum, trägt bunten Schal…)',
        'Nahbar — Kinder sollen sich wiederfinden',
        'Einfach benannt — kurze, merkbare Namen',
        'Emotional ausdrucksstark — illustrierte Reaktionen tragen die Story',
        'Bilingual-Tipp: ein Heritage-Kultur-Name (z. B. Kofi, Chidi) kann Authentizität signalisieren — nur respektvoll und community-geprüft',
      ],
    },
  },
  structure: {
    heading: {
      en: 'Step 3 — Structure across ~14 spreads (32-page picture book)',
      de: 'Schritt 3 — Struktur über ca. 14 Spreads (32-Seiten-Bilderbuch)',
    },
    intro: {
      en: 'A standard ~32-page picture book has roughly 14 double-page spreads:',
      de: 'Ein Standard-~32-Seiten-Bilderbuch hat grob 14 Doppelseiten:',
    },
    rows: [
      {
        spreads: { en: '1–2', de: '1–2' },
        beat: { en: 'Opening', de: 'Eröffnung' },
        what: {
          en: 'Introduce world and character’s normal life',
          de: 'Welt und normales Leben der Figur vorstellen',
        },
      },
      {
        spreads: { en: '3–4', de: '3–4' },
        beat: { en: 'Establish the problem', de: 'Problem etablieren' },
        what: {
          en: 'Something disrupts their world',
          de: 'Etwas stört ihre Welt',
        },
      },
      {
        spreads: { en: '5–7', de: '5–7' },
        beat: { en: 'Resistance / struggle', de: 'Widerstand / Kampf' },
        what: {
          en: 'Character tries to avoid or fix the problem',
          de: 'Figur versucht, das Problem zu vermeiden oder zu lösen',
        },
      },
      {
        spreads: { en: '8–10', de: '8–10' },
        beat: { en: 'Rising stakes', de: 'Steigende Einsätze' },
        what: {
          en: 'Things get harder; character must choose',
          de: 'Es wird schwerer; Figur muss wählen',
        },
      },
      {
        spreads: { en: '11–12', de: '11–12' },
        beat: { en: 'Turning point', de: 'Wendepunkt' },
        what: {
          en: 'Brave choice or discovery',
          de: 'Mutige Wahl oder Entdeckung',
        },
      },
      {
        spreads: { en: '13', de: '13' },
        beat: { en: 'Resolution', de: 'Auflösung' },
        what: {
          en: 'Problem resolved; character has changed',
          de: 'Problem gelöst; Figur hat sich verändert',
        },
      },
      {
        spreads: { en: '14', de: '14' },
        beat: { en: 'Final page', de: 'Schlussseite' },
        what: {
          en: 'Warm, memorable closing image and line',
          de: 'Warmes, merkbares Schlussbild und Schlusszeile',
        },
      },
    ],
  },
  readAloud: {
    heading: {
      en: 'Step 4 — Write for read-aloud (rhyme & rhythm)',
      de: 'Schritt 4 — Fürs Vorlesen schreiben (Reim & Rhythmus)',
    },
    optionA: {
      title: {
        en: 'Option A — Rhyming text (very popular)',
        de: 'Option A — Reimtext (sehr populär)',
      },
      bullets: {
        en: [
          'Use AABB or ABAB rhyme schemes',
          'Keep a consistent syllable count per line (~7–9 often works)',
          'Read every line aloud — if it feels forced, rewrite',
          'Avoid forced rhymes that warp meaning',
        ],
        de: [
          'AABB- oder ABAB-Reimschemata',
          'Konsistente Silbenzahl pro Zeile (ca. 7–9 oft gut)',
          'Jede Zeile laut lesen — wirkt sie erzwungen, neu schreiben',
          'Erzwungene Reime vermeiden, die die Bedeutung verbiegen',
        ],
      },
    },
    optionB: {
      title: {
        en: 'Option B — Lyrical prose (often easier for bilingual)',
        de: 'Option B — Lyrische Prosa (oft einfacher bilingual)',
      },
      bullets: {
        en: [
          'No strict rhyme, but strong rhythm and repetition',
          'Repeating phrases work beautifully (“Kofi said YES…”)',
          'Translates more cleanly into a second language without losing meaning',
        ],
        de: [
          'Kein strikter Reim, aber starker Rhythmus und Wiederholung',
          'Wiederholte Phrasen wirken stark („Kofi sagte JA…“)',
          'Übersetzt sauberer in eine zweite Sprache ohne Bedeutungsverlust',
        ],
      },
    },
    bilingualTip: {
      en: 'If you rhyme in one language, a direct translation almost never rhymes. Either write separate rhyming text per language (needs a skilled heritage-language poet/translator) or choose lyrical prose for cleaner dual-language craft.',
      de: 'Reimen Sie in einer Sprache, reimt die Direktübersetzung fast nie. Entweder getrennten Reimtext pro Sprache (braucht geschickte Heritage-Sprach-Poet:in/Übersetzer:in) oder lyrische Prosa für sauberere Dual-Language-Craft.',
    },
  },
  layouts: {
    heading: {
      en: 'Step 5 — Bilingual layout formats',
      de: 'Schritt 5 — Bilinguale Layout-Formate',
    },
    note: {
      en: 'Most popular on Amazon.de for parent–child reading: side-by-side and top/bottom split — clearest for learning together.',
      de: 'Auf Amazon.de für Eltern–Kind-Lesen meist klar: Side-by-side und oben/unten-Split — am besten zum gemeinsamen Lernen.',
    },
    rows: [
      {
        id: 'side',
        format: { en: 'Side-by-side text', de: 'Text nebeneinander' },
        how: {
          en: 'Both languages on every page simultaneously',
          de: 'Beide Sprachen gleichzeitig auf jeder Seite',
        },
        bestFor: {
          en: 'Learning-tool focus',
          de: 'Fokus Lernhilfe',
        },
      },
      {
        id: 'split',
        format: { en: 'Top/bottom split', de: 'Oben/unten-Split' },
        how: {
          en: 'One language above the art, one below',
          de: 'Eine Sprache über der Kunst, eine darunter',
        },
        bestFor: {
          en: 'Clean visual layout',
          de: 'Sauberes visuelles Layout',
        },
      },
      {
        id: 'alternate',
        format: { en: 'Alternate pages', de: 'Wechselnde Seiten' },
        how: {
          en: 'Language 1 on left, Language 2 on right',
          de: 'Sprache 1 links, Sprache 2 rechts',
        },
        bestFor: {
          en: 'Immersive experience',
          de: 'Immersives Erlebnis',
        },
      },
      {
        id: 'flip',
        format: { en: 'Full book twice / flip', de: 'Ganzes Buch doppelt / Flip' },
        how: {
          en: 'Entire story in Language 1; flip for Language 2',
          de: 'Ganze Story in Sprache 1; umdrehen für Sprache 2',
        },
        bestFor: {
          en: 'Collector / gift appeal',
          de: 'Sammler- / Geschenk-Appeal',
        },
      },
    ],
  },
  translation: {
    heading: {
      en: 'Step 6 — Get the translation right',
      de: 'Schritt 6 — Übersetzung richtig machen',
    },
    bullets: {
      en: [
        'Never rely on raw machine translate for Twi, Igbo, Swahili, or Zulu — quality and cultural fit are unreliable',
        'Prefer a native speaker from your community — diaspora Facebook / WhatsApp groups in Germany are strong sources',
        'Offer credit in the book (“Twi translation by …”) + free copy — many help for recognition',
        '⚠ Freelance marketplaces (Fiverr / Upwork) vary wildly — samples, rights, and reviews first; community trust often beats the cheapest bid',
        'Have two native speakers independently verify before publish',
        'Poor translation destroys credibility with diaspora buyers faster than a weak cover',
        'Full Twi/Igbo find-and-verify playbook: open “Twi / Igbo translator” in this hub',
      ],
      de: [
        'Nie rohe Maschinenübersetzung für Twi, Igbo, Swahili oder Zulu verlassen — Qualität und Kulturfit unzuverlässig',
        'Muttersprachler:in aus der Community bevorzugen — Diaspora-Facebook-/WhatsApp-Gruppen in DE sind starke Quellen',
        'Credit im Buch anbieten („Twi-Übersetzung von …“) + Freiexemplar — viele helfen für Anerkennung',
        '⚠ Freelance-Marktplätze (Fiverr / Upwork) variieren stark — zuerst Samples, Rechte, Reviews; Community-Trust schlägt oft den billigsten Bid',
        'Zwei Muttersprachler:innen unabhängig vor Publish verifizieren lassen',
        'Schlechte Übersetzung zerstört Glaubwürdigkeit bei Diaspora-Käufer:innen schneller als ein schwaches Cover',
        'Volles Twi/Igbo Find-and-Verify-Playbook: „Twi- / Igbo-Übersetzer“ in diesem Hub öffnen',
      ],
    },
  },
  wordCounts: {
    heading: {
      en: 'Part 3 — Word count & page count rules',
      de: 'Teil 3 — Wort- & Seitenzahl-Regeln',
    },
    rows: [
      {
        type: { en: 'Board book', de: 'Pappbilderbuch' },
        age: { en: '0–3', de: '0–3' },
        words: { en: '100–300 words', de: '100–300 Wörter' },
        pages: { en: '12–24', de: '12–24' },
      },
      {
        type: { en: 'Picture book', de: 'Bilderbuch' },
        age: { en: '3–7', de: '3–7' },
        words: { en: '300–800 words', de: '300–800 Wörter' },
        pages: { en: '~32', de: 'ca. 32' },
      },
      {
        type: { en: 'Early reader', de: 'Erstleser' },
        age: { en: '5–8', de: '5–8' },
        words: { en: '1,000–2,500 words', de: '1.000–2.500 Wörter' },
        pages: { en: '32–64', de: '32–64' },
      },
    ],
    bilingualAim: {
      en: 'For a bilingual picture book, aim ~300–500 words per language so pages do not feel text-heavy.',
      de: 'Für ein bilinguales Bilderbuch ca. 300–500 Wörter pro Sprache anstreben, damit Seiten nicht textlastig wirken.',
    },
  },
  template: {
    heading: {
      en: 'Part 4 — Story template (adapt, don’t copy)',
      de: 'Teil 4 — Story-Template (adaptieren, nicht kopieren)',
    },
    note: {
      en: 'Example beats only — write your own words, names, and culture-true details.',
      de: 'Nur Beispiel-Beats — eigene Worte, Namen und kulturtreue Details schreiben.',
    },
    beats: [
      {
        id: 'open',
        spreads: { en: 'Pages 1–2 — Opening', de: 'Seiten 1–2 — Eröffnung' },
        tip: {
          en: 'Introduce character and world; show personality.',
          de: 'Figur und Welt vorstellen; Persönlichkeit zeigen.',
        },
        example: {
          en: 'Meet [Name]. [Name] lived between two worlds — one full of sunshine and drums, one full of snow and songs.',
          de: 'Das ist [Name]. [Name] lebte zwischen zwei Welten — eine voll Sonne und Trommeln, eine voll Schnee und Liedern.',
        },
      },
      {
        id: 'problem',
        spreads: { en: 'Pages 3–4 — Problem', de: 'Seiten 3–4 — Problem' },
        tip: {
          en: 'Challenge often tied to identity or belonging.',
          de: 'Herausforderung oft an Identität oder Zugehörigkeit gekoppelt.',
        },
        example: {
          en: 'At school, everyone spoke one language. At home, another. Which world was really theirs?',
          de: 'In der Schule sprachen alle eine Sprache. Zu Hause eine andere. Welche Welt war wirklich die ihre?',
        },
      },
      {
        id: 'journey',
        spreads: { en: 'Pages 5–10 — Journey', de: 'Seiten 5–10 — Reise' },
        tip: {
          en: 'Explore, try, struggle, discover something about self.',
          de: 'Erkunden, versuchen, kämpfen, etwas über sich entdecken.',
        },
        example: {
          en: '(Your original scenes — keep one clear emotional through-line.)',
          de: '(Ihre originalen Szenen — eine klare emotionale Linie halten.)',
        },
      },
      {
        id: 'turn',
        spreads: { en: 'Pages 11–12 — Turning point', de: 'Seiten 11–12 — Wendepunkt' },
        tip: {
          en: 'Realisation or acceptance.',
          de: 'Erkenntnis oder Annahme.',
        },
        example: {
          en: 'They didn’t have to choose. They were BOTH — and both was beautiful.',
          de: 'Sie mussten nicht wählen. Sie waren BEIDES — und beides war wunderschön.',
        },
      },
      {
        id: 'close',
        spreads: { en: 'Pages 13–14 — Resolution + close', de: 'Seiten 13–14 — Auflösung + Schluss' },
        tip: {
          en: 'Warm ending + memorable final line.',
          de: 'Warmes Ende + merkbare Schlusszeile.',
        },
        example: {
          en: 'Two languages, two worlds, one heart — and all of it theirs.',
          de: 'Zwei Sprachen, zwei Welten, ein Herz — und alles gehört ihnen.',
        },
      },
    ],
  },
  studyList: {
    heading: {
      en: 'What to study (structure only)',
      de: 'Was studieren (nur Struktur)',
    },
    note: {
      en: '⚠ Open live Amazon.de / .com listings. Star counts change. Never copy text or art. Prefer craft guides + successful bilingual layouts.',
      de: '⚠ Live-Amazon.de-/.com-Listings öffnen. Sterne ändern sich. Nie Text oder Kunst kopieren. Craft-Guides + erfolgreiche bilinguale Layouts bevorzugen.',
    },
    bullets: {
      en: [
        'Beloved courage / change picture books — emotional core, page turns, read-aloud rhythm',
        'High-review bilingual EN–DE (and AR–DE series) — text volume per page, how art carries story',
        'Simple emotional-theme bilingual titles — first-book models for clarity',
        'Optional craft guides (writing picture books, page turns, word count) — verify live ratings before buying',
        '⚠ AI illustration + KDP guides may upsell tools; keep Amazon AI disclosure rules current',
      ],
      de: [
        'Geliebte Mut-/Veränderungs-Bilderbücher — emotionaler Kern, Page Turns, Vorlese-Rhythmus',
        'Hoch bewertete bilinguale EN–DE (und AR–DE-Serien) — Textmenge pro Seite, wie Kunst die Story trägt',
        'Einfache Emotionsthemen bilingual — Erstbuch-Modelle für Klarheit',
        'Optionale Craft-Guides (Bilderbuch schreiben, Page Turns, Wortzahl) — Live-Ratings vor Kauf prüfen',
        '⚠ KI-Illustration + KDP-Guides können Tools upsellen; aktuelle Amazon-KI-Disclosure-Regeln halten',
      ],
    },
  },
  advantage: {
    en: 'Your edge in underserved African-language↔DE niches is authenticity + emotional truth + clear illustrations — not perfection. Cross-check niche research + bilingual kids modules before you write.',
    de: 'Ihr Vorteil in unterversorgten afrikanischen Sprachen↔DE-Nischen ist Authentizität + emotionale Wahrheit + klare Illus — nicht Perfektion. Vor dem Schreiben Nischen-Research + Bilingual-Kids-Module gegenprüfen.',
  },
  links: [
    {
      label: 'Amazon.de — zweisprachiges Kinderbuch',
      url: 'https://www.amazon.de/s?k=zweisprachiges+Kinderbuch',
    },
    {
      label: 'Amazon.de — Kinderbilderbuch Mut',
      url: 'https://www.amazon.de/s?k=Kinderbuch+Mut+Veränderung',
    },
    { label: 'KDP', url: 'https://kdp.amazon.com/' },
  ],
}
