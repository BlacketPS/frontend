import { useState } from "react";
import { useModal } from "@stores/ModalStore/index";
import { useData } from "@stores/DataStore/index";
import { Modal, Button, Dropdown, Toggle } from "@components/index";

import { ChangeFilterModalProps } from "../inventory.d";

export default function ChangeFilterModal({ onSave }: ChangeFilterModalProps) {
    const [rarity, setRarity] = useState<number | null>(localStorage.getItem("INVENTORY_SEARCH_RARITY") ? parseInt(localStorage.getItem("INVENTORY_SEARCH_RARITY")!) : null);
    const [dupesOnly, setDupesOnly] = useState<boolean>(localStorage.getItem("INVENTORY_SEARCH_ONLY_DUPES") === "true" ? true : false);
    const [onlyShiny, setOnlyShiny] = useState<boolean>(localStorage.getItem("INVENTORY_SEARCH_ONLY_SHINY") === "true" ? true : false);
    const [onlyOwned, setOnlyOwned] = useState<boolean>(localStorage.getItem("INVENTORY_SEARCH_ONLY_OWNED") === "true" ? true : false);

    const { closeModal } = useModal();
    const { rarities } = useData();

    return (
        <>
            <Modal.ModalHeader>
                Change Filters
            </Modal.ModalHeader>

            <Modal.ModalBody>
                You can change the search filters below.
            </Modal.ModalBody>

            <Dropdown
                onChange={(value: number) => {
                    setRarity(value);
                }}
                options={[
                    { label: "Select a rarity...", value: null },
                    ...rarities.map((r) => ({ label: r.name, value: r.id }))
                ]}
            >
                {rarity ? rarities.find((r) => r.id === rarity)?.name : "Select a rarity..."}
            </Dropdown>

            <Modal.ModalToggleContainer>
                <Toggle
                    checked={dupesOnly}
                    onClick={() => setDupesOnly(!dupesOnly)}
                >
                    Only Dupes
                </Toggle>

                <Toggle
                    checked={onlyShiny}
                    onClick={() => setOnlyShiny(!onlyShiny)}
                >
                    Only Shiny
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
                    localStorage.setItem("INVENTORY_SEARCH_ONLY_DUPES", dupesOnly.toString());
                    localStorage.setItem("INVENTORY_SEARCH_ONLY_OWNED", onlyOwned.toString());
                    localStorage.setItem("INVENTORY_SEARCH_ONLY_SHINY", onlyShiny.toString());

                    onSave();
                    closeModal();
                }}>Save</Button.GenericButton>
                <Button.GenericButton onClick={() => closeModal()}>Cancel</Button.GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
}
