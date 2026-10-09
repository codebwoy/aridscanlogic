import { motion } from 'framer-motion'
import { BrandMark } from '@/components/shared/BrandLogo'

/**
 * Mobile + tablet: bottom tab bar · Desktop (lg+): left sidebar.
 * Touch targets ≥44px; labels truncate on narrow phones.
 */
export default function ResponsiveNav({
  tabs,
  activeTab,
  onTabChange,
  variant = 'suite',
  layoutId = 'nav-indicator',
  brandTitle,
  brandSubtitle,
  footerAction,
}) {
  const isScanVault = variant === 'scanvault'
  const activeText = isScanVault ? 'text-[#007AFF]' : 'text-brand-300'
  const activeIcon = isScanVault ? 'text-[#007AFF]' : 'text-brand-400'
  const inactive = 'text-slate-500'
  const indicator = isScanVault ? 'bg-[#007AFF]' : 'bg-brand-500'
  const navBg = isScanVault
    ? 'border-white/10 bg-[#0f0f0f]/95'
    : 'border-slate-700/50 bg-slate-950/90'

  const TabButton = ({ id, label, icon: Icon, horizontal }) => {
    const active = activeTab === id
    return (
      <button
        key={id}
        type="button"
        onClick={() => onTabChange(id)}
        className={
          horizontal
            ? 'relative flex min-h-[48px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-0.5 py-2 text-[10px] font-medium sm:text-xs md:text-[13px]'
            : `relative flex w-full min-h-[48px] items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                active ? (isScanVault ? 'bg-[#007AFF]/15' : 'bg-brand-600/20') : 'hover:bg-white/5'
              }`
        }
        aria-current={active ? 'page' : undefined}
        aria-label={label}
      >
        {horizontal && active && (
          <motion.div
            layoutId={layoutId}
            className={`absolute -top-px left-2 right-2 h-0.5 rounded-full ${indicator} lg:hidden`}
          />
        )}
        {!horizontal && active && (
          <motion.div
            layoutId={`${layoutId}-side`}
            className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full ${indicator}`}
          />
        )}
        <Icon
          className={`h-5 w-5 shrink-0 sm:h-[1.35rem] sm:w-[1.35rem] md:h-6 md:w-6 ${
            active ? activeIcon : inactive
          }`}
        />
        <span
          className={`${horizontal ? 'max-w-full truncate px-0.5 leading-tight' : 'flex-1 truncate'} ${
            active ? activeText : inactive
          }`}
        >
          {label}
        </span>
      </button>
    )
  }

  return (
    <>
      {/* Mobile + tablet: bottom bar */}
      <nav
        className={`fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-xl safe-bottom lg:hidden ${navBg}`}
        aria-label="Main navigation"
      >
        <div className="mx-auto flex w-full max-w-[var(--content-max)] items-stretch justify-around gap-0 px-0.5 pt-1 sm:px-2 md:max-w-3xl md:px-4">
          {tabs.map((tab) => (
            <TabButton key={tab.id} {...tab} horizontal />
          ))}
        </div>
      </nav>

      {/* Desktop: sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 hidden h-dvh w-[var(--sidebar-w)] flex-col border-r backdrop-blur-xl safe-top lg:flex ${navBg}`}
        aria-label="Main navigation"
      >
        <div className="border-b border-inherit px-5 py-5">
          <BrandMark
            title={brandTitle || (isScanVault ? 'ScanVault' : 'ScanLogic')}
            subtitle={brandSubtitle}
            size={44}
          />
        </div>
        <div className="flex flex-1 flex-col gap-1 overflow-y-auto overscroll-contain p-3">
          {tabs.map((tab) => (
            <TabButton key={tab.id} {...tab} horizontal={false} />
          ))}
        </div>
        {footerAction && (
          <div className="border-t border-inherit p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={footerAction.onClick}
              className={`flex min-h-[48px] w-full items-center gap-3 rounded-xl border px-3 py-3 text-left text-sm font-medium transition-colors ${
                isScanVault
                  ? 'border-[#007AFF]/30 bg-[#007AFF]/10 text-slate-100 hover:bg-[#007AFF]/20'
                  : 'border-brand-500/30 bg-brand-600/10 text-brand-200 hover:bg-brand-600/20'
              }`}
            >
              <footerAction.icon
                className={`h-5 w-5 shrink-0 ${isScanVault ? 'text-[#007AFF]' : 'text-brand-400'}`}
              />
              <span className="min-w-0 truncate">{footerAction.label}</span>
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
