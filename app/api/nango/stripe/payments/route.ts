import { NextResponse } from 'next/server'
import { getNangoServer } from '@/lib/nango-server'

/**
 * GET /api/nango/stripe/payments
 * 
 * Retrieves synced Stripe payment intents for a given connection
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
    
    // Get synced payment records from Nango
    const records = await nango.getRecords({
      providerConfigKey: 'stripe',
      connectionId,
      model: 'StripePayment',
    })

    // Calculate total revenue
    const totalRevenue = records.reduce((sum: number, payment: any) => {
      if (payment.status === 'succeeded') {
        return sum + payment.amount
      }
      return sum
    }, 0)

    return NextResponse.json({
      success: true,
      data: records,
      count: records.length,
      totalRevenue: totalRevenue / 100, // Convert from cents to dollars
    })
  } catch (error: any) {
    console.error('Failed to fetch Stripe payments:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch payments',
        details: error.response?.data || null
      },
      { status: 500 }
    )
  }
}

