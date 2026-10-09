import { useEffect, useRef, useState } from "react";
import type { useFunnelTracking } from "../hooks";
import { useLeadDemo } from "../hooks";
import shared from "../styles/shared.module.css";
import styles from "./LeadSection.module.css";

type LeadSectionProps = {
    track: ReturnType<typeof useFunnelTracking>;
};

export function LeadSection({ track }: LeadSectionProps) {
    const { status, submit } = useLeadDemo(track);
    const [consentChecked, setConsentChecked] = useState(false);
    const formRef = useRef<HTMLElement>(null);
    const formViewTracked = useRef(false);

    useEffect(() => {
        const node = formRef.current;
        if (!node) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !formViewTracked.current) {
                    formViewTracked.current = true;
                    track("lead_form_view", "lead");
                    observer.disconnect();
                }
            },
            { threshold: 0.3 },
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [track]);

    return (
        <section
            className={styles.leadSection}
            id="lead"
            ref={formRef}
            aria-labelledby="lead-title"
        >
            <div className={styles.leadLayout}>
                <div>
                    <h2 id="lead-title">
                        Přehled ETF
                        <br />
                        <em>na jednom místě.</em>
                    </h2>
                    <p className={styles.leadDescription}>
                        Po zadání e-mailové adresy obdržíte PDF s podrobným
                        srovnání spousty ETF.
                    </p>
                </div>
                <div className={styles.formCard}>
                    {status === "success" ? (
                        <div role="status" className={styles.success}>
                            <h3>Děkujeme za odběr</h3>
                            <p>
                                Dokument s přehledem ETF se vám přijde v
                                e-mailu.
                            </p>
                        </div>
                    ) : (
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                submit();
                            }}
                        >
                            <label htmlFor="email">Váš e-mail</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                inputMode="email"
                                placeholder="vas@email.cz"
                                required
                                disabled={status === "submitting"}
                            />
                            <div className={styles.consent}>
                                <input
                                    id="privacy-consent"
                                    name="privacyConsent"
                                    type="checkbox"
                                    required
                                    checked={consentChecked}
                                    onChange={(event) =>
                                        setConsentChecked(event.target.checked)
                                    }
                                    disabled={status === "submitting"}
                                />
                                <label htmlFor="privacy-consent">
                                    Souhlasím se zpracováním{" "}
                                    <a
                                        href="#"
                                        onClick={(event) =>
                                            event.preventDefault()
                                        }
                                    >
                                        osobních údajů
                                    </a>
                                    .
                                </label>
                            </div>
                            <button
                                className={`${shared.actionButton} ${styles.submitButton}`}
                                type="submit"
                                disabled={
                                    status === "submitting" || !consentChecked
                                }
                            >
                                {status === "submitting"
                                    ? "Odesílání…"
                                    : "Odeslat"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
