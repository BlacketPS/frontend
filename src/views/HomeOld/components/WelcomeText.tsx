import styles from "../home.module.scss";

export default function WelcomeText() {
    return (
        <div className={styles.welcomeText}>
            {import.meta.env.VITE_INFORMATION_WELCOME.split(" ").map((word: string, i: number) => <div key={i}>{word}</div>)}
        </div>
    );
}
