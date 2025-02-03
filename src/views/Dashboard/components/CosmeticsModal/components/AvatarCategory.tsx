import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoading } from "@stores/LoadingStore/index";
import { useUser } from "@stores/UserStore/index";
import { useData } from "@stores/DataStore/index";
import { useModal } from "@stores/ModalStore/index";
import { SearchBox } from "@components/index";
import { InventoryBlook } from "../../../components";
import { useChangeAvatar } from "@controllers/cosmetics/useChangeAvatar/index";
import { useUpload } from "@controllers/users/useUpload/index";
import styles from "../cosmeticsModal.module.scss";

import { PermissionTypeEnum } from "@blacket/types";

export default function AvatarCategory() {
    const { user, getUserAvatarPath } = useUser();
    if (!user) return null;

    const [search, setSearch] = useState<string>("");

    const { setLoading } = useLoading();
    const { packs, blooks } = useData();
    const { closeModal } = useModal();

    const { changeAvatar, uploadAvatar } = useChangeAvatar();
    const { uploadFileSmall } = useUpload();

    const navigate = useNavigate();

    const hasUserBlook = (blookId: number) => {
        return user.blooks.some((blook) => blook.blookId === blookId);
    };

    const nonPackBlooks = blooks
        .filter((blook) => !blook.packId)
        .sort((a, b) => a.priority - b.priority);

    const onSelect = (blookId: number) => {
        setLoading(true);

        const id = user.blooks.filter((blook) => blook.blookId === blookId)[0]?.id ?? 0;

        changeAvatar({ id })
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    };

    const onFileSelect = (_file: File) => {
        setLoading(true);

        const file = new FormData();
        file.append("file", _file);

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
                <div
                    className={styles.uploadAvatarButton}
                    onClick={openFileSelect}
                >
                    <img src={user.customAvatar ? getUserAvatarPath(user) : window.constructCDNUrl("/content/icons/upload-avatar.png")} />
                </div>
                <InventoryBlook blook={blooks.find((blook) => blook.id === 1)!} quantity={0} onClick={() => onSelect(0)} data-selectable={true} />

                {packs.sort((a, b) => a.priority - b.priority).map((pack) => {
                    const filteredBlooks = blooks
                        .filter((blook) => blook.packId === pack.id)
                        .filter((blook) => blook.name.toLowerCase().includes(search.toLowerCase()))
                        .sort((a, b) => a.priority - b.priority);

                    if (filteredBlooks.length > 0) return filteredBlooks
                        .filter((blook) => blook.name.toLowerCase().includes(search.toLowerCase()))
                        .map((blook) => hasUserBlook(blook.id) && <InventoryBlook key={blook.id} blook={blook} quantity={0} onClick={() => onSelect(blook.id)} data-selectable={true} />);
                })}

                {nonPackBlooks
                    .filter((blook) => blook.name.toLowerCase().includes(search.toLowerCase()))
                    .map((blook) => hasUserBlook(blook.id) && <InventoryBlook key={blook.id} blook={blook} quantity={0} onClick={() => onSelect(blook.id)} data-selectable={true} />)
                }
            </div>
        </>
    );
}
