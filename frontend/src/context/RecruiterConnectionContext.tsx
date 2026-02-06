import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  disconnectRecruiterConnection,
  subscribeRecruiterConnectionEvents,
  RECRUITER_LAST_CONNECTION_KEY,
} from '../services/api'

const CONNECTION_ID_LENGTH = 24

export type RecruiterConnectionStatus = 'none' | 'connected' | 'invalid'

interface RecruiterConnectionState {
  connectionId: string | null
  companyName: string | null
  status: RecruiterConnectionStatus
}

interface RecruiterConnectionContextValue extends RecruiterConnectionState {
  setConnection: (connectionId: string, companyName: string) => void
  clearConnection: () => void
}

const initialState: RecruiterConnectionState = {
  connectionId: null,
  companyName: null,
  status: 'none',
}

const RecruiterConnectionContext = createContext<RecruiterConnectionContextValue | null>(null)

function loadFromStorage(): { connectionId: string; companyName: string } | null {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(RECRUITER_LAST_CONNECTION_KEY) : null
    if (!raw) return null
    const parsed = JSON.parse(raw) as { connectionId?: string; companyName?: string }
    if (parsed?.connectionId && parsed.connectionId.length === CONNECTION_ID_LENGTH) {
      return { connectionId: parsed.connectionId, companyName: parsed.companyName ?? '' }
    }
    return null
  } catch {
    return null
  }
}

function saveToStorage(connectionId: string, companyName: string) {
  try {
    localStorage.setItem(RECRUITER_LAST_CONNECTION_KEY, JSON.stringify({ connectionId, companyName }))
  } catch {
    // ignore
  }
}

function clearStorage() {
  try {
    localStorage.removeItem(RECRUITER_LAST_CONNECTION_KEY)
  } catch {
    // ignore
  }
}

export function RecruiterConnectionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<RecruiterConnectionState>(() => {
    const stored = loadFromStorage()
    if (stored) {
      return {
        connectionId: stored.connectionId,
        companyName: stored.companyName,
        status: 'connected',
      }
    }
    return initialState
  })

  // Synchronized updates via SSE - no per-user polling; both parties get same events
  useEffect(() => {
    const abort = new AbortController()
    const unsubscribe = subscribeRecruiterConnectionEvents(
      (ev) => {
        if (ev.event === 'connected' && ev.company_name != null) {
          setState(prev => ({
            ...prev,
            companyName: ev.company_name ?? null,
            status: 'connected',
          }))
        } else if (ev.event === 'disconnected') {
          clearStorage()
          setState(initialState)
        }
      },
      abort.signal
    )
    return () => {
      unsubscribe()
      abort.abort()
    }
  }, [])

  const setConnection = useCallback((connectionId: string, companyName: string) => {
    clearStorage()
    saveToStorage(connectionId, companyName)
    setState({
      connectionId,
      companyName,
      status: 'connected',
    })
  }, [])

  const clearConnection = useCallback(() => {
    disconnectRecruiterConnection().catch(() => {})
    clearStorage()
    setState(initialState)
  }, [])

  const value: RecruiterConnectionContextValue = {
    ...state,
    setConnection,
    clearConnection,
  }

  return (
    <RecruiterConnectionContext.Provider value={value}>
      {children}
    </RecruiterConnectionContext.Provider>
  )
}

export function useRecruiterConnection() {
  const ctx = useContext(RecruiterConnectionContext)
  if (!ctx) {
    throw new Error('useRecruiterConnection must be used within RecruiterConnectionProvider')
  }
  return ctx
}

export function useRecruiterConnectionOptional() {
  return useContext(RecruiterConnectionContext)
}
