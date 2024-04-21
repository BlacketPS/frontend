import { Background, Header } from "@components/index";
import { ErrorCode, ErrorProps } from "./error.d";

import styles from "./error.module.scss";

export default function Error({ code, reason }: ErrorProps) {
    if (code === ErrorCode.UNKNOWN) document.title = `Error | ${import.meta.env.VITE_INFORMATION_NAME}`;
    else if (code === ErrorCode.NOT_FOUND) document.title = `Not Found | ${import.meta.env.VITE_INFORMATION_NAME}`;
    else if (code === ErrorCode.BLACKLISTED) document.title = `Blacklisted | ${import.meta.env.VITE_INFORMATION_NAME}`;
    else if (code === ErrorCode.MAINTENANCE) {
        document.title = `Maintenance | ${import.meta.env.VITE_INFORMATION_NAME}`;

        setInterval(() => window.fetch2.get("/api").then(() => window.location.reload()).catch(() => null), 1000);
    }

    return (
        <>
            <Background />

            <Header noLink={code !== ErrorCode.NOT_FOUND} />

            <div className={styles.body}>
                <div className={styles.container}>
                    <div className={styles.top}>
                        {code === ErrorCode.MAINTENANCE ? "Oops!" : code === ErrorCode.BLACKLISTED ? "Uh oh..." : code === ErrorCode.UNKNOWN ? "Something went wrong" : ""}
                    </div>

                    <img className={styles.image} src={code !== ErrorCode.UNKNOWN ? `/content/${code}.png` : "/content/error.png"} draggable={false} />

                    <div className={styles.bottom}>
                        {code === ErrorCode.MAINTENANCE ? <>
                            It looks like our servers are having some troubles at the moment. <br /> Please come back at a later time while we fix this.
                        </> : code === ErrorCode.BLACKLISTED ? <>
                            It looks like you have been blacklisted for {reason}.
                        </> : code === ErrorCode.UNKNOWN ? <>
                            Sorry, an unexpected error has occurred. Please report this to the developers.
                        </> : <>
                            We tried our best looking for what you requested <br /> but we couldn't find anything!
                        </>}
                    </div>
                </div>
            </div>
        </>
    );
}
