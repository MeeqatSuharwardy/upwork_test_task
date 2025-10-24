import { NextResponse } from 'next/server'
import { getNangoServer } from '@/lib/nango-server'

/**
 * GET /api/nango/twilio/phone-numbers
 * 
 * Retrieves synced Twilio phone numbers for a given connection
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
    
    // Get synced phone number records from Nango
    const records = await nango.getRecords({
      providerConfigKey: 'twilio',
      connectionId,
      model: 'TwilioPhoneNumber',
    })

    // Calculate phone number capabilities
    const stats = {
      total: records.length,
      voiceEnabled: records.filter((num: any) => num.capabilities?.voice).length,
      smsEnabled: records.filter((num: any) => num.capabilities?.sms).length,
      mmsEnabled: records.filter((num: any) => num.capabilities?.mms).length,
      faxEnabled: records.filter((num: any) => num.capabilities?.fax).length,
    }

    return NextResponse.json({
      success: true,
      data: records,
      count: records.length,
      stats,
    })
  } catch (error: any) {
    console.error('Failed to fetch Twilio phone numbers:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch phone numbers',
        details: error.response?.data || null
      },
      { status: 500 }
    )
  }
}

