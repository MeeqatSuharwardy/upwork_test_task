'use client'

import { useState, useEffect } from 'react'
import Nango from '@nangohq/frontend'
import ConnectionCard from '@/components/ConnectionCard'
import IntegrationsList from '@/components/IntegrationsList'

export default function Home() {
  const [nango, setNango] = useState<Nango | null>(null)
  const [connections, setConnections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize Nango
    const publicKey = process.env.NEXT_PUBLIC_NANGO_PUBLIC_KEY
    if (publicKey) {
      const nangoInstance = new Nango({ publicKey })
      setNango(nangoInstance)
    }
    
    loadConnections()
  }, [])

  const loadConnections = async () => {
    try {
      const response = await fetch('/api/nango/connections')
      if (response.ok) {
        const data = await response.json()
        setConnections(data.connections || [])
      }
    } catch (error) {
      console.error('Failed to load connections:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (integrationId: string) => {
    if (!nango) {
      alert('Nango is not initialized. Please check your configuration.')
      return
    }

    try {
      // Generate a unique connection ID for this user
      const connectionId = `user-${Date.now()}`
      
      // Trigger OAuth flow
      const result = await nango.auth(integrationId, connectionId)
      
      if (result) {
        alert(`Successfully connected ${integrationId}!`)
        await loadConnections()
      }
    } catch (error: any) {
      console.error('Connection error:', error)
      alert(`Failed to connect: ${error.message || 'Unknown error'}`)
    }
  }

  const handleDisconnect = async (connectionId: string) => {
    try {
      const response = await fetch(`/api/nango/connections/${connectionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Connection removed successfully!')
        await loadConnections()
      } else {
        alert('Failed to remove connection')
      }
    } catch (error) {
      console.error('Disconnect error:', error)
      alert('Failed to remove connection')
    }
  }

  const handleTestConnection = async (connectionId: string, integrationId: string) => {
    try {
      const response = await fetch(
        `/api/nango/test?connectionId=${connectionId}&integrationId=${integrationId}`
      )
      const data = await response.json()

      if (response.ok) {
        alert(`Test successful! Data: ${JSON.stringify(data, null, 2)}`)
      } else {
        alert(`Test failed: ${data.error}`)
      }
    } catch (error) {
      console.error('Test error:', error)
      alert('Failed to test connection')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Nango Integration Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete implementation of Nango in Next.js with OAuth integrations.
            Connect to GitHub and Slack to see it in action!
          </p>
        </div>

        {/* Current Connections */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Your Connections
          </h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
            </div>
          ) : connections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connections.map((connection) => (
                <ConnectionCard
                  key={connection.connection_id}
                  connection={connection}
                  onDisconnect={handleDisconnect}
                  onTest={handleTestConnection}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600 text-lg">
                No connections yet. Add an integration below to get started!
              </p>
            </div>
          )}
        </div>

        {/* Available Integrations */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Available Integrations
          </h2>
          <IntegrationsList onConnect={handleConnect} />
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            How It Works
          </h3>
          <div className="prose max-w-none">
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Click "Connect" on any integration below</li>
              <li>Authorize the application through OAuth</li>
              <li>View your active connections above</li>
              <li>Test the connection to fetch data from the API</li>
              <li>Disconnect when you're done</li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  )
}

