import { LoaderProps } from "./loader.d";
import styles from "./loader.module.scss";

export default function Loader({ image = "https://cdn.blacket.org/static/content/blooks/Default.png", motionless = false, noModal = false, message, className = "" }: LoaderProps) {
    if (className !== "") className = ` ${className}`;

    if (!noModal) return (
        <div className={styles.loadingModal}>
            <div className={`${styles.loader}${className}`} style={message ? { marginBottom: 100 } : {}}>
                <div className={styles.loaderShadow} />

                <img className={styles.loaderBlook} data-motionless={motionless} src={image} draggable={false} />
            </div>

            {message && <div className={styles.loaderMessage}>{message}</div>}
        </div>
    );

    else return (
        <div className={`${styles.loader}${className}`}>
            <div className={styles.loaderShadow} />

            <img className={styles.loaderBlook} data-motionless={motionless} src={image} draggable={false} />

            {message && <div className={styles.loaderMessage}>{message}</div>}
        </div>
    );
}
