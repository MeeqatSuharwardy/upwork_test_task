import { Nango } from '@nangohq/node'

let nangoServerInstance: Nango | null = null

export function getNangoServer(): Nango {
  if (!nangoServerInstance) {
    const secretKey = process.env.NANGO_SECRET_KEY

    if (!secretKey) {
      throw new Error('NANGO_SECRET_KEY is not set')
    }

    const hostUrl = process.env.NANGO_HOST_URL

    nangoServerInstance = new Nango({ 
      secretKey,
      // Support for self-hosted Nango instance
      ...(hostUrl && { host: hostUrl })
    })
  }

  return nangoServerInstance
}

export interface ProxyConfig {
  providerConfigKey: string
  connectionId: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  endpoint: string
  data?: any
  params?: Record<string, string>
}

export async function proxyRequest(config: ProxyConfig) {
  const nango = getNangoServer()
  
  try {
    const response = await nango.proxy({
      providerConfigKey: config.providerConfigKey,
      connectionId: config.connectionId,
      method: config.method,
      endpoint: config.endpoint,
      data: config.data,
      params: config.params,
    })

    return response
  } catch (error) {
    console.error('Proxy request failed:', error)
    throw error
  }
}

export async function getConnection(providerConfigKey: string, connectionId: string) {
  const nango = getNangoServer()
  
  try {
    return await nango.getConnection(providerConfigKey, connectionId)
  } catch (error) {
    console.error('Failed to get connection:', error)
    throw error
  }
}

export async function listConnections(providerConfigKey?: string) {
  const nango = getNangoServer()
  
  try {
    if (providerConfigKey) {
      return await nango.listConnections({ providerConfigKey })
    }
    return await nango.listConnections()
  } catch (error) {
    console.error('Failed to list connections:', error)
    throw error
  }
}

