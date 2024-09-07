import { useState } from "react";
import { useModal } from "@stores/ModalStore/index";
import { useData } from "@stores/DataStore/index";
import { useUser } from "@stores/UserStore";
import { useRemoveAuction } from "@controllers/auctions/useRemoveAuction/index";
import { Modal, Button, ErrorContainer } from "@components/index";

import { ModalProps } from "../auctionHouse.d";
import { AuctionTypeEnum } from "blacket-types";

export default function RemoveAuctionModal({ auction }: ModalProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const { closeModal } = useModal();
    const { blooks, items } = useData();
    const { user } = useUser();

    const { removeAuction } = useRemoveAuction();

    if (!user) return null;

    const blook = blooks.find((blook) => blook.id === auction.blookId);
    const item = items.find((item) => item.id === auction.item?.itemId);

    const submit = () => {
        setLoading(true);
        removeAuction(auction.id)
            .then(() => closeModal())
            .catch((err) => err?.data?.message ? setError(err.data.message) : setError("Something went wrong."))
            .finally(() => setLoading(false));
    };

    if (auction.bids.length > 0) return (
        <>
            <Modal.ModalHeader>
                {auction.type === AuctionTypeEnum.BLOOK ? blook!.name : item!.name}
            </Modal.ModalHeader>

            <Modal.ModalBody>You cannot remove a listing with bids on it.</Modal.ModalBody>

            <Modal.ModalButtonContainer loading={loading}>
                <Button.GenericButton onClick={closeModal}>Close</Button.GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
    else return (
        <>
            <Modal.ModalHeader>
                {auction.type === AuctionTypeEnum.BLOOK ? blook!.name : item!.name}
            </Modal.ModalHeader>

            <Modal.ModalBody>Are you sure you want to remove your listing?</Modal.ModalBody>

            {error !== "" && <ErrorContainer>{error}</ErrorContainer>}

            <Modal.ModalButtonContainer loading={loading}>
                <Button.GenericButton onClick={submit} type="submit">Yes</Button.GenericButton>
                <Button.GenericButton onClick={closeModal}>No</Button.GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
}
