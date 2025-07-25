import { ReactNode } from "react";
import { ConfigLoader } from "@stores/ConfigStore/ConfigLoader";
import { DataLoader } from "@stores/DataStore/components/index";
import { LoadingWrapper } from "@stores/LoadingStore/components/index";
import { SocketWrapper } from "@stores/SocketStore/components";
import { ModalUI } from "@stores/ModalStore/components/index";
import { ToastUI } from "@stores/ToastStore/components";
import { InsanePullUI } from "@stores/InsanePullStore/components/index";
import { useToastLoop } from "@stores/ToastStore/useToastLoop";
import { useContextMenu } from "@stores/ContextMenuStore/index";

export default function Wrapper({ children }: { children: ReactNode }) {
    useToastLoop();

    const { render } = useContextMenu();

    return (
        <ConfigLoader>
            <DataLoader>
                <LoadingWrapper>
                    <SocketWrapper>
                        <ModalUI />
                        <ToastUI />
                        <InsanePullUI />

                        {render()}

                        {children}
                    </SocketWrapper>
                </LoadingWrapper>
            </DataLoader>
        </ConfigLoader>
    );
}
