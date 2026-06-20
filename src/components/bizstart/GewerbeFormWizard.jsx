import { useRef, useEffect, useState, useCallback } from 'react'
import { CheckCircle2, Camera, Upload, Eraser } from 'lucide-react'
import { toast } from 'sonner'
import {
  GEWERBE_WIZARD_STEPS,
  REGISTRATION_TYPES,
  GEWERBE_LEGAL_FORMS,
  GENDER_OPTIONS,
  BUSINESS_TYPE_OPTIONS,
  defaultGewerbeLegalForm,
  labelForOption,
} from '@/lib/bizstart/gewerbeConfig'
import { gewerbeT, gewerbeStepLabel, gewerbeProgressPct } from '@/lib/bizstart/gewerbeI18n'

function FormLabel({ children, hint }) {
  return (
    <div className="mb-1.5">
      <span className="block text-sm font-semibold text-slate-800">{children}</span>
      {hint && <span className="mt-0.5 block text-xs text-slate-500">{hint}</span>}
    </div>
  )
}

function FormInput({ className = '', ...props }) {
  return (
    <input
      {...props}
      className={`w-full border-0 border-b-2 border-slate-300 bg-slate-100/80 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white ${className}`}
    />
  )
}

function FormTextarea({ className = '', ...props }) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-lg border border-slate-200 bg-slate-100/80 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white ${className}`}
    />
  )
}

function FormSelect({ children, className = '', ...props }) {
  return (
    <select
      {...props}
      className={`w-full border-0 border-b-2 border-slate-300 bg-slate-100/80 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white ${className}`}
    >
      {children}
    </select>
  )
}

function RadioRow({ name, value, checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 has-[:checked]:border-indigo-400 has-[:checked]:bg-indigo-50">
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="accent-indigo-600" />
      {label}
    </label>
  )
}

function ReviewRow({ label, value }) {
  if (!value && value !== 0) return null
  return (
    <div className="grid grid-cols-[8.5rem_1fr] gap-3 border-b border-slate-100 py-2 text-sm last:border-0">
      <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</span>
      <span className="font-medium text-slate-800">{value}</span>
    </div>
  )
}

function InlineSignature({ value, onChange, lang }) {
  const canvasRef = useRef(null)
  const drawing = useRef(false)

  const getPoint = useCallback((e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.strokeStyle = '#1e293b'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const start = (e) => {
    e.preventDefault()
    drawing.current = true
    const ctx = canvasRef.current.getContext('2d')
    const p = getPoint(e)
    ctx.beginPath()
    ctx.moveTo(p.x, p.y)
  }

  const move = (e) => {
    if (!drawing.current) return
    e.preventDefault()
    const ctx = canvasRef.current.getContext('2d')
    const p = getPoint(e)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
  }

  const end = () => {
    if (!drawing.current) return
    drawing.current = false
    onChange?.(canvasRef.current.toDataURL('image/jpeg', 0.72))
  }

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    onChange?.('')
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={640}
        height={160}
        className="w-full touch-none rounded-lg border-2 border-slate-200 bg-slate-50"
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
      />
      <button type="button" onClick={clear} className="mt-2 flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800">
        <Eraser className="h-3 w-3" /> {gewerbeT(lang, 'deleteSignature')}
      </button>
      {value && <p className="mt-1 text-xs text-emerald-600">✓ {lang === 'de' ? 'Unterschrift erfasst' : 'Signature captured'}</p>}
    </div>
  )
}

function StepSidebar({ lang, stepIndex, onJump }) {
  return (
    <nav className="hidden shrink-0 md:block md:w-52 lg:w-56">
      <ol className="space-y-1">
        {GEWERBE_WIZARD_STEPS.map((id, i) => {
          const done = i < stepIndex
          const current = i === stepIndex
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => i < stepIndex && onJump(i)}
                disabled={i > stepIndex}
                className={`flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left transition ${
                  current ? 'bg-indigo-50' : done ? 'hover:bg-slate-50' : 'opacity-50'
                }`}
              >
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    done
                      ? 'bg-emerald-500 text-white'
                      : current
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span>
                  <span className={`block text-xs font-semibold ${current ? 'text-indigo-900' : 'text-slate-700'}`}>
                    {gewerbeStepLabel(id, lang)}
                  </span>
                  {current && (
                    <span className="mt-0.5 inline-block rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700">
                      {gewerbeT(lang, 'current')}
                    </span>
                  )}
                  {done && (
                    <span className="mt-0.5 inline-block rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                      {gewerbeT(lang, 'done')}
                    </span>
                  )}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default function GewerbeFormWizard({ lang, formData, onChange, onComplete }) {
  const savedStep = Math.min(formData.gewerbeWizardStep || 0, GEWERBE_WIZARD_STEPS.length - 1)
  const [stepIndex, setStepIndex] = useState(savedStep)
  const stepId = GEWERBE_WIZARD_STEPS[stepIndex]

  const patch = (fields) => {
    onChange({ ...fields, gewerbeWizardStep: stepIndex })
  }

  const f = (key, val) => patch({ [key]: val })

  const syncBirthDate = (d, m, y) => {
    if (d && m && y) patch({ birthDay: d, birthMonth: m, birthYear: y, dateOfBirth: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}` })
    else patch({ birthDay: d, birthMonth: m, birthYear: y })
  }

  const syncStartDate = (d, m, y) => {
    if (d && m && y) {
      patch({
        startDay: d,
        startMonth: m,
        startYear: y,
        businessStartDate: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      })
    } else patch({ startDay: d, startMonth: m, startYear: y })
  }

  const initDefaults = () => {
    const updates = {}
    if (!formData.gewerbeRegistrationType) updates.gewerbeRegistrationType = 'neuanmeldung'
    if (!formData.gewerbeLegalForm) updates.gewerbeLegalForm = defaultGewerbeLegalForm(formData.businessStructure)
    if (formData.businessAddressSameAsHome === undefined) updates.businessAddressSameAsHome = true
    if (formData.isSecondaryOccupation === undefined) updates.isSecondaryOccupation = false
    if (Object.keys(updates).length) onChange(updates)
  }

  useEffect(() => {
    initDefaults()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const canProceed = () => {
    switch (stepId) {
      case 'registrationType':
        return !!formData.gewerbeRegistrationType
      case 'owner':
        return !!formData.gewerbeLegalForm
      case 'personal':
        return !!(formData.lastName && formData.firstName && formData.nationality)
      case 'address':
        return !!(formData.street && formData.plz && formData.city && formData.email)
      case 'business':
        return !!(formData.businessActivityDescription && formData.businessTypeCategory)
      case 'summary':
        return !!(formData.gewerbePrivacyAccepted && formData.gewerbeDraftAccepted && formData.gewerbeSignatureDataUrl)
      default:
        return true
    }
  }

  const next = () => {
    if (!canProceed()) {
      toast.error(gewerbeT(lang, 'requiredHint'))
      return
    }
    patch({ gewerbeWizardStep: stepIndex })
    if (stepIndex < GEWERBE_WIZARD_STEPS.length - 1) {
      setStepIndex(stepIndex + 1)
      toast.success(gewerbeT(lang, 'formSaved'))
    } else {
      onChange({ gewerbeFormComplete: true, gewerbeWizardStep: stepIndex })
      onComplete?.()
      toast.success(gewerbeT(lang, 'formComplete'))
    }
  }

  const back = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1)
  }

  const handleIdFile = (file) => {
    if (!file || file.size > 10 * 1024 * 1024) return
    const reader = new FileReader()
    reader.onload = () => f('gewerbeIdDocumentUrl', reader.result)
    reader.readAsDataURL(file)
  }

  const renderStep = () => {
    switch (stepId) {
      case 'registrationType':
        return (
          <div className="space-y-3">
            <FormSelect
              value={formData.gewerbeRegistrationType || 'neuanmeldung'}
              onChange={(e) => f('gewerbeRegistrationType', e.target.value)}
            >
              {REGISTRATION_TYPES.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {lang === 'de' ? opt.de : opt.en}
                </option>
              ))}
            </FormSelect>
          </div>
        )

      case 'owner':
        return (
          <div className="space-y-3">
            <FormLabel hint={gewerbeT(lang, 'legalFormHint')}>{gewerbeT(lang, 'legalForm')}</FormLabel>
            <FormSelect
              value={formData.gewerbeLegalForm || defaultGewerbeLegalForm(formData.businessStructure)}
              onChange={(e) => f('gewerbeLegalForm', e.target.value)}
            >
              <option value="">{gewerbeT(lang, 'selectPlaceholder')}</option>
              {GEWERBE_LEGAL_FORMS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {lang === 'de' ? opt.de : opt.en}
                </option>
              ))}
            </FormSelect>
          </div>
        )

      case 'personal':
        return (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FormLabel>{gewerbeT(lang, 'lastName')}</FormLabel>
                <FormInput value={formData.lastName || ''} onChange={(e) => f('lastName', e.target.value)} />
              </div>
              <div>
                <FormLabel hint={gewerbeT(lang, 'firstNamesHint')}>{gewerbeT(lang, 'firstNames')}</FormLabel>
                <FormInput value={formData.firstName || ''} onChange={(e) => f('firstName', e.target.value)} />
              </div>
            </div>
            <div>
              <FormLabel hint={gewerbeT(lang, 'genderHint')}>{gewerbeT(lang, 'gender')}</FormLabel>
              <div className="grid gap-2 sm:grid-cols-2">
                {GENDER_OPTIONS.map((opt) => (
                  <RadioRow
                    key={opt.id}
                    name="gender"
                    value={opt.id}
                    checked={formData.gender === opt.id}
                    onChange={() => f('gender', opt.id)}
                    label={lang === 'de' ? opt.de : opt.en}
                  />
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={!!formData.birthNameDiffers}
                onChange={(e) => f('birthNameDiffers', e.target.checked)}
                className="accent-indigo-600"
              />
              {gewerbeT(lang, 'birthNameDiffers')}
            </label>
            {formData.birthNameDiffers && (
              <div>
                <FormLabel>{gewerbeT(lang, 'birthName')}</FormLabel>
                <FormInput value={formData.birthName || ''} onChange={(e) => f('birthName', e.target.value)} />
              </div>
            )}
            <div>
              <FormLabel hint={gewerbeT(lang, 'birthDateHint')}>{gewerbeT(lang, 'birthDate')}</FormLabel>
              <div className="grid grid-cols-3 gap-3">
                <FormInput
                  placeholder={gewerbeT(lang, 'birthDay')}
                  inputMode="numeric"
                  value={formData.birthDay || ''}
                  onChange={(e) => syncBirthDate(e.target.value, formData.birthMonth, formData.birthYear)}
                />
                <FormInput
                  placeholder={gewerbeT(lang, 'birthMonth')}
                  inputMode="numeric"
                  value={formData.birthMonth || ''}
                  onChange={(e) => syncBirthDate(formData.birthDay, e.target.value, formData.birthYear)}
                />
                <FormInput
                  placeholder={gewerbeT(lang, 'birthYear')}
                  inputMode="numeric"
                  value={formData.birthYear || ''}
                  onChange={(e) => syncBirthDate(formData.birthDay, formData.birthMonth, e.target.value)}
                />
              </div>
            </div>
            <div>
              <FormLabel hint={gewerbeT(lang, 'birthplaceHint')}>{gewerbeT(lang, 'birthplace')}</FormLabel>
              <FormInput value={formData.birthplace || ''} onChange={(e) => f('birthplace', e.target.value)} />
            </div>
            <div>
              <FormLabel>{gewerbeT(lang, 'nationality')}</FormLabel>
              <FormInput value={formData.nationality || ''} onChange={(e) => f('nationality', e.target.value)} />
            </div>
          </div>
        )

      case 'address':
        return (
          <div className="space-y-5">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-indigo-700">{gewerbeT(lang, 'residentialAddress')}</p>
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-[1fr_5rem]">
                  <div>
                    <FormLabel>{gewerbeT(lang, 'street')}</FormLabel>
                    <FormInput value={formData.street || ''} onChange={(e) => f('street', e.target.value)} />
                  </div>
                  <div>
                    <FormLabel>{gewerbeT(lang, 'houseNumber')}</FormLabel>
                    <FormInput value={formData.houseNumber || ''} onChange={(e) => f('houseNumber', e.target.value)} />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-[6rem_1fr]">
                  <div>
                    <FormLabel>{gewerbeT(lang, 'plz')}</FormLabel>
                    <FormInput value={formData.plz || ''} onChange={(e) => f('plz', e.target.value)} />
                  </div>
                  <div>
                    <FormLabel>{gewerbeT(lang, 'city')}</FormLabel>
                    <FormInput value={formData.city || ''} onChange={(e) => f('city', e.target.value)} />
                  </div>
                </div>
                <div>
                  <FormLabel hint={gewerbeT(lang, 'mobileHint')}>{gewerbeT(lang, 'mobile')}</FormLabel>
                  <FormInput value={formData.phone || ''} onChange={(e) => f('phone', e.target.value)} />
                </div>
                <div>
                  <FormLabel hint={gewerbeT(lang, 'emailHint')}>{gewerbeT(lang, 'email')}</FormLabel>
                  <FormInput type="email" value={formData.email || ''} onChange={(e) => f('email', e.target.value)} />
                </div>
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-indigo-700">{gewerbeT(lang, 'businessPremises')}</p>
              <label className="mb-3 flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.businessAddressSameAsHome !== false}
                  onChange={(e) => f('businessAddressSameAsHome', e.target.checked)}
                  className="accent-indigo-600"
                />
                {gewerbeT(lang, 'businessSameAsHome')}
              </label>
              {!formData.businessAddressSameAsHome && (
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-[1fr_5rem]">
                    <FormInput
                      placeholder={gewerbeT(lang, 'street')}
                      value={formData.businessStreet || ''}
                      onChange={(e) => f('businessStreet', e.target.value)}
                    />
                    <FormInput
                      placeholder={gewerbeT(lang, 'houseNumber')}
                      value={formData.businessHouseNumber || ''}
                      onChange={(e) => f('businessHouseNumber', e.target.value)}
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-[6rem_1fr]">
                    <FormInput placeholder={gewerbeT(lang, 'plz')} value={formData.businessPlz || ''} onChange={(e) => f('businessPlz', e.target.value)} />
                    <FormInput placeholder={gewerbeT(lang, 'city')} value={formData.businessCity || ''} onChange={(e) => f('businessCity', e.target.value)} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 'business':
        return (
          <div className="space-y-4">
            <div>
              <FormLabel hint={gewerbeT(lang, 'registeredActivityHint')}>{gewerbeT(lang, 'registeredActivity')}</FormLabel>
              <FormTextarea
                rows={4}
                value={formData.businessActivityDescription || ''}
                onChange={(e) => f('businessActivityDescription', e.target.value)}
              />
              <p className="mt-1 text-xs text-slate-500">{gewerbeT(lang, 'registeredActivityFoot')}</p>
            </div>
            <div>
              <FormLabel hint={gewerbeT(lang, 'secondaryOccupationHint')}>{gewerbeT(lang, 'secondaryOccupation')}</FormLabel>
              <div className="flex gap-3">
                <RadioRow
                  name="secondary"
                  value="yes"
                  checked={formData.isSecondaryOccupation === true}
                  onChange={() => f('isSecondaryOccupation', true)}
                  label={gewerbeT(lang, 'yes')}
                />
                <RadioRow
                  name="secondary"
                  value="no"
                  checked={formData.isSecondaryOccupation === false}
                  onChange={() => f('isSecondaryOccupation', false)}
                  label={gewerbeT(lang, 'no')}
                />
              </div>
            </div>
            <div>
              <FormLabel hint={gewerbeT(lang, 'startDateHint')}>{gewerbeT(lang, 'startDate')}</FormLabel>
              <div className="grid grid-cols-3 gap-3">
                <FormInput
                  placeholder={gewerbeT(lang, 'birthDay')}
                  value={formData.startDay || ''}
                  onChange={(e) => syncStartDate(e.target.value, formData.startMonth, formData.startYear)}
                />
                <FormInput
                  placeholder={gewerbeT(lang, 'birthMonth')}
                  value={formData.startMonth || ''}
                  onChange={(e) => syncStartDate(formData.startDay, e.target.value, formData.startYear)}
                />
                <FormInput
                  placeholder={gewerbeT(lang, 'birthYear')}
                  value={formData.startYear || ''}
                  onChange={(e) => syncStartDate(formData.startDay, formData.startMonth, e.target.value)}
                />
              </div>
            </div>
            <div>
              <FormLabel>{gewerbeT(lang, 'businessType')}</FormLabel>
              <div className="grid gap-2 sm:grid-cols-2">
                {BUSINESS_TYPE_OPTIONS.map((opt) => (
                  <RadioRow
                    key={opt.id}
                    name="bizType"
                    value={opt.id}
                    checked={formData.businessTypeCategory === opt.id}
                    onChange={() => f('businessTypeCategory', opt.id)}
                    label={lang === 'de' ? opt.de : opt.en}
                  />
                ))}
              </div>
            </div>
            <div>
              <FormLabel hint={gewerbeT(lang, 'employeesHint')}>{gewerbeT(lang, 'employees')}</FormLabel>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <span className="mb-1 block text-xs text-slate-500">{gewerbeT(lang, 'fullTime')}</span>
                  <FormInput
                    type="number"
                    min="0"
                    value={formData.employeesFullTime ?? ''}
                    onChange={(e) => f('employeesFullTime', e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
                <div>
                  <span className="mb-1 block text-xs text-slate-500">{gewerbeT(lang, 'partTime')}</span>
                  <FormInput
                    type="number"
                    min="0"
                    value={formData.employeesPartTime ?? ''}
                    onChange={(e) => f('employeesPartTime', e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 'summary': {
        const bizAddr = formData.businessAddressSameAsHome !== false
          ? `${formData.street || ''} ${formData.houseNumber || ''}, ${formData.plz || ''} ${formData.city || ''}`.trim()
          : `${formData.businessStreet || ''} ${formData.businessHouseNumber || ''}, ${formData.businessPlz || ''} ${formData.businessCity || ''}`.trim()
        return (
          <div className="space-y-5">
            <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-indigo-700">{gewerbeT(lang, 'reviewSection')}</p>
              <ReviewRow label={gewerbeT(lang, 'regTypeTitle')} value={labelForOption(REGISTRATION_TYPES, formData.gewerbeRegistrationType, lang)} />
              <ReviewRow label={gewerbeT(lang, 'legalForm')} value={labelForOption(GEWERBE_LEGAL_FORMS, formData.gewerbeLegalForm, lang)} />
              <ReviewRow label={gewerbeT(lang, 'lastName')} value={`${formData.firstName || ''} ${formData.lastName || ''}`.trim()} />
              <ReviewRow label={gewerbeT(lang, 'birthDate')} value={formData.dateOfBirth} />
              <ReviewRow label={gewerbeT(lang, 'nationality')} value={formData.nationality} />
              <ReviewRow
                label={gewerbeT(lang, 'residentialAddress')}
                value={`${formData.street || ''} ${formData.houseNumber || ''}, ${formData.plz || ''} ${formData.city || ''}`.trim()}
              />
              <ReviewRow label={gewerbeT(lang, 'email')} value={formData.email} />
              <ReviewRow label={gewerbeT(lang, 'businessPremises')} value={bizAddr} />
              <ReviewRow label={gewerbeT(lang, 'registeredActivity')} value={formData.businessActivityDescription} />
              <ReviewRow label={gewerbeT(lang, 'startDate')} value={formData.businessStartDate} />
              <ReviewRow label={gewerbeT(lang, 'businessType')} value={labelForOption(BUSINESS_TYPE_OPTIONS, formData.businessTypeCategory, lang)} />
            </div>
            <div>
              <FormLabel hint={gewerbeT(lang, 'signatureHint')}>{gewerbeT(lang, 'signature')}</FormLabel>
              <InlineSignature lang={lang} value={formData.gewerbeSignatureDataUrl} onChange={(v) => f('gewerbeSignatureDataUrl', v)} />
            </div>
            <div>
              <FormLabel hint={gewerbeT(lang, 'idDocumentHint')}>{gewerbeT(lang, 'idDocument')}</FormLabel>
              <label className="mb-2 flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={!!formData.gewerbeIdLater}
                  onChange={(e) => f('gewerbeIdLater', e.target.checked)}
                  className="accent-indigo-600"
                />
                {gewerbeT(lang, 'idLater')}
              </label>
              {!formData.gewerbeIdLater && (
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 py-6 text-sm text-slate-600 hover:border-indigo-400 hover:bg-indigo-50/50">
                    <Camera className="h-5 w-5" />
                    {gewerbeT(lang, 'takePhoto')}
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleIdFile(e.target.files?.[0])} />
                  </label>
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 py-6 text-sm text-slate-600 hover:border-indigo-400 hover:bg-indigo-50/50">
                    <Upload className="h-5 w-5" />
                    {gewerbeT(lang, 'uploadFile')}
                    <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleIdFile(e.target.files?.[0])} />
                  </label>
                </div>
              )}
              <p className="mt-2 text-xs text-slate-500">{gewerbeT(lang, 'fileTypes')}</p>
            </div>
            <div className="space-y-2">
              <label className="flex items-start gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={!!formData.gewerbePrivacyAccepted}
                  onChange={(e) => f('gewerbePrivacyAccepted', e.target.checked)}
                  className="mt-0.5 accent-indigo-600"
                />
                {gewerbeT(lang, 'privacyAccept')}
              </label>
              <label className="flex items-start gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={!!formData.gewerbeDraftAccepted}
                  onChange={(e) => f('gewerbeDraftAccepted', e.target.checked)}
                  className="mt-0.5 accent-indigo-600"
                />
                {gewerbeT(lang, 'draftAccept')}
              </label>
            </div>
          </div>
        )
      }

      default:
        return null
    }
  }

  const stepTitleKey = {
    registrationType: 'regTypeTitle',
    owner: 'ownerTitle',
    personal: 'personalTitle',
    address: 'addressTitle',
    business: 'businessTitle',
    summary: 'summaryTitle',
  }[stepId]

  const stepDescKey = {
    registrationType: 'regTypeDesc',
    owner: 'ownerDesc',
    personal: 'personalDesc',
    address: 'addressDesc',
    business: 'businessDesc',
    summary: 'summaryDesc',
  }[stepId]

  return (
    <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-white shadow-xl">
      <div className="bg-gradient-to-br from-indigo-950 via-indigo-800 to-indigo-600 px-4 py-4 text-white sm:px-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-lg" aria-hidden>
              🇩🇪
            </span>
            <div>
              <h2 className="text-base font-bold leading-tight sm:text-lg">{gewerbeT(lang, 'wizardTitle')}</h2>
              <p className="text-xs opacity-90">{gewerbeT(lang, 'wizardSubtitle')}</p>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold">
            {gewerbeProgressPct(stepIndex)}%
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
          <div className="h-full bg-white transition-all duration-300" style={{ width: `${gewerbeProgressPct(stepIndex)}%` }} />
        </div>
        <p className="mt-1 text-[10px] opacity-80">{gewerbeT(lang, 'applicationProgress')}</p>
      </div>

      <div className="flex flex-col gap-4 p-4 md:flex-row md:gap-6 md:p-5">
        <StepSidebar lang={lang} stepIndex={stepIndex} onJump={setStepIndex} />

        <div className="min-w-0 flex-1">
          <div className="mb-4 md:hidden">
            <div className="flex gap-1">
              {GEWERBE_WIZARD_STEPS.map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full ${i <= stepIndex ? 'bg-indigo-500' : 'bg-slate-200'}`} />
              ))}
            </div>
            <p className="mt-2 text-xs font-medium text-indigo-700">
              {stepIndex + 1}/{GEWERBE_WIZARD_STEPS.length} — {gewerbeStepLabel(stepId, lang)}
            </p>
          </div>

          <h3 className="text-lg font-bold text-indigo-950">{gewerbeT(lang, stepTitleKey)}</h3>
          <p className="mb-4 text-sm text-slate-600">{gewerbeT(lang, stepDescKey)}</p>

          {renderStep()}

          <div className="mt-6 flex gap-3 border-t border-slate-100 pt-4">
            {stepIndex > 0 && (
              <button
                type="button"
                onClick={back}
                className="flex-1 rounded-xl border-2 border-indigo-600 bg-white py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
              >
                {gewerbeT(lang, 'back')}
              </button>
            )}
            <button
              type="button"
              onClick={next}
              className="btn-primary flex-1 rounded-xl py-3 text-sm font-semibold"
            >
              {stepIndex < GEWERBE_WIZARD_STEPS.length - 1 ? gewerbeT(lang, 'further') : gewerbeT(lang, 'completeForm')}
            </button>
          </div>
        </div>
      </div>

      <p className="border-t border-slate-100 bg-indigo-50/50 px-4 py-2 text-center text-[10px] text-indigo-800/80">
        {gewerbeT(lang, 'disclaimer')}
      </p>
    </div>
  )
}
