import { NextResponse } from 'next/server'
import { getNangoServer } from '@/lib/nango-server'

/**
 * GET /api/nango/twilio/messages
 * 
 * Retrieves synced Twilio messages for a given connection
 * 
 * Query Parameters:
 * - connectionId: The ID of the Twilio connection
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
    
    // Get synced message records from Nango
    const records = await nango.getRecords({
      providerConfigKey: 'twilio',
      connectionId,
      model: 'TwilioMessage',
    })

    // Calculate message stats
    const stats = {
      total: records.length,
      sent: records.filter((msg: any) => msg.direction === 'outbound-api').length,
      received: records.filter((msg: any) => msg.direction === 'inbound').length,
      delivered: records.filter((msg: any) => msg.status === 'delivered').length,
      failed: records.filter((msg: any) => msg.status === 'failed').length,
    }

    return NextResponse.json({
      success: true,
      data: records,
      count: records.length,
      stats,
    })
  } catch (error: any) {
    console.error('Failed to fetch Twilio messages:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch messages',
        details: error.response?.data || null
      },
      { status: 500 }
    )
  }
}

