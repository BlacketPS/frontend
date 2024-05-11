import { ReactNode } from "react";

import { ConfigStoreProvider } from "./ConfigStore";
import { LeaderboardStoreProvider } from "./LeaderboardStore";
import { LoadingStoreProvider } from "./LoadingStore";
import { SocketStoreProvider } from "./SocketStore";
import { ModalStoreProvider } from "./ModalStore";
import { UserStoreProvider } from "./UserStore";
import { BlookStoreProvider } from "./BlookStore";
import { RarityStoreProvider } from "./RarityStore";
import { PackStoreProvider } from "./PackStore";
import { ItemStoreProvider } from "./ItemStore";
import { TitleStoreProvider } from "./TitleStore";
import { FontStoreProvider } from "./FontStore";
import { BannerStoreProvider } from "./BannerStore";
import { BadgeStoreProvider } from "./BadgeStore";
import { EmojiStoreProvider } from "./EmojiStore";
import { ChatStoreProvider } from "./ChatStore";
import { ContextMenuStoreProvider } from "./ContextMenuStore";
import { CachedUserStoreProvider } from "./CachedUserStore";

export default function StoreWrapper({ children }: { children: ReactNode }) {
    return (
        <ConfigStoreProvider>
            <LeaderboardStoreProvider>
                <LoadingStoreProvider>
                    <BlookStoreProvider>
                        <RarityStoreProvider>
                            <PackStoreProvider>
                                <ItemStoreProvider>
                                    <TitleStoreProvider>
                                        <FontStoreProvider>
                                            <BannerStoreProvider>
                                                <BadgeStoreProvider>
                                                    <EmojiStoreProvider>
                                                        <CachedUserStoreProvider>
                                                            <SocketStoreProvider>
                                                                <UserStoreProvider>
                                                                    <ModalStoreProvider>
                                                                        <ChatStoreProvider>
                                                                            <ContextMenuStoreProvider>
                                                                                {children}
                                                                            </ContextMenuStoreProvider>
                                                                        </ChatStoreProvider>
                                                                    </ModalStoreProvider>
                                                                </UserStoreProvider>
                                                            </SocketStoreProvider>
                                                        </CachedUserStoreProvider>
                                                    </EmojiStoreProvider>
                                                </BadgeStoreProvider>
                                            </BannerStoreProvider>
                                        </FontStoreProvider>
                                    </TitleStoreProvider>
                                </ItemStoreProvider>
                            </PackStoreProvider>
                        </RarityStoreProvider>
                    </BlookStoreProvider>
                </LoadingStoreProvider>
            </LeaderboardStoreProvider>
        </ConfigStoreProvider>
    );
}
