import { useEffect } from "react";
import { useUser } from "@stores/UserStore/index";
import styles from "./adUnit.module.scss";

import { AdUnitProps } from "./adUnit.d";
import { PermissionTypeEnum } from "@blacket/types";

export default function AdUnit({ className, slot, width, height, mobileOnly = false, ...props }: AdUnitProps) {
    if (mobileOnly && !window.matchMedia("(max-width: 768px)").matches) return null;

    const { user } = useUser();
    if (!user || user.hasPermission(PermissionTypeEnum.NO_ADS)) return null;

    const IS_DEV = import.meta.env.DEV;

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
            {!IS_DEV ? <ins
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
