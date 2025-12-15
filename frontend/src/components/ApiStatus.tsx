import { useState, useEffect } from 'react'
import { checkApiHealth } from '../services/api'

interface ApiStatusProps {
  showDetails?: boolean
}

export default function ApiStatus({ showDetails = false }: ApiStatusProps) {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  useEffect(() => {
    checkStatus()
    // Check every 30 seconds
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const checkStatus = async () => {
    setStatus('checking')
    const result = await checkApiHealth()
    setStatus(result.healthy ? 'online' : 'offline')
    setLastChecked(new Date())
  }

  const statusConfig = {
    checking: {
      color: 'bg-yellow-500',
      text: 'Checking...',
      icon: '🔄'
    },
    online: {
      color: 'bg-emerald-500',
      text: 'API Online',
      icon: '✅'
    },
    offline: {
      color: 'bg-red-500',
      text: 'API Offline',
      icon: '❌'
    }
  }

  const config = statusConfig[status]

  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${config.color} animate-pulse`} />
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {config.icon} {config.text}
      </span>
      {showDetails && lastChecked && (
        <span className="text-xs text-gray-400 dark:text-gray-500">
          (Last: {lastChecked.toLocaleTimeString()})
        </span>
      )}
    </div>
  )
}
