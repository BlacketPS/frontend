import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import Textfit from "react-textfit";
import { SidebarBody } from "@components/index";
import { Category, Product, ProductModal } from "./components/index";
import { useUser } from "@stores/UserStore/index";
import { useLoading } from "@stores/LoadingStore/index";
import { useModal } from "@stores/ModalStore/index";
import { useData } from "@stores/DataStore/index";
import { useStores } from "@controllers/stripe/useProducts/index";
import styles from "./store.module.scss";

export default function Store() {
    const { user } = useUser();
    if (!user) return <Navigate to="/login" />;

    const { setLoading } = useLoading();
    const { createModal } = useModal();
    const { stores, setStores, products } = useData();

    const { getStores } = useStores();

    useEffect(() => {
        if (stores.length) return;

        setLoading(true);

        getStores()
            .then((res) => {
                if (res.length) setStores(res);
                else return;
            })
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
                                    .map((productId, i) => {
                                        const product = products.find((p) => p.id === productId);
                                        if (!product) return null;

                                        return (
                                            <Product
                                                key={i}
                                                product={product}
                                                onClick={() => createModal(<ProductModal product={product} />)}
                                            />
                                        );
                                    })}
                            </Category>
                        ))}
                </div>
            </SidebarBody>

            <Tooltip id="store" place="bottom">What are you looking to purchase today?</Tooltip>
            <div className={styles.rightSide}>
                <img className={styles.rightSideStore} src={window.constructCDNUrl("/content/shopkeeper.png")} alt="Shopkeeper" data-tooltip-id="store" />
            </div>
        </>
    );
}
