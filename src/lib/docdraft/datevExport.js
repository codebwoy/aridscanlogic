import { downloadTextFile } from '@/lib/pdfUtils'
import { loadDocuments, getActiveProfile } from './store'

/** Simplified DATEV-compatible CSV (Buchungsstapel-style columns) */
export function exportDatevCsv(documents, profile) {
  const header =
    'Umsatz;Soll/Haben;WKZ;Konto;Gegenkonto;Belegdatum;Belegfeld1;Buchungstext;BU-Schlüssel'
  const rows = documents
    .filter((d) => d.document_type === 'invoice' && d.status !== 'draft')
    .map((d) => {
      const date = (d.issue_date || '').replace(/-/g, '')
      const amount = (d.total_gross || 0).toFixed(2).replace('.', ',')
      return [
        amount,
        'H',
        'EUR',
        '8400',
        '1200',
        date,
        d.document_number || '',
        `${d.client_name || 'Kunde'} ${profile?.company_name || ''}`.slice(0, 60),
        d.is_kleinunternehmer ? '40' : '9',
      ].join(';')
    })
  downloadTextFile(
    [header, ...rows].join('\n'),
    `DATEV_Export_${new Date().toISOString().slice(0, 10)}.csv`
  )
}

export async function exportDocumentsReportCsv() {
  const profile = getActiveProfile()
  const docs = profile ? await loadDocuments(profile.id) : []
  const header = 'number,type,client,issue_date,due_date,net,vat,gross,status,paid'
  const rows = docs.map((d) =>
    [
      d.document_number,
      d.document_type,
      d.client_name,
      d.issue_date,
      d.due_date,
      d.subtotal_net,
      d.total_vat,
      d.total_gross,
      d.status,
      d.amount_paid,
    ].join(',')
  )
  downloadTextFile([header, ...rows].join('\n'), `docdraft_report_${Date.now()}.csv`)
}
