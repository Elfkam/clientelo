import { useCallback, useEffect, useRef, useState } from 'react'
import { etfs } from './etfs'
import { trackEvent, type EventName, type TrackingEvent } from './tracking'

export function useFunnelTracking(selectedEtfs: string[]) {
  const selection = useRef(selectedEtfs)
  const landingTracked = useRef(false)
  useEffect(() => { selection.current = selectedEtfs }, [selectedEtfs])
  const track = useCallback((name: EventName, stage: TrackingEvent['stage']) => {
    trackEvent({ name, stage, selectedEtfs: selection.current })
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

type DemoStatus = 'idle' | 'submitting' | 'success'

export function useLeadDemo(track: ReturnType<typeof useFunnelTracking>) {
  const [status, setStatus] = useState<DemoStatus>('idle')
  const busy = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
  const submit = () => {
    if (busy.current) return
    track('lead_demo_attempt', 'lead')
    busy.current = true
    setStatus('submitting')
    timer.current = setTimeout(() => {
      timer.current = null
      busy.current = false
      setStatus('success')
      track('lead_demo_complete', 'lead')
    }, 1000)
  }
  return { status, submit }
}
