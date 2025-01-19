

import { useState, useEffect } from "react";
import { Title, UpdatedAt, Section } from "./components";
import styles from "./legal.module.scss";

import { LegalObject } from "./legal.d";

export default function Legal() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [terms, setTerms] = useState<LegalObject | null>(null);
    const [privacy, setPrivacy] = useState<LegalObject | null>(null);
    const [eula, setEula] = useState<LegalObject | null>(null);

    useEffect(() => {
        Promise.all([
            window.fetch2.get(window.constructCDNUrl("/terms.json"))
                .then((res) => setTerms(res.data))
                .catch((error) => setError(error?.data?.message || "Something went wrong.")),
            window.fetch2.get(window.constructCDNUrl("/privacy.json"))
                .then((res) => setPrivacy(res.data))
                .catch((error) => setError(error?.data?.message || "Something went wrong.")),
            window.fetch2.get(window.constructCDNUrl("/eula.json"))
                .then((res) => setEula(res.data))
                .catch((error) => setError(error?.data?.message || "Something went wrong."))
        ])
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;

            if (hash) {
                const element = document.querySelector(hash);
                if (element) element.scrollIntoView({ behavior: "smooth" });
            }
        };

        window.addEventListener("hashchange", handleHashChange);
        handleHashChange();

        return () => {
            window.removeEventListener("hashchange", handleHashChange);
        };
    }, [loading]);

    return (
        <div className={styles.containerContainer}>
            <div className={styles.container}>
                {!error && terms && privacy && eula ? <>
                    <div id="terms">
                        <Title>TERMS OF SERVICE</Title>
                        <UpdatedAt date={terms.updatedAt} />

                        <div style={{ marginTop: 20 }}>
                            {terms.sections.map((section, index) => <Section key={index} title={section.title}>{section.content}</Section>)}
                        </div>
                    </div>

                    <div id="privacy">
                        <Title>PRIVACY POLICY</Title>
                        <UpdatedAt date={privacy.updatedAt} />

                        <div style={{ marginTop: 20 }}>
                            {privacy.sections.map((section, index) => <Section key={index} title={section.title}>{section.content}</Section>)}
                        </div>
                    </div>

                    <div id="eula">
                        <Title>END USER LICENSE AGREEMENT</Title>
                        <UpdatedAt date={eula.updatedAt} />

                        <div style={{ marginTop: 20 }}>
                            {eula.sections.map((section, index) => <Section key={index} title={section.title}>{section.content}</Section>)}
                        </div>
                    </div>
                </> : error ? <h1>{error}</h1>
                    : loading && <h1>Loading...</h1>
                }
            </div>
        </div>
    );
}
