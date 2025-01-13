import { Upload } from "@blacket/types";

interface Response extends Fetch2Response {
    data: Upload
}

export function useUpload() {
    const uploadFileSmall = (file: FormData) => new Promise<Response>((resolve, reject) => window.fetch2.upload("/api/users/upload/small", file)
        .then((res: Response) => resolve(res))
        .catch(reject));

    const uploadFileMedium = (file: FormData) => new Promise<Response>((resolve, reject) => window.fetch2.upload("/api/users/upload/medium", file)
        .then((res: Response) => resolve(res))
        .catch(reject));

    const uploadFileLarge = (file: FormData) => new Promise<Response>((resolve, reject) => window.fetch2.upload("/api/users/upload/large", file)
        .then((res: Response) => resolve(res))
        .catch(reject));

    return { uploadFileSmall, uploadFileMedium, uploadFileLarge };
}
