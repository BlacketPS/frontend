

import { useState, useEffect } from "react";
import { Title, UpdatedAt, Section } from "./components";
import styles from "./legal.module.scss";

import { LegalObject } from "./legal.d";

export default function Legal() {
    const [error, setError] = useState<string | null>(null);

    const [terms, setTerms] = useState<LegalObject | null>(null);
    const [privacy, setPrivacy] = useState<LegalObject | null>(null);
    const [eula, setEula] = useState<LegalObject | null>(null);

    useEffect(() => {
        window.fetch2.get(window.constructCDNUrl("/terms.json"))
            .then((res) => setTerms(res.data))
            .catch((error) => setError(error?.data?.message || "Something went wrong."));
        window.fetch2.get(window.constructCDNUrl("/privacy.json"))
            .then((res) => setPrivacy(res.data))
            .catch((error) => setError(error?.data?.message || "Something went wrong."));
        window.fetch2.get(window.constructCDNUrl("/eula.json"))
            .then((res) => setEula(res.data))
            .catch((error) => setError(error?.data?.message || "Something went wrong."));
    }, []);

    return (
        <div className={styles.containerContainer}>
            <div className={styles.container}>
                {!error && terms && privacy && eula ? <>
                    <Title>TERMS OF SERVICE</Title>
                    <UpdatedAt date={terms.updatedAt} />

                    <div style={{ marginTop: 20 }}>
                        {terms.sections.map((section, index) => <Section key={index} title={section.title}>{section.content}</Section>)}
                    </div>

                    <Title>PRIVACY POLICY</Title>
                    <UpdatedAt date={privacy.updatedAt} />

                    <div style={{ marginTop: 20 }}>
                        {privacy.sections.map((section, index) => <Section key={index} title={section.title}>{section.content}</Section>)}
                    </div>

                    <Title>END USER LICENSE AGREEMENT</Title>
                    <UpdatedAt date={eula.updatedAt} />

                    <div style={{ marginTop: 20 }}>
                        {eula.sections.map((section, index) => <Section key={index} title={section.title}>{section.content}</Section>)}
                    </div>
                </> : error ? <h1>{error}</h1>
                    : <h1>Loading...</h1>
                }
            </div>
        </div>
    );
}
