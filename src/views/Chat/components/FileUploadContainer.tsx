import { useUser } from "@stores/UserStore";
import { PermissionTypeEnum } from "@blacket/types";
import { useModal } from "@stores/ModalStore";
import { useChat } from "@stores/ChatStore/index";
import { ErrorModal } from "@components/Modals";
import { useUpload } from "@controllers/users/useUpload";
import { MAX_UPLOAD_SIZES } from "@constants/index";
import styles from "../chat.module.scss";

// the styling for this can be redone if needed @XOTlC, just writing it to get the implementation done
export default function FileUploadContainer() {
    const { createModal } = useModal();
    const { user } = useUser();
    const { sendMessage } = useChat();

    const { uploadFileSmall, uploadFileMedium, uploadFileLarge } = useUpload();

    if (!user) return null;

    const onFileChange = async (event: Event) => {
        const files = (event.target as HTMLInputElement).files;

        const uploadedFiles = [];

        if (files && files.length > 0) {
            // TODO: allow multiple files after rewrite is released
            // if (files.length > 5) return createModal(<ErrorModal>Too many files selected, max is 5</ErrorModal>);
            if (files.length > 1) return createModal(<ErrorModal>Only one file can be uploaded at a time</ErrorModal>);

            if (!Array.from(files).every((file) =>
                file.size <= MAX_UPLOAD_SIZES.small ||
                (user.permissions.includes(PermissionTypeEnum.UPLOAD_FILES_MEDIUM) && file.size <= MAX_UPLOAD_SIZES.medium) ||
                (user.permissions.includes(PermissionTypeEnum.UPLOAD_FILES_LARGE) && file.size <= MAX_UPLOAD_SIZES.large)
            ))
                return createModal(<ErrorModal>File too Large, max size is {(user.permissions.includes(PermissionTypeEnum.UPLOAD_FILES_LARGE) ? MAX_UPLOAD_SIZES.large : user.permissions.includes(PermissionTypeEnum.UPLOAD_FILES_MEDIUM) ? MAX_UPLOAD_SIZES.medium : MAX_UPLOAD_SIZES.small) / 1024 / 1024}MB</ErrorModal>);

            for (const file of files) {
                switch (true) {
                    case file.size <= MAX_UPLOAD_SIZES.small:
                        uploadedFiles.push(await uploadFileSmall(file));
                        break;
                    case user.permissions.includes(PermissionTypeEnum.UPLOAD_FILES_MEDIUM) && file.size <= MAX_UPLOAD_SIZES.medium:
                        uploadedFiles.push(await uploadFileMedium(file));
                        break;
                    case user.permissions.includes(PermissionTypeEnum.UPLOAD_FILES_LARGE) && file.size <= MAX_UPLOAD_SIZES.large:
                        uploadedFiles.push(await uploadFileLarge(file));
                        break;
                }

                // TODO: properly implement an attachment system similar to discord's, for now this will do so we can get rewrite released.
                sendMessage(uploadedFiles.map((file) => `${location.origin}/media/uploads${file.data.path}`).join("\n"));
            }
        }
    };

    const handleFileUpload = () => {
        const input = document.createElement("input");

        input.type = "file";
        input.accept = "*/*";
        input.multiple = true;
        input.click();

        input.addEventListener("change", onFileChange);

        input.remove();
    };

    return (
        <div onClick={handleFileUpload} className={styles.fileUploadContainer}>
            <i className="fas fa-upload" />
        </div>
    );
}
