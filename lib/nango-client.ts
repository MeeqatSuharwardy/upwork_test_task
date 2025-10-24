import Nango from '@nangohq/frontend'

let nangoInstance: Nango | null = null

export function getNangoInstance(): Nango {
  if (!nangoInstance) {
    const publicKey = process.env.NEXT_PUBLIC_NANGO_PUBLIC_KEY

    if (!publicKey) {
      throw new Error('NEXT_PUBLIC_NANGO_PUBLIC_KEY is not set')
    }

    const hostUrl = process.env.NEXT_PUBLIC_NANGO_HOST_URL || process.env.NANGO_HOST_URL

    nangoInstance = new Nango({ 
      publicKey,
      // Support for self-hosted Nango instance
      ...(hostUrl && { host: hostUrl })
    })
  }

  return nangoInstance
}

export interface ConnectionConfig {
  integrationId: string
  connectionId: string
}

export async function createConnection(config: ConnectionConfig): Promise<boolean> {
  const nango = getNangoInstance()
  
  try {
    const result = await nango.auth(config.integrationId, config.connectionId)
    return !!result
  } catch (error) {
    console.error('Failed to create connection:', error)
    throw error
  }
}

export async function deleteConnection(
  integrationId: string, 
  connectionId: string
): Promise<void> {
  try {
    const response = await fetch(
      `/api/nango/connections/${connectionId}?providerConfigKey=${integrationId}`,
      { method: 'DELETE' }
    )

    if (!response.ok) {
      throw new Error('Failed to delete connection')
    }
  } catch (error) {
    console.error('Failed to delete connection:', error)
    throw error
  }
}

