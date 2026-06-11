import { BRAND_LOGO_SRC } from '@/lib/brand'

export default function BrandLogo({ size = 40, className = '', rounded = 'rounded-xl' }) {
  return (
    <img
      src={BRAND_LOGO_SRC}
      alt=""
      width={size}
      height={size}
      className={`${rounded} object-cover ${className}`}
      aria-hidden
    />
  )
}

export function BrandMark({ title, subtitle, size = 48, className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <BrandLogo size={size} rounded="rounded-2xl" className="shadow-lg shadow-brand-900/30" />
      {(title || subtitle) && (
        <div className="min-w-0">
          {title && <p className="truncate text-lg font-bold text-white">{title}</p>}
          {subtitle && <p className="truncate text-xs text-slate-500">{subtitle}</p>}
        </div>
      )}
    </div>
  )
}
