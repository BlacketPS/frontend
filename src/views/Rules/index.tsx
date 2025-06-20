import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useUser } from "@stores/UserStore/index";
import { useModal } from "@stores/ModalStore/index";
import { Button } from "@components/index";
import { TooFastModal } from "./components/index";
import styles from "./rules.module.scss";

import { RuleObject } from "./rules.d";

export default function Rules() {
    const { user } = useUser();
    if (!user) return <Navigate to="/login" replace />;

    const { createModal } = useModal();

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [startedReading] = useState<Date>(new Date());
    const [rules, setRules] = useState<RuleObject | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        window.fetch2.get(window.constructCDNUrl("/rules.json"))
            .then((res) => setRules(res.data))
            .catch(() => setError("Something went wrong."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return "Loading...";
    else if (error) return error;
    else if (rules) return (
        <div className={styles.container}>
            <div className={styles.rulesContainer}>
                <h2>{rules.header}</h2>

                {rules.rules.map((rule, index) => <div key={index}>
                    <h1>{rule.name}</h1>
                    <ReactMarkdown>{rule.content}</ReactMarkdown>
                </div>
                )}

                <h2>{rules.footer}</h2>

                <Button.ClearButton
                    className={styles.button}
                    onClick={() => {
                        const timeTaken = new Date().getTime() - startedReading.getTime();
                        if (timeTaken < 60000) return createModal(<TooFastModal startedReading={startedReading} />);

                        window.fetch2.patch("/api/users/read-rules", {});

                        navigate("/dashboard");
                    }}
                >
                    I Agree
                </Button.ClearButton>
            </div>
        </div>
    );
}
