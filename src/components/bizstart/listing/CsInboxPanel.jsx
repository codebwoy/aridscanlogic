import { useCallback, useState } from 'react'
import {
  Loader2,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Send,
  Copy,
  Plus,
  Trash2,
  AlertTriangle,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  CS_STATUS,
  loadCsCases,
  syncInquiriesFromEbay,
  createManualCsCase,
  draftCsReply,
  templateCsReply,
  CS_REPLY_TEMPLATES,
  applyCsTemplate,
  updateCsCase,
  removeCsCase,
  sendCsReply,
} from '@/lib/listingengine/ops'
import { loadCatalog } from '@/lib/listingengine/catalog'
import { isEbayConnected } from '@/lib/listingengine/ebay/authStore'
import { copyTextToClipboard } from '@/lib/listingengine'

export default function CsInboxPanel({ lang = 'de' }) {
  const [state, setState] = useState(() => loadCsCases())
  const [busy, setBusy] = useState(false)
  const [manual, setManual] = useState({ buyer: '', orderId: '', message: '' })

  const dryRun = loadCatalog().settings?.dry_run !== false

  const refresh = useCallback(() => setState(loadCsCases()), [])

  const onSync = async () => {
    setBusy(true)
    try {
      if (!isEbayConnected()) {
        toast.message(
          lang === 'de'
            ? 'Nicht verbunden — du kannst Fälle manuell anlegen.'
            : 'Not connected — you can still add cases manually.'
        )
      }
      const next = await syncInquiriesFromEbay({ limit: 25 })
      setState(next)
      if (next.syncError) {
        toast.error(
          lang === 'de'
            ? `Inquiry-Sync: ${next.syncError} — manuell weiter nutzbar`
            : `Inquiry sync: ${next.syncError} — manual still works`
        )
      } else {
        toast.success(
          lang === 'de'
            ? `${next.synced} Inquiries geladen (${next.cases.length} Fälle)`
            : `${next.synced} inquiries loaded (${next.cases.length} cases)`
        )
      }
    } catch (err) {
      toast.error(err?.message || 'Sync failed')
    } finally {
      setBusy(false)
    }
  }

  const onAddManual = () => {
    if (!manual.message.trim()) {
      toast.error(lang === 'de' ? 'Nachricht fehlt' : 'Message required')
      return
    }
    setState(
      createManualCsCase({
        buyer: manual.buyer,
        orderId: manual.orderId,
        buyerMessage: manual.message,
        subject: manual.orderId ? `Order ${manual.orderId}` : 'Manuelle Anfrage',
      })
    )
    setManual({ buyer: '', orderId: '', message: '' })
    toast.success(lang === 'de' ? 'Fall angelegt' : 'Case created')
  }

  const onDraft = async (id) => {
    setBusy(true)
    try {
      const next = await draftCsReply(id, lang)
      setState(next)
      toast.success(lang === 'de' ? 'Entwurf erstellt' : 'Draft ready')
    } catch (err) {
      // Fallback template
      const cases = loadCsCases().cases
      const cs = cases.find((c) => c.id === id)
      if (cs) {
        const reply = templateCsReply(cs, lang)
        setState(
          updateCsCase(id, {
            draftReply: reply,
            status: CS_STATUS.DRAFT_READY,
            human_approved: false,
            lastError: err?.message || 'LLM fallback template',
          })
        )
        toast.message(lang === 'de' ? 'Template-Entwurf (LLM fehlgeschlagen)' : 'Template draft (LLM failed)')
      } else {
        toast.error(err?.message || 'Draft failed')
      }
    } finally {
      setBusy(false)
    }
  }

  const onApprove = (id) => {
    setState(
      updateCsCase(id, {
        human_approved: true,
        status: CS_STATUS.WAITING_SEND,
      })
    )
    toast.success(lang === 'de' ? 'Freigegeben' : 'Approved')
  }

  const onSend = async (cs) => {
    if (!cs.human_approved) {
      toast.error(lang === 'de' ? 'Zuerst freigeben' : 'Approve first')
      return
    }
    setBusy(true)
    try {
      if (!cs.inquiryId) {
        await copyTextToClipboard(cs.draftReply)
        setState(
          updateCsCase(cs.id, {
            status: CS_STATUS.SENT,
            sentAt: new Date().toISOString(),
            dry_run_sent: true,
            lastError:
              lang === 'de'
                ? 'In Zwischenablage — im eBay Seller Hub einfügen (kein Inquiry-ID).'
                : 'Copied — paste in eBay Seller Hub (no inquiry id).',
          })
        )
        toast.success(
          lang === 'de' ? 'Antwort kopiert — im Seller Hub senden' : 'Reply copied — send in Seller Hub'
        )
      } else {
        const next = await sendCsReply(cs.id, { dryRun })
        setState(next)
        toast.success(
          dryRun
            ? lang === 'de'
              ? 'Dry-Run: Antwort nicht live gesendet'
              : 'Dry-run: reply not sent live'
            : lang === 'de'
              ? 'An eBay Inquiry gesendet'
              : 'Sent to eBay inquiry'
        )
      }
    } catch (err) {
      toast.error(err?.message || 'Send failed')
      refresh()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="premium-card space-y-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-slate-100">
              {lang === 'de' ? 'Kundenservice' : 'Customer service'}
            </p>
            <p className="text-[11px] text-slate-500">
              {lang === 'de'
                ? 'Inquiries sync · manuelle Fälle · KI-Entwurf · Freigabe vor Senden. Keine erfundenen Tracking-/Erstattungsversprechen.'
                : 'Inquiry sync · manual cases · AI draft · approve before send. No invented tracking/refund promises.'}
            </p>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={onSync}
            className="flex min-h-[40px] items-center gap-2 rounded-xl bg-brand-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            Sync Inquiries
          </button>
        </div>
        {dryRun ? (
          <p className="text-[10px] text-amber-300/90">
            Dry-Run aktiv — Inquiry-Replies werden nicht live an eBay gesendet.
          </p>
        ) : null}
      </div>

      <div className="premium-card space-y-2 p-4">
        <p className="text-xs font-semibold text-slate-300">
          {lang === 'de' ? 'Manueller Fall' : 'Manual case'}
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            placeholder={lang === 'de' ? 'Käufer' : 'Buyer'}
            value={manual.buyer}
            onChange={(e) => setManual((m) => ({ ...m, buyer: e.target.value }))}
            className="rounded-lg bg-slate-900/80 px-3 py-2 text-xs"
          />
          <input
            placeholder="Order-ID (optional)"
            value={manual.orderId}
            onChange={(e) => setManual((m) => ({ ...m, orderId: e.target.value }))}
            className="rounded-lg bg-slate-900/80 px-3 py-2 text-xs"
          />
        </div>
        <textarea
          rows={3}
          placeholder={lang === 'de' ? 'Käufer-Nachricht einfügen…' : 'Paste buyer message…'}
          value={manual.message}
          onChange={(e) => setManual((m) => ({ ...m, message: e.target.value }))}
          className="w-full rounded-lg bg-slate-900/80 px-3 py-2 text-xs"
        />
        <button
          type="button"
          onClick={onAddManual}
          className="flex min-h-[36px] items-center gap-2 rounded-xl bg-slate-800 px-3 py-2 text-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          {lang === 'de' ? 'Fall anlegen' : 'Add case'}
        </button>
      </div>

      {!state.cases.length ? (
        <div className="premium-card p-6 text-center text-sm text-slate-500">
          {lang === 'de'
            ? 'Keine CS-Fälle — syncen oder Nachricht einfügen.'
            : 'No CS cases — sync or paste a message.'}
        </div>
      ) : (
        <div className="space-y-3">
          {state.cases.map((cs) => (
            <div key={cs.id} className="premium-card space-y-2 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-slate-100">
                    {cs.buyer || '—'} · {cs.subject || cs.inquiryId || cs.id}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {cs.status} · {cs.source}
                    {cs.orderId ? ` · order ${cs.orderId}` : ''}
                    {cs.inquiryId ? ` · inquiry ${cs.inquiryId}` : ''}
                    {cs.dry_run_sent ? ' · dry-sent' : ''}
                  </p>
                </div>
                {cs.status === CS_STATUS.ESCALATE ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] text-rose-200">
                    <AlertTriangle className="h-3 w-3" /> Escalate
                  </span>
                ) : null}
              </div>

              <p className="whitespace-pre-wrap rounded-lg bg-slate-900/60 p-2 text-[11px] text-slate-300">
                {cs.buyerMessage}
              </p>

              <textarea
                rows={4}
                value={cs.draftReply || ''}
                onChange={(e) => {
                  setState(
                    updateCsCase(cs.id, {
                      draftReply: e.target.value,
                      human_approved: false,
                      status: CS_STATUS.DRAFT_READY,
                    })
                  )
                }}
                placeholder={lang === 'de' ? 'Antwort-Entwurf…' : 'Draft reply…'}
                className="w-full rounded-lg bg-slate-900/80 px-3 py-2 text-xs"
              />

              {cs.lastError ? (
                <p className="text-[10px] text-amber-300/90">{cs.lastError}</p>
              ) : null}

              <div className="flex flex-wrap gap-1.5">
                <select
                  className="rounded-lg bg-slate-900/80 px-2 py-1.5 text-[10px] text-slate-300"
                  defaultValue=""
                  onChange={(e) => {
                    const tid = e.target.value
                    if (!tid) return
                    setState(applyCsTemplate(cs.id, tid, lang))
                    e.target.value = ''
                    toast.success(lang === 'de' ? 'Template geladen' : 'Template applied')
                  }}
                >
                  <option value="">
                    {lang === 'de' ? 'Template…' : 'Template…'}
                  </option>
                  {CS_REPLY_TEMPLATES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {lang === 'de' ? t.labelDe : t.labelEn}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onDraft(cs.id)}
                  className="flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1.5 text-[10px]"
                >
                  <Sparkles className="h-3 w-3" />
                  {lang === 'de' ? 'KI-Entwurf' : 'AI draft'}
                </button>
                <button
                  type="button"
                  onClick={() => onApprove(cs.id)}
                  disabled={!cs.draftReply?.trim()}
                  className="flex items-center gap-1 rounded-lg bg-emerald-800 px-2.5 py-1.5 text-[10px] text-white disabled:opacity-40"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  {lang === 'de' ? 'Freigeben' : 'Approve'}
                </button>
                <button
                  type="button"
                  disabled={busy || !cs.human_approved}
                  onClick={() => onSend(cs)}
                  className="flex items-center gap-1 rounded-lg bg-brand-600 px-2.5 py-1.5 text-[10px] font-semibold text-white disabled:opacity-40"
                >
                  <Send className="h-3 w-3" />
                  {cs.inquiryId
                    ? lang === 'de'
                      ? 'Senden'
                      : 'Send'
                    : lang === 'de'
                      ? 'Kopieren'
                      : 'Copy'}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (cs.draftReply) {
                      await copyTextToClipboard(cs.draftReply)
                      toast.success(lang === 'de' ? 'Kopiert' : 'Copied')
                    }
                  }}
                  className="flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1.5 text-[10px]"
                >
                  <Copy className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setState(removeCsCase(cs.id))
                  }}
                  className="flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1.5 text-[10px] text-rose-300"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
