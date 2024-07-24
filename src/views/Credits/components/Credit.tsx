import ImageOrVideo from "@components/ImageOrVideo";
import { CreditProps } from "../credits";
import styles from "../credits.module.scss";
import { useUser } from "@stores/UserStore";
import { useData } from "@stores/DataStore";
import { useNavigate } from "react-router-dom";


export default function Credit({ user, description }: CreditProps) {
    const { getUserAvatarPath } = useUser();
    const { titleIdToText } = useData();
    const navigate = useNavigate();

    // when badges are implemented, we need to asign every badge a value and show the highest ranking badge instead of the placeholder

    return (
        <div onClick={() => navigate("/dashboard?name=".concat(user.username))} className={styles.creditContainer}>
            <ImageOrVideo src={getUserAvatarPath(user)} className={styles.avatar} />
            <div className={styles.creditUserContainer}>
                <div className={styles.creditUserInfoContainer}>
                    <h1 style={{
                        color: user.color
                    }}>{user.username}</h1>
                    <h1>[{titleIdToText(user.titleId)}]</h1>
                    <ImageOrVideo style={{
                        width: "2.5em"
                    }} src="https://blacket.org/content/badges/Tester.webp" />
                </div>
                <div className={styles.creditUserDescription}>
                    {description}
                </div>
            </div>
        </div>
    );
}
