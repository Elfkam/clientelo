import { etfs, factsAsOf } from '../etfs'
import styles from '../App.module.css'

export function HeroSection() {
  return (
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
  )
}
