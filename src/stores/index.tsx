import { ComponentType, ReactNode } from "react";

import { ConfigStoreProvider } from "./ConfigStore";
import { LoadingStoreProvider } from "./LoadingStore";
import { ResourceStoreProvider } from "./ResourceStore";
import { LeaderboardStoreProvider } from "./LeaderboardStore";
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

const ProviderComposer = ({ providers, children }: { providers: [ComponentType<any>, any][], children: ReactNode }) => {
    for (let i = providers.length - 1; i >= 0; --i) {
        const [Provider, props] = providers[i];
        children = <Provider {...props}>{children}</Provider>;
    }

    return children;
};

export default function StoreWrapper({ children }: { children: ReactNode }) {
    return (
        <ProviderComposer
            providers={[
                [ConfigStoreProvider, {}],
                [LoadingStoreProvider, {}],
                [LeaderboardStoreProvider, {}],
                [ResourceStoreProvider, {}],
                [BlookStoreProvider, {}],
                [RarityStoreProvider, {}],
                [PackStoreProvider, {}],
                [ItemStoreProvider, {}],
                [TitleStoreProvider, {}],
                [FontStoreProvider, {}],
                [BannerStoreProvider, {}],
                [BadgeStoreProvider, {}],
                [EmojiStoreProvider, {}],
                [CachedUserStoreProvider, {}],
                [SocketStoreProvider, {}],
                [UserStoreProvider, {}],
                [ModalStoreProvider, {}],
                [ChatStoreProvider, {}],
                [ContextMenuStoreProvider, {}]
            ]}
        >
            {children}
        </ProviderComposer>
    );
}
