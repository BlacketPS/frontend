import { useConfig } from "@stores/ConfigStore/index";
import styles from "./information.module.scss";

import { Mode } from "@blacket/types";

export default function Information() {
    const { config } = useConfig();
    if (!config) return null;

    if (config.mode === Mode.PROD) return null;

    return (<>
        <div className={styles.main}>
            <div className={styles.wipText}>
                Work in Progress - {config.version}
            </div>

            <div className={styles.container}>
                Blacket {config.mode}
                <br />
                Version {config.version}
            </div>
        </div>
    </>);
}
