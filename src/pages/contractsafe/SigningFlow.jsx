import { useState, useEffect, useMemo } from 'react'
import { ArrowLeft, Lock, PenLine } from 'lucide-react'
import { toast } from 'sonner'
import appApi from '@/lib/appApi'
import SignaturePad from '@/components/contractsafe/SignaturePad'
import { logContractEvent } from '@/lib/contractsafe/auditLog'

export default function SigningFlow({ contract, onBack, onUpdated }) {
  const [signers, setSigners] = useState([])
  const [activeSigner, setActiveSigner] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const all = await appApi.entities.ContractSigner.list({ contract_id: contract.id })
      const sorted = all.sort(
        (a, b) => (a.signing_order_index ?? 0) - (b.signing_order_index ?? 0)
      )
      setSigners(sorted)
    } catch {
      toast.error('Unterzeichner konnten nicht geladen werden')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [contract.id])

  const isSequential = contract.signing_order === 'sequential'

  const signableSigners = useMemo(() => {
    if (!isSequential) {
      return signers.filter((s) => s.signing_status !== 'signed' && s.signing_status !== 'declined')
    }
    const firstPending = signers.find(
      (s) =>
        (s.signing_status === 'pending' || s.signing_status === 'waiting') &&
        s.signing_status !== 'signed' &&
        s.signing_status !== 'declined'
    )
    return firstPending && firstPending.signing_status === 'pending' ? [firstPending] : []
  }, [signers, isSequential])

  const waitingSigners = useMemo(() => {
    if (!isSequential) return []
    const activeIdx = signers.findIndex(
      (s) => s.signing_status !== 'signed' && s.signing_status !== 'declined'
    )
    if (activeIdx < 0) return []
    return signers.slice(activeIdx + 1).filter((s) => s.signing_status === 'pending')
  }, [signers, isSequential])

  const handleSign = async (signatureBase64) => {
    if (!activeSigner) return
    try {
      await appApi.entities.ContractSigner.update(activeSigner.id, {
        signing_status: 'signed',
        signature_image_url: signatureBase64,
        signed_at: new Date().toISOString(),
      })
      logContractEvent(contract.id, {
        type: 'signed',
        signerName: activeSigner.name,
        ip: 'local-device',
      })

      if (isSequential) {
        const refreshed = await appApi.entities.ContractSigner.list({
          contract_id: contract.id,
        })
        const sorted = refreshed.sort(
          (a, b) => (a.signing_order_index ?? 0) - (b.signing_order_index ?? 0)
        )
        const next = sorted.find(
          (s) => s.signing_status === 'waiting' || s.signing_status === 'pending'
        )
        if (next && next.signing_status === 'waiting') {
          await appApi.entities.ContractSigner.update(next.id, { signing_status: 'pending' })
        }
      }

      const updated = await appApi.entities.ContractSigner.list({ contract_id: contract.id })
      const allSigned = updated.every((s) => s.signing_status === 'signed')
      const anySigned = updated.some((s) => s.signing_status === 'signed')

      await appApi.entities.Contract.update(contract.id, {
        status: allSigned ? 'fully_signed' : anySigned ? 'partially_signed' : 'sent',
      })

      toast.success(`${activeSigner.signer_name} hat unterschrieben`)
      setActiveSigner(null)
      load()
      onUpdated?.()
    } catch {
      toast.error('Signatur konnte nicht gespeichert werden')
    }
  }

  if (activeSigner) {
    return (
      <div className="w-full">
        <button
          type="button"
          onClick={() => setActiveSigner(null)}
          className="safe-top mb-4 flex items-center gap-2 text-sm text-slate-400"
        >
          <ArrowLeft className="h-4 w-4" /> Zurück
        </button>
        <h2 className="mb-4 text-lg font-bold">Signatur: {activeSigner.signer_name}</h2>
        <SignaturePad
          onSave={handleSign}
          onCancel={() => setActiveSigner(null)}
        />
      </div>
    )
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={onBack}
        className="safe-top mb-4 flex items-center gap-2 text-sm text-slate-400"
      >
        <ArrowLeft className="h-4 w-4" /> Zurück
      </button>
      <h2 className="text-lg font-bold">{contract.title}</h2>
      <p className="mb-4 text-xs capitalize text-slate-500">
        {contract.signing_order === 'sequential' ? 'Sequentielle' : 'Parallele'} Signatur
      </p>

      {loading ? (
        <p className="text-slate-500">Laden…</p>
      ) : (
        <>
          <div className="space-y-2">
            {signers.map((s) => {
              const canSign = signableSigners.some((x) => x.id === s.id)
              const isWaiting = waitingSigners.some((x) => x.id === s.id)
              return (
                <div
                  key={s.id}
                  className={`rounded-xl p-4 ${
                    s.signing_status === 'signed'
                      ? 'bg-green-900/30 border border-green-700/40'
                      : canSign
                        ? 'bg-brand-900/20 border border-brand-600/40'
                        : 'bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {s.signing_order_index != null ? `${s.signing_order_index + 1}. ` : ''}
                        {s.signer_name}
                      </p>
                      <p className="text-xs text-slate-500">{s.signer_email}</p>
                    </div>
                    <span className="text-xs capitalize">{s.signing_status || 'pending'}</span>
                  </div>
                  {s.signature_image_url && (
                    <img
                      src={s.signature_image_url}
                      alt="Signatur"
                      className="mt-2 h-12 object-contain"
                    />
                  )}
                  {canSign && (
                    <button
                      type="button"
                      onClick={() => setActiveSigner(s)}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2 text-sm font-medium"
                    >
                      <PenLine className="h-4 w-4" /> Jetzt unterschreiben
                    </button>
                  )}
                  {isWaiting && isSequential && (
                    <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                      <Lock className="h-3 w-3" /> Wartet auf vorherige Unterschrift
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
