import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useLoading } from "@stores/LoadingStore/index";
import { useModal } from "@stores/ModalStore/index";
import { useUser } from "@stores/UserStore/index";
import { useCachedUser } from "@stores/CachedUserStore/index";
import { useLeaderboard as useLeaderboardStore } from "@stores/LeaderboardStore/index";
import { useLeaderboard as useLeaderboardController } from "@controllers/leaderboard/useLeaderboard/index";
import { Modal } from "@components/index";
import { FilterButton, LittlePlacement } from "./components";
import styles from "./leaderboard.module.scss";

import { PlacementType } from "./leaderboard.d";

export default function Leaderboard() {
    const { setLoading } = useLoading();
    const { createModal } = useModal();
    const { user } = useUser();
    const { addCachedUser, getCachedUser } = useCachedUser();

    if (!user) return <Navigate to="/login" />;

    const { leaderboard, sortBy, setSortBy } = useLeaderboardStore();

    const { getLeaderboard } = useLeaderboardController();


    useEffect(() => {
        const addUsers = async () => {
            if (!leaderboard) return;

            await Promise.all([
                ...leaderboard.diamonds.map(async (u) => await addCachedUser(u)),
                ...leaderboard.experience.map(async (u) => await addCachedUser(u))
            ]);
        };

        if (leaderboard) addUsers();
        else {
            setLoading("Loading leaderboard");
            getLeaderboard()
                .catch((err: Fetch2Response) => createModal(<Modal.ErrorModal onClick={() => history.back()}>{err.data.message}</Modal.ErrorModal>))
                .finally(() => setLoading(false));
        }
    }, [leaderboard]);

    const switchSort = () => sortBy === PlacementType.DIAMONDS ? setSortBy(PlacementType.EXPERIENCE) : setSortBy(PlacementType.DIAMONDS);

    if (leaderboard) return (
        <div className={styles.wrapper}>
            <div className={styles.otherStandings}>
                <FilterButton mobile={true} onClick={switchSort}>{sortBy === PlacementType.DIAMONDS ? "Diamonds" : "Experience"}</FilterButton>

                <div className={styles.otherTopThreeStandings}>
                    {leaderboard[sortBy === PlacementType.DIAMONDS ? "diamonds" : "experience"]
                        .map((user, i: number) => getCachedUser(user) && <LittlePlacement key={i} type={sortBy} placement={i + 1} user={getCachedUser(user)!} />)}
                </div>

            </div>
        </div>
    );
}
