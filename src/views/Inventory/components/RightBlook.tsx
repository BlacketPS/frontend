import { useResource } from "@stores/ResourceStore/index";
import { useContextMenu } from "@stores/ContextMenuStore/index";
import { useModal } from "@stores/ModalStore/index";
import { useData } from "@stores/DataStore/index";
import { Button, ImageOrVideo } from "@components/index";
import { SellBlooksModal } from "../components";
import Textfit from "react-textfit";
import styles from "../inventory.module.scss";

import { RightBlookProps } from "../inventory";

export default function RightBlook({ blook, owned, noBlooksOwned, children, ...props }: RightBlookProps) {
    const { resourceIdToPath } = useResource();
    const { openContextMenu, closeContextMenu } = useContextMenu();
    const { createModal } = useModal();
    const { rarities } = useData();

    if (noBlooksOwned) return null;

    return (
        <div className={styles.rightSide} {...props}>
            <div className={styles.rightSideContent}>
                <div className={styles.rightBlookBackground}>
                    <ImageOrVideo src={resourceIdToPath(blook.backgroundId) || "https://cdn.blacket.org/static/content/blooks/backgrounds/Default.png"} alt="Blook Background" draggable={false} />
                </div>
                <div className={styles.rightTopText}>
                    <Textfit mode="single" min={0} max={window.innerWidth > 1000 ? 40 : 25} className={styles.rightBlookName}>{blook.name}</Textfit>
                    <div style={{
                        color: rarities.find((r) => r.id === (blook.rarityId))!.color
                    }} className={styles.rightBlookRarity}>{rarities.find((r) => r.id === blook.rarityId)!.name}</div>
                </div>

                <div className={styles.rightBlookImage}>
                    <ImageOrVideo src={resourceIdToPath(blook.imageId)} alt={blook.name} />
                </div>

                <div className={styles.rightBottomText}>{owned?.toLocaleString() || 0} Owned</div>

                <Button.GenericButton
                    className={styles.rightButtonMobile}
                    backgroundColor="var(--primary-color)"
                    onClick={() => openContextMenu([
                        {
                            label: "Sell", image: "https://cdn.blacket.org/static/content/token.png", onClick: () => {
                                closeContextMenu();

                                createModal(<SellBlooksModal blook={blook} />);
                            }
                        },
                        { label: "Auction", icon: "fas fa-building-columns" }
                    ])}
                >
                    <i className="fas fa-bars" />
                </Button.GenericButton>

                <div className={styles.rightShadow} />
            </div>

            {children}
        </div>
    );
}
