import ConfirmReceipt from './ConfirmReceipt'

/** Log expense without receipt scan — flagged in reports */
export default function ManualExpenseEntry({ onBack, onSaved }) {
  return (
    <ConfirmReceipt
      draft={{
        vendor_name: '',
        purchase_date: new Date().toISOString().slice(0, 10),
        total_amount: '',
        vat_amount: '',
      }}
      imageUrl=""
      manualEntry
      onBack={onBack}
      onSaved={onSaved}
    />
  )
}
