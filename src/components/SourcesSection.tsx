import styles from "./SourcesSection.module.css";
import shared from "../styles/shared.module.css";
import { etfs } from "../etfs";

export function SourcesSection() {
    return (
        <section
            className={`${shared.sectionContainer} ${styles.notes}`}
            id="sources"
            aria-labelledby="sources-title"
        >
            <div>
                <h2 id="sources-title">Zdroje</h2>
                <p>
                    Oficiální factsheety emitenta uvádějí investiční zaměření,
                    ukazatele i kotovací burzu. Odkazy NYSE vedou na stránky
                    jednotlivých tickerů.
                </p>
            </div>
            <ul>
                {etfs.map((fund) => (
                    <li key={fund.ticker}>
                        <strong>{fund.ticker}</strong>
                        <span>{fund.name}</span>
                        <a
                            href={fund.factSheet}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Factsheet
                        </a>
                        <a
                            href={fund.nyseQuote}
                            target="_blank"
                            rel="noreferrer"
                        >
                            NYSE
                        </a>
                    </li>
                ))}
            </ul>
        </section>
    );
}
