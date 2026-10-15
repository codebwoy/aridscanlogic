# ProofForge research sources (retrieved for product behavior)

Official help pages used to design reports, editing order, and KDP checks.
Do **not** copy proprietary code or private editorial databases — original implementations only.

| Source | URL | Retrieved | Used for |
|--------|-----|-----------|----------|
| ProWritingAid Manuscript Analysis | https://help.prowritingaid.com/article/318-what-is-manuscript-analysis | 2026-10-14 | Whole-book sections: story, themes, plot, characters, setting; 6k–300k words; text locations |
| ProWritingAid feedback types | https://help.prowritingaid.com/article/320-what-type-of-feedback-does-manuscript-analysis-provide | 2026-10-14 | Severity colors; jump-to-text; agree/disagree status |
| ProWritingAid Reports index | https://help.prowritingaid.com/category/53-the-reports | 2026-10-14 | Report catalog (style, readability, sticky, overused, grammar, …) |
| ProWritingAid Style Report | https://help.prowritingaid.com/article/353-how-to-use-the-writing-style-report | 2026-10-14 | Passive/adverbs/readability/emotion tells/hidden verbs/repeated starts; passive &lt;25% guide |
| AutoCrit Summary Report | https://help.autocrit.com/en/articles/17005345-the-autocrit-summary-report | 2026-10-14 | Score as guide; genre comparison; categories: pacing, dialogue, strong writing, word choice, repetition |
| AutoCrit editing process | https://help.autocrit.com/en/articles/2951938-what-is-the-recommended-editing-process-with-autocrit | 2026-10-14 | Order: dialogue → repetition → summary → easy wins (adverbs, filler) |
| AutoCrit Pacing | https://help.autocrit.com/en/articles/4042847-pacing | 2026-10-14 | Slow-paragraph heuristics; first chapter should stay relatively fast |
| AutoCrit Dialogue | https://www.autocrit.com/editing/support/dialogue/ | 2026-10-14 | Dialogue % vs genre; tag patterns |
| Grammarly how it works | https://support.grammarly.com/hc/en-us/articles/115000090871-How-does-Grammarly-work | 2026-10-14 | Context suggestions + explanations; user decides |
| Grammarly tone | https://support.grammarly.com/hc/en-us/articles/10674801783309-How-does-Grammarly-s-tone-suggestions-work | 2026-10-14 | Tone detector vs sentence rewrites |
| Grammarly preferences | https://support.grammarly.com/hc/en-us/articles/4410375670541-Customize-writing-preferences | 2026-10-14 | Toggle suggestion categories on/off |
| Grammarly document domains | https://support.grammarly.com/hc/en-us/articles/115000091472-What-is-document-domain-and-how-do-I-change-it | 2026-10-14 | General / Academic / Business / Email / Casual / Creative strictness |
| Amazon KDP book formatting | https://kdp.amazon.com/en_US/help/topic/GKX2T59EVGFSMKQK | 2026-10-14 | Ebook vs paperback vs hardcover separation |
| Amazon KDP trim/bleed/margins | https://kdp.amazon.com/help/topic/GVBQ3CMEQW3W2VL6 | 2026-10-14 | Gutter by page count; bleed 0.125″; outside margins |
| Amazon KDP ebook formats | https://kdp.amazon.com/en_US/help/topic/G200634390 | 2026-10-14 | DOCX / KPF / EPUB; MOBI fixed-layout ended March 2025; Kindle Previewer |
| Amazon KDP Content Guidelines | https://kdp.amazon.com/en_US/help/topic/G200672390 | 2026-10-14 | Illegal/offensive; AI-generated vs AI-assisted disclosure; translation credit; public domain |
| Amazon KDP fix formatting (print) | https://kdp.amazon.com/en_US/help/topic/G201834260 | 2026-10-14 | Blank pages ≤4 mid/front ≤10 end; embed fonts; pagination; hidden chars; spine &lt;79; flatten transparencies |
| Anthropic prompting best practices | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices | 2026-10-14 | Structured JSON outputs; clear constraints |
| OpenAI structured outputs | https://platform.openai.com/docs/guides/structured-outputs | 2026-10-14 | Schema-validated agent JSON for verify provider |

## Product principles taken from research

1. Scores are guides — do not chase 100% (AutoCrit).
2. Findings must jump to exact text (ProWritingAid).
3. Separate objective mechanics from optional style (Grammarly + brief).
4. Editing order: dialogue / repetition / summary categories first (AutoCrit process).
5. KDP rules versioned with source URL + date — never claim Amazon approval.
6. Author preferences can disable whole suggestion categories (Grammarly preferences).
7. Document domains change which style findings surface (Grammarly domains → Creative default for fiction).
8. Soft word-count gate 6k–300k with coverage notes (PWA Manuscript Analysis).
9. Agree/disagree feedback on findings without requiring accept (PWA feedback types).
10. AI-assisted editing (ProofForge) ≠ AI-generated manuscript for KDP disclosure — author confirms current Amazon form.
11. Scanned PDFs: OCR fallback labels confidence; prefer text PDF/DOCX.
12. External plagiarism only with informed consent + configured provider.
13. Manuscript Analysis five sections + color levels (working well → major concern) + Text Location jump.
14. Fine-tune author goals steer overview (PWA “Help us fine-tune your feedback”).
15. AutoCrit genre comparison + editing process order (dialogue → repetition → summary → easy wins).
16. Style extras: emotion tells, hidden verbs, passive &lt;25% guide, first-chapter pacing stricter.
17. Tone detector = overall label (Grammarly-style); sentence rewrites remain author-controlled findings.
18. Reports catalog: Summary hub (looks great / needs work), Overused Words, Sticky, Sentence Structure, Readability bands, Grammar rollup, Dialogue density + highlight toggle.
19. Ignore / Defer / Add to dictionary (Grammarly Grammar Report + PWA control).
20. Work-unit estimate before audit (personal studio — not billed); hardcover case-laminate reminder.
21. KDP Word-template pre-pub checklist: placeholders, title/author match, ≥300 DPI images, ≥7 pt legibility (G201834230).
22. Ordered action plan + re-verify after corrections; alternatives picker; DOCX export; file sha256 on ingest; drag-drop upload; kids/YA soft safeguards; cross-chapter continuity pass.
23. Scorecard dimensions (grammar, naturalness, regional, clarity, repetition, structure, genre, factual, formatting, KDP) — critical KDP blocking outweighs clean prose.
24. Finding start/end offsets from excerpt; analysis_run_id on findings.
25. Paragraph length + overused/abrupt transitions; integrity (dates/numbers/terminology); formality + character list + glossary refs.
26. KDP G201834260: blank pages, font embed, pagination, hidden characters, spine &lt;79 pages, transparencies.
27. PWA Style Report extras: long subordinate clauses; author style-guide rules (“prefer X not Y” / “never use Z”).
28. Mechanics: duplicate words, confused pairs, wordiness/redundancy, nominalizations; tone consistency across chapters.
29. Nonfiction: mixed citation-style heuristic + high-stakes expert-verification disclaimer.
30. EN varieties AU/NZ/CA; workbook answer-key / writing-space / page-ref checks; ISBN format (G201834230); PDF+embed reminder.
31. Project metadata: subtitle, author/pen name, intended tone, style guide paste, translation glossary wired into glossary checks.
32. Manuscript Analysis Text Location pins (jump buttons) from related findings (PWA).
33. Overused-words thesaurus alternatives (PWA Thesaurus Report concept); sticky sentences as findings.
34. Fiction POV/tense consistency heuristics; KDP title/author manuscript match; bleed toggle; Amazon Endure note; translation log in MD export.
35. KDP export paths: print PDF at trim + mirror margins (+ bleed); DOCX page setup from print_config; EPUB/DOCX/HTML/TXT for Kindle; KPF via Kindle Create only; audit PDF report.
36. Scorecard shows “—” until an audit runs (no fake 100). Interactive KDP upload checklist on Export (Previewer, cover/spine, AI disclosure, MOBI end-date).
37. Create-project metadata: author, subtitle, intended tone, formality — tone/formality steer analysis; RTF export + cover-calculator deep link; author_decisions log on accept/reject.
38. Translation glossary + source language UI; richer NovelForge handoff metadata; AuthorForge + StoryForge → ProofForge handoff (same import API).
