import styles from "../cosmeticsModal.module.scss";

import { TitleProps } from "../cosmeticsModal.d";

export default function Title({ title, ...props }: TitleProps) {

    return (
        <div className={styles.titleContainer} {...props}>
            {title.name}
        </div>
    );
}
