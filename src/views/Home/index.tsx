import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { useUser } from "@stores/UserStore/index";
import { useSound } from "@stores/SoundStore/index";
import { HeaderButton, HeroButton, HeroImage, HowColumn, Section, Waves, Footer } from "./components/index";
import styles from "./home.module.scss";

export default function Home() {
    const { user } = useUser();
    if (user) return <Navigate to="/dashboard" replace />;

    const { playSound } = useSound();

    const [scrolled, setScrolled] = useState<boolean>(false);
    const [scrolledPastRegister, setScrolledPastRegister] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
            setScrolledPastRegister(window.scrollY > 500);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const name = import.meta.env.VITE_INFORMATION_NAME;
    const pronounceName = import.meta.env.VITE_INFORMATION_PRONUNCIATION;

    const playPronounce = async () => playSound("pronounce");

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
                        {/* <img src={window.constructCDNUrl("/content/logo.png")} className={styles.heroImageM} /> */}
                        <HeroImage src={"https://files.catbox.moe/r003j5.webm"} alt="Hero Image" mobile />

                        {/* <img src={window.constructCDNUrl("/content/logo.png")} className={styles.heroImage} /> */}
                        <HeroImage src={"https://files.catbox.moe/r003j5.webm"} alt="Hero Image" />

                        <div className={styles.heroCenter}>
                            <div className={styles.heroText}>
                                A fun, competitive,{" "}
                                <TypeAnimation
                                    sequence={[
                                        "trading",
                                        2000,
                                        "collecting",
                                        2000,
                                        "multiplayer",
                                        2000,
                                        "RNG",
                                        2000,
                                        "community",
                                        2000
                                    ]}
                                    wrapper="span"
                                    speed={50}
                                    repeat={Infinity}
                                />

                                <br />

                                web-game for everyone!
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

                        {/* <img src={window.constructCDNUrl("/content/logo.png")} className={styles.heroImage} /> */}
                        <HeroImage src={"https://files.catbox.moe/r003j5.webm"} alt="Hero Image" />
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

                        <Section header={"Constantly Updating"} image={window.constructCDNUrl("/content/logo.png")} reverse>
                            With regular updates and new features, {name} is always evolving. We listen to our community and strive to make the game better every day.
                        </Section>

                        <Section header={"Always Growing"} image={window.constructCDNUrl("/content/logo.png")}>
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
                                Open packs to pull items
                            </HowColumn>
                        </div>
                    </div>

                    <div className={styles.normalSection} style={{ marginTop: 100 }}>
                        <Section header={"What Are You Waiting For?"} image={window.constructCDNUrl("/content/logo.png")}>
                            Join the fun and start your journey in {name} today! Register now and become part of our growing community!
                        </Section>
                    </div>
                </div>
            </main>

            <footer className={styles.footer}>
                <Waves />

                <Footer />
            </footer>
        </>
    );
}
