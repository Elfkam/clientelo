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
  const [selectedEtfs, setSelectedEtfs] = useState<[string, string]>(['VTV', 'VUG'])
  const [hasStarted, setHasStarted] = useState(false)
  const selectedTickers = selectedEtfs.filter(Boolean)
  const selectedFunds = selectedTickers.map((ticker) => etfs.find((fund) => fund.ticker === ticker)!).filter(Boolean)
  const updateSelection = (next: [string, string]) => {
    if (!hasStarted) {
      trackEvent({ name: 'compare_start', stage: 'comparison', selectedEtfs: selectedTickers })
      setHasStarted(true)
    }
    setSelectedEtfs(next)
    trackEvent({ name: 'compare_change', stage: 'comparison', selectedEtfs: next.filter(Boolean) })
  }
  const toggleFund = (ticker: string) => {
    const next: [string, string] = [...selectedEtfs]
    const selectedPosition = next.indexOf(ticker)
    if (selectedPosition !== -1) {
      next[selectedPosition] = ''
    } else {
      const emptyPosition = next.indexOf('')
      if (emptyPosition !== -1) next[emptyPosition] = ticker
      else return updateSelection([next[1], ticker])
    }
    updateSelection(next)
  }
  const selectFund = (position: 0 | 1, ticker: string) => {
    if (ticker === selectedEtfs[position]) return
    if (ticker && (!etfs.some((fund) => fund.ticker === ticker) || ticker === selectedEtfs[position === 0 ? 1 : 0])) return
    const next: [string, string] = [...selectedEtfs]
    next[position] = ticker
    updateSelection(next)
  }
  return { selectedEtfs, selectedTickers, selectedFunds, toggleFund, selectFund }
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
