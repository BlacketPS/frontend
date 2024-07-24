import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Navigate, Link } from "react-router-dom";
import { useLoading } from "@stores/LoadingStore/index";
import { useModal } from "@stores/ModalStore";
import { useUser } from "@stores/UserStore/index";
import { useCachedUser } from "@stores/CachedUserStore/index";
import { useData } from "@stores/DataStore/index";
import { useUsers } from "@controllers/users/useUsers/index";
import { Button, ImageOrVideo } from "@components/index";
import { LookupUserModal, StatContainer } from "./components";
import styles from "./dashboard.module.scss";

import { TopButton } from "./dashboard.d";
import { PrivateUser, PublicUser } from "blacket-types";

export default function Dashboard() {
    const { setLoading } = useLoading();
    const { createModal } = useModal();
    const { user, getUserAvatarPath } = useUser();
    const { cachedUsers, addCachedUserWithData } = useCachedUser();
    const { blooks, fontIdToName, titleIdToText } = useData();

    if (!user) return <Navigate to="/login" />;

    const { getUser } = useUsers();

    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    const [viewingUser, setViewingUser] = useState<PublicUser | PrivateUser>(user);

    const viewUser = (username: string) => new Promise<void>((resolve, reject) => {
        const cachedUser = cachedUsers.find((user) => user.username.toLowerCase() === username.toLowerCase() || user.id === username);

        if (cachedUser) {
            if (cachedUser.id !== user.id) {
                setViewingUser(cachedUser);

                navigate(`/dashboard?name=${cachedUser.username}`);
            } else {
                setViewingUser(user);

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
                    setViewingUser(user);

                    navigate("/dashboard");
                }

                resolve();
            })
            .catch((err) => reject(err));
    });

    useEffect(() => {
        if (!searchParams.get("name")) return;

        setLoading(true);

        viewUser(searchParams.get("name")!)
            .catch(() => {
                setViewingUser(user);

                navigate("/dashboard");
            })
            .finally(() => setLoading(false));
    }, []);

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
                        <ImageOrVideo src={getUserAvatarPath(viewingUser)} alt="User Avatar" />
                        <div className={styles.bannerLevel}>
                            <div className={styles.userBanner}>
                                <img src={"https://cdn.blacket.org/static/content/banners/Default.png"} alt="User Banner" />
                                <p className={
                                    user.color === "rainbow" ? "rainbow" : ""
                                } style={{
                                    color: user.color,
                                    fontFamily: fontIdToName(viewingUser.fontId)
                                }}>{viewingUser.username}</p>
                                <p>{titleIdToText(viewingUser.titleId)}</p>
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
                            <img src="https://blacket.org/content/badges/Tester.webp" />
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
                        <StatContainer title="User ID" icon="https://cdn.blacket.org/static/content/icons/dashboardStatsUserID.png" value={viewingUser.id} />
                        <StatContainer title="Tokens" icon="https://cdn.blacket.org/static/content/icons/dashboardStatsTokens.png" value={viewingUser.tokens.toLocaleString()} />
                        <StatContainer title="Experience" icon="https://cdn.blacket.org/static/content/icons/dashboardStatsExperience.png" value={viewingUser.experience.toLocaleString()} />
                        <StatContainer title="Blooks Unlocked" icon="https://cdn.blacket.org/static/content/icons/dashboardStatsBlooksUnlocked.png" value={`${Object.keys(viewingUser.blooks).length.toLocaleString()} / ${blooks.length.toLocaleString()}`} />
                        <StatContainer title="Packs Opened" icon="https://cdn.blacket.org/static/content/icons/dashboardStatsPacksOpened.png" value={viewingUser.statistics.packsOpened.toLocaleString()} />
                        <StatContainer title="Messages Sent" icon="https://cdn.blacket.org/static/content/icons/dashboardStatsMessagesSent.png" value={viewingUser.statistics.messagesSent.toLocaleString()} />
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
