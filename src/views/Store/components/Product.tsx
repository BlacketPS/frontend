import { ImageOrVideo } from "@components/index";
import { useResource } from "@stores/ResourceStore/index";
import styles from "../store.module.scss";

import { ProductProps } from "../store.d";

export default function Product({ product }: ProductProps) {
    const { resourceIdToPath } = useResource();

    return (
        <div className={styles.product} style={{ background: `linear-gradient(15deg, ${product.color1}, ${product.color2})` }}>
            <ImageOrVideo className={styles.productImage} src={resourceIdToPath(product.imageId)} />

            <div className={styles.productText}>
                <div className={styles.productTitle}>{product.name}</div>
                <div className={styles.productPrice}>
                    ${product.price} USD
                    {product.isSubscription && " monthly"}
                </div>
                {(product.yearlyPrice || product.lifetimePrice) && (
                    <div className={styles.productSubPrice}>
                        ${product.yearlyPrice || product.lifetimePrice} USD {product.yearlyPrice ? " yearly" : " lifetime"}
                    </div>
                )}
            </div>

            {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className={styles.shine} />
            ))}
        </div>
    );
}
