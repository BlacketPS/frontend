import { useState } from "react";
import { useModal } from "@stores/ModalStore/index";
import { useData } from "@stores/DataStore/index";
import { useUser } from "@stores/UserStore";
import { useBuyAuction } from "@controllers/auctions/useBuyAuction/index";
import { Modal, Button, ErrorContainer } from "@components/index";
import styles from "../auctionHouse.module.scss";

import { BuyItNowModalProps } from "../auctionHouse.d";
import { AuctionTypeEnum } from "blacket-types";

export default function BuyItNowModal({ auction }: BuyItNowModalProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const { closeModal } = useModal();
    const { blooks, items } = useData();
    const { user } = useUser();

    const { buyAuction } = useBuyAuction();

    if (!user) return null;

    const blook = blooks.find((blook) => blook.id === auction.blookId);
    const item = items.find((item) => item.id === auction.item?.itemId);

    const submit = () => {
        setLoading(true);
        buyAuction(auction)
            .then(() => closeModal())
            .catch((err) => err?.data?.message ? setError(err.data.message) : setError("Something went wrong."))
            .finally(() => setLoading(false));
    };

    return (
        <>
            <Modal.ModalHeader>
                {auction.type === AuctionTypeEnum.BLOOK ? blook!.name : item!.name}
            </Modal.ModalHeader>

            <Modal.ModalBody>Would you like to purchase this {
                auction.type === AuctionTypeEnum.BLOOK
                    ? "blook"
                    : "item"
            } for <img className={styles.tokenPrice} src={window.constructCDNUrl("/content/token.png")} /> {auction.price.toLocaleString()} tokens?</Modal.ModalBody>

            {error !== "" && <ErrorContainer>{error}</ErrorContainer>}

            <Modal.ModalButtonContainer loading={loading}>
                <Button.GenericButton onClick={submit} type="submit">Yes</Button.GenericButton>
                <Button.GenericButton onClick={closeModal}>No</Button.GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
}
