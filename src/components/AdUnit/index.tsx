import { useEffect } from "react";
import { useConfig } from "@stores/ConfigStore/index";
import { useUser } from "@stores/UserStore/index";
import styles from "./adUnit.module.scss";

import { AdUnitProps } from "./adUnit.d";
import { Mode, PermissionTypeEnum } from "@blacket/types";

export default function AdUnit({ className, slot, width, height, mobileOnly = false, ...props }: AdUnitProps) {
    if (mobileOnly && !window.matchMedia("(max-width: 768px)").matches) return null;

    const { config } = useConfig();
    if (!config) return null;

    const { user } = useUser();
    if (!user || user.hasPermission(PermissionTypeEnum.NO_ADS)) return null;

    useEffect(() => {
        try {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch {
            // ignore error
        }
    }, []);

    return (
        <div
            className={`${styles.adUnitContainer} ${className ?? ""}`}
            style={{
                width: width ?? "auto",
                height: height ?? "auto"
            }}
            {...props}
        >
            {config.mode === Mode.PROD ? <ins
                className="adsbygoogle"
                style={{
                    display: "inline-block",
                    width: width ?? "auto",
                    height: height ?? "auto"
                }}
                data-ad-client="ca-pub-6493849435526552"
                data-ad-slot={slot}
            /> : <div className={styles.devAdUnit}>
                <span>{slot}</span>
                <span>{width}x{height}</span>
            </div>}
        </div>
    );
}
