import { ImageOrVideo } from "@components/index";
import { useResource } from "@stores/ResourceStore/index";
import { useData } from "@stores/DataStore/index";
import Textfit from "react-textfit";
import styles from "../store.module.scss";

import { ProductProps } from "../store.d";

export default function Product({ product, ...props }: ProductProps) {
    const { resourceIdToPath } = useResource();
    const { fontIdToName } = useData();

    return (
        <div className={styles.product} style={{ background: `linear-gradient(15deg, ${product.color1}, ${product.color2})` }} {...props}>
            <ImageOrVideo className={styles.productImage} src={resourceIdToPath(product.imageId)} draggable={false} />

            <div className={styles.productText}>
                <Textfit
                    mode="single"
                    min={1}
                    max={25}
                    className={styles.productTitle}
                    style={{
                        fontFamily: product.fontId ? fontIdToName(product.fontId) : ""
                    }}
                >
                    {product.name}
                </Textfit>
                {/* <div className={styles.productPrice}>
                    ${product.price} USD
                    {product.isSubscription && " monthly"}
                </div> */}
                {/* {(product.yearlyPrice || product.lifetimePrice) && (
                    <div className={styles.productSubPrice}>
                        ${product.yearlyPrice || product.lifetimePrice} USD {product.yearlyPrice ? " yearly" : " lifetime"}
                    </div>
                )} */}
                {!product.isSubscription
                    ? <div className={styles.productPrice}>
                        ${product.price} USD
                    </div>
                    : <>
                        <div className={styles.productPrice}>
                            ${product.subscriptionPrice} USD monthly
                        </div>
                        {(product.price > 0) && <div className={styles.productSubPrice}>
                            ${product.price} USD lifetime
                        </div>}
                    </>
                }
            </div>

            {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className={styles.shine} />
            ))}
        </div>
    );
}
