import { useModal } from "@stores/ModalStore/index";
import { useResource } from "@stores/ResourceStore/index";
import { useData } from "@stores/DataStore/index";
import { useUser } from "@stores/UserStore/index";
import { Modal, Button, Markdown } from "@components/index";
import styles from "./productModal.module.scss";

import { ProductModalProps } from "../../store.d";

export default function ProductModal({ product }: ProductModalProps) {
    const { closeModal, createModal } = useModal();
    const { resourceIdToPath } = useResource();
    const { fontIdToName } = useData();
    const { user } = useUser();

    if (!user) return null;

    if (!product) return null;
    if (!product.description) product.description = "No description available.";

    return (
        <>
            <Modal.ModalHeader>
                <span style={{
                    fontFamily: product.fontId ? fontIdToName(product.fontId) : ""
                }}>
                    {product.name}
                </span>
            </Modal.ModalHeader >

            <Modal.ModalBody>
                <div className={styles.productInformationContainer}>
                    <div className={styles.productLeft}>
                        <Markdown user={{
                            ...user,
                            fontId: product.fontId ?? user.fontId
                        }}>
                            {product.description}
                        </Markdown>
                    </div>

                    <div className={styles.productRight}>
                        <div className={styles.productImageContainer}>
                            <img className={styles.productImage} src={resourceIdToPath(product.imageId)} alt={product.name} />
                        </div>
                    </div>
                </div>
            </Modal.ModalBody>

            <Modal.ModalButtonContainer>
                <Button.GenericButton onClick={() => {
                    closeModal();

                    createModal(<Modal.PurchaseProductModal product={product} />);
                }} type="submit">${product.price} USD</Button.GenericButton>
                <Button.GenericButton onClick={closeModal}>Close</Button.GenericButton>
            </Modal.ModalButtonContainer>
        </>
    );
}
