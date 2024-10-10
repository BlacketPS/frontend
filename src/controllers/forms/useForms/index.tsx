import { FormsFormEntity } from "@blacket/types";

export function useForms() {
    const getForm = (id: string) => new Promise<FormsFormEntity>((resolve, reject) => window.fetch2.get(`/api/forms/${id}`)
        .then((res: Fetch2Response & { data: FormsFormEntity }) => {
            resolve(res.data);
        })
        .catch(reject));

    return { getForm };
}
