import type { NangoSync, StripePayment } from '../../models'

/**
 * Syncs Stripe payment intents from the Stripe API
 * 
 * This sync fetches payment intents (both successful and failed) and saves them
 * to the Nango database. It handles pagination and incremental syncing.
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
      expand: ['data.customer', 'data.payment_method']
    }

    // If this is an incremental sync, only get payments created since last sync
    if (lastSyncDate) {
      params.created = { gte: Math.floor(new Date(lastSyncDate).getTime() / 1000) }
    }

    await nango.log('Starting Stripe payment intents sync...', { lastSyncDate })

    while (hasMore) {
      if (startingAfter) {
        params.starting_after = startingAfter
      }

      // Fetch payment intents from Stripe API
      const response = await nango.get({
        endpoint: '/v1/payment_intents',
        params,
        retries: 3,
      })

      if (!response.data || !response.data.data) {
        throw new Error('Invalid response from Stripe API')
      }

      // Transform Stripe payment intents to our model
      const payments: StripePayment[] = response.data.data.map((payment: any) => ({
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        customer: payment.customer || '',
        created: payment.created,
        description: payment.description || '',
        payment_method: payment.payment_method || '',
        receipt_email: payment.receipt_email || '',
        metadata: payment.metadata || {},
      }))

      // Save payments to Nango database
      if (payments.length > 0) {
        await nango.batchSave(payments, 'StripePayment')
        totalSynced += payments.length
        await nango.log(`Synced ${payments.length} payments (total: ${totalSynced})`)
      }

      // Check if there are more pages
      hasMore = response.data.has_more
      if (hasMore && response.data.data.length > 0) {
        startingAfter = response.data.data[response.data.data.length - 1].id
      }
    }

    // Save metadata for next incremental sync
    await nango.setMetadata('last_sync_timestamp', new Date().toISOString())
    
    await nango.log(`✅ Successfully synced ${totalSynced} Stripe payment intents`)
  } catch (error: any) {
    await nango.log(`❌ Failed to sync Stripe payments: ${error.message}`, { 
      error: error.message, 
      stack: error.stack 
    })
    throw new Error(`Failed to sync Stripe payments: ${error.message}`)
  }
}

