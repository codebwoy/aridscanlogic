/**
 * What to publish first (DE KDP) — owner research notes from Amazon.de kids charts
 * and market reports. Not scraped live. Ranks/reviews change — verify on Amazon.de.
 */

export const PUBLISH_WHAT_CONFIG = {
  lastVerified: '2026-10-01',
  sourceLabel:
    'Owner notes: Amazon.de Kinderbücher / Familie für Kinder charts (Oct 2026 snapshot) + Börsenverein/Statista context — re-check live lists weekly',
  independenceDisclaimer: {
    en: 'Not affiliated with Amazon. Chart positions and sales claims are dated source snapshots, not guarantees. Study themes — never copy text or art.',
    de: 'Nicht mit Amazon verbunden. Chart-Positionen und Verkaufsansprüche sind datierte Quellen-Snapshots, keine Garantien. Themen studieren — nie Text oder Kunst kopieren.',
  },
  snapshotNote: {
    en: '⚠ “Right now / top 15” language refers to the owner’s October 2026 snapshot. Open Amazon.de bestsellers yourself before deciding.',
    de: '⚠ Formulierungen wie „gerade / Top 15“ beziehen sich auf den Owner-Snapshot Oktober 2026. Öffnen Sie Amazon.de-Bestseller selbst vor der Entscheidung.',
  },
  dominantThemes: [
    {
      id: 'courage',
      theme: { en: 'Courage & overcoming fear', de: 'Mut & Angst überwinden' },
      evidence: {
        en: 'Source examples on DE kids lists: Geh deinen Weg, Schildkröte (courage/togetherness); Prinzessin Malani (Mut/magic); Baby Pixi: Das kleine Muthörnchen (courage for ~12m+)',
        de: 'Quellen-Beispiele auf DE-Kinderlisten: Geh deinen Weg, Schildkröte (Mut/Zusammenhalt); Prinzessin Malani (Mut/Magie); Baby Pixi: Das kleine Muthörnchen (Mut ab ca. 12 Mon.)',
      },
    },
    {
      id: 'bonds',
      theme: { en: 'Emotional bonds / love', de: 'Emotionale Bindung / Liebe' },
      evidence: {
        en: 'Source examples: Das unsichtbare Band (large worldwide sales claim); Warum eine Tochter ihren Papa braucht; Weil du ein besonderes Mädchen bist',
        de: 'Quellen-Beispiele: Das unsichtbare Band (hohe Weltauflagen-Claim); Warum eine Tochter ihren Papa braucht; Weil du ein besonderes Mädchen bist',
      },
    },
    {
      id: 'nature',
      theme: { en: 'Nature & animals', de: 'Natur & Tiere' },
      evidence: {
        en: 'Source examples: Die Welt der Haie, Schildkröten, Das große Meeresforscher-Buch; animal themes frequent on indie KDP charts (verify live)',
        de: 'Quellen-Beispiele: Die Welt der Haie, Schildkröten, Das große Meeresforscher-Buch; Tiermotive häufig auf Indie-KDP-Charts (live prüfen)',
      },
    },
    {
      id: 'adventure',
      theme: { en: 'Adventure & mystery', de: 'Abenteuer & Mystery' },
      evidence: {
        en: 'Source examples: Die drei ??? Kids; Rico, Oskar und die Tieferschatten (friendship + being different)',
        de: 'Quellen-Beispiele: Die drei ??? Kids; Rico, Oskar und die Tieferschatten (Freundschaft + Anderssein)',
      },
    },
    {
      id: 'early_reading',
      theme: { en: 'Early reading / letters', de: 'Erstlesen / Buchstaben' },
      evidence: {
        en: 'Source examples: Lies mal 3 (~4.8★ / 1,543 reviews as of source note); Die Schule der magischen Tiere (early reader series)',
        de: 'Quellen-Beispiele: Lies mal 3 (Quellen ca. 4,8★ / 1.543 Reviews); Die Schule der magischen Tiere (Erstleser-Serie)',
      },
    },
    {
      id: 'fantasy',
      theme: { en: 'Magic & fantasy', de: 'Magie & Fantasy' },
      evidence: {
        en: 'Source examples: Petronella Apfelmus; Herr der Diebe (Cornelia Funke)',
        de: 'Quellen-Beispiele: Petronella Apfelmus; Herr der Diebe (Cornelia Funke)',
      },
    },
    {
      id: 'activity',
      theme: { en: 'Craft & activity books', de: 'Bastel- & Aktivitätsbücher' },
      evidence: {
        en: 'Source examples: Das Einhorn-Bastelbuch; Kindergarten-Rätselspaß (source ~3,312 reviews)',
        de: 'Quellen-Beispiele: Das Einhorn-Bastelbuch; Kindergarten-Rätselspaß (Quellen ca. 3.312 Reviews)',
      },
    },
  ],
  verdicts: [
    {
      id: 'picture_courage',
      signal: 'very_strong',
      label: {
        en: '✅ Picture books with courage / emotional themes — strongest signal',
        de: '✅ Bilderbücher mit Mut- / Emotionsthemen — stärkstes Signal',
      },
      bullets: {
        en: [
          'Multiple Mut/courage picture books appear in owner’s top-of-list DE Family-for-Children snapshot',
          'Geh deinen Weg, Schildkröte — courage + togetherness; source notes ~#12 Familie für Kinder (Oct 2026) — verify live',
          'Often the DE edition of The Koala Who Could pattern (Bright/Field) — study structure only',
          'Das unsichtbare Band — emotional bonds; source cites large worldwide sales + mid-list chart presence — verify',
          'Verdict: courage + emotional themes in picture books = most validated category in this research set',
        ],
        de: [
          'Mehrere Mut-Bilderbücher im Owner-Snapshot der DE-Familie-für-Kinder-Listen',
          'Geh deinen Weg, Schildkröte — Mut + Zusammenhalt; Quelle ca. #12 Familie für Kinder (Okt 2026) — live prüfen',
          'Oft DE-Ausgabe des Koala-Who-Could-Musters (Bright/Field) — nur Struktur studieren',
          'Das unsichtbare Band — Bindung; Quelle nennt hohe Weltauflagen + Listenplatz — prüfen',
          'Urteil: Mut + Emotion in Bilderbüchern = am stärksten validierte Kategorie in diesem Research-Set',
        ],
      },
    },
    {
      id: 'emotions',
      signal: 'strong',
      label: {
        en: '✅ Emotional resilience / feelings — strong signal',
        de: '✅ Emotionale Resilienz / Gefühle — starkes Signal',
      },
      bullets: {
        en: [
          'Inner strength, self-confidence, bonds dominate gift-oriented subcategories in owner notes',
          'Weil du ein besonderes Mädchen bist cited as repeat bestseller pattern — verify live',
          'Worry / fear / change titles (Worrysaurus, Koala patterns) translate well into German editions',
          'Verdict: emotions focused on courage, worry, change, belonging are commercially validated in DE',
        ],
        de: [
          'Innere Stärke, Selbstvertrauen, Bindung dominieren geschenknahe Unterkategorien in Owner-Notizen',
          'Weil du ein besonderes Mädchen bist als wiederkehrendes Bestseller-Muster genannt — live prüfen',
          'Sorgen-/Angst-/Veränderungs-Titel (Worrysaurus-, Koala-Muster) funktionieren gut als DE-Ausgaben',
          'Urteil: Emotionen zu Mut, Sorgen, Veränderung, Zugehörigkeit sind in DE kommerziell validiert',
        ],
      },
    },
    {
      id: 'early_reading',
      signal: 'strong',
      label: {
        en: '✅ Early reading / letters — strong signal (with caution)',
        de: '✅ Erstlesen / Buchstaben — starkes Signal (mit Vorsicht)',
      },
      bullets: {
        en: [
          'Lies mal / Schule der magischen Tiere-type series dominate Erstleser in owner notes',
          'Parents buy structured reading-level books for school readiness; schools/libraries buy systematically',
          'Verdict: viable, but needs pedagogically credible structure; higher institutional competition',
        ],
        de: [
          'Lies-mal- / Schule-der-magischen-Tiere-Serien dominieren Erstleser in Owner-Notizen',
          'Eltern kaufen strukturierte Lesestufen; Schulen/Bibliotheken kaufen systematisch',
          'Urteil: machbar, aber pädagogisch glaubwürdige Struktur nötig; höhere institutionelle Konkurrenz',
        ],
      },
    },
    {
      id: 'kindness',
      signal: 'moderate',
      label: {
        en: '⚠️ Kindness (standalone) — moderate / weak as a solo theme',
        de: '⚠️ Freundlichkeit (allein) — moderat / schwach als Solo-Thema',
      },
      bullets: {
        en: [
          'Standalone “be kind” titles rarely appear explicitly in owner’s top-50 DE snapshot',
          'Kindness shows up inside courage, friendship, togetherness stories with conflict + resolution',
          'Verdict: embed kindness in a story with stakes — not as abstract virtue messaging alone',
        ],
        de: [
          'Allein stehende „sei nett“-Titel erscheinen selten explizit im Owner-Top-50-Snapshot',
          'Freundlichkeit steckt in Mut-/Freundschafts-/Zusammenhalts-Geschichten mit Konflikt + Lösung',
          'Urteil: Freundlichkeit in Story mit Einsatz einbetten — nicht als abstrakte Tugend allein',
        ],
      },
    },
    {
      id: 'handwriting',
      signal: 'weak',
      label: {
        en: '❌ Handwriting / writing workbooks — weak for indie KDP',
        de: '❌ Schreib-/Handschrift-Hefte — schwach für Indie-KDP',
      },
      bullets: {
        en: [
          'Dominated by established educational publishers (Klett, Cornelsen, Westermann) with school relationships',
          'Verdict: avoid as a primary indie KDP category',
        ],
        de: [
          'Dominiert von Schulbuchverlagen (Klett, Cornelsen, Westermann) mit Schulbeziehungen',
          'Urteil: als primäre Indie-KDP-Kategorie meiden',
        ],
      },
    },
    {
      id: 'activity',
      signal: 'moderate',
      label: {
        en: 'Activity / craft / puzzle — moderate signal',
        de: 'Aktivität / Basteln / Rätsel — moderates Signal',
      },
      bullets: {
        en: [
          'Present on lists with lower–medium competition in owner notes',
          'Optional secondary line — not the primary courage+animal picture-book start',
        ],
        de: [
          'Auf Listen vorhanden; Konkurrenz eher niedrig–mittel in Owner-Notizen',
          'Optionale Zweitlinie — nicht der primäre Mut+Tier-Bilderbuch-Start',
        ],
      },
    },
  ],
  clearFormula: {
    title: {
      en: 'The clearest data-backed start formula',
      de: 'Die klarste datenbasierte Start-Formel',
    },
    bullets: {
      en: [
        'German-language picture books for ages ~2–6',
        '1) Animal character (animals dominate DE kids bestsellers in owner research)',
        '2) Courage or emotional change (Mut, Veränderung, Angst überwinden)',
        '3) Rhyming / rhythmic text (Bright-style format common in translated bestsellers)',
        '4) Board book or durable hardcover for this age band (verify KDP print options)',
        'Live pattern cited: Geh deinen Weg, Schildkröte — study structure; write an original German story',
      ],
      de: [
        'Deutschsprachige Bilderbücher für Alter ca. 2–6',
        '1) Tierfigur (Tiere dominieren DE-Kinderbestseller in Owner-Recherche)',
        '2) Mut oder emotionale Veränderung (Mut, Veränderung, Angst überwinden)',
        '3) Reimender/rhythmischer Text (Bright-Format häufig bei Übersetzungen)',
        '4) Pappebuch oder robustes Hardcover für diese Altersgruppe (KDP-Print-Optionen prüfen)',
        'Genanntes Live-Muster: Geh deinen Weg, Schildkröte — Struktur studieren; eigene deutsche Geschichte schreiben',
      ],
    },
  },
  summaryTable: [
    {
      category: {
        en: 'Picture books: courage + animals',
        de: 'Bilderbücher: Mut + Tiere',
      },
      signal: { en: 'Very strong', de: 'Sehr stark' },
      competition: { en: 'Medium', de: 'Mittel' },
      recommend: { en: 'Yes — start here', de: 'Ja — hier starten' },
    },
    {
      category: {
        en: 'Picture books: emotional bonds / love',
        de: 'Bilderbücher: Bindung / Liebe',
      },
      signal: { en: 'Strong', de: 'Stark' },
      competition: { en: 'Medium', de: 'Mittel' },
      recommend: { en: 'Yes — second priority', de: 'Ja — zweite Priorität' },
    },
    {
      category: {
        en: 'Emotions / feelings ages 3–6',
        de: 'Emotionen / Gefühle Alter 3–6',
      },
      signal: { en: 'Strong', de: 'Stark' },
      competition: { en: 'Medium–low', de: 'Mittel–niedrig' },
      recommend: { en: 'Yes', de: 'Ja' },
    },
    {
      category: {
        en: 'Early reading / letter books',
        de: 'Erstlesen / Buchstaben',
      },
      signal: { en: 'Strong', de: 'Stark' },
      competition: { en: 'Medium–high (school publishers)', de: 'Mittel–hoch (Schulverlage)' },
      recommend: { en: 'Yes, with caution', de: 'Ja, mit Vorsicht' },
    },
    {
      category: {
        en: 'Kindness (standalone theme)',
        de: 'Freundlichkeit (allein)',
      },
      signal: { en: 'Weak', de: 'Schwach' },
      competition: { en: 'Low', de: 'Niedrig' },
      recommend: { en: 'Only if embedded in story', de: 'Nur in Story eingebettet' },
    },
    {
      category: {
        en: 'Handwriting / writing workbooks',
        de: 'Schreib-/Handschrift-Hefte',
      },
      signal: { en: 'Weak for indie KDP', de: 'Schwach für Indie-KDP' },
      competition: { en: 'Very high', de: 'Sehr hoch' },
      recommend: { en: 'No', de: 'Nein' },
    },
    {
      category: {
        en: 'Activity / craft / puzzle',
        de: 'Aktivität / Basteln / Rätsel',
      },
      signal: { en: 'Moderate', de: 'Moderat' },
      competition: { en: 'Low–medium', de: 'Niedrig–mittel' },
      recommend: { en: 'Optional later', de: 'Optional später' },
    },
  ],
  weeklyHabit: {
    en: 'Weekly: open Amazon.de → Bücher → Kinderbücher / Familie für Kinder bestsellers and refresh your notes. That live list beats stale course advice.',
    de: 'Wöchentlich: Amazon.de → Bücher → Kinderbücher / Familie für Kinder-Bestseller öffnen und Notizen aktualisieren. Die Live-Liste schlägt veraltete Kurs-Tipps.',
  },
  bestsellersUrl: 'https://www.amazon.de/gp/bestsellers/books/',
}
