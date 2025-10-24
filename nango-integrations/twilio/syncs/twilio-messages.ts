import type { NangoSync, TwilioMessage } from '../../models'

/**
 * Syncs Twilio SMS and MMS messages
 * 
 * This sync fetches all messages (sent and received) from Twilio and saves them
 * to the Nango database. It handles pagination and incremental syncing.
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

    // If this is an incremental sync, only get messages created since last sync
    if (lastSyncDate) {
      const dateSent = new Date(lastSyncDate).toISOString().split('T')[0]
      params.DateSent = `>=${dateSent}`
    }

    await nango.log('Starting Twilio messages sync...', { lastSyncDate })

    while (hasMore) {
      const endpoint = pageUri || '/2010-04-01/Accounts/{AccountSid}/Messages.json'
      
      // Fetch messages from Twilio API
      const response = await nango.get({
        endpoint,
        params: pageUri ? {} : params,
        retries: 3,
      })

      if (!response.data || !response.data.messages) {
        throw new Error('Invalid response from Twilio API')
      }

      // Transform Twilio messages to our model
      const messages: TwilioMessage[] = response.data.messages.map((msg: any) => ({
        sid: msg.sid,
        from: msg.from,
        to: msg.to,
        body: msg.body || '',
        status: msg.status,
        direction: msg.direction,
        date_created: msg.date_created,
        date_sent: msg.date_sent || null,
        date_updated: msg.date_updated,
        price: msg.price || null,
        error_code: msg.error_code || null,
        error_message: msg.error_message || null,
      }))

      // Save messages to Nango database
      if (messages.length > 0) {
        await nango.batchSave(messages, 'TwilioMessage')
        totalSynced += messages.length
        await nango.log(`Synced ${messages.length} messages (total: ${totalSynced})`)
      }

      // Check if there are more pages
      hasMore = !!response.data.next_page_uri
      pageUri = response.data.next_page_uri
    }

    // Save metadata for next incremental sync
    await nango.setMetadata('last_sync_timestamp', new Date().toISOString())
    
    await nango.log(`✅ Successfully synced ${totalSynced} Twilio messages`)
  } catch (error: any) {
    await nango.log(`❌ Failed to sync Twilio messages: ${error.message}`, { 
      error: error.message, 
      stack: error.stack 
    })
    throw new Error(`Failed to sync Twilio messages: ${error.message}`)
  }
}

