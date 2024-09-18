import styles from "../dashboard.module.scss";

import { LevelContainerProps } from "../dashboard.d";
import { experienceToLevel, levelToExperienceRemaining } from "@blacket/types";

export default function LevelContainer({ experience }: LevelContainerProps) {
    const level = experienceToLevel(experience);

    const experienceRemaining = levelToExperienceRemaining(level, experience);

    return (
        <div className={styles.levelBarContainer}>
            <div className={styles.levelBar}>
                <div 
                    style={{ transform: `scaleX(${experience / experienceRemaining})` }}
                />
            </div>

            <div className={styles.levelStarContainer}>
                <img src={window.constructCDNUrl("/content/level.png")} alt="Level Star" draggable={false} />
                <div>{Math.floor(level)}</div>
            </div>
        </div>
    );
}