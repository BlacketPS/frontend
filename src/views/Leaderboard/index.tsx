import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useLoading } from "@stores/LoadingStore/index";
import { useModal } from "@stores/ModalStore/index";
import { useUser } from "@stores/UserStore/index";
import { useLeaderboard as useLeaderboardStore } from "@stores/LeaderboardStore/index";
import { useLeaderboard as useLeaderboardController } from "@controllers/leaderboard/useLeaderboard/index";
import { Modal } from "@components/index";
import { FilterButton, BigPlacement, LittlePlacement } from "./components";
import styles from "./leaderboard.module.scss";

import { PlacementType } from "./leaderboard.d";
import { PublicUser } from "blacket-types";

export default function Leaderboard() {
    const { setLoading } = useLoading();
    const { createModal } = useModal();
    const { user } = useUser();
    const { leaderboard, sortBy, setSortBy } = useLeaderboardStore();

    const { getLeaderboard } = useLeaderboardController();

    useEffect(() => {
        if (leaderboard) return;

        setLoading("Loading leaderboard");
        getLeaderboard()
            .catch((error: Fetch2Response) => createModal(<Modal.ErrorModal onClick={() => history.back()}>{error.data.message}</Modal.ErrorModal>))
            .finally(() => setLoading(false));
    }, [createModal, getLeaderboard, leaderboard, setLoading]);

    const switchSort = () => sortBy === PlacementType.TOKEN ? setSortBy(PlacementType.EXPERIENCE) : setSortBy(PlacementType.TOKEN);

    if (!user) return <Navigate to="/login" />;

    if (leaderboard) return (
        <>
            <FilterButton onClick={switchSort}>{sortBy === PlacementType.TOKEN ? "Tokens" : "Experience"}</FilterButton>

            <div className={styles.wrapper}>
                {leaderboard[sortBy === PlacementType.TOKEN ? "tokens" : "experience"].slice(0, 3).map((user: PublicUser, i: number) => <BigPlacement key={i} type={sortBy} placement={i + 1} user={user} />)}

                <div className={styles.otherStandings}>
                    <FilterButton mobile={true} onClick={switchSort}>{sortBy === PlacementType.TOKEN ? "Tokens" : "Experience"}</FilterButton>

                    <div className={styles.otherTopThreeStandings}>
                        {leaderboard[sortBy === PlacementType.TOKEN ? "tokens" : "experience"].slice(0, 3).map((user: PublicUser, i: number) => <LittlePlacement key={i} type={sortBy} placement={i + 1} user={user} />)}
                    </div>
                    {leaderboard[sortBy === PlacementType.TOKEN ? "tokens" : "experience"].slice(3).map((user: PublicUser, i: number) => <LittlePlacement key={i} type={sortBy} placement={i + 4} user={user} />)}
                </div>
            </div>
        </>
    );
}
