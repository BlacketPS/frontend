import { ReactNode, createContext, useContext, useState, useCallback } from "react";

import { type ResourceStoreContext } from "./resource.d";
import { Resource } from "blacket-types";

const ResourceStoreContext = createContext<ResourceStoreContext>({ resources: [], setResources: () => { }, resourceIdToPath: () => "" });

export function useResource() {
    return useContext(ResourceStoreContext);
}

export function ResourceStoreProvider({ children }: { children: ReactNode }) {
    const [resources, setResources] = useState<Resource[]>([]);

    const resourceIdToPath = useCallback((id: number) => resources.find((resource) => resource.id === id)?.path ?? window.errorImage, [resources]);

    return <ResourceStoreContext.Provider value={{ resources, setResources, resourceIdToPath }}>{children}</ResourceStoreContext.Provider>;
}
