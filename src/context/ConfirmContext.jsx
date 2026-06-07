import { createContext, useCallback, useContext, useRef, useState } from 'react'
import ConfirmModal from '@/components/shared/ConfirmModal'

const ConfirmContext = createContext(null)

export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null)
  const resolverRef = useRef(null)

  const confirm = useCallback(({ title, message, confirmLabel = 'Bestätigen', cancelLabel = 'Abbrechen', destructive = false }) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve
      setState({ title, message, confirmLabel, cancelLabel, destructive })
    })
  }, [])

  const close = useCallback((result) => {
    setState(null)
    resolverRef.current?.(result)
    resolverRef.current = null
  }, [])

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {state && (
        <ConfirmModal
          {...state}
          onConfirm={() => close(true)}
          onCancel={() => close(false)}
        />
      )}
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider')
  return ctx.confirm
}
