import { useResource } from "@stores/ResourceStore/index";
import { ImageOrVideo } from "@components/index";
import styles from "../cosmeticsModal.module.scss";

import { BannerProps } from "../cosmeticsModal.d";

export default function Banner({ banner, ...props }: BannerProps) {
    const { resourceIdToPath } = useResource();

    console.log(banner);

    return (
        <div className={styles.bannerContainer} {...props}>
            <ImageOrVideo className={styles.bannerImage} src={resourceIdToPath(banner.imageId)} alt={banner.name} />
            <div className={styles.bannerName}>{banner.name} Banner</div>
        </div>
    );
}
