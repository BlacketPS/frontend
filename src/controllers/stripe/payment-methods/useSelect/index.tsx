import { useUser } from "@stores/UserStore/index";

import { NotFound } from "@blacket/types";

export function useSelect() {
    const { user, setUser } = useUser();

    if (!user) throw new Error(NotFound.UNKNOWN_USER);

    const selectPaymentMethod = (id: number) => new Promise<Fetch2Response>((resolve, reject) => window.fetch2.put(`/api/stripe/payment-methods/${id}`, {})
        .then((res: Fetch2Response) => {
            const paymentMethods = user.paymentMethods.map((method) => {
                method.primary = method.id === id;

                return method;
            });

            setUser({ ...user, paymentMethods });

            resolve(res);
        })
        .catch(reject));

    return { selectPaymentMethod };
}
