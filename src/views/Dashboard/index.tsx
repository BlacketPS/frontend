import { useEffect, useState } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import { useLoading } from "@stores/LoadingStore/index";
import { useUser } from "@stores/UserStore/index";
import { getUser } from "@controllers/users/index";
import { Button } from "@components/index";

export default function Dashboard() {
    const { setLoading } = useLoading();
    const { user } = useUser();

    const [searchParams] = useSearchParams();

    const [viewingUser, setViewingUser] = useState<object | null>(null);

    useEffect(() => {
        if (!searchParams.get("name")) return;

        setLoading(true);

        getUser(searchParams.get("name") as string)
            .then((res: any) => {
                if (res.id !== user.id) setViewingUser(res);
            })
            .catch(() => setViewingUser(null))
            .finally(() => setLoading(false));
    }, [searchParams, user, setLoading]);

    if (!user) return <Navigate to="/login" />;

    /* return (
        <div className={styles.all.sidebarBody}>
            <div className={styles.dashboard.container}>
                <div className={styles.dashboard.top}>
                    <div className={styles.dashboard.topLeft}>
                        <div className={styles.dashboard.topLeftInside}>
                            <div className={styles.dashboard.topLeftAvatarContainer}>
                                <div className={styles.dashboard.topLeftAvatarContainerInside}>
                                    <img src={user.avatar === null ? "/content/blooks/Default.png" : user.avatar} draggable={false} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) */

    return (
        <>
            {viewingUser ? JSON.stringify(viewingUser) : JSON.stringify(user)}
            {viewingUser && <Button.GenericButton onClick={() => setViewingUser(null)}>Go Back</Button.GenericButton>}
        </>
    );
}
