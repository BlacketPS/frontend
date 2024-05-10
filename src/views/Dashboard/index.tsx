import { useEffect, useState } from "react";
import { useSearchParams, Navigate, Link } from "react-router-dom";
import { useLoading } from "@stores/LoadingStore/index";
import { useModal } from "@stores/ModalStore";
import { useUser } from "@stores/UserStore/index";
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

    const { getUser } = useUsers();

    const [searchParams] = useSearchParams();

    const [viewingUser, setViewingUser] = useState<object | null>(null);

    useEffect(() => {
        if (!searchParams.get("name")) return;

        setLoading(true);

        getUser(searchParams.get("name") as string)
            .then((res) => {
                if (res.data.id !== user.id) setViewingUser(res);
            })
            .catch(() => setViewingUser(null))
            .finally(() => setLoading(false));
    }, []);

    const titleText = useTitleIdToText(user.titleId);
    const fontName = useFontIdToName(user.fontId);

    const topButtons: TopButton[] = [
        { icon: "fas fa-magnifying-glass", text: "Lookup User", onClick: () => createModal(<LookupUserModal />) },
        { icon: "fas fa-scale-balanced", text: "Trading Plaza", link: "/trading-plaza" },
        { icon: "fas fa-heart", text: "Credits", link: "/credits" },
        { icon: "fab fa-discord", text: "Discord", link: "https://discord.gg/5setU8ye6j" },
        { icon: "fab fa-github", text: "GitHub", link: "https://github.com/XOTlC/Blacket" }
    ];

    if (!user) return <Navigate to="/login" />;

    return (
        <div className={styles.parentHolder}>
            <div className={styles.section}>
                <div className={styles.userTopProfile}>
                    <div className={styles.userBannerBlook}>
                        <img src={getAvatarURL(user.avatar)} alt="User Avatar" />
                        <div className={styles.bannerLevel}>
                            <div className={styles.userBanner}>
                                <img src={"/content/banners/Default.png"} alt="User Banner" />
                                <p style={{ fontFamily: fontName }}>{user.username}</p>
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
                    button.link ? <Link to={button.link} className={styles.topRightButton}>
                        <i className={button.icon} />
                        <div>{button.text}</div>
                    </Link> : <div key={index} className={styles.topRightButton} onClick={button.onClick}>
                        <i className={button.icon} />
                        <div>{button.text}</div>
                    </div>
                ))}
            </div>
            <div className={styles.section}>
                <div className={styles.statsContainer}>
                    <p>stats</p>
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
                <div className={styles.statsContainer}>
                    <p>auction listings</p>
                </div>
            </div>
            <div className={styles.section}>
                <div className={styles.guildContainer}>
                    guild
                </div>
            </div>
        </div>
    );
}
