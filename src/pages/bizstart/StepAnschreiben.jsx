import AnschreibenBuilder from '@/components/bizstart/anschreiben/AnschreibenBuilder'

export default function StepAnschreiben({ formData, onUpdateForm, onBack, onNavigate }) {
  return (
    <AnschreibenBuilder
      formData={formData}
      onUpdateForm={onUpdateForm}
      onBack={onBack}
      onNavigate={onNavigate}
    />
  )
}
