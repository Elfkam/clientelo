import styles from '../App.module.css'

export function SiteHeader() {
  return (
    <header className={styles.header}>
        <a className={styles.brand} href="#top" aria-label="ETF v kostce, začátek stránky"><span className={styles.brandMark}>E</span> ETF <span>v kostce</span></a>
        <a className={styles.headerLink} href="#comparison">Srovnání <span aria-hidden="true">↗</span></a>
      </header>
  )
}
