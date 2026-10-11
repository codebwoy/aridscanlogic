/**
 * Hardest Amazon KDP ideas — plain-language teaching (EN+DE).
 * Based on official KDP Help themes; written so beginners can learn here first.
 * Official links are optional “check the number” tools — not required reading.
 * Not affiliated with Amazon. Verified: 2026-10-11.
 */

export const KDP_HARD_TOPICS_CONFIG = {
  lastVerified: '2026-10-11',
  sourceLabel:
    'Plain-language lessons based on Amazon KDP Help. Learn here first. Open official links only when you need the live calculator or exact legal wording.',
  hub: {
    title: {
      en: 'KDP hard topics — explained simply',
      de: 'KDP-Schwierigsthemen — einfach erklärt',
    },
    url: 'https://kdp.amazon.com/',
    helpHome: 'https://kdp.amazon.com/help',
    jumpstart: 'https://kdp.amazon.com/en_US/help/topic/G202187740',
    intro: {
      en: 'You do not need to read Amazon’s long Help pages first. These lessons use everyday words. Each topic says: what it means, why people get stuck, what to do, and common mistakes. Links at the bottom are only if you want to double-check a number.',
      de: 'Sie müssen Amazons lange Help-Seiten nicht zuerst lesen. Diese Lektionen nutzen Alltagssprache. Jedes Thema sagt: was es bedeutet, warum Leute stecken bleiben, was Sie tun sollen und typische Fehler. Links unten nur zum Nachprüfen von Zahlen.',
    },
  },
  whyThisExists: {
    en: 'Many courses use jargon or outdated “you always get 60%.” Here we explain the real ideas in simple language — then you can use Amazon’s calculator for your own book.',
    de: 'Viele Kurse nutzen Fachchinesisch oder veraltetes „Sie bekommen immer 60 %.“ Hier erklären wir die echten Ideen einfach — danach nutzen Sie Amazons Rechner für Ihr Buch.',
  },
  studyOrder: {
    en: [
      '1) How much money you keep on a printed book',
      '2) Telling Amazon you used AI art or AI text',
      '3) Where shoppers find your kids book (categories + age)',
      '4) How much you keep on a Kindle ebook',
      '5) Joining Kindle Unlimited (and what you give up)',
      '6) Title, keywords, and honest book info',
      '7) File size and cover order (so Amazon accepts the book)',
    ],
    de: [
      '1) Wie viel Geld Sie bei einem Druckbuch behalten',
      '2) Amazon sagen, dass Sie KI-Bilder oder KI-Text genutzt haben',
      '3) Wo Käufer Ihr Kinderbuch finden (Kategorien + Alter)',
      '4) Wie viel Sie bei einem Kindle-E-Book behalten',
      '5) Kindle Unlimited beitreten (und was Sie aufgeben)',
      '6) Titel, Suchwörter und ehrliche Buchinfos',
      '7) Dateigröße und Cover-Reihenfolge (damit Amazon das Buch annimmt)',
    ],
  },
  topics: [
    {
      id: 'print_royalty_math',
      difficulty: 5,
      title: {
        en: 'Printed books: how much you actually earn',
        de: 'Druckbücher: wie viel Sie wirklich verdienen',
      },
      inOneSentence: {
        en: 'Amazon does not give you “60% of the cover price.” They take a share, then subtract the cost to print that copy — what’s left is yours.',
        de: 'Amazon gibt Ihnen nicht „60 % vom Coverpreis“. Sie nehmen einen Anteil und ziehen dann die Druckkosten ab — der Rest ist Ihres.',
      },
      whyHard: {
        en: 'Color kids books cost more to print. If your price is too low, you can earn almost nothing — or Amazon won’t even let you set that price.',
        de: 'Farbige Kinderbücher sind teurer zu drucken. Ist der Preis zu niedrig, verdienen Sie fast nichts — oder Amazon lässt den Preis gar nicht zu.',
      },
      learn: {
        en: [
          'Think of it like this: customer pays your price → Amazon takes a cut → printing is paid from that → you get the leftover.',
          'On Amazon stores, that cut is usually 50% or 60% of your price — which one depends on how high you set the price in that country.',
          'Simple rule of thumb for many EU/US stores: price at about €9.99 / $9.99 or above often unlocks the better 60% cut (check the live page if unsure).',
          'Then Amazon subtracts printing. More pages and color ink = higher print cost.',
          'Amazon also sets a lowest allowed price so print cost can be covered. If you type a price too low, the form blocks you.',
          'If you turn on “Expanded Distribution” (selling beyond Amazon), you usually keep even less per book.',
          'For kids picture books: always run Amazon’s free calculator with your page count and color setting before you fix the price.',
        ],
        de: [
          'So denken: Kunde zahlt Ihren Preis → Amazon nimmt einen Anteil → Druck wird davon bezahlt → Sie bekommen den Rest.',
          'In Amazon-Shops ist dieser Anteil meist 50 % oder 60 % Ihres Preises — welcher, hängt davon ab, wie hoch Sie den Preis in dem Land setzen.',
          'Faustregel für viele EU/US-Shops: ab ca. 9,99 € / 9,99 $ oft der bessere 60-%-Anteil (bei Unsicherheit live prüfen).',
          'Danach zieht Amazon die Druckkosten ab. Mehr Seiten und Farbe = höhere Druckkosten.',
          'Amazon setzt auch einen Mindestpreis, damit der Druck gedeckt ist. Zu niedrig → Formular blockiert.',
          'Mit „Expanded Distribution“ (Verkauf außerhalb Amazon) behalten Sie pro Buch meist noch weniger.',
          'Für Kinderbilderbücher: Amazons kostenlosen Rechner mit Seitenzahl und Farbe nutzen, bevor Sie den Preis festlegen.',
        ],
      },
      doThis: {
        en: [
          'Open Amazon’s print & royalty calculator (link below).',
          'Enter your page count, color or black-and-white, and marketplace (e.g. Amazon.de).',
          'Try a few prices until the “you earn” number looks fair.',
        ],
        de: [
          'Amazons Druck- & Royalty-Rechner öffnen (Link unten).',
          'Seitenzahl, Farbe oder Schwarzweiß und Marktplatz (z. B. Amazon.de) eingeben.',
          'Ein paar Preise testen, bis „Sie verdienen“ fair aussieht.',
        ],
      },
      formulas: {
        en: [
          'Your money ≈ (Amazon’s % of your price) − cost to print one copy',
          'Lowest price Amazon allows ≈ print cost ÷ that %',
        ],
        de: [
          'Ihr Geld ≈ (Amazons % von Ihrem Preis) − Druckkosten für ein Exemplar',
          'Niedrigster erlaubter Preis ≈ Druckkosten ÷ dieser %',
        ],
      },
      pitfalls: {
        en: [
          'Believing an old blog that says “you always get 60% of the cover.”',
          'Pricing a color picture book like a cheap black-and-white novel.',
          'Forgetting that more stores outside Amazon often means less money per sale.',
        ],
        de: [
          'Alten Blog glauben: „Sie bekommen immer 60 % vom Cover.“',
          'Farbiges Bilderbuch wie ein billiges Schwarzweiß-Buch preisen.',
          'Vergessen: mehr Verkauf außerhalb Amazon oft weniger Geld pro Verkauf.',
        ],
      },
      links: [
        {
          label: 'Paperback royalty (official)',
          url: 'https://kdp.amazon.com/en_US/help/topic/G201834330',
        },
        {
          label: 'Print cost explained (official)',
          url: 'https://kdp.amazon.com/en_US/help/topic/G201834340',
        },
        {
          label: 'Free calculator — use this',
          url: 'https://kdp.amazon.com/en_US/help/topic/GSQF43YAMUPFTMSP',
        },
      ],
      note: {
        en: '⚠ Exact % cut-offs can change. Trust the calculator for your title, not a screenshot from a course.',
        de: '⚠ Exakte %-Grenzen können sich ändern. Für Ihren Titel dem Rechner vertrauen, nicht einem Kurs-Screenshot.',
      },
    },
    {
      id: 'ebook_royalty_vat',
      difficulty: 5,
      title: {
        en: 'Kindle ebooks: the “70%” is not the full story',
        de: 'Kindle-E-Books: „70 %“ ist nicht die ganze Wahrheit',
      },
      inOneSentence: {
        en: 'On the 70% plan, Amazon first removes tax, then removes a small “delivery” fee for file size, then you get 70% of what’s left — and some countries only pay 35%.',
        de: 'Beim 70-%-Plan zieht Amazon zuerst Steuer ab, dann eine kleine „Zustell“-Gebühr für die Dateigröße, dann bekommen Sie 70 % vom Rest — und in manchen Ländern nur 35 %.',
      },
      whyHard: {
        en: 'People hear “70% royalties” and ignore tax and file size. Big illustrated kids files can shrink what you keep.',
        de: 'Viele hören „70 % Royalties“ und ignorieren Steuer und Dateigröße. Große Illu-Dateien für Kinder können Ihren Anteil schrumpfen.',
      },
      learn: {
        en: [
          'You choose 35% or 70% for each ebook.',
          '35% is simpler: you get about 35% after tax is removed. No extra delivery fee.',
          '70% sounds better, but Amazon also subtracts a delivery fee based on how big your file is (megabytes). Picture-heavy kids books are bigger.',
          'Tax (VAT) is also removed before the % is calculated in many countries — especially important in the EU.',
          'Not every country pays 70%. Outside the “70% countries,” you may get 35% instead.',
          'Books that are mostly public-domain text often cannot use 70%.',
          'Some countries (like Brazil, Japan, Mexico, India) may need KDP Select plus the right price band for 70% — check when you get there.',
        ],
        de: [
          'Pro E-Book wählen Sie 35 % oder 70 %.',
          '35 % ist einfacher: etwa 35 % nach Abzug der Steuer. Keine extra Zustellgebühr.',
          '70 % klingt besser, aber Amazon zieht auch eine Zustellgebühr nach Dateigröße (Megabyte) ab. Viele Kinderbuch-Bilder = größere Datei.',
          'In vielen Ländern (besonders EU) wird MwSt. vor dem %-Anteil abgezogen.',
          'Nicht jedes Land zahlt 70 %. Außerhalb der „70-%-Länder“ oft nur 35 %.',
          'Bücher mit vor allem gemeinfreiem Text dürfen oft kein 70 % nutzen.',
          'Manche Länder (z. B. Brasilien, Japan, Mexiko, Indien) brauchen ggf. KDP Select plus richtiges Preisband für 70 % — prüfen, wenn Sie dort verkaufen.',
        ],
      },
      doThis: {
        en: [
          'Decide 35% vs 70% after you know your file size.',
          'Keep illustrated ebooks as light as you reasonably can.',
          'Compare earnings at a few prices (e.g. €2.99 vs €4.99) in KDP’s pricing screen.',
        ],
        de: [
          '35 % vs. 70 % erst wählen, wenn Sie die Dateigröße kennen.',
          'Illustrierte E-Books so schlank wie sinnvoll halten.',
          'In KDPs Preis-Screen ein paar Preise vergleichen (z. B. 2,99 € vs. 4,99 €).',
        ],
      },
      formulas: {
        en: [
          '35% plan: about 35% of (price after tax)',
          '70% plan: about 70% of (price after tax − delivery fee)',
        ],
        de: [
          '35-%-Plan: etwa 35 % von (Preis nach Steuer)',
          '70-%-Plan: etwa 70 % von (Preis nach Steuer − Zustellgebühr)',
        ],
      },
      pitfalls: {
        en: [
          'Assuming every sale in the world pays 70%.',
          'Ignoring tax on Amazon.de / EU buyers.',
          'Huge image files quietly eating your 70% earnings.',
        ],
        de: [
          'Annehmen, jeder Verkauf weltweit zahle 70 %.',
          'Steuer bei Amazon.de / EU-Käufern ignorieren.',
          'Riesige Bilddateien fressen still den 70-%-Verdienst.',
        ],
      },
      links: [
        {
          label: 'Ebook royalties (official)',
          url: 'https://kdp.amazon.com/en_US/help/topic/G200644210',
        },
        {
          label: 'Ebook pricing details (official)',
          url: 'https://kdp.amazon.com/en_US/help/topic/G200634500',
        },
      ],
      note: {
        en: '⚠ Re-check Amazon’s pricing page when you change price or file size.',
        de: '⚠ Amazons Pricing-Seite neu prüfen, wenn Sie Preis oder Dateigröße ändern.',
      },
    },
    {
      id: 'ai_disclosure',
      difficulty: 4,
      title: {
        en: 'AI art or AI writing: what you must tell Amazon',
        de: 'KI-Bilder oder KI-Text: was Sie Amazon sagen müssen',
      },
      inOneSentence: {
        en: 'If AI made the pictures, text, or translation, you must tell Amazon when you publish — even if you edited the result a lot.',
        de: 'Wenn KI die Bilder, den Text oder die Übersetzung gemacht hat, müssen Sie Amazon beim Veröffentlichen Bescheid sagen — auch wenn Sie stark nachbearbeitet haben.',
      },
      whyHard: {
        en: 'People think “I changed the prompt” or “I cleaned it up” means they don’t have to say anything. Amazon’s rule is stricter than that.',
        de: 'Viele denken: „Prompt geändert“ oder „nachbearbeitet“ heißt, sie müssen nichts sagen. Amazons Regel ist strenger.',
      },
      learn: {
        en: [
          'AI-generated = an AI tool created the actual text, pictures (cover or inside), or translation. You must tell Amazon when you publish or update the book.',
          'AI-assisted = you made the content yourself, and AI only helped edit, fix typos, polish, or brainstorm. You usually do not need to report that help.',
          'Heavy editing of AI pictures still counts as AI-generated under Amazon’s wording.',
          'You are still responsible that the book doesn’t break other rules (no stolen art, no banned content).',
          'Telling Amazon is not the same as “customers see a big AI badge.” Follow the questions in KDP title setup.',
          'This app’s disclosure helper is a guide only — the KDP form is what counts.',
        ],
        de: [
          'KI-generiert = ein KI-Tool hat Text, Bilder (Cover oder Innenteil) oder Übersetzung erzeugt. Beim Veröffentlichen oder Aktualisieren müssen Sie Amazon informieren.',
          'KI-unterstützt = Sie haben den Inhalt selbst gemacht; KI half nur beim Editieren, Tippfehlern, Polieren oder Brainstorming. Das müssen Sie meist nicht melden.',
          'Starke Nachbearbeitung von KI-Bildern zählt laut Amazon trotzdem oft als KI-generiert.',
          'Sie bleiben verantwortlich: keine gestohlene Kunst, kein verbotener Inhalt.',
          'Amazon informieren heißt nicht automatisch „Kunden sehen ein großes KI-Schild.“ Folgen Sie den Fragen im KDP-Titel-Setup.',
          'Der Disclosure-Helfer in dieser App ist nur Orientierung — das KDP-Formular gilt.',
        ],
      },
      doThis: {
        en: [
          'List what AI made: cover? interior art? story text? translation?',
          'When KDP asks about AI-generated content, answer honestly.',
          'Keep notes of your process (handy if you ever need to explain).',
        ],
        de: [
          'Auflisten, was KI gemacht hat: Cover? Innenteil? Story-Text? Übersetzung?',
          'Wenn KDP nach KI-Inhalten fragt, ehrlich antworten.',
          'Kurze Notizen zum Prozess behalten (falls Sie es später erklären müssen).',
        ],
      },
      formulas: { en: [], de: [] },
      pitfalls: {
        en: [
          'Not telling Amazon because “I edited the AI images.”',
          'Thinking a tool’s commercial license replaces KDP’s AI question.',
          'Disclosing text but forgetting AI cover/interior art.',
        ],
        de: [
          'Nichts sagen, weil „ich habe die KI-Bilder bearbeitet.“',
          'Kommerzielle Tool-Lizenz mit der KDP-KI-Frage verwechseln.',
          'Text angeben, aber KI-Cover/Innenteil vergessen.',
        ],
      },
      links: [
        {
          label: 'Content rules incl. AI (official)',
          url: 'https://kdp.amazon.com/en_US/help/topic/G200672390',
        },
      ],
      note: {
        en: '⚠ Not legal advice. “Can I copyright this?” is a different question from “Did I tell KDP?”',
        de: '⚠ Keine Rechtsberatung. „Kann ich das schützen?“ ist eine andere Frage als „Habe ich KDP informiert?“',
      },
    },
    {
      id: 'categories_reading_age',
      difficulty: 4,
      title: {
        en: 'Categories & age: helping parents find the book',
        de: 'Kategorien & Alter: damit Eltern das Buch finden',
      },
      inOneSentence: {
        en: 'You pick up to three honest “shelves” for your book, plus the right kids age — wrong shelves can be removed.',
        de: 'Sie wählen bis zu drei ehrliche „Regale“ für Ihr Buch plus das passende Kinderalter — falsche Regale können entfernt werden.',
      },
      whyHard: {
        en: 'Authors pick popular shelves that don’t match the book, hoping for more sales. Amazon can move or remove those.',
        de: 'Autor:innen wählen beliebte Regale, die nicht zum Buch passen, hoffend auf mehr Sales. Amazon kann das ändern oder entfernen.',
      },
      learn: {
        en: [
          'Categories are like bookstore shelves (bedtime, animals, first day of school…).',
          'You can choose up to three. Pick ones that truly match the story.',
          'Also set reading age. For young kids, common ranges look like 0–2, 3–5, 6–8, 9–12.',
          'Teen / young adult ages are different — and Germany’s teen range can differ from the US. Use what KDP shows for your store.',
          'If the book has sexual content in images or title, answer that question honestly — children’s shelves won’t apply.',
          'After you change categories, wait up to a few days (often up to ~72 hours) before judging the result.',
          'Shelves can differ by country and by ebook vs paperback.',
        ],
        de: [
          'Kategorien sind wie Buchladen-Regale (Gute Nacht, Tiere, erster Schultag…).',
          'Sie dürfen bis zu drei wählen. Nur solche, die wirklich zur Story passen.',
          'Auch Lesealter setzen. Für kleine Kinder oft: 0–2, 3–5, 6–8, 9–12.',
          'Teen-/Jugend-Alter ist anders — und DE kann von US abweichen. Nutzen Sie, was KDP für Ihren Shop zeigt.',
          'Bei sexuellem Inhalt in Bildern/Titel ehrlich antworten — Kinderregale gelten dann nicht.',
          'Nach Kategorie-Änderung oft bis zu ein paar Tagen warten (häufig bis ca. 72 Std.), bevor Sie urteilen.',
          'Regale können je Land und je E-Book vs. Taschenbuch anders sein.',
        ],
      },
      doThis: {
        en: [
          'Browse Amazon.de (or your store) for similar kids books and note their shelves.',
          'Pick three honest categories + a clear age range.',
          'Use keywords for extra detail — not fake shelves.',
        ],
        de: [
          'Auf Amazon.de (oder Ihrem Shop) ähnliche Kinderbücher ansehen und deren Regale notieren.',
          'Drei ehrliche Kategorien + klares Alter wählen.',
          'Für Extra-Details Keywords nutzen — keine Fake-Regale.',
        ],
      },
      formulas: { en: [], de: [] },
      pitfalls: {
        en: [
          'Stuffing unrelated bestseller categories.',
          'Skipping age — then the book is hard to find in kids browse.',
          'Expecting category changes to show instantly.',
        ],
        de: [
          'Unpassende Bestseller-Kategorien vollstopfen.',
          'Alter weglassen — dann schwer im Kinder-Browse zu finden.',
          'Sofortige Kategorie-Updates erwarten.',
        ],
      },
      links: [
        {
          label: 'Categories (official)',
          url: 'https://kdp.amazon.com/en_US/help/topic/G200652170',
        },
        {
          label: 'Book info rules (official)',
          url: 'https://kdp.amazon.com/en_US/help/topic/G201097560',
        },
        {
          label: 'Keywords (official)',
          url: 'https://kdp.amazon.com/en_US/help/topic/G200652310',
        },
      ],
      note: {
        en: 'Amazon support will not give you a “best ranking shelf” tip. Honest fit first.',
        de: 'Amazon-Support gibt keinen „besten Ranking-Regal“-Tipp. Zuerst ehrliche Passung.',
      },
    },
    {
      id: 'metadata_keywords',
      difficulty: 3,
      title: {
        en: 'Title, keywords & book info (keep it honest)',
        de: 'Titel, Suchwörter & Buchinfos (ehrlich halten)',
      },
      inOneSentence: {
        en: 'Your title, subtitle, description, and search words must describe the real book — tricks and stuffing can hurt you.',
        de: 'Titel, Untertitel, Beschreibung und Suchwörter müssen das echte Buch beschreiben — Tricks und Stuffing können schaden.',
      },
      whyHard: {
        en: 'It’s tempting to paste every hot keyword. Amazon wants words parents would really search for this story.',
        de: 'Es ist verlockend, jedes heiße Keyword einzusetzen. Amazon will Wörter, die Eltern wirklich für diese Story suchen.',
      },
      learn: {
        en: [
          'Write like a searching parent: “bedtime courage,” “first day of school,” not random single words.',
          'Short 2–3 word phrases often work better than long spam lists.',
          'Don’t put other authors’ names, fake awards, or topics that aren’t in the book.',
          'Keep the same author name and series name on ebook and paperback so Amazon can link them.',
          'ISBN: ebooks usually don’t need one. Paperbacks/hardcovers usually do (some low-content books are different — check if that applies).',
          'You can use a free KDP ISBN or your own — free is easier; your own can help branding.',
        ],
        de: [
          'Schreiben wie suchende Eltern: „Mut zur Nacht,“ „erster Schultag,“ keine Zufalls-Wörter.',
          'Kurze 2–3-Wort-Phrasen oft besser als lange Spam-Listen.',
          'Keine anderen Autorennamen, Fake-Awards oder Themen, die nicht im Buch sind.',
          'Gleicher Autor- und Serienname bei E-Book und Taschenbuch, damit Amazon verknüpfen kann.',
          'ISBN: E-Books brauchen meist keine. Taschenbuch/Hardcover meist schon (manche Low-Content-Bücher anders — prüfen).',
          'Free-KDP-ISBN oder eigene — Free ist einfacher; eigene hilft beim Branding.',
        ],
      },
      doThis: {
        en: [
          'Draft title + subtitle a parent would understand in 3 seconds.',
          'Fill seven keyword boxes with real search phrases.',
          'Read your description out loud — cut hype and repeats.',
        ],
        de: [
          'Titel + Untertitel entwerfen, die Eltern in 3 Sekunden verstehen.',
          'Sieben Keyword-Felder mit echten Suchphrasen füllen.',
          'Beschreibung laut lesen — Hype und Wiederholungen streichen.',
        ],
      },
      formulas: { en: [], de: [] },
      pitfalls: {
        en: [
          'Competitor names in keywords.',
          'Claiming #1 bestseller or awards you don’t have.',
          'ISBN in the file that doesn’t match the ISBN in KDP.',
        ],
        de: [
          'Konkurrenz-Namen in Keywords.',
          '#1-Bestseller oder Awards behaupten, die Sie nicht haben.',
          'ISBN in der Datei passt nicht zur ISBN in KDP.',
        ],
      },
      links: [
        {
          label: 'Book info rules (official)',
          url: 'https://kdp.amazon.com/en_US/help/topic/G201097560',
        },
        {
          label: 'ISBN help (official)',
          url: 'https://kdp.amazon.com/en_US/help/topic/G201354010',
        },
      ],
      note: {
        en: 'After the book is live, use the Hub listing playbook for deeper keyword/A+ work.',
        de: 'Nach dem Live-Gang: Hub-Listing-Playbook für Keywords/A+.',
      },
    },
    {
      id: 'kdp_select_ku',
      difficulty: 4,
      title: {
        en: 'Kindle Unlimited: more readers, but exclusivity',
        de: 'Kindle Unlimited: mehr Leser, aber Exklusivität',
      },
      inOneSentence: {
        en: 'KDP Select puts your ebook in Kindle Unlimited for 90 days — you may reach more subscribers, but that ebook can’t be sold as an ebook elsewhere during that time.',
        de: 'KDP Select legt Ihr E-Book für 90 Tage in Kindle Unlimited — Sie erreichen ggf. mehr Abonnent:innen, aber das E-Book dürfen Sie in der Zeit nicht woanders als E-Book verkaufen.',
      },
      whyHard: {
        en: 'People join for “extra money” without noticing they can’t also sell the same ebook on Apple Books, Kobo, etc.',
        de: 'Viele treten für „extra Geld“ bei, ohne zu merken: dasselbe E-Book dann nicht parallel bei Apple Books, Kobo usw.',
      },
      learn: {
        en: [
          'Select is optional and free. It lasts 90 days at a time for the Kindle ebook only.',
          'Your paperback can still sell on Amazon even if the ebook is in Select.',
          'In Select, subscribers can read your book in Kindle Unlimited. You get paid from a shared monthly pot based on pages read — not the same as a normal 70% sale.',
          'Select also unlocks some promo tools (free days / countdown deals), with country limits.',
          'If the ebook is mostly public domain, it usually can’t join Select.',
          'You can leave after a term — plan ahead if you want “wide” ebook stores later.',
        ],
        de: [
          'Select ist optional und kostenlos. Jeweils 90 Tage — nur für das Kindle-E-Book.',
          'Ihr Taschenbuch kann trotzdem auf Amazon verkaufen, auch wenn das E-Book in Select ist.',
          'In Select können Abonnent:innen in Kindle Unlimited lesen. Sie bekommen Geld aus einem gemeinsamen Monatstopf nach gelesenen Seiten — nicht wie ein normaler 70-%-Verkauf.',
          'Select schaltet auch Promo-Tools frei (Gratis-Tage / Countdown), mit Länder-Limits.',
          'Vor allem gemeinfreie E-Books können meist nicht in Select.',
          'Nach einer Laufzeit können Sie raus — planen, wenn Sie später „wide“ in anderen E-Book-Shops wollen.',
        ],
      },
      doThis: {
        en: [
          'Decide: Amazon-only ebook for 90 days — yes or no?',
          'If yes, remove the ebook from other stores before enrolling.',
          'Don’t forecast KU income like a fixed per-sale royalty.',
        ],
        de: [
          'Entscheiden: E-Book 90 Tage nur bei Amazon — ja oder nein?',
          'Wenn ja: E-Book vor Enrollment aus anderen Shops nehmen.',
          'KU-Einkommen nicht wie feste Stück-Royalty planen.',
        ],
      },
      formulas: { en: [], de: [] },
      pitfalls: {
        en: [
          'Enrolling while the ebook is still on other stores.',
          'Expecting every page-read to pay like a full ebook sale.',
          'Mixing up free promo days and countdown deals in one term.',
        ],
        de: [
          'Enrollment, während das E-Book noch in anderen Shops liegt.',
          'Jede gelesene Seite wie einen vollen E-Book-Verkauf erwarten.',
          'Gratis-Tage und Countdown im selben Zeitraum durcheinanderbringen.',
        ],
      },
      links: [
        {
          label: 'KDP Select overview (official)',
          url: 'https://kdp.amazon.com/en_US/help/topic/G200798990',
        },
        {
          label: 'How to enroll (official)',
          url: 'https://kdp.amazon.com/en_US/help/topic/GD9PMU58BV24QFZ7',
        },
      ],
      note: {
        en: '⚠ The shared KU money pot changes over time — don’t trust old “per page” screenshots forever.',
        de: '⚠ Der gemeinsame KU-Geldtopf ändert sich — alten „pro Seite“-Screenshots nicht ewig glauben.',
      },
    },
    {
      id: 'print_files_trim',
      difficulty: 4,
      title: {
        en: 'Files Amazon will accept (size, edges, cover order)',
        de: 'Dateien, die Amazon annimmt (Format, Ränder, Cover-Reihenfolge)',
      },
      inOneSentence: {
        en: 'Finish the inside pages first, lock the page count, then make the cover — because the spine width depends on how many pages you have.',
        de: 'Zuerst Innenseiten fertig machen, Seitenzahl fixieren, dann das Cover — die Rückenbreite hängt von der Seitenzahl ab.',
      },
      whyHard: {
        en: 'Illustrated books often get rejected for wrong edges (bleed) or a cover built for the wrong spine.',
        de: 'Illustrierte Bücher werden oft abgelehnt wegen falscher Ränder (Bleed) oder eines Covers mit falschem Rücken.',
      },
      learn: {
        en: [
          'Pick your book size (trim) early — e.g. square or letter-like sizes common for kids books.',
          'Decide if art goes to the edge of the page (bleed) or sits inside a white margin.',
          'Export a clean PDF for print after the story pages are final.',
          'Only then build the full cover (front + spine + back). More pages = thicker spine.',
          'Use KDP’s previewer and look at every page before you click publish.',
          'Low-content books (activity / coloring style) can have special ISBN rules — check if that is your product type.',
        ],
        de: [
          'Buchgröße (Trim) früh wählen — z. B. quadratisch oder briefähnlich, typisch für Kinderbücher.',
          'Entscheiden: geht Kunst bis zum Rand (Bleed) oder sitzt sie in einem weißen Rand?',
          'Sauberes Druck-PDF erst exportieren, wenn die Story-Seiten final sind.',
          'Erst dann das ganze Cover (Vorderseite + Rücken + Rückseite). Mehr Seiten = dickerer Rücken.',
          'KDPs Previewer nutzen und jede Seite ansehen, bevor Sie veröffentlichen.',
          'Low-Content (Activity/Malbuch-Stil) kann besondere ISBN-Regeln haben — prüfen, ob das Ihr Produkttyp ist.',
        ],
      },
      doThis: {
        en: [
          'Choose trim + page count.',
          'Build interior PDF → preview.',
          'Build cover last → preview again → then price.',
        ],
        de: [
          'Trim + Seitenzahl wählen.',
          'Innenteil-PDF bauen → Vorschau.',
          'Cover zuletzt → nochmal Vorschau → dann Preis.',
        ],
      },
      formulas: { en: [], de: [] },
      pitfalls: {
        en: [
          'Designing the cover before the page count is final.',
          'Art that gets cut off at the edge because bleed was wrong.',
          'Skipping the previewer and fixing nothing until Amazon rejects the book.',
        ],
        de: [
          'Cover designen, bevor die Seitenzahl final ist.',
          'Kunst wird am Rand abgeschnitten, weil Bleed falsch war.',
          'Previewer überspringen und erst nach Amazon-Ablehnung korrigieren.',
        ],
      },
      links: [
        {
          label: 'Prepare manuscript (official)',
          url: 'https://kdp.amazon.com/en_US/help/topic/G202187840',
        },
        {
          label: 'Prepare cover (official)',
          url: 'https://kdp.amazon.com/en_US/help/topic/G202187850',
        },
        {
          label: 'Trim, bleed, margins (official)',
          url: 'https://kdp.amazon.com/en_US/help/topic/G201834230',
        },
        {
          label: 'Free templates (official)',
          url: 'https://kdp.amazon.com/en_US/help/topic/G201723120',
        },
      ],
      note: {
        en: 'StoryForge can help build pages — Amazon’s previewer is still the final check.',
        de: 'StoryForge hilft beim Seitenbau — Amazons Previewer bleibt die finale Prüfung.',
      },
    },
    {
      id: 'tax_payment',
      difficulty: 3,
      title: {
        en: 'Getting paid & tax interview (simple version)',
        de: 'Auszahlung & Steuerinterview (einfache Version)',
      },
      inOneSentence: {
        en: 'Finish Amazon’s tax questions with your real legal name and bank details, or they may keep a big tax cut from your earnings.',
        de: 'Amazons Steuerfragen mit Ihrem echten Rechtsnamen und Bankdaten fertig machen — sonst behalten sie oft einen großen Steueranteil von Ihren Einnahmen.',
      },
      whyHard: {
        en: 'People delay the tax form or put a pen name where the legal name belongs.',
        de: 'Viele schieben das Steuerformular auf oder tragen ein Pseudonym ein, wo der Rechtsname hingehört.',
      },
      learn: {
        en: [
          'Use your real legal name for account and tax. Your pen name goes on the book page, not on the tax form.',
          'Add a bank account that can receive Amazon payouts (in Germany often an IBAN).',
          'Complete the tax interview before you expect correct net pay.',
          'Amazon pays on a schedule after you pass a minimum amount — exact timing is in their “When will I get paid?” page.',
          'In Germany, royalty income may need to go on your tax return — talk to a tax advisor when money becomes real.',
        ],
        de: [
          'Für Konto und Steuer den echten Rechtsnamen nutzen. Pseudonym gehört auf die Buchseite, nicht ins Steuerformular.',
          'Bankkonto hinterlegen, das Auszahlungen empfangen kann (in DE oft IBAN).',
          'Steuerinterview fertig machen, bevor Sie korrektes Netto erwarten.',
          'Amazon zahlt nach Plan, wenn Sie einen Mindestbetrag erreichen — genaue Zeiten auf „When will I get paid?“',
          'In Deutschland gehören Royalty-Einnahmen oft in die Steuererklärung — Steuerberater, wenn Geld real wird.',
        ],
      },
      doThis: {
        en: [
          'Finish tax + bank in KDP before your first publish.',
          'Keep pen name only in book details.',
          'Bookmark “When will I get paid?” for timing.',
        ],
        de: [
          'Steuer + Bank in KDP vor dem ersten Publish fertig machen.',
          'Pseudonym nur in den Buchdetails.',
          '„When will I get paid?“ für den Zeitplan speichern.',
        ],
      },
      formulas: { en: [], de: [] },
      pitfalls: {
        en: [
          '“I’ll do tax later” → bigger withholding.',
          'Pen name on bank/tax forms.',
          'Thinking the normal Amazon shop login finished KDP tax setup.',
        ],
        de: [
          '„Steuer mache ich später“ → oft mehr Abzug.',
          'Pseudonym auf Bank-/Steuerformularen.',
          'Glauben, der normale Amazon-Shop-Login habe KDP-Steuer erledigt.',
        ],
      },
      links: [
        {
          label: 'Tax profile (official)',
          url: 'https://kdp.amazon.com/en_US/help/topic/G201274750',
        },
        {
          label: 'When will I get paid? (official)',
          url: 'https://kdp.amazon.com/en_US/help/topic/GK2MKZUL6U3SFBPZ',
        },
        {
          label: 'Account setup (official)',
          url: 'https://kdp.amazon.com/en_US/help/topic/G202187760',
        },
      ],
      note: {
        en: '⚠ Not tax advice — your local advisor + Amazon’s interview answers win.',
        de: '⚠ Keine Steuerberatung — lokaler Berater + Amazons Interview-Antworten gelten.',
      },
    },
  ],
  quickLinks: [
    { label: 'KDP home', url: 'https://kdp.amazon.com/' },
    { label: 'KDP Help', url: 'https://kdp.amazon.com/help' },
    {
      label: 'Free print calculator',
      url: 'https://kdp.amazon.com/en_US/help/topic/GSQF43YAMUPFTMSP',
    },
    {
      label: 'Content rules (AI)',
      url: 'https://kdp.amazon.com/en_US/help/topic/G200672390',
    },
  ],
}
