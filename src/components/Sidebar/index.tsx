import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { useUser } from "@stores/UserStore/index";
import { useChat } from "@stores/ChatStore/index";
import { Button } from "@components/index";

import styles from "./sidebar.module.scss";
import { PermissionTypeEnum } from "@blacket/types";

export default function Sidebar() {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const location = useLocation().pathname.split("/")[1];

    const { user } = useUser();
    const { mentions } = useChat();

    if (!user) return null;

    const pages = {
        left: [
            {
                icon: "fas fa-home",
                text: "Dashboard",
                link: "/dashboard"
            },
            {
                icon: "fas fa-trophy",
                text: "Leaderboard",
                link: "/leaderboard"
            },
            {
                icon: "fas fa-comments",
                text: "Chat",
                link: "/chat",
                isChat: true
            },
            /* {
                icon: "fas fa-scroll",
                text: "Quests",
                link: "/quests"
            }, */
            {
                icon: "fas fa-scale-balanced",
                text: "Trading Plaza",
                link: "/trading-plaza",
                textSizeOverride: 18
            },
            {
                icon: "fas fa-swords",
                text: "Guilds",
                link: "/guilds"
            },
            {
                icon: "fas fa-store",
                text: "Market",
                link: "/market"
            },
            {
                icon: "fas fa-box-open",
                text: "Inventory",
                link: "/inventory"
            },
            {
                icon: "fas fa-building-columns",
                text: "Auction House",
                link: "/auction-house",
                textSizeOverride: 17
            },
            {
                icon: "fas fa-cog",
                text: "Settings",
                link: "/settings"
            },
            {
                icon: "fas fa-newspaper",
                text: "News",
                link: "/news"
            }
        ],
        bottom: [
            {
                icon: "fas fa-heart",
                text: "Credits",
                link: "/credits"
            },

            {
                icon: "fab fa-discord",
                text: "Discord",
                link: "/discord"
            },
            {
                icon: "fab fa-github",
                text: "GitHub",
                link: "/github"
            },
            {
                icon: "fab fa-youtube",
                text: "YouTube",
                link: "/youtube"
            },
            {
                icon: "fab fa-x-twitter",
                text: "X",
                link: "/x"
            }
        ]
    };

    const staffPages = [
        {
            icon: "fas fa-wrench",
            text: "Staff Panel",
            link: "/staff"
        },
        {
            icon: "fas fa-user-gear",
            text: "User Manager",
            link: "/staff/users",
            permission: PermissionTypeEnum.MUTE_USERS,
            textSizeOverride: 18
        },
        {
            icon: "fas fa-flag",
            text: "Report Manager",
            link: "/staff/reports",
            permission: PermissionTypeEnum.MANAGE_REPORTS,
            textSizeOverride: 16
        }
    ];

    return (
        <>
            <div className={styles.sidebar}>
                <Link className={styles.header} to="/dashboard">{import.meta.env.VITE_INFORMATION_NAME}</Link>

                <div className={styles.pageScroller} style={{ height: user.hasPermission(PermissionTypeEnum.VIEW_AUDIT) ? "60%" : undefined }}>
                    {pages.left.map((page, index) => (
                        <Link data-active={location === page.link.slice(1)} key={index} className={styles.page} to={page.link}>
                            <i className={`${styles.pageIcon} ${page.icon}`} />
                            <div className={styles.pageText} style={{ fontSize: page.textSizeOverride || 20 }}>{page.text}</div>

                            {page.isChat && mentions > 0 && <div className={styles.notificationIndicator}>
                                <div>{mentions}</div>
                            </div>}
                        </Link>
                    ))}
                </div>

                {user.hasPermission(PermissionTypeEnum.VIEW_AUDIT) && <div className={styles.pageScrollerStaff}>
                    {staffPages.map((page, index) => (
                        <Link data-active={location === page.link.slice(1)} data-staff={true} key={index} className={styles.page} to={page.link} data-tooltip-id={page.link}>
                            <i className={`${styles.pageIcon} ${page.icon}`} />
                            <div className={styles.pageText} style={{ fontSize: page.textSizeOverride || 20 }}>{page.text}</div>
                        </Link>)
                    )}
                </div>}

                <div className={styles.bottom}>
                    <div className={styles.bottomItems}>
                        {pages.bottom.map((page, index) => (
                            <Link key={index} className={styles.bottomPage} to={page.link} data-tooltip-id={page.link}>
                                <Tooltip id={page.link} place="top">{page.text}</Tooltip>

                                <i className={`${styles.bottomPageIcon} ${page.icon}`} />
                            </Link>
                        ))}
                    </div>

                    <Button.GenericButton to="/store" icon="fas fa-cart-shopping" className={styles.visitStoreButton} backgroundColor="#2b22c2">Visit Store</Button.GenericButton>
                </div>
            </div>

            <div className={styles.mobileNavbar}>
                <Link className={styles.mobileHeader} to="/dashboard">{import.meta.env.VITE_INFORMATION_NAME}</Link>

                <i className={`${styles.mobileHamburgerIcon} fas fa-bars`} onClick={() => setMobileSidebarOpen(true)} />
            </div>

            {mobileSidebarOpen && <div className={styles.mobileSidebarModal} onClick={() => setMobileSidebarOpen(false)} />}
            <div className={styles.mobileSidebar} data-open={mobileSidebarOpen}>
                <i className={`${styles.mobileCloseIcon} fas fa-times`} onClick={() => setMobileSidebarOpen(false)} />

                {pages.left.map((page, index) => (
                    <Link key={index} className={styles.page} onClick={() => setMobileSidebarOpen(false)} data-active={location === page.link.split("/")[1]} to={page.link}>
                        <i className={`${styles.pageIcon} ${page.icon}`} />
                        <div className={styles.pageText} style={{ fontSize: page.textSizeOverride || 20 }}>{page.text}</div>

                        {page.isChat && mentions > 0 && <div className={styles.notificationIndicator}>
                            <div>{mentions}</div>
                        </div>}
                    </Link>
                ))}
                {staffPages.map((page, index) => (
                    <Link data-active={location === page.link.slice(1)} data-staff={true} key={index} className={styles.page} onClick={() => setMobileSidebarOpen(false)} to={page.link} data-tooltip-id={page.link}>
                        <i className={`${styles.pageIcon} ${page.icon}`} />
                        <div className={styles.pageText} style={{ fontSize: page.textSizeOverride || 20 }}>{page.text}</div>
                    </Link>)
                )}

                <div className={styles.bottom}>
                    <div className={styles.bottomItems}>
                        {pages.bottom.map((page, index) => (
                            <Link key={index} className={styles.bottomPage} onClick={() => setMobileSidebarOpen(false)} to={page.link} data-tooltip-id={page.link}>
                                <Tooltip id={page.link} place="top">{page.text}</Tooltip>

                                <i className={`${styles.bottomPageIcon} ${page.icon}`} />
                            </Link>
                        ))}
                    </div>

                    <Button.GenericButton
                        to="/store"
                        icon="fas fa-cart-shopping"
                        className={styles.visitStoreButton}
                        backgroundColor="#2b22c2"
                        onClick={() => setMobileSidebarOpen(false)}
                    >
                        Visit Store
                    </Button.GenericButton>
                </div>
            </div>
        </>
    );
}
