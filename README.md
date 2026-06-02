# ScanLogic AI & Business Suite

Mobile-optimized business productivity workspace combining document scanning, German tax tracking, invoicing, contracts, and AI legal coaching.

## Technical pipeline (fidelity spec)

### Scan pipeline
1. **Capture/Upload** — JPEG `DataURL` / `Blob` from camera canvas or file input
2. **Crop & optimize** — Canvas filters: grayscale `0.2126R+0.7152G+0.0722B`, high-contrast luminance normalization + binarization, magic-color edge sharpen + text saturation
3. **Upload** — `dataUrl → File(image/jpeg)` → local data URL storage
4. **AI** — Page URLs → Anthropic Claude with `response_json_schema` (OCR, document type, markdown)

### DocDraft
- `is_kleinunternehmer` → 0 % VAT + §19 UStG footnote on UI/PDF
- Live net/VAT breakdown/gross on every keystroke via `calcDocDraftTotals`

### Tax Vault
- Gewerbesteuer: €24,500 Freibetrag, 3.5 % × Hebesatz 400
- Einkommensteuer: progressive German brackets to 45 %
- Umsatzsteuer: invoice VAT collected − receipt input VAT

### Contract Safe
- Parallel: any signer may use canvas signature pad (base64 PNG)
- Sequential: `signing_order_index`; next signer activated only after previous signs

### Lawyer AI archive
- Save parses **first line** of response as `message_title` → `SavedLawyerMessage`

## Modules

1. **ScanLogic AI** — Multi-page scan, perspective crop, filters, OCR, markdown export
2. **Tax Vault** — Receipts, mileage, tax deadlines, estimated Gewerbe/ESt/USt
3. **DocDraft** — Invoices, quotes, delivery notes with VAT calculations
4. **Contract Safe** — German templates, e-signatures, audit trail
5. **Herr Müller (Lawyer AI)** — Business coach chat with message archive

## Tech Stack

- React 19 + Vite 8
- Tailwind CSS 4
- Framer Motion, Lucide React
- jsPDF, Recharts, react-markdown, Sonner

## Setup

```bash
npm install
cp .env.example .env
# Required for live AI: ANTHROPIC_API_KEY=sk-ant-...
npm run dev
```

**Restart the dev server** after changing `.env`.

### AI (Anthropic Claude)

Set `ANTHROPIC_API_KEY` in `.env` (see `.env.example`). The dev/preview server proxies Claude via `/api/llm` so the key **never** ships to the browser. See [SECURITY.md](./SECURITY.md). When configured, Claude powers:

- **Herr Müller** — full system prompt + multi-turn chat (not demo stubs)
- **Document scan OCR** — vision + structured JSON
- **Tax Vault receipt OCR** — vendor, amounts, category
- **BizStart registration chat**
- **Background removal** guidance (vision)

Priority: **Anthropic Claude** → demo LLM stubs.

All data (documents, receipts, contracts, etc.) is stored in **browser localStorage**.

## Project Structure

```
src/
├── components/
│   ├── scanner/     # Camera, crop, optimize, results
│   ├── lawyer/      # Archive, quick prompts, message actions
│   └── layout/      # Tab bar, premium modal
├── pages/
│   ├── Dashboard.jsx
│   ├── taxvault/
│   ├── docdraft/
│   └── contractsafe/
└── lib/
    ├── appApi.js    # localStorage entities + LLM + file upload
    ├── schemas.js   # Entity definitions
    └── ...
```

## Build

```bash
npm run build
npm run preview
```

## SEO & Google indexing

The build generates `public/robots.txt`, `public/sitemap.xml`, and `public/og-image.png`, and injects Open Graph, Twitter Card, and [Schema.org](https://schema.org) JSON-LD into `index.html`.

| Step | Action |
|------|--------|
| 1 | Push to `main` — GitHub Actions deploys to Pages (`/.github/workflows/deploy-pages.yml`) |
| 2 | Repo **Settings → Pages → Build and deployment: GitHub Actions** |
| 3 | Set `VITE_SITE_URL` in `.env` if using a custom domain (re-run `npm run seo:generate`) |
| 4 | [Google Search Console](https://search.google.com/search-console) → add property → submit sitemap: `https://codebwoy.github.io/aridscanlogic/sitemap.xml` |

Default canonical URL: `https://codebwoy.github.io/aridscanlogic/`
