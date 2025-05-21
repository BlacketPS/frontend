import { Navigate } from "react-router-dom";
import { useUser } from "@stores/UserStore/index";
import { ZoeySign } from "@components/index";

export default function Experiments() {
    const { user } = useUser();
    if (!user) return <Navigate to="/login" />;

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".png, .jpg, .jpeg, .gif";
    fileInput.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const upload = await window.fetch2.get(`/api/s3/upload/small?filename=${file.name}&mimetype=${file.type}`);

        const formData = new FormData();
        Object.entries(upload.data.fields).forEach(([k, v]) => formData.append(k, v as string));
        formData.append("file", file);

        const s3Upload = await fetch(upload.data.url, {
            method: "POST",
            body: formData
        });

        if (s3Upload.ok) {
            const verify = await window.fetch2.post("/api/s3/verify", {
                uploadId: upload.data.fields.key.split("/")[2]
            });

            console.log(verify);
        } else {
            console.error("Upload failed");
        }
    };

    return (
        <>
            {/* <ZoeySign style={{ width: "400px" }}>
                blooket
            </ZoeySign> */}
            <div style={{ width: "400px", height: "400px", backgroundColor: "red" }} onClick={() => fileInput.click()}>
                click me
            </div>
        </>
    );
}
