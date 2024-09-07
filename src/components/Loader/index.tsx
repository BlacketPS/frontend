import { LoaderProps } from "./loader.d";
import styles from "./loader.module.scss";

export default function Loader({ image = window.constructCDNUrl("/content/blooks/Default.png"), motionless = false, noModal = false, message, className = "", ...props }: LoaderProps) {
    if (className !== "") className = ` ${className}`;

    if (!noModal) return (
        <div className={styles.loadingModal}>
            <div className={`${styles.loader}${className}`} style={message ? { marginBottom: 100 } : {}} {...props}>
                <div className={styles.loaderShadow} />

                <img className={styles.loaderBlook} data-motionless={motionless} src={image} draggable={false} />
            </div>

            {message && <div className={styles.loaderMessage}>{message}</div>}
        </div>
    );

    else return (
        <div className={`${styles.loader}${className}`} {...props}>
            <div className={styles.loaderShadow} />

            <img className={styles.loaderBlook} data-motionless={motionless} src={image} draggable={false} />

            {message && <div className={styles.loaderMessage}>{message}</div>}
        </div>
    );
}
