/**
 * Owner “My plan moving forward” — Q4 execution checklist.
 * Medium/high content + research + clever AI + build-to-Q4.
 * Deep-links Hub playbooks and desktop studios. Not Amazon Help / not sales forecasts.
 */

export const Q4_FORWARD_PLAN_STORAGE_KEY = 'scanlogic.amazon.q4ForwardPlan.v1'

export const Q4_FORWARD_PLAN_CONFIG = {
  lastVerified: '2026-10-15',
  sourceLabel:
    'Owner Q4 forward plan — medium/high content focus, research-first, clever AI use, build through Dec',
  independenceDisclaimer: {
    en: 'Not affiliated with Amazon. This is your execution checklist, not a sales forecast. Verify niches on Amazon.de and KDP Help before you spend money or upload.',
    de: 'Nicht mit Amazon verbunden. Das ist Ihre Ausführungs-Checkliste, keine Umsatzprognose. Nischen auf Amazon.de und in der KDP-Hilfe prüfen, bevor Sie Geld ausgeben oder hochladen.',
  },
  lead: {
    en: 'My plan moving forward — turn four priorities into weekly actions through Q4.',
    de: 'Mein Plan voraus — vier Prioritäten in wöchentliche Schritte bis Q4 übersetzen.',
  },
  pillars: [
    {
      id: 'medium_high_content',
      title: {
        en: 'Medium + high content books',
        de: 'Medium- + High-Content-Bücher',
      },
      summary: {
        en: 'Prefer substantial manuscripts (guides, workbooks, novels, chapter books) over mass low-content catalogs. Use AuthorForge for non-fiction and NovelForge for fiction; keep StoryForge for illustrated kids / activity series.',
        de: 'Lieber substanzielle Manuskripte (Ratgeber, Workbooks, Romane, Kapitelbücher) als Massen-Low-Content. AuthorForge für Sachbuch, NovelForge für Fiction; StoryForge für illustrierte Kids-/Activity-Serien.',
      },
      actions: [
        {
          id: 'mhc_publish_what',
          label: {
            en: 'Pick a first medium/high-content lane (Publish what + themes)',
            de: 'Erste Medium-/High-Content-Lane wählen (Publish what + Themen)',
          },
          openPlaybook: 'publish-what',
        },
        {
          id: 'mhc_authorforge',
          label: {
            en: 'Draft non-fiction / workbook / parenting guide in AuthorForge',
            de: 'Sachbuch / Workbook / Eltern-Ratgeber in AuthorForge entwerfen',
          },
          launch: 'authorforge',
        },
        {
          id: 'mhc_novelforge',
          label: {
            en: 'Draft adult fiction in NovelForge (if fiction is the lane)',
            de: 'Erwachsenen-Fiction in NovelForge entwerfen (falls Fiction-Lane)',
          },
          launch: 'novelforge',
        },
        {
          id: 'mhc_typesetting',
          label: {
            en: 'Export DOCX/KDP ZIP Kindle Create–ready (Heading 1 + roles) before upload',
            de: 'DOCX/KDP-ZIP Kindle-Create-ready exportieren (Heading 1 + Rollen) vor Upload',
          },
          openPlaybook: 'kdp-plan-to-win',
          note: {
            en: 'Finish typesetting ticks on AuthorForge / NovelForge Publish (Launch readiness).',
            de: 'Typesetting-Häkchen in AuthorForge / NovelForge Publish (Launch readiness) setzen.',
          },
        },
      ],
    },
    {
      id: 'research',
      title: {
        en: 'More research to identify new book types / interests',
        de: 'Mehr Research für neue Buchtypen / Interessen',
      },
      summary: {
        en: 'Research first, write second. Free Amazon.de autocomplete + bestsellers first; optional paid depth (e.g. BookBeam) only after a free pass.',
        de: 'Zuerst Research, dann schreiben. Free Amazon.de-Autocomplete + Bestseller zuerst; optionale bezahlte Tiefe (z. B. BookBeam) erst nach Free-Pass.',
      },
      actions: [
        {
          id: 'res_niche',
          label: {
            en: 'Run the niche research playbook (2–3 focused hours)',
            de: 'Nischen-Research-Playbook durchlaufen (2–3 fokussierte Stunden)',
          },
          openPlaybook: 'kdp-niche-research',
        },
        {
          id: 'res_inspiration',
          label: {
            en: 'Scan Inspiration / study shelf for underserved themes',
            de: 'Inspiration / Study-Shelf auf unterversorgte Themen scannen',
          },
          openPlaybook: 'inspiration',
        },
        {
          id: 'res_bookbeam',
          label: {
            en: 'Optional: deepen keywords/categories with BookBeam (paid estimates ⚠)',
            de: 'Optional: Keywords/Kategorien mit BookBeam vertiefen (bezahlte Schätzungen ⚠)',
          },
          openUrl: 'https://bookbeam.io/',
        },
        {
          id: 'res_german',
          label: {
            en: 'Confirm DE-first / bilingual fit (German-first playbook)',
            de: 'DE-first / bilingual Fit prüfen (German-first-Playbook)',
          },
          openPlaybook: 'german-first',
        },
      ],
    },
    {
      id: 'clever_ai',
      title: {
        en: 'Utilize AI, but be clever with it',
        de: 'KI nutzen — aber clever',
      },
      summary: {
        en: 'AI is a co-author and auditor, not a one-click publisher. Human edit, disclose when required, and ProofForge before KDP Previewer.',
        de: 'KI ist Co-Autor und Auditor, kein One-Click-Publisher. Human Edit, Disclosure wenn nötig, und ProofForge vor dem KDP Previewer.',
      },
      actions: [
        {
          id: 'ai_human_edit',
          label: {
            en: 'Complete a human edit pass (voice, facts, continuity) — AI draft is not final',
            de: 'Human-Edit-Pass (Stimme, Fakten, Kontinuität) — KI-Draft ist nicht final',
          },
        },
        {
          id: 'ai_proofforge',
          label: {
            en: 'Audit the manuscript in ProofForge (accept/reject findings)',
            de: 'Manuskript in ProofForge auditieren (Findings annehmen/ablehnen)',
          },
          launch: 'proofforge',
        },
        {
          id: 'ai_disclosure',
          label: {
            en: 'Plan KDP AI disclosure (generated vs assisted) before upload',
            de: 'KDP-KI-Disclosure (generated vs assisted) vor Upload planen',
          },
          openPlaybook: 'kdp-start',
        },
        {
          id: 'ai_no_mass',
          label: {
            en: 'Avoid mass low-quality AI dumps — one strong title beats ten weak ones',
            de: 'Keine Massen-KI-Dumps — ein starker Titel schlägt zehn schwache',
          },
          openPlaybook: 'publisher-truths',
        },
      ],
    },
    {
      id: 'q4_build',
      title: {
        en: 'Keep building to Q4',
        de: 'Bis Q4 weiterbauen',
      },
      summary: {
        en: 'Month-by-month milestones through December. Tick as you ship — progress over perfection.',
        de: 'Monats-Meilensteine bis Dezember. Abhaken beim Liefern — Fortschritt vor Perfektion.',
      },
      milestones: [
        {
          id: 'q4_oct',
          when: { en: 'October', de: 'Oktober' },
          what: {
            en: 'Niche locked + outline started for one medium/high-content title',
            de: 'Nische fixiert + Outline gestartet für einen Medium-/High-Content-Titel',
          },
        },
        {
          id: 'q4_nov',
          when: { en: 'November', de: 'November' },
          what: {
            en: 'Full draft + ProofForge pass + cover direction decided',
            de: 'Vollständiger Draft + ProofForge-Pass + Cover-Richtung entschieden',
          },
        },
        {
          id: 'q4_dec',
          when: { en: 'December', de: 'Dezember' },
          what: {
            en: 'KDP Previewer clean + manual upload + listing optimize pass',
            de: 'KDP Previewer sauber + manueller Upload + Listing-Optimierung',
          },
        },
      ],
      actions: [
        {
          id: 'q4_plan_to_win',
          label: {
            en: 'Align weekly work with Plan to Win (niche → product → SEO → launch → brand)',
            de: 'Wochenarbeit an Plan to Win ausrichten (Nische → Produkt → SEO → Launch → Marke)',
          },
          openPlaybook: 'kdp-plan-to-win',
        },
        {
          id: 'q4_truths',
          label: {
            en: 'Re-read Publisher truths (ecosystem + 3-year game) once this quarter',
            de: 'Publisher-Wahrheiten (Ökosystem + 3-Jahres-Spiel) einmal dieses Quartal lesen',
          },
          openPlaybook: 'publisher-truths',
        },
      ],
    },
  ],
  relatedHubGuides: [
    { id: 'kdp-niche-research', label: { en: 'Niche research', de: 'Nischen-Research' } },
    { id: 'publish-what', label: { en: 'Publish what', de: 'Was publishen' } },
    { id: 'kdp-plan-to-win', label: { en: 'Plan to Win', de: 'Plan to Win' } },
    { id: 'inspiration', label: { en: 'Inspiration', de: 'Inspiration' } },
  ],
  links: [
    { label: 'KDP', url: 'https://kdp.amazon.com/' },
    { label: 'BookBeam', url: 'https://bookbeam.io/' },
    {
      label: 'Amazon.de bestsellers',
      url: 'https://www.amazon.de/gp/bestsellers/books/',
    },
  ],
}

export function emptyQ4ForwardChecklist() {
  const ticks = {}
  for (const pillar of Q4_FORWARD_PLAN_CONFIG.pillars) {
    for (const a of pillar.actions || []) ticks[a.id] = false
    for (const m of pillar.milestones || []) ticks[m.id] = false
  }
  return { version: 1, ticks, updated_at: null }
}

export function loadQ4ForwardChecklist() {
  try {
    const raw = localStorage.getItem(Q4_FORWARD_PLAN_STORAGE_KEY)
    if (!raw) return emptyQ4ForwardChecklist()
    const parsed = JSON.parse(raw)
    const base = emptyQ4ForwardChecklist()
    return {
      version: 1,
      ticks: { ...base.ticks, ...(parsed.ticks || {}) },
      updated_at: parsed.updated_at || null,
    }
  } catch {
    return emptyQ4ForwardChecklist()
  }
}

export function saveQ4ForwardChecklist(state) {
  const next = {
    version: 1,
    ticks: state.ticks || emptyQ4ForwardChecklist().ticks,
    updated_at: new Date().toISOString(),
  }
  try {
    localStorage.setItem(Q4_FORWARD_PLAN_STORAGE_KEY, JSON.stringify(next))
  } catch {
    /* ignore quota */
  }
  return next
}

export function q4ForwardProgress(state) {
  const ticks = state?.ticks || emptyQ4ForwardChecklist().ticks
  const ids = Object.keys(ticks)
  const checked = ids.filter((id) => ticks[id]).length
  return {
    total: ids.length,
    checked,
    percent: ids.length ? Math.round((checked / ids.length) * 100) : 0,
  }
}
