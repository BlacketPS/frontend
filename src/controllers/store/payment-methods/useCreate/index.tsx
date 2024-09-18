import { useUser } from "@stores/UserStore/index";

import { NotFound, StoreCreatePaymentMethodDto } from "@blacket/types";

export function useCreate() {
    const { user, setUser } = useUser();

    if (!user) throw new Error(NotFound.UNKNOWN_USER);

    const createPaymentMethod = (dto: StoreCreatePaymentMethodDto) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.post("/api/store/payment-methods/create", dto)
        .then((res: Fetch2Response) => {
            const paymentMethods = user.paymentMethods;

            paymentMethods.push(res.data);
            paymentMethods.forEach((method) => method.id === res.data.id ? method.primary = true : method.primary = false);

            setUser({ ...user, paymentMethods });

            resolve(res);
        })
        .catch(reject));

    return { createPaymentMethod };
}
