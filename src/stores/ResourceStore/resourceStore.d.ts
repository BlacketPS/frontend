import { Resource } from "@blacket/types";

export interface ResourceStore {
    resources: Resource[];
    setResources: (resources: Resource[]) => void;
    resourceIdToPath: (id: number) => string;
}
