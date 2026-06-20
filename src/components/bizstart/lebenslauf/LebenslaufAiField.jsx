import ScanLogicAiTextarea from '@/components/bizstart/ScanLogicAiTextarea'

/** Module-level wrapper — must not be defined inside LebenslaufForm (textarea focus loss). */
export default function LebenslaufAiField({
  lang = 'de',
  value,
  onChange,
  onRewrite,
  loading,
  polished,
  rows,
  placeholder,
}) {
  return (
    <ScanLogicAiTextarea
      lang={lang}
      value={value || ''}
      onChange={onChange}
      onRewrite={onRewrite}
      loading={loading}
      polished={polished}
      rows={rows}
      placeholder={placeholder}
    />
  )
}
