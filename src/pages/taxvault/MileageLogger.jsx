import { useState, useEffect, useRef } from 'react'
import { Car, Plus, Navigation } from 'lucide-react'
import { toast } from 'sonner'
import appApi from '@/lib/appApi'
import { loadTaxVaultSettings } from '@/lib/taxvault/profile'
import { createGpsTracker } from '@/lib/taxvault/mileageGps'

export default function MileageLogger({ onChanged }) {
  const rate = loadTaxVaultSettings().mileageRatePerKm ?? 0.3
  const [logs, setLogs] = useState([])
  const [gpsKm, setGpsKm] = useState(0)
  const [tracking, setTracking] = useState(false)
  const trackerRef = useRef(null)
  const [form, setForm] = useState({
    trip_date: new Date().toISOString().slice(0, 10),
    start_location: '',
    end_location: '',
    distance_km: '',
  })

  const load = async () => {
    try {
      setLogs(await appApi.entities.MileageLog.list())
    } catch {
      toast.error('Fahrten konnten nicht geladen werden')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    const km = parseFloat(form.distance_km)
    if (!km || km <= 0) {
      toast.error('Gültige Kilometer eingeben')
      return
    }
    try {
      const deductible = km * rate
      await appApi.entities.MileageLog.create({
        ...form,
        distance_km: km,
        rate_per_km: rate,
        deductible_amount: deductible,
        tax_year: new Date().getFullYear(),
      })
      toast.success('Fahrt gespeichert')
      setForm({ ...form, start_location: '', end_location: '', distance_km: '' })
      await load()
      onChanged?.()
    } catch {
      toast.error('Speichern fehlgeschlagen')
    }
  }

  const startGps = () => {
    trackerRef.current = createGpsTracker(
      ({ totalKm }) => setGpsKm(totalKm),
      (msg) => toast.error(msg)
    )
    trackerRef.current.start()
    setTracking(true)
    toast.success('GPS tracking started')
  }

  const stopGps = () => {
    const result = trackerRef.current?.stop()
    setTracking(false)
    if (result?.totalKm) {
      setForm((f) => ({ ...f, distance_km: result.totalKm.toFixed(2) }))
      toast.success(`${result.totalKm.toFixed(2)} km recorded`)
    }
    setGpsKm(0)
  }

  return (
    <div>
      <h3 className="mb-3 font-semibold">Mileage log ({rate} €/km)</h3>
      <div className="mb-3 rounded-xl bg-slate-800/60 p-3">
        <p className="mb-2 text-xs text-slate-400">GPS trip distance</p>
        {tracking ? (
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-brand-300">{gpsKm.toFixed(2)} km</span>
            <button type="button" onClick={stopGps} className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-300">
              Stop GPS
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={startGps}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-brand-500/40 py-2 text-sm"
          >
            <Navigation className="h-4 w-4" /> Start GPS tracking
          </button>
        )}
      </div>
      <form onSubmit={submit} className="mb-4 space-y-2 rounded-xl bg-slate-800/60 p-4">
        <input
          type="date"
          value={form.trip_date}
          onChange={(e) => setForm({ ...form, trip_date: e.target.value })}
          className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm"
        />
        <input
          placeholder="Start"
          value={form.start_location}
          onChange={(e) => setForm({ ...form, start_location: e.target.value })}
          className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm"
        />
        <input
          placeholder="Ziel"
          value={form.end_location}
          onChange={(e) => setForm({ ...form, end_location: e.target.value })}
          className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm"
        />
        <input
          type="number"
          step="0.1"
          placeholder="Kilometer"
          value={form.distance_km}
          onChange={(e) => setForm({ ...form, distance_km: e.target.value })}
          className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm"
        />
        <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2 text-sm font-medium">
          <Plus className="h-4 w-4" /> Fahrt hinzufügen
        </button>
      </form>
      <div className="space-y-2">
        {logs.map((l) => (
          <div key={l.id} className="flex items-center gap-3 rounded-xl bg-slate-800/80 p-3">
            <Car className="h-5 w-5 text-brand-400" />
            <div className="flex-1 text-sm">
              <p>{l.start_location} → {l.end_location}</p>
              <p className="text-slate-500">
                {l.distance_km} km · {l.deductible_amount?.toFixed(2)} €
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
