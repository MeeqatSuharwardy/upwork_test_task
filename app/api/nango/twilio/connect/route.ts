import { NextResponse } from 'next/server'

/**
 * POST /api/nango/twilio/connect
 * 
 * Creates a Twilio connection with API Key authentication
 * 
 * Body:
 * - connectionId: Unique ID for this connection
 * - accountSid: Twilio Account SID
 * - authToken: Twilio Auth Token
 * 
 * For Twilio (API Key auth), you need to configure the integration in Nango Dashboard first:
 * 1. Go to http://localhost:3003/admin
 * 2. Add Twilio integration with ID "twilio"
 * 3. Set auth type to "API_KEY"
 * 4. Then use Nango's frontend SDK or this endpoint to create connections
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { connectionId, accountSid, authToken } = body

    if (!connectionId || !accountSid || !authToken) {
      return NextResponse.json(
        { error: 'connectionId, accountSid, and authToken are required' },
        { status: 400 }
      )
    }

    // For API Key integrations like Twilio, we need to use Nango's API directly
    // or configure it in the dashboard with the credentials
    const nangoHost = process.env.NANGO_HOST_URL || 'http://localhost:3003'
    const nangoSecretKey = process.env.NANGO_SECRET_KEY

    if (!nangoSecretKey) {
      throw new Error('NANGO_SECRET_KEY not configured')
    }

    // Create connection using Nango's REST API
    const response = await fetch(`${nangoHost}/api/v1/connections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${nangoSecretKey}`,
      },
      body: JSON.stringify({
        provider_config_key: 'twilio',
        connection_id: connectionId,
        credentials: {
          type: 'API_KEY',
          api_key: accountSid,
          api_secret: authToken,
        },
        connection_config: {
          account_sid: accountSid,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Failed to create connection')
    }

    return NextResponse.json({
      success: true,
      connection: data,
      message: 'Twilio connection created successfully! You can now trigger syncs.',
    })
  } catch (error: any) {
    console.error('Failed to create Twilio connection:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create connection',
        details: error.response?.data || null,
        hint: 'Make sure Twilio integration is configured in Nango Dashboard with ID "twilio" and auth type "API_KEY"'
      },
      { status: 500 }
    )
  }
}

