import { Navigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { ImageOrVideo } from "@components/index";
import Textfit from "@namhong2001/react-textfit";
import { useUser } from "@stores/UserStore/index";
import styles from "./store.module.scss";

const blooks = [
    "/content/blooks/Bia.webm"
];

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
                return `Good Morning ${username}, Welcome to the Store!`;
            case (hour < 18):
                return `Good Afternoon ${username}, Welcome to the Store!`;
            case (hour < 22):
                return `Good Evening ${username}, Welcome to the Store!`;
            default:
                return `Good Night ${username}, Welcome to the Store!`;
        }
    };

    return (
        <>
            <div className={styles.container}>
                <div className={styles.headerContainer}>
                    <Textfit className={styles.headerBigText} mode="single" min={20} max={50}>{getGreeting()}</Textfit>
                    <div className={styles.headerSmallText}>
                        Purchase plans, items, and more to stand out from the crowd to enhance your {import.meta.env.VITE_INFORMATION_NAME} experience!
                    </div>
                </div>

                <div className={styles.category}>
                    <div className={styles.categoryTitle}>Plans</div>
                    <div className={styles.categorySubTitle}>Purchase a plan to unlock new features!</div>
                    <div className={styles.categoryDivider} />
                    <div className={styles.categoryProducts}>
                        <div className={styles.product}>
                            <div className={styles.productImage} />
                            <div className={styles.productTitle}>Premium</div>
                            <div className={styles.productDescription}>Unlock new features and support the developers!</div>
                            <div className={styles.productPrice}>$5.00</div>
                        </div>
                    </div>
                </div>
            </div>

            <Tooltip id="store" place="bottom">What are you looking to purchase today?</Tooltip>
            <div className={styles.rightSide}>
                <ImageOrVideo className={styles.rightSideBlook} src={import.meta.env.VITE_CDN_URL + blooks[Math.floor(Math.random() * blooks.length)]} alt="Blook" />
                <img className={styles.rightSideStore} src={import.meta.env.VITE_CDN_URL + "/content/store.png"} alt="Store" data-tooltip-id="store" />
            </div>
        </>
    );
}
