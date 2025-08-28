import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Turnstile from "react-turnstile";
import { useAuctionHouse } from "@stores/AuctionHouseStore/index";
import { useModal } from "@stores/ModalStore/index";
import { useData } from "@stores/DataStore/index";
import { useUser } from "@stores/UserStore";
import { useBidAuction } from "@controllers/auctions/useBidAuction/index";
import { Modal, Button, ErrorContainer, Username, Input } from "@components/index";
import styles from "../auctionHouse.module.scss";

import { AuctionModalProps } from "../auctionHouse.d";
import { AuctionsAuctionEntity, AuctionTypeEnum, Forbidden } from "@blacket/types";

export default function AuctionModal({ auctionId }: AuctionModalProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [captchaToken, setCaptchaToken] = useState<string>("");

    const { auctions } = useAuctionHouse();
    const { closeModal } = useModal();
    const { blooks, items } = useData();
    const { user } = useUser();

    const { bidAuction } = useBidAuction();

    const [auction, setAuction] = useState<AuctionsAuctionEntity | null>(auctions.find((auction) => auction.id === auctionId) || null);

    if (!auction) return null;
    if (!user) return null;

    useEffect(() => {
        setAuction(auctions.find((auction) => auction.id === auctionId) || null);
    }, [auctions]);

    const blook = blooks.find((blook) => blook.id === auction?.blook?.blookId);
    const item = items.find((item) => item.id === auction.item?.itemId);

    const submit = () => {
        // switch (true) {
        //     case amount === "":
        //         return setError("Please enter a bid amount.");
        //     case auction.bids[0] && auction.bids[0].user.id === user.id:
        //         return setError(Forbidden.AUCTIONS_BID_OWN_BID);
        //     case auction.bids[0] && parseInt(amount) <= auction.bids[0].amount:
        //         return setError(
        //             Forbidden.AUCTIONS_BID_TOO_LOW
        //                 .replace("%s", (auction.bids[0].amount + 1).toLocaleString())
        //         );
        //     case parseInt(amount) <= auction.price:
        //         return setError(
        //             Forbidden.AUCTIONS_BID_TOO_LOW
        //                 .replace("%s", (auction.price + 1).toLocaleString())
        //         );
        //     case parseInt(amount) > user.diamonds:
        //         return setError(Forbidden.AUCTIONS_BID_NOT_ENOUGH_TOKENS);
        // }
        if (captchaToken === "") return setError("Please complete the captcha.");

        const userPreviousBids = auction.bids.filter((bid) => bid.user.id === user.id);
        const highestPreviousBidAmount = userPreviousBids.length > 0
            ? Math.max(...userPreviousBids.map((bid) => bid.amount))
            : 0;

        const additionalAmount = parseInt(amount) - highestPreviousBidAmount;
        const remainingDiamonds = user.diamonds - additionalAmount;

        switch (true) {
            case amount === "":
                return setError("Please enter a bid amount.");
            case parseInt(amount) < auction.price && auction.bids.length === 0:
                return setError(
                    Forbidden.AUCTIONS_BID_TOO_LOW
                        .replace("%s", (auction.price).toLocaleString())
                );
            case auction.bids[0] && auction.bids[0].user.id === user.id:
                return setError(Forbidden.AUCTIONS_BID_OWN_BID);
            case auction.bids[0] && parseInt(amount) <= auction.bids[0].amount:
                return setError(
                    Forbidden.AUCTIONS_BID_TOO_LOW
                        .replace("%s", (auction.bids[0].amount + 1).toLocaleString())
                );
            case parseInt(amount) <= highestPreviousBidAmount:
                return setError(
                    Forbidden.AUCTIONS_BID_TOO_LOW
                        .replace("%s", (highestPreviousBidAmount + 1).toLocaleString())
                );
        }

        setLoading(true);
        bidAuction(auction, { amount: parseInt(amount), captchaToken })
            .then(() => {
                setAmount("");

                user.setDiamonds(remainingDiamonds);
            })
            .catch((err) => err?.data?.message ? setError(err.data.message) : setError("Something went wrong."))
            .finally(() => setLoading(false));
    };

    const navigate = useNavigate();

    return (
        <>
            <Modal.ModalHeader>
                {auction.type === AuctionTypeEnum.BLOOK ? blook!.name : item!.name}
            </Modal.ModalHeader>

            {auction.bids[0] && <Modal.ModalBody>
                <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                    <div className={styles.bidsContainer} style={{ height: "110px" }}>
                        <div className={styles.bid} data-top-bidder={true} onClick={() => {
                            navigate(`/dashboard?name=${auction.bids[0].user.username}`);

                            closeModal();
                        }}>
                            <Username user={auction.bids[0].user} /> <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 5 }}>
                                {auction.bids[0].amount.toLocaleString()} <img className={styles.tokenPrice} src={window.constructCDNUrl("/content/token.png")} />
                            </div>
                        </div>
                    </div>

                    {auction.bids.slice(1).length > 0 && <div className={styles.bidsContainer} style={{ justifyContent: "unset", overflowY: "auto" }}>
                        {auction.bids.slice(1).map((bid) => (
                            <div key={bid.id} className={styles.bid} onClick={() => {
                                navigate(`/dashboard?name=${bid.user.username}`);

                                closeModal();
                            }}>
                                <Username user={bid.user} /> <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 5 }}>
                                    {bid.amount.toLocaleString()} <img className={styles.tokenPrice} src={window.constructCDNUrl("/content/token.png")} />
                                </div>
                            </div>
                        ))}
                    </div>}
                </div >
            </Modal.ModalBody >}

            <Modal.ModalBody>
                <Input
                    icon="fas fa-dollar-sign"
                    placeholder="Bid Amount"
                    value={amount}
                    onChange={(e) => {
                        setError("");

                        const value = e.target.value;

                        if (!value.match(/^[0-9]*$/)) return;

                        setAmount(value);
                    }}
                />

                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}>
                    {
                        auction.bids[0] ?
                            `Current Bid: ${(auction.bids[0].amount).toLocaleString()}`
                            :
                            `Starting Bid: ${auction.price.toLocaleString()}`
                    } <img className={styles.tokenPrice} src={window.constructCDNUrl("/content/token.png")} />
                </div>
            </Modal.ModalBody >

            <Turnstile
                key={JSON.stringify(auction)}
                sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                onVerify={setCaptchaToken}
                theme="dark"
            />

            {error !== "" && <ErrorContainer>{error}</ErrorContainer>}

            <Modal.ModalButtonContainer loading={loading}>
                <Button.GenericButton onClick={submit} type="submit">Bid</Button.GenericButton>
                <Button.GenericButton onClick={closeModal}>Close</Button.GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
}
