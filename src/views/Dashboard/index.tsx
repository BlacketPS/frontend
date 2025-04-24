import { Fragment, useEffect, useState } from "react";
import { useSearchParams, useNavigate, Navigate } from "react-router-dom";
import { useLoading } from "@stores/LoadingStore/index";
import { useModal } from "@stores/ModalStore";
import { useUser } from "@stores/UserStore/index";
import { useCachedUser } from "@stores/CachedUserStore/index";
import { useData } from "@stores/DataStore/index";
import { useResource } from "@stores/ResourceStore/index";
import { useAuctionHouse } from "@stores/AuctionHouseStore/index";
import { useUsers } from "@controllers/users/useUsers/index";
import { useSearchAuction } from "@controllers/auctions/useSearchAuction/index";
import { useClaimDailyTokens } from "@controllers/quests/useClaimDailyTokens/index";
import { AdUnit, Auction, Blook, ImageOrVideo, Username } from "@components/index";
import { LevelContainer, LookupUserModal, SmallButton, SectionHeader, StatContainer, InventoryBlook, InventoryItem, CosmeticsModal, DailyRewardsModal } from "./components";
import styles from "./dashboard.module.scss";

import { AuctionsAuctionEntity, PrivateUser, PublicUser } from "@blacket/types";
import { CosmeticsModalCategory } from "./dashboard.d";
import { flushSync } from "react-dom";

export default function Dashboard() {
    const { setLoading } = useLoading();
    const { createModal } = useModal();
    const { user, getUserAvatarPath, getUserBannerPath } = useUser();
    const { cachedUsers, addCachedUserWithData } = useCachedUser();
    const { blooks, packs, items, titleIdToText } = useData();
    const { resourceIdToPath } = useResource();
    const { setSearch } = useAuctionHouse();

    if (!user) return <Navigate to="/login" />;

    const { getUser } = useUsers();
    const { searchAuction } = useSearchAuction();
    const { claimDailyTokens } = useClaimDailyTokens();

    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    const [viewingUser, setViewingUser] = useState<PublicUser | PrivateUser>(user);
    const [viewingUserAuctions, setViewingUserAuctions] = useState<AuctionsAuctionEntity[]>([]);

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

    useEffect(() => {
        if (!viewingUser) return;
        if (searchParams.get("name") && viewingUser.id === user.id) return;

        searchAuction({ seller: viewingUser.id })
            .then((res) => setViewingUserAuctions(res.data))
            .catch(() => setViewingUserAuctions([]));
    }, [viewingUser]);

    useEffect(() => {
        if (searchParams.get("name")) return;
        if (viewingUser.id !== user.id) return;

        setViewingUser(user);
    }, [user]);

    const getUserBlookQuantity = (blookId: number) => {
        return viewingUser.blooks.filter((blook) => blook.blookId === blookId).length;
    };

    const getUserShinyBlookQuantity = (blookId: number) => {
        return viewingUser.blooks.filter((blook) => blook.blookId === blookId && blook.shiny).length;
    };

    const hasUserBlook = (blookId: number) => {
        return viewingUser.blooks.some((blook) => blook.blookId === blookId);
    };

    const hasShinyUserBlook = (blookId: number) => {
        return viewingUser.blooks.some((blook) => blook.blookId === blookId && blook.shiny);
    };

    const nonPackBlooks = blooks
        .filter((blook) => !blook.packId)
        .sort((a, b) => a.priority - b.priority);

    const claimableDate = new Date();
    claimableDate.setUTCHours(0, 0, 0, 0);

    return (
        <div className={styles.parentHolder}>
            <div className={`${styles.section} ${styles.userSection}`}>
                <div className={styles.userTopProfile}>
                    <div className={styles.userBannerBlook}>
                        <div
                            className={styles.userAvatarContainer}
                            data-hoverable={viewingUser.id === user.id}
                        >
                            <Blook
                                className={styles.userAvatar}
                                src={getUserAvatarPath(viewingUser)}
                                alt="User Avatar"
                                draggable={false}
                                custom={user.customAvatar ? true : false}
                                shiny={user.avatar?.shiny}
                                onClick={() => {
                                    if (viewingUser.id === user.id) createModal(<CosmeticsModal category={CosmeticsModalCategory.AVATAR} />);
                                }}
                            />
                        </div>
                        <div className={styles.bannerLevel}>
                            <div
                                className={styles.userBanner}
                                data-hoverable={viewingUser.id === user.id}
                                onClick={() => {
                                    if (viewingUser.id === user.id) createModal(<CosmeticsModal category={CosmeticsModalCategory.BANNER} />);
                                }}
                            >
                                <img
                                    src={getUserBannerPath(viewingUser)}
                                    alt="User Banner"
                                    draggable={false}
                                />
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
                        {viewingUser.id === user.id && new Date(user.lastClaimed) < claimableDate && <SmallButton icon="fas fa-star" onClick={() => {
                            setLoading(true);

                            claimDailyTokens()
                                .then((res) => createModal(<DailyRewardsModal amount={res.data.tokens} />))
                                .finally(() => setLoading(false));
                        }}>Daily Rewards</SmallButton>}
                        <SmallButton icon="fas fa-cart-shopping" onClick={() => {
                            navigate("/store");
                        }}>Store</SmallButton>
                        {viewingUser.id !== user.id && <SmallButton icon="fas fa-reply" onClick={() => {
                            setViewingUser(user);

                            navigate("/dashboard");
                        }}>Go Back</SmallButton>}
                    </div>

                    <div className={styles.userBadges}>
                        {viewingUser.badges.sort((a, b) => a.priority - b.priority).map((badge) => badge.imageId && <div className={styles.badgeContainer} key={badge.id}>
                            <ImageOrVideo src={resourceIdToPath(badge.imageId)} alt={badge.name} />
                        </div>)}
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

            <div
                style={{
                    display: "grid",
                    alignSelf: "center",
                    width: "90%"
                }}
            >
                <AdUnit
                    mobileOnly
                    slot={"7833576760"}
                    height={150}
                    style={{ height: 150, marginBottom: 10 }}
                />
            </div>

            <div className={`${styles.section} ${styles.statsSection}`}>
                <div className={styles.statsContainer}>
                    <div className={styles.statsContainerHolder}>
                        <StatContainer title="User ID" icon={window.constructCDNUrl("/content/icons/dashboardStatsUserID.png")} value={viewingUser.id} />
                        {viewingUser.guild && <StatContainer title="Guild" icon={window.constructCDNUrl("/content/icons/dashboardStatsGuild.png")} value={viewingUser.guild ? viewingUser.guild : "None"} />}
                        <StatContainer title="Tokens" icon={window.constructCDNUrl("/content/token.png")} value={viewingUser.tokens.toLocaleString()} />
                        <StatContainer title="Experience" icon={window.constructCDNUrl("/content/experience.png")} value={viewingUser.experience.toLocaleString()} />
                        <StatContainer title="Blooks Unlocked" icon={window.constructCDNUrl("/content/icons/dashboardStatsBlooksUnlocked.png")} value={`${viewingUser.blooks.length.toLocaleString()} / ${blooks.length.toLocaleString()}`} /> {/* TODO: BACKEND (Syfe/Xotic/Zastix): Default blook does NOT count in inventory (yet). REVERT to (blooks.length - 1) when fixed. */}
                        <StatContainer title="Packs Opened" icon={window.constructCDNUrl("/content/icons/dashboardStatsPacksOpened.png")} value={viewingUser.statistics.packsOpened.toLocaleString()} />
                        <StatContainer title="Messages Sent" icon={window.constructCDNUrl("/content/icons/dashboardStatsMessagesSent.png")} value={viewingUser.statistics.messagesSent.toLocaleString()} />
                    </div>
                </div>
            </div>

            <div className={`${styles.section} ${styles.friendsSection}`}>
                <div className={styles.friendsContainer}>
                    <div className={styles.friendsTop}>
                        <p>Friends</p>
                        <div>
                            <SmallButton data-secondary icon="fas fa-arrow-up">Incoming</SmallButton>
                            <SmallButton data-secondary icon="fas fa-arrow-down">Outgoing</SmallButton>
                        </div>
                    </div>

                    <div className={styles.holdFriends}>
                        You don't have any friends. Why don't you make some?
                    </div>
                </div>
            </div>

            <div className={`${styles.section} ${styles.auctionSection}`}>
                <SectionHeader>Auctions</SectionHeader>

                <div className={styles.statsContainer}>
                    <div className={styles.userAuctions}>
                        {viewingUserAuctions.length > 0 ? viewingUserAuctions.map((auction) => <Auction key={auction.id} auction={auction} useVhStyles={true} onClick={() => {
                            setSearch({ seller: viewingUser.username });

                            navigate("/auction-house");
                        }} />) : <div className={styles.noAuctions}>No auctions found.</div>}
                    </div>
                </div>
            </div>

            <div className={`${styles.section} ${styles.inventorySection}`}>
                <SectionHeader>Inventory</SectionHeader>

                <div className={styles.statsContainer}>
                    <div className={styles.inventoryItemsContainer}>
                        <div className={styles.inventoryItems}>
                            {items.sort((a, b) => a.priority - b.priority).map((item) => {
                                const filteredItems = viewingUser.items.filter((i) => i.itemId === item.id);

                                if (filteredItems.length > 0) return filteredItems.map((i) => <InventoryItem key={i.id} item={item} usesLeft={i.usesLeft} />);
                            })}

                            {packs.sort((a, b) => a.priority - b.priority).map((pack) => {
                                const filteredBlooks = blooks
                                    .filter((blook) => blook.packId === pack.id)
                                    .sort((a, b) => a.priority - b.priority);

                                if (filteredBlooks.length > 0) return filteredBlooks.map((blook) => <Fragment key={blook.id}>
                                    {hasUserBlook(blook.id) && <InventoryBlook blook={blook} quantity={getUserBlookQuantity(blook.id)} />}
                                    {hasShinyUserBlook(blook.id) && <InventoryBlook blook={blook} quantity={getUserShinyBlookQuantity(blook.id)} shiny={true} />}
                                </Fragment>);
                            })}

                            {nonPackBlooks.map((blook) => hasUserBlook(blook.id) && <InventoryBlook key={blook.id} blook={blook} quantity={getUserBlookQuantity(blook.id)} />)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
