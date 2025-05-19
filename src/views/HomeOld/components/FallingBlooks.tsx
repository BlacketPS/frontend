import styles from "../home.module.scss";

export default function FallingBlooks() {
    return <img src={window.constructCDNUrl("/content/fallingBlooks.png")} alt="Blooks" className={styles.headerImage} draggable="false" />;
}
