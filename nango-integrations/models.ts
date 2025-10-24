// Type definitions for Nango integrations

export interface NangoSync {
  get: (config: { endpoint: string; params?: Record<string, any>; retries?: number }) => Promise<any>
  post: (config: { endpoint: string; data?: any }) => Promise<any>
  batchSave: (records: any[], model: string) => Promise<void>
  batchDelete: (records: any[], model: string) => Promise<void>
  getConnection: () => Promise<any>
  log: (message: string, metadata?: Record<string, any>) => void
  getMetadata: (key: string) => Promise<any>
  setMetadata: (key: string, value: any) => Promise<void>
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

// Stripe Models
export interface StripeCustomer {
  id: string
  email: string
  name: string
  created: number
  currency: string
  balance: number
  delinquent: boolean
  description: string
  metadata: Record<string, any>
}

export interface StripePayment {
  id: string
  amount: number
  currency: string
  status: string
  customer: string
  created: number
  description: string
  payment_method: string
  receipt_email: string
  metadata: Record<string, any>
}

export interface StripeSubscription {
  id: string
  customer: string
  status: string
  current_period_start: number
  current_period_end: number
  created: number
  cancel_at_period_end: boolean
  canceled_at: number | null
  trial_start: number | null
  trial_end: number | null
  metadata: Record<string, any>
}

// Twilio Models
export interface TwilioMessage {
  sid: string
  from: string
  to: string
  body: string
  status: string
  direction: string
  date_created: string
  date_sent: string | null
  date_updated: string
  price: string | null
  error_code: number | null
  error_message: string | null
}

export interface TwilioCall {
  sid: string
  from: string
  to: string
  status: string
  direction: string
  duration: number | null
  start_time: string
  end_time: string | null
  price: string | null
  answered_by: string | null
}

export interface TwilioPhoneNumber {
  sid: string
  phone_number: string
  friendly_name: string
  capabilities: Record<string, any>
  status: string
  date_created: string
  date_updated: string
}

