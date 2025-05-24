import { useResource } from "@stores/ResourceStore/index";
import { ImageOrVideo } from "@components/index";
import styles from "../market.module.scss";

import { PackProps } from "../market.d";

export default function Pack({ pack, onClick }: PackProps) {
    const { resourceIdToPath } = useResource();

    return <div className={styles.packContainer2} onClick={onClick}>
        <ImageOrVideo className={styles.packBackground} src={resourceIdToPath(pack.backgroundId)} />

        <div className={styles.packImageHolder}>
            <ImageOrVideo className={styles.packImage} src={resourceIdToPath(pack.imageId)} />
            <ImageOrVideo className={styles.packShadow} src={resourceIdToPath(pack.imageId)} />
        </div>

        <div className={styles.bottomLeftText}>
            <img src={window.constructCDNUrl("/content/token.png")} alt="Token" />
            {pack.price.toLocaleString()}
        </div>
    </div>;

    // return (
    //     <div className={styles.packContainer} onClick={onClick}>
    //         <div className={styles.packImageContainer}>
    //             <ImageOrVideo className={styles.packBackground} src={resourceIdToPath(pack.backgroundId)}  />
    //             <ImageOrVideo className={styles.packShadow} src={resourceIdToPath(pack.imageId)} />
    //             <ImageOrVideo className={styles.packImage} src={resourceIdToPath(pack.imageId)} />
    //         </div>

    //         <div className={styles.bottomLeftText}>
    //             <img src={window.constructCDNUrl("/content/token.png")} alt="Token" />
    //             {pack.price.toLocaleString()}
    //         </div>
    //     </div>
    // );
}
