'use client'

import { useState, useEffect } from 'react'

interface StripeDataCardProps {
  connectionId: string
}

interface StripeStats {
  customers: number
  payments: number
  subscriptions: number
  totalRevenue: number
}

export default function StripeDataCard({ connectionId }: StripeDataCardProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<StripeStats | null>(null)

  useEffect(() => {
    fetchStripeData()
  }, [connectionId])

  const fetchStripeData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch data from all endpoints in parallel
      const [customersRes, paymentsRes, subscriptionsRes] = await Promise.all([
        fetch(`/api/nango/stripe/customers?connectionId=${connectionId}`),
        fetch(`/api/nango/stripe/payments?connectionId=${connectionId}`),
        fetch(`/api/nango/stripe/subscriptions?connectionId=${connectionId}`),
      ])

      const customersData = await customersRes.json()
      const paymentsData = await paymentsRes.json()
      const subscriptionsData = await subscriptionsRes.json()

      setStats({
        customers: customersData.count || 0,
        payments: paymentsData.count || 0,
        subscriptions: subscriptionsData.count || 0,
        totalRevenue: paymentsData.totalRevenue || 0,
      })
    } catch (err: any) {
      setError(err.message || 'Failed to fetch Stripe data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
        <div className="animate-pulse">
          <div className="h-6 bg-purple-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-purple-100 rounded"></div>
            <div className="h-16 bg-purple-100 rounded"></div>
            <div className="h-16 bg-purple-100 rounded"></div>
            <div className="h-16 bg-purple-100 rounded"></div>
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
          <h3 className="text-lg font-semibold text-red-900">Error Loading Stripe Data</h3>
        </div>
        <p className="text-red-700 text-sm">{error}</p>
        <button
          onClick={fetchStripeData}
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
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-3xl">💳</span>
          <h3 className="text-xl font-bold text-purple-900">Stripe Analytics</h3>
        </div>
        <button
          onClick={fetchStripeData}
          className="text-sm text-purple-600 hover:text-purple-800 font-medium"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-3xl font-bold text-purple-600 mb-1">
            {stats.customers.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Customers</div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-3xl font-bold text-green-600 mb-1">
            ${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {stats.payments.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Payments</div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-3xl font-bold text-orange-600 mb-1">
            {stats.subscriptions.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Subscriptions</div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-purple-100 rounded-lg">
        <p className="text-xs text-purple-800">
          💡 <strong>Tip:</strong> Data syncs automatically every 30-60 minutes. 
          Click refresh to fetch the latest synced data.
        </p>
      </div>
    </div>
  )
}

