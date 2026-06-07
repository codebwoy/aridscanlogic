import { useState, useEffect, useRef } from 'react'
import { Upload, Receipt } from 'lucide-react'
import { toast } from 'sonner'
import appApi from '@/lib/appApi'
import { calcVatFromGross, calcDeductible } from '@/lib/taxCalculations'
import { getSkrCode } from '@/lib/bizstart/skr03'

export default function ReceiptManager({ kleinunternehmer = false, onChanged }) {
  const [receipts, setReceipts] = useState([])
  const fileRef = useRef(null)

  const load = async () => {
    try {
      setReceipts(await appApi.entities.Receipt.list())
    } catch {
      toast.error('Belege konnten nicht geladen werden')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const { file_url } = await appApi.integrations.Core.UploadFile({ file })
      const ocr = await appApi.integrations.Core.InvokeLLM({
        prompt: 'Parse this German receipt. Extract vendor, date, total, VAT rate (7 or 19), category.',
        file_urls: [file_url],
        response_json_schema: {
          type: 'object',
          properties: {
            vendor_name: { type: 'string' },
            total_amount: { type: 'number' },
            vat_rate: { type: 'number' },
            category: { type: 'string' },
          },
        },
      })
      const parsed = ocr?.parsed || {}
      const gross = parsed.total_amount || 0
      const rate = kleinunternehmer ? 0 : parsed.vat_rate === 7 ? 7 : 19
      const { vat } = kleinunternehmer ? { vat: 0 } : calcVatFromGross(gross, rate)
      const deductible = calcDeductible(gross, 'business')
      await appApi.entities.Receipt.create({
        vendor_name: parsed.vendor_name || 'Unbekannt',
        purchase_date: new Date().toISOString().slice(0, 10),
        total_amount: gross,
        vat_amount: vat,
        currency: 'EUR',
        category: parsed.category || 'Sonstiges',
        deductible_amount: deductible,
        tax_year: new Date().getFullYear(),
        image_url: file_url,
        expense_type: 'business',
      })
      toast.success('Beleg erfasst')
      load()
      onChanged?.()
    } catch (err) {
      toast.error('Beleg-Upload fehlgeschlagen')
      console.error(err)
    }
    e.target.value = ''
  }

  const total = receipts.reduce((s, r) => s + (r.deductible_amount || 0), 0)

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Belege</h3>
          <p className="text-xs text-slate-500">Abzugsfähig: {total.toFixed(2)} €</p>
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 rounded-xl bg-brand-600 px-3 py-2 text-sm"
        >
          <Upload className="h-4 w-4" /> Hochladen
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      </div>
      <div className="space-y-2">
        {receipts.map((r) => (
          <div key={r.id} className="flex gap-3 rounded-xl bg-slate-800/80 p-3">
            {r.image_url ? (
              <img src={r.image_url} alt="" className="h-12 w-10 rounded object-cover" />
            ) : (
              <Receipt className="h-10 w-10 text-slate-600" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{r.vendor_name}</p>
              <p className="text-xs text-slate-500">
                {r.total_amount?.toFixed(2)} €
                {!kleinunternehmer && ` · MwSt ${r.vat_amount?.toFixed(2)} €`}
                {' · '}
                {r.category}
                {' · SKR '}
                {getSkrCode(r.category)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
