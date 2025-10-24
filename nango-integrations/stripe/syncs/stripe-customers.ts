import type { NangoSync, StripeCustomer } from '../../models'

/**
 * Syncs Stripe customers from the Stripe API
 * 
 * This sync fetches all customers from Stripe and saves them to the Nango database.
 * It handles pagination automatically and syncs incrementally based on the last sync time.
 * 
 * @param nango - The NangoSync instance with helper methods
 */
export default async function fetchData(nango: NangoSync) {
  try {
    let hasMore = true
    let startingAfter: string | undefined
    let totalSynced = 0

    // Get the last sync timestamp for incremental syncs
    const lastSyncDate = await nango.getMetadata('last_sync_timestamp')
    const params: any = { 
      limit: '100',
      expand: ['data.default_source']
    }

    // If this is an incremental sync, only get customers created/updated since last sync
    if (lastSyncDate) {
      params.created = { gte: Math.floor(new Date(lastSyncDate).getTime() / 1000) }
    }

    await nango.log('Starting Stripe customers sync...', { lastSyncDate })

    while (hasMore) {
      if (startingAfter) {
        params.starting_after = startingAfter
      }

      // Fetch customers from Stripe API
      const response = await nango.get({
        endpoint: '/v1/customers',
        params,
        retries: 3, // Retry up to 3 times on failure
      })

      if (!response.data || !response.data.data) {
        throw new Error('Invalid response from Stripe API')
      }

      // Transform Stripe customers to our model
      const customers: StripeCustomer[] = response.data.data.map((customer: any) => ({
        id: customer.id,
        email: customer.email || '',
        name: customer.name || customer.description || '',
        created: customer.created,
        currency: customer.currency || 'usd',
        balance: customer.balance || 0,
        delinquent: customer.delinquent || false,
        description: customer.description || '',
        metadata: customer.metadata || {},
      }))

      // Save customers to Nango database
      if (customers.length > 0) {
        await nango.batchSave(customers, 'StripeCustomer')
        totalSynced += customers.length
        await nango.log(`Synced ${customers.length} customers (total: ${totalSynced})`)
      }

      // Check if there are more pages
      hasMore = response.data.has_more
      if (hasMore && response.data.data.length > 0) {
        startingAfter = response.data.data[response.data.data.length - 1].id
      }
    }

    // Save metadata for next incremental sync
    await nango.setMetadata('last_sync_timestamp', new Date().toISOString())
    
    await nango.log(`✅ Successfully synced ${totalSynced} Stripe customers`)
  } catch (error: any) {
    await nango.log(`❌ Failed to sync Stripe customers: ${error.message}`, { 
      error: error.message, 
      stack: error.stack 
    })
    throw new Error(`Failed to sync Stripe customers: ${error.message}`)
  }
}

