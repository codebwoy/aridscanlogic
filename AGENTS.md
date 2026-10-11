# Agent instructions — ScanLogic Business Suite

Cursor loads rules from `.cursor/rules/*.mdc`. Use the matching rule when editing that area.

| Rule file | Scope |
|-----------|--------|
| `000-design-non-negotiables.mdc` | Always on — design tokens, no freehand UI |
| `00-project-core.mdc` | Always on — stack, entities, conventions |
| `01-server-api.mdc` | `server/`, `vite.config.js` |
| `02-data-layer.mdc` | `appApi`, Supabase sync, `apiFetch` |
| `03-docs-scanner.mdc` | Docs tab, scanner pipeline |
| `04-taxvault.mdc` | Tax Vault module |
| `05-docdraft.mdc` | DocDraft module |
| `06-contractsafe.mdc` | Contracts module |
| `07-lawyer-ai.mdc` | Herr Müller / Lawyer AI |
| `08-scanvault.mdc` | Standalone ScanVault app |
| `09-bizstart.mdc` | BizStart wizard (inside Tax Vault) |
| `10-shared-ui.mdc` | Layout, guide, settings, PWA, contexts |
| `11-security.mdc` | Security helpers and policies |
| `12-seo.mdc` | Meta tags, sitemap, GitHub Pages deploy |
| `13-ai-language.mdc` | Global DE/EN toggle for all AI surfaces |
| `14-tailorcv.mdc` | TailorCV job-targeted CV / cover letter (BizStart) |
| `15-listingengine.mdc` | German E-Commerce Listing Engine (eBay.de copy + compliance) |
| `16-ai-mobile-chat.mdc` | Always on — mobile AI answers immersive; tables; room to reply |
| `17-design-system-rail.mdc` | UI files — Design System Rail (tokens, layouts, build loop) |
| `18-storyforge.mdc` | StoryForge desktop studio + Launchpad (`storyforge/`) — not a mobile suite tab |
| `19-authorforge.mdc` | AuthorForge desktop non-fiction co-author (`authorforge/`) — not a mobile suite tab |

Human-readable security policy: `SECURITY.md`. StoryForge: `storyforge/SECURITY.md`.

**SEO / Pages:** `https://codebwoy.github.io/aridscanlogic` — deploy via `deploy-github-pages.yml` (peaceiris → `gh-pages`). Enable Pages from branch `gh-pages` in repo settings. See `DEPLOY.md`.

**Hybrid studios (production):** AuthorForge + StoryForge Docker/Fly — `authorforge/docs/HYBRID_DEPLOY.md`. ScanLogic Vercel sets `VITE_AUTHORFORGE_URL` / `VITE_STORYFORGE_URL` only (no studio secrets in `VITE_*`).
