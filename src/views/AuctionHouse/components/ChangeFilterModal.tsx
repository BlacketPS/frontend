import { useState } from "react";
import { useAuctionHouse } from "@stores/AuctionHouseStore/index";
import { useModal } from "@stores/ModalStore/index";
import { useData } from "@stores/DataStore/index";
import { Modal, Button, Dropdown, Toggle, Input } from "@components/index";
import { AuctionTypeEnum } from "@blacket/types";

export default function ChangeFilterModal() {
    const { search, setSearch } = useAuctionHouse();
    const { closeModal } = useModal();
    const { rarities } = useData();

    const [seller, setSeller] = useState<string>(search.seller || "");

    return (
        <>
            <Modal.ModalHeader>
                Change Filters
            </Modal.ModalHeader>

            <Modal.ModalBody>
                You can change the search filters below.
            </Modal.ModalBody>

            <Dropdown onPick={(value) => {
                setSearch({ ...search, rarityId: value });
            }} options={[
                { name: "All", value: null },
                ...rarities.map((r) => ({ name: r.name, value: r.id }))
            ]}>
                Rarity: {rarities.find((r) => r.id === search.rarityId)?.name || "All"}
            </Dropdown>

            <Modal.ModalToggleContainer>
                <Toggle
                    checked={search.endingSoon}
                    onClick={() => setSearch({ ...search, endingSoon: !search.endingSoon })}
                >
                    Ending Soon
                </Toggle>

                <Toggle
                    checked={search.buyItNow}
                    onClick={() => {
                        if (search.buyItNow) setSearch({ ...search, buyItNow: undefined });
                        else setSearch({ ...search, buyItNow: true });
                    }}
                >
                    BIN Only
                </Toggle>

                <Toggle
                    checked={search.buyItNow === false}
                    onClick={() => {
                        if (search.buyItNow === false) setSearch({ ...search, buyItNow: undefined });
                        else setSearch({ ...search, buyItNow: false });
                    }}
                >
                    Auction Only
                </Toggle>
            </Modal.ModalToggleContainer>

            <Modal.ModalToggleContainer>
                <Toggle
                    checked={search.type === AuctionTypeEnum.BLOOK}
                    onClick={() => {
                        if (search.type === AuctionTypeEnum.BLOOK) setSearch({ ...search, type: undefined });
                        else setSearch({ ...search, type: AuctionTypeEnum.BLOOK });
                    }}
                >
                    Blooks Only
                </Toggle>

                <Toggle
                    checked={search.type === AuctionTypeEnum.ITEM}
                    onClick={() => {
                        if (search.type === AuctionTypeEnum.ITEM) setSearch({ ...search, type: undefined });
                        else setSearch({ ...search, type: AuctionTypeEnum.ITEM });
                    }}
                >
                    Items Only
                </Toggle>
            </Modal.ModalToggleContainer>

            <Input
                icon="fas fa-user"
                placeholder="Seller Username"
                value={seller}
                onChange={(e) => setSeller(e.target.value)}
            />

            <Modal.ModalButtonContainer>
                <Button.GenericButton onClick={() => {
                    switch (true) {
                        case seller === "":
                            setSearch({ ...search, seller: undefined });
                            break;
                        case seller !== search.seller:
                            setSearch({ ...search, seller });
                            break;
                    }

                    closeModal();
                }}>Save</Button.GenericButton>
                <Button.GenericButton onClick={() => closeModal()}>Cancel</Button.GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
}
