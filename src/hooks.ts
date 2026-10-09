import { useCallback, useEffect, useRef, useState } from 'react'
import { etfs } from './etfs'
import { trackEvent, type EventName, type TrackingEvent } from './tracking'

export function useFunnelTracking(selectedEtfs: string[]) {
  const selection = useRef(selectedEtfs)
  const landingTracked = useRef(false)
  useEffect(() => { selection.current = selectedEtfs }, [selectedEtfs])
  const track = useCallback((name: EventName, stage: TrackingEvent['stage'], errorType?: TrackingEvent['errorType']) => {
    trackEvent({ name, stage, selectedEtfs: selection.current, ...(errorType ? { errorType } : {}) })
  }, [])
  useEffect(() => {
    if (!landingTracked.current) { landingTracked.current = true; track('landing_view', 'landing') }
  }, [track])
  return track
}

export function useEtfComparison() {
  const [selectedEtfs, setSelectedEtfs] = useState<string[]>(['VOO', 'VB'])
  const [hasStarted, setHasStarted] = useState(false)
  const selectedFunds = selectedEtfs.map((ticker) => etfs.find((fund) => fund.ticker === ticker)!).filter(Boolean)
  const toggleFund = (ticker: string) => {
    if (selectedEtfs.includes(ticker)) return
    if (!hasStarted) {
      trackEvent({ name: 'compare_start', stage: 'comparison', selectedEtfs })
      setHasStarted(true)
    }
    const next = [selectedEtfs[1], ticker]
    setSelectedEtfs(next)
    trackEvent({ name: 'compare_change', stage: 'comparison', selectedEtfs: next })
  }
  return { selectedEtfs, selectedFunds, toggleFund }
}

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error'
const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT?.trim() || ''
export const isFormConfigured = /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint) && !endpoint.endsWith('/ID_FORMULARE')

export function useLeadSubmission(track: ReturnType<typeof useFunnelTracking>) {
  const [status, setStatus] = useState<SubmissionStatus>('idle')
  const [message, setMessage] = useState('')
  const busy = useRef(false)
  const submit = async (email: string) => {
    if (busy.current) return
    track('lead_submit_attempt', 'lead')
    if (!isFormConfigured) {
      setStatus('error'); setMessage('Formulář zatím není nastaven. Zkuste to prosím později.')
      track('lead_submit_error', 'lead', 'configuration'); return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus('error'); setMessage('Zadejte prosím platnou e-mailovou adresu.')
      track('lead_submit_error', 'lead', 'validation'); return
    }
    busy.current = true
    setStatus('submitting'); setMessage('')
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      if (!response.ok) {
        setStatus('error')
        setMessage(response.status === 429 ? 'Příliš mnoho pokusů. Počkejte prosím chvíli a zkuste to znovu.' : 'Odeslání se nepodařilo. Zkuste to prosím znovu.')
        track('lead_submit_error', 'lead', response.status === 429 ? 'rate_limit' : 'http')
        return
      }
      setStatus('success')
      track('lead_submit_success', 'lead')
    } catch {
      setStatus('error'); setMessage('Nepodařilo se připojit. Zkontrolujte připojení a zkuste to znovu.')
      track('lead_submit_error', 'lead', 'network')
    } finally { busy.current = false }
  }
  return { status, message, submit }
}
