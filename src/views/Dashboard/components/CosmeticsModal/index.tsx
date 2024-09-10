import { useState } from "react";
import { useUser } from "@stores/UserStore/index";
import { useModal } from "@stores/ModalStore/index";
import { Button, Modal } from "@components/index";
import { AvatarCategory, BannerCategory, ColorCategory, FontCategory, TitleCategory } from "./components/index";
import styles from "../../dashboard.module.scss";

import { CosmeticsModalCategory, CosmeticsModalProps } from "../../dashboard.d";
import { PermissionTypeEnum, NotFound } from "blacket-types";

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
                {user.permissions.includes(PermissionTypeEnum.CHANGE_FONT) && <Button.GenericButton onClick={() => setCurrentCategory(CosmeticsModalCategory.FONT)}>Font</Button.GenericButton>}
                {user.permissions.includes(PermissionTypeEnum.CHANGE_NAME_COLOR_TIER_1) && <Button.GenericButton onClick={() => setCurrentCategory(CosmeticsModalCategory.COLOR)}>Color</Button.GenericButton>}
            </div>

            <div className={styles.cosmeticsCategoryContainer}>
                {Category(currentCategory)}
            </div>
        </>
    );
}
