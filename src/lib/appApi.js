/**
 * App data layer — Supabase Postgres (via /api/db) or localStorage fallback.
 */

import { invokeLLMViaAnthropic, isAnthropicConfigured, ensureLlmStatus } from './anthropic'
import {
  checkDbConnected,
  isDbConnected,
  createRemoteEntityClient,
} from './supabase/remoteStore'

const USER_ID = 'local-user'
const STORAGE_PREFIX = 'scanlogic_entities_'
const LEGACY_PREFIX = 'scanlogic_base44_'

const ENTITY_NAMES = [
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
]

function storageKey(entity) {
  return `${STORAGE_PREFIX}${entity}`
}

function readStore(entity) {
  try {
    let raw = localStorage.getItem(storageKey(entity))
    if (!raw) {
      raw = localStorage.getItem(`${LEGACY_PREFIX}${entity}`)
      if (raw) localStorage.setItem(storageKey(entity), raw)
    }
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

function createLocalEntityClient(entityName) {
  return {
    async list(filter = {}) {
      let items = readStore(entityName)
      Object.entries(filter).forEach(([k, v]) => {
        items = items.filter((item) => item[k] === v)
      })
      return items.sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
    },

    async get(id) {
      return readStore(entityName).find((i) => i.id === id) ?? null
    },

    async create(data) {
      const payload = {
        ...data,
        created_by_id: USER_ID,
        created_date: new Date().toISOString(),
      }
      const item = { id: uid(), ...payload }
      const items = readStore(entityName)
      items.push(item)
      writeStore(entityName, items)
      return item
    },

    async update(id, data) {
      const items = readStore(entityName)
      const idx = items.findIndex((i) => i.id === id)
      if (idx === -1) throw new Error('Record not found')
      items[idx] = { ...items[idx], ...data, updated_date: new Date().toISOString() }
      writeStore(entityName, items)
      return items[idx]
    },

    async delete(id) {
      writeStore(
        entityName,
        readStore(entityName).filter((i) => i.id !== id)
      )
      return { success: true }
    },
  }
}

function createHybridEntityClient(entityName) {
  const local = createLocalEntityClient(entityName)
  const remote = createRemoteEntityClient(entityName)

  return {
    async list(filter = {}) {
      if (isDbConnected()) return remote.list(filter)
      return local.list(filter)
    },
    async get(id) {
      if (isDbConnected()) return remote.get(id)
      return local.get(id)
    },
    async create(data) {
      if (isDbConnected()) return remote.create(data)
      return local.create(data)
    },
    async update(id, data) {
      if (isDbConnected()) return remote.update(id, data)
      return local.update(id, data)
    },
    async delete(id) {
      if (isDbConnected()) return remote.delete(id)
      return local.delete(id)
    },
  }
}

const entities = {}
ENTITY_NAMES.forEach((name) => {
  entities[name] = createHybridEntityClient(name)
})

export async function initAppStorage() {
  return checkDbConnected()
}

async function invokeLLMDemo({ prompt, response_json_schema }) {
  await new Promise((r) => setTimeout(r, 800))
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
        category: 'Office Supplies',
        vat_rate: 19,
      },
    }
  }
  if (
    prompt.includes('Herr Müller') ||
    prompt.includes('MUELLER') ||
    prompt.includes('Executive Summary') ||
    prompt.includes('Rechtsanwalt') ||
    prompt.includes('BizStart')
  ) {
    const { buildMuellerDemoResponse } = await import('./lawyer/demoResponses.js')
    const userLine = prompt.split('\nuser:').pop()?.split('\nassistant:')[0]?.trim() || ''
    return { text: buildMuellerDemoResponse(prompt, userLine) }
  }
  return {
    text: `**Demo mode:** Configure ANTHROPIC_API_KEY in .env for live AI.\n\nYour question: ${prompt.slice(0, 300)}…`,
  }
}

const appApi = {
  entities,
  auth: {
    getCurrentUser() {
      return Promise.resolve({
        id: USER_ID,
        email: 'user@scanlogic.app',
        name: 'ScanLogic User',
      })
    },
  },
  integrations: {
    Core: {
      async InvokeLLM({ prompt, file_urls, response_json_schema }) {
        await ensureLlmStatus()
        if (isAnthropicConfigured()) {
          return invokeLLMViaAnthropic({ prompt, file_urls, response_json_schema })
        }
        return invokeLLMDemo({ prompt, response_json_schema })
      },

      async UploadFile(input) {
        const file = input?.file ?? input
        if (!file) throw new Error('UploadFile requires a File via { file }')
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
      },
    },
  },
}

export default appApi
export { entities, ENTITY_NAMES }
