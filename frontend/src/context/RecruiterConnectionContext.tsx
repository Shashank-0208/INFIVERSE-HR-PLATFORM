import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { getClientByConnectionId } from '../services/api'
import { RECRUITER_LAST_CONNECTION_KEY } from '../services/api'

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

const REVALIDATE_INTERVAL_MS = 60 * 60 * 1000 // 1 hour

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
  const revalidateTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const revalidate = useCallback(async (connectionId: string) => {
    try {
      const client = await getClientByConnectionId(connectionId)
      if (client?.company_name != null) {
        setState(prev => ({
          ...prev,
          companyName: client.company_name,
          status: 'connected',
        }))
        saveToStorage(connectionId, client.company_name)
      } else {
        clearStorage()
        setState(prev => ({
          connectionId: prev.connectionId,
          companyName: null,
          status: 'invalid',
        }))
      }
    } catch {
      clearStorage()
      setState(prev => ({
        connectionId: prev.connectionId,
        companyName: null,
        status: 'invalid',
      }))
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
    if (revalidateTimerRef.current) {
      clearInterval(revalidateTimerRef.current)
      revalidateTimerRef.current = null
    }
    revalidateTimerRef.current = setInterval(() => revalidate(connectionId), REVALIDATE_INTERVAL_MS)
  }, [revalidate])

  const clearConnection = useCallback(() => {
    clearStorage()
    setState(initialState)
    if (revalidateTimerRef.current) {
      clearInterval(revalidateTimerRef.current)
      revalidateTimerRef.current = null
    }
  }, [])

  // Start 1-hour revalidation when we have a connection (e.g. from storage on load)
  useEffect(() => {
    const cid = state.connectionId
    if (cid && !revalidateTimerRef.current) {
      revalidateTimerRef.current = setInterval(() => revalidate(cid), REVALIDATE_INTERVAL_MS)
    }
    return () => {
      if (revalidateTimerRef.current) {
        clearInterval(revalidateTimerRef.current)
        revalidateTimerRef.current = null
      }
    }
  }, [state.connectionId, revalidate])

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
