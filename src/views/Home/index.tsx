import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { Button } from "@components/index";
import { HeaderButton, HeroButton, HowColumn, Section, Waves } from "./components/index";
import styles from "./home.module.scss";

export default function Home() {
    const [scrolled, setScrolled] = useState<boolean>(false);
    const [scrolledPastRegister, setScrolledPastRegister] = useState<boolean>(false);

    const PRONOUNCE_AUDIO = new Audio(window.constructCDNUrl("/content/pronunciation.ogg"));

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
            setScrolledPastRegister(window.scrollY > 500);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll)
        };
    }, []);

    const playPronounce = () => {
        PRONOUNCE_AUDIO.currentTime = 0;

        PRONOUNCE_AUDIO.play();
    };

    const name = import.meta.env.VITE_INFORMATION_NAME;
    const pronounceName = import.meta.env.VITE_INFORMATION_PRONUNCIATION;

    return (
        <>
            <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
                <div className={styles.headerInside}>
                    <div className={styles.headerTitle}>
                        {window.innerWidth > 768 ? name : !scrolled ? name : name.charAt(0)}
                    </div>

                    <div className={styles.headerButtons} style={{
                        display: window.innerWidth <= 768 && scrolled ? "flex" : ""
                    }}>
                        <HeaderButton icon="fab fa-discord" to={import.meta.env.VITE_INFORMATION_DISCORD} scrolled={scrolled}>Discord</HeaderButton>
                        <HeaderButton to="/login" scrolled={scrolled}>Login</HeaderButton>

                        {scrolledPastRegister && window.innerWidth > 768 && (
                            <HeaderButton to="/register" scrolled={scrolled}>Register</HeaderButton>
                        )}
                    </div>
                </div>
            </header >

            <main>
                <div className={styles.heroSection}>
                    <div className={styles.heroContainer}>
                        <img src={window.constructCDNUrl("/content/logo.png")} className={styles.heroImageM} />

                        <img src={window.constructCDNUrl("/content/logo.png")} className={styles.heroImage} />

                        <div className={styles.heroCenter}>
                            <div className={styles.heroText}>
                                A fun, competitive,{" "}
                                <TypeAnimation
                                    sequence={[
                                        "trading",
                                        2000,
                                        "collecting",
                                        2000,
                                        "RNG",
                                        2000,
                                        "multiplayer",
                                        2000
                                    ]}
                                    wrapper="span"
                                    speed={50}
                                    repeat={Infinity}
                                />

                                <br />

                                game for everyone!
                            </div>

                            <div className={styles.heroButtons}>
                                <HeroButton to="/register">Register</HeroButton>

                                <HeroButton to="/discord" mobileOnly>Discord</HeroButton>
                                <HeroButton to="/login" mobileOnly>Login</HeroButton>

                                <div className={styles.heroPronounceButton} onClick={playPronounce}>
                                    <i className="fa-solid fa-volume-high" />
                                    Pronounced ("{pronounceName}")
                                </div>
                            </div>
                        </div>

                        <img src={window.constructCDNUrl("/content/logo.png")} className={styles.heroImage} />
                    </div>

                    <div className={`${styles.heroArrowContainer} ${scrolled ? styles.heroArrowContainerScrolled : ""}`}>
                        <i className="fa-solid fa-arrow-down" />
                    </div>
                </div>

                <div className={styles.mainContent}>
                    <div className={styles.normalSection}>
                        <Section header={"More Than a Game"} image={window.constructCDNUrl("/content/logo.png")}>
                            From a real-time Trading Plaza to a dynamic Auction House, {name} goes beyond the basics—it's a full ecosystem, not just a game.
                        </Section>

                        <Section header={"Header 2"} image={window.constructCDNUrl("/content/logo.png")} reverse>
                            Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus.
                        </Section>

                        <Section header={"Growing Community"} image={window.constructCDNUrl("/content/logo.png")}>
                            With 50,000+ users and growing, our community is welcoming, active, and supportive.
                            From friendly staff to helpful peers, you'll always find someone to trade with, compete with, or just vibe with.
                        </Section>
                    </div>

                    <div className={styles.breakSection}>
                        <div className={styles.breakHeader}>
                            Open Source. Open Community.
                        </div>

                        <p className={styles.breakText}>
                            {name} is an open-source project, meaning you can view the source code, contribute, and help us improve the game. We welcome contributions from anyone who wants to help make {name} better!
                        </p>
                    </div>

                    <div className={styles.howSection}>
                        <h3 className={styles.howHeader}>
                            How To Play
                        </h3>

                        <div className={styles.howContainer}>
                            <HowColumn image={window.constructCDNUrl("/content/icons/dashboardStatsMessagesSent.png")}>
                                Chat with the community
                            </HowColumn>

                            <HowColumn image={window.constructCDNUrl("/content/token.png")}>
                                Earn tokens by playing
                            </HowColumn>

                            <HowColumn image={window.constructCDNUrl("/content/icons/dashboardStatsPacksOpened.png")}>
                                Open packs to pull blooks
                            </HowColumn>
                        </div>
                    </div>

                    <div className={styles.normalSection} style={{ marginTop: 100 }}>
                        <Section header={"What Are You Waiting For?"} image={window.constructCDNUrl("/content/logo.png")}>
                            Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus.
                        </Section>
                    </div>
                </div>
            </main>

            <footer className={styles.footer}>
                <Waves />

                <div className={styles.footerWrapper}>
                    <div className={styles.footerContent}>
                        <div className={styles.footerMenuList}>
                            <div className={styles.footerMenuTitle}>Legal</div>
                            <ul>
                                <li>
                                    <Link to="/privacy">Privacy Policy</Link>
                                </li>
                                <li>
                                    <Link to="/terms">Terms of Service</Link>
                                </li>
                                <li>
                                    <Link to="/eula">End User License Agreement</Link>
                                </li>
                            </ul>
                        </div>

                        <div className={styles.footerMenuList}>
                            <div className={styles.footerMenuTitle}>Connect</div>
                            <ul>
                                <li>
                                    <a href="https://discord.gg/blacket">Discord</a>
                                </li>
                            </ul>
                        </div>

                        <div className={styles.footerMenuList}>
                            <div className={styles.footerMenuTitle}>Contact</div>
                            <ul>
                                <li>
                                    <a href="mailto:contact-us@blacket.org">contact-us@blacket.org</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className={styles.copyrightText}>
                        <b>We are not affiliated with Blooket in any way. Do not contact Blooket about any issues you may have with Blacket.</b>
                        <br />
                        <br />
                        Blacket © 2025 All Rights Reserved.
                    </div>
                </div>
            </footer>
        </>
    );
}
