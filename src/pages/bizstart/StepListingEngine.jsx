import ListingEngineBuilder from '@/components/bizstart/listing/ListingEngineBuilder'

export default function StepListingEngine({ formData, onUpdateForm, onBack }) {
  return (
    <ListingEngineBuilder formData={formData} onUpdateForm={onUpdateForm} onBack={onBack} />
  )
}
