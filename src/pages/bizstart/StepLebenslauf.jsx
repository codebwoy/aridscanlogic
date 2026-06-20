import LebenslaufBuilder from '@/components/bizstart/lebenslauf/LebenslaufBuilder'

export default function StepLebenslauf({ formData, onUpdateForm, onBack }) {
  return (
    <LebenslaufBuilder
      formData={formData}
      onUpdateForm={onUpdateForm}
      onBack={onBack}
    />
  )
}
