/** Append-only credit costs for ProofForge jobs */

export const JOB_CREDIT_COSTS = Object.freeze({
  proofread_pass: 8,
  overview_pass: 4,
  localization_pass: 6,
  apply_finding: 0,
  recheck_section: 3,
})

export function creditCost(jobType) {
  return JOB_CREDIT_COSTS[jobType] ?? 2
}

export function estimateProofreadCredits(sectionCount = 1) {
  const n = Math.max(1, Number(sectionCount) || 1)
  return {
    credits: creditCost('overview_pass') + n * creditCost('proofread_pass'),
    note: 'Personal studio — informational work units only (not billed). LLM API cost is your provider key.',
  }
}
