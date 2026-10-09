export type EventName = 'landing_view' | 'compare_start' | 'compare_change' | 'lead_cta_click' | 'lead_form_view' | 'lead_submit_attempt' | 'lead_submit_success' | 'lead_submit_error'

export type TrackingEvent = {
  name: EventName
  timestamp: string
  campaign: Record<string, string>
  selectedEtfs: string[]
  stage: 'landing' | 'comparison' | 'lead'
  errorType?: 'validation' | 'configuration' | 'network' | 'rate_limit' | 'http'
}

declare global {
  interface Window { etfTrackingEvents?: TrackingEvent[] }
}

const allowedCampaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ad_variant'] as const

export function getCampaign(): Record<string, string> {
  const search = new URLSearchParams(window.location.search)
  return Object.fromEntries(allowedCampaignKeys.flatMap((key) => {
    const value = search.get(key)
    return value ? [[key, value.slice(0, 100)]] : []
  }))
}

export function trackEvent(event: Omit<TrackingEvent, 'timestamp' | 'campaign'>) {
  const record: TrackingEvent = { ...event, timestamp: new Date().toISOString(), campaign: getCampaign() }
  window.etfTrackingEvents ??= []
  window.etfTrackingEvents.push(record)
  if (import.meta.env.DEV) console.info('[etf-event]', record)
}
