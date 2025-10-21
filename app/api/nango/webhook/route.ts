import { NextRequest, NextResponse } from 'next/server'

// Webhook handler for Nango events
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('Nango webhook received:', body)

    // Handle different webhook events
    switch (body.type) {
      case 'auth':
        console.log('New authentication:', body)
        // Handle new authentication
        break
      case 'sync':
        console.log('Sync event:', body)
        // Handle sync events
        break
      case 'forward':
        console.log('Forward event:', body)
        // Handle forwarded events
        break
      default:
        console.log('Unknown webhook type:', body.type)
    }

    return NextResponse.json({ 
      success: true,
      message: 'Webhook processed' 
    })
  } catch (error: any) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process webhook', success: false },
      { status: 500 }
    )
  }
}

