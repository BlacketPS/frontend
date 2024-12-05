import { useEffect, useState } from "react";
import { Button, Modal } from "@components/index";
import { useModal } from "@stores/ModalStore/index";

import { DailyRewardsModalProps } from "../dashboard.d";

export default function DailyRewardsModal({ amount }: DailyRewardsModalProps) {
    const { closeModal } = useModal();

    const [fakeAmount, setFakeAmount] = useState<number>(0);
    const [done, setDone] = useState<boolean>(false);

    useEffect(() => {
        let start: number | null = null;
        const duration = 3000;

        const easeOutQuad = (t: number) => t * (2 - t);

        const animate = (timestamp: number) => {
            if (!start) start = timestamp;

            const progress = timestamp - start;
            const percentage = Math.min(progress / duration, 1);
            const easedAmount = Math.floor(easeOutQuad(percentage) * amount);

            setFakeAmount(easedAmount);

            if (progress < duration) requestAnimationFrame(animate);
            else setTimeout(() => setDone(true), 1000);
        };

        requestAnimationFrame(animate);

        return () => {
            start = null;
        };
    }, [amount]);

    return (
        <>
            <Modal.ModalHeader>Daily Reward</Modal.ModalHeader>

            <Modal.ModalBody>
                <div>You have received <span style={{ fontWeight: 700 }}>{fakeAmount}</span> tokens!</div>
            </Modal.ModalBody>

            {done && <Modal.ModalButtonContainer>
                <Button.GenericButton onClick={closeModal}>Okay</Button.GenericButton>
            </Modal.ModalButtonContainer>}
        </>
    );
}
