// Type definitions for Nango integrations

export interface NangoSync {
  get: (config: { endpoint: string; params?: Record<string, string> }) => Promise<any>
  post: (config: { endpoint: string; data?: any }) => Promise<any>
  batchSave: (records: any[], model: string) => Promise<void>
  batchDelete: (records: any[], model: string) => Promise<void>
  getConnection: () => Promise<any>
  log: (message: string) => void
}

// GitHub Models
export interface GithubIssue {
  id: string
  title: string
  body: string
  state: string
  created_at: string
  updated_at: string
  user: {
    login: string
    avatar_url: string
  }
}

export interface GithubPR {
  id: string
  title: string
  body: string
  state: string
  created_at: string
  updated_at: string
  head: {
    ref: string
  }
  base: {
    ref: string
  }
}

// Slack Models
export interface SlackMessage {
  id: string
  text: string
  user: string
  channel: string
  timestamp: string
  thread_ts: string | null
}

export interface SlackChannel {
  id: string
  name: string
  is_channel: boolean
  is_private: boolean
  created: number
  num_members: number
}

