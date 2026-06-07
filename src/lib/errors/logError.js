/** Log in dev; optional user toast in prod. */
export function logError(context, err, toastFn) {
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, err)
  }
  if (toastFn) toastFn()
}
