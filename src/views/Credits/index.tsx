import { useEffect, useState } from "react";
import { useCachedUser } from "@stores/CachedUserStore";
import { useUsers } from "@controllers/users/useUsers";
import { CreditContainer } from "./components";
import styles from "./credits.module.scss";

import { CreditUser } from "./credits.d";

export default function Credits() {
    const [users, setUsers] = useState<CreditUser[]>([]);

    const { addCachedUserWithData, cachedUsers } = useCachedUser();
    const { getUser } = useUsers();

    const credits: { user: string; description: string; }[] = [
        {
            user: "Xotic",
            description: "a very cool person a very cool person a very cool person a very cool person a very cool person for sure bro for sure bro for sure bro for sure bro for sure bro"
        },
        {
            user: "zastix",
            description: "very super ugly ultimate ugly ugly ugly ugly boy boy ugly"
        },
        {
            user: "Rin",
            description: "a girl a a a kangaroo kangaroo kangaroo kangaroo kangaroo"
        },
        {
            user: "allie",
            description: "person person person cute person cute cute cute cute"
        }
    ];

    useEffect(() => {
        Promise.all(credits.map(async (credit) => {
            const user = cachedUsers.find((cachedUser) => cachedUser.username === credit.user) ?? (await getUser(credit.user)).data;

            addCachedUserWithData(user);

            return { user, description: credit.description };
        })).then((users) => setUsers(users));
    }, []);

    return (
        <div className={styles.container}>
            {users.length > 0 && users.map((credit, index) => <CreditContainer key={index} {...credit} />)}
        </div>
    );
}
