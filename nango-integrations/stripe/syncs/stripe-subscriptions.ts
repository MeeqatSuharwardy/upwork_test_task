import type { NangoSync, StripeSubscription } from '../../models'

/**
 * Syncs Stripe subscriptions from the Stripe API
 * 
 * This sync fetches all subscriptions (active, canceled, etc.) and saves them
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
      expand: ['data.customer', 'data.plan.product'],
      status: 'all' // Get all subscriptions regardless of status
    }

    // If this is an incremental sync, only get subscriptions created since last sync
    if (lastSyncDate) {
      params.created = { gte: Math.floor(new Date(lastSyncDate).getTime() / 1000) }
    }

    await nango.log('Starting Stripe subscriptions sync...', { lastSyncDate })

    while (hasMore) {
      if (startingAfter) {
        params.starting_after = startingAfter
      }

      // Fetch subscriptions from Stripe API
      const response = await nango.get({
        endpoint: '/v1/subscriptions',
        params,
        retries: 3,
      })

      if (!response.data || !response.data.data) {
        throw new Error('Invalid response from Stripe API')
      }

      // Transform Stripe subscriptions to our model
      const subscriptions: StripeSubscription[] = response.data.data.map((sub: any) => ({
        id: sub.id,
        customer: sub.customer,
        status: sub.status,
        current_period_start: sub.current_period_start,
        current_period_end: sub.current_period_end,
        created: sub.created,
        cancel_at_period_end: sub.cancel_at_period_end,
        canceled_at: sub.canceled_at || null,
        trial_start: sub.trial_start || null,
        trial_end: sub.trial_end || null,
        metadata: sub.metadata || {},
      }))

      // Save subscriptions to Nango database
      if (subscriptions.length > 0) {
        await nango.batchSave(subscriptions, 'StripeSubscription')
        totalSynced += subscriptions.length
        await nango.log(`Synced ${subscriptions.length} subscriptions (total: ${totalSynced})`)
      }

      // Check if there are more pages
      hasMore = response.data.has_more
      if (hasMore && response.data.data.length > 0) {
        startingAfter = response.data.data[response.data.data.length - 1].id
      }
    }

    // Save metadata for next incremental sync
    await nango.setMetadata('last_sync_timestamp', new Date().toISOString())
    
    await nango.log(`✅ Successfully synced ${totalSynced} Stripe subscriptions`)
  } catch (error: any) {
    await nango.log(`❌ Failed to sync Stripe subscriptions: ${error.message}`, { 
      error: error.message, 
      stack: error.stack 
    })
    throw new Error(`Failed to sync Stripe subscriptions: ${error.message}`)
  }
}

