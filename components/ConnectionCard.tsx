'use client'

import { useState } from 'react'

interface ConnectionCardProps {
  connection: {
    connection_id: string
    provider_config_key: string
    created_at: string
    metadata?: any
  }
  onDisconnect: (connectionId: string) => void
  onTest: (connectionId: string, integrationId: string) => void
}

export default function ConnectionCard({ 
  connection, 
  onDisconnect, 
  onTest 
}: ConnectionCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleTest = async () => {
    setIsLoading(true)
    try {
      await onTest(connection.connection_id, connection.provider_config_key)
    } finally {
      setIsLoading(false)
    }
  }

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'github':
        return '🔗'
      case 'slack':
        return '💬'
      default:
        return '🔌'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <span className="text-4xl mr-3">
            {getProviderIcon(connection.provider_config_key)}
          </span>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 capitalize">
              {connection.provider_config_key}
            </h3>
            <p className="text-sm text-gray-500">
              Connected: {new Date(connection.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Connection ID:</span>{' '}
          <code className="bg-gray-100 px-2 py-1 rounded text-xs">
            {connection.connection_id}
          </code>
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleTest}
          disabled={isLoading}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Testing...' : 'Test Connection'}
        </button>
        <button
          onClick={() => onDisconnect(connection.connection_id)}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Disconnect
        </button>
      </div>
    </div>
  )
}

