export { PUBLISHING_SPECS, getTrimSize, getPaperType } from './publishing-specs.js'
export {
  requiredBleedPixels,
  effectiveDpi,
  spineWidthInches,
  spineWidthPixels,
  coverWrapPixels,
  coverWrapLayout,
  preflightImageResolution,
  validatePageCount,
} from './print-math.js'
export {
  CREDIT_COSTS,
  FREE_ACTIONS,
  costFor,
  resolveJobCost,
  estimateBookCredits,
} from './credits.js'
export { DESKTOP_MIN_WIDTH, DESKTOP_SURFACE, isDesktopViewport } from './desktop.js'
export {
  NAMED_TOOLS,
  CHARACTER_TURBO_ENGINES,
  defaultTurboEngine,
  toolById,
} from './tool-map.js'
export { assessDisclosure } from './disclosure.js'
export {
  BOOK_FORMATS,
  CONFIG_VALUES,
  PROMPT_TEMPLATES,
  RECIPES,
  GUIDES,
  COURSE_STEPS,
  MANUSCRIPT_PRINCIPLES,
  REFERENCE_BOOKS,
  READING_RESOURCES,
  VIDEO_TUTORIALS,
  WORKFLOW_PLAYBOOKS,
  TUTORIALS_META,
  COMMERCIAL_USE_STATEMENT,
  configMap,
  fillPrompt,
} from './launchpad-seed.js'
export {
  CRAFT_META,
  STORYTELLING_COMPASS,
  CHARACTER_DNA_GUIDE,
  CHARACTER_DNA_FIELDS,
  ART_STYLES,
  ART_STYLE_GUIDE,
  COVER_DESIGN_RULES,
  AGE_WORD_COUNTS,
  SEVEN_DAY_PLAN,
  MULTI_CHARACTER_METHOD,
  EXPRESSION_ARC,
  CONTINUITY_CHECKLIST,
  CHARACTER_DESIGN_PRINCIPLES,
  CAMERA_AND_BODY_TIPS,
  COLORING_PAGE_WORKFLOW,
  KDP_EARNINGS_REALISM,
  EDITOR_VARIATION_PLAYBOOKS,
  EDITOR_VARIATION_PRESETS,
  EXTERNAL_LEARNING_INDEX,
  craftLibraryPayload,
} from './craft-library.js'
export { PROGRESS_STEPS, stepIndex, TRACEABILITY } from './progress.js'
export {
  FAL_MODEL_CATALOGUE,
  FAL_DEFAULTS,
  falModelsPayload,
  isAllowedFalModel,
  falModelMeta,
} from './fal-models.js'
export {
  STORY_LANGUAGES,
  STORY_LANGUAGE_CODES,
  LANGUAGE_PAIR_PRESETS,
  BILINGUAL_LAYOUTS,
  BILINGUAL_LAYOUT_IDS,
  isStoryLanguageCode,
  getStoryLanguage,
  languageLabel,
  normalizeLanguagePair,
  formatLanguagePairLabel,
  resolvePageTextLines,
  composeDisplayText,
  languagesPayload,
} from './languages.js'
export {
  IP_CHARACTER_META,
  IP_SIGNATURE_COLORS,
  IP_EMOTIONAL_HOOKS,
  IP_NAME_SUGGESTIONS,
  MERCH_READY_CHECKS,
  IP_DNA_FIELDS,
  emptyIpCharacter,
  assessCharacterName,
  normalizeIpCharacter,
  validateIpCharacterForLock,
  isIpCharacterLocked,
  buildTurboDescriptionFromDna,
  ipCharacterPayload,
} from './ip-character.js'
export {
  CHARACTER_NAME_META,
  CULTURAL_NAME_BANK,
  THEME_NAME_BANK,
  generateCharacterNames,
  hasSoftEnding,
  characterNamesPayload,
} from './character-names.js'
export {
  PICTURE_BOOK_META,
  buildEscalatingBeatBriefs,
  defaultRefrainForHook,
  pictureBookPayload,
} from './picture-book.js'
export {
  MANUSCRIPT_META,
  buildManuscriptPages,
  estimateManuscriptWords,
  manuscriptPayload,
} from './manuscript.js'
export {
  PUBLICATION_READINESS_META,
  CONTINUITY_SIGNOFF_ITEMS,
  PICTURE_BOOK_BANNED_PHRASES,
  emptyPublicationSignoff,
  normalizePublicationSignoff,
  assessPublicationReadiness,
  publicationReadinessPayload,
  wordCount as publicationWordCount,
  bannedPhraseHits as publicationBannedPhraseHits,
} from './publication-readiness.js'
export {
  STORYFORGE_PRODUCT,
  STORYFORGE_NICHES,
  MARKET_DISCLAIMER as STORYFORGE_MARKET_DISCLAIMER,
  storyforgeNicheLocalized,
  applyStoryforgeNiche,
} from './product-positioning.js'
