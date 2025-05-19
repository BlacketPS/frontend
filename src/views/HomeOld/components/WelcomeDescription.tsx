import styles from "../home.module.scss";

export default function WelcomeDescription() {
    return (
        <div className={styles.welcomeDescription}>
            {import.meta.env.VITE_INFORMATION_DESCRIPTION.split(",").map((word: string, i: number) => <div key={i}>{word}</div>)}
        </div>
    );
}
