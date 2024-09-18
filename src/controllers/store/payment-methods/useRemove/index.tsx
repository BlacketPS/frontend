import { useUser } from "@stores/UserStore/index";

import { NotFound } from "@blacket/types";

export function useRemove() {
    const { user, setUser } = useUser();

    if (!user) throw new Error(NotFound.UNKNOWN_USER);

    const removePaymentMethod = (id: number) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.delete(`/api/store/payment-methods/${id}`, {})
        .then((res: Fetch2Response) => {
            let paymentMethods = user.paymentMethods;

            paymentMethods = paymentMethods.filter((method) => method.id !== id);
            if (paymentMethods.length > 0) paymentMethods[0].primary = true;

            setUser({ ...user, paymentMethods });

            resolve(res);
        })
        .catch(reject));

    return { removePaymentMethod };
}
