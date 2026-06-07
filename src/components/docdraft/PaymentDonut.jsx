import { lazy, Suspense } from 'react'

const PaymentDonutChart = lazy(() => import('./PaymentDonutChart.jsx'))

export default function PaymentDonut(props) {
  return (
    <Suspense
      fallback={
        <div className="premium-card flex h-40 animate-pulse items-center justify-center bg-slate-800/40" />
      }
    >
      <PaymentDonutChart {...props} />
    </Suspense>
  )
}
