import { ReactNode } from "react";
import { ConfigLoader } from "@stores/ConfigStore/ConfigLoader";
import { DataLoader } from "@stores/DataStore/components/index";
import { LoadingWrapper } from "@stores/LoadingStore/components/index";
import { SocketWrapper } from "@stores/SocketStore/components/index";
import { ChatWrapper } from "@stores/ChatStore/components/index";
import { ModalUI } from "@stores/ModalStore/components/index";
import { ToastUI } from "@stores/ToastStore/components";
import { InsanePullUI } from "@stores/InsanePullStore/components/index";
import { SoundDefiner } from "@stores/SoundStore/components/index";
import { useToastLoop } from "@stores/ToastStore/useToastLoop";
import { useContextMenu } from "@stores/ContextMenuStore/index";

export default function Wrapper({ children }: { children: ReactNode }) {
    useToastLoop();

    const { render } = useContextMenu();

    return (
        <>
            <ConfigLoader>
                <DataLoader>
                    <LoadingWrapper>
                        <SocketWrapper>
                            <ChatWrapper>
                                <ModalUI />
                                <ToastUI />
                                <InsanePullUI />

                                {/* context menu */}
                                {render()}

                                {children}
                            </ChatWrapper>
                        </SocketWrapper>
                    </LoadingWrapper>
                </DataLoader>
            </ConfigLoader>

            <SoundDefiner />
        </>
    );
}
