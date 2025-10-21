import type { NangoSync, SlackChannel } from '../../models'

export default async function fetchData(nango: NangoSync) {
  try {
    // Fetch all channels
    const response = await nango.get({
      endpoint: '/conversations.list',
      params: {
        exclude_archived: 'false',
        limit: '200',
        types: 'public_channel,private_channel',
      },
    })

    const channels = response.data.channels || []

    const mappedChannels: SlackChannel[] = channels.map((channel: any) => ({
      id: channel.id,
      name: channel.name,
      is_channel: channel.is_channel,
      is_private: channel.is_private,
      created: channel.created,
      num_members: channel.num_members || 0,
    }))

    await nango.batchSave(mappedChannels, 'SlackChannel')
  } catch (error: any) {
    throw new Error(`Failed to fetch Slack channels: ${error.message}`)
  }
}

