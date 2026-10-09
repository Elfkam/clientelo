import { etfs } from '../etfs'
import styles from '../App.module.css'

export function SourcesSection() {
  return (
    <section className={styles.notes} id="sources" aria-labelledby="sources-title"><div><p className={styles.sectionLabel}>04 / ZDROJE A KONTEXT</p><h2 id="sources-title">Ověřte si údaje</h2><p>Oficiální factsheety emitenta uvádějí investiční zaměření, ukazatele i kotovací burzu. Odkazy NYSE vedou na stránky jednotlivých tickerů.</p></div><ul>{etfs.map((fund) => <li key={fund.ticker}><strong>{fund.ticker}</strong><span>{fund.name}</span><a href={fund.factSheet} target="_blank" rel="noreferrer">Factsheet ↗</a><a href={fund.nyseQuote} target="_blank" rel="noreferrer">NYSE ↗</a></li>)}</ul><p className={styles.disclaimer}>Výběr není osobním investičním doporučením. Hodnota investice může klesnout. Dostupnost nákupu závisí na brokerovi, jurisdikci a typu investora; dostupnost pro české drobné investory nebyla ověřena. Minulý výnos nezaručuje budoucí výsledek.</p></section>
  )
}
