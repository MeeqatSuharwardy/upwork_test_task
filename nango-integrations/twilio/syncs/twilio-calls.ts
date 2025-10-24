import type { NangoSync, TwilioCall } from '../../models'

/**
 * Syncs Twilio voice call records
 * 
 * This sync fetches all call records from Twilio and saves them to the Nango database.
 * It handles pagination and incremental syncing.
 * 
 * @param nango - The NangoSync instance with helper methods
 */
export default async function fetchData(nango: NangoSync) {
  try {
    let hasMore = true
    let pageUri: string | undefined
    let totalSynced = 0

    // Get the last sync timestamp for incremental syncs
    const lastSyncDate = await nango.getMetadata('last_sync_timestamp')
    const params: any = { 
      PageSize: '100'
    }

    // If this is an incremental sync, only get calls started since last sync
    if (lastSyncDate) {
      const startTime = new Date(lastSyncDate).toISOString().split('T')[0]
      params.StartTime = `>=${startTime}`
    }

    await nango.log('Starting Twilio calls sync...', { lastSyncDate })

    while (hasMore) {
      const endpoint = pageUri || '/2010-04-01/Accounts/{AccountSid}/Calls.json'
      
      // Fetch calls from Twilio API
      const response = await nango.get({
        endpoint,
        params: pageUri ? {} : params,
        retries: 3,
      })

      if (!response.data || !response.data.calls) {
        throw new Error('Invalid response from Twilio API')
      }

      // Transform Twilio calls to our model
      const calls: TwilioCall[] = response.data.calls.map((call: any) => ({
        sid: call.sid,
        from: call.from,
        to: call.to,
        status: call.status,
        direction: call.direction,
        duration: call.duration ? parseInt(call.duration) : null,
        start_time: call.start_time,
        end_time: call.end_time || null,
        price: call.price || null,
        answered_by: call.answered_by || null,
      }))

      // Save calls to Nango database
      if (calls.length > 0) {
        await nango.batchSave(calls, 'TwilioCall')
        totalSynced += calls.length
        await nango.log(`Synced ${calls.length} calls (total: ${totalSynced})`)
      }

      // Check if there are more pages
      hasMore = !!response.data.next_page_uri
      pageUri = response.data.next_page_uri
    }

    // Save metadata for next incremental sync
    await nango.setMetadata('last_sync_timestamp', new Date().toISOString())
    
    await nango.log(`✅ Successfully synced ${totalSynced} Twilio calls`)
  } catch (error: any) {
    await nango.log(`❌ Failed to sync Twilio calls: ${error.message}`, { 
      error: error.message, 
      stack: error.stack 
    })
    throw new Error(`Failed to sync Twilio calls: ${error.message}`)
  }
}

