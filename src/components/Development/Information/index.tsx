import { useConfig } from "@stores/ConfigStore/index";
import { useSocket } from "@stores/SocketStore/index";
import { useUser } from "@stores/UserStore/index";
import { useResource } from "@stores/ResourceStore/index";
import styles from "./information.module.scss";

import { Mode } from "@blacket/types";

export default function Information() {
    const { config } = useConfig();
    if (!config) return null;

    const { socket, connected } = useSocket();
    const { user } = useUser();
    const { resources } = useResource();

    if (config.mode === Mode.PROD) return null;

    return (<>
        <div className={styles.main}>
            <div className={styles.wipText}>
                BLACKET v{config.version} {config.mode}
            </div>

            <div data-left={true} className={styles.container}>
                {user ? `${user.username} (${user.id})` : ""}
                <br />
                {connected ? "CONNECTED" : "DISCONNECTED"}
                {socket ? ` [${socket.id}]` : ""}
            </div>

            <div className={styles.container}>
                RESOURCES: {resources.length}
            </div>
        </div>
    </>);
}
