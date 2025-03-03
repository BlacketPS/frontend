import stylesLanding from "../landing.module.scss";
import { motion } from "framer-motion";

type Blook = {
    src: string;
    alt: string;
};

export function AnimatedBlookPresent() {
    const transformationsForX: string[] = ["-200%", "-125%", "-50%", "25%", "100%"];

    const blooks: Blook[] = [
        {
            src: "https://lh3.google.com/u/0/d/1sv4UCkTKwOu8PHGdEDrqwoRQkVjwLEUt=w1403-h945-iv1",
            alt: "Zombie"
        },
        {
            src: "https://lh3.google.com/u/0/d/1g6PMR3RZYX56j9J75_toJAEhC9YLV_FU=w1403-h945-iv1",
            alt: "Dragon"
        },
        {
            src: "https://blacket.org/content/blooks/Zoey.webp",
            alt: "Zoey"
        },
        {
            src: "https://lh3.google.com/u/0/d/1jUPSLHoHJ-7aN_Fd7BjERL8SbjkbXVaE=w1403-h945-iv1",
            alt: "Slime Monster"
        },
        {
            src: "https://lh3.google.com/u/0/d/1MWzW5dmzgoW2ya_o_B-3RMYLyGATHO1_=w1920-h945-iv1",
            alt: "Box TV"
        }
    ];

    const topVariant1 = {
        hidden: { opacity: 0, y: -5 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                ease: "easeOut",
                duration: 0.5
            }
        }
    };

    const topVariant2 = {
        hidden: { opacity: 0, y: -5 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                ease: "easeOut",
                duration: 0.5,
                delay: 0.25
            }
        }
    };

    return (
        <div className={stylesLanding.holdTopLanding}>
            <div className={stylesLanding.titleContainer}>
                <motion.h1
                    className={stylesLanding.title}
                    initial="hidden"
                    animate="visible"
                    variants={topVariant1}
                >
                    Blacket
                </motion.h1>
                <motion.p
                    className={stylesLanding.subTitle}
                    initial="hidden"
                    animate="visible"
                    variants={topVariant2}
                >
                    Buy 'em, trade 'em, sell 'em
                </motion.p>
            </div>

            {
                transformationsForX.map((transformation, i) => (
                    <motion.img
                        key={i}
                        src={blooks[i].src}
                        alt={blooks[i].alt}
                        className={stylesLanding.blookTop}
                        initial={{ opacity: 0, transform: `translate(${transformation}, 100%)` }}
                        animate={{ opacity: 1, transform: `translate(${transformation}, 0)` }}
                        transition={{ ease: "easeOut", duration: 0.75, delay: i * 0.25 }}
                    />
                ))
            }
        </div>
    );
}
