import { StripeCreatePaymentMethodDto, StripeCreateSetupIntentEntity } from "@blacket/types";

export function useCreateSetupIntent() {
    const createSetupIntent = (dto: StripeCreatePaymentMethodDto) => new Promise<StripeCreateSetupIntentEntity>((resolve, reject) => window.fetch2.post("/api/stripe/setup-intent", dto)
        .then((res: Fetch2Response & { data: StripeCreateSetupIntentEntity }) => resolve(res.data))
        .catch(reject));

    return { createSetupIntent };
}