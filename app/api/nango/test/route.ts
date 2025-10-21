import { NextRequest, NextResponse } from 'next/server'
import { Nango } from '@nangohq/node'

const nango = new Nango({ 
  secretKey: process.env.NANGO_SECRET_KEY || '' 
})

// Test a connection by fetching data
export async function GET(request: NextRequest) {
  try {
    const connectionId = request.nextUrl.searchParams.get('connectionId')
    const integrationId = request.nextUrl.searchParams.get('integrationId')

    if (!connectionId || !integrationId) {
      return NextResponse.json(
        { error: 'Missing connectionId or integrationId' },
        { status: 400 }
      )
    }

    // Test the connection based on the integration type
    let data
    
    if (integrationId === 'github') {
      // Fetch GitHub user data
      data = await nango.proxy({
        providerConfigKey: integrationId,
        connectionId: connectionId,
        method: 'GET',
        endpoint: '/user',
      })
    } else if (integrationId === 'slack') {
      // Fetch Slack user identity
      data = await nango.proxy({
        providerConfigKey: integrationId,
        connectionId: connectionId,
        method: 'GET',
        endpoint: '/auth.test',
      })
    } else {
      return NextResponse.json(
        { error: 'Unknown integration type' },
        { status: 400 }
      )
    }

    return NextResponse.json({ 
      success: true,
      data: data.data,
      message: 'Connection test successful!'
    })
  } catch (error: any) {
    console.error('Error testing connection:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to test connection',
        success: false 
      },
      { status: 500 }
    )
  }
}

