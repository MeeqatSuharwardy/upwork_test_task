'use client'

import { useState, useEffect } from 'react'

interface TwilioDataCardProps {
  connectionId: string
}

interface TwilioStats {
  messages: {
    total: number
    sent: number
    received: number
    delivered: number
    failed: number
  }
  calls: {
    total: number
    completed: number
    failed: number
    totalDuration: number
    averageDuration: number
  }
  phoneNumbers: {
    total: number
    voiceEnabled: number
    smsEnabled: number
  }
}

export default function TwilioDataCard({ connectionId }: TwilioDataCardProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<TwilioStats | null>(null)

  useEffect(() => {
    fetchTwilioData()
  }, [connectionId])

  const fetchTwilioData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch data from all endpoints in parallel
      const [messagesRes, callsRes, numbersRes] = await Promise.all([
        fetch(`/api/nango/twilio/messages?connectionId=${connectionId}`),
        fetch(`/api/nango/twilio/calls?connectionId=${connectionId}`),
        fetch(`/api/nango/twilio/phone-numbers?connectionId=${connectionId}`),
      ])

      const messagesData = await messagesRes.json()
      const callsData = await callsRes.json()
      const numbersData = await numbersRes.json()

      setStats({
        messages: messagesData.stats || {
          total: 0,
          sent: 0,
          received: 0,
          delivered: 0,
          failed: 0,
        },
        calls: callsData.stats || {
          total: 0,
          completed: 0,
          failed: 0,
          totalDuration: 0,
          averageDuration: 0,
        },
        phoneNumbers: numbersData.stats || {
          total: 0,
          voiceEnabled: 0,
          smsEnabled: 0,
        },
      })
    } catch (err: any) {
      setError(err.message || 'Failed to fetch Twilio data')
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-6 border border-red-200">
        <div className="animate-pulse">
          <div className="h-6 bg-red-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="h-20 bg-red-100 rounded"></div>
            <div className="h-20 bg-red-100 rounded"></div>
            <div className="h-20 bg-red-100 rounded"></div>
            <div className="h-20 bg-red-100 rounded"></div>
            <div className="h-20 bg-red-100 rounded"></div>
            <div className="h-20 bg-red-100 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-lg p-6 border border-red-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">❌</span>
          <h3 className="text-lg font-semibold text-red-900">Error Loading Twilio Data</h3>
        </div>
        <p className="text-red-700 text-sm">{error}</p>
        <button
          onClick={fetchTwilioData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-6 border border-red-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-3xl">📱</span>
          <h3 className="text-xl font-bold text-red-900">Twilio Analytics</h3>
        </div>
        <button
          onClick={fetchTwilioData}
          className="text-sm text-red-600 hover:text-red-800 font-medium"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Messages Section */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-red-800 mb-3 flex items-center gap-2">
          <span>💬</span> Messages
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-2xl font-bold text-red-600">
              {stats.messages.total.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Total Messages</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">
              {stats.messages.sent.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Sent</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {stats.messages.delivered.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Delivered</div>
          </div>
        </div>
      </div>

      {/* Calls Section */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-red-800 mb-3 flex items-center gap-2">
          <span>📞</span> Calls
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-2xl font-bold text-red-600">
              {stats.calls.total.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Total Calls</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {stats.calls.completed.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-xl font-bold text-purple-600">
              {formatDuration(stats.calls.averageDuration)}
            </div>
            <div className="text-xs text-gray-600">Avg Duration</div>
          </div>
        </div>
      </div>

      {/* Phone Numbers Section */}
      <div>
        <h4 className="text-sm font-semibold text-red-800 mb-3 flex items-center gap-2">
          <span>☎️</span> Phone Numbers
        </h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-2xl font-bold text-red-600">
              {stats.phoneNumbers.total}
            </div>
            <div className="text-xs text-gray-600">Total Numbers</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">
              {stats.phoneNumbers.voiceEnabled}
            </div>
            <div className="text-xs text-gray-600">Voice Enabled</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {stats.phoneNumbers.smsEnabled}
            </div>
            <div className="text-xs text-gray-600">SMS Enabled</div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-red-100 rounded-lg">
        <p className="text-xs text-red-800">
          💡 <strong>Tip:</strong> Data syncs automatically every 15-60 minutes. 
          Click refresh to fetch the latest synced data.
        </p>
      </div>
    </div>
  )
}

