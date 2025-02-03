import { useResource } from "@stores/ResourceStore/index";
import { useContextMenu } from "@stores/ContextMenuStore/index";
import { useModal } from "@stores/ModalStore/index";
import { useData } from "@stores/DataStore/index";
import { Blook, Button, ImageOrVideo } from "@components/index";
import { AuctionModal, SellBlooksModal } from "../components";
import Textfit from "react-textfit";
import styles from "../inventory.module.scss";

import { RightBlookProps } from "../inventory";
import { AuctionTypeEnum } from "@blacket/types";

export default function RightBlook({ blook, shiny, owned, noBlooksOwned, children, ...props }: RightBlookProps) {
    const { resourceIdToPath } = useResource();
    const { openContextMenu, closeContextMenu } = useContextMenu();
    const { createModal } = useModal();
    const { rarities } = useData();

    if (noBlooksOwned) return null;

    return (
        <div className={styles.rightSide} {...props}>
            <div className={styles.rightSideContent}>
                <div className={styles.rightBlookBackground}>
                    <ImageOrVideo src={resourceIdToPath(blook.backgroundId) || window.constructCDNUrl("/content/blooks/backgrounds/Default.png")} alt="Blook Background" draggable={false} />
                </div>
                <div className={styles.rightTopText}>
                    <Textfit mode="single" min={0} max={window.innerWidth > 1000 ? 40 : 25} className={styles.rightBlookName}>{shiny && "Shiny"} {blook.name}</Textfit>
                    <div style={{
                        color: rarities.find((r) => r.id === (blook.rarityId))!.color
                    }} className={styles.rightBlookRarity}>{rarities.find((r) => r.id === blook.rarityId)!.name}</div>
                </div>

                <div className={styles.rightBlookImage}>
                    <Blook
                        src={resourceIdToPath(blook.imageId)}
                        alt={blook.name}
                        shiny={shiny}
                    />
                </div>

                <div className={styles.rightBottomText}>{owned?.toLocaleString() || 0} Owned</div>

                <Button.GenericButton
                    className={styles.rightButtonMobile}
                    backgroundColor="var(--primary-color)"
                    onClick={() => openContextMenu([
                        {
                            label: "Sell", image: window.constructCDNUrl("/content/token.png"), onClick: () => {
                                closeContextMenu();

                                createModal(<SellBlooksModal blook={blook} shiny={shiny} />);
                            }
                        },
                        {
                            label: "Auction", icon: "fas fa-building-columns", onClick: () => {
                                closeContextMenu();

                                createModal(<AuctionModal type={AuctionTypeEnum.BLOOK} blook={blook} />);
                            }
                        }
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
