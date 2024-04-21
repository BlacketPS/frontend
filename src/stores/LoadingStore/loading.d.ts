export interface LoadingStoreContext {
    loading: boolean | string;
    setLoading: (loading: boolean | string) => void;
}
