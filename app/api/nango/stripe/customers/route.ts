import { NextResponse } from 'next/server'
import { getNangoServer } from '@/lib/nango-server'

/**
 * GET /api/nango/stripe/customers
 * 
 * Retrieves synced Stripe customers for a given connection
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
    
    // Get synced customer records from Nango
    const records = await nango.getRecords({
      providerConfigKey: 'stripe',
      connectionId,
      model: 'StripeCustomer',
    })

    return NextResponse.json({
      success: true,
      data: records,
      count: records.length,
    })
  } catch (error: any) {
    console.error('Failed to fetch Stripe customers:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch customers',
        details: error.response?.data || null
      },
      { status: 500 }
    )
  }
}

