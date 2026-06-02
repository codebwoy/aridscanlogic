/** Entity field shapes — stored in browser localStorage via appApi */

export const ENTITY_NAMES = {
  Document: 'Document',
  Folder: 'Folder',
  SavedLawyerMessage: 'SavedLawyerMessage',
  Receipt: 'Receipt',
  MileageLog: 'MileageLog',
  BusinessRegistration: 'BusinessRegistration',
  TaxDeadline: 'TaxDeadline',
  DocDraftDocument: 'DocDraftDocument',
  Contract: 'Contract',
  ContractSigner: 'ContractSigner',
}

export const documentSchema = {
  title: 'string',
  document_type: 'string',
  ocr_text: 'string',
  markdown_result: 'string',
  pages: 'array',
  page_count: 'number',
  status: 'string',
  is_starred: 'boolean',
  folder: 'string',
}

export const folderSchema = {
  name: 'string',
  emoji: 'string',
  color: 'string',
}

export const savedLawyerMessageSchema = {
  conversation_id: 'string',
  message_content: 'string',
  message_title: 'string',
  conversation_title: 'string',
  is_hidden: 'boolean',
  saved_date: 'string',
}

export const receiptSchema = {
  vendor_name: 'string',
  purchase_date: 'date',
  total_amount: 'number',
  vat_amount: 'number',
  currency: 'string',
  category: 'string',
  deductible_amount: 'number',
  tax_year: 'number',
  image_url: 'string',
  expense_type: 'string',
}

export const mileageLogSchema = {
  trip_date: 'date',
  start_location: 'string',
  end_location: 'string',
  distance_km: 'number',
  rate_per_km: 'number',
  deductible_amount: 'number',
  tax_year: 'number',
}

export const businessRegistrationSchema = {
  business_structure: 'string',
  registration_status: 'string',
  gewerbe_status: 'string',
  finanzamt_status: 'string',
  vat_status: 'string',
  steuernummer: 'string',
  ust_id_nr: 'string',
}

export const taxDeadlineSchema = {
  deadline_name: 'string',
  due_date: 'date',
  is_filed: 'boolean',
  category: 'string',
}

export const docDraftDocumentSchema = {
  profile_id: 'string',
  client_id: 'string',
  document_type: 'string',
  document_number: 'string',
  status: 'string',
  issue_date: 'date',
  due_date: 'date',
  currency: 'string',
  line_items: 'array',
  subtotal_net: 'number',
  total_vat: 'number',
  total_gross: 'number',
  notes: 'string',
}

export const contractSchema = {
  title: 'string',
  template_type: 'string',
  status: 'string',
  contract_body: 'object',
  effective_date: 'date',
  signing_order: 'string',
}

export const contractSignerSchema = {
  contract_id: 'string',
  signer_name: 'string',
  signer_email: 'string',
  signing_order_index: 'number',
  signing_status: 'string',
  signature_image_url: 'string',
  signed_at: 'string',
}
