import type { NangoSync, TwilioPhoneNumber } from '../../models'

/**
 * Syncs Twilio phone numbers
 * 
 * This sync fetches all phone numbers associated with the Twilio account
 * and saves them to the Nango database.
 * 
 * @param nango - The NangoSync instance with helper methods
 */
export default async function fetchData(nango: NangoSync) {
  try {
    let hasMore = true
    let pageUri: string | undefined
    let totalSynced = 0

    const params: any = { 
      PageSize: '100'
    }

    await nango.log('Starting Twilio phone numbers sync...')

    while (hasMore) {
      const endpoint = pageUri || '/2010-04-01/Accounts/{AccountSid}/IncomingPhoneNumbers.json'
      
      // Fetch phone numbers from Twilio API
      const response = await nango.get({
        endpoint,
        params: pageUri ? {} : params,
        retries: 3,
      })

      if (!response.data || !response.data.incoming_phone_numbers) {
        throw new Error('Invalid response from Twilio API')
      }

      // Transform Twilio phone numbers to our model
      const phoneNumbers: TwilioPhoneNumber[] = response.data.incoming_phone_numbers.map((number: any) => ({
        sid: number.sid,
        phone_number: number.phone_number,
        friendly_name: number.friendly_name || number.phone_number,
        capabilities: {
          voice: number.capabilities?.voice || false,
          sms: number.capabilities?.sms || false,
          mms: number.capabilities?.mms || false,
          fax: number.capabilities?.fax || false,
        },
        status: number.status || 'active',
        date_created: number.date_created,
        date_updated: number.date_updated,
      }))

      // Save phone numbers to Nango database
      if (phoneNumbers.length > 0) {
        await nango.batchSave(phoneNumbers, 'TwilioPhoneNumber')
        totalSynced += phoneNumbers.length
        await nango.log(`Synced ${phoneNumbers.length} phone numbers (total: ${totalSynced})`)
      }

      // Check if there are more pages
      hasMore = !!response.data.next_page_uri
      pageUri = response.data.next_page_uri
    }
    
    await nango.log(`✅ Successfully synced ${totalSynced} Twilio phone numbers`)
  } catch (error: any) {
    await nango.log(`❌ Failed to sync Twilio phone numbers: ${error.message}`, { 
      error: error.message, 
      stack: error.stack 
    })
    throw new Error(`Failed to sync Twilio phone numbers: ${error.message}`)
  }
}

