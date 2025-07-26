import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoading } from "@stores/LoadingStore/index";
import { useUser } from "@stores/UserStore/index";
import { useData } from "@stores/DataStore/index";
import { useModal } from "@stores/ModalStore/index";
import { SearchBox, InventoryBlook, ItemContainer } from "@components/index";
import { useChangeAvatar } from "@controllers/cosmetics/useChangeAvatar/index";
import { useUpload } from "@controllers/users/useUpload/index";
import styles from "../cosmeticsModal.module.scss";

import { PermissionTypeEnum, UserBlook } from "@blacket/types";

export default function AvatarCategory() {
    const { user, getUserAvatarPath } = useUser();
    if (!user) return null;

    const [search, setSearch] = useState<string>("");

    const { setLoading } = useLoading();
    const { blooks } = useData();
    const { closeModal } = useModal();

    const { changeAvatar, uploadAvatar } = useChangeAvatar();
    const { uploadFileSmall } = useUpload();

    const navigate = useNavigate();

    const onSelect = (blookId: number, shiny: boolean = false) => {
        setLoading(true);

        const id = user.blooks.find((blook) => blook.blookId === blookId && blook.shiny === shiny)?.id ?? 0;

        changeAvatar({ id })
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    };

    const onFileSelect = (file: File) => {
        setLoading(true);

        uploadFileSmall(file)
            .then((res) => {
                uploadAvatar({ uploadId: res.data.id })
                    .finally(() => setLoading(false));
            })
            .catch(() => setLoading(false));
    };

    const openFileSelect = () => {
        if (!user.hasPermission(PermissionTypeEnum.CUSTOM_AVATAR)) return closeModal(), navigate("/store");

        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".png, .jpg, .jpeg, .gif, .webp";
        input.onchange = () => {
            if (!input.files) return;

            onFileSelect(input.files[0]);
        };

        input.click();
    };

    return (
        <>
            <SearchBox
                placeholder="Search for a blook..."
                onChange={(e) => setSearch(e.target.value)}
                containerProps={{
                    style: { padding: "unset", margin: "unset", width: "100%", marginBottom: "10px", boxShadow: "unset" }
                }}
            />

            <div className={styles.holder}>
                <div style={{ display: "flex", gap: 10, padding: 10 }}>
                    <div
                        className={styles.uploadAvatarButton}
                        onClick={openFileSelect}
                    >
                        <img src={user.customAvatar ? getUserAvatarPath(user) : window.constructCDNUrl("/content/icons/upload-avatar.png")} />
                    </div>

                    <InventoryBlook blook={blooks.find((blook) => blook.id === 1)!} amount={0} onClick={() => onSelect(0)} data-selectable={true} />
                </div>

                <ItemContainer
                    user={user}
                    onClick={(item) => {
                        const blook = item.item as UserBlook;

                        onSelect(blook.blookId, blook.shiny);
                    }}
                    options={{
                        showBlooks: true,
                        showItems: false,
                        showPacks: false,
                        showShiny: true,
                        showLocked: false,

                        searchQuery: search
                    }}
                />
            </div>
        </>
    );
}
