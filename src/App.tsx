import { useEffect, useRef } from 'react'
import { etfs, factsAsOf } from './etfs'
import { isFormConfigured, useEtfComparison, useFunnelTracking, useLeadSubmission } from './hooks'
import styles from './App.module.css'

const formatAssets = (millions: number) => `${Math.round(millions / 1000).toLocaleString('cs-CZ')} mld. USD`

function App() {
  const { selectedEtfs, selectedFunds, toggleFund } = useEtfComparison()
  const track = useFunnelTracking(selectedEtfs)
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

  const handleCta = () => track('lead_cta_click', 'lead')

  return (
    <>
      <header className={styles.header}>
        <a className={styles.brand} href="#top" aria-label="ETF v kostce, začátek stránky"><span className={styles.brandMark}>E</span> ETF <span>v kostce</span></a>
        <a className={styles.headerLink} href="#comparison">Srovnání <span aria-hidden="true">↗</span></a>
      </header>
      <main id="top">
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}><span className={styles.dot} /> PĚT ETF · JEDNO JASNÉ SROVNÁNÍ</p>
              <h1 id="hero-title">Pět ETF na americké akcie. <em>Jaký je mezi nimi rozdíl?</em></h1>
              <p className={styles.lead}>Srovnejte zaměření, náklady a rizika pěti fondů kotovaných na NYSE Arca. Začněte dvěma vedle sebe.</p>
              <a className={styles.primaryButton} href="#comparison">Porovnat ETF <span aria-hidden="true">↗</span></a>
              <p className={styles.heroNote}>Údaje z factsheetů Vanguard k {factsAsOf}. Bez živých cen.</p>
            </div>
            <div className={styles.heroVisual} aria-label="Náhled srovnání pěti ETF">
              <div className={styles.visualTop}><span>PŘEHLED / 05 FONDŮ</span><span>NYSE ARCA</span></div>
              <div className={styles.visualBars}>
                {etfs.map((fund, index) => <div className={styles.visualRow} key={fund.ticker}><span className={styles.visualIndex}>0{index + 1}</span><strong>{fund.ticker}</strong><span className={styles.visualLine} /><span>{fund.expenseRatio}</span></div>)}
              </div>
              <div className={styles.visualBottom}><span>NÁKLADOVOST FONDU</span><span>01—05</span></div>
            </div>
          </div>
        </section>

        <section className={styles.intro} aria-labelledby="intro-title">
          <p className={styles.sectionLabel}>01 / ORIENTACE</p>
          <div><h2 id="intro-title">Stejná burza.<br /><em>Jiné složení.</em></h2><p>Všech pět ETF se kotuje na NYSE Arca a investuje do amerických akcií. Liší se tím, které firmy vybírají. Burza kotace není totéž co trh podkladových akcií.</p></div>
        </section>

        <section className={styles.comparison} id="comparison" aria-labelledby="comparison-title">
          <div className={styles.sectionHeading}><div><p className={styles.sectionLabel}>02 / SROVNÁNÍ</p><h2 id="comparison-title">Vyberte dvě ETF</h2></div><p>Klepněte na fond. V tabulce níže uvidíte rozdíly; na mobilu ji posuňte do stran.</p></div>
          <div className={styles.fundGrid}>
            {etfs.map((fund, index) => {
              const selected = selectedEtfs.includes(fund.ticker)
              return <button className={`${styles.fundCard} ${selected ? styles.selected : ''}`} type="button" aria-pressed={selected} onClick={() => toggleFund(fund.ticker)} key={fund.ticker}>
                <span className={styles.fundTop}><span>0{index + 1} / NYSE ARCA</span><span className={styles.selectIcon}>{selected ? '✓' : '+'}</span></span>
                <strong>{fund.ticker}</strong><span className={styles.fundFocus}>{fund.focus}</span><span className={styles.fundExpense}>Náklady <b>{fund.expenseRatio}</b></span>
              </button>
            })}
          </div>
          <div className={styles.tableWrap} role="region" aria-label="Srovnání vybraných ETF" tabIndex={0}>
            <table><caption>Vybrané fondy: {selectedFunds.map((fund) => fund.ticker).join(' a ')}</caption><thead><tr><th scope="col">Ukazatel</th>{selectedFunds.map((fund) => <th scope="col" key={fund.ticker}>{fund.ticker}</th>)}</tr></thead><tbody>
              <tr><th scope="row">Zaměření</th>{selectedFunds.map((fund) => <td key={fund.ticker}>{fund.focus}</td>)}</tr>
              <tr><th scope="row">Sledovaný index</th>{selectedFunds.map((fund) => <td key={fund.ticker}>{fund.index}</td>)}</tr>
              <tr><th scope="row">Nákladovost</th>{selectedFunds.map((fund) => <td key={fund.ticker}>{fund.expenseRatio} ročně</td>)}</tr>
              <tr><th scope="row">Počet akcií</th>{selectedFunds.map((fund) => <td key={fund.ticker}>{fund.holdings.toLocaleString('cs-CZ')}</td>)}</tr>
              <tr><th scope="row">Aktiva ETF</th>{selectedFunds.map((fund) => <td key={fund.ticker}>{formatAssets(fund.assetsMillionsUsd)}</td>)}</tr>
              <tr><th scope="row">Výplata dividend</th>{selectedFunds.map((fund) => <td key={fund.ticker}>{fund.dividendSchedule}</td>)}</tr>
              <tr><th scope="row">Na co dát pozor</th>{selectedFunds.map((fund) => <td key={fund.ticker}>{fund.risk}</td>)}</tr>
            </tbody></table>
          </div>
          <p className={styles.sourceNote}>Aktiva a počty akcií platí k {factsAsOf}; nákladovost podle tehdy uvedeného prospektu. <a href="#sources">Primární zdroje pro všech 5 fondů</a>.</p>
          <a className={styles.textCta} href="#lead" onClick={handleCta}>Chci přehled pěti ETF <span aria-hidden="true">↗</span></a>
        </section>

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

        <section className={styles.notes} id="sources" aria-labelledby="sources-title"><div><p className={styles.sectionLabel}>04 / ZDROJE A KONTEXT</p><h2 id="sources-title">Ověřte si údaje</h2><p>Oficiální factsheety emitenta uvádějí investiční zaměření, ukazatele i kotovací burzu. Odkazy NYSE vedou na stránky jednotlivých tickerů.</p></div><ul>{etfs.map((fund) => <li key={fund.ticker}><strong>{fund.ticker}</strong><span>{fund.name}</span><a href={fund.factSheet} target="_blank" rel="noreferrer">Factsheet ↗</a><a href={fund.nyseQuote} target="_blank" rel="noreferrer">NYSE ↗</a></li>)}</ul><p className={styles.disclaimer}>Výběr není osobním investičním doporučením. Hodnota investice může klesnout. Dostupnost nákupu závisí na brokerovi, jurisdikci a typu investora; dostupnost pro české drobné investory nebyla ověřena. Minulý výnos nezaručuje budoucí výsledek.</p></section>

        <section className={styles.privacy} id="privacy" aria-labelledby="privacy-title"><h2 id="privacy-title">Informace o zpracování osobních údajů</h2><p><strong>Provozovatel a kontakt:</strong> [DOPLNIT PŘED OSTRÝM PROVOZEM]. <strong>Účel:</strong> přijetí e-mailového kontaktu pro zamýšlený přehled ETF. <strong>Poskytovatel formuláře:</strong> Formspree. <strong>Doba uchování:</strong> [DOPLNIT PŘED OSTRÝM PROVOZEM]. Než bude formulář aktivován, je nutné tyto údaje doplnit a ověřit nastavení služby.</p></section>
      </main>
      <footer className={styles.footer}><span>ETF v kostce / demonstrační projekt</span><a href="#top">Zpět nahoru ↑</a></footer>
    </>
  )
}

export default App
