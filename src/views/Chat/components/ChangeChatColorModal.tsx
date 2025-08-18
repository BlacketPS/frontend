import { useState } from "react";
import { useUser } from "@stores/UserStore/index";
import { useModal } from "@stores/ModalStore/index";
import { useLoading } from "@stores/LoadingStore/index";
import { Button, ColorPicker, Modal } from "@components/index";
import { useChatColor } from "@controllers/settings/useChatColor/index";

export default function ChangeChatColorModal() {
    const { user } = useUser();
    if (!user) return null;

    const [color, setColor] = useState<string>(user.settings.chatColor || "#ffffff");

    const { closeModal } = useModal();
    const { setLoading } = useLoading();

    const { changeChatColor } = useChatColor();

    return (
        <>
            <Modal.ModalHeader>
                Chat Color
            </Modal.ModalHeader>

            <Modal.ModalBody style={{ display: "flex", flexDirection: "column", marginTop: -5 }}>
                <ColorPicker
                    initialColor={[color, setColor]}
                    onPick={(c) => setColor(c)}
                />

                <div>Your messages would look like: <div style={{ color }}>Hello World!</div></div>
            </Modal.ModalBody>

            <Modal.ModalButtonContainer>
                <Button.GenericButton
                    onClick={() => {
                        setLoading(true);

                        changeChatColor({ color })
                            .then(() => closeModal())
                            .finally(() => setLoading(false));
                    }}
                >
                    Save
                </Button.GenericButton>

                <Button.GenericButton onClick={closeModal}>
                    Cancel
                </Button.GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
}
