import { ReactNode } from "react";

import { ConfigStoreProvider } from "./ConfigStore";
import { LoadingStoreProvider } from "./LoadingStore";
import { SocketStoreProvider } from "./SocketStore";
import { ModalStoreProvider } from "./ModalStore";
import { UserStoreProvider } from "./UserStore";
import { BlookStoreProvider } from "./BlookStore";
import { RarityStoreProvider } from "./RarityStore";
import { PackStoreProvider } from "./PackStore";
import { ItemStoreProvider } from "./ItemStore";
import { TitleStoreProvider } from "./TitleStore";
import { BannerStoreProvider } from "./BannerStore";
import { BadgeStoreProvider } from "./BadgeStore";
import { EmojiStoreProvider } from "./EmojiStore";
import { LeaderboardStoreProvider } from "./LeaderboardStore";

export default function StoreWrapper({ children }: { children: ReactNode }) {
    return (
        <ConfigStoreProvider>
            <LoadingStoreProvider>
                <SocketStoreProvider>
                    <ModalStoreProvider>
                        <UserStoreProvider>
                            <BlookStoreProvider>
                                <RarityStoreProvider>
                                    <PackStoreProvider>
                                        <ItemStoreProvider>
                                            <TitleStoreProvider>
                                                <BannerStoreProvider>
                                                    <BadgeStoreProvider>
                                                        <EmojiStoreProvider>
                                                            <LeaderboardStoreProvider>
                                                                {children}
                                                            </LeaderboardStoreProvider>
                                                        </EmojiStoreProvider>
                                                    </BadgeStoreProvider>
                                                </BannerStoreProvider>
                                            </TitleStoreProvider>
                                        </ItemStoreProvider>
                                    </PackStoreProvider>
                                </RarityStoreProvider>
                            </BlookStoreProvider>
                        </UserStoreProvider>
                    </ModalStoreProvider>
                </SocketStoreProvider>
            </LoadingStoreProvider>
        </ConfigStoreProvider>
    );
}
