import { NextRequest, NextResponse } from 'next/server'
import { Nango } from '@nangohq/node'

const nango = new Nango({ 
  secretKey: process.env.NANGO_SECRET_KEY || '' 
})

// DELETE a specific connection
export async function DELETE(
  request: NextRequest,
  { params }: { params: { connectionId: string } }
) {
  try {
    const { connectionId } = params

    // Get connection details first to get the provider config key
    const connection = await nango.getConnection(
      // We need the provider config key, which we'll get from query params
      request.nextUrl.searchParams.get('providerConfigKey') || 'github',
      connectionId
    )

    if (connection) {
      await nango.deleteConnection(
        connection.provider_config_key,
        connectionId
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Connection deleted successfully' 
    })
  } catch (error: any) {
    console.error('Error deleting connection:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete connection', success: false },
      { status: 500 }
    )
  }
}

