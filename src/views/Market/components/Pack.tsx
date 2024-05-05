import styles from "../market.module.scss";

import { PackProps } from "../market.d";

export default function Pack({ pack, onClick }: PackProps) {
    return (
        <div className={styles.packContainer} style={{ background: `radial-gradient(circle, ${pack.innerColor} 0%, ${pack.outerColor} 100%)` }} onClick={onClick}>
            <div className={styles.packImageContainer}>
                <img className={styles.packShadow} src={pack.image} />
                <img className={styles.packImage} src={pack.image} />
            </div>

            <div className={styles.packBottom}>
                <img src="/content/token.png" />
                {pack.price}
            </div>
        </div>
    );
}
