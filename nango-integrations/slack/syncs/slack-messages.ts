import type { NangoSync, SlackMessage } from '../../models'

export default async function fetchData(nango: NangoSync) {
  try {
    // Fetch all channels the bot has access to
    const channelsResponse = await nango.get({
      endpoint: '/conversations.list',
      params: {
        exclude_archived: 'true',
        limit: '200',
      },
    })

    const channels = channelsResponse.data.channels || []

    // For each channel, fetch recent messages
    for (const channel of channels) {
      try {
        const messagesResponse = await nango.get({
          endpoint: '/conversations.history',
          params: {
            channel: channel.id,
            limit: '100',
          },
        })

        const messages = messagesResponse.data.messages || []

        const mappedMessages: SlackMessage[] = messages.map((msg: any) => ({
          id: `${channel.id}-${msg.ts}`,
          text: msg.text || '',
          user: msg.user || 'unknown',
          channel: channel.id,
          timestamp: msg.ts,
          thread_ts: msg.thread_ts || null,
        }))

        await nango.batchSave(mappedMessages, 'SlackMessage')
      } catch (channelError: any) {
        // Skip channels we don't have access to
        console.log(`Skipping channel ${channel.id}: ${channelError.message}`)
      }
    }
  } catch (error: any) {
    throw new Error(`Failed to fetch Slack messages: ${error.message}`)
  }
}

