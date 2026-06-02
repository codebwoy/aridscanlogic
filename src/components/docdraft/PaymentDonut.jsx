import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#22c55e', '#6366f1', '#ef4444', '#64748b']

export default function PaymentDonut({ statusCounts }) {
  const data = [
    { name: 'Paid', value: statusCounts.paid || 0 },
    { name: 'Pending', value: statusCounts.pending || 0 },
    { name: 'Overdue', value: statusCounts.overdue || 0 },
    { name: 'Draft', value: statusCounts.draft || 0 },
  ].filter((d) => d.value > 0)

  if (!data.length) {
    return (
      <div className="premium-card flex h-40 items-center justify-center text-sm text-slate-500">
        No documents yet
      </div>
    )
  }

  return (
    <div className="premium-card p-3">
      <p className="mb-2 text-center text-xs font-medium text-slate-400">Payment status</p>
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
