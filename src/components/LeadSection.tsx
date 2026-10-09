import { useEffect, useRef } from 'react'
import { isFormConfigured, useLeadSubmission } from '../hooks'
import type { useFunnelTracking } from '../hooks'
import styles from '../App.module.css'

type LeadSectionProps = {
  track: ReturnType<typeof useFunnelTracking>
}

export function LeadSection({ track }: LeadSectionProps) {
  const { status, message, submit } = useLeadSubmission(track)
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
          <div className={styles.leadLayout}><div><p className={styles.sectionLabel}>03 / DALŠÍ KROK</p><h2 id="lead-title">Přehled pěti ETF<br /><em>na jednom místě.</em></h2><p className={styles.leadDescription}>Ukázka nabídky PDF přehledu. Po zadání e-mailu nyní pouze zaznamenáme váš kontakt; doručování PDF není součástí této ukázky.</p></div>
            <div className={styles.formCard}>
              {status === 'success' ? <div role="status" className={styles.success}><span aria-hidden="true">✓</span><h3>Děkujeme, váš e-mail jsme přijali.</h3><p>Formulářové API potvrdilo přijetí kontaktu. PDF se v této ukázce neodesílá.</p></div> : <form onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); void submit(String(data.get('email') || '')) }} noValidate>
                <label htmlFor="email">Váš e-mail</label><input id="email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="vas@email.cz" required aria-describedby="form-hint form-message" disabled={status === 'submitting'} />
                <p id="form-hint" className={styles.formHint}>Pošleme pouze adresu veřejné formulářové službě. PDF zatím nedoručujeme.</p>
                <button className={styles.submitButton} type="submit" disabled={status === 'submitting' || !isFormConfigured}>{status === 'submitting' ? 'Odesíláme…' : 'Odeslat e-mail'} <span aria-hidden="true">↗</span></button>
                <p id="form-message" className={styles.formMessage} role={status === 'error' ? 'alert' : 'status'}>{!isFormConfigured ? 'Formulář zatím není aktivní: chybí endpoint služby.' : message}</p>
                <p className={styles.privacyLink}>Odesláním berete na vědomí <a href="#privacy">informace o zpracování osobních údajů</a>.</p>
              </form>}
            </div>
          </div>
        </section>
  )
}
