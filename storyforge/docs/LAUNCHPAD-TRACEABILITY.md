# Launchpad Part A — Traceability (S1–S32)

Status after print-pipeline + fal catalogue completion.

| ID | Requirement | Status | Where |
|----|-------------|--------|-------|
| S1 | Non-illustrators / KDP children’s books | done | Studio + Launchpad onboarding copy (`i18n.js`, `LaunchpadPanel`) |
| S2 | Midjourney/DALL·E consistency problem | done | Onboarding + Character step (`StudioWorkbench`, Launchpad intro) |
| S3 | One full-body front white-bg anchor | done | `character_turbo` / Character Turbo UI |
| S4 | Every page from pinned anchor | done | `ANCHOR_REQUIRED_TYPES` in `jobs.js`; `AnchorStrip` |
| S5 | Character Turbo + V3 selector | done | Named tool + `CHARACTER_TURBO_ENGINES` |
| S6 | Editor Pro from anchor | done | `editor_pro` job + UI tab |
| S7 | Story Scene Pro (two characters) | done | `story_scene_pro` job + Studio tool |
| S8 | Photo to Cartoon | done | Recorded consent API + no raw photo on jobs |
| S9 | Canvas trim / text / bubbles / page export | done | `PageCanvas` + Studio layout |
| S10 | Correct trim sizes | done | `publishing-specs` + project trim |
| S11 | Direct-to-KDP file / checklist | done | Interior PDF via `pdfExport` + upload checklist |
| S12 | Quick Book ~10 min estimate | done | Recipe + config `quick_book_time_estimate` ⚠ |
| S13 | Prompt Library copy/apply | done | `/v1/launchpad/prompts` + UI |
| S14 | Photo → personalised book | done | Photo tool + recipe; consent required |
| S15 | Gift niche entry | done | Personalised Baby Books guide + warning |
| S16 | Niche guides (BTS + Baby) | done | Seed guides + Start this book |
| S17 | BSR / revenue fields | done | Manual `marketData` fields (no scrape) |
| S18 | Seasonal timing + publish-by | done | Dual source strings + countdown field |
| S19 | Google Trends panel | done | Official Trends link + note field |
| S20 | AI disclosure during upload / confidential claim | done | Config + course; ⚠ verify |
| S21 | Prompt → disclose | done | `assessDisclosure` |
| S22 | Enhance hand-painted → assisted | done | `assessDisclosure` + ⚠ |
| S23 | Commercial-use statement | done | `COMMERCIAL_USE_STATEMENT` (mock) |
| S24 | US copyright explainer | done | Config value S24 |
| S25 | 20 free credits | done | `STORYFORGE_TRIAL_CREDITS` default 20 + UI |
| S26 | Format chooser table | done | Course step 1 |
| S27 | Manuscript coach principles | done | Course step 2 |
| S27b | Koala Who Could reference card | done | Notes-only reference book |
| S28 | Illustrate checklist | done | Course step 3 → tools |
| S29 | Layout Canvas checklist | done | Course step 4 + Canvas |
| S30 | KDP upload checklist + 60% | done | Step 5 + royalty config ⚠ |
| S31 | Post-launch checklist | done | Course step 6 |
| S32 | Books & Guides slots | done | Empty editable slots by group |
| S33 | Consistency masterclass tutorials | done | `VIDEO_TUTORIALS` + `guide_consistency_masterclass` |
| S34 | Crayon / drawing → character | done | `recipe_crayon_character` + guide |
| S35 | Personalised bedtime | done | `recipe_bedtime_personalised` + guide |
| S36 | Editor Pro new-setting-from-anchor | done | Prompt `pt_new_setting_from_anchor` + course S28 |
| S37 | Multi-character masterclass | done | `recipe_multi_character_masterclass` |
| S38 | KDP print-ready studio path | done | `recipe_kdp_print_ready` + Canvas checklist |
| S39 | Storytelling Compass | done | `craft-library.js` + Launchpad Craft tab |
| S40 | Character DNA | done | DNA fields + `pt_identity_block` |
| S41 | Art style lock | done | 11-style catalogue |
| S42 | Cover design rules | done | Craft cover section + `pt_cover_from_dna` |
| S43 | Age word counts | done | Craft age table |
| S44 | 7-day launch skeleton | done | `recipe_seven_day_launch` |
| S45 | Multi-character 3-part prompts | done | `pt_multi_char_3part` |
| S46 | Expression / emotion arc | done | Craft expression section |
| S47 | Continuity QC | done | Two-pass checklist |
| S48 | Character design principles | done | 7 principles |
| S49 | Camera / body / age cues | done | Craft tips |
| S50 | Coloring from story art | done | `recipe_coloring_from_story` |
| S51 | KDP earnings realism ⚠ | done | Craft earnings section |
| S52 | Action / expression editors | done | `EDITOR_VARIATION_PLAYBOOKS` |
| S53 | Scene → video (fal image-to-video) | done | `scene_to_video` job + Studio tab; requires page still |
| S55 | Print pack + signed exports | done | Print-ready interior/cover PDFs, HMAC download URLs, `export_source_zip` |
| S56 | Full fal model catalogue | done | Shared `fal-models.js` + Studio pickers (Kontext/Kling Pro/Veo/Seedance/…) |
| S57 | Bilingual primary + secondary pairs | done | `languages.js` + Studio pair pickers + per-page dual text + PDF/manuscript layouts |
| S58 | IP Character Builder (merch DNA gate) | done | `ip-character.js` + Studio builder; `ip_dna_required` before Character Turbo |
| S59 | Merch PNG + beats + series reuse | done | `export_merch_png`, `seed-beats`, series IP DNA, name suggestions |
| S60 | Publication readiness score | done | Shared scorer + Studio Canvas/sidebar + Launchpad Craft + course/recipes + `/v1/specs` + ZIP `publication-readiness.json` + export confirm |
| S61 | Theme-aware character names | done | Generator + auto-seed + book-core editor in IP Builder + `POST …/name-ideas` + recipes/course + Launchpad Craft |

Public catalogues distilled: [Neolemon Tutorials](https://www.neolemon.com/tutorials/), [Guides](https://www.neolemon.com/guides/), [Blog](https://www.neolemon.com/blog). StoryForge is not affiliated — see `TUTORIALS_META` / `CRAFT_META.independenceNote`. Third-party pricing/legal pages are linked only, never imported as StoryForge policy.

## Part B (not built unless approved)

B-1 light (manual BSR) shipped with Part A. B-3 warning + B-4 consent gate shipped as security for S14/S15. Full B-2 royalty calculator, B-5 versioned official links, B-6 DACH calendar, etc. remain optional.
