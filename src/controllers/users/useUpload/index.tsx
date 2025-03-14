import { Upload } from "@blacket/types";

interface Response extends Fetch2Response {
    data: Upload
}

export function useUpload() {
    const uploadFileSmall = (file: File) => new Promise<Response>((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file);

        window.fetch2.upload("/api/users/upload/small", formData)
            .then((res: Response) => resolve(res))
            .catch(reject);
    });

    const uploadFileMedium = (file: File) => new Promise<Response>((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file);

        window.fetch2.upload("/api/users/upload/medium", formData)
            .then((res: Response) => resolve(res))
            .catch(reject);
    });

    const uploadFileLarge = (file: File) => new Promise<Response>((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file);

        window.fetch2.upload("/api/users/upload/large", formData)
            .then((res: Response) => resolve(res))
            .catch(reject);
    });

    return { uploadFileSmall, uploadFileMedium, uploadFileLarge };
}
