import { useRouteError } from "react-router-dom";
import { Background, Button } from "@components/index";
import { Image } from "./components/index";
import styles from "./error.module.scss";

import { ErrorCode, ErrorProps } from "./error.d";

export default function Error({ code, reason }: ErrorProps) {
    if (code === ErrorCode.UNKNOWN) document.title = `Error | ${import.meta.env.VITE_INFORMATION_NAME}`;
    else if (code === ErrorCode.NOT_FOUND) document.title = `Not Found | ${import.meta.env.VITE_INFORMATION_NAME}`;
    else if (code === ErrorCode.BLACKLISTED) document.title = `Blacklisted | ${import.meta.env.VITE_INFORMATION_NAME}`;
    else if (code === ErrorCode.MAINTENANCE) {
        document.title = `Maintenance | ${import.meta.env.VITE_INFORMATION_NAME}`;

        setInterval(() => window.fetch2.get("/api").then(() => window.location.reload()).catch(() => null), 1000);
    }

    const error: any = useRouteError();

    let reasonText = "breaking rules";
    let reasonEndTime = `at ${new Date()}`;

    if (reason) {
        const reasonArray = reason?.split("|");

        reasonText = reasonArray?.[0] ?? "breaking rules";
        reasonEndTime = `at ${new Date(reasonArray?.[1]).toLocaleDateString() ?? "never"}`;
    }

    return (
        <>
            {code !== ErrorCode.NOT_FOUND && <Background />}

            <div className={styles.body}>
                <div className={styles.container}>
                    <div className={styles.top}>
                        {code === ErrorCode.MAINTENANCE ? "Oops!" : code === ErrorCode.BLACKLISTED ? "Uh Oh..." : code === ErrorCode.UNKNOWN ? "Something went wrong" : ""}
                    </div>

                    <Image src={code !== ErrorCode.UNKNOWN ? window.constructCDNUrl(`/content/${code}.png`) : window.constructCDNUrl("/content/error.png")} alt="Error" />

                    <div className={styles.bottom}>
                        {code === ErrorCode.MAINTENANCE ? <>
                            It looks like our servers are having some troubles at the moment. <br /> Please come back at a later time while we fix this.
                        </> : code === ErrorCode.BLACKLISTED ? <>
                            It looks like you have been blacklisted for {reasonText}. <br /> Your blacklist will expire {reasonEndTime}.
                        </> : code === ErrorCode.UNKNOWN ? <>
                            Sorry, an unexpected error has occurred. Please report this to the developers.

                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 20 }}>
                                <Button.GenericButton onClick={() => {
                                    navigator.clipboard.writeText(JSON.stringify({
                                        message: error.message,
                                        stack: error.stack
                                    }, null, 4));
                                }}>
                                    Copy Callstack
                                </Button.GenericButton>
                            </div>
                        </> : <>
                            We tried our best looking for what you requested <br /> but we couldn't find anything!
                        </>}
                    </div>
                </div>
            </div>
        </>
    );
}
