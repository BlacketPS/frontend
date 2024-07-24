import { useCachedUser } from "@stores/CachedUserStore";
import styles from "./credits.module.scss";
import { Credit } from "./components";
import { PublicUser } from "blacket-types";
import { useUsers } from "@controllers/users/useUsers";
import { useEffect, useState } from "react";

export default function Credits() {
    const { addCachedUserWithData, cachedUsers } = useCachedUser();
    const { getUser } = useUsers();
    const [users, setUsers] = useState<{
        user: PublicUser;
        description: string;
    }[]>([]);

    const credits: {
        user: string;
        description: string;
    }[] = [
            {
                user: "Xotic",
                description: "owner or something idek bad code lol xD"
            },
            {
                user: "zastix",
                description: "very super cute ultimate cute cute cute cute girl girl cute"
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
            // its okay to add the same user multiple times, the store returns if the user is already cached
            addCachedUserWithData(user);

            return {
                user,
                description: credit.description
            };
        })).then((users) => setUsers(users));
    }, []);

    return (
        <div className={styles.container}>
            {users.map((credit, index) => (
                <Credit key={index} {...credit} />
            ))}
        </div>
    );
}
