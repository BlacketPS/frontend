export function useRemoveAuction() {
    const removeAuction = (id: number) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.delete(`/api/auctions/${id}`, {})
        .then((res: Fetch2Response) => resolve(res))
        .catch(reject));

    return { removeAuction };
}
