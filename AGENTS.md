# Agent instructions — ScanLogic Business Suite

Cursor loads rules from `.cursor/rules/*.mdc`. Use the matching rule when editing that area.

| Rule file | Scope |
|-----------|--------|
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

Human-readable security policy: `SECURITY.md`.
