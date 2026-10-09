import styles from "../App.module.css";

export function SiteFooter() {
    return (
        <footer className={styles.footer}>
            <span>ETF v kostce, demonstrační projekt</span>
            <span>Autor: Jan Doležal</span>
        </footer>
    );
}
