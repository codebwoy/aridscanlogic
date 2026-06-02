# ScanLogic AI & Business Suite

Mobile-optimized business productivity workspace combining document scanning, German tax tracking, invoicing, contracts, and AI legal coaching.

## Technical pipeline (fidelity spec)

### Scan pipeline
1. **Capture/Upload** — JPEG `DataURL` / `Blob` from camera canvas or file input
2. **Crop & optimize** — Canvas filters: grayscale `0.2126R+0.7152G+0.0722B`, high-contrast luminance normalization + binarization, magic-color edge sharpen + text saturation
3. **Upload** — `dataUrl → File(image/jpeg)` → `base44.integrations.Core.UploadFile({ file })`
4. **AI** — Page URLs → `InvokeLLM` with `response_json_schema` (OCR, document type, markdown)

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
# Optional: set VITE_BASE44_API_URL, VITE_BASE44_APP_ID, VITE_BASE44_API_KEY
npm run dev
```

Without Base44 credentials, the app runs in **demo mode** using `localStorage` for entity CRUD and simulated LLM responses.

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
    ├── base44.js    # SDK client + demo fallback
    ├── schemas.js   # Entity definitions
    └── ...
```

## Build

```bash
npm run build
npm run preview
```
