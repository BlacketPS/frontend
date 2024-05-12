import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Navigate, Link } from "react-router-dom";
import { useLoading } from "@stores/LoadingStore/index";
import { useModal } from "@stores/ModalStore";
import { useUser } from "@stores/UserStore/index";
import { useCachedUser } from "@stores/CachedUserStore/index";
import { useUsers } from "@controllers/users/useUsers/index";
import { Button } from "@components/index";
import { LookupUserModal } from "./components";
import useTitleIdToText from "@functions/resources/useTitleIdToText";
import useFontIdToName from "@functions/resources/useFontIdToName";
import getAvatarURL from "@functions/resources/getAvatarURL";
import styles from "./dashboard.module.scss";

import { TopButton } from "./dashboard.d";

export default function Dashboard() {
    const { setLoading } = useLoading();
    const { createModal } = useModal();
    const { user } = useUser();
    const { cachedUsers, addCachedUserWithData } = useCachedUser();

    const { getUser } = useUsers();

    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    const [viewingUser, setViewingUser] = useState<object | null>(null);

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
                    setViewingUser(res);

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

        viewUser(searchParams.get("name") as string)
            .catch(() => {
                setViewingUser(null);

                navigate("/dashboard");
            })
            .finally(() => setLoading(false));
    }, []);

    const titleText = useTitleIdToText(user?.titleId);
    const fontName = useFontIdToName(user?.fontId);

    if (!user) return <Navigate to="/login" />;

    const topButtons: TopButton[] = [
        { icon: "fas fa-magnifying-glass", text: "Lookup User", onClick: () => createModal(<LookupUserModal onClick={viewUser} />) },
        { icon: "fas fa-star", text: "Daily Rewards", onClick: () => { } },
        { icon: "fas fa-heart", text: "Credits", link: "/credits" },
        { icon: "fab fa-discord", text: "Discord", link: "https://discord.gg/5setU8ye6j" },
        { icon: "fab fa-github", text: "GitHub", link: "https://github.com/XOTlC/Blacket" }
    ];

    return (
        <div className={styles.parentHolder}>
            <div className={styles.section}>
                <div className={styles.userTopProfile}>
                    <div className={styles.userBannerBlook}>
                        <img src={getAvatarURL(user.avatar)} alt="User Avatar" />
                        <div className={styles.bannerLevel}>
                            <div className={styles.userBanner}>
                                <img src={"/content/banners/Default.png"} alt="User Banner" />
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
                                    <img src="https://ac.blooket.com/dashboard/assets/LevelStar-tmvShqvY.svg" alt="Level Star" />
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
                        <div className={styles.statContainer}>
                            <div className={styles.statHeader}>
                                <img src="/content/statsId.png" />
                                User ID
                            </div>
                            <div className={styles.statDivider} />
                            <div className={styles.statValue}>
                                {user.id}
                            </div>
                        </div>
                        <div className={styles.statContainer}>
                            <div className={styles.statHeader}>
                                <img src="/content/statsToken.png" />
                                Tokens
                            </div>
                            <div className={styles.statDivider} />
                            <div className={styles.statValue}>
                                {user.tokens.toLocaleString()}
                            </div>
                        </div>
                        <div className={styles.statContainer}>
                            <div className={styles.statHeader}>
                                <img src="/content/statsUnlocks.png" />
                                Blooks Unlocked
                            </div>
                            <div className={styles.statDivider} />
                            <div className={styles.statValue}>
                                {Object.keys(user.blooks).length.toLocaleString()} / 0
                            </div>
                        </div>
                        <div className={styles.statContainer}>
                            <div className={styles.statHeader}>
                                <img src="/content/statsPack.png" />
                                Packs Opened
                            </div>
                            <div className={styles.statDivider} />
                            <div className={styles.statValue}>
                                {user.statistics.packsOpened.toLocaleString()}
                            </div>
                        </div>
                        <div className={styles.statContainer}>
                            <div className={styles.statHeader}>
                                <img src="/content/statsMessages.png" />
                                Messages Sent
                            </div>
                            <div className={styles.statDivider} />
                            <div className={styles.statValue}>
                                {user.statistics.messagesSent.toLocaleString()}
                            </div>
                        </div>
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
                <div className={`${styles.statsContainer} ${styles.auctionContainer}`}>
                    <div className={styles.containerHeader}>
                        <div className={styles.containerHeaderInside}>
                            Auctions
                        </div>
                    </div>
                    <div className={styles.yourLiveAuctions}>
                        <div className={styles.auction}>
                            <img src="/content/blooks/Default.png" alt="Auction Item" />
                            <div className={styles.auctionInfo}>
                                <p>Item Name</p>
                                <p>Current Bid: 0</p>
                                <p>Time Remaining: 0:00</p>
                            </div>
                        </div>
                    </div>
{/*
                    <div className={styles.auctionStats}>
                        <div>
                            <p>Auctions Listed</p>
                            <span>2<div className={`${styles.auctionStatMod} ${styles.profit}`}><i className="fas fa-circle-up" />+2 past 7d</div></span>
                        </div>

                        <div>
                            <p>Profit Gained</p>
                            <span>14,231<div className={`${styles.auctionStatMod} ${styles.loss}`}><i className="fas fa-circle-down" />-6,520 past 7d</div></span>
                        </div>

                        <div>
                            <p>other</p>
                        </div>
                    </div> */}
                </div>
            </div>
            <div className={styles.section}>
                <div className={styles.guildContainer}>
                    guild
                </div>
            </div>
        </div >
    );
}
