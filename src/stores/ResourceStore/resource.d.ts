import { Resource } from "@blacket/types";

export interface ResourceStoreContext {
    resources: Resource[];
    setResources: (resources: Resource[]) => void;
    resourceIdToPath: (id: number) => string;
}
