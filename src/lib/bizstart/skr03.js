/** SKR03 account codes for common expense categories */

export const SKR03_CATEGORIES = [
  { category: 'Büromaterial', code: '4930', vatDefault: 19 },
  { category: 'Software & Lizenzen', code: '4964', vatDefault: 19 },
  { category: 'Reisekosten', code: '4673', vatDefault: 19 },
  { category: 'Bewirtung', code: '4650', vatDefault: 19 },
  { category: 'Telefon & Internet', code: '4920', vatDefault: 19 },
  { category: 'Werbung', code: '4600', vatDefault: 19 },
  { category: 'Miete', code: '4210', vatDefault: 19 },
  { category: 'Lebensmittel (7%)', code: '4300', vatDefault: 7 },
  { category: 'Bücher (7%)', code: '4300', vatDefault: 7 },
  { category: 'EU B2B (0%)', code: '4120', vatDefault: 0 },
]

export function getSkrCode(categoryName) {
  return SKR03_CATEGORIES.find((c) => c.category === categoryName)?.code || '4900'
}
