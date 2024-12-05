import { Navigate } from "react-router-dom";
import { useUser } from "@stores/UserStore/index";
import { useModal } from "@stores/ModalStore/index";
import { Button, Dropdown, Modal } from "@components/index";
import { useEffect, useState } from "react";
import { Product } from "@blacket/types";

export default function Experiments() {
    const { user } = useUser();
    const { createModal } = useModal();

    if (!user) return <Navigate to="/login" />;

    const [options, setOptions] = useState<Product[]>([]);
    const [selectedOption, setSelectedOption] = useState<Product | null>(null);

    useEffect(() => {
        window.fetch2.get("/api/data/products").then((res) => {
            setOptions(res.data);
        });
    }, []);

    const openUploadDialog = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = () => {
            if (!input.files || !input.files[0]) return;

            const formData = new FormData();
            formData.append("file", input.files[0]);

            window.fetch2.upload("/api/users/upload", formData).then((res) => {
                console.log(res);
            });
        };

        input.click();
    };

    return (
        <>
            <Dropdown
                onChange={(value: number) => {
                    setSelectedOption(options.find((p) => p.id === value) ?? null);
                }}
                options={[
                    { label: "Select a product...", value: null },
                    ...options.map((p) => ({ label: p.name, value: p.id }))
                ]}
            >
                Select a product...
            </Dropdown>

            {selectedOption && <Button.ClearButton
                onClick={() => {
                    createModal(<Modal.PurchaseProductModal product={selectedOption} />);
                }}
            >
                Open Product Modal
            </Button.ClearButton>}

            <Button.ClearButton onClick={openUploadDialog}>Upload Image</Button.ClearButton>
        </>
    );

}
