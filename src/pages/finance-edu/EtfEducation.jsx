import FinanceCourse from './FinanceCourse'
import { ETF_CHAPTERS, ETF_COURSE } from '@/lib/finance-edu/curriculum'

/** @deprecated Prefer FinanceEduHub — kept for direct ETF entry. */
export default function EtfEducation({ onExit }) {
  return (
    <FinanceCourse
      course={ETF_COURSE}
      chapters={ETF_CHAPTERS}
      onBack={onExit}
      backLabel="Tax Vault"
    />
  )
}
