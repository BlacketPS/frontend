import { useEffect, useRef, useState } from "react";
import styles from "../chat.module.scss";
import { useUpload } from "@controllers/users/useUpload";
import { useUser } from "@stores/UserStore";
import { PermissionTypeEnum } from "@blacket/types";
import { useModal } from "@stores/ModalStore";
import { ErrorModal } from "@components/Modals";
import { useChat } from "@stores/ChatStore/index";

// the styling for this can be redone if needed @XOTlC, just writing it to get the implementation done
export default function FileUploadContainer() {
    const { uploadFileSmall, uploadFileMedium, uploadFileLarge } = useUpload();
    const modal = useModal();
    const { user } = useUser();
    const { sendMessage } = useChat();
    const input = useRef<HTMLInputElement>(document.createElement("input"));
    const maxUploadSizes = {
        small: 1024 * 1024 * 2,
        medium: 1024 * 1024 * 4,
        large: 1024 * 1024 * 8
    }

    if (!user) return null;


    const onFileChange = async (event: Event) => {
        const files = (event.target as HTMLInputElement).files;
        const uploadedFiles = [];

        if (files && files.length > 0) {
            if (files.length > 5) {
                modal.createModal(<ErrorModal>Too many files selected, max is 5</ErrorModal>);
                return;
            }

            if (!Array.from(files).every(file =>
                file.size <= maxUploadSizes.small ||
                (user.permissions.includes(PermissionTypeEnum.UPLOAD_FILES_MEDIUM) && file.size <= maxUploadSizes.medium) ||
                (user.permissions.includes(PermissionTypeEnum.UPLOAD_FILES_LARGE) && file.size <= maxUploadSizes.large)
            )) {
                modal.createModal(<ErrorModal>File too Large, max size is {(user.permissions.includes(PermissionTypeEnum.UPLOAD_FILES_LARGE) ? maxUploadSizes.large : user.permissions.includes(PermissionTypeEnum.UPLOAD_FILES_MEDIUM) ? maxUploadSizes.medium : maxUploadSizes.small) / 1024 / 1024}MB</ErrorModal>);
                return;
            }

            for (const file of files) {
                if (file.size <= maxUploadSizes.small) {
                    const uploadedFile = await uploadFileSmall(file);
                    uploadedFiles.push(uploadedFile);
                } else if (user.permissions.includes(PermissionTypeEnum.UPLOAD_FILES_MEDIUM) && file.size <= maxUploadSizes.medium) {
                    const uploadedFile = await uploadFileMedium(file);
                    uploadedFiles.push(uploadedFile);
                } else if (user.permissions.includes(PermissionTypeEnum.UPLOAD_FILES_LARGE) && file.size <= maxUploadSizes.large) {
                    const uploadedFile = await uploadFileLarge(file);
                    uploadedFiles.push(uploadedFile);
                }
            }
            // TODO: properly implement an attachment system similar to discord's, for now this will do so we can get rewrite released.


            // goodluck to anyone who wants to debug this stupid bullshit im not doing it
            // sendMessage(uploadedFiles.map(file => `${location.origin}/media/uploads${file.data.path}`).join("\n"));
        }


    }

    const handleFileUpload = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        input.current.type = "file";
        input.current.accept = "*/*";
        input.current.multiple = true;
        input.current.click();
    }

    useEffect(() => {
        input.current.addEventListener("change", onFileChange);

        return () => {
            input.current.removeEventListener("change", onFileChange);
        }
    }, []);

    return (
        <div onClick={handleFileUpload} className={styles.fileUploadContainer}>
            <i className="fas fa-upload" />
        </div>
    );
}
