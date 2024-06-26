import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Navigate, Link } from "react-router-dom";
import { useLoading } from "@stores/LoadingStore/index";
import { useModal } from "@stores/ModalStore";
import { useUser } from "@stores/UserStore/index";
import { useCachedUser } from "@stores/CachedUserStore/index";
import { useBlook } from "@stores/BlookStore/index";
import { useUsers } from "@controllers/users/useUsers/index";
import { Button } from "@components/index";
import { LookupUserModal, StatContainer } from "./components";
import useTitleIdToText from "@functions/resources/useTitleIdToText";
import useFontIdToName from "@functions/resources/useFontIdToName";
import useGetAvatarURL from "@functions/resources/useGetAvatarURL";
import styles from "./dashboard.module.scss";

import { TopButton } from "./dashboard.d";
import { PublicUser } from "blacket-types";

export default function Dashboard() {
    const { setLoading } = useLoading();
    const { createModal } = useModal();
    const { user } = useUser();
    const { cachedUsers, addCachedUserWithData } = useCachedUser();
    const { blooks } = useBlook();

    if (!user) return <Navigate to="/login" />;

    const { getUser } = useUsers();

    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    const [viewingUser, setViewingUser] = useState<PublicUser | null>(null);

    const viewUser = (username: string) => new Promise<void>((resolve, reject) => {
        const cachedUser = cachedUsers.find((user) => user.username.toLowerCase() === username.toLowerCase() || user.id === username);

        if (cachedUser) {
            if (cachedUser.id !== user.id) {
                setViewingUser(cachedUser);

                navigate(`/dashboard?name=${cachedUser.username}`);
            } else {
                setViewingUser(null);

                navigate("/dashboard");
            }

            resolve();
        } else getUser(username)
            .then((res) => {
                if (res.data.id !== user.id) {
                    setViewingUser(res.data);

                    addCachedUserWithData(res.data);

                    navigate(`/dashboard?name=${res.data.username}`);
                } else {
                    setViewingUser(null);

                    navigate("/dashboard");
                }

                resolve();
            })
            .catch((err: Fetch2Response) => {
                reject(err);
            });
    });

    useEffect(() => {
        if (!searchParams.get("name")) return;

        setLoading(true);

        viewUser(searchParams.get("name")!)
            .catch(() => {
                setViewingUser(null);

                navigate("/dashboard");
            })
            .finally(() => setLoading(false));
    }, []);

    const avatarURL = useGetAvatarURL(user);
    const titleText = useTitleIdToText(user?.titleId);
    const fontName = useFontIdToName(user?.fontId);

    const topButtons: TopButton[] = [
        { icon: "fas fa-magnifying-glass", text: "Lookup User", onClick: () => createModal(<LookupUserModal onClick={viewUser} />) },
        { icon: "fas fa-star", text: "Daily Rewards", onClick: () => { } },
        { icon: "fas fa-shopping-cart", text: "Store", link: "/store" }
    ];

    return (
        <div className={styles.parentHolder}>
            <div className={styles.section}>
                <div className={styles.userTopProfile}>
                    <div className={styles.userBannerBlook}>
                        <img src={avatarURL} alt="User Avatar" />
                        <div className={styles.bannerLevel}>
                            <div className={styles.userBanner}>
                                <img src={"https://cdn.blacket.org/static/content/banners/Default.png"} alt="User Banner" />
                                <p className={
                                    user.color === "rainbow" ? "rainbow" : ""
                                } style={{
                                    color: user.color,
                                    fontFamily: fontName
                                }}>{user.username}</p>
                                <p>{titleText}</p>
                            </div>
                            <div className={styles.levelBarContainer}>
                                <div className={styles.levelBar}>
                                    <div />
                                </div>
                                <div className={styles.levelStarContainer}>
                                    <img src="https://cdn.blacket.org/static/content/levelStar.png" alt="Level Star" />
                                    <div>0</div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.smallButtonContainer}>
                            {topButtons.map((button, index) => (
                                <Button.GenericButton
                                    key={index}
                                    to={button.link}
                                    backgroundColor="var(--primary-color)"
                                    className={styles.smallButton}
                                    icon={button.icon}
                                    onClick={button.onClick}
                                >
                                    {button.text}
                                </Button.GenericButton>
                            ))}
                        </div>
                    </div>

                    <div className={styles.userBadges}>
                        <div>
                            <img src="https://blacket.org/content/badges/Tester.png" />
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.section}>
                {topButtons.map((button, index) => (
                    button.link ? <Link key={index} to={button.link} className={styles.topRightButton}>
                        <i className={button.icon} />
                        <div>{button.text}</div>
                    </Link> : <div key={index} className={styles.topRightButton} onClick={button.onClick}>
                        <i className={button.icon} />
                        <div>{button.text}</div>
                    </div>
                ))}
            </div>
            <div className={styles.section}>
                <div className={styles.containerHeader}>
                    <div className={styles.containerHeaderInside}>
                        Stats
                    </div>
                </div>
                <div className={styles.statsContainer}>
                    <div className={styles.statsContainerHolder}>
                        <StatContainer title="User ID" icon="https://cdn.blacket.org/static/content/icons/dashboardStatsUserID.png" value={user.id} />
                        <StatContainer title="Tokens" icon="https://cdn.blacket.org/static/content/icons/dashboardStatsTokens.png" value={user.tokens.toLocaleString()} />
                        <StatContainer title="Experience" icon="https://cdn.blacket.org/static/content/icons/dashboardStatsExperience.png" value={user.experience.toLocaleString()} />
                        <StatContainer title="Blooks Unlocked" icon="https://cdn.blacket.org/static/content/icons/dashboardStatsBlooksUnlocked.png" value={`${Object.keys(user.blooks).length.toLocaleString()} / ${blooks.length.toLocaleString()}`} />
                        <StatContainer title="Packs Opened" icon="https://cdn.blacket.org/static/content/icons/dashboardStatsPacksOpened.png" value={user.statistics.packsOpened.toLocaleString()} />
                        <StatContainer title="Messages Sent" icon="https://cdn.blacket.org/static/content/icons/dashboardStatsMessagesSent.png" value={user.statistics.messagesSent.toLocaleString()} />
                    </div>
                </div>
            </div>
            <div className={styles.section}>
                <div className={styles.friendsContainer}>
                    <div className={styles.friendsTop}>
                        <p>Friends</p>
                        <div>
                            <Button.GenericButton backgroundColor="var(--primary-color)" icon="fas fa-arrow-up">Pending</Button.GenericButton>
                            <Button.GenericButton backgroundColor="var(--primary-color)" icon="fas fa-arrow-down">Outgoing</Button.GenericButton>
                            <Button.GenericButton backgroundColor="var(--primary-color)">
                                <i className="fas fa-cog" />
                            </Button.GenericButton>
                        </div>
                    </div>
                    <div className={styles.holdFriends}>
                        You have no friends, go outside.
                    </div>
                </div>
            </div>
            <div className={styles.section}>
                auction
            </div>
            <div className={styles.section}>
                guild
            </div>
        </div>
    );
}
