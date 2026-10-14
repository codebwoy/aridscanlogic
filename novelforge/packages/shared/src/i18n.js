const STRINGS = {
  en: {
    appName: 'NovelForge',
    categoryBadge: 'Fiction studio',
    positioningLead:
      'Adult fiction only — novels and novellas. Non-fiction → AuthorForge. Kids picture books → StoryForge.',
    assistantIdle:
      'Ask for premise, cast, plot beats, or scene drafts. Fiction invention is allowed; never invent real-person libel or “true story” claims.',
    fictionBadge: 'Fiction studio',
    newBook: 'New novel',
    desktopRequired: 'Open NovelForge on a desktop or wide laptop viewport to write.',
    offlineHint: 'Local FakeLLM works offline when NOVELFORGE_LLM_PROVIDER=fake.',
  },
  de: {
    appName: 'NovelForge',
    categoryBadge: 'Fiction-Studio',
    positioningLead:
      'Nur Erwachsenen-Fiction — Romane und Novellen. Sachbuch → AuthorForge. Kinderbilderbücher → StoryForge.',
    assistantIdle:
      'Frage nach Premise, Figuren, Plot-Beats oder Szenen. Fiction-Erfindung ist erlaubt; keine Verleumdung realer Personen.',
    fictionBadge: 'Fiction-Studio',
    newBook: 'Neuer Roman',
    desktopRequired: 'Öffne NovelForge auf einem Desktop oder breiten Laptop.',
    offlineHint: 'Lokales FakeLLM funktioniert offline mit NOVELFORGE_LLM_PROVIDER=fake.',
  },
}

export function t(lang, key) {
  const L = STRINGS[lang] || STRINGS.en
  return L[key] || STRINGS.en[key] || key
}
