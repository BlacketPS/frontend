import { ComponentType, ReactNode } from "react";

import { ConfigStoreProvider } from "./ConfigStore";
import { LoadingStoreProvider } from "./LoadingStore";
import { ResourceStoreProvider } from "./ResourceStore";
import { LeaderboardStoreProvider } from "./LeaderboardStore";
import { SocketStoreProvider } from "./SocketStore";
import { ModalStoreProvider } from "./ModalStore";
import { UserStoreProvider } from "./UserStore";
import { DataStoreProvider } from "./DataStore";
import { ChatStoreProvider } from "./ChatStore";
import { ContextMenuStoreProvider } from "./ContextMenuStore";
import { CachedUserStoreProvider } from "./CachedUserStore";
import { AuctionHouseStoreProvider } from "./AuctionHouseStore";
import { ToastStoreProvider } from "./ToastStore";

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
                [UserStoreProvider, {}],
                [DataStoreProvider, {}],
                [CachedUserStoreProvider, {}],
                [SocketStoreProvider, {}],
                [ToastStoreProvider, {}],
                [AuctionHouseStoreProvider, {}],
                [ModalStoreProvider, {}],
                [ChatStoreProvider, {}],
                [ContextMenuStoreProvider, {}]
            ]}
        >
            {children}
        </ProviderComposer>
    );
}
