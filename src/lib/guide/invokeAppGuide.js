import appApi from '@/lib/appApi'
import { ensureLlmStatus, isAnthropicConfigured } from '@/lib/anthropic'
import { APP_GUIDE_MODULES, formatModule, getModuleGuide } from './appModules'

function buildKnowledgeBase(language) {
  return APP_GUIDE_MODULES.map((m) => {
    const f = formatModule(m, language)
    return `## ${f.title}
${f.tagline}
${f.summary}
Features: ${f.features.join('; ')}
Workflow: ${f.workflow.join(' → ')}
Links: ${f.connects.join(', ')}`
  }).join('\n\n')
}

function demoAnswer(question, moduleId, language) {
  const en = language === 'en'
  const mod = moduleId ? getModuleGuide(moduleId) : null
  if (mod) {
    const f = formatModule(mod, language)
    return en
      ? `**${f.title}** — ${f.tagline}\n\n${f.summary}\n\n**Typical flow:**\n${f.workflow.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n**Tip:** ${f.tips[0]}\n\n_Your question:_ “${question}” — for deeper tax/legal advice use Lawyer AI with a licensed advisor for binding answers.`
      : `**${f.title}** — ${f.tagline}\n\n${f.summary}\n\n**Typischer Ablauf:**\n${f.workflow.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n**Tipp:** ${f.tips[0]}\n\n_Ihre Frage:_ „${question}“ — für verbindliche Steuer-/Rechtsfragen zusätzlich Steuerberater oder Anwalt hinzuziehen.`
  }
  return en
    ? `ScanLogic Business Suite has six areas: **Docs** (scan/OCR), **Tax Vault** (receipts & tax), **DocDraft** (invoices), **Contracts** (templates & sign), **Lawyer AI** (Herr Müller coach), **Settings** (sync/PWA). Pick a section in the guide for details.\n\nYour question: “${question}”`
    : `Die ScanLogic Business Suite hat sechs Bereiche: **Docs** (Scan/OCR), **Tax Vault** (Belege & Steuer), **DocDraft** (Rechnungen), **Contracts** (Verträge & Signatur), **Lawyer AI** (Herr Müller), **Settings** (Sync/PWA). Wählen Sie im Guide einen Bereich für Details.\n\nIhre Frage: „${question}“`
}

export async function askAppGuide({ question, moduleId = null, language = 'de' }) {
  const q = (question || '').trim()
  if (!q) return ''

  await ensureLlmStatus()
  if (!isAnthropicConfigured()) {
    return demoAnswer(q, moduleId, language)
  }

  const kb = buildKnowledgeBase(language)
  const focus = moduleId ? getModuleGuide(moduleId) : null
  const focusLine = focus
    ? language === 'en'
      ? `User is currently viewing: ${focus.titleEn}.`
      : `Nutzer ist gerade in: ${focus.titleDe}.`
    : ''

  const system =
    language === 'en'
      ? `You are the ScanLogic in-app guide — clear, friendly, senior product expert. Explain ONLY how this app works (not generic business advice). Use the knowledge base. Short paragraphs, bullets when helpful. Mention related tabs when relevant.`
      : `Du bist der ScanLogic In-App-Guide — klar, freundlich, erfahrener Produkt-Experte. Erkläre NUR wie diese App funktioniert (keine allgemeine Unternehmensberatung). Nutze die Wissensbasis. Kurze Absätze, Aufzählungen wenn sinnvoll. Verweise auf verwandte Tabs.`

  const prompt = `${system}

KNOWLEDGE BASE:
${kb}

${focusLine}

USER QUESTION: ${q}

Answer in ${language === 'en' ? 'English' : 'German'}:`

  const res = await appApi.integrations.Core.InvokeLLM({ prompt })
  return res?.text || res?.content || demoAnswer(q, moduleId, language)
}
