import { useEffect, useState } from 'react'
import { CheckCircle, Clock, XCircle } from 'lucide-react'
import base44 from '@/lib/base44'
import { getContractAudit } from '@/lib/contractsafe/auditLog'

const STATUS_ICON = {
  signed: CheckCircle,
  pending: Clock,
  declined: XCircle,
}

export default function SigningAudit({ contractId }) {
  const [signers, setSigners] = useState([])
  const events = getContractAudit(contractId)

  useEffect(() => {
    if (!contractId) return
    base44.entities.ContractSigner.list({ contract_id: contractId }).then(setSigners)
  }, [contractId])

  return (
    <div className="mt-4 rounded-xl bg-slate-800/60 p-4">
      <h4 className="mb-3 text-sm font-semibold text-slate-400">Audit trail</h4>
      {events.length > 0 && (
        <div className="mb-3 space-y-1 border-b border-slate-700 pb-3 text-xs text-slate-500">
          {events.map((e) => (
            <p key={e.id}>
              {new Date(e.timestamp).toLocaleString()} — {e.type}
              {e.signerName ? ` (${e.signerName})` : ''}
            </p>
          ))}
        </div>
      )}
      <div className="space-y-3">
        {signers.map((s) => {
          const Icon = STATUS_ICON[s.signing_status] || Clock
          return (
            <div key={s.id} className="flex items-center gap-3 text-sm">
              <Icon
                className={`h-5 w-5 ${
                  s.signing_status === 'signed'
                    ? 'text-green-400'
                    : s.signing_status === 'declined'
                      ? 'text-red-400'
                      : 'text-amber-400'
                }`}
              />
              <div>
                <p className="font-medium">{s.signer_name}</p>
                <p className="text-xs text-slate-500">
                  {s.signer_email} · {s.signing_status || 'pending'}
                </p>
              </div>
            </div>
          )
        })}
        {signers.length === 0 && (
          <p className="text-xs text-slate-500">Keine Unterzeichner erfasst</p>
        )}
      </div>
    </div>
  )
}
