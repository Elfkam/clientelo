import styles from "../App.module.css";
import { etfs, factsAsOf } from "../etfs";

export function HeroSection() {
    return (
        <section className={styles.hero} aria-labelledby="hero-title">
            <div className={styles.heroInner}>
                <div className={styles.heroCopy}>
                    <h1 id="hero-title">
                        ETF na americké akcie.{" "}
                        <em>Jaký je mezi nimi rozdíl?</em>
                    </h1>
                    <p className={styles.lead}>
                        Srovnejte zaměření, náklady a rizika fondů kotovaných na
                        NYSE Arca.
                    </p>
                    <a className={styles.primaryButton} href="#comparison">
                        Porovnat ETF <span aria-hidden="true">↗</span>
                    </a>
                    <p className={styles.heroNote}>
                        Údaje z factsheetů Vanguard k {factsAsOf}.
                    </p>
                </div>
                <div
                    className={styles.heroVisual}
                    aria-label="Náhled srovnání pěti ETF"
                >
                    <div className={styles.visualTop}>
                        <span>PŘEHLED FONDŮ</span>
                        <span>NYSE ARCA</span>
                    </div>
                    <div className={styles.visualBars}>
                        {etfs.map((fund, index) => (
                            <div className={styles.visualRow} key={fund.ticker}>
                                <span className={styles.visualIndex}>
                                    0{index + 1}
                                </span>
                                <strong>{fund.ticker}</strong>
                                <span className={styles.visualLine} />
                                <span>{fund.expenseRatio}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
