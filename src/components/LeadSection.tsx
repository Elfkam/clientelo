import { useEffect, useRef } from 'react'
import { useLeadDemo } from '../hooks'
import type { useFunnelTracking } from '../hooks'
import styles from '../App.module.css'

type LeadSectionProps = {
  track: ReturnType<typeof useFunnelTracking>
}

export function LeadSection({ track }: LeadSectionProps) {
  const { status, message, submit } = useLeadDemo(track)
  const formRef = useRef<HTMLElement>(null)
  const formViewTracked = useRef(false)

  useEffect(() => {
    const node = formRef.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !formViewTracked.current) { formViewTracked.current = true; track('lead_form_view', 'lead'); observer.disconnect() }
    }, { threshold: 0.3 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [track])

  return (
    <section className={styles.leadSection} id="lead" ref={formRef} aria-labelledby="lead-title">
          <div className={styles.leadLayout}><div><p className={styles.sectionLabel}>03 / DALŠÍ KROK</p><h2 id="lead-title">Přehled pěti ETF<br /><em>na jednom místě.</em></h2><p className={styles.leadDescription}>Vyzkoušejte ukázkový formulář. Zadaný e-mail se nikam neodesílá ani neukládá; PDF se v této ukázce nedoručuje.</p></div>
            <div className={styles.formCard}>
              {status === 'success' ? <div role="status" className={styles.success}><span aria-hidden="true">✓</span><h3>Ukázka dokončena.</h3><p>E-mail se nikam neodeslal ani neuložil. PDF se v této ukázce nedoručuje.</p></div> : <form onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); submit(String(data.get('email') || '')) }} noValidate>
                <label htmlFor="email">Váš e-mail</label><input id="email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="vas@email.cz" required aria-describedby="form-hint form-message" disabled={status === 'submitting'} />
                <p id="form-hint" className={styles.formHint}>Po kliknutí se na jednu sekundu zobrazí načítání a potom potvrzení ukázky. Žádný e-mail se neodešle.</p>
                <button className={styles.submitButton} type="submit" disabled={status === 'submitting'}>{status === 'submitting' ? 'Načítání…' : 'Vyzkoušet odeslání'} <span aria-hidden="true">↗</span></button>
                <p id="form-message" className={styles.formMessage} role={status === 'error' ? 'alert' : 'status'}>{message}</p>
                <p className={styles.privacyLink}>Více o této ukázce: <a href="#privacy">informace o soukromí</a>.</p>
              </form>}
            </div>
          </div>
        </section>
  )
}
