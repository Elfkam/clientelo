import styles from '../App.module.css'

export function PrivacySection() {
  return (
    <section className={styles.privacy} id="privacy" aria-labelledby="privacy-title"><h2 id="privacy-title">Soukromí této ukázky</h2><p>E-mailová adresa zůstává jen v poli formuláře ve vašem prohlížeči. Ukázka ji neodesílá, neukládá ani nepřidává do analytických událostí. Po obnovení stránky se ztratí.</p></section>
  )
}
