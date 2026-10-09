import styles from '../App.module.css'

export function IntroSection() {
  return (
    <section className={styles.intro} aria-labelledby="intro-title">
          <p className={styles.sectionLabel}>01 / ORIENTACE</p>
          <div><h2 id="intro-title">Stejná burza.<br /><em>Jiné složení.</em></h2><p>Všech pět ETF se kotuje na NYSE Arca a investuje do amerických akcií. Liší se tím, které firmy vybírají. Burza kotace není totéž co trh podkladových akcií.</p></div>
        </section>
  )
}
