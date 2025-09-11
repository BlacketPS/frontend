import { Button, Modal } from "@components/index";
import { BoosterModalProps } from "../inventory.d";

export default function BoosterModal({ booster }: BoosterModalProps) {
    return (
        <>
            <Modal.ModalHeader>
                {booster.name}
            </Modal.ModalHeader>
            
            <Modal.ModalBody>
                Things go here
            </Modal.ModalBody>

            <Modal.ModalButtonContainer>
                <Button.GenericButton onClick={() => {}}>Use</Button.GenericButton>
                <Button.GenericButton onClick={() => {}}>Cancel</Button.GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
}
