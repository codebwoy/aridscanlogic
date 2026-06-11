import { useState } from 'react'
import { toast } from 'sonner'
import appApi from '@/lib/appApi'
import { dataUrlToJpegFile } from '@/lib/imageProcessing'
import { loadTaxVaultSettings } from '@/lib/taxvault/profile'
import TaxVaultCamera from '@/components/taxvault/TaxVaultCamera'
import { useAiLanguage } from '@/context/AiLanguageContext'
import AiLanguageTabs from '@/components/shared/AiLanguageTabs'
import { aiLanguageInstruction } from '@/lib/ai/promptLanguage'
import ConfirmReceipt from './ConfirmReceipt'

export default function ReceiptScanFlow({ onClose, onSaved }) {
  const { language, setLanguage } = useAiLanguage()
  const [step, setStep] = useState('camera')
  const [imageUrl, setImageUrl] = useState('')
  const [draft, setDraft] = useState({})
  const [processing, setProcessing] = useState(false)
  const settings = loadTaxVaultSettings()

  const runOcr = async (fileUrl) => {
    if (!settings.autoOcr) {
      setDraft({})
      setStep('confirm')
      return
    }
    setProcessing(true)
    try {
      const ocr = await appApi.integrations.Core.InvokeLLM({
        prompt: `${aiLanguageInstruction(language)}

Extract from this receipt: vendor/store name, purchase date (YYYY-MM-DD), total amount paid, VAT/tax amount if shown, currency code (EUR/USD/GBP/CHF), best matching expense category from: Office Supplies, Equipment, Software, Travel, Food & Entertainment, Marketing, Professional Services, Rent, Education, Insurance, Bank, Other.`,
        file_urls: [fileUrl],
        response_json_schema: {
          type: 'object',
          properties: {
            vendor_name: { type: 'string' },
            purchase_date: { type: 'string' },
            total_amount: { type: 'number' },
            vat_amount: { type: 'number' },
            currency: { type: 'string' },
            category: { type: 'string' },
          },
        },
      })
      const parsed = ocr?.parsed || ocr || {}
      setDraft({
        vendor_name: parsed.vendor_name,
        purchase_date: parsed.purchase_date,
        total_amount: parsed.total_amount,
        vat_amount: parsed.vat_amount,
        currency: parsed.currency,
        category: parsed.category,
      })
      setStep('confirm')
    } catch (err) {
      toast.error('OCR failed — enter details manually')
      setDraft({})
      setStep('confirm')
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  const handleCapture = async (dataUrl) => {
    try {
      const file = await dataUrlToJpegFile(dataUrl, 'receipt.jpg')
      const { file_url } = await appApi.integrations.Core.UploadFile({ file })
      setImageUrl(file_url)
      setStep('processing')
      await runOcr(file_url)
    } catch {
      toast.error('Upload failed')
      setStep('camera')
    }
  }

  if (step === 'confirm') {
    return (
      <ConfirmReceipt
        draft={draft}
        imageUrl={imageUrl}
        onBack={() => setStep('camera')}
        onSaved={() => {
          onSaved?.()
          onClose?.()
        }}
      />
    )
  }

  if (step === 'camera') {
    return (
      <>
        <div className="fixed right-4 top-16 z-[80]">
          <AiLanguageTabs language={language} onChange={setLanguage} disabled={processing} compact />
        </div>
        <TaxVaultCamera onCapture={handleCapture} onCancel={onClose} />
      </>
    )
  }

  if (step === 'processing') {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
        <p className="text-lg font-medium">Reading receipt…</p>
        <p className="mt-2 text-sm text-slate-500">OCR in progress</p>
      </div>
    )
  }

  return null
}
