const KEY = 'contractsafe_audit'

export function logContractEvent(contractId, event) {
  const list = read()
  list.push({
    id: `aud-${Date.now()}`,
    contractId,
    timestamp: new Date().toISOString(),
    ...event,
  })
  localStorage.setItem(KEY, JSON.stringify(list.slice(-500)))
}

export function getContractAudit(contractId) {
  return read().filter((e) => e.contractId === contractId)
}

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}
