import {
  Briefcase,
  Monitor,
  Plane,
  Utensils,
  Megaphone,
  Scale,
  Building2,
  GraduationCap,
  Shield,
  Landmark,
  Package,
} from 'lucide-react'

export const PRESET_CATEGORIES = [
  { id: 'office', name: 'Office Supplies', color: '#6366f1', icon: Briefcase, budget: 150 },
  { id: 'equipment', name: 'Equipment & Hardware', color: '#8b5cf6', icon: Monitor, budget: 500 },
  { id: 'software', name: 'Software & Subscriptions', color: '#3b82f6', icon: Package, budget: 200 },
  { id: 'travel', name: 'Travel & Transport', color: '#06b6d4', icon: Plane, budget: 400 },
  { id: 'food', name: 'Food & Entertainment', color: '#f59e0b', icon: Utensils, budget: 300 },
  { id: 'marketing', name: 'Marketing & Advertising', color: '#ec4899', icon: Megaphone, budget: 250 },
  { id: 'professional', name: 'Professional Services', color: '#64748b', icon: Scale, budget: 500 },
  { id: 'rent', name: 'Rent & Utilities', color: '#14b8a6', icon: Building2, budget: 800 },
  { id: 'education', name: 'Education & Training', color: '#22c55e', icon: GraduationCap, budget: 200 },
  { id: 'insurance', name: 'Health & Insurance', color: '#ef4444', icon: Shield, budget: 300 },
  { id: 'finance', name: 'Bank & Finance', color: '#a855f7', icon: Landmark, budget: 100 },
  { id: 'other', name: 'Other Business Expense', color: '#94a3b8', icon: Briefcase, budget: 0 },
]

const CUSTOM_KEY = 'scanlogic_tv_custom_categories'
const BUDGET_KEY = 'scanlogic_tv_category_budgets'

export function loadBudgetOverrides() {
  try {
    return JSON.parse(localStorage.getItem(BUDGET_KEY) || '{}')
  } catch {
    return {}
  }
}

export function setCategoryBudget(categoryName, monthlyBudget) {
  const o = loadBudgetOverrides()
  o[categoryName] = monthlyBudget
  localStorage.setItem(BUDGET_KEY, JSON.stringify(o))
}

export function loadCustomCategories() {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveCustomCategory(cat) {
  const list = loadCustomCategories()
  const item = { ...cat, id: cat.id || `custom-${Date.now()}`, isCustom: true }
  list.push(item)
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(list))
  return item
}

export function updateCustomCategory(id, patch) {
  const list = loadCustomCategories().map((c) => (c.id === id ? { ...c, ...patch } : c))
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(list))
  return list
}

export function deleteCustomCategory(id) {
  const list = loadCustomCategories().filter((c) => c.id !== id)
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(list))
  return list
}

export function getAllCategories() {
  const overrides = loadBudgetOverrides()
  const presets = PRESET_CATEGORIES.map((c) => ({
    ...c,
    budget: overrides[c.name] !== undefined ? overrides[c.name] : c.budget,
  }))
  return [...presets, ...loadCustomCategories()]
}

export function getCategoryByName(name) {
  return getAllCategories().find((c) => c.name === name) || PRESET_CATEGORIES[11]
}

export function getCategorySpend(receipts, categoryName) {
  return receipts
    .filter((r) => r.category === categoryName)
    .reduce((s, r) => s + (r.total_amount || 0), 0)
}

export function isOverBudget(receipts, category) {
  if (!category.budget) return false
  return getCategorySpend(receipts, category.name) > category.budget
}
