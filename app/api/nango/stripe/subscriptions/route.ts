import { NextResponse } from 'next/server'
import { getNangoServer } from '@/lib/nango-server'

/**
 * GET /api/nango/stripe/subscriptions
 * 
 * Retrieves synced Stripe subscriptions for a given connection
 * 
 * Query Parameters:
 * - connectionId: The ID of the Stripe connection
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const connectionId = searchParams.get('connectionId')

  if (!connectionId) {
    return NextResponse.json(
      { error: 'connectionId is required' },
      { status: 400 }
    )
  }

  try {
    const nango = getNangoServer()
    
    // Get synced subscription records from Nango
    const records = await nango.getRecords({
      providerConfigKey: 'stripe',
      connectionId,
      model: 'StripeSubscription',
    })

    // Calculate subscription stats
    const stats = {
      total: records.length,
      active: records.filter((sub: any) => sub.status === 'active').length,
      trialing: records.filter((sub: any) => sub.status === 'trialing').length,
      canceled: records.filter((sub: any) => sub.status === 'canceled').length,
      past_due: records.filter((sub: any) => sub.status === 'past_due').length,
    }

    return NextResponse.json({
      success: true,
      data: records,
      count: records.length,
      stats,
    })
  } catch (error: any) {
    console.error('Failed to fetch Stripe subscriptions:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch subscriptions',
        details: error.response?.data || null
      },
      { status: 500 }
    )
  }
}

