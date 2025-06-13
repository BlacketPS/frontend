import { Loader, Username } from "@components/index";
import styles from "../market.module.scss";

import { BoosterContainerProps, TimeRemainingStrings } from "../market.d";
import { useEffect, useState } from "react";
import { formatTimeRemaining } from "@functions/core/formatTimeRemaining";

export default function BoosterContainer({ boosters }: BoosterContainerProps) {
    const [timeRemainingStrings, setTimeRemainingStrings] = useState<TimeRemainingStrings>({
        global: {
            chance: boosters?.global.chance ? formatTimeRemaining(new Date(boosters.global.chance.expiresAt)) : "",
            shiny: boosters?.global.shiny ? formatTimeRemaining(new Date(boosters.global.shiny.expiresAt)) : ""
        },
        personal: {
            chance: boosters?.personal.chance ? formatTimeRemaining(new Date(boosters.personal.chance.expiresAt)) : "",
            shiny: boosters?.personal.shiny ? formatTimeRemaining(new Date(boosters.personal.shiny.expiresAt)) : ""
        }
    });

    useEffect(() => {
        let active = true;

        const updateTimes = () => {
            if (!active) return;

            setTimeRemainingStrings({
                global: {
                    chance: boosters?.global.chance ? formatTimeRemaining(new Date(boosters.global.chance.expiresAt)) : "",
                    shiny: boosters?.global.shiny ? formatTimeRemaining(new Date(boosters.global.shiny.expiresAt)) : ""
                },
                personal: {
                    chance: boosters?.personal.chance ? formatTimeRemaining(new Date(boosters.personal.chance.expiresAt)) : "",
                    shiny: boosters?.personal.shiny ? formatTimeRemaining(new Date(boosters.personal.shiny.expiresAt)) : ""
                }
            });

            setTimeout(updateTimes, 1000);
        };

        updateTimes();

        return () => {
            active = false;
        };
    }, [boosters]);


    return (
        <div className={styles.boosterContainer}>
            {boosters && <img className={styles.boosterIcon} src={window.constructCDNUrl("/content/icons/boost.png")} alt="Boost Icon" />}

            <div className={styles.boosterText}>
                {!boosters && <Loader noModal style={{ transform: "scale(0.8)", marginLeft: "25px" }} />}

                {boosters && <>
                    <div>
                        {boosters.personal.chance && <>You have {boosters.personal.chance.multiplier}x better odds to find rares! This booster expires in {timeRemainingStrings.personal.chance}. <br /></>}
                        {boosters.global.chance ? <>
                            <Username user={boosters.global.chance.user!} /> is boosting your odds by {boosters.global.chance.multiplier}x to find rares! This booster expires in {timeRemainingStrings.global.chance}.
                        </> : "No ongoing global chance booster."}
                    </div>

                    <div>
                        {boosters.personal.shiny && <>You have {boosters.personal.shiny.multiplier}x better odds to find shinies! This booster expires in {timeRemainingStrings.personal.shiny}. <br /></>}
                        {boosters.global.shiny ? <>
                            <Username user={boosters.global.shiny.user!} /> is boosting your odds by {boosters.global.shiny.multiplier}x to find shinies! This booster expires in {timeRemainingStrings.global.shiny}.
                        </> : "No ongoing global shiny booster."}
                    </div>
                </>}
            </div>
        </div>
    );
}
