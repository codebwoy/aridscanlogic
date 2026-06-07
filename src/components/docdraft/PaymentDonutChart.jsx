import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#22c55e', '#6366f1', '#ef4444', '#64748b']

export default function PaymentDonutChart({ statusCounts }) {
  const data = [
    { name: 'Bezahlt', value: statusCounts.paid || 0 },
    { name: 'Offen', value: statusCounts.pending || 0 },
    { name: 'Überfällig', value: statusCounts.overdue || 0 },
    { name: 'Entwurf', value: statusCounts.draft || 0 },
  ].filter((d) => d.value > 0)

  if (!data.length) {
    return (
      <div className="premium-card flex h-40 items-center justify-center text-sm text-slate-400">
        Noch keine Dokumente
      </div>
    )
  }

  return (
    <div className="premium-card p-3">
      <p className="mb-2 text-center text-xs font-medium text-slate-400">Zahlungsstatus</p>
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={2}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
