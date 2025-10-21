import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/nango-server'

// Generic proxy route for making authenticated API requests
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { connectionId, integrationId, endpoint, method, data, params } = body

    if (!connectionId || !integrationId || !endpoint || !method) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const response = await proxyRequest({
      providerConfigKey: integrationId,
      connectionId,
      method,
      endpoint,
      data,
      params,
    })

    return NextResponse.json({
      success: true,
      data: response.data,
    })
  } catch (error: any) {
    console.error('Proxy request error:', error)
    return NextResponse.json(
      {
        error: error.message || 'Proxy request failed',
        success: false,
      },
      { status: 500 }
    )
  }
}

