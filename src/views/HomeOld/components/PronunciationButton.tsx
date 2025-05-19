import styles from "../home.module.scss";

export default function PronunciationButton() {
    return (
        <div className={styles.pronounceButton} onClick={() => new Audio(window.constructCDNUrl("/content/pronunciation.ogg")).play()}>
            <i className="fas fa-volume-up" /> Pronunciation ("{import.meta.env.VITE_INFORMATION_PRONUNCIATION}")
        </div>
    );
}
