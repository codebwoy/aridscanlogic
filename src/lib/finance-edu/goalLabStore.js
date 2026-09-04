import { DEFAULT_INPUTS, sanitizeInputs } from './goalLab'

const STORAGE_KEY = 'scanlogic_investment_goal_lab'

export function loadGoalLabInputs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_INPUTS }
    return sanitizeInputs(JSON.parse(raw))
  } catch {
    return { ...DEFAULT_INPUTS }
  }
}

export function saveGoalLabInputs(inputs) {
  const clean = sanitizeInputs(inputs)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clean))
  } catch {
    /* quota / private mode */
  }
  return clean
}

export function resetGoalLabInputs() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_INPUTS }
}
