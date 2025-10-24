import { NextResponse } from 'next/server'
import { getNangoServer } from '@/lib/nango-server'

/**
 * GET /api/nango/twilio/calls
 * 
 * Retrieves synced Twilio call records for a given connection
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
    
    // Get synced call records from Nango
    const records = await nango.getRecords({
      providerConfigKey: 'twilio',
      connectionId,
      model: 'TwilioCall',
    })

    // Calculate call stats
    const totalDuration = records.reduce((sum: number, call: any) => {
      return sum + (call.duration || 0)
    }, 0)

    const stats = {
      total: records.length,
      completed: records.filter((call: any) => call.status === 'completed').length,
      failed: records.filter((call: any) => call.status === 'failed' || call.status === 'no-answer').length,
      inProgress: records.filter((call: any) => call.status === 'in-progress' || call.status === 'ringing').length,
      totalDuration: totalDuration,
      averageDuration: records.length > 0 ? Math.round(totalDuration / records.length) : 0,
    }

    return NextResponse.json({
      success: true,
      data: records,
      count: records.length,
      stats,
    })
  } catch (error: any) {
    console.error('Failed to fetch Twilio calls:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch calls',
        details: error.response?.data || null
      },
      { status: 500 }
    )
  }
}

