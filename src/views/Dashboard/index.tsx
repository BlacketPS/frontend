import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Navigate } from "react-router-dom";
import { useLoading } from "@stores/LoadingStore/index";
import { useModal } from "@stores/ModalStore";
import { useUser } from "@stores/UserStore/index";
import { useCachedUser } from "@stores/CachedUserStore/index";
import { useData } from "@stores/DataStore/index";
import { useResource } from "@stores/ResourceStore/index";
import { useUsers } from "@controllers/users/useUsers/index";
import { Button, ImageOrVideo, Username } from "@components/index";
import { LevelContainer, LookupUserModal, SmallButton, SectionHeader, StatContainer } from "./components";
import styles from "./dashboard.module.scss";

import { PrivateUser, PublicUser } from "blacket-types";

export default function Dashboard() {
    const { setLoading } = useLoading();
    const { createModal } = useModal();
    const { user, getUserAvatarPath } = useUser();
    const { cachedUsers, addCachedUserWithData } = useCachedUser();
    const { blooks, banners, titleIdToText } = useData();
    const { resourceIdToPath } = useResource();

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

    return (
        <div className={styles.parentHolder}>
            <div className={`${styles.section} ${styles.userSection}`}>
                <div className={styles.userTopProfile}>
                    <div className={styles.userBannerBlook}>
                        <ImageOrVideo className={styles.userAvatar} src={getUserAvatarPath(viewingUser)} alt="User Avatar" draggable={false} />
                        <div className={styles.bannerLevel}>
                            <div className={styles.userBanner}>
                                <img src={resourceIdToPath(viewingUser.bannerId)} alt="User Banner" draggable={false} />
                                <div className={styles.userInfoContainer}>
                                    <div className={styles.usernameAndTitleContainer}>
                                        <Username className={styles.username} user={viewingUser} />
                                        <span className={styles.title}>{titleIdToText(viewingUser.titleId)}</span>
                                    </div>
                                </div>
                            </div>

                            <LevelContainer experience={viewingUser.experience} />
                        </div>
                    </div>

                    <div className={styles.smallButtonContainer}>
                        <SmallButton icon="fas fa-user-plus" onClick={() => createModal(<LookupUserModal onClick={viewUser} />)}>Lookup User</SmallButton>
                        {viewingUser.id === user.id && <SmallButton icon="fas fa-star" onClick={() => { }}>Daily Rewards</SmallButton>}
                        <SmallButton icon="fas fa-cart-shopping" onClick={() => { 
                            navigate("/store");
                        }}>Store</SmallButton>
                        {viewingUser.id !== user.id && <SmallButton icon="fas fa-reply" onClick={() => {
                            setViewingUser(user);

                            navigate("/dashboard");
                        }}>Go Back</SmallButton>}
                    </div>

                    <div className={styles.userBadges}>
                        <div>
                            <img src="https://blacket.org/content/badges/Tester.webp" />
                        </div>
                    </div>

                    {viewingUser.discord && <div className={styles.discordContainer}>
                        <div className={styles.discordAvatarContainer}>
                            <img
                                src={`https://cdn.discordapp.com/avatars/${viewingUser.discord.discordId}/${viewingUser.discord.avatar}.webp`}
                                onError={(e) => e.currentTarget.src = "https://cdn.discordapp.com/embed/avatars/0.png"}
                                draggable={false}
                            />
                            <i className="fab fa-discord" />
                        </div>
                        <span>{viewingUser.discord.username}</span>
                    </div>}
                </div>
            </div>

            <div className={`${styles.section} ${styles.statsSection}`}>
                <div className={styles.statsContainer}>
                    <div className={styles.statsContainerHolder}>
                        <StatContainer title="User ID" icon="https://cdn.blacket.org/static/content/icons/dashboardStatsUserID.png" value={viewingUser.id} />
                        <StatContainer title="Tokens" icon="https://cdn.blacket.org/static/content/token.png" value={viewingUser.tokens.toLocaleString()} />
                        <StatContainer title="Experience" icon="https://cdn.blacket.org/static/content/experience.png" value={viewingUser.experience.toLocaleString()} />
                        <StatContainer title="Blooks Unlocked" icon="https://cdn.blacket.org/static/content/icons/dashboardStatsBlooksUnlocked.png" value={`${Object.keys(viewingUser.blooks).length.toLocaleString()} / ${blooks.length.toLocaleString()}`} />
                        <StatContainer title="Packs Opened" icon="https://cdn.blacket.org/static/content/icons/dashboardStatsPacksOpened.png" value={viewingUser.statistics.packsOpened.toLocaleString()} />
                        <StatContainer title="Messages Sent" icon="https://cdn.blacket.org/static/content/icons/dashboardStatsMessagesSent.png" value={viewingUser.statistics.messagesSent.toLocaleString()} />
                    </div>
                </div>
            </div>

            <div className={`${styles.section} ${styles.friendsSection}`}>
                <div className={styles.friendsContainer}>
                    <div className={styles.friendsTop}>
                        <p>Friends</p>
                        <div>
                            <SmallButton icon="fas fa-arrow-up">Incoming</SmallButton>
                            <SmallButton icon="fas fa-arrow-down">Outgoing</SmallButton>
                        </div>
                    </div>

                    <div className={styles.holdFriends}>
                        You have no friends, go touch grass.
                    </div>
                </div>
            </div>

            <div className={`${styles.section} ${styles.auctionSection}`}>
                <SectionHeader>Auctions</SectionHeader>

                <div className={styles.statsContainer}>
                    <div className={styles.statsContainerHolder}>
                    </div>
                </div>
            </div>

            <div className={`${styles.section} ${styles.guildSection}`}>
                <SectionHeader>Guild</SectionHeader>

                <div className={styles.statsContainer}>
                    <div className={styles.statsContainerHolder}>
                    </div>
                </div>
            </div>

            <div className={`${styles.section} ${styles.inventorySection}`}>
                <SectionHeader>Inventory</SectionHeader>

                <div className={styles.statsContainer}>
                    <div className={styles.statsContainerHolder}>
                    </div>
                </div>
            </div>
        </div>
    );
}