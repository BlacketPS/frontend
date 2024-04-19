import styles from "./loader.module.scss";

export default function Loader({ image = "/content/blooks/Default.png", motionless = false, message }: { image: string, motionless?: boolean, message: string }) {
    return (
        <div className={styles.loadingModal}>
            <div className={styles.loader} style={message ? { marginBottom: 50 } : {}}>
                <div className={styles.loaderShadow} />

                <img className={styles.loaderBlook} data-motionless={motionless} src={image} draggable={false} />
            </div>

            {message && <div className={styles.loaderMessage}>{message}</div>}
        </div>
    );
}
