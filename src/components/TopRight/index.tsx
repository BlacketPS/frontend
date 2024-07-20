import { useUser } from "@stores/UserStore";
import { ExperienceBalance, TokenBalance, UserDropdown } from "./components";
import styles from "./topRight.module.scss";

import { TopRightProps } from "./topRight.d";
import { useEffect } from "react";

export default function TopRight({ content }: TopRightProps) {
    const { user } = useUser();

    useEffect(() => {
        document.body.setAttribute("has-top-right", "true");

        return () => {
            document.body.removeAttribute("has-top-right");
        };
    }, []);

    if (!user) return null;

    if (user) return (
        <div className={styles.container}>
            {content.includes("experience") && <ExperienceBalance user={user} />}
            {content.includes("tokens") && <TokenBalance user={user} />}

            {user && <UserDropdown user={user} />}
        </div>
    );
}
