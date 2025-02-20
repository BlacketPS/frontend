import Textfit from "react-textfit";
import styles from "./zoeySign.module.scss";

import { ZoeySignProps } from "./zoeySign.d";

export default function ZoeySign({ children, ...props }: ZoeySignProps) {
    return (
        <div className={`${styles.imageContainer} ${props.className}`} {...props}>
            <Textfit className={styles.textOverlay} mode="single">
                {children}
            </Textfit>

            <img className={styles.image} src={window.constructCDNUrl("/content/zoey-sign.png")} alt={`zoey holding sign saying ${children?.toString()}`} draggable={false} />
        </div>
    );
}
