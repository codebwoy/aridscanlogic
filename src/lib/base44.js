/**
 * Base44 SDK client — CRUD on entities + Core integrations (LLM, file upload).
 * Falls back to localStorage when API credentials are not configured (demo mode).
 */

const API_URL = import.meta.env.VITE_BASE44_API_URL || ''
const APP_ID = import.meta.env.VITE_BASE44_APP_ID || ''
const API_KEY = import.meta.env.VITE_BASE44_API_KEY || ''

const DEMO_USER_ID = 'demo-user-local'
const STORAGE_PREFIX = 'scanlogic_base44_'

function isDemoMode() {
  return !API_URL || !APP_ID || !API_KEY
}

function storageKey(entity, id) {
  return `${STORAGE_PREFIX}${entity}${id ? `_${id}` : ''}`
}

function readStore(entity) {
  try {
    const raw = localStorage.getItem(storageKey(entity))
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeStore(entity, items) {
  localStorage.setItem(storageKey(entity), JSON.stringify(items))
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

async function apiRequest(method, path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-App-Id': APP_ID,
      Authorization: `Bearer ${API_KEY}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || `API ${method} failed: ${res.status}`)
  }
  return res.json()
}

function createEntityClient(entityName) {
  return {
    async list(filter = {}) {
      if (isDemoMode()) {
        let items = readStore(entityName)
        Object.entries(filter).forEach(([k, v]) => {
          items = items.filter((item) => item[k] === v)
        })
        return items.sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
      }
      const qs = new URLSearchParams(filter).toString()
      return apiRequest('GET', `/entities/${entityName}${qs ? `?${qs}` : ''}`)
    },

    async get(id) {
      if (isDemoMode()) {
        return readStore(entityName).find((i) => i.id === id) ?? null
      }
      return apiRequest('GET', `/entities/${entityName}/${id}`)
    },

    async create(data) {
      const payload = {
        ...data,
        created_by_id: DEMO_USER_ID,
        created_date: new Date().toISOString(),
      }
      if (isDemoMode()) {
        const item = { id: uid(), ...payload }
        const items = readStore(entityName)
        items.push(item)
        writeStore(entityName, items)
        return item
      }
      return apiRequest('POST', `/entities/${entityName}`, payload)
    },

    async update(id, data) {
      if (isDemoMode()) {
        const items = readStore(entityName)
        const idx = items.findIndex((i) => i.id === id)
        if (idx === -1) throw new Error('Record not found')
        items[idx] = { ...items[idx], ...data, updated_date: new Date().toISOString() }
        writeStore(entityName, items)
        return items[idx]
      }
      return apiRequest('PATCH', `/entities/${entityName}/${id}`, data)
    },

    async delete(id) {
      if (isDemoMode()) {
        writeStore(
          entityName,
          readStore(entityName).filter((i) => i.id !== id)
        )
        return { success: true }
      }
      return apiRequest('DELETE', `/entities/${entityName}/${id}`)
    },
  }
}

const entities = {}
;[
  'Document',
  'Folder',
  'SavedLawyerMessage',
  'Receipt',
  'MileageLog',
  'BusinessProfile',
  'BusinessRegistration',
  'TaxDeadline',
  'DocDraftDocument',
  'Contract',
  'ContractSigner',
].forEach((name) => {
  entities[name] = createEntityClient(name)
})

export const base44 = {
  entities,
  auth: {
    getCurrentUser() {
      if (isDemoMode()) {
        return Promise.resolve({ id: DEMO_USER_ID, email: 'demo@scanlogic.app', name: 'Demo User' })
      }
      return apiRequest('GET', '/auth/me')
    },
  },
  integrations: {
    Core: {
      async InvokeLLM({ prompt, file_urls, response_json_schema }) {
        if (isDemoMode()) {
          await new Promise((r) => setTimeout(r, 1200))
          if (response_json_schema) {
            const props = response_json_schema?.properties || {}
            if (props.ocr_text && props.document_type) {
              return {
                parsed: {
                  ocr_text: 'Demo OCR: Rechnung Nr. 2024-001\nMuster GmbH\nBetrag: 119,00 EUR',
                  document_type: 'Invoice',
                  title: 'Rechnung Muster GmbH',
                  markdown_result:
                    '# Rechnung Muster GmbH\n\n**Nr.** 2024-001\n\n| Position | Betrag |\n|----------|--------|\n| Leistung | 100,00 € |\n| MwSt 19% | 19,00 € |\n| **Gesamt** | **119,00 €** |',
                },
              }
            }
            return {
              text: 'Demo LLM response',
              parsed: {
                vendor_name: 'Demo GmbH',
                total_amount: 119.0,
                vat_amount: 19.0,
                category: 'Büromaterial',
                vat_rate: 19,
              },
            }
          }
          if (
            prompt.includes('Herr Müller') ||
            prompt.includes('MUELLER') ||
            prompt.includes('Executive Summary') ||
            prompt.includes('Rechtsanwalt')
          ) {
            const { buildMuellerDemoResponse } = await import('./lawyer/demoResponses.js')
            const userLine = prompt.split('\nuser:').pop()?.split('\nassistant:')[0]?.trim() || ''
            return { text: buildMuellerDemoResponse(prompt, userLine) }
          }
          return {
            text: `**Herr Müller (Demo):**\n\nZu Ihrer Frage: ${prompt.slice(0, 200)}...\n\n*Dies ist eine Demo-Antwort. Konfigurieren Sie VITE_BASE44_* für Live-KI.*`,
          }
        }
        return apiRequest('POST', '/integrations/core/invoke-llm', {
          prompt,
          file_urls,
          response_json_schema,
        })
      },

      async UploadFile(input) {
        const file = input?.file ?? input
        if (!file) throw new Error('UploadFile requires a File via { file }')
        if (isDemoMode()) {
          return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () =>
              resolve({
                file_url: reader.result,
                file_name: file.name,
              })
            reader.onerror = reject
            reader.readAsDataURL(file)
          })
        }
        const form = new FormData()
        form.append('file', file)
        const res = await fetch(`${API_URL}/integrations/core/upload`, {
          method: 'POST',
          headers: {
            'X-App-Id': APP_ID,
            Authorization: `Bearer ${API_KEY}`,
          },
          body: form,
        })
        if (!res.ok) throw new Error('Upload failed')
        return res.json()
      },
    },
  },
}

export default base44
