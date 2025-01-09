import { useConfig } from "@stores/ConfigStore/index";
import styles from "./information.module.scss";

export default function Information() {
    const { config } = useConfig();
    if (!config) return null;

    if (config.type !== "development") return null;

    return (
        <div className={styles.container}>
            Blacket WIP <br /> server: {config.type}
        </div>
    );
}
