import { useState } from "react";
import { useUser } from "@stores/UserStore/index";
import { useModal } from "@stores/ModalStore/index";
import { Button, Modal } from "@components/index";
import { AvatarCategory, BannerCategory, ColorCategory, FontCategory, GradientCategory, TitleCategory } from "./components/index";
import styles from "../../dashboard.module.scss";

import { CosmeticsModalCategory, CosmeticsModalProps } from "../../dashboard.d";
import { NotFound } from "@blacket/types";

const Category = (category: CosmeticsModalCategory) => {
    switch (category) {
        case CosmeticsModalCategory.AVATAR:
            return <AvatarCategory />;
        case CosmeticsModalCategory.BANNER:
            return <BannerCategory />;
        case CosmeticsModalCategory.TITLE:
            return <TitleCategory />;
        case CosmeticsModalCategory.FONT:
            return <FontCategory />;
        case CosmeticsModalCategory.COLOR:
            return <ColorCategory />;
        case CosmeticsModalCategory.GRADIENT:
            return <GradientCategory />;
        default:
            return <div>{NotFound.DEFAULT}</div>;
    }
};

export default function CosmeticsModal({ category }: CosmeticsModalProps) {
    const [currentCategory, setCurrentCategory] = useState<CosmeticsModalCategory>(category);

    const { user } = useUser();
    const { closeModal } = useModal();

    if (!user) return null;

    return (
        <>
            <Modal.ModalHeader>
                Cosmetics

                <Button.GenericButton onClick={closeModal} className={styles.cosmeticsCloseButton}>
                    <i className="fas fa-times" />
                </Button.GenericButton>
            </Modal.ModalHeader>

            <div className={styles.cosmeticsButtonContainer}>
                <Button.GenericButton onClick={() => setCurrentCategory(CosmeticsModalCategory.AVATAR)}>Avatar</Button.GenericButton>
                <Button.GenericButton onClick={() => setCurrentCategory(CosmeticsModalCategory.BANNER)}>Banner</Button.GenericButton>
                <Button.GenericButton onClick={() => setCurrentCategory(CosmeticsModalCategory.TITLE)}>Title</Button.GenericButton>
                <Button.GenericButton onClick={() => setCurrentCategory(CosmeticsModalCategory.FONT)}>Font</Button.GenericButton>
                <Button.GenericButton onClick={() => setCurrentCategory(CosmeticsModalCategory.COLOR)}>Color</Button.GenericButton>
                <Button.GenericButton onClick={() => setCurrentCategory(CosmeticsModalCategory.GRADIENT)}>Gradient</Button.GenericButton>
            </div>

            <div className={styles.cosmeticsCategoryContainer}>
                {Category(currentCategory)}
            </div>
        </>
    );
}
