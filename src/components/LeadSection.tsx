import { useEffect, useRef } from "react";
import styles from "../App.module.css";
import type { useFunnelTracking } from "../hooks";
import { useLeadDemo } from "../hooks";

type LeadSectionProps = {
    track: ReturnType<typeof useFunnelTracking>;
};

export function LeadSection({ track }: LeadSectionProps) {
    const { status, message, submit } = useLeadDemo(track);
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
                            <span aria-hidden="true">✓</span>
                            <h3>Děkujeme za odběr</h3>
                            <p>
                                Dokument s přehledem ETF jsme vám právě odeslali
                                na zadanou e-mailovou adresu.
                            </p>
                        </div>
                    ) : (
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                const data = new FormData(event.currentTarget);
                                submit(String(data.get("email") || ""));
                            }}
                            noValidate
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
                                aria-describedby="form-message"
                                disabled={status === "submitting"}
                            />
                            <button
                                className={styles.submitButton}
                                type="submit"
                                disabled={status === "submitting"}
                            >
                                {status === "submitting"
                                    ? "Načítání…"
                                    : "Vyzkoušet odeslání"}{" "}
                                <span aria-hidden="true">↗</span>
                            </button>
                            <p
                                id="form-message"
                                className={styles.formMessage}
                                role={status === "error" ? "alert" : "status"}
                            >
                                {message}
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
