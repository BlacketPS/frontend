import { useEffect, useState } from "react";
import { useCachedUser } from "@stores/CachedUserStore/index";
import { useModal } from "@stores/ModalStore/index";
import { CreditContainer, CreditModal } from "./components";
import styles from "./credits.module.scss";

import { CreditUser, Credit } from "./credits.d";

export default function Credits() {
    const [users, setUsers] = useState<CreditUser[]>([]);

    const { addCachedUser } = useCachedUser();
    const { createModal } = useModal();

    const credits: Credit[] = [
        {
            user: "test",
            description: "test ".repeat(100)
        }
    ];

    useEffect(() => {
        Promise.all(credits.map(async (credit) => {
            const user = await addCachedUser(credit.user);

            return { ...credit, user };
        })).then((users) => setUsers(users));
    }, []);

    return (
        <div className={styles.container}>
            {users.length > 0 && users.map((credit, index) => <CreditContainer
                key={index}
                credit={credit}
                onClick={() => createModal(<CreditModal credit={credit} />)}
            />)}
        </div>
    );
}
