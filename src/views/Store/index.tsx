import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import Textfit from "react-textfit";
import { ImageOrVideo, Input, SidebarBody } from "@components/index";
import { Category } from "./components/index";
import { useUser } from "@stores/UserStore/index";
import styles from "./store.module.scss";
import { Product } from "./store.d";

export default function Store() {
    const { user } = useUser();

    if (!user) return <Navigate to="/login" />;

    const getGreeting = () => {
        const hour = new Date().getHours();
        const username = user.username;

        switch (true) {
            case (hour < 5):
                return `Why are you still awake ${username}? Welcome to the Store!`;
            case (hour < 12):
                return `Good morning ${username}, Welcome to the Store!`;
            case (hour < 18):
                return `Good afternoon ${username}, Welcome to the Store!`;
            case (hour < 22):
                return `Good evening ${username}, Welcome to the Store!`;
            default:
                return `Enjoy your night ${username}, Welcome to the Store!`;
        }
    };

    const [products, setProducts] = useState<Product[]>([
        { name: "Blacket Plus", monthly: true, price: 2.99, lifetime: 29.99, image: window.constructCDNUrl("/content/badges/Plus.png"), colors: ["#071d8b", "#3d8def"], type: "Plan" }
    ]);

    return (
        <>
            <SidebarBody pushOnMobile={false}>
                <div className={styles.container}>
                    <div className={styles.headerContainer}>
                        <Textfit className={styles.headerBigText} mode="single" min={20} max={50}>{getGreeting()}</Textfit>
                        <div className={styles.headerSmallText}>
                            Purchase plans, items, and more to stand out from the crowd to enhance your {import.meta.env.VITE_INFORMATION_NAME} experience!
                        </div>
                    </div>

                    <Category title="Plans" subTitle="Purchase a plan to unlock new features!">
                        {
                            products.filter((product) => product.type === "Plan").map((product, i) => (
                                <div key={i} className={styles.product} style={{ background: `linear-gradient(15deg, ${product.colors[0]}, ${product.colors[1]})` }}>
                                    <ImageOrVideo className={styles.productImage} src={product.image} />
                                    <div className={styles.productText}>
                                        <div className={styles.productTitle}>{product.name}</div>
                                        <div className={styles.productPrice}>${product.price}{product.monthly && " monthly"}</div>
                                        {product.lifetime && <div className={styles.productSubPrice}>${product.lifetime} lifetime</div>}
                                    </div>

                                    {Array.from({ length: 3 }, (_, i) => (
                                        <div key={i} className={styles.shine} />
                                    ))}
                                </div>
                            ))
                        }
                    </Category>
                </div>
            </SidebarBody>

            <Tooltip id="store" place="bottom">What are you looking to purchase today?</Tooltip>
            <div className={styles.rightSide}>
                <ImageOrVideo className={styles.rightSideBlook} src={window.constructCDNUrl("/content/stormi.png")} alt="Stormi" />
                <img className={styles.rightSideStore} src={window.constructCDNUrl("/content/store.png")} alt="Store" data-tooltip-id="store" />
            </div>
        </>
    );
}
