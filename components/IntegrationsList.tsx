'use client'

interface Integration {
  id: string
  name: string
  description: string
  icon: string
  type: 'existing' | 'custom'
}

const integrations: Integration[] = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Connect to GitHub to access repositories, issues, and pull requests',
    icon: '🔗',
    type: 'existing'
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Connect to Slack to send messages and manage channels',
    icon: '💬',
    type: 'custom'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Connect to Stripe to sync customers, payments, and subscriptions',
    icon: '💳',
    type: 'custom'
  },
  {
    id: 'twilio',
    name: 'Twilio',
    description: 'Connect to Twilio to sync messages, calls, and phone numbers',
    icon: '📱',
    type: 'custom'
  }
]

interface IntegrationsListProps {
  onConnect: (integrationId: string) => void
}

export default function IntegrationsList({ onConnect }: IntegrationsListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {integrations.map((integration) => (
        <div
          key={integration.id}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start mb-4">
            <span className="text-5xl mr-4">{integration.icon}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-semibold text-gray-900">
                  {integration.name}
                </h3>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    integration.type === 'existing'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {integration.type === 'existing' ? 'Pre-built' : 'Custom'}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{integration.description}</p>
              <button
                onClick={() => onConnect(integration.id)}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Connect {integration.name}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

