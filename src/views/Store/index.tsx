import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import Textfit from "react-textfit";
import { ImageOrVideo, SidebarBody } from "@components/index";
import { Category, Product, ProductModal } from "./components/index";
import { useUser } from "@stores/UserStore/index";
import { useLoading } from "@stores/LoadingStore/index";
import { useModal } from "@stores/ModalStore/index";
import { useData } from "@stores/DataStore/index";
import { useProducts } from "@controllers/stripe/useProducts/index";
import styles from "./store.module.scss";

export default function Store() {
    const { user } = useUser();
    if (!user) return <Navigate to="/login" />;

    const { setLoading } = useLoading();
    const { createModal } = useModal();
    const { stores, setStores } = useData();

    const { getProducts } = useProducts();

    useEffect(() => {
        if (stores.length) return;

        setLoading(true);

        getProducts()
            .then((res) => setStores(res))
            .catch(() => setStores([]))
            .finally(() => setLoading(false));
    }, [stores]);

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

                    {stores
                        .sort((a, b) => a.priority - b.priority)
                        .map((store, i) => (
                            <Category key={i} title={store.name} subTitle={store.description}>
                                {store.products && store.products
                                    .sort((a, b) => a.priority - b.priority)
                                    .map((product, i) => <Product
                                        key={i}
                                        product={product}
                                        onClick={() => createModal(<ProductModal product={product} />)}
                                    />)}
                            </Category>
                        ))}
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
