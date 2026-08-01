import TailorCvBuilder from '@/components/bizstart/tailor/TailorCvBuilder'

export default function StepTailorCv({ formData, onUpdateForm, onBack, onNavigate }) {
  return (
    <TailorCvBuilder
      formData={formData}
      onUpdateForm={onUpdateForm}
      onBack={onBack}
      onNavigate={onNavigate}
    />
  )
}
