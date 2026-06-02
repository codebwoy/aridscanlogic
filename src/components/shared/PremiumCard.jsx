import { motion } from 'framer-motion'

export default function PremiumCard({
  children,
  className = '',
  onClick,
  gradient = false,
  delay = 0,
}) {
  const Comp = onClick ? motion.button : motion.div
  return (
    <Comp
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={`premium-card w-full text-left ${gradient ? 'premium-card-gradient' : ''} ${className}`}
    >
      {children}
    </Comp>
  )
}
