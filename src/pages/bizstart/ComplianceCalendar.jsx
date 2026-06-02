import { buildTaxCalendar } from '@/lib/bizstart/taxCalendar'
import appApi from '@/lib/appApi'
import { toast } from 'sonner'

export default function ComplianceCalendar({ formData, onNext }) {
  const items = buildTaxCalendar(formData)

  const markFiled = async (item) => {
    await appApi.entities.TaxDeadline.create({
      deadline_name: item.name,
      due_date: item.dueDate,
      is_filed: true,
      category: item.category,
    })
    toast.success('Marked as filed')
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold">Tax compliance calendar</h2>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={`premium-card p-4 ${item.urgent ? 'border-red-500/40' : ''}`}
          >
            <div className="flex justify-between gap-2">
              <p className="font-medium text-sm">{item.name}</p>
              <span className={`text-xs ${item.daysUntil < 0 ? 'text-red-400' : item.urgent ? 'text-amber-400' : 'text-slate-500'}`}>
                {item.daysUntil < 0 ? 'Overdue' : `${item.daysUntil} days`}
              </span>
            </div>
            <p className="text-xs text-slate-500">Due: {item.dueDate}</p>
            {item.prepare && <p className="mt-1 text-xs text-slate-400">{item.prepare}</p>}
            <button
              type="button"
              onClick={() => markFiled(item)}
              className="mt-2 text-xs text-brand-400"
            >
              Mark as filed
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onNext('home')} className="mt-4 w-full text-sm text-brand-400">
        ← Back to BizStart home
      </button>
    </div>
  )
}
