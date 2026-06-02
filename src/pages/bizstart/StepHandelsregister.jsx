import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { downloadTextFile } from '@/lib/pdfUtils'

const GESellschaftsvertrag = `# Gesellschaftsvertrag (Muster — Einzel-GmbH)

## §1 Firma, Sitz
Die Gesellschaft führt die Firma [Name] GmbH mit Sitz in [Ort].

## §2 Gegenstand
[Unternehmensgegenstand]

## §3 Stammkapital
Das Stammkapital beträgt EUR [Betrag].

## §4 Geschäftsführung
Geschäftsführer: [Name]

*Muster — vor Notar und Rechtsanwalt prüfen lassen.*
`

export default function StepHandelsregister({ onUpdateStep, onNext }) {
  const downloadTemplate = () => {
    downloadTextFile(GESellschaftsvertrag, 'Gesellschaftsvertrag_Muster.md')
    toast.success('Template downloaded')
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Handelsregister</h2>
      <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-300">
        <li>Download Gesellschaftsvertrag template & customize</li>
        <li>Notary appointment — all partners with ID</li>
        <li>Deposit share capital (GmbH €12,500 / UG from €1)</li>
        <li>Notary submits to Amtsgericht — 1–4 weeks</li>
      </ol>
      <button type="button" onClick={downloadTemplate} className="premium-card flex w-full items-center gap-2 p-4">
        <Download className="h-5 w-5 text-brand-400" /> Download Gesellschaftsvertrag template
      </button>
      <a
        href="https://www.handelsregister.de"
        target="_blank"
        rel="noopener noreferrer"
        rel="noreferrer"
        className="block text-center text-sm text-brand-400 underline"
      >
        handelsregister.de — search entries
      </a>
      <button type="button" onClick={() => onUpdateStep('handelsregister', 'submitted')} className="w-full rounded-xl bg-slate-700 py-3 text-sm">
        Mark step in progress
      </button>
      <button
        type="button"
        onClick={() => {
          onUpdateStep('handelsregister', 'confirmed')
          onNext('ihk')
        }}
        className="btn-primary w-full rounded-xl py-3 font-semibold"
      >
        Handelsregister complete →
      </button>
    </div>
  )
}
