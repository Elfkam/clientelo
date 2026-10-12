import type { Etf } from "../etfs";
import { etfs } from "../etfs";
import shared from "../styles/shared.module.css";
import styles from "./ComparisonSection.module.css";

const formatAssets = (millions: number) =>
    `${Math.round(millions / 1000).toLocaleString("cs-CZ")} mld. USD`;

type ComparisonSectionProps = {
    selectedEtfs: [string, string];
    selectedFunds: Etf[];
    toggleFund: (ticker: string) => void;
    selectFund: (position: 0 | 1, ticker: string) => void;
    onLeadCtaClick: () => void;
};

export function ComparisonSection({
    selectedEtfs,
    selectedFunds,
    toggleFund,
    selectFund,
    onLeadCtaClick,
}: ComparisonSectionProps) {
    const hasComparison = selectedFunds.length === 2;

    return (
        <section
            className={`${shared.sectionContainer} ${styles.comparison}`}
            id="comparison"
            aria-labelledby="comparison-title"
        >
            <div className={styles.sectionHeading}>
                <h2 id="comparison-title">
                    Vyberte fondy, které chcete porovnat.
                </h2>
            </div>

            <div
                className={styles.mobileSelectors}
                role="group"
                aria-label="Výběr dvou ETF"
            >
                {([0, 1] as const).map((position) => (
                    <div className={styles.selectorField} key={position}>
                        <label htmlFor={`etf-select-${position}`}>
                            {position === 0 ? "První ETF" : "Druhé ETF"}
                        </label>
                        <select
                            id={`etf-select-${position}`}
                            value={selectedEtfs[position]}
                            onChange={(event) =>
                                selectFund(position, event.target.value)
                            }
                        >
                            <option value="">Vyberte ETF</option>
                            {etfs
                                .filter(
                                    (fund) =>
                                        fund.ticker !==
                                        selectedEtfs[position === 0 ? 1 : 0],
                                )
                                .map((fund) => (
                                    <option
                                        value={fund.ticker}
                                        key={fund.ticker}
                                    >
                                        {fund.ticker}
                                    </option>
                                ))}
                        </select>
                    </div>
                ))}
            </div>

            <div
                className={styles.fundGrid}
                aria-label="Výběr ETF pro srovnání"
            >
                {etfs.map((fund) => {
                    const selected = selectedEtfs.includes(fund.ticker);
                    return (
                        <button
                            className={`${styles.fundCard} ${selected ? styles.selected : ""}`}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => toggleFund(fund.ticker)}
                            key={fund.ticker}
                        >
                            <span className={styles.fundTop}>
                                <span></span>
                                <span className={styles.selectIcon}>
                                    {selected ? "✓" : "+"}
                                </span>
                            </span>
                            <strong>{fund.ticker}</strong>
                            <span className={styles.fundFocus}>
                                {fund.focus}
                            </span>
                            <span className={styles.fundExpense}>
                                Náklady <b>{fund.expenseRatio}</b>
                            </span>
                        </button>
                    );
                })}
            </div>
            <a
                className={styles.moreEtfsLink}
                href="#lead"
                onClick={() => {
                    onLeadCtaClick();
                    requestAnimationFrame(() => {
                        document.getElementById("email")?.focus();
                    });
                }}
            >
                Zobrazit více ETF
            </a>

            <div
                className={styles.tableWrap}
                role="region"
                aria-label="Srovnání vybraných ETF"
                tabIndex={0}
            >
                {hasComparison ? (
                    <table>
                        <caption className={styles.tableCaption}>
                            Vybrané fondy:{" "}
                            {selectedFunds
                                .map((fund) => fund.ticker)
                                .join(" a ")}
                        </caption>
                        <thead>
                            <tr>
                                <th scope="col">Ukazatel</th>
                                {selectedFunds.map((fund) => (
                                    <th scope="col" key={fund.ticker}>
                                        {fund.ticker}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">Zaměření</th>
                                {selectedFunds.map((fund) => (
                                    <td key={fund.ticker}>{fund.focus}</td>
                                ))}
                            </tr>
                            <tr>
                                <th scope="row">Roční náklady</th>
                                {selectedFunds.map((fund) => (
                                    <td key={fund.ticker}>
                                        {fund.expenseRatio}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <th scope="row">Počet akcií</th>
                                {selectedFunds.map((fund) => (
                                    <td key={fund.ticker}>
                                        {fund.holdings.toLocaleString("cs-CZ")}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <th scope="row">Aktiva ETF</th>
                                {selectedFunds.map((fund) => (
                                    <td key={fund.ticker}>
                                        {formatAssets(fund.assetsMillionsUsd)}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <th scope="row">Dividendy</th>
                                {selectedFunds.map((fund) => (
                                    <td key={fund.ticker}>
                                        {fund.dividendSchedule}
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                ) : (
                    <p className={styles.emptyComparison} role="status">
                        {selectedFunds.length === 0
                            ? "Vyberte dvě ETF a zobrazí se jejich srovnání."
                            : "Vyberte ještě druhé ETF pro zobrazení srovnání."}
                    </p>
                )}
            </div>

            {hasComparison && (
                <details className={styles.comparisonDetails}>
                    <summary>Podrobnosti a rizika</summary>
                    <div className={styles.detailsGrid}>
                        {selectedFunds.map((fund) => (
                            <div key={fund.ticker}>
                                <h3>{fund.ticker}</h3>
                                <p>
                                    <strong>Index:</strong> {fund.index}
                                </p>
                                <p>
                                    <strong>Na co dát pozor:</strong>{" "}
                                    {fund.risk}
                                </p>
                            </div>
                        ))}
                    </div>
                </details>
            )}
        </section>
    );
}
