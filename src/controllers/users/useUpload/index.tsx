import { S3UploadEntity, Upload } from "@blacket/types";

interface Response extends Fetch2Response {
    data: Upload
}

enum UploadType {
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large"
}

// fileInput.onchange = async (e) => {
//     const file = (e.target as HTMLInputElement).files?.[0];
//     if (!file) return;

//     const upload = await window.fetch2.get(`/api/s3/upload/small?filename=${file.name}&mimetype=${file.type}`);

//     const formData = new FormData();
//     Object.entries(upload.data.fields).forEach(([k, v]) => formData.append(k, v as string));
//     formData.append("file", file);

//     const s3Upload = await fetch(upload.data.url, {
//         method: "POST",
//         body: formData
//     });

//     if (s3Upload.ok) {
//         const verify = await window.fetch2.post("/api/s3/verify", {
//             uploadId: upload.data.fields.key.split("/")[2]
//         });

//         console.log(verify);
//     } else {
//         console.error("Upload failed");
//     }
// };


const genericUpload = (file: File, type: UploadType) => new Promise<Response>((resolve, reject) => window.fetch2.get(`/api/s3/upload/${type}?filename=${file.name}&mimetype=${file.type}`)
    .then(async (res: Fetch2Response & { data: S3UploadEntity }) => {
        const formData = new FormData();
        Object.entries(res.data.fields).forEach(([k, v]) => formData.append(k, v as string));
        formData.append("file", file);

        const s3Upload = await fetch(res.data.url, {
            method: "POST",
            body: formData
        });

        if (!s3Upload.ok) return reject(new Error("upload failed"));

        const upload = await window.fetch2.post("/api/s3/verify", {
            uploadId: res.data.fields.key.split("/")[2]
        });
        if (!upload.ok) return reject(new Error("verification failed"));

        resolve(upload);
    })
    .catch((err) => {
        console.error(err);

        reject(err);
    }));

export function useUpload() {
    const uploadFileSmall = (file: File) => new Promise<Response>((resolve, reject) => {
        genericUpload(file, UploadType.SMALL)
            .then((res: Response) => resolve(res))
            .catch(reject);
    });


    const uploadFileMedium = (file: File) => new Promise<Response>((resolve, reject) => {
        genericUpload(file, UploadType.MEDIUM)
            .then((res: Response) => resolve(res))
            .catch(reject);
    });

    const uploadFileLarge = (file: File) => new Promise<Response>((resolve, reject) => {
        genericUpload(file, UploadType.LARGE)
            .then((res: Response) => resolve(res))
            .catch(reject);
    });

    return { uploadFileSmall, uploadFileMedium, uploadFileLarge };
}
