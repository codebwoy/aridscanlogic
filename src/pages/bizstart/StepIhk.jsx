export default function StepIhk({ formData, onUpdateStep, onNext }) {
  const isCraft = formData.activityCategory === 'Handwerk'
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">{isCraft ? 'HWK' : 'IHK'} Membership</h2>
      <p className="text-sm text-slate-400">
        Mandatory membership after Gewerbeanmeldung. Annual fee €50–€500. Year 1 exemption may apply.
      </p>
      {formData.businessStructure === 'freiberufler' && (
        <p className="text-sm text-emerald-400">Freiberufler are typically exempt from IHK/HWK.</p>
      )}
      <button type="button" onClick={() => onUpdateStep('ihk', 'confirmed')} className="btn-primary w-full rounded-xl py-3">
        IHK/HWK acknowledged
      </button>
      <button type="button" onClick={() => onNext('bank')} className="w-full text-sm text-slate-500">
        Continue to bank setup
      </button>
    </div>
  )
}
