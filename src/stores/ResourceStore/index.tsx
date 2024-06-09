import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import Loading from "../../views/Loading";

import { type ResourceStoreContext } from "./resource.d";
import { Resource } from "blacket-types";

const ResourceStoreContext = createContext<ResourceStoreContext>({ resources: [], setResources: () => { }, resourceIdToPath: () => "" });

export function useResource() {
    return useContext(ResourceStoreContext);
}

export function ResourceStoreProvider({ children }: { children: ReactNode }) {
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [resources, setResources] = useState<Resource[]>([]);

    useEffect(() => {
        const fetchData = async () => await window.fetch2.get("/api/data/resources")
            .then((res: Fetch2Response) => setResources(res.data));

        fetchData()
            .then(() => setLoading(false))
            .catch(() => setError(true));
    }, []);

    const resourceIdToPath = (id: number) => resources?.find((resource: Resource) => resource.id === id)?.path ?? null;

    return <ResourceStoreContext.Provider value={{ resources, setResources, resourceIdToPath }}>{!loading ? children : <Loading error={error} message="resources" />}</ResourceStoreContext.Provider>;
}
