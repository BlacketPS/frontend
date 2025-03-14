import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoading } from "@stores/LoadingStore/index";
import { useUser } from "@stores/UserStore/index";
import { useData } from "@stores/DataStore/index";
import { useModal } from "@stores/ModalStore/index";
import { SearchBox } from "@components/index";
import { Banner } from ".";
import { useChangeBanner } from "@controllers/cosmetics/useChangeBanner/index";
import { useUpload } from "@controllers/users/useUpload/index";
import styles from "../cosmeticsModal.module.scss";

import { PermissionTypeEnum } from "@blacket/types";

export default function BannerCategory() {
    const { user, getUserBannerPath } = useUser();
    if (!user) return null;

    const [search, setSearch] = useState<string>("");

    const { setLoading } = useLoading();
    const { banners } = useData();
    const { closeModal } = useModal();

    const { changeBanner, uploadBanner } = useChangeBanner();
    const { uploadFileSmall } = useUpload();

    const navigate = useNavigate();

    const onSelect = (id: number) => {
        setLoading(true);

        changeBanner({ bannerId: id })
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    };

    const onFileSelect = (file: File) => {
        setLoading(true);

        uploadFileSmall(file)
            .then((res) => {
                uploadBanner({ uploadId: res.data.id })
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
                placeholder="Search for a banner..."
                onChange={(e) => setSearch(e.target.value)}
                containerProps={{
                    style: { padding: "unset", margin: "unset", width: "100%", marginBottom: "10px", boxShadow: "unset" }
                }}
            />

            <div className={styles.holder} data-column={true}>
                <div className={styles.bannerContainer} onClick={openFileSelect}>
                    <img className={styles.bannerImage} src={user.customBanner ? getUserBannerPath(user) : window.constructCDNUrl("/content/icons/upload-banner.png")} />
                    <div className={styles.bannerName}>Upload Banner</div>
                </div>

                <Banner banner={banners.find((banner) => banner.id === 1)!} onClick={() => onSelect(1)} />

                {banners
                    .filter((banner) => banner.name.toLowerCase().includes(search.toLowerCase()))
                    .sort((a, b) => a.priority - b.priority)
                    .map((banner) => (user.banners as number[]).includes(banner.id) && <Banner key={banner.id} banner={banner} onClick={() => onSelect(banner.id)} />)
                }
            </div>
        </>
    );
}
