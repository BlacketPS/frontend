import { useUser } from "@stores/UserStore";
import { TokenBalance, UserDropdown } from "./components";
import styles from "./topRight.module.scss";

import { TopRightProps } from "./topRight.d";

export default function TopRight({ content }: TopRightProps) {
    const { user } = useUser();

    if (user) return (
        <div className={styles.container}>
            {content.includes("tokens") && <TokenBalance user={user} />}

            {user && <UserDropdown user={user} />}
        </div>
    );
}
