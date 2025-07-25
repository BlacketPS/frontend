export interface LoadingStore {
    loading: boolean | string;
    setLoading: (loading: boolean | string) => void;
}
