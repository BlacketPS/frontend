import { useState } from "react";
import { useModal } from "@stores/ModalStore/index";
import { useRarity } from "@stores/RarityStore/index";
import { Modal, Button, Dropdown, Toggle } from "@components/index";

import { ChangeFilterModalProps } from "../inventory.d";

export default function ChangeFilterModal({ onSave }: ChangeFilterModalProps) {
    const [rarity, setRarity] = useState<number | null>(localStorage.getItem("INVENTORY_SEARCH_RARITY") ? parseInt(localStorage.getItem("INVENTORY_SEARCH_RARITY")!) : null);
    const [dupesOnly, setDupesOnly] = useState<boolean>(localStorage.getItem("INVENTORY_SEARCH_DUPES_ONLY") === "true" ? true : false);
    const [onlyOwned, setOnlyOwned] = useState<boolean>(localStorage.getItem("INVENTORY_SEARCH_ONLY_OWNED") === "true" ? true : false);

    const { closeModal } = useModal();
    const { rarities } = useRarity();

    return (
        <>
            <Modal.ModalHeader>
                Change Filters
            </Modal.ModalHeader>

            <Modal.ModalBody>
                You can change the search filters below.
            </Modal.ModalBody>

            <Dropdown onPick={(value) => {
                setRarity(value);
            }} options={[
                { name: "All", value: null },
                ...rarities.map((r) => ({ name: r.name, value: r.id }))
            ]}>
                Rarity: {rarities.find((r) => r.id === rarity)?.name || "All"}
            </Dropdown>

            <Modal.ModalToggleContainer>
                <Toggle
                    checked={dupesOnly}
                    onClick={() => setDupesOnly(!dupesOnly)}
                >
                    Dupes Only
                </Toggle>

                <Toggle
                    checked={onlyOwned}
                    onClick={() => setOnlyOwned(!onlyOwned)}
                >
                    Only Owned
                </Toggle>
            </Modal.ModalToggleContainer>

            <Modal.ModalButtonContainer>
                <Button.GenericButton onClick={() => {
                    localStorage.setItem("INVENTORY_SEARCH_RARITY", rarity?.toString() || "");
                    localStorage.setItem("INVENTORY_SEARCH_DUPES_ONLY", dupesOnly.toString());
                    localStorage.setItem("INVENTORY_SEARCH_ONLY_OWNED", onlyOwned.toString());

                    onSave();
                    closeModal();
                }}>Save</Button.GenericButton>
                <Button.GenericButton onClick={() => closeModal()}>Cancel</Button.GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
}
