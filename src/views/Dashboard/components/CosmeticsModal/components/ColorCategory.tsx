import { useUser } from "@stores/UserStore/index";
import { ColorPicker } from "@components/index";
import styles from "../cosmeticsModal.module.scss";

export default function ColorCategory() {

    const { user } = useUser();
    if (!user) return null;

    return (
        <>

            <div className={styles.holder} data-column={true}>
                <div className={styles.colorCategoryHolder}>
                    <ColorPicker
                        initialColor="#000000"
                        onPick={(color) => console.log(color)}
                    />
                </div>
            </div>
        </>
    );
}
