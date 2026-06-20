export default function StepBank({ onUpdateStep, onNext }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Business bank account</h2>
      <p className="text-sm text-slate-400">
        Open a dedicated business account. Required for GmbH/UG capital deposit and clean bookkeeping.
      </p>
      <ul className="space-y-2 text-sm text-slate-300">
        <li>N26 Business — mobile-first</li>
        <li>Kontist — for freelancers</li>
        <li>Qonto — GmbH-friendly</li>
      </ul>
      <button type="button" onClick={() => { onUpdateStep('bank', 'confirmed'); onNext('websiteLegal') }} className="btn-primary w-full rounded-xl py-3">
        Bank setup done / not needed yet
      </button>
    </div>
  )
}
