import { ReactNode } from "react";

import { ConfigStoreProvider } from "./ConfigStore";
import { SocketStoreProvider } from "./SocketStore";
import { UserStoreProvider } from "./UserStore";
import { BlookStoreProvider } from "./BlookStore";
import { RarityStoreProvider } from "./RarityStore";
import { PackStoreProvider } from "./PackStore";
import { ItemStoreProvider } from "./ItemStore";
import { TitleStoreProvider } from "./TitleStore";
import { BannerStoreProvider } from "./BannerStore";
import { BadgeStoreProvider } from "./BadgeStore";
import { EmojiStoreProvider } from "./EmojiStore";

export default function StoreWrapper({ children }: { children: ReactNode }) {
    return (
        <ConfigStoreProvider>
            <SocketStoreProvider>
                <UserStoreProvider>
                    <BlookStoreProvider>
                        <RarityStoreProvider>
                            <PackStoreProvider>
                                <ItemStoreProvider>
                                    <TitleStoreProvider>
                                        <BannerStoreProvider>
                                            <BadgeStoreProvider>
                                                <EmojiStoreProvider>
                                                    {children}
                                                </EmojiStoreProvider>
                                            </BadgeStoreProvider>
                                        </BannerStoreProvider>
                                    </TitleStoreProvider>
                                </ItemStoreProvider>
                            </PackStoreProvider>
                        </RarityStoreProvider>
                    </BlookStoreProvider>
                </UserStoreProvider>
            </SocketStoreProvider>
        </ConfigStoreProvider>
    );
}
