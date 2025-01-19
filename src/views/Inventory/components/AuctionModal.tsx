import { useEffect, useState } from "react";
import { useModal } from "@stores/ModalStore/index";
import { useUser } from "@stores/UserStore/index";
import { useAuctionHouse } from "@stores/AuctionHouseStore/index";
import { useCreateAuction } from "@controllers/auctions/useCreateAuction/index";
import { useRecentAveragePrice } from "@controllers/auctions/useRecentAveragePrice/index";
import { Modal, Button, Form, Input, ErrorContainer, Toggle, WarningContainer } from "@components/index";

import { AuctionModalProps } from "../inventory.d";
import { AuctionTypeEnum, PermissionTypeEnum } from "@blacket/types";

export default function AuctionModal({ type, blook, item }: AuctionModalProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [suspicious, setSuspicious] = useState<boolean>(false);
    const [duration, setDuration] = useState<string>("");
    const [buyItNow, setBuyItNow] = useState<boolean>(false);

    const [auctionTax, setAuctionTax] = useState<number>(0);
    const [durationTax, setDurationTax] = useState<number>(0);

    const { createAuction } = useCreateAuction();
    const { getRecentAveragePrice } = useRecentAveragePrice();

    const { closeModal } = useModal();
    const { user } = useUser();
    const { getAuctions } = useAuctionHouse();

    if (!user) return null;

    const submit = () => {
        if (price === "") return setError("Please enter a price.");
        if (duration === "") return setError("Please enter a duration.");
        if (parseInt(duration) < 60) return setError("Duration must be at least 60 minutes.");

        if ((auctionTax + durationTax) > user.tokens) return setError("You don't have enough tokens to auction this.");

        setLoading(true);
        createAuction({
            type,
            itemId: item ? item.id : undefined,
            blookId: blook ? blook.id : undefined,
            price: parseInt(price),
            duration: parseInt(duration),
            buyItNow
        }, (auctionTax + durationTax))
            .then(() => {
                getAuctions();
                closeModal();
            })
            .catch((err) => err?.data?.message ? setError(err.data.message) : setError("Something went wrong."))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        let auctionTax = Math.floor(parseInt(price !== "" ? price : "0") * (buyItNow ? 0.025 : 0.05));
        if (user.permissions.includes(PermissionTypeEnum.LESS_AUCTION_TAX)) auctionTax = Math.floor(auctionTax * 0.75);

        setAuctionTax(auctionTax);
        setDurationTax(Math.floor(parseInt(duration !== "" ? duration : "0") / 60 * 10));
    }, [price, duration, buyItNow]);

    useEffect(() => {
        getRecentAveragePrice({ type, itemId: item ? item.id : undefined, blookId: blook ? blook.id : undefined })
            .then((res) => {
                setPrice(Math.floor(res.data.averagePrice * 0.99).toString());
                setSuspicious(res.data.suspicious);
            })
            .catch((err) => setError(err?.data?.message || "Something went wrong."))
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <Modal.ModalHeader>
                Auctioning {type === AuctionTypeEnum.BLOOK ? blook!.name : item!.name}
            </Modal.ModalHeader>

            <Modal.ModalBody>Please fill out the fields below.</Modal.ModalBody>

            <Form>
                <Input
                    value={price}
                    icon="fas fa-dollar-sign"
                    onChange={(e) => {
                        const value = e.target.value;
                        const parsedValue = parseInt(value);

                        if (value.match(/[^0-9]/)) return;
                        if (parsedValue < 1 && value !== "") return;
                        if (parsedValue > 999999999) return;

                        setPrice(e.target.value);
                        setError("");
                    }}
                    placeholder={
                        !buyItNow ? "Starting Bid" : "Price"
                    }
                    autoComplete="off"
                />

                <Input
                    value={duration}
                    icon="fas fa-clock"
                    onChange={(e) => {
                        const value = e.target.value;
                        const parsedValue = parseInt(value);

                        if (value.match(/[^0-9]/)) return;
                        if (parsedValue < 1 && value !== "") return;
                        if (parsedValue > 10080) return;

                        setDuration(e.target.value);
                        setError("");
                    }}
                    placeholder="Duration (minutes)"
                    autoComplete="off"
                />
            </Form>

            <Modal.ModalBody>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ color: auctionTax > user.tokens ? "#ff0000" : "" }}>Auction Tax: {auctionTax.toLocaleString()}</div>
                    <div style={{ color: durationTax > user.tokens ? "#ff0000" : "" }}>Duration Tax: {durationTax.toLocaleString()}</div>
                    <div style={{ color: (auctionTax + durationTax) > user.tokens ? "#ff0000" : "" }}>Total: {(auctionTax + durationTax).toLocaleString()}</div>

                    {user.permissions.includes(PermissionTypeEnum.LESS_AUCTION_TAX) && <div style={{ fontSize: "0.8rem", marginTop: 13 }}>You have a 25% discount on auction tax!</div>}
                </div>
            </Modal.ModalBody>

            <Modal.ModalToggleContainer>
                <Toggle checked={buyItNow} onClick={() => setBuyItNow(!buyItNow)}>
                    Buy It Now
                </Toggle>
            </Modal.ModalToggleContainer>

            {suspicious && <WarningContainer>This item's recent average price seems suspicious. <b>Be careful when choosing a price for this item.</b></WarningContainer>}
            {error !== "" && <ErrorContainer>{error}</ErrorContainer>}

            <Modal.ModalButtonContainer loading={loading}>
                <Button.GenericButton onClick={submit} type="submit">Auction</Button.GenericButton>
                <Button.GenericButton onClick={closeModal}>Cancel</Button.GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
}
