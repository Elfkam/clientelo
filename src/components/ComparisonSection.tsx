import type { Etf } from '../etfs'
import { etfs, factsAsOf } from '../etfs'
import styles from '../App.module.css'

const formatAssets = (millions: number) => `${Math.round(millions / 1000).toLocaleString('cs-CZ')} mld. USD`

type ComparisonSectionProps = {
  selectedEtfs: string[]
  selectedFunds: Etf[]
  toggleFund: (ticker: string) => void
  onLeadCtaClick: () => void
}

export function ComparisonSection({ selectedEtfs, selectedFunds, toggleFund, onLeadCtaClick }: ComparisonSectionProps) {
  return (
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
          <a className={styles.textCta} href="#lead" onClick={onLeadCtaClick}>Chci přehled pěti ETF <span aria-hidden="true">↗</span></a>
        </section>
  )
}
