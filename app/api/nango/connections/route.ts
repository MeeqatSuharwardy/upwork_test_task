import { NextRequest, NextResponse } from 'next/server'
import { Nango } from '@nangohq/node'

const nango = new Nango({ 
  secretKey: process.env.NANGO_SECRET_KEY || '' 
})

// GET all connections
export async function GET(request: NextRequest) {
  try {
    // In production, you'd filter by authenticated user
    // For demo purposes, we'll get all connections
    const result = await nango.listConnections()
    
    // Nango returns { connections: [...] }, not an array directly
    const connections = result?.connections || []
    
    return NextResponse.json({ 
      connections,
      success: true 
    })
  } catch (error: any) {
    console.error('Error fetching connections:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch connections', success: false },
      { status: 500 }
    )
  }
}

